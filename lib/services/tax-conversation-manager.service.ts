interface ConversationStep {
  id: string;
  question: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
  options?: Array<{value: string; label: string}>;
  validation?: (value: any) => boolean;
  nextStep?: (value: any) => string;
  saveAs: string;
}

interface TaxDocument {
  type: string;
  name: string;
  required: boolean;
  status: 'missing' | 'uploaded' | 'generated' | 'verified';
  autoGenerate?: boolean;
}

export class TaxConversationManager {
  private static conversationFlow: ConversationStep[] = [
    {
      id: 'start',
      question: "👋 Bonjour ! Je suis votre assistant fiscal personnel. Pour optimiser vos impôts, j'ai besoin de quelques informations. Commençons : Quelle est votre situation familiale ?",
      type: 'select',
      options: [
        {value: 'celibataire', label: '🧍 Célibataire'},
        {value: 'marie', label: '💑 Marié(e)'},
        {value: 'divorce', label: '📝 Divorcé(e)'},
        {value: 'veuf', label: '🕊️ Veuf/Veuve'},
        {value: 'concubinage', label: '🏠 En concubinage'}
      ],
      saveAs: 'situationFamiliale',
      nextStep: (value) => value === 'marie' || value === 'concubinage' ? 'conjoint' : 'enfants'
    },
    {
      id: 'conjoint',
      question: "Votre conjoint(e) travaille-t-il/elle ? Si oui, quel est son revenu annuel brut ?",
      type: 'number',
      saveAs: 'revenuConjoint',
      nextStep: () => 'enfants'
    },
    {
      id: 'enfants',
      question: "Avez-vous des enfants à charge ? Si oui, combien ?",
      type: 'number',
      saveAs: 'nombreEnfants',
      nextStep: (value) => value > 0 ? 'enfantsDetails' : 'revenu'
    },
    {
      id: 'enfantsDetails',
      question: "Pour chaque enfant, j'aurai besoin de l'âge et s'il est en formation. Commençons par le premier - quel âge a-t-il ?",
      type: 'text',
      saveAs: 'enfantsInfo',
      nextStep: () => 'revenu'
    },
    {
      id: 'revenu',
      question: "💼 Quel est votre revenu annuel brut actuel ?",
      type: 'number',
      saveAs: 'revenuBrutAnnuel',
      validation: (value) => value > 0,
      nextStep: () => 'troisiemePilier'
    },
    {
      id: 'troisiemePilier',
      question: "🏦 Avez-vous déjà versé dans votre 3e pilier cette année ? Si oui, combien ?",
      type: 'number',
      saveAs: 'montant3ePilier',
      nextStep: () => 'proprietaire'
    },
    {
      id: 'proprietaire',
      question: "🏠 Êtes-vous propriétaire de votre logement ?",
      type: 'boolean',
      saveAs: 'estProprietaire',
      nextStep: (value) => value ? 'hypotheque' : 'fraisPro'
    },
    {
      id: 'hypotheque',
      question: "Quel est le montant de votre hypothèque actuelle ?",
      type: 'number',
      saveAs: 'montantHypotheque',
      nextStep: () => 'fraisPro'
    },
    {
      id: 'fraisPro',
      question: "🚗 Utilisez-vous un véhicule personnel pour votre travail ? (trajets domicile-travail)",
      type: 'boolean',
      saveAs: 'vehiculeTravail',
      nextStep: (value) => value ? 'distance' : 'formation'
    },
    {
      id: 'distance',
      question: "Quelle est la distance (en km) entre votre domicile et votre lieu de travail ?",
      type: 'number',
      saveAs: 'distanceTravail',
      nextStep: () => 'formation'
    },
    {
      id: 'formation',
      question: "📚 Avez-vous suivi des formations professionnelles cette année ?",
      type: 'boolean',
      saveAs: 'formationPro',
      nextStep: (value) => value ? 'montantFormation' : 'complete'
    },
    {
      id: 'montantFormation',
      question: "Quel montant avez-vous investi dans votre formation professionnelle ?",
      type: 'number',
      saveAs: 'montantFormation',
      nextStep: () => 'complete'
    },
    {
      id: 'complete',
      question: "✅ Parfait ! J'ai toutes les informations nécessaires. Je vais maintenant analyser votre situation et vous proposer un plan d'optimisation personnalisé.",
      type: 'text',
      saveAs: 'complete',
      nextStep: () => null
    }
  ];

  static getCurrentStep(stepId: string): ConversationStep | undefined {
    return this.conversationFlow.find(step => step.id === stepId);
  }

  static processUserResponse(stepId: string, response: any): {
    nextStepId: string | null;
    data: {[key: string]: any};
    analysis?: any;
  } {
    const currentStep = this.getCurrentStep(stepId);
    if (!currentStep) return { nextStepId: null, data: {} };

    const data = { [currentStep.saveAs]: response };
    
    // Validation
    if (currentStep.validation && !currentStep.validation(response)) {
      return { nextStepId: stepId, data: {} }; // Répéter la question
    }

    // Déterminer la prochaine étape
    const nextStepId = currentStep.nextStep ? currentStep.nextStep(response) : null;

    // Si c'est la dernière étape, générer l'analyse
    let analysis = undefined;
    if (stepId === 'complete' || !nextStepId) {
      analysis = this.generateTaxAnalysis(data);
    }

    return { nextStepId, data, analysis };
  }

  private static generateTaxAnalysis(collectedData: any): any {
    // Calcul des optimisations basé sur les données collectées
    const optimizations = [];
    
    // 3e pilier
    const max3ePilier = 7056;
    if (collectedData.montant3ePilier < max3ePilier) {
      optimizations.push({
        type: '3e pilier',
        action: `Verser ${max3ePilier - collectedData.montant3ePilier} CHF supplémentaires`,
        economie: (max3ePilier - collectedData.montant3ePilier) * 0.25
      });
    }

    // Frais de transport
    if (collectedData.vehiculeTravail && collectedData.distanceTravail) {
      const fraisTransport = collectedData.distanceTravail * 2 * 220 * 0.70; // 220 jours, 0.70 CHF/km
      optimizations.push({
        type: 'Frais de transport',
        action: `Déduire ${fraisTransport.toLocaleString('fr-CH')} CHF de frais de transport`,
        economie: fraisTransport * 0.25
      });
    }

    return {
      totalEconomie: optimizations.reduce((sum, opt) => sum + opt.economie, 0),
      optimizations,
      nextSteps: [
        'Préparer les justificatifs',
        'Planifier les versements',
        'Organiser les documents'
      ]
    };
  }

  static generateDocumentsList(userProfile: any): TaxDocument[] {
    const documents: TaxDocument[] = [
      {
        type: 'certificat_salaire',
        name: 'Certificat de salaire',
        required: true,
        status: 'missing'
      },
      {
        type: 'attestation_3e_pilier',
        name: 'Attestation 3e pilier',
        required: userProfile.troisiemePilier > 0,
        status: 'missing'
      },
      {
        type: 'frais_professionnels',
        name: 'Justificatifs frais professionnels',
        required: false,
        status: 'missing',
        autoGenerate: true
      }
    ];

    if (userProfile.estProprietaire) {
      documents.push({
        type: 'attestation_hypotheque',
        name: 'Attestation d\'intérêts hypothécaires',
        required: true,
        status: 'missing'
      });
    }

    if (userProfile.formationPro) {
      documents.push({
        type: 'factures_formation',
        name: 'Factures de formation',
        required: true,
        status: 'missing'
      });
    }

    return documents;
  }
}