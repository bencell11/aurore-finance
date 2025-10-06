'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User as AuthUser } from '@/lib/services/auth.service';

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

  // Charger l'utilisateur depuis authService au démarrage
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser({
        email: currentUser.email,
        nom: currentUser.nom,
        prenom: currentUser.prenom
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await authService.login({ email, password });
    if (response.success && response.user) {
      setUser({
        email: response.user.email,
        nom: response.user.nom,
        prenom: response.user.prenom
      });
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, nom: string, prenom: string): Promise<boolean> => {
    const response = await authService.register({ email, password, nom, prenom });
    if (response.success && response.user) {
      setUser({
        email: response.user.email,
        nom: response.user.nom,
        prenom: response.user.prenom
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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