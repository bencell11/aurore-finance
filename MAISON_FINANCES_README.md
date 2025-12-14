# 🏠 La Maison des Finances - Documentation

## Vue d'ensemble

La **Maison des Finances** est un système complet de gestion financière personnelle qui permet aux utilisateurs de visualiser et d'optimiser leur santé financière à travers une métaphore architecturale intuitive.

## Architecture Conceptuelle

La maison est divisée en plusieurs niveaux représentant différents aspects de votre vie financière:

### 🏗️ Structure de la Maison

```
🔴 TOITURE (Optimisation)
├── Fiscalité (calculs automatiques d'impôts)
└── Juridique (documents et protection)

🟠 COMBLES (Développement)
├── Immobilier (propriété et projets)
└── Budget (revenus et dépenses détaillés)

🟡 ÉTAGE 1 (Planification)
├── Vieillesse (AVS, LPP, 3e pilier)
└── Fortune (patrimoine et placements)

🟢 ÉTAGE 0 (Sécurité - Fondations)
├── Santé (LAMal, LCA)
├── Revenu (sources de revenus)
└── Biens (RC, assurance ménage, véhicules)
```

## 📊 Système de Scores

Chaque section dispose d'un **score de santé financière de 0 à 100**:

- **0-40**: 🔴 Critique - Action immédiate requise
- **41-65**: 🟠 Attention - Améliorations nécessaires
- **66-85**: 🟢 Bon - Situation stable
- **86-100**: 🎯 Excellent - Optimisation maximale

## 🗂️ Structure des Fichiers

### Types TypeScript
```
lib/types/maison-finances.ts
├── MaisonDesFinancesData (type principal)
├── SanteData, RevenuData, BiensData
├── VieillesseData, FortuneData
├── ImmobilierData, BudgetData
├── FiscaliteData, JuridiqueData
└── IndicateurSante, MaisonConfig
```

### Composants
```
components/dashboard/
├── MaisonDesFinances.tsx          # Composant principal de visualisation
└── forms/
    ├── SanteForm.tsx              # Formulaire santé/assurances
    ├── RevenuForm.tsx             # Formulaire revenus
    ├── BiensForm.tsx              # Formulaire biens et couverture
    ├── VieillesseForm.tsx         # Formulaire prévoyance retraite
    ├── FortuneForm.tsx            # Formulaire fortune/patrimoine
    ├── ImmobilierForm.tsx         # Formulaire immobilier
    ├── BudgetForm.tsx             # Formulaire budget détaillé
    ├── FiscaliteForm.tsx          # Formulaire fiscalité
    └── JuridiqueForm.tsx          # Formulaire juridique
```

### Base de Données Supabase
```
supabase/migrations/create_maison_finances.sql
├── maison_finances (table principale)
├── sante_data
├── revenu_data
├── biens_data
├── vieillesse_data
├── fortune_data
├── immobilier_data
├── budget_data
├── fiscalite_data
└── juridique_data
```

## 🚀 Utilisation

### 1. Accès au Dashboard

Deux options disponibles:

**Option A: Dashboard classique**
```
/dashboard (dashboard existant conservé)
```

**Option B: Dashboard Maison des Finances**
```
/dashboard-maison (nouveau dashboard intégré)
```

### 2. Navigation

1. **Vue Maison**: Visualisation globale avec scores par section
2. **Vue Profil**: Informations utilisateur
3. **Vue Paramètres**: Configuration

### 3. Complétion des Sections

Chaque section suit ce workflow:

```
1. Cliquez sur une section (ex: "Santé")
2. Remplissez le formulaire détaillé
3. Les calculs automatiques se font en temps réel
4. Cliquez sur "Enregistrer et continuer"
5. Le score de santé est calculé automatiquement
6. Passez à la section suivante
```

## 🎯 Fonctionnalités par Section

