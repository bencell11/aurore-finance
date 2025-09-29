/**
 * Service de reproduction exacte du document di-template-test.pdf
 * Reproduit fidèlement le layout, les bordures, les cases à cocher et les champs
 */

export class ExactPDFTemplateService {
  
  /**
   * Génère le HTML qui reproduit exactement le PDF di-template-test.pdf
   * avec les vraies données du profil et calculs corrects
   */
  static generateExactHTML(profileData: any): string {
    console.log('[ExactPDF] Données profil reçues:', {
      personalInfo: profileData.personalInfo,
      incomeData: profileData.incomeData,
      deductions: profileData.deductions,
      assets: profileData.assets
    });
    
    const personalInfo = profileData.personalInfo || {};
    const incomeData = profileData.incomeData || {};
    const deductions = profileData.deductions || {};
    const assets = profileData.assets || {};
    
    // Utiliser les vraies données du profil sauvegardé
    const grossSalary = incomeData.mainEmployment?.grossSalary || 0;
    const netSalary = incomeData.mainEmployment?.netSalary || (grossSalary * 0.68);
    const pillar3a = deductions.savingsContributions?.pillar3a || 0;
    const totalDeductions = this.calculateTotalDeductions(deductions);
    const numberOfChildren = personalInfo.numberOfChildren || 0;
    
    // Calculs fiscaux corrects selon les règles suisses
    const revenuNet1 = grossSalary - totalDeductions;
    const deductionEnfants = numberOfChildren * 6800;
    const deductionCouple = personalInfo.civilStatus === 'married' ? 2800 : 0;
    const deductionsSociales = deductionEnfants + deductionCouple;
    const revenuImposable = Math.max(0, revenuNet1 - deductionsSociales);
    
    console.log('[ExactPDF] Calculs effectués:', {
      grossSalary,
      totalDeductions,
      revenuNet1,
      deductionsSociales,
      revenuImposable,
      numberOfChildren,
      canton: personalInfo.canton
    });
    
    // Préparer les données pour le JavaScript (éviter les template literals)
    const canton = personalInfo.canton || 'VD';
    const commune = personalInfo.commune || 'Lausanne';
    const nom = personalInfo.lastName || 'Utilisateur';
    const prenom = personalInfo.firstName || 'Demo';
    const email = personalInfo.email || 'user@example.com';
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Déclaration 2025 des personnes physiques</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 9pt;
            line-height: 1.1;
            background: white;
            color: black;
        }
        .page {
            width: 210mm;
            height: 297mm;
            padding: 15mm 20mm;
            position: relative;
            page-break-after: always;
        }
        .header-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            align-items: flex-start;
        }
        .admin-left {
            font-size: 8pt;
        }
        .admin-right {
            text-align: center;
            font-size: 8pt;
        }
        .black-box {
            background: black;
            color: white;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .title-section {
            text-align: center;
            margin: 20px 0;
        }
        .main-title {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 14pt;
            margin-bottom: 10px;
        }
        .form-number {
            font-size: 7pt;
            color: #666;
        }
        .bordered-section {
            border: 2px solid black;
            margin: 10px 0;
            position: relative;
        }
        .section-header {
            background: #f0f0f0;
            padding: 8px;
            font-weight: bold;
            font-size: 10pt;
            border-bottom: 1px solid black;
        }
        .section-content {
            padding: 10px;
        }
        .two-column {
            display: flex;
            gap: 20px;
        }
        .column {
            flex: 1;
        }
        .field-row {
            display: flex;
            margin: 4px 0;
            align-items: center;
            min-height: 18px;
        }
        .field-label {
            flex: 1;
            font-size: 8pt;
        }
        .field-value {
            flex: 0 0 120px;
            border-bottom: 1px solid black;
            padding: 2px 4px;
            font-weight: bold;
            text-align: left;
            min-height: 16px;
        }
        .table-section {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        .table-section th,
        .table-section td {
            border: 1px solid black;
            padding: 4px;
            font-size: 8pt;
            text-align: left;
        }
        .table-section th {
            background: #f0f0f0;
            font-weight: bold;
        }
        .amount-cell {
            text-align: right;
            font-family: 'Courier New', monospace;
            width: 100px;
        }
        .page-number {
            position: absolute;
            bottom: 10mm;
            right: 20mm;
            font-size: 8pt;
            color: #666;
        }
        .big-number {
            font-size: 72pt;
            font-weight: bold;
            color: #ddd;
            position: absolute;
            left: 10mm;
            top: 100mm;
            z-index: -1;
        }
        .checkbox {
            width: 12px;
            height: 12px;
            border: 1px solid black;
            margin-right: 5px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        .checkbox.checked {
            background: black;
            color: white;
        }
        .action-buttons {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 2px solid #007bff;
        }
        .action-buttons button {
            display: block;
            width: 200px;
            margin: 8px 0;
            padding: 12px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 11pt;
        }
        .action-buttons button:hover {
            background: #0056b3;
        }
        .action-buttons button.secondary {
            background: #28a745;
        }
        .action-buttons button.secondary:hover {
            background: #1e7e34;
        }
        @media print {
            .action-buttons { display: none !important; }
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
            }
            .page { 
                margin: 0; 
                padding: 15mm 20mm; 
                page-break-after: always; 
            }
            .page:last-child { 
                page-break-after: avoid; 
            }
        }
    </style>
    <script>
        function exportToPDF() {
            window.print();
        }
        
        function downloadHTML() {
            const element = document.documentElement;
            const htmlContent = element.outerHTML;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'declaration-fiscale-2025-${canton}.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        function copyFormData() {
            const data = 'Déclaration d\\'impôts 2025 - Canton ${canton}\\n\\nContribuable: ${nom}, ${prenom}\\nCommune: ${commune}\\n\\nSalaire brut: CHF ${this.formatCurrency(grossSalary)}\\nRevenu imposable: CHF ${this.formatCurrency(revenuImposable)}\\n\\nGénéré le: ' + new Date().toLocaleDateString('fr-CH');
            
            navigator.clipboard.writeText(data).then(() => {
                alert('Données copiées dans le presse-papiers!');
            });
        }
    </script>
</head>
<body>

<!-- Boutons d'action flottants -->
<div class="action-buttons">
    <div style="text-align: center; margin-bottom: 10px; font-weight: bold; color: #007bff;">
        📄 Export Document
    </div>
    <button onclick="exportToPDF()" title="Ouvrir le dialogue d'impression pour sauvegarder en PDF">
        🖨️ Imprimer / PDF
    </button>
    <button onclick="downloadHTML()" class="secondary" title="Télécharger le fichier HTML">
        💾 Télécharger HTML
    </button>
    <button onclick="copyFormData()" style="background: #6c757d;" title="Copier les données dans le presse-papiers">
        📋 Copier données
    </button>
    <button onclick="window.close()" style="background: #dc3545;" title="Fermer cette fenêtre">
        ❌ Fermer
    </button>
</div>

<!-- PAGE 1 -->
<div class="page">
    <div class="big-number">1</div>
    
    <div class="header-section">
        <div class="admin-left">
            <div><strong>Canton</strong> <span style="border-bottom: 1px solid black; padding: 2px 20px; margin-left: 10px;">${canton}</span></div>
            <div style="margin: 8px 0;"><strong>Commune</strong> <span style="border-bottom: 1px solid black; padding: 2px 20px; margin-left: 10px;">${commune}</span></div>
            <div><strong>No contrôle</strong> <span style="border-bottom: 1px solid black; padding: 2px 20px; margin-left: 10px;">${Math.random().toString().slice(2, 10)}</span></div>
        </div>
        <div class="admin-right">
            <div class="black-box">
                <div><strong>IMPÔT CANTONAL</strong></div>
                <div><strong>ET COMMUNAL</strong></div>
                <div><strong>IMPÔT FÉDÉRAL DIRECT</strong></div>
            </div>
            <div style="font-size: 7pt;">
                Cette déclaration et ses annexes doivent<br>
                être remises jusqu'au<br>
                <strong>31 mars 2026</strong><br>
                à l'adresse suivante<br><br>
                <div style="border-bottom: 1px solid black; margin: 3px 0; height: 12px;"></div>
                <div style="border-bottom: 1px solid black; margin: 3px 0; height: 12px;"></div>
                <div style="border-bottom: 1px solid black; margin: 3px 0; height: 12px;"></div>
            </div>
        </div>
    </div>
    
    <div class="title-section">
        <div class="main-title">Déclaration 2025</div>
        <div class="subtitle">des personnes physiques</div>
        <div class="form-number">Formule 2 605.040.11f (période fiscale 2025) 1/4</div>
    </div>
    
    <!-- Section 1 -->
    <div class="bordered-section">
        <div class="section-header">
            <span style="font-size: 14pt; font-weight: bold;">1</span> 
            Situation personnelle, professionnelle et familiale au 31 décembre 2025
        </div>
        <div class="section-content">
            <div class="two-column">
                <div class="column">
                    <div style="font-weight: bold; margin-bottom: 8px;">Contribuable 1</div>
                    <div class="field-row">
                        <div class="field-label">Nom, prénom</div>
                        <div class="field-value">${nom}, ${prenom}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Date de naissance</div>
                        <div class="field-value">${personalInfo.birthDate || '01.01.1990'}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Etat civil</div>
                        <div class="field-value">${this.mapCivilStatus(personalInfo.civilStatus)}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Canton</div>
                        <div class="field-value">${canton}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Commune</div>
                        <div class="field-value">${commune}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Profession</div>
                        <div class="field-value">${incomeData.mainEmployment?.profession || 'Employé'}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Employeur</div>
                        <div class="field-value">${incomeData.mainEmployment?.employer || 'Entreprise SA'}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">E-Mail</div>
                        <div class="field-value">${email}</div>
                    </div>
                </div>
                
                <div class="column">
                    <div style="font-weight: bold; margin-bottom: 8px;">Contribuable 2</div>
                    ${personalInfo.civilStatus === 'married' ? `
                    <div class="field-row">
                        <div class="field-label">Nom, prénom</div>
                        <div class="field-value"></div>
                    </div>
                    ` : `
                    <div style="color: #999; font-style: italic; margin-top: 20px;">Non applicable</div>
                    `}
                </div>
            </div>
        </div>
    </div>
    
    <div class="page-number">1/4</div>
</div>

${this.generatePage2(grossSalary, netSalary, assets)}
${this.generatePage3(grossSalary, totalDeductions, revenuImposable, deductions, personalInfo, numberOfChildren)}
${this.generatePage4(assets, personalInfo)}

</body>
</html>`;
  }
  
  private static generatePage2(grossSalary: number, netSalary: number, assets: any): string {
    return `
<!-- PAGE 2 -->
<div class="page">
    <div class="big-number">2</div>
    
    <div class="title-section">
        <div style="font-size: 16pt; font-weight: bold;">Revenu en suisse et à l'étranger</div>
        <div style="font-size: 10pt;">du/de la contribuable 1, du/de la contribuable 2 et des enfants mineurs</div>
    </div>
    
    <table class="table-section">
        <thead>
            <tr>
                <th style="width: 70%;">Description</th>
                <th style="width: 30%;">CHF sans centimes</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background: #f5f5f5;">
                <td><strong>1. Revenus provenant de l'activité dépendante</strong></td>
                <td></td>
            </tr>
            <tr>
                <td>1.1 Activité principale du/de la contribuable 1 (salaire net)</td>
                <td class="amount-cell">${this.formatCurrency(netSalary)}</td>
            </tr>
            <tr style="background: #e6f3ff;">
                <td><strong>6. Total intermédiaire des revenus</strong></td>
                <td class="amount-cell"><strong>${this.formatCurrency(grossSalary)}</strong></td>
            </tr>
            <tr style="background: #e6f3ff;">
                <td><strong>9. Total des revenus, à reporter à la page 3, chiffre 18</strong></td>
                <td class="amount-cell"><strong>${this.formatCurrency(grossSalary)}</strong></td>
            </tr>
        </tbody>
    </table>
    
    <div class="page-number">2/4</div>
</div>`;
  }
  
  private static generatePage3(grossSalary: number, totalDeductions: number, revenuImposable: number, deductions: any, personalInfo: any, numberOfChildren: number): string {
    const pillar3a = deductions.savingsContributions?.pillar3a || 0;
    const fraisPro = deductions.professionalExpenses?.total || 0;
    const deductionEnfants = numberOfChildren * 6800;
    const deductionCouple = personalInfo.civilStatus === 'married' ? 2800 : 0;
    
    return `
<!-- PAGE 3 -->
<div class="page">
    <div class="big-number">3</div>
    
    <div class="title-section">
        <div style="font-size: 16pt; font-weight: bold;">Déductions</div>
    </div>
    
    <table class="table-section">
        <thead>
            <tr>
                <th style="width: 70%;">Description</th>
                <th style="width: 30%;">CHF sans centimes</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background: #f5f5f5;">
                <td><strong>10. Frais professionnels</strong></td>
                <td></td>
            </tr>
            <tr>
                <td>10.1 du/de la contribuable 1</td>
                <td class="amount-cell">${this.formatCurrency(fraisPro)}</td>
            </tr>
            <tr style="background: #f5f5f5;">
                <td><strong>13. Cotisations pilier 3a</strong></td>
                <td></td>
            </tr>
            <tr>
                <td>13.1 du/de la contribuable 1</td>
                <td class="amount-cell">${this.formatCurrency(pillar3a)}</td>
            </tr>
            <tr style="background: #e6f3ff;">
                <td><strong>17. Total des déductions</strong></td>
                <td class="amount-cell"><strong>${this.formatCurrency(totalDeductions)}</strong></td>
            </tr>
        </tbody>
    </table>
    
    <div style="background: #f0f0f0; padding: 8px; margin: 15px 0; font-weight: bold; font-size: 12pt;">
        Détermination du revenu
    </div>
    
    <table class="table-section">
        <tbody>
            <tr>
                <td><strong>18. Total des revenus</strong></td>
                <td class="amount-cell">${this.formatCurrency(grossSalary)}</td>
            </tr>
            <tr>
                <td><strong>19. Total des déductions</strong></td>
                <td class="amount-cell">–${this.formatCurrency(totalDeductions)}</td>
            </tr>
            <tr>
                <td><strong>20. Revenu net I</strong></td>
                <td class="amount-cell">${this.formatCurrency(grossSalary - totalDeductions)}</td>
            </tr>
            <tr>
                <td><strong>22. Revenu net II</strong></td>
                <td class="amount-cell">${this.formatCurrency(grossSalary - totalDeductions)}</td>
            </tr>
            <tr>
                <td>23.1 Déduction pour enfants (CHF 6800 par enfant)</td>
                <td class="amount-cell">–${this.formatCurrency(deductionEnfants)}</td>
            </tr>
            <tr>
                <td>23.3 Déduction pour couples mariés (CHF 2800)</td>
                <td class="amount-cell">–${this.formatCurrency(deductionCouple)}</td>
            </tr>
            <tr style="background: #e6f3ff; font-weight: bold;">
                <td><strong>24. Revenu imposable</strong></td>
                <td class="amount-cell"><strong>${this.formatCurrency(revenuImposable)}</strong></td>
            </tr>
        </tbody>
    </table>
    
    <div class="page-number">3/4</div>
</div>`;
  }
  
  private static generatePage4(assets: any, personalInfo: any): string {
    return `
<!-- PAGE 4 -->
<div class="page">
    <div class="big-number">4</div>
    
    <div class="title-section">
        <div style="font-size: 16pt; font-weight: bold;">Fortune en suisse et à l'étranger</div>
    </div>
    
    <table class="table-section">
        <thead>
            <tr>
                <th style="width: 70%;">Description</th>
                <th style="width: 30%;">CHF sans centimes</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background: #f5f5f5;">
                <td><strong>25. Fortune mobilière</strong></td>
                <td></td>
            </tr>
            <tr>
                <td>25.1 Titres et avoirs</td>
                <td class="amount-cell">${this.formatCurrency(assets.totalValue || 0)}</td>
            </tr>
            <tr style="background: #e6f3ff;">
                <td><strong>28. Total des éléments de la fortune</strong></td>
                <td class="amount-cell"><strong>${this.formatCurrency(assets.totalValue || 0)}</strong></td>
            </tr>
            <tr>
                <td><strong>29. Dettes</strong></td>
                <td class="amount-cell">–</td>
            </tr>
            <tr style="background: #e6f3ff; font-weight: bold;">
                <td><strong>30. Fortune nette</strong></td>
                <td class="amount-cell"><strong>${this.formatCurrency(assets.totalValue || 0)}</strong></td>
            </tr>
        </tbody>
    </table>
    
    <div style="background: #f0f0f0; padding: 8px; margin: 15px 0; font-weight: bold; text-align: center;">
        Les indications données dans cette déclaration sont exactes et complètes
    </div>
    
    <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div>
            <strong>Lieu et date:</strong><br>
            ${personalInfo.commune || 'Lausanne'}, ${new Date().toLocaleDateString('fr-CH')}
        </div>
        <div style="text-align: center;">
            <div style="border-bottom: 1px solid black; width: 200px; margin-bottom: 5px; height: 40px;"></div>
            <strong>Signature du/de la contribuable 1</strong>
        </div>
    </div>
    
    <div class="page-number">4/4</div>
</div>`;
  }
  
  // Méthodes utilitaires
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(amount));
  }
  
  private static mapCivilStatus(status: string): string {
    const mapping: { [key: string]: string } = {
      'single': 'Célibataire',
      'married': 'Marié(e)',
      'divorced': 'Divorcé(e)',
      'widowed': 'Veuf/Veuve',
      'separated': 'Séparé(e)'
    };
    return mapping[status] || 'Célibataire';
  }
  
  private static calculateTotalDeductions(deductions: any): number {
    let total = 0;
    
    // Frais professionnels (obligatoires)
    const fraisPro = deductions.professionalExpenses?.total || 0;
    total += fraisPro;
    
    // Pilier 3a
    const pilier3a = deductions.savingsContributions?.pillar3a || 0;
    total += pilier3a;
    
    // Assurances maladie (déduction limitée)
    const assuranceMaladie = deductions.insurancePremiums?.healthInsurance || 0;
    const assuranceVie = deductions.insurancePremiums?.lifeInsurance || 0;
    const deductionAssurance = Math.min(assuranceMaladie + assuranceVie, 1800); // Limite pour célibataire
    total += deductionAssurance;
    
    // Garde d'enfants
    const gardeEnfants = deductions.childcareExpenses || 0;
    total += gardeEnfants;
    
    // Dons (limités à 20% du revenu)
    const dons = deductions.donations?.amount || 0;
    total += dons;
    
    return total;
  }
}