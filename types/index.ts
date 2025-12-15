export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  expectedReturn: number;
  duration: number; // in months
  images: string[];
  status: 'active' | 'funded' | 'completed';
  category: 'residential' | 'commercial' | 'industrial';
  createdAt: string;
}

export interface Investment {
  id: string;
  propertyId: string;
  userId: string;
  shares: number;
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  purchaseDate: string;
  expectedReturn: number;
  property?: Property;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}


