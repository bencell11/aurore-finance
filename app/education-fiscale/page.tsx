'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Eye,
  Hash,
  ExternalLink,
  Lightbulb,
  Link as LinkIcon
} from 'lucide-react';
import { getArticlesByCategory, getArticleBySlug } from '@/lib/data/tax-articles';
import { useTranslation } from '@/components/SimpleLanguageSelector';

// Fonction pour traduire les thématiques
const getTranslatedThematiques = (t: any) => [
  {
    id: 'introduction',
    titre: `🔹 ${t.introToTax}`,
    icon: Book,
    description: 'Comprendre le système fiscal suisse',
    sousThemes: [
      { id: 'systeme', titre: 'Système fiscal suisse', articles: 1, slug: 'systeme-fiscal-suisse' },
      { id: 'bases-legales', titre: 'Bases légales', articles: 1, slug: 'bases-legales-fiscalite' },
      { id: 'principes', titre: 'Principes d\'imposition', articles: 1, slug: 'principes-imposition' },
      { id: 'types-impots', titre: 'Types d\'impôts', articles: 1, slug: 'types-impots' },
      { id: 'domicile', titre: 'Domicile fiscal', articles: 1, slug: 'domicile-fiscal' },
      { id: 'baremes', titre: 'Barèmes et progressivité', articles: 1, slug: 'baremes-progressivite' }
    ]
  },
  {
    id: 'personnes-physiques',
    titre: `👤 ${t.personalTax}`,
    icon: User,
    description: 'Tout sur vos impôts personnels',
    sousThemes: [
      { id: 'salaires', titre: 'Salaires et revenus', articles: 1, slug: 'revenus-imposables-salaries' },
      { id: 'deductions', titre: 'Déductions fiscales', articles: 1, slug: 'deductions-fiscales-principales' },
      { id: 'fortune', titre: 'Impôt sur la fortune', articles: 1, slug: 'impot-fortune-personnes-physiques' },
      { id: 'rentes', titre: 'Rentes AVS/LPP', articles: 1, slug: 'rentes-avs-lpp-imposition' },
      { id: 'immobilier', titre: 'Revenus immobiliers', articles: 1, slug: 'revenus-immobiliers-personnes-physiques' }
    ]
  },
  {
    id: 'entreprises',
    titre: `🏢 ${t.businessTax}`,
    icon: Building,
    description: 'Fiscalité professionnelle',
    sousThemes: [
      { id: 'statut', titre: 'Statut fiscal', articles: 1, slug: 'statut-independant-criteres' },
      { id: 'formes-juridiques', titre: 'Formes juridiques', articles: 1, slug: 'formes-juridiques-entreprises' },
      { id: 'tva', titre: 'TVA', articles: 1, slug: 'tva-assujettissement-entreprises' },
      { id: 'benefices', titre: 'Imposition du bénéfice', articles: 1, slug: 'imposition-benefice-entreprises' },
      { id: 'dirigeant', titre: 'Rémunération dirigeant', articles: 1, slug: 'remuneration-dirigeant-entreprises' }
    ]
  },
  {
    id: 'patrimoine',
    titre: '💼 Patrimoine et investissements',
    icon: PiggyBank,
    description: 'Optimiser votre patrimoine',
    sousThemes: [
      { id: 'immobilier', titre: 'Biens immobiliers', articles: 1, slug: 'valeur-locative-residence' },
      { id: 'titres', titre: 'Titres et valeurs', articles: 1, slug: 'titres-valeurs-mobilieres' },
      { id: 'crypto', titre: 'Cryptomonnaies', articles: 1, slug: 'fiscalite-cryptomonnaies-suisse' },
      { id: 'prevoyance', titre: 'Prévoyance (2e/3e pilier)', articles: 1, slug: 'prevoyance-2e-3e-pilier' },
      { id: 'luxe', titre: 'Biens de luxe', articles: 0, slug: null }
    ]
  },
  {
    id: 'international',
    titre: `🌍 ${t.internationalTax}`,
    icon: Globe,
    description: 'Frontaliers et expatriés',
    sousThemes: [
      { id: 'frontaliers', titre: 'Frontaliers', articles: 1, slug: 'frontaliers-imposition' },
      { id: 'cdi', titre: 'Conventions double imposition', articles: 1, slug: 'conventions-double-imposition' },
      { id: 'expatries', titre: 'Expatriés/Impatriés', articles: 0, slug: null },
      { id: 'comptes-etrangers', titre: 'Comptes étrangers', articles: 0, slug: null }
    ]
  },
  {
    id: 'declaration',
    titre: `📄 ${t.declarationProcess}`,
    icon: FileText,
    description: 'Remplir sa déclaration',
    sousThemes: [
      { id: 'declaration', titre: 'Délais et procédures', articles: 1, slug: 'declaration-impots-delais' },
      { id: 'documents', titre: 'Documents nécessaires', articles: 1, slug: 'documents-necessaires-declaration' },
      { id: 'calendrier', titre: 'Calendrier fiscal', articles: 1, slug: 'calendrier-fiscal-suisse' },
      { id: 'taxation', titre: 'Taxation et corrections', articles: 0, slug: null }
    ]
  },
  {
    id: 'optimisation',
    titre: `📊 ${t.analysisOptimization}`,
    icon: TrendingUp,
    description: 'Réduire légalement vos impôts',
    sousThemes: [
      { id: 'strategies', titre: 'Stratégies d\'optimisation', articles: 1, slug: 'optimisation-fiscale-legale' },
      { id: 'planification', titre: 'Planification annuelle', articles: 0, slug: null },
      { id: '3e-pilier', titre: 'Optimisation 3e pilier', articles: 1, slug: 'optimisation-troisieme-pilier' },
      { id: 'succession', titre: 'Planification successorale', articles: 0, slug: null }
    ]
  },
  {
    id: 'cantons',
    titre: `🏛️ ${t.cantonalSpecifics}`,
    icon: MapPin,
    description: 'Votre canton en détail',
    sousThemes: [
      { id: 'comparatif', titre: 'Comparatif intercantonal', articles: 1, slug: 'comparatif-fiscal-cantonal' },
      { id: 'vaud', titre: 'Vaud', articles: 0, slug: null },
      { id: 'geneve', titre: 'Genève', articles: 0, slug: null },
      { id: 'zurich', titre: 'Zurich', articles: 0, slug: null }
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

// Composant pour afficher un article complet
function ArticleDisplay({ slug }: { slug: string }) {
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return (
      <div className="p-4 text-center text-gray-500">
        Article non trouvé
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête article */}
      <div className="border-b border-gradient-to-r from-blue-200 to-purple-200 pb-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0">
            {article.category}
          </Badge>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>5 min</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{article.views || 0}</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {article.title}
        </h2>
        <p className="text-gray-600 text-base leading-relaxed">{article.description}</p>
      </div>

      {/* Contenu article */}
      <div className="space-y-6">
        {article.sections.map((section, idx) => (
          <div key={idx} className="space-y-4 bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {idx + 1}
              </div>
              <Hash className="h-5 w-5 text-blue-600" />
              {section.title}
            </h3>
            
            {/* Contenu de section */}
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {section.content.split('\n').map((paragraph, pIdx) => (
                paragraph.trim() && (
                  <p key={pIdx} className="text-sm">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Points clés */}
            {section.keyPoints && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                  </div>
                  Points clés à retenir
                </h4>
                <ul className="space-y-2">
                  {section.keyPoints.map((point, kIdx) => (
                    <li key={kIdx} className="flex items-start gap-3 text-sm bg-white rounded-md p-2 shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ChevronRight className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exemple pratique */}
            {section.example && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  Exemple pratique
                </h4>
                <div className="bg-white rounded-md p-3 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">{section.example}</p>
                </div>
              </div>
            )}

            {/* Avertissement */}
            {section.warning && (
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 shadow-sm">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-800">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  Attention
                </h4>
                <div className="bg-white rounded-md p-3 shadow-sm border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700 leading-relaxed">{section.warning}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Références légales */}
        {article.legalReferences && article.legalReferences.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-purple-600" />
              Références légales
            </h4>
            <ul className="space-y-2">
              {article.legalReferences.map((ref, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <FileText className="h-3 w-3 text-gray-400" />
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {ref.title}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant principal
export default function EducationFiscalePage() {
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('themes');
  const t = useTranslation();

  const thematiques = getTranslatedThematiques(t);
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
            <h1 className="text-4xl font-bold">{t.taxEducationCenter}</h1>
          </div>
          <p className="text-xl text-blue-100 mb-6">
            Maîtrisez la fiscalité suisse avec notre guide interactif et l'assistance IA
          </p>
          
          {/* Barre de recherche */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
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

          {/* Onglet Thématiques avec articles intégrés */}
          <TabsContent value="themes" className="space-y-6">
            <div className="space-y-6">
              {filteredThemes.map((theme) => {
                const Icon = theme.icon;
                const articles = getArticlesByCategory(theme.titre);
                
                return (
                  <Card key={theme.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{theme.titre}</CardTitle>
                          <CardDescription className="text-base">
                            {theme.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-0">
                        {theme.sousThemes.map((sousTheme: any, index: number) => (
                          <Collapsible key={sousTheme.id}>
                            <CollapsibleTrigger asChild>
                              <div className="w-full p-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b border-gray-100 cursor-pointer transition-all duration-200 group">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                        {index + 1}
                                      </div>
                                      <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-data-[state=open]:rotate-90" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{sousTheme.titre}</span>
                                      {sousTheme.articles > 0 && (
                                        <span className="text-xs text-gray-500 mt-0.5">Cliquez pour lire l'article complet</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {sousTheme.articles > 0 ? (
                                      <div className="flex items-center gap-2">
                                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                                          <BookOpen className="h-3 w-3 mr-1" />
                                          {sousTheme.articles} article{sousTheme.articles > 1 ? 's' : ''}
                                        </Badge>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                          <Clock className="h-3 w-3 mr-1" />
                                          Bientôt disponible
                                        </Badge>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="p-0">
                                {sousTheme.slug ? (
                                  <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-t border-blue-100">
                                    <div className="p-6">
                                      <ArticleDisplay slug={sousTheme.slug} />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100">
                                    <div className="max-w-md mx-auto">
                                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                        <BookOpen className="h-8 w-8 text-gray-500" />
                                      </div>
                                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Article en préparation</h3>
                                      <p className="text-sm text-gray-600 mb-4">Ce contenu sera bientôt disponible dans notre centre d'éducation fiscale</p>
                                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        <span>En cours de rédaction</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
                  <Button className="w-full" variant="outline">{t.consult}</Button>
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