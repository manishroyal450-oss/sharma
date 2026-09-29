import React from 'react';
import { ShieldCheck, MessageCircle, Heart, ChevronUp } from 'lucide-react';
import { CategoryKey } from '../types/confectionery';

interface FooterProps {
  onSelectCategory: (key: CategoryKey) => void;
  onOpenAbout: () => void;
  onOpenTestimonials: () => void;
  onOpenWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAbout,
  onOpenTestimonials,
  onOpenWhatsApp,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#131921] text-stone-300 text-xs">
      {/* Amazon Back to Top Strip */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#232f3e] hover:bg-[#37475a] text-white py-3.5 text-center font-bold tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer border-b border-stone-800"
      >
        <ChevronUp className="w-4 h-4" />
        <span>Back to Top</span>
      </button>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">
            Get to Know Us
          </h4>
          <ul className="space-y-2 text-stone-400">
            <li>
              <button onClick={onOpenAbout} className="hover:text-amber-400 transition-colors cursor-pointer">
                Our Confectionery Legacy (1988)
              </button>
            </li>
            <li>
              <button onClick={onOpenAbout} className="hover:text-amber-400 transition-colors cursor-pointer">
                Belgian Cacao Standards
              </button>
            </li>
            <li>
              <button onClick={onOpenAbout} className="hover:text-amber-400 transition-colors cursor-pointer">
                Cold-Chain Guarantee
              </button>
            </li>
            <li>
              <button onClick={onOpenTestimonials} className="hover:text-amber-400 transition-colors cursor-pointer">
                Customer Testimonials
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">
            Shop by Sweet Category
          </h4>
          <ul className="space-y-2 text-stone-400">
            <li>
              <button onClick={() => onSelectCategory('dark-chocolates')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Belgian Dark Truffles (72%-85%)
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('royal-sweets')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Pure Cashew Kaju Katli
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('gift-hampers')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Luxury Celebration Hampers
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('sugar-free')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Diabetic & Sugar-Free Treats
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('bakery-cookies')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Parisian Macarons & Butter Cookies
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">
            Purity & Trust
          </h4>
          <ul className="space-y-2 text-stone-400">
            <li className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Pure Vegetarian</span>
            </li>
            <li>No Hydrogenated Palm Oil</li>
            <li>100% Desi Cow Ghee (Pure A2)</li>
            <li>Food-Grade Thermal Gel Packaging</li>
            <li>Direct WhatsApp Quick Ordering</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">
            Store Location & WhatsApp
          </h4>
          <p className="text-stone-400 mb-2 leading-relaxed text-xs">
            📍 <strong>47Q8+783, Station Rd, Chandpur, Uttar Pradesh 246725</strong>
          </p>
          <p className="text-stone-500 mb-3 text-[11px]">
            Direct ordering & delivery on WhatsApp: +91 98765 43210
          </p>
          <button
            onClick={onOpenWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-xs"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-stone-800 py-6 px-4 text-center text-[11px] text-stone-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-serif text-xs">
            S
          </div>
          <span className="font-bold text-white tracking-wide text-xs">Sharma Confectioners & Royal Sweets</span>
        </div>
        <p>© 1988–2026 Sharma Confectioners India Pvt. Ltd. Amazon-Style Online Experience. All rights reserved.</p>
        <p className="text-stone-600">
          Crafted with pure cacao, royal desi ghee and warmth by the Sharma family.
        </p>
      </div>
    </footer>
  );
};
