'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  ChevronDown, 
  Sprout, 
  Store, 
  TrendingUp, 
  Truck, 
  Languages, 
  SunMedium, 
  Plus, 
  Repeat, 
  Bell,
  LogOut,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onListCropClick?: () => void;
}

export function Navbar({ onListCropClick }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'en'>('hi');
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="border-b border-amber-900/10 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">
          
          {/* Left section: Back arrow, Location dropdown, Main tabs */}
          <div className="flex items-center gap-3 xl:gap-4 overflow-x-auto no-scrollbar py-1">
            <Link
              href="/"
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-amber-50/50 text-gray-700 transition-colors shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            {/* Mandi Cluster Location Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200/80 hover:border-amber-300 text-xs text-amber-950 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors shrink-0 font-medium">
              <MapPin className="h-3.5 w-3.5 text-amber-700 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-gray-900 leading-tight">Lucknow Mandi Cluster</span>
                <span className="text-[10px] text-amber-800/70 leading-tight">(Bakshi Ka Talab)</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-amber-800/60 ml-1" />
            </div>

            {/* Primary Navigation Pills */}
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/farmer/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  (!user || user.role === 'FARMER')
                    ? 'bg-[#FDF4EA] text-[#8C3A00] border border-amber-200/60 shadow-xs'
                    : 'text-gray-600 hover:text-amber-900 hover:bg-amber-50/50'
                }`}
              >
                <Sprout className="h-3.5 w-3.5 text-amber-700" />
                <span>Farmer Desk</span>
              </Link>

              <Link
                href="/buyer/dashboard"
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  user?.role === 'BUYER'
                    ? 'bg-[#FDF4EA] text-[#8C3A00] border border-amber-200/60'
                    : 'text-gray-600 hover:text-amber-900 hover:bg-amber-50/50'
                }`}
              >
                <Store className="h-3.5 w-3.5 text-gray-500" />
                <span>Buyer Hub</span>
              </Link>

              <Link
                href="/admin/dashboard"
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  user?.role === 'ADMIN'
                    ? 'bg-[#FDF4EA] text-[#8C3A00] border border-amber-200/60'
                    : 'text-gray-600 hover:text-amber-900 hover:bg-amber-50/50'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5 text-gray-500" />
                <span>APMC Rates</span>
              </Link>

              <Link
                href="/farmer/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-amber-900 hover:bg-amber-50/50 transition-all"
              >
                <Truck className="h-3.5 w-3.5 text-gray-500" />
                <span>Logistics</span>
              </Link>

              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setSelectedLanguage(prev => prev === 'hi' ? 'en' : 'hi')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-amber-950 hover:bg-amber-50/50 border border-transparent hover:border-amber-200 transition-colors"
                title="Toggle Language"
              >
                <Languages className="h-3.5 w-3.5 text-gray-500" />
                <span>{selectedLanguage === 'hi' ? 'हिन्दी / English' : 'English / हिन्दी'}</span>
              </button>
            </div>
          </div>

          {/* Right section: Weather widget & Farmer Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Weather / Harvesting Widget */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FDF4EA] border border-amber-200/80 text-xs font-medium text-amber-950">
              <SunMedium className="h-4 w-4 text-amber-700 shrink-0" />
              <span className="font-bold">28°C</span>
              <div className="w-1 h-1 rounded-full bg-amber-500"></div>
              <span className="text-[11px] text-amber-900 font-semibold">
                Optimal harvesting conditions <span className="font-normal opacity-80">(Next 3 days)</span>
              </span>
            </div>

            {/* + List New Crop CTA */}
            <Button
              onClick={onListCropClick}
              className="bg-[#994200] hover:bg-[#7A3400] text-white font-semibold text-xs h-9 px-3.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>List New Crop</span>
            </Button>

            {/* Switch Role Button */}
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-amber-50/50 transition-colors"
            >
              <Repeat className="h-3.5 w-3.5 text-gray-500" />
              <span>Switch Role</span>
            </Link>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-amber-50/50 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-600 ring-2 ring-white"></span>
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 sm:pl-2 py-1 pr-1.5 rounded-lg hover:bg-amber-50/50 cursor-pointer transition-colors border border-transparent hover:border-amber-200"
              >
                <div className="h-8 w-8 rounded-full bg-[#522300] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.avatar || (user?.role === 'BUYER' ? 'SF' : user?.role === 'ADMIN' ? 'AD' : 'RK')}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-900 leading-tight">
                    {user?.name || 'Rajesh Kumar'}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-tight">
                    {user?.role ? `${user.role} • ${user.location || 'Bakshi Ka Talab'}` : 'Bakshi Ka Talab'}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
              </div>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-200 shadow-xl py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">{user?.name || 'Rajesh Kumar'}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email || 'rajesh.farmer@kisankart.in'}</p>
                    <span className="mt-1 inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                      {user?.role || 'FARMER'} DESK
                    </span>
                  </div>

                  <div className="py-1 text-xs">
                    <Link
                      href="/farmer/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-amber-50/60 text-gray-700 font-medium"
                    >
                      Farmer Dashboard
                    </Link>
                    <Link
                      href="/buyer/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-amber-50/60 text-gray-700 font-medium"
                    >
                      Buyer Sourcing Hub
                    </Link>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-amber-50/60 text-gray-700 font-medium"
                    >
                      Mandi Regulatory Desk
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-gray-100">
                    {user ? (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Logout Session</span>
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 hover:bg-amber-50 text-amber-800 text-xs font-semibold"
                      >
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
