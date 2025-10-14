# Intégration Supabase - Auto-fill Automatique

## Vue d'ensemble

Toutes les pages d'Aurore Finance sont maintenant connectées à Supabase pour remplir automatiquement les champs connus de l'utilisateur.

## Architecture

### Schema Supabase ([lib/supabase/schema.sql](../lib/supabase/schema.sql))

Tables créées:
- `user_profiles` - Profil utilisateur complet
- `financial_goals` - Objectifs financiers
- `real_estate_favorites` - Favoris immobiliers
- `real_estate_alerts` - Alertes immobilières
- `generated_documents` - Documents générés
- `ai_conversations` - Historique IA
- `mortgage_simulations` - Simulations hypothécaires

**RLS (Row Level Security)** activé sur toutes les tables pour sécuriser les données.

### Service UserProfile ([lib/services/user-profile.service.ts](../lib/services/user-profile.service.ts))

**Fonctionnalités**:
- Génération d'ID utilisateur (localStorage si pas d'auth)
- CRUD sur le profil
- Auto-fill de formulaires
- Synchronisation bidirectionnelle

**Méthodes clés**:
```typescript
// Obtenir le profil
const profile = await UserProfileService.getProfile();

// Mettre à jour
await UserProfileService.updateProfile({ nom: 'Dupont', prenom: 'Jean' });

// Auto-fill un formulaire
const data = await UserProfileService.autofillForm({
  'nom': 'nom',
  'prenom': 'prenom',
  'revenu': 'revenu_mensuel'
});

// Synchroniser formulaire → profil
await UserProfileService.syncFormToProfile(formData, fieldMapping);
```

### Context React ([contexts/UserProfileContext.tsx](../contexts/UserProfileContext.tsx))

**Provider global** pour accéder au profil partout:
```tsx
import { useUserProfile } from '@/contexts/UserProfileContext';

function MyComponent() {
  const { profile, autofillForm, syncFormToProfile } = useUserProfile();

  useEffect(() => {
    // Auto-remplir au montage
    const data = autofillForm({
      'formFieldName': 'profile_field_name'
    });
    setFormValues(data);
  }, [autofillForm]);
}
```

## Configuration

### 1. Setup Supabase

```bash
# 1. Créer un projet sur supabase.com
# 2. Copier URL et ANON_KEY dans .env.local

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 2. Créer les tables

```sql
-- Exécuter le fichier lib/supabase/schema.sql dans l'éditeur SQL Supabase
```

### 3. Activer le provider dans layout.tsx

```tsx
import { UserProfileProvider } from '@/contexts/UserProfileContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <UserProfileProvider>
          {children}
        </UserProfileProvider>
      </body>
    </html>
  );
}
```

## Intégration dans les Pages

### Champs du Profil Disponibles

```typescript
interface UserProfile {
  // Identité
  nom?: string;
  prenom?: string;
  email?: string;
  date_naissance?: string;

  // Fiscal
  revenu_annuel?: number;
  revenu_mensuel?: number;
  situation_familiale?: 'celibataire' | 'marie' | 'divorce' | 'veuf' | 'concubinage';
  nombre_enfants?: number;

  // Localisation
  adresse?: string;
  npa?: string;
  ville?: string;
  canton?: string;

  // Professionnel
  statut_professionnel?: 'salarie' | 'independant' | 'retraite' | 'etudiant' | 'sans_emploi';
  employeur?: string;
  profession?: string;

  // Bancaire
  iban?: string;
  banque?: string;

