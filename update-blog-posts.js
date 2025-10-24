const fs = require('fs');
const path = require('path');

// Define the correct navigation HTML
const navigationHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <a href="../index.html" class="logo">Adhith M K</a>
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links">
                <li><a href="../index.html#home" class="nav-link">Home</a></li>
                <li><a href="../index.html#about" class="nav-link">About</a></li>
                <li><a href="../index.html#research" class="nav-link">Research</a></li>
                <li><a href="../index.html#publications" class="nav-link">Publications</a></li>
                <li><a href="../index.html#certifications" class="nav-link">Certifications</a></li>
                <li><a href="../index.html#awards" class="nav-link">Awards</a></li>
                <li><a href="../index.html#field-experience" class="nav-link">Field Work</a></li>
                <li><a href="../index.html#blog" class="nav-link active">Blog</a></li>
                <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
            </ul>
        </div>
    </nav>`;

// Define the correct footer HTML
const footerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-about">
                    <h3>Adhith M K</h3>
                    <p>Ecological Informatics & Wildlife Conservation</p>
                    <div class="social-links">
                        <a href="https://www.linkedin.com/in/adhithmk/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </a>
                        <a href="https://twitter.com/AdhithMk" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://bsky.app/profile/adhithmk.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="BlueSky" class="social-icon">
                            <img src="../images/bluesky-custom-icon.svg" alt="BlueSky" class="bluesky-icon" width="24" height="24">
                        </a>
                        <a href="https://www.instagram.com/adhith_mk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="mailto:theadhith@gmail.com" aria-label="Email">
                            <i class="fas fa-envelope"></i>
                        </a>
                    </div>
                </div>
                <div class="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="../index.html#home">Home</a></li>
                        <li><a href="../index.html#about">About</a></li>
                        <li><a href="../index.html#research">Research</a></li>
                        <li><a href="../index.html#publications">Publications</a></li>
                        <li><a href="../index.html#blog">Blog</a></li>
                        <li><a href="../index.html#contact">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Adhith M K. All rights reserved.</p>
            </div>
        </div>
    </footer>`;

// Function to update a single blog post file
function updateBlogPost(filePath) {
    try {
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update navigation
        content = content.replace(
            /<nav[\s\S]*?<\/nav>/,
            navigationHTML
        );
        
        // Update footer
        content = content.replace(
            /<footer[\s\S]*?<\/footer>/,
            footerHTML
        );
        
        // Remove any remaining contact information
        content = content.replace(/<div[^>]*class=["']footer-about["'][^>]*>([\s\S]*?)<\/div>/g, '');
        
        // Update script includes
        content = content.replace(
            /<script[\s\S]*?<\/script>/g,
            ''
        );
        
        // Add back the scripts at the end
        content = content.replace(
            '<\/body>',
            `    <!-- Scripts -->
    <script src="../js/main.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
    <script>
        // Initialize syntax highlighting
        document.addEventListener('DOMContentLoaded', function() {
            // Highlight code blocks
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            
            // Make external links open in new tab
            document.querySelectorAll('a[href^="http"]').forEach(link => {
                if (link.hostname !== window.location.hostname) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            });
        });
    </script>
</body>`
        );
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error);
        return false;
    }
}

// Process all HTML files in the blog/posts directory
const postsDir = path.join(__dirname, 'blog', 'posts');
fs.readdir(postsDir, (err, files) => {
    if (err) {
        console.error('Error reading blog posts directory:', err);
        return;
    }
    
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    console.log(`Found ${htmlFiles.length} blog posts to update.`);
    
    let updatedCount = 0;
    htmlFiles.forEach(file => {
        const filePath = path.join(postsDir, file);
        if (updateBlogPost(filePath)) {
            updatedCount++;
        }
    });
    
    console.log(`\nUpdate complete. Successfully updated ${updatedCount} of ${htmlFiles.length} blog posts.`);
});
