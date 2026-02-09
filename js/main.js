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
        initDropdowns();
        initCustomCursor();
    }

    // === DROPDOWNS ===
    function initDropdowns() {
        console.log('Initializing dropdowns');

        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {

                // DIPAKSA JALAN DI MOBILE
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();

                    const dropdown = this.closest('.dropdown');
                    const isActive = dropdown.classList.contains('active');

                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) d.classList.remove('active');
                    });

                    dropdown.classList.toggle('active');
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

        // ESC = close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });

        // Desktop hover support
        if (window.innerWidth > 768) {
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('mouseenter', function() {
                    this.classList.add('active');
                });

                dropdown.addEventListener('mouseleave', function() {
                    this.classList.remove('active');
                });
            });
        }
    }

    // === CUSTOM CURSOR ===
    function initCustomCursor() {
        if (isCursorInitialized) return;

        cursorDot = document.querySelector('.cursor-dot');
        cursorOutline = document.querySelector('.cursor-outline');

        if (!cursorDot || !cursorOutline) {
            setTimeout(initCustomCursor, 300);
            return;
        }

        setupCursor();
    }

    function setupCursor() {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '0.5';

        document.body.style.cursor = 'none';

        document.addEventListener('mousemove', handleMouseMove);

        const interactiveElements =
            'a, button, .cta-button, .portal-card, .nav-links a, .dropdown-toggle, .dropdown-menu a, input, textarea';

        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', handleElementHover);
            el.addEventListener('mouseleave', handleElementLeave);
        });

        isCursorInitialized = true;
    }

    function handleMouseMove(e) {
        if (!cursorDot || !cursorOutline) return;

        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.style.transition = 'left 0.1s ease-out, top 0.1s ease-out';
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    }

    function handleElementHover() {
        if (!cursorOutline) return;

        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(76, 201, 240, 0.15)';
        cursorOutline.style.borderColor = 'var(--accent-primary)';
        cursorOutline.style.opacity = '0.8';
    }

    function handleElementLeave() {
        if (!cursorOutline) return;

        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = '';
        cursorOutline.style.borderColor = 'var(--accent-primary)';
        cursorOutline.style.opacity = '0.5';
    }

    // === CACHE DOM ===
    function cacheElements() {
        hamburger = document.querySelector('.hamburger');
        navLinks = document.querySelector('.mobile-sidebar, .nav-links');
    }

    // === EVENTS ===
    function bindEvents() {
        console.log('Binding events');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', toggleMobileMenu);

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', function() {
                    if (this.classList.contains('dropdown-toggle')) return;
                    closeMobileMenu();
                });
            });

            document.addEventListener('click', function(event) {
                const isClickInsideSidebar = event.target.closest('.nav-links');
                const isClickOnHamburger = event.target.closest('.hamburger');

                if (!isClickInsideSidebar && !isClickOnHamburger && navLinks.classList.contains('active')) {
                    closeMobileMenu();
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });

        document.querySelectorAll('.portal-card').forEach(card => {
            card.addEventListener('mouseenter', handlePortalCardHover);
            card.addEventListener('mouseleave', handlePortalCardLeave);
        });

        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('mouseenter', handleCtaButtonHover);
            button.addEventListener('mouseleave', handleCtaButtonLeave);
        });
    }

    // === MOBILE MENU ===
    function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');

    const isMenuOpen = navLinks.classList.contains('active');

    // Lock scroll using HTML (world.js standard)
    body.classList.toggle('menu-open', isMenuOpen);
    document.documentElement.style.overflow = isMenuOpen ? 'hidden' : '';

    console.log('Mobile menu:', isMenuOpen ? 'OPEN' : 'CLOSED');

    // === AUTO-OPEN MOBILE DROPDOWN (from landing main.js) ===
    const mobileDropdown = document.querySelector('.mobile-dropdown');

    if (window.innerWidth <= 768) {
        if (isMenuOpen) {
            // Open dropdown automatically
            setTimeout(() => {
                if (mobileDropdown) {
                    mobileDropdown.classList.add('active');
                    console.log('Auto-open mobile dropdown');
                }
            }, 100);
        } else {
            // Close dropdown when menu closes
            if (mobileDropdown) {
                mobileDropdown.classList.remove('active');
            }
        }
    }
}

