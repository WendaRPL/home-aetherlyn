// Performance Optimizations
const PerformanceManager = {
    // Lazy load non-critical elements
    lazyLoadImages: function() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading-placeholder');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },
    
    // Debounce scroll events
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle resize events
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Optimize animations
    optimizeAnimations: function() {
        // Use requestAnimationFrame for smooth animations
        let ticking = false;
        
        const update = function() {
            // Animation updates here
            ticking = false;
        };
        
        const requestTick = function() {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };
        
        return { requestTick };
    },
    
    // Memory management
    cleanup: function() {
        // Remove event listeners when not needed
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
    },
    
    // Monitor memory usage
    monitorMemory: function() {
        if ('memory' in performance) {
            setInterval(() => {
                const used = performance.memory.usedJSHeapSize;
                const limit = performance.memory.jsHeapSizeLimit;
                const percent = (used / limit * 100).toFixed(2);
                
                if (percent > 80) {
                    console.warn(`High memory usage: ${percent}%`);
                    // Trigger garbage collection if needed
                    if (window.gc) window.gc();
                }
            }, 30000);
        }
    },
    
    init: function() {
        // Only initialize on desktop by default
        if (window.innerWidth > 768) {
            this.lazyLoadImages();
            this.monitorMemory();
        }
        
        // Clean up on page hide
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanup();
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PerformanceManager.init();
});