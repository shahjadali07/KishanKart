'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function PasswordInput({ label = 'Password', error, className = '', ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-gray-700">
          {label} <span className="text-amber-700">*</span>
        </label>
      )}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors pr-10 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-gray-200 focus:border-amber-600 focus:ring-2 focus:ring-amber-100'
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-[11px] font-medium text-rose-600">{error}</p>}
    </div>
  );
}

export function PasswordStrength({ password = '' }: { password: string }) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = 'Weak';
  let color = 'bg-rose-500';
  let textColor = 'text-rose-600';

  if (score >= 4) {
    label = 'Strong';
    color = 'bg-amber-600';
    textColor = 'text-amber-700';
  } else if (score >= 2) {
    label = 'Medium';
    color = 'bg-amber-500';
    textColor = 'text-amber-700';
  }

  return (
    <div className="space-y-1 pt-1">
      <div className="flex items-center justify-between text-[10px] font-semibold">
        <span className="text-gray-500">Security Strength</span>
        <span className={textColor}>{label}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
        <div className={`h-full ${score >= 1 ? color : 'bg-transparent'} flex-1 rounded-full transition-all`} />
        <div className={`h-full ${score >= 2 ? color : 'bg-transparent'} flex-1 rounded-full transition-all`} />
        <div className={`h-full ${score >= 3 ? color : 'bg-transparent'} flex-1 rounded-full transition-all`} />
        <div className={`h-full ${score >= 4 ? color : 'bg-transparent'} flex-1 rounded-full transition-all`} />
      </div>
    </div>
  );
}
