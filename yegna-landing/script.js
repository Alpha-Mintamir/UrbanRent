// ============================================
// YEGNA DELIVERY - ULTRA MODERN JAVASCRIPT
// ============================================

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', function() {
    const loadingScreen = document.querySelector('.loading-screen');
    const progress = document.querySelector('.loading-progress');
    
    // Simulate loading
    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 30;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            
            // Hide loading screen
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                initializeAnimations();
            }, 500);
        }
        progress.style.width = loadProgress + '%';
    }, 200);
});

// ============================================
// PARTICLES.JS CONFIGURATION
// ============================================
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#4A90E2', '#1E3A8A', '#60A5FA']
            },
            shape: {
                type: ['circle', 'triangle'],
                stroke: {
                    width: 0
                }
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 4,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#4A90E2',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// ============================================
// CUSTOM CURSOR
// ============================================
const cursorFollower = document.querySelector('.cursor-follower');
const cursorDot = document.querySelector('.cursor-dot');

if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .delivery-point, .service-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 500) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLL & ACTIVE NAV
// ============================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
function highlightNavItem() {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavItem);

// ============================================
// MOBILE MENU
// ============================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate numbers when visible
                if (entry.target.classList.contains('stat-number')) {
                    const targetValue = parseInt(entry.target.getAttribute('data-target'));
                    if (targetValue) {
                        animateCounter(entry.target, targetValue);
                    }
                }
                
                // Animate words
                if (entry.target.classList.contains('title-word')) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.service-card, .screenshot-card, .area-item, .title-word');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Observe stat numbers
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(stat => observer.observe(stat));
}

// ============================================
// HERO STAT NUMBERS ANIMATION
// ============================================
const heroStatNumbers = document.querySelectorAll('.hero-stats .stat-number');
heroStatNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    if (target) {
        setTimeout(() => {
            animateCounter(stat, target);
        }, 1000);
    }
});

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple-effect');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleAnimation 0.6s ease-out';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
document.querySelectorAll('.btn-magnetic').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// DELIVERY POINT INTERACTIONS
// ============================================
const deliveryPoints = document.querySelectorAll('.delivery-point');
deliveryPoints.forEach(point => {
    point.addEventListener('click', function() {
        const location = this.getAttribute('data-location');
        showLocationModal(location);
    });
    
    point.addEventListener('mouseenter', function() {
        this.style.zIndex = '20';
        createParticles(this);
    });
});

function showLocationModal(location) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'location-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-icon">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <h3>${location}</h3>
            <p>We deliver to this area! Order now and get your items delivered fast.</p>
            <div class="modal-stats">
                <div class="modal-stat">
                    <i class="fas fa-clock"></i>
                    <span>15-30 min</span>
                </div>
                <div class="modal-stat">
                    <i class="fas fa-motorcycle"></i>
                    <span>Active</span>
                </div>
            </div>
            <button class="btn-primary btn-large">
                <i class="fas fa-shopping-cart"></i>
                Order Now
            </button>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-content {
        background: white;
        padding: 3rem;
        border-radius: 24px;
        max-width: 500px;
        text-align: center;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #6B7280;
        transition: color 0.3s ease;
    }
    
    .modal-close:hover {
        color: #1E3A8A;
    }
    
    .modal-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #4A90E2, #1E3A8A);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        font-size: 2rem;
        color: white;
    }
    
    .modal-content h3 {
        font-size: 1.75rem;
        font-weight: 800;
        color: #1F2937;
        margin-bottom: 1rem;
    }
    
    .modal-content p {
        color: #6B7280;
        margin-bottom: 2rem;
        line-height: 1.6;
    }
    
    .modal-stats {
        display: flex;
        gap: 2rem;
        justify-content: center;
        margin-bottom: 2rem;
    }
    
    .modal-stat {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: #1E3A8A;
    }
    
    .modal-stat i {
        font-size: 1.25rem;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(modalStyles);

// ============================================
// CREATE PARTICLES ON HOVER
// ============================================
function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#4A90E2', '#1E3A8A', '#60A5FA'];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 5;
        const velocity = 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        const animate = () => {
            x += vx;
            y += vy;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// ============================================
// SERVICE CARD TILT EFFECT
// ============================================
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
});

