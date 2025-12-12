/**
 * Product & Navigation Constants
 * 
 * Centralized data store for:
 * - Product catalog (vinyl records, merchandise, pre-orders)
 * - Gift card products
 * - Navigation menu items
 * 
 * Note: In production, this would be replaced with API calls
 * or CMS integration. Using static data for demo purposes.
 * 
 * Product categories:
 * - PRODUCTS: Main vinyl catalog
 * - MERCH_PRODUCTS: Apparel and accessories
 * - PREORDER_PRODUCTS: Upcoming releases
 * - GIFT_CARD_PRODUCT: Digital gift cards
 */

import { Product, NavItem } from './types';

// Using a reliable sample MP3 for demonstration purposes
const DEMO_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const PRODUCTS: Product[] = [
  {
    id: '1',
    artist: 'Rochelle Jordan',
    title: 'Play With the Changes',
    price: 34.98,
    image: 'https://picsum.photos/seed/vinyl_rochelle/800/800',
    tags: ['R&B', 'Electronic', 'Dance'],
    isNew: true,
    format: '2LP Vinyl',
    label: 'Young Art Records',
    releaseDate: '2024',
    catalogNumber: 'YAR-092',
    description: "Rochelle Jordan is stepping into her diva era. The Los Angeles-based, British-Canadian singer and songwriter has long been an underground force, quietly threading together alt-R&B and pulse-pounding electronic music. With longtime collaborator and producer KLSH, Jordan has forged a sound all her own: a seductive mix of house energy, drum-and-bass intensity, hip-hop swagger, and experimental daring that has moved from niche circles into the mainstream spotlight.",
    tracklist: [
      { number: 'A1', title: 'Love You Good', duration: '3:45', audioUrl: DEMO_AUDIO },
      { number: 'A2', title: 'Got Em', duration: '2:55', audioUrl: DEMO_AUDIO },
      { number: 'A3', title: 'Next 2 You', duration: '4:12', audioUrl: DEMO_AUDIO },
      { number: 'B1', title: 'All Along', duration: '3:30', audioUrl: DEMO_AUDIO },
      { number: 'B2', title: 'Broken Steel', duration: '3:15' },
      { number: 'C1', title: 'Count It', duration: '2:50' },
      { number: 'C2', title: 'Already', duration: '3:55' },
      { number: 'D1', title: 'Dancing Elephants', duration: '4:20' }
    ]
  },
  {
    id: '2',
    artist: 'Talk Talk',
    title: 'Laughing Stock',
    price: 27.98,
    image: 'https://picsum.photos/seed/vinyl2/600/600',
    tags: ['Art Rock', 'Post-Rock'],
    format: 'Vinyl LP',
    label: 'Verve',
    description: "A pioneering post-rock masterpiece. Laughing Stock saw the band abandon the synth-pop of their early years for a more organic, improvised sound.",
    tracklist: [
      { number: '1', title: 'Myrrhman', duration: '5:33' },
      { number: '2', title: 'Ascension Day', duration: '6:00' },
      { number: '3', title: 'After the Flood', duration: '9:39' }
    ]
  },
  {
    id: '3',
    artist: 'Yu-Ching Huang',
    title: 'The Crystal Hum',
    price: 36.98,
    image: 'https://picsum.photos/seed/vinyl3/600/600',
    tags: ['Ambient', 'Experimental'],
    format: '(Clear Vinyl)'
  },
  {
    id: '4',
    artist: 'Helado Negro',
    title: 'This is How You Smile',
    price: 23.98,
    image: 'https://picsum.photos/seed/vinyl4/600/600',
    tags: ['Latin', 'Electronic'],
    isSoldOut: true,
    format: '(Pink Vinyl)'
  },
  {
    id: '5',
    artist: 'Kate Bush',
    title: 'Hounds of Love',
    price: 51.98,
    image: 'https://picsum.photos/seed/vinyl5/600/600',
    tags: ['Art Pop'],
    format: 'Marbled Vinyl'
  },
  {
    id: '6',
    artist: 'Kali Uchis',
    title: 'Isolation',
    price: 32.99,
    image: 'https://picsum.photos/seed/vinyl6/600/600',
    tags: ['R&B', 'Pop'],
    isNew: true,
    format: 'Blue Vinyl'
  },
  {
    id: '7',
    artist: 'Salamanda',
    title: 'Sphere',
    price: 32.98,
    image: 'https://picsum.photos/seed/vinyl7/600/600',
    tags: ['Electronic'],
    format: 'LP'
  },
  {
    id: '8',
    artist: 'Purelink',
    title: 'Signs',
    price: 28.98,
    image: 'https://picsum.photos/seed/vinyl8/600/600',
    tags: ['Dub Techno'],
    isSoldOut: true,
    format: 'Vinyl LP'
  }
];

