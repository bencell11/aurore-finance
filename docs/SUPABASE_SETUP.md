# Configuration Supabase pour Aurore Finance

## Vue d'ensemble

Ce guide vous permet de configurer Supabase pour activer l'auto-fill automatique des formulaires sur toutes les pages d'Aurore Finance.

## Étape 1: Créer un projet Supabase

1. Aller sur [https://supabase.com](https://supabase.com)
2. Cliquer sur "Start your project"
3. Se connecter ou créer un compte
4. Cliquer sur "New Project"
5. Remplir les informations:
   - **Name**: `aurore-finance` (ou autre nom)
   - **Database Password**: Choisir un mot de passe sécurisé
   - **Region**: Choisir `Europe (Frankfurt)` ou le plus proche
   - **Pricing Plan**: Free (suffisant pour MVP)

6. Cliquer sur "Create new project"
7. Attendre 2-3 minutes que le projet soit créé

## Étape 2: Récupérer les clés API

1. Dans le projet Supabase, aller dans **Settings** (engrenage en bas à gauche)
2. Cliquer sur **API**
3. Copier les deux valeurs:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: `eyJhbG...` (longue clé)

## Étape 3: Configurer les variables d'environnement

1. Ouvrir le fichier `/aurore-finance/.env.local`
2. Mettre à jour ou ajouter ces lignes:

```bash
# Supabase - Configuration automatique
NEXT_PUBLIC_SUPABASE_URL=https://gldvcudowxielzrpdsxz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsZHZjdWRvd3hpZWx6cnBkc3h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODczOTQ2NCwiZXhwIjoyMDc0MzE1NDY0fQ.0oT_-N5CZEKeaGkAXJUE5UBiMzAMNzJSEOlIsTfNJf4
```

3. **REMPLACER** ces valeurs par celles que vous avez copiées à l'étape 2
4. Sauvegarder le fichier

## Étape 4: Créer les tables dans Supabase

1. Dans Supabase, cliquer sur **SQL Editor** (icône < > dans le menu gauche)
2. Cliquer sur **New query**
3. Copier-coller **tout le contenu** du fichier [lib/supabase/schema.sql](../lib/supabase/schema.sql)
4. Cliquer sur **Run** (bouton en bas à droite)
5. Attendre 2-3 secondes
6. Vérifier qu'il n'y a pas d'erreur (message "Success" en vert)

Si tout est OK, vous devriez voir les messages suivants:
```
CREATE TABLE
CREATE INDEX
CREATE TRIGGER
CREATE FUNCTION
... (plusieurs fois)
Row Level Security enabled
```

## Étape 5: Vérifier les tables créées

1. Cliquer sur **Table Editor** dans le menu gauche
2. Vous devriez voir ces tables:
   - `user_profiles`
   - `financial_goals`
   - `real_estate_favorites`
   - `real_estate_alerts`
   - `generated_documents`
   - `ai_conversations`
   - `mortgage_simulations`

3. Cliquer sur `user_profiles` pour voir la structure

## Étape 6: Tester la connexion

1. Redémarrer le serveur de développement:
```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

2. Ouvrir [http://localhost:3000/profil](http://localhost:3000/profil)

3. Remplir quelques champs (nom, prénom, revenu)

4. Cliquer sur "Sauvegarder"

5. Si vous voyez "Profil sauvegardé avec succès !" → **Tout fonctionne !** ✅

## Étape 7: Vérifier les données dans Supabase

1. Retourner dans Supabase
2. Cliquer sur **Table Editor** → **user_profiles**
3. Vous devriez voir une ligne avec vos données
4. Cliquer sur la ligne pour voir le détail

## Troubleshooting

### Erreur: "Failed to fetch profile"

**Cause**: Les variables d'environnement ne sont pas configurées correctement

**Solution**:
1. Vérifier `.env.local`
2. S'assurer que les clés commencent par `NEXT_PUBLIC_`
3. Redémarrer le serveur (`Ctrl+C` puis `npm run dev`)

### Erreur: "relation user_profiles does not exist"

**Cause**: Les tables n'ont pas été créées

**Solution**:
1. Aller dans **SQL Editor** de Supabase
2. Réexécuter le script `schema.sql`
3. Vérifier qu'il n'y a pas d'erreurs

### Erreur: "RLS policy violation"

**Cause**: Les politiques de sécurité Row Level Security (RLS) ne sont pas configurées

**Solution**:
1. Aller dans **SQL Editor**
2. Exécuter cette commande pour désactiver temporairement RLS:
```sql
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
```
3. **Attention**: Ceci est pour le développement uniquement. Ne pas faire en production.

### Les données ne s'affichent pas

**Solution**:
1. Ouvrir la console du navigateur (F12)
2. Aller dans l'onglet **Console**
3. Chercher les messages `[UserProfile]` ou erreurs
4. Partager les erreurs pour obtenir de l'aide

## Test Complet du Système

### 1. Test du profil

```bash
# Aller sur la page profil
http://localhost:3000/profil
```

- Remplir: Nom, Prénom, Email, Revenu mensuel
- Cliquer "Sauvegarder"
- ✅ Message de succès

### 2. Test auto-fill recherche immobilière

```bash
# Aller sur la page recherche
http://localhost:3000/recherche-biens-v2
```

- Le champ "Revenu mensuel" devrait être **pré-rempli** automatiquement
- ✅ Valeur = celle entrée dans le profil

### 3. Test auto-fill assistant fiscal

```bash
# Aller sur l'assistant
http://localhost:3000/assistant-fiscal
```

- Les champs nom, prénom, revenu devraient être **pré-remplis**
- ✅ Toutes les valeurs du profil sont là

### 4. Test auto-fill documents

```bash
# Aller sur génération de documents
http://localhost:3000/documents
```

- Les champs nom, prénom, adresse devraient être **pré-remplis**
- ✅ Données du profil utilisées

## Sécurité

### Row Level Security (RLS)

**Activé par défaut** pour protéger vos données:

- Chaque utilisateur ne voit que SES propres données
- Impossible de voir ou modifier les données des autres
- Politiques de sécurité automatiques

### Identifiant utilisateur

**Actuellement** (MVP sans authentification):
- ID généré automatiquement et stocké dans `localStorage`
- Format: `user_123456789_abc123`
- Persiste entre les sessions du navigateur

**Futur** (avec authentification):
- Remplacer par Auth0, Supabase Auth, ou NextAuth
- L'ID utilisateur sera lié au compte

## Données Stockées

### Tables et contenu

| Table | Description | Données |
|-------|-------------|---------|
| `user_profiles` | Profil utilisateur | Nom, prénom, revenus, localisation, etc. |
| `financial_goals` | Objectifs financiers | Épargne, investissement, retraite |
| `real_estate_favorites` | Favoris immobiliers | Propriétés sauvegardées |
| `real_estate_alerts` | Alertes immobilières | Critères de recherche |
| `generated_documents` | Documents générés | Courriers, contrats, etc. |
| `ai_conversations` | Historique IA | Conversations avec l'assistant |
| `mortgage_simulations` | Simulations | Hypothèques calculées |

### Taille et limites

**Plan Free** (gratuit):
- **Database**: 500 MB de stockage
- **Bandwidth**: 5 GB/mois de transfert
- **API Requests**: 50,000/mois

→ **Largement suffisant** pour des centaines d'utilisateurs en MVP

## Monitoring

### Voir l'utilisation

1. Supabase Dashboard → **Settings** → **Usage**
2. Voir:
   - Database size
   - API requests
   - Bandwidth used

### Voir les données en temps réel

1. **Table Editor** → Sélectionner une table
2. Actualiser pour voir les nouvelles données

### Logs

1. **Logs** dans le menu gauche
2. Voir toutes les requêtes SQL
3. Utile pour déboguer

## Backup

### Export des données

```bash
# Dans Supabase Dashboard
Database → Backups → Create backup
```

### Import des données

```bash
# Exporter en CSV
Table Editor → user_profiles → Export → CSV

# Importer dans un nouveau projet
Table Editor → user_profiles → Import → CSV
```

## Migration vers Production

### 1. Créer un projet de production

1. Nouveau projet Supabase
2. Nom: `aurore-finance-prod`
3. Region: Même que développement

### 2. Copier le schema

1. Copier toutes les tables du projet dev
2. Exécuter `schema.sql` dans le projet prod

### 3. Configurer les variables

```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://prod-xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...prod...
```

### 4. Migrer les données

```bash
# Export depuis dev
# Import vers prod via CSV
```

## Support

### Problèmes courants résolus

- **Connexion**: Vérifier `.env.local`
- **Tables**: Exécuter `schema.sql`
- **RLS**: Temporairement désactiver pour tester
- **Logs**: Console navigateur (F12)

### Obtenir de l'aide

1. Documentation Supabase: [https://supabase.com/docs](https://supabase.com/docs)
2. Documentation Aurore: [SUPABASE_AUTOFILL.md](SUPABASE_AUTOFILL.md)
3. Logs serveur Next.js
4. Logs console navigateur

## Prochaines Étapes

Après l'installation:

1. ✅ Tester auto-fill sur toutes les pages
2. ✅ Remplir votre profil complet
3. ✅ Vérifier que les données persistent
4. ⏳ Ajouter l'authentification (optionnel)
5. ⏳ Migrer les données localStorage existantes
6. ⏳ Configurer les alertes immobilières
7. ⏳ Sauvegarder les simulations hypothécaires

## Conclusion

Avec Supabase configuré:

✅ **Auto-fill automatique** sur toutes les pages
✅ **Données persistantes** entre sessions
✅ **Sécurité** avec RLS
✅ **Gratuit** jusqu'à 500 MB
✅ **Scalable** pour production

L'installation est terminée! 🎉

Toutes vos données sont maintenant centralisées et synchronisées automatiquement.
