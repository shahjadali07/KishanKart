'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import { FarmerProduct } from '@/types/farmer';
import {
  Layers,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  History,
  TrendingDown,
  RefreshCw,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FarmerInventoryPage() {
  const { products, stockHistory, updateStock, adjustStock } = useFarmer();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<FarmerProduct | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('50');
  const [adjustReason, setAdjustReason] = useState<string>('Harvest Lot Arrival');

  // Inventory Totals
  const totalStock = products.reduce((sum, p) => sum + p.availableQuantity, 0);
  const lowStockCount = products.filter(
    (p) => p.availableQuantity <= p.lowStockThreshold && p.availableQuantity > 0
  ).length;
  const outOfStockCount = products.filter((p) => p.availableQuantity === 0).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (filterType === 'LOW') return matchesSearch && p.availableQuantity <= p.lowStockThreshold && p.availableQuantity > 0;
    if (filterType === 'OUT') return matchesSearch && p.availableQuantity === 0;
    return matchesSearch;
  });

  const handleAdjustSubmit = (mode: 'ADD' | 'SUBTRACT') => {
    if (!selectedProduct) return;
    const qty = parseInt(adjustAmount, 10);
    if (!isNaN(qty) && qty > 0) {
      const delta = mode === 'ADD' ? qty : -qty;
      adjustStock(selectedProduct.id, delta, adjustReason || `${mode} ${qty} ${selectedProduct.unit}`);
      setSelectedProduct(null);
      setAdjustAmount('50');
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>📦</span>
              <span>Inventory & Godown Lots</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Live stock audits, low-stock thresholds, and dispatch adjustment logs
            </p>
          </div>

          <Link
            href="/farmer/products/new"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="h-4 w-4" />
            <span>List New Crop</span>
          </Link>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setFilterType('ALL')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              filterType === 'ALL'
                ? 'bg-white border-[#994200] shadow-md ring-2 ring-[#994200]/20'
                : 'bg-white border-gray-200/90 shadow-2xs hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Stock Units</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              {totalStock.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Across {products.length} listed crops</p>
          </div>

          <div
            onClick={() => setFilterType('LOW')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              filterType === 'LOW'
                ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-300'
                : 'bg-white border-gray-200/90 shadow-2xs hover:border-amber-300'
            }`}
          >
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Low Stock Lots</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">
              {lowStockCount}
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">Below alert threshold</p>
          </div>

          <div
            onClick={() => setFilterType('OUT')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              filterType === 'OUT'
                ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-300'
                : 'bg-white border-gray-200/90 shadow-2xs hover:border-red-300'
            }`}
          >
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl sm:text-3xl font-black text-red-800 mt-1">
              {outOfStockCount}
            </p>
            <p className="text-[11px] text-red-600 mt-0.5">Depleted lots</p>
          </div>

          <div className="p-5 rounded-2xl border bg-white border-gray-200/90 shadow-2xs">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Audit Records</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              {stockHistory.length}
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Stock ledger entries</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter inventory by crop name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Crop Stock Inventory</h3>
            <span className="text-xs font-bold text-gray-500">
              Showing {filteredProducts.length} Lots
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Produce</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Alert Threshold</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Stock Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredProducts.map((p) => {
                  const isDepleted = p.availableQuantity === 0;
                  const isLow = p.availableQuantity <= p.lowStockThreshold && !isDepleted;

                  return (
                    <tr key={p.id} className="hover:bg-amber-50/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
                            alt={p.name}
                            className="h-10 w-10 rounded-xl object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{p.name}</p>
                            <p className="text-[10px] text-gray-500">{p.grade}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">{p.category}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        ₹{p.price} / {p.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-sm font-black ${
                            isDepleted
                              ? 'text-red-600'
                              : isLow
                              ? 'text-amber-800'
                              : 'text-gray-900'
                          }`}
                        >
                          {p.availableQuantity} {p.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {p.lowStockThreshold} {p.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isDepleted
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : isLow
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isDepleted ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-[#994200] border border-amber-300 rounded-lg text-xs font-bold transition"
                          >
                            Adjust Stock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock History Audit Ledger */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#994200]" />
              <h3 className="text-base font-bold text-gray-900">Recent Stock Adjustments Ledger</h3>
            </div>
            <span className="text-xs text-gray-400">Chronological Audit Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Crop Name</th>
                  <th className="py-3 px-4">Previous Stock</th>
                  <th className="py-3 px-4">Change</th>
                  <th className="py-3 px-4">Updated Stock</th>
                  <th className="py-3 px-4">Audit Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {stockHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(item.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">{item.productName}</td>
                    <td className="py-3 px-4 text-gray-500">{item.previousStock}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-black ${
                          item.changeAmount >= 0 ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {item.changeAmount >= 0 ? `+${item.changeAmount}` : item.changeAmount}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">{item.newStock}</td>
                    <td className="py-3 px-4 text-gray-600">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Adjust Inventory: {selectedProduct.name}
            </h3>

            <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
              <p>Current Available Stock: <strong className="text-[#994200]">{selectedProduct.availableQuantity} {selectedProduct.unit}</strong></p>
              <p>Minimum Threshold: <strong className="text-gray-700">{selectedProduct.lowStockThreshold} {selectedProduct.unit}</strong></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Quantity ({selectedProduct.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Audit / Adjustment Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Harvest lot addition, spoiled crop removal..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 text-xs h-9 rounded-xl border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => handleAdjustSubmit('SUBTRACT')}
                  className="flex-1 text-xs h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  <Minus className="h-3.5 w-3.5 mr-1" />
                  Deduct
                </Button>
                <Button
                  type="button"
                  onClick={() => handleAdjustSubmit('ADD')}
                  className="flex-1 text-xs h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Stock
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
}
