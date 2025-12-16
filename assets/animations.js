// Global GSAP Animations
// Ported from React useLayoutEffect hooks

function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

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

  const pdpImage = document.querySelector('.pdp-image');
  if (pdpImage) {
    gsap.from(".pdp-image", {
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

// Re-initialize on Soft Navigation (Swup)
document.addEventListener('page:loaded', initAnimations);