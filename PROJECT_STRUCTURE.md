# Structure du Projet Aurore Finance

```
aurore-finance/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Routes authentifiées
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # Dashboard principal
│   │   │   ├── ai-coach/
│   │   │   │   └── page.tsx         # Chatbot IA
│   │   │   ├── objectifs/
│   │   │   │   └── page.tsx         # Gestion des objectifs
│   │   │   ├── academy/
│   │   │   │   └── page.tsx         # Contenu éducatif
│   │   │   ├── communaute/
│   │   │   │   └── page.tsx         # Forum communautaire
│   │   │   ├── simulateurs/
│   │   │   │   ├── impots/
│   │   │   │   ├── immobilier/
│   │   │   │   ├── retraite/
│   │   │   │   └── investissement/
│   │   │   └── profil/
│   │   │       └── page.tsx         # Profil utilisateur
│   │   ├── (public)/                 # Routes publiques
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── onboarding/          # Questionnaire d'entrée
│   │   ├── api/                     # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   ├── ai/
│   │   │   │   ├── chat/
│   │   │   │   └── recommendations/
│   │   │   ├── user/
│   │   │   │   ├── profile/
│   │   │   │   └── context/
│   │   │   ├── simulateurs/
│   │   │   │   ├── impots/
│   │   │   │   ├── immobilier/
│   │   │   │   └── retraite/
│   │   │   ├── objectifs/
│   │   │   ├── academy/
│   │   │   └── community/
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/                   # Composants réutilisables
│   │   ├── ui/                      # Composants UI de base (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Navigation.tsx       # Navigation principale
│   │   │   ├── MobileNav.tsx       # Navigation mobile
│   │   │   └── Footer.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ProgressCircle.tsx
│   │   │   ├── PatrimoineChart.tsx
│   │   │   └── RecommendationCard.tsx
│   │   ├── ai-coach/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── SuggestionChips.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── objectifs/
│   │   │   ├── ObjectifCard.tsx
│   │   │   ├── Timeline.tsx
│   │   │   └── CreateObjectifModal.tsx
│   │   ├── simulateurs/
│   │   │   ├── shared/
│   │   │   │   ├── ResultsDisplay.tsx
│   │   │   │   └── InputForm.tsx
│   │   │   ├── ImpotCalculator.tsx
│   │   │   ├── ImmobilierCalculator.tsx
│   │   │   └── RetraiteCalculator.tsx
│   │   └── onboarding/
│   │       ├── StepIndicator.tsx
│   │       ├── ChatbotOnboarding.tsx
│   │       └── ProfileSummary.tsx
│   │
│   ├── lib/                         # Logique métier et utilitaires
│   │   ├── api/
│   │   │   ├── openai.ts           # Configuration OpenAI
│   │   │   ├── client.ts           # API client
│   │   │   └── endpoints.ts        # Définition des endpoints
│   │   ├── auth/
│   │   │   ├── auth-options.ts     # NextAuth configuration
│   │   │   └── session.ts
│   │   ├── ai/
│   │   │   ├── prompts/            # Prompts système
│   │   │   │   ├── swiss-context.ts
│   │   │   │   ├── tax-advisor.ts
│   │   │   │   └── investment-coach.ts
│   │   │   ├── context-builder.ts  # Construction du contexte IA
│   │   │   └── response-parser.ts
│   │   ├── calculators/            # Logique des simulateurs
│   │   │   ├── impots/
│   │   │   │   ├── federal.ts
│   │   │   │   ├── cantonal.ts
│   │   │   │   └── deductions.ts
│   │   │   ├── immobilier.ts
│   │   │   ├── retraite.ts
│   │   │   └── investissement.ts
│   │   ├── data/                   # Données statiques Suisse
│   │   │   ├── cantons.ts
│   │   │   ├── tax-rates.ts
│   │   │   ├── piliers.ts
│   │   │   └── financial-laws.ts
│   │   ├── db/
│   │   │   ├── prisma.ts
│   │   │   └── redis.ts
│   │   ├── services/               # Services métier
│   │   │   ├── user.service.ts
│   │   │   ├── recommendation.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── objectif.service.ts
│   │   │   └── simulation.service.ts
│   │   └── utils/
│   │       ├── formatters.ts
│   │       ├── validators.ts
│   │       └── calculations.ts
│   │
│   ├── hooks/                       # React hooks personnalisés
│   │   ├── useUser.ts
│   │   ├── useUserContext.ts      # Hook central pour le contexte
│   │   ├── useAIChat.ts
│   │   ├── useSimulation.ts
│   │   └── useNotifications.ts
│   │
│   ├── stores/                     # État global Zustand
│   │   ├── userStore.ts           # État utilisateur
│   │   ├── chatStore.ts           # État du chat
│   │   ├── simulationStore.ts     # Résultats des simulations
│   │   └── notificationStore.ts
│   │
│   ├── types/                      # TypeScript types
│   │   ├── user.ts
│   │   ├── financial.ts
│   │   ├── objectives.ts
│   │   ├── simulations.ts
│   │   ├── swiss.ts               # Types spécifiques Suisse
│   │   └── api.ts
│   │
│   └── middleware/
│       ├── auth.ts                # Protection des routes
│       └── rateLimit.ts           # Rate limiting
│
├── prisma/
│   ├── schema.prisma              # Schéma de base de données
│   ├── migrations/
│   └── seed.ts                    # Données initiales
│
├── public/
│   ├── images/
│   ├── icons/
│   └── locales/                   # Traductions FR/DE/IT/EN
│
├── tests/
│   ├── unit/
│   │   ├── calculators/
│   │   └── services/
│   ├── integration/
│   └── e2e/
│
├── .env.example                    # Variables d'environnement
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Modules Clés et leurs Responsabilités

### 1. Service UserContext (Central)
```typescript
// src/lib/services/user-context.service.ts
export class UserContextService {
  // Centralise toutes les données utilisateur
  async buildFullContext(userId: string): Promise<UserContext> {
    const [profile, simulations, objectifs, recommendations] = await Promise.all([
      this.getUserProfile(userId),
      this.getRecentSimulations(userId),
      this.getObjectifs(userId),
      this.getRecommendations(userId)
    ]);
    
    return {
      profile,
      financialSnapshot: this.calculateSnapshot(profile, simulations),
      objectifs,
      recommendations,
      notifications: await this.getPendingNotifications(userId)
    };
  }
}
```

### 2. AI Context Builder
```typescript
// src/lib/ai/context-builder.ts
export class AIContextBuilder {
  constructor(private userContextService: UserContextService) {}
  
