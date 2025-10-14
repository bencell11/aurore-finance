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
  Loader2,
  Receipt,
  Percent,
  Info
} from 'lucide-react';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import { MobileFriendlyTooltip } from '@/components/ui/mobile-friendly-tooltip';
import { createClient } from '@/lib/supabase/client';
import { TaxCalculationService } from '@/lib/services/tax-calculation.service';
import type { TaxCalculationResult } from '@/lib/utils/swiss-tax-formulas';
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';
import {
  User,
  MapPin,
  Briefcase,
  Home as HomeIcon,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  X,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculationResult | null>(null);
  const [taxCalculating, setTaxCalculating] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showSensitive, setShowSensitive] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);
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
      console.log('📊 Chargement dashboard pour user:', user.id);

      // Charger le profil utilisateur depuis Supabase
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('👤 Profil chargé:', profile, profileError);

      // Charger le profil financier
      const { data: financial, error: financialError } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('💰 Profil financier chargé:', financial, financialError);

      // Charger les objectifs
      const { data: goals, error: goalsError } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('statut', 'actif');

      console.log('🎯 Objectifs chargés:', goals, goalsError);

      setProfileData({ profile, financial, goals: goals || [] });

      // Charger le profil Supabase enrichi
      const enrichedProfile = await UserProfileSupabaseService.getProfile();
      setUserProfile(enrichedProfile);
      console.log('📋 Profil enrichi chargé:', enrichedProfile);

      // Calculer les impôts si on a les données nécessaires
      if (profile && financial) {
        calculateTaxes(profile, financial);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTaxes = async (profile: any, financial: any) => {
    if (!profile?.canton || !financial?.revenu_brut_annuel) {
      console.log('⚠️ Données insuffisantes pour calcul fiscal');
      return;
    }

    try {
      setTaxCalculating(true);
      console.log('💰 Dashboard - Calcul fiscal démarré:', {
        salaireBrut: financial.revenu_brut_annuel,
        canton: profile.canton,
        situation: profile.situation_familiale
      });

      const taxResult = TaxCalculationService.calculateTax({
        salaireBrut: financial.revenu_brut_annuel || 0,
        autresRevenus: financial.autres_revenus || 0,
        canton: profile.canton || 'VD',
        situationFamiliale: profile.situation_familiale || 'celibataire',
        nombreEnfants: profile.nombre_enfants || 0,
        fortuneBrute: financial.patrimoine_total || 0,
        dettes: financial.dettes_totales || 0,
        deductions: {
          pilier3a: financial.pilier_3a || 0,
          primes: financial.charges_assurances || 0,
          fraisPro: financial.frais_professionnels || 0,
          gardeEnfants: financial.frais_garde || 0,
          formation: financial.frais_formation || 0,
          dons: financial.dons || 0,
          interetsHypothecaires: financial.interets_hypoth || 0,
          pensionAlimentaire: financial.pension_alim || 0,
          fraisMedicaux: financial.frais_medicaux || 0,
          autres: 0,
        },
      });

      console.log('✅ Dashboard - Résultats fiscaux:', {
        revenuImposable: taxResult.revenuImposable,
        totalImpots: taxResult.impots.total,
        tauxEffectif: taxResult.taux.effectif
      });
      setTaxCalculation(taxResult);
    } catch (error) {
      console.error('❌ Dashboard - Erreur calcul fiscal:', error);
    } finally {
      setTaxCalculating(false);
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

  const calculateProfileCompletion = () => {
    if (!userProfile) return 0;
    const fields = [
      userProfile.nom,
      userProfile.prenom,
      userProfile.date_naissance,
      userProfile.revenu_annuel,
      userProfile.revenu_mensuel,
      userProfile.situation_familiale,
      userProfile.adresse,
      userProfile.npa,
      userProfile.ville,
      userProfile.canton,
      userProfile.statut_professionnel,
      userProfile.profession,
      userProfile.statut_logement,
    ];
    const filledCount = fields.filter((f) => f !== null && f !== undefined && f !== '').length;
    return Math.round((filledCount / fields.length) * 100);
  };

  const handleEditProfile = () => {
    setEditedProfile({ ...userProfile });
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedProfile({});
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updated = await UserProfileSupabaseService.updateProfile(editedProfile);
      if (updated) {
        setUserProfile(updated);
        setEditMode(false);
        setEditedProfile({});
        console.log('✅ Profil sauvegardé avec succès');
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde profil:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedProfile((prev: any) => ({
      ...prev,
      [field]: value,
    }));
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

          {/* Section Profil Utilisateur */}
          {userProfile && (
            <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader className="cursor-pointer" onClick={() => setProfileExpanded(!profileExpanded)}>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-600" />
                    Profil Utilisateur
                    <span className="text-sm font-normal text-gray-600">
                      ({calculateProfileCompletion()}% complété)
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {!editMode ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSensitive(!showSensitive);
                          }}
                          className="px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                        >
                          {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {showSensitive ? 'Masquer' : 'Afficher'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProfile();
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Modifier
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelEdit();
                          }}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm"
                          disabled={saving}
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveProfile();
                          }}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                          disabled={saving}
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                      </>
                    )}
                    {profileExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProfileCompletion()}%` }}
                  ></div>
                </div>
              </CardHeader>

              {profileExpanded && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Informations personnelles */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Informations personnelles</h4>
                      </div>
                      <div className="space-y-2">
                        <ProfileField
                          label="Prénom"
                          value={editMode ? editedProfile.prenom : userProfile.prenom}
                          filled={!!userProfile.prenom}
                          editMode={editMode}
                          fieldName="prenom"
                          onFieldChange={handleFieldChange}
                        />
                        <ProfileField
                          label="Nom"
                          value={editMode ? editedProfile.nom : userProfile.nom}
                          filled={!!userProfile.nom}
                          editMode={editMode}
                          fieldName="nom"
                          onFieldChange={handleFieldChange}
                        />
                        <ProfileField
                          label="Email"
                          value={editMode ? editedProfile.email : userProfile.email}
                          filled={!!userProfile.email}
                          editMode={editMode}
                          fieldName="email"
                          onFieldChange={handleFieldChange}
                          type="email"
                        />
                        <ProfileField
                          label="Date de naissance"
                          value={
                            editMode
                              ? editedProfile.date_naissance
                              : userProfile.date_naissance
                              ? new Date(userProfile.date_naissance).toLocaleDateString('fr-CH')
                              : null
                          }
                          filled={!!userProfile.date_naissance}
                          editMode={editMode}
                          fieldName="date_naissance"
                          onFieldChange={handleFieldChange}
                          type="date"
                        />
                        <ProfileField
                          label="Situation familiale"
                          value={editMode ? editedProfile.situation_familiale : userProfile.situation_familiale}
                          filled={!!userProfile.situation_familiale}
                          editMode={editMode}
                          fieldName="situation_familiale"
                          onFieldChange={handleFieldChange}
                          type="select-situation"
                        />
                        <ProfileField
                          label="Enfants"
                          value={editMode ? editedProfile.nombre_enfants?.toString() : userProfile.nombre_enfants?.toString()}
                          filled={userProfile.nombre_enfants !== null}
                          editMode={editMode}
                          fieldName="nombre_enfants"
                          onFieldChange={handleFieldChange}
                          type="number"
                        />
                      </div>
                    </div>

                    {/* Localisation & Professionnel */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">Localisation</h4>
                      </div>
                      <div className="space-y-2 mb-4">
                        <ProfileField label="Adresse" value={userProfile.adresse} filled={!!userProfile.adresse} />
                        <ProfileField
                          label="Ville"
                          value={userProfile.npa && userProfile.ville ? `${userProfile.npa} ${userProfile.ville}` : null}
                          filled={!!(userProfile.npa && userProfile.ville)}
                        />
                        <ProfileField label="Canton" value={userProfile.canton} filled={!!userProfile.canton} />
                      </div>
                      <div className="flex items-center gap-2 mb-2 mt-4 pt-3 border-t border-gray-200">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900 text-sm">Professionnel</h4>
                      </div>
                      <div className="space-y-2">
                        <ProfileField
                          label="Statut"
                          value={userProfile.statut_professionnel}
                          filled={!!userProfile.statut_professionnel}
                        />
                        <ProfileField
                          label="Profession"
                          value={userProfile.profession}
                          filled={!!userProfile.profession}
                        />
                        <ProfileField label="Employeur" value={userProfile.employeur} filled={!!userProfile.employeur} />
                      </div>
                    </div>

                    {/* Finances & Logement */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">Finances</h4>
                      </div>
                      <div className="space-y-2 mb-4">
                        <ProfileField
                          label="Revenu annuel"
                          value={
                            userProfile.revenu_annuel
                              ? formatCurrency(userProfile.revenu_annuel)
                              : null
                          }
                          filled={!!userProfile.revenu_annuel}
                          sensitive
                          showSensitive={showSensitive}
                        />
                        <ProfileField
                          label="Revenu mensuel"
                          value={
                            userProfile.revenu_mensuel
                              ? formatCurrency(userProfile.revenu_mensuel)
                              : null
                          }
                          filled={!!userProfile.revenu_mensuel}
                          sensitive
                          showSensitive={showSensitive}
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2 mt-4 pt-3 border-t border-gray-200">
                        <HomeIcon className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-900 text-sm">Logement</h4>
                      </div>
                      <div className="space-y-2">
                        <ProfileField
                          label="Statut"
                          value={userProfile.statut_logement}
                          filled={!!userProfile.statut_logement}
                        />
                        <ProfileField
                          label="Loyer mensuel"
                          value={
                            userProfile.loyer_mensuel
                              ? formatCurrency(userProfile.loyer_mensuel)
                              : null
                          }
                          filled={!!userProfile.loyer_mensuel}
                          sensitive
                          showSensitive={showSensitive}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <p className="text-sm text-gray-600">
                      💡 Ces informations sont extraites de Supabase et auto-remplissent les formulaires
                    </p>
                    <Button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = '/dashboard-data';
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      Voir tout le détail →
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Calcul fiscal */}
          {hasFinancialData && taxCalculation && (
            <TooltipProvider>
              <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    Impôts estimés 2025
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne gauche : Détails des impôts */}
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-gray-600">Impôt fédéral direct (IFD)</span>
                            <MobileFriendlyTooltip
                              content={
                                <>
                                  <p className="text-xs font-semibold mb-1">Formule IFD (Art. 36 LIFD)</p>
                                  <p className="text-xs">Barème progressif fédéral identique pour tous les cantons.</p>
                                  <p className="text-xs mt-1">Tranche: {taxCalculation.details.trancheFederale}</p>
                                </>
                              }
                            >
                              <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                                <Info className="w-5 h-5 md:w-3.5 md:h-3.5 text-blue-500 cursor-pointer" />
                              </button>
                            </MobileFriendlyTooltip>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(taxCalculation.impots.federal)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-gray-600">Impôt cantonal</span>
                            <MobileFriendlyTooltip
                              content={
                                <>
                                  <p className="text-xs font-semibold mb-1">Formule cantonale</p>
                                  <p className="text-xs">Impôt simple × Coefficient cantonal (100%)</p>
                                  <p className="text-xs mt-1">Barème: {taxCalculation.details.baremeApplique}</p>
                                </>
                              }
                            >
                              <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                                <Info className="w-5 h-5 md:w-3.5 md:h-3.5 text-blue-500 cursor-pointer" />
                              </button>
                            </MobileFriendlyTooltip>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(taxCalculation.impots.cantonal)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-gray-600">Impôt communal</span>
                            <MobileFriendlyTooltip
                              content={
                                <>
                                  <p className="text-xs font-semibold mb-1">Formule communale</p>
                                  <p className="text-xs">Impôt simple × Coefficient communal</p>
                                  <p className="text-xs mt-1">Coefficient: {taxCalculation.details.coefficientCommunal}%</p>
                                </>
                              }
                            >
                              <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                                <Info className="w-5 h-5 md:w-3.5 md:h-3.5 text-blue-500 cursor-pointer" />
                              </button>
                            </MobileFriendlyTooltip>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(taxCalculation.impots.communal)}
                          </span>
                        </div>
                        {taxCalculation.impots.fortune > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium text-gray-600">Impôt sur la fortune</span>
                              <MobileFriendlyTooltip
                                content={
                                  <>
                                    <p className="text-xs font-semibold mb-1">Impôt sur la fortune</p>
                                    <p className="text-xs">Taux en pour mille (‰) appliqué sur fortune nette</p>
                                    <p className="text-xs mt-1">Fortune imposable: {formatCurrency(taxCalculation.fortuneImposable)}</p>
                                  </>
                                }
                              >
                                <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                                  <Info className="w-5 h-5 md:w-3.5 md:h-3.5 text-blue-500 cursor-pointer" />
                                </button>
                              </MobileFriendlyTooltip>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(taxCalculation.impots.fortune)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <span className="text-base font-bold text-gray-900">Total impôts</span>
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(taxCalculation.impots.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                  {/* Colonne droite : Taux et informations */}
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Percent className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">Taux d'imposition</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-blue-50 rounded p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <p className="text-xs text-gray-600">Taux effectif</p>
                            <MobileFriendlyTooltip
                              content={
                                <>
                                  <p className="text-xs font-semibold mb-1">Taux effectif</p>
                                  <p className="text-xs">= (Total impôts / Revenu brut) × 100</p>
                                  <p className="text-xs mt-1">C'est le pourcentage réel d'impôt payé sur votre revenu total.</p>
                                </>
                              }
                            >
                              <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                                <Info className="w-5 h-5 md:w-3 md:h-3 text-blue-500 cursor-pointer" />
                              </button>
                            </MobileFriendlyTooltip>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            {taxCalculation.taux.effectif.toFixed(2)}%
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <p className="text-xs text-gray-600">Taux marginal</p>
                            <MobileFriendlyTooltip
                              content={
                                <>
                                  <p className="text-xs font-semibold mb-1">Taux marginal</p>
                                  <p className="text-xs">Taux appliqué sur le dernier franc gagné.</p>
                                  <p className="text-xs mt-1">Important pour évaluer l'impact fiscal d'une augmentation de salaire.</p>
                                </>
                              }
                            >
                              <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                                <Info className="w-5 h-5 md:w-3 md:h-3 text-purple-500 cursor-pointer" />
                              </button>
                            </MobileFriendlyTooltip>
                          </div>
                          <p className="text-2xl font-bold text-purple-600">
                            {taxCalculation.taux.marginal.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <p>• Revenu brut: {formatCurrency(taxCalculation.revenuBrut)}</p>
                          <MobileFriendlyTooltip
                            content={
                              <>
                                <p className="text-xs">Salaire brut + Autres revenus (avant déductions)</p>
                              </>
                            }
                          >
                            <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                              <Info className="w-5 h-5 md:w-3 md:h-3 text-gray-400 cursor-pointer" />
                            </button>
                          </MobileFriendlyTooltip>
                        </div>
                        <div className="flex items-center gap-1">
                          <p>• Revenu net: {formatCurrency(taxCalculation.revenuNet)}</p>
                          <MobileFriendlyTooltip
                            content={
                              <>
                                <p className="text-xs">= Revenu brut - Cotisations sociales (AVS/AC/LPP/LAA)</p>
                                <p className="text-xs mt-1">Cotisations: {formatCurrency(taxCalculation.cotisationsSociales)}</p>
                              </>
                            }
                          >
                            <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                              <Info className="w-5 h-5 md:w-3 md:h-3 text-gray-400 cursor-pointer" />
                            </button>
                          </MobileFriendlyTooltip>
                        </div>
                        <div className="flex items-center gap-1">
                          <p>• Revenu imposable: {formatCurrency(taxCalculation.revenuImposable)}</p>
                          <MobileFriendlyTooltip
                            content={
                              <>
                                <p className="text-xs">= Revenu net - Déductions fiscales</p>
                                <p className="text-xs mt-1">Déductions totales: {formatCurrency(taxCalculation.totalDeductions)}</p>
                              </>
                            }
                          >
                            <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                              <Info className="w-5 h-5 md:w-3 md:h-3 text-gray-400 cursor-pointer" />
                            </button>
                          </MobileFriendlyTooltip>
                        </div>
                        <p className="text-blue-600 font-medium mt-2">
                          Canton: {taxCalculation.details.baremeApplique}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.location.href = '/assistant-fiscal'}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Optimiser mes impôts
                    </Button>
                  </div>
                </div>

                {/* Breakdown des déductions */}
                <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">📊 Détail des déductions</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Cotisations sociales:</span>
                        <MobileFriendlyTooltip
                          content={
                            <>
                              <p className="text-xs font-semibold mb-1">Cotisations obligatoires</p>
                              <p className="text-xs">AVS/AI/APG (5.3%) + AC (1.1%) + LPP (7-18%) + LAA (~1.5%)</p>
                              <p className="text-xs mt-1 text-amber-600">⚠️ Non déductibles du revenu imposable en Suisse</p>
                            </>
                          }
                        >
                          <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                            <Info className="w-5 h-5 md:w-3 md:h-3 text-gray-400 cursor-pointer" />
                          </button>
                        </MobileFriendlyTooltip>
                      </div>
                      <span className="font-medium">{formatCurrency(taxCalculation.cotisationsSociales)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Total déductions:</span>
                        <MobileFriendlyTooltip
                          content={
                            <>
                              <p className="text-xs font-semibold mb-1">Déductions fiscales</p>
                              <p className="text-xs">Déduction personnelle + 3e pilier + Primes assurance + Frais pro + etc.</p>
                              <p className="text-xs mt-1 text-green-600">✓ Déductibles du revenu imposable</p>
                            </>
                          }
                        >
                          <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                            <Info className="w-5 h-5 md:w-3 md:h-3 text-gray-400 cursor-pointer" />
                          </button>
                        </MobileFriendlyTooltip>
                      </div>
                      <span className="font-medium">{formatCurrency(taxCalculation.totalDeductions)}</span>
                    </div>
                    {taxCalculation.fortuneImposable > 0 && (
                      <>
                        <div className="flex justify-between items-center col-span-2 pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Fortune imposable:</span>
                            <MobileFriendlyTooltip
                              content={
                                <>
                                  <p className="text-xs font-semibold mb-1">Fortune nette</p>
                                  <p className="text-xs">= Fortune brute - Dettes - Déduction personnelle</p>
                                  <p className="text-xs mt-1">Taxée en pour mille (‰) selon barème cantonal</p>
                                </>
                              }
                            >
                              <button type="button" className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-0 md:min-h-0">
                                <Info className="w-5 h-5 md:w-3 md:h-3 text-gray-400 cursor-pointer" />
                              </button>
                            </MobileFriendlyTooltip>
                          </div>
                          <span className="font-medium">{formatCurrency(taxCalculation.fortuneImposable)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  ℹ️ Estimation basée sur les barèmes fiscaux 2025. Pour un calcul précis, consultez l'assistant fiscal.
                </p>
              </CardContent>
            </Card>
          </TooltipProvider>
          )}

          {hasFinancialData && taxCalculating && (
            <Card className="mb-6 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 text-blue-600">
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Calcul de vos impôts en cours...</span>
                </div>
              </CardContent>
            </Card>
          )}

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
                  <li>✅ Calcul fiscal avec formules officielles</li>
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

// Composant helper pour afficher/éditer un champ du profil
function ProfileField({
  label,
  value,
  filled,
  sensitive = false,
  showSensitive = true,
  editMode = false,
  fieldName,
  onFieldChange,
  type = 'text',
}: {
  label: string;
  value: string | null | undefined;
  filled: boolean;
  sensitive?: boolean;
  showSensitive?: boolean;
  editMode?: boolean;
  fieldName?: string;
  onFieldChange?: (field: string, value: any) => void;
  type?: string;
}) {
  const displayValue = sensitive && !showSensitive ? '••••••••' : value || 'Non renseigné';
  const textColor = filled ? 'text-gray-900 font-medium' : 'text-gray-400 italic';
  const bgColor = filled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200';

  if (editMode && fieldName && onFieldChange) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 font-medium">{label}</label>
        {type === 'select-situation' ? (
          <select
            value={value || ''}
            onChange={(e) => onFieldChange(fieldName, e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            <option value="celibataire">Célibataire</option>
            <option value="marie">Marié(e)</option>
            <option value="divorce">Divorcé(e)</option>
            <option value="veuf">Veuf(ve)</option>
            <option value="concubinage">Concubinage</option>
          </select>
        ) : type === 'select-statut-pro' ? (
          <select
            value={value || ''}
            onChange={(e) => onFieldChange(fieldName, e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            <option value="salarie">Salarié</option>
            <option value="independant">Indépendant</option>
            <option value="retraite">Retraité</option>
            <option value="etudiant">Étudiant</option>
            <option value="sans_emploi">Sans emploi</option>
          </select>
        ) : type === 'select-statut-logement' ? (
          <select
            value={value || ''}
            onChange={(e) => onFieldChange(fieldName, e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            <option value="locataire">Locataire</option>
            <option value="proprietaire">Propriétaire</option>
            <option value="heberge">Hébergé</option>
          </select>
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onFieldChange(fieldName, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={label}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg border ${bgColor}`}>
      <span className="text-xs text-gray-600 font-medium">{label}</span>
      <div className="flex items-center gap-1.5">
        {filled && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
        <span className={`text-xs ${textColor}`}>{displayValue}</span>
      </div>
    </div>
  );
}
