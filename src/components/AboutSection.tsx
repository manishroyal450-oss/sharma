import React from 'react';
import { ShieldCheck, Award, Sparkles, HeartHandshake, Leaf, ThermometerSnowflake } from 'lucide-react';
import { royalMithaiImg, artisanTrufflesImg } from '../data/confectioneryData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="bg-stone-900 text-white py-16 px-4 sm:px-6 border-t border-stone-800">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-amber-400 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Confectionery Heritage · Since 1988</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white tracking-tight">
            Crafted for Connoisseurs of Pure Taste
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            From the royal halwai kitchens of Rajasthan to the artisanal chocolate ateliers of Brussels, Sharma Confectioners brings together three decades of uncompromising purity, culinary artistry, and sweet indulgence.
          </p>
        </div>

        {/* 4 Pillars of Purity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-stone-850 p-5 rounded-xl border border-stone-800 space-y-3 hover:border-amber-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Single-Origin Belgian Cacao</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              We strictly forbid palm oil and compound fats. Every chocolate bar and truffle is made with 100% pure cocoa butter and single-origin beans.
            </p>
          </div>

          <div className="bg-stone-850 p-5 rounded-xl border border-stone-800 space-y-3 hover:border-amber-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">100% Pure A2 Cow Desi Ghee</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Our royal motichoor laddoos, kaju katli, and malai barfi are slow-simmered in golden grass-fed desi ghee for authentic royal melt-in-mouth texture.
            </p>
          </div>

          <div className="bg-stone-850 p-5 rounded-xl border border-stone-800 space-y-3 hover:border-amber-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Zero Melting Cold-Chain Box</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Proprietary temperature-controlled thermal packaging with eco-friendly reusable gel ice blocks guarantees your sweets arrive cold and fresh anywhere in India.
            </p>
          </div>

          <div className="bg-stone-850 p-5 rounded-xl border border-stone-800 space-y-3 hover:border-amber-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">100% Pure Vegetarian & Natural</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              No animal gelatin, no chemical preservatives, and no synthetic food dyes. Even our macarons use Parisian almond-aquafaba eggless formulations.
            </p>
          </div>
        </div>

        {/* Split Story Feature */}
        <div className="bg-stone-850 rounded-2xl border border-stone-800 overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="p-6 sm:p-10 space-y-4">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              The Master Confectioner's Vow
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white leading-snug">
              Every box is packed with love, precision and fresh morning batches
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Unlike mass-manufactured shelf sweets packed with months-old stabilizers, our chefs begin work before sunrise. Whether you are treating your family, celebrating a birthday, or sending Diwali hampers to corporate clients, you taste true artisan craftsmanship.
            </p>
            <div className="pt-2 flex items-center gap-6 text-xs text-amber-300 font-semibold">
              <div>
                <span className="text-xl font-bold block text-white tabular-nums">38+</span>
                <span>Years of Legacy</span>
              </div>
              <div className="h-8 w-px bg-stone-700" />
              <div>
                <span className="text-xl font-bold block text-white tabular-nums">500,000+</span>
                <span>Boxes Delivered</span>
              </div>
              <div className="h-8 w-px bg-stone-700" />
              <div>
                <span className="text-xl font-bold block text-white tabular-nums">4.9 ★</span>
                <span>Customer Trust</span>
              </div>
            </div>
          </div>

          <div className="aspect-4/3 w-full h-full min-h-[260px] bg-stone-800 relative">
            <img
              src={royalMithaiImg}
              alt="Artisan sweets preparation"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
