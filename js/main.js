/**
 * Main JavaScript file for Adhith M.K.'s Academic Portfolio
 * Handles all interactive elements of the website
 */

// Global state
const state = {
    projects: [],
    publications: [],
    blogPosts: []
};

// DOM Elements
const DOM = {
    projectsContainer: document.getElementById('projects-container'),
    publicationsList: document.querySelector('.publications-list'),
    blogGrid: document.querySelector('.blog-grid'),
    // Add other DOM elements as needed
};

// Fetch data from JSON files
async function fetchData() {
    try {
        const [projectsRes, publicationsRes, blogRes] = await Promise.all([
            fetch('js/data/projects.json'),
            fetch('js/data/publications.json'),
            fetch('js/data/blog-posts.json')
        ]);

        if (!projectsRes.ok || !publicationsRes.ok || !blogRes.ok) {
            throw new Error('Failed to fetch data');
        }

        const projectsData = await projectsRes.json();
        const publicationsData = await publicationsRes.json();
        const blogData = await blogRes.json();

        state.projects = projectsData.projects || [];
        state.publications = publicationsData.publications || [];
        state.blogPosts = blogData.posts || [];

        // Initialize components that depend on data
        initProjectFiltering();
        renderProjects();
        renderPublications();
        renderBlogPosts();
    } catch (error) {
        console.error('Error loading data:', error);
        // Show error message to user
        if (DOM.projectsContainer) {
            DOM.projectsContainer.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
        }
        if (DOM.publicationsList) {
            DOM.publicationsList.innerHTML = '<p class="error-message">Failed to load publications. Please try again later.</p>';
        }
        if (DOM.blogGrid) {
            DOM.blogGrid.innerHTML = '<p class="error-message">Failed to load blog posts. Please try again later.</p>';
        }
    }
}

// Render projects to the DOM
function renderProjects() {
    if (!DOM.projectsContainer || state.projects.length === 0) return;

    const projectsHTML = state.projects.map(project => `
        <div class="project-card" data-category="${project.category}" data-year="${project.year}">
            <div class="project-image">
                <img src="images/${project.image || 'project-placeholder.jpg'}" alt="${project.title}">
                <div class="project-overlay">
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="project-year">${project.year}</span>
                </div>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                ${project.link ? `<a href="${project.link}" class="btn btn-sm btn-outline">View Project</a>` : ''}
            </div>
        </div>
    `).join('');

    DOM.projectsContainer.innerHTML = projectsHTML;
    initProjectHoverEffects();
}

// Render publications to the DOM
function renderPublications() {
    if (!DOM.publicationsList || state.publications.length === 0) return;

    // Sort publications by year (newest first)
    const sortedPublications = [...state.publications].sort((a, b) => b.year - a.year);
    
    const publicationsHTML = sortedPublications.map(pub => `
        <div class="publication-item" data-year="${pub.year}" data-category="${pub.category || 'publication'}">
            <h3 class="publication-title">${pub.title}</h3>
            <p class="publication-authors">${pub.authors}</p>
            <p class="publication-journal">
                ${pub.journal}${pub.volume ? `, ${pub.volume}` : ''}${pub.issue ? `(${pub.issue})` : ''}${pub.pages ? `: ${pub.pages}` : ''} (${pub.year})
            </p>
            <div class="publication-links">
                ${pub.doi ? `<a href="https://doi.org/${pub.doi}" target="_blank" class="publication-link"><i class="fas fa-external-link-alt"></i> DOI</a>` : ''}
                ${pub.pdf ? `<a href="${pub.pdf}" target="_blank" class="publication-link"><i class="fas fa-file-pdf"></i> PDF</a>` : ''}
                ${pub.is_preprint && pub.preprint_link ? `<a href="${pub.preprint_link}" target="_blank" class="publication-link"><i class="fas fa-file-alt"></i> Preprint</a>` : ''}
            </div>
        </div>
    `).join('');

    DOM.publicationsList.innerHTML = publicationsHTML;
}

