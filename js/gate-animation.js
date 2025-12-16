// Gate Animation Module
const GateAnimation = (function() {
    // Private variables
    let hasSeenIntro = false;
    let gateClickCount = 0;
    let isIntroCompleted = false;
    let isMobileView = false;
    
    // Elements
    const elements = {
        gateOverlay: null,
        gateLeft: null,
        gateRight: null,
        embarkBtn: null,
        elementalConvergence: null,
        mainContent: null,
        elementFire: null,
        elementWater: null,
        elementWind: null,
        elementEarth: null,
        convergenceCenter: null,
        convergenceText: null,
        gateSymbol: null,
        gateCenter: null,
        gateInstruction: null,
        gateCursorDot: null,
        gateCursorOutline: null
    };
    
    // Initialize
    function init() {
        cacheElements();
        checkFirstVisit();
        bindEvents();
        checkMobileView();
        
        // Buat kursor custom untuk gate (kecuali di mobile)
        if (!isMobileView) {
            createGateCursor();
        }
        
        // Show gate immediately with short delay
        setTimeout(() => {
            if (!isIntroCompleted && elements.gateOverlay) {
                elements.gateOverlay.style.visibility = 'visible';
                elements.gateOverlay.style.opacity = '1';
            }
        }, 50);
    }
    
    // Check if mobile view
    function checkMobileView() {
        isMobileView = window.innerWidth <= 768;
        
        // Listen for window resize
        window.addEventListener('resize', () => {
            const wasMobile = isMobileView;
            isMobileView = window.innerWidth <= 768;
            
            // Jika berubah dari desktop ke mobile, hapus cursor
            if (!wasMobile && isMobileView && elements.gateCursorDot) {
                cleanupGateCursor();
            }
            // Jika berubah dari mobile ke desktop, buat cursor
            else if (wasMobile && !isMobileView && !elements.gateCursorDot && !isIntroCompleted) {
                createGateCursor();
            }
        });
    }
    
    // Cache DOM elements
    function cacheElements() {
        elements.gateOverlay = document.getElementById('gateOverlay');
        elements.gateLeft = document.getElementById('gateLeft');
        elements.gateRight = document.getElementById('gateRight');
        elements.embarkBtn = document.getElementById('embarkBtn');
        elements.elementalConvergence = document.getElementById('elementalConvergence');
        elements.mainContent = document.getElementById('mainContent');
        elements.elementFire = document.getElementById('elementFire');
        elements.elementWater = document.getElementById('elementWater');
        elements.elementWind = document.getElementById('elementWind');
        elements.elementEarth = document.getElementById('elementEarth');
        elements.convergenceCenter = document.getElementById('convergenceCenter');
        elements.convergenceText = document.getElementById('convergenceText');
        elements.gateSymbol = document.querySelector('.gate-symbol');
        elements.gateCenter = document.querySelector('.gate-center');
        elements.gateInstruction = document.querySelector('.gate-instruction');
    }
    
    // Create custom cursor for gate overlay (DESKTOP ONLY)
    function createGateCursor() {
        // Skip jika di mobile
        if (isMobileView || elements.gateCursorDot) return;
        
        // Buat elemen kursor untuk gate overlay
        const gateCursorDot = document.createElement('div');
        gateCursorDot.className = 'cursor-dot gate-cursor';
        gateCursorDot.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--accent-primary);
            border-radius: 50%;
            z-index: 10003;
            pointer-events: none;
            opacity: 1;
            display: block;
            left: 50%;
            top: 50%;
        `;
        
        const gateCursorOutline = document.createElement('div');
        gateCursorOutline.className = 'cursor-outline gate-cursor';
        gateCursorOutline.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid var(--accent-primary);
            border-radius: 50%;
            z-index: 10002;
            pointer-events: none;
            opacity: 0.5;
            display: block;
            transition: all 0.1s ease-out;
            left: 50%;
            top: 50%;
        `;
        
        document.body.appendChild(gateCursorDot);
        document.body.appendChild(gateCursorOutline);
        
        // Setup mouse movement untuk gate cursor
        function handleGateMouseMove(e) {
            const posX = e.clientX;
            const posY = e.clientY;
            
            gateCursorDot.style.left = `${posX}px`;
            gateCursorDot.style.top = `${posY}px`;
            
            gateCursorOutline.style.transition = 'left 0.1s ease-out, top 0.1s ease-out';
            gateCursorOutline.style.left = `${posX}px`;
            gateCursorOutline.style.top = `${posY}px`;
        }
        
        document.addEventListener('mousemove', handleGateMouseMove);
        
        // Simpan reference
        elements.gateCursorDot = gateCursorDot;
        elements.gateCursorOutline = gateCursorOutline;
        elements.handleGateMouseMove = handleGateMouseMove;
        
        // Hover effects untuk button di gate (desktop only)
        if (elements.embarkBtn) {
            elements.embarkBtn.addEventListener('mouseenter', () => {
                gateCursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                gateCursorOutline.style.backgroundColor = 'rgba(76, 201, 240, 0.15)';
                gateCursorOutline.style.opacity = '0.8';
            });
            
            elements.embarkBtn.addEventListener('mouseleave', () => {
                gateCursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                gateCursorOutline.style.backgroundColor = '';
                gateCursorOutline.style.opacity = '0.5';
            });
        }
    }
    
    // Check if user has seen intro before
    function checkFirstVisit() {
        hasSeenIntro = localStorage.getItem('aetherlyn_intro_seen') === 'true';
        
        if (hasSeenIntro) {
            setupReturningVisitor();
        } else {
            showGate();
        }
    }
    
    // Setup for returning visitors
    function setupReturningVisitor() {
        // Cek apakah skip button sudah ada
        if (document.querySelector('.skip-btn')) return;
        
        const skipButton = document.createElement('button');
        skipButton.className = 'skip-btn';
        skipButton.innerHTML = '<i class="fas fa-forward"></i> Skip Intro';
        
        // Append langsung ke body
        document.body.appendChild(skipButton);
        
        // Style akan diatur oleh CSS, tapi tambahkan ini untuk safety
        skipButton.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: var(--text-secondary);
            border: 1px solid var(--text-muted);
            padding: 0.6rem 1.2rem;
            border-radius: var(--border-radius);
            cursor: ${isMobileView ? 'pointer' : 'none'};
            font-size: 0.9rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            z-index: 10002;
            pointer-events: all;
        `;
        
        // Hanya tambahkan hover effects untuk desktop
        if (!isMobileView) {
            skipButton.addEventListener('mouseenter', () => {
                skipButton.style.background = 'rgba(76, 201, 240, 0.3)';
                skipButton.style.color = 'var(--accent-primary)';
                skipButton.style.borderColor = 'var(--accent-primary)';
                skipButton.style.transform = 'translateX(-50%) translateY(-2px)';
            });
            
            skipButton.addEventListener('mouseleave', () => {
                skipButton.style.background = 'rgba(0,0,0,0.7)';
                skipButton.style.color = 'var(--text-secondary)';
                skipButton.style.borderColor = 'var(--text-muted)';
                skipButton.style.transform = 'translateX(-50%)';
            });
        }
        
        skipButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            skipIntro();
        });
    }
    
    // Show gate overlay
    function showGate() {
        if (elements.gateOverlay) {
            // Hide main content
            if (elements.mainContent) {
                elements.mainContent.style.opacity = '0';
                elements.mainContent.style.visibility = 'hidden';
            }
            
            // Show gate
            elements.gateOverlay.style.display = 'block';
            elements.gateOverlay.style.visibility = 'visible';
            elements.gateOverlay.style.opacity = '1';
            
            // Hide elemental convergence
            if (elements.elementalConvergence) {
                elements.elementalConvergence.style.display = 'none';
            }
            
            // Add transition setelah delay singkat
            setTimeout(() => {
                elements.gateOverlay.style.transition = 'opacity 0.3s ease';
            }, 10);
        }
    }
    
    // Fade out semua elemen gate (button, symbol, text)
    function fadeOutGateElements() {
        return new Promise((resolve) => {
            if (!elements.gateCenter) {
                resolve();
                return;
            }
            
            console.log('Fading out gate elements...');
            
            // Fade out semua children dari gate-center
            const gateElements = elements.gateCenter.children;
            
            // Terapkan fade out ke semua elemen
            Array.from(gateElements).forEach((element, index) => {
                setTimeout(() => {
                    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                }, index * 100); // Stagger effect
            });
            
            // Fade out gate left dan right juga (tapi jangan hapus)
            if (elements.gateLeft && elements.gateRight) {
                setTimeout(() => {
                    elements.gateLeft.style.opacity = '0.3';
                    elements.gateRight.style.opacity = '0.3';
                    elements.gateLeft.style.transition = 'opacity 1s ease';
                    elements.gateRight.style.transition = 'opacity 1s ease';
                }, 300);
            }
            
            setTimeout(resolve, 1000); // Tunggu 1 detik
        });
    }
    
    // Skip intro
    function skipIntro() {
        isIntroCompleted = true;
        
        console.log('Skipping intro...');
        
        // HAPUS GATE CURSOR (jika ada)
        cleanupGateCursor();
        
        // HAPUS SKIP BUTTON
        const skipButton = document.querySelector('.skip-btn');
        if (skipButton && skipButton.parentNode) {
            skipButton.parentNode.removeChild(skipButton);
        }
        
        // Langsung show main content tanpa animasi
        showMainContent();
    }
    
    // Cleanup gate cursor
    function cleanupGateCursor() {
        // Hapus event listener
        if (elements.handleGateMouseMove) {
            document.removeEventListener('mousemove', elements.handleGateMouseMove);
        }
        
        // Hapus elemen cursor
        if (elements.gateCursorDot && elements.gateCursorDot.parentNode) {
            elements.gateCursorDot.parentNode.removeChild(elements.gateCursorDot);
        }
        if (elements.gateCursorOutline && elements.gateCursorOutline.parentNode) {
            elements.gateCursorOutline.parentNode.removeChild(elements.gateCursorOutline);
        }
        
        // Reset references
        elements.gateCursorDot = null;
        elements.gateCursorOutline = null;
        elements.handleGateMouseMove = null;
    }
    
    // Show main content
    function showMainContent() {
        console.log('Showing main content');
        
        // Cleanup semua elemen intro
        cleanupIntroElements();
        
        if (elements.mainContent) {
            // Show main content
            elements.mainContent.style.opacity = '1';
            elements.mainContent.style.visibility = 'visible';
            elements.mainContent.classList.add('visible');
            
            // Enable scrolling
            document.body.style.overflow = 'auto';
            
            // Initialize main app (yang akan setup cursor utama)
            if (window.MainApp && typeof window.MainApp.init === 'function') {
                window.MainApp.init();
            }
        }
        
        // Mark intro as seen
        localStorage.setItem('aetherlyn_intro_seen', 'true');
    }
    
    // Cleanup semua elemen intro
    function cleanupIntroElements() {
        // Cleanup gate cursor
        cleanupGateCursor();
        
        // Hapus skip button
        const skipButton = document.querySelector('.skip-btn');
        if (skipButton && skipButton.parentNode) {
            skipButton.parentNode.removeChild(skipButton);
        }
        
        // Hapus elemen intro lainnya
        const introElements = [
            '#gateOverlay',
            '#elementalConvergence',
            '.gate-cursor'
        ];
        
        introElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }
    
    // Bind event listeners
    function bindEvents() {
        if (elements.embarkBtn) {
            elements.embarkBtn.addEventListener('click', handleEmbarkClick);
        }
        
        if (elements.gateSymbol) {
            elements.gateSymbol.addEventListener('click', handleGateSymbolClick);
        }
    }
    
    // Handle embark button click dengan ANIMASI LENGKAP
    function handleEmbarkClick() {
        console.log('Embark button clicked, starting full animation...');
        
        isIntroCompleted = true;
        
        // Disable button
        elements.embarkBtn.disabled = true;
        elements.embarkBtn.style.opacity = '0.7';
        elements.embarkBtn.style.cursor = isMobileView ? 'pointer' : 'wait';
        
        // 1. BUKA GERBANG
        console.log('Step 1: Opening gates...');
        elements.gateLeft.classList.add('open');
        elements.gateRight.classList.add('open');
        
        // Shake effect
        elements.gateOverlay.style.animation = 'gateShake 0.5s ease-in-out';
        
        // 2. FADE OUT ELEMEN GATE (button, symbol, text)
        setTimeout(() => {
            console.log('Step 2: Fading out gate elements...');
            fadeOutGateElements().then(() => {
                // 3. TAMPILKAN ELEMENTAL CONVERGENCE
                console.log('Step 3: Showing elemental convergence...');
                
                // Pastikan gate overlay MASIH TERLIHAT (background)
                elements.gateOverlay.style.opacity = '0.7';
                elements.gateOverlay.style.transition = 'opacity 0.5s ease';
                
                // Tampilkan elemental convergence
                elements.elementalConvergence.style.display = 'flex';
                elements.elementalConvergence.style.opacity = '0';
                
                // Fade in convergence
                setTimeout(() => {
                    elements.elementalConvergence.style.opacity = '1';
                    elements.elementalConvergence.style.transition = 'opacity 0.8s ease';
                    elements.elementalConvergence.classList.add('active');
                    
                    // 4. ANIMASI ELEMENTS
                    console.log('Step 4: Animating elements...');
                    setTimeout(() => {
                        animateElements();
                    }, 500);
                }, 100);
            });
        }, 800); // Tunggu gerbang terbuka
    }
    
    // Animate elemental convergence dengan timing yang BENAR
    function animateElements() {
        console.log('Starting element animation...');
        
        const elementsArray = [
            elements.elementFire,
            elements.elementWater,
            elements.elementWind,
            elements.elementEarth
        ];
        
        // 1: Elements muncul
        console.log('Step 4.1: Elements appearing...');
        elementsArray.forEach((element, index) => {
            if (!element) return;
            
            setTimeout(() => {
                element.style.opacity = '0.8';
                element.style.transform = 'scale(1)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            }, index * 200); // Stagger effect
        });
        
        // 2: Elements bergerak ke tengah
        setTimeout(() => {
            console.log('Step 4.2: Elements moving to center...');
            elementsArray.forEach((element) => {
                if (!element) return;
                
                element.style.transition = 'all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                element.style.transform = 'translate(-50%, -50%) scale(1.3)';
            });
            
            // 3: Convergence center muncul
            setTimeout(() => {
                console.log('Step 4.3: Convergence center appearing...');
                if (elements.convergenceCenter) {
                    elements.convergenceCenter.style.opacity = '1';
                    elements.convergenceCenter.style.transform = 'translate(-50%, -50%) scale(1)';
                    elements.convergenceCenter.style.transition = 'all 0.8s ease-out';
                }
                
                // 4: Elements menyatu ke center
                setTimeout(() => {
                    console.log('Step 4.4: Elements merging to center...');
                    elementsArray.forEach((element) => {
                        if (!element) return;
                        
                        element.style.opacity = '0';
                        element.style.transform = 'translate(-50%, -50%) scale(0.1)';
                        element.style.transition = 'all 1s ease';
                    });
                    
                    // 5: Text muncul
                    setTimeout(() => {
                        console.log('Step 4.5: Text appearing...');
                        if (elements.convergenceText) {
                            elements.convergenceText.style.opacity = '1';
                            elements.convergenceText.style.transition = 'opacity 0.8s ease-out';
                        }
                        
                        // 6: SEMUA FADE OUT BERSAMAAN
                        setTimeout(() => {
                            console.log('Step 6: Everything fading out...');
                            
                            // Fade out text
                            if (elements.convergenceText) {
                                setTimeout(() => {
                                    elements.convergenceText.style.opacity = '0';
                                    elements.convergenceText.style.transition = 'opacity 1s ease';
                                }, 300);
                            }
                            
                            // Fade out convergence center
                            if (elements.convergenceCenter) {
                                setTimeout(() => {
                                    elements.convergenceCenter.style.opacity = '0';
                                    elements.convergenceCenter.style.transform = 'translate(-50%, -50%) scale(0.5)';
                                    elements.convergenceCenter.style.transition = 'all 1s ease';
                                }, 400);
                            }
                            
                            // Fade out elemental convergence container
                            if (elements.elementalConvergence) {
                                setTimeout(() => {
                                    console.log('Fading out convergence container...');
                                    elements.elementalConvergence.style.opacity = '0';
                                    elements.elementalConvergence.style.transition = 'opacity 1.2s ease';
                                }, 600);
                            }
                            
                            // Fade out gate overlay (background)
                            if (elements.gateOverlay) {
                                setTimeout(() => {
                                    console.log('Fading out gate overlay...');
                                    elements.gateOverlay.style.opacity = '0';
                                    elements.gateOverlay.style.transition = 'opacity 1.2s ease';
                                }, 800);
                            }
                            
                            // 7: SHOW MAIN CONTENT
                            setTimeout(() => {
                                console.log('Step 7: Showing main content...');
                                showMainContent();
                            }, 1500); // Tunggu semua fade out selesai
                            
                        }, 2000); // Text terlihat 2 detik
                    }, 800); // Tunggu elements merge
                }, 1200); // Tunggu convergence center
            }, 800); // Tunggu elements bergerak ke tengah
        }, 1600); // Tunggu elements muncul (staggered)
    }
    
    // Handle gate symbol click (easter egg)
    function handleGateSymbolClick() {
        gateClickCount++;
        
        if (gateClickCount >= 3 && elements.gateSymbol) {
            elements.gateSymbol.style.animation = 'none';
            elements.gateSymbol.style.background = 'radial-gradient(circle, #ff0000 0%, #ff8800 30%, #ffff00 50%, transparent 70%)';
            elements.gateSymbol.style.boxShadow = '0 0 100px #ff0000';
            elements.gateSymbol.style.transform = 'scale(1.3)';
            
            setTimeout(() => {
                elements.gateSymbol.style.animation = 'symbolPulse 3s infinite';
                elements.gateSymbol.style.background = '';
                elements.gateSymbol.style.boxShadow = '';
                elements.gateSymbol.style.transform = '';
                gateClickCount = 0;
            }, 2000);
        }
    }
    
    // Public API
    return {
        init: init,
        skipIntro: skipIntro,
        restartIntro: function() {
            localStorage.removeItem('aetherlyn_intro_seen');
            location.reload();
        },
        showMainContent: showMainContent
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        GateAnimation.init();
    }, 50);
});

// Debug helper dengan lebih banyak kontrol
window.debugGate = {
    resetIntro: () => {
        localStorage.removeItem('aetherlyn_intro_seen');
        location.reload();
    },
    skipIntro: () => GateAnimation.skipIntro(),
    showMain: () => GateAnimation.showMainContent(),
    testAnimation: () => {
        const btn = document.getElementById('embarkBtn');
        if (btn) btn.click();
    },
    logElements: () => {
        console.log('Gate Elements:');
        console.log('- gateOverlay:', document.getElementById('gateOverlay'));
        console.log('- elementalConvergence:', document.getElementById('elementalConvergence'));
        console.log('- mainContent:', document.getElementById('mainContent'));
    }
};