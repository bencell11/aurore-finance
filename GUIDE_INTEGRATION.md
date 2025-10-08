# Guide d'Intégration - Migration Supabase & Formules Fiscales

## 🎯 Objectifs
1. ✅ Corriger le schéma Supabase (colonnes manquantes)
2. ✅ Intégrer les formules fiscales validées
3. ✅ Finaliser l'onboarding fonctionnel
4. ✅ Afficher les données dans le dashboard

---

## ÉTAPE 1: Migration Supabase (URGENT)

### A. Exécuter la migration SQL

**Action:** Va sur https://supabase.com/dashboard/project/gldvcudowxielzrpdsxz

1. Clique sur **SQL Editor** (icône </> dans le menu gauche)
2. Clique sur **+ New query**
3. Copie le contenu de `supabase/migrations/002_add_missing_columns.sql`
4. Colle dans l'éditeur
5. Clique sur **Run**

**Résultat attendu:**
```
DO
SELECT 10

column_name                  | data_type              | is_nullable
-----------------------------|------------------------|-------------
id                          | uuid                   | NO
user_id                     | uuid                   | NO
revenu_brut_annuel          | numeric                | YES
autres_revenus              | numeric                | YES
charges_logement            | numeric                | YES
charges_assurances          | numeric                | YES
autres_charges              | numeric                | YES
objectifs_financiers        | ARRAY                  | YES
tolerance_risque            | text                   | YES
horizon_investissement      | text                   | YES
niveau_connaissances        | text                   | YES
updated_at                  | timestamp with tz      | YES
```

### B. Vérifier la migration

**SQL de vérification:**
```sql
-- Compter les colonnes
SELECT COUNT(*) as nombre_colonnes
FROM information_schema.columns
WHERE table_name = 'financial_profiles';

-- Devrait retourner: 12 colonnes
```

### C. Tester l'insertion

```sql
-- Test d'insertion
INSERT INTO financial_profiles (
  user_id,
  revenu_brut_annuel,
  autres_revenus,
  charges_logement,
  charges_assurances,
  objectifs_financiers,
  tolerance_risque,
  niveau_connaissances
) VALUES (
  '1edd879f-54b2-4b42-907b-cf8f1446e707',
  100000,
  0,
  1200,
  800,
  ARRAY['Préparer ma retraite'],
  'moderee',
  'debutant'
)
ON CONFLICT (user_id) DO UPDATE SET
  revenu_brut_annuel = EXCLUDED.revenu_brut_annuel,
  autres_revenus = EXCLUDED.autres_revenus,
  charges_logement = EXCLUDED.charges_logement,
  charges_assurances = EXCLUDED.charges_assurances,
  objectifs_financiers = EXCLUDED.objectifs_financiers,
  tolerance_risque = EXCLUDED.tolerance_risque,
  niveau_connaissances = EXCLUDED.niveau_connaissances,
  updated_at = NOW();

-- Vérifier
SELECT * FROM financial_profiles
WHERE user_id = '1edd879f-54b2-4b42-907b-cf8f1446e707';
```

**✅ Si ça fonctionne:** Passe à l'étape 2
**❌ Si erreur:** Envoie-moi le message d'erreur

---

## ÉTAPE 2: Test Onboarding → Supabase

### A. Nettoyer localStorage

1. Ouvre http://localhost:3000/clear-storage.html
2. Clique sur "Nettoyer tout le localStorage"
3. Ferme l'onglet

### B. Créer un nouveau compte

1. Va sur http://localhost:3000/auth
2. Clique sur "S'inscrire"
3. Remplis:
   - Email: test@test.com
   - Mot de passe: TestTest123!
   - Nom: Test
   - Prénom: User
4. Clique sur "S'inscrire"

### C. Compléter l'onboarding

1. Va sur http://localhost:3000/onboarding
2. Réponds aux questions:
   - Âge: 30
   - Situation: Célibataire
   - Canton: Vaud
   - Salaire brut: 80000
   - Autres revenus: 0
   - Loyer: 1500
   - Assurances: 400
   - Autres charges: 500
   - Objectifs: Constituer épargne
   - Tolérance: Modérée
   - Horizon: 5-10 ans
   - Connaissances: Intermédiaire

3. **Ouvre la console (F12)** et vérifie les logs:
```
💾 Sauvegarde onboarding pour user: [id]
📊 Données onboarding: {...}
✅ Profil mis à jour: [...]
✅ Profil financier créé/mis à jour: [...]
```

