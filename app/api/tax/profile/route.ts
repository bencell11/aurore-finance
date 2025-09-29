import { NextRequest, NextResponse } from 'next/server';
import ProfileStorageService from '@/lib/services/storage/profile-storage.service';

/**
 * Version mock pour développement sans Supabase
 * Renommer en route.ts pour activer
 */

const mockTaxProfile = {
  id: 'mock-profile-1',
  userId: 'mock-user-1',
  anonymizedId: 'ANON-12345',
  lastUpdated: new Date(),
  personalInfo: {
    civilStatus: 'single',
    canton: 'GE',
    commune: 'Genève',
    numberOfChildren: 0,
    confession: 'none',
    taxationMode: 'individual'
  },
  incomeData: {
    mainEmployment: {
      employer: 'Tech Corp SA',
      grossSalary: 85000,
      netSalary: 68000,
      socialDeductions: {
        avs: 3600,
        ai: 400,
        ac: 850,
        lpp: 4250,
        totalDeductions: 9100
      }
    },
    rentalIncome: 0,
    pensionIncome: {
      avsRente: 0
    },
    unemploymentBenefits: 0
  },
  deductions: {
    professionalExpenses: {
      transportCosts: 1200,
      mealCosts: 800,
      otherProfessionalExpenses: 500
    },
    insurancePremiums: {
      healthInsurance: 4800,
      lifeInsurance: 1200
    },
    savingsContributions: {
      pillar3a: 7056,
      pillar3b: 0
    },
    childcareExpenses: 0,
    donationsAmount: 500
  },
  assets: {
    bankAccounts: [
      {
        bankName: 'UBS',
        accountType: 'checking',
        balance: 25000,
        interestEarned: 150
      }
    ],
    totalWealth: 45000
  },
  realEstate: [],
  documents: [],
  completionStatus: {
    overall: 85,
    sections: {
      personalInfo: true,
      income: true,
      deductions: true,
      assets: true,
      realEstate: false,
      documents: false
    },
    lastModified: new Date(),
    readyForSubmission: false
  }
};

export async function GET(request: NextRequest) {
  try {
    // Simulation d'un délai de réponse
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Obtenir le profil depuis le service de stockage
    const storage = ProfileStorageService.getInstance();
    const profileToReturn = storage.getProfile();
    
    return NextResponse.json({
      profile: profileToReturn,
      completionStatus: profileToReturn.completionStatus
    });
    
  } catch (error) {
    console.error('Erreur mock profile:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulation de validation
    if (!body.personalInfo?.canton) {
      return NextResponse.json(
        { error: 'Le canton est requis' },
        { status: 400 }
      );
    }
    
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mise à jour du mock avec les nouvelles données
    const updatedProfile = {
      ...mockTaxProfile,
      ...body,
      lastUpdated: new Date()
    };
    
    // Recalcul du statut de complétion
    const completionStatus = {
      overall: Math.round(Math.random() * 30 + 70), // 70-100%
      sections: {
        personalInfo: !!body.personalInfo,
        income: !!body.incomeData,
        deductions: !!body.deductions,
        assets: !!body.assets,
        realEstate: !!body.realEstate,
        documents: !!body.documents
      },
      lastModified: new Date(),
      readyForSubmission: false
    };
    
    return NextResponse.json({
      message: 'Profil fiscal mis à jour avec succès (MODE DEMO)',
      profileId: 'mock-profile-1',
      completionStatus
    });
    
  } catch (error) {
    console.error('Erreur mock profile POST:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;
    
    console.log('PUT /api/tax/profile - Section:', section, 'Data:', data);
    
    // Validation de la section
    const validSections = ['personalInfo', 'incomeData', 'deductions', 'assets', 'realEstate'];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: 'Section invalide' },
        { status: 400 }
      );
    }
    
    // Simulation de mise à jour
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mettre à jour le profil dans le service de stockage
    const storage = ProfileStorageService.getInstance();
    const updatedProfile = storage.updateProfileSection(section, data);
    
    console.log('Profil mis à jour:', updatedProfile);
    
    return NextResponse.json({
      message: `Section ${section} mise à jour avec succès (MODE DEMO)`,
      completionStatus: updatedProfile.completionStatus,
      updatedData: data,
      currentProfile: updatedProfile // Pour debug
    });
    
  } catch (error) {
    console.error('Erreur mock profile PUT:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

function calculateCompletionStatus(profile: any) {
  const sections = {
    personalInfo: !!(profile.personalInfo?.canton && profile.personalInfo?.civilStatus),
    income: !!(profile.incomeData?.mainEmployment?.grossSalary),
    deductions: !!(profile.deductions?.savingsContributions || profile.deductions?.professionalExpenses),
    assets: !!(profile.assets?.bankAccounts?.length || profile.assets?.totalWealth),
    realEstate: !!(profile.realEstate?.length),
    documents: !!(profile.documents?.length)
  };
  
  const completedSections = Object.values(sections).filter(Boolean).length;
  const totalSections = Object.keys(sections).length;
  const overall = Math.round((completedSections / totalSections) * 100);
  
  return {
    overall,
    sections,
    lastModified: new Date(),
    readyForSubmission: overall >= 80
  };
}