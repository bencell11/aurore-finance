export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          nom: string
          prenom: string
          age: number | null
          situation_familiale: 'celibataire' | 'marie' | 'divorce' | 'veuf' | 'concubinage' | null
          canton: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          nom: string
          prenom: string
          age?: number | null
          situation_familiale?: 'celibataire' | 'marie' | 'divorce' | 'veuf' | 'concubinage' | null
          canton?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          nom?: string
          prenom?: string
          age?: number | null
          situation_familiale?: 'celibataire' | 'marie' | 'divorce' | 'veuf' | 'concubinage' | null
          canton?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      financial_profiles: {
        Row: {
          id: string
          user_id: string
          revenu_brut_annuel: number | null
          autres_revenus: number | null
          charges_logement: number | null
          charges_assurances: number | null
          autres_charges: number | null
          objectifs_financiers: string[] | null
          tolerance_risque: 'conservateur' | 'moderee' | 'dynamique' | 'agressif' | null
          horizon_investissement: string | null
          niveau_connaissances: 'debutant' | 'intermediaire' | 'avance' | 'expert' | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          revenu_brut_annuel?: number | null
          autres_revenus?: number | null
          charges_logement?: number | null
          charges_assurances?: number | null
          autres_charges?: number | null
          objectifs_financiers?: string[] | null
          tolerance_risque?: 'conservateur' | 'moderee' | 'dynamique' | 'agressif' | null
          horizon_investissement?: string | null
          niveau_connaissances?: 'debutant' | 'intermediaire' | 'avance' | 'expert' | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          revenu_brut_annuel?: number | null
          autres_revenus?: number | null
          charges_logement?: number | null
          charges_assurances?: number | null
          autres_charges?: number | null
          objectifs_financiers?: string[] | null
          tolerance_risque?: 'conservateur' | 'moderee' | 'dynamique' | 'agressif' | null
          horizon_investissement?: string | null
          niveau_connaissances?: 'debutant' | 'intermediaire' | 'avance' | 'expert' | null
          updated_at?: string
        }
      }
      financial_goals: {
        Row: {
          id: string
          user_id: string
          titre: string
          description: string | null
          type: 'epargne' | 'investissement' | 'immobilier' | 'retraite' | 'education' | 'autre' | null
          montant_cible: number
          montant_actuel: number
          date_echeance: string | null
          statut: 'actif' | 'atteint' | 'abandonne' | 'en_pause'
          priorite: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          titre: string
          description?: string | null
          type?: 'epargne' | 'investissement' | 'immobilier' | 'retraite' | 'education' | 'autre' | null
          montant_cible: number
          montant_actuel?: number
          date_echeance?: string | null
          statut?: 'actif' | 'atteint' | 'abandonne' | 'en_pause'
          priorite?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          titre?: string
          description?: string | null
          type?: 'epargne' | 'investissement' | 'immobilier' | 'retraite' | 'education' | 'autre' | null
          montant_cible?: number
          montant_actuel?: number
          date_echeance?: string | null
          statut?: 'actif' | 'atteint' | 'abandonne' | 'en_pause'
          priorite?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_actions: {
        Row: {
          id: string
          user_id: string
          type: string
          details: Json | null
          resultat: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          details?: Json | null
          resultat?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          details?: Json | null
          resultat?: string | null
          created_at?: string
        }
      }
      notification_settings: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          push_notifications: boolean
          rappels_objectifs: boolean
          frequence_rapports: 'hebdomadaire' | 'mensuel' | 'trimestriel'
          alertes_opportunites: boolean
          alertes_risques: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          push_notifications?: boolean
          rappels_objectifs?: boolean
          frequence_rapports?: 'hebdomadaire' | 'mensuel' | 'trimestriel'
          alertes_opportunites?: boolean
          alertes_risques?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          rappels_objectifs?: boolean
          frequence_rapports?: 'hebdomadaire' | 'mensuel' | 'trimestriel'
          alertes_opportunites?: boolean
          alertes_risques?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
