// Ultra Modern Yegna Delivery - Next Level JavaScript

// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Global Variables
let isLoading = true;
let particles = [];
let mouseX = 0;
let mouseY = 0;
let currentTheme = 'dark';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    initLoadingScreen();
    initParticleSystem();
    initScrollAnimations();
    initInteractiveElements();
    initMobileMenu();
    initCounterAnimations();
    initMapInteractions();
    initPhoneAnimations();
    initAdvancedEffects();
    initMouseTracker();
    initKeyboardShortcuts();
    initPerformanceOptimizations();
    
    console.log('🚀 Yegna Delivery Ultra Modern Website Loaded!');
}

// Loading Screen with Advanced Animations
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.querySelector('.progress-bar');
    
    if (!loadingScreen) return;
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Hide loading screen with smooth animation
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'visible';
                isLoading = false;
                
                // Trigger hero animations
                triggerHeroAnimations();
            }, 500);
        }
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }, 100);
}

// Advanced Particle System
function initParticleSystem() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
    
    // Animate particles
    animateParticles();
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight + 50;
    const duration = Math.random() * 10 + 15;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
    particles.push(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            const index = particles.indexOf(particle);
            if (index > -1) particles.splice(index, 1);
            
            // Create new particle
            if (!isLoading) createParticle(container);
        }
    }, (duration + delay) * 1000);
}

function animateParticles() {
    particles.forEach((particle, index) => {
        if (particle.parentNode) {
            const rect = particle.getBoundingClientRect();
            const distanceFromMouse = Math.sqrt(
                Math.pow(rect.left - mouseX, 2) + Math.pow(rect.top - mouseY, 2)
            );
            
            if (distanceFromMouse < 100) {
                const force = (100 - distanceFromMouse) / 100;
                const angle = Math.atan2(rect.top - mouseY, rect.left - mouseX);
                const pushX = Math.cos(angle) * force * 20;
                const pushY = Math.sin(angle) * force * 20;
                
                particle.style.transform = `translate(${pushX}px, ${pushY}px)`;
            } else {
                particle.style.transform = 'translate(0, 0)';
            }
        }
    });
    
    requestAnimationFrame(animateParticles);
}

// Hero Animations with GSAP
function triggerHeroAnimations() {
    const tl = gsap.timeline();
    
    // Animate hero content
    tl.from('.hero-badge', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    })
    .from('.title-line', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power2.out'
    }, '-=0.8')
    .from('.hero-stats .stat-item', {
        duration: 0.8,
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    }, '-=0.5')
    .from('.hero-actions .btn-primary, .hero-actions .btn-outline', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out'
    }, '-=0.3');
    
    // Animate floating elements
    gsap.from('.floating-icon', {
        duration: 2,
        scale: 0,
        rotation: 360,
        stagger: 0.3,
        ease: 'elastic.out(1, 0.5)',
        delay: 1
    });
}

// Advanced Scroll Animations
function initScrollAnimations() {
    // Section animations
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            duration: 1,
            y: 80,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Service cards animation
    gsap.utils.toArray('.ultra-modern').forEach((card, index) => {
        gsap.from(card, {
            duration: 1.2,
            y: 100,
            opacity: 0,
            rotation: 5,
            scale: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse'
            },
            delay: index * 0.2
        });
    });
    
    // Map animation
    gsap.from('.map-wrapper', {
        duration: 1.5,
        scale: 0.8,
        opacity: 0,
        rotationY: -15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.map-wrapper',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Phone animations
    gsap.utils.toArray('.phone-mockup').forEach((phone, index) => {
        gsap.from(phone, {
            duration: 1.5,
            y: 150,
            opacity: 0,
            rotation: index % 2 === 0 ? -10 : 10,
            scale: 0.7,
            ease: 'elastic.out(1, 0.8)',
            scrollTrigger: {
                trigger: phone,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse'
            },
            delay: index * 0.3
        });
    });
    
    // Feature items animation
    gsap.utils.toArray('.feature-item').forEach((item, index) => {
        gsap.from(item, {
            duration: 1,
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse'
            },
            delay: index * 0.1
        });
    });
}

