/**
 * Service de routing intelligent avec OpenAI
 * Analyse la demande utilisateur et suggère le template approprié
 */

import { RoutingAnalysis, DocumentType, DocumentCategory } from '@/lib/types/document-templates';
import OpenAI from 'openai';

export class DocumentRoutingService {
  private static openai: OpenAI | null = null;

  private static getOpenAI(): OpenAI {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY not configured');
      }
      this.openai = new OpenAI({ apiKey });
    }
    return this.openai;
  }

  /**
   * Analyse une demande en langage naturel et suggère un template
   */
  static async analyzeRequest(userInput: string): Promise<RoutingAnalysis> {
    try {
      const openai = this.getOpenAI();

      const systemPrompt = `Tu es un assistant expert en génération de documents suisses.
Ton rôle est d'analyser la demande de l'utilisateur et de déterminer quel type de document créer.

Types de documents disponibles:
- lettre_resiliation: Résiliation de contrats (assurance, bail, abonnement)
- demande_remboursement: Demandes de remboursement (assurance, employeur)
- reclamation: Réclamations (retard de paiement, vice de produit, service)
- demande_administrative: Demandes administratives (permis, attestations)
- courrier_formel: Courriers formels divers
- attestation: Attestations diverses
- facture: Factures professionnelles avec TVA suisse

Catégories:
- insurance: Assurances
- housing: Logement
- finance: Finance
- administrative: Administratif
- legal: Juridique
- employment: Emploi

Templates disponibles:
- assurance-maladie: Résiliation LAMal (assurance maladie de base)
- assurance-rc: Résiliation assurance responsabilité civile
- bail-location: Résiliation de bail de location
- facture_professionnelle_suisse: Facture conforme aux normes suisses avec TVA

IMPORTANT: Utilise UNIQUEMENT les noms de templates listés ci-dessus (sans préfixe ni suffixe).
Si la demande correspond à "résiliation assurance maladie", retourne "assurance-maladie" comme suggestedTemplate.

Tu dois retourner UNIQUEMENT un JSON valide (pas de markdown, pas de texte supplémentaire) avec:
{
  "documentType": "...",
  "category": "...",
  "suggestedTemplate": "...",
  "requiredFields": ["field1", "field2"],
  "tone": "formal" ou "informal",
  "language": "fr/de/it/en",
  "confidence": 0.0-1.0,
  "reasoning": "explication courte"
}`;

      const userPrompt = `Demande de l'utilisateur: "${userInput}"

Analyse cette demande et retourne le JSON de routing.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const analysis: RoutingAnalysis = JSON.parse(content);

      // Validation basique
      if (!analysis.documentType || !analysis.suggestedTemplate) {
        throw new Error('Invalid routing analysis from OpenAI');
      }

      console.log('[DocumentRouting] Analysis:', analysis);
      return analysis;

    } catch (error) {
      console.error('[DocumentRouting] Error:', error);

      // Fallback: analyse simple basée sur mots-clés
      return this.fallbackAnalysis(userInput);
    }
  }

  /**
   * Analyse de secours si OpenAI échoue
   */
  private static fallbackAnalysis(userInput: string): RoutingAnalysis {
    const input = userInput.toLowerCase();

    // Détection de résiliation
    if (input.includes('résili') || input.includes('resili') || input.includes('annul')) {
      if (input.includes('assurance') && (input.includes('maladie') || input.includes('lamal'))) {
        return {
          documentType: 'lettre_resiliation',
          category: 'insurance',
          suggestedTemplate: 'assurance-maladie',
          requiredFields: ['nom', 'prenom', 'numero_police', 'date_resiliation'],
          tone: 'formal',
          language: 'fr',
          confidence: 0.7,
          reasoning: 'Détection par mots-clés: résiliation + assurance maladie'
        };
      }

      if (input.includes('bail') || input.includes('location') || input.includes('logement')) {
        return {
          documentType: 'lettre_resiliation',
          category: 'housing',
          suggestedTemplate: 'bail-location',
          requiredFields: ['nom', 'prenom', 'adresse_logement', 'date_resiliation'],
          tone: 'formal',
          language: 'fr',
          confidence: 0.7,
          reasoning: 'Détection par mots-clés: résiliation + bail/location'
        };
      }
    }

    // Détection de réclamation
    if (input.includes('réclam') || input.includes('reclam') || input.includes('plainte')) {
      return {
        documentType: 'reclamation',
        category: 'legal',
        suggestedTemplate: 'reclamation-generale',
        requiredFields: ['nom', 'prenom', 'objet_reclamation'],
        tone: 'formal',
        language: 'fr',
        confidence: 0.6,
        reasoning: 'Détection par mots-clés: réclamation'
      };
    }

    // Par défaut: courrier formel
    return {
      documentType: 'courrier_formel',
      category: 'administrative',
      suggestedTemplate: 'courrier-formel-general',
      requiredFields: ['nom', 'prenom', 'objet'],
      tone: 'formal',
      language: 'fr',
      confidence: 0.4,
      reasoning: 'Template par défaut - demande non reconnue'
    };
  }

  /**
   * Récupère les adresses d'assurances suisses
   */
  static getInsuranceAddress(insuranceName: string): string {
    const addresses: Record<string, string> = {
      'Assura': 'Assura-Basis SA\nAvenue C.-F. Ramuz 70\nCase postale\n1001 Lausanne',
      'CSS': 'CSS Assurance\nTribschenstrasse 21\n6005 Lucerne',
      'Groupe Mutuel': 'Groupe Mutuel\nRue des Cèdres 5\nCase postale\n1919 Martigny',
      'Helsana': 'Helsana Assurances SA\nCase postale\n8081 Zurich',
      'Sanitas': 'Sanitas Assurance Maladie\nJägergasse 3\nCase postale\n8021 Zurich',
      'Swica': 'SWICA Assurance-Maladie SA\nRömerstrasse 38\n8401 Winterthour',
      'Visana': 'Visana SA\nWeltpoststrasse 19\n3015 Berne',
      'ÖKK': 'ÖKK Kranken- und Unfallversicherungen AG\nBahnhofstrasse 13\n7302 Landquart'
    };

    return addresses[insuranceName] || `${insuranceName}\nService Clients\nSuisse`;
  }
}
