const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -savedJobs -appliedJobs');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    next(error);
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', protect, isAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
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

// @route   GET /api/users/saved-jobs
// @desc    Get user's saved jobs
// @access  Private
router.get('/me/saved-jobs', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'savedJobs',
        populate: { path: 'postedBy', select: 'name company' }
      });

    res.json({
      success: true,
      savedJobs: user.savedJobs
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/applied-jobs
// @desc    Get user's applied jobs
// @access  Private
router.get('/me/applied-jobs', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'appliedJobs.job',
        populate: { path: 'postedBy', select: 'name company' }
      });

    res.json({
      success: true,
      appliedJobs: user.appliedJobs
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/me/profile
// @desc    Update user profile
// @access  Private
router.put('/me/profile', [
  protect,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().trim(),
  body('location').optional().trim(),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('skills').optional().isArray().withMessage('Skills must be an array')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, location, bio, skills } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (skills) updateData.skills = skills;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
