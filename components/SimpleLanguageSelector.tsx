'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

type Locale = 'fr' | 'de' | 'it' | 'en';

interface LanguageOption {
  code: Locale;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

// Traductions simples pour la page principale
const translations = {
  fr: {
    admin: 'Admin',
    joinWaitlist: 'Rejoindre la liste d\'attente',
    subtitle: 'Rejoignez la liste d\'attente et soyez parmi les premiers à tester Aurore Finances en version bêta.',
    emailPlaceholder: 'votre@email.com',
    accessRestricted: 'Cette fonctionnalité n\'est disponible que dans la version complète. Accédez à l\'espace admin pour débloquer toutes les fonctionnalités.',
    title: 'Conseiller financier IA pour la Suisse',
    description: 'Optimisez vos finances avec notre assistant IA spécialisé dans le système financier suisse.',
    waitlistCount: 'personnes déjà inscrites',
    alreadyMore: 'Déjà plus de',
    joinMovement: 'ont rejoint le mouvement',
    submitting: 'Envoi...',
    subscribed: 'Merci ! Nous vous avons envoyé un email de confirmation. Vérifiez votre boîte de réception.',
    registeredButton: 'Inscrit !',
    connectionError: 'Erreur de connexion. Veuillez réessayer.',
    promise: {
      title: 'La gestion de vos finances n\'a jamais été aussi simple.',
      description: 'Nous construisons une application qui vous aide à piloter vos finances de manière claire, personnalisée et intelligente. Un tableau de bord, une boussole, et des conseils concrets pour atteindre vos objectifs.',
      visualize: { title: 'Visualisez l\'ensemble de vos comptes en un seul endroit' },
      recommendations: { title: 'Recevez des recommandations personnalisées grâce à l\'IA' },
      community: { title: 'Rejoignez une communauté ambitieuse qui partage vos valeurs' }
    },
    mockup: {
      title: 'Un aperçu de ce qui vous attend : une expérience simple, claire et puissante.',
      description: 'Interface intuitive, données en temps réel, et intelligence artificielle pour vous accompagner dans chaque décision financière. Découvrez le futur de la gestion patrimoniale personnelle.',
      modernInterface: 'Interface moderne',
      integratedAI: 'IA intégrée',
      secure: 'Sécurisé',
      fiscalAssistant: 'Assistant Fiscal IA',
      revenues: 'Revenus',
      taxes: 'Impôts',
      savings: 'Économies',
      aiAssistant: 'Assistant IA',
      aiMessage: 'Basé sur votre profil, vous pourriez économiser CHF 3,200 en optimisant vos déductions fiscales.',
      seeDetails: 'Voir les détails',
      apply: 'Appliquer',
      profileCompleted: 'Profil fiscal complété'
    },
    socialProof: {
      badge: 'Accès Anticipé Exclusif',
      title: 'Soyez pionnier.',
      description: 'Les places pour la version bêta sont limitées. En vous inscrivant aujourd\'hui, vous aurez accès en avant-première à la plateforme et pourrez contribuer à son évolution.',
      priorityAccess: { title: 'Accès prioritaire', description: 'Découvrez les fonctionnalités avant tout le monde' },
      exclusiveCommunity: { title: 'Communauté exclusive', description: 'Rejoignez un groupe de bêta-testeurs privilégiés' },
      directImpact: { title: 'Impact direct', description: 'Vos retours façonnent l\'avenir du produit' }
    },
    footer: {
      copyright: '© 2025 Aurore Finances. Tous droits réservés.'
    },
    // Navigation
    home: 'Accueil',
    simulators: 'Simulateurs',
    taxEducation: 'Éducation Fiscale',
    taxAssistant: 'Assistant Fiscal',
    dashboard: 'Dashboard',
    objectives: 'Objectifs',
    chatbot: 'Chatbot IA',
    // Éducation fiscale
    taxEducationCenter: 'Centre d\'Éducation Fiscale Suisse',
    searchPlaceholder: 'Rechercher un article ou concept...',
    backToCategories: 'Retour aux catégories',
    readArticle: 'Lire l\'article',
    consult: 'Consulter',
    new: 'Nouveau',
    // Catégories fiscales
    introToTax: 'Introduction à la fiscalité suisse',
    personalTax: 'Fiscalité des personnes physiques',
    businessTax: 'Indépendants et entreprises',
    internationalTax: 'Fiscalité internationale',
    socialSecurity: 'Prévoyance et sécurité sociale',
    proceduralTax: 'Procédure et administration fiscales',
    cantonalTax: 'Fiscalité cantonale et communale',
    declarationProcess: 'Déclaration et processus',
    analysisOptimization: 'Analyses et optimisation',
    cantonalSpecifics: 'Spécificités cantonales',
    // Descriptions des catégories
    introToTaxDesc: 'Comprendre le système fiscal suisse',
    personalTaxDesc: 'Tout sur vos impôts personnels',
    businessTaxDesc: 'Fiscalité professionnelle',
    internationalTaxDesc: 'Frontaliers et expatriés',
    declarationProcessDesc: 'Remplir sa déclaration',
    analysisOptimizationDesc: 'Réduire légalement vos impôts',
    cantonalSpecificsDesc: 'Votre canton en détail',
    // Interface d'articles
    clickToRead: 'Cliquez pour lire l\'article complet',
    article: 'article',
    articles: 'articles',
    keyPointsTitle: 'Points clés à retenir',
    practicalExample: 'Exemple pratique',
    // Titres des articles
    swissTaxSystem: 'Système fiscal suisse',
    legalBases: 'Bases légales',
    taxationPrinciples: 'Principes d\'imposition',
    typesOfTaxes: 'Types d\'impôts',
    taxableIncome: 'Salaires et revenus',
    taxDeductions: 'Déductions fiscales',
    wealthTax: 'Impôt sur la fortune',
    taxableIncomeEmployees: 'Revenus imposables salariés',
    // Module Fiscalité des personnes physiques
    wagesAndIncome: 'Salaires et revenus',
    taxDeductionsFull: 'Déductions fiscales',
    wealthTaxFull: 'Impôt sur la fortune',
    pensionsAVSLPP: 'Rentes AVS/LPP',
    realEstateIncome: 'Revenus immobiliers',
    // Module Indépendants et entreprises
    taxStatus: 'Statut fiscal',
    legalForms: 'Formes juridiques',
    vatFull: 'TVA',
    profitTaxation: 'Imposition du bénéfice',
    managerRemuneration: 'Rémunération dirigeant',
    // Module Patrimoine et investissements  
    patrimoneyInvestments: 'Patrimoine et investissements',
    patrimoneyDesc: 'Optimiser votre patrimoine',
    realEstate: 'Biens immobiliers',
    securitiesValues: 'Titres et valeurs',
    cryptocurrencies: 'Cryptomonnaies',
    pensionProvision: 'Prévoyance (2e/3e pilier)',
    luxuryGoods: 'Biens de luxe',
    // Module International
    crossBorderWorkers: 'Frontaliers',
    doubleTaxationConventions: 'Conventions double imposition',
    expatriatesImpatriates: 'Expatriés/Impatriés',
    foreignAccounts: 'Comptes étrangers',
    // Module Déclaration
    deadlinesProcedures: 'Délais et procédures',
    requiredDocuments: 'Documents nécessaires',
    taxCalendar: 'Calendrier fiscal',
    taxationCorrections: 'Taxation et corrections',
    // Module Optimisation
    optimizationStrategies: 'Stratégies d\'optimisation',
    annualPlanning: 'Planification annuelle',
    thirdPillarOptimization: 'Optimisation 3e pilier',
    successionPlanning: 'Planification successorale',
    // Module Cantons
    intercantonalComparison: 'Comparatif intercantonal',
    // Autres
    domicileFiscal: 'Domicile fiscal',
    scalesProgressivity: 'Barèmes et progressivité',
    rentalValue: 'Valeur locative résidence',
    securitiesMobiliary: 'Titres et valeurs mobilières',
  },
  de: {
    admin: 'Admin',
    joinWaitlist: 'Der Warteliste beitreten',
    subtitle: 'Treten Sie der Warteliste bei und gehören Sie zu den Ersten, die Aurore Finances in der Beta-Version testen.',
    emailPlaceholder: 'ihre@email.com',
    accessRestricted: 'Diese Funktion ist nur in der Vollversion verfügbar. Greifen Sie auf den Admin-Bereich zu, um alle Funktionen freizuschalten.',
    title: 'KI-Finanzberater für die Schweiz',
    description: 'Optimieren Sie Ihre Finanzen mit unserem KI-Assistenten, der auf das Schweizer Finanzsystem spezialisiert ist.',
    waitlistCount: 'Personen bereits angemeldet',
    alreadyMore: 'Bereits mehr als',
    joinMovement: 'sind der Bewegung beigetreten',
    submitting: 'Wird gesendet...',
    subscribed: 'Vielen Dank! Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Überprüfen Sie Ihren Posteingang.',
    registeredButton: 'Registriert!',
    connectionError: 'Verbindungsfehler. Bitte versuchen Sie es erneut.',
    promise: {
      title: 'Die Verwaltung Ihrer Finanzen war noch nie so einfach.',
      description: 'Wir entwickeln eine App, die Ihnen hilft, Ihre Finanzen klar, personalisiert und intelligent zu verwalten. Ein Dashboard, ein Kompass und konkrete Ratschläge, um Ihre Ziele zu erreichen.',
      visualize: { title: 'Visualisieren Sie alle Ihre Konten an einem Ort' },
      recommendations: { title: 'Erhalten Sie personalisierte Empfehlungen durch KI' },
      community: { title: 'Treten Sie einer ehrgeizigen Community bei, die Ihre Werte teilt' }
    },
    mockup: {
      title: 'Ein Vorgeschmack auf das, was Sie erwartet: eine einfache, klare und leistungsstarke Erfahrung.',
      description: 'Intuitive Benutzeroberfläche, Echtzeitdaten und künstliche Intelligenz zur Unterstützung bei jeder finanziellen Entscheidung. Entdecken Sie die Zukunft der persönlichen Vermögensverwaltung.',
      modernInterface: 'Moderne Oberfläche',
      integratedAI: 'Integrierte KI',
      secure: 'Sicher',
      fiscalAssistant: 'KI-Steuerassistent',
      revenues: 'Einkommen',
      taxes: 'Steuern',
      savings: 'Ersparnisse',
      aiAssistant: 'KI-Assistent',
      aiMessage: 'Basierend auf Ihrem Profil könnten Sie CHF 3.200 sparen, indem Sie Ihre Steuerabzüge optimieren.',
      seeDetails: 'Details anzeigen',
      apply: 'Anwenden',
      profileCompleted: 'Steuerprofil abgeschlossen'
    },
    socialProof: {
      badge: 'Exklusiver Frühzugang',
      title: 'Seien Sie ein Pionier.',
      description: 'Die Plätze für die Beta-Version sind begrenzt. Wenn Sie sich heute anmelden, erhalten Sie frühzeitigen Zugang zur Plattform und können zu ihrer Entwicklung beitragen.',
      priorityAccess: { title: 'Prioritätszugang', description: 'Entdecken Sie Funktionen vor allen anderen' },
      exclusiveCommunity: { title: 'Exklusive Community', description: 'Treten Sie einer Gruppe privilegierter Beta-Tester bei' },
      directImpact: { title: 'Direkter Einfluss', description: 'Ihr Feedback gestaltet die Zukunft des Produkts' }
    },
    footer: {
      copyright: '© 2025 Aurore Finances. Alle Rechte vorbehalten.'
    },
    // Navigation
    home: 'Startseite',
    simulators: 'Simulatoren',
    taxEducation: 'Steuerbildung',
    taxAssistant: 'Steuerberater',
    dashboard: 'Dashboard',
    objectives: 'Ziele',
    chatbot: 'KI-Chatbot',
    // Éducation fiscale
    taxEducationCenter: 'Schweizer Steuerbildungszentrum',
    searchPlaceholder: 'Artikel oder Konzept suchen...',
    backToCategories: 'Zurück zu den Kategorien',
    readArticle: 'Artikel lesen',
    consult: 'Konsultieren',
    new: 'Neu',
    // Catégories fiscales
    introToTax: 'Einführung in die Schweizer Steuern',
    personalTax: 'Besteuerung natürlicher Personen',
    businessTax: 'Selbständige und Unternehmen',
    internationalTax: 'Internationale Besteuerung',
    socialSecurity: 'Vorsorge und Sozialversicherung',
    proceduralTax: 'Steuerverfahren und -verwaltung',
    cantonalTax: 'Kantonale und kommunale Besteuerung',
    declarationProcess: 'Erklärung und Verfahren',
    analysisOptimization: 'Analyse und Optimierung',
    cantonalSpecifics: 'Kantonale Besonderheiten',
    // Descriptions des catégories
    introToTaxDesc: 'Das Schweizer Steuersystem verstehen',
    personalTaxDesc: 'Alles über Ihre persönlichen Steuern',
    businessTaxDesc: 'Geschäftliche Besteuerung',
    internationalTaxDesc: 'Grenzgänger und Expatriates',
    declarationProcessDesc: 'Steuererklärung ausfüllen',
    analysisOptimizationDesc: 'Steuern legal reduzieren',
    cantonalSpecificsDesc: 'Ihr Kanton im Detail',
    // Interface d'articles
    clickToRead: 'Klicken Sie, um den vollständigen Artikel zu lesen',
    article: 'Artikel',
    articles: 'Artikel',
    keyPointsTitle: 'Wichtige Punkte zum Merken',
    practicalExample: 'Praktisches Beispiel',
    // Titres des articles
    swissTaxSystem: 'Schweizer Steuersystem',
    legalBases: 'Rechtsgrundlagen',
    taxationPrinciples: 'Besteuerungsprinzipien',
    typesOfTaxes: 'Steuerarten',
    taxableIncome: 'Löhne und Einkommen',
    taxDeductions: 'Steuerabzüge',
    wealthTax: 'Vermögenssteuer',
    taxableIncomeEmployees: 'Steuerpflichtiges Einkommen Angestellte',
    // Module Fiscalité des personnes physiques
    wagesAndIncome: 'Löhne und Einkommen',
    taxDeductionsFull: 'Steuerabzüge',
    wealthTaxFull: 'Vermögenssteuer',
    pensionsAVSLPP: 'AHV/BVG-Renten',
    realEstateIncome: 'Immobilienerträge',
    // Module Indépendants et entreprises
    taxStatus: 'Steuerstatus',
    legalForms: 'Rechtsformen',
    vatFull: 'MWST',
    profitTaxation: 'Gewinnbesteuerung',
    managerRemuneration: 'Geschäftsführervergütung',
    // Module Patrimoine et investissements  
    patrimoneyInvestments: 'Vermögen und Investitionen',
    patrimoneyDesc: 'Ihr Vermögen optimieren',
    realEstate: 'Immobilien',
    securitiesValues: 'Wertpapiere und Werte',
    cryptocurrencies: 'Kryptowährungen',
    pensionProvision: 'Vorsorge (2./3. Säule)',
    luxuryGoods: 'Luxusgüter',
    // Module International
    crossBorderWorkers: 'Grenzgänger',
    doubleTaxationConventions: 'Doppelbesteuerungsabkommen',
    expatriatesImpatriates: 'Expatriates/Impatriates',
    foreignAccounts: 'Ausländische Konten',
    // Module Déclaration
    deadlinesProcedures: 'Fristen und Verfahren',
    requiredDocuments: 'Erforderliche Dokumente',
    taxCalendar: 'Steuerkalender',
    taxationCorrections: 'Besteuerung und Korrekturen',
    // Module Optimisation
    optimizationStrategies: 'Optimierungsstrategien',
    annualPlanning: 'Jahresplanung',
    thirdPillarOptimization: '3. Säule Optimierung',
    successionPlanning: 'Nachfolgeplanung',
    // Module Cantons
    intercantonalComparison: 'Interkantonaler Vergleich',
    // Autres
    domicileFiscal: 'Steuerdomizil',
    scalesProgressivity: 'Tarife und Progressivität',
    rentalValue: 'Eigenmietwert Wohnung',
    securitiesMobiliary: 'Wertpapiere und Mobilwerte',
  },
  it: {
    admin: 'Admin',
    joinWaitlist: 'Unisciti alla lista d\'attesa',
    subtitle: 'Unisciti alla lista d\'attesa e sii tra i primi a testare Aurore Finances in versione beta.',
    emailPlaceholder: 'tua@email.com',
    accessRestricted: 'Questa funzionalità è disponibile solo nella versione completa. Accedi all\'area admin per sbloccare tutte le funzionalità.',
    title: 'Consulente finanziario IA per la Svizzera',
    description: 'Ottimizza le tue finanze con il nostro assistente IA specializzato nel sistema finanziario svizzero.',
    waitlistCount: 'persone già iscritte',
    alreadyMore: 'Già più di',
    joinMovement: 'si sono uniti al movimento',
    submitting: 'Invio in corso...',
    subscribed: 'Grazie! Ti abbiamo inviato un\'email di conferma. Controlla la tua casella di posta.',
    registeredButton: 'Registrato!',
    connectionError: 'Errore di connessione. Riprova.',
    promise: {
      title: 'Gestire le tue finanze non è mai stato così semplice.',
      description: 'Stiamo costruendo un\'app che ti aiuta a gestire le tue finanze in modo chiaro, personalizzato e intelligente. Una dashboard, una bussola e consigli concreti per raggiungere i tuoi obiettivi.',
      visualize: { title: 'Visualizza tutti i tuoi conti in un unico posto' },
      recommendations: { title: 'Ricevi raccomandazioni personalizzate grazie all\'IA' },
      community: { title: 'Unisciti a una comunità ambiziosa che condivide i tuoi valori' }
    },
    mockup: {
      title: 'Un\'anteprima di ciò che ti aspetta: un\'esperienza semplice, chiara e potente.',
      description: 'Interfaccia intuitiva, dati in tempo reale e intelligenza artificiale per accompagnarti in ogni decisione finanziaria. Scopri il futuro della gestione patrimoniale personale.',
      modernInterface: 'Interfaccia moderna',
      integratedAI: 'IA integrata',
      secure: 'Sicuro',
      fiscalAssistant: 'Assistente Fiscale IA',
      revenues: 'Entrate',
      taxes: 'Tasse',
      savings: 'Risparmi',
      aiAssistant: 'Assistente IA',
      aiMessage: 'In base al tuo profilo, potresti risparmiare CHF 3.200 ottimizzando le tue deduzioni fiscali.',
      seeDetails: 'Vedi dettagli',
      apply: 'Applica',
      profileCompleted: 'Profilo fiscale completato'
    },
    socialProof: {
      badge: 'Accesso Anticipato Esclusivo',
      title: 'Sii un pioniere.',
      description: 'I posti per la versione beta sono limitati. Iscrivendoti oggi, avrai accesso anticipato alla piattaforma e potrai contribuire alla sua evoluzione.',
      priorityAccess: { title: 'Accesso prioritario', description: 'Scopri le funzionalità prima di tutti' },
      exclusiveCommunity: { title: 'Comunità esclusiva', description: 'Unisciti a un gruppo di beta tester privilegiati' },
      directImpact: { title: 'Impatto diretto', description: 'Il tuo feedback plasma il futuro del prodotto' }
    },
    footer: {
      copyright: '© 2025 Aurore Finances. Tutti i diritti riservati.'
    },
    // Navigation
    home: 'Home',
    simulators: 'Simulatori',
    taxEducation: 'Educazione Fiscale',
    taxAssistant: 'Assistente Fiscale',
    dashboard: 'Dashboard',
    objectives: 'Obiettivi',
    chatbot: 'Chatbot IA',
    // Éducation fiscale
    taxEducationCenter: 'Centro di Educazione Fiscale Svizzera',
    searchPlaceholder: 'Cerca un articolo o concetto...',
    backToCategories: 'Torna alle categorie',
    readArticle: 'Leggi l\'articolo',
    consult: 'Consulta',
    new: 'Nuovo',
    // Catégories fiscales
    introToTax: 'Introduzione alla fiscalità svizzera',
    personalTax: 'Tassazione delle persone fisiche',
    businessTax: 'Indipendenti e imprese',
    internationalTax: 'Fiscalità internazionale',
    socialSecurity: 'Previdenza e sicurezza sociale',
    proceduralTax: 'Procedura e amministrazione fiscale',
    cantonalTax: 'Fiscalità cantonale e comunale',
    declarationProcess: 'Dichiarazione e processo',
    analysisOptimization: 'Analisi e ottimizzazione',
    cantonalSpecifics: 'Specificità cantonali',
    // Descriptions des catégories
    introToTaxDesc: 'Comprendere il sistema fiscale svizzero',
    personalTaxDesc: 'Tutto sulle tue tasse personali',
    businessTaxDesc: 'Tassazione professionale',
    internationalTaxDesc: 'Frontalieri ed espatriati',
    declarationProcessDesc: 'Compilare la dichiarazione',
    analysisOptimizationDesc: 'Ridurre legalmente le tasse',
    cantonalSpecificsDesc: 'Il tuo cantone nel dettaglio',
    // Interface d'articles
    clickToRead: 'Clicca per leggere l\'articolo completo',
    article: 'articolo',
    articles: 'articoli',
    keyPointsTitle: 'Punti chiave da ricordare',
    practicalExample: 'Esempio pratico',
    // Titres des articles
    swissTaxSystem: 'Sistema fiscale svizzero',
    legalBases: 'Basi legali',
    taxationPrinciples: 'Principi di tassazione',
    typesOfTaxes: 'Tipi di tasse',
    taxableIncome: 'Salari e redditi',
    taxDeductions: 'Detrazioni fiscali',
    wealthTax: 'Imposta sul patrimonio',
    taxableIncomeEmployees: 'Reddito imponibile dipendenti',
    // Module Fiscalité des personnes physiques
    wagesAndIncome: 'Salari e redditi',
    taxDeductionsFull: 'Detrazioni fiscali',
    wealthTaxFull: 'Imposta sul patrimonio',
    pensionsAVSLPP: 'Rendite AVS/LPP',
    realEstateIncome: 'Redditi immobiliari',
    // Module Indépendants et entreprises
    taxStatus: 'Stato fiscale',
    legalForms: 'Forme giuridiche',
    vatFull: 'IVA',
    profitTaxation: 'Tassazione del profitto',
    managerRemuneration: 'Remunerazione dirigente',
    // Module Patrimoine et investissements  
    patrimoneyInvestments: 'Patrimonio e investimenti',
    patrimoneyDesc: 'Ottimizzare il vostro patrimonio',
    realEstate: 'Beni immobiliari',
    securitiesValues: 'Titoli e valori',
    cryptocurrencies: 'Criptovalute',
    pensionProvision: 'Previdenza (2°/3° pilastro)',
    luxuryGoods: 'Beni di lusso',
    // Module International
    crossBorderWorkers: 'Frontalieri',
    doubleTaxationConventions: 'Convenzioni doppia imposizione',
    expatriatesImpatriates: 'Espatriati/Impatriati',
    foreignAccounts: 'Conti esteri',
    // Module Déclaration
    deadlinesProcedures: 'Scadenze e procedure',
    requiredDocuments: 'Documenti necessari',
    taxCalendar: 'Calendario fiscale',
    taxationCorrections: 'Tassazione e correzioni',
    // Module Optimisation
    optimizationStrategies: 'Strategie di ottimizzazione',
    annualPlanning: 'Pianificazione annuale',
    thirdPillarOptimization: 'Ottimizzazione 3° pilastro',
    successionPlanning: 'Pianificazione successoria',
    // Module Cantons
    intercantonalComparison: 'Confronto intercantonale',
    // Autres
    domicileFiscal: 'Domicilio fiscale',
    scalesProgressivity: 'Tariffe e progressività',
    rentalValue: 'Valore locativo residenza',
    securitiesMobiliary: 'Titoli e valori mobiliari',
  },
  en: {
    admin: 'Admin',
    joinWaitlist: 'Join the Waitlist',
    subtitle: 'Join the waitlist and be among the first to test Aurore Finances in beta.',
    emailPlaceholder: 'your@email.com',
    accessRestricted: 'This feature is only available in the full version. Access the admin area to unlock all features.',
    title: 'AI Financial Advisor for Switzerland',
    description: 'Optimize your finances with our AI assistant specialized in the Swiss financial system.',
    waitlistCount: 'people already registered',
    alreadyMore: 'Already more than',
    joinMovement: 'have joined the movement',
    submitting: 'Submitting...',
    subscribed: 'Thank you! We\'ve sent you a confirmation email. Check your inbox.',
    registeredButton: 'Registered!',
    connectionError: 'Connection error. Please try again.',
    promise: {
      title: 'Managing your finances has never been easier.',
      description: 'We\'re building an app that helps you manage your finances in a clear, personalized, and intelligent way. A dashboard, a compass, and concrete advice to achieve your goals.',
      visualize: { title: 'Visualize all your accounts in one place' },
      recommendations: { title: 'Receive personalized recommendations through AI' },
      community: { title: 'Join an ambitious community that shares your values' }
    },
    mockup: {
      title: 'A glimpse of what awaits you: a simple, clear, and powerful experience.',
      description: 'Intuitive interface, real-time data, and artificial intelligence to support you in every financial decision. Discover the future of personal wealth management.',
      modernInterface: 'Modern interface',
      integratedAI: 'Integrated AI',
      secure: 'Secure',
      fiscalAssistant: 'AI Tax Assistant',
      revenues: 'Income',
      taxes: 'Taxes',
      savings: 'Savings',
      aiAssistant: 'AI Assistant',
      aiMessage: 'Based on your profile, you could save CHF 3,200 by optimizing your tax deductions.',
      seeDetails: 'See details',
      apply: 'Apply',
      profileCompleted: 'Tax profile completed'
    },
    socialProof: {
      badge: 'Exclusive Early Access',
      title: 'Be a pioneer.',
      description: 'Beta version spots are limited. By signing up today, you\'ll get early access to the platform and help shape its evolution.',
      priorityAccess: { title: 'Priority access', description: 'Discover features before everyone else' },
      exclusiveCommunity: { title: 'Exclusive community', description: 'Join a group of privileged beta testers' },
      directImpact: { title: 'Direct impact', description: 'Your feedback shapes the product\'s future' }
    },
    footer: {
      copyright: '© 2025 Aurore Finances. All rights reserved.'
    },
    // Navigation
    home: 'Home',
    simulators: 'Simulators',
    taxEducation: 'Tax Education',
    taxAssistant: 'Tax Assistant',
    dashboard: 'Dashboard',
    objectives: 'Objectives',
    chatbot: 'AI Chatbot',
    // Éducation fiscale
    taxEducationCenter: 'Swiss Tax Education Center',
    searchPlaceholder: 'Search for an article or concept...',
    backToCategories: 'Back to categories',
    readArticle: 'Read article',
    consult: 'Consult',
    new: 'New',
    // Catégories fiscales
    introToTax: 'Introduction to Swiss taxation',
    personalTax: 'Individual taxation',
    businessTax: 'Self-employed and businesses',
    internationalTax: 'International taxation',
    socialSecurity: 'Pension and social security',
    proceduralTax: 'Tax procedure and administration',
    cantonalTax: 'Cantonal and municipal taxation',
    declarationProcess: 'Declaration and process',
    analysisOptimization: 'Analysis and optimization',
    cantonalSpecifics: 'Cantonal specifics',
    // Descriptions des catégories
    introToTaxDesc: 'Understanding the Swiss tax system',
    personalTaxDesc: 'Everything about your personal taxes',
    businessTaxDesc: 'Professional taxation',
    internationalTaxDesc: 'Cross-border workers and expats',
    declarationProcessDesc: 'Filing your tax return',
    analysisOptimizationDesc: 'Legally reducing your taxes',
    cantonalSpecificsDesc: 'Your canton in detail',
    // Interface d'articles
    clickToRead: 'Click to read the full article',
    article: 'article',
    articles: 'articles',
    keyPointsTitle: 'Key points to remember',
    practicalExample: 'Practical example',
    // Titres des articles
    swissTaxSystem: 'Swiss tax system',
    legalBases: 'Legal bases',
    taxationPrinciples: 'Taxation principles',
    typesOfTaxes: 'Types of taxes',
    taxableIncome: 'Wages and income',
    taxDeductions: 'Tax deductions',
    wealthTax: 'Wealth tax',
    taxableIncomeEmployees: 'Taxable income employees',
    // Module Fiscalité des personnes physiques
    wagesAndIncome: 'Wages and income',
    taxDeductionsFull: 'Tax deductions',
    wealthTaxFull: 'Wealth tax',
    pensionsAVSLPP: 'AVS/LPP pensions',
    realEstateIncome: 'Real estate income',
    // Module Indépendants et entreprises
    taxStatus: 'Tax status',
    legalForms: 'Legal forms',
    vatFull: 'VAT',
    profitTaxation: 'Profit taxation',
    managerRemuneration: 'Manager remuneration',
    // Module Patrimoine et investissements  
    patrimoneyInvestments: 'Wealth and investments',
    patrimoneyDesc: 'Optimize your wealth',
    realEstate: 'Real estate',
    securitiesValues: 'Securities and values',
    cryptocurrencies: 'Cryptocurrencies',
    pensionProvision: 'Pension provision (2nd/3rd pillar)',
    luxuryGoods: 'Luxury goods',
    // Module International
    crossBorderWorkers: 'Cross-border workers',
    doubleTaxationConventions: 'Double taxation conventions',
    expatriatesImpatriates: 'Expatriates/Impatriates',
    foreignAccounts: 'Foreign accounts',
    // Module Déclaration
    deadlinesProcedures: 'Deadlines and procedures',
    requiredDocuments: 'Required documents',
    taxCalendar: 'Tax calendar',
    taxationCorrections: 'Taxation and corrections',
    // Module Optimisation
    optimizationStrategies: 'Optimization strategies',
    annualPlanning: 'Annual planning',
    thirdPillarOptimization: '3rd pillar optimization',
    successionPlanning: 'Succession planning',
    // Module Cantons
    intercantonalComparison: 'Intercantonal comparison',
    // Autres
    domicileFiscal: 'Tax domicile',
    scalesProgressivity: 'Scales and progressivity',
    rentalValue: 'Rental value residence',
    securitiesMobiliary: 'Securities and movable values',
  },
};

export function SimpleLanguageSelector() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('fr');

