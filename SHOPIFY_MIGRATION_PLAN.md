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

## 6. Migration Steps

1.  **Initialize Theme**: Create the folder structure and `layout/theme.liquid`.
2.  **Migrate Static Assets**: Move images and fonts to `assets/`.
3.  **Setup Tailwind**: Configure Tailwind to output to `assets/app.css`.
4.  **Port Header & Footer**: Convert `Header.tsx` and `Footer.tsx` to Liquid sections.
5.  **Port Homepage Sections**: Convert `Hero.tsx`, `Marquee.tsx` to dynamic sections.
6.  **Implement Product Card**: Create `snippets/card-product.liquid`.
7.  **Build Templates**:
    - `index.json` (Home)
    - `product.json` (Product Page)
    - `collection.json` (Collection Page)
8.  **Implement Cart**: Build the `cart-drawer` web component and connect it to the Ajax API.
9.  **GSAP Integration**: Move GSAP animations into a `global.js` or section-specific JS files.

## 7. Next Actions

- [ ] Create the `theme` directory structure.
- [ ] Set up `layout/theme.liquid` with the HTML shell.
- [ ] Create `config/settings_schema.json` to define colors and fonts.
