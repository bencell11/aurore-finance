'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Target,
  ChevronRight, 
  ChevronLeft,
  CalendarIcon,
  Info,
  TrendingUp,
  Shield,
  Zap,
  Calculator,
  CheckCircle,
  AlertCircle,
  Sparkles,
  PiggyBank,
  Home,
  GraduationCap,
  Plane,
  Heart,
  Car,
  Briefcase
} from 'lucide-react';
import { FinancialGoal, GoalType, Priority, GoalStatus } from '@/types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface GoalCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: Partial<FinancialGoal>) => void;
}

const GOAL_TYPES: { value: GoalType; label: string; icon: any; description: string }[] = [
  { 
    value: 'epargne', 
    label: 'Épargne', 
    icon: PiggyBank,
    description: 'Constitution d\'un fonds d\'urgence ou épargne générale'
  },
  { 
    value: 'immobilier', 
    label: 'Immobilier', 
    icon: Home,
    description: 'Achat immobilier, apport personnel ou travaux'
  },
  { 
    value: 'retraite', 
    label: 'Retraite', 
    icon: Shield,
    description: '3e pilier et prévoyance vieillesse'
  },
  { 
    value: 'education', 
    label: 'Éducation', 
    icon: GraduationCap,
    description: 'Formation, études des enfants'
  },
  { 
    value: 'voyage', 
    label: 'Voyage', 
    icon: Plane,
    description: 'Vacances et projets de voyage'
  },
  { 
    value: 'investissement', 
    label: 'Investissement', 
    icon: TrendingUp,
    description: 'Constitution d\'un portefeuille d\'investissement'
  },
  { 
    value: 'autre', 
    label: 'Autre', 
    icon: Target,
    description: 'Autres projets personnels'
  }
];

const INVESTMENT_STRATEGIES = [
  { 
    value: 'conservative', 
    label: 'Conservateur',
    description: 'Priorité à la sécurité du capital',
    expectedReturn: 2,
    risk: 'Faible'
  },
  { 
    value: 'moderate', 
    label: 'Modéré',
    description: 'Équilibre entre sécurité et croissance',
    expectedReturn: 5,
    risk: 'Moyen'
  },
  { 
    value: 'dynamic', 
    label: 'Dynamique',
    description: 'Recherche de performance',
    expectedReturn: 8,
    risk: 'Élevé'
  }
];

