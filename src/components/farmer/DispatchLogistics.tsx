'use client';

import React from 'react';
import { 
  Truck, 
  Check, 
  Phone, 
  FileText, 
  Scale, 
  CreditCard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DispatchLogisticsProps {
  onCallDriverClick?: () => void;
  onGatePassClick?: () => void;
}

export function DispatchLogistics({
  onCallDriverClick,
  onGatePassClick
}: DispatchLogisticsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs hover:border-amber-400 transition-all duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <span>🚚</span>
          <span>Dispatch & Logistics</span>
        </h3>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span>In-Transit</span>
        </span>
      </div>

      {/* Order Info Details Box */}
      <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-3.5 mb-4 text-xs">
        <div className="flex items-center justify-between mb-1 font-semibold text-gray-900">
          <span>Order #KK-8421</span>
          <span className="text-gray-600">300 kg Potatoes</span>
        </div>

        <p className="text-[11px] text-gray-500 font-medium mb-2">
          Destination: <span className="text-gray-800">Haldiram Regional Hub, Kanpur Road</span>
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 border-t border-gray-200/60 text-[11px]">
          <div className="text-gray-600 font-medium">
            Driver: <strong className="text-gray-900">Mahesh Singh</strong>
            <span className="text-gray-400 mx-1">•</span>
            <span className="text-gray-700 font-mono">Tata Ace • UP-32-BT-1102</span>
          </div>

          <div className="text-amber-900 font-bold sm:text-right">
            ETA at Farm: <span className="text-amber-950 font-black">Today, 2:30 PM</span>
          </div>
        </div>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="space-y-3.5 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 mb-5">
        
        {/* Step 1 - Completed */}
        <div className="relative">
          <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-[#FDF4EA] text-amber-800 border border-amber-300 flex items-center justify-center text-[10px] font-bold">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">
              1. Order Confirmed
            </h4>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              Escrow amount ₹6,150 deposited
            </p>
          </div>
        </div>

        {/* Step 2 - In progress */}
        <div className="relative">
          <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-blue-50 text-blue-700 border border-blue-300 flex items-center justify-center text-[10px] font-bold">
            <Truck className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-900 leading-tight">
              2. Driver Dispatched
            </h4>
            <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
              Driver 4.2 km away on Sitapur Road
            </p>
          </div>
        </div>

        {/* Step 3 - Upcoming */}
        <div className="relative">
          <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-white text-gray-400 border border-gray-300 flex items-center justify-center text-[10px] font-bold">
            3
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-600 leading-tight">
              3. Weighbridge & Farm QC
            </h4>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Digital weight scale tare confirmation
            </p>
          </div>
        </div>

        {/* Step 4 - Upcoming */}
        <div className="relative">
          <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-white text-gray-400 border border-gray-300 flex items-center justify-center text-[10px] font-bold">
            4
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-600 leading-tight">
              4. Instant Bank Transfer
            </h4>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Auto-disbursed via UPI upon weight sync
            </p>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={onCallDriverClick}
          className="text-xs h-8.5 font-semibold border-gray-200 hover:bg-amber-50/50 text-gray-700 flex items-center justify-center gap-1.5"
        >
          <Phone className="h-3.5 w-3.5 text-gray-500" />
          <span>Call Driver</span>
        </Button>

        <Button
          onClick={onGatePassClick}
          className="text-xs h-8.5 font-semibold bg-[#994200] hover:bg-[#7A3400] text-white flex items-center justify-center gap-1.5"
        >
          <FileText className="h-3.5 w-3.5 text-amber-200" />
          <span>Gate Pass</span>
        </Button>
      </div>

    </div>
  );
}
