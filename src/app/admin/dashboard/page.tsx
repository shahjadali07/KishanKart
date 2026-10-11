'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SalesChart } from '@/components/admin/SalesChart';
import { OrderStatusOverview } from '@/components/admin/OrderStatusOverview';
import { PendingFarmerApprovals } from '@/components/admin/PendingFarmerApprovals';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { adminService } from '@/services/adminService';
import { AdminStats, Farmer, Order, OrderStatus } from '@/types/admin';
import {
  Users,
  Building2,
  Package,
  ShoppingCart,
  IndianRupee,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

function AdminDashboardContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingFarmers, setPendingFarmers] = useState<Farmer[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [greeting, setGreeting] = useState('Good Morning');
  const [formattedDate, setFormattedDate] = useState('');
  const [ordersByStatus, setOrdersByStatus] = useState<Record<OrderStatus, number>>({
    Pending: 0,
    Confirmed: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
    Refunded: 0,
  });

  const loadData = async () => {
    const s = await adminService.getDashboardStats();
    setStats(s);

    const f = await adminService.getFarmers({ status: 'PENDING' });
    setPendingFarmers(f);

    const o = await adminService.getOrders();
    setRecentOrders(o);

    // Compute status map
    const counts: Record<OrderStatus, number> = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
      Refunded: 0,
    };
    o.forEach(item => {
      if (counts[item.orderStatus] !== undefined) {
        counts[item.orderStatus]++;
      }
    });
    setOrdersByStatus(counts);
  };

  useEffect(() => {
    // Dynamic greeting calculation
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    // Dynamic date format
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    setFormattedDate(new Date().toLocaleDateString('en-IN', options));

    loadData();
  }, []);

  const statCards = [
    { title: 'Total Farmers', value: stats?.totalFarmers.toLocaleString('en-IN') || '12,480', change: stats?.farmersChange || '+14.2%', icon: Users, color: 'text-amber-800', bg: 'bg-amber-100', href: '/admin/farmers' },
    { title: 'Total Buyers', value: stats?.totalBuyers.toLocaleString('en-IN') || '3,840', change: stats?.buyersChange || '+8.7%', icon: Building2, color: 'text-blue-700', bg: 'bg-blue-100', href: '/admin/buyers' },
    { title: 'Active Products', value: stats?.activeProducts.toLocaleString('en-IN') || '1,420', change: stats?.productsChange || '+19.5%', icon: Package, color: 'text-emerald-700', bg: 'bg-emerald-100', href: '/admin/products' },
    { title: 'Total Orders', value: stats?.totalOrders.toLocaleString('en-IN') || '42,910', change: stats?.ordersChange || '+23.4%', icon: ShoppingCart, color: 'text-indigo-700', bg: 'bg-indigo-100', href: '/admin/orders' },
    { title: "Today's Sales", value: `₹${(stats?.todaySales || 184500).toLocaleString('en-IN')}`, change: stats?.salesChange || '+12.1%', icon: IndianRupee, color: 'text-[#994200]', bg: 'bg-amber-100', href: '/admin/payments' },
    { title: 'Pending Orders', value: stats?.pendingOrdersCount || 28, change: 'Requires Driver Match', icon: Clock, color: 'text-orange-700', bg: 'bg-orange-100', href: '/admin/orders?status=Pending' },
    { title: 'Pending Approvals', value: stats?.pendingFarmerApprovalsCount || 14, change: 'KYC Checks Pending', icon: ShieldCheck, color: 'text-rose-700', bg: 'bg-rose-100', href: '/admin/farmers/pending' },
    { title: 'Platform Revenue', value: `₹${(stats?.platformRevenue || 1428500).toLocaleString('en-IN')}`, change: stats?.revenueChange || '+18.3%', icon: TrendingUp, color: 'text-teal-700', bg: 'bg-teal-100', href: '/admin/payments' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Dynamic Greeting & Date Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {greeting}, Admin 👋
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {formattedDate} • Mandi Regulatory Control & Direct Trade Aggregation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/ai-insights"
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>AI Crop Insights</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
            </Link>
            <Link
              href="/admin/farmers/kyc"
              className="px-3 py-1.5 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Review KYC Queue</span>
            </Link>
          </div>
        </div>

        {/* 8 Essential Admin Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    {card.title}
                  </span>
                  <div className={`h-8 w-8 rounded-lg ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-amber-950 transition-colors">
                    {card.value}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500 flex items-center gap-1 mt-1">
                    <span className="text-amber-800 font-bold">{card.change}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sales Chart & Order Pipeline (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <SalesChart />
          </div>
          <div className="lg:col-span-4">
            <OrderStatusOverview
              ordersCountByStatus={ordersByStatus}
              totalOrders={recentOrders.length}
            />
          </div>
        </div>

        {/* Pending Farmer Approvals & Recent Orders */}
        <div className="space-y-6">
          <PendingFarmerApprovals
            initialFarmers={pendingFarmers}
            onUpdate={loadData}
          />

          <RecentOrders orders={recentOrders} />
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-xl"></div>
              ))}
            </div>
          </div>
        </AdminLayout>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
