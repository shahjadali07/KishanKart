'use client';

import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Users2, 
  Building 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BuyerDemandsProps {
  onAcceptDemand?: (buyerName: string) => void;
  onJoinPool?: (buyerName: string) => void;
}

export function BuyerDemands({ onAcceptDemand, onJoinPool }: BuyerDemandsProps) {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  const handleAccept = (buyer: string) => {
    setAccepted(prev => ({ ...prev, [buyer]: true }));
    onAcceptDemand?.(buyer);
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="text-xl">📋</span>
            <span>Buyer Demands Near You</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Commercial buyers actively looking for farm-gate dispatch around Lucknow
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200/80">
          3 High-Priority Demands
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        
        {/* Demand 1: Sharma Foods Ltd. */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs hover:border-amber-400 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Sharma Foods Ltd.</h3>
                <span className="text-xs text-gray-500 font-medium">• Central Kitchen • Alambagh (8 km)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200/70">
                  Verified Enterprise
                </span>
              </div>

              <p className="text-xs text-gray-700 font-medium mt-1.5">
                Requirement: <strong className="text-gray-900">500 kg Tomatoes (Grade A)</strong> • Budget: <strong className="text-amber-900 font-bold">₹30/kg</strong> <span className="text-amber-700 font-semibold">(+₹2 above your asking)</span>
              </p>
            </div>

            <Button
              onClick={() => handleAccept('Sharma Foods Ltd.')}
              disabled={accepted['Sharma Foods Ltd.']}
              className={`text-xs font-semibold h-8.5 px-4 rounded-lg shrink-0 transition-colors ${
                accepted['Sharma Foods Ltd.']
                  ? 'bg-amber-100 text-amber-900 cursor-default'
                  : 'bg-[#994200] hover:bg-[#7A3400] text-white'
              }`}
            >
              {accepted['Sharma Foods Ltd.'] ? 'Demand Accepted ✔' : 'Accept & Fulfill Demand'}
            </Button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center text-[11px] font-medium text-gray-500">
            <Clock className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
            <span>Tomorrow 7:00 AM</span>
          </div>
        </div>

        {/* Demand 2: Hotel Clarks Avadh */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs hover:border-amber-400 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Hotel Clarks Avadh</h3>
                <span className="text-xs text-gray-500 font-medium">• Hospitality Kitchen • Hazratganj (14 km)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                  Self-Pickup Van
                </span>
              </div>

              <p className="text-xs text-gray-700 font-medium mt-1.5">
                Requirement: <strong className="text-gray-900">300 kg Chipsona Potatoes</strong> • Budget: <strong className="text-amber-900 font-bold">₹22/kg</strong> <span className="text-amber-700 font-semibold">(+₹3 above your asking)</span>
              </p>
            </div>

            <Button
              onClick={() => handleAccept('Hotel Clarks Avadh')}
              disabled={accepted['Hotel Clarks Avadh']}
              className={`text-xs font-semibold h-8.5 px-4 rounded-lg shrink-0 transition-colors ${
                accepted['Hotel Clarks Avadh']
                  ? 'bg-amber-100 text-amber-900 cursor-default'
                  : 'bg-[#994200] hover:bg-[#7A3400] text-white'
              }`}
            >
              {accepted['Hotel Clarks Avadh'] ? 'Demand Accepted ✔' : 'Accept Demand'}
            </Button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center text-[11px] font-medium text-gray-500">
            <Truck className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
            <span>Farm pickup by hotel van</span>
          </div>
        </div>

        {/* Demand 3: Haldiram Snacks Procurement */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs hover:border-amber-400 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Haldiram Snacks Procurement</h3>
                <span className="text-xs text-gray-500 font-medium">• Kanpur Hub (28 km)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/70">
                  Bulk Contract
                </span>
              </div>

              <p className="text-xs text-gray-700 font-medium mt-1.5">
                Requirement: <strong className="text-gray-900">2,000 kg Bulk Potatoes</strong> • Budget: <strong className="text-gray-900 font-bold">₹20.50/kg</strong>
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => onJoinPool?.('Haldiram Snacks Procurement')}
              className="text-xs font-semibold h-8.5 px-4 rounded-lg shrink-0 border-gray-200 hover:bg-amber-50/50 text-gray-700"
            >
              Join Aggregation Pool
            </Button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center text-[11px] font-medium text-gray-500">
            <Users2 className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
            <span>Pooling available (3 nearby farmers joined)</span>
          </div>
        </div>

      </div>
    </section>
  );
}
