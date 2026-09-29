import React from 'react';
import { Home, Grid, MessageCircle, User, ShoppingCart } from 'lucide-react';
import { CategoryKey } from '../types/confectionery';

interface MobileBottomNavProps {
  activeCategory: CategoryKey;
  onSelectCategory: (key: CategoryKey) => void;
  onOpenCart: () => void;
  cartCount: number;
  onOpenProfile: () => void;
  onOpenWhatsApp: () => void;
  onScrollToTop: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenCart,
  cartCount,
  onOpenProfile,
  onOpenWhatsApp,
  onScrollToTop,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#131921] border-t border-stone-800 text-stone-300 py-1.5 px-3 flex items-center justify-around shadow-2xl">
      {/* Home */}
      <button
        onClick={() => { onSelectCategory('all'); onScrollToTop(); }}
        className="flex flex-col items-center gap-0.5 text-xs font-medium hover:text-white cursor-pointer"
      >
        <Home className="w-5 h-5 text-amber-400" />
        <span className="text-[10px]">Shop</span>
      </button>

      {/* Categories slide */}
      <button
        onClick={() => {
          const el = document.getElementById('catalogue-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="flex flex-col items-center gap-0.5 text-xs font-medium hover:text-white cursor-pointer"
      >
        <Grid className="w-5 h-5 text-stone-300" />
        <span className="text-[10px]">Categories</span>
      </button>

      {/* WhatsApp AI */}
      <button
        onClick={onOpenWhatsApp}
        className="flex flex-col items-center gap-0.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 cursor-pointer relative"
      >
        <div className="w-8 h-8 -mt-4 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg border-2 border-[#131921]">
          <MessageCircle className="w-4 h-4 fill-white" />
        </div>
        <span className="text-[10px] font-bold text-emerald-400">Sharma AI</span>
      </button>

      {/* Profile & Orders */}
      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center gap-0.5 text-xs font-medium hover:text-white cursor-pointer"
      >
        <User className="w-5 h-5 text-stone-300" />
        <span className="text-[10px]">Account</span>
      </button>

      {/* Cart */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center gap-0.5 text-xs font-medium hover:text-white cursor-pointer relative"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 text-stone-300" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Cart</span>
      </button>
    </nav>
  );
};
