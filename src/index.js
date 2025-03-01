/**
 * ModernCounter - A lightweight, dependency-free JavaScript library for animating numerical values
 *
 * @class
 * @description Creates smooth counting animations for numerical values with configurable options.
 *              The counter can be started, stopped, restarted, and toggled, making it suitable
 *              for various use cases including statistics, dashboards, and scroll-triggered animations.
 *
 * @example
 * // Basic usage
 * const counter = new ModernCounter(document.querySelector('.counter'), {
 *   from: 0,
 *   to: 1000,
 *   speed: 2000
 * });
 * counter.start();
 *
 * @example
 * // With scroll trigger
 * ScrollTrigger.create({
 *   trigger: element,
 *   start: "top 80%",
 *   onEnter: () => new ModernCounter(element).start()
 * });
 *
 * @author Chayson Media Group <dev@chayson.com>
 * @version 1.0.0
 * @license MIT
 */
class ModernCounter {
  /**
   * Default configuration options for the counter
   *
   * @static
   * @type {Object}
   * @property {number} from - Starting value (default: 0)
   * @property {number} to - Target value (default: 0)
   * @property {number} speed - Animation duration in milliseconds (default: 1000)
   * @property {number} refreshInterval - Update frequency in milliseconds (default: 100)
   * @property {number} decimals - Number of decimal places to show (default: 0)
   * @property {Function} formatter - Function to format the displayed value
   * @property {Function|null} onUpdate - Callback for each counter update
   * @property {Function|null} onComplete - Callback when counting finishes
   * @property {Object|null} scrollTrigger - GSAP ScrollTrigger configuration (if GSAP is available)
   */
  static DEFAULTS = {
    from: 0,
    to: 0,
    speed: 1000,
    refreshInterval: 100,
    decimals: 0,
    formatter: (value, options) => value.toFixed(options.decimals),
    onUpdate: null,
    onComplete: null,
    scrollTrigger: null
  };

  /**
   * Creates a new ModernCounter instance
   *
   * @constructor
   * @param {HTMLElement} element - The DOM element to attach the counter to
   * @param {Object} [options={}] - Configuration options to override defaults
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      ...ModernCounter.DEFAULTS,
      ...this.getDataOptions(),
      ...options
    };
    this.init();

    // Set up ScrollTrigger if specified and GSAP is available.
    if (this.options.scrollTrigger && typeof gsap !== 'undefined') {
      this.setupScrollTrigger();
    }
  }

  /**
   * Extracts counter options from element's data attributes
   *
   * @private
   * @returns {Object} Options object with properties from data attributes
   */
  getDataOptions() {
    const options = {};

    // Explicitly check each data attribute and parse it correctly.
    if (this.element.hasAttribute('data-from')) {
      options.from = parseFloat(this.element.getAttribute('data-from')) || 0;
    }

    if (this.element.hasAttribute('data-to')) {
      options.to = parseFloat(this.element.getAttribute('data-to')) || 0;
    }

    if (this.element.hasAttribute('data-speed')) {
      options.speed = parseInt(this.element.getAttribute('data-speed'), 10) || 1000;
    }

    if (this.element.hasAttribute('data-refresh-interval')) {
      options.refreshInterval = parseInt(this.element.getAttribute('data-refresh-interval'), 10) || 100;
    } else if (this.element.hasAttribute('data-refreshInterval')) {
      // Support both kebab-case and camelCase attribute names.
      options.refreshInterval = parseInt(this.element.getAttribute('data-refreshInterval'), 10) || 100;
    }

    if (this.element.hasAttribute('data-decimals')) {
      options.decimals = parseInt(this.element.getAttribute('data-decimals'), 10) || 0;
    }

    return options;
  }

  /**
   * Sets up a GSAP ScrollTrigger to start the animation.
   *
   * @private
   * @returns (void)
   */
  setupScrollTrigger() {
    // Create default ScrollTrigger configuration.
    const triggerConfig = {
      trigger: this.element,
      start: 'top 80%',
      onEnter: () => this.start(),
      ...this.options.scrollTrigger
    };

    // Create the ScrollTrigger
    if (gsap.ScrollTrigger) {
      gsap.ScrollTrigger.create(triggerConfig);
    } else {
      console.warn('ScrollTrigger plugin not loaded, falling back to scroll listener'); // eslint-disable-line no-console
      this.setupScrollListener();
    }
  }

