import React from 'react';
import { BadgeCheck, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FarmerHeader() {
  return (
    <div className="bg-[#114232] rounded-2xl p-6 sm:px-8 sm:py-7 text-white shadow-sm overflow-hidden relative">
      <div className="absolute right-0 top-0 opacity-5 pointer-events-none translate-x-1/4 -translate-y-1/4">
         <svg width="250" height="250" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v4.07a8.99 8.99 0 0 0-6.93 6.93H0v2h4.07a8.99 8.99 0 0 0 6.93 6.93V22h2v-4.07a8.99 8.99 0 0 0 6.93-6.93H24v-2h-4.07a8.99 8.99 0 0 0-6.93-6.93V2h-2zm1 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/></svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-1.5 text-emerald-50 text-[11px] font-semibold bg-white/10 w-fit px-2.5 py-1 rounded-md uppercase tracking-wider">
            <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Verified Farmer Desk • Bakshi Ka Talab, Lucknow</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Good Morning, Rajesh 👋</h1>
          
          <p className="text-emerald-100/90 text-sm leading-relaxed max-w-md">
            Mandi prices are up today in your cluster. You have <strong className="text-white font-semibold">2 buyers</strong> ready for instant pickup within 15 km.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button variant="secondary" className="bg-white text-emerald-900 hover:bg-gray-50 shadow-sm border-0 font-medium h-9 px-5 text-sm">
            List New Crop
          </Button>
          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white font-medium h-9 px-5 bg-transparent text-sm">
            View Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
