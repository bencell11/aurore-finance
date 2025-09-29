/**
 * Service de remplissage automatique du formulaire officiel suisse
 * Basé sur le template di-template-test.pdf (Formule 2 605.040.11f)
 */

export interface OfficialSwissTaxForm {
  // Page 1 - Informations personnelles
  canton: string;
  commune: string;
  numeroControle?: string;
  
  // Section 1 - Situation personnelle au 31 décembre 2025
  contribuable1: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    etatCivil: string;
    communeOrigine: string;
    confession: string;
    profession: string;
    employeur: string;
    employeurDepuis?: string;
    lieuTravail: string;
    telephoneProfessionnel?: string;
    telephonePrive?: string;
    email: string;
  };
  
  contribuable2?: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    etatCivil: string;
    communeOrigine: string;
    confession: string;
    profession: string;
    employeur: string;
    employeurDepuis?: string;
    lieuTravail: string;
    telephoneProfessionnel?: string;
    telephonePrive?: string;
    email: string;
  };
  
  // Enfants mineurs
  enfants: Array<{
    nom: string;
    prenom: string;
    dateNaissance: string;
    enVotreMenage: boolean;
    ecoleEmployeur?: string;
    enPrincipeJusqua?: string;
    autreParentVerseContributions: boolean;
  }>;
  
  // Personnes à charge
  personnesACharge: Array<{
    nom: string;
    prenom: string;
    anneeNaissance: string;
    enVotreMenage: boolean;
    adresse: string;
    contributionAnnuelle: number;
  }>;
  
  // Page 2 - Revenus
  revenus: {
    // Section 1 - Activité dépendante
    activitePrincipale: {
      contribuable1SalaireNet: number;
      contribuable2SalaireNet?: number;
    };
    activiteAccessoire?: {
      contribuable1SalaireNet: number;
      contribuable2SalaireNet?: number;
    };
    
    // Section 2 - Activité indépendante
    activiteIndependante?: {
      contribuable1Principale?: number;
      contribuable2Principale?: number;
      contribuable1Accessoire?: number;
      contribuable2Accessoire?: number;
    };
    
    // Section 3 - Assurances sociales
    assurancesSociales: {
      rentesAVS?: {
        contribuable1: number;
        contribuable2?: number;
      };
      rentes?: Array<{
        contribuable: 1 | 2;
        montant: number;
        pourcentage: number;
        debiteur: string;
      }>;
      indemnitesPerte?: {
        contribuable1: number;
        contribuable2?: number;
      };
      allocationsFamiliales?: number;
    };
    
    // Section 4 - Rendement des titres
    rendementTitres?: number;
    
    // Section 5 - Autres revenus
    autresRevenus?: {
      pensionsConjoint?: number;
      contributionsEnfants?: number;
      successionsNonPartagees?: number;
      autres?: Array<{
        designation: string;
        montant: number;
      }>;
      versementCapitaux?: {
        montant: number;
        pourAnnees: number;
      };
    };
    
    // Section 8 - Immeubles (propriétaires seulement)
    immeubles?: {
      maisonFamiliale?: {
        valeurLocative: number;
        loyers: number;
        rendementBrut: number;
        fraisEntretien: number;
        rendementNet: number;
      };
      plusieursImmeubles?: number; // Référence formule 16
    };
    
    totalRevenus: number;
  };
  
  // Page 3 - Déductions
  deductions: {
    // Section 10 - Frais professionnels
    fraisProfessionnels: {
      contribuable1: number;
      contribuable2?: number;
    };
    
    // Section 11 - Intérêts passifs
    interetsPassifs?: number;
    
    // Section 12 - Contributions d'entretien versées
    contributionsEntretien?: {
      pensionsConjoint?: number;
      contributionsEnfants?: number;
      prestationsRente?: number;
    };
    
    // Section 13 - Pilier 3a
    pilier3a: {
      contribuable1: number;
      contribuable2?: number;
    };
    
    // Section 14 - Assurances et épargne
    assurancesEpargne: {
      montant: number;
      deductionMaximale: number;
      deductionSupplementaireParEnfant?: number;
    };
    
    // Section 15 - Autres déductions
    autresDeductions?: {
      cotisationsAVS?: number;
      fraisFormation?: number;
      pilier2?: number;
      cotisationsPartis?: number;
      fraisHandicap?: number;
      gardeEnfants?: number;
      fraisAdministrationTitres?: number;
      autres?: Array<{
        designation: string;
        montant: number;
      }>;
    };
    
    // Section 16 - Couple à deux revenus
    coupleDeuxRevenus?: number;
    
    totalDeductions: number;
  };
  
  // Calculs automatiques
  calculs: {
    // Section 18-24 - Détermination du revenu
    totalRevenus: number;
    totalDeductions: number;
    revenuNetI: number;
    
    deductionsSupplementaires?: {
      fraisMaladieAccidents?: number;
      versementsBenevolesToMax: number;
    };
    
    revenuNetII: number;
    
    deductionsSociales: {
      deductionEnfants: number; // 6800 par enfant
      deductionPersonnesCharge: number; // 6800 par personne
      deductionCouplesMariesTax: number; // 2800
    };
    
    revenuImposable: number;
  };
  
  // Page 4 - Fortune
  fortune: {
    // Section 25 - Fortune mobilière
    fortuneMobiliere: {
      titresAvoirs?: number;
      argentComptant?: number;
      assurancesVie?: Array<{
        compagnie: string;
        anneeContrat: number;
        anneeEcheance: number;
        montantAssurance: number;
        valeurRachat: number;
      }>;
      vehicules?: Array<{
        genre: string;
        prixAchat: number;
        annee: number;
      }>;
      successionsNonPartagees?: number;
      autres?: Array<{
        designation: string;
        montant: number;
      }>;
    };
    
    // Section 26 - Immeubles
    immeubles?: {
      maisonFamiliale?: {
        commune: string;
        rue: string;
        valeurFiscale: number;
      };
      plusieursImmeubles?: number;
    };
    
    // Section 27 - Activité indépendante
    activiteIndependante?: {
      capitalPropre?: number;
      actifsSansImmeuble?: number;
    };
    
    totalElementsFortune: number;
    dettes: number;
    fortuneNette: number;
  };
  
  // Informations complémentaires
  donations?: Array<{
    type: 'donation' | 'avancement' | 'succession' | 'participation';
    date: string;
    beneficiaire?: string;
    donateur?: string;
    valeur: number;
    lienParente?: string;
  }>;
  
  prestationsCapital?: Array<{
    type: 'AVS-AI' | 'pilier2' | 'pilier3a' | 'deces-dommages';
    montant: number;
    dateVersement: string;
    comptePrevoyance?: string;
  }>;
  
  remarques?: string;
  
  // Métadonnées
  periodeImpots: number; // 2025
  dateSignature?: string;
  lieuSignature?: string;
}