// Interactive Elements
function initInteractiveElements() {
    // Enhanced button interactions
    document.querySelectorAll('.btn-primary, .btn-outline, .btn-service').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                y: -5,
                ease: 'power2.out'
            });
            
            // Add ripple effect
            createRippleEffect(this, event);
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                y: 0,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('click', function(e) {
            // Click animation
            gsap.to(this, {
                duration: 0.1,
                scale: 0.95,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
            });
            
            // Handle different button actions
            handleButtonClick(this, e);
        });
    });
    
    // Service card interactions
    document.querySelectorAll('.ultra-modern').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.5,
                y: -20,
                rotationY: 5,
                scale: 1.02,
                ease: 'power2.out'
            });
            
            // Animate icon
            const icon = this.querySelector('.service-icon');
            if (icon) {
                gsap.to(icon, {
                    duration: 0.5,
                    rotation: 360,
                    scale: 1.1,
                    ease: 'power2.out'
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.5,
                y: 0,
                rotationY: 0,
                scale: 1,
                ease: 'power2.out'
            });
            
            const icon = this.querySelector('.service-icon');
            if (icon) {
                gsap.to(icon, {
                    duration: 0.5,
                    rotation: 0,
                    scale: 1,
                    ease: 'power2.out'
                });
            }
        });
    });
    
    // Navigation link interactions
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll with custom easing
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: targetSection,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
                
                // Update active link
                updateActiveNavLink(this);
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggle || !navLinks) return;
    
    toggle.addEventListener('click', function() {
        const isActive = navLinks.classList.contains('active');
        
        if (isActive) {
            // Close menu
            gsap.to(navLinks, {
                duration: 0.3,
                opacity: 0,
                y: -20,
                ease: 'power2.out',
                onComplete: () => {
                    navLinks.classList.remove('active');
                }
            });
            
            // Animate toggle
            gsap.to(toggle.children, {
                duration: 0.3,
                rotation: 0,
                y: 0,
                stagger: 0.1,
                ease: 'power2.out'
            });
        } else {
            // Open menu
            navLinks.classList.add('active');
            gsap.fromTo(navLinks, 
                { opacity: 0, y: -20 },
                {
                    duration: 0.3,
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out'
                }
            );
            
            // Animate toggle to X
            gsap.to(toggle.children[0], {
                duration: 0.3,
                rotation: 45,
                y: 7,
                ease: 'power2.out'
            });
            gsap.to(toggle.children[1], {
                duration: 0.3,
                opacity: 0,
                ease: 'power2.out'
            });
            gsap.to(toggle.children[2], {
                duration: 0.3,
                rotation: -45,
                y: -7,
                ease: 'power2.out'
            });
        }
    });
}

// Counter Animations
function initCounterAnimations() {
    document.querySelectorAll('[data-count]').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(counter, {
                    duration: 2,
                    innerHTML: target,
                    ease: 'power2.out',
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        counter.innerHTML = Math.ceil(counter.innerHTML);
                    }
                });
            }
        });
    });
}

// Map Interactions
function initMapInteractions() {
    const deliveryPoints = document.querySelectorAll('.delivery-point');
    const mapWrapper = document.querySelector('.map-wrapper');
    
    deliveryPoints.forEach((point, index) => {
        point.addEventListener('mouseenter', function() {
            const location = this.getAttribute('data-location');
            
            // Scale animation
            gsap.to(this, {
                duration: 0.3,
                scale: 1.3,
                ease: 'power2.out'
            });
            
            // Show tooltip
            showLocationTooltip(this, location);
            
            // Highlight corresponding area in info panel
            highlightAreaInfo(index);
        });
        
        point.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
            
            hideLocationTooltip();
            unhighlightAreaInfo();
        });
        
        point.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            showLocationDetails(location);
        });
    });
    
    // Map hover effect
    if (mapWrapper) {
        mapWrapper.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.5,
                rotationY: 0,
                rotationX: 0,
                scale: 1.02,
                ease: 'power2.out'
            });
        });
        
        mapWrapper.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.5,
                rotationY: -2,
                rotationX: 2,
                scale: 1,
                ease: 'power2.out'
            });
        });
    }
}

