export interface TaxProfile {
  id: string;
  userId: string;
  anonymizedId: string;
  lastUpdated: Date;
  
  personalInfo: PersonalInfo;
  incomeData: IncomeData;
  deductions: Deductions;
  assets: Assets;
  realEstate: RealEstate[];
  documents: TaxDocument[];
  
  completionStatus: CompletionStatus;
  encryptedData?: string;
}

export interface PersonalInfo {
  civilStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'registered_partnership';
  canton: Canton;
  commune: string;
  numberOfChildren: number;
  childrenDetails?: ChildInfo[];
  confession?: 'protestant' | 'catholic' | 'other' | 'none';
  taxationMode?: 'individual' | 'family';
  dateOfBirth?: Date;
  nationality?: string;
  avsNumber?: string; // Encrypted
}

export interface ChildInfo {
  id: string;
  birthYear: number;
  inEducation: boolean;
  educationType?: 'apprenticeship' | 'university' | 'school' | 'other';
  supportAmount?: number;
}

export interface IncomeData {
  mainEmployment?: Employment;
  secondaryEmployments?: Employment[];
  selfEmployment?: SelfEmployment;
  rentalIncome?: number;
  pensionIncome?: PensionIncome;
  unemploymentBenefits?: number;
  militaryCompensation?: number;
  otherIncome?: OtherIncome[];
}

export interface Employment {
  id: string;
  employer: string;
  grossSalary: number;
  netSalary: number;
  socialDeductions: SocialDeductions;
  certificateAvailable: boolean;
  certificateDocument?: TaxDocument;
}

export interface SocialDeductions {
  avs: number;
  ai: number;
  ac: number;
  lpp: number;
  totalDeductions: number;
}

export interface SelfEmployment {
  businessName: string;
  businessType: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  documents?: TaxDocument[];
}

export interface PensionIncome {
  avsRente?: number;
  lppPension?: number;
  thirdPillarWithdrawal?: number;
  otherPensions?: number;
}

export interface OtherIncome {
  type: string;
  amount: number;
  description: string;
}

export interface Deductions {
  professionalExpenses: ProfessionalExpenses;
  insurancePremiums: InsurancePremiums;
  savingsContributions: SavingsContributions;
  realEstateExpenses?: number;
  childcareExpenses?: number;
  donationsAmount?: number;
  alimonyPaid?: number;
  otherDeductions?: OtherDeduction[];
}

export interface ProfessionalExpenses {
  transportCosts: number;
  mealCosts: number;
  otherProfessionalExpenses: number;
  homeOfficeDeduction?: number;
}

export interface InsurancePremiums {
  healthInsurance: number;
  lifeInsurance: number;
  accidentInsurance?: number;
}

export interface SavingsContributions {
  pillar3a: number;
  pillar3b?: number;
  lppVoluntary?: number;
}

export interface OtherDeduction {
  type: string;
  amount: number;
  description: string;
}

export interface Assets {
  bankAccounts: BankAccount[];
  securities: Securities;
  cryptoAssets?: CryptoAssets;
  otherAssets?: OtherAsset[];
  totalWealth: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'deposit' | 'other';
  balance: number;
  interestEarned: number;
}

export interface Securities {
  stocks?: SecurityHolding[];
  bonds?: SecurityHolding[];
  funds?: SecurityHolding[];
  totalValue: number;
  dividendsReceived: number;
}

export interface SecurityHolding {
  name: string;
  isin?: string;
  quantity: number;
  value: number;
  dividends?: number;
}

export interface CryptoAssets {
  holdings: CryptoHolding[];
  totalValue: number;
}

export interface CryptoHolding {
  currency: string;
  amount: number;
  valueInCHF: number;
}

export interface OtherAsset {
  type: string;
  description: string;
  value: number;
}

export interface RealEstate {
  id: string;
  type: 'primary_residence' | 'secondary_residence' | 'rental_property';
  address: string;
  canton: Canton;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  mortgageDebt: number;
  mortgageInterest: number;
  maintenanceCosts?: number;
  rentalIncome?: number;
}

export interface TaxDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  uploadDate: Date;
  extractedData?: any;
  status: 'pending' | 'processed' | 'error';
  encryptedUrl: string;
}

export type DocumentType = 
  | 'salary_certificate'
  | 'pension_certificate'
  | 'bank_statement'
  | 'tax_statement'
  | 'insurance_premium'
  | 'rental_contract'
  | 'mortgage_statement'
  | 'donation_receipt'
  | 'medical_expenses'
  | 'other';

export interface CompletionStatus {
  overall: number;
  sections: {
    personalInfo: boolean;
    income: boolean;
    deductions: boolean;
    assets: boolean;
    realEstate: boolean;
    documents: boolean;
  };
  lastModified: Date;
  readyForSubmission: boolean;
}

export type Canton = 
  | 'ZH' | 'BE' | 'LU' | 'UR' | 'SZ' | 'OW' | 'NW' | 'GL' | 'ZG' 
  | 'FR' | 'SO' | 'BS' | 'BL' | 'SH' | 'AR' | 'AI' | 'SG' | 'GR' 
  | 'AG' | 'TG' | 'TI' | 'VD' | 'VS' | 'NE' | 'GE' | 'JU';

export interface TaxCalculation {
  canton: Canton;
  year: number;
  taxableIncome: number;
  taxableWealth: number;
  
  federalTax: number;
  cantonalTax: number;
  communalTax: number;
  churchTax?: number;
  
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  
  withheldTax: number;
  remainingTax: number;
}

export interface TaxFormData {
  profile: TaxProfile;
  calculation: TaxCalculation;
  formType: 'standard' | 'simplified' | 'complex';
  language: 'de' | 'fr' | 'it' | 'en';
  exportFormat: 'PDF' | 'DOCX' | 'TAX';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    category?: string;
    field?: string;
    validated?: boolean;
    confidence?: number;
  };
}

export interface TaxAssistantSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  messages: ChatMessage[];
  currentSection: string;
  progress: number;
  collectedData: Partial<TaxProfile>;
}