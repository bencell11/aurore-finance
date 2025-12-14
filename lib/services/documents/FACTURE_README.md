# 💼 Générateur de Factures Professionnelles

## Vue d'ensemble

Le générateur de factures permet de créer des factures professionnelles conformes aux normes suisses avec :
- ✅ TVA suisse (0%, 2.6%, 3.8%, 8.1%)
- ✅ Calculs automatiques (totaux HT, TVA, TTC)
- ✅ IBAN et coordonnées bancaires
- ✅ Numéro IDE/TVA
- ✅ Conditions de paiement personnalisables
- ✅ Jusqu'à 3 lignes de facturation
- ✅ Design professionnel prêt à imprimer

## Utilisation

### 1. Via l'interface Documents

1. Allez sur `/documents`
2. Cliquez sur le badge **💼 Facture**
3. Ou tapez : *"Je veux créer une facture professionnelle"*
4. Remplissez vos informations
5. Le système génère automatiquement le HTML prêt à imprimer

### 2. Exemples de demandes

```
"Je veux créer une facture pour mes prestations de conseil"
"Génère-moi une facture pour un client"
"J'ai besoin d'une facture professionnelle avec TVA"
"Facture pour services de développement web"
```

## Champs du formulaire

### Informations Émetteur (Vous)
| Champ | Requis | Auto-rempli | Description |
|-------|--------|-------------|-------------|
| Nom/Raison sociale | ✅ | ✅ | Votre entreprise ou nom complet |
| Adresse complète | ✅ | ✅ | Rue, NPA, Ville |
| Email | ✅ | ✅ | Email de contact |
| Téléphone | ✅ | ✅ | Numéro de téléphone |
| IBAN | ✅ | ❌ | Coordonnées bancaires suisses |
| Numéro IDE/TVA | ⚠️ | ❌ | Si assujetti TVA (ex: CHE-123.456.789 TVA) |

### Informations Client (Destinataire)
| Champ | Requis | Description |
|-------|--------|-------------|
| Nom du client | ✅ | Raison sociale ou nom complet |
| Adresse du client | ✅ | Adresse complète de facturation |
| Email du client | ❌ | Pour envoi électronique |

### Détails de la Facture
| Champ | Requis | Par défaut | Description |
|-------|--------|------------|-------------|
| Numéro de facture | ✅ | `F-2025-001` | Format: F-ANNÉE-NUMÉRO |
| Date de facture | ✅ | Aujourd'hui | Date d'émission |
| Date d'échéance | ✅ | +30 jours | Limite de paiement |
| Référence client | ❌ | - | Numéro de commande client |

### Lignes de Facturation

**Ligne 1** (Obligatoire):
- Description de l'article/service
- Quantité (nombre)
- Unité (heures, jours, pce, forfait)
- Prix unitaire HT (CHF)

**Lignes 2 & 3** (Optionnelles):
- Mêmes champs que la ligne 1
- Laissez vide si non utilisées

### TVA et Totaux
| Champ | Requis | Options | Description |
|-------|--------|---------|-------------|
| Taux de TVA | ✅ | 0%, 2.6%, 3.8%, 8.1% | Taux normal: 8.1% |
| Délai de paiement | ✅ | `30` jours | Nombre de jours |
| Conditions | ❌ | Virement bancaire | Mode de paiement |
| Notes supplémentaires | ❌ | - | Message personnalisé |

## Calculs Automatiques

Le système calcule automatiquement :

```typescript
// Pour chaque ligne
Ligne Total = Quantité × Prix unitaire

// Totaux
Sous-total HT = Somme(Ligne1 + Ligne2 + Ligne3)
Montant TVA = Sous-total HT × (Taux TVA / 100)
Total TTC = Sous-total HT + Montant TVA
```

### Exemple de calcul
```
Ligne 1: 10 heures × 150 CHF = 1'500 CHF
Ligne 2: 1 forfait × 200 CHF = 200 CHF
────────────────────────────────────────
Sous-total HT: 1'700 CHF
TVA (8.1%): 137.70 CHF
────────────────────────────────────────
TOTAL TTC: 1'837.70 CHF
```

## Taux de TVA Suisses

| Taux | Applicable à | Utilisation |
|------|-------------|-------------|
| **8.1%** | Taux normal | Services, marchandises standard |
| **3.8%** | Taux réduit | Hébergement (hôtels, locations touristiques) |
| **2.6%** | Taux spécial | Alimentation, médicaments, livres, journaux |
| **0%** | Exonération | Export, services internationaux, certaines prestations médicales |

## Conformité Légale

### Obligations suisses (Art. 22 al. 1 LTVA)
Chaque facture doit contenir :
- ✅ Nom et adresse de l'émetteur
- ✅ Nom et adresse du client
- ✅ Date de la facture
- ✅ Description des prestations
- ✅ Montant HT, taux et montant TVA, montant TTC
- ✅ Numéro IDE si assujetti TVA

