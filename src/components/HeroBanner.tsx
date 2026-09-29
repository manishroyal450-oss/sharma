import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Gift, Clock } from 'lucide-react';
import { CategoryKey } from '../types/confectionery';
import { heroBannerImg, royalMithaiImg, artisanTrufflesImg, sugarfreeHamperImg } from '../data/confectioneryData';

interface HeroBannerProps {
  onSelectCategory: (key: CategoryKey) => void;
  onOpenDeals: () => void;
  onOpenWhatsApp: (preset?: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onOpenDeals,
  onOpenWhatsApp,
}) => {
  return (
    <section className="relative bg-gradient-to-b from-stone-900 via-stone-850 to-stone-100 pb-8 sm:pb-12">
      {/* Cinematic Hero Backdrop */}
      <div className="relative w-full min-h-[380px] sm:h-[420px] md:h-[460px] overflow-hidden flex items-center">
        <img
          src={heroBannerImg}
          alt="Luxury Belgian Confectionery and Chocolates"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        {/* Soft Amazon-style Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/75 to-transparent sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-0 w-full text-white">
          <div className="max-w-xl space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Festive Confectionery Festival · Flat 25% Off</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight leading-tight text-white drop-shadow-md">
              Royal Sweets & Handcrafted Belgian Cocoa
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-stone-200 line-clamp-3 sm:line-clamp-none font-light leading-relaxed">
              Made fresh every dawn with 100% pure A2 cow ghee, single-origin cacao beans, and certified vegetarian ingredients. Packaged in temperature-insulated cold boxes.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={onOpenDeals}
                className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-all shadow-lg shadow-amber-950/50 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Shop Today's Deals</span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </button>

              <button
                onClick={() => onOpenWhatsApp("Hi, I want recommendations for gift hampers and sweets")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-all backdrop-blur-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Ask WhatsApp AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid (No overlapping on mobile, elegant overlay on tablet/desktop) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 mt-4 sm:-mt-16 md:-mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Deal of the Day Spotlight */}
          <div className="bg-white rounded-xl p-4 shadow-xl border border-stone-200/80 flex flex-col justify-between hover:shadow-2xl transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" /> Lightning Deal
                </span>
                <span className="bg-red-100 text-red-700 font-bold text-xs px-2 py-0.5 rounded">
                  25% Off
                </span>
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-600 transition-colors">
                Belgian Dark Truffles Gold (72% Cocoa)
              </h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                Handcrafted with 24k edible gold flakes
              </p>
            </div>

            <div className="mt-3">
              <div className="w-full h-32 rounded-lg overflow-hidden relative mb-2 bg-stone-100">
                <img
                  src={artisanTrufflesImg}
                  alt="Belgian Dark Truffles"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-stone-900">₹499</span>
                <span className="text-xs text-stone-400 line-through">₹665</span>
                <span className="text-[11px] text-emerald-600 font-semibold">Ends in 03h:24m</span>
              </div>
              <button
                onClick={() => onSelectCategory('dark-chocolates')}
                className="w-full mt-2 text-xs font-bold text-stone-800 hover:text-amber-700 text-left cursor-pointer flex items-center justify-between"
              >
                <span>View Belgian Chocolates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Royal Mithai Collection */}
          <div className="bg-white rounded-xl p-4 shadow-xl border border-stone-200/80 flex flex-col justify-between hover:shadow-2xl transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Royal Sweets
                </span>
                <span className="text-xs text-stone-400 font-medium">Bestseller</span>
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-600 transition-colors">
                Pure Cashew Silver Vark Kaju Katli
              </h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                Freshly cut in pure cow ghee & silver leaf
              </p>
            </div>

            <div className="mt-3">
              <div className="w-full h-32 rounded-lg overflow-hidden relative mb-2 bg-stone-100">
                <img
                  src={royalMithaiImg}
                  alt="Royal Kaju Katli Sweets"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-stone-900">₹349</span>
                <span className="text-xs text-stone-400 line-through">₹435</span>
                <span className="text-[11px] text-stone-500 font-medium">· 500g Fresh Pack</span>
              </div>
              <button
                onClick={() => onSelectCategory('royal-sweets')}
                className="w-full mt-2 text-xs font-bold text-stone-800 hover:text-amber-700 text-left cursor-pointer flex items-center justify-between"
              >
                <span>Explore Royal Indian Mithai</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Diabetic Safe & Sugar Free */}
          <div className="bg-white rounded-xl p-4 shadow-xl border border-stone-200/80 flex flex-col justify-between hover:shadow-2xl transition-shadow group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 0% Added Sugar
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded font-semibold">
                  Diabetic Friendly
                </span>
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-emerald-700 transition-colors">
                Roasted Almond & Medjool Date Bites
              </h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                Zero spike guilt-free healthy energy confections
              </p>
            </div>

            <div className="mt-3">
              <div className="w-full h-32 rounded-lg overflow-hidden relative mb-2 bg-stone-100">
                <img
                  src={sugarfreeHamperImg}
                  alt="Sugar Free Treats"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-stone-900">₹449</span>
                <span className="text-xs text-stone-400 line-through">₹549</span>
                <span className="text-[11px] text-emerald-700 font-medium">100% Natural</span>
              </div>
              <button
                onClick={() => onSelectCategory('sugar-free')}
                className="w-full mt-2 text-xs font-bold text-stone-800 hover:text-emerald-700 text-left cursor-pointer flex items-center justify-between"
              >
                <span>View Sugar-Free Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: WhatsApp AI Shopping Assistant Banner */}
          <div className="bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-xl p-4 shadow-xl border border-emerald-700/40 flex flex-col justify-between hover:shadow-2xl transition-shadow">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live AI Assistant</span>
              </div>
              <h3 className="font-bold text-white text-base">
                Sharma Confectioners AI
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                Hindi or English mein type karke instant sweets, chocolates aur gift hampers filter karein!
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-800/80">
              <p className="text-[11px] text-stone-300 italic mb-2">
                "Diabetic father ke liye sweets under ₹500"
              </p>
              <button
                onClick={() => onOpenWhatsApp()}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <span>Open WhatsApp Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
