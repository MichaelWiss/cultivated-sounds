# Shopify Theme Migration Plan

This document outlines the plan to convert the current React-based "Finer Sounds" application into a fully functional Shopify theme, following the coding conventions of Shopify's reference theme, [Dawn](https://github.com/Shopify/dawn).

## 1. Architecture Overview

The current application is a Single Page Application (SPA) using React, Vite, and Tailwind CSS.
The target architecture is a **Shopify 2.0 Online Store Theme** using Liquid, HTML, CSS (Tailwind), and Vanilla JavaScript (Web Components).

### Key Differences
| Feature | Current (React) | Target (Shopify Theme) |
|---------|-----------------|------------------------|
| **Routing** | Client-side (`currentView` state) | Server-side (Liquid Templates) |
| **Data** | Static constants (`constants.ts`) | Dynamic Liquid Objects (`product`, `collection`) |
| **State** | React Context (`ShopContext`) | Native Browser APIs & Shopify Ajax API |
| **Interactivity** | React Hooks | Custom Elements (Web Components) |
| **Styling** | Tailwind CSS | Tailwind CSS (Build Step) + CSS Variables |

## 2. Directory Structure

We will adopt the standard Shopify theme directory structure:

```text
theme/
├── assets/             # Compiled CSS, JS, Images
├── config/             # settings_schema.json (Theme settings)
├── layout/             # theme.liquid (Master layout)
├── locales/            # en.default.json (Translations)
├── sections/           # Liquid sections (Header, Hero, Product, etc.)
├── snippets/           # Reusable Liquid snippets (Product Card, Icons)
├── templates/          # JSON templates (index.json, product.json)
│   └── customers/      # Customer account templates
└── package.json        # Build scripts for Tailwind
```

## 3. Component Mapping

We will migrate React components to Liquid sections and snippets.

| React Component | Shopify File | Type | Notes |
|-----------------|--------------|------|-------|
| `App.tsx` (Layout) | `layout/theme.liquid` | Layout | Main HTML shell, includes Header/Footer |
| `Header.tsx` | `sections/header.liquid` | Section | Navigation, Logo, Search trigger |
| `Footer.tsx` | `sections/footer.liquid` | Section | Footer links, newsletter |
| `Hero.tsx` | `sections/image-banner.liquid` | Section | Main hero banner with GSAP animations |
| `Marquee.tsx` | `sections/announcement-bar.liquid` | Section | Scrolling text bar |
| `ProductCard.tsx` | `snippets/card-product.liquid` | Snippet | Reusable product card |
| `ProductDetail.tsx` | `sections/main-product.liquid` | Section | Product page details, gallery, form |
| `ProductForm.tsx` | `snippets/buy-buttons.liquid` | Snippet | Add to cart form |
| `CollectionPage.tsx`| `sections/main-collection-product-grid.liquid` | Section | Grid of products |
| `CartDrawer.tsx` | `sections/cart-drawer.liquid` | Section | Slide-out cart (using `cart-drawer` web component) |
| `SearchModal.tsx` | `snippets/search-modal.liquid` | Snippet | Search overlay |
| `TextPage.tsx` | `sections/main-page.liquid` | Section | Standard content pages |

## 4. State Management & Interactivity

Dawn uses **Custom Elements (Web Components)** for interactivity to avoid heavy framework bundles. We will replace React hooks with vanilla JS classes extending `HTMLElement`.

### Example: Cart Drawer
**React:**
```tsx
const { isCartOpen, toggleCart } = useShop();
```

**Shopify (Dawn-style):**
```javascript
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('keyup', (evt) => {
      if (evt.code === 'Escape') this.close();
    });
  }
  open() {
    this.classList.add('active');
  }
  close() {
    this.classList.remove('active');
  }
}
customElements.define('cart-drawer', CartDrawer);
```

### Cart Operations
Instead of `ShopContext`, we will use the **Shopify Ajax API**:
- Add to Cart: `POST /cart/add.js`
- Update Cart: `POST /cart/change.js`
- Get Cart: `GET /cart.js`

## 5. Styling Strategy (Tailwind + Liquid)

To maintain the current design while adhering to Shopify standards:

