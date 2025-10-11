/**
 * Service de récupération des données utilisateur depuis Supabase
 * Sécurisé - Toutes les données proviennent uniquement de Supabase
 */

import { createClient } from '@/lib/supabase/server';
import { TemplateField } from '@/lib/types/document-templates';

export interface UserData {
  [key: string]: any;
}

export interface GatheredData {
  availableFields: Record<string, any>;
  missingFields: string[];
  warnings: string[];
}

export class DataGatheringService {
  /**
   * Récupère les données utilisateur depuis Supabase pour remplir les champs du template
   */
  static async gatherUserData(
    userId: string,
    requiredFields: TemplateField[],
    optionalFields?: TemplateField[]
  ): Promise<GatheredData> {
    try {
      const supabase = await createClient();

      // Récupérer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('[DataGathering] Error fetching profile:', profileError);
        throw new Error('Impossible de récupérer le profil utilisateur');
      }

      const availableFields: Record<string, any> = {};
      const missingFields: string[] = [];
      const warnings: string[] = [];

      // Traiter les champs requis
      for (const field of requiredFields) {
        const value = await this.extractFieldValue(field, profile, supabase);

        if (value !== null && value !== undefined && value !== '') {
          availableFields[field.key] = value;
        } else if (field.source === 'user_profile') {
          missingFields.push(field.key);
          warnings.push(`Champ manquant dans votre profil: ${field.label}`);
        }
        // Si source = 'manual_input', on ne le marque pas comme missing ici
      }

      // Traiter les champs optionnels
      if (optionalFields) {
        for (const field of optionalFields) {
          const value = await this.extractFieldValue(field, profile, supabase);

          if (value !== null && value !== undefined && value !== '') {
            availableFields[field.key] = value;
          }
        }
      }

      // Ajouter des champs système automatiques
      availableFields['date_envoi'] = new Date().toLocaleDateString('fr-CH');

      console.log('[DataGathering] Gathered data:', {
        availableCount: Object.keys(availableFields).length,
        missingCount: missingFields.length
      });

      return {
        availableFields,
        missingFields,
        warnings
      };

    } catch (error) {
      console.error('[DataGathering] Error:', error);
      throw error;
    }
  }

  /**
   * Extrait la valeur d'un champ depuis les données Supabase
   */
  private static async extractFieldValue(
    field: TemplateField,
    profile: any,
    supabase: any
  ): Promise<any> {
    // Si le champ doit être saisi manuellement, on ne le récupère pas
    if (field.source === 'manual_input') {
      return null;
    }

    // Si le champ est calculé, on applique la logique de calcul
    if (field.source === 'calculated') {
      return this.calculateFieldValue(field, profile);
    }

    // Récupérer depuis le profil Supabase
    if (field.source === 'user_profile' && field.supabaseColumn) {
      const value = profile[field.supabaseColumn];

      // Formatage spécial selon le type
      if (value !== null && value !== undefined) {
        switch (field.type) {
          case 'date':
            return this.formatDate(value);

          case 'phone':
            return this.formatPhone(value);

          case 'postal_code':
            return String(value).padStart(4, '0'); // Swiss postal codes are 4 digits

          default:
            return value;
        }
      }
    }

    // Si supabaseTable est spécifié et différent de 'profiles', faire une requête séparée
    if (field.supabaseTable && field.supabaseTable !== 'profiles' && field.supabaseColumn) {
      try {
        const { data, error } = await supabase
          .from(field.supabaseTable)
          .select(field.supabaseColumn)
          .eq('user_id', profile.id)
          .single();

        if (!error && data) {
          return data[field.supabaseColumn];
        }
      } catch (err) {
        console.warn(`[DataGathering] Could not fetch from ${field.supabaseTable}:`, err);
      }
    }

    return null;
  }

  /**
   * Calcule la valeur d'un champ (pour source: 'calculated')
   */
  private static calculateFieldValue(field: TemplateField, profile: any): any {
    // Exemples de calculs automatiques
    switch (field.key) {
      case 'adresse_assurance':
        // Calculer l'adresse de l'assurance basé sur le nom
        // Ceci serait fait avec une table de référence ou un service externe
        return null; // À implémenter selon les besoins

      case 'date_resiliation_defaut':
        // Date de résiliation par défaut: 31 décembre de l'année prochaine
        const nextYear = new Date().getFullYear() + 1;
        return `31.12.${nextYear}`;

      default:
        return null;
    }
  }

  /**
   * Formate une date en format suisse (JJ.MM.AAAA)
   */
  private static formatDate(value: any): string {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    } catch {
      return value;
    }
  }

  /**
   * Formate un numéro de téléphone suisse
   */
  private static formatPhone(value: any): string {
    try {
      const cleaned = String(value).replace(/\D/g, '');

      if (cleaned.startsWith('41')) {
        // Format international
        return `+41 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
      } else if (cleaned.startsWith('0')) {
        // Format national
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
      }

      return value;
    } catch {
      return value;
    }
  }

  /**
   * Valide que les données obligatoires sont présentes
   */
  static validateRequiredData(
    data: Record<string, any>,
    requiredFields: TemplateField[]
  ): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const field of requiredFields) {
      if (field.required) {
        const value = data[field.key];

        if (value === null || value === undefined || value === '') {
          missing.push(field.label);
        }

        // Validation regex si fournie
        if (value && field.validation) {
          const regex = new RegExp(field.validation);
          if (!regex.test(String(value))) {
            missing.push(`${field.label} (format invalide)`);
          }
        }
      }
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }
}
