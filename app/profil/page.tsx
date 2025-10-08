'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserMenu from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Calendar, 
  DollarSign,
  Save,
  ArrowLeft,
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { UserProfile, Canton } from '@/types/user';
// TODO: Migrate to Supabase - authService deleted
// import { authService } from '@/lib/services/auth.service';

export default function ProfilPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Charger le profil au démarrage
  useEffect(() => {
    if (user?.profil) {
      setProfile(user.profil);
    } else {
      // Initialiser un profil vide
      setProfile({
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        email: user?.email || '',
        dateNaissance: new Date(),
        canton: { code: 'GE', nom: 'Genève', tauxImposition: { revenu: 0.25, fortune: 0.5 } },
        situationFamiliale: 'celibataire',
        revenuNetMensuel: 0,
        profession: '',
        secteurActivite: '',
        statutProfessionnel: 'salarie',
        patrimoine: {
          cash: 0,
          investissements: 0,
          immobilier: 0,
          dettes: 0,
          prevoyance: {
            pilier2: { capital: 0, cotisationMensuelle: 0, tauxInteret: 0.02 },
            pilier3a: { capital: 0, versementAnnuel: 0, banque: '' },
            pilier3b: { capital: 0, versementAnnuel: 0 }
          }
        },
        objectifsFinanciers: [],
        profilRisque: 'modere',
        preferences: {
          notifications: true,
          newsletter: false,
          recommandationsAutomatiques: true
        }
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    if (!profile) return;
    
    setProfile(prev => {
      if (!prev) return null;
      
      // Gérer les champs imbriqués
      if (field.includes('.')) {
        const keys = field.split('.');
        const newProfile = { ...prev };
        let current: any = newProfile;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return newProfile;
      } else {
        return { ...prev, [field]: value };
      }
    });
    
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // TODO: Migrate to Supabase
      // const saved = await authService.updateUserProfile(user.id, profile);
      setError('Cette fonctionnalité sera bientôt disponible avec Supabase');
    } catch (err) {
      setError('Une erreur inattendue est survenue');
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

  const getCompletionPercentage = () => {
    if (!profile) return 0;
    
    const fields = [
      profile.nom,
      profile.prenom,
      profile.email,
      profile.canton,
      profile.revenuNetMensuel > 0,
      profile.profession,
      profile.patrimoine.cash >= 0,
      profile.patrimoine.prevoyance.pilier2.capital >= 0
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de votre profil...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Mon profil
                  </h1>
                  <p className="text-lg text-gray-600">
                    Gérez vos informations personnelles et financières
                  </p>
                </div>
              </div>
              <UserMenu />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Progression */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Complétude du profil</h3>
                  <p className="text-sm text-gray-600">
                    Un profil complet améliore la qualité de nos conseils
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {getCompletionPercentage()}%
                  </div>
                  <div className="text-sm text-gray-500">complété</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Messages d'état */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 mb-6">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Prénom
                    </label>
                    <Input
                      value={profile.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Nom
                    </label>
                    <Input
                      value={profile.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Email
                  </label>
                  <Input
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    type="email"
                    placeholder="jean.dupont@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Canton de résidence
                  </label>
                  <Select 
                    value={profile.canton?.code} 
                    onValueChange={(value) => {
                      const cantonData = { code: value, nom: value, tauxImposition: { revenu: 0.25, fortune: 0.5 } };
                      handleInputChange('canton', cantonData);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre canton" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GE">Genève (GE)</SelectItem>
                      <SelectItem value="VD">Vaud (VD)</SelectItem>
                      <SelectItem value="ZH">Zurich (ZH)</SelectItem>
                      <SelectItem value="BE">Berne (BE)</SelectItem>
                      <SelectItem value="VS">Valais (VS)</SelectItem>
                      <SelectItem value="FR">Fribourg (FR)</SelectItem>
                      <SelectItem value="NE">Neuchâtel (NE)</SelectItem>
                      <SelectItem value="JU">Jura (JU)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Situation familiale
                  </label>
                  <Select 
                    value={profile.situationFamiliale} 
                    onValueChange={(value) => handleInputChange('situationFamiliale', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celibataire">Célibataire</SelectItem>
                      <SelectItem value="marie">Marié(e)</SelectItem>
                      <SelectItem value="divorce">Divorcé(e)</SelectItem>
                      <SelectItem value="veuf">Veuf(ve)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Situation professionnelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Situation professionnelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Profession
                  </label>
                  <Input
                    value={profile.profession}
                    onChange={(e) => handleInputChange('profession', e.target.value)}
                    placeholder="Ingénieur, Médecin, etc."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Secteur d'activité
                  </label>
                  <Input
                    value={profile.secteurActivite}
                    onChange={(e) => handleInputChange('secteurActivite', e.target.value)}
                    placeholder="IT, Santé, Finance, etc."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Statut professionnel
                  </label>
                  <Select 
                    value={profile.statutProfessionnel} 
                    onValueChange={(value) => handleInputChange('statutProfessionnel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salarie">Salarié</SelectItem>
                      <SelectItem value="independant">Indépendant</SelectItem>
                      <SelectItem value="fonctionnaire">Fonctionnaire</SelectItem>
                      <SelectItem value="retraite">Retraité</SelectItem>
                      <SelectItem value="etudiant">Étudiant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Revenu net mensuel (CHF)
                  </label>
                  <Input
                    type="number"
                    value={profile.revenuNetMensuel}
                    onChange={(e) => handleInputChange('revenuNetMensuel', Number(e.target.value))}
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Profil de risque
                  </label>
                  <Select 
                    value={profile.profilRisque} 
                    onValueChange={(value) => handleInputChange('profilRisque', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservateur">Conservateur</SelectItem>
                      <SelectItem value="modere">Modéré</SelectItem>
                      <SelectItem value="agressif">Agressif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Patrimoine */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Patrimoine actuel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Liquidités (CHF)
                  </label>
                  <Input
                    type="number"
                    value={profile.patrimoine.cash}
                    onChange={(e) => handleInputChange('patrimoine.cash', Number(e.target.value))}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Investissements (CHF)
                  </label>
                  <Input
                    type="number"
                    value={profile.patrimoine.investissements}
                    onChange={(e) => handleInputChange('patrimoine.investissements', Number(e.target.value))}
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Immobilier (CHF)
                  </label>
                  <Input
                    type="number"
                    value={profile.patrimoine.immobilier}
                    onChange={(e) => handleInputChange('patrimoine.immobilier', Number(e.target.value))}
                    placeholder="800000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Dettes (CHF)
                  </label>
                  <Input
                    type="number"
                    value={profile.patrimoine.dettes}
                    onChange={(e) => handleInputChange('patrimoine.dettes', Number(e.target.value))}
                    placeholder="20000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Prévoyance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Prévoyance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">2e pilier (LPP)</h4>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={profile.patrimoine.prevoyance.pilier2.capital}
                      onChange={(e) => handleInputChange('patrimoine.prevoyance.pilier2.capital', Number(e.target.value))}
                      placeholder="Capital accumulé (CHF)"
                    />
                    <Input
                      type="number"
                      value={profile.patrimoine.prevoyance.pilier2.cotisationMensuelle}
                      onChange={(e) => handleInputChange('patrimoine.prevoyance.pilier2.cotisationMensuelle', Number(e.target.value))}
                      placeholder="Cotisation mensuelle (CHF)"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">3e pilier A</h4>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={profile.patrimoine.prevoyance.pilier3a.capital}
                      onChange={(e) => handleInputChange('patrimoine.prevoyance.pilier3a.capital', Number(e.target.value))}
                      placeholder="Capital accumulé (CHF)"
                    />
                    <Input
                      type="number"
                      value={profile.patrimoine.prevoyance.pilier3a.versementAnnuel}
                      onChange={(e) => handleInputChange('patrimoine.prevoyance.pilier3a.versementAnnuel', Number(e.target.value))}
                      placeholder="Versement annuel (CHF)"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">3e pilier B</h4>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={profile.patrimoine.prevoyance.pilier3b.capital}
                      onChange={(e) => handleInputChange('patrimoine.prevoyance.pilier3b.capital', Number(e.target.value))}
                      placeholder="Capital accumulé (CHF)"
                    />
                    <Input
                      type="number"
                      value={profile.patrimoine.prevoyance.pilier3b.versementAnnuel}
                      onChange={(e) => handleInputChange('patrimoine.prevoyance.pilier3b.versementAnnuel', Number(e.target.value))}
                      placeholder="Versement annuel (CHF)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sauvegarde...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder le profil
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}