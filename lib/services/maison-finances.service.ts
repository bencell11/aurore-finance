import { createClient } from '@/lib/supabase/client';
import { MaisonDesFinancesData } from '@/lib/types/maison-finances';

/**
 * Service centralisé pour gérer les données de la Maison des Finances
 * Utilise la fonction RPC PostgreSQL pour optimiser les requêtes
 */
export class MaisonFinancesService {
  private static supabase = createClient();

  /**
   * Charge toutes les données de la maison en UNE SEULE requête
   * Utilise la fonction RPC PostgreSQL get_maison_finances_complete
   * Avec fallback sur la méthode classique si la fonction RPC n'existe pas
   */
  static async loadComplete(userId: string): Promise<MaisonDesFinancesData | null> {
    try {
      // Tenter d'utiliser la fonction RPC
      const { data, error } = await this.supabase
        .rpc('get_maison_finances_complete', { user_id_param: userId });

      if (error) {
        // Si la fonction n'existe pas (404), utiliser le fallback
        if (error.message?.includes('not found') || error.code === 'PGRST202' || error.code === '42883') {
          console.warn('⚠️ RPC function not found, using fallback method (Promise.all)');
          return await this.loadCompleteFallback(userId);
        }
        console.error('Error calling RPC function:', error);
        throw error;
      }

      // Si aucune maison n'existe, créer une nouvelle
      if (!data) {
        console.log('No maison found, creating new one');
        return await this.createNew(userId);
      }

      return data as MaisonDesFinancesData;
    } catch (error) {
      console.error('Error loading maison finances:', error);
      // Fallback en cas d'erreur
      console.warn('Using fallback method due to error');
      return await this.loadCompleteFallback(userId);
    }
  }

