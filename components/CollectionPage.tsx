import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Product } from '../types';
import ProductCard from './ProductCard';

gsap.registerPlugin(ScrollTrigger);

interface CollectionPageProps {
  title: string;
  subtitle?: string;
  description?: string;
  products: Product[];
  onProductClick: (id: string) => void;
  accentColor?: string; // e.g., 'vinyl-blue'
}

const CollectionPage: React.FC<CollectionPageProps> = ({ 
  title, 
  subtitle, 
  description, 
  products, 
  onProductClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(".collection-header-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });

      // Grid Animation
      gsap.from(".collection-item", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".collection-grid",
            start: "top 85%"
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [title]); // Re-run if title changes (page change)

  return (
    <div ref={containerRef} className="min-h-screen bg-vinyl-paper">
      {/* Header Section */}
      <div className="border-b border-vinyl-blue py-16 sm:py-24 px-4 sm:px-8 bg-vinyl-paper relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <h1 className="text-9xl font-serif italic text-vinyl-blue opacity-20">{title.split(' ')[0]}</h1>
        </div>
        
        <div className="max-w-4xl relative z-10">
            {subtitle && (
                <p className="collection-header-text font-mono text-xs uppercase tracking-widest text-vinyl-blue mb-4">
                    {subtitle}
                </p>
            )}
            <h1 className="collection-header-text font-serif text-5xl sm:text-7xl text-vinyl-black italic mb-6 leading-[0.9]">
                {title}
            </h1>
            {description && (
                <p className="collection-header-text font-sans text-lg text-gray-600 max-w-xl leading-relaxed">
                    {description}
                </p>
            )}
        </div>
      </div>

      {/* Filter / Sort Bar Stub */}
      <div className="sticky top-[64px] sm:top-[80px] z-30 bg-vinyl-paper border-b border-vinyl-blue py-3 px-4 sm:px-8 flex justify-between items-center">
         <span className="font-mono text-xs uppercase text-gray-500">{products.length} Items</span>
         <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase text-gray-500">Sort:</span>
            <span className="font-mono text-xs uppercase text-vinyl-blue font-bold cursor-pointer">Featured</span>
         </div>
      </div>

      {/* Product Grid */}
      <div className="collection-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-vinyl-blue min-h-[50vh]">
        {products.map((product) => (
            <div key={product.id} className="collection-item">
                <ProductCard product={product} onClick={() => onProductClick(product.id)} />
            </div>
        ))}
        {products.length === 0 && (
            <div className="col-span-full py-24 text-center">
                <p className="font-mono text-gray-400">No items found in this collection.</p>
            </div>
        )}
      </div>

      {/* Pagination Stub */}
      {products.length > 0 && (
        <div className="py-16 flex justify-center border-b border-vinyl-blue">
            <span className="font-mono text-xs text-gray-400 uppercase">End of List</span>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;