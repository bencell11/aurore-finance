'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calculator, 
  FileText, 
  Upload, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle,
  Download,
  User,
  Banknote,
  Shield,
  Building
} from 'lucide-react';

import { TaxChatInterface } from '@/components/tax/TaxChatInterface';
import { TaxProfileForm } from '@/components/tax/TaxProfileForm';
import { TaxCalculationDisplay } from '@/components/tax/TaxCalculationDisplay';
import { DocumentUploadZone } from '@/components/tax/DocumentUploadZone';
import { TaxOptimizationSuggestions } from '@/components/tax/TaxOptimizationSuggestions';
import { TaxDebugPanel } from '@/components/tax/TaxDebugPanel';
import { ProductionStatusBanner } from '@/components/ui/ProductionStatusBanner';

interface TaxProfile {
  id?: string;
  completionStatus: {
    overall: number;
    sections: {
      personalInfo: boolean;
      income: boolean;
      deductions: boolean;
      assets: boolean;
      realEstate: boolean;
      documents: boolean;
    };
  };
}

interface TaxCalculation {
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  remainingTax: number;
}

interface Optimization {
  type: string;
  title: string;
  description: string;
  savingAmount: number;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
}

export default function AssistantFiscalPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<TaxProfile | null>(null);
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTaxProfile();
  }, []);

  const loadTaxProfile = async () => {
    try {
      const response = await fetch('/api/tax/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError('Impossible de charger votre profil fiscal');
    } finally {
      setLoading(false);
    }
  };

  const calculateTax = async () => {
    if (!profile?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: new Date().getFullYear() })
      });

      if (response.ok) {
        const data = await response.json();
        setCalculation(data.calculation);
        setOptimizations(data.optimizations || []);
      } else {
        throw new Error('Erreur lors du calcul');
      }
    } catch (err) {
      setError('Impossible de calculer vos impôts');
    } finally {
      setLoading(false);
    }
  };

  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async (format: 'PDF' | 'TAX' | 'HTML' | 'OFFICIAL_HTML' | 'OFFICIAL_JSON') => {
    setExportLoading(true);
    try {
      await generateDocuments(format);
    } catch (error) {
      setError('Erreur lors de l\'export: ' + (error as Error).message);
    } finally {
      setExportLoading(false);
    }
  };

  const generateDocuments = async (format: 'PDF' | 'TAX' | 'HTML' | 'OFFICIAL_HTML' | 'OFFICIAL_JSON') => {
    try {
      // Déterminer l'API à utiliser selon le format
      const isOfficialFormat = format.startsWith('OFFICIAL_');
      const apiEndpoint = isOfficialFormat ? '/api/tax/generate-official-form' : '/api/tax/export';
      
      // Préparer les données pour l'API
      const requestBody = isOfficialFormat ? {
        format: format.replace('OFFICIAL_', ''),
        includeMetadata: true
      } : {
        format,
        profile,
        calculation
      };
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        if (format === 'PDF' || format === 'OFFICIAL_HTML') {
          // Pour PDF et formulaire officiel HTML, ouvrir dans un nouvel onglet
          const htmlContent = await response.text();
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(htmlContent);
            newWindow.document.close();
            // Déclencher automatiquement le dialogue d'impression pour PDF
            if (format === 'PDF') {
              setTimeout(() => {
                newWindow.print();
              }, 1000);
            }
          }
        } else {
          // Pour les autres formats, télécharger le fichier
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          
          // Déterminer le nom de fichier selon le format
          let fileName = `declaration-fiscale-${new Date().getFullYear()}`;
          if (format === 'OFFICIAL_JSON') {
            fileName = `declaration-officielle-${new Date().getFullYear()}.json`;
          } else {
            fileName += `.${format.toLowerCase()}`;
          }
          
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      setError('Erreur lors de la génération du document');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const completionPercentage = profile?.completionStatus?.overall || 0;
  const isProfileComplete = completionPercentage >= 80;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Bannière de statut intelligent */}
      <ProductionStatusBanner />

      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Assistant Fiscal Intelligent</h1>
        <p className="text-blue-100">
          Préparez votre déclaration d'impôts suisse avec l'IA et optimisez automatiquement vos déductions
        </p>
      </div>

      {/* Alertes */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Assistant IA
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Mon Profil
          </TabsTrigger>
          <TabsTrigger value="calculation" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calcul
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-2 text-xs">
            🔧 Debug
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* Section progression */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  État de votre déclaration
                </CardTitle>
                <CardDescription>
                  Suivez l'avancement de votre dossier fiscal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progression globale</span>
                    <span className="font-semibold">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${profile?.completionStatus?.sections?.personalInfo ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Informations personnelles</span>
                    {profile?.completionStatus?.sections?.personalInfo && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${profile?.completionStatus?.sections?.income ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Revenus et activité professionnelle</span>
                    {profile?.completionStatus?.sections?.income && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${profile?.completionStatus?.sections?.deductions ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Déductions et frais</span>
                    {profile?.completionStatus?.sections?.deductions && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${profile?.completionStatus?.sections?.assets ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Fortune et patrimoine</span>
                    {profile?.completionStatus?.sections?.assets && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${profile?.completionStatus?.sections?.documents ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Documents justificatifs</span>
                    {profile?.completionStatus?.sections?.documents && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />}
                  </div>
                </div>

                {!isProfileComplete && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Complétez votre profil pour accéder au calcul automatique et aux optimisations personnalisées.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  Résumé fiscal
                </CardTitle>
                <CardDescription>
                  Aperçu de votre situation fiscale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {calculation ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Impôt total estimé</span>
                        <span className="text-lg font-bold text-blue-600">
                          {calculation.totalTax.toLocaleString('fr-CH')} CHF
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Taux effectif</p>
                          <p className="text-lg font-semibold">{calculation.effectiveRate.toFixed(1)}%</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Taux marginal</p>
                          <p className="text-lg font-semibold">{calculation.marginalRate.toFixed(1)}%</p>
                        </div>
                      </div>

                      {optimizations.length > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm font-medium text-green-900 mb-1">Économies identifiées</p>
                          <p className="text-2xl font-bold text-green-600">
                            {optimizations.reduce((sum, opt) => sum + opt.savingAmount, 0).toLocaleString('fr-CH')} CHF
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            {optimizations.length} opportunité{optimizations.length > 1 ? 's' : ''} d'optimisation
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Aucun calcul disponible
                    </p>
                    <Button
                      onClick={calculateTax}
                      disabled={!isProfileComplete || loading}
                      variant="outline"
                    >
                      {isProfileComplete ? 'Calculer mes impôts' : 'Complétez votre profil d\'abord'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Gagnez du temps avec ces raccourcis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto flex-col items-start p-4 gap-2"
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Poser une question</p>
                    <p className="text-xs text-muted-foreground">Assistant IA fiscal</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col items-start p-4 gap-2"
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Compléter mon profil</p>
                    <p className="text-xs text-muted-foreground">Informations fiscales</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col items-start p-4 gap-2"
                  onClick={() => setActiveTab('documents')}
                >
                  <Upload className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Télécharger documents</p>
                    <p className="text-xs text-muted-foreground">Justificatifs</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col items-start p-4 gap-2"
                  onClick={() => setActiveTab('export')}
                  disabled={!calculation}
                >
                  <Download className="h-5 w-5 text-orange-600" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Exporter déclaration</p>
                    <p className="text-xs text-muted-foreground">PDF, HTML, TAX</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Optimisations prioritaires */}
          {optimizations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Opportunités d'optimisation
                </CardTitle>
                <CardDescription>
                  Réduisez votre charge fiscale légalement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimizations.slice(0, 3).map((opt, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        opt.priority === 'high' ? 'bg-red-100 text-red-600' :
                        opt.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <Banknote className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm">{opt.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                            {opt.deadline && (
                              <p className="text-xs text-orange-600 mt-1">📅 {opt.deadline}</p>
                            )}
                          </div>
                          <Badge variant={opt.priority === 'high' ? 'destructive' : 'secondary'}>
                            {opt.savingAmount.toLocaleString('fr-CH')} CHF
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {optimizations.length > 3 && (
                    <Button
                      variant="link"
                      className="w-full"
                      onClick={() => setActiveTab('calculation')}
                    >
                      Voir toutes les optimisations ({optimizations.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Chat avec l'assistant IA */}
        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Assistant Fiscal IA
              </CardTitle>
              <CardDescription>
                Posez vos questions fiscales et laissez-vous guider pour optimiser votre déclaration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxChatInterface profile={profile} onProfileUpdate={setProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profil fiscal */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mon Profil Fiscal
              </CardTitle>
              <CardDescription>
                Complétez vos informations pour une analyse fiscale précise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxProfileForm 
                profile={profile} 
                onUpdate={setProfile}
                onError={setError}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calcul des impôts */}
        <TabsContent value="calculation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calcul de l'Impôt
                </CardTitle>
                <CardDescription>
                  Simulation en temps réel basée sur votre profil
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProfileComplete ? (
                  <div className="space-y-4">
                    <Button onClick={calculateTax} className="w-full" disabled={loading}>
                      {loading ? 'Calcul en cours...' : 'Calculer mes impôts'}
                    </Button>
                    {calculation && (
                      <TaxCalculationDisplay calculation={calculation} />
                    )}
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Complétez votre profil pour activer le calcul automatique des impôts.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Optimisations Fiscales
                </CardTitle>
                <CardDescription>
                  Suggestions personnalisées pour réduire vos impôts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {optimizations.length > 0 ? (
                  <TaxOptimizationSuggestions optimizations={optimizations} />
                ) : (
                  <p className="text-muted-foreground">
                    Effectuez un calcul pour voir vos optimisations personnalisées.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Upload de documents */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Documents Fiscaux
              </CardTitle>
              <CardDescription>
                Téléchargez vos documents pour un remplissage automatique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUploadZone 
                onUpload={(file) => {
                  // Traitement du fichier
                  console.log('Fichier téléchargé:', file.name);
                }}
                onError={setError}
              />
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Documents recommandés :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Certificat de salaire annuel',
                    'Attestation 3e pilier',
                    'Relevés bancaires au 31.12',
                    'Attestations d\'assurance maladie',
                    'Justificatifs frais professionnels',
                    'Documents immobiliers'
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export et génération */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Génération de Documents
              </CardTitle>
              <CardDescription>
                Exportez votre déclaration dans différents formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProfileComplete && calculation ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => generateDocuments('PDF')}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    Déclaration PDF
                  </Button>
                  
                  <Button 
                    onClick={() => generateDocuments('TAX')}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <Building className="h-6 w-6 mb-2" />
                    Format .TAX
                  </Button>
                  
                  <Button 
                    onClick={() => generateDocuments('HTML')}
                    variant="outline"
                    className="h-20 flex-col"
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    Version HTML
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Éléments requis pour générer vos documents fiscaux :
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Statut du profil */}
                    <Card className="border-orange-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Profil Fiscal
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          {profile?.completionStatus?.sections?.personalInfo ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">Informations personnelles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {profile?.completionStatus?.sections?.income ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">Revenus et emploi</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {profile?.completionStatus?.sections?.deductions ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">Déductions fiscales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {profile?.completionStatus?.sections?.assets ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">Fortune et actifs</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Statut du calcul */}
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Calcul Fiscal
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          {calculation ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">Calcul des impôts effectué</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {optimizations.length > 0 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">Optimisations générées</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {completionPercentage >= 80 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">Profil complet (≥80%)</span>
                          <Badge variant={completionPercentage >= 80 ? "default" : "secondary"}>
                            {completionPercentage}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Actions recommandées :</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      {!profile?.completionStatus?.sections?.personalInfo && (
                        <li>• Complétez vos informations personnelles dans l'onglet "Mon Profil"</li>
                      )}
                      {!profile?.completionStatus?.sections?.income && (
                        <li>• Ajoutez vos revenus d'emploi dans l'onglet "Mon Profil"</li>
                      )}
                      {!profile?.completionStatus?.sections?.deductions && (
                        <li>• Saisissez vos déductions (3e pilier, frais, assurances) dans "Mon Profil"</li>
                      )}
                      {!profile?.completionStatus?.sections?.assets && (
                        <li>• Déclarez votre fortune et comptes bancaires dans "Mon Profil"</li>
                      )}
                      {!calculation && (
                        <li>• Effectuez le calcul de vos impôts dans l'onglet "Calcul"</li>
                      )}
                      {calculation && optimizations.length === 0 && (
                        <li>• Générez vos optimisations fiscales dans l'onglet "Calcul"</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Formulaire Officiel */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">📋 Formulaire Officiel Suisse 2025</h3>
                <p className="text-sm text-green-700 mb-4">
                  Générez votre déclaration selon le formulaire officiel <strong>2 605.040.11f</strong> 
                  avec vos données automatiquement remplies aux bons endroits.
                </p>
                
                <div className="flex gap-3 mb-3">
                  <Button 
                    onClick={() => handleExport('OFFICIAL_HTML')}
                    disabled={exportLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {exportLoading ? 'Génération...' : 'Générer Formulaire Officiel (HTML)'}
                  </Button>
                  <Button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/tax/export-pdf', { method: 'POST' });
                        if (response.ok) {
                          const htmlContent = await response.text();
                          const newWindow = window.open('', '_blank');
                          if (newWindow) {
                            newWindow.document.write(htmlContent);
                            newWindow.document.close();
                          }
                        }
                      } catch (error) {
                        console.error('Erreur export PDF:', error);
                      }
                    }}
                    disabled={exportLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    📄 Export PDF Direct
                  </Button>
                  <Button 
                    onClick={() => handleExport('OFFICIAL_JSON')}
                    disabled={exportLoading}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Données JSON
                  </Button>
                </div>
                
                <ul className="space-y-1 text-xs text-green-600">
                  <li>✅ Structure officielle respectée</li>
                  <li>✅ Numérotation des champs exacte</li>
                  <li>✅ Calculs conformes aux lois fiscales</li>
                  <li>✅ Prêt pour impression et signature</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Autres formats disponibles :</h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• <strong>PDF</strong> : Déclaration complète prête à imprimer</li>
                  <li>• <strong>TAX</strong> : Format électronique pour soumission cantonale</li>
                  <li>• <strong>HTML</strong> : Version web avec calculs détaillés</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Panel de Debug */}
        <TabsContent value="debug" className="space-y-4">
          <TaxDebugPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}