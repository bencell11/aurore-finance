# Migration complète vers Supabase

## ⚠️ IMPORTANT - Cette migration est requise pour la sécurité et conformité RGPD

Le système actuel utilise localStorage qui:
- ❌ Stocke des données sensibles en clair
- ❌ N'est pas conforme RGPD/LPD
- ❌ Utilise un hashage de mot de passe faible
- ❌ Expose les données fiscales dans le navigateur

## 📋 Étapes de migration

### 1. Exécuter le schéma SQL dans Supabase

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet (gldvcudowxielzrpdsxz)
3. Va dans **SQL Editor**
4. Copie-colle le contenu de `supabase/migrations/001_initial_schema.sql`
5. Clique sur **Run** pour exécuter

Cela va créer:
- ✅ Tables: user_profiles, financial_profiles, financial_goals, user_actions, notification_settings
- ✅ Row Level Security (RLS) - chaque utilisateur ne voit que ses données
- ✅ Indexes pour performance
- ✅ Triggers pour updated_at automatique
- ✅ Politiques de sécurité strictes

### 2. Vérifier la création des tables

Dans **Table Editor**, tu devrais voir:
- `user_profiles`
- `financial_profiles`
- `financial_goals`
- `user_actions`
- `notification_settings`

### 3. Activer l'authentification Email/Password

1. Va dans **Authentication** → **Providers**
2. Active **Email**
3. Désactive "Confirm email" pour le développement (ou configure l'email SMTP)

### 4. Configurer les redirections (optionnel)

Dans **Authentication** → **URL Configuration**:
- Site URL: `https://aurorefinances.ch` (ou ton domaine)
- Redirect URLs: Ajoute `https://aurorefinances.ch/**`

## 🔐 Architecture de sécurité

### Comment l'IA accède aux données utilisateur de manière sécurisée

```
┌─────────────────┐
│   Frontend      │
│  (ChatBot IA)   │
└────────┬────────┘
         │
         │ 1. Requête avec session cookie
         │
         ▼
┌─────────────────────────────────────┐
│  API Route: /api/ai/get-user-context │
│  ─────────────────────────────────  │
│  1. Vérifie auth (Supabase session) │
│  2. RLS vérifie user_id              │
│  3. Récupère données déchiffrées     │
│  4. Retourne contexte sérialisé      │
└────────┬────────────────────────────┘
         │
         │ 2. Données utilisateur sécurisées
         │
         ▼
┌─────────────────┐
│   OpenAI API    │
│  (GPT-4)        │
│                 │
│  Reçoit:        │
│  - Revenus      │
│  - Charges      │
│  - Objectifs    │
│  - Profil       │
└─────────────────┘
```

### Flux de données pour l'assistant IA

1. **Frontend (ChatBot)** envoie une requête à `/api/ai/get-user-context`
2. **API Route** vérifie l'authentification via cookie Supabase
3. **Row Level Security** garantit que seules les données de l'utilisateur authentifié sont accessibles
4. **API** retourne le contexte utilisateur (déchiffré)
5. **Frontend** envoie ce contexte + question utilisateur à OpenAI
6. **OpenAI** génère une réponse personnalisée basée sur les données réelles

### Exemple d'utilisation dans le ChatBot

```typescript
// Dans ChatInterface.tsx ou MusicChatbot
async function sendMessageWithContext(userMessage: string) {
  // 1. Récupérer le contexte utilisateur
  const contextResponse = await fetch('/api/ai/get-user-context');
  const { data: userContext } = await contextResponse.json();

  // 2. Construire le prompt pour OpenAI
  const systemPrompt = `
Tu es Aurore, l'assistante fiscale et financière personnelle de ${userContext.user.prenom}.

Contexte utilisateur:
- Âge: ${userContext.user.age} ans
- Canton: ${userContext.user.canton}
- Situation: ${userContext.user.situationFamiliale}

Situation financière:
- Revenu annuel: CHF ${userContext.financial.revenuBrutAnnuel}
- Charges mensuelles: CHF ${userContext.financial.chargesTotal}
- Capacité d'épargne: CHF ${userContext.financial.capaciteEpargneMensuelle}/mois

Objectifs financiers:
${userContext.goals.map(g => `- ${g.titre}: ${g.montantActuel}/${g.montantCible} CHF (${g.progression.toFixed(1)}%)`).join('\n')}

Utilise ces informations pour donner des conseils personnalisés et précis.
`;

  // 3. Appeler OpenAI
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  });

  return response;
}
```

## 🔒 Sécurité des données

### Chiffrement

**Actuellement:** Les données financières ne sont PAS chiffrées dans la base de données PostgreSQL.

**Pourquoi:** Supabase PostgreSQL sur infrastructure Supabase Cloud bénéficie de:
- ✅ Chiffrement at-rest (AES-256) par défaut au niveau infrastructure
- ✅ Chiffrement en transit (TLS/SSL) pour toutes les connexions
- ✅ Row Level Security (RLS) garantit l'isolation des données

**Option chiffrement côté application (si requis):**

Si tu veux un chiffrement supplémentaire côté application (pour données ultra-sensibles):

```typescript
// lib/utils/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 bytes
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift()!, 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

Puis dans l'API route:
```typescript
import { encrypt, decrypt } from '@/lib/utils/encryption';

// Avant insertion
const encryptedRevenu = encrypt(revenuBrutAnnuel.toString());

// Après récupération
const decryptedRevenu = parseFloat(decrypt(financialProfile.revenu_brut_annuel));
```

## 📊 Conformité RGPD/LPD

Avec cette migration, tu obtiens:

✅ **Droit d'accès:** Utilisateur peut télécharger ses données via API
✅ **Droit à l'oubli:** Suppression en cascade avec `ON DELETE CASCADE`
✅ **Portabilité:** Export JSON via API
✅ **Sécurité:** RLS + Auth sécurisée + chiffrement infrastructure
✅ **Consentement:** À implémenter dans l'onboarding
✅ **Audit:** Table `user_actions` trace toutes les opérations

### Documents légaux requis (à créer)

1. **Politique de confidentialité** (`/legal/privacy-policy`)
2. **Conditions d'utilisation** (`/legal/terms`)
3. **Cookie policy** (`/legal/cookies`)
4. **Formulaire de consentement** (lors de l'inscription)

## 🧪 Test de la migration

### 1. Test d'authentification

```bash
# Dans la console du navigateur
const supabase = createClient();

// Inscription
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'SecurePassword123!'
});

