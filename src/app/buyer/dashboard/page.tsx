'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useAuth } from '@/context/AuthContext';
import { useBuyer } from '@/context/BuyerContext';
import { ProductCard } from '@/components/buyer/ProductCard';
import { CategoryCard } from '@/components/buyer/CategoryCard';
import { OrderCard } from '@/components/buyer/OrderCard';
import { mockCategories } from '@/data/buyerMockData';
import {
  Search,
  Package,
  Clock,
  Heart,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Store,
  ChevronRight
} from 'lucide-react';

function BuyerDashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    products,
    orders,
    cartCount,
    wishlistCount,
    setSearchQuery
  } = useBuyer();

  const [searchVal, setSearchVal] = useState('');
  const [greeting, setGreeting] = useState('Good Morning');

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchQuery(searchVal.trim());
      router.push(`/buyer/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  // Quick Stats
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(
    (o) =>
      o.status !== 'Delivered' &&
      o.status !== 'Cancelled'
  ).length;

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const recommendedProducts = products.filter((p) => p.isRecommended).slice(0, 4);
  const recentOrders = orders.slice(0, 2);

  return (
    <BuyerLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* 1. Hero Greeting Banner */}
        <div className="bg-gradient-to-br from-white to-amber-50/40 rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-[#994200] border border-amber-200/80">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Direct Farm-Gate Mandi Access</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {greeting}, {user?.name || 'Sharma Foods'} 👋
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              Find fresh products directly from trusted farmers. 100% lab quality tested, digital weighbridge receipts, and direct farm-to-hub cold logistics.
            </p>

            {/* Large Search Bar */}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fresh tomatoes, organic wheat, basmati rice, farmers..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-12 pr-28 py-3.5 bg-white border border-gray-300 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#994200]/20 focus:border-[#994200] shadow-sm transition"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Background Decorative Pattern */}
          <div className="hidden md:block absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <Store className="h-64 w-64 text-[#994200]" />
          </div>
        </div>

        {/* 2. Quick Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Orders
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                {totalOrdersCount}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Lifetime fulfilled
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-[#994200] flex items-center justify-center shrink-0">
              <Package className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Active Orders
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
                {activeOrdersCount}
              </p>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                In transit / packing
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Wishlist Items
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">
                {wishlistCount}
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Saved for later
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Cart Items
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-800 mt-1">
                {cartCount}
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                Ready for checkout
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* 3. Product Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Explore Produce Categories
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Procure directly from verified APMC mandis and organic farmer clusters
              </p>
            </div>
            <Link
              href="/buyer/products"
              className="text-xs font-bold text-[#994200] hover:text-[#7A3400] flex items-center gap-1 transition"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {mockCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>

        {/* 4. Featured Products */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#994200]"></span>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Featured Farmgate Lots
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Top-rated seasonal harvest lots with guaranteed grading & lab purity reports
              </p>
            </div>
            <Link
              href="/buyer/products"
              className="text-xs font-bold text-[#994200] hover:text-[#7A3400] flex items-center gap-1 transition"
            >
              Browse Catalog
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} featured />
            ))}
          </div>
        </div>

        {/* 5. Recommended Products (AI Simulation Engine) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#994200]" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Recommended For You
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Curated based on your regional procurement demand and nearby farm clusters
              </p>
            </div>
            <Link
              href="/buyer/products"
              className="text-xs font-bold text-[#994200] hover:text-[#7A3400] flex items-center gap-1 transition"
            >
              See More
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* 6. Recent Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Recent Mandi Purchases
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Track live consignments, download gate passes and reorder frequent lots
              </p>
            </div>
            <Link
              href="/buyer/orders"
              className="text-xs font-bold text-[#994200] hover:text-[#7A3400] flex items-center gap-1 transition"
            >
              View All Orders ({orders.length})
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense
      fallback={
        <BuyerLayout>
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Loading buyer dashboard...
          </div>
        </BuyerLayout>
      }
    >
      <BuyerDashboardContent />
    </Suspense>
  );
}
