'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserMenu from '@/components/auth/UserMenu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Home,
  Calculator,
  TrendingUp,
  PiggyBank,
  Info,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MortgageCalculatorService,
  type MortgageInput,
  type MortgageResult,
  type AffordabilityResult,
  type SavingsPlanResult
} from '@/lib/services/mortgage-calculator.service';

export default function RechercheImmobilierePage() {
  const [mode, setMode] = useState<'affordability' | 'feasibility'>('affordability');

  // Mode 1: Budget selon revenus
  const [affordabilityInput, setAffordabilityInput] = useState({
    revenuBrutAnnuel: 80000,
    revenuConjoint: 0,
    fondsPropresCash: 50000,
    lpp2ePilier: 0,
    pilier3a: 0,
    valeurRachat3a: 0,
    donationHeritage: 0,
    age: 35,
    ageConjoint: 0,
    nombreEnfants: 0,
    chargesExistantes: 0,
  });

  // Mode 2: Faisabilité d'un bien
  const [feasibilityInput, setFeasibilityInput] = useState({
    prixBien: 800000,
    revenuBrutAnnuel: 80000,
    revenuConjoint: 0,
    fondsPropresCash: 50000,
    lpp2ePilier: 0,
    pilier3a: 0,
    valeurRachat3a: 0,
    donationHeritage: 0,
    age: 35,
    ageConjoint: 0,
    nombreEnfants: 0,
    chargesExistantes: 0,
  });

  const [affordabilityResult, setAffordabilityResult] = useState<AffordabilityResult | null>(null);
  const [feasibilityResult, setFeasibilityResult] = useState<MortgageResult | null>(null);
  const [savingsPlan, setSavingsPlan] = useState<SavingsPlanResult | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateAffordability = () => {
    const result = MortgageCalculatorService.calculateAffordability(affordabilityInput);
    setAffordabilityResult(result);
  };

  const calculateFeasibility = () => {
    const result = MortgageCalculatorService.calculateMortgage(feasibilityInput);
    setFeasibilityResult(result);

    // Si manque de fonds propres, calculer plan d'épargne
    if (result.manqueFondsPropresCash && result.manqueFondsPropresCash > 0) {
      const revenuMensuel = (feasibilityInput.revenuBrutAnnuel + (feasibilityInput.revenuConjoint || 0)) / 12;
      const epargneMensuelle = revenuMensuel * 0.10; // 10% d'épargne suggéré

      const plan = MortgageCalculatorService.calculateSavingsPlan(
        result.manqueFondsPropresCash,
        epargneMensuelle
      );
      setSavingsPlan(plan);
    } else {
      setSavingsPlan(null);
    }
  };

  const calculateRent = (prixBien: number, fondsPropresTotaux: number) => {
    return MortgageCalculatorService.calculateTheoreticalRent(prixBien, fondsPropresTotaux);
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
                    <Home className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">
                      Recherche Immobilière
                    </h1>
                  </div>
                  <p className="text-lg text-gray-600 mt-2">
                    Calculez votre capacité d'emprunt et la faisabilité de votre projet immobilier
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
                      Calculs selon les normes FINMA 2025
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Fonds propres minimum: 20% (dont 10% en cash)</li>
                      <li>• Taux d'endettement maximum: 33% du revenu brut</li>
                      <li>• Taux d'intérêt théorique: 5% (pour le calcul)</li>
                      <li>• Amortissement 2ème rang: 15 ans</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs pour les 2 modes */}
            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="affordability" className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Mon budget maximal
                </TabsTrigger>
                <TabsTrigger value="feasibility" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Faisabilité d'un bien
                </TabsTrigger>
              </TabsList>

              {/* MODE 1: Budget maximal selon revenus */}
              <TabsContent value="affordability" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quel bien immobilier puis-je acheter?</CardTitle>
                    <CardDescription>
                      Calculez votre budget maximal en fonction de vos revenus et fonds propres
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Revenus */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Revenus du ménage
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="revenu-brut">Revenu brut annuel (CHF)</Label>
                          <Input
                            id="revenu-brut"
                            type="number"
                            value={affordabilityInput.revenuBrutAnnuel}
                            onChange={(e) => setAffordabilityInput({
                              ...affordabilityInput,
                              revenuBrutAnnuel: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="revenu-conjoint">Revenu conjoint (CHF)</Label>
                          <Input
                            id="revenu-conjoint"
                            type="number"
                            value={affordabilityInput.revenuConjoint}
                            onChange={(e) => setAffordabilityInput({
                              ...affordabilityInput,
                              revenuConjoint: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fonds propres */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <PiggyBank className="w-5 h-5 text-blue-600" />
                        Fonds propres disponibles
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="flex items-center gap-1">
                            Épargne cash (CHF)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-gray-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Minimum 10% du prix doit être en cash</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            type="number"
                            value={affordabilityInput.fondsPropresCash}
                            onChange={(e) => setAffordabilityInput({
                              ...affordabilityInput,
                              fondsPropresCash: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <Label className="flex items-center gap-1">
                            LPP - 2ème pilier (CHF)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-gray-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Utilisable seulement jusqu'à 50 ans</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            type="number"
                            value={affordabilityInput.lpp2ePilier}
                            onChange={(e) => setAffordabilityInput({
                              ...affordabilityInput,
                              lpp2ePilier: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <Label>Pilier 3a disponible (CHF)</Label>
                          <Input
                            type="number"
                            value={affordabilityInput.pilier3a}
                            onChange={(e) => setAffordabilityInput({
                              ...affordabilityInput,
                              pilier3a: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <Label>Donation/Héritage (CHF)</Label>
                          <Input
                            type="number"
                            value={affordabilityInput.donationHeritage}
                            onChange={(e) => setAffordabilityInput({
                              ...affordabilityInput,
                              donationHeritage: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Autres informations */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Autres informations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Âge</Label>
                          <Input
                            type="number"
                            value={affordabilityInput.age}
                            onChange={(e) => setAffordabilityInput({
                              ...affordabilityInput,
                              age: parseInt(e.target.value) || 35
                            })}
                          />
                        </div>
                        <div>
                          <Label>Nombre d'enfants</Label>
                          <Input
                            type="number"
                            value={affordabilityInput.nombreEnfants}
                            onChange={(e) => setAffordabilityInput({
                              ...affordabilityInput,
                              nombreEnfants: parseInt(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <Label>Charges existantes (CHF/an)</Label>
                          <Input
                            type="number"
                            value={affordabilityInput.chargesExistantes}
                            onChange={(e) => setAffordabilityInput({
                              ...affordabilityInput,
                              chargesExistantes: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={calculateAffordability}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculer mon budget maximal
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Résultats Mode 1 */}
                {affordabilityResult && (
                  <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-6 h-6" />
                        Votre budget immobilier
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Budget maximal */}
                      <div className="bg-white rounded-lg p-6 shadow-md">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Budget maximal</p>
                          <p className="text-4xl font-bold text-green-600">
                            {formatCurrency(affordabilityResult.budgetMaximal)}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Fonds propres minimum requis: {formatCurrency(affordabilityResult.fondsPropresMini)}
                          </p>
                        </div>
                      </div>

                      {/* Exemples de biens */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Exemples de biens dans votre budget</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {affordabilityResult.exemplesBiens.map((bien, idx) => {
                            const rent = calculateRent(bien.prix, affordabilityResult.fondsPropresMini);
                            return (
                              <Card key={idx}>
                                <CardContent className="pt-6">
                                  <p className="text-lg font-bold text-gray-900">{formatCurrency(bien.prix)}</p>
                                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                                    <p>Hypothèque: {formatCurrency(bien.hypotheque)}</p>
                                    <p className="font-semibold text-blue-600 mt-2">
                                      Charges: {formatCurrency(rent.chargesMensuelles)}/mois
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* MODE 2: Faisabilité d'un bien spécifique */}
              <TabsContent value="feasibility" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ce bien est-il à ma portée?</CardTitle>
                    <CardDescription>
                      Vérifiez si un bien immobilier spécifique est financièrement accessible
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Prix du bien */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Home className="w-5 h-5 text-blue-600" />
                        Le bien immobilier
                      </h3>
                      <div>
                        <Label htmlFor="prix-bien">Prix du bien (CHF)</Label>
                        <Input
                          id="prix-bien"
                          type="number"
                          value={feasibilityInput.prixBien}
                          onChange={(e) => setFeasibilityInput({
                            ...feasibilityInput,
                            prixBien: parseFloat(e.target.value) || 0
                          })}
                          className="text-lg font-semibold"
                        />
                      </div>
                    </div>

                    {/* Revenus */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Vos revenus
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Revenu brut annuel (CHF)</Label>
                          <Input
                            type="number"
                            value={feasibilityInput.revenuBrutAnnuel}
                            onChange={(e) => setFeasibilityInput({
                              ...feasibilityInput,
                              revenuBrutAnnuel: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <Label>Revenu conjoint (CHF)</Label>
                          <Input
                            type="number"
                            value={feasibilityInput.revenuConjoint}
                            onChange={(e) => setFeasibilityInput({
                              ...feasibilityInput,
                              revenuConjoint: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fonds propres */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <PiggyBank className="w-5 h-5 text-blue-600" />
                        Vos fonds propres
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Épargne cash (CHF)</Label>
                          <Input
                            type="number"
                            value={feasibilityInput.fondsPropresCash}
                            onChange={(e) => setFeasibilityInput({
                              ...feasibilityInput,
                              fondsPropresCash: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <Label>LPP - 2ème pilier (CHF)</Label>
                          <Input
                            type="number"
                            value={feasibilityInput.lpp2ePilier}
                            onChange={(e) => setFeasibilityInput({
                              ...feasibilityInput,
                              lpp2ePilier: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <Label>Pilier 3a (CHF)</Label>
                          <Input
                            type="number"
                            value={feasibilityInput.pilier3a}
                            onChange={(e) => setFeasibilityInput({
                              ...feasibilityInput,
                              pilier3a: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <Label>Donation/Héritage (CHF)</Label>
                          <Input
                            type="number"
                            value={feasibilityInput.donationHeritage}
                            onChange={(e) => setFeasibilityInput({
                              ...feasibilityInput,
                              donationHeritage: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={calculateFeasibility}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Vérifier la faisabilité
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Résultats Mode 2 */}
                {feasibilityResult && (
                  <div className="space-y-6">
                    {/* Verdict principal */}
                    <Card className={feasibilityResult.faisable
                      ? 'border-green-200 bg-gradient-to-br from-green-50 to-blue-50'
                      : 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50'
                    }>
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${feasibilityResult.faisable ? 'text-green-700' : 'text-red-700'}`}>
                          {feasibilityResult.faisable ? (
                            <>
                              <CheckCircle2 className="w-6 h-6" />
                              Achat faisable !
                            </>
                          ) : (
                            <>
                              <XCircle className="w-6 h-6" />
                              Achat non faisable actuellement
                            </>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Détails fonds propres */}
                        <div className="bg-white rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 mb-4">Fonds propres</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Minimum requis (20%)</p>
                              <p className="text-lg font-bold">{formatCurrency(feasibilityResult.fondsPropresMini)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Vos fonds propres</p>
                              <p className={`text-lg font-bold ${
                                feasibilityResult.fondsPropresTotaux >= feasibilityResult.fondsPropresMini
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}>
                                {formatCurrency(feasibilityResult.fondsPropresTotaux)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Cash minimum (10%)</p>
                              <p className="text-lg font-bold">{formatCurrency(feasibilityInput.prixBien * 0.10)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Votre cash</p>
                              <p className={`text-lg font-bold ${
                                feasibilityResult.fondsPropresCash >= feasibilityInput.prixBien * 0.10
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}>
                                {formatCurrency(feasibilityResult.fondsPropresCash)}
                              </p>
                            </div>
                          </div>

                          {feasibilityResult.manqueFondsPropresCash && feasibilityResult.manqueFondsPropresCash > 0 && (
                            <div className="mt-4 p-4 bg-red-50 rounded-lg">
                              <p className="text-sm font-semibold text-red-800">
                                ⚠️ Manque {formatCurrency(feasibilityResult.manqueFondsPropresCash)} en cash
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Hypothèque et charges */}
                        <div className="bg-white rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 mb-4">Hypothèque et charges mensuelles</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Hypothèque totale</span>
                              <span className="font-semibold">{formatCurrency(feasibilityResult.montantHypotheque)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">• 1er rang (65%)</span>
                              <span>{formatCurrency(feasibilityResult.hypotheque1erRang)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">• 2ème rang (15%)</span>
                              <span>{formatCurrency(feasibilityResult.hypotheque2emeRang)}</span>
                            </div>

                            <div className="border-t pt-3 mt-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Charges annuelles</span>
                                <span className="font-semibold">{formatCurrency(feasibilityResult.chargesAnnuelles)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">• Intérêts (5%)</span>
                                <span>{formatCurrency(feasibilityResult.interetsHypotheque)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">• Amortissement 2ème rang</span>
                                <span>{formatCurrency(feasibilityResult.amortissement2emeRang)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">• Entretien (1%)</span>
                                <span>{formatCurrency(feasibilityResult.entretenReparations)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">• Charges (0.2%)</span>
                                <span>{formatCurrency(feasibilityResult.chargesAccessoires)}</span>
                              </div>
                            </div>

                            <div className="border-t pt-3 mt-3 bg-blue-50 p-3 rounded">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Charges mensuelles théoriques</span>
                                <span className="text-xl font-bold text-blue-600">
                                  {formatCurrency(feasibilityResult.chargesAnnuelles / 12)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Capacité financière */}
                        <div className="bg-white rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 mb-4">Capacité financière</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Revenu total du ménage</span>
                              <span className="font-semibold">{formatCurrency(feasibilityResult.revenuMenageTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Taux d'endettement</span>
                              <span className={`font-bold text-lg ${
                                feasibilityResult.tauxEndettement <= 0.33 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {(feasibilityResult.tauxEndettement * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Maximum autorisé: 33% du revenu brut
                            </div>

                            {feasibilityResult.manqueCapacite && feasibilityResult.manqueCapacite > 0 && (
                              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                                <p className="text-sm font-semibold text-red-800">
                                  ⚠️ Dépassement de {formatCurrency(feasibilityResult.manqueCapacite)}/an
                                </p>
                                <p className="text-xs text-red-600 mt-1">
                                  Vos charges dépassent 33% de votre revenu brut
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Plan d'épargne si manque de fonds */}
                    {savingsPlan && (
                      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-purple-700">
                            <PiggyBank className="w-6 h-6" />
                            Plan d'épargne personnalisé
                          </CardTitle>
                          <CardDescription>
                            Combien de temps pour économiser les {formatCurrency(savingsPlan.montantManquant)} manquants ?
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="bg-white rounded-lg p-6">
                            <p className="text-sm text-gray-600 mb-4">
                              Avec une épargne mensuelle de <span className="font-semibold">{formatCurrency(savingsPlan.epargneMensuelle)}</span>:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-50 rounded p-4">
                                <p className="text-xs text-gray-600 mb-1">Sans investissement</p>
                                <p className="text-2xl font-bold text-gray-900">
                                  {Math.floor(savingsPlan.moisNecessaires.sansInvestissement / 12)} ans {savingsPlan.moisNecessaires.sansInvestissement % 12} mois
                                </p>
                              </div>
                              <div className="bg-green-50 rounded p-4">
                                <p className="text-xs text-gray-600 mb-1">Avec investissement 5%</p>
                                <p className="text-2xl font-bold text-green-600">
                                  {Math.floor(savingsPlan.moisNecessaires.avecInvestissement5 / 12)} ans {savingsPlan.moisNecessaires.avecInvestissement5 % 12} mois
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                  Gain: {savingsPlan.moisNecessaires.sansInvestissement - savingsPlan.moisNecessaires.avecInvestissement5} mois
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </TooltipProvider>
    </ProtectedRoute>
  );
}
