'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { UserProfileSupabaseService } from '@/lib/services/user-profile-supabase.service';
import type { UserProfile, FinancialGoal, GeneratedDocument, MortgageSimulation, RealEstateFavorite } from '@/lib/supabase/client';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Home,
  DollarSign,
  FileText,
  Target,
  Calculator,
  Heart,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Database,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function DashboardDataPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [allData, setAllData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSensitive, setShowSensitive] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const data = await UserProfileSupabaseService.getAllUserData();
      setAllData(data);
      console.log('[Dashboard] Loaded data:', data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  if (!user || !allData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Impossible de charger les données</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const { profile, goals, documents, simulations, favorites, stats } = allData;
  const completionPercentage = calculateProfileCompletion(profile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header avec badge "Données Extraites" */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-4 border-blue-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile?.prenom?.[0]?.toUpperCase() || profile?.nom?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  Dashboard des Données Extraites
                </h1>
                <p className="text-lg text-gray-600 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {profile?.email || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                <Database className="w-5 h-5" />
                Supabase Connected
              </div>
              <button
                onClick={() => setShowSensitive(!showSensitive)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                {showSensitive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {showSensitive ? 'Masquer' : 'Afficher'} données sensibles
              </button>
            </div>
          </div>

          {/* Barre de complétion */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-700">Profil complété à</span>
              <span className="text-3xl font-bold text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={<Target className="w-8 h-8" />}
            label="Objectifs"
            value={stats.goalsCount}
            sublabel={`${stats.goalsCompleted} complétés`}
            color="blue"
          />
          <StatCard
            icon={<FileText className="w-8 h-8" />}
            label="Documents"
            value={stats.documentsCount}
            sublabel="générés"
            color="green"
          />
          <StatCard
            icon={<Calculator className="w-8 h-8" />}
            label="Simulations"
            value={stats.simulationsCount}
            sublabel="hypothécaires"
            color="purple"
          />
          <StatCard
            icon={<Heart className="w-8 h-8" />}
            label="Favoris"
            value={stats.favoritesCount}
            sublabel="immobiliers"
            color="pink"
          />
          <StatCard
            icon={<Database className="w-8 h-8" />}
            label="Total"
            value={stats.goalsCount + stats.documentsCount + stats.simulationsCount + stats.favoritesCount}
            sublabel="entrées DB"
            color="indigo"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations personnelles */}
          <DataSection title="Informations Personnelles" icon={<User className="w-6 h-6" />} color="blue">
            <DataField label="Nom complet" value={`${profile?.prenom || ''} ${profile?.nom || ''}`} extracted={!!(profile?.prenom && profile?.nom)} />
            <DataField label="Email" value={profile?.email} extracted={!!profile?.email} />
            <DataField
              label="Date de naissance"
              value={profile?.date_naissance ? new Date(profile.date_naissance).toLocaleDateString('fr-CH') : null}
              extracted={!!profile?.date_naissance}
            />
            <DataField label="Situation familiale" value={profile?.situation_familiale} extracted={!!profile?.situation_familiale} />
            <DataField label="Nombre d'enfants" value={profile?.nombre_enfants?.toString()} extracted={profile?.nombre_enfants !== null} />
          </DataSection>

          {/* Informations fiscales */}
          <DataSection title="Informations Fiscales" icon={<DollarSign className="w-6 h-6" />} color="green">
            <DataField
              label="Revenu annuel"
              value={profile?.revenu_annuel ? `CHF ${profile.revenu_annuel.toLocaleString('fr-CH')}` : null}
              extracted={!!profile?.revenu_annuel}
              sensitive
              showSensitive={showSensitive}
            />
            <DataField
              label="Revenu mensuel"
              value={profile?.revenu_mensuel ? `CHF ${profile.revenu_mensuel.toLocaleString('fr-CH')}` : null}
              extracted={!!profile?.revenu_mensuel}
              sensitive
              showSensitive={showSensitive}
            />
          </DataSection>

          {/* Localisation */}
          <DataSection title="Localisation" icon={<MapPin className="w-6 h-6" />} color="purple">
            <DataField label="Adresse" value={profile?.adresse} extracted={!!profile?.adresse} />
            <DataField label="NPA" value={profile?.npa} extracted={!!profile?.npa} />
            <DataField label="Ville" value={profile?.ville} extracted={!!profile?.ville} />
            <DataField label="Canton" value={profile?.canton} extracted={!!profile?.canton} />
          </DataSection>

          {/* Informations professionnelles */}
          <DataSection title="Informations Professionnelles" icon={<Briefcase className="w-6 h-6" />} color="orange">
            <DataField label="Statut" value={profile?.statut_professionnel} extracted={!!profile?.statut_professionnel} />
            <DataField label="Employeur" value={profile?.employeur} extracted={!!profile?.employeur} />
            <DataField label="Profession" value={profile?.profession} extracted={!!profile?.profession} />
          </DataSection>

          {/* Logement */}
          <DataSection title="Logement" icon={<Home className="w-6 h-6" />} color="pink">
            <DataField label="Statut logement" value={profile?.statut_logement} extracted={!!profile?.statut_logement} />
            <DataField
              label="Loyer mensuel"
              value={profile?.loyer_mensuel ? `CHF ${profile.loyer_mensuel.toLocaleString('fr-CH')}` : null}
              extracted={!!profile?.loyer_mensuel}
              sensitive
              showSensitive={showSensitive}
            />
          </DataSection>

          {/* Informations bancaires */}
          <DataSection title="Informations Bancaires" icon={<TrendingUp className="w-6 h-6" />} color="indigo">
            <DataField label="IBAN" value={profile?.iban} extracted={!!profile?.iban} sensitive showSensitive={showSensitive} />
            <DataField label="Banque" value={profile?.banque} extracted={!!profile?.banque} />
          </DataSection>
        </div>

        {/* Objectifs financiers */}
        {goals.length > 0 && (
          <div className="mt-8">
            <ListSection
              title="Objectifs Financiers"
              icon={<Target className="w-6 h-6" />}
              color="blue"
              items={goals}
              renderItem={(goal: FinancialGoal) => (
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-900 text-lg">{goal.nom}</p>
                      <GoalStatusBadge status={goal.statut} />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{goal.type} • Priorité: {goal.priorite}/5</p>
                    {goal.montant_cible && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Cible: CHF {goal.montant_cible.toLocaleString('fr-CH')} | Actuel: CHF{' '}
                          {(goal.montant_actuel || 0).toLocaleString('fr-CH')}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, ((goal.montant_actuel || 0) / goal.montant_cible) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{new Date(goal.created_at!).toLocaleDateString('fr-CH')}</div>
                </div>
              )}
            />
          </div>
        )}

        {/* Documents générés */}
        {documents.length > 0 && (
          <div className="mt-8">
            <ListSection
              title="Documents Générés"
              icon={<FileText className="w-6 h-6" />}
              color="green"
              items={documents}
              renderItem={(doc: GeneratedDocument) => (
                <div className="flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-600">Type: {doc.type}</p>
                    {doc.template_used && <p className="text-xs text-gray-500 mt-1">Template: {doc.template_used}</p>}
                  </div>
                  <div className="text-sm text-gray-500">{new Date(doc.created_at!).toLocaleDateString('fr-CH')}</div>
                </div>
              )}
            />
          </div>
        )}

        {/* Simulations hypothécaires */}
        {simulations.length > 0 && (
          <div className="mt-8">
            <ListSection
              title="Simulations Hypothécaires"
              icon={<Calculator className="w-6 h-6" />}
              color="purple"
              items={simulations}
              renderItem={(sim: MortgageSimulation) => (
                <div className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{sim.nom || 'Simulation sans nom'}</p>
                    <div className="text-sm text-gray-500">{new Date(sim.created_at!).toLocaleDateString('fr-CH')}</div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Prix</p>
                      <p className="font-semibold">CHF {sim.property_price.toLocaleString('fr-CH')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Apport</p>
                      <p className="font-semibold">CHF {sim.down_payment.toLocaleString('fr-CH')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Taux</p>
                      <p className="font-semibold">{(sim.interest_rate * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Durée</p>
                      <p className="font-semibold">{sim.duration} ans</p>
                    </div>
                  </div>
                  {sim.notes && <p className="text-xs text-gray-500 mt-2">{sim.notes}</p>}
                </div>
              )}
            />
          </div>
        )}

        {/* Favoris immobiliers */}
        {favorites.length > 0 && (
          <div className="mt-8">
            <ListSection
              title="Favoris Immobiliers"
              icon={<Heart className="w-6 h-6" />}
              color="pink"
              items={favorites}
              renderItem={(fav: RealEstateFavorite) => (
                <div className="flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <Heart className="w-5 h-5 text-pink-600 mt-1 fill-current" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Propriété #{fav.property_id}</p>
                    {fav.notes && <p className="text-sm text-gray-600 mt-1">{fav.notes}</p>}
                    {fav.tags && fav.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {fav.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{new Date(fav.created_at!).toLocaleDateString('fr-CH')}</div>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// === COMPOSANTS HELPERS ===

function StatCard({
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sublabel: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
    orange: 'from-orange-500 to-orange-600',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses} rounded-lg flex items-center justify-center text-white mb-3 shadow`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-semibold text-gray-700">{label}</div>
      <div className="text-xs text-gray-500 mt-1">{sublabel}</div>
    </div>
  );
}

function DataSection({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    pink: 'text-pink-600 bg-pink-50',
    indigo: 'text-indigo-600 bg-indigo-50',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className={`${colorClasses} p-3 rounded-lg`}>{icon}</div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DataField({
  label,
  value,
  extracted,
  sensitive = false,
  showSensitive = true,
}: {
  label: string;
  value: string | null | undefined;
  extracted: boolean;
  sensitive?: boolean;
  showSensitive?: boolean;
}) {
  const displayValue = sensitive && !showSensitive ? '••••••••' : value || 'Non extrait';
  const textColor = extracted ? 'text-gray-900 font-medium' : 'text-gray-400 italic';
  const bgColor = extracted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200';

  return (
    <div className={`flex items-center justify-between py-3 px-4 rounded-lg border-2 ${bgColor}`}>
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {extracted && <CheckCircle2 className="w-4 h-4 text-green-500" />}
        <span className={`text-sm ${textColor}`}>{displayValue}</span>
      </div>
    </div>
  );
}

function ListSection({
  title,
  icon,
  color,
  items,
  renderItem,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    pink: 'text-pink-600 bg-pink-50',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`${colorClasses} p-3 rounded-lg`}>{icon}</div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold">{items.length} entrées</div>
      </div>
      <div className="space-y-2">{items.map((item, i) => <div key={item.id || i}>{renderItem(item)}</div>)}</div>
    </div>
  );
}

function GoalStatusBadge({ status }: { status: string }) {
  const config = {
    complete: { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Complété', color: 'bg-green-100 text-green-700' },
    en_cours: { icon: <Clock className="w-4 h-4" />, label: 'En cours', color: 'bg-blue-100 text-blue-700' },
    en_pause: { icon: <Clock className="w-4 h-4" />, label: 'En pause', color: 'bg-yellow-100 text-yellow-700' },
    abandonne: { icon: <XCircle className="w-4 h-4" />, label: 'Abandonné', color: 'bg-gray-100 text-gray-700' },
  }[status] || { icon: <Clock className="w-4 h-4" />, label: status, color: 'bg-gray-100 text-gray-700' };

  return (
    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${config.color} text-xs font-semibold`}>
      {config.icon}
      {config.label}
    </div>
  );
}

function calculateProfileCompletion(profile: UserProfile | null): number {
  if (!profile) return 0;

  const fields = [
    profile.nom,
    profile.prenom,
    profile.date_naissance,
    profile.revenu_annuel,
    profile.revenu_mensuel,
    profile.situation_familiale,
    profile.adresse,
    profile.npa,
    profile.ville,
    profile.canton,
    profile.statut_professionnel,
    profile.profession,
    profile.statut_logement,
    profile.employeur,
  ];

  const filledCount = fields.filter((f) => f !== null && f !== undefined && f !== '').length;
  return Math.round((filledCount / fields.length) * 100);
}
