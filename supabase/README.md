# Schémas Supabase - Aurore Finance

## 📋 Vue d'ensemble

Ce dossier contient tous les schémas SQL pour l'application Aurore Finance, incluant :
- **User Profiles** - Profils utilisateurs avec authentification locale
- **Maison des Finances** - Dashboard de santé financière (10 tables)
- **Tax Schema** - Données fiscales
- **GDPR Schema** - Conformité RGPD

## 🚀 Installation Rapide

**Nouveau projet ?** Suivez le guide complet : [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

### Ordre d'installation recommandé

1. **user-profiles-schema-text-ids.sql** - Table des profils utilisateurs
2. **maison-finances-schema-text-ids.sql** - Dashboard Maison des Finances
3. **tax-schema.sql** (optionnel) - Données fiscales supplémentaires
4. **gdpr-schema.sql** (optionnel) - Conformité RGPD

## 📁 Structure du dossier

```
supabase/
├── INSTALLATION_GUIDE.md              # 📖 Guide d'installation complet
├── README.md                          # 📄 Ce fichier
├── user-profiles-schema-text-ids.sql # ✅ ACTIF - Profils utilisateurs
├── maison-finances-schema-text-ids.sql # ✅ ACTIF - Maison des Finances
├── tax-schema.sql                    # ⚙️ Optionnel - Fiscalité
├── gdpr-schema.sql                   # ⚙️ Optionnel - RGPD
├── schema.sql                        # 📜 Schéma principal application
├── migrations/                       # 📦 Migrations Supabase
│   └── create_maison_finances.sql
└── archived/                         # 🗃️ Anciens schémas (non utilisés)
    ├── README.md
    └── maison-finances-schema-uuid.sql
```

## ⚠️ IMPORTANT : user_id TEXT vs UUID

Cette application utilise un système d'authentification **local** (sans Supabase Auth).
Les `user_id` sont de type **TEXT** au format : `user_1765472564442_w202hw7`

**Utilisez uniquement** les fichiers avec le suffixe `-text-ids.sql` !

## 📚 Documentation par schéma

---

### 1. User Profiles

**Fichier** : `user-profiles-schema-text-ids.sql`

Crée la table `user_profiles` pour stocker les informations utilisateurs.

**Champs principaux** :
- Informations personnelles (nom, prénom, date de naissance)
- Informations fiscales (revenu, situation familiale)
- Informations professionnelles (statut, employeur, AVS)
- Informations bancaires (IBAN, banque)
- Informations de contact (adresse, téléphone)

**Sécurité** : RLS activé avec policies par user_id

---

### 2. Maison des Finances (RECOMMANDÉ)

**Fichier** : `maison-finances-schema-text-ids.sql`

Dashboard de santé financière avec visualisation en 3D d'une maison.

**Architecture** :
- **1 table principale** : `maison_finances` (métadonnées et scores globaux)
- **9 tables de données** : Une par section de la maison
  - `sante_data` - Étage 0 : Sécurité
  - `revenu_data` - Étage 0 : Sécurité
  - `biens_data` - Étage 0 : Sécurité
  - `vieillesse_data` - Étage 1 : Planification
  - `fortune_data` - Étage 1 : Planification
  - `immobilier_data` - Combles : Développement
  - `budget_data` - Combles : Développement
  - `fiscalite_data` - Toiture : Optimisation
  - `juridique_data` - Toiture : Optimisation

### Fonctionnalités incluses

✅ **Row Level Security (RLS)** - Chaque utilisateur ne peut accéder qu'à ses propres données
✅ **Indexes de performance** - Requêtes optimisées sur `user_id`
✅ **Triggers automatiques** - Mise à jour automatique de `updated_at`
✅ **Fonction RPC optimisée** - `get_maison_finances_complete(user_id)` pour charger toutes les données en 1 requête
✅ **Contraintes de validation** - Types vérifiés (ENUM, CHECK constraints)
✅ **Cascade DELETE** - Suppression automatique des données liées

## 🚀 Installation

### Étape 1 : Accéder à Supabase SQL Editor

1. Ouvrez votre projet Supabase : https://app.supabase.com
2. Sélectionnez votre projet
3. Cliquez sur **SQL Editor** dans la barre latérale gauche
4. Cliquez sur **New query**

### Étape 2 : Copier et exécuter le script

1. Ouvrez le fichier `maison-finances-schema.sql`
2. Copiez **tout le contenu** du fichier
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter` / `Cmd+Enter`)

### Étape 3 : Vérifier l'installation

Exécutez cette requête pour vérifier que toutes les tables ont été créées :

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (table_name LIKE '%_data' OR table_name = 'maison_finances')
ORDER BY table_name;
```

Vous devriez voir **10 tables** :
- `biens_data`
- `budget_data`
- `fiscalite_data`
- `fortune_data`
- `immobilier_data`
- `juridique_data`
- `maison_finances`
- `revenu_data`
- `sante_data`
- `vieillesse_data`

### Étape 4 : Tester la fonction RPC

Testez que la fonction RPC fonctionne correctement :

```sql
SELECT get_maison_finances_complete(auth.uid());
```

Si vous n'avez pas encore de données, cela devrait retourner `NULL` (c'est normal).

