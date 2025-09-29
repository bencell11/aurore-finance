# Architecture Aurore Finance

## Vue d'ensemble
Application web financière avec IA intégrée, spécialisée dans le contexte suisse (fiscalité, prévoyance, immobilier).

## Stack Technique

### Frontend
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité du typage
- **Tailwind CSS** + **shadcn/ui** pour l'UI professionnelle
- **Zustand** pour la gestion d'état globale
- **React Query** pour le cache et la synchronisation des données

### Backend
- **Next.js API Routes** 
- **Prisma** ORM avec **PostgreSQL**
- **NextAuth.js** pour l'authentification
- **OpenAI API** pour le chatbot IA
- **Redis** pour le cache et les sessions

### Services Externes
- **Supabase** pour la base de données et l'authentification temps réel
- **OpenAI GPT-4** avec fine-tuning sur données suisses
- **Stripe** pour les abonnements Premium
- **SendGrid** pour les emails transactionnels

## Architecture des Données

### 1. Modèle Utilisateur Central
```typescript
interface UserProfile {
  id: string;
  // Données personnelles
  email: string;
  age: number;
  canton: Canton;
  situationFamiliale: 'celibataire' | 'marie' | 'divorce' | 'veuf';
  nombreEnfants: number;
  
  // Données financières
  revenuNetMensuel: number;
  chargesFixes: number;
  patrimoine: {
    cash: number;
    investissements: number;
    immobilier: number;
    prevoyance: {
      pilier2: number;
      pilier3a: number;
      pilier3b: number;
    };
  };
  
  // Objectifs et préférences
  objectifs: Objectif[];
  niveauConnaissance: 'debutant' | 'intermediaire' | 'avance';
  priorites: string[];
  
  // Métadonnées
  dateCreation: Date;
  derniereMiseAJour: Date;
  abonnement: 'free' | 'premium';
}
```

### 2. Contexte Partagé (UserContext)
```typescript
interface UserContext {
  profile: UserProfile;
  financialSnapshot: {
    tauxImposition: number;
    capaciteEpargne: number;
    scoreFinancier: number;
    risqueProfile: 'conservateur' | 'modere' | 'dynamique';
  };
  recommendations: Recommendation[];
  notifications: Notification[];
}
```

## Interconnexions des Modules

### 1. Chatbot IA Coach
**Accès aux données:**
- Profil utilisateur complet via `UserContext`
- Historique des objectifs
- Données des simulateurs
- Contenu de l'Academy

**Enrichissement contextuel:**
```typescript
class AICoachService {
  async generateResponse(message: string, userId: string) {
    const context = await this.buildContext(userId);
    
    const systemPrompt = `
      Tu es un conseiller financier expert en Suisse.
      
      Contexte utilisateur:
      - Canton: ${context.profile.canton}
      - Âge: ${context.profile.age}
      - Revenus: ${context.profile.revenuNetMensuel} CHF/mois
      - Objectifs: ${context.profile.objectifs}
      - Taux d'imposition estimé: ${context.financialSnapshot.tauxImposition}%
      
      Règles:
      1. Toujours considérer la fiscalité du canton ${context.profile.canton}
      2. Mentionner les 3 piliers de prévoyance suisse
      3. Utiliser les montants maximaux déductibles actuels
      4. Adapter le niveau de complexité au profil (${context.profile.niveauConnaissance})
    `;
    
    return await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });
  }
}
```

### 2. Dashboard Personnalisé
**Sources de données:**
- `UserProfile` pour les informations de base
- `ObjectifService` pour la progression
- `SimulateurService` pour les projections
- `AICoachService` pour le conseil de la semaine

### 3. Simulateurs
**Interconnexions:**
```typescript
class SimulateurImpots {
  async calculer(userId: string) {
    const user = await getUserProfile(userId);
    const deductions = await this.getDeductionsCanton(user.canton);
    
    // Partage les résultats avec le chatbot
    await this.saveSimulation(userId, results);
    
    // Déclenche une recommandation
    await recommendationService.analyze(userId, 'impots', results);
  }
}
```

### 4. Système de Recommandations
```typescript
class RecommendationEngine {
  async generateRecommendations(userId: string) {
    const user = await getUserProfile(userId);
    const simulations = await getRecentSimulations(userId);
    const objectifs = await getObjectifs(userId);
    
    // Analyse croisée
    const recommendations = [];
    
    // Exemple: Si proche de la retraite et pas de 3e pilier
    if (user.age > 50 && !user.patrimoine.prevoyance.pilier3a) {
      recommendations.push({
        type: 'urgent',
        category: 'prevoyance',
        message: 'Maximiser vos versements 3a avant la retraite',
        action: () => navigateToSimulateur('3eme-pilier')
      });
    }
    
    return recommendations;
  }
}
```

## Flux de Données

### 1. Onboarding → Profil
```mermaid
Onboarding (Chatbot) → UserProfile → UserContext → Tous les modules
```

