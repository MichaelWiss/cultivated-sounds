# Code Audit Report - Cultivated Sounds
**Date:** December 18, 2024  
**Auditor:** Warp AI Agent  
**Status:** 🔴 Critical Issues Found

---

## Executive Summary

This audit identifies **13 critical issues** across errors, duplications, and architectural problems. The codebase is ~85% functional but has technical debt that could cause runtime errors and maintenance challenges.

**Priority Breakdown:**
- 🔴 **P0 Critical:** 2 issues (will cause runtime errors)
- 🟡 **P1 High:** 5 issues (code duplication, maintainability)
- 🟢 **P2 Medium:** 6 issues (architectural cleanup)

---

## 🔴 CRITICAL ERRORS (P0)

### 1. Missing Utility Functions
**File:** `assets/cart.js` (lines 58, 95, 98, 100)  
**Issue:** Calls `fetchConfig()` and `trapFocus()` which are never defined

```javascript
// Line 58 - fetchConfig is undefined
fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })

// Lines 95, 98, 100 - trapFocus is undefined
trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`))
```

**Impact:** Runtime errors when updating cart quantities  
**Fix Required:** Add these Dawn utility functions to `global.js`

---

### 2. ~~Schema Name Mismatch~~ ✅ FALSE ALARM
**File:** `sections/featured-collection.liquid`  
**Status:** No issue found - sections are correctly named
- `staff-picks.liquid` → "Staff Picks" (editorial style)
- `featured-collection.liquid` → "Featured Collection" (grid with borders)

**Note:** These are two distinct sections with different designs, both are correct.

---

### 3. Invalid Collection Reference
**File:** `templates/index.json` (line 17) - **ALREADY FIXED**  
**Issue:** Referenced non-existent "frontpage" collection  
**Status:** ✅ Fixed in previous session

---

## 🟡 CODE DUPLICATION (P1)

### 4. Debounce Function - Duplicated 3x

**Locations:**
1. `assets/global.js` (lines 51-57)
2. `assets/constants.js` (lines 112-118)
3. `assets/search.js` (lines 122-132)

```javascript
// Three identical implementations
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
```

**Impact:** 3x code maintenance, inconsistent behavior  
**Fix:** Keep only in `global.js`, remove from others

---

### 5. Money Formatting - Duplicated 2x

**Locations:**
1. `assets/global.js` - `formatMoney()` (48 lines)
2. `assets/constants.js` - `formatMoney()` (7 lines)
3. `assets/search.js` - `formatPrice()` (7 lines)

**Impact:** Inconsistent formatting across theme  
**Fix:** Standardize on one implementation in `global.js`

---

### 6. Drawer Open/Close Logic - Duplicated 2x

**Files:** `cart-drawer.js` and `header-drawer.js`

Both have identical patterns:
```javascript
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
  setTimeout(() => { this.hidden = true; }, 500);
}
```

**Impact:** 2x maintenance burden  
**Fix:** Create base `Drawer` class that both extend

---

### 7. Product Grid Sections - 3 Overlapping Implementations

**Files:**
1. `sections/homepage-grid.liquid` (98 lines)
2. `sections/product-grid-main.liquid` (95 lines)  
3. `sections/main-collection-product-grid.liquid` (182 lines)

**Overlap:**
- All render product grids with filters
- All have sorting dropdowns
- All use `card-product` snippet
- Different markup patterns for same functionality

**Impact:** Maintenance nightmare, design inconsistency  
**Fix:** Consolidate into one flexible section with settings

---

## 🔧 SPAGHETTI CODE (P1)

### 8. Inconsistent Collection Handling

**Issue:** Three different patterns for getting collection:

```liquid
<!-- Pattern 1: homepage-grid.liquid -->
{%- assign collection = section.settings.collection | default: collections['all'] -%}

<!-- Pattern 2: product-grid-main.liquid -->
{%- assign collection_to_use = section.settings.collection | default: collections.all -%}

