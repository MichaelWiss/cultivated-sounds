// import Swup from './swup.umd.js';

const swup = new Swup({
  containers: ['#MainContent'],
  cache: false, // Disable cache to ensure fresh Shopify data (e.g. cart state)
  plugins: [], // Add Swup plugins here if needed (e.g. scripts, scroll)
  ignoreVisit: (url, { el } = {}) => {
    // Ignore clicks on admin links, external links, or special Shopify routes
    return (
      el?.closest('[data-no-swup]') ||
      url.includes('/admin') ||
      url.includes('/cart') || 
      url.includes('/account') || 
      url.includes('/challenge')
    );
  }
});

// Re-initialize dynamic components after content replacement
swup.hooks.on('content:replace', () => {
  // Re-run global scripts that scan the DOM
  // e.g. re-bind Audio Player playlist, re-init Animations
  document.dispatchEvent(new CustomEvent('page:loaded'));
});

// Scroll to top on navigation
swup.hooks.on('visit:start', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});