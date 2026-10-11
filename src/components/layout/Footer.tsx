import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white text-gray-600 py-12 mt-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-3">
             <div className="flex flex-col">
                <span className="text-xl font-bold text-emerald-800 leading-tight">KisanKart</span>
                <span className="text-[9px] font-bold tracking-widest text-emerald-600/70 uppercase">From Farm to You, Direct & Smart</span>
              </div>
              <p className="text-xs text-gray-500 max-w-sm mt-3 leading-relaxed">
                Empowering farmers with direct market access, smart matchmaking, and seamless bulk pooling. Eliminating middlemen for better margins.
              </p>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-bold mb-4 uppercase tracking-wider text-[11px]">Quick Market Links</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Latest Mandi Prices</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Buyer Requirements</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Start Bulk Pool</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Farmer Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-bold mb-4 uppercase tracking-wider text-[11px]">Safety & Compliance</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#" className="hover:text-emerald-700 transition-colors text-emerald-700 font-bold">Farmer Helpline: 1800-120-FARM</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Payment Protection Info</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] font-medium text-gray-500">
          <p>© 2024 KisanKart. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
