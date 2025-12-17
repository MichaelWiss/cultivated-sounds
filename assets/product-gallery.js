class ProductGallery extends HTMLElement {
  constructor() {
    super();
    this.mainImage = this.querySelector('[data-product-main-image]');
    this.thumbnails = this.querySelectorAll('[data-thumbnail-index]');
  }

  connectedCallback() {
    this.thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        this.switchImage(thumbnail);
      });
    });
  }

  switchImage(thumbnail) {
    const newImageUrl = thumbnail.getAttribute('data-image-url');
    if (!newImageUrl || !this.mainImage) return;

    // Remove active class from all thumbnails
    this.thumbnails.forEach(t => {
      t.classList.remove('is-active', 'opacity-100');
      t.classList.add('opacity-50');
    });

    // Add active class to selected thumbnail
    thumbnail.classList.add('is-active', 'opacity-100');
    thumbnail.classList.remove('opacity-50');

    // Update main image
    this.mainImage.setAttribute('src', newImageUrl);
    
    // Optional: Add a fade effect or animation
    this.mainImage.animate([
      { opacity: 0.5 },
      { opacity: 1 }
    ], {
      duration: 300,
      easing: 'ease-in-out'
    });
  }
}

customElements.define('product-gallery', ProductGallery);
