class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.form.querySelector('[name=id]').disabled = false;
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
            this.handleErrorMessage(responseJson.description);
        }
    } catch (e) {
        console.error(e);
        this.handleErrorMessage(window.cartStrings.error);
    } finally {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('aria-disabled');
    }
  }

  handleErrorMessage(errorMessage = false) {
    // Basic alert for now, can be improved to inline error
    if (errorMessage) {
        alert(errorMessage);
    }
  }
}

customElements.define('product-form', ProductForm);