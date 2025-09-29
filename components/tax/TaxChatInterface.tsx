'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Send, Mic, MicOff, Bot, User, FileText, Calculator } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    category?: string;
    field?: string;
    validated?: boolean;
    confidence?: number;
  };
}

interface Session {
  id: string;
  progress: number;
  currentSection: string;
  collectedData: any;
}

interface TaxChatInterfaceProps {
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

export function TaxChatInterface({ profile, onProfileUpdate }: TaxChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialisation de la session
  useEffect(() => {
    initializeSession();
  }, []);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeSession = async () => {
    // Message de bienvenue simple
    const welcomeMessage: Message = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content: `🏦 **Bonjour ! Je suis votre expert fiscal suisse.**

Je peux répondre à toutes vos questions sur :
• Calculs d'impôts et optimisations
• Déductions fiscales (3e pilier, LPP, frais...)
• Échéances et obligations légales
• Législation fiscale cantonale et fédérale

**Comment puis-je vous aider aujourd'hui ?**`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    setSession({
      id: 'session-' + Date.now(),
      progress: 0,
      currentSection: 'chat',
      collectedData: {}
    });
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Envoi du message à l'API IA de l'assistant fiscal
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          sessionId: session?.id,
          userId: 'demo-user'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'assistant');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        metadata: {}
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Mise à jour de la session avec le nouvel ID si nécessaire
      if (!session?.id && data.sessionId) {
        setSession({
          id: data.sessionId,
          progress: 0,
          currentSection: 'chat',
          collectedData: {}
        });
      }

    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: '❌ Désolé, une erreur s\'est produite. Pouvez-vous reformuler votre question ?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Erreur de reconnaissance vocale');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const generateSummary = async () => {
    try {
      const response = await fetch('/api/tax/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session?.id })
      });

      if (response.ok) {
        const data = await response.json();
        const summaryMessage: Message = {
          id: 'summary-' + Date.now(),
          role: 'assistant',
          content: data.summary,
          timestamp: new Date(),
          metadata: { category: 'summary' }
        };
        setMessages(prev => [...prev, summaryMessage]);
      }
    } catch (error) {
      console.error('Erreur génération résumé:', error);
    }
  };

  const calculateTax = async () => {
    try {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: new Date().getFullYear() })
      });

      if (response.ok) {
        const data = await response.json();
        const calculationMessage: Message = {
          id: 'calculation-' + Date.now(),
          role: 'assistant',
          content: `🧮 **Calcul de vos impôts ${new Date().getFullYear()}**

💰 **Impôt total:** ${data.calculation.totalTax.toLocaleString('fr-CH')} CHF
📊 **Taux effectif:** ${data.calculation.effectiveRate.toFixed(2)}%
📈 **Taux marginal:** ${data.calculation.marginalRate.toFixed(2)}%

${data.optimizations.length > 0 ? `
🎯 **Optimisations identifiées:**
${data.optimizations.map((opt: any) => `• ${opt.title}: ${opt.savingAmount.toLocaleString('fr-CH')} CHF d'économie`).join('\n')}

💡 Souhaitez-vous que je vous explique comment mettre en place ces optimisations ?
` : ''}`,
          timestamp: new Date(),
          metadata: { category: 'calculation' }
        };
        setMessages(prev => [...prev, calculationMessage]);
      }
    } catch (error) {
      console.error('Erreur calcul fiscal:', error);
    }
  };

  const handleQuickAction = (action: string) => {
    const quickActions: Record<string, string> = {
      guide: 'Peux-tu me guider étape par étape pour ma déclaration ?',
      calculate: 'Calcule mes impôts avec les données actuelles',
      optimize: 'Quelles sont mes possibilités d\'optimisation fiscale ?',
      documents: 'De quels documents ai-je besoin ?',
      deadline: 'Quelles sont les échéances fiscales importantes ?',
      help: 'aide'
    };

    if (quickActions[action]) {
      sendMessage(quickActions[action]);
    }
  };

  const getSectionIcon = (category?: string) => {
    switch (category) {
      case 'income': return <Calculator className="h-4 w-4" />;
      case 'deductions': return <FileText className="h-4 w-4" />;
      case 'summary': return <FileText className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg">
      {/* En-tête avec progression */}
      {session && session.progress > 0 && (
        <div className="p-4 border-b bg-blue-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Progression: {session.currentSection}
            </span>
            <span className="text-sm text-blue-700">{session.progress}%</span>
          </div>
          <Progress value={session.progress} className="h-2" />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 mt-1">
                    {getSectionIcon(message.metadata?.category)}
                  </div>
                )}
                <div className="flex-1">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: message.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                  {message.metadata?.validated && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      ✓ Validé
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString('fr-CH', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 animate-pulse" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Actions rapides */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex flex-wrap gap-2 mb-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction('guide')}
          >
            📋 Guide complet
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction('calculate')}
          >
            🧮 Calculer
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction('optimize')}
          >
            💡 Optimiser
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction('documents')}
          >
            📄 Documents
          </Button>
        </div>

        {/* Zone de saisie */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question fiscale..."
              disabled={isLoading}
              className="pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={startVoiceRecognition}
              disabled={isListening}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-600 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button 
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}