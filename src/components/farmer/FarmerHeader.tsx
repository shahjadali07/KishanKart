'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFarmer } from '@/context/FarmerContext';
import {
  MapPin,
  ChevronDown,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Sprout,
  Plus,
  Repeat,
  Languages,
  Package,
  Layers,
  HelpCircle
} from 'lucide-react';

interface FarmerHeaderProps {
  onMenuToggle: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  onAddProductClick?: () => void;
}

export function FarmerHeader({
  onMenuToggle,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  onAddProductClick
}: FarmerHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadNotificationsCount, profile } = useFarmer();
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'en'>('hi');
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left section: Hamburger, Hide/Show Sidebar button, Mandi location */}
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

        {/* Mandi Cluster Location Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-200/80 bg-amber-50/60 hover:bg-amber-50 text-xs font-medium text-gray-800 transition cursor-pointer">
          <MapPin className="h-3.5 w-3.5 text-[#994200] shrink-0" />
          <div className="flex flex-col text-left leading-tight">
            <span className="font-bold text-gray-900 truncate max-w-[140px] sm:max-w-[200px]">
              {profile.district} Mandi Cluster
            </span>
            <span className="text-[10px] text-amber-800/80 font-medium">
              ({profile.village})
            </span>
          </div>
          <ChevronDown className="h-3 w-3 text-gray-400 ml-1 shrink-0" />
        </div>
      </div>

      {/* Center: Live APMC Mandi Status Pill */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Digital Trading Floor: Active • Tomato ₹28/kg</span>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Switch to Buyer Mode */}
        <Link
          href="/buyer/dashboard"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-amber-50/50 text-xs font-semibold text-gray-700 transition"
          title="Switch to Buyer Dashboard"
        >
          <Repeat className="h-3.5 w-3.5 text-gray-500" />
          <span>Buyer Mode</span>
        </Link>

        {/* Add Product Primary Action Button */}
        {onAddProductClick ? (
          <button
            onClick={onAddProductClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        ) : (
          <Link
            href="/farmer/products/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        )}

        {/* Notifications Icon with Dynamic Badge */}
        <Link
          href="/farmer/notifications"
          className="relative p-2 text-gray-600 hover:text-[#994200] hover:bg-amber-50/50 rounded-xl transition"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#994200] ring-2 ring-white" />
          )}
        </Link>

        {/* Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
              {(user?.name || profile.farmerName)?.slice(0, 2).toUpperCase() || 'RF'}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                {user?.name || profile.farmerName}
              </span>
              <span className="text-[10px] text-gray-500 font-medium leading-tight">
                Verified Farmer
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-bold text-gray-900">{user?.name || profile.farmerName}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user?.phone || profile.phone}</p>
                </div>

                <div className="px-4 py-2 text-gray-600 flex items-center justify-between border-b border-gray-100">
                  <span>Language</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedLanguage('hi')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        selectedLanguage === 'hi' ? 'bg-[#994200] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      हिन्दी
                    </button>
                    <button
                      onClick={() => setSelectedLanguage('en')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        selectedLanguage === 'en' ? 'bg-[#994200] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <Link
                  href="/farmer/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  Farmer Profile
                </Link>

                <Link
                  href="/farmer/orders"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <Package className="h-4 w-4 text-gray-400" />
                  Orders
                </Link>

                <Link
                  href="/farmer/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Settings
                </Link>

                <Link
                  href="/farmer/support"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  Help & Support
                </Link>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={() => {
                    setProfileOpen(false);
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
