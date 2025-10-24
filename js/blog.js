/**
 * Blog functionality for Adhith M K's portfolio
 * Loads and displays blog posts from blog-posts.json
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load blog posts when the page loads
    loadBlogPosts();
});

/**
 * Fetches and displays blog posts
 */
async function loadBlogPosts() {
    try {
        const response = await fetch('js/data/blog-posts.json');
        if (!response.ok) {
            throw new Error('Failed to load blog posts');
        }
        
        const data = await response.json();
        displayBlogPosts(data.posts);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        displayError('Failed to load blog posts. Please try again later.');
    }
}

/**
 * Displays blog posts in the blog grid
 * @param {Array} posts - Array of blog post objects
 */
function displayBlogPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    // Sort posts by date (newest first)
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display only the 3 most recent posts on the home page
    const recentPosts = sortedPosts.slice(0, 3);
    
    // Generate HTML for each post
    const postsHTML = recentPosts.map(post => `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="${post.image || 'images/blog-placeholder.jpg'}" alt="${post.title}">
                <div class="blog-category">${post.category}</div>
            </div>
            <div class="blog-card-content">
                <div class="blog-meta">
                    <span class="blog-date">${formatDate(post.date)}</span>
                    <span class="blog-read-time">${post.read_time || '5 min read'}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="blog/${post.slug}.html" class="blog-read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `).join('');
    
    blogGrid.innerHTML = postsHTML;
}

/**
 * Formats a date string into a more readable format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date (e.g., "June 15, 2023")
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Displays an error message in the blog grid
 * @param {string} message - Error message to display
 */
function displayError(message) {
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        blogGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}
