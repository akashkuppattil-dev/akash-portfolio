const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'images', 'blog');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to generate a placeholder image
function generatePlaceholder(width, height, text, outputPath) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Background color
    const bgColor = '#f0f7f4';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Add text
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#2E8B57';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text into multiple lines if needed
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + ' ' + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width < width - 40) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    
    // Draw text lines
    const lineHeight = 40;
    const startY = (height - (lines.length * lineHeight)) / 2;
    
    lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + (index * lineHeight));
    });
    
    // Add website URL
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('adhithmk.com', width / 2, height - 20);
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Generated placeholder: ${outputPath}`);
}

// Generate placeholders for blog posts
const blogPosts = require('./data/blog-posts.json');

blogPosts.posts.forEach(post => {
    if (post.image) {
        const imagePath = path.join(imagesDir, path.basename(post.image));
        generatePlaceholder(800, 500, post.title, imagePath);
    }
});

// Generate a default placeholder
generatePlaceholder(800, 500, 'Blog Post', path.join(imagesDir, 'blog-placeholder.jpg'));

console.log('\nPlaceholder image generation complete!');
