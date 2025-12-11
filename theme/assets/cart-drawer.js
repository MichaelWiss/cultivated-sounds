class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('.drawer__overlay').addEventListener('click', () => this.close());
  }

  open() {
    const drawer = this.querySelector('#CartDrawer');
    drawer.classList.remove('hidden');
    // Small delay to allow display:block to apply before transition
    setTimeout(() => {
      drawer.querySelector('.drawer__inner').classList.remove('translate-x-full');
      drawer.querySelector('.drawer__inner').classList.add('translate-x-0');
    }, 10);
    document.body.classList.add('overflow-hidden');
  }

  close() {
    const drawer = this.querySelector('#CartDrawer');
    drawer.querySelector('.drawer__inner').classList.remove('translate-x-0');
    drawer.querySelector('.drawer__inner').classList.add('translate-x-full');
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 500);
    document.body.classList.remove('overflow-hidden');
  }

  changeQuantity(key, quantity) {
    const body = JSON.stringify({
      id: key,
      quantity: quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), body })
      .then((response) => response.json())
      .then((parsedState) => {
        this.getSectionsToRender().forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          elementToReplace.innerHTML =
            this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
        }));
        
        this.updateCartCount(parsedState.item_count);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner'
      },
      {
        id: 'cart-icon-bubble',
        section: 'header',
        selector: '#cart-icon-bubble'
      }
    ];
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  updateCartCount(count) {
    // Logic to update cart count bubble if not handled by section rendering
    // In this implementation, we re-render the header section part, so it should be automatic if configured correctly.
    // However, header re-rendering might be tricky if it's not in the same section group context.
    // For simplicity, we might need to manually update the bubble if section rendering fails for header.
  }
}

customElements.define('cart-drawer', CartDrawer);

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}
