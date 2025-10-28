'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  DollarSign,
  Target,
  Bell,
  Loader2,
  Plus,
  List,
  Settings
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';
import TaxSimulator2025 from '@/components/TaxSimulator2025';
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

      // Les impôts sont maintenant calculés par le composant TaxSimulator2025
    } catch (error) {
      console.error('❌ Erreur lors du chargement du dashboard:', error);
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

            <Card className="relative group hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Objectifs en cours</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {profileData?.goals?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={() => window.location.href = '/objectifs?action=create'}
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Ajouter
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/objectifs'}
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs"
                    >
                      <List className="w-3 h-3 mr-1" />
                      Voir
                    </Button>
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

            <Card className="relative group hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Notifications</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={() => window.location.href = '/notifications'}
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-xs"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Gérer
                    </Button>
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
                          rawValue={editMode ? editedProfile.date_naissance : userProfile.date_naissance}
                          filled={!!userProfile.date_naissance}
                          editMode={editMode}
                          fieldName="date_naissance"
                          onFieldChange={handleFieldChange}
                          type="date"
                        />
                        <ProfileField
                          label="Carte d'identité (recto)"
                          value={userProfile.carte_identite_recto_url ? 'Image chargée' : null}
                          filled={!!userProfile.carte_identite_recto_url}
                          editMode={editMode}
                          fieldName="carte_identite_recto_url"
                          onFieldChange={handleFieldChange}
                          type="file-image"
                        />
                        <ProfileField
                          label="Carte d'identité (verso)"
                          value={userProfile.carte_identite_verso_url ? 'Image chargée' : null}
                          filled={!!userProfile.carte_identite_verso_url}
                          editMode={editMode}
                          fieldName="carte_identite_verso_url"
                          onFieldChange={handleFieldChange}
                          type="file-image"
                        />
                        <ProfileField
                          label="Genre"
                          value={editMode ? editedProfile.genre : userProfile.genre}
                          filled={!!userProfile.genre}
                          editMode={editMode}
                          fieldName="genre"
                          onFieldChange={handleFieldChange}
                          type="select-genre"
                        />
                        <ProfileField
                          label="Nationalité"
                          value={editMode ? editedProfile.nationalite : userProfile.nationalite}
                          filled={!!userProfile.nationalite}
                          editMode={editMode}
                          fieldName="nationalite"
                          onFieldChange={handleFieldChange}
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

                    {/* Localisation & Contact */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">Localisation & Contact</h4>
                      </div>
                      <div className="space-y-2 mb-4">
                        <ProfileField
                          label="Adresse"
                          value={editMode ? editedProfile.adresse : userProfile.adresse}
                          filled={!!userProfile.adresse}
                          editMode={editMode}
                          fieldName="adresse"
                          onFieldChange={handleFieldChange}
                        />
                        <ProfileField
                          label="NPA"
                          value={editMode ? editedProfile.npa : userProfile.npa}
                          filled={!!userProfile.npa}
                          editMode={editMode}
                          fieldName="npa"
                          onFieldChange={handleFieldChange}
                        />
                        <ProfileField
                          label="Ville"
                          value={editMode ? editedProfile.ville : userProfile.ville}
                          filled={!!userProfile.ville}
                          editMode={editMode}
                          fieldName="ville"
                          onFieldChange={handleFieldChange}
                        />
                        <ProfileField
                          label="Canton"
                          value={editMode ? editedProfile.canton : userProfile.canton}
                          filled={!!userProfile.canton}
                          editMode={editMode}
                          fieldName="canton"
                          onFieldChange={handleFieldChange}
                          type="select-canton"
                        />
                        <ProfileField
                          label="Téléphone"
                          value={editMode ? editedProfile.telephone : userProfile.telephone}
                          filled={!!userProfile.telephone}
                          editMode={editMode}
                          fieldName="telephone"
                          onFieldChange={handleFieldChange}
                          type="tel"
                        />
                        <ProfileField
                          label="Langue"
                          value={editMode ? editedProfile.langue : userProfile.langue}
                          filled={!!userProfile.langue}
                          editMode={editMode}
                          fieldName="langue"
                          onFieldChange={handleFieldChange}
                          type="select-langue"
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2 mt-4 pt-3 border-t border-gray-200">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900 text-sm">Professionnel</h4>
                      </div>
                      <div className="space-y-2">
                        <ProfileField
                          label="Statut"
                          value={editMode ? editedProfile.statut_professionnel : userProfile.statut_professionnel}
                          filled={!!userProfile.statut_professionnel}
                          editMode={editMode}
                          fieldName="statut_professionnel"
                          onFieldChange={handleFieldChange}
                          type="select-statut-pro"
                        />
                        <ProfileField
                          label="Profession"
                          value={editMode ? editedProfile.profession : userProfile.profession}
                          filled={!!userProfile.profession}
                          editMode={editMode}
                          fieldName="profession"
                          onFieldChange={handleFieldChange}
                        />
                        <ProfileField
                          label="Employeur"
                          value={editMode ? editedProfile.employeur : userProfile.employeur}
                          filled={!!userProfile.employeur}
                          editMode={editMode}
                          fieldName="employeur"
                          onFieldChange={handleFieldChange}
                        />
                        <ProfileField
                          label="Numéro AVS"
                          value={editMode ? editedProfile.numero_avs : userProfile.numero_avs}
                          filled={!!userProfile.numero_avs}
                          editMode={editMode}
                          fieldName="numero_avs"
                          onFieldChange={handleFieldChange}
                        />
                        <ProfileField
                          label="Caisse de pension"
                          value={editMode ? editedProfile.caisse_pension : userProfile.caisse_pension}
                          filled={!!userProfile.caisse_pension}
                          editMode={editMode}
                          fieldName="caisse_pension"
                          onFieldChange={handleFieldChange}
                        />
                        <ProfileField
                          label="Activité lucrative en Suisse"
                          value={
                            editMode
                              ? editedProfile.activite_lucrative_suisse !== undefined
                                ? editedProfile.activite_lucrative_suisse ? 'Oui' : 'Non'
                                : ''
                              : userProfile.activite_lucrative_suisse !== undefined
                              ? userProfile.activite_lucrative_suisse ? 'Oui' : 'Non'
                              : null
                          }
                          filled={userProfile.activite_lucrative_suisse !== undefined}
                          editMode={editMode}
                          fieldName="activite_lucrative_suisse"
                          onFieldChange={handleFieldChange}
                          type="select-boolean"
                        />
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
                            editMode
                              ? editedProfile.revenu_annuel?.toString() || ''
                              : userProfile.revenu_annuel
                              ? formatCurrency(userProfile.revenu_annuel)
                              : null
                          }
                          filled={!!userProfile.revenu_annuel}
                          sensitive
                          showSensitive={showSensitive}
                          editMode={editMode}
                          fieldName="revenu_annuel"
                          onFieldChange={handleFieldChange}
                          type="number"
                        />
                        <ProfileField
                          label="Revenu mensuel"
                          value={
                            editMode
                              ? editedProfile.revenu_mensuel?.toString() || ''
                              : userProfile.revenu_mensuel
                              ? formatCurrency(userProfile.revenu_mensuel)
                              : null
                          }
                          filled={!!userProfile.revenu_mensuel}
                          sensitive
                          showSensitive={showSensitive}
                          editMode={editMode}
                          fieldName="revenu_mensuel"
                          onFieldChange={handleFieldChange}
                          type="number"
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2 mt-4 pt-3 border-t border-gray-200">
                        <HomeIcon className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-900 text-sm">Logement</h4>
                      </div>
                      <div className="space-y-2">
                        <ProfileField
                          label="Statut"
                          value={editMode ? editedProfile.statut_logement : userProfile.statut_logement}
                          filled={!!userProfile.statut_logement}
                          editMode={editMode}
                          fieldName="statut_logement"
                          onFieldChange={handleFieldChange}
                          type="select-statut-logement"
                        />
                        <ProfileField
                          label="Loyer mensuel"
                          value={
                            editMode
                              ? editedProfile.loyer_mensuel?.toString() || ''
                              : userProfile.loyer_mensuel
                              ? formatCurrency(userProfile.loyer_mensuel)
                              : null
                          }
                          filled={!!userProfile.loyer_mensuel}
                          sensitive
                          showSensitive={showSensitive}
                          editMode={editMode}
                          fieldName="loyer_mensuel"
                          onFieldChange={handleFieldChange}
                          type="number"
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

          {/* Simulateur fiscal 2025 */}
          {hasFinancialData && (
            <div className="mb-6">
              <TaxSimulator2025 autoFill={true} />
            </div>
          )}


          {/* Section outils et actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🛠️ Outils disponibles</CardTitle>
                <CardDescription>
                  Explorez tous nos outils pour optimiser vos finances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={() => window.location.href = '/assistant-fiscal'}
                    className="w-full justify-start h-auto py-3 px-4"
                    variant="outline"
                  >
                    <div className="flex items-start gap-3 text-left">
                      <span className="text-2xl">💬</span>
                      <div>
                        <div className="font-semibold">Assistant Fiscal IA</div>
                        <div className="text-xs text-gray-500">Posez vos questions fiscales à Aurore</div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => window.location.href = '/recherche-biens'}
                    className="w-full justify-start h-auto py-3 px-4"
                    variant="outline"
                  >
                    <div className="flex items-start gap-3 text-left">
                      <span className="text-2xl">🏠</span>
                      <div>
                        <div className="font-semibold">Recherche Immobilière IA</div>
                        <div className="text-xs text-gray-500">Trouvez votre bien idéal avec l'IA</div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => window.location.href = '/simulateurs'}
                    className="w-full justify-start h-auto py-3 px-4"
                    variant="outline"
                  >
                    <div className="flex items-start gap-3 text-left">
                      <span className="text-2xl">🧮</span>
                      <div>
                        <div className="font-semibold">Simulateurs Financiers</div>
                        <div className="text-xs text-gray-500">Hypothèque, impôts, retraite...</div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => window.location.href = '/recherche-lpp'}
                    className="w-full justify-start h-auto py-3 px-4"
                    variant="outline"
                  >
                    <div className="flex items-start gap-3 text-left">
                      <span className="text-2xl">🔍</span>
                      <div>
                        <div className="font-semibold">Recherche LPP</div>
                        <div className="text-xs text-gray-500">Retrouvez vos avoirs de prévoyance</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📈 Votre progression</CardTitle>
                <CardDescription>
                  Complétez votre profil pour des recommandations personnalisées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barre de progression globale */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Profil complété</span>
                    <span className="text-gray-600">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        completionPercentage >= 80 ? 'bg-green-600' :
                        completionPercentage >= 50 ? 'bg-blue-600' : 'bg-orange-600'
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Actions recommandées */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">Actions recommandées:</h4>

                  {completionPercentage < 100 && (
                    <Button
                      onClick={() => window.location.href = '/onboarding'}
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                    >
                      <span className="mr-2">📝</span>
                      Compléter mon profil ({100 - completionPercentage}% restant)
                    </Button>
                  )}

                  {hasFinancialData && (
                    <Button
                      onClick={() => window.location.href = '/objectifs'}
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                    >
                      <span className="mr-2">🎯</span>
                      Définir mes objectifs financiers
                    </Button>
                  )}

                  {profile?.revenu_mensuel && (
                    <Button
                      onClick={() => window.location.href = '/recherche-biens'}
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                    >
                      <span className="mr-2">🏡</span>
                      Chercher un bien immobilier
                    </Button>
                  )}

                  <Button
                    onClick={() => window.location.href = '/assistant-fiscal'}
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <span className="mr-2">💡</span>
                    Obtenir des conseils fiscaux
                  </Button>
                </div>

                {/* Message d'encouragement */}
                {completionPercentage === 100 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-green-700">
                      🎉 Profil complet! Vous bénéficiez maintenant de toutes nos fonctionnalités.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-blue-700">
                      💡 Plus votre profil est complet, plus nos recommandations seront précises!
                    </p>
                  </div>
                )}
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
  rawValue,
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
  rawValue?: string | null | undefined;
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

  // Pour les champs date, utiliser rawValue en mode édition (format YYYY-MM-DD)
  const editValue = type === 'date' && rawValue ? rawValue : value;

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
        ) : type === 'select-genre' ? (
          <select
            value={value || ''}
            onChange={(e) => onFieldChange(fieldName, e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="autre">Autre</option>
          </select>
        ) : type === 'select-langue' ? (
          <select
            value={value || ''}
            onChange={(e) => onFieldChange(fieldName, e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            <option value="francais">Français</option>
            <option value="allemand">Allemand</option>
            <option value="italien">Italien</option>
            <option value="romanche">Romanche</option>
            <option value="anglais">Anglais</option>
          </select>
        ) : type === 'select-boolean' ? (
          <select
            value={value || ''}
            onChange={(e) => onFieldChange(fieldName, e.target.value === 'true')}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        ) : type === 'select-canton' ? (
          <select
            value={value || ''}
            onChange={(e) => onFieldChange(fieldName, e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            <option value="AG">Argovie (AG)</option>
            <option value="AI">Appenzell Rhodes-Intérieures (AI)</option>
            <option value="AR">Appenzell Rhodes-Extérieures (AR)</option>
            <option value="BE">Berne (BE)</option>
            <option value="BL">Bâle-Campagne (BL)</option>
            <option value="BS">Bâle-Ville (BS)</option>
            <option value="FR">Fribourg (FR)</option>
            <option value="GE">Genève (GE)</option>
            <option value="GL">Glaris (GL)</option>
            <option value="GR">Grisons (GR)</option>
            <option value="JU">Jura (JU)</option>
            <option value="LU">Lucerne (LU)</option>
            <option value="NE">Neuchâtel (NE)</option>
            <option value="NW">Nidwald (NW)</option>
            <option value="OW">Obwald (OW)</option>
            <option value="SG">Saint-Gall (SG)</option>
            <option value="SH">Schaffhouse (SH)</option>
            <option value="SO">Soleure (SO)</option>
            <option value="SZ">Schwyz (SZ)</option>
            <option value="TG">Thurgovie (TG)</option>
            <option value="TI">Tessin (TI)</option>
            <option value="UR">Uri (UR)</option>
            <option value="VD">Vaud (VD)</option>
            <option value="VS">Valais (VS)</option>
            <option value="ZG">Zoug (ZG)</option>
            <option value="ZH">Zurich (ZH)</option>
          </select>
        ) : type === 'file-image' ? (
          <div className="space-y-2">
            <input
              type="url"
              value={editValue || ''}
              onChange={(e) => onFieldChange(fieldName, e.target.value)}
              className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="URL de l'image ou upload à venir..."
            />
            <p className="text-xs text-gray-500">⚠️ Upload d'images: fonctionnalité à venir. Utilisez une URL pour le moment.</p>
          </div>
        ) : (
          <input
            type={type}
            value={editValue || ''}
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
