# 📦 Fichiers SQL Archivés

Ce dossier contient les anciennes versions des schémas SQL qui ne sont plus utilisées activement.

## Fichiers archivés

### maison-finances-schema-uuid.sql
**Date d'archivage** : 14 décembre 2024
**Raison** : Remplacé par `maison-finances-schema-text-ids.sql`
**Différence** : Utilisait `user_id UUID` au lieu de `user_id TEXT`

Ce fichier a été archivé car l'application utilise un système d'authentification local qui génère des IDs de type TEXT (ex: `user_1765472564442_w202hw7`) plutôt que des UUIDs.

**Ne pas utiliser** sauf si vous voulez revenir à un système d'authentification Supabase Auth avec des UUIDs.

## Schémas actifs (à utiliser)

Les fichiers suivants sont dans le dossier parent et doivent être utilisés :

1. **user-profiles-schema-text-ids.sql** - Table user_profiles avec user_id TEXT
2. **maison-finances-schema-text-ids.sql** - Tables Maison des Finances avec user_id TEXT

Consultez le fichier `INSTALLATION_GUIDE.md` pour les instructions d'installation.

## Autres schémas

Les fichiers suivants sont toujours actifs et peuvent être utilisés selon les besoins :

- **schema.sql** - Schéma principal de l'application
- **tax-schema.sql** - Schéma pour les données fiscales
- **gdpr-schema.sql** - Schéma pour la conformité GDPR

## Notes

Si vous avez besoin de restaurer un ancien schéma, assurez-vous de :
1. Supprimer les tables existantes avec `DROP TABLE ... CASCADE;`
2. Vérifier la compatibilité avec le code de l'application
3. Mettre à jour les types TypeScript si nécessaire
