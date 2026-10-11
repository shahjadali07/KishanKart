'use client';

import React from 'react';
import Link from 'next/link';
import { OrderStatus } from '@/types/admin';
import { CheckCircle2, Clock, Truck, AlertCircle, ArrowUpRight, RotateCcw } from 'lucide-react';

interface OrderStatusOverviewProps {
  ordersCountByStatus: Record<OrderStatus, number>;
  totalOrders: number;
}

export function OrderStatusOverview({ ordersCountByStatus, totalOrders }: OrderStatusOverviewProps) {
  const statuses: { status: OrderStatus; label: string; color: string; bg: string; icon: any }[] = [
    { status: 'Pending', label: 'Pending', color: 'text-amber-800', bg: 'bg-amber-100', icon: Clock },
    { status: 'Confirmed', label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle2 },
    { status: 'Processing', label: 'Processing', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: RotateCcw },
    { status: 'Shipped', label: 'Shipped (In Transit)', color: 'text-purple-700', bg: 'bg-purple-100', icon: Truck },
    { status: 'Delivered', label: 'Delivered & Settled', color: 'text-emerald-800', bg: 'bg-emerald-100', icon: CheckCircle2 },
    { status: 'Cancelled', label: 'Cancelled / Disputed', color: 'text-rose-700', bg: 'bg-rose-100', icon: AlertCircle },
  ];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            Order Fulfillment Pipeline
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Realtime dispatch & weighbridge validation state
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
        >
          <span>View All Orders</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3 pt-1">
        {statuses.map((item) => {
          const count = ordersCountByStatus[item.status] || 0;
          const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
          const Icon = item.icon;

          return (
            <Link
              key={item.status}
              href={`/admin/orders?status=${item.status}`}
              className="group block p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-amber-900 transition-colors">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-gray-900 text-sm">{count}</span>
                  <span className="text-[11px] text-gray-400 font-semibold w-8 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.status === 'Delivered'
                      ? 'bg-emerald-600'
                      : item.status === 'Shipped'
                      ? 'bg-purple-600'
                      : item.status === 'Cancelled'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
