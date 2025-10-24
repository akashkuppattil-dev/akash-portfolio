const fs = require('fs');
const path = require('path');

// Define the old and new social media link patterns
const replacements = [
  // Update BlueSky icon to use official icon
  {
    old: '<i class="fas fa-cloud"></i>',
    new: '<i class="fab fa-bluesky"></i>'
  },
  // Fix broken BlueSky link (if any)
  {
    old: '<a href="https://bsky.app/profile/adhithmk.bsky.social"\s*<a href="https://www.instagram.com/adhith_mk/"',
    new: '<a href="https://bsky.app/profile/adhithmk.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="BlueSky">\n                            <i class="fab fa-bluesky"></i>\n                        </a>\n                        <a href="https://www.instagram.com/adhith_mk/"',
    isRegex: true
  },
  // Update GitHub link
  {
    old: 'https://github.com/yourusername',
    new: 'https://github.com/adhithmk'
  },
  // Update LinkedIn link (just in case)
  {
    old: 'https://linkedin.com/in/yourprofile',
    new: 'https://www.linkedin.com/in/adhithmk/'
  },
  // Update Twitter links (just in case)
  {
    old: 'https://twitter.com/yourhandle',
    new: 'https://twitter.com/AdhithMk'
  },
  {
    old: 'https://twitter.com/yourusername',
    new: 'https://twitter.com/AdhithMk'
  },
  // Update email to theadhith@gmail.com
  {
    old: 'mailto:your.email@keralauniversity.ac.in',
    new: 'mailto:theadhith@gmail.com'
  },
  {
    old: 'mailto:your.email@example.com',
    new: 'mailto:theadhith@gmail.com'
  }
];

// Function to update a single file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Perform simple replacements
    replacements.forEach(replacement => {
      if (replacement.old) {
        if (replacement.isRegex) {
          const regex = new RegExp(replacement.old, 's');
          if (regex.test(content)) {
            content = content.replace(regex, replacement.new);
            updated = true;
          }
        } else if (content.includes(replacement.old)) {
          content = content.split(replacement.old).join(replacement.new);
          updated = true;
        }
      }
    });
    
    // Handle insertions
    replacements.forEach(replacement => {
      if (replacement.search) {
        if (replacement.insertBefore && content.includes(replacement.search) && !content.includes('bsky.app/profile/adhithmk')) {
          content = content.replace(
            replacement.search,
            replacement.content + '\n' + replacement.search
          );
          updated = true;
        } else if (replacement.insertAfter && content.includes(replacement.search) && !content.includes('instagram.com/adhith_mk')) {
          content = content.replace(
            replacement.search,
            replacement.search + '\n' + replacement.content
          );
          updated = true;
        }
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Process all HTML files in the blog/posts directory
const blogPostsDir = path.join(__dirname, 'blog', 'posts');
const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));

console.log('Updating social media links in blog posts...');
let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(blogPostsDir, file);
  if (updateFile(filePath)) {
    updatedCount++;
  }
});

console.log(`\nUpdated ${updatedCount} out of ${files.length} blog posts.`);
