'use client';

import React, { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import { FarmerOrderStatus } from '@/types/farmer';
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function OrderDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { getOrderById, updateOrderStatus } = useFarmer();

  const order = getOrderById(id);

  if (!order) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 space-y-3">
        <p className="text-sm font-bold text-gray-900">Order not found</p>
        <Link
          href="/farmer/orders"
          className="text-xs font-bold text-[#994200] hover:underline"
        >
          Return to Orders
        </Link>
      </div>
    );
  }

  const STAGES: FarmerOrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = STAGES.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/farmer/orders"
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Contract {order.orderNumber}</span>
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Placed on {new Date(order.orderDate).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex items-center gap-2">
          {order.orderStatus === 'Pending' && (
            <Button
              onClick={() => updateOrderStatus(order.id, 'Confirmed')}
              className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl"
            >
              Confirm Order
            </Button>
          )}
          {order.orderStatus === 'Confirmed' && (
            <Button
              onClick={() => updateOrderStatus(order.id, 'Processing')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
            >
              Start Packing
            </Button>
          )}
          {order.orderStatus === 'Processing' && (
            <Button
              onClick={() => updateOrderStatus(order.id, 'Shipped')}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl"
            >
              Dispatch Consignment
            </Button>
          )}
          {order.orderStatus === 'Shipped' && (
            <Button
              onClick={() => updateOrderStatus(order.id, 'Delivered')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
            >
              Confirm Delivery
            </Button>
          )}
        </div>
      </div>

      {/* 1. Order Timeline Progress */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Procurement & Delivery Timeline</h3>

        <div className="relative flex items-center justify-between">
          {/* Background Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 -z-0" />
          <div
            className="absolute top-4 left-6 h-0.5 bg-[#994200] -z-0 transition-all duration-500"
            style={{
              width: `${currentIndex >= 0 ? (currentIndex / (STAGES.length - 1)) * 100 : 0}%`
            }}
          />

          {STAGES.map((stage, idx) => {
            const isPastOrCurrent = currentIndex >= idx;
            const isCurrent = order.orderStatus === stage;

            return (
              <div key={stage} className="flex flex-col items-center relative z-10 text-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isPastOrCurrent
                      ? 'bg-[#994200] text-white ring-4 ring-amber-100'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isPastOrCurrent ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[11px] mt-2 font-semibold ${
                    isCurrent ? 'text-[#994200] font-bold' : isPastOrCurrent ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timeline Notes Log */}
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Milestone History</span>
          {order.timeline.map((entry, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className="font-bold text-[#994200] min-w-[75px]">{entry.status}:</span>
              <span className="text-gray-600">{entry.note}</span>
              <span className="text-gray-400 ml-auto text-[10px]">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Customer & Delivery Address Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Commercial Buyer Details</h4>
          </div>

          <div className="text-xs space-y-1.5 text-gray-700">
            <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
            {order.customerPhone && (
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span>{order.customerPhone}</span>
              </p>
            )}
            {order.customerEmail && (
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>{order.customerEmail}</span>
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-amber-50 text-[#994200] flex items-center justify-center">
              <MapPin className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Delivery Destination</h4>
          </div>

          <div className="text-xs space-y-1 text-gray-700">
            <p className="font-bold text-gray-900">{order.deliveryAddress.fullName}</p>
            <p className="text-gray-600">{order.deliveryAddress.address}</p>
            <p className="text-gray-600">
              {order.deliveryAddress.city}, {order.deliveryAddress.district}, {order.deliveryAddress.state} - {order.deliveryAddress.pinCode}
            </p>
            <p className="text-gray-500">Contact: {order.deliveryAddress.phone}</p>
          </div>
        </div>
      </div>

      {/* 3. Products & Financial Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h4 className="text-sm font-bold text-gray-900">Contract Items & Weighbridge Rate</h4>
        </div>

        <div className="p-5 space-y-4">
          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-gray-900">{item.productName}</p>
                  <p className="text-gray-500">
                    Quantity: {item.quantity} {item.unit} × ₹{item.pricePerUnit} / {item.unit}
                  </p>
                </div>
                <span className="font-bold text-gray-900 text-sm">
                  ₹{item.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal (Farm-gate Produce)</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery & Hub Logistics</span>
              <span>₹{order.deliveryCharges.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Amount</span>
              <span className="text-[#994200]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/70 flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Payment Status: {order.paymentStatus} via KisanKart Escrow Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <FarmerLayout>
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Loading order details...
          </div>
        }
      >
        <OrderDetailsContent />
      </Suspense>
    </FarmerLayout>
  );
}
