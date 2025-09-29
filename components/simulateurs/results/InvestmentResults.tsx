'use client';

import { InvestissementResults } from '@/types/simulators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  PieChart, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Wallet,
  Calendar,
  BarChart3,
  Briefcase,
  Award,
  ChevronRight
} from 'lucide-react';

interface InvestmentResultsProps {
  results: InvestissementResults;
  onNewCalculation: () => void;
}

export default function InvestmentResults({ results, onNewCalculation }: InvestmentResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'currency', 
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getVolatilityLevel = (volatility: number) => {
    if (volatility < 5) return { label: 'Très faible', color: 'bg-green-500' };
    if (volatility < 10) return { label: 'Faible', color: 'bg-green-400' };
    if (volatility < 15) return { label: 'Modérée', color: 'bg-yellow-500' };
    if (volatility < 20) return { label: 'Élevée', color: 'bg-orange-500' };
    return { label: 'Très élevée', color: 'bg-red-500' };
  };

  const volatilityInfo = getVolatilityLevel(results.analyse.volatilitePortefeuille);

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <Wallet className="w-5 h-5 mr-2" />
              <span className="text-sm opacity-90">Capital final estimé</span>
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(results.capitalFinal.modere)}
            </p>
            <div className="mt-2 text-xs opacity-75">
              <span>Min: {formatCurrency(results.capitalFinal.conservateur)}</span>
              <span className="mx-2">•</span>
              <span>Max: {formatCurrency(results.capitalFinal.dynamique)}</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="text-sm opacity-90">Rendement attendu</span>
            </div>
            <p className="text-3xl font-bold">
              {formatPercent(results.rendementAttendu.annuel)}
            </p>
            <p className="text-xs opacity-75 mt-2">
              Rendement total: {formatPercent(results.rendementAttendu.total)}
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 mr-2" />
              <span className="text-sm opacity-90">Probabilité de succès</span>
            </div>
            <p className="text-3xl font-bold">
              {results.analyse.probabiliteObjectifAtteint}%
            </p>
            <Progress 
              value={results.analyse.probabiliteObjectifAtteint} 
              className="mt-2 h-2 bg-white/20"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="allocation" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="produits">Produits</TabsTrigger>
          <TabsTrigger value="risques">Risques</TabsTrigger>
          <TabsTrigger value="fiscalite">Fiscalité</TabsTrigger>
          <TabsTrigger value="conseils">Conseils</TabsTrigger>
        </TabsList>

        {/* Allocation Tab */}
        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                Allocation optimale de votre portefeuille
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {results.allocationOptimale.map((asset, index) => {
                const colors = {
                  'liquidites': 'bg-blue-500',
                  'obligations': 'bg-green-500',
                  'actions': 'bg-purple-500',
                  'immobilier': 'bg-orange-500',
                  'matieresPremiere': 'bg-yellow-500',
                  'alternatifs': 'bg-pink-500'
                };
                
                const icons = {
                  'liquidites': Wallet,
                  'obligations': Shield,
                  'actions': TrendingUp,
                  'immobilier': Briefcase,
                  'matieresPremiere': BarChart3,
                  'alternatifs': Award
                };
                
                const Icon = icons[asset.classe as keyof typeof icons] || PieChart;
                const color = colors[asset.classe as keyof typeof colors] || 'bg-gray-500';
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="font-medium capitalize">{asset.classe}</span>
                        <span className="ml-2 text-2xl font-bold">{asset.pourcentage}%</span>
                      </div>
                    </div>
                    <Progress value={asset.pourcentage} className={`h-3 ${color}`} />
                    <p className="text-sm text-gray-600 mt-2">{asset.justification}</p>
                  </div>
                );
              })}
              
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
                  <p className="text-sm text-gray-700">
                    Cette allocation est optimisée pour votre profil de risque et vos objectifs. 
                    Elle vise à maximiser le rendement tout en maintenant un niveau de risque acceptable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Produits Tab */}
        <TabsContent value="produits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                Produits d'investissement recommandés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.produitsRecommandes.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-lg">{product.nom}</h3>
                          <Badge variant="secondary" className="ml-2">
                            {product.type}
                          </Badge>
                          {product.noteESG && (
                            <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                              ESG: {product.noteESG}
                            </Badge>
                          )}
                        </div>
                        
                        {product.isin && (
                          <p className="text-xs text-gray-500 mb-2">ISIN: {product.isin}</p>
                        )}
                        
                        <p className="text-sm text-gray-600 mb-3">{product.justification}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Frais de gestion:</span>
                            <p className="font-medium">{formatPercent(product.fraisGestion)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Rendement hist.:</span>
                            <p className="font-medium text-green-600">
                              {formatPercent(product.rendementHistorique)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Allocation:</span>
                            <p className="font-medium">{product.allocationPourcentage}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-purple-600 mt-0.5 mr-2" />
                  <p className="text-sm text-gray-700">
                    Ces produits ont été sélectionnés en fonction de votre profil et du marché suisse. 
                    Les frais de gestion sont optimisés pour maximiser votre rendement net.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risques Tab */}
        <TabsContent value="risques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Analyse des risques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Volatilité du portefeuille</span>
                      <Badge className={volatilityInfo.color}>
                        {volatilityInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{formatPercent(results.analyse.volatilitePortefeuille)}</span>
                    </div>
                    <Progress 
                      value={Math.min(results.analyse.volatilitePortefeuille * 3.33, 100)} 
                      className="mt-2 h-2"
                    />
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                      <span className="font-medium text-sm">Perte maximale estimée (VaR 95%)</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      -{formatPercent(results.analyse.perteMaximaleEstimee)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Dans 95% des cas, vos pertes ne dépasseront pas ce montant
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="font-medium text-sm">Probabilité d'atteindre l'objectif</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        {results.analyse.probabiliteObjectifAtteint}%
                      </span>
                      <Progress 
                        value={results.analyse.probabiliteObjectifAtteint} 
                        className="w-32 h-2"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm mb-2">Facteurs de risque principaux:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Fluctuations des marchés actions
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Risque de taux d'intérêt
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Inflation et pouvoir d'achat
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Risque de change (USD/EUR)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fiscalité Tab */}
        <TabsContent value="fiscalite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Impact fiscal et optimisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Impôt sur le revenu annuel estimé</span>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(results.impactsFiscaux.impotRevenuAnnuel)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Impôt sur la fortune</span>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(results.impactsFiscaux.impotFortune)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Stratégies d'optimisation fiscale
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {results.impactsFiscaux.strategieOptimisation.map((strategy, index) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight className="w-3 h-3 mt-0.5 mr-1 text-green-600" />
                        <span className="text-gray-700">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
                  <p className="text-sm text-gray-700">
                    Les estimations fiscales sont basées sur des taux moyens suisses. 
                    Consultez un conseiller fiscal pour une analyse personnalisée selon votre canton.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conseils Tab */}
        <TabsContent value="conseils" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-600" />
                Conseils de gestion personnalisés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Stratégie de rééquilibrage
                  </h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">
                      Périodicité recommandée: <span className="text-blue-600">{results.conseil.periodiciteRevision}</span>
                    </p>
                    <p className="text-sm text-gray-700">{results.conseil.rebalancement}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                    Signaux de sortie
                  </h4>
                  <ul className="space-y-2">
                    {results.conseil.signauxSortie.map((signal, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <ChevronRight className="w-3 h-3 mt-0.5 mr-1 text-orange-600" />
                        <span className="text-gray-700">{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3">Prochaines étapes recommandées:</h4>
                <div className="grid gap-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </span>
                    <span className="text-sm">
                      Ouvrir un compte de trading avec frais réduits auprès d'un broker suisse
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </span>
                    <span className="text-sm">
                      Mettre en place des virements automatiques mensuels pour l'épargne
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </span>
                    <span className="text-sm">
                      Programmer des révisions trimestrielles de votre portefeuille
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onNewCalculation}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nouvelle simulation
        </button>
        <button 
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Exporter PDF
        </button>
        <button 
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}