'use client';

import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/lib/contexts/SupabaseAuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OnboardingChatbot from '@/components/onboarding/OnboardingChatbot';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useSupabaseAuth();

  const handleOnboardingComplete = async (data: any, scoring: string) => {
    // Rediriger directement vers le dashboard après sauvegarde
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Configuration de votre profil
            </h1>
            <p className="text-gray-600">
              Notre IA va vous poser quelques questions pour créer votre profil financier personnalisé
            </p>
          </div>

          <Card className="border-none shadow-xl">
            <OnboardingChatbot onComplete={handleOnboardingComplete} />
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