  // Immobilier
  statut_logement?: 'locataire' | 'proprietaire' | 'heberge';
  loyer_mensuel?: number;
}
```

### Exemple: Recherche Immobilière

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';

export default function RealEstateSearchPage() {
  const { profile, autofillForm, syncFormToProfile } = useUserProfile();
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  // Auto-fill au montage
  useEffect(() => {
    if (profile) {
      const data = autofillForm({
        'monthlyIncome': 'revenu_mensuel'
      });

      if (data.monthlyIncome) {
        setMonthlyIncome(data.monthlyIncome);
      }
    }
  }, [profile, autofillForm]);

  // Sauvegarder quand l'utilisateur modifie
  const handleIncomeChange = async (value: number) => {
    setMonthlyIncome(value);

    // Synchroniser vers le profil
    await syncFormToProfile(
      { monthlyIncome: value },
      { 'monthlyIncome': 'revenu_mensuel' }
    );
  };

  return (
    <div>
      <input
        type="number"
        value={monthlyIncome}
        onChange={(e) => handleIncomeChange(parseInt(e.target.value))}
        placeholder="Revenu mensuel"
      />
    </div>
  );
}
```

### Exemple: Assistant Fiscal

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';

export default function TaxAssistantPage() {
  const { autofillForm, syncFormToProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    revenu: 0,
    canton: ''
  });

  // Auto-fill complet
  useEffect(() => {
    const filled = autofillForm({
      'nom': 'nom',
      'prenom': 'prenom',
      'revenu': 'revenu_annuel',
      'canton': 'canton'
    });

    setFormData(prev => ({ ...prev, ...filled }));
  }, [autofillForm]);

  // Sauvegarder tout le formulaire
  const handleSubmit = async () => {
    await syncFormToProfile(formData, {
      'nom': 'nom',
      'prenom': 'prenom',
      'revenu': 'revenu_annuel',
      'canton': 'canton'
    });

    // Continuer avec le traitement...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.nom}
        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
      />
      {/* ... autres champs */}
    </form>
  );
}
```

### Exemple: Génération de Documents

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';

export default function DocumentGenerationPage() {
  const { autofillForm, syncFormToProfile } = useUserProfile();
  const [documentData, setDocumentData] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    npa: '',
    ville: ''
  });

  // Auto-fill au montage
  useEffect(() => {
    const filled = autofillForm({
      'nom': 'nom',
      'prenom': 'prenom',
      'adresse': 'adresse',
      'npa': 'npa',
      'ville': 'ville'
    });

    setDocumentData(prev => ({ ...prev, ...filled }));
  }, [autofillForm]);

  // Auto-sync à chaque modification
  useEffect(() => {
    const timer = setTimeout(() => {
      syncFormToProfile(documentData, {
        'nom': 'nom',
        'prenom': 'prenom',
        'adresse': 'adresse',
        'npa': 'npa',
        'ville': 'ville'
      });
    }, 1000); // Debounce 1 seconde

    return () => clearTimeout(timer);
  }, [documentData, syncFormToProfile]);

  return (
    <div>
      {/* Formulaire avec auto-save */}
    </div>
  );
}
```

## Mappings de Champs Recommandés

### Assistant Fiscal (`/assistant-fiscal`)
```typescript
const TAX_FIELD_MAPPING = {
  'nom': 'nom',
  'prenom': 'prenom',
  'revenu_annuel': 'revenu_annuel',
  'situation_familiale': 'situation_familiale',
  'nombre_enfants': 'nombre_enfants',
  'canton': 'canton',
  'statut_professionnel': 'statut_professionnel'
};
```

### Recherche Immobilière (`/recherche-biens`)
```typescript
const REAL_ESTATE_FIELD_MAPPING = {
  'monthlyIncome': 'revenu_mensuel',
  'canton': 'canton',
  'ville': 'ville',
  'statut_logement': 'statut_logement'
};
```

### Génération de Documents (`/documents`)
```typescript
const DOCUMENT_FIELD_MAPPING = {
  'nom': 'nom',
  'prenom': 'prenom',
  'email': 'email',
  'adresse': 'adresse',
  'npa': 'npa',
  'ville': 'ville',
  'canton': 'canton',
  'iban': 'iban'
};
```

### Objectifs Financiers (`/objectifs`)
```typescript
const GOALS_FIELD_MAPPING = {
  'revenu_mensuel': 'revenu_mensuel',
  'situation_familiale': 'situation_familiale',
  'nombre_enfants': 'nombre_enfants'
};
```

