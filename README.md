# ModernCounter

A lightweight, dependency-free JavaScript library for animating numerical values with smooth counting effects.

## Features

- 🪶 Lightweight (< 2KB minified and gzipped)
- 🚫 Zero dependencies
- 🌐 Works with any framework or vanilla JS
- 📱 Fully responsive
- 🔌 Easy integration with scroll libraries
- ⚙️ Highly customizable
- 🔄 Control methods (start, stop, restart, toggle)
- 🎨 Custom formatter support

## Installation

### NPM

```bash
npm install moder-counter --save
```

### Yarn
```bash
yarn add modern-counter
```

## Basic Usage

### HTML
```html
<div class="counter" data-from="0" data-to="3450" data-speed="2000" data-decimals="0">0</div>
```

### JavaScript

```javascript
import { initCounter } from 'src/modern-counter';

// Initialize all counters.
document.querySelectorAll('.counter').forEach(element => {
  initCounter(element);
});

// Or initialize a specific counter with options.
const element = document.querySelector('#myCounter');
initCounter(element, {
  from: 0,
  to: 7258,
  speed: 1500,
  onComplete: () => console.log('Counting complete!')
});
```

## Scroll-Based Animation
ModernCounter works seamlessly with scroll libraries like 
Intersection Observer, GSAP ScrollTrigger, or any other scroll detection method.

### Intersection Observer

```javascript
import { initCounter } from 'src/modern-counter';

const counters = document.querySelectorAll('.counter');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      initCounter(entry.target);
      observer.unobserve(entry.target); // Only trigger once.
    }
  });
}, {
  threshold: 0.1
});

counters.forEach(counter => observer.observe(counter));
```

### GSAP ScrollTrigger

```javascript
import { initCounter } from 'src/modern-counter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.querySelector('.counter').forEach(element => {
  ScrollTrigger.create({
    trigger: element,
    start: 'top 80%',
    onEnter: () => initCounter(element),
    once: true
  });
});
```
## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `from` | Number | `0` | The number to start counting from |
| `to` | Number | `0` | The number to count to |
| `speed` | Number | `1000` | Duration of the count animation in milliseconds |
| `refreshInterval` | Number | `100` | How often to update the counter (ms) |
| `decimals` | Number | `0` | Number of decimal places to show |
| `formatter` | Function | `value.toFixed(decimals)` | Function to format the displayed value |
| `onUpdate` | Function | `null` | Callback for each update during counting |
| `onComplete` | Function | `null` | Callback when counting finishes |

## Data Attributes

You can configure counters directly in HTML using these data attributes:

| Attribute | Description |
|-----------|-------------|
| `data-from` | Starting value |
| `data-to` | Target value |
| `data-speed` | Animation duration in ms |
| `data-refresh-interval` | Update frequency in ms |
| `data-decimals` | Number of decimal places |

## Advanced Usage
### Custom Formatter

```javascript
import { initCounter } from 'src/modern-counter';

initCounter(document.querySelector('#percentCounter'), {
  from: 0,
  to: 100,
  formatter: (value, options) => {
    return `${value.toFixed(options.decimals)}%`;
  }
});

// For currency.
initCounter(document.querySelector('#currencyCounter'), {
  from: 0,
  to: 1500,
  formatter: (value, options) => {
    return `$${value.toFixed(options.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
});
```

### API Methods

```javascript
import { ModernCounter } from 'src/modern-counter';

const counter = new ModernCounter(document.querySelector('#apiCounter'), {
  from: 0,
  to: 500,
  speed: 3000
});

// Start the counter.
counter.start();

// Pause the counter.
document.querySelector('#pauseBtn').addEventListener('click', () => {
  counter.stop();
});

// Resume the counter.
document.querySelector('#resumeBtn').addEventListener('click', () => {
  counter.start();
});

// Reset and restart the counter.
document.querySelector('#restartBtn').addEventListener('click', () => {
  counter.restart();
});

// Toggle the counter.
document.querySelector('#toggleBtn').addEventListener('click', () => {
  counter.toggle();
});
```

## Browser Support
ModernCounter supports all modern browsers and IE11+ (with appropriate transpilation/polyfills).

## License
### MIT

## Contributing
Contributions are welcome! Please feel free to submit a pull request.
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your change (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Credits
ModernCounter is a modern rewrite of Matt Huggins' jquery-countTo plugin, updated for 
moder JavaScript environments and framework and with jQuery dependency removed.