export default function GoalCreationWizard({ 
  isOpen, 
  onClose, 
  onCreateGoal 
}: GoalCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [goalData, setGoalData] = useState<Partial<FinancialGoal>>({
    type: 'epargne',
    priority: 'moyenne',
    status: 'actif',
    currentAmount: 0,
    notificationEnabled: true,
    notificationFrequency: 'monthly'
  });

  const totalSteps = 5;
  const stepProgress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const newGoal: Partial<FinancialGoal> = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progressPercentage: 0,
      transactions: []
    };
    
    onCreateGoal(newGoal);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setGoalData({
      type: 'epargne',
      priority: 'moyenne',
      status: 'actif',
      currentAmount: 0,
      notificationEnabled: true,
      notificationFrequency: 'monthly'
    });
  };

  const calculateMonthlyAmount = () => {
    if (!goalData.targetAmount || !goalData.deadline) return 0;
    
    const months = Math.max(1, 
      (new Date(goalData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    const strategy = INVESTMENT_STRATEGIES.find(s => s.value === goalData.investmentStrategy);
    const monthlyReturn = (strategy?.expectedReturn || 0) / 100 / 12;
    
    if (monthlyReturn === 0) {
      return Math.round((goalData.targetAmount - (goalData.currentAmount || 0)) / months);
    }
    
    // Calcul avec intérêts composés
    const futureValue = goalData.targetAmount - (goalData.currentAmount || 0) * Math.pow(1 + monthlyReturn, months);
    const monthlyPayment = futureValue * monthlyReturn / (Math.pow(1 + monthlyReturn, months) - 1);
    
    return Math.round(monthlyPayment);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Créer un nouvel objectif financier
          </DialogTitle>
          <DialogDescription>
            Définissez votre objectif étape par étape
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Étape {currentStep} sur {totalSteps}</span>
            <span>{Math.round(stepProgress)}%</span>
          </div>
          <Progress value={stepProgress} className="h-2" />
        </div>

        {/* Step 1: Type et informations de base */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Type d'objectif</h3>
              <div className="grid grid-cols-2 gap-3">
                {GOAL_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setGoalData({ ...goalData, type: type.value })}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left hover:shadow-md",
                        goalData.type === type.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={cn(
                          "h-5 w-5 mt-0.5",
                          goalData.type === type.value ? "text-blue-600" : "text-gray-500"
                        )} />
                        <div className="flex-1">
                          <p className="font-medium">{type.label}</p>
                          <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Nom de l'objectif</Label>
                <Input
                  id="title"
                  placeholder="Ex: Fonds d'urgence, Achat appartement..."
                  value={goalData.title || ''}
                  onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre objectif en quelques mots..."
                  value={goalData.description || ''}
                  onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
                  className="mt-2 h-20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Montant et échéance */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Montant et échéance</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAmount">Montant cible (CHF)</Label>
                <div className="relative mt-2">
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="0"
                    value={goalData.targetAmount || ''}
                    onChange={(e) => setGoalData({ ...goalData, targetAmount: Number(e.target.value) })}
                    className="pl-10"
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="currentAmount">Montant déjà épargné (CHF)</Label>
                <div className="relative mt-2">
                  <Input
                    id="currentAmount"
                    type="number"
                    placeholder="0"
                    value={goalData.currentAmount || ''}
                    onChange={(e) => setGoalData({ ...goalData, currentAmount: Number(e.target.value) })}
                    className="pl-10"
                  />
                  <PiggyBank className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <Label>Date cible</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !goalData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {goalData.deadline ? 
                      format(new Date(goalData.deadline), 'PPP', { locale: fr }) : 
                      "Sélectionner une date"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={goalData.deadline ? new Date(goalData.deadline) : undefined}
                    onSelect={(date) => setGoalData({ ...goalData, deadline: date?.toISOString() })}
                    initialFocus
                    locale={fr}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select 
                value={goalData.priority} 
                onValueChange={(value: Priority) => setGoalData({ ...goalData, priority: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basse">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Basse
                    </div>
                  </SelectItem>
                  <SelectItem value="moyenne">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Moyenne
                    </div>
                  </SelectItem>
                  <SelectItem value="haute">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      Haute
                    </div>
                  </SelectItem>
                  <SelectItem value="critique">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Critique
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {goalData.targetAmount && goalData.currentAmount !== undefined && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Il vous reste <strong>{goalData.targetAmount - goalData.currentAmount} CHF</strong> à épargner pour atteindre votre objectif.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 3: Stratégie d'investissement */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Stratégie d'épargne</h3>
            
            <div className="space-y-4">
              <Label>Profil de risque</Label>
              {INVESTMENT_STRATEGIES.map((strategy) => (
                <button
                  key={strategy.value}
                  onClick={() => setGoalData({ 
                    ...goalData, 
                    investmentStrategy: strategy.value,
                    estimatedReturnRate: strategy.expectedReturn 
                  })}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all",
                    goalData.investmentStrategy === strategy.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{strategy.label}</p>
                      <p className="text-sm text-gray-500 mt-1">{strategy.description}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs">
                          Rendement espéré: <strong>{strategy.expectedReturn}%</strong> par an
                        </span>
                        <span className="text-xs">
                          Risque: <strong>{strategy.risk}</strong>
                        </span>
                      </div>
                    </div>
                    {goalData.investmentStrategy === strategy.value && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div>
              <Label>Montant mensuel suggéré</Label>
              <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-900">
                      {calculateMonthlyAmount()} CHF
                    </p>
                    <p className="text-sm text-blue-700 mt-1">par mois</p>
                  </div>
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  Basé sur votre objectif et la stratégie sélectionnée
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="monthlyContribution">Engagement mensuel (CHF)</Label>
              <Input
                id="monthlyContribution"
                type="number"
                placeholder={calculateMonthlyAmount().toString()}
                value={goalData.monthlyContribution || ''}
                onChange={(e) => setGoalData({ ...goalData, monthlyContribution: Number(e.target.value) })}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Vous pouvez ajuster ce montant selon vos capacités
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Automatisation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Automatisation et rappels</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Rappels automatiques</p>
                    <p className="text-sm text-gray-500">Recevoir des notifications pour vos contributions</p>
                  </div>
                </div>
                <Switch
                  checked={goalData.notificationEnabled}
                  onCheckedChange={(checked) => setGoalData({ ...goalData, notificationEnabled: checked })}
                />
              </div>

              {goalData.notificationEnabled && (
                <div>
                  <Label>Fréquence des rappels</Label>
                  <Select
                    value={goalData.notificationFrequency}
                    onValueChange={(value) => setGoalData({ ...goalData, notificationFrequency: value as any })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="biweekly">Bimensuel</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="quarterly">Trimestriel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conseil pro:</strong> L'automatisation des versements augmente de 73% les chances d'atteindre vos objectifs financiers.
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Prochaines étapes automatisées</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Suivi mensuel de progression</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Ajustements intelligents selon performance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Alertes pour opportunités d'optimisation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Récapitulatif */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Récapitulatif de votre objectif</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-bold text-lg mb-3">{goalData.title || 'Nouvel objectif'}</h4>
                {goalData.description && (
                  <p className="text-gray-600 text-sm mb-3">{goalData.description}</p>
                )}
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-medium">
                      {GOAL_TYPES.find(t => t.value === goalData.type)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Priorité</p>
                    <p className="font-medium capitalize">{goalData.priority}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Montant cible</p>
                    <p className="font-medium">{goalData.targetAmount?.toLocaleString()} CHF</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Déjà épargné</p>
                    <p className="font-medium">{goalData.currentAmount?.toLocaleString()} CHF</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date cible</p>
                    <p className="font-medium">
                      {goalData.deadline && format(new Date(goalData.deadline), 'PP', { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contribution mensuelle</p>
                    <p className="font-medium">
                      {(goalData.monthlyContribution || calculateMonthlyAmount()).toLocaleString()} CHF
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  En créant cet objectif, vous vous engagez à épargner régulièrement pour atteindre votre but. 
                  Nous vous accompagnerons tout au long de votre parcours.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handlePrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {currentStep === 1 ? 'Annuler' : 'Précédent'}
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !goalData.title) ||
                (currentStep === 2 && (!goalData.targetAmount || !goalData.deadline))
              }
              className="flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <CheckCircle className="h-4 w-4" />
              Créer l'objectif
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}