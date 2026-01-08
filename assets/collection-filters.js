class CollectionFilters {
  constructor() {
    this.init();
  }

  init() {
    this.form = document.getElementById('CollectionFiltersForm');
    this.sortSelect = document.getElementById('SortBy');
    this.productGridContainer = document.getElementById('ProductGridContainer');
    
    this.bindEvents();
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener('change', this.handleFilterChange.bind(this));
    }
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', this.handleSortChange.bind(this));
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.url) {
        this.fetchProducts(event.state.url);
      } else {
        // Fallback for initial state or if state is missing
        this.fetchProducts(window.location.href);
      }
    });
  }

  handleFilterChange(event) {
    const formData = new FormData(this.form);
    const searchParams = new URLSearchParams(formData).toString();
    const baseUrl = window.location.pathname;
    
    // Preserve existing sort parameter if present
    const currentSort = this.sortSelect ? this.sortSelect.value.split('sort_by=')[1] : null;
    let newUrl = `${baseUrl}?${searchParams}`;
    
    if (currentSort) {
      newUrl += `&sort_by=${currentSort}`;
    }

    this.updateUrl(newUrl);
    this.fetchProducts(newUrl);
  }

  handleSortChange(event) {
    // The value in the option is the full URL with sort_by param
    // But we need to combine it with current filters
    const sortValue = event.target.value;
    
    // We only want the sort_by param from the value if it's a URL, or the value itself
    // In the liquid template, the value is currently: {{ collection.url }}?sort_by={{ option.value }}
    // We can parse the URL to get the sort_by param
    let sortBy = '';
    try {
        const url = new URL(sortValue, window.location.origin);
        sortBy = url.searchParams.get('sort_by');
    } catch (e) {
        // If it's just the value string
        sortBy = sortValue;
    }

    if (!sortBy) return;

    const formData = new FormData(this.form);
    const searchParams = new URLSearchParams(formData);
    searchParams.set('sort_by', sortBy);
    
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

    this.updateUrl(newUrl);
    this.fetchProducts(newUrl);
  }

  updateUrl(url) {
    window.history.pushState({ url: url }, '', url);
  }

  async fetchProducts(url) {
    this.setLoading(true);

    try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const newDocument = parser.parseFromString(text, 'text/html');

      this.renderProductGrid(newDocument);
      this.renderFilters(newDocument);
      this.setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      this.setLoading(false);
    }
  }

  renderProductGrid(newDocument) {
    const newProductGrid = newDocument.getElementById('ProductGridContainer');
    if (newProductGrid && this.productGridContainer) {
      this.productGridContainer.innerHTML = newProductGrid.innerHTML;
      
      // Re-initialize any animations or scripts needed for new items
      if (window.gsap && window.ScrollTrigger) {
          ScrollTrigger.refresh();
      }
    }
  }

  renderFilters(newDocument) {
    const newForm = newDocument.getElementById('CollectionFiltersForm');
    const newSortSelect = newDocument.getElementById('SortBy');
    const newCount = newDocument.querySelector('.collection-count');

    if (newForm && this.form) {
      this.form.innerHTML = newForm.innerHTML;
    }
    
    // Update sort select value to match current URL
    if (newSortSelect && this.sortSelect) {
        // We don't replace the whole select to avoid losing focus/state if possible, 
        // but syncing the value is important.
        this.sortSelect.value = newSortSelect.value;
    }

    // Update product count
    const currentCount = document.querySelector('.collection-count');
    if (newCount && currentCount) {
        currentCount.innerHTML = newCount.innerHTML;
    }
  }

  setLoading(isLoading) {
    if (isLoading) {
      this.productGridContainer.style.opacity = '0.5';
      this.productGridContainer.style.pointerEvents = 'none';
    } else {
      this.productGridContainer.style.opacity = '1';
      this.productGridContainer.style.pointerEvents = 'auto';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CollectionFilters();
});
