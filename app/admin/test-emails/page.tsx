'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Settings } from "lucide-react";

export default function TestEmailsPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  const testEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Erreur de connexion',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkConfig = async () => {
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      setConfig({
        error: 'Erreur chargement configuration',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour admin
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test des Emails</h1>
          <p className="text-gray-600">Diagnostiquer les problèmes d'envoi d'emails</p>
        </div>

        {/* Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={checkConfig} className="mb-4">
              Vérifier la configuration
            </Button>
            
            {config && (
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test d'envoi */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Test d'envoi d'email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de test
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre-email@example.com"
                  className="max-w-md"
                />
              </div>
              
              <Button 
                onClick={testEmail} 
                disabled={!email || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Test en cours...' : 'Tester l\'envoi d\'email'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                Résultat du test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message || result.error}
                </div>
                
                {result.details && (
                  <div className={`mt-2 text-sm ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.details}
                  </div>
                )}
                
                {result.user_id && (
                  <div className="mt-2 text-sm text-green-700">
                    User ID: {result.user_id}
                  </div>
                )}
                
                {result.debug && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Détails techniques :</div>
                    <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                      {JSON.stringify(result.debug, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions de dépannage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Vérifiez Supabase</h3>
              <p className="text-gray-600 text-sm">
                Dans votre projet Supabase → Authentication → Settings → 
                Vérifiez que "Enable email confirmations" est activé
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Variables d'environnement</h3>
              <p className="text-gray-600 text-sm">
                Dans Vercel → Settings → Environment Variables → 
                Vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Emails Supabase</h3>
              <p className="text-gray-600 text-sm">
                Dans Supabase → Authentication → Email Templates → 
                Personnalisez le template de confirmation si nécessaire
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Vérifiez vos spams</h3>
              <p className="text-gray-600 text-sm">
                Les emails Supabase peuvent parfois arriver dans les spams
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}