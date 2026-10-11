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
    <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-200/90 rounded-2xl bg-white flex flex-col cursor-pointer relative shadow-xs hover:border-amber-400">
      <div className="relative h-44 overflow-hidden bg-stone-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
        />
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5">
          <Badge className="bg-[#994200]/95 text-white border border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 shadow-xs uppercase tracking-wider backdrop-blur-md">
            {grade}
          </Badge>
        </div>
        <div className="absolute top-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-stone-800 shadow-xs flex items-center gap-1 border border-white/60">
          <MapPin className="h-3 w-3 text-amber-600" />
          <span>{distance}</span>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col justify-between relative z-20 bg-white space-y-3">
        <div>
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-[#994200] transition-colors">
              {name}
            </h3>
            <div className="text-sm font-black text-[#994200] shrink-0 ml-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80">
              {price}
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
            <MapPin className="h-3 w-3 text-stone-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-2.5 border-y border-stone-100 my-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center border border-white shadow-2xs">
               <span className="text-[10px] font-bold text-[#8C3A00]">{farmer.charAt(0)}</span>
            </div>
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
              <span className="truncate max-w-[110px]">{farmer}</span>
              {verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-stone-400 block uppercase font-bold tracking-wider">Lot Stock</span>
            <span className="text-xs font-bold text-stone-900">{quantity}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] text-amber-900 font-semibold bg-amber-50/80 w-full px-2.5 py-1.5 rounded-lg border border-amber-200/60">
          <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>Farm-gate Quality Assured</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button 
            variant="outline" 
            className="w-full border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-700 h-9 text-xs font-bold rounded-xl transition-all active:scale-[0.98]"
          >
            Details
          </Button>
          <Button 
            className="w-full bg-[#994200] hover:bg-[#7A3400] text-white h-9 text-xs font-bold rounded-xl shadow-xs hover:shadow-md hover:shadow-amber-900/15 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
             <ShoppingCart className="h-3.5 w-3.5" /> Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
