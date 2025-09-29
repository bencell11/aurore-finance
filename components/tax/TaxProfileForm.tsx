'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Banknote, Shield, Building, CheckCircle2, AlertCircle } from 'lucide-react';

interface TaxProfileFormProps {
  profile: any;
  onUpdate: (profile: any) => void;
  onError: (error: string) => void;
}

export function TaxProfileForm({ profile, onUpdate, onError }: TaxProfileFormProps) {
  const [formData, setFormData] = useState({
    personalInfo: {
      canton: '',
      civilStatus: '',
      numberOfChildren: 0,
      commune: '',
      confession: ''
    },
    incomeData: {
      mainEmployment: {
        employer: '',
        grossSalary: 0
      },
      rentalIncome: 0,
      pensionIncome: {
        avsRente: 0
      },
      unemploymentBenefits: 0
    },
    deductions: {
      professionalExpenses: {
        transportCosts: 0,
        mealCosts: 0,
        otherProfessionalExpenses: 0
      },
      insurancePremiums: {
        healthInsurance: 0,
        lifeInsurance: 0
      },
      savingsContributions: {
        pillar3a: 0,
        pillar3b: 0
      },
      childcareExpenses: 0,
      donationsAmount: 0
    },
    assets: {
      bankAccounts: [],
      totalWealth: 0
    },
    realEstate: []
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Charger les données du profil existant
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        ...profile
      }));
    }
  }, [profile]);

  const cantons = [
    { value: 'AG', label: 'Argovie (AG)' },
    { value: 'AI', label: 'Appenzell Rhodes-Intérieures (AI)' },
    { value: 'AR', label: 'Appenzell Rhodes-Extérieures (AR)' },
    { value: 'BE', label: 'Berne (BE)' },
    { value: 'BL', label: 'Bâle-Campagne (BL)' },
    { value: 'BS', label: 'Bâle-Ville (BS)' },
    { value: 'FR', label: 'Fribourg (FR)' },
    { value: 'GE', label: 'Genève (GE)' },
    { value: 'GL', label: 'Glaris (GL)' },
    { value: 'GR', label: 'Grisons (GR)' },
    { value: 'JU', label: 'Jura (JU)' },
    { value: 'LU', label: 'Lucerne (LU)' },
    { value: 'NE', label: 'Neuchâtel (NE)' },
    { value: 'NW', label: 'Nidwald (NW)' },
    { value: 'OW', label: 'Obwald (OW)' },
    { value: 'SG', label: 'Saint-Gall (SG)' },
    { value: 'SH', label: 'Schaffhouse (SH)' },
    { value: 'SO', label: 'Soleure (SO)' },
    { value: 'SZ', label: 'Schwyz (SZ)' },
    { value: 'TG', label: 'Thurgovie (TG)' },
    { value: 'TI', label: 'Tessin (TI)' },
    { value: 'UR', label: 'Uri (UR)' },
    { value: 'VD', label: 'Vaud (VD)' },
    { value: 'VS', label: 'Valais (VS)' },
    { value: 'ZG', label: 'Zoug (ZG)' },
    { value: 'ZH', label: 'Zurich (ZH)' }
  ];

  const civilStatuses = [
    { value: 'single', label: 'Célibataire' },
    { value: 'married', label: 'Marié(e)' },
    { value: 'divorced', label: 'Divorcé(e)' },
    { value: 'widowed', label: 'Veuf/Veuve' },
    { value: 'separated', label: 'Séparé(e)' },
    { value: 'registered_partnership', label: 'Partenariat enregistré' }
  ];

  const confessions = [
    { value: 'none', label: 'Sans confession' },
    { value: 'protestant', label: 'Protestant' },
    { value: 'catholic', label: 'Catholique' },
    { value: 'other', label: 'Autre' }
  ];

  const updateField = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const updateNestedField = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...((prev[section as keyof typeof prev] as any)?.[subsection] || {}),
          [field]: value
        }
      }
    }));
  };

  const validateSection = (section: string): boolean => {
    const errors: Record<string, string> = {};

    switch (section) {
      case 'personal':
        if (!formData.personalInfo.canton) {
          errors.canton = 'Le canton est requis';
        }
        if (!formData.personalInfo.civilStatus) {
          errors.civilStatus = 'La situation familiale est requise';
        }
        break;

      case 'income':
        if (formData.incomeData.mainEmployment.grossSalary < 0) {
          errors.grossSalary = 'Le salaire ne peut pas être négatif';
        }
        break;

      case 'deductions':
        if (formData.deductions.savingsContributions.pillar3a > 7056) {
          errors.pillar3a = 'Le montant maximum pour le 3e pilier A est de 7\'056 CHF';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveSection = async (section: string) => {
    if (!validateSection(section)) {
      return;
    }

    // Mapper les noms de sections du frontend vers le backend
    const sectionMapping: Record<string, string> = {
      'personal': 'personalInfo',
      'income': 'incomeData',
      'deductions': 'deductions',
      'assets': 'assets'
    };

    const backendSection = sectionMapping[section] || section;

    setLoading(true);
    try {
      const response = await fetch('/api/tax/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: backendSection,
          data: formData[backendSection as keyof typeof formData]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      onUpdate({ ...formData, completionStatus: data.completionStatus });
      
    } catch (error) {
      console.error('Erreur détaillée:', error);
      onError('Erreur lors de la sauvegarde: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveAllData = async () => {
    // Valider toutes les sections
    const sections = ['personal', 'income', 'deductions', 'assets'];
    const allValid = sections.every(section => validateSection(section));

    if (!allValid) {
      onError('Veuillez corriger les erreurs dans les différentes sections');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/tax/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      onUpdate({ ...formData, id: data.profileId, completionStatus: data.completionStatus });
      
    } catch (error) {
      console.error('Erreur sauvegarde complète:', error);
      onError('Erreur lors de la sauvegarde: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionBadge = (completed: boolean) => (
    <Badge variant={completed ? "default" : "secondary"} className="ml-2">
      {completed ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
      {completed ? 'Complet' : 'À compléter'}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personnel
            {profile?.completionStatus?.sections?.personalInfo && getCompletionBadge(profile.completionStatus.sections.personalInfo)}
          </TabsTrigger>
          <TabsTrigger value="income" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            Revenus
            {profile?.completionStatus?.sections?.income && getCompletionBadge(profile.completionStatus.sections.income)}
          </TabsTrigger>
          <TabsTrigger value="deductions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Déductions
            {profile?.completionStatus?.sections?.deductions && getCompletionBadge(profile.completionStatus.sections.deductions)}
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Patrimoine
            {profile?.completionStatus?.sections?.assets && getCompletionBadge(profile.completionStatus.sections.assets)}
          </TabsTrigger>
        </TabsList>

        {/* Section Informations personnelles */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Ces informations déterminent votre cadre fiscal cantonal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="canton">Canton de domicile *</Label>
                  <Select 
                    value={formData.personalInfo.canton} 
                    onValueChange={(value) => updateField('personalInfo', 'canton', value)}
                  >
                    <SelectTrigger className={validationErrors.canton ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionner un canton" />
                    </SelectTrigger>
                    <SelectContent>
                      {cantons.map(canton => (
                        <SelectItem key={canton.value} value={canton.value}>
                          {canton.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.canton && (
                    <p className="text-sm text-red-600">{validationErrors.canton}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commune">Commune</Label>
                  <Input
                    id="commune"
                    value={formData.personalInfo.commune}
                    onChange={(e) => updateField('personalInfo', 'commune', e.target.value)}
                    placeholder="Nom de votre commune"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="civilStatus">Situation familiale *</Label>
                  <Select 
                    value={formData.personalInfo.civilStatus} 
                    onValueChange={(value) => updateField('personalInfo', 'civilStatus', value)}
                  >
                    <SelectTrigger className={validationErrors.civilStatus ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {civilStatuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.civilStatus && (
                    <p className="text-sm text-red-600">{validationErrors.civilStatus}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfChildren">Nombre d'enfants à charge</Label>
                  <Input
                    id="numberOfChildren"
                    type="number"
                    min="0"
                    value={formData.personalInfo.numberOfChildren}
                    onChange={(e) => updateField('personalInfo', 'numberOfChildren', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confession">Confession religieuse</Label>
                <Select 
                  value={formData.personalInfo.confession} 
                  onValueChange={(value) => updateField('personalInfo', 'confession', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {confessions.map(confession => (
                      <SelectItem key={confession.value} value={confession.value}>
                        {confession.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Influence le calcul de l'impôt ecclésiastique
                </p>
              </div>

              <Button onClick={() => saveSection('personal')} disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder les informations personnelles'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Revenus */}
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenus d'activité lucrative</CardTitle>
              <CardDescription>
                Entrez uniquement votre salaire brut - les autres valeurs seront calculées automatiquement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employer">Employeur principal</Label>
                <Input
                  id="employer"
                  value={formData.incomeData.mainEmployment.employer}
                  onChange={(e) => updateNestedField('incomeData', 'mainEmployment', 'employer', e.target.value)}
                  placeholder="Nom de votre employeur"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grossSalary">Salaire brut annuel (CHF) *</Label>
                  <Input
                    id="grossSalary"
                    type="number"
                    min="0"
                    value={formData.incomeData.mainEmployment.grossSalary}
                    onChange={(e) => updateNestedField('incomeData', 'mainEmployment', 'grossSalary', parseFloat(e.target.value) || 0)}
                    className={validationErrors.grossSalary ? 'border-red-500' : ''}
                    placeholder="Entrez votre salaire brut annuel"
                  />
                  {validationErrors.grossSalary && (
                    <p className="text-sm text-red-600">{validationErrors.grossSalary}</p>
                  )}
                  <p className="text-xs text-gray-600">
                    Salaire avant toute déduction sociale ou fiscale (certificat de salaire)
                  </p>
                </div>

                {formData.incomeData.mainEmployment.grossSalary > 0 && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="space-y-2">
                      <Label className="text-sm text-blue-600 font-medium">Salaire net (calculé)</Label>
                      <div className="bg-white border border-blue-200 rounded p-3">
                        <div className="text-lg font-semibold text-blue-700">
                          {(formData.incomeData.mainEmployment.grossSalary * 0.821).toLocaleString('fr-CH')} CHF
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Après déductions sociales (~17.9%)
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-purple-600 font-medium">Revenu imposable (estimé)</Label>
                      <div className="bg-white border border-purple-200 rounded p-3">
                        <div className="text-lg font-semibold text-purple-700">
                          {Math.max(0, formData.incomeData.mainEmployment.grossSalary - 2000).toLocaleString('fr-CH')} CHF
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          Après déductions fiscales minimales
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Autres revenus</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rentalIncome">Revenus locatifs (CHF)</Label>
                    <Input
                      id="rentalIncome"
                      type="number"
                      min="0"
                      value={formData.incomeData.rentalIncome}
                      onChange={(e) => updateField('incomeData', 'rentalIncome', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avsRente">Rente AVS (CHF)</Label>
                    <Input
                      id="avsRente"
                      type="number"
                      min="0"
                      value={formData.incomeData.pensionIncome.avsRente}
                      onChange={(e) => updateNestedField('incomeData', 'pensionIncome', 'avsRente', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unemploymentBenefits">Allocations chômage (CHF)</Label>
                  <Input
                    id="unemploymentBenefits"
                    type="number"
                    min="0"
                    value={formData.incomeData.unemploymentBenefits}
                    onChange={(e) => updateField('incomeData', 'unemploymentBenefits', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <Button onClick={() => saveSection('income')} disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder les revenus'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Déductions */}
        <TabsContent value="deductions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Déductions fiscales</CardTitle>
              <CardDescription>
                Optimisez vos impôts avec les déductions légales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prévoyance */}
              <div className="space-y-4">
                <h4 className="font-medium text-blue-900">💰 Prévoyance et épargne</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pillar3a">3e pilier A (CHF)</Label>
                    <Input
                      id="pillar3a"
                      type="number"
                      min="0"
                      max="7056"
                      value={formData.deductions.savingsContributions.pillar3a}
                      onChange={(e) => updateNestedField('deductions', 'savingsContributions', 'pillar3a', parseFloat(e.target.value) || 0)}
                      className={validationErrors.pillar3a ? 'border-red-500' : ''}
                    />
                    {validationErrors.pillar3a && (
                      <p className="text-sm text-red-600">{validationErrors.pillar3a}</p>
                    )}
                    <p className="text-xs text-green-600">Maximum déductible: 7'056 CHF</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pillar3b">3e pilier B (CHF)</Label>
                    <Input
                      id="pillar3b"
                      type="number"
                      min="0"
                      value={formData.deductions.savingsContributions.pillar3b}
                      onChange={(e) => updateNestedField('deductions', 'savingsContributions', 'pillar3b', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Frais professionnels */}
              <div className="space-y-4">
                <h4 className="font-medium text-blue-900">🚗 Frais professionnels</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transportCosts">Transport (CHF)</Label>
                    <Input
                      id="transportCosts"
                      type="number"
                      min="0"
                      value={formData.deductions.professionalExpenses.transportCosts}
                      onChange={(e) => updateNestedField('deductions', 'professionalExpenses', 'transportCosts', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mealCosts">Repas (CHF)</Label>
                    <Input
                      id="mealCosts"
                      type="number"
                      min="0"
                      value={formData.deductions.professionalExpenses.mealCosts}
                      onChange={(e) => updateNestedField('deductions', 'professionalExpenses', 'mealCosts', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otherProfessionalExpenses">Autres frais (CHF)</Label>
                    <Input
                      id="otherProfessionalExpenses"
                      type="number"
                      min="0"
                      value={formData.deductions.professionalExpenses.otherProfessionalExpenses}
                      onChange={(e) => updateNestedField('deductions', 'professionalExpenses', 'otherProfessionalExpenses', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Primes d'assurance */}
              <div className="space-y-4">
                <h4 className="font-medium text-blue-900">🏥 Primes d'assurance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="healthInsurance">Assurance maladie (CHF)</Label>
                    <Input
                      id="healthInsurance"
                      type="number"
                      min="0"
                      value={formData.deductions.insurancePremiums.healthInsurance}
                      onChange={(e) => updateNestedField('deductions', 'insurancePremiums', 'healthInsurance', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lifeInsurance">Assurance vie (CHF)</Label>
                    <Input
                      id="lifeInsurance"
                      type="number"
                      min="0"
                      value={formData.deductions.insurancePremiums.lifeInsurance}
                      onChange={(e) => updateNestedField('deductions', 'insurancePremiums', 'lifeInsurance', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Autres déductions */}
              <div className="space-y-4">
                <h4 className="font-medium text-blue-900">📋 Autres déductions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childcareExpenses">Frais de garde (CHF)</Label>
                    <Input
                      id="childcareExpenses"
                      type="number"
                      min="0"
                      value={formData.deductions.childcareExpenses}
                      onChange={(e) => updateField('deductions', 'childcareExpenses', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donationsAmount">Dons déductibles (CHF)</Label>
                    <Input
                      id="donationsAmount"
                      type="number"
                      min="0"
                      value={formData.deductions.donationsAmount}
                      onChange={(e) => updateField('deductions', 'donationsAmount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => saveSection('deductions')} disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder les déductions'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Patrimoine */}
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fortune et patrimoine</CardTitle>
              <CardDescription>
                Déclaration de vos avoirs au 31 décembre
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalWealth">Fortune totale (CHF)</Label>
                <Input
                  id="totalWealth"
                  type="number"
                  min="0"
                  value={formData.assets.totalWealth}
                  onChange={(e) => updateField('assets', 'totalWealth', parseFloat(e.target.value) || 0)}
                />
                <p className="text-sm text-muted-foreground">
                  Incluant comptes bancaires, épargne, titres, crypto-monnaies, etc.
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  La fortune est imposée dans la plupart des cantons suisses. 
                  Une déclaration précise est importante pour éviter les redressements.
                </AlertDescription>
              </Alert>

              <Button onClick={() => saveSection('assets')} disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder le patrimoine'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bouton de sauvegarde complète */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={saveAllData} disabled={loading} size="lg">
          {loading ? 'Sauvegarde en cours...' : 'Sauvegarder tout le profil'}
        </Button>
      </div>
    </div>
  );
}