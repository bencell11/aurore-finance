'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@/lib/supabase/client';
import { UserProfileService } from '@/lib/services/user-profile.service';

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  saveField: (field: keyof UserProfile, value: any) => Promise<boolean>;
  getField: <K extends keyof UserProfile>(field: K) => UserProfile[K] | null;

  // Auto-fill helpers
  autofillForm: (fieldMapping: Record<string, keyof UserProfile>) => Record<string, any>;
  syncFormToProfile: (formData: Record<string, any>, fieldMapping: Record<string, keyof UserProfile>) => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le profil au montage
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await UserProfileService.getProfile();
      setProfile(data);

      if (data) {
        console.log('[UserProfileContext] ✓ Profile loaded successfully');
      } else {
        console.log('[UserProfileContext] ℹ️ No profile found (Supabase may not be configured)');
      }
    } catch (err: any) {
      // Don't break the app if Supabase isn't configured
      console.warn('[UserProfileContext] ⚠️ Could not load profile:', err.message);
      setProfile(null);
      setError(null); // Don't propagate error - app should work without Supabase
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger au montage
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Mettre à jour le profil
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const updated = await UserProfileService.updateProfile(updates);

      if (updated) {
        setProfile(updated);
        console.log('[UserProfileContext] ✓ Profile updated successfully');
        return true;
      }

      console.log('[UserProfileContext] ℹ️ Profile update skipped (Supabase not configured)');
      return false;
    } catch (err: any) {
      console.warn('[UserProfileContext] ⚠️ Could not update profile:', err.message);
      return false; // Don't break the app
    }
  }, []);

  // Sauvegarder un champ
  const saveField = useCallback(async (field: keyof UserProfile, value: any): Promise<boolean> => {
    try {
      const success = await UserProfileService.saveField(field, value);

      if (success) {
        // Recharger le profil pour avoir les données à jour
        await loadProfile();
      }

      return success;
    } catch (err: any) {
      console.warn('[UserProfileContext] ⚠️ Could not save field:', err.message);
      return false; // Don't break the app
    }
  }, [loadProfile]);

  // Obtenir un champ
  const getField = useCallback(<K extends keyof UserProfile>(field: K): UserProfile[K] | null => {
    return profile ? profile[field] : null;
  }, [profile]);

  // Auto-remplir un formulaire
  const autofillForm = useCallback((fieldMapping: Record<string, keyof UserProfile>): Record<string, any> => {
    if (!profile) return {};

    const filledData: Record<string, any> = {};

    for (const [formField, profileField] of Object.entries(fieldMapping)) {
      const value = profile[profileField];
      if (value !== null && value !== undefined) {
        filledData[formField] = value;
      }
    }

    console.log('[UserProfileContext] Autofill data:', filledData);
    return filledData;
  }, [profile]);

  // Synchroniser le formulaire vers le profil
  const syncFormToProfile = useCallback(async (
    formData: Record<string, any>,
    fieldMapping: Record<string, keyof UserProfile>
  ): Promise<boolean> => {
    try {
      const updates: Partial<UserProfile> = {};

      for (const [formField, profileField] of Object.entries(fieldMapping)) {
        if (formData[formField] !== undefined && formData[formField] !== null && formData[formField] !== '') {
          (updates as any)[profileField] = formData[formField];
        }
      }

      if (Object.keys(updates).length === 0) {
        return true;
      }

      return await updateProfile(updates);
    } catch (err: any) {
      console.warn('[UserProfileContext] ⚠️ Could not sync form to profile:', err.message);
      return false; // Don't break the app
    }
  }, [updateProfile]);

  const value: UserProfileContextType = {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    saveField,
    getField,
    autofillForm,
    syncFormToProfile
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);

  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }

  return context;
}
