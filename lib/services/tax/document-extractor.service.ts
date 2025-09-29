import { TaxDocument, Employment, BankAccount } from '@/types/tax';

/**
 * Service d'extraction automatique de données depuis les documents fiscaux
 */
export class DocumentExtractorService {
  
  /**
   * Mots-clés pour identifier les différents types de données dans les documents
   */
  private static readonly KEYWORDS = {
    salary: {
      gross: ['bruttolohn', 'salaire brut', 'gross salary', 'lohn brutto', 'traitement brut'],
      net: ['nettolohn', 'salaire net', 'net salary', 'lohn netto'],
      avs: ['ahv', 'avs', 'beitrag ahv/iv/eo', 'cotisation avs/ai/apl'],
      lpp: ['bvg', 'lpp', 'pensionskasse', 'caisse de pension', 'prévoyance professionnelle'],
      employer: ['arbeitgeber', 'employeur', 'employer', 'firma', 'entreprise']
    },
    bank: {
      balance: ['saldo', 'solde', 'balance', 'kontostand', 'avoir'],
      interest: ['zins', 'intérêt', 'interest', 'zinsen', 'intérêts'],
      account: ['konto', 'compte', 'account', 'kontonummer', 'numéro de compte'],
      iban: ['iban', 'ch\\d{2}[\\s]?\\d{4}[\\s]?\\d{4}[\\s]?\\d{4}[\\s]?\\d{4}[\\s]?\\d{1}']
    },
    tax: {
      withheld: ['quellensteuer', 'impôt à la source', 'withholding tax', 'steuerabzug'],
      deductible: ['abzugsfähig', 'déductible', 'deductible', 'abzug'],
      certificate: ['bescheinigung', 'attestation', 'certificate', 'ausweis']
    },
    insurance: {
      premium: ['prämie', 'prime', 'premium', 'jahresprämie', 'prime annuelle'],
      health: ['krankenversicherung', 'assurance maladie', 'health insurance', 'krankenkasse'],
      life: ['lebensversicherung', 'assurance vie', 'life insurance']
    }
  };
  
