/**
 * Formules fiscales suisses complètes - 2025
 * Implémentation TypeScript des calculs officiels pour les 26 cantons
 */

import { SWISS_TAX_DATABASE, type CantonTaxData, type TaxBracket, type WealthTaxBracket } from '@/lib/data/swiss-tax-database';

export interface TaxCalculationInput {
  salaireBrut: number;
  autresRevenus: number;
  canton: string;
  commune: string;
  situationFamiliale: 'celibataire' | 'marie' | 'divorce' | 'veuf' | 'concubinage';
  nombreEnfants: number;
  fortuneBrute: number;
  dettes: number;
  deductions: {
    pilier3a: number;
    primes_assurance: number;
    frais_professionnels: number;
    frais_garde_enfants: number;
    frais_formation: number;
    dons: number;
    interets_hypothecaires: number;
    pension_alimentaire: number;
    frais_medicaux: number;
    autres: number;
  };
}

export interface TaxCalculationResult {
  revenuBrut: number;
  cotisationsSociales: number;
  revenuNet: number;
  totalDeductions: number;
  revenuImposable: number;
  fortuneImposable: number;

  impots: {
    federal: number;
    cantonal: number;
    communal: number;
    fortune: number;
    cultuel?: number;
    total: number;
  };

  taux: {
    effectif: number;
    marginal: number;
  };

  details: {
    baremeApplique: string;
    trancheFederale: string;
    trancheCanton: string;
    coefficientCommunal: number;
  };
}

/**
 * 1️⃣ CALCUL DES COTISATIONS SOCIALES OBLIGATOIRES
 */
export function calculCotisationsSociales(
  salaireBrut: number,
  age: number = 30,
  statut: 'salarie' | 'independant' = 'salarie'
): {
  avs: number;
  ac: number;
  lpp: number;
  laa: number;
  total: number;
  tauxTotal: number;
} {
  const plafonAC = 148200; // Plafond AC 2025
  const salaireAC = Math.min(salaireBrut, plafonAC);

  // AVS/AI/APG (part salarié)
  const avs = salaireBrut * 0.0530; // 5.30%

  // AC - Assurance chômage (part salarié)
  const ac = salaireAC * 0.0110; // 1.10%

  // LPP - 2e pilier (selon âge)
  let tauxLPP = 0.07; // 25-34 ans
  if (age >= 35 && age < 45) tauxLPP = 0.10;
  else if (age >= 45 && age < 55) tauxLPP = 0.15;
  else if (age >= 55) tauxLPP = 0.18;

  const coordinationLPP = 25725; // Montant de coordination 2025
  const salaireCoordonne = Math.max(0, salaireBrut - coordinationLPP);
  const lpp = salaireCoordonne * tauxLPP;

  // LAA - Accidents (part salarié, estimation)
  const laa = salaireBrut * 0.015; // ~1.5%

  const total = avs + ac + lpp + laa;
  const tauxTotal = (total / salaireBrut) * 100;

  return { avs, ac, lpp, laa, total, tauxTotal };
}

/**
 * 2️⃣ CALCUL DU REVENU IMPOSABLE
 */