// ============================================
// SCREENSHOT CAROUSEL AUTO-PLAY
// ============================================
const screenshotCards = document.querySelectorAll('.screenshot-card');
let currentScreenshot = 0;

function rotateScreenshots() {
    screenshotCards.forEach((card, index) => {
        if (index === currentScreenshot) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        } else {
            card.style.opacity = '0.6';
            card.style.transform = 'translateY(10px) scale(0.95)';
        }
    });
    
    currentScreenshot = (currentScreenshot + 1) % screenshotCards.length;
}

// Auto-rotate every 4 seconds
setInterval(rotateScreenshots, 4000);

// ============================================
// PARALLAX EFFECT
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Hero parallax
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Floating elements
    const floatItems = document.querySelectorAll('.float-item');
    floatItems.forEach((item, index) => {
        const speed = 0.1 + (index * 0.05);
        item.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ============================================
// GOOGLE MAPS INTEGRATION
// ============================================
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
                    stylers: [{ color: "#f5f5f5" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#60A5FA" }]
                },
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#ffffff" }]
                },
                {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [{ visibility: "simplified" }]
                }
            ]
        });

        const deliveryPoints = [
            {
                position: { lat: 7.0477329, lng: 38.4957849 },
                title: "Hawassa City Center",
                icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            },
            {
                position: { lat: 7.0400, lng: 38.4800 },
                title: "Lake Awassa Area",
                icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            },
            {
                position: { lat: 7.0600, lng: 38.5100 },
                title: "University Area",
                icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            },
            {
                position: { lat: 7.0300, lng: 38.5200 },
                title: "Industrial Zone",
                icon: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
            },
            {
                position: { lat: 7.0700, lng: 38.4700 },
                title: "Residential Areas",
                icon: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png"
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
                    <div style="padding: 15px; min-width: 200px;">
                        <h3 style="margin: 0 0 10px 0; color: #1E3A8A; font-size: 1.25rem;">${point.title}</h3>
                        <p style="margin: 0 0 15px 0; color: #666; font-size: 0.95rem;">Delivery available here!</p>
                        <button onclick="window.location.href='https://play.google.com/store/apps/details?id=com.yegnadelivery.yegna_delivery&hl=en-US'" style="
                            background: linear-gradient(135deg, #4A90E2, #1E3A8A);
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 0.9rem;
                            font-weight: 600;
                            width: 100%;
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

// Initialize map fallback by default
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('hawassa-map')) {
        document.getElementById('hawassa-map').style.display = 'none';
        document.getElementById('map-fallback').style.display = 'block';
    }
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info', duration = 5000) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        info: '#3B82F6',
        warning: '#F59E0B'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 350px;
        animation: slideIn 0.5s ease forwards;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 400);
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 400);
        }
    }, duration);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-content i {
        font-size: 1.5rem;
    }
    
    .notification-content span {
        flex: 1;
        font-weight: 500;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ============================================
// BUTTON CLICK HANDLERS
// ============================================
document.addEventListener('click', function(e) {
    const target = e.target.closest('button, a');
    if (!target) return;
    
    const text = target.textContent.toLowerCase();
    
    if (text.includes('order now') || text.includes('download')) {
        if (text.includes('download')) {
            showNotification('Redirecting to Google Play Store...', 'info');
        } else {
            showNotification('Order system coming soon! Call +251 985 640 666 to order.', 'info');
        }
    } else if (text.includes('call') || text.includes('+251')) {
        showNotification('Call us at +251 985 640 666 for instant orders!', 'success');
    } else if (text.includes('whatsapp')) {
        showNotification('WhatsApp feature coming soon!', 'info');
    } else if (text.includes('track')) {
        showNotification('Real-time tracking available in our mobile app!', 'info');
    }
});

// ============================================
// EASTER EGG - KONAMI CODE
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 SUPER DELIVERY MODE ACTIVATED! You found the secret!', 'success', 10000);
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
    }
});

// Rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c🚀 Yegna Delivery', 'font-size: 24px; font-weight: bold; color: #4A90E2;');
console.log('%cUltra Modern Landing Page Loaded Successfully!', 'font-size: 14px; color: #1E3A8A;');
console.log('%cMade with ❤️ in Hawassa, Ethiopia', 'font-size: 12px; color: #6B7280;');
console.log('%cTip: Try the Konami Code! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'font-size: 10px; color: #10B981;');
