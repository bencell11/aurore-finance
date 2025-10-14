'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MortgageSimulationService } from '@/lib/services/real-estate/mortgage-simulation.service';
import type { MortgageSimulation } from '@/lib/types/real-estate';

interface MortgageSimulatorProps {
  propertyPrice: number;
  transactionType: 'rent' | 'buy';
  monthlyIncome?: number;
}

export default function MortgageSimulator({
  propertyPrice,
  transactionType,
  monthlyIncome
}: MortgageSimulatorProps) {
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2);
  const [downPaymentRatio, setDownPaymentRatio] = useState(20);
  const [duration, setDuration] = useState(20);
  const [interestRate, setInterestRate] = useState(MortgageSimulationService.getCurrentRate());
  const [simulation, setSimulation] = useState<MortgageSimulation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Calcul automatique
  useEffect(() => {
    if (transactionType !== 'buy') return;

    try {
      const sim = MortgageSimulationService.calculateMortgage({
        propertyPrice,
        downPayment,
        interestRate,
        duration,
        amortizationType: 'direct'
      });

      setSimulation(sim);
      setError(null);

      // Générer les recommandations si revenu fourni
      if (monthlyIncome) {
        const recs = MortgageSimulationService.generateRecommendations(
          monthlyIncome,
          downPayment,
          propertyPrice
        );
        setRecommendations(recs);
      }
    } catch (err: any) {
      setError(err.message);
      setSimulation(null);
    }
  }, [propertyPrice, downPayment, interestRate, duration, transactionType, monthlyIncome]);

  // Mise à jour du ratio quand l'apport change
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setDownPaymentRatio(Math.round((value / propertyPrice) * 100));
  };

  // Mise à jour de l'apport quand le ratio change
  const handleRatioChange = (value: number[]) => {
    const ratio = value[0];
    setDownPaymentRatio(ratio);
    setDownPayment(propertyPrice * (ratio / 100));
  };

  if (transactionType !== 'buy') {
    return null;
  }

  const affordability = simulation && monthlyIncome
    ? MortgageSimulationService.isAffordable(monthlyIncome, simulation)
    : null;

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Calculator className="h-5 w-5" />
          Simulateur de Crédit Hypothécaire
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Prix de la propriété */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <Label className="text-sm text-gray-600">Prix de la propriété</Label>
          <p className="text-2xl font-bold text-blue-700">
            {propertyPrice.toLocaleString()} CHF
          </p>
        </div>

        {/* Apport */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Apport ({downPaymentRatio}%)</Label>
            <Badge variant={downPaymentRatio >= 20 ? 'default' : 'destructive'}>
              {downPaymentRatio >= 20 ? '✓ Valide' : '✗ Minimum 20%'}
            </Badge>
          </div>

          <Slider
            value={[downPaymentRatio]}
            onValueChange={handleRatioChange}
            min={10}
            max={50}
            step={5}
            className="w-full"
          />

          <Input
            type="number"
            value={Math.round(downPayment)}
            onChange={(e) => handleDownPaymentChange(parseInt(e.target.value) || 0)}
            className="text-lg font-semibold"
          />

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Minimum légal: {Math.round(propertyPrice * 0.2).toLocaleString()} CHF (20%)</p>
            <p>• Recommandé: {Math.round(propertyPrice * 0.3).toLocaleString()} CHF (30%)</p>
          </div>
        </div>

        {/* Durée */}
        <div className="space-y-3">
          <Label>Durée du crédit ({duration} ans)</Label>
          <Slider
            value={[duration]}
            onValueChange={(value) => setDuration(value[0])}
            min={5}
            max={30}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 ans</span>
            <span>15 ans</span>
            <span>30 ans</span>
          </div>
        </div>

        {/* Taux d'intérêt */}
        <div className="space-y-2">
          <Label>Taux d'intérêt ({(interestRate * 100).toFixed(2)}%)</Label>
          <Input
            type="number"
            step="0.1"
            value={(interestRate * 100).toFixed(2)}
            onChange={(e) => setInterestRate(parseFloat(e.target.value) / 100 || 0)}
          />
          <p className="text-xs text-gray-500">
            Taux actuel (SARON + marge): {(MortgageSimulationService.getCurrentRate() * 100).toFixed(2)}%
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Résultats */}
        {simulation && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Résultats de la simulation</h3>

            {/* Montant du prêt */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm text-gray-600">Montant du prêt</Label>
              <p className="text-xl font-bold">
                {simulation.loanAmount.toLocaleString()} CHF
              </p>
            </div>

            {/* Mensualité */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <Label className="text-sm text-gray-600">Mensualité (intérêts + amortissement)</Label>
              <p className="text-2xl font-bold text-blue-700">
                {Math.round(simulation.monthlyPayment).toLocaleString()} CHF/mois
              </p>
            </div>

            {/* Coût total mensuel */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <Label className="text-sm text-gray-600">Coût total mensuel (avec entretien)</Label>
              <p className="text-2xl font-bold text-purple-700">
                {Math.round(simulation.breakdown.totalMonthlyCost).toLocaleString()} CHF/mois
              </p>
              <div className="text-xs text-gray-600 mt-2 space-y-1">
                <p>• Intérêts: {Math.round(simulation.breakdown.monthlyInterest).toLocaleString()} CHF</p>
                <p>• Amortissement: {Math.round(simulation.breakdown.monthlyAmortization).toLocaleString()} CHF</p>
                <p>• Entretien: {Math.round(simulation.breakdown.monthlyMaintenance).toLocaleString()} CHF</p>
              </div>
            </div>

            {/* Affordabilité */}
            {affordability && (
              <div className={`p-4 rounded-lg ${
                affordability.affordable
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">Affordabilité</Label>
                  <Badge variant={affordability.affordable ? 'default' : 'destructive'}>
                    {affordability.affordable ? '✓ Abordable' : '✗ Non abordable'}
                  </Badge>
                </div>
                <p className={`text-xl font-bold ${
                  affordability.affordable ? 'text-green-700' : 'text-red-700'
                }`}>
                  {Math.round(affordability.utilizationRate * 100)}% du revenu
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Maximum recommandé: 33% du revenu brut
                </p>
                {!affordability.affordable && (
                  <Alert className="mt-3" variant="destructive">
                    <AlertDescription>
                      Il manque {Math.round(affordability.shortfall).toLocaleString()} CHF/mois par rapport à vos revenus.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Coûts initiaux */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <Label className="text-sm text-gray-600">Coûts initiaux totaux</Label>
              <p className="text-xl font-bold text-yellow-700">
                {Math.round(simulation.breakdown.totalInitialCost).toLocaleString()} CHF
              </p>
              <div className="text-xs text-gray-600 mt-2 space-y-1">
                <p>• Apport: {Math.round(simulation.downPayment).toLocaleString()} CHF</p>
                <p>• Frais de notaire: {Math.round(simulation.breakdown.notaryFees).toLocaleString()} CHF</p>
                <p>• Frais de registre: {Math.round(simulation.breakdown.registrationFees).toLocaleString()} CHF</p>
              </div>
            </div>

            {/* Coût total */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <Label className="text-sm text-gray-600">Coût total sur {duration} ans</Label>
              <p className="text-xl font-bold">
                {Math.round(simulation.totalCost).toLocaleString()} CHF
              </p>
              <p className="text-sm text-gray-600 mt-1">
                dont {Math.round(simulation.totalInterest).toLocaleString()} CHF d'intérêts
              </p>
            </div>

            {/* Revenu minimum requis */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Label className="text-sm text-gray-600">Revenu annuel minimum requis</Label>
              <p className="text-xl font-bold text-orange-700">
                {Math.round(simulation.breakdown.minAnnualIncome).toLocaleString()} CHF/an
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Soit {Math.round(simulation.breakdown.minAnnualIncome / 12).toLocaleString()} CHF/mois
              </p>
            </div>
          </div>
        )}

        {/* Recommandations */}
        {recommendations.length > 0 && (
          <div className="pt-4 border-t space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              Recommandations
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <Alert key={idx} className="py-2">
                  <AlertDescription className="text-sm">{rec}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