export class OfficialFormFillerService {
  /**
   * Convertit le profil utilisateur en formulaire officiel rempli
   */
  static convertProfileToOfficialForm(profile: any): OfficialSwissTaxForm {
    const personalInfo = profile.personalInfo || {};
    const incomeData = profile.incomeData || {};
    const deductions = profile.deductions || {};
    const assets = profile.assets || {};
    
    // Calcul automatique du revenu imposable
    const totalRevenus = incomeData.mainEmployment?.grossSalary || 0;
    const totalDeductions = this.calculateTotalDeductions(deductions);
    const revenuNetI = totalRevenus - totalDeductions;
    const revenuNetII = revenuNetI; // Simplification
    
    // Déductions sociales
    const nombreEnfants = personalInfo.numberOfChildren || 0;
    const deductionEnfants = nombreEnfants * 6800;
    const deductionCouplesMariesTax = personalInfo.civilStatus === 'married' ? 2800 : 0;
    const deductionsSociales = deductionEnfants + deductionCouplesMariesTax;
    
    const revenuImposable = Math.max(0, revenuNetII - deductionsSociales);
    
    return {
      // Informations générales
      canton: personalInfo.canton || 'VD',
      commune: personalInfo.commune || 'Lausanne',
      numeroControle: `${Date.now()}`.slice(-8),
      
      // Contribuable principal
      contribuable1: {
        nom: profile.lastName || 'Utilisateur',
        prenom: profile.firstName || 'Demo',
        dateNaissance: personalInfo.dateNaissance || '01.01.1990',
        etatCivil: this.mapCivilStatus(personalInfo.civilStatus),
        communeOrigine: personalInfo.communeOrigine || personalInfo.commune || 'Lausanne',
        confession: this.mapConfession(personalInfo.confession),
        profession: incomeData.mainEmployment?.profession || 'Employé',
        employeur: incomeData.mainEmployment?.employer || 'Entreprise SA',
        lieuTravail: personalInfo.commune || 'Lausanne',
        email: profile.email || 'user@example.com'
      },
      
      // Enfants
      enfants: this.generateChildrenData(nombreEnfants),
      
      // Personnes à charge
      personnesACharge: [],
      
      // Revenus détaillés
      revenus: {
        activitePrincipale: {
          contribuable1SalaireNet: incomeData.mainEmployment?.netSalary || totalRevenus * 0.68,
          contribuable2SalaireNet: personalInfo.civilStatus === 'married' ? 0 : undefined
        },
        
        assurancesSociales: {
          rentesAVS: incomeData.pensionIncome?.avsRente ? {
            contribuable1: incomeData.pensionIncome.avsRente
          } : undefined,
          allocationsFamiliales: incomeData.familyAllowances || 0
        },
        
        rendementTitres: assets.totalValue ? assets.totalValue * 0.02 : 0,
        
        totalRevenus
      },
      
      // Déductions détaillées
      deductions: {
        fraisProfessionnels: {
          contribuable1: deductions.professionalExpenses?.total || 2500
        },
        
        pilier3a: {
          contribuable1: deductions.savingsContributions?.pillar3a || 0
        },
        
        assurancesEpargne: {
          montant: deductions.insurancePremiums?.healthInsurance || 0,
          deductionMaximale: this.getInsuranceDeductionLimit(personalInfo.civilStatus, deductions.savingsContributions?.pillar3a > 0),
          deductionSupplementaireParEnfant: nombreEnfants * 700
        },
        
        autresDeductions: {
          gardeEnfants: deductions.childcareExpenses || 0,
          autres: deductions.donations?.amount ? [{
            designation: 'Dons et versements bénévoles',
            montant: deductions.donations.amount
          }] : []
        },
        
        coupleDeuxRevenus: personalInfo.civilStatus === 'married' ? 
          Math.min(14100, Math.max(8600, (incomeData.secondaryIncome || 0) * 0.5)) : 0,
        
        totalDeductions
      },
      
      // Calculs finaux
      calculs: {
        totalRevenus,
        totalDeductions,
        revenuNetI,
        revenuNetII,
        deductionsSociales: {
          deductionEnfants,
          deductionPersonnesCharge: 0,
          deductionCouplesMariesTax
        },
        revenuImposable
      },
      
      // Fortune
      fortune: {
        fortuneMobiliere: {
          titresAvoirs: assets.totalValue || 0,
          argentComptant: assets.bankAccounts?.[0]?.balance || 0
        },
        
        totalElementsFortune: assets.totalValue || 0,
        dettes: 0,
        fortuneNette: assets.totalValue || 0
      },
      
      // Métadonnées
      periodeImpots: 2025,
      dateSignature: new Date().toLocaleDateString('fr-CH'),
      lieuSignature: personalInfo.commune || 'Lausanne'
    };
  }
  
