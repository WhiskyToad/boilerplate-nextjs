#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple base64 PNG placeholders (1x1 blue pixels scaled)
const createIcon = (size) => {
  // Base64 for a minimal PNG (blue square)
  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI/eBPQnAAAAABJRU5ErkJggg==';
  return Buffer.from(base64Data, 'base64');
};

const iconsDir = path.join(__dirname, 'dist', 'assets', 'icons');
const sourceIconsDir = path.join(__dirname, 'assets', 'icons');

// Create directories if they don't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}
if (!fs.existsSync(sourceIconsDir)) {
  fs.mkdirSync(sourceIconsDir, { recursive: true });
}

const sizes = [16, 32, 48, 128];

console.log('🎨 Creating placeholder icons...');

for (const size of sizes) {
  const iconData = createIcon(size);
  const filename = `icon-${size}.png`;
  
  // Create in both source and dist directories
  fs.writeFileSync(path.join(iconsDir, filename), iconData);
  fs.writeFileSync(path.join(sourceIconsDir, filename), iconData);
  
  console.log(`✅ Created ${filename}`);
}

console.log('🎉 All icons created successfully!');
console.log('📝 Note: These are minimal placeholders. Replace with actual DemoFlow icons for production.');