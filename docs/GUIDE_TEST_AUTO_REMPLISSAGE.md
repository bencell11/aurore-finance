# Guide de Test - Auto-remplissage Supabase

## 🎯 Objectif

Tester que les données du profil Supabase s'affichent correctement et que l'auto-remplissage fonctionne sur toutes les pages.

---

## 📋 Prérequis

### 1. Supabase Configuré

Vérifie que tu as bien exécuté ces 2 scripts SQL dans **Supabase Dashboard → SQL Editor**:

1. **`lib/supabase/schema-with-auth.sql`** - Crée les tables avec auth.uid()
2. **`lib/supabase/disable-rls-dev.sql`** OU configure RLS correctement

### 2. Variables d'Environnement

Vérif ie `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  # PAS service_role !
```

### 3. Compte Utilisateur Créé

Crée un compte test via:
- **Supabase Dashboard → Authentication → Users → Add user**
- OU utilise l'inscription de l'app

---

## 🧪 Tests à Effectuer

### Test 1: Vérifier le Dashboard - Affichage du Profil

**Étapes**:
1. Connecte-toi à l'app
2. Va sur `/dashboard`
3. Cherche la section **"Profil Utilisateur"** (après les 4 KPIs)

**Résultats attendus**:
- ✅ Section "Profil Utilisateur (X% complété)" visible
- ✅ Barre de progression affichée
- ✅ Boutons "Afficher" et "Modifier" présents
- ✅ Sections: Informations personnelles, Localisation, Finances & Logement
- ✅ Champs vides affichés en gris avec "Non renseigné"
- ✅ Champs remplis affichés en vert avec ✓

**Console** (F12 → Console):
```
📋 Profil enrichi chargé: { nom: null, prenom: null, email: "test@example.com", ... }
```

---

### Test 2: Modifier le Profil sur le Dashboard

**Étapes**:
1. Sur `/dashboard`, dans la section "Profil Utilisateur"
2. Clique sur **"Modifier"**
3. Remplis les champs:
   - Prénom: `Jean`
   - Nom: `Dupont`
   - Date de naissance: `01/01/1990`
   - Situation familiale: `Marié(e)`
   - Enfants: `2`
   - Email: `jean.dupont@example.com`
4. Clique sur **"Sauvegarder"** (bouton vert)

**Résultats attendus**:
- ✅ Bouton passe en "Sauvegarde..." avec spinner
- ✅ Message console: `✅ Profil sauvegardé avec succès`
- ✅ Retour en mode lecture
- ✅ Champs maintenant affichés en vert avec ✓
- ✅ % de complétion augmente (par ex. de 20% à 60%)

**Vérification Supabase**:
- Va sur **Supabase Dashboard → Table Editor → user_profiles**
- Vérifie que les données sont bien enregistrées

---

### Test 3: Dashboard Data - Vue Complète

**Étapes**:
1. Sur `/dashboard`, clique sur **"Voir tout le détail →"**
2. Tu arrives sur `/dashboard-data`

**Résultats attendus**:
- ✅ Page complète avec header "Dashboard des Données Extraites"
- ✅ Badge "Supabase Connected" affiché
- ✅ Barre de progression du profil
- ✅ 5 StatCards (Objectifs, Documents, Simulations, Favoris, Total DB)
- ✅ Sections détaillées avec toutes les données
- ✅ Champs remplis affichés avec ✓ vert
- ✅ Bouton "Afficher/Masquer données sensibles" fonctionne

**Test bouton sensible**:
- Clique sur "Masquer"
- Les revenus et IBAN doivent afficher `••••••••`
- Clique sur "Afficher"
- Les valeurs réapparaissent

---

### Test 4: Auto-remplissage - Page Recherche Immobilière

**Étapes**:
1. Va sur `/recherche-biens-v2`
2. Cherche le champ "Revenu mensuel" ou similaire

**Résultats attendus**:
- ✅ Si tu as rempli `revenu_mensuel` dans le profil, le champ doit être pré-rempli
- ✅ Console: `[UserProfile] Auto-filled X fields`

**Test l'auto-remplissage**:
1. Sur `/dashboard`, remplis "Revenu mensuel": `6500`
2. Sauvegarde
3. Va sur `/recherche-biens-v2`
4. Le champ revenu devrait déjà contenir `6500`

---

### Test 5: Auto-remplissage - Page Documents

**Étapes**:
1. Remplis le profil complet sur `/dashboard` (nom, prénom, adresse, NPA, ville, canton)
2. Va sur `/documents`
3. Choisis un template qui demande nom/adresse

**Résultats attendus**:
- ✅ Champs pré-remplis avec les données du profil
- ✅ Pas besoin de tout retaper

---

### Test 6: Sync Bidirectionnel

**Test que les modifs se propagent**:

**Étapes**:
1. Sur `/dashboard`, modifie "Canton": `VD`
2. Sauvegarde
3. Va sur `/assistant-fiscal` ou une page utilisant le canton
4. Vérifie que le canton VD est pré-sélectionné
5. Modifie-le sur cette page si possible
6. Retourne sur `/dashboard`
7. Vérifie que la modification est reflétée

**Résultat attendu**:
- ✅ Les modifications sur une page sont visibles sur les autres pages

---

## 🔍 Vérifications Techniques

### Console Logs à Chercher

Ouvre la **Console** (F12 → Console) et cherche:

✅ **Au chargement du dashboard**:
```
📊 Chargement dashboard pour user: xxxxx-xxxx-xxxx
👤 Profil chargé: { ... }
💰 Profil financier chargé: { ... }
📋 Profil enrichi chargé: { nom: "Dupont", prenom: "Jean", ... }
```

✅ **Lors de la sauvegarde**:
```
[UserProfile] ✓ Profile updated successfully
✅ Profil sauvegardé avec succès
```

✅ **Sur une page avec auto-fill**:
```
[UserProfile] Auto-filled 5 fields
```

### Vérifications Supabase

1. **Table user_profiles**:
   - Ouvre **Supabase Dashboard → Table Editor → user_profiles**
   - Vérifie que ta ligne existe avec `user_id` = ton UUID auth
   - Vérifie que les champs sont remplis

2. **RLS Policies**:
   - Si tu as activé RLS: **Supabase Dashboard → Authentication → Policies**
   - Vérifie que les policies existent et utilisent `auth.uid()`

---

## ❌ Problèmes Courants & Solutions

### Problème 1: "No profile found (Supabase may not be configured)"

**Cause**: Tables pas créées OU RLS bloque

**Solution**:
1. Vérifie que `schema-with-auth.sql` a été exécuté
2. OU execute `disable-rls-dev.sql` pour désactiver RLS en dev
3. Redémarre le serveur: `pkill -9 -f "next dev" && npm run dev`

---

### Problème 2: "invalid input syntax for type uuid"

**Cause**: RLS policies bloquent l'accès

**Solution**:
```sql
-- Dans Supabase SQL Editor
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals DISABLE ROW LEVEL SECURITY;
-- ... répéter pour toutes les tables
```

---

### Problème 3: Bouton "Voir tout le détail" ne mène nulle part

**Cause**: Problème de routing Next.js

**Solution**:
- Vérifie que `/dashboard-data/page.tsx` existe
- Redémarre le serveur dev
- Vide le cache navigateur (Cmd+Shift+R)

---

### Problème 4: Les modifications ne se sauvegardent pas

**Ouvre la Console et cherche**:
- Erreurs rouges?
- Logs de succès?

**Solution**:
1. Vérifie la clé Supabase dans `.env.local` (doit être `anon`, pas `service_role`)
2. Vérifie que l'utilisateur est bien connecté
3. Vérifie les RLS policies

---

## 📊 Checklist Complète

Utilise cette checklist pour valider que tout fonctionne:

- [ ] Dashboard affiche la section "Profil Utilisateur"
- [ ] % de complétion s'affiche
- [ ] Bouton "Modifier" ouvre le mode édition
- [ ] Champs deviennent éditables en mode édition
- [ ] Bouton "Sauvegarder" sauvegarde dans Supabase
- [ ] Données visibles dans Supabase Table Editor
- [ ] Bouton "Voir tout le détail" mène à `/dashboard-data`
- [ ] `/dashboard-data` affiche toutes les données
- [ ] Bouton "Masquer données sensibles" fonctionne
- [ ] Auto-remplissage fonctionne sur `/recherche-biens-v2`
- [ ] Auto-remplissage fonctionne sur `/documents`
- [ ] Modifications sur une page reflétées sur les autres

---

## 🎓 Comment Tester l'Auto-remplissage Complet

### Scénario Complet:

1. **Connexion**
   - Connecte-toi avec un compte test

2. **Remplir le profil**
   - Va sur `/dashboard`
   - Clique "Modifier"
   - Remplis TOUS les champs:
     ```
     Prénom: Jean
     Nom: Dupont
     Email: jean.dupont@example.com
     Date naissance: 01/01/1990
     Situation: Marié(e)
     Enfants: 2
     Adresse: Rue de la Paix 12
     NPA: 1000
     Ville: Lausanne
     Canton: VD
     Statut pro: Salarié
     Profession: Ingénieur
     Employeur: Google
     Revenu annuel: 120000
     Revenu mensuel: 10000
     Statut logement: Locataire
     Loyer: 2500
     ```
   - Sauvegarde

3. **Tester l'auto-fill**
   - Va sur `/recherche-biens-v2` → Revenu doit être pré-rempli
   - Va sur `/documents` → Nom/Adresse pré-remplis
   - Va sur `/assistant-fiscal` → Données fiscales pré-remplies

4. **Vérifier la persistance**
   - Déconnecte-toi
   - Reconnecte-toi
   - Va sur `/dashboard` → Toutes les données doivent être là

---

## 📞 Support

Si un test échoue:

1. **Vérifie la console** (F12 → Console)
2. **Vérifie Supabase Table Editor**
3. **Vérifie les logs serveur** (terminal où tourne `npm run dev`)
4. **Consulte** `TROUBLESHOOTING.md` ou `SUPABASE_AUTH_SETUP.md`

---

## ✅ Résultat Final Attendu

Après tous les tests:

- ✅ Profil complet à 100% sur le dashboard
- ✅ Toutes les données sauvegardées dans Supabase
- ✅ Auto-remplissage fonctionne sur toutes les pages
- ✅ Modifications synchronisées entre pages
- ✅ Données sensibles masquables
- ✅ Dashboard complet (`/dashboard-data`) affiche tout

**L'auto-remplissage est fonctionnel quand tu n'as plus besoin de retaper tes infos personnelles sur chaque formulaire!** 🎉
