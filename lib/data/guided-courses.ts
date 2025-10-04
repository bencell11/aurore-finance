// Parcours guidés pour l'éducation fiscale

export interface CourseStep {
  id: string;
  title: string;
  description: string;
  articleSlug?: string;
  content: string;
  keyPoints: string[];
  practicalTip?: string;
  nextAction?: string;
  estimatedTime: number; // en minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface GuidedCourse {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetAudience: string;
  totalTime: number; // en minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: CourseStep[];
  prerequisites?: string[];
  learningObjectives: string[];
  benefits: string[];
}

export const guidedCourses: GuidedCourse[] = [
  {
    id: 'salarie-debutant',
    title: 'Salarié débutant',
    description: 'Maîtrisez les bases de la fiscalité suisse en tant que salarié',
    icon: 'User',
    targetAudience: 'Salariés sans expérience fiscale, premiers emplois, jeunes diplômés',
    totalTime: 45,
    difficulty: 'beginner',
    prerequisites: [
      'Avoir un emploi salarié en Suisse',
      'Disposer de son certificat de salaire'
    ],
    learningObjectives: [
      'Comprendre votre certificat de salaire et les éléments imposables',
      'Identifier toutes les déductions fiscales possibles',
      'Optimiser votre situation avec le 3e pilier',
      'Préparer votre première déclaration d\'impôts',
      'Planifier votre fiscalité sur l\'année'
    ],
    benefits: [
      'Économies fiscales immédiates possibles',
      'Éviter les erreurs dans votre déclaration',
      'Optimisation de votre situation financière',
      'Confiance pour gérer vos impôts',
      'Base solide pour votre vie professionnelle'
    ],
    steps: [
      {
        id: 'etape-1-certificat-salaire',
        title: 'Comprendre votre certificat de salaire',
        description: 'Décryptez chaque ligne de votre certificat et identifiez les éléments imposables',
        articleSlug: 'certificat-salaire',
        content: `Le certificat de salaire est votre document fiscal le plus important. Il contient toutes les informations nécessaires pour votre déclaration d'impôts et détermine une grande partie de votre charge fiscale.

**Éléments clés à comprendre :**

**1. Salaire brut (ligne 1)**
C'est votre rémunération totale avant toute déduction. Il inclut :
- Votre salaire de base
- Les heures supplémentaires
- Les primes et bonus
- Les avantages en nature (voiture, repas, logement)

**2. Déductions sociales obligatoires**
Elles réduisent votre revenu imposable :
- AVS/AI/APG : 5.3% (plafonné à 148'200 CHF)
- Assurance chômage : 1.1% (plafonné à 148'200 CHF)
- LPP : variable selon l'âge et le plan de prévoyance
- Assurance accidents : environ 0.1-0.5%

**3. Salaire net imposable**
C'est ce montant qui servira de base pour calculer vos impôts.

**4. Avantages en nature**
S'ils existent, ils sont ajoutés au salaire imposable :
- Voiture de fonction : évaluée forfaitairement
- Repas subventionnés : différence avec le prix du marché
- Logement de fonction : valeur locative`,
        keyPoints: [
          'Le salaire brut inclut tous les avantages',
          'Les déductions sociales réduisent l\'impôt',
          'Les avantages en nature sont imposables',
          'Vérifiez l\'exactitude des montants',
          'Conservez tous vos certificats'
        ],
        practicalTip: 'Demandez à votre employeur les détails de votre plan LPP pour comprendre vos cotisations et vos possibilités de rachat.',
        nextAction: 'Rassemblez tous vos certificats de salaire de l\'année et vérifiez qu\'il n\'y a pas d\'erreurs.',
        estimatedTime: 15,
        difficulty: 'beginner'
      },
      {
        id: 'etape-2-deductions-fiscales',
        title: 'Identifier vos déductions possibles',
        description: 'Maximisez vos déductions pour réduire votre base imposable',
        articleSlug: 'deductions-fiscales-principales',
        content: `En tant que salarié, vous avez droit à plusieurs déductions qui peuvent significativement réduire vos impôts. L'objectif est d'identifier toutes celles qui s'appliquent à votre situation.

**Déductions automatiques (déjà prises en compte) :**
- Cotisations AVS/AI/APG/AC
- Cotisations LPP obligatoires
- Primes d'assurance maladie de base

**Déductions à optimiser :**

**1. Frais professionnels**
Vous avez le choix entre :
- **Forfait** : 3% du salaire net (min 2'000, max 4'000 CHF)
- **Frais effectifs** : si vos frais dépassent le forfait

Frais effectifs déductibles :
- Transport domicile-travail (transports publics intégralement, voiture avec limites)
- Repas hors domicile (si pas de cantine d'entreprise)
- Formation professionnelle continue
- Vêtements de travail spécialisés
- Outillage et équipement professionnel

**2. Prévoyance privée**
- 3e pilier A : jusqu'à 7'056 CHF par an (déduction maximale)
- Rachats LPP : montants variables selon votre situation

**3. Autres déductions importantes**
- Intérêts hypothécaires (si propriétaire)
- Frais de garde d'enfants par des tiers
- Dons à des institutions reconnues d'utilité publique
- Frais médicaux et dentaires non remboursés (avec franchise)`,
        keyPoints: [
          'Choisir entre forfait et frais effectifs',
          'Maximiser le 3e pilier A chaque année',
          'Documenter tous les frais professionnels',
          'Considérer les rachats LPP',
          'Déduire les intérêts hypothécaires'
        ],
        practicalTip: 'Tenez un carnet de vos frais professionnels pendant un mois pour estimer si les frais effectifs dépassent le forfait.',
        nextAction: 'Calculez vos frais professionnels réels et comparez avec le forfait pour choisir l\'option la plus avantageuse.',
        estimatedTime: 15,
        difficulty: 'beginner'
      },
      {
        id: 'etape-3-troisieme-pilier',
        title: 'Optimiser avec le 3e pilier',
        description: 'Utilisez le 3e pilier pour réduire vos impôts et préparer votre retraite',
        articleSlug: 'prevoyance-2e-3e-pilier',
        content: `Le 3e pilier A est l'outil d'optimisation fiscale le plus efficace pour les salariés. Il combine avantages fiscaux immédiats et constitution d'une épargne retraite.

**Avantages fiscaux du 3e pilier A :**

**1. Déduction fiscale immédiate**
- Montant maximum 2024 : 7'056 CHF
- Déduction à 100% du revenu imposable
- Économie fiscale immédiate de 20-45% selon votre taux marginal

**2. Croissance exonérée**
- Rendements non imposés pendant la phase d'épargne
- Effet de capitalisation maximisé

**3. Fiscalité réduite au retrait**
- Imposition séparée du revenu
- Taux réduit (généralement 5-8%)
- Possibilité de retraits échelonnés

**Stratégies d'optimisation :**

**1. Versement optimal**
- Verser le maximum chaque année si possible
- Effectuer le versement avant le 31 décembre
- Privilégier la régularité pour maximiser les intérêts composés

**2. Choix du support**
- **Compte 3a bancaire** : sécurisé, rendement faible
- **Assurance 3a** : protection en cas de décès/invalidité
- **3a en titres** : potentiel de rendement supérieur, risque modéré

**3. Planification des retraits**
- Retrait anticipé possible dès 59/60 ans
- Possibilité d'ouvrir plusieurs comptes pour étaler les retraits
- Coordination avec la retraite LPP`,
        keyPoints: [
          'Montant maximum : 7\'056 CHF par an',
          'Économie fiscale immédiate de 20-45%',
          'Versement obligatoire avant le 31.12',
          'Choix du support selon profil de risque',
          'Planifier les retraits pour optimiser l\'impôt'
        ],
        practicalTip: 'Ouvrez votre 3e pilier dès votre premier emploi, même avec de petits montants. L\'effet des intérêts composés sur 40 ans est considérable.',
        nextAction: 'Comparez les offres 3e pilier des banques et assurances, puis ouvrez votre premier compte avec un versement initial.',
        estimatedTime: 15,
        difficulty: 'beginner'
      }
    ]
  },

  {
    id: 'independant',
    title: 'Indépendant',
    description: 'Maîtrisez la fiscalité des entrepreneurs et optimisez votre situation',
    icon: 'Briefcase',
    targetAudience: 'Indépendants, entrepreneurs, freelances',
    totalTime: 60,
    difficulty: 'intermediate',
    prerequisites: [
      'Avoir un statut d\'indépendant reconnu',
      'Tenir une comptabilité'
    ],
    learningObjectives: [
      'Comprendre votre statut fiscal',
      'Maîtriser la TVA et ses obligations',
      'Optimiser vos déductions professionnelles',
      'Planifier votre prévoyance',
      'Gérer votre fiscalité annuelle'
    ],
    benefits: [
      'Optimisation fiscale substantielle',
      'Conformité réglementaire',
      'Meilleure gestion de trésorerie',
      'Planification financière efficace'
    ],
    steps: [
      {
        id: 'statut-fiscal',
        title: 'Statut fiscal et forme juridique',
        description: 'Clarifiez votre statut et ses implications fiscales',
        articleSlug: 'statut-independant-criteres',
        content: 'Contenu détaillé sur le statut fiscal des indépendants...',
        keyPoints: ['Critères de reconnaissance', 'Implications fiscales', 'Forme juridique optimale'],
        estimatedTime: 20,
        difficulty: 'intermediate'
      },
      {
        id: 'tva-comptabilite',
        title: 'TVA et comptabilité',
        description: 'Gérez vos obligations TVA et comptables',
        articleSlug: 'tva-assujettissement-entreprises',
        content: 'Contenu détaillé sur la TVA et la comptabilité...',
        keyPoints: ['Seuil d\'assujettissement', 'Décomptes TVA', 'Tenue comptabilité'],
        estimatedTime: 20,
        difficulty: 'intermediate'
      },
      {
        id: 'optimisation-independant',
        title: 'Optimisation fiscale légale',
        description: 'Stratégies d\'optimisation pour indépendants',
        articleSlug: 'optimisation-fiscale-legale',
        content: 'Contenu détaillé sur l\'optimisation fiscale...',
        keyPoints: ['Charges déductibles', 'Timing optimal', 'Prévoyance optimisée'],
        estimatedTime: 20,
        difficulty: 'intermediate'
      }
    ]
  }
];

