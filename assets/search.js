class SearchModal {
  constructor() {
    this.modal = document.querySelector('[data-predictive-search-modal]');
    this.input = document.querySelector('[data-predictive-search-input]');
    this.results = document.querySelector('[data-predictive-search-results]');
    this.openButtons = document.querySelectorAll('[data-open-search]');
    this.closeButton = document.querySelector('[data-close-search]');
    this.popularSearches = this.results.innerHTML;

    this.init();
  }

  init() {
    if (!this.modal) return;

    this.openButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    this.closeButton.addEventListener('click', () => this.close());
    
    // Close on overlay click (if the modal has a backdrop, but here it's a slide-down)
    // Actually, let's close on Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
        this.close();
      }
      
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
    });

    this.input.addEventListener('input', debounce(() => {
      this.performSearch();
    }, 300));
  }

  open() {
    this.modal.classList.add('is-open');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => {
      this.input.focus();
    }, 300);
  }

  close() {
    this.modal.classList.remove('is-open');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
  }

  performSearch() {
    const query = this.input.value.trim();

    if (query.length < 2) {
      this.results.innerHTML = this.popularSearches;
      return;
    }

    fetch(`${window.Shopify.routes.root}search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=4&section_id=predictive-search`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Search failed');
        }
        return response.json();
      })
      .then(data => {
        this.renderResults(data.resources.results.products);
      })
      .catch(error => {
        console.error('Error performing search:', error);
      });
  }

  renderResults(products) {
    if (!products || products.length === 0) {
      this.results.innerHTML = `
        <h3 class="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">No results found</h3>
      `;
      return;
    }

    const html = products.map(product => `
      <a href="${product.url}" class="flex gap-4 group cursor-pointer hover:bg-white p-2 border border-transparent hover:border-gray-200 transition-all text-vinyl-black no-underline">
        <img src="${product.image}" alt="${product.title}" class="w-16 h-16 object-cover grayscale group-hover:grayscale-0">
        <div>
          <p class="font-serif font-bold text-lg leading-none">${product.vendor || ''}</p>
          <p class="font-sans text-sm text-gray-600">${product.title}</p>
          <p class="font-mono text-xs text-vinyl-blue mt-1">${this.formatPrice(product.price)}</p>
        </div>
      </a>
    `).join('');

    this.results.innerHTML = `
      <h3 class="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">Suggestions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${html}
      </div>
      <div class="mt-8">
        <button type="submit" form="${this.input.closest('form').id}" class="text-vinyl-blue font-mono text-xs uppercase hover:underline">
          View all results →
        </button>
      </div>
    `;
  }

  formatPrice(price) {
    // Use global formatMoney function
    return window.formatMoney ? window.formatMoney(price, '${{amount}}') : `$${(price / 100).toFixed(2)}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.Search = new SearchModal();
});
