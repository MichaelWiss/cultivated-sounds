/**
 * TypeScript Type Definitions
 * 
 * Core interfaces for the Cultivated Sounds application:
 * - Product: Vinyl records and merchandise
 * - CartItem: Products with cart-specific metadata
 * - Track: Album tracklist information
 * - NavItem: Navigation menu structure
 */

// Tracklist entry for album details
export interface Track {
  number: string;
  title: string;
  duration: string;
}

// Base product interface for vinyl records and merchandise
export interface Product {
  id: string;
  artist: string;
  title: string;
  price: number;
  image: string;
  tags?: string[];           // Genre/category tags
  isSoldOut?: boolean;       // Inventory status
  isNew?: boolean;           // New arrival flag
  format: string;            // e.g., "2LP", "Cassette", "Blue Vinyl"
  label?: string;            // Record label
  description?: string;      // Product description (supports HTML)
  tracklist?: Track[];       // Album tracklist
  releaseDate?: string;      // Release date
  catalogNumber?: string;    // Label catalog number
}

// Cart item extends Product with shopping cart metadata
export interface CartItem extends Product {
  cartId: string;            // Unique cart entry ID (product.id + timestamp)
  quantity: number;          // Number of items
  selectedVariant?: string;  // Selected variant (e.g., size for merch)
}

// Navigation menu item
export interface NavItem {
  label: string;             // Display text
  href: string;              // Route/page identifier
}
