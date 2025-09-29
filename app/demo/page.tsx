import ChatInterface from '@/components/ai-coach/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Shield, Zap } from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/register">S'inscrire</Link>
            </Button>
          </div>
        </div>

        {/* Demo Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Démo interactive
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez votre Coach IA Financier
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Testez notre intelligence artificielle spécialisée dans le système financier suisse. 
            Posez vos questions et obtenez des conseils personnalisés en temps réel.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">IA Conversationnelle</CardTitle>
              <CardDescription>
                Dialogue naturel avec une IA qui comprend vos besoins financiers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Expertise Suisse</CardTitle>
              <CardDescription>
                Conseils basés sur la fiscalité et les lois financières suisses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Actions Intelligentes</CardTitle>
              <CardDescription>
                Suggestions d'actions concrètes et accès direct aux simulateurs
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Chat Demo */}
        <div className="mb-12">
          <ChatInterface />
        </div>

        {/* Sample Questions */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Exemples de questions à poser
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">💰 Fiscalité & Impôts</h3>
              <ul className="space-y-2 text-gray-600">
                <li>"Comment réduire mes impôts en 2024 ?"</li>
                <li>"Quelles déductions puis-je appliquer dans le canton de Genève ?"</li>
                <li>"Vaut-il mieux optimiser mon 3e pilier maintenant ?"</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🏠 Immobilier</h3>
              <ul className="space-y-2 text-gray-600">
                <li>"Puis-je acheter un appartement à 800'000 CHF ?"</li>
                <li>"Combien de fonds propres me faut-il ?"</li>
                <li>"Quel est le meilleur moment pour acheter ?"</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">📈 Investissement</h3>
              <ul className="space-y-2 text-gray-600">
                <li>"Comment diversifier mon portefeuille ?"</li>
                <li>"Dois-je investir dans des ETF ou actions ?"</li>
                <li>"Quel est mon profil de risque optimal ?"</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🎯 Planification</h3>
              <ul className="space-y-2 text-gray-600">
                <li>"Comment planifier ma retraite à 55 ans ?"</li>
                <li>"Combien épargner pour mes enfants ?"</li>
                <li>"Quels objectifs financiers me fixer ?"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à optimiser vos finances ?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Créez votre compte pour accéder à votre profil personnalisé, 
            aux simulateurs complets et aux recommandations sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4" asChild>
              <Link href="/register">
                Créer mon compte gratuit
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/login">
                J'ai déjà un compte
              </Link>
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">
            Gratuit pendant 30 jours • Sans engagement • Données sécurisées
          </p>
        </div>
      </div>
    </div>
  );
}