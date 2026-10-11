'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingBag } from 'lucide-react';

type TimeframeOption = '7D' | '30D' | '3M' | '1Y';

interface FarmerSalesChartProps {
  onTimeframeChange?: (timeframe: TimeframeOption) => void;
}

const mockChartData: Record<TimeframeOption, { label: string; revenue: number; orders: number }[]> = {
  '7D': [
    { label: 'Mon', revenue: 14500, orders: 2 },
    { label: 'Tue', revenue: 21800, orders: 3 },
    { label: 'Wed', revenue: 18400, orders: 2 },
    { label: 'Thu', revenue: 32000, orders: 4 },
    { label: 'Fri', revenue: 28900, orders: 3 },
    { label: 'Sat', revenue: 38650, orders: 5 },
    { label: 'Sun', revenue: 26500, orders: 3 }
  ],
  '30D': [
    { label: 'Week 1', revenue: 98000, orders: 12 },
    { label: 'Week 2', revenue: 114500, orders: 15 },
    { label: 'Week 3', revenue: 132000, orders: 18 },
    { label: 'Week 4', revenue: 148250, orders: 20 }
  ],
  '3M': [
    { label: 'Aug', revenue: 320000, orders: 42 },
    { label: 'Sep', revenue: 385000, orders: 51 },
    { label: 'Oct', revenue: 448000, orders: 58 }
  ],
  '1Y': [
    { label: 'Q1 (Kharif)', revenue: 640000, orders: 85 },
    { label: 'Q2 (Post-Harvest)', revenue: 890000, orders: 118 },
    { label: 'Q3 (Rabi Sowing)', revenue: 780000, orders: 98 },
    { label: 'Q4 (Peak Mandi)', revenue: 1120000, orders: 145 }
  ]
};

export function FarmerSalesChart({ onTimeframeChange }: FarmerSalesChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7D');
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders'>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = mockChartData[timeframe];
  const maxValue =
    Math.max(...data.map((d) => (activeMetric === 'revenue' ? d.revenue : d.orders))) * 1.18;

  const totalPeriodRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalPeriodOrders = data.reduce((sum, d) => sum + d.orders, 0);

  const handleSelectTimeframe = (tf: TimeframeOption) => {
    setTimeframe(tf);
    onTimeframeChange?.(tf);
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-5">
      {/* Top Header & Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight flex items-center gap-2">
            <span>Sales & Revenue Analytics</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
              <TrendingUp className="h-3 w-3" />
              +18.4% growth
            </span>
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Verified farm-gate dispatches settled through KisanKart Escrow
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex p-0.5 bg-gray-100 rounded-xl border border-gray-200/80 text-xs">
            <button
              onClick={() => setActiveMetric('revenue')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                activeMetric === 'revenue'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Revenue (₹)
            </button>
            <button
              onClick={() => setActiveMetric('orders')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                activeMetric === 'orders'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Orders
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex p-0.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs">
            {(['7D', '30D', '3M', '1Y'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                onClick={() => handleSelectTimeframe(tf)}
                className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-[#994200] text-white shadow-2xs'
                    : 'text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                {tf === '7D' ? '7 Days' : tf === '30D' ? '30 Days' : tf === '3M' ? '3 Months' : '1 Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Snippet */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50/70 rounded-xl border border-gray-200/60 text-xs">
        <div>
          <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">
            Period Revenue
          </span>
          <span className="text-base font-extrabold text-gray-900">
            ₹{totalPeriodRevenue.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">
            Total Lots Dispatched
          </span>
          <span className="text-base font-extrabold text-gray-900">
            {totalPeriodOrders} Orders
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">
            Average Lot Value
          </span>
          <span className="text-base font-extrabold text-[#994200]">
            ₹{totalPeriodOrders > 0 ? Math.round(totalPeriodRevenue / totalPeriodOrders).toLocaleString('en-IN') : 0}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-6 pb-2">
        {/* Dynamic Tooltip on Hover */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-0 z-20 bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg shadow-lg pointer-events-none transition-all duration-150 transform -translate-x-1/2"
            style={{
              left: `${((hoveredIndex + 0.5) / data.length) * 100}%`
            }}
          >
            <span className="font-bold text-amber-300">
              {activeMetric === 'revenue'
                ? `₹${data[hoveredIndex].revenue.toLocaleString('en-IN')}`
                : `${data[hoveredIndex].orders} Orders`}
            </span>
            <span className="text-gray-400 ml-1">({data[hoveredIndex].label})</span>
          </div>
        )}

        {/* Bar Visualization */}
        <div className="h-44 sm:h-52 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-gray-200">
          {data.map((item, idx) => {
            const val = activeMetric === 'revenue' ? item.revenue : item.orders;
            const heightPercent = Math.max(10, Math.min(100, (val / maxValue) * 100));
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative ${
                    isHovered
                      ? 'bg-gradient-to-t from-[#7A3400] to-[#994200] shadow-md scale-y-102'
                      : 'bg-gradient-to-t from-amber-200 to-[#994200]/80 hover:from-amber-300 hover:to-[#994200]'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Subtle top cap */}
                  <div className="h-1 w-full bg-white/40 rounded-t-xl" />
                </div>
                <span
                  className={`text-[11px] font-medium mt-2 transition-colors ${
                    isHovered ? 'text-gray-900 font-bold' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
