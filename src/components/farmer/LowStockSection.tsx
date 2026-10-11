'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FarmerProduct } from '@/types/farmer';
import { AlertTriangle, Plus, ChevronRight, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LowStockProductsProps {
  products: FarmerProduct[];
  onUpdateStock: (productId: string, newStock: number, reason: string) => void;
}

export function LowStockSection({ products, onUpdateStock }: LowStockProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<FarmerProduct | null>(null);
  const [addQty, setAddQty] = useState<string>('50');

  const lowStockItems = products.filter(
    (p) => p.availableQuantity <= p.lowStockThreshold || p.status === 'Out of Stock'
  );

  const handleQuickAdd = (p: FarmerProduct) => {
    setSelectedProduct(p);
  };

  const handleConfirmStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const qty = parseInt(addQty, 10);
    if (!isNaN(qty) && qty > 0) {
      onUpdateStock(
        selectedProduct.id,
        selectedProduct.availableQuantity + qty,
        `Quick replenish: +${qty} ${selectedProduct.unit}`
      );
      setSelectedProduct(null);
      setAddQty('50');
    }
  };

  if (lowStockItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">All Lots Well-Stocked</h4>
            <p className="text-xs text-gray-500">
              No crops are currently below minimum lot availability thresholds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-amber-50/40">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              Low Stock & Depleted Lots ({lowStockItems.length})
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Replenish before buyer contracts are cancelled or stalled
            </p>
          </div>
        </div>

        <Link
          href="/farmer/inventory"
          className="text-xs font-bold text-[#994200] hover:text-[#7A3400] flex items-center gap-1 transition"
        >
          Manage Inventory
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid of Low Stock Items */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {lowStockItems.map((product) => {
          const isDepleted = product.availableQuantity === 0;

          return (
            <div
              key={product.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isDepleted
                  ? 'bg-red-50/40 border-red-200/80'
                  : 'bg-white border-amber-200/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
                  alt={product.name}
                  className="h-12 w-12 rounded-xl object-cover shrink-0 border border-gray-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {product.name}
                    </h4>
                    {isDepleted ? (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-[#994200] border border-amber-200">
                        Low Stock
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1">
                    Available:{' '}
                    <strong className={isDepleted ? 'text-red-700' : 'text-amber-900'}>
                      {product.availableQuantity} {product.unit}
                    </strong>{' '}
                    <span className="text-gray-400">
                      (Min alert: {product.lowStockThreshold} {product.unit})
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-700">
                  ₹{product.price} / {product.unit}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAdd(product)}
                  className="text-xs h-7 px-3 border-amber-300 text-[#994200] hover:bg-amber-50 font-bold rounded-lg"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Update Stock
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Add Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95">
            <h4 className="text-sm font-bold text-gray-900">
              Replenish: {selectedProduct.name}
            </h4>
            <p className="text-xs text-gray-500">
              Current Available:{' '}
              <strong className="text-gray-800">
                {selectedProduct.availableQuantity} {selectedProduct.unit}
              </strong>
            </p>

            <form onSubmit={handleConfirmStock} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  Add Quantity ({selectedProduct.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={addQty}
                  onChange={(e) => setAddQty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#994200]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 text-xs h-9 rounded-xl border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-xs h-9 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white font-bold"
                >
                  Confirm +{addQty}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
