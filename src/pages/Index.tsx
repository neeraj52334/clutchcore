
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { WalletProvider } from '../contexts/WalletContext';
import LoginScreen from '../components/auth/LoginScreen';
import MainApp from '../components/MainApp';
import { useAuth } from '../contexts/AuthContext';

const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">ClutchCore</h2>
          <p className="text-gray-400">Loading your gaming experience...</p>
        </div>
      </div>
    );
  }

  return user ? <MainApp /> : <LoginScreen />;
};

const Index = () => {
  return (
    <AuthProvider>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </AuthProvider>
  );
};

export default Index;