// Mobile dropdown manual toggle
function initMobileDropdown() {
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    
    if (!mobileDropdown) return;

    const dropdownToggle = mobileDropdown.querySelector('.dropdown-toggle');

    if (dropdownToggle && window.innerWidth <= 768) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            mobileDropdown.classList.toggle('active');

            if (mobileDropdown.classList.contains('active')) {
                setTimeout(() => {
                    mobileDropdown.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 100);
            }
        });
    }
}


    function closeMobileMenu() {
        if (!navLinks || !hamburger) return;

        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        body.classList.remove('menu-open');

        document.documentElement.style.overflow = ''; // UNLOCK SCROLL

        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });

        console.log('Mobile menu closed');
    }

    // === SMOOTH SCROLL ===
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

            if (navLinks && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    }

    // === HOVER FX ===
    function handlePortalCardHover() {
        const icon = this.querySelector('.portal-icon i');
        if (icon) icon.style.transform = 'scale(1.2) rotate(5deg)';
    }

    function handlePortalCardLeave() {
        const icon = this.querySelector('.portal-icon i');
        if (icon) icon.style.transform = '';
    }

    function handleCtaButtonHover() {
        const icon = this.querySelector('i');
        if (icon) icon.style.transform = 'translateX(5px)';
    }

    function handleCtaButtonLeave() {
        const icon = this.querySelector('i');
        if (icon) icon.style.transform = '';
    }

    // === RESIZE ===
    function handleWindowResize() {
        if (window.innerWidth <= 768) {
            if (cursorDot) cursorDot.style.display = 'none';
            if (cursorOutline) cursorOutline.style.display = 'none';
            document.body.style.cursor = 'auto';

            document.removeEventListener('mousemove', handleMouseMove);

            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });

        } else {
            if (cursorDot && cursorOutline && isCursorInitialized) {
                cursorDot.style.display = 'block';
                cursorOutline.style.display = 'block';
                document.body.style.cursor = 'none';
                document.addEventListener('mousemove', handleMouseMove);
            }

            if (navLinks && hamburger) {
                closeMobileMenu();
            }
        }
    }

    // === SCROLL ANIMATIONS ===
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.portal-card, .welcome-content');

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });

        checkScrollAnimations();
        window.addEventListener('scroll', checkScrollAnimations);
    }

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

    function initContentFadeIn() {
        const mainContent = document.querySelector('.main-content');

        if (mainContent) {
            setTimeout(() => {
                mainContent.classList.add('visible');
            }, 1000);
        }
    }

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


// === DOM READY ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing MainApp');

    document.body.classList.remove('loading');

    MainApp.init();
    window.addEventListener('resize', MainApp.handleWindowResize);

    setTimeout(MainApp.handleWindowResize, 100);

    MainApp.initScrollAnimations();
    MainApp.initContentFadeIn();
    
    // === COPY TEMPLATE FUNCTIONALITY ===
    initCopyTemplate();
});

// Copy Template Function
function initCopyTemplate() {
    const copyBtn = document.getElementById('copyTemplateBtn');
    const templateText = document.getElementById('templateText');
    
    if (!copyBtn || !templateText) return;
    
    copyBtn.addEventListener('click', function() {
        // Select and copy text
        templateText.select();
        templateText.setSelectionRange(0, 99999); // For mobile
        
        // Copy to clipboard using modern API
        navigator.clipboard.writeText(templateText.value).then(function() {
            // Success feedback
            showCopySuccess(copyBtn);
        }).catch(function(err) {
            // Fallback for older browsers
            try {
                document.execCommand('copy');
                showCopySuccess(copyBtn);
            } catch(e) {
                alert('Gagal menyalin template. Silakan copy manual.');
                console.error('Copy failed:', e);
            }
        });
    });
}

function showCopySuccess(button) {
    const originalHTML = button.innerHTML;
    
    // Add success state
    button.classList.add('copied');
    button.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
    
    // Reset after 2 seconds
    setTimeout(function() {
        button.classList.remove('copied');
        button.innerHTML = originalHTML;
    }, 2000);
}