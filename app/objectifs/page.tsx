'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  PiggyBank,
  Home,
  GraduationCap,
  Plane,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react';
import { FinancialGoal } from '@/types/user';
import { GoalsService } from '@/lib/services/goals.service';

export default function ObjectifsPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const goalsService = GoalsService.getInstance();
  
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user?.id) return;
    
    try {
      await goalsService.loadFromStorage();
      const userGoals = await goalsService.getGoalsByUser(user.id);
      setGoals(userGoals);
    } catch (error) {
      console.error('Erreur lors du chargement des objectifs:', error);
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

  const getGoalIcon = (type: string) => {
    const icons = {
      epargne: PiggyBank,
      immobilier: Home,
      retraite: Clock,
      investissement: TrendingUp,
      education: GraduationCap,
      voyage: Plane,
      autre: Target
    };
    return icons[type as keyof typeof icons] || Target;
  };

  const getGoalColor = (type: string) => {
    const colors = {
      epargne: 'bg-green-100 text-green-600',
      immobilier: 'bg-blue-100 text-blue-600',
      retraite: 'bg-purple-100 text-purple-600',
      investissement: 'bg-orange-100 text-orange-600',
      education: 'bg-yellow-100 text-yellow-600',
      voyage: 'bg-pink-100 text-pink-600',
      autre: 'bg-gray-100 text-gray-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getPriorityColor = (priorite: string) => {
    const colors = {
      basse: 'bg-gray-100 text-gray-600',
      moyenne: 'bg-blue-100 text-blue-600',
      haute: 'bg-orange-100 text-orange-600',
      critique: 'bg-red-100 text-red-600'
    };
    return colors[priorite as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      actif: 'bg-green-100 text-green-600',
      atteint: 'bg-blue-100 text-blue-600',
      suspendu: 'bg-yellow-100 text-yellow-600',
      abandonne: 'bg-red-100 text-red-600'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const handleCreateGoal = async (goalData: any) => {
    if (!user?.id) return;
    
    try {
      await goalsService.createGoal(user.id, goalData);
      await goalsService.saveToStorage();
      await loadGoals();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'objectif:', error);
    }
  };

  const handleContribution = async (goalId: string, amount: number) => {
    try {
      await goalsService.addTransaction(goalId, {
        montant: amount,
        type: 'contribution',
        description: 'Contribution manuelle'
      });
      await goalsService.saveToStorage();
      await loadGoals();
    } catch (error) {
      console.error('Erreur lors de la contribution:', error);
    }
  };

  const activeGoals = goals.filter(g => g.status === 'actif');
  const completedGoals = goals.filter(g => g.status === 'atteint');
  const suspendedGoals = goals.filter(g => g.status === 'suspendu');

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.montantCible, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.montantActuel, 0);
  const averageProgress = goals.length > 0 ? goals.reduce((sum, g) => sum + g.progressionPourcentage, 0) / goals.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos objectifs...</p>
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
                Mes objectifs financiers
              </h1>
              <p className="text-lg text-gray-600">
                Suivez et gérez vos objectifs d'épargne et d'investissement
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel objectif
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Bannière profil incomplet */}
        {!hasCompleteProfile && (
          <div className="mb-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <Target className="w-12 h-12 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">
                      Optimisez vos objectifs avec un profil complet
                    </h3>
                    <p className="text-blue-700 mb-3">
                      Complétez votre profil financier pour obtenir des recommandations d'objectifs personnalisés et des calculs de faisabilité précis.
                    </p>
                    <Button onClick={() => window.location.href = '/profil'} className="bg-blue-600 hover:bg-blue-700">
                      <Target className="w-4 h-4 mr-2" />
                      Configurer mon profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Objectifs actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Objectifs atteints</p>
                  <p className="text-2xl font-bold text-gray-900">{completedGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Montant épargné</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Progression moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{averageProgress.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objectifs par catégories */}
        <Tabs defaultValue="actifs" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="actifs">Actifs ({activeGoals.length})</TabsTrigger>
            <TabsTrigger value="atteints">Atteints ({completedGoals.length})</TabsTrigger>
            <TabsTrigger value="suspendus">Suspendus ({suspendedGoals.length})</TabsTrigger>
            <TabsTrigger value="analyse">Analyse</TabsTrigger>
          </TabsList>

          {/* Objectifs actifs */}
          <TabsContent value="actifs" className="space-y-6">
            {activeGoals.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucun objectif actif
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Créez votre premier objectif financier pour commencer à épargner
                  </p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un objectif
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeGoals.map((goal) => {
                  const Icon = getGoalIcon(goal.type);
                  const timeAnalysis = goalsService.calculateTimeToGoal(goal);
                  const progress = goalsService.calculateGoalProgress(goal);
                  
                  return (
                    <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getGoalColor(goal.type)}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{goal.titre}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getPriorityColor(goal.priorite)}>
                                  {goal.priorite}
                                </Badge>
                                <Badge variant="outline">
                                  {goal.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Progression */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progression</span>
                            <span className="text-sm text-gray-600">
                              {formatCurrency(goal.montantActuel)} / {formatCurrency(goal.montantCible)}
                            </span>
                          </div>
                          <Progress value={goal.progressionPourcentage} className="h-3" />
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {goal.progressionPourcentage.toFixed(1)}% atteint
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatCurrency(goal.montantCible - goal.montantActuel)} restant
                            </span>
                          </div>
                        </div>

                        {/* Informations temporelles */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Échéance:</span>
                            <p className="font-medium">
                              {new Date(goal.dateEcheance).toLocaleDateString('fr-CH')}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Temps restant:</span>
                            <p className="font-medium">
                              {Math.ceil(progress.tempsRestant)} jours
                            </p>
                          </div>
                        </div>

                        {/* Contribution mensuelle */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Versement mensuel:</span>
                            <span className="font-semibold">
                              {formatCurrency(goal.versementMensuelPlan)}
                            </span>
                          </div>
                          {!timeAnalysis.isOnTrack && (
                            <div className="mt-2 text-xs text-orange-600">
                              ⚠️ Recommandé: {formatCurrency(timeAnalysis.requiredMonthlyContribution)}/mois
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              const amount = prompt('Montant de la contribution (CHF):');
                              if (amount && !isNaN(Number(amount))) {
                                handleContribution(goal.id, Number(amount));
                              }
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Contribuer
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            Planifier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Objectifs atteints */}
          <TabsContent value="atteints">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.map((goal) => {
                const Icon = getGoalIcon(goal.type);
                return (
                  <Card key={goal.id} className="border-green-200 bg-green-50">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getGoalColor(goal.type)}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{goal.titre}</CardTitle>
                          <Badge className="bg-green-100 text-green-600 mt-1">
                            ✓ Objectif atteint
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-green-700">
                        {formatCurrency(goal.montantCible)} atteint
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Complété le {new Date(goal.updatedAt).toLocaleDateString('fr-CH')}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Objectifs suspendus */}
          <TabsContent value="suspendus">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {suspendedGoals.map((goal) => {
                const Icon = getGoalIcon(goal.type);
                return (
                  <Card key={goal.id} className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getGoalColor(goal.type)}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{goal.titre}</CardTitle>
                          <Badge className="bg-yellow-100 text-yellow-600 mt-1">
                            Suspendu
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(goal.montantActuel)} / {formatCurrency(goal.montantCible)}
                      </p>
                      <Button size="sm" className="mt-3">
                        Réactiver
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analyse */}
          <TabsContent value="analyse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vue d'ensemble</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Montant total ciblé</span>
                      <span className="font-semibold">{formatCurrency(totalTargetAmount)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Montant épargné</span>
                      <span className="font-semibold text-green-600">{formatCurrency(totalCurrentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progression globale</span>
                      <span className="font-semibold">{averageProgress.toFixed(1)}%</span>
                    </div>
                  </div>
                  <Progress value={averageProgress} className="h-3" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Diversifiez vos objectifs</p>
                        <p className="text-sm text-gray-600">
                          Équilibrez épargne court terme et investissements long terme
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Automatisez vos versements</p>
                        <p className="text-sm text-gray-600">
                          Configurez des virements automatiques pour atteindre vos objectifs
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de création (simplifié pour la démo) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Créer un nouvel objectif</h3>
            <p className="text-gray-600 mb-4">
              Cette fonctionnalité sera bientôt disponible. Utilisez le chatbot IA pour créer des objectifs personnalisés.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Fermer
              </Button>
              <Button 
                onClick={() => {
                  setShowCreateModal(false);
                  // Redirection vers le chatbot
                  window.location.href = '/demo';
                }}
                className="flex-1"
              >
                Utiliser le chatbot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}