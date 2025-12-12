class HeaderDrawer extends HTMLElement {
  constructor() {
    super();
    this.overlay = this.querySelector('#mobile-menu-overlay');
    this.container = this.querySelector('#mobile-menu-container');
    this.closeBtn = this.querySelector('#mobile-menu-close');
    
    this.init();
  }

  init() {
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());
    
    // Global listener to open this drawer
    document.addEventListener('menu:open', () => this.open());
  }

  open() {
    this.hidden = false;
    requestAnimationFrame(() => {
        this.overlay.classList.remove('opacity-0', 'pointer-events-none');
        this.container.classList.remove('translate-x-full');
    });
    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.overlay.classList.add('opacity-0', 'pointer-events-none');
    this.container.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
    
    setTimeout(() => {
        this.hidden = true;
    }, 300);
  }
}

customElements.define('header-drawer', HeaderDrawer);