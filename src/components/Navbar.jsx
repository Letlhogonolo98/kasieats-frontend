import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartDrawer from './CartDrawer';

function Navbar() {
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          
          {/* 1. Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🇿🇦</span>
            <span className="text-2xl font-black text-orange-600 tracking-tighter">
              Kasi<span className="text-gray-900">Eats</span>
            </span>
          </Link>

          {/* 2. Actions Group */}
          <div className="flex items-center space-x-3 md:space-x-6">
            
            {/* VENDOR PORTAL (Existing Sellers) */}
            <Link 
              to="/vendor" 
              className="hidden sm:block text-gray-600 hover:text-orange-600 font-bold text-sm transition"
            >
              Vendor Portal
            </Link>

            {/* CART ICON */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors group"
            >
              <span className="text-xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </button>

            {/* SIGN UP (New Users/Sellers) */}
            <Link 
              to="/signup" 
              className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}

export default Navbar;