'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImpotsResults } from '@/types/simulators';
import { 
  TrendingDown, 
  TrendingUp, 
  Calculator, 
  PieChart, 
  Target, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';

interface TaxResultsProps {
  results: ImpotsResults;
  onOptimize?: (suggestion: any) => void;
  onNewCalculation?: () => void;
}

export default function TaxResults({ results, onOptimize, onNewCalculation }: TaxResultsProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-CH', { 
      style: 'currency', 
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'favorable': return 'text-green-600 bg-green-100';
      case 'elevee': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getPositionText = (position: string) => {
    switch (position) {
      case 'favorable': return 'Favorable';
      case 'elevee': return 'Élevée';
      default: return 'Moyenne';
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé principal */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <span>Résultats de votre simulation fiscale</span>
          </CardTitle>
          <CardDescription className="text-base">
            Analyse complète de votre situation fiscale suisse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Impôts totaux</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.totalImpots)}</p>
              <p className="text-sm text-gray-500">par année</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Taux moyen</p>
              <p className="text-2xl font-bold text-blue-600">{results.tauxMoyen.toFixed(1)}%</p>
              <Badge className={`mt-1 ${getPositionColor(results.positionRelative)}`}>
                {getPositionText(results.positionRelative)}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Taux marginal</p>
              <p className="text-2xl font-bold text-purple-600">{results.tauxMarginal.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">prochain franc</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Revenu net</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(results.revenuImposable - results.totalImpots)}
              </p>
              <p className="text-sm text-gray-500">après impôts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="repartition" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="repartition">Répartition</TabsTrigger>
          <TabsTrigger value="tranches">Tranches</TabsTrigger>
          <TabsTrigger value="optimisation">Optimisation</TabsTrigger>
          <TabsTrigger value="comparaison">Comparaison</TabsTrigger>
        </TabsList>

        {/* Onglet Répartition */}
        <TabsContent value="repartition" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <span>Répartition des impôts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Impôt fédéral direct</span>
                    <span className="font-bold">{formatCurrency(results.impotFederal)}</span>
                  </div>
                  <Progress 
                    value={(results.impotFederal / results.totalImpots) * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Impôt cantonal</span>
                    <span className="font-bold">{formatCurrency(results.impotCantonal)}</span>
                  </div>
                  <Progress 
                    value={(results.impotCantonal / results.totalImpots) * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Impôt communal</span>
                    <span className="font-bold">{formatCurrency(results.impotCommunal)}</span>
                  </div>
                  <Progress 
                    value={(results.impotCommunal / results.totalImpots) * 100} 
                    className="h-2"
                  />
                  
                  {results.impotEglise && results.impotEglise > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Impôt ecclésiastique</span>
                        <span className="font-bold">{formatCurrency(results.impotEglise)}</span>
                      </div>
                      <Progress 
                        value={(results.impotEglise / results.totalImpots) * 100} 
                        className="h-2"
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Charge fiscale mensuelle</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(results.totalImpots / 12)}
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Fédéral</span>
                      <span>{formatCurrency(results.impotFederal / 12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cantonal + Communal</span>
                      <span>{formatCurrency((results.impotCantonal + results.impotCommunal) / 12)}</span>
                    </div>
                    {results.impotEglise && results.impotEglise > 0 && (
                      <div className="flex justify-between">
                        <span>Église</span>
                        <span>{formatCurrency(results.impotEglise / 12)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Tranches */}
        <TabsContent value="tranches" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tranches d'imposition fédérales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.tranchesFederales.map((tranche, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">
                          {formatCurrency(tranche.de)} - {tranche.a === Infinity ? '∞' : formatCurrency(tranche.a)}
                        </span>
                        <Badge variant="outline">{tranche.taux}%</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Montant: {formatCurrency(tranche.montantTranche)}</span>
                        <span>Impôt: {formatCurrency(tranche.impotTranche)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tranches d'imposition cantonales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.tranchesCantonales.map((tranche, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">
                          {formatCurrency(tranche.de)} - {tranche.a === Infinity ? '∞' : formatCurrency(tranche.a)}
                        </span>
                        <Badge variant="outline">{tranche.taux}%</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Montant: {formatCurrency(tranche.montantTranche)}</span>
                        <span>Impôt: {formatCurrency(tranche.impotTranche)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Optimisation */}
        <TabsContent value="optimisation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <span>Suggestions d'optimisation</span>
              </CardTitle>
              <CardDescription>
                Découvrez comment réduire vos impôts légalement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.economiesPossibles.map((suggestion, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{suggestion.titre}</h4>
                          <Badge 
                            variant={suggestion.priorite === 'haute' ? 'destructive' : 
                                   suggestion.priorite === 'moyenne' ? 'default' : 'secondary'}
                          >
                            {suggestion.priorite}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        <p className="text-sm font-medium text-blue-600">{suggestion.actionRequise}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-600">Économie annuelle</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(suggestion.economieAnnuelle)}
                        </p>
                      </div>
                    </div>
                    
                    {onOptimize && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onOptimize(suggestion)}
                        className="w-full"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Appliquer cette optimisation
                      </Button>
                    )}
                  </div>
                ))}
                
                {results.economiesPossibles.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">Optimisation excellente !</h3>
                    <p className="text-gray-600">Votre situation fiscale semble déjà bien optimisée.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Comparaison */}
        <TabsContent value="comparaison" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison suisse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Votre charge fiscale</span>
                    <span className="text-lg font-bold">{results.chargeReelle.toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Moyenne suisse</span>
                    <span className="text-lg font-bold text-blue-600">{results.chargeMoyenneSuisse.toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
                    {results.positionRelative === 'favorable' ? (
                      <TrendingDown className="w-5 h-5 text-green-600" />
                    ) : results.positionRelative === 'elevee' ? (
                      <TrendingUp className="w-5 h-5 text-red-600" />
                    ) : (
                      <Target className="w-5 h-5 text-blue-600" />
                    )}
                    <div>
                      <p className="font-medium">Position relative</p>
                      <p className="text-sm text-gray-600">
                        {results.positionRelative === 'favorable' 
                          ? 'Votre charge fiscale est favorable comparée à la moyenne suisse'
                          : results.positionRelative === 'elevee'
                          ? 'Votre charge fiscale est plus élevée que la moyenne suisse'
                          : 'Votre charge fiscale est dans la moyenne suisse'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations complémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">Revenu imposable</h4>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.revenuImposable)}</p>
                  <p className="text-sm text-blue-700">après déductions</p>
                </div>
                
                {results.fortuneImposable > 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-1">Fortune imposable</h4>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(results.fortuneImposable)}</p>
                    <p className="text-sm text-purple-700">après franchise</p>
                  </div>
                )}
                
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important</p>
                      <p>Cette simulation est indicative. Les montants réels peuvent varier selon votre commune et votre situation exacte.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onNewCalculation && (
              <Button variant="outline" size="lg" onClick={onNewCalculation}>
                <Calculator className="w-5 h-5 mr-2" />
                Nouvelle simulation
              </Button>
            )}
            
            <Button variant="outline" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Télécharger PDF
            </Button>
            
            <Button variant="outline" size="lg">
              <Share2 className="w-5 h-5 mr-2" />
              Partager
            </Button>
            
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              <ArrowRight className="w-5 h-5 mr-2" />
              Consulter un expert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}