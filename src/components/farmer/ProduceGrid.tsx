'use client';

import React from 'react';
import { SlidersHorizontal, Plus, Clock, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProduceGridProps {
  onAddCropClick?: () => void;
  onUpdateStockClick?: (cropName: string) => void;
  onModifyRateClick?: (cropName: string) => void;
  onViewOrdersClick?: (cropName: string) => void;
  onViewInquiriesClick?: (cropName: string) => void;
}

export function ProduceGrid({
  onAddCropClick,
  onUpdateStockClick,
  onModifyRateClick,
  onViewOrdersClick,
  onViewInquiriesClick
}: ProduceGridProps) {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="text-xl">🌾</span>
            <span>My Listed Produce</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Crops active in Lucknow mandi digital trading floor
          </p>
        </div>

        <button
          type="button"
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-amber-50/50 transition-colors shadow-2xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />
          <span>Filter Lots</span>
        </button>
      </div>

      {/* 2x2 Produce Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
        
        {/* Card 1: Red Hybrid Tomatoes */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 group relative overflow-hidden">
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-50 to-amber-50/50 border border-red-100/70 flex items-center justify-center text-2xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                  🍅
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#994200] transition-colors leading-tight">
                    Red Hybrid Tomatoes
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block px-1.5 py-0.2 rounded bg-stone-100 text-[10px] font-bold text-stone-700">Grade A</span>
                    <span>• Plucked yesterday</span>
                  </p>
                </div>
              </div>

              <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live & Matching</span>
              </span>
            </div>

            {/* Metrics Panel */}
            <div className="bg-stone-50/80 border border-stone-200/60 rounded-xl p-3 grid grid-cols-2 gap-3 my-3.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-0.5">
                  Available Lot
                </span>
                <span className="text-base font-extrabold text-stone-900">
                  500 <span className="text-xs font-semibold text-stone-500">kg</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-0.5">
                  Asking Rate
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-[#994200]">
                    ₹28
                  </span>
                  <span className="text-xs font-medium text-stone-500">/ kg</span>
                </div>
              </div>
            </div>

            {/* APMC Benchmark Note */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-900 bg-amber-50/80 border border-amber-200/60 px-3 py-2 rounded-xl mb-4">
              <Zap className="h-4 w-4 text-amber-600 shrink-0" />
              <span>APMC benchmark rate: <strong>₹26/kg</strong> (+₹2/kg premium)</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              variant="outline"
              onClick={() => onUpdateStockClick?.('Red Hybrid Tomatoes')}
              className="text-xs h-9 font-bold border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-700 rounded-xl transition-all active:scale-[0.98]"
            >
              Update Stock
            </Button>
            <Button
              onClick={() => onViewInquiriesClick?.('Red Hybrid Tomatoes')}
              className="text-xs h-9 font-bold bg-[#994200] hover:bg-[#7A3400] text-white rounded-xl shadow-xs hover:shadow-md hover:shadow-amber-900/15 transition-all active:scale-[0.98]"
            >
              View Inquiries (3)
            </Button>
          </div>
        </div>

        {/* Card 2: Chipsona Potatoes */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 group relative overflow-hidden">
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100/70 flex items-center justify-center text-2xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                  🥔
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#994200] transition-colors leading-tight">
                    Chipsona Potatoes
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block px-1.5 py-0.2 rounded bg-amber-100/70 text-[10px] font-bold text-amber-900">Processing Grade</span>
                    <span>• Cured & sorted</span>
                  </p>
                </div>
              </div>

              <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span>2 Orders Pending</span>
              </span>
            </div>

            {/* Metrics Panel */}
            <div className="bg-stone-50/80 border border-stone-200/60 rounded-xl p-3 grid grid-cols-2 gap-3 my-3.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-0.5">
                  Available Lot
                </span>
                <span className="text-base font-extrabold text-stone-900">
                  1,200 <span className="text-xs font-semibold text-stone-500">kg</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-0.5">
                  Asking Rate
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-[#994200]">
                    ₹19
                  </span>
                  <span className="text-xs font-medium text-stone-500">/ kg</span>
                </div>
              </div>
            </div>

            {/* Buyer Dispatch Note */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-900 bg-amber-50/70 border border-amber-200/60 px-3 py-2 rounded-xl mb-4">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Haldiram buyer dispatch arriving today at <strong>2:30 PM</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              variant="outline"
              onClick={() => onModifyRateClick?.('Chipsona Potatoes')}
              className="text-xs h-9 font-bold border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-700 rounded-xl transition-all active:scale-[0.98]"
            >
              Modify Rate
            </Button>
            <Button
              onClick={() => onViewOrdersClick?.('Chipsona Potatoes')}
              className="text-xs h-9 font-bold bg-[#994200] hover:bg-[#7A3400] text-white rounded-xl shadow-xs hover:shadow-md hover:shadow-amber-900/15 transition-all active:scale-[0.98]"
            >
              Review 2 Orders
            </Button>
          </div>
        </div>

        {/* Card 3: Fresh Green Peas */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 group relative overflow-hidden">
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100/70 flex items-center justify-center text-2xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                  🫛
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#994200] transition-colors leading-tight">
                    Fresh Green Peas
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100/70 text-[10px] font-bold text-emerald-900">Tender Pods</span>
                    <span>• Harvested 5 AM</span>
                  </p>
                </div>
              </div>

              <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live & Matching</span>
              </span>
            </div>

            {/* Metrics Panel */}
            <div className="bg-stone-50/80 border border-stone-200/60 rounded-xl p-3 grid grid-cols-2 gap-3 my-3.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-0.5">
                  Available Lot
                </span>
                <span className="text-base font-extrabold text-stone-900">
                  350 <span className="text-xs font-semibold text-stone-500">kg</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-0.5">
                  Asking Rate
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-[#994200]">
                    ₹42
                  </span>
                  <span className="text-xs font-medium text-stone-500">/ kg</span>
                </div>
              </div>
            </div>

            {/* Fast Turnover Note */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-900 bg-amber-50/80 border border-amber-200/60 px-3 py-2 rounded-xl mb-4">
              <Zap className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Fast turnover item • <strong>High restaurant demand</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              variant="outline"
              onClick={() => onUpdateStockClick?.('Fresh Green Peas')}
              className="text-xs h-9 font-bold border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-700 rounded-xl transition-all active:scale-[0.98]"
            >
              Update Stock
            </Button>
            <Button
              onClick={() => onViewInquiriesClick?.('Fresh Green Peas')}
              className="text-xs h-9 font-bold bg-[#994200] hover:bg-[#7A3400] text-white rounded-xl shadow-xs hover:shadow-md hover:shadow-amber-900/15 transition-all active:scale-[0.98]"
            >
              Match Buyers
            </Button>
          </div>
        </div>

        {/* Card 4: Sharbati Golden Wheat */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 group relative overflow-hidden">
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50/60 border border-amber-100/70 flex items-center justify-center text-2xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                  🌾
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#994200] transition-colors leading-tight">
                    Sharbati Golden Wheat
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <span className="inline-block px-1.5 py-0.2 rounded bg-amber-100/70 text-[10px] font-bold text-amber-900">Moisture &lt; 10%</span>
                    <span>• Silo Tested</span>
                  </p>
                </div>
              </div>

              <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400"></span>
                <span>Warehouse</span>
              </span>
            </div>

            {/* Metrics Panel */}
            <div className="bg-stone-50/80 border border-stone-200/60 rounded-xl p-3 grid grid-cols-2 gap-3 my-3.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-0.5">
                  Available Lot
                </span>
                <span className="text-base font-extrabold text-stone-900">
                  2,500 <span className="text-xs font-semibold text-stone-500">kg</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-0.5">
                  Asking Rate
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-[#994200]">
                    ₹24
                  </span>
                  <span className="text-xs font-medium text-stone-500">/ kg</span>
                </div>
              </div>
            </div>

            {/* Silo Location Note */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-600 bg-stone-50 border border-stone-200/60 px-3 py-2 rounded-xl mb-4">
              <Building2 className="h-4 w-4 text-stone-500 shrink-0" />
              <span>Stored at <strong>Mandi Grameen Silo #3</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              variant="outline"
              className="text-xs h-9 font-bold border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-700 rounded-xl transition-all active:scale-[0.98]"
            >
              Warehouse Slip
            </Button>
            <Button
              className="text-xs h-9 font-bold bg-[#994200] hover:bg-[#7A3400] text-white rounded-xl shadow-xs hover:shadow-md hover:shadow-amber-900/15 transition-all active:scale-[0.98]"
            >
              Offer to Mills
            </Button>
          </div>
        </div>

      </div>

      {/* Harvest More Crops CTA Card */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-[#FDF4EA] text-[#8C3A00] flex items-center justify-center shrink-0">
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Harvesting more crops this week?
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              List mustard, garlic, or cauliflower to lock advance purchase agreements.
            </p>
          </div>
        </div>

        <Button
          onClick={onAddCropClick}
          className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-semibold h-8.5 px-4 rounded-lg shrink-0"
        >
          + Add Another Crop
        </Button>
      </div>
    </section>
  );
}
