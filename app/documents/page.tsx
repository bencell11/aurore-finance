'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import DigitalSignature from '@/components/documents/DigitalSignature';
import {
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  MessageSquare,
  Edit2
} from 'lucide-react';

export default function DocumentsPage() {
  const [step, setStep] = useState<'input' | 'review' | 'generate'>('input');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données de l'analyse IA
  const [analysis, setAnalysis] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);

  // Données recueillies
  const [gatheredData, setGatheredData] = useState<any>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Données manuelles à saisir
  const [manualData, setManualData] = useState<Record<string, any>>({});

  // Signature numérique
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});

  /**
   * Étape 1: Analyser la demande utilisateur
   */
  const handleAnalyze = async () => {
    if (!userInput.trim()) {
      setError('Veuillez décrire le document que vous souhaitez créer');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/documents/analyze-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      setAnalysis(data.routing);
      setTemplate(data.template);

      if (data.template) {
        // Passer directement à l'étape de révision avec le template
        // On va demander TOUTES les infos à l'utilisateur directement
        setStep('review');
        setGatheredData({});
      } else {
        setError('Template non trouvé. Veuillez reformuler votre demande.');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  /**
   * Étape 3: Générer et télécharger le document
   */
  const handleGenerate = async () => {
    if (!signatureDataUrl) {
      setError('Veuillez signer le document avant de le générer');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/documents/assemble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          manualData,
          signatureDataUrl,
          format: 'HTML'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.missing && errorData.missing.length > 0) {
          throw new Error(`Champs manquants: ${errorData.missing.join(', ')}`);
        }
        throw new Error(errorData.error || 'Erreur lors de la génération');
      }

      // Télécharger le fichier HTML
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.id}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setStep('generate');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 pb-24 md:pb-6 max-w-4xl">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-10 w-10" />
          <h1 className="text-3xl font-bold">Générateur de Documents IA</h1>
        </div>
        <p className="text-purple-100">
          Créez des documents officiels suisses en quelques secondes grâce à l'intelligence artificielle
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Étape 1: Saisie de la demande */}
      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Décrivez le document que vous souhaitez créer
            </CardTitle>
            <CardDescription>
              Exemple: "Je veux résilier mon assurance maladie Helsana" ou "Je souhaite faire une réclamation pour un retard de paiement"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userInput">Votre demande</Label>
              <Input
                id="userInput"
                placeholder="Ex: Je veux résilier mon contrat d'assurance maladie..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
                className="text-base"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={loading || !userInput.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyser ma demande
                </>
              )}
            </Button>

            {/* Exemples rapides */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Exemples rapides:</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setUserInput("Je veux résilier mon assurance maladie")}
                >
                  Résiliation assurance maladie
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setUserInput("Je souhaite résilier mon bail de location")}
                >
                  Résiliation bail
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setUserInput("Je veux faire une réclamation")}
                >
                  Réclamation
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Révision et complétion des données */}
      {step === 'review' && template && (
        <div className="space-y-6">
          {/* Template sélectionné */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Template sélectionné
              </CardTitle>
              <CardDescription>
                {template.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600">{template.description}</p>
              {analysis && (
                <div className="mt-2 text-xs text-gray-500">
                  Confiance IA: {Math.round(analysis.confidence * 100)}% • {analysis.reasoning}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Données récupérées */}
          {gatheredData && Object.keys(gatheredData).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Données récupérées de votre profil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(gatheredData).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tous les champs requis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations requises</CardTitle>
              <CardDescription>
                Veuillez remplir tous les champs suivants pour générer votre document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.requiredFields.map((field: any) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>

                      {field.type === 'select' && field.options ? (
                        <select
                          id={field.key}
                          className="w-full p-2 border rounded"
                          value={manualData[field.key] || ''}
                          onChange={(e) => setManualData({ ...manualData, [field.key]: e.target.value })}
                        >
                          <option value="">Sélectionnez...</option>
                          {field.options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type === 'date' ? 'date' : 'text'}
                          placeholder={field.placeholder || field.helpText}
                          value={manualData[field.key] || field.defaultValue || ''}
                          onChange={(e) => setManualData({ ...manualData, [field.key]: e.target.value })}
                        />
                      )}

                      {field.helpText && (
                        <p className="text-xs text-gray-500">{field.helpText}</p>
                      )}
                    </div>
                  ))}
            </CardContent>
          </Card>

          {/* Signature numérique */}
          <DigitalSignature
            onSignatureComplete={(dataUrl) => setSignatureDataUrl(dataUrl)}
            onSignatureClear={() => setSignatureDataUrl(null)}
          />

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep('input')}
              className="flex-1"
            >
              Recommencer
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Générer le document
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Étape 3: Document généré */}
      {step === 'generate' && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-6 w-6" />
              Document généré avec succès !
            </CardTitle>
            <CardDescription>
              Votre document a été téléchargé. Vérifiez les informations avant de l'envoyer.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center py-8">
              <FileText className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <p className="text-lg font-medium mb-2">Votre document est prêt</p>
              <p className="text-sm text-gray-600">
                Le fichier HTML a été téléchargé. Vous pouvez l'ouvrir dans votre navigateur<br />
                et utiliser Ctrl+P (ou Cmd+P) pour l'imprimer en PDF.
              </p>
            </div>

            <Button
              onClick={() => {
                setStep('input');
                setUserInput('');
                setAnalysis(null);
                setTemplate(null);
                setGatheredData(null);
                setManualData({});
              }}
              className="w-full"
            >
              Créer un autre document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
