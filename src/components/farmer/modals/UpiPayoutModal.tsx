'use client';

import React, { useState } from 'react';
import { X, Zap, CheckCircle2, ShieldCheck, IndianRupee, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpiPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpiPayoutModal({ isOpen, onClose }: UpiPayoutModalProps) {
  const [amount, setAmount] = useState('148250');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 800);
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

        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Zap className="h-5 w-5 fill-amber-700 text-amber-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">Instant UPI Payout</h3>
            <p className="text-xs text-gray-500">Auto-cleared Escrow funds to your bank</p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-gray-900">₹{Number(amount).toLocaleString('en-IN')} Disbursed!</h4>
            <p className="text-xs text-gray-500">Credited to rajesh.farmer@okhdfcbank via IMPS / UPI 2.0.</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-medium">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Available For Instant Withdrawal</span>
              <div className="text-2xl font-black text-gray-900">
                ₹1,48,250
              </div>
              <span className="text-[11px] text-amber-800 font-semibold mt-1 block">
                100% Escrow protected • RBI regulated clearing
              </span>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Verified UPI Virtual Payment Address (VPA)</label>
              <div className="flex items-center justify-between p-3 border border-amber-300 bg-amber-50/50 rounded-xl">
                <div>
                  <span className="text-sm font-bold text-gray-900 block">rajesh.farmer@okhdfcbank</span>
                  <span className="text-[10px] text-gray-500 font-medium">HDFC Bank • Rajesh Kumar</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-300">
                  Primary
                </span>
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
                onClick={handleWithdraw}
                disabled={isProcessing}
                className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs h-9 px-5 flex items-center gap-1.5 shadow-sm"
              >
                {isProcessing ? 'Processing UPI Transfer...' : 'Confirm Instant Withdrawal'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
