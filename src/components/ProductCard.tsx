import React, { useState } from 'react';
import { Star, ShoppingCart, Zap, Check, Eye, Heart, ShieldCheck, Flame } from 'lucide-react';
import { Product } from '../types/confectionery';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedWeight: string, quantity: number) => void;
  onBuyNow: (product: Product, selectedWeight: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onQuickView,
}) => {
  const [selectedWeight, setSelectedWeight] = useState(product.defaultWeight);
  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Calculate current price based on weight
  const currentWeightOption = product.weightOptions.find(w => w.weight === selectedWeight) || product.weightOptions[0];
  const currentPrice = currentWeightOption ? currentWeightOption.price : 499;
  const currentMrp = currentWeightOption ? currentWeightOption.mrp : 699;
  const discount = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedWeight, 1);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product, selectedWeight);
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="bg-white rounded-xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer relative"
    >
      {/* Top Media Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Veg / Green Indicator (Standard Indian Confectionery Purity Mark) */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-sm border border-stone-300 shadow-xs">
          <div className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
          </div>
        </div>

        {/* Badge: Amazon Choice or Bestseller */}
        {product.badge && (
          <div className="absolute top-2.5 right-2.5 z-10">
            {product.badge === 'Amazon Choice' && (
              <span className="bg-[#232f3e] text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                Amazon's <span className="text-white font-normal">Choice</span>
              </span>
            )}
            {product.badge === 'Best Seller' && (
              <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                #1 Best Seller
              </span>
            )}
            {product.badge === 'Deal of the Day' && (
              <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3 fill-white" /> Deal of the Day
              </span>
            )}
            {product.badge === 'Festive Special' && (
              <span className="bg-amber-800 text-amber-100 font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                Festive Special
              </span>
            )}
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 cursor-pointer z-10"
        >
          <Eye className="w-3.5 h-3.5 text-stone-600" />
          <span>Quick View</span>
        </button>

        {/* Wishlist toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute bottom-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 text-stone-600 hover:text-red-500 shadow-sm transition-colors cursor-pointer"
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Origin micro text */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="uppercase font-semibold tracking-wider text-amber-800">
              {product.categoryName}
            </span>
            {product.isSugarFree && (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded text-[10px]">
                0% Sugar
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-1">
            {product.tagline}
          </p>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-stone-800 tabular-nums">
              {product.rating}
            </span>
            <span className="text-xs text-stone-400">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price & Discount (Amazon format) */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-xs text-red-600 font-bold">-{discount}%</span>
            <span className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums">
              ₹{currentPrice}
            </span>
            <span className="text-xs text-stone-400 line-through tabular-nums">
              ₹{currentMrp}
            </span>
          </div>

          {/* Prime & Delivery Estimate */}
          <div className="mt-1 text-xs text-stone-600">
            <span className="font-bold text-[#007185]">Prime</span>{' '}
            <span className="font-medium text-stone-700">{product.deliveryPromise}</span>
          </div>

          {/* Weight Variant Selector Chips */}
          <div className="mt-3 pt-2 border-t border-stone-100" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
              Select Size:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.weightOptions.map((opt) => (
                <button
                  key={opt.weight}
                  onClick={() => setSelectedWeight(opt.weight)}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    selectedWeight === opt.weight
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
                  }`}
                >
                  {opt.weight}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons (Amazon Add to Cart & Buy Now) */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                isAddedAnim
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950'
              }`}
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
