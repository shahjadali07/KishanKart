'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export function AuthError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-200">
      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
      <span className="leading-tight">{message}</span>
    </div>
  );
}

export function AuthSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-200">
      <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
      <span className="leading-tight">{message}</span>
    </div>
  );
}

export function LoadingButtonState({ text = 'Please wait...' }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{text}</span>
    </span>
  );
}