  /**
   * Sets up a fallback scroll listener if ScrollTrigger isn't available
   *
   * @private
   * @returns {void}
   */
  setupScrollListener() {
    const checkScroll = () => {
      const rect = this.element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
        this.start();
        window.removeEventListener('scroll', checkScroll);
      }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check initial position.
  }

  /**
   * Initializes the counter with current options
   *
   * @private
   * @returns {void}
   */
  init() {
    this.value = this.options.from;
    this.loops = Math.ceil(this.options.speed / this.options.refreshInterval);
    this.loopCount = 0;
    this.increment = (this.options.to - this.options.from) / this.loops;

    // Debug log to verify correct values.
    //console.log('Counter initialized with:', {
    //  from: this.options.from,
    //  to: this.options.to,
    //  speed: this.options.speed,
    //  refreshInterval: this.options.refreshInterval,
    //  loops: this.loops,
    //  increment: this.increment
    //});
  }

  /**
   * Updates the counter value on each animation frame
   *
   * @private
   * @returns {void}
   */
  update = () => {
    this.value += this.increment;
    this.loopCount++;
    this.render();

    if (typeof this.options.onUpdate === 'function') {
      this.options.onUpdate.call(this.element, this.value);
    }

    if (this.loopCount >= this.loops) {
      clearInterval(this.interval);
      this.value = this.options.to;
      this.render();

      if (typeof this.options.onComplete === 'function') {
        this.options.onComplete.call(this.element, this.value);
      }
    }
  };

  /**
   * Updates the counter with GSAP animation if available, falls back to interval method
   *
   * @private
   * @returns {boolean|void}
   */
  animateWithGSAP() {
    // Only use GSAP if available.
    if (typeof gsap !== 'undefined') {
      // Stop any existing animation.
      this.stop();

      // Store initial value for animation.
      const startValue = this.options.from;
      this.value = startValue;

      // Create GSAP animation.
      gsap.to(this, {
        value: this.options.to,
        duration: this.options.speed / 1000,
        ease: 'power2.out',
        onUpdate: () => {
          this.render();
          if (typeof this.options.onUpdate === 'function') {
            this.options.onUpdate.call(this.element, this.value);
          }
        },
        onComplete: () => {
          if (typeof this.options.onComplete === 'function') {
            this.options.onComplete.call(this.element, this.options.to);
          }
        }
      });

      return true;
    }

    return false;
  }

  /**
   * Renders the current counter value to the DOM
   *
   * @private
   * @returns {void}
   */
  render() {
    this.element.textContent = this.options.formatter.call(this.element, this.value, this.options);
  }

  /**
   * Restarts the counter animation from the beginning
   *
   * @public
   * @returns {ModernCounter} The counter instance for chaining
   */
  restart() {
    this.stop();
    this.init();
    this.start();
    return this;
  }

  /**
   * Starts or resumes the counter animation
   *
   * @public
   * @returns {ModernCounter} The counter instance for chaining
   */
  start() {
    this.stop();
    this.render();

    // Try to use GSAP if available, fall back to interval method.
    if (!this.animateWithGSAP()) {
      this.interval = setInterval(this.update, this.options.refreshInterval);
    }

    return this;
  }

  /**
   * Stops/pauses the counter animation
   *
   * @public
   * @returns {ModernCounter} The counter instance for chaining
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    // Kill GSAP animation if running.
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(this);
    }

    return this;
  }

  /**
   * Toggles the counter animation between running and stopped states
   *
   * @public
   * @returns {ModernCounter} The counter instance for chaining
   */
  toggle() {
    if (this.interval) {
      this.stop();
    } else {
      this.start();
    }
    return this;
  }
}

/**
 * Helper function to quickly initialize a counter
 *
 * @param {HTMLElement} element - The DOM element to attach the counter to
 * @param {Object} [options={}] - Configuration options to override defaults
 * @returns {ModernCounter} The initialized counter instance
 */
const initCounter = (element, options = {}) => {
  const counter = new ModernCounter(element, options);
  return counter.start();
};

/**
 * VerticalCounter - A counter with rolling digit animation
 * This version uses CSS transitions for reliable animation
 */
class VerticalCounter {
  /**
   * Default configuration
   */
  static DEFAULTS = {
    duration: 2,
    scrollTrigger: null,
    onComplete: null
  };

