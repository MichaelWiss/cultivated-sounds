# Cultivated Sounds - Remaining Tasks

**Last Updated:** January 19, 2026  
**Status:** MVP Functional

---

## ✅ Recently Fixed

- ✅ Cart drawer opens correctly
- ✅ Product card links work in all sections
- ✅ Mobile menu opens (header-drawer.js loaded)
- ✅ Routes defined before deferred scripts
- ✅ Audio player integration - tracklist block now supports metafield data

---

## 🟡 High Priority (Should Fix Before Launch)

### 4. Audio Player - Create Metafields in Shopify Admin
- **Status:** Code complete, needs Shopify configuration
- **Action Required:** Create metafield definition in Shopify Admin:
  - **Namespace:** `custom`
  - **Key:** `tracklist`
  - **Type:** JSON
  - **Format:**
    ```json
    [
      {"title": "Track Name", "duration": "3:45", "side": "A", "preview_url": "https://cdn.shopify.com/..."},
      {"title": "Another Track", "duration": "4:12", "side": "A"}
    ]
    ```
  - Note: `preview_url` is optional - tracks without it show as non-playable
- **Files:** `sections/main-product.liquid`, `assets/audio-player.js`

### 5. Predictive Search Not Returning Results
- **Status:** Implemented but may need debugging
- **Issue:** `search.js` fetches from `/search/suggest.json` but section_id `predictive-search` doesn't exist
- **Fix:** Either create `sections/predictive-search.liquid` or update JS to parse JSON response
- **Files:** `assets/search.js`, `sections/search-modal.liquid`

### 6. Collection Filters (Homepage Grid)
- **Status:** UI exists, filtering logic incomplete
- **Issue:** Client-side filters in `homepage-grid.js` but filter options are hardcoded/empty
- **Missing:**
  - Dynamic filter options from product tags/metafields
  - Genre, Label, Manufacturer filters need data
- **Files:** `sections/homepage-grid.liquid`, `assets/homepage-grid.js`

### 7. Product Page - Variant Selection
- **Status:** Basic form exists
- **Issue:** Variant selector may not update price/image dynamically
- **Test:** On product with variants, change variant, verify price updates
- **Files:** `sections/main-product.liquid`, `assets/product-form.js`

---

## 🟢 Medium Priority (Polish & Enhancement)

### 8. Product Metafields Setup
Define and document required metafields:
- `custom.catalog_number` - Catalog/SKU number
- `custom.format` - Format type (2LP, CD, etc.)
- `custom.audio_preview_url` - Audio preview file URL
- `custom.tracklist` - JSON array of tracks

### 9. Loading States & Feedback
- Add to cart button loading spinner
- Cart update loading indicators
- Search loading state

### 10. Error Handling
- Cart error messages display
- Out of stock handling
- Network error feedback

### 11. Accessibility Audit
- Focus trapping in modals/drawers
- Keyboard navigation
- Screen reader labels
- `prefers-reduced-motion` respect in all animations

### 12. SEO Optimization
- Verify meta tags render correctly
- Structured data (JSON-LD) for products
- Open Graph images

---

## 🔵 Low Priority (Nice to Have)

### 13. Newsletter Form (Footer)
- Form exists but may not be connected to Shopify Customer API
- Verify form submission works

### 14. Customer Account Pages
- Login, Register, Account, Addresses sections exist
- Need styling review for consistency

### 15. Soft Navigation (Swup)
- Currently commented out in `theme.liquid`
- Enable and test for smoother page transitions

### 16. GSAP Animations Review
- Verify all ScrollTrigger animations work
- Test performance on mobile
- Ensure animations respect reduced motion

### 17. Image Optimization
- Verify responsive images load correctly
- Add blur-up placeholder loading

---

## 📋 Pre-Launch Checklist

- [ ] All product cards clickable
- [ ] Cart drawer opens and closes
- [ ] Add to cart works
- [ ] Cart quantity update works
- [ ] Cart remove item works
- [ ] Checkout button works
- [ ] Mobile menu works
- [ ] Search returns results
- [ ] Product page displays correctly
- [ ] Collection page displays correctly
- [ ] Pagination works
- [ ] 404 page styled
- [ ] Password page styled
- [ ] Favicon set
- [ ] Theme settings work (colors, logo)

---

## File Structure Reference

```
├── assets/
│   ├── global.js          ✅ Utilities (fetchConfig, trapFocus, debounce)
│   ├── constants.js       ✅ Theme configuration
│   ├── cart.js            ✅ Cart operations
│   ├── cart-drawer.js     ✅ Cart drawer web component
│   ├── header-drawer.js   ✅ Mobile menu web component
│   ├── product-form.js    ✅ Add to cart AJAX
│   ├── product-gallery.js ✅ Product image gallery
│   ├── search.js          ⚠️ Predictive search (needs fix)
│   ├── audio-player.js    ⚠️ Audio player (needs data)
│   ├── homepage-grid.js   ⚠️ Filters (needs data)
│   ├── animations.js      ✅ GSAP animations
│   └── application.css    ✅ Tailwind compiled CSS
│
├── sections/
│   ├── header.liquid              ✅ 
│   ├── footer.liquid              ✅
│   ├── cart-drawer.liquid         ✅
│   ├── search-modal.liquid        ✅
│   ├── main-product.liquid        ✅
│   ├── main-collection-*.liquid   ✅
│   ├── homepage-grid.liquid       ⚠️ Filters incomplete
│   ├── featured-collection.liquid ✅
│   ├── staff-picks.liquid         ✅
│   └── ... (32 total)
│
├── snippets/
│   ├── card-product.liquid    ✅ Fixed
│   ├── audio-player-bar.liquid ⚠️ Needs data
│   ├── price.liquid           ✅
│   ├── buy-buttons.liquid     ✅
│   └── ... (23 total)
│
├── templates/               ✅ All JSON templates exist
├── config/                  ✅ Settings schema defined
└── locales/                 ✅ English translations
```

---

## Estimated Remaining Work

| Priority | Tasks | Estimated Time |
|----------|-------|----------------|
| � High | 4 tasks | 4-6 hours |
| 🟢 Medium | 5 tasks | 3-4 hours |
| 🔵 Low | 5 tasks | 4-6 hours |
| **Total** | **14 tasks** | **11-16 hours** |

**To MVP:** ~4-6 hours (High priority)  
**To Launch:** ~11-16 hours (All priorities)
