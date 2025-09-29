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
import { ImpotsParameters } from '@/types/simulators';
import { Canton } from '@/types/user';
import { SwissTaxCalculator } from '@/lib/calculators/swiss-tax-calculator';
import { 
  User, 
  Users, 
  MapPin, 
  Banknote, 
  Calculator, 
  PiggyBank,
  Receipt,
  Info,
  AlertTriangle
} from 'lucide-react';

interface TaxSimulatorFormProps {
  onCalculate: (results: any) => void;
  onDataChange: (data: Partial<ImpotsParameters>) => void;
  initialData?: Partial<ImpotsParameters>;
}

export default function TaxSimulatorForm({ 
  onCalculate, 
  onDataChange, 
  initialData = {} 
}: TaxSimulatorFormProps) {
  const [formData, setFormData] = useState<Partial<ImpotsParameters>>({
    revenuBrutAnnuel: 80000,
    canton: { code: 'GE', nom: 'Genève', tauxImposition: { revenu: 0.25, fortune: 0.5 } },
    situationFamiliale: 'celibataire',
    nombreEnfants: 0,
    fraisProfessionnels: 2000,
    fraisTransport: 1200,
    fraisRepas: 1800,
    fraisFormation: 0,
    pilier3a: 0,
    pilier3b: 0,
    donsCharite: 0,
    fraisMedicaux: 0,
    primesAssuranceMaladie: 4000,
    fortunePrivee: 50000,
    dettes: 0,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ImpotsParameters, value: any) => {
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
    
    if (!formData.revenuBrutAnnuel || formData.revenuBrutAnnuel <= 0) {
      newErrors.revenuBrutAnnuel = 'Le revenu brut annuel est requis';
    }
    
    if (!formData.canton) {
      newErrors.canton = 'Le canton est requis';
    }
    
    if (!formData.situationFamiliale) {
      newErrors.situationFamiliale = 'La situation familiale est requise';
    }
    
    if (formData.pilier3a && formData.pilier3a > 7056) {
      newErrors.pilier3a = 'Le montant maximum du 3e pilier A est de 7\'056 CHF';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    
    try {
      const calculator = new SwissTaxCalculator();
      const results = calculator.calculate(formData as ImpotsParameters);
      onCalculate(results);
    } catch (error) {
      console.error('Erreur de calcul:', error);
      setErrors({ general: 'Erreur lors du calcul. Vérifiez vos données.' });
    }
  };

  const cantonsList = SwissTaxCalculator.getCantonsList();
  
  const maxPilier3a = formData.canton ? 
    SwissTaxCalculator.getDeductionLimits(formData.canton as Canton).pilier3aMax || 7056 : 7056;

  return (
    <div className="space-y-6 pb-24">
      <Tabs defaultValue="revenus" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenus" className="flex items-center space-x-2">
            <Banknote className="w-4 h-4" />
            <span>Revenus</span>
          </TabsTrigger>
          <TabsTrigger value="situation" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Situation</span>
          </TabsTrigger>
          <TabsTrigger value="deductions" className="flex items-center space-x-2">
            <Receipt className="w-4 h-4" />
            <span>Déductions</span>
          </TabsTrigger>
          <TabsTrigger value="patrimoine" className="flex items-center space-x-2">
            <PiggyBank className="w-4 h-4" />
            <span>Patrimoine</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Revenus */}
        <TabsContent value="revenus" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-green-600" />
                <span>Revenus annuels</span>
              </CardTitle>
              <CardDescription>
                Indiquez vos revenus bruts avant impôts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="revenuBrutAnnuel">
                  Revenu brut annuel principal *
                </Label>
                <div className="relative">
                  <Input
                    id="revenuBrutAnnuel"
                    type="number"
                    value={formData.revenuBrutAnnuel || ''}
                    onChange={(e) => handleInputChange('revenuBrutAnnuel', Number(e.target.value))}
                    placeholder="80000"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                </div>
                {errors.revenuBrutAnnuel && (
                  <p className="text-sm text-red-600">{errors.revenuBrutAnnuel}</p>
                )}
              </div>

              {formData.situationFamiliale === 'marie' && (
                <div className="space-y-2">
                  <Label htmlFor="revenuConjoint">
                    Revenu brut annuel du conjoint
                  </Label>
                  <div className="relative">
                    <Input
                      id="revenuConjoint"
                      type="number"
                      value={formData.revenuConjoint || ''}
                      onChange={(e) => handleInputChange('revenuConjoint', Number(e.target.value))}
                      placeholder="50000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Conseil</p>
                    <p>Incluez tous vos revenus : salaire, primes, revenus secondaires, mais excluez les remboursements de frais.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Situation */}
        <TabsContent value="situation" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Situation personnelle</span>
              </CardTitle>
              <CardDescription>
                Ces informations influencent directement vos impôts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Canton de résidence *</Label>
                  <Select
                    value={formData.canton?.code}
                    onValueChange={(value) => {
                      const cantonData = { code: value, nom: value, tauxImposition: { revenu: 0.25, fortune: 0.5 } };
                      handleInputChange('canton', cantonData as Canton);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre canton" />
                    </SelectTrigger>
                    <SelectContent>
                      {cantonsList.map((canton) => (
                        <SelectItem key={canton.value as unknown as string} value={canton.value as unknown as string}>
                          {canton.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.canton && (
                    <p className="text-sm text-red-600">{errors.canton}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Situation familiale *</Label>
                  <Select
                    value={formData.situationFamiliale}
                    onValueChange={(value) => handleInputChange('situationFamiliale', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre situation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celibataire">Célibataire</SelectItem>
                      <SelectItem value="marie">Marié(e)</SelectItem>
                      <SelectItem value="divorce">Divorcé(e)</SelectItem>
                      <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                      <SelectItem value="pacs">PACS</SelectItem>
                      <SelectItem value="concubinage">Concubinage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Nombre d'enfants à charge</Label>
                <div className="px-3">
                  <Slider
                    value={[formData.nombreEnfants || 0]}
                    onValueChange={(value) => handleInputChange('nombreEnfants', value[0])}
                    max={6}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span>
                    <span className="font-medium">{formData.nombreEnfants || 0} enfant{(formData.nombreEnfants || 0) > 1 ? 's' : ''}</span>
                    <span>6+</span>
                  </div>
                </div>
                
                {(formData.nombreEnfants || 0) > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Déduction enfants:</span> Vous bénéficierez d'une déduction de{' '}
                      {formData.canton ? SwissTaxCalculator.getDeductionLimits(formData.canton as Canton).parEnfant?.toLocaleString('fr-CH') || '8000' : '8000'} CHF par enfant.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Déductions */}
        <TabsContent value="deductions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-orange-600" />
                <span>Déductions fiscales</span>
              </CardTitle>
              <CardDescription>
                Optimisez vos impôts avec ces déductions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Frais professionnels */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Frais professionnels</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fraisProfessionnels">Autres frais professionnels</Label>
                    <div className="relative">
                      <Input
                        id="fraisProfessionnels"
                        type="number"
                        value={formData.fraisProfessionnels || ''}
                        onChange={(e) => handleInputChange('fraisProfessionnels', Number(e.target.value))}
                        placeholder="2000"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fraisTransport">Frais de transport</Label>
                    <div className="relative">
                      <Input
                        id="fraisTransport"
                        type="number"
                        value={formData.fraisTransport || ''}
                        onChange={(e) => handleInputChange('fraisTransport', Number(e.target.value))}
                        placeholder="1200"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fraisRepas">Frais de repas</Label>
                    <div className="relative">
                      <Input
                        id="fraisRepas"
                        type="number"
                        value={formData.fraisRepas || ''}
                        onChange={(e) => handleInputChange('fraisRepas', Number(e.target.value))}
                        placeholder="1800"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prévoyance */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Prévoyance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pilier3a">
                      3e pilier A
                      <Badge variant="secondary" className="ml-2">Max {maxPilier3a.toLocaleString('fr-CH')} CHF</Badge>
                    </Label>
                    <div className="relative">
                      <Input
                        id="pilier3a"
                        type="number"
                        value={formData.pilier3a || ''}
                        onChange={(e) => handleInputChange('pilier3a', Number(e.target.value))}
                        placeholder="0"
                        max={maxPilier3a}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                    </div>
                    {errors.pilier3a && (
                      <p className="text-sm text-red-600">{errors.pilier3a}</p>
                    )}
                    {formData.pilier3a && formData.pilier3a < maxPilier3a && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          Vous pouvez encore verser {(maxPilier3a - formData.pilier3a).toLocaleString('fr-CH')} CHF cette année.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pilier3b">3e pilier B</Label>
                    <div className="relative">
                      <Input
                        id="pilier3b"
                        type="number"
                        value={formData.pilier3b || ''}
                        onChange={(e) => handleInputChange('pilier3b', Number(e.target.value))}
                        placeholder="0"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Autres déductions */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Autres déductions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primesAssuranceMaladie">Primes maladie</Label>
                    <div className="relative">
                      <Input
                        id="primesAssuranceMaladie"
                        type="number"
                        value={formData.primesAssuranceMaladie || ''}
                        onChange={(e) => handleInputChange('primesAssuranceMaladie', Number(e.target.value))}
                        placeholder="4000"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fraisMedicaux">Frais médicaux</Label>
                    <div className="relative">
                      <Input
                        id="fraisMedicaux"
                        type="number"
                        value={formData.fraisMedicaux || ''}
                        onChange={(e) => handleInputChange('fraisMedicaux', Number(e.target.value))}
                        placeholder="0"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="donsCharite">Dons à des œuvres</Label>
                    <div className="relative">
                      <Input
                        id="donsCharite"
                        type="number"
                        value={formData.donsCharite || ''}
                        onChange={(e) => handleInputChange('donsCharite', Number(e.target.value))}
                        placeholder="0"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Patrimoine */}
        <TabsContent value="patrimoine" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PiggyBank className="w-5 h-5 text-purple-600" />
                <span>Patrimoine et fortune</span>
              </CardTitle>
              <CardDescription>
                Votre fortune privée est soumise à l'impôt sur la fortune
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fortunePrivee">Fortune privée totale</Label>
                  <div className="relative">
                    <Input
                      id="fortunePrivee"
                      type="number"
                      value={formData.fortunePrivee || ''}
                      onChange={(e) => handleInputChange('fortunePrivee', Number(e.target.value))}
                      placeholder="50000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Comptes bancaires, placements, liquidités
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dettes">Dettes totales</Label>
                  <div className="relative">
                    <Input
                      id="dettes"
                      type="number"
                      value={formData.dettes || ''}
                      onChange={(e) => handleInputChange('dettes', Number(e.target.value))}
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Crédits, prêts, hypothèques
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="text-sm text-purple-800">
                    <p className="font-medium mb-1">Impôt sur la fortune</p>
                    <p>La plupart des cantons appliquent une franchise (généralement 50'000 CHF pour les célibataires, 100'000 CHF pour les couples). Seule la fortune dépassant cette franchise est imposée.</p>
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg py-6"
            size="lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculer mes impôts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}