  /**
   * Méthode fallback : charge les données avec la méthode classique (9 requêtes parallèles)
   * Utilisée si la fonction RPC n'existe pas encore
   */
  private static async loadCompleteFallback(userId: string): Promise<MaisonDesFinancesData | null> {
    try {
      const { data: maison } = await this.supabase
        .from('maison_finances')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!maison) {
        return await this.createNew(userId);
      }

      // Charger toutes les sections en parallèle
      const [
        { data: sante },
        { data: revenu },
        { data: biens },
        { data: vieillesse },
        { data: fortune },
        { data: immobilier },
        { data: budget },
        { data: fiscalite },
        { data: juridique }
      ] = await Promise.all([
        this.supabase.from('sante_data').select('*').eq('user_id', userId).maybeSingle(),
        this.supabase.from('revenu_data').select('*').eq('user_id', userId).maybeSingle(),
        this.supabase.from('biens_data').select('*').eq('user_id', userId).maybeSingle(),
        this.supabase.from('vieillesse_data').select('*').eq('user_id', userId).maybeSingle(),
        this.supabase.from('fortune_data').select('*').eq('user_id', userId).maybeSingle(),
        this.supabase.from('immobilier_data').select('*').eq('user_id', userId).maybeSingle(),
        this.supabase.from('budget_data').select('*').eq('user_id', userId).maybeSingle(),
        this.supabase.from('fiscalite_data').select('*').eq('user_id', userId).maybeSingle(),
        this.supabase.from('juridique_data').select('*').eq('user_id', userId).maybeSingle()
      ]);

      return {
        user_id: userId,
        derniere_mise_a_jour: maison.derniere_mise_a_jour,
        score_global: maison.score_global || 0,
        completion_status: maison.completion_status,
        sante: sante || {} as any,
        revenu: revenu || {} as any,
        biens: biens || {} as any,
        vieillesse: vieillesse || {} as any,
        fortune: fortune || {} as any,
        immobilier: immobilier || {} as any,
        budget: budget || {} as any,
        fiscalite: fiscalite || {} as any,
        juridique: juridique || {} as any
      };
    } catch (error) {
      console.error('Error in fallback method:', error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle maison des finances avec les valeurs par défaut
   */
  static async createNew(userId: string): Promise<MaisonDesFinancesData> {
    const { data, error } = await this.supabase
      .from('maison_finances')
      .insert([{
        user_id: userId,
        score_global: 0,
        completion_status: {
          sante: 'non_commence',
          revenu: 'non_commence',
          biens: 'non_commence',
          vieillesse: 'non_commence',
          fortune: 'non_commence',
          immobilier: 'non_commence',
          budget: 'non_commence',
          fiscalite: 'non_commence',
          juridique: 'non_commence'
        }
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating new maison:', error);
      throw error;
    }

    return {
      user_id: userId,
      derniere_mise_a_jour: new Date().toISOString(),
      score_global: 0,
      completion_status: data.completion_status,
      sante: {} as any,
      revenu: {} as any,
      biens: {} as any,
      vieillesse: {} as any,
      fortune: {} as any,
      immobilier: {} as any,
      budget: {} as any,
      fiscalite: {} as any,
      juridique: {} as any
    };
  }

  /**
   * Sauvegarde une section spécifique
   * @param userId - ID de l'utilisateur
   * @param section - Nom de la section (sante, revenu, biens, etc.)
   * @param data - Données à sauvegarder
   */
  static async saveSection(
    userId: string,
    section: string,
    data: any
  ): Promise<void> {
    const tableName = `${section}_data`;

    try {
      // Vérifier si un enregistrement existe déjà
      const { data: existing } = await this.supabase
        .from(tableName)
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Update
        const { error: updateError } = await this.supabase
          .from(tableName)
          .update(data)
          .eq('user_id', userId);

        if (updateError) throw updateError;
      } else {
        // Insert
        const { error: insertError } = await this.supabase
          .from(tableName)
          .insert([{ ...data, user_id: userId }]);

        if (insertError) throw insertError;
      }

      // Mettre à jour le statut de complétion
      await this.updateCompletionStatus(userId, section, 'termine');

      // Optionnel: Recalculer le score global
      // await this.updateGlobalScore(userId);
    } catch (error) {
      console.error(`Error saving section ${section}:`, error);
      throw error;
    }
  }

  /**
   * Met à jour le statut de complétion d'une section
   */
  private static async updateCompletionStatus(
    userId: string,
    section: string,
    status: 'non_commence' | 'en_cours' | 'termine'
  ): Promise<void> {
    try {
      // Récupérer le statut actuel
      const { data: maison } = await this.supabase
        .from('maison_finances')
        .select('completion_status')
        .eq('user_id', userId)
        .single();

      if (!maison) {
        console.warn('Maison not found for status update');
        return;
      }

      const newStatus = {
        ...maison.completion_status,
        [section]: status
      };

      const { error } = await this.supabase
        .from('maison_finances')
        .update({
          completion_status: newStatus,
          derniere_mise_a_jour: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating completion status:', error);
      // Ne pas throw ici pour ne pas bloquer la sauvegarde principale
    }
  }

  /**
   * Calcule et met à jour le score global
   * Basé sur les scores individuels de chaque section
   */
  static async updateGlobalScore(userId: string): Promise<void> {
    try {
      // TODO: Implémenter la logique de calcul du score
      // 1. Récupérer les scores de chaque section
      // 2. Appliquer les poids configurés
      // 3. Calculer la moyenne pondérée
      // 4. Mettre à jour le score_global dans maison_finances

      const scores = await this.getAllSectionScores(userId);
      const globalScore = this.calculateWeightedAverage(scores);

      const { error } = await this.supabase
        .from('maison_finances')
        .update({ score_global: globalScore })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating global score:', error);
    }
  }

  /**
   * Récupère tous les scores des sections
   */
  private static async getAllSectionScores(userId: string): Promise<Record<string, number>> {
    const scores: Record<string, number> = {};

    const sections = ['sante', 'revenu', 'biens', 'vieillesse', 'fortune', 'immobilier', 'budget', 'fiscalite', 'juridique'];

    for (const section of sections) {
      const { data } = await this.supabase
        .from(`${section}_data`)
        .select(`${section}_score`)
        .eq('user_id', userId)
        .maybeSingle();

      if (data && data[`${section}_score`]) {
        scores[section] = data[`${section}_score`];
      } else {
        scores[section] = 0;
      }
    }

    return scores;
  }

  /**
   * Calcule la moyenne pondérée des scores
   */
  private static calculateWeightedAverage(scores: Record<string, number>): number {
    // Poids par défaut (à personnaliser selon les besoins)
    const weights = {
      sante: 1.2,      // Sécurité (prioritaire)
      revenu: 1.2,     // Sécurité (prioritaire)
      biens: 1.0,      // Sécurité
      vieillesse: 1.1, // Planification (important)
      fortune: 0.9,    // Planification
      immobilier: 0.8, // Développement
      budget: 1.0,     // Développement (important)
      fiscalite: 0.7,  // Optimisation
      juridique: 0.6   // Optimisation
    };

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const [section, score] of Object.entries(scores)) {
      const weight = weights[section as keyof typeof weights] || 1;
      totalWeightedScore += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  }

  /**
   * Supprime toutes les données d'une maison (attention, irréversible)
   */
  static async deleteAll(userId: string): Promise<void> {
    try {
      const sections = ['sante', 'revenu', 'biens', 'vieillesse', 'fortune', 'immobilier', 'budget', 'fiscalite', 'juridique'];

      // Supprimer toutes les sections
      for (const section of sections) {
        await this.supabase
          .from(`${section}_data`)
          .delete()
          .eq('user_id', userId);
      }

      // Supprimer la maison principale
      await this.supabase
        .from('maison_finances')
        .delete()
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error deleting maison:', error);
      throw error;
    }
  }
}
