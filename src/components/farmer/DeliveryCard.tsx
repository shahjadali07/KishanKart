import React from 'react';
import { PackageSearch, MapPin, Clock, ShieldCheck, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DeliveryCard() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Upcoming Deliveries</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
            <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-xs shadow-sm">Guaranteed Payment Protection</span>
          </p>
        </div>
      </div>

      <Card className="group border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 cursor-pointer transition-all duration-300">
        <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-4 flex justify-between items-center group-hover:bg-blue-50/30 transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-1.5 py-0.5 rounded border border-gray-100 shadow-sm">Order</span>
            <span className="text-sm font-black text-gray-900 tracking-tight">#KK-8421</span>
          </div>
          <div className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Clock className="h-3.5 w-3.5 group-hover:animate-spin-slow" /> Driver Assigned
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-5 mb-8">
            <div>
              <p className="font-black text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">300 kg Potatoes</p>
              <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mt-1.5 bg-gray-50 w-fit px-2 py-1 rounded-md border border-gray-100">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                Haldiram Hub, Amausi
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Pickup Expected</p>
              <p className="font-black text-gray-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 text-sm shadow-sm group-hover:bg-amber-400 group-hover:text-amber-900 transition-colors">Today, 2:30 PM</p>
            </div>
          </div>

          <div className="bg-gray-50/50 rounded-xl p-3.5 border border-gray-100 mb-8 flex items-center gap-3.5 group-hover:bg-emerald-50/30 transition-colors duration-300">
             <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600 border-2 border-white shadow-sm ring-1 ring-gray-200 group-hover:ring-emerald-200 transition-all">MS</div>
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Driver</p>
                <p className="text-sm font-black text-gray-900 leading-tight">Mahesh Singh</p>
             </div>
          </div>

          <div className="relative pt-2 pb-8">
            <div className="absolute top-4 left-8 right-8 h-1 bg-gray-100 rounded-full"></div>
            <div className="absolute top-4 left-8 w-1/3 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:w-[35%] transition-all duration-1000 ease-in-out"></div>
            
            <div className="relative flex justify-between px-2">
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm z-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-[10px] font-bold text-gray-900 mt-3 text-center leading-tight uppercase tracking-wider">Order<br/>Confirmed</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm z-10 group-hover:scale-110 transition-transform delay-75"></div>
                <span className="text-[10px] font-bold text-gray-900 mt-3 text-center leading-tight uppercase tracking-wider">Driver<br/>Dispatched</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-gray-200 ring-4 ring-white shadow-sm z-10 group-hover:bg-gray-300 transition-colors"></div>
                <span className="text-[10px] font-bold text-gray-400 mt-3 text-center leading-tight uppercase tracking-wider">At<br/>Farm</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-gray-200 ring-4 ring-white shadow-sm z-10 group-hover:bg-gray-300 transition-colors"></div>
                <span className="text-[10px] font-bold text-gray-400 mt-3 text-center leading-tight uppercase tracking-wider">Delivered</span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-[#114232] hover:bg-[#114232]/90 text-white font-bold shadow-lg shadow-[#114232]/20 h-11 gap-2 text-sm group-hover:-translate-y-0.5 group-hover:shadow-xl transition-all">
            <PackageSearch className="h-4.5 w-4.5 group-hover:animate-pulse" />
            Track Live Delivery
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
