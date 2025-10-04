'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Target, 
  User, 
  Briefcase, 
  Users, 
  Globe,
  Lightbulb,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Play,
  Hash,
  AlertCircle,
  Calculator,
  FileText,
  CreditCard,
  PiggyBank,
  Banknote,
  Receipt,
  Shield,
  Award,
  Star,
  Zap,
  Gift,
  Truck,
  Coffee,
  GraduationCap,
  Home,
  Car,
  Utensils,
  ShoppingCart,
  Heart,
  Smartphone,
  Laptop,
  Brain,
  CheckSquare,
  XCircle,
  Info,
  Eye,
  Download,
  BarChart3,
  PieChart,
  TrendingDown,
  Plus,
  Minus,
  DollarSign,
  Percent,
  Calendar,
  MapPin,
  Building2
} from 'lucide-react';
import { 
  guidedCourses, 
  getCourseById, 
  getCourseStep, 
  getNextStep, 
  getPreviousStep, 
  calculateProgress,
  type GuidedCourse,
  type CourseStep 
} from '@/lib/data/guided-courses';

interface GuidedCourseProps {
  onBack?: () => void;
}

interface CourseStepDisplayProps {
  course: GuidedCourse;
  currentStep: CourseStep;
  stepIndex: number;
  completedSteps: string[];
  onComplete: (stepId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onBack: () => void;
}

// Composant interactif pour simuler un certificat de salaire
function SalaryVisualization() {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  const salaryElements = [
    { id: 'gross', label: 'Salaire brut', amount: '6\'500 CHF', icon: Banknote, color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { id: 'avs', label: 'AVS/AI/APG', amount: '-344.50 CHF', icon: Shield, color: 'bg-red-100 border-red-300 text-red-800' },
    { id: 'ac', label: 'Assurance chômage', amount: '-71.50 CHF', icon: Truck, color: 'bg-red-100 border-red-300 text-red-800' },
    { id: 'lpp', label: 'LPP (2e pilier)', amount: '-325 CHF', icon: PiggyBank, color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { id: 'net', label: 'Salaire net imposable', amount: '5\'759 CHF', icon: Receipt, color: 'bg-green-100 border-green-300 text-green-800' }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
      <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
        <Receipt className="h-5 w-5" />
        Simulation Certificat de Salaire
      </h4>
      <div className="space-y-3">
        {salaryElements.map((element) => {
          const Icon = element.icon;
          return (
            <div
              key={element.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedElement === element.id
                  ? element.color + ' shadow-lg scale-105'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedElement(selectedElement === element.id ? null : element.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{element.label}</span>
                </div>
                <span className="font-bold">{element.amount}</span>
              </div>
              {selectedElement === element.id && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                  <p className="text-sm leading-relaxed">
                    {element.id === 'gross' && 'Votre rémunération totale avant toute déduction. Inclut salaire de base, heures supplémentaires, primes.'}
                    {element.id === 'avs' && 'Cotisations sociales obligatoires (5.3% du salaire brut). Plafonné à 148\'200 CHF.'}
                    {element.id === 'ac' && 'Assurance chômage (1.1% du salaire brut). Plafonné à 148\'200 CHF.'}
                    {element.id === 'lpp' && 'Cotisations pour votre retraite professionnelle. Varie selon l\'âge et le plan de prévoyance.'}
                    {element.id === 'net' && 'Montant qui servira de base pour calculer vos impôts. C\'est le chiffre le plus important !'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Calculateur interactif de déductions
function DeductionCalculator() {
  const [selectedDeductions, setSelectedDeductions] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<{[key: string]: number}>({});
  
  const deductions = [
    { id: 'transport', label: 'Transport domicile-travail', maxAmount: 3000, icon: Car, defaultAmount: 1200 },
    { id: 'meals', label: 'Repas hors domicile', maxAmount: 3200, icon: Utensils, defaultAmount: 1600 },
    { id: 'formation', label: 'Formation continue', maxAmount: 12000, icon: GraduationCap, defaultAmount: 800 },
    { id: 'pilier3a', label: '3e pilier A', maxAmount: 7056, icon: PiggyBank, defaultAmount: 7056 },
    { id: 'medical', label: 'Frais médicaux', maxAmount: 0, icon: Heart, defaultAmount: 500 }
  ];

  const toggleDeduction = (id: string) => {
    setSelectedDeductions(prev => 
      prev.includes(id) 
        ? prev.filter(d => d !== id)
        : [...prev, id]
    );
  };

  const totalDeduction = selectedDeductions.reduce((sum, id) => {
    const deduction = deductions.find(d => d.id === id);
    return sum + (customAmounts[id] || deduction?.defaultAmount || 0);
  }, 0);

  const taxSaving = totalDeduction * 0.25; // Approximation 25% d'économie

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
      <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
        <Calculator className="h-5 w-5" />
        Calculateur de Déductions
      </h4>
      
      <div className="space-y-4 mb-6">
        {deductions.map((deduction) => {
          const Icon = deduction.icon;
          const isSelected = selectedDeductions.includes(deduction.id);
          const amount = customAmounts[deduction.id] || deduction.defaultAmount;
          
          return (
            <div key={deduction.id} className="space-y-2">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-green-100 border-green-300 shadow-md'
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
                onClick={() => toggleDeduction(deduction.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckSquare className="h-4 w-4 text-white" />}
                    </div>
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{deduction.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-700">{amount.toLocaleString()} CHF</div>
                    {deduction.maxAmount > 0 && (
                      <div className="text-xs text-gray-500">Max: {deduction.maxAmount.toLocaleString()} CHF</div>
                    )}
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="ml-12 mr-4">
                  <input
                    type="range"
                    min="0"
                    max={deduction.maxAmount || 15000}
                    value={amount}
                    onChange={(e) => setCustomAmounts(prev => ({...prev, [deduction.id]: parseInt(e.target.value)}))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 CHF</span>
                    <span>{(deduction.maxAmount || 15000).toLocaleString()} CHF</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white p-4 rounded-lg border border-green-300 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{totalDeduction.toLocaleString()} CHF</div>
            <div className="text-sm text-gray-600">Total déductions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{taxSaving.toLocaleString()} CHF</div>
            <div className="text-sm text-gray-600">Économie fiscale estimée</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Visualisation 3e pilier avec progression
function ThirdPillarVisualization() {
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [yearsToRetirement, setYearsToRetirement] = useState(35);
  
  const annualAmount = monthlyAmount * 12;
  const maxAmount = 7056;
  const percentage = Math.min((annualAmount / maxAmount) * 100, 100);
  
  const totalContributions = annualAmount * yearsToRetirement;
  const estimatedGrowth = totalContributions * 1.03 ** yearsToRetirement; // 3% annuel
  const taxSavingPerYear = annualAmount * 0.25;
  const totalTaxSaving = taxSavingPerYear * yearsToRetirement;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
      <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-800">
        <PiggyBank className="h-5 w-5" />
        Simulateur 3e Pilier A
      </h4>
      
      <div className="space-y-6">
        {/* Contrôles */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Versement mensuel</label>
            <div className="relative">
              <input
                type="range"
                min="50"
                max="588"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50 CHF</span>
                <span>588 CHF (max)</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-bold text-purple-700">{monthlyAmount} CHF/mois</span>
              <div className="text-sm text-gray-600">{annualAmount} CHF/an</div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Années jusqu'à la retraite</label>
            <div className="relative">
              <input
                type="range"
                min="5"
                max="40"
                value={yearsToRetirement}
                onChange={(e) => setYearsToRetirement(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 ans</span>
                <span>40 ans</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-bold text-purple-700">{yearsToRetirement} ans</span>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Utilisation du maximum annuel</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                percentage >= 100 ? 'bg-green-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Maximum déductible: {maxAmount} CHF/an
          </div>
        </div>

        {/* Résultats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg text-center border border-purple-200">
            <div className="text-lg font-bold text-purple-700">{totalContributions.toLocaleString()} CHF</div>
            <div className="text-xs text-gray-600">Total versé</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center border border-green-200">
            <div className="text-lg font-bold text-green-700">{estimatedGrowth.toLocaleString()} CHF</div>
            <div className="text-xs text-gray-600">Capital estimé*</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center border border-blue-200">
            <div className="text-lg font-bold text-blue-700">{totalTaxSaving.toLocaleString()} CHF</div>
            <div className="text-xs text-gray-600">Économies fiscales</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          * Estimation basée sur un rendement annuel de 3%
        </div>
      </div>
    </div>
  );
}

function CourseStepDisplay({ 
  course, 
  currentStep, 
  stepIndex, 
  completedSteps, 
  onComplete, 
  onNext, 
  onPrevious, 
  onBack 
}: CourseStepDisplayProps) {
  const isCompleted = completedSteps.includes(currentStep.id);
  const progress = calculateProgress(course.id, completedSteps);
  const hasNext = getNextStep(course.id, currentStep.id) !== null;
  const hasPrevious = getPreviousStep(course.id, currentStep.id) !== null;

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const difficultyLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* En-tête du cours */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <User className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-blue-100">{course.description}</p>
              </div>
            </div>
          </div>
          
          {/* Barre de progrès */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Étape {stepIndex + 1} sur {course.steps.length}</span>
              <span>{progress}% terminé</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-8">
          {/* En-tête de l'étape */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                    {stepIndex + 1}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{currentStep.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {currentStep.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={difficultyColors[currentStep.difficulty]}>
                    {difficultyLabels[currentStep.difficulty]}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {currentStep.estimatedTime} min
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Contenu principal */}
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Composant visuel interactif selon l'étape */}
                {currentStep.id === 'etape-1-certificat-salaire' && (
                  <div className="mb-8">
                    <SalaryVisualization />
                  </div>
                )}
                {currentStep.id === 'etape-2-deductions-fiscales' && (
                  <div className="mb-8">
                    <DeductionCalculator />
                  </div>
                )}
                {currentStep.id === 'etape-3-troisieme-pilier' && (
                  <div className="mb-8">
                    <ThirdPillarVisualization />
                  </div>
                )}

                {/* Contenu de l'étape */}
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {currentStep.content.split('\n\n').map((paragraph, idx) => (
                      <div key={idx}>
                        {paragraph.startsWith('**') && paragraph.endsWith('**') ? (
                          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 flex items-center gap-2">
                            <Hash className="h-5 w-5 text-blue-600" />
                            {paragraph.replace(/\*\*/g, '')}
                          </h3>
                        ) : paragraph.trim() ? (
                          <p className="text-gray-700">
                            {paragraph.split('**').map((part, partIdx) => 
                              partIdx % 2 === 1 ? <strong key={partIdx}>{part}</strong> : part
                            )}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Points clés interactifs */}
                {currentStep.keyPoints && currentStep.keyPoints.length > 0 && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold mb-4 flex items-center gap-2 text-blue-800">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                      </div>
                      Points clés à retenir
                      <Badge className="bg-blue-100 text-blue-800 ml-2">
                        {currentStep.keyPoints.length} points
                      </Badge>
                    </h4>
                    <div className="grid gap-3">
                      {currentStep.keyPoints.map((point, idx) => (
                        <div 
                          key={idx} 
                          className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-blue-100 hover:border-blue-300"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                              <span className="text-sm font-bold text-blue-700">{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conseil pratique avec animation */}
                {currentStep.practicalTip && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 group hover:shadow-lg transition-all duration-300">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      💡 Conseil pratique
                      <Badge className="bg-green-100 text-green-800 ml-2">
                        <Zap className="h-3 w-3 mr-1" />
                        Pro-tip
                      </Badge>
                    </h4>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100 group-hover:border-green-300 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 animate-pulse"></div>
                        <p className="text-sm text-gray-700 leading-relaxed flex-1">{currentStep.practicalTip}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action suivante avec checklist */}
                {currentStep.nextAction && (
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 group hover:shadow-lg transition-all duration-300">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-800">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      🎯 Prochaine action recommandée
                      <Badge className="bg-purple-100 text-purple-800 ml-2">
                        <CheckSquare className="h-3 w-3 mr-1" />
                        À faire
                      </Badge>
                    </h4>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100 group-hover:border-purple-300 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckSquare className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed flex-1">{currentStep.nextAction}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-purple-100">
                        <div className="flex items-center gap-2 text-xs text-purple-600">
                          <Clock className="h-3 w-3" />
                          <span>Temps estimé: 5-10 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions et statistiques */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
            <CardContent className="p-6">
              {/* Statistiques de progression */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stepIndex + 1}/{course.steps.length}</div>
                  <div className="text-xs text-gray-600">Étape actuelle</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedSteps.length}</div>
                  <div className="text-xs text-gray-600">Étapes terminées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
                  <div className="text-xs text-gray-600">Progression</div>
                </div>
              </div>

              {/* Aperçu étapes */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {course.steps.map((step, idx) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      completedSteps.includes(step.id) 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : idx === stepIndex
                        ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                        : 'bg-gray-200 border-gray-300 text-gray-600'
                    }`}>
                      {completedSteps.includes(step.id) ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    {idx < course.steps.length - 1 && (
                      <div className={`w-8 h-0.5 ${
                        completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                    className="flex items-center gap-2 hover:bg-blue-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  
                  {!isCompleted && (
                    <Button
                      onClick={() => onComplete(currentStep.id)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      ✅ Marquer comme terminé
                      <div className="ml-2 px-2 py-1 bg-white/20 rounded text-xs">
                        +{currentStep.estimatedTime} min
                      </div>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isCompleted && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 px-3 py-2 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        ✅ Terminé
                      </Badge>
                      <div className="text-xs text-green-600 font-medium">
                        +{currentStep.estimatedTime} min d'apprentissage
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={onNext}
                    disabled={!hasNext || !isCompleted}
                    className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 ${
                      !hasNext || !isCompleted ? 'opacity-50' : ''
                    }`}
                  >
                    {hasNext ? 'Étape suivante' : 'Terminer le cours'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Motivation */}
              {isCompleted && hasNext && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 text-sm text-yellow-800">
                    <Award className="h-4 w-4" />
                    <span className="font-medium">Bravo ! Vous progressez bien.</span>
                    <span>Continuez vers l'étape suivante pour encore plus d'économies fiscales !</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function GuidedCourse({ onBack }: GuidedCourseProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const selectedCourse = selectedCourseId ? getCourseById(selectedCourseId) : null;
  const currentStep = selectedCourse?.steps[currentStepIndex];

  const handleStartCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
  };

  const handleCompleteStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };

  const handleNext = () => {
    if (selectedCourse && currentStepIndex < selectedCourse.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
  };

  // Icônes pour les cours
  const courseIcons = {
    'salarie-debutant': User,
    'independant': Briefcase,
    'famille': Users,
    'frontalier': Globe
  };

  // Si un cours est sélectionné, afficher l'étape
  if (selectedCourse && currentStep) {
    return (
      <CourseStepDisplay
        course={selectedCourse}
        currentStep={currentStep}
        stepIndex={currentStepIndex}
        completedSteps={completedSteps}
        onComplete={handleCompleteStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onBack={handleBackToCourses}
      />
    );
  }

  // Sinon, afficher la liste des cours
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parcours Guidés</h2>
          <p className="text-gray-600 mt-1">
            Apprenez la fiscalité suisse étape par étape avec nos parcours structurés
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        )}
      </div>

      <div className="grid gap-8">
        {guidedCourses.map((course) => {
          const Icon = courseIcons[course.id as keyof typeof courseIcons] || BookOpen;
          const progress = calculateProgress(course.id, completedSteps);
          const isPopular = course.id === 'salarie-debutant';
          
          return (
            <Card key={course.id} className={`hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${
              isPopular ? 'ring-2 ring-yellow-300 ring-opacity-50' : ''
            }`}>
              {/* Badge populaire */}
              {isPopular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-3 py-1 shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    Plus populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300 shadow-md">
                      <Icon className="h-10 w-10 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl group-hover:text-blue-700 transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-base mt-2 text-gray-600">
                        {course.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge className={`${
                          course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.difficulty === 'beginner' ? '🌱 Débutant' : 
                           course.difficulty === 'intermediate' ? '⚡ Intermédiaire' : '🔥 Avancé'}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{course.totalTime} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Target className="h-4 w-4" />
                          <span>{course.steps.length} étapes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Informations du cours */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Public cible</h4>
                      <p className="text-sm text-gray-600">{course.targetAudience}</p>
                    </div>
                    
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Prérequis</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {course.prerequisites.map((prereq, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 mt-0.5 text-gray-400" />
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Étapes du cours */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Étapes du parcours</h4>
                    <div className="space-y-3">
                      {course.steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-sm font-bold text-blue-600">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{step.title}</p>
                            <p className="text-xs text-gray-500">{step.estimatedTime} min</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Objectifs d'apprentissage */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Objectifs d'apprentissage</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {course.learningObjectives.map((objective, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Target className="h-3 w-3 mt-0.5 text-green-600" />
                        {objective}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="space-y-3">
                    <Button 
                      onClick={() => handleStartCourse(course.id)}
                      className={`w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                        isPopular 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      }`}
                    >
                      <Play className="h-5 w-5" />
                      🚀 Commencer le parcours
                      <div className="ml-2 px-2 py-1 bg-white/20 rounded text-sm">
                        {course.totalTime} min
                      </div>
                    </Button>
                    
                    {/* Bénéfices rapides */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-lg font-bold text-green-700">💰</div>
                        <div className="text-xs text-green-600">Économies</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-lg font-bold text-blue-700">📚</div>
                        <div className="text-xs text-blue-600">Apprentissage</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-lg font-bold text-purple-700">⚡</div>
                        <div className="text-xs text-purple-600">Rapide</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}