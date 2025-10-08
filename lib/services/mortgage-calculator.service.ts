/**
 * Service de calcul hypothécaire suisse - Règles FINMA 2025
 * Calcule la faisabilité d'un achat immobilier selon les normes bancaires suisses
 */

export interface MortgageInput {
  // Informations sur le bien
  prixBien: number;

  // Revenus du ménage
  revenuBrutAnnuel: number;
  revenuConjoint?: number;

  // Fonds propres disponibles
  fondsPropresCash: number;
  lpp2ePilier?: number;
  pilier3a?: number;
  valeurRachat3a?: number;
  donationHeritage?: number;

  // Autres informations
  age: number;
  ageConjoint?: number;
  nombreEnfants?: number;
  chargesExistantes?: number;
}

export interface MortgageResult {
  faisable: boolean;

  // Fonds propres
  fondsPropresTotaux: number;
  fondsPropresMini: number; // 20% du prix
  fondsPropresCash: number; // Min 10% en cash
  utilisationLPP: number;
  utilisationPilier3a: number;

  // Hypothèque
  montantHypotheque: number;
  hypotheque1erRang: number; // Max 65%
  hypotheque2emeRang: number; // Max 15%

  // Charges
  chargesAnnuelles: number;
  interetsHypotheque: number;
  amortissement2emeRang: number;
  entretenReparations: number;
  chargesAccessoires: number;

  // Capacité financière
  revenuMenageTotal: number;
  tauxEndettement: number; // Max 33%
  capaciteMaximale: boolean;

  // Détails calcul
  tauxInteretCalcul: number; // Taux théorique 5%
  dureeAmortissement: number; // 15 ans pour 2ème rang

  // Manque éventuel
  manqueFondsPropresCash?: number;
  manqueFondsPropresTotaux?: number;
  manqueCapacite?: number;
}

export interface AffordabilityResult {
  budgetMaximal: number;
  fondsPropresMini: number;
  chargesAnnuellesMax: number;
  exemplesBiens: Array<{
    prix: number;
    hypotheque: number;
    chargesMensuelles: number;
  }>;
}

export interface SavingsPlanResult {
  montantManquant: number;
  moisNecessaires: {
    sansInvestissement: number;
    avecInvestissement3: number; // 3% rendement
    avecInvestissement5: number; // 5% rendement
    avecInvestissement7: number; // 7% rendement
  };
  epargneMensuelle: number;
  projections: Array<{
    mois: number;
    sansInvest: number;
    avec3pct: number;
    avec5pct: number;
    avec7pct: number;
  }>;
}

export class MortgageCalculatorService {
  // Constantes réglementaires suisses (FINMA)
  private static readonly FONDS_PROPRES_MIN = 0.20; // 20% minimum
  private static readonly FONDS_PROPRES_CASH_MIN = 0.10; // 10% en cash minimum
  private static readonly LTV_MAX_1ER_RANG = 0.65; // 65% max pour 1er rang
  private static readonly LTV_MAX_2EME_RANG = 0.15; // 15% max pour 2ème rang
  private static readonly TAUX_INTERET_THEORIQUE = 0.05; // 5% pour le calcul
  private static readonly TAUX_ENDETTEMENT_MAX = 0.33; // 33% max
  private static readonly TAUX_ENTRETIEN = 0.01; // 1% du prix pour entretien
  private static readonly CHARGES_ACCESSOIRES = 0.002; // 0.2% charges
  private static readonly DUREE_AMORTISSEMENT_2EME_RANG = 15; // 15 ans
  private static readonly AGE_MAX_LPP = 50; // Max 50 ans pour retrait LPP