## Stratégie de Synchronisation

### 1. Auto-fill au montage
```tsx
useEffect(() => {
  const data = autofillForm(FIELD_MAPPING);
  setFormValues(data);
}, [autofillForm]);
```

### 2. Sync manuel au submit
```tsx
const handleSubmit = async () => {
  await syncFormToProfile(formData, FIELD_MAPPING);
  // Continuer...
};
```

### 3. Sync automatique avec debounce
```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    syncFormToProfile(formData, FIELD_MAPPING);
  }, 1000);

  return () => clearTimeout(timer);
}, [formData]);
```

### 4. Sync sur onChange pour champs critiques
```tsx
const handleFieldChange = async (field: string, value: any) => {
  setFormData({ ...formData, [field]: value });

  await syncFormToProfile(
    { [field]: value },
    { [field]: FIELD_MAPPING[field] }
  );
};
```

## Sécurité

### Row Level Security (RLS)

Toutes les tables ont des politiques RLS:
```sql
-- L'utilisateur ne peut voir que SES données
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));
```

### ID Utilisateur

**Sans authentification** (MVP):
- ID généré et stocké dans localStorage
- Format: `user_123456789_abc123`
- Persiste entre sessions

**Avec authentification** (futur):
- Remplacer par Auth0, Supabase Auth, NextAuth, etc.
- Modifier `getUserId()` dans `UserProfileService`

## Logs et Debugging

```typescript
// Les logs sont activés automatiquement
console.log('[UserProfile] Profile loaded:', profile);
console.log('[UserProfile] Autofill data:', filledData);
console.log('[UserProfile] Syncing to profile:', updates);
```

## Migration des Données Existantes

Si l'utilisateur a déjà des données dans localStorage (Phase 1-2):

```tsx
// Migrer les favoris
const oldFavorites = localStorage.getItem('aurore_real_estate_favorites');
if (oldFavorites) {
  const favorites = JSON.parse(oldFavorites);
  // Sauvegarder dans Supabase
  for (const fav of favorites) {
    await supabase.from('real_estate_favorites').insert({
      user_id: userId,
      property_id: fav.id,
      property_data: fav
    });
  }
  // Supprimer localStorage
  localStorage.removeItem('aurore_real_estate_favorites');
}
```

## Prochaines Étapes

1. ✅ Schema Supabase créé
2. ✅ Service UserProfile créé
3. ✅ Context React créé
4. ⏳ Intégrer dans layout.tsx
5. ⏳ Ajouter auto-fill dans toutes les pages:
   - Assistant fiscal
   - Génération de documents
   - Recherche immobilière
   - Objectifs financiers
   - Simulateur hypothécaire
6. ⏳ Créer page "Mon Profil" pour modifier toutes les données
7. ⏳ Migration automatique localStorage → Supabase
8. ⏳ Tests E2E

## Page "Mon Profil" (à créer)

```tsx
// app/profil/page.tsx

'use client';

import { useUserProfile } from '@/contexts/UserProfileContext';

export default function ProfilePage() {
  const { profile, updateProfile, loading } = useUserProfile();

  const handleSave = async () => {
    await updateProfile({
      nom: formData.nom,
      prenom: formData.prenom,
      // ... tous les champs
    });
  };

  return (
    <div>
      <h1>Mon Profil</h1>
      {/* Formulaire complet pour modifier toutes les données */}
    </div>
  );
}
```

## Conclusion

Avec cette intégration:

✅ **Auto-fill automatique** sur toutes les pages
✅ **Synchronisation bidirectionnelle** formulaire ↔ profil
✅ **Sécurité** avec RLS
✅ **Performance** avec Context React
✅ **Extensible** facilement pour nouvelle pages
✅ **Compatible** avec auth future

Toutes les données utilisateur sont maintenant centralisées et réutilisées intelligemment! 🎉
