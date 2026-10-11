'use client';

import React, { useState, useEffect } from 'react';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import { FarmerOffer } from '@/types/farmer';
import {
  Tag,
  Plus,
  Percent,
  Calendar,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FarmerOffersPage() {
  const { offers, products, addOffer, updateOffer, deleteOffer } = useFarmer();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states with deterministic SSR-safe defaults
  const [offerName, setOfferName] = useState('');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed Amount'>('Percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-26');
  const [maximumUsage, setMaximumUsage] = useState<number>(20);

  // Defer dynamic date evaluation to client effect
  useEffect(() => {
    try {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const futureStr = new Date(now.getTime() + 14 * 86400000).toISOString().split('T')[0];
      setStartDate(todayStr);
      setEndDate(futureStr);
    } catch (e) {
      // Keep safe fallback
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === productId);
    addOffer({
      offerName,
      productId,
      productName: prod?.name || 'Selected Crop',
      discountType,
      discountValue: Number(discountValue),
      startDate,
      endDate,
      maximumUsage: Number(maximumUsage),
      status: 'Active'
    });

    setIsModalOpen(false);
    setOfferName('');
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>🏷️</span>
              <span>Offers & Bulk Promotions</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Offer harvest volume incentives to lock high-value buyer forward contracts
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create Promo Offer</span>
          </Button>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => {
            const isActive = offer.status === 'Active';

            return (
              <div
                key={offer.id}
                className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4 hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#994200] flex items-center justify-center shrink-0">
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{offer.offerName}</h3>
                        <p className="text-[11px] text-gray-500">{offer.productName}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </div>

                  {/* Discount Value Badge */}
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs">
                    <span className="font-bold text-gray-700">Discount: </span>
                    <strong className="text-base font-black text-[#994200]">
                      {offer.discountType === 'Percentage'
                        ? `${offer.discountValue}% OFF`
                        : `₹${offer.discountValue} OFF / unit`}
                    </strong>
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-500">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span>Valid: {offer.startDate} to {offer.endDate}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>Usage: {offer.timesUsed} of {offer.maximumUsage} bookings used</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      updateOffer(offer.id, {
                        status: isActive ? 'Inactive' : 'Active'
                      })
                    }
                    className="text-xs font-bold text-gray-700 hover:text-gray-900"
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => deleteOffer(offer.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                    title="Delete Offer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Create Promotional Offer</h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Offer Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festival Mandi Bulk Incentive"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Applicable Crop</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price}/{p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Max Bookings Allowed</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={maximumUsage}
                  onChange={(e) => setMaximumUsage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 text-xs h-9 rounded-xl border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-xs h-9 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white font-bold"
                >
                  Publish Offer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
}
