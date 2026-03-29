'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { seedIfNeeded } from '@/lib/storage';

const StorageContext = createContext(false);

export function useStorageReady() {
  return useContext(StorageContext);
}

export function StorageProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfNeeded().then(() => setReady(true));
  }, []);

  return (
    <StorageContext.Provider value={ready}>
      {children}
    </StorageContext.Provider>
  );
}

