/**
 * Service de stockage global pour le profil fiscal
 * Utilisé pour synchroniser les données entre les différentes APIs en mode démo
 */

interface StoredProfile {
  personalInfo?: {
    civilStatus?: string;
    canton?: string;
    commune?: string;
    municipality?: string;
    numberOfChildren?: number;
    confession?: string;
    taxationMode?: string;
  };
  incomeData?: {
    mainEmployment?: {
      employer?: string;
      grossSalary?: number;
      netSalary?: number;
      withheldTax?: number;
      socialDeductions?: any;
    };
    rentalIncome?: number;
    pensionIncome?: {
      avsRente?: number;
    };
    unemploymentBenefits?: number;
    otherIncome?: {
      amount?: number;
    };
  };
  deductions?: {
    professionalExpenses?: {
      transportCosts?: number;
      mealCosts?: number;
      otherProfessionalExpenses?: number;
      total?: number;
    };
    insurancePremiums?: {
      healthInsurance?: number;
      lifeInsurance?: number;
    };
    savingsContributions?: {
      pillar3a?: number;
      pillar3b?: number;
    };
    childcareExpenses?: number;
    donationsAmount?: number;
    donations?: {
      amount?: number;
    };
  };
  assets?: {
    bankAccounts?: Array<{
      bankName?: string;
      accountType?: string;
      balance?: number;
      interestEarned?: number;
    }>;
    totalWealth?: number;
    totalValue?: number;
    stocks?: {
      totalValue?: number;
    };
    realEstate?: {
      totalValue?: number;
    };
    otherAssets?: {
      totalValue?: number;
    };
  };
  realEstate?: any[];
  documents?: any[];
  completionStatus?: {
    overall?: number;
    sections?: {
      personalInfo?: boolean;
      income?: boolean;
      deductions?: boolean;
      assets?: boolean;
      realEstate?: boolean;
      documents?: boolean;
    };
    lastModified?: Date;
    readyForSubmission?: boolean;
  };
  id?: string;
  userId?: string;
  anonymizedId?: string;
  lastUpdated?: Date;
}

interface StoredCalculation {
  canton?: string;
  year?: number;
  grossIncome?: number;
  taxableIncome?: number;
  taxableWealth?: number;
  federalTax?: number;
  cantonalTax?: number;
  communalTax?: number;
  churchTax?: number;
  totalTax?: number;
  effectiveRate?: number;
  marginalRate?: number;
  withheldTax?: number;
  remainingTax?: number;
  deductionsBreakdown?: any;
  calculationDetails?: any;
}

class ProfileStorageService {
  private static instance: ProfileStorageService;
  private profile: StoredProfile;
  private calculation: StoredCalculation | null = null;