1.  **Tailwind Configuration**: Keep Tailwind, but configure it to use Shopify's CSS variables for colors and fonts.
2.  **Theme Settings**: Map `settings_schema.json` to CSS variables in `theme.liquid`.
    ```css
    :root {
      --color-vinyl-blue: {{ settings.colors_accent_1 }};
      --font-heading-family: {{ settings.type_header_font.family }};
    }
    ```
3.  **Build Process**: Use a simple build script to compile `tailwind.css` into `assets/application.css`.

## 6. Migration Phases (Updated)

### Phase 1: Critical Infrastructure (Must Fix) ✅ COMPLETE
1.  ✅ **Global Utilities**: Create `assets/global.js` with `fetchConfig`, `trapFocus`, `debounce` utilities.
2.  ✅ **SEO**: Create `snippets/meta-tags.liquid` for SEO.
3.  ✅ **Cart Drawer Snippet**: Create `snippets/cart-drawer.liquid` following Dawn pattern (replacing section approach).
4.  ✅ **Localization**: Update `locales/en.default.json` with missing keys (`skip_to_text`, `cart_error`, etc.).
5.  ✅ **Theme Layout**: Update `layout/theme.liquid` with skip link, cart-drawer render, and proper script loading.
6.  ✅ **Product Form Ajax**: Create `assets/product-form.js` for Ajax add-to-cart.
7.  ✅ **Cart Drawer Logic**: Update `cart-drawer.js` to add `CartDrawerItems` class extending cart functionality.
8.  ✅ **Header Integration**: Update `header.liquid` to make cart icon open drawer instead of linking.

### Phase 2: Product & Collection Pages (Core Templates) ✅ COMPLETE
9.  ✅ **Price Snippet**: Create `snippets/price.liquid` for consistent price formatting.
10. ✅ **Product Media**: Create `snippets/product-media.liquid` for product gallery.
11. ✅ **Buy Buttons**: Create `snippets/buy-buttons.liquid` wrapping the `product-form` custom element.
12. ✅ **Product Section**: Create `sections/main-product.liquid` implementing the product detail view.
13. ✅ **Product Template**: Create `templates/product.json` to link the section.
14. ✅ **Product Card**: Create `snippets/card-product.liquid` for listing products.
15. ✅ **Collection Grid**: Create `sections/main-collection-product-grid.liquid` for collection pages.
16. ✅ **Collection Template**: Create `templates/collection.json`.

### Phase 3: Enhancement (Should Fix) ✅ COMPLETE
17. ✅ **Schema Standardization**: Add standard schema properties to all sections (`tag`, `class`, `disabled_on`, `presets`).
18. ✅ **Theme Editor Controls**: Add padding settings to section schemas for Theme Editor control.
19. ✅ **Routes Configuration**: Create `assets/constants.js` for Shopify routes configuration.
20. ✅ **Animation**: Add responsive drawer animation CSS.

### Phase 4: Polish (Nice to Have) ⚠️ PARTIAL
21. ✅ **UI Polish**: Add quantity input custom element styling.
22. ✅ **Feedback**: Add loading spinners for cart operations.
23. ✅ **Error Handling**: Add error message display for cart errors.

## 7. Migration Status

**✅ ALL PHASES COMPLETE!**

The Shopify theme migration is now **100% complete** with all critical infrastructure, product pages, enhancements, and polish items implemented.

### Completed:
- ✅ Phase 1: Critical Infrastructure (8/8 tasks)
- ✅ Phase 2: Product & Collection Pages (8/8 tasks)
- ✅ Phase 3: Enhancement (4/4 tasks)
- ✅ Phase 4: Polish (3/3 tasks)

### Next Steps for Production:
1. **Test on Shopify Dev Store** - Upload theme and test all functionality
2. **Verify Cart Operations** - Test add to cart, update quantity, remove items
3. **Check Theme Editor** - Verify all section settings work correctly
4. **Performance Audit** - Run Lighthouse and optimize if needed
5. **Cross-browser Testing** - Test on Chrome, Safari, Firefox, Edge
6. **Mobile Testing** - Verify responsive design on various devices
