'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { AIInsight } from '@/types/admin';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Flame,
  Calendar,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Info,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    const list = await adminService.getAIInsights();
    setInsights(list);
    setLoading(false);
  };

  const filtered = insights.filter((i) => {
    return filterType === 'ALL' || i.type === filterType;
  });

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'DEMAND_SURGE':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'SUPPLY_SHORTAGE':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'PRICE_VOLATILITY':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'SEASONAL_HARVEST':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'DEMAND_SURGE':
        return <Flame className="w-5 h-5 text-amber-700" />;
      case 'SUPPLY_SHORTAGE':
        return <AlertTriangle className="w-5 h-5 text-red-700" />;
      case 'PRICE_VOLATILITY':
        return <TrendingUp className="w-5 h-5 text-purple-700" />;
      case 'SEASONAL_HARVEST':
        return <Calendar className="w-5 h-5 text-emerald-700" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-700" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-700" />
              <h1 className="text-2xl font-bold text-gray-900">Agri-Intelligence & Predictive Insights</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Anticipate crop harvest arrivals, wholesale demand shocks, mandi price volatility, and supply bottlenecks
            </p>
          </div>
          <button
            onClick={loadInsights}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Intelligence Feed
          </button>
        </div>

        {/* Demo / Sandbox Disclaimer Banner */}
        <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 space-y-1">
            <p className="font-bold">
              Notice: Mock / Sandbox Agricultural Intelligence Engine
            </p>
            <p className="leading-relaxed text-amber-900/90">
              The forecasts, price sensitivity estimates, and supply shortage alerts shown below are generated from simulated mandi historical datasets for architecture validation. The backend contract has been structured in <code className="px-1 py-0.5 bg-amber-200/50 rounded font-mono text-[11px]">adminService.getAIInsights()</code> to connect seamlessly to Python microservices or ICAR/AGMARKNET ML pipelines.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Predictions' },
            { id: 'DEMAND_SURGE', label: 'Demand Surge' },
            { id: 'SUPPLY_SHORTAGE', label: 'Supply Shortages' },
            { id: 'PRICE_VOLATILITY', label: 'Price Volatility' },
            { id: 'SEASONAL_HARVEST', label: 'Seasonal Arrivals' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === tab.id
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid of Predictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900">{item.crop}</span>
                      <p className="text-[11px] text-gray-400">Target Horizon: {item.timeframe}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getBadgeStyle(item.type)}`}>
                    {item.type.replace(/_/g, ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{item.headline}</h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{item.prediction}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-700">
                  <strong className="text-gray-900">Recommended Admin Action:</strong> {item.suggestedAction}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Model Confidence:</span>
                    <span className="font-bold text-amber-800">{item.confidenceScore}%</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    DEMO MODEL
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 text-sm">
              No insights found for this category.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
