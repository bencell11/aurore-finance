import { createClient } from '@supabase/supabase-js';
import { TaxProfile, TaxCalculation, CompletionStatus } from '@/types/tax';
import { TaxSecurityService } from './security.service';

/**
 * Service principal pour la gestion des profils fiscaux
 */
export class TaxProfileService {
  private supabase;
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  /**
   * Crée ou met à jour un profil fiscal
   */
  async upsertTaxProfile(userId: string, profileData: Partial<TaxProfile>): Promise<TaxProfile> {
    // Génère un ID anonyme si nécessaire
    const anonymizedId = profileData.anonymizedId || TaxSecurityService.generateAnonymizedId(userId);
    
    // Prépare les données sensibles pour le stockage
    const sensitiveData = {
      avsNumber: profileData.personalInfo?.avsNumber,
      dateOfBirth: profileData.personalInfo?.dateOfBirth,
      nationality: profileData.personalInfo?.nationality
    };
    
    const encryptedPersonalData = TaxSecurityService.encryptSensitiveData(sensitiveData);
    
    // Prépare les données pour l'insertion
    const dbData = {
      user_id: userId,
      anonymized_id: anonymizedId,
      civil_status: profileData.personalInfo?.civilStatus,
      canton: profileData.personalInfo?.canton,
      commune: profileData.personalInfo?.commune,
      number_of_children: profileData.personalInfo?.numberOfChildren || 0,
      confession: profileData.personalInfo?.confession,
      taxation_mode: profileData.personalInfo?.taxationMode,
      encrypted_personal_data: encryptedPersonalData,
      completion_status: this.calculateCompletionStatus(profileData),
      ready_for_submission: false
    };
    
    const { data, error } = await this.supabase
      .from('tax_profiles')
      .upsert(dbData, { onConflict: 'user_id' })
      .select()
      .single();
    
    if (error) throw error;
    
    // Sauvegarde les données associées
    if (profileData.incomeData) {
      await this.saveIncomeData(data.id, profileData.incomeData);
    }
    
    if (profileData.deductions) {
      await this.saveDeductions(data.id, profileData.deductions);
    }
    
    if (profileData.assets) {
      await this.saveAssets(data.id, profileData.assets);
    }
    
    if (profileData.realEstate && profileData.realEstate.length > 0) {
      await this.saveRealEstate(data.id, profileData.realEstate);
    }
    
    return this.mapDbToTaxProfile(data);
  }
  
  /**
   * Récupère le profil fiscal complet d'un utilisateur
   */
  async getTaxProfile(userId: string): Promise<TaxProfile | null> {
    // Récupère le profil principal
    const { data: profile, error } = await this.supabase
      .from('tax_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !profile) return null;
    
    // Récupère toutes les données associées
    const year = new Date().getFullYear();
    
    const [income, deductions, assets, realEstate, documents] = await Promise.all([
      this.getIncomeData(profile.id, year),
      this.getDeductions(profile.id, year),
      this.getAssets(profile.id, year),
      this.getRealEstate(profile.id),
      this.getDocuments(profile.id)
    ]);
    
    // Déchiffre les données sensibles
    const decryptedPersonalData = profile.encrypted_personal_data 
      ? TaxSecurityService.decryptSensitiveData(profile.encrypted_personal_data)
      : {};
    
    return {
      id: profile.id,
      userId: profile.user_id,
      anonymizedId: profile.anonymized_id,
      lastUpdated: new Date(profile.updated_at),
      personalInfo: {
        civilStatus: profile.civil_status,
        canton: profile.canton,
        commune: profile.commune,
        numberOfChildren: profile.number_of_children,
        childrenDetails: [], // À implémenter
        confession: profile.confession,
        taxationMode: profile.taxation_mode,
        dateOfBirth: decryptedPersonalData.dateOfBirth,
        nationality: decryptedPersonalData.nationality,
        avsNumber: decryptedPersonalData.avsNumber
      },
      incomeData: income,
      deductions: deductions,
      assets: assets,
      realEstate: realEstate,
      documents: documents,
      completionStatus: profile.completion_status,
      encryptedData: profile.encrypted_personal_data
    };
  }
  
  /**
   * Calcule l'impôt basé sur le profil
   */
  async calculateTax(taxProfileId: string, year: number): Promise<TaxCalculation> {
    const { data: profile } = await this.supabase
      .from('tax_profiles')
      .select('*')
      .eq('id', taxProfileId)
      .single();
    
    if (!profile) throw new Error('Profile not found');
    
    const [income, deductions, assets] = await Promise.all([
      this.getIncomeData(taxProfileId, year),
      this.getDeductions(taxProfileId, year),
      this.getAssets(taxProfileId, year)
    ]);
    
    // Calcul du revenu imposable
    const totalIncome = this.calculateTotalIncome(income);
    const totalDeductions = this.calculateTotalDeductions(deductions);
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);
    
    // Calcul de la fortune imposable
    const taxableWealth = assets?.totalWealth || 0;
    
    // Calcul des impôts (simplifié - à améliorer avec les vrais barèmes)
    const federalTax = this.calculateFederalTax(taxableIncome, profile.civil_status);
    const cantonalTax = this.calculateCantonalTax(taxableIncome, profile.canton, profile.civil_status);
    const communalTax = cantonalTax * 1.2; // Coefficient communal moyen
    const churchTax = profile.confession && profile.confession !== 'none' 
      ? cantonalTax * 0.15 
      : 0;
    
    const totalTax = federalTax + cantonalTax + communalTax + churchTax;
    const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;
    const marginalRate = this.getMarginalRate(taxableIncome, profile.canton);
    
    // Calcul de l'impôt restant à payer
    const withheldTax = income?.mainEmployment?.socialDeductions?.totalDeductions || 0;
    const remainingTax = Math.max(0, totalTax - withheldTax);
    
    const calculation: TaxCalculation = {
      canton: profile.canton,
      year,
      taxableIncome,
      taxableWealth,
      federalTax,
      cantonalTax,
      communalTax,
      churchTax,
      totalTax,
      effectiveRate,
      marginalRate,
      withheldTax,
      remainingTax
    };
    
    // Sauvegarde le calcul
    await this.supabase
      .from('tax_calculations')
      .upsert({
        tax_profile_id: taxProfileId,
        year,
        ...calculation
      }, { onConflict: 'tax_profile_id,year' });
    
    return calculation;
  }
  