### 2. Simulation → Recommandations
```mermaid
Simulateur → Résultats → RecommendationEngine → Dashboard/Chatbot
```

### 3. Objectifs → Notifications
```mermaid
Objectif créé → Timeline générée → Notifications programmées → Push/Email
```

## Base de Données Suisse

### Données Fiscales par Canton
```typescript
interface CantonData {
  nom: string;
  baremesImpots: BaremeImpot[];
  deductionsStandard: {
    celibataire: number;
    marie: number;
    parEnfant: number;
  };
  pilier3aMax: number;
  fraisGarde: number;
}
```

### Données Immobilières
```typescript
interface DonneesImmobilieres {
  canton: string;
  tauxHypotheque: {
    fixe5ans: number;
    fixe10ans: number;
    saron: number;
  };
  fondsPropreMin: number; // 20% standard
  chargesEntretien: number; // 1% de la valeur
}
```

## Sécurité et Conformité

### 1. Protection des Données
- Chiffrement AES-256 pour les données sensibles
- RGPD/LPD compliant
- Authentification à deux facteurs obligatoire

### 2. Isolation des Données
```typescript
class DataAccessLayer {
  async getUserData(requesterId: string, targetUserId: string) {
    // Vérification des permissions
    if (requesterId !== targetUserId && !isAdmin(requesterId)) {
      throw new UnauthorizedError();
    }
    
    // Masquage des données sensibles selon le contexte
    return this.sanitizeData(await getUser(targetUserId));
  }
}
```

## Services IA Spécialisés

### 1. Fine-tuning Fiscal Suisse
```typescript
const swissTaxContext = {
  "impot_federal_direct": {
    "taux": "progressif jusqu'à 11.5%",
    "deductions": ["frais professionnels", "3e pilier", "enfants"]
  },
  "cantons": {
    // Données spécifiques par canton
  }
};
```

### 2. Analyse Documentaire
- OCR pour les déclarations d'impôts
- Extraction automatique des montants
- Suggestions d'optimisation

## API Gateway

### Structure des Endpoints
```typescript
// Authentification
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

// Profil utilisateur
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/context

// IA Coach
POST   /api/ai/chat
GET    /api/ai/recommendations
POST   /api/ai/analyze-document

// Simulateurs
POST   /api/simulateurs/impots
POST   /api/simulateurs/immobilier
POST   /api/simulateurs/retraite
POST   /api/simulateurs/investissement

// Objectifs
GET    /api/objectifs
POST   /api/objectifs
PUT    /api/objectifs/:id
DELETE /api/objectifs/:id

// Communauté
GET    /api/community/posts
POST   /api/community/posts
GET    /api/community/posts/:id/comments

// Academy
GET    /api/academy/courses
GET    /api/academy/progress
POST   /api/academy/complete
```

## État Global (Zustand)

```typescript
interface AppState {
  user: UserProfile | null;
  context: UserContext | null;
  
  // Actions
  setUser: (user: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Données en cache
  simulations: SimulationResult[];
  recommendations: Recommendation[];
  
  // UI State
  activeTab: TabName;
  isOnboarding: boolean;
  
  // Temps réel
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}
```

## Événements et Notifications

### 1. Système d'Événements
```typescript
enum EventType {
  OBJECTIF_ATTEINT = 'OBJECTIF_ATTEINT',
  NOUVELLE_RECOMMANDATION = 'NOUVELLE_RECOMMANDATION',
  RAPPEL_ECHEANCE = 'RAPPEL_ECHEANCE',
  DOCUMENT_ANALYSE = 'DOCUMENT_ANALYSE'
}

class EventBus {
  emit(event: EventType, data: any) {
    // Notification push
    // Update dashboard
    // Log analytics
  }
}
```

### 2. Scheduler pour Rappels
```typescript
class ReminderService {
  async scheduleReminders(userId: string) {
    const user = await getUserProfile(userId);
    
    // Rappels 3e pilier (avant fin d'année)
    if (new Date().getMonth() === 11) {
      await this.schedule({
        userId,
        type: 'PILIER_3A',
        message: `Il vous reste ${6800 - user.patrimoine.prevoyance.pilier3a} CHF à verser`
      });
    }
  }
}
```

## Performance et Optimisation

### 1. Caching Strategy
- Redis pour les sessions utilisateur
- React Query pour le cache côté client
- CDN pour les ressources statiques

### 2. Optimisation IA
- Cache des réponses similaires
- Batch processing pour les analyses
- Rate limiting par utilisateur

## Monitoring et Analytics

### 1. Métriques Clés
- Taux de complétion onboarding
- Utilisation des simulateurs
- Engagement chatbot
- Progression objectifs

### 2. Error Tracking
- Sentry pour les erreurs
- LogRocket pour les sessions utilisateur
- Custom analytics pour les métriques business