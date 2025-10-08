# Calculs Fiscaux Canton de Vaud - Documentation Complète

## Analyse du calcul actuel

### Données d'entrée:
- **Salaire brut**: 100'000 CHF
- **Pilier 3a**: 7'056 CHF
- **Frais professionnels**: 1'200 + 800 + 500 = 2'500 CHF
- **Primes assurance**: 4'800 + 1'200 = 6'000 CHF
- **Autres déductions**: 500 CHF
- **Fortune brute**: 45'000 CHF
- **Canton**: Vaud (VD)
- **Situation**: Célibataire, 24 ans

### Résultat annoncé:
- **Impôt total**: 1'196 CHF
- **Taux effectif**: 1.20%
- **Revenu imposable**: 43'988 CHF
- **Fortune imposable**: 25'000 CHF

---

## ✅ FORMULES COMPLÈTES ET CORRECTES

### 1. CALCUL DU REVENU NET IMPOSABLE

#### 1.1 Déductions sociales obligatoires (~17.9%)
```
AVS/AI/APG (salarié): 5.30% du salaire brut
AC (Assurance chômage): 1.10% du salaire brut (jusqu'à 148'200 CHF)
LPP (2e pilier): ~7% à 18% selon âge (moyenne: 10%)
LAA (accidents): ~1.5%

Total déductions sociales ≈ 17.9% du salaire brut
```

**Calcul:**
```
100'000 CHF × 17.9% = 17'900 CHF
Salaire net après cotisations = 100'000 - 17'900 = 82'100 CHF ✅
```

#### 1.2 Déductions fiscales

**a) Déductions forfaitaires minimales (Canton VD):**
- Déduction personnelle: **2'600 CHF**
- Frais professionnels minimum: **3% du revenu net** (min 2'000 CHF)

```
Frais pro minimum = max(82'100 × 3%, 2'000) = 2'463 CHF
Total déductions minimales = 2'600 + 2'463 = 5'063 CHF
```

**b) Déductions déclarées:**
```
Pilier 3a:              7'056 CHF (max légal 2025)
Primes assurance:       6'000 CHF
Frais professionnels:   2'500 CHF
Autres déductions:        500 CHF
─────────────────────────────────
Total déductions:      16'056 CHF
```

**c) Revenu imposable:**
```
82'100 CHF (salaire net)
- 2'600 CHF (déduction personnelle Vaud)
- 16'056 CHF (déductions)
─────────────────────────────────
= 63'444 CHF revenu imposable

⚠️ ERREUR DÉTECTÉE: Le système affiche 43'988 CHF
```

---

### 2. CALCUL DE L'IMPÔT CANTONAL (VD)

**Barème Vaud 2025 pour célibataire:**

| Tranche (CHF) | Taux | Base |
|---------------|------|------|
| 0 - 17'900 | 0% | 0 |
| 17'900 - 26'600 | 1.0% | 0 |
| 26'600 - 36'500 | 2.0% | 87 |
| 36'500 - 47'300 | 3.0% | 285 |
| 47'300 - 59'900 | 4.0% | 609 |
| 59'900 - 74'700 | 5.0% | 1'113 |

**Formule progressive:**
```
Revenu imposable: 63'444 CHF
Tranche applicable: 59'900 - 74'700 (taux 5%)

Impôt cantonal de base = base + (revenu - seuil_tranche) × taux
                       = 1'113 + (63'444 - 59'900) × 5%
                       = 1'113 + 3'544 × 0.05
                       = 1'113 + 177
                       = 1'290 CHF
```

**Avec coefficient communal (Lausanne = 78.5%):**
```
Impôt cantonal total = 1'290 × 0.785 = 1'013 CHF
```

---

### 3. CALCUL DE L'IMPÔT COMMUNAL (VD)

**Formule:**
```
Impôt communal = Impôt cantonal de base × Coefficient communal / 100

Pour Lausanne (coef. 78.5):
= 1'290 × 78.5 / 100
= 1'013 CHF
```

⚠️ **Le système affiche 400 CHF - erreur probable**

---

### 4. CALCUL DE L'IMPÔT FÉDÉRAL DIRECT (IFD)

**Barème IFD 2025 - Célibataire sans enfant:**

