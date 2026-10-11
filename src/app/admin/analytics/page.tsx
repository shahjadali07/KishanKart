'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SalesChart } from '@/components/admin/SalesChart';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  IndianRupee,
  Package,
  Award,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('30D');

  const topCrops = [
    { name: 'Sharbati Premium Wheat', volume: '14,200 Qtl', revenue: '₹4.54 Cr', share: 38 },
    { name: 'Basmati Paddy (Pusa 1121)', volume: '9,800 Qtl', revenue: '₹3.72 Cr', share: 29 },
    { name: 'Red Hybrid Tomatoes', volume: '6,400 Qtl', revenue: '₹1.15 Cr', share: 16 },
    { name: 'Yellow Mustard Seeds', volume: '4,100 Qtl', revenue: '₹2.17 Cr', share: 11 },
    { name: 'Chipsona Potatoes', volume: '2,800 Qtl', revenue: '₹44.8 L', share: 6 },
  ];

  const topFarmersList = [
    { name: 'Ramvilas Yadav', state: 'Uttar Pradesh', sales: '₹18.4L', orders: 48, rating: '4.9' },
    { name: 'Balvinder Singh', state: 'Punjab', sales: '₹24.6L', orders: 52, rating: '5.0' },
    { name: 'Hariram Gurjar', state: 'Rajasthan', sales: '₹11.2L', orders: 31, rating: '4.8' },
    { name: 'Sanjay Deshmukh', state: 'Maharashtra', sales: '₹16.8L', orders: 44, rating: '4.9' },
    { name: 'Dharmendra Kumar', state: 'Bihar', sales: '₹9.4L', orders: 26, rating: '4.7' },
  ];

  const monthlyRunRate = [
    { month: 'Oct 2026', revenue: '₹18.4L', orders: 342, growth: '+14%' },
    { month: 'Sep 2026', revenue: '₹16.1L', orders: 298, growth: '+9%' },
    { month: 'Aug 2026', revenue: '₹14.8L', orders: 271, growth: '+12%' },
    { month: 'Jul 2026', revenue: '₹13.2L', orders: 240, growth: '+7%' },
    { month: 'Jun 2026', revenue: '₹12.3L', orders: 224, growth: '+11%' },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mandi Analytics & Economic Performance</h1>
            <p className="text-xs text-gray-500 mt-1">
              Deep-dive metrics across platform volume, category liquidity, producer margins and ticket sizes
            </p>
          </div>

          {/* Timeframe Filter */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
            {(['7D', '30D', '3M', '6M', '1Y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  timeRange === range
                    ? 'bg-white text-amber-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Core Financial & Ecosystem KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Average Order Value (AOV)</span>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900">₹72,400</span>
              <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +8.4% bulk lot index
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Producer Onboarding Growth</span>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900">+128 Farmers</span>
              <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +19% vs previous window
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Enterprise Buyers Active</span>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900">64 FPOs & Mills</span>
              <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> 92% re-procurement rate
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Produce Catalog Expansion</span>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900">418 Active Lots</span>
              <p className="text-xs text-gray-500 mt-1 font-medium">9 Mandi commodity tiers</p>
            </div>
          </div>
        </div>

        {/* Sales & Liquidity Chart */}
        <SalesChart />

        {/* Detailed Breakdown Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Sold Produce Commodities */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" />
                <h2 className="font-bold text-gray-900 text-sm">Most Traded Produce Lots (By Volume & Value)</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">Top 5</span>
            </div>
            <div className="space-y-4">
              {topCrops.map((crop, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-900">{crop.name}</span>
                    <span className="text-gray-600">{crop.volume} • <strong className="text-amber-800">{crop.revenue}</strong></span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-700 h-full rounded-full transition-all duration-500"
                      style={{ width: `${crop.share}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Producing Farmers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <h2 className="font-bold text-gray-900 text-sm">Top Performing Farmers (Gross Sales)</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">Verified Mandi Stars</span>
            </div>
            <div className="divide-y divide-gray-100">
              {topFarmersList.map((f, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-gray-900">{f.name}</p>
                    <p className="text-gray-400">{f.state} • {f.orders} Mandi Deliveries</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-800">{f.sales}</p>
                    <p className="text-amber-700 font-medium">★ {f.rating} Rating</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Run Rate */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              <h2 className="font-bold text-gray-900 text-sm">Monthly Platform Revenue Run-Rate</h2>
            </div>
            <span className="text-xs text-gray-500">FY 2026-27</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Calendar Month</th>
                  <th className="px-6 py-3">Commission Revenue</th>
                  <th className="px-6 py-3">Completed Mandi Lots</th>
                  <th className="px-6 py-3">Month-on-Month Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {monthlyRunRate.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3.5 font-bold text-gray-900">{row.month}</td>
                    <td className="px-6 py-3.5 font-bold text-amber-800">{row.revenue}</td>
                    <td className="px-6 py-3.5 text-gray-600">{row.orders} Orders</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-700">{row.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