  private constructor() {
    console.log('[ProfileStorage] Constructeur appelé - initialisation du profil');
    // Données par défaut - IMPORTANT: ces valeurs ne doivent PAS écraser les modifications utilisateur
    this.profile = {
      id: 'mock-profile-1',
      userId: 'mock-user-1',
      anonymizedId: 'ANON-12345',
      lastUpdated: new Date(),
      personalInfo: {
        civilStatus: 'single',
        canton: 'VD', // Changé en VD par défaut pour correspondre aux données utilisateur
        commune: 'Lausanne',
        municipality: 'Lausanne',
        numberOfChildren: 0,
        confession: 'none',
        taxationMode: 'individual'
      },
      incomeData: {
        mainEmployment: {
          employer: 'Tech Corp SA',
          grossSalary: 100000, // Correspond aux données affichées par l'utilisateur
          netSalary: 68000,
          withheldTax: 14500,
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
        unemploymentBenefits: 0,
        otherIncome: {
          amount: 0
        }
      },
      deductions: {
        professionalExpenses: {
          transportCosts: 1200,
          mealCosts: 800,
          otherProfessionalExpenses: 500,
          total: 2500
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
        donationsAmount: 500,
        donations: {
          amount: 500
        }
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
        totalWealth: 45000,
        totalValue: 45000
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
  }

  public static getInstance(): ProfileStorageService {
    if (!ProfileStorageService.instance) {
      console.log('[ProfileStorage] Création d\'une nouvelle instance');
      ProfileStorageService.instance = new ProfileStorageService();
    }
    return ProfileStorageService.instance;
  }

  /**
   * Obtenir le profil actuel
   */
  public getProfile(): StoredProfile {
    return { ...this.profile };
  }

  /**
   * Mettre à jour une section du profil
   */
  public updateProfileSection(section: string, data: any): StoredProfile {
    console.log(`[ProfileStorage] Mise à jour section: ${section}`, data);
    
    // Mise à jour profonde de la section
    if (section === 'personalInfo') {
      const oldCanton = this.profile.personalInfo?.canton;
      this.profile.personalInfo = {
        ...this.profile.personalInfo,
        ...data,
        // S'assurer que municipality est synchronisé avec commune
        municipality: data.commune || data.municipality || this.profile.personalInfo?.municipality
      };
      const newCanton = this.profile.personalInfo?.canton;
      console.log(`[ProfileStorage] PersonalInfo mis à jour - Canton: ${oldCanton} → ${newCanton}:`, this.profile.personalInfo);
    } else if (section === 'incomeData') {
      this.profile.incomeData = {
        ...this.profile.incomeData,
        ...data,
        mainEmployment: {
          ...this.profile.incomeData?.mainEmployment,
          ...data.mainEmployment
        }
      };
    } else if (section === 'deductions') {
      this.profile.deductions = {
        ...this.profile.deductions,
        ...data,
        professionalExpenses: {
          ...this.profile.deductions?.professionalExpenses,
          ...data.professionalExpenses,
          total: (data.professionalExpenses?.transportCosts || 0) +
                 (data.professionalExpenses?.mealCosts || 0) +
                 (data.professionalExpenses?.otherProfessionalExpenses || 0)
        },
        insurancePremiums: {
          ...this.profile.deductions?.insurancePremiums,
          ...data.insurancePremiums
        },
        savingsContributions: {
          ...this.profile.deductions?.savingsContributions,
          ...data.savingsContributions
        }
      };
    } else if (section === 'assets') {
      this.profile.assets = {
        ...this.profile.assets,
        ...data
      };
    } else if (section === 'realEstate') {
      this.profile.realEstate = data;
    }

    // Mise à jour de la date
    this.profile.lastUpdated = new Date();

    // Recalculer le statut de complétion
    this.updateCompletionStatus();

    // Invalider le calcul précédent car le profil a changé
    this.calculation = null;

    return { ...this.profile };
  }

  /**
   * Mettre à jour le profil complet
   */
  public updateProfile(profile: StoredProfile): void {
    this.profile = { ...this.profile, ...profile };
    this.profile.lastUpdated = new Date();
    this.updateCompletionStatus();
    this.calculation = null;
  }

  /**
   * Obtenir le dernier calcul
   */
  public getCalculation(): StoredCalculation | null {
    return this.calculation ? { ...this.calculation } : null;
  }

  /**
   * Sauvegarder un calcul
   */
  public saveCalculation(calculation: StoredCalculation): void {
    this.calculation = { ...calculation };
  }

  /**
   * Réinitialiser aux valeurs par défaut
   */
  public reset(): void {
    ProfileStorageService.instance = new ProfileStorageService();
  }

  /**
   * Calculer le statut de complétion
   */
  private updateCompletionStatus(): void {
    const sections = {
      personalInfo: !!(
        this.profile.personalInfo?.canton && 
        this.profile.personalInfo?.civilStatus
      ),
      income: !!(
        this.profile.incomeData?.mainEmployment?.grossSalary &&
        this.profile.incomeData?.mainEmployment?.grossSalary > 0
      ),
      deductions: !!(
        this.profile.deductions?.savingsContributions || 
        this.profile.deductions?.professionalExpenses
      ),
      assets: !!(
        this.profile.assets?.bankAccounts?.length || 
        this.profile.assets?.totalWealth
      ),
      realEstate: !!(this.profile.realEstate?.length),
      documents: !!(this.profile.documents?.length)
    };

    const completedSections = Object.values(sections).filter(Boolean).length;
    const totalSections = Object.keys(sections).length;
    const overall = Math.round((completedSections / totalSections) * 100);

    this.profile.completionStatus = {
      overall,
      sections,
      lastModified: new Date(),
      readyForSubmission: overall >= 80
    };
  }

  /**
   * Obtenir les données pour les calculs
   */
  public getProfileForCalculation(): any {
    const canton = this.profile.personalInfo?.canton || 'VD'; // Changé le fallback de GE vers VD
    const municipality = this.profile.personalInfo?.municipality || this.profile.personalInfo?.commune || 'Lausanne'; // Changé le fallback
    
    console.log('[ProfileStorage] getProfileForCalculation - Canton:', canton, 'Municipality:', municipality);
    console.log('[ProfileStorage] Profile PersonalInfo complet:', this.profile.personalInfo);
    console.log('[ProfileStorage] Profile complet:', this.profile);
    
    return {
      id: this.profile.id,
      personalInfo: {
        canton: canton,
        municipality: municipality,
        civilStatus: this.profile.personalInfo?.civilStatus || 'single',
        numberOfChildren: this.profile.personalInfo?.numberOfChildren || 0
      },
      incomeData: {
        mainEmployment: {
          employerName: this.profile.incomeData?.mainEmployment?.employer || 'Employeur',
          grossSalary: this.profile.incomeData?.mainEmployment?.grossSalary || 85000,
          withheldTax: this.profile.incomeData?.mainEmployment?.withheldTax || 
                       Math.round((this.profile.incomeData?.mainEmployment?.grossSalary || 85000) * 0.17),
          position: 'Employé'
        },
        otherIncome: {
          amount: this.profile.incomeData?.rentalIncome || this.profile.incomeData?.otherIncome?.amount || 0
        }
      },
      deductions: {
        savingsContributions: {
          pillar3a: this.profile.deductions?.savingsContributions?.pillar3a || 0,
          pillar3b: this.profile.deductions?.savingsContributions?.pillar3b || 0
        },
        professionalExpenses: {
          transportCosts: this.profile.deductions?.professionalExpenses?.transportCosts || 0,
          mealCosts: this.profile.deductions?.professionalExpenses?.mealCosts || 0,
          otherProfessionalExpenses: this.profile.deductions?.professionalExpenses?.otherProfessionalExpenses || 0,
          total: this.profile.deductions?.professionalExpenses?.total || 0
        },
        insurancePremiums: {
          healthInsurance: this.profile.deductions?.insurancePremiums?.healthInsurance || 0,
          lifeInsurance: this.profile.deductions?.insurancePremiums?.lifeInsurance || 0
        },
        donationsAmount: this.profile.deductions?.donationsAmount || this.profile.deductions?.donations?.amount || 0
      },
      assets: {
        totalValue: this.calculateTotalAssets()
      }
    };
  }

  /**
   * Calculer le total des actifs
   */
  private calculateTotalAssets(): number {
    let total = 0;

    // Comptes bancaires
    if (this.profile.assets?.bankAccounts) {
      this.profile.assets.bankAccounts.forEach(account => {
        total += account.balance || 0;
      });
    }

    // Autres actifs
    total += this.profile.assets?.stocks?.totalValue || 0;
    total += this.profile.assets?.realEstate?.totalValue || 0;
    total += this.profile.assets?.otherAssets?.totalValue || 0;

    // Si aucun calcul, utiliser totalWealth ou totalValue
    if (total === 0) {
      total = this.profile.assets?.totalValue || this.profile.assets?.totalWealth || 0;
    }

    return total;
  }
}

export default ProfileStorageService;