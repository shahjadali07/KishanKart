import React from 'react';
import { Building2, CalendarClock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Requirement {
  company: string;
  type: string;
  location: string;
  price: string;
  needs: string;
  distance: string;
  delivery: string;
}

const mockRequirements: Requirement[] = [
  {
    company: 'Sharma Foods Ltd.',
    type: 'Central Kitchen',
    location: 'Alambagh, Lucknow',
    price: '₹30/kg',
    needs: '500 kg Tomatoes',
    distance: '8 km away',
    delivery: 'Tomorrow morning'
  },
  {
    company: 'Hotel Clarks Avadh',
    type: 'Procurement',
    location: 'Hazratganj',
    price: '₹22/kg',
    needs: '300 kg Potatoes',
    distance: '14 km away',
    delivery: 'By Evening'
  }
];

export function BuyerRequirementCard() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Buyer Requirements Near You</h2>
        <p className="text-sm text-gray-500 mt-1">Direct requests from local businesses seeking fresh produce.</p>
      </div>

      <div className="flex flex-col gap-4">
        {mockRequirements.map((req, i) => (
          <Card key={i} className="group border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 cursor-pointer transition-all duration-300">
            <CardContent className="p-5 sm:p-6 relative">
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/50 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors">{req.company}</h3>
                    <p className="text-xs text-gray-500 font-semibold mt-1 bg-gray-50 inline-block px-2 py-0.5 rounded-md border border-gray-100">{req.type} • {req.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-emerald-700 leading-none group-hover:scale-105 transform origin-right transition-transform">{req.price}</div>
                  <Badge variant="outline" className="mt-2 bg-gray-50/50 font-bold text-[10px] text-gray-500 border-gray-200 uppercase tracking-wider">{req.distance}</Badge>
                </div>
              </div>
              
              <div className="bg-gray-50/80 rounded-xl p-4 mb-5 border border-gray-100 flex justify-between items-center group-hover:bg-emerald-50/30 group-hover:border-emerald-100/50 transition-colors duration-300">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Needs</p>
                  <p className="font-bold text-gray-900 text-sm group-hover:text-emerald-800 transition-colors">{req.needs}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                    <CalendarClock className="h-3 w-3 group-hover:text-emerald-600 transition-colors" /> Delivery
                  </p>
                  <p className="font-bold text-gray-900 text-sm group-hover:text-emerald-800 transition-colors">{req.delivery}</p>
                </div>
              </div>

              <Button className="w-full bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm font-bold h-10 text-sm group-hover:bg-[#114232] group-hover:text-white group-hover:border-[#114232] transition-colors">
                Fulfill Requirement
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
