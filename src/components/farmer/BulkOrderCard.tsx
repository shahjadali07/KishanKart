import React from 'react';
import { Truck, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export function BulkOrderCard() {
  return (
    <Card className="group border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden bg-white cursor-pointer relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>
      
      <CardContent className="p-0 relative z-10">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-amber-800 transition-colors">Build Your Bulk Order</h3>
              <p className="text-gray-500 text-sm mt-1">Pool multiple nearby farms to fulfill larger wholesale orders seamlessly.</p>
            </div>
            <div className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Truck className="h-3.5 w-3.5 group-hover:animate-bounce" /> Pooling Active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col justify-center">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Requirement</p>
                  <p className="text-2xl font-black text-gray-900">Tomatoes <span className="text-gray-400 font-medium">—</span> 2,000 kg</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#8C3A00] bg-[#FDF4EA] border border-amber-200 px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider group-hover:bg-[#994200] group-hover:text-white group-hover:border-[#994200] transition-colors duration-300">100% Fulfilled</span>
                </div>
              </div>
              
              <div className="my-5 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2.5">
                  <span className="uppercase tracking-wider">Pooled Quantity</span>
                  <span className="text-[#994200]">2,000 / 2,000 kg</span>
                </div>
                <Progress value={100} className="h-2.5 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-[#994200] shadow-inner group-hover:[&>div]:shadow-amber-500/50 group-hover:[&>div]:shadow-sm transition-all" />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Participating Farmers</p>
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 shadow-sm group-hover:border-amber-100 transition-colors">
                <div className="flex justify-between items-center text-sm group/farmer hover:bg-amber-50/50 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                  <span className="flex items-center gap-2.5 font-bold text-gray-700 group-hover/farmer:text-amber-900"><Users className="h-4 w-4 text-gray-400 group-hover/farmer:text-amber-600 transition-colors"/> Rajesh Kumar</span>
                  <span className="font-black text-gray-900 group-hover/farmer:text-[#994200] transition-colors">700 kg</span>
                </div>
                <div className="flex justify-between items-center text-sm group/farmer hover:bg-amber-50/50 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                  <span className="flex items-center gap-2.5 font-bold text-gray-700 group-hover/farmer:text-amber-900"><Users className="h-4 w-4 text-gray-400 group-hover/farmer:text-amber-600 transition-colors"/> Amit Patel</span>
                  <span className="font-black text-gray-900 group-hover/farmer:text-[#994200] transition-colors">500 kg</span>
                </div>
                <div className="flex justify-between items-center text-sm group/farmer hover:bg-amber-50/50 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                  <span className="flex items-center gap-2.5 font-bold text-gray-700 group-hover/farmer:text-amber-900"><Users className="h-4 w-4 text-gray-400 group-hover/farmer:text-amber-600 transition-colors"/> Sunita Devi</span>
                  <span className="font-black text-gray-900 group-hover/farmer:text-[#994200] transition-colors">450 kg</span>
                </div>
                <div className="flex justify-between items-center text-sm group/farmer hover:bg-amber-50/50 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                  <span className="flex items-center gap-2.5 font-bold text-gray-700 group-hover/farmer:text-amber-900"><Users className="h-4 w-4 text-gray-400 group-hover/farmer:text-amber-600 transition-colors"/> Ram Charan</span>
                  <span className="font-black text-gray-900 group-hover/farmer:text-[#994200] transition-colors">350 kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/80 border-t border-gray-100 p-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 group-hover:bg-amber-50/30 transition-colors duration-500">
          <div className="flex gap-8 w-full sm:w-auto divide-x divide-gray-200">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Summary</p>
              <p className="font-black text-gray-900 text-sm">4 Farmers Combined</p>
            </div>
            <div className="pl-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Price</p>
              <p className="font-black text-gray-900 text-sm">₹27.80/kg</p>
            </div>
            <div className="pl-8">
              <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-widest mb-1">Savings</p>
              <p className="font-black text-[#994200] text-sm flex items-center gap-1.5">₹4,400 <span className="text-[10px] text-amber-700/80 font-bold uppercase tracking-wider bg-amber-100/60 px-1.5 py-0.5 rounded">vs Mandi</span></p>
            </div>
          </div>
          
          <Button className="w-full sm:w-auto bg-[#994200] hover:bg-[#7A3400] text-white font-bold shadow-md shadow-[#994200]/20 h-11 px-8 text-sm group-hover:-translate-y-0.5 group-hover:shadow-lg transition-all flex items-center gap-2">
            Create Bulk Order <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
