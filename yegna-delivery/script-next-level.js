// NEXT LEVEL YEGNA DELIVERY JAVASCRIPT

// Initialize page with loader
document.addEventListener('DOMContentLoaded', function() {
    // Create and show loader
    createLoader();
    
    // Initialize all features after load
    window.addEventListener('load', function() {
        setTimeout(() => {
            hideLoader();
            initializeAllFeatures();
        }, 1500);
    });
});

// Create loader
function createLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-icon"></div>
            <div class="loader-text">Loading Yegna Delivery...</div>
        </div>
    `;
    document.body.appendChild(loader);
}

// Hide loader
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }
}

// Initialize all features
function initializeAllFeatures() {
    initGoogleMaps();
    initParallaxEffects();
    initScrollReveal();
    initInteractiveElements();
    initAnimatedCounters();
    initMouseEffects();
    initNavigationEffects();
    initServiceCardEffects();
    initMapInteractions();
    initFormEffects();
    initMobileMenu();
    init3DEffects();
    initParticleEffects();
    console.log('🚀 Yegna Delivery Next Level Experience Loaded!');
}

// Google Maps with custom styling
function initGoogleMaps() {
    try {
        const hawassa = { lat: 7.0477329, lng: 38.4957849 };
        
        // Custom map style
        const mapStyle = [
            {
                "elementType": "geometry",
                "stylers": [{"color": "#212121"}]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#757575"}]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#212121"}]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{"color": "#757575"}]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#757575"}]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{"color": "#181818"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#2c2c2c"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#8a8a8a"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{"color": "#3c3c3c"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#4A90E2"}]
            }
        ];
        
        const map = new google.maps.Map(document.getElementById("hawassa-map"), {
            zoom: 13,
            center: hawassa,
            styles: mapStyle,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true
        });

        // Animated delivery points
        const deliveryPoints = [
            { position: { lat: 7.0477329, lng: 38.4957849 }, title: "Hawassa City Center" },
            { position: { lat: 7.0400, lng: 38.4800 }, title: "Lake Awassa Area" },
            { position: { lat: 7.0600, lng: 38.5100 }, title: "University Area" },
            { position: { lat: 7.0300, lng: 38.5200 }, title: "Industrial Zone" },
            { position: { lat: 7.0700, lng: 38.4700 }, title: "Residential Areas" }
        ];

        deliveryPoints.forEach((point, index) => {
            setTimeout(() => {
                const marker = new google.maps.Marker({
                    position: point.position,
                    map: map,
                    title: point.title,
                    animation: google.maps.Animation.DROP,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#4A90E2",
                        fillOpacity: 0.8,
                        strokeColor: "#ffffff",
                        strokeWeight: 2
                    }
                });

                // Add pulsing effect
                const pulse = new google.maps.Marker({
                    position: point.position,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 20,
                        fillColor: "#4A90E2",
                        fillOpacity: 0.3,
                        strokeColor: "#4A90E2",
                        strokeWeight: 1
                    }
                });

                animatePulse(pulse);

                // Info window with glassmorphism
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div style="
                            background: rgba(255, 255, 255, 0.9);
                            backdrop-filter: blur(10px);
                            padding: 15px;
                            border-radius: 10px;
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                        ">
                            <h3 style="margin: 0 0 10px 0; color: #1E3A8A;">${point.title}</h3>
                            <p style="margin: 0 0 10px 0; color: #666;">Fast delivery available!</p>
                            <button onclick="orderNow('${point.title}')" style="
                                background: linear-gradient(135deg, #4A90E2, #1E3A8A);
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 600;
                            ">Order Now</button>
                        </div>
                    `
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            }, index * 200);
        });

        // Animated delivery coverage
        const deliveryCircle = new google.maps.Circle({
            strokeColor: "#4A90E2",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#4A90E2",
            fillOpacity: 0.1,
            map: map,
            center: hawassa,
            radius: 0
        });

        animateCircle(deliveryCircle, 5000);
        
        document.getElementById('hawassa-map').style.display = 'block';
        document.getElementById('map-fallback').style.display = 'none';
    } catch (error) {
        console.log('Google Maps not available, showing fallback');
        document.getElementById('hawassa-map').style.display = 'none';
        document.getElementById('map-fallback').style.display = 'block';
        initFallbackMapAnimations();
    }
}

