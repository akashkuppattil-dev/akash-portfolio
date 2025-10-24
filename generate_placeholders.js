// Generate placeholder images for the hero section
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure images directory exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Create 3 hero images with different colors
const colors = [
    { bg: '#2E8B57', text: 'Wildlife Conservation' },
    { bg: '#008080', text: 'Ecological Research' },
    { bg: '#4B5320', text: 'Sustainable Development' }
];

colors.forEach((color, index) => {
    const width = 1920;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = color.bg;
    ctx.fillRect(0, 0, width, height);
    
    // Add text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add multiple lines of text
    const lines = [
        'Adhith M K',
        color.text,
        'Ecological Informatics Researcher'
    ];
    
    const lineHeight = 80;
    const startY = height / 2 - (lineHeight * (lines.length - 1)) / 2;
    
    lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + (i * lineHeight));
    });
    
    // Save to file
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
    fs.writeFileSync(path.join(imagesDir, `hero-${index + 1}.jpg`), buffer);
});

console.log('Generated hero placeholder images in the images/ directory');
