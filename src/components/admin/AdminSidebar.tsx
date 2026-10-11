'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ShoppingCart,
  CreditCard,
  Truck,
  AlertCircle,
  BarChart3,
  Sparkles,
  Bell,
  Settings,
  LogOut,
  Sprout,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Farmers', href: '/admin/farmers', icon: Users, badge: 'KYC' },
    { label: 'Buyers', href: '/admin/buyers', icon: Building2 },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Logistics', href: '/admin/logistics', icon: Truck },
    { label: 'Complaints', href: '/admin/complaints', icon: AlertCircle },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'AI Insights', href: '/admin/ai-insights', icon: Sparkles, highlight: true },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-amber-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#994200] text-white flex items-center justify-center font-bold text-lg shadow-2xs">
              <Sprout className="h-5 w-5 text-amber-200" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-gray-900 tracking-tight leading-none">
                  KisanKart
                </span>
                <span className="text-[9px] font-bold tracking-wider text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300 uppercase">
                  Admin
                </span>
              </div>
              <span className="text-[10px] font-semibold text-gray-500 tracking-tight">
                Mandi Regulatory Gateway
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Marketplace Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200/90 shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive
                        ? 'text-[#994200]'
                        : item.highlight
                        ? 'text-amber-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Admin Profile & Logout */}
        <div className="p-3 border-t border-gray-100 bg-[#FDFBF7]/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-300">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-gray-500 font-medium truncate">
                  Super Admin • e-NAM
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