// Animate marker pulse
function animatePulse(marker) {
    let scale = 20;
    let opacity = 0.3;
    let growing = true;

    setInterval(() => {
        if (growing) {
            scale += 0.5;
            opacity -= 0.01;
            if (scale >= 40) growing = false;
        } else {
            scale = 20;
            opacity = 0.3;
            growing = true;
        }

        marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: scale,
            fillColor: "#4A90E2",
            fillOpacity: opacity,
            strokeColor: "#4A90E2",
            strokeWeight: 1
        });
    }, 50);
}

// Animate coverage circle
function animateCircle(circle, targetRadius) {
    let currentRadius = 0;
    const increment = targetRadius / 100;

    const interval = setInterval(() => {
        currentRadius += increment;
        circle.setRadius(currentRadius);

        if (currentRadius >= targetRadius) {
            clearInterval(interval);
        }
    }, 20);
}

// Fallback map animations
function initFallbackMapAnimations() {
    const deliveryPoints = document.querySelectorAll('.delivery-point');
    
    deliveryPoints.forEach((point, index) => {
        // Add hover tooltip
        point.addEventListener('mouseenter', function(e) {
            const location = this.getAttribute('data-location');
            showTooltip(e, location);
        });

        point.addEventListener('mouseleave', hideTooltip);

        // Add click animation
        point.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = `pointPulse 2s infinite`;
            }, 10);
            
            const location = this.getAttribute('data-location');
            showLocationModal(location);
        });
    });
}

// Parallax scrolling effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero, .map-section, .services, .app-screenshots');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Scroll reveal animations
function initScrollReveal() {
    const reveals = document.querySelectorAll('.section-header, .service-card, .screenshot-card, .cool-card, .area-item');
    
    reveals.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.8s ease';
        element.style.transitionDelay = `${index * 0.1}s`;
    });

    function reveal() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal();
}

// Interactive elements
function initInteractiveElements() {
    // Button ripple effect
    const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-outline, .btn-service');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple styles
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Animated counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = counter.innerText;
            let count = 0;
            
            // Extract number from text (e.g., "5K+" -> 5000)
            let targetNumber = 0;
            if (target.includes('K+')) {
                targetNumber = parseInt(target) * 1000;
            } else if (target.includes('%')) {
                targetNumber = parseInt(target);
            } else if (target.includes('min')) {
                targetNumber = parseInt(target);
            } else {
                targetNumber = parseInt(target) || 0;
            }

            const increment = targetNumber / speed;

            const updateCounter = () => {
                count += increment;
                
                if (count < targetNumber) {
                    if (target.includes('K+')) {
                        counter.innerText = Math.floor(count / 1000) + 'K+';
                    } else if (target.includes('%')) {
                        counter.innerText = Math.floor(count) + '%';
                    } else if (target.includes('min')) {
                        counter.innerText = Math.floor(count) + 'min';
                    } else {
                        counter.innerText = Math.floor(count);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        };

        // Trigger animation when in viewport
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter);
    });
}

// Mouse trail effect
function initMouseEffects() {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;

        trail.style.transform = `translate(${trailX - 10}px, ${trailY - 10}px)`;
        
        requestAnimationFrame(animateTrail);
    }

    animateTrail();

    // Add trail styles
    const style = document.createElement('style');
    style.textContent = `
        .mouse-trail {
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(74, 144, 226, 0.5) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            mix-blend-mode: screen;
        }
    `;
    document.head.appendChild(style);
}

// Navigation scroll effects
function initNavigationEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        if (currentScroll > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = '0 8px 32px 0 rgba(74, 144, 226, 0.3)';
        } else {
            header.style.background = 'rgba(15, 15, 15, 0.8)';
            header.style.boxShadow = '0 8px 32px 0 rgba(74, 144, 226, 0.2)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = 80;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Service card 3D effects
function initServiceCardEffects() {
    const cards = document.querySelectorAll('.cool-service');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Enhanced map interactions
function initMapInteractions() {
    const mapWrapper = document.querySelector('.map-wrapper');
    
    if (mapWrapper) {
        mapWrapper.addEventListener('mousemove', (e) => {
            const rect = mapWrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const tiltX = (y - 0.5) * 10;
            const tiltY = (0.5 - x) * 10;
            
            mapWrapper.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });

        mapWrapper.addEventListener('mouseleave', () => {
            mapWrapper.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(-5deg)';
        });
    }
}

// Form input effects
function initFormEffects() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Create floating label
        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        const label = document.createElement('label');
        label.textContent = input.placeholder;
        label.className = 'floating-label';
        wrapper.appendChild(label);
        
        input.addEventListener('focus', () => {
            label.classList.add('active');
            wrapper.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                label.classList.remove('active');
            }
            wrapper.classList.remove('focused');
        });
    });
}