// Phone Animations
function initPhoneAnimations() {
    const phones = document.querySelectorAll('.phone-mockup');
    
    phones.forEach((phone, index) => {
        phone.addEventListener('mouseenter', function() {
            // Scale and rotate
            gsap.to(this, {
                duration: 0.5,
                scale: 1.1,
                rotation: 0,
                y: -30,
                z: 50,
                ease: 'power2.out'
            });
            
            // Enhance glow
            const glow = this.querySelector('.phone-glow');
            if (glow) {
                gsap.to(glow, {
                    duration: 0.5,
                    opacity: 0.8,
                    scale: 1.2,
                    ease: 'power2.out'
                });
            }
            
            // Bring to front
            this.style.zIndex = '100';
        });
        
        phone.addEventListener('mouseleave', function() {
            // Reset transformations
            const originalTransforms = {
                0: { y: -20, rotation: -5, scale: 1 },
                1: { y: 0, rotation: 0, scale: 1.1 },
                2: { y: -20, rotation: 5, scale: 1 }
            };
            
            const original = originalTransforms[index] || { y: 0, rotation: 0, scale: 1 };
            
            gsap.to(this, {
                duration: 0.5,
                ...original,
                z: 0,
                ease: 'power2.out'
            });
            
            const glow = this.querySelector('.phone-glow');
            if (glow) {
                gsap.to(glow, {
                    duration: 0.5,
                    opacity: 0.3,
                    scale: 1,
                    ease: 'power2.out'
                });
            }
            
            // Reset z-index
            setTimeout(() => {
                this.style.zIndex = index + 1;
            }, 500);
        });
    });
}

// Advanced Effects
function initAdvancedEffects() {
    // Parallax effect for hero background
    gsap.to('.hero-gradient-orbs .orb', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Floating elements parallax
    gsap.to('.floating-icon', {
        y: -100,
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });
    
    // Header background change on scroll
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
            className: 'scrolled',
            targets: '.header'
        }
    });
    
    // Text reveal animations
    gsap.utils.toArray('.section-title').forEach(title => {
        const chars = title.textContent.split('');
        title.innerHTML = chars.map(char => `<span class="char">${char}</span>`).join('');
        
        gsap.from(title.querySelectorAll('.char'), {
            duration: 0.8,
            opacity: 0,
            y: 50,
            rotationX: -90,
            stagger: 0.02,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Mouse Tracker
function initMouseTracker() {
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update cursor follower
        updateCursorFollower(e);
        
        // Parallax effect for floating elements
        const floatingElements = document.querySelectorAll('.floating-icon');
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mouseX - window.innerWidth / 2) * speed;
            const y = (mouseY - window.innerHeight / 2) * speed;
            
            gsap.to(element, {
                duration: 1,
                x: x,
                y: y,
                ease: 'power2.out'
            });
        });
    });
}

// Cursor Follower
function updateCursorFollower(e) {
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) {
        createCursorFollower();
        return;
    }
    
    gsap.to(cursor, {
        duration: 0.3,
        left: e.clientX,
        top: e.clientY,
        ease: 'power2.out'
    });
}

function createCursorFollower() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(74, 144, 226, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC to close mobile menu
        if (e.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            scrollToNextSection();
        }
        
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            scrollToPrevSection();
        }
    });
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Preload critical resources
    preloadCriticalResources();
}

// Utility Functions
function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    gsap.to(ripple, {
        duration: 0.6,
        scale: 2,
        opacity: 0,
        ease: 'power2.out',
        onComplete: () => {
            ripple.remove();
        }
    });
}

