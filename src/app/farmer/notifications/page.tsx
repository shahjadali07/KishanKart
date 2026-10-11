'use client';

import React from 'react';
import Link from 'next/link';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import {
  Bell,
  CheckCircle2,
  Package,
  IndianRupee,
  AlertTriangle,
  Radio,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FarmerNotificationsPage() {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useFarmer();

  return (
    <FarmerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>🔔</span>
              <span>Mandi & Order Notifications</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Live alerts for new buyer orders, weighbridge status updates, escrow payouts, and low stock
            </p>
          </div>

          {unreadNotificationsCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllNotificationsAsRead}
              className="self-start sm:self-auto text-xs h-9 px-3.5 border-gray-200 hover:bg-amber-50 text-[#994200] font-bold rounded-xl"
            >
              Mark All as Read ({unreadNotificationsCount})
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs divide-y divide-gray-100 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-5 transition-all flex items-start justify-between gap-4 cursor-pointer ${
                    notif.isRead ? 'bg-white hover:bg-gray-50/60' : 'bg-amber-50/40 hover:bg-amber-50/70'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        notif.type === 'New Order'
                          ? 'bg-blue-100 text-blue-700'
                          : notif.type === 'Payment Received'
                          ? 'bg-emerald-100 text-emerald-700'
                          : notif.type === 'Low Stock' || notif.type === 'Out of Stock'
                          ? 'bg-amber-100 text-[#994200]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {notif.type === 'New Order' ? (
                        <Package className="h-5 w-5" />
                      ) : notif.type === 'Payment Received' ? (
                        <IndianRupee className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{notif.title}</h4>
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-[#994200] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">{notif.message}</p>
                      <span className="text-[10px] text-gray-400 block pt-0.5">{notif.timestamp}</span>
                    </div>
                  </div>

                  {notif.link && (
                    <Link
                      href={notif.link}
                      className="self-center p-2 rounded-xl text-gray-400 hover:text-[#994200] hover:bg-white transition shrink-0"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </FarmerLayout>
  );
}
