const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const { minify } = require('terser');
const CleanCSS = require('clean-css');

// Configuration
const config = {
  css: {
    srcDir: 'css',
    distDir: 'dist/css',
    files: [
      'base.css',
      'layout.css',
      'components.css',
      'sections.css',
      'media.css',
      'custom.css',
      'map.css'
    ]
  },
  js: {
    srcDir: 'js',
    distDir: 'dist/js',
    files: [
      'main.js',
      'blog.js',
      'map.js',
      'contact.js'
    ]
  }
};

// Ensure dist directories exist
function ensureDistDirs() {
  [config.css.distDir, config.js.distDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Minify CSS files
async function minifyCSS() {
  console.log('\nMinifying CSS files...');
  const cleanCSS = new CleanCSS({
    level: 2,
    format: 'beautify',
    inline: ['none'],
    inline: false,
    rebase: false
  });

  for (const file of config.css.files) {
    try {
      const srcPath = path.join(config.css.srcDir, file);
      const destPath = path.join(config.css.distDir, file);
      
      const css = await readFile(srcPath, 'utf8');
      const output = cleanCSS.minify(css);
      
      if (output.errors && output.errors.length > 0) {
        console.error(`Error minifying ${file}:`, output.errors);
        continue;
      }
      
      await writeFile(destPath, output.styles);
      console.log(`✓ Minified: ${file} (${(output.stats.originalSize / 1024).toFixed(2)}KB → ${(output.stats.minifiedSize / 1024).toFixed(2)}KB, ${output.stats.efficiency * 100}% reduction)`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

// Minify JS files
async function minifyJS() {
  console.log('\nMinifying JS files...');
  
  for (const file of config.js.files) {
    try {
      const srcPath = path.join(config.js.srcDir, file);
      const destPath = path.join(config.js.distDir, file);
      
      const code = await readFile(srcPath, 'utf8');
      const result = await minify(code, {
        compress: true,
        mangle: true,
        format: {
          comments: false,
          preserve_annotations: false
        }
      });
      
      if (result.error) {
        console.error(`Error minifying ${file}:`, result.error);
        continue;
      }
      
      const originalSize = Buffer.byteLength(code, 'utf8');
      const minifiedSize = Buffer.byteLength(result.code, 'utf8');
      const reduction = ((originalSize - minifiedSize) / originalSize) * 100;
      
      await writeFile(destPath, result.code);
      console.log(`✓ Minified: ${file} (${(originalSize / 1024).toFixed(2)}KB → ${(minifiedSize / 1024).toFixed(2)}KB, ${reduction.toFixed(2)}% reduction)`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

// Copy other assets
async function copyAssets() {
  console.log('\nCopying other assets...');
  // Add any additional assets that need to be copied to the dist directory
  const assets = [
    { src: 'images', dest: 'dist/images' },
    { src: 'blog', dest: 'dist/blog' },
    { src: 'index.html', dest: 'dist/index.html' }
  ];

  for (const asset of assets) {
    try {
      if (fs.lstatSync(asset.src).isDirectory()) {
        await copyDir(asset.src, asset.dest);
      } else {
        await copyFile(asset.src, asset.dest);
      }
      console.log(`✓ Copied: ${asset.src} → ${asset.dest}`);
    } catch (error) {
      console.error(`Error copying ${asset.src}:`, error);
    }
  }
}

// Helper function to copy directories recursively
async function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

// Helper function to copy a single file
async function copyFile(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return fs.promises.copyFile(src, dest);
}

// Update HTML with minified file references
async function updateHTML() {
  console.log('\nUpdating HTML with minified file references...');
  try {
    const htmlPath = 'index.html';
    let html = await readFile(htmlPath, 'utf8');
    
    // Replace CSS references
    html = html.replace(
      /<link rel="stylesheet" href="css\/([^"]+\.css)">/g,
      '<link rel="stylesheet" href="css/$1">'
    );
    
    // Replace JS references
    html = html.replace(
      /<script src="js\/([^"]+\.js)"><\/script>/g,
      '<script src="js/$1"></script>'
    );
    
    // Update the HTML file in the dist directory
    await writeFile('dist/index.html', html);
    console.log('✓ Updated HTML with minified file references');
  } catch (error) {
    console.error('Error updating HTML:', error);
  }
}

// Main build function
async function build() {
  console.log('Starting build process...');
  
  try {
    ensureDistDirs();
    await minifyCSS();
    await minifyJS();
    await copyAssets();
    await updateHTML();
    
    console.log('\n✅ Build completed successfully!');
    console.log('Your optimized files are in the dist/ directory.');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build process
build();