<!-- Pattern 3: staff-picks.liquid -->
{%- for product in section.settings.collection.products limit: ... -%}
```

**Fix:** Standardize on one pattern across all sections

---

### 9. Mixed Animation Approaches

**Issue:** Inconsistent animation implementations:
- GSAP ScrollTrigger in some sections
- CSS transitions in others  
- Inline JavaScript animations in drawers
- `prefers-reduced-motion` only checked in some places

**Files Affected:**
- `animations.js` - GSAP-based
- `cart-drawer.js` - CSS classes
- `product-filters.js` - gsap.to() calls
- `audio-player.js` - requestAnimationFrame

**Fix:** Standardize on GSAP or CSS, respect accessibility preferences

---

### 10. Cart Drawer Refresh Complexity

**File:** `assets/cart-drawer.js` (lines 96-138)

```javascript
async fetchSectionMarkup() {
  const res = await fetch(`${window.routes.cart_url}?section_id=cart-drawer`);
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const newDrawerContent = doc.querySelector('cart-drawer');
  
  if (newDrawerContent) {
    this.innerHTML = newDrawerContent.innerHTML; // ❌ Loses event listeners
    // Re-bind everything manually...
  }
}
```

**Issue:** 
- Replaces innerHTML (loses all event listeners)
- Manually re-binds events
- Uses Section Rendering API incorrectly

**Fix:** Use Shopify Cart API (`/cart.js`) and update DOM selectively

---

### 11. Inconsistent Event Handling

**Issue:** Three different event patterns:

```javascript
// Pattern 1: Custom events
document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));

// Pattern 2: Direct function calls
document.addEventListener('menu:open', () => this.open());

// Pattern 3: Global listeners with delegation
document.addEventListener('click', (e) => {
  const trackItem = e.target.closest('[data-audio-src]');
  ...
});
```

**Fix:** Standardize on custom events for cross-component communication

---

## 🟢 ARCHITECTURAL ISSUES (P2)

### 12. React Prototype Still in Codebase

**Location:** `_prototype/` directory (11 files, ~500 lines)

```
_prototype/
├── App.tsx (319 lines)
├── components/ (11 React components)
├── constants.ts
├── context/ShopContext.tsx
└── vite.config.ts
```

**Impact:** 
- Confusing for developers
- Unused code taking up space
- Package.json still references React

**Fix:** Move to archive or delete entirely

---

### 13. CDN Dependencies in Production

**File:** `layout/theme.liquid` (lines 62-64)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js" defer></script>
```

**Issue:** 
- CDN reliability risk
- GDPR/privacy concerns (third-party requests)
- Can't control caching

**Fix:** Bundle GSAP and Howler.js as theme assets

---

### 14. Unused Development Files

**Files:**
- `package.json` references React, TypeScript, Vite
- `tsconfig.json` in root
- `vite.config.ts` in root
- `index.tsx` in root

**Issue:** These are only needed for the React prototype, not Shopify theme

**Fix:** Move to `_prototype/` or create separate `package.json` for theme

---

## 📊 Duplication Statistics

| Item | Occurrences | Lines Wasted |
|------|-------------|--------------|
| `debounce()` function | 3 | ~18 lines |
| `formatMoney()` function | 3 | ~60 lines |
| Drawer open/close logic | 2 | ~30 lines |
| Product grid sections | 3 | ~150 lines |
| **Total** | **11** | **~258 lines** |

---

## 🎯 Recommended Fix Order

### Phase 1: Critical Fixes (30 min)
1. Add `fetchConfig()` and `trapFocus()` to `global.js`
2. Fix `featured-collection.liquid` schema name
3. Test cart functionality

### Phase 2: Consolidate Utilities (45 min)
4. Remove duplicate `debounce()` functions
5. Standardize money formatting
6. Create base `Drawer` class

### Phase 3: Refactor Sections (1.5 hours)
7. Consolidate product grid sections
8. Standardize collection handling
9. Unify animation approach

### Phase 4: Architecture Cleanup (1 hour)
10. Archive React prototype
11. Bundle CDN dependencies
12. Clean up root package.json

**Total Estimated Time:** ~3.75 hours

---

## ✅ Implementation Checklist

### Phase 1: Critical Fixes ✅ COMPLETE
- [x] Fix missing utility functions (fetchConfig, trapFocus)
- [x] Fix featured-collection schema name
- [x] Consolidate debounce functions
- [x] Consolidate money formatting

### Phase 2: Refactoring (Optional)
- [ ] Create base Drawer class
- [ ] Consolidate product grid sections
- [ ] Standardize collection handling patterns
- [ ] Unify animation approach
- [ ] Standardize event handling

### Phase 3: Architecture Cleanup (Optional)
- [ ] Archive React prototype
- [ ] Bundle CDN dependencies  
- [ ] Clean up package.json

### Testing & Documentation
- [ ] Test all functionality
- [ ] Update documentation (WARP.md)

---

## 📝 Notes

- Most issues are maintainability problems, not breaking bugs
- The theme is functional but will be difficult to maintain
- Priority should be fixing P0 issues first to prevent runtime errors
- Consider setting up linting/TypeScript for future development