export const MERCH_PRODUCTS: Product[] = [
  {
    id: 'm1',
    artist: 'Cultivated Sounds',
    title: 'Heavyweight Shop Tee',
    price: 45.00,
    image: 'https://picsum.photos/seed/merch1/800/800',
    tags: ['Apparel'],
    format: 'Size: L',
    label: 'Cultivated Merch',
    description: "6.5oz garment dyed cotton t-shirt with screen printed graphics on front and back."
  },
  {
    id: 'm2',
    artist: 'Cultivated Sounds',
    title: 'Canvas Record Tote',
    price: 30.00,
    image: 'https://picsum.photos/seed/merch2/800/800',
    tags: ['Accessories'],
    format: 'Natural Canvas',
    description: "Heavy duty canvas tote bag designed to hold up to 20 LP records."
  },
  {
    id: 'm3',
    artist: 'Technics',
    title: 'Slipmat Pair (Cultivated Ed.)',
    price: 25.00,
    image: 'https://picsum.photos/seed/merch3/800/800',
    tags: ['Accessories'],
    format: 'Felt',
    isNew: true
  },
    {
    id: 'm4',
    artist: 'Cultivated Sounds',
    title: 'Nalgene Water Bottle',
    price: 22.00,
    image: 'https://picsum.photos/seed/merch4/800/800',
    tags: ['Accessories'],
    format: '32oz',
    isSoldOut: true
  }
];

export const PREORDER_PRODUCTS: Product[] = [
  {
    id: 'p1',
    artist: 'Floating Points',
    title: 'Cascade',
    price: 31.99,
    image: 'https://picsum.photos/seed/pre1/800/800',
    tags: ['Electronic', 'Jazz'],
    format: 'Limited 2LP',
    isNew: true,
    label: 'Ninja Tune',
    description: "Expected Release: Oct 2025. Pre-order now to secure your copy."
  },
  {
    id: 'p2',
    artist: 'Mount Kimbie',
    title: 'The Sunset Violent',
    price: 28.99,
    image: 'https://picsum.photos/seed/pre2/800/800',
    tags: ['Indie', 'Post-Punk'],
    format: 'Orange Vinyl',
    isNew: true
  },
  {
    id: 'p3',
    artist: 'Four Tet',
    title: 'Three',
    price: 29.98,
    image: 'https://picsum.photos/seed/pre3/800/800',
    tags: ['Electronic'],
    format: 'LP',
    isNew: true
  }
];

export const GIFT_CARD_PRODUCT: Product = {
  id: 'gc1',
  artist: 'Cultivated Sounds',
  title: 'Digital Gift Card',
  price: 50.00,
  image: 'https://picsum.photos/seed/giftcard/800/800',
  tags: ['Gift'],
  format: 'Digital',
  description: "The perfect gift for the crate digger in your life. Delivered instantly via email and redeemable both online and in-store. Available in denominations from $25 to $200.",
  isNew: true
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Shop All', href: 'shop' },
  { label: 'New Arrivals', href: 'new' },
  { label: 'Pre-Orders', href: 'preorder' },
  { label: 'Staff Picks', href: 'staff' },
  { label: 'Merch', href: 'merch' },
];