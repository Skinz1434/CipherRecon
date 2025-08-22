#!/usr/bin/env node

/**
 * Build script for CIPHER-RECON
 * Copies web assets and builds production bundle
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '../dist');
const srcWebDir = path.join(__dirname, '../src/web');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('🚀 Building CIPHER-RECON...\n');

// Step 1: Build JavaScript bundle
console.log('📦 Building JavaScript bundle...');
try {
  execSync('npm run build:prod', { stdio: 'inherit' });
  console.log('✅ JavaScript bundle created\n');
} catch (error) {
  console.error('❌ JavaScript build failed:', error.message);
  process.exit(1);
}

// Step 2: Copy HTML file
console.log('📄 Copying HTML file...');
const htmlSrc = path.join(srcWebDir, 'index.html');
const htmlDest = path.join(distDir, 'index.html');

// Update HTML to use minified bundle
let htmlContent = fs.readFileSync(htmlSrc, 'utf8');
htmlContent = htmlContent.replace(
  '<script src="js/app.js"></script>',
  '<script src="bundle.min.js"></script>'
);
// Remove other script tags since they're bundled
htmlContent = htmlContent.replace(
  /<script src="js\/(transforms|steganography|emojiLibrary|router)\.js"><\/script>\s*/g,
  ''
);

fs.writeFileSync(htmlDest, htmlContent);
console.log('✅ HTML file copied and updated\n');

// Step 3: Copy CSS files
console.log('🎨 Copying CSS files...');
const cssDir = path.join(distDir, 'css');
if (!fs.existsSync(cssDir)) {
  fs.mkdirSync(cssDir);
}

const cssFiles = ['style.css', 'notification.css'];
cssFiles.forEach(file => {
  const src = path.join(srcWebDir, 'css', file);
  const dest = path.join(cssDir, file);
  fs.copyFileSync(src, dest);
  console.log(`  ✅ ${file}`);
});

console.log('\n🎉 Build complete!');
console.log(`📁 Output directory: ${distDir}`);
console.log('🌐 Run "npm run serve:dist" to test the build');
