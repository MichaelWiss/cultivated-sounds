/**
 * Constants and Configuration
 * 
 * Centralized configuration for routes, settings, and constants
 * used throughout the Shopify theme. This file is loaded in theme.liquid
 * and makes values available globally via window.theme.
 * 
 * Following Shopify Dawn patterns for configuration management.
 */

if (!window.theme) {
  window.theme = {};
}

/**
 * Shopify Routes
 * These are injected from Liquid in theme.liquid but defined here for reference
 */
window.theme.routes = window.routes || {
  cart_add_url: '/cart/add',
  cart_change_url: '/cart/change',
  cart_update_url: '/cart/update',
  cart_url: '/cart',
  predictive_search_url: '/search/suggest'
};

/**
 * Cart-related strings for error messages
 */
window.theme.cartStrings = window.cartStrings || {
  error: 'There was an error while updating your cart. Please try again.',
  quantityError: 'You can only add [quantity] of this item to your cart.'
};

/**
 * Breakpoints (matching Tailwind config)
 */
window.theme.breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Animation durations (milliseconds)
 */
window.theme.animations = {
  fast: 150,
  base: 300,
  slow: 500,
  drawer: 400
};

/**
 * Accessibility settings
 */
window.theme.accessibility = {
  trapFocusOnDrawers: true,
  announceCartUpdates: true,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/**
 * Feature flags
 */
window.theme.features = {
  audioPreview: true,
  quickView: false,
  infiniteScroll: false,
  ajaxCart: true
};

/**
 * Utility: Get current breakpoint
 */
window.theme.getCurrentBreakpoint = function() {
  const width = window.innerWidth;
  if (width >= this.breakpoints['2xl']) return '2xl';
  if (width >= this.breakpoints.xl) return 'xl';
  if (width >= this.breakpoints.lg) return 'lg';
  if (width >= this.breakpoints.md) return 'md';
  if (width >= this.breakpoints.sm) return 'sm';
  return 'xs';
};

/**
 * Utility: Check if mobile
 */
window.theme.isMobile = function() {
  return window.innerWidth < this.breakpoints.md;
};

/**
 * Utility: Format price
 * @param {number} cents - Price in cents
 * @returns {string} Formatted price string
 */
window.theme.formatMoney = function(cents) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }
  const value = (cents / 100).toFixed(2);
  return '$' + value;
};

/**
 * Utility: Debounce function
 * (Also available in global.js, but included here for standalone use)
 */
window.theme.debounce = function(fn, wait) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
};

/**
 * Utility: Throttle function
 */
window.theme.throttle = function(fn, wait) {
  let inThrottle, lastFn, lastTime;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(this, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

/**
 * Initialize theme on DOM ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Cultivated Sounds theme initialized');
  });
} else {
  console.log('Cultivated Sounds theme initialized');
}