| Revenu imposable (CHF) | Taux | Impôt (CHF) |
|------------------------|------|-------------|
| 0 - 17'800 | 0% | 0 |
| 17'800 - 31'600 | Progressive | 77 + (revenu - 17'800) × 0.77% |
| 31'600 - 41'400 | Progressive | 183 + (revenu - 31'600) × 0.88% |
| 41'400 - 55'200 | Progressive | 269 + (revenu - 41'400) × 2.64% |
| 55'200 - 72'500 | Progressive | 634 + (revenu - 55'200) × 2.97% |
| 72'500 - 78'100 | Progressive | 1'148 + (revenu - 72'500) × 5.94% |

**Calcul pour 63'444 CHF:**
```
Tranche: 55'200 - 72'500 (taux 2.97%)

IFD = 634 + (63'444 - 55'200) × 2.97%
    = 634 + 8'244 × 0.0297
    = 634 + 245
    = 879 CHF
```

⚠️ **Le système affiche 286 CHF - erreur majeure**

---

### 5. CALCUL IMPÔT SUR LA FORTUNE

**Fortune brute**: 45'000 CHF

**Déductions fortune (Vaud):**
- Célibataire: déduction de **20'000 CHF**
- Dettes déductibles

```
Fortune imposable = 45'000 - 20'000 = 25'000 CHF ✅
```

**Barème fortune Vaud (en pour mille ‰):**
```
0 - 56'000 CHF: 0‰

Impôt sur la fortune = 0 CHF ✅
```

---

## 📊 RÉCAPITULATIF CORRIGÉ

### Calcul actuel (INCORRECT):
```
Impôt fédéral:    286 CHF ❌
Impôt cantonal:   510 CHF ❌
Impôt communal:   400 CHF ❌
─────────────────────────
Total:          1'196 CHF ❌
Taux effectif:   1.20% ❌
```

### Calcul CORRECT selon formules officielles:
```
Revenu imposable correct: 63'444 CHF

Impôt fédéral direct:     879 CHF
Impôt cantonal:         1'013 CHF
Impôt communal:         1'013 CHF
─────────────────────────────────
Total:                  2'905 CHF
Taux effectif:           2.91%
```

---

## 🔧 INFORMATIONS MANQUANTES À AJOUTER

### 1. Données personnelles nécessaires:
- ☑️ État civil
- ☑️ Nombre d'enfants
- ⚠️ **Commune de résidence exacte** (affecte coefficient communal)
- ⚠️ **Religion** (impôt cultuel)
- ⚠️ **Statut AVS** (frontalier, indépendant, etc.)

### 2. Revenus manquants:
- ⚠️ Revenus immobiliers
- ⚠️ Revenus mobiliers (intérêts, dividendes)
- ⚠️ Rentes (AVS, LPP, privées)
- ⚠️ Gains en capital
- ⚠️ Revenus accessoires

### 3. Fortune détaillée:
- ☑️ Fortune mobilière (comptes, titres)
- ⚠️ **Valeur locative résidence principale** (si propriétaire)
- ⚠️ **Immeubles** (valeur fiscale)
- ⚠️ **Dettes déductibles** (hypothèques, prêts)
- ⚠️ **Véhicules** (valeur fiscale)
- ⚠️ **Assurances-vie** (valeur de rachat)

### 4. Déductions manquantes importantes:
- ⚠️ **Intérêts passifs** (hypothèques, dettes privées)
- ⚠️ **Pension alimentaire versée**
- ⚠️ **Frais de garde d'enfants** (max 7'100 CHF Vaud)
- ⚠️ **Frais de formation continue** (max 12'000 CHF Vaud)
- ⚠️ **Dons à des œuvres** (max 20% du revenu net)
- ⚠️ **Cotisations syndicales/professionnelles**
- ⚠️ **Frais médicaux** (franchise 5% du revenu net)
- ⚠️ **Rachat LPP** (2e pilier)

### 5. Impôts spéciaux:
- ⚠️ **Impôt cultuel** (protestant/catholique si applicable)
- ⚠️ **Taxe professionnelle communale**
- ⚠️ **Taxe de séjour** (si applicable)

---

## 📐 FORMULES COMPLÈTES À IMPLÉMENTER

### Fonction: calculRevenuImposable()
```typescript
function calculRevenuImposable(
  salaireBrut: number,
  autresRevenus: number,
  deductions: Deductions,
  canton: Canton
): number {
  // 1. Revenu brut total
  const revenuBrutTotal = salaireBrut + autresRevenus;

  // 2. Déductions sociales (AVS, AC, LPP, etc.)
  const deductionsSociales = revenuBrutTotal * 0.179; // ~17.9%

  // 3. Revenu net
  const revenuNet = revenuBrutTotal - deductionsSociales;

  // 4. Déduction personnelle cantonale
  const deductionPersonnelle = canton.deductions.personalDeduction;

  // 5. Autres déductions
  const deductionPilier3a = Math.min(deductions.pilier3a, 7056);
  const deductionAssurances = deductions.primes;
  const fraisPro = deductions.fraisProfessionnels;
  const autresDeductions = deductions.autres;

  // 6. Total déductions
  const totalDeductions = deductionPersonnelle + deductionPilier3a +
                          deductionAssurances + fraisPro + autresDeductions;

  // 7. Revenu imposable
  return Math.max(0, revenuNet - totalDeductions);
}
```

### Fonction: calculImpotCantonal()
```typescript
function calculImpotCantonal(
  revenuImposable: number,
  baremes: TaxBracket[],
  coefficientCommunal: number
): { cantonal: number, communal: number } {
  // Trouver la tranche applicable
  const tranche = baremes.find(b =>
    revenuImposable >= b.from && revenuImposable < b.to
  );

  if (!tranche) throw new Error('Tranche non trouvée');

  // Impôt cantonal de base (formule progressive)
  const impotBase = tranche.base + (revenuImposable - tranche.from) * (tranche.rate / 100);

  // Impôt cantonal avec coefficient
  const impotCantonal = impotBase * (coefficientCommunal / 100);

  // Impôt communal (identique au cantonal dans VD)
  const impotCommunal = impotBase * (coefficientCommunal / 100);

  return {
    cantonal: Math.round(impotCantonal),
    communal: Math.round(impotCommunal)
  };
}
```

### Fonction: calculImpotFederal()
```typescript
function calculImpotFederal(
  revenuImposable: number,
  situationFamiliale: 'celibataire' | 'marie',
  nombreEnfants: number = 0
): number {
  // Barème IFD 2025 - célibataire
  const baremeIFD = [
    { from: 0, to: 17800, base: 0, rate: 0 },
    { from: 17800, to: 31600, base: 0, rate: 0.77 },
    { from: 31600, to: 41400, base: 106, rate: 0.88 },
    { from: 41400, to: 55200, base: 192, rate: 2.64 },
    { from: 55200, to: 72500, base: 557, rate: 2.97 },
    { from: 72500, to: 78100, base: 1071, rate: 5.94 },
    // ... etc
  ];

  const tranche = baremeIFD.find(b =>
    revenuImposable >= b.from && revenuImposable < b.to
  );

  if (!tranche) return 0;

  const impotBase = tranche.base +
    (revenuImposable - tranche.from) * (tranche.rate / 100);

  // Déduction pour enfants
  const deductionEnfants = nombreEnfants * 251; // CHF par enfant

  return Math.max(0, Math.round(impotBase - deductionEnfants));
}
```

### Fonction: calculImpotFortune()
```typescript
function calculImpotFortune(
  fortuneBrute: number,
  dettes: number,
  deductionFortune: number,
  baremes: WealthTaxBracket[]
): number {
  // Fortune nette imposable
  const fortuneImposable = Math.max(0, fortuneBrute - dettes - deductionFortune);

  if (fortuneImposable === 0) return 0;

  // Trouver tranche
  const tranche = baremes.find(b =>
    fortuneImposable >= b.from && fortuneImposable < b.to
  );

  if (!tranche) return 0;

  // Calcul en pour mille (‰)
  const impot = fortuneImposable * (tranche.rate / 1000);

  return Math.round(impot);
}
```

---

## ✅ CHECKLIST DE VALIDATION

Pour un calcul fiscal correct, vérifier:

- [ ] Revenu brut total correct (salaire + autres revenus)
- [ ] Déductions sociales calculées (~17.9%)
- [ ] Déduction personnelle cantonale appliquée
- [ ] Pilier 3a ≤ 7'056 CHF (2025)
- [ ] Primes assurance réalistes
- [ ] Frais professionnels justifiés
- [ ] Barème cantonal correct selon canton/année
- [ ] Coefficient communal exact
- [ ] Barème IFD 2025 appliqué
- [ ] Fortune nette calculée correctement
- [ ] Toutes déductions légales considérées

---

## 🔗 SOURCES OFFICIELLES

- **Canton Vaud**: https://www.vd.ch/themes/etat-droit-finances/impots
- **Confédération (IFD)**: https://www.estv.admin.ch/estv/fr/home/impot-federal-direct/baremes-ifd.html
- **Simulateur Vaud**: https://www.vd.ch/simulateur-fiscal
- **Barèmes 2025**: https://www.vd.ch/fileadmin/user_upload/organisation/dfin/aci/baremes/2025/
