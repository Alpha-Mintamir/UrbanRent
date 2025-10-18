// Yegna Delivery Landing — Elevated Interactions
(function () {
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll progress
  const progress = $('#scroll-progress');
  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const width = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    if (progress) progress.style.width = width + '%';

    // Shrink header
    const header = $('.header');
    if (header) header.classList.toggle('shrink', scrollTop > 10);

    // Active nav
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 140; // header height margin
      if (scrollTop >= top) current = section.getAttribute('id');
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll
  $$('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = $(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const nav = $('#nav-links');
        if (nav && nav.classList.contains('open')) nav.classList.remove('open');
      }
    });
  });

  // Mobile menu
  const menuToggle = $('.menu-toggle');
  const navLinks = $('#nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Theme toggle
  const themeToggle = $('#theme-toggle');
  const applyTheme = (t) => document.body.classList.toggle('dark', t === 'dark');
  const stored = localStorage.getItem('yegna-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.body.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('yegna-theme', next);
      themeToggle.innerHTML = `<i class="fas fa-${next === 'dark' ? 'sun' : 'moon'}"></i>`;
    });
  }

  // Preloader
  window.addEventListener('load', () => {
    const pre = $('#preloader');
    if (pre) setTimeout(() => pre.classList.add('hidden'), 250);
  });

  // Intersection reveal
  const revealTargets = $$('.cool-service, .screenshot-card, .stat-card, .hours-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });

  // 3D Tilt
  const tiltEls = $$('.tilt');
  tiltEls.forEach((el) => {
    let raf = 0;
    const rect = () => el.getBoundingClientRect();
    const handle = (ev) => {
      const r = rect();
      const px = (ev.clientX - r.left) / r.width - 0.5;
      const py = (ev.clientY - r.top) / r.height - 0.5;
      const rx = (+py * 10).toFixed(2);
      const ry = (-px * 10).toFixed(2);
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    };
    const onEnter = (e) => { cancelAnimationFrame(raf); handle(e); };
    const onMove = (e) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => handle(e)); };
    const onLeave = () => { el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)'; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });

  // Counters
  const counterEls = $$('.stat-number[data-count]');
  const runCounter = (el) => {
    const end = Number(el.getAttribute('data-count')) || 0;
    const isPercent = el.closest('.stat-card') ? false : false; // reserved
    const duration = 1200;
    const startTime = performance.now();
    const startVal = 0;
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = Math.floor(startVal + (end - startVal) * ease);
      el.textContent = isPercent ? `${val}%` : val.toLocaleString();
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countersIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        $$('.stat-number[data-count]', e.target).forEach(runCounter);
        countersIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  // Observe blocks that contain counters
  [$('.hero-stats'), $('.map-overlay'), ...$$('.service-stats')].filter(Boolean).forEach((c) => countersIO.observe(c));

  // Ripple effect
  const addRipple = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };
  $$('.ripple, .btn-primary, .btn-outline, .btn-service, .feature-item').forEach((el) => {
    el.addEventListener('click', addRipple);
  });

  // Screenshots auto-rotate
  const screenshots = $$('.screenshot-card');
  let current = 0;
  const showScreenshot = (i) => {
    screenshots.forEach((card, idx) => { card.style.display = idx === i ? 'block' : 'none'; });
  };
  if (screenshots.length) {
    showScreenshot(0);
    setInterval(() => { current = (current + 1) % screenshots.length; showScreenshot(current); }, 3000);
  }

  // Notification helper
  function showNotification(message, type = 'info') {
    const existing = $$('.notification');
    existing.forEach((n) => n.remove());
    const div = document.createElement('div');
    div.className = `notification notification-${type}`;
    div.style.cssText = `position:fixed;top:20px;right:20px;background:${type==='success'?'#10B981':'#3B82F6'};color:#fff;padding:1rem 1.2rem;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,.15);z-index:2000;transform:translateX(120%);transition:transform .25s ease;max-width:320px;display:flex;gap:.6rem;align-items:center;`;
    div.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':'info-circle'}"></i><span style="font-weight:600">${message}</span><button style="margin-left:auto;background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer">&times;</button>`;
    document.body.appendChild(div);
    setTimeout(() => { div.style.transform = 'translateX(0)'; }, 10);
    div.querySelector('button').addEventListener('click', () => { div.style.transform='translateX(120%)'; setTimeout(() => div.remove(), 250); });
    setTimeout(() => { if (div.parentNode) { div.style.transform='translateX(120%)'; setTimeout(() => div.remove(), 250); } }, 5000);
  }

  // Hook up action buttons
  $$('[data-action="order"]').forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Redirecting to order page...', 'info');
    setTimeout(() => showNotification('Order system coming soon!', 'info'), 900);
  }));
  $$('[data-action="track"]').forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault(); showNotification('Tracking coming soon!', 'info');
  }));

  // Map fallback interactions
  const mapContainer = $('.map-container');
  function showLocationInfo(location) {
    let tooltip = $('.location-tooltip');
    const mapEl = $('.map');
    if (!mapEl) return;
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'location-tooltip';
      mapEl.appendChild(tooltip);
    }
    tooltip.innerHTML = `
      <div class="tooltip-content">
        <h4>${location}</h4>
        <p>Delivery available here!</p>
        <div class="tooltip-actions">
          <button class="btn-primary btn-small">Order Now</button>
          <button class="btn-outline btn-small">Learn More</button>
        </div>
      </div>`;
    tooltip.style.display = 'block';
    tooltip.style.position = 'absolute';
    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
    tooltip.style.zIndex = '100';
    setTimeout(() => { if (tooltip) tooltip.style.display = 'none'; }, 5000);
  }
  if (mapContainer) {
    mapContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('map') || e.target.classList.contains('map-placeholder')) {
        showLocationInfo('Hawassa Delivery Area');
      }
    });
  }
  $$('.delivery-point').forEach((p) => {
    p.addEventListener('click', () => showLocationInfo(p.getAttribute('data-location') || 'Delivery Area'));
    p.addEventListener('mouseenter', function () { this.style.transform = 'scale(1.12)'; this.style.zIndex = '20'; });
    p.addEventListener('mouseleave', function () { this.style.transform = 'scale(1)'; this.style.zIndex = '5'; });
  });

  // Expose showLocationInfo for InfoWindow button (if Google map loads)
  window.showLocationInfo = showLocationInfo;

  // Initialize fallback map view by default
  const hawassaMap = $('#hawassa-map');
  const mapFallback = $('#map-fallback');
  if (hawassaMap && mapFallback) {
    hawassaMap.style.display = 'none';
    mapFallback.style.display = 'block';
  }

})();