  async buildAIContext(userId: string): Promise<string> {
    const context = await this.userContextService.buildFullContext(userId);
    
    return `
      CONTEXTE UTILISATEUR:
      Canton: ${context.profile.canton}
      Âge: ${context.profile.age}
      Situation: ${context.profile.situationFamiliale}
      Revenus: ${context.profile.revenuNetMensuel} CHF/mois
      
      OBJECTIFS ACTUELS:
      ${context.objectifs.map(o => `- ${o.nom}: ${o.progression}%`).join('\n')}
      
      DONNÉES FISCALES ${context.profile.canton}:
      - Barème: ${this.getTaxRate(context.profile.canton)}
      - Déductions: ${this.getDeductions(context.profile.canton)}
      
      RECOMMANDATIONS ACTIVES:
      ${context.recommendations.map(r => r.message).join('\n')}
    `;
  }
}
```

### 3. Recommendation Engine
```typescript
// src/lib/services/recommendation.service.ts
export class RecommendationService {
  async analyzeAndRecommend(userId: string): Promise<Recommendation[]> {
    const context = await this.userContextService.buildFullContext(userId);
    const recommendations: Recommendation[] = [];
    
    // Analyse multi-critères
    const analyses = await Promise.all([
      this.analyzeEmergencyFund(context),
      this.analyzeTaxOptimization(context),
      this.analyzeRetirementPlanning(context),
      this.analyzeInvestmentStrategy(context)
    ]);
    
    // Fusion et priorisation
    return this.prioritizeRecommendations(analyses.flat());
  }
}
```

### 4. Simulation Hub
```typescript
// src/lib/services/simulation.service.ts
export class SimulationService {
  // Point central pour toutes les simulations
  async runSimulation(
    type: SimulationType,
    userId: string,
    params: any
  ): Promise<SimulationResult> {
    const context = await this.userContextService.buildFullContext(userId);
    
    const result = await this.simulators[type].calculate(params, context);
    
    // Sauvegarde pour l'historique et le chatbot
    await this.saveResult(userId, type, result);
    
    // Déclenche l'analyse de recommandations
    await this.recommendationService.analyzeSimulation(userId, result);
    
    return result;
  }
}
```

### 5. Notification Orchestrator
```typescript
// src/lib/services/notification.service.ts
export class NotificationService {
  async processUserEvents(userId: string, event: UserEvent) {
    const handlers = {
      OBJECTIF_CREATED: this.handleObjectifCreated,
      SIMULATION_COMPLETED: this.handleSimulationCompleted,
      MILESTONE_REACHED: this.handleMilestoneReached
    };
    
    await handlers[event.type]?.(userId, event.data);
  }
}
```

## Flux de Données Critiques

### Onboarding → Profil Complet
```
1. Chatbot collecte les données
2. Validation et enrichissement
3. Création du UserProfile
4. Génération des recommandations initiales
5. Configuration du dashboard personnalisé
```

### Chat IA → Action
```
1. Question utilisateur
2. Construction du contexte complet
3. Appel OpenAI avec contexte suisse
4. Parsing de la réponse
5. Déclenchement d'actions (navigation, simulation, etc.)
```

### Simulation → Optimisation
```
1. Paramètres de simulation
2. Calcul avec contexte utilisateur
3. Sauvegarde des résultats
4. Analyse par le recommendation engine
5. Notification des opportunités
```

## Points d'Intégration OpenAI

1. **Onboarding Chatbot**: Questions naturelles et adaptatives
2. **AI Coach**: Réponses contextualisées avec données suisses
3. **Génération de contenu**: Articles personnalisés dans Academy
4. **Analyse documentaire**: OCR et extraction de données fiscales
5. **Recommandations intelligentes**: Analyse prédictive des besoins