import { Canton } from '@/types/user';

interface BaremeImpot {
  de: number;
  a: number;
  taux: number;
}

interface CantonTaxData {
  nom: string;
  tauxBase: number;
  baremesCelibataires: BaremeImpot[];
  baremesMaries: BaremeImpot[];
  deductions: {
    celibataire: number;
    marie: number;
    parEnfant: number;
    fraisProfessionnels: number;
    pilier3aMax: number;
  };
}

export const cantonalTaxData: Record<string, CantonTaxData> = {
  'GE': {
    nom: 'Genève',
    tauxBase: 13.5,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 8 },
      { de: 20000, a: 40000, taux: 10 },
      { de: 40000, a: 60000, taux: 12 },
      { de: 60000, a: 80000, taux: 14 },
      { de: 80000, a: 120000, taux: 16 },
      { de: 120000, a: 180000, taux: 18 },
      { de: 180000, a: 250000, taux: 19 },
      { de: 250000, a: Infinity, taux: 19.5 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 6 },
      { de: 30000, a: 50000, taux: 8 },
      { de: 50000, a: 70000, taux: 10 },
      { de: 70000, a: 100000, taux: 12 },
      { de: 100000, a: 150000, taux: 14 },
      { de: 150000, a: 220000, taux: 16 },
      { de: 220000, a: 300000, taux: 17 },
      { de: 300000, a: Infinity, taux: 18 }
    ],
    deductions: {
      celibataire: 10000,
      marie: 19700,
      parEnfant: 10000,
      fraisProfessionnels: 2000,
      pilier3aMax: 7056
    }
  },
  'VD': {
    nom: 'Vaud',
    tauxBase: 12.5,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 6 },
      { de: 25000, a: 50000, taux: 9 },
      { de: 50000, a: 75000, taux: 11 },
      { de: 75000, a: 100000, taux: 13 },
      { de: 100000, a: 150000, taux: 15 },
      { de: 150000, a: 200000, taux: 17 },
      { de: 200000, a: 250000, taux: 18 },
      { de: 250000, a: Infinity, taux: 19 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 5 },
      { de: 35000, a: 60000, taux: 7 },
      { de: 60000, a: 85000, taux: 9 },
      { de: 85000, a: 120000, taux: 11 },
      { de: 120000, a: 170000, taux: 13 },
      { de: 170000, a: 240000, taux: 15 },
      { de: 240000, a: 300000, taux: 16 },
      { de: 300000, a: Infinity, taux: 17 }
    ],
    deductions: {
      celibataire: 9400,
      marie: 18800,
      parEnfant: 8000,
      fraisProfessionnels: 2400,
      pilier3aMax: 7056
    }
  },
  'ZH': {
    nom: 'Zurich',
    tauxBase: 11,
    baremesCelibataires: [
      { de: 0, a: 30000, taux: 5 },
      { de: 30000, a: 55000, taux: 7 },
      { de: 55000, a: 80000, taux: 9 },
      { de: 80000, a: 110000, taux: 11 },
      { de: 110000, a: 150000, taux: 13 },
      { de: 150000, a: 200000, taux: 14.5 },
      { de: 200000, a: 280000, taux: 15.5 },
      { de: 280000, a: Infinity, taux: 16 }
    ],
    baremesMaries: [
      { de: 0, a: 40000, taux: 4 },
      { de: 40000, a: 70000, taux: 6 },
      { de: 70000, a: 100000, taux: 8 },
      { de: 100000, a: 140000, taux: 10 },
      { de: 140000, a: 190000, taux: 12 },
      { de: 190000, a: 260000, taux: 13.5 },
      { de: 260000, a: 350000, taux: 14.5 },
      { de: 350000, a: Infinity, taux: 15 }
    ],
    deductions: {
      celibataire: 8500,
      marie: 17000,
      parEnfant: 7500,
      fraisProfessionnels: 2200,
      pilier3aMax: 7056
    }
  },
  'BE': {
    nom: 'Berne',
    tauxBase: 13,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 7 },
      { de: 20000, a: 45000, taux: 9 },
      { de: 45000, a: 70000, taux: 11 },
      { de: 70000, a: 100000, taux: 13 },
      { de: 100000, a: 140000, taux: 15 },
      { de: 140000, a: 190000, taux: 16.5 },
      { de: 190000, a: 250000, taux: 17.5 },
      { de: 250000, a: Infinity, taux: 18 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 5.5 },
      { de: 30000, a: 55000, taux: 7.5 },
      { de: 55000, a: 85000, taux: 9.5 },
      { de: 85000, a: 120000, taux: 11.5 },
      { de: 120000, a: 165000, taux: 13.5 },
      { de: 165000, a: 230000, taux: 15 },
      { de: 230000, a: 300000, taux: 16 },
      { de: 300000, a: Infinity, taux: 16.5 }
    ],
    deductions: {
      celibataire: 9000,
      marie: 18000,
      parEnfant: 8200,
      fraisProfessionnels: 2500,
      pilier3aMax: 7056
    }
  },
  'VS': {
    nom: 'Valais',
    tauxBase: 14,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 8 },
      { de: 25000, a: 50000, taux: 10 },
      { de: 50000, a: 75000, taux: 12 },
      { de: 75000, a: 100000, taux: 14 },
      { de: 100000, a: 150000, taux: 16 },
      { de: 150000, a: 200000, taux: 17.5 },
      { de: 200000, a: Infinity, taux: 18.5 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 6 },
      { de: 35000, a: 60000, taux: 8 },
      { de: 60000, a: 85000, taux: 10 },
      { de: 85000, a: 120000, taux: 12 },
      { de: 120000, a: 170000, taux: 14 },
      { de: 170000, a: 240000, taux: 15.5 },
      { de: 240000, a: Infinity, taux: 16.5 }
    ],
    deductions: {
      celibataire: 8800,
      marie: 17600,
      parEnfant: 7800,
      fraisProfessionnels: 2300,
      pilier3aMax: 7056
    }
  },
  'FR': {
    nom: 'Fribourg',
    tauxBase: 13.5,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 7.5 },
      { de: 20000, a: 40000, taux: 9.5 },
      { de: 40000, a: 60000, taux: 11.5 },
      { de: 60000, a: 85000, taux: 13.5 },
      { de: 85000, a: 120000, taux: 15 },
      { de: 120000, a: 170000, taux: 16.5 },
      { de: 170000, a: Infinity, taux: 17.5 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 6 },
      { de: 30000, a: 50000, taux: 8 },
      { de: 50000, a: 75000, taux: 10 },
      { de: 75000, a: 105000, taux: 12 },
      { de: 105000, a: 145000, taux: 14 },
      { de: 145000, a: 200000, taux: 15.5 },
      { de: 200000, a: Infinity, taux: 16.5 }
    ],
    deductions: {
      celibataire: 9200,
      marie: 18400,
      parEnfant: 8000,
      fraisProfessionnels: 2400,
      pilier3aMax: 7056
    }
  },
  'NE': {
    nom: 'Neuchâtel',
    tauxBase: 14.5,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 8.5 },
      { de: 25000, a: 50000, taux: 10.5 },
      { de: 50000, a: 75000, taux: 12.5 },
      { de: 75000, a: 100000, taux: 14.5 },
      { de: 100000, a: 150000, taux: 16 },
      { de: 150000, a: 200000, taux: 17.5 },
      { de: 200000, a: Infinity, taux: 18.5 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 7 },
      { de: 35000, a: 60000, taux: 9 },
      { de: 60000, a: 85000, taux: 11 },
      { de: 85000, a: 120000, taux: 13 },
      { de: 120000, a: 170000, taux: 15 },
      { de: 170000, a: 240000, taux: 16.5 },
      { de: 240000, a: Infinity, taux: 17.5 }
    ],
    deductions: {
      celibataire: 9500,
      marie: 19000,
      parEnfant: 8300,
      fraisProfessionnels: 2500,
      pilier3aMax: 7056
    }
  },
  'JU': {
    nom: 'Jura',
    tauxBase: 15,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 9 },
      { de: 20000, a: 40000, taux: 11 },
      { de: 40000, a: 60000, taux: 13 },
      { de: 60000, a: 85000, taux: 15 },
      { de: 85000, a: 120000, taux: 16.5 },
      { de: 120000, a: 170000, taux: 17.5 },
      { de: 170000, a: Infinity, taux: 18.5 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 7 },
      { de: 30000, a: 50000, taux: 9 },
      { de: 50000, a: 75000, taux: 11 },
      { de: 75000, a: 105000, taux: 13 },
      { de: 105000, a: 145000, taux: 15 },
      { de: 145000, a: 200000, taux: 16.5 },
      { de: 200000, a: Infinity, taux: 17.5 }
    ],
    deductions: {
      celibataire: 9000,
      marie: 18000,
      parEnfant: 8000,
      fraisProfessionnels: 2300,
      pilier3aMax: 7056
    }
  },
  'BS': {
    nom: 'Bâle-Ville',
    tauxBase: 12.5,
    baremesCelibataires: [
      { de: 0, a: 30000, taux: 6 },
      { de: 30000, a: 55000, taux: 8 },
      { de: 55000, a: 80000, taux: 10 },
      { de: 80000, a: 110000, taux: 12 },
      { de: 110000, a: 150000, taux: 14 },
      { de: 150000, a: 200000, taux: 15.5 },
      { de: 200000, a: Infinity, taux: 16.5 }
    ],
    baremesMaries: [
      { de: 0, a: 40000, taux: 5 },
      { de: 40000, a: 70000, taux: 7 },
      { de: 70000, a: 100000, taux: 9 },
      { de: 100000, a: 140000, taux: 11 },
      { de: 140000, a: 190000, taux: 13 },
      { de: 190000, a: 260000, taux: 14.5 },
      { de: 260000, a: Infinity, taux: 15.5 }
    ],
    deductions: {
      celibataire: 9000,
      marie: 18000,
      parEnfant: 7800,
      fraisProfessionnels: 2200,
      pilier3aMax: 7056
    }
  },
  'BL': {
    nom: 'Bâle-Campagne',
    tauxBase: 13,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 7 },
      { de: 25000, a: 50000, taux: 9 },
      { de: 50000, a: 75000, taux: 11 },
      { de: 75000, a: 100000, taux: 13 },
      { de: 100000, a: 150000, taux: 15 },
      { de: 150000, a: 200000, taux: 16.5 },
      { de: 200000, a: Infinity, taux: 17.5 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 6 },
      { de: 35000, a: 60000, taux: 8 },
      { de: 60000, a: 85000, taux: 10 },
      { de: 85000, a: 120000, taux: 12 },
      { de: 120000, a: 170000, taux: 14 },
      { de: 170000, a: 240000, taux: 15.5 },
      { de: 240000, a: Infinity, taux: 16.5 }
    ],
    deductions: {
      celibataire: 8800,
      marie: 17600,
      parEnfant: 7600,
      fraisProfessionnels: 2100,
      pilier3aMax: 7056
    }
  },
  'AG': {
    nom: 'Argovie',
    tauxBase: 11.5,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 6 },
      { de: 25000, a: 50000, taux: 8 },
      { de: 50000, a: 75000, taux: 10 },
      { de: 75000, a: 100000, taux: 12 },
      { de: 100000, a: 150000, taux: 14 },
      { de: 150000, a: 200000, taux: 15 },
      { de: 200000, a: Infinity, taux: 16 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 5 },
      { de: 35000, a: 60000, taux: 7 },
      { de: 60000, a: 85000, taux: 9 },
      { de: 85000, a: 120000, taux: 11 },
      { de: 120000, a: 170000, taux: 13 },
      { de: 170000, a: 240000, taux: 14 },
      { de: 240000, a: Infinity, taux: 15 }
    ],
    deductions: {
      celibataire: 8500,
      marie: 17000,
      parEnfant: 7500,
      fraisProfessionnels: 2000,
      pilier3aMax: 7056
    }
  },
  'SO': {
    nom: 'Soleure',
    tauxBase: 12.5,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 7 },
      { de: 20000, a: 45000, taux: 9 },
      { de: 45000, a: 70000, taux: 11 },
      { de: 70000, a: 100000, taux: 13 },
      { de: 100000, a: 140000, taux: 14.5 },
      { de: 140000, a: 190000, taux: 15.5 },
      { de: 190000, a: Infinity, taux: 16.5 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 5.5 },
      { de: 30000, a: 55000, taux: 7.5 },
      { de: 55000, a: 85000, taux: 9.5 },
      { de: 85000, a: 120000, taux: 11.5 },
      { de: 120000, a: 165000, taux: 13 },
      { de: 165000, a: 230000, taux: 14 },
      { de: 230000, a: Infinity, taux: 15 }
    ],
    deductions: {
      celibataire: 8600,
      marie: 17200,
      parEnfant: 7600,
      fraisProfessionnels: 2100,
      pilier3aMax: 7056
    }
  },
  'LU': {
    nom: 'Lucerne',
    tauxBase: 11,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 5.5 },
      { de: 25000, a: 50000, taux: 7.5 },
      { de: 50000, a: 75000, taux: 9.5 },
      { de: 75000, a: 100000, taux: 11 },
      { de: 100000, a: 150000, taux: 13 },
      { de: 150000, a: 200000, taux: 14 },
      { de: 200000, a: Infinity, taux: 15 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 4.5 },
      { de: 35000, a: 60000, taux: 6.5 },
      { de: 60000, a: 85000, taux: 8.5 },
      { de: 85000, a: 120000, taux: 10 },
      { de: 120000, a: 170000, taux: 12 },
      { de: 170000, a: 240000, taux: 13 },
      { de: 240000, a: Infinity, taux: 14 }
    ],
    deductions: {
      celibataire: 8200,
      marie: 16400,
      parEnfant: 7200,
      fraisProfessionnels: 1900,
      pilier3aMax: 7056
    }
  },
  'ZG': {
    nom: 'Zoug',
    tauxBase: 8.5,
    baremesCelibataires: [
      { de: 0, a: 30000, taux: 3.5 },
      { de: 30000, a: 60000, taux: 5 },
      { de: 60000, a: 90000, taux: 6.5 },
      { de: 90000, a: 120000, taux: 8 },
      { de: 120000, a: 160000, taux: 9.5 },
      { de: 160000, a: 210000, taux: 10.5 },
      { de: 210000, a: Infinity, taux: 11.5 }
    ],
    baremesMaries: [
      { de: 0, a: 40000, taux: 3 },
      { de: 40000, a: 75000, taux: 4.5 },
      { de: 75000, a: 110000, taux: 6 },
      { de: 110000, a: 150000, taux: 7.5 },
      { de: 150000, a: 200000, taux: 9 },
      { de: 200000, a: 270000, taux: 10 },
      { de: 270000, a: Infinity, taux: 11 }
    ],
    deductions: {
      celibataire: 7800,
      marie: 15600,
      parEnfant: 6800,
      fraisProfessionnels: 1800,
      pilier3aMax: 7056
    }
  },
  'SZ': {
    nom: 'Schwyz',
    tauxBase: 9.5,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 4.5 },
      { de: 25000, a: 50000, taux: 6 },
      { de: 50000, a: 75000, taux: 7.5 },
      { de: 75000, a: 100000, taux: 9 },
      { de: 100000, a: 150000, taux: 10.5 },
      { de: 150000, a: 200000, taux: 11.5 },
      { de: 200000, a: Infinity, taux: 12.5 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 3.5 },
      { de: 35000, a: 60000, taux: 5 },
      { de: 60000, a: 85000, taux: 6.5 },
      { de: 85000, a: 120000, taux: 8 },
      { de: 120000, a: 170000, taux: 9.5 },
      { de: 170000, a: 240000, taux: 10.5 },
      { de: 240000, a: Infinity, taux: 11.5 }
    ],
    deductions: {
      celibataire: 7900,
      marie: 15800,
      parEnfant: 6900,
      fraisProfessionnels: 1850,
      pilier3aMax: 7056
    }
  },
  'OW': {
    nom: 'Obwald',
    tauxBase: 10,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 5 },
      { de: 20000, a: 40000, taux: 6.5 },
      { de: 40000, a: 60000, taux: 8 },
      { de: 60000, a: 85000, taux: 9.5 },
      { de: 85000, a: 120000, taux: 11 },
      { de: 120000, a: 170000, taux: 12 },
      { de: 170000, a: Infinity, taux: 13 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 4 },
      { de: 30000, a: 50000, taux: 5.5 },
      { de: 50000, a: 75000, taux: 7 },
      { de: 75000, a: 105000, taux: 8.5 },
      { de: 105000, a: 145000, taux: 10 },
      { de: 145000, a: 200000, taux: 11 },
      { de: 200000, a: Infinity, taux: 12 }
    ],
    deductions: {
      celibataire: 7700,
      marie: 15400,
      parEnfant: 6700,
      fraisProfessionnels: 1750,
      pilier3aMax: 7056
    }
  },
  'NW': {
    nom: 'Nidwald',
    tauxBase: 9,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 4 },
      { de: 25000, a: 50000, taux: 5.5 },
      { de: 50000, a: 75000, taux: 7 },
      { de: 75000, a: 100000, taux: 8.5 },
      { de: 100000, a: 150000, taux: 10 },
      { de: 150000, a: 200000, taux: 11 },
      { de: 200000, a: Infinity, taux: 12 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 3.5 },
      { de: 35000, a: 60000, taux: 5 },
      { de: 60000, a: 85000, taux: 6.5 },
      { de: 85000, a: 120000, taux: 8 },
      { de: 120000, a: 170000, taux: 9.5 },
      { de: 170000, a: 240000, taux: 10.5 },
      { de: 240000, a: Infinity, taux: 11.5 }
    ],
    deductions: {
      celibataire: 7600,
      marie: 15200,
      parEnfant: 6600,
      fraisProfessionnels: 1700,
      pilier3aMax: 7056
    }
  },
  'UR': {
    nom: 'Uri',
    tauxBase: 10.5,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 5.5 },
      { de: 20000, a: 40000, taux: 7 },
      { de: 40000, a: 60000, taux: 8.5 },
      { de: 60000, a: 85000, taux: 10 },
      { de: 85000, a: 120000, taux: 11.5 },
      { de: 120000, a: 170000, taux: 12.5 },
      { de: 170000, a: Infinity, taux: 13.5 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 4.5 },
      { de: 30000, a: 50000, taux: 6 },
      { de: 50000, a: 75000, taux: 7.5 },
      { de: 75000, a: 105000, taux: 9 },
      { de: 105000, a: 145000, taux: 10.5 },
      { de: 145000, a: 200000, taux: 11.5 },
      { de: 200000, a: Infinity, taux: 12.5 }
    ],
    deductions: {
      celibataire: 7800,
      marie: 15600,
      parEnfant: 6800,
      fraisProfessionnels: 1800,
      pilier3aMax: 7056
    }
  },
  'TG': {
    nom: 'Thurgovie',
    tauxBase: 11.5,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 6 },
      { de: 25000, a: 50000, taux: 8 },
      { de: 50000, a: 75000, taux: 10 },
      { de: 75000, a: 100000, taux: 11.5 },
      { de: 100000, a: 150000, taux: 13 },
      { de: 150000, a: 200000, taux: 14 },
      { de: 200000, a: Infinity, taux: 15 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 5 },
      { de: 35000, a: 60000, taux: 7 },
      { de: 60000, a: 85000, taux: 9 },
      { de: 85000, a: 120000, taux: 10.5 },
      { de: 120000, a: 170000, taux: 12 },
      { de: 170000, a: 240000, taux: 13 },
      { de: 240000, a: Infinity, taux: 14 }
    ],
    deductions: {
      celibataire: 8400,
      marie: 16800,
      parEnfant: 7400,
      fraisProfessionnels: 2000,
      pilier3aMax: 7056
    }
  },
  'SH': {
    nom: 'Schaffhouse',
    tauxBase: 11,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 5.5 },
      { de: 20000, a: 45000, taux: 7.5 },
      { de: 45000, a: 70000, taux: 9.5 },
      { de: 70000, a: 100000, taux: 11 },
      { de: 100000, a: 140000, taux: 12.5 },
      { de: 140000, a: 190000, taux: 13.5 },
      { de: 190000, a: Infinity, taux: 14.5 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 4.5 },
      { de: 30000, a: 55000, taux: 6.5 },
      { de: 55000, a: 85000, taux: 8.5 },
      { de: 85000, a: 120000, taux: 10 },
      { de: 120000, a: 165000, taux: 11.5 },
      { de: 165000, a: 230000, taux: 12.5 },
      { de: 230000, a: Infinity, taux: 13.5 }
    ],
    deductions: {
      celibataire: 8300,
      marie: 16600,
      parEnfant: 7300,
      fraisProfessionnels: 1950,
      pilier3aMax: 7056
    }
  },
  'AR': {
    nom: 'Appenzell Rhodes-Extérieures',
    tauxBase: 11.5,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 6 },
      { de: 25000, a: 50000, taux: 8 },
      { de: 50000, a: 75000, taux: 10 },
      { de: 75000, a: 100000, taux: 11.5 },
      { de: 100000, a: 150000, taux: 13 },
      { de: 150000, a: 200000, taux: 14 },
      { de: 200000, a: Infinity, taux: 15 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 5 },
      { de: 35000, a: 60000, taux: 7 },
      { de: 60000, a: 85000, taux: 9 },
      { de: 85000, a: 120000, taux: 10.5 },
      { de: 120000, a: 170000, taux: 12 },
      { de: 170000, a: 240000, taux: 13 },
      { de: 240000, a: Infinity, taux: 14 }
    ],
    deductions: {
      celibataire: 8100,
      marie: 16200,
      parEnfant: 7100,
      fraisProfessionnels: 1900,
      pilier3aMax: 7056
    }
  },
  'AI': {
    nom: 'Appenzell Rhodes-Intérieures',
    tauxBase: 9.5,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 4.5 },
      { de: 25000, a: 50000, taux: 6 },
      { de: 50000, a: 75000, taux: 7.5 },
      { de: 75000, a: 100000, taux: 9 },
      { de: 100000, a: 150000, taux: 10.5 },
      { de: 150000, a: 200000, taux: 11.5 },
      { de: 200000, a: Infinity, taux: 12.5 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 3.5 },
      { de: 35000, a: 60000, taux: 5 },
      { de: 60000, a: 85000, taux: 6.5 },
      { de: 85000, a: 120000, taux: 8 },
      { de: 120000, a: 170000, taux: 9.5 },
      { de: 170000, a: 240000, taux: 10.5 },
      { de: 240000, a: Infinity, taux: 11.5 }
    ],
    deductions: {
      celibataire: 7700,
      marie: 15400,
      parEnfant: 6700,
      fraisProfessionnels: 1750,
      pilier3aMax: 7056
    }
  },
  'SG': {
    nom: 'Saint-Gall',
    tauxBase: 12,
    baremesCelibataires: [
      { de: 0, a: 25000, taux: 6.5 },
      { de: 25000, a: 50000, taux: 8.5 },
      { de: 50000, a: 75000, taux: 10.5 },
      { de: 75000, a: 100000, taux: 12 },
      { de: 100000, a: 150000, taux: 13.5 },
      { de: 150000, a: 200000, taux: 14.5 },
      { de: 200000, a: Infinity, taux: 15.5 }
    ],
    baremesMaries: [
      { de: 0, a: 35000, taux: 5.5 },
      { de: 35000, a: 60000, taux: 7.5 },
      { de: 60000, a: 85000, taux: 9.5 },
      { de: 85000, a: 120000, taux: 11 },
      { de: 120000, a: 170000, taux: 12.5 },
      { de: 170000, a: 240000, taux: 13.5 },
      { de: 240000, a: Infinity, taux: 14.5 }
    ],
    deductions: {
      celibataire: 8500,
      marie: 17000,
      parEnfant: 7500,
      fraisProfessionnels: 2050,
      pilier3aMax: 7056
    }
  },
  'GR': {
    nom: 'Grisons',
    tauxBase: 11.5,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 6 },
      { de: 20000, a: 40000, taux: 8 },
      { de: 40000, a: 60000, taux: 10 },
      { de: 60000, a: 85000, taux: 11.5 },
      { de: 85000, a: 120000, taux: 13 },
      { de: 120000, a: 170000, taux: 14 },
      { de: 170000, a: Infinity, taux: 15 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 5 },
      { de: 30000, a: 50000, taux: 7 },
      { de: 50000, a: 75000, taux: 9 },
      { de: 75000, a: 105000, taux: 10.5 },
      { de: 105000, a: 145000, taux: 12 },
      { de: 145000, a: 200000, taux: 13 },
      { de: 200000, a: Infinity, taux: 14 }
    ],
    deductions: {
      celibataire: 8200,
      marie: 16400,
      parEnfant: 7200,
      fraisProfessionnels: 1950,
      pilier3aMax: 7056
    }
  },
  'TI': {
    nom: 'Tessin',
    tauxBase: 12.5,
    baremesCelibataires: [
      { de: 0, a: 20000, taux: 7 },
      { de: 20000, a: 40000, taux: 9 },
      { de: 40000, a: 60000, taux: 11 },
      { de: 60000, a: 85000, taux: 12.5 },
      { de: 85000, a: 120000, taux: 14 },
      { de: 120000, a: 170000, taux: 15 },
      { de: 170000, a: Infinity, taux: 16 }
    ],
    baremesMaries: [
      { de: 0, a: 30000, taux: 5.5 },
      { de: 30000, a: 50000, taux: 7.5 },
      { de: 50000, a: 75000, taux: 9.5 },
      { de: 75000, a: 105000, taux: 11 },
      { de: 105000, a: 145000, taux: 12.5 },
      { de: 145000, a: 200000, taux: 13.5 },
      { de: 200000, a: Infinity, taux: 14.5 }
    ],
    deductions: {
      celibataire: 8700,
      marie: 17400,
      parEnfant: 7700,
      fraisProfessionnels: 2150,
      pilier3aMax: 7056
    }
  }
};

