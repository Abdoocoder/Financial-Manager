export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum AssetType {
  REAL_ESTATE = 'real_estate',
  VEHICLE = 'vehicle',
  GOLD = 'gold',
  CASH = 'cash',
  OTHER = 'other',
}

export enum InvestmentType {
  STOCK = 'stock',
  CRYPTO = 'crypto',
  FUND = 'fund',
  LOCAL = 'local',
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note?: string;
  receiptUrl?: string; // Placeholder for Cloudinary URL
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  dateAcquired?: string;
}

export interface Debt {
  id: string;
  creditor: string; // To whom / From whom
  totalAmount: number;
  remainingAmount: number;
  dueDate: string;
  isPayable: boolean; // True if I owe money, False if money owed to me
}

export interface Investment {
  id: string;
  symbol: string;
  type: InvestmentType;
  quantity: number;
  buyPrice: number;
  currentPrice: number; // In a real app, fetched via API
  date: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netWorth: number;
  totalAssets: number;
  totalDebts: number;
  totalInvestments: number;
}
