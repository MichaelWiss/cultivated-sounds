class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.overlay = this.querySelector('#cart-overlay');
    this.container = this.querySelector('#cart-container');
    this.closeBtn = this.querySelector('#cart-close');
    this.continueBtn = this.querySelector('#cart-continue');
    
    this.init();
  }

  init() {
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());
    if (this.continueBtn) this.continueBtn.addEventListener('click', () => this.close());

    // Listen for global cart update events
    document.addEventListener('cart:updated', (e) => {
      // e.detail.cart contains the JSON, but we prefer fetching fresh HTML via Section API
      this.fetchSectionMarkup();
      this.open();
    });

    // Delegate item events (increase, decrease, remove)
    this.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        
        const action = btn.dataset.action;
        const key = btn.dataset.key;
        
        if (action === 'increase') this.updateQuantity(key, 1);
        if (action === 'decrease') this.updateQuantity(key, -1);
        if (action === 'remove') this.updateQuantity(key, 0);
    });
  }

  open() {
    this.hidden = false;
    // Animate in
    requestAnimationFrame(() => {
        if(this.overlay) this.overlay.classList.remove('opacity-0', 'pointer-events-none');
        if(this.container) this.container.classList.remove('translate-x-full');
    });
    document.body.classList.add('overflow-hidden');
  }

  close() {
    if(this.overlay) this.overlay.classList.add('opacity-0', 'pointer-events-none');
    if(this.container) this.container.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
    
    setTimeout(() => {
        this.hidden = true;
    }, 500); // Match transition duration
  }

  async updateQuantity(key, delta) {
    const itemRow = this.querySelector(`[data-key="${key}"]`);
    if (!itemRow && delta !== 0) return; 

    let currentQty = 0;
    if (itemRow) {
        // Find the input or span containing quantity
        const qtyDisplay = itemRow.querySelector('.text-center');
        if (qtyDisplay) currentQty = parseInt(qtyDisplay.textContent.trim());
    }

    // For Remove, delta is 0 implies set to 0. For others it's relative.
    // My logic above: if action is remove, I called updateQuantity(key, 0)
    // But delta 0 usually means "add 0". Let's handle explicit 0 properly.
    
    let newQty;
    if (delta === 0) {
        newQty = 0; // Explicit remove
    } else {
        newQty = currentQty + delta;
    }
    
    const res = await fetch(window.routes.cart_change_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            id: key,
            quantity: newQty
        })
    });

    const cart = await res.json();
    this.fetchSectionMarkup();
  }

  async fetchSectionMarkup() {
    // We need to fetch a section that RENDERS the 'cart-drawer' snippet.
    // If 'cart-drawer' is just a snippet included in layout, we can't fetch it directly via ?section_id=cart-drawer
    // unless there is a registered SECTION called 'cart-drawer'.
    // 
    // Correction: In Phase 2, I created snippets/cart-drawer.liquid. 
    // To use Section Rendering API, I need a SECTION that renders this snippet.
    // 
    // For now, I will assume we create a dummy section or use 'cart-drawer' if it was a section.
    // Plan correction: I should convert snippets/cart-drawer.liquid to sections/cart-drawer.liquid 
    // OR create sections/cart-drawer.liquid that renders the snippet.
    // 
    // Let's rely on the fact that I haven't created sections/cart-drawer.liquid yet. 
    // I will modify this JS to assume 'cart-drawer' section exists.
    
    const res = await fetch(`${window.routes.cart_url}?section_id=cart-drawer`);
    const text = await res.text();
    
    // Parse HTML to get the inner content of the drawer
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    
    // The response will look like <div id="shopify-section-cart-drawer"> ... content ... </div>
    // We want the content inside <cart-drawer>
    const newDrawerContent = doc.querySelector('cart-drawer');
    
    if (newDrawerContent) {
        this.innerHTML = newDrawerContent.innerHTML;
        // Re-bind elements because we wiped innerHTML
        this.overlay = this.querySelector('#cart-overlay');
        this.container = this.querySelector('#cart-container');
        this.closeBtn = this.querySelector('#cart-close');
        this.continueBtn = this.querySelector('#cart-continue');
        
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
        if (this.overlay) this.overlay.addEventListener('click', () => this.close());
        if (this.continueBtn) this.continueBtn.addEventListener('click', () => this.close());
        
        // Ensure it stays open visually
        this.overlay.classList.remove('opacity-0', 'pointer-events-none');
        this.container.classList.remove('translate-x-full');
    }
  }
}

customElements.define('cart-drawer', CartDrawer);