const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: 50,
    maxlength: 5000
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship', 'Learnerships']
  },
  category: {
    type: String,
    required: [true, 'Job category is required'],
    enum: ['Technology', 'Marketing', 'Sales', 'Design', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Other']
  },
  salaryMin: {
    type: Number,
    min: 0
  },
  salaryMax: {
    type: Number,
    min: 0
  },
  requirements: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Lead'],
    default: 'Mid'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  applicationUrl: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  applications: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    coverLetter: String,
    resume: String,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search performance
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ location: 1, jobType: 1, category: 1 });

module.exports = mongoose.model('Job', jobSchema);
