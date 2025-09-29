interface UserTaxBehavior {
  userId: string;
  preferences: {
    complexityLevel: 'beginner' | 'intermediate' | 'expert';
    preferredCommunication: 'simple' | 'detailed' | 'technical';
    responseSpeed: 'quick' | 'thorough';
  };
  history: Array<{
    date: Date;
    topic: string;
    satisfaction: number;
    actionsTaken: string[];
  }>;
  lifeEvents: Array<{
    date: Date;
    type: 'mariage' | 'divorce' | 'naissance' | 'deces' | 'achatImmobilier' | 'vente' | 'changementEmploi' | 'retraite';
    description: string;
    fiscalImpact: number;
  }>;
  learningProfile: {
    topicsUnderstood: string[];
    topicsToExplainMore: string[];
    preferredExamples: string[];
  };
}

interface TaxNotification {
  id: string;
  type: 'reminder' | 'optimization' | 'deadline' | 'newLaw' | 'event';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  actionRequired?: string;
  deadline?: Date;
  savingsPotential?: number;
}

export class TaxLearningEngine {
  private static userBehaviors = new Map<string, UserTaxBehavior>();

  static initializeUserProfile(userId: string): UserTaxBehavior {
    const profile: UserTaxBehavior = {
      userId,
      preferences: {
        complexityLevel: 'beginner',
        preferredCommunication: 'simple',
        responseSpeed: 'quick'
      },
      history: [],
      lifeEvents: [],
      learningProfile: {
        topicsUnderstood: [],
        topicsToExplainMore: [],
        preferredExamples: []
      }
    };
    
    this.userBehaviors.set(userId, profile);
    return profile;
  }

  static recordInteraction(
    userId: string, 
    topic: string, 
    satisfaction: number,
    actionsTaken: string[] = []
  ): void {
    let profile = this.userBehaviors.get(userId);
    if (!profile) {
      profile = this.initializeUserProfile(userId);
    }

    profile.history.push({
      date: new Date(),
      topic,
      satisfaction,
      actionsTaken
    });

    // Adapter le niveau de complexité basé sur l'historique
    this.adaptComplexityLevel(profile);
    
    // Mettre à jour les topics compris/à expliquer
    if (satisfaction > 3) {
      if (!profile.learningProfile.topicsUnderstood.includes(topic)) {
        profile.learningProfile.topicsUnderstood.push(topic);
      }
    } else {
      if (!profile.learningProfile.topicsToExplainMore.includes(topic)) {
        profile.learningProfile.topicsToExplainMore.push(topic);
      }
    }
  }

  static recordLifeEvent(
    userId: string,
    eventType: UserTaxBehavior['lifeEvents'][0]['type'],
    description: string
  ): void {
    let profile = this.userBehaviors.get(userId);
    if (!profile) {
      profile = this.initializeUserProfile(userId);
    }

    const fiscalImpact = this.calculateEventFiscalImpact(eventType);
    
    profile.lifeEvents.push({
      date: new Date(),
      type: eventType,
      description,
      fiscalImpact
    });

    // Générer des notifications proactives basées sur l'événement
    this.generateEventNotifications(userId, eventType);
  }

  private static calculateEventFiscalImpact(eventType: string): number {
    const impacts: Record<string, number> = {
      'mariage': -5000,  // Économie potentielle
      'divorce': 3000,   // Coût fiscal additionnel
      'naissance': -3000, // Déduction enfant
      'achatImmobilier': -8000, // Déductions hypothécaires
      'changementEmploi': 0, // Variable
      'retraite': -10000 // Changement de tranche
    };
    return impacts[eventType] || 0;
  }

  private static adaptComplexityLevel(profile: UserTaxBehavior): void {
    const recentInteractions = profile.history.slice(-10);
    const avgSatisfaction = recentInteractions.reduce((sum, h) => sum + h.satisfaction, 0) / recentInteractions.length;
    
    // Si haute satisfaction et nombreuses interactions, augmenter la complexité
    if (avgSatisfaction > 4 && profile.history.length > 20) {
      if (profile.preferences.complexityLevel === 'beginner') {
        profile.preferences.complexityLevel = 'intermediate';
      } else if (profile.preferences.complexityLevel === 'intermediate') {
        profile.preferences.complexityLevel = 'expert';
      }
    }
    
    // Si basse satisfaction, simplifier
    if (avgSatisfaction < 3) {
      if (profile.preferences.complexityLevel === 'expert') {
        profile.preferences.complexityLevel = 'intermediate';
      } else if (profile.preferences.complexityLevel === 'intermediate') {
        profile.preferences.complexityLevel = 'beginner';
      }
    }
  }

