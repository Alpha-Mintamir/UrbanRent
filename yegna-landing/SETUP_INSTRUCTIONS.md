## Yegna Delivery Landing — Setup Guide

### Files
Place these in the same folder (next to `index.html`):
- `logo.png`
- `s1.jpg` ... `s6.jpg`

Optional: You can use `test-images.html` to verify which images exist.

### Run
Just open `index.html` in a browser.

### Google Maps
- Get an API key from the Google Cloud Console (`https://console.cloud.google.com/`).
- Replace `YOUR_API_KEY` in the Google Maps script tag inside `index.html`.
- If Maps fails to load, an animated fallback appears automatically.

### Features added
- Dark mode toggle (remembers your preference)
- Sticky, shrinking header with active section highlighting
- Scroll progress bar at the very top
- Animated counters (Downloads, Avg Delivery, Satisfaction)
- 3D tilt interactions for cards and map
- Improved map fallback (pulse points + tooltip)
- Smooth scroll, ripple effects, reveal animations
- Preloader splash

### Notes
- All animations use vanilla CSS/JS (no heavy libraries) for fast load.
- The site gracefully handles missing images via visual fallbacks.