  /**
   * Méthodes privées pour la gestion des données
   */
  private async saveIncomeData(taxProfileId: string, incomeData: any): Promise<void> {
    const year = new Date().getFullYear();
    
    const dbData = {
      tax_profile_id: taxProfileId,
      year,
      main_employer: incomeData.mainEmployment?.employer,
      gross_salary: incomeData.mainEmployment?.grossSalary || 0,
      net_salary: incomeData.mainEmployment?.netSalary || 0,
      avs_deduction: incomeData.mainEmployment?.socialDeductions?.avs || 0,
      ai_deduction: incomeData.mainEmployment?.socialDeductions?.ai || 0,
      ac_deduction: incomeData.mainEmployment?.socialDeductions?.ac || 0,
      lpp_deduction: incomeData.mainEmployment?.socialDeductions?.lpp || 0,
      self_employment_income: incomeData.selfEmployment?.netProfit || 0,
      rental_income: incomeData.rentalIncome || 0,
      pension_income: incomeData.pensionIncome?.avsRente || 0,
      unemployment_benefits: incomeData.unemploymentBenefits || 0,
      military_compensation: incomeData.militaryCompensation || 0,
      other_income: incomeData.otherIncome || []
    };
    
    await this.supabase
      .from('tax_income_data')
      .upsert(dbData, { onConflict: 'tax_profile_id,year' });
  }
  
  private async saveDeductions(taxProfileId: string, deductions: any): Promise<void> {
    const year = new Date().getFullYear();
    
    const dbData = {
      tax_profile_id: taxProfileId,
      year,
      transport_costs: deductions.professionalExpenses?.transportCosts || 0,
      meal_costs: deductions.professionalExpenses?.mealCosts || 0,
      other_professional_expenses: deductions.professionalExpenses?.otherProfessionalExpenses || 0,
      home_office_deduction: deductions.professionalExpenses?.homeOfficeDeduction || 0,
      health_insurance: deductions.insurancePremiums?.healthInsurance || 0,
      life_insurance: deductions.insurancePremiums?.lifeInsurance || 0,
      accident_insurance: deductions.insurancePremiums?.accidentInsurance || 0,
      pillar_3a: deductions.savingsContributions?.pillar3a || 0,
      pillar_3b: deductions.savingsContributions?.pillar3b || 0,
      lpp_voluntary: deductions.savingsContributions?.lppVoluntary || 0,
      childcare_expenses: deductions.childcareExpenses || 0,
      donations_amount: deductions.donationsAmount || 0,
      alimony_paid: deductions.alimonyPaid || 0,
      real_estate_expenses: deductions.realEstateExpenses || 0,
      other_deductions: deductions.otherDeductions || []
    };
    
    await this.supabase
      .from('tax_deductions')
      .upsert(dbData, { onConflict: 'tax_profile_id,year' });
  }
  
  private async saveAssets(taxProfileId: string, assets: any): Promise<void> {
    const year = new Date().getFullYear();
    
    const dbData = {
      tax_profile_id: taxProfileId,
      year,
      bank_accounts: assets.bankAccounts || [],
      securities: assets.securities || {},
      crypto_assets: assets.cryptoAssets || {},
      other_assets: assets.otherAssets || [],
      total_wealth: assets.totalWealth || 0
    };
    
    await this.supabase
      .from('tax_assets')
      .upsert(dbData, { onConflict: 'tax_profile_id,year' });
  }
  
