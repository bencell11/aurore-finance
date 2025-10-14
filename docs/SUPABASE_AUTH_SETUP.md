# Configuration Authentification Supabase - Aurore Finance

## 🎯 Vue d'ensemble

Ce document explique comment configurer l'authentification Supabase native avec `auth.uid()` pour connecter réellement le profil utilisateur à la base de données.

---

## 📋 Étapes de Configuration

### 1. Exécuter le nouveau schéma SQL dans Supabase

1. Ouvrez **Supabase Dashboard** → **SQL Editor**
2. Copiez TOUT le contenu de `lib/supabase/schema-with-auth.sql`
3. Exécutez-le dans l'éditeur SQL

Ce script va:
- ✅ Modifier toutes les tables pour utiliser `UUID` au lieu de `TEXT` pour `user_id`
- ✅ Créer les nouvelles policies RLS basées sur `auth.uid()`
- ✅ Créer un trigger qui crée automatiquement un profil lors de l'inscription
- ✅ Créer une vue `user_dashboard` pour les statistiques

### 2. Activer l'authentification Email

1. Dans **Supabase Dashboard** → **Authentication** → **Providers**
2. Activez **Email**
3. Pour le développement, vous pouvez désactiver "Confirm email" (optionnel)

### 3. Configurer les variables d'environnement

Vérifiez que votre `.env.local` contient:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here  # PAS service_role !
```

**IMPORTANT**: Utilisez la clé `anon` key, PAS la `service_role` key pour le client-side !

---

## 🎨 Pages créées

### 1. Dashboard Data Visualization (`/dashboard-data`)

**Fichier**: `app/dashboard-data/page.tsx`

**Fonctionnalités**:
- ✅ Affiche TOUTES les données extraites depuis Supabase
- ✅ Profil utilisateur complet avec % de complétion
- ✅ Statistiques (objectifs, documents, simulations, favoris)
- ✅ Sections visuelles par catégorie (infos perso, fiscal, localisation, etc.)
- ✅ Bouton "Afficher/Masquer données sensibles" pour revenus, IBAN, etc.
- ✅ Indicateurs visuels (✓) pour montrer quelles données sont extraites
- ✅ Listes détaillées:
  - Objectifs financiers avec barre de progression
  - Documents générés
  - Simulations hypothécaires
  - Favoris immobiliers

**Accès**: Requiert authentification (redirige vers `/auth/login` sinon)

---

## 🔧 Services créés

### UserProfileSupabaseService

**Fichier**: `lib/services/user-profile-supabase.service.ts`

**Méthodes principales**:

```typescript
// Récupérer le profil (avec auth.uid())
await UserProfileSupabaseService.getProfile()

// Mettre à jour le profil
await UserProfileSupabaseService.updateProfile({ nom: 'Dupont', prenom: 'Jean' })

// Auto-remplir un formulaire
const data = await UserProfileSupabaseService.autofillForm({
  'monthlyIncome': 'revenu_mensuel',
  'firstName': 'prenom',
  'lastName': 'nom'
})

// Synchroniser formulaire → profil
await UserProfileSupabaseService.syncFormToProfile(
  { monthlyIncome: 5000, firstName: 'Jean' },
  { 'monthlyIncome': 'revenu_mensuel', 'firstName': 'prenom' }
)

// Récupérer toutes les données (dashboard)
const allData = await UserProfileSupabaseService.getAllUserData()
// Retourne: { profile, goals, documents, simulations, favorites, stats }
```

---

## 🔐 Authentification

### Hook useAuth

Déjà existant dans `lib/hooks/useAuth.ts`

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

export default function MyPage() {
  const { user, loading, signIn, signUp, signOut, isAuthenticated } = useAuth();

  // Connexion
  const handleLogin = async () => {
    const { data, error } = await signIn('user@example.com', 'password');
  };

  // Inscription
  const handleSignup = async () => {
    const { data, error } = await signUp('user@example.com', 'password');
  };

  // Déconnexion
  const handleLogout = async () => {
    await signOut();
  };

  return <div>...</div>;
}
```

---

## 📊 Vue Database: user_dashboard

Le schéma crée une vue SQL `user_dashboard` qui agrège toutes les données:

```sql
SELECT * FROM user_dashboard WHERE user_id = auth.uid();
```

**Colonnes disponibles**:
- Toutes les colonnes du profil (nom, prenom, email, revenus, etc.)
- `nombre_objectifs`: Nombre d'objectifs financiers
- `objectifs_completes`: Nombre d'objectifs complétés
- `nombre_favoris`: Nombre de favoris immobiliers
- `nombre_alertes`: Nombre d'alertes configurées
- `nombre_documents`: Nombre de documents générés
- `nombre_simulations`: Nombre de simulations hypothécaires

---

## 🎯 Utilisation dans vos pages

### Exemple 1: Auto-fill d'un formulaire

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';

