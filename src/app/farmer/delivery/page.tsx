'use client';

import React, { useState } from 'react';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import {
  Truck,
  Package,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function FarmerDeliveryPage() {
  const { deliveries, updateDeliveryStatus } = useFarmer();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filteredDeliveries = deliveries.filter((d) => {
    if (activeFilter === 'READY') return d.deliveryStatus === 'Ready for Pickup';
    if (activeFilter === 'SCHEDULED') return d.deliveryStatus === 'Pickup Scheduled';
    if (activeFilter === 'TRANSIT') return d.deliveryStatus === 'In Transit';
    if (activeFilter === 'DELIVERED') return d.deliveryStatus === 'Delivered';
    return true;
  });

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>🚚</span>
              <span>Delivery & Fleet Logistics</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Live farm-gate vehicle pick-ups, weighbridge transit tracking, and carrier partners
            </p>
          </div>

          <span className="text-xs font-bold text-gray-500 self-start sm:self-auto">
            Active Dispatches: <strong className="text-gray-900">{deliveries.length}</strong>
          </span>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { label: 'All Dispatches', key: 'ALL' },
            { label: 'Ready for Pickup', key: 'READY' },
            { label: 'Pickup Scheduled', key: 'SCHEDULED' },
            { label: 'In Transit', key: 'TRANSIT' },
            { label: 'Delivered', key: 'DELIVERED' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeFilter === tab.key
                  ? 'bg-[#994200] text-white shadow-2xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Deliveries List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDeliveries.map((del) => {
            const isInTransit = del.deliveryStatus === 'In Transit';
            const isDelivered = del.deliveryStatus === 'Delivered';

            return (
              <div
                key={del.id}
                className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4 hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-gray-900">
                          {del.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#994200] border border-amber-200">
                          {del.logisticsPartner}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        Buyer: {del.customerName}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isInTransit
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {del.deliveryStatus}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <span>{del.deliveryAddress}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-amber-900 font-semibold">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <span>Expected: {del.expectedDelivery}</span>
                    </p>

                    {del.driverName && (
                      <div className="p-2.5 bg-gray-50 rounded-xl mt-2 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-gray-900">Driver: {del.driverName}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{del.vehicleNumber}</p>
                        </div>
                        {del.driverPhone && (
                          <a
                            href={`tel:${del.driverPhone}`}
                            className="p-1.5 bg-white border border-gray-200 hover:border-amber-300 rounded-lg text-[#994200] transition"
                            title="Call Driver"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Toggle helper */}
                {!isDelivered && (
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    {del.deliveryStatus === 'Ready for Pickup' && (
                      <button
                        onClick={() => updateDeliveryStatus(del.id, 'Pickup Scheduled')}
                        className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition"
                      >
                        Schedule Pickup
                      </button>
                    )}
                    {del.deliveryStatus === 'Pickup Scheduled' && (
                      <button
                        onClick={() => updateDeliveryStatus(del.id, 'In Transit')}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
                      >
                        Mark In Transit
                      </button>
                    )}
                    {del.deliveryStatus === 'In Transit' && (
                      <button
                        onClick={() => updateDeliveryStatus(del.id, 'Delivered')}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition"
                      >
                        Confirm Delivered
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </FarmerLayout>
  );
}