  private async saveRealEstate(taxProfileId: string, realEstate: any[]): Promise<void> {
    // Supprime les anciennes données
    await this.supabase
      .from('tax_real_estate')
      .delete()
      .eq('tax_profile_id', taxProfileId);
    
    // Insère les nouvelles données
    const dbData = realEstate.map(property => ({
      tax_profile_id: taxProfileId,
      type: property.type,
      address: property.address,
      canton: property.canton,
      purchase_date: property.purchaseDate,
      purchase_price: property.purchasePrice,
      current_value: property.currentValue,
      mortgage_debt: property.mortgageDebt,
      mortgage_interest: property.mortgageInterest,
      maintenance_costs: property.maintenanceCosts,
      rental_income: property.rentalIncome
    }));
    
    if (dbData.length > 0) {
      await this.supabase
        .from('tax_real_estate')
        .insert(dbData);
    }
  }
  
  private async getIncomeData(taxProfileId: string, year: number): Promise<any> {
    const { data } = await this.supabase
      .from('tax_income_data')
      .select('*')
      .eq('tax_profile_id', taxProfileId)
      .eq('year', year)
      .single();
    
    if (!data) return null;
    
    return {
      mainEmployment: {
        employer: data.main_employer,
        grossSalary: data.gross_salary,
        netSalary: data.net_salary,
        socialDeductions: {
          avs: data.avs_deduction,
          ai: data.ai_deduction,
          ac: data.ac_deduction,
          lpp: data.lpp_deduction,
          totalDeductions: data.avs_deduction + data.ai_deduction + data.ac_deduction + data.lpp_deduction
        }
      },
      rentalIncome: data.rental_income,
      pensionIncome: {
        avsRente: data.pension_income
      },
      unemploymentBenefits: data.unemployment_benefits,
      militaryCompensation: data.military_compensation,
      otherIncome: data.other_income
    };
  }
  
  private async getDeductions(taxProfileId: string, year: number): Promise<any> {
    const { data } = await this.supabase
      .from('tax_deductions')
      .select('*')
      .eq('tax_profile_id', taxProfileId)
      .eq('year', year)
      .single();
    
    if (!data) return null;
    
    return {
      professionalExpenses: {
        transportCosts: data.transport_costs,
        mealCosts: data.meal_costs,
        otherProfessionalExpenses: data.other_professional_expenses,
        homeOfficeDeduction: data.home_office_deduction
      },
      insurancePremiums: {
        healthInsurance: data.health_insurance,
        lifeInsurance: data.life_insurance,
        accidentInsurance: data.accident_insurance
      },
      savingsContributions: {
        pillar3a: data.pillar_3a,
        pillar3b: data.pillar_3b,
        lppVoluntary: data.lpp_voluntary
      },
      childcareExpenses: data.childcare_expenses,
      donationsAmount: data.donations_amount,
      alimonyPaid: data.alimony_paid,
      realEstateExpenses: data.real_estate_expenses,
      otherDeductions: data.other_deductions
    };
  }
  
  private async getAssets(taxProfileId: string, year: number): Promise<any> {
    const { data } = await this.supabase
      .from('tax_assets')
      .select('*')
      .eq('tax_profile_id', taxProfileId)
      .eq('year', year)
      .single();
    
    return data ? {
      bankAccounts: data.bank_accounts,
      securities: data.securities,
      cryptoAssets: data.crypto_assets,
      otherAssets: data.other_assets,
      totalWealth: data.total_wealth
    } : null;
  }
  
  private async getRealEstate(taxProfileId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('tax_real_estate')
      .select('*')
      .eq('tax_profile_id', taxProfileId);
    
    return data || [];
  }
  
  private async getDocuments(taxProfileId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('tax_documents')
      .select('*')
      .eq('tax_profile_id', taxProfileId)
      .order('upload_date', { ascending: false });
    
    return data || [];
  }
  
  private calculateCompletionStatus(profileData: Partial<TaxProfile>): CompletionStatus {
    const sections = {
      personalInfo: !!profileData.personalInfo?.canton && !!profileData.personalInfo?.civilStatus,
      income: !!profileData.incomeData?.mainEmployment || !!profileData.incomeData?.pensionIncome,
      deductions: !!profileData.deductions,
      assets: !!profileData.assets,
      realEstate: !!profileData.realEstate && profileData.realEstate.length > 0,
      documents: !!profileData.documents && profileData.documents.length > 0
    };
    
    const completedSections = Object.values(sections).filter(Boolean).length;
    const totalSections = Object.keys(sections).length;
    const overall = Math.round((completedSections / totalSections) * 100);
    
    return {
      overall,
      sections,
      lastModified: new Date(),
      readyForSubmission: overall === 100
    };
  }
  
