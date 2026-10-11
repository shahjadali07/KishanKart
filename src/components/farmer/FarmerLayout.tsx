'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { FarmerSidebar } from '@/components/farmer/FarmerSidebar';
import { FarmerHeader } from '@/components/farmer/FarmerHeader';
import { Footer } from '@/components/layout/Footer';
import { useFarmer } from '@/context/FarmerContext';
import {
  LayoutDashboard,
  Sprout,
  Package,
  Layers,
  Users2,
  IndianRupee,
  User
} from 'lucide-react';

interface FarmerLayoutProps {
  children: React.ReactNode;
}

function FarmerLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { orders } = useFarmer();

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
  ).length;

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const mobileNavItems = [
    { name: 'Dashboard', href: '/farmer/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/farmer/products', icon: Sprout },
    { name: 'Orders', href: '/farmer/orders', icon: Package, count: activeOrdersCount },
    { name: 'Inventory', href: '/farmer/inventory', icon: Layers },
    { name: 'Profile', href: '/farmer/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-gray-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Main Flex Layout */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Responsive Farmer Sidebar */}
        <FarmerSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />

        {/* Viewport Content */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Top Header */}
          <FarmerHeader
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            isSidebarCollapsed={sidebarCollapsed}
            onToggleSidebarCollapse={toggleSidebarCollapse}
          />

          {/* Page Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-16">
            {children}
          </main>

          {/* Mobile Bottom Navigation Bar */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-2 py-2 flex items-center justify-around shadow-lg">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/farmer/dashboard' && pathname?.startsWith(item.href));

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

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export function FarmerLayout({ children }: FarmerLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={['FARMER']}>
      <FarmerLayoutContent>{children}</FarmerLayoutContent>
    </ProtectedRoute>
  );
}
