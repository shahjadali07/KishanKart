'use client';

import React from 'react';
import { X, FileText, CheckCircle2, Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SoilHealthCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SoilHealthCardModal({ isOpen, onClose }: SoilHealthCardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-[#FDF4EA] text-[#8C3A00] flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">Soil Health Card</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-300">
                Grade A (Optimal)
              </span>
            </div>
            <p className="text-xs text-gray-500">KVK Lucknow • ISRO Bhuvan Soil Registry ID: #SHC-UP-99214</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Key Nutrient Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Nitrogen (N)</span>
              <span className="text-sm font-bold text-gray-900">294 kg/ha</span>
              <span className="text-[10px] font-semibold text-amber-700 block mt-0.5">Optimal</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Phosphorus (P)</span>
              <span className="text-sm font-bold text-gray-900">32.4 kg/ha</span>
              <span className="text-[10px] font-semibold text-amber-700 block mt-0.5">Optimal</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Potassium (K)</span>
              <span className="text-sm font-bold text-gray-900">312 kg/ha</span>
              <span className="text-[10px] font-semibold text-amber-700 block mt-0.5">High</span>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-amber-950">
              <span>Soil pH Level: <strong>6.8 (Neutral)</strong></span>
              <span>Organic Carbon: <strong>0.78% (Good)</strong></span>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              Ideal condition for solanaceous crops (tomatoes, potatoes) and Rabi pulses. High organic matter ensures higher buyer bid valuation on KisanKart.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-700" />
              <span className="text-gray-700 font-semibold">Government Certified Test Result</span>
            </div>
            <span className="text-gray-500 font-mono text-[11px]">Valid till: Oct 2027</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs h-9"
            >
              Close
            </Button>
            <Button
              onClick={() => alert('Downloading official Government Soil Health Card PDF...')}
              className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs h-9 flex items-center gap-1.5 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