  /**
   * Calcule la faisabilité d'un achat immobilier
   */
  static calculateMortgage(input: MortgageInput): MortgageResult {
    // 1. Calcul des fonds propres disponibles
    const fondsPropresCash = input.fondsPropresCash;

    // LPP: utilisable seulement jusqu'à 50 ans
    let utilisationLPP = 0;
    if (input.age <= this.AGE_MAX_LPP && input.lpp2ePilier) {
      utilisationLPP = input.lpp2ePilier;
    }

    // Pilier 3a: utilisable intégralement
    const utilisationPilier3a = (input.pilier3a || 0) + (input.valeurRachat3a || 0);

    // Donation/héritage
    const donationHeritage = input.donationHeritage || 0;

    const fondsPropresTotaux = fondsPropresCash + utilisationLPP + utilisationPilier3a + donationHeritage;

    // 2. Calcul fonds propres minimum requis
    const fondsPropresMini = input.prixBien * this.FONDS_PROPRES_MIN;
    const fondsPropresCashMini = input.prixBien * this.FONDS_PROPRES_CASH_MIN;

    // 3. Calcul hypothèque
    const montantHypotheque = input.prixBien - fondsPropresTotaux;
    const hypotheque1erRang = Math.min(
      input.prixBien * this.LTV_MAX_1ER_RANG,
      montantHypotheque
    );
    const hypotheque2emeRang = Math.max(0, montantHypotheque - hypotheque1erRang);

    // 4. Calcul des charges annuelles
    const interetsHypotheque = montantHypotheque * this.TAUX_INTERET_THEORIQUE;
    const amortissement2emeRang = hypotheque2emeRang / this.DUREE_AMORTISSEMENT_2EME_RANG;
    const entretenReparations = input.prixBien * this.TAUX_ENTRETIEN;
    const chargesAccessoires = input.prixBien * this.CHARGES_ACCESSOIRES;

    const chargesAnnuelles =
      interetsHypotheque +
      amortissement2emeRang +
      entretenReparations +
      chargesAccessoires +
      (input.chargesExistantes || 0);

    // 5. Calcul du revenu total du ménage
    const revenuMenageTotal = input.revenuBrutAnnuel + (input.revenuConjoint || 0);

    // 6. Calcul du taux d'endettement
    const tauxEndettement = chargesAnnuelles / revenuMenageTotal;

    // 7. Vérification de la faisabilité
    const faisableFondsPropresTotaux = fondsPropresTotaux >= fondsPropresMini;
    const faisableFondsPropresCash = fondsPropresCash >= fondsPropresCashMini;
    const faisableEndettement = tauxEndettement <= this.TAUX_ENDETTEMENT_MAX;

    const faisable = faisableFondsPropresTotaux && faisableFondsPropresCash && faisableEndettement;

    // 8. Calcul des manques éventuels
    const result: MortgageResult = {
      faisable,
      fondsPropresTotaux,
      fondsPropresMini,
      fondsPropresCash,
      utilisationLPP,
      utilisationPilier3a,
      montantHypotheque,
      hypotheque1erRang,
      hypotheque2emeRang,
      chargesAnnuelles,
      interetsHypotheque,
      amortissement2emeRang,
      entretenReparations,
      chargesAccessoires,
      revenuMenageTotal,
      tauxEndettement,
      capaciteMaximale: faisableEndettement,
      tauxInteretCalcul: this.TAUX_INTERET_THEORIQUE,
      dureeAmortissement: this.DUREE_AMORTISSEMENT_2EME_RANG,
    };

    // Ajouter les manques si non faisable
    if (!faisableFondsPropresCash) {
      result.manqueFondsPropresCash = fondsPropresCashMini - fondsPropresCash;
    }
    if (!faisableFondsPropresTotaux) {
      result.manqueFondsPropresTotaux = fondsPropresMini - fondsPropresTotaux;
    }
    if (!faisableEndettement) {
      const chargesMaximales = revenuMenageTotal * this.TAUX_ENDETTEMENT_MAX;
      result.manqueCapacite = chargesAnnuelles - chargesMaximales;
    }

    return result;
  }

  /**
   * Calcule le budget maximal selon les revenus
   */
  static calculateAffordability(input: Omit<MortgageInput, 'prixBien'>): AffordabilityResult {
    const revenuMenageTotal = input.revenuBrutAnnuel + (input.revenuConjoint || 0);
    const fondsPropresTotaux =
      input.fondsPropresCash +
      (input.lpp2ePilier || 0) +
      (input.pilier3a || 0) +
      (input.valeurRachat3a || 0) +
      (input.donationHeritage || 0);

    // Calcul du budget maximal selon la capacité de charge (33%)
    const chargesAnnuellesMax = revenuMenageTotal * this.TAUX_ENDETTEMENT_MAX - (input.chargesExistantes || 0);

    // Résoudre: charges = intérêts + amortissement + entretien + accessoires
    // charges = (P - FP) × 5% + (P - FP - 65%P) / 15 + P × 1% + P × 0.2%
    // charges = (P - FP) × 5% + (35%P - FP) / 15 + P × 1.2%

    // Simplification par itération
    let budgetMaximal = 0;
    for (let prix = 100000; prix <= 5000000; prix += 10000) {
      const hypotheque = prix - fondsPropresTotaux;
      const hypotheque2emeRang = Math.max(0, hypotheque - prix * this.LTV_MAX_1ER_RANG);

      const charges =
        hypotheque * this.TAUX_INTERET_THEORIQUE +
        hypotheque2emeRang / this.DUREE_AMORTISSEMENT_2EME_RANG +
        prix * (this.TAUX_ENTRETIEN + this.CHARGES_ACCESSOIRES);

      if (charges <= chargesAnnuellesMax && fondsPropresTotaux >= prix * this.FONDS_PROPRES_MIN) {
        budgetMaximal = prix;
      } else {
        break;
      }
    }

    const fondsPropresMini = budgetMaximal * this.FONDS_PROPRES_MIN;

    // Exemples de biens
    const exemplesBiens = [0.7, 0.85, 1.0].map(ratio => {
      const prix = Math.round(budgetMaximal * ratio / 10000) * 10000;
      const hypotheque = prix - fondsPropresTotaux;
      const hypotheque2emeRang = Math.max(0, hypotheque - prix * this.LTV_MAX_1ER_RANG);

      const chargesMensuelles = (
        hypotheque * this.TAUX_INTERET_THEORIQUE +
        hypotheque2emeRang / this.DUREE_AMORTISSEMENT_2EME_RANG +
        prix * (this.TAUX_ENTRETIEN + this.CHARGES_ACCESSOIRES)
      ) / 12;

      return { prix, hypotheque, chargesMensuelles };
    });

    return {
      budgetMaximal,
      fondsPropresMini,
      chargesAnnuellesMax,
      exemplesBiens,
    };
  }

