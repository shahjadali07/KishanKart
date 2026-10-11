'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function FairPriceGuarantee() {
  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/40 rounded-2xl p-5 text-gray-900 shadow-2xs border border-amber-200/80 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-2">
        <ShieldCheck className="h-4 w-4 text-amber-700" />
        <span>KisanKart Fair Price Guarantee</span>
      </div>

      <h4 className="text-sm font-bold text-gray-950 mb-3 tracking-tight">
        Direct Sale vs. Middleman Spread
      </h4>

      {/* Comparison Rows */}
      <div className="space-y-2 py-3 border-y border-amber-200/80 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Direct on KisanKart:</span>
          <span className="font-bold text-gray-950 text-sm">₹28.00 / kg</span>
        </div>

        <div className="flex justify-between items-center text-gray-400">
          <span>Local Mandi Middleman:</span>
          <span className="line-through text-gray-500">₹22.00 / kg</span>
        </div>

        <div className="flex justify-between items-center pt-1 font-bold text-amber-900">
          <span>Extra Earnings for Farmer:</span>
          <span className="bg-white/95 border border-amber-300 px-2 py-0.5 rounded text-[11px] text-[#994200] font-bold shadow-2xs">
            +₹6.00 / kg (+27%)
          </span>
        </div>
      </div>

      {/* Mandate Note */}
      <p className="text-[11px] text-gray-600 font-medium mt-3 leading-relaxed">
        Zero commission charged to verified farmers under the e-NAM Agri-Parishad mandate.
      </p>

    </div>
  );
}
