'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Wallet,
  Home,
  CreditCard,
  Target
} from 'lucide-react';

interface PatrimoineData {
  actifs: {
    liquidites: number;
    investissements: number;
    immobilier: number;
    prevoyance: number;
  };
  passifs: {
    hypotheque: number;
    credits: number;
    autresDettes: number;
  };
  patrimoine Net: number;
}

export default function PatrimoineOverview({ data }: { data: PatrimoineData }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalActifs =
    data.actifs.liquidites +
    data.actifs.investissements +
    data.actifs.immobilier +
    data.actifs.prevoyance;

  const totalPassifs =
    data.passifs.hypotheque +
    data.passifs.credits +
    data.passifs.autresDettes;

  const patrimoineNet = totalActifs - totalPassifs;
  const ratioEndettement = totalActifs > 0 ? (totalPassifs / totalActifs) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Vue synthétique */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Actifs */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Actifs totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(totalActifs)}
            </p>
          </CardContent>
        </Card>

        {/* Passifs */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Passifs totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-900">
              {formatCurrency(totalPassifs)}
            </p>
          </CardContent>
        </Card>

        {/* Patrimoine net */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Patrimoine net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatCurrency(patrimoineNet)}
            </p>
            <div className="mt-2">
              <Badge variant={ratioEndettement < 50 ? "default" : "destructive"} className="text-xs">
                Endettement: {ratioEndettement.toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition des actifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Répartition de vos actifs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Liquidités */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Liquidités & Épargne</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(data.actifs.liquidites)}</span>
            </div>
            <Progress
              value={(data.actifs.liquidites / totalActifs) * 100}
              className="h-2 bg-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              {((data.actifs.liquidites / totalActifs) * 100).toFixed(1)}% du total
            </p>
          </div>

          {/* Investissements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Investissements</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(data.actifs.investissements)}</span>
            </div>
            <Progress
              value={(data.actifs.investissements / totalActifs) * 100}
              className="h-2 bg-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              {((data.actifs.investissements / totalActifs) * 100).toFixed(1)}% du total
            </p>
          </div>

          {/* Immobilier */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Immobilier</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(data.actifs.immobilier)}</span>
            </div>
            <Progress
              value={(data.actifs.immobilier / totalActifs) * 100}
              className="h-2 bg-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              {((data.actifs.immobilier / totalActifs) * 100).toFixed(1)}% du total
            </p>
          </div>

          {/* Prévoyance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Prévoyance (2e & 3e pilier)</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(data.actifs.prevoyance)}</span>
            </div>
            <Progress
              value={(data.actifs.prevoyance / totalActifs) * 100}
              className="h-2 bg-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              {((data.actifs.prevoyance / totalActifs) * 100).toFixed(1)}% du total
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Passifs */}
      {totalPassifs > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Vos engagements financiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.passifs.hypotheque > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Hypothèque</span>
                <span className="text-sm font-semibold text-red-600">
                  {formatCurrency(data.passifs.hypotheque)}
                </span>
              </div>
            )}

            {data.passifs.credits > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Crédits</span>
                <span className="text-sm font-semibold text-red-600">
                  {formatCurrency(data.passifs.credits)}
                </span>
              </div>
            )}

            {data.passifs.autresDettes > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Autres dettes</span>
                <span className="text-sm font-semibold text-red-600">
                  {formatCurrency(data.passifs.autresDettes)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
