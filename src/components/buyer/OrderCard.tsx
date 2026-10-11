'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BuyerOrder } from '@/types/buyer';
import { useBuyer } from '@/context/BuyerContext';
import {
  Package,
  Calendar,
  Clock,
  ArrowRight,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MapPin
} from 'lucide-react';

interface OrderCardProps {
  order: BuyerOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();
  const { addToCart } = useBuyer();

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    router.push('/buyer/cart');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Out for Delivery':
      case 'Shipped':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Packed':
      case 'Confirmed':
      case 'Placed':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 hover:border-amber-300 p-5 shadow-2xs hover:shadow-xs transition-all space-y-4">
      {/* Top Bar: Order ID, Date, Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-50 text-[#994200] flex items-center justify-center font-bold text-xs">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-gray-900">
                Order #{order.id}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Booked on {order.date}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-extrabold text-gray-900 block">
            ₹{order.total.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">
            Paid via {order.paymentMethod}
          </span>
        </div>
      </div>

      {/* Middle: Items summary */}
      <div className="space-y-2">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 text-xs py-1"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-10 w-10 rounded-lg object-cover bg-gray-100 shrink-0"
              />
              <div className="truncate">
                <p className="font-bold text-gray-900 truncate">
                  {item.product.name}
                </p>
                <p className="text-[11px] text-gray-500">
                  {item.quantity} {item.product.unit} × ₹{item.price} • Farmer:{' '}
                  {item.product.farmer}
                </p>
              </div>
            </div>

            <span className="font-bold text-gray-900 shrink-0">
              ₹{(item.quantity * item.price).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      {/* Delivery Destination Mini Info */}
      <div className="bg-gray-50/70 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
        <span className="flex items-center gap-1.5 truncate max-w-sm">
          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="truncate">
            {order.address.houseStreet}, {order.address.villageCity}
          </span>
        </span>
        <span className="font-semibold text-gray-700 shrink-0">
          {order.deliveryDate}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
        <button
          onClick={handleReorder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reorder
        </button>

        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <Link
            href={`/buyer/orders/${order.id}/track`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-[#994200] text-xs font-bold transition"
          >
            <Truck className="h-3.5 w-3.5" />
            Track Delivery
          </Link>
        )}

        <Link
          href={`/buyer/orders/${order.id}`}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold transition shadow-2xs"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
}
