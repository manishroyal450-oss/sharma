import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, ShieldCheck, Sparkles } from 'lucide-react';
import { TESTIMONIALS } from '../data/confectioneryData';

export const TestimonialsSection: React.FC = () => {
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>(
    TESTIMONIALS.reduce((acc, t) => ({ ...acc, [t.id]: t.helpfulCount }), {})
  );
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const handleHelpfulClick = (id: string) => {
    if (!votedMap[id]) {
      setHelpfulVotes(prev => ({ ...prev, [id]: prev[id] + 1 }));
      setVotedMap(prev => ({ ...prev, [id]: true }));
    }
  };

  const ratingBars = [
    { star: 5, percent: 88 },
    { star: 4, percent: 9 },
    { star: 3, percent: 2 },
    { star: 2, percent: 1 },
    { star: 1, percent: 0 },
  ];

  return (
    <section id="testimonials-section" className="bg-stone-100 py-16 px-4 sm:px-6 border-t border-stone-200">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Amazon-Style Rating Summary Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-200 items-center">
          {/* Col 1: Average Rating */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Verified Buyer Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl font-black text-stone-900 tabular-nums">4.9</span>
              <div>
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-stone-500 mt-0.5 block">
                  3,420 global confectionery ratings
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Amazon Customer Purchases</span>
            </div>
          </div>

          {/* Col 2: Star Breakdown Bar Graph */}
          <div className="space-y-2 md:col-span-2 max-w-md">
            {ratingBars.map(bar => (
              <div key={bar.star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-stone-600 font-semibold">{bar.star} star</span>
                <div className="flex-1 h-3 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${bar.percent}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-stone-500 tabular-nums">
                  {bar.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map(t => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Author Info & Verified Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                        {t.author}
                      </h4>
                      <p className="text-[11px] text-stone-500">{t.city}</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Purchase</span>
                  </span>
                </div>

                {/* Rating & Review Title */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-stone-900">{t.title}</span>
                  </div>
                  <span className="text-[11px] text-stone-400">Reviewed in India on {t.date}</span>
                </div>

                {/* Verified Item Tag */}
                <div className="text-[11px] text-amber-900 bg-amber-50/80 px-2 py-1 rounded inline-block font-medium">
                  Sweet Reviewed: <span className="font-bold">{t.productName}</span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-stone-600 leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              {/* Helpful Votes Footer */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>{helpfulVotes[t.id]} people found this helpful</span>
                <button
                  onClick={() => handleHelpfulClick(t.id)}
                  disabled={votedMap[t.id]}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    votedMap[t.id]
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-stone-300 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{votedMap[t.id] ? 'Helpful' : 'Helpful'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