export const federalTaxRates = {
  celibataire: [
    { de: 0, a: 17800, taux: 0 },
    { de: 17800, a: 31600, taux: 0.77 },
    { de: 31600, a: 41400, taux: 0.88 },
    { de: 41400, a: 55200, taux: 2.64 },
    { de: 55200, a: 72500, taux: 2.97 },
    { de: 72500, a: 78100, taux: 5.94 },
    { de: 78100, a: 103600, taux: 6.60 },
    { de: 103600, a: 134600, taux: 8.80 },
    { de: 134600, a: 176000, taux: 11.00 },
    { de: 176000, a: 755200, taux: 13.20 },
    { de: 755200, a: Infinity, taux: 11.50 }
  ],
  marie: [
    { de: 0, a: 30800, taux: 0 },
    { de: 30800, a: 51400, taux: 1.00 },
    { de: 51400, a: 59400, taux: 2.00 },
    { de: 59400, a: 75300, taux: 3.00 },
    { de: 75300, a: 90300, taux: 4.00 },
    { de: 90300, a: 103400, taux: 5.00 },
    { de: 103400, a: 114700, taux: 6.00 },
    { de: 114700, a: 124200, taux: 7.00 },
    { de: 124200, a: 131700, taux: 8.00 },
    { de: 131700, a: 137300, taux: 9.00 },
    { de: 137300, a: 141200, taux: 10.00 },
    { de: 141200, a: 143100, taux: 11.00 },
    { de: 143100, a: 145000, taux: 12.00 },
    { de: 145000, a: 895800, taux: 13.00 },
    { de: 895800, a: Infinity, taux: 11.50 }
  ]
};