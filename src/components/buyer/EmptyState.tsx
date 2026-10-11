'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, Sprout } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function EmptyState({
  icon: Icon = Sprout,
  title,
  description,
  actionText,
  actionHref,
  onActionClick
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs space-y-4 my-8">
      <div className="h-16 w-16 rounded-2xl bg-amber-50 text-[#994200] border border-amber-200/80 flex items-center justify-center mx-auto">
        <Icon className="h-8 w-8" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {actionText && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95"
            >
              {actionText}
            </Link>
          ) : onActionClick ? (
            <button
              onClick={onActionClick}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95"
            >
              {actionText}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
