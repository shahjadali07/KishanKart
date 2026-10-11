import React from 'react';
import { MapPin, ShieldCheck, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProduceCardProps {
  image: string;
  name: string;
  grade: string;
  location: string;
  farmer: string;
  verified: boolean;
  quantity: string;
  price: string;
  distance: string;
}

export function ProduceCard({ image, name, grade, location, farmer, verified, quantity, price, distance }: ProduceCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100/80 rounded-xl bg-white flex flex-col cursor-pointer relative">
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5">
          <Badge className="bg-[#114232] text-white border-0 text-[10px] font-bold px-2.5 py-0.5 shadow-md uppercase tracking-wider backdrop-blur-md bg-opacity-90">{grade}</Badge>
        </div>
        <div className="absolute top-2 right-2 z-20 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-gray-800 shadow-md flex items-center gap-1 group-hover:bg-[#114232] group-hover:text-white transition-colors">
          <MapPin className="h-3 w-3" />
          {distance}
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col relative z-20 bg-white">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">{name}</h3>
          <div className="text-sm font-black text-emerald-600 shrink-0 ml-2 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">{price}</div>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 font-medium">
          <span className="truncate flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-400" /> {location}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-y border-gray-50 mb-auto group-hover:border-emerald-50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center border border-white shadow-sm ring-1 ring-gray-100">
               <span className="text-[10px] font-bold text-emerald-800">{farmer.charAt(0)}</span>
            </div>
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 group-hover:text-gray-900 transition-colors">
              {farmer}
              {verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider mb-0.5">Stock</span>
            <span className="text-xs font-bold text-gray-900">{quantity}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold mt-4 bg-emerald-50/80 w-full px-2.5 py-2 rounded-lg border border-emerald-100/50 group-hover:bg-emerald-100/50 transition-colors">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Farm-gate Quality Guarantee</span>
        </div>
        
        <div className="flex gap-2 mt-4 pt-1">
          <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 h-9 text-xs font-bold shadow-sm transition-all group-hover:bg-gray-50">Details</Button>
          <Button className="w-full bg-[#114232] hover:bg-[#114232]/90 text-white h-9 text-xs font-bold shadow-md transition-all group-hover:shadow-lg group-hover:scale-[1.02] flex items-center gap-1.5">
             <ShoppingCart className="h-3.5 w-3.5" /> Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