  /**
   * Calcule un plan d'épargne pour atteindre les fonds propres nécessaires
   */
  static calculateSavingsPlan(
    montantManquant: number,
    epargneMensuelle: number
  ): SavingsPlanResult {
    // Calcul sans investissement
    const moisSansInvestissement = Math.ceil(montantManquant / epargneMensuelle);

    // Calcul avec investissement (formule de la valeur future d'une annuité)
    const calculateMonthsWithReturn = (tauxAnnuel: number): number => {
      const tauxMensuel = tauxAnnuel / 12;
      if (tauxMensuel === 0) return moisSansInvestissement;

      // FV = PMT × ((1 + r)^n - 1) / r
      // Résoudre pour n: n = ln(1 + (FV × r / PMT)) / ln(1 + r)
      const mois = Math.log(1 + (montantManquant * tauxMensuel / epargneMensuelle)) / Math.log(1 + tauxMensuel);
      return Math.ceil(mois);
    };

    const moisAvec3pct = calculateMonthsWithReturn(0.03);
    const moisAvec5pct = calculateMonthsWithReturn(0.05);
    const moisAvec7pct = calculateMonthsWithReturn(0.07);

    // Projections mois par mois (jusqu'à atteinte de l'objectif)
    const maxMois = Math.max(moisSansInvestissement, moisAvec3pct, moisAvec5pct, moisAvec7pct);
    const projections: Array<{
      mois: number;
      sansInvest: number;
      avec3pct: number;
      avec5pct: number;
      avec7pct: number;
    }> = [];

    for (let mois = 0; mois <= Math.min(maxMois, 240); mois += 6) { // Tous les 6 mois
      const sansInvest = epargneMensuelle * mois;

      const avec3pct = this.calculateFutureValue(epargneMensuelle, 0.03 / 12, mois);
      const avec5pct = this.calculateFutureValue(epargneMensuelle, 0.05 / 12, mois);
      const avec7pct = this.calculateFutureValue(epargneMensuelle, 0.07 / 12, mois);

      projections.push({ mois, sansInvest, avec3pct, avec5pct, avec7pct });
    }

    return {
      montantManquant,
      moisNecessaires: {
        sansInvestissement: moisSansInvestissement,
        avecInvestissement3: moisAvec3pct,
        avecInvestissement5: moisAvec5pct,
        avecInvestissement7: moisAvec7pct,
      },
      epargneMensuelle,
      projections,
    };
  }

  /**
   * Calcule la valeur future d'une annuité
   */
  private static calculateFutureValue(pmt: number, tauxMensuel: number, mois: number): number {
    if (tauxMensuel === 0) return pmt * mois;
    return pmt * ((Math.pow(1 + tauxMensuel, mois) - 1) / tauxMensuel);
  }

  /**
   * Calcule le "loyer théorique" (charges hypothécaires mensuelles)
   */
  static calculateTheoreticalRent(prixBien: number, fondsPropresTotaux: number): {
    chargesMensuelles: number;
    details: {
      interets: number;
      amortissement: number;
      entretien: number;
      charges: number;
      total: number;
    };
  } {
    const hypotheque = prixBien - fondsPropresTotaux;
    const hypotheque1erRang = Math.min(prixBien * this.LTV_MAX_1ER_RANG, hypotheque);
    const hypotheque2emeRang = Math.max(0, hypotheque - hypotheque1erRang);

    const interetsAnnuels = hypotheque * this.TAUX_INTERET_THEORIQUE;
    const amortissementAnnuel = hypotheque2emeRang / this.DUREE_AMORTISSEMENT_2EME_RANG;
    const entretienAnnuel = prixBien * this.TAUX_ENTRETIEN;
    const chargesAnnuelles = prixBien * this.CHARGES_ACCESSOIRES;

    const totalAnnuel = interetsAnnuels + amortissementAnnuel + entretienAnnuel + chargesAnnuelles;

    return {
      chargesMensuelles: totalAnnuel / 12,
      details: {
        interets: interetsAnnuels / 12,
        amortissement: amortissementAnnuel / 12,
        entretien: entretienAnnuel / 12,
        charges: chargesAnnuelles / 12,
        total: totalAnnuel / 12,
      },
    };
  }
}
