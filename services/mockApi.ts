import { User, Property, Investment, Wallet, Transaction, Notification } from '../types';

// Mock data
let mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@proprials.com',
    name: 'Demo User',
    phone: '+1234567890',
    kycStatus: 'verified',
    createdAt: new Date().toISOString(),
  },
];

let mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Apartment Complex - Downtown',
    description: 'A premium residential complex in the heart of downtown with modern amenities and excellent ROI potential.',
    location: 'New York, NY',
    price: 5000000,
    totalShares: 10000,
    availableShares: 7500,
    pricePerShare: 500,
    expectedReturn: 12.5,
    duration: 36,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'],
    status: 'active',
    category: 'residential',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Commercial Office Building',
    description: 'Prime commercial real estate with long-term lease agreements and stable income.',
    location: 'San Francisco, CA',
    price: 8000000,
    totalShares: 16000,
    availableShares: 12000,
    pricePerShare: 500,
    expectedReturn: 10.8,
    duration: 48,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c'],
    status: 'active',
    category: 'commercial',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Industrial Warehouse Facility',
    description: 'Modern warehouse facility with excellent logistics connectivity and high demand.',
    location: 'Chicago, IL',
    price: 3500000,
    totalShares: 7000,
    availableShares: 5000,
    pricePerShare: 500,
    expectedReturn: 14.2,
    duration: 30,
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d'],
    status: 'active',
    category: 'industrial',
    createdAt: new Date().toISOString(),
  },
];

let mockInvestments: Investment[] = [];
let mockWallets: Wallet[] = [];
let mockNotifications: Notification[] = [];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(1000);
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    return { user, token: 'mock-token-' + user.id };
  },

  async signup(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    await delay(1000);
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    const user: User = {
      id: String(mockUsers.length + 1),
      email,
      name,
      kycStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(user);
    const wallet: Wallet = {
      id: 'wallet-' + user.id,
      userId: user.id,
      balance: 0,
      transactions: [],
    };
    mockWallets.push(wallet);
    return { user, token: 'mock-token-' + user.id };
  },

  async getCurrentUser(token: string): Promise<User> {
    await delay(500);
    const userId = token.replace('mock-token-', '');
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
  },

  // Properties
  async getProperties(): Promise<Property[]> {
    await delay(800);
    return mockProperties;
  },

  async getProperty(id: string): Promise<Property> {
    await delay(500);
    const property = mockProperties.find(p => p.id === id);
    if (!property) throw new Error('Property not found');
    return property;
  },

  // Investments
  async getInvestments(userId: string): Promise<Investment[]> {
    await delay(600);
    return mockInvestments
      .filter(inv => inv.userId === userId)
      .map(inv => ({
        ...inv,
        property: mockProperties.find(p => p.id === inv.propertyId),
      }));
  },

  async getInvestment(id: string): Promise<Investment> {
    await delay(500);
    const investment = mockInvestments.find(inv => inv.id === id);
    if (!investment) throw new Error('Investment not found');
    return {
      ...investment,
      property: mockProperties.find(p => p.id === investment.propertyId),
    };
  },

  async createInvestment(userId: string, propertyId: string, shares: number): Promise<Investment> {
    await delay(1000);
    const property = mockProperties.find(p => p.id === propertyId);
    if (!property) throw new Error('Property not found');
    if (property.availableShares < shares) {
      throw new Error('Not enough shares available');
    }

    const wallet = mockWallets.find(w => w.userId === userId);
    const amount = shares * property.pricePerShare;
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    property.availableShares -= shares;
    wallet.balance -= amount;

    const investment: Investment = {
      id: 'inv-' + Date.now(),
      propertyId,
      userId,
      shares,
      amount,
      status: 'active',
      purchaseDate: new Date().toISOString(),
      expectedReturn: property.expectedReturn,
    };

    mockInvestments.push(investment);

    // Add transaction
    const transaction: Transaction = {
      id: 'tx-' + Date.now(),
      walletId: wallet.id,
      type: 'investment',
      amount: -amount,
      description: `Investment in ${property.title}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    wallet.transactions.push(transaction);

    return investment;
  },

  // Wallet
  async getWallet(userId: string): Promise<Wallet> {
    await delay(500);
    let wallet = mockWallets.find(w => w.userId === userId);
    if (!wallet) {
      wallet = {
        id: 'wallet-' + userId,
        userId,
        balance: 0,
        transactions: [],
      };
      mockWallets.push(wallet);
    }
    return wallet;
  },

  async deposit(userId: string, amount: number): Promise<Transaction> {
    await delay(1000);
    let wallet = mockWallets.find(w => w.userId === userId);
    if (!wallet) {
      wallet = {
        id: 'wallet-' + userId,
        userId,
        balance: 0,
        transactions: [],
      };
      mockWallets.push(wallet);
    }

    wallet.balance += amount;
    const transaction: Transaction = {
      id: 'tx-' + Date.now(),
      walletId: wallet.id,
      type: 'deposit',
      amount,
      description: 'Wallet deposit',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    wallet.transactions.push(transaction);
    return transaction;
  },

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(500);
    return mockNotifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await delay(300);
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  },
};


