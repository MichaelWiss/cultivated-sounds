import React from 'react';
import { Instagram, Facebook, Twitter, Disc } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const exploreLinks = [
    { label: 'New Arrivals', page: 'new' },
    { label: 'Staff Picks', page: 'staff' },
    { label: 'Pre-Orders', page: 'preorder' },
    { label: 'Merch', page: 'merch' },
    { label: 'Gift Cards', page: 'gift-cards' },
  ];

  const supportLinks = [
    { label: 'Shipping Info', page: 'shipping' },
    { label: 'Returns Policy', page: 'returns' },
    { label: 'FAQ', page: 'faq' },
    { label: 'Contact Us', page: 'contact' },
  ];

  return (
    <footer className="bg-[#e5e4de] border-t border-vinyl-blue pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16 border-b border-gray-400 pb-12">
          
          {/* Brand */}
          <div className="md:col-span-4 flex flex-col justify-between h-full">
            <div>
              <div className="mb-6">
                 <Disc size={48} className="text-vinyl-blue animate-spin-slow" style={{ animationDuration: '10s' }} />
              </div>
              <h2 className="font-serif text-4xl italic text-vinyl-blue mb-4">Cultivated Sounds</h2>
              <p className="font-sans text-sm leading-relaxed max-w-xs text-gray-600">
                We simplify music discovery with a curated selection of vinyl records and audio essentials. 
                Based in Brooklyn, shipping worldwide.
              </p>
            </div>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-widest text-vinyl-blue mb-6 border-b border-gray-300 pb-2 inline-block">Explore</h4>
            <ul className="space-y-3 font-serif text-lg">
              {exploreLinks.map((link) => (
                <li key={link.page}>
                    <a 
                        href={`#${link.page}`} 
                        onClick={(e) => handleLinkClick(e, link.page)}
                        className="hover:text-vinyl-blue hover:italic transition-all"
                    >
                        {link.label}
                    </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
           <div className="md:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-widest text-vinyl-blue mb-6 border-b border-gray-300 pb-2 inline-block">Support</h4>
            <ul className="space-y-3 font-serif text-lg">
              {supportLinks.map((link) => (
                <li key={link.page}>
                    <a 
                        href={`#${link.page}`}
                        onClick={(e) => handleLinkClick(e, link.page)}
                        className="hover:text-vinyl-blue hover:italic transition-all"
                    >
                        {link.label}
                    </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 bg-vinyl-paper border border-vinyl-blue p-6 md:p-8 shadow-[8px_8px_0px_0px_#1a23db]">
            <h3 className="font-serif text-2xl italic mb-2">Join the Club</h3>
            <p className="font-sans text-xs mb-6 text-gray-500">Get early access to drops and exclusive content.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border-b border-gray-400 py-2 font-mono text-sm focus:outline-none focus:border-vinyl-blue placeholder:text-gray-400"
              />
              <button className="mt-2 w-full bg-vinyl-black text-white font-mono text-xs uppercase py-3 hover:bg-vinyl-blue transition-colors flex justify-between px-4">
                <span>Subscribe</span>
                <span>→</span>
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-wider text-gray-500 gap-4">
          <p>© 2025 Cultivated Sounds Brooklyn.</p>
          <div className="flex gap-6">
            <Instagram size={16} className="hover:text-vinyl-blue cursor-pointer" />
            <Facebook size={16} className="hover:text-vinyl-blue cursor-pointer" />
            <Twitter size={16} className="hover:text-vinyl-blue cursor-pointer" />
          </div>
          <p>Designed by MW. Powered by Code.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;