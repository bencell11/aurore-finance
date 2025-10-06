'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  PieChart,
  BarChart3,
  Calendar,
  Users,
  MessageCircle,
  Settings,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Zap
} from 'lucide-react';
import { UserProfileService } from '@/lib/services/user-profile.service';
import { GoalsService } from '@/lib/services/goals.service';
import { DashboardData, UserInsight, FinancialGoal } from '@/types/user';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const userProfileService = UserProfileService.getInstance();
  const goalsService = GoalsService.getInstance();

  useEffect(() => {
    // Attendre que l'auth soit chargé
    if (authLoading) return;

    if (user?.id) {
      loadDashboard();
    } else {
      // Si pas d'utilisateur après chargement auth, créer dashboard vide
      setDashboardData({
        capaciteEpargne: 0,
        tauxEpargne: 0,
        objectifsActifs: 0,
        objectifsTotal: 0,
        progressionMoyenne: 0,
        montantEpargneTotal: 0,
        montantObjectifTotal: 0
      });
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadDashboard = async () => {
    if (!user?.id) return;

    try {
      await userProfileService.loadFromStorage();
      await goalsService.loadFromStorage();

      const data = await userProfileService.getDashboardData(user.id);
      const userInsights = await userProfileService.generateFinancialInsights(user.id);
      const goalInsights = await goalsService.generateGoalInsights(user.id);

      // Si pas de données, créer un dashboard par défaut
      if (!data) {
        setDashboardData({
          capaciteEpargne: 0,
          tauxEpargne: 0,
          objectifsActifs: 0,
          objectifsTotal: 0,
          progressionMoyenne: 0,
          montantEpargneTotal: 0,
          montantObjectifTotal: 0
        });
      } else {
        setDashboardData(data);
      }

      setInsights([...userInsights, ...goalInsights]);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      // En cas d'erreur, créer un dashboard vide
      setDashboardData({
        capaciteEpargne: 0,
        tauxEpargne: 0,
        objectifsActifs: 0,
        objectifsTotal: 0,
        progressionMoyenne: 0,
        montantEpargneTotal: 0,
        montantObjectifTotal: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'currency', 
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      recommendation: Zap,
      alerte: AlertTriangle,
      opportunite: TrendingUp,
      analyse: BarChart3
    };
    return icons[type as keyof typeof icons] || Zap;
  };

  const getInsightColor = (priorite: string) => {
    const colors = {
      info: 'border-blue-200 bg-blue-50',
      warning: 'border-orange-200 bg-orange-50',
      urgent: 'border-red-200 bg-red-50'
    };
    return colors[priorite as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  const getPriorityIcon = (priorite: string) => {
    const icons = {
      info: CheckCircle,
      warning: AlertTriangle,
      urgent: AlertTriangle
    };
    return icons[priorite as keyof typeof icons] || CheckCircle;
  };

  const getPriorityColor = (priorite: string) => {
    const colors = {
      info: 'text-blue-600',
      warning: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priorite as keyof typeof colors] || 'text-blue-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur a un profil complet
  const hasCompleteProfile = user?.profil && user.profil.revenuBrutAnnuel > 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord
              </h1>
              <p className="text-lg text-gray-600">
                Vue d'ensemble de votre situation financière
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chatbot IA
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Bannière profil incomplet */}
        {!hasCompleteProfile && (
          <div className="mb-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <Users className="w-12 h-12 text-orange-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-orange-900 mb-1">
                      Complétez votre profil pour une expérience personnalisée
                    </h3>
                    <p className="text-orange-700 mb-3">
                      Ajoutez vos informations financières pour obtenir des analyses détaillées, des recommandations personnalisées et un suivi précis de vos objectifs.
                    </p>
                    <Button onClick={() => window.location.href = '/profil'} className="bg-orange-600 hover:bg-orange-700">
                      <Users className="w-4 h-4 mr-2" />
                      Configurer mon profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Patrimoine net</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.patrimoineNet)}
                  </p>
                  <p className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +2.3% ce mois
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Objectifs actifs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.objectifsActifs}
                  </p>
                  <p className="text-xs text-gray-600">
                    sur {dashboardData.objectifsTotal} total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <PieChart className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Progression moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.progressionMoyenne.toFixed(1)}%
                  </p>
                  <p className="text-xs text-purple-600">
                    Sur {dashboardData.objectifsActifs} objectifs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Bell className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertes actives</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {insights.filter(i => i.priorite === 'warning' || i.priorite === 'urgent').length}
                  </p>
                  <p className="text-xs text-orange-600">
                    {insights.filter(i => i.priorite === 'urgent').length} urgentes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="goals">Objectifs</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution du patrimoine */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Évolution du patrimoine
                  </CardTitle>
                  <CardDescription>
                    Évolution sur les 12 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.evolutionPatrimoine.slice(-6).map((point, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {point.date.toLocaleDateString('fr-CH', { month: 'short', year: 'numeric' })}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(point.valeur)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      Croissance positive de 2.3% ce mois
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Prochaines actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-600" />
                    Actions recommandées
                  </CardTitle>
                  <CardDescription>
                    Optimisations prioritaires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.prochainesToches.slice(0, 4).map((insight, index) => {
                      const Icon = getPriorityIcon(insight.priorite);
                      return (
                        <div key={insight.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                          <Icon className={`w-5 h-5 mt-0.5 ${getPriorityColor(insight.priorite)}`} />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{insight.titre}</p>
                            <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                            {insight.actionRecommandee && (
                              <Button size="sm" variant="outline" className="mt-2">
                                {insight.actionRecommandee}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Objectifs */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Mes objectifs financiers</h3>
              <Button onClick={() => window.location.href = '/objectifs'}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel objectif
              </Button>
            </div>

            {dashboardData.objectifsActifs.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun objectif défini
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Définissez vos premiers objectifs financiers pour commencer
                  </p>
                  <Button onClick={() => window.location.href = '/objectifs'}>
                    Créer un objectif
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboardData.objectifsActifs.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{goal.titre}</CardTitle>
                          <CardDescription>{goal.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{goal.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progression</span>
                            <span className="text-sm text-gray-600">
                              {formatCurrency(goal.montantActuel)} / {formatCurrency(goal.montantCible)}
                            </span>
                          </div>
                          <Progress value={goal.progressionPourcentage} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            {goal.progressionPourcentage.toFixed(1)}% atteint
                          </p>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Échéance:</span>
                          <span className="font-medium">
                            {new Date(goal.dateEcheance).toLocaleDateString('fr-CH')}
                          </span>
                        </div>
                        
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Analyses et recommandations</h3>
              <Badge variant="outline">
                {insights.length} insights disponibles
              </Badge>
            </div>

            {insights.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun insight disponible
                  </h3>
                  <p className="text-gray-600">
                    Complétez votre profil pour obtenir des analyses personnalisées
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {insights.map((insight) => {
                  const Icon = getInsightIcon(insight.type);
                  const PriorityIcon = getPriorityIcon(insight.priorite);
                  
                  return (
                    <Card key={insight.id} className={`border-l-4 ${getInsightColor(insight.priorite)}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                          <Icon className="w-6 h-6 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{insight.titre}</h4>
                              <PriorityIcon className={`w-4 h-4 ${getPriorityColor(insight.priorite)}`} />
                              <Badge variant="outline" className="text-xs">
                                {insight.type}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{insight.message}</p>
                            <div className="flex items-center space-x-3">
                              {insight.actionRecommandee && (
                                <Button size="sm" variant="outline">
                                  {insight.actionRecommandee}
                                </Button>
                              )}
                              <span className="text-xs text-gray-500">
                                {insight.dateGeneration.toLocaleDateString('fr-CH')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Activité */}
          <TabsContent value="activity" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Activité récente</h3>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Voir tout
              </Button>
            </div>

            <div className="space-y-3">
              {dashboardData.dernièresActions.slice(0, 10).map((action, index) => (
                <Card key={action.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {action.type === 'simulation' && 'Simulation réalisée'}
                          {action.type === 'objectif_cree' && 'Objectif créé'}
                          {action.type === 'contribution' && 'Contribution effectuée'}
                          {action.type === 'consultation_chatbot' && 'Consultation chatbot'}
                          {action.type === 'modification_profil' && 'Profil modifié'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {action.dateAction.toLocaleDateString('fr-CH')} à {action.dateAction.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {action.resultat || 'En cours'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  );
}