// Fonction pour obtenir un parcours par ID
export function getCourseById(id: string): GuidedCourse | undefined {
  return guidedCourses.find(course => course.id === id);
}

// Fonction pour obtenir une étape par ID
export function getCourseStep(courseId: string, stepId: string): CourseStep | undefined {
  const course = getCourseById(courseId);
  return course?.steps.find(step => step.id === stepId);
}

// Fonction pour obtenir l'étape suivante
export function getNextStep(courseId: string, currentStepId: string): CourseStep | null {
  const course = getCourseById(courseId);
  if (!course) return null;

  const currentIndex = course.steps.findIndex(step => step.id === currentStepId);
  if (currentIndex === -1 || currentIndex === course.steps.length - 1) return null;

  return course.steps[currentIndex + 1];
}

// Fonction pour obtenir l'étape précédente
export function getPreviousStep(courseId: string, currentStepId: string): CourseStep | null {
  const course = getCourseById(courseId);
  if (!course) return null;

  const currentIndex = course.steps.findIndex(step => step.id === currentStepId);
  if (currentIndex <= 0) return null;

  return course.steps[currentIndex - 1];
}

// Fonction pour calculer le progrès
export function calculateProgress(courseId: string, completedSteps: string[]): number {
  const course = getCourseById(courseId);
  if (!course) return 0;

  return Math.round((completedSteps.length / course.steps.length) * 100);
}