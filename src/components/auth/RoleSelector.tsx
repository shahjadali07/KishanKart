'use client';

import React from 'react';
import { Sprout, Building2, Shield, Store } from 'lucide-react';
import { UserRole } from '@/context/AuthContext';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
  allowAdmin?: boolean;
}

export function RoleSelector({ selectedRole, onChange, allowAdmin = false }: RoleSelectorProps) {
  const roles: { id: UserRole; label: string; sub: string; icon: any }[] = [
    {
      id: 'FARMER',
      label: 'Farmer',
      sub: 'Sell Produce',
      icon: Sprout,
    },
    {
      id: 'BUYER',
      label: 'Business',
      sub: 'Bulk Buyer',
      icon: Building2,
    },
  ];

  if (allowAdmin) {
    roles.push({
      id: 'ADMIN',
      label: 'Admin',
      sub: 'Govt. / Mandi',
      icon: Shield,
    });
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700">
          Select Your Role <span className="text-amber-700">*</span>
        </label>
        {selectedRole === 'ADMIN' && (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            Administrative Portal
          </span>
        )}
      </div>

      <div className={`grid ${roles.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2.5`}>
        {roles.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedRole === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20 shadow-2xs'
                  : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30 text-gray-600 bg-white'
              }`}
            >
              <div
                className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-[#994200] text-white shadow-2xs' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold leading-tight mt-0.5">{item.label}</span>
              <span className="text-[10px] text-gray-500 font-medium leading-none">{item.sub}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium pt-1">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
        <span>
          {selectedRole === 'FARMER'
            ? 'Zero Mandi commission, verified weighment, and spot escrow payout.'
            : selectedRole === 'BUYER'
            ? 'Direct wholesale sourcing with lab quality certs & doorstep dispatch.'
            : 'Mandi Parishad compliance, price stabilization & arbitration monitor.'}
        </span>
      </div>
    </div>
  );
}
