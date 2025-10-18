/* Yegna Delivery — Elevated Landing Interactions */
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Persisted theme
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  const themeToggle = $('#themeToggle');
  const applyThemeIcon = () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = `<i class="fas ${dark ? 'fa-sun' : 'fa-moon'}"></i>`;
  };
  applyThemeIcon();

  themeToggle?.addEventListener('click', () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    const next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    applyThemeIcon();
  });

  // Mobile nav
  const navToggle = $('.nav-toggle');
  const navLinks = $('.nav-links');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('show');
  });

  // Active nav + smooth scroll
  const sections = $$('section[id]');
  const links = $$('.nav-link');

  links.forEach(link => link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const el = $(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navLinks?.classList.remove('show');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  const highlight = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) current = section.id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', highlight);
  highlight();

  // Back to top
  const backTop = $('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backTop.classList.add('show');
    else backTop.classList.remove('show');
  });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Order modal
  const orderModal = $('#orderModal');
  const orderBtns = ['#orderNowBtn', '#orderNowBtn2'].map(s => $(s)).filter(Boolean);
  orderBtns.forEach(btn => btn.addEventListener('click', () => orderModal?.showModal()));

  // Simple reveal on scroll
  const revealables = $$('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealables.forEach(el => io.observe(el));

  // Parallax hero background
  const hero = $('.hero');
  window.addEventListener('scroll', () => {
    const rate = window.scrollY * -0.25;
    hero.style.transform = `translateY(${rate}px)`;
  });

  // Lightweight tilt
  const applyTilt = (el) => {
    let rect;
    const max = 8; // deg
    const onMove = (e) => {
      rect = rect || el.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const px = (e.clientX - cx) / (rect.width/2);
      const py = (e.clientY - cy) / (rect.height/2);
      const rx = Math.max(Math.min(py * max, max), -max);
      const ry = Math.max(Math.min(-px * max, max), -max);
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const reset = () => { el.style.transform = 'rotateX(0) rotateY(0)'; rect = undefined; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
  };
  $$('[data-tilt]').forEach(applyTilt);

  // Map
  window.initMap = function initMap(){
    try {
      const hawassa = { lat: 7.0477329, lng: 38.4957849 };
      const mapEl = $('#hawassa-map');
      const map = new google.maps.Map(mapEl, {
        zoom: 13,
        center: hawassa,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          { featureType: 'all', elementType: 'geometry.fill', stylers: [{ color: '#0b1220' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#60A5FA' }] },
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
        ]
      });

      const points = [
        { pos: hawassa, title: 'City Center', icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
        { pos: { lat: 7.0400, lng: 38.4800 }, title: 'Lake Awassa', icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' },
        { pos: { lat: 7.0600, lng: 38.5100 }, title: 'University', icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' },
        { pos: { lat: 7.0300, lng: 38.5200 }, title: 'Industrial Zone', icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png' },
        { pos: { lat: 7.0700, lng: 38.4700 }, title: 'Residential Areas', icon: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png' }
      ];

      const iw = new google.maps.InfoWindow();
      points.forEach(p => {
        const m = new google.maps.Marker({ position: p.pos, map, title: p.title, icon: p.icon, animation: google.maps.Animation.DROP });
        m.addListener('click', () => {
          iw.setContent(`<div style="padding:10px"><h3 style="margin:0 0 8px;color:#1E3A8A">${p.title}</h3><button onclick=\"document.getElementById('orderModal').showModal()\" style=\"background:linear-gradient(135deg,#4A90E2,#1E3A8A);color:#fff;border:none;padding:6px 10px;border-radius:8px\">Order Here</button></div>`);
          iw.open(map, m);
        });
      });

      new google.maps.Circle({
        strokeColor: '#4A90E2', strokeOpacity: .8, strokeWeight: 2,
        fillColor: '#4A90E2', fillOpacity: .1, map, center: hawassa, radius: 5000
      });

      // show map, hide fallback
      $('#hawassa-map').style.display = 'block';
      $('#map-fallback').style.display = 'none';
    } catch (e) {
      console.log('Map failed, showing fallback');
      $('#hawassa-map').style.display = 'none';
      $('#map-fallback').style.display = 'flex';
    }
  }

  // Fallback by default
  window.addEventListener('DOMContentLoaded', () => {
    $('#year').textContent = new Date().getFullYear();
    $('#hawassa-map').style.display = 'none';
    $('#map-fallback').style.display = 'flex';
  });

  // PWA registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/landing/yegna/sw.js')
        .catch(console.warn);
    });
  }
})();
