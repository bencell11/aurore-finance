import { DocumentTemplate, TemplateField } from '@/lib/types/document-templates';

/**
 * Template professionnel pour générer des factures suisses
 * Conforme aux normes comptables suisses et TVA
 */
export const factureTemplate: DocumentTemplate = {
  id: 'facture_professionnelle_suisse',
  type: 'facture',
  category: 'finance',
  title: 'Facture Professionnelle',
  description: 'Facture conforme aux normes suisses avec TVA, conditions de paiement et coordonnées bancaires',

  requiredFields: [
    // Informations émetteur (vous)
    {
      key: 'emetteur_nom',
      label: 'Votre nom ou raison sociale',
      type: 'text',
      required: true,
      source: 'user_profile',
      supabaseColumn: 'nom',
      placeholder: 'Aurore Consulting Sàrl',
      helpText: 'Nom de votre entreprise ou votre nom complet'
    },
    {
      key: 'emetteur_adresse',
      label: 'Votre adresse complète',
      type: 'address',
      required: true,
      source: 'user_profile',
      supabaseColumn: 'adresse',
      placeholder: 'Rue de la Gare 15, 1003 Lausanne',
      helpText: 'Adresse de facturation'
    },
    {
      key: 'emetteur_email',
      label: 'Votre email',
      type: 'email',
      required: true,
      source: 'user_profile',
      supabaseColumn: 'email',
      placeholder: 'contact@aurore-consulting.ch'
    },
    {
      key: 'emetteur_telephone',
      label: 'Votre téléphone',
      type: 'phone',
      required: true,
      source: 'user_profile',
      supabaseColumn: 'telephone',
      placeholder: '+41 21 XXX XX XX'
    },
    {
      key: 'emetteur_iban',
      label: 'IBAN pour virement',
      type: 'iban',
      required: true,
      source: 'manual_input',
      placeholder: 'CH93 0076 2011 6238 5295 7',
      helpText: 'Votre IBAN bancaire suisse',
      validation: '^CH\\d{2}\\s?\\d{4}\\s?\\d{4}\\s?\\d{4}\\s?\\d{4}\\s?\\d{1}$'
    },
    {
      key: 'emetteur_ide',
      label: 'Numéro IDE / TVA',
      type: 'text',
      required: false,
      source: 'manual_input',
      placeholder: 'CHE-123.456.789 TVA',
      helpText: 'Numéro d\'identification des entreprises (si assujetti TVA)'
    },

    // Informations client (destinataire)
    {
      key: 'client_nom',
      label: 'Nom du client',
      type: 'text',
      required: true,
      source: 'manual_input',
      placeholder: 'ABC Services SA'
    },
    {
      key: 'client_adresse',
      label: 'Adresse du client',
      type: 'address',
      required: true,
      source: 'manual_input',
      placeholder: 'Avenue de Rhodanie 50, 1007 Lausanne'
    },
    {
      key: 'client_email',
      label: 'Email du client',
      type: 'email',
      required: false,
      source: 'manual_input',
      placeholder: 'facturation@abc-services.ch'
    },

    // Détails de la facture
    {
      key: 'numero_facture',
      label: 'Numéro de facture',
      type: 'text',
      required: true,
      source: 'calculated',
      placeholder: 'F-2025-001',
      helpText: 'Format recommandé: F-ANNÉE-NUMÉRO',
      defaultValue: `F-${new Date().getFullYear()}-001`
    },
    {
      key: 'date_facture',
      label: 'Date de facture',
      type: 'date',
      required: true,
      source: 'calculated',
      defaultValue: new Date().toISOString().split('T')[0]
    },
    {
      key: 'date_echeance',
      label: 'Date d\'échéance',
      type: 'date',
      required: true,
      source: 'calculated',
      defaultValue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      helpText: 'Par défaut: 30 jours après la date de facture'
    },
    {
      key: 'reference_client',
      label: 'Référence client (optionnel)',
      type: 'text',
      required: false,
      source: 'manual_input',
      placeholder: 'REF-2025-ABC-123',
      helpText: 'Numéro de commande ou référence du client'
    },

    // Lignes de facturation
    {
      key: 'ligne1_description',
      label: 'Description article/service 1',
      type: 'text',
      required: true,
      source: 'manual_input',
      placeholder: 'Conseil financier personnalisé',
      helpText: 'Description détaillée de la prestation'
    },
    {
      key: 'ligne1_quantite',
      label: 'Quantité 1',
      type: 'number',
      required: true,
      source: 'manual_input',
      placeholder: '10',
      defaultValue: '1'
    },
    {
      key: 'ligne1_unite',
      label: 'Unité 1',
      type: 'text',
      required: true,
      source: 'manual_input',
      placeholder: 'heures',
      defaultValue: 'pce',
      helpText: 'Ex: heures, jours, pce (pièce), forfait'
    },
    {
      key: 'ligne1_prix_unitaire',
      label: 'Prix unitaire 1 (CHF)',
      type: 'number',
      required: true,
      source: 'manual_input',
      placeholder: '150.00'
    },

    // Ligne 2 (optionnelle)
    {
      key: 'ligne2_description',
      label: 'Description article/service 2 (optionnel)',
      type: 'text',
      required: false,
      source: 'manual_input',
      placeholder: 'Frais de déplacement'
    },
    {
      key: 'ligne2_quantite',
      label: 'Quantité 2',
      type: 'number',
      required: false,
      source: 'manual_input',
      placeholder: '1'
    },
    {
      key: 'ligne2_unite',
      label: 'Unité 2',
      type: 'text',
      required: false,
      source: 'manual_input',
      placeholder: 'forfait'
    },
    {
      key: 'ligne2_prix_unitaire',
      label: 'Prix unitaire 2 (CHF)',
      type: 'number',
      required: false,
      source: 'manual_input',
      placeholder: '50.00'
    },

    // Ligne 3 (optionnelle)
    {
      key: 'ligne3_description',
      label: 'Description article/service 3 (optionnel)',
      type: 'text',
      required: false,
      source: 'manual_input',
      placeholder: 'Rapport d\'analyse'
    },
    {
      key: 'ligne3_quantite',
      label: 'Quantité 3',
      type: 'number',
      required: false,
      source: 'manual_input',
      placeholder: '1'
    },
    {
      key: 'ligne3_unite',
      label: 'Unité 3',
      type: 'text',
      required: false,
      source: 'manual_input',
      placeholder: 'pce'
    },
    {
      key: 'ligne3_prix_unitaire',
      label: 'Prix unitaire 3 (CHF)',
      type: 'number',
      required: false,
      source: 'manual_input',
      placeholder: '200.00'
    },

    // TVA et totaux
    {
      key: 'taux_tva',
      label: 'Taux de TVA (%)',
      type: 'select',
      required: true,
      source: 'manual_input',
      options: ['0', '2.6', '3.8', '8.1'],
      defaultValue: '8.1',
      helpText: 'Taux normal suisse: 8.1% | Taux réduit: 2.6% (alimentation) ou 3.8% (hébergement)'
    },

    // Conditions de paiement
    {
      key: 'delai_paiement',
      label: 'Délai de paiement (jours)',
      type: 'number',
      required: true,
      source: 'manual_input',
      defaultValue: '30',
      helpText: 'Nombre de jours avant échéance'
    },
    {
      key: 'conditions_paiement',
      label: 'Conditions de paiement',
      type: 'text',
      required: false,
      source: 'manual_input',
      defaultValue: 'Paiement par virement bancaire',
      placeholder: 'Paiement par virement bancaire'
    },
    {
      key: 'notes_supplementaires',
      label: 'Notes supplémentaires',
      type: 'text',
      required: false,
      source: 'manual_input',
      placeholder: 'Merci pour votre confiance',
      helpText: 'Message personnalisé pour votre client'
    }
  ],

  contentBlocks: [
    // En-tête avec logo et coordonnées émetteur
    {
      type: 'header',
      content: `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #3b82f6;">
          <div>
            <h1 style="margin: 0; font-size: 28px; color: #1e40af; font-weight: bold;">{{emetteur_nom}}</h1>
            <p style="margin: 5px 0; color: #64748b; font-size: 14px;">{{emetteur_adresse}}</p>
            <p style="margin: 3px 0; color: #64748b; font-size: 14px;">Email: {{emetteur_email}}</p>
            <p style="margin: 3px 0; color: #64748b; font-size: 14px;">Tél: {{emetteur_telephone}}</p>
            {{#if emetteur_ide}}
            <p style="margin: 3px 0; color: #64748b; font-size: 14px;">IDE/TVA: {{emetteur_ide}}</p>
            {{/if}}
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 32px; color: #ef4444; font-weight: bold;">FACTURE</h2>
            <p style="margin: 10px 0; font-size: 16px; font-weight: 600;">N° {{numero_facture}}</p>
            <p style="margin: 5px 0; font-size: 14px; color: #64748b;">Date: {{date_facture}}</p>
            <p style="margin: 5px 0; font-size: 14px; color: #64748b;">Échéance: {{date_echeance}}</p>
          </div>
        </div>
      `,
      style: { align: 'left' }
    },

    // Adresse client
    {
      type: 'address',
      content: `
        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Facturé à:</p>
          <h3 style="margin: 10px 0 5px 0; font-size: 16px; color: #1e293b; font-weight: 600;">{{client_nom}}</h3>
          <p style="margin: 3px 0; color: #475569; font-size: 14px;">{{client_adresse}}</p>
          {{#if client_email}}
          <p style="margin: 3px 0; color: #475569; font-size: 14px;">{{client_email}}</p>
          {{/if}}
          {{#if reference_client}}
          <p style="margin: 10px 0 0 0; color: #475569; font-size: 14px;"><strong>Réf. client:</strong> {{reference_client}}</p>
          {{/if}}
        </div>
      `,
      style: { align: 'left' }
    },

    // Tableau des prestations
    {
      type: 'paragraph',
      content: `
        <div style="margin: 40px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #1e40af; color: white;">
                <th style="padding: 12px; text-align: left; font-weight: 600;">Description</th>
                <th style="padding: 12px; text-align: center; font-weight: 600; width: 80px;">Qté</th>
                <th style="padding: 12px; text-align: center; font-weight: 600; width: 80px;">Unité</th>
                <th style="padding: 12px; text-align: right; font-weight: 600; width: 120px;">Prix unit. (CHF)</th>
                <th style="padding: 12px; text-align: right; font-weight: 600; width: 120px;">Total (CHF)</th>
              </tr>
            </thead>
            <tbody>
              <!-- Ligne 1 (obligatoire) -->
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; color: #334155;">{{ligne1_description}}</td>
                <td style="padding: 12px; text-align: center; color: #334155;">{{ligne1_quantite}}</td>
                <td style="padding: 12px; text-align: center; color: #334155;">{{ligne1_unite}}</td>
                <td style="padding: 12px; text-align: right; color: #334155;">{{ligne1_prix_unitaire}}</td>
                <td style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">{{ligne1_total}}</td>
              </tr>

              {{#if ligne2_description}}
              <!-- Ligne 2 (optionnelle) -->
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; color: #334155;">{{ligne2_description}}</td>
                <td style="padding: 12px; text-align: center; color: #334155;">{{ligne2_quantite}}</td>
                <td style="padding: 12px; text-align: center; color: #334155;">{{ligne2_unite}}</td>
                <td style="padding: 12px; text-align: right; color: #334155;">{{ligne2_prix_unitaire}}</td>
                <td style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">{{ligne2_total}}</td>
              </tr>
              {{/if}}

              {{#if ligne3_description}}
              <!-- Ligne 3 (optionnelle) -->
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; color: #334155;">{{ligne3_description}}</td>
                <td style="padding: 12px; text-align: center; color: #334155;">{{ligne3_quantite}}</td>
                <td style="padding: 12px; text-align: center; color: #334155;">{{ligne3_unite}}</td>
                <td style="padding: 12px; text-align: right; color: #334155;">{{ligne3_prix_unitaire}}</td>
                <td style="padding: 12px; text-align: right; font-weight: 600; color: #1e293b;">{{ligne3_total}}</td>
              </tr>
              {{/if}}
            </tbody>
          </table>
        </div>
      `,
      style: { align: 'left' }
    },

    // Totaux
    {
      type: 'paragraph',
      content: `
        <div style="margin: 30px 0; display: flex; justify-content: flex-end;">
          <div style="width: 350px;">
            <!-- Sous-total HT -->
            <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 14px;">Sous-total HT:</span>
              <span style="color: #1e293b; font-weight: 600; font-size: 14px;">{{sous_total_ht}} CHF</span>
            </div>

            <!-- TVA -->
            <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 14px;">TVA ({{taux_tva}}%):</span>
              <span style="color: #1e293b; font-weight: 600; font-size: 14px;">{{montant_tva}} CHF</span>
            </div>

            <!-- Total TTC -->
            <div style="display: flex; justify-content: space-between; padding: 16px; background-color: #1e40af; border-radius: 8px; margin-top: 10px;">
              <span style="color: white; font-size: 18px; font-weight: 700;">TOTAL TTC:</span>
              <span style="color: white; font-weight: 700; font-size: 20px;">{{total_ttc}} CHF</span>
            </div>
          </div>
        </div>
      `,
      style: { align: 'right' }
    },

    // Conditions de paiement
    {
      type: 'paragraph',
      content: `
        <div style="margin: 40px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1e40af; font-weight: 600;">Conditions de paiement</h3>
          <p style="margin: 5px 0; color: #475569; font-size: 14px;"><strong>Échéance:</strong> {{delai_paiement}} jours (au {{date_echeance}})</p>
          <p style="margin: 5px 0; color: #475569; font-size: 14px;"><strong>Mode de paiement:</strong> {{conditions_paiement}}</p>

          <div style="margin-top: 15px; padding: 15px; background-color: white; border-radius: 6px; border-left: 3px solid #10b981;">
            <p style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">Coordonnées bancaires:</p>
            <p style="margin: 3px 0; color: #475569; font-size: 13px;">IBAN: <strong>{{emetteur_iban}}</strong></p>
            <p style="margin: 3px 0; color: #475569; font-size: 13px;">Bénéficiaire: {{emetteur_nom}}</p>
            <p style="margin: 3px 0; color: #475569; font-size: 13px;">Référence: {{numero_facture}}</p>
          </div>

          {{#if notes_supplementaires}}
          <p style="margin: 15px 0 0 0; color: #64748b; font-size: 13px; font-style: italic;">{{notes_supplementaires}}</p>
          {{/if}}
        </div>
      `,
      style: { align: 'left' }
    },

    // Footer légal
    {
      type: 'footer',
      content: `
        <div style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center;">
          <p style="margin: 5px 0; color: #94a3b8; font-size: 11px;">
            {{emetteur_nom}} • {{emetteur_adresse}} • {{emetteur_email}} • {{emetteur_telephone}}
          </p>
          {{#if emetteur_ide}}
          <p style="margin: 5px 0; color: #94a3b8; font-size: 11px;">
            IDE/TVA: {{emetteur_ide}}
          </p>
          {{/if}}
          <p style="margin: 10px 0 0 0; color: #cbd5e1; font-size: 10px;">
            Document généré le {{date_generation}} par Aurore Finance
          </p>
        </div>
      `,
      style: { align: 'center' }
    }
  ],

  metadata: {
    language: 'fr',
    legalCompliance: true,
    swissLawReference: 'Art. 22 al. 1 LTVA - Obligations liées à la comptabilité et à la conservation',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Aurore Finance'
  },

  toneOptions: {
    formal: true,
    firm: false,
    urgent: false
  }
};