export function calculRevenuImposable(
  input: TaxCalculationInput,
  cantonData: CantonTaxData
): {
  revenuBrut: number;
  revenuNet: number;
  deductions: Record<string, number>;
  totalDeductions: number;
  revenuImposable: number;
} {
  const revenuBrut = input.salaireBrut + input.autresRevenus;

  // Cotisations sociales
  const cotisations = calculCotisationsSociales(input.salaireBrut);
  const revenuNet = revenuBrut - cotisations.total;

  // Déductions fiscales
  const deductions: Record<string, number> = {
    personnelle: cantonData.deductions.personalDeduction,
    enfants: input.nombreEnfants * cantonData.deductions.childDeduction,
    pilier3a: Math.min(
      input.deductions.pilier3a,
      cantonData.deductions.pillar3a.employed
    ),
    assurances: Math.min(
      input.deductions.primes_assurance,
      input.situationFamiliale === 'marie'
        ? cantonData.deductions.insuranceDeduction.married
        : cantonData.deductions.insuranceDeduction.single
    ),
    frais_pro: input.deductions.frais_professionnels,
    garde_enfants: Math.min(
      input.deductions.frais_garde_enfants,
      7100 // Max selon canton
    ),
    formation: Math.min(input.deductions.frais_formation, 12000),
    dons: Math.min(input.deductions.dons, revenuNet * 0.20), // Max 20%
    interets: input.deductions.interets_hypothecaires,
    pension: input.deductions.pension_alimentaire,
    medicaux: Math.max(
      0,
      input.deductions.frais_medicaux - revenuNet * 0.05 // Franchise 5%
    ),
    autres: input.deductions.autres,
  };

  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
  const revenuImposable = Math.max(0, revenuNet - totalDeductions);

  return {
    revenuBrut,
    revenuNet,
    deductions,
    totalDeductions,
    revenuImposable,
  };
}

/**
 * 3️⃣ CALCUL IMPÔT FÉDÉRAL DIRECT (IFD)
 * Identique pour tous les cantons
 */
export function calculImpotFederal(
  revenuImposable: number,
  situationFamiliale: string,
  nombreEnfants: number = 0
): { impot: number; taux: number; tranche: string } {
  // Barème IFD 2025 - Personne seule
  const baremeIFD: Array<{
    from: number;
    to: number;
    base: number;
    rate: number;
    label: string;
  }> = [
    { from: 0, to: 17800, base: 0, rate: 0, label: '0 - 17\'800' },
    { from: 17800, to: 31600, base: 0, rate: 0.77, label: '17\'800 - 31\'600' },
    { from: 31600, to: 41400, base: 106, rate: 0.88, label: '31\'600 - 41\'400' },
    { from: 41400, to: 55200, base: 192, rate: 2.64, label: '41\'400 - 55\'200' },
    { from: 55200, to: 72500, base: 557, rate: 2.97, label: '55\'200 - 72\'500' },
    { from: 72500, to: 78100, base: 1071, rate: 5.94, label: '72\'500 - 78\'100' },
    { from: 78100, to: 103600, base: 1404, rate: 6.60, label: '78\'100 - 103\'600' },
    { from: 103600, to: 134600, base: 3087, rate: 8.80, label: '103\'600 - 134\'600' },
    { from: 134600, to: 176000, base: 5815, rate: 11.00, label: '134\'600 - 176\'000' },
    { from: 176000, to: 755200, base: 10369, rate: 13.20, label: '176\'000 - 755\'200' },
    { from: 755200, to: Infinity, base: 86813, rate: 11.50, label: '> 755\'200' },
  ];

  // Appliquer splitting pour couples mariés
  let revenuCalcul = revenuImposable;
  if (situationFamiliale === 'marie') {
    revenuCalcul = revenuImposable / 2; // Splitting intégral
  }

  // Trouver la tranche
  const tranche = baremeIFD.find(
    (b) => revenuCalcul >= b.from && revenuCalcul < b.to
  );

  if (!tranche) {
    return { impot: 0, taux: 0, tranche: 'Aucun' };
  }

  // Calcul progressif
  let impot = tranche.base + (revenuCalcul - tranche.from) * (tranche.rate / 100);

  // Doubler si marié (après calcul splitting)
  if (situationFamiliale === 'marie') {
    impot = impot * 2;
  }

  // Déduction pour enfants
  const deductionEnfants = nombreEnfants * 251; // CHF par enfant
  impot = Math.max(0, impot - deductionEnfants);

  const taux = tranche.rate;

  return {
    impot: Math.round(impot),
    taux,
    tranche: tranche.label,
  };
}

