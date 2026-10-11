'use client';

import React from 'react';
import { Sparkles, Check, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SmartMatchEngineProps {
  onLockDealClick?: () => void;
}

export function SmartMatchEngine({ onLockDealClick }: SmartMatchEngineProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs hover:border-amber-400 transition-all duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 tracking-wider uppercase">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>SMART MATCH ENGINE</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200/80">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
          <span>96% Match</span>
        </span>
      </div>

      {/* Buyer info */}
      <div className="mb-3.5">
        <h3 className="text-base font-bold text-gray-900 leading-tight">
          Patanjali Fresh Outlet
        </h3>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Aliganj Distribution Point (11 km from your gate)
        </p>
      </div>

      {/* Offer Highlight Box */}
      <div className="bg-[#FDF4EA]/90 border border-amber-200 rounded-xl p-3.5 mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-amber-950">
            Target Lot: <strong className="text-gray-900">Tomatoes 400 kg</strong>
          </span>
          <span className="text-xl font-black text-amber-950">
            ₹29.00 <span className="text-xs font-semibold text-amber-800">/ kg</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 mt-2 pt-2 border-t border-amber-200/80">
          <Lock className="h-3 w-3 text-amber-700 shrink-0" />
          <span>Guaranteed ICICI Escrow Protected</span>
        </div>
      </div>

      {/* Verification Metrics */}
      <div className="space-y-2 mb-4">
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
          VERIFICATION METRICS:
        </span>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <Check className="h-3.5 w-3.5 text-amber-600 stroke-[2.5] shrink-0" />
          <span>Price: <strong className="text-gray-900">₹29 vs Asking ₹28</strong> <span className="text-amber-700 font-semibold">(+3.5%)</span></span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <Check className="h-3.5 w-3.5 text-amber-600 stroke-[2.5] shrink-0" />
          <span>Distance: <strong className="text-gray-900">11 km</strong> (&lt; 15 km limit)</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <Check className="h-3.5 w-3.5 text-amber-600 stroke-[2.5] shrink-0" />
          <span>Quality Grade: <strong className="text-gray-900">Grade A Lab Verified</strong></span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <Check className="h-3.5 w-3.5 text-amber-600 stroke-[2.5] shrink-0" />
          <span>Quantity Fit: <strong className="text-gray-900">400 kg fits your 500 kg lot</strong></span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <Check className="h-3.5 w-3.5 text-amber-600 stroke-[2.5] shrink-0" />
          <span>Payment: <strong className="text-gray-900">Immediate Escrow Lock</strong></span>
        </div>
      </div>

      {/* Action CTA */}
      <Button
        onClick={onLockDealClick}
        className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-semibold text-xs h-9 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all duration-200"
      >
        <span>View Buyer & Lock Deal</span>
        <Lock className="h-3.5 w-3.5 text-amber-200" />
      </Button>

    </div>
  );
}
