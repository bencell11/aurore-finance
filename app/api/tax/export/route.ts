import { NextRequest, NextResponse } from 'next/server';
import { SwissTaxFormulasService } from '@/lib/services/tax/swiss-tax-formulas.service';
import ProfileStorageService from '@/lib/services/storage/profile-storage.service';

/**
 * Version mock pour l'export de documents
 */

// Fonctions helper pour les données par défaut
function getDefaultProfileData() {
  return {
    personalInfo: {
      canton: 'GE',
      civilStatus: 'single',
      numberOfChildren: 0
    },
    incomeData: {
      mainEmployment: {
        employer: 'Tech Corp SA',
        grossSalary: 85000
      }
    },
    deductions: {
      savingsContributions: { pillar3a: 7056 },
      professionalExpenses: { total: 2500 },
      insurancePremiums: { healthInsurance: 4800 }
    }
  };
}

function getDefaultCalculationData(profile: any) {
  // Calculer avec les vraies formules si possible
  try {
    const grossSalary = profile?.incomeData?.mainEmployment?.grossSalary || 85000;
    const deductions = SwissTaxFormulasService.calculateDeductions(profile, profile?.personalInfo?.canton || 'GE');
    const taxableIncome = Math.max(0, grossSalary - deductions.total.totalDeductions);
    
    const federalTax = SwissTaxFormulasService.calculateFederalTax(taxableIncome, profile?.personalInfo?.civilStatus || 'single');
    const cantonalTax = SwissTaxFormulasService.calculateCantonalTax(taxableIncome, profile?.personalInfo?.canton || 'GE');
    
    return {
      taxableIncome,
      federalTax: federalTax.tax,
      cantonalTax: cantonalTax.cantonalTax,
      communalTax: cantonalTax.communalTax,
      totalTax: federalTax.tax + cantonalTax.totalTax,
      effectiveRate: ((federalTax.tax + cantonalTax.totalTax) / grossSalary * 100).toFixed(1),
      deductions: deductions.total
    };
  } catch (error) {
    // Fallback vers données par défaut
    return {
      taxableIncome: 70644,
      federalTax: 2850,
      cantonalTax: 8250,
      communalTax: 4125,
      totalTax: 15225,
      effectiveRate: '17.8',
      deductions: { totalDeductions: 14356 }
    };
  }
}

