const mongoose = require('mongoose');
require('dotenv').config();

const Page = require('./models/Page');

async function resetPages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobshare');
    console.log('✅ MongoDB connected');

    console.log('🗑️  Deleting all pages...');
    const result = await Page.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} pages`);

    await mongoose.connection.close();
    console.log('✅ Done');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPages();
