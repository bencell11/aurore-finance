import OpenAI from 'openai';
import { UserContext, UserContextService } from '@/lib/services/user-context.service';
import { UserProfile, Canton } from '@/types/user';
import { UserProfileService } from '@/lib/services/user-profile.service';
import { GoalsService } from '@/lib/services/goals.service';
import { cantonalTaxData, federalTaxRates } from '@/lib/data/swiss-tax-data';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    sources?: string[];
    actionItems?: ActionItem[];
  };
}

export interface ActionItem {
  type: 'simulate' | 'navigate' | 'document' | 'reminder';
  label: string;
  action: string;
  data?: any;
}

export interface AICoachResponse {
  message: ChatMessage;
  suggestedActions?: ActionItem[];
  followUpQuestions?: string[];
  confidence: number;
}

export interface ConversationContext {
  userId: string;
  conversationId: string;
  history: ChatMessage[];
  userContext: UserContext;
  lastUpdated: Date;
}

export class AICoachService {
  private openai: OpenAI;
  private userContextService: UserContextService;
  private userProfileService: UserProfileService;
  private goalsService: GoalsService;
  private conversationMemory: Map<string, ConversationContext> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.userContextService = new UserContextService();
    this.userProfileService = UserProfileService.getInstance();
    this.goalsService = GoalsService.getInstance();
  }

  async generateResponse(
    message: string,
    userId: string,
    conversationId?: string
  ): Promise<AICoachResponse> {
    try {
      // Enregistrer l'action utilisateur
      await this.userProfileService.logUserAction(userId, {
        type: 'consultation_chatbot',
        details: { message: message.substring(0, 100) }
      });

      const context = await this.buildEnhancedConversationContext(userId, conversationId);
      const systemPrompt = await this.buildEnhancedSystemPrompt(userId);
      
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...context.history.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const responseContent = completion.choices[0]?.message?.content || '';
      
      const aiMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        metadata: {
          confidence: this.calculateConfidence(completion),
          sources: await this.extractEnhancedSources(responseContent, userId)
        }
      };

      const userMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };

      await this.updateConversationHistory(userId, conversationId || 'default', [userMessage, aiMessage]);

      const suggestedActions = await this.extractEnhancedActionItems(responseContent, userId);
      const followUpQuestions = await this.generateEnhancedFollowUpQuestions(message, userId);

      return {
        message: aiMessage,
        suggestedActions,
        followUpQuestions,
        confidence: this.calculateConfidence(completion)
      };

    } catch (error) {
      console.error('Erreur lors de la génération de la réponse IA:', error);
      throw new Error('Impossible de générer une réponse. Veuillez réessayer.');
    }
  }

  // Méthode améliorée utilisant nos nouveaux services
  private async buildEnhancedConversationContext(
    userId: string,
    conversationId?: string
  ): Promise<ConversationContext> {
    const contextId = `${userId}_${conversationId || 'default'}`;
    
    let context = this.conversationMemory.get(contextId);
    
    if (!context || this.isContextStale(context)) {
      // Utiliser notre nouveau service de profil
      const userData = await this.userProfileService.exportUserDataForChatbot(userId);
      
      // Construire le contexte avec nos nouvelles données
      const userContext = await this.userContextService.buildFullContext(userId);
      
      context = {
        userId,
        conversationId: conversationId || 'default',
        history: await this.loadConversationHistory(userId, conversationId),
        userContext,
        lastUpdated: new Date()
      };
      
      this.conversationMemory.set(contextId, context);
    }
    
    return context;
  }

  private async buildEnhancedSystemPrompt(userId: string): Promise<string> {
    const userData = await this.userProfileService.exportUserDataForChatbot(userId);
    
    if (!userData.profile || !userData.financial) {
      return this.buildBasicSystemPrompt();
    }

    const profile = userData.profile;
    const financial = userData.financial;
    const goals = userData.goals;
    const insights = userData.insights;

    const netWorth = this.userProfileService.calculateNetWorth(financial);
    const monthlyNetIncome = this.userProfileService.calculateMonthlyNetIncome(financial);
    const savingsRate = this.userProfileService.calculateSavingsRate(financial);

    return `Tu es un conseiller financier expert spécialisé dans le système financier suisse, avec accès aux données complètes de l'utilisateur.

PROFIL UTILISATEUR COMPLET:
- Nom: ${profile.prenom} ${profile.nom}
- Email: ${profile.email}
- Canton: ${profile.canton.nom} (${profile.canton.code})
- Situation familiale: ${profile.situationFamiliale}
- Nombre d'enfants: ${profile.nombreEnfants}
- Profession: ${profile.profession}
- Employeur: ${profile.employeur || 'Non spécifié'}

SITUATION FINANCIÈRE DÉTAILLÉE:
- Patrimoine net: ${netWorth.toLocaleString('fr-CH')} CHF
- Revenu brut annuel: ${financial.revenuBrutAnnuel.toLocaleString('fr-CH')} CHF
- Revenus autres: ${financial.autresRevenus.toLocaleString('fr-CH')} CHF
- Revenu conjoint: ${(financial.revenuConjoint || 0).toLocaleString('fr-CH')} CHF
- Revenu net mensuel: ${monthlyNetIncome.toLocaleString('fr-CH')} CHF
- Taux d'épargne: ${savingsRate.toFixed(1)}%

PATRIMOINE DÉTAILLÉ:
- Liquidités: ${financial.liquidites.toLocaleString('fr-CH')} CHF
- Compte épargne: ${financial.compteEpargne.toLocaleString('fr-CH')} CHF
- Investissements: ${financial.investissements.toLocaleString('fr-CH')} CHF
- Immobilier principal: ${(financial.immobilierPrincipal || 0).toLocaleString('fr-CH')} CHF
- Immobilier locatif: ${(financial.immobilierLocatif || 0).toLocaleString('fr-CH')} CHF
- 3e pilier: ${financial.troisièmePilier.toLocaleString('fr-CH')} CHF
- 2e pilier: ${financial.deuxièmePilier.toLocaleString('fr-CH')} CHF
- Autres actifs: ${financial.autresActifs.toLocaleString('fr-CH')} CHF

DETTES:
- Hypothèque: ${(financial.hypothèque || 0).toLocaleString('fr-CH')} CHF
- Prêts personnels: ${financial.pretsPersonnels.toLocaleString('fr-CH')} CHF
- Carte de crédit: ${financial.carteCredit.toLocaleString('fr-CH')} CHF
- Autres dettes: ${financial.autresDettes.toLocaleString('fr-CH')} CHF

CHARGES MENSUELLES:
- Loyer/Hypothèque: ${financial.loyerOuHypotheque.toLocaleString('fr-CH')} CHF
- Assurances obligatoires: ${financial.assurancesObligatoires.toLocaleString('fr-CH')} CHF
- Assurances complémentaires: ${financial.assurancesComplementaires.toLocaleString('fr-CH')} CHF
- Impôts: ${financial.impots.toLocaleString('fr-CH')} CHF
- Charges de vie: ${financial.chargesVie.toLocaleString('fr-CH')} CHF
- Autres charges: ${financial.autresCharges.toLocaleString('fr-CH')} CHF

PROFIL D'INVESTISSEMENT:
- Tolérance au risque: ${financial.toleranceRisque}
- Expérience investissement: ${financial.experienceInvestissement}
- Horizon de placement: ${financial.horizonPlacement} années

OBJECTIFS FINANCIERS:
- Objectifs actifs: ${goals.activeGoals}
- Objectifs atteints: ${goals.completedGoals}
- Objectifs en retard: ${goals.activeGoals - goals.onTrackGoals}
- Montant total ciblé: ${goals.totalTargetAmount.toLocaleString('fr-CH')} CHF
- Montant actuel: ${goals.totalCurrentAmount.toLocaleString('fr-CH')} CHF
- Progression moyenne: ${goals.averageProgress.toFixed(1)}%

INSIGHTS ET ALERTES:
${insights.map(insight => `- ${insight.priorite.toUpperCase()}: ${insight.titre} - ${insight.message}`).join('\n')}

DONNÉES DE CONTEXTE:
${userData.summary}

FISCALITÉ ${profile.canton.nom.toUpperCase()}:
- Taux d'imposition revenu: ${profile.canton.tauxImposition.revenu}%
- Taux d'imposition fortune: ${profile.canton.tauxImposition.fortune}%

RÈGLES ET CONTRAINTES:
1. TOUJOURS utiliser les données réelles de l'utilisateur
2. Adapter les conseils à la situation du canton ${profile.canton.nom}
3. Respecter les plafonds légaux suisses (3e pilier A: 7'056 CHF max en 2024)
4. Considérer l'âge et la situation familiale
5. Adapter selon le profil de risque "${financial.toleranceRisque}"
6. Tenir compte des objectifs financiers existants
7. Donner des montants précis en CHF
8. Proposer des actions concrètes et mesurables

ACTIONS DISPONIBLES:
- [SIMULATE:impots] pour simulateur d'impôts
- [SIMULATE:immobilier] pour analyse immobilière  
- [SIMULATE:retraite] pour planification retraite
- [SIMULATE:investissement] pour stratégie d'investissement
- [NAVIGATE:objectifs] pour gérer les objectifs
- [NAVIGATE:dashboard] pour tableau de bord
- [CREATE_GOAL:type] pour créer un nouvel objectif
- [CONTRIBUTE:goalId] pour contribuer à un objectif
- [REMINDER:type] pour programmer un rappel

STYLE:
- Ton professionnel et personnalisé
- Utiliser le prénom de l'utilisateur
- Références spécifiques aux données réelles
- Conseils concrets et actionables
- Structurer avec des listes à puces
- Terminer par une suggestion d'action ou question

Réponds maintenant à la question en utilisant toutes ces informations personnelles.`;
  }

  private buildBasicSystemPrompt(): string {
    return `Tu es un conseiller financier expert spécialisé dans le système financier suisse.
    
L'utilisateur n'a pas encore configuré son profil complet. Encourage-le à le faire pour obtenir des conseils personnalisés.

ACTIONS DISPONIBLES:
- [NAVIGATE:profil] pour configurer le profil
- [SIMULATE:impots] pour simulateur d'impôts
- [SIMULATE:immobilier] pour analyse immobilière
- [SIMULATE:retraite] pour planification retraite
- [SIMULATE:investissement] pour stratégie d'investissement

Donne des conseils généraux sur le système financier suisse et encourage la personnalisation.`;
  }

  private async buildSystemPrompt(userContext: UserContext): Promise<string> {
    const profile = userContext.profile;
    const snapshot = userContext.financialSnapshot;
    const objectifs = userContext.objectifs;
    const cantonCode = profile.canton?.code || 'GE';
    const cantonData = (cantonalTaxData as any)[cantonCode];

    return `Tu es un conseiller financier expert spécialisé dans le système financier suisse.

CONTEXTE UTILISATEUR:
- Nom: ${profile.prenom || 'Client'}
- Âge: ${(profile as any).age || 'Non spécifié'} ans
- Canton: ${cantonData?.nom || 'Non spécifié'} (${cantonCode})
- Situation familiale: ${(profile as any).situationFamiliale || 'Non spécifiée'}
- Nombre d'enfants: ${(profile as any).nombreEnfants || 0}
- Revenus nets mensuels: ${(profile as any).revenuNetMensuel?.toLocaleString('fr-CH') || 'Non spécifié'} CHF
- Revenus bruts annuels: ${(profile as any).revenuBrutAnnuel?.toLocaleString('fr-CH') || 'Non spécifié'} CHF
- Charges fixes mensuelles: ${(profile as any).chargesFixes?.toLocaleString('fr-CH') || 'Non spécifié'} CHF
- Niveau de connaissance: ${(profile as any).niveauConnaissance || 'Non spécifié'}

SITUATION FINANCIÈRE:
- Patrimoine net: ${snapshot?.patrimoineNet?.toLocaleString('fr-CH') || 'Non calculé'} CHF
- Liquidités: ${snapshot?.liquidites?.toLocaleString('fr-CH') || 'Non spécifié'} CHF
- Capacité d'épargne: ${snapshot?.capaciteEpargne?.toLocaleString('fr-CH') || 'Non calculé'} CHF/mois
- Taux d'imposition estimé: ${snapshot?.tauxImposition || 'Non calculé'}%
- Score financier: ${snapshot?.scoreFinancier || 'Non calculé'}/100
- Profil de risque: ${snapshot?.risqueProfile || 'Non évalué'}
- Ratio d'endettement: ${snapshot?.ratioEndettement ? (snapshot.ratioEndettement * 100).toFixed(1) : 'Non calculé'}%

PRÉVOYANCE ACTUELLE:
- 2e pilier: ${(profile as any).patrimoine?.prevoyance?.pilier2?.capital?.toLocaleString('fr-CH') || 'Non spécifié'} CHF
- 3e pilier A: ${(profile as any).patrimoine?.prevoyance?.pilier3a?.capital?.toLocaleString('fr-CH') || 'Non spécifié'} CHF
- Versement 3A annuel: ${(profile as any).patrimoine?.prevoyance?.pilier3a?.versementAnnuel?.toLocaleString('fr-CH') || 'Non spécifié'} CHF
- 3e pilier B: ${(profile as any).patrimoine?.prevoyance?.pilier3b?.capital?.toLocaleString('fr-CH') || 'Non spécifié'} CHF

OBJECTIFS FINANCIERS:
${objectifs?.length > 0 ? objectifs.map((obj: any) => `- ${obj.nom || obj.titre}: ${obj.montantCible?.toLocaleString('fr-CH')} CHF (${obj.progression || 0}% atteint)`).join('\n') : '- Aucun objectif défini'}

FISCALITÉ ${cantonData?.nom?.toUpperCase() || 'SUISSE'}:
- Taux de base cantonal: ${cantonData?.tauxBase || 'Non spécifié'}%
- Déduction standard: ${cantonData?.deductions?.celibataire?.toLocaleString('fr-CH') || 'Non spécifié'} CHF (célibataire)
- Déduction par enfant: ${cantonData?.deductions?.parEnfant?.toLocaleString('fr-CH') || 'Non spécifié'} CHF
- Maximum 3e pilier A: ${cantonData?.deductions?.pilier3aMax?.toLocaleString('fr-CH') || '7056'} CHF/an

PRIORITÉS ACTUELLES:
${userContext?.insights?.opportunites?.length > 0 ? userContext.insights.opportunites.map((o: any) => `- ${o}`).join('\n') : '- Aucune opportunité immédiate identifiée'}

ALERTES:
${userContext?.insights?.alertes?.length > 0 ? userContext.insights.alertes.map((a: any) => `⚠️ ${a}`).join('\n') : '- Aucune alerte'}

RÈGLES ET CONTRAINTES:
1. TOUJOURS adapter tes conseils à la situation spécifique du canton ${cantonData?.nom || 'de résidence'}
2. Utiliser les taux d'imposition et déductions du canton ${cantonCode}
3. Respecter les plafonds légaux suisses (3e pilier A: 7'056 CHF max en 2024)
4. Considérer l'âge pour les stratégies de prévoyance et investissement
5. Adapter le niveau de complexité selon le niveau "${(profile as any).niveauConnaissance || 'débutant'}"
6. Mentionner les 3 piliers de la prévoyance suisse quand pertinent
7. Donner des montants précis en CHF quand possible
8. Proposer des actions concrètes et réalisables

STYLE DE COMMUNICATION:
- Ton professionnel mais accessible
- Expliquer simplement les concepts complexes
- Utiliser des exemples concrets avec des chiffres
- Structurer les réponses avec des listes à puces
- Terminer par une question ou suggestion d'action

ACTIONS DISPONIBLES:
- [SIMULATE:impots] pour lancer le simulateur d'impôts
- [SIMULATE:immobilier] pour l'analyse immobilière
- [SIMULATE:retraite] pour la planification retraite
- [NAVIGATE:objectifs] pour gérer les objectifs
- [REMINDER:pilier3a] pour programmer un rappel 3e pilier
- [DOCUMENT:declaration] pour analyser une déclaration d'impôts

Réponds maintenant à la question de l'utilisateur en utilisant toutes ces informations contextuelles.`;
  }

  private async buildConversationContext(
    userId: string,
    conversationId?: string
  ): Promise<ConversationContext> {
    const contextId = `${userId}_${conversationId || 'default'}`;
    
    let context = this.conversationMemory.get(contextId);
    
    if (!context || this.isContextStale(context)) {
      const userContext = await this.userContextService.buildFullContext(userId);
      
      context = {
        userId,
        conversationId: conversationId || 'default',
        history: await this.loadConversationHistory(userId, conversationId),
        userContext,
        lastUpdated: new Date()
      };
      
      this.conversationMemory.set(contextId, context);
    }
    
    return context;
  }

  private isContextStale(context: ConversationContext): boolean {
    const maxAge = 10 * 60 * 1000;
    return Date.now() - context.lastUpdated.getTime() > maxAge;
  }

  private async loadConversationHistory(
    userId: string,
    conversationId?: string
  ): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`/api/ai/conversation?userId=${userId}&conversationId=${conversationId || 'default'}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
    return [];
  }

  private async updateConversationHistory(
    userId: string,
    conversationId: string,
    messages: ChatMessage[]
  ): Promise<void> {
    try {
      await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          conversationId,
          messages
        })
      });
      
      const contextId = `${userId}_${conversationId}`;
      const context = this.conversationMemory.get(contextId);
      if (context) {
        context.history.push(...messages);
        context.lastUpdated = new Date();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique:', error);
    }
  }

  private extractActionItems(
    content: string,
    userContext: UserContext
  ): ActionItem[] {
    const actions: ActionItem[] = [];
    
    const actionMatches = content.match(/\[([A-Z]+):([a-z_]+)\]/g);
    
    if (actionMatches) {
      actionMatches.forEach(match => {
        const [, actionType, actionParam] = match.match(/\[([A-Z]+):([a-z_]+)\]/) || [];
        
        switch (actionType) {
          case 'SIMULATE':
            actions.push({
              type: 'simulate',
              label: this.getSimulatorLabel(actionParam),
              action: `/simulateurs/${actionParam}`,
              data: { type: actionParam }
            });
            break;
          case 'NAVIGATE':
            actions.push({
              type: 'navigate',
              label: this.getNavigationLabel(actionParam),
              action: `/${actionParam}`,
              data: { page: actionParam }
            });
            break;
          case 'REMINDER':
            actions.push({
              type: 'reminder',
              label: this.getReminderLabel(actionParam),
              action: 'create_reminder',
              data: { type: actionParam }
            });
            break;
        }
      });
    }
    
    if (userContext.insights.opportunites.some(opp => opp.includes('3e pilier'))) {
      actions.push({
        type: 'simulate',
        label: 'Optimiser mon 3e pilier',
        action: '/simulateurs/pilier3a',
        data: { type: 'pilier3a' }
      });
    }
    
    if (userContext.financialSnapshot.ratioEndettement > 0.5) {
      actions.push({
        type: 'navigate',
        label: 'Gérer mes dettes',
        action: '/budget',
        data: { focus: 'dettes' }
      });
    }
    
    return actions;
  }

  private generateFollowUpQuestions(
    userMessage: string,
    userContext: UserContext
  ): string[] {
    const questions: string[] = [];
    
    if (userMessage.toLowerCase().includes('impôt')) {
      questions.push('Voulez-vous simuler vos impôts pour l\'année prochaine ?');
      questions.push('Avez-vous des déductions spécifiques à considérer ?');
    }
    
    if (userMessage.toLowerCase().includes('épargne') || userMessage.toLowerCase().includes('investir')) {
      questions.push('Quel est votre horizon de placement ?');
      questions.push('Préférez-vous la sécurité ou acceptez-vous plus de risque ?');
    }
    
    if (userMessage.toLowerCase().includes('retraite')) {
      questions.push('À quel âge souhaitez-vous prendre votre retraite ?');
      questions.push('Avez-vous calculé vos besoins financiers pour la retraite ?');
    }
    
    if (userContext.insights.opportunites.length > 0) {
      questions.push('Voulez-vous explorer les opportunités d\'optimisation identifiées ?');
    }
    
    return questions.slice(0, 3);
  }

  private extractSources(
    content: string,
    userContext: UserContext
  ): string[] {
    const sources: string[] = ['Données utilisateur personnelles'];
    
    if (content.includes('canton') || content.includes('impôt')) {
      const cantonCode = (userContext.profile as any).canton?.code || 'GE';
      const cantonData = (cantonalTaxData as any)[cantonCode];
      sources.push(`Fiscalité ${cantonData?.nom || 'Suisse'}`);
    }
    
    if (content.includes('pilier') || content.includes('prévoyance')) {
      sources.push('Système de prévoyance suisse');
    }
    
    if (content.includes('simulation') || content.includes('calcul')) {
      sources.push('Moteurs de calcul Aurore Finance');
    }
    
    return sources;
  }

  private calculateConfidence(completion: OpenAI.Chat.Completions.ChatCompletion): number {
    const message = completion.choices[0]?.message;
    if (!message?.content) return 0.5;
    
    let confidence = 0.8;
    
    if (completion.usage && completion.usage.total_tokens > 1000) {
      confidence += 0.1;
    }
    
    if (message.content.includes('CHF') || message.content.includes('%')) {
      confidence += 0.05;
    }
    
    if (message.content.includes('[SIMULATE') || message.content.includes('[NAVIGATE')) {
      confidence += 0.05;
    }
    
    return Math.min(1, confidence);
  }

  private getSimulatorLabel(type: string): string {
    const labels: Record<string, string> = {
      'impots': 'Simuler mes impôts',
      'immobilier': 'Analyser un achat immobilier',
      'retraite': 'Planifier ma retraite',
      'investissement': 'Simuler un investissement',
      'pilier3a': 'Optimiser mon 3e pilier A'
    };
    return labels[type] || 'Lancer une simulation';
  }

  private getNavigationLabel(page: string): string {
    const labels: Record<string, string> = {
      'objectifs': 'Gérer mes objectifs',
      'dashboard': 'Voir mon tableau de bord',
      'budget': 'Analyser mon budget',
      'academy': 'Formation financière'
    };
    return labels[page] || 'Naviguer';
  }

  private getReminderLabel(type: string): string {
    const labels: Record<string, string> = {
      'pilier3a': 'Rappel versement 3e pilier',
      'declaration': 'Rappel déclaration d\'impôts',
      'objectif': 'Rappel objectif financier'
    };
    return labels[type] || 'Créer un rappel';
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async clearConversation(userId: string, conversationId?: string): Promise<void> {
    const contextId = `${userId}_${conversationId || 'default'}`;
    this.conversationMemory.delete(contextId);
    
    try {
      await fetch('/api/ai/conversation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          conversationId: conversationId || 'default'
        })
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la conversation:', error);
    }
  }

  async analyzeDocument(
    documentContent: string,
    documentType: 'declaration_impots' | 'fiche_salaire' | 'contrat',
    userId: string
  ): Promise<any> {
    const userContext = await this.userContextService.buildFullContext(userId);
    
    const prompt = `Analyse ce document ${documentType} suisse et extrais les informations financières pertinentes:

Contexte utilisateur: Canton ${userContext.profile.canton}, ${userContext.profile.situationFamiliale}

Document:
${documentContent}

Extraction requise:
- Montants et revenus
- Déductions appliquées
- Optimisations possibles
- Erreurs ou incohérences

Format de réponse en JSON avec des recommandations.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  }

  // Nouvelles méthodes améliorées avec nos services
  private async extractEnhancedActionItems(content: string, userId: string): Promise<ActionItem[]> {
    const actions: ActionItem[] = [];
    const userData = await this.userProfileService.exportUserDataForChatbot(userId);
    
    // Actions basées sur les marqueurs dans le contenu
    const actionMatches = content.match(/\[([A-Z_]+):([a-z_0-9]+)\]/g);
    
    if (actionMatches) {
      actionMatches.forEach(match => {
        const [, actionType, actionParam] = match.match(/\[([A-Z_]+):([a-z_0-9]+)\]/) || [];
        
        switch (actionType) {
          case 'SIMULATE':
            actions.push({
              type: 'simulate',
              label: this.getSimulatorLabel(actionParam),
              action: `/simulateurs/${actionParam}`,
              data: { type: actionParam }
            });
            break;
          case 'NAVIGATE':
            actions.push({
              type: 'navigate',
              label: this.getNavigationLabel(actionParam),
              action: `/${actionParam}`,
              data: { page: actionParam }
            });
            break;
          case 'CREATE_GOAL':
            actions.push({
              type: 'navigate',
              label: `Créer un objectif ${actionParam}`,
              action: `/objectifs/create?type=${actionParam}`,
              data: { goalType: actionParam }
            });
            break;
          case 'CONTRIBUTE':
            actions.push({
              type: 'navigate',
              label: 'Contribuer à cet objectif',
              action: `/objectifs/${actionParam}/contribute`,
              data: { goalId: actionParam }
            });
            break;
          case 'REMINDER':
            actions.push({
              type: 'reminder',
              label: this.getReminderLabel(actionParam),
              action: 'create_reminder',
              data: { type: actionParam }
            });
            break;
        }
      });
    }
    
    // Actions intelligentes basées sur les données utilisateur
    if (userData.insights.length > 0) {
      const urgentInsights = userData.insights.filter(i => i.priorite === 'urgent');
      if (urgentInsights.length > 0) {
        actions.push({
          type: 'navigate',
          label: `Voir ${urgentInsights.length} alerte(s) urgente(s)`,
          action: '/dashboard#alerts',
          data: { section: 'alerts' }
        });
      }
    }

    // Actions basées sur les objectifs
    if (userData.goals.activeGoals > 0) {
      actions.push({
        type: 'navigate',
        label: 'Gérer mes objectifs',
        action: '/objectifs',
        data: { section: 'goals' }
      });
    }

    // Actions fiscales en fin d'année
    const now = new Date();
    if (now.getMonth() >= 10) { // Novembre-Décembre
      actions.push({
        type: 'simulate',
        label: 'Optimiser mes impôts 2024',
        action: '/simulateurs/impots',
        data: { type: 'impots', year: now.getFullYear() }
      });
    }

    return actions.slice(0, 4); // Limiter à 4 actions
  }

  private async generateEnhancedFollowUpQuestions(userMessage: string, userId: string): Promise<string[]> {
    const questions: string[] = [];
    const userData = await this.userProfileService.exportUserDataForChatbot(userId);
    
    const messageLower = userMessage.toLowerCase();
    
    // Questions basées sur le contenu du message
    if (messageLower.includes('impôt') || messageLower.includes('fiscal')) {
      questions.push('Voulez-vous simuler vos impôts avec vos données actuelles ?');
      if (userData.financial?.troisièmePilier && userData.financial.troisièmePilier < 6000) {
        questions.push('Souhaitez-vous optimiser votre 3e pilier pour réduire vos impôts ?');
      }
    }
    
    if (messageLower.includes('épargne') || messageLower.includes('économiser')) {
      if (userData.goals.activeGoals === 0) {
        questions.push('Voulez-vous définir des objectifs d\'épargne concrets ?');
      }
      questions.push('Quel montant pouvez-vous épargner mensuellement ?');
    }
    
    if (messageLower.includes('investir') || messageLower.includes('placement')) {
      questions.push('Quel est votre horizon de placement ?');
      questions.push('Préférez-vous la sécurité ou acceptez-vous plus de risque ?');
      if (userData.financial?.toleranceRisque) {
        questions.push(`Votre profil ${userData.financial.toleranceRisque} vous convient-il toujours ?`);
      }
    }
    
    if (messageLower.includes('retraite') || messageLower.includes('prévoyance')) {
      questions.push('À quel âge souhaitez-vous prendre votre retraite ?');
      if (userData.financial?.deuxièmePilier) {
        questions.push('Voulez-vous analyser vos prestations LPP ?');
      }
    }
    
    if (messageLower.includes('immobilier') || messageLower.includes('achat') || messageLower.includes('maison')) {
      questions.push('Avez-vous un budget et une région en tête ?');
      questions.push('Souhaitez-vous analyser votre capacité d\'achat ?');
    }

    // Questions basées sur le profil utilisateur
    if (userData.financial) {
      const savingsRate = this.userProfileService.calculateSavingsRate(userData.financial);
      if (savingsRate < 10) {
        questions.push('Voulez-vous analyser votre budget pour identifier des économies ?');
      }
      
      if (userData.financial.liquidites > 50000) {
        questions.push('Que pensez-vous de faire fructifier vos liquidités importantes ?');
      }
    }

    // Questions sur les objectifs non atteints
    if (userData.goals.activeGoals > userData.goals.onTrackGoals) {
      questions.push('Voulez-vous revoir la stratégie de vos objectifs en retard ?');
    }

    return questions.slice(0, 3); // Limiter à 3 questions
  }

  private async extractEnhancedSources(content: string, userId: string): Promise<string[]> {
    const sources: string[] = [];
    const userData = await this.userProfileService.exportUserDataForChatbot(userId);
    
    // Sources basées sur les données utilisateur
    if (userData.profile) {
      sources.push('Profil utilisateur personnel');
    }
    
    if (userData.financial) {
      sources.push('Situation financière actuelle');
    }
    
    if (userData.goals.totalGoals > 0) {
      sources.push('Objectifs financiers définis');
    }
    
    // Sources basées sur le contenu
    if (content.includes('canton') || content.includes('impôt')) {
      if (userData.profile) {
        sources.push(`Fiscalité ${userData.profile.canton.nom}`);
      }
    }
    
    if (content.includes('pilier') || content.includes('prévoyance')) {
      sources.push('Système de prévoyance suisse');
    }
    
    if (content.includes('simulation') || content.includes('calcul')) {
      sources.push('Moteurs de calcul Aurore Finance');
    }

    if (content.includes('CHF') || content.includes('%')) {
      sources.push('Données financières personnelles');
    }
    
    return sources;
  }

  // Actions spéciales pour les objectifs
  async createGoalFromChatbot(userId: string, goalData: {
    type: string;
    title: string;
    amount: number;
    deadline: string;
    monthlyContribution?: number;
  }): Promise<string> {
    try {
      const goal = await this.goalsService.createGoal(userId, {
        titre: goalData.title,
        description: `Objectif créé via le chatbot IA`,
        type: goalData.type as any,
        montantCible: goalData.amount,
        montantActuel: 0,
        dateEcheance: new Date(goalData.deadline),
        priorite: 'moyenne',
        status: 'actif',
        versementMensuelPlan: goalData.monthlyContribution || 0,
        tauxRendementEstime: 3, // 3% par défaut
        rappelsActifs: true,
        frequenceRappel: 'mensuel'
      });

      await this.userProfileService.logUserAction(userId, {
        type: 'objectif_cree',
        details: { 
          goalId: goal.id,
          type: goalData.type,
          amount: goalData.amount,
          source: 'chatbot'
        },
        resultat: 'success'
      });

      return goal.id;
    } catch (error) {
      console.error('Erreur lors de la création de l\'objectif:', error);
      throw error;
    }
  }

  // Intégration avec les simulateurs
  async triggerSimulationFromChat(userId: string, simulationType: string, context?: any): Promise<string> {
    await this.userProfileService.logUserAction(userId, {
      type: 'simulation',
      details: { 
        type: simulationType,
        source: 'chatbot',
        context
      }
    });

    // Retourner l'URL appropriée
    return `/simulateurs/${simulationType}`;
  }
}