'use client';

import { useState } from 'react';
import SimulatorLayout from '@/components/simulateurs/shared/SimulatorLayout';
import InvestmentForm from '@/components/simulateurs/forms/InvestmentForm';
import InvestmentResults from '@/components/simulateurs/results/InvestmentResults';
import { InvestissementParameters, InvestissementResults } from '@/types/simulators';
import { TrendingUp } from 'lucide-react';

type SimulatorStep = 'form' | 'results';

export default function InvestmentSimulatorPage() {
  const [currentStep, setCurrentStep] = useState<SimulatorStep>('form');
  const [formData, setFormData] = useState<Partial<InvestissementParameters>>({});
  const [results, setResults] = useState<InvestissementResults | null>(null);

  const handleFormDataChange = (data: Partial<InvestissementParameters>) => {
    setFormData(data);
  };

  const handleCalculate = (calculationResults: InvestissementResults) => {
    setResults(calculationResults);
    setCurrentStep('results');
  };

  const handleNewCalculation = () => {
    setCurrentStep('form');
    setResults(null);
  };

  const canProceed = formData.montantInitial && 
                   formData.versementMensuel !== undefined && 
                   formData.horizonPlacement && 
                   formData.typesProduits && 
                   formData.typesProduits.length > 0 &&
                   formData.marchesGeographiques &&
                   formData.marchesGeographiques.length > 0;

  return (
    <SimulatorLayout
      title="Simulateur d'investissement suisse"
      description="Optimisez votre stratégie selon votre profil de risque"
      icon={<TrendingUp className="w-5 h-5" />}
      currentStep={currentStep === 'form' ? 1 : 2}
      totalSteps={2}
      canProceed={!!canProceed}
      showResults={currentStep === 'results'}
      onSave={() => {
        console.log('Sauvegarde de la simulation d\'investissement');
      }}
    >
      {currentStep === 'form' && (
        <InvestmentForm
          onCalculate={handleCalculate}
          onDataChange={handleFormDataChange}
          initialData={formData}
        />
      )}

      {currentStep === 'results' && results && (
        <InvestmentResults 
          results={results}
          onNewCalculation={handleNewCalculation}
        />
      )}
    </SimulatorLayout>
  );
}