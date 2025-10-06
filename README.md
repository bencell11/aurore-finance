# 🌅 Aurore Finance

**Votre conseiller financier personnel et intelligent, spécialisé dans le système suisse.**

Aurore Finance est une plateforme complète de conseil financier personnel powered by AI, conçue spécifiquement pour le marché suisse. Elle combine intelligence artificielle avancée, simulateurs précis et expertise locale pour optimiser votre situation financière.

## ✨ Fonctionnalités

### 🤖 Coach IA Personnalisé
- **Conseils contextualisés** : IA experte du système financier suisse
- **Accès aux données utilisateur** : Recommandations basées sur votre profil complet
- **Actions intelligentes** : Suggestions de simulations et actions concrètes
- **Chat 24/7** : Disponible à tout moment pour vos questions

### 📊 Simulateurs Spécialisés Suisse
- **Impôts** : Calcul fédéral + cantonal avec toutes les déductions
- **Immobilier** : Capacité d'achat et financement optimal
- **Retraite** : Planification avec les 3 piliers suisses
- **Investissement** : Stratégies adaptées à votre profil de risque

### 🎯 Gestion d'Objectifs
- Objectifs financiers personnalisés
- Suivi de progression en temps réel
- Rappels et notifications automatiques
- Timeline et échéances

### 📈 Dashboard Complet
- Vue d'ensemble de votre patrimoine
- Analyses de performance
- Projections futures
- Alertes et opportunités

## 🛠 Stack Technique

### Frontend
- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité du typage
- **Tailwind CSS** + **shadcn/ui** pour un design professionnel
- **Zustand** pour la gestion d'état globale
- **React Query** pour le cache et la synchronisation

### Backend & IA
- **Next.js API Routes** 
- **OpenAI GPT-4** avec prompts contextualisés Suisse
- **Prisma** ORM avec PostgreSQL
- **NextAuth.js** pour l'authentification

### Données & Services
- **Base de données fiscales suisses** complète (26 cantons)
- **Système de contexte utilisateur** pour personnalisation IA
- **Architecture sécurisée** avec chiffrement des données sensibles

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- PostgreSQL
- Compte OpenAI avec accès API

### Configuration

1. **Cloner le projet**
```bash
git clone <repository-url>
cd aurore-finance
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

Remplir les variables dans `.env.local` :
```env
# Application
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/aurore_finance"
```

4. **Base de données**
```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables
npm run db:push

# (Optionnel) Interface d'administration
npm run db:studio
```

5. **Lancer en développement**
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
aurore-finance/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Routes protégées
│   ├── (public)/                 # Routes publiques
│   ├── api/                      # API Routes
│   ├── demo/                     # Page de démonstration
│   └── layout.tsx
├── components/                   # Composants réutilisables
│   ├── ui/                       # Composants shadcn/ui
│   ├── ai-coach/                 # Interface chatbot IA
│   ├── layout/                   # Navigation, Header, Footer
│   └── dashboard/                # Composants dashboard
├── lib/                          # Logique métier
│   ├── ai/                       # Services IA et contexte
│   ├── services/                 # Services métier
│   ├── data/                     # Données statiques Suisse
│   └── utils/                    # Utilitaires
├── types/                        # Types TypeScript
├── hooks/                        # React hooks personnalisés
└── stores/                       # État global Zustand
```

## 🎯 Fonctionnalités Clés de l'IA

### Système de Contexte Utilisateur
L'IA a accès à un contexte complet de l'utilisateur :
- **Profil financier** : Revenus, patrimoine, charges
- **Situation personnelle** : Canton, âge, famille
- **Objectifs** : Projets et priorités financières
- **Historique** : Simulations et recommandations passées

### Prompts Contextualisés
```typescript
// Exemple de contexte envoyé à l'IA
const systemPrompt = `
Tu es un conseiller financier expert en Suisse.

