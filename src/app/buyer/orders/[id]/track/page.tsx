'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { OrderTimeline } from '@/components/buyer/OrderTimeline';
import {
  ArrowLeft,
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Package,
  User,
  Navigation
} from 'lucide-react';

function TrackDeliveryContent() {
  const params = useParams();
  const orderId = params?.id as string;

  const { getOrderById } = useBuyer();
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Consignment Not Found</h2>
        <p className="text-xs text-gray-500">
          Tracking records for order #{orderId} could not be retrieved.
        </p>
        <Link
          href="/buyer/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#994200] text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href={`/buyer/orders/${order.id}`}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Track Delivery: {order.id}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Waybill / Docket: <strong className="font-mono text-gray-700">{order.trackingNumber}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Hero Transit Card with Delivery ETA */}
      <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-100 text-[#994200] flex items-center justify-center shrink-0 shadow-2xs">
              <Truck className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Estimated Warehouse Arrival
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                {order.deliveryDate}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Carrier Partner: <strong className="text-gray-900">{order.deliveryPartner}</strong>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 block uppercase">
              Consignment Status
            </span>
            <span className="text-sm font-bold text-[#994200] block mt-0.5">
              {order.status === 'Out for Delivery' ? 'En-route to Gate' : order.status}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
              GPS Freight Tracked
            </span>
          </div>
        </div>

        {/* Route Details (Origin Farmgate -> Destination) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-200/60 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400 font-medium">
              <Navigation className="h-3.5 w-3.5 text-[#994200]" />
              <span>Origin Farmgate Hub</span>
            </div>
            <p className="font-bold text-gray-900">
              {order.items[0]?.product.farmer} ({order.items[0]?.product.location})
            </p>
            <p className="text-gray-500 text-[11px]">APMC Mandi Yard: {order.items[0]?.product.mandi}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400 font-medium">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>Destination Receiving Facility</span>
            </div>
            <p className="font-bold text-gray-900">
              {order.address.fullName}
            </p>
            <p className="text-gray-500 text-[11px] truncate">
              {order.address.houseStreet}, {order.address.villageCity}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Timeline Steps */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#994200]" />
            <h3 className="font-bold text-sm sm:text-base text-gray-900">
              Milestone Audit Log
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Escrow Protected
          </span>
        </div>

        <OrderTimeline
          timeline={order.timeline}
          currentStatus={order.status}
        />
      </div>

      {/* Support / Contact Footer */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600">
        <div>
          <span className="font-bold text-gray-900 block">Need assistance with this consignment?</span>
          <span>Contact the logistics control desk or assigned farmer representative.</span>
        </div>
        <a
          href={`tel:${order.farmerContact}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-xl font-bold text-gray-800 hover:bg-gray-50 shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Phone className="h-3.5 w-3.5 text-gray-500" />
          Call Mandi Desk
        </a>
      </div>
    </div>
  );
}

export default function TrackDeliveryPage() {
  return (
    <BuyerLayout>
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Loading freight tracking telemetry...
          </div>
        }
      >
        <TrackDeliveryContent />
      </Suspense>
    </BuyerLayout>
  );
}
