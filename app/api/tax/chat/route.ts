import { NextRequest, NextResponse } from 'next/server';
import { SwissTaxContextService } from '@/lib/services/tax/swiss-tax-context.service';
import { GDPRAnonymizationService } from '@/lib/services/security/gdpr-anonymization.service';

/**
 * API Chat avec contexte fiscal suisse complet
 * Version mock enrichie avec vraies données fiscales
 */

const mockResponses = {
  welcome: `🏦 **Bienvenue dans votre Assistant Fiscal Intelligent !** (MODE DEMO)

Je suis votre assistant fiscal spécialisé pour la Suisse. Bien que je fonctionne actuellement en mode démonstration, je peux vous aider à comprendre comment optimiser votre situation fiscale.

**Ce que je peux faire pour vous :**
• 📋 Vous guider dans la collecte de vos données fiscales
• 🧮 Calculer vos impôts selon votre canton
• 💡 Identifier des optimisations fiscales
• 📄 Vous expliquer les déductions possibles
• 🎯 Répondre à vos questions sur la fiscalité suisse

**Questions fréquentes à essayer :**
• "Comment optimiser mon 3e pilier ?"
• "Quels sont les frais professionnels déductibles ?"
• "Calcule mes impôts pour Genève"
• "Comment fonctionnent les rachats LPP ?"

Posez-moi votre question fiscal !`,

  pillar3a: `💰 **Le 3e pilier A - Votre meilleure optimisation fiscale !**

**Montants déductibles 2024 :**
• Salariés avec LPP : **7'056 CHF maximum**
• Indépendants sans LPP : **35'280 CHF maximum**

**Économie fiscale estimée :**
Pour un revenu de 80'000 CHF à Genève :
• Versement de 7'056 CHF → Économie d'environ **1'800 CHF d'impôts**
• Soit un rendement immédiat de 25% !

**Avantages supplémentaires :**
• 🏠 Retrait anticipé possible pour l'achat d'un logement
• 💰 Capital disponible à la retraite (dès 60 ans)
• 📈 Placement défiscalisé qui fructifie

**Action recommandée :**
Maximisez vos versements avant le 31 décembre pour bénéficier de la déduction cette année !

Avez-vous d'autres questions sur le 3e pilier ?`,

  professional_expenses: `🚗 **Frais professionnels déductibles en Suisse**

**Principales déductions possibles :**

**Transport domicile-travail :**
• 🚌 Transports publics : montant exact des abonnements
• 🚗 Voiture privée : 0.70 CHF/km (si moins cher que transports publics)
• 🚲 Vélo/vélo électrique : forfait selon distance

**Repas professionnels :**
• 🍽️ Repas pris à l'extérieur : 15 CHF/jour maximum
• ☕ Collations : incluses dans le montant repas

**Formation continue :**
• 📚 Cours liés à votre profession : déductible intégralement
• 🎓 Formation pour changement de métier : souvent déductible

**Autres frais :**
• 👔 Habits de travail spécialisés
• 🏠 Bureau à domicile (si régulier)
• 📱 Téléphone/internet professionnel (quote-part)

**Conseil pratique :**
Conservez TOUS vos justificatifs ! Un tableur mensuel vous aidera à ne rien oublier.

Voulez-vous que je vous aide à calculer vos frais spécifiques ?`,

  cantonal_differences: `🏛️ **Différences fiscales entre cantons suisses**

**Cantons les plus avantageux fiscalement :**
• 🥇 **Zoug (ZG)** : taux effectif ~8-12%
• 🥈 **Schwyz (SZ)** : taux effectif ~9-13%  
• 🥉 **Nidwald (NW)** : taux effectif ~10-14%

**Cantons avec fiscalité modérée :**
• **Zurich (ZH)** : taux effectif ~13-18%
• **Berne (BE)** : taux effectif ~14-19%
• **Lucerne (LU)** : taux effectif ~12-16%

**Cantons avec fiscalité plus élevée :**
• **Genève (GE)** : taux effectif ~16-22%
• **Vaud (VD)** : taux effectif ~15-21%
• **Jura (JU)** : taux effectif ~17-23%

**Important :** Ces taux varient selon :
• 💰 Votre niveau de revenu
• 👨‍👩‍👧‍👦 Votre situation familiale
• 🏘️ Votre commune de résidence

**Facteurs à considérer au-delà des impôts :**
• Coût de la vie local
• Salaires pratiqués
• Qualité de vie
• Proximité du lieu de travail

Dans quel canton résidez-vous ? Je peux vous donner des conseils spécifiques !`,

  lpp_buyback: `🏦 **Rachats de prévoyance (2e pilier LPP)**

**Principe :**
Les rachats LPP permettent de combler les lacunes de votre caisse de pension tout en bénéficiant d'une déduction fiscale intégrale.

**Avantages fiscaux :**
• ✅ **100% déductible** du revenu imposable
• 💰 Économie immédiate : 25-40% du montant selon votre taux marginal
• 📈 Capital qui fructifie pour votre retraite

**Qui peut racheter ?**
• Salariés avec lacunes de cotisation
• Personnes ayant augmenté leur salaire
• Expatriés revenus en Suisse
• Personnes proches de la retraite

**Stratégie optimale :**
• 📅 Échelonner les rachats sur plusieurs années
• ⏰ Racheter 3 ans avant la retraite minimum
• 🔄 Racheter avant retrait en capital

**Exemple concret :**
Rachat de 50'000 CHF avec revenu à Zurich :
→ Économie fiscale : ~15'000 CHF
→ Coût réel : 35'000 CHF

**Action recommandée :**
Demandez votre **certificat de prévoyance** à votre employeur pour connaître vos possibilités de rachat exactes.

Souhaitez-vous que je vous explique la stratégie de retrait optimal ?`,

  default: `🤖 **Assistant Fiscal Suisse** (MODE DEMO)

Je fonctionne actuellement en mode démonstration. Voici quelques questions que vous pouvez me poser :

**Optimisations fiscales :**
• "Comment optimiser mon 3e pilier ?"
• "Que sont les rachats LPP ?"
• "Frais professionnels déductibles"

**Calculs fiscaux :**
• "Différences entre cantons"
• "Calcule mes impôts"
• "Taux d'imposition en Suisse"

**Déductions :**
• "Assurance maladie déductible"
• "Dons aux œuvres de bienfaisance"
• "Frais de garde d'enfants"

**Questions pratiques :**
• "Échéances fiscales importantes"
• "Documents nécessaires"
• "Comment remplir sa déclaration"

Tapez votre question ou choisissez un sujet qui vous intéresse !`
};

