import { calculImpotTotal, type TaxCalculationInput } from '@/lib/utils/swiss-tax-formulas';

/**
 * Service de calcul fiscal pour Aurore Finance
 * Transforme les données utilisateur en calculs fiscaux complets
 */
export class TaxCalculationService {
  /**
   * Calcule les impôts totaux à partir du profil utilisateur
   */
  static calculateTax(userData: {
    salaireBrut: number;
    autresRevenus?: number;
    canton: string;
    commune?: string;
    situationFamiliale: string;
    nombreEnfants?: number;
    fortuneBrute?: number;
    dettes?: number;
    deductions?: {
      pilier3a?: number;
      primes?: number;
      fraisPro?: number;
      gardeEnfants?: number;
      formation?: number;
      dons?: number;
      interetsHypothecaires?: number;
      pensionAlimentaire?: number;
      fraisMedicaux?: number;
      autres?: number;
    };
  }) {
    const input: TaxCalculationInput = {
      salaireBrut: userData.salaireBrut,
      autresRevenus: userData.autresRevenus || 0,
      canton: this.normalizeCantonCode(userData.canton),
      commune: userData.commune || this.getDefaultCommune(userData.canton),
      situationFamiliale: this.normalizeSituation(userData.situationFamiliale),
      nombreEnfants: userData.nombreEnfants || 0,
      fortuneBrute: userData.fortuneBrute || 0,
      dettes: userData.dettes || 0,
      deductions: {
        pilier3a: userData.deductions?.pilier3a || 0,
        primes_assurance: userData.deductions?.primes || 0,
        frais_professionnels: userData.deductions?.fraisPro || 0,
        frais_garde_enfants: userData.deductions?.gardeEnfants || 0,
        frais_formation: userData.deductions?.formation || 0,
        dons: userData.deductions?.dons || 0,
        interets_hypothecaires: userData.deductions?.interetsHypothecaires || 0,
        pension_alimentaire: userData.deductions?.pensionAlimentaire || 0,
        frais_medicaux: userData.deductions?.fraisMedicaux || 0,
        autres: userData.deductions?.autres || 0,
      },
    };

    return calculImpotTotal(input);
  }

  /**
   * Normalise le code canton (nom complet → code 2 lettres)
   */
  private static normalizeCantonCode(canton: string): string {
    const mapping: Record<string, string> = {
      'Vaud': 'VD',
      'Genève': 'GE',
      'Geneva': 'GE',
      'Zurich': 'ZH',
      'Zürich': 'ZH',
      'Berne': 'BE',
      'Bern': 'BE',
      'Lucerne': 'LU',
      'Uri': 'UR',
      'Schwyz': 'SZ',
      'Obwald': 'OW',
      'Nidwald': 'NW',
      'Glaris': 'GL',
      'Glarus': 'GL',
      'Zoug': 'ZG',
      'Zug': 'ZG',
      'Fribourg': 'FR',
      'Freiburg': 'FR',
      'Soleure': 'SO',
      'Solothurn': 'SO',
      'Bâle-Ville': 'BS',
      'Basel-Stadt': 'BS',
      'Bâle-Campagne': 'BL',
      'Basel-Landschaft': 'BL',
      'Schaffhouse': 'SH',
      'Schaffhausen': 'SH',
      'Appenzell Rhodes-Extérieures': 'AR',
      'Appenzell Ausserrhoden': 'AR',
      'Appenzell Rhodes-Intérieures': 'AI',
      'Appenzell Innerrhoden': 'AI',
      'Saint-Gall': 'SG',
      'St. Gallen': 'SG',
      'Grisons': 'GR',
      'Graubünden': 'GR',
      'Argovie': 'AG',
      'Aargau': 'AG',
      'Thurgovie': 'TG',
      'Thurgau': 'TG',
      'Tessin': 'TI',
      'Ticino': 'TI',
      'Valais': 'VS',
      'Wallis': 'VS',
      'Neuchâtel': 'NE',
      'Jura': 'JU',
    };

    // Si c'est déjà un code 2 lettres, le retourner en majuscules
    if (canton.length === 2) {
      return canton.toUpperCase();
    }

    return mapping[canton] || canton;
  }

  /**
   * Retourne la commune chef-lieu par défaut pour chaque canton
   */
  private static getDefaultCommune(canton: string): string {
    const defaults: Record<string, string> = {
      'VD': 'Lausanne',
      'GE': 'Genève',
      'ZH': 'Zürich',
      'BE': 'Berne',
      'LU': 'Lucerne',
      'UR': 'Altdorf',
      'SZ': 'Schwyz',
      'OW': 'Sarnen',
      'NW': 'Stans',
      'GL': 'Glaris',
      'ZG': 'Zoug',
      'FR': 'Fribourg',
      'SO': 'Soleure',
      'BS': 'Bâle',
      'BL': 'Liestal',
      'SH': 'Schaffhouse',
      'AR': 'Herisau',
      'AI': 'Appenzell',
      'SG': 'Saint-Gall',
      'GR': 'Coire',
      'AG': 'Aarau',
      'TG': 'Frauenfeld',
      'TI': 'Bellinzone',
      'VS': 'Sion',
      'NE': 'Neuchâtel',
      'JU': 'Delémont',
    };

    const code = this.normalizeCantonCode(canton);
    return defaults[code] || 'Chef-lieu';
  }

  /**
   * Normalise la situation familiale
   */
  private static normalizeSituation(situation: string): 'celibataire' | 'marie' | 'divorce' | 'veuf' | 'concubinage' {
    const mapping: Record<string, 'celibataire' | 'marie' | 'divorce' | 'veuf' | 'concubinage'> = {
      'celibataire': 'celibataire',
      'Célibataire': 'celibataire',
      'marie': 'marie',
      'Marié(e)': 'marie',
      'marié': 'marie',
      'mariée': 'marie',
      'divorce': 'divorce',
      'Divorcé(e)': 'divorce',
      'divorcé': 'divorce',
      'divorcée': 'divorce',
      'veuf': 'veuf',
      'Veuf(ve)': 'veuf',
      'veuve': 'veuf',
      'concubinage': 'concubinage',
      'Pacsé(e)': 'concubinage',
      'pacs': 'concubinage',
      'pacsé': 'concubinage',
      'pacsée': 'concubinage',
    };

    return mapping[situation] || 'celibataire';
  }
}