### Numéro IDE (Identification des Entreprises)
- Format: `CHE-XXX.XXX.XXX TVA`
- Obligatoire si chiffre d'affaires > 100'000 CHF/an
- Obtention : [www.uid.admin.ch](https://www.uid.admin.ch)

## Format de Sortie

### HTML Prêt à Imprimer
- Design professionnel avec gradient bleu
- Tableau structuré des prestations
- Section conditions de paiement mise en évidence
- Coordonnées bancaires encadrées
- Footer avec métadonnées

### Impression en PDF
1. Ouvrez le fichier HTML généré
2. **Ctrl+P** (ou **Cmd+P** sur Mac)
3. Sélectionnez "Enregistrer au format PDF"
4. Ajustez les marges si nécessaire

## Personnalisation

### Auto-remplissage depuis le Profil
Les champs suivants sont automatiquement remplis depuis votre profil utilisateur :
- Nom/Raison sociale
- Adresse complète
- Email
- Téléphone

💡 **Astuce** : Complétez votre profil dans le Dashboard pour gagner du temps !

### Numérotation des Factures
Format recommandé :
```
F-2025-001    (Facture - Année - Numéro séquentiel)
F-2025-002
F-2025-003
...
```

Vous pouvez aussi utiliser :
- `INV-2025-001` (Invoice)
- `2025-001` (Simple)
- `2025/01/001` (Année/Mois/Numéro)

## Exemples d'Utilisation

### 1. Facture de Conseil
```
Description: Conseil financier personnalisé
Quantité: 10
Unité: heures
Prix unitaire: 150 CHF
TVA: 8.1%
```

### 2. Facture Développement Web
```
Ligne 1: Développement site web - 40 heures × 120 CHF
Ligne 2: Formation client - 4 heures × 100 CHF
Ligne 3: Hébergement annuel - 1 forfait × 500 CHF
TVA: 8.1%
```

### 3. Facture avec Frais de Déplacement
```
Ligne 1: Audit financier - 1 forfait × 2'500 CHF (TVA 8.1%)
Ligne 2: Frais de déplacement - 1 forfait × 150 CHF (TVA 0%)
Ligne 3: Rapport détaillé - 1 pce × 300 CHF (TVA 8.1%)
```

## Questions Fréquentes

### Q: Puis-je modifier la facture générée ?
**R**: Oui ! Le fichier HTML est modifiable. Ouvrez-le dans un éditeur de texte ou directement dans le navigateur pour ajuster les détails.

### Q: Comment gérer plusieurs taux de TVA sur une même facture ?
**R**: Actuellement, un seul taux de TVA est appliqué à toutes les lignes. Pour des taux différents, créez des factures séparées ou modifiez le HTML généré manuellement.

### Q: Puis-je ajouter mon logo ?
**R**: Oui ! Dans le HTML généré, ajoutez une balise `<img>` dans la section header avec l'URL ou le chemin de votre logo.

### Q: La facture est-elle juridiquement valable ?
**R**: Oui, le template respecte les obligations légales suisses (Art. 22 al. 1 LTVA). Vérifiez néanmoins que toutes vos informations sont correctes avant envoi.

### Q: Comment archiver mes factures ?
**R**: Sauvegardez les fichiers HTML générés dans un dossier dédié. Vous pouvez aussi les imprimer en PDF pour archivage à long terme (obligation légale : 10 ans en Suisse).

## Support Technique

### Erreurs Courantes

**"Champs manquants"**
- Vérifiez que tous les champs obligatoires (✅) sont remplis
- Assurez-vous que la ligne 1 de facturation est complète

**"IBAN invalide"**
- Format suisse: `CH93 0076 2011 6238 5295 7`
- 21 caractères (2 lettres + 19 chiffres)

**"Calculs incorrects"**
- Les calculs sont automatiques et précis à 2 décimales
- Vérifiez le taux de TVA sélectionné

### Contact
Pour toute question ou suggestion :
- Email : support@aurore-finance.ch
- GitHub Issues : [github.com/aurore-finance](https://github.com)

## Évolutions Futures

- [ ] Support multi-devises (EUR, USD, GBP)
- [ ] Factures récurrentes automatiques
- [ ] Intégration comptabilité (Banana, Bexio)
- [ ] Envoi automatique par email
- [ ] Suivi des paiements
- [ ] Relances automatiques
- [ ] Multi-langues (DE, IT, EN)
- [ ] Logo personnalisable via interface
- [ ] Plusieurs taux de TVA sur une même facture

---

**Version**: 1.0.0
**Dernière mise à jour**: Novembre 2025
**Licence**: Aurore Finance © 2025
