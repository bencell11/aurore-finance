# Phase 2 - Recherche Immobilière : Intégration de Données Réelles

## Vue d'ensemble

La Phase 2 intègre des données immobilières réelles provenant des principales plateformes suisses (ImmoScout24, Homegate, Comparis) via l'API Apify, tout en conservant le système IA de la Phase 1 comme fallback.

## Architecture Hybride

### Stratégies de Recherche

Le système utilise 3 stratégies automatiques :

1. **`real-only`** : Uniquement des données réelles (si ≥5 résultats trouvés)
2. **`hybrid`** : Combinaison de données réelles et IA (si <5 résultats réels)
3. **`ai-only`** : Uniquement IA (si Apify non configuré ou échec du scraping)

### Flux de Recherche

```
Requête utilisateur
    ↓
Cache vérifié (TTL: 30 min)
    ↓
Si cache trouvé → Retour immédiat
    ↓
Sinon:
    Apify configuré ?
        ↓ Oui
        Scraping ImmoScout24 + Homegate
            ↓
            ≥5 résultats ? → real-only
            <5 résultats ? → hybrid (compléter avec IA)
            Échec ? → ai-only (fallback)
        ↓ Non
        ai-only (génération IA)
    ↓
Enrichissement affordabilité (si revenu fourni)
    ↓
Tri par pertinence
    ↓
Mise en cache
    ↓
Retour résultats
```

## Services Créés

### 1. `ApifyIntegrationService`

**Fichier** : `lib/services/real-estate/apify-integration.service.ts`

**Fonctionnalités** :
- Scraping ImmoScout24.ch via Apify
- Scraping Homegate.ch via Apify
- Construction automatique des URLs de recherche
- Transformation des données en format `Property` unifié
- Déduplication des résultats
- Gestion des timeouts et erreurs

**Méthodes principales** :
```typescript
// Recherche sur une plateforme
static async searchImmoScout24(criteria: PropertySearchCriteria): Promise<Property[]>
static async searchHomegate(criteria: PropertySearchCriteria): Promise<Property[]>

// Recherche combinée sur toutes les plateformes
static async searchAllPlatforms(criteria: PropertySearchCriteria): Promise<Property[]>

// Vérifier si l'API est configurée
static isConfigured(): boolean
```

### 2. `DataEnrichmentService`

**Fichier** : `lib/services/real-estate/data-enrichment.service.ts`

**Fonctionnalités** :
- Recherche hybride intelligente (réel + IA)
- Enrichissement avec scores d'affordabilité
- Système de cache en mémoire (TTL configurable)
- Tri automatique par pertinence
- Évaluation de la qualité des données

**Méthodes principales** :
```typescript
// Recherche hybride principale
static async hybridSearch(
  userQuery: string,
  criteria?: PropertySearchCriteria,
  userIncome?: number,
  preferReal?: boolean
): Promise<EnrichedSearchResult>

// Gestion du cache
static async cacheSearchResults(cacheKey: string, results: EnrichedSearchResult, ttl: number)
static async getCachedResults(cacheKey: string): Promise<EnrichedSearchResult | null>
static generateCacheKey(query: string, criteria?: PropertySearchCriteria, userIncome?: number): string

// Enrichissement de données
static async enrichProperty(property: Property): Promise<Property>
```

### 3. API `/api/real-estate/search` (Modifiée)

**Fonctionnalités** :
- Recherche hybride avec cache automatique
- Paramètres optionnels pour contrôler le comportement

**Payload** :
```json
{
  "query": "Appartement 3.5 pièces Genève",
  "userIncome": 8000,
  "useRealData": true,    // Optionnel (défaut: true)
  "useCache": true        // Optionnel (défaut: true)
}
```

**Response** :
```json
{
  "success": true,
  "query": "Appartement 3.5 pièces Genève",
  "cached": false,
  "properties": [...],
  "sources": {
    "real": 3,
    "ai": 2,
    "total": 5
  },
  "searchStrategy": "hybrid",
  "timestamp": "2025-10-12T19:00:00.000Z"
}
```

## Interface Utilisateur (Modifiée)

### Badges de Source

Chaque propriété affiche maintenant un badge indiquant sa source :

- 🟢 **Données réelles** : `ImmoScout24`, `Homegate`, `Comparis`
- 🟣 **IA** : Propriétés générées par intelligence artificielle

### Badge de Stratégie

En haut des résultats, un badge global indique la stratégie utilisée :

- 🟢 **Données réelles** : Tous les résultats sont réels
- 🔵 **Hybride (réel + IA)** : Mélange de données réelles et IA, avec détail du nombre
- 🟣 **Généré par IA** : Tous les résultats sont générés par IA

## Configuration

### Variables d'Environnement

**Fichier** : `.env.local`

```bash
# Apify API - Pour scraping des plateformes immobilières (ImmoScout24, Homegate)
# Optionnel: si non configuré, utilise uniquement l'IA
APIFY_API_TOKEN=your_apify_api_token_here
```

### Obtenir un Token Apify