### 🏥 Santé
- Assurance LAMal (franchise, modèle, prime)
- Assurances complémentaires LCA
- Upload de documents (polices d'assurance)
- État de santé général

### 💰 Revenu
- Statut professionnel (salarié, indépendant)
- Salaires brut/net avec 13ème
- Revenus indépendants (CA, charges, bénéfice)
- Autres revenus (locatifs, placements)
- Situation familiale
- **Calcul automatique**: Total annuel et mensuel

### 🛡️ Biens & Couverture
- RC privée (minimum 5 millions CHF)
- Assurance ménage
- Véhicules (jusqu'à N véhicules)
- Protection juridique
- Objets de valeur

### 📅 Vieillesse
- 1er pilier (AVS avec lacunes)
- 2e pilier (LPP avec rachat)
- 3e pilier A (max 7'056 CHF/an)
- 3e pilier B (libre)
- **Calcul automatique**: Rente estimée à la retraite

### 💎 Fortune
- Liquidités (comptes courants/épargne)
- Placements (actions, obligations, ETF)
- Répartition d'actifs (sliders interactifs)
- Cryptomonnaies
- Métaux précieux
- Dettes (crédits, cartes)
- **Calcul automatique**: Fortune nette

### 🏠 Immobilier
- Statut (propriétaire/locataire)
- Hypothèque (type, taux, amortissement)
- Autres biens immobiliers
- Projet d'achat
- **Calcul automatique**: Capacité d'emprunt, taux d'endettement

### 💳 Budget
- 5 catégories de dépenses:
  1. Logement (25-35% recommandé)
  2. Vie courante (15-25%)
  3. Transports (5-15%)
  4. Santé & Assurances (10-20%)
  5. Épargne & Prévoyance (10-20%)
- **Calcul automatique**: Totaux, pourcentages, solde mensuel

### 💵 Fiscalité
- Canton et commune de résidence
- Revenu et fortune imposables
- Déductions (LPP, 3a, intérêts hypothécaires)
- **Calcul automatique**: Impôts fédéraux, cantonaux, communaux
- **Identification automatique**: Opportunités d'optimisation

### ⚖️ Juridique
- Protection juridique
- Testament et pacte successoral
- Mandat de précaution
- Directives anticipées
- Procurations
- **Calcul automatique**: Score de préparation juridique

## 📐 Calculs Automatiques

Le système effectue de nombreux calculs automatiques:

1. **Revenus totaux**: Agrégation de toutes les sources
2. **Fortune nette**: Actifs - Dettes
3. **Rente retraite**: AVS + LPP estimée
4. **Capacité d'emprunt**: Basée sur la règle des 1/3
5. **Budget**: Totaux par catégorie et pourcentages
6. **Impôts**: Estimation selon canton et barème 2024
7. **Scores de santé**: Pour chaque section (0-100)

## 🔐 Sécurité & Confidentialité

- **Row Level Security (RLS)**: Activé sur toutes les tables
- **Chiffrement**: Données sensibles protégées
- **Authentification**: Via Supabase Auth
- **Isolation**: Chaque utilisateur voit uniquement ses données

## 🎨 UI/UX

### Design System
- **TailwindCSS**: Styling moderne et responsive
- **Shadcn/ui**: Composants réutilisables
- **Radix UI**: Primitives accessibles
- **Lucide Icons**: Icônes cohérentes

### Responsive Design
- Mobile: 1 colonne
- Tablet: 2 colonnes
- Desktop: 3-4 colonnes
- Touch targets: Minimum 44px

## 🔄 Workflow de Développement

### Ajout d'une Nouvelle Section

1. **Créer le type** dans `lib/types/maison-finances.ts`
2. **Créer le formulaire** dans `components/dashboard/forms/`
3. **Ajouter la table SQL** dans `create_maison_finances.sql`
4. **Mettre à jour** `MaisonDesFinances.tsx`
5. **Intégrer** dans `dashboard-maison/page.tsx`

### Ajout d'un Nouveau Champ

1. Ajouter au type TypeScript
2. Ajouter au formulaire
3. Ajouter à la table SQL (migration)
4. Mettre à jour les calculs si nécessaire

## 📊 Formules de Calcul

### Capacité d'Emprunt Immobilier
```typescript
chargeMaxMensuelle = revenuBrutMensuel / 3
tauxCalcul = 5% (conservateur)
amortissement = 1%
capaciteEmprunt = (chargeMax * 12) / (tauxCalcul + amortissement)
```

### Impôts Fédéraux (barème 2024)
```typescript
Progressif selon tranches:
- 0-17'800: 0%
- 17'800-31'600: 0.77%
- ... jusqu'à 13.2% au-delà de 755'200 CHF
```

### Rente LPP Estimée
```typescript
renteLPP = avoirLPP * (tauxConversion / 100)
// Taux légal 2024: 6.8%
```

## 🚧 Évolutions Futures

- [ ] Export PDF complet de la maison
- [ ] Comparaison temporelle (évolution des scores)
- [ ] Objectifs SMART par section
- [ ] Alertes et notifications intelligentes
- [ ] IA pour recommandations personnalisées
- [ ] Simulateur de scénarios (what-if)
- [ ] Intégration bancaire automatique
- [ ] Coach financier virtuel

## 📞 Support

Pour toute question ou suggestion:
- Email: support@aurore-finance.ch
- GitHub: Issues sur le repository

## 📜 Licence

© 2025 Aurore Finance - Tous droits réservés

---

**Version**: 1.0.0
**Date**: Décembre 2025
**Auteurs**: Équipe Aurore Finance + Claude (AI Assistant)
