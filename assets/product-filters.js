/**
 * Product Filters Component
 * Handles filtering and sorting for product grids
 */

class ProductFilters extends HTMLElement {
  constructor() {
    super();
    this.filterButtons = this.querySelectorAll('[data-filter]');
    this.sortSelect = this.querySelector('select');
    this.productGrid = document.querySelector('.product-grid-items');
    this.loadMoreBtn = document.querySelector('[data-load-more]');
    
    this.currentFilter = 'all';
    this.currentSort = 'newest';
    // Initialize from actual items displayed
    this.visibleCount = this.productGrid ? Array.from(this.productGrid.children).filter(item => item.style.display !== 'none').length : 8;
    
    this.init();
    this.initAnimations();
  }

  init() {
    // Filter button clicks
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilterClick(e.target);
      });
    });

    // Sort dropdown change
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.handleSortChange(e.target.value);
      });
    }

    // Load more button
    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener('click', () => {
        this.loadMore();
      });
    }
  }

  initAnimations() {
    if (!this.productGrid) return;
    
    const items = this.querySelectorAll('.product-grid-item');
    if (window.gsap && window.ScrollTrigger) {
      gsap.from(items, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.productGrid,
          start: 'top 80%'
        }
      });
    }
  }

  handleFilterClick(button) {
    const filter = button.dataset.filter.toLowerCase();
    this.currentFilter = filter;

    // Update active state
    this.filterButtons.forEach(btn => {
      btn.classList.remove('font-bold', 'text-vinyl-blue');
      btn.classList.add('text-gray-500');
    });
    button.classList.add('font-bold', 'text-vinyl-blue');
    button.classList.remove('text-gray-500');

    this.applyFilters();
  }

  handleSortChange(value) {
    this.currentSort = value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    const items = Array.from(this.productGrid?.children || []);
    if (!items.length) return;
    
    // Filter
    let filteredItems = items;
    if (this.currentFilter !== 'all') {
      filteredItems = items.filter(item => {
        const tags = item.dataset.tags?.toLowerCase() || '';
        return tags.includes(this.currentFilter);
      });
    }

    // Sort
    filteredItems.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price || 0);
      const priceB = parseFloat(b.dataset.price || 0);
      const dateA = new Date(a.dataset.date || 0);
      const dateB = new Date(b.dataset.date || 0);

      switch(this.currentSort) {
        case 'price: low to high':
          return priceA - priceB;
        case 'price: high to low':
          return priceB - priceA;
        case 'newest':
        default:
          return dateB - dateA;
      }
    });

    // Hide all items with a fade out
    items.forEach(item => {
      item.style.display = 'none';
      item.style.opacity = '0';
    });

    // Show filtered and sorted items
    filteredItems.forEach((item, index) => {
      if (index < this.visibleCount) {
        item.style.display = 'block';
        this.productGrid?.appendChild(item); // Re-order
        
        // Staggered fade in
        gsap.to(item, {
          opacity: 1,
          duration: 0.4,
          delay: index * 0.05,
          ease: 'power2.out'
        });
      }
    });

    // Update load more button visibility
    if (this.loadMoreBtn) {
      this.loadMoreBtn.style.display = 
        filteredItems.length > this.visibleCount ? 'flex' : 'none';
    }
  }

  loadMore() {
    this.visibleCount += 8;
    this.applyFilters();
  }
}

customElements.define('product-filters', ProductFilters);
