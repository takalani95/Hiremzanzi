const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth');
const { sendApplicationConfirmationEmail, sendEmployerNotificationEmail, sendApplicationStatusEmail } = require('../utils/emailService');

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Job seekers only)
router.post('/', protect, async (req, res, next) => {
  try {
    const { jobId } = req.body;
    
    // Validate job ID
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId).populate('postedBy', 'email name');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      userId: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        error: 'You have already applied for this job'
      });
    }

    // Handle CV file upload
    let cvFileName = null;
    if (req.files && req.files.cv) {
      const cvFile = req.files.cv;
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileExt = cvFile.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExt)) {
        return res.status(400).json({ error: 'Only PDF, DOC, and DOCX files are allowed' });
      }

      if (cvFile.size > 5 * 1024 * 1024) { // 5MB limit
        return res.status(400).json({ error: 'CV file must be less than 5MB' });
      }

      // Save file with timestamp to avoid duplicates
      cvFileName = `cv_${req.user.id}_${Date.now()}_${cvFile.name}`;
      const uploadPath = require('path').join(__dirname, '../uploads', cvFileName);
      
      // Create uploads directory if it doesn't exist
      const fs = require('fs');
      const uploadsDir = require('path').join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      await cvFile.mv(uploadPath);
    }

    // Create application
    const application = await Application.create({
      jobId,
      userId: req.user.id,
      resumeUrl: cvFileName || null,
      coverLetter: null // No cover letter required
    });

    // Send confirmation email to applicant
    await sendApplicationConfirmationEmail(
      req.user.email,
      req.user.name,
      job.title,
      job.company
    );

    // Send notification email to employer (admin)
    const applicationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/job-management`;
    await sendEmployerNotificationEmail(
      job.postedBy.email,
      req.user.name,
      job.title,
      applicationUrl
    );

    res.status(201).json({
      success: true,
      application,
      message: 'Application submitted successfully! Check your email for confirmation.'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/applications
// @desc    Get all applications (admin only) or user's applications
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    let applications;

    if (req.user.role === 'admin') {
      // Admin can see all applications
      applications = await Application.find()
        .populate('jobId', 'title company location')
        .populate('userId', 'name email')
        .sort({ appliedAt: -1 });
    } else {
      // Users see only their applications
      applications = await Application.find({ userId: req.user.id })
        .populate('jobId', 'title company location salary')
        .sort({ appliedAt: -1 });
    }

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/applications/:jobId
// @desc    Get all applications for a specific job (admin only)
// @access  Private (Admin)
router.get('/job/:jobId', protect, isAdmin, async (req, res, next) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email')
      .populate('jobId', 'title company')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application status (admin only)
// @access  Private (Admin)
router.put('/:id', [
  protect,
  isAdmin,
  body('status').isIn(['pending', 'reviewed', 'accepted', 'rejected']).withMessage('Invalid status'),
  body('notes').optional().trim()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let application = await Application.findById(req.params.id)
      .populate('userId', 'email name')
      .populate('jobId', 'title');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const oldStatus = application.status;
    const newStatus = req.body.status;

    application = await Application.findByIdAndUpdate(
      req.params.id,
      { 
        status: newStatus,
        notes: req.body.notes || application.notes,
        reviewedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('userId', 'email name').populate('jobId', 'title');

    // Send status update email to applicant if status changed
    if (oldStatus !== newStatus) {
      await sendApplicationStatusEmail(
        application.userId.email,
        application.userId.name,
        application.jobId.title,
        newStatus
      );
    }

    res.json({
      success: true,
      application,
      message: `Application status updated to ${newStatus}`
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/applications/:id/cv
// @desc    Download CV file for an application
// @access  Private (Admin or application owner)
router.get('/:id/cv', protect, async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check authorization
    if (application.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to view this application'
      });
    }

    // Check if CV exists
    if (!application.resumeUrl) {
      return res.status(404).json({
        error: 'No CV file found for this application'
      });
    }

    const path = require('path');
    const fs = require('fs');
    const cvPath = path.join(__dirname, '../uploads', application.resumeUrl);

    // Verify file exists
    if (!fs.existsSync(cvPath)) {
      return res.status(404).json({
        error: 'CV file not found on server'
      });
    }

    // Send file
    res.download(cvPath, application.resumeUrl, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error downloading file' });
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete an application
// @access  Private (Owner or Admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check ownership
    if (application.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to delete this application'
      });
    }

    // Delete CV file if it exists
    if (application.resumeUrl) {
      const path = require('path');
      const fs = require('fs');
      const cvPath = path.join(__dirname, '../uploads', application.resumeUrl);
      
      if (fs.existsSync(cvPath)) {
        try {
          fs.unlinkSync(cvPath);
        } catch (err) {
          console.error('Error deleting CV file:', err);
        }
      }
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Application deleted'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
