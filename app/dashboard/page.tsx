'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  DollarSign,
  Target,
  Bell,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;
    if (user?.id) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadDashboard = async () => {
    if (!user?.id) return;

    try {
      // Charger le profil utilisateur depuis Supabase
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Charger le profil financier
      const { data: financial } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Charger les objectifs
      const { data: goals } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('statut', 'actif');

      setProfileData({ profile, financial, goals: goals || [] });
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  const hasFinancialData = profileData?.financial;
  const patrimoineNet = hasFinancialData
    ? (profileData.financial.revenu_brut_annuel || 0) + (profileData.financial.autres_revenus || 0) -
      ((profileData.financial.charges_logement || 0) + (profileData.financial.charges_assurances || 0) + (profileData.financial.autres_charges || 0))
    : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Tableau de bord
                </h1>
                <p className="text-lg text-gray-600">
                  Bienvenue {user?.prenom} {user?.nom}
                </p>
              </div>
              <UserMenu />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 mb-16">
          {/* Message de migration */}
          {!hasFinancialData && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <TrendingUp className="w-12 h-12 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      ✨ Nouveau système sécurisé Supabase
                    </h3>
                    <p className="text-blue-700 mb-3">
                      Ton compte a été migré vers notre nouveau système sécurisé avec chiffrement et conformité RGPD.
                      Pour profiter pleinement du dashboard, complète ton onboarding.
                    </p>
                    <Button
                      onClick={() => window.location.href = '/onboarding'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Compléter mon profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* KPIs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Patrimoine net</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {hasFinancialData ? formatCurrency(patrimoineNet) : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Objectifs en cours</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {profileData?.goals?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenu mensuel</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {hasFinancialData ? formatCurrency((profileData.financial.revenu_brut_annuel || 0) / 12) : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Bell className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section informative */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Prochainement disponible</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>✅ Système d'authentification sécurisé (Supabase)</li>
                  <li>✅ Chiffrement des données sensibles</li>
                  <li>✅ Conformité RGPD/LPD Suisse</li>
                  <li>🔄 Analyse détaillée de ton patrimoine</li>
                  <li>🔄 Recommandations personnalisées</li>
                  <li>🔄 Suivi des objectifs financiers</li>
                  <li>🔄 Assistant IA avec accès à tes données</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => window.location.href = '/onboarding'}
                  className="w-full justify-start"
                  variant="outline"
                >
                  📝 Compléter mon profil financier
                </Button>
                <Button
                  onClick={() => window.location.href = '/objectifs'}
                  className="w-full justify-start"
                  variant="outline"
                >
                  🎯 Créer un objectif financier
                </Button>
                <Button
                  onClick={() => window.location.href = '/simulateurs'}
                  className="w-full justify-start"
                  variant="outline"
                >
                  🧮 Utiliser les simulateurs
                </Button>
                <Button
                  onClick={() => window.location.href = '/assistant-fiscal'}
                  className="w-full justify-start"
                  variant="outline"
                >
                  💬 Parler à Aurore (IA)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
