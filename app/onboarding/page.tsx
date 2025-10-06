'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OnboardingChatbot from '@/components/onboarding/OnboardingChatbot';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Mail, MessageCircle, Sparkles, ArrowRight, FileText, CheckCircle } from 'lucide-react';
import { PDFOptimizationService, OptimizationReport } from '@/lib/services/pdf-optimization.service';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [isComplete, setIsComplete] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [report, setReport] = useState<OptimizationReport | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleOnboardingComplete = async (data: any, scoring: string) => {
    setIsGeneratingPDF(true);

    // Calculer les données financières
    const revenus = {
      salaireBrut: data.revenus?.salaireBrut || 0,
      autresRevenus: data.revenus?.autresRevenus || 0,
      total: (data.revenus?.salaireBrut || 0) + (data.revenus?.autresRevenus || 0)
    };

    const charges = {
      loyer: data.charges?.loyer || 0,
      assurances: data.charges?.assurances || 0,
      autres: data.charges?.autresCharges || 0,
      total: (data.charges?.loyer || 0) + (data.charges?.assurances || 0) + (data.charges?.autresCharges || 0)
    };

    const capaciteEpargneMensuelle = (revenus.total / 12) - charges.total;
    const capaciteEpargneAnnuelle = capaciteEpargneMensuelle * 12;
    const tauxEpargne = (capaciteEpargneMensuelle / (revenus.total / 12)) * 100;

    // Générer les optimisations
    const optimizations = generateOptimizations(data, capaciteEpargneMensuelle, revenus.total);
    const recommendations = generateRecommendations(data, scoring, capaciteEpargneMensuelle);

    const optimizationReport: OptimizationReport = {
      userData: {
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        age: data.age || 0,
        canton: data.canton || '',
        situationFamiliale: data.situationFamiliale || '',
        scoring
      },
      financialSituation: {
        revenus,
        charges,
        capaciteEpargne: {
          mensuelle: capaciteEpargneMensuelle,
          annuelle: capaciteEpargneAnnuelle,
          tauxEpargne
        }
      },
      optimizations,
      recommendations
    };

    setReport(optimizationReport);

    // Générer le PDF
    const pdfService = new PDFOptimizationService();
    const blob = await pdfService.generateOptimizationReport(optimizationReport);
    setPdfBlob(blob);

    setIsGeneratingPDF(false);
    setIsComplete(true);
  };

  const generateOptimizations = (data: any, capaciteEpargne: number, revenuAnnuel: number) => {
    const optimizations = [];

    // 3e pilier
    const pilier3aMax = 7258; // 2025
    if (capaciteEpargne >= 605 && !data.objectifsFinanciers?.includes('Préparer ma retraite (3e pilier)')) {
      const economie = pilier3aMax * 0.25; // Estimation 25% d'économie d'impôt
      optimizations.push({
        titre: '3e Pilier A - Déduction fiscale',
        description: `En cotisant CHF 7'258/an au 3e pilier, vous pourriez économiser environ ${formatCurrency(economie)} d'impôts par an selon votre taux marginal.`,
        economieEstimee: economie,
        priorite: 'haute' as const,
        actionnable: true,
        delai: 'Avant le 31 décembre 2025'
      });
    }

    // Rachat LPP
    if (revenuAnnuel > 80000 && data.age && data.age < 60) {
      optimizations.push({
        titre: 'Rachat LPP (2e pilier)',
        description: 'Les rachats volontaires dans votre caisse de pension sont 100% déductibles et permettent de réduire significativement vos impôts.',
        economieEstimee: 3000,
        priorite: 'moyenne' as const,
        actionnable: true,
        delai: 'À planifier selon vos lacunes'
      });
    }

    // Frais professionnels
    if (revenuAnnuel > 50000) {
      optimizations.push({
        titre: 'Optimisation frais professionnels',
        description: 'Passez des frais forfaitaires aux frais effectifs si vos dépenses (transport, repas, formation) dépassent CHF 4\'000/an.',
        economieEstimee: 800,
        priorite: 'moyenne' as const,
        actionnable: true,
        delai: 'Prochaine déclaration fiscale'
      });
    }

    // Épargne de sécurité
    if (capaciteEpargne > 0 && !data.objectifsFinanciers?.includes('Constituer une épargne de sécurité')) {
      optimizations.push({
        titre: 'Fonds d\'urgence',
        description: 'Constituez une épargne de sécurité équivalente à 6 mois de charges (CHF ' + formatCurrency(capaciteEpargne * 6) + ').',
        economieEstimee: 0,
        priorite: 'haute' as const,
        actionnable: true,
        delai: 'Sur 12-18 mois'
      });
    }

    return optimizations;
  };

  const generateRecommendations = (data: any, scoring: string, capaciteEpargne: number) => {
    const recommendations = [];

    if (scoring === 'debutant') {
      recommendations.push({
        categorie: 'Épargne',
        titre: 'Commencez par les bases',
        detail: 'Ouvrez un compte 3e pilier et commencez par des versements réguliers, même modestes. L\'important est la régularité.'
      });

      recommendations.push({
        categorie: 'Formation',
        titre: 'Développez vos connaissances',
        detail: 'Consultez nos articles sur l\'éducation fiscale pour mieux comprendre le système suisse et les opportunités d\'optimisation.'
      });
    }

    if (scoring === 'intermediaire' || scoring === 'avance') {
      recommendations.push({
        categorie: '3e pilier',
        titre: 'Stratégie multi-piliers',
        detail: 'Ouvrez plusieurs comptes 3e pilier pour optimiser les retraits futurs et réduire la fiscalité lors de la retraite.'
      });

      if (data.toleranceRisque !== 'faible') {
        recommendations.push({
          categorie: 'Investissement',
          titre: 'Diversification du patrimoine',
          detail: 'Envisagez des ETF ou fonds indiciels pour une diversification optimale avec des frais réduits.'
        });
      }
    }

    if (data.objectifsFinanciers?.includes('Devenir propriétaire')) {
      recommendations.push({
        categorie: 'Immobilier',
        titre: 'Accession à la propriété',
        detail: 'Utilisez votre 3e pilier pour financer l\'apport personnel (20% minimum). Planifiez un apport de CHF 100\'000-150\'000 pour un bien de CHF 500\'000-750\'000.'
      });
    }

    if (capaciteEpargne > 2000) {
      recommendations.push({
        categorie: 'LPP',
        titre: 'Maximisez vos rachats',
        detail: 'Avec votre capacité d\'épargne actuelle, envisagez des rachats LPP progressifs pour optimiser votre fiscalité sur plusieurs années.'
      });
    }

    return recommendations;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const downloadPDF = () => {
    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurore-finances-analyse-${user?.nom || 'rapport'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendByEmail = async () => {
    if (!pdfBlob || !user?.email) return;

    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('pdf', pdfBlob, 'analyse-financiere.pdf');

    try {
      await fetch('/api/send-optimization-pdf', {
        method: 'POST',
        body: formData
      });

      alert('📧 Document envoyé par email !');
    } catch (error) {
      console.error('Erreur envoi email:', error);
      alert('❌ Erreur lors de l\'envoi par email');
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  if (!isComplete) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Configuration de votre profil
              </h1>
              <p className="text-gray-600">
                Notre IA va vous poser quelques questions pour créer votre profil financier personnalisé
              </p>
            </div>

            <Card className="border-none shadow-xl">
              <OnboardingChatbot onComplete={handleOnboardingComplete} />
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Profil créé avec succès !
            </h1>
            <p className="text-gray-600">
              Votre analyse financière personnalisée est prête
            </p>
          </div>

          {/* Summary Card */}
          {report && (
            <Card className="border-none shadow-xl mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Votre Analyse Financière</h2>
                <p className="text-white/90">Rapport personnalisé généré par IA</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Revenus annuels</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(report.financialSituation.revenus.total)}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Capacité d'épargne</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(report.financialSituation.capaciteEpargne.mensuelle)}/mois
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Économies potentielles</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(report.optimizations.reduce((sum, opt) => sum + opt.economieEstimee, 0))}/an
                    </p>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Points clés de votre analyse
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {report.optimizations.slice(0, 3).map((opt, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{opt.titre}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                  <Button
                    onClick={downloadPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isGeneratingPDF}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le PDF
                  </Button>

                  <Button
                    onClick={sendByEmail}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    disabled={isGeneratingPDF}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Recevoir par email
                  </Button>
                </div>

                {/* Next Steps */}
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">📋 Prochaines étapes</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Consultez votre analyse complète dans le PDF</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Explorez votre dashboard personnalisé</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Définissez vos objectifs financiers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* CTA Button */}
          <div className="text-center">
            <Button
              onClick={goToDashboard}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            >
              Accéder au dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