export default function MyFormPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ nom: '', prenom: '', revenu: 0 });

  useEffect(() => {
    if (user) {
      loadAndAutofill();
    }
  }, [user]);

  const loadAndAutofill = async () => {
    const data = await UserProfileSupabaseService.autofillForm({
      'nom': 'nom',
      'prenom': 'prenom',
      'revenu': 'revenu_mensuel'
    });

    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    // Sauvegarder dans Supabase
    await UserProfileSupabaseService.syncFormToProfile(formData, {
      'nom': 'nom',
      'prenom': 'prenom',
      'revenu': 'revenu_mensuel'
    });
  };

  return (
    <form>
      <input
        value={formData.nom}
        onChange={(e) => setFormData({...formData, nom: e.target.value})}
      />
      {/* ... autres champs ... */}
      <button onClick={handleSubmit}>Sauvegarder</button>
    </form>
  );
}
```

### Exemple 2: Afficher les données utilisateur

```typescript
'use client';

import { useEffect, useState } from 'react';
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';

export default function ProfileSummary() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await UserProfileSupabaseService.getProfile();
    setProfile(data);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.prenom} {profile.nom}</h1>
      <p>Revenu: CHF {profile.revenu_mensuel}</p>
      <p>Canton: {profile.canton}</p>
    </div>
  );
}
```

---

## 🚀 Tester l'authentification

### 1. Créer un compte de test

```bash
# Via Supabase Dashboard → Authentication → Users
# Cliquez sur "Add user" et créez un utilisateur de test
```

OU via l'API:

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Inscription
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'motdepasse123'
});

// Le trigger va automatiquement créer un profil dans user_profiles
```

### 2. Tester la page Dashboard Data

1. Connectez-vous avec votre compte de test
2. Allez sur `/dashboard-data`
3. Vous devriez voir:
   - Votre email
   - Barre de complétion du profil (probablement à 20-30%)
   - Statistiques (0 objectifs, 0 documents, etc. si nouveau compte)
   - Toutes les sections de données (la plupart vides au début)

### 3. Remplir des données de test

Utilisez Supabase Dashboard → Table Editor pour ajouter manuellement des données de test:

```sql
-- Compléter le profil
UPDATE user_profiles
SET
  nom = 'Dupont',
  prenom = 'Jean',
  revenu_mensuel = 6500,
  canton = 'VD',
  ville = 'Lausanne'
WHERE user_id = 'votre-user-id';

-- Ajouter un objectif
INSERT INTO financial_goals (user_id, type, nom, montant_cible, montant_actuel, statut)
VALUES ('votre-user-id', 'epargne', 'Fonds d''urgence', 20000, 5000, 'en_cours');
```

Rafraîchissez `/dashboard-data` et vous verrez vos données apparaître avec les indicateurs ✓ !

---

## ⚠️ Sécurité

### RLS (Row Level Security)

Les policies RLS garantissent que:
- ✅ Chaque utilisateur voit UNIQUEMENT ses propres données
- ✅ Impossible de lire/modifier les données d'un autre utilisateur
- ✅ Les requêtes utilisent `auth.uid()` automatiquement

### Clés API

- **`anon` key**: Pour le client-side (sécurisée par RLS)
- **`service_role` key**: JAMAIS exposer côté client ! (bypass RLS)

### Données sensibles

Le dashboard a un bouton "Afficher/Masquer données sensibles" pour:
- Revenus (annuel, mensuel)
- Loyer
- IBAN

---

## 📝 Prochaines étapes

### Pages à connecter à Supabase Auth:

1. ✅ **Dashboard Data** (`/dashboard-data`) - FAIT
2. **Recherche immobilière** (`/recherche-biens-v2`) - Auto-fill revenu
3. **Documents** (`/documents`) - Auto-fill nom, adresse, etc.
4. **Assistant fiscal** (`/assistant-fiscal`) - Auto-fill données fiscales
5. **Objectifs** (`/objectifs`) - CRUD objectifs financiers

### Pour chaque page:

```typescript
// 1. Importer le service
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';
import { useAuth } from '@/lib/hooks/useAuth';

// 2. Vérifier l'authentification
const { user } = useAuth();

// 3. Auto-remplir au chargement
useEffect(() => {
  if (user) {
    const data = await UserProfileSupabaseService.autofillForm({ ... });
    // Appliquer data au formulaire
  }
}, [user]);

// 4. Sauvegarder lors de la soumission
const handleSubmit = async () => {
  await UserProfileSupabaseService.syncFormToProfile(formData, mapping);
};
```

---

## 🎉 Résultat Final

Après configuration complète:

1. **L'utilisateur s'inscrit** → Profil créé automatiquement dans `user_profiles`
2. **Il remplit un formulaire** (ex: recherche immobilière) → Données sauvegardées dans Supabase
3. **Il va sur `/dashboard-data`** → Voit TOUTES ses données extraites, organisées visuellement
4. **Il remplit un autre formulaire** → Auto-rempli avec ses données précédentes
5. **Les données sont sécurisées** → RLS garantit l'isolation entre utilisateurs

---

## 🆘 Dépannage

### Erreur: "No authenticated user"
➡️ Vérifiez que l'utilisateur est connecté avec `useAuth()`

### Erreur: "relation 'user_profiles' does not exist"
➡️ Exécutez `schema-with-auth.sql` dans Supabase SQL Editor

### Erreur: "Row Level Security policy violation"
➡️ Vérifiez que les policies RLS sont bien créées (voir `schema-with-auth.sql`)

### Les données n'apparaissent pas sur le dashboard
➡️ Vérifiez dans Supabase Dashboard → Table Editor que les données existent et que `user_id` correspond bien à votre UUID auth

---

## 📚 Ressources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