function handleButtonClick(button, event) {
    const text = button.textContent.trim();
    
    if (text.includes('Order Now') || text.includes('Download App')) {
        showNotification('🚀 Redirecting to app store...', 'success');
        if (text.includes('Download App')) {
            // Actual app store link
            window.open('https://play.google.com/store/apps/details?id=com.yegnadelivery.yegna_delivery&hl=en-US', '_blank');
        }
    } else if (text.includes('Call') || text.includes('Phone')) {
        showNotification('📞 Call +251 985 640 666', 'info');
        // Trigger phone call on mobile
        if (/Android|iPhone/i.test(navigator.userAgent)) {
            window.location.href = 'tel:+251985640666';
        }
    } else if (text.includes('WhatsApp')) {
        showNotification('💬 Opening WhatsApp...', 'success');
        window.open('https://wa.me/251985640666', '_blank');
    } else if (text.includes('Track Order')) {
        showNotification('📦 Order tracking coming soon!', 'info');
    }
}

function showLocationTooltip(element, location) {
    const tooltip = document.createElement('div');
    tooltip.className = 'location-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h4>${location}</h4>
            <p>Active delivery zone</p>
            <div class="tooltip-stats">
                <span>⚡ 15min avg</span>
                <span>✅ Available now</span>
            </div>
        </div>
    `;
    
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        min-width: 200px;
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    
    // Animate in
    gsap.to(tooltip, {
        duration: 0.3,
        opacity: 1,
        y: 0,
        ease: 'power2.out'
    });
    
    // Store reference for cleanup
    element._tooltip = tooltip;
}

function hideLocationTooltip() {
    const tooltips = document.querySelectorAll('.location-tooltip');
    tooltips.forEach(tooltip => {
        gsap.to(tooltip, {
            duration: 0.3,
            opacity: 0,
            y: 10,
            ease: 'power2.out',
            onComplete: () => tooltip.remove()
        });
    });
}

function highlightAreaInfo(index) {
    const areaItems = document.querySelectorAll('.area-item');
    if (areaItems[index]) {
        gsap.to(areaItems[index], {
            duration: 0.3,
            backgroundColor: 'rgba(74, 144, 226, 0.2)',
            scale: 1.02,
            ease: 'power2.out'
        });
    }
}

function unhighlightAreaInfo() {
    const areaItems = document.querySelectorAll('.area-item');
    areaItems.forEach(item => {
        gsap.to(item, {
            duration: 0.3,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            scale: 1,
            ease: 'power2.out'
        });
    });
}

function showLocationDetails(location) {
    const modal = createModal(`
        <div class="modal-header">
            <h3>📍 ${location}</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="location-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Average delivery: 15 minutes</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-check-circle"></i>
                    <span>Status: Active</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-motorcycle"></i>
                    <span>5 drivers nearby</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-star"></i>
                    <span>4.9/5 customer rating</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-primary">Order Now</button>
                <button class="btn-outline">View Menu</button>
            </div>
        </div>
    `);
    
    showModal(modal);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        min-width: 250px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto hide
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        info: 'linear-gradient(135deg, #4A90E2 0%, #1E3A8A 100%)'
    };
    return colors[type] || colors.info;
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    return modal;
}

function showModal(modal) {
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
    }, 100);
    
    // Close handlers
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => hideModal(modal));
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
        }
    });
}

function hideModal(modal) {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    document.body.style.overflow = 'visible';
    
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function scrollToNextSection() {
    const sections = document.querySelectorAll('section[id]');
    const currentScroll = window.pageYOffset;
    
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop - 100;
        
        if (sectionTop > currentScroll) {
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: section, offsetY: 80 },
                ease: 'power2.inOut'
            });
            break;
        }
    }
}

function scrollToPrevSection() {
    const sections = document.querySelectorAll('section[id]');
    const currentScroll = window.pageYOffset;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop - 100;
        
        if (sectionTop < currentScroll - 200) {
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: section, offsetY: 80 },
                ease: 'power2.inOut'
            });
            break;
        }
    }
}

function handleResize() {
    // Recalculate particle positions
    particles.forEach(particle => {
        if (particle.parentNode) {
            const x = Math.random() * window.innerWidth;
            particle.style.left = `${x}px`;
        }
    });
    
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
}

function preloadCriticalResources() {
    const criticalImages = [
        './logo.png',
        './s1.jpg',
        './s2.jpg',
        './s3.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Google Maps Integration (Enhanced)
function initMap() {
    try {
        const hawassa = { lat: 7.0477329, lng: 38.4957849 };
        
        const map = new google.maps.Map(document.getElementById("hawassa-map"), {
            zoom: 13,
            center: hawassa,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    featureType: "all",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#1a1a1a" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#4A90E2" }]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#2a2a2a" }]
                },
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#ffffff" }]
                }
            ]
        });

        const deliveryPoints = [
            {
                position: { lat: 7.0477329, lng: 38.4957849 },
                title: "Hawassa City Center",
                icon: createCustomMarker('#4A90E2')
            },
            {
                position: { lat: 7.0400, lng: 38.4800 },
                title: "Lake Awassa Area",
                icon: createCustomMarker('#60A5FA')
            },
            {
                position: { lat: 7.0600, lng: 38.5100 },
                title: "University Area",
                icon: createCustomMarker('#10B981')
            },
            {
                position: { lat: 7.0300, lng: 38.5200 },
                title: "Industrial Zone",
                icon: createCustomMarker('#F59E0B')
            },
            {
                position: { lat: 7.0700, lng: 38.4700 },
                title: "Residential Areas",
                icon: createCustomMarker('#EF4444')
            }
        ];

        deliveryPoints.forEach(point => {
            const marker = new google.maps.Marker({
                position: point.position,
                map: map,
                title: point.title,
                icon: point.icon,
                animation: google.maps.Animation.DROP
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 15px; background: #1a1a1a; color: white; border-radius: 8px;">
                        <h3 style="margin: 0 0 10px 0; color: #4A90E2;">${point.title}</h3>
                        <p style="margin: 0 0 10px 0; color: #ccc;">⚡ 15min average delivery</p>
                        <p style="margin: 0 0 15px 0; color: #10B981;">✅ Available now</p>
                        <button onclick="handleOrderClick('${point.title}')" style="
                            background: linear-gradient(135deg, #4A90E2, #1E3A8A);
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Order Now</button>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
        });

        const deliveryArea = new google.maps.Circle({
            strokeColor: "#4A90E2",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#4A90E2",
            fillOpacity: 0.1,
            map: map,
            center: hawassa,
            radius: 5000
        });
        
        document.getElementById('hawassa-map').style.display = 'block';
        document.getElementById('map-fallback').style.display = 'none';
    } catch (error) {
        console.log('Google Maps not available, showing fallback');
        document.getElementById('hawassa-map').style.display = 'none';
        document.getElementById('map-fallback').style.display = 'block';
    }
}

function createCustomMarker(color) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 8
    };
}

function handleOrderClick(location) {
    showNotification(`🚀 Ordering from ${location}...`, 'success');
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-container {
        background: rgba(26, 26, 26, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }
    
    .modal-overlay[style*="opacity: 1"] .modal-container {
        transform: scale(1);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .modal-header h3 {
        color: white;
        margin: 0;
        font-size: 1.5rem;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-size: 2rem;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .modal-close:hover {
        color: white;
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .location-details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .detail-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: rgba(255, 255, 255, 0.8);
    }
    
    .detail-item i {
        color: #4A90E2;
        width: 20px;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .tooltip-stats {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
        font-size: 0.8rem;
        opacity: 0.8;
    }
`;

document.head.appendChild(modalStyles);

// Export for global access
window.YegnaDelivery = {
    showNotification,
    showLocationDetails,
    handleOrderClick
};

console.log('🎉 Yegna Delivery Ultra Modern Website - Fully Loaded! 🚀');