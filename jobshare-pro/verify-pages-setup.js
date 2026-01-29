#!/usr/bin/env node

/**
 * Verification Script - Check if Dynamic Pages System is properly installed
 * 
 * Usage: node verify-pages-setup.js
 */

const fs = require('fs');
const path = require('path');

const checks = [
  // Backend Models
  {
    name: 'Backend Page Model',
    path: 'backend/models/Page.js',
    type: 'file'
  },
  // Backend Routes
  {
    name: 'Backend Pages Routes',
    path: 'backend/routes/pages.js',
    type: 'file'
  },
  // Backend Setup
  {
    name: 'Pages Setup Script',
    path: 'backend/setup-pages.js',
    type: 'file'
  },
  // Backend Migration
  {
    name: 'Pages Migration Utility',
    path: 'backend/migrate-pages.js',
    type: 'file'
  },
  // Frontend Pages
  {
    name: 'PageManagement Component',
    path: 'frontend/src/pages/PageManagement.jsx',
    type: 'file'
  },
  {
    name: 'PageView Component',
    path: 'frontend/src/pages/PageView.jsx',
    type: 'file'
  },
  // Frontend Components
  {
    name: 'Updated Navbar Component',
    path: 'frontend/src/components/Navbar.jsx',
    type: 'file',
    contains: 'fetchPages'
  },
  // Frontend App
  {
    name: 'Updated App Routes',
    path: 'frontend/src/App.jsx',
    type: 'file',
    contains: 'PageManagement'
  },
  // Documentation
  {
    name: 'Setup Guide',
    path: 'SETUP_PAGES.md',
    type: 'file'
  },
  {
    name: 'Complete Guide',
    path: 'PAGES_GUIDE.md',
    type: 'file'
  },
  {
    name: 'Implementation Summary',
    path: 'DYNAMIC_PAGES_COMPLETE.md',
    type: 'file'
  }
];

function checkFile(filePath, contains = null) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
      return { exists: false, valid: false, message: 'File not found' };
    }

    if (contains) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const found = content.includes(contains);
      return {
        exists: true,
        valid: found,
        message: found ? `Contains "${contains}"` : `Missing "${contains}"`
      };
    }

    return { exists: true, valid: true, message: 'OK' };
  } catch (error) {
    return { exists: false, valid: false, message: error.message };
  }
}

function main() {
  console.log('\n🔍 Verifying Dynamic Pages System Installation\n');
  console.log('═'.repeat(60));

  let passed = 0;
  let failed = 0;

  checks.forEach(check => {
    const result = checkFile(check.path, check.contains);
    const status = result.valid ? '✅' : '❌';
    const message = result.message;

    console.log(`${status} ${check.name.padEnd(40)} ${message}`);

    if (result.valid) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('═'.repeat(60));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('✅ All checks passed! System is properly installed.\n');
    console.log('Next steps:');
    console.log('1. Start backend:   cd backend && npm run dev');
    console.log('2. Start frontend:  cd frontend && npm run dev');
    console.log('3. Initialize:      node backend/setup-pages.js');
    console.log('4. Visit:           http://localhost:5173\n');
  } else {
    console.log('⚠️  Some files are missing. Please check installation.\n');
    console.log('Make sure all files have been created properly.\n');
  }
}

main();
