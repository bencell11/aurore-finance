# Migrations Supabase - Aurore Finance

## Comment appliquer une migration

### Via le Dashboard Supabase (Recommandé)

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Ouvrez votre projet `aurore-finance`
3. Allez dans **SQL Editor** (dans la barre latérale)
4. Cliquez sur **New query**
5. Copiez-collez le contenu du fichier `.sql` de migration
6. Cliquez sur **Run** pour exécuter

### Via Supabase CLI (Avancé)

```bash
# Si vous avez configuré Supabase CLI
npx supabase migration up
```

## Migrations disponibles

### `add_profile_fields.sql`

**Date**: 2025-01-XX
**Description**: Ajout de nouveaux champs au profil utilisateur pour synchronisation avec l'outil de recherche LPP

**Nouveaux champs ajoutés**:

#### Informations personnelles
- `numero_carte_identite` (TEXT) - Numéro de carte d'identité ou passeport
- `genre` (TEXT) - Genre: homme, femme, autre
- `nationalite` (TEXT) - Nationalité

#### Contact
- `telephone` (TEXT) - Numéro de téléphone
- `langue` (TEXT) - Langue principale: francais, allemand, italien, romanche, anglais

#### Professionnel
- `numero_avs` (TEXT) - Numéro AVS (format: 756.XXXX.XXXX.XX)
- `caisse_pension` (TEXT) - Nom de la caisse de pension LPP
- `activite_lucrative_suisse` (BOOLEAN) - Activité lucrative en Suisse (Oui/Non)

**Impact**: Aucun impact sur les données existantes. Tous les champs sont optionnels (NULL autorisé).

## Vérification après migration

Après avoir appliqué la migration, vérifiez que les colonnes ont bien été créées :

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;
```

## Rollback

Si vous devez annuler cette migration :

```sql
ALTER TABLE user_profiles
DROP COLUMN IF EXISTS numero_carte_identite,
DROP COLUMN IF EXISTS genre,
DROP COLUMN IF EXISTS nationalite,
DROP COLUMN IF EXISTS telephone,
DROP COLUMN IF EXISTS langue,
DROP COLUMN IF EXISTS numero_avs,
DROP COLUMN IF EXISTS caisse_pension,
DROP COLUMN IF EXISTS activite_lucrative_suisse;
```

⚠️ **Attention**: Le rollback supprimera définitivement les données de ces colonnes !
