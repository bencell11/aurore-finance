/**
 * Service professionnel de mapping et remplissage automatique
 * des formulaires fiscaux suisses officiels
 * 
 * Basé sur le formulaire officiel 2 605.040.11f (période fiscale 2025)
 */

export interface SwissTaxFormData {
  // Section 1: Informations personnelles
  canton: string;
  commune: string;
  numeroControle?: string;
  
  contribuable1: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    etatCivil: string;
    communeOrigine: string;
    confession: string;
    profession: string;
    employeur: string;
    employeurDepuis: string;
    lieuTravail: string;
    telProfessionnel: string;
    telPrive: string;
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
    employeurDepuis: string;
    lieuTravail: string;
    telProfessionnel: string;
    telPrive: string;
    email: string;
  };
  
  enfants: Array<{
    nom: string;
    prenom: string;
    dateNaissance: string;
    enVotreMenage: boolean;
    ecoleEmployeur: string;
    enPrincipeJusqua: string;
    autreParentVerseContributions: boolean;
  }>;
  
  personnesACharge: Array<{
    nom: string;
    prenom: string;
    anneeNaissance: string;
    enVotreMenage: boolean;
    adresse: string;
    contributionAnnuelle: number;
  }>;
  
  // Section 2: Revenus
  revenus: {
    activiteDependante: {
      activitePrincipaleC1: number;
      activitePrincipaleC2?: number;
      activiteAccessoireC1?: number;
      activiteAccessoireC2?: number;
    };
    
    activiteIndependante: {
      activitePrincipaleC1?: number;
      activitePrincipaleC2?: number;
      activiteAccessoireC1?: number;
      activiteAccessoireC2?: number;
    };
    
    assurancesSociales: {
      rentesAVSAI_C1?: number;
      rentesAVSAI_C2?: number;
      rentsPensions: Array<{
        contribuable: 1 | 2;
        montant: number;
        pourcentage: number;
        debiteur: {
          nom: string;
          adresse: string;
        };
      }>;
      indemnitesPertesGain_C1?: number;
      indemnitesPertesGain_C2?: number;
      allocationsFamiliales?: number;
    };
    
    rendementTitres?: number;
    
    autresRevenus: {
      pensionsConjointDivorce?: number;
      contributionsEntretienEnfants?: number;
      revenusSuccessions?: number;
      autresRevenus?: number;
      versementCapitaux?: {
        montant: number;
        annees: string;
      };
    };
    
    immeubles?: {
      maisonFamiliale?: {
        valeurLocative: number;
        loyers: number;
        rendementBrut: number;
        fraisEntretien: number;
        rendementNet: number;
      };
      plusieursImmeubles?: number;
    };
  };
  
  // Section 3: Déductions
  deductions: {
    fraisProfessionnels: {
      contribuable1?: number;
      contribuable2?: number;
    };
    
    interetsPassifs?: number;
    
    contributionsEntretien: {
      pensionsConjoint?: number;
      contributionsEnfants?: number;
      prestationsRente?: number;
    };
    
    prevoyanceIndividuelle: {
      pilier3a_C1?: number;
      pilier3a_C2?: number;
    };
    
    primesAssurances: {
      deductionMaximale: number; // Calculé selon statut
      montant: number;
    };
    
    autresDeductions: {
      cotisationsAVS?: number;
      fraisFormation?: number;
      cotisationsPrevoyancePro?: number;
      cotisationsPartiPolitique?: number;
      fraisHandicap?: number;
      fraisGardeEnfants?: number;
      fraisAdministrationTitres?: number;
      autresDeductions?: number;
    };
    
    deductionCoupleDeuxRevenus?: number;
    
    deductionsSupplementaires: {
      fraisMaladieAccidents?: number;
      versementsBenevolat?: number;
    };
    
    deductionsSociales: {
      deductionEnfants: number; // CHF 6800 par enfant
      deductionPersonnesCharge: number; // CHF 6800 par personne
      deductionCouplesMaries?: number; // CHF 2800
    };
  };
  
  // Section 4: Fortune
  fortune: {
    fortuneMobiliere: {
      titresAvoirs?: number;
      argentComptant?: number;
      assurancesVieRentes?: Array<{
        compagnie: string;
        anneeContrat: string;
        anneeEcheance: string;
        montantAssurance: number;
        valeurRachat: number;
      }>;
      vehiculesMoteur?: Array<{
        genre: string;
        prixAchat: number;
        annee: string;
      }>;
      partsSuccessions?: number;
      autresElementsFortune?: number;
    };
    
    immeubles?: {
      maisonFamiliale?: {
        commune: string;
        rue: string;
        valeurFiscale: number;
      };
      plusieursImmeubles?: number;
    };
    
    activiteIndependante?: {
      capitalPropre?: number;
      actifsSansImmeuble?: number;
    };
    
    dettes?: number;
  };
  
  // Métadonnées
  metadata: {
    dateRemplissage: string;
    versionFormulaire: string;
    generePar: string;
    statutValidation: 'brouillon' | 'valide' | 'soumis';
  };
}

