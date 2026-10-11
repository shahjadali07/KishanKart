'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBuyer } from '@/context/BuyerContext';
import {
  Search,
  MapPin,
  ChevronDown,
  Bell,
  ShoppingCart,
  Menu,
  User,
  Settings,
  LogOut,
  Package,
  Heart,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface BuyerHeaderProps {
  onMenuToggle: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

export function BuyerHeader({
  onMenuToggle,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse
}: BuyerHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    cartCount,
    unreadNotificationsCount,
    selectedAddress,
    searchQuery,
    setSearchQuery
  } = useBuyer();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      router.push(`/buyer/search?q=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left: Mobile hamburger & desktop sidebar hide/show button + location indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          title="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Hide/Show Sidebar Toggle Button */}
        {onToggleSidebarCollapse && (
          <button
            onClick={onToggleSidebarCollapse}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200/80 hover:bg-amber-50/60 hover:border-amber-300 text-gray-600 hover:text-[#994200] transition text-xs font-semibold"
            title={isSidebarCollapsed ? 'Show / Expand Sidebar' : 'Hide / Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <>
                <PanelLeftOpen className="h-4 w-4 text-[#994200]" />
                <span className="hidden xl:inline">Show Menu</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span className="hidden xl:inline">Hide Menu</span>
              </>
            )}
          </button>
        )}

        {/* Location selector */}
        <Link
          href="/buyer/addresses"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-200/80 bg-amber-50/60 hover:bg-amber-50 text-xs font-medium text-gray-800 transition"
        >
          <MapPin className="h-3.5 w-3.5 text-[#994200] shrink-0" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] text-gray-500 font-medium">Deliver to</span>
            <span className="font-bold text-gray-900 truncate max-w-[130px] sm:max-w-[190px]">
              {selectedAddress
                ? `${selectedAddress.villageCity}, ${selectedAddress.district}`
                : 'Lucknow Mandi Cluster'}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 text-gray-400 ml-1 shrink-0" />
        </Link>
      </div>

      {/* Center: Global Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-xl mx-2 hidden md:block"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search fresh products, crops, farmers, mandis..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#994200]/20 focus:border-[#994200] transition"
          />
        </div>
      </form>

      {/* Right Action Icons & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Wishlist Link */}
        <Link
          href="/buyer/wishlist"
          className="p-2 text-gray-600 hover:text-[#994200] hover:bg-amber-50/50 rounded-xl transition relative"
          title="Wishlist"
        >
          <Heart className="h-5 w-5" />
        </Link>

        {/* Notifications Icon with Badge */}
        <Link
          href="/buyer/notifications"
          className="p-2 text-gray-600 hover:text-[#994200] hover:bg-amber-50/50 rounded-xl transition relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#994200] ring-2 ring-white" />
          )}
        </Link>

        {/* Cart Icon with Live Count */}
        <Link
          href="/buyer/cart"
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/70 text-[#994200] border border-amber-200/80 rounded-xl text-xs font-bold transition shadow-2xs"
          title="Shopping Cart"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          <span className="px-1.5 py-0.2 bg-[#994200] text-white rounded-full text-[10px]">
            {cartCount}
          </span>
        </Link>

        {/* Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
              {user?.name?.slice(0, 2).toUpperCase() || 'SF'}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                {user?.name || 'Sharma Foods'}
              </span>
              <span className="text-[10px] text-gray-500 font-medium leading-tight">
                Buyer Account
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-bold text-gray-900">{user?.name || 'Sharma Foods Ltd.'}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user?.email || 'buyer@sharmafoods.in'}</p>
                </div>

                <Link
                  href="/buyer/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  Buyer Profile
                </Link>

                <Link
                  href="/buyer/orders"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <Package className="h-4 w-4 text-gray-400" />
                  My Orders
                </Link>

                <Link
                  href="/buyer/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Account Settings
                </Link>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-700 hover:bg-red-50 font-medium text-left"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
