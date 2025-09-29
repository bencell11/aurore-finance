'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  Target,
  Calendar
} from 'lucide-react';

interface Optimization {
  type: string;
  title: string;
  description: string;
  savingAmount: number;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
  action?: string;
  effort?: 'easy' | 'medium' | 'complex';
  category?: 'pillar3a' | 'lpp_buyback' | 'professional_expenses' | 'donations' | 'life_insurance' | 'other';
}

interface TaxOptimizationSuggestionsProps {
  optimizations: Optimization[];
}

export function TaxOptimizationSuggestions({ optimizations }: TaxOptimizationSuggestionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-orange-200 bg-orange-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Urgent';
      case 'medium':
        return 'Important';
      case 'low':
        return 'Optionnel';
      default:
        return 'À considérer';
    }
  };

  const getEffortIcon = (effort?: string) => {
    switch (effort) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'complex':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'pillar3a':
        return '🏦';
      case 'lpp_buyback':
        return '💰';
      case 'professional_expenses':
        return '🚗';
      case 'donations':
        return '❤️';
      case 'life_insurance':
        return '🛡️';
      default:
        return '💡';
    }
  };

  const totalSavings = optimizations.reduce((sum, opt) => sum + opt.savingAmount, 0);
  const highPriorityCount = optimizations.filter(opt => opt.priority === 'high').length;
  const withDeadline = optimizations.filter(opt => opt.deadline).length;

  if (optimizations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-medium mb-2">Félicitations !</h3>
            <p>Votre situation fiscale semble déjà bien optimisée. Aucune amélioration majeure n'a été identifiée.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résumé des optimisations */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <TrendingUp className="h-5 w-5" />
            Potentiel d'optimisation fiscale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalSavings)}
              </div>
              <div className="text-sm text-green-700">Économie totale possible</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {optimizations.length}
              </div>
              <div className="text-sm text-blue-700">
                Optimisation{optimizations.length > 1 ? 's' : ''} identifiée{optimizations.length > 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {highPriorityCount}
              </div>
              <div className="text-sm text-red-700">Action{highPriorityCount > 1 ? 's' : ''} urgente{highPriorityCount > 1 ? 's' : ''}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes urgentes */}
      {withDeadline > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Calendar className="h-4 w-4" />
          <AlertDescription className="text-orange-900">
            <strong>Attention aux échéances !</strong> {withDeadline} optimisation{withDeadline > 1 ? 's ont' : ' a'} 
            des dates limites à respecter cette année.
          </AlertDescription>
        </Alert>
      )}

      {/* Liste des optimisations */}
      <div className="space-y-4">
        {optimizations
          .sort((a, b) => {
            // Tri par priorité, puis par montant d'économie
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[a.priority as keyof typeof priorityOrder] !== priorityOrder[b.priority as keyof typeof priorityOrder]) {
              return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
            }
            return b.savingAmount - a.savingAmount;
          })
          .map((optimization, index) => (
            <Card key={index} className={`${getPriorityColor(optimization.priority)} transition-all hover:shadow-md`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getCategoryIcon(optimization.category)}</div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {optimization.title}
                        {getPriorityIcon(optimization.priority)}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={optimization.priority === 'high' ? 'destructive' : 'secondary'}>
                          {getPriorityLabel(optimization.priority)}
                        </Badge>
                        {optimization.effort && (
                          <Badge variant="outline" className="text-xs">
                            {getEffortIcon(optimization.effort)} {optimization.effort}
                          </Badge>
                        )}
                        {optimization.deadline && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {optimization.deadline}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(optimization.savingAmount)}
                    </div>
                    <div className="text-sm text-gray-600">d'économie/an</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-base mb-4">
                  {optimization.description}
                </CardDescription>
                
                {optimization.action && (
                  <div className="p-3 bg-white rounded border-l-4 border-blue-500 mb-4">
                    <div className="font-medium text-blue-900 mb-1">Action recommandée :</div>
                    <div className="text-blue-800">{optimization.action}</div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>ROI: {((optimization.savingAmount / 1000) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{optimization.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant={optimization.priority === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      // Action à implémenter selon le type d'optimisation
                      console.log('Action pour:', optimization.type);
                    }}
                  >
                    {optimization.priority === 'high' ? 'Agir maintenant' : 'En savoir plus'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Projection sur 5 ans */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Projection sur 5 ans</CardTitle>
          <CardDescription className="text-blue-700">
            Impact cumulé de vos optimisations fiscales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {formatCurrency(totalSavings * 5)}
            </div>
            <div className="text-blue-700">
              Économie totale sur 5 ans (sans inflation)
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Équivalence :</strong> Ces économies représentent environ{' '}
                  <span className="font-semibold text-blue-600">
                    {Math.round((totalSavings * 5) / 12)} CHF par mois
                  </span>{' '}
                  pendant 5 ans.
                </p>
                <p>
                  Investir ce montant avec un rendement de 3% annuel pourrait générer 
                  un capital additionnel de{' '}
                  <span className="font-semibold text-green-600">
                    {formatCurrency(Math.round((totalSavings * 5) * 0.15))}
                  </span>.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan d'action recommandé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Plan d'action recommandé
          </CardTitle>
          <CardDescription>
            Ordre de priorité pour maximiser vos économies fiscales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="font-medium text-red-900">🔥 Actions immédiates (avant fin d'année)</div>
            <ul className="space-y-2 ml-4">
              {optimizations
                .filter(opt => opt.priority === 'high' && opt.deadline)
                .map((opt, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {opt.title} - {formatCurrency(opt.savingAmount)}
                  </li>
                ))}
            </ul>
            
            <div className="font-medium text-orange-900 mt-4">📋 Actions à court terme (1-3 mois)</div>
            <ul className="space-y-2 ml-4">
              {optimizations
                .filter(opt => opt.priority === 'medium')
                .map((opt, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {opt.title} - {formatCurrency(opt.savingAmount)}
                  </li>
                ))}
            </ul>
            
            <div className="font-medium text-green-900 mt-4">💡 Optimisations additionnelles</div>
            <ul className="space-y-2 ml-4">
              {optimizations
                .filter(opt => opt.priority === 'low')
                .map((opt, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {opt.title} - {formatCurrency(opt.savingAmount)}
                  </li>
                ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}