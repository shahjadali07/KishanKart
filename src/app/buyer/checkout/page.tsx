'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { BuyerAddress } from '@/types/buyer';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Truck,
  ArrowRight,
  ChevronRight,
  Smartphone,
  Banknote,
  Building,
  X
} from 'lucide-react';

export default function BuyerCheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    deliveryCharge,
    discount,
    cartTotal,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    placeOrder
  } = useBuyer();

  // Step 1: Address
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newState, setNewState] = useState('Uttar Pradesh');
  const [newPin, setNewPin] = useState('');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Work');

  // Step 2: Payment
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Net Banking'
  >('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <BuyerLayout>
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500">
            Please select produce lots from the catalog before proceeding to checkout.
          </p>
          <Link
            href="/buyer/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#994200] text-white text-xs font-bold rounded-xl"
          >
            Browse Products
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newStreet) return;
    addAddress({
      fullName: newFullName,
      phone: newPhone,
      houseStreet: newStreet,
      villageCity: newCity,
      district: newDistrict,
      state: newState,
      pinCode: newPin,
      type: newType,
      isDefault: true
    });
    setShowAddressModal(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery destination address.');
      return;
    }

    setIsProcessing(true);
    // Simulate swift 800ms mock escrow verification
    setTimeout(() => {
      const order = placeOrder({
        address: selectedAddress,
        paymentMethod
      });
      setIsProcessing(false);
      router.push(`/buyer/orders/${order.id}`);
    }, 800);
  };

  return (
    <BuyerLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-2 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Checkout & Escrow Authorization
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Step-by-step mandi order placement with insured freight and bank escrow guarantee
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 1. Address, 2. Summary, 3. Payment (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Delivery Address */}
            <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 rounded-full bg-[#994200] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-extrabold text-sm sm:text-base text-gray-900">
                    Delivery Warehouse / Facility Address
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddressModal(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#994200] hover:text-[#7A3400]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add New Address
                </button>
              </div>

              {/* Address options grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#994200] bg-amber-50/40 ring-2 ring-[#994200]/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {addr.type}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] font-bold text-[#994200] flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-900 text-xs">{addr.fullName}</p>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                        {addr.houseStreet}, {addr.villageCity}, {addr.district}, {addr.state} - {addr.pinCode}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">{addr.phone}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Order Lots Review Preview */}
            <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <span className="h-6 w-6 rounded-full bg-[#994200] text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="font-extrabold text-sm sm:text-base text-gray-900">
                  Consignment Items ({cart.length} lots)
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-10 w-10 rounded-xl object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{item.product.name}</p>
                        <p className="text-[11px] text-gray-500">
                          {item.quantity} {item.product.unit} × ₹{item.product.price} • {item.product.farmer}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      ₹{(item.quantity * item.product.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 3: Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <span className="h-6 w-6 rounded-full bg-[#994200] text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="font-extrabold text-sm sm:text-base text-gray-900">
                  Payment & Escrow Lock Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'UPI'
                      ? 'border-[#994200] bg-amber-50/40 ring-2 ring-[#994200]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 accent-[#994200]"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-[#994200]" />
                      <span className="font-bold text-xs text-gray-900">UPI Instant Mandi Pay</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                        Zero Fee
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Google Pay, PhonePe, Paytm, or BHIM. Instant digital receipt.
                    </p>
                  </div>
                </label>

                {/* Card Option */}
                <label
                  onClick={() => setPaymentMethod('Credit/Debit Card')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'Credit/Debit Card'
                      ? 'border-[#994200] bg-amber-50/40 ring-2 ring-[#994200]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Credit/Debit Card'}
                    onChange={() => setPaymentMethod('Credit/Debit Card')}
                    className="mt-1 accent-[#994200]"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-[#994200]" />
                      <span className="font-bold text-xs text-gray-900">Corporate & Debit Cards</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Visa, Mastercard, RuPay Corporate Agri cards supported.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery / Delivery Inspection Option */}
                <label
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#994200] bg-amber-50/40 ring-2 ring-[#994200]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 accent-[#994200]"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-[#994200]" />
                      <span className="font-bold text-xs text-gray-900">Pay on Gate Inspection</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Pay via RTGS/NEFT/Cash after weighbridge check at warehouse gate.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Button (4 cols) */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100">
                Final Bill Calculation
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Lots Gross Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Logistics & Freight</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Mandi Volume Discount</span>
                    <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Payable Total</span>
                  <span className="text-2xl font-black text-[#994200]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-4 bg-[#994200] hover:bg-[#7A3400] text-white text-xs sm:text-sm font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing Escrow...</span>
                ) : (
                  <>
                    <span>Place Order & Authorize</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#994200]" />
                  <span>KisanKart 100% Escrow Guarantee</span>
                </div>
                <p className="text-amber-900/80 leading-relaxed">
                  Your funds are locked in ICICI Mandi Escrow. Farmer is paid only after weighbridge inspection clearance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add New Address */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">Add Warehouse Destination</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddNewAddress} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Company / Facility Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma Foods Hub 2"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Plot / Street / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="Plot 10, Mandi Road"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">City / Mandi</label>
                    <input
                      type="text"
                      required
                      placeholder="Lucknow"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      required
                      placeholder="Lucknow"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      placeholder="226012"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Facility Type</label>
                  <div className="flex gap-2">
                    {(['Work', 'Home', 'Other'] as const).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setNewType(t)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                          newType === t
                            ? 'bg-[#994200] text-white border-[#994200]'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 border rounded-xl text-gray-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#994200] text-white rounded-xl font-bold shadow-xs"
                  >
                    Save & Select
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}
