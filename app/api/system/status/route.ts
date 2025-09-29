import { NextRequest, NextResponse } from 'next/server';
import { getEnvironmentStatus, getProductionReadiness } from '@/lib/utils/demo-detector';

/**
 * API pour récupérer le statut du système et la préparation à la production
 */
export async function GET(request: NextRequest) {
  try {
    const status = getEnvironmentStatus();
    const readiness = getProductionReadiness();
    
    // Ajouter des informations système
    const systemInfo = {
      version: '1.0.0',
      lastDeployment: new Date().toISOString(),
      buildTime: process.env.BUILD_TIME || 'Development',
      region: process.env.VERCEL_REGION || 'Local',
      nodeVersion: process.version,
      nextVersion: '15.5.3'
    };
    
    // Informations de configuration (sans exposer les secrets)
    const configInfo = {
      hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasEncryption: !!process.env.ENCRYPTION_KEY,
      hasAuth: !!process.env.NEXTAUTH_SECRET,
      hasEmail: !!process.env.SMTP_HOST,
      supabaseConfigured: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || false,
      openaiConfigured: process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo') ? true : false
    };
    
    // Conseils d'amélioration basés sur la configuration actuelle
    const recommendations = [];
    
    if (!configInfo.supabaseConfigured) {
      recommendations.push({
        priority: 'high',
        title: 'Configurer Supabase',
        description: 'Remplacer le stockage en mémoire par une vraie base de données',
        action: 'Créer un projet sur supabase.com et configurer les variables d\'environnement'
      });
    }
    
    if (!configInfo.openaiConfigured) {
      recommendations.push({
        priority: 'high',
        title: 'Configurer OpenAI',
        description: 'Activer l\'assistant IA intelligent',
        action: 'Obtenir une clé API sur platform.openai.com'
      });
    }
    
    if (status.isDemoMode) {
      recommendations.push({
        priority: 'medium',
        title: 'Désactiver le mode démo',
        description: 'Passer en mode production pour des données réelles',
        action: 'Définir DEMO_MODE=false dans .env.local'
      });
    }
    
    if (!configInfo.hasEmail) {
      recommendations.push({
        priority: 'low',
        title: 'Configurer l\'email',
        description: 'Permettre l\'envoi de déclarations par email',
        action: 'Configurer SMTP dans les variables d\'environnement'
      });
    }
    
    const response = {
      status,
      readiness,
      system: systemInfo,
      config: configInfo,
      recommendations,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('[System Status] Erreur:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération du statut système',
        status: {
          isDemoMode: true,
          mode: 'DÉMONSTRATION',
          database: 'Stockage en mémoire',
          ai: 'Réponses simulées',
          security: 'Données mockées',
          calculations: 'Formules simplifiées',
          status: '⚠️ Mode développement',
          color: 'orange'
        }
      },
      { status: 200 } // 200 même en cas d'erreur pour ne pas casser l'interface
    );
  }
}