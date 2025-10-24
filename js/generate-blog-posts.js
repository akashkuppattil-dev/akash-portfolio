/**
 * Script to generate individual blog post pages from blog-posts.json
 * Run this script using Node.js to generate all blog post pages
 */

const fs = require('fs');
const path = require('path');

// Paths
const blogPostsPath = path.join(__dirname, 'data', 'blog-posts.json');
const templatePath = path.join(__dirname, '..', 'blog', 'post-template.html');
const outputDir = path.join(__dirname, '..', 'blog', 'posts');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read the blog posts data
const blogData = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
const posts = blogData.posts;

// Read the template
let template = fs.readFileSync(templatePath, 'utf8');

// Process each post
posts.forEach((post, index) => {
    console.log(`Generating post: ${post.title}`);
    
    // Create a copy of the template for this post
    let postHtml = template;
    
    // Replace placeholders with post data
    postHtml = postHtml.replace(/Blog Post Title \| Adhith M K/g, `${post.title} | Adhith M K`);
    postHtml = postHtml.replace(/<title>[^<]+<\/title>/, `<title>${post.title} | Adhith M K</title>`);
    postHtml = postHtml.replace('Blog Post Title', post.title);
    
    // Format date
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Update metadata
    postHtml = postHtml.replace(/<span><i class="far fa-calendar"><\/i> June 18, 2025<\/span>/, 
        `<span><i class="far fa-calendar"></i> ${formattedDate}</span>`);
    
    postHtml = postHtml.replace(/<span><i class="far fa-clock"><\/i> 5 min read<\/span>/, 
        `<span><i class="far fa-clock"></i> ${post.read_time || '5 min read'}</span>`);
    
    postHtml = postHtml.replace(/<span><i class="far fa-folder"><\/i> Category<\/span>/, 
        `<span><i class="far fa-folder"></i> ${post.category}</span>`);
    
    // Add tags
    const tagsHtml = post.tags.map(tag => 
        `<span class="blog-tag">${tag}</span>`
    ).join('\n');
    
    postHtml = postHtml.replace(/<div class="blog-tags">[\s\S]*?<\/div>/, 
        `<div class="blog-tags">${tagsHtml}</div>`);
    
    // Add content
    postHtml = postHtml.replace('<!-- Blog post content will be dynamically inserted here -->', post.content);
    
    // Update navigation links
    const prevPost = index > 0 ? posts[index - 1] : null;
    const nextPost = index < posts.length - 1 ? posts[index + 1] : null;
    
    const prevLink = prevPost ? 
        `<a href="${prevPost.slug}.html" class="btn btn-outline"><i class="fas fa-arrow-left"></i> ${prevPost.title}</a>` : 
        '<span></span>';
    
    const nextLink = nextPost ? 
        `<a href="${nextPost.slug}.html" class="btn btn-outline">${nextPost.title} <i class="fas fa-arrow-right"></i></a>` : 
        '<span></span>';
    
    postHtml = postHtml.replace(
        /<div class="blog-navigation">[\s\S]*?<\/div>/, 
        `<div class="blog-navigation">
            ${prevLink}
            <a href="../index.html#blog" class="btn btn-outline">Back to Blog</a>
            ${nextLink}
        </div>`
    );
    
    // Update Open Graph and Twitter card meta tags for better sharing
    const metaTags = `
        <meta property="og:title" content="${post.title}">
        <meta property="og:description" content="${post.excerpt}">
        <meta property="og:type" content="article">
        <meta property="og:url" content="https://yourdomain.com/blog/posts/${post.slug}.html">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${post.title}">
        <meta name="twitter:description" content="${post.excerpt}">
        ${post.image ? `<meta property="og:image" content="https://yourdomain.com/${post.image}">
        <meta name="twitter:image" content="https://yourdomain.com/${post.image}">` : ''}
    `;
    
    postHtml = postHtml.replace('</head>', `${metaTags}\n    </head>`);
    
    // Write the post HTML to a file
    const outputPath = path.join(outputDir, `${post.slug}.html`);
    fs.writeFileSync(outputPath, postHtml);
    
    console.log(`Generated: ${outputPath}`);
});

console.log('\nBlog post generation complete!');