**Si erreur ❌:** Copie l'erreur et envoie-la moi

### D. Vérifier dans Supabase

1. Va sur Supabase Dashboard → **Table Editor**
2. Clique sur `user_profiles`
3. Tu devrais voir une ligne avec:
   - nom: Test
   - prenom: User
   - age: 30
   - situation_familiale: celibataire
   - canton: Vaud

4. Clique sur `financial_profiles`
5. Tu devrais voir:
   - revenu_brut_annuel: 80000
   - charges_logement: 1500
   - charges_assurances: 400
   - tolerance_risque: moderee

**✅ Si les données sont là:** Étape 2 réussie!

---

## ÉTAPE 3: Vérifier le Dashboard

1. Après l'onboarding, tu es redirigé vers http://localhost:3000/dashboard
2. **Ouvre la console** et vérifie:
```
📊 Chargement dashboard pour user: [id]
👤 Profil chargé: {...} null
💰 Profil financier chargé: {...} null
🎯 Objectifs chargés: [] null
```

3. Le dashboard devrait afficher:
   - Tes initiales en haut à droite
   - Revenus annuels
   - Capacité d'épargne
   - Taux d'épargne

**Si le dashboard est vide:**
- Vérifie la console pour les erreurs
- Vérifie que les données sont dans Supabase
- Rafraîchis la page (Cmd+R)

---

## ÉTAPE 4: Intégrer les Formules Fiscales

### A. Créer le service de calcul fiscal

**Fichier:** `lib/services/tax-calculation.service.ts`

```typescript
import { calculImpotTotal, type TaxCalculationInput } from '@/lib/utils/swiss-tax-formulas';

export class TaxCalculationService {
  static calculateTax(userData: {
    salaireBrut: number;
    autresRevenus: number;
    canton: string;
    commune: string;
    situationFamiliale: string;
    nombreEnfants: number;
    fortuneBrute: number;
    deductions: any;
  }) {
    const input: TaxCalculationInput = {
      salaireBrut: userData.salaireBrut,
      autresRevenus: userData.autresRevenus || 0,
      canton: this.normalizeCantonCode(userData.canton),
      commune: userData.commune || this.getDefaultCommune(userData.canton),
      situationFamiliale: this.normalizeSituation(userData.situationFamiliale),
      nombreEnfants: userData.nombreEnfants || 0,
      fortuneBrute: userData.fortuneBrute || 0,
      dettes: 0,
      deductions: {
        pilier3a: userData.deductions?.pilier3a || 0,
        primes_assurance: userData.deductions?.primes || 0,
        frais_professionnels: userData.deductions?.fraisPro || 0,
        frais_garde_enfants: 0,
        frais_formation: 0,
        dons: 0,
        interets_hypothecaires: 0,
        pension_alimentaire: 0,
        frais_medicaux: 0,
        autres: 0,
      },
    };

    return calculImpotTotal(input);
  }

  private static normalizeCantonCode(canton: string): string {
    const mapping: Record<string, string> = {
      'Vaud': 'VD',
      'Genève': 'GE',
      'Zurich': 'ZH',
      'Berne': 'BE',
      // ... autres
    };
    return mapping[canton] || canton;
  }

  private static getDefaultCommune(canton: string): string {
    const defaults: Record<string, string> = {
      'VD': 'Lausanne',
      'GE': 'Genève',
      'ZH': 'Zürich',
      'BE': 'Berne',
    };
    return defaults[canton] || 'Chef-lieu';
  }

  private static normalizeSituation(situation: string): any {
    const mapping: Record<string, string> = {
      'celibataire': 'celibataire',
      'marie': 'marie',
      'divorce': 'divorce',
      'veuf': 'veuf',
      'concubinage': 'concubinage',
    };
    return mapping[situation] || 'celibataire';
  }
}
```

### B. Utiliser dans le dashboard

**Fichier:** `app/dashboard/page.tsx`

Ajoute après le chargement des données:

