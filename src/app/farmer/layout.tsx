'use client';

import React from 'react';
import { FarmerProvider } from '@/context/FarmerContext';

export default function FarmerRootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <FarmerProvider>{children}</FarmerProvider>;
}
