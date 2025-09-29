/**
 * Détecteur de mode et bannières d'état
 * Affiche des informations sur le mode de fonctionnement
 */

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== 'false' || 
         process.env.NODE_ENV !== 'production' ||
         !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') ||
         process.env.OPENAI_API_KEY?.includes('demo');
}

export function getEnvironmentStatus() {
  const demoMode = isDemoMode();
  
  return {
    isDemoMode: demoMode,
    mode: demoMode ? 'DÉMONSTRATION' : 'PRODUCTION',
    database: demoMode ? 'Stockage en mémoire (temporaire)' : 'Supabase (persistant)',
    ai: demoMode ? 'Réponses simulées' : 'OpenAI GPT-4',
    security: demoMode ? 'Données mockées' : 'Chiffrement RGPD',
    calculations: demoMode ? 'Formules simplifiées' : 'Formules officielles AFC',
    status: demoMode ? '⚠️ Mode développement' : '✅ Prêt pour production',
    color: demoMode ? 'orange' : 'green'
  };
}

export function getProductionReadiness() {
  const checks = [
    {
      name: 'Base de données',
      passed: !!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co'),
      current: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configuré' : 'Non configuré',
      required: 'URL Supabase valide'
    },
    {
      name: 'Intelligence artificielle',
      passed: !!process.env.OPENAI_API_KEY && 
              !process.env.OPENAI_API_KEY.includes('demo') && 
              !process.env.OPENAI_API_KEY.includes('your-real-openai-api-key-here') &&
              process.env.OPENAI_API_KEY.startsWith('sk-'),
      current: process.env.OPENAI_API_KEY?.startsWith('sk-') ? 'Clé OpenAI valide' : 
               process.env.OPENAI_API_KEY ? 'Clé présente mais invalide' : 'Non configuré',
      required: 'Clé API OpenAI ou Anthropic'
    },
    {
      name: 'Chiffrement RGPD',
      passed: !!process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length >= 32,
      current: process.env.ENCRYPTION_KEY ? `${process.env.ENCRYPTION_KEY.length} caractères` : 'Non configuré',
      required: 'Clé 256 bits minimum'
    },
    {
      name: 'Mode production',
      passed: process.env.DEMO_MODE === 'false',
      current: `DEMO_MODE=${process.env.DEMO_MODE}, NODE_ENV=${process.env.NODE_ENV}`,
      required: 'DEMO_MODE=false (NODE_ENV peut rester development en local)'
    },
    {
      name: 'Authentification',
      passed: !!process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET !== 'demo-secret-key-for-development',
      current: process.env.NEXTAUTH_SECRET ? 'Secret configuré' : 'Non configuré',
      required: 'Secret NextAuth sécurisé'
    }
  ];
  
  const passedChecks = checks.filter(check => check.passed).length;
  const percentage = Math.round((passedChecks / checks.length) * 100);
  
  return {
    checks,
    passedChecks,
    totalChecks: checks.length,
    percentage,
    isReady: percentage === 100,
    status: percentage === 100 ? 'PRÊT' : 
            percentage >= 80 ? 'PRESQUE PRÊT' : 
            percentage >= 50 ? 'EN COURS' : 'NON CONFIGURÉ'
  };
}