```typescript
import { TaxCalculationService } from '@/lib/services/tax-calculation.service';

// Dans loadDashboard(), après avoir chargé les données:
if (profile && financial) {
  try {
    const taxResult = TaxCalculationService.calculateTax({
      salaireBrut: financial.revenu_brut_annuel || 0,
      autresRevenus: financial.autres_revenus || 0,
      canton: profile.canton || 'VD',
      commune: 'Lausanne', // À récupérer du profil
      situationFamiliale: profile.situation_familiale || 'celibataire',
      nombreEnfants: 0,
      fortuneBrute: 0, // À ajouter
      deductions: {
        pilier3a: 0,
        primes: financial.charges_assurances || 0,
        fraisPro: 0,
      },
    });

    console.log('💰 Calcul fiscal:', taxResult);
    setTaxCalculation(taxResult); // Ajoute ce state
  } catch (error) {
    console.error('❌ Erreur calcul fiscal:', error);
  }
}
```

### C. Afficher dans le dashboard

Ajoute une nouvelle carte:

```tsx
{taxCalculation && (
  <Card>
    <CardHeader>
      <CardTitle>Impôts estimés 2025</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Impôt fédéral:</span>
          <span className="font-semibold">
            {taxCalculation.impots.federal.toLocaleString('fr-CH')} CHF
          </span>
        </div>
        <div className="flex justify-between">
          <span>Impôt cantonal:</span>
          <span className="font-semibold">
            {taxCalculation.impots.cantonal.toLocaleString('fr-CH')} CHF
          </span>
        </div>
        <div className="flex justify-between">
          <span>Impôt communal:</span>
          <span className="font-semibold">
            {taxCalculation.impots.communal.toLocaleString('fr-CH')} CHF
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t font-bold">
          <span>Total:</span>
          <span className="text-blue-600">
            {taxCalculation.impots.total.toLocaleString('fr-CH')} CHF
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Taux effectif: {taxCalculation.taux.effectif}%
        </p>
      </div>
    </CardContent>
  </Card>
)}
```

---

## ÉTAPE 5: Tester le Calcul Complet

1. Recharge le dashboard
2. Tu devrais voir les impôts calculés avec les vraies formules
3. Compare avec le simulateur officiel: https://www.vd.ch/simulateur-fiscal

**Résultat attendu pour 80'000 CHF, Vaud, célibataire:**
```
Impôt fédéral: ~500 CHF
Impôt cantonal: ~800 CHF
Impôt communal: ~800 CHF
Total: ~2'100 CHF
Taux effectif: ~2.6%
```

---

## ÉTAPE 6: Déploiement Vercel

### A. Vérifier les variables d'environnement

Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### B. Push et déploiement

```bash
git add -A
git commit -m "feat: Intégration complète formules fiscales et Supabase"
git push
```

Vercel déploiera automatiquement.

### C. Tester en production

1. Va sur https://aurorefinances.ch/auth
2. Crée un compte
3. Fais l'onboarding
4. Vérifie le dashboard

---

## 📊 CHECKLIST DE VALIDATION

### Migration Supabase:
- [ ] Migration SQL exécutée sans erreur
- [ ] 12 colonnes dans `financial_profiles`
- [ ] Test d'insertion réussi

### Onboarding:
- [ ] Compte créé dans Supabase
- [ ] Données profil sauvegardées
- [ ] Données financières sauvegardées
- [ ] Redirection dashboard fonctionne

### Dashboard:
- [ ] Profil affiché correctement
- [ ] Données financières chargées
- [ ] Calcul fiscal fonctionnel
- [ ] Résultats cohérents

### Calculs Fiscaux:
- [ ] Formules TypeScript importées
- [ ] Service de calcul créé
- [ ] Intégration dashboard
- [ ] Résultats validés vs simulateur officiel

### Production:
- [ ] Variables d'environnement Vercel
- [ ] Build Vercel réussi
- [ ] Test production OK

---

## 🆘 DÉPANNAGE

### Erreur "Column not found"
→ La migration SQL n'a pas été exécutée
→ Solution: Retourne à ÉTAPE 1

### Dashboard vide
→ Les données ne sont pas dans Supabase
→ Solution: Vérifie Table Editor Supabase

### Erreur calcul fiscal
→ Canton ou commune incorrect
→ Solution: Vérifie les logs console, corrige normalizeCantonCode()

### Build Vercel échoue
→ Variables d'environnement manquantes
→ Solution: Ajoute NEXT_PUBLIC_SUPABASE_URL et _ANON_KEY

---

## 📞 SUPPORT

Si tu rencontres un problème:
1. Ouvre la console (F12)
2. Copie l'erreur complète
3. Vérifie dans Supabase si les données sont là
4. Envoie-moi le message d'erreur

Je t'aiderai à débugger!
