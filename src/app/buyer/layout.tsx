'use client';

import React from 'react';
import { BuyerProvider } from '@/context/BuyerContext';

export default function BuyerRootLayout({ children }: { children: React.ReactNode }) {
  return <BuyerProvider>{children}</BuyerProvider>;
}
