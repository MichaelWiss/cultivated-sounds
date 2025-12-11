import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { PRODUCTS } from '../constants';

const SearchModal: React.FC = () => {
  const { isSearchOpen, toggleSearch } = useShop();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isSearchOpen) {
      gsap.to(modalRef.current, { y: '0%', duration: 0.4, ease: 'power3.out' });
      inputRef.current?.focus();
    } else {
      gsap.to(modalRef.current, { y: '-100%', duration: 0.3, ease: 'power3.in' });
    }
  }, [isSearchOpen]);

  // Mock predictive search
  const results = query.length > 1 
    ? PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.artist.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div 
      ref={modalRef}
      className="fixed top-0 left-0 w-full h-[60vh] bg-vinyl-paper z-[80] shadow-2xl border-b border-vinyl-blue transform -translate-y-full flex flex-col"
    >
        <div className="container mx-auto px-4 sm:px-8 py-8 h-full flex flex-col">
            <div className="flex justify-end mb-4">
                <button onClick={toggleSearch} className="flex items-center gap-2 text-vinyl-blue hover:text-vinyl-black font-mono text-xs uppercase tracking-widest">
                    <span>Close</span>
                    <X size={20} />
                </button>
            </div>

            <div className="relative border-b-2 border-vinyl-blue mb-8">
                <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-vinyl-blue" size={24} />
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="SEARCH ARTIST, TITLE, OR CAT NO." 
                    className="w-full bg-transparent py-4 pl-10 pr-4 font-serif text-3xl sm:text-4xl text-vinyl-black placeholder:text-gray-300 focus:outline-none uppercase"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {query.length > 1 && (
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
                            {results.length > 0 ? 'Suggestions' : 'No results found'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {results.map(product => (
                                <div key={product.id} className="flex gap-4 group cursor-pointer hover:bg-white p-2 border border-transparent hover:border-gray-200 transition-all" onClick={toggleSearch}>
                                    <img src={product.image} alt={product.title} className="w-16 h-16 object-cover grayscale group-hover:grayscale-0" />
                                    <div>
                                        <p className="font-serif font-bold text-lg leading-none">{product.artist}</p>
                                        <p className="font-sans text-sm text-gray-600">{product.title}</p>
                                        <p className="font-mono text-xs text-vinyl-blue mt-1">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {query.length === 0 && (
                     <div className="text-gray-400 font-sans text-sm">
                        <p className="mb-2">Popular Searches:</p>
                        <div className="flex gap-2 flex-wrap font-mono text-xs uppercase text-vinyl-blue">
                            <span className="cursor-pointer hover:underline">Ambient</span>
                            <span className="cursor-pointer hover:underline">Japanese Jazz</span>
                            <span className="cursor-pointer hover:underline">Pre-orders</span>
                        </div>
                     </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default SearchModal;
