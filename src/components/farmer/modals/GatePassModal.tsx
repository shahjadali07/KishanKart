'use client';

import React from 'react';
import { X, FileText, QrCode, ShieldCheck, Printer, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GatePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GatePassModal({ isOpen, onClose }: GatePassModalProps) {
  if (!isOpen) return null;

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
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900 leading-tight">Digital Mandi Gate Pass</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-300">
                Authorized
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono">Pass #GP-LKO-8421 • Order #KK-8421</p>
          </div>
        </div>

        {/* QR Code and Pass Details */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/60 text-xs space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Consignment Load</span>
              <span className="text-sm font-bold text-gray-900">300 kg Chipsona Potatoes</span>
            </div>
            <div className="h-16 w-16 bg-white p-1 rounded-lg border border-gray-200 flex items-center justify-center shadow-2xs">
              {/* QR Mockup */}
              <div className="w-full h-full bg-[#2A160A] flex items-center justify-center text-white text-[9px] font-mono rounded">
                [QR PASS]
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200/80 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Vehicle:</span>
              <span className="font-bold text-gray-900 font-mono">Tata Ace (UP-32-BT-1102)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Authorized Driver:</span>
              <span className="font-bold text-gray-900">Mahesh Singh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Destination:</span>
              <span className="font-bold text-gray-900">Haldiram Regional Hub, Kanpur Road</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Escrow Transit Insurance:</span>
              <span className="font-bold text-amber-800">Covered up to ₹25,000</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs h-9"
          >
            Close
          </Button>
          <Button
            onClick={() => window.print()}
            className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs h-9 flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Pass</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
