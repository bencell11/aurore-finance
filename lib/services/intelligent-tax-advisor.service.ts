interface UserTaxProfile {
  canton: string;
  revenu: number;
  situationFamiliale: string;
  nombreEnfants: number;
  troisiemePilier: number;
  liquidites: number;
  profession: string;
  age: number;
}

interface TaxOptimization {
  type: 'troisiemePilier' | 'fraisProfessionnels' | 'deductions' | 'rachatsPrevoyance';
  title: string;
  description: string;
  economieAnnuelle: number;
  actionRequise: string;
  urgence: 'haute' | 'moyenne' | 'basse';
  delai?: string;
}

interface TaxPlan {
  mois: string;
  actions: Array<{
    action: string;
    montant?: number;
    deadline?: string;
    impact: string;
  }>;
}

export class IntelligentTaxAdvisorService {
  
  static analyzeUserTaxSituation(profile: UserTaxProfile): {
    currentTaxLoad: number;
    optimizations: TaxOptimization[];
    yearlyPlan: TaxPlan[];
    warnings: string[];
  } {
    const optimizations: TaxOptimization[] = [];
    const warnings: string[] = [];
    const yearlyPlan: TaxPlan[] = [];

    // Calcul de la charge fiscale actuelle (estimation simple)
    const currentTaxLoad = this.estimateTaxLoad(profile);

    // 1. Analyse du 3e pilier
    const maxTroisiemePilier = 7056; // 2024
    const troisiemePilierActuel = profile.troisiemePilier || 0;
    
    if (troisiemePilierActuel < maxTroisiemePilier) {
      const manquant = maxTroisiemePilier - troisiemePilierActuel;
      const economie = manquant * this.getTauxMarginal(profile.revenu, profile.canton);
      
      optimizations.push({
        type: 'troisiemePilier',
        title: `Optimisation 3e pilier`,
        description: `Vous pourriez verser ${manquant.toLocaleString('fr-CH')} CHF de plus dans votre 3e pilier.`,
        economieAnnuelle: economie,
        actionRequise: `Verser ${manquant.toLocaleString('fr-CH')} CHF avant le 31 décembre`,
        urgence: 'haute',
        delai: 'Avant le 31 décembre'
      });
    }

    // 2. Frais professionnels
    if (profile.profession && profile.revenu > 50000) {
      const fraisEstimes = Math.min(profile.revenu * 0.03, 4000); // Estimation 3% max 4000
      optimizations.push({
        type: 'fraisProfessionnels',
        title: 'Déduction frais professionnels',
        description: `Vous pourriez déduire environ ${fraisEstimes.toLocaleString('fr-CH')} CHF de frais professionnels.`,
        economieAnnuelle: fraisEstimes * this.getTauxMarginal(profile.revenu, profile.canton),
        actionRequise: 'Tenir un journal détaillé des frais professionnels',
        urgence: 'moyenne'
      });
    }

    // 3. Rachats de prévoyance (si âge > 40 et revenus élevés)
    if (profile.age > 40 && profile.revenu > 80000) {
      optimizations.push({
        type: 'rachatsPrevoyance',
        title: 'Rachats 2e pilier',
        description: 'Les rachats de prévoyance peuvent réduire significativement vos impôts.',
        economieAnnuelle: 5000, // Estimation
        actionRequise: 'Demander un extrait de prévoyance à votre caisse de pension',
        urgence: 'moyenne'
      });
    }

    // Plan annuel
    yearlyPlan.push(
      {
        mois: 'Janvier',
        actions: [
          { action: 'Bilan fiscal de l\'année précédente', impact: 'Optimisation future' },
          { action: 'Mise à jour du budget fiscal', impact: 'Planification 2024' }
        ]
      },
      {
        mois: 'Mars',
        actions: [
          { action: 'Déclaration fiscale', impact: 'Obligation légale' },
          { action: 'Vérification des déductions', impact: 'Économies possibles' }
        ]
      },
      {
        mois: 'Novembre',
        actions: [
          { action: 'Versement 3e pilier', montant: maxTroisiemePilier, deadline: '31 décembre', impact: `Économie de ${(maxTroisiemePilier * 0.25).toLocaleString('fr-CH')} CHF` }
        ]
      }
    );

    // Warnings
    if (profile.revenu > 120000 && troisiemePilierActuel === 0) {
      warnings.push('⚠️ Avec votre niveau de revenu, ne pas cotiser au 3e pilier vous fait perdre plusieurs milliers de francs par an !');
    }

    return {
      currentTaxLoad,
      optimizations,
      yearlyPlan,
      warnings
    };
  }

  private static estimateTaxLoad(profile: UserTaxProfile): number {
    // Calcul simplifié - à améliorer avec les vrais barèmes cantonaux
    const tauxMoyen = this.getTauxMoyen(profile.revenu, profile.canton);
    return profile.revenu * tauxMoyen;
  }

  private static getTauxMarginal(revenu: number, canton: string): number {
    // Taux marginal approximatif selon le revenu et canton
    if (revenu < 50000) return 0.20;
    if (revenu < 80000) return 0.25;
    if (revenu < 120000) return 0.30;
    return 0.35;
  }

  private static getTauxMoyen(revenu: number, canton: string): number {
    // Taux moyen approximatif
    if (revenu < 50000) return 0.15;
    if (revenu < 80000) return 0.20;
    if (revenu < 120000) return 0.25;
    return 0.28;
  }

  static generateTaxAdvicePrompt(profile: UserTaxProfile, question: string): string {
    const analysis = this.analyzeUserTaxSituation(profile);
    
    return `
ANALYSE FISCALE AUTOMATIQUE:

📊 SITUATION ACTUELLE:
- Charge fiscale estimée: ${analysis.currentTaxLoad.toLocaleString('fr-CH')} CHF
- Potentiel d'optimisation: ${analysis.optimizations.reduce((sum, opt) => sum + opt.economieAnnuelle, 0).toLocaleString('fr-CH')} CHF

🎯 OPTIMISATIONS IDENTIFIÉES:
${analysis.optimizations.map(opt => `
• ${opt.title}: Économie de ${opt.economieAnnuelle.toLocaleString('fr-CH')} CHF/an
  Action: ${opt.actionRequise}
  ${opt.delai ? `⏰ Deadline: ${opt.delai}` : ''}
`).join('')}

⚠️ ALERTES:
${analysis.warnings.join('\n')}

🗓️ PLAN D'ACTION 2024:
${analysis.yearlyPlan.slice(0, 2).map(plan => `
${plan.mois}: ${plan.actions.map(a => a.action).join(', ')}
`).join('')}

Réponds maintenant à la question de l'utilisateur en utilisant ces informations et en proposant des actions concrètes.
`;
  }
}