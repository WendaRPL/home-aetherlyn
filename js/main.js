// Main Website JavaScript
const MainApp = (function() {
    // Elements
    let hamburger = null;
    let navLinks = null;
    let cursorDot = null;
    let cursorOutline = null;
    let isCursorInitialized = false;
    
    // Initialize
    function init() {
        console.log('MainApp initialized');
        cacheElements();
        bindEvents();
        // Custom Cursor: Diubah agar muncul selalu di awal (permintaan user)
        initCustomCursor(); 
    }
    
    // Initialize custom cursor (akan dipanggil dari gate animation)
    function initCustomCursor() {
        if (isCursorInitialized) {
            console.log('Cursor already initialized');
            return;
        }
        
        cursorDot = document.querySelector('.cursor-dot');
        cursorOutline = document.querySelector('.cursor-outline');
        
        if (!cursorDot || !cursorOutline) {
            console.warn('Cursor elements not found, will retry...');
            // Coba lagi setelah delay
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
        
        // Pastikan cursor visible (menggunakan opacity 1, karena display sudah 'block' di CSS)
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '0.5';
        
        // Enable custom cursor di body
        document.body.style.cursor = 'none';
        
        // Mouse move listener
        document.addEventListener('mousemove', handleMouseMove);
        
        // Hover effects untuk interactive elements
        const interactiveElements = 'a, button, .cta-button, .portal-card, .nav-links a, input, textarea';
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
        // cursorDot dan cursorOutline akan di-cache di initCustomCursor
    }
    
    // Bind event listeners
    function bindEvents() {
        console.log('Binding events');
        
        // Mobile navigation
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', toggleMobileMenu);
            
            // Close mobile menu when clicking a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
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
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
    
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
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
        // Show/hide custom cursor based on screen size
        if (window.innerWidth <= 768) {
            // Hide custom cursor on mobile
            if (cursorDot) cursorDot.style.display = 'none';
            if (cursorOutline) cursorOutline.style.display = 'none';
            document.body.style.cursor = 'auto';
            
            // Remove mouse move listener
            document.removeEventListener('mousemove', handleMouseMove);
        } else {
            // Show custom cursor on desktop
            if (cursorDot && cursorOutline && isCursorInitialized) {
                cursorDot.style.display = 'block';
                cursorOutline.style.display = 'block';
                document.body.style.cursor = 'none';
                
                // Re-add mouse move listener
                document.addEventListener('mousemove', handleMouseMove);
            }
        }
    }
    
    // Public API
    return {
        init: init,
        initCustomCursor: initCustomCursor,
        toggleMobileMenu: toggleMobileMenu,
        closeMobileMenu: closeMobileMenu,
        handleWindowResize: handleWindowResize
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
});

// Scroll animations
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.portal-card, .welcome-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Set initial styles for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.portal-card, .welcome-content');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
});

// Debug helper untuk testing cursor
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
    }
};