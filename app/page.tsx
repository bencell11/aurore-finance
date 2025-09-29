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
} from "lucide-react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(267);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Charger le compteur initial
  useEffect(() => {
    const fetchWaitlistCount = async () => {
      try {
        const response = await fetch('/api/waitlist');
        if (response.ok) {
          const data = await response.json();
          setWaitlistCount(data.waitlistCount);
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
      const response = await fetch('/api/waitlist', {
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
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Aurore Finance
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#mentions"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="#privacy"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Confidentialité
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Votre nouveau conseiller financier
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              alimenté par l'IA
            </span>
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Rejoignez la liste d'attente et soyez parmi les premiers à tester
            Aurore Finance en version bêta.
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
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 min-h-96">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      Tableau de bord
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-blue-50 rounded-lg"></div>
                      <div className="h-20 bg-purple-50 rounded-lg"></div>
                    </div>
                    <div className="h-6 bg-gray-100 rounded-full w-3/4"></div>
                    <div className="h-6 bg-gray-100 rounded-full w-1/2"></div>
                    <div className="h-32 bg-gradient-to-t from-blue-50 to-purple-50 rounded-lg"></div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 h-16 w-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
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
              <span className="text-xl font-bold">Aurore Finance</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-400">
              <a
                href="#mentions"
                className="hover:text-white transition-colors"
              >
                Mentions légales
              </a>
              <a href="#privacy" className="hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Aurore Finance. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
