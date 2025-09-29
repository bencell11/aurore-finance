import { ChatMessage, TaxAssistantSession, TaxProfile } from '@/types/tax';
import { TaxSecurityService } from './security.service';

/**
 * Service de chatbot intelligent pour la collecte des données fiscales
 */
export class TaxChatbotService {
  
  private static readonly CONVERSATION_FLOW = [
    {
      id: 'welcome',
      category: 'intro',
      questions: [
        'Bonjour ! Je suis votre assistant fiscal intelligent. Je vais vous aider à préparer votre déclaration d\'impôts de manière simple et optimisée.',
        'Avant de commencer, avez-vous déjà fait une déclaration d\'impôts en Suisse ?'
      ],
      field: null,
      validation: null,
      nextStep: 'personal_info'
    },
    {
      id: 'personal_info',
      category: 'personalInfo',
      questions: [
        'Commençons par vos informations personnelles.',
        'Dans quel canton résidez-vous ?'
      ],
      field: 'canton',
      validation: (value: string) => /^[A-Z]{2}$/.test(value),
      nextStep: 'civil_status'
    },
    {
      id: 'civil_status',
      category: 'personalInfo',
      questions: [
        'Quelle est votre situation familiale ?',
        '(célibataire, marié(e), divorcé(e), veuf/veuve, séparé(e), partenariat enregistré)'
      ],
      field: 'civilStatus',
      validation: (value: string) => ['single', 'married', 'divorced', 'widowed', 'separated', 'registered_partnership'].includes(value),
      nextStep: 'children'
    },
    {
      id: 'children',
      category: 'personalInfo',
      questions: [
        'Avez-vous des enfants à charge ?',
        'Si oui, combien ?'
      ],
      field: 'numberOfChildren',
      validation: (value: any) => !isNaN(parseInt(value)) && parseInt(value) >= 0,
      nextStep: 'employment'
    },
    {
      id: 'employment',
      category: 'income',
      questions: [
        'Parlons maintenant de vos revenus.',
        'Êtes-vous salarié(e) ? Si oui, quel est votre salaire brut annuel ?'
      ],
      field: 'grossSalary',
      validation: (value: any) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
      nextStep: 'other_income'
    },
    {
      id: 'other_income',
      category: 'income',
      questions: [
        'Avez-vous d\'autres sources de revenus ?',
        '(revenus locatifs, pensions, allocations, revenus d\'indépendant, etc.)',
        'Vous pouvez répondre "non" si vous n\'en avez pas.'
      ],
      field: 'otherIncome',
      validation: null,
      nextStep: 'pillar3a'
    },
    {
      id: 'pillar3a',
      category: 'deductions',
      questions: [
        'Passons aux déductions pour optimiser vos impôts.',
        'Cotisez-vous à un 3e pilier A ? Si oui, quel montant annuel ?',
        '(Maximum déductible en 2024: 7\'056 CHF)'
      ],
      field: 'pillar3a',
      validation: (value: any) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 7056,
      nextStep: 'professional_expenses'
    },
    {
      id: 'professional_expenses',
      category: 'deductions',
      questions: [
        'Avez-vous des frais professionnels ?',
        'Par exemple: frais de transport domicile-travail, repas à l\'extérieur, formation continue...',
        'Donnez-moi une estimation du montant annuel total.'
      ],
      field: 'professionalExpenses',
      validation: (value: any) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
      nextStep: 'insurance'
    },
    {
      id: 'insurance',
      category: 'deductions',
      questions: [
        'Quel est le montant annuel de vos primes d\'assurance maladie ?',
        '(Uniquement l\'assurance de base et complémentaires)'
      ],
      field: 'healthInsurance',
      validation: (value: any) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
      nextStep: 'wealth'
    },
    {
      id: 'wealth',
      category: 'assets',
      questions: [
        'Pour finir, parlons de votre fortune.',
        'Quel est le total de vos avoirs bancaires (comptes courants et épargne) ?'
      ],
      field: 'bankAccounts',
      validation: (value: any) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
      nextStep: 'real_estate'
    },
    {
      id: 'real_estate',
      category: 'assets',
      questions: [
        'Êtes-vous propriétaire de biens immobiliers ?',
        'Si oui, indiquez la valeur fiscale totale de vos biens.'
      ],
      field: 'realEstateValue',
      validation: null,
      nextStep: 'documents'
    },
    {
      id: 'documents',
      category: 'documents',
      questions: [
        'Excellent ! J\'ai collecté les informations principales.',
        'Pour compléter votre déclaration, vous aurez besoin des documents suivants:',
        '• Certificat de salaire',
        '• Attestations de prévoyance (3e pilier)',
        '• Relevés bancaires au 31.12',
        '• Attestations d\'assurance maladie',
        'Souhaitez-vous que je génère un récapitulatif de vos données ?'
      ],
      field: null,
      validation: null,
      nextStep: 'summary'
    }
  ];
  
