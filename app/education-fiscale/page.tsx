'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Book, 
  GraduationCap, 
  Search, 
  ChevronRight, 
  Home,
  User,
  Building,
  Globe,
  FileText,
  Calculator,
  TrendingUp,
  Shield,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Brain,
  BookOpen,
  Target,
  Users,
  Briefcase,
  PiggyBank,
  AlertCircle,
  Scale,
  MapPin,
  Bot,
  Send,
  X,
  ChevronDown,
  Clock,
  Eye
} from 'lucide-react';
import { getArticlesByCategory } from '@/lib/data/tax-articles';

// Structure des thématiques fiscales
const thematiques = [
  {
    id: 'introduction',
    titre: '🔹 Introduction à la fiscalité suisse',
    icon: Book,
    description: 'Comprendre le système fiscal suisse',
    sousThemes: [
      { id: 'systeme', titre: 'Système fiscal suisse', articles: 8 },
      { id: 'bases-legales', titre: 'Bases légales', articles: 5 },
      { id: 'principes', titre: 'Principes d\'imposition', articles: 6 },
      { id: 'types-impots', titre: 'Types d\'impôts', articles: 4 },
      { id: 'domicile', titre: 'Domicile fiscal', articles: 3 },
      { id: 'baremes', titre: 'Barèmes et progressivité', articles: 4 }
    ]
  },
  {
    id: 'personnes-physiques',
    titre: '👤 Fiscalité des personnes physiques',
    icon: User,
    description: 'Tout sur vos impôts personnels',
    sousThemes: [
      { id: 'salaires', titre: 'Salaires et revenus', articles: 12 },
      { id: 'deductions', titre: 'Déductions fiscales', articles: 15 },
      { id: 'fortune', titre: 'Impôt sur la fortune', articles: 6 },
      { id: 'rentes', titre: 'Rentes AVS/LPP', articles: 8 },
      { id: 'immobilier', titre: 'Revenus immobiliers', articles: 9 }
    ]
  },
  {
    id: 'entreprises',
    titre: '🏢 Indépendants et entreprises',
    icon: Building,
    description: 'Fiscalité professionnelle',
    sousThemes: [
      { id: 'statut', titre: 'Statut fiscal', articles: 7 },
      { id: 'formes-juridiques', titre: 'Formes juridiques', articles: 5 },
      { id: 'tva', titre: 'TVA', articles: 10 },
      { id: 'benefices', titre: 'Imposition du bénéfice', articles: 8 },
      { id: 'dirigeant', titre: 'Rémunération dirigeant', articles: 6 }
    ]
  },
  {
    id: 'patrimoine',
    titre: '💼 Patrimoine et investissements',
    icon: PiggyBank,
    description: 'Optimiser votre patrimoine',
    sousThemes: [
      { id: 'immobilier', titre: 'Biens immobiliers', articles: 11 },
      { id: 'titres', titre: 'Titres et valeurs', articles: 9 },
      { id: 'crypto', titre: 'Cryptomonnaies', articles: 7 },
      { id: 'prevoyance', titre: 'Prévoyance (2e/3e pilier)', articles: 12 },
      { id: 'luxe', titre: 'Biens de luxe', articles: 4 }
    ]
  },
  {
    id: 'international',
    titre: '🌍 Fiscalité internationale',
    icon: Globe,
    description: 'Frontaliers et expatriés',
    sousThemes: [
      { id: 'frontaliers', titre: 'Frontaliers', articles: 8 },
      { id: 'cdi', titre: 'Conventions double imposition', articles: 6 },
      { id: 'expatries', titre: 'Expatriés/Impatriés', articles: 7 },
      { id: 'comptes-etrangers', titre: 'Comptes étrangers', articles: 5 }
    ]
  },
  {
    id: 'declaration',
    titre: '📄 Déclaration et processus',
    icon: FileText,
    description: 'Remplir sa déclaration',
    sousThemes: [
      { id: 'outils', titre: 'Outils en ligne', articles: 6 },
      { id: 'documents', titre: 'Documents nécessaires', articles: 8 },
      { id: 'calendrier', titre: 'Calendrier fiscal', articles: 4 },
      { id: 'taxation', titre: 'Taxation et corrections', articles: 5 }
    ]
  },
  {
    id: 'optimisation',
    titre: '📊 Analyses et optimisation',
    icon: TrendingUp,
    description: 'Réduire légalement vos impôts',
    sousThemes: [
      { id: 'planification', titre: 'Planification annuelle', articles: 6 },
      { id: 'strategies', titre: 'Stratégies de réduction', articles: 10 },
      { id: '3e-pilier', titre: 'Optimisation 3e pilier', articles: 8 },
      { id: 'succession', titre: 'Planification successorale', articles: 7 }
    ]
  },
  {
    id: 'cantons',
    titre: '🏛️ Spécificités cantonales',
    icon: MapPin,
    description: 'Votre canton en détail',
    sousThemes: [
      { id: 'vaud', titre: 'Vaud', articles: 12 },
      { id: 'geneve', titre: 'Genève', articles: 11 },
      { id: 'zurich', titre: 'Zurich', articles: 10 },
      { id: 'comparatif', titre: 'Comparatif intercantonal', articles: 5 }
    ]
  }
];

