'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/lib/types/real-estate';
import { MortgageSimulationService } from '@/lib/services/real-estate/mortgage-simulation.service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Euro,
  Calculator,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Home,
  Calendar,
  Percent
} from 'lucide-react';

interface MortgageSimulatorModalProps {
  property: Property | null;
  open: boolean;
  onClose: () => void;
}

export function MortgageSimulatorModal({
  property,
  open,
  onClose
}: MortgageSimulatorModalProps) {
  const [downPayment, setDownPayment] = useState<number>(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(2.5);
  const [duration, setDuration] = useState<number>(20);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [simulation, setSimulation] = useState<any>(null);

  // R�initialiser les valeurs quand la propri�t� change
  useEffect(() => {
    if (property) {
      const initialDownPayment = Math.round(property.price * 0.20);
      setDownPayment(initialDownPayment);
      setDownPaymentPercent(20);
      setSimulation(null);
    }
  }, [property]);

  // Synchroniser l'apport en CHF et en %
  const updateDownPayment = (value: number) => {
    if (!property) return;
    setDownPayment(value);
    setDownPaymentPercent(Math.round((value / property.price) * 100));
  };

  const updateDownPaymentPercent = (percent: number) => {
    if (!property) return;
    const value = Math.round((property.price * percent) / 100);
    setDownPayment(value);
    setDownPaymentPercent(percent);
  };

  const calculateMortgage = () => {
    if (!property) return;

    try {
      const result = MortgageSimulationService.calculateMortgage({
        propertyPrice: property.price,
        downPayment: downPayment,
        interestRate: interestRate / 100,
        duration: duration,
        amortizationType: 'direct'
      });

      setSimulation(result);
    } catch (error) {
      console.error('Error calculating mortgage:', error);
    }
  };

  const canAfford = () => {
    if (!simulation || !monthlyIncome || monthlyIncome === 0) return null;

    const monthlyPayment = simulation.monthlyPayment;
    const affordabilityRatio = monthlyPayment / monthlyIncome;

    return {
      affordable: affordabilityRatio <= 0.33,
      ratio: affordabilityRatio,
      monthlyPayment,
      maxAffordable: monthlyIncome * 0.33
    };
  };

  const affordability = canAfford();

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            Simulateur de Cr�dit Hypoth�caire
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Home className="h-4 w-4" />
              <span className="font-medium">{property.title}</span>
            </div>
            <div className="flex items-center gap-2 text-lg font-bold text-blue-600 mt-1">
              <Euro className="h-5 w-5" />
              {property.price.toLocaleString()} CHF
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Formulaire de simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Apport personnel (CHF) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-gray-500" />
                Apport personnel (CHF)
              </Label>
              <Input
                type="number"
                value={downPayment}
                onChange={(e) => updateDownPayment(Number(e.target.value))}
                min={Math.round(property.price * 0.10)}
                max={property.price}
                step={10000}
              />
              <p className="text-xs text-gray-500">
                Minimum 20% ({Math.round(property.price * 0.20).toLocaleString()} CHF)
              </p>
            </div>

            {/* Apport personnel (%) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-gray-500" />
                Apport en %
              </Label>
              <Input
                type="number"
                value={downPaymentPercent}
                onChange={(e) => updateDownPaymentPercent(Number(e.target.value))}
                min={10}
                max={100}
                step={5}
              />
              <p className="text-xs text-gray-500">
                {downPaymentPercent >= 20 ? ' Conforme' : '� Insuffisant (min 20%)'}
              </p>
            </div>

            {/* Taux d'int�r�t */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                Taux d'int�r�t (%)
              </Label>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min={0.5}
                max={10}
                step={0.1}
              />
              <p className="text-xs text-gray-500">
                Taux moyen actuel: 2.5% - 3.5%
              </p>
            </div>

            {/* Dur�e */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Dur�e (ann�es)
              </Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={5}
                max={30}
                step={1}
              />
              <p className="text-xs text-gray-500">
                Maximum 25 ans recommand�
              </p>
            </div>

            {/* Revenu mensuel (optionnel) */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-gray-500" />
                Votre revenu mensuel net (optionnel)
              </Label>
              <Input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                min={0}
                step={500}
                placeholder="Ex: 8000"
              />
              <p className="text-xs text-gray-500">
                Pour calculer votre capacit� d'emprunt
              </p>
            </div>
          </div>

          {/* Bouton calculer */}
          <Button
            onClick={calculateMortgage}
            className="w-full"
            size="lg"
            disabled={downPaymentPercent < 20}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculer mon cr�dit
          </Button>

          {/* R�sultats */}
          {simulation && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">R�sultats de la simulation</h3>

              {/* Montant du cr�dit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Montant du cr�dit</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {simulation.loanAmount.toLocaleString()} CHF
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Mensualit�</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(simulation.monthlyPayment).toLocaleString()} CHF/mois
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Co�t total du cr�dit</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(simulation.totalCost).toLocaleString()} CHF
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Int�r�ts totaux</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(simulation.totalInterest).toLocaleString()} CHF
                  </p>
                </div>
              </div>

              {/* Affordabilit� */}
              {affordability && (
                <Alert className={affordability.affordable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                  <div className="flex items-start gap-3">
                    {affordability.affordable ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${affordability.affordable ? 'text-green-900' : 'text-red-900'}`}>
                        {affordability.affordable
                          ? 'Cr�dit compatible avec vos revenus'
                          : 'Attention: Mensualit� trop �lev�e'}
                      </h4>
                      <AlertDescription className={affordability.affordable ? 'text-green-700' : 'text-red-700'}>
                        <p className="text-sm">
                          Taux d'endettement: <strong>{(affordability.ratio * 100).toFixed(1)}%</strong>
                          {' '}(max recommand�: 33%)
                        </p>
                        <p className="text-sm mt-1">
                          Mensualit� maximale conseill�e: <strong>{Math.round(affordability.maxAffordable).toLocaleString()} CHF</strong>
                        </p>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Informations additionnelles */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                <p className="font-semibold text-gray-900">Informations importantes:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Frais de notaire estim�s: {Math.round(property.price * 0.01).toLocaleString()} CHF (1%)</li>
                  <li>Frais de registre: {Math.round(property.price * 0.005).toLocaleString()} CHF (0.5%)</li>
                  <li>Amortissement direct sur {duration} ans</li>
                  <li>Ces estimations sont indicatives et peuvent varier selon la banque</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          {simulation && (
            <Button onClick={() => window.print()}>
              Imprimer la simulation
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
