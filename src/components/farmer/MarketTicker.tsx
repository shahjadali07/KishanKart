import React from 'react';

export function MarketTicker() {
  return (
    <div className="bg-[#0c2f23] text-emerald-50 py-1.5 overflow-hidden whitespace-nowrap text-[11px] font-medium tracking-wide">
      <div className="animate-marquee inline-block">
        <span className="mx-4 font-bold text-emerald-300 uppercase">APMC Mandi Prices:</span>
        <span className="mx-4">🍅 Tomato: ₹28/kg (↑ ₹2)</span>
        <span className="mx-4">🥔 Potato: ₹15/kg (▬)</span>
        <span className="mx-4">🧅 Red Onion: ₹45/kg (↓ ₹3)</span>
        <span className="mx-4 font-bold text-emerald-300 uppercase ml-12">Kisan Helpline: 1800-120-FARM</span>
        
        {/* Repeat for seamless loop */}
        <span className="mx-4 font-bold text-emerald-300 uppercase ml-12">APMC Mandi Prices:</span>
        <span className="mx-4">🍅 Tomato: ₹28/kg (↑ ₹2)</span>
        <span className="mx-4">🥔 Potato: ₹15/kg (▬)</span>
        <span className="mx-4">🧅 Red Onion: ₹45/kg (↓ ₹3)</span>
        <span className="mx-4 font-bold text-emerald-300 uppercase ml-12">Kisan Helpline: 1800-120-FARM</span>
      </div>
    </div>
  );
}
