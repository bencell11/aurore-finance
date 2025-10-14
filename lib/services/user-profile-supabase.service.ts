/**
 * Service de gestion du profil utilisateur avec Supabase Auth
 * Utilise auth.uid() au lieu de localStorage
 */

import { createClient, type UserProfile } from '@/lib/supabase/client';

export class UserProfileSupabaseService {
  private static supabase = createClient();

  /**
   * Récupère le profil utilisateur actuel (basé sur auth.uid())
   */
  static async getProfile(): Promise<UserProfile | null> {
    try {
      // Récupérer l'utilisateur authentifié
      const { data: { user }, error: authError } = await this.supabase.auth.getUser();

      if (authError || !user) {
        console.warn('[UserProfile] No authenticated user');
        return null;
      }

      // Récupérer le profil depuis la table user_profiles
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Si le profil n'existe pas encore (PGRST116), le créer
        if (error.code === 'PGRST116') {
          console.log('[UserProfile] Profile not found, creating...');
          return await this.createProfile(user.id, user.email || '');
        }

        console.error('[UserProfile] Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('[UserProfile] Error in getProfile:', error);
      return null;
    }
  }

  /**
   * Crée un nouveau profil utilisateur
   */
  static async createProfile(userId: string, email: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: email
        })
        .select()
        .single();

      if (error) {
        console.error('[UserProfile] Error creating profile:', error);
        return null;
      }

      console.log('[UserProfile] ✓ Profile created successfully');
      return data as UserProfile;
    } catch (error) {
      console.error('[UserProfile] Error in createProfile:', error);
      return null;
    }
  }

  /**
   * Met à jour le profil utilisateur
   */
  static async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();

      if (!user) {
        console.warn('[UserProfile] No authenticated user for update');
        return null;
      }

      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('[UserProfile] Error updating profile:', error);
        return null;
      }

      console.log('[UserProfile] ✓ Profile updated successfully');
      return data as UserProfile;
    } catch (error) {
      console.error('[UserProfile] Error in updateProfile:', error);
      return null;
    }
  }

  /**
   * Sauvegarde un champ spécifique
   */
  static async saveField(field: keyof UserProfile, value: any): Promise<boolean> {
    try {
      const updated = await this.updateProfile({ [field]: value });
      return !!updated;
    } catch (error) {
      console.error('[UserProfile] Error in saveField:', error);
      return false;
    }
  }

  /**
   * Auto-remplissage de formulaire
   */
  static async autofillForm(fieldMapping: Record<string, keyof UserProfile>): Promise<Record<string, any>> {
    const profile = await this.getProfile();

    if (!profile) {
      return {};
    }

    const filledData: Record<string, any> = {};

    for (const [formField, profileField] of Object.entries(fieldMapping)) {
      const value = profile[profileField];
      if (value !== null && value !== undefined) {
        filledData[formField] = value;
      }
    }

    console.log('[UserProfile] Auto-filled', Object.keys(filledData).length, 'fields');
    return filledData;
  }

  /**
   * Synchronise les données du formulaire vers le profil
   */
  static async syncFormToProfile(
    formData: Record<string, any>,
    fieldMapping: Record<string, keyof UserProfile>
  ): Promise<boolean> {
    const updates: Partial<UserProfile> = {};

    for (const [formField, profileField] of Object.entries(fieldMapping)) {
      if (formData[formField] !== undefined && formData[formField] !== null && formData[formField] !== '') {
        (updates as any)[profileField] = formData[formField];
      }
    }

    if (Object.keys(updates).length === 0) {
      return true;
    }

    const result = await this.updateProfile(updates);
    return !!result;
  }

  /**
   * Récupère les statistiques du dashboard
   */
  static async getDashboardStats() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();

      if (!user) return null;

      // Récupérer les compteurs depuis la vue user_dashboard
      const { data: dashboardData } = await this.supabase
        .from('user_dashboard')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return dashboardData;
    } catch (error) {
      console.error('[UserProfile] Error fetching dashboard stats:', error);
      return null;
    }
  }

  /**
   * Récupère tous les objectifs financiers de l'utilisateur
   */
  static async getFinancialGoals() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();

      if (!user) return [];

      const { data, error } = await this.supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[UserProfile] Error fetching goals:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[UserProfile] Error in getFinancialGoals:', error);
      return [];
    }
  }

  /**
   * Récupère les documents générés
   */
  static async getDocuments(limit: number = 10) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();

      if (!user) return [];

      const { data, error } = await this.supabase
        .from('generated_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[UserProfile] Error fetching documents:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[UserProfile] Error in getDocuments:', error);
      return [];
    }
  }

  /**
   * Récupère les simulations hypothécaires
   */
  static async getMortgageSimulations(limit: number = 10) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();

      if (!user) return [];

      const { data, error } = await this.supabase
        .from('mortgage_simulations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[UserProfile] Error fetching simulations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[UserProfile] Error in getMortgageSimulations:', error);
      return [];
    }
  }

  /**
   * Récupère les favoris immobiliers
   */
  static async getRealEstateFavorites() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();

      if (!user) return [];

      const { data, error } = await this.supabase
        .from('real_estate_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false});

      if (error) {
        console.error('[UserProfile] Error fetching favorites:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[UserProfile] Error in getRealEstateFavorites:', error);
      return [];
    }
  }

  /**
   * Récupère toutes les données utilisateur en une seule fois (pour le dashboard)
   */
  static async getAllUserData() {
    try {
      const [profile, goals, documents, simulations, favorites] = await Promise.all([
        this.getProfile(),
        this.getFinancialGoals(),
        this.getDocuments(5),
        this.getMortgageSimulations(5),
        this.getRealEstateFavorites()
      ]);

      return {
        profile,
        goals,
        documents,
        simulations,
        favorites,
        stats: {
          goalsCount: goals.length,
          goalsCompleted: goals.filter((g: any) => g.statut === 'complete').length,
          documentsCount: documents.length,
          simulationsCount: simulations.length,
          favoritesCount: favorites.length
        }
      };
    } catch (error) {
      console.error('[UserProfile] Error fetching all user data:', error);
      return null;
    }
  }
}
