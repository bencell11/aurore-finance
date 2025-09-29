/**
 * Service de stockage de profils fiscaux avec Supabase
 * Remplace ProfileStorageService en mode production
 */

import { createClient } from '@supabase/supabase-js';
import { encrypt, decrypt } from '@/lib/utils/encryption';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables d\'environnement Supabase manquantes. Consultez .env.local.example');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface TaxProfile {
  id: string;
  user_id: string;
  personal_info: any;
  income_data: any;
  deductions: any;
  assets: any;
  real_estate: any[];
  documents: any[];
  completion_status: any;
  canton: string;
  tax_year: number;
  last_updated: string;
  created_at: string;
}

export interface TaxCalculation {
  id: string;
  profile_id: string;
  user_id: string;
  canton: string;
  tax_year: number;
  gross_income: number;
  taxable_income: number;
  taxable_wealth: number;
  federal_tax: number;
  cantonal_tax: number;
  communal_tax: number;
  church_tax: number;
  total_tax: number;
  effective_rate: number;
  marginal_rate: number;
  withheld_tax: number;
  remaining_tax: number;
  deductions_breakdown: any;
  calculation_details: any;
  calculated_at: string;
}

export class SupabaseProfileStorageService {
  
  /**
   * Créer ou mettre à jour un profil fiscal
   */
  static async upsertProfile(userId: string, profileData: any): Promise<TaxProfile> {
    try {
      // Chiffrer les données sensibles
      const encryptedPersonalInfo = await encrypt(JSON.stringify(profileData.personalInfo || {}));
      const encryptedIncomeData = await encrypt(JSON.stringify(profileData.incomeData || {}));
      const encryptedAssets = await encrypt(JSON.stringify(profileData.assets || {}));
      
      const { data, error } = await supabase
        .from('tax_profiles')
        .upsert({
          user_id: userId,
          personal_info: profileData.personalInfo || {},
          personal_info_encrypted: encryptedPersonalInfo,
          income_data: profileData.incomeData || {},
          income_data_encrypted: encryptedIncomeData,
          deductions: profileData.deductions || {},
          assets: profileData.assets || {},
          assets_encrypted: encryptedAssets,
          real_estate: profileData.realEstate || [],
          documents: profileData.documents || [],
          completion_status: this.calculateCompletionStatus(profileData),
          canton: profileData.personalInfo?.canton || 'GE',
          tax_year: new Date().getFullYear(),
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id,tax_year'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Logger l'action pour audit RGPD
      await this.logAction(userId, 'upsert', 'tax_profile', data.id);
      
      return data;
    } catch (error) {
      console.error('[Supabase] Erreur upsert profile:', error);
      throw new Error('Erreur lors de la sauvegarde du profil');
    }
  }
  
  /**
   * Récupérer le profil d'un utilisateur
   */
  static async getProfile(userId: string, taxYear?: number): Promise<TaxProfile | null> {
    try {
      const year = taxYear || new Date().getFullYear();
      
      const { data, error } = await supabase
        .from('tax_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('tax_year', year)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      if (!data) return null;
      
      // Déchiffrer les données sensibles si nécessaire
      if (data.personal_info_encrypted) {
        try {
          data.personal_info = JSON.parse(await decrypt(data.personal_info_encrypted));
        } catch (decryptError) {
          console.warn('[Supabase] Erreur déchiffrement personal_info, utilisation version non chiffrée');
        }
      }
      
      if (data.income_data_encrypted) {
        try {
          data.income_data = JSON.parse(await decrypt(data.income_data_encrypted));
        } catch (decryptError) {
          console.warn('[Supabase] Erreur déchiffrement income_data, utilisation version non chiffrée');
        }
      }
      
      // Logger l'accès pour audit RGPD
      await this.logAction(userId, 'read', 'tax_profile', data.id);
      
      return data;
    } catch (error) {
      console.error('[Supabase] Erreur get profile:', error);
      throw new Error('Erreur lors de la récupération du profil');
    }
  }
  
  /**
   * Mettre à jour une section spécifique du profil
   */
  static async updateProfileSection(userId: string, section: string, sectionData: any): Promise<TaxProfile> {
    try {
      const currentProfile = await this.getProfile(userId);
      if (!currentProfile) {
        throw new Error('Profil introuvable');
      }
      
      // Mettre à jour la section spécifique
      const updatedProfile = {
        ...currentProfile,
        [section]: sectionData,
        last_updated: new Date().toISOString()
      };
      
      // Recalculer le statut de complétion
      updatedProfile.completion_status = this.calculateCompletionStatus(updatedProfile);
      
      const { data, error } = await supabase
        .from('tax_profiles')
        .update(updatedProfile)
        .eq('id', currentProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logAction(userId, 'update', 'tax_profile', data.id, { section });
      
      return data;
    } catch (error) {
      console.error('[Supabase] Erreur update section:', error);
      throw new Error(`Erreur lors de la mise à jour de la section ${section}`);
    }
  }
  
  /**
   * Sauvegarder un calcul fiscal
   */
  static async saveCalculation(userId: string, profileId: string, calculationData: any): Promise<TaxCalculation> {
    try {
      const { data, error } = await supabase
        .from('tax_calculations')
        .insert({
          profile_id: profileId,
          user_id: userId,
          canton: calculationData.canton,
          tax_year: calculationData.year || new Date().getFullYear(),
          gross_income: calculationData.grossIncome || 0,
          taxable_income: calculationData.taxableIncome || 0,
          taxable_wealth: calculationData.taxableWealth || 0,
          federal_tax: calculationData.federalTax || 0,
          cantonal_tax: calculationData.cantonalTax || 0,
          communal_tax: calculationData.communalTax || 0,
          church_tax: calculationData.churchTax || 0,
          total_tax: calculationData.totalTax || 0,
          effective_rate: calculationData.effectiveRate || 0,
          marginal_rate: calculationData.marginalRate || 0,
          withheld_tax: calculationData.withheldTax || 0,
          remaining_tax: calculationData.remainingTax || 0,
          deductions_breakdown: calculationData.deductionsBreakdown || {},
          calculation_details: calculationData.calculationDetails || {},
          calculated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logAction(userId, 'create', 'tax_calculation', data.id);
      
      return data;
    } catch (error) {
      console.error('[Supabase] Erreur save calculation:', error);
      throw new Error('Erreur lors de la sauvegarde du calcul');
    }
  }
  
  /**
   * Récupérer le dernier calcul d'un profil
   */
  static async getLatestCalculation(userId: string, profileId: string): Promise<TaxCalculation | null> {
    try {
      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('user_id', userId)
        .eq('profile_id', profileId)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        await this.logAction(userId, 'read', 'tax_calculation', data.id);
      }
      
      return data;
    } catch (error) {
      console.error('[Supabase] Erreur get calculation:', error);
      throw new Error('Erreur lors de la récupération du calcul');
    }
  }
  
  /**
   * Supprimer un profil (RGPD)
   */
  static async deleteProfile(userId: string, profileId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tax_profiles')
        .delete()
        .eq('id', profileId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      await this.logAction(userId, 'delete', 'tax_profile', profileId);
    } catch (error) {
      console.error('[Supabase] Erreur delete profile:', error);
      throw new Error('Erreur lors de la suppression du profil');
    }
  }
  
  /**
   * Obtenir un résumé des données utilisateur
   */
  static async getUserSummary(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_tax_summary')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('[Supabase] Erreur user summary:', error);
      throw new Error('Erreur lors de la récupération du résumé');
    }
  }
  
  /**
   * Calculer le statut de complétion
   */
  private static calculateCompletionStatus(profileData: any) {
    const sections = {
      personalInfo: !!(
        profileData.personalInfo?.canton && 
        profileData.personalInfo?.civilStatus
      ),
      income: !!(
        profileData.incomeData?.mainEmployment?.grossSalary &&
        profileData.incomeData?.mainEmployment?.grossSalary > 0
      ),
      deductions: !!(
        profileData.deductions?.savingsContributions || 
        profileData.deductions?.professionalExpenses
      ),
      assets: !!(
        profileData.assets?.bankAccounts?.length || 
        profileData.assets?.totalWealth
      ),
      realEstate: !!(profileData.realEstate?.length),
      documents: !!(profileData.documents?.length)
    };
    
    const completedSections = Object.values(sections).filter(Boolean).length;
    const totalSections = Object.keys(sections).length;
    const overall = Math.round((completedSections / totalSections) * 100);
    
    return {
      overall,
      sections,
      lastModified: new Date().toISOString(),
      readyForSubmission: overall >= 80
    };
  }
  
  /**
   * Logger une action pour audit RGPD
   */
  private static async logAction(
    userId: string, 
    action: string, 
    resourceType: string, 
    resourceId?: string, 
    details?: any
  ): Promise<void> {
    try {
      await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {},
          ip_address: '127.0.0.1', // À remplacer par la vraie IP
          user_agent: 'Aurore Finance Assistant',
          data_subject_consent: true
        });
    } catch (error) {
      console.warn('[Supabase] Erreur log audit:', error);
      // Ne pas faire échouer l'opération principale pour un problème de log
    }
  }
}