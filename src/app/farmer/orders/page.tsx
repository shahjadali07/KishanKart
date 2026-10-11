'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import { FarmerOrderStatus } from '@/types/farmer';
import {
  Package,
  Search,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye
} from 'lucide-react';

const TABS: { label: string; status: FarmerOrderStatus | 'ALL' }[] = [
  { label: 'All Orders', status: 'ALL' },
  { label: 'Pending', status: 'Pending' },
  { label: 'Confirmed', status: 'Confirmed' },
  { label: 'Processing', status: 'Processing' },
  { label: 'Shipped', status: 'Shipped' },
  { label: 'Delivered', status: 'Delivered' },
  { label: 'Cancelled', status: 'Cancelled' }
];

const statusStyles: Record<FarmerOrderStatus, string> = {
  Pending: 'bg-amber-50 text-amber-800 border-amber-200/80',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200/80',
  Processing: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  Shipped: 'bg-purple-50 text-purple-700 border-purple-200/80',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200/80'
};

export default function FarmerOrdersPage() {
  const { orders, updateOrderStatus } = useFarmer();
  const [activeTab, setActiveTab] = useState<FarmerOrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'ALL' || o.orderStatus === activeTab;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>📋</span>
              <span>Farm-Gate Procurement Orders</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Review commercial buyer requests, confirm contracts, and track dispatch status
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            Total Orders: <span className="text-gray-900">{orders.length}</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-gray-200">
          {TABS.map((tab) => {
            const count =
              tab.status === 'ALL'
                ? orders.length
                : orders.filter((o) => o.orderStatus === tab.status).length;
            const isActive = activeTab === tab.status;

            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#994200] text-white shadow-2xs'
                    : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, buyer business name, or crop lot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
            />
          </div>
        </div>

        {/* Orders Table / Cards */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/90 p-12 text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 text-[#994200] flex items-center justify-center mx-auto text-2xl">
              📦
            </div>
            <h3 className="text-base font-bold text-gray-900">No orders in this category</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              There are currently no orders with status "{activeTab}". Switch tabs to review other contracts.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs hover:border-amber-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Order Info */}
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-black text-gray-900">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          statusStyles[order.orderStatus]
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">• {formattedDate}</span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Customer: <span className="text-gray-700">{order.customerName}</span>
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Dispatch destination: {order.deliveryAddress.address}, {order.deliveryAddress.city}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {order.items.map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-100 rounded-md text-[11px] font-semibold text-gray-700"
                        >
                          {item.productName} ({item.quantity} {item.unit}) @ ₹{item.pricePerUnit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Contract</span>
                      <span className="text-lg font-black text-[#994200]">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-emerald-700 font-bold">
                        {order.paymentStatus === 'Paid' ? '✓ Paid via Escrow' : 'Payment in Escrow'}
                      </span>
                    </div>

                    {/* Workflow status buttons */}
                    <div className="flex items-center gap-2">
                      {order.orderStatus === 'Pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                          className="px-3.5 py-2 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl transition"
                        >
                          Confirm Order
                        </button>
                      )}

                      {order.orderStatus === 'Confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Processing')}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
                        >
                          Start Packing
                        </button>
                      )}

                      {order.orderStatus === 'Processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Shipped')}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition"
                        >
                          Mark Shipped
                        </button>
                      )}

                      {order.orderStatus === 'Shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition"
                        >
                          Mark Delivered
                        </button>
                      )}

                      <Link
                        href={`/farmer/orders/${order.id}`}
                        className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
