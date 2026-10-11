import React from 'react';
import { Wallet, Package, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    title: 'Total Earnings',
    value: '₹1,48,250',
    icon: Wallet,
    trend: '+18% this month'
  },
  {
    title: 'Active Produce Listed',
    value: '4 Crops',
    icon: Package,
    trend: '1,250 kg in farm storage'
  },
  {
    title: 'Pending Orders',
    value: '2 Orders',
    icon: Clock,
    trend: 'Ready for farm-gate pickup'
  },
  {
    title: 'Smart Matches',
    value: '5 Buyers',
    icon: Sparkles,
    trend: 'Direct requirements found'
  }
];

export function FarmerStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="group border border-gray-100 shadow-sm rounded-xl hover:shadow-lg hover:-translate-y-1 hover:border-emerald-200 transition-all duration-300 cursor-pointer overflow-hidden relative bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-transparent to-emerald-50/0 group-hover:from-emerald-50/50 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
            <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide group-hover:text-emerald-700 transition-colors">{stat.title}</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 tracking-tight group-hover:scale-105 transform origin-left transition-transform duration-300">{stat.value}</div>
                <div className="text-xs font-medium text-gray-500 mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-pulse"></span>
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