## 🔒 Sécurité (RLS)

Toutes les tables sont protégées par **Row Level Security**. Les politiques garantissent que :

- ✅ Chaque utilisateur peut **SELECT/INSERT/UPDATE/DELETE** uniquement ses propres données
- ✅ `auth.uid()` est automatiquement comparé à `user_id` pour chaque opération
- ✅ Aucune donnée ne peut être lue ou modifiée par un autre utilisateur

## 🎯 Utilisation dans l'application

### Charger les données complètes (Recommandé)

```typescript
import { MaisonFinancesService } from '@/lib/services/maison-finances.service';

// UNE SEULE requête pour charger toutes les données
const data = await MaisonFinancesService.loadComplete(userId);
```

### Sauvegarder une section

```typescript
await MaisonFinancesService.saveSection(userId, 'sante', {
  assurance_lamal_nom: 'Groupe Mutuel',
  assurance_lamal_prime_mensuelle: 385.50,
  assurance_lamal_franchise: 2500,
  // ... autres champs
});
```

### Mettre à jour le score global

```typescript
await MaisonFinancesService.updateGlobalScore(userId);
```

## 📊 Structure des données

Consultez `/lib/types/maison-finances.ts` pour voir les interfaces TypeScript complètes correspondant à chaque table.

### Exemple de données JSONB

Certaines colonnes utilisent JSONB pour stocker des structures complexes :

**vehicules** (dans `biens_data`) :
```json
[
  {
    "type": "voiture",
    "marque": "Toyota Corolla",
    "valeur_estimee": 25000,
    "assurance_nom": "AXA",
    "assurance_type": "casco_complete",
    "prime_annuelle": 1200
  }
]
```

**comptes_titres_repartition** (dans `fortune_data`) :
```json
{
  "actions_suisses": 30,
  "actions_etrangeres": 25,
  "obligations": 20,
  "fonds": 15,
  "etf": 10,
  "autres": 0
}
```

## 🛠️ Maintenance

### Réinitialiser les données d'un utilisateur

```sql
-- Supprimer toutes les données d'un utilisateur
DELETE FROM maison_finances WHERE user_id = 'uuid-de-lutilisateur';
-- Les tables liées seront automatiquement supprimées grâce à ON DELETE CASCADE
```

### Voir toutes les politiques RLS

```sql
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN (
  'maison_finances', 'sante_data', 'revenu_data', 'biens_data',
  'vieillesse_data', 'fortune_data', 'immobilier_data',
  'budget_data', 'fiscalite_data', 'juridique_data'
);
```

## 📝 Notes importantes

1. **Unique constraint sur user_id** : Chaque utilisateur ne peut avoir qu'un seul enregistrement par table
2. **Cascade DELETE** : Si un utilisateur est supprimé de `auth.users`, toutes ses données sont automatiquement supprimées
3. **Timestamps automatiques** : `created_at` et `updated_at` sont gérés automatiquement par des triggers
4. **Types CHECK** : Les valeurs invalides (ex: score > 100) sont automatiquement rejetées
5. **JSONB vs JSON** : Nous utilisons JSONB pour des performances optimales avec indexation possible

## 🐛 Dépannage

### Erreur : "relation already exists"

Si vous réexécutez le script, certaines tables/fonctions existent déjà. C'est normal grâce aux `IF NOT EXISTS`.

### Erreur : "permission denied"

Vérifiez que vous êtes bien connecté en tant qu'administrateur du projet Supabase.

### La fonction RPC retourne une erreur

Assurez-vous que toutes les tables ont été créées avant de créer la fonction RPC.

## 📞 Support

Pour toute question ou problème, consultez :
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- Le code source dans `/lib/services/maison-finances.service.ts`
