'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  X,
  Users,
  Building2,
  Package,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { adminService } from '@/services/adminService';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{
    farmers: any[];
    buyers: any[];
    products: any[];
    orders: any[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global search trigger
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await adminService.globalSearch(searchTerm);
      setSearchResults(res);
      setIsSearching(false);
      setShowSearchDropdown(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const hasResults = searchResults && (
    searchResults.farmers.length > 0 ||
    searchResults.buyers.length > 0 ||
    searchResults.products.length > 0 ||
    searchResults.orders.length > 0
  );

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200/90 shadow-2xs flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 lg:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-400">KisanKart APMC Portal</span>
          <span className="text-gray-300">/</span>
          <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70">
            Regulatory Control Desk
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Farmers, Buyers, Orders, Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => { if (hasResults) setShowSearchDropdown(true); }}
            className="w-full pl-9 pr-8 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); setSearchResults(null); }}
              className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {showSearchDropdown && searchResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 animate-in fade-in duration-150 max-h-96 overflow-y-auto">
            {hasResults ? (
              <div className="p-2 space-y-3 text-xs">
                {searchResults.farmers.length > 0 && (
                  <div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Users className="h-3 w-3" /> Farmers
                    </span>
                    <div className="space-y-0.5 mt-1">
                      {searchResults.farmers.map((f) => (
                        <Link
                          key={f.id}
                          href={`/admin/farmers/${f.id}`}
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/70 transition-colors"
                        >
                          <div>
                            <span className="font-bold text-gray-900">{f.name}</span>
                            <span className="text-[11px] text-gray-500 block">{f.location}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {f.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.buyers.length > 0 && (
                  <div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" /> Buyers
                    </span>
                    <div className="space-y-0.5 mt-1">
                      {searchResults.buyers.map((b) => (
                        <Link
                          key={b.id}
                          href={`/admin/buyers/${b.id}`}
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/70 transition-colors"
                        >
                          <div>
                            <span className="font-bold text-gray-900">{b.businessName}</span>
                            <span className="text-[11px] text-gray-500 block">{b.city}, {b.state}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-600">{b.totalOrders} Orders</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.products.length > 0 && (
                  <div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Package className="h-3 w-3" /> Products
                    </span>
                    <div className="space-y-0.5 mt-1">
                      {searchResults.products.map((p) => (
                        <Link
                          key={p.id}
                          href="/admin/products"
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/70 transition-colors"
                        >
                          <div>
                            <span className="font-bold text-gray-900">{p.title}</span>
                            <span className="text-[11px] text-gray-500 block">by {p.farmerName}</span>
                          </div>
                          <span className="font-black text-amber-900">₹{p.price}/{p.unit}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.orders.length > 0 && (
                  <div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <ShoppingCart className="h-3 w-3" /> Orders
                    </span>
                    <div className="space-y-0.5 mt-1">
                      {searchResults.orders.map((o) => (
                        <Link
                          key={o.id}
                          href={`/admin/orders/${o.id}`}
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/70 transition-colors"
                        >
                          <div>
                            <span className="font-bold text-gray-900">{o.id}</span>
                            <span className="text-[11px] text-gray-500 block">{o.buyerName}</span>
                          </div>
                          <span className="font-bold text-[#994200]">₹{o.totalAmount.toLocaleString('en-IN')}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-500">
                No matching results found for &ldquo;<span className="font-semibold text-gray-800">{searchTerm}</span>&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions, Notifications, Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Icon with Badge */}
        <Link
          href="/admin/notifications"
          className="relative p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          title="Notifications & Alerts"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-600 ring-2 ring-white" />
        </Link>

        {/* Profile Menu Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold text-xs shadow-2xs">
              AD
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">Administrator</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-xl p-1.5 z-50 animate-in fade-in duration-100 text-xs">
              <div className="p-2.5 border-b border-gray-100">
                <p className="font-bold text-gray-900">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-gray-500">{user?.email || 'admin@kisankart.in'}</p>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-amber-50/70 hover:text-amber-950 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-gray-400" />
                  <span>Platform Settings</span>
                </Link>
                <Link
                  href="/admin/ai-insights"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-amber-50/70 hover:text-amber-950 transition-colors"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span>AI Crop Intelligence</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-gray-100">
                <button
                  onClick={() => { setShowProfileDropdown(false); logout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out of Admin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
