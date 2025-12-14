# ⚡ Démarrage Rapide - Migration vers Supabase Auth

## 🎯 Objectif

Migrer l'application vers **Supabase Auth** avec RLS activé pour une sécurité maximale.

## ✅ Prérequis

- Compte Supabase : https://app.supabase.com
- Projet Supabase créé : **gldvcudowxielzrpdsxz**
- Accès à l'éditeur SQL

## 🚀 Installation en 3 étapes (10 minutes)

### Étape 1 : Exécuter user-profiles-schema-uuid.sql

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet **gldvcudowxielzrpdsxz**
3. SQL Editor → New query
4. Copiez **TOUT le contenu** de `/supabase/user-profiles-schema-uuid.sql`
5. Collez et cliquez sur **Run**

**Résultat attendu** :
- ✅ `DROP TABLE` - Success
- ✅ `CREATE TABLE` - Success
- ✅ `CREATE INDEX` - Success
- ✅ `CREATE TRIGGER` - Success
- ✅ `ALTER TABLE ENABLE ROW LEVEL SECURITY` - Success
- ✅ `CREATE POLICY` (4x) - Success
- ✅ `GRANT` - Success
- ✅ Requête SELECT finale affichant la structure

### Étape 2 : Exécuter maison-finances-schema-uuid.sql

1. Nouvelle requête SQL
2. Copiez **TOUT le contenu** de `/supabase/maison-finances-schema-uuid.sql`
3. Collez et cliquez sur **Run**

**Résultat attendu** : ✅ Success (10 tables créées avec RLS activé)

### Étape 3 : Vérification

#### 3.1 Vérifier que les tables existent

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (table_name = 'user_profiles' OR table_name LIKE '%_data' OR table_name = 'maison_finances')
ORDER BY table_name;
```

**Résultat attendu** : 11 lignes

#### 3.2 Vérifier que RLS est activé

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN (
  'maison_finances', 'sante_data', 'revenu_data', 'biens_data',
  'vieillesse_data', 'fortune_data', 'immobilier_data',
  'budget_data', 'fiscalite_data', 'juridique_data', 'user_profiles'
);
```

**Résultat attendu** : `rowsecurity = true` pour toutes les tables

#### 3.3 Tester depuis l'application

1. `npm run dev`
2. Ouvrez http://localhost:3000
3. Créez un compte via l'interface d'inscription
4. Vérifiez la console : aucune erreur RLS

**Logs attendus** :
```
✅ [SupabaseAuth] User authenticated: {UUID}
✅ [UserProfile] Profile loaded successfully
✅ [MaisonFinances] Data loaded successfully
```

## 🎉 Résultat final

Une fois terminé :
- ✅ Supabase Auth activé avec JWT tokens
- ✅ RLS activé sur toutes les tables
- ✅ Isolation complète des données par utilisateur
- ✅ Sécurité native au niveau de la base de données
- ✅ Reset password / Email confirmation disponibles
- ✅ Production-ready

## 🐛 Problèmes courants

### Erreur "new row violates row-level security policy"

**Cause** : L'utilisateur n'est pas authentifié ou `auth.uid()` est NULL

**Solution** :
1. Vérifiez que vous êtes connecté (console : `auth.uid()` doit retourner un UUID)
2. Videz le cache du navigateur (Ctrl+Shift+Delete)
3. Reconnectez-vous

### Erreur "relation already exists"

**Solution** : Exécutez d'abord le DROP CASCADE dans le script

### Pas de données chargées

**Normal** pour un nouvel utilisateur. Les données seront créées lors de la première visite du dashboard.

## 📋 Checklist complète

- [ ] Étape 1 : Exécution de user-profiles-schema-uuid.sql
- [ ] Étape 2 : Exécution de maison-finances-schema-uuid.sql
- [ ] Étape 3.1 : Vérification des 11 tables
- [ ] Étape 3.2 : Vérification RLS activé (rowsecurity = true)
- [ ] Étape 3.3 : Test création de compte et connexion
- [ ] Étape 3.4 : Test dashboard-maison sans erreur

## 📞 Support

Consultez :
- [README.md](README.md) - Documentation complète
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation RLS](https://supabase.com/docs/guides/auth/row-level-security)

**Temps estimé** : ⏱️ 10-15 minutes
