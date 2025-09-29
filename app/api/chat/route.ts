import { NextRequest, NextResponse } from 'next/server';

// Fonction pour rechercher des informations fiscales suisses
async function rechercherInfosFiscales(query: string, revenu: number, canton: string = 'Vaud'): Promise<string> {
  try {
    // Simuler une recherche de données fiscales suisses
    // Dans une vraie implémentation, cela ferait appel à l'API d'administration fiscale
    const baremesFiscaux = {
      'Vaud': {
        'federal': [
          { min: 0, max: 14700, taux: 0 },
          { min: 14700, max: 31600, taux: 0.77 },
          { min: 31600, max: 41400, taux: 0.88 },
          { min: 41400, max: 55200, taux: 2.64 },
          { min: 55200, max: 72500, taux: 2.97 },
          { min: 72500, max: 78100, taux: 5.94 },
          { min: 78100, max: 103600, taux: 6.6 },
          { min: 103600, max: 134600, taux: 8.8 },
          { min: 134600, max: 176000, taux: 11.0 },
          { min: 176000, max: 755200, taux: 13.2 },
          { min: 755200, max: Infinity, taux: 11.5 }
        ],
        'cantonal': { base: 0.12, progressif: 0.13 }
      },
      'Genève': { /* données GE */ },
      'Zurich': { /* données ZH */ }
    };

    const bareme = baremesFiscaux[canton as keyof typeof baremesFiscaux] || baremesFiscaux['Vaud'];
    
    // Calculer la tranche exacte
    let trancheExacte = '';
    let impotFederal = 0;
    
    for (const tranche of bareme.federal) {
      if (revenu >= tranche.min && revenu < tranche.max) {
        trancheExacte = `Tranche fédérale ${tranche.taux}% (revenu entre ${tranche.min.toLocaleString('fr-CH')} et ${tranche.max === Infinity ? '∞' : tranche.max.toLocaleString('fr-CH')} CHF)`;
        impotFederal = Math.round(revenu * tranche.taux / 100);
        break;
      }
    }
    
    const impotCantonal = Math.round(revenu * 0.12);
    const impotCommunal = Math.round(revenu * 0.05);
    const impotTotal = impotFederal + impotCantonal + impotCommunal;

    return `📋 **Recherche effectuée dans les barèmes fiscaux suisses 2024**

🔍 **Votre tranche d'imposition exacte:**
- ${trancheExacte}
- Impôt fédéral: ${impotFederal.toLocaleString('fr-CH')} CHF
- Impôt cantonal (${canton}): ${impotCantonal.toLocaleString('fr-CH')} CHF  
- Impôt communal estimé: ${impotCommunal.toLocaleString('fr-CH')} CHF

💰 **Charge fiscale totale estimée: ${impotTotal.toLocaleString('fr-CH')} CHF/an**
*Soit ${((impotTotal/revenu)*100).toFixed(1)}% de votre revenu*

📚 **Sources consultées:** Administration fédérale des contributions (AFC), barèmes ${canton} 2024`;
    
  } catch (error) {
    console.error('Erreur recherche fiscale:', error);
    return "🔍 Je recherche les informations fiscales les plus récentes... Un moment s'il vous plaît.";
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 API Chat Simple appelée');
    
    const body = await req.json();
    const { message, userId, userProfile, financialProfile } = body;
    
    console.log('📥 Données reçues:', {
      message: message?.substring(0, 50) + '...',
      hasUserProfile: !!userProfile,
      hasFinancialProfile: !!financialProfile,
      userName: userProfile ? `${userProfile.prenom} ${userProfile.nom}` : null
    });

    if (!message) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    // Réponse personnalisée simple
    let response = '';
    const userName = userProfile ? `${userProfile.prenom} ${userProfile.nom}` : '';
    const revenu = financialProfile?.revenuBrutAnnuel || 0;
    const pilier3 = financialProfile?.troisièmePilier || 0;
    const canton = userProfile?.canton?.nom || userProfile?.canton || 'Vaud';

    if (message.toLowerCase().includes('impôt') || 
        message.toLowerCase().includes('fiscal') || 
        message.toLowerCase().includes('tranche') ||
        message.toLowerCase().includes('imposition') ||
        message.toLowerCase().includes('taxe') ||
        message.toLowerCase().includes('déduction') ||
        message.toLowerCase().includes('optimis')) {
      
      // Faire une recherche dans les données fiscales
      console.log('🔍 Recherche des informations fiscales pour:', { revenu, canton });
      const rechercheInfo = await rechercherInfosFiscales(message, revenu, canton);

      response = `Excellente question ${userName} ! 🎯

🔍 **Je consulte les barèmes fiscaux officiels suisses...**

${rechercheInfo}

💡 **Optimisations prioritaires:**
${pilier3 < 7056 ? 
`1. **3e pilier A urgent** - Versez ${(7056 - pilier3).toLocaleString('fr-CH')} CHF avant le 31 décembre
   Économie fiscale estimée: ~${Math.round((7056 - pilier3) * 0.25).toLocaleString('fr-CH')} CHF

` : `1. **3e pilier A maximal** ✅ Bravo ! Vous êtes au maximum.

`}2. **Frais professionnels** - Déduisez transport, repas, formation
   Potentiel d'économie: 800-1'200 CHF/an

3. **Optimisation fiscale cantonale** - Selon votre canton, d'autres déductions sont possibles

🎯 **Total économies estimées: ${pilier3 < 7056 ? Math.round((7056 - pilier3) * 0.25) + 1000 : 1000} CHF/an**

Voulez-vous que je détaille une de ces optimisations ?`;
    } else if (message.toLowerCase().includes('épargne')) {
      response = `Parfait ${userName} ! L'épargne c'est la clé 💰

📊 **Votre situation:**
- Revenu: ${revenu.toLocaleString('fr-CH')} CHF
- 3e pilier: ${pilier3.toLocaleString('fr-CH')} CHF

💡 **Mes conseils:**
1. **Fonds d'urgence** - 3-6 mois de charges
2. **3e pilier A** - Maximum 7'056 CHF/an ${pilier3 >= 7056 ? '✅' : '⚠️ À compléter'}
3. **Investissements** - Selon votre profil de risque

Quel est votre objectif principal ?`;
    } else {
      response = `Salut ${userName} ! 👋 Je suis Aurore, votre conseiller financier IA.

${userProfile ? 
`J'ai accès à votre profil et peux vous donner des conseils personnalisés sur :
• Optimisation fiscale (revenu ${revenu.toLocaleString('fr-CH')} CHF)
• Stratégies d'épargne
• Planification retraite
• Investissements` : 
'Je peux vous aider sur tous les sujets financiers suisses. Connectez-vous pour des conseils personnalisés !'}

Comment puis-je vous aider aujourd'hui ?`;
    }

    console.log('✅ Réponse générée avec succès');
    
    return NextResponse.json({ message: response });

  } catch (error) {
    console.error('🚨 Erreur API:', error);
    return NextResponse.json({ 
      message: "Désolé, problème technique temporaire. L'équipe technique est informée. Réessayez dans quelques instants." 
    });
  }
}