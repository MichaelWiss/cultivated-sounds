import React, { useState } from 'react';
import { Menu, ShoppingCart, Search, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { useShop } from '../context/ShopContext';

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleCart, toggleSearch, cartCount } = useShop();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-vinyl-paper border-b border-vinyl-blue">
        <div className="flex justify-between items-stretch h-16 sm:h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center px-4 sm:px-8 border-r border-vinyl-blue cursor-pointer" onClick={(e) => handleNavClick(e, 'home')}>
            <h1 className="font-serif text-2xl sm:text-3xl italic font-bold tracking-tighter text-vinyl-blue">
              Cultivated Sounds<span className="text-xs align-top not-italic font-sans">®</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 items-center justify-center space-x-8 px-8">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.label} 
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className="font-mono text-sm uppercase tracking-wide text-vinyl-black hover:text-vinyl-blue hover:underline decoration-vinyl-blue decoration-1 underline-offset-4 transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Icons / Actions */}
          <div className="flex items-stretch">
            <button 
                onClick={toggleSearch}
                className="px-4 sm:px-6 border-l border-vinyl-blue hover:bg-vinyl-blue hover:text-white transition-colors flex items-center justify-center"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button 
                onClick={toggleCart}
                className="px-4 sm:px-6 border-l border-vinyl-blue hover:bg-vinyl-blue hover:text-white transition-colors flex items-center justify-center group relative"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-4 right-3 w-4 h-4 bg-vinyl-red rounded-full text-[10px] text-white flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden px-4 sm:px-6 border-l border-vinyl-blue hover:bg-vinyl-blue hover:text-white transition-colors flex items-center justify-center"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-vinyl-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-vinyl-paper border-l border-vinyl-blue shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-vinyl-blue">
              <span className="font-serif text-xl italic text-vinyl-blue">Menu</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} className="text-vinyl-blue" />
              </button>
            </div>
            <nav className="flex-1 p-6 flex flex-col space-y-6">
              {NAV_ITEMS.map((item) => (
                <a 
                  key={item.label} 
                  href={`#${item.href}`}
                  className="font-serif text-3xl hover:italic hover:text-vinyl-blue transition-all"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="p-6 border-t border-vinyl-blue bg-vinyl-blue text-white">
              <p className="font-mono text-xs uppercase mb-2">Brooklyn Store</p>
              <p className="font-sans text-sm">252 Schermerhorn St,<br/>Brooklyn, NY 11217</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