  /**
   * Génère le HTML du formulaire officiel avec les données remplies
   */
  static generateOfficialFormHTML(formData: OfficialSwissTaxForm): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Déclaration d'impôts ${formData.periodeImpots} - ${formData.canton}</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            font-size: 10pt; 
            line-height: 1.2; 
            margin: 0; 
            padding: 20px;
            background: white;
        }
        .page { 
            width: 210mm; 
            min-height: 297mm; 
            margin: 0 auto; 
            padding: 15mm; 
            border: 1px solid #ddd;
            page-break-after: always;
            box-sizing: border-box;
        }
        .header { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .title { 
            font-size: 18pt; 
            font-weight: bold; 
            margin-bottom: 5px; 
        }
        .subtitle { 
            font-size: 12pt; 
            color: #666; 
        }
        .section { 
            margin: 15px 0; 
            border: 1px solid #ccc;
            padding: 10px;
        }
        .section-title { 
            font-weight: bold; 
            font-size: 11pt; 
            background: #f5f5f5; 
            padding: 5px; 
            margin: -10px -10px 10px -10px;
            border-bottom: 1px solid #ccc;
        }
        .field-group { 
            display: flex; 
            margin: 8px 0; 
            align-items: center;
        }
        .field-label { 
            flex: 1; 
            font-weight: normal; 
        }
        .field-value { 
            flex: 0 0 200px; 
            border-bottom: 1px solid #333; 
            padding: 2px 5px; 
            text-align: right;
            font-weight: bold;
        }
        .checkbox { 
            margin: 0 5px; 
        }
        .admin-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 9pt;
        }
        .page-number {
            position: absolute;
            bottom: 10mm;
            right: 15mm;
            font-size: 9pt;
            color: #666;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 10px 0; 
        }
        th, td { 
            border: 1px solid #ccc; 
            padding: 5px; 
            text-align: left; 
        }
        th { 
            background: #f5f5f5; 
            font-weight: bold; 
        }
        .amount { 
            text-align: right; 
            font-family: 'Courier New', monospace; 
        }
        .total-row { 
            font-weight: bold; 
            background: #f9f9f9; 
        }
        @media print {
            body { margin: 0; padding: 0; }
            .page { border: none; margin: 0; }
        }
    </style>
</head>
<body>
    ${this.generatePage1(formData)}
    ${this.generatePage2(formData)}
    ${this.generatePage3(formData)}
    ${this.generatePage4(formData)}
</body>
</html>`;
  }
  
  private static generatePage1(data: OfficialSwissTaxForm): string {
    return `
