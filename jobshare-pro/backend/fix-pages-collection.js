const mongoose = require('mongoose');
require('dotenv').config();

async function fixPages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobshare');
    console.log('✅ MongoDB connected');

    console.log('🗑️  Dropping pages collection...');
    await mongoose.connection.collection('pages').drop().catch(() => console.log('Collection already empty'));
    
    console.log('✅ Done - collection dropped');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixPages();
