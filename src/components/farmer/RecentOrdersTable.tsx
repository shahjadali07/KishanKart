'use client';

import React from 'react';
import Link from 'next/link';
import { FarmerOrder, FarmerOrderStatus } from '@/types/farmer';
import { Package, ArrowRight, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

interface RecentOrdersProps {
  orders: FarmerOrder[];
  onOrderClick?: (order: FarmerOrder) => void;
}

const statusBadgeStyles: Record<FarmerOrderStatus, string> = {
  Pending: 'bg-amber-50 text-amber-800 border-amber-200/80',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200/80',
  Processing: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  Shipped: 'bg-purple-50 text-purple-700 border-purple-200/80',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200/80'
};

export function RecentOrdersTable({ orders, onOrderClick }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-amber-50 text-[#994200] flex items-center justify-center mx-auto">
          <Package className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-gray-900">No Orders Yet</h4>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          When commercial buyers or mandis book your listed crops, active contracts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Recent Mandi Orders</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Active farm-gate procurement contracts awaiting or undergoing dispatch
          </p>
        </div>
        <Link
          href="/farmer/orders"
          className="text-xs font-bold text-[#994200] hover:text-[#7A3400] flex items-center gap-1 transition"
        >
          View All Orders ({orders.length})
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Products</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Order Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {orders.slice(0, 5).map((order) => {
              const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <tr
                  key={order.id}
                  onClick={() => onOrderClick?.(order)}
                  className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-gray-800">
                    <p className="font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-[10px] text-gray-500">{order.deliveryAddress.city}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-gray-700 truncate max-w-[200px]">
                          {item.productName} ({item.quantity} {item.unit})
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-black text-gray-900">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {formattedDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        statusBadgeStyles[order.orderStatus]
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/farmer/orders/${order.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#994200] group-hover:text-[#7A3400] transition"
                    >
                      Details
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100">
        {orders.slice(0, 4).map((order) => (
          <Link
            key={order.id}
            href={`/farmer/orders/${order.id}`}
            className="p-4 block hover:bg-amber-50/40 transition space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-gray-900">
                {order.orderNumber}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  statusBadgeStyles[order.orderStatus]
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-900">{order.customerName}</p>
              <p className="text-[11px] text-gray-500">
                {order.items.map((it) => `${it.productName} (${it.quantity} ${it.unit})`).join(', ')}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
              <span className="text-[11px] text-gray-400">
                {new Date(order.orderDate).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              <span className="font-extrabold text-[#994200]">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
