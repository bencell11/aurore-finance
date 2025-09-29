'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, Calendar, Shield, Eye, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  app_metadata: any;
  user_metadata: any;
  providers: string[];
  source?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [mode, setMode] = useState<'demo' | 'production' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du chargement');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
      setMode(data.mode || null);
      setMessage(data.message || null);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleString('fr-CH');
  };

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'google': return 'bg-red-100 text-red-800';
      case 'github': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUsers} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Administration des Utilisateurs
          </h1>
          <p className="text-gray-600">
            Gestion des utilisateurs authentifiés via Supabase
          </p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-sm">
              {users.length} utilisateur(s) trouvé(s)
            </Badge>
            {mode && (
              <Badge 
                className={`text-sm ${
                  mode === 'demo' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}
              >
                Mode {mode}
              </Badge>
            )}
            <Button onClick={fetchUsers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
          {message && (
            <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
              💡 {message}
            </div>
          )}
        </div>

        {users.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-600">
                Aucun utilisateur n'est actuellement enregistré dans Supabase.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Liste des utilisateurs */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Utilisateurs enregistrés</h2>
              
              {users.map((user) => (
                <Card 
                  key={user.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedUser?.id === user.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">
                            {user.email || 'Email non défini'}
                          </span>
                        </div>
                        
                        {user.phone && (
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600">{user.phone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Créé le {formatDate(user.created_at)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {user.providers.map((provider) => (
                            <Badge 
                              key={provider} 
                              className={`text-xs ${getProviderBadgeColor(provider)}`}
                            >
                              {provider}
                            </Badge>
                          ))}
                          {user.source === 'waitlist' && (
                            <Badge className="text-xs bg-purple-100 text-purple-800">
                              📧 Waitlist
                            </Badge>
                          )}
                          {user.email_confirmed_at && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              ✓ Confirmé
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Détails utilisateur */}
            <div>
              {selectedUser ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Détails de l'utilisateur
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Informations de base */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Informations de base</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">ID :</span>
                          <span className="ml-2 font-mono text-xs">{selectedUser.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email :</span>
                          <span className="ml-2">{selectedUser.email || 'Non défini'}</span>
                        </div>
                        {selectedUser.phone && (
                          <div>
                            <span className="text-gray-600">Téléphone :</span>
                            <span className="ml-2">{selectedUser.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dates importantes */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Dates importantes</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Créé le :</span>
                          <span className="ml-2">{formatDate(selectedUser.created_at)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Mis à jour le :</span>
                          <span className="ml-2">{formatDate(selectedUser.updated_at)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Dernière connexion :</span>
                          <span className="ml-2">{formatDate(selectedUser.last_sign_in_at)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email confirmé le :</span>
                          <span className="ml-2">{formatDate(selectedUser.email_confirmed_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Métadonnées */}
                    {(Object.keys(selectedUser.user_metadata || {}).length > 0 || 
                      Object.keys(selectedUser.app_metadata || {}).length > 0) && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Métadonnées</h4>
                        
                        {Object.keys(selectedUser.user_metadata || {}).length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-600">User Metadata :</span>
                            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                              {JSON.stringify(selectedUser.user_metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        {Object.keys(selectedUser.app_metadata || {}).length > 0 && (
                          <div>
                            <span className="text-sm text-gray-600">App Metadata :</span>
                            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                              {JSON.stringify(selectedUser.app_metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fournisseurs d'authentification */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Fournisseurs d'authentification</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.providers.map((provider) => (
                          <Badge 
                            key={provider} 
                            className={getProviderBadgeColor(provider)}
                          >
                            {provider}
                          </Badge>
                        ))}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sélectionnez un utilisateur
                    </h3>
                    <p className="text-gray-600">
                      Cliquez sur un utilisateur dans la liste pour voir ses détails
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          
          {/* Instructions actuelles */}
          <Card className={mode === 'demo' ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'}>
            <CardContent className="pt-6">
              <h3 className={`font-semibold mb-2 ${mode === 'demo' ? 'text-yellow-900' : 'text-blue-900'}`}>
                {mode === 'demo' ? '🧪 Mode Démonstration' : '🔐 Mode Production'}
              </h3>
              <div className={`text-sm space-y-2 ${mode === 'demo' ? 'text-yellow-800' : 'text-blue-800'}`}>
                {mode === 'demo' ? (
                  <>
                    <p>• <strong>Actuellement en mode démo</strong> - Utilisateurs basés sur la waitlist</p>
                    <p>• Les utilisateurs affichés proviennent des inscriptions à la newsletter</p>
                    <p>• Aucune authentification réelle n'est configurée</p>
                  </>
                ) : (
                  <>
                    <p>• <strong>Mode production activé</strong> - Connexion Supabase réelle</p>
                    <p>• Les utilisateurs peuvent s'authentifier directement</p>
                    <p>• Données récupérées via l'API Admin de Supabase</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Supabase */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-green-900 mb-2">⚡ Activer Supabase</h3>
              <div className="text-sm text-green-800 space-y-2">
                <p><strong>1. Créer un projet Supabase :</strong></p>
                <p className="ml-4">• Allez sur <code className="bg-white px-1 rounded">supabase.com</code></p>
                <p className="ml-4">• Créez un nouveau projet</p>
                
                <p className="pt-2"><strong>2. Configurer les variables :</strong></p>
                <p className="ml-4">• <code className="bg-white px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></p>
                <p className="ml-4">• <code className="bg-white px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code></p>
                
                <p className="pt-2"><strong>3. Redémarrer l'application</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}