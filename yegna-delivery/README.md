# 🚀 Yegna Delivery - Ultra Modern Website

## ✨ Features

### 🎨 Visual Excellence
- **Glassmorphism Design**: Modern glass-like effects with backdrop blur
- **3D Animations**: GSAP-powered 3D transformations and parallax effects
- **Particle System**: Interactive floating particles that respond to mouse movement
- **Gradient Orbs**: Animated background elements with smooth floating motion
- **Neon Glows**: Dynamic glowing effects on interactive elements

### 🎭 Advanced Animations
- **Scroll-Triggered Animations**: Elements animate as they enter viewport
- **Staggered Text Reveals**: Character-by-character text animations
- **Morphing Buttons**: Buttons with ripple effects and smooth transitions
- **3D Card Flips**: Service cards with perspective transformations
- **Floating Elements**: Parallax-enabled floating icons

### 🎯 Interactive Features
- **Smart Navigation**: Smooth scrolling with active link highlighting
- **Interactive Map**: Animated delivery points with hover tooltips
- **Phone Mockups**: 3D phone animations with realistic shadows
- **Modal System**: Advanced modal dialogs with blur backgrounds
- **Notification System**: Toast notifications with different types
- **Cursor Follower**: Custom cursor with trailing effects

### 📱 Mobile Optimized
- **Responsive Design**: Perfectly adapted for all screen sizes
- **Touch Interactions**: Optimized for mobile touch events
- **Performance**: Optimized animations for mobile devices
- **Accessibility**: WCAG compliant with keyboard navigation

### 🔧 Technical Features
- **GSAP Integration**: Professional animation library
- **ScrollTrigger**: Advanced scroll-based animations
- **Intersection Observer**: Efficient element visibility detection
- **Performance Optimized**: Debounced events and lazy loading
- **Modern JavaScript**: ES6+ features with clean architecture

## 🛠️ Setup Instructions

### 1. File Structure
```
yegna-delivery/
├── index.html          # Main HTML file
├── styles.css          # Ultra-modern CSS with animations
├── script.js           # Advanced JavaScript interactions
├── README.md           # This file
├── test-images.html    # Image testing utility
└── assets/             # Optional: Place your images here
    ├── logo.png
    ├── s1.jpg
    ├── s2.jpg
    ├── s3.jpg
    ├── s4.jpg
    ├── s5.jpg
    └── s6.jpg
```

### 2. Required Images
- `logo.png` - Company logo (50px height recommended)
- `s1.jpg` - App screenshot 1 (Home screen)
- `s2.jpg` - App screenshot 2 (Special offers)
- `s3.jpg` - App screenshot 3 (Checkout)
- `s4.jpg` - App screenshot 4 (New restaurants)
- `s5.jpg` - App screenshot 5 (Menu)
- `s6.jpg` - App screenshot 6 (Refer & earn)

### 3. Google Maps Setup (Optional)
1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Replace `YOUR_API_KEY` in `index.html` line 11
3. Enable Maps JavaScript API for your project

### 4. Testing
1. Open `test-images.html` to verify all images load correctly
2. Open `index.html` in a modern browser
3. Test on mobile devices for responsive behavior

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #4A90E2;
    --primary-dark: #1E3A8A;
    --secondary: #60A5FA;
    --accent: #10B981;
    /* ... more colors */
}
```

### Animations
Modify GSAP timelines in `script.js`:
```javascript
// Example: Customize hero animation
function triggerHeroAnimations() {
    const tl = gsap.timeline();
    tl.from('.hero-badge', {
        duration: 1,        // Change duration
        y: 50,             // Change movement
        opacity: 0,
        ease: 'power3.out' // Change easing
    });
}
```

### Content
Update text content directly in `index.html` or add new sections following the existing pattern.

## 🚀 Performance Features

### Optimizations Included
- **Lazy Loading**: Images load only when needed
- **Debounced Events**: Resize and scroll events are optimized
- **Intersection Observer**: Efficient visibility detection
- **GSAP Performance**: Hardware-accelerated animations
- **Minimal Reflows**: CSS transforms instead of layout changes

### Browser Support
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Features**: CSS Grid, Flexbox, CSS Custom Properties, ES6+

## 🎯 Key Interactions

### Navigation
- **Smooth Scrolling**: Click nav links for smooth section transitions
- **Active Highlighting**: Current section highlighted in navigation
- **Mobile Menu**: Hamburger menu with smooth animations

### Hero Section
- **Particle Interaction**: Particles respond to mouse movement
- **Floating Elements**: Icons float with parallax effect
- **Counter Animation**: Numbers count up when scrolled into view

### Services
- **3D Card Hover**: Cards lift and rotate on hover
- **Icon Animations**: Service icons spin and glow
- **Staggered Loading**: Cards animate in sequence

### Map Section
- **Interactive Points**: Hover delivery points for tooltips
- **3D Map Effect**: Map container has perspective transformation
- **Live Stats**: Animated statistics with floating effect

### App Showcase
- **3D Phone Mockups**: Phones rotate and scale on hover
- **Screenshot Carousel**: Automatic image rotation
- **Feature Highlights**: Features slide in from sides

## 🔧 Troubleshooting

### Common Issues
1. **Animations not working**: Check if GSAP CDN is loaded
2. **Images not showing**: Verify image paths and file names
3. **Mobile issues**: Test on actual devices, not just browser dev tools
4. **Performance**: Reduce particle count for older devices

### Browser Console
Check for JavaScript errors in browser developer tools (F12).

### Performance Monitoring
Use browser dev tools Performance tab to monitor animation performance.

## 📞 Contact Information
- **Phone**: +251 985 640 666
- **WhatsApp**: Available through website buttons
- **App Store**: [Google Play Store Link](https://play.google.com/store/apps/details?id=com.yegnadelivery.yegna_delivery&hl=en-US)

## 🎉 What's New in This Version

### Ultra-Modern Features
✅ **Glassmorphism UI** - Frosted glass effects throughout  
✅ **3D Animations** - GSAP-powered 3D transformations  
✅ **Particle System** - Interactive floating particles  
✅ **Advanced Scrolling** - Smooth scroll with momentum  
✅ **Mobile Optimized** - Perfect mobile experience  
✅ **Performance** - Optimized for 60fps animations  
✅ **Accessibility** - Keyboard navigation support  
✅ **Interactive Map** - Animated delivery zones  
✅ **Phone Mockups** - Realistic 3D phone displays  
✅ **Notification System** - Beautiful toast messages  

### Technical Improvements
- **GSAP Integration**: Professional animation library
- **ScrollTrigger**: Advanced scroll-based animations
- **Modern JavaScript**: ES6+ with clean architecture
- **CSS Grid/Flexbox**: Modern layout techniques
- **Custom Properties**: Dynamic theming support
- **Intersection Observer**: Efficient performance
- **Debounced Events**: Optimized event handling

---

**Built with ❤️ for Yegna Delivery - The Future of Delivery in Hawassa**