/**
 * Fonction utilitaire pour calculer les totaux d'une facture
 */
export function calculateInvoiceTotals(data: Record<string, any>) {
  let sousTotal = 0;

  // Ligne 1 (obligatoire)
  const ligne1Total = (parseFloat(data.ligne1_quantite) || 0) * (parseFloat(data.ligne1_prix_unitaire) || 0);
  sousTotal += ligne1Total;

  // Ligne 2 (optionnelle)
  let ligne2Total = 0;
  if (data.ligne2_description && data.ligne2_quantite && data.ligne2_prix_unitaire) {
    ligne2Total = (parseFloat(data.ligne2_quantite) || 0) * (parseFloat(data.ligne2_prix_unitaire) || 0);
    sousTotal += ligne2Total;
  }

  // Ligne 3 (optionnelle)
  let ligne3Total = 0;
  if (data.ligne3_description && data.ligne3_quantite && data.ligne3_prix_unitaire) {
    ligne3Total = (parseFloat(data.ligne3_quantite) || 0) * (parseFloat(data.ligne3_prix_unitaire) || 0);
    sousTotal += ligne3Total;
  }

  // Calcul TVA
  const tauxTVA = parseFloat(data.taux_tva) || 0;
  const montantTVA = (sousTotal * tauxTVA) / 100;
  const totalTTC = sousTotal + montantTVA;

  return {
    ligne1_total: ligne1Total.toFixed(2),
    ligne2_total: ligne2Total > 0 ? ligne2Total.toFixed(2) : null,
    ligne3_total: ligne3Total > 0 ? ligne3Total.toFixed(2) : null,
    sous_total_ht: sousTotal.toFixed(2),
    montant_tva: montantTVA.toFixed(2),
    total_ttc: totalTTC.toFixed(2),
    date_generation: new Date().toLocaleString('fr-CH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
}
