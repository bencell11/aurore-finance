'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, Clock, User } from 'lucide-react';

interface EmailRecord {
  id: string;
  to: string;
  subject: string;
  html: string;
  sentAt: string;
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
    // Rafraîchir toutes les 5 secondes
    const interval = setInterval(fetchEmails, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/emails/preview');
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Erreur chargement emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEmailPreview = (email: EmailRecord) => {
    setSelectedEmail(email);
  };

  const closePreview = () => {
    setSelectedEmail(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Mail className="h-8 w-8 text-blue-600" />
            Preview des Emails Aurore Finance
          </h1>
          <p className="text-gray-600">
            Mode démonstration - Visualisez les emails qui seraient envoyés en production
          </p>
          <div className="mt-4">
            <Badge variant="secondary" className="mr-2">
              {emails.length} email(s) envoyé(s)
            </Badge>
            <Button onClick={fetchEmails} variant="outline" size="sm">
              🔄 Actualiser
            </Button>
          </div>
        </div>

        {emails.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun email envoyé</h3>
              <p className="text-gray-600">
                Testez le formulaire d'inscription sur la page d'accueil pour voir les emails apparaître ici.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Liste des emails */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Emails envoyés</h2>
              
              {emails.map((email) => (
                <Card 
                  key={email.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedEmail?.id === email.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => openEmailPreview(email)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {email.to}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {email.subject}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(email.sentAt).toLocaleString('fr-CH')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Prévisualisation */}
            <div className="lg:col-span-2">
              {selectedEmail ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Prévisualisation Email
                      </CardTitle>
                      <Button onClick={closePreview} variant="outline" size="sm">
                        Fermer
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>À:</strong> {selectedEmail.to}</p>
                      <p><strong>Sujet:</strong> {selectedEmail.subject}</p>
                      <p><strong>Envoyé:</strong> {new Date(selectedEmail.sentAt).toLocaleString('fr-CH')}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        srcDoc={selectedEmail.html}
                        className="w-full h-96 border-0"
                        title="Email Preview"
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sélectionnez un email
                    </h3>
                    <p className="text-gray-600">
                      Cliquez sur un email dans la liste pour le prévisualiser
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Mode démonstration activé</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Les emails sont simulés et stockés temporairement</p>
              <p>• Pour activer les vrais emails, configurez <code className="bg-blue-200 px-1 rounded">RESEND_API_KEY</code> dans .env.local</p>
              <p>• Alternative : configurez <code className="bg-blue-200 px-1 rounded">SMTP_USER</code> et <code className="bg-blue-200 px-1 rounded">SMTP_PASS</code> pour Gmail</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}