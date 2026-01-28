#!/usr/bin/env node

/**
 * Migration Script for Pages System
 * 
 * Usage:
 * node backend/migrate-pages.js reset  // Delete all pages
 * node backend/migrate-pages.js init   // Create default pages
 * node backend/migrate-pages.js list   // List all pages
 * node backend/migrate-pages.js count  // Count pages
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const Page = require('./models/Page');

const samplePages = [
  {
    title: 'News',
    description: 'Latest news and updates',
    content: '<h2>News & Updates</h2><p>Stay informed with the latest news about job opportunities and career development.</p>',
    order: 0
  },
  {
    title: 'Jobs',
    description: 'Job listings and opportunities',
    content: '<h2>Jobs</h2><p>Explore our comprehensive job listings across various industries and sectors.</p>',
    order: 1
  },
  {
    title: 'Bursaries',
    description: 'Bursary opportunities and financial support',
    content: '<h2>Bursaries & Financial Support</h2><p>Discover bursary opportunities, grants, and financial support programs to fund your studies.</p>',
    order: 2
  },
  {
    title: 'Studying',
    description: 'Educational resources and study programs',
    content: '<h2>Study Programs</h2><p>Access educational resources, online courses, and study programs to enhance your skills.</p>',
    order: 3
  },
  {
    title: 'Career Advice',
    description: 'Expert career guidance and tips',
    content: '<h2>Career Advice</h2><p>Get expert career advice, resume tips, interview preparation guides, and more.</p>',
    order: 4
  },
  {
    title: 'NSFAS',
    description: 'National Student Financial Aid Scheme information',
    content: '<h2>NSFAS</h2><p>Information about the National Student Financial Aid Scheme and how to apply for funding.</p>',
    order: 5
  },
  {
    title: 'FAQ',
    description: 'Frequently asked questions',
    content: '<h2>Frequently Asked Questions</h2><p><strong>Q: How do I post a job?</strong><br/>A: Only administrators can post jobs. Contact us for access.<br/><br/><strong>Q: How do I apply for a job?</strong><br/>A: Sign up, browse jobs, and click apply. You\'ll need to upload your CV.<br/><br/><strong>Q: Is it free to use?</strong><br/>A: Yes, Hire Mzansi is free for job seekers.</p>',
    order: 6
  }
];
  {
    title: 'UNISA',
    description: 'University of South Africa information',
    content: '<h2>UNISA</h2><p>Information about UNISA programs and distance learning opportunities.</p>',
    order: 10
  },
  {
    title: 'FAQ',
    description: 'Frequently asked questions',
    content: '<h2>Frequently Asked Questions</h2><p><strong>Q: How do I post a job?</strong><br/>A: Only administrators can post jobs. Contact us for access.<br/><br/><strong>Q: How do I apply for a job?</strong><br/>A: Sign up, browse jobs, and click apply. You\'ll need to upload your CV.<br/><br/><strong>Q: Is it free to use?</strong><br/>A: Yes, Hire Mzansi is free for job seekers.</p>',
    order: 11
  }
];

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobshare');
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    return false;
  }
}

async function reset() {
  console.log('🗑️  Deleting all pages...');
  try {
    const result = await Page.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} pages`);
  } catch (error) {
    console.error('❌ Error deleting pages:', error.message);
  }
}

async function init() {
  console.log('📝 Creating default pages...');
  try {
    const result = await Page.insertMany(samplePages);
    console.log(`✅ Created ${result.length} pages:\n`);
    result.forEach(page => {
      console.log(`   ✓ "${page.title}" (/${page.slug})`);
    });
  } catch (error) {
    if (error.code === 11000) {
      console.error('❌ Error: Some pages already exist. Run "reset" first to clear.');
    } else {
      console.error('❌ Error creating pages:', error.message);
    }
  }
}

async function list() {
  console.log('📋 All pages in database:\n');
  try {
    const pages = await Page.find({}).sort({ order: 1 });
    if (pages.length === 0) {
      console.log('   No pages found.');
    } else {
      console.log('   Order | Title                    | Slug                       | Status');
      console.log('   -----|--------------------------|----------------------------|--------');
      pages.forEach(page => {
        const title = page.title.padEnd(24);
        const slug = page.slug.padEnd(26);
        const status = page.isActive ? 'Active' : 'Inactive';
        console.log(`   ${page.order.toString().padEnd(4)} | ${title} | ${slug} | ${status}`);
      });
    }
  } catch (error) {
    console.error('❌ Error listing pages:', error.message);
  }
}

async function count() {
  try {
    const total = await Page.countDocuments({});
    const active = await Page.countDocuments({ isActive: true });
    const inactive = await Page.countDocuments({ isActive: false });
    
    console.log(`📊 Page Statistics:`);
    console.log(`   Total:    ${total} pages`);
    console.log(`   Active:   ${active} pages`);
    console.log(`   Inactive: ${inactive} pages`);
  } catch (error) {
    console.error('❌ Error getting count:', error.message);
  }
}

async function main() {
  const command = process.argv[2];

  if (!command || !['reset', 'init', 'list', 'count'].includes(command)) {
    console.log(`
📖 Pages Migration Script
Usage: node migrate-pages.js [command]

Commands:
  reset   - Delete all pages
  init    - Create default pages
  list    - Show all pages
  count   - Show page statistics

Examples:
  node migrate-pages.js init    # Create default pages
  node migrate-pages.js reset   # Clear all pages
  node migrate-pages.js list    # View all pages
  node migrate-pages.js count   # View statistics
    `);
    process.exit(1);
  }

  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  console.log(`\n▶️  Running: ${command}\n`);

  switch (command) {
    case 'reset':
      await reset();
      break;
    case 'init':
      await init();
      break;
    case 'list':
      await list();
      break;
    case 'count':
      await count();
      break;
  }

  await mongoose.connection.close();
  console.log('\n✅ Done\n');
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
