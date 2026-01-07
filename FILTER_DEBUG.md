# Filter Debugging Guide

## Issue
"All clicks simply open the filter" - This indicates a click handler is firing on all page clicks.

## Diagnostic Steps

### 1. Hard Refresh Browser
Press `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows) to clear browser cache and reload

### 2. Check Browser Console
Open Developer Tools (F12 or Cmd+Option+I) and:
- Look for JavaScript errors
- Check if you see "Opening sidebar from filter toggle" on every click
- Look for multiple instances of the same log message

### 3. Verify Element Layout
In Dev Tools Console, run:
```javascript
// Check if filter toggle button is covering screen
const filterBtn = document.querySelector('[data-filter-toggle]');
if (filterBtn) {
  const rect = filterBtn.getBoundingClientRect();
  console.log('Filter button dimensions:', rect);
  console.log('Covering full width?', rect.width >= window.innerWidth - 100);
  console.log('Covering full height?', rect.height >= window.innerHeight - 100);
}

// Check backdrop
const backdrop = document.querySelector('[data-filter-backdrop]');
if (backdrop) {
  console.log('Backdrop computed style:', window.getComputedStyle(backdrop).pointerEvents);
  console.log('Backdrop z-index:', window.getComputedStyle(backdrop).zIndex);
}
```

## Applied Fixes

1. ✅ Removed problematic global document click listener
2. ✅ Added `pointer-events-none` to backdrop when hidden
3. ✅ Added defensive check to ensure filter only opens on legitimate clicks
4. ✅ Prevented duplicate HomepageGrid initializations
5. ✅ Removed conflicting collection page script

## If Issue Persists

The filter button (`data-filter-toggle`) should only be ~100-150px wide. If it's covering the screen, there's a CSS issue we need to fix.