/**
 * Génère une réponse contextuelle basée sur le profil utilisateur
 */
function generateContextualResponse(message: string, profile: any, taxContext: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Questions spécifiques au profil
  if (lowerMessage.includes('mon canton') || lowerMessage.includes('ma situation')) {
    const canton = profile?.personalInfo?.canton;
    const cantonInfo = SwissTaxContextService.getCantonContext(canton);
    
    if (cantonInfo) {
      return `📍 **Votre situation fiscale en ${cantonInfo.name}**

**Taux d'imposition :**
• Revenu : ${cantonInfo.taxRates.income.min}% - ${cantonInfo.taxRates.income.max}%
• Fortune : ${cantonInfo.taxRates.wealth.min}% - ${cantonInfo.taxRates.wealth.max}%

**Délais importants :**
• Déclaration : ${cantonInfo.deadlines.declaration}
• Paiement : ${cantonInfo.deadlines.payment}

**Avantages spécifiques ${cantonInfo.name} :**
${cantonInfo.specificDeductions.map(d => `• ${d}`).join('\n')}

**Règles particulières :**
${cantonInfo.specialRules.map(r => `• ${r}`).join('\n')}

Souhaitez-vous des conseils d'optimisation pour votre canton ?`;
    }
  }

  // Optimisations personnalisées
  if (lowerMessage.includes('optimisation') || lowerMessage.includes('économie') || lowerMessage.includes('conseils')) {
    const optimizations = SwissTaxContextService.calculateOptimizations(profile);
    const canton = profile?.personalInfo?.canton;
    const income = profile?.incomeData?.mainEmployment?.grossSalary;
    
    return `💡 **Optimisations fiscales personnalisées**

Basé sur votre profil${canton ? ` (${canton})` : ''} :

**🎯 Opportunités identifiées :**
${optimizations.length > 0 ? optimizations.map(opt => `• ${opt}`).join('\n') : '• Complétez votre profil pour des conseils personnalisés'}

**📋 Actions recommandées :**
• Maximisez votre 3e pilier A avant le 31 décembre
• Détaillez vos frais professionnels réels
• Considérez des rachats LPP si éligible
• Groupez vos frais médicaux sur une année
${profile?.personalInfo?.numberOfChildren > 0 ? '• Optimisez vos déductions pour enfants' : ''}

**⏰ Échéances importantes :**
• Versements 3e pilier : jusqu'au 31 décembre 2024
• Déclaration d'impôts : 31 mars 2025
• Paiement impôts : selon votre canton

Voulez-vous que je détaille une optimisation spécifique ?`;
  }

  // Calcul personnalisé
  if (lowerMessage.includes('calcul') || lowerMessage.includes('estimation') || lowerMessage.includes('combien')) {
    const income = profile?.incomeData?.mainEmployment?.grossSalary || 0;
    const canton = profile?.personalInfo?.canton || 'GE';
    const civilStatus = profile?.personalInfo?.civilStatus || 'single';
    
    // Estimation simplifiée
    const federalTax = estimateFederalTax(income);
    const cantonalTax = estimateCantonalTax(income, canton);
    const totalTax = federalTax + cantonalTax;
    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
    
    return `🧮 **Estimation fiscale personnalisée ${new Date().getFullYear()}**

**Votre situation :**
• Revenu brut : ${income.toLocaleString('fr-CH')} CHF
• Canton : ${canton}
• Situation : ${civilStatus === 'single' ? 'Célibataire' : 'Marié(e)'}

**Estimation d'impôts :**
• Impôt fédéral : ~${federalTax.toLocaleString('fr-CH')} CHF
• Impôt cantonal/communal : ~${cantonalTax.toLocaleString('fr-CH')} CHF
• **Total estimé : ${totalTax.toLocaleString('fr-CH')} CHF**
• Taux effectif : ${effectiveRate.toFixed(1)}%

**💰 Économies potentielles :**
• 3e pilier complet : -${Math.round(totalTax * 0.05).toLocaleString('fr-CH')} CHF
• Optimisation frais : -${Math.round(totalTax * 0.03).toLocaleString('fr-CH')} CHF
• Total économisable : **~${Math.round(totalTax * 0.08).toLocaleString('fr-CH')} CHF**

*Estimation basée sur votre profil. Pour un calcul précis, complétez tous les champs du profil.*

Souhaitez-vous des conseils pour réduire cette estimation ?`;
  }

  return mockResponses.default;
}