  private calculateTotalIncome(income: any): number {
    if (!income) return 0;
    
    let total = 0;
    total += income.mainEmployment?.grossSalary || 0;
    total += income.rentalIncome || 0;
    total += income.pensionIncome?.avsRente || 0;
    total += income.unemploymentBenefits || 0;
    total += income.militaryCompensation || 0;
    
    if (income.otherIncome && Array.isArray(income.otherIncome)) {
      total += income.otherIncome.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    }
    
    return total;
  }
  
  private calculateTotalDeductions(deductions: any): number {
    if (!deductions) return 0;
    
    let total = 0;
    
    // Frais professionnels
    total += deductions.professionalExpenses?.transportCosts || 0;
    total += deductions.professionalExpenses?.mealCosts || 0;
    total += deductions.professionalExpenses?.otherProfessionalExpenses || 0;
    total += deductions.professionalExpenses?.homeOfficeDeduction || 0;
    
    // Assurances
    total += deductions.insurancePremiums?.healthInsurance || 0;
    total += deductions.insurancePremiums?.lifeInsurance || 0;
    total += deductions.insurancePremiums?.accidentInsurance || 0;
    
    // Épargne
    total += deductions.savingsContributions?.pillar3a || 0;
    total += deductions.savingsContributions?.pillar3b || 0;
    total += deductions.savingsContributions?.lppVoluntary || 0;
    
    // Autres
    total += deductions.childcareExpenses || 0;
    total += deductions.donationsAmount || 0;
    total += deductions.alimonyPaid || 0;
    total += deductions.realEstateExpenses || 0;
    
    return total;
  }
  
  private calculateFederalTax(taxableIncome: number, civilStatus: string): number {
    // Barème simplifié de l'impôt fédéral direct
    const isMarried = civilStatus === 'married' || civilStatus === 'registered_partnership';
    
    if (isMarried) {
      if (taxableIncome <= 30800) return 0;
      if (taxableIncome <= 50900) return (taxableIncome - 30800) * 0.0077;
      if (taxableIncome <= 58400) return 155 + (taxableIncome - 50900) * 0.0088;
      // ... continuer avec les tranches
    } else {
      if (taxableIncome <= 17800) return 0;
      if (taxableIncome <= 31600) return (taxableIncome - 17800) * 0.0077;
      if (taxableIncome <= 41400) return 106 + (taxableIncome - 31600) * 0.0088;
      // ... continuer avec les tranches
    }
    
    // Taux maximum simplifié
    return taxableIncome * 0.115;
  }
  
  private calculateCantonalTax(taxableIncome: number, canton: string, civilStatus: string): number {
    // Calcul simplifié - à remplacer par les vrais barèmes cantonaux
    const baseRate = this.getCantonBaseRate(canton);
    const adjustedRate = civilStatus === 'married' ? baseRate * 0.85 : baseRate;
    
    return taxableIncome * adjustedRate;
  }
  
  private getCantonBaseRate(canton: string): number {
    // Taux moyens approximatifs par canton
    const rates: Record<string, number> = {
      'ZG': 0.08,
      'SZ': 0.09,
      'NW': 0.10,
      'ZH': 0.13,
      'GE': 0.16,
      'VD': 0.15,
      'BE': 0.14,
      // ... autres cantons
    };
    
    return rates[canton] || 0.12;
  }
  
  private getMarginalRate(taxableIncome: number, canton: string): number {
    // Taux marginal approximatif
    const baseRate = this.getCantonBaseRate(canton);
    
    if (taxableIncome < 50000) return baseRate + 0.05;
    if (taxableIncome < 100000) return baseRate + 0.10;
    if (taxableIncome < 200000) return baseRate + 0.15;
    return baseRate + 0.20;
  }
  
  private mapDbToTaxProfile(dbProfile: any): TaxProfile {
    return {
      id: dbProfile.id,
      userId: dbProfile.user_id,
      anonymizedId: dbProfile.anonymized_id,
      lastUpdated: new Date(dbProfile.updated_at),
      personalInfo: {
        civilStatus: dbProfile.civil_status,
        canton: dbProfile.canton,
        commune: dbProfile.commune,
        numberOfChildren: dbProfile.number_of_children,
        childrenDetails: [],
        confession: dbProfile.confession,
        taxationMode: dbProfile.taxation_mode
      },
      incomeData: {},
      deductions: {},
      assets: {},
      realEstate: [],
      documents: [],
      completionStatus: dbProfile.completion_status,
      encryptedData: dbProfile.encrypted_personal_data
    } as TaxProfile;
  }
}