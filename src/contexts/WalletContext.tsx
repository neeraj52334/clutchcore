
import React, { createContext, useContext, useState } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'challenge_entry' | 'winnings' | 'tournament_entry';
  amount: number;
  timestamp: Date;
  relatedId?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addMoney: (amount: number) => Promise<void>;
  withdrawMoney: (amount: number) => Promise<void>;
  deductMoney: (amount: number, type: string, relatedId?: string) => Promise<void>;
  addWinnings: (amount: number, relatedId?: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(1250);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      amount: 1000,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '2',
      type: 'winnings',
      amount: 500,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      relatedId: 'challenge_123',
      status: 'completed'
    },
    {
      id: '3',
      type: 'challenge_entry',
      amount: -250,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      relatedId: 'challenge_456',
      status: 'completed'
    }
  ]);

  const addMoney = async (amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount,
      timestamp: new Date(),
      status: 'completed'
    };
    
    setBalance(prev => prev + amount);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const withdrawMoney = async (amount: number) => {
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdrawal',
      amount: -amount,
      timestamp: new Date(),
      status: 'pending'
    };
    
    setBalance(prev => prev - amount);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deductMoney = async (amount: number, type: string, relatedId?: string) => {
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: type as any,
      amount: -amount,
      timestamp: new Date(),
      relatedId,
      status: 'completed'
    };
    
    setBalance(prev => prev - amount);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addWinnings = async (amount: number, relatedId?: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'winnings',
      amount,
      timestamp: new Date(),
      relatedId,
      status: 'completed'
    };
    
    setBalance(prev => prev + amount);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <WalletContext.Provider value={{
      balance,
      transactions,
      addMoney,
      withdrawMoney,
      deductMoney,
      addWinnings
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
