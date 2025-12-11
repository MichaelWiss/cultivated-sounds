document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Hero Animation
  const heroText = document.querySelector('.hero-text'); // Need to add this class to image-banner.liquid
  if (heroText) {
    gsap.from(heroText, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.2
    });
  }

  const heroBtn = document.querySelector('.hero-btn');
  if (heroBtn) {
    gsap.from(heroBtn, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.8
    });
  }

  // Product Detail Animation
  const pdpAnimateUp = document.querySelectorAll('.pdp-animate-up');
  if (pdpAnimateUp.length > 0) {
    gsap.from(pdpAnimateUp, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }

  const pdpImage = document.querySelector('.pdp-image');
  if (pdpImage) {
    gsap.from(pdpImage, {
      scale: 1.05,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    });
  }

  // Collection Grid Animation
  const collectionItems = document.querySelectorAll('.collection-item');
  if (collectionItems.length > 0) {
    gsap.from(collectionItems, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".collection-item",
        start: "top 85%"
      }
    });
  }
});
