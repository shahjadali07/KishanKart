'use client';

import React, { useState } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, IndianRupee, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DealLockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DealLockModal({ isOpen, onClose }: DealLockModalProps) {
  const [locked, setLocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleLockDeal = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setLocked(true);
      setTimeout(() => {
        setLocked(false);
        onClose();
      }, 1600);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#FDF4EA] text-[#8C3A00] flex items-center justify-center">
            <Lock className="h-5 w-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900 leading-tight">Review & Lock Escrow Deal</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-300">
                96% Match
              </span>
            </div>
            <p className="text-xs text-gray-500">Patanjali Fresh Outlet • Aliganj Point (11 km)</p>
          </div>
        </div>

        {locked ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-gray-900">Deal Locked & Escrow Funded!</h4>
            <p className="text-xs text-gray-500">₹11,600 held in ICICI Escrow. Logistics pickup scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-medium">
            <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-amber-950 font-bold">
                <span>Produce: 400 kg Red Hybrid Tomatoes</span>
                <span className="text-sm">₹29.00 / kg</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 pt-1 border-t border-amber-200/60">
                <span>Total Contract Value:</span>
                <span className="text-sm font-black text-amber-900">₹11,600.00</span>
              </div>
            </div>

            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Buyer has pre-deposited ₹11,600 into ICICI Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Disbursement triggers automatically upon tare weight sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                <span>0% commission deducted as per APMC Mandi rules</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLockDeal}
                disabled={isProcessing}
                className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs h-9 px-5 flex items-center gap-1.5"
              >
                {isProcessing ? 'Locking Deal...' : 'Confirm & Lock Deal 🔒'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
