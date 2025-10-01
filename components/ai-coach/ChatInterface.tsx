'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Calculator, 
  Target, 
  TrendingUp,
  Loader2,
  Lightbulb,
  MessageCircle,
  Shield,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actionItems?: ActionItem[];
}

interface ActionItem {
  type: 'simulate' | 'navigate' | 'document' | 'reminder';
  label: string;
  action: string;
  data?: any;
}

interface SuggestedQuestion {
  text: string;
  category: 'impots' | 'epargne' | 'immobilier' | 'retraite' | 'general';
}

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { text: "Comment optimiser mes impôts cette année ?", category: "impots" },
  { text: "Combien devrais-je épargner chaque mois ?", category: "epargne" },
  { text: "Puis-je me permettre d'acheter un appartement ?", category: "immobilier" },
  { text: "Comment planifier ma retraite efficacement ?", category: "retraite" },
  { text: "Quels sont les avantages du 3e pilier ?", category: "retraite" },
  { text: "Comment améliorer mon score financier ?", category: "general" }
];

interface ChatInterfaceProps {
  compact?: boolean;
}

export default function ChatInterface({ compact = false }: ChatInterfaceProps) {
  const router = useRouter();
  
  // Vérifier l'authentification admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('aurore_auth_user');
      
      setIsAuthenticated(!!adminToken);
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Erreur parse user data:', error);
        }
      }
    }
  }, []);
  
  // Récupérer les données complètes du localStorage
  const getUserData = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Récupérer les données depuis aurore_auth_user
      const auroreUserStr = localStorage.getItem('aurore_auth_user');
      let userData = null;
      
      if (auroreUserStr) {
        const auroreUser = JSON.parse(auroreUserStr);
        console.log('🎯 Données aurore_auth_user trouvées:', auroreUser);
        
        // Créer le profil financier à partir des données disponibles
        const financialProfile = {
          revenuBrutAnnuel: auroreUser.revenuBrutAnnuel || auroreUser.revenu || 0,
          autresRevenus: auroreUser.autresRevenus || 0,
          revenuConjoint: auroreUser.revenuConjoint || 0,
          liquidites: auroreUser.liquidites || auroreUser.epargne || 0,
          compteEpargne: auroreUser.compteEpargne || auroreUser.epargne || 0,
          investissements: auroreUser.investissements || 0,
          troisièmePilier: auroreUser.troisiemePilier || auroreUser['3ePilier'] || 0,
          toleranceRisque: auroreUser.toleranceRisque || 'modéré',
          experienceInvestissement: auroreUser.experienceInvestissement || 'débutant',
          dettes: auroreUser.dettes || 0,
          patrimoine: auroreUser.patrimoine || 0
        };
        
        // Vérifier si on a des données financières valides
        const hasFinancialData = Object.values(financialProfile).some(v => v !== 0 && v !== 'modéré' && v !== 'débutant');
        
        userData = {
          user: auroreUser,
          profil: auroreUser, // L'objet entier contient le profil
          financialProfile: hasFinancialData ? financialProfile : {
            // Valeurs par défaut si pas de données financières
            revenuBrutAnnuel: 80000, // Salaire médian suisse
            autresRevenus: 0,
            revenuConjoint: 0,
            liquidites: 10000,
            compteEpargne: 20000,
            investissements: 0,
            troisièmePilier: 0,
            toleranceRisque: 'modéré',
            experienceInvestissement: 'débutant',
            dettes: 0,
            patrimoine: 30000
          }
        };
      }
      
      // Fallback sur les anciennes clés si elles existent
      if (!userData || !userData.profil) {
        const userStr = localStorage.getItem('user');
        const profileStr = localStorage.getItem('userProfile');
        const financialStr = localStorage.getItem('financialProfile');
        
        userData = {
          user: userStr ? JSON.parse(userStr) : null,
          profil: profileStr ? JSON.parse(profileStr) : null,
          financialProfile: financialStr ? JSON.parse(financialStr) : null
        };
      }
      
      console.log('🔍 Données finales pour le chatbot:', {
        hasUser: !!userData?.user,
        hasProfil: !!userData?.profil,
        hasFinancial: !!userData?.financialProfile,
        financialData: userData?.financialProfile
      });
      return userData;
    } catch (error) {
      console.error('Erreur lecture localStorage:', error);
      return null;
    }
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: isAuthenticated 
        ? `👋 Bonjour ${user?.email?.split('@')[0]} ! Je suis Aurore, votre conseiller financier IA spécialisé dans le système suisse. J'ai accès à votre profil et peux vous donner des conseils personnalisés. Comment puis-je vous aider aujourd'hui ?`
        : '👋 Bonjour ! Je suis Aurore, votre conseiller financier IA spécialisé dans le système suisse. Pour des conseils personnalisés, connectez-vous à votre compte. Comment puis-je vous aider ?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const userData = getUserData();
      console.log('🔍 Données envoyées au chatbot:', userData); // Debug
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          userId: user?.id || userData?.user?.id,
          userProfile: userData?.profil, // Profil depuis localStorage
          financialProfile: userData?.financialProfile // Données financières depuis localStorage
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec le serveur');
      }

      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        actionItems: extractActionItems(data.message) // Extraire les actions du contenu
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Désolé, une erreur est survenue. Veuillez réessayer dans quelques instants.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Extraire les actions des réponses de l'IA (détection de patterns dans le texte)
  const extractActionItems = (content: string): ActionItem[] => {
    const actions: ActionItem[] = [];
    
    // Détecter les mentions de simulateurs spécifiques
    if (content.toLowerCase().includes('simulateur') || content.includes('/simulateurs/')) {
      const simulatorMatches = content.match(/\/simulateurs\/(\w+)/g);
      if (simulatorMatches) {
        simulatorMatches.forEach(match => {
          const type = match.split('/')[2];
          const labels: Record<string, string> = {
            'impots': 'Simuler mes impôts',
            'immobilier': 'Calculer ma capacité d\'achat',
            'retraite': 'Planifier ma retraite',
            'investissement': 'Optimiser mes investissements'
          };
          
          if (labels[type]) {
            actions.push({
              type: 'simulate',
              label: labels[type],
              action: match
            });
          }
        });
      }
    }
    
    // Détecter les suggestions d'objectifs
    if (content.toLowerCase().includes('objectif') || content.includes('/objectifs')) {
      actions.push({
        type: 'navigate',
        label: 'Créer un objectif',
        action: '/objectifs'
      });
    }
    
    // Détecter les suggestions de profil
    if (content.toLowerCase().includes('profil') || content.includes('/profil')) {
      actions.push({
        type: 'navigate',
        label: 'Compléter mon profil',
        action: '/profil'
      });
    }
    
    return actions;
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleActionClick = (action: ActionItem) => {
    console.log('Action clicked:', action);
    
    // Navigation vers la page appropriée
    if (action.action.startsWith('/')) {
      router.push(action.action);
    }
  };

  const renderMessageContent = (content: string) => {
    // Détection des boutons intégrés dans le format [ACTION:type] text
    const buttonRegex = /\[(\w+):(\w+)\]\s*([^[\n]*?)(?=\[|\n|$)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = buttonRegex.exec(content)) !== null) {
      // Ajouter le texte avant le bouton
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      const [fullMatch, actionType, simulatorType, buttonText] = match;
      const actionMap: { [key: string]: string } = {
        'impots': '/simulateurs/impots',
        'retraite': '/simulateurs/retraite', 
        'investissement': '/simulateurs/investissement',
        'immobilier': '/simulateurs/immobilier',
        'simulateurs': '/simulateurs'
      };

      const url = actionMap[simulatorType] || actionMap[actionType.toLowerCase()] || '/simulateurs';
      
      parts.push(
        <Button
          key={match.index}
          size="sm"
          variant="outline"
          className="inline-flex mx-1 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          onClick={() => router.push(url)}
        >
          <Calculator className="w-3 h-3 mr-1" />
          {buttonText.trim()}
        </Button>
      );

      lastIndex = match.index + fullMatch.length;
    }

    // Ajouter le reste du texte
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 1 ? parts : content;
  };

  return (
    <div className={compact ? "h-full flex flex-col" : "max-w-4xl mx-auto h-[600px] bg-white rounded-lg shadow-lg border flex flex-col"}>
      {/* Header - Only show in non-compact mode */}
      {!compact && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Coach IA Aurore Finances</h3>
              <p className="text-sm opacity-90">Conseiller financier expert en Suisse</p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto space-y-4 ${compact ? 'p-3' : 'p-4'}`}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-100 text-blue-600 ml-2' 
                  : 'bg-purple-100 text-purple-600 mr-2'
              }`}>
                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {renderMessageContent(message.content)}
                </div>
                {message.actionItems && message.actionItems.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actionItems.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleActionClick(action)}
                      >
                        {action.type === 'simulate' && <Calculator className="w-3 h-3 mr-1" />}
                        {action.type === 'navigate' && <ArrowRight className="w-3 h-3 mr-1" />}
                        {action.type === 'reminder' && <Target className="w-3 h-3 mr-1" />}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-sm text-gray-600">Je réfléchis...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions - Hide in compact mode */}
      {!compact && showSuggestions && messages.length === 1 && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Questions populaires :</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SUGGESTED_QUESTIONS.slice(0, 4).map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start text-left h-auto py-2 px-3 text-xs"
                onClick={() => handleSuggestedQuestion(suggestion.text)}
              >
                <MessageCircle className="w-3 h-3 mr-2 text-blue-500" />
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className={`border-t ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={compact ? "Votre question..." : "Posez votre question financière..."}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            disabled={isLoading}
            className="flex-1 text-sm"
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            size={compact ? "sm" : "icon"}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Send className={compact ? "w-3 h-3" : "w-4 h-4"} />
          </Button>
        </div>
        {!compact && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            Appuyez sur Entrée pour envoyer • Les conseils sont basés sur votre profil financier
          </div>
        )}
      </div>
    </div>
  );
}