  /**
   * Démarre une nouvelle session de chat
   */
  static startSession(userId: string): TaxAssistantSession {
    return {
      id: this.generateSessionId(),
      userId,
      startTime: new Date(),
      messages: [],
      currentSection: 'welcome',
      progress: 0,
      collectedData: {}
    };
  }
  
  /**
   * Traite un message utilisateur et génère une réponse
   */
  static async processMessage(
    session: TaxAssistantSession,
    userMessage: string
  ): Promise<{
    response: ChatMessage;
    updatedSession: TaxAssistantSession;
    action?: string;
  }> {
    // Ajoute le message utilisateur à la session
    const userChatMessage: ChatMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    session.messages.push(userChatMessage);
    
    // Trouve l'étape actuelle
    const currentStep = this.CONVERSATION_FLOW.find(step => step.id === session.currentSection);
    
    if (!currentStep) {
      return {
        response: this.createErrorMessage('Session invalide'),
        updatedSession: session
      };
    }
    
    // Analyse de l'intention utilisateur
    const intent = await this.analyzeIntent(userMessage);
    
    // Gestion des intentions spéciales
    if (intent === 'help') {
      return {
        response: this.createHelpMessage(session.currentSection),
        updatedSession: session
      };
    }
    
    if (intent === 'back') {
      return this.goToPreviousStep(session);
    }
    
    if (intent === 'skip') {
      return this.skipCurrentStep(session);
    }
    
    // Validation et extraction de la réponse
    if (currentStep.field) {
      const extractedValue = this.extractValue(userMessage, currentStep.field);
      
      if (currentStep.validation) {
        if (!currentStep.validation(extractedValue)) {
          return {
            response: this.createValidationErrorMessage(currentStep.field),
            updatedSession: session
          };
        }
      }
      
      // Enregistre la valeur
      this.saveFieldValue(session, currentStep.category, currentStep.field, extractedValue);
    }
    
    // Passe à l'étape suivante
    if (currentStep.nextStep) {
      session.currentSection = currentStep.nextStep;
      session.progress = this.calculateProgress(currentStep.nextStep);
      
      const nextStep = this.CONVERSATION_FLOW.find(step => step.id === currentStep.nextStep);
      
      if (nextStep) {
        const response: ChatMessage = {
          id: this.generateMessageId(),
          role: 'assistant',
          content: nextStep.questions.join('\n'),
          timestamp: new Date(),
          metadata: {
            category: nextStep.category,
            field: nextStep.field || undefined,
            validated: true
          }
        };
        
        session.messages.push(response);
        
        return {
          response,
          updatedSession: session,
          action: nextStep.id === 'summary' ? 'generate_summary' : undefined
        };
      }
    }
    
    // Fin de la conversation
    if (session.currentSection === 'summary') {
      return {
        response: this.createSummaryMessage(session.collectedData),
        updatedSession: {
          ...session,
          endTime: new Date(),
          progress: 100
        },
        action: 'complete'
      };
    }
    
    return {
      response: this.createErrorMessage('Erreur inattendue'),
      updatedSession: session
    };
  }
  
  /**
   * Génère des questions adaptatives basées sur le contexte
   */
  static generateAdaptiveQuestion(
    profile: Partial<TaxProfile>,
    previousAnswers: any[]
  ): ChatMessage {
    // Logique adaptative basée sur les réponses précédentes
    let question = '';
    let field = '';
    
    // Si marié, demander les revenus du conjoint
    if (profile.personalInfo?.civilStatus === 'married' && !profile.incomeData?.secondaryEmployments) {
      question = 'Votre conjoint(e) a-t-il/elle des revenus ? Si oui, quel est son salaire brut annuel ?';
      field = 'spouseIncome';
    }
    
    // Si propriétaire, demander les intérêts hypothécaires
    else if (profile.realEstate && profile.realEstate.length > 0 && !profile.deductions?.realEstateExpenses) {
      question = 'Quel est le montant annuel de vos intérêts hypothécaires ?';
      field = 'mortgageInterest';
    }
    
    // Si enfants, demander les frais de garde
    else if (profile.personalInfo?.numberOfChildren && profile.personalInfo.numberOfChildren > 0) {
      question = 'Avez-vous des frais de garde d\'enfants déductibles ? Si oui, quel montant annuel ?';
      field = 'childcareExpenses';
    }
    
    // Si revenus élevés, suggérer rachats LPP
    else if (profile.incomeData?.mainEmployment?.grossSalary && profile.incomeData.mainEmployment.grossSalary > 120000) {
      question = 'Avec vos revenus, des rachats de prévoyance (2e pilier) pourraient considérablement réduire vos impôts. Avez-vous effectué des rachats cette année ?';
      field = 'lppBuyback';
    }
    
    return {
      id: this.generateMessageId(),
      role: 'assistant',
      content: question || 'Avez-vous d\'autres informations à ajouter ?',
      timestamp: new Date(),
      metadata: {
        field,
        category: 'adaptive'
      }
    };
  }
  
