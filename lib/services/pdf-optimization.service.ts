import jsPDF from 'jspdf';

export interface OptimizationReport {
  userData: {
    nom: string;
    prenom: string;
    age: number;
    canton: string;
    situationFamiliale: string;
    scoring: string;
  };
  financialSituation: {
    revenus: {
      salaireBrut: number;
      autresRevenus: number;
      total: number;
    };
    charges: {
      loyer: number;
      assurances: number;
      autres: number;
      total: number;
    };
    capaciteEpargne: {
      mensuelle: number;
      annuelle: number;
      tauxEpargne: number;
    };
  };
  optimizations: Array<{
    titre: string;
    description: string;
    economieEstimee: number;
    priorite: 'haute' | 'moyenne' | 'basse';
    actionnable: boolean;
    delai: string;
  }>;
  recommendations: Array<{
    categorie: string;
    titre: string;
    detail: string;
  }>;
}

export class PDFOptimizationService {
  private doc: jsPDF;
  private pageWidth = 210;
  private pageHeight = 297;
  private margin = 20;
  private currentY = 20;
  private primaryColor = [59, 130, 246]; // Blue
  private secondaryColor = [139, 92, 246]; // Purple

  constructor() {
    this.doc = new jsPDF();
  }

  async generateOptimizationReport(report: OptimizationReport): Promise<Blob> {
    this.resetDocument();

    // Page 1: Couverture
    this.drawCoverPage(report);

    // Page 2: Situation actuelle
    this.doc.addPage();
    this.currentY = this.margin;
    this.drawFinancialSituation(report);

    // Page 3: Optimisations
    this.doc.addPage();
    this.currentY = this.margin;
    this.drawOptimizations(report);

    // Page 4: Recommandations
    this.doc.addPage();
    this.currentY = this.margin;
    this.drawRecommendations(report);

    return this.doc.output('blob');
  }

  private resetDocument() {
    this.doc = new jsPDF();
    this.currentY = 20;
  }

  private drawCoverPage(report: OptimizationReport) {
    // Gradient background effect (simulé avec rectangles)
    this.doc.setFillColor(240, 249, 255);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight / 2, 'F');

    // Logo/Title area
    this.doc.setFillColor(...this.primaryColor);
    this.doc.roundedRect(this.margin, 30, this.pageWidth - 2 * this.margin, 60, 5, 5, 'F');

    // Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(28);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Analyse Financière', this.pageWidth / 2, 50, { align: 'center' });

    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('& Plan d\'Optimisation Personnalisé', this.pageWidth / 2, 70, { align: 'center' });

