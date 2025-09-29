'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Mode démo : bypass de l'authentification
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-url-here' ||
                      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo');
    
    if (isDemoMode) {
      // En mode démo, connexion automatique
      setSuccess(mode === 'login' ? 'Connexion réussie! (Mode Démo)' : 'Compte créé avec succès! (Mode Démo)');
      setTimeout(() => {
        router.push('/assistant-fiscal');
      }, 500);
      return;
    }

    try {
      let response;
      
      if (mode === 'login') {
        response = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await register({
          email: formData.email,
          password: formData.password,
          nom: formData.nom,
          prenom: formData.prenom
        });
      }

      if (response.success) {
        setSuccess(mode === 'login' ? 'Connexion réussie!' : 'Compte créé avec succès!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError(response.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue');
    }
  };

  const isFormValid = () => {
    if (mode === 'login') {
      return formData.email && formData.password;
    } else {
      return formData.email && formData.password && formData.nom && formData.prenom;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Aurore Finance
          </h1>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Connectez-vous à votre espace personnel' 
              : 'Créez votre compte pour accéder à vos outils financiers'
            }
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <Button
            variant={mode === 'login' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setMode('login')}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Connexion
          </Button>
          <Button
            variant={mode === 'register' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setMode('register')}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Inscription
          </Button>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nom et Prénom (inscription seulement) */}
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        placeholder="Jean"
                        className="pl-10"
                        required={mode === 'register'}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="Dupont"
                        className="pl-10"
                        required={mode === 'register'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jean.dupont@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={mode === 'register' ? 'Minimum 6 caractères' : '••••••••'}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {mode === 'register' && (
                  <p className="text-xs text-gray-500">
                    Le mot de passe doit contenir au moins 6 caractères
                  </p>
                )}
              </div>

              {/* Messages d'erreur et de succès */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Bouton de soumission */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {mode === 'login' ? 'Connexion...' : 'Création...'}
                  </div>
                ) : (
                  <>
                    {mode === 'login' ? (
                      <LogIn className="w-4 h-4 mr-2" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  </>
                )}
              </Button>
            </form>

            {/* Info supplémentaire */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? (
                  <>
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Créer un compte
                    </button>
                  </>
                ) : (
                  <>
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Se connecter
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Demo info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                💡 <strong>Version de démonstration</strong><br />
                Vos données sont sauvegardées localement dans votre navigateur
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}