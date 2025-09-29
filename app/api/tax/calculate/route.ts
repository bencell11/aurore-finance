import { NextRequest, NextResponse } from 'next/server';
import { SwissTaxFormulasService } from '@/lib/services/tax/swiss-tax-formulas.service';
import { SwissTaxContextService } from '@/lib/services/tax/swiss-tax-context.service';
import ProfileStorageService from '@/lib/services/storage/profile-storage.service';

/**
 * API de calcul fiscal utilisant les vraies formules suisses
 */

// Fonctions helper pour le mode démo
async function getProfileFromStorage() {
  // Obtenir le profil depuis le service de stockage centralisé
  const storage = ProfileStorageService.getInstance();
  return storage.getProfileForCalculation();
}


function generateDynamicOptimizations(profile: any, deductions: any, marginalRate: number) {
  const optimizations = [];
  
  // Optimisation 3e pilier
  const currentPillar3a = profile.deductions?.savingsContributions?.pillar3a || 0;
  const maxPillar3a = 7056;
  if (currentPillar3a < maxPillar3a) {
    const potential = maxPillar3a - currentPillar3a;
    const savings = Math.round(potential * (marginalRate / 100) * 1.5); // Marginal + cantonal
    optimizations.push({
      type: 'pillar3a',
      title: 'Optimisation 3e pilier A',
      description: `Vous pourriez encore verser ${potential.toLocaleString('fr-CH')} CHF dans votre 3e pilier cette année.`,
      savingAmount: savings,
      priority: 'high',
      deadline: '31 décembre 2024',
      effort: 'easy',
      category: 'pillar3a'
    });
  }

  // Optimisation frais professionnels
  const currentExpenses = profile.deductions?.professionalExpenses?.total || 0;
  const standardDeduction = calculateStandardDeduction(profile.incomeData?.mainEmployment?.grossSalary || 0);
  if (currentExpenses < standardDeduction + 1000) { // Si potentiel d'amélioration
    const potential = 1500;
    const savings = Math.round(potential * (marginalRate / 100) * 1.3);
    optimizations.push({
      type: 'professional_expenses',
      title: 'Optimisation frais professionnels',
      description: 'Documentez mieux vos frais de transport, repas et équipement professionnel.',
      savingAmount: savings,
      priority: 'medium',
      effort: 'medium',
      category: 'professional_expenses'
    });
  }

  // Rachats LPP si revenus élevés
  const income = profile.incomeData?.mainEmployment?.grossSalary || 0;
  if (income > 70000) {
    const potential = Math.min(10000, income * 0.12); // Estimation rachat possible
    const savings = Math.round(potential * (marginalRate / 100) * 1.4);
    optimizations.push({
      type: 'lpp_buyback',
      title: 'Rachats de prévoyance (2e pilier)',
      description: 'Avec vos revenus, des rachats LPP pourraient considérablement réduire vos impôts.',
      savingAmount: savings,
      priority: 'medium',
      action: 'Demander un calcul de rachat à votre caisse de pension',
      effort: 'complex',
      category: 'lpp_buyback'
    });
  }

  return optimizations;
}

function calculateStandardDeduction(salary: number): number {
  // Formule AFC pour déduction forfaitaire
  if (salary <= 25000) return salary * 0.03;
  if (salary <= 50000) return 750 + (salary - 25000) * 0.02;
  if (salary <= 100000) return 1250 + (salary - 50000) * 0.01;
  return 1750; // Maximum
}

