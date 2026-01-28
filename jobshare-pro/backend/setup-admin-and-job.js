const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Job = require('./models/Job');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobshare';

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@jobshare.com' });
    
    if (!admin) {
      // Create admin user
      admin = await User.create({
        name: 'Hire Mzansi Admin',
        email: 'admin@jobshare.com',
        password: 'Admin@123456', // Will be hashed by model
        role: 'admin'
      });
      console.log('✅ Admin user created successfully');
      console.log('Email: admin@jobshare.com');
      console.log('Password: Admin@123456');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create the Junior Data Processer job
    const job = await Job.create({
      title: 'Junior Data Processer',
      company: 'etiMAX',
      description: `Location: Bryanston, Sandton – In office
Duration: Fixed term to Permanent

About Us:
At etiMAX, we specialize in helping businesses maximize their Employment Tax Incentive (ETI) savings and streamline compliance while empowering them with smart, data-driven insights. With a growing client base and expanding Operations team, we're looking for a detail-oriented, analytical, and proactive professional to join our team.

Role Overview:
We are seeking a Junior Data Processer to support our team with data extraction, transformation, and reconstruction tasks. This role is ideal for a detail-oriented individual who enjoys working with data, problem-solving, and building practical skills in data management.

Key Responsibilities:
• Extract data from multiple sources, including spreadsheets, databases, and reports.
• Reconstruct, clean, and transform datasets to ensure accuracy and usability.
• Assist in maintaining data quality standards and resolving discrepancies.
• Support reporting and analytics tasks by preparing structured datasets.
• Collaborate with team members to improve and streamline data processes.

Requirements:
• Recently completed a degree/diploma in Data Science, Information Systems, Statistics, Computer Science, or a related field.
• Basic understanding of data handling tools (Excel, SQL, or similar), and familiarity with Python for data processing and analysis.
• Strong attention to detail and ability to work methodically.
• Good problem-solving skills and eagerness to learn.
• Ability to work both independently and in a team environment.`,
      location: 'Johannesburg, Gauteng',
      jobType: 'Full-time',
      category: 'Technology',
      salaryMin: 120000,
      salaryMax: 120000,
      contactEmail: 'admin@jobshare.com',
      experienceLevel: 'Entry',
      postedBy: admin._id,
      requirements: [
        'Degree/diploma in Data Science, Information Systems, Statistics, Computer Science, or related field',
        'Excel, SQL, or similar tools knowledge',
        'Python for data processing and analysis',
        'Strong attention to detail',
        'Problem-solving skills'
      ],
      benefits: [
        'Fixed term to Permanent position',
        'In-office work at Bryanston, Sandton'
      ],
      status: 'active'
    });

    console.log('✅ Job posted successfully!');
    console.log('Job Title: ' + job.title);
    console.log('Company: ' + job.company);
    console.log('Location: ' + job.location);
    console.log('Salary: R' + job.salaryMin.toLocaleString());

    await mongoose.connection.close();
    console.log('\n✅ Setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();
