import { useState, useEffect } from 'react';
import { Transaction, Asset, Debt, Investment, TransactionType, AssetType, InvestmentType } from '../types';
import { generateId } from '../utils/helpers';

// Initial Mock Data
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', type: TransactionType.INCOME, amount: 15000, category: 'راتب شهري', date: '2023-10-25' },
  { id: '2', type: TransactionType.EXPENSE, amount: 350, category: 'بقالة', date: '2023-10-26' },
  { id: '3', type: TransactionType.EXPENSE, amount: 120, category: 'وقود', date: '2023-10-27' },
  { id: '4', type: TransactionType.INCOME, amount: 2000, category: 'عمل حر', date: '2023-10-28' },
];

const INITIAL_ASSETS: Asset[] = [
  { id: '1', name: 'المنزل', type: AssetType.REAL_ESTATE, value: 1200000 },
  { id: '2', name: 'تويوتا كامري', type: AssetType.VEHICLE, value: 85000 },
];

const INITIAL_DEBTS: Debt[] = [
  { id: '1', creditor: 'البنك العقاري', totalAmount: 500000, remainingAmount: 420000, dueDate: '2030-01-01', isPayable: true },
];

const INITIAL_INVESTMENTS: Investment[] = [
  { id: '1', symbol: 'AAPL', type: InvestmentType.STOCK, quantity: 10, buyPrice: 150, currentPrice: 175, date: '2023-01-15' },
  { id: '2', symbol: 'BTC', type: InvestmentType.CRYPTO, quantity: 0.05, buyPrice: 25000, currentPrice: 35000, date: '2023-05-20' },
];

export const useStore = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('debts');
    return saved ? JSON.parse(saved) : INITIAL_DEBTS;
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('investments');
    return saved ? JSON.parse(saved) : INITIAL_INVESTMENTS;
  });

  useEffect(() => { localStorage.setItem('transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('assets', JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem('debts', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('investments', JSON.stringify(investments)); }, [investments]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => setTransactions(prev => [...prev, { ...t, id: generateId() }]);
  const addAsset = (a: Omit<Asset, 'id'>) => setAssets(prev => [...prev, { ...a, id: generateId() }]);
  const addDebt = (d: Omit<Debt, 'id'>) => setDebts(prev => [...prev, { ...d, id: generateId() }]);
  const addInvestment = (i: Omit<Investment, 'id'>) => setInvestments(prev => [...prev, { ...i, id: generateId() }]);

  return {
    transactions,
    assets,
    debts,
    investments,
    addTransaction,
    addAsset,
    addDebt,
    addInvestment,
  };
};
