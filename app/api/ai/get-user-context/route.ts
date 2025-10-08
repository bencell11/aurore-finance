import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * API Route sécurisée pour récupérer le contexte utilisateur pour l'assistant IA
 *
 * Cette route:
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Récupère toutes les données nécessaires (profil, finances, objectifs)
 * 3. Retourne les données déchiffrées pour utilisation par l'IA
 * 4. RLS Supabase garantit que l'utilisateur ne peut voir que ses propres données
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer le profil utilisateur
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Récupérer le profil financier
    const { data: financialProfile, error: financialError } = await supabase
      .from('financial_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // Récupérer les objectifs financiers
    const { data: goals, error: goalsError } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('statut', 'actif')
      .order('priorite', { ascending: false });

    // Récupérer les actions récentes (pour contexte)
    const { data: recentActions, error: actionsError } = await supabase
      .from('user_actions')
      .select('type, details, resultat, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Construire le contexte pour l'IA
    const aiContext = {
      user: {
        id: user.id,
        email: userProfile?.email || user.email,
        nom: userProfile?.nom,
        prenom: userProfile?.prenom,
        age: userProfile?.age,
        situationFamiliale: userProfile?.situation_familiale,
        canton: userProfile?.canton
      },
      financial: financialProfile ? {
        revenuBrutAnnuel: financialProfile.revenu_brut_annuel,
        autresRevenus: financialProfile.autres_revenus,
        chargesLogement: financialProfile.charges_logement,
        chargesAssurances: financialProfile.charges_assurances,
        autresCharges: financialProfile.autres_charges,
        objectifsFinanciers: financialProfile.objectifs_financiers,
        toleranceRisque: financialProfile.tolerance_risque,
        horizonInvestissement: financialProfile.horizon_investissement,
        niveauConnaissances: financialProfile.niveau_connaissances,
        // Calculs dérivés
        revenuTotal: (financialProfile.revenu_brut_annuel || 0) + (financialProfile.autres_revenus || 0),
        chargesTotal: (financialProfile.charges_logement || 0) + (financialProfile.charges_assurances || 0) + (financialProfile.autres_charges || 0),
        capaciteEpargneMensuelle: ((financialProfile.revenu_brut_annuel || 0) + (financialProfile.autres_revenus || 0)) / 12 - ((financialProfile.charges_logement || 0) + (financialProfile.charges_assurances || 0) + (financialProfile.autres_charges || 0))
      } : null,
      goals: goals?.map(goal => ({
        id: goal.id,
        titre: goal.titre,
        description: goal.description,
        type: goal.type,
        montantCible: goal.montant_cible,
        montantActuel: goal.montant_actuel,
        progression: (goal.montant_actuel / goal.montant_cible) * 100,
        dateEcheance: goal.date_echeance,
        priorite: goal.priorite
      })) || [],
      recentActivity: recentActions || [],
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: aiContext
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération du contexte utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}
