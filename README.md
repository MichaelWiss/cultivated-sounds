<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Cultivated Sounds

A boutique vinyl record store Shopify theme with a brutalist aesthetic featuring grid layouts, serif typography (Playfair Display), and smooth GSAP animations.

## Tech Stack

- **Platform:** Shopify Online Store 2.0
- **Templating:** Liquid
- **Styling:** Tailwind CSS
- **JavaScript:** Vanilla JS with Web Components
- **Animations:** GSAP + ScrollTrigger
- **Audio:** Howler.js

## Development

### Prerequisites
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
- Node.js (for Tailwind CSS compilation)

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Shopify theme development:
   ```bash
   shopify theme dev --store=your-store.myshopify.com
   ```

3. Build Tailwind CSS (in separate terminal):
   ```bash
   npm run build:css
   ```

## Project Structure

```
├── assets/          # JS, CSS files
├── config/          # Theme settings
├── layout/          # Theme layouts (theme.liquid)
├── locales/         # Translations
├── sections/        # Shopify sections
├── snippets/        # Reusable Liquid components
├── templates/       # Page templates (JSON)
└── _prototype/      # Original React prototype (reference only)
```

## Key Features

- **Cart Drawer:** Slide-out cart with AJAX updates
- **Audio Player:** Global sticky player with Howler.js
- **Product Filters:** Client-side filtering on homepage grid
- **Search Modal:** Predictive search overlay
- **Responsive:** Mobile-first with drawer navigation

## Status

**Current:** Functional MVP with known issues being addressed
- Cart drawer, mobile menu, product navigation working
- Audio player integrated
- GSAP animations active
