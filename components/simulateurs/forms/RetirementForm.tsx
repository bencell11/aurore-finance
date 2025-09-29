'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RetraiteParameters } from '@/types/simulators';
import { Canton } from '@/types/user';
import { RetirementCalculator } from '@/lib/calculators/retirement-calculator';
import { 
  Shield, 
  User, 
  Banknote, 
  PieChart,
  TrendingUp,
  Target,
  Info,
  AlertTriangle,
  Calendar,
  Calculator,
  Building2,
  Clock
} from 'lucide-react';

interface RetirementFormProps {
  onCalculate: (results: any) => void;
  onDataChange: (data: Partial<RetraiteParameters>) => void;
  initialData?: Partial<RetraiteParameters>;
}

export default function RetirementForm({ 
  onCalculate, 
  onDataChange, 
  initialData = {} 
}: RetirementFormProps) {
  const [formData, setFormData] = useState<Partial<RetraiteParameters>>({
    age: 35,
    ageRetraitePrevu: 65,
    revenuActuel: 85000,
    canton: { code: 'GE', nom: 'Genève', tauxImposition: { revenu: 0.25, fortune: 0.5 } },
    situationFamiliale: 'celibataire',
    anneeCotisation: 10,
    lacunesAVS: 0,
    capitalPilier2Actuel: 50000,
    cotisationsMensuelles: 600,
    salaireAssure: 85000,
    planPrevoyance: 'minimal',
    pilier3aActuel: 15000,
    versementAnnuel3a: 5000,
    pilier3bActuel: 0,
    versementAnnuel3b: 0,
    revenuSouhaiteRetraite: 80,
    heritagePrevu: 0,
    chargesFamiliales: 0,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof RetraiteParameters, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.age || formData.age < 18 || formData.age > 70) {
      newErrors.age = 'L\'âge doit être entre 18 et 70 ans';
    }
    
    if (!formData.ageRetraitePrevu || formData.ageRetraitePrevu <= formData.age! || formData.ageRetraitePrevu > 75) {
      newErrors.ageRetraitePrevu = 'L\'âge de retraite doit être supérieur à votre âge actuel et inférieur à 75 ans';
    }
    
    if (!formData.revenuActuel || formData.revenuActuel <= 0) {
      newErrors.revenuActuel = 'Le revenu actuel est requis';
    }
    
    if (!formData.anneeCotisation || formData.anneeCotisation < 0) {
      newErrors.anneeCotisation = 'Le nombre d\'années de cotisation est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    
    try {
      const calculator = new RetirementCalculator();
      const results = calculator.calculate(formData as RetraiteParameters);
      onCalculate(results);
    } catch (error) {
      console.error('Erreur de calcul:', error);
      setErrors({ general: 'Erreur lors du calcul. Vérifiez vos données.' });
    }
  };

  const anneesJusquRetraite = formData.ageRetraitePrevu && formData.age ? 
    formData.ageRetraitePrevu - formData.age : 0;

  const maximalContribution3a = 7056; // 2024

  const currentPillar3aGap = maximalContribution3a - (formData.versementAnnuel3a || 0);

  const estimatedAVSPension = () => {
    if (!formData.revenuActuel) return 0;
    
    const maxPension = 2450 * 12; // CHF/year
    const minPension = 1225 * 12;
    
    let factor = 1;
    if (formData.revenuActuel < 30000) factor = 0.6;
    else if (formData.revenuActuel < 60000) factor = 0.8;
    
    return Math.max(minPension, maxPension * factor);
  };

  return (
    <div className="space-y-6 pb-24">
      <Tabs defaultValue="profil" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profil" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="pilier1" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>1er pilier</span>
          </TabsTrigger>
          <TabsTrigger value="pilier2" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>2e pilier</span>
          </TabsTrigger>
          <TabsTrigger value="pilier3" className="flex items-center space-x-2">
            <PieChart className="w-4 h-4" />
            <span>3e pilier</span>
          </TabsTrigger>
          <TabsTrigger value="objectifs" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Objectifs</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profil" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Situation personnelle</span>
              </CardTitle>
              <CardDescription>
                Informations de base pour calculer vos droits à la retraite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">
                    Âge actuel *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleInputChange('age', Number(e.target.value))}
                    placeholder="35"
                    min="18"
                    max="70"
                  />
                  {errors.age && (
                    <p className="text-sm text-red-600">{errors.age}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageRetraitePrevu">
                    Âge de retraite souhaité *
                  </Label>
                  <Input
                    id="ageRetraitePrevu"
                    type="number"
                    value={formData.ageRetraitePrevu || ''}
                    onChange={(e) => handleInputChange('ageRetraitePrevu', Number(e.target.value))}
                    placeholder="65"
                    min="58"
                    max="75"
                  />
                  {errors.ageRetraitePrevu && (
                    <p className="text-sm text-red-600">{errors.ageRetraitePrevu}</p>
                  )}
                  {anneesJusquRetraite > 0 && (
                    <p className="text-sm text-blue-600">
                      {anneesJusquRetraite} années jusqu'à la retraite
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenuActuel">
                    Revenu annuel brut *
                  </Label>
                  <div className="relative">
                    <Input
                      id="revenuActuel"
                      type="number"
                      value={formData.revenuActuel || ''}
                      onChange={(e) => handleInputChange('revenuActuel', Number(e.target.value))}
                      placeholder="85000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  {errors.revenuActuel && (
                    <p className="text-sm text-red-600">{errors.revenuActuel}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Canton de résidence</Label>
                  <Select
                    value={formData.canton?.code}
                    onValueChange={(value) => {
                      const cantonData = { code: value, nom: value, tauxImposition: { revenu: 0.25, fortune: 0.5 } };
                      handleInputChange('canton', cantonData as Canton);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GE">Genève (GE)</SelectItem>
                      <SelectItem value="VD">Vaud (VD)</SelectItem>
                      <SelectItem value="ZH">Zurich (ZH)</SelectItem>
                      <SelectItem value="BE">Berne (BE)</SelectItem>
                      <SelectItem value="BS">Bâle-Ville (BS)</SelectItem>
                      <SelectItem value="ZG">Zoug (ZG)</SelectItem>
                      <SelectItem value="AG">Argovie (AG)</SelectItem>
                      <SelectItem value="TI">Tessin (TI)</SelectItem>
                      <SelectItem value="LU">Lucerne (LU)</SelectItem>
                      <SelectItem value="FR">Fribourg (FR)</SelectItem>
                      <SelectItem value="SG">Saint-Gall (SG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Situation familiale</Label>
                  <Select
                    value={formData.situationFamiliale}
                    onValueChange={(value) => handleInputChange('situationFamiliale', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celibataire">Célibataire</SelectItem>
                      <SelectItem value="marie">Marié(e)</SelectItem>
                      <SelectItem value="concubinage">Concubinage</SelectItem>
                      <SelectItem value="divorce">Divorcé(e)</SelectItem>
                      <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Estimation rapide</p>
                    <p>
                      Avec votre profil actuel, votre rente AVS estimée serait d'environ{' '}
                      <span className="font-bold">{estimatedAVSPension().toLocaleString('fr-CH')} CHF/an</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 1er pilier */}
        <TabsContent value="pilier1" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>1er pilier - AVS</span>
              </CardTitle>
              <CardDescription>
                Prévoyance étatique obligatoire - rente AVS et éventuelles lacunes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="anneeCotisation">
                    Années de cotisation AVS *
                  </Label>
                  <Input
                    id="anneeCotisation"
                    type="number"
                    value={formData.anneeCotisation || ''}
                    onChange={(e) => handleInputChange('anneeCotisation', Number(e.target.value))}
                    placeholder="10"
                    min="0"
                    max="50"
                  />
                  {errors.anneeCotisation && (
                    <p className="text-sm text-red-600">{errors.anneeCotisation}</p>
                  )}
                  <p className="text-xs text-gray-600">
                    Années déjà cotisées depuis le début de votre activité
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lacunesAVS">
                    Lacunes AVS connues
                  </Label>
                  <Input
                    id="lacunesAVS"
                    type="number"
                    value={formData.lacunesAVS || ''}
                    onChange={(e) => handleInputChange('lacunesAVS', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    max="10"
                  />
                  <p className="text-xs text-gray-600">
                    Années où vous n'avez pas cotisé (études, étranger, etc.)
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">À savoir sur l'AVS</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Rente maximale 2024: 2'450 CHF/mois (29'400 CHF/an)</li>
                      <li>Rente minimale 2024: 1'225 CHF/mois (14'700 CHF/an)</li>
                      <li>44 années de cotisation requises pour la rente complète</li>
                      <li>Chaque année manquante réduit la rente de ~2.3%</li>
                    </ul>
                  </div>
                </div>
              </div>

              {formData.lacunesAVS && formData.lacunesAVS > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <p className="font-medium mb-1">Attention aux lacunes AVS</p>
                      <p>
                        Vos {formData.lacunesAVS} années de lacunes pourraient réduire votre rente AVS 
                        d'environ {(formData.lacunesAVS * 2.3).toFixed(1)}%. 
                        Vous pouvez racheter ces lacunes jusqu'à 5 ans après leur apparition.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 2e pilier */}
        <TabsContent value="pilier2" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span>2e pilier - LPP</span>
              </CardTitle>
              <CardDescription>
                Prévoyance professionnelle - caisse de pension de votre employeur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capitalPilier2Actuel">
                    Capital LPP actuel
                  </Label>
                  <div className="relative">
                    <Input
                      id="capitalPilier2Actuel"
                      type="number"
                      value={formData.capitalPilier2Actuel || ''}
                      onChange={(e) => handleInputChange('capitalPilier2Actuel', Number(e.target.value))}
                      placeholder="50000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Montant indiqué sur votre certificat LPP
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cotisationsMensuelles">
                    Cotisations mensuelles LPP
                  </Label>
                  <div className="relative">
                    <Input
                      id="cotisationsMensuelles"
                      type="number"
                      value={formData.cotisationsMensuelles || ''}
                      onChange={(e) => handleInputChange('cotisationsMensuelles', Number(e.target.value))}
                      placeholder="600"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Employé + employeur (total des cotisations)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaireAssure">
                    Salaire assuré LPP
                  </Label>
                  <div className="relative">
                    <Input
                      id="salaireAssure"
                      type="number"
                      value={formData.salaireAssure || ''}
                      onChange={(e) => handleInputChange('salaireAssure', Number(e.target.value))}
                      placeholder="85000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Généralement égal au salaire brut (max. 88'200 CHF)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Plan de prévoyance</Label>
                  <Select
                    value={formData.planPrevoyance}
                    onValueChange={(value) => handleInputChange('planPrevoyance', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal (obligatoire)</SelectItem>
                      <SelectItem value="enveloppant">Enveloppant</SelectItem>
                      <SelectItem value="surobligatoire">Surobligatoire</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600">
                    Type de plan offert par votre employeur
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="text-sm text-purple-800">
                    <p className="font-medium mb-1">Optimisation du 2e pilier</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Vérifiez vos possibilités de rachats pour réduire vos impôts</li>
                      <li>Taux de conversion 2024: 6.8% à 65 ans (en baisse progressive)</li>
                      <li>Capitaux ou rente: évaluez les options à l'âge de la retraite</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 3e pilier */}
        <TabsContent value="pilier3" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-orange-600" />
                <span>3e pilier - Prévoyance privée</span>
              </CardTitle>
              <CardDescription>
                Épargne volontaire pour optimiser votre retraite et vos impôts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pilier3aActuel">
                    Capital 3e pilier A actuel
                  </Label>
                  <div className="relative">
                    <Input
                      id="pilier3aActuel"
                      type="number"
                      value={formData.pilier3aActuel || ''}
                      onChange={(e) => handleInputChange('pilier3aActuel', Number(e.target.value))}
                      placeholder="15000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Somme de tous vos comptes 3a
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="versementAnnuel3a">
                    Versements annuels 3e pilier A
                    {currentPillar3aGap > 0 && (
                      <Badge variant="outline" className="ml-2">
                        Gap: {currentPillar3aGap.toLocaleString('fr-CH')} CHF
                      </Badge>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="versementAnnuel3a"
                      type="number"
                      value={formData.versementAnnuel3a || ''}
                      onChange={(e) => handleInputChange('versementAnnuel3a', Number(e.target.value))}
                      placeholder="5000"
                      className="pr-12"
                      max={maximalContribution3a}
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Maximum 2024: {maximalContribution3a.toLocaleString('fr-CH')} CHF</span>
                    {formData.versementAnnuel3a && (
                      <span>{((formData.versementAnnuel3a / maximalContribution3a) * 100).toFixed(0)}% du max</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pilier3bActuel">
                    Capital 3e pilier B actuel
                  </Label>
                  <div className="relative">
                    <Input
                      id="pilier3bActuel"
                      type="number"
                      value={formData.pilier3bActuel || ''}
                      onChange={(e) => handleInputChange('pilier3bActuel', Number(e.target.value))}
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Assurance-vie, comptes titres, épargne libre
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="versementAnnuel3b">
                    Versements annuels 3e pilier B
                  </Label>
                  <div className="relative">
                    <Input
                      id="versementAnnuel3b"
                      type="number"
                      value={formData.versementAnnuel3b || ''}
                      onChange={(e) => handleInputChange('versementAnnuel3b', Number(e.target.value))}
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Épargne libre sans limitation de montant
                  </p>
                </div>
              </div>

              {currentPillar3aGap > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Opportunité d'optimisation</p>
                      <p>
                        Vous pourriez augmenter vos versements de{' '}
                        <span className="font-bold">{currentPillar3aGap.toLocaleString('fr-CH')} CHF</span> 
                        {' '}pour maximiser vos déductions fiscales.
                        {formData.revenuActuel && (
                          <span>
                            {' '}Économie d'impôts estimée: {' '}
                            <span className="font-bold">
                              {(currentPillar3aGap * 0.25).toLocaleString('fr-CH')} CHF/an
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">Comparaison 3a vs 3b</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-orange-800 mb-1">3e pilier A (lié)</h5>
                    <ul className="text-orange-700 space-y-1">
                      <li>• Déductible des impôts</li>
                      <li>• Montant plafonné</li>
                      <li>• Retrait limité (achat logement, départ étranger...)</li>
                      <li>• Imposition réduite au retrait</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-orange-800 mb-1">3e pilier B (libre)</h5>
                    <ul className="text-orange-700 space-y-1">
                      <li>• Non déductible des impôts</li>
                      <li>• Pas de limitation de montant</li>
                      <li>• Libre disposition</li>
                      <li>• Imposition selon le type de placement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Objectifs */}
        <TabsContent value="objectifs" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-red-600" />
                <span>Objectifs de retraite</span>
              </CardTitle>
              <CardDescription>
                Définissez vos besoins financiers pour la retraite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="revenuSouhaiteRetraite">
                    Revenu souhaité à la retraite
                    <Badge variant="outline" className="ml-2">
                      {formData.revenuSouhaiteRetraite || 80}% du revenu actuel
                    </Badge>
                  </Label>
                  <div className="px-3">
                    <Slider
                      value={[formData.revenuSouhaiteRetraite || 80]}
                      onValueChange={(value) => handleInputChange('revenuSouhaiteRetraite', value[0])}
                      max={120}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>50%</span>
                      <span className="font-medium">
                        {formData.revenuSouhaiteRetraite || 80}% 
                        {formData.revenuActuel && (
                          <span className="ml-1">
                            ({Math.round((formData.revenuActuel * (formData.revenuSouhaiteRetraite || 80)) / 100).toLocaleString('fr-CH')} CHF/an)
                          </span>
                        )}
                      </span>
                      <span>120%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    La plupart des experts recommandent 70-80% du revenu pré-retraite
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heritagePrevu">
                      Héritage prévu (optionnel)
                    </Label>
                    <div className="relative">
                      <Input
                        id="heritagePrevu"
                        type="number"
                        value={formData.heritagePrevu || ''}
                        onChange={(e) => handleInputChange('heritagePrevu', Number(e.target.value))}
                        placeholder="0"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Montant que vous pensez hériter
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chargesFamiliales">
                      Charges familiales prévues
                    </Label>
                    <div className="relative">
                      <Input
                        id="chargesFamiliales"
                        type="number"
                        value={formData.chargesFamiliales || ''}
                        onChange={(e) => handleInputChange('chargesFamiliales', Number(e.target.value))}
                        placeholder="0"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF/an</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Soutien famille, frais médicaux, etc.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Planning temporel</p>
                    <div className="space-y-1">
                      <p>• Aujourd'hui: {formData.age} ans</p>
                      <p>• Retraite prévue: {formData.ageRetraitePrevu} ans</p>
                      <p>• Temps de cotisation restant: {anneesJusquRetraite} années</p>
                      <p>• Durée de retraite estimée: ~{85 - (formData.ageRetraitePrevu || 65)} années</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Facteurs à considérer</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Inflation: réduira le pouvoir d'achat (~2%/an)</li>
                      <li>Frais de santé: généralement plus élevés avec l'âge</li>
                      <li>Mode de vie: voyages, loisirs, activités prévues</li>
                      <li>Logement: propriétaire ou locataire à la retraite</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {errors.general && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <p>{errors.general}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bouton de calcul */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-lg py-6"
            size="lg"
          >
            <Shield className="w-5 h-5 mr-2" />
            Analyser ma prévoyance retraite
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}