<div class="page">
    <div class="admin-info">
        <div>
            <strong>Canton:</strong> ${data.canton}<br>
            <strong>Commune:</strong> ${data.commune}<br>
            <strong>No contrôle:</strong> ${data.numeroControle || ''}
        </div>
        <div style="text-align: center;">
            <div style="background: #333; color: white; padding: 10px; margin-bottom: 10px;">
                <div><strong>IMPÔT CANTONAL ET COMMUNAL</strong></div>
                <div><strong>IMPÔT FÉDÉRAL DIRECT</strong></div>
            </div>
            <div style="font-size: 9pt;">
                Cette déclaration et ses annexes doivent<br>
                être remises jusqu'au<br>
                <strong>31 mars ${data.periodeImpots + 1}</strong><br>
                à l'adresse suivante:<br>
                Administration fiscale cantonale
            </div>
        </div>
    </div>
    
    <div class="header">
        <div class="title">Déclaration ${data.periodeImpots}</div>
        <div class="subtitle">des personnes physiques</div>
        <div style="font-size: 8pt; margin-top: 10px;">
            Formule 2 605.040.11f (période fiscale ${data.periodeImpots})
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">1. Situation personnelle, professionnelle et familiale au 31 décembre ${data.periodeImpots}</div>
        
        <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
                <h4>Contribuable 1</h4>
                <div class="field-group">
                    <span class="field-label">Nom, prénom:</span>
                    <span class="field-value">${data.contribuable1.nom}, ${data.contribuable1.prenom}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Date de naissance:</span>
                    <span class="field-value">${data.contribuable1.dateNaissance}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">État civil:</span>
                    <span class="field-value">${data.contribuable1.etatCivil}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Commune d'origine:</span>
                    <span class="field-value">${data.contribuable1.communeOrigine}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Confession:</span>
                    <span class="field-value">${data.contribuable1.confession}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Profession:</span>
                    <span class="field-value">${data.contribuable1.profession}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Employeur:</span>
                    <span class="field-value">${data.contribuable1.employeur}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Lieu de travail:</span>
                    <span class="field-value">${data.contribuable1.lieuTravail}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">E-Mail:</span>
                    <span class="field-value">${data.contribuable1.email}</span>
                </div>
            </div>
            
            ${data.contribuable2 ? `
            <div style="flex: 1;">
                <h4>Contribuable 2</h4>
                <div class="field-group">
                    <span class="field-label">Nom, prénom:</span>
                    <span class="field-value">${data.contribuable2.nom}, ${data.contribuable2.prenom}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Date de naissance:</span>
                    <span class="field-value">${data.contribuable2.dateNaissance}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">État civil:</span>
                    <span class="field-value">${data.contribuable2.etatCivil}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Commune d'origine:</span>
                    <span class="field-value">${data.contribuable2.communeOrigine}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Confession:</span>
                    <span class="field-value">${data.contribuable2.confession}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Profession:</span>
                    <span class="field-value">${data.contribuable2.profession}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Employeur:</span>
                    <span class="field-value">${data.contribuable2.employeur}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">Lieu de travail:</span>
                    <span class="field-value">${data.contribuable2.lieuTravail}</span>
                </div>
                <div class="field-group">
                    <span class="field-label">E-Mail:</span>
                    <span class="field-value">${data.contribuable2.email}</span>
                </div>
            </div>
            ` : '<div style="flex: 1;"><h4>Contribuable 2</h4><p style="color: #666; font-style: italic;">Non applicable</p></div>'}
        </div>
        
        ${data.enfants.length > 0 ? `
        <div style="margin-top: 20px;">
            <h4>Enfants mineurs ou en formation</h4>
            <table>
                <thead>
                    <tr>
                        <th>Nom, prénom</th>
                        <th>Date de naissance</th>
                        <th>En votre ménage?</th>
                        <th>École ou employeur</th>
                        <th>En principe jusqu'à</th>
                        <th>Autre parent verse des contributions?</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.enfants.map(enfant => `
                    <tr>
                        <td>${enfant.nom}, ${enfant.prenom}</td>
                        <td>${enfant.dateNaissance}</td>
                        <td>${enfant.enVotreMenage ? '☑ oui ☐ non' : '☐ oui ☑ non'}</td>
                        <td>${enfant.ecoleEmployeur || ''}</td>
                        <td>${enfant.enPrincipeJusqua || ''}</td>
                        <td>${enfant.autreParentVerseContributions ? '☑ oui ☐ non' : '☐ oui ☑ non'}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}
    </div>
    
    <div class="page-number">1/4</div>
</div>`;
  }
  
  private static generatePage2(data: OfficialSwissTaxForm): string {
    return `
