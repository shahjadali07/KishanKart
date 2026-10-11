import React from 'react';
import { Check, MessageSquare, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function MatchCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            Smart Matches
            <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 border border-amber-200 font-bold shadow-sm px-2.5 py-0.5 text-[10px] uppercase tracking-wider flex items-center gap-1 animate-pulse">
               <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
               Top Recommendation
            </Badge>
          </h2>
          <p className="text-sm text-gray-500 mt-1">We found the best direct farmer matches for your active requirement: <span className="font-semibold text-gray-800">Tomatoes — 500 kg</span>.</p>
        </div>
      </div>

      <Card className="group border border-emerald-200/60 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white rounded-2xl cursor-pointer">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            
            <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex gap-5 items-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center border-2 border-white shadow-md overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <img src="https://i.pravatar.cc/150?u=rajesh" alt="Farmer" className="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 group-hover:text-emerald-700 transition-colors">
                      Rajesh Kumar
                      <ShieldCheck className="h-4.5 w-4.5 text-blue-500" />
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1.5 gap-2 font-medium">
                      <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-md"><MapPin className="h-3.5 w-3.5 text-gray-400" /> Bakshi Ka Talab</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      <span className="text-gray-700 font-bold">12 km away</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-inner group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-colors duration-300 group-hover:text-white">
                  <div className="text-2xl font-black text-emerald-700 leading-none group-hover:text-white">94%</div>
                  <div className="text-[10px] font-bold text-emerald-800/70 uppercase tracking-widest mt-1.5 group-hover:text-emerald-100">Match</div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                <div className="bg-gray-50/50 hover:bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Crop</p>
                  <p className="text-sm font-bold text-gray-900">Tomatoes <span className="text-emerald-700 text-[10px] font-bold ml-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Grade A</span></p>
                </div>
                <div className="bg-gray-50/50 hover:bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Quantity</p>
                  <p className="text-sm font-bold text-gray-900">500 kg <span className="text-gray-500 text-xs font-medium ml-1">batch</span></p>
                </div>
                <div className="bg-gray-50/50 hover:bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
                  <p className="text-base font-black text-emerald-700">₹28/kg</p>
                </div>
                <div className="bg-gray-50/50 hover:bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery</p>
                  <p className="text-sm font-bold text-gray-900">Tomorrow <span className="text-gray-500 font-medium">8:00 AM</span></p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[320px] bg-gradient-to-b from-emerald-50/50 to-white p-6 md:p-8 shrink-0 flex flex-col justify-center relative">
              <div className="flex gap-2 flex-wrap mb-8">
                {['Price', 'Distance', 'Quality', 'Quantity', 'Ready'].map((factor, idx) => (
                  <div key={factor} className={`flex items-center text-emerald-900 text-[10px] font-bold uppercase tracking-wider bg-white border border-emerald-200/60 px-2.5 py-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform`} style={{ transitionDelay: `${idx * 50}ms` }}>
                    {factor} <Check className="h-3.5 w-3.5 ml-1.5 text-emerald-500" />
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mt-auto relative z-10">
                <Button className="w-full bg-[#114232] hover:bg-[#114232]/90 text-white text-sm font-bold shadow-lg shadow-[#114232]/20 h-11 transition-all group-hover:-translate-y-0.5 group-hover:shadow-xl">
                  View Farmer & Create Order
                </Button>
                <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-sm font-bold h-11 bg-white shadow-sm transition-all group-hover:bg-gray-50">
                  <MessageSquare className="h-4.5 w-4.5 mr-2 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  Message Farmer
                </Button>
              </div>
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
