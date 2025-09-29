'use client';

import { useState } from 'react';
import SimulatorLayout from '@/components/simulateurs/shared/SimulatorLayout';
import RealEstateForm from '@/components/simulateurs/forms/RealEstateForm';
import { ImmobilierParameters, ImmobilierResults } from '@/types/simulators';
import { Home } from 'lucide-react';

type SimulatorStep = 'form' | 'results';

export default function RealEstateSimulatorPage() {
  const [currentStep, setCurrentStep] = useState<SimulatorStep>('form');
  const [formData, setFormData] = useState<Partial<ImmobilierParameters>>({});
  const [results, setResults] = useState<ImmobilierResults | null>(null);

  const handleFormDataChange = (data: Partial<ImmobilierParameters>) => {
    setFormData(data);
  };

  const handleCalculate = (calculationResults: ImmobilierResults) => {
    setResults(calculationResults);
    setCurrentStep('results');
  };

  const handleNewCalculation = () => {
    setCurrentStep('form');
    setResults(null);
  };

  const canProceed = formData.prixAchat && 
                   formData.revenuNetMensuel && 
                   formData.fondsPropresPrevus &&
                   formData.surfaceHabitable &&
                   formData.prixAchat > 0;

  return (
    <SimulatorLayout
      title="Simulateur immobilier suisse"
      description="Analysez votre capacité d'achat et optimisez votre financement"
      icon={<Home className="w-5 h-5" />}
      currentStep={currentStep === 'form' ? 1 : 2}
      totalSteps={2}
      canProceed={!!canProceed}
      showResults={currentStep === 'results'}
      onSave={() => {
        console.log('Sauvegarde de la simulation immobilière');
      }}
    >
      {currentStep === 'form' && (
        <RealEstateForm
          onCalculate={handleCalculate}
          onDataChange={handleFormDataChange}
          initialData={formData}
        />
      )}

      {currentStep === 'results' && results && (
        <div className="space-y-6">
          {/* TODO: Créer le composant RealEstateResults */}
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Résultats en cours de développement</h2>
            <p className="text-gray-600 mb-6">
              L'interface des résultats sera disponible dans la prochaine version.
            </p>
            <button 
              onClick={handleNewCalculation}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Nouvelle simulation
            </button>
          </div>
          
          {/* Debug - Afficher les résultats bruts */}
          <details className="mt-8">
            <summary className="cursor-pointer font-medium">Voir les résultats de calcul (debug)</summary>
            <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </SimulatorLayout>
  );
}