<div class="page">
    <div class="header">
        <div class="title">Revenu en suisse et à l'étranger</div>
        <div class="subtitle">du/de la contribuable 1, du/de la contribuable 2 et des enfants mineurs, sans le revenu du travail des enfants</div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th style="width: 60%;">Revenus ${data.periodeImpots}</th>
                <th style="width: 40%;">CHF sans centimes</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background: #f9f9f9;">
                <td><strong>1. Revenus provenant de l'activité dépendante</strong> <em>joindre les certificats de salaire</em></td>
                <td></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;1.1 Activité principale du/de la contribuable 1 (salaire net)</td>
                <td class="amount">${this.formatCurrency(data.revenus.activitePrincipale.contribuable1SalaireNet)}</td>
            </tr>
            ${data.revenus.activitePrincipale.contribuable2SalaireNet ? `
            <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;du/de la contribuable 2 (salaire net)</td>
                <td class="amount">${this.formatCurrency(data.revenus.activitePrincipale.contribuable2SalaireNet)}</td>
            </tr>
            ` : ''}
            
            ${data.revenus.activiteAccessoire ? `
            <tr>
                <td>&nbsp;&nbsp;1.2 Activité accessoire du/de la contribuable 1 (salaire net)</td>
                <td class="amount">${this.formatCurrency(data.revenus.activiteAccessoire.contribuable1SalaireNet)}</td>
            </tr>
            ${data.revenus.activiteAccessoire.contribuable2SalaireNet ? `
            <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;du/de la contribuable 2 (salaire net)</td>
                <td class="amount">${this.formatCurrency(data.revenus.activiteAccessoire.contribuable2SalaireNet)}</td>
            </tr>
            ` : ''}
            ` : ''}
            
            ${data.revenus.activiteIndependante ? `
            <tr style="background: #f9f9f9;">
                <td><strong>2. Revenus provenant de l'activité indépendante</strong> <em>joindre les formulaires</em></td>
                <td></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;2.1 Activité principale du/de la contribuable 1</td>
                <td class="amount">${this.formatCurrency(data.revenus.activiteIndependante.contribuable1Principale || 0)}</td>
            </tr>
            ` : ''}
            
            <tr style="background: #f9f9f9;">
                <td><strong>3. Revenus provenant des assurances sociales ou d'autres assurances</strong> <em>joindre les attestations</em></td>
                <td></td>
            </tr>
            ${data.revenus.assurancesSociales.rentesAVS ? `
            <tr>
                <td>&nbsp;&nbsp;3.1 Rentes AVS/AI (à 100%) du/de la contribuable 1</td>
                <td class="amount">${this.formatCurrency(data.revenus.assurancesSociales.rentesAVS.contribuable1)}</td>
            </tr>
            ` : ''}
            ${data.revenus.assurancesSociales.allocationsFamiliales ? `
            <tr>
                <td>&nbsp;&nbsp;3.4 Allocations familiales et pour enfants versées directement</td>
                <td class="amount">${this.formatCurrency(data.revenus.assurancesSociales.allocationsFamiliales)}</td>
            </tr>
            ` : ''}
            
            <tr style="background: #f9f9f9;">
                <td><strong>4. Rendement des titres et rendement d'avoirs, gains à la loterie et au lotto</strong> <em>état des titres</em></td>
                <td class="amount">${this.formatCurrency(data.revenus.rendementTitres || 0)}</td>
            </tr>
            
            ${data.revenus.autresRevenus ? `
            <tr style="background: #f9f9f9;">
                <td><strong>5. Autres revenus et bénéfices</strong></td>
                <td></td>
            </tr>
            ${data.revenus.autresRevenus.autres?.map(autre => `
            <tr>
                <td>&nbsp;&nbsp;5.4 ${autre.designation}</td>
                <td class="amount">${this.formatCurrency(autre.montant)}</td>
            </tr>
            `).join('') || ''}
            ` : ''}
            
            <tr class="total-row">
                <td><strong>6. Total intermédiaire des revenus</strong></td>
                <td class="amount"><strong>${this.formatCurrency(data.revenus.totalRevenus)}</strong></td>
            </tr>
            
            ${data.revenus.immeubles ? `
            <tr style="background: #f9f9f9;">
                <td colspan="2"><strong>A ne remplir que par les propriétaires d'immeubles</strong></td>
            </tr>
            <tr>
                <td><strong>7. Report du chiffre 6</strong></td>
                <td class="amount">${this.formatCurrency(data.revenus.totalRevenus)}</td>
            </tr>
            <tr>
                <td><strong>8. Revenus provenant d'immeubles</strong></td>
                <td></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;8.1 Rendement de la maison familiale - Valeur locative</td>
                <td class="amount">${this.formatCurrency(data.revenus.immeubles.maisonFamiliale?.valeurLocative || 0)}</td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;8.2 Moins frais d'entretien et d'exploitation</td>
                <td class="amount">-${this.formatCurrency(data.revenus.immeubles.maisonFamiliale?.fraisEntretien || 0)}</td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;8.3 Rendement net</td>
                <td class="amount">${this.formatCurrency(data.revenus.immeubles.maisonFamiliale?.rendementNet || 0)}</td>
            </tr>
            <tr class="total-row">
                <td><strong>9. Total des revenus, à reporter à la page 3, chiffre 18</strong></td>
                <td class="amount"><strong>${this.formatCurrency(data.revenus.totalRevenus + (data.revenus.immeubles.maisonFamiliale?.rendementNet || 0))}</strong></td>
            </tr>
            ` : `
            <tr class="total-row">
                <td><strong>9. Total des revenus, à reporter à la page 3, chiffre 18</strong></td>
                <td class="amount"><strong>${this.formatCurrency(data.revenus.totalRevenus)}</strong></td>
            </tr>
            `}
        </tbody>
    </table>
    
    <div class="page-number">2/4</div>
</div>`;
  }
  
  private static generatePage3(data: OfficialSwissTaxForm): string {
    return `