CONTEXTE UTILISATEUR:
- Canton: ${profile.canton}
- Revenus: ${profile.revenuNetMensuel} CHF/mois
- Taux d'imposition: ${snapshot.tauxImposition}%

FISCALITÉ ${cantonData.nom}:
- Déductions: ${cantonData.deductions}
- Barèmes: ${cantonData.baremes}
`;
```

### Actions Intelligentes
L'IA peut déclencher des actions concrètes :
- `[SIMULATE:impots]` → Lance le simulateur d'impôts
- `[NAVIGATE:objectifs]` → Redirige vers la gestion d'objectifs
- `[REMINDER:pilier3a]` → Programme un rappel 3e pilier

## 💡 Exemples d'Usage

### Questions Types
- **Fiscalité** : "Comment optimiser mes impôts dans le canton de Genève ?"
- **Immobilier** : "Puis-je acheter un appartement à 800'000 CHF ?"
- **Retraite** : "Comment planifier ma retraite à 55 ans ?"
- **Épargne** : "Combien devrais-je épargner chaque mois ?"

### Réponses Contextualisées
L'IA fournit des conseils précis basés sur :
- La fiscalité spécifique à votre canton
- Votre situation familiale et professionnelle
- Vos objectifs et votre profil de risque
- Les montants maximaux légaux (ex: 3e pilier A = 7'056 CHF)

## 🔐 Sécurité

- **Chiffrement AES-256** pour les données sensibles
- **Authentification NextAuth.js** avec 2FA
- **Conformité RGPD/LPD** suisse
- **Isolation des données** par utilisateur
- **Rate limiting** sur les API IA

## 📊 Données Suisses Intégrées

### Fiscalité par Canton (26 cantons)
- Barèmes d'imposition fédéraux et cantonaux
- Déductions standard par situation familiale
- Montants maximaux 3e pilier
- Règles spécifiques par canton

### Prévoyance
- 1er pilier : AVS/AI
- 2e pilier : LPP avec projections
- 3e pilier A/B : Optimisation fiscale

### Immobilier
- Fonds propres minimum (20%)
- Charges théoriques (33% max)
- Amortissement obligatoire
- Taux hypothécaires par région

## 🚀 Déploiement

### Production
1. Configurer les variables d'environnement
2. Build de production : `npm run build`
3. Démarrer : `npm start`

### Recommandations
- **Vercel** : Déploiement optimal pour Next.js
- **Supabase** : Base de données PostgreSQL managée
- **Redis Cloud** : Cache et sessions
- **Sentry** : Monitoring d'erreurs

## 📈 Roadmap

### Phase 1 : MVP ✅
- [x] Landing page professionnelle
- [x] Système d'IA avec contexte utilisateur
- [x] Données fiscales suisses complètes
- [x] Interface chatbot
- [x] Architecture sécurisée

### Phase 2 : Fonctionnalités Core (Q2 2024)
- [ ] Système d'authentification complet
- [ ] Dashboard utilisateur personnalisé
- [ ] Simulateurs avancés (impôts, immobilier, retraite)
- [ ] Gestion d'objectifs financiers

### Phase 3 : Social & Communauté (Q3 2024)
- [ ] Forum communautaire
- [ ] Partage d'expériences
- [ ] Défis financiers
- [ ] Système de notation et badges

### Phase 4 : Premium & IA Avancée (Q4 2024)
- [ ] Analyse documentaire (OCR)
- [ ] Recommandations prédictives
- [ ] Intégration bancaire
- [ ] Conseiller humain premium

## 🤝 Contribution

Ce projet est en développement actif. Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Projet propriétaire - Tous droits réservés © 2024 Aurore Finance

## 📞 Contact

- **Site web** : [aurorefinances.ch](https://aurorefinances.ch)
- **Email** : hello@aurorefinances.ch

---

**Développé avec ❤️ pour optimiser les finances personnelles en Suisse**