  useEffect(() => {
    // Récupérer la langue depuis localStorage ou le navigateur
    const savedLocale = localStorage.getItem('locale') as Locale;
    const browserLocale = navigator.language.split('-')[0] as Locale;
    const validLocale = languages.find(l => l.code === savedLocale || l.code === browserLocale);
    
    if (validLocale) {
      setCurrentLocale(validLocale.code);
    }

    // Écouter les changements de langue
    const handleLanguageChangeEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newLocale = customEvent.detail as Locale;
      setCurrentLocale(newLocale);
    };

    window.addEventListener('languageChange', handleLanguageChangeEvent);
    
    // Émettre un événement personnalisé quand la langue change
    window.dispatchEvent(new CustomEvent('languageChange', { detail: validLocale?.code || 'fr' }));
    
    return () => window.removeEventListener('languageChange', handleLanguageChangeEvent);
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    setCurrentLocale(locale);
    localStorage.setItem('locale', locale);
    
    // Émettre un événement pour que les autres composants puissent se mettre à jour
    window.dispatchEvent(new CustomEvent('languageChange', { detail: locale }));
    
    // Pas de rechargement - les composants se mettront à jour automatiquement
  };

  const currentLanguage = languages.find(l => l.code === currentLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage?.flag} {currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {language.code === currentLocale && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook pour utiliser les traductions dans les composants
export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('fr');
  
  useEffect(() => {
    // Initialiser avec la langue sauvegardée
    const savedLocale = (localStorage.getItem('locale') as Locale) || 'fr';
    setLocale(savedLocale);
    
    // Écouter les changements de langue
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newLocale = customEvent.detail as Locale;
      setLocale(newLocale);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);
  
  return translations[locale] || translations.fr;
}