'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TaxCalculation {
  canton: string;
  year: number;
  taxableIncome: number;
  taxableWealth: number;
  federalTax: number;
  cantonalTax: number;
  communalTax: number;
  churchTax?: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  withheldTax: number;
  remainingTax: number;
}

interface TaxCalculationDisplayProps {
  calculation: TaxCalculation;
}

export function TaxCalculationDisplay({ calculation }: TaxCalculationDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  const getEffectiveRateColor = (rate: number) => {
    if (rate < 15) return 'text-green-600';
    if (rate < 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRemainderStatus = (remaining: number) => {
    if (remaining > 0) {
      return {
        icon: <AlertCircle className="h-4 w-4 text-orange-600" />,
        label: 'À payer',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      };
    } else if (remaining < 0) {
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
        label: 'Remboursement',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };
    } else {
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-blue-600" />,
        label: 'Équilibré',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      };
    }
  };

  const remainderStatus = getRemainderStatus(calculation.remainingTax);

  return (
    <div className="space-y-6">
      {/* Résumé principal */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calculator className="h-5 w-5" />
            Calcul fiscal {calculation.year} - Canton {calculation.canton}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(calculation.totalTax)}
              </div>
              <div className="text-sm text-blue-600">Impôt total</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${getEffectiveRateColor(calculation.effectiveRate)}`}>
                {formatPercentage(calculation.effectiveRate)}
              </div>
              <div className="text-sm text-gray-600">Taux effectif</div>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${remainderStatus.bgColor}`}>
              <div className={`text-2xl font-bold ${remainderStatus.color} flex items-center justify-center gap-2`}>
                {remainderStatus.icon}
                {formatCurrency(Math.abs(calculation.remainingTax))}
              </div>
              <div className="text-sm text-gray-600">{remainderStatus.label}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Décomposition détaillée */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base de calcul */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Base de calcul</CardTitle>
            <CardDescription>Montants soumis à l'imposition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Revenu imposable</span>
              <span className="font-semibold">{formatCurrency(calculation.taxableIncome)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Fortune imposable</span>
              <span className="font-semibold">{formatCurrency(calculation.taxableWealth)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Décomposition de l'impôt */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Décomposition de l'impôt</CardTitle>
            <CardDescription>Répartition par collectivité</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Impôt fédéral direct</span>
                <span className="font-medium">{formatCurrency(calculation.federalTax)}</span>
              </div>
              <Progress 
                value={(calculation.federalTax / calculation.totalTax) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Impôt cantonal</span>
                <span className="font-medium">{formatCurrency(calculation.cantonalTax)}</span>
              </div>
              <Progress 
                value={(calculation.cantonalTax / calculation.totalTax) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Impôt communal</span>
                <span className="font-medium">{formatCurrency(calculation.communalTax)}</span>
              </div>
              <Progress 
                value={(calculation.communalTax / calculation.totalTax) * 100} 
                className="h-2"
              />
            </div>
            
            {calculation.churchTax && calculation.churchTax > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Impôt ecclésiastique</span>
                  <span className="font-medium">{formatCurrency(calculation.churchTax)}</span>
                </div>
                <Progress 
                  value={(calculation.churchTax / calculation.totalTax) * 100} 
                  className="h-2"
                />
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>{formatCurrency(calculation.totalTax)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taux et comparaisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Taux d'imposition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <div>
                <div className="font-medium">Taux effectif</div>
                <div className="text-sm text-gray-600">Part des revenus prélevée par l'impôt</div>
              </div>
              <Badge variant="secondary" className="text-lg">
                {formatPercentage(calculation.effectiveRate)}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
              <div>
                <div className="font-medium">Taux marginal</div>
                <div className="text-sm text-gray-600">Impôt sur 1'000 CHF supplémentaires</div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-lg">
                  {formatPercentage(calculation.marginalRate)}
                </Badge>
                <div className="text-xs text-gray-500 mt-1">
                  {formatCurrency(calculation.marginalRate * 10)} / 1'000 CHF
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Situation de paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculation.withheldTax > 0 && (
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div>
                  <div className="font-medium">Impôt déjà prélevé</div>
                  <div className="text-sm text-gray-600">Retenu à la source</div>
                </div>
                <span className="font-semibold text-green-600">
                  {formatCurrency(calculation.withheldTax)}
                </span>
              </div>
            )}
            
            <div className={`flex justify-between items-center p-3 rounded ${remainderStatus.bgColor}`}>
              <div>
                <div className="font-medium">{remainderStatus.label}</div>
                <div className="text-sm text-gray-600">
                  {calculation.remainingTax > 0 
                    ? 'Montant à régler' 
                    : calculation.remainingTax < 0 
                    ? 'Montant remboursé'
                    : 'Situation équilibrée'
                  }
                </div>
              </div>
              <span className={`font-semibold ${remainderStatus.color} flex items-center gap-2`}>
                {remainderStatus.icon}
                {formatCurrency(Math.abs(calculation.remainingTax))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations contextuelles */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Rappel :</strong> Ce calcul est une estimation basée sur les barèmes fiscaux en vigueur. 
              Les montants définitifs peuvent varier selon la situation individuelle et les décisions cantonales.
            </p>
            <p>
              <strong>Échéances :</strong> La déclaration d'impôt doit généralement être déposée avant le 31 mars 
              (prolongation possible jusqu'au 30 septembre avec demande).
            </p>
            {calculation.remainingTax > 0 && (
              <p className="text-orange-600">
                <strong>Attention :</strong> Un solde d'impôt reste à payer. Prévoyez ce montant dans votre budget.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}