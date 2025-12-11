import React, { useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import gsap from 'gsap';

const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cart, updateQuantity, removeFromCart, cartTotal } = useShop();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCartOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' });
      gsap.to(drawerRef.current, { x: '0%', duration: 0.5, ease: 'power3.out' });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none' });
      gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }
  }, [isCartOpen]);

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        onClick={toggleCart}
        className="fixed inset-0 bg-vinyl-black/60 backdrop-blur-sm z-[60] hidden opacity-0"
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-vinyl-paper z-[70] shadow-2xl border-l border-vinyl-blue transform translate-x-full flex flex-col"
      >
        <div className="flex justify-between items-center p-6 border-b border-vinyl-blue">
          <h2 className="font-serif text-2xl italic text-vinyl-blue">Your Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
          <button onClick={toggleCart} className="hover:rotate-90 transition-transform duration-300">
            <X size={24} className="text-vinyl-blue" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <span className="font-serif text-xl italic">Your crate is empty</span>
              <button onClick={toggleCart} className="font-mono text-xs uppercase underline hover:text-vinyl-blue">Continue Digging</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex gap-4">
                <div className="w-20 h-20 border border-gray-200 flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-lg leading-none mb-1">{item.artist}</h3>
                      <p className="text-xs text-gray-500 font-mono">{item.title}</p>
                      {item.selectedVariant && <p className="text-[10px] text-gray-400 font-mono uppercase mt-1">{item.selectedVariant}</p>}
                    </div>
                    <p className="font-mono text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-gray-300 h-8">
                      <button onClick={() => updateQuantity(item.cartId, -1)} className="px-2 hover:bg-gray-100 text-vinyl-blue"><Minus size={12} /></button>
                      <span className="px-2 font-mono text-xs min-w-[1.5rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)} className="px-2 hover:bg-gray-100 text-vinyl-blue"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-vinyl-blue p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-sm uppercase tracking-widest text-gray-500">Subtotal</span>
              <span className="font-mono text-xl text-vinyl-black">${cartTotal.toFixed(2)}</span>
            </div>
            <p className="font-sans text-xs text-gray-500 mb-6 text-center">Shipping & taxes calculated at checkout</p>
            <button className="w-full bg-vinyl-blue text-white font-mono text-sm uppercase py-4 hover:bg-vinyl-black transition-colors tracking-widest">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