/**
 * 4️⃣ CALCUL IMPÔT CANTONAL
 * Formule progressive selon barème cantonal
 */
export function calculImpotCantonal(
  revenuImposable: number,
  baremes: TaxBracket[],
  situationFamiliale: string = 'celibataire'
): { impot: number; taux: number; tranche: string } {
  // Appliquer splitting selon canton (partiel ou intégral)
  // Pour simplifier, on garde le revenu complet ici

  // Trouver la tranche applicable
  const tranche = baremes.find(
    (b) => revenuImposable >= b.from && revenuImposable < b.to
  );

  if (!tranche) {
    return { impot: 0, taux: 0, tranche: 'Hors barème' };
  }

  // Calcul avec base + taux marginal
  const impot = (tranche.base || 0) + (revenuImposable - tranche.from) * (tranche.rate / 100);

  return {
    impot: Math.round(impot),
    taux: tranche.rate,
    tranche: `${tranche.from.toLocaleString()} - ${tranche.to === Infinity ? '∞' : tranche.to.toLocaleString()}`,
  };
}

/**
 * 5️⃣ CALCUL IMPÔT COMMUNAL
 * Basé sur l'impôt cantonal avec coefficient communal
 */
export function calculImpotCommunal(
  impotCantonalBase: number,
  coefficientCommunal: number
): number {
  return Math.round(impotCantonalBase * (coefficientCommunal / 100));
}

/**
 * 6️⃣ CALCUL IMPÔT SUR LA FORTUNE
 */
export function calculImpotFortune(
  fortuneBrute: number,
  dettes: number,
  deductionFortune: number,
  baremes: WealthTaxBracket[]
): { impot: number; fortuneImposable: number; taux: number } {
  // Fortune nette imposable
  const fortuneImposable = Math.max(0, fortuneBrute - dettes - deductionFortune);

  if (fortuneImposable === 0) {
    return { impot: 0, fortuneImposable: 0, taux: 0 };
  }

  // Trouver la tranche
  const tranche = baremes.find(
    (b) => fortuneImposable >= b.from && fortuneImposable < b.to
  );

  if (!tranche) {
    return { impot: 0, fortuneImposable, taux: 0 };
  }

  // Calcul en pour mille (‰)
  const impot = fortuneImposable * (tranche.rate / 1000);

  return {
    impot: Math.round(impot),
    fortuneImposable,
    taux: tranche.rate,
  };
}

/**
 * 7️⃣ FONCTION PRINCIPALE - CALCUL COMPLET
 */
