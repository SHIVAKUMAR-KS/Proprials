import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Investment } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from './authStore';

interface InvestmentContextType {
  investments: Investment[];
  isLoading: boolean;
  error: string | null;
  fetchInvestments: () => Promise<void>;
  createInvestment: (propertyId: string, shares: number) => Promise<void>;
  getInvestment: (id: string) => Investment | undefined;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await mockApi.getInvestments(user.id);
      setInvestments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch investments');
    } finally {
      setIsLoading(false);
    }
  };

  const createInvestment = async (propertyId: string, shares: number) => {
    if (!user) throw new Error('User not authenticated');
    setIsLoading(true);
    setError(null);
    try {
      await mockApi.createInvestment(user.id, propertyId, shares);
      await fetchInvestments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create investment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getInvestment = (id: string) => {
    return investments.find(inv => inv.id === id);
  };

  useEffect(() => {
    if (user) {
      fetchInvestments();
    }
  }, [user]);

  return (
    <InvestmentContext.Provider
      value={{
        investments,
        isLoading,
        error,
        fetchInvestments,
        createInvestment,
        getInvestment,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestments() {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestments must be used within InvestmentProvider');
  }
  return context;
}

