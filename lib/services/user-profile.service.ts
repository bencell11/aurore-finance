/**
 * Service de gestion du profil utilisateur avec Supabase
 */

import { createClient, type UserProfile } from '@/lib/supabase/client';

export class UserProfileService {
  private static supabase = createClient();

  /**
   * Génère un ID utilisateur basé sur le navigateur (fallback sans auth)
   */
  private static getUserId(): string {
    if (typeof window === 'undefined') return 'server';

    // Vérifier s'il existe déjà un ID dans localStorage
    let userId = localStorage.getItem('aurore_user_id');

    if (!userId) {
      // Générer un nouvel ID unique
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('aurore_user_id', userId);
    }

    return userId;
  }

  /**
   * Récupère le profil utilisateur
   */
  static async getProfile(): Promise<UserProfile | null> {
    try {
      const userId = this.getUserId();

      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Table n'existe pas ou n'est pas configurée
        if (error.code === '42P01' || error.code === 'PGRST301' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('[UserProfile] ⚠️ Supabase not configured. Tables not created. See docs/SUPABASE_SETUP.md');
          console.warn('[UserProfile] Auto-fill will be available after Supabase setup.');
          return null;
        }

        if (error.code === 'PGRST116') {
          // Profil n'existe pas encore, créer un nouveau
          return await this.createProfile(userId);
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
  static async createProfile(userId?: string): Promise<UserProfile | null> {
    try {
      const uid = userId || this.getUserId();

      const { data, error } = await this.supabase
        .from('user_profiles')
        .insert({
          user_id: uid,
          email: null
        })
        .select()
        .single();

      if (error) {
        console.error('[UserProfile] Error creating profile:', error);
        return null;
      }

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
      const userId = this.getUserId();

      // Supprimer les champs non modifiables
      const { id, user_id, created_at, updated_at, last_synced_at, ...updateData } = updates as any;

      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({
          ...updateData,
          last_synced_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('[UserProfile] Error updating profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('[UserProfile] Error in updateProfile:', error);
      return null;
    }
  }

  /**
   * Met à jour ou crée le profil (upsert)
   */
  static async upsertProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const userId = this.getUserId();

      const { data, error } = await this.supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profile,
          last_synced_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('[UserProfile] Error upserting profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('[UserProfile] Error in upsertProfile:', error);
      return null;
    }
  }

  /**
   * Sauvegarde un champ spécifique du profil
   */
  static async saveField(field: keyof UserProfile, value: any): Promise<boolean> {
    try {
      const profile = await this.getProfile();

      if (!profile) {
        // Créer un nouveau profil avec ce champ
        await this.createProfile();
      }

      const result = await this.updateProfile({ [field]: value } as Partial<UserProfile>);
      return result !== null;
    } catch (error) {
      console.error(`[UserProfile] Error saving field ${field}:`, error);
      return false;
    }
  }

  /**
   * Récupère une valeur spécifique du profil
   */
  static async getField<K extends keyof UserProfile>(field: K): Promise<UserProfile[K] | null> {
    try {
      const profile = await this.getProfile();
      return profile ? profile[field] : null;
    } catch (error) {
      console.error(`[UserProfile] Error getting field ${field}:`, error);
      return null;
    }
  }

  /**
   * Vérifie si un profil existe
   */
  static async profileExists(): Promise<boolean> {
    const profile = await this.getProfile();
    return profile !== null;
  }

  /**
   * Efface toutes les données du profil
   */
  static async clearProfile(): Promise<boolean> {
    try {
      const userId = this.getUserId();

      const { error } = await this.supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('[UserProfile] Error clearing profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[UserProfile] Error in clearProfile:', error);
      return false;
    }
  }

  /**
   * Auto-remplit les champs d'un formulaire avec les données du profil
   */
  static async autofillForm(fieldMapping: Record<string, keyof UserProfile>): Promise<Record<string, any>> {
    try {
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

      console.log('[UserProfile] Autofill data:', filledData);
      return filledData;
    } catch (error) {
      console.error('[UserProfile] Error in autofillForm:', error);
      return {};
    }
  }

  /**
   * Synchronise les données du formulaire vers le profil
   */
  static async syncFormToProfile(formData: Record<string, any>, fieldMapping: Record<string, keyof UserProfile>): Promise<boolean> {
    try {
      const updates: Partial<UserProfile> = {};

      for (const [formField, profileField] of Object.entries(fieldMapping)) {
        if (formData[formField] !== undefined && formData[formField] !== null && formData[formField] !== '') {
          (updates as any)[profileField] = formData[formField];
        }
      }

      if (Object.keys(updates).length === 0) {
        return true; // Rien à sauvegarder
      }

      const result = await this.updateProfile(updates);
      return result !== null;
    } catch (error) {
      console.error('[UserProfile] Error in syncFormToProfile:', error);
      return false;
    }
  }

  /**
   * Obtient l'ID utilisateur actuel
   */
  static getCurrentUserId(): string {
    return this.getUserId();
  }
}