// Connexion
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'SecurePassword123!'
});
```

### 2. Test RLS

Essaie d'accéder aux données d'un autre utilisateur - tu ne devrais voir que tes propres données.

### 3. Test API IA

```bash
curl -X GET http://localhost:3000/api/ai/get-user-context \
  -H "Cookie: sb-access-token=YOUR_TOKEN"
```

## 🚀 Prochaines étapes après migration

1. ✅ Exécuter la migration SQL
2. ⚠️ Mettre à jour AuthContext pour utiliser Supabase Auth
3. ⚠️ Mettre à jour OnboardingChatbot pour sauvegarder dans Supabase
4. ⚠️ Mettre à jour Dashboard pour charger depuis Supabase
5. ⚠️ Mettre à jour ChatInterface pour utiliser `/api/ai/get-user-context`
6. ⚠️ Supprimer ancien code localStorage (auth.service.ts, user-profile.service.ts)
7. ⚠️ Ajouter documents RGPD
8. ⚠️ Tester en production
9. ⚠️ Migrer données existantes (si utilisateurs réels)

## 📝 Notes importantes

- **Développement:** Email confirmation désactivée
- **Production:** Activer email confirmation + configurer SMTP
- **Backup:** Supabase fait des backups automatiques quotidiens
- **Scaling:** Plan gratuit = 500MB storage + 2GB transfer/mois
- **Région:** Choisis `eu-central-1` (Zurich) pour conformité suisse

## ❓ Questions fréquentes

**Q: Les anciennes données localStorage seront-elles migrées?**
R: Non, les utilisateurs devront recréer leur compte. Pour migration automatique, créer un script séparé.

**Q: Supabase est-il conforme RGPD?**
R: Oui, Supabase est hébergé sur AWS dans des régions EU et est conforme GDPR.

**Q: Combien coûte Supabase?**
R: Gratuit jusqu'à 500MB + 2GB transfer. Ensuite ~25$/mois pour Pro.

**Q: L'IA OpenAI voit-elle les données sensibles?**
R: Oui, pour donner des conseils personnalisés. OpenAI a une politique de non-utilisation des données API pour entraînement. Considère Azure OpenAI pour garanties contractuelles RGPD.

**Q: Puis-je self-host Supabase?**
R: Oui, Supabase est open-source et peut être self-hosted pour contrôle total.