export class SwissTaxFormMapperService {
  
  /**
   * Convertit les données du profil utilisateur vers le format officiel
   */
  static mapProfileToOfficialForm(profile: any): SwissTaxFormData {
    const personalInfo = profile.personalInfo || {};
    const incomeData = profile.incomeData || {};
    const deductions = profile.deductions || {};
    const assets = profile.assets || {};
    
    return {
      // Informations de base
      canton: personalInfo.canton || 'VD',
      commune: personalInfo.commune || personalInfo.municipality || 'Lausanne',
      numeroControle: profile.id || '',
      
      // Contribuable principal
      contribuable1: {
        nom: this.extractLastName(profile.name || 'Nom utilisateur'),
        prenom: this.extractFirstName(profile.name || 'Prénom utilisateur'),
        dateNaissance: this.formatDateOfBirth(profile.dateOfBirth || '01.01.1990'),
        etatCivil: this.mapCivilStatus(personalInfo.civilStatus || 'single'),
        communeOrigine: personalInfo.communeOrigine || personalInfo.commune || 'Lausanne',
        confession: this.mapConfession(personalInfo.confession || 'none'),
        profession: incomeData.mainEmployment?.position || 'Employé',
        employeur: incomeData.mainEmployment?.employer || incomeData.mainEmployment?.employerName || 'Employeur',
        employeurDepuis: this.formatEmploymentDate(incomeData.mainEmployment?.startDate || '2020-01-01'),
        lieuTravail: personalInfo.commune || 'Lausanne',
        telProfessionnel: profile.phone?.professional || '',
        telPrive: profile.phone?.private || '',
        email: profile.email || ''
      },
      
      // Enfants
      enfants: this.mapChildren(personalInfo.numberOfChildren || 0),
      
      // Personnes à charge
      personnesACharge: [],
      
      // Revenus
      revenus: {
        activiteDependante: {
          activitePrincipaleC1: incomeData.mainEmployment?.grossSalary || 0,
          activitePrincipaleC2: 0,
          activiteAccessoireC1: 0,
          activiteAccessoireC2: 0
        },
        
        activiteIndependante: {
          activitePrincipaleC1: 0,
          activitePrincipaleC2: 0,
          activiteAccessoireC1: 0,
          activiteAccessoireC2: 0
        },
        
        assurancesSociales: {
          rentesAVSAI_C1: incomeData.pensionIncome?.avsRente || 0,
          rentesAVSAI_C2: 0,
          rentsPensions: [],
          indemnitesPertesGain_C1: incomeData.unemploymentBenefits || 0,
          indemnitesPertesGain_C2: 0,
          allocationsFamiliales: 0
        },
        
        rendementTitres: 0,
        
        autresRevenus: {
          pensionsConjointDivorce: 0,
          contributionsEntretienEnfants: 0,
          revenusSuccessions: 0,
          autresRevenus: incomeData.otherIncome?.amount || incomeData.rentalIncome || 0,
          versementCapitaux: undefined
        },
        
        immeubles: undefined
      },
      
      // Déductions
      deductions: {
        fraisProfessionnels: {
          contribuable1: deductions.professionalExpenses?.total || 
                        this.calculateProfessionalExpenses(deductions.professionalExpenses),
          contribuable2: 0
        },
        
        interetsPassifs: 0,
        
        contributionsEntretien: {
          pensionsConjoint: 0,
          contributionsEnfants: 0,
          prestationsRente: 0
        },
        
        prevoyanceIndividuelle: {
          pilier3a_C1: deductions.savingsContributions?.pillar3a || 0,
          pillar3a_C2: deductions.savingsContributions?.pillar3b || 0
        },
        
        primesAssurances: {
          deductionMaximale: this.calculateMaxInsuranceDeduction(personalInfo.civilStatus, personalInfo.numberOfChildren),
          montant: (deductions.insurancePremiums?.healthInsurance || 0) + 
                  (deductions.insurancePremiums?.lifeInsurance || 0)
        },
        
        autresDeductions: {
          cotisationsAVS: 0,
          fraisFormation: 0,
          cotisationsPrevoyancePro: 0,
          cotisationsPartiPolitique: 0,
          fraisHandicap: 0,
          fraisGardeEnfants: deductions.childcareExpenses || 0,
          fraisAdministrationTitres: 0,
          autresDeductions: 0
        },
        
        deductionCoupleDeuxRevenus: this.calculateCoupleDeduction(personalInfo.civilStatus, incomeData),
        
        deductionsSupplementaires: {
          fraisMaladieAccidents: 0,
          versementsBenevolat: deductions.donationsAmount || deductions.donations?.amount || 0
        },
        
        deductionsSociales: {
          deductionEnfants: (personalInfo.numberOfChildren || 0) * 6800,
          deductionPersonnesCharge: 0,
          deductionCouplesMaries: personalInfo.civilStatus === 'married' ? 2800 : 0
        }
      },
      
      // Fortune
      fortune: {
        fortuneMobiliere: {
          titresAvoirs: assets.stocks?.totalValue || 0,
          argentComptant: this.calculateCashAssets(assets.bankAccounts || []),
          assurancesVieRentes: [],
          vehiculesMoteur: [],
          partsSuccessions: 0,
          autresElementsFortune: assets.otherAssets?.totalValue || 0
        },
        
        immeubles: assets.realEstate?.totalValue ? {
          maisonFamiliale: {
            commune: personalInfo.commune || 'Lausanne',
            rue: '',
            valeurFiscale: assets.realEstate.totalValue
          }
        } : undefined,
        
        activiteIndependante: undefined,
        
        dettes: 0
      },
      
      // Métadonnées
      metadata: {
        dateRemplissage: new Date().toISOString(),
        versionFormulaire: '2 605.040.11f (période fiscale 2025)',
        generePar: 'Aurore Finance - Assistant Fiscal',
        statutValidation: 'brouillon'
      }
    };
  }
  
