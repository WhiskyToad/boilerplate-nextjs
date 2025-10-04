#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building DemoFlow Chrome Extension (Simple Version)...');

// Clean dist directory
console.log('Cleaning dist directory...');
execSync('rm -rf dist/*', { stdio: 'inherit' });

// Create directories
console.log('Creating directories...');
execSync('mkdir -p dist/popup dist/background dist/content dist/utils dist/assets/styles dist/assets/icons', { stdio: 'inherit' });

// Compile TypeScript files individually
console.log('Compiling TypeScript files...');

// Compile and move files
execSync('npx tsc src/utils/combined-api.ts --outDir dist --target ES2017 --lib ES2020,DOM --types chrome --moduleResolution node', { stdio: 'inherit' });
fs.renameSync('dist/combined-api.js', 'dist/utils/combined-api.js');

execSync('npx tsc src/background/background-simple.ts --outDir dist --target ES2017 --lib ES2020,DOM --types chrome --moduleResolution node', { stdio: 'inherit' });
fs.renameSync('dist/background-simple.js', 'dist/background/background.js');

execSync('npx tsc src/popup/popup-simple.ts --outDir dist --target ES2017 --lib ES2020,DOM --types chrome --moduleResolution node', { stdio: 'inherit' });
fs.renameSync('dist/popup-simple.js', 'dist/popup/popup.js');

execSync('npx tsc src/content/content.ts --outDir dist --target ES2017 --lib ES2020,DOM --types chrome --moduleResolution node', { stdio: 'inherit' });
fs.renameSync('dist/content.js', 'dist/content/content.js');

// Copy static assets
console.log('Copying assets...');
execSync('cp -r assets/* dist/assets/', { stdio: 'inherit' });
execSync('cp manifest.json dist/', { stdio: 'inherit' });
execSync('cp src/popup/popup.html dist/popup/', { stdio: 'inherit' });
execSync('cp src/popup/popup.css dist/popup/', { stdio: 'inherit' });

// Create a simple loader HTML that includes the combined API
const popupHtml = fs.readFileSync('src/popup/popup.html', 'utf8');
const updatedHtml = popupHtml.replace(
  '<script src="popup.js"></script>',
  '<script src="../utils/combined-api.js"></script>\n    <script src="popup.js"></script>'
);
fs.writeFileSync('dist/popup/popup.html', updatedHtml);

// Update manifest to include combined API in background
const manifest = JSON.parse(fs.readFileSync('dist/manifest.json', 'utf8'));

// Background scripts need to load the combined API first
// Since Manifest V3 doesn't support multiple scripts, we need to concatenate them
const combinedApiContent = fs.readFileSync('dist/utils/combined-api.js', 'utf8');
const backgroundContent = fs.readFileSync('dist/background/background.js', 'utf8');
const combinedBackground = combinedApiContent + '\n\n' + backgroundContent;
fs.writeFileSync('dist/background/background.js', combinedBackground);

fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));

// Create content.css
fs.writeFileSync('dist/assets/styles/content.css', '/* DemoFlow Content Styles */');

console.log('Build completed successfully!');
console.log('Extension files are in the dist/ directory');
console.log('Load the extension by:');
console.log('1. Go to chrome://extensions/');
console.log('2. Enable Developer mode');
console.log('3. Click "Load unpacked"');
console.log('4. Select the dist/ folder');