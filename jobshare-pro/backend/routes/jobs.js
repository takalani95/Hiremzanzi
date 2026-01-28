const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { protect, isEmployer, isAdmin } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs with filters and pagination
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      location,
      jobType,
      category,
      experienceLevel,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = { status: 'active' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (location) query.location = new RegExp(location, 'i');
    if (jobType) query.jobType = jobType;
    if (category) query.category = category;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    // Pagination
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    // Execute query
    const jobs = await Job.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('postedBy', 'name company');

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name company email phone');

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      job
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        error: 'Job not found'
      });
    }
    next(error);
  }
});

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Admin only)
router.post('/', [
  protect,
  isAdmin,
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('description').isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship', 'Learnerships']).withMessage('Invalid job type'),
  body('category').isIn(['Technology', 'Marketing', 'Sales', 'Design', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Other']).withMessage('Invalid category'),
  body('contactEmail').isEmail().withMessage('Please provide a valid email')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const jobData = {
      ...req.body,
      postedBy: req.user.id
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job posting
// @access  Private (Owner or Admin)
router.put('/:id', protect, async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job posting
// @access  Private (Owner or Admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply to a job
// @access  Private (Job Seeker)
router.post('/:id/apply', protect, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      app => app.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        error: 'You have already applied to this job'
      });
    }

    const { coverLetter, resume } = req.body;

    job.applications.push({
      user: req.user.id,
      coverLetter,
      resume
    });

    await job.save();

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/jobs/my/posted
// @desc    Get jobs posted by current user
// @access  Private (Employer)
router.get('/my/posted', protect, isEmployer, async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/jobs/:id/save
// @desc    Save/bookmark a job
// @access  Private
router.post('/:id/save', protect, async (req, res, next) => {
  try {
    const User = require('../models/User');
    
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const user = await User.findById(req.user.id);
    
    if (user.savedJobs.includes(req.params.id)) {
      return res.status(400).json({ error: 'Job already saved' });
    }

    user.savedJobs.push(req.params.id);
    await user.save();

    res.json({
      success: true,
      message: 'Job saved successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
