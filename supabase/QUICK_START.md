# ⚡ Démarrage Rapide - Fix de connexion Supabase

## 🎯 Problème détecté

```
Error: invalid input syntax for type uuid: "user_1765472564442_w202hw7"
```

**Cause** : La table `user_profiles` dans Supabase utilise `user_id UUID` mais l'application génère des IDs de type TEXT.

## ✅ Solution en 3 étapes (15 minutes)

### Étape 1 : Préparer les scripts SQL (✅ DÉJÀ FAIT)

Les fichiers SQL sont prêts dans le dossier `/supabase/` :
- ✅ `user-profiles-schema-text-ids.sql`
- ✅ `maison-finances-schema-text-ids.sql`
- ✅ `INSTALLATION_GUIDE.md` (guide détaillé)

### Étape 2 : Exécuter les scripts dans Supabase (À FAIRE)

#### 2.1 Aller sur Supabase
1. Ouvrez https://app.supabase.com
2. Sélectionnez votre projet **gldvcudowxielzrpdsxz** (celui dans l'erreur)
3. Cliquez sur **SQL Editor** dans la barre latérale

#### 2.2 Créer la nouvelle table user_profiles (avec suppression automatique de l'ancienne)

⚠️ **Note importante** : Le script supprime automatiquement l'ancienne table avec `DROP TABLE IF EXISTS ... CASCADE`

1. Créez une **nouvelle requête**
2. Ouvrez `/supabase/user-profiles-schema-text-ids.sql`
3. Copiez **TOUT le contenu** du fichier (138 lignes)
4. Collez dans l'éditeur SQL Supabase
5. Cliquez sur **Run** (Ctrl+Enter ou Cmd+Enter)

**Résultat attendu** :
- ✅ `DROP TABLE` - Success
- ✅ `CREATE TABLE` - Success
- ✅ `CREATE INDEX` - Success
- ✅ `CREATE TRIGGER` - Success
- ✅ `ALTER TABLE` (RLS) - Success
- ✅ `CREATE POLICY` (4x) - Success
- ✅ `GRANT ALL` - Success
- ✅ Requête SELECT finale affichant la structure

#### 2.3 Créer les tables Maison des Finances

1. Créez une **nouvelle requête**
2. Ouvrez `/supabase/maison-finances-schema-text-ids.sql`
3. Copiez **TOUT le contenu** du fichier
4. Collez dans l'éditeur SQL Supabase
5. Cliquez sur **Run**

**Résultat attendu** : ✅ Success (10 tables créées)

### Étape 3 : Tester la connexion (À FAIRE)

#### 3.1 Vérifier les tables créées

Dans le SQL Editor, exécutez :

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (table_name = 'user_profiles' OR table_name LIKE '%_data' OR table_name = 'maison_finances')
ORDER BY table_name;
```

**Résultat attendu** : 11 lignes affichées
```
biens_data
budget_data
fiscalite_data
fortune_data
immobilier_data
juridique_data
maison_finances
revenu_data
sante_data
user_profiles
vieillesse_data
```

#### 3.2 Vérifier le type de user_id

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name = 'user_id';
```

**Résultat attendu** :
```
column_name | data_type
------------|----------
user_id     | text
```

#### 3.3 Tester depuis l'application

1. Lancez l'application : `npm run dev`
2. Ouvrez votre navigateur : http://localhost:3000
3. Ouvrez la console (F12)
4. Naviguez vers `/dashboard-maison`
5. Vérifiez les logs dans la console

**Résultat attendu** :
```
✅ [UserProfile] Profile loaded successfully
✅ [MaisonFinances] Loading data for user: user_xxxxx
✅ [MaisonFinances] Data loaded successfully
```

**Si erreur** :
```
❌ Error: invalid input syntax for type uuid
```
→ Retournez à l'Étape 2.2 et vérifiez que vous avez bien DROP la table

## 📋 Checklist complète

- [ ] Étape 1 : Scripts SQL prêts ✅ (déjà fait)
- [ ] Étape 2.1 : Connexion à Supabase SQL Editor
- [ ] Étape 2.2 : Création de la nouvelle table user_profiles (suppression auto de l'ancienne)
- [ ] Étape 2.3 : Création des tables Maison des Finances
- [ ] Étape 3.1 : Vérification des tables (11 tables)
- [ ] Étape 3.2 : Vérification du type user_id (TEXT)
- [ ] Étape 3.3 : Test depuis l'application (pas d'erreur UUID)

## 🎉 Résultat final

Une fois terminé :
- ✅ Plus d'erreur `invalid input syntax for type uuid`
- ✅ Dashboard Maison des Finances fonctionnel
- ✅ Profils utilisateurs sauvegardés correctement
- ✅ 11 tables créées avec RLS actif

## 🐛 Problèmes courants

### Erreur "operator does not exist: uuid = text"

**Cause** : L'ancienne table user_profiles existe encore avec user_id UUID

**Solution** : Le script mis à jour supprime automatiquement l'ancienne table avec `DROP TABLE IF EXISTS ... CASCADE`. Réexécutez le script complet.

### Erreur "permission denied"
→ Vérifiez que vous êtes connecté en tant qu'administrateur du projet Supabase

### Erreur "relation already exists"
→ Normal si vous réexécutez le script maison-finances (utilise `IF NOT EXISTS`). Pour user_profiles, le script fait un DROP d'abord.

### Aucune donnée chargée
→ Normal pour un nouvel utilisateur. Les données seront créées lors de la première visite.

### L'erreur UUID persiste après exécution
→ Videz le cache du navigateur (Ctrl+Shift+Delete) et rechargez la page

## 📞 Besoin d'aide ?

Consultez :
- **Guide détaillé** : `/supabase/INSTALLATION_GUIDE.md`
- **Documentation tables** : `/supabase/README.md`
- **Code source** : `/lib/services/maison-finances.service.ts`

## 🗂️ Fichiers organisés

Les anciens schémas ont été archivés dans `/supabase/archived/` :
- ❌ `maison-finances-schema-uuid.sql` (ancien, ne plus utiliser)
- ✅ `maison-finances-schema-text-ids.sql` (actif, à utiliser)

## 🚀 Prêt à démarrer ?

Suivez les étapes 2 et 3 ci-dessus pour résoudre le problème de connexion Supabase !

⏱️ Temps estimé : **10-15 minutes**
