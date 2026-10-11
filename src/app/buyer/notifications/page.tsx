'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { EmptyState } from '@/components/buyer/EmptyState';
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  Truck,
  CreditCard,
  Tag,
  Leaf,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function BuyerNotificationsPage() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadNotificationsCount
  } = useBuyer();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = notifications.filter((n) => {
    return categoryFilter === 'ALL' || n.category === categoryFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Orders':
        return <Package className="h-4 w-4 text-amber-700" />;
      case 'Delivery':
        return <Truck className="h-4 w-4 text-blue-700" />;
      case 'Payments':
        return <CreditCard className="h-4 w-4 text-emerald-700" />;
      case 'Offers':
        return <Tag className="h-4 w-4 text-orange-600" />;
      case 'Product availability':
        return <Leaf className="h-4 w-4 text-green-700" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <BuyerLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Mandi Bulletins & Notifications
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live consignment dispatches, APMC rate updates, and harvest arrivals
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
              >
                <CheckCheck className="h-3.5 w-3.5 text-[#994200]" />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'Orders', label: 'Orders' },
            { id: 'Delivery', label: 'Delivery' },
            { id: 'Payments', label: 'Payments' },
            { id: 'Offers', label: 'Rate Alerts' },
            { id: 'Product availability', label: 'Stock Restocks' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                categoryFilter === tab.id
                  ? 'bg-[#994200] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                  n.read
                    ? 'bg-white border-gray-200/80 shadow-2xs'
                    : 'bg-amber-50/50 border-amber-300 shadow-xs ring-1 ring-amber-200/60'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0">
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-[#994200] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                      {n.message}
                    </p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 pt-0.5">
                      <Clock className="h-3 w-3" />
                      {n.timestamp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {n.link && (
                    <Link
                      href={n.link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#994200] hover:underline px-2 py-1"
                    >
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition"
                    title="Delete Notification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="No Notifications in this Category"
            description="You're all caught up! You will receive live alerts when mandi dispatches and harvest arrivals occur."
            actionText="View All Alerts"
            onActionClick={() => setCategoryFilter('ALL')}
          />
        )}
      </div>
    </BuyerLayout>
  );
}
