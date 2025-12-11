import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col h-full border-r border-b border-vinyl-blue bg-vinyl-paper hover:bg-white transition-colors duration-300 p-4 sm:p-6 cursor-pointer"
    >
      
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isSoldOut && (
          <span className="bg-vinyl-black text-white text-[10px] font-mono uppercase px-2 py-1 tracking-widest border border-transparent shadow-sm">
            Sold Out
          </span>
        )}
        {product.isNew && !product.isSoldOut && (
          <span className="bg-vinyl-blue text-white text-[10px] font-mono uppercase px-2 py-1 tracking-widest rounded-full">
            New
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square w-full mb-6 overflow-hidden border border-gray-200 shadow-[4px_4px_0px_0px_rgba(26,35,219,0.1)] group-hover:shadow-[6px_6px_0px_0px_rgba(26,35,219,0.2)] transition-shadow duration-300">
        <img 
          src={product.image} 
          alt={`${product.artist} - ${product.title}`}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
        />
        
        {/* Quick Add Overlay */}
        {!product.isSoldOut && (
          <div className="absolute inset-0 bg-vinyl-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-vinyl-blue text-white font-mono text-xs uppercase px-6 py-3 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-vinyl-black">
              View Item
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col items-center text-center space-y-2">
        <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500">{product.artist}</h3>
        <h2 className="font-serif text-lg leading-tight group-hover:text-vinyl-blue transition-colors">{product.title}</h2>
        <p className="font-sans text-xs text-gray-400 mt-1">{product.format}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-200 w-full">
          <span className={`font-mono text-sm ${product.isSoldOut ? 'text-gray-400 line-through' : 'text-vinyl-black'}`}>
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;