  static generateProactiveNotifications(userId: string, userFinancials: any): TaxNotification[] {
    const notifications: TaxNotification[] = [];
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const daysUntilEndOfYear = Math.floor((endOfYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Notification 3e pilier si pas maximisé et fin d'année proche
    if (userFinancials.troisiemePilier < 7056 && daysUntilEndOfYear < 60) {
      const remaining = 7056 - userFinancials.troisiemePilier;
      notifications.push({
        id: 'pilier3-reminder',
        type: 'reminder',
        priority: 'high',
        title: '⏰ Dernière chance 3e pilier !',
        message: `Il vous reste ${daysUntilEndOfYear} jours pour verser ${remaining.toLocaleString('fr-CH')} CHF dans votre 3e pilier et économiser environ ${(remaining * 0.25).toLocaleString('fr-CH')} CHF d'impôts.`,
        actionRequired: 'Verser dans le 3e pilier',
        deadline: endOfYear,
        savingsPotential: remaining * 0.25
      });
    }

    // Notification déclaration fiscale (mars)
    if (now.getMonth() === 1) { // Février
      notifications.push({
        id: 'declaration-reminder',
        type: 'deadline',
        priority: 'high',
        title: '📋 Préparez votre déclaration fiscale',
        message: 'La période de déclaration approche. Commencez à rassembler vos documents.',
        actionRequired: 'Préparer les documents',
        deadline: new Date(now.getFullYear(), 2, 31)
      });
    }

    // Notification nouvelle loi fiscale
    if (Math.random() > 0.8) { // Simulation d'une nouvelle loi
      notifications.push({
        id: 'new-law',
        type: 'newLaw',
        priority: 'medium',
        title: '📜 Nouvelle réglementation fiscale',
        message: 'Les déductions pour frais de garde ont augmenté dans votre canton. Vous pourriez économiser jusqu\'à 2\'000 CHF supplémentaires.',
        savingsPotential: 2000
      });
    }

    // Notification basée sur les événements de vie
    const profile = this.userBehaviors.get(userId);
    if (profile?.lifeEvents.length > 0) {
      const recentEvent = profile.lifeEvents[profile.lifeEvents.length - 1];
      if ((now.getTime() - recentEvent.date.getTime()) < 30 * 24 * 60 * 60 * 1000) { // Moins de 30 jours
        notifications.push({
          id: `event-${recentEvent.type}`,
          type: 'event',
          priority: 'high',
          title: `💡 Suite à votre ${this.getEventLabel(recentEvent.type)}`,
          message: `Des optimisations fiscales spécifiques sont disponibles. Impact estimé: ${Math.abs(recentEvent.fiscalImpact).toLocaleString('fr-CH')} CHF.`,
          actionRequired: 'Voir les optimisations'
        });
      }
    }

    return notifications;
  }

  private static getEventLabel(eventType: string): string {
    const labels: Record<string, string> = {
      'mariage': 'mariage',
      'divorce': 'divorce',
      'naissance': 'naissance',
      'achatImmobilier': 'achat immobilier',
      'changementEmploi': 'changement d\'emploi',
      'retraite': 'départ à la retraite'
    };
    return labels[eventType] || eventType;
  }

  private static generateEventNotifications(userId: string, eventType: string): void {
    // Cette méthode pourrait envoyer des notifications push/email
    console.log(`Notification générée pour l'utilisateur ${userId} suite à: ${eventType}`);
  }

  static getAdaptedResponse(userId: string, baseResponse: string): string {
    const profile = this.userBehaviors.get(userId);
    if (!profile) return baseResponse;

    // Adapter selon le niveau de complexité
    switch (profile.preferences.complexityLevel) {
      case 'beginner':
        return this.simplifyResponse(baseResponse);
      case 'expert':
        return this.enrichResponse(baseResponse);
      default:
        return baseResponse;
    }
  }

  private static simplifyResponse(response: string): string {
    // Simplifier le langage, éviter le jargon
    return response
      .replace(/taux marginal d'imposition/g, 'pourcentage d\'impôt')
      .replace(/revenu imposable/g, 'revenu qui compte pour les impôts')
      .replace(/déduction fiscale/g, 'réduction d\'impôts')
      .replace(/amortissement/g, 'remboursement');
  }

  private static enrichResponse(response: string): string {
    // Ajouter des détails techniques, références légales
    return response + '\n\n📚 Références: Art. 33 LIFD, Art. 9 LHID';
  }
}