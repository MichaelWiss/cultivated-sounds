class HomepageGrid {
  constructor(container) {
    this.container = container;
    this.sectionId = container.id.replace('homepage-grid-', '');
    
    // Elements
    this.grid = container.querySelector('.product-grid-container');
    this.items = this.grid ? Array.from(this.grid.querySelectorAll('.product-grid-item')) : [];
    this.sidebar = container.querySelector('[data-filter-panel]');
    this.backdrop = container.querySelector('[data-filter-backdrop]');
    this.toggleBtn = container.querySelector('[data-filter-toggle-isolated]');
    this.closeBtn = container.querySelector('[data-filter-close]');
    this.viewItemsBtn = container.querySelector('[data-view-items]');
    this.countDisplay = container.querySelector('[data-product-count]');
    
    // Sort Elements
    this.sortToggle = container.querySelector('[data-sort-toggle]');
    this.sortMenu = container.querySelector('[data-sort-menu]');
    this.sortIcon = container.querySelector('[data-sort-icon]');
    this.sortOptions = container.querySelectorAll('[data-sort]');

    // State
    this.isOpen = false;
    this.activeFilters = {
      genre: [],
      label: [],
      manufacturer: [],
      format: [],
      type: [],
      color: [],
      availability: [],
      price: []
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.buildDynamicFilters(); // Optional: populate empty filter sections from data
  }

  bindEvents() {
    // Sidebar Toggle
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openSidebar();
      });
    }

    // Close Actions
    const closeHandler = (e) => {
      e.preventDefault();
      this.closeSidebar();
    };

    if (this.closeBtn) this.closeBtn.addEventListener('click', closeHandler);
    if (this.backdrop) this.backdrop.addEventListener('click', closeHandler);
    if (this.viewItemsBtn) this.viewItemsBtn.addEventListener('click', closeHandler);

    // Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.closeSidebar();
    });

    // Filter Accordions
    this.container.querySelectorAll('[data-filter-section]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleAccordion(btn);
      });
    });

    // Filter Checkboxes
    this.container.querySelectorAll('input[type="checkbox"][data-filter]').forEach(input => {
      input.addEventListener('change', () => this.handleFilterChange(input));
    });

    // Sorting
    if (this.sortToggle) {
      this.sortToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleSortMenu();
      });
    }

    this.sortOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSort(e.currentTarget);
      });
    });

    // Close sort on outside click
    document.addEventListener('click', (e) => {
      if (this.sortMenu && !this.sortToggle.contains(e.target) && !this.sortMenu.contains(e.target)) {
        this.closeSortMenu();
      }
    });
  }

  // --- Sidebar Logic ---

  openSidebar() {
    if (this.isOpen || !this.sidebar) return;
    this.isOpen = true;

    // CSS Classes for Open State
    this.sidebar.classList.remove('-translate-x-full');
    this.sidebar.classList.add('translate-x-0');
    
    if (this.backdrop) {
      this.backdrop.classList.remove('hidden', 'opacity-0', 'invisible');
      this.backdrop.classList.add('opacity-100', 'visible');
      this.backdrop.style.pointerEvents = 'auto'; // Ensure it catches clicks
    }

    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    if (!this.isOpen || !this.sidebar) return;
    this.isOpen = false;

    // CSS Classes for Closed State
    this.sidebar.classList.remove('translate-x-0');
    this.sidebar.classList.add('-translate-x-full');

    if (this.backdrop) {
      this.backdrop.classList.remove('opacity-100', 'visible');
      this.backdrop.classList.add('opacity-0', 'invisible');
      this.backdrop.style.pointerEvents = 'none';
      
      // Wait for transition to hide
      setTimeout(() => {
        if (!this.isOpen) this.backdrop.classList.add('hidden');
      }, 300);
    }

    document.body.style.overflow = '';
  }

  toggleAccordion(btn) {
    const sectionName = btn.dataset.filterSection;
    const content = this.container.querySelector(`[data-filter-section-content="${sectionName}"]`);
    const icon = btn.querySelector('.filter-section-icon');
    
    if (!content) return;

    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      content.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
      if (icon) icon.textContent = '+';
    } else {
      content.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      if (icon) icon.textContent = '−';
    }
  }

  // --- Filtering Logic ---

  handleFilterChange(input) {
    const type = input.name; // e.g., 'genre', 'price'
    const value = input.value;
    
    // Ensure array exists
    if (!this.activeFilters[type]) this.activeFilters[type] = [];

    if (input.checked) {
      this.activeFilters[type].push(value);
    } else {
      this.activeFilters[type] = this.activeFilters[type].filter(v => v !== value);
    }

    this.applyFilters();
  }

  applyFilters() {
    let visibleCount = 0;

    this.items.forEach(item => {
      let isVisible = true;

      // Check each active filter category
      for (const [key, activeValues] of Object.entries(this.activeFilters)) {
        if (activeValues.length === 0) continue;

        // Get item data for this key
        // Note: dataset keys are camelCase (data-price -> dataset.price)
        let itemValue = item.dataset[key]; // e.g. item.dataset.genre
        
        // Special handling for price ranges
        if (key === 'price') {
           if (!this.checkPrice(itemValue, activeValues)) isVisible = false;
        } 
        // Special handling for availability
        else if (key === 'availability') {
           if (!this.checkAvailability(item.dataset.available, activeValues)) isVisible = false;
        }
        // Standard string matching (arrays or single values)
        else {
           if (!itemValue || !activeValues.includes(itemValue)) {
             // If item has no value for this filter, or value not in active list -> hide
             // Note: This assumes strict match. For comma-separated tags, need 'includes' logic.
             // But existing code used dataset.type which is single value.
             // If dataset contains "rock, pop", we should check if any active value is in it.
             if (itemValue && activeValues.some(v => itemValue.includes(v))) {
                 // Match found (loose match)
             } else {
                 isVisible = false;
             }
           }
        }
      }

      if (isVisible) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (this.countDisplay) {
      this.countDisplay.textContent = visibleCount;
    }
  }

  checkPrice(priceStr, ranges) {
    const price = parseFloat(priceStr);
    return ranges.some(range => {
      if (range === '0-25') return price < 25;
      if (range === '25-50') return price >= 25 && price < 50;
      if (range === '50-100') return price >= 50 && price < 100;
      if (range === '100+') return price >= 100;
      return false;
    });
  }

  checkAvailability(availableStr, statuses) {
    const isAvailable = availableStr === 'true';
    return statuses.some(status => {
      if (status === 'in-stock') return isAvailable;
      if (status === 'sold-out') return !isAvailable;
      return false;
    });
  }

  // --- Sorting Logic ---

  toggleSortMenu() {
    const isExpanded = this.sortToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      this.closeSortMenu();
    } else {
      this.sortMenu.classList.remove('opacity-0', 'invisible', 'translate-y-[-10px]');
      this.sortMenu.classList.add('opacity-100', 'visible', 'translate-y-0');
      this.sortToggle.setAttribute('aria-expanded', 'true');
      if (this.sortIcon) this.sortIcon.style.transform = 'rotate(180deg)';
    }
  }

  closeSortMenu() {
    if (!this.sortMenu) return;
    this.sortMenu.classList.add('opacity-0', 'invisible', 'translate-y-[-10px]');
    this.sortMenu.classList.remove('opacity-100', 'visible', 'translate-y-0');
    this.sortToggle.setAttribute('aria-expanded', 'false');
    if (this.sortIcon) this.sortIcon.style.transform = 'rotate(0deg)';
  }

  handleSort(button) {
    const sortType = button.dataset.sort;
    
    // UI Update
    this.sortOptions.forEach(btn => {
      btn.classList.remove('text-vinyl-blue');
      btn.classList.add('text-gray-700');
    });
    button.classList.add('text-vinyl-blue');
    button.classList.remove('text-gray-700');
    this.closeSortMenu();

    // Sort Logic
    const sorted = [...this.items].sort((a, b) => {
       const titleA = a.dataset.title || '';
       const titleB = b.dataset.title || '';
       const priceA = parseFloat(a.dataset.price || 0);
       const priceB = parseFloat(b.dataset.price || 0);
       const dateA = parseInt(a.dataset.date || 0);
       const dateB = parseInt(b.dataset.date || 0);

       switch (sortType) {
         case 'alpha-asc': return titleA.localeCompare(titleB);
         case 'alpha-desc': return titleB.localeCompare(titleA);
         case 'price-asc': return priceA - priceB;
         case 'price-desc': return priceB - priceA;
         case 'date-asc': return dateA - dateB;
         case 'date-desc': return dateB - dateA; // Newest first
         default: return 0;
       }
    });

    // Re-append to grid
    sorted.forEach(item => this.grid.appendChild(item));
  }
  
  // Optional: Build dynamic filters from items present
  buildDynamicFilters() {
      // Example: Populate 'Genre' if data-genre is present on items
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.homepage-grid-section');
  sections.forEach(section => {
    new HomepageGrid(section);
  });
});
