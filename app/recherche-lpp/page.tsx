'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserMenu from '@/components/auth/UserMenu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Search,
  FileText,
  CheckCircle2,
  Info,
  User,
  Calendar,
  MapPin,
  Phone,
  Shield,
  Loader2,
  Sparkles
} from 'lucide-react';
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';
import LPPDocumentGenerator from '@/components/LPPDocumentGenerator';

interface LPPSearchForm {
  // Informations personnelles
  prenom: string;
  nom: string;
  dateNaissance: string;
  numeroAVS: string;
  genre: string;
  nationalite: string;
  carteIdentiteRectoUrl: string;
  carteIdentiteVersoUrl: string;

  // Adresse actuelle
  rue: string;
  npa: string;
  ville: string;

  // Contact
  email: string;
  telephone: string;
  langue: string;

  // Professionnel
  caissePension: string;

  // Anciennes adresses (optionnel)
  anciennesAdresses: string;

  // Anciens employeurs (optionnel)
  anciensEmployeurs: string;

  // Consentements
  consentementRecherche: boolean;
  consentementDonnees: boolean;
  consentementSignature: boolean;
}

export default function RechercheLPPPage() {
  const [formData, setFormData] = useState<LPPSearchForm>({
    prenom: '',
    nom: '',
    dateNaissance: '',
    numeroAVS: '',
    genre: '',
    nationalite: '',
    carteIdentiteRectoUrl: '',
    carteIdentiteVersoUrl: '',
    rue: '',
    npa: '',
    ville: '',
    email: '',
    telephone: '',
    langue: '',
    caissePension: '',
    anciennesAdresses: '',
    anciensEmployeurs: '',
    consentementRecherche: false,
    consentementDonnees: false,
    consentementSignature: false,
  });

  const [step, setStep] = useState<'form' | 'review' | 'signature' | 'documents'>('form');
  const [signatureData, setSignatureData] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [autofilledFields, setAutofilledFields] = useState<Set<string>>(new Set());

  // Charger le profil utilisateur au montage et auto-remplir le formulaire
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      console.log('🔄 Chargement du profil utilisateur pour autocomplétion LPP...');

      // Mapping entre les champs du formulaire et du profil Supabase
      const fieldMapping = {
        prenom: 'prenom' as const,
        nom: 'nom' as const,
        dateNaissance: 'date_naissance' as const,
        numeroAVS: 'numero_avs' as const,
        genre: 'genre' as const,
        nationalite: 'nationalite' as const,
        carteIdentiteRectoUrl: 'carte_identite_recto_url' as const,
        carteIdentiteVersoUrl: 'carte_identite_verso_url' as const,
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

        // Mettre à jour le formulaire avec les données
        setFormData(prev => ({
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

  const updateField = (field: keyof LPPSearchForm, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Si l'utilisateur modifie un champ auto-rempli, le retirer de la liste
    if (autofilledFields.has(field as string)) {
      const newSet = new Set(autofilledFields);
      newSet.delete(field as string);
      setAutofilledFields(newSet);
    }
  };

  const isFormValid = () => {
    return (
      formData.prenom &&
      formData.nom &&
      formData.dateNaissance &&
      formData.numeroAVS &&
      formData.genre &&
      formData.nationalite &&
      formData.rue &&
      formData.npa &&
      formData.ville &&
      formData.email &&
      formData.telephone &&
      formData.langue &&
      formData.consentementRecherche &&
      formData.consentementDonnees &&
      formData.consentementSignature
    );
  };

  const generateProcuration = () => {
    setIsGenerating(true);

    // Simulation de génération de document
    setTimeout(() => {
      setIsGenerating(false);
      setStep('review');
    }, 1500);
  };

  const signDocument = () => {
    // Simulation de signature digitale
    const timestamp = new Date().toISOString();
    const signature = `SIGNATURE_${formData.nom.toUpperCase()}_${timestamp}`;
    setSignatureData(signature);
    setStep('signature');
  };

  const generateDocuments = () => {
    setIsGenerating(true);

    // Simulation de génération de documents
    setTimeout(() => {
      setIsGenerating(false);
      setStep('documents');
    }, 1500);
  };

  const downloadDocuments = () => {
    // TODO: Implémenter la génération PDF réelle avec jsPDF ou similaire
    alert('Téléchargement des documents... (À implémenter)');
  };

  return (
    <ProtectedRoute>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Search className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">
                      Recherche d'avoirs LPP
                    </h1>
                  </div>
                  <p className="text-lg text-gray-600 mt-2">
                    Retrouvez vos avoirs de libre passage perdus auprès de la Centrale du 2ème pilier
                  </p>
                </div>
                <UserMenu />
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 mb-16">
            {/* Info card */}
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Service gratuit de recherche LPP
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Recherche centralisée auprès de la Centrale du 2ème pilier</li>
                      <li>• Identification de tous vos comptes de libre passage</li>
                      <li>• Procuration générée automatiquement et signée digitalement</li>
                      <li>• Envoi automatique par email sécurisé à l'administration</li>
                      <li>• Notification dès que vos avoirs sont identifiés</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Étapes du processus */}
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'form' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="hidden md:inline">Formulaire</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300" />
              <div className={`flex items-center gap-2 ${step === 'review' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="hidden md:inline">Vérification</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300" />
              <div className={`flex items-center gap-2 ${step === 'signature' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'signature' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="hidden md:inline">Signature</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300" />
              <div className={`flex items-center gap-2 ${step === 'documents' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'documents' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  ✓
                </div>
                <span className="hidden md:inline">Documents</span>
              </div>
            </div>

            {/* ÉTAPE 1: Formulaire */}
            {step === 'form' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Vos informations personnelles
                  </CardTitle>
                  <CardDescription>
                    Ces informations seront utilisées pour rechercher vos avoirs LPP auprès de la Centrale du 2ème pilier
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Message d'autocomplétion */}
                  {isLoadingProfile ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <p className="text-sm text-blue-700">
                          Chargement de vos informations depuis votre profil...
                        </p>
                      </div>
                    </div>
                  ) : autofilledFields.size > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-900 mb-1">
                            Formulaire pré-rempli automatiquement
                          </p>
                          <p className="text-sm text-green-700">
                            {autofilledFields.size} champ{autofilledFields.size > 1 ? 's ont été remplis' : ' a été rempli'} automatiquement depuis votre profil dashboard.
                            Vérifiez et complétez les informations manquantes.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Informations personnelles */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Identité
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prenom">Prénom *</Label>
                        <AutofillInput
                          id="prenom"
                          value={formData.prenom}
                          onChange={(e) => updateField('prenom', e.target.value)}
                          placeholder="Jean"
                          autofilled={autofilledFields.has('prenom')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nom">Nom *</Label>
                        <AutofillInput
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => updateField('nom', e.target.value)}
                          placeholder="Dupont"
                          autofilled={autofilledFields.has('nom')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateNaissance" className="flex items-center gap-1">
                          Date de naissance *
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Nécessaire pour identifier vos avoirs</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <AutofillInput
                          id="dateNaissance"
                          type="date"
                          value={formData.dateNaissance}
                          onChange={(e) => updateField('dateNaissance', e.target.value)}
                          autofilled={autofilledFields.has('dateNaissance')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="numeroAVS" className="flex items-center gap-1">
                          Numéro AVS *
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Format: 756.XXXX.XXXX.XX</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <AutofillInput
                          id="numeroAVS"
                          value={formData.numeroAVS}
                          onChange={(e) => updateField('numeroAVS', e.target.value)}
                          placeholder="756.1234.5678.90"
                          autofilled={autofilledFields.has('numeroAVS')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="genre">Genre *</Label>
                        <select
                          id="genre"
                          value={formData.genre}
                          onChange={(e) => updateField('genre', e.target.value)}
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${autofilledFields.has('genre') ? 'border-green-300 bg-green-50' : ''}`}
                        >
                          <option value="">Sélectionnez...</option>
                          <option value="homme">Homme</option>
                          <option value="femme">Femme</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="nationalite">Nationalité *</Label>
                        <AutofillInput
                          id="nationalite"
                          value={formData.nationalite}
                          onChange={(e) => updateField('nationalite', e.target.value)}
                          placeholder="Suisse"
                          autofilled={autofilledFields.has('nationalite')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="caissePension">Caisse de pension actuelle</Label>
                        <AutofillInput
                          id="caissePension"
                          value={formData.caissePension}
                          onChange={(e) => updateField('caissePension', e.target.value)}
                          placeholder="Ex: Fondation LPP de mon employeur"
                          autofilled={autofilledFields.has('caissePension')}
                        />
                      </div>
                    </div>

                    {/* Carte d'identité */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        Pièce d'identité
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="carteIdentiteRecto">Carte d'identité (recto)</Label>
                          <AutofillInput
                            id="carteIdentiteRecto"
                            value={formData.carteIdentiteRectoUrl}
                            onChange={(e) => updateField('carteIdentiteRectoUrl', e.target.value)}
                            placeholder="URL de l'image recto"
                            autofilled={autofilledFields.has('carteIdentiteRectoUrl')}
                          />
                          <p className="text-xs text-gray-500 mt-1">Téléchargement d'images à venir</p>
                        </div>
                        <div>
                          <Label htmlFor="carteIdentiteVerso">Carte d'identité (verso)</Label>
                          <AutofillInput
                            id="carteIdentiteVerso"
                            value={formData.carteIdentiteVersoUrl}
                            onChange={(e) => updateField('carteIdentiteVersoUrl', e.target.value)}
                            placeholder="URL de l'image verso"
                            autofilled={autofilledFields.has('carteIdentiteVersoUrl')}
                          />
                          <p className="text-xs text-gray-500 mt-1">Téléchargement d'images à venir</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Adresse actuelle */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Adresse actuelle
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="rue">Rue et numéro *</Label>
                        <AutofillInput
                          id="rue"
                          value={formData.rue}
                          onChange={(e) => updateField('rue', e.target.value)}
                          placeholder="Rue de la Gare 15"
                          autofilled={autofilledFields.has('rue')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="npa">NPA *</Label>
                        <AutofillInput
                          id="npa"
                          value={formData.npa}
                          onChange={(e) => updateField('npa', e.target.value)}
                          placeholder="1000"
                          autofilled={autofilledFields.has('npa')}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Label htmlFor="ville">Ville *</Label>
                        <AutofillInput
                          id="ville"
                          value={formData.ville}
                          onChange={(e) => updateField('ville', e.target.value)}
                          placeholder="Lausanne"
                          autofilled={autofilledFields.has('ville')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      Coordonnées de contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <AutofillInput
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="jean.dupont@example.com"
                          autofilled={autofilledFields.has('email')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <AutofillInput
                          id="telephone"
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => updateField('telephone', e.target.value)}
                          placeholder="+41 21 123 45 67"
                          autofilled={autofilledFields.has('telephone')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="langue">Langue *</Label>
                        <select
                          id="langue"
                          value={formData.langue}
                          onChange={(e) => updateField('langue', e.target.value)}
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${autofilledFields.has('langue') ? 'border-green-300 bg-green-50' : ''}`}
                        >
                          <option value="">Sélectionnez...</option>
                          <option value="francais">Français</option>
                          <option value="allemand">Allemand</option>
                          <option value="italien">Italien</option>
                          <option value="romanche">Romanche</option>
                          <option value="anglais">Anglais</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Informations optionnelles */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      Informations complémentaires (optionnel)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="anciennesAdresses" className="flex items-center gap-1">
                          Anciennes adresses
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Aide à retrouver d'anciens comptes</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          id="anciennesAdresses"
                          value={formData.anciennesAdresses}
                          onChange={(e) => updateField('anciennesAdresses', e.target.value)}
                          placeholder="Ex: Rue du Marché 10, 1003 Lausanne"
                        />
                      </div>
                      <div>
                        <Label htmlFor="anciensEmployeurs" className="flex items-center gap-1">
                          Anciens employeurs
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Facilite l'identification des institutions</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          id="anciensEmployeurs"
                          value={formData.anciensEmployeurs}
                          onChange={(e) => updateField('anciensEmployeurs', e.target.value)}
                          placeholder="Ex: Entreprise SA (2015-2018), Société B (2010-2015)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Consentements */}
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Consentements requis
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consentRecherche"
                          checked={formData.consentementRecherche}
                          onCheckedChange={(checked) => updateField('consentementRecherche', checked as boolean)}
                        />
                        <label htmlFor="consentRecherche" className="text-sm leading-tight cursor-pointer">
                          J'autorise Aurore Finance à effectuer une recherche d'avoirs LPP en mon nom auprès de la Centrale du 2ème pilier *
                        </label>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consentDonnees"
                          checked={formData.consentementDonnees}
                          onCheckedChange={(checked) => updateField('consentementDonnees', checked as boolean)}
                        />
                        <label htmlFor="consentDonnees" className="text-sm leading-tight cursor-pointer">
                          J'autorise le traitement de mes données personnelles conformément à la loi fédérale sur la protection des données (LPD) *
                        </label>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consentSignature"
                          checked={formData.consentementSignature}
                          onCheckedChange={(checked) => updateField('consentementSignature', checked as boolean)}
                        />
                        <label htmlFor="consentSignature" className="text-sm leading-tight cursor-pointer">
                          J'accepte que ma signature digitale ait la même valeur légale qu'une signature manuscrite pour cette demande *
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={generateProcuration}
                    disabled={!isFormValid() || isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                  >
                    {isGenerating ? (
                      <>Génération de la procuration...</>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        Générer la procuration
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* ÉTAPE 2: Vérification */}
            {step === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Vérification de la procuration
                  </CardTitle>
                  <CardDescription>
                    Veuillez vérifier attentivement toutes les informations avant de signer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Document de procuration */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-6 space-y-4">
                    <div className="text-center border-b pb-4">
                      <h2 className="text-xl font-bold">PROCURATION</h2>
                      <p className="text-sm text-gray-600">Recherche d'avoirs auprès de la Centrale du 2ème pilier</p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <p className="font-semibold">Je soussigné(e) :</p>
                      <div className="pl-4 space-y-1">
                        <p><span className="font-semibold">Nom :</span> {formData.nom}</p>
                        <p><span className="font-semibold">Prénom :</span> {formData.prenom}</p>
                        <p><span className="font-semibold">Date de naissance :</span> {new Date(formData.dateNaissance).toLocaleDateString('fr-CH')}</p>
                        <p><span className="font-semibold">Numéro AVS :</span> {formData.numeroAVS}</p>
                        <p><span className="font-semibold">Adresse :</span> {formData.rue}, {formData.npa} {formData.ville}</p>
                        <p><span className="font-semibold">Email :</span> {formData.email}</p>
                        <p><span className="font-semibold">Téléphone :</span> {formData.telephone}</p>
                      </div>

                      {formData.anciennesAdresses && (
                        <div className="pl-4">
                          <p><span className="font-semibold">Anciennes adresses :</span> {formData.anciennesAdresses}</p>
                        </div>
                      )}

                      {formData.anciensEmployeurs && (
                        <div className="pl-4">
                          <p><span className="font-semibold">Anciens employeurs :</span> {formData.anciensEmployeurs}</p>
                        </div>
                      )}

                      <p className="pt-4">
                        Donne par la présente procuration à <span className="font-semibold">Aurore Finance</span> pour effectuer en mon nom une recherche d'avoirs de libre passage auprès de la Centrale du 2ème pilier (Stiftung Auffangeinrichtung BVG).
                      </p>

                      <p>
                        J'autorise la Centrale du 2ème pilier à communiquer directement à Aurore Finance les informations relatives aux institutions de prévoyance ou de libre passage détenant des avoirs à mon nom.
                      </p>

                      <p>
                        Cette procuration est valable pour une durée de 12 mois à compter de sa signature.
                      </p>

                      <div className="pt-4 text-xs text-gray-600">
                        <p>Conformément à la loi fédérale sur la protection des données (LPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 text-sm">
                      <p className="font-semibold">Date : {new Date().toLocaleDateString('fr-CH')}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep('form')}
                      variant="outline"
                      className="flex-1"
                    >
                      Modifier
                    </Button>
                    <Button
                      onClick={signDocument}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      Signer digitalement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ÉTAPE 3: Signature */}
            {step === 'signature' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    Document signé avec succès
                  </CardTitle>
                  <CardDescription>
                    Votre procuration a été signée digitalement et est prête à être envoyée
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-green-900">Signature digitale validée</h3>
                        <p className="text-sm text-green-700">
                          Votre procuration a été signée avec succès le {new Date().toLocaleDateString('fr-CH')} à {new Date().toLocaleTimeString('fr-CH')}.
                        </p>
                        <div className="bg-white rounded p-3 mt-3">
                          <p className="text-xs text-gray-600 font-mono break-all">
                            ID de signature : {signatureData}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-2">Prochaines étapes :</p>
                        <ul className="space-y-1">
                          <li>1. Envoi automatique à la Centrale du 2ème pilier</li>
                          <li>2. Traitement de votre demande (5-10 jours ouvrables)</li>
                          <li>3. Notification par email dès que vos avoirs sont identifiés</li>
                          <li>4. Possibilité de rapatrier vos avoirs digitalement</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep('review')}
                      variant="outline"
                      className="flex-1"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={generateDocuments}
                      disabled={isGenerating}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5 mr-2" />
                          Générer les documents
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ÉTAPE 4: Documents générés */}
            {step === 'documents' && (
              <LPPDocumentGenerator
                formData={{
                  prenom: formData.prenom,
                  nom: formData.nom,
                  dateNaissance: formData.dateNaissance,
                  numeroAVS: formData.numeroAVS,
                  genre: formData.genre,
                  nationalite: formData.nationalite,
                  rue: formData.rue,
                  npa: formData.npa,
                  ville: formData.ville,
                  email: formData.email,
                  telephone: formData.telephone,
                  langue: formData.langue,
                  caissePension: formData.caissePension,
                  anciennesAdresses: formData.anciennesAdresses,
                  anciensEmployeurs: formData.anciensEmployeurs,
                }}
                onBack={() => setStep('signature')}
                onDownload={downloadDocuments}
              />
            )}
          </div>
        </div>
      </TooltipProvider>
    </ProtectedRoute>
  );
}

// Composant helper pour les champs avec indicateur d'autocomplétion
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
