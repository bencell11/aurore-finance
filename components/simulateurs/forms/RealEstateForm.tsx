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
import { ImmobilierParameters } from '@/types/simulators';
import { Canton } from '@/types/user';
import { RealEstateCalculator } from '@/lib/calculators/real-estate-calculator';
import { 
  Home, 
  Banknote, 
  Calculator, 
  MapPin,
  Info,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Building
} from 'lucide-react';

interface RealEstateFormProps {
  onCalculate: (results: any) => void;
  onDataChange: (data: Partial<ImmobilierParameters>) => void;
  initialData?: Partial<ImmobilierParameters>;
}

export default function RealEstateForm({ 
  onCalculate, 
  onDataChange, 
  initialData = {} 
}: RealEstateFormProps) {
  const [formData, setFormData] = useState<Partial<ImmobilierParameters>>({
    prixAchat: 800000,
    typeLogement: 'appartement',
    surfaceHabitable: 100,
    anneeConstruction: 2000,
    etatLogement: 'bon',
    canton: { code: 'GE', nom: 'Genève', tauxImposition: { revenu: 0.25, fortune: 0.5 } },
    revenuNetMensuel: 8000,
    fondsPropresPrevus: 160000,
    liquiditesDisponibles: 200000,
    dureeHypotheque: 10,
    typeHypotheque: 'fixe',
    fraisNotaire: 0,
    fraisCourtage: 0,
    taxesTransfert: 0,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ImmobilierParameters, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate estimated costs
    if (field === 'prixAchat' || field === 'canton') {
      updateEstimatedCosts(newData);
    }
  };

  const updateEstimatedCosts = (data: Partial<ImmobilierParameters>) => {
    if (data.prixAchat && data.canton) {
      // Estimation automatique des frais
      const estimatedNotaryFees = data.prixAchat * 0.015; // 1.5%
      const transferTaxes = RealEstateCalculator.getCantonTransferTaxes();
      const estimatedTransferTax = data.prixAchat * 0.02; // 2% par défaut
      
      const updatedData = {
        ...data,
        fraisNotaire: estimatedNotaryFees,
        taxesTransfert: estimatedTransferTax
      };
      
      setFormData(updatedData);
      onDataChange(updatedData);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.prixAchat || formData.prixAchat <= 0) {
      newErrors.prixAchat = 'Le prix d\'achat est requis';
    }
    
    if (!formData.revenuNetMensuel || formData.revenuNetMensuel <= 0) {
      newErrors.revenuNetMensuel = 'Le revenu mensuel est requis';
    }
    
    if (!formData.fondsPropresPrevus || formData.fondsPropresPrevus <= 0) {
      newErrors.fondsPropresPrevus = 'Les fonds propres sont requis';
    }
    
    if (formData.fondsPropresPrevus && formData.prixAchat && formData.fondsPropresPrevus < formData.prixAchat * 0.2) {
      newErrors.fondsPropresPrevus = 'Les fonds propres doivent représenter au moins 20% du prix d\'achat';
    }
    
    if (!formData.surfaceHabitable || formData.surfaceHabitable <= 0) {
      newErrors.surfaceHabitable = 'La surface habitable est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    
    try {
      const calculator = new RealEstateCalculator();
      const results = calculator.calculate(formData as ImmobilierParameters);
      onCalculate(results);
    } catch (error) {
      console.error('Erreur de calcul:', error);
      setErrors({ general: 'Erreur lors du calcul. Vérifiez vos données.' });
    }
  };

  const prixParM2 = formData.prixAchat && formData.surfaceHabitable ? 
    Math.round(formData.prixAchat / formData.surfaceHabitable) : 0;

  const fondsPropresPourcentage = formData.prixAchat && formData.fondsPropresPrevus ?
    Math.round((formData.fondsPropresPrevus / formData.prixAchat) * 100) : 0;

  const quickAffordability = formData.revenuNetMensuel ?
    RealEstateCalculator.calculateAffordabilityQuick(
      formData.revenuNetMensuel, 
      formData.fondsPropresPrevus || 0,
      formData.revenuConjoint || 0
    ) : 0;

  return (
    <div className="space-y-6 pb-24">
      <Tabs defaultValue="bien" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bien" className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Le bien</span>
          </TabsTrigger>
          <TabsTrigger value="finances" className="flex items-center space-x-2">
            <Banknote className="w-4 h-4" />
            <span>Finances</span>
          </TabsTrigger>
          <TabsTrigger value="financement" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Financement</span>
          </TabsTrigger>
          <TabsTrigger value="frais" className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>Frais</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Le bien */}
        <TabsContent value="bien" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Caractéristiques du bien</span>
              </CardTitle>
              <CardDescription>
                Décrivez le bien immobilier que vous souhaitez acquérir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prixAchat">
                    Prix d'achat *
                  </Label>
                  <div className="relative">
                    <Input
                      id="prixAchat"
                      type="number"
                      value={formData.prixAchat || ''}
                      onChange={(e) => handleInputChange('prixAchat', Number(e.target.value))}
                      placeholder="800000"
                      className="pr-12 text-lg font-medium"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  {errors.prixAchat && (
                    <p className="text-sm text-red-600">{errors.prixAchat}</p>
                  )}
                  {prixParM2 > 0 && (
                    <p className="text-sm text-gray-600">
                      {prixParM2.toLocaleString('fr-CH')} CHF/m²
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surfaceHabitable">
                    Surface habitable *
                  </Label>
                  <div className="relative">
                    <Input
                      id="surfaceHabitable"
                      type="number"
                      value={formData.surfaceHabitable || ''}
                      onChange={(e) => handleInputChange('surfaceHabitable', Number(e.target.value))}
                      placeholder="100"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">m²</span>
                  </div>
                  {errors.surfaceHabitable && (
                    <p className="text-sm text-red-600">{errors.surfaceHabitable}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type de logement</Label>
                  <Select
                    value={formData.typeLogement}
                    onValueChange={(value) => handleInputChange('typeLogement', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="terrain">Terrain à bâtir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>État du logement</Label>
                  <Select
                    value={formData.etatLogement}
                    onValueChange={(value) => handleInputChange('etatLogement', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuf">Neuf</SelectItem>
                      <SelectItem value="bon">Bon état</SelectItem>
                      <SelectItem value="a_renover">À rénover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anneeConstruction">Année de construction</Label>
                  <Input
                    id="anneeConstruction"
                    type="number"
                    value={formData.anneeConstruction || ''}
                    onChange={(e) => handleInputChange('anneeConstruction', Number(e.target.value))}
                    placeholder="2000"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Canton</Label>
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
                      <SelectItem value="AG">Argovie (AG)</SelectItem>
                      <SelectItem value="TI">Tessin (TI)</SelectItem>
                      <SelectItem value="LU">Lucerne (LU)</SelectItem>
                      <SelectItem value="FR">Fribourg (FR)</SelectItem>
                      <SelectItem value="SG">Saint-Gall (SG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commune">Commune (optionnel)</Label>
                  <Input
                    id="commune"
                    value={formData.commune || ''}
                    onChange={(e) => handleInputChange('commune', e.target.value)}
                    placeholder="ex: Lausanne"
                  />
                </div>
              </div>

              {quickAffordability > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Estimation rapide</p>
                      <p>
                        Avec vos revenus actuels, votre capacité d'achat est d'environ{' '}
                        <span className="font-bold">{quickAffordability.toLocaleString('fr-CH')} CHF</span>
                        {formData.prixAchat && formData.prixAchat > quickAffordability && (
                          <span className="text-orange-700"> - Le bien visé dépasse cette estimation</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Finances */}
        <TabsContent value="finances" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-green-600" />
                <span>Situation financière</span>
              </CardTitle>
              <CardDescription>
                Vos revenus et fonds propres disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revenuNetMensuel">
                    Revenu net mensuel principal *
                  </Label>
                  <div className="relative">
                    <Input
                      id="revenuNetMensuel"
                      type="number"
                      value={formData.revenuNetMensuel || ''}
                      onChange={(e) => handleInputChange('revenuNetMensuel', Number(e.target.value))}
                      placeholder="8000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  {errors.revenuNetMensuel && (
                    <p className="text-sm text-red-600">{errors.revenuNetMensuel}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenuConjoint">
                    Revenu net mensuel du conjoint
                  </Label>
                  <div className="relative">
                    <Input
                      id="revenuConjoint"
                      type="number"
                      value={formData.revenuConjoint || ''}
                      onChange={(e) => handleInputChange('revenuConjoint', Number(e.target.value))}
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fondsPropresPrevus">
                    Fonds propres prévus *
                    {fondsPropresPourcentage > 0 && (
                      <Badge variant="outline" className="ml-2">
                        {fondsPropresPourcentage}% du prix
                      </Badge>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="fondsPropresPrevus"
                      type="number"
                      value={formData.fondsPropresPrevus || ''}
                      onChange={(e) => handleInputChange('fondsPropresPrevus', Number(e.target.value))}
                      placeholder="160000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  {errors.fondsPropresPrevus && (
                    <p className="text-sm text-red-600">{errors.fondsPropresPrevus}</p>
                  )}
                  {fondsPropresPourcentage > 0 && fondsPropresPourcentage < 20 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Les fonds propres doivent représenter au minimum 20% du prix d'achat.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liquiditesDisponibles">
                    Liquidités totales disponibles
                  </Label>
                  <div className="relative">
                    <Input
                      id="liquiditesDisponibles"
                      type="number"
                      value={formData.liquiditesDisponibles || ''}
                      onChange={(e) => handleInputChange('liquiditesDisponibles', Number(e.target.value))}
                      placeholder="200000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Comptes, épargne, 3e pilier, placements liquides
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Composition des fonds propres</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Épargne personnelle (au minimum 10% du prix d'achat)</li>
                      <li>Prévoyance professionnelle (2e pilier) - max 10%</li>
                      <li>Prévoyance privée (3e pilier) - sans limitation</li>
                      <li>Donation ou héritage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Financement */}
        <TabsContent value="financement" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Stratégie de financement</span>
              </CardTitle>
              <CardDescription>
                Choisissez votre type d'hypothèque et sa durée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type d'hypothèque</Label>
                  <Select
                    value={formData.typeHypotheque}
                    onValueChange={(value) => handleInputChange('typeHypotheque', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixe">Taux fixe</SelectItem>
                      <SelectItem value="variable">Taux variable</SelectItem>
                      <SelectItem value="saron">Hypothèque SARON</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {formData.typeHypotheque && (
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      {formData.typeHypotheque === 'fixe' && (
                        <p><strong>Taux fixe:</strong> Sécurité des mensualités, idéal pour les budgets serrés.</p>
                      )}
                      {formData.typeHypotheque === 'variable' && (
                        <p><strong>Taux variable:</strong> Profitez des baisses de taux, mais risque de hausse.</p>
                      )}
                      {formData.typeHypotheque === 'saron' && (
                        <p><strong>SARON:</strong> Suit les taux du marché monétaire, très flexible.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dureeHypotheque">
                    Durée de l'hypothèque (années)
                  </Label>
                  <div className="px-3">
                    <Slider
                      value={[formData.dureeHypotheque || 10]}
                      onValueChange={(value) => handleInputChange('dureeHypotheque', value[0])}
                      max={15}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1 an</span>
                      <span className="font-medium">{formData.dureeHypotheque || 10} ans</span>
                      <span>15 ans</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tauxInteretSouhaite">
                  Taux d'intérêt espéré (optionnel)
                </Label>
                <div className="relative">
                  <Input
                    id="tauxInteretSouhaite"
                    type="number"
                    step="0.1"
                    value={formData.tauxInteretSouhaite || ''}
                    onChange={(e) => handleInputChange('tauxInteretSouhaite', Number(e.target.value))}
                    placeholder="2.5"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-600">
                  Laissez vide pour utiliser les taux du marché actuels
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Conseils sur la durée</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Durée courte (1-5 ans) : Taux plus bas, risque de renouvellement</li>
                      <li>Durée moyenne (6-10 ans) : Équilibre sécurité/coût</li>
                      <li>Durée longue (10-15 ans) : Sécurité maximale, taux plus élevé</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Frais */}
        <TabsContent value="frais" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-orange-600" />
                <span>Frais d'acquisition</span>
              </CardTitle>
              <CardDescription>
                Les frais sont estimés automatiquement mais vous pouvez les ajuster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fraisNotaire">
                    Frais de notaire
                    <Badge variant="secondary" className="ml-2">~1.5%</Badge>
                  </Label>
                  <div className="relative">
                    <Input
                      id="fraisNotaire"
                      type="number"
                      value={formData.fraisNotaire || ''}
                      onChange={(e) => handleInputChange('fraisNotaire', Number(e.target.value))}
                      placeholder="12000"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fraisCourtage">
                    Frais de courtage
                    <Badge variant="secondary" className="ml-2">0-3%</Badge>
                  </Label>
                  <div className="relative">
                    <Input
                      id="fraisCourtage"
                      type="number"
                      value={formData.fraisCourtage || ''}
                      onChange={(e) => handleInputChange('fraisCourtage', Number(e.target.value))}
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxesTransfert">
                    Droits de mutation
                    <Badge variant="secondary" className="ml-2">Varie par canton</Badge>
                  </Label>
                  <div className="relative">
                    <Input
                      id="taxesTransfert"
                      type="number"
                      value={formData.taxesTransfert || ''}
                      onChange={(e) => handleInputChange('taxesTransfert', Number(e.target.value))}
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  {formData.canton && (
                    <p className="text-xs text-gray-600">
                      {formData.canton?.nom}: Varie selon commune
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fraisRenovation">
                    Frais de rénovation prévus
                  </Label>
                  <div className="relative">
                    <Input
                      id="fraisRenovation"
                      type="number"
                      value={formData.fraisRenovation || ''}
                      onChange={(e) => handleInputChange('fraisRenovation', Number(e.target.value))}
                      placeholder="0"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Récapitulatif des frais</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Frais de notaire:</span>
                    <span>{(formData.fraisNotaire || 0).toLocaleString('fr-CH')} CHF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de courtage:</span>
                    <span>{(formData.fraisCourtage || 0).toLocaleString('fr-CH')} CHF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Droits de mutation:</span>
                    <span>{(formData.taxesTransfert || 0).toLocaleString('fr-CH')} CHF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rénovations:</span>
                    <span>{(formData.fraisRenovation || 0).toLocaleString('fr-CH')} CHF</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-blue-200">
                    <span>Total frais:</span>
                    <span>
                      {((formData.fraisNotaire || 0) + 
                        (formData.fraisCourtage || 0) + 
                        (formData.taxesTransfert || 0) + 
                        (formData.fraisRenovation || 0)).toLocaleString('fr-CH')} CHF
                    </span>
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
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-lg py-6"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Analyser ma capacité d'achat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}