// Google Maps init — exposed globally for API callback
function initMap() {
  try {
    const hawassa = { lat: 7.0477329, lng: 38.4957849 };
    const mapEl = document.getElementById('hawassa-map');
    const map = new google.maps.Map(mapEl, {
      zoom: 13,
      center: hawassa,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        { featureType: 'all', elementType: 'geometry.fill', stylers: [{ color: '#f5f5f5' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#60A5FA' }] },
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    });

    const deliveryPoints = [
      { position: { lat: 7.0477329, lng: 38.4957849 }, title: 'Hawassa City Center', icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
      { position: { lat: 7.04, lng: 38.48 }, title: 'Lake Awassa Area', icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' },
      { position: { lat: 7.06, lng: 38.51 }, title: 'University Area', icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' },
      { position: { lat: 7.03, lng: 38.52 }, title: 'Industrial Zone', icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png' },
      { position: { lat: 7.07, lng: 38.47 }, title: 'Residential Areas', icon: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png' },
    ];

    const infoWindow = new google.maps.InfoWindow();

    deliveryPoints.forEach((p) => {
      const m = new google.maps.Marker({ position: p.position, map, title: p.title, icon: p.icon, animation: google.maps.Animation.DROP });
      m.addListener('click', () => {
        infoWindow.setContent(`<div style="padding:10px"><h3 style="margin:0 0 8px;color:#1E3A8A">${p.title}</h3><p style="margin:0 0 8px;color:#666">Delivery available here!</p><button onclick=\"showLocationInfo('${p.title.replace(/'/g, "&#39;")}')\" style="background:linear-gradient(135deg,#4A90E2,#1E3A8A);color:#fff;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;font-size:12px">Order Now</button></div>`);
        infoWindow.open(map, m);
      });
    });

    new google.maps.Circle({ strokeColor: '#4A90E2', strokeOpacity: 0.8, strokeWeight: 2, fillColor: '#4A90E2', fillOpacity: 0.1, map, center: hawassa, radius: 5000 });

    // Switch visibility
    const mapFallback = document.getElementById('map-fallback');
    if (mapFallback) mapFallback.style.display = 'none';
    if (mapEl) mapEl.style.display = 'block';
  } catch (err) {
    console.log('Google Maps not available, showing fallback');
    const mapEl = document.getElementById('hawassa-map');
    const mapFallback = document.getElementById('map-fallback');
    if (mapEl) mapEl.style.display = 'none';
    if (mapFallback) mapFallback.style.display = 'block';
  }
}