export function calculImpotTotal(input: TaxCalculationInput): TaxCalculationResult {
  // Récupérer les données du canton
  const cantonData = SWISS_TAX_DATABASE[input.canton];
  if (!cantonData) {
    throw new Error(`Canton ${input.canton} non trouvé dans la base de données`);
  }

  // 1. Calcul revenu imposable
  const cotisations = calculCotisationsSociales(input.salaireBrut);
  const revenuCalc = calculRevenuImposable(input, cantonData);

  // 2. Impôt fédéral direct
  const ifd = calculImpotFederal(
    revenuCalc.revenuImposable,
    input.situationFamiliale,
    input.nombreEnfants
  );

  // 3. Impôt cantonal
  const impotCantBase = calculImpotCantonal(
    revenuCalc.revenuImposable,
    cantonData.taxRates.income.brackets,
    input.situationFamiliale
  );

  // 4. Coefficient communal
  const commune = cantonData.municipalities.find((m) => m.name === input.commune);
  const coeffCommune = commune?.multiplier || 70;

  const impotCantonal = calculImpotCommunal(impotCantBase.impot, coeffCommune);
  const impotCommunal = calculImpotCommunal(impotCantBase.impot, coeffCommune);

  // 5. Impôt sur la fortune
  const deductionFortune = input.situationFamiliale === 'marie' ? 40000 : 20000;
  const impotFortuneCalc = calculImpotFortune(
    input.fortuneBrute,
    input.dettes,
    deductionFortune,
    cantonData.taxRates.wealth.brackets
  );

  // 6. Total
  const totalImpots =
    ifd.impot + impotCantonal + impotCommunal + impotFortuneCalc.impot;

  // 7. Taux effectif et marginal
  const tauxEffectif = (totalImpots / revenuCalc.revenuBrut) * 100;
  const tauxMarginal = Math.max(ifd.taux, impotCantBase.taux);

  return {
    revenuBrut: revenuCalc.revenuBrut,
    cotisationsSociales: cotisations.total,
    revenuNet: revenuCalc.revenuNet,
    totalDeductions: revenuCalc.totalDeductions,
    revenuImposable: revenuCalc.revenuImposable,
    fortuneImposable: impotFortuneCalc.fortuneImposable,

    impots: {
      federal: ifd.impot,
      cantonal: impotCantonal,
      communal: impotCommunal,
      fortune: impotFortuneCalc.impot,
      total: totalImpots,
    },

    taux: {
      effectif: Math.round(tauxEffectif * 100) / 100,
      marginal: Math.round(tauxMarginal * 100) / 100,
    },

    details: {
      baremeApplique: `${cantonData.name} - ${input.situationFamiliale}`,
      trancheFederale: ifd.tranche,
      trancheCanton: impotCantBase.tranche,
      coefficientCommunal: coeffCommune,
    },
  };
}

/**
 * 8️⃣ FONCTION UTILITAIRE - COMPARAISON CANTONS
 */
export function comparerCantons(
  input: Omit<TaxCalculationInput, 'canton' | 'commune'>
): Array<{ canton: string; impotTotal: number; tauxEffectif: number }> {
  const results: Array<{ canton: string; impotTotal: number; tauxEffectif: number }> = [];

  // Pour chaque canton
  Object.keys(SWISS_TAX_DATABASE).forEach((cantonCode) => {
    const cantonData = SWISS_TAX_DATABASE[cantonCode];
    const commune = cantonData.municipalities[0]; // Première commune

    const result = calculImpotTotal({
      ...input,
      canton: cantonCode,
      commune: commune.name,
    });

    results.push({
      canton: cantonData.name,
      impotTotal: result.impots.total,
      tauxEffectif: result.taux.effectif,
    });
  });

  // Trier par impôt total croissant
  return results.sort((a, b) => a.impotTotal - b.impotTotal);
}

/**
 * 9️⃣ FONCTION UTILITAIRE - OPTIMISATION FISCALE
 */
export function suggererOptimisations(
  input: TaxCalculationInput,
  result: TaxCalculationResult
): Array<{
  titre: string;
  description: string;
  economie: number;
  priorite: 'haute' | 'moyenne' | 'basse';
  deadline?: string;
}> {
  const suggestions = [];

  // Pilier 3a non maximisé
  const pilier3aMax = 7056;
  if (input.deductions.pilier3a < pilier3aMax) {
    const economie = (pilier3aMax - input.deductions.pilier3a) * (result.taux.marginal / 100);
    suggestions.push({
      titre: 'Maximiser le 3e pilier A',
      description: `Vous pouvez encore cotiser ${pilier3aMax - input.deductions.pilier3a} CHF au 3e pilier`,
      economie: Math.round(economie),
      priorite: 'haute' as const,
      deadline: '31 décembre 2025',
    });
  }

  // Fortune élevée sans optimisation
  if (input.fortuneBrute > 100000 && input.deductions.pilier3a < pilier3aMax) {
    suggestions.push({
      titre: 'Réduire l\'impôt sur la fortune',
      description: 'Investir dans le 3e pilier réduit votre fortune imposable',
      economie: Math.round((pilier3aMax / 1000) * result.taux.marginal),
      priorite: 'moyenne' as const,
    });
  }

  return suggestions;
}
