'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { OrderTimeline } from '@/components/buyer/OrderTimeline';
import {
  ArrowLeft,
  Package,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Truck,
  RotateCcw,
  FileText,
  Star,
  CheckCircle2,
  XCircle,
  Phone,
  ShieldCheck,
  User,
  X
} from 'lucide-react';

function OrderDetailContent() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();

  const { getOrderById, cancelOrder, addToCart } = useBuyer();
  const order = getOrderById(orderId);

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedStars, setSelectedStars] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [ratedSuccess, setRatedSuccess] = useState(false);
  const [invoiceToast, setInvoiceToast] = useState(false);

  if (!order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Order #{orderId} Not Found</h2>
        <p className="text-xs text-gray-500">
          This order does not exist or may have been archived.
        </p>
        <Link
          href="/buyer/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#994200] text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </Link>
      </div>
    );
  }

  const canCancel = order.status === 'Placed' || order.status === 'Confirmed';

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this procurement order? Your escrow deposit will be 100% refunded.')) {
      cancelOrder(order.id);
    }
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    router.push('/buyer/cart');
  };

  const handleDownloadInvoice = () => {
    setInvoiceToast(true);
    setTimeout(() => setInvoiceToast(false), 2500);
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    setRatedSuccess(true);
    setTimeout(() => {
      setRatingModalOpen(false);
      setRatedSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast */}
      {invoiceToast && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
          <FileText className="h-4 w-4 text-emerald-400" />
          GST Tax Invoice & Gate Pass Downloaded (PDF)
        </div>
      )}

      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/buyer/orders"
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-[#994200] border border-amber-200">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Placed on {order.date}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {canCancel && (
            <button
              onClick={handleCancel}
              className="px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition"
            >
              Cancel Order
            </button>
          )}

          <button
            onClick={handleDownloadInvoice}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition shadow-2xs"
          >
            <FileText className="h-3.5 w-3.5" />
            Download Invoice
          </button>

          <button
            onClick={() => setRatingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-[#994200] text-xs font-bold rounded-xl transition"
          >
            <Star className="h-3.5 w-3.5 fill-current" />
            Rate Produce
          </button>

          <button
            onClick={handleReorder}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reorder Lot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main 8 Cols: Produce Lots & Delivery Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items Table Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-gray-900">
                Purchased Farmgate Lots ({order.items.length})
              </h2>
              <span className="text-xs text-gray-400">
                Fulfillment: Verified Direct
              </span>
            </div>

            <div className="divide-y divide-gray-100 p-6 space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 first:pt-0">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-2xl object-cover bg-gray-100 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {item.product.category}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm mt-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Farmer: <strong>{item.product.farmer}</strong> • {item.product.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-gray-900 block">
                      ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.quantity} {item.product.unit} × ₹{item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="bg-gray-50/70 p-6 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Freight & Delivery</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Mandi Volume Discount</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-base text-gray-900">
                <span>Total Paid</span>
                <span className="text-[#994200]">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery Timeline Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#994200]" />
                <h3 className="font-bold text-sm text-gray-900">
                  Live Consignment Progress
                </h3>
              </div>
              <Link
                href={`/buyer/orders/${order.id}/track`}
                className="text-xs font-bold text-[#994200] hover:text-[#7A3400]"
              >
                Open Full Tracking View →
              </Link>
            </div>

            <OrderTimeline
              timeline={order.timeline}
              currentStatus={order.status}
            />
          </div>
        </div>

        {/* Right 4 Cols: Address, Payment, Farmer Contact */}
        <div className="lg:col-span-4 space-y-6">
          {/* Destination Address */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 pb-2 border-b border-gray-100">
              <MapPin className="h-4 w-4 text-[#994200]" />
              <span>Delivery Facility Address</span>
            </div>

            <div className="text-xs space-y-1">
              <span className="font-bold text-gray-900 block">{order.address.fullName}</span>
              <p className="text-gray-600 leading-relaxed">
                {order.address.houseStreet}, {order.address.villageCity}, {order.address.district}, {order.address.state} - {order.address.pinCode}
              </p>
              <p className="text-gray-400 font-mono pt-1">Phone: {order.address.phone}</p>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 pb-2 border-b border-gray-100">
              <CreditCard className="h-4 w-4 text-[#994200]" />
              <span>Payment Information</span>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Method:</span>
                <span className="font-bold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Escrow Security:</span>
                <span className="font-semibold text-gray-700">ICICI Mandi Lock</span>
              </div>
            </div>
          </div>

          {/* Farmer Producer Info */}
          <div className="bg-amber-50/60 rounded-3xl border border-amber-200/80 p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#994200]">
              <User className="h-4 w-4" />
              <span>Farmer Contact & Support</span>
            </div>

            <div className="text-xs space-y-2 text-amber-950">
              <p className="font-bold">{order.items[0]?.product.farmer}</p>
              <p className="flex items-center gap-1.5 text-gray-700">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                {order.farmerContact}
              </p>
              <p className="text-[11px] text-gray-500 pt-1">
                Dispatched via {order.deliveryPartner}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Rate Product */}
      {ratingModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Rate Consignment Quality</h3>
              <button
                onClick={() => setRatingModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {ratedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-gray-900 text-sm">Rating Submitted!</p>
                <p className="text-xs text-gray-500">Thank you for rating farmer {order.items[0]?.product.farmer}.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRating} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Quality & Grading Rating:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setSelectedStars(star)}
                        className={`p-2 rounded-xl transition ${
                          selectedStars >= star ? 'text-amber-500' : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Feedback Comments:</label>
                  <textarea
                    rows={3}
                    placeholder="Enter moisture, grading, or packaging feedback..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRatingModalOpen(false)}
                    className="px-4 py-2 border rounded-xl text-gray-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#994200] text-white rounded-xl font-bold shadow-xs"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyerOrderDetailPage() {
  return (
    <BuyerLayout>
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Loading order details & fulfillment timeline...
          </div>
        }
      >
        <OrderDetailContent />
      </Suspense>
    </BuyerLayout>
  );
}
