'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target,
  TrendingUp,
  Clock,
  Calendar,
  DollarSign,
  PiggyBank,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Info,
  Edit,
  Trash2,
  Download,
  Share2,
  Calculator,
  ChartBar,
  Activity,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import { FinancialGoal, GoalTransaction } from '@/types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface GoalDetailViewProps {
  goal: FinancialGoal;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (goalId: string) => void;
  onAddTransaction: (goalId: string, amount: number, type: 'deposit' | 'withdrawal') => void;
}

export default function GoalDetailView({
  goal,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onAddTransaction
}: GoalDetailViewProps) {
  const [transactionAmount, setTransactionAmount] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculs
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const remainingDays = goal.deadline ? 
    Math.max(0, Math.floor((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const remainingMonths = Math.ceil(remainingDays / 30);
  const monthlyRequired = remainingMonths > 0 ? Math.round(remainingAmount / remainingMonths) : 0;
  
  // Performance
  const isOnTrack = goal.monthlyContribution && monthlyRequired <= goal.monthlyContribution;
  const completionRate = (goal.currentAmount / goal.targetAmount) * 100;
  
  // Données pour les graphiques
  const progressData = generateProgressData(goal);
  const projectionData = generateProjectionData(goal);
  const allocationData = generateAllocationData(goal);

  const handleDeposit = () => {
    const amount = Number(transactionAmount);
    if (amount > 0) {
      onAddTransaction(goal.id, amount, 'deposit');
      setTransactionAmount('');
    }
  };

  const handleWithdrawal = () => {
    const amount = Number(transactionAmount);
    if (amount > 0 && amount <= goal.currentAmount) {
      onAddTransaction(goal.id, amount, 'withdrawal');
      setTransactionAmount('');
    }
  };

  const handleDelete = () => {
    onDelete(goal.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'atteint': return 'bg-blue-100 text-blue-800';
      case 'suspendu': return 'bg-yellow-100 text-yellow-800';
      case 'abandonne': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'critique': return 'bg-red-100 text-red-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                {goal.title}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {goal.description}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(goal)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Statut et badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge className={getStatusColor()}>{goal.status}</Badge>
          <Badge className={getPriorityColor()}>Priorité {goal.priority}</Badge>
          <Badge variant="outline">{goal.type}</Badge>
          {isOnTrack ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Sur la bonne voie
            </Badge>
          ) : (
            <Badge className="bg-orange-100 text-orange-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Ajustement nécessaire
            </Badge>
          )}
        </div>

        {/* Vue d'ensemble */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Progression</span>
                  <span className="text-sm text-gray-500">
                    {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()} CHF
                  </span>
                </div>
                <Progress value={completionRate} className="h-3" />
                <p className="text-center mt-2 text-2xl font-bold text-blue-600">
                  {completionRate.toFixed(1)}%
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-xs text-gray-500">Restant</p>
                  <p className="font-bold">{remainingAmount.toLocaleString()} CHF</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-xs text-gray-500">Temps restant</p>
                  <p className="font-bold">{remainingDays} jours</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calculator className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-xs text-gray-500">Mensualité requise</p>
                  <p className="font-bold">{monthlyRequired.toLocaleString()} CHF</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-xs text-gray-500">Rendement estimé</p>
                  <p className="font-bold">{goal.estimatedReturnRate || 0}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs détaillés */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="analytics">Analyse</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Montant en CHF"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleDeposit}
                    disabled={!transactionAmount || Number(transactionAmount) <= 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Dépôt
                  </Button>
                  <Button
                    onClick={handleWithdrawal}
                    disabled={!transactionAmount || Number(transactionAmount) <= 0 || Number(transactionAmount) > goal.currentAmount}
                    variant="destructive"
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    Retrait
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {goal.transactions && goal.transactions.length > 0 ? (
                  <div className="space-y-2">
                    {goal.transactions.slice().reverse().map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {transaction.type === 'deposit' ? (
                            <ArrowUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium">
                              {transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(transaction.date), 'PPP', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <span className={`font-bold ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toLocaleString()} CHF
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Aucune transaction pour le moment
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projections */}
          <TabsContent value="projections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Projection de progression</CardTitle>
                <CardDescription>
                  Évolution prévue basée sur vos contributions mensuelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} CHF`} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="conservateur"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="modéré"
                      stackId="2"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="optimiste"
                      stackId="3"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                    />
                    <Line
                      type="monotone"
                      dataKey="objectif"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Scénario conservateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(goal.targetAmount * 0.9).toLocaleString()} CHF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">90% de l'objectif</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Scénario modéré</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    {goal.targetAmount.toLocaleString()} CHF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">100% de l'objectif</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Scénario optimiste</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(goal.targetAmount * 1.15).toLocaleString()} CHF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">115% de l'objectif</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {allocationData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value.toLocaleString()} CHF</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance mensuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} CHF`} />
                      <Bar dataKey="montant" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations intelligentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isOnTrack && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Augmentez vos contributions mensuelles de {monthlyRequired - (goal.monthlyContribution || 0)} CHF pour atteindre votre objectif à temps.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    En investissant dans un fonds indiciel avec 6% de rendement annuel, vous pourriez réduire vos contributions mensuelles de 15%.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Conseil fiscal: Les versements au 3e pilier sont déductibles jusqu'à 7'056 CHF par an, réduisant vos impôts de ~2'000 CHF.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions */}
          <TabsContent value="actions" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => {}}
              >
                <Download className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Exporter le rapport</p>
                  <p className="text-xs text-gray-500">Télécharger PDF détaillé</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => {}}
              >
                <Share2 className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Partager l'objectif</p>
                  <p className="text-xs text-gray-500">Avec votre conseiller</p>
                </div>
              </Button>
            </div>

            {showDeleteConfirm && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="mb-3">Êtes-vous sûr de vouloir supprimer cet objectif ? Cette action est irréversible.</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Supprimer définitivement
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Fonctions utilitaires pour générer les données des graphiques
function generateProgressData(goal: FinancialGoal) {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  return months.map((month, index) => ({
    month,
    montant: Math.round((goal.currentAmount / 6) * (index + 1))
  }));
}

function generateProjectionData(goal: FinancialGoal) {
  const monthsToGoal = goal.deadline ? 
    Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)) : 12;
  
  const data = [];
  let conservateur = goal.currentAmount;
  let modere = goal.currentAmount;
  let optimiste = goal.currentAmount;
  const monthlyContribution = goal.monthlyContribution || 0;
  
  for (let i = 0; i <= monthsToGoal; i++) {
    conservateur += monthlyContribution * (1 + 0.02/12);
    modere += monthlyContribution * (1 + 0.05/12);
    optimiste += monthlyContribution * (1 + 0.08/12);
    
    data.push({
      month: `M${i}`,
      conservateur: Math.round(conservateur),
      modéré: Math.round(modere),
      optimiste: Math.round(optimiste),
      objectif: goal.targetAmount
    });
  }
  
  return data;
}

function generateAllocationData(goal: FinancialGoal) {
  return [
    { name: 'Déjà épargné', value: goal.currentAmount, color: '#10b981' },
    { name: 'Restant à épargner', value: goal.targetAmount - goal.currentAmount, color: '#e5e7eb' }
  ];
}