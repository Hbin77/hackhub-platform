'use client';

import { ReactNode } from 'react';
import { StorageProvider } from './StorageInitializer';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <StorageProvider>{children}</StorageProvider>;
}
