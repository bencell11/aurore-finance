# Formules Fiscales Complètes - 26 Cantons Suisses

## 📐 Formules Générales (Applicables à tous les cantons)

### 1. Revenu Net Imposable

```typescript
RevenuNet = RevenuBrut - CotisationsSociales

CotisationsSociales = {
  AVS/AI/APG: 5.30% du salaire brut (salarié)
  AC (chômage): 1.10% jusqu'à 148'200 CHF (2025)
  LPP (2e pilier): 7-18% selon âge (moyenne ~10%)
  LAA (accidents): ~1.5%
  Total: ~17.9% du salaire brut
}

RevenuImposable = RevenuNet - DéductionPersonnelle - AutresDéductions
```

### 2. Impôt Fédéral Direct (IFD) - Identique pour tous les cantons

**Barème IFD 2025 - Personne seule sans enfant:**

| Revenu imposable (CHF) | Formule |
|------------------------|---------|
| 0 - 17'800 | **0 CHF** |
| 17'800 - 31'600 | **77 + (R - 17'800) × 0.77%** |
| 31'600 - 41'400 | **183 + (R - 31'600) × 0.88%** |
| 41'400 - 55'200 | **269 + (R - 41'400) × 2.64%** |
| 55'200 - 72'500 | **634 + (R - 55'200) × 2.97%** |
| 72'500 - 78'100 | **1'148 + (R - 72'500) × 5.94%** |
| 78'100 - 103'600 | **1'481 + (R - 78'100) × 6.60%** |
| 103'600 - 134'600 | **3'164 + (R - 103'600) × 8.80%** |
| 134'600 - 176'000 | **5'891 + (R - 134'600) × 11.00%** |
| 176'000 - 755'200 | **10'445 + (R - 176'000) × 13.20%** |
| > 755'200 | **86'890 + (R - 755'200) × 11.50%** |

**Couple marié (splitting):**
```
IFD = 2 × IFD(Revenu_total / 2)
```

---

## 🏔️ CANTON DE VAUD (VD)

### Particularités:
- **Système**: Impôt cantonal + communal (identiques avec coefficient)
- **Splitting**: Partiel pour couples mariés
- **Déduction sociale**: Pour bas revenus

### Formule Impôt Cantonal VD

**Barème 2025 - Personne seule:**

| Revenu (CHF) | Formule |
|--------------|---------|
| 0 - 17'900 | **0** |
| 17'900 - 26'600 | **(R - 17'900) × 1.0%** |
| 26'600 - 36'500 | **87 + (R - 26'600) × 2.0%** |
| 36'500 - 47'300 | **285 + (R - 36'500) × 3.0%** |
| 47'300 - 59'900 | **609 + (R - 47'300) × 4.0%** |
| 59'900 - 74'700 | **1'113 + (R - 59'900) × 5.0%** |
| 74'700 - 91'100 | **1'853 + (R - 74'700) × 6.0%** |
| 91'100 - 109'700 | **2'837 + (R - 91'100) × 7.0%** |
| 109'700 - 130'500 | **4'139 + (R - 109'700) × 8.0%** |
| 130'500 - 153'900 | **5'803 + (R - 130'500) × 9.0%** |
| 153'900 - 180'300 | **7'909 + (R - 153'900) × 10.0%** |
| 180'300 - 211'100 | **10'549 + (R - 180'300) × 11.0%** |
| 211'100 - 262'300 | **13'937 + (R - 211'100) × 11.5%** |
| > 262'300 | **19'825 + (R - 262'300) × 12.0%** |

**Formule complète:**
```typescript
ImpôtCantonalBase = Calcul_selon_barème(RevenuImposable)
ImpôtCantonal = ImpôtCantonalBase × (CoefficientCommunal / 100)
ImpôtCommunal = ImpôtCantonalBase × (CoefficientCommunal / 100)
ImpôtTotal_VD = IFD + ImpôtCantonal + ImpôtCommunal
```

**Coefficients communaux (exemples):**
- Lausanne: 78.5%
- Yverdon: 73.5%
- Montreux: 63.5%
- Nyon: 61.0%

**Déductions spécifiques VD:**
```
DéductionPersonnelle: 2'600 CHF
Pilier3a_max: 7'056 CHF (salarié) / 35'280 CHF (indépendant)
Assurances_max: 2'000 CHF (célibataire) / 3'200 CHF (marié)
FraisPro_transport_max: 6'700 CHF
FraisPro_repas_max: 3'200 CHF
GardeEnfants_max: 7'100 CHF
FormationContinue_max: 12'000 CHF
```

**Impôt sur la fortune VD (en ‰):**

| Fortune (CHF) | Taux |
|---------------|------|
| 0 - 56'000 | 0‰ |
| 56'000 - 112'000 | 0.5‰ |
| 112'000 - 212'000 | 1.0‰ |
| 212'000 - 312'000 | 2.0‰ |
| 312'000 - 412'000 | 3.0‰ |
| 412'000 - 812'000 | 5.0‰ |
| 812'000 - 1'212'000 | 6.0‰ |
| 1'212'000 - 2'012'000 | 7.0‰ |
| > 2'012'000 | 8.6‰ |

```
DéductionFortune_célibataire: 20'000 CHF
ImpôtFortune = (FortuneBrute - DéductionFortune) × Taux‰ / 1000
```

---

## 🌆 CANTON DE GENÈVE (GE)

### Particularités:
- **Splitting intégral** pour couples mariés
- **Bouclier fiscal**: Maximum 60% du revenu
- **Taxation**: Postnumerando (année suivante)

### Formule Impôt Cantonal GE

**Barème 2025 - Personne seule:**

| Revenu (CHF) | Taux (%) | Formule |
|--------------|----------|---------|
| 0 - 17'877 | 0 | **0** |
| 17'877 - 21'416 | 8.0 | **(R - 17'877) × 8%** |
| 21'416 - 23'255 | 9.0 | **283 + (R - 21'416) × 9%** |
| 23'255 - 25'094 | 10.0 | **449 + (R - 23'255) × 10%** |
| 25'094 - 26'933 | 11.0 | **633 + (R - 25'094) × 11%** |
| 26'933 - 28'772 | 12.0 | **835 + (R - 26'933) × 12%** |
| 28'772 - 32'451 | 13.0 | **1'056 + (R - 28'772) × 13%** |
| 32'451 - 36'129 | 13.5 | **1'534 + (R - 32'451) × 13.5%** |
| 36'129 - 39'807 | 14.0 | **2'031 + (R - 36'129) × 14%** |
| 39'807 - 45'325 | 14.5 | **2'546 + (R - 39'807) × 14.5%** |
| 45'325 - 119'719 | 15.0 | **3'346 + (R - 45'325) × 15%** |
| 119'719 - 160'631 | 15.5 | **14'505 + (R - 119'719) × 15.5%** |
| 160'631 - 181'196 | 16.0 | **20'847 + (R - 160'631) × 16%** |
| 181'196 - 259'040 | 16.5 | **24'137 + (R - 181'196) × 16.5%** |
| 259'040 - 276'098 | 17.0 | **36'981 + (R - 259'040) × 17%** |
| 276'098 - 388'480 | 17.5 | **39'881 + (R - 276'098) × 17.5%** |
| 388'480 - 609'635 | 18.0 | **59'548 + (R - 388'480) × 18%** |
| 609'635 - 833'529 | 18.5 | **99'356 + (R - 609'635) × 18.5%** |
| > 833'529 | 19.0 | **140'777 + (R - 833'529) × 19%** |

**Formule complète GE:**
```typescript
ImpôtCantonalBase = Calcul_selon_barème(RevenuImposable)
ImpôtCantonal = ImpôtCantonalBase × (45.5 / 100) // Coef. Genève-ville
ImpôtCommunal = ImpôtCantonalBase × (CoefficientCommune / 100)

// Bouclier fiscal
if (ImpôtTotal > RevenuNet × 0.60) {
  ImpôtTotal = RevenuNet × 0.60
}
```

**Déductions spécifiques GE:**
```
DéductionPersonnelle: 10'000 CHF
Pilier3a_max: 7'056 CHF
Assurances_max: 2'200 CHF (célibataire) / 3'400 CHF (marié)
GardeEnfants_max: 25'000 CHF
```

**Impôt fortune GE (en ‰):**

| Fortune (CHF) | Taux |
|---------------|------|
| 0 - 113'318 | 0‰ |
| 113'318 - 226'636 | 2.25‰ |
| 226'636 - 339'954 | 3.0‰ |
| 339'954 - 453'272 | 3.5‰ |
| > 3'399'539 | 10.0‰ |

---

## 🏙️ CANTON DE ZURICH (ZH)

### Particularités:
- **Taux maximum**: 13% (le plus bas de Suisse)
- **Système simple**: Barème linéaire
- **Coefficient élevé**: Ville de Zurich à 119%

### Formule Impôt Cantonal ZH

**Barème 2025 - Personne seule:**

| Revenu (CHF) | Taux (%) |
|--------------|----------|
| 0 - 13'300 | 0 |
| 13'300 - 19'700 | 2.0 |
| 19'700 - 31'300 | 3.0 |
| 31'300 - 44'200 | 4.0 |
| 44'200 - 66'200 | 5.0 |
| 66'200 - 88'100 | 6.0 |
| 88'100 - 122'000 | 7.0 |
| 122'000 - 170'900 | 8.0 |
| 170'900 - 241'600 | 9.0 |
| 241'600 - 354'100 | 10.0 |
| 354'100 - 531'400 | 11.0 |
| 531'400 - 885'700 | 12.0 |
| > 885'700 | 13.0 |

**Formule ZH:**
```typescript
ImpôtCantonalBase = RevenuImposable × Taux_tranche%
ImpôtCantonal = ImpôtCantonalBase
ImpôtCommunal = ImpôtCantonalBase × (CoefficientCommunal / 100)
```

**Coefficients communaux ZH:**
- Zurich: 119%
- Winterthur: 122%
- Uster: 99%

**Déductions ZH:**
```
DéductionPersonnelle: 11'000 CHF
Pilier3a_max: 7'056 CHF
Assurances_max: 2'600 CHF (célibataire)
FraisPro_min: 4% du revenu (min 2'400 CHF, max 8'200 CHF)
```

---

## 🏔️ CANTON DE BERNE (BE)

### Formule Impôt Cantonal BE

**Barème 2025 - Personne seule:**

| Revenu (CHF) | Taux (%) |
|--------------|----------|
| 0 - 15'200 | 0 |
| 15'200 - 21'200 | 2.46 |
| 21'200 - 27'300 | 3.04 |
| 27'300 - 33'700 | 3.68 |
| > 242'300 | 14.00 |

**Formule BE:**
```typescript
ImpôtCantonalBase = Calcul_selon_barème(RevenuImposable)
ImpôtCantonal = ImpôtCantonalBase × 3.06 // Coefficient cantonal fixe
ImpôtCommunal = ImpôtCantonalBase × (CoefficientCommune / 100)
```

**Particularité BE**: Triple système (canton + commune + paroisse)

---

## 🌄 CANTON DU VALAIS (VS)

### Formule Impôt Cantonal VS

**Barème progressif par tranches:**

| Revenu (CHF) | Taux (%) |
|--------------|----------|
| 0 - 24'000 | 0 |
| 24'000 - 40'000 | 9.0 |
| 40'000 - 60'000 | 10.5 |
| 60'000 - 100'000 | 12.0 |
| > 150'000 | 14.0 |

**Coefficients communaux VS:**
- Sion: 150%
- Martigny: 145%
- Monthey: 148%

---

## 🏔️ CANTON DE NEUCHÂTEL (NE)

### Formule Impôt Cantonal NE

**Taux unique progressif:**

```typescript
Taux = 5.2% + (RevenuImposable / 100'000) × 3.8%
TauxMax = 15.4%

ImpôtCantonal = RevenuImposable × min(Taux, TauxMax)
```

---

## 🌊 CANTON DE FRIBOURG (FR)

### Formule Impôt Cantonal FR

**Barème 2025:**

| Revenu (CHF) | Taux (%) |
|--------------|----------|
| 0 - 17'500 | 0 |
| 17'500 - 36'000 | 5.0 - 10.0 |
| 36'000 - 72'000 | 10.0 - 15.0 |
| > 72'000 | 15.0 - 20.5 |

**Coefficient FR:**
```
ImpôtCantonal = ImpôtBase × 100%
ImpôtCommunal = ImpôtBase × CoefficientCommune%
```

---

## 🏔️ CANTONS À TAUX UNIQUE

### OBWALD (OW) - Taux forfaitaire
```
ImpôtCantonal = RevenuImposable × 3.1%
ImpôtCommunal = RevenuImposable × (Coef_commune × 3.1%)
```

### SCHWYTZ (SZ) - Paradis fiscal
```
ImpôtCantonal = RevenuImposable × 2.2%  // Le plus bas de Suisse
ImpôtCommunal = Variable selon commune
```

### ZUG (ZG) - Système attractif
```
ImpôtCantonal_max = 8.5%
ImpôtCommunal = Faible (coef ~80%)
```

---

## 📊 FORMULE UNIVERSELLE POUR TOUS LES CANTONS

```typescript
function calculImpotTotal(
  revenuBrut: number,
  canton: Canton,
  commune: string,
  situationFamiliale: string,
  fortuneBrute: number,
  deductions: Deductions
): ResultatFiscal {

  // 1. Calcul revenu net
  const cotisationsSociales = revenuBrut * 0.179;
  const revenuNet = revenuBrut - cotisationsSociales;

  // 2. Déductions totales
  const deductionPersonnelle = canton.deductions.personalDeduction;
  const totalDeductions =
    deductionPersonnelle +
    deductions.pilier3a +
    deductions.assurances +
    deductions.fraisPro +
    deductions.autres;

  // 3. Revenu imposable
  const revenuImposable = revenuNet - totalDeductions;

  // 4. Impôt fédéral direct (identique pour tous)
  const ifd = calculIFD(revenuImposable, situationFamiliale);

  // 5. Impôt cantonal (selon barème cantonal)
  const impotCantonalBase = calculSelonBaremeCantonal(
    revenuImposable,
    canton.taxRates.income.brackets
  );

  // 6. Coefficient communal
  const coeffCommune = getCoefficient(canton, commune);
  const impotCantonal = impotCantonalBase * (coeffCommune / 100);
  const impotCommunal = impotCantonalBase * (coeffCommune / 100);

  // 7. Impôt fortune (si applicable)
  const fortuneImposable = fortuneBrute - canton.deductions.fortuneDeduction;
  const impotFortune = calculImpotFortune(
    fortuneImposable,
    canton.taxRates.wealth.brackets
  );

  // 8. Total
  return {
    ifd,
    impotCantonal,
    impotCommunal,
    impotFortune,
    total: ifd + impotCantonal + impotCommunal + impotFortune,
    tauxEffectif: (total / revenuBrut) * 100,
    revenuImposable
  };
}
```

---

## 🎯 RÈGLES SPÉCIALES PAR CANTON

### Couples mariés - Splitting:

| Canton | Type de Splitting |
|--------|-------------------|
| GE, VD, FR, NE | **Partiel** (1.6-1.8 × célibataire) |
| ZH, BE, LU | **Familial** (barème spécifique) |
| ZG, SZ, OW | **Intégral** (2 × R/2) |

### Déduction pour enfants:

| Canton | Montant par enfant |
|--------|-------------------|
| GE | 10'000 CHF |
| VD | 9'900 CHF |
| ZH | 9'100 CHF |
| BE | 8'000 CHF |
| FR | 7'500 CHF |

### Impôt sur la fortune - Taux maximum:

| Canton | Taux max (‰) |
|--------|--------------|
| GE | 10.0‰ |
| VD | 8.6‰ |
| BE | 5.2‰ |
| ZH | 3.0‰ |
| SZ | 2.5‰ |
| OW, NW | 0‰ (pas d'impôt fortune) |

---

## 📅 CALENDRIER FISCAL 2025

| Canton | Déclaration | Paiement | Extension |
|--------|-------------|----------|-----------|
| GE | 31 mars | 30 juin | 30 sept |
| VD | 15 mars | 31 juillet | 30 nov |
| ZH | 31 mars | 30 sept | 30 sept |
| BE | 31 mars | 31 août | 30 nov |

---

## 🔗 SOURCES OFFICIELLES

**Confédération:**
- IFD: https://www.estv.admin.ch/estv/fr/home/impot-federal-direct/baremes-ifd.html

**Cantons (liens directs simulateurs):**
- GE: https://www.ge.ch/estimer-mes-impots
- VD: https://www.vd.ch/simulateur-fiscal
- ZH: https://www.zh.ch/de/steuern-finanzen/steuern/steuerrechner.html
- BE: https://www.be.ch/steuerrechner

---

## ⚖️ NOTES LÉGALES

- Toutes les formules sont basées sur les barèmes **2025**
- Les taux peuvent être ajustés annuellement
- Consulter les administrations fiscales pour cas complexes
- Ce document est fourni à titre informatif uniquement
