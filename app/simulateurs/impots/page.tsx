'use client';

import { useState } from 'react';
import SimulatorLayout from '@/components/simulateurs/shared/SimulatorLayout';
import TaxSimulatorForm from '@/components/simulateurs/forms/TaxSimulatorForm';
import TaxResults from '@/components/simulateurs/results/TaxResults';
import { ImpotsParameters, ImpotsResults } from '@/types/simulators';
import { Calculator } from 'lucide-react';

type SimulatorStep = 'form' | 'results';

export default function TaxSimulatorPage() {
  const [currentStep, setCurrentStep] = useState<SimulatorStep>('form');
  const [formData, setFormData] = useState<Partial<ImpotsParameters>>({});
  const [results, setResults] = useState<ImpotsResults | null>(null);

  const handleFormDataChange = (data: Partial<ImpotsParameters>) => {
    setFormData(data);
  };

  const handleCalculate = (calculationResults: ImpotsResults) => {
    setResults(calculationResults);
    setCurrentStep('results');
  };

  const handleNewCalculation = () => {
    setCurrentStep('form');
    setResults(null);
  };

  const handleOptimize = (suggestion: any) => {
    // Logique pour appliquer une suggestion d'optimisation
    console.log('Optimisation sélectionnée:', suggestion);
    // Ici on pourrait mettre à jour les données du formulaire et recalculer
  };

  const canProceed = formData.revenuBrutAnnuel && 
                   formData.canton && 
                   formData.situationFamiliale &&
                   formData.revenuBrutAnnuel > 0;

  return (
    <SimulatorLayout
      title="Simulateur d'impôts suisse"
      description="Calculez vos impôts fédéraux, cantonaux et communaux"
      icon={<Calculator className="w-5 h-5" />}
      currentStep={currentStep === 'form' ? 1 : 2}
      totalSteps={2}
      canProceed={!!canProceed}
      showResults={currentStep === 'results'}
      onSave={() => {
        // Logique de sauvegarde
        console.log('Sauvegarde de la simulation');
      }}
    >
      {currentStep === 'form' && (
        <TaxSimulatorForm
          onCalculate={handleCalculate}
          onDataChange={handleFormDataChange}
          initialData={formData}
        />
      )}

      {currentStep === 'results' && results && (
        <TaxResults
          results={results}
          onOptimize={handleOptimize}
          onNewCalculation={handleNewCalculation}
        />
      )}
    </SimulatorLayout>
  );
}