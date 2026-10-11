'use client';

import React from 'react';
import { ShieldCheck, Landmark, Satellite } from 'lucide-react';

export function TrustBadges() {
  return (
    <div className="border-t border-b border-gray-200/80 bg-white py-3.5 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600 font-medium">
        
        {/* Left Trust Items */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0" />
            <span>100% Escrow Bank Protection <span className="text-gray-400 font-normal">(RBI Regulated)</span></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Landmark className="h-4 w-4 text-amber-700 shrink-0" />
            <span>Model APMC Mandi Acts Compliant</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Satellite className="h-4 w-4 text-amber-700 shrink-0" />
            <span>ISRO Bhuvan Soil Data Synced</span>
          </div>
        </div>

        {/* Right Partner Badges */}
        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold tracking-wide">
          <span>Digital India</span>
          <span className="text-gray-300">•</span>
          <span>e-NAM Integrated</span>
          <span className="text-gray-300">•</span>
          <span>NABARD Certified Partner</span>
        </div>

      </div>
    </div>
  );
}