// Mobile menu
function initMobileMenu() {
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav');
        const navLinks = document.querySelector('.nav-links');
        
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                const toggle = document.createElement('button');
                toggle.className = 'mobile-menu-toggle';
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
                toggle.style.cssText = `
                    display: block;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: white;
                    cursor: pointer;
                    z-index: 1001;
                `;
                
                nav.insertBefore(toggle, navLinks);
                
                toggle.addEventListener('click', () => {
                    navLinks.classList.toggle('mobile-active');
                    toggle.innerHTML = navLinks.classList.contains('mobile-active') 
                        ? '<i class="fas fa-times"></i>' 
                        : '<i class="fas fa-bars"></i>';
                });

                // Add mobile menu styles
                const style = document.createElement('style');
                style.textContent = `
                    @media (max-width: 768px) {
                        .nav-links {
                            display: none;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            right: 0;
                            background: rgba(15, 15, 15, 0.95);
                            backdrop-filter: blur(20px);
                            flex-direction: column;
                            padding: 2rem;
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                        }
                        
                        .nav-links.mobile-active {
                            display: flex;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (toggle) toggle.remove();
            if (navLinks) navLinks.classList.remove('mobile-active');
        }
    };

    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);
}

// 3D tilt effects
function init3DEffects() {
    const tiltElements = document.querySelectorAll('.cool-card, .screenshot-card, .hours-card');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;
            
            const rotateX = percentY * 10;
            const rotateY = percentX * 10;
            
            element.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            
            // Move gradient
            const gradient = element.querySelector('::before');
            if (gradient) {
                gradient.style.transform = `translate(${percentX * 30}px, ${percentY * 30}px)`;
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// Particle effects
function initParticleEffects() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);

    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(74, 144, 226, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
            z-index: 1;
        `;
        particleContainer.appendChild(particle);
    }

    // Add particle animation styles
    const style = document.createElement('style');
    style.textContent = `
        .particle-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Helper functions
function showTooltip(e, text) {
    let tooltip = document.querySelector('.custom-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = e.pageX + 10 + 'px';
    tooltip.style.top = e.pageY + 10 + 'px';
    
    // Add tooltip styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            pointer-events: none;
            z-index: 9999;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
    `;
    if (!document.querySelector('style[data-tooltip]')) {
        style.setAttribute('data-tooltip', 'true');
        document.head.appendChild(style);
    }
}

function hideTooltip() {
    const tooltip = document.querySelector('.custom-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

function showLocationModal(location) {
    const modal = document.createElement('div');
    modal.className = 'location-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${location}</h3>
            <p>Fast delivery available in this area!</p>
            <div class="modal-features">
                <div class="feature">
                    <i class="fas fa-clock"></i>
                    <span>15-30 min delivery</span>
                </div>
                <div class="feature">
                    <i class="fas fa-motorcycle"></i>
                    <span>Professional riders</span>
                </div>
                <div class="feature">
                    <i class="fas fa-shield-alt"></i>
                    <span>Safe & secure</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-primary" onclick="orderNow('${location}')">Order Now</button>
                <button class="btn-outline" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .location-modal {
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
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            backdrop-filter: blur(20px);
            padding: 3rem;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            max-width: 500px;
            text-align: center;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-content h3 {
            color: white;
            font-size: 2rem;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px rgba(74, 144, 226, 0.5);
        }
        
        .modal-content p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
        }
        
        .modal-features {
            display: flex;
            justify-content: space-around;
            margin-bottom: 2rem;
            gap: 1rem;
        }
        
        .feature {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
        
        .feature i {
            font-size: 2rem;
            color: var(--secondary-color);
            filter: drop-shadow(0 0 10px rgba(74, 144, 226, 0.5));
        }
        
        .feature span {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
    `;
    if (!document.querySelector('style[data-modal]')) {
        style.setAttribute('data-modal', 'true');
        document.head.appendChild(style);
    }
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Global functions
window.closeModal = function() {
    const modal = document.querySelector('.location-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
};

window.orderNow = function(location) {
    closeModal();
    showNotification(`Redirecting to order page for ${location}...`, 'success');
    setTimeout(() => {
        showNotification('Download our app to start ordering!', 'info');
    }, 2000);
};

window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #3B82F6, #2563EB)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
};

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-content i {
        font-size: 1.25rem;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyle);