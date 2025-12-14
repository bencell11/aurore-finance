# Schémas Supabase - Aurore Finance

## 📋 Vue d'ensemble

Ce dossier contient tous les schémas SQL pour l'application Aurore Finance, incluant :
- **User Profiles** - Profils utilisateurs avec **Supabase Auth**
- **Maison des Finances** - Dashboard de santé financière (10 tables)
- **Tax Schema** - Données fiscales
- **GDPR Schema** - Conformité RGPD

## 🚀 Installation Rapide

**Nouveau projet ?** Suivez le guide complet : [QUICK_START.md](QUICK_START.md)

### Ordre d'installation recommandé

1. **user-profiles-schema-uuid.sql** - Table des profils utilisateurs
2. **maison-finances-schema-uuid.sql** - Dashboard Maison des Finances
3. **tax-schema.sql** (optionnel) - Données fiscales supplémentaires
4. **gdpr-schema.sql** (optionnel) - Conformité RGPD

## 📁 Structure du dossier

```
supabase/
├── QUICK_START.md                     # 📖 Guide rapide (15 min)
├── README.md                          # 📄 Ce fichier
├── user-profiles-schema-uuid.sql      # ✅ ACTIF - Profils utilisateurs (UUID)
├── maison-finances-schema-uuid.sql    # ✅ ACTIF - Maison des Finances (UUID)
├── tax-schema.sql                     # ⚙️ Optionnel - Fiscalité
├── gdpr-schema.sql                    # ⚙️ Optionnel - RGPD
├── schema.sql                         # 📜 Schéma principal application
└── archived/                          # 🗃️ Anciens schémas (non utilisés)
    ├── README.md
    ├── user-profiles-schema-text-ids.sql     # ❌ Ancien (auth locale)
    └── maison-finances-schema-text-ids.sql   # ❌ Ancien (auth locale)
```

## ⚠️ IMPORTANT : UUID + Supabase Auth

Cette application utilise **Supabase Auth** pour l'authentification.
Les `user_id` sont de type **UUID** au format : `550e8400-e29b-41d4-a716-446655440000`

**Utilisez uniquement** les fichiers avec le suffixe `-uuid.sql` !

### 🔒 Sécurité (RLS)

**RLS (Row Level Security) est ACTIVÉ** dans tous les schémas :
- L'application utilise Supabase Auth (JWT tokens)
- Les politiques RLS utilisent `auth.uid()` pour isoler les données par utilisateur
- Chaque utilisateur ne peut accéder qu'à ses propres données
- Sécurité native au niveau de la base de données

## 🚀 Installation complète

Consultez [QUICK_START.md](QUICK_START.md) pour le guide complet.

## 📞 Support

Pour toute question ou problème, consultez :
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation RLS](https://supabase.com/docs/guides/auth/row-level-security)
- Le code source dans `/lib/contexts/SupabaseAuthContext.tsx`
