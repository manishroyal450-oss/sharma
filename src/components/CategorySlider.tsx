import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CategoryKey } from '../types/confectionery';
import { CATEGORIES } from '../data/confectioneryData';

interface CategorySliderProps {
  activeCategory: CategoryKey;
  onSelectCategory: (key: CategoryKey) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-stone-900 border-b border-stone-800 text-white py-4 px-3 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <h2 className="text-sm sm:text-base font-bold text-stone-100 tracking-tight font-serif uppercase">
              Explore Confectionery Categories
            </h2>
            <span className="hidden sm:inline text-xs text-stone-400 font-normal">
              · Slide to browse Belgian Chocolates, Royal Mithai & Hampers
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer shadow border border-stone-700 active:scale-95"
              aria-label="Slide Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer shadow border border-stone-700 active:scale-95"
              aria-label="Slide Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Category Slide Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {/* "All" Category Tile */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`shrink-0 w-36 sm:w-44 h-40 rounded-xl p-3 flex flex-col justify-between text-left transition-all duration-300 cursor-pointer border relative overflow-hidden group ${
              activeCategory === 'all'
                ? 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-400 shadow-lg shadow-amber-900/40 scale-[1.02]'
                : 'bg-stone-800/80 hover:bg-stone-800 border-stone-700 hover:border-stone-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">✨</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/30 text-amber-200">
                Catalogue
              </span>
            </div>
            <div>
              <p className="font-bold text-sm text-white group-hover:text-amber-200 transition-colors">
                All Collections
              </p>
              <p className="text-[11px] text-stone-300">सभी वैरायटी देखें</p>
              <p className="text-[10px] text-amber-300 font-semibold mt-1">200+ Fresh Items</p>
            </div>
          </button>

          {/* Individual Category Cards with Photo & Micro Badges */}
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => onSelectCategory(cat.key)}
                className={`shrink-0 w-44 sm:w-56 h-40 rounded-xl p-3.5 flex flex-col justify-between text-left transition-all duration-300 cursor-pointer border relative overflow-hidden group ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-500/50 shadow-xl shadow-amber-950/60 scale-[1.02]'
                    : 'border-stone-800 hover:border-stone-600 bg-stone-800/90 hover:bg-stone-800'
                }`}
              >
                {/* Background ambient image layer with subtle dark scrim */}
                <div className="absolute inset-0 z-0 opacity-25 group-hover:opacity-35 transition-opacity">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent" />
                </div>

                {/* Top Row: Icon + Items count */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-stone-900/80 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner border border-stone-700">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-black/50 text-stone-300 backdrop-blur-xs">
                    {cat.itemCount} items
                  </span>
                </div>

                {/* Bottom Row: Title + Hindi Subtitle */}
                <div className="relative z-10">
                  <h3 className={`font-bold text-sm leading-tight transition-colors ${
                    isSelected ? 'text-amber-400' : 'text-stone-100 group-hover:text-amber-300'
                  }`}>
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                    {cat.hindiName}
                  </p>
                  <p className="text-[10px] text-stone-300/80 line-clamp-1 mt-1 font-light">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
