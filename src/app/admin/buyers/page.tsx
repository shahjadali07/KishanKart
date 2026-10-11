'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Buyer } from '@/types/admin';
import {
  Search,
  Building2,
  Eye,
  Ban,
  CheckCircle2,
  Trash2,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionModal, setActionModal] = useState<{ type: 'BLOCK' | 'UNBLOCK' | 'DELETE'; buyer: Buyer } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadBuyers = async () => {
    const list = await adminService.getBuyers({
      search: searchTerm,
      status: statusFilter,
    });
    setBuyers(list);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadBuyers();
  }, [searchTerm, statusFilter]);

  const handleActionConfirm = async () => {
    if (!actionModal) return;
    const { type, buyer } = actionModal;

    if (type === 'BLOCK') {
      await adminService.updateBuyerStatus(buyer.id, 'BLOCKED');
      showToast(`Buyer "${buyer.businessName}" blocked.`);
    } else if (type === 'UNBLOCK') {
      await adminService.updateBuyerStatus(buyer.id, 'ACTIVE');
      showToast(`Buyer "${buyer.businessName}" unblocked.`);
    } else if (type === 'DELETE') {
      await adminService.deleteBuyer(buyer.id);
      showToast(`Buyer "${buyer.businessName}" removed.`);
    }

    setActionModal(null);
    loadBuyers();
  };

  const totalPages = Math.ceil(buyers.length / itemsPerPage);
  const paginatedBuyers = buyers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {toast && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-xl animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span>{toast}</span>
          </div>
        )}

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Enterprise & Institutional Buyer Management
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Review and audit {buyers.length} commercial buyers, hotel chains, and food processing hubs
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by business name, contact person, city..."
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
              <option value="ACTIVE">Active Buyers</option>
              <option value="PENDING">Pending Verification</option>
              <option value="BLOCKED">Blocked Accounts</option>
            </select>
          </div>
        </div>

        {/* Buyers Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Business / Organization</th>
                  <th className="py-3 px-3">Contact Person</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Total Orders</th>
                  <th className="py-3 px-3">Total Spending</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedBuyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <Link href={`/admin/buyers/${buyer.id}`} className="font-bold text-gray-900 hover:text-amber-800 block leading-tight">
                            {buyer.businessName}
                          </Link>
                          <span className="text-[10px] text-gray-400">{buyer.businessType}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-gray-700">
                      <span className="font-semibold block">{buyer.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">+91 {buyer.phone}</span>
                    </td>

                    <td className="py-3 px-3 text-gray-600">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                        {buyer.city}, {buyer.state}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-gray-800">
                      {buyer.totalOrders} Procurement Contracts
                    </td>

                    <td className="py-3 px-3 font-extrabold text-[#994200]">
                      ₹{buyer.totalSpent.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        buyer.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800'
                          : buyer.status === 'BLOCKED'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {buyer.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/buyers/${buyer.id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>

                        {buyer.status === 'BLOCKED' ? (
                          <button
                            onClick={() => setActionModal({ type: 'UNBLOCK', buyer })}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Unblock Buyer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setActionModal({ type: 'BLOCK', buyer })}
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                            title="Block Buyer"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setActionModal({ type: 'DELETE', buyer })}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Buyer"
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
                Are you sure you want to {actionModal.type.toLowerCase()} &ldquo;<strong>{actionModal.buyer.businessName}</strong>&rdquo;?
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
