'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Complaint, ComplaintStatus, ComplaintType } from '@/types/admin';
import {
  AlertCircle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MessageSquare,
  ShieldAlert,
  X,
  Send,
  User
} from 'lucide-react';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Response / Resolution Modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('Resolved');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    const list = await adminService.getComplaints();
    setComplaints(list);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setResponseText(c.adminResponse || '');
    setNewStatus(c.status === 'Resolved' ? 'Resolved' : 'In Review');
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setSubmitting(true);
    const ok = await adminService.resolveComplaint(selectedComplaint.id, responseText, newStatus);
    if (ok) {
      showToast(`Complaint #${selectedComplaint.ticketNumber} updated to ${newStatus}`);
      setSelectedComplaint(null);
      await loadComplaints();
    }
    setSubmitting(false);
  };

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.raisedBy.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'In Review':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Open':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Rejected':
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
            <h1 className="text-2xl font-bold text-gray-900">Complaints & Dispute Resolution</h1>
            <p className="text-xs text-gray-500 mt-1">
              Arbitrate quality discrepancies, weighbridge disputes, transit delays, and payment claims
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search Ticket, Subject, Party..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
              >
                <option value="ALL">All Issue Types</option>
                <option value="Product_Quality">Product Quality</option>
                <option value="Delivery_Delay">Delivery Delay</option>
                <option value="Payment_Dispute">Payment Dispute</option>
                <option value="Weight_Discrepancy">Weight Discrepancy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="Open">Open</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Ticket ID</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Raised By</th>
                  <th className="px-6 py-3">Subject & Details</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{c.ticketNumber}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-medium text-xs border border-amber-200">
                        {c.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-xs">{c.raisedBy}</div>
                      <div className="text-[11px] text-gray-500">{c.raisedByRole}</div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-semibold text-gray-900 text-xs">{c.subject}</div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{c.description}</p>
                      {c.adminResponse && (
                        <div className="mt-2 text-xs bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-200">
                          <strong>Admin Reply:</strong> {c.adminResponse}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{c.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No complaints found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resolution Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-700" />
                  <h3 className="font-bold text-gray-900 text-sm">
                    Arbitrate Ticket {selectedComplaint.ticketNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleResolve} className="p-6 space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                  <div><strong>Party:</strong> {selectedComplaint.raisedBy} ({selectedComplaint.raisedByRole})</div>
                  <div><strong>Subject:</strong> {selectedComplaint.subject}</div>
                  <div className="text-gray-600 pt-1 border-t border-gray-200 mt-1">{selectedComplaint.description}</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Update Resolution Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                  >
                    <option value="In Review">In Review (Investigating Mandi/Transport logs)</option>
                    <option value="Resolved">Resolved (Settled / Refund Approved)</option>
                    <option value="Rejected">Rejected (Claim Unsubstantiated)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Admin Response & Resolution Memo
                  </label>
                  <textarea
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Document arbitration ruling, escrow adjustments or corrective steps..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-sm"
                  >
                    {submitting ? 'Saving...' : 'Save Resolution'}
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
