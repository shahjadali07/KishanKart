'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { NotificationItem } from '@/types/admin';
import {
  Bell,
  Send,
  Users,
  CheckCircle,
  Clock,
  User,
  Plus,
  X
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Composer Form
  const [showComposer, setShowComposer] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'ALL' | 'FARMERS' | 'BUYERS' | 'SPECIFIC'>('ALL');
  const [targetUser, setTargetUser] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const list = await adminService.getNotifications();
    setNotifications(list);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    const item = await adminService.createNotification(
      title,
      message,
      audience,
      audience === 'SPECIFIC' ? targetUser : undefined
    );
    showToast(`Broadcast "${title}" published successfully!`);
    setTitle('');
    setMessage('');
    setAudience('ALL');
    setTargetUser('');
    setShowComposer(false);
    setSending(false);
    await loadNotifications();
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
            <h1 className="text-2xl font-bold text-gray-900">Broadcasts & Mandi Alerts</h1>
            <p className="text-xs text-gray-500 mt-1">
              Dispatch push notifications, MSP rate bulletins, and advisory announcements to farmers and buyers
            </p>
          </div>
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Compose Broadcast
          </button>
        </div>

        {/* Composer Modal / Section */}
        {showComposer && (
          <div className="bg-white rounded-xl border border-amber-200 p-6 shadow-md animate-fade-in">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-700" />
                <h2 className="font-bold text-gray-900 text-sm">Create New Marketplace Announcement</h2>
              </div>
              <button
                onClick={() => setShowComposer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Rabi Season Wheat MSP Revision Announced"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                  >
                    <option value="ALL">All Marketplace Users (Farmers & Buyers)</option>
                    <option value="FARMERS">Verified Farmers Only</option>
                    <option value="BUYERS">Registered Wholesale Buyers Only</option>
                    <option value="SPECIFIC">Specific Account ID</option>
                  </select>
                </div>
              </div>

              {audience === 'SPECIFIC' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Specific User ID / Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., FARM-001 or BUY-002"
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Message Content (English / Regional Hindi Supported)
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter message body..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? 'Sending...' : 'Publish Broadcast'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* History Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm">Dispatched Broadcast History</h2>
            <span className="text-xs text-gray-500 font-medium">{notifications.length} Sent</span>
          </div>

          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div key={n.id} className="p-6 hover:bg-gray-50/50 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{n.title}</span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {n.audience === 'ALL'
                        ? 'All Members'
                        : n.audience === 'FARMERS'
                        ? 'Farmers'
                        : n.audience === 'BUYERS'
                        ? 'Buyers'
                        : `Target: ${n.targetUser}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">{n.message}</p>
                </div>

                <div className="flex items-center gap-6 text-xs text-gray-400 shrink-0 self-end md:self-auto">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{n.readCount.toLocaleString('en-IN')} Delivered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{n.sentAt}</span>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="p-12 text-center text-gray-500 text-sm">
                No notification history found.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
