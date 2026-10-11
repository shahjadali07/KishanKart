'use client';

import React from 'react';
import { OrderStatusType } from '@/types/buyer';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CheckCheck,
  ShoppingBag,
  Circle
} from 'lucide-react';

interface TimelineStep {
  status: OrderStatusType;
  time: string;
  completed: boolean;
  description: string;
}

interface OrderTimelineProps {
  timeline: TimelineStep[];
  currentStatus: OrderStatusType;
}

export function OrderTimeline({ timeline, currentStatus }: OrderTimelineProps) {
  const getIcon = (status: OrderStatusType) => {
    switch (status) {
      case 'Placed':
        return ShoppingBag;
      case 'Confirmed':
        return CheckCircle2;
      case 'Packed':
        return Package;
      case 'Shipped':
      case 'Out for Delivery':
        return Truck;
      case 'Delivered':
        return CheckCheck;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
      {timeline.map((step, idx) => {
        const Icon = getIcon(step.status);
        const isCurrent = step.status === currentStatus;

        return (
          <div key={idx} className="relative flex items-start gap-4">
            {/* Step Icon Node */}
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 text-xs transition-colors shadow-2xs ${
                step.completed
                  ? 'bg-[#994200] text-white ring-4 ring-amber-50'
                  : isCurrent
                  ? 'bg-amber-100 text-[#994200] ring-4 ring-amber-100 animate-pulse'
                  : 'bg-gray-100 text-gray-400 border border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>

            {/* Step Content */}
            <div className="flex-1 pt-0.5 space-y-0.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`font-bold text-xs ${
                    step.completed || isCurrent
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {step.status}
                </span>
                <span className="text-[11px] font-medium text-gray-400">
                  {step.time}
                </span>
              </div>
              <p
                className={`text-xs ${
                  step.completed || isCurrent ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