  /**
   * Génère le document PDF rempli
   */
  static async generateFilledPDF(formData: SwissTaxFormData): Promise<string> {
    // Pour une vraie implémentation, on utiliserait PDF-lib ou similar
    // Ici on génère un HTML structuré pour l'impression
    
    return this.generateHTMLDeclaration(formData);
  }
  
  /**
   * Génère la déclaration HTML complète et structurée
   */
  private static generateHTMLDeclaration(data: SwissTaxFormData): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Déclaration d'impôt 2025 - ${data.contribuable1.nom} ${data.contribuable1.prenom}</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            font-size: 10pt; 
            line-height: 1.2; 
            margin: 0; 
            padding: 20px;
        }
        .form-header {
            text-align: center;
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .section {
            margin: 15px 0;
            page-break-inside: avoid;
        }
        .section-title {
            background: #f0f0f0;
            padding: 5px 10px;
            font-weight: bold;
            border: 1px solid #000;
            margin-bottom: 10px;
        }
        .field-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            border-bottom: 1px solid #ddd;
        }
        .field-label {
            flex: 1;
            padding-right: 10px;
        }
        .field-value {
            flex: 0 0 150px;
            text-align: right;
            font-weight: bold;
        }
        .subsection {
            margin-left: 20px;
            margin-top: 10px;
        }
        .amount {
            font-family: 'Courier New', monospace;
        }
        .total-row {
            background: #ffffcc;
            font-weight: bold;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="form-header">
        DÉCLARATION 2025 DES PERSONNES PHYSIQUES<br>
        Canton: ${data.canton} | Commune: ${data.commune}<br>
        IMPÔT CANTONAL ET COMMUNAL | IMPÔT FÉDÉRAL DIRECT
    </div>

    <!-- Section 1: Informations personnelles -->
    <div class="section">
        <div class="section-title">1. SITUATION PERSONNELLE, PROFESSIONNELLE ET FAMILIALE</div>
        
        <h4>Contribuable 1</h4>
        <div class="field-row">
            <span class="field-label">Nom, prénom:</span>
            <span class="field-value">${data.contribuable1.nom}, ${data.contribuable1.prenom}</span>
        </div>
        <div class="field-row">
            <span class="field-label">Date de naissance:</span>
            <span class="field-value">${data.contribuable1.dateNaissance}</span>
        </div>
        <div class="field-row">
            <span class="field-label">État civil:</span>
            <span class="field-value">${data.contribuable1.etatCivil}</span>
        </div>
        <div class="field-row">
            <span class="field-label">Commune d'origine:</span>
            <span class="field-value">${data.contribuable1.communeOrigine}</span>
        </div>
        <div class="field-row">
            <span class="field-label">Confession:</span>
            <span class="field-value">${data.contribuable1.confession}</span>
        </div>
        <div class="field-row">
            <span class="field-label">Profession:</span>
            <span class="field-value">${data.contribuable1.profession}</span>
        </div>
        <div class="field-row">
            <span class="field-label">Employeur:</span>
            <span class="field-value">${data.contribuable1.employeur}</span>
        </div>
        <div class="field-row">
            <span class="field-label">Lieu de travail:</span>
            <span class="field-value">${data.contribuable1.lieuTravail}</span>
        </div>
        <div class="field-row">
            <span class="field-label">E-Mail:</span>
            <span class="field-value">${data.contribuable1.email}</span>
        </div>
        
        ${data.enfants.length > 0 ? `
        <h4>Enfants mineurs ou en formation</h4>
        ${data.enfants.map(enfant => `
        <div class="field-row">
            <span class="field-label">${enfant.nom}, ${enfant.prenom} (${enfant.dateNaissance}):</span>
            <span class="field-value">${enfant.enVotreMenage ? 'En ménage' : 'Hors ménage'}</span>
        </div>
        `).join('')}
        ` : ''}
    </div>

    <!-- Section 2: Revenus -->
    <div class="section">
        <div class="section-title">2. REVENUS EN SUISSE ET À L'ÉTRANGER</div>
        
        <h4>1. Revenus provenant de l'activité dépendante</h4>
        <div class="subsection">
            <div class="field-row">
                <span class="field-label">1.1 Activité principale du/de la contribuable 1 (salaire net):</span>
                <span class="field-value amount">${this.formatCurrency(data.revenus.activiteDependante.activitePrincipaleC1)}</span>
            </div>
            ${data.revenus.activiteDependante.activitePrincipaleC2 ? `
            <div class="field-row">
                <span class="field-label">du/de la contribuable 2 (salaire net):</span>
                <span class="field-value amount">${this.formatCurrency(data.revenus.activiteDependante.activitePrincipaleC2)}</span>
            </div>
            ` : ''}
        </div>

        <h4>3. Revenus provenant des assurances sociales</h4>
        <div class="subsection">
            ${data.revenus.assurancesSociales.rentesAVSAI_C1 ? `
            <div class="field-row">
                <span class="field-label">3.1 Rentes AVS/AI (à 100%) du/de la contribuable 1:</span>
                <span class="field-value amount">${this.formatCurrency(data.revenus.assurancesSociales.rentesAVSAI_C1)}</span>
            </div>
            ` : ''}
            ${data.revenus.assurancesSociales.indemnitesPertesGain_C1 ? `
            <div class="field-row">
                <span class="field-label">3.3 Indemnités pour perte de gain:</span>
                <span class="field-value amount">${this.formatCurrency(data.revenus.assurancesSociales.indemnitesPertesGain_C1)}</span>
            </div>
            ` : ''}
        </div>

        ${data.revenus.autresRevenus.autresRevenus ? `
        <h4>5. Autres revenus et bénéfices</h4>
        <div class="subsection">
            <div class="field-row">
                <span class="field-label">5.4 Autres revenus:</span>
                <span class="field-value amount">${this.formatCurrency(data.revenus.autresRevenus.autresRevenus)}</span>
            </div>
        </div>
        ` : ''}

        <div class="field-row total-row">
            <span class="field-label">6. TOTAL INTERMÉDIAIRE DES REVENUS:</span>
            <span class="field-value amount">${this.formatCurrency(this.calculateTotalRevenue(data.revenus))}</span>
        </div>
        
        <div class="field-row total-row">
            <span class="field-label">9. TOTAL DES REVENUS:</span>
            <span class="field-value amount">${this.formatCurrency(this.calculateTotalRevenue(data.revenus))}</span>
        </div>
    </div>

    <!-- Section 3: Déductions -->
    <div class="section">
        <div class="section-title">3. DÉDUCTIONS</div>
        
        <h4>10. Frais professionnels en cas d'activité lucrative dépendante</h4>
        <div class="subsection">
            <div class="field-row">
                <span class="field-label">10.1 du/de la contribuable 1:</span>
                <span class="field-value amount">${this.formatCurrency(data.deductions.fraisProfessionnels.contribuable1)}</span>
            </div>
        </div>

        <h4>13. Cotisations à des formes reconnues de prévoyance individuelle liée (pilier 3a)</h4>
        <div class="subsection">
            <div class="field-row">
                <span class="field-label">13.1 du/de la contribuable 1:</span>
                <span class="field-value amount">${this.formatCurrency(data.deductions.prevoyanceIndividuelle.pilier3a_C1)}</span>
            </div>
        </div>

        <h4>14. Primes d'assurances et intérêts de capitaux d'épargne</h4>
        <div class="subsection">
            <div class="field-row">
                <span class="field-label">Déduction maximale autorisée:</span>
                <span class="field-value amount">${this.formatCurrency(data.deductions.primesAssurances.deductionMaximale)}</span>
            </div>
            <div class="field-row">
                <span class="field-label">Montant déclaré:</span>
                <span class="field-value amount">${this.formatCurrency(Math.min(data.deductions.primesAssurances.montant, data.deductions.primesAssurances.deductionMaximale))}</span>
            </div>
        </div>

        ${data.deductions.autresDeductions.fraisGardeEnfants ? `
        <h4>15. Autres déductions</h4>
        <div class="subsection">
            <div class="field-row">
                <span class="field-label">15.6 Déduction pour la garde des enfants par des tiers:</span>
                <span class="field-value amount">${this.formatCurrency(Math.min(data.deductions.autresDeductions.fraisGardeEnfants, 25800 * data.enfants.length))}</span>
            </div>
        </div>
        ` : ''}

        ${data.deductions.deductionCoupleDeuxRevenus ? `
        <div class="field-row">
            <span class="field-label">16. Déduction pour couple à deux revenus:</span>
            <span class="field-value amount">${this.formatCurrency(data.deductions.deductionCoupleDeuxRevenus)}</span>
        </div>
        ` : ''}

        <div class="field-row total-row">
            <span class="field-label">17. TOTAL DES DÉDUCTIONS:</span>
            <span class="field-value amount">${this.formatCurrency(this.calculateTotalDeductions(data.deductions))}</span>
        </div>
    </div>

    <!-- Section 4: Détermination du revenu -->
    <div class="section">
        <div class="section-title">4. DÉTERMINATION DU REVENU</div>
        
        <div class="field-row">
            <span class="field-label">18. Total des revenus:</span>
            <span class="field-value amount">${this.formatCurrency(this.calculateTotalRevenue(data.revenus))}</span>
        </div>
        <div class="field-row">
            <span class="field-label">19. Total des déductions:</span>
            <span class="field-value amount">-${this.formatCurrency(this.calculateTotalDeductions(data.deductions))}</span>
        </div>
        <div class="field-row">
            <span class="field-label">20. Revenu net I:</span>
            <span class="field-value amount">${this.formatCurrency(Math.max(0, this.calculateTotalRevenue(data.revenus) - this.calculateTotalDeductions(data.deductions)))}</span>
        </div>

        <h4>21. Déductions supplémentaires</h4>
        <div class="subsection">
            ${data.deductions.deductionsSupplementaires.versementsBenevolat ? `
            <div class="field-row">
                <span class="field-label">21.2 Versements bénévoles:</span>
                <span class="field-value amount">-${this.formatCurrency(data.deductions.deductionsSupplementaires.versementsBenevolat)}</span>
            </div>
            ` : ''}
        </div>

        <div class="field-row">
            <span class="field-label">22. Revenu net II:</span>
            <span class="field-value amount">${this.formatCurrency(this.calculateRevenuNetII(data))}</span>
        </div>

        <h4>23. Déductions sociales</h4>
        <div class="subsection">
            ${data.deductions.deductionsSociales.deductionEnfants > 0 ? `
            <div class="field-row">
                <span class="field-label">23.1 Déduction pour enfants (${data.enfants.length} × CHF 6'800):</span>
                <span class="field-value amount">-${this.formatCurrency(data.deductions.deductionsSociales.deductionEnfants)}</span>
            </div>
            ` : ''}
            ${data.deductions.deductionsSociales.deductionCouplesMaries ? `
            <div class="field-row">
                <span class="field-label">23.3 Déduction pour couples mariés:</span>
                <span class="field-value amount">-${this.formatCurrency(data.deductions.deductionsSociales.deductionCouplesMaries)}</span>
            </div>
            ` : ''}
        </div>

        <div class="field-row total-row">
            <span class="field-label">24. REVENU IMPOSABLE:</span>
            <span class="field-value amount">${this.formatCurrency(this.calculateRevenuImposable(data))}</span>
        </div>
    </div>

    <!-- Section 5: Fortune -->
    <div class="section">
        <div class="section-title">5. FORTUNE EN SUISSE ET À L'ÉTRANGER</div>
        
        <h4>25. Fortune mobilière</h4>
        <div class="subsection">
            ${data.fortune.fortuneMobiliere.titresAvoirs ? `
            <div class="field-row">
                <span class="field-label">25.1 Titres et avoirs:</span>
                <span class="field-value amount">${this.formatCurrency(data.fortune.fortuneMobiliere.titresAvoirs)}</span>
            </div>
            ` : ''}
            ${data.fortune.fortuneMobiliere.argentComptant ? `
            <div class="field-row">
                <span class="field-label">25.2 Argent comptant, or et autres métaux précieux:</span>
                <span class="field-value amount">${this.formatCurrency(data.fortune.fortuneMobiliere.argentComptant)}</span>
            </div>
            ` : ''}
        </div>

        ${data.fortune.immeubles ? `
        <h4>26. Immeubles, valeur fiscale cantonale</h4>
        <div class="subsection">
            <div class="field-row">
                <span class="field-label">26.1 Maison familiale (${data.fortune.immeubles.maisonFamiliale.commune}):</span>
                <span class="field-value amount">${this.formatCurrency(data.fortune.immeubles.maisonFamiliale.valeurFiscale)}</span>
            </div>
        </div>
        ` : ''}

        <div class="field-row">
            <span class="field-label">28. Total des éléments de la fortune:</span>
            <span class="field-value amount">${this.formatCurrency(this.calculateTotalAssets(data.fortune))}</span>
        </div>
        <div class="field-row">
            <span class="field-label">29. Dettes:</span>
            <span class="field-value amount">-${this.formatCurrency(data.fortune.dettes || 0)}</span>
        </div>
        <div class="field-row total-row">
            <span class="field-label">30. FORTUNE NETTE:</span>
            <span class="field-value amount">${this.formatCurrency(this.calculateTotalAssets(data.fortune) - (data.fortune.dettes || 0))}</span>
        </div>
    </div>

    <!-- Signatures -->
    <div class="section">
        <div class="section-title">ATTESTATION ET SIGNATURES</div>
        <p><strong>Les indications données dans cette déclaration sont exactes et complètes</strong></p>
        <br><br>
        <div style="display: flex; justify-content: space-between;">
            <div>
                <strong>Lieu et date:</strong><br>
                ${data.commune}, ${new Date().toLocaleDateString('fr-CH')}
            </div>
            <div>
                <strong>Signature du/de la contribuable 1:</strong><br>
                _______________________________<br>
                ${data.contribuable1.prenom} ${data.contribuable1.nom}
            </div>
            ${data.contribuable2 ? `
            <div>
                <strong>Signature du/de la contribuable 2:</strong><br>
                _______________________________<br>
                ${data.contribuable2.prenom} ${data.contribuable2.nom}
            </div>
            ` : ''}
        </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 40px; text-align: center; font-size: 8pt; color: #666;">
        Document généré par Aurore Finance - Assistant Fiscal (Mode Démonstration)<br>
        Formulaire ${data.metadata.versionFormulaire} - Généré le ${new Date().toLocaleDateString('fr-CH')} à ${new Date().toLocaleTimeString('fr-CH')}
    </div>
</body>
</html>
    `;
  }
  
  // Méthodes helper privées
  private static extractLastName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1] || 'Nom';
  }
  
  private static extractFirstName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts.slice(0, -1).join(' ') || 'Prénom';
  }
  
  private static formatDateOfBirth(date: string): string {
    // Convertit diverses formats vers DD.MM.YYYY
    if (date.includes('-')) {
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    }
    return date;
  }
  
  private static mapCivilStatus(status: string): string {
    const mapping: { [key: string]: string } = {
      'single': 'Célibataire',
      'married': 'Marié(e)',
      'divorced': 'Divorcé(e)',
      'widowed': 'Veuf/Veuve',
      'separated': 'Séparé(e)',
      'registered_partnership': 'Partenariat enregistré'
    };
    return mapping[status] || 'Célibataire';
  }
  
  private static mapConfession(confession: string): string {
    const mapping: { [key: string]: string } = {
      'none': 'Sans confession',
      'protestant': 'Protestant',
      'catholic': 'Catholique',
      'other': 'Autre'
    };
    return mapping[confession] || 'Sans confession';
  }
  
  private static formatEmploymentDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getFullYear()}`;
  }
  
  private static mapChildren(numberOfChildren: number): Array<any> {
    const children = [];
    for (let i = 0; i < numberOfChildren; i++) {
      children.push({
        nom: 'Enfant',
        prenom: `${i + 1}`,
        dateNaissance: '01.01.2010',
        enVotreMenage: true,
        ecoleEmployeur: 'École primaire',
        enPrincipeJusqua: '18 ans',
        autreParentVerseContributions: false
      });
    }
    return children;
  }
  
  private static calculateProfessionalExpenses(expenses: any): number {
    if (!expenses) return 0;
    return (expenses.transportCosts || 0) + 
           (expenses.mealCosts || 0) + 
           (expenses.otherProfessionalExpenses || 0);
  }
  
  private static calculateMaxInsuranceDeduction(civilStatus: string, numberOfChildren: number): number {
    const isMarried = civilStatus === 'married';
    let baseDeduction;
    
    if (isMarried) {
      baseDeduction = 3700; // Mariés avec pilier 2/3a
    } else {
      baseDeduction = 1800; // Autres avec pilier 2/3a
    }
    
    return baseDeduction + (numberOfChildren * 700);
  }
  
  private static calculateCoupleDeduction(civilStatus: string, incomeData: any): number {
    if (civilStatus !== 'married') return 0;
    
    // Simplification: assume spouse has lower income
    const mainIncome = incomeData.mainEmployment?.grossSalary || 0;
    const spouseIncome = 0; // À implémenter si données disponibles
    
    if (spouseIncome > 0) {
      const lowerIncome = Math.min(mainIncome, spouseIncome);
      const deduction = lowerIncome * 0.5;
      return Math.max(8600, Math.min(14100, deduction));
    }
    
    return 0;
  }
  
  private static calculateCashAssets(bankAccounts: any[]): number {
    return bankAccounts.reduce((total, account) => total + (account.balance || 0), 0);
  }
  
  private static formatCurrency(amount: number): string {
    return amount.toLocaleString('fr-CH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
  
  private static calculateTotalRevenue(revenus: any): number {
    return (revenus.activiteDependante.activitePrincipaleC1 || 0) +
           (revenus.activiteDependante.activitePrincipaleC2 || 0) +
           (revenus.assurancesSociales.rentesAVSAI_C1 || 0) +
           (revenus.assurancesSociales.indemnitesPertesGain_C1 || 0) +
           (revenus.autresRevenus.autresRevenus || 0) +
           (revenus.rendementTitres || 0);
  }
  
  private static calculateTotalDeductions(deductions: any): number {
    return (deductions.fraisProfessionnels.contribuable1 || 0) +
           (deductions.prevoyanceIndividuelle.pilier3a_C1 || 0) +
           Math.min(deductions.primesAssurances.montant || 0, deductions.primesAssurances.deductionMaximale || 0) +
           (deductions.autresDeductions.fraisGardeEnfants || 0) +
           (deductions.deductionCoupleDeuxRevenus || 0);
  }
  
  private static calculateRevenuNetII(data: any): number {
    const revenuNetI = Math.max(0, this.calculateTotalRevenue(data.revenus) - this.calculateTotalDeductions(data.deductions));
    return Math.max(0, revenuNetI - (data.deductions.deductionsSupplementaires.versementsBenevolat || 0));
  }
  
  private static calculateRevenuImposable(data: any): number {
    const revenuNetII = this.calculateRevenuNetII(data);
    const deductionsSociales = (data.deductions.deductionsSociales.deductionEnfants || 0) +
                              (data.deductions.deductionsSociales.deductionCouplesMaries || 0);
    return Math.max(0, revenuNetII - deductionsSociales);
  }
  
  private static calculateTotalAssets(fortune: any): number {
    return (fortune.fortuneMobiliere.titresAvoirs || 0) +
           (fortune.fortuneMobiliere.argentComptant || 0) +
           (fortune.immeubles?.maisonFamiliale?.valeurFiscale || 0);
  }
}