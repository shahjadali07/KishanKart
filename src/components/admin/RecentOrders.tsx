'use client';

import React from 'react';
import Link from 'next/link';
import { Order } from '@/types/admin';
import { ArrowUpRight, Eye } from 'lucide-react';

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            Latest Mandi Procurement Orders
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Realtime transactions executed across verified cluster farm-gates
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 shrink-0"
        >
          <span>View All Orders</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
              <th className="pb-3 font-bold">Order ID</th>
              <th className="pb-3 font-bold">Buyer</th>
              <th className="pb-3 font-bold">Farmer</th>
              <th className="pb-3 font-bold">Produce Item</th>
              <th className="pb-3 font-bold">Amount</th>
              <th className="pb-3 font-bold">Payment</th>
              <th className="pb-3 font-bold">Status</th>
              <th className="pb-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                <td className="py-3 font-mono font-bold text-gray-900">
                  <Link href={`/admin/orders/${order.id}`} className="hover:text-amber-800 underline decoration-gray-300">
                    {order.id}
                  </Link>
                </td>

                <td className="py-3 px-2 font-medium text-gray-800">
                  <span className="block truncate max-w-[140px] font-bold">{order.buyerName}</span>
                  <span className="text-[10px] text-gray-400 block truncate max-w-[140px]">{order.buyerBusiness}</span>
                </td>

                <td className="py-3 px-2 text-gray-700">
                  <span className="font-semibold">{order.farmerName}</span>
                </td>

                <td className="py-3 px-2 text-gray-600">
                  <span className="font-medium text-gray-900">{order.items[0]?.productName || 'Agricultural Produce'}</span>
                  {order.items.length > 1 && (
                    <span className="text-[10px] text-gray-400 block">+{order.items.length - 1} more items</span>
                  )}
                </td>

                <td className="py-3 px-2 font-extrabold text-[#994200]">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </td>

                <td className="py-3 px-2">
                  <span className="text-[10px] font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                    {order.paymentStatus}
                  </span>
                </td>

                <td className="py-3 px-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>

                <td className="py-3 pl-2 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors inline-block"
                    title="View Full Order Details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
