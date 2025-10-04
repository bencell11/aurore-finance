'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  MapPin, 
  PiggyBank, 
  Home, 
  Receipt, 
  BarChart3, 
  FileText,
  ArrowRight,
  Info,
  Lightbulb,
  Zap,
  Target,
  Award,
  Brain,
  Sparkles,
  DollarSign,
  Percent,
  Eye,
  Download,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Car,
  Utensils,
  GraduationCap,
  Heart,
  Users,
  Calendar,
  Banknote,
  CreditCard,
  Shield,
  Gift,
  Truck,
  Star,
  ChevronRight,
  PieChart,
  TrendingDown
} from 'lucide-react';

interface PracticalToolsProps {
  onBack?: () => void;
}

// Simulateur d'impôts interactif
function TaxSimulator() {
  const [income, setIncome] = useState(80000);
  const [canton, setCanton] = useState('vaud');
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [children, setChildren] = useState(0);
  const [thirdPillar, setThirdPillar] = useState(7056);

  const cantonRates = {
    vaud: { federal: 0.11, cantonal: 0.08, communal: 0.045 },
    geneve: { federal: 0.11, cantonal: 0.09, communal: 0.05 },
    zurich: { federal: 0.11, cantonal: 0.065, communal: 0.035 },
    bern: { federal: 0.11, cantonal: 0.075, communal: 0.04 }
  };

  const deductions = 2000 + (children * 6500) + thirdPillar + (maritalStatus === 'married' ? 2600 : 0);
  const taxableIncome = Math.max(0, income - deductions);
  const rates = cantonRates[canton as keyof typeof cantonRates];
  
  const federalTax = taxableIncome * rates.federal;
  const cantonalTax = taxableIncome * rates.cantonal;
  const communalTax = taxableIncome * rates.communal;
  const totalTax = federalTax + cantonalTax + communalTax;
  const netIncome = income - totalTax;
  const effectiveRate = (totalTax / income) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Simulateur d'Impôts 2024
        </CardTitle>
        <CardDescription>
          Calculez vos impôts avec précision selon votre situation
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Paramètres */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Revenu annuel brut</Label>
            <div className="relative">
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="pr-12"
              />
              <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
            </div>
          </div>
          
          <div>
            <Label>Canton de résidence</Label>
            <Select value={canton} onValueChange={setCanton}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaud">Vaud</SelectItem>
                <SelectItem value="geneve">Genève</SelectItem>
                <SelectItem value="zurich">Zurich</SelectItem>
                <SelectItem value="bern">Berne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Situation familiale</Label>
            <Select value={maritalStatus} onValueChange={setMaritalStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Célibataire</SelectItem>
                <SelectItem value="married">Marié(e)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Nombre d'enfants</Label>
            <Input
              type="number"
              min="0"
              max="10"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>3e pilier (max 7'056 CHF)</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="7056"
                value={thirdPillar}
                onChange={(e) => setThirdPillar(Number(e.target.value))}
                className="pr-12"
              />
              <span className="absolute right-3 top-2.5 text-sm text-gray-500">CHF</span>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="space-y-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-lg">Calcul des impôts</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-lg font-bold text-red-600">{federalTax.toLocaleString()} CHF</div>
              <div className="text-xs text-gray-600">Impôt fédéral</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-lg font-bold text-orange-600">{cantonalTax.toLocaleString()} CHF</div>
              <div className="text-xs text-gray-600">Impôt cantonal</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-lg font-bold text-purple-600">{communalTax.toLocaleString()} CHF</div>
              <div className="text-xs text-gray-600">Impôt communal</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-300">
              <div className="text-lg font-bold text-blue-600">{totalTax.toLocaleString()} CHF</div>
              <div className="text-xs text-gray-600">Total impôts</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{netIncome.toLocaleString()} CHF</div>
              <div className="text-sm text-green-600">Revenu net après impôts</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{effectiveRate.toFixed(1)}%</div>
              <div className="text-sm text-blue-600">Taux d'imposition effectif</div>
            </div>
          </div>
        </div>

        {/* Optimisations suggérées */}
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <h5 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800">
            <Lightbulb className="h-4 w-4" />
            Optimisations suggérées
          </h5>
          <ul className="space-y-1 text-sm text-yellow-700">
            {thirdPillar < 7056 && <li>• Maximisez votre 3e pilier pour économiser {((7056 - thirdPillar) * 0.25).toFixed(0)} CHF d'impôts</li>}
            <li>• Vérifiez vos frais professionnels (transport, repas, formation)</li>
            <li>• Considérez un rachat LPP si possible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Optimiseur fiscal IA
function FiscalOptimizer() {
  const [profile, setProfile] = useState({
    age: 35,
    income: 85000,
    savings: 50000,
    hasProperty: false,
    children: 1,
    canton: 'vaud'
  });

  const [optimizations, setOptimizations] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeProfile = () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    setTimeout(() => {
      const suggestions = [
        {
          title: "Maximiser le 3e pilier A",
          impact: "1'764 CHF d'économie/an",
          priority: "high",
          description: "Versez 7'056 CHF pour bénéficier de la déduction maximale",
          icon: PiggyBank,
          color: "green"
        },
        {
          title: "Optimiser les frais professionnels",
          impact: "450 CHF d'économie/an",
          priority: "medium",
          description: "Passez aux frais effectifs au lieu du forfait",
          icon: Receipt,
          color: "blue"
        },
        {
          title: "Planifier un rachat LPP",
          impact: "2'100 CHF d'économie/an",
          priority: "high",
          description: "Rachat de 8'400 CHF recommandé selon votre âge",
          icon: Shield,
          color: "purple"
        },
        {
          title: "Déménagement fiscal",
          impact: "3'200 CHF d'économie/an",
          priority: "low",
          description: "Le canton de Zoug pourrait être avantageux",
          icon: MapPin,
          color: "orange"
        }
      ];
      
      setOptimizations(suggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200"
  };

  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Optimiseur Fiscal IA
        </CardTitle>
        <CardDescription>
          Analyse intelligente de votre situation pour maximiser vos économies
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Profil utilisateur */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Âge</Label>
            <Input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({...profile, age: Number(e.target.value)})}
            />
          </div>
          <div>
            <Label>Revenu annuel</Label>
            <Input
              type="number"
              value={profile.income}
              onChange={(e) => setProfile({...profile, income: Number(e.target.value)})}
            />
          </div>
          <div>
            <Label>Épargne actuelle</Label>
            <Input
              type="number"
              value={profile.savings}
              onChange={(e) => setProfile({...profile, savings: Number(e.target.value)})}
            />
          </div>
        </div>

        <Button 
          onClick={analyzeProfile} 
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isAnalyzing ? (
            <>
              <Brain className="h-4 w-4 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              🧠 Analyser ma situation
            </>
          )}
        </Button>

        {/* Résultats d'optimisation */}
        {optimizations.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Recommandations personnalisées
            </h4>
            
            {optimizations.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-${opt.color}-100`}>
                        <Icon className={`h-5 w-5 text-${opt.color}-600`} />
                      </div>
                      <div>
                        <h5 className="font-semibold">{opt.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{opt.description}</p>
                        <div className="text-lg font-bold text-green-600 mt-2">{opt.impact}</div>
                      </div>
                    </div>
                    <Badge className={priorityColors[opt.priority as keyof typeof priorityColors]}>
                      {opt.priority === 'high' ? 'Priorité haute' : 
                       opt.priority === 'medium' ? 'Priorité moyenne' : 'Priorité faible'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Comparateur cantonal intelligent
function CantonComparator() {
  const [profile, setProfile] = useState({
    income: 100000,
    wealth: 200000,
    maritalStatus: 'single',
    children: 0
  });

  const cantons = [
    { name: 'Zurich', tax: 18500, cost: 'Élevé', quality: 'Excellent' },
    { name: 'Genève', tax: 22000, cost: 'Très élevé', quality: 'Excellent' },
    { name: 'Vaud', tax: 19200, cost: 'Élevé', quality: 'Très bon' },
    { name: 'Zoug', tax: 12800, cost: 'Élevé', quality: 'Excellent' },
    { name: 'Schwyz', tax: 13500, cost: 'Modéré', quality: 'Bon' },
    { name: 'Bâle-Ville', tax: 21000, cost: 'Très élevé', quality: 'Excellent' }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          Comparateur Cantonal
        </CardTitle>
        <CardDescription>
          Trouvez le canton le plus avantageux pour votre situation
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Paramètres */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Revenu annuel</Label>
            <Input
              type="number"
              value={profile.income}
              onChange={(e) => setProfile({...profile, income: Number(e.target.value)})}
            />
          </div>
          <div>
            <Label>Fortune</Label>
            <Input
              type="number"
              value={profile.wealth}
              onChange={(e) => setProfile({...profile, wealth: Number(e.target.value)})}
            />
          </div>
        </div>

        {/* Résultats */}
        <div className="space-y-3">
          <h4 className="font-semibold">Classement des cantons</h4>
          {cantons.sort((a, b) => a.tax - b.tax).map((canton, idx) => (
            <div key={canton.name} className={`p-4 rounded-lg border-2 ${
              idx === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    idx === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-semibold">{canton.name}</h5>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Coût de la vie: {canton.cost}</span>
                      <span>Qualité: {canton.quality}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{canton.tax.toLocaleString()} CHF</div>
                  <div className="text-sm text-gray-600">Impôts/an</div>
                </div>
              </div>
              {idx === 0 && (
                <div className="mt-2 p-2 bg-green-100 rounded text-sm text-green-800">
                  💰 Meilleur choix fiscal - Économie de {(cantons[1].tax - canton.tax).toLocaleString()} CHF/an
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Tracker de déductions
function DeductionTracker() {
  const [deductions, setDeductions] = useState([
    { category: 'Transport', current: 1200, target: 3000, icon: Car },
    { category: 'Repas', current: 800, target: 3200, icon: Utensils },
    { category: 'Formation', current: 500, target: 2000, icon: GraduationCap },
    { category: 'Médical', current: 300, target: 1000, icon: Heart },
    { category: '3e pilier', current: 7056, target: 7056, icon: PiggyBank }
  ]);

  const totalCurrent = deductions.reduce((sum, d) => sum + d.current, 0);
  const totalTarget = deductions.reduce((sum, d) => sum + d.target, 0);
  const progress = (totalCurrent / totalTarget) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-orange-600" />
          Tracker de Déductions 2024
        </CardTitle>
        <CardDescription>
          Suivez vos déductions en temps réel
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Progression globale */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Progression annuelle</span>
            <span className="text-lg font-bold">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{totalCurrent.toLocaleString()} CHF</span>
            <span>{totalTarget.toLocaleString()} CHF</span>
          </div>
        </div>

        {/* Détail par catégorie */}
        <div className="space-y-3">
          {deductions.map((deduction, idx) => {
            const Icon = deduction.icon;
            const percentage = (deduction.current / deduction.target) * 100;
            
            return (
              <div key={idx} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">{deduction.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{deduction.current.toLocaleString()} CHF</div>
                    <div className="text-xs text-gray-500">/ {deduction.target.toLocaleString()} CHF</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage >= 100 ? 'bg-green-500' : 
                      percentage >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une dépense
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PracticalTools({ onBack }: PracticalToolsProps) {
  const [activeTab, setActiveTab] = useState('simulator');

  const tools = [
    {
      id: 'simulator',
      title: 'Simulateur d\'impôts',
      description: 'Calcul précis de vos impôts 2024',
      icon: Calculator,
      component: TaxSimulator,
      popular: true
    },
    {
      id: 'optimizer',
      title: 'Optimiseur IA',
      description: 'Suggestions d\'économies personnalisées',
      icon: Brain,
      component: FiscalOptimizer,
      new: true
    },
    {
      id: 'comparator',
      title: 'Comparateur cantonal',
      description: 'Trouvez le canton le plus avantageux',
      icon: MapPin,
      component: CantonComparator
    },
    {
      id: 'tracker',
      title: 'Tracker déductions',
      description: 'Suivez vos déductions en temps réel',
      icon: BarChart3,
      component: DeductionTracker
    }
  ];

  const activeComponent = tools.find(tool => tool.id === activeTab)?.component || TaxSimulator;
  const ActiveComponent = activeComponent;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            Outils Pratiques Professionnels
          </h2>
          <p className="text-gray-600 mt-1">
            Outils innovants pour optimiser votre fiscalité
          </p>
        </div>
      </div>

      {/* Sélecteur d'outils */}
      <div className="grid md:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === tool.id;
          
          return (
            <Card 
              key={tool.id} 
              className={`cursor-pointer transition-all duration-200 relative ${
                isActive 
                  ? 'ring-2 ring-blue-500 bg-blue-50 shadow-lg' 
                  : 'hover:shadow-md hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tool.id)}
            >
              {tool.popular && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Populaire
                </Badge>
              )}
              {tool.new && (
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Nouveau
                </Badge>
              )}
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <h3 className={`font-semibold text-sm ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                  {tool.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">{tool.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Outil actif */}
      <div className="min-h-[600px]">
        <ActiveComponent />
      </div>

      {/* Bannière d'aide */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Besoin d'aide personnalisée ?
                </h3>
                <p className="text-gray-600">
                  Nos experts sont disponibles pour vous accompagner
                </p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Consulter un expert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}