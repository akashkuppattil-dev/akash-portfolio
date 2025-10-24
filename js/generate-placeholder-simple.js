const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'images', 'blog');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download a file
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
                console.log(`Downloaded: ${filepath}`);
            });
        }).on('error', error => {
            fs.unlink(filepath, () => {}); // Delete the file if there's an error
            reject(error);
        });
    });
}

// Generate placeholders for blog posts
const blogPosts = require('./data/blog-posts.json');

// Generate a placeholder image URL from placeholder.com
function getPlaceholderUrl(text, width = 800, height = 500) {
    const encodedText = encodeURIComponent(text);
    return `https://placehold.co/${width}x${height}/f0f7f4/2E8B57/png?text=${encodedText}`;
}

// Download placeholders for all blog posts
async function generatePlaceholders() {
    for (const post of blogPosts.posts) {
        if (post.image) {
            const imageName = path.basename(post.image);
            const imagePath = path.join(imagesDir, imageName);
            const placeholderUrl = getPlaceholderUrl(post.title);
            
            try {
                await downloadImage(placeholderUrl, imagePath);
            } catch (error) {
                console.error(`Error downloading image for ${post.title}:`, error.message);
            }
        }
    }
    
    // Download a default placeholder
    const defaultPath = path.join(imagesDir, 'blog-placeholder.jpg');
    if (!fs.existsSync(defaultPath)) {
        try {
            await downloadImage(getPlaceholderUrl('Blog+Post'), defaultPath);
        } catch (error) {
            console.error('Error downloading default placeholder:', error.message);
        }
    }
    
    console.log('\nPlaceholder image generation complete!');
}

generatePlaceholders().catch(console.error);
