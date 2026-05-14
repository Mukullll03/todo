import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSyncCode, setSyncCode as setStoredSyncCode } from '../lib/dataSync';

interface SyncContextType {
  syncCode: string;
  setSyncCode: (code: string) => void;
  isConfigured: boolean;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: ReactNode }) {
  const [syncCode, setSyncCodeState] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Load sync code from localStorage on mount
    const code = getSyncCode();
    setSyncCodeState(code);
    setIsConfigured(true);
  }, []);

  const setSyncCode = (code: string) => {
    const normalizedCode = code.toUpperCase().trim();
    setStoredSyncCode(normalizedCode);
    setSyncCodeState(normalizedCode);
  };

  return (
    <SyncContext.Provider value={{ syncCode, setSyncCode, isConfigured }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
