// Global GSAP Animations
// Ported from React useLayoutEffect hooks

function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Animations disabled: User prefers reduced motion');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Featured Release / Hero Animations
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    gsap.from(heroText, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.2
    });
  }

  const heroBtn = document.querySelectorAll('.hero-btn');
  if (heroBtn.length > 0) {
    gsap.from(heroBtn, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.8
    });
  }

  // Product Page Animations (.pdp-animate-up, .pdp-image)
  const pdpElements = document.querySelectorAll('.pdp-animate-up');
  if (pdpElements.length > 0) {
    gsap.from(".pdp-animate-up", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }

  const pdpImage = document.querySelector('.pdp-main-image, .pdp-image');
  if (pdpImage) {
    gsap.from(pdpImage, {
      scale: 1.05,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    });
  }

  // Collection Page Animations (.collection-header-text, .collection-item)
  const collectionHeader = document.querySelectorAll('.collection-header-text');
  if (collectionHeader.length > 0) {
    gsap.from(".collection-header-text", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out"
    });
  }

  const collectionItems = document.querySelectorAll('.collection-item');
  if (collectionItems.length > 0) {
    gsap.from(".collection-item", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".collection-grid",
            start: "top 85%"
        }
    });
  }
}

// Initialize on first load
document.addEventListener('DOMContentLoaded', initAnimations);

// Removed Swup reference - no longer needed
