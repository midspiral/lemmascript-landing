# ProofSketch Coming Soon Page

A sleek, mysterious landing page for the ProofSketch project with subtle scroll animations connecting each section.

## Features

- Responsive design that works on all devices
- Animated scroll-based transitions between sections
- Interactive countdown timer to launch date
- Email notification form
- Subtle animation connectors between sections
- Parallax and fade effects
- Modern, minimalist aesthetic

## Getting Started

To view the coming soon page:

1. Simply open the `index.html` file in any modern web browser
2. No dependencies or server setup required
3. All assets are included in the project

## Customization

### Changing the Launch Date

To modify the countdown timer, edit the `setupCountdown()` function in `script.js`:

```javascript
function setupCountdown() {
    // Set launch date - modify this to your desired launch date
    const now = new Date();
    const launchDate = new Date();
    launchDate.setDate(now.getDate() + 30); // Currently set to 30 days from now
    
    // ...rest of function
}
```

### Modifying Content

The main content sections can be edited directly in the `index.html` file. Each section is clearly marked with IDs:

- `#hero` - Main header section
- `#about` - About/concept section
- `#features` - Features section
- `#launch` - Countdown and email signup section
- `#contact` - Footer with social links

### Styling Changes

The visual appearance can be customized in the `styles.css` file:

- Color scheme is defined at the top with CSS variables
- Fonts and typography can be adjusted in the respective sections
- Animation durations and styles can be modified in the animations section

## Browser Support

This coming soon page is designed to work on all modern browsers including:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved. This is a proprietary design for the ProofSketch project.

---

© 2023 ProofSketch 