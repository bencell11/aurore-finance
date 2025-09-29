import { TaxProfile, TaxCalculation } from '@/types/tax';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Service de génération de documents fiscaux
 */
export class TaxDocumentGeneratorService {
  
  /**
   * Génère une déclaration fiscale complète en HTML
   */
  static generateTaxDeclarationHTML(profile: TaxProfile, calculation: TaxCalculation): string {
    const year = new Date().getFullYear();
    
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Déclaration d'impôt ${year} - ${profile.personalInfo.canton}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        .container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            position: relative;
        }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header .subtitle { opacity: 0.9; }
        .canton-badge {
            position: absolute;
            top: 30px;
            right: 30px;
            background: white;
            color: #667eea;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
        }
        .section {
            padding: 30px;
            border-bottom: 1px solid #e0e0e0;
        }
        .section:last-child { border-bottom: none; }
        .section h2 {
            color: #667eea;
            font-size: 20px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding: 8px;
            background: #fafafa;
            border-radius: 4px;
        }
        .row:hover { background: #f0f0f0; }
        .label {
            font-weight: 500;
            color: #666;
        }
        .value {
            font-weight: 600;
            color: #333;
        }
        .value.negative { color: #d32f2f; }
        .value.positive { color: #388e3c; }
        .subsection {
            margin: 20px 0;
            padding-left: 20px;
            border-left: 3px solid #e0e0e0;
        }
        .subsection h3 {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
        }
        .total-row {
            font-size: 18px;
            font-weight: bold;
            background: #667eea;
            color: white;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
        }
        .info-box {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning-box {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            background: #f5f5f5;
            padding: 30px;
            text-align: center;
            color: #666;
        }
        .signature-box {
            margin-top: 40px;
            padding: 20px;
            border: 2px dashed #ccc;
            text-align: center;
        }
        @media print {
            .container { box-shadow: none; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Déclaration d'impôt ${year}</h1>
            <div class="subtitle">Confédération suisse • Canton de ${profile.personalInfo.canton}</div>
            <div class="canton-badge">${profile.personalInfo.canton}</div>
        </div>
        
        <!-- Section A: Données personnelles -->
        <div class="section">
            <h2>A. Données personnelles</h2>
            <div class="row">
                <span class="label">État civil:</span>
                <span class="value">${this.formatCivilStatus(profile.personalInfo.civilStatus)}</span>
            </div>
            <div class="row">
                <span class="label">Canton de domicile:</span>
                <span class="value">${profile.personalInfo.canton}</span>
            </div>
            <div class="row">
                <span class="label">Commune:</span>
                <span class="value">${profile.personalInfo.commune || 'À compléter'}</span>
            </div>
            <div class="row">
                <span class="label">Nombre d'enfants à charge:</span>
                <span class="value">${profile.personalInfo.numberOfChildren || 0}</span>
            </div>
            ${profile.personalInfo.confession ? `
            <div class="row">
                <span class="label">Confession:</span>
                <span class="value">${this.formatConfession(profile.personalInfo.confession)}</span>
            </div>` : ''}
        </div>
        
        <!-- Section B: Revenus -->
        <div class="section">
            <h2>B. Revenus</h2>
            
            ${profile.incomeData?.mainEmployment ? `
            <div class="subsection">
                <h3>Activité lucrative dépendante</h3>
                <div class="row">
                    <span class="label">Employeur:</span>
                    <span class="value">${profile.incomeData.mainEmployment.employer}</span>
                </div>
                <div class="row">
                    <span class="label">Salaire brut annuel:</span>
                    <span class="value">${this.formatCurrency(profile.incomeData.mainEmployment.grossSalary)}</span>
                </div>
                <div class="row">
                    <span class="label">Cotisations sociales:</span>
                    <span class="value negative">- ${this.formatCurrency(profile.incomeData.mainEmployment.socialDeductions?.totalDeductions || 0)}</span>
                </div>
            </div>` : ''}
            
            ${profile.incomeData?.rentalIncome ? `
            <div class="subsection">
                <h3>Revenus immobiliers</h3>
                <div class="row">
                    <span class="label">Revenus locatifs:</span>
                    <span class="value">${this.formatCurrency(profile.incomeData.rentalIncome)}</span>
                </div>
            </div>` : ''}
            
            ${profile.incomeData?.pensionIncome ? `
            <div class="subsection">
                <h3>Rentes et pensions</h3>
                ${profile.incomeData.pensionIncome.avsRente ? `
                <div class="row">
                    <span class="label">Rente AVS:</span>
                    <span class="value">${this.formatCurrency(profile.incomeData.pensionIncome.avsRente)}</span>
                </div>` : ''}
                ${profile.incomeData.pensionIncome.lppPension ? `
                <div class="row">
                    <span class="label">Pension LPP:</span>
                    <span class="value">${this.formatCurrency(profile.incomeData.pensionIncome.lppPension)}</span>
                </div>` : ''}
            </div>` : ''}
            
            <div class="total-row">
                <div style="display: flex; justify-content: space-between;">
                    <span>Total des revenus:</span>
                    <span>${this.formatCurrency(this.calculateTotalIncome(profile.incomeData))}</span>
                </div>
            </div>
        </div>
        
        <!-- Section C: Déductions -->
        <div class="section">
            <h2>C. Déductions</h2>
            
            ${profile.deductions?.professionalExpenses ? `
            <div class="subsection">
                <h3>Frais professionnels</h3>
                ${profile.deductions.professionalExpenses.transportCosts ? `
                <div class="row">
                    <span class="label">Frais de transport:</span>
                    <span class="value">${this.formatCurrency(profile.deductions.professionalExpenses.transportCosts)}</span>
                </div>` : ''}
                ${profile.deductions.professionalExpenses.mealCosts ? `
                <div class="row">
                    <span class="label">Frais de repas:</span>
                    <span class="value">${this.formatCurrency(profile.deductions.professionalExpenses.mealCosts)}</span>
                </div>` : ''}
                ${profile.deductions.professionalExpenses.otherProfessionalExpenses ? `
                <div class="row">
                    <span class="label">Autres frais professionnels:</span>
                    <span class="value">${this.formatCurrency(profile.deductions.professionalExpenses.otherProfessionalExpenses)}</span>
                </div>` : ''}
            </div>` : ''}
            
            ${profile.deductions?.savingsContributions ? `
            <div class="subsection">
                <h3>Prévoyance</h3>
                ${profile.deductions.savingsContributions.pillar3a ? `
                <div class="row">
                    <span class="label">3e pilier A:</span>
                    <span class="value">${this.formatCurrency(profile.deductions.savingsContributions.pillar3a)}</span>
                </div>` : ''}
                ${profile.deductions.savingsContributions.lppVoluntary ? `
                <div class="row">
                    <span class="label">Rachats LPP:</span>
                    <span class="value">${this.formatCurrency(profile.deductions.savingsContributions.lppVoluntary)}</span>
                </div>` : ''}
            </div>` : ''}
            
            ${profile.deductions?.insurancePremiums ? `
            <div class="subsection">
                <h3>Primes d'assurance</h3>
                <div class="row">
                    <span class="label">Assurance maladie:</span>
                    <span class="value">${this.formatCurrency(profile.deductions.insurancePremiums.healthInsurance)}</span>
                </div>
                ${profile.deductions.insurancePremiums.lifeInsurance ? `
                <div class="row">
                    <span class="label">Assurance vie:</span>
                    <span class="value">${this.formatCurrency(profile.deductions.insurancePremiums.lifeInsurance)}</span>
                </div>` : ''}
            </div>` : ''}
            
            <div class="total-row">
                <div style="display: flex; justify-content: space-between;">
                    <span>Total des déductions:</span>
                    <span>${this.formatCurrency(this.calculateTotalDeductions(profile.deductions))}</span>
                </div>
            </div>
        </div>
        
        <!-- Section D: Fortune -->
        <div class="section">
            <h2>D. Fortune</h2>
            
            ${profile.assets?.bankAccounts && profile.assets.bankAccounts.length > 0 ? `
            <div class="subsection">
                <h3>Comptes bancaires</h3>
                ${profile.assets.bankAccounts.map(account => `
                <div class="row">
                    <span class="label">${account.bankName} - ${this.formatAccountType(account.accountType)}:</span>
                    <span class="value">${this.formatCurrency(account.balance)}</span>
                </div>`).join('')}
            </div>` : ''}
            
            ${profile.assets?.securities?.totalValue ? `
            <div class="subsection">
                <h3>Titres et placements</h3>
                <div class="row">
                    <span class="label">Valeur totale des titres:</span>
                    <span class="value">${this.formatCurrency(profile.assets.securities.totalValue)}</span>
                </div>
                ${profile.assets.securities.dividendsReceived ? `
                <div class="row">
                    <span class="label">Dividendes perçus:</span>
                    <span class="value">${this.formatCurrency(profile.assets.securities.dividendsReceived)}</span>
                </div>` : ''}
            </div>` : ''}
            
            ${profile.realEstate && profile.realEstate.length > 0 ? `
            <div class="subsection">
                <h3>Biens immobiliers</h3>
                ${profile.realEstate.map(property => `
                <div class="row">
                    <span class="label">${this.formatPropertyType(property.type)}:</span>
                    <span class="value">${this.formatCurrency(property.currentValue)}</span>
                </div>
                ${property.mortgageDebt ? `
                <div class="row">
                    <span class="label">Dette hypothécaire:</span>
                    <span class="value negative">- ${this.formatCurrency(property.mortgageDebt)}</span>
                </div>` : ''}`).join('')}
            </div>` : ''}
            
            <div class="total-row">
                <div style="display: flex; justify-content: space-between;">
                    <span>Fortune nette totale:</span>
                    <span>${this.formatCurrency(profile.assets?.totalWealth || 0)}</span>
                </div>
            </div>
        </div>
        
        <!-- Section E: Calcul de l'impôt -->
        ${calculation ? `
        <div class="section">
            <h2>E. Calcul de l'impôt</h2>
            
            <div class="info-box">
                <strong>Base de calcul</strong><br>
                Revenu imposable: ${this.formatCurrency(calculation.taxableIncome)}<br>
                Fortune imposable: ${this.formatCurrency(calculation.taxableWealth)}
            </div>
            
            <div class="subsection">
                <h3>Décomposition de l'impôt</h3>
                <div class="row">
                    <span class="label">Impôt fédéral direct:</span>
                    <span class="value">${this.formatCurrency(calculation.federalTax)}</span>
                </div>
                <div class="row">
                    <span class="label">Impôt cantonal:</span>
                    <span class="value">${this.formatCurrency(calculation.cantonalTax)}</span>
                </div>
                <div class="row">
                    <span class="label">Impôt communal:</span>
                    <span class="value">${this.formatCurrency(calculation.communalTax)}</span>
                </div>
                ${calculation.churchTax ? `
                <div class="row">
                    <span class="label">Impôt ecclésiastique:</span>
                    <span class="value">${this.formatCurrency(calculation.churchTax)}</span>
                </div>` : ''}
            </div>
            
            <div class="total-row" style="background: #d32f2f;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Total de l'impôt à payer:</span>
                    <span>${this.formatCurrency(calculation.totalTax)}</span>
                </div>
            </div>
            
            <div class="subsection" style="margin-top: 30px;">
                <h3>Taux d'imposition</h3>
                <div class="row">
                    <span class="label">Taux effectif:</span>
                    <span class="value">${calculation.effectiveRate.toFixed(2)}%</span>
                </div>
                <div class="row">
                    <span class="label">Taux marginal:</span>
                    <span class="value">${calculation.marginalRate.toFixed(2)}%</span>
                </div>
            </div>
            
            ${calculation.withheldTax > 0 ? `
            <div class="subsection">
                <h3>Acomptes et retenues</h3>
                <div class="row">
                    <span class="label">Impôt déjà retenu à la source:</span>
                    <span class="value positive">- ${this.formatCurrency(calculation.withheldTax)}</span>
                </div>
                <div class="total-row" style="background: ${calculation.remainingTax > 0 ? '#ff9800' : '#388e3c'};">
                    <div style="display: flex; justify-content: space-between;">
                        <span>${calculation.remainingTax > 0 ? 'Solde à payer:' : 'Remboursement:'}</span>
                        <span>${this.formatCurrency(Math.abs(calculation.remainingTax))}</span>
                    </div>
                </div>
            </div>` : ''}
        </div>` : ''}
        
        <!-- Déclaration et signature -->
        <div class="section">
            <h2>Déclaration</h2>
            <p style="margin: 20px 0; line-height: 1.8;">
                Je déclare / nous déclarons que les indications fournies dans cette déclaration d'impôt 
                et dans ses annexes sont complètes et conformes à la vérité.
            </p>
            
            <div class="signature-box">
                <p>Date et signature(s)</p>
                <div style="margin-top: 60px; border-top: 2px solid #333; width: 300px; margin: 60px auto 0;">
                    <p style="margin-top: 10px;">Date: ${new Date().toLocaleDateString('fr-CH')}</p>
                </div>
            </div>
        </div>
        
        <!-- Pied de page -->
        <div class="footer">
            <p><strong>Document généré par Aurore Finance</strong></p>
            <p>Assistant fiscal intelligent pour la Suisse</p>
            <p style="margin-top: 10px; font-size: 12px; color: #999;">
                Ce document est un projet de déclaration. Veuillez le vérifier avant soumission officielle.
            </p>
        </div>
    </div>
</body>
</html>`;
  }
  
  /**
   * Génère un export au format TAX (format officiel suisse)
   */
  static generateTAXExport(profile: TaxProfile, calculation: TaxCalculation): string {
    const year = new Date().getFullYear();
    
    // Format TAX simplifié - structure XML utilisée par certains cantons
    return `<?xml version="1.0" encoding="UTF-8"?>
<eCH-0196:delivery xmlns:eCH-0196="http://www.ech.ch/xmlns/eCH-0196/2">
  <eCH-0196:deliveryHeader>
    <eCH-0196:senderId>AURORE-FINANCE</eCH-0196:senderId>
    <eCH-0196:messageDate>${new Date().toISOString()}</eCH-0196:messageDate>
    <eCH-0196:messageType>TAX_DECLARATION</eCH-0196:messageType>
    <eCH-0196:taxYear>${year}</eCH-0196:taxYear>
    <eCH-0196:canton>${profile.personalInfo.canton}</eCH-0196:canton>
  </eCH-0196:deliveryHeader>
  
  <eCH-0196:taxDeclaration>
    <!-- Données personnelles -->
    <eCH-0196:personalData>
      <eCH-0196:civilStatus>${profile.personalInfo.civilStatus}</eCH-0196:civilStatus>
      <eCH-0196:canton>${profile.personalInfo.canton}</eCH-0196:canton>
      <eCH-0196:municipality>${profile.personalInfo.commune || ''}</eCH-0196:municipality>
      <eCH-0196:numberOfChildren>${profile.personalInfo.numberOfChildren || 0}</eCH-0196:numberOfChildren>
      <eCH-0196:confession>${profile.personalInfo.confession || 'none'}</eCH-0196:confession>
    </eCH-0196:personalData>
    
    <!-- Revenus -->
    <eCH-0196:income>
      ${profile.incomeData?.mainEmployment ? `
      <eCH-0196:employment>
        <eCH-0196:employer>${this.escapeXML(profile.incomeData.mainEmployment.employer)}</eCH-0196:employer>
        <eCH-0196:grossSalary>${profile.incomeData.mainEmployment.grossSalary}</eCH-0196:grossSalary>
        <eCH-0196:socialDeductions>${profile.incomeData.mainEmployment.socialDeductions?.totalDeductions || 0}</eCH-0196:socialDeductions>
      </eCH-0196:employment>` : ''}
      
      ${profile.incomeData?.rentalIncome ? `
      <eCH-0196:rentalIncome>${profile.incomeData.rentalIncome}</eCH-0196:rentalIncome>` : ''}
      
      ${profile.incomeData?.pensionIncome?.avsRente ? `
      <eCH-0196:pensionAVS>${profile.incomeData.pensionIncome.avsRente}</eCH-0196:pensionAVS>` : ''}
    </eCH-0196:income>
    
    <!-- Déductions -->
    <eCH-0196:deductions>
      ${profile.deductions?.savingsContributions?.pillar3a ? `
      <eCH-0196:pillar3a>${profile.deductions.savingsContributions.pillar3a}</eCH-0196:pillar3a>` : ''}
      
      ${profile.deductions?.professionalExpenses ? `
      <eCH-0196:professionalExpenses>
        <eCH-0196:transport>${profile.deductions.professionalExpenses.transportCosts || 0}</eCH-0196:transport>
        <eCH-0196:meals>${profile.deductions.professionalExpenses.mealCosts || 0}</eCH-0196:meals>
        <eCH-0196:other>${profile.deductions.professionalExpenses.otherProfessionalExpenses || 0}</eCH-0196:other>
      </eCH-0196:professionalExpenses>` : ''}
      
      ${profile.deductions?.insurancePremiums?.healthInsurance ? `
      <eCH-0196:healthInsurance>${profile.deductions.insurancePremiums.healthInsurance}</eCH-0196:healthInsurance>` : ''}
    </eCH-0196:deductions>
    
    <!-- Fortune -->
    <eCH-0196:assets>
      <eCH-0196:bankAccounts>
        ${profile.assets?.bankAccounts?.map(account => `
        <eCH-0196:account>
          <eCH-0196:bank>${this.escapeXML(account.bankName)}</eCH-0196:bank>
          <eCH-0196:balance>${account.balance}</eCH-0196:balance>
        </eCH-0196:account>`).join('') || ''}
      </eCH-0196:bankAccounts>
      
      ${profile.assets?.securities?.totalValue ? `
      <eCH-0196:securities>${profile.assets.securities.totalValue}</eCH-0196:securities>` : ''}
      
      <eCH-0196:totalWealth>${profile.assets?.totalWealth || 0}</eCH-0196:totalWealth>
    </eCH-0196:assets>
    
    <!-- Calcul -->
    ${calculation ? `
    <eCH-0196:taxCalculation>
      <eCH-0196:taxableIncome>${calculation.taxableIncome}</eCH-0196:taxableIncome>
      <eCH-0196:taxableWealth>${calculation.taxableWealth}</eCH-0196:taxableWealth>
      <eCH-0196:federalTax>${calculation.federalTax}</eCH-0196:federalTax>
      <eCH-0196:cantonalTax>${calculation.cantonalTax}</eCH-0196:cantonalTax>
      <eCH-0196:communalTax>${calculation.communalTax}</eCH-0196:communalTax>
      <eCH-0196:totalTax>${calculation.totalTax}</eCH-0196:totalTax>
    </eCH-0196:taxCalculation>` : ''}
  </eCH-0196:taxDeclaration>
</eCH-0196:delivery>`;
  }
  
  /**
   * Génère un rapport d'optimisation en PDF
   */
  static async generateOptimizationReportPDF(
    profile: TaxProfile,
    calculation: TaxCalculation,
    optimizations: any[]
  ): Promise<Blob> {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text('Rapport d\'Optimisation Fiscale', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-CH')}`, 20, yPosition);
    yPosition += 15;
    
    // Résumé
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Résumé Exécutif', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(`Impôt actuel: ${this.formatCurrency(calculation.totalTax)}`, 20, yPosition);
    yPosition += 7;
    
    const totalSavings = optimizations.reduce((sum, opt) => sum + opt.savingAmount, 0);
    doc.text(`Économies potentielles: ${this.formatCurrency(totalSavings)}`, 20, yPosition);
    yPosition += 7;
    
    doc.text(`Taux effectif actuel: ${calculation.effectiveRate.toFixed(2)}%`, 20, yPosition);
    yPosition += 15;
    
    // Optimisations
    doc.setFontSize(16);
    doc.text('Optimisations Recommandées', 20, yPosition);
    yPosition += 10;
    
    optimizations.forEach((opt, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(102, 126, 234);
      doc.text(`${index + 1}. ${opt.title}`, 20, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.setTextColor(0);
      const lines = doc.splitTextToSize(opt.description, 170);
      lines.forEach((line: string) => {
        doc.text(line, 25, yPosition);
        yPosition += 5;
      });
      
      doc.setTextColor(0, 128, 0);
      doc.text(`Économie: ${this.formatCurrency(opt.savingAmount)}`, 25, yPosition);
      yPosition += 5;
      
      if (opt.deadline) {
        doc.setTextColor(255, 152, 0);
        doc.text(`Échéance: ${opt.deadline}`, 25, yPosition);
        yPosition += 5;
      }
      
      yPosition += 5;
    });
    
    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Document généré par Aurore Finance - Assistant Fiscal Intelligent', 20, pageHeight - 10);
    
    return doc.output('blob');
  }
  
  /**
   * Méthodes utilitaires privées
   */
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  private static formatCivilStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'single': 'Célibataire',
      'married': 'Marié(e)',
      'divorced': 'Divorcé(e)',
      'widowed': 'Veuf/Veuve',
      'separated': 'Séparé(e)',
      'registered_partnership': 'Partenariat enregistré'
    };
    return statusMap[status] || status;
  }
  
  private static formatConfession(confession: string): string {
    const confessionMap: Record<string, string> = {
      'protestant': 'Protestant',
      'catholic': 'Catholique',
      'other': 'Autre',
      'none': 'Sans confession'
    };
    return confessionMap[confession] || confession;
  }
  
  private static formatAccountType(type: string): string {
    const typeMap: Record<string, string> = {
      'checking': 'Compte courant',
      'savings': 'Compte épargne',
      'deposit': 'Compte de dépôt',
      'other': 'Autre'
    };
    return typeMap[type] || type;
  }
  
  private static formatPropertyType(type: string): string {
    const typeMap: Record<string, string> = {
      'primary_residence': 'Résidence principale',
      'secondary_residence': 'Résidence secondaire',
      'rental_property': 'Bien locatif'
    };
    return typeMap[type] || type;
  }
  
  private static calculateTotalIncome(incomeData: any): number {
    if (!incomeData) return 0;
    
    let total = 0;
    total += incomeData.mainEmployment?.grossSalary || 0;
    total += incomeData.rentalIncome || 0;
    total += incomeData.pensionIncome?.avsRente || 0;
    total += incomeData.pensionIncome?.lppPension || 0;
    total += incomeData.unemploymentBenefits || 0;
    total += incomeData.militaryCompensation || 0;
    
    return total;
  }
  
  private static calculateTotalDeductions(deductions: any): number {
    if (!deductions) return 0;
    
    let total = 0;
    
    // Frais professionnels
    if (deductions.professionalExpenses) {
      total += deductions.professionalExpenses.transportCosts || 0;
      total += deductions.professionalExpenses.mealCosts || 0;
      total += deductions.professionalExpenses.otherProfessionalExpenses || 0;
      total += deductions.professionalExpenses.homeOfficeDeduction || 0;
    }
    
    // Prévoyance
    if (deductions.savingsContributions) {
      total += deductions.savingsContributions.pillar3a || 0;
      total += deductions.savingsContributions.pillar3b || 0;
      total += deductions.savingsContributions.lppVoluntary || 0;
    }
    
    // Assurances
    if (deductions.insurancePremiums) {
      total += deductions.insurancePremiums.healthInsurance || 0;
      total += deductions.insurancePremiums.lifeInsurance || 0;
      total += deductions.insurancePremiums.accidentInsurance || 0;
    }
    
    // Autres
    total += deductions.childcareExpenses || 0;
    total += deductions.donationsAmount || 0;
    total += deductions.alimonyPaid || 0;
    total += deductions.realEstateExpenses || 0;
    
    return total;
  }
  
  private static escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}