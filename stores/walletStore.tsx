import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Wallet, Transaction } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from './authStore';

interface WalletContextType {
  wallet: Wallet | null;
  isLoading: boolean;
  error: string | null;
  fetchWallet: () => Promise<void>;
  deposit: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await mockApi.getWallet(user.id);
      setWallet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const deposit = async (amount: number) => {
    if (!user) throw new Error('User not authenticated');
    setIsLoading(true);
    setError(null);
    try {
      await mockApi.deposit(user.id, amount);
      await fetchWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deposit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isLoading,
        error,
        fetchWallet,
        deposit,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

