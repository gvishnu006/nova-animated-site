# NOVA — Animated Landing Site

A fully animated, dependency-free landing page built with vanilla **HTML**, **CSS** and **JavaScript**.

## Animations included

- Preloader with animated progress counter
- Interactive particle network canvas (mouse repulsion + link lines)
- Custom trailing cursor with hover states
- Magnetic buttons and navigation links
- Split-text heading reveals (per-character stagger)
- Scroll-triggered reveal animations via `IntersectionObserver`
- Infinite marquee strip (pauses on hover)
- 3D tilt cards with gradient media parallax
- Animated counters, hero parallax and sticky nav
- `prefers-reduced-motion` support throughout

## Getting started

```bash
npm run dev
# or simply open index.html in your browser
```

## Structure

```
index.html          # page markup
css/style.css       # layout, components, responsive rules
css/animations.css  # keyframes, reveal states, motion preferences
js/particles.js     # particle network canvas
js/app.js           # preloader, cursor, split text, scroll effects
```

## License

MIT