  /**
   * Constructor
   */
  constructor(element, options = {}) {
    this.element = element;

    // Get data attributes
    const dataOptions = {};
    if (element.hasAttribute('data-to')) {
      dataOptions.to = element.getAttribute('data-to');
    }
    if (element.hasAttribute('data-duration')) {
      dataOptions.duration = parseFloat(element.getAttribute('data-duration')) || 2;
    }

    // Merge options
    this.options = {
      ...VerticalCounter.DEFAULTS,
      ...dataOptions,
      ...options
    };

    // Ensure we have a target value
    if (!this.options.to) {
      console.error('VerticalCounter requires a "to" value');
      return;
    }

    // Build the counter
    this.buildCounter();

    // Set up scroll trigger if specified
    if (this.options.scrollTrigger) {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: this.element,
          start: 'top 80%',
          onEnter: () => this.start(),
          ...this.options.scrollTrigger
        });
      } else {
        this.setupScrollListener();
      }
    } else {
      // Start automatically after a small delay
      setTimeout(() => this.start(), 100);
    }
  }

  /**
   * Set up scroll listener as fallback
   */
  setupScrollListener() {
    const checkScroll = () => {
      const rect = this.element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
        this.start();
        window.removeEventListener('scroll', checkScroll);
      }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }

  /**
   * Build the counter DOM structure
   */
  buildCounter() {
    // Clear element
    this.element.innerHTML = '';

    // Set container styles
    this.element.style.display = 'flex';
    this.element.style.justifyContent = 'center';

    // Get digits
    const digits = this.options.to.toString().split('');
    this.digitElements = [];

    // Create each digit
    digits.forEach(digitValue => {
      // Create column container
      const column = document.createElement('div');
      column.className = 'vertical-counter-digit';
      column.style.overflow = 'hidden';
      column.style.position = 'relative';
      column.style.width = '0.6em';
      column.style.height = '1em';
      column.style.margin = '0 2px';

      // Create digit strip containing all numbers 0-9
      const strip = document.createElement('div');
      strip.className = 'vertical-counter-strip';
      strip.style.position = 'absolute';
      strip.style.top = '0';
      strip.style.left = '0';
      strip.style.width = '100%';
      strip.style.textAlign = 'center';

      // Add each possible digit
      for (let i = 0; i <= 9; i++) {
        const digitEl = document.createElement('div');
        digitEl.className = 'vertical-counter-number';
        digitEl.style.height = '1em';
        digitEl.style.lineHeight = '1em';
        digitEl.textContent = i;
        strip.appendChild(digitEl);
      }

      // Add to DOM
      column.appendChild(strip);
      this.element.appendChild(column);

      // Store for animation
      this.digitElements.push({
        column,
        strip,
        value: parseInt(digitValue, 10) || 0
      });
    });
  }

  /**
   * Start the animation
   */
  start() {
    // For tracking completion
    let completeCount = 0;
    const totalDigits = this.digitElements.length;

    // Function to call when all digits are done
    const checkCompletion = () => {
      completeCount++;
      if (completeCount >= totalDigits && typeof this.options.onComplete === 'function') {
        this.options.onComplete.call(this);
      }
    };

    // Animate each digit
    this.digitElements.forEach((digit, index) => {
      const { strip, value } = digit;

      // Reset position first (if needed)
      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0)';

      // Force reflow to ensure the reset takes effect
      strip.offsetHeight;

      // Set up transition with delay for stagger effect
      strip.style.transition = `transform ${this.options.duration}s ease ${index * 0.1}s`;

      // Add transitionend listener for completion callback
      const transitionEndHandler = () => {
        strip.removeEventListener('transitionend', transitionEndHandler);
        checkCompletion();
      };
      strip.addEventListener('transitionend', transitionEndHandler);

      // Start animation
      setTimeout(() => {
        strip.style.transform = `translateY(-${value}em)`;
      }, 50); // Small delay to ensure transition is applied
    });

    return this;
  }

  /**
   * Reset the counter
   */
  reset() {
    this.digitElements.forEach(digit => {
      digit.strip.style.transition = 'none';
      digit.strip.style.transform = 'translateY(0)';

      // Force reflow
      digit.strip.offsetHeight;
    });

    return this;
  }
}

/**
 * Initialize all vertical counters
 */
const initVerticalCounters = (selector = '.vertical-counter', options = {}) => {
  const elements = document.querySelectorAll(selector);
  const counters = [];

  elements.forEach(element => {
    counters.push(new VerticalCounter(element, options));
  });

  return counters;
};

export { ModernCounter, VerticalCounter, initCounter, initVerticalCounters };
