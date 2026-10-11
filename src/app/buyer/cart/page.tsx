'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { EmptyState } from '@/components/buyer/EmptyState';
import {
  ShoppingCart,
  Trash2,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2
} from 'lucide-react';

export default function BuyerCartPage() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isInWishlist,
    cartSubtotal,
    deliveryCharge,
    discount,
    cartTotal
  } = useBuyer();

  if (cart.length === 0) {
    return (
      <BuyerLayout>
        <EmptyState
          icon={ShoppingCart}
          title="Your Procurement Cart is Empty"
          description="Browse direct farm-gate commodity lots from verified farmers across Uttar Pradesh, Punjab, and Maharashtra."
          actionText="Browse Fresh Produce"
          actionHref="/buyer/products"
        />
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Procurement Cart ({cart.length} lots)
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review selected produce lots, quantities, and mandi gate pass requisitions
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition self-start sm:self-auto"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Two Columns: Cart Items List & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart Items (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const isFavorited = isInWishlist(item.product.id);
              const subtotal = item.product.price * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs hover:border-amber-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Image & Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover bg-gray-100 shrink-0"
                    />

                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-[#994200] rounded-md border border-amber-200/70">
                        {item.product.category}
                      </span>
                      <Link
                        href={`/buyer/products/${item.product.id}`}
                        className="block font-bold text-gray-900 text-sm hover:text-[#994200] truncate transition"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Farmer: <strong className="text-gray-700">{item.product.farmer}</strong> • {item.product.location}
                      </p>
                      <div className="text-xs font-bold text-gray-900 pt-0.5">
                        ₹{item.product.price.toLocaleString('en-IN')}/{item.product.unit}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity controls & subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Item Total */}
                    <div className="text-right">
                      <span className="text-base font-extrabold text-gray-900 block">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {item.quantity} {item.product.unit}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - (item.product.minOrderQty > 1 ? 5 : 1)
                          )
                        }
                        className="h-7 w-7 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-12 text-center text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + (item.product.minOrderQty > 1 ? 5 : 1)
                          )
                        }
                        className="h-7 w-7 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Move to Wishlist / Remove */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => toggleWishlist(item.product.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          isFavorited
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'border-gray-200 text-gray-400 hover:text-red-600 hover:bg-gray-50'
                        }`}
                        title="Save to Wishlist"
                      >
                        <Heart className={`h-3.5 w-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Remove Lot"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
                Order Billing Summary
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Produce Lots Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Farm-to-Hub Freight / Transit</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE (Bulk Waived)</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Mandi Volume Discount (5%)</span>
                    <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Total Invoice Due</span>
                  <span className="text-2xl font-black text-[#994200]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/buyer/checkout')}
                className="w-full py-3.5 bg-[#994200] hover:bg-[#7A3400] text-white text-xs sm:text-sm font-bold rounded-2xl transition shadow-xs flex items-center justify-center gap-2 active:scale-95"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="pt-2 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>ICICI Bank Agri-Escrow Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Insured transit with digital e-Way Bill</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
