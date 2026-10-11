'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Delivery, DeliveryStatus } from '@/types/admin';
import {
  Truck,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Shield,
  X,
  Edit2
} from 'lucide-react';

export default function LogisticsPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal for reassigning partner
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [partnerInput, setPartnerInput] = useState('');
  const [driverInput, setDriverInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setLoading(true);
    const list = await adminService.getDeliveries();
    setDeliveries(list);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openReassignModal = (del: Delivery) => {
    setSelectedDelivery(del);
    setPartnerInput(del.deliveryPartner);
    setDriverInput(del.driverName);
    setPhoneInput(del.driverPhone);
  };

  const handleReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;
    setSubmitting(true);
    const ok = await adminService.reassignDeliveryPartner(
      selectedDelivery.id,
      partnerInput,
      driverInput,
      phoneInput
    );
    if (ok) {
      showToast(`Logistics partner updated to ${partnerInput} for Order ${selectedDelivery.orderId}`);
      setSelectedDelivery(null);
      await loadDeliveries();
    }
    setSubmitting(false);
  };

  const activeCount = deliveries.filter(d => d.status === 'In_Transit' || d.status === 'Dispatched' || d.status === 'Out_For_Delivery').length;
  const pendingCount = deliveries.filter(d => d.status === 'Pending_Pickup').length;
  const deliveredCount = deliveries.filter(d => d.status === 'Delivered').length;
  const failedCount = deliveries.filter(d => d.status === 'Failed_Attempt').length;

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.orderId.toLowerCase().includes(search.toLowerCase()) ||
      d.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      d.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      d.deliveryPartner.toLowerCase().includes(search.toLowerCase()) ||
      d.driverName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'In_Transit':
      case 'Dispatched':
      case 'Out_For_Delivery':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Pending_Pickup':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Failed_Attempt':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-gray-700 animate-fade-in text-sm font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mandi Logistics & Freight Fleet</h1>
            <p className="text-xs text-gray-500 mt-1">
              Farm-to-hub cold chain dispatch, truck allocation, and live e-Way Bill tracking
            </p>
          </div>
        </div>

        {/* Status Counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Active Shipments</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{activeCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">En-route to Hubs</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Pending Pickup</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">At Farmer Farmgate</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Delivered Successfully</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{deliveredCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">Escrow Disbursed</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Failed / Delayed</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{failedCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">Escalated to Support</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl text-red-700">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search Order, Buyer, Driver, Truck..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs w-full md:w-auto">
            <span className="text-gray-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
            >
              <option value="ALL">All Delivery Statuses</option>
              <option value="Pending_Pickup">Pending Pickup</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In_Transit">In Transit</option>
              <option value="Out_For_Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed_Attempt">Failed Attempt</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Buyer & Farmer</th>
                  <th className="px-6 py-3">Fleet Partner & Driver</th>
                  <th className="px-6 py-3">Route (Pickup → Drop)</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Expected ETA</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${d.orderId}`}
                        className="font-mono text-xs font-bold text-amber-700 hover:text-amber-800"
                      >
                        {d.orderId}
                      </Link>
                      <div className="text-[11px] text-gray-400 mt-0.5">{d.vehicleNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-xs">{d.buyerName}</div>
                      <div className="text-xs text-gray-500">From: {d.farmerName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-xs">{d.deliveryPartner}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-gray-400" />
                        {d.driverName} ({d.driverPhone})
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">
                      <div><strong className="text-gray-700">From:</strong> {d.pickupLocation}</div>
                      <div className="mt-0.5"><strong className="text-gray-700">To:</strong> {d.destinationLocation}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(d.status)}`}>
                        {d.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 font-medium">{d.expectedDelivery}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openReassignModal(d)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Reassign
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No matching shipments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reassign Modal */}
        {selectedDelivery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-700" />
                  <h3 className="font-bold text-gray-900 text-sm">
                    Reassign Logistics Partner ({selectedDelivery.orderId})
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReassign} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Logistics Fleet Provider
                  </label>
                  <select
                    value={partnerInput}
                    onChange={(e) => setPartnerInput(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                    required
                  >
                    <option value="AgriLogix Express">AgriLogix Express (Cold Chain)</option>
                    <option value="Kisan Cargo Fleet">Kisan Cargo Fleet (Heavy Trailer)</option>
                    <option value="Delhivery Freight">Delhivery Freight (National Mandi)</option>
                    <option value="Rivigo Mandi Logistics">Rivigo Mandi Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Assigned Driver Name
                  </label>
                  <input
                    type="text"
                    value={driverInput}
                    onChange={(e) => setDriverInput(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Driver Mobile Number
                  </label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedDelivery(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-sm"
                  >
                    {submitting ? 'Updating...' : 'Confirm Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
