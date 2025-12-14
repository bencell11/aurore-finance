'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import DigitalSignature from '@/components/documents/DigitalSignature';
import DocumentPreview from '@/components/documents/DocumentPreview';
import TemplatePreview from '@/components/documents/TemplatePreview';
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Eye
} from 'lucide-react';

export default function DocumentsPage() {
  const [step, setStep] = useState<'input' | 'template-preview' | 'review' | 'preview' | 'generate'>('input');
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

  // Prévisualisation
  const [previewHtml, setPreviewHtml] = useState<string>('');

  // Auto-complétion depuis le profil utilisateur
  const [autofilledFields, setAutofilledFields] = useState<Set<string>>(new Set());
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Charger le profil utilisateur au montage
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      console.log('🔄 Chargement du profil utilisateur pour auto-complétion documents...');

      // Mapping des champs communs utilisés dans les documents
      const fieldMapping = {
        prenom: 'prenom' as const,
        nom: 'nom' as const,
        dateNaissance: 'date_naissance' as const,
        numeroAVS: 'numero_avs' as const,
        genre: 'genre' as const,
        nationalite: 'nationalite' as const,
        adresse: 'adresse' as const,
        rue: 'adresse' as const,
        npa: 'npa' as const,
        ville: 'ville' as const,
        email: 'email' as const,
        telephone: 'telephone' as const,
        langue: 'langue' as const,
        caissePension: 'caisse_pension' as const,
      };

      const autofilledData = await UserProfileSupabaseService.autofillForm(fieldMapping);

      if (Object.keys(autofilledData).length > 0) {
        console.log('✅ Auto-remplissage réussi:', Object.keys(autofilledData));

        // Stocker les données auto-remplies
        setGatheredData(autofilledData);

        // Pré-remplir manualData avec ces valeurs
        setManualData(prev => ({
          ...prev,
          ...autofilledData
        }));

        // Marquer les champs comme auto-remplis
        setAutofilledFields(new Set(Object.keys(autofilledData)));
      } else {
        console.log('ℹ️ Aucune donnée à auto-remplir');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

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
      // Envoyer à la fois le prompt ET les données du profil déjà remplies
      const response = await fetch('/api/documents/analyze-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          profileData: manualData // Envoyer les données du profil
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      setAnalysis(data.routing);
      setTemplate(data.template);

      if (data.template) {
        // Fusionner les données: priorité aux données du profil (manualData),
        // puis compléter avec les données extraites du prompt
        const mergedData = {
          ...data.extractedData, // Données extraites du prompt (priorité basse)
          ...manualData, // Données du profil (priorité haute - écrase les précédentes)
        };

        // Filtrer les champs "objet" et "contenu" qui ne devraient pas être là
        const filteredData = Object.fromEntries(
          Object.entries(mergedData).filter(([key]) =>
            !['objet', 'contenu', 'contenu_principal', 'contenu_courrier'].includes(key.toLowerCase())
          )
        );

        console.log('✅ Données finales après fusion:', filteredData);
        setManualData(filteredData);

        // Passer à l'étape de prévisualisation du template
        setStep('template-preview');
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
   * Étape 3: Générer la prévisualisation
   */
  const handleGeneratePreview = async () => {
    if (!signatureDataUrl) {
      setError('Veuillez signer le document avant de continuer');
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
          template: template, // Inclure le template complet pour les templates dynamiques
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

      // Récupérer le HTML pour la prévisualisation
      const html = await response.text();
      setPreviewHtml(html);
      setStep('preview');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Étape 4: Confirmer et télécharger le document
   */
  const handleConfirmDownload = () => {
    // Créer un blob à partir du HTML
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setStep('generate');
  };

  return (
    <TooltipProvider>
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

      {/* Étape 1: Saisie de la demande + Informations personnelles */}
      {step === 'input' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche: Votre demande */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Votre demande
              </CardTitle>
              <CardDescription>
                Décrivez le document que vous souhaitez créer en une phrase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userInput">Description du document *</Label>
                <textarea
                  id="userInput"
                  placeholder="Ex: Je veux résilier mon contrat d'assurance maladie Helsana pour fin décembre 2024..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full min-h-[120px] p-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Exemples rapides */}
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 mb-2">Exemples rapides:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => setUserInput("Je veux créer une facture professionnelle pour mes prestations de conseil")}
                  >
                    💼 Facture
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-50"
                    onClick={() => setUserInput("Je veux résilier mon assurance maladie")}
                  >
                    Résiliation assurance
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-50"
                    onClick={() => setUserInput("Je souhaite résilier mon bail")}
                  >
                    Résiliation bail
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-50"
                    onClick={() => setUserInput("Je veux faire une réclamation")}
                  >
                    Réclamation
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colonne droite: Informations personnelles */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Vos informations personnelles
              </CardTitle>
              <CardDescription>
                {isLoadingProfile ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Chargement de votre profil...</span>
                  </div>
                ) : Object.keys(gatheredData || {}).length > 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Sparkles className="w-3 h-3" />
                    <span>{Object.keys(gatheredData).length} donnée(s) récupérée(s) depuis votre profil</span>
                  </div>
                ) : (
                  <span>Remplissez vos informations pour les utiliser dans vos documents</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="prenom" className="text-xs">Prénom</Label>
                  <AutofillInput
                    id="prenom"
                    value={manualData.prenom || ''}
                    onChange={(e) => {
                      setManualData({ ...manualData, prenom: e.target.value });
                      if (autofilledFields.has('prenom')) {
                        const newSet = new Set(autofilledFields);
                        newSet.delete('prenom');
                        setAutofilledFields(newSet);
                      }
                    }}
                    placeholder="Jean"
                    autofilled={autofilledFields.has('prenom')}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nom" className="text-xs">Nom</Label>
                  <AutofillInput
                    id="nom"
                    value={manualData.nom || ''}
                    onChange={(e) => {
                      setManualData({ ...manualData, nom: e.target.value });
                      if (autofilledFields.has('nom')) {
                        const newSet = new Set(autofilledFields);
                        newSet.delete('nom');
                        setAutofilledFields(newSet);
                      }
                    }}
                    placeholder="Dupont"
                    autofilled={autofilledFields.has('nom')}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <AutofillInput
                  id="email"
                  type="email"
                  value={manualData.email || ''}
                  onChange={(e) => {
                    setManualData({ ...manualData, email: e.target.value });
                    if (autofilledFields.has('email')) {
                      const newSet = new Set(autofilledFields);
                      newSet.delete('email');
                      setAutofilledFields(newSet);
                    }
                  }}
                  placeholder="jean.dupont@exemple.ch"
                  autofilled={autofilledFields.has('email')}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="adresse" className="text-xs">Adresse complète</Label>
                <AutofillInput
                  id="adresse"
                  value={manualData.adresse || manualData.rue || ''}
                  onChange={(e) => {
                    setManualData({ ...manualData, adresse: e.target.value, rue: e.target.value });
                    if (autofilledFields.has('adresse')) {
                      const newSet = new Set(autofilledFields);
                      newSet.delete('adresse');
                      setAutofilledFields(newSet);
                    }
                  }}
                  placeholder="Rue de la Gare 15"
                  autofilled={autofilledFields.has('adresse') || autofilledFields.has('rue')}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="npa" className="text-xs">NPA</Label>
                  <AutofillInput
                    id="npa"
                    value={manualData.npa || ''}
                    onChange={(e) => {
                      setManualData({ ...manualData, npa: e.target.value });
                      if (autofilledFields.has('npa')) {
                        const newSet = new Set(autofilledFields);
                        newSet.delete('npa');
                        setAutofilledFields(newSet);
                      }
                    }}
                    placeholder="1000"
                    autofilled={autofilledFields.has('npa')}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="ville" className="text-xs">Ville</Label>
                  <AutofillInput
                    id="ville"
                    value={manualData.ville || ''}
                    onChange={(e) => {
                      setManualData({ ...manualData, ville: e.target.value });
                      if (autofilledFields.has('ville')) {
                        const newSet = new Set(autofilledFields);
                        newSet.delete('ville');
                        setAutofilledFields(newSet);
                      }
                    }}
                    placeholder="Lausanne"
                    autofilled={autofilledFields.has('ville')}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="telephone" className="text-xs">Téléphone</Label>
                <AutofillInput
                  id="telephone"
                  value={manualData.telephone || ''}
                  onChange={(e) => {
                    setManualData({ ...manualData, telephone: e.target.value });
                    if (autofilledFields.has('telephone')) {
                      const newSet = new Set(autofilledFields);
                      newSet.delete('telephone');
                      setAutofilledFields(newSet);
                    }
                  }}
                  placeholder="+41 21 xxx xx xx"
                  autofilled={autofilledFields.has('telephone')}
                />
              </div>

              {Object.keys(gatheredData || {}).length === 0 && !isLoadingProfile && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  💡 Complétez votre profil dans le dashboard pour auto-remplir ces champs automatiquement
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bouton de génération - Affiché uniquement sur l'étape input */}
      {step === 'input' && (
        <div className="mt-6">
          <Button
            onClick={handleAnalyze}
            disabled={loading || !userInput.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 h-12 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Génération du document en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Générer mon document
              </>
            )}
          </Button>
        </div>
      )}

      {/* Nouvelle étape 1.5: Prévisualisation du template */}
      {step === 'template-preview' && template && (
        <TemplatePreview
          template={template}
          onConfirm={() => setStep('review')}
          onRegenerate={() => {
            setStep('input');
            setTemplate(null);
            setAnalysis(null);
          }}
        />
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
              {template.metadata?.dynamicallyGenerated && (
                <div className="mt-3 flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded">
                  <Sparkles className="h-4 w-4" />
                  Template généré dynamiquement par l'IA pour votre demande spécifique
                </div>
              )}
              {analysis && (
                <div className="mt-2 text-xs text-gray-500">
                  Confiance IA: {Math.round(analysis.confidence * 100)}% • {analysis.reasoning}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Données récupérées */}
          {gatheredData && Object.keys(gatheredData).length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Données récupérées de votre profil
                </CardTitle>
                <CardDescription>
                  {Object.keys(gatheredData).length} champ(s) ont été automatiquement pré-remplis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {Object.entries(gatheredData).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-white border border-green-200 rounded">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="font-medium text-gray-900">{String(value)}</span>
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
                {Object.keys(manualData).length > 0 && (
                  <span className="ml-2 text-green-600">
                    • {Object.keys(manualData).length} champ(s) pré-rempli(s) automatiquement
                  </span>
                )}
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
                          className={`w-full p-2 border rounded ${autofilledFields.has(field.key) ? 'border-green-300 bg-green-50' : ''}`}
                          value={manualData[field.key] || ''}
                          onChange={(e) => {
                            setManualData({ ...manualData, [field.key]: e.target.value });
                            // Retirer le champ des auto-remplis si modifié
                            if (autofilledFields.has(field.key)) {
                              const newSet = new Set(autofilledFields);
                              newSet.delete(field.key);
                              setAutofilledFields(newSet);
                            }
                          }}
                        >
                          <option value="">Sélectionnez...</option>
                          {field.options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <AutofillInput
                          id={field.key}
                          type={field.type === 'date' ? 'date' : 'text'}
                          placeholder={field.placeholder || field.helpText}
                          value={manualData[field.key] || field.defaultValue || ''}
                          onChange={(e) => {
                            setManualData({ ...manualData, [field.key]: e.target.value });
                            // Retirer le champ des auto-remplis si modifié
                            if (autofilledFields.has(field.key)) {
                              const newSet = new Set(autofilledFields);
                              newSet.delete(field.key);
                              setAutofilledFields(newSet);
                            }
                          }}
                          autofilled={autofilledFields.has(field.key)}
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
              onClick={handleGeneratePreview}
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
                  <Eye className="mr-2 h-4 w-4" />
                  Prévisualiser le document
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Étape 3: Prévisualisation */}
      {step === 'preview' && previewHtml && (
        <DocumentPreview
          htmlContent={previewHtml}
          templateTitle={template?.title || 'Document'}
          onConfirm={handleConfirmDownload}
          onEdit={() => setStep('review')}
          onCancel={() => {
            setStep('input');
            setPreviewHtml('');
            setManualData({});
            setSignatureDataUrl(null);
          }}
        />
      )}

      {/* Étape 4: Document généré */}
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
    </TooltipProvider>
  );
}

// Composant pour les champs avec auto-complétion
function AutofillInput({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  autofilled,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autofilled?: boolean;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={autofilled ? 'border-green-300 bg-green-50 pr-10' : ''}
      />
      {autofilled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Sparkles className="w-4 h-4 text-green-600" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Auto-rempli depuis votre profil</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
