
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'gamer' | 'community_admin' | 'p_host' | 'owner';
  avatar?: string;
  gameIds: Record<string, string>;
  followers: number;
  following: number;
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  assignRole: (identifier: string, role: 'community_admin' | 'p_host') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading existing session
    const mockUser = localStorage.getItem('clutchcore_user');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - different users based on email for testing
    let mockUser: User;
    
    if (email.includes('owner')) {
      mockUser = {
        id: '0',
        username: 'ClutchOwner',
        email,
        role: 'owner',
        avatar: '/placeholder.svg',
        gameIds: {},
        followers: 0,
        following: 0,
        walletBalance: 999999
      };
    } else if (email.includes('admin')) {
      mockUser = {
        id: '2',
        username: 'TourneyMaster',
        email,
        role: 'community_admin',
        avatar: '/placeholder.svg',
        gameIds: { valorant: 'Admin#5678', freefire: 'AdminFF456' },
        followers: 2500,
        following: 156,
        walletBalance: 15000
      };
    } else if (email.includes('host')) {
      mockUser = {
        id: '3',
        username: 'ProHost',
        email,
        role: 'p_host',
        avatar: '/placeholder.svg',
        gameIds: { valorant: 'Host#9999', pubg: 'HostPUBG123' },
        followers: 890,
        following: 234,
        walletBalance: 5500
      };
    } else {
      mockUser = {
        id: '1',
        username: 'GamerPro',
        email,
        role: 'gamer',
        avatar: '/placeholder.svg',
        gameIds: { valorant: 'Player#1234', freefire: 'FFPlayer123' },
        followers: 150,
        following: 89,
        walletBalance: 1250
      };
    }
    
    setUser(mockUser);
    localStorage.setItem('clutchcore_user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, username: string) => {
    // Mock signup
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      role: 'gamer',
      gameIds: {},
      followers: 0,
      following: 0,
      walletBalance: 0
    };
    
    setUser(mockUser);
    localStorage.setItem('clutchcore_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clutchcore_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('clutchcore_user', JSON.stringify(updatedUser));
    }
  };

  const assignRole = async (identifier: string, role: 'community_admin' | 'p_host'): Promise<boolean> => {
    // Mock role assignment - in real app this would update the database
    // For now, just simulate success
    console.log(`Assigning role ${role} to ${identifier}`);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, assignRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
