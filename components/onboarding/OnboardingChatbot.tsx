'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Target,
  Shield,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useAuthContext } from '@/lib/contexts/AuthContext';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  metadata?: {
    field?: string;
    value?: any;
    suggestions?: string[];
  };
}

interface OnboardingData {
  age?: number;
  situationFamiliale?: string;
  revenus?: {
    salaireBrut?: number;
    autresRevenus?: number;
  };
  charges?: {
    loyer?: number;
    assurances?: number;
    autresCharges?: number;
  };
  objectifsFinanciers?: string[];
  toleranceRisque?: 'faible' | 'moderee' | 'elevee';
  horizonInvestissement?: string;
  connaissancesFinancieres?: 'debutant' | 'intermediaire' | 'avance';
  canton?: string;
}

const ONBOARDING_QUESTIONS = [
  {
    id: 'welcome',
    message: '👋 Bonjour ! Je suis Claude, votre assistant financier personnel.\n\nJe vais vous poser quelques questions pour créer votre profil financier personnalisé. Cela me permettra de vous donner les meilleurs conseils adaptés à votre situation.\n\nCommençons ! Quel est votre âge ?',
    field: 'age',
    type: 'number',
    validation: (value: number) => value >= 18 && value <= 100,
    errorMessage: 'Veuillez entrer un âge entre 18 et 100 ans'
  },
  {
    id: 'situation',
    message: 'Merci ! Quelle est votre situation familiale actuelle ?',
    field: 'situationFamiliale',
    type: 'choice',
    suggestions: ['Célibataire', 'Marié(e)', 'Pacsé(e)', 'Divorcé(e)', 'Veuf(ve)']
  },
  {
    id: 'canton',
    message: 'Dans quel canton suisse résidez-vous ?',
    field: 'canton',
    type: 'choice',
    suggestions: ['Vaud', 'Genève', 'Zurich', 'Berne', 'Valais', 'Fribourg', 'Neuchâtel', 'Autre']
  },
  {
    id: 'revenus',
    message: 'Parfait ! Maintenant parlons de vos revenus.\n\nQuel est votre salaire brut annuel en CHF ? (Entrez 0 si vous n\'avez pas de salaire)',
    field: 'revenus.salaireBrut',
    type: 'number',
    validation: (value: number) => value >= 0,
    errorMessage: 'Veuillez entrer un montant valide'
  },
  {
    id: 'autresRevenus',
    message: 'Avez-vous d\'autres revenus annuels (location, dividendes, etc.) ? Si non, entrez 0.',
    field: 'revenus.autresRevenus',
    type: 'number',
    validation: (value: number) => value >= 0
  },
  {
    id: 'loyer',
    message: 'Maintenant, vos charges mensuelles.\n\nQuel est le montant de votre loyer ou hypothèque par mois ? (0 si propriétaire sans hypothèque)',
    field: 'charges.loyer',
    type: 'number',
    validation: (value: number) => value >= 0
  },
  {
    id: 'assurances',
    message: 'Quel est le total mensuel de vos assurances (maladie, voiture, etc.) ?',
    field: 'charges.assurances',
    type: 'number',
    validation: (value: number) => value >= 0
  },
  {
    id: 'autresCharges',
    message: 'Quelles sont vos autres charges mensuelles (alimentation, transport, loisirs, etc.) ?',
    field: 'charges.autresCharges',
    type: 'number',
    validation: (value: number) => value >= 0
  },
  {
    id: 'objectifs',
    message: 'Excellent ! Quels sont vos principaux objectifs financiers ? (Vous pouvez en sélectionner plusieurs)',
    field: 'objectifsFinanciers',
    type: 'multiple',
    suggestions: [
      'Constituer une épargne de sécurité',
      'Devenir propriétaire',
      'Préparer ma retraite (3e pilier)',
      'Investir et faire fructifier mon capital',
      'Optimiser mes impôts',
      'Financer les études de mes enfants'
    ]
  },
  {
    id: 'risque',
    message: 'Quelle est votre tolérance au risque pour vos investissements ?',
    field: 'toleranceRisque',
    type: 'choice',
    suggestions: [
      'Faible - Je préfère la sécurité',
      'Modérée - J\'accepte un risque raisonnable',
      'Élevée - Je recherche la performance'
    ]
  },
  {
    id: 'horizon',
    message: 'Sur quel horizon de temps envisagez-vous vos investissements ?',
    field: 'horizonInvestissement',
    type: 'choice',
    suggestions: [
      'Court terme (< 3 ans)',
      'Moyen terme (3-10 ans)',
      'Long terme (> 10 ans)'
    ]
  },
  {
    id: 'connaissances',
    message: 'Enfin, comment évaluez-vous vos connaissances en matière de finances et d\'investissements ?',
    field: 'connaissancesFinancieres',
    type: 'choice',
    suggestions: ['Débutant', 'Intermédiaire', 'Avancé']
  }
];

