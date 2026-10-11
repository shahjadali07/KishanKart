'use client';

import React, { useState } from 'react';

interface SalesChartProps {
  timeframe: '7D' | '30D' | '3M' | '1Y';
}

const mockChartData: Record<'7D' | '30D' | '3M' | '1Y', { label: string; revenue: number; orders: number }[]> = {
  '7D': [
    { label: 'Mon', revenue: 142000, orders: 48 },
    { label: 'Tue', revenue: 168000, orders: 54 },
    { label: 'Wed', revenue: 154000, orders: 51 },
    { label: 'Thu', revenue: 189000, orders: 62 },
    { label: 'Fri', revenue: 215000, orders: 74 },
    { label: 'Sat', revenue: 248000, orders: 88 },
    { label: 'Sun', revenue: 184500, orders: 65 },
  ],
  '30D': [
    { label: 'Week 1', revenue: 980000, orders: 340 },
    { label: 'Week 2', revenue: 1120000, orders: 390 },
    { label: 'Week 3', revenue: 1250000, orders: 420 },
    { label: 'Week 4', revenue: 1428500, orders: 495 },
  ],
  '3M': [
    { label: 'Dec 24', revenue: 3850000, orders: 1280 },
    { label: 'Jan 25', revenue: 4210000, orders: 1420 },
    { label: 'Feb 25', revenue: 4780000, orders: 1610 },
  ],
  '1Y': [
    { label: 'Q1', revenue: 8400000, orders: 2800 },
    { label: 'Q2', revenue: 10200000, orders: 3400 },
    { label: 'Q3', revenue: 12100000, orders: 4100 },
    { label: 'Q4', revenue: 14500000, orders: 4900 },
  ],
};

export function SalesChart() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M' | '1Y'>('7D');
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders'>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = mockChartData[timeframe];
  const maxValue = Math.max(...data.map(d => activeMetric === 'revenue' ? d.revenue : d.orders)) * 1.15;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-5">
      {/* Top Header & Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            Marketplace Sourcing & Sales Analytics
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Realtime APMC disintermediation volume across farm-gates
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center p-0.5 rounded-lg bg-gray-100 border border-gray-200 text-xs font-semibold">
            <button
              onClick={() => setActiveMetric('revenue')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeMetric === 'revenue'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveMetric('orders')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeMetric === 'orders'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Orders
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center p-0.5 rounded-lg bg-gray-100 border border-gray-200 text-xs font-semibold">
            {(['7D', '30D', '3M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-md transition-all ${
                  timeframe === tf
                    ? 'bg-[#994200] text-white shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Responsive Area & Bar Hybrid Chart */}
      <div className="h-60 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-gray-100 relative">
        {data.map((item, idx) => {
          const val = activeMetric === 'revenue' ? item.revenue : item.orders;
          const heightPercent = Math.max(12, Math.round((val / maxValue) * 100));
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-xl bg-gray-900 text-white text-[11px] font-bold shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
                  {activeMetric === 'revenue' ? `₹${item.revenue.toLocaleString('en-IN')}` : `${item.orders} Orders`}
                  <span className="text-gray-400 font-normal block text-[9px]">{item.label}</span>
                </div>
              )}

              {/* Bar element with subtle amber gradient */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative ${
                  isHovered
                    ? 'bg-[#994200] shadow-md shadow-amber-900/20'
                    : 'bg-gradient-to-t from-amber-200/90 to-amber-500/80 hover:from-amber-400 hover:to-amber-600'
                }`}
              >
                {/* Visual bar cap line */}
                <div className="h-1 w-full bg-amber-600 rounded-t-xl" />
              </div>

              {/* X Axis Label */}
              <span className="text-[11px] font-semibold text-gray-500 mt-2 truncate max-w-full">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend & Summary Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Aggregated Mandi Volume
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-[#994200]" />
            Direct Farm-Gate Settlements
          </span>
        </div>

        <span className="font-semibold text-amber-900">
          Peak Volume: ₹{(Math.max(...data.map(d => d.revenue))).toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}
