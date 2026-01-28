const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        error: 'Not authorized, no token provided'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          error: 'User not found'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        error: 'Not authorized, token failed'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Check if user is employer
exports.isEmployer = (req, res, next) => {
  if (req.user && (req.user.role === 'employer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      error: 'Access denied. Employer role required.'
    });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      error: 'Access denied. Admin role required.'
    });
  }
};
