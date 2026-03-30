'use client';

import { ReactNode } from 'react';
import { StorageProvider } from './StorageInitializer';
import BadgeProvider from '@/components/badges/BadgeProvider';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <StorageProvider>
      <BadgeProvider>{children}</BadgeProvider>
    </StorageProvider>
  );
}
