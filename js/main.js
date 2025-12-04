// Main Website JavaScript
const MainApp = (function() {
    // Elements
    let hamburger = null;
    let navLinks = null;
    let cursorDot = null;
    let cursorOutline = null;
    let isCursorInitialized = false;
    let body = null;
    
    // Initialize
    function init() {
        console.log('MainApp initialized');
        body = document.body;
        cacheElements();
        bindEvents();
        initDropdowns(); // Initialize dropdowns
        initCustomCursor();
    }
    
    // GANTI fungsi initDropdowns() dengan ini:
function initDropdowns() {
    console.log('Initializing dropdowns');
    
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Handle dropdown toggle clicks
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Always handle click for mobile-dropdown
            if (this.closest('.mobile-dropdown')) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = this.closest('.dropdown');
                const isActive = dropdown.classList.contains('active');
                
                // Close all other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                console.log('Mobile dropdown toggled:', dropdown.classList.contains('active'));
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Close dropdowns on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Handle hover for desktop (non-mobile dropdowns)
    if (window.innerWidth > 768) {
        dropdowns.forEach(dropdown => {
            // Only add hover for non-mobile dropdowns
            if (!dropdown.classList.contains('mobile-dropdown')) {
                dropdown.addEventListener('mouseenter', function() {
                    this.classList.add('active');
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    this.classList.remove('active');
                });
            }
        });
    }
}
    
    // Initialize custom cursor
    function initCustomCursor() {
        if (isCursorInitialized) {
            console.log('Cursor already initialized');
            return;
        }
        
        cursorDot = document.querySelector('.cursor-dot');
        cursorOutline = document.querySelector('.cursor-outline');
        
        if (!cursorDot || !cursorOutline) {
            console.warn('Cursor elements not found, will retry...');
            setTimeout(() => {
                cursorDot = document.querySelector('.cursor-dot');
                cursorOutline = document.querySelector('.cursor-outline');
                if (cursorDot && cursorOutline) {
                    setupCursor();
                }
            }, 500);
            return;
        }
        
        setupCursor();
    }
    
    // Setup cursor functionality
    function setupCursor() {
        console.log('Setting up custom cursor');
        
        // Pastikan cursor visible
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '0.5';
        
        // Enable custom cursor di body
        document.body.style.cursor = 'none';
        
        // Mouse move listener
        document.addEventListener('mousemove', handleMouseMove);
        
        // Hover effects untuk interactive elements
        const interactiveElements = 'a, button, .cta-button, .portal-card, .nav-links a, .dropdown-toggle, .dropdown-menu a, input, textarea';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', handleElementHover);
            el.addEventListener('mouseleave', handleElementLeave);
        });
        
        isCursorInitialized = true;
        console.log('Custom cursor setup complete');
    }
    
    // Handle mouse movement
    function handleMouseMove(e) {
        if (!cursorDot || !cursorOutline) return;
        
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Update cursor dot
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Smooth animation untuk cursor outline
        cursorOutline.style.transition = 'left 0.1s ease-out, top 0.1s ease-out';
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    }
    
    // Handle element hover
    function handleElementHover() {
        if (!cursorOutline) return;
        
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(76, 201, 240, 0.15)';
        cursorOutline.style.borderColor = 'var(--accent-primary)';
        cursorOutline.style.opacity = '0.8';
    }
    
    // Handle element leave
    function handleElementLeave() {
        if (!cursorOutline) return;
        
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = '';
        cursorOutline.style.borderColor = 'var(--accent-primary)';
        cursorOutline.style.opacity = '0.5';
    }
    
    // Cache DOM elements
    function cacheElements() {
        hamburger = document.querySelector('.hamburger');
        navLinks = document.querySelector('.nav-links');
    }
    
    // Bind event listeners
    function bindEvents() {
        console.log('Binding events');
        
        // Mobile navigation
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', toggleMobileMenu);
            
            // Close mobile menu when clicking a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', function(e) {
                    // Don't close if clicking dropdown toggle
                    if (this.classList.contains('dropdown-toggle')) {
                        return;
                    }
                    
                    // Close mobile menu for regular links
                    closeMobileMenu();
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInsideNav = event.target.closest('nav');
                const isClickInsideSidebar = event.target.closest('.nav-links');
                const isClickOnHamburger = event.target.closest('.hamburger');
                
                if (!isClickInsideNav && !isClickInsideSidebar && !isClickOnHamburger && navLinks.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
            
            // Handle Escape key to close sidebar
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });
        
        // Portal card hover effects
        document.querySelectorAll('.portal-card').forEach(card => {
            card.addEventListener('mouseenter', handlePortalCardHover);
            card.addEventListener('mouseleave', handlePortalCardLeave);
        });
        
        // CTA button hover effects
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('mouseenter', handleCtaButtonHover);
            button.addEventListener('mouseleave', handleCtaButtonLeave);
        });
    }
    
    // Mobile menu functions
    function toggleMobileMenu() {
        const isOpening = !navLinks.classList.contains('active');
        
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Toggle body class untuk CSS control
        body.classList.toggle('menu-open', navLinks.classList.contains('active'));
        
        // Toggle body scroll when menu is open
        const isMenuOpen = navLinks.classList.contains('active');
        body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        console.log('Mobile menu toggled:', isMenuOpen ? 'opened' : 'closed');
    }
    
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        body.classList.remove('menu-open');
        body.style.overflow = '';
        
        // Also close all dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        console.log('Mobile menu closed');
    }
    
    // Smooth scroll handling
    function handleSmoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu jika terbuka
            if (navLinks && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    }
    
    // Portal card hover effects
    function handlePortalCardHover() {
        const icon = this.querySelector('.portal-icon i');
        if (icon) {
            icon.style.transition = 'transform 0.3s ease';
            icon.style.transform = 'scale(1.2) rotate(5deg)';
        }
    }
    
    function handlePortalCardLeave() {
        const icon = this.querySelector('.portal-icon i');
        if (icon) {
            icon.style.transform = '';
        }
    }
    
    // CTA button hover effects
    function handleCtaButtonHover() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'translateX(5px)';
        }
    }
    
    function handleCtaButtonLeave() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = '';
        }
    }
    
    // Handle window resize
    function handleWindowResize() {
        // Handle custom cursor
        if (window.innerWidth <= 768) {
            // Hide custom cursor on mobile
            if (cursorDot) cursorDot.style.display = 'none';
            if (cursorOutline) cursorOutline.style.display = 'none';
            document.body.style.cursor = 'auto';
            
            // Remove mouse move listener
            document.removeEventListener('mousemove', handleMouseMove);
            
            // Close all dropdowns on mobile resize
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        } else {
            // Show custom cursor on desktop
            if (cursorDot && cursorOutline && isCursorInitialized) {
                cursorDot.style.display = 'block';
                cursorOutline.style.display = 'block';
                document.body.style.cursor = 'none';
                
                // Re-add mouse move listener
                document.addEventListener('mousemove', handleMouseMove);
            }
            
            // Reset mobile menu when resizing to desktop
            if (navLinks && hamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
                
                console.log('Mobile states reset on desktop resize');
            }
        }
    }
    
    // Initialize scroll animations
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.portal-card, .welcome-content');
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        // Initial check
        checkScrollAnimations();
        
        // Listen for scroll
        window.addEventListener('scroll', checkScrollAnimations);
    }
    
    // Check and trigger scroll animations
    function checkScrollAnimations() {
        const elements = document.querySelectorAll('.portal-card, .welcome-content');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize main content fade-in
    function initContentFadeIn() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            setTimeout(() => {
                mainContent.classList.add('visible');
            }, 1000);
        }
    }
    
    // Public API
    return {
        init: init,
        initCustomCursor: initCustomCursor,
        toggleMobileMenu: toggleMobileMenu,
        closeMobileMenu: closeMobileMenu,
        handleWindowResize: handleWindowResize,
        initScrollAnimations: initScrollAnimations,
        initContentFadeIn: initContentFadeIn
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing MainApp');
    
    // Remove loading class if exists
    document.body.classList.remove('loading');
    
    // Initialize main app
    MainApp.init();
    
    // Handle window resize
    window.addEventListener('resize', MainApp.handleWindowResize);
    
    // Initial resize check
    setTimeout(() => {
        MainApp.handleWindowResize();
    }, 100);
    
    // Initialize scroll animations
    MainApp.initScrollAnimations();
    
    // Initialize content fade-in
    MainApp.initContentFadeIn();
});

// Debug helper untuk testing
window.debugCursor = {
    enable: () => {
        if (window.MainApp && typeof window.MainApp.initCustomCursor === 'function') {
            window.MainApp.initCustomCursor();
            console.log('Cursor manually enabled');
        }
    },
    disable: () => {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
        console.log('Cursor manually disabled');
    },
    toggleMenu: () => {
        if (window.MainApp && typeof window.MainApp.toggleMobileMenu === 'function') {
            window.MainApp.toggleMobileMenu();
            console.log('Mobile menu manually toggled');
        }
    },
    closeMenu: () => {
        if (window.MainApp && typeof window.MainApp.closeMobileMenu === 'function') {
            window.MainApp.closeMobileMenu();
            console.log('Mobile menu manually closed');
        }
    }
};
