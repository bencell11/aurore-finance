/**
 * Service de gestion des favoris et alertes (stockage localStorage pour MVP)
 */

import type { Property, PropertyAlert } from '@/lib/types/real-estate';

export class FavoritesService {
  private static readonly FAVORITES_KEY = 'aurore_real_estate_favorites';
  private static readonly ALERTS_KEY = 'aurore_real_estate_alerts';

  /**
   * Récupère tous les favoris
   */
  static getFavorites(): Property[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(this.FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Ajoute une propriété aux favoris
   */
  static addFavorite(property: Property): void {
    const favorites = this.getFavorites();
    if (!favorites.find(f => f.id === property.id)) {
      favorites.push(property);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  /**
   * Retire une propriété des favoris
   */
  static removeFavorite(propertyId: string): void {
    const favorites = this.getFavorites().filter(f => f.id !== propertyId);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }

  /**
   * Vérifie si une propriété est en favoris
   */
  static isFavorite(propertyId: string): boolean {
    return this.getFavorites().some(f => f.id === propertyId);
  }

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
}
