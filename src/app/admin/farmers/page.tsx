'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Farmer, FarmerStatus, KYCStatus } from '@/types/admin';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Ban,
  Trash2,
  ShieldCheck,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [kycFilter, setKycFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [actionModal, setActionModal] = useState<{ type: 'BLOCK' | 'UNBLOCK' | 'DELETE' | 'APPROVE' | 'REJECT'; farmer: Farmer } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadFarmers = async () => {
    const list = await adminService.getFarmers({
      search: searchTerm,
      status: statusFilter,
      kyc: kycFilter,
      state: stateFilter,
    });
    setFarmers(list);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadFarmers();
  }, [searchTerm, statusFilter, kycFilter, stateFilter]);

  const handleActionConfirm = async () => {
    if (!actionModal) return;
    const { type, farmer } = actionModal;

    if (type === 'APPROVE') {
      await adminService.updateFarmerStatus(farmer.id, 'APPROVED');
      showToast(`Farmer "${farmer.name}" approved.`);
    } else if (type === 'BLOCK') {
      await adminService.updateFarmerStatus(farmer.id, 'BLOCKED');
      showToast(`Farmer "${farmer.name}" blocked from marketplace.`);
    } else if (type === 'UNBLOCK') {
      await adminService.updateFarmerStatus(farmer.id, 'APPROVED');
      showToast(`Farmer "${farmer.name}" unblocked.`);
    } else if (type === 'DELETE') {
      await adminService.deleteFarmer(farmer.id);
      showToast(`Farmer "${farmer.name}" removed.`);
    }

    setActionModal(null);
    loadFarmers();
  };

  const totalPages = Math.ceil(farmers.length / itemsPerPage);
  const paginatedFarmers = farmers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-xl animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Header & Sub-navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Farmer Directory & Landholdings
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Manage {farmers.length} registered agrarian producers across state APMC clusters
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/farmers/pending"
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors"
            >
              <span>Pending Approvals</span>
            </Link>
            <Link
              href="/admin/farmers/kyc"
              className="px-3 py-1.5 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs transition-colors shadow-2xs"
            >
              <span>KYC Submissions</span>
            </Link>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search farmer name, phone, village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-amber-600 focus:bg-white"
            >
              <option value="ALL">All Account Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending Approval</option>
              <option value="BLOCKED">Blocked</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-amber-600 focus:bg-white"
            >
              <option value="ALL">All KYC States</option>
              <option value="VERIFIED">KYC Verified</option>
              <option value="PENDING">KYC Pending</option>
              <option value="REJECTED">KYC Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-amber-600 focus:bg-white"
            >
              <option value="ALL">All States</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Punjab">Punjab</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>
        </div>

        {/* Farmers Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Farmer Profile</th>
                  <th className="py-3 px-3">Location & Belt</th>
                  <th className="py-3 px-3">Produce Lots</th>
                  <th className="py-3 px-3">Orders</th>
                  <th className="py-3 px-3">Total Sales</th>
                  <th className="py-3 px-3">KYC Status</th>
                  <th className="py-3 px-3">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-300">
                          {farmer.name.charAt(0)}
                        </div>
                        <div>
                          <Link href={`/admin/farmers/${farmer.id}`} className="font-bold text-gray-900 hover:text-amber-800 block leading-tight">
                            {farmer.name}
                          </Link>
                          <span className="text-[11px] text-gray-500 font-mono">+91 {farmer.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-gray-600">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        {farmer.district}, {farmer.state}
                      </span>
                      <span className="text-[10px] text-gray-400 block">{farmer.village} ({farmer.farmSize})</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-gray-900">{farmer.productsCount} Active</span>
                      <span className="text-[10px] text-gray-400 block truncate max-w-[120px]">{farmer.crops.join(', ')}</span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-gray-800">
                      {farmer.ordersCount} Fulfilled
                    </td>

                    <td className="py-3 px-3 font-extrabold text-[#994200]">
                      ₹{farmer.totalSales.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        farmer.kycStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : farmer.kycStatus === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        <ShieldCheck className="h-3 w-3" />
                        {farmer.kycStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        farmer.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : farmer.status === 'BLOCKED'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {farmer.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/farmers/${farmer.id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>

                        {farmer.status === 'BLOCKED' ? (
                          <button
                            onClick={() => setActionModal({ type: 'UNBLOCK', farmer })}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Unblock Farmer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setActionModal({ type: 'BLOCK', farmer })}
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                            title="Block Farmer"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setActionModal({ type: 'DELETE', farmer })}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Farmer Record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Showing Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {actionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-200 space-y-4">
              <h4 className="text-base font-bold text-gray-900">
                Confirm {actionModal.type} Action
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to {actionModal.type.toLowerCase()} farmer record for &ldquo;<strong>{actionModal.farmer.name}</strong>&rdquo;?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActionModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActionConfirm}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#994200] hover:bg-[#7A3400] text-white shadow-2xs"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
