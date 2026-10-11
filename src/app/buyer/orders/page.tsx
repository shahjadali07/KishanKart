'use client';

import React, { useState } from 'react';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { OrderCard } from '@/components/buyer/OrderCard';
import { EmptyState } from '@/components/buyer/EmptyState';
import { Package, Search, Filter } from 'lucide-react';

export default function BuyerOrdersPage() {
  const { orders } = useBuyer();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Delivered' | 'Cancelled'>('All');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((o) => {
    // Tab filter
    if (filter === 'Active') {
      if (o.status === 'Delivered' || o.status === 'Cancelled') return false;
    } else if (filter === 'Delivered') {
      if (o.status !== 'Delivered') return false;
    } else if (filter === 'Cancelled') {
      if (o.status !== 'Cancelled') return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.product.name.toLowerCase().includes(q));
      if (!matchId && !matchItem) return false;
    }

    return true;
  });

  return (
    <BuyerLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              My Mandi Purchases & Contracts
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live consignment tracking, digital weighbridge vouchers, and reorder history
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search order ID or crop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#994200] outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          {(['All', 'Active', 'Delivered', 'Cancelled'] as const).map((tab) => {
            const count =
              tab === 'All'
                ? orders.length
                : tab === 'Active'
                ? orders.filter(
                    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
                  ).length
                : orders.filter((o) => o.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  filter === tab
                    ? 'bg-[#994200] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    filter === tab
                      ? 'bg-amber-800 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title={
              filter === 'All'
                ? "You haven't placed any orders yet"
                : `No ${filter.toLowerCase()} orders found`
            }
            description="Explore our farmgate catalog to place direct procurement contracts with verified growers."
            actionText="Start Shopping"
            actionHref="/buyer/products"
          />
        )}
      </div>
    </BuyerLayout>
  );
}