// Render blog posts to the DOM
function renderBlogPosts() {
    if (!DOM.blogGrid || state.blogPosts.length === 0) return;

    // Sort posts by date (newest first) and get the first 3 featured posts
    const featuredPosts = [...state.blogPosts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .filter(post => post.featured)
        .slice(0, 3);

    if (featuredPosts.length === 0) return;

    const blogPostsHTML = featuredPosts.map(post => `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="images/${post.image || 'blog-placeholder.jpg'}" alt="${post.title}">
                <div class="blog-card-category">${post.category}</div>
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-card-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span class="blog-card-readtime">${post.read_time}</span>
                </div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-footer">
                    <div class="blog-card-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="blog/${post.slug || '#'}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </article>
    `).join('');

    DOM.blogGrid.innerHTML = blogPostsHTML;
}

// Initialize project hover effects
function initProjectHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    // Close mobile menu when clicking on a nav link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class based on scroll position
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll direction
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
    
    // Initialize hero carousel
    function initHeroCarousel() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        // Array of background images for the carousel
        const heroImages = [
            'https://placehold.co/1920x1080/2E8B57/FFFFFF/png?text=Adhith+M.K.\nWildlife+Conservation',
            'https://placehold.co/1920x1080/008080/FFFFFF/png?text=Ecological+Research\nData+Analysis',
            'https://placehold.co/1920x1080/4B5320/FFFFFF/png?text=Sustainable+Development\nConservation+Science'
        ];
        
        let currentIndex = 0;
        
        // Set initial background image
        heroSection.style.backgroundImage = `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%), 
                                           url('../images/${heroImages[0]}')`;
        
        // Change background image every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % heroImages.length;
            heroSection.style.backgroundImage = `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%), 
                                               url('../images/${heroImages[currentIndex]}')`;
        }, 5000);
    }
    
    // Initialize project filtering
    function initProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-card');
        const categoryFilters = document.querySelectorAll('.category-filter');
        const yearFilters = document.querySelectorAll('.year-filter');
        
        if (filterButtons.length === 0 || projectItems.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter projects
                projectItems.forEach(project => {
                    if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', function() {
                const selectedCategory = this.value;
                projectItems.forEach(project => {
                    if (selectedCategory === 'all' || project.getAttribute('data-category') === selectedCategory) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        yearFilters.forEach(filter => {
            filter.addEventListener('change', function() {
                const selectedYear = this.value;
                projectItems.forEach(project => {
                    if (selectedYear === 'all' || project.getAttribute('data-year') === selectedYear) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Initialize skill bars animation
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        if (skillBars.length === 0) return;
        
        const animateSkillBars = () => {
            skillBars.forEach(bar => {
                const skillLevel = bar.getAttribute('data-level');
                bar.style.width = skillLevel + '%';
                bar.style.opacity = '1';
            });
        };
        
        // Intersection Observer for skill bars animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }
    
    // Initialize contact form
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Basic form validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'message'];
            
            requiredFields.forEach(field => {
                if (!formObject[field] || formObject[field].trim() === '') {
                    isValid = false;
                    const input = this.querySelector(`[name="${field}"]`);
                    input.classList.add('error');
                    
                    // Remove error class after 3 seconds
                    setTimeout(() => {
                        input.classList.remove('error');
                    }, 3000);
                }
            });
            
            // Validate email format
            if (formObject.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formObject.email)) {
                isValid = false;
                const emailInput = this.querySelector('[name="email"]');
                emailInput.classList.add('error');
                
                setTimeout(() => {
                    emailInput.classList.remove('error');
                }, 3000);
            }
            
            if (isValid) {
                // Here you would typically send the form data to a server
                console.log('Form submitted:', formObject);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                contactForm.appendChild(successMessage);
                
                // Reset form
                this.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Initialize all functions
    function init() {
        initHeroCarousel();
        initProjectFiltering();
        initSkillBars();
        initContactForm();
        
        // Add fade-in animation on scroll
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const fadeInOnScroll = () => {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('visible');
                }
            });
        };
        
        // Initial check
        fadeInOnScroll();
        
        // Check on scroll
        window.addEventListener('scroll', fadeInOnScroll);
    }
    
    // Initialize everything when DOM is fully loaded
    init();
});

// Add loading class to body while page is loading
document.body.classList.add('loading');

// Remove loading class when page is fully loaded
window.addEventListener('load', function() {
    document.body.classList.remove('loading');
});
