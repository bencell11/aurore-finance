import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Types pour les tables Supabase
export interface UserProfile {
  id: string;
  user_id: string;
  email?: string;

  // Informations personnelles
  nom?: string;
  prenom?: string;
  date_naissance?: string;

  // Informations fiscales
  revenu_annuel?: number;
  revenu_mensuel?: number;
  situation_familiale?: 'celibataire' | 'marie' | 'divorce' | 'veuf' | 'concubinage';
  nombre_enfants?: number;

  // Localisation
  adresse?: string;
  npa?: string;
  ville?: string;
  canton?: string;

  // Informations professionnelles
  statut_professionnel?: 'salarie' | 'independant' | 'retraite' | 'etudiant' | 'sans_emploi';
  employeur?: string;
  profession?: string;

  // Informations bancaires
  iban?: string;
  banque?: string;

  // Informations immobilières
  statut_logement?: 'locataire' | 'proprietaire' | 'heberge';
  loyer_mensuel?: number;

  created_at?: string;
  updated_at?: string;
  last_synced_at?: string;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  type: 'epargne' | 'investissement' | 'achat_immobilier' | 'retraite' | 'education';
  nom: string;
  description?: string;
  montant_cible?: number;
  montant_actuel?: number;
  date_debut?: string;
  date_cible?: string;
  priorite?: number;
  statut?: 'en_cours' | 'complete' | 'abandonne' | 'en_pause';
  created_at?: string;
  updated_at?: string;
}

export interface RealEstateFavorite {
  id: string;
  user_id: string;
  property_id: string;
  property_data: any;
  notes?: string;
  tags?: string[];
  created_at?: string;
}

export interface RealEstateAlert {
  id: string;
  user_id: string;
  nom: string;
  criteria: any;
  frequency?: 'daily' | 'weekly' | 'instant';
  active?: boolean;
  last_checked_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GeneratedDocument {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  template_used?: string;
  metadata?: any;
  created_at?: string;
}

export interface MortgageSimulation {
  id: string;
  user_id: string;
  property_price: number;
  down_payment: number;
  interest_rate: number;
  duration: number;
  simulation_result: any;
  nom?: string;
  notes?: string;
  created_at?: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  type: 'tax_assistant' | 'document_generator' | 'real_estate';
  messages: any[];
  context?: any;
  created_at?: string;
  updated_at?: string;
}