'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle2, 
  Settings, 
  Database, 
  Bot, 
  Shield, 
  Zap,
  ExternalLink 
} from 'lucide-react';

interface ProductionStatus {
  isDemoMode: boolean;
  mode: string;
  database: string;
  ai: string;
  security: string;
  calculations: string;
  status: string;
  color: string;
}

interface ReadinessCheck {
  name: string;
  passed: boolean;
  current: string;
  required: string;
}

interface ProductionReadiness {
  checks: ReadinessCheck[];
  passedChecks: number;
  totalChecks: number;
  percentage: number;
  isReady: boolean;
  status: string;
}

export function ProductionStatusBanner() {
  const [status, setStatus] = useState<ProductionStatus | null>(null);
  const [readiness, setReadiness] = useState<ProductionReadiness | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/system/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
        setReadiness(data.readiness);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      // Valeurs par défaut si l'API n'est pas disponible
      setStatus({
        isDemoMode: true,
        mode: 'DÉMONSTRATION',
        database: 'Stockage en mémoire',
        ai: 'Réponses simulées',
        security: 'Données mockées',
        calculations: 'Formules simplifiées',
        status: '⚠️ Mode développement',
        color: 'orange'
      });
    }
  };

  if (!status) {
    return null;
  }

  const getStatusIcon = () => {
    if (status.isDemoMode) {
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    }
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  };

  const getStatusColor = () => {
    if (status.isDemoMode) {
      return 'border-orange-500 bg-orange-50';
    }
    return 'border-green-500 bg-green-50';
  };

  return (
    <div className="space-y-4">
      {/* Bannière principale */}
      <Alert className={getStatusColor()}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium">
                Assistant Fiscal Suisse - Mode {status.mode}
              </h3>
              <p className="text-sm text-gray-600">
                {status.status} | Base: {status.database} | IA: {status.ai}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {status.isDemoMode && (
              <Button 
                onClick={() => setShowDetails(!showDetails)}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Configuration
              </Button>
            )}
            
            <Button 
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              {showDetails ? 'Masquer' : 'Détails'}
            </Button>
          </div>
        </div>
      </Alert>

      {/* Détails de configuration */}
      {showDetails && readiness && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Configuration de Production</span>
              <Badge variant={readiness.isReady ? 'default' : 'secondary'}>
                {readiness.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barre de progression */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Préparation</span>
                <span>{readiness.passedChecks}/{readiness.totalChecks} ({readiness.percentage}%)</span>
              </div>
              <Progress value={readiness.percentage} className="h-2" />
            </div>

            {/* Liste des vérifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readiness.checks.map((check, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    check.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{check.name}</span>
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="text-xs space-y-1">
                    <div><strong>Actuel:</strong> {check.current}</div>
                    <div><strong>Requis:</strong> {check.required}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions recommandées */}
            {!readiness.isReady && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Actions recommandées:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>1.</span>
                    <Button 
                      onClick={() => window.open('https://supabase.com', '_blank')}
                      variant="link" 
                      size="sm"
                      className="h-auto p-0"
                    >
                      Créer un projet Supabase
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>2.</span>
                    <Button 
                      onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                      variant="link" 
                      size="sm"
                      className="h-auto p-0"
                    >
                      Obtenir une clé API OpenAI
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>3.</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      npm run setup-production
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* Mode production actif */}
            {readiness.isReady && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Mode Production Actif</h4>
                    <p className="text-sm text-green-700">
                      Toutes les fonctionnalités sont opérationnelles avec des données réelles.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}