    // User info card
    this.currentY = 110;
    this.doc.setFillColor(255, 255, 255);
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 70, 5, 5, 'FD');

    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${report.userData.prenom} ${report.userData.nom}`, this.pageWidth / 2, this.currentY + 15, { align: 'center' });

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`${report.userData.age} ans • ${report.userData.canton} • ${report.userData.situationFamiliale}`, this.pageWidth / 2, this.currentY + 30, { align: 'center' });

    // Scoring badge
    const scoringColor = report.userData.scoring === 'avance' ? [16, 185, 129] :
                         report.userData.scoring === 'intermediaire' ? [251, 191, 36] : [239, 68, 68];
    this.doc.setFillColor(...scoringColor);
    this.doc.roundedRect(this.pageWidth / 2 - 40, this.currentY + 40, 80, 20, 5, 5, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Niveau: ${report.userData.scoring.toUpperCase()}`, this.pageWidth / 2, this.currentY + 53, { align: 'center' });

    // Footer
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Aurore Finances - Votre compagnon financier IA', this.pageWidth / 2, this.pageHeight - 20, { align: 'center' });
    this.doc.text(new Date().toLocaleDateString('fr-CH'), this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
  }

  private drawFinancialSituation(report: OptimizationReport) {
    // Section header
    this.drawSectionHeader('📊 Votre Situation Financière Actuelle');

    // Revenus
    this.currentY += 15;
    this.doc.setFillColor(239, 246, 255);
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 50, 5, 5, 'F');

    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('💰 Revenus Annuels', this.margin + 5, this.currentY + 10);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Salaire brut: ${this.formatCurrency(report.financialSituation.revenus.salaireBrut)}`, this.margin + 5, this.currentY + 22);
    this.doc.text(`Autres revenus: ${this.formatCurrency(report.financialSituation.revenus.autresRevenus)}`, this.margin + 5, this.currentY + 32);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Total: ${this.formatCurrency(report.financialSituation.revenus.total)}`, this.margin + 5, this.currentY + 42);

    // Charges
    this.currentY += 60;
    this.doc.setFillColor(254, 242, 242);
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 60, 5, 5, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.text('💳 Charges Mensuelles', this.margin + 5, this.currentY + 10);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Loyer/Hypothèque: ${this.formatCurrency(report.financialSituation.charges.loyer)}`, this.margin + 5, this.currentY + 22);
    this.doc.text(`Assurances: ${this.formatCurrency(report.financialSituation.charges.assurances)}`, this.margin + 5, this.currentY + 32);
    this.doc.text(`Autres charges: ${this.formatCurrency(report.financialSituation.charges.autres)}`, this.margin + 5, this.currentY + 42);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Total: ${this.formatCurrency(report.financialSituation.charges.total)}`, this.margin + 5, this.currentY + 52);

    // Capacité d'épargne
    this.currentY += 70;
    const epargneColor = report.financialSituation.capaciteEpargne.tauxEpargne > 20 ? [16, 185, 129] :
                         report.financialSituation.capaciteEpargne.tauxEpargne > 10 ? [251, 191, 36] : [239, 68, 68];

    this.doc.setFillColor(...epargneColor);
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 50, 5, 5, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.text('💪 Capacité d\'Épargne', this.margin + 5, this.currentY + 10);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Mensuelle: ${this.formatCurrency(report.financialSituation.capaciteEpargne.mensuelle)}`, this.margin + 5, this.currentY + 22);
    this.doc.text(`Annuelle: ${this.formatCurrency(report.financialSituation.capaciteEpargne.annuelle)}`, this.margin + 5, this.currentY + 32);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Taux d'épargne: ${report.financialSituation.capaciteEpargne.tauxEpargne.toFixed(1)}%`, this.margin + 5, this.currentY + 42);
  }

  private drawOptimizations(report: OptimizationReport) {
    this.drawSectionHeader('🎯 Opportunités d\'Optimisation');

    let totalEconomies = 0;
    this.currentY += 15;

    report.optimizations.forEach((opt, index) => {
      if (this.currentY > this.pageHeight - 60) {
        this.doc.addPage();
        this.currentY = this.margin;
      }

      const priorityColor = opt.priorite === 'haute' ? [239, 68, 68] :
                           opt.priorite === 'moyenne' ? [251, 191, 36] : [156, 163, 175];

      // Optimization card
      this.doc.setFillColor(249, 250, 251);
      this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 45, 3, 3, 'F');

      // Priority indicator
      this.doc.setFillColor(...priorityColor);
      this.doc.circle(this.margin + 7, this.currentY + 7, 3, 'F');

      // Title
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(opt.titre, this.margin + 15, this.currentY + 10);

      // Description
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      const splitDescription = this.doc.splitTextToSize(opt.description, this.pageWidth - 2 * this.margin - 20);
      this.doc.text(splitDescription, this.margin + 15, this.currentY + 20);

      // Savings
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...this.primaryColor);
      this.doc.text(`💰 Économie estimée: ${this.formatCurrency(opt.economieEstimee)}`, this.margin + 15, this.currentY + 38);

      totalEconomies += opt.economieEstimee;
      this.currentY += 52;
    });

    // Total savings highlight
    if (this.currentY > this.pageHeight - 40) {
      this.doc.addPage();
      this.currentY = this.margin;
    }

    this.doc.setFillColor(...this.primaryColor);
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 30, 5, 5, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`💎 Économies totales potentielles: ${this.formatCurrency(totalEconomies)}/an`, this.pageWidth / 2, this.currentY + 20, { align: 'center' });
  }

  private drawRecommendations(report: OptimizationReport) {
    this.drawSectionHeader('💡 Recommandations Personnalisées');

    this.currentY += 15;

    report.recommendations.forEach((rec, index) => {
      if (this.currentY > this.pageHeight - 50) {
        this.doc.addPage();
        this.currentY = this.margin;
      }

      // Category badge
      const categoryColors: any = {
        '3e pilier': [99, 102, 241],
        'LPP': [16, 185, 129],
        'Investissement': [251, 191, 36],
        'Épargne': [59, 130, 246],
        'Immobilier': [139, 92, 246]
      };

      const color = categoryColors[rec.categorie] || [100, 100, 100];

      this.doc.setFillColor(...color);
      this.doc.roundedRect(this.margin, this.currentY, 40, 8, 2, 2, 'F');

      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(rec.categorie, this.margin + 20, this.currentY + 5, { align: 'center' });

      // Title
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(rec.titre, this.margin + 45, this.currentY + 6);

      // Detail
      this.currentY += 12;
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      const splitDetail = this.doc.splitTextToSize(rec.detail, this.pageWidth - 2 * this.margin - 5);
      this.doc.text(splitDetail, this.margin + 5, this.currentY);

      this.currentY += splitDetail.length * 5 + 10;
    });

    // Footer
    this.currentY = this.pageHeight - 40;
    this.doc.setFillColor(249, 250, 251);
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 30, 'F');

    this.doc.setTextColor(100, 100, 100);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('📞 Besoin d\'aide ? Contactez-nous à hello@aurorefinances.ch', this.pageWidth / 2, this.currentY + 10, { align: 'center' });
    this.doc.text('🌐 www.aurorefinances.ch', this.pageWidth / 2, this.currentY + 20, { align: 'center' });
  }

  private drawSectionHeader(title: string) {
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 12, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 5, this.currentY + 8);

    this.currentY += 12;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