function generateTaxDeclarationHTML(profile: any, calculation: any) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Déclaration fiscale 2024 - MODE DEMO</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            line-height: 1.4;
            max-width: 800px;
            margin: 0 auto;
        }
        .header { 
            background: #f8f9fa; 
            padding: 20px; 
            margin-bottom: 30px; 
            border-left: 4px solid #007bff;
            border-radius: 4px;
        }
        .section { 
            margin: 25px 0; 
            padding: 20px; 
            border: 1px solid #dee2e6;
            border-radius: 8px;
            background: #fff;
        }
        .section h2 {
            margin-top: 0;
            color: #495057;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 10px;
        }
        .row { 
            display: flex; 
            justify-content: space-between; 
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #f8f9fa;
        }
        .row:last-child {
            border-bottom: none;
        }
        .total { 
            font-weight: bold; 
            border-top: 2px solid #333; 
            padding-top: 15px;
            margin-top: 15px;
            background: #f8f9fa;
            margin-left: -20px;
            margin-right: -20px;
            padding-left: 20px;
            padding-right: 20px;
        }
        .demo-banner { 
            background: #dc3545; 
            color: white; 
            padding: 15px; 
            text-align: center; 
            font-weight: bold;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .signature-section {
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        @media print {
            .demo-banner { 
                background: #000 !important; 
                -webkit-print-color-adjust: exact;
            }
            .section {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="demo-banner">MODE DÉMONSTRATION - DOCUMENT NON OFFICIEL</div>
    
    <div class="header">
        <h1>Déclaration d'impôt 2024</h1>
        <p><strong>Canton:</strong> ${profile?.personalInfo?.canton || 'Genève'}</p>
        <p><strong>Situation:</strong> ${profile?.personalInfo?.civilStatus === 'single' ? 'Célibataire' : 'Marié(e)'}</p>
        <p><strong>Enfants à charge:</strong> ${profile?.personalInfo?.numberOfChildren || 0}</p>
        <p><strong>Généré le:</strong> ${new Date().toLocaleDateString('fr-CH')}</p>
    </div>

    <div class="section">
        <h2>A. Revenus</h2>
        <div class="row">
            <span>Salaire brut annuel:</span>
            <span>${(profile?.incomeData?.mainEmployment?.grossSalary || 85000).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span>Autres revenus:</span>
            <span>${(profile?.incomeData?.otherIncome?.amount || 0).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row total">
            <span>Total des revenus:</span>
            <span>${((profile?.incomeData?.mainEmployment?.grossSalary || 85000) + (profile?.incomeData?.otherIncome?.amount || 0)).toLocaleString('fr-CH')} CHF</span>
        </div>
    </div>

    <div class="section">
        <h2>B. Déductions</h2>
        <div class="row">
            <span>3e pilier A:</span>
            <span>${(profile?.deductions?.savingsContributions?.pillar3a || 7056).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span>Frais professionnels:</span>
            <span>${(profile?.deductions?.professionalExpenses?.total || 2500).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span>Assurance maladie:</span>
            <span>${(profile?.deductions?.insurancePremiums?.healthInsurance || 4800).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span>Autres déductions:</span>
            <span>${(profile?.deductions?.donationsAmount || 0).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row total">
            <span>Total des déductions:</span>
            <span>${(calculation?.deductions?.totalDeductions || 14356).toLocaleString('fr-CH')} CHF</span>
        </div>
    </div>

    <div class="section">
        <h2>C. Calcul de l'impôt</h2>
        <div class="row">
            <span>Revenu imposable:</span>
            <span>${(calculation?.taxableIncome || 70644).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span>Impôt fédéral:</span>
            <span>${(calculation?.federalTax || 2850).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span>Impôt cantonal:</span>
            <span>${(calculation?.cantonalTax || 8250).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span>Impôt communal:</span>
            <span>${(calculation?.communalTax || 4125).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row total">
            <span>Total de l'impôt:</span>
            <span>${(calculation?.totalTax || 15225).toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span>Taux effectif:</span>
            <span>${calculation?.effectiveRate || '17.8'}%</span>
        </div>
    </div>

    <div class="signature-section">
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-CH')}</p>
        <p><strong>Signature:</strong> _______________________</p>
    </div>
    
    <div class="demo-banner">
        Document généré par Aurore Finance Assistant Fiscal (Mode Démonstration)
    </div>
</body>
</html>
`;
}

function generateTaxFormat(profile: any, calculation: any) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eCH-0196:delivery xmlns:eCH-0196="http://www.ech.ch/xmlns/eCH-0196/2">
  <eCH-0196:deliveryHeader>
    <eCH-0196:senderId>AURORE-FINANCE-DEMO</eCH-0196:senderId>
    <eCH-0196:messageDate>${new Date().toISOString()}</eCH-0196:messageDate>
    <eCH-0196:messageType>TAX_DECLARATION_DEMO</eCH-0196:messageType>
    <eCH-0196:taxYear>2024</eCH-0196:taxYear>
    <eCH-0196:canton>${profile?.personalInfo?.canton || 'GE'}</eCH-0196:canton>
  </eCH-0196:deliveryHeader>
  
  <eCH-0196:taxDeclaration>
    <eCH-0196:personalData>
      <eCH-0196:civilStatus>${profile?.personalInfo?.civilStatus || 'single'}</eCH-0196:civilStatus>
      <eCH-0196:canton>${profile?.personalInfo?.canton || 'GE'}</eCH-0196:canton>
      <eCH-0196:municipality>${profile?.personalInfo?.municipality || 'Genève'}</eCH-0196:municipality>
      <eCH-0196:numberOfChildren>${profile?.personalInfo?.numberOfChildren || 0}</eCH-0196:numberOfChildren>
    </eCH-0196:personalData>
    
    <eCH-0196:income>
      <eCH-0196:employment>
        <eCH-0196:employer>${profile?.incomeData?.mainEmployment?.employer || 'Tech Corp SA'} (DEMO)</eCH-0196:employer>
        <eCH-0196:grossSalary>${profile?.incomeData?.mainEmployment?.grossSalary || 85000}</eCH-0196:grossSalary>
        <eCH-0196:socialDeductions>${Math.round((profile?.incomeData?.mainEmployment?.grossSalary || 85000) * 0.107)}</eCH-0196:socialDeductions>
      </eCH-0196:employment>
      <eCH-0196:otherIncome>${profile?.incomeData?.otherIncome?.amount || 0}</eCH-0196:otherIncome>
    </eCH-0196:income>
    
    <eCH-0196:deductions>
      <eCH-0196:pillar3a>${profile?.deductions?.savingsContributions?.pillar3a || 0}</eCH-0196:pillar3a>
      <eCH-0196:professionalExpenses>
        <eCH-0196:transport>${profile?.deductions?.professionalExpenses?.transportCosts || 0}</eCH-0196:transport>
        <eCH-0196:meals>${profile?.deductions?.professionalExpenses?.mealCosts || 0}</eCH-0196:meals>
        <eCH-0196:other>${profile?.deductions?.professionalExpenses?.otherProfessionalExpenses || 0}</eCH-0196:other>
      </eCH-0196:professionalExpenses>
      <eCH-0196:healthInsurance>${profile?.deductions?.insurancePremiums?.healthInsurance || 0}</eCH-0196:healthInsurance>
      <eCH-0196:donations>${profile?.deductions?.donationsAmount || 0}</eCH-0196:donations>
    </eCH-0196:deductions>
    
    <eCH-0196:taxCalculation>
      <eCH-0196:taxableIncome>${calculation?.taxableIncome || 70644}</eCH-0196:taxableIncome>
      <eCH-0196:federalTax>${calculation?.federalTax || 2850}</eCH-0196:federalTax>
      <eCH-0196:cantonalTax>${calculation?.cantonalTax || 8250}</eCH-0196:cantonalTax>
      <eCH-0196:communalTax>${calculation?.communalTax || 4125}</eCH-0196:communalTax>
      <eCH-0196:totalTax>${calculation?.totalTax || 15225}</eCH-0196:totalTax>
      <eCH-0196:effectiveRate>${calculation?.effectiveRate || '17.8'}</eCH-0196:effectiveRate>
    </eCH-0196:taxCalculation>
    
    <eCH-0196:metadata>
      <eCH-0196:generatedBy>Aurore Finance Assistant Fiscal</eCH-0196:generatedBy>
      <eCH-0196:generatedAt>${new Date().toISOString()}</eCH-0196:generatedAt>
      <eCH-0196:demoMode>true</eCH-0196:demoMode>
    </eCH-0196:metadata>
  </eCH-0196:taxDeclaration>
</eCH-0196:delivery>`;
}

function generateDocxContent(profile: any, calculation: any) {
  return `DÉCLARATION D'IMPÔT 2024 - MODE DÉMONSTRATION

═══════════════════════════════════════════════════════════════════════════════
DONNÉES PERSONNELLES
═══════════════════════════════════════════════════════════════════════════════
Canton: ${profile?.personalInfo?.canton || 'Genève'}
Situation: ${profile?.personalInfo?.civilStatus === 'single' ? 'Célibataire' : 'Marié(e)'}
Enfants à charge: ${profile?.personalInfo?.numberOfChildren || 0}
Employeur: ${profile?.incomeData?.mainEmployment?.employer || 'Tech Corp SA'}

═══════════════════════════════════════════════════════════════════════════════
REVENUS (en CHF)
═══════════════════════════════════════════════════════════════════════════════
Salaire brut annuel                                 ${(profile?.incomeData?.mainEmployment?.grossSalary || 85000).toLocaleString('fr-CH')}
Autres revenus                                      ${(profile?.incomeData?.otherIncome?.amount || 0).toLocaleString('fr-CH')}
                                                   ─────────────
TOTAL REVENUS                                       ${((profile?.incomeData?.mainEmployment?.grossSalary || 85000) + (profile?.incomeData?.otherIncome?.amount || 0)).toLocaleString('fr-CH')}

═══════════════════════════════════════════════════════════════════════════════
DÉDUCTIONS (en CHF)
═══════════════════════════════════════════════════════════════════════════════
3e pilier A                                         ${(profile?.deductions?.savingsContributions?.pillar3a || 0).toLocaleString('fr-CH')}
Frais professionnels                                ${(profile?.deductions?.professionalExpenses?.total || 0).toLocaleString('fr-CH')}
  - Transport                                       ${(profile?.deductions?.professionalExpenses?.transportCosts || 0).toLocaleString('fr-CH')}
  - Repas                                           ${(profile?.deductions?.professionalExpenses?.mealCosts || 0).toLocaleString('fr-CH')}
  - Autres frais                                    ${(profile?.deductions?.professionalExpenses?.otherProfessionalExpenses || 0).toLocaleString('fr-CH')}
Assurance maladie                                   ${(profile?.deductions?.insurancePremiums?.healthInsurance || 0).toLocaleString('fr-CH')}
Dons déductibles                                    ${(profile?.deductions?.donationsAmount || 0).toLocaleString('fr-CH')}
                                                   ─────────────
TOTAL DÉDUCTIONS                                    ${(calculation?.deductions?.totalDeductions || 14356).toLocaleString('fr-CH')}

═══════════════════════════════════════════════════════════════════════════════
CALCUL DE L'IMPÔT (en CHF)
═══════════════════════════════════════════════════════════════════════════════
Revenu imposable                                    ${(calculation?.taxableIncome || 70644).toLocaleString('fr-CH')}

Impôt fédéral direct                                ${(calculation?.federalTax || 2850).toLocaleString('fr-CH')}
Impôt cantonal                                      ${(calculation?.cantonalTax || 8250).toLocaleString('fr-CH')}
Impôt communal                                      ${(calculation?.communalTax || 4125).toLocaleString('fr-CH')}
                                                   ─────────────
TOTAL IMPÔT DÛ                                      ${(calculation?.totalTax || 15225).toLocaleString('fr-CH')}

Taux effectif d'imposition                          ${calculation?.effectiveRate || '17.8'}%

═══════════════════════════════════════════════════════════════════════════════
INFORMATIONS
═══════════════════════════════════════════════════════════════════════════════
Date de génération: ${new Date().toLocaleDateString('fr-CH')} ${new Date().toLocaleTimeString('fr-CH')}
Signature: _______________________

───────────────────────────────────────────────────────────────────────────────
Document généré par Aurore Finance Assistant Fiscal (Mode Démonstration)
Les montants et calculs présentés sont des simulations à des fins de démonstration uniquement.
───────────────────────────────────────────────────────────────────────────────`;
}

const mockTaxDeclarationHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Déclaration fiscale 2024 - MODE DEMO</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .row { display: flex; justify-content: space-between; margin: 10px 0; }
        .total { font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
        .demo-banner { background: #ff6b6b; color: white; padding: 10px; text-align: center; font-weight: bold; }
    </style>
</head>
<body>
    <div class="demo-banner">MODE DÉMONSTRATION - DOCUMENT NON OFFICIEL</div>
    
    <div class="header">
        <h1>Déclaration d'impôt 2024</h1>
        <p>Canton: Genève</p>
        <p>Contribuable: [Données anonymisées en mode démo]</p>
    </div>

    <div class="section">
        <h2>A. Revenus</h2>
        <div class="row">
            <span>Salaire brut annuel:</span>
            <span>85'000 CHF</span>
        </div>
        <div class="row">
            <span>Autres revenus:</span>
            <span>0 CHF</span>
        </div>
        <div class="row total">
            <span>Total des revenus:</span>
            <span>85'000 CHF</span>
        </div>
    </div>

    <div class="section">
        <h2>B. Déductions</h2>
        <div class="row">
            <span>3e pilier A:</span>
            <span>7'056 CHF</span>
        </div>
        <div class="row">
            <span>Frais professionnels:</span>
            <span>2'500 CHF</span>
        </div>
        <div class="row">
            <span>Assurance maladie:</span>
            <span>4'800 CHF</span>
        </div>
        <div class="row total">
            <span>Total des déductions:</span>
            <span>14'356 CHF</span>
        </div>
    </div>

    <div class="section">
        <h2>C. Calcul de l'impôt</h2>
        <div class="row">
            <span>Revenu imposable:</span>
            <span>70'644 CHF</span>
        </div>
        <div class="row">
            <span>Impôt fédéral:</span>
            <span>2'850 CHF</span>
        </div>
        <div class="row">
            <span>Impôt cantonal/communal:</span>
            <span>12'375 CHF</span>
        </div>
        <div class="row total">
            <span>Total de l'impôt:</span>
            <span>15'225 CHF</span>
        </div>
    </div>

    <div class="section">
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-CH')}</p>
        <p><strong>Signature:</strong> _______________________</p>
    </div>
    
    <div class="demo-banner">
        Document généré par Aurore Finance Assistant Fiscal (Mode Démonstration)
    </div>
</body>
</html>
`;

const mockTaxFormat = `<?xml version="1.0" encoding="UTF-8"?>
<eCH-0196:delivery xmlns:eCH-0196="http://www.ech.ch/xmlns/eCH-0196/2">
  <eCH-0196:deliveryHeader>
    <eCH-0196:senderId>AURORE-FINANCE-DEMO</eCH-0196:senderId>
    <eCH-0196:messageDate>${new Date().toISOString()}</eCH-0196:messageDate>
    <eCH-0196:messageType>TAX_DECLARATION_DEMO</eCH-0196:messageType>
    <eCH-0196:taxYear>2024</eCH-0196:taxYear>
    <eCH-0196:canton>GE</eCH-0196:canton>
  </eCH-0196:deliveryHeader>
  
  <eCH-0196:taxDeclaration>
    <eCH-0196:personalData>
      <eCH-0196:civilStatus>single</eCH-0196:civilStatus>
      <eCH-0196:canton>GE</eCH-0196:canton>
      <eCH-0196:municipality>Genève</eCH-0196:municipality>
      <eCH-0196:numberOfChildren>0</eCH-0196:numberOfChildren>
    </eCH-0196:personalData>
    
    <eCH-0196:income>
      <eCH-0196:employment>
        <eCH-0196:employer>Tech Corp SA (DEMO)</eCH-0196:employer>
        <eCH-0196:grossSalary>85000</eCH-0196:grossSalary>
        <eCH-0196:socialDeductions>9100</eCH-0196:socialDeductions>
      </eCH-0196:employment>
    </eCH-0196:income>
    
    <eCH-0196:deductions>
      <eCH-0196:pillar3a>7056</eCH-0196:pillar3a>
      <eCH-0196:professionalExpenses>
        <eCH-0196:transport>1200</eCH-0196:transport>
        <eCH-0196:meals>800</eCH-0196:meals>
        <eCH-0196:other>500</eCH-0196:other>
      </eCH-0196:professionalExpenses>
      <eCH-0196:healthInsurance>4800</eCH-0196:healthInsurance>
    </eCH-0196:deductions>
    
    <eCH-0196:taxCalculation>
      <eCH-0196:taxableIncome>70644</eCH-0196:taxableIncome>
      <eCH-0196:federalTax>2850</eCH-0196:federalTax>
      <eCH-0196:cantonalTax>8250</eCH-0196:cantonalTax>
      <eCH-0196:communalTax>4125</eCH-0196:communalTax>
      <eCH-0196:totalTax>15225</eCH-0196:totalTax>
    </eCH-0196:taxCalculation>
  </eCH-0196:taxDeclaration>
</eCH-0196:delivery>`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, profile, calculation } = body;

    // Validation du format
    const validFormats = ['PDF', 'HTML', 'TAX', 'DOCX'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Format non supporté' },
        { status: 400 }
      );
    }

    // Simulation d'un délai de génération
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Récupérer les données depuis le storage si non fournies
    const storage = ProfileStorageService.getInstance();
    const storedProfile = storage.getProfile();
    const storedCalculation = storage.getCalculation();
    
    // Utiliser les données fournies ou celles du storage
    const profileData = profile || storedProfile || getDefaultProfileData();
    const calculationData = calculation || storedCalculation || getDefaultCalculationData(profileData);
    
    console.log('[Export] Données utilisées:', {
      canton: profileData?.personalInfo?.canton,
      grossSalary: profileData?.incomeData?.mainEmployment?.grossSalary,
      pillar3a: profileData?.deductions?.savingsContributions?.pillar3a,
      calculation: calculationData
    });

    let fileContent: string;
    let fileName: string;
    let contentType: string;

    switch (format) {
      case 'HTML':
        fileContent = generateTaxDeclarationHTML(profileData, calculationData);
        fileName = `declaration-fiscale-demo-${new Date().getFullYear()}.html`;
        contentType = 'text/html';
        break;

      case 'TAX':
        fileContent = generateTaxFormat(profileData, calculationData);
        fileName = `declaration-fiscale-demo-${new Date().getFullYear()}.tax`;
        contentType = 'application/xml';
        break;

      case 'PDF':
        // Pour la démo, on génère un HTML formaté pour impression PDF
        // L'utilisateur peut faire Ctrl+P -> Sauvegarder en PDF
        const baseHTML = generateTaxDeclarationHTML(profileData, calculationData);
        fileContent = baseHTML.replace(
          '<body>',
          `<body>
           <div style="text-align: center; margin: 20px; padding: 15px; border: 2px solid #007bff; background: #e3f2fd; border-radius: 8px;">
             <h3>💡 Pour obtenir un PDF</h3>
             <p>Utilisez <strong>Ctrl+P</strong> (Windows) ou <strong>Cmd+P</strong> (Mac)<br>
             puis sélectionnez <strong>"Enregistrer au format PDF"</strong></p>
             <p><small>Cette fenêtre va automatiquement ouvrir le dialogue d'impression dans 1 seconde</small></p>
           </div>`
        );
        fileName = `declaration-fiscale-demo-${new Date().getFullYear()}.html`;
        contentType = 'text/html';
        break;

      case 'DOCX':
        fileContent = generateDocxContent(profileData, calculationData);
        fileName = `declaration-fiscale-demo-${new Date().getFullYear()}.txt`;
        contentType = 'text/plain; charset=utf-8';
        break;

      default:
        return NextResponse.json(
          { error: 'Format non implémenté' },
          { status: 400 }
        );
    }

    // Création de la réponse avec le fichier
    const responseData = fileContent;
    
    const response = new NextResponse(responseData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    return response;

  } catch (error) {
    console.error('Erreur export mock:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du document' },
      { status: 500 }
    );
  }
}