function getMockOptimizations() {
  return [
    {
      type: 'donations',
      title: 'Donations déductibles',
      description: 'Les dons aux œuvres d\'utilité publique sont déductibles jusqu\'à 20% du revenu.',
      savingAmount: 300,
      priority: 'low',
      effort: 'easy',
      category: 'donations'
    }
  ];
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const year = body.year || new Date().getFullYear();
    
    console.log('POST /api/tax/calculate - Début du calcul');
    
    // Simulation d'un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Charger le profil utilisateur depuis le stockage (données réelles modifiées par l'utilisateur)
    const profile = await getProfileFromStorage();
    
    console.log('Profil pour calcul:', {
      canton: profile?.personalInfo?.canton,
      civilStatus: profile?.personalInfo?.civilStatus,
      grossSalary: profile?.incomeData?.mainEmployment?.grossSalary,
      pillar3a: profile?.deductions?.savingsContributions?.pillar3a
    });
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profil utilisateur requis pour le calcul' },
        { status: 400 }
      );
    }

    // Calculer le revenu imposable à partir du salaire brut uniquement
    const grossSalary = profile.incomeData?.mainEmployment?.grossSalary || 0;
    const otherIncome = profile.incomeData?.otherIncome?.amount || 0;
    
    // Calculer automatiquement le salaire net (17.9% de déductions sociales)
    const netSalary = grossSalary * 0.821;
    
    const totalIncome = grossSalary + otherIncome;

    // Calculer les déductions avec les vraies formules
    const canton = profile.personalInfo?.canton || 'GE';
    const municipality = profile.personalInfo?.municipality || profile.personalInfo?.commune || 'Genève';
    const deductions = SwissTaxFormulasService.calculateDeductions(profile, canton);
    const taxableIncome = Math.max(0, totalIncome - deductions.total.totalDeductions);

    console.log('Calcul des déductions:', {
      canton,
      totalIncome,
      deductions: deductions.total.totalDeductions,
      taxableIncome
    });

    // Calculer l'impôt fédéral avec les vraies formules
    const federalTaxResult = SwissTaxFormulasService.calculateFederalTax(
      taxableIncome, 
      profile.personalInfo?.civilStatus || 'single'
    );

    // Calculer l'impôt cantonal avec les vraies formules
    const cantonalTaxResult = SwissTaxFormulasService.calculateCantonalTax(
      taxableIncome,
      canton,
      municipality
    );

    console.log('Résultats de calcul:', {
      federalTax: federalTaxResult.tax,
      cantonalTax: cantonalTaxResult.cantonalTax,
      communalTax: cantonalTaxResult.communalTax,
      canton
    });

    const totalTax = federalTaxResult.tax + cantonalTaxResult.totalTax;
    const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;
    
    // Calculer le vrai taux marginal total (fédéral + cantonal + communal)
    const realMarginalRate = SwissTaxFormulasService.calculateTotalMarginalRate(
      taxableIncome,
      canton,
      municipality,
      profile.personalInfo?.civilStatus || 'single'
    );

    // Calculer les optimisations personnalisées
    const optimizations = SwissTaxContextService.calculateOptimizations(profile);
    const dynamicOptimizations = generateDynamicOptimizations(profile, deductions, realMarginalRate);
    
    const calculation = {
      canton,
      year,
      grossIncome: totalIncome,
      netIncome: netSalary,
      taxableIncome,
      taxableWealth: profile.assets?.totalValue || 0,
      federalTax: federalTaxResult.tax,
      cantonalTax: cantonalTaxResult.cantonalTax,
      communalTax: cantonalTaxResult.communalTax,
      churchTax: 0,
      totalTax,
      effectiveRate: parseFloat(effectiveRate.toFixed(2)),
      marginalRate: realMarginalRate,
      withheldTax: profile.incomeData?.mainEmployment?.withheldTax || 0,
      remainingTax: Math.max(0, totalTax - (profile.incomeData?.mainEmployment?.withheldTax || 0)),
      deductionsBreakdown: {
        federal: deductions.federal,
        cantonal: deductions.cantonal,
        total: deductions.total
      },
      calculationDetails: {
        federalCalculation: federalTaxResult.calculation,
        cantonalCalculation: cantonalTaxResult.calculation,
        socialDeductions: grossSalary * 0.179
      }
    };
    
    // Sauvegarder le calcul dans le storage
    const storage = ProfileStorageService.getInstance();
    storage.saveCalculation(calculation);
    
    return NextResponse.json({
      calculation,
      optimizations: [...dynamicOptimizations, ...getMockOptimizations()],
      summary: {
        totalTaxDue: totalTax,
        effectiveRate: `${effectiveRate.toFixed(1)}%`,
        marginalRate: `${realMarginalRate.toFixed(1)}%`,
        potentialSavings: dynamicOptimizations.reduce((sum, opt) => sum + opt.savingAmount, 0)
      },
      message: `Calcul effectué pour le canton de ${canton} avec formules officielles AFC (MODE DEMO)`,
      sources: {
        federal: 'Administration fédérale des contributions (AFC)',
        cantonal: `Administration fiscale cantonale de ${canton}`
      }
    });
    
  } catch (error) {
    console.error('Erreur calcul fiscal:', error);
    return NextResponse.json(
      { error: 'Erreur lors du calcul' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simulation d'historique de calculs
    const calculations = [
      {
        ...mockCalculation,
        year: 2024,
        created_at: new Date().toISOString()
      },
      {
        ...mockCalculation,
        year: 2023,
        totalTax: 14850,
        effectiveRate: 17.2,
        created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return NextResponse.json({
      calculations,
      message: 'Historique simulé (MODE DEMO)'
    });
    
  } catch (error) {
    console.error('Erreur historique mock:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}