  /**
   * Analyse l'intention de l'utilisateur
   */
  private static async analyzeIntent(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
      return 'help';
    }
    
    if (lowerMessage.includes('retour') || lowerMessage.includes('précédent')) {
      return 'back';
    }
    
    if (lowerMessage.includes('passer') || lowerMessage.includes('skip') || lowerMessage === 'non') {
      return 'skip';
    }
    
    if (lowerMessage.includes('arrêter') || lowerMessage.includes('stop')) {
      return 'stop';
    }
    
    return 'answer';
  }
  
  /**
   * Extrait la valeur de la réponse utilisateur
   */
  private static extractValue(message: string, fieldType: string): any {
    // Extraction des nombres
    if (['grossSalary', 'pillar3a', 'healthInsurance', 'bankAccounts', 'numberOfChildren'].includes(fieldType)) {
      const numbers = message.match(/[\d']+(?:[.,]\d+)?/g);
      if (numbers && numbers.length > 0) {
        return parseFloat(numbers[0].replace(/'/g, '').replace(',', '.'));
      }
    }
    
    // Extraction du canton (code à 2 lettres)
    if (fieldType === 'canton') {
      const cantonMatch = message.toUpperCase().match(/\b[A-Z]{2}\b/);
      if (cantonMatch) return cantonMatch[0];
      
      // Mapping des noms complets
      const cantonMap: Record<string, string> = {
        'geneve': 'GE', 'genève': 'GE',
        'vaud': 'VD', 'lausanne': 'VD',
        'zurich': 'ZH', 'zürich': 'ZH',
        'berne': 'BE', 'bern': 'BE',
        'fribourg': 'FR', 'freiburg': 'FR'
        // ... autres cantons
      };
      
      for (const [name, code] of Object.entries(cantonMap)) {
        if (message.toLowerCase().includes(name)) return code;
      }
    }
    
    // Extraction du statut civil
    if (fieldType === 'civilStatus') {
      const statusMap: Record<string, string> = {
        'célibataire': 'single',
        'marié': 'married', 'mariée': 'married',
        'divorcé': 'divorced', 'divorcée': 'divorced',
        'veuf': 'widowed', 'veuve': 'widowed',
        'séparé': 'separated', 'séparée': 'separated',
        'partenariat': 'registered_partnership'
      };
      
      for (const [keyword, status] of Object.entries(statusMap)) {
        if (message.toLowerCase().includes(keyword)) return status;
      }
    }
    
    return message.trim();
  }
  
  /**
   * Sauvegarde une valeur dans la session
   */
  private static saveFieldValue(
    session: TaxAssistantSession,
    category: string,
    field: string,
    value: any
  ): void {
    if (!session.collectedData[category]) {
      session.collectedData[category] = {};
    }
    
    session.collectedData[category][field] = value;
  }
  
  /**
   * Calcule la progression
   */
  private static calculateProgress(currentStep: string): number {
    const stepIndex = this.CONVERSATION_FLOW.findIndex(step => step.id === currentStep);
    return Math.round((stepIndex / this.CONVERSATION_FLOW.length) * 100);
  }
  
  /**
   * Retourne à l'étape précédente
   */
  private static goToPreviousStep(session: TaxAssistantSession): any {
    const currentIndex = this.CONVERSATION_FLOW.findIndex(step => step.id === session.currentSection);
    
    if (currentIndex > 0) {
      const previousStep = this.CONVERSATION_FLOW[currentIndex - 1];
      session.currentSection = previousStep.id;
      session.progress = this.calculateProgress(previousStep.id);
      
      return {
        response: {
          id: this.generateMessageId(),
          role: 'assistant',
          content: `Revenons à l'étape précédente.\n${previousStep.questions.join('\n')}`,
          timestamp: new Date()
        },
        updatedSession: session
      };
    }
    
    return {
      response: this.createErrorMessage('Impossible de revenir en arrière'),
      updatedSession: session
    };
  }
  
  /**
   * Passe à l'étape suivante sans répondre
   */
  private static skipCurrentStep(session: TaxAssistantSession): any {
    const currentStep = this.CONVERSATION_FLOW.find(step => step.id === session.currentSection);
    
    if (currentStep && currentStep.nextStep) {
      session.currentSection = currentStep.nextStep;
      session.progress = this.calculateProgress(currentStep.nextStep);
      
      const nextStep = this.CONVERSATION_FLOW.find(step => step.id === currentStep.nextStep);
      
      if (nextStep) {
        return {
          response: {
            id: this.generateMessageId(),
            role: 'assistant',
            content: `D'accord, passons à la suite.\n${nextStep.questions.join('\n')}`,
            timestamp: new Date()
          },
          updatedSession: session
        };
      }
    }
    
    return {
      response: this.createErrorMessage('Impossible de passer cette étape'),
      updatedSession: session
    };
  }
  
  /**
   * Crée un message d'aide
   */
  private static createHelpMessage(currentSection: string): ChatMessage {
    const helpTexts: Record<string, string> = {
      canton: 'Le canton est nécessaire car les taux d\'imposition varient considérablement. Par exemple: GE pour Genève, VD pour Vaud, ZH pour Zurich.',
      grossSalary: 'Indiquez votre salaire brut annuel avant déductions. Vous le trouvez sur votre certificat de salaire.',
      pillar3a: 'Le 3e pilier A est entièrement déductible jusqu\'à 7\'056 CHF (2024). C\'est l\'une des meilleures optimisations fiscales !',
      healthInsurance: 'Incluez l\'assurance de base LAMal et vos complémentaires. Les primes sont partiellement déductibles.'
    };
    
    return {
      id: this.generateMessageId(),
      role: 'assistant',
      content: helpTexts[currentSection] || 'Je suis là pour vous aider. Posez-moi vos questions !',
      timestamp: new Date()
    };
  }
  
  /**
   * Crée un message d'erreur de validation
   */
  private static createValidationErrorMessage(field: string): ChatMessage {
    const errorMessages: Record<string, string> = {
      canton: 'Veuillez indiquer un code de canton valide (ex: GE, VD, ZH)',
      grossSalary: 'Veuillez indiquer un montant valide pour votre salaire',
      pillar3a: 'Le montant du 3e pilier ne peut pas dépasser 7\'056 CHF',
      numberOfChildren: 'Veuillez indiquer un nombre valide d\'enfants'
    };
    
    return {
      id: this.generateMessageId(),
      role: 'assistant',
      content: errorMessages[field] || 'La valeur saisie n\'est pas valide. Veuillez réessayer.',
      timestamp: new Date()
    };
  }
  
  /**
   * Crée un message de résumé
   */
  private static createSummaryMessage(collectedData: any): ChatMessage {
    let summary = '📊 **Résumé de vos données fiscales**\n\n';
    
    if (collectedData.personalInfo) {
      summary += '**Informations personnelles:**\n';
      summary += `• Canton: ${collectedData.personalInfo.canton || 'Non renseigné'}\n`;
      summary += `• Situation: ${collectedData.personalInfo.civilStatus || 'Non renseigné'}\n`;
      summary += `• Enfants: ${collectedData.personalInfo.numberOfChildren || 0}\n\n`;
    }
    
    if (collectedData.income) {
      summary += '**Revenus:**\n';
      summary += `• Salaire brut: ${collectedData.income.grossSalary?.toLocaleString('fr-CH') || 0} CHF\n\n`;
    }
    
    if (collectedData.deductions) {
      summary += '**Déductions:**\n';
      summary += `• 3e pilier A: ${collectedData.deductions.pillar3a?.toLocaleString('fr-CH') || 0} CHF\n`;
      summary += `• Frais professionnels: ${collectedData.deductions.professionalExpenses?.toLocaleString('fr-CH') || 0} CHF\n`;
      summary += `• Assurance maladie: ${collectedData.deductions.healthInsurance?.toLocaleString('fr-CH') || 0} CHF\n\n`;
    }
    
    if (collectedData.assets) {
      summary += '**Fortune:**\n';
      summary += `• Avoirs bancaires: ${collectedData.assets.bankAccounts?.toLocaleString('fr-CH') || 0} CHF\n`;
    }
    
    summary += '\n✅ Vos données ont été enregistrées avec succès !';
    summary += '\n\nVous pouvez maintenant:\n';
    summary += '• Calculer vos impôts\n';
    summary += '• Identifier des optimisations\n';
    summary += '• Générer votre déclaration\n';
    summary += '• Télécharger les documents requis';
    
    return {
      id: this.generateMessageId(),
      role: 'assistant',
      content: summary,
      timestamp: new Date()
    };
  }
  
  /**
   * Crée un message d'erreur générique
   */
  private static createErrorMessage(error: string): ChatMessage {
    return {
      id: this.generateMessageId(),
      role: 'assistant',
      content: `❌ ${error}`,
      timestamp: new Date()
    };
  }
  
  /**
   * Génère un ID unique pour la session
   */
  private static generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Génère un ID unique pour un message
   */
  private static generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}