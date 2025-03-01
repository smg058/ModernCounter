# ModernCounter

A lightweight JavaScript library for animating numerical values with multiple counter styles.

## Features

- 📊 **Standard Counter** - Smooth value counting with configurable options
- 🔢 **Vertical Counter** - Slot-machine style rolling digits effect
- 📱 **No jQuery Required** - Pure JavaScript with zero dependencies
- 📜 **ScrollTrigger Support** - Optional GSAP integration for scroll-based animations
- 🎨 **Customizable** - Extensive options for animations and formatting

## Installation

```bash
npm install modern-counter
```

For vertical counters and scroll effects, you'll also need GSAP:

```bash
npm install gsap
```

## Usage

### Standard Counter

```javascript
// ES Module
import { ModernCounter, initCounter } from 'modern-counter';

// Basic usage
const counter = new ModernCounter(document.querySelector('.counter'), {
  from: 0,
  to: 1000,
  speed: 2000
});
counter.start();

// Quick initialization
initCounter(document.querySelector('.counter'), {
  from: 0,
  to: 1000
});

// HTML data attributes
// <div class="counter" data-from="0" data-to="1000" data-speed="2000"></div>
```

### Vertical Counter (Slot Machine Effect)

```javascript
// Import GSAP if using ScrollTrigger (optional)
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Import the VerticalCounter
import { VerticalCounter, initVerticalCounters } from 'modern-counter';

// Initialize a single vertical counter
const vertCounter = new VerticalCounter(document.querySelector('.vertical-counter'), {
  to: "456", // String value to display each digit
  duration: 2.5, // Animation duration in seconds
  onComplete: () => console.log('Counter finished!')
});
vertCounter.start();

// Initialize all vertical counters on the page
initVerticalCounters('.vertical-counter');

// HTML markup
// <div class="vertical-counter" data-to="456"></div>
```

### With ScrollTrigger (Requires GSAP)

```javascript
// Standard counter with ScrollTrigger
const counter = new ModernCounter(element, {
  from: 0,
  to: 5000,
  scrollTrigger: {
    trigger: element,
    start: "top 80%",
    toggleActions: "play none none reset"
  }
});

// Vertical counter with ScrollTrigger
const verticalCounter = new VerticalCounter(element, {
  to: "789",
  scrollTrigger: {
    trigger: element,
    start: "top 70%"
  }
});
```

## Standard Counter Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| from | number | 0 | Starting value |
| to | number | 0 | Target value |
| speed | number | 1000 | Animation duration in milliseconds |
| refreshInterval | number | 100 | Update frequency in milliseconds |
| decimals | number | 0 | Number of decimal places to show |
| formatter | Function | value.toFixed(decimals) | Function to format the displayed value |
| onUpdate | Function | null | Callback for each counter update |
| onComplete | Function | null | Callback when counting finishes |
| scrollTrigger | Object | null | GSAP ScrollTrigger configuration (if GSAP is available) |

## Vertical Counter Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| to | string | - | Target value to display (required) |
| duration | number | 2 | Animation duration in seconds |
| scrollTrigger | Object | null | GSAP ScrollTrigger configuration |
| onComplete | Function | null | Callback when animation completes |

## Standard Counter Methods

- `start()` - Starts or resumes the counter animation
- `stop()` - Stops/pauses the counter animation
- `restart()` - Restarts the counter animation from the beginning
- `toggle()` - Toggles the counter animation between running and stopped states

## Vertical Counter Methods

- `start()` - Starts the animation
- `reset()` - Resets the counter to initial state

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

MIT
