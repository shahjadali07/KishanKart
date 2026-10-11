'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBuyer } from '@/context/BuyerContext';
import { BuyerSidebar } from './BuyerSidebar';
import { BuyerHeader } from './BuyerHeader';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Package,
  User
} from 'lucide-react';

interface BuyerLayoutProps {
  children: React.ReactNode;
}

function BuyerLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useBuyer();

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const mobileNavItems = [
    { name: 'Home', href: '/buyer/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/buyer/products', icon: ShoppingBag },
    { name: 'Cart', href: '/buyer/cart', icon: ShoppingCart, count: cartCount },
    { name: 'Orders', href: '/buyer/orders', icon: Package },
    { name: 'Profile', href: '/buyer/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-gray-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Sidebar (Desktop Persistent / Collapsible, Mobile Drawer) */}
      <BuyerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content Viewport */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <BuyerHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isSidebarCollapsed={sidebarCollapsed}
          onToggleSidebarCollapse={toggleSidebarCollapse}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-16">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-2 py-2 flex items-center justify-around shadow-lg">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/buyer/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
                  isActive ? 'text-[#994200] font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1 -right-2 h-4 w-4 bg-[#994200] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function BuyerLayout({ children }: BuyerLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={['BUYER']}>
      <BuyerLayoutContent>{children}</BuyerLayoutContent>
    </ProtectedRoute>
  );
}
