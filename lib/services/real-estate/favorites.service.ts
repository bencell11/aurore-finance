/**
 * Service de gestion des favoris et alertes immobiliers
 * Supporte à la fois localStorage (utilisateurs non connectés) et Supabase (utilisateurs connectés)
 */

import { createClient } from '@/lib/supabase/client';
import type { Property, PropertyAlert } from '@/lib/types/real-estate';
import type { RealEstateFavorite } from '@/lib/supabase/client';

export class FavoritesService {
  private static readonly FAVORITES_KEY = 'aurore_real_estate_favorites';
  private static readonly ALERTS_KEY = 'aurore_real_estate_alerts';

  /**
   * Obtenir l'utilisateur courant
   */
  private static async getCurrentUser() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch {
      return null;
    }
  }

  /**
   * Récupère tous les favoris (localStorage ou Supabase selon l'authentification)
   */
  static async getFavorites(): Promise<Property[]> {
    const user = await this.getCurrentUser();

    if (user) {
      // Utilisateur connecté: récupérer depuis Supabase
      return this.getSupabaseFavorites(user.id);
    } else {
      // Utilisateur non connecté: utiliser localStorage
      return this.getLocalStorageFavorites();
    }
  }

  /**
   * Récupère les IDs des favoris (pour un affichage rapide)
   */
  static async getFavoriteIds(): Promise<string[]> {
    const favorites = await this.getFavorites();
    return favorites.map(f => f.id);
  }

  /**
   * Ajoute une propriété aux favoris
   */
  static async addFavorite(property: Property): Promise<boolean> {
    const user = await this.getCurrentUser();

    if (user) {
      return this.addSupabaseFavorite(user.id, property);
    } else {
      return this.addLocalStorageFavorite(property);
    }
  }

  /**
   * Retire une propriété des favoris
   */
  static async removeFavorite(propertyId: string): Promise<boolean> {
    const user = await this.getCurrentUser();

    if (user) {
      return this.removeSupabaseFavorite(user.id, propertyId);
    } else {
      return this.removeLocalStorageFavorite(propertyId);
    }
  }

  /**
   * Vérifie si une propriété est en favoris
   */
  static async isFavorite(propertyId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(f => f.id === propertyId);
  }

  // ============= SUPABASE METHODS =============

  private static async getSupabaseFavorites(userId: string): Promise<Property[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('real_estate_favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[FavoritesService] Error fetching Supabase favorites:', error);
        return [];
      }

      return (data || []).map((f: RealEstateFavorite) => f.property_data);
    } catch (error) {
      console.error('[FavoritesService] Exception in getSupabaseFavorites:', error);
      return [];
    }
  }

  private static async addSupabaseFavorite(userId: string, property: Property): Promise<boolean> {
    try {
      const supabase = createClient();

      // Vérifier si déjà en favoris
      const { data: existing } = await supabase
        .from('real_estate_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', property.id)
        .single();

      if (existing) {
        console.log('[FavoritesService] Property already in Supabase favorites');
        return true;
      }

      const { error } = await supabase
        .from('real_estate_favorites')
        .insert({
          user_id: userId,
          property_id: property.id,
          property_data: property,
          tags: [],
        });

      if (error) {
        console.error('[FavoritesService] Error adding Supabase favorite:', error);
        return false;
      }

      console.log('[FavoritesService] Supabase favorite added successfully');
      return true;
    } catch (error) {
      console.error('[FavoritesService] Exception in addSupabaseFavorite:', error);
      return false;
    }
  }

  private static async removeSupabaseFavorite(userId: string, propertyId: string): Promise<boolean> {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('real_estate_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) {
        console.error('[FavoritesService] Error removing Supabase favorite:', error);
        return false;
      }

      console.log('[FavoritesService] Supabase favorite removed successfully');
      return true;
    } catch (error) {
      console.error('[FavoritesService] Exception in removeSupabaseFavorite:', error);
      return false;
    }
  }

  // ============= LOCAL STORAGE METHODS =============

  private static getLocalStorageFavorites(): Property[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(this.FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static addLocalStorageFavorite(property: Property): boolean {
    try {
      const favorites = this.getLocalStorageFavorites();
      if (!favorites.find(f => f.id === property.id)) {
        favorites.push(property);
        localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
      }
      return true;
    } catch {
      return false;
    }
  }

  private static removeLocalStorageFavorite(propertyId: string): boolean {
    try {
      const favorites = this.getLocalStorageFavorites().filter(f => f.id !== propertyId);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    } catch {
      return false;
    }
  }

  // ============= ALERTS METHODS (localStorage only for now) =============

  /**
   * Récupère toutes les alertes
   */
  static getAlerts(): PropertyAlert[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(this.ALERTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Ajoute une alerte
   */
  static addAlert(alert: Omit<PropertyAlert, 'id' | 'createdAt'>): void {
    const alerts = this.getAlerts();
    const newAlert: PropertyAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    alerts.push(newAlert);
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));
  }

  /**
   * Retire une alerte
   */
  static removeAlert(alertId: string): void {
    const alerts = this.getAlerts().filter(a => a.id !== alertId);
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));
  }

  /**
   * Vérifie si une propriété correspond aux critères d'une alerte
   */
  static matchesAlert(property: Property, alert: PropertyAlert): boolean {
    const criteria = alert.criteria;

    if (criteria.transactionType && property.transactionType !== criteria.transactionType) {
      return false;
    }

    if (criteria.propertyType && property.propertyType !== criteria.propertyType) {
      return false;
    }

    if (criteria.location?.city && !property.address.city.toLowerCase().includes(criteria.location.city.toLowerCase())) {
      return false;
    }

    if (criteria.location?.canton && property.address.canton !== criteria.location.canton) {
      return false;
    }

    if (criteria.priceMin && property.price < criteria.priceMin) {
      return false;
    }

    if (criteria.priceMax && property.price > criteria.priceMax) {
      return false;
    }

    if (criteria.roomsMin && property.rooms < criteria.roomsMin) {
      return false;
    }

    if (criteria.surfaceMin && property.surface < criteria.surfaceMin) {
      return false;
    }

    return true;
  }

  /**
   * Migrer les favoris de localStorage vers Supabase lors de la connexion
   */
  static async migrateLocalFavoritesToSupabase(userId: string): Promise<void> {
    try {
      const localFavorites = this.getLocalStorageFavorites();

      if (localFavorites.length === 0) {
        console.log('[FavoritesService] No local favorites to migrate');
        return;
      }

      console.log(`[FavoritesService] Migrating ${localFavorites.length} local favorites to Supabase`);

      for (const property of localFavorites) {
        await this.addSupabaseFavorite(userId, property);
      }

      // Vider le localStorage après migration
      localStorage.removeItem(this.FAVORITES_KEY);
      console.log('[FavoritesService] Migration completed and localStorage cleared');
    } catch (error) {
      console.error('[FavoritesService] Error during migration:', error);
    }
  }
}
