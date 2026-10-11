'use client';

import React, { useState } from 'react';
import { X, Sprout, CheckCircle2, ShieldCheck, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (crop: any) => void;
}

export function ListCropModal({ isOpen, onClose, onSuccess }: ListCropModalProps) {
  const [cropName, setCropName] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [askingRate, setAskingRate] = useState('');
  const [grade, setGrade] = useState('Grade A');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onSuccess?.({ cropName, lotSize, askingRate, grade });
        onClose();
      }, 1200);
    }, 600);
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
          <div className="h-10 w-10 rounded-xl bg-[#FDF4EA] text-[#8C3A00] flex items-center justify-center">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">List New Crop Lot</h3>
            <p className="text-xs text-gray-500">Live instantly on Lucknow mandi trading floor</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-gray-900">Crop Lot Listed Successfully!</h4>
            <p className="text-xs text-gray-500">Matching buyers within 25 km are receiving instant alerts.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Crop Name / Variety</label>
              <input
                type="text"
                placeholder="e.g. Hybrid Cauliflower, Red Garlic, Mustard"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-amber-600 focus:border-amber-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Lot Size (kg)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-amber-600 focus:border-amber-600"
                />
              </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Asking Rate (₹/kg)</label>
              <input
                type="number"
                placeholder="e.g. 28"
                value={askingRate}
                onChange={(e) => setAskingRate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-amber-600 focus:border-amber-600"
              />
            </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Quality Grading</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-amber-600 focus:border-amber-600 bg-white"
              >
                <option value="Grade A">Grade A (Premium / Table Variety)</option>
                <option value="Grade B">Grade B (Processing Grade)</option>
                <option value="Organic">Organic Certified (NPOP Verified)</option>
              </select>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 text-amber-800 text-[11px] flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Zero commission guarantee: Escrow protection and instant UPI settlement at farm-gate weighbridge.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs h-9 px-5 shadow-sm"
              >
                {isSubmitting ? 'Publishing...' : 'List on Digital Mandi'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
