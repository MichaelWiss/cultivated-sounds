class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    if (!this.form) return;
    
    const idInput = this.form.querySelector('[name=id]');
    if (idInput) {
      idInput.disabled = false;
    }
    
    this.form.addEventListener('submit', this.onSubmit.bind(this));
    this.cartDrawer = document.querySelector('cart-drawer');
  }

  async onSubmit(evt) {
    evt.preventDefault();
    const submitButton = this.querySelector('[type="submit"]');
    if (submitButton.classList.contains('loading')) return;

    this.handleErrorMessage();
    submitButton.setAttribute('aria-disabled', true);
    submitButton.classList.add('loading');
    
    const loadingOverlay = submitButton.querySelector('.loading-overlay__spinner');
    const submitText = submitButton.querySelector('.submit-text');
    const submitIcon = submitButton.querySelector('.submit-icon');

    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    if (submitText) submitText.classList.add('hidden');
    if (submitIcon) submitIcon.classList.add('hidden');

    const config = {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/javascript'
      },
      body: new FormData(this.form)
    };

    try {
        const response = await fetch(window.routes.cart_add_url, config);
        const responseJson = await response.json();

        if (response.ok) {
            // Success: Trigger cart update event
            document.dispatchEvent(new CustomEvent('cart:updated', {
                detail: {
                    cart: responseJson
                }
            }));
        } else {
            this.handleErrorMessage(responseJson.description || responseJson.message);
        }
    } catch (e) {
        console.error(e);
        this.handleErrorMessage(window.cartStrings.error);
    } finally {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('aria-disabled');
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
        if (submitText) submitText.classList.remove('hidden');
        if (submitIcon) submitIcon.classList.remove('hidden');
    }
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.querySelector('[data-error-wrapper]');
    this.errorMessage = this.querySelector('.product-form__error-message');
    
    if (!this.errorMessageWrapper) return;
    
    if (errorMessage) {
      this.errorMessageWrapper.removeAttribute('hidden');
      this.errorMessage.textContent = errorMessage;
    } else {
      this.errorMessageWrapper.setAttribute('hidden', true);
      this.errorMessage.textContent = '';
    }
  }
}

customElements.define('product-form', ProductForm);