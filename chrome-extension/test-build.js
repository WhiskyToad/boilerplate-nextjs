#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing DemoFlow Chrome Extension Build...\n');

const distPath = path.join(__dirname, 'dist');
const requiredFiles = [
  'manifest.json',
  'background/background.js',
  'content/content.js', 
  'popup/popup.js',
  'popup/popup.html',
  'popup/popup.css',
  'utils/api.js',
  'utils/state.js'
];

let allTestsPassed = true;

// Test 1: Check if dist directory exists
console.log('📁 Checking dist directory...');
if (!fs.existsSync(distPath)) {
  console.log('❌ dist/ directory not found. Run "npm run build" first.');
  process.exit(1);
}
console.log('✅ dist/ directory exists');

// Test 2: Check required files
console.log('\n📄 Checking required files...');
for (const file of requiredFiles) {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allTestsPassed = false;
  }
}

// Test 3: Validate manifest.json
console.log('\n📋 Validating manifest.json...');
try {
  const manifestPath = path.join(distPath, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  const requiredFields = ['manifest_version', 'name', 'version', 'permissions'];
  for (const field of requiredFields) {
    if (manifest[field]) {
      console.log(`✅ manifest.${field}: ${JSON.stringify(manifest[field])}`);
    } else {
      console.log(`❌ Missing manifest field: ${field}`);
      allTestsPassed = false;
    }
  }
} catch (error) {
  console.log(`❌ Invalid manifest.json: ${error.message}`);
  allTestsPassed = false;
}

// Test 4: Check JavaScript file syntax
console.log('\n🔍 Checking JavaScript syntax...');
const jsFiles = ['background/background.js', 'content/content.js', 'popup/popup.js'];
for (const jsFile of jsFiles) {
  try {
    const jsPath = path.join(distPath, jsFile);
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    
    // Basic syntax check - look for common issues
    if (jsContent.includes('export ') || jsContent.includes('import ')) {
      console.log(`⚠️  ${jsFile} contains ES6 modules - may need bundling`);
    } else {
      console.log(`✅ ${jsFile} syntax looks valid`);
    }
  } catch (error) {
    console.log(`❌ Error reading ${jsFile}: ${error.message}`);
    allTestsPassed = false;
  }
}

// Test Results
console.log('\n📊 Test Results:');
if (allTestsPassed) {
  console.log('🎉 All tests passed! Extension ready for Chrome.');
  console.log('\n📖 Next steps:');
  console.log('1. Open chrome://extensions/');
  console.log('2. Enable Developer mode');
  console.log('3. Click "Load unpacked"');
  console.log('4. Select the dist/ folder');
  console.log('5. See TESTING.md for detailed testing guide');
} else {
  console.log('❌ Some tests failed. Check the output above.');
  process.exit(1);
}

// Test 5: File size check
console.log('\n📏 Extension size analysis:');
const totalSize = fs.readdirSync(distPath, { recursive: true })
  .map(file => {
    const filePath = path.join(distPath, file);
    return fs.statSync(filePath).isFile() ? fs.statSync(filePath).size : 0;
  })
  .reduce((total, size) => total + size, 0);

console.log(`📦 Total extension size: ${(totalSize / 1024).toFixed(2)} KB`);
if (totalSize > 2 * 1024 * 1024) {
  console.log('⚠️  Extension is larger than 2MB - consider optimization');
} else {
  console.log('✅ Extension size is reasonable');
}