import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

interface ProductFormProps {
  product: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const { addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  // Mock variants for demo purposes if product doesn't have explicit ones
  const [selectedVariant, setSelectedVariant] = useState(product.format || 'Standard');

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleSubmit = () => {
    if (product.isSoldOut) return;
    addToCart(product, quantity, selectedVariant);
  };

  return (
    <div className="product-form flex flex-col gap-6">
       {/* Variant Picker Stub */}
       <div className="flex flex-col gap-2">
         <span className="font-mono text-[10px] uppercase text-gray-500 tracking-widest">Format</span>
         <div className="flex gap-2">
            <button 
                className={`px-4 py-2 border font-mono text-xs uppercase transition-colors ${selectedVariant === product.format ? 'bg-vinyl-blue text-white border-vinyl-blue' : 'bg-transparent border-gray-300 text-gray-500 hover:border-vinyl-blue'}`}
                onClick={() => setSelectedVariant(product.format)}
            >
                {product.format}
            </button>
            {/* Fake extra variant for demo */}
            <button 
                className={`px-4 py-2 border font-mono text-xs uppercase transition-colors ${selectedVariant === 'Digital' ? 'bg-vinyl-blue text-white border-vinyl-blue' : 'bg-transparent border-gray-300 text-gray-500 hover:border-vinyl-blue'}`}
                onClick={() => setSelectedVariant('Digital')}
            >
                Digital ($12)
            </button>
         </div>
       </div>

       <div className="flex gap-4">
            <div className="flex items-center border border-vinyl-blue h-12 w-32 bg-white">
                <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-vinyl-blue"
                >
                    <Minus size={14} />
                </button>
                <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    className="w-full h-full text-center font-mono text-sm border-x border-gray-100 focus:outline-none" 
                />
                <button 
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-vinyl-blue"
                >
                    <Plus size={14} />
                </button>
            </div>
            
            <button 
                onClick={handleSubmit}
                disabled={product.isSoldOut}
                className={`flex-1 text-white transition-all h-12 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] border border-transparent
                ${product.isSoldOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-vinyl-blue hover:bg-vinyl-black'}`}
            >
                <span>{product.isSoldOut ? 'Sold Out' : 'Add to Cart'}</span>
                {!product.isSoldOut && <ShoppingBag size={16} />}
            </button>
        </div>
    </div>
  );
};

export default ProductForm;
