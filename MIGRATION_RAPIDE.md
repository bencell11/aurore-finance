# 🚀 Migration Rapide Supabase - 5 MINUTES

## ⚠️ PROBLÈME ACTUEL

Tu as 2 erreurs:
1. ❌ `invalid input syntax for type uuid: "user_1760405465595_liqtmsa"`
2. ❌ `/auth/login` n'existe pas (404)

**Cause**: Tu utilises l'ancien système avec `user_id` TEXT au lieu de UUID.

---

## ✅ SOLUTION SIMPLE (3 étapes)

### Étape 1: Exécuter 1 script SQL dans Supabase (2 min)

1. Va sur **https://supabase.com/dashboard**
2. Clique sur ton projet
3. Clique sur **SQL Editor** (icône base de données à gauche)
4. Clique sur **"New query"**
5. Copie TOUT le contenu du fichier `lib/supabase/disable-rls-dev.sql`:

```sql
-- Disable RLS for development (TEMPORARY - DO NOT USE IN PRODUCTION)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_simulations DISABLE ROW LEVEL SECURITY;
```

6. Clique **"Run"** (ou Cmd+Enter)
7. ✅ Tu devrais voir "Success. No rows returned"

### Étape 2: Redémarre le serveur (1 min)

```bash
# Dans ton terminal
pkill -9 -f "next dev"
sleep 2
rm -rf .next
npm run dev
```

### Étape 3: Test (2 min)

1. Va sur `http://localhost:3000/dashboard`
2. Cherche "Profil Utilisateur"
3. Tu devrais voir:
   - ✅ Pas d'erreur UUID dans la console
   - ✅ Section profil affichée (même vide)
   - ✅ Bouton "Modifier" fonctionne

---

## 🎯 TEST COMPLET AUTO-REMPLISSAGE

### 1. Remplis ton profil

Sur `/dashboard`, clique "Modifier" et remplis:
```
Prénom: Jean
Nom: Dupont
Email: jean@example.com
Revenu mensuel: 6500
Canton: VD
Ville: Lausanne
NPA: 1000
```

Clique "Sauvegarder".

### 2. Vérifie dans Supabase

1. **Supabase Dashboard → Table Editor → user_profiles**
2. Tu devrais voir ta ligne avec:
   - `user_id`: ton ID (TEXT)
   - `prenom`: Jean
   - `nom`: Dupont
   - etc.

### 3. Test l'auto-fill

1. Va sur `/recherche-biens-v2`
2. **Le champ "Revenu mensuel" devrait déjà contenir 6500!**

✅ **C'est ça l'auto-remplissage!**

---

## ❌ Si ça ne marche TOUJOURS pas

### Erreur: "relation 'user_profiles' does not exist"

**Solution**: Tu n'as jamais créé les tables!

Exécute `lib/supabase/schema.sql` (l'ancien, pas schema-with-auth):

1. **Supabase Dashboard → SQL Editor → New query**
2. Copie TOUT `lib/supabase/schema.sql`
3. Run
4. Puis exécute `disable-rls-dev.sql` (étape 1)

### Erreur persist encore

**Option nucléaire**: Désactive complètement le profil Supabase

Édite `app/dashboard/page.tsx`:

Trouve cette ligne (vers ligne 95):
```typescript
const enrichedProfile = await UserProfileSupabaseService.getProfile();
```

Remplace par:
```typescript
// const enrichedProfile = await UserProfileSupabaseService.getProfile();
const enrichedProfile = null; // Désactivé temporairement
```

Sauvegarde. La section profil disparaît mais le dashboard fonctionne.

---

## 🎉 Résultat Final

Quand ça fonctionne:

1. ✅ Dashboard affiche la section profil
2. ✅ Tu peux modifier et sauvegarder
3. ✅ Données dans Supabase Table Editor
4. ✅ Auto-remplissage sur `/recherche-biens-v2`
5. ✅ Plus d'erreur UUID dans la console

---

## 📧 Test Rapide (30 secondes)

Copie-colle ça dans la **console navigateur** (F12 → Console) pendant que tu es sur `/dashboard`:

```javascript
// Test si Supabase fonctionne
import('@/lib/services/user-profile.service').then(module => {
  module.UserProfileService.getProfile().then(profile => {
    console.log('✅ Profil chargé:', profile);
  }).catch(err => {
    console.error('❌ Erreur:', err.message);
  });
});
```

Si tu vois `✅ Profil chargé: { ... }` → **Ça marche!**
Si tu vois `❌ Erreur: ...` → **Suis les étapes ci-dessus**

---

## 🆘 Aide Rapide

**Erreur UUID**: Exécute `disable-rls-dev.sql`
**Table n'existe pas**: Exécute `schema.sql`
**404 /auth/login**: C'est corrigé, redémarre le serveur
**Rien ne marche**: Désactive temporairement (option nucléaire ci-dessus)

Le but c'est que tu puisses **TESTER** l'auto-remplissage MAINTENANT, pas dans 2 heures! 🚀