  /**
   * Patterns regex pour extraire des montants et nombres
   */
  private static readonly PATTERNS = {
    amount: /(?:CHF|Fr\.|SFr\.?)\s*([\d']+(?:\.\d{2})?)/gi,
    percentage: /(\d+(?:\.\d+)?)\s*%/g,
    year: /20\d{2}/g,
    date: /(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})/g
  };
  
  /**
   * Extrait les données d'un certificat de salaire
   */
  static async extractSalaryCertificate(text: string): Promise<Partial<Employment>> {
    const result: Partial<Employment> = {};
    
    // Recherche de l'employeur
    const employerMatch = this.findValueNearKeyword(text, this.KEYWORDS.salary.employer);
    if (employerMatch) {
      result.employer = this.cleanCompanyName(employerMatch);
    }
    
    // Recherche du salaire brut
    const grossSalaryMatch = this.findAmountNearKeyword(text, this.KEYWORDS.salary.gross);
    if (grossSalaryMatch) {
      result.grossSalary = grossSalaryMatch;
    }
    
    // Recherche du salaire net
    const netSalaryMatch = this.findAmountNearKeyword(text, this.KEYWORDS.salary.net);
    if (netSalaryMatch) {
      result.netSalary = netSalaryMatch;
    }
    
    // Extraction des déductions sociales
    const socialDeductions = {
      avs: this.findAmountNearKeyword(text, this.KEYWORDS.salary.avs) || 0,
      ai: 0, // Généralement inclus avec AVS
      ac: 0, // À extraire si disponible
      lpp: this.findAmountNearKeyword(text, this.KEYWORDS.salary.lpp) || 0,
      totalDeductions: 0
    };
    
    socialDeductions.totalDeductions = socialDeductions.avs + socialDeductions.lpp;
    result.socialDeductions = socialDeductions;
    
    return result;
  }
  
  /**
   * Extrait les données d'un relevé bancaire
   */
  static async extractBankStatement(text: string): Promise<Partial<BankAccount>> {
    const result: Partial<BankAccount> = {};
    
    // Recherche du nom de la banque
    const bankNames = ['UBS', 'Credit Suisse', 'PostFinance', 'Raiffeisen', 'ZKB', 'BCG', 'Migros Bank'];
    for (const bankName of bankNames) {
      if (text.includes(bankName)) {
        result.bankName = bankName;
        break;
      }
    }
    
    // Recherche du solde
    const balanceMatch = this.findAmountNearKeyword(text, this.KEYWORDS.bank.balance);
    if (balanceMatch) {
      result.balance = balanceMatch;
    }
    
    // Recherche des intérêts
    const interestMatch = this.findAmountNearKeyword(text, this.KEYWORDS.bank.interest);
    if (interestMatch) {
      result.interestEarned = interestMatch;
    }
    
    // Détection du type de compte
    if (text.toLowerCase().includes('épargne') || text.toLowerCase().includes('sparkonto')) {
      result.accountType = 'savings';
    } else if (text.toLowerCase().includes('privé') || text.toLowerCase().includes('privatkonto')) {
      result.accountType = 'checking';
    }
    
    return result;
  }
  
  /**
   * Extrait les données d'une attestation d'assurance
   */
  static async extractInsuranceCertificate(text: string): Promise<{
    type: string;
    premium: number;
    provider?: string;
  }> {
    const result: any = {};
    
    // Détection du type d'assurance
    if (this.containsKeyword(text, this.KEYWORDS.insurance.health)) {
      result.type = 'health';
    } else if (this.containsKeyword(text, this.KEYWORDS.insurance.life)) {
      result.type = 'life';
    }
    
    // Extraction de la prime
    const premiumMatch = this.findAmountNearKeyword(text, this.KEYWORDS.insurance.premium);
    if (premiumMatch) {
      result.premium = premiumMatch;
    }
    
    // Recherche du fournisseur
    const providers = ['CSS', 'Helsana', 'Swica', 'Concordia', 'Sanitas', 'Visana', 'Groupe Mutuel'];
    for (const provider of providers) {
      if (text.includes(provider)) {
        result.provider = provider;
        break;
      }
    }
    
    return result;
  }
  
  /**
   * Extrait les données d'un relevé fiscal
   */
  static async extractTaxStatement(text: string): Promise<{
    withheldTax?: number;
    deductibleAmounts?: number[];
    year?: number;
  }> {
    const result: any = {};
    
    // Extraction de l'impôt à la source
    const withheldMatch = this.findAmountNearKeyword(text, this.KEYWORDS.tax.withheld);
    if (withheldMatch) {
      result.withheldTax = withheldMatch;
    }
    
    // Extraction de l'année
    const yearMatch = text.match(/20\d{2}/);
    if (yearMatch) {
      result.year = parseInt(yearMatch[0]);
    }
    
    // Extraction des montants déductibles
    const deductibleMatches = this.findAllAmountsNearKeyword(text, this.KEYWORDS.tax.deductible);
    if (deductibleMatches.length > 0) {
      result.deductibleAmounts = deductibleMatches;
    }
    
    return result;
  }
  
  /**
   * Analyse automatique du type de document
   */
  static detectDocumentType(text: string): string {
    const documentPatterns = {
      salary_certificate: ['lohnausweis', 'certificat de salaire', 'salary certificate'],
      bank_statement: ['kontoauszug', 'relevé bancaire', 'bank statement'],
      tax_statement: ['steuerausweis', 'attestation fiscale', 'tax certificate'],
      insurance_premium: ['prämienrechnung', 'décompte de primes', 'premium invoice'],
      rental_contract: ['mietvertrag', 'contrat de bail', 'rental agreement'],
      pension_certificate: ['rentenausweis', 'attestation de rente', 'pension certificate']
    };
    
    for (const [type, patterns] of Object.entries(documentPatterns)) {
      for (const pattern of patterns) {
        if (text.toLowerCase().includes(pattern)) {
          return type;
        }
      }
    }
    
    return 'other';
  }
  
  /**
   * Extraction principale basée sur le type de document
   */
  static async extractFromDocument(text: string, documentType?: string): Promise<any> {
    const type = documentType || this.detectDocumentType(text);
    
    switch (type) {
      case 'salary_certificate':
        return await this.extractSalaryCertificate(text);
      
      case 'bank_statement':
        return await this.extractBankStatement(text);
      
      case 'tax_statement':
        return await this.extractTaxStatement(text);
      
      case 'insurance_premium':
        return await this.extractInsuranceCertificate(text);
      
      default:
        return this.extractGenericData(text);
    }
  }
  
  /**
   * Extraction générique pour documents non reconnus
   */
  private static extractGenericData(text: string): any {
    const result: any = {};
    
    // Extraction de tous les montants
    const amounts = this.extractAllAmounts(text);
    if (amounts.length > 0) {
      result.amounts = amounts;
    }
    
    // Extraction des dates
    const dates = this.extractDates(text);
    if (dates.length > 0) {
      result.dates = dates;
    }
    
    // Extraction des pourcentages
    const percentages = this.extractPercentages(text);
    if (percentages.length > 0) {
      result.percentages = percentages;
    }
    
    return result;
  }
  
  /**
   * Utilitaires d'extraction
   */
  private static findValueNearKeyword(text: string, keywords: string[]): string | null {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s]+([\\w\\s&.-]+)`, 'gi');
      const match = regex.exec(text);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  }
  
  private static findAmountNearKeyword(text: string, keywords: string[]): number | null {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s\\w]*?([\\d']+(?:\\.\\d{2})?)`, 'gi');
      const match = regex.exec(text);
      if (match) {
        return this.parseAmount(match[1]);
      }
    }
    return null;
  }
  
  private static findAllAmountsNearKeyword(text: string, keywords: string[]): number[] {
    const amounts: number[] = [];
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s\\w]*?([\\d']+(?:\\.\\d{2})?)`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        amounts.push(this.parseAmount(match[1]));
      }
    }
    return amounts;
  }
  
  private static containsKeyword(text: string, keywords: string[]): boolean {
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  }
  
  private static parseAmount(amountStr: string): number {
    return parseFloat(amountStr.replace(/'/g, '').replace(/,/g, '.'));
  }
  
  private static cleanCompanyName(name: string): string {
    return name.replace(/[^\w\s&.-]/g, '').trim();
  }
  
  private static extractAllAmounts(text: string): number[] {
    const amounts: number[] = [];
    let match;
    while ((match = this.PATTERNS.amount.exec(text)) !== null) {
      amounts.push(this.parseAmount(match[1]));
    }
    return amounts;
  }
  
  private static extractDates(text: string): string[] {
    const dates: string[] = [];
    let match;
    while ((match = this.PATTERNS.date.exec(text)) !== null) {
      dates.push(`${match[1]}/${match[2]}/${match[3]}`);
    }
    return dates;
  }
  
  private static extractPercentages(text: string): number[] {
    const percentages: number[] = [];
    let match;
    while ((match = this.PATTERNS.percentage.exec(text)) !== null) {
      percentages.push(parseFloat(match[1]));
    }
    return percentages;
  }
}