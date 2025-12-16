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

We will adopt the standard Shopify theme directory structure, following patterns from Dawn and Horizon:

```text
theme/
├── assets/             # Compiled CSS, JS, Images
├── config/             # settings_schema.json, settings_data.json
│   └── section-groups/ # header-group.json, footer-group.json (modular sections)
├── layout/             # theme.liquid, password.liquid
├── locales/            # en.default.json (Translations with t: keys)
├── sections/           # Liquid sections (Header, Hero, Product, etc.)
├── snippets/           # Reusable Liquid snippets (Product Card, Icons)
├── templates/          # JSON templates (index.json, product.json, etc.)
│   └── customers/      # Customer account templates (login, register, account, etc.)
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

### Phase 2: Product & Collection Pages ✅ COMPLETE
9.  ✅ **Price Snippet**: Create `snippets/price.liquid` for consistent price formatting.
10. ✅ **Product Media**: Create `snippets/product-media.liquid` for product gallery.
11. ✅ **Buy Buttons**: Create `snippets/buy-buttons.liquid` wrapping the `product-form` custom element.
12. ✅ **Product Section**: Create `sections/main-product.liquid` implementing the product detail view.
13. ✅ **Product Template**: Create `templates/product.json` to link the section.
14. ✅ **Product Card**: Create `snippets/card-product.liquid` for listing products.
15. ✅ **Collection Grid**: Create `sections/main-collection-product-grid.liquid` for collection pages.
16. ✅ **Collection Template**: Create `templates/collection.json`.

### Phase 3: Core Templates ✅ COMPLETE
_Required templates for Shopify theme preview and basic store functionality._

17. ✅ **404 Page**: Create `templates/404.json` and `sections/main-404.liquid` for "page not found" handling.
18. ✅ **Cart Page**: Create `templates/cart.json` and `sections/main-cart.liquid` for standalone cart view.
19. ✅ **Search Page**: Create `templates/search.json` and `sections/main-search.liquid` for search results.
20. ✅ **Collections List**: Create `templates/list-collections.json` and `sections/main-list-collections.liquid`.
21. ✅ **Static Pages**: Create `templates/page.json` and `sections/main-page.liquid` for CMS pages.
22. ✅ **Pagination Snippet**: Create `snippets/pagination.liquid` for paginated lists.
23. ✅ **Customer Account**: Create `templates/customers/account.json` and `sections/main-account.liquid`.
24. ✅ **Customer Login**: Create `templates/customers/login.json` and `sections/main-login.liquid`.
25. ✅ **Customer Register**: Create `templates/customers/register.json` and `sections/main-register.liquid`.
26. ✅ **Customer Addresses**: Create `templates/customers/addresses.json` for address management.
27. ✅ **Customer Order**: Create `templates/customers/order.json` for order history details.
28. ✅ **Password Reset**: Create `templates/customers/reset_password.json` for password recovery.
29. ✅ **Account Activation**: Create `templates/customers/activate_account.json` for new account activation.

### Phase 4: Schema & Enhancement ✅ COMPLETE
_Previously "Phase 3: Enhancement"_

30. ✅ **Schema Standardization**: Add standard schema properties to all sections (`tag`, `class`, `disabled_on`, `presets`).
31. ✅ **Theme Editor Controls**: Add padding settings to section schemas for Theme Editor control.
32. ✅ **Routes Configuration**: Create `assets/constants.js` for Shopify routes configuration.
33. ✅ **Animation**: Add responsive drawer animation CSS.

### Phase 5: Polish ✅ COMPLETE
_Previously "Phase 4: Polish"_

34. ✅ **UI Polish**: Add quantity input custom element styling.
35. ✅ **Feedback**: Add loading spinners for cart operations.
36. ✅ **Error Handling**: Add error message display for cart errors.

### Phase 6: Blog & Content ✅ COMPLETE
_Blog, article, password, and gift card templates._

37. ✅ **Password Layout**: Create `layout/password.liquid` for store password page.
38. ✅ **Password Template**: Create `templates/password.json`.
39. ✅ **Blog Template**: Create `templates/blog.json`.
40. ✅ **Article Template**: Create `templates/article.json`.
41. ✅ **Blog Section**: Create `sections/main-blog.liquid` for blog listing.
42. ✅ **Article Section**: Create `sections/main-article.liquid` for blog posts.
43. ✅ **Gift Card Template**: Create `templates/gift_card.liquid` for digital gift cards.

### Phase 7: Best Practices Upgrade 🔄 IN PROGRESS
_Based on Dawn/Horizon audit findings._

44. ✅ **Section Groups**: Create `config/section-groups/header-group.json` and `footer-group.json`.
45. ✅ **Expanded Settings Schema**: Add logo, social links, cart type, animations, favicon to `settings_schema.json`.
46. ⏳ **Section Padding Controls**: Add `padding_top`/`padding_bottom` settings to all section schemas.
47. ⏳ **Localization Keys**: Replace hardcoded strings with `t:` translation keys.
48. ⏳ **Bundle External Scripts**: Move GSAP, Howler.js to theme assets (remove CDN dependencies).
49. ⏳ **Responsive Images**: Implement `srcset` and `sizes` for product and collection images.
50. ⏳ **Missing Snippets**: Create `loading-spinner.liquid`, `social-icons.liquid`, `facets.liquid`.
51. ⏳ **Accessibility**: Add focus management, ARIA labels, `prefers-reduced-motion` support.

---

## 7. Migration Status

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Critical Infrastructure | ✅ Complete | 8/8 |
| Phase 2: Product & Collection | ✅ Complete | 8/8 |
| Phase 3: Core Templates | ✅ Complete | 13/13 |
| Phase 4: Schema & Enhancement | ✅ Complete | 4/4 |
| Phase 5: Polish | ✅ Complete | 3/3 |
| Phase 6: Blog & Content | ✅ Complete | 7/7 |
| Phase 7: Best Practices | ⏳ Not Started | 0/8 |

**Overall Progress: ~86% Complete (43/51 tasks)**

---

## 8. Audit Findings (Dawn/Horizon Comparison)

### Missing Critical Items
| Item | Priority | Status |
|------|----------|--------|
| `layout/password.liquid` | HIGH | ✅ Created |
| `templates/blog.json` | MEDIUM | ✅ Created |
| `templates/article.json` | MEDIUM | ✅ Created |
| `sections/main-blog.liquid` | MEDIUM | ✅ Created |
| `sections/main-article.liquid` | MEDIUM | ✅ Created |
| `templates/gift_card.liquid` | MEDIUM | ✅ Created |
| Section Groups (header/footer) | MEDIUM | ⏳ Pending |

### Schema & Settings Issues
- ❌ No translation keys (`t:`) - hardcoded English strings throughout
- ❌ No section padding controls in most schemas
- ❌ Limited `settings_schema.json` - missing logo, social links, cart type settings

### JavaScript Architecture
- ❌ External CDN dependencies (GSAP, Howler.js, Google Fonts)
- ❌ Missing PubSub pattern for component communication (Dawn uses this extensively)
- ✅ Web Components pattern implemented correctly

### Accessibility Gaps
- ❌ Limited `.visually-hidden` usage for screen readers
- ❌ Inconsistent ARIA labels across interactive elements
- ❌ No `prefers-reduced-motion` media query support for animations

### Performance Concerns
- ❌ No critical CSS preloading strategy
- ❌ Single image sizes instead of responsive `srcset`
- ❌ External fonts block rendering (no font-display: swap)

---

## 9. Next Steps

### Immediate (Complete Phase 6)
1. Create `sections/main-blog.liquid` for blog listing page
2. Create `sections/main-article.liquid` for individual blog posts
3. Create `templates/gift_card.liquid` for gift card pages

### Short-term (Phase 7)
1. Implement section groups for modular header/footer
2. Expand `settings_schema.json` with full Dawn-like settings
3. Add responsive images with `srcset` attributes

### Long-term (Production Ready)
1. Bundle external scripts into theme assets
2. Full accessibility audit and fixes
3. Performance optimization (critical CSS, lazy loading)
4. Cross-browser and mobile testing
