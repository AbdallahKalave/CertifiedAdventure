const navbar = document.querySelector('.navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');

// Navbar Scroll & Experience Sub-menu Logic
const handleNavbarLogic = () => {
    if (!navbar) return;
    
    // Initial check
    if (window.scrollY > 50) navbar.classList.add('scrolled');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // 1. Basic Navbar Scrolled State
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 2. Experience Page Sub-menu & Navbar Hiding logic
        const submenu = document.querySelector('.tour-submenu-bar');
        if (submenu) {
            // When scrolling past the hero/gallery area (approx 650px), 
            // hide the main navbar and stick submenu to the very top (0)
            if (scrollY > 650) {
                navbar.classList.add('nav-hidden');
                submenu.classList.add('at-top');
            } else {
                navbar.classList.remove('nav-hidden');
                submenu.classList.remove('at-top');
            }
        }
    });
};

handleNavbarLogic();

// Mobile Menu Toggle logic handled by inline onclick for maximum reliability
// This script focuses on closing the menu when links are clicked and handling the icon states

const toggleIcon = () => {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const icon = navToggle ? navToggle.querySelector('i') : null;
    if (icon && navMenu) {
        if (navMenu.classList.contains('show-menu')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }
};

// Listen for class changes to update icon
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            toggleIcon();
        }
    });
});

const menuEl = document.getElementById('nav-menu');
if (menuEl) {
    observer.observe(menuEl, { attributes: true });
}

// Close menu when clicking links
const navLinksItems = document.querySelectorAll('.nav-links a, .nav-cta');
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('show-menu');
            const icon = navToggle ? navToggle.querySelector('i') : null;
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        }
    });
});

// Global fade-ins and staggered reveals removed for static display

// 5. Active Link Highlighting (Intersection Observer)
const updateActiveLink = () => {
    // Select all sections that have IDs for navigation
    const navSections = document.querySelectorAll('h2[id], section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const options = {
        threshold: 0.2, // Trigger when 20% of section is visible
        rootMargin: "-80px 0px -20% 0px" // Account for floating navbar
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    
                    // Reset all colors
                    link.style.color = '';
                    
                    // Priority 1: Specific ID Match (for ATV & Dune Buggy)
                    if (href.includes('#' + id)) {
                        link.style.color = 'var(--color-accent)';
                        // If we matched a specific section, we want to stop Desert Safari from being highlighted
                        const dsLink = Array.from(navLinks).find(l => l.getAttribute('href') === 'desert-safari.html');
                        if (dsLink && dsLink !== link) dsLink.style.color = '';
                    } 
                    // Priority 2: Page Match (only if no specific ID is active)
                    else if (href === currentPage && !id) {
                         // Default page highlight handled by HTML or logic below
                    }
                });
            }
        });
    }, options);

    navSections.forEach(section => observer.observe(section));
    
    // Default page highlight if no section is active
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            // Check if any sub-section link is already highlighted
            const anyActive = Array.from(navLinks).some(l => l.style.color === 'var(--color-accent)' && l.getAttribute('href').includes('#'));
            if (!anyActive) {
                link.style.color = 'var(--color-accent)';
            }
        }
    });
};

updateActiveLink();

// Category Slider (Mobile Slideshow) logic
const categorySlider = document.getElementById('category-slider');
if (categorySlider) {
    let currentIndex = 0;
    const totalSlides = 4;
    let autoPlayInterval;
    let isDragging = false;
    let startX, scrollLeft;

    const updateSlider = () => {
        // Only slider mode on mobile (< 768px)
        if (window.innerWidth <= 768) {
            gsap.to(categorySlider, {
                xPercent: -25 * currentIndex,
                duration: 0.8,
                ease: "power3.inOut"
            });
        } else {
            // Reset position for desktop grid
            gsap.set(categorySlider, { xPercent: 0 });
        }
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    };

    const startAutoPlay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 3000);
    };

    const stopAutoPlay = () => clearInterval(autoPlayInterval);

    // Initial Start
    startAutoPlay();

    // Interaction Events (Manual Swipe)
    categorySlider.addEventListener('mousedown', (e) => {
        if (window.innerWidth > 768) return;
        isDragging = true;
        startX = e.pageX - categorySlider.offsetLeft;
        stopAutoPlay();
    });

    categorySlider.addEventListener('mouseleave', () => isDragging = false);
    categorySlider.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            startAutoPlay();
        }
    });

    categorySlider.addEventListener('mousemove', (e) => {
        if (!isDragging || window.innerWidth > 768) return;
        e.preventDefault();
        const x = e.pageX - categorySlider.offsetLeft;
        const walk = (x - startX); 
        
        if (Math.abs(walk) > 50) {
            if (walk > 0) currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            else currentIndex = (currentIndex + 1) % totalSlides;
            
            updateSlider();
            isDragging = false;
        }
    });

    // Touch Events for Mobile
    categorySlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        stopAutoPlay();
    }, {passive: true});

    categorySlider.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].pageX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) currentIndex = (currentIndex + 1) % totalSlides;
            else currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        }
        updateSlider();
        startAutoPlay();
    }, {passive: true});

    // Handle resize
    window.addEventListener('resize', updateSlider);
}

// 7. Tour Page Accordion Logic
document.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    const faqHeader = e.target.closest('.faq-header');
    const sectionToggle = e.target.closest('.section-toggle-header');
    
    if (header) {
        const item = header.parentElement;
        item.classList.toggle('active');
        const siblings = item.parentElement.querySelectorAll('.accordion-item');
        siblings.forEach(sibling => {
            if (sibling !== item) sibling.classList.remove('active');
        });
    }

    if (faqHeader) {
        const item = faqHeader.parentElement;
        item.classList.toggle('active');
        const siblings = item.parentElement.querySelectorAll('.faq-item');
        siblings.forEach(sibling => {
            if (sibling !== item) sibling.classList.remove('active');
        });
    }

    if (sectionToggle) {
        const section = sectionToggle.closest('.collapsible-section');
        if (section) {
            section.classList.toggle('section-open');
        }
    }
});

// 8. Sub-menu Active State on Scroll (Intersection Observer)
const setupSubmenuObserver = () => {
    const submenuLinks = document.querySelectorAll('.submenu-link');
    if (submenuLinks.length === 0) return;

    const sections = Array.from(submenuLinks).map(link => {
        const targetId = link.getAttribute('href').substring(1);
        return document.getElementById(targetId);
    }).filter(el => el !== null);

    const options = {
        root: null,
        rootMargin: '-150px 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                submenuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));
};

// Initialize if sub-menu exists
if (document.querySelector('.tour-submenu-bar')) {
    setupSubmenuObserver();
}


