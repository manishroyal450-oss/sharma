import React, { useState, useEffect } from 'react';
import { CategoryKey, CartItem, Order, Product, UserAddress, UserProfile } from './types/confectionery';
import { PRODUCTS, INITIAL_USER_ADDRESS, DEFAULT_USER_PROFILE } from './data/confectioneryData';
import { Header } from './components/Header';
import { CategorySlider } from './components/CategorySlider';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ProfileSection } from './components/ProfileSection';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhatsAppChatbot } from './components/WhatsAppChatbot';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  // Navigation & Filter State
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDealsOnly, setIsDealsOnly] = useState<boolean>(false);
  const [currentPincode, setCurrentPincode] = useState<string>('246725');

  // Modals & Panels State
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [whatsAppPresetQuery, setWhatsAppPresetQuery] = useState<string>('');

  // Cart State (stored in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sharma_conf_cart') || localStorage.getItem('chocoluxe_cart');
      return saved ? JSON.parse(saved) : [
        {
          product: PRODUCTS[0],
          selectedWeight: '500g (24 Pcs)',
          unitPrice: 899,
          quantity: 1,
        },
      ];
    } catch {
      return [];
    }
  });

  // Orders State (stored in localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('sharma_conf_orders') || localStorage.getItem('chocoluxe_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'SC-892144',
          date: '25 Sep 2026',
          status: 'Delivered',
          items: [
            {
              productId: PRODUCTS[1].id,
              name: PRODUCTS[1].name,
              image: PRODUCTS[1].image,
              weight: '500g',
              unitPrice: 649,
              quantity: 1,
            },
          ],
          subtotal: 649,
          deliveryCharge: 0,
          discount: 50,
          total: 599,
          address: INITIAL_USER_ADDRESS,
          paymentMethod: 'UPI / GPay / PhonePe',
          deliveryDate: 'Delivered on 25 Sep by Prime Express',
        },
      ];
    } catch {
      return [];
    }
  });

  // User Profile State (persisted in localStorage with 5-digit password auth)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('sharma_conf_current_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // User Address State (kept in sync with active profile for order fulfillment)
  const [userAddress, setUserAddress] = useState<UserAddress>(() => {
    try {
      const saved = localStorage.getItem('sharma_conf_address');
      if (saved) return JSON.parse(saved);
      return {
        id: 'addr-main',
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        street: userProfile.street,
        city: userProfile.city,
        state: userProfile.state,
        pincode: userProfile.pincode,
        type: 'Home',
        isDefault: true,
      };
    } catch {
      return INITIAL_USER_ADDRESS;
    }
  });

  // Master handler for profile changes (Login, Sign Up, or Edit Profile)
  // This immediately updates and persists user profile, active order address, and informs cart
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);

    const updatedAddr: UserAddress = {
      id: 'addr-main',
      name: newProfile.name,
      email: newProfile.email,
      phone: newProfile.phone,
      street: newProfile.street,
      city: 'Chandpur',
      state: 'Uttar Pradesh',
      pincode: '246725',
      type: 'Home',
      isDefault: true,
    };
    setUserAddress(updatedAddr);

    try {
      localStorage.setItem('sharma_conf_current_user', JSON.stringify(newProfile));
      localStorage.setItem('sharma_conf_address', JSON.stringify(updatedAddr));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sharma_conf_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('sharma_conf_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('sharma_conf_address', JSON.stringify(userAddress));
    } catch (e) {
      console.error(e);
    }
  }, [userAddress]);

  // Cart Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Cart Handlers
  const handleAddToCart = (product: Product, selectedWeight: string, quantity: number) => {
    const weightOpt = product.weightOptions.find(w => w.weight === selectedWeight) || product.weightOptions[0];
    const unitPrice = weightOpt ? weightOpt.price : 499;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedWeight === selectedWeight
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, selectedWeight, unitPrice, quantity }];
      }
    });
  };

  const handleBuyNow = (product: Product, selectedWeight: string) => {
    handleAddToCart(product, selectedWeight, 1);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, weight: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId, weight);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedWeight === weight
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, weight: string) => {
    setCartItems(prev =>
      prev.filter(item => !(item.product.id === productId && item.selectedWeight === weight))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Order Handlers
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(it => {
      const origProd = PRODUCTS.find(p => p.id === it.productId) || PRODUCTS[0];
      handleAddToCart(origProd, it.weight, it.quantity);
    });
    setIsProfileOpen(false);
    setIsCartOpen(true);
  };

  // WhatsApp Chatbot Trigger
  const handleOpenWhatsApp = (presetQuery?: string) => {
    if (presetQuery) {
      setWhatsAppPresetQuery(presetQuery);
    }
    setIsWhatsAppOpen(true);
  };

  const handleWhatsAppCheckout = (orderSummary: string) => {
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(orderSummary)}`;
    window.open(url, '_blank');
  };

  // Smooth Section Scrollers
  const scrollToAbout = () => {
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTestimonials = () => {
    document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalogue = () => {
    document.getElementById('catalogue-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 pb-16 md:pb-0">
      {/* 1. Amazon-Style Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalogue();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        userProfile={userProfile}
        onOpenWhatsApp={handleOpenWhatsApp}
        currentPincode={currentPincode}
        onChangePincode={(pin, city) => {
          setCurrentPincode(pin);
          setUserAddress(prev => ({ ...prev, pincode: pin, city }));
        }}
        onOpenAbout={scrollToAbout}
        onOpenTestimonials={scrollToTestimonials}
        onOpenDeals={() => {
          setIsDealsOnly(true);
          scrollToCatalogue();
        }}
      />

      {/* 2. Category Slide Motion Carousel (requested by user) */}
      <CategorySlider
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalogue();
        }}
      />

      {/* 3. Hero Campaign Banner & Amazon 4-Card Feature Grid */}
      <HeroBanner
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalogue();
        }}
        onOpenDeals={() => {
          setIsDealsOnly(true);
          scrollToCatalogue();
        }}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

      {/* 4. Main Amazon-Style Product Catalog (with filters, sorting, cards) */}
      <ProductCatalog
        products={PRODUCTS}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onQuickView={(prod) => setSelectedProductForModal(prod)}
        isDealsOnly={isDealsOnly}
        onToggleDealsOnly={() => setIsDealsOnly(!isDealsOnly)}
      />

      {/* 5. About Section (craftsmanship, Belgian cocoa, A2 desi ghee legacy) */}
      <AboutSection />

      {/* 6. Testimonials Section (Amazon verified customer reviews) */}
      <TestimonialsSection />

      {/* 7. Footer (Amazon multi-column footer) */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalogue();
        }}
        onOpenAbout={scrollToAbout}
        onOpenTestimonials={scrollToTestimonials}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
      />

      {/* 8. Mobile Bottom Navigation (responsive Amazon mobile app experience) */}
      <MobileBottomNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
        onOpenProfile={() => {
          setIsProfileOpen(true);
        }}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 9. Product Detail Quick View PDP Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onAskOnWhatsApp={(name) => handleOpenWhatsApp(`I want to ask about ${name}`)}
        currentPincode={currentPincode}
      />

      {/* 10. Amazon-Style Sliding Cart Drawer & Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        userAddress={userAddress}
        onPlaceOrder={handlePlaceOrder}
        onOpenWhatsAppCheckout={handleWhatsAppCheckout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 11. Profile Modal (Login, Sign Up with 5-digit PIN, Name, Phone, Address, Chandpur 246725 Fixed) */}
      <ProfileSection
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 12. WhatsApp AI Shopping Assistant (SweetBot) */}
      <WhatsAppChatbot
        isOpen={isWhatsAppOpen}
        onToggle={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
        onSelectCategory={setActiveCategory}
        onAddToCart={handleAddToCart}
        onQuickView={(prod) => setSelectedProductForModal(prod)}
        initialQuery={whatsAppPresetQuery}
      />
    </div>
  );
}
