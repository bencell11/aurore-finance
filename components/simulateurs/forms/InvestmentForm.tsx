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
import { InvestissementParameters } from '@/types/simulators';
import { InvestmentCalculator } from '@/lib/calculators/investment-calculator';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  BarChart3,
  PieChart,
  Shield,
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle,
  Star,
  Globe,
  Leaf,
  Clock,
  Calculator
} from 'lucide-react';

interface InvestmentFormProps {
  onCalculate: (results: any) => void;
  onDataChange: (data: Partial<InvestissementParameters>) => void;
  initialData?: Partial<InvestissementParameters>;
}

export default function InvestmentForm({ 
  onCalculate, 
  onDataChange, 
  initialData = {} 
}: InvestmentFormProps) {
  const [formData, setFormData] = useState<Partial<InvestissementParameters>>({
    montantInitial: 10000,
    versementMensuel: 500,
    horizonPlacement: 10,
    objectifPlacement: 'retraite',
    experienceInvestissement: 'intermediaire',
    toleranceRisque: 'modere',
    capaciteFinanciere: 'moyenne',
    typesProduits: ['actions', 'obligations'],
    marchesGeographiques: ['suisse', 'europe'],
    liquiditeRequise: 'flexible',
    preoccupationESG: false,
    fraisMaxAcceptes: 1.0,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentRiskQuestionIndex, setCurrentRiskQuestionIndex] = useState(0);
  const [riskAnswers, setRiskAnswers] = useState<number[]>([]);
  
  const riskQuestions = InvestmentCalculator.getRiskToleranceQuestions();

  const handleInputChange = (field: keyof InvestissementParameters, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMultiSelect = (field: 'typesProduits' | 'marchesGeographiques', value: string) => {
    const currentValues = (formData[field] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleInputChange(field, newValues);
  };

  const handleRiskAssessment = (score: number) => {
    const newAnswers = [...riskAnswers, score];
    setRiskAnswers(newAnswers);

    if (currentRiskQuestionIndex < riskQuestions.length - 1) {
      setCurrentRiskQuestionIndex(currentRiskQuestionIndex + 1);
    } else {
      // Calculer le profil de risque basé sur les réponses
      const averageScore = newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length;
      let toleranceRisque: 'conservateur' | 'modere' | 'dynamique' | 'agressif';
      
      if (averageScore <= 1.5) toleranceRisque = 'conservateur';
      else if (averageScore <= 2.5) toleranceRisque = 'modere';
      else if (averageScore <= 3.5) toleranceRisque = 'dynamique';
      else toleranceRisque = 'agressif';
      
      handleInputChange('toleranceRisque', toleranceRisque);
      
      // Reset pour permettre de refaire le test
      setCurrentRiskQuestionIndex(0);
      setRiskAnswers([]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.montantInitial || formData.montantInitial < 0) {
      newErrors.montantInitial = 'Le montant initial est requis';
    }
    
    if (!formData.versementMensuel || formData.versementMensuel < 0) {
      newErrors.versementMensuel = 'Le versement mensuel est requis';
    }
    
    if (!formData.horizonPlacement || formData.horizonPlacement <= 0) {
      newErrors.horizonPlacement = 'L\'horizon de placement doit être positif';
    }
    
    if (!formData.typesProduits || formData.typesProduits.length === 0) {
      newErrors.typesProduits = 'Sélectionnez au moins un type de produit';
    }
    
    if (!formData.marchesGeographiques || formData.marchesGeographiques.length === 0) {
      newErrors.marchesGeographiques = 'Sélectionnez au moins un marché géographique';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;
    
    try {
      const calculator = new InvestmentCalculator();
      const results = calculator.calculate(formData as InvestissementParameters);
      onCalculate(results);
    } catch (error) {
      console.error('Erreur de calcul:', error);
      setErrors({ general: 'Erreur lors du calcul. Vérifiez vos données.' });
    }
  };

  const capitalTotal = formData.montantInitial && formData.versementMensuel && formData.horizonPlacement
    ? formData.montantInitial + (formData.versementMensuel * 12 * formData.horizonPlacement)
    : 0;

  const estimatedReturn = capitalTotal ? capitalTotal * 1.06 : 0; // Estimation 6% annuel

  return (
    <div className="space-y-6 pb-24">
      <Tabs defaultValue="objectifs" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="objectifs" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Objectifs</span>
          </TabsTrigger>
          <TabsTrigger value="profil" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="produits" className="flex items-center space-x-2">
            <PieChart className="w-4 h-4" />
            <span>Produits</span>
          </TabsTrigger>
          <TabsTrigger value="marches" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Marchés</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Préférences</span>
          </TabsTrigger>
          <TabsTrigger value="risque" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Test risque</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Objectifs */}
        <TabsContent value="objectifs" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Objectifs d'investissement</span>
              </CardTitle>
              <CardDescription>
                Définissez vos objectifs financiers et votre horizon temporel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="montantInitial">
                    Montant initial à investir *
                  </Label>
                  <div className="relative">
                    <Input
                      id="montantInitial"
                      type="number"
                      value={formData.montantInitial || ''}
                      onChange={(e) => handleInputChange('montantInitial', Number(e.target.value))}
                      placeholder="10000"
                      className="pr-12 text-lg font-medium"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  {errors.montantInitial && (
                    <p className="text-sm text-red-600">{errors.montantInitial}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="versementMensuel">
                    Versement mensuel *
                  </Label>
                  <div className="relative">
                    <Input
                      id="versementMensuel"
                      type="number"
                      value={formData.versementMensuel || ''}
                      onChange={(e) => handleInputChange('versementMensuel', Number(e.target.value))}
                      placeholder="500"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
                  </div>
                  {errors.versementMensuel && (
                    <p className="text-sm text-red-600">{errors.versementMensuel}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Horizon de placement
                    <Badge variant="outline" className="ml-2">
                      {formData.horizonPlacement || 10} années
                    </Badge>
                  </Label>
                  <div className="px-3">
                    <Slider
                      value={[formData.horizonPlacement || 10]}
                      onValueChange={(value) => handleInputChange('horizonPlacement', value[0])}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1 an</span>
                      <span>15 ans</span>
                      <span>30 ans</span>
                    </div>
                  </div>
                  {errors.horizonPlacement && (
                    <p className="text-sm text-red-600">{errors.horizonPlacement}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Objectif principal</Label>
                  <Select
                    value={formData.objectifPlacement}
                    onValueChange={(value) => handleInputChange('objectifPlacement', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="epargne">Constitution d'une épargne</SelectItem>
                      <SelectItem value="retraite">Préparation de la retraite</SelectItem>
                      <SelectItem value="immobilier">Projet immobilier</SelectItem>
                      <SelectItem value="enfants">Éducation des enfants</SelectItem>
                      <SelectItem value="autre">Autre projet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {capitalTotal > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Calculator className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Projection rapide</p>
                      <div className="space-y-1">
                        <p>Capital total investi: <span className="font-bold">{capitalTotal.toLocaleString('fr-CH')} CHF</span></p>
                        <p>Valeur estimée (6%/an): <span className="font-bold">{estimatedReturn.toLocaleString('fr-CH')} CHF</span></p>
                        <p>Gain potentiel: <span className="font-bold text-green-700">+{(estimatedReturn - capitalTotal).toLocaleString('fr-CH')} CHF</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Profil */}
        <TabsContent value="profil" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span>Profil d'investisseur</span>
              </CardTitle>
              <CardDescription>
                Définissez votre expérience et votre capacité d'investissement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Expérience d'investissement</Label>
                  <Select
                    value={formData.experienceInvestissement}
                    onValueChange={(value) => handleInputChange('experienceInvestissement', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debutant">
                        Débutant - Première expérience
                      </SelectItem>
                      <SelectItem value="intermediaire">
                        Intermédiaire - Quelques années d'expérience
                      </SelectItem>
                      <SelectItem value="avance">
                        Avancé - Expérience solide des marchés
                      </SelectItem>
                      <SelectItem value="expert">
                        Expert - Professionnel ou investisseur chevronné
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Capacité financière</Label>
                  <Select
                    value={formData.capaciteFinanciere}
                    onValueChange={(value) => handleInputChange('capaciteFinanciere', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="limitee">
                        Limitée - Épargne constituée progressivement
                      </SelectItem>
                      <SelectItem value="moyenne">
                        Moyenne - Capacité d'épargne régulière
                      </SelectItem>
                      <SelectItem value="elevee">
                        Élevée - Patrimoine important et revenus stables
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tolérance au risque</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'conservateur', label: 'Conservateur', color: 'green', description: 'Priorité à la sécurité' },
                    { value: 'modere', label: 'Modéré', color: 'blue', description: 'Équilibre risque/rendement' },
                    { value: 'dynamique', label: 'Dynamique', color: 'orange', description: 'Accepte la volatilité' },
                    { value: 'agressif', label: 'Agressif', color: 'red', description: 'Recherche la performance' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('toleranceRisque', option.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.toleranceRisque === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Besoin de liquidité</Label>
                <Select
                  value={formData.liquiditeRequise}
                  onValueChange={(value) => handleInputChange('liquiditeRequise', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">
                      Immédiate - Accès rapide nécessaire
                    </SelectItem>
                    <SelectItem value="flexible">
                      Flexible - Quelques jours acceptable
                    </SelectItem>
                    <SelectItem value="bloquee">
                      Bloquée - Pas de besoin d'accès à court terme
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Conseil personnalisé</p>
                    <p>
                      {formData.experienceInvestissement === 'debutant' && 
                        "En tant que débutant, privilégiez une approche diversifiée avec des ETF et limitez les investissements complexes."}
                      {formData.experienceInvestissement === 'intermediaire' && 
                        "Votre expérience vous permet d'explorer différentes classes d'actifs. Restez discipliné sur votre allocation."}
                      {formData.experienceInvestissement === 'avance' && 
                        "Vous pouvez envisager des stratégies plus sophistiquées tout en maintenant un bon équilibre risque/rendement."}
                      {formData.experienceInvestissement === 'expert' && 
                        "Votre expertise vous permet d'optimiser finement votre portefeuille selon les cycles de marché."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Produits */}
        <TabsContent value="produits" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                <span>Types de produits</span>
              </CardTitle>
              <CardDescription>
                Sélectionnez les classes d'actifs qui vous intéressent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    value: 'actions', 
                    label: 'Actions', 
                    description: 'Parts d\'entreprises (ETF, fonds, titres)', 
                    risk: 'Élevé',
                    return: '6-8%',
                    icon: TrendingUp 
                  },
                  { 
                    value: 'obligations', 
                    label: 'Obligations', 
                    description: 'Prêts à gouvernements et entreprises', 
                    risk: 'Faible-Moyen',
                    return: '2-4%',
                    icon: Shield 
                  },
                  { 
                    value: 'immobilier', 
                    label: 'Immobilier', 
                    description: 'REITs et fonds immobiliers', 
                    risk: 'Moyen',
                    return: '4-6%',
                    icon: Target 
                  },
                  { 
                    value: 'matieresPremiere', 
                    label: 'Matières premières', 
                    description: 'Or, pétrole, métaux, agriculture', 
                    risk: 'Élevé',
                    return: '3-7%',
                    icon: BarChart3 
                  },
                  { 
                    value: 'crypto', 
                    label: 'Cryptomonnaies', 
                    description: 'Bitcoin, Ethereum et autres crypto', 
                    risk: 'Très élevé',
                    return: 'Variable',
                    icon: DollarSign 
                  }
                ].map((product) => {
                  const isSelected = formData.typesProduits?.includes(product.value as any);
                  return (
                    <button
                      key={product.value}
                      type="button"
                      onClick={() => handleMultiSelect('typesProduits', product.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <product.icon className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">{product.label}</span>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-purple-600" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Risque: {product.risk}</span>
                        <span className="text-green-600 font-medium">Rendement: {product.return}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.typesProduits && (
                <p className="text-sm text-red-600">{errors.typesProduits}</p>
              )}

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">Sélection actuelle</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.typesProduits?.map((product) => (
                    <Badge key={product} variant="outline" className="bg-white">
                      {product.charAt(0).toUpperCase() + product.slice(1)}
                    </Badge>
                  )) || <span className="text-sm text-gray-500">Aucun produit sélectionné</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Marchés */}
        <TabsContent value="marches" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-600" />
                <span>Marchés géographiques</span>
              </CardTitle>
              <CardDescription>
                Choisissez votre exposition géographique pour diversifier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    value: 'suisse', 
                    label: 'Suisse', 
                    description: 'SMI, SPI - Marché domestique',
                    flag: '🇨🇭',
                    marketCap: '1\'500 Md CHF'
                  },
                  { 
                    value: 'europe', 
                    label: 'Europe', 
                    description: 'STOXX 600, Euro STOXX 50',
                    flag: '🇪🇺',
                    marketCap: '15\'000 Md EUR'
                  },
                  { 
                    value: 'amerique', 
                    label: 'Amérique du Nord', 
                    description: 'S&P 500, NASDAQ, TSX',
                    flag: '🇺🇸',
                    marketCap: '45\'000 Md USD'
                  },
                  { 
                    value: 'asie', 
                    label: 'Asie développée', 
                    description: 'Nikkei, Hang Seng, ASX',
                    flag: '🌏',
                    marketCap: '20\'000 Md USD'
                  },
                  { 
                    value: 'emergents', 
                    label: 'Marchés émergents', 
                    description: 'Chine, Inde, Brésil, etc.',
                    flag: '🌍',
                    marketCap: '8\'000 Md USD'
                  }
                ].map((market) => {
                  const isSelected = formData.marchesGeographiques?.includes(market.value as any);
                  return (
                    <button
                      key={market.value}
                      type="button"
                      onClick={() => handleMultiSelect('marchesGeographiques', market.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{market.flag}</span>
                          <span className="font-medium">{market.label}</span>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-cyan-600" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{market.description}</p>
                      <p className="text-xs text-gray-500">Cap. marché: {market.marketCap}</p>
                    </button>
                  );
                })}
              </div>

              {errors.marchesGeographiques && (
                <p className="text-sm text-red-600">{errors.marchesGeographiques}</p>
              )}

              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-cyan-600 mt-0.5" />
                  <div className="text-sm text-cyan-800">
                    <p className="font-medium mb-1">Diversification géographique</p>
                    <p>
                      Une exposition multi-géographique réduit les risques spécifiques à un pays 
                      et permet de profiter des opportunités mondiales. La Suisse représente 
                      environ 3% de la capitalisation mondiale.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Préférences et contraintes</span>
              </CardTitle>
              <CardDescription>
                Définissez vos préférences ESG et contraintes de coûts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Investissement durable (ESG)</h4>
                      <p className="text-sm text-gray-600">
                        Intégrer les critères environnementaux, sociaux et de gouvernance
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('preoccupationESG', !formData.preoccupationESG)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.preoccupationESG ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.preoccupationESG ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {formData.preoccupationESG && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Critères ESG disponibles</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
                      <div>
                        <h6 className="font-medium mb-1">Environnement</h6>
                        <ul className="space-y-1">
                          <li>• Énergies renouvelables</li>
                          <li>• Réduction carbone</li>
                          <li>• Économie circulaire</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium mb-1">Social</h6>
                        <ul className="space-y-1">
                          <li>• Diversité & inclusion</li>
                          <li>• Conditions de travail</li>
                          <li>• Impact communautaire</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium mb-1">Gouvernance</h6>
                        <ul className="space-y-1">
                          <li>• Transparence</li>
                          <li>• Éthique des affaires</li>
                          <li>• Lutte anticorruption</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>
                    Frais maximaux acceptés
                    <Badge variant="outline" className="ml-2">
                      {formData.fraisMaxAcceptes?.toFixed(1)}% par an
                    </Badge>
                  </Label>
                  <div className="px-3">
                    <Slider
                      value={[formData.fraisMaxAcceptes || 1.0]}
                      onValueChange={(value) => handleInputChange('fraisMaxAcceptes', value[0])}
                      max={3.0}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>0.1% (ETF)</span>
                      <span>1.5% (Équilibré)</span>
                      <span>3.0% (Gestion active)</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    {formData.fraisMaxAcceptes && formData.fraisMaxAcceptes <= 0.5 && 
                      "Privilégie les ETF et produits passifs à faible coût"}
                    {formData.fraisMaxAcceptes && formData.fraisMaxAcceptes > 0.5 && formData.fraisMaxAcceptes <= 1.5 && 
                      "Permet un mix entre gestion passive et active"}
                    {formData.fraisMaxAcceptes && formData.fraisMaxAcceptes > 1.5 && 
                      "Accepte la gestion active premium et fonds spécialisés"}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-2">
                  <Star className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Impact des frais sur votre investissement</p>
                    <p>
                      Sur {formData.horizonPlacement} ans, 1% de frais supplémentaires peut réduire 
                      votre capital final de 10-20%. Privilégiez la transparence des coûts.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Test de risque */}
        <TabsContent value="risque" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Évaluation du profil de risque</span>
              </CardTitle>
              <CardDescription>
                Répondez à ces questions pour affiner votre profil de risque
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {riskAnswers.length < riskQuestions.length ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      Question {currentRiskQuestionIndex + 1} sur {riskQuestions.length}
                    </span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{width: `${((currentRiskQuestionIndex + 1) / riskQuestions.length) * 100}%`}}
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">
                      {riskQuestions[currentRiskQuestionIndex]?.question}
                    </h3>
                    <div className="space-y-3">
                      {riskQuestions[currentRiskQuestionIndex]?.responses.map((response, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleRiskAssessment(response.score)}
                          className="w-full p-3 text-left border-2 border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all"
                        >
                          {response.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Test terminé !</h3>
                  <p className="text-gray-600 mb-4">
                    Votre profil de risque a été mis à jour : 
                    <Badge className="ml-2">{formData.toleranceRisque}</Badge>
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentRiskQuestionIndex(0);
                      setRiskAnswers([]);
                    }}
                  >
                    Refaire le test
                  </Button>
                </div>
              )}

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">Profil de risque actuel</p>
                    <p>
                      <strong>{formData.toleranceRisque ? formData.toleranceRisque.charAt(0).toUpperCase() + formData.toleranceRisque.slice(1) : 'Non défini'}</strong>
                      {formData.toleranceRisque === 'conservateur' && ' - Priorité à la préservation du capital'}
                      {formData.toleranceRisque === 'modere' && ' - Équilibre entre sécurité et croissance'}
                      {formData.toleranceRisque === 'dynamique' && ' - Acceptation de la volatilité pour la performance'}
                      {formData.toleranceRisque === 'agressif' && ' - Recherche de rendements élevés'}
                    </p>
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
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-lg py-6"
            size="lg"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Analyser ma stratégie d'investissement
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}