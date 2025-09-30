'use client';

import { useState, useEffect } from 'react';

interface AdminAuthState {
  isAdmin: boolean;
  loading: boolean;
  token: string | null;
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAdmin: false,
    loading: true,
    token: null
  });

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const expires = localStorage.getItem('admin_expires');
      
      if (!token || !expires) {
        setAuthState({ isAdmin: false, loading: false, token: null });
        return;
      }

      // Vérifier si le token a expiré
      if (Date.now() > parseInt(expires)) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_expires');
        setAuthState({ isAdmin: false, loading: false, token: null });
        return;
      }

      // Vérifier le token avec l'API
      const response = await fetch('/api/admin/auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({ 
          isAdmin: data.admin, 
          loading: false, 
          token: data.admin ? token : null 
        });
      } else {
        // Token invalide
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_expires');
        setAuthState({ isAdmin: false, loading: false, token: null });
      }
    } catch (error) {
      console.error('Erreur vérification auth admin:', error);
      setAuthState({ isAdmin: false, loading: false, token: null });
    }
  };

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_expires', data.expires);
        setAuthState({ isAdmin: true, loading: false, token: data.token });
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_expires');
    setAuthState({ isAdmin: false, loading: false, token: null });
  };

  return {
    isAdmin: authState.isAdmin,
    loading: authState.loading,
    token: authState.token,
    login,
    logout,
    checkAuth: checkAdminAuth
  };
}