1. Créer un compte sur [apify.com](https://apify.com)
2. Aller dans Settings → Integrations → API tokens
3. Créer un nouveau token
4. L'ajouter dans `.env.local`

### Scrapers Apify Requis

Pour utiliser les données réelles, vous devez configurer ces scrapers Apify :

- **ImmoScout24 Scraper** : [Voir sur Apify Store](https://apify.com/search?q=immoscout24)
- **Homegate Scraper** : [Voir sur Apify Store](https://apify.com/search?q=homegate)

**Note** : Les IDs d'actors dans `apify-integration.service.ts` doivent être mis à jour avec les IDs réels des scrapers que vous utilisez.

## Coûts et Performance

### Coûts Apify

- **Prix** : ~$49-149/mois selon l'utilisation
- **Alternative gratuite** : Limites d'utilisation gratuites disponibles pour testing

### Performance

- **Cache TTL** : 30 minutes (configurable)
- **Timeout scraping** : 60 secondes (configurable)
- **Fallback automatique** : Si scraping échoue, utilise l'IA

### Optimisations

1. **Cache agressif** : Réduit les appels Apify et améliore la vitesse
2. **Déduplication** : Évite les doublons entre plateformes
3. **Stratégie hybride** : Complète avec IA seulement si nécessaire
4. **Timeout rapide** : Fallback sur IA si le scraping prend trop de temps

## Utilisation

### Mode AI-Only (Par défaut sans configuration Apify)

```typescript
// L'application fonctionne normalement sans configuration Apify
// Utilise uniquement l'IA pour générer des propriétés réalistes
```

### Mode Real Data (Avec Apify configuré)

```typescript
// Ajouter APIFY_API_TOKEN dans .env.local
// Le système détecte automatiquement et utilise les données réelles
```

### Mode Hybride Forcé

```typescript
// L'API combine automatiquement réel + IA si <5 résultats réels
// Pas de configuration supplémentaire nécessaire
```

## Tests

### Test sans Apify (AI-only)

1. S'assurer que `APIFY_API_TOKEN` n'est PAS dans `.env.local`
2. Aller sur `/recherche-biens`
3. Chercher "Appartement 3.5 pièces Genève"
4. Vérifier le badge 🟣 "Généré par IA"

### Test avec Apify (Real data)

1. Configurer `APIFY_API_TOKEN` dans `.env.local`
2. Configurer les IDs des scrapers dans `apify-integration.service.ts`
3. Aller sur `/recherche-biens`
4. Chercher "Appartement 3.5 pièces Genève"
5. Vérifier les badges 🟢 "ImmoScout24" ou "Homegate"

### Test du Cache

1. Faire une recherche
2. Vérifier dans les logs : `[DataEnrichment] Cache miss`
3. Refaire la même recherche dans les 30 minutes
4. Vérifier dans les logs : `[DataEnrichment] Cache hit`

## Logs de Débogage

Le système log chaque étape :

```
[API real-estate/search] Query: Appartement 3.5 pièces Genève
[API real-estate/search] User income: 8000
[API real-estate/search] Use real data: true
[DataEnrichment] Attempting real data search...
[Apify] API token not configured, skipping ImmoScout24 scraping
[Apify] API token not configured, skipping Homegate scraping
[DataEnrichment] Using AI-only search (Apify not configured)
[DataEnrichment] Search completed in 2340ms - Strategy: ai-only
```

## Prochaines Étapes (Phase 3)

La Phase 3 inclura :

- ✅ Carte interactive avec markers de propriétés (Leaflet/Google Maps)
- ✅ Filtres avancés (type, prix, surface, etc.)
- ✅ Comparateur de propriétés côte-à-côte
- ✅ Simulation de crédit hypothécaire intégrée
- ✅ Calcul complet des implications fiscales
- ✅ Système d'alertes pour nouvelles annonces
- ✅ Favoris et propriétés sauvegardées
- ✅ Historique des prix et tendances du marché
- ✅ Analyses de marché par quartier/ville

## Support

Pour toute question ou problème :

1. Vérifier les logs dans la console du navigateur et du serveur
2. Vérifier que les variables d'environnement sont correctement configurées
3. Vérifier les IDs des scrapers Apify dans `apify-integration.service.ts`
4. Tester d'abord en mode AI-only avant d'ajouter Apify

## Architecture Technique

### Structure des Fichiers

```
lib/
  services/
    real-estate/
      apify-integration.service.ts      # Scraping Apify
      data-enrichment.service.ts        # Logique hybride + cache
      affordability.service.ts          # Calculs financiers (Phase 1)
      ai-property-generator.service.ts  # Génération IA (Phase 1)
  types/
    real-estate.ts                       # Types TypeScript

app/
  api/
    real-estate/
      search/
        route.ts                         # API hybride modifiée
      affordability/
        route.ts                         # API affordabilité (Phase 1)
  recherche-biens/
    page.tsx                             # Interface utilisateur modifiée

docs/
  REAL_ESTATE_PHASE_2.md                # Cette documentation
```

### Diagramme de Flux

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/real-estate/search
       ↓
┌─────────────────────────────────┐
│   DataEnrichmentService         │
│   ┌─────────────────────────┐   │
│   │ 1. Check Cache          │   │
│   │    ↓ Miss               │   │
│   │ 2. Apify configured?    │   │
│   │    ↓ Yes                │   │
│   │ 3. Scrape platforms     │   │
│   │    ↓                    │   │
│   │ 4. ≥5 results?          │   │
│   │    ↓ No                 │   │
│   │ 5. Generate AI props    │   │
│   │    ↓                    │   │
│   │ 6. Enrich affordability │   │
│   │    ↓                    │   │
│   │ 7. Sort by relevance    │   │
│   │    ↓                    │   │
│   │ 8. Cache results        │   │
│   └─────────────────────────┘   │
└─────────────┬───────────────────┘
              ↓
      ┌───────────────┐
      │   Response    │
      │ • properties  │
      │ • sources     │
      │ • strategy    │
      └───────────────┘
```

## Conclusion

La Phase 2 transforme le système de recherche immobilière en une solution hybride professionnelle, combinant la fiabilité des données réelles avec la flexibilité de l'IA. Le système s'adapte automatiquement aux conditions (API disponible ou non) et optimise les coûts grâce au cache intelligent.
