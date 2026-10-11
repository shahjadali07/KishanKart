'use client';

import React from 'react';
import { IndianRupee, Layers, Truck, Sparkles, ChevronRight, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FarmerStatsProps {
  onWithdrawClick?: () => void;
  onViewPassClick?: () => void;
  onReviewDealsClick?: () => void;
}

export function FarmerStats({
  onWithdrawClick,
  onViewPassClick,
  onReviewDealsClick
}: FarmerStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Total Earnings */}
      <Card className="border border-gray-200/90 shadow-xs rounded-xl bg-white hover:border-amber-400 transition-all duration-200">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500">
                Total Earnings (This Season)
              </span>
              <div className="h-7 w-7 rounded-full bg-[#FDF4EA] text-amber-700 flex items-center justify-center">
                <IndianRupee className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
              ₹1,48,250
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
              <span>+18% vs APMC mandi benchmark</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500">
            <span>Auto-cleared via Escrow</span>
            <button
              type="button"
              onClick={onWithdrawClick}
              className="text-amber-800 hover:text-amber-950 font-semibold inline-flex items-center gap-0.5"
            >
              Withdraw UPI <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Active Produce Listed */}
      <Card className="border border-gray-200/90 shadow-xs rounded-xl bg-white hover:border-amber-400 transition-all duration-200">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500">
                Active Produce Listed
              </span>
              <div className="h-7 w-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
                <Layers className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
              4 Crops
            </div>

            <div className="text-xs font-medium text-gray-500 mt-1">
              1,250 kg in farm-gate storage ready
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500">
            <span>All lots QC-inspected</span>
            <span className="text-gray-700 font-semibold">4 Active Lots</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Pending Orders & Bids */}
      <Card className="border border-gray-200/90 shadow-xs rounded-xl bg-white hover:border-amber-400 transition-all duration-200">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500">
                Pending Orders & Bids
              </span>
              <div className="h-7 w-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                <Truck className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
                2 Orders
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Dispatch Ready
              </span>
            </div>

            <div className="text-xs font-medium text-gray-500 mt-1">
              Pickup by Tata Ace vehicle today
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500">
            <span>Arrival: 2:30 PM Today</span>
            <button
              type="button"
              onClick={onViewPassClick}
              className="text-amber-800 hover:text-amber-950 font-semibold inline-flex items-center gap-0.5"
            >
              View Pass <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Smart Matches */}
      <Card className="border border-gray-200/90 shadow-xs rounded-xl bg-white hover:border-amber-400 transition-all duration-200">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500">
                Smart Matches
              </span>
              <div className="h-7 w-7 rounded-full bg-[#FDF4EA] text-amber-700 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
                5 Buyers
              </span>
              <span className="text-xs font-semibold text-gray-500">within 15 km</span>
            </div>

            <div className="text-xs font-medium text-gray-500 mt-1">
              Matching Tomato & Chipsona stocks
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500">
            <span>Highest match: 96%</span>
            <button
              type="button"
              onClick={onReviewDealsClick}
              className="text-amber-800 hover:text-amber-950 font-semibold inline-flex items-center gap-0.5"
            >
              Review Deals <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
