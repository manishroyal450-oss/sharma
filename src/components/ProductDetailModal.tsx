import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Check, 
  Package, 
  Sparkles,
  Info
} from 'lucide-react';
import { Product } from '../types/confectionery';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedWeight: string, quantity: number) => void;
  onBuyNow: (product: Product, selectedWeight: string) => void;
  onAskOnWhatsApp: (productName: string) => void;
  currentPincode: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onAskOnWhatsApp,
  currentPincode,
}) => {
  if (!product) return null;

  const [selectedWeight, setSelectedWeight] = useState(product.defaultWeight);
  const [quantity, setQuantity] = useState(1);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const currentWeightOption = product.weightOptions.find(w => w.weight === selectedWeight) || product.weightOptions[0];
  const price = currentWeightOption ? currentWeightOption.price : 499;
  const mrp = currentWeightOption ? currentWeightOption.mrp : 699;
  const discount = Math.round(((mrp - price) / mrp) * 100);

  const handleAddToCart = () => {
    onAddToCart(product, selectedWeight, quantity);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedWeight);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-stone-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95 my-auto"
      >
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-stone-100 hover:bg-stone-200 text-stone-700 p-2 rounded-full transition-colors cursor-pointer shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-8">
          {/* Left Column: Image and Key Guarantees */}
          <div className="space-y-4">
            <div className="aspect-4/3 sm:aspect-square w-full rounded-xl overflow-hidden bg-stone-100 relative shadow-inner">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-white/95 px-2 py-1 rounded shadow-xs flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <div className="w-3 h-3 border-2 border-emerald-600 rounded-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                </div>
                <span>100% Pure Vegetarian</span>
              </div>
            </div>

            {/* Quality & Cold-Chain Trust Box */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 font-bold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sharma Confectioners Freshness & Cold-Chain Promise</span>
              </div>
              <p className="leading-relaxed">
                Shipped in high-density food-grade insulated thermocool casing with reusable food-safe gel ice packs so that your chocolates and mithai arrive in pristine gourmet condition.
              </p>
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                <span>Shelf Life: {product.shelfLife}</span>
                <span>Batch: Fresh Morning</span>
              </div>
            </div>
          </div>

          {/* Right Column: PDP Details & Purchase Module */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-700">
                  {product.categoryName}
                </span>
                {product.badge && (
                  <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Subtitle / Tagline */}
              <p className="text-xs text-stone-500 mt-1">
                {product.tagline}
              </p>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2 pb-3 border-b border-stone-100">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-stone-800 tabular-nums">
                  {product.rating} out of 5
                </span>
                <span className="text-xs text-stone-400">
                  ({product.reviewCount.toLocaleString()} ratings)
                </span>
              </div>

              {/* Price Block */}
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-red-600">-{discount}% Off</span>
                  <span className="text-2xl sm:text-3xl font-black text-stone-900 tabular-nums">
                    ₹{price}
                  </span>
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    ₹{mrp}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">Inclusive of all taxes</p>
              </div>

              {/* Delivery Pin Promise */}
              <div className="mt-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Deliver to New Delhi - {currentPincode}</span>
                </div>
                <p className="text-stone-600">
                  <span className="font-bold text-emerald-700">FREE Prime Delivery:</span> {product.deliveryPromise}
                </p>
              </div>

              {/* Weight Options */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Choose Pack Size / Weight:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.weightOptions.map((opt) => (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeight(opt.weight)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedWeight === opt.weight
                          ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/30'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span className="block text-xs font-bold text-stone-900">{opt.weight}</span>
                      <span className="block text-xs text-amber-800 font-semibold tabular-nums">₹{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold tabular-nums min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-emerald-700 font-medium">In Stock ({product.stockCount} left)</span>
              </div>

              {/* Ingredients & Allergens Accordion Preview */}
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-600 space-y-1.5">
                <p>
                  <span className="font-bold text-stone-800">Ingredients: </span>
                  {product.ingredients.join(', ')}.
                </p>
                <p>
                  <span className="font-bold text-stone-800">Allergen Advice: </span>
                  {product.allergens}
                </p>
                <p>
                  <span className="font-bold text-stone-800">Origin / Craft: </span>
                  {product.origin}
                </p>
              </div>
            </div>

            {/* Bottom Actions: Add to Cart, Buy Now, WhatsApp Chat */}
            <div className="pt-4 border-t border-stone-200 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isAddedAnim
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950'
                  }`}
                >
                  {isAddedAnim ? (
                    <>
                      <Check className="w-4 h-4 font-bold" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart (₹{price * quantity})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onAskOnWhatsApp(`Hi! Tell me more about "${product.name}"`);
                  onClose();
                }}
                className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask WhatsApp AI or order via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
