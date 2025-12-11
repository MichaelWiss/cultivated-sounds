/**
 * App Component
 * 
 * Main application component for Finer Sounds vinyl record store.
 * Implements single-page application routing and state management.
 * 
 * Architecture:
 * - ShopProvider: Global cart and UI state management
 * - MainApp: Core routing and view rendering logic
 * - View Types: home, shop, collections, text pages
 * 
 * Following Shopify Dawn principles:
 * - HTML-first approach with minimal client-side routing
 * - Progressive enhancement for animations (GSAP)
 * - Server-rendered thinking adapted for SPA
 */

import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShopProvider } from './context/ShopContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CollectionPage from './components/CollectionPage';
import TextPage from './components/TextPage';
import Marquee from './components/Marquee';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import { PRODUCTS, MERCH_PRODUCTS, PREORDER_PRODUCTS, GIFT_CARD_PRODUCT } from './constants';
import { Product } from './types';

gsap.registerPlugin(ScrollTrigger);

type ViewType = 'home' | 'shop' | 'new' | 'preorder' | 'staff' | 'merch' | 'gift-cards' | 'shipping' | 'returns' | 'faq' | 'contact';

const MainApp: React.FC = () => {
  const productsRef = useRef<HTMLDivElement>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const ALL_PRODUCTS = [...PRODUCTS, ...MERCH_PRODUCTS, ...PREORDER_PRODUCTS, GIFT_CARD_PRODUCT];
  const selectedProduct = ALL_PRODUCTS.find(p => p.id === selectedProductId);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedProductId, currentView]);

  useLayoutEffect(() => {
    if (!selectedProductId && currentView === 'home' && productsRef.current) {
        const ctx = gsap.context(() => {
          gsap.from(".product-grid-item", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: productsRef.current,
              start: "top 80%"
            }
          });
        }, productsRef);
        return () => ctx.revert();
    }
  }, [selectedProductId, currentView]);

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
  };

  const handleBack = () => {
    setSelectedProductId(null);
  };

  const handleNavigate = (page: string) => {
    setSelectedProductId(null);
    setCurrentView(page as ViewType);
  };

  const renderContent = () => {
    if (selectedProduct) {
        return <ProductDetail product={selectedProduct} onBack={handleBack} />;
    }

    switch (currentView) {
        case 'new':
            return (
                <CollectionPage 
                    title="New Arrivals"
                    subtitle="Fresh off the press"
                    description="The latest additions to our collection. From independent pressings to major label releases, exploring the newest sounds in our crates."
                    products={PRODUCTS.filter(p => p.isNew || p.id === '1' || p.id === '6')} 
                    onProductClick={handleProductClick}
                />
            );
        case 'preorder':
            return (
                <CollectionPage 
                    title="Pre-Orders"
                    subtitle="Secure your copy"
                    description="Upcoming releases available for reservation. Ships on release date."
                    products={PREORDER_PRODUCTS}
                    onProductClick={handleProductClick}
                />
            );
        case 'staff':
            return (
                <CollectionPage 
                    title="Staff Picks"
                    subtitle="Curated by our team"
                    description="What we're listening to at the shop. A rotating selection of personal favorites and hidden gems."
                    products={PRODUCTS.slice(0, 4)}
                    onProductClick={handleProductClick}
                />
            );
        case 'merch':
             return (
                <CollectionPage 
                    title="Finer Merch"
                    subtitle="Goods & Accessories"
                    description="Apparel, slipmats, and storage solutions for the discerning listener."
                    products={MERCH_PRODUCTS}
                    onProductClick={handleProductClick}
                />
            );
        case 'shop':
             return (
                <CollectionPage 
                    title="All Products"
                    subtitle="Browse the catalog"
                    description="The complete inventory. Dig deep."
                    products={ALL_PRODUCTS.filter(p => p.id !== 'gc1')}
                    onProductClick={handleProductClick}
                />
            );
        case 'gift-cards':
            // Directly show the Product Detail for the Gift Card
            return <ProductDetail product={GIFT_CARD_PRODUCT} onBack={() => handleNavigate('home')} />;
        
        case 'shipping':
            return (
                <TextPage title="Shipping Info" subtitle="Policies & Logistics">
                    <p>We ship worldwide from our Brooklyn location. Orders are typically processed within 24-48 hours of purchase. You will receive a tracking number via email as soon as your package ships.</p>
                    <h3>Domestic (US)</h3>
                    <p>We offer free Media Mail shipping on all domestic orders over $100. For orders under $100, standard Media Mail rates apply. Priority Mail options are available at checkout if you need your records sooner.</p>
                    <h3>International</h3>
                    <p>International shipping rates are calculated at checkout based on destination and weight. Please note that customers are responsible for any customs duties or import taxes that may apply.</p>
                    <h3>Packaging</h3>
                    <p>All records are shipped in heavy-duty Whiplash mailers with stiffeners to ensure they arrive in pristine condition. Records are removed from their jackets (unless sealed) to prevent seam splits during transit.</p>
                </TextPage>
            );
        case 'returns':
            return (
                <TextPage title="Returns & Exchanges" subtitle="Satisfaction Guaranteed">
                     <p>We want you to be completely satisfied with your purchase. If you receive a defective or incorrect item, please contact us within 30 days of receipt.</p>
                     <h3>Return Policy</h3>
                     <ul>
                        <li><strong>New Items:</strong> Unopened items can be returned for a full refund or exchange within 30 days. Opened items found to be defective can be exchanged for the same title.</li>
                        <li><strong>Used Items:</strong> All used items are graded conservatively. If you feel a record was misgraded, please contact us. Returns on used items are handled on a case-by-case basis.</li>
                        <li><strong>Merch:</strong> Apparel must be unworn and unwashed to be eligible for return.</li>
                     </ul>
                     <h3>How to Return</h3>
                     <p>Please email support@finersounds.com with your order number and details about the product you would like to return. We will provide you with a return shipping label and instructions.</p>
                </TextPage>
            );
        case 'faq':
             return (
                <TextPage title="Frequently Asked Questions" subtitle="Knowledge Base">
                    <h3>What is your grading standard?</h3>
                    <p>We use the Goldmine Standard for grading our used vinyl. We tend to grade conservatively to ensure you are happy with your purchase. NM (Near Mint) is our highest grade for opened records.</p>
                    <h3>Do you buy records?</h3>
                    <p>Yes! We are always looking for quality collections of Jazz, Soul, Funk, Rock, and Electronic music. If you have records to sell, please contact us to make an appointment.</p>
                    <h3>Can I pick up my order in store?</h3>
                    <p>Absolutely. Select "In-Store Pickup" at checkout. Orders are usually ready within 2 hours during business hours. We'll send you an email when it's ready.</p>
                    <h3>Are the photos of the actual item?</h3>
                    <p>For new items, we use stock images. For rare or expensive used items, we photograph the actual copy for sale. If you need more details on a specific item, feel free to reach out.</p>
                </TextPage>
            );
        case 'contact':
            return (
                <TextPage title="Contact Us" subtitle="Get in Touch">
                    <p>Have a question about an order? Looking for a specific record? Just want to say hi? We'd love to hear from you.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 not-prose">
                        <div className="bg-white p-6 border border-gray-200">
                            <h4 className="font-serif text-xl italic text-vinyl-blue mb-2">Visit Us</h4>
                            <p className="font-sans text-sm mb-1">252 Schermerhorn St</p>
                            <p className="font-sans text-sm mb-4">Brooklyn, NY 11217</p>
                            <p className="font-mono text-xs uppercase text-gray-500">Open Daily: 11AM - 7PM</p>
                        </div>
                         <div className="bg-white p-6 border border-gray-200">
                            <h4 className="font-serif text-xl italic text-vinyl-blue mb-2">Email Us</h4>
                            <p className="font-sans text-sm mb-4">General: hello@finersounds.com</p>
                            <p className="font-sans text-sm mb-4">Orders: support@finersounds.com</p>
                            <p className="font-mono text-xs uppercase text-gray-500">Response time: 24hrs</p>
                        </div>
                    </div>
                </TextPage>
            );

        case 'home':
        default:
            return (
                <main className="flex-1">
                    <Hero />
                    
                    <section className="py-20 px-4 sm:px-8 border-b border-vinyl-blue bg-[#e8e6df]">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-400 pb-4">
                            <div>
                                <h2 className="font-serif text-4xl sm:text-5xl mb-2 text-vinyl-blue">Staff Picks</h2>
                                <p className="font-mono text-xs uppercase tracking-widest text-gray-600">Handpicked essentials for finer listening</p>
                            </div>
                            <button onClick={() => handleNavigate('staff')} className="hidden md:block font-mono text-sm underline decoration-vinyl-blue underline-offset-4 hover:text-vinyl-blue hover:italic">
                                View All Picks →
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {PRODUCTS.slice(0, 4).map((product) => (
                            <div key={product.id} className="bg-vinyl-paper p-4 shadow-sm border border-transparent hover:border-vinyl-blue transition-all duration-300 cursor-pointer" onClick={() => handleProductClick(product.id)}>
                                <img src={product.image} alt={product.title} className="w-full aspect-square object-cover mb-4" />
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold font-serif text-lg leading-none mb-1">{product.artist}</h3>
                                        <p className="text-sm text-gray-600 italic">{product.title}</p>
                                    </div>
                                    <span className="font-mono text-sm">${product.price}</span>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className="mt-8 md:hidden text-center">
                            <button onClick={() => handleNavigate('staff')} className="font-mono text-sm underline decoration-vinyl-blue underline-offset-4">View All Picks →</button>
                        </div>
                    </section>

                    <Marquee text="New Arrivals • Restocks • Rare Finds • Pre-Orders •" className="bg-vinyl-paper text-vinyl-blue" />

                    <section id="shop" className="border-b border-vinyl-blue">
                        <div className="sticky top-16 sm:top-20 z-40 bg-vinyl-paper border-b border-vinyl-blue py-3 px-4 sm:px-8 flex justify-between items-center overflow-x-auto">
                            <div className="flex space-x-6">
                                <button className="font-mono text-xs uppercase font-bold text-vinyl-blue">All</button>
                                <button className="font-mono text-xs uppercase text-gray-500 hover:text-vinyl-blue">Ambient</button>
                                <button className="font-mono text-xs uppercase text-gray-500 hover:text-vinyl-blue">Jazz</button>
                                <button className="font-mono text-xs uppercase text-gray-500 hover:text-vinyl-blue">Rock</button>
                                <button className="font-mono text-xs uppercase text-gray-500 hover:text-vinyl-blue">Electronic</button>
                            </div>
                            <div className="flex items-center space-x-2 font-mono text-xs uppercase">
                                <span className="text-gray-500">Sort By:</span>
                                <select className="bg-transparent border-none focus:ring-0 cursor-pointer font-bold text-vinyl-blue">
                                    <option>Newest</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-vinyl-blue">
                            {PRODUCTS.map((product) => (
                                <div key={product.id} className="product-grid-item">
                                    <ProductCard product={product} onClick={() => handleProductClick(product.id)} />
                                </div>
                            ))}
                            {PRODUCTS.map((product) => (
                                <div key={`rep-${product.id}`} className="product-grid-item">
                                    <ProductCard product={{...product, id: `rep-${product.id}`}} onClick={() => handleProductClick(product.id)} />
                                </div>
                            ))}
                        </div>
                        
                        <div className="py-12 flex justify-center bg-vinyl-paper">
                            <button className="px-8 py-3 border border-vinyl-blue rounded-full text-vinyl-blue font-mono text-xs uppercase tracking-widest hover:bg-vinyl-blue hover:text-white transition-all">
                                Load More
                            </button>
                        </div>
                    </section>

                    <section className="bg-vinyl-black text-vinyl-paper py-24 px-4 sm:px-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 border border-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 border border-white/10 rounded-full -translate-x-1/3 translate-y-1/3"></div>
                        
                        <div className="container mx-auto text-center relative z-10">
                            <h2 className="font-serif text-5xl md:text-7xl italic mb-6">Finer Sounds<br/><span className="not-italic font-sans font-light tracking-tighter">Brooklyn</span></h2>
                            <p className="font-mono text-sm max-w-lg mx-auto mb-10 text-gray-400">
                                We simplify music discovery with a curated selection of vinyl records and audio essentials.
                            </p>
                            <a href="#" className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-vinyl-blue hover:border-vinyl-blue transition-colors font-mono uppercase text-sm">
                                Visit Our Brooklyn Store <span className="text-lg">→</span>
                            </a>
                        </div>
                    </section>
                </main>
            );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Marquee text="Free shipping in the US on orders over $100" className="bg-vinyl-blue text-white border-none" />
      <Header onNavigate={handleNavigate} />
      {renderContent()}
      <Footer onNavigate={handleNavigate} />
      <CartDrawer />
      <SearchModal />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ShopProvider>
      <MainApp />
    </ShopProvider>
  );
};

export default App;