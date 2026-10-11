'use client';

import React from 'react';
import { X, Phone, UserCheck, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CallDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CallDriverModal({ isOpen, onClose }: CallDriverModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2 mb-4">
          <div className="h-16 w-16 rounded-full bg-amber-50 text-amber-800 mx-auto flex items-center justify-center border-2 border-amber-200">
            <UserCheck className="h-8 w-8 text-amber-700" />
          </div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">Mahesh Singh</h3>
          <p className="text-xs text-gray-500 font-medium">Tata Ace • <span className="font-mono font-bold text-gray-700">UP-32-BT-1102</span></p>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs space-y-1.5 mb-5">
          <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>Current Status: 4.2 km away on Sitapur Road</span>
          </div>
          <p className="text-gray-500 text-[11px]">
            Estimated Arrival at your farm gate: <strong className="text-gray-800">2:30 PM Today</strong>
          </p>
        </div>

        <div className="space-y-2.5">
          <a
            href="tel:+919876543210"
            className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-semibold text-xs h-9 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call +91 98765-43210</span>
          </a>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full text-xs h-9 text-gray-600"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
