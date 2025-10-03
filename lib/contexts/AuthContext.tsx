'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  nom?: string;
  prenom?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, nom: string, prenom: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('aurore_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('aurore_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Pour le mode démo, accepter n'importe quel email/password
    if (email && password) {
      const newUser = { email, nom: 'Demo', prenom: 'User' };
      setUser(newUser);
      localStorage.setItem('aurore_user', JSON.stringify(newUser));
      
      // Définir aussi le cookie pour le middleware
      document.cookie = `admin_token=demo_token_${Date.now()}; path=/; max-age=86400`;
      
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, nom: string, prenom: string): Promise<boolean> => {
    if (email && password && nom && prenom) {
      const newUser = { email, nom, prenom };
      setUser(newUser);
      localStorage.setItem('aurore_user', JSON.stringify(newUser));
      
      // Définir aussi le cookie pour le middleware
      document.cookie = `admin_token=demo_token_${Date.now()}; path=/; max-age=86400`;
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aurore_user');
    
    // Supprimer le cookie
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}