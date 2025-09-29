'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Home, 
  TrendingUp, 
  Shield, 
  PieChart,
  ArrowRight,
  Users,
  Target,
  Building,
  Banknote,
  Clock,
  Star
} from 'lucide-react';

const simulators = [
  {
    id: 'impots',
    title: 'Simulateur d\'impôts',
    description: 'Calculez vos impôts fédéraux, cantonaux et communaux avec toutes les déductions possibles.',
    icon: Calculator,
    color: 'blue',
    features: [
      'Calcul pour les 26 cantons suisses',
      'Optimisation fiscale automatique',
      'Suggestions personnalisées',
      'Comparaison avec la moyenne suisse'
    ],
    estimatedTime: '5-8 minutes',
    difficulty: 'Facile',
    href: '/simulateurs/impots',
    popular: true
  },
  {
    id: 'immobilier',
    title: 'Simulateur immobilier',
    description: 'Analysez votre capacité d\'achat et optimisez le financement de votre projet immobilier.',
    icon: Home,
    color: 'green',
    features: [
      'Capacité d\'achat maximale',
      'Calcul des charges théoriques',
      'Simulation d\'amortissement',
      'Comparaison achat vs location'
    ],
    estimatedTime: '6-10 minutes',
    difficulty: 'Intermédiaire',
    href: '/simulateurs/immobilier',
    popular: false
  },
  {
    id: 'retraite',
    title: 'Planification retraite',
    description: 'Planifiez votre retraite avec les 3 piliers suisses et optimisez votre prévoyance.',
    icon: Shield,
    color: 'purple',
    features: [
      'Projection des 3 piliers',
      'Calcul des lacunes',
      'Stratégies d\'optimisation',
      'Scénarios multiples'
    ],
    estimatedTime: '8-12 minutes',
    difficulty: 'Avancé',
    href: '/simulateurs/retraite',
    popular: true
  },
  {
    id: 'investissement',
    title: 'Simulateur d\'investissement',
    description: 'Optimisez votre stratégie d\'investissement selon votre profil de risque et objectifs.',
    icon: TrendingUp,
    color: 'orange',
    features: [
      'Profil de risque personnalisé',
      'Allocation d\'actifs optimale',
      'Projections de rendement',
      'Fiscalité des placements'
    ],
    estimatedTime: '7-10 minutes',
    difficulty: 'Intermédiaire',
    href: '/simulateurs/investissement',
    popular: false
  }
];

const stats = [
  {
    label: 'Simulations réalisées',
    value: '150,000+',
    icon: Calculator
  },
  {
    label: 'Utilisateurs actifs',
    value: '25,000+',
    icon: Users
  },
  {
    label: 'Économies générées',
    value: '50M CHF',
    icon: Target
  },
  {
    label: 'Satisfaction moyenne',
    value: '4.9/5',
    icon: Star
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Facile': return 'bg-green-100 text-green-800';
    case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
    case 'Avancé': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export default function SimulatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Simulateurs financiers suisses
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Des outils précis et personnalisés pour optimiser votre situation financière 
                selon les spécificités du système suisse.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simulateurs */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Choisissez votre simulateur
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chaque simulateur est conçu spécifiquement pour le marché suisse, 
              avec les dernières réglementations et taux en vigueur.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {simulators.map((simulator) => (
              <Card 
                key={simulator.id} 
                className={`relative transition-all duration-300 hover:shadow-lg border-2 ${
                  simulator.color === 'blue' ? 'hover:border-blue-200' :
                  simulator.color === 'green' ? 'hover:border-green-200' :
                  simulator.color === 'purple' ? 'hover:border-purple-200' :
                  simulator.color === 'orange' ? 'hover:border-orange-200' :
                  'hover:border-gray-200'
                } ${simulator.popular ? 'ring-2 ring-blue-500 ring-opacity-20' : ''}`}
              >
                {simulator.popular && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      ⭐ Populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${getColorClasses(simulator.color)}`}>
                        <simulator.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{simulator.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getDifficultyColor(simulator.difficulty)}>
                            {simulator.difficulty}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {simulator.estimatedTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardDescription className="text-base mt-3">
                    {simulator.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités incluses :</h4>
                    <ul className="space-y-1">
                      {simulator.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      asChild 
                      className={`w-full ${
                        simulator.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                        simulator.color === 'green' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' :
                        simulator.color === 'purple' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' :
                        simulator.color === 'orange' ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' :
                        'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                      }`}
                      size="lg"
                    >
                      <Link href={simulator.href}>
                        Commencer la simulation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Aide et support */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <span>Besoin d'aide ou de conseils personnalisés ?</span>
            </CardTitle>
            <CardDescription>
              Nos experts financiers sont là pour vous accompagner dans vos décisions importantes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" asChild>
                <Link href="/demo">
                  Tester le chatbot IA
                </Link>
              </Button>
              <Button variant="outline">
                <Link href="#contact">
                  Contacter un expert
                </Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <PieChart className="w-4 h-4 mr-2" />
                Analyse complète de situation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informations légales */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-xs text-yellow-800 font-bold">!</span>
            </div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Avertissement important</p>
              <p>
                Ces simulateurs fournissent des estimations basées sur les données que vous saisissez. 
                Les résultats sont indicatifs et ne constituent pas un conseil financier personnalisé. 
                Pour des décisions importantes, consultez un conseiller financier qualifié.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}