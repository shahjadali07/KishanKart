'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import { FarmerCustomer } from '@/types/farmer';
import {
  Users2,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  ChevronRight,
  Package
} from 'lucide-react';

export default function FarmerCustomersPage() {
  const { customers, orders } = useFarmer();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<FarmerCustomer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>👥</span>
              <span>Commercial Buyers & Customers</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Verified mandi traders, restaurants, and retail distribution centers procuring from your farm
            </p>
          </div>

          <div className="text-xs font-bold text-gray-500">
            Total Customers: <span className="text-gray-900">{customers.length}</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by enterprise buyer name or city location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
            />
          </div>
        </div>

        {/* Customers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCustomers.map((c) => {
            const customerOrders = orders.filter((o) => o.customerName === c.name);

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-800 font-black text-xs flex items-center justify-center shrink-0 border border-blue-200">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{c.name}</h3>
                        <p className="text-[11px] text-gray-500">{c.businessType || 'Wholesale Buyer'}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#994200] border border-amber-200/80">
                      {c.totalOrders} Orders
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600 pt-2 border-t border-gray-100">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <span>{c.location}</span>
                    </p>
                    {c.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        <span>{c.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Lifetime Sourcing</span>
                    <span className="font-extrabold text-[#994200]">₹{c.totalSpending.toLocaleString('en-IN')}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#994200]">
                    View Purchases
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Purchase History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-gray-500">{selectedCustomer.location}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 block font-bold text-[10px]">Total Contracts:</span>
                <span className="font-bold text-gray-900">{selectedCustomer.totalOrders} fulfilled</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold text-[10px]">Total Revenue:</span>
                <span className="font-black text-[#994200]">₹{selectedCustomer.totalSpending.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Related Orders</span>
              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {orders
                  .filter((o) => o.customerName === selectedCustomer.name)
                  .map((ord) => (
                    <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-mono font-bold text-gray-900">{ord.orderNumber}</p>
                        <p className="text-[10px] text-gray-500">{new Date(ord.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#994200]">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                        <span className="block text-[10px] text-gray-500">{ord.orderStatus}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
}
