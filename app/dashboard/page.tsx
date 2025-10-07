'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
        patrimoineNet: 0,
        evolutionPatrimoine: [],
        objectifsActifs: [],
        prochainesToches: [],
        dernièresActions: [],
        performanceObjectifs: {
          enCours: 0,
          atteints: 0,
          enRetard: 0
        }
      });
      setLoading(false);
    }
  }, [user, authLoading]);

  // Détecter le paramètre refreshProfile pour forcer le rechargement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('refreshProfile') === 'true' && user?.id) {
        // Forcer le rechargement des données
        setTimeout(() => loadDashboard(), 500);
        // Nettoyer l'URL
        window.history.replaceState({}, '', '/dashboard');
      }
    }
  }, [user]);

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
          patrimoineNet: 0,
          evolutionPatrimoine: [],
          objectifsActifs: [],
          prochainesToches: [],
          dernièresActions: [],
          performanceObjectifs: {
            enCours: 0,
            atteints: 0,
            enRetard: 0
          }
        });
      } else {
        setDashboardData(data);
      }

      setInsights([...userInsights, ...goalInsights]);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      // En cas d'erreur, créer un dashboard vide
      setDashboardData({
        patrimoineNet: 0,
        evolutionPatrimoine: [],
        objectifsActifs: [],
        prochainesToches: [],
        dernièresActions: [],
        performanceObjectifs: {
          enCours: 0,
          atteints: 0,
          enRetard: 0
        }
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
                  <p className="text-sm font-medium text-gray-600">Objectifs en cours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.performanceObjectifs.enCours}
                  </p>
                  <p className="text-xs text-gray-600">
                    {dashboardData.performanceObjectifs.atteints} atteints
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
                    {dashboardData.objectifsActifs.length > 0
                      ? (dashboardData.objectifsActifs.reduce((sum, goal) => sum + goal.progressionPourcentage, 0) / dashboardData.objectifsActifs.length).toFixed(1)
                      : '0.0'}%
                  </p>
                  <p className="text-xs text-purple-600">
                    Sur {dashboardData.objectifsActifs.length} objectifs
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

        {/* Contenu principal - Tout sur une seule page */}
        <div className="space-y-8">
          {/* Vue d'ensemble */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
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
          </section>

          {/* Objectifs */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Objectifs</h2>
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
          </section>

          {/* Insights */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Insights</h2>
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
          </section>

          {/* Activité */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Activité</h2>
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
          </section>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}