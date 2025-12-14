# 🚀 Guide d'Installation Complet - Supabase

## 📋 Vue d'ensemble

Ce guide vous explique comment configurer la base de données Supabase pour l'application Aurore Finance, incluant :
- ✅ Table `user_profiles` pour les profils utilisateurs
- ✅ Table `maison_finances` + 9 tables de données pour la Maison des Finances
- ✅ Row Level Security (RLS) pour la sécurité
- ✅ Fonction RPC optimisée

## ⚠️ IMPORTANT : user_id TEXT vs UUID

Cette application utilise un système d'authentification local sans Supabase Auth, donc `user_id` est de type **TEXT** (et non UUID).

Format des IDs : `user_1765472564442_w202hw7`

## 🎯 Installation en 3 Étapes

### Étape 1 : Créer la table user_profiles

1. Ouvrez votre projet Supabase : https://app.supabase.com
2. Allez dans **SQL Editor** (barre latérale gauche)
3. Cliquez sur **New query**
4. Copiez **tout le contenu** de `user-profiles-schema-text-ids.sql`
5. Collez dans l'éditeur et cliquez sur **Run**

**Résultat attendu** : Table `user_profiles` créée avec `user_id TEXT`

### Étape 2 : Créer les tables de la Maison des Finances

1. Dans le même **SQL Editor**, créez une nouvelle requête
2. Copiez **tout le contenu** de `maison-finances-schema-text-ids.sql`
3. Collez dans l'éditeur et cliquez sur **Run**

**Résultat attendu** : 10 tables créées (1 principale + 9 de données)

### Étape 3 : Vérifier l'installation

Exécutez cette requête pour vérifier que toutes les tables existent :

```sql
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'user_profiles',
    'maison_finances',
    'sante_data',
    'revenu_data',
    'biens_data',
    'vieillesse_data',
    'fortune_data',
    'immobilier_data',
    'budget_data',
    'fiscalite_data',
    'juridique_data'
  )
ORDER BY table_name;
```

**Résultat attendu** : 11 tables affichées

## ✅ Tests de validation

### Test 1 : Vérifier le type de user_id

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name = 'user_id';
```

**Résultat attendu** : `data_type = 'text'`

### Test 2 : Vérifier les politiques RLS

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;
```

**Résultat attendu** : 4 politiques (SELECT, INSERT, UPDATE, DELETE)

### Test 3 : Vérifier la fonction RPC

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_maison_finances_complete';
```

**Résultat attendu** : 1 fonction affichée

## 🔧 Configuration de l'application

Après l'installation des tables, vérifiez votre fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

## 🧪 Test depuis l'application

1. Lancez l'application : `npm run dev`
2. Ouvrez la console navigateur (F12)
3. Naviguez vers `/dashboard-maison`
4. Vérifiez les logs dans la console :
   - ✅ `[MaisonFinances] Loading data for user: user_xxxxx`
   - ✅ `[MaisonFinances] Data loaded successfully`
   - ❌ Si erreur `invalid input syntax for type uuid` → user_id est encore en UUID

## 🐛 Dépannage

### Erreur : "invalid input syntax for type uuid"

**Cause** : La table utilise encore `user_id UUID` au lieu de `TEXT`

**Solution** :
1. Supprimez l'ancienne table : `DROP TABLE user_profiles CASCADE;`
2. Réexécutez `user-profiles-schema-text-ids.sql`

### Erreur : "relation already exists"

**Cause** : Les tables existent déjà

**Solution** : C'est normal ! Les scripts utilisent `IF NOT EXISTS`. Si vous voulez recréer :
1. Supprimez manuellement avec `DROP TABLE nom_table CASCADE;`
2. Réexécutez le script

### Erreur : "permission denied for schema public"

**Cause** : Permissions insuffisantes

**Solution** : Vérifiez que vous êtes administrateur du projet Supabase

### Aucune donnée chargée / NULL

**Cause** : Normal pour un nouvel utilisateur

**Solution** : Les données seront créées automatiquement lors de la première visite de `/dashboard-maison`

## 📊 Architecture de la base de données

### Table principale : user_profiles
- **user_id** : TEXT (ID généré par l'application)
- Stocke toutes les informations personnelles, fiscales, professionnelles

### Table principale : maison_finances
- **user_id** : TEXT (référence à user_profiles)
- **score_global** : Score global de santé financière (0-100)
- **completion_status** : Statut de complétion par section (JSONB)

### Tables de données (9)
Chaque section de la maison a sa propre table :
- **sante_data** : Assurances santé (LAMAL, LCA)
- **revenu_data** : Revenus (salaire, indépendant, autres)
- **biens_data** : Assurances biens (RC, ménage, véhicules)
- **vieillesse_data** : Prévoyance (AVS, LPP, 3a, 3b)
- **fortune_data** : Actifs et dettes
- **immobilier_data** : Propriétés et hypothèques
- **budget_data** : Budget mensuel détaillé
- **fiscalite_data** : Optimisation fiscale
- **juridique_data** : Documents juridiques

## 🔒 Sécurité (RLS)

Toutes les tables sont protégées par **Row Level Security** :

- ✅ Chaque utilisateur ne peut voir que ses propres données
- ✅ Les policies utilisent `current_setting('request.jwt.claims', true)::json->>'sub'`
- ✅ Impossible d'accéder aux données d'un autre utilisateur

**Note** : Avec l'authentification locale, le `sub` dans le JWT doit être votre `user_id` TEXT.

## 📝 Utilisation dans le code

### Charger le profil utilisateur

```typescript
import { UserProfileService } from '@/lib/services/user-profile.service';

const profile = await UserProfileService.getProfile();
```

### Charger les données de la Maison

```typescript
import { MaisonFinancesService } from '@/lib/services/maison-finances.service';

const userId = UserProfileService.getCurrentUserId();
const data = await MaisonFinancesService.loadComplete(userId);
```

### Sauvegarder une section

```typescript
await MaisonFinancesService.saveSection(userId, 'sante', {
  assurance_lamal_nom: 'Groupe Mutuel',
  assurance_lamal_prime_mensuelle: 385.50,
  assurance_lamal_franchise: 2500
});
```

## 🎓 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- Code source : `/lib/services/maison-finances.service.ts`

## ✅ Checklist finale

Avant de passer en production :

- [ ] Tables créées avec `user_id TEXT`
- [ ] RLS activé sur toutes les tables
- [ ] Fonction RPC `get_maison_finances_complete` créée
- [ ] Variables d'environnement configurées
- [ ] Test de connexion réussi depuis l'application
- [ ] Test de création de profil réussi
- [ ] Test de chargement de la Maison réussi
- [ ] Test de sauvegarde de données réussi

## 🎉 Félicitations !

Votre base de données Supabase est maintenant configurée et prête à être utilisée avec l'application Aurore Finance !

Pour toute question, consultez les fichiers README dans `/supabase/` ou le code source des services.
