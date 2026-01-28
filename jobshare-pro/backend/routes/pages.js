const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/pages
// @desc    Get all pages
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const pages = await Page.find({ isActive: true }).sort({ order: 1 });
    res.json({
      success: true,
      pages
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/pages/:slug
// @desc    Get single page by slug
// @access  Public
router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json({
      success: true,
      page
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/pages
// @desc    Create a new page
// @access  Private (Admin only)
router.post('/', protect, isAdmin, async (req, res, next) => {
  try {
    const { title, content, description, order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Page title is required' });
    }

    const page = await Page.create({
      title,
      content: content || '',
      description: description || '',
      order: order || 0
    });

    res.status(201).json({
      success: true,
      page
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A page with this title already exists' });
    }
    next(error);
  }
});

// @route   PUT /api/pages/:id
// @desc    Update a page
// @access  Private (Admin only)
router.put('/:id', protect, isAdmin, async (req, res, next) => {
  try {
    const { title, content, description, order, isActive } = req.body;

    let page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    page = await Page.findByIdAndUpdate(
      req.params.id,
      { title, content, description, order, isActive },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      page
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A page with this title already exists' });
    }
    next(error);
  }
});

// @route   DELETE /api/pages/:id
// @desc    Delete a page
// @access  Private (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    await page.deleteOne();

    res.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
