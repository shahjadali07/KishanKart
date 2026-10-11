'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Phone, Radio, Sparkles } from 'lucide-react';

export function MarketTicker() {
  const tickerItems = [
    { name: 'Tomato Desi (Lucknow APMC)', price: '₹26/kg', change: '+2.4%', isUp: true },
    { name: 'Potato Chipsona (Kanpur Mandi)', price: '₹19/kg', change: '-1.1%', isUp: false },
    { name: 'Sharbati Wheat (Gorakhpur)', price: '₹2,450/qtl', change: '+1.8%', isUp: true },
    { name: 'Basmati Paddy 1121 (Karnal)', price: '₹3,820/qtl', change: '+3.2%', isUp: true },
    { name: 'Red Onion (Lasalgaon Hub)', price: '₹32/kg', change: '+4.5%', isUp: true },
    { name: 'Yellow Mustard Sarson (Sehore)', price: '₹5,650/qtl', change: '+0.9%', isUp: true },
    { name: 'Green Chilli Teja (Guntur APMC)', price: '₹72/kg', change: '-2.0%', isUp: false },
    { name: 'Cauliflower Hybrid (Lucknow)', price: '₹34/kg', change: '+1.5%', isUp: true },
    { name: 'Chana Desi (Indore Mandi)', price: '₹5,900/qtl', change: '+2.1%', isUp: true },
    { name: 'Garlic Desi (Mandsaur)', price: '₹140/kg', change: '+5.4%', isUp: true }
  ];

  // Marquee component cast for TypeScript compatibility in React JSX
  const MarqueeTag = 'marquee' as any;
  const marqueeRef = React.useRef<any>(null);

  const handleMouseEnter = () => {
    marqueeRef.current?.stop?.();
  };

  const handleMouseLeave = () => {
    marqueeRef.current?.start?.();
  };

  return (
    <div className="bg-[#2A160A] text-amber-100 text-[11px] font-medium border-b border-amber-950/40 select-none relative z-30">
      <div className="w-full px-3 sm:px-4 lg:px-6 h-9 flex items-center justify-between gap-3 overflow-hidden">

        {/* Left Fixed Badge: LIVE APMC TICKER */}
        <div className="flex items-center gap-1.5 shrink-0 bg-amber-900/70 text-amber-300 font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider shadow-xs border border-amber-700/40 z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          {/* <span>LIVE APMC TICKER</span> */}
        </div>

        {/* Center Marquee: Scrolling right to left */}
        <div 
          className="flex-1 overflow-hidden relative flex items-center min-w-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Subtle left gradient mask */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#2A160A] to-transparent z-10 pointer-events-none" />

          {/* Marquee tag with rich commodities */}
          <MarqueeTag
            ref={marqueeRef}
            behavior="scroll"
            direction="left"
            scrollamount="10"
            className="w-full whitespace-nowrap text-xs text-amber-100/90 py-0.5 cursor-pointer"
          >
            <span className="inline-flex items-center space-x-8 sm:space-x-12 pr-12">
              {tickerItems.map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5">
                  <span className="text-amber-200/80 font-medium">{item.name}:</span>
                  <span className="font-bold text-white">{item.price}</span>
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-1 py-0.2 rounded ${item.isUp
                      ? 'text-amber-400 bg-amber-950/70 border border-amber-800/40'
                      : 'text-rose-400 bg-rose-950/70 border border-rose-800/40'
                      }`}
                  >
                    {item.isUp ? (
                      <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                    )}
                    {item.change}
                  </span>
                </span>
              ))}
            </span>
          </MarqueeTag>

          {/* Subtle right gradient mask */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#2A160A] to-transparent z-10 pointer-events-none" />
        </div>

        {/* Right Fixed Corner: Kisan Helpline 1800-180-1551 (Remains permanently fixed) */}
        <div className="flex items-center gap-1.5 shrink-0 text-[11px] sm:text-xs text-amber-300 font-medium pl-3 pr-1 py-0.5 bg-[#2A160A] z-20 border-l border-amber-900/40 shadow-[-8px_0_12px_#2A160A]">
          <Phone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="hidden sm:inline text-amber-200/90">Kisan Helpline:</span>
          <a
            href="tel:18001801551"
            className="font-bold text-white hover:text-amber-200 transition-colors tracking-tight whitespace-nowrap"
          >
            1800-180-1551
          </a>
        </div>

      </div>
    </div>
  );
}
