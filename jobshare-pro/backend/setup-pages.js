const mongoose = require('mongoose');
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

async function setupPages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobshare');
    console.log('✅ MongoDB connected');

    console.log('Checking existing pages...');
    const existingCount = await Page.countDocuments();
    
    if (existingCount === 0) {
      console.log('Creating sample pages...');
      const createdPages = await Page.insertMany(samplePages);
      console.log(`✅ Created ${createdPages.length} sample pages`);
      
      createdPages.forEach(page => {
        console.log(`   - ${page.title} (/${page.slug})`);
      });
    } else {
      console.log(`ℹ️ Found ${existingCount} existing pages. Skipping initialization.`);
      console.log('To reset pages, run: npx node -e "require(\'./models/Page\').deleteMany({})"');
    }

    await mongoose.connection.close();
    console.log('✅ Setup complete');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupPages();
