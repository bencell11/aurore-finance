import { NextRequest, NextResponse } from 'next/server';
import ProfileStorageService from '@/lib/services/storage/profile-storage.service';

/**
 * API de debug pour vérifier la synchronisation des données
 */
export async function GET(request: NextRequest) {
  try {
    const storage = ProfileStorageService.getInstance();
    
    // Récupérer toutes les données importantes pour le debug
    const debugInfo = {
      timestamp: new Date().toISOString(),
      storageProfile: storage.getProfile(),
      calculationProfile: storage.getProfileForCalculation(),
      storageCalculation: storage.getCalculation(),
      
      // Informations système
      systemInfo: {
        storageInstanceId: storage.constructor.name,
        hasInstance: !!ProfileStorageService['instance'],
      },
      
      // Vérifications de cohérence
      consistencyChecks: {
        cantonMatch: storage.getProfile()?.personalInfo?.canton === storage.getProfileForCalculation()?.personalInfo?.canton,
        salaryMatch: storage.getProfile()?.incomeData?.mainEmployment?.grossSalary === storage.getProfileForCalculation()?.incomeData?.mainEmployment?.grossSalary,
        pillar3aMatch: storage.getProfile()?.deductions?.savingsContributions?.pillar3a === storage.getProfileForCalculation()?.deductions?.savingsContributions?.pillar3a
      }
    };
    
    // Logs pour le serveur
    console.log('[DEBUG API] État complet du ProfileStorage:', debugInfo);
    
    return NextResponse.json({
      success: true,
      data: debugInfo,
      profileUsed: storage.getProfileForCalculation()
    });
    
  } catch (error) {
    console.error('[DEBUG API] Erreur:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des données de debug',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    const storage = ProfileStorageService.getInstance();
    
    switch (action) {
      case 'force_sync':
        // Forcer une synchronisation
        const profile = storage.getProfile();
        storage.updateProfile(profile);
        
        return NextResponse.json({
          success: true,
          message: 'Synchronisation forcée effectuée'
        });
        
      case 'reset_storage':
        // Réinitialiser le storage (attention !)
        storage.reset();
        
        return NextResponse.json({
          success: true,
          message: 'Storage réinitialisé'
        });
        
      case 'validate_all':
        // Valider toutes les données
        const validationResults = validateAllData(storage);
        
        return NextResponse.json({
          success: true,
          validation: validationResults
        });
        
      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('[DEBUG API] Erreur POST:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'action de debug' },
      { status: 500 }
    );
  }
}

function validateAllData(storage: ProfileStorageService) {
  const profile = storage.getProfile();
  const calculationProfile = storage.getProfileForCalculation();
  
  const checks = [
    {
      name: 'Canton cohérent',
      passed: profile?.personalInfo?.canton === calculationProfile?.personalInfo?.canton,
      expected: profile?.personalInfo?.canton,
      actual: calculationProfile?.personalInfo?.canton
    },
    {
      name: 'Salaire cohérent',
      passed: profile?.incomeData?.mainEmployment?.grossSalary === calculationProfile?.incomeData?.mainEmployment?.grossSalary,
      expected: profile?.incomeData?.mainEmployment?.grossSalary,
      actual: calculationProfile?.incomeData?.mainEmployment?.grossSalary
    },
    {
      name: 'Pilier 3a cohérent',
      passed: profile?.deductions?.savingsContributions?.pillar3a === calculationProfile?.deductions?.savingsContributions?.pillar3a,
      expected: profile?.deductions?.savingsContributions?.pillar3a,
      actual: calculationProfile?.deductions?.savingsContributions?.pillar3a
    },
    {
      name: 'Commune cohérente',
      passed: profile?.personalInfo?.commune === calculationProfile?.personalInfo?.municipality || 
              profile?.personalInfo?.municipality === calculationProfile?.personalInfo?.municipality,
      expected: profile?.personalInfo?.commune || profile?.personalInfo?.municipality,
      actual: calculationProfile?.personalInfo?.municipality
    },
    {
      name: 'Enfants cohérents',
      passed: profile?.personalInfo?.numberOfChildren === calculationProfile?.personalInfo?.numberOfChildren,
      expected: profile?.personalInfo?.numberOfChildren,
      actual: calculationProfile?.personalInfo?.numberOfChildren
    }
  ];
  
  const passedChecks = checks.filter(check => check.passed).length;
  const totalChecks = checks.length;
  
  return {
    summary: {
      passed: passedChecks,
      total: totalChecks,
      percentage: Math.round((passedChecks / totalChecks) * 100),
      allPassed: passedChecks === totalChecks
    },
    checks
  };
}