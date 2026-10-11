'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBuyer } from '@/context/BuyerContext';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  Store,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BuyerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function BuyerSidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse
}: BuyerSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { cartCount, wishlistCount, unreadNotificationsCount } = useBuyer();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/buyer/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Browse Products',
      href: '/buyer/products',
      icon: ShoppingBag,
      badge: 'Fresh'
    },
    {
      name: 'Cart',
      href: '/buyer/cart',
      icon: ShoppingCart,
      badge: cartCount > 0 ? cartCount : null
    },
    {
      name: 'Wishlist',
      href: '/buyer/wishlist',
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : null
    },
    {
      name: 'My Orders',
      href: '/buyer/orders',
      icon: Package,
      badge: null
    },
    {
      name: 'Track Delivery',
      href: '/buyer/orders',
      icon: Truck,
      badge: null
    },
    {
      name: 'Addresses',
      href: '/buyer/addresses',
      icon: MapPin,
      badge: null
    },
    {
      name: 'Payments',
      href: '/buyer/payments',
      icon: CreditCard,
      badge: null
    },
    {
      name: 'Notifications',
      href: '/buyer/notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    {
      name: 'Profile',
      href: '/buyer/profile',
      icon: User,
      badge: null
    },
    {
      name: 'Settings',
      href: '/buyer/settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-amber-900/10 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 px-4 border-b border-gray-100 flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <Link
            href="/buyer/dashboard"
            onClick={onClose}
            className={`flex items-center gap-2 group ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="KisanKart Buyer Mandi Desk"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#994200] to-[#7A3400] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Store className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-lg text-gray-900 tracking-tight leading-none">
                  Kisan<span className="text-[#994200]">Kart</span>
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5 truncate">
                  Buyer Mandi Desk
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            title="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Marketplace
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/buyer/dashboard' &&
                item.href !== '/buyer/orders' &&
                pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2.5'
                } rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-amber-50 text-[#994200] font-bold shadow-2xs border border-amber-200/60'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <div className="relative">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-[#994200]' : 'text-gray-400'
                      }`}
                    />
                    {isCollapsed && item.badge !== null && (
                      <span className="absolute -top-1.5 -right-2 h-2 w-2 rounded-full bg-[#994200] ring-2 ring-white" />
                    )}
                  </div>
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!isCollapsed && item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-[#994200] text-white'
                        : 'bg-amber-100 text-[#994200]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Collapse / Expand Toggle Button at bottom of sidebar */}
        {onToggleCollapse && (
          <div className="hidden lg:block px-3 py-2 border-t border-gray-100">
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar' : 'Hide / Collapse sidebar'}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-colors"
            >
              {isCollapsed ? (
                <>
                  <ChevronRight className="h-4 w-4 text-[#994200]" />
                  <span className="sr-only">Expand sidebar</span>
                </>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 text-[#994200]" />
                  <span>Hide Sidebar</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Bottom User Profile & Logout */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/60">
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center p-1.5' : 'justify-between p-2'
            } rounded-xl bg-white border border-gray-200/80 shadow-2xs`}
          >
            <Link
              href="/buyer/profile"
              onClick={onClose}
              title={isCollapsed ? (user?.name || 'Sharma Foods Ltd.') : undefined}
              className={`flex items-center gap-2.5 ${
                isCollapsed ? 'justify-center' : 'min-w-0'
              }`}
            >
              <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() || 'SF'}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {user?.name || 'Sharma Foods Ltd.'}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium truncate">
                    Verified Enterprise Buyer
                  </p>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
