'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Bug, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface DebugData {
  storageProfile: any;
  calculationProfile: any;
  exportProfile: any;
  chatbotProfile: any;
  timestamp: string;
}

export function TaxDebugPanel() {
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncIssues, setSyncIssues] = useState<string[]>([]);

  const fetchDebugData = async () => {
    setIsLoading(true);
    try {
      // Récupérer les données de toutes les sources
      const [profileResponse, calculationResponse] = await Promise.all([
        fetch('/api/tax/profile'),
        fetch('/api/tax/debug') // Nous allons créer cette API
      ]);

      const profileData = await profileResponse.json();
      const calculationData = calculationResponse.ok ? await calculationResponse.json() : null;

      const data: DebugData = {
        storageProfile: profileData.profile,
        calculationProfile: calculationData?.profileUsed || null,
        exportProfile: null, // À récupérer si nécessaire
        chatbotProfile: null, // À récupérer si nécessaire
        timestamp: new Date().toISOString()
      };

      setDebugData(data);
      detectSyncIssues(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de debug:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectSyncIssues = (data: DebugData) => {
    const issues: string[] = [];
    
    if (!data.storageProfile || !data.calculationProfile) {
      issues.push('Données manquantes pour la comparaison');
      setSyncIssues(issues);
      return;
    }

    const storage = data.storageProfile;
    const calculation = data.calculationProfile;

    // Vérifier le canton
    if (storage.personalInfo?.canton !== calculation.personalInfo?.canton) {
      issues.push(`Canton différent: Storage(${storage.personalInfo?.canton}) vs Calcul(${calculation.personalInfo?.canton})`);
    }

    // Vérifier le salaire
    if (storage.incomeData?.mainEmployment?.grossSalary !== calculation.incomeData?.mainEmployment?.grossSalary) {
      issues.push(`Salaire différent: Storage(${storage.incomeData?.mainEmployment?.grossSalary}) vs Calcul(${calculation.incomeData?.mainEmployment?.grossSalary})`);
    }

    // Vérifier les déductions pilier 3a
    if (storage.deductions?.savingsContributions?.pillar3a !== calculation.deductions?.savingsContributions?.pillar3a) {
      issues.push(`Pilier 3a différent: Storage(${storage.deductions?.savingsContributions?.pillar3a}) vs Calcul(${calculation.deductions?.savingsContributions?.pillar3a})`);
    }

    // Vérifier la commune
    if (storage.personalInfo?.commune !== calculation.personalInfo?.municipality) {
      issues.push(`Commune différente: Storage(${storage.personalInfo?.commune}) vs Calcul(${calculation.personalInfo?.municipality})`);
    }

    setSyncIssues(issues);
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  const getSyncStatus = () => {
    if (!debugData) return { status: 'loading', color: 'gray' };
    if (syncIssues.length === 0) return { status: 'synced', color: 'green' };
    return { status: 'issues', color: 'red' };
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '❌ null/undefined';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const compareField = (label: string, storageValue: any, calculationValue: any) => {
    const isSync = storageValue === calculationValue;
    return (
      <div className={`p-2 border rounded ${isSync ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center gap-2 mb-2">
          {isSync ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-sm space-y-1">
          <div><strong>Storage:</strong> {formatValue(storageValue)}</div>
          <div><strong>Calcul:</strong> {formatValue(calculationValue)}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Panneau de Debug - Synchronisation des Données
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getSyncStatus().color === 'green' ? 'default' : 'destructive'}>
              {getSyncStatus().status === 'synced' ? 'Synchronisé' : 
               getSyncStatus().status === 'issues' ? `${syncIssues.length} problème(s)` : 'Chargement...'}
            </Badge>
            <Button onClick={fetchDebugData} disabled={isLoading} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {syncIssues.length > 0 && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Problèmes de synchronisation détectés :</strong>
              <ul className="mt-2 space-y-1">
                {syncIssues.map((issue, index) => (
                  <li key={index} className="text-sm">• {issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {debugData && (
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comparison">Comparaison</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="calculation">Calcul</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-4">
              <h3 className="text-lg font-semibold">Comparaison des données critiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compareField(
                  'Canton',
                  debugData.storageProfile?.personalInfo?.canton,
                  debugData.calculationProfile?.personalInfo?.canton
                )}
                {compareField(
                  'Salaire brut',
                  debugData.storageProfile?.incomeData?.mainEmployment?.grossSalary,
                  debugData.calculationProfile?.incomeData?.mainEmployment?.grossSalary
                )}
                {compareField(
                  'Pilier 3a',
                  debugData.storageProfile?.deductions?.savingsContributions?.pillar3a,
                  debugData.calculationProfile?.deductions?.savingsContributions?.pillar3a
                )}
                {compareField(
                  'Commune',
                  debugData.storageProfile?.personalInfo?.commune,
                  debugData.calculationProfile?.personalInfo?.municipality
                )}
                {compareField(
                  'Nombre d\'enfants',
                  debugData.storageProfile?.personalInfo?.numberOfChildren,
                  debugData.calculationProfile?.personalInfo?.numberOfChildren
                )}
                {compareField(
                  'Situation familiale',
                  debugData.storageProfile?.personalInfo?.civilStatus,
                  debugData.calculationProfile?.personalInfo?.civilStatus
                )}
              </div>
            </TabsContent>

            <TabsContent value="storage">
              <h3 className="text-lg font-semibold">Données dans le Storage</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(debugData.storageProfile, null, 2)}
              </pre>
            </TabsContent>

            <TabsContent value="calculation">
              <h3 className="text-lg font-semibold">Données utilisées pour le calcul</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(debugData.calculationProfile, null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Dernière mise à jour : {debugData?.timestamp ? new Date(debugData.timestamp).toLocaleString() : 'Jamais'}
        </div>
      </CardContent>
    </Card>
  );
}