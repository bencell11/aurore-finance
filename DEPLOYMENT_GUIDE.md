# 🚀 Guide de Déploiement - Assistant Fiscal Suisse Production

## ⚡ Sortir du Mode Démo (Commande Rapide)

```bash
npm run exit-demo
```

Cette commande lance le script interactif de configuration automatique.

## 📋 Checklist de Déploiement

### 1. **Prérequis**
- [ ] Compte Supabase créé
- [ ] Clé API OpenAI ou Anthropic
- [ ] Domaine configuré (optionnel)
- [ ] Certificat SSL (pour production)

### 2. **Configuration Base de Données**

#### A. Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et les clés API

#### B. Migrer les tables
```bash
# Pousser les migrations vers Supabase
npm run supabase:migrate

# Seed initial des données
npm run supabase:seed
```

### 3. **Variables d'Environnement**

Créer le fichier `.env.local` :

```bash
# Configuration automatique
npm run setup-production

# OU configuration manuelle
cp .env.local.example .env.local
# Puis éditer .env.local avec vos vraies clés
```

**Variables obligatoires :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
OPENAI_API_KEY=sk-...
ENCRYPTION_KEY=votre-cle-256-bits
DEMO_MODE=false
```

### 4. **Test de la Configuration**

```bash
# Vérifier l'environnement
npm run check-env

# Lancer en mode production
npm run build
npm run start
```

### 5. **Déploiement sur Vercel**

#### A. Via CLI Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement sur Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add ENCRYPTION_KEY
vercel env add DEMO_MODE false
```

#### B. Via GitHub (recommandé)
1. Pousser le code sur GitHub
2. Connecter le repo à Vercel
3. Ajouter les variables d'environnement dans Vercel Dashboard
4. Déployer automatiquement

### 6. **Configuration Domaine (Optionnel)**

```bash
# Dans Vercel Dashboard
1. Aller dans Settings > Domains
2. Ajouter votre domaine personnalisé
3. Configurer les DNS selon les instructions
```

## 🔒 Sécurité et Conformité RGPD

### Configuration Supabase RLS
```sql
-- Les politiques RLS sont automatiquement appliquées via migrations
-- Vérifier dans Supabase Dashboard > Authentication > Policies
```

### Chiffrement des Données
- Données sensibles chiffrées avec AES-256
- Clés de chiffrement séparées en variables d'environnement
- Audit trail pour toutes les actions

### Conformité RGPD
- ✅ Chiffrement des données personnelles
- ✅ Logs d'audit automatiques  
- ✅ Droit à l'oubli (suppression)
- ✅ Exportation des données
- ✅ Consentement utilisateur

## 📊 Monitoring et Maintenance

### Logs et Erreurs
```bash
# Logs Vercel
vercel logs

# Logs Supabase
# Accessible via Supabase Dashboard > Reports
```

### Base de Données
```bash
# Backup automatique Supabase activé par défaut
# Restauration via Supabase Dashboard

# Monitoring des performances
# Table audit_logs pour traçabilité
```

### Mise à Jour des Taux Fiscaux
```bash
# Mettre à jour swiss-tax-database.ts avec les nouveaux taux
# Redéployer l'application
```

## 🆘 Dépannage

### Problèmes Courants

#### 1. Erreur de connexion Supabase
```bash
# Vérifier les variables d'environnement
npm run check-env

# Tester la connexion
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

#### 2. Erreur de chiffrement
```bash
# Régénérer une clé de chiffrement
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3. Mode démo persistant
```bash
# Vérifier DEMO_MODE dans .env.local
grep DEMO_MODE .env.local

# Doit afficher : DEMO_MODE=false
```

#### 4. Calculs fiscaux incorrects
```bash
# Vérifier swiss-tax-database.ts
# Mettre à jour avec les derniers taux officiels
```

### Support

- 📧 **Email** : support@aurore-finance.ch
- 📚 **Documentation** : [docs.aurore-finance.ch](https://docs.aurore-finance.ch)
- 🐛 **Issues GitHub** : [github.com/aurore-finance/issues](https://github.com/aurore-finance/issues)

## ✅ Validation du Déploiement

Une fois déployé, vérifier :

1. [ ] **Page d'accueil** se charge sans erreur
2. [ ] **Authentification** fonctionne
3. [ ] **Création de profil** sauvegarde en DB
4. [ ] **Calculs fiscaux** utilisent vraies formules
5. [ ] **Export PDF** génère documents
6. [ ] **Chatbot IA** répond correctement
7. [ ] **Mode démo** est désactivé
8. [ ] **Conformité RGPD** respectée

## 🚀 Post-Déploiement

### Marketing et Lancement
- Configurer Google Analytics
- Mettre en place monitoring d'erreurs (Sentry)
- Configurer système de support client
- Préparer documentation utilisateur

### Évolutions Futures
- Intégration APIs fiscales cantonales temps réel
- Module de soumission électronique
- Connexion banques suisses (Open Banking)
- Intelligence artificielle avancée (GPT-4)

---

**🎉 Félicitations ! Votre Assistant Fiscal Suisse est maintenant en production !**