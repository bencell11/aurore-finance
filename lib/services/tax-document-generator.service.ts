interface TaxFormData {
  personalInfo: {
    nom: string;
    prenom: string;
    dateNaissance: Date;
    numeroAVS: string;
    adresse: string;
    canton: string;
    commune: string;
  };
  revenus: {
    salaireBrut: number;
    autresRevenus: number;
    revenuConjoint?: number;
    rentesAVS?: number;
  };
  deductions: {
    troisiemePilier: number;
    fraisProfessionnels: number;
    fraisTransport: number;
    fraisRepas: number;
    formationContinue: number;
    interetsHypothecaires?: number;
    fraisGarde?: number;
  };
  fortune: {
    compteBancaire: number;
    compteEpargne: number;
    titres: number;
    immobilier?: number;
    dettes?: number;
  };
}

export class TaxDocumentGenerator {
  
  static generateTaxDeclaration(formData: TaxFormData): string {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Déclaration fiscale ${new Date().getFullYear()}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .row { display: flex; justify-content: space-between; margin: 10px 0; }
        .label { font-weight: bold; }
        .value { text-align: right; }
        .total { font-size: 1.2em; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Déclaration d'impôt ${new Date().getFullYear()}</h1>
        <p>Canton: ${formData.personalInfo.canton}</p>
        <p>Contribuable: ${formData.personalInfo.prenom} ${formData.personalInfo.nom}</p>
        <p>N° AVS: ${formData.personalInfo.numeroAVS || 'À compléter'}</p>
    </div>

    <div class="section">
        <h2>A. Revenus</h2>
        <div class="row">
            <span class="label">Salaire brut annuel:</span>
            <span class="value">${formData.revenus.salaireBrut.toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span class="label">Autres revenus:</span>
            <span class="value">${formData.revenus.autresRevenus.toLocaleString('fr-CH')} CHF</span>
        </div>
        ${formData.revenus.revenuConjoint ? `
        <div class="row">
            <span class="label">Revenu du conjoint:</span>
            <span class="value">${formData.revenus.revenuConjoint.toLocaleString('fr-CH')} CHF</span>
        </div>` : ''}
        <div class="row total">
            <span class="label">Total des revenus:</span>
            <span class="value">${Object.values(formData.revenus).reduce((sum, val) => sum + (val || 0), 0).toLocaleString('fr-CH')} CHF</span>
        </div>
    </div>

    <div class="section">
        <h2>B. Déductions</h2>
        <div class="row">
            <span class="label">3e pilier A:</span>
            <span class="value">${formData.deductions.troisiemePilier.toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span class="label">Frais professionnels:</span>
            <span class="value">${formData.deductions.fraisProfessionnels.toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span class="label">Frais de transport:</span>
            <span class="value">${formData.deductions.fraisTransport.toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span class="label">Frais de repas:</span>
            <span class="value">${formData.deductions.fraisRepas.toLocaleString('fr-CH')} CHF</span>
        </div>
        ${formData.deductions.interetsHypothecaires ? `
        <div class="row">
            <span class="label">Intérêts hypothécaires:</span>
            <span class="value">${formData.deductions.interetsHypothecaires.toLocaleString('fr-CH')} CHF</span>
        </div>` : ''}
        <div class="row total">
            <span class="label">Total des déductions:</span>
            <span class="value">${Object.values(formData.deductions).reduce((sum, val) => sum + (val || 0), 0).toLocaleString('fr-CH')} CHF</span>
        </div>
    </div>

    <div class="section">
        <h2>C. Fortune</h2>
        <div class="row">
            <span class="label">Comptes bancaires:</span>
            <span class="value">${formData.fortune.compteBancaire.toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span class="label">Épargne:</span>
            <span class="value">${formData.fortune.compteEpargne.toLocaleString('fr-CH')} CHF</span>
        </div>
        <div class="row">
            <span class="label">Titres:</span>
            <span class="value">${formData.fortune.titres.toLocaleString('fr-CH')} CHF</span>
        </div>
        ${formData.fortune.dettes ? `
        <div class="row">
            <span class="label">Dettes:</span>
            <span class="value">-${formData.fortune.dettes.toLocaleString('fr-CH')} CHF</span>
        </div>` : ''}
        <div class="row total">
            <span class="label">Fortune nette:</span>
            <span class="value">${(Object.values(formData.fortune).reduce((sum, val, key) => {
              if (key === 'dettes') return sum - (val || 0);
              return sum + (val || 0);
            }, 0)).toLocaleString('fr-CH')} CHF</span>
        </div>
    </div>

    <div class="section">
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-CH')}</p>
        <p><strong>Signature:</strong> _______________________</p>
    </div>
</body>
</html>`;
    
    return html;
  }

  static generateProfessionalExpensesTable(expenses: Array<{date: Date; description: string; amount: number}>): string {
    const csv = ['Date,Description,Montant CHF'];
    
    expenses.forEach(expense => {
      csv.push(`${expense.date.toLocaleDateString('fr-CH')},${expense.description},${expense.amount}`);
    });
    
    csv.push(`,,Total: ${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('fr-CH')}`);
    
    return csv.join('\n');
  }

  static generateTaxOptimizationReport(userProfile: any, optimizations: any[]): string {
    const markdown = `
# Rapport d'Optimisation Fiscale ${new Date().getFullYear()}

## Résumé Exécutif
- **Économie potentielle totale:** ${optimizations.reduce((sum, opt) => sum + opt.economieAnnuelle, 0).toLocaleString('fr-CH')} CHF
- **Nombre d'optimisations identifiées:** ${optimizations.length}
- **ROI estimé:** ${((optimizations.reduce((sum, opt) => sum + opt.economieAnnuelle, 0) / userProfile.revenu) * 100).toFixed(1)}%

## Optimisations Recommandées

${optimizations.map((opt, index) => `
### ${index + 1}. ${opt.title}
- **Description:** ${opt.description}
- **Économie annuelle:** ${opt.economieAnnuelle.toLocaleString('fr-CH')} CHF
- **Action requise:** ${opt.actionRequise}
- **Délai:** ${opt.delai || 'Aucun'}
- **Priorité:** ${opt.urgence}
`).join('\n')}

## Plan d'Action

### Actions Immédiates (< 1 mois)
${optimizations.filter(o => o.urgence === 'haute').map(o => `- ${o.actionRequise}`).join('\n')}

### Actions Court Terme (1-3 mois)
${optimizations.filter(o => o.urgence === 'moyenne').map(o => `- ${o.actionRequise}`).join('\n')}

### Actions Long Terme (> 3 mois)
${optimizations.filter(o => o.urgence === 'basse').map(o => `- ${o.actionRequise}`).join('\n')}

## Projection sur 5 ans
Économie cumulée estimée: **${(optimizations.reduce((sum, opt) => sum + opt.economieAnnuelle, 0) * 5).toLocaleString('fr-CH')} CHF**

---
*Généré le ${new Date().toLocaleDateString('fr-CH')} par Aurore Finance Assistant*
`;

    return markdown;
  }

  static async exportToPDF(htmlContent: string): Promise<Blob> {
    // Dans une vraie implémentation, utiliser une lib comme jsPDF ou puppeteer
    // Pour l'instant, on retourne un Blob HTML
    return new Blob([htmlContent], { type: 'text/html' });
  }

  static generateICSReminder(title: string, description: string, date: Date): string {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aurore Finance//Tax Assistant//FR
BEGIN:VEVENT
UID:${Date.now()}@aurore-finance.ch
DTSTAMP:${this.formatICSDate(new Date())}
DTSTART:${this.formatICSDate(date)}
DTEND:${this.formatICSDate(new Date(date.getTime() + 3600000))}
SUMMARY:${title}
DESCRIPTION:${description}
BEGIN:VALARM
TRIGGER:-P1W
ACTION:DISPLAY
DESCRIPTION:Rappel: ${title}
END:VALARM
END:VEVENT
END:VCALENDAR`;

    return icsContent;
  }

  private static formatICSDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }
}