export default function OnboardingChatbot({ onComplete }: { onComplete: (data: OnboardingData, scoring: string) => void }) {
  const { user, updateUserProfile } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Démarrer avec le message de bienvenue
    setTimeout(() => {
      addAssistantMessage(ONBOARDING_QUESTIONS[0].message, ONBOARDING_QUESTIONS[0]);
    }, 500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addAssistantMessage = (content: string, question?: typeof ONBOARDING_QUESTIONS[0]) => {
    setIsTyping(true);
    setTimeout(() => {
      const message: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        metadata: question ? {
          field: question.field,
          suggestions: question.suggestions
        } : undefined
      };
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, 800);
  };

  const addUserMessage = (content: string, value?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      metadata: { value }
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (value?: string | number, isChoice: boolean = false) => {
    const inputValue = value !== undefined ? value : currentInput.trim();
    if (!inputValue && !isChoice) return;

    const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
    let processedValue: any = inputValue;

    // Validation
    if (currentQuestion.type === 'number') {
      processedValue = parseFloat(inputValue.toString());
      if (isNaN(processedValue)) {
        addAssistantMessage('❌ Veuillez entrer un nombre valide.');
        return;
      }
      if (currentQuestion.validation && !currentQuestion.validation(processedValue)) {
        addAssistantMessage(currentQuestion.errorMessage || '❌ Valeur invalide.');
        return;
      }
    }

    // Ajouter le message utilisateur
    addUserMessage(inputValue.toString(), processedValue);
    setCurrentInput('');
    setSelectedChoices([]);

    // Sauvegarder la donnée
    const fieldPath = currentQuestion.field.split('.');
    const newData = { ...onboardingData };

    if (fieldPath.length === 1) {
      if (currentQuestion.type === 'multiple') {
        newData[fieldPath[0] as keyof OnboardingData] = selectedChoices.length > 0
          ? selectedChoices
          : [inputValue.toString()];
      } else if (currentQuestion.field === 'toleranceRisque') {
        const riskMap: any = {
          'Faible - Je préfère la sécurité': 'faible',
          'Modérée - J\'accepte un risque raisonnable': 'moderee',
          'Élevée - Je recherche la performance': 'elevee'
        };
        newData[fieldPath[0] as keyof OnboardingData] = riskMap[inputValue.toString()] || 'moderee';
      } else if (currentQuestion.field === 'connaissancesFinancieres') {
        const knowledgeMap: any = {
          'Débutant': 'debutant',
          'Intermédiaire': 'intermediaire',
          'Avancé': 'avance'
        };
        newData[fieldPath[0] as keyof OnboardingData] = knowledgeMap[inputValue.toString()] || 'debutant';
      } else {
        newData[fieldPath[0] as keyof OnboardingData] = processedValue as any;
      }
    } else if (fieldPath.length === 2) {
      if (!newData[fieldPath[0] as keyof OnboardingData]) {
        (newData as any)[fieldPath[0]] = {};
      }
      (newData as any)[fieldPath[0]][fieldPath[1]] = processedValue;
    }

    setOnboardingData(newData);

    // Passer à la question suivante
    const nextStep = currentStep + 1;
    if (nextStep < ONBOARDING_QUESTIONS.length) {
      setCurrentStep(nextStep);
      setTimeout(() => {
        addAssistantMessage(ONBOARDING_QUESTIONS[nextStep].message, ONBOARDING_QUESTIONS[nextStep]);
      }, 1000);
    } else {
      // Onboarding terminé
      finishOnboarding(newData);
    }
  };

  const finishOnboarding = async (data: OnboardingData) => {
    // Calculer le scoring
    const scoring = calculateScoring(data);

    // Message de fin personnalisé
    const summaryMessage = `
🎉 **Profil complété avec succès !**

Voici votre profil :
• Niveau : **${scoring.toUpperCase()}**
• Canton : ${data.canton}
• Revenus annuels : ${formatCurrency((data.revenus?.salaireBrut || 0) + (data.revenus?.autresRevenus || 0))}
• Charges mensuelles : ${formatCurrency((data.charges?.loyer || 0) + (data.charges?.assurances || 0) + (data.charges?.autresCharges || 0))}
• Tolérance au risque : ${data.toleranceRisque}

Je génère maintenant votre document d'optimisation personnalisé...
    `.trim();

    addAssistantMessage(summaryMessage);

    // Sauvegarder le profil complet
    if (user?.id) {
      await updateUserProfile(user.id, {
        age: data.age,
        situationFamiliale: data.situationFamiliale,
        canton: data.canton,
        revenuAnnuelBrut: data.revenus?.salaireBrut || 0,
        autresRevenus: data.revenus?.autresRevenus || 0,
        chargesMensuelles: {
          loyer: data.charges?.loyer || 0,
          assurances: data.charges?.assurances || 0,
          autres: data.charges?.autresCharges || 0
        },
        objectifsFinanciers: data.objectifsFinanciers || [],
        toleranceRisque: data.toleranceRisque || 'moderee',
        horizonInvestissement: data.horizonInvestissement,
        niveauConnaissances: data.connaissancesFinancieres || 'debutant'
      });
    }

    setTimeout(() => {
      onComplete(data, scoring);
    }, 2000);
  };

  const calculateScoring = (data: OnboardingData): string => {
    const knowledge = data.connaissancesFinancieres || 'debutant';
    const revenus = (data.revenus?.salaireBrut || 0) + (data.revenus?.autresRevenus || 0);
    const charges = (data.charges?.loyer || 0) + (data.charges?.assurances || 0) + (data.charges?.autresCharges || 0);
    const capaciteEpargne = revenus / 12 - charges;

    if (knowledge === 'avance' && capaciteEpargne > 3000) return 'avance';
    if (knowledge === 'intermediaire' || capaciteEpargne > 1500) return 'intermediaire';
    return 'debutant';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleChoiceClick = (choice: string) => {
    const currentQuestion = ONBOARDING_QUESTIONS[currentStep];

    if (currentQuestion.type === 'multiple') {
      setSelectedChoices(prev =>
        prev.includes(choice)
          ? prev.filter(c => c !== choice)
          : [...prev, choice]
      );
    } else {
      handleSendMessage(choice, true);
    }
  };

  const handleConfirmMultiple = () => {
    if (selectedChoices.length > 0) {
      handleSendMessage(selectedChoices.join(', '), true);
    }
  };

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      {/* Header avec progression */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Assistant Onboarding IA</h3>
              <p className="text-sm text-white/80">Configuration de votre profil</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-none">
            {currentStep + 1}/{ONBOARDING_QUESTIONS.length}
          </Badge>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              {message.metadata?.suggestions && message.role === 'assistant' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.metadata.suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant={selectedChoices.includes(suggestion) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChoiceClick(suggestion)}
                      className={selectedChoices.includes(suggestion) ? "bg-blue-600 text-white" : ""}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4 rounded-b-xl">
        {currentQuestion?.type === 'multiple' && selectedChoices.length > 0 ? (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">{selectedChoices.length} sélectionné(s)</span>
            </div>
            <Button onClick={handleConfirmMultiple} className="bg-blue-600 hover:bg-blue-700">
              Confirmer
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : currentQuestion?.type === 'choice' ? null : (
          <div className="flex gap-2">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={currentQuestion?.type === 'number' ? 'Entrez un nombre...' : 'Votre réponse...'}
              type={currentQuestion?.type === 'number' ? 'number' : 'text'}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!currentInput.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
