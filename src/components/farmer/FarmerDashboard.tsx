'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import { FarmerSalesChart } from '@/components/farmer/FarmerSalesChart';
import { RecentOrdersTable } from '@/components/farmer/RecentOrdersTable';
import { LowStockSection } from '@/components/farmer/LowStockSection';
import {
  Package,
  Layers,
  IndianRupee,
  ShoppingBag,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  FileText,
  Zap,
  CheckCircle2,
  Sprout
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Modals
import { ListCropModal } from '@/components/farmer/modals/ListCropModal';
import { SoilHealthCardModal } from '@/components/farmer/modals/SoilHealthCardModal';
import { UpiPayoutModal } from '@/components/farmer/modals/UpiPayoutModal';

export function FarmerDashboard() {
  const { user } = useAuth();
  const { stats, orders, products, updateStock, profile, addProduct } = useFarmer();

  const [greeting, setGreeting] = useState('Good Morning');
  const [isListCropOpen, setIsListCropOpen] = useState(false);
  const [isSoilCardOpen, setIsSoilCardOpen] = useState(false);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);

  // Dynamic Greeting based on time of day:
  // 5 AM - 11:59 AM → Good Morning
  // 12 PM - 4:59 PM → Good Afternoon
  // 5 PM - 4:59 AM → Good Evening
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const farmerDisplayName = user?.name || profile.farmerName || 'Rajesh';

  return (
    <FarmerLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* 1. Farmer Welcome Greeting Banner with Quick Actions */}
        <div className="bg-gradient-to-br from-white to-amber-50/40 rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200/80">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
              <span>Verified APMC Farmer • {profile.village}, {profile.district}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {greeting}, {farmerDisplayName} 👋
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              Manage your farm business from one place. Track APMC trading floor bids, dispatch orders, review lot inventories, and receive instant UPI settlements.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={() => setIsListCropOpen(true)}
                className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Add Product</span>
              </Button>

              <Link
                href="/farmer/orders"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-gray-200 hover:bg-white text-xs font-bold text-gray-700 bg-white/80 shadow-2xs transition"
              >
                <Package className="h-4 w-4 text-gray-500" />
                <span>View Orders ({stats.activeOrders})</span>
              </Link>

              <Link
                href="/farmer/inventory"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-gray-200 hover:bg-white text-xs font-bold text-gray-700 bg-white/80 shadow-2xs transition"
              >
                <Layers className="h-4 w-4 text-gray-500" />
                <span>Manage Inventory</span>
              </Link>

              <Button
                variant="outline"
                onClick={() => setIsPayoutOpen(true)}
                className="border-amber-300 hover:bg-amber-100/60 text-[#994200] text-xs font-bold h-9 px-4 rounded-xl shadow-2xs flex items-center gap-1.5"
              >
                <Zap className="h-4 w-4 fill-[#994200]" />
                <span>Withdraw Payout</span>
              </Button>
            </div>
          </div>

          {/* Background Decorative Graphic */}
          <div className="hidden md:block absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <Sprout className="h-64 w-64 text-[#994200]" />
          </div>
        </div>

        {/* 2. Dynamic Stat Cards (Computed from Real Backend State) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Products */}
          <Link
            href="/farmer/products"
            className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-amber-400 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Products
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                {stats.totalProducts}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                <span>{products.filter(p => p.status === 'Active').length} Active lots</span>
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-[#994200] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sprout className="h-5 w-5" />
            </div>
          </Link>

          {/* Card 2: Active Orders */}
          <Link
            href="/farmer/orders"
            className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-blue-400 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Active Orders
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
                {stats.activeOrders}
              </p>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                In transit / awaiting dispatch
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Package className="h-5 w-5" />
            </div>
          </Link>

          {/* Card 3: Total Revenue */}
          <Link
            href="/farmer/earnings"
            className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-emerald-400 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Revenue
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                <span>+{stats.revenueGrowth}% this season</span>
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <IndianRupee className="h-5 w-5" />
            </div>
          </Link>

          {/* Card 4: Available Stock */}
          <Link
            href="/farmer/inventory"
            className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-amber-400 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Available Stock
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#994200] mt-1">
                {stats.availableStock.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Units listed across mandis
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-[#994200] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
          </Link>
        </div>

        {/* 3. Sales Analytics Chart */}
        <FarmerSalesChart />

        {/* 4. Two-Column Split: Recent Orders (Left 7) and Low Stock Alert (Right 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <RecentOrdersTable orders={orders} />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <LowStockSection products={products} onUpdateStock={updateStock} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ListCropModal
        isOpen={isListCropOpen}
        onClose={() => setIsListCropOpen(false)}
        onSuccess={(c) => {
          addProduct({
            name: c.cropName || 'Farm Lot',
            description: 'Fresh direct mandi lot listed by farmer',
            category: 'Vegetables',
            images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'],
            price: parseFloat(c.askingRate) || 30,
            unit: 'kg',
            availableQuantity: parseFloat(c.lotSize) || 200,
            minimumOrderQuantity: 20,
            lowStockThreshold: 40,
            isOrganic: true,
            location: `${profile.village}, ${profile.district}`,
            mandi: `${profile.district} APMC`,
            grade: c.grade || 'Grade A',
            status: 'Active',
            harvestDate: new Date().toISOString().split('T')[0]
          });
        }}
      />

      <SoilHealthCardModal
        isOpen={isSoilCardOpen}
        onClose={() => setIsSoilCardOpen(false)}
      />

      <UpiPayoutModal
        isOpen={isPayoutOpen}
        onClose={() => setIsPayoutOpen(false)}
      />
    </FarmerLayout>
  );
}
