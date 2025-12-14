'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Loader2,
  LayoutDashboard,
  LineChart,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Circle,
  Sun,
  Moon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HouseFinanceDashboard3D } from '@/components/dashboard/HouseFinanceDashboard3D';
import { MaisonDesFinancesData } from '@/lib/types/maison-finances';
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';
import { MaisonFinancesService } from '@/lib/services/maison-finances.service';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Import des formulaires
import SanteForm from '@/components/dashboard/forms/SanteForm';
import RevenuForm from '@/components/dashboard/forms/RevenuForm';
import BiensForm from '@/components/dashboard/forms/BiensForm';
import VieillesseForm from '@/components/dashboard/forms/VieillesseForm';
import FortuneForm from '@/components/dashboard/forms/FortuneForm';
import ImmobilierForm from '@/components/dashboard/forms/ImmobilierForm';
import BudgetForm from '@/components/dashboard/forms/BudgetForm';
import FiscaliteForm from '@/components/dashboard/forms/FiscaliteForm';
import JuridiqueForm from '@/components/dashboard/forms/JuridiqueForm';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e'];

export default function DashboardMaisonPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [maisonData, setMaisonData] = useState<MaisonDesFinancesData | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const supabase = createClient();

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('aurore-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Apply dark class to document root for shadcn/ui components
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save theme preference to localStorage
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('aurore-theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    if (authLoading) return;
    if (user?.id) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      // ✨ UNE SEULE REQUÊTE au lieu de 9 grâce à la fonction RPC PostgreSQL
      const maison = await MaisonFinancesService.loadComplete(user.id);
      setMaisonData(maison);

      const enrichedProfile = await UserProfileSupabaseService.getProfile();
      setUserProfile(enrichedProfile);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSave = async (section: string, data: any) => {
    if (!user?.id) return;
    try {
      console.log(`[Dashboard] Saving section: ${section}`, data);

      // Sauvegarder la section via le service centralisé
      await MaisonFinancesService.saveSection(user.id, section, data);

      console.log('[Dashboard] Section saved successfully, reloading data...');

      // Recharger toutes les données
      await loadDashboardData();

      console.log('[Dashboard] Data reloaded, new state:', maisonData);

      // Fermer le formulaire et afficher un message de succès
      setCurrentSection(null);
      alert(`✅ Section "${section}" sauvegardée avec succès !`);
    } catch (error) {
      console.error('Error saving section:', error);
      alert(`❌ Erreur lors de la sauvegarde: ${error}`);
      throw error;
    }
  };

  const renderSectionForm = () => {
    if (!currentSection) return null;
    const sectionData = maisonData?.[currentSection as keyof MaisonDesFinancesData];
    const formProps = {
      data: sectionData || {},
      onSave: (data: any) => handleSectionSave(currentSection, data),
      onNext: () => {
        const sections = ['sante', 'revenu', 'biens', 'vieillesse', 'fortune', 'immobilier', 'budget', 'fiscalite', 'juridique'];
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex < sections.length - 1) {
          setCurrentSection(sections[currentIndex + 1]);
        } else {
          setCurrentSection(null);
        }
      },
      onPrevious: () => {
        const sections = ['sante', 'revenu', 'biens', 'vieillesse', 'fortune', 'immobilier', 'budget', 'fiscalite', 'juridique'];
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex > 0) {
          setCurrentSection(sections[currentIndex - 1]);
        } else {
          setCurrentSection(null);
        }
      },
      isDarkMode
    };

    switch (currentSection) {
      case 'sante': return <SanteForm {...formProps} />;
      case 'revenu': return <RevenuForm {...formProps} />;
      case 'biens': return <BiensForm {...formProps} />;
      case 'vieillesse': return <VieillesseForm {...formProps} />;
      case 'fortune': return <FortuneForm {...formProps} />;
      case 'immobilier': return <ImmobilierForm {...formProps} />;
      case 'budget': return <BudgetForm {...formProps} />;
      case 'fiscalite': return <FiscaliteForm {...formProps} />;
      case 'juridique': return <JuridiqueForm {...formProps} />;
      default: return null;
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

  const getCompletedSectionsCount = () => {
    if (!maisonData?.completion_status) return 0;
    return Object.values(maisonData.completion_status).filter(status => status === 'termine').length;
  };

  // Mock data for charts
  const scoreEvolutionData = [
    { month: 'Jan', score: 45 },
    { month: 'Fév', score: 52 },
    { month: 'Mar', score: 58 },
    { month: 'Avr', score: 63 },
    { month: 'Mai', score: 68 },
    { month: 'Juin', score: maisonData?.score_global || 70 },
  ];

  const categoryScores = [
    { name: 'Sécurité', value: 75, color: '#22c55e' },
    { name: 'Planification', value: 68, color: '#3b82f6' },
    { name: 'Investissement', value: 55, color: '#8b5cf6' },
    { name: 'Protection', value: 62, color: '#f59e0b' },
  ];

  const recentActivities = [
    { section: 'Revenu', action: 'Mis à jour', time: '2h', status: 'success' },
    { section: 'Fiscalité', action: 'Calculé', time: '5h', status: 'success' },
    { section: 'Immobilier', action: 'En attente', time: '1j', status: 'warning' },
  ];

  if (loading || authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0a0a0b]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className={`font-light ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (currentSection) {
    return (
      <ProtectedRoute>
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0b]' : 'bg-gray-50'}`}>
          <header className={`border-b ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentSection(null)}
                    className={isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour
                  </Button>
                  <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`} />
                  <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className={isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </Button>
                  <UserMenu />
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className={`rounded-lg shadow-sm p-6 border ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
              {renderSectionForm()}
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#0a0a0b]' : 'bg-gray-50'}`}>
        {/* Sidebar */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? 64 : 240 }}
          className={`border-r flex flex-col ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}
        >
          <div className="p-4 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg" />
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Aurore</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-1 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" active collapsed={sidebarCollapsed} isDarkMode={isDarkMode} />
            <NavItem icon={LineChart} label="Analytics" collapsed={sidebarCollapsed} onClick={() => window.location.href = '/simulateurs'} isDarkMode={isDarkMode} />
            <NavItem icon={FileText} label="Documents" collapsed={sidebarCollapsed} onClick={() => window.location.href = '/documents'} isDarkMode={isDarkMode} />
            <NavItem icon={Settings} label="Paramètres" collapsed={sidebarCollapsed} onClick={() => window.location.href = '/dashboard-data'} isDarkMode={isDarkMode} />
          </nav>

          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <UserMenu />
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className={`border-b px-8 py-6 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-2xl font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {userProfile?.prenom ? `Bienvenue, ${userProfile.prenom}` : 'Aperçu de votre santé financière'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                  onClick={() => window.location.href = '/assistant-fiscal'}
                >
                  Assistant IA
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-8 space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                label="Score Global"
                value={maisonData?.score_global || 0}
                unit="/100"
                trend={+5}
                trendLabel="vs mois dernier"
                isDarkMode={isDarkMode}
              />
              <MetricCard
                label="Sections Complétées"
                value={getCompletedSectionsCount()}
                unit="/9"
                trend={0}
                isDarkMode={isDarkMode}
              />
              <MetricCard
                label="Revenu Mensuel"
                value={userProfile?.revenu_mensuel ? formatCurrency(userProfile.revenu_mensuel) : 'N/A'}
                isCurrency
                isDarkMode={isDarkMode}
              />
              <MetricCard
                label="Profil"
                value={Math.round((getCompletedSectionsCount() / 9) * 100)}
                unit="%"
                trend={+12}
                trendLabel="progression"
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Score Evolution */}
              <Card className={`lg:col-span-2 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Évolution du Score</CardTitle>
                  <CardDescription className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Progression sur les 6 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={scoreEvolutionData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#222' : '#e5e7eb'} />
                      <XAxis dataKey="month" stroke={isDarkMode ? '#666' : '#9ca3af'} style={{ fontSize: '12px' }} />
                      <YAxis stroke={isDarkMode ? '#666' : '#9ca3af'} style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? '#1a1a1c' : '#ffffff',
                          border: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}`,
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: isDarkMode ? '#fff' : '#111827' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <CardTitle className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Répartition</CardTitle>
                  <CardDescription className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Scores par catégorie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryScores.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{cat.name}</span>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cat.value}%</span>
                        </div>
                        <Progress value={cat.value} className="h-1.5" style={{ backgroundColor: isDarkMode ? '#222' : '#e5e7eb' }} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* House 3D */}
              <Card className={`lg:col-span-2 ${isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Maison des Finances</CardTitle>
                  <CardDescription className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Cliquez sur une section pour la compléter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HouseFinanceDashboard3D
                    data={maisonData || undefined}
                    onSectionClick={(section) => setCurrentSection(section)}
                    isDarkMode={isDarkMode}
                  />
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <CardTitle className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Activité Récente</CardTitle>
                  <CardDescription className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Dernières modifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                        }`}>
                          {activity.status === 'success' ? (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activity.section}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{activity.action}</p>
                        </div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Actions Rapides</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start text-sm ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => window.location.href = '/assistant-fiscal'}
                      >
                        Assistant Fiscal
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start text-sm ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => window.location.href = '/simulateurs'}
                      >
                        Simulateurs
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start text-sm ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => window.location.href = '/documents'}
                      >
                        Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sections Grid */}
            <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sections Financières</CardTitle>
                <CardDescription className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complétez chaque section pour améliorer votre score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { id: 'sante', label: 'Santé', color: '#22c55e' },
                    { id: 'revenu', label: 'Revenu', color: '#22c55e' },
                    { id: 'biens', label: 'Biens', color: '#22c55e' },
                    { id: 'vieillesse', label: 'Vieillesse', color: '#3b82f6' },
                    { id: 'fortune', label: 'Fortune', color: '#3b82f6' },
                    { id: 'immobilier', label: 'Immobilier', color: '#8b5cf6' },
                    { id: 'budget', label: 'Budget', color: '#8b5cf6' },
                    { id: 'fiscalite', label: 'Fiscalité', color: '#f59e0b' },
                    { id: 'juridique', label: 'Juridique', color: '#f59e0b' },
                  ].map((section) => {
                    const status = maisonData?.completion_status?.[section.id as keyof typeof maisonData.completion_status];
                    const isCompleted = status === 'termine';

                    return (
                      <button
                        key={section.id}
                        onClick={() => setCurrentSection(section.id)}
                        className={`p-4 rounded-lg border transition-all text-left group ${
                          isDarkMode
                            ? 'border-gray-800 hover:border-gray-700 bg-[#1a1a1c] hover:bg-[#222224]'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: isCompleted ? section.color : (isDarkMode ? '#444' : '#d1d5db') }}
                          />
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                          )}
                        </div>
                        <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{section.label}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          {isCompleted ? 'Terminé' : 'À compléter'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function NavItem({ icon: Icon, label, active = false, collapsed = false, onClick, isDarkMode = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        active
          ? 'bg-blue-500/10 text-blue-500'
          : isDarkMode
            ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}

function MetricCard({ label, value, unit, trend, trendLabel, isCurrency = false, isDarkMode = false }: any) {
  const displayValue = isCurrency ? value : typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <Card className={isDarkMode ? 'bg-[#111113] border-gray-800' : 'bg-white border-gray-200'}>
      <CardContent className="pt-6">
        <div className="space-y-1">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{displayValue}</h3>
            {unit && <span className={`text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{unit}</span>}
          </div>
          {trend !== undefined && trend !== 0 && (
            <div className="flex items-center gap-1 text-sm">
              {trend > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">+{trend}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">{trend}%</span>
                </>
              )}
              {trendLabel && <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{trendLabel}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
