import React from 'react';
import { Menu, Globe, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-emerald-800 leading-tight tracking-tight">KisanKart</span>
              <span className="text-[8px] font-bold tracking-widest text-emerald-600/70 uppercase">From Farm to You, Direct & Smart</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-emerald-700 font-medium text-sm transition-colors">Marketplace</a>
            <a href="#" className="text-gray-600 hover:text-emerald-700 font-medium text-sm transition-colors">Smart Matches</a>
            <a href="#" className="text-gray-600 hover:text-emerald-700 font-medium text-sm transition-colors">Bulk Pooling</a>
            <a href="#" className="text-gray-600 hover:text-emerald-700 font-medium text-sm transition-colors">Track Deliveries</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-gray-500 hover:text-gray-900 cursor-pointer text-xs font-medium">
              <span>Hindi</span>
            </div>
            
            <div className="hidden sm:flex items-center">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Farmer Desk</span>
            </div>

            <Avatar className="h-8 w-8 border border-gray-200 cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/150?u=rajesh" alt="@rajesh" />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">RK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