<div class="page">
    <div class="header">
        <div class="title">Déductions</div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th style="width: 60%;">Déductions ${data.periodeImpots}</th>
                <th style="width: 40%;">CHF sans centimes</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background: #f9f9f9;">
                <td><strong>10. Frais professionnels en cas d'activité lucrative dépendante</strong> <em>formule 9</em></td>
                <td></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;10.1 du/de la contribuable 1</td>
                <td class="amount">${this.formatCurrency(data.deductions.fraisProfessionnels.contribuable1)}</td>
            </tr>
            ${data.deductions.fraisProfessionnels.contribuable2 ? `
            <tr>
                <td>&nbsp;&nbsp;10.2 du/de la contribuable 2</td>
                <td class="amount">${this.formatCurrency(data.deductions.fraisProfessionnels.contribuable2)}</td>
            </tr>
            ` : ''}
            
            ${data.deductions.interetsPassifs ? `
            <tr>
                <td><strong>11. Intérêts passifs</strong> <em>état des dettes formule 14</em></td>
                <td class="amount">${this.formatCurrency(data.deductions.interetsPassifs)}</td>
            </tr>
            ` : ''}
            
            ${data.deductions.contributionsEntretien ? `
            <tr style="background: #f9f9f9;">
                <td><strong>12. Contributions d'entretien et rentes versées</strong> <em>joindre les preuves de paiement</em></td>
                <td></td>
            </tr>
            ${data.deductions.contributionsEntretien.pensionsConjoint ? `
            <tr>
                <td>&nbsp;&nbsp;12.1 Pensions versées au conjoint divorcé ou séparé</td>
                <td class="amount">${this.formatCurrency(data.deductions.contributionsEntretien.pensionsConjoint)}</td>
            </tr>
            ` : ''}
            ${data.deductions.contributionsEntretien.contributionsEnfants ? `
            <tr>
                <td>&nbsp;&nbsp;12.2 Contributions d'entretien versées aux enfants mineurs</td>
                <td class="amount">${this.formatCurrency(data.deductions.contributionsEntretien.contributionsEnfants)}</td>
            </tr>
            ` : ''}
            ` : ''}
            
            <tr style="background: #f9f9f9;">
                <td><strong>13. Cotisations à des formes reconnues de prévoyance individuelle liée (pilier 3a)</strong> <em>joindre les attestations</em></td>
                <td></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;13.1 du/de la contribuable 1</td>
                <td class="amount">${this.formatCurrency(data.deductions.pilier3a.contribuable1)}</td>
            </tr>
            ${data.deductions.pilier3a.contribuable2 ? `
            <tr>
                <td>&nbsp;&nbsp;13.2 du/de la contribuable 2</td>
                <td class="amount">${this.formatCurrency(data.deductions.pilier3a.contribuable2)}</td>
            </tr>
            ` : ''}
            
            <tr style="background: #f9f9f9;">
                <td><strong>14. Primes d'assurances et intérêts de capitaux d'épargne</strong></td>
                <td></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;Déduction maximale: CHF ${this.formatCurrency(data.deductions.assurancesEpargne.deductionMaximale)}</td>
                <td class="amount">${this.formatCurrency(Math.min(data.deductions.assurancesEpargne.montant, data.deductions.assurancesEpargne.deductionMaximale))}</td>
            </tr>
            ${data.deductions.assurancesEpargne.deductionSupplementaireParEnfant ? `
            <tr>
                <td>&nbsp;&nbsp;14.3 Déduction supplémentaire par enfant</td>
                <td class="amount">${this.formatCurrency(data.deductions.assurancesEpargne.deductionSupplementaireParEnfant)}</td>
            </tr>
            ` : ''}
            
            ${data.deductions.autresDeductions ? `
            <tr style="background: #f9f9f9;">
                <td><strong>15. Autres déductions</strong></td>
                <td></td>
            </tr>
            ${data.deductions.autresDeductions.gardeEnfants ? `
            <tr>
                <td>&nbsp;&nbsp;15.6 Déduction pour la garde des enfants par des tiers (max CHF 25'800 par enfant)</td>
                <td class="amount">${this.formatCurrency(data.deductions.autresDeductions.gardeEnfants)}</td>
            </tr>
            ` : ''}
            ${data.deductions.autresDeductions.autres?.map(autre => `
            <tr>
                <td>&nbsp;&nbsp;15.8 ${autre.designation}</td>
                <td class="amount">${this.formatCurrency(autre.montant)}</td>
            </tr>
            `).join('') || ''}
            ` : ''}
            
            ${data.deductions.coupleDeuxRevenus ? `
            <tr>
                <td><strong>16. Déduction pour couple à deux revenus (50% du revenu le moins élevé, min CHF 8'600, max CHF 14'100)</strong></td>
                <td class="amount">${this.formatCurrency(data.deductions.coupleDeuxRevenus)}</td>
            </tr>
            ` : ''}
            
            <tr class="total-row">
                <td><strong>17. Total des déductions, à reporter sous chiffre 19</strong></td>
                <td class="amount"><strong>${this.formatCurrency(data.deductions.totalDeductions)}</strong></td>
            </tr>
        </tbody>
    </table>
    
    <div class="section">
        <div class="section-title">Détermination du revenu</div>
        <table>
            <tbody>
                <tr>
                    <td><strong>18. Total des revenus (report de la page 2, chiffre 6 ou 9)</strong></td>
                    <td class="amount">${this.formatCurrency(data.calculs.totalRevenus)}</td>
                </tr>
                <tr>
                    <td><strong>19. Total des déductions (report du chiffre 17)</strong></td>
                    <td class="amount">-${this.formatCurrency(data.calculs.totalDeductions)}</td>
                </tr>
                <tr>
                    <td><strong>20. Revenu net I</strong></td>
                    <td class="amount">${this.formatCurrency(data.calculs.revenuNetI)}</td>
                </tr>
                <tr>
                    <td><strong>21. Déductions supplémentaires</strong></td>
                    <td class="amount">-${this.formatCurrency(data.calculs.deductionsSupplementaires?.fraisMaladieAccidents || 0)}</td>
                </tr>
                <tr>
                    <td><strong>22. Revenu net II (chiffre 20 moins chiffres 21.1 et 21.2)</strong></td>
                    <td class="amount">${this.formatCurrency(data.calculs.revenuNetII)}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                    <td><strong>23. Déductions sociales</strong></td>
                    <td></td>
                </tr>
                <tr>
                    <td>&nbsp;&nbsp;23.1 Déduction pour enfants (CHF 6'800 par enfant)</td>
                    <td class="amount">-${this.formatCurrency(data.calculs.deductionsSociales.deductionEnfants)}</td>
                </tr>
                <tr>
                    <td>&nbsp;&nbsp;23.2 Déduction pour l'entretien de personnes à charge (CHF 6'800 par personne)</td>
                    <td class="amount">-${this.formatCurrency(data.calculs.deductionsSociales.deductionPersonnesCharge)}</td>
                </tr>
                <tr>
                    <td>&nbsp;&nbsp;23.3 Déduction pour couples mariés (CHF 2'800)</td>
                    <td class="amount">-${this.formatCurrency(data.calculs.deductionsSociales.deductionCouplesMariesTax)}</td>
                </tr>
                <tr class="total-row" style="background: #e6f3ff;">
                    <td><strong>24. Revenu imposable (chiffre 22 moins chiffres 23.1, 23.2 et 23.3)</strong></td>
                    <td class="amount"><strong>${this.formatCurrency(data.calculs.revenuImposable)}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="page-number">3/4</div>
</div>`;
  }
  
  private static generatePage4(data: OfficialSwissTaxForm): string {
    return `
<div class="page">
    <div class="header">
        <div class="title">Fortune en suisse et à l'étranger</div>
        <div class="subtitle">du/de la contribuable 1, du/de la contribuable 2 et des enfants mineurs, y compris la fortune en usufruit</div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th style="width: 60%;">Valeur fiscale au 31.12.${data.periodeImpots}</th>
                <th style="width: 20%;">CHF sans centimes</th>
                <th style="width: 20%;">Part entreprise</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background: #f9f9f9;">
                <td><strong>25. Fortune mobilière</strong></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;25.1 Titres et avoirs <em>état des titres</em></td>
                <td class="amount">${this.formatCurrency(data.fortune.fortuneMobiliere.titresAvoirs || 0)}</td>
                <td class="amount">${this.formatCurrency(0)}</td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;25.2 Argent comptant, or et autres métaux précieux</td>
                <td class="amount">${this.formatCurrency(data.fortune.fortuneMobiliere.argentComptant || 0)}</td>
                <td class="amount">${this.formatCurrency(0)}</td>
            </tr>
            ${data.fortune.fortuneMobiliere.assurancesVie?.map((assurance, index) => `
            <tr>
                <td>&nbsp;&nbsp;25.3 Assurances sur la vie - ${assurance.compagnie} (${assurance.anneeContrat}-${assurance.anneeEcheance})</td>
                <td class="amount">${this.formatCurrency(assurance.valeurRachat)}</td>
                <td class="amount">${this.formatCurrency(0)}</td>
            </tr>
            `).join('') || ''}
            ${data.fortune.fortuneMobiliere.vehicules?.map((vehicule, index) => `
            <tr>
                <td>&nbsp;&nbsp;25.4 Véhicules à moteur - ${vehicule.genre} (${vehicule.annee})</td>
                <td class="amount">${this.formatCurrency(vehicule.prixAchat * 0.7)}</td>
                <td class="amount">${this.formatCurrency(0)}</td>
            </tr>
            `).join('') || ''}
            
            ${data.fortune.immeubles ? `
            <tr style="background: #f9f9f9;">
                <td><strong>26. Immeubles, valeur fiscale cantonale</strong></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;26.1 Maison familiale - ${data.fortune.immeubles.maisonFamiliale?.commune} ${data.fortune.immeubles.maisonFamiliale?.rue}</td>
                <td class="amount">${this.formatCurrency(data.fortune.immeubles.maisonFamiliale?.valeurFiscale || 0)}</td>
                <td class="amount">${this.formatCurrency(0)}</td>
            </tr>
            ` : ''}
            
            ${data.fortune.activiteIndependante ? `
            <tr style="background: #f9f9f9;">
                <td><strong>27. Activité lucrative indépendante</strong></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;27.1 Capital propre (comptabilité commerciale)</td>
                <td class="amount">${this.formatCurrency(data.fortune.activiteIndependante.capitalPropre || 0)}</td>
                <td class="amount">${this.formatCurrency(data.fortune.activiteIndependante.capitalPropre || 0)}</td>
            </tr>
            ` : ''}
            
            <tr class="total-row">
                <td><strong>28. Total des éléments de la fortune</strong></td>
                <td class="amount"><strong>${this.formatCurrency(data.fortune.totalElementsFortune)}</strong></td>
                <td class="amount"><strong>${this.formatCurrency(0)}</strong></td>
            </tr>
            <tr>
                <td><strong>29. Dettes</strong> <em>état des dettes</em></td>
                <td class="amount">-${this.formatCurrency(data.fortune.dettes)}</td>
                <td class="amount">-${this.formatCurrency(0)}</td>
            </tr>
            <tr class="total-row" style="background: #e6f3ff;">
                <td><strong>30. Fortune nette (chiffre 28 moins chiffre 29)</strong></td>
                <td class="amount"><strong>${this.formatCurrency(data.fortune.fortuneNette)}</strong></td>
                <td class="amount"><strong>${this.formatCurrency(0)}</strong></td>
            </tr>
        </tbody>
    </table>
    
    ${data.donations && data.donations.length > 0 ? `
    <div class="section">
        <div class="section-title">Donations, avancement d'hoirie, successions, participation à des hoiries</div>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Bénéficiaire/Donateur</th>
                    <th>Valeur CHF</th>
                </tr>
            </thead>
            <tbody>
                ${data.donations.map(donation => `
                <tr>
                    <td>${donation.date}</td>
                    <td>${donation.type}</td>
                    <td>${donation.beneficiaire || donation.donateur || ''}</td>
                    <td class="amount">${this.formatCurrency(donation.valeur)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}
    
    ${data.prestationsCapital && data.prestationsCapital.length > 0 ? `
    <div class="section">
        <div class="section-title">Prestations en capital provenant de la prévoyance</div>
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Montant CHF</th>
                    <th>Date du versement</th>
                </tr>
            </thead>
            <tbody>
                ${data.prestationsCapital.map(prestation => `
                <tr>
                    <td>${prestation.type}</td>
                    <td class="amount">${this.formatCurrency(prestation.montant)}</td>
                    <td>${prestation.dateVersement}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}
    
    <div class="section">
        <div class="section-title">Déclaration finale</div>
        <p><strong>Les indications données dans cette déclaration sont exactes et complètes</strong></p>
        <br>
        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
            <div>
                <strong>Lieu et date:</strong><br>
                ${data.lieuSignature}, ${data.dateSignature}
            </div>
            <div style="text-align: center;">
                <div style="border-bottom: 1px solid #333; width: 200px; margin-bottom: 5px;"></div>
                <strong>Signature du/de la contribuable 1</strong>
            </div>
            ${data.contribuable2 ? `
            <div style="text-align: center;">
                <div style="border-bottom: 1px solid #333; width: 200px; margin-bottom: 5px;"></div>
                <strong>Signature du/de la contribuable 2</strong>
            </div>
            ` : ''}
        </div>
    </div>
    
    ${data.remarques ? `
    <div class="section">
        <div class="section-title">Remarques</div>
        <p>${data.remarques}</p>
    </div>
    ` : ''}
    
    <div class="page-number">4/4</div>
</div>`;
  }
  
  // Méthodes utilitaires
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(amount));
  }
  
  private static mapCivilStatus(status: string): string {
    const mapping: { [key: string]: string } = {
      'single': 'Célibataire',
      'married': 'Marié(e)',
      'divorced': 'Divorcé(e)',
      'widowed': 'Veuf/Veuve',
      'separated': 'Séparé(e)'
    };
    return mapping[status] || 'Célibataire';
  }
  
  private static mapConfession(confession: string): string {
    const mapping: { [key: string]: string } = {
      'reformed': 'Réformé',
      'catholic': 'Catholique',
      'orthodox': 'Orthodoxe',
      'jewish': 'Juif',
      'muslim': 'Musulman',
      'other': 'Autre',
      'none': 'Aucune'
    };
    return mapping[confession] || 'Aucune';
  }
  
  private static generateChildrenData(numberOfChildren: number): Array<any> {
    const children = [];
    for (let i = 0; i < numberOfChildren; i++) {
      children.push({
        nom: 'Enfant',
        prenom: `${i + 1}`,
        dateNaissance: `01.01.${2010 + i}`,
        enVotreMenage: true,
        ecoleEmployeur: 'École primaire',
        enPrincipeJusqua: `${18 + i} ans`,
        autreParentVerseContributions: false
      });
    }
    return children;
  }
  
  private static calculateTotalDeductions(deductions: any): number {
    let total = 0;
    
    // Frais professionnels
    total += deductions.professionalExpenses?.total || 0;
    
    // Pilier 3a
    total += deductions.savingsContributions?.pillar3a || 0;
    
    // Assurances
    total += deductions.insurancePremiums?.healthInsurance || 0;
    total += deductions.insurancePremiums?.lifeInsurance || 0;
    
    // Garde d'enfants
    total += deductions.childcareExpenses || 0;
    
    // Dons
    total += deductions.donations?.amount || 0;
    
    return total;
  }
  
  private static getInsuranceDeductionLimit(civilStatus: string, hasPillar3a: boolean): number {
    if (civilStatus === 'married') {
      return hasPillar3a ? 3700 : 5550;
    } else {
      return hasPillar3a ? 1800 : 2700;
    }
  }
}