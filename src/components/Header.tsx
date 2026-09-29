import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Package,
  MessageCircle,
  Percent,
  Check
} from 'lucide-react';
import { CategoryKey, UserProfile } from '../types/confectionery';
import { CATEGORIES, STORE_INFO } from '../data/confectioneryData';
import { ShopLocationModal } from './ShopLocationModal';

interface HeaderProps {
  activeCategory: CategoryKey;
  onSelectCategory: (category: CategoryKey) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  userProfile?: UserProfile;
  onOpenWhatsApp: (presetCategory?: string) => void;
  currentPincode: string;
  onChangePincode: (pin: string, city: string) => void;
  onOpenAbout: () => void;
  onOpenTestimonials: () => void;
  onOpenDeals: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  cartSubtotal,
  onOpenCart,
  onOpenProfile,
  userProfile,
  onOpenWhatsApp,
  currentPincode,
  onChangePincode,
  onOpenAbout,
  onOpenTestimonials,
  onOpenDeals,
}) => {
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<CategoryKey>('all');
  const [isShopLocationModalOpen, setIsShopLocationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    'Belgian Dark Chocolate 72%',
    'Silver Kaju Katli',
    'Sugar-Free Date Bites',
    'Parisian Macarons',
    'Luxury Gift Hamper',
    'Saffron Motichoor Laddu',
    'Diet Diabetic Sweets'
  ];

  const handleSuggestionClick = (term: string) => {
    onSearchChange(term);
    setShowSearchSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#131921] text-white shadow-md">
      {/* Top micro bar for high-priority express delivery info */}
      <div className="bg-[#232f3e] px-4 py-1 text-xs text-amber-200 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-stone-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Prime Sweets
            </span>
            <span className="hidden sm:inline text-stone-300">
              Guaranteed Fresh Temperature-Insulated Delivery on all Artisan Confectionery
            </span>
            <span className="sm:hidden text-stone-300">Express Delivery in 2 Hours</span>
          </div>
          <div className="flex items-center gap-4 text-stone-300">
            <button 
              onClick={() => onOpenWhatsApp()}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp AI Ordering</span>
            </button>
            <span className="hidden md:inline text-stone-600">|</span>
            <button 
              onClick={onOpenAbout} 
              className="hidden md:inline hover:text-white transition-colors cursor-pointer"
            >
              About Our Heritage (Est. 1988)
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto">
        {/* Row 1: Brand & Actions (Responsive layout) */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-4 justify-between">
          {/* Brand Zone */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden p-1.5 hover:bg-stone-800 rounded text-stone-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSelectCategory('all'); onSearchChange(''); }}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white font-serif font-black shadow-md border border-amber-400/40 text-base sm:text-lg">
                S
              </div>
              <div className="leading-tight">
                <span className="text-sm sm:text-lg md:text-xl font-bold tracking-tight font-serif text-white group-hover:text-amber-400 transition-colors block">
                  Sharma Confectioners
                </span>
                <span className="hidden xs:block text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                  Royal Sweets & Bakery
                </span>
              </div>
            </a>
          </div>

          {/* Owner's Shop Location in Header (Desktop) */}
          <button
            onClick={() => setIsShopLocationModalOpen(true)}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 hover:border hover:border-white rounded text-left transition-all cursor-pointer shrink-0 bg-stone-850/50 hover:bg-stone-800"
            title="Click to view shop address and Google Map location"
          >
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs leading-none">
              <span className="text-stone-400 block text-[10px] font-medium">Owner's Shop</span>
              <span className="font-bold text-white tracking-tight flex items-center gap-0.5">
                Station Rd, Chandpur
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </span>
            </div>
          </button>

          {/* Desktop Search Bar (hidden on mobile, rendered below on mobile for 100% width) */}
          <div className="hidden md:block flex-1 max-w-2xl relative mx-2">
            <div className="flex items-center rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amber-500 shadow-inner">
              <select
                value={selectedSearchCategory}
                onChange={(e) => {
                  const cat = e.target.value as CategoryKey;
                  setSelectedSearchCategory(cat);
                  onSelectCategory(cat);
                }}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-2.5 py-2.5 border-r border-stone-300 outline-none cursor-pointer hidden lg:block shrink-0 max-w-[130px] truncate"
              >
                <option value="all">All Sweets</option>
                {CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>

              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  placeholder="Search dark chocolate, kaju katli, macarons, sugar-free..."
                  className="w-full px-3 py-2 text-stone-900 text-sm outline-none placeholder:text-stone-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button 
                onClick={() => setShowSearchSuggestions(false)}
                className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 px-4 py-2.5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Search"
              >
                <Search className="w-4 h-4 font-bold" />
              </button>
            </div>

            {/* Desktop Search Dropdown Suggestions */}
            {showSearchSuggestions && !searchQuery && (
              <div 
                onMouseDown={(e) => e.preventDefault()}
                className="absolute left-0 right-0 top-full mt-1 bg-white text-stone-900 shadow-2xl rounded-md border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-1"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Popular Confectionery Searches
                  </span>
                  <button 
                    onClick={() => setShowSearchSuggestions(false)}
                    className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className="text-xs bg-stone-100 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 px-2.5 py-1 rounded transition-colors text-left cursor-pointer flex items-center gap-1.5"
                    >
                      <Search className="w-3 h-3 text-stone-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Zone (Account and Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Account Icon */}
            <button
              onClick={() => onOpenProfile()}
              className="md:hidden p-1.5 hover:bg-stone-800 rounded text-stone-200 hover:text-white cursor-pointer relative"
              aria-label="Account Profile"
              title="Open Account Profile"
            >
              <User className="w-5 h-5 text-amber-400" />
            </button>

            {/* Desktop Account & Profile (Amazon Style) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => onOpenProfile()}
                onMouseEnter={() => setIsAccountDropdownOpen(true)}
                className="px-2.5 py-1 hover:border hover:border-white rounded text-left transition-all cursor-pointer flex items-center gap-1"
              >
                <div className="text-xs leading-none">
                  <span className="text-stone-400 block text-[11px]">
                    {userProfile?.isLoggedIn ? `Hello, ${userProfile.name.split(' ')[0]}` : 'Hello, Sign In'}
                  </span>
                  <span className="font-bold text-white flex items-center gap-0.5">
                    {userProfile?.isLoggedIn ? 'Your Account' : 'Login / Register'}
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </span>
                </div>
              </button>

              {/* Account Quick Dropdown */}
              {isAccountDropdownOpen && (
                <div
                  onMouseLeave={() => setIsAccountDropdownOpen(false)}
                  className="absolute right-0 top-full mt-1 w-64 bg-white text-stone-900 rounded-md shadow-2xl border border-stone-200 py-3 px-4 z-50"
                >
                  <div className="border-b border-stone-100 pb-2 mb-2">
                    <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                      {userProfile?.isLoggedIn ? 'Active Account' : 'Account Status'}
                    </p>
                    <p className="text-sm font-bold text-stone-900 truncate">
                      {userProfile?.isLoggedIn ? userProfile.name : 'Guest User'}
                    </p>
                    <p className="text-xs text-stone-500 truncate">
                      {userProfile?.isLoggedIn ? userProfile.email : 'Click to Sign In with 5-digit PIN'}
                    </p>
                    <p className="text-xs text-amber-700 font-semibold mt-0.5">📍 Chandpur 246725</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <button 
                      onClick={() => { setIsAccountDropdownOpen(false); onOpenProfile(); }}
                      className="w-full text-left py-2 px-2.5 hover:bg-amber-50 hover:text-amber-900 rounded font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>{userProfile?.isLoggedIn ? 'Edit Profile & Order Address' : 'Login / Sign Up'}</span>
                      <User className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                    <button 
                      onClick={() => { setIsAccountDropdownOpen(false); setIsShopLocationModalOpen(true); }}
                      className="w-full text-left py-2 px-2.5 hover:bg-amber-50 hover:text-amber-900 rounded font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>Owner's Shop Location</span>
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Section Trigger with Badge */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 hover:border hover:border-white rounded transition-all cursor-pointer bg-stone-800/80 hover:bg-stone-800"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 font-black text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-sm">
                  {cartCount}
                </span>
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <span className="text-stone-400 block text-[10px]">Cart</span>
                <span className="font-bold text-white">₹{cartSubtotal}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Row 2: Dedicated Full-Width Mobile Search Bar (Avoids any cramping on phones) */}
        <div className="md:hidden px-3 pb-2 pt-0.5">
          <div className="flex items-center rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amber-500 shadow-inner">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                placeholder="Search dark chocolate, sweets, macarons..."
                className="w-full px-3 py-2 text-stone-900 text-xs outline-none placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button 
              onClick={() => setShowSearchSuggestions(false)}
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-3.5 py-2 flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Search"
            >
              <Search className="w-4 h-4 font-bold" />
            </button>
          </div>

          {/* Mobile Search Dropdown Suggestions */}
          {showSearchSuggestions && !searchQuery && (
            <div 
              onMouseDown={(e) => e.preventDefault()}
              className="mt-1 bg-white text-stone-900 shadow-xl rounded-md border border-stone-200 p-2.5 z-50 animate-in fade-in"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Popular Confectionery Searches
                </span>
                <button 
                  onClick={() => setShowSearchSuggestions(false)}
                  className="text-[11px] text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestionClick(term)}
                    className="text-[11px] bg-stone-100 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 px-2 py-0.5 rounded text-left cursor-pointer flex items-center gap-1"
                  >
                    <Search className="w-2.5 h-2.5 text-stone-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Location Header Strip (Visible on mobile/tablet screens) */}
      <div className="lg:hidden bg-[#1f2937] px-3 py-1.5 border-t border-stone-800 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsShopLocationModalOpen(true)}
          className="flex items-center gap-1.5 text-stone-200 hover:text-white cursor-pointer w-full text-left"
          title="Click to view owner's shop location on Google Maps"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate text-xs">
            <span className="text-stone-400">Shop Location: </span>
            <span className="font-semibold text-white">47Q8+783, Station Rd, Chandpur</span>
          </span>
          <span className="text-[10px] text-amber-400 ml-auto shrink-0 font-bold bg-stone-800/90 px-2 py-0.5 rounded border border-amber-400/30 hover:bg-amber-500 hover:text-stone-950 transition-colors">
            Open Map
          </span>
        </button>
      </div>

      {/* Sub Navigation Strip (Amazon Style Mega Categories & Direct Links) */}
      <div className="bg-[#232f3e] border-t border-stone-700/60 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium whitespace-nowrap">
          <button
            onClick={() => { onSelectCategory('all'); onSearchChange(''); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeCategory === 'all' && !searchQuery
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-white hover:bg-stone-700/60'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>All Sweets</span>
          </button>

          <button
            onClick={onOpenDeals}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-amber-300 hover:text-amber-200 hover:bg-stone-700/60 transition-colors font-bold cursor-pointer"
          >
            <Percent className="w-3.5 h-3.5 text-amber-400" />
            <span>Today's Lightning Deals</span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                onSelectCategory(cat.key);
                onSearchChange('');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeCategory === cat.key && !searchQuery
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-200 hover:text-white hover:bg-stone-700/60'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}

          <button
            onClick={onOpenTestimonials}
            className="px-2.5 py-1 text-stone-300 hover:text-white hover:bg-stone-700/60 rounded transition-colors cursor-pointer"
          >
            Customer Reviews
          </button>

          <button
            onClick={onOpenAbout}
            className="px-2.5 py-1 text-stone-300 hover:text-white hover:bg-stone-700/60 rounded transition-colors cursor-pointer"
          >
            Our Heritage & Purity
          </button>

          <div className="ml-auto hidden lg:flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Pure Desi Ghee & Belgian Cacao</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-stone-900 text-white h-full overflow-y-auto flex flex-col justify-between shadow-2xl p-4">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-bold text-stone-950 font-serif">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Sharma Confectioners</h3>
                    <p className="text-[11px] text-amber-400">Royal Sweets & Delights</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-[11px] font-bold uppercase text-stone-500 tracking-wider px-2 mb-2">Shop by Category</p>
                <button
                  onClick={() => { onSelectCategory('all'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 flex items-center gap-2"
                >
                  <span>✨</span> All Categories
                </button>
                {CATEGORIES.map(c => (
                  <button
                    key={c.key}
                    onClick={() => { onSelectCategory(c.key); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                      activeCategory === c.key ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:bg-stone-800 text-stone-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                    </span>
                    <span className="text-xs opacity-75">{c.itemCount}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1 border-t border-stone-800 pt-4">
                <p className="text-[11px] font-bold uppercase text-stone-500 tracking-wider px-2 mb-2">Quick Shortcuts</p>
                <button
                  onClick={() => { onOpenDeals(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-400 font-semibold hover:bg-stone-800 flex items-center gap-2"
                >
                  <Percent className="w-4 h-4" />
                  <span>Today's Lightning Deals</span>
                </button>
                <button
                  onClick={() => { onOpenWhatsApp(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-emerald-400 font-semibold hover:bg-stone-800 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp AI Shopping Assistant</span>
                </button>
                <button
                  onClick={() => { onOpenProfile(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-300 hover:bg-stone-800 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span>My Profile (Name, Phone, Address)</span>
                </button>
                <button
                  onClick={() => { onOpenTestimonials(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-300 hover:bg-stone-800 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Verified Customer Reviews</span>
                </button>
                <button
                  onClick={() => { onOpenAbout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-300 hover:bg-stone-800 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-stone-400" />
                  <span>About Our Confectionery</span>
                </button>
              </div>
            </div>

            <div className="border-t border-stone-800 pt-3 text-xs text-stone-400">
              <p className="font-semibold text-stone-300">Owner's Shop:</p>
              <p className="text-white font-medium text-xs mt-0.5">47Q8+783, Station Rd, Chandpur (UP 246725)</p>
              <button
                onClick={() => { setIsShopLocationModalOpen(true); setIsMobileMenuOpen(false); }}
                className="mt-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View Store Location & Google Map</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Owner's Store Location & Google Map Modal */}
      <ShopLocationModal
        isOpen={isShopLocationModalOpen}
        onClose={() => setIsShopLocationModalOpen(false)}
      />
    </header>
  );
};
