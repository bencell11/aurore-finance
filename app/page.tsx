"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  CheckCircle2,
  Mail,
  Brain,
  BarChart3,
  Users,
  Globe,
  Smartphone,
  Star,
  Crown,
  Eye,
  ArrowRight,
  Shield,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { AdminNavLink } from "@/components/navigation/AdminNavLink";
import { SimpleLanguageSelector } from "@/components/SimpleLanguageSelector";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAccessMessage, setShowAccessMessage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Vérifier si l'utilisateur vient d'une redirection d'accès restreint
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('access') === 'restricted') {
      setShowAccessMessage(true);
      // Supprimer le paramètre de l'URL
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => setShowAccessMessage(false), 8000);
    }
  }, []);

  // Charger le compteur initial
  useEffect(() => {
    const fetchWaitlistCount = async () => {
      try {
        // Essayer d'abord l'API Supabase
        const response = await fetch('/api/waitlist/supabase');
        if (response.ok) {
          const data = await response.json();
          setWaitlistCount(data.waitlistCount);
        } else {
          // Fallback sur l'ancienne API
          const fallbackResponse = await fetch('/api/waitlist');
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            setWaitlistCount(data.waitlistCount);
          }
        }
      } catch (error) {
        console.error('Erreur chargement compteur:', error);
      }
    };
    
    fetchWaitlistCount();
  }, []);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Essayer d'abord avec Supabase (qui enverra l'email automatiquement)
      const response = await fetch('/api/waitlist/supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribed(true);
        setWaitlistCount(data.waitlistCount);
        setEmail("");
        
        // Reset après 5 secondes
        setTimeout(() => {
          setSubscribed(false);
        }, 5000);
      } else {
        // Si erreur avec Supabase, essayer l'ancienne méthode
        const fallbackResponse = await fetch('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackResponse.ok) {
          setSubscribed(true);
          setWaitlistCount(fallbackData.waitlistCount);
          setEmail("");
          
          setTimeout(() => {
            setSubscribed(false);
          }, 5000);
        } else {
          setError(fallbackData.error || data.error || 'Une erreur est survenue');
        }
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* Message d'accès restreint */}
      {showAccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-orange-100 border border-orange-300 text-orange-800 px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Accès restreint - Rejoignez la liste d'attente pour l'accès prioritaire !</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Calculator className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">
              Aurore Finances
            </span>
          </div>
          
          {/* Language Selector et Admin Button */}
          <div className="flex items-center gap-2">
            <SimpleLanguageSelector />
            <a
              href="/admin/login-simple"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </a>
          </div>
          
          {/* Desktop Navigation - Caché sur mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/mentions-legales"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="/confidentialite"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Confidentialité
            </a>
            <a
              href="/contact"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-3">
              <a
                href="/mentions-legales"
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mentions légales
              </a>
              <a
                href="/confidentialite"
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Confidentialité
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aurore Finances
            </span>
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Rejoignez la liste d'attente et soyez parmi les premiers à tester
            Aurore Finances en version bêta.
          </h2>

          {/* Formulaire d'inscription */}
          <div className="max-w-lg mx-auto mb-8">
            <form onSubmit={handleJoinWaitlist} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  disabled={subscribed || isSubmitting}
                  className="h-12 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
                >
                  {subscribed ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Inscrit !
                    </>
                  ) : isSubmitting ? (
                    "Inscription..."
                  ) : (
                    "Rejoindre la liste d'attente"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {error && (
            <div className="max-w-lg mx-auto mb-4">
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </p>
            </div>
          )}

          {subscribed && (
            <div className="max-w-lg mx-auto mb-4">
              <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
                🎉 Parfait ! Un email de confirmation vous a été envoyé.
              </p>
            </div>
          )}

          <p className="text-gray-500 text-sm">
            Déjà plus de{" "}
            <span className="font-semibold text-blue-600">
              {waitlistCount} personnes
            </span>{" "}
            inscrites. Rejoignez le mouvement.
          </p>
        </div>
      </section>

      {/* Section Problème / Promesse */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              La gestion de vos finances n'a jamais été aussi simple.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nous construisons une application qui vous aide à piloter vos
              finances de manière claire, personnalisée et intelligente. Un
              tableau de bord, une boussole, et des conseils concrets pour
              atteindre vos objectifs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow duration-300 text-center">
              <CardHeader className="pb-4">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Visualisez l'ensemble de vos comptes en un seul endroit
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow duration-300 text-center">
              <CardHeader className="pb-4">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Recevez des recommandations personnalisées grâce à l'IA
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-shadow duration-300 text-center">
              <CardHeader className="pb-4">
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Rejoignez une communauté ambitieuse qui partage vos valeurs
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Mockup / Visuel Concept */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Un aperçu de ce qui vous attend : une expérience simple, claire
                et puissante.
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Interface intuitive, données en temps réel, et intelligence
                artificielle pour vous accompagner dans chaque décision
                financière. Découvrez le futur de la gestion patrimoniale
                personnelle.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Interface moderne</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">IA intégrée</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Sécurisé</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* MacBook Pro Frame */}
              <div className="bg-gray-800 rounded-t-2xl p-4 shadow-2xl">
                {/* MacBook Screen Bezel */}
                <div className="bg-black rounded-lg p-1">
                  {/* Screen Content */}
                  <div className="bg-white rounded-lg overflow-hidden min-h-96">
                    {/* Browser Tab Bar */}
                    <div className="bg-gray-100 p-3 border-b">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="bg-white rounded px-3 py-1 text-xs text-gray-600 ml-4">
                          aurorefinances.com/assistant-fiscal
                        </div>
                      </div>
                    </div>

                    {/* App Interface */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900">Assistant Fiscal IA</h3>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-6 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs text-green-700 font-medium">75%</span>
                          </div>
                        </div>
                      </div>

                      {/* Cards Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Calculator className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-900">Revenus</span>
                          </div>
                          <div className="text-lg font-bold text-blue-900">CHF 95,000</div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-900">Impôts</span>
                          </div>
                          <div className="text-lg font-bold text-purple-900">CHF 12,450</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-900">Économies</span>
                          </div>
                          <div className="text-lg font-bold text-green-900">CHF 3,200</div>
                        </div>
                      </div>

                      {/* Chat Interface Preview */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">Assistant IA</span>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-blue-100 text-blue-900 rounded-lg p-2 text-xs max-w-xs">
                            Basé sur votre profil, vous pourriez économiser CHF 3,200 en optimisant vos déductions fiscales.
                          </div>
                          <div className="flex gap-2">
                            <button className="text-xs bg-white border rounded px-2 py-1 text-gray-600">Voir les détails</button>
                            <button className="text-xs bg-blue-600 text-white rounded px-2 py-1">Appliquer</button>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bars */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Profil fiscal complété</span>
                          <span>75%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MacBook Base */}
              <div className="bg-gray-700 h-4 rounded-b-2xl"></div>

              {/* Floating Badges */}
              <div className="absolute -top-4 -right-4 h-12 w-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-4 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div className="absolute top-1/2 -right-8 h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Smartphone className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Social Proof / Exclusivité */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 px-4 py-2">
            <Crown className="h-4 w-4 mr-2" />
            Accès Anticipé Exclusif
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Soyez pionnier.
          </h2>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Les places pour la version bêta sont limitées. En vous inscrivant
            aujourd'hui, vous aurez accès en avant-première à la plateforme et
            pourrez contribuer à son évolution.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Accès prioritaire
              </h3>
              <p className="text-gray-600 text-sm">
                Découvrez les fonctionnalités avant tout le monde
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Communauté exclusive
              </h3>
              <p className="text-gray-600 text-sm">
                Rejoignez un groupe de bêta-testeurs privilégiés
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Impact direct
              </h3>
              <p className="text-gray-600 text-sm">
                Vos retours façonnent l'avenir du produit
              </p>
            </div>
          </div>

          <Button
            onClick={() => {
              const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
              emailInput?.focus();
            }}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
          >
            Rejoindre la liste d'attente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Aurore Finances</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-400">
              <a
                href="/mentions-legales"
                className="hover:text-white transition-colors"
              >
                Mentions légales
              </a>
              <a href="/confidentialite" className="hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="/contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Aurore Finances. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