// Composant pour l'assistant IA
function AssistantAI({ selectedTheme }: { selectedTheme: any }) {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    {
      role: 'assistant',
      content: `👋 Bonjour ! Je suis votre assistant fiscal IA. Je peux vous aider à comprendre les concepts fiscaux suisses et répondre à vos questions. 
      
${selectedTheme ? `Je vois que vous consultez le thème "${selectedTheme.titre}". Voulez-vous que je vous l'explique ?` : 'Sélectionnez un thème pour commencer ou posez-moi directement une question !'}`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          context: selectedTheme ? `L'utilisateur consulte actuellement: ${selectedTheme.titre}` : undefined
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Désolé, une erreur s\'est produite. Veuillez réessayer.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] z-50 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">Assistant Fiscal IA</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(true)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]">
        <ScrollArea className="h-[calc(100%-4rem)] p-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-100">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Posez votre question..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export default function EducationFiscalePage() {
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('themes');

  const filteredThemes = thematiques.filter(theme =>
    theme.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.sousThemes.some(st => st.titre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Centre d'Éducation Fiscale Suisse</h1>
          </div>
          <p className="text-xl text-blue-100 mb-6">
            Maîtrisez la fiscalité suisse avec notre guide interactif et l'assistance IA
          </p>
          
          {/* Barre de recherche */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un thème fiscal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-gray-900 bg-white rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Thématiques
            </TabsTrigger>
            <TabsTrigger value="parcours" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Parcours guidés
            </TabsTrigger>
            <TabsTrigger value="outils" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Outils pratiques
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Onglet Thématiques */}
          <TabsContent value="themes" className="space-y-6">
            {selectedTheme ? (
              // Vue détaillée d'un thème
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTheme(null)}
                  className="mb-4"
                >
                  ← Retour aux thématiques
                </Button>
                
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                      {selectedTheme.icon && <selectedTheme.icon className="h-8 w-8 text-blue-600" />}
                      <div>
                        <CardTitle className="text-2xl">{selectedTheme.titre}</CardTitle>
                        <CardDescription className="text-lg mt-1">
                          {selectedTheme.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Articles disponibles pour cette catégorie */}
                      {(() => {
                        const articles = getArticlesByCategory(selectedTheme.titre);
                        return articles.length > 0 ? (
                          <div>
                            <h3 className="text-xl font-bold mb-4">Articles disponibles</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                              {articles.map((article) => (
                                <Card 
                                  key={article.slug}
                                  className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
                                  onClick={() => window.open(`/education-fiscale/articles/${article.slug}`, '_blank')}
                                >
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge variant="secondary">{article.subcategory}</Badge>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        <span>5 min</span>
                                      </div>
                                    </div>
                                    <CardTitle className="text-lg">{article.title}</CardTitle>
                                    <CardDescription className="text-sm text-gray-600">
                                      {article.description}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <Button className="w-full" variant="outline">
                                      <BookOpen className="h-4 w-4 mr-2" />
                                      Lire l'article
                                    </Button>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-4">
                            {selectedTheme.sousThemes.map((sousTheme: any) => (
                              <Card 
                                key={sousTheme.id}
                                className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{sousTheme.titre}</CardTitle>
                                    <Badge variant="secondary">{sousTheme.articles} articles</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <Button className="w-full" variant="outline">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Consulter
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Suggestions de lecture */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        Articles recommandés pour vous
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <span>Comment optimiser vos déductions fiscales</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <span>Guide complet du 3e pilier</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <span>Fiscalité des cryptomonnaies en 2024</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Liste des thématiques
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredThemes.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <Card
                      key={theme.id}
                      className="hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                      onClick={() => setSelectedTheme(theme)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <CardTitle className="text-lg">{theme.titre}</CardTitle>
                        </div>
                        <CardDescription>{theme.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {theme.sousThemes.slice(0, 3).map((st) => (
                            <div key={st.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{st.titre}</span>
                              <Badge variant="outline">{st.articles}</Badge>
                            </div>
                          ))}
                          {theme.sousThemes.length > 3 && (
                            <p className="text-sm text-blue-600 font-medium pt-2">
                              + {theme.sousThemes.length - 3} autres sous-thèmes
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Onglet Parcours guidés */}
          <TabsContent value="parcours" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Salarié débutant
                  </CardTitle>
                  <CardDescription>
                    Apprenez les bases de la fiscalité pour employés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600">1</div>
                      <span className="text-sm">Comprendre votre certificat de salaire</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">2</div>
                      <span className="text-sm">Identifier vos déductions possibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">3</div>
                      <span className="text-sm">Optimiser avec le 3e pilier</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Commencer le parcours</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Indépendant
                  </CardTitle>
                  <CardDescription>
                    Maîtrisez la fiscalité des entrepreneurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600">1</div>
                      <span className="text-sm">Statut fiscal et forme juridique</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">2</div>
                      <span className="text-sm">TVA et comptabilité</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">3</div>
                      <span className="text-sm">Optimisation fiscale légale</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Commencer le parcours</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Famille
                  </CardTitle>
                  <CardDescription>
                    Optimisez vos impôts en famille
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600">1</div>
                      <span className="text-sm">Déductions pour enfants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">2</div>
                      <span className="text-sm">Frais de garde déductibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">3</div>
                      <span className="text-sm">Planification familiale</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Commencer le parcours</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Frontalier
                  </CardTitle>
                  <CardDescription>
                    Spécificités pour travailleurs frontaliers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600">1</div>
                      <span className="text-sm">Accords fiscaux par pays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">2</div>
                      <span className="text-sm">Impôt à la source</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">3</div>
                      <span className="text-sm">Rectification et remboursements</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Commencer le parcours</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Outils pratiques */}
          <TabsContent value="outils" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Simulateur d'impôts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Calculez vos impôts 2024 en quelques clics
                  </p>
                  <Button className="w-full" variant="outline">Calculer</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                    Check-list documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Liste complète des documents nécessaires
                  </p>
                  <Button className="w-full" variant="outline">Consulter</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Optimiseur fiscal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Découvrez vos économies potentielles
                  </p>
                  <Button className="w-full" variant="outline">Analyser</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-red-600" />
                    Comparateur cantonal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Comparez les impôts entre cantons
                  </p>
                  <Button className="w-full" variant="outline">Comparer</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PiggyBank className="h-5 w-5 text-yellow-600" />
                    Calculateur 3e pilier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Optimisez votre prévoyance
                  </p>
                  <Button className="w-full" variant="outline">Calculer</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Scale className="h-5 w-5 text-indigo-600" />
                    Lexique fiscal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    500+ termes fiscaux expliqués
                  </p>
                  <Button className="w-full" variant="outline">Explorer</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet FAQ */}
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
                <CardDescription>
                  Les réponses aux questions les plus posées sur la fiscalité suisse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    q: "Quel est le montant maximum déductible pour le 3e pilier en 2024 ?",
                    a: "Pour les salariés affiliés à une caisse de pension (2e pilier), le montant maximum est de 7'056 CHF. Pour les indépendants sans 2e pilier, c'est 20% du revenu net, mais au maximum 35'280 CHF."
                  },
                  {
                    q: "Comment sont imposés les gains en cryptomonnaies ?",
                    a: "Les cryptomonnaies sont considérées comme de la fortune mobilière. Les gains en capital privés ne sont pas imposables, mais les activités de trading professionnel le sont. Le mining est considéré comme un revenu indépendant."
                  },
                  {
                    q: "Puis-je déduire mes frais de transport ?",
                    a: "Oui, vous pouvez déduire les frais de transport entre votre domicile et votre lieu de travail. Le montant dépend du moyen de transport utilisé et est plafonné selon les cantons."
                  },
                  {
                    q: "Quelle est la différence entre impôt à la source et taxation ordinaire ?",
                    a: "L'impôt à la source est prélevé directement sur le salaire pour les étrangers (permis B/L) et certains cas spéciaux. La taxation ordinaire concerne les Suisses et les étrangers avec permis C, qui remplissent une déclaration annuelle."
                  },
                  {
                    q: "Comment contester ma taxation ?",
                    a: "Vous avez 30 jours après réception de la décision de taxation pour déposer une réclamation gratuite. Si elle est rejetée, vous pouvez faire opposition puis recours au tribunal cantonal."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="border-b pb-4 last:border-0">
                    <h4 className="font-semibold mb-2 flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      {faq.q}
                    </h4>
                    <p className="text-gray-600 ml-7">{faq.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bannière d'aide */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Besoin d'aide personnalisée ?
                  </h3>
                  <p className="text-gray-600">
                    Notre assistant IA est là pour répondre à toutes vos questions fiscales
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <Sparkles className="h-3 w-3 mr-1" />
                IA Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assistant AI flottant */}
      <AssistantAI selectedTheme={selectedTheme} />
    </div>
  );
}