// Fonctions d'estimation fiscale simplifiées
function estimateFederalTax(income: number): number {
  if (income <= 14500) return 0;
  if (income <= 31600) return income * 0.0077;
  if (income <= 41400) return income * 0.0088;
  if (income <= 55200) return income * 0.0264;
  if (income <= 72500) return income * 0.0297;
  if (income <= 78100) return income * 0.0594;
  if (income <= 103600) return income * 0.066;
  if (income <= 134600) return income * 0.088;
  if (income <= 176000) return income * 0.11;
  return income * 0.132;
}

function estimateCantonalTax(income: number, canton: string): number {
  const federalBase = estimateFederalTax(income);
  
  const multipliers: { [key: string]: number } = {
    'ZG': 0.8,  // Zoug - très avantageux
    'SZ': 0.9,  // Schwyz
    'ZH': 2.2,  // Zurich
    'BE': 3.1,  // Berne
    'VD': 3.5,  // Vaud
    'GE': 4.2,  // Genève
    'JU': 4.8   // Jura
  };
  
  const multiplier = multipliers[canton] || 3.0;
  return federalBase * multiplier;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, session, profile } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    // Initialiser le contexte fiscal suisse
    SwissTaxContextService.initialize();

    // Anonymiser le profil pour utilisation sécurisée
    let anonymizedProfile = null;
    if (profile) {
      const anonymized = await GDPRAnonymizationService.anonymizeForLLM(
        profile,
        'AI_ASSISTANCE',
        'user-chat'
      );
      anonymizedProfile = anonymized.anonymizedContent;
    }

    // Générer le contexte personnalisé
    const taxContext = SwissTaxContextService.generateChatbotContext(profile);

    // Simulation de traitement avec contexte enrichi
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Analyse avancée du message avec contexte fiscal
    const lowerMessage = message.toLowerCase();
    let response = generateContextualResponse(lowerMessage, profile, taxContext);

    if (lowerMessage.includes('3e pilier') || lowerMessage.includes('pilier 3') || lowerMessage.includes('3a')) {
      response = mockResponses.pillar3a;
    } else if (lowerMessage.includes('frais professionnels') || lowerMessage.includes('transport') || lowerMessage.includes('repas')) {
      response = mockResponses.professional_expenses;
    } else if (lowerMessage.includes('canton') || lowerMessage.includes('genève') || lowerMessage.includes('zurich') || lowerMessage.includes('vaud')) {
      response = mockResponses.cantonal_differences;
    } else if (lowerMessage.includes('rachat') || lowerMessage.includes('lpp') || lowerMessage.includes('2e pilier')) {
      response = mockResponses.lpp_buyback;
    } else if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('aide')) {
      response = mockResponses.welcome;
    } else if (lowerMessage.includes('calcul')) {
      response = `🧮 **Calcul fiscal personnalisé**

Basé sur votre profil actuel (données simulées) :
• **Revenu imposable :** 75'000 CHF
• **Canton :** ${profile?.personalInfo?.canton || 'Genève'}
• **Situation :** ${profile?.personalInfo?.civilStatus || 'Célibataire'}

**Estimation fiscale 2024 :**
• Impôt fédéral : ~2'850 CHF
• Impôt cantonal/communal : ~12'375 CHF
• **Total :** ~15'225 CHF (taux effectif: 17.8%)

**Optimisations identifiées :**
💰 3e pilier : économie potentielle de 625 CHF
🚗 Frais professionnels : économie de 450 CHF
🏦 Rachats LPP : économie de 2'800 CHF

Allez dans l'onglet "Calcul" pour voir le détail complet !`;
    }

    return NextResponse.json({
      response: response,
      metadata: { category: 'ai_response', mode: 'demo' },
      updatedSession: session,
      action: null,
      profileUpdate: null
    });

  } catch (error) {
    console.error('Erreur chat mock:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du message' },
      { status: 500 }
    );
  }
}