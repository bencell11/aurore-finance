# Guide de Migration Supabase - Aurore Finance

## 🚨 IMPORTANT: Migration Requise

Pour que le dashboard et le formulaire LPP fonctionnent correctement, vous devez appliquer la migration SQL suivante dans votre base de données Supabase.

## Erreur actuelle

Si vous voyez cette erreur dans la console:
```
Could not find the 'adresse' column of 'user_profiles' in the schema cache
```

C'est parce que votre table `user_profiles` n'a pas encore les nouvelles colonnes.

## 📋 Instructions pour appliquer la migration

### Méthode 1: Via Supabase Dashboard (Recommandé)

1. **Ouvrez votre projet Supabase** : https://supabase.com/dashboard/project/gldvcudowxielzrpdsxz

2. **Allez dans SQL Editor** (icône 📝 dans le menu de gauche)

3. **Créez une nouvelle requête** (bouton "New query")

4. **Copiez-collez le contenu complet du fichier** :
   ```
   supabase/migrations/003_add_all_profile_fields.sql
   ```

5. **Exécutez la requête** (bouton "Run" ou Ctrl+Enter)

6. **Vérifiez le résultat** : Vous devriez voir une liste de colonnes incluant:
   - `date_naissance`
   - `adresse`
   - `npa`
   - `ville`
   - `statut_professionnel`
   - `carte_identite_recto_url`
   - `carte_identite_verso_url`
   - `genre`
   - `nationalite`
   - `telephone`
   - `langue`
   - `numero_avs`
   - `caisse_pension`
   - `activite_lucrative_suisse`

7. **Rafraîchissez votre application** et testez le dashboard

### Méthode 2: Via Supabase CLI (Pour développeurs)

```bash
# Si vous avez Supabase CLI installé
supabase db push

# Ou appliquez directement la migration
psql $DATABASE_URL -f supabase/migrations/003_add_all_profile_fields.sql
```

## ✅ Vérification

Après avoir appliqué la migration, vous pouvez vérifier que tout fonctionne:

### Test 1: Dashboard
1. Allez sur `/dashboard`
2. Cliquez sur "Mode édition"
3. Essayez de modifier les champs dans chaque section:
   - Informations personnelles
   - Localisation
   - Professionnel
   - Finances
4. Sauvegardez
5. Aucune erreur ne devrait apparaître dans la console

### Test 2: Recherche LPP
1. Allez sur `/recherche-lpp`
2. Le formulaire devrait s'auto-remplir avec vos données du dashboard
3. Les champs avec fond vert ✨ indiquent qu'ils ont été auto-remplis
4. Complétez le reste du formulaire
5. Suivez le processus jusqu'à la génération des documents

## 📊 Colonnes ajoutées

La migration ajoute **14 nouvelles colonnes** à la table `user_profiles`:

| Colonne | Type | Description |
|---------|------|-------------|
| `date_naissance` | DATE | Date de naissance |
| `adresse` | TEXT | Rue et numéro |
| `npa` | TEXT | Code postal |
| `ville` | TEXT | Ville |
| `statut_professionnel` | TEXT | Statut pro (employé, indépendant, etc.) |
| `carte_identite_recto_url` | TEXT | URL image recto carte d'identité |
| `carte_identite_verso_url` | TEXT | URL image verso carte d'identité |
| `genre` | TEXT | homme / femme / autre |
| `nationalite` | TEXT | Nationalité |
| `telephone` | TEXT | Numéro de téléphone |
| `langue` | TEXT | francais / allemand / italien / romanche / anglais |
| `numero_avs` | TEXT | Numéro AVS (756.XXXX.XXXX.XX) |
| `caisse_pension` | TEXT | Nom caisse de pension LPP |
| `activite_lucrative_suisse` | BOOLEAN | Activité lucrative en Suisse |

## 🔒 Sécurité

- La migration utilise `IF NOT EXISTS` donc elle est **idempotente** (peut être exécutée plusieurs fois sans risque)
- Les politiques RLS (Row Level Security) existantes s'appliquent automatiquement aux nouvelles colonnes
- Aucune donnée existante n'est modifiée ou supprimée

## ❓ Problèmes courants

### Erreur: "permission denied for table user_profiles"
**Solution**: Assurez-vous d'être connecté en tant que propriétaire de la base de données dans Supabase.

### Erreur: "column already exists"
**Solution**: C'est normal! La migration vérifie automatiquement et ignore les colonnes qui existent déjà.

### Les champs restent vides après auto-remplissage
**Solution**:
1. Vérifiez que la migration est bien appliquée
2. Remplissez d'abord les champs dans le dashboard
3. Rafraîchissez la page `/recherche-lpp`

## 🆘 Besoin d'aide?

Si vous rencontrez des problèmes:

1. Vérifiez les logs Supabase dans l'onglet "Logs"
2. Vérifiez la console du navigateur (F12) pour les erreurs
3. Assurez-vous que votre table `user_profiles` existe bien
4. Essayez de créer un nouveau profil utilisateur pour tester

## 📝 Rollback (en cas de problème)

Si vous devez annuler la migration:

```sql
-- ATTENTION: Ceci supprime les colonnes et leurs données!
ALTER TABLE user_profiles
DROP COLUMN IF EXISTS date_naissance,
DROP COLUMN IF EXISTS adresse,
DROP COLUMN IF EXISTS npa,
DROP COLUMN IF EXISTS ville,
DROP COLUMN IF EXISTS statut_professionnel,
DROP COLUMN IF EXISTS carte_identite_recto_url,
DROP COLUMN IF EXISTS carte_identite_verso_url,
DROP COLUMN IF EXISTS genre,
DROP COLUMN IF EXISTS nationalite,
DROP COLUMN IF EXISTS telephone,
DROP COLUMN IF EXISTS langue,
DROP COLUMN IF EXISTS numero_avs,
DROP COLUMN IF EXISTS caisse_pension,
DROP COLUMN IF EXISTS activite_lucrative_suisse;
```

⚠️ **Attention**: Le rollback supprime définitivement les données de ces colonnes!
