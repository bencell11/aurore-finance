'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, nom: string, prenom: string) => Promise<boolean>;
  supabaseUser: SupabaseUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Charger l'utilisateur au démarrage et écouter les changements d'auth
  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        loadUserProfile(session.user.id);
      } else {
        setSupabaseUser(null);
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profile) {
        setUser({
          id: userId,
          email: profile.email,
          nom: profile.nom,
          prenom: profile.prenom
        });
      } else if (supabaseUser) {
        // Si pas de profil, créer un profil basique
        setUser({
          id: userId,
          email: supabaseUser.email || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, nom: string, prenom: string): Promise<boolean> => {
    try {
      // 1. Créer le compte Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        console.error('Erreur d\'inscription:', authError);
        return false;
      }

      if (!authData.user) {
        console.error('Pas d\'utilisateur créé');
        return false;
      }

      // 2. Créer le profil utilisateur dans la table user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          email: email,
          nom: nom,
          prenom: prenom
        });

      if (profileError) {
        console.error('Erreur lors de la création du profil:', profileError);
        // Ne pas bloquer l'inscription si la création du profil échoue
      }

      // 3. Mettre à jour l'état local
      setUser({
        id: authData.user.id,
        email: email,
        nom: nom,
        prenom: prenom
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erreur de connexion:', error);
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      supabaseUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
