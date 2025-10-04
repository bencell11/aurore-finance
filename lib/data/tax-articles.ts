// Types pour les articles
export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  content: string;
  sections: ArticleSection[];
  keywords?: string[];
  relatedConcepts?: RelatedConcept[];
  legalReferences?: LegalReference[];
  previousArticle?: { slug: string; title: string };
  nextArticle?: { slug: string; title: string };
  views?: number;
  lastUpdated: Date;
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  keyPoints?: string[];
  example?: string;
  warning?: string;
}

export interface RelatedConcept {
  slug: string;
  title: string;
}

// Système de traductions pour les articles
export interface ArticleTranslations {
  [slug: string]: {
    title: {
      fr: string;
      de: string;
      it: string;
      en: string;
    };
    description: {
      fr: string;
      de: string;
      it: string;
      en: string;
    };
    content: {
      fr: string;
      de: string;
      it: string;
      en: string;
    };
    sections: {
      [sectionId: string]: {
        title: {
          fr: string;
          de: string;
          it: string;
          en: string;
        };
        content: {
          fr: string;
          de: string;
          it: string;
          en: string;
        };
        keyPoints?: {
          fr: string;
          de: string;
          it: string;
          en: string;
        };
        example?: {
          fr: string;
          de: string;
          it: string;
          en: string;
        };
      };
    };
  };
}

export interface LegalReference {
  title: string;
  url: string;
}

// Base de données des articles
export const articles: Article[] = [
  // ========== SYSTÈME FISCAL SUISSE ==========
  {
    slug: 'systeme-fiscal-suisse',
    title: 'Le système fiscal suisse : Vue d\'ensemble',
    description: 'Comprendre la structure fédéraliste unique du système fiscal suisse avec ses trois niveaux d\'imposition',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Système fiscal',
    content: '',
    sections: [
      {
        id: 'structure-federale',
        title: 'Structure fédérale à trois niveaux',
        content: `Le système fiscal suisse est unique au monde par sa structure fédéraliste à trois niveaux. Contrairement à la plupart des pays qui ont un système centralisé, la Suisse répartit le pouvoir fiscal entre la Confédération, les 26 cantons et plus de 2'000 communes.

Cette structure découle directement de l'histoire suisse et du principe de subsidiarité inscrit dans la Constitution fédérale. Chaque niveau dispose de sa propre souveraineté fiscale dans les domaines qui lui sont attribués.

La Confédération prélève principalement l'impôt fédéral direct (IFD), la TVA, les droits de timbre et l'impôt anticipé. Les cantons ont une souveraineté étendue sur l'impôt sur le revenu et la fortune des personnes physiques, ainsi que sur l'impôt sur le bénéfice et le capital des personnes morales. Les communes, quant à elles, prélèvent généralement un pourcentage additionnel sur les impôts cantonaux.`,
        keyPoints: [
          'Trois niveaux d\'imposition : Confédération, cantons, communes',
          'Principe de subsidiarité : les décisions sont prises au niveau le plus proche du citoyen',
          'Souveraineté fiscale partagée entre les différents niveaux',
          'Plus de 2\'000 systèmes fiscaux communaux différents'
        ],
        example: 'Un habitant de Lausanne paie des impôts à trois niveaux : à la Confédération (IFD), au canton de Vaud (impôt cantonal) et à la commune de Lausanne (impôt communal calculé comme un multiple de l\'impôt cantonal).'
      },
      {
        id: 'repartition-competences',
        title: 'Répartition des compétences fiscales',
        content: `La Constitution fédérale définit précisément les compétences de chaque niveau. La Confédération ne peut prélever que les impôts expressément prévus par la Constitution, tandis que les cantons disposent d'une compétence générale résiduelle.

Les impôts exclusivement fédéraux incluent la TVA (8.1% taux normal), les droits de douane, l'impôt sur le tabac et l'alcool, ainsi que l'impôt anticipé de 35% sur les revenus de capitaux. L'impôt fédéral direct sur le revenu est plafonné constitutionnellement à 11.5%.

Les cantons ont une grande liberté dans la fixation de leurs barèmes d'imposition, ce qui crée une concurrence fiscale intercantonale. Cette concurrence est vue comme un élément positif du fédéralisme, incitant les cantons à une gestion efficace de leurs finances publiques.`,
        keyPoints: [
          'La Confédération a des compétences limitées définies par la Constitution',
          'Les cantons ont la compétence résiduelle en matière fiscale',
          'La concurrence fiscale intercantonale est un principe accepté',
          'Les communes dépendent largement des cantons pour leurs compétences'
        ],
        warning: 'La complexité du système peut rendre difficile la comparaison entre cantons. Un taux d\'imposition apparemment bas peut être compensé par des déductions limitées ou des impôts communaux élevés.'
      },
      {
        id: 'harmonisation',
        title: 'Harmonisation fiscale',
        content: `Depuis 1993, la Loi fédérale sur l'harmonisation des impôts directs (LHID) impose aux cantons certaines règles communes. Cette harmonisation porte sur l'assiette fiscale (ce qui est imposable), les déductions autorisées et les procédures, mais pas sur les tarifs et barèmes qui restent de la compétence cantonale.

L'harmonisation formelle signifie que tous les cantons doivent utiliser les mêmes définitions pour le revenu imposable, les mêmes périodes fiscales et des procédures similaires. Cela facilite la mobilité intercantonale et réduit les coûts administratifs.

Cependant, l'harmonisation matérielle (des taux) a toujours été rejetée politiquement, car elle remettrait en cause la souveraineté cantonale et la concurrence fiscale, considérées comme des piliers du système suisse.`,
        keyPoints: [
          'Harmonisation formelle depuis 1993 avec la LHID',
          'Définitions communes du revenu et des déductions',
          'Les taux et barèmes restent de compétence cantonale',
          'Équilibre entre harmonisation et souveraineté cantonale'
        ]
      },
      {
        id: 'avantages-defis',
        title: 'Avantages et défis du système',
        content: `Le fédéralisme fiscal suisse présente des avantages uniques : proximité avec les citoyens, adaptation aux besoins locaux, efficacité par la concurrence, et innovation fiscale. Les cantons peuvent expérimenter de nouvelles approches qui, si elles sont couronnées de succès, peuvent être adoptées ailleurs.

Les défis incluent la complexité administrative, les inégalités entre régions riches et pauvres, et la difficulté de coordination pour les projets nationaux. Le système de péréquation financière, réformé en 2008, vise à réduire les disparités excessives entre cantons.

Pour les contribuables, notamment les entreprises et les expatriés, cette complexité peut représenter un défi mais aussi une opportunité d'optimisation fiscale légale par le choix judicieux du lieu de résidence ou d'établissement.`,
        keyPoints: [
          'Avantages : proximité, efficacité, innovation',
          'Défis : complexité, inégalités, coordination',
          'Péréquation financière pour réduire les disparités',
          'Opportunités d\'optimisation fiscale légale'
        ],
        example: 'Le canton de Zoug a innové avec des taux très compétitifs pour attirer les entreprises, forçant d\'autres cantons à repenser leur stratégie fiscale. Cette concurrence a globalement conduit à une baisse de la charge fiscale sur les entreprises en Suisse.'
      }
    ],
    keywords: ['fédéralisme', 'souveraineté fiscale', 'trois niveaux', 'harmonisation', 'LHID'],
    relatedConcepts: [
      { slug: 'impot-federal-direct', title: 'Impôt fédéral direct' },
      { slug: 'souverainete-cantonale', title: 'Souveraineté cantonale' },
      { slug: 'harmonisation-fiscale', title: 'Harmonisation fiscale LHID' }
    ],
    legalReferences: [
      { title: 'Constitution fédérale - Régime financier', url: 'https://www.fedlex.admin.ch/eli/cc/1999/404/fr#chap_3/sec_3' },
      { title: 'Loi sur l\'harmonisation (LHID)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1256_1256_1256/fr' }
    ],
    nextArticle: { slug: 'bases-legales-fiscalite', title: 'Bases légales de la fiscalité' },
    lastUpdated: new Date('2024-01-15')
  },

  // ========== BASES LÉGALES ==========
  {
    slug: 'bases-legales-fiscalite',
    title: 'Les bases légales du droit fiscal suisse',
    description: 'Aperçu des principales lois qui régissent le système fiscal suisse : LIFD, LHID, LTVA et autres textes fondamentaux',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Bases légales',
    content: '',
    sections: [
      {
        id: 'hierarchie-normes',
        title: 'Hiérarchie des normes fiscales',
        content: `Le droit fiscal suisse s'organise selon une hiérarchie stricte des normes juridiques. Au sommet se trouve la Constitution fédérale qui définit les compétences de base et les principes fondamentaux comme l'égalité devant l'impôt et la capacité contributive.

Les lois fédérales, adoptées par le Parlement, concrétisent ces principes constitutionnels. Les principales sont la LIFD (Loi sur l'impôt fédéral direct), la LHID (harmonisation), la LTVA (TVA), et la LIA (impôt anticipé).

Les ordonnances du Conseil fédéral et les circulaires de l'Administration fédérale des contributions (AFC) complètent ce dispositif en précisant les modalités d'application. Bien que les circulaires n'aient pas force de loi, elles sont généralement suivies par les administrations et les tribunaux.

Au niveau cantonal, chaque canton dispose de sa propre loi fiscale, qui doit respecter le cadre de la LHID pour les impôts directs. Les communes édictent des règlements dans le cadre défini par leur canton.`,
        keyPoints: [
          'Constitution fédérale au sommet de la hiérarchie',
          'Lois fédérales pour chaque type d\'impôt',
          'Ordonnances et circulaires pour l\'application',
          'Lois cantonales dans le respect de la LHID',
          'Règlements communaux selon le droit cantonal'
        ],
        warning: 'Les circulaires de l\'AFC, bien qu\'importantes en pratique, peuvent être contestées devant les tribunaux si elles vont au-delà de la loi.'
      },
      {
        id: 'lifd',
        title: 'LIFD - Loi sur l\'impôt fédéral direct',
        content: `La LIFD régit l'impôt fédéral direct sur le revenu des personnes physiques et le bénéfice des personnes morales. C'est l'une des lois fiscales les plus importantes, car elle définit de nombreux concepts repris par les cantons.

Pour les personnes physiques, la LIFD établit un barème progressif plafonné à 11.5% (taux marginal maximal). Elle définit précisément ce qui constitue un revenu imposable, les déductions autorisées, et les procédures de taxation.

Pour les personnes morales, elle fixe un taux unique de 8.5% sur le bénéfice. La loi contient également des dispositions importantes sur la détermination du bénéfice imposable, les participations, et les restructurations.

La LIFD sert souvent de modèle pour les lois cantonales, créant une certaine uniformité malgré le fédéralisme. Les tribunaux s'y réfèrent fréquemment pour interpréter les lois cantonales.`,
        keyPoints: [
          'Impôt fédéral direct sur revenu et bénéfice',
          'Taux maximum 11.5% pour les personnes physiques',
          'Taux unique 8.5% pour les sociétés',
          'Modèle pour les législations cantonales',
          'Définitions précises des concepts fiscaux'
        ],
        example: 'La définition du "revenu d\'activité indépendante" dans la LIFD est reprise par tous les cantons, assurant une application uniforme de ce concept important.'
      },
      {
        id: 'lhid',
        title: 'LHID - Loi sur l\'harmonisation',
        content: `La LHID, entrée en vigueur en 1993, constitue un tournant dans l'histoire fiscale suisse. Elle impose aux 26 cantons un cadre commun pour leurs impôts directs, tout en préservant leur souveraineté sur les taux.

L'harmonisation porte sur l'assujettissement (qui doit payer), l'objet de l'impôt (sur quoi), la procédure, et le droit pénal fiscal. Les cantons ont eu jusqu'en 2001 pour adapter leurs législations.

La loi définit 16 déductions obligatoires que tous les cantons doivent accorder, comme les cotisations AVS/AI/APG, les frais professionnels, ou les versements au 3e pilier. Les cantons peuvent accorder des déductions supplémentaires.

Cette harmonisation facilite grandement la mobilité intercantonale et réduit les coûts de conformité pour les entreprises actives dans plusieurs cantons. Elle a aussi permis l'échange d'informations entre administrations fiscales cantonales.`,
        keyPoints: [
          'Harmonisation formelle depuis 1993',
          '16 déductions obligatoires dans tous les cantons',
          'Procédures unifiées',
          'Facilite la mobilité et réduit les coûts',
          'Les taux restent de compétence cantonale'
        ]
      },
      {
        id: 'ltva',
        title: 'LTVA - Loi sur la TVA',
        content: `La LTVA régit la taxe sur la valeur ajoutée, principale source de revenus de la Confédération (environ 22 milliards CHF par an). Le système suisse de TVA est relativement simple avec trois taux : normal (8.1%), réduit (2.6%) et spécial pour l'hébergement (3.8%).

L'assujettissement obligatoire commence à partir d'un chiffre d'affaires de 100'000 CHF. Les entreprises peuvent opter pour l'assujettissement volontaire en dessous de ce seuil. La loi prévoit aussi des méthodes simplifiées pour les PME (taux forfaitaires et taux de la dette fiscale nette).

Le mécanisme de déduction de l'impôt préalable permet aux entreprises de récupérer la TVA payée sur leurs achats professionnels, garantissant que seule la valeur ajoutée est effectivement taxée. Ce système nécessite une comptabilité rigoureuse et des décomptes réguliers.

Des exemptions importantes existent pour la santé, l'éducation, les services financiers et les locations immobilières. Ces secteurs peuvent opter pour l'imposition volontaire dans certains cas.`,
        keyPoints: [
          'Trois taux : 8.1%, 2.6%, 3.8%',
          'Seuil d\'assujettissement à 100\'000 CHF',
          'Déduction de l\'impôt préalable',
          'Méthodes simplifiées pour PME',
          'Exemptions pour certains secteurs'
        ],
        example: 'Un restaurant avec 80\'000 CHF de chiffre d\'affaires n\'est pas obligatoirement assujetti, mais peut choisir de l\'être pour récupérer la TVA sur ses investissements.'
      },
      {
        id: 'autres-lois',
        title: 'Autres lois fiscales importantes',
        content: `Le paysage législatif fiscal suisse comprend de nombreuses autres lois spécialisées. La LIA (Loi sur l'impôt anticipé) régit la retenue de 35% sur les revenus de capitaux, servant à la fois de garantie fiscale et de lutte contre la fraude.

La LT (Loi sur les droits de timbre) taxe certaines transactions sur titres et les primes d'assurance. Bien que critiquée, elle rapporte encore plusieurs milliards annuellement. Des réformes sont régulièrement discutées.

La LIPM (Loi sur l'imposition des personnes morales) et les diverses lois sur les impôts spéciaux (tabac, alcool, huiles minérales, véhicules) complètent le dispositif. Chaque canton a également ses propres lois sur les droits de mutation, les gains immobiliers et les successions.

Les conventions de double imposition (CDI), bien que n'étant pas des lois internes, ont force de loi et priment sur le droit interne. La Suisse en a conclu plus de 100, facilitant les échanges économiques internationaux.`,
        keyPoints: [
          'LIA : impôt anticipé de 35%',
          'Droits de timbre sur transactions',
          'Impôts de consommation spéciaux',
          'Lois cantonales sur mutations et successions',
          'Plus de 100 conventions de double imposition'
        ],
        warning: 'Les conventions internationales priment sur le droit interne suisse, ce qui peut créer des situations particulières pour les contribuables concernés.'
      }
    ],
    keywords: ['LIFD', 'LHID', 'LTVA', 'LIA', 'lois fiscales', 'hiérarchie des normes'],
    relatedConcepts: [
      { slug: 'systeme-fiscal-suisse', title: 'Système fiscal suisse' },
      { slug: 'impot-federal-direct', title: 'Impôt fédéral direct' },
      { slug: 'tva-suisse', title: 'TVA en Suisse' }
    ],
    legalReferences: [
      { title: 'LIFD - Texte de loi', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr' },
      { title: 'LHID - Texte de loi', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1256_1256_1256/fr' },
      { title: 'LTVA - Texte de loi', url: 'https://www.fedlex.admin.ch/eli/cc/2009/615/fr' }
    ],
    previousArticle: { slug: 'systeme-fiscal-suisse', title: 'Système fiscal suisse' },
    nextArticle: { slug: 'principes-imposition', title: 'Principes d\'imposition' },
    lastUpdated: new Date('2024-01-15')
  },

  // ========== PRINCIPES D'IMPOSITION ==========
  {
    slug: 'principes-imposition',
    title: 'Les principes fondamentaux de l\'imposition',
    description: 'Comprendre les principes constitutionnels qui gouvernent la fiscalité suisse : capacité contributive, égalité, légalité et progressivité',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Principes',
    content: '',
    sections: [
      {
        id: 'capacite-contributive',
        title: 'Le principe de la capacité contributive',
        content: `La capacité contributive est le principe cardinal du droit fiscal suisse, ancré dans l'article 127 de la Constitution fédérale. Il signifie que chacun doit contribuer aux charges publiques selon ses moyens économiques réels.

Ce principe se concrétise par la prise en compte de la situation personnelle et familiale du contribuable. Un célibataire et un père de famille avec le même revenu n'ont pas la même capacité contributive. C'est pourquoi existent des déductions pour charges de famille, des barèmes différenciés et des minima vitaux exonérés.

La capacité contributive justifie également la progressivité de l'impôt : plus le revenu augmente, plus le taux d'imposition s'élève, car la capacité de contribution augmente plus que proportionnellement. Les premiers francs servent aux besoins essentiels, les suivants au confort, puis au luxe et à l'épargne.

Le Tribunal fédéral veille strictement au respect de ce principe. Il a par exemple jugé inconstitutionnelles des impositions qui ne tenaient pas compte des charges effectives ou qui imposaient des revenus fictifs.`,
        keyPoints: [
          'Principe constitutionnel fondamental (art. 127 Cst.)',
          'Imposition selon les moyens économiques réels',
          'Prise en compte de la situation personnelle',
          'Justifie la progressivité de l\'impôt',
          'Contrôle strict par le Tribunal fédéral'
        ],
        example: 'Une famille avec 80\'000 CHF de revenu et 3 enfants paie moins d\'impôts qu\'un célibataire avec le même revenu, car sa capacité contributive est réduite par les charges familiales.',
        warning: 'L\'imposition d\'après la dépense (forfait fiscal) constitue une exception controversée au principe de capacité contributive, justifiée par des considérations économiques.'
      },
      {
        id: 'egalite-devant-impot',
        title: 'L\'égalité devant l\'impôt',
        content: `L'égalité devant l'impôt découle du principe général d'égalité inscrit dans la Constitution. Il implique que les contribuables dans des situations comparables doivent être traités de manière identique (égalité horizontale) et que ceux dans des situations différentes doivent être traités différemment (égalité verticale).

Ce principe interdit les privilèges fiscaux arbitraires et la discrimination. Toute différence de traitement doit être justifiée objectivement. Par exemple, les déductions pour frais professionnels sont justifiées car ces dépenses réduisent la capacité contributive.

L'égalité s'applique aussi à la procédure : tous les contribuables ont les mêmes droits et obligations procéduraux. L'administration fiscale ne peut pas appliquer des pratiques différentes selon les personnes sans justification légale.

La lutte contre la fraude et l'évasion fiscale est aussi une question d'égalité : ceux qui trichent créent une inégalité au détriment des contribuables honnêtes. C'est pourquoi l'échange automatique d'informations et les contrôles sont essentiels.`,
        keyPoints: [
          'Traitement identique des situations comparables',
          'Interdiction de la discrimination arbitraire',
          'Égalité dans la procédure fiscale',
          'Justification objective des différences',
          'Lutte contre la fraude pour préserver l\'égalité'
        ],
        example: 'Tous les salariés peuvent déduire leurs frais de transport professionnels selon les mêmes règles, qu\'ils soient cadres ou ouvriers.'
      },
      {
        id: 'legalite',
        title: 'Le principe de légalité',
        content: `"Pas d'impôt sans loi" - ce principe fondamental signifie que tout impôt doit reposer sur une base légale claire. La loi doit définir le cercle des contribuables, l'objet de l'impôt, son assiette, le tarif et les exemptions.

Ce principe protège les citoyens contre l'arbitraire administratif. L'administration fiscale ne peut pas créer de nouveaux impôts ou modifier les règles existantes sans base légale. Même les circulaires doivent rester dans le cadre de la loi.

La légalité implique aussi la prévisibilité : le contribuable doit pouvoir connaître à l'avance ses obligations fiscales. Les lois rétroactives sont en principe interdites, sauf exceptions strictement encadrées.

Le principe s'étend à la procédure : les délais, les voies de recours, les sanctions doivent être prévus par la loi. Cela garantit la sécurité juridique et l'État de droit en matière fiscale.`,
        keyPoints: [
          'Tout impôt doit avoir une base légale',
          'Protection contre l\'arbitraire administratif',
          'Prévisibilité des obligations fiscales',
          'Interdiction de principe de la rétroactivité',
          'Procédure réglée par la loi'
        ],
        warning: 'Les pratiques administratives constantes peuvent créer une protection de la bonne foi, mais ne remplacent jamais la loi.'
      },
      {
        id: 'periodicite',
        title: 'Périodicité et annualité',
        content: `L'impôt sur le revenu et la fortune suit le principe de périodicité annuelle. L'année fiscale correspond généralement à l'année civile, et chaque période est imposée séparément. Ce principe a des implications pratiques importantes.

Le système postnumerando appliqué partout sauf au niveau fédéral signifie qu'on paie en année N les impôts sur les revenus de l'année N. Cela nécessite des acomptes provisoires basés sur la dernière taxation connue, avec régularisation ultérieure.

La périodicité annuelle signifie aussi que les revenus extraordinaires (gains de loterie, prestations en capital) sont souvent imposés séparément à des taux privilégiés pour éviter la progression excessive due au cumul.

Les changements de situation en cours d'année (mariage, divorce, naissance, décès) sont pris en compte pro rata temporis. Les déménagements intercantonaux nécessitent une répartition entre les cantons concernés.`,
        keyPoints: [
          'Imposition par période annuelle',
          'Système postnumerando (sauf IFD)',
          'Acomptes provisoires et régularisation',
          'Imposition séparée des revenus extraordinaires',
          'Répartition pro rata en cas de changement'
        ],
        example: 'Un déménagement de Genève à Zurich au 1er juillet implique que chaque canton taxe 6 mois de revenus, avec application de son propre barème sur le revenu annualisé.'
      },
      {
        id: 'progressivite',
        title: 'La progressivité de l\'impôt',
        content: `La progressivité signifie que le taux d'imposition augmente avec le revenu. Ce n'est pas un principe constitutionnel en soi, mais il découle de la capacité contributive. Les premiers revenus, nécessaires à la subsistance, sont peu ou pas imposés.

On distingue le taux marginal (sur le dernier franc gagné) du taux effectif (moyenne sur l'ensemble du revenu). Le taux marginal peut atteindre 40-45% dans certains cantons pour les très hauts revenus, mais le taux effectif reste toujours inférieur.

La progressivité peut être directe (barème avec tranches) ou indirecte (via les déductions). Elle peut être linéaire, dégressive ou plafonnée. L'impôt fédéral direct plafonne à 11.5%, créant une dégressivité pour les très hauts revenus.

Les effets de seuil et la progression à froid sont des défis de la progressivité. Des mécanismes comme le splitting familial ou l'indexation des barèmes visent à les atténuer.`,
        keyPoints: [
          'Taux croissant avec le revenu',
          'Distinction taux marginal / taux effectif',
          'Différents types de progression',
          'Plafonnement possible (IFD à 11.5%)',
          'Défis : effets de seuil, progression à froid'
        ],
        example: 'Avec un barème progressif, passer de 100\'000 à 110\'000 CHF de revenu peut impliquer un taux marginal de 30%, mais le taux effectif sur l\'ensemble ne sera que de 18-20%.'
      }
    ],
    keywords: ['capacité contributive', 'égalité', 'légalité', 'progressivité', 'périodicité'],
    relatedConcepts: [
      { slug: 'baremes-imposition', title: 'Barèmes d\'imposition' },
      { slug: 'deductions-fiscales', title: 'Déductions fiscales' },
      { slug: 'taux-marginal-effectif', title: 'Taux marginal vs effectif' }
    ],
    legalReferences: [
      { title: 'Constitution fédérale - Art. 127', url: 'https://www.fedlex.admin.ch/eli/cc/1999/404/fr#art_127' },
      { title: 'ATF sur la capacité contributive', url: 'https://www.bger.ch/' }
    ],
    previousArticle: { slug: 'bases-legales-fiscalite', title: 'Bases légales' },
    nextArticle: { slug: 'types-impots', title: 'Types d\'impôts' },
    lastUpdated: new Date('2024-01-15')
  },

  // ========== TYPES D'IMPÔTS ==========
  {
    slug: 'types-impots',
    title: 'Les différents types d\'impôts en Suisse',
    description: 'Classification et caractéristiques des impôts directs, indirects, sur le revenu, la fortune, la consommation et les transactions',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Types d\'impôts',
    content: '',
    sections: [
      {
        id: 'classification-generale',
        title: 'Classification générale des impôts',
        content: `Le système fiscal suisse distingue plusieurs catégories d'impôts selon différents critères. La distinction principale oppose les impôts directs, payés directement par le contribuable sur ses revenus ou sa fortune, aux impôts indirects, incorporés dans le prix des biens et services.

Les impôts directs incluent l'impôt sur le revenu, l'impôt sur la fortune, l'impôt sur le bénéfice et l'impôt sur le capital. Ils sont généralement progressifs et tiennent compte de la capacité contributive personnelle.

Les impôts indirects comprennent la TVA, les droits de douane, les impôts sur le tabac, l'alcool et les carburants. Ils sont proportionnels et frappent la consommation indépendamment de la situation personnelle du consommateur.

Une autre classification distingue les impôts généraux (sur l'ensemble du revenu ou de la consommation) des impôts spéciaux (sur des objets particuliers comme les véhicules ou les chiens). On distingue aussi les impôts périodiques (annuels) des impôts uniques (droits de mutation).`,
        keyPoints: [
          'Impôts directs vs indirects',
          'Impôts généraux vs spéciaux',
          'Impôts périodiques vs uniques',
          'Impôts personnels vs réels',
          'Critères de classification multiples'
        ]
      },
      {
        id: 'impots-directs-personnes',
        title: 'Impôts directs sur les personnes physiques',
        content: `L'impôt sur le revenu constitue la principale charge fiscale pour la plupart des personnes physiques. Il frappe l'ensemble des revenus : salaires, revenus indépendants, rentes, revenus de capitaux et immobiliers. Chaque niveau (Confédération, canton, commune) prélève sa part.

L'impôt sur la fortune, spécificité suisse de plus en plus rare dans le monde, frappe la fortune nette (actifs moins dettes). Seuls les cantons et communes le prélèvent, pas la Confédération. Les taux varient fortement entre cantons, de 0.1% à 1% environ.

L'impôt à la source concerne les étrangers sans permis C et certains revenus spécifiques. Il est prélevé directement par l'employeur ou le débiteur. Une taxation ordinaire ultérieure est possible pour les revenus élevés (plus de 120'000 CHF dans la plupart des cantons).

Les gains en capital privés sont généralement exonérés (sauf immobilier), ce qui distingue la Suisse de nombreux pays. Cette exonération incite à la constitution de patrimoine mais nécessite de distinguer les gains privés des gains commerciaux.`,
        keyPoints: [
          'Impôt sur le revenu à trois niveaux',
          'Impôt sur la fortune (cantonal uniquement)',
          'Impôt à la source pour étrangers',
          'Exonération des gains en capital privés',
          'Imposition selon la capacité contributive'
        ],
        example: 'Un salarié étranger avec permis B voit son impôt prélevé à la source chaque mois. S\'il gagne plus de 120\'000 CHF, il devra faire une déclaration complète pour régularisation.'
      },
      {
        id: 'impots-directs-entreprises',
        title: 'Impôts directs sur les entreprises',
        content: `L'impôt sur le bénéfice frappe les personnes morales (SA, Sàrl) sur leur bénéfice net. Le taux fédéral est de 8.5%, auquel s'ajoutent les impôts cantonaux et communaux. Les taux effectifs totaux varient de 12% à 21% selon les cantons.

L'impôt sur le capital, prélevé uniquement par les cantons, frappe le capital propre des sociétés. C'est un impôt minimum qui garantit une contribution même en l'absence de bénéfice. Certains cantons l'ont fortement réduit ou prévoient l'imputation sur l'impôt sur le bénéfice.

Les distributions de dividendes subissent l'impôt anticipé de 35% à la source, récupérable pour les résidents suisses qui déclarent correctement. Pour les participations qualifiées (plus de 10%), une imposition réduite s'applique pour éviter la double imposition économique.

Les restructurations d'entreprises peuvent bénéficier de la neutralité fiscale si certaines conditions sont remplies. Les réserves latentes peuvent être transférées sans imposition immédiate, facilitant les réorganisations économiquement justifiées.`,
        keyPoints: [
          'Impôt sur le bénéfice (8.5% fédéral + cantonal)',
          'Impôt sur le capital (cantonal uniquement)',
          'Impôt anticipé 35% sur dividendes',
          'Imposition réduite des participations qualifiées',
          'Neutralité fiscale des restructurations'
        ],
        warning: 'La réforme fiscale RFFA de 2020 a supprimé les statuts spéciaux mais introduit de nouveaux instruments comme la patent box et les super-déductions R&D.'
      },
      {
        id: 'impots-indirects',
        title: 'Impôts indirects et sur la consommation',
        content: `La TVA représente la principale recette de la Confédération avec environ 23 milliards CHF annuels. Avec ses trois taux (8.1%, 2.6%, 3.8%), elle reste modérée en comparaison internationale. Le système de déduction de l'impôt préalable garantit la neutralité pour les entreprises.

Les impôts sur les huiles minérales (essence, diesel) combinent objectifs fiscaux et écologiques. Ils incluent l'impôt sur les huiles minérales proprement dit et la surtaxe, rapportant ensemble environ 5 milliards annuels. Une partie finance les routes, une autre les transports publics.

Les impôts sur le tabac et l'alcool ont une dimension de santé publique. Ils visent à décourager la consommation tout en générant des recettes. L'impôt sur le tabac rapporte environ 2 milliards, celui sur l'alcool 300 millions.

Les droits de timbre frappent certaines transactions sur titres et les primes d'assurance. Critiqués pour leur effet sur la place financière, ils sont régulièrement remis en question mais rapportent encore 2 milliards annuels.`,
        keyPoints: [
          'TVA : principale recette fédérale',
          'Impôts sur carburants à double objectif',
          'Taxes comportementales (tabac, alcool)',
          'Droits de timbre controversés',
          'Neutralité pour les entreprises (TVA)'
        ],
        example: 'Un fumeur paie environ 60% de taxes sur un paquet de cigarettes : TVA plus impôt sur le tabac, soit une contribution fiscale importante sur sa consommation.'
      },
      {
        id: 'impots-speciaux',
        title: 'Impôts spéciaux et taxes causales',
        content: `Au-delà des grands impôts, une multitude de taxes spéciales existe à tous les niveaux. L'impôt sur les véhicules, cantonal, combine une taxe de base et souvent une composante écologique basée sur les émissions CO2.

L'impôt sur les gains immobiliers, exclusivement cantonal, frappe les plus-values réalisées sur les immeubles. Les taux peuvent être dégressifs selon la durée de détention, encourageant la stabilité du marché immobilier.

Les droits de mutation immobilière, également cantonaux, frappent les transferts de propriété. Ils varient de 0.2% à 3.5% selon les cantons. Certains cantons les ont supprimés pour favoriser l'accès à la propriété.

Les taxes causales (eau, épuration, déchets) suivent le principe du pollueur-payeur. Elles financent des services spécifiques et doivent respecter le principe d'équivalence entre la taxe et la prestation.`,
        keyPoints: [
          'Impôt sur les véhicules avec composante écologique',
          'Gains immobiliers imposés au niveau cantonal',
          'Droits de mutation variables',
          'Taxes causales selon le principe d\'équivalence',
          'Grande diversité selon les cantons'
        ],
        example: 'La vente d\'un appartement à Genève après 5 ans de détention peut générer un impôt sur le gain immobilier de 20-30% de la plus-value, plus les droits de mutation pour l\'acheteur.'
      }
    ],
    keywords: ['impôts directs', 'impôts indirects', 'TVA', 'impôt sur le revenu', 'impôt sur la fortune'],
    relatedConcepts: [
      { slug: 'impot-revenu-personnes', title: 'Impôt sur le revenu' },
      { slug: 'tva-suisse', title: 'TVA en Suisse' },
      { slug: 'impot-anticipé', title: 'Impôt anticipé' }
    ],
    legalReferences: [
      { title: 'Vue d\'ensemble AFC', url: 'https://www.estv.admin.ch/estv/fr/home.html' },
      { title: 'Types d\'impôts par canton', url: 'https://www.ch.ch/fr/impots/' }
    ],
    previousArticle: { slug: 'principes-imposition', title: 'Principes d\'imposition' },
    nextArticle: { slug: 'domicile-fiscal', title: 'Domicile fiscal' },
    lastUpdated: new Date('2024-01-15')
  },

  // ========== DOMICILE FISCAL ==========
  {
    slug: 'domicile-fiscal',
    title: 'Domicile fiscal et résidence',
    description: 'Comprendre les critères de détermination du domicile fiscal, la distinction avec la résidence, et les implications pour l\'imposition',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Domicile et résidence',
    content: '',
    sections: [
      {
        id: 'definition-domicile',
        title: 'Définition du domicile fiscal',
        content: `Le domicile fiscal détermine où une personne doit payer ses impôts sur l'ensemble de ses revenus et sa fortune mondiale. En Suisse, le domicile fiscal suit généralement le domicile civil défini par le Code civil, mais des critères fiscaux spécifiques s'appliquent.

Une personne a son domicile fiscal en Suisse si elle y réside avec l'intention de s'y établir durablement, ou si elle y séjourne sans interruption notable pendant au moins 90 jours avec activité lucrative, ou 180 jours sans activité. Le centre des intérêts vitaux (famille, travail, liens sociaux) est déterminant.

Le domicile fiscal est unique : on ne peut avoir qu'un seul domicile fiscal principal, même si on possède plusieurs résidences. En cas de doute, les autorités examinent où se trouve le centre des intérêts vitaux de la personne.

Le changement de domicile fiscal a des conséquences importantes : fin de l'assujettissement illimité dans l'ancien canton, début dans le nouveau, avec répartition pro rata temporis pour l'année du déménagement.`,
        keyPoints: [
          'Domicile unique déterminant l\'assujettissement',
          'Critères : intention durable ou séjour prolongé',
          'Centre des intérêts vitaux décisif',
          '90 jours avec activité ou 180 sans',
          'Répartition pro rata en cas de changement'
        ],
        example: 'Un cadre international qui passe 200 jours par an en Suisse, y a sa famille et ses principaux liens sociaux, aura son domicile fiscal en Suisse même s\'il voyage fréquemment.',
        warning: 'Le simple fait d\'être inscrit au registre des habitants ne suffit pas à établir le domicile fiscal si le centre des intérêts vitaux est ailleurs.'
      },
      {
        id: 'residence-secondaire',
        title: 'Résidence secondaire et séjour',
        content: `La résidence secondaire crée un assujettissement limité : seuls les revenus et la fortune situés dans le canton de la résidence secondaire y sont imposables. C'est typiquement le cas pour les propriétaires de chalets de vacances.

Le séjour fiscal, distinct du domicile, peut créer un assujettissement temporaire. Les travailleurs saisonniers, étudiants ou personnes en formation sont souvent assujettis sur la base du séjour, avec des règles spécifiques.

La distinction est cruciale : le domicile entraîne l'assujettissement illimité (revenus mondiaux), la résidence seulement l'assujettissement limité (revenus locaux). Les cantons se coordonnent pour éviter la double imposition intercantonale.

Les week-ends passés hors du lieu de travail ne constituent généralement pas une interruption notable du séjour. Les autorités regardent la situation globale sur l'année, pas les déplacements ponctuels.`,
        keyPoints: [
          'Résidence secondaire = assujettissement limité',
          'Séjour peut créer assujettissement temporaire',
          'Distinction domicile (illimité) / résidence (limité)',
          'Coordination intercantonale contre double imposition',
          'Vue d\'ensemble annuelle, pas ponctuelle'
        ],
        example: 'Un Zurichois propriétaire d\'un chalet à Verbier paiera l\'impôt sur la valeur locative et la fortune immobilière en Valais, mais ses autres revenus restent imposables à Zurich.'
      },
      {
        id: 'determination-pratique',
        title: 'Détermination pratique et indices',
        content: `Les autorités fiscales utilisent un faisceau d'indices pour déterminer le domicile fiscal en cas de doute. Aucun critère n'est à lui seul déterminant, c'est l'ensemble qui compte.

Les indices principaux incluent : lieu de résidence de la famille, lieu de travail principal, inscription au registre des habitants, centre des relations sociales, lieu d'exercice des droits politiques, plaques de véhicules, abonnements et affiliations.

Le logement disponible en permanence est un indice fort, surtout s'il s'agit du logement familial. La location de sa résidence principale est souvent vue comme un signe de déplacement du domicile.

En cas de conflit entre cantons ou avec l'étranger, des procédures de conciliation existent. Les conventions de double imposition contiennent des règles de départage (tie-breaker rules) pour les cas complexes.`,
        keyPoints: [
          'Faisceau d\'indices, pas de critère unique',
          'Famille et travail sont des indices forts',
          'Logement permanent disponible important',
          'Procédures de conciliation en cas de conflit',
          'Conventions internationales pour cas complexes'
        ]
      },
      {
        id: 'cas-particuliers',
        title: 'Cas particuliers et situations spéciales',
        content: `Les frontaliers constituent un cas particulier : ils conservent leur domicile fiscal dans leur pays de résidence mais sont imposés sur leur salaire suisse selon les accords bilatéraux spécifiques à chaque pays voisin.

Les diplomates et fonctionnaires internationaux bénéficient souvent de privilèges fiscaux. Leur domicile fiscal peut rester dans leur pays d'origine malgré une présence prolongée en Suisse.

Les étudiants gardent généralement leur domicile fiscal chez leurs parents, sauf s'ils s'établissent durablement avec une activité lucrative. Le simple fait d'étudier ne crée pas un nouveau domicile fiscal.

Les rentiers étrangers peuvent bénéficier de l'imposition d'après la dépense (forfait fiscal) s'ils n'exercent pas d'activité lucrative en Suisse. Leur domicile fiscal est en Suisse mais avec un régime d'imposition spécial.`,
        keyPoints: [
          'Frontaliers : règles spéciales par pays',
          'Diplomates : privilèges et immunités',
          'Étudiants : domicile parental maintenu',
          'Forfait fiscal pour rentiers étrangers',
          'Conventions bilatérales déterminantes'
        ],
        warning: 'Le forfait fiscal est régulièrement remis en question politiquement. Certains cantons l\'ont supprimé, d\'autres ont durci les conditions.'
      },
      {
        id: 'consequences-changement',
        title: 'Conséquences du changement de domicile',
        content: `Le départ de Suisse entraîne la fin de l'assujettissement illimité. Une "exit tax" peut s'appliquer sur certains éléments, notamment les prestations de prévoyance non encore imposées.

L'arrivée en Suisse crée l'assujettissement dès le premier jour. Les revenus acquis avant l'arrivée ne sont pas imposables, mais la fortune mondiale devient imposable immédiatement. Une planification est souvent nécessaire.

Le déménagement intercantonal nécessite une répartition précise des revenus et déductions entre les cantons. Chaque canton applique son propre barème sur la quote-part qui lui revient. Les différences de charge fiscale peuvent être significatives.

Les implications vont au-delà des impôts : assurances sociales, droit de vote, scolarité des enfants. Une approche globale est nécessaire lors d'un changement de domicile.`,
        keyPoints: [
          'Exit tax possible au départ de Suisse',
          'Assujettissement immédiat à l\'arrivée',
          'Répartition complexe entre cantons',
          'Différences de charge fiscale importantes',
          'Implications au-delà de la fiscalité'
        ],
        example: 'Un déménagement de Genève (charge fiscale élevée) à Zoug (charge faible) peut réduire les impôts de 30-40% pour les hauts revenus, justifiant une planification minutieuse.'
      }
    ],
    keywords: ['domicile fiscal', 'résidence', 'assujettissement', 'centre des intérêts vitaux', 'frontaliers'],
    relatedConcepts: [
      { slug: 'assujettissement-fiscal', title: 'Assujettissement fiscal' },
      { slug: 'frontaliers-fiscalite', title: 'Fiscalité des frontaliers' },
      { slug: 'double-imposition', title: 'Double imposition' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 3-5 (Assujettissement)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_3' },
      { title: 'Circulaire AFC sur le domicile', url: 'https://www.estv.admin.ch/' }
    ],
    previousArticle: { slug: 'types-impots', title: 'Types d\'impôts' },
    nextArticle: { slug: 'baremes-progressivite', title: 'Barèmes et progressivité' },
    lastUpdated: new Date('2024-01-15')
  },

  // ========== BARÈMES ET PROGRESSIVITÉ ==========
  {
    slug: 'baremes-progressivite',
    title: 'Barèmes et progressivité de l\'impôt',
    description: 'Comprendre les barèmes d\'imposition, la progressivité, les taux marginaux et effectifs en Suisse',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Barèmes et progressivité',
    content: '',
    sections: [
      {
        id: 'principe-progressivite',
        title: 'Le principe de progressivité',
        content: `La progressivité de l'impôt signifie que le taux d'imposition augmente avec le niveau de revenu. Ce principe découle de la capacité contributive : plus le revenu est élevé, plus la capacité à contribuer aux charges publiques est importante.

La progressivité repose sur l'idée que les premiers francs de revenu servent à couvrir les besoins vitaux (nourriture, logement, santé) et doivent donc être peu ou pas imposés. Les revenus supplémentaires permettent un niveau de vie plus confortable et peuvent supporter une imposition plus élevée.

En Suisse, tous les niveaux (Confédération, cantons, communes) appliquent des barèmes progressifs pour l'impôt sur le revenu des personnes physiques. Seul l'impôt sur le bénéfice des personnes morales suit un taux proportionnel.

La progressivité peut être directe (barème à tranches) ou indirecte (via les déductions). Elle peut aussi être linéaire, dégressive ou plafonnée selon les choix politiques de chaque niveau de collectivité.`,
        keyPoints: [
          'Taux croissant avec le niveau de revenu',
          'Basé sur le principe de capacité contributive',
          'Préservation du minimum vital',
          'Application à tous les niveaux en Suisse',
          'Différentes formes de progressivité possibles'
        ],
        example: 'Avec un revenu de 50\'000 CHF, on peut payer 8% d\'impôt effectif, mais avec 150\'000 CHF, le taux effectif peut atteindre 25%, illustrant la progressivité.'
      },
      {
        id: 'taux-marginal-effectif',
        title: 'Taux marginal vs taux effectif',
        content: `Le taux marginal représente l'impôt payé sur le dernier franc gagné. C'est le taux qui s'applique à la tranche de revenu la plus élevée selon le barème progressif. Il détermine l'incitation fiscale marginale au travail ou à l'épargne.

Le taux effectif (ou moyen) correspond à l'impôt total divisé par le revenu total. Il est toujours inférieur au taux marginal dans un système progressif, car les tranches inférieures sont imposées à des taux plus faibles.

Cette distinction est cruciale pour la prise de décision économique. Le taux marginal influence les choix d'activité supplémentaire (heures supplémentaires, bonus), tandis que le taux effectif mesure la charge fiscale globale.

Dans les cantons suisses, le taux marginal peut atteindre 40-45% pour les très hauts revenus (combinant fédéral, cantonal et communal), mais le taux effectif reste généralement bien inférieur, même pour les contribuables aisés.`,
        keyPoints: [
          'Taux marginal = impôt sur dernier franc gagné',
          'Taux effectif = charge fiscale moyenne globale',
          'Taux effectif toujours < taux marginal',
          'Influence différente sur décisions économiques',
          'Taux marginaux suisses jusqu\'à 40-45%'
        ],
        example: 'Un contribuable avec 200\'000 CHF de revenu peut avoir un taux marginal de 35% mais un taux effectif de 20%, car ses premiers revenus sont imposés à des taux plus faibles.'
      },
      {
        id: 'baremes-cantonaux',
        title: 'Diversité des barèmes cantonaux',
        content: `Chaque canton suisse dispose de sa souveraineté pour fixer ses barèmes d'imposition, créant une grande diversité de systèmes. Certains cantons privilégient des taux modérés avec une progressivité douce, d'autres acceptent des taux plus élevés pour financer des services publics étoffés.

Les cantons compétitifs comme Zoug ou Nidwald appliquent des barèmes plafonnés rapidement, évitant une progressivité excessive sur les hauts revenus. À l'inverse, des cantons comme Genève ou le Jura maintiennent une forte progressivité jusqu'aux revenus très élevés.

La structure des barèmes varie aussi : certains utilisent de nombreuses tranches pour une progressivité fine, d'autres préfèrent des tranches larges. Le point de départ de l'imposition (seuil d'exonération) diffère également significativement.

Les coefficients communaux viennent multiplier l'impôt cantonal, ajoutant une couche de variation. Une commune peut avoir un coefficient de 0.8 (réduction de 20%) ou 1.5 (majoration de 50%) selon ses besoins financiers et ses choix politiques.`,
        keyPoints: [
          'Souveraineté cantonale sur les barèmes',
          'Stratégies différentes : compétitivité vs services',
          'Variation structure : tranches et seuils',
          'Coefficients communaux multiplicateurs',
          'Grande diversité entre 26 systèmes'
        ],
        warning: 'Un taux cantonal apparemment attractif peut être pénalisé par un coefficient communal élevé. Il faut toujours analyser la charge fiscale totale.'
      },
      {
        id: 'effets-economiques',
        title: 'Effets économiques de la progressivité',
        content: `La progressivité a des effets redistributifs évidents : elle réduit les inégalités de revenus nets par rapport aux revenus bruts. Cet effet redistributif est voulu politiquement pour assurer une certaine cohésion sociale.

L'effet sur les incitations au travail est plus débattu. Des taux marginaux élevés peuvent décourager l'effort supplémentaire, créer des trappes à inactivité ou inciter à la délocalisation. C'est pourquoi certains cantons plafonnent leurs barèmes.

La progression à froid constitue un problème technique : l'inflation pousse les contribuables vers des tranches supérieures sans amélioration de pouvoir d'achat réel. Certains cantons indexent leurs barèmes pour corriger cet effet.

Les effets de seuil peuvent créer des situations où une augmentation de revenu brut conduit à une diminution de revenu net. Les systèmes modernes tentent de lisser ces effets par des mécanismes d'atténuation.`,
        keyPoints: [
          'Effet redistributif voulu politiquement',
          'Impact sur incitations au travail débattu',
          'Progression à froid due à l\'inflation',
          'Effets de seuil problématiques',
          'Mécanismes correcteurs nécessaires'
        ],
        example: 'Un bonus de 5\'000 CHF peut ne rapporter que 2\'500 CHF nets si le taux marginal est de 50%, questionnant la motivation à l\'effort supplémentaire.'
      },
      {
        id: 'optimisation-baremes',
        title: 'Optimisation face aux barèmes',
        content: `La connaissance des barèmes permet diverses stratégies d'optimisation légale. L'étalement des revenus sur plusieurs années évite les effets de la progressivité sur les revenus exceptionnels comme les bonus ou plus-values.

Le splitting familial permet de répartir certains revenus entre conjoints pour bénéficier deux fois des tranches inférieures. Cette technique est particulièrement efficace quand un conjoint a des revenus nuls ou faibles.

Le timing des déductions peut être optimisé : concentrer les déductions les années à hauts revenus (taux marginal élevé) et étaler les revenus les années à déductions importantes maximise l'avantage fiscal.

Le choix du canton de domicile reste l'optimisation la plus efficace pour les contribuables mobiles. Les différences de barèmes peuvent représenter des économies substantielles, particulièrement pour les hauts revenus où la progressivité joue pleinement.`,
        keyPoints: [
          'Étalement revenus évite forte progressivité',
          'Splitting conjugal optimise tranches inférieures',
          'Timing déductions selon taux marginal',
          'Choix domicile fiscal crucial',
          'Optimisation légale permise et encadrée'
        ],
        warning: 'Les stratégies d\'optimisation doivent avoir une substance économique réelle et ne pas constituer un abus de droit fiscal.'
      }
    ],
    keywords: ['barèmes', 'progressivité', 'taux marginal', 'taux effectif', 'optimisation'],
    relatedConcepts: [
      { slug: 'principes-imposition', title: 'Principes d\'imposition' },
      { slug: 'comparatif-fiscal-cantonal', title: 'Comparatif cantonal' },
      { slug: 'optimisation-fiscale-legale', title: 'Optimisation fiscale' }
    ],
    legalReferences: [
      { title: 'LIFD - Barème fédéral', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_214' },
      { title: 'Statistiques fiscales AFC', url: 'https://www.estv.admin.ch/' }
    ],
    previousArticle: { slug: 'domicile-fiscal', title: 'Domicile fiscal' },
    lastUpdated: new Date('2024-01-15')
  },

  // ========== FISCALITÉ DES PERSONNES PHYSIQUES ==========
  {
    slug: 'revenus-imposables-salaries',
    title: 'Les revenus imposables des salariés',
    description: 'Comprendre tous les éléments du salaire soumis à l\'impôt : salaire de base, avantages, bonus et éléments accessoires',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Revenus salariés',
    content: '',
    sections: [
      {
        id: 'salaire-base',
        title: 'Salaire de base et éléments fixes',
        content: `Le salaire de base constitue l'élément principal du revenu imposable. Il comprend le salaire mensuel, les gratifications convenues contractuellement (13e salaire, bonus garantis) et tous les versements réguliers effectués par l'employeur.

Les éléments fixes incluent également les allocations pour enfants versées par l'employeur (distinctes des allocations familiales de l'AVS), les indemnités de résidence, les primes de fonction et toute rémunération liée au statut du salarié.

La périodicité du versement n'influence pas l'imposition : qu'il soit versé mensuellement, trimestriellement ou annuellement, tout élément de rémunération contractuel est imposable dans l'année de perception selon le principe de l'encaissement.`,
        keyPoints: [
          'Salaire mensuel intégralement imposable',
          '13e salaire et bonus contractuels inclus',
          'Allocations employeur distinctes AVS',
          'Imposition selon principe d\'encaissement',
          'Périodicité sans influence sur l\'imposabilité'
        ]
      },
      {
        id: 'avantages-nature',
        title: 'Avantages en nature',
        content: `Les avantages en nature constituent un complément de salaire imposable évalué à leur valeur vénale. Le principe est simple : tout ce qui profite au salarié et qui, normalement, représenterait une dépense personnelle, constitue un avantage imposable.

La voiture de service utilisée privativement est l'avantage le plus fréquent. L'évaluation se fait soit selon les frais effectifs (carburant, assurance, amortissement) soit forfaitairement à 0.8% de la valeur d'achat neuve par mois. Le choix de la méthode appartient à l'employeur mais doit être appliqué de manière cohérente.

Le logement gratuit ou à prix réduit est évalué à sa valeur locative selon les prix du marché local. Une réduction de 20% peut être appliquée si l'occupation du logement présente un intérêt pour l'employeur (concierge, gardien).

Les repas gratuits ou subventionnés sont imposables au-delà de la contribution du salarié. L'administration fiscale accepte généralement une valeur forfaitaire de 15 CHF par repas principal.`,
        keyPoints: [
          'Évaluation à la valeur vénale',
          'Voiture : 0.8% valeur neuve/mois ou frais réels',
          'Logement : valeur locative moins 20% si justifié',
          'Repas : 15 CHF/repas principal',
          'Application cohérente des méthodes d\'évaluation'
        ],
        example: 'Une voiture d\'entreprise achetée 50\'000 CHF représente un avantage de 400 CHF/mois (50\'000 x 0.8%), soit 4\'800 CHF imposables par an si utilisée privativement.'
      },
      {
        id: 'bonus-variables',
        title: 'Bonus et éléments variables',
        content: `Les bonus et gratifications variables sont imposables même s'ils ne sont pas contractuellement garantis. Peu importe qu'ils dépendent des résultats de l'entreprise ou de la performance individuelle, ils constituent un revenu de l'activité salariée.

Les stock-options et plans d'actionnariat salarié sont imposables au moment de l'attribution si elles peuvent être exercées immédiatement, ou au moment de l'exercice si elles sont soumises à des conditions (vesting). La valeur imposable correspond à la différence entre la valeur de marché et le prix d'exercice.

Les commissions et primes de vente s'imposent selon le principe de l'encaissement. Les provisions pour commissions futures ne sont pas déductibles du côté du salarié, contrairement aux entreprises.

Les indemnités de départ et golden parachutes sont imposables, mais peuvent bénéficier d'une imposition privilégiée si elles indemnisent une perte réelle de revenus futurs.`,
        keyPoints: [
          'Bonus imposables même non garantis',
          'Stock-options : à l\'attribution ou exercice',
          'Commissions selon principe d\'encaissement',
          'Indemnités de départ imposables',
          'Imposition privilégiée possible selon circonstances'
        ]
      }
    ],
    keywords: ['salaire', 'revenus', 'avantages nature', 'bonus', 'stock-options'],
    relatedConcepts: [
      { slug: 'certificat-salaire', title: 'Certificat de salaire' },
      { slug: 'deductions-professionnelles', title: 'Déductions professionnelles' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 17 (Revenus d\'activité)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_17' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'deductions-fiscales-principales',
    title: 'Les principales déductions fiscales',
    description: 'Guide complet des déductions autorisées : sociales, professionnelles, familiales et 3e pilier',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Déductions',
    content: '',
    sections: [
      {
        id: 'deductions-sociales',
        title: 'Déductions sociales obligatoires',
        content: `Les cotisations aux assurances sociales obligatoires sont intégralement déductibles car elles réduisent la capacité contributive sans être librement choisies. Cette déduction suit le principe que seul le revenu net disponible doit être imposé.

Les cotisations AVS/AI/APG représentent 5.3% du salaire (partagées avec l'employeur) jusqu'à un maximum de 148'200 CHF en 2024. Au-delà, aucune cotisation n'est due, donc aucune déduction n'est possible.

L'assurance-chômage prélève 1.1% sur la partie du salaire jusqu'à 148'200 CHF, puis 0.5% entre 148'200 et 315'000 CHF. La part salarié est entièrement déductible.

Les cotisations LPP (2e pilier) sont déductibles selon les montants effectivement versés, dans la limite des maximums légaux. Le montant varie selon l'âge et le salaire, avec des taux de 7%, 10%, 15% ou 18%.`,
        keyPoints: [
          'AVS/AI/APG : 5.3% jusqu\'à 148\'200 CHF',
          'Chômage : 1.1% puis 0.5% selon tranches',
          'LPP selon âge et salaire coordonné',
          'Déduction intégrale des montants versés',
          'Aucune déduction au-delà des maximums'
        ]
      },
      {
        id: 'frais-professionnels',
        title: 'Frais professionnels déductibles',
        content: `Les frais professionnels réduisent le revenu imposable car ils sont nécessaires à l'obtention du revenu. Ils doivent être effectifs, justifiés et proportionnés. La plupart des cantons appliquent une déduction forfaitaire, mais les frais effectifs peuvent être déclarés s'ils sont supérieurs.

Les frais de transport entre domicile et lieu de travail sont déductibles selon les coûts des transports publics ou, si l'usage de la voiture est nécessaire, selon un barème kilométrique (environ 0.70 CHF/km en 2024). Les frais de parking au lieu de travail sont inclus.

Les repas pris hors du domicile en raison de l'activité professionnelle sont déductibles à hauteur de 15 CHF par repas principal. Cette déduction nécessite que le retour au domicile soit impossible ou déraisonnable.

La formation continue liée à l'activité professionnelle est déductible sans limite, à condition qu'elle maintienne ou améliore les qualifications nécessaires à l'exercice de l'activité actuelle. La formation pour une nouvelle orientation professionnelle n'est généralement pas déductible.`,
        keyPoints: [
          'Forfait cantonal ou frais effectifs si supérieurs',
          'Transport : transports publics ou 0.70 CHF/km',
          'Repas : 15 CHF si retour domicile impossible',
          'Formation continue sans limite si liée au poste',
          'Justification et proportionnalité requises'
        ],
        example: 'Un salarié habitant à 25 km de son bureau peut déduire 25 x 2 x 0.70 x 220 jours = 7\'700 CHF de frais de transport annuels.'
      },
      {
        id: 'troisieme-pilier',
        title: '3e pilier : optimisation fiscale',
        content: `Le 3e pilier A constitue l'une des déductions fiscales les plus avantageuses. Les versements sont intégralement déductibles du revenu imposable, et le capital fructifie à l'abri de l'impôt jusqu'au retrait.

Pour 2024, le maximum déductible est de 7'056 CHF pour les salariés affiliés à une caisse de pension. Les indépendants sans 2e pilier peuvent déduire jusqu'à 35'280 CHF (20% du revenu net).

Le timing du versement est crucial : il doit intervenir avant le 31 décembre pour être déductible dans l'année fiscale. Un versement le 2 janvier n'est déductible que l'année suivante.

Le retrait anticipé est possible pour l'achat d'un logement en propriété, le remboursement d'hypothèques, le départ définitif de Suisse ou le passage à l'indépendance. Dans ces cas, l'avoir est imposé séparément à un taux privilégié.`,
        keyPoints: [
          '7\'056 CHF maximum pour salariés en 2024',
          '35\'280 CHF pour indépendants sans LPP',
          'Versement avant 31 décembre obligatoire',
          'Retrait anticipé possible selon conditions',
          'Imposition privilégiée au retrait'
        ],
        warning: 'Un retrait pour l\'achat immobilier crée une dette fiscale latente : le montant retiré devra être re-imposé si la propriété est vendue dans les 3 ans.'
      }
    ],
    keywords: ['déductions', '3e pilier', 'frais professionnels', 'cotisations sociales'],
    relatedConcepts: [
      { slug: 'revenus-imposables-salaries', title: 'Revenus imposables' },
      { slug: 'calcul-impot-revenu', title: 'Calcul de l\'impôt' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 33 (Déductions)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_33' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== AUTRES ARTICLES FISCALITÉ PERSONNES PHYSIQUES ==========
  {
    slug: 'impot-fortune-personnes-physiques',
    title: 'L\'impôt sur la fortune des personnes physiques',
    description: 'Comprendre l\'imposition de la fortune : calcul, évaluation des biens et stratégies d\'optimisation',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Impôt sur la fortune',
    content: '',
    sections: [
      {
        id: 'principe-impot-fortune',
        title: 'Principe de l\'impôt sur la fortune',
        content: `L'impôt sur la fortune constitue une spécificité suisse de plus en plus rare dans le monde. Seuls les cantons et communes le prélèvent (pas la Confédération), sur la fortune nette au 31 décembre. Cette fortune nette correspond aux actifs moins les dettes justifiées.

L'impôt frappe la substance même du patrimoine, indépendamment des revenus qu'elle génère. Cette approche vise à faire contribuer les détenteurs de patrimoine aux charges publiques, même si leurs actifs ne produisent pas de revenus courants.

Les taux varient fortement entre cantons, généralement entre 0.1% et 1% de la fortune nette. Ces taux peuvent paraître faibles, mais ils s'appliquent sur la valeur totale du patrimoine et s'ajoutent à l'impôt sur les revenus éventuels de ce patrimoine.

L'évaluation de la fortune se fait selon des règles précises : valeur vénale pour l'immobilier, cours de bourse pour les titres cotés, valeur intrinsèque pour les participations non cotées. Cette évaluation peut parfois créer des difficultés pratiques.`,
        keyPoints: [
          'Impôt cantonal et communal uniquement',
          'Fortune nette au 31 décembre',
          'Taux entre 0.1% et 1% selon cantons',
          'Indépendant des revenus générés',
          'Évaluation selon règles précises'
        ]
      },
      {
        id: 'evaluation-patrimoine',
        title: 'Évaluation des différents actifs',
        content: `L'immobilier est évalué à sa valeur vénale, généralement basée sur la valeur d'assurance incendie majorée d'un coefficient. Cette évaluation peut être contestée si elle s'écarte significativement de la valeur de marché réelle.

Les titres cotés sont évalués au cours du 31 décembre ou au cours moyen des derniers 30 jours de négociation. Pour les participations importantes, des décotes peuvent s'appliquer pour tenir compte de l'illiquidité.

Les liquidités (comptes bancaires, CCP) sont prises à leur valeur nominale. Les créances sont évaluées à leur valeur probable de recouvrement. Les biens mobiliers (meubles, véhicules) sont généralement évalués forfaitairement.

Les dettes déductibles incluent les hypothèques, crédits bancaires et autres dettes justifiées. Attention : seules les dettes ayant une contrepartie économique réelle sont déductibles. Les dettes fictives ou excessives sont rejetées.`,
        keyPoints: [
          'Immobilier : valeur vénale (assurance + coefficient)',
          'Titres : cours 31 décembre ou moyenne 30 jours',
          'Liquidités à valeur nominale',
          'Dettes justifiées déductibles',
          'Contrôle réalité économique des dettes'
        ],
        warning: 'Une dette contractée sans justification économique (par exemple pour acquérir des actifs exonérés) peut être requalifiée et refusée en déduction.'
      },
      {
        id: 'optimisation-fortune',
        title: 'Stratégies d\'optimisation',
        content: `Le choix du canton de domicile représente l'optimisation principale. Certains cantons n'imposent pas la fortune jusqu'à un certain seuil (Nidwald : 200'000 CHF), d'autres ont des taux très modérés.

La structuration du patrimoine peut réduire l'impôt : privilégier les actifs générant des revenus imposables plutôt que de la plus-value exonérée, répartir la fortune entre conjoints, utiliser des structures de détention appropriées.

Le timing des opérations patrimoniales influence l'imposition : ventes et achats immobiliers, constitution ou dissolution de sociétés, donations entre époux. Une planification minutieuse peut éviter des pics d'imposition.

L'endettement stratégique permet de réduire la fortune nette imposable. Cependant, les intérêts payés doivent avoir une justification économique et l'endettement ne doit pas être purement artificiel.`,
        keyPoints: [
          'Choix canton : seuils et taux variables',
          'Structuration patrimoine optimale',
          'Timing opérations patrimoniales',
          'Endettement stratégique encadré',
          'Éviter pics d\'imposition temporaires'
        ],
        example: 'Un déménagement de Genève (taux 0.55%) vers Zoug (taux 0.14%) sur une fortune de 2 millions CHF économise environ 8\'200 CHF d\'impôt annuel.'
      }
    ],
    keywords: ['impôt fortune', 'patrimoine', 'évaluation', 'optimisation', 'cantons'],
    relatedConcepts: [
      { slug: 'valeur-locative-residence', title: 'Valeur locative' },
      { slug: 'comparatif-fiscal-cantonal', title: 'Comparatif cantonal' }
    ],
    legalReferences: [
      { title: 'LHID Art. 13 (Impôt sur la fortune)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1256_1256_1256/fr#art_13' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'rentes-avs-lpp-imposition',
    title: 'Imposition des rentes AVS, AI et LPP',
    description: 'Comprendre l\'imposition des rentes du 1er et 2e pilier : règles, déductions et optimisation',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Rentes',
    content: '',
    sections: [
      {
        id: 'principe-imposition-rentes',
        title: 'Principe d\'imposition des rentes',
        content: `Les rentes du 1er pilier (AVS/AI) et du 2e pilier (LPP) sont intégralement imposables comme revenu au moment de leur perception. Cette imposition suit le principe de l'imposition différée : les cotisations étaient déductibles pendant la vie active, les prestations sont imposables à la retraite.

Les rentes AVS/AI bénéficient d'un régime légèrement privilégié avec des déductions spécifiques dans la plupart des cantons. Ces déductions visent à tenir compte de la situation particulière des rentiers et de leurs revenus généralement plus modestes.

Les rentes LPP sont imposées intégralement, sans déduction particulière au niveau fédéral, mais certains cantons accordent des allègements. Le montant imposable correspond à la rente annuelle effectivement perçue.

Les prestations en capital du 2e pilier (liquidation de la LPP en une fois) bénéficient d'une imposition privilégiée séparée, distincte des autres revenus. Cette imposition séparée évite l'effet de la progressivité sur ces montants importants.`,
        keyPoints: [
          'Rentes AVS/AI/LPP intégralement imposables',
          'Principe d\'imposition différée',
          'Déductions spécifiques pour AVS/AI',
          'Capitaux LPP imposés séparément',
          'Éviter effets progressivité sur capitaux'
        ]
      },
      {
        id: 'deductions-rentiers',
        title: 'Déductions spécifiques aux rentiers',
        content: `Les rentiers AVS/AI bénéficient de déductions particulières dans la plupart des cantons. Ces déductions peuvent être forfaitaires (montant fixe) ou proportionnelles (pourcentage de la rente). Elles visent à alléger la charge fiscale de cette catégorie de contribuables.

Les frais médicaux et de maladie sont souvent plus facilement déductibles pour les rentiers, avec des seuils d'admission plus favorables. L'âge et la situation de santé justifient cette approche différenciée.

Les primes d'assurance-maladie obligatoire restent déductibles après la retraite, constituant souvent une déduction importante pour les rentiers. Certains cantons accordent des déductions supplémentaires pour les primes complémentaires.

Le 3e pilier A reste déductible jusqu'à l'âge de la retraite ordinaire AVS (64 ans pour les femmes, 65 pour les hommes), permettant une optimisation fiscale continue. Au-delà, seuls les versements de rattrapage dans le 3e pilier B restent possibles dans certaines conditions.`,
        keyPoints: [
          'Déductions forfaitaires ou proportionnelles',
          'Frais médicaux facilités',
          'Primes maladie déductibles',
          '3e pilier A jusqu\'à retraite AVS',
          'Seuils plus favorables selon âge'
        ]
      },
      {
        id: 'optimisation-retraite',
        title: 'Optimisation fiscale à la retraite',
        content: `La planification de la retraite doit intégrer l'aspect fiscal des prestations. Le choix entre rente et capital pour la LPP a des implications fiscales importantes : la rente est imposée annuellement, le capital une seule fois mais à un taux privilégié.

L'étalement des retraits du 3e pilier sur plusieurs années permet d'optimiser la progressivité. Plutôt qu'un retrait unique, des retraits échelonnés réduisent l'impact fiscal global, particulièrement si d'autres revenus diminuent à la retraite.

La répartition des revenus entre conjoints reste possible à la retraite pour optimiser la progressivité. Les rentes peuvent parfois être attribuées différemment, et les revenus de capitaux répartis par donations entre époux.

Le choix du canton de domicile à la retraite mérite réflexion : les besoins changent (moins d'écoles, plus de soins), et un canton avec une fiscalité favorable aux rentiers peut devenir attractif.`,
        keyPoints: [
          'Choix rente vs capital LPP crucial',
          'Étalement retraits 3e pilier',
          'Répartition revenus entre conjoints',
          'Choix canton spécifique retraités',
          'Planification globale nécessaire'
        ],
        example: 'Un capital LPP de 500\'000 CHF peut être imposé une fois à 5% (25\'000 CHF) plutôt qu\'une rente de 20\'000 CHF/an imposée 25 ans à 15% (75\'000 CHF total).'
      }
    ],
    keywords: ['rentes', 'AVS', 'LPP', 'retraite', 'imposition différée'],
    relatedConcepts: [
      { slug: 'deductions-fiscales-principales', title: 'Déductions fiscales' },
      { slug: 'troisieme-pilier-optimisation', title: '3e pilier' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 22 (Prestations prévoyance)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_22' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'revenus-immobiliers-personnes-physiques',
    title: 'Les revenus immobiliers des personnes physiques',
    description: 'Imposition des revenus locatifs, valeur locative et déductions immobilières',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Revenus immobiliers',
    content: '',
    sections: [
      {
        id: 'revenus-locatifs',
        title: 'Imposition des revenus locatifs',
        content: `Les revenus locatifs sont intégralement imposables comme revenus immobiliers. Le montant imposable correspond aux loyers effectivement perçus, y compris les charges répercutées aux locataires et les accessoires (places de parc, caves).

Les loyers non perçus (créances irrécouvrables) peuvent être déduits s'ils sont définitivement perdus et si les démarches de recouvrement ont été entreprises. Une simple difficulté temporaire ne justifie pas la déduction.

Les sous-locations et Airbnb constituent aussi des revenus imposables. Pour les locations de courte durée, il faut tenir compte des frais proportionnellement plus élevés (nettoyage, gestion, usure accélérée).

La location à des proches (famille, sociétés liées) doit se faire à des conditions de marché. Un loyer inférieur au prix du marché peut être requalifié, avec imposition de la valeur locative de la différence.`,
        keyPoints: [
          'Loyers intégralement imposables',
          'Créances irrécouvrables déductibles',
          'Sous-locations et Airbnb inclus',
          'Locations proches à prix marché',
          'Charges répercutées imposables'
        ]
      },
      {
        id: 'charges-deductibles',
        title: 'Charges déductibles',
        content: `Les frais d'entretien et de réparation sont déductibles s'ils maintiennent la substance de l'immeuble sans l'améliorer. Cette distinction entre entretien (déductible) et amélioration (non déductible) est cruciale mais parfois délicate.

Les intérêts hypothécaires sont intégralement déductibles du revenu immobilier ou, si insuffisant, du revenu global. Cette déduction importante peut même créer un déficit immobilier imputable sur les autres revenus.

Les primes d'assurance (incendie, responsabilité civile, perte de loyers) sont déductibles. Les frais de gérance et d'administration, honoraires de fiduciaire ou régie, entrent aussi dans les charges déductibles.

Les amortissements ne sont généralement pas déductibles pour les personnes physiques (contrairement aux entreprises). Seuls l'entretien et les réparations, pas la dépréciation théorique, peuvent être déduits.`,
        keyPoints: [
          'Entretien déductible, amélioration non',
          'Intérêts hypothécaires intégralement déductibles',
          'Assurances et gérance déductibles',
          'Pas d\'amortissement pour personnes physiques',
          'Déficit immobilier imputable autres revenus'
        ],
        warning: 'La distinction entretien/amélioration est stricte : changer les fenêtres pour des modèles équivalents = entretien déductible ; installer des fenêtres triple vitrage = amélioration non déductible.'
      },
      {
        id: 'optimisation-immobiliere',
        title: 'Optimisation fiscale immobilière',
        content: `Le timing des travaux influence l'optimisation : grouper les gros entretiens les années à hauts revenus (taux marginal élevé) maximise l'avantage fiscal. À l'inverse, étaler les travaux peut éviter de créer des déficits importants inutilisables.

L'endettement hypothécaire peut être optimisé fiscalement : maintenir des dettes déductibles plutôt que d'amortir rapidement, surtout si les liquidités peuvent être placées avantageusement ailleurs.

La répartition immobilière entre conjoints permet d'optimiser la charge fiscale globale. Le conjoint avec les revenus les plus élevés peut supporter les charges déductibles, tandis que l'autre perçoit les revenus locatifs.

Le moment de la vente influence aussi la fiscalité : l'impôt sur les gains immobiliers varie selon la durée de détention. Certains cantons appliquent des taux dégressifs encourageant la détention à long terme.`,
        keyPoints: [
          'Timing travaux selon revenus autres',
          'Maintenir endettement déductible optimal',
          'Répartition entre conjoints stratégique',
          'Moment vente influence gains imposables',
          'Planification long terme nécessaire'
        ],
        example: 'Un couple peut attribuer un immeuble locatif au conjoint à hauts revenus pour maximiser la déduction des intérêts hypothécaires, tout en déclarant les loyers chez le conjoint moins imposé.'
      }
    ],
    keywords: ['revenus locatifs', 'immobilier', 'déductions', 'charges', 'optimisation'],
    relatedConcepts: [
      { slug: 'valeur-locative-residence', title: 'Valeur locative' },
      { slug: 'gains-immobiliers', title: 'Gains immobiliers' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 21 (Revenus immobiliers)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_21' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== FISCALITÉ DES ENTREPRISES ==========
  {
    slug: 'statut-independant-criteres',
    title: 'Critères de détermination du statut d\'indépendant',
    description: 'Comment distinguer l\'activité indépendante du salariat : critères légaux, fiscaux et pratiques',
    category: 'Indépendants et entreprises',
    subcategory: 'Statut fiscal',
    content: '',
    sections: [
      {
        id: 'criteres-legaux',
        title: 'Critères légaux fondamentaux',
        content: `La distinction entre activité indépendante et salariat repose sur plusieurs critères cumulatifs établis par la jurisprudence. Le critère principal est l'autonomie dans l'organisation du travail : l'indépendant détermine librement ses horaires, ses méthodes et son lieu de travail.

La subordination constitue l'élément caractéristique du salariat. Elle se manifeste par l'obligation de suivre des instructions, de respecter des horaires imposés, d'utiliser des outils fournis par l'employeur et de s'intégrer dans une organisation hiérarchique.

Le risque économique distingue également les deux statuts. L'indépendant supporte le risque de perte, peut réaliser des bénéfices variables et engage ses propres capitaux. Le salarié perçoit une rémunération fixe indépendamment des résultats.

L'autonomie commerciale se manifeste par la possibilité de travailler pour plusieurs clients, de fixer ses prix, de facturer ses prestations et de développer sa propre clientèle.`,
        keyPoints: [
          'Autonomie dans l\'organisation du travail',
          'Absence de subordination hiérarchique',
          'Support du risque économique',
          'Autonomie commerciale et tarifaire',
          'Possibilité de clientèle multiple'
        ]
      },
      {
        id: 'implications-fiscales',
        title: 'Implications fiscales du statut',
        content: `Le statut d'indépendant entraîne une imposition différente du salariat. Les revenus indépendants sont imposés après déduction des charges d'exploitation, permettant une optimisation fiscale plus large que pour les salariés.

Les cotisations sociales diffèrent substantiellement : l'indépendant paie l'intégralité des cotisations AVS/AI (10.6% au lieu de 5.3% pour le salarié) mais n'est pas soumis à l'assurance-chômage obligatoire.

La TVA devient obligatoire dès 100'000 CHF de chiffre d'affaires annuel, avec possibilité d'option volontaire en dessous. Cette obligation crée des contraintes administratives mais permet la récupération de la TVA sur les achats professionnels.

La prévoyance professionnelle (LPP) n'est pas obligatoire pour les indépendants, qui peuvent cependant s'affilier volontairement ou développer une prévoyance via le pilier 3A avec des plafonds majorés.`,
        keyPoints: [
          'Déduction des charges d\'exploitation',
          'Cotisations AVS doublées (10.6%)',
          'TVA obligatoire dès 100\'000 CHF',
          'Pas d\'assurance-chômage obligatoire',
          'Prévoyance LPP facultative'
        ],
        warning: 'Le changement de statut en cours d\'année nécessite une déclaration immédiate aux caisses de compensation pour éviter les régularisations rétroactives.'
      }
    ],
    keywords: ['indépendant', 'statut fiscal', 'autonomie', 'subordination', 'cotisations'],
    relatedConcepts: [
      { slug: 'tva-entreprises', title: 'TVA pour entreprises' },
      { slug: 'charges-deductibles', title: 'Charges déductibles' }
    ],
    legalReferences: [
      { title: 'Circulaire AVS sur l\'indépendance', url: 'https://www.bsv.admin.ch/' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== AUTRES ARTICLES INDÉPENDANTS ET ENTREPRISES ==========
  {
    slug: 'formes-juridiques-entreprises',
    title: 'Choix de la forme juridique et implications fiscales',
    description: 'Comparaison fiscale des différentes formes juridiques : entreprise individuelle, société de personnes, société de capitaux',
    category: 'Indépendants et entreprises',
    subcategory: 'Formes juridiques',
    content: '',
    sections: [
      {
        id: 'entreprise-individuelle',
        title: 'Entreprise individuelle',
        content: `L'entreprise individuelle constitue la forme la plus simple et la plus courante pour débuter une activité indépendante. Sur le plan fiscal, elle se caractérise par une transparence totale : les bénéfices sont directement imposés chez la personne physique selon les barèmes progressifs habituels.

Cette forme ne créé pas de personnalité juridique distincte, ce qui simplifie la comptabilité et les obligations administratives. Les revenus et charges professionnels s'ajoutent directement aux autres éléments de la déclaration d'impôt personnelle.

L'avantage principal réside dans la simplicité : pas de double imposition, déduction intégrale des pertes contre les autres revenus, régime de la TVA simplifié possible. Les charges sociales (AVS/AI) s'élèvent à 10.6% sur le bénéfice net.

L'inconvénient majeur concerne la responsabilité illimitée et l'exposition fiscale : les bénéfices importants subissent la progressivité maximale des barèmes cantonaux, sans possibilité d'optimisation par la forme sociétaire.`,
        keyPoints: [
          'Transparence fiscale totale',
          'Imposition selon barèmes personnes physiques',
          'Simplicité administrative',
          'Responsabilité illimitée',
          'Cotisations AVS/AI 10.6%'
        ]
      },
      {
        id: 'societe-personnes',
        title: 'Sociétés de personnes (SNC, société simple)',
        content: `Les sociétés de personnes (société en nom collectif, société simple) conservent la transparence fiscale : les bénéfices sont répartis entre les associés selon leurs quotes-parts et imposés directement chez eux comme revenus d'activité indépendante.

Cette forme permet de s'associer tout en maintenant la simplicité fiscale de l'entreprise individuelle. Chaque associé déclare sa part de bénéfice dans sa déclaration personnelle et paie ses cotisations sociales individuellement.

L'avantage réside dans la possibilité de répartir les revenus entre plusieurs personnes, exploitant potentiellement leurs tranches d'imposition inférieures. Les pertes peuvent être imputées sur les autres revenus de chaque associé.

Les inconvénients incluent la responsabilité solidaire et illimitée de tous les associés, ainsi que l'impossibilité d'optimiser l'imposition des bénéfices importants. La dissolution peut créer des complications administratives.`,
        keyPoints: [
          'Transparence fiscale maintenue',
          'Répartition bénéfices selon quotes-parts',
          'Responsabilité solidaire illimitée',
          'Imputation pertes possible',
          'Complications dissolution'
        ]
      },
      {
        id: 'societe-capitaux',
        title: 'Sociétés de capitaux (SA, Sàrl)',
        content: `Les sociétés de capitaux (SA, Sàrl) créent une personnalité juridique distincte avec ses propres obligations fiscales. La société paie l'impôt sur le bénéfice et le capital, puis les distributions aux actionnaires/associés sont imposées chez ces derniers (double imposition économique).

Le taux global d'imposition sur le bénéfice varie entre 12% et 21% selon les cantons (8.5% fédéral + cantonal/communal). Cette imposition proportionnelle peut être avantageuse par rapport aux barèmes progressifs des personnes physiques.

Pour éviter la double imposition, le système de la participation qualifiée (détention > 10%) prévoit une imposition réduite des dividendes chez les actionnaires. L'impôt anticipé de 35% est prélevé à la source mais récupérable.

Cette forme convient aux entreprises avec des bénéfices substantiels où l'optimisation fiscale justifie la complexité administrative supplémentaire. La responsabilité limitée constitue aussi un avantage important.`,
        keyPoints: [
          'Personnalité juridique distincte',
          'Double imposition économique',
          'Taux proportionnel 12-21%',
          'Participation qualifiée atténue double imposition',
          'Responsabilité limitée'
        ],
        example: 'Une Sàrl réalisant 200\'000 CHF de bénéfice paie environ 30\'000 CHF d\'impôt sociétal, puis l\'actionnaire paie l\'impôt réduit sur les dividendes distribués.'
      },
      {
        id: 'choix-optimal',
        title: 'Critères de choix optimal',
        content: `Le choix de la forme juridique dépend principalement du niveau de bénéfices prévisibles, de la situation fiscale personnelle, des besoins de financement et des objectifs de développement. Une analyse comparative s'impose.

Pour des bénéfices inférieurs à 100'000 CHF, l'entreprise individuelle reste généralement optimale : simplicité administrative, déduction intégrale des pertes, évitement de la double imposition. Les barèmes progressifs restent modérés à ces niveaux.

Au-delà de 150'000-200'000 CHF de bénéfices, la société de capitaux devient intéressante : les taux proportionnels deviennent inférieurs aux barèmes progressifs marginaux élevés. L'optimisation par non-distribution des bénéfices devient possible.

D'autres facteurs influencent le choix : nécessité de lever des capitaux (SA favorisée), protection patrimoniale (responsabilité limitée), transmission d'entreprise (société plus flexible), complexité administrative acceptable (formation, comptabilité).`,
        keyPoints: [
          'Analyse selon niveau bénéfices',
          'Entreprise individuelle < 100\'000 CHF',
          'Société capitaux > 150\'000-200\'000 CHF',
          'Autres facteurs : financement, protection, transmission',
          'Équilibre optimisation/complexité'
        ],
        warning: 'Le changement de forme juridique en cours d\'exploitation peut avoir des conséquences fiscales importantes (réalisation gains latents, droits d\'enregistrement).'
      }
    ],
    keywords: ['formes juridiques', 'entreprise individuelle', 'société', 'optimisation', 'bénéfices'],
    relatedConcepts: [
      { slug: 'statut-independant-criteres', title: 'Statut indépendant' },
      { slug: 'tva-entreprises', title: 'TVA entreprises' }
    ],
    legalReferences: [
      { title: 'Code des obligations - Formes juridiques', url: 'https://www.fedlex.admin.ch/eli/cc/27/317_321_377/fr' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'tva-assujettissement-entreprises',
    title: 'TVA : assujettissement et obligations des entreprises',
    description: 'Guide complet de la TVA pour entreprises : seuils, méthodes de calcul, décomptes et optimisation',
    category: 'Indépendants et entreprises',
    subcategory: 'TVA',
    content: '',
    sections: [
      {
        id: 'seuils-assujettissement',
        title: 'Seuils et conditions d\'assujettissement',
        content: `L'assujettissement à la TVA devient obligatoire dès que le chiffre d'affaires annuel atteint 100'000 CHF. Ce seuil s'applique aux livraisons et prestations imposables réalisées en Suisse, en excluant les opérations exonérées.

En dessous de ce seuil, l'assujettissement volontaire est possible et souvent avantageux. Il permet de récupérer la TVA payée sur les achats professionnels (impôt préalable) et donne une image plus professionnelle face aux clients assujettis.

Le dépassement du seuil doit être annoncé dans les 30 jours. L'assujettissement débute au début du trimestre où le seuil a été dépassé. Une surveillance attentive du chiffre d'affaires en fin d'année est cruciale.

Pour les nouvelles entreprises, l'assujettissement peut être demandé avant même le début d'activité si le chiffre d'affaires prévisible dépasse le seuil. Cette approche évite les régularisations ultérieures.`,
        keyPoints: [
          'Seuil obligatoire : 100\'000 CHF annuel',
          'Option volontaire en dessous du seuil',
          'Annonce obligatoire dans 30 jours',
          'Assujettissement rétroactif au trimestre',
          'Demande possible avant début activité'
        ]
      },
      {
        id: 'methodes-calcul',
        title: 'Méthodes de calcul et décomptes',
        content: `La méthode effective (convenue) constitue la règle générale : la TVA est calculée sur chaque facture au taux applicable (8.1%, 2.6% ou 3.8%), et l'impôt préalable est récupéré sur les achats avec justificatifs.

Les méthodes forfaitaires simplifient la gestion pour les PME. Les taux forfaitaires varient selon le secteur d'activité (commerce, prestations, restauration). Cette méthode évite le suivi détaillé mais peut être moins avantageuse.

La méthode de la dette fiscale nette convient aux entreprises avec peu d'achats déductibles. Elle applique un taux réduit directement sur le chiffre d'affaires total, sans récupération d'impôt préalable.

Les décomptes sont généralement trimestriels, mais peuvent être mensuels (gros chiffres d'affaires) ou semestriels (petites entreprises). Le paiement doit intervenir dans les 60 jours suivant la fin de la période.`,
        keyPoints: [
          'Méthode effective = règle générale',
          'Forfaitaires = simplification PME',
          'Dette fiscale nette = peu d\'achats',
          'Décomptes trimestriels standard',
          'Paiement dans 60 jours'
        ],
        example: 'Un restaurant peut choisir le taux forfaitaire de 3.7% sur son chiffre d\'affaires plutôt que de gérer la TVA détaillée sur chaque facture et récupérer l\'impôt préalable.'
      },
      {
        id: 'deduction-impot-prealable',
        title: 'Déduction de l\'impôt préalable',
        content: `L'impôt préalable peut être déduit sur tous les achats, investissements et charges directement liés à l'activité imposable. Cette déduction constitue l'avantage principal de l'assujettissement pour les entreprises avec des investissements importants.

Les conditions de déduction sont strictes : justificatifs originaux obligatoires, lien direct avec l'activité imposable, respect des formes légales (mention TVA sur facture). Les factures de complaisance ou privées sont exclues.

Pour les entreprises avec activités mixtes (imposables et exonérées), une répartition proportionnelle s'impose. Le calcul du taux de récupération se base sur les chiffres d'affaires respectifs des activités.

Certaines dépenses sont spécifiquement exclues : véhicules de tourisme (sauf justification professionnelle), frais de représentation excessifs, amendes et contraventions. La récupération sur l'immobilier nécessite une option spéciale.`,
        keyPoints: [
          'Déduction sur achats liés activité imposable',
          'Justificatifs originaux obligatoires',
          'Répartition si activités mixtes',
          'Exclusions spécifiques (véhicules, représentation)',
          'Option spéciale pour immobilier'
        ],
        warning: 'La récupération d\'impôt préalable sur un achat personnel peut constituer une soustraction frauduleuse passible d\'amende.'
      },
      {
        id: 'optimisation-tva',
        title: 'Optimisation et planification TVA',
        content: `Le timing des facturations peut optimiser la trésorerie : retarder les facturations en fin de période pour reporter l'exigibilité de la TVA au trimestre suivant. Inversement, accélérer les achats permet de récupérer plus rapidement l'impôt préalable.

L'option pour l'imposition des locations immobilières peut être stratégique si les locataires sont eux-mêmes assujettis. Cette option permet de récupérer la TVA sur les investissements immobiliers tout en répercutant la TVA aux locataires.

La méthode de calcul peut être changée avec l'accord de l'administration. Une analyse comparative périodique permet de vérifier si la méthode choisie reste optimale selon l'évolution de l'activité.

En cas de cessation d'activité ou de baisse sous le seuil, une planification de la sortie évite les régularisations importantes sur les stocks et investissements récents.`,
        keyPoints: [
          'Timing facturations optimise trésorerie',
          'Option immobilier si locataires assujettis',
          'Changement méthode possible',
          'Planification sortie TVA importante',
          'Analyse comparative périodique'
        ]
      }
    ],
    keywords: ['TVA', 'assujettissement', 'décomptes', 'impôt préalable', 'entreprises'],
    relatedConcepts: [
      { slug: 'formes-juridiques-entreprises', title: 'Formes juridiques' },
      { slug: 'charges-deductibles-entreprises', title: 'Charges déductibles' }
    ],
    legalReferences: [
      { title: 'LTVA - Assujettissement', url: 'https://www.fedlex.admin.ch/eli/cc/2009/615/fr#art_10' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'imposition-benefice-entreprises',
    title: 'Imposition du bénéfice des entreprises',
    description: 'Calcul et optimisation de l\'impôt sur le bénéfice : détermination, charges déductibles et planification',
    category: 'Indépendants et entreprises',
    subcategory: 'Impôt sur le bénéfice',
    content: '',
    sections: [
      {
        id: 'determination-benefice',
        title: 'Détermination du bénéfice imposable',
        content: `Le bénéfice imposable correspond au bénéfice comptable ajusté selon les règles fiscales. Cette détermination suit le principe de la comptabilité commerciale avec des corrections fiscales spécifiques prévues par la loi.

Pour les entreprises individuelles et sociétés de personnes, le bénéfice est imposé directement chez les associés selon les barèmes progressifs. Pour les sociétés de capitaux, l'imposition se fait au niveau de la société selon des taux proportionnels.

Les corrections fiscales principales incluent : réintégration des amortissements excessifs, ajustement des provisions non justifiées, correction des charges non déductibles fiscalement, ajout des avantages accordés aux dirigeants.

La période de calcul correspond généralement à l'exercice comptable. En cas de changement d'exercice, des règles spéciales s'appliquent pour éviter les doubles impositions ou exonérations.`,
        keyPoints: [
          'Bénéfice comptable + corrections fiscales',
          'Imposition différente selon forme juridique',
          'Corrections : amortissements, provisions, charges',
          'Période = exercice comptable',
          'Règles spéciales changement exercice'
        ]
      },
      {
        id: 'charges-deductibles',
        title: 'Charges déductibles et limitations',
        content: `Les charges déductibles doivent être justifiées commercialement, comptabilisées correctement et avoir un lien direct avec l'obtention des revenus imposables. Cette triple condition est rigoureusement contrôlée par les administrations fiscales.

Les charges de personnel (salaires, cotisations sociales, formation) sont généralement déductibles si elles correspondent à des prestations effectives et sont raisonnables par rapport au marché. Les rémunérations excessives peuvent être refusées.

Les amortissements sont déductibles selon les taux admis fiscalement, souvent plus restrictifs que les possibilités comptables. Les taux varient selon la nature des biens : 20-30% pour machines, 10-15% pour véhicules, 3-5% pour immeubles.

Certaines charges sont spécifiquement non déductibles : amendes et contraventions, impôts sur le bénéfice, charges excessives sans justification commerciale, libéralités pures. Une attention particulière est requise pour ces exclusions.`,
        keyPoints: [
          'Triple condition : justification, comptabilisation, lien',
          'Charges personnel si prestations effectives',
          'Amortissements selon taux fiscaux admis',
          'Exclusions spécifiques importantes',
          'Contrôle strict administrations'
        ],
        warning: 'Une charge déductible comptablement peut être refusée fiscalement si elle manque de justification commerciale, créant une différence temporaire ou définitive.'
      },
      {
        id: 'optimisation-fiscale',
        title: 'Optimisation fiscale du bénéfice',
        content: `Le timing des opérations permet d'optimiser l'imposition : accélération des charges déductibles en fin d'exercice profitable, report des recettes en cas de bénéfice excessif, étalement des investissements selon la capacité d'absorption.

La politique d'amortissement offre des marges de manœuvre : choix entre amortissement linéaire ou dégressif, utilisation des taux maximaux ou modérés selon la situation, constitution de réserves latentes pour les années moins favorables.

Pour les sociétés de capitaux, la politique de distribution influence l'imposition globale : non-distribution évite la double imposition immédiate mais crée de l'impôt latent. L'équilibre dépend de la situation des actionnaires.

La planification pluriannuelle permet d'optimiser la charge fiscale globale : étalement des revenus exceptionnels, anticipation des investissements importants, coordination avec la situation fiscale personnelle des dirigeants.`,
        keyPoints: [
          'Timing opérations selon rentabilité',
          'Politique amortissement flexible',
          'Distribution vs rétention société capitaux',
          'Planification pluriannuelle nécessaire',
          'Coordination situation personnelle dirigeants'
        ],
        example: 'Une entreprise rentable peut accélérer ses investissements en décembre pour bénéficier des amortissements déductibles, réduisant le bénéfice de l\'exercice.'
      }
    ],
    keywords: ['bénéfice', 'charges déductibles', 'amortissements', 'optimisation', 'imposition'],
    relatedConcepts: [
      { slug: 'formes-juridiques-entreprises', title: 'Formes juridiques' },
      { slug: 'tva-assujettissement-entreprises', title: 'TVA entreprises' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 58 (Bénéfice net)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_58' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'remuneration-dirigeant-entreprises',
    title: 'Rémunération des dirigeants d\'entreprise',
    description: 'Optimisation fiscale de la rémunération des dirigeants : salaire, dividendes, avantages en nature',
    category: 'Indépendants et entreprises',
    subcategory: 'Rémunération dirigeant',
    content: '',
    sections: [
      {
        id: 'mix-salaire-dividendes',
        title: 'Mix optimal salaire-dividendes',
        content: `La rémunération du dirigeant d'une société de capitaux peut combiner salaire et dividendes, chacun ayant ses avantages fiscaux spécifiques. L'optimisation dépend de la situation globale : charges sociales, taux marginaux d'imposition, besoins de liquidités.

Le salaire crée des charges sociales (AVS/AI, LPP, assurance-chômage) mais permet de constituer des droits sociaux et de la prévoyance. Il est déductible du bénéfice de la société, réduisant l'impôt sur le bénéfice.

Les dividendes ne génèrent pas de charges sociales mais subissent la double imposition économique : impôt sur le bénéfice au niveau société, puis impôt sur le revenu (réduit) chez l'actionnaire. L'impôt anticipé de 35% est prélevé mais récupérable.

Le point d'équilibre dépend des taux d'imposition : généralement, un salaire de base pour couvrir les besoins courants et les charges sociales minimales, complété par des dividendes pour optimiser la charge fiscale globale.`,
        keyPoints: [
          'Salaire : charges sociales mais déductible société',
          'Dividendes : pas de charges sociales, double imposition',
          'Impôt anticipé 35% récupérable',
          'Optimisation selon taux marginaux',
          'Équilibre besoins courants vs optimisation'
        ],
        example: 'Un dirigeant peut prendre 100\'000 CHF de salaire (charges sociales comprises) plus 50\'000 CHF de dividendes, plutôt que 150\'000 CHF de salaire pur, économisant environ 15\'000 CHF de charges sociales annuelles.'
      },
      {
        id: 'avantages-nature',
        title: 'Avantages en nature et fringe benefits',
        content: `Les avantages en nature accordés aux dirigeants sont imposables mais peuvent être optimisés. La voiture de fonction reste l'avantage le plus courant, évalué à 0.8% de la valeur d'achat neuve par mois.

Les frais de représentation, formations professionnelles, équipements informatiques peuvent être pris en charge par la société sans imposition chez le dirigeant, s'ils sont justifiés par l'activité professionnelle.

Le logement de fonction est possible mais fortement encadré : il doit présenter un intérêt prépondérant pour l'employeur. La valeur locative imposable chez le dirigeant peut être réduite de 20% si les conditions sont remplies.

Les stock-options et plans d'actionnariat offrent des possibilités d'optimisation, particulièrement dans les start-ups. L'imposition intervient généralement au moment de l'exercice des options, pas à l'attribution.`,
        keyPoints: [
          'Voiture : 0.8% valeur neuve par mois',
          'Frais justifiés par activité professionnelle',
          'Logement fonction très encadré',
          'Stock-options imposées à l\'exercice',
          'Justification professionnelle obligatoire'
        ]
      },
      {
        id: 'strategies-optimisation',
        title: 'Stratégies d\'optimisation globales',
        content: `La planification pluriannuelle permet d'optimiser la rémunération selon les fluctuations d'activité. Les années fastes peuvent privilégier les dividendes, les années difficiles maintenir un salaire minimum pour préserver les droits sociaux.

Le pilotage de la distribution permet d'étaler les dividendes selon la situation fiscale personnelle du dirigeant. Les réserves peuvent être constituées en société pour différer l'imposition personnelle.

La coordination avec la prévoyance est cruciale : maintenir un salaire LPP pour optimiser la couverture, utiliser le 3e pilier A au maximum, prévoir les rachats LPP stratégiques.

La transmission d'entreprise influence aussi la stratégie : privilégier la croissance en valeur (gains en capital exonérés) plutôt que les distributions courantes peut être optimal si une cession est envisagée.`,
        keyPoints: [
          'Planification pluriannuelle selon activité',
          'Pilotage distributions via réserves',
          'Coordination avec prévoyance LPP',
          'Stratégie transmission (croissance vs distribution)',
          'Optimisation globale situation personnelle'
        ],
        warning: 'Les rémunérations excessives ou sans contrepartie économique peuvent être requalifiées par l\'administration fiscale en avantages constructifs.'
      }
    ],
    keywords: ['rémunération dirigeant', 'salaire', 'dividendes', 'avantages nature', 'optimisation'],
    relatedConcepts: [
      { slug: 'formes-juridiques-entreprises', title: 'Formes juridiques' },
      { slug: 'imposition-benefice-entreprises', title: 'Imposition du bénéfice' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 17 (Revenus d\'activité)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_17' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== PATRIMOINE ET INVESTISSEMENTS ==========
  {
    slug: 'valeur-locative-residence',
    title: 'La valeur locative de la résidence principale',
    description: 'Comprendre le calcul, la contestation et les déductions liées à la valeur locative',
    category: 'Patrimoine et investissements',
    subcategory: 'Immobilier',
    content: '',
    sections: [
      {
        id: 'principe-valeur-locative',
        title: 'Principe de la valeur locative',
        content: `La valeur locative représente le loyer théorique que le propriétaire devrait payer s'il était locataire de son propre bien. Cette fiction juridique vise à établir l'égalité de traitement entre propriétaires et locataires : les seconds paient un loyer avec leur revenu net d'impôt, les premiers doivent déclarer un revenu fictif équivalent.

Cette approche garantit la neutralité fiscale entre les modes de logement. Sans la valeur locative, les propriétaires auraient un avantage fiscal injustifié, car ils obtiendraient un logement "gratuit" avec un capital déjà imposé.

Le montant de la valeur locative est fixé par l'administration fiscale cantonale selon les prix du marché locatif local. Elle est généralement comprise entre 60% et 80% du loyer de marché effectif pour tenir compte des charges et risques du propriétaire.

La valeur locative s'applique à tous les biens immobiliers utilisés par le propriétaire : résidence principale, résidences secondaires, locaux professionnels. Seuls échappent à cette règle les biens loués à des tiers qui génèrent un revenu locatif effectif.`,
        keyPoints: [
          'Égalité propriétaires/locataires',
          '60-80% du loyer de marché effectif',
          'Fixation par administration cantonale',
          'Application à tous biens auto-occupés',
          'Neutralité fiscale entre modes de logement'
        ]
      },
      {
        id: 'calcul-contestation',
        title: 'Calcul et contestation',
        content: `Le calcul de la valeur locative se base sur des critères objectifs : surface, standing, situation géographique, état du bien et prix du marché locatif environnant. Les administrations disposent généralement de bases de données et de barèmes de référence.

La contestation est possible si la valeur fixée paraît excessive par rapport au marché. Il faut apporter des éléments de comparaison précis : annonces de biens similaires, expertises immobilières ou attestations de régies. La simple affirmation que "c'est trop cher" ne suffit pas.

Les éléments favorables à une réduction incluent : défauts du bien (bruit, pollution), charges importantes non répercutables, contraintes d'utilisation (monuments historiques), marché locatif déprimé dans la région.

La révision peut être demandée en cas de changement substantiel : importantes rénovations, dégradation du bien, évolution du marché locatif. Certains cantons procèdent à des réévaluations systématiques périodiques.`,
        keyPoints: [
          'Critères objectifs de marché',
          'Contestation avec éléments comparatifs',
          'Défauts et contraintes favorables',
          'Révision possible si changements',
          'Réévaluations périodiques cantonales'
        ],
        example: 'Une maison avec valeur locative de 24\'000 CHF près d\'un aéroport peut obtenir une réduction si des biens similaires sans nuisance se louent effectivement 15-20% moins cher.'
      }
    ],
    keywords: ['valeur locative', 'immobilier', 'propriétaire', 'contestation'],
    relatedConcepts: [
      { slug: 'deductions-immobilieres', title: 'Déductions immobilières' },
      { slug: 'gains-immobiliers', title: 'Gains immobiliers' }
    ],
    legalReferences: [
      { title: 'ATF sur la valeur locative', url: 'https://www.bger.ch/' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'fiscalite-cryptomonnaies-suisse',
    title: 'Fiscalité des cryptomonnaies en Suisse',
    description: 'Guide complet de l\'imposition des cryptomonnaies : fortune, gains, mining et trading professionnel',
    category: 'Patrimoine et investissements',
    subcategory: 'Cryptomonnaies',
    content: '',
    sections: [
      {
        id: 'principe-imposition-crypto',
        title: 'Principe d\'imposition des cryptomonnaies',
        content: `En Suisse, les cryptomonnaies sont considérées comme de la fortune mobilière au même titre que les actions ou obligations. Cette qualification entraîne des règles fiscales spécifiques selon que l'activité est privée ou commerciale.

Pour la gestion de fortune privée, les cryptomonnaies sont imposables sur la fortune au 31 décembre selon leur valeur de marché. Les gains en capital ne sont généralement pas imposables, conformément au principe suisse d'exonération des gains privés.

L'Administration fédérale des contributions (AFC) publie annuellement les cours de référence des principales cryptomonnaies pour l'évaluation fiscale. Bitcoin, Ethereum et autres cryptomonnaies majeures ont des cours officiels.

La distinction entre activité privée et commerciale est cruciale : elle dépend de critères similaires au trading d'actions (fréquence, montants, effet de levier, durée de détention). Le trading professionnel rend tous les gains imposables.`,
        keyPoints: [
          'Fortune mobilière imposable au 31 décembre',
          'Gains privés généralement exonérés',
          'Cours AFC pour évaluation officielle',
          'Distinction privé/commercial cruciale',
          'Critères trading professionnel applicables'
        ]
      },
      {
        id: 'mining-staking',
        title: 'Mining et staking : revenus professionnels',
        content: `Le mining (minage) et le staking de cryptomonnaies constituent des activités génératrices de revenus imposables. Ces activités sont considérées comme de l'activité indépendante, imposable selon les barèmes progressifs ordinaires.

Les revenus de mining correspondent à la valeur des cryptomonnaies reçues au moment de leur création. Les frais d'électricité, matériel informatique, locaux peuvent être déduits comme charges d'exploitation si l'activité est exercée de manière professionnelle.

Le staking (preuve d'enjeu) génère également des revenus imposables au moment de la réception des récompenses. La valeur imposable correspond au cours de marché au moment de la réception.

Les cotisations AVS/AI (10.6%) s'appliquent sur les revenus nets de mining/staking. Une inscription au registre du commerce peut être nécessaire selon l'ampleur de l'activité.`,
        keyPoints: [
          'Mining/staking = activité indépendante',
          'Revenus imposables à réception',
          'Charges exploitation déductibles',
          'Cotisations AVS/AI 10.6% dues',
          'Inscription commerce selon ampleur'
        ],
        example: 'Un mineur recevant 0.1 Bitcoin à 50\'000 CHF déclare 5\'000 CHF de revenu imposable, moins ses frais d\'électricité et matériel déductibles.'
      },
      {
        id: 'defi-nft',
        title: 'DeFi et NFT : cas particuliers',
        content: `La finance décentralisée (DeFi) pose des défis fiscaux complexes. Les revenus de liquidity providing, yield farming, lending sont généralement imposables comme revenus de capitaux mobiliers au moment de leur réalisation.

Les airdrops gratuits ne génèrent pas de revenu imposable à réception si aucune contrepartie n'est fournie. Cependant, ils augmentent la fortune imposable et leur vente ultérieure peut générer des gains.

Les NFT (tokens non fongibles) suivent les mêmes règles que les autres actifs numériques : fortune imposable, gains privés exonérés sauf trading professionnel. La création et vente régulière de NFT constitue une activité commerciale.

L'échange de cryptomonnaies (crypto-to-crypto) n'est généralement pas imposable si fait dans le cadre de la gestion de fortune privée. Cependant, il faut tenir compte de la valeur pour le calcul de la fortune.`,
        keyPoints: [
          'DeFi : revenus à réalisation',
          'Airdrops : pas de revenu si gratuit',
          'NFT : mêmes règles actifs numériques',
          'Échanges crypto privés non imposables',
          'Création NFT régulière = commercial'
        ],
        warning: 'La frontière entre activité privée et commerciale est parfois floue. En cas de doute, l\'administration fiscale peut requalifier l\'activité rétroactivement.'
      }
    ],
    keywords: ['cryptomonnaies', 'Bitcoin', 'mining', 'staking', 'DeFi', 'NFT'],
    relatedConcepts: [
      { slug: 'impot-fortune-personnes-physiques', title: 'Impôt sur la fortune' },
      { slug: 'statut-independant-criteres', title: 'Statut indépendant' }
    ],
    legalReferences: [
      { title: 'AFC - Cryptomonnaies', url: 'https://www.estv.admin.ch/estv/fr/home/privatpersonen/steuern/digitale-waehrungen.html' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'optimisation-troisieme-pilier',
    title: 'Optimisation du 3e pilier A',
    description: 'Stratégies avancées pour maximiser les avantages fiscaux du 3e pilier : versements, retraits et planification',
    category: 'Analyses et optimisation', 
    subcategory: 'Optimisation 3e pilier',
    content: '',
    sections: [
      {
        id: 'versements-optimaux',
        title: 'Stratégies de versements optimaux',
        content: `Le versement au 3e pilier A doit être effectué avant le 31 décembre pour être déductible dans l'année fiscale. Cette règle stricte impose une planification précise, particulièrement pour optimiser les années à hauts revenus.

L'étalement des versements peut être stratégique : plutôt que de verser le maximum chaque année, concentrer les versements les années à taux marginal élevé maximise l'économie fiscale. Cela nécessite une vision pluriannuelle des revenus.

Les rachats de lacunes dans le 3e pilier permettent de rattraper les années où le maximum n'a pas été versé. Ces rachats sont possibles rétroactivement et peuvent créer des déductions substantielles les années de revenus exceptionnels.

Le timing en fin d'année est crucial : un versement le 2 janvier ne peut plus être rattaché à l'année précédente. Les virements doivent être effectués et comptabilisés avant le 31 décembre par l'institution de prévoyance.`,
        keyPoints: [
          'Versement avant 31 décembre obligatoire',
          'Concentration années hauts revenus optimal',
          'Rachats lacunes rétroactifs possibles',
          'Timing fin année crucial',
          'Vision pluriannuelle nécessaire'
        ],
        example: 'Un cadre anticipant un bonus important en décembre peut verser 14\'000 CHF au 3e pilier (année courante + année suivante) pour optimiser ses déductions sur l\'année du bonus.'
      },
      {
        id: 'retraits-echelonnes',
        title: 'Optimisation des retraits échelonnés',
        content: `Le retrait du 3e pilier A est imposé séparément des autres revenus, évitant l'effet de la progressivité. L'échelonnement des retraits sur plusieurs années peut réduire significativement la charge fiscale totale.

Les retraits sont possibles 5 ans avant l'âge AVS, permettant un étalement sur 6 années (60-65 ans). Chaque retrait partiel est imposé selon le barème de l'imposition séparée, généralement plus avantageux.

Les conjoints peuvent échelonner leurs retraits de manière coordonnée, doublant les possibilités d'optimisation. Une planification commune permet de lisser les revenus imposables sur la période de retraite.

Le choix du canton de domicile au moment du retrait influence l'imposition. Certains cantons ont des barèmes très favorables pour l'imposition séparée des prestations de prévoyance.`,
        keyPoints: [
          'Imposition séparée évite progressivité',
          'Étalement possible 5 ans avant AVS',
          'Coordination retraits entre conjoints',
          'Canton domicile influence imposition',
          'Barèmes séparés souvent avantageux'
        ]
      },
      {
        id: 'retraits-anticipes',
        title: 'Retraits anticipés stratégiques',
        content: `Le retrait anticipé pour l'achat immobilier (résidence principale) peut être fiscalement intéressant si le bien est conservé long terme. L'imposition au retrait peut être inférieure à l'économie d'intérêts hypothécaires.

Le passage à l'indépendance permet le retrait anticipé de l'ensemble du 3e pilier. Cette possibilité peut être utilisée stratégiquement lors d'une création d'entreprise, même temporaire.

Le départ définitif de Suisse autorise le retrait complet, souvent avec une imposition réduite. Cette option peut être planifiée dans le cadre d'une stratégie patrimoniale internationale.

L'amortissement indirect via le 3e pilier permet de maintenir les avantages fiscaux tout en réduisant les dettes hypothécaires. Le capital reste placé et fructifie tout en servant de garantie bancaire.`,
        keyPoints: [
          'Achat immobilier : analyse coût/bénéfice',
          'Indépendance permet retrait complet',
          'Départ Suisse avec imposition réduite',
          'Amortissement indirect maintient avantages',
          'Planification stratégique nécessaire'
        ],
        warning: 'Le retrait pour l\'achat immobilier crée une dette fiscale latente si le bien est revendu dans les 3 ans ou si la résidence principale change.'
      }
    ],
    keywords: ['3e pilier', 'optimisation', 'versements', 'retraits', 'planification'],
    relatedConcepts: [
      { slug: 'deductions-fiscales-principales', title: 'Déductions fiscales' },
      { slug: 'rentes-avs-lpp-imposition', title: 'Rentes et prévoyance' }
    ],
    legalReferences: [
      { title: 'LPP Art. 60 (3e pilier)', url: 'https://www.fedlex.admin.ch/eli/cc/1983/797_797_797/fr#art_60' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== FISCALITÉ INTERNATIONALE ==========
  {
    slug: 'frontaliers-imposition',
    title: 'Fiscalité des travailleurs frontaliers',
    description: 'Règles d\'imposition des frontaliers selon les accords bilatéraux avec les pays voisins',
    category: 'Fiscalité internationale',
    subcategory: 'Frontaliers',
    content: '',
    sections: [
      {
        id: 'principe-frontaliers',
        title: 'Principe d\'imposition des frontaliers',
        content: `Les travailleurs frontaliers bénéficient d'un régime fiscal spécial défini par les conventions de double imposition entre la Suisse et ses pays voisins. Le principe général veut que le salaire soit imposé dans le pays de travail, mais le frontalier conserve sa résidence fiscale dans son pays de domicile.

Cette règle vise à éviter la double imposition tout en respectant la souveraineté fiscale de chaque État. Les modalités précises varient selon le pays de résidence : France, Allemagne, Autriche ou Italie ont chacun des accords spécifiques avec la Suisse.

L'impôt à la source est prélevé en Suisse au moment du versement du salaire. Les taux varient selon le canton de travail et la situation familiale. Cet impôt constitue généralement l'imposition définitive, mais des régularisations peuvent être nécessaires dans le pays de résidence.

La zone frontalière est définie géographiquement dans chaque accord. En général, elle s'étend sur 20 kilomètres de part et d'autre de la frontière, mais des communes spécifiques sont listées dans les conventions.`,
        keyPoints: [
          'Imposition dans le pays de travail (Suisse)',
          'Résidence fiscale conservée dans pays de domicile',
          'Accords spécifiques par pays voisin',
          'Zone frontalière définie géographiquement',
          'Impôt à la source en Suisse'
        ]
      },
      {
        id: 'specificites-pays',
        title: 'Spécificités par pays',
        content: `L'accord franco-suisse prévoit l'imposition en Suisse avec retenue à la source. La France reverse 4.5% de l'impôt perçu aux départements frontaliers français. Les frontaliers français peuvent opter pour l'imposition ordinaire en Suisse s'ils y ont des revenus dépassant 120'000 CHF.

L'accord avec l'Allemagne suit le même principe mais sans rétrocession fiscale. Les frontaliers allemands déclarent leurs revenus suisses en Allemagne où ils sont exonérés, l'impôt suisse étant définitif.

L'Autriche et l'Italie ont des accords similaires avec leurs spécificités propres. Les frontaliers doivent généralement déclarer leurs revenus suisses dans leur pays de résidence, où ils bénéficient d'une exonération correspondant à l'impôt payé en Suisse.

La période de référence pour conserver le statut de frontalier est importante : retour quotidien ou au moins hebdomadaire au domicile, avec des dérogations limitées pour les déplacements professionnels.`,
        keyPoints: [
          'France : rétrocession 4.5% aux départements',
          'Allemagne : exonération sans rétrocession',
          'Déclaration dans pays de résidence',
          'Retour régulier au domicile obligatoire',
          'Dérogations limitées pour voyages'
        ],
        warning: 'Le télétravail depuis le domicile peut remettre en cause le statut fiscal frontalier si la proportion devient trop importante.'
      }
    ],
    keywords: ['frontaliers', 'conventions', 'impôt à la source', 'zone frontalière'],
    relatedConcepts: [
      { slug: 'double-imposition', title: 'Conventions double imposition' },
      { slug: 'impot-source', title: 'Impôt à la source' }
    ],
    legalReferences: [
      { title: 'Convention franco-suisse', url: 'https://www.fedlex.admin.ch/' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== DÉCLARATION ET PROCESSUS ==========
  {
    slug: 'declaration-impots-delais',
    title: 'Déclaration d\'impôts : délais et procédures',
    description: 'Guide pratique pour remplir sa déclaration fiscale : délais, documents requis et procédures',
    category: 'Déclaration et processus',
    subcategory: 'Procédures',
    content: '',
    sections: [
      {
        id: 'delais-legaux',
        title: 'Délais légaux et prolongations',
        content: `Les délais de dépôt de la déclaration d'impôt varient selon les cantons, généralement entre le 31 mars et le 31 mai pour les personnes physiques. Ces délais sont impératifs et leur non-respect entraîne des sanctions : amendes, estimations d'office et intérêts moratoires.

La prolongation automatique jusqu'au 30 septembre est accordée dans la plupart des cantons si la demande est formulée avant l'échéance normale. Cette prolongation ne nécessite pas de justification particulière mais doit être demandée expressément.

Pour les cas complexes (revenus étrangers, restructurations, successions), une prolongation supplémentaire peut être accordée sur demande motivée. Les fiduciaires obtiennent souvent des délais étendus pour traiter plusieurs dossiers simultanément.

Le dépôt électronique devient obligatoire dans plusieurs cantons et permet souvent d'obtenir des délais supplémentaires. Les plateformes numériques facilitent aussi les corrections et compléments.`,
        keyPoints: [
          'Délais cantonaux : 31 mars à 31 mai',
          'Prolongation automatique au 30 septembre',
          'Sanctions en cas de retard',
          'Délais étendus pour cas complexes',
          'Avantages du dépôt électronique'
        ]
      },
      {
        id: 'documents-necessaires',
        title: 'Documents nécessaires',
        content: `La liste des documents varie selon la situation, mais certains sont systématiquement requis. Pour les salariés : certificats de salaire, attestations de cotisations 3e pilier, relevés bancaires et de titres au 31 décembre.

Les propriétaires doivent joindre les décomptes de charges, factures de travaux déductibles, attestations d'assurances et éventuellement les contrats de location si le bien est loué. La valeur d'assurance incendie sert souvent de base pour l'évaluation de la fortune immobilière.

Les indépendants et dirigeants de sociétés ont des obligations renforcées : comptes annuels, bilan, compte de pertes et profits, état des débiteurs et créanciers. Un rapport de révision peut être exigé selon la taille de l'entreprise.

Pour les situations internationales : attestations fiscales étrangères, preuves de paiement d'impôts à l'étranger, traductions certifiées conformes des documents en langue étrangère.`,
        keyPoints: [
          'Certificats salaire et cotisations obligatoires',
          'Décomptes charges pour propriétaires',
          'Comptes annuels pour indépendants',
          'Attestations étrangères traduites',
          'Relevés bancaires au 31 décembre'
        ],
        example: 'Un salarié propriétaire doit joindre : certificat de salaire, attestation 3e pilier, décompte charges immeuble, factures entretien déductible et relevé bancaire de clôture.'
      }
    ],
    keywords: ['déclaration', 'délais', 'documents', 'procédures'],
    relatedConcepts: [
      { slug: 'taxation-processus', title: 'Processus de taxation' },
      { slug: 'recours-fiscal', title: 'Voies de recours' }
    ],
    legalReferences: [
      { title: 'Procédures fiscales cantonales', url: 'https://www.ch.ch/' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== ANALYSES ET OPTIMISATION ==========
  {
    slug: 'optimisation-fiscale-legale',
    title: 'Stratégies d\'optimisation fiscale légale',
    description: 'Techniques légales pour réduire sa charge fiscale : timing, structuration et planification',
    category: 'Analyses et optimisation',
    subcategory: 'Stratégies',
    content: '',
    sections: [
      {
        id: 'principe-optimisation',
        title: 'Principes de l\'optimisation fiscale',
        content: `L'optimisation fiscale légale consiste à structurer ses affaires de manière à minimiser la charge fiscale dans le respect de la loi. Elle se distingue de l'évasion fiscale (illégale) et de la fraude fiscale (pénalement sanctionnée).

Le principe fondamental est que le contribuable peut choisir la voie la moins imposée, pourvu qu'elle soit légale et conforme à la substance économique de l'opération. Cette liberté découle du principe de légalité : ce qui n'est pas interdit est permis.

L'optimisation peut porter sur le timing (étalement des revenus), la forme juridique (société vs personne physique), la localisation (choix du canton) ou la structuration (utilisation de véhicules fiscalement avantageux comme le 3e pilier).

Certaines limites existent : l'abus de droit fiscal sanctionne les montages purement artificiels sans substance économique. Les autorités examinent la réalité économique au-delà de la forme juridique.`,
        keyPoints: [
          'Optimisation légale vs évasion illégale',
          'Choix de la voie la moins imposée',
          'Timing, forme, localisation, structuration',
          'Limites : abus de droit fiscal',
          'Substance économique requise'
        ]
      },
      {
        id: 'techniques-courantes',
        title: 'Techniques d\'optimisation courantes',
        content: `Le versement anticipé au 3e pilier permet de déduire jusqu'à 7\'056 CHF du revenu imposable tout en constituant un capital pour la retraite. Le timing du versement (avant le 31 décembre) et les retraits échelonnés optimisent l'avantage fiscal.

La répartition revenus/fortune entre conjoints permet d'exploiter la progressivité de l'impôt. Les revenus de capitaux peuvent être attribués au conjoint moins imposé par des donations entre époux.

L'étalement des revenus extraordinaires évite les effets de la progressivité. Les bonus peuvent être négociés sur plusieurs années, les plus-values immobilières étalées via des ventes échelonnées.

Le choix du domicile fiscal représente souvent l'optimisation la plus efficace. Les différences de charge fiscale entre cantons peuvent atteindre 40-50% pour les hauts revenus, justifiant économiquement un déménagement.`,
        keyPoints: [
          '3e pilier : 7\'056 CHF déductibles',
          'Répartition optimale entre conjoints',
          'Étalement des revenus extraordinaires',
          'Choix stratégique du domicile fiscal',
          'Timing des opérations important'
        ],
        warning: 'Toute optimisation doit avoir une justification économique réelle au-delà du simple avantage fiscal.'
      }
    ],
    keywords: ['optimisation', 'stratégies', 'planification', '3e pilier', 'domicile fiscal'],
    relatedConcepts: [
      { slug: 'troisieme-pilier-optimisation', title: 'Optimisation 3e pilier' },
      { slug: 'domicile-fiscal-choix', title: 'Choix du domicile fiscal' }
    ],
    legalReferences: [
      { title: 'ATF sur l\'abus de droit fiscal', url: 'https://www.bger.ch/' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== SPÉCIFICITÉS CANTONALES ==========
  {
    slug: 'comparatif-fiscal-cantonal',
    title: 'Comparatif fiscal intercantonal',
    description: 'Analyse des différences de charge fiscale entre cantons suisses et implications pour les contribuables',
    category: 'Spécificités cantonales',
    subcategory: 'Comparatifs',
    content: '',
    sections: [
      {
        id: 'methodologie-comparaison',
        title: 'Méthodologie de comparaison',
        content: `La comparaison fiscale entre cantons nécessite une méthodologie rigoureuse car les systèmes varient substantiellement. Il faut considérer l'impôt cantonal, l'impôt communal (qui varie aussi selon les communes), les déductions autorisées et les barèmes appliqués.

L'Administration fédérale des contributions publie annuellement des statistiques comparatives basées sur des profils types : célibataire, couple sans enfant, couple avec enfants, pour différents niveaux de revenus. Ces données permettent des comparaisons objectives.

Les variables clés incluent : le coefficient communal (multiplicateur de l'impôt cantonal), les déductions spécifiques (certains cantons offrent des déductions généreuses), les barèmes (certains sont plus progressifs), l'impôt sur la fortune (inexistant dans certains cantons).

Les comparaisons doivent aussi intégrer les coûts de la vie, la qualité des services publics, l'accessibilité et les opportunités économiques. Un impôt plus élevé peut être compensé par de meilleurs services ou un marché du travail plus dynamique.`,
        keyPoints: [
          'Méthodologie rigoureuse nécessaire',
          'Statistiques AFC avec profils types',
          'Variables : coefficient, déductions, barèmes',
          'Considérer coûts vie et services publics',
          'Vue globale au-delà des seuls impôts'
        ]
      },
      {
        id: 'cantons-competitifs',
        title: 'Cantons fiscalement compétitifs',
        content: `Zoug reste traditionnellement le canton le plus attractif fiscalement, avec des taux très compétitifs sur le revenu et l'absence d'impôt sur la fortune pour les montants modestes. Cette attractivité a attiré de nombreuses entreprises et contribuables aisés.

Les cantons d'Appenzell Rhodes-Intérieures, Nidwald et Obwald offrent aussi des charges fiscales réduites, particulièrement pour les hauts revenus. Leurs barèmes plafonnent rapidement, évitant une progressivité excessive.

Bâle-Ville présente un profil particulier : charge fiscale modérée malgré son statut urbain, avec d'excellents services publics et transports. C'est un exemple d'équilibre entre impôts et qualité de vie urbaine.

Les cantons de montagne (Valais, Grisons) offrent souvent des conditions avantageuses, notamment pour les résidences secondaires et l'imposition forfaitaire des étrangers fortunés.`,
        keyPoints: [
          'Zoug : référence en compétitivité fiscale',
          'Cantons ruraux : plafonnement progressivité',
          'Bâle-Ville : équilibre impôts/services',
          'Cantons montagne : conditions spéciales',
          'Attractivité pour entreprises et particuliers'
        ],
        example: 'Un couple avec 150\'000 CHF de revenu paie environ 12\'000 CHF d\'impôts à Zoug contre 25\'000 CHF à Genève, soit une différence de 13\'000 CHF annuels.'
      }
    ],
    keywords: ['comparatif cantonal', 'charge fiscale', 'compétitivité', 'Zoug', 'barèmes'],
    relatedConcepts: [
      { slug: 'domicile-fiscal-choix', title: 'Choix du domicile fiscal' },
      { slug: 'concurrence-fiscale', title: 'Concurrence fiscale' }
    ],
    legalReferences: [
      { title: 'Statistiques fiscales AFC', url: 'https://www.estv.admin.ch/' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== TITRES ET VALEURS MOBILIÈRES ==========
  {
    slug: 'titres-valeurs-mobilieres',
    title: 'Fiscalité des titres et valeurs mobilières',
    description: 'Comprendre l\'imposition des actions, obligations et fonds de placement pour les particuliers',
    category: 'Patrimoine et investissements',
    subcategory: 'Titres et valeurs',
    content: '',
    sections: [
      {
        id: 'types-titres',
        title: 'Types de titres et classification fiscale',
        content: `En Suisse, les titres et valeurs mobilières sont considérés comme de la fortune mobilière pour les particuliers. Cette classification détermine leur traitement fiscal.

Les principaux types de titres comprennent :
- Actions cotées et non cotées
- Obligations (d'État, d'entreprises, convertibles)
- Parts de fonds de placement (OPCVM)
- Produits structurés et dérivés
- ETF (Exchange Traded Funds)
- Certificats de participation

La distinction entre gestion de fortune privée et activité commerciale est cruciale pour déterminer le régime fiscal applicable.`,
        keyPoints: [
          'Les titres sont considérés comme fortune mobilière chez les particuliers',
          'La plus-value privée n\'est généralement pas imposable',
          'Les dividendes et intérêts sont imposables comme revenus',
          'La limite entre gestion privée et commerciale est déterminante'
        ],
        example: 'Un salarié qui détient 100 actions Nestlé : les dividendes reçus sont imposables comme revenus, mais la plus-value de vente n\'est pas imposable (gestion de fortune privée).'
      },
      {
        id: 'revenus-titres',
        title: 'Imposition des revenus de titres',
        content: `Les revenus générés par les titres sont imposables selon leur nature :

**Dividendes d'actions suisses :**
- Imposables à 100% comme revenus
- Impôt anticipé de 35% prélevé à la source
- Remboursement possible pour résidents suisses via déclaration

**Dividendes d'actions étrangères :**
- Imposables selon conventions de double imposition
- Retenue à la source variable selon pays
- Possibilité de déduction ou crédit d'impôt

**Intérêts d'obligations :**
- Imposables à 100% comme revenus
- Impôt anticipé de 35% sur obligations suisses
- Calcul prorata temporis pour acquisitions en cours d'année

**Distributions de fonds :**
- Imposables selon nature (revenus ou remboursements de capital)
- Distinction importante entre distributions et plus-values reinvesties`,
        keyPoints: [
          'Tous les revenus de titres sont imposables (dividendes, intérêts)',
          'Impôt anticipé de 35% sur titres suisses (remboursable)',
          'Conventions de double imposition pour titres étrangers',
          'Calcul prorata temporis pour détentions partielles'
        ],
        example: '1000 CHF de dividendes reçus : 350 CHF d\'impôt anticipé prélevé, 1000 CHF déclarés comme revenus, 350 CHF remboursés via déclaration d\'impôts.',
        warning: 'Ne pas oublier de déclarer les revenus bruts (avant impôt anticipé) et demander le remboursement.'
      },
      {
        id: 'plus-values',
        title: 'Traitement des plus-values et moins-values',
        content: `Le traitement fiscal des plus-values dépend du statut de l'investisseur :

**Gestion de fortune privée (règle générale) :**
- Plus-values non imposables
- Moins-values non déductibles
- Critères : détention long terme, pas de recours au crédit, revenus accessoires

**Trading/Activité commerciale :**
- Plus-values imposables comme revenus d'activité indépendante
- Moins-values déductibles
- Critères : transactions fréquentes, détention court terme, effet de levier

**Critères de délimitation (pratique ATF) :**
- Durée de détention (< 6 mois = suspect)
- Rapport entre plus-values et fortune/revenus
- Financement par emprunt
- Fréquence des transactions
- Connaissances spécialisées

La qualification est déterminée globalement pour l'ensemble du portefeuille.`,
        keyPoints: [
          'Plus-values privées généralement non imposables en Suisse',
          'Activité commerciale = plus-values imposables',
          'Critères stricts de délimitation (durée, fréquence, financement)',
          'Qualification globale du portefeuille'
        ],
        example: 'Investisseur détenant 20 actions pendant 2 ans, vendues avec 10\'000 CHF de plus-value : non imposable (gestion privée). Même personne faisant 100 transactions par mois : imposable (activité commerciale).',
        warning: 'La requalification en activité commerciale impose rétroactivement toutes les plus-values réalisées.'
      },
      {
        id: 'fortune-titres',
        title: 'Imposition de la fortune en titres',
        content: `Les titres font partie de la fortune imposable et doivent être déclarés à leur valeur vénale au 31 décembre.

**Évaluation des titres cotés :**
- Valeur boursière au 31 décembre
- Cours de clôture du dernier jour de bourse
- Conversion en CHF au cours officiel

**Évaluation des titres non cotés :**
- Valeur intrinsèque (actif net)
- Méthodes d'évaluation reconnues
- Expertise possible en cas de litige

**Comptes-titres à l'étranger :**
- Déclaration obligatoire
- Valeur au 31 décembre en CHF
- Formulaire spécial "Avoirs à l'étranger"

**Optimisations légales :**
- Répartition familiale des titres
- Timing des achats/ventes de fin d'année
- Structures holding familiales`,
        keyPoints: [
          'Valeur vénale au 31 décembre pour l\'impôt sur la fortune',
          'Cours officiel pour titres cotés',
          'Déclaration obligatoire des comptes étrangers',
          'Possibilités d\'optimisation légale'
        ],
        example: 'Portefeuille de 500\'000 CHF au 31.12 : imposable à la fortune. Si détenu à 50/50 par époux : 250\'000 CHF chacun (optimisation).',
        warning: 'L\'omission de déclarer des comptes-titres à l\'étranger constitue une soustraction d\'impôt.'
      }
    ],
    keywords: ['titres', 'actions', 'obligations', 'fonds', 'plus-values', 'dividendes', 'fortune mobilière'],
    relatedConcepts: [
      { slug: 'impot-fortune-personnes-physiques', title: 'Impôt sur la fortune' },
      { slug: 'fiscalite-cryptomonnaies-suisse', title: 'Fiscalité des cryptomonnaies' },
      { slug: 'statut-independant-criteres', title: 'Statut indépendant' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 16 - Revenus mobiliers', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_16' },
      { title: 'LHID Art. 7 - Revenus mobiliers', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1256_1256_1256/fr#art_7' },
      { title: 'Circulaire AFC 36 - Délimitation', url: 'https://www.estv.admin.ch/estv/fr/accueil/impot-federal-direct/documentation/publications.html' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== CONVENTIONS DOUBLE IMPOSITION ==========
  {
    slug: 'conventions-double-imposition',
    title: 'Conventions de double imposition (CDI)',
    description: 'Comprendre les accords fiscaux internationaux et éviter la double taxation',
    category: 'Fiscalité internationale',
    subcategory: 'Conventions internationales',
    content: '',
    sections: [
      {
        id: 'principe-cdi',
        title: 'Principe et objectifs des CDI',
        content: `Les Conventions de Double Imposition (CDI) sont des accords bilatéraux conclus entre la Suisse et d'autres États pour éviter que les mêmes revenus soient imposés dans les deux pays.

**Objectifs principaux :**
- Éliminer la double imposition juridique
- Prévenir la fraude et l'évasion fiscales
- Favoriser les échanges économiques
- Créer la sécurité juridique pour les contribuables

**Mécanismes d'élimination :**
- Méthode de l'exemption (revenus exemptés dans un État)
- Méthode de l'imputation (crédit d'impôt pour impôt étranger)
- Répartition du droit d'imposer entre États

La Suisse a conclu plus de 100 CDI avec différents pays, basées sur le modèle OCDE.`,
        keyPoints: [
          'Plus de 100 CDI conclues par la Suisse',
          'Basées sur le modèle OCDE',
          'Deux méthodes principales : exemption et imputation',
          'Sécurité juridique pour les contribuables'
        ],
        example: 'Un frontalier travaillant en Suisse et résidant en France : la CDI Suisse-France détermine que seule la Suisse impose le salaire, la France l\'exempte.'
      },
      {
        id: 'champ-application',
        title: 'Champ d\'application et personnes concernées',
        content: `Les CDI s'appliquent aux personnes physiques et morales résidentes d'un ou des deux États contractants.

**Personnes visées :**
- Résidents fiscaux d'un État contractant
- Parfois les nationaux (selon convention)
- Entreprises ayant siège effectif dans un État

**Impôts couverts :**
- Impôts sur le revenu et la fortune
- Parfois droits de succession
- Exclusion généralement de la TVA et impôts indirects

**Détermination de la résidence fiscale :**
1. Domicile/séjour selon droit interne
2. Centre des intérêts vitaux (famille, économiques)
3. Séjour habituel
4. Nationalité (critère subsidiaire)

**Établissement stable :**
Concept clé pour l'imposition des entreprises dans l'autre État contractant.`,
        keyPoints: [
          'Résidence fiscale = critère principal d\'application',
          'Impôts directs couverts (revenus, fortune)',
          'Procédure de départage pour double résidence',
          'Concept d\'établissement stable pour entreprises'
        ],
        example: 'Cadre suisse travaillant 6 mois par an à Singapour : la CDI détermine s\'il reste résident fiscal suisse ou devient résident singapourien.',
        warning: 'La résidence selon le droit interne peut différer de celle selon la CDI.'
      },
      {
        id: 'types-revenus',
        title: 'Répartition par types de revenus',
        content: `Chaque CDI répartit le droit d'imposer selon le type de revenu :

**Revenus d'activité dépendante (Art. 15) :**
- Principe : imposition dans l'État de l'activité
- Exception : < 183 jours + employeur non-résident + charges non déductibles

**Revenus d'activité indépendante (Art. 14) :**
- Imposition dans l'État d'exercice (établissement stable)
- Professions libérales : base fixe

**Revenus immobiliers (Art. 6) :**
- Imposition dans l'État de situation de l'immeuble
- Inclut revenus locatifs et gains immobiliers

**Dividendes (Art. 10) :**
- Imposition dans l'État de résidence du bénéficiaire
- Retenue à la source limitée dans l'État de la source (5-15%)

**Intérêts (Art. 11) :**
- Principe : imposition dans l'État de résidence
- Parfois retenue à la source limitée

**Redevances (Art. 12) :**
- Imposition dans l'État de résidence du bénéficiaire`,
        keyPoints: [
          'Chaque type de revenu a sa règle spécifique',
          'Activité salariée : règle des 183 jours',
          'Immobilier : imposition dans l\'État de situation',
          'Revenus mobiliers : généralement État de résidence'
        ],
        example: 'Dividendes d\'une SA française reçus par un résident suisse : 5% de retenue en France, imputation en Suisse.',
        warning: 'Les seuils et taux varient selon chaque CDI spécifique.'
      },
      {
        id: 'procedures',
        title: 'Procédures et mise en œuvre',
        content: `L'application des CDI nécessite des procédures spécifiques :

**Certificat de résidence fiscale :**
- Délivré par l'administration fiscale de résidence
- Obligatoire pour bénéficier de la CDI
- Formulaire standardisé selon pays

**Demande de remboursement :**
- Retenues à la source excédentaires
- Délais de prescription variables (2-4 ans)
- Formulaires spécifiques par pays

**Procédure amiable (Art. 25) :**
- Résolution des conflits entre administrations
- Recours en cas de double imposition persistante
- Délai généralement 3 ans

**Échange de renseignements :**
- Automatique ou sur demande
- Standard CRS (Common Reporting Standard)
- Lutte contre l'évasion fiscale

**Clause anti-abus :**
- Prévention de l'usage abusif des CDI
- Test du but principal (Principal Purpose Test)
- Substance économique requise`,
        keyPoints: [
          'Certificat de résidence obligatoire',
          'Procédures de remboursement spécifiques',
          'Recours possible via procédure amiable',
          'Clauses anti-abus renforcées'
        ],
        example: 'Retenue de 25% sur dividendes allemands au lieu de 5% prévu par CDI : demande de remboursement avec certificat de résidence suisse.',
        warning: 'Respecter les délais de demande de remboursement sous peine de perte définitive.'
      }
    ],
    keywords: ['cdi', 'double imposition', 'convention fiscale', 'résidence fiscale', 'retenue source'],
    relatedConcepts: [
      { slug: 'frontaliers-imposition', title: 'Fiscalité des frontaliers' },
      { slug: 'titres-valeurs-mobilieres', title: 'Titres et valeurs mobilières' }
    ],
    legalReferences: [
      { title: 'Liste des CDI de la Suisse', url: 'https://www.sif.admin.ch/sif/fr/home/multilateral-relations/accords-fiscaux.html' },
      { title: 'Modèle OCDE 2017', url: 'https://www.oecd.org/tax/treaties/model-tax-convention-on-income-and-on-capital-condensed-version-20745419.htm' },
      { title: 'Procédure amiable', url: 'https://www.estv.admin.ch/estv/fr/accueil/impot-federal-direct/procedures-amiables.html' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== DOCUMENTS NÉCESSAIRES ==========
  {
    slug: 'documents-necessaires-declaration',
    title: 'Documents nécessaires pour la déclaration d\'impôts',
    description: 'Liste complète des documents et justificatifs requis pour remplir sa déclaration fiscale',
    category: 'Déclaration et processus',
    subcategory: 'Documents et justificatifs',
    content: '',
    sections: [
      {
        id: 'documents-revenus',
        title: 'Documents relatifs aux revenus',
        content: `Pour déclarer correctement vos revenus, plusieurs documents sont indispensables :

**Revenus salariés :**
- Certificat de salaire (obligatoire)
- Décomptes de salaire de décembre
- Certificats de remplacement du revenu (chômage, maladie, accident)
- Attestations de préretraite ou rentes-pont

**Revenus indépendants :**
- Comptes annuels (bilan, compte de résultat)
- Attestation TVA si assujetti
- Justificatifs des charges déductibles
- Contrats de mandat ou prestations

**Revenus de capitaux :**
- Attestations bancaires (intérêts, dividendes)
- Relevés de comptes-titres au 31 décembre
- Avis d'imposition de l'impôt anticipé
- Certificats étrangers pour titres internationaux

**Autres revenus :**
- Attestations AVS/AI/LPP pour rentes
- Contrats de rente viagère
- Revenus locatifs (décomptes de charges)`,
        keyPoints: [
          'Certificat de salaire = document principal pour salariés',
          'Comptes annuels obligatoires pour indépendants',
          'Attestations bancaires pour revenus de capitaux',
          'Conserver tous les justificatifs pendant 10 ans'
        ],
        example: 'Salarié avec épargne : certificat de salaire + attestation bancaire des intérêts reçus + relevé de compte-titres.',
        warning: 'L\'absence de certificat de salaire peut entraîner une taxation d\'office majorée.'
      },
      {
        id: 'documents-deductions',
        title: 'Justificatifs pour déductions',
        content: `Les déductions doivent être justifiées par des documents probants :

**Frais professionnels :**
- Abonnements de transport (attestation)
- Frais de repas (justificatifs restaurants, cantines)
- Formation et perfectionnement (factures, attestations)
- Vêtements professionnels spéciaux
- Outillage et équipement professionnel

**Assurances et prévoyance :**
- Polices d'assurance maladie obligatoire
- Attestations 3e pilier A et B
- Primes d'assurance-vie et invalidité
- Cotisations syndicales

**Frais médicaux et dentaires :**
- Factures médecins, dentistes, hôpitaux
- Factures pharmacies (médicaments prescrits)
- Lunettes et appareils auditifs (prescriptions)
- Frais de transport médical

**Intérêts débiteurs :**
- Attestations bancaires d'intérêts hypothécaires
- Relevés de prêts et crédits privés
- Contrats de crédit avec détail des intérêts`,
        keyPoints: [
          'Toute déduction doit être justifiée par un document',
          'Conserver factures et attestations originales',
          'Intérêts hypothécaires : attestation bancaire obligatoire',
          'Frais médicaux : uniquement sur prescription'
        ],
        example: 'Déduction de 5000 CHF de frais médicaux : nécessite factures détaillées + prescriptions médicales.',
        warning: 'Les déductions non justifiées sont systématiquement refusées lors de contrôles.'
      },
      {
        id: 'documents-fortune',
        title: 'Inventaire de la fortune',
        content: `La déclaration de fortune nécessite un inventaire complet au 31 décembre :

**Comptes bancaires :**
- Relevés de tous les comptes au 31.12
- Comptes courants, épargne, placement
- Comptes à l'étranger (déclaration spéciale)

**Titres et valeurs :**
- Relevés de dépôts au 31.12
- Valorisation des titres non cotés
- Participations dans sociétés non cotées
- Créances privées et prêts consentis

**Biens immobiliers :**
- Estimation officielle ou valeur d'achat
- Factures de rénovations importantes
- Contrats d'achat et actes notariés
- Parts de copropriété

**Autres actifs :**
- Véhicules (permis de circulation)
- Objets de valeur, collections
- Bijoux et métaux précieux
- Polices d'assurance-vie (valeur rachat)

**Dettes déductibles :**
- Attestations de dettes hypothécaires
- Relevés de crédits bancaires
- Dettes privées documentées`,
        keyPoints: [
          'Inventaire complet au 31 décembre obligatoire',
          'Valorisation à la valeur vénale',
          'Comptes étrangers : déclaration spéciale',
          'Dettes déductibles uniquement si documentées'
        ],
        example: 'Fortune immobilière de 800\'000 CHF - hypothèque de 400\'000 CHF = 400\'000 CHF de fortune nette imposable.',
        warning: 'L\'omission d\'éléments de fortune constitue une soustraction d\'impôt.'
      },
      {
        id: 'organisation-documents',
        title: 'Organisation et conservation',
        content: `Une bonne organisation des documents facilite la déclaration et les contrôles :

**Classement recommandé :**
- Dossier par année fiscale
- Sous-dossiers par catégorie (revenus, déductions, fortune)
- Classement chronologique dans chaque catégorie
- Copies de sauvegarde importantes

**Conservation obligatoire :**
- Durée : 10 ans minimum
- Originaux requis pour justificatifs
- Copies acceptées pour information
- Format numérique autorisé si lisible

**Préparation de la déclaration :**
- Check-list des documents nécessaires
- Vérification de la complétude
- Calculs préparatoires
- Comparaison avec année précédente

**Transmission à l'administration :**
- Déclaration signée et datée
- Annexes obligatoires jointes
- Copie de sauvegarde conservée
- Accusé de réception demandé

**Réponse aux demandes :**
- Délai de 30 jours généralement
- Documents complémentaires si requis
- Explications écrites si nécessaire`,
        keyPoints: [
          'Conservation 10 ans minimum obligatoire',
          'Classement systématique recommandé',
          'Originaux requis pour justificatifs',
          'Préparation méthodique de la déclaration'
        ],
        example: 'Contrôle fiscal de l\'année 2020 en 2024 : tous les documents 2020 doivent être disponibles.',
        warning: 'L\'impossibilité de fournir les justificatifs peut entraîner un refus des déductions.'
      }
    ],
    keywords: ['documents', 'justificatifs', 'déclaration', 'certificat salaire', 'conservation'],
    relatedConcepts: [
      { slug: 'declaration-impots-delais', title: 'Délais et procédures' },
      { slug: 'deductions-fiscales-principales', title: 'Déductions fiscales' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 127 - Obligation de renseigner', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_127' },
      { title: 'OAF - Ordonnance sur l\'assistance administrative', url: 'https://www.fedlex.admin.ch/eli/cc/2007/686/fr' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== PRÉVOYANCE 2E/3E PILIER ==========
  {
    slug: 'prevoyance-2e-3e-pilier',
    title: 'Prévoyance professionnelle et individuelle (2e/3e pilier)',
    description: 'Comprendre et optimiser votre prévoyance professionnelle et privée en Suisse',
    category: 'Patrimoine et investissements',
    subcategory: 'Prévoyance',
    content: '',
    sections: [
      {
        id: 'systeme-trois-piliers',
        title: 'Le système des trois piliers',
        content: `Le système de prévoyance suisse repose sur trois piliers complémentaires visant à garantir le maintien du niveau de vie à la retraite.

**1er pilier (AVS/AI) :**
- Prévoyance étatique obligatoire
- Couvre les besoins vitaux de base
- Système de répartition (actifs financent les retraités)
- Rente maximale AVS : 2'450 CHF/mois (individuelle)

**2e pilier (LPP) :**
- Prévoyance professionnelle obligatoire
- Maintien du niveau de vie antérieur
- Système de capitalisation individuelle
- Obligatoire dès 22'050 CHF de salaire annuel

**3e pilier :**
- Prévoyance individuelle facultative
- Complément personnalisé
- 3a : lié avec avantages fiscaux
- 3b : libre sans avantages fiscaux`,
        keyPoints: [
          'Système à trois niveaux pour une protection complète',
          '1er pilier : besoins de base (AVS)',
          '2e pilier : maintien du niveau de vie (LPP)',
          '3e pilier : complément individuel avec avantages fiscaux'
        ],
        example: 'Salarié avec 80\'000 CHF de salaire : AVS (1er pilier) = environ 2\'000 CHF/mois, LPP (2e pilier) = environ 1\'500 CHF/mois, nécessité du 3e pilier pour maintenir le niveau de vie.'
      },
      {
        id: 'deuxieme-pilier',
        title: 'Le 2e pilier (LPP) en détail',
        content: `La prévoyance professionnelle constitue un élément central du système de retraite suisse.

**Cotisations LPP :**
- Part employeur : minimum 50%
- Part employé : maximum 50%
- Taux selon l'âge : 7% à 18% du salaire assuré
- Salaire assuré : salaire annuel - déduction de coordination (25'725 CHF)

**Prestations possibles :**
- Rente de vieillesse à la retraite
- Rente d'invalidité en cas d'incapacité
- Rente de survivants (veuve/veuf, orphelins)
- Capital unique possible (jusqu'à 100% selon caisse)

**Rachats volontaires :**
- Combler les lacunes de cotisation
- Améliorer les prestations futures
- Entièrement déductibles fiscalement
- Blocage 3 ans avant retrait en capital

**Retrait anticipé possible pour :**
- Achat résidence principale
- Démarrage activité indépendante
- Départ définitif de Suisse`,
        keyPoints: [
          'Cotisations partagées employeur/employé',
          'Rachats volontaires déductibles à 100%',
          'Possibilité de retrait en capital ou rente',
          'Retrait anticipé pour propriété ou indépendance'
        ],
        example: 'Rachat LPP de 50\'000 CHF : économie fiscale immédiate de 15\'000 CHF (taux marginal 30%), augmentation de la rente future de 200 CHF/mois.',
        warning: 'Les rachats LPP sont bloqués 3 ans avant de pouvoir être retirés en capital.'
      },
      {
        id: 'troisieme-pilier-a',
        title: 'Le 3e pilier A (prévoyance liée)',
        content: `Le pilier 3a offre des avantages fiscaux substantiels pour la constitution d'une épargne retraite.

**Montants maximaux 2024 :**
- Avec 2e pilier : 7'056 CHF par année
- Sans 2e pilier (indépendants) : 35'280 CHF (20% du revenu)
- Déductible à 100% du revenu imposable

**Types de solutions 3a :**
- Compte épargne 3a (sécurité, faible rendement)
- Fonds de placement 3a (potentiel de rendement supérieur)
- Assurance-vie 3a (protection + épargne)

**Conditions de retrait :**
- 5 ans avant l'âge AVS ordinaire (anticipé)
- Départ retraite ordinaire
- Achat résidence principale
- Amortissement hypothèque résidence principale
- Démarrage activité indépendante
- Départ définitif de Suisse
- Invalidité complète

**Imposition au retrait :**
- Taux réduit séparé du revenu
- Environ 5-8% selon canton et montant
- Échelonnement recommandé (plusieurs comptes)`,
        keyPoints: [
          'Déduction fiscale jusqu\'à 7\'056 CHF/an',
          'Économie fiscale immédiate de 20-40%',
          'Retrait anticipé possible dès 60/59 ans',
          'Imposition réduite au retrait (5-8%)'
        ],
        example: 'Versement annuel de 7\'056 CHF pendant 30 ans : capital final environ 350\'000 CHF, économies fiscales cumulées environ 70\'000 CHF.',
        warning: 'Les fonds sont bloqués jusqu\'à la retraite sauf exceptions légales.'
      },
      {
        id: 'optimisation-fiscale',
        title: 'Optimisation fiscale de la prévoyance',
        content: `Stratégies pour maximiser les avantages fiscaux de votre prévoyance.

**Échelonnement des retraits :**
- Ouvrir plusieurs comptes 3a (max 5 recommandé)
- Retirer sur plusieurs années fiscales
- Réduction de la progression fiscale
- Coordination avec rachats LPP

**Combinaison 2e et 3e pilier :**
1. Maximiser d'abord le 3a (flexibilité)
2. Rachats LPP ciblés (3-5 ans avant retraite)
3. Alternance capital/rente selon situation
4. Considérer l'impôt sur la fortune post-retraite

**Timing optimal :**
- Rachats LPP : après 50 ans idéalement
- Retrait capital : échelonné sur 5 ans
- Conversion rente : selon espérance de vie
- Coordination avec départ à la retraite

**Cas particuliers :**
- Couples : répartition entre conjoints
- Indépendants : maximiser le 3a élargi
- Expatriés : considérer les conventions
- Propriétaires : arbitrage amortissement vs 3a`,
        keyPoints: [
          'Ouvrir plusieurs comptes 3a pour échelonner',
          'Rachats LPP stratégiques avant retraite',
          'Coordination des retraits pour minimiser l\'impôt',
          'Planification sur 5-10 ans avant retraite'
        ],
        example: '5 comptes 3a de 70\'000 CHF chacun, retirés sur 5 ans : économie fiscale de 15\'000 CHF vs retrait unique.',
        warning: 'La planification doit commencer au moins 5-10 ans avant la retraite pour être optimale.'
      }
    ],
    keywords: ['prévoyance', '2e pilier', '3e pilier', 'LPP', 'retraite', 'rachats'],
    relatedConcepts: [
      { slug: 'optimisation-troisieme-pilier', title: 'Optimisation du 3e pilier' },
      { slug: 'rentes-avs-lpp-imposition', title: 'Imposition des rentes' }
    ],
    legalReferences: [
      { title: 'LPP - Loi sur la prévoyance professionnelle', url: 'https://www.fedlex.admin.ch/eli/cc/1983/797_797_797/fr' },
      { title: 'OPP 3 - Ordonnance sur le pilier 3a', url: 'https://www.fedlex.admin.ch/eli/cc/1985/1791_1791_1791/fr' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== CALENDRIER FISCAL ==========
  {
    slug: 'calendrier-fiscal-suisse',
    title: 'Calendrier fiscal suisse',
    description: 'Dates clés et échéances importantes pour vos obligations fiscales en Suisse',
    category: 'Déclaration et processus',
    subcategory: 'Calendrier',
    content: '',
    sections: [
      {
        id: 'echeances-principales',
        title: 'Échéances fiscales principales',
        content: `Le calendrier fiscal suisse varie selon les cantons mais suit une structure générale commune.

**Janvier-Février :**
- Réception de la déclaration d'impôts
- Envoi des certificats de salaire par les employeurs
- Attestations bancaires disponibles

**Mars :**
- 31 mars : Délai standard de dépôt dans plusieurs cantons
- Possibilité de demander une prolongation
- Délai pour demande de remboursement impôt anticipé

**Avril-Mai :**
- Délais prolongés selon cantons (30 avril, 31 mai)
- Envoi des premières tranches provisoires
- Traitement des déclarations simples

**Septembre :**
- 30 septembre : Échéance acomptes provisoires
- Délai final avec prolongation dans certains cantons
- Envoi des taxations définitives (déclarations précoces)

**Décembre :**
- Paiement solde impôt année précédente
- Versements 3e pilier avant le 31
- Rachats LPP avant le 31`,
        keyPoints: [
          'Délais variables selon les cantons (31 mars à 30 septembre)',
          'Prolongations possibles sur demande',
          'Acomptes provisoires durant l\'année',
          'Actions fiscales importantes en fin d\'année'
        ],
        example: 'Canton de Vaud : déclaration reçue en janvier, délai au 15 mars, prolongation automatique au 30 juin sur demande.',
        warning: 'Les intérêts moratoires courent dès l\'échéance du délai, même avec prolongation.'
      },
      {
        id: 'paiements-acomptes',
        title: 'Système d\'acomptes et paiements',
        content: `Le paiement des impôts suit un système d'acomptes provisoires avec régularisation finale.

**Acomptes provisoires :**
- Basés sur la dernière taxation connue
- Généralement 3-12 tranches selon canton
- Versements mensuels ou trimestriels
- Ajustables sur demande justifiée

**Intérêts :**
- Intérêts rémunératoires si trop payé (0,25% typique)
- Intérêts moratoires si insuffisant (3-5% selon canton)
- Calcul dès l'échéance générale
- Compensation automatique

**Facilités de paiement :**
- Plans de paiement sur demande
- Reports possibles (situations difficiles)
- Paiement par e-banking recommandé
- QR-factures depuis 2022

**Taxation définitive :**
- Émise 6-18 mois après dépôt
- Décompte final avec solde
- 30 jours pour payer ou contester
- Remboursement automatique si trop perçu`,
        keyPoints: [
          'Acomptes basés sur année précédente',
          'Ajustement possible des acomptes',
          'Intérêts moratoires élevés (3-5%)',
          'Paiement échelonné disponible'
        ],
        example: 'Revenus en baisse de 30% : demander immédiatement la réduction des acomptes pour éviter de bloquer la trésorerie.',
        warning: 'Les acomptes non payés génèrent des intérêts même si la taxation finale est inférieure.'
      },
      {
        id: 'actions-fin-annee',
        title: 'Actions fiscales de fin d\'année',
        content: `Décembre est crucial pour l'optimisation fiscale de l'année en cours.

**Avant le 31 décembre :**

**Déductions à maximiser :**
- Versement 3e pilier A (7'056 CHF)
- Rachats LPP (selon capacité)
- Dons aux œuvres (jusqu'à 20% du revenu)
- Cotisations politiques (jusqu'à 10'100 CHF fédéral)

**Revenus à reporter :**
- Bonus différables en janvier
- Dividendes reportables
- Ventes de titres (plus-values)
- Facturations indépendants

**Fortune à optimiser :**
- Remboursement de dettes privées
- Investissements déductibles
- Transferts entre conjoints
- Donations aux enfants

**Timing des transactions :**
- Achat immobilier : frais déductibles
- Travaux d'entretien : à réaliser et payer
- Formation continue : inscription et paiement
- Frais médicaux : regrouper si possible`,
        keyPoints: [
          'Actions irrévocables après le 31 décembre',
          '3e pilier et LPP : versements avant le 31',
          'Optimisation revenus/charges selon situation',
          'Planification pluriannuelle recommandée'
        ],
        example: 'Report d\'un bonus de 20\'000 CHF en janvier : économie fiscale immédiate de 6\'000 CHF si versement du 3e pilier en décembre.',
        warning: 'Les versements 3a/LPP doivent être crédités avant le 31.12, prévoir le délai bancaire.'
      },
      {
        id: 'controles-recours',
        title: 'Contrôles et délais de recours',
        content: `Comprendre les délais pour les contrôles fiscaux et les voies de recours.

**Délais de l'administration :**
- Rappel déclaration : 30 jours généralement
- Taxation d'office : si non-réponse au rappel
- Contrôle ordinaire : jusqu'à 5 ans
- Révision : 10 ans si nouveaux éléments

**Voies de recours contribuable :**
- Réclamation : 30 jours dès notification
- Recours : 30 jours dès décision sur réclamation
- Tribunal cantonal : 30 jours
- Tribunal fédéral : 30 jours

**Procédure de réclamation :**
1. Écrit motivé dans les 30 jours
2. Gratuit en première instance
3. Effet suspensif possible
4. Décision dans 6-12 mois

**Prescription :**
- Droit de taxer : 5 ans (10 si soustraction)
- Perception : 5 ans dès taxation définitive
- Remboursement : 5 ans pour demander
- Rappel d'impôt : 10 ans si non déclaré`,
        keyPoints: [
          'Délai de réclamation : 30 jours impératif',
          'Procédure gratuite en première instance',
          'Prescription de 5 ans (cas normal)',
          'Conservation documents 10 ans recommandée'
        ],
        example: 'Taxation reçue le 15 mai : dernier jour pour réclamation le 14 juin (30 jours calendaires).',
        warning: 'Le non-respect du délai de 30 jours entraîne la perte définitive du droit de recours.'
      }
    ],
    keywords: ['calendrier', 'échéances', 'délais', 'acomptes', 'taxation', 'recours'],
    relatedConcepts: [
      { slug: 'declaration-impots-delais', title: 'Délais et procédures' },
      { slug: 'documents-necessaires-declaration', title: 'Documents nécessaires' }
    ],
    legalReferences: [
      { title: 'LIFD Art. 161 - Échéances', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/fr#art_161' },
      { title: 'Calendriers cantonaux', url: 'https://www.estv.admin.ch/estv/fr/accueil.html' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== ARTICLES COMPLÉMENTAIRES RÉFÉRENCÉS ==========
  
  // Article: Impôt fédéral direct
  {
    slug: 'impot-federal-direct',
    title: 'L\'impôt fédéral direct (IFD)',
    description: 'Comprendre l\'impôt fédéral direct : barèmes, calcul et spécificités',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Impôts fédéraux',
    content: '',
    sections: [
      {
        id: 'principe-ifd',
        title: 'Principe de l\'impôt fédéral direct',
        content: `L'impôt fédéral direct (IFD) est prélevé uniformément dans toute la Suisse sur le revenu des personnes physiques et le bénéfice des personnes morales. Il représente environ 30% des recettes de la Confédération et constitue l'un des piliers du financement fédéral.

Pour les personnes physiques, l'IFD s'applique à partir d'un revenu imposable de 17'800 CHF pour les personnes seules et 30'800 CHF pour les couples mariés. Le taux maximal est constitutionnellement limité à 11.5% et s'applique de manière progressive.

La perception de l'IFD est déléguée aux cantons qui reçoivent 17% du produit de l'impôt en compensation. Cette délégation permet d'éviter la duplication des administrations fiscales tout en maintenant le caractère fédéral de l'impôt.`,
        keyPoints: [
          'Impôt uniforme dans toute la Suisse',
          'Taux maximal constitutionnel de 11.5%',
          'Seuil d\'imposition : 17\'800 CHF (célibataire)',
          'Perception déléguée aux cantons (17% de commission)',
          'Environ 30% des recettes fédérales'
        ],
        example: 'Couple marié avec revenu imposable de 150\'000 CHF : IFD d\'environ 11\'700 CHF, soit un taux effectif de 7.8%.'
      },
      {
        id: 'bareme-ifd',
        title: 'Barème de l\'IFD pour les personnes physiques',
        content: `Le barème de l'IFD est fortement progressif avec 13 paliers différents. Les premiers revenus sont exonérés pour garantir le minimum vital, puis le taux augmente progressivement jusqu'au plafond constitutionnel.

Pour les célibataires, le barème 2024 prévoit :
- 0% jusqu'à 17'800 CHF
- 0.77% de 17'800 à 31'600 CHF  
- Progression jusqu'à 11.5% dès 755'200 CHF

Pour les couples mariés, les seuils sont environ 70% plus élevés, reflétant le principe du splitting intégral. Les déductions pour enfants s'élèvent à 6'600 CHF par enfant, directement sur le revenu imposable.`,
        keyPoints: [
          '13 paliers progressifs',
          'Exonération du minimum vital',
          'Splitting intégral pour couples',
          'Déduction enfants : 6\'600 CHF',
          'Barème révisé périodiquement (inflation)'
        ]
      }
    ],
    keywords: ['IFD', 'impôt fédéral', 'barème', 'taux', 'Confédération'],
    relatedConcepts: [
      { slug: 'systeme-fiscal-suisse', title: 'Système fiscal suisse' },
      { slug: 'baremes-progressivite', title: 'Barèmes et progressivité' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Article: TVA Suisse
  {
    slug: 'tva-suisse', 
    title: 'La TVA en Suisse',
    description: 'Guide complet de la TVA suisse : taux, assujettissement et obligations',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Impôts indirects',
    content: '',
    sections: [
      {
        id: 'principe-tva',
        title: 'Principe et fonctionnement de la TVA',
        content: `La taxe sur la valeur ajoutée (TVA) est un impôt général sur la consommation prélevé à chaque étape de la chaîne de production et de distribution. Avec un taux normal de 8.1%, la Suisse possède l'un des taux de TVA les plus bas d'Europe.

Le système repose sur le principe de la déduction de l'impôt préalable : les entreprises facturent la TVA à leurs clients et déduisent la TVA payée sur leurs achats. Seule la différence est versée à l'Administration fédérale des contributions.`,
        keyPoints: [
          'Impôt sur la consommation finale',
          'Taux normal : 8.1% (2.6% et 3.8% réduits)',
          'Système de déduction impôt préalable',
          '35% des recettes fédérales',
          'Neutralité économique pour entreprises'
        ]
      }
    ],
    keywords: ['TVA', 'taxe valeur ajoutée', 'taux', 'assujettissement'],
    relatedConcepts: [
      { slug: 'tva-assujettissement-entreprises', title: 'TVA pour entreprises' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Article: Impôt anticipé
  {
    slug: 'impot-anticipé',
    title: 'L\'impôt anticipé',
    description: 'Comprendre l\'impôt anticipé de 35% et sa récupération',
    category: 'Introduction à la fiscalité suisse', 
    subcategory: 'Impôts fédéraux',
    content: '',
    sections: [
      {
        id: 'principe-impot-anticipe',
        title: 'Principe de l\'impôt anticipé',
        content: `L'impôt anticipé est une retenue à la source de 35% prélevée sur certains revenus de capitaux mobiliers suisses. Son but principal est d'inciter les contribuables à déclarer correctement leurs revenus et leur fortune.

Cette retenue s'applique aux dividendes, intérêts bancaires (au-delà de 200 CHF), gains de loterie et certaines prestations d'assurance. L'impôt est directement retenu par le débiteur (banque, entreprise) et versé à l'Administration fédérale des contributions.`,
        keyPoints: [
          'Taux uniforme de 35%',
          'Retenue à la source sur revenus de capitaux',
          'But : inciter à la déclaration correcte',
          'Récupérable si déclaration complète',
          'Versé directement par le débiteur'
        ]
      }
    ],
    keywords: ['impôt anticipé', 'retenue source', '35%', 'dividendes'],
    relatedConcepts: [
      { slug: 'types-impots', title: 'Types d\'impôts' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Article: Déductions fiscales
  {
    slug: 'deductions-fiscales',
    title: 'Les déductions fiscales en détail',
    description: 'Guide exhaustif des déductions fiscales possibles pour les personnes physiques',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Déductions',
    content: '',
    sections: [
      {
        id: 'types-deductions',
        title: 'Types de déductions fiscales',
        content: `Les déductions fiscales se divisent en trois catégories principales : les déductions générales (automatiques), les déductions sociales (liées à la situation personnelle) et les déductions organiques (liées à l'acquisition du revenu).

Les déductions générales incluent les frais professionnels forfaitaires, les cotisations d'assurance et les intérêts de dettes. Les déductions sociales comprennent les déductions pour enfants, personnes à charge et situation familiale. Les déductions organiques concernent les frais réels nécessaires à l'obtention du revenu.`,
        keyPoints: [
          'Trois catégories de déductions',
          'Déductions générales automatiques',
          'Déductions sociales selon situation',
          'Déductions organiques pour revenus',
          'Cumul possible selon conditions'
        ]
      }
    ],
    keywords: ['déductions', 'frais', 'charges', 'économies'],
    relatedConcepts: [
      { slug: 'deductions-fiscales-principales', title: 'Déductions principales' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Article: Impôt à la source
  {
    slug: 'impot-source',
    title: 'L\'impôt à la source',
    description: 'Système d\'imposition à la source pour étrangers et frontaliers',
    category: 'Fiscalité internationale',
    subcategory: 'Imposition des non-résidents',
    content: '',
    sections: [
      {
        id: 'principe-impot-source',
        title: 'Principe de l\'impôt à la source',
        content: `L'impôt à la source est un système de perception directe de l'impôt sur les salaires des personnes étrangères sans permis C et des frontaliers. L'employeur retient directement l'impôt sur le salaire et le verse aux autorités fiscales.

Ce système simplifie la perception et garantit le paiement de l'impôt. Les taux sont fixés par barèmes cantonaux selon la situation familiale et incluent généralement les impôts fédéral, cantonal et communal. Une taxation ordinaire ultérieure est possible selon le revenu et le canton.`,
        keyPoints: [
          'Retenue directe sur salaire',
          'Étrangers sans permis C',
          'Frontaliers selon accords',
          'Barèmes selon situation familiale',
          'Taxation ordinaire possible dès 120\'000 CHF'
        ]
      }
    ],
    keywords: ['impôt source', 'étrangers', 'frontaliers', 'permis B'],
    relatedConcepts: [
      { slug: 'frontaliers-imposition', title: 'Imposition frontaliers' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Article: Barèmes d'imposition
  {
    slug: 'baremes-imposition',
    title: 'Les barèmes d\'imposition',
    description: 'Comprendre les barèmes progressifs et leur application',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Calcul de l\'impôt',
    content: '',
    sections: [
      {
        id: 'progressivite-bareme',
        title: 'La progressivité des barèmes',
        content: `Les barèmes d'imposition suisses appliquent une progressivité par paliers : plus le revenu augmente, plus le taux marginal est élevé. Cette progressivité vise à respecter le principe de la capacité contributive inscrit dans la Constitution.

Chaque canton fixe ses propres barèmes, créant des différences importantes. Certains cantons comme Zoug ou Schwyz ont des barèmes peu progressifs favorisant les hauts revenus, tandis que d'autres comme Genève ou Vaud appliquent une forte progressivité.`,
        keyPoints: [
          'Progressivité constitutionnelle',
          'Taux marginal croissant',
          'Différences cantonales importantes',
          'Splitting pour couples mariés',
          'Barèmes distincts fortune/revenu'
        ]
      }
    ],
    keywords: ['barème', 'progressivité', 'taux', 'paliers'],
    relatedConcepts: [
      { slug: 'baremes-progressivite', title: 'Barèmes et progressivité' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Article: Charges déductibles
  {
    slug: 'charges-deductibles',
    title: 'Les charges déductibles',
    description: 'Liste complète des charges déductibles du revenu imposable',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Déductions',
    content: '',
    sections: [
      {
        id: 'charges-admises',
        title: 'Charges déductibles admises',
        content: `Les charges déductibles permettent de réduire le revenu imposable et donc l'impôt. Les principales charges admises incluent les cotisations AVS/AI/APG/AC, les cotisations LPP et 3e pilier A, les frais professionnels, les intérêts de dettes privées et les pensions alimentaires versées.

Le montant des déductions est souvent plafonné. Par exemple, le 3e pilier A est limité à 7'056 CHF pour les salariés avec LPP. Les frais professionnels peuvent être forfaitaires (3% du salaire net, min 2'000, max 4'000 CHF) ou effectifs sur justificatifs.`,
        keyPoints: [
          'Cotisations sociales obligatoires',
          'Prévoyance 2e et 3e pilier',
          'Frais professionnels réels ou forfait',
          'Intérêts hypothécaires et dettes',
          'Plafonds selon type de déduction'
        ]
      }
    ],
    keywords: ['charges', 'déductions', 'frais déductibles'],
    relatedConcepts: [
      { slug: 'deductions-fiscales', title: 'Déductions fiscales' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Article: Souveraineté cantonale
  {
    slug: 'souverainete-cantonale',
    title: 'La souveraineté fiscale cantonale',
    description: 'Comprendre l\'autonomie des cantons en matière fiscale',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Fédéralisme fiscal',
    content: '',
    sections: [
      {
        id: 'principe-souverainete',
        title: 'Principe de souveraineté cantonale',
        content: `La souveraineté fiscale des cantons est un principe fondamental du fédéralisme suisse. Les 26 cantons disposent d'une large autonomie pour fixer leurs barèmes d'imposition, définir les déductions et organiser leur administration fiscale.

Cette autonomie découle de la Constitution qui attribue aux cantons une compétence générale en matière fiscale, la Confédération ne pouvant prélever que les impôts expressément prévus. Cette concurrence fiscale est vue comme un garant d'efficacité et de modération fiscale.`,
        keyPoints: [
          'Compétence fiscale générale des cantons',
          'Fixation libre des barèmes',
          'Administration fiscale propre',
          'Concurrence fiscale acceptée',
          'Harmonisation formelle seulement'
        ]
      }
    ],
    keywords: ['souveraineté', 'cantons', 'fédéralisme', 'autonomie'],
    relatedConcepts: [
      { slug: 'systeme-fiscal-suisse', title: 'Système fiscal suisse' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Reste des articles référencés manquants
  {
    slug: 'harmonisation-fiscale',
    title: 'L\'harmonisation fiscale (LHID)',
    description: 'La loi sur l\'harmonisation des impôts directs et ses implications',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Harmonisation',
    content: '',
    sections: [
      {
        id: 'principe-lhid',
        title: 'Principe de la LHID',
        content: `La Loi fédérale sur l'harmonisation des impôts directs (LHID) impose depuis 1993 aux cantons des règles communes pour l'assiette fiscale et les procédures, tout en préservant leur autonomie pour fixer les barèmes et taux d'imposition.

Cette harmonisation formelle facilite la mobilité intercantonale et réduit la complexité administrative, sans remettre en cause la concurrence fiscale qui reste un principe fondamental du fédéralisme suisse.`,
        keyPoints: [
          'Harmonisation formelle depuis 1993',
          'Assiette et procédures communes',
          'Barèmes restent cantonaux',
          'Facilite mobilité intercantonale'
        ]
      }
    ],
    keywords: ['LHID', 'harmonisation', 'cantons'],
    relatedConcepts: [{ slug: 'systeme-fiscal-suisse', title: 'Système fiscal' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'double-imposition',
    title: 'La double imposition',
    description: 'Éviter la double imposition intercantonale et internationale',
    category: 'Fiscalité internationale',
    subcategory: 'Double imposition',
    content: '',
    sections: [
      {
        id: 'principe-double-imposition',
        title: 'Principe de la double imposition',
        content: `La double imposition survient quand le même revenu est imposé par deux juridictions différentes. En Suisse, la Constitution interdit la double imposition intercantonale, garantissant qu'un revenu ne soit imposé que dans un seul canton.

Au niveau international, les conventions de double imposition (CDI) déterminent quel pays a le droit d'imposer selon le type de revenu et la résidence du contribuable.`,
        keyPoints: [
          'Interdite entre cantons suisses',
          'Conventions internationales (CDI)',
          'Règles d\'attribution claires',
          'Méthodes d\'élimination : exemption ou crédit'
        ]
      }
    ],
    keywords: ['double imposition', 'CDI', 'international'],
    relatedConcepts: [{ slug: 'conventions-double-imposition', title: 'Conventions CDI' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'assujettissement-fiscal',
    title: 'L\'assujettissement fiscal',
    description: 'Critères d\'assujettissement illimité et limité en Suisse',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Assujettissement',
    content: '',
    sections: [
      {
        id: 'types-assujettissement',
        title: 'Types d\'assujettissement',
        content: `L'assujettissement fiscal détermine l'étendue de l'obligation fiscale. L'assujettissement illimité s'applique aux résidents suisses sur leurs revenus mondiaux. L'assujettissement limité concerne les non-résidents uniquement sur leurs revenus de source suisse.

Le domicile fiscal se détermine selon le centre des intérêts vitaux, incluant la résidence principale, la famille, les activités professionnelles et les liens économiques.`,
        keyPoints: [
          'Illimité : résidents sur revenus mondiaux',
          'Limité : non-résidents sur revenus suisses',
          'Centre des intérêts vitaux déterminant',
          'Séjour > 90 jours = assujettissement'
        ]
      }
    ],
    keywords: ['assujettissement', 'domicile fiscal', 'résidence'],
    relatedConcepts: [{ slug: 'domicile-fiscal', title: 'Domicile fiscal' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'calcul-impot-revenu',
    title: 'Le calcul de l\'impôt sur le revenu',
    description: 'Méthode de calcul détaillée de l\'impôt sur le revenu',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Calcul',
    content: '',
    sections: [
      {
        id: 'etapes-calcul',
        title: 'Étapes du calcul',
        content: `Le calcul de l'impôt suit une méthodologie précise : détermination du revenu brut, soustraction des charges et déductions pour obtenir le revenu imposable, application du barème progressif, et ajout des coefficients communaux.

Le taux effectif diffère du taux marginal car seule la tranche supérieure est imposée au taux maximal. Les outils de calcul en ligne permettent d'estimer précisément l'impôt selon le canton et la commune.`,
        keyPoints: [
          'Revenu brut - déductions = revenu imposable',
          'Application barème progressif',
          'Ajout coefficients communaux',
          'Taux effectif < taux marginal'
        ]
      }
    ],
    keywords: ['calcul impôt', 'revenu imposable', 'barème'],
    relatedConcepts: [{ slug: 'baremes-imposition', title: 'Barèmes' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'impot-revenu-personnes',
    title: 'L\'impôt sur le revenu des personnes physiques',
    description: 'Vue d\'ensemble de l\'imposition du revenu',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Impôt sur le revenu',
    content: '',
    sections: [
      {
        id: 'principe-impot-revenu',
        title: 'Principe de l\'impôt sur le revenu',
        content: `L'impôt sur le revenu constitue la principale source de recettes fiscales. Il s'applique à l'ensemble des revenus du contribuable : salaires, revenus indépendants, rentes, revenus de la fortune et gains accessoires.

Le système applique une imposition globale avec progressivité, tenant compte de la capacité contributive par des déductions personnelles et sociales adaptées à la situation du contribuable.`,
        keyPoints: [
          'Imposition globale des revenus',
          'Progressivité du barème',
          'Déductions selon situation',
          'Perception aux trois niveaux'
        ]
      }
    ],
    keywords: ['impôt revenu', 'personnes physiques'],
    relatedConcepts: [{ slug: 'revenus-imposables-salaries', title: 'Revenus imposables' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'certificat-salaire',
    title: 'Le certificat de salaire',
    description: 'Document essentiel pour la déclaration fiscale',
    category: 'Déclaration et processus',
    subcategory: 'Documents',
    content: '',
    sections: [
      {
        id: 'contenu-certificat',
        title: 'Contenu du certificat de salaire',
        content: `Le certificat de salaire est établi par l'employeur et détaille tous les éléments de rémunération de l'année : salaire brut, déductions sociales, avantages en nature, frais remboursés et allocations diverses.

Ce document standardisé au niveau suisse facilite la déclaration et permet aux autorités de vérifier l'exactitude des revenus déclarés. Les erreurs doivent être corrigées avant la déclaration.`,
        keyPoints: [
          'Document obligatoire de l\'employeur',
          'Format standardisé suisse',
          'Base pour déclaration revenus',
          'Vérifier l\'exactitude avant déclaration'
        ]
      }
    ],
    keywords: ['certificat salaire', 'employeur', 'déclaration'],
    relatedConcepts: [{ slug: 'documents-necessaires-declaration', title: 'Documents nécessaires' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'frontaliers-fiscalite',
    title: 'Fiscalité des frontaliers',
    description: 'Règles spécifiques pour les travailleurs frontaliers',
    category: 'Fiscalité internationale',
    subcategory: 'Frontaliers',
    content: '',
    sections: [
      {
        id: 'statut-frontalier',
        title: 'Statut de frontalier',
        content: `Le statut de frontalier s'applique aux personnes résidant dans un pays voisin et travaillant en Suisse avec retour quotidien au domicile. Les accords bilatéraux déterminent les règles d'imposition selon le pays de résidence.

Avec la France, l'imposition se fait généralement en Suisse avec rétrocession partielle aux départements frontaliers. Avec l'Allemagne, l'Italie et l'Autriche, l'imposition se fait dans le pays de résidence sous conditions.`,
        keyPoints: [
          'Retour quotidien au domicile requis',
          'Accords spécifiques par pays',
          'Imposition source ou résidence',
          'Rétrocessions possibles'
        ]
      }
    ],
    keywords: ['frontaliers', 'cross-border', 'imposition'],
    relatedConcepts: [{ slug: 'frontaliers-imposition', title: 'Imposition frontaliers' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'gains-immobiliers',
    title: 'L\'imposition des gains immobiliers',
    description: 'Taxation des plus-values sur les transactions immobilières',
    category: 'Patrimoine et investissements',
    subcategory: 'Immobilier',
    content: '',
    sections: [
      {
        id: 'principe-gains-immobiliers',
        title: 'Principe de l\'impôt sur les gains immobiliers',
        content: `L'impôt sur les gains immobiliers frappe la plus-value réalisée lors de la vente d'un bien immobilier. Cet impôt cantonal remplace l'imposition ordinaire du gain en capital pour les personnes physiques.

Le taux dépend généralement de la durée de détention et du montant du gain. Plus la détention est longue, plus le taux est faible. Certains cantons exonèrent totalement après 20-25 ans de détention.`,
        keyPoints: [
          'Impôt cantonal sur plus-value',
          'Taux dégressif selon durée détention',
          'Exonération possible après 20-25 ans',
          'Report possible si réinvestissement'
        ]
      }
    ],
    keywords: ['gains immobiliers', 'plus-value', 'immobilier'],
    relatedConcepts: [{ slug: 'revenus-immobiliers-personnes-physiques', title: 'Revenus immobiliers' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'taux-marginal-effectif',
    title: 'Taux marginal vs taux effectif',
    description: 'Comprendre la différence entre taux marginal et taux effectif',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Concepts fiscaux',
    content: '',
    sections: [
      {
        id: 'difference-taux',
        title: 'Différence entre les taux',
        content: `Le taux marginal est le taux d'imposition sur le dernier franc gagné, correspondant à la tranche supérieure du barème. Le taux effectif est le rapport entre l'impôt total et le revenu imposable, toujours inférieur au taux marginal.

Cette distinction est cruciale pour les décisions financières : le taux marginal détermine l'impact fiscal d'un revenu supplémentaire, tandis que le taux effectif mesure la charge fiscale globale.`,
        keyPoints: [
          'Marginal : taux sur dernier franc',
          'Effectif : impôt total / revenu',
          'Effectif toujours < marginal',
          'Important pour planification fiscale'
        ]
      }
    ],
    keywords: ['taux marginal', 'taux effectif', 'progressivité'],
    relatedConcepts: [{ slug: 'baremes-progressivite', title: 'Barèmes progressifs' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'concurrence-fiscale',
    title: 'La concurrence fiscale intercantonale',
    description: 'Mécanismes et effets de la concurrence entre cantons',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Fédéralisme',
    content: '',
    sections: [
      {
        id: 'principe-concurrence',
        title: 'Principe de la concurrence fiscale',
        content: `La concurrence fiscale entre cantons est un élément central du fédéralisme suisse. Les cantons utilisent leur autonomie pour attirer contribuables et entreprises par des conditions fiscales favorables.

Cette concurrence est encadrée par la péréquation financière qui compense partiellement les disparités. Les critiques pointent les inégalités créées, les défenseurs soulignent l'efficience et la modération fiscale induites.`,
        keyPoints: [
          'Autonomie cantonale en matière fiscale',
          'Attraction contribuables/entreprises',
          'Péréquation financière compensatoire',
          'Débat efficience vs équité'
        ]
      }
    ],
    keywords: ['concurrence fiscale', 'cantons', 'fédéralisme'],
    relatedConcepts: [{ slug: 'comparatif-fiscal-cantonal', title: 'Comparatif cantonal' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'charges-deductibles-entreprises',
    title: 'Charges déductibles des entreprises',
    description: 'Les charges admises pour les indépendants et sociétés',
    category: 'Indépendants et entreprises',
    subcategory: 'Déductions',
    content: '',
    sections: [
      {
        id: 'charges-entreprises',
        title: 'Charges déductibles admises',
        content: `Les entreprises peuvent déduire toutes les charges justifiées par l'usage commercial. Cela inclut les salaires et charges sociales, les loyers, les frais généraux, les amortissements, les provisions justifiées et les intérêts passifs.

Le principe de causalité s'applique strictement : seules les dépenses nécessaires à l'acquisition du revenu sont déductibles. Les dépenses privées ou somptuaires sont exclues.`,
        keyPoints: [
          'Principe de causalité commercial',
          'Salaires et charges sociales',
          'Amortissements selon barèmes',
          'Provisions justifiées uniquement'
        ]
      }
    ],
    keywords: ['charges entreprises', 'déductions commerciales'],
    relatedConcepts: [{ slug: 'imposition-benefice-entreprises', title: 'Imposition du bénéfice' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'deductions-professionnelles',
    title: 'Les déductions professionnelles',
    description: 'Frais professionnels déductibles pour les salariés',
    category: 'Fiscalité des personnes physiques',
    subcategory: 'Déductions',
    content: '',
    sections: [
      {
        id: 'frais-professionnels',
        title: 'Frais professionnels déductibles',
        content: `Les salariés peuvent déduire les frais nécessaires à l'exercice de leur profession. Le choix existe entre le forfait (3% du salaire net, min 2'000, max 4'000 CHF) et les frais effectifs sur justificatifs.

Les frais effectifs incluent transport, repas hors domicile, vêtements professionnels, formation continue et outillage. Les frais de transport privé sont limités et le télétravail donne droit à des déductions spécifiques.`,
        keyPoints: [
          'Forfait ou frais effectifs',
          'Transport, repas, formation',
          'Justificatifs obligatoires si effectifs',
          'Déductions télétravail possibles'
        ]
      }
    ],
    keywords: ['frais professionnels', 'déductions salariés'],
    relatedConcepts: [{ slug: 'deductions-fiscales-principales', title: 'Déductions principales' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'deductions-immobilieres',
    title: 'Les déductions immobilières',
    description: 'Déductions liées à la propriété immobilière',
    category: 'Patrimoine et investissements',
    subcategory: 'Immobilier',
    content: '',
    sections: [
      {
        id: 'deductions-proprietaires',
        title: 'Déductions pour propriétaires',
        content: `Les propriétaires peuvent déduire les intérêts hypothécaires, les frais d'entretien et les frais d'administration de leurs biens immobiliers. La distinction entre entretien déductible et investissement non déductible est cruciale.

Le choix existe entre déduction forfaitaire (10-20% de la valeur locative selon l'âge du bien) et frais effectifs. Les travaux d'économie d'énergie bénéficient de déductions supplémentaires dans la plupart des cantons.`,
        keyPoints: [
          'Intérêts hypothécaires déductibles',
          'Entretien : forfait ou effectif',
          'Économies d\'énergie favorisées',
          'Plus-values non déductibles'
        ]
      }
    ],
    keywords: ['déductions immobilières', 'propriétaires', 'hypothèque'],
    relatedConcepts: [{ slug: 'valeur-locative-residence', title: 'Valeur locative' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'domicile-fiscal-choix',
    title: 'Le choix du domicile fiscal',
    description: 'Optimisation fiscale par le choix du domicile',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Planification',
    content: '',
    sections: [
      {
        id: 'optimisation-domicile',
        title: 'Optimisation par le domicile',
        content: `Le choix du domicile fiscal peut générer des économies substantielles compte tenu des différences intercantonales. Les cantons de Suisse centrale offrent généralement les conditions les plus favorables.

Ce choix doit être réel : le centre des intérêts vitaux doit effectivement se situer dans le canton choisi. Les autorités vérifient la réalité du domicile pour éviter les abus.`,
        keyPoints: [
          'Différences cantonales importantes',
          'Domicile réel obligatoire',
          'Centre intérêts vitaux déterminant',
          'Économies potentielles substantielles'
        ]
      }
    ],
    keywords: ['domicile fiscal', 'optimisation', 'déménagement'],
    relatedConcepts: [{ slug: 'domicile-fiscal', title: 'Domicile fiscal' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'tva-entreprises',
    title: 'La TVA pour les entreprises',
    description: 'Gestion pratique de la TVA en entreprise',
    category: 'Indépendants et entreprises',
    subcategory: 'TVA',
    content: '',
    sections: [
      {
        id: 'gestion-tva',
        title: 'Gestion de la TVA',
        content: `La gestion de la TVA requiert une comptabilité rigoureuse distinguant TVA collectée et impôt préalable. Les entreprises doivent respecter les obligations de facturation, déclaration et paiement.

Le choix de la méthode de décompte (effective ou forfaitaire) impacte la charge administrative et peut influencer le montant dû. Les erreurs de TVA peuvent coûter cher en rappels d'impôt et intérêts.`,
        keyPoints: [
          'Comptabilité TVA séparée',
          'Déclarations trimestrielles',
          'Méthode effective ou forfaitaire',
          'Pénalités si erreurs'
        ]
      }
    ],
    keywords: ['TVA entreprises', 'gestion TVA', 'déclaration'],
    relatedConcepts: [{ slug: 'tva-assujettissement-entreprises', title: 'Assujettissement TVA' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'taxation-processus',
    title: 'Le processus de taxation',
    description: 'Étapes de la taxation et voies de recours',
    category: 'Déclaration et processus',
    subcategory: 'Procédures',
    content: '',
    sections: [
      {
        id: 'etapes-taxation',
        title: 'Étapes du processus',
        content: `Le processus de taxation commence par le dépôt de la déclaration, suivi de l'examen par l'administration fiscale. La taxation provisoire est généralement émise dans les 6 mois, puis la taxation définitive après vérification complète.

Le contribuable dispose de 30 jours pour contester une décision de taxation par réclamation. Les voies de recours incluent ensuite le recours administratif et judiciaire.`,
        keyPoints: [
          'Déclaration → Examen → Taxation',
          'Provisoire puis définitive',
          'Réclamation sous 30 jours',
          'Voies de recours multiples'
        ]
      }
    ],
    keywords: ['taxation', 'processus fiscal', 'réclamation'],
    relatedConcepts: [{ slug: 'declaration-impots-delais', title: 'Délais déclaration' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'recours-fiscal',
    title: 'Les voies de recours fiscal',
    description: 'Contester une décision fiscale : procédures et délais',
    category: 'Déclaration et processus',
    subcategory: 'Recours',
    content: '',
    sections: [
      {
        id: 'voies-recours',
        title: 'Voies de recours disponibles',
        content: `La réclamation constitue la première étape pour contester une taxation. Elle doit être motivée et déposée dans les 30 jours. Si rejetée, le recours au tribunal cantonal est possible, puis au Tribunal fédéral en dernière instance.

Les frais augmentent à chaque niveau. L'assistance d'un conseiller fiscal est recommandée pour les cas complexes. Les délais sont stricts et leur non-respect entraîne l'irrecevabilité.`,
        keyPoints: [
          'Réclamation gratuite sous 30 jours',
          'Recours tribunal cantonal',
          'Tribunal fédéral en dernière instance',
          'Délais stricts impératifs'
        ]
      }
    ],
    keywords: ['recours', 'réclamation', 'contestation fiscale'],
    relatedConcepts: [{ slug: 'taxation-processus', title: 'Processus taxation' }],
    lastUpdated: new Date('2024-01-15')
  },

  {
    slug: 'troisieme-pilier-optimisation',
    title: 'Optimisation du 3e pilier',
    description: 'Stratégies avancées pour le 3e pilier A et B',
    category: 'Analyses et optimisation',
    subcategory: 'Prévoyance',
    content: '',
    sections: [
      {
        id: 'strategies-3e-pilier',
        title: 'Stratégies d\'optimisation',
        content: `L'optimisation du 3e pilier passe par la maximisation des versements déductibles, le choix judicieux entre 3a bancaire et assurance, et la planification des retraits échelonnés pour réduire la progressivité fiscale.

L'ouverture de plusieurs comptes 3a permet de retirer les avoirs sur plusieurs années. Le 3e pilier B offre plus de flexibilité mais sans déduction fiscale initiale. La coordination avec les rachats LPP optimise l'effet fiscal global.`,
        keyPoints: [
          'Maximiser versements annuels',
          'Plusieurs comptes pour retraits échelonnés',
          '3a vs 3b selon situation',
          'Coordination avec LPP'
        ]
      }
    ],
    keywords: ['3e pilier', 'optimisation prévoyance'],
    relatedConcepts: [{ slug: 'optimisation-troisieme-pilier', title: 'Optimisation 3e pilier' }],
    lastUpdated: new Date('2024-01-15')
  },

  // ========== ARTICLES "BIENTÔT DISPONIBLES" ==========

  // Introduction - Sources de revenus  
  {
    slug: 'sources-revenus',
    title: 'Les sources de revenus imposables',
    description: 'Classification complète des différents types de revenus soumis à l\'impôt',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Revenus imposables',
    content: '',
    sections: [
      {
        id: 'classification-revenus',
        title: 'Classification des revenus',
        content: `Les revenus imposables se divisent en plusieurs catégories principales selon leur origine et leur nature. La distinction est importante car elle détermine les modalités d'imposition et les déductions applicables.

**Revenus du travail :**
- Salaires et traitements (certificat de salaire)
- Revenus d'activité indépendante (bénéfice commercial)
- Tantièmes et jetons de présence
- Avantages en nature et prestations accessoires

**Revenus de la fortune :**
- Intérêts bancaires et obligataires
- Dividendes et distributions
- Revenus locatifs nets
- Redevances et royalties

**Revenus de remplacement :**
- Rentes AVS/AI/LPP
- Prestations d'assurance perte de gain
- Indemnités de chômage imposables
- Pensions alimentaires reçues`,
        keyPoints: [
          'Revenus du travail : salaires et indépendants',
          'Revenus de la fortune : intérêts, dividendes, loyers',
          'Revenus de remplacement : rentes et assurances',
          'Gains en capital généralement non imposables',
          'Classification détermine modalités d\'imposition'
        ],
        example: 'Un salarié avec 80\'000 CHF de salaire + 2\'000 CHF d\'intérêts bancaires + rente LPP 12\'000 CHF = 94\'000 CHF de revenus imposables totaux.'
      },
      {
        id: 'revenus-non-imposables',
        title: 'Revenus non imposables',
        content: `Certains revenus échappent à l'imposition selon des règles spécifiques. Cette exonération peut être totale ou partielle selon les circonstances.

**Gains en capital mobiliers :** Les plus-values sur titres sont généralement exonérées pour les particuliers, sauf activité commerciale (trading intensif).

**Prestations d'assurance :** Les capitaux d'assurance-vie, prestations d'assurance-maladie et accident ne sont pas imposables au bénéficiaire.

**Prestations sociales :** Allocations familiales, bourses d'études, prestations complémentaires AVS/AI, aide sociale.

**Autres exonérations :** Gains de loterie jusqu'à 1'000 CHF, libéralités reçues (successions, donations entre certaines personnes), dommages-intérêts.`,
        keyPoints: [
          'Gains en capital mobiliers exonérés',
          'Prestations d\'assurance non imposables',
          'Prestations sociales exonérées',
          'Seuil loterie : 1\'000 CHF',
          'Exceptions selon activité commerciale'
        ]
      }
    ],
    keywords: ['revenus imposables', 'sources revenus', 'classification fiscale'],
    relatedConcepts: [
      { slug: 'revenus-imposables-salaries', title: 'Revenus salariés' },
      { slug: 'impot-revenu-personnes', title: 'Impôt sur le revenu' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Introduction - Quotas et franchises
  {
    slug: 'quotas-franches',
    title: 'Quotas et franchises fiscales',
    description: 'Seuils d\'exonération et franchises dans le système fiscal suisse',
    category: 'Introduction à la fiscalité suisse',
    subcategory: 'Seuils et franchises',
    content: '',
    sections: [
      {
        id: 'franchises-principales',
        title: 'Principales franchises fiscales',
        content: `Le système fiscal suisse prévoit plusieurs seuils d'exonération pour garantir le minimum vital et simplifier l'administration fiscale.

**Franchises sur le revenu :**
- IFD : 17'800 CHF (célibataires), 30'800 CHF (couples mariés)
- Cantons : variables, généralement 6'000-15'000 CHF
- Communes : suivent généralement les seuils cantonaux

**Franchises sur la fortune :**
- IFD : 78'100 CHF (célibataires), 156'200 CHF (couples mariés)  
- Cantons : très variables, de 25'000 à 200'000 CHF

**Autres franchises :**
- Gains de loterie : 1'000 CHF
- Dons et libéralités : seuils variables par canton
- TVA : 100'000 CHF de chiffre d'affaires`,
        keyPoints: [
          'Garantissent le minimum vital',
          'Variables selon niveau fiscal',
          'Couples : franchises majorées',
          'Simplification administrative',
          'Révision périodique selon inflation'
        ]
      },
      {
        id: 'calcul-franchises',
        title: 'Application pratique des franchises',
        content: `Les franchises s'appliquent différemment selon le type d'impôt et la juridiction. Leur compréhension est essentielle pour optimiser sa situation fiscale.

Pour les revenus modestes, les franchises peuvent conduire à une exonération totale d'impôt. Les couples mariés bénéficient généralement de franchises majorées reflétant les charges familiales.

La coordination entre niveaux fiscaux peut créer des situations où l'impôt est dû à un niveau mais pas aux autres. Les franchises sont révisées périodiquement pour tenir compte de l'inflation.`,
        keyPoints: [
          'Application par niveau fiscal',
          'Exonération totale possible',
          'Couples : avantages substantiels',
          'Coordination entre niveaux',
          'Révision périodique inflation'
        ],
        example: 'Célibataire avec 15\'000 CHF de revenu : exonéré d\'IFD mais peut-être imposable au niveau cantonal selon le canton.'
      }
    ],
    keywords: ['franchises', 'seuils exonération', 'minimum vital'],
    relatedConcepts: [
      { slug: 'impot-federal-direct', title: 'Impôt fédéral direct' },
      { slug: 'baremes-progressivite', title: 'Barèmes progressifs' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Patrimoine - Biens de luxe
  {
    slug: 'biens-luxe-fiscalite',
    title: 'Fiscalité des biens de luxe',
    description: 'Imposition des œuvres d\'art, bijoux, voitures de collection et biens précieux',
    category: 'Patrimoine et investissements',
    subcategory: 'Biens de luxe',
    content: '',
    sections: [
      {
        id: 'definition-biens-luxe',
        title: 'Définition et classification',
        content: `Les biens de luxe regroupent les objets précieux détenus à titre de placement ou de collection : œuvres d'art, bijoux, montres de collection, voitures anciennes, vins fins, métaux précieux.

Leur particularité fiscale réside dans leur double nature : usage personnel et investissement. Cette dualité influence leur traitement fiscal, notamment pour l'impôt sur la fortune et les gains en capital.

La jurisprudence distingue les biens détenus pour l'usage personnel (mobilier de maison) de ceux constituant un placement (collection organisée, acquisition en vue de la revente).`,
        keyPoints: [
          'Double nature : usage et investissement',
          'Œuvres d\'art, bijoux, collections',
          'Voitures anciennes et vins fins',
          'Métaux précieux et montres',
          'Distinction usage/placement importante'
        ]
      },
      {
        id: 'imposition-fortune',
        title: 'Imposition à l\'impôt sur la fortune',
        content: `Les biens de luxe sont généralement soumis à l'impôt sur la fortune selon leur valeur vénale. L'évaluation pose souvent des difficultés pratiques nécessitant des expertises.

**Règles d'évaluation :**
- Valeur de marché au 31 décembre
- Expertise professionnelle si nécessaire
- Ventes récentes comparables
- Dépréciation selon état et âge

**Exonérations possibles :**
- Mobilier de ménage usage courant
- Objets personnels sans valeur commerciale
- Certains cantons exonèrent partiellement

Les collections importantes doivent faire l'objet d'un inventaire détaillé avec estimation professionnelle.`,
        keyPoints: [
          'Valeur vénale au 31.12',
          'Expertise si nécessaire',
          'Inventaire détaillé requis',
          'Exonérations usage personnel',
          'Dépréciation selon état'
        ]
      },
      {
        id: 'gains-capital-luxe',
        title: 'Gains en capital sur biens de luxe',
        content: `Les gains réalisés sur la vente de biens de luxe peuvent être imposables selon l'intention initiale d'acquisition et les circonstances de la vente.

**Critères d'imposition :**
- Intention commerciale à l'acquisition
- Fréquence des transactions
- Durée de détention
- Expertise professionnelle du vendeur

**Exonération pour usage personnel :**
Les biens acquis pour l'usage personnel et détenus durablement échappent généralement à l'imposition des gains.

**Cas particulier des métaux précieux :**
L'or physique sous forme de lingots ou pièces bénéficie souvent d'un traitement favorable.`,
        keyPoints: [
          'Intention à l\'achat déterminante',
          'Usage personnel généralement exonéré',
          'Fréquence transactions critère important',
          'Métaux précieux traitement spécial',
          'Jurisprudence case-by-case'
        ],
        example: 'Œuvre d\'art achetée 50\'000 CHF pour décorer son salon, vendue 80\'000 CHF après 10 ans : gain généralement non imposable.'
      }
    ],
    keywords: ['biens de luxe', 'œuvres art', 'collections', 'métaux précieux'],
    relatedConcepts: [
      { slug: 'impot-fortune-personnes-physiques', title: 'Impôt sur la fortune' },
      { slug: 'gains-immobiliers', title: 'Gains en capital' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // International - Expatriés et impatriés
  {
    slug: 'expatries-impatries-fiscalite',
    title: 'Fiscalité des expatriés et impatriés',
    description: 'Règles fiscales pour les personnes s\'installant en Suisse ou la quittant',
    category: 'Fiscalité internationale',
    subcategory: 'Expatriés et impatriés',
    content: '',
    sections: [
      {
        id: 'arrivee-suisse',
        title: 'Arrivée en Suisse (impatriés)',
        content: `L'installation en Suisse déclenche un assujettissement fiscal dès l'établissement du domicile ou d'un séjour de plus de 90 jours. La transition nécessite une planification fiscale soigneuse.

**Obligations dès l'arrivée :**
- Déclaration au contrôle des habitants
- Assujettissement fiscal immédiat
- Déclaration des revenus mondiaux
- Déclaration de la fortune mondiale

**Régimes spéciaux possibles :**
- Imposition forfaitaire pour fortune importante
- Accords particuliers selon nationalité
- Traitement spécial première année

La coordination avec le pays de départ est essentielle pour éviter la double imposition pendant la période de transition.`,
        keyPoints: [
          'Assujettissement dès installation',
          'Revenus mondiaux imposables',
          'Régimes spéciaux possibles',
          'Coordination pays de départ',
          'Planification transition essentielle'
        ]
      },
      {
        id: 'depart-suisse',
        title: 'Départ de Suisse (expatriés)',
        content: `Le départ de Suisse met fin à l'assujettissement illimité mais peut créer des obligations fiscales résiduelles. La sortie doit être planifiée pour optimiser l'impact fiscal.

**Fin d'assujettissement :**
- Radiation contrôle habitants
- Déclaration finale pro rata
- Liquidation position fiscale
- Remboursement acomptes excédentaires

**Obligations résiduelles :**
- Revenus source suisse restent imposables
- Biens immobiliers suisses
- Activité indépendante en Suisse

Le timing du départ peut influencer significativement la charge fiscale, notamment pour les stock-options et bonus différés.`,
        keyPoints: [
          'Radiation obligatoire',
          'Déclaration finale pro rata',
          'Revenus source suisse imposables',
          'Timing départ important',
          'Liquidation position fiscale'
        ]
      },
      {
        id: 'conventions-fiscales',
        title: 'Application des conventions fiscales',
        content: `Les conventions de double imposition régissent la répartition du droit d'imposer entre la Suisse et le pays de résidence antérieure ou future.

**Principes généraux :**
- Résidence fiscale déterminante
- Centre des intérêts vitaux
- Méthodes d'élimination double imposition
- Échange d'informations entre administrations

**Cas particuliers :**
- Revenus du travail dépendant
- Pensions et rentes de retraite
- Revenus immobiliers
- Gains en capital

La planification doit tenir compte des règles spécifiques de chaque convention pour optimiser la situation fiscale globale.`,
        keyPoints: [
          'Conventions déterminent répartition',
          'Résidence fiscale centrale',
          'Méthodes élimination double imposition',
          'Règles spécifiques par revenu',
          'Planification selon convention'
        ],
        example: 'Français s\'installant en Suisse : revenus français imposables en France, salaire suisse imposable en Suisse, élimination double imposition.'
      }
    ],
    keywords: ['expatriés', 'impatriés', 'installation Suisse', 'conventions fiscales'],
    relatedConcepts: [
      { slug: 'conventions-double-imposition', title: 'Conventions double imposition' },
      { slug: 'assujettissement-fiscal', title: 'Assujettissement fiscal' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // International - Comptes étrangers
  {
    slug: 'comptes-etrangers-fiscalite',
    title: 'Fiscalité des comptes étrangers',
    description: 'Obligations fiscales pour les comptes bancaires à l\'étranger',
    category: 'Fiscalité internationale',
    subcategory: 'Comptes étrangers',
    content: '',
    sections: [
      {
        id: 'obligations-declaration',
        title: 'Obligations de déclaration',
        content: `Les résidents suisses doivent déclarer tous leurs comptes et avoirs à l'étranger dans leur déclaration fiscale, quel que soit le montant. Cette obligation vise à lutter contre l'évasion fiscale et assurer l'imposition des revenus mondiaux.

La déclaration doit inclure les comptes bancaires, comptes d'épargne, comptes-titres, assurances-vie avec valeur de rachat et tout autre avoir financier. Les seuils de déclaration varient selon les accords avec les pays concernés.

Le non-respect de cette obligation constitue une soustraction d'impôt pouvant entraîner amendes et poursuites pénales. L'autodénonciation reste possible avec régularisation des impôts dus et intérêts.`,
        keyPoints: [
          'Déclaration obligatoire tous comptes',
          'Revenus mondiaux imposables',
          'Seuils selon accords pays',
          'Sanctions si non-déclaration',
          'Autodénonciation possible'
        ]
      }
    ],
    keywords: ['comptes étrangers', 'obligations fiscales', 'évasion fiscale'],
    relatedConcepts: [
      { slug: 'assujettissement-fiscal', title: 'Assujettissement fiscal' },
      { slug: 'conventions-double-imposition', title: 'Conventions fiscales' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Déclaration - Taxation et corrections
  {
    slug: 'taxation-corrections-fiscales',
    title: 'Taxation et corrections fiscales',
    description: 'Processus de taxation, révisions et corrections d\'erreurs',
    category: 'Déclaration et processus',
    subcategory: 'Taxation',
    content: '',
    sections: [
      {
        id: 'processus-taxation',
        title: 'Processus de taxation',
        content: `La taxation suit un processus standardisé : réception et vérification de la déclaration, taxation provisoire basée sur les éléments déclarés, puis taxation définitive après contrôles approfondis si nécessaire.

Les administrations fiscales peuvent demander des pièces justificatives, procéder à des estimations en cas d'éléments manquants, ou effectuer des contrôles sur place pour les entreprises. Le contribuable est informé à chaque étape et peut faire valoir ses observations.`,
        keyPoints: [
          'Taxation provisoire puis définitive',
          'Vérifications et justificatifs',
          'Estimations si éléments manquants',
          'Information contribuable obligatoire',
          'Droit observations garanti'
        ]
      }
    ],
    keywords: ['taxation', 'corrections fiscales', 'processus administratif'],
    relatedConcepts: [
      { slug: 'taxation-processus', title: 'Processus taxation' },
      { slug: 'recours-fiscal', title: 'Voies de recours' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Optimisation - Planification annuelle
  {
    slug: 'planification-fiscale-annuelle',
    title: 'Planification fiscale annuelle',
    description: 'Stratégies d\'optimisation fiscale sur l\'année civile',
    category: 'Analyses et optimisation',
    subcategory: 'Planification',
    content: '',
    sections: [
      {
        id: 'strategies-annuelles',
        title: 'Stratégies de fin d\'année',
        content: `La planification fiscale annuelle concentre les principales optimisations en fin d'année civile. Le timing des revenus et charges peut influencer significativement la facture fiscale.

**Actions de fin d'année :**
- Versements 3e pilier A avant le 31.12
- Rachats LPP si capacité disponible  
- Paiement charges déductibles (intérêts, primes)
- Report revenus extraordinaires si possible
- Réalisation pertes sur titres pour compensation

L'optimisation doit tenir compte de la situation pluriannuelle pour éviter un simple report de charge fiscale sans bénéfice réel.`,
        keyPoints: [
          'Concentration optimisations fin année',
          'Timing revenus/charges crucial',
          'Versements prévoyance avant 31.12',
          'Vision pluriannuelle nécessaire',
          'Coordination revenus exceptionnels'
        ]
      }
    ],
    keywords: ['planification annuelle', 'optimisation fiscale', 'fin d\'année'],
    relatedConcepts: [
      { slug: 'optimisation-fiscale-legale', title: 'Optimisation légale' },
      { slug: 'optimisation-troisieme-pilier', title: 'Optimisation 3e pilier' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Optimisation - Planification successorale
  {
    slug: 'planification-successorale-fiscale',
    title: 'Planification successorale et fiscalité',
    description: 'Optimisation fiscale des transmissions et successions',
    category: 'Analyses et optimisation',
    subcategory: 'Succession',
    content: '',
    sections: [
      {
        id: 'transmission-patrimoine',
        title: 'Transmission du patrimoine',
        content: `La planification successorale anticipe la transmission du patrimoine en optimisant l'impact fiscal pour le transmetteur et les bénéficiaires. Les règles varient fortement selon les cantons.

**Instruments de planification :**
- Donations entre vifs avec réserves
- Contrats de mariage et régimes matrimoniaux
- Pactes successoraux et testaments
- Structures sociétaires pour entreprises familiales

La coordination entre droits de succession cantonaux et imposition des revenus permet d'optimiser la transmission globale. Les aspects temporels et la résidence fiscale des parties sont déterminants.`,
        keyPoints: [
          'Anticipation transmission patrimoine',
          'Instruments juridiques variés',
          'Coordination droits succession/revenus',
          'Aspects temporels déterminants',
          'Résidence fiscale importante'
        ]
      }
    ],
    keywords: ['succession', 'transmission patrimoine', 'planification successorale'],
    relatedConcepts: [
      { slug: 'impot-fortune-personnes-physiques', title: 'Impôt fortune' },
      { slug: 'optimisation-fiscale-legale', title: 'Optimisation légale' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Cantons spécifiques - Vaud
  {
    slug: 'fiscalite-canton-vaud',
    title: 'Fiscalité du canton de Vaud',
    description: 'Spécificités fiscales et barèmes du canton de Vaud',
    category: 'Spécificités cantonales',
    subcategory: 'Canton de Vaud',
    content: '',
    sections: [
      {
        id: 'bareme-vaud',
        title: 'Barème fiscal vaudois',
        content: `Le canton de Vaud applique un barème progressif avec un taux maximal de 12.5% pour l'impôt cantonal. Le coefficient communal varie de 0.55 à 1.20 selon les communes, créant des différences importantes de charge fiscale.

**Caractéristiques principales :**
- Délai déclaration : 15 mars (plus court que fédéral)
- Splitting intégral pour couples mariés
- Déductions forfaitaires avantageuses
- Traitement favorable 3e pilier

La fiscalité vaudoise favorise les classes moyennes par des déductions importantes et un barème modérément progressif. Lausanne et Montreux figurent parmi les communes les plus imposées.`,
        keyPoints: [
          'Taux maximal cantonal : 12.5%',
          'Coefficients communaux 0.55-1.20',
          'Délai déclaration : 15 mars',
          'Déductions forfaitaires avantageuses',
          'Favorise classes moyennes'
        ]
      }
    ],
    keywords: ['Vaud', 'fiscalité cantonale', 'barème vaudois'],
    relatedConcepts: [
      { slug: 'comparatif-fiscal-cantonal', title: 'Comparatif cantonal' },
      { slug: 'baremes-progressivite', title: 'Barèmes progressifs' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Cantons spécifiques - Genève
  {
    slug: 'fiscalite-canton-geneve',
    title: 'Fiscalité du canton de Genève',
    description: 'Spécificités fiscales et barèmes du canton de Genève',
    category: 'Spécificités cantonales',
    subcategory: 'Canton de Genève',
    content: '',
    sections: [
      {
        id: 'bareme-geneve',
        title: 'Barème fiscal genevois',
        content: `Genève applique un des barèmes les plus progressifs de Suisse avec un taux cantonal maximal de 17.5%. La forte progressivité vise à assurer une redistribution importante.

**Spécificités genevoises :**
- Délai déclaration : 31 janvier (très court)
- Déduction forfaitaire frais professionnels élevée
- Barème très progressif défavorisant hauts revenus
- Imposition renforcée grandes fortunes

La position frontalière de Genève influence sa politique fiscale, devant équilibrer attractivité et financement des services publics dans un contexte de forte concurrence régionale.`,
        keyPoints: [
          'Taux maximal : 17.5% (élevé)',
          'Délai déclaration : 31 janvier',
          'Barème très progressif',
          'Déductions forfaitaires élevées',
          'Concurrence fiscale franco-suisse'
        ]
      }
    ],
    keywords: ['Genève', 'fiscalité cantonale', 'progressivité élevée'],
    relatedConcepts: [
      { slug: 'comparatif-fiscal-cantonal', title: 'Comparatif cantonal' },
      { slug: 'concurrence-fiscale', title: 'Concurrence fiscale' }
    ],
    lastUpdated: new Date('2024-01-15')
  },

  // Cantons spécifiques - Zurich
  {
    slug: 'fiscalite-canton-zurich',
    title: 'Fiscalité du canton de Zurich',
    description: 'Spécificités fiscales et barèmes du canton de Zurich',
    category: 'Spécificités cantonales',
    subcategory: 'Canton de Zurich',
    content: '',
    sections: [
      {
        id: 'bareme-zurich',
        title: 'Barème fiscal zurichois',
        content: `Zurich combine un barème cantonal modéré (taux maximal 11.5%) avec des coefficients communaux variables. La ville de Zurich reste attractive malgré sa taille grâce à une gestion fiscale équilibrée.

**Caractéristiques zurichergoises :**
- Barème modérément progressif
- Gestion administrative efficace
- Déductions standards généreuses  
- Traitement favorable entrepreneurs

En tant que capitale économique, Zurich maintient une fiscalité compétitive pour attirer entreprises et talents tout en finançant des infrastructures de qualité.`,
        keyPoints: [
          'Taux maximal modéré : 11.5%',
          'Gestion administrative efficace',
          'Fiscalité équilibrée',
          'Attractive pour entrepreneurs',
          'Capitale économique suisse'
        ]
      }
    ],
    keywords: ['Zurich', 'fiscalité cantonale', 'barème modéré'],
    relatedConcepts: [
      { slug: 'comparatif-fiscal-cantonal', title: 'Comparatif cantonal' },
      { slug: 'souverainete-cantonale', title: 'Souveraineté cantonale' }
    ],
    lastUpdated: new Date('2024-01-15')
  }
];

// Fonction pour rechercher des articles
export function searchArticles(query: string): Article[] {
  const searchTerm = query.toLowerCase();
  return articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm) ||
    article.keywords?.some(k => k.toLowerCase().includes(searchTerm)) ||
    article.content.toLowerCase().includes(searchTerm)
  );
}

// Fonction pour obtenir les articles d'une catégorie
export function getArticlesByCategory(category: string): Article[] {
  // Supprimer les emojis du titre de catégorie pour la comparaison
  const cleanCategory = category.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|🔹|👤|🏢|💼|🌍|📄|📊|🏛️/gu, '').trim();
  return articles.filter(article => article.category === cleanCategory);
}

// Fonction pour obtenir un article par slug
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug);
}

// Fonction pour obtenir les articles connexes
export function getRelatedArticles(article: Article): Article[] {
  const related: Article[] = [];
  
  // Articles de la même catégorie
  const sameCategory = articles.filter(a => 
    a.category === article.category && 
    a.slug !== article.slug
  ).slice(0, 2);
  related.push(...sameCategory);
  
  // Articles liés par concepts
  if (article.relatedConcepts) {
    article.relatedConcepts.forEach(concept => {
      const found = articles.find(a => a.slug === concept.slug);
      if (found && !related.includes(found)) {
        related.push(found);
      }
    });
  }
  
  return related.slice(0, 4);
}

// Traductions des articles - Articles multilingues
export const articleTranslations: ArticleTranslations = {
  'systeme-fiscal-suisse': {
    title: {
      fr: 'Le système fiscal suisse : Vue d\'ensemble',
      de: 'Das Schweizer Steuersystem: Überblick',
      it: 'Il sistema fiscale svizzero: Panoramica',
      en: 'The Swiss Tax System: Overview'
    },
    description: {
      fr: 'Comprendre la structure fédéraliste unique du système fiscal suisse avec ses trois niveaux d\'imposition',
      de: 'Verstehen Sie die einzigartige föderalistische Struktur des Schweizer Steuersystems mit seinen drei Besteuerungsebenen',
      it: 'Comprendere la struttura federalista unica del sistema fiscale svizzero con i suoi tre livelli di tassazione',
      en: 'Understanding the unique federalist structure of the Swiss tax system with its three levels of taxation'
    },
    content: {
      fr: 'Le système fiscal suisse se distingue par sa complexité et son caractère fédéraliste unique au monde. Cette architecture à trois niveaux - Confédération, cantons et communes - façonne l\'ensemble du paysage fiscal helvétique et influence directement la vie quotidienne de chaque contribuable.',
      de: 'Das Schweizer Steuersystem zeichnet sich durch seine weltweit einzigartige Komplexität und föderalistische Struktur aus. Diese dreistufige Architektur - Bund, Kantone und Gemeinden - prägt die gesamte schweizerische Steuerlandschaft und beeinflusst direkt das tägliche Leben jedes Steuerpflichtigen.',
      it: 'Il sistema fiscale svizzero si distingue per la sua complessità e il suo carattere federalista unico al mondo. Questa architettura a tre livelli - Confederazione, cantoni e comuni - modella l\'intero paesaggio fiscale elvetico e influenza direttamente la vita quotidiana di ogni contribuente.',
      en: 'The Swiss tax system is distinguished by its complexity and its federalist character that is unique in the world. This three-level architecture - Confederation, cantons and municipalities - shapes the entire Swiss tax landscape and directly influences the daily life of every taxpayer.'
    },
    sections: {
      'structure-federale': {
        title: {
          fr: 'Structure fédérale à trois niveaux',
          de: 'Dreistufige föderale Struktur',
          it: 'Struttura federale a tre livelli',
          en: 'Three-level federal structure'
        },
        content: {
          fr: 'Le système fiscal suisse est unique au monde par sa structure fédéraliste à trois niveaux. Contrairement à la plupart des pays qui ont un système centralisé, la Suisse répartit le pouvoir fiscal entre la Confédération, les 26 cantons et plus de 2\'000 communes.',
          de: 'Das Schweizer Steuersystem ist weltweit einzigartig durch seine dreistufige föderalistische Struktur. Im Gegensatz zu den meisten Ländern mit zentralisierten Systemen verteilt die Schweiz die Steuergewalt zwischen dem Bund, den 26 Kantonen und über 2\'000 Gemeinden.',
          it: 'Il sistema fiscale svizzero è unico al mondo per la sua struttura federalista a tre livelli. A differenza della maggior parte dei paesi che hanno un sistema centralizzato, la Svizzera distribuisce il potere fiscale tra la Confederazione, i 26 cantoni e oltre 2\'000 comuni.',
          en: 'The Swiss tax system is unique in the world due to its three-level federalist structure. Unlike most countries that have a centralized system, Switzerland distributes tax power between the Confederation, the 26 cantons and over 2,000 municipalities.'
        },
        keyPoints: {
          fr: 'Trois niveaux d\'imposition : Confédération, cantons, communes\nPrincipe de subsidiarité : les décisions sont prises au niveau le plus proche du citoyen\nSouveraineté fiscale partagée entre les différents niveaux\nPlus de 2\'000 systèmes fiscaux communaux différents',
          de: 'Drei Besteuerungsebenen: Bund, Kantone, Gemeinden\nSubsidiaritätsprinzip: Entscheidungen werden auf der bürgernächsten Ebene getroffen\nGeteilte Steuerhoheit zwischen den verschiedenen Ebenen\nÜber 2\'000 verschiedene Gemeindesteuer-systeme',
          it: 'Tre livelli di tassazione: Confederazione, cantoni, comuni\nPrincipio di sussidiarietà: le decisioni sono prese al livello più vicino al cittadino\nSovranità fiscale condivisa tra i diversi livelli\nOltre 2\'000 sistemi fiscali comunali diversi',
          en: 'Three levels of taxation: Confederation, cantons, municipalities\nSubsidiarity principle: decisions are made at the level closest to the citizen\nShared tax sovereignty between different levels\nMore than 2,000 different municipal tax systems'
        },
        example: {
          fr: 'Un habitant de Lausanne paie des impôts à trois niveaux : à la Confédération (IFD), au canton de Vaud (impôt cantonal) et à la commune de Lausanne (impôt communal calculé comme un multiple de l\'impôt cantonal).',
          de: 'Ein Einwohner von Lausanne zahlt Steuern auf drei Ebenen: an den Bund (DBG), an den Kanton Waadt (Kantonssteuer) und an die Gemeinde Lausanne (Gemeindesteuer berechnet als Vielfaches der Kantonssteuer).',
          it: 'Un abitante di Losanna paga le tasse a tre livelli: alla Confederazione (IFD), al cantone di Vaud (imposta cantonale) e al comune di Losanna (imposta comunale calcolata come multiplo dell\'imposta cantonale).',
          en: 'A resident of Lausanne pays taxes at three levels: to the Confederation (direct federal tax), to the canton of Vaud (cantonal tax) and to the municipality of Lausanne (municipal tax calculated as a multiple of the cantonal tax).'
        }
      },
      'repartition-competences': {
        title: {
          fr: 'Répartition des compétences fiscales',
          de: 'Aufteilung der Steuerkompetenzen',
          it: 'Ripartizione delle competenze fiscali',
          en: 'Distribution of tax competencies'
        },
        content: {
          fr: 'La Constitution fédérale définit précisément les compétences de chaque niveau. La Confédération ne peut prélever que les impôts expressément prévus par la Constitution, tandis que les cantons disposent d\'une compétence générale résiduelle.\n\nLes impôts exclusivement fédéraux incluent la TVA (8.1% taux normal), les droits de douane, l\'impôt sur le tabac et l\'alcool, ainsi que l\'impôt anticipé de 35% sur les revenus de capitaux. L\'impôt fédéral direct sur le revenu est plafonné constitutionnellement à 11.5%.\n\nLes cantons ont une grande liberté dans la fixation de leurs barèmes d\'imposition, ce qui crée une concurrence fiscale intercantonale. Cette concurrence est vue comme un élément positif du fédéralisme, incitant les cantons à une gestion efficace de leurs finances publiques.',
          de: 'Die Bundesverfassung definiert präzise die Kompetenzen jeder Ebene. Der Bund kann nur die in der Verfassung ausdrücklich vorgesehenen Steuern erheben, während die Kantone über eine allgemeine Restkompetenz verfügen.\n\nDie ausschließlich eidgenössischen Steuern umfassen die MWST (8,1% Normalsatz), Zölle, Tabak- und Alkoholsteuern sowie die Verrechnungssteuer von 35% auf Kapitalerträge. Die direkte Bundessteuer auf das Einkommen ist verfassungsrechtlich auf 11,5% begrenzt.\n\nDie Kantone haben große Freiheit bei der Festsetzung ihrer Steuertarife, was einen interkantonalen Steuerwettbewerb schafft. Dieser Wettbewerb wird als positives Element des Föderalismus gesehen und ermutigt die Kantone zu einer effizienten Verwaltung ihrer öffentlichen Finanzen.',
          it: 'La Costituzione federale definisce precisamente le competenze di ogni livello. La Confederazione può riscuotere solo le imposte espressamente previste dalla Costituzione, mentre i cantoni dispongono di una competenza generale residuale.\n\nLe imposte esclusivamente federali includono l\'IVA (8,1% aliquota normale), i dazi doganali, l\'imposta sul tabacco e sull\'alcol, nonché l\'imposta preventiva del 35% sui redditi da capitale. L\'imposta federale diretta sul reddito è limitata costituzionalmente all\'11,5%.\n\nI cantoni hanno grande libertà nella fissazione delle loro aliquote fiscali, il che crea una concorrenza fiscale intercantonale. Questa concorrenza è vista come un elemento positivo del federalismo, che incoraggia i cantoni a una gestione efficiente delle loro finanze pubbliche.',
          en: 'The Federal Constitution precisely defines the competencies of each level. The Confederation can only levy taxes expressly provided for in the Constitution, while the cantons have general residual competence.\n\nExclusively federal taxes include VAT (8.1% standard rate), customs duties, tobacco and alcohol taxes, as well as withholding tax of 35% on capital income. The direct federal income tax is constitutionally capped at 11.5%.\n\nCantons have great freedom in setting their tax scales, which creates intercantonal tax competition. This competition is seen as a positive element of federalism, encouraging cantons to efficiently manage their public finances.'
        },
        keyPoints: {
          fr: 'La Confédération a des compétences limitées définies par la Constitution\nLes cantons ont la compétence résiduelle en matière fiscale\nLa concurrence fiscale intercantonale est un principe accepté\nLes communes dépendent largement des cantons pour leurs compétences',
          de: 'Der Bund hat begrenzte, durch die Verfassung definierte Kompetenzen\nKantone haben die Restkompetenz in Steuerfragen\nInterkantonaler Steuerwettbewerb ist ein akzeptiertes Prinzip\nGemeinden sind bei ihren Kompetenzen stark von den Kantonen abhängig',
          it: 'La Confederazione ha competenze limitate definite dalla Costituzione\nI cantoni hanno la competenza residuale in materia fiscale\nLa concorrenza fiscale intercantonale è un principio accettato\nI comuni dipendono largamente dai cantoni per le loro competenze',
          en: 'The Confederation has limited competencies defined by the Constitution\nCantons have residual competence in tax matters\nIntercantonal tax competition is an accepted principle\nMunicipalities depend largely on cantons for their competencies'
        }
      },
      'harmonisation-fiscale': {
        title: {
          fr: 'Harmonisation fiscale',
          de: 'Steuerharmonisierung',
          it: 'Armonizzazione fiscale',
          en: 'Tax harmonization'
        },
        content: {
          fr: 'Depuis 1993, la Loi fédérale sur l\'harmonisation des impôts directs (LHID) impose aux cantons certaines règles communes. Cette harmonisation porte sur l\'assiette fiscale (ce qui est imposable), les déductions autorisées et les procédures, mais pas sur les tarifs et barèmes qui restent de la compétence cantonale.\n\nL\'harmonisation formelle signifie que tous les cantons doivent utiliser les mêmes définitions pour le revenu imposable, les mêmes périodes fiscales et des procédures similaires. Cela facilite la mobilité intercantonale et réduit les coûts administratifs.\n\nCependant, l\'harmonisation matérielle (des taux) a toujours été rejetée politiquement, car elle remettrait en cause la souveraineté cantonale et la concurrence fiscale, considérées comme des piliers du système suisse.',
          de: 'Seit 1993 schreibt das Bundesgesetz über die Harmonisierung der direkten Steuern (StHG) den Kantonen bestimmte gemeinsame Regeln vor. Diese Harmonisierung betrifft die Steuerbemessungsgrundlage (was steuerpflichtig ist), die zulässigen Abzüge und die Verfahren, aber nicht die Tarife und Steuersätze, die in kantonaler Kompetenz bleiben.\n\nFormelle Harmonisierung bedeutet, dass alle Kantone dieselben Definitionen für das steuerbare Einkommen, dieselben Steuerperioden und ähnliche Verfahren verwenden müssen. Dies erleichtert die interkantonale Mobilität und reduziert die Verwaltungskosten.\n\nDie materielle Harmonisierung (der Steuersätze) wurde jedoch immer politisch abgelehnt, da sie die kantonale Souveränität und den Steuerwettbewerb in Frage stellen würde, die als Säulen des schweizerischen Systems gelten.',
          it: 'Dal 1993, la Legge federale sull\'armonizzazione delle imposte dirette (LAID) impone ai cantoni certe regole comuni. Questa armonizzazione riguarda la base imponibile (ciò che è tassabile), le detrazioni autorizzate e le procedure, ma non le aliquote e i baremi che rimangono di competenza cantonale.\n\nL\'armonizzazione formale significa che tutti i cantoni devono utilizzare le stesse definizioni per il reddito imponibile, gli stessi periodi fiscali e procedure simili. Ciò facilita la mobilità intercantonale e riduce i costi amministrativi.\n\nTuttavia, l\'armonizzazione materiale (delle aliquote) è sempre stata respinta politicamente, poiché metterebbe in discussione la sovranità cantonale e la concorrenza fiscale, considerate pilastri del sistema svizzero.',
          en: 'Since 1993, the Federal Law on the Harmonization of Direct Taxes (LHID) imposes certain common rules on the cantons. This harmonization covers the tax base (what is taxable), authorized deductions and procedures, but not rates and scales which remain under cantonal competence.\n\nFormal harmonization means that all cantons must use the same definitions for taxable income, the same tax periods and similar procedures. This facilitates intercantonal mobility and reduces administrative costs.\n\nHowever, material harmonization (of rates) has always been politically rejected, as it would call into question cantonal sovereignty and tax competition, considered pillars of the Swiss system.'
        },
        keyPoints: {
          fr: 'Harmonisation formelle depuis 1993 avec la LHID\nDéfinitions communes du revenu et des déductions\nLes taux et barèmes restent de compétence cantonale\nÉquilibre entre harmonisation et souveraineté cantonale',
          de: 'Formelle Harmonisierung seit 1993 mit dem StHG\nGemeinsame Definitionen von Einkommen und Abzügen\nSteuersätze und -tarife bleiben kantonale Kompetenz\nGleichgewicht zwischen Harmonisierung und kantonaler Souveränität',
          it: 'Armonizzazione formale dal 1993 con la LAID\nDefinizioni comuni del reddito e delle detrazioni\nLe aliquote e i baremi rimangono di competenza cantonale\nEquilibrio tra armonizzazione e sovranità cantonale',
          en: 'Formal harmonization since 1993 with LHID\nCommon definitions of income and deductions\nRates and scales remain cantonal competence\nBalance between harmonization and cantonal sovereignty'
        }
      },
      'avantages-defis': {
        title: {
          fr: 'Avantages et défis du système',
          de: 'Vor- und Nachteile des Systems',
          it: 'Vantaggi e sfide del sistema',
          en: 'Advantages and challenges of the system'
        },
        content: {
          fr: 'Le fédéralisme fiscal suisse présente des avantages uniques : proximité avec les citoyens, adaptation aux besoins locaux, efficacité par la concurrence, et innovation fiscale. Les cantons peuvent expérimenter de nouvelles approches qui, si elles sont couronnées de succès, peuvent être adoptées ailleurs.\n\nLes défis incluent la complexité administrative, les inégalités entre régions riches et pauvres, et la difficulté de coordination pour les projets nationaux. Le système de péréquation financière, réformé en 2008, vise à réduire les disparités excessives entre cantons.\n\nPour les contribuables, notamment les entreprises et les expatriés, cette complexité peut représenter un défi mais aussi une opportunité d\'optimisation fiscale légale par le choix judicieux du lieu de résidence ou d\'établissement.',
          de: 'Der schweizerische Steuerföderalismus weist einzigartige Vorteile auf: Bürgernähe, Anpassung an lokale Bedürfnisse, Effizienz durch Wettbewerb und steuerliche Innovation. Kantone können neue Ansätze ausprobieren, die bei Erfolg anderswo übernommen werden können.\n\nHerausforderungen umfassen administrative Komplexität, Ungleichheiten zwischen reichen und armen Regionen und Schwierigkeiten bei der Koordination nationaler Projekte. Das 2008 reformierte Finanzausgleichssystem zielt darauf ab, übermäßige Disparitäten zwischen Kantonen zu reduzieren.\n\nFür Steuerpflichtige, insbesondere Unternehmen und Expatriates, kann diese Komplexität eine Herausforderung darstellen, aber auch eine Gelegenheit für legale Steueroptimierung durch die geschickte Wahl des Wohn- oder Geschäftssitzes.',
          it: 'Il federalismo fiscale svizzero presenta vantaggi unici: vicinanza ai cittadini, adattamento alle esigenze locali, efficienza attraverso la concorrenza e innovazione fiscale. I cantoni possono sperimentare nuovi approcci che, se coronati da successo, possono essere adottati altrove.\n\nLe sfide includono la complessità amministrativa, le disuguaglianze tra regioni ricche e povere e la difficoltà di coordinamento per i progetti nazionali. Il sistema di perequazione finanziaria, riformato nel 2008, mira a ridurre le disparità eccessive tra cantoni.\n\nPer i contribuenti, in particolare le imprese e gli espatriati, questa complessità può rappresentare una sfida ma anche un\'opportunità di ottimizzazione fiscale legale attraverso la scelta giudiziosa del luogo di residenza o di stabilimento.',
          en: 'Swiss fiscal federalism has unique advantages: proximity to citizens, adaptation to local needs, efficiency through competition, and tax innovation. Cantons can experiment with new approaches that, if successful, can be adopted elsewhere.\n\nChallenges include administrative complexity, inequalities between rich and poor regions, and difficulty coordinating national projects. The financial equalization system, reformed in 2008, aims to reduce excessive disparities between cantons.\n\nFor taxpayers, particularly businesses and expatriates, this complexity can represent a challenge but also an opportunity for legal tax optimization through judicious choice of residence or establishment location.'
        },
        keyPoints: {
          fr: 'Avantages : proximité, efficacité, innovation\nDéfis : complexité, inégalités, coordination\nPéréquation financière pour réduire les disparités\nOpportunités d\'optimisation fiscale légale',
          de: 'Vorteile: Bürgernähe, Effizienz, Innovation\nHerausforderungen: Komplexität, Ungleichheiten, Koordination\nFinanzausgleich zur Verringerung der Disparitäten\nMöglichkeiten legaler Steueroptimierung',
          it: 'Vantaggi: vicinanza, efficienza, innovazione\nSfide: complessità, disuguaglianze, coordinamento\nPerequazione finanziaria per ridurre le disparità\nOpportunità di ottimizzazione fiscale legale',
          en: 'Advantages: proximity, efficiency, innovation\nChallenges: complexity, inequalities, coordination\nFinancial equalization to reduce disparities\nOpportunities for legal tax optimization'
        },
        example: {
          fr: 'Le canton de Zoug a innové avec des taux très compétitifs pour attirer les entreprises, forçant d\'autres cantons à repenser leur stratégie fiscale. Cette concurrence a globalement conduit à une baisse de la charge fiscale sur les entreprises en Suisse.',
          de: 'Der Kanton Zug hat mit sehr wettbewerbsfähigen Steuersätzen innoviert, um Unternehmen anzuziehen, und andere Kantone dazu gedrängt, ihre Steuerstrategie zu überdenken. Dieser Wettbewerb hat insgesamt zu einer Senkung der Steuerbelastung für Unternehmen in der Schweiz geführt.',
          it: 'Il cantone di Zugo ha innovato con aliquote molto competitive per attrarre le imprese, costringendo altri cantoni a ripensare la loro strategia fiscale. Questa concorrenza ha globalmente portato a una riduzione del carico fiscale sulle imprese in Svizzera.',
          en: 'The canton of Zug has innovated with very competitive rates to attract businesses, forcing other cantons to rethink their tax strategy. This competition has globally led to a reduction in the tax burden on businesses in Switzerland.'
        }
      }
    }
  },
  'bases-legales-fiscalite': {
    title: {
      fr: 'Les bases légales du droit fiscal suisse',
      de: 'Die rechtlichen Grundlagen des Schweizer Steuerrechts',
      it: 'Le basi legali del diritto fiscale svizzero',
      en: 'The legal foundations of Swiss tax law'
    },
    description: {
      fr: 'Aperçu des principales lois qui régissent le système fiscal suisse : LIFD, LHID, LTVA et autres textes fondamentaux',
      de: 'Überblick über die wichtigsten Gesetze des Schweizer Steuersystems: DBG, StHG, MWSTG und andere Grundlagentexte',
      it: 'Panoramica delle principali leggi che disciplinano il sistema fiscale svizzero: LIFD, LAID, LIVA e altri testi fondamentali',
      en: 'Overview of the main laws governing the Swiss tax system: FIFD, THLA, VAT and other fundamental texts'
    },
    content: {
      fr: '',
      de: '',
      it: '',
      en: ''
    },
    sections: {
      'hierarchie-normes': {
        title: {
          fr: 'Hiérarchie des normes fiscales',
          de: 'Hierarchie der Steuernormen',
          it: 'Gerarchia delle norme fiscali',
          en: 'Hierarchy of tax norms'
        },
        content: {
          fr: 'Le droit fiscal suisse s\'organise selon une hiérarchie stricte des normes juridiques. Au sommet se trouve la Constitution fédérale qui définit les compétences de base et les principes fondamentaux comme l\'égalité devant l\'impôt et la capacité contributive.\n\nLes lois fédérales, adoptées par le Parlement, concrétisent ces principes constitutionnels. Les principales sont la LIFD (Loi sur l\'impôt fédéral direct), la LHID (harmonisation), la LTVA (TVA), et la LIA (impôt anticipé).\n\nLes ordonnances du Conseil fédéral et les circulaires de l\'Administration fédérale des contributions (AFC) complètent ce dispositif en précisant les modalités d\'application. Bien que les circulaires n\'aient pas force de loi, elles sont généralement suivies par les administrations et les tribunaux.\n\nAu niveau cantonal, chaque canton dispose de sa propre loi fiscale, qui doit respecter le cadre de la LHID pour les impôts directs. Les communes édictent des règlements dans le cadre défini par leur canton.',
          de: 'Das Schweizer Steuerrecht ist nach einer strengen Hierarchie rechtlicher Normen organisiert. An der Spitze steht die Bundesverfassung, die die grundlegenden Kompetenzen und Grundprinzipien wie die Gleichbehandlung bei der Besteuerung und die wirtschaftliche Leistungsfähigkeit definiert.\n\nBundesgesetze, die vom Parlament verabschiedet werden, konkretisieren diese verfassungsmäßigen Prinzipien. Die wichtigsten sind das DBG (Bundesgesetz über die direkte Bundessteuer), das StHG (Harmonisierung), das MWSTG (Mehrwertsteuer) und das VStG (Verrechnungssteuer).\n\nVerordnungen des Bundesrates und Kreisschreiben der Eidgenössischen Steuerverwaltung (ESTV) ergänzen dieses System durch Präzisierung der Anwendungsmodalitäten. Obwohl Kreisschreiben keine Gesetzeskraft haben, werden sie im Allgemeinen von Verwaltungen und Gerichten befolgt.\n\nAuf kantonaler Ebene verfügt jeder Kanton über sein eigenes Steuergesetz, das den Rahmen des StHG für direkte Steuern einhalten muss. Gemeinden erlassen Verordnungen im von ihrem Kanton definierten Rahmen.',
          it: 'Il diritto fiscale svizzero è organizzato secondo una gerarchia rigorosa delle norme giuridiche. Al vertice si trova la Costituzione federale che definisce le competenze di base e i principi fondamentali come l\'uguaglianza davanti all\'imposta e la capacità contributiva.\n\nLe leggi federali, adottate dal Parlamento, concretizzano questi principi costituzionali. Le principali sono la LIFD (Legge sull\'imposta federale diretta), la LAID (armonizzazione), la LIVA (IVA) e la LIA (imposta preventiva).\n\nLe ordinanze del Consiglio federale e le circolari dell\'Amministrazione federale delle contribuzioni (AFC) completano questo dispositivo precisando le modalità di applicazione. Benché le circolari non abbiano forza di legge, sono generalmente seguite dalle amministrazioni e dai tribunali.\n\nA livello cantonale, ogni cantone dispone della propria legge fiscale, che deve rispettare il quadro della LAID per le imposte dirette. I comuni emanano regolamenti nel quadro definito dal loro cantone.',
          en: 'Swiss tax law is organized according to a strict hierarchy of legal norms. At the top is the Federal Constitution which defines basic competencies and fundamental principles such as equality before taxation and contributive capacity.\n\nFederal laws, adopted by Parliament, implement these constitutional principles. The main ones are the FIFD (Federal Act on Direct Federal Tax), the THLA (harmonization), the VAT (Value Added Tax), and the WITA (withholding tax).\n\nFederal Council ordinances and circulars from the Federal Tax Administration (FTA) complete this system by specifying implementation procedures. Although circulars do not have the force of law, they are generally followed by administrations and courts.\n\nAt the cantonal level, each canton has its own tax law, which must respect the THLA framework for direct taxes. Municipalities enact regulations within the framework defined by their canton.'
        },
        keyPoints: {
          fr: 'Constitution fédérale au sommet de la hiérarchie\nLois fédérales pour chaque type d\'impôt\nOrdonnances et circulaires pour l\'application\nLois cantonales dans le respect de la LHID\nRèglements communaux selon le droit cantonal',
          de: 'Bundesverfassung an der Spitze der Hierarchie\nBundesgesetze für jeden Steuertyp\nVerordnungen und Kreisschreiben für die Anwendung\nKantonale Gesetze unter Einhaltung des StHG\nGemeindeverordnungen nach kantonalem Recht',
          it: 'Costituzione federale al vertice della gerarchia\nLeggi federali per ogni tipo di imposta\nOrdinanze e circolari per l\'applicazione\nLeggi cantonali nel rispetto della LAID\nRegolamenti comunali secondo il diritto cantonale',
          en: 'Federal Constitution at the top of the hierarchy\nFederal laws for each type of tax\nOrdinances and circulars for implementation\nCantonal laws respecting the THLA\nMunicipal regulations according to cantonal law'
        }
      },
      'lifd': {
        title: {
          fr: 'LIFD - Loi sur l\'impôt fédéral direct',
          de: 'DBG - Bundesgesetz über die direkte Bundessteuer',
          it: 'LIFD - Legge sull\'imposta federale diretta',
          en: 'FIFD - Federal Act on Direct Federal Tax'
        },
        content: {
          fr: 'La LIFD régit l\'impôt fédéral direct sur le revenu des personnes physiques et le bénéfice des personnes morales. C\'est l\'une des lois fiscales les plus importantes, car elle définit de nombreux concepts repris par les cantons.\n\nPour les personnes physiques, la LIFD établit un barème progressif plafonné à 11.5% (taux marginal maximal). Elle définit précisément ce qui constitue un revenu imposable, les déductions autorisées, et les procédures de taxation.\n\nPour les personnes morales, elle fixe un taux unique de 8.5% sur le bénéfice. La loi contient également des dispositions importantes sur la détermination du bénéfice imposable, les participations, et les restructurations.\n\nLa LIFD sert souvent de modèle pour les lois cantonales, créant une certaine uniformité malgré le fédéralisme. Les tribunaux s\'y réfèrent fréquemment pour interpréter les lois cantonales.',
          de: 'Das DBG regelt die direkte Bundessteuer auf das Einkommen natürlicher Personen und den Gewinn juristischer Personen. Es ist eines der wichtigsten Steuergesetze, da es viele von den Kantonen übernommene Konzepte definiert.\n\nFür natürliche Personen stellt das DBG eine progressive Skala mit einer Obergrenze von 11,5% (maximaler Grenzsteuersatz) auf. Es definiert genau, was steuerpflichtiges Einkommen ausmacht, zulässige Abzüge und Veranlagungsverfahren.\n\nFür juristische Personen legt es einen einheitlichen Satz von 8,5% auf den Gewinn fest. Das Gesetz enthält auch wichtige Bestimmungen zur Bestimmung des steuerpflichtigen Gewinns, zu Beteiligungen und Umstrukturierungen.\n\nDas DBG dient oft als Modell für kantonale Gesetze und schafft trotz des Föderalismus eine gewisse Einheitlichkeit. Gerichte beziehen sich häufig darauf bei der Auslegung kantonaler Gesetze.',
          it: 'La LIFD disciplina l\'imposta federale diretta sul reddito delle persone fisiche e l\'utile delle persone giuridiche. È una delle leggi fiscali più importanti, poiché definisce numerosi concetti ripresi dai cantoni.\n\nPer le persone fisiche, la LIFD stabilisce una scala progressiva limitata all\'11,5% (aliquota marginale massima). Definisce precisamente ciò che costituisce reddito imponibile, le detrazioni autorizzate e le procedure di tassazione.\n\nPer le persone giuridiche, fissa un\'aliquota unica dell\'8,5% sull\'utile. La legge contiene anche disposizioni importanti sulla determinazione dell\'utile imponibile, le partecipazioni e le ristrutturazioni.\n\nLa LIFD serve spesso da modello per le leggi cantonali, creando una certa uniformità nonostante il federalismo. I tribunali vi si riferiscono frequentemente per interpretare le leggi cantonali.',
          en: 'The FIFD governs direct federal tax on income of natural persons and profit of legal entities. It is one of the most important tax laws, as it defines many concepts adopted by the cantons.\n\nFor natural persons, the FIFD establishes a progressive scale capped at 11.5% (maximum marginal rate). It precisely defines what constitutes taxable income, authorized deductions, and taxation procedures.\n\nFor legal entities, it sets a single rate of 8.5% on profit. The law also contains important provisions on determining taxable profit, participations, and restructurings.\n\nThe FIFD often serves as a model for cantonal laws, creating some uniformity despite federalism. Courts frequently refer to it when interpreting cantonal laws.'
        },
        keyPoints: {
          fr: 'Impôt fédéral direct sur revenu et bénéfice\nTaux maximum 11.5% pour les personnes physiques\nTaux unique 8.5% pour les sociétés\nModèle pour les législations cantonales\nDéfinitions précises des concepts fiscaux',
          de: 'Direkte Bundessteuer auf Einkommen und Gewinn\nMaximalsatz 11,5% für natürliche Personen\nEinheitssatz 8,5% für Gesellschaften\nModell für kantonale Gesetzgebungen\nPräzise Definitionen steuerlicher Konzepte',
          it: 'Imposta federale diretta su reddito e utile\nAliquota massima 11,5% per le persone fisiche\nAliquota unica 8,5% per le società\nModello per le legislazioni cantonali\nDefinizioni precise dei concetti fiscali',
          en: 'Direct federal tax on income and profit\nMaximum rate 11.5% for natural persons\nSingle rate 8.5% for companies\nModel for cantonal legislations\nPrecise definitions of tax concepts'
        },
        example: {
          fr: 'La définition du "revenu d\'activité indépendante" dans la LIFD est reprise par tous les cantons, assurant une application uniforme de ce concept important.',
          de: 'Die Definition des "Einkommens aus selbständiger Erwerbstätigkeit" im DBG wird von allen Kantonen übernommen und gewährleistet eine einheitliche Anwendung dieses wichtigen Konzepts.',
          it: 'La definizione del "reddito da attività indipendente" nella LIFD è ripresa da tutti i cantoni, garantendo un\'applicazione uniforme di questo concetto importante.',
          en: 'The definition of "income from self-employment" in the FIFD is adopted by all cantons, ensuring uniform application of this important concept.'
        }
      },
      'lhid': {
        title: {
          fr: 'LHID - Loi sur l\'harmonisation',
          de: 'StHG - Steuerharmonisierungsgesetz',
          it: 'LAID - Legge sull\'armonizzazione',
          en: 'THLA - Tax Harmonization Law'
        },
        content: {
          fr: 'La LHID, entrée en vigueur en 1993, constitue un tournant dans l\'histoire fiscale suisse. Elle impose aux 26 cantons un cadre commun pour leurs impôts directs, tout en préservant leur souveraineté sur les taux.\n\nL\'harmonisation porte sur l\'assujettissement (qui doit payer), l\'objet de l\'impôt (sur quoi), la procédure, et le droit pénal fiscal. Les cantons ont eu jusqu\'en 2001 pour adapter leurs législations.\n\nLa loi définit 16 déductions obligatoires que tous les cantons doivent accorder, comme les cotisations AVS/AI/APG, les frais professionnels, ou les versements au 3e pilier. Les cantons peuvent accorder des déductions supplémentaires.\n\nCette harmonisation facilite grandement la mobilité intercantonale et réduit les coûts de conformité pour les entreprises actives dans plusieurs cantons. Elle a aussi permis l\'échange d\'informations entre administrations fiscales cantonales.',
          de: 'Das StHG, das 1993 in Kraft trat, stellt einen Wendepunkt in der Schweizer Steuergeschichte dar. Es verpflichtet die 26 Kantone zu einem gemeinsamen Rahmen für ihre direkten Steuern, während ihre Souveränität über die Steuersätze erhalten bleibt.\n\nDie Harmonisierung betrifft die Steuerpflicht (wer zahlen muss), den Steuergegenstand (worauf), das Verfahren und das Steuerstrafrecht. Die Kantone hatten bis 2001 Zeit, ihre Gesetzgebungen anzupassen.\n\nDas Gesetz definiert 16 obligatorische Abzüge, die alle Kantone gewähren müssen, wie AHV/IV/EO-Beiträge, Berufskosten oder Einzahlungen in die 3. Säule. Kantone können zusätzliche Abzüge gewähren.\n\nDiese Harmonisierung erleichtert die interkantonale Mobilität erheblich und reduziert die Compliance-Kosten für Unternehmen, die in mehreren Kantonen tätig sind. Sie ermöglichte auch den Informationsaustausch zwischen kantonalen Steuerverwaltungen.',
          it: 'La LAID, entrata in vigore nel 1993, costituisce una svolta nella storia fiscale svizzera. Impone ai 26 cantoni un quadro comune per le loro imposte dirette, preservando al tempo stesso la loro sovranità sulle aliquote.\n\nL\'armonizzazione riguarda l\'assoggettamento (chi deve pagare), l\'oggetto dell\'imposta (su cosa), la procedura e il diritto penale fiscale. I cantoni hanno avuto tempo fino al 2001 per adattare le loro legislazioni.\n\nLa legge definisce 16 detrazioni obbligatorie che tutti i cantoni devono accordare, come i contributi AVS/AI/IPG, le spese professionali o i versamenti al 3° pilastro. I cantoni possono accordare detrazioni supplementari.\n\nQuesta armonizzazione facilita notevolmente la mobilità intercantonale e riduce i costi di conformità per le imprese attive in più cantoni. Ha anche permesso lo scambio di informazioni tra amministrazioni fiscali cantonali.',
          en: 'The THLA, which came into force in 1993, represents a turning point in Swiss tax history. It requires the 26 cantons to adopt a common framework for their direct taxes, while preserving their sovereignty over tax rates.\n\nHarmonization covers tax liability (who must pay), the tax object (on what), procedure, and tax criminal law. Cantons had until 2001 to adapt their legislations.\n\nThe law defines 16 mandatory deductions that all cantons must grant, such as AHV/AI/APG contributions, professional expenses, or payments to the 3rd pillar. Cantons may grant additional deductions.\n\nThis harmonization greatly facilitates intercantonal mobility and reduces compliance costs for companies active in several cantons. It also enabled information exchange between cantonal tax administrations.'
        },
        keyPoints: {
          fr: 'Harmonisation formelle depuis 1993\n16 déductions obligatoires dans tous les cantons\nProcédures unifiées\nFacilite la mobilité et réduit les coûts\nLes taux restent de compétence cantonale',
          de: 'Formelle Harmonisierung seit 1993\n16 obligatorische Abzüge in allen Kantonen\nVereinheitlichte Verfahren\nErleichtert Mobilität und reduziert Kosten\nSteuersätze bleiben kantonale Kompetenz',
          it: 'Armonizzazione formale dal 1993\n16 detrazioni obbligatorie in tutti i cantoni\nProcedure unificate\nFacilita la mobilità e riduce i costi\nLe aliquote rimangono di competenza cantonale',
          en: 'Formal harmonization since 1993\n16 mandatory deductions in all cantons\nUnified procedures\nFacilitates mobility and reduces costs\nRates remain cantonal competence'
        }
      },
      'ltva': {
        title: {
          fr: 'LTVA - Loi sur la TVA',
          de: 'MWSTG - Mehrwertsteuergesetz',
          it: 'LIVA - Legge sull\'IVA',
          en: 'VAT Law'
        },
        content: {
          fr: 'La LTVA régit la taxe sur la valeur ajoutée, principale source de revenus de la Confédération (environ 22 milliards CHF par an). Le système suisse de TVA est relativement simple avec trois taux : normal (8.1%), réduit (2.6%) et spécial pour l\'hébergement (3.8%).\n\nL\'assujettissement obligatoire commence à partir d\'un chiffre d\'affaires de 100\'000 CHF. Les entreprises peuvent opter pour l\'assujettissement volontaire en dessous de ce seuil. La loi prévoit aussi des méthodes simplifiées pour les PME (taux forfaitaires et taux de la dette fiscale nette).\n\nLe mécanisme de déduction de l\'impôt préalable permet aux entreprises de récupérer la TVA payée sur leurs achats professionnels, garantissant que seule la valeur ajoutée est effectivement taxée. Ce système nécessite une comptabilité rigoureuse et des décomptes réguliers.\n\nDes exemptions importantes existent pour la santé, l\'éducation, les services financiers et les locations immobilières. Ces secteurs peuvent opter pour l\'imposition volontaire dans certains cas.',
          de: 'Das MWSTG regelt die Mehrwertsteuer, die Haupteinnahmequelle des Bundes (etwa 22 Milliarden CHF pro Jahr). Das Schweizer Mehrwertsteuersystem ist relativ einfach mit drei Sätzen: Normal (8,1%), ermäßigt (2,6%) und Sonderbeherbergung (3,8%).\n\nDie obligatorische Steuerpflicht beginnt ab einem Umsatz von 100\'000 CHF. Unternehmen können sich unterhalb dieser Schwelle freiwillig der Steuerpflicht unterstellen. Das Gesetz sieht auch vereinfachte Methoden für KMU vor (Pauschalsteuersätze und Saldosteuersätze).\n\nDer Vorsteuerabzugsmechanismus ermöglicht es Unternehmen, die auf ihre geschäftlichen Einkäufe gezahlte Mehrwertsteuer zurückzuerhalten, wodurch gewährleistet wird, dass nur der Mehrwert effektiv besteuert wird. Dieses System erfordert eine rigorose Buchhaltung und regelmäßige Abrechnungen.\n\nWichtige Befreiungen bestehen für Gesundheit, Bildung, Finanzdienstleistungen und Immobilienvermietungen. Diese Sektoren können in bestimmten Fällen für die freiwillige Besteuerung optieren.',
          it: 'La LIVA disciplina l\'imposta sul valore aggiunto, principale fonte di entrate della Confederazione (circa 22 miliardi di CHF all\'anno). Il sistema IVA svizzero è relativamente semplice con tre aliquote: normale (8,1%), ridotta (2,6%) e speciale per l\'alloggio (3,8%).\n\nL\'assoggettamento obbligatorio inizia da una cifra d\'affari di 100\'000 CHF. Le imprese possono optare per l\'assoggettamento volontario sotto questa soglia. La legge prevede anche metodi semplificati per le PMI (aliquote forfettarie e aliquote del debito fiscale netto).\n\nIl meccanismo di detrazione dell\'imposta precedente permette alle imprese di recuperare l\'IVA pagata sui loro acquisti professionali, garantendo che solo il valore aggiunto sia effettivamente tassato. Questo sistema richiede una contabilità rigorosa e rendiconti regolari.\n\nEsistono esenzioni importanti per la salute, l\'istruzione, i servizi finanziari e gli affitti immobiliari. Questi settori possono optare per l\'imposizione volontaria in certi casi.',
          en: 'The VAT Law governs value-added tax, the main source of revenue for the Confederation (about 22 billion CHF per year). The Swiss VAT system is relatively simple with three rates: normal (8.1%), reduced (2.6%) and special for accommodation (3.8%).\n\nMandatory liability begins from a turnover of 100,000 CHF. Companies can opt for voluntary liability below this threshold. The law also provides simplified methods for SMEs (flat rates and net tax debt rates).\n\nThe input tax deduction mechanism allows companies to recover VAT paid on their business purchases, ensuring that only value added is effectively taxed. This system requires rigorous accounting and regular returns.\n\nImportant exemptions exist for health, education, financial services and real estate rentals. These sectors can opt for voluntary taxation in certain cases.'
        },
        keyPoints: {
          fr: 'Trois taux : 8.1%, 2.6%, 3.8%\nSeuil d\'assujettissement à 100\'000 CHF\nDéduction de l\'impôt préalable\nMéthodes simplifiées pour PME\nExemptions pour certains secteurs',
          de: 'Drei Sätze: 8,1%, 2,6%, 3,8%\nSteuerpflichtschwelle bei 100\'000 CHF\nVorsteuerabzug\nVereinfachte Methoden für KMU\nBefreiungen für bestimmte Sektoren',
          it: 'Tre aliquote: 8,1%, 2,6%, 3,8%\nSoglia di assoggettamento a 100\'000 CHF\nDetrazione imposta precedente\nMetodi semplificati per PMI\nEsenzioni per certi settori',
          en: 'Three rates: 8.1%, 2.6%, 3.8%\nLiability threshold at 100,000 CHF\nInput tax deduction\nSimplified methods for SMEs\nExemptions for certain sectors'
        },
        example: {
          fr: 'Un restaurant avec 80\'000 CHF de chiffre d\'affaires n\'est pas obligatoirement assujetti, mais peut choisir de l\'être pour récupérer la TVA sur ses investissements.',
          de: 'Ein Restaurant mit 80\'000 CHF Umsatz ist nicht obligatorisch steuerpflichtig, kann aber wählen, es zu sein, um die Mehrwertsteuer auf seine Investitionen zurückzuerhalten.',
          it: 'Un ristorante con 80\'000 CHF di cifra d\'affari non è obbligatoriamente assoggettato, ma può scegliere di esserlo per recuperare l\'IVA sui suoi investimenti.',
          en: 'A restaurant with 80,000 CHF turnover is not mandatorily liable, but can choose to be to recover VAT on its investments.'
        }
      },
      'autres-lois': {
        title: {
          fr: 'Autres lois fiscales importantes',
          de: 'Andere wichtige Steuergesetze',
          it: 'Altre leggi fiscali importanti',
          en: 'Other important tax laws'
        },
        content: {
          fr: 'Le paysage législatif fiscal suisse comprend de nombreuses autres lois spécialisées. La LIA (Loi sur l\'impôt anticipé) régit la retenue de 35% sur les revenus de capitaux, servant à la fois de garantie fiscale et de lutte contre la fraude.\n\nLa LT (Loi sur les droits de timbre) taxe certaines transactions sur titres et les primes d\'assurance. Bien que critiquée, elle rapporte encore plusieurs milliards annuellement. Des réformes sont régulièrement discutées.\n\nLa LIPM (Loi sur l\'imposition des personnes morales) et les diverses lois sur les impôts spéciaux (tabac, alcool, huiles minérales, véhicules) complètent le dispositif. Chaque canton a également ses propres lois sur les droits de mutation, les gains immobiliers et les successions.\n\nLes conventions de double imposition (CDI), bien que n\'étant pas des lois internes, ont force de loi et priment sur le droit interne. La Suisse en a conclu plus de 100, facilitant les échanges économiques internationaux.',
          de: 'Die schweizerische Steuergesetzgebungslandschaft umfasst zahlreiche andere spezialisierte Gesetze. Das VStG (Verrechnungssteuergesetz) regelt die 35%ige Quellensteuer auf Kapitalerträge und dient sowohl als Steuergarantie als auch zur Betrugsbekämpfung.\n\nDas StG (Stempelabgabengesetz) besteuert bestimmte Wertpapiertransaktionen und Versicherungsprämien. Obwohl kritisiert, bringt es noch mehrere Milliarden jährlich ein. Reformen werden regelmäßig diskutiert.\n\nDas Gesetz über die Besteuerung juristischer Personen und verschiedene Gesetze über Sondersteuern (Tabak, Alkohol, Mineralöl, Fahrzeuge) vervollständigen das System. Jeder Kanton hat auch seine eigenen Gesetze über Handänderungssteuern, Immobiliengewinne und Erbschaften.\n\nDoppelbesteuerungsabkommen (DBA), obwohl sie keine internen Gesetze sind, haben Gesetzeskraft und gehen dem internen Recht vor. Die Schweiz hat über 100 abgeschlossen und erleichtert den internationalen Wirtschaftsaustausch.',
          it: 'Il panorama legislativo fiscale svizzero comprende numerose altre leggi specializzate. La LIA (Legge sull\'imposta preventiva) disciplina la ritenuta del 35% sui redditi di capitale, servendo sia come garanzia fiscale che come lotta contro la frode.\n\nLa LT (Legge sui diritti di bollo) tassa certe transazioni su titoli e i premi di assicurazione. Benché criticata, porta ancora diversi miliardi annualmente. Riforme sono regolarmente discusse.\n\nLa Legge sull\'imposizione delle persone giuridiche e le diverse leggi sulle imposte speciali (tabacco, alcol, oli minerali, veicoli) completano il dispositivo. Ogni cantone ha anche le proprie leggi sui diritti di mutazione, i guadagni immobiliari e le successioni.\n\nLe convenzioni di doppia imposizione (CDI), benché non siano leggi interne, hanno forza di legge e prevalgono sul diritto interno. La Svizzera ne ha concluse più di 100, facilitando gli scambi economici internazionali.',
          en: 'The Swiss tax legislative landscape includes many other specialized laws. The WITA (Withholding Tax Act) governs the 35% withholding on capital income, serving both as tax security and fraud prevention.\n\nThe SDA (Stamp Duty Act) taxes certain securities transactions and insurance premiums. Although criticized, it still brings in several billion annually. Reforms are regularly discussed.\n\nThe Corporate Income Tax Act and various laws on special taxes (tobacco, alcohol, mineral oils, vehicles) complete the system. Each canton also has its own laws on transfer duties, real estate gains and inheritance.\n\nDouble taxation conventions (DTCs), although not internal laws, have the force of law and take precedence over domestic law. Switzerland has concluded over 100, facilitating international economic exchanges.'
        },
        keyPoints: {
          fr: 'LIA : impôt anticipé de 35%\nDroits de timbre sur transactions\nImpôts de consommation spéciaux\nLois cantonales sur mutations et successions\nPlus de 100 conventions de double imposition',
          de: 'VStG: 35% Verrechnungssteuer\nStempelabgaben auf Transaktionen\nSondersteuern auf Verbrauch\nKantonale Gesetze zu Handänderungen und Erbschaften\nÜber 100 Doppelbesteuerungsabkommen',
          it: 'LIA: imposta preventiva del 35%\nDiritti di bollo su transazioni\nImposte speciali di consumo\nLeggi cantonali su mutazioni e successioni\nOltre 100 convenzioni di doppia imposizione',
          en: 'WITA: 35% withholding tax\nStamp duties on transactions\nSpecial consumption taxes\nCantonal laws on transfers and inheritance\nOver 100 double taxation conventions'
        }
      }
    }
  },
  'principes-imposition': {
    title: {
      fr: 'Les principes fondamentaux de l\'imposition',
      de: 'Die Grundprinzipien der Besteuerung',
      it: 'I principi fondamentali dell\'imposizione',
      en: 'The fundamental principles of taxation'
    },
    description: {
      fr: 'Comprendre les principes constitutionnels qui gouvernent la fiscalité suisse : capacité contributive, égalité, légalité et progressivité',
      de: 'Die Verfassungsprinzipien verstehen, die die Schweizer Besteuerung regeln: wirtschaftliche Leistungsfähigkeit, Gleichheit, Legalität und Progressivität',
      it: 'Comprendere i principi costituzionali che governano la fiscalità svizzera: capacità contributiva, uguaglianza, legalità e progressività',
      en: 'Understanding the constitutional principles governing Swiss taxation: contributive capacity, equality, legality and progressivity'
    },
    content: {
      fr: '',
      de: '',
      it: '',
      en: ''
    },
    sections: {
      'capacite-contributive': {
        title: {
          fr: 'Le principe de la capacité contributive',
          de: 'Das Prinzip der wirtschaftlichen Leistungsfähigkeit',
          it: 'Il principio della capacità contributiva',
          en: 'The principle of contributive capacity'
        },
        content: {
          fr: 'La capacité contributive est le principe cardinal du droit fiscal suisse, ancré dans l\'article 127 de la Constitution fédérale. Il signifie que chacun doit contribuer aux charges publiques selon ses moyens économiques réels.\n\nCe principe se concrétise par la prise en compte de la situation personnelle et familiale du contribuable. Un célibataire et un père de famille avec le même revenu n\'ont pas la même capacité contributive. C\'est pourquoi existent des déductions pour charges de famille, des barèmes différenciés et des minima vitaux exonérés.\n\nLa capacité contributive justifie également la progressivité de l\'impôt : plus le revenu augmente, plus le taux d\'imposition s\'élève, car la capacité de contribution augmente plus que proportionnellement. Les premiers francs servent aux besoins essentiels, les suivants au confort, puis au luxe et à l\'épargne.\n\nLe Tribunal fédéral veille strictement au respect de ce principe. Il a par exemple jugé inconstitutionnelles des impositions qui ne tenaient pas compte des charges effectives ou qui imposaient des revenus fictifs.',
          de: 'Die wirtschaftliche Leistungsfähigkeit ist das Kardinalprinzip des Schweizer Steuerrechts, verankert in Artikel 127 der Bundesverfassung. Es bedeutet, dass jeder entsprechend seinen tatsächlichen wirtschaftlichen Mitteln zu den öffentlichen Lasten beitragen muss.\n\nDieses Prinzip konkretisiert sich durch die Berücksichtigung der persönlichen und familiären Situation des Steuerpflichtigen. Ein Alleinstehender und ein Familienvater mit gleichem Einkommen haben nicht dieselbe Leistungsfähigkeit. Deshalb gibt es Abzüge für Familienlasten, differenzierte Tarife und steuerfreie Existenzminima.\n\nDie wirtschaftliche Leistungsfähigkeit rechtfertigt auch die Progressivität der Steuer: Je höher das Einkommen steigt, desto höher wird der Steuersatz, da die Beitragsfähigkeit überproportional zunimmt. Die ersten Franken dienen den Grundbedürfnissen, die folgenden dem Komfort, dann dem Luxus und dem Sparen.\n\nDas Bundesgericht wacht streng über die Einhaltung dieses Prinzips. Es hat beispielsweise Besteuerungen als verfassungswidrig beurteilt, die effektive Lasten nicht berücksichtigten oder fiktive Einkommen besteuerten.',
          it: 'La capacità contributiva è il principio cardine del diritto fiscale svizzero, ancorato nell\'articolo 127 della Costituzione federale. Significa che ognuno deve contribuire agli oneri pubblici secondo i propri mezzi economici reali.\n\nQuesto principio si concretizza prendendo in considerazione la situazione personale e familiare del contribuente. Un celibe e un padre di famiglia con lo stesso reddito non hanno la stessa capacità contributiva. Ecco perché esistono detrazioni per oneri familiari, tariffe differenziate e minimi vitali esenti.\n\nLa capacità contributiva giustifica anche la progressività dell\'imposta: più il reddito aumenta, più l\'aliquota fiscale si eleva, poiché la capacità di contribuzione aumenta più che proporzionalmente. I primi franchi servono ai bisogni essenziali, i seguenti al comfort, poi al lusso e al risparmio.\n\nIl Tribunale federale vigila rigorosamente sul rispetto di questo principio. Ha ad esempio giudicato incostituzionali imposizioni che non tenevano conto degli oneri effettivi o che imponevano redditi fittizi.',
          en: 'Contributive capacity is the cardinal principle of Swiss tax law, anchored in Article 127 of the Federal Constitution. It means that everyone must contribute to public charges according to their real economic means.\n\nThis principle is implemented by taking into account the taxpayer\'s personal and family situation. A single person and a father with the same income do not have the same contributive capacity. This is why there are deductions for family burdens, differentiated scales and exempt subsistence minimums.\n\nContributive capacity also justifies tax progressivity: the higher the income rises, the higher the tax rate becomes, because contribution capacity increases more than proportionally. The first francs serve essential needs, the following comfort, then luxury and savings.\n\nThe Federal Court strictly monitors compliance with this principle. It has for example ruled unconstitutional taxation that did not take into account actual burdens or that taxed fictitious income.'
        },
        keyPoints: {
          fr: 'Principe constitutionnel fondamental (art. 127 Cst.)\nImposition selon les moyens économiques réels\nPrise en compte de la situation personnelle\nJustifie la progressivité de l\'impôt\nContrôle strict par le Tribunal fédéral',
          de: 'Grundlegendes Verfassungsprinzip (Art. 127 BV)\nBesteuerung nach tatsächlichen wirtschaftlichen Mitteln\nBerücksichtigung der persönlichen Situation\nRechtfertigt die Progressivität der Steuer\nStrenge Kontrolle durch das Bundesgericht',
          it: 'Principio costituzionale fondamentale (art. 127 Cost.)\nImposizione secondo i mezzi economici reali\nConsiderazione della situazione personale\nGiustifica la progressività dell\'imposta\nControllo rigoroso del Tribunale federale',
          en: 'Fundamental constitutional principle (art. 127 Const.)\nTaxation according to real economic means\nConsidering personal situation\nJustifies tax progressivity\nStrict control by Federal Court'
        },
        example: {
          fr: 'Une famille avec 80\'000 CHF de revenu et 3 enfants paie moins d\'impôts qu\'un célibataire avec le même revenu, car sa capacité contributive est réduite par les charges familiales.',
          de: 'Eine Familie mit 80\'000 CHF Einkommen und 3 Kindern zahlt weniger Steuern als ein Alleinstehender mit gleichem Einkommen, da ihre Leistungsfähigkeit durch die Familienlasten reduziert ist.',
          it: 'Una famiglia con 80\'000 CHF di reddito e 3 figli paga meno tasse di un celibe con lo stesso reddito, poiché la sua capacità contributiva è ridotta dagli oneri familiari.',
          en: 'A family with 80,000 CHF income and 3 children pays less tax than a single person with the same income, because their contributive capacity is reduced by family burdens.'
        }
      },
      'egalite-devant-impot': {
        title: {
          fr: 'L\'égalité devant l\'impôt',
          de: 'Die Gleichheit vor der Steuer',
          it: 'L\'uguaglianza davanti all\'imposta',
          en: 'Equality before tax'
        },
        content: {
          fr: 'L\'égalité devant l\'impôt découle du principe général d\'égalité inscrit dans la Constitution. Il implique que les contribuables dans des situations comparables doivent être traités de manière identique (égalité horizontale) et que ceux dans des situations différentes doivent être traités différemment (égalité verticale).\n\nCe principe interdit les privilèges fiscaux arbitraires et la discrimination. Toute différence de traitement doit être justifiée objectivement. Par exemple, les déductions pour frais professionnels sont justifiées car ces dépenses réduisent la capacité contributive.\n\nL\'égalité s\'applique aussi à la procédure : tous les contribuables ont les mêmes droits et obligations procéduraux. L\'administration fiscale ne peut pas appliquer des pratiques différentes selon les personnes sans justification légale.\n\nLa lutte contre la fraude et l\'évasion fiscale est aussi une question d\'égalité : ceux qui trichent créent une inégalité au détriment des contribuables honnêtes. C\'est pourquoi l\'échange automatique d\'informations et les contrôles sont essentiels.',
          de: 'Die Gleichheit vor der Steuer ergibt sich aus dem allgemeinen Gleichheitsprinzip der Verfassung. Es bedeutet, dass Steuerpflichtige in vergleichbaren Situationen gleich behandelt werden müssen (horizontale Gleichheit) und solche in unterschiedlichen Situationen unterschiedlich behandelt werden müssen (vertikale Gleichheit).\n\nDieses Prinzip verbietet willkürliche Steuerprivilegien und Diskriminierung. Jede unterschiedliche Behandlung muss objektiv gerechtfertigt sein. Zum Beispiel sind Abzüge für Berufskosten gerechtfertigt, da diese Ausgaben die Leistungsfähigkeit reduzieren.\n\nGleichheit gilt auch für das Verfahren: Alle Steuerpflichtigen haben dieselben verfahrensrechtlichen Rechte und Pflichten. Die Steuerverwaltung kann nicht unterschiedliche Praktiken je nach Person ohne gesetzliche Rechtfertigung anwenden.\n\nDer Kampf gegen Betrug und Steuerhinterziehung ist auch eine Frage der Gleichheit: Diejenigen, die betrügen, schaffen Ungleichheit zu Lasten ehrlicher Steuerzahler. Deshalb sind automatischer Informationsaustausch und Kontrollen wesentlich.',
          it: 'L\'uguaglianza davanti all\'imposta deriva dal principio generale di uguaglianza iscritto nella Costituzione. Implica che i contribuenti in situazioni comparabili devono essere trattati in modo identico (uguaglianza orizzontale) e che quelli in situazioni diverse devono essere trattati diversamente (uguaglianza verticale).\n\nQuesto principio vieta i privilegi fiscali arbitrari e la discriminazione. Ogni differenza di trattamento deve essere giustificata oggettivamente. Ad esempio, le detrazioni per spese professionali sono giustificate perché queste spese riducono la capacità contributiva.\n\nL\'uguaglianza si applica anche alla procedura: tutti i contribuenti hanno gli stessi diritti e obblighi procedurali. L\'amministrazione fiscale non può applicare pratiche diverse secondo le persone senza giustificazione legale.\n\nLa lotta contro la frode e l\'evasione fiscale è anche una questione di uguaglianza: coloro che imbrogliano creano una disuguaglianza a danno dei contribuenti onesti. Ecco perché lo scambio automatico di informazioni e i controlli sono essenziali.',
          en: 'Equality before tax stems from the general principle of equality enshrined in the Constitution. It implies that taxpayers in comparable situations must be treated identically (horizontal equality) and those in different situations must be treated differently (vertical equality).\n\nThis principle prohibits arbitrary tax privileges and discrimination. Any difference in treatment must be objectively justified. For example, deductions for professional expenses are justified because these expenses reduce contributive capacity.\n\nEquality also applies to procedure: all taxpayers have the same procedural rights and obligations. The tax administration cannot apply different practices according to persons without legal justification.\n\nThe fight against fraud and tax evasion is also a matter of equality: those who cheat create inequality to the detriment of honest taxpayers. This is why automatic information exchange and controls are essential.'
        },
        keyPoints: {
          fr: 'Traitement identique des situations comparables\nInterdiction de la discrimination arbitraire\nÉgalité dans la procédure fiscale\nJustification objective des différences\nLutte contre la fraude pour préserver l\'égalité',
          de: 'Gleiche Behandlung vergleichbarer Situationen\nVerbot willkürlicher Diskriminierung\nGleichheit im Steuerverfahren\nObjektive Rechtfertigung von Unterschieden\nBetrugsbekämpfung zum Erhalt der Gleichheit',
          it: 'Trattamento identico delle situazioni comparabili\nDivieto di discriminazione arbitraria\nUguaglianza nella procedura fiscale\nGiustificazione oggettiva delle differenze\nLotta contro la frode per preservare l\'uguaglianza',
          en: 'Identical treatment of comparable situations\nProhibition of arbitrary discrimination\nEquality in tax procedure\nObjective justification of differences\nFighting fraud to preserve equality'
        },
        example: {
          fr: 'Tous les salariés peuvent déduire leurs frais de transport professionnels selon les mêmes règles, qu\'ils soient cadres ou ouvriers.',
          de: 'Alle Angestellten können ihre beruflichen Transportkosten nach denselben Regeln abziehen, ob sie Führungskräfte oder Arbeiter sind.',
          it: 'Tutti i dipendenti possono detrarre le loro spese di trasporto professionale secondo le stesse regole, che siano dirigenti o operai.',
          en: 'All employees can deduct their professional transport costs according to the same rules, whether they are executives or workers.'
        }
      },
      'legalite': {
        title: {
          fr: 'Le principe de légalité',
          de: 'Das Legalitätsprinzip',
          it: 'Il principio di legalità',
          en: 'The principle of legality'
        },
        content: {
          fr: '"Pas d\'impôt sans loi" - ce principe fondamental signifie que tout impôt doit reposer sur une base légale claire. La loi doit définir le cercle des contribuables, l\'objet de l\'impôt, son assiette, le tarif et les exemptions.\n\nCe principe protège les citoyens contre l\'arbitraire administratif. L\'administration fiscale ne peut pas créer de nouveaux impôts ou modifier les règles existantes sans base légale. Même les circulaires doivent rester dans le cadre de la loi.\n\nLa légalité implique aussi la prévisibilité : le contribuable doit pouvoir connaître à l\'avance ses obligations fiscales. Les lois rétroactives sont en principe interdites, sauf exceptions strictement encadrées.\n\nLe principe s\'étend à la procédure : les délais, les voies de recours, les sanctions doivent être prévus par la loi. Cela garantit la sécurité juridique et l\'État de droit en matière fiscale.',
          de: '"Keine Steuer ohne Gesetz" - dieses Grundprinzip bedeutet, dass jede Steuer auf einer klaren gesetzlichen Grundlage beruhen muss. Das Gesetz muss den Kreis der Steuerpflichtigen, den Steuergegenstand, die Bemessungsgrundlage, den Tarif und die Befreiungen definieren.\n\nDieses Prinzip schützt die Bürger vor administrativer Willkür. Die Steuerverwaltung kann keine neuen Steuern schaffen oder bestehende Regeln ohne gesetzliche Grundlage ändern. Auch Kreisschreiben müssen im Rahmen des Gesetzes bleiben.\n\nLegalität impliziert auch Vorhersehbarkeit: Der Steuerpflichtige muss seine steuerlichen Verpflichtungen im Voraus kennen können. Rückwirkende Gesetze sind grundsätzlich verboten, außer in streng begrenzten Ausnahmen.\n\nDas Prinzip erstreckt sich auf das Verfahren: Fristen, Rechtsmittel, Sanktionen müssen gesetzlich vorgesehen sein. Das garantiert Rechtssicherheit und Rechtsstaatlichkeit im Steuerbereich.',
          it: '"Nessuna imposta senza legge" - questo principio fondamentale significa che ogni imposta deve basarsi su una base legale chiara. La legge deve definire la cerchia dei contribuenti, l\'oggetto dell\'imposta, la sua base imponibile, la tariffa e le esenzioni.\n\nQuesto principio protegge i cittadini contro l\'arbitrarietà amministrativa. L\'amministrazione fiscale non può creare nuove imposte o modificare le regole esistenti senza base legale. Anche le circolari devono rimanere nel quadro della legge.\n\nLa legalità implica anche la prevedibilità: il contribuente deve poter conoscere in anticipo i suoi obblighi fiscali. Le leggi retroattive sono in principio vietate, salvo eccezioni rigorosamente inquadrate.\n\nIl principio si estende alla procedura: i termini, le vie di ricorso, le sanzioni devono essere previsti dalla legge. Questo garantisce la sicurezza giuridica e lo Stato di diritto in materia fiscale.',
          en: '"No tax without law" - this fundamental principle means that every tax must be based on a clear legal foundation. The law must define the circle of taxpayers, the tax object, its base, the tariff and exemptions.\n\nThis principle protects citizens against administrative arbitrariness. The tax administration cannot create new taxes or modify existing rules without legal basis. Even circulars must remain within the framework of the law.\n\nLegality also implies predictability: the taxpayer must be able to know their tax obligations in advance. Retroactive laws are in principle prohibited, except for strictly framed exceptions.\n\nThe principle extends to procedure: deadlines, appeals, sanctions must be provided by law. This guarantees legal certainty and rule of law in tax matters.'
        },
        keyPoints: {
          fr: 'Tout impôt doit avoir une base légale\nProtection contre l\'arbitraire administratif\nPrévisibilité des obligations fiscales\nInterdiction de principe de la rétroactivité\nProcédure réglée par la loi',
          de: 'Jede Steuer muss eine gesetzliche Grundlage haben\nSchutz vor administrativer Willkür\nVorhersehbarkeit der steuerlichen Verpflichtungen\nGrundsätzliches Verbot der Rückwirkung\nGesetzlich geregelte Verfahren',
          it: 'Ogni imposta deve avere una base legale\nProtezione contro l\'arbitrarietà amministrativa\nPrevedibilità degli obblighi fiscali\nDivieto di principio della retroattività\nProcedura regolata dalla legge',
          en: 'Every tax must have a legal basis\nProtection against administrative arbitrariness\nPredictability of tax obligations\nPrinciple prohibition of retroactivity\nProcedure regulated by law'
        }
      },
      'periodicite': {
        title: {
          fr: 'Périodicité et annualité',
          de: 'Periodizität und Jährlichkeit',
          it: 'Periodicità e annualità',
          en: 'Periodicity and annuality'
        },
        content: {
          fr: 'L\'impôt sur le revenu et la fortune suit le principe de périodicité annuelle. L\'année fiscale correspond généralement à l\'année civile, et chaque période est imposée séparément. Ce principe a des implications pratiques importantes.\n\nLe système postnumerando appliqué partout sauf au niveau fédéral signifie qu\'on paie en année N les impôts sur les revenus de l\'année N. Cela nécessite des acomptes provisoires basés sur la dernière taxation connue, avec régularisation ultérieure.\n\nLa périodicité annuelle signifie aussi que les revenus extraordinaires (gains de loterie, prestations en capital) sont souvent imposés séparément à des taux privilégiés pour éviter la progression excessive due au cumul.\n\nLes changements de situation en cours d\'année (mariage, divorce, naissance, décès) sont pris en compte pro rata temporis. Les déménagements intercantonaux nécessitent une répartition entre les cantons concernés.',
          de: 'Die Einkommens- und Vermögenssteuer folgt dem Prinzip der jährlichen Periodizität. Das Steuerjahr entspricht im Allgemeinen dem Kalenderjahr, und jede Periode wird separat besteuert. Dieses Prinzip hat wichtige praktische Auswirkungen.\n\nDas überall außer auf Bundesebene angewandte System postnumerando bedeutet, dass man in Jahr N die Steuern auf die Einkommen des Jahres N zahlt. Dies erfordert vorläufige Akontozahlungen basierend auf der letzten bekannten Veranlagung, mit späterer Regulierung.\n\nJährliche Periodizität bedeutet auch, dass außerordentliche Einkommen (Lotteriegewinne, Kapitalleistungen) oft separat zu Vorzugssätzen besteuert werden, um übermäßige Progression durch Kumulierung zu vermeiden.\n\nÄnderungen der Situation während des Jahres (Heirat, Scheidung, Geburt, Tod) werden zeitanteilig berücksichtigt. Interkantonale Umzüge erfordern eine Aufteilung zwischen den betroffenen Kantonen.',
          it: 'L\'imposta sul reddito e sul patrimonio segue il principio di periodicità annuale. L\'anno fiscale corrisponde generalmente all\'anno civile, e ogni periodo è tassato separatamente. Questo principio ha implicazioni pratiche importanti.\n\nIl sistema postnumerando applicato ovunque tranne a livello federale significa che si paga nell\'anno N le imposte sui redditi dell\'anno N. Questo richiede acconti provvisori basati sull\'ultima tassazione conosciuta, con regolarizzazione successiva.\n\nLa periodicità annuale significa anche che i redditi straordinari (vincite alla lotteria, prestazioni in capitale) sono spesso tassati separatamente a aliquote privilegiate per evitare la progressione eccessiva dovuta al cumulo.\n\nI cambiamenti di situazione durante l\'anno (matrimonio, divorzio, nascita, morte) sono presi in considerazione pro rata temporis. I traslochi intercantonali richiedono una ripartizione tra i cantoni interessati.',
          en: 'Income and wealth tax follows the principle of annual periodicity. The tax year generally corresponds to the calendar year, and each period is taxed separately. This principle has important practical implications.\n\nThe postnumerando system applied everywhere except at federal level means that in year N we pay taxes on income from year N. This requires provisional installments based on the last known assessment, with subsequent regularization.\n\nAnnual periodicity also means that extraordinary income (lottery winnings, capital benefits) is often taxed separately at preferential rates to avoid excessive progression due to accumulation.\n\nChanges in situation during the year (marriage, divorce, birth, death) are taken into account pro rata temporis. Intercantonal moves require distribution between the cantons concerned.'
        },
        keyPoints: {
          fr: 'Imposition par période annuelle\nSystème postnumerando (sauf IFD)\nAcomptes provisoires et régularisation\nImposition séparée des revenus extraordinaires\nRépartition pro rata en cas de changement',
          de: 'Besteuerung nach Jahresperioden\nSystem postnumerando (außer DBG)\nVorläufige Akonto und Regulierung\nSeparate Besteuerung außerordentlicher Einkommen\nZeitanteilige Aufteilung bei Änderungen',
          it: 'Imposizione per periodo annuale\nSistema postnumerando (eccetto IFD)\nAcconti provvisori e regolarizzazione\nImposizione separata dei redditi straordinari\nRipartizione pro rata in caso di cambiamento',
          en: 'Taxation by annual period\nPostnumerando system (except FIT)\nProvisional installments and regularization\nSeparate taxation of extraordinary income\nPro rata distribution in case of change'
        },
        example: {
          fr: 'Un déménagement de Genève à Zurich au 1er juillet implique que chaque canton taxe 6 mois de revenus, avec application de son propre barème sur le revenu annualisé.',
          de: 'Ein Umzug von Genf nach Zürich am 1. Juli bedeutet, dass jeder Kanton 6 Monate Einkommen besteuert, mit Anwendung seines eigenen Tarifs auf das annualisierte Einkommen.',
          it: 'Un trasloco da Ginevra a Zurigo il 1° luglio implica che ogni cantone tassi 6 mesi di redditi, con applicazione della propria tariffa sul reddito annualizzato.',
          en: 'A move from Geneva to Zurich on July 1st means that each canton taxes 6 months of income, applying its own scale to the annualized income.'
        }
      },
      'progressivite': {
        title: {
          fr: 'La progressivité de l\'impôt',
          de: 'Die Progressivität der Steuer',
          it: 'La progressività dell\'imposta',
          en: 'Tax progressivity'
        },
        content: {
          fr: 'La progressivité signifie que le taux d\'imposition augmente avec le revenu. Ce n\'est pas un principe constitutionnel en soi, mais il découle de la capacité contributive. Les premiers revenus, nécessaires à la subsistance, sont peu ou pas imposés.\n\nOn distingue le taux marginal (sur le dernier franc gagné) du taux effectif (moyenne sur l\'ensemble du revenu). Le taux marginal peut atteindre 40-45% dans certains cantons pour les très hauts revenus, mais le taux effectif reste toujours inférieur.\n\nLa progressivité peut être directe (barème avec tranches) ou indirecte (via les déductions). Elle peut être linéaire, dégressive ou plafonnée. L\'impôt fédéral direct plafonne à 11.5%, créant une dégressivité pour les très hauts revenus.\n\nLes effets de seuil et la progression à froid sont des défis de la progressivité. Des mécanismes comme le splitting familial ou l\'indexation des barèmes visent à les atténuer.',
          de: 'Progressivität bedeutet, dass der Steuersatz mit dem Einkommen steigt. Es ist nicht an sich ein Verfassungsprinzip, sondern ergibt sich aus der wirtschaftlichen Leistungsfähigkeit. Die ersten Einkommen, die zum Lebensunterhalt notwendig sind, werden wenig oder gar nicht besteuert.\n\nMan unterscheidet den Grenzsteuersatz (auf den letzten verdienten Franken) vom effektiven Satz (Durchschnitt über das gesamte Einkommen). Der Grenzsteuersatz kann in einigen Kantonen für sehr hohe Einkommen 40-45% erreichen, aber der effektive Satz bleibt immer niedriger.\n\nProgressivität kann direkt (Tarif mit Stufen) oder indirekt (über Abzüge) sein. Sie kann linear, degressiv oder gedeckelt sein. Die direkte Bundessteuer ist bei 11,5% gedeckelt, was eine Degressivität für sehr hohe Einkommen schafft.\n\nSchwelleneffekte und kalte Progression sind Herausforderungen der Progressivität. Mechanismen wie Familiensplitting oder Indexierung der Tarife zielen darauf ab, diese zu mildern.',
          it: 'La progressività significa che l\'aliquota fiscale aumenta con il reddito. Non è un principio costituzionale in sé, ma deriva dalla capacità contributiva. I primi redditi, necessari alla sussistenza, sono poco o per niente tassati.\n\nSi distingue l\'aliquota marginale (sull\'ultimo franco guadagnato) dall\'aliquota effettiva (media sull\'insieme del reddito). L\'aliquota marginale può raggiungere il 40-45% in alcuni cantoni per i redditi molto alti, ma l\'aliquota effettiva rimane sempre inferiore.\n\nLa progressività può essere diretta (tariffa con scaglioni) o indiretta (tramite le detrazioni). Può essere lineare, degressiva o limitata. L\'imposta federale diretta è limitata all\'11,5%, creando una degressività per i redditi molto alti.\n\nGli effetti soglia e la progressione a freddo sono sfide della progressività. Meccanismi come lo splitting familiare o l\'indicizzazione delle tariffe mirano ad attenuarli.',
          en: 'Progressivity means that the tax rate increases with income. It is not a constitutional principle per se, but stems from contributive capacity. The first income, necessary for subsistence, is little or not taxed.\n\nWe distinguish the marginal rate (on the last franc earned) from the effective rate (average over all income). The marginal rate can reach 40-45% in some cantons for very high incomes, but the effective rate always remains lower.\n\nProgressivity can be direct (scale with brackets) or indirect (via deductions). It can be linear, regressive or capped. Direct federal tax caps at 11.5%, creating regressivity for very high incomes.\n\nThreshold effects and cold progression are challenges of progressivity. Mechanisms like family splitting or scale indexation aim to mitigate them.'
        },
        keyPoints: {
          fr: 'Taux croissant avec le revenu\nDistinction taux marginal / taux effectif\nDifférents types de progression\nPlafonnement possible (IFD à 11.5%)\nDéfis : effets de seuil, progression à froid',
          de: 'Steigender Satz mit dem Einkommen\nUnterscheidung Grenz- / Effektivsatz\nVerschiedene Arten der Progression\nMögliche Deckelung (DBG bei 11,5%)\nHerausforderungen: Schwelleneffekte, kalte Progression',
          it: 'Aliquota crescente con il reddito\nDistinzione aliquota marginale / effettiva\nDiversi tipi di progressione\nPossibile limitazione (IFD all\'11,5%)\nSfide: effetti soglia, progressione a freddo',
          en: 'Increasing rate with income\nDistinction marginal / effective rate\nDifferent types of progression\nPossible capping (FIT at 11.5%)\nChallenges: threshold effects, cold progression'
        }
      }
    }
  },
  'types-impots': {
    title: {
      fr: 'Les différents types d\'impôts en Suisse',
      de: 'Die verschiedenen Steuerarten in der Schweiz',
      it: 'I diversi tipi di imposte in Svizzera',
      en: 'The different types of taxes in Switzerland'
    },
    description: {
      fr: 'Classification et caractéristiques des impôts directs, indirects, sur le revenu, la fortune, la consommation et les transactions',
      de: 'Klassifikation und Eigenschaften direkter und indirekter Steuern auf Einkommen, Vermögen, Verbrauch und Transaktionen',
      it: 'Classificazione e caratteristiche delle imposte dirette, indirette, sul reddito, sul patrimonio, sui consumi e sulle transazioni',
      en: 'Classification and characteristics of direct and indirect taxes on income, wealth, consumption and transactions'
    },
    content: {
      fr: '',
      de: '',
      it: '',
      en: ''
    },
    sections: {
      'classification-generale': {
        title: {
          fr: 'Classification générale des impôts',
          de: 'Allgemeine Klassifikation der Steuern',
          it: 'Classificazione generale delle imposte',
          en: 'General classification of taxes'
        },
        content: {
          fr: 'Le système fiscal suisse distingue plusieurs catégories d\'impôts selon différents critères. La distinction principale oppose les impôts directs, payés directement par le contribuable sur ses revenus ou sa fortune, aux impôts indirects, incorporés dans le prix des biens et services.\n\nLes impôts directs incluent l\'impôt sur le revenu, l\'impôt sur la fortune, l\'impôt sur le bénéfice et l\'impôt sur le capital. Ils sont généralement progressifs et tiennent compte de la capacité contributive personnelle.\n\nLes impôts indirects comprennent la TVA, les droits de douane, les impôts sur le tabac, l\'alcool et les carburants. Ils sont proportionnels et frappent la consommation indépendamment de la situation personnelle du consommateur.\n\nUne autre classification distingue les impôts généraux (sur l\'ensemble du revenu ou de la consommation) des impôts spéciaux (sur des objets particuliers comme les véhicules ou les chiens). On distingue aussi les impôts périodiques (annuels) des impôts uniques (droits de mutation).',
          de: 'Das Schweizer Steuersystem unterscheidet verschiedene Steuerkategorien nach unterschiedlichen Kriterien. Die Hauptunterscheidung trennt direkte Steuern, die direkt vom Steuerpflichtigen auf sein Einkommen oder Vermögen gezahlt werden, von indirekten Steuern, die im Preis von Waren und Dienstleistungen enthalten sind.\n\nDirekte Steuern umfassen Einkommenssteuer, Vermögenssteuer, Gewinnsteuer und Kapitalsteuer. Sie sind generell progressiv und berücksichtigen die persönliche Leistungsfähigkeit.\n\nIndirekte Steuern umfassen Mehrwertsteuer, Zölle, Steuern auf Tabak, Alkohol und Treibstoffe. Sie sind proportional und treffen den Konsum unabhängig von der persönlichen Situation des Verbrauchers.\n\nEine weitere Klassifikation unterscheidet allgemeine Steuern (auf das gesamte Einkommen oder den Konsum) von besonderen Steuern (auf spezielle Objekte wie Fahrzeuge oder Hunde). Man unterscheidet auch periodische Steuern (jährlich) von einmaligen Steuern (Handänderungssteuern).',
          it: 'Il sistema fiscale svizzero distingue diverse categorie di imposte secondo criteri differenti. La distinzione principale oppone le imposte dirette, pagate direttamente dal contribuente sui suoi redditi o sul patrimonio, alle imposte indirette, incorporate nel prezzo di beni e servizi.\n\nLe imposte dirette includono l\'imposta sul reddito, l\'imposta sul patrimonio, l\'imposta sull\'utile e l\'imposta sul capitale. Sono generalmente progressive e tengono conto della capacità contributiva personale.\n\nLe imposte indirette comprendono l\'IVA, i dazi doganali, le imposte su tabacco, alcol e carburanti. Sono proporzionali e colpiscono il consumo indipendentemente dalla situazione personale del consumatore.\n\nUn\'altra classificazione distingue le imposte generali (sull\'insieme del reddito o del consumo) dalle imposte speciali (su oggetti particolari come veicoli o cani). Si distinguono anche le imposte periodiche (annuali) dalle imposte uniche (diritti di mutazione).',
          en: 'The Swiss tax system distinguishes several categories of taxes according to different criteria. The main distinction opposes direct taxes, paid directly by the taxpayer on their income or wealth, to indirect taxes, incorporated in the price of goods and services.\n\nDirect taxes include income tax, wealth tax, profit tax and capital tax. They are generally progressive and take into account personal contributive capacity.\n\nIndirect taxes include VAT, customs duties, taxes on tobacco, alcohol and fuel. They are proportional and hit consumption regardless of the consumer\'s personal situation.\n\nAnother classification distinguishes general taxes (on all income or consumption) from special taxes (on particular objects like vehicles or dogs). We also distinguish periodic taxes (annual) from one-time taxes (transfer duties).'
        },
        keyPoints: {
          fr: 'Impôts directs vs indirects\nImpôts généraux vs spéciaux\nImpôts périodiques vs uniques\nImpôts personnels vs réels\nCritères de classification multiples',
          de: 'Direkte vs indirekte Steuern\nAllgemeine vs besondere Steuern\nPeriodische vs einmalige Steuern\nPersonensteuern vs Sachsteuern\nMehrfache Klassifikationskriterien',
          it: 'Imposte dirette vs indirette\nImposte generali vs speciali\nImposte periodiche vs uniche\nImposte personali vs reali\nCriteri di classificazione multipli',
          en: 'Direct vs indirect taxes\nGeneral vs special taxes\nPeriodic vs one-time taxes\nPersonal vs real taxes\nMultiple classification criteria'
        }
      },
      'impots-directs-personnes': {
        title: {
          fr: 'Impôts directs sur les personnes physiques',
          de: 'Direkte Steuern auf natürliche Personen',
          it: 'Imposte dirette sulle persone fisiche',
          en: 'Direct taxes on natural persons'
        },
        content: {
          fr: 'L\'impôt sur le revenu constitue la principale charge fiscale pour la plupart des personnes physiques. Il frappe l\'ensemble des revenus : salaires, revenus indépendants, rentes, revenus de capitaux et immobiliers. Chaque niveau (Confédération, canton, commune) prélève sa part.\n\nL\'impôt sur la fortune, spécificité suisse de plus en plus rare dans le monde, frappe la fortune nette (actifs moins dettes). Seuls les cantons et communes le prélèvent, pas la Confédération. Les taux varient fortement entre cantons, de 0.1% à 1% environ.\n\nL\'impôt à la source concerne les étrangers sans permis C et certains revenus spécifiques. Il est prélevé directement par l\'employeur ou le débiteur. Une taxation ordinaire ultérieure est possible pour les revenus élevés (plus de 120\'000 CHF dans la plupart des cantons).\n\nLes gains en capital privés sont généralement exonérés (sauf immobilier), ce qui distingue la Suisse de nombreux pays. Cette exonération incite à la constitution de patrimoine mais nécessite de distinguer les gains privés des gains commerciaux.',
          de: 'Die Einkommenssteuer stellt die Hauptsteuerbelastung für die meisten natürlichen Personen dar. Sie erfasst alle Einkommen: Löhne, selbständige Einkommen, Renten, Kapital- und Immobilienerträge. Jede Ebene (Bund, Kanton, Gemeinde) erhebt ihren Anteil.\n\nDie Vermögenssteuer, eine schweizerische Besonderheit, die weltweit immer seltener wird, erfasst das Nettovermögen (Aktiva minus Schulden). Nur Kantone und Gemeinden erheben sie, nicht der Bund. Die Sätze variieren stark zwischen den Kantonen, von etwa 0,1% bis 1%.\n\nDie Quellensteuer betrifft Ausländer ohne Niederlassungsbewilligung und bestimmte spezifische Einkommen. Sie wird direkt vom Arbeitgeber oder Schuldner abgezogen. Eine nachträgliche ordentliche Veranlagung ist für hohe Einkommen möglich (über 120\'000 CHF in den meisten Kantonen).\n\nPrivate Kapitalgewinne sind generell befreit (außer Immobilien), was die Schweiz von vielen Ländern unterscheidet. Diese Befreiung fördert die Vermögensbildung, erfordert aber die Unterscheidung zwischen privaten und gewerblichen Gewinnen.',
          it: 'L\'imposta sul reddito costituisce il principale onere fiscale per la maggior parte delle persone fisiche. Colpisce l\'insieme dei redditi: salari, redditi indipendenti, rendite, redditi di capitali e immobiliari. Ogni livello (Confederazione, cantone, comune) preleva la sua parte.\n\nL\'imposta sul patrimonio, specificità svizzera sempre più rara nel mondo, colpisce il patrimonio netto (attivi meno debiti). Solo i cantoni e comuni la prelevano, non la Confederazione. Le aliquote variano fortemente tra cantoni, dallo 0,1% all\'1% circa.\n\nL\'imposta alla fonte concerne gli stranieri senza permesso C e certi redditi specifici. È prelevata direttamente dal datore di lavoro o dal debitore. Una tassazione ordinaria successiva è possibile per i redditi elevati (oltre 120\'000 CHF nella maggior parte dei cantoni).\n\nI guadagni in capitale privati sono generalmente esenti (eccetto immobiliare), il che distingue la Svizzera da molti paesi. Questa esenzione incentiva la costituzione di patrimonio ma necessita di distinguere i guadagni privati da quelli commerciali.',
          en: 'Income tax constitutes the main tax burden for most natural persons. It hits all income: wages, self-employment income, pensions, capital and real estate income. Each level (Confederation, canton, municipality) takes its share.\n\nWealth tax, a Swiss specificity increasingly rare in the world, hits net wealth (assets minus debts). Only cantons and municipalities levy it, not the Confederation. Rates vary greatly between cantons, from about 0.1% to 1%.\n\nWithholding tax concerns foreigners without permit C and certain specific income. It is deducted directly by the employer or debtor. Subsequent ordinary taxation is possible for high income (over 120,000 CHF in most cantons).\n\nPrivate capital gains are generally exempt (except real estate), which distinguishes Switzerland from many countries. This exemption encourages wealth building but requires distinguishing private from commercial gains.'
        },
        keyPoints: {
          fr: 'Impôt sur le revenu à trois niveaux\nImpôt sur la fortune (cantonal uniquement)\nImpôt à la source pour étrangers\nExonération des gains en capital privés\nImposition selon la capacité contributive',
          de: 'Einkommenssteuer auf drei Ebenen\nVermögenssteuer (nur kantonal)\nQuellensteuer für Ausländer\nBefreiung privater Kapitalgewinne\nBesteuerung nach Leistungsfähigkeit',
          it: 'Imposta sul reddito a tre livelli\nImposta sul patrimonio (solo cantonale)\nImposta alla fonte per stranieri\nEsenzione guadagni di capitale privati\nImposizione secondo capacità contributiva',
          en: 'Income tax at three levels\nWealth tax (cantonal only)\nWithholding tax for foreigners\nExemption of private capital gains\nTaxation according to contributive capacity'
        },
        example: {
          fr: 'Un salarié étranger avec permis B voit son impôt prélevé à la source chaque mois. S\'il gagne plus de 120\'000 CHF, il devra faire une déclaration complète pour régularisation.',
          de: 'Ein ausländischer Angestellter mit Aufenthaltsbewilligung B hat seine Steuer jeden Monat an der Quelle abgezogen. Verdient er über 120\'000 CHF, muss er eine vollständige Erklärung zur Regulierung abgeben.',
          it: 'Un dipendente straniero con permesso B vede la sua imposta prelevata alla fonte ogni mese. Se guadagna oltre 120\'000 CHF, dovrà fare una dichiarazione completa per regolarizzazione.',
          en: 'A foreign employee with permit B has their tax withheld at source each month. If they earn over 120,000 CHF, they must file a complete return for regularization.'
        }
      },
      'impots-directs-entreprises': {
        title: {
          fr: 'Impôts directs sur les entreprises',
          de: 'Direkte Steuern auf Unternehmen',
          it: 'Imposte dirette sulle imprese',
          en: 'Direct taxes on companies'
        },
        content: {
          fr: 'L\'impôt sur le bénéfice frappe les personnes morales (SA, Sàrl) sur leur bénéfice net. Le taux fédéral est de 8.5%, auquel s\'ajoutent les impôts cantonaux et communaux. Les taux effectifs totaux varient de 12% à 21% selon les cantons.\n\nL\'impôt sur le capital, prélevé uniquement par les cantons, frappe le capital propre des sociétés. C\'est un impôt minimum qui garantit une contribution même en l\'absence de bénéfice. Certains cantons l\'ont fortement réduit ou prévoient l\'imputation sur l\'impôt sur le bénéfice.\n\nLes distributions de dividendes subissent l\'impôt anticipé de 35% à la source, récupérable pour les résidents suisses qui déclarent correctement. Pour les participations qualifiées (plus de 10%), une imposition réduite s\'applique pour éviter la double imposition économique.\n\nLes restructurations d\'entreprises peuvent bénéficier de la neutralité fiscale si certaines conditions sont remplies. Les réserves latentes peuvent être transférées sans imposition immédiate, facilitant les réorganisations économiquement justifiées.',
          de: 'Die Gewinnsteuer erfasst juristische Personen (AG, GmbH) auf ihren Reingewinn. Der Bundessatz beträgt 8,5%, hinzu kommen kantonale und kommunale Steuern. Die effektiven Gesamtsätze variieren je nach Kanton von 12% bis 21%.\n\nDie Kapitalsteuer, nur von Kantonen erhoben, erfasst das Eigenkapital der Gesellschaften. Es ist eine Mindeststeuer, die auch bei fehlendem Gewinn einen Beitrag garantiert. Einige Kantone haben sie stark reduziert oder sehen eine Anrechnung auf die Gewinnsteuer vor.\n\nDividendenausschüttungen unterliegen der 35%igen Verrechnungssteuer an der Quelle, rückforderbar für schweizerische Ansässige bei korrekter Deklaration. Für qualifizierte Beteiligungen (über 10%) gilt eine reduzierte Besteuerung zur Vermeidung der wirtschaftlichen Doppelbesteuerung.\n\nUnternehmensrestrukturierungen können bei Erfüllung bestimmter Bedingungen von der steuerlichen Neutralität profitieren. Stille Reserven können ohne sofortige Besteuerung übertragen werden, was wirtschaftlich gerechtfertigte Umorganisationen erleichtert.',
          it: 'L\'imposta sull\'utile colpisce le persone giuridiche (SA, Sagl) sul loro utile netto. L\'aliquota federale è dell\'8,5%, a cui si aggiungono le imposte cantonali e comunali. Le aliquote effettive totali variano dal 12% al 21% secondo i cantoni.\n\nL\'imposta sul capitale, prelevata unicamente dai cantoni, colpisce il capitale proprio delle società. È un\'imposta minima che garantisce un contributo anche in assenza di utile. Alcuni cantoni l\'hanno fortemente ridotta o prevedono l\'imputazione sull\'imposta sull\'utile.\n\nLe distribuzioni di dividendi subiscono l\'imposta preventiva del 35% alla fonte, recuperabile per i residenti svizzeri che dichiarano correttamente. Per le partecipazioni qualificate (oltre il 10%), si applica un\'imposizione ridotta per evitare la doppia imposizione economica.\n\nLe ristrutturazioni d\'impresa possono beneficiare della neutralità fiscale se certe condizioni sono soddisfatte. Le riserve latenti possono essere trasferite senza imposizione immediata, facilitando le riorganizzazioni economicamente giustificate.',
          en: 'Profit tax hits legal entities (SA, Sàrl) on their net profit. The federal rate is 8.5%, to which cantonal and municipal taxes are added. Total effective rates vary from 12% to 21% depending on cantons.\n\nCapital tax, levied only by cantons, hits companies\' equity capital. It\'s a minimum tax that guarantees a contribution even without profit. Some cantons have greatly reduced it or provide for offsetting against profit tax.\n\nDividend distributions are subject to 35% withholding tax at source, recoverable for Swiss residents who declare correctly. For qualified participations (over 10%), reduced taxation applies to avoid economic double taxation.\n\nCorporate restructurings can benefit from tax neutrality if certain conditions are met. Hidden reserves can be transferred without immediate taxation, facilitating economically justified reorganizations.'
        },
        keyPoints: {
          fr: 'Impôt sur le bénéfice (8.5% fédéral + cantonal)\nImpôt sur le capital (cantonal uniquement)\nImpôt anticipé 35% sur dividendes\nImposition réduite des participations qualifiées\nNeutralité fiscale des restructurations',
          de: 'Gewinnsteuer (8,5% Bund + kantonal)\nKapitalsteuer (nur kantonal)\n35% Verrechnungssteuer auf Dividenden\nReduzierte Besteuerung qualifizierter Beteiligungen\nSteuerliche Neutralität bei Restrukturierungen',
          it: 'Imposta sull\'utile (8,5% federale + cantonale)\nImposta sul capitale (solo cantonale)\nImposta preventiva 35% su dividendi\nImposizione ridotta partecipazioni qualificate\nNeutralità fiscale delle ristrutturazioni',
          en: 'Profit tax (8.5% federal + cantonal)\nCapital tax (cantonal only)\n35% withholding tax on dividends\nReduced taxation of qualified participations\nTax neutrality of restructurings'
        }
      },
      'impots-indirects': {
        title: {
          fr: 'Impôts indirects et sur la consommation',
          de: 'Indirekte Steuern und Verbrauchssteuern',
          it: 'Imposte indirette e sui consumi',
          en: 'Indirect and consumption taxes'
        },
        content: {
          fr: 'La TVA représente la principale recette de la Confédération avec environ 23 milliards CHF annuels. Avec ses trois taux (8.1%, 2.6%, 3.8%), elle reste modérée en comparaison internationale. Le système de déduction de l\'impôt préalable garantit la neutralité pour les entreprises.\n\nLes impôts sur les huiles minérales (essence, diesel) combinent objectifs fiscaux et écologiques. Ils incluent l\'impôt sur les huiles minérales proprement dit et la surtaxe, rapportant ensemble environ 5 milliards annuels. Une partie finance les routes, une autre les transports publics.\n\nLes impôts sur le tabac et l\'alcool ont une dimension de santé publique. Ils visent à décourager la consommation tout en générant des recettes. L\'impôt sur le tabac rapporte environ 2 milliards, celui sur l\'alcool 300 millions.\n\nLes droits de timbre frappent certaines transactions sur titres et les primes d\'assurance. Critiqués pour leur effet sur la place financière, ils sont régulièrement remis en question mais rapportent encore 2 milliards annuels.',
          de: 'Die Mehrwertsteuer stellt die Haupteinnahme des Bundes mit etwa 23 Milliarden CHF jährlich dar. Mit ihren drei Sätzen (8,1%, 2,6%, 3,8%) bleibt sie im internationalen Vergleich moderat. Das Vorsteuerabzugssystem garantiert Neutralität für Unternehmen.\n\nDie Mineralölsteuern (Benzin, Diesel) verbinden fiskalische und ökologische Ziele. Sie umfassen die eigentliche Mineralölsteuer und den Zuschlag, die zusammen etwa 5 Milliarden jährlich einbringen. Ein Teil finanziert Straßen, ein anderer den öffentlichen Verkehr.\n\nDie Steuern auf Tabak und Alkohol haben eine öffentliche Gesundheitsdimension. Sie zielen darauf ab, den Konsum zu entmutigen und gleichzeitig Einnahmen zu generieren. Die Tabaksteuer bringt etwa 2 Milliarden ein, die Alkoholsteuer 300 Millionen.\n\nStempelabgaben treffen bestimmte Wertpapiertransaktionen und Versicherungsprämien. Wegen ihrer Auswirkung auf den Finanzplatz kritisiert, werden sie regelmäßig in Frage gestellt, bringen aber noch 2 Milliarden jährlich ein.',
          it: 'L\'IVA rappresenta la principale entrata della Confederazione con circa 23 miliardi di CHF annui. Con le sue tre aliquote (8,1%, 2,6%, 3,8%), rimane moderata nel confronto internazionale. Il sistema di detrazione dell\'imposta precedente garantisce neutralità per le imprese.\n\nLe imposte sugli oli minerali (benzina, diesel) combinano obiettivi fiscali ed ecologici. Includono l\'imposta sugli oli minerali propriamente detta e la sovrattassa, portando insieme circa 5 miliardi annui. Una parte finanzia le strade, un\'altra i trasporti pubblici.\n\nLe imposte su tabacco e alcol hanno una dimensione di salute pubblica. Mirano a scoraggiare il consumo generando al contempo entrate. L\'imposta sul tabacco porta circa 2 miliardi, quella sull\'alcol 300 milioni.\n\nI diritti di bollo colpiscono certe transazioni su titoli e i premi di assicurazione. Criticati per il loro effetto sulla piazza finanziaria, sono regolarmente rimessi in discussione ma portano ancora 2 miliardi annui.',
          en: 'VAT represents the main revenue of the Confederation with about 23 billion CHF annually. With its three rates (8.1%, 2.6%, 3.8%), it remains moderate in international comparison. The input tax deduction system guarantees neutrality for companies.\n\nMineral oil taxes (gasoline, diesel) combine fiscal and ecological objectives. They include the mineral oil tax proper and the surcharge, bringing together about 5 billion annually. Part finances roads, another public transport.\n\nTobacco and alcohol taxes have a public health dimension. They aim to discourage consumption while generating revenue. Tobacco tax brings about 2 billion, alcohol tax 300 million.\n\nStamp duties hit certain securities transactions and insurance premiums. Criticized for their effect on the financial center, they are regularly questioned but still bring 2 billion annually.'
        },
        keyPoints: {
          fr: 'TVA : principale recette fédérale\nImpôts sur carburants à double objectif\nTaxes comportementales (tabac, alcool)\nDroits de timbre controversés\nNeutralité pour les entreprises (TVA)',
          de: 'MWST: Haupteinnahme des Bundes\nTreibstoffsteuern mit doppeltem Ziel\nVerhaltensbeeinflussende Steuern (Tabak, Alkohol)\nUmstrittene Stempelabgaben\nNeutralität für Unternehmen (MWST)',
          it: 'IVA: principale entrata federale\nImposte carburanti a doppio obiettivo\nTasse comportamentali (tabacco, alcol)\nDiritti di bollo controversi\nNeutralità per le imprese (IVA)',
          en: 'VAT: main federal revenue\nFuel taxes with dual objective\nBehavioral taxes (tobacco, alcohol)\nControversial stamp duties\nNeutrality for companies (VAT)'
        },
        example: {
          fr: 'Un fumeur paie environ 60% de taxes sur un paquet de cigarettes : TVA plus impôt sur le tabac, soit une contribution fiscale importante sur sa consommation.',
          de: 'Ein Raucher zahlt etwa 60% Steuern auf eine Zigarettenschachtel: MWST plus Tabaksteuer, also einen wichtigen Steuerbeitrag auf seinen Konsum.',
          it: 'Un fumatore paga circa il 60% di tasse su un pacchetto di sigarette: IVA più imposta sul tabacco, quindi un contributo fiscale importante sul suo consumo.',
          en: 'A smoker pays about 60% tax on a pack of cigarettes: VAT plus tobacco tax, a significant tax contribution on their consumption.'
        }
      },
      'impots-speciaux': {
        title: {
          fr: 'Impôts spéciaux et taxes causales',
          de: 'Sondersteuern und Kausalabgaben',
          it: 'Imposte speciali e tasse causali',
          en: 'Special taxes and causal levies'
        },
        content: {
          fr: 'Au-delà des grands impôts, une multitude de taxes spéciales existe à tous les niveaux. L\'impôt sur les véhicules, cantonal, combine une taxe de base et souvent une composante écologique basée sur les émissions CO2.\n\nL\'impôt sur les gains immobiliers, exclusivement cantonal, frappe les plus-values réalisées sur les immeubles. Les taux peuvent être dégressifs selon la durée de détention, encourageant la stabilité du marché immobilier.\n\nLes droits de mutation immobilière, également cantonaux, frappent les transferts de propriété. Ils varient de 0.2% à 3.5% selon les cantons. Certains cantons les ont supprimés pour favoriser l\'accès à la propriété.\n\nLes taxes causales (eau, épuration, déchets) suivent le principe du pollueur-payeur. Elles financent des services spécifiques et doivent respecter le principe d\'équivalence entre la taxe et la prestation.',
          de: 'Über die großen Steuern hinaus existiert eine Vielzahl von Sondersteuern auf allen Ebenen. Die Fahrzeugsteuer, kantonal, kombiniert eine Grundsteuer und oft eine ökologische Komponente basierend auf CO2-Emissionen.\n\nDie Grundstückgewinnsteuer, ausschließlich kantonal, erfasst bei Liegenschaften realisierte Wertsteigerungen. Die Sätze können je nach Besitzdauer degressiv sein und fördern die Stabilität des Immobilienmarktes.\n\nHandänderungssteuern, ebenfalls kantonal, erfassen Eigentumsübertragungen. Sie variieren von 0,2% bis 3,5% je nach Kanton. Einige Kantone haben sie abgeschafft, um den Zugang zu Eigentum zu fördern.\n\nKausalabgaben (Wasser, Reinigung, Abfall) folgen dem Verursacherprinzip. Sie finanzieren spezifische Dienstleistungen und müssen das Äquivalenzprinzip zwischen Abgabe und Leistung respektieren.',
          it: 'Oltre alle grandi imposte, esiste una moltitudine di tasse speciali a tutti i livelli. L\'imposta sui veicoli, cantonale, combina una tassa di base e spesso una componente ecologica basata sulle emissioni CO2.\n\nL\'imposta sui guadagni immobiliari, esclusivamente cantonale, colpisce le plusvalenze realizzate sugli immobili. Le aliquote possono essere degressive secondo la durata di detenzione, incoraggiando la stabilità del mercato immobiliare.\n\nI diritti di mutazione immobiliare, anch\'essi cantonali, colpiscono i trasferimenti di proprietà. Variano dallo 0,2% al 3,5% secondo i cantoni. Alcuni cantoni li hanno soppressi per favorire l\'accesso alla proprietà.\n\nLe tasse causali (acqua, depurazione, rifiuti) seguono il principio chi inquina paga. Finanziano servizi specifici e devono rispettare il principio di equivalenza tra tassa e prestazione.',
          en: 'Beyond the major taxes, a multitude of special taxes exists at all levels. Vehicle tax, cantonal, combines a base tax and often an ecological component based on CO2 emissions.\n\nReal estate capital gains tax, exclusively cantonal, hits capital gains realized on real estate. Rates can be regressive according to holding period, encouraging stability of the real estate market.\n\nReal estate transfer duties, also cantonal, hit property transfers. They vary from 0.2% to 3.5% depending on cantons. Some cantons have abolished them to promote access to property.\n\nCausal taxes (water, sewage, waste) follow the polluter-pays principle. They finance specific services and must respect the equivalence principle between tax and service.'
        },
        keyPoints: {
          fr: 'Impôt sur les véhicules avec composante écologique\nGains immobiliers imposés au niveau cantonal\nDroits de mutation variables\nTaxes causales selon le principe d\'équivalence\nGrande diversité selon les cantons',
          de: 'Fahrzeugsteuer mit ökologischer Komponente\nGrundstückgewinne kantonal besteuert\nVariable Handänderungssteuern\nKausalabgaben nach Äquivalenzprinzip\nGroße Vielfalt je nach Kanton',
          it: 'Imposta sui veicoli con componente ecologica\nGuadagni immobiliari tassati a livello cantonale\nDiritti di mutazione variabili\nTasse causali secondo principio equivalenza\nGrande diversità secondo i cantoni',
          en: 'Vehicle tax with ecological component\nReal estate gains taxed at cantonal level\nVariable transfer duties\nCausal taxes according to equivalence principle\nGreat diversity according to cantons'
        },
        example: {
          fr: 'La vente d\'un appartement à Genève après 5 ans de détention peut générer un impôt sur le gain immobilier de 20-30% de la plus-value, plus les droits de mutation pour l\'acheteur.',
          de: 'Der Verkauf einer Wohnung in Genf nach 5 Jahren Besitz kann eine Grundstückgewinnsteuer von 20-30% der Wertsteigerung generieren, plus Handänderungssteuern für den Käufer.',
          it: 'La vendita di un appartamento a Ginevra dopo 5 anni di detenzione può generare un\'imposta sul guadagno immobiliare del 20-30% della plusvalenza, più i diritti di mutazione per l\'acquirente.',
          en: 'The sale of an apartment in Geneva after 5 years of ownership can generate a real estate capital gains tax of 20-30% of the capital gain, plus transfer duties for the buyer.'
        }
      }
    }
  },
  'domicile-fiscal': {
    title: {
      fr: 'Domicile fiscal et résidence',
      de: 'Steuerdomizil und Wohnsitz',
      it: 'Domicilio fiscale e residenza',
      en: 'Tax domicile and residence'
    },
    description: {
      fr: 'Comprendre les critères de détermination du domicile fiscal, la distinction avec la résidence, et les implications pour l\'imposition',
      de: 'Die Kriterien zur Bestimmung des Steuerdomizils verstehen, die Unterscheidung zum Wohnsitz und die Auswirkungen auf die Besteuerung',
      it: 'Comprendere i criteri di determinazione del domicilio fiscale, la distinzione con la residenza e le implicazioni per l\'imposizione',
      en: 'Understanding the criteria for determining tax domicile, the distinction with residence, and the implications for taxation'
    },
    content: {
      fr: '',
      de: '',
      it: '',
      en: ''
    },
    sections: {
      'definition-domicile': {
        title: {
          fr: 'Définition du domicile fiscal',
          de: 'Definition des Steuerdomizils',
          it: 'Definizione del domicilio fiscale',
          en: 'Definition of tax domicile'
        },
        content: {
          fr: 'Le domicile fiscal détermine où une personne doit payer ses impôts sur l\'ensemble de ses revenus et sa fortune mondiale. En Suisse, le domicile fiscal suit généralement le domicile civil défini par le Code civil, mais des critères fiscaux spécifiques s\'appliquent.\n\nUne personne a son domicile fiscal en Suisse si elle y réside avec l\'intention de s\'y établir durablement, ou si elle y séjourne sans interruption notable pendant au moins 90 jours avec activité lucrative, ou 180 jours sans activité. Le centre des intérêts vitaux (famille, travail, liens sociaux) est déterminant.\n\nLe domicile fiscal est unique : on ne peut avoir qu\'un seul domicile fiscal principal, même si on possède plusieurs résidences. En cas de doute, les autorités examinent où se trouve le centre des intérêts vitaux de la personne.\n\nLe changement de domicile fiscal a des conséquences importantes : fin de l\'assujettissement illimité dans l\'ancien canton, début dans le nouveau, avec répartition pro rata temporis pour l\'année du déménagement.',
          de: 'Das Steuerdomizil bestimmt, wo eine Person ihre Steuern auf ihr gesamtes Einkommen und Weltvermögen zahlen muss. In der Schweiz folgt das Steuerdomizil im Allgemeinen dem im Zivilgesetzbuch definierten zivilrechtlichen Wohnsitz, aber spezifische steuerliche Kriterien gelten.\n\nEine Person hat ihr Steuerdomizil in der Schweiz, wenn sie dort mit der Absicht wohnt, sich dauerhaft niederzulassen, oder wenn sie dort ohne wesentliche Unterbrechung mindestens 90 Tage mit Erwerbstätigkeit oder 180 Tage ohne Tätigkeit verbringt. Der Mittelpunkt der Lebensinteressen (Familie, Arbeit, soziale Bindungen) ist entscheidend.\n\nDas Steuerdomizil ist einzigartig: Man kann nur ein Hauptsteuerdomizil haben, auch wenn man mehrere Wohnsitze besitzt. Im Zweifel prüfen die Behörden, wo sich der Mittelpunkt der Lebensinteressen der Person befindet.\n\nDie Änderung des Steuerdomizils hat wichtige Konsequenzen: Ende der unbeschränkten Steuerpflicht im alten Kanton, Beginn im neuen, mit zeitanteiliger Aufteilung für das Umzugsjahr.',
          it: 'Il domicilio fiscale determina dove una persona deve pagare le sue imposte sull\'insieme dei suoi redditi e del patrimonio mondiale. In Svizzera, il domicilio fiscale segue generalmente il domicilio civile definito dal Codice civile, ma si applicano criteri fiscali specifici.\n\nUna persona ha il suo domicilio fiscale in Svizzera se vi risiede con l\'intenzione di stabilirvisi durevolmente, o se vi soggiorna senza interruzione notevole per almeno 90 giorni con attività lucrativa, o 180 giorni senza attività. Il centro degli interessi vitali (famiglia, lavoro, legami sociali) è determinante.\n\nIl domicilio fiscale è unico: non si può avere che un solo domicilio fiscale principale, anche se si possiedono più residenze. In caso di dubbio, le autorità esaminano dove si trova il centro degli interessi vitali della persona.\n\nIl cambiamento di domicilio fiscale ha conseguenze importanti: fine dell\'assoggettamento illimitato nel vecchio cantone, inizio nel nuovo, con ripartizione pro rata temporis per l\'anno del trasloco.',
          en: 'Tax domicile determines where a person must pay taxes on all their income and worldwide wealth. In Switzerland, tax domicile generally follows the civil domicile defined by the Civil Code, but specific tax criteria apply.\n\nA person has their tax domicile in Switzerland if they reside there with the intention of settling permanently, or if they stay there without notable interruption for at least 90 days with gainful activity, or 180 days without activity. The center of vital interests (family, work, social ties) is decisive.\n\nTax domicile is unique: one can only have one main tax domicile, even if owning multiple residences. In case of doubt, authorities examine where the person\'s center of vital interests is located.\n\nChanging tax domicile has important consequences: end of unlimited tax liability in the old canton, beginning in the new one, with pro rata temporis distribution for the moving year.'
        },
        keyPoints: {
          fr: 'Domicile unique déterminant l\'assujettissement\nCritères : intention durable ou séjour prolongé\nCentre des intérêts vitaux décisif\n90 jours avec activité ou 180 sans\nRépartition pro rata en cas de changement',
          de: 'Einzigartiges Domizil bestimmt Steuerpflicht\nKriterien: dauerhafte Absicht oder längerer Aufenthalt\nMittelpunkt der Lebensinteressen entscheidend\n90 Tage mit Tätigkeit oder 180 ohne\nZeitanteilige Aufteilung bei Wechsel',
          it: 'Domicilio unico determinante l\'assoggettamento\nCriteri: intenzione durevole o soggiorno prolungato\nCentro degli interessi vitali decisivo\n90 giorni con attività o 180 senza\nRipartizione pro rata in caso di cambiamento',
          en: 'Unique domicile determining tax liability\nCriteria: permanent intention or prolonged stay\nCenter of vital interests decisive\n90 days with activity or 180 without\nPro rata distribution in case of change'
        },
        example: {
          fr: 'Un cadre international qui passe 200 jours par an en Suisse, y a sa famille et ses principaux liens sociaux, aura son domicile fiscal en Suisse même s\'il voyage fréquemment.',
          de: 'Eine internationale Führungskraft, die 200 Tage pro Jahr in der Schweiz verbringt, dort ihre Familie und hauptsächlichen sozialen Bindungen hat, wird ihr Steuerdomizil in der Schweiz haben, auch wenn sie häufig reist.',
          it: 'Un dirigente internazionale che passa 200 giorni all\'anno in Svizzera, vi ha la sua famiglia e i suoi principali legami sociali, avrà il suo domicilio fiscale in Svizzera anche se viaggia frequentemente.',
          en: 'An international executive who spends 200 days a year in Switzerland, has their family and main social ties there, will have their tax domicile in Switzerland even if they travel frequently.'
        }
      },
      'residence-secondaire': {
        title: {
          fr: 'Résidence secondaire et séjour',
          de: 'Zweitwohnsitz und Aufenthalt',
          it: 'Residenza secondaria e soggiorno',
          en: 'Secondary residence and stay'
        },
        content: {
          fr: 'La résidence secondaire crée un assujettissement limité : seuls les revenus et la fortune situés dans le canton de la résidence secondaire y sont imposables. C\'est typiquement le cas pour les propriétaires de chalets de vacances.\n\nLe séjour fiscal, distinct du domicile, peut créer un assujettissement temporaire. Les travailleurs saisonniers, étudiants ou personnes en formation sont souvent assujettis sur la base du séjour, avec des règles spécifiques.\n\nLa distinction est cruciale : le domicile entraîne l\'assujettissement illimité (revenus mondiaux), la résidence seulement l\'assujettissement limité (revenus locaux). Les cantons se coordonnent pour éviter la double imposition intercantonale.\n\nLes week-ends passés hors du lieu de travail ne constituent généralement pas une interruption notable du séjour. Les autorités regardent la situation globale sur l\'année, pas les déplacements ponctuels.',
          de: 'Der Zweitwohnsitz schafft eine beschränkte Steuerpflicht: nur die im Kanton des Zweitwohnsitzes gelegenen Einkommen und Vermögen sind dort steuerpflichtig. Dies ist typischerweise bei Besitzern von Ferienchalets der Fall.\n\nDer steuerliche Aufenthalt, verschieden vom Wohnsitz, kann eine temporäre Steuerpflicht schaffen. Saisonarbeiter, Studenten oder Personen in Ausbildung sind oft aufgrund des Aufenthalts steuerpflichtig, mit spezifischen Regeln.\n\nDie Unterscheidung ist entscheidend: Der Wohnsitz führt zur unbeschränkten Steuerpflicht (Welteinkommen), der Aufenthalt nur zur beschränkten Steuerpflicht (lokale Einkommen). Die Kantone koordinieren sich, um interkantonale Doppelbesteuerung zu vermeiden.\n\nWochenenden außerhalb des Arbeitsorts stellen im Allgemeinen keine wesentliche Unterbrechung des Aufenthalts dar. Die Behörden betrachten die Gesamtsituation über das Jahr, nicht punktuelle Bewegungen.',
          it: 'La residenza secondaria crea un assoggettamento limitato: solo i redditi e il patrimonio situati nel cantone della residenza secondaria vi sono imponibili. È tipicamente il caso dei proprietari di chalet per le vacanze.\n\nIl soggiorno fiscale, distinto dal domicilio, può creare un assoggettamento temporaneo. I lavoratori stagionali, studenti o persone in formazione sono spesso assoggettati sulla base del soggiorno, con regole specifiche.\n\nLa distinzione è cruciale: il domicilio comporta l\'assoggettamento illimitato (redditi mondiali), la residenza solo l\'assoggettamento limitato (redditi locali). I cantoni si coordinano per evitare la doppia imposizione intercantonale.\n\nI weekend passati fuori dal luogo di lavoro non costituiscono generalmente un\'interruzione notevole del soggiorno. Le autorità guardano la situazione globale sull\'anno, non gli spostamenti puntuali.',
          en: 'Secondary residence creates limited tax liability: only income and wealth located in the canton of secondary residence are taxable there. This is typically the case for holiday chalet owners.\n\nTax residence, distinct from domicile, can create temporary tax liability. Seasonal workers, students or people in training are often subject to tax based on residence, with specific rules.\n\nThe distinction is crucial: domicile leads to unlimited tax liability (worldwide income), residence only to limited tax liability (local income). Cantons coordinate to avoid intercantonal double taxation.\n\nWeekends spent away from the workplace generally do not constitute a notable interruption of residence. Authorities look at the overall situation over the year, not specific movements.'
        },
        keyPoints: {
          fr: 'Résidence secondaire = assujettissement limité\nSéjour peut créer assujettissement temporaire\nDistinction domicile (illimité) / résidence (limité)\nCoordination intercantonale contre double imposition\nVue d\'ensemble annuelle, pas ponctuelle',
          de: 'Zweitwohnsitz = beschränkte Steuerpflicht\nAufenthalt kann temporäre Steuerpflicht schaffen\nUnterscheidung Wohnsitz (unbeschränkt) / Aufenthalt (beschränkt)\nInterkantonale Koordination gegen Doppelbesteuerung\nGesamtjahresbetrachtung, nicht punktuell',
          it: 'Residenza secondaria = assoggettamento limitato\nSoggiorno può creare assoggettamento temporaneo\nDistinzione domicilio (illimitato) / residenza (limitato)\nCoordinamento intercantonale contro doppia imposizione\nVisione d\'insieme annuale, non puntuale',
          en: 'Secondary residence = limited tax liability\nStay can create temporary tax liability\nDistinction domicile (unlimited) / residence (limited)\nIntercantonal coordination against double taxation\nAnnual overview, not punctual'
        },
        example: {
          fr: 'Un Zurichois propriétaire d\'un chalet à Verbier paiera l\'impôt sur la valeur locative et la fortune immobilière en Valais, mais ses autres revenus restent imposables à Zurich.',
          de: 'Ein Zürcher Besitzer eines Chalets in Verbier zahlt Steuer auf den Eigenmietwert und das Immobilienvermögen im Wallis, aber seine anderen Einkommen bleiben in Zürich steuerpflichtig.',
          it: 'Un zurighese proprietario di uno chalet a Verbier pagherà l\'imposta sul valore locativo e il patrimonio immobiliare in Vallese, ma i suoi altri redditi rimangono imponibili a Zurigo.',
          en: 'A Zurich resident owning a chalet in Verbier will pay tax on rental value and real estate wealth in Valais, but their other income remains taxable in Zurich.'
        }
      },
      'determination-pratique': {
        title: {
          fr: 'Détermination pratique et indices',
          de: 'Praktische Bestimmung und Indizien',
          it: 'Determinazione pratica e indizi',
          en: 'Practical determination and indicators'
        },
        content: {
          fr: 'Les autorités fiscales utilisent un faisceau d\'indices pour déterminer le domicile fiscal en cas de doute. Aucun critère n\'est à lui seul déterminant, c\'est l\'ensemble qui compte.\n\nLes indices principaux incluent : lieu de résidence de la famille, lieu de travail principal, inscription au registre des habitants, centre des relations sociales, lieu d\'exercice des droits politiques, plaques de véhicules, abonnements et affiliations.\n\nLe logement disponible en permanence est un indice fort, surtout s\'il s\'agit du logement familial. La location de sa résidence principale est souvent vue comme un signe de déplacement du domicile.\n\nEn cas de conflit entre cantons ou avec l\'étranger, des procédures de conciliation existent. Les conventions de double imposition contiennent des règles de départage (tie-breaker rules) pour les cas complexes.',
          de: 'Die Steuerbehörden verwenden ein Bündel von Indizien zur Bestimmung des Steuerdomizils bei Zweifel. Kein Kriterium ist allein entscheidend, es zählt das Gesamtbild.\n\nDie Hauptindizien umfassen: Wohnort der Familie, Hauptarbeitsplatz, Einwohnerregister-Eintragung, Zentrum der sozialen Beziehungen, Ort der Ausübung politischer Rechte, Fahrzeugkennzeichen, Abonnements und Mitgliedschaften.\n\nDie permanent verfügbare Wohnung ist ein starkes Indiz, besonders wenn es sich um die Familienwohnung handelt. Die Vermietung der Hauptwohnung wird oft als Zeichen der Domizilverlegung gesehen.\n\nBei Konflikten zwischen Kantonen oder mit dem Ausland bestehen Schlichtungsverfahren. Doppelbesteuerungsabkommen enthalten Entscheidungsregeln (tie-breaker rules) für komplexe Fälle.',
          it: 'Le autorità fiscali utilizzano un fascio di indizi per determinare il domicilio fiscale in caso di dubbio. Nessun criterio è da solo determinante, è l\'insieme che conta.\n\nGli indizi principali includono: luogo di residenza della famiglia, luogo di lavoro principale, iscrizione al registro degli abitanti, centro delle relazioni sociali, luogo di esercizio dei diritti politici, targhe dei veicoli, abbonamenti e affiliazioni.\n\nL\'alloggio disponibile permanentemente è un indizio forte, soprattutto se si tratta dell\'alloggio familiare. L\'affitto della propria residenza principale è spesso visto come un segno di spostamento del domicilio.\n\nIn caso di conflitto tra cantoni o con l\'estero, esistono procedure di conciliazione. Le convenzioni di doppia imposizione contengono regole di spareggio (tie-breaker rules) per i casi complessi.',
          en: 'Tax authorities use a bundle of indicators to determine tax domicile in case of doubt. No single criterion is decisive, it\'s the whole picture that counts.\n\nMain indicators include: family residence location, main workplace, resident registry registration, center of social relations, place of exercising political rights, vehicle plates, subscriptions and affiliations.\n\nPermanently available housing is a strong indicator, especially if it\'s the family home. Renting out one\'s main residence is often seen as a sign of domicile relocation.\n\nIn case of conflicts between cantons or with abroad, conciliation procedures exist. Double taxation conventions contain tie-breaker rules for complex cases.'
        },
        keyPoints: {
          fr: 'Faisceau d\'indices, pas de critère unique\nFamille et travail sont des indices forts\nLogement permanent disponible important\nProcédures de conciliation en cas de conflit\nConventions internationales pour cas complexes',
          de: 'Indizienbündel, kein einzelnes Kriterium\nFamilie und Arbeit sind starke Indizien\nPermanent verfügbare Wohnung wichtig\nSchlichtungsverfahren bei Konflikten\nInternationale Abkommen für komplexe Fälle',
          it: 'Fascio di indizi, non criterio unico\nFamiglia e lavoro sono indizi forti\nAlloggio permanente disponibile importante\nProcedure di conciliazione in caso di conflitto\nConvenzioni internazionali per casi complessi',
          en: 'Bundle of indicators, no single criterion\nFamily and work are strong indicators\nPermanently available housing important\nConciliation procedures in case of conflict\nInternational conventions for complex cases'
        }
      },
      'cas-particuliers': {
        title: {
          fr: 'Cas particuliers et situations spéciales',
          de: 'Besondere Fälle und spezielle Situationen',
          it: 'Casi particolari e situazioni speciali',
          en: 'Special cases and particular situations'
        },
        content: {
          fr: 'Les frontaliers constituent un cas particulier : ils conservent leur domicile fiscal dans leur pays de résidence mais sont imposés sur leur salaire suisse selon les accords bilatéraux spécifiques à chaque pays voisin.\n\nLes diplomates et fonctionnaires internationaux bénéficient souvent de privilèges fiscaux. Leur domicile fiscal peut rester dans leur pays d\'origine malgré une présence prolongée en Suisse.\n\nLes étudiants gardent généralement leur domicile fiscal chez leurs parents, sauf s\'ils s\'établissent durablement avec une activité lucrative. Le simple fait d\'étudier ne crée pas un nouveau domicile fiscal.\n\nLes rentiers étrangers peuvent bénéficier de l\'imposition d\'après la dépense (forfait fiscal) s\'ils n\'exercent pas d\'activité lucrative en Suisse. Leur domicile fiscal est en Suisse mais avec un régime d\'imposition spécial.',
          de: 'Grenzgänger sind ein besonderer Fall: Sie behalten ihr Steuerdomizil in ihrem Wohnland, werden aber auf ihren Schweizer Lohn gemäß den bilateralen Abkommen mit jedem Nachbarland besteuert.\n\nDiplomaten und internationale Beamte profitieren oft von steuerlichen Privilegien. Ihr Steuerdomizil kann trotz längerer Anwesenheit in der Schweiz in ihrem Herkunftsland bleiben.\n\nStudenten behalten im Allgemeinen ihr Steuerdomizil bei ihren Eltern, außer sie lassen sich dauerhaft mit einer Erwerbstätigkeit nieder. Das bloße Studieren schafft kein neues Steuerdomizil.\n\nAusländische Rentner können von der Besteuerung nach dem Aufwand (Pauschalbesteuerung) profitieren, wenn sie keine Erwerbstätigkeit in der Schweiz ausüben. Ihr Steuerdomizil ist in der Schweiz, aber mit einem besonderen Besteuerungsregime.',
          it: 'I frontalieri costituiscono un caso particolare: conservano il loro domicilio fiscale nel loro paese di residenza ma sono tassati sul loro salario svizzero secondo gli accordi bilaterali specifici a ogni paese vicino.\n\nI diplomatici e funzionari internazionali beneficiano spesso di privilegi fiscali. Il loro domicilio fiscale può rimanere nel loro paese d\'origine nonostante una presenza prolungata in Svizzera.\n\nGli studenti mantengono generalmente il loro domicilio fiscale presso i loro genitori, salvo se si stabiliscono durevolmente con un\'attività lucrativa. Il semplice fatto di studiare non crea un nuovo domicilio fiscale.\n\nI rentier stranieri possono beneficiare dell\'imposizione secondo la spesa (forfait fiscale) se non esercitano attività lucrativa in Svizzera. Il loro domicilio fiscale è in Svizzera ma con un regime di imposizione speciale.',
          en: 'Cross-border workers are a special case: they keep their tax domicile in their country of residence but are taxed on their Swiss salary according to bilateral agreements specific to each neighboring country.\n\nDiplomats and international civil servants often benefit from tax privileges. Their tax domicile can remain in their country of origin despite prolonged presence in Switzerland.\n\nStudents generally keep their tax domicile with their parents, unless they settle permanently with gainful employment. Simply studying does not create a new tax domicile.\n\nForeign retirees can benefit from expenditure-based taxation (lump-sum taxation) if they do not exercise gainful activity in Switzerland. Their tax domicile is in Switzerland but with a special taxation regime.'
        },
        keyPoints: {
          fr: 'Frontaliers : règles spéciales par pays\nDiplomates : privilèges et immunités\nÉtudiants : domicile parental maintenu\nForfait fiscal pour rentiers étrangers\nConventions bilatérales déterminantes',
          de: 'Grenzgänger: spezielle Regeln pro Land\nDiplomaten: Privilegien und Immunitäten\nStudenten: elterliches Domizil beibehalten\nPauschalbesteuerung für ausländische Rentner\nBilaterale Abkommen entscheidend',
          it: 'Frontalieri: regole speciali per paese\nDiplomatici: privilegi e immunità\nStudenti: domicilio parentale mantenuto\nForfait fiscale per rentier stranieri\nConvenzioni bilaterali determinanti',
          en: 'Cross-border workers: special rules per country\nDiplomats: privileges and immunities\nStudents: parental domicile maintained\nLump-sum taxation for foreign retirees\nBilateral conventions decisive'
        }
      },
      'consequences-changement': {
        title: {
          fr: 'Conséquences du changement de domicile',
          de: 'Folgen der Domizilwechsels',
          it: 'Conseguenze del cambiamento di domicilio',
          en: 'Consequences of domicile change'
        },
        content: {
          fr: 'Le départ de Suisse entraîne la fin de l\'assujettissement illimité. Une "exit tax" peut s\'appliquer sur certains éléments, notamment les prestations de prévoyance non encore imposées.\n\nL\'arrivée en Suisse crée l\'assujettissement dès le premier jour. Les revenus acquis avant l\'arrivée ne sont pas imposables, mais la fortune mondiale devient imposable immédiatement. Une planification est souvent nécessaire.\n\nLe déménagement intercantonal nécessite une répartition précise des revenus et déductions entre les cantons. Chaque canton applique son propre barème sur la quote-part qui lui revient. Les différences de charge fiscale peuvent être significatives.\n\nLes implications vont au-delà des impôts : assurances sociales, droit de vote, scolarité des enfants. Une approche globale est nécessaire lors d\'un changement de domicile.',
          de: 'Die Abreise aus der Schweiz führt zum Ende der unbeschränkten Steuerpflicht. Eine "Exit Tax" kann auf bestimmte Elemente angewendet werden, insbesondere noch nicht besteuerte Vorsorgeleistungen.\n\nDie Ankunft in der Schweiz schafft Steuerpflicht ab dem ersten Tag. Vor der Ankunft erworbene Einkommen sind nicht steuerpflichtig, aber das Weltvermögen wird sofort steuerpflichtig. Eine Planung ist oft notwendig.\n\nDer interkantonale Umzug erfordert eine genaue Aufteilung der Einkommen und Abzüge zwischen den Kantonen. Jeder Kanton wendet seinen eigenen Tarif auf den ihm zustehenden Anteil an. Die Unterschiede in der Steuerbelastung können erheblich sein.\n\nDie Auswirkungen gehen über Steuern hinaus: Sozialversicherungen, Wahlrecht, Schulbildung der Kinder. Ein ganzheitlicher Ansatz ist bei einem Domizilwechsel notwendig.',
          it: 'La partenza dalla Svizzera comporta la fine dell\'assoggettamento illimitato. Una "exit tax" può applicarsi su certi elementi, in particolare le prestazioni di previdenza non ancora tassate.\n\nL\'arrivo in Svizzera crea l\'assoggettamento dal primo giorno. I redditi acquisiti prima dell\'arrivo non sono imponibili, ma il patrimonio mondiale diventa imponibile immediatamente. Una pianificazione è spesso necessaria.\n\nIl trasloco intercantonale necessita una ripartizione precisa dei redditi e detrazioni tra i cantoni. Ogni cantone applica la propria tariffa sulla quota che gli spetta. Le differenze di carico fiscale possono essere significative.\n\nLe implicazioni vanno oltre le imposte: assicurazioni sociali, diritto di voto, scolarità dei bambini. Un approccio globale è necessario durante un cambiamento di domicilio.',
          en: 'Departure from Switzerland leads to the end of unlimited tax liability. An "exit tax" may apply to certain elements, particularly pension benefits not yet taxed.\n\nArrival in Switzerland creates tax liability from day one. Income earned before arrival is not taxable, but worldwide wealth becomes taxable immediately. Planning is often necessary.\n\nIntercantonal moves require precise distribution of income and deductions between cantons. Each canton applies its own scale to its share. Differences in tax burden can be significant.\n\nImplications go beyond taxes: social insurance, voting rights, children\'s schooling. A comprehensive approach is necessary when changing domicile.'
        },
        keyPoints: {
          fr: 'Exit tax possible au départ de Suisse\nAssujettissement immédiat à l\'arrivée\nRépartition complexe entre cantons\nDifférences de charge fiscale importantes\nImplications au-delà de la fiscalité',
          de: 'Exit Tax möglich bei Abreise aus der Schweiz\nSofortige Steuerpflicht bei Ankunft\nKomplexe Aufteilung zwischen Kantonen\nErhebliche Unterschiede in Steuerbelastung\nAuswirkungen über Steuern hinaus',
          it: 'Exit tax possibile alla partenza dalla Svizzera\nAssoggettamento immediato all\'arrivo\nRipartizione complessa tra cantoni\nDifferenze di carico fiscale importanti\nImplicazioni oltre la fiscalità',
          en: 'Exit tax possible when leaving Switzerland\nImmediate tax liability upon arrival\nComplex distribution between cantons\nSignificant differences in tax burden\nImplications beyond taxation'
        },
        example: {
          fr: 'Un déménagement de Genève (charge fiscale élevée) à Zoug (charge faible) peut réduire les impôts de 30-40% pour les hauts revenus, justifiant une planification minutieuse.',
          de: 'Ein Umzug von Genf (hohe Steuerbelastung) nach Zug (geringe Belastung) kann die Steuern für hohe Einkommen um 30-40% reduzieren, was eine sorgfältige Planung rechtfertigt.',
          it: 'Un trasloco da Ginevra (carico fiscale elevato) a Zugo (carico basso) può ridurre le imposte del 30-40% per i redditi alti, giustificando una pianificazione minuziosa.',
          en: 'A move from Geneva (high tax burden) to Zug (low burden) can reduce taxes by 30-40% for high incomes, justifying careful planning.'
        }
      }
    }
  },

  'baremes-progressivite': {
    title: {
      fr: 'Barèmes et progressivité de l\'impôt',
      de: 'Steuertarife und Progressivität',
      it: 'Tariffe e progressività dell\'imposta',
      en: 'Tax scales and progressivity'
    },
    description: {
      fr: 'Comprendre les barèmes d\'imposition, la progressivité, les taux marginaux et effectifs en Suisse',
      de: 'Verstehen Sie die Besteuerungstarife, Progressivität, Grenz- und Effektivsteuersätze in der Schweiz',
      it: 'Comprendere le tariffe di tassazione, la progressività, i tassi marginali ed effettivi in Svizzera',
      en: 'Understanding tax scales, progressivity, marginal and effective rates in Switzerland'
    },
    content: {
      fr: 'La progressivité de l\'impôt constitue un pilier fondamental du système fiscal suisse. Ce principe garantit que la charge fiscale augmente proportionnellement avec la capacité contributive, assurant une répartition équitable du financement des charges publiques entre tous les contribuables.',
      de: 'Die Steuerprogression bildet einen grundlegenden Pfeiler des Schweizer Steuersystems. Dieses Prinzip gewährleistet, dass die Steuerbelastung proportional zur Leistungsfähigkeit steigt und eine faire Verteilung der Finanzierung öffentlicher Lasten unter allen Steuerpflichtigen sicherstellt.',
      it: 'La progressività dell\'imposta costituisce un pilastro fondamentale del sistema fiscale svizzero. Questo principio garantisce che il carico fiscale aumenti proporzionalmente alla capacità contributiva, assicurando una ripartizione equa del finanziamento degli oneri pubblici tra tutti i contribuenti.',
      en: 'Tax progressivity constitutes a fundamental pillar of the Swiss tax system. This principle ensures that the tax burden increases proportionally with contributory capacity, ensuring fair distribution of public burden financing among all taxpayers.'
    },
    sections: {
      'principe-progressivite': {
        title: {
          fr: 'Le principe de progressivité',
          de: 'Das Progressivitätsprinzip',
          it: 'Il principio di progressività',
          en: 'The principle of progressivity'
        },
        content: {
          fr: 'La progressivité de l\'impôt signifie que le taux d\'imposition augmente avec le niveau de revenu. Ce principe découle de la capacité contributive : plus le revenu est élevé, plus la capacité à contribuer aux charges publiques est importante.',
          de: 'Die Steuerprogression bedeutet, dass der Steuersatz mit dem Einkommensniveau steigt. Dieses Prinzip leitet sich aus der Leistungsfähigkeit ab: Je höher das Einkommen, desto größer die Fähigkeit, zu den öffentlichen Lasten beizutragen.',
          it: 'La progressività dell\'imposta significa che l\'aliquota fiscale aumenta con il livello di reddito. Questo principio deriva dalla capacità contributiva: più elevato è il reddito, maggiore è la capacità di contribuire agli oneri pubblici.',
          en: 'Tax progressivity means that the tax rate increases with income level. This principle stems from contributory capacity: the higher the income, the greater the ability to contribute to public burdens.'
        },
        keyPoints: {
          fr: 'Taux croissant avec le niveau de revenu\nBasé sur le principe de capacité contributive\nPréservation du minimum vital\nApplication à tous les niveaux en Suisse\nDifférentes formes de progressivité possibles',
          de: 'Steigender Satz mit Einkommensniveau\nBasiert auf dem Leistungsfähigkeitsprinzip\nErhaltung des Existenzminimums\nAnwendung auf allen Ebenen in der Schweiz\nVerschiedene Formen der Progressivität möglich',
          it: 'Tasso crescente con il livello di reddito\nBasato sul principio di capacità contributiva\nPreservazione del minimo vitale\nApplicazione a tutti i livelli in Svizzera\nDiverse forme di progressività possibili',
          en: 'Increasing rate with income level\nBased on the principle of contributory capacity\nPreservation of subsistence minimum\nApplication at all levels in Switzerland\nDifferent forms of progressivity possible'
        },
        example: {
          fr: 'Avec un revenu de 50\'000 CHF, on peut payer 8% d\'impôt effectif, mais avec 150\'000 CHF, le taux effectif peut atteindre 25%, illustrant la progressivité.',
          de: 'Bei einem Einkommen von 50\'000 CHF kann man 8% effektive Steuer zahlen, aber bei 150\'000 CHF kann der Effektivsatz 25% erreichen, was die Progressivität veranschaulicht.',
          it: 'Con un reddito di 50\'000 CHF, si può pagare l\'8% di imposta effettiva, ma con 150\'000 CHF, il tasso effettivo può raggiungere il 25%, illustrando la progressività.',
          en: 'With an income of 50,000 CHF, one may pay 8% effective tax, but with 150,000 CHF, the effective rate can reach 25%, illustrating progressivity.'
        }
      },
      'taux-marginal-effectif': {
        title: {
          fr: 'Taux marginal vs taux effectif',
          de: 'Grenzsteuersatz vs. Effektivsteuersatz',
          it: 'Tasso marginale vs tasso effettivo',
          en: 'Marginal rate vs effective rate'
        },
        content: {
          fr: 'Le taux marginal représente l\'impôt payé sur le dernier franc gagné. C\'est le taux qui s\'applique à la tranche de revenu la plus élevée selon le barème progressif. Il détermine l\'incitation fiscale marginale au travail ou à l\'épargne.',
          de: 'Der Grenzsteuersatz stellt die Steuer dar, die auf den letzten verdienten Franken gezahlt wird. Es ist der Satz, der auf die höchste Einkommensstufe nach dem progressiven Tarif angewendet wird. Er bestimmt den steuerlichen Grenzanreiz zur Arbeit oder zum Sparen.',
          it: 'Il tasso marginale rappresenta l\'imposta pagata sull\'ultimo franco guadagnato. È il tasso che si applica alla fascia di reddito più elevata secondo la tariffa progressiva. Determina l\'incentivo fiscale marginale al lavoro o al risparmio.',
          en: 'The marginal rate represents the tax paid on the last franc earned. It is the rate that applies to the highest income bracket according to the progressive scale. It determines the marginal tax incentive to work or save.'
        },
        keyPoints: {
          fr: 'Taux marginal = impôt sur dernier franc gagné\nTaux effectif = charge fiscale moyenne globale\nTaux effectif toujours < taux marginal\nInfluence différente sur décisions économiques\nTaux marginaux suisses jusqu\'à 40-45%',
          de: 'Grenzsteuersatz = Steuer auf letzten verdienten Franken\nEffektivsteuersatz = durchschnittliche Gesamtsteuerbelastung\nEffektivsatz immer < Grenzsatz\nUnterschiedlicher Einfluss auf wirtschaftliche Entscheidungen\nSchweizer Grenzsätze bis zu 40-45%',
          it: 'Tasso marginale = imposta sull\'ultimo franco guadagnato\nTasso effettivo = carico fiscale medio globale\nTasso effettivo sempre < tasso marginale\nInfluenza diversa sulle decisioni economiche\nTassi marginali svizzeri fino al 40-45%',
          en: 'Marginal rate = tax on last franc earned\nEffective rate = average overall tax burden\nEffective rate always < marginal rate\nDifferent influence on economic decisions\nSwiss marginal rates up to 40-45%'
        },
        example: {
          fr: 'Un contribuable avec 200\'000 CHF de revenu peut avoir un taux marginal de 35% mais un taux effectif de 20%, car ses premiers revenus sont imposés à des taux plus faibles.',
          de: 'Ein Steuerpflichtiger mit 200\'000 CHF Einkommen kann einen Grenzsteuersatz von 35% haben, aber einen Effektivsatz von 20%, da seine ersten Einkommen zu niedrigeren Sätzen besteuert werden.',
          it: 'Un contribuente con 200\'000 CHF di reddito può avere un tasso marginale del 35% ma un tasso effettivo del 20%, poiché i suoi primi redditi sono tassati a tassi più bassi.',
          en: 'A taxpayer with 200,000 CHF income may have a marginal rate of 35% but an effective rate of 20%, as their first income is taxed at lower rates.'
        }
      },
      'baremes-cantonaux': {
        title: {
          fr: 'Diversité des barèmes cantonaux',
          de: 'Vielfalt der kantonalen Tarife',
          it: 'Diversità delle tariffe cantonali',
          en: 'Diversity of cantonal scales'
        },
        content: {
          fr: 'Chaque canton suisse dispose de sa souveraineté pour fixer ses barèmes d\'imposition, créant une grande diversité de systèmes. Certains cantons privilégient des taux modérés avec une progressivité douce, d\'autres acceptent des taux plus élevés pour financer des services publics étoffés.',
          de: 'Jeder Schweizer Kanton verfügt über seine Souveränität zur Festlegung seiner Besteuerungstarife, was eine große Vielfalt von Systemen schafft. Einige Kantone bevorzugen moderate Sätze mit sanfter Progressivität, andere akzeptieren höhere Sätze zur Finanzierung umfangreicher öffentlicher Dienstleistungen.',
          it: 'Ogni cantone svizzero dispone della sua sovranità per fissare le sue tariffe di tassazione, creando una grande diversità di sistemi. Alcuni cantoni privilegiano tassi moderati con una progressività dolce, altri accettano tassi più elevati per finanziare servizi pubblici estesi.',
          en: 'Each Swiss canton has its sovereignty to set its tax scales, creating great diversity of systems. Some cantons favor moderate rates with gentle progressivity, others accept higher rates to finance extensive public services.'
        },
        keyPoints: {
          fr: 'Souveraineté cantonale sur les barèmes\nStratégies différentes : compétitivité vs services\nVariation structure : tranches et seuils\nCoefficients communaux multiplicateurs\nGrande diversité entre 26 systèmes',
          de: 'Kantonale Souveränität über Tarife\nUnterschiedliche Strategien: Wettbewerbsfähigkeit vs. Dienstleistungen\nStrukturvariation: Stufen und Schwellen\nGemeinde-Multiplikationskoeffizienten\nGroße Vielfalt zwischen 26 Systemen',
          it: 'Sovranità cantonale sulle tariffe\nStrategie diverse: competitività vs servizi\nVariazione struttura: fasce e soglie\nCoefficienti comunali moltiplicatori\nGrande diversità tra 26 sistemi',
          en: 'Cantonal sovereignty over scales\nDifferent strategies: competitiveness vs services\nStructural variation: brackets and thresholds\nMunicipal multiplier coefficients\nGreat diversity between 26 systems'
        }
      },
      'effets-economiques': {
        title: {
          fr: 'Effets économiques de la progressivité',
          de: 'Wirtschaftliche Auswirkungen der Progressivität',
          it: 'Effetti economici della progressività',
          en: 'Economic effects of progressivity'
        },
        content: {
          fr: 'La progressivité a des effets redistributifs évidents : elle réduit les inégalités de revenus nets par rapport aux revenus bruts. Cet effet redistributif est voulu politiquement pour assurer une certaine cohésion sociale.',
          de: 'Die Progressivität hat offensichtliche Umverteilungseffekte: Sie reduziert die Ungleichheiten der Nettoeinkommen im Vergleich zu den Bruttoeinkommen. Dieser Umverteilungseffekt ist politisch gewollt, um einen gewissen sozialen Zusammenhalt zu gewährleisten.',
          it: 'La progressività ha effetti redistributivi evidenti: riduce le disuguaglianze dei redditi netti rispetto ai redditi lordi. Questo effetto redistributivo è voluto politicamente per assicurare una certa coesione sociale.',
          en: 'Progressivity has obvious redistributive effects: it reduces net income inequalities compared to gross income. This redistributive effect is politically intended to ensure certain social cohesion.'
        },
        keyPoints: {
          fr: 'Effet redistributif voulu politiquement\nImpact sur incitations au travail débattu\nProgression à froid due à l\'inflation\nEffets de seuil problématiques\nMécanismes correcteurs nécessaires',
          de: 'Politisch gewollter Umverteilungseffekt\nUmstrittene Auswirkungen auf Arbeitsanreize\nKalte Progression durch Inflation\nProblematische Schwelleneffekte\nNotwendige Korrekturmechanismen',
          it: 'Effetto redistributivo voluto politicamente\nImpatto sugli incentivi al lavoro dibattuto\nProgressione a freddo dovuta all\'inflazione\nEffetti soglia problematici\nMeccanismi correttivi necessari',
          en: 'Politically intended redistributive effect\nDebated impact on work incentives\nCold progression due to inflation\nProblematic threshold effects\nNecessary corrective mechanisms'
        },
        example: {
          fr: 'Un bonus de 5\'000 CHF peut ne rapporter que 2\'500 CHF nets si le taux marginal est de 50%, questionnant la motivation à l\'effort supplémentaire.',
          de: 'Ein Bonus von 5\'000 CHF kann nur 2\'500 CHF netto einbringen, wenn der Grenzsteuersatz 50% beträgt, was die Motivation für zusätzliche Anstrengungen in Frage stellt.',
          it: 'Un bonus di 5\'000 CHF può portare solo 2\'500 CHF netti se il tasso marginale è del 50%, mettendo in questione la motivazione allo sforzo aggiuntivo.',
          en: 'A 5,000 CHF bonus may only yield 2,500 CHF net if the marginal rate is 50%, questioning motivation for additional effort.'
        }
      },
      'optimisation-baremes': {
        title: {
          fr: 'Optimisation face aux barèmes',
          de: 'Optimierung gegenüber Tarifen',
          it: 'Ottimizzazione di fronte alle tariffe',
          en: 'Optimization facing scales'
        },
        content: {
          fr: 'La connaissance des barèmes permet diverses stratégies d\'optimisation légale. L\'étalement des revenus sur plusieurs années évite les effets de la progressivité sur les revenus exceptionnels comme les bonus ou plus-values.',
          de: 'Die Kenntnis der Tarife ermöglicht verschiedene legale Optimierungsstrategien. Die Verteilung der Einkommen über mehrere Jahre vermeidet die Auswirkungen der Progressivität auf außergewöhnliche Einkommen wie Boni oder Kapitalgewinne.',
          it: 'La conoscenza delle tariffe permette diverse strategie di ottimizzazione legale. La ripartizione dei redditi su più anni evita gli effetti della progressività sui redditi eccezionali come bonus o plusvalenze.',
          en: 'Knowledge of scales allows various legal optimization strategies. Spreading income over several years avoids the effects of progressivity on exceptional income like bonuses or capital gains.'
        },
        keyPoints: {
          fr: 'Étalement revenus évite forte progressivité\nSplitting conjugal optimise tranches inférieures\nTiming déductions selon taux marginal\nChoix domicile fiscal crucial\nOptimisation légale permise et encadrée',
          de: 'Einkommensverteilung vermeidet starke Progressivität\nEhegattensplitting optimiert untere Stufen\nTiming der Abzüge nach Grenzsteuersatz\nWahl des Steuerdomizils entscheidend\nLegale Optimierung erlaubt und geregelt',
          it: 'Ripartizione redditi evita forte progressività\nSplitting coniugale ottimizza fasce inferiori\nTiming detrazioni secondo tasso marginale\nScelta domicilio fiscale cruciale\nOttimizzazione legale permessa e regolamentata',
          en: 'Income spreading avoids strong progressivity\nSpousal splitting optimizes lower brackets\nDeduction timing according to marginal rate\nTax domicile choice crucial\nLegal optimization permitted and regulated'
        }
      }
    }
  },

  'revenus-imposables-salaries': {
    title: {
      fr: 'Les revenus imposables des salariés',
      de: 'Die steuerpflichtigen Einkommen der Angestellten',
      it: 'I redditi imponibili dei salariati',
      en: 'Taxable income of employees'
    },
    description: {
      fr: 'Comprendre tous les éléments du salaire soumis à l\'impôt : salaire de base, avantages, bonus et éléments accessoires',
      de: 'Verstehen Sie alle steuerpflichtigen Gehaltsbestandteile: Grundgehalt, Vorteile, Boni und Nebenleistungen',
      it: 'Comprendere tutti gli elementi del salario soggetti all\'imposta: salario base, vantaggi, bonus ed elementi accessori',
      en: 'Understanding all taxable salary elements: base salary, benefits, bonuses and ancillary elements'
    },
    content: {
      fr: 'La détermination des revenus imposables constitue la première étape cruciale du calcul de l\'impôt. Pour les salariés, cette notion englobe bien au-delà du simple salaire de base et comprend l\'ensemble des avantages, rémunérations variables et prestations accessoires perçues dans le cadre de l\'activité professionnelle.',
      de: 'Die Bestimmung der steuerpflichtigen Einkommen bildet den ersten entscheidenden Schritt bei der Steuerberechnung. Für Angestellte umfasst dieser Begriff weit mehr als nur das Grundgehalt und schließt alle Vorteile, variablen Vergütungen und Nebenleistungen ein, die im Rahmen der beruflichen Tätigkeit erhalten werden.',
      it: 'La determinazione dei redditi imponibili costituisce la prima fase cruciale del calcolo dell\'imposta. Per i salariati, questa nozione comprende molto di più del semplice salario base e include tutti i vantaggi, remunerazioni variabili e prestazioni accessorie percepite nell\'ambito dell\'attività professionale.',
      en: 'Determining taxable income constitutes the first crucial step in tax calculation. For employees, this concept encompasses far beyond simple base salary and includes all benefits, variable compensation and ancillary services received as part of professional activity.'
    },
    sections: {
      'salaire-base': {
        title: {
          fr: 'Salaire de base et éléments fixes',
          de: 'Grundgehalt und feste Bestandteile',
          it: 'Salario base ed elementi fissi',
          en: 'Base salary and fixed elements'
        },
        content: {
          fr: 'Le salaire de base constitue l\'élément principal du revenu imposable. Il comprend le salaire mensuel, les gratifications convenues contractuellement (13e salaire, bonus garantis) et tous les versements réguliers effectués par l\'employeur.',
          de: 'Das Grundgehalt bildet den Hauptbestandteil des steuerpflichtigen Einkommens. Es umfasst das Monatsgehalt, vertraglich vereinbarte Gratifikationen (13. Lohn, garantierte Boni) und alle regelmäßigen Zahlungen des Arbeitgebers.',
          it: 'Il salario base costituisce l\'elemento principale del reddito imponibile. Comprende il salario mensile, le gratifiche concordate contrattualmente (13a mensilità, bonus garantiti) e tutti i versamenti regolari effettuati dal datore di lavoro.',
          en: 'Base salary constitutes the main element of taxable income. It includes monthly salary, contractually agreed gratifications (13th salary, guaranteed bonuses) and all regular payments made by the employer.'
        },
        keyPoints: {
          fr: 'Salaire mensuel intégralement imposable\n13e salaire et bonus contractuels inclus\nAllocations employeur distinctes AVS\nImposition selon principe d\'encaissement\nPériodicité sans influence sur l\'imposabilité',
          de: 'Monatsgehalt vollständig steuerpflichtig\n13. Lohn und vertragliche Boni inbegriffen\nArbeitgeberzulagen getrennt von AHV\nBesteuerung nach Zuflussprinzip\nPeriodizität ohne Einfluss auf Steuerpflicht',
          it: 'Salario mensile integralmente imponibile\n13a mensilità e bonus contrattuali inclusi\nAssegni datore di lavoro distinti AVS\nImposizione secondo principio di incasso\nPeriodicità senza influenza sull\'imponibilità',
          en: 'Monthly salary fully taxable\n13th salary and contractual bonuses included\nEmployer allowances separate from AVS\nTaxation according to cash principle\nPeriodicity without influence on taxability'
        }
      },
      'avantages-nature': {
        title: {
          fr: 'Avantages en nature',
          de: 'Naturalleistungen',
          it: 'Vantaggi in natura',
          en: 'Benefits in kind'
        },
        content: {
          fr: 'Les avantages en nature constituent un complément de salaire imposable évalué à leur valeur vénale. Le principe est simple : tout ce qui profite au salarié et qui, normalement, représenterait une dépense personnelle, constitue un avantage imposable.',
          de: 'Naturalleistungen stellen eine steuerpflichtige Gehaltsergänzung dar, die zu ihrem Verkehrswert bewertet wird. Das Prinzip ist einfach: Alles, was dem Angestellten nützt und normalerweise eine persönliche Ausgabe darstellen würde, ist ein steuerpflichtiger Vorteil.',
          it: 'I vantaggi in natura costituiscono un complemento di salario imponibile valutato al loro valore venale. Il principio è semplice: tutto ciò che beneficia al salariato e che, normalmente, rappresenterebbe una spesa personale, costituisce un vantaggio imponibile.',
          en: 'Benefits in kind constitute a taxable salary supplement valued at their market value. The principle is simple: anything that benefits the employee and would normally represent a personal expense constitutes a taxable benefit.'
        },
        keyPoints: {
          fr: 'Évaluation à la valeur vénale\nVoiture : 0.8% valeur neuve/mois ou frais réels\nLogement : valeur locative moins 20% si justifié\nRepas : 15 CHF/repas principal\nApplication cohérente des méthodes d\'évaluation',
          de: 'Bewertung zum Verkehrswert\nAuto: 0,8% Neuwert/Monat oder tatsächliche Kosten\nWohnung: Mietwert minus 20% wenn gerechtfertigt\nMahlzeiten: 15 CHF/Hauptmahlzeit\nKonsequente Anwendung der Bewertungsmethoden',
          it: 'Valutazione al valore venale\nAuto: 0,8% valore nuovo/mese o costi reali\nAlloggio: valore locativo meno 20% se giustificato\nPasti: 15 CHF/pasto principale\nApplicazione coerente dei metodi di valutazione',
          en: 'Valuation at market value\nCar: 0.8% new value/month or actual costs\nAccommodation: rental value minus 20% if justified\nMeals: 15 CHF/main meal\nConsistent application of valuation methods'
        },
        example: {
          fr: 'Une voiture d\'entreprise achetée 50\'000 CHF représente un avantage de 400 CHF/mois (50\'000 x 0.8%), soit 4\'800 CHF imposables par an si utilisée privativement.',
          de: 'Ein Firmenwagen im Wert von 50\'000 CHF stellt einen Vorteil von 400 CHF/Monat dar (50\'000 x 0,8%), also 4\'800 CHF steuerpflichtig pro Jahr bei privater Nutzung.',
          it: 'Un\'auto aziendale acquistata per 50\'000 CHF rappresenta un vantaggio di 400 CHF/mese (50\'000 x 0,8%), ovvero 4\'800 CHF imponibili all\'anno se utilizzata privatamente.',
          en: 'A company car purchased for 50,000 CHF represents a benefit of 400 CHF/month (50,000 x 0.8%), or 4,800 CHF taxable per year if used privately.'
        }
      },
      'bonus-variables': {
        title: {
          fr: 'Bonus et éléments variables',
          de: 'Boni und variable Bestandteile',
          it: 'Bonus ed elementi variabili',
          en: 'Bonuses and variable elements'
        },
        content: {
          fr: 'Les bonus et gratifications variables sont imposables même s\'ils ne sont pas contractuellement garantis. Peu importe qu\'ils dépendent des résultats de l\'entreprise ou de la performance individuelle, ils constituent un revenu de l\'activité salariée.',
          de: 'Variable Boni und Gratifikationen sind steuerpflichtig, auch wenn sie nicht vertraglich garantiert sind. Es spielt keine Rolle, ob sie von den Unternehmensergebnissen oder der individuellen Leistung abhängen, sie stellen ein Einkommen aus unselbständiger Erwerbstätigkeit dar.',
          it: 'I bonus e le gratifiche variabili sono imponibili anche se non sono contrattualmente garantiti. Non importa se dipendono dai risultati dell\'azienda o dalla performance individuale, costituiscono un reddito dall\'attività salariata.',
          en: 'Variable bonuses and gratifications are taxable even if not contractually guaranteed. It doesn\'t matter whether they depend on company results or individual performance, they constitute income from employment.'
        },
        keyPoints: {
          fr: 'Bonus imposables même non garantis\nStock-options : à l\'attribution ou exercice\nCommissions selon principe d\'encaissement\nIndemnités de départ imposables\nImposition privilégiée possible selon circonstances',
          de: 'Boni steuerpflichtig auch wenn nicht garantiert\nAktienoptionen: bei Zuteilung oder Ausübung\nProvisionen nach Zuflussregel\nAbgangsentschädigungen steuerpflichtig\nBegünstigte Besteuerung je nach Umständen möglich',
          it: 'Bonus imponibili anche se non garantiti\nStock-option: all\'attribuzione o esercizio\nCommissioni secondo principio di incasso\nIndennità di partenza imponibili\nImposizione privilegiata possibile secondo circostanze',
          en: 'Bonuses taxable even if not guaranteed\nStock options: at allocation or exercise\nCommissions according to cash principle\nSeverance payments taxable\nPrivileged taxation possible depending on circumstances'
        }
      }
    }
  },

  'deductions-fiscales-principales': {
    title: {
      fr: 'Les principales déductions fiscales',
      de: 'Die wichtigsten Steuerabzüge',
      it: 'Le principali detrazioni fiscali',
      en: 'Main tax deductions'
    },
    description: {
      fr: 'Guide complet des déductions autorisées : sociales, professionnelles, familiales et 3e pilier',
      de: 'Vollständiger Leitfaden zu erlaubten Abzügen: soziale, berufliche, familiäre und 3. Säule',
      it: 'Guida completa alle detrazioni autorizzate: sociali, professionali, familiari e 3° pilastro',
      en: 'Complete guide to authorized deductions: social, professional, family and 3rd pillar'
    },
    content: {
      fr: 'Les déductions fiscales constituent un mécanisme fondamental du système fiscal suisse permettant de tenir compte des charges particulières qui réduisent la capacité contributive réelle des contribuables. Elles permettent d\'ajuster l\'impôt à la situation personnelle de chacun.',
      de: 'Steuerabzüge bilden einen grundlegenden Mechanismus des Schweizer Steuersystems, der es ermöglicht, besondere Lasten zu berücksichtigen, die die tatsächliche Leistungsfähigkeit der Steuerpflichtigen reduzieren. Sie ermöglichen es, die Steuer an die persönliche Situation jedes Einzelnen anzupassen.',
      it: 'Le detrazioni fiscali costituiscono un meccanismo fondamentale del sistema fiscale svizzero che permette di tenere conto degli oneri particolari che riducono la capacità contributiva reale dei contribuenti. Permettono di adeguare l\'imposta alla situazione personale di ciascuno.',
      en: 'Tax deductions constitute a fundamental mechanism of the Swiss tax system allowing consideration of particular burdens that reduce the real contributory capacity of taxpayers. They allow adjusting tax to each person\'s personal situation.'
    },
    sections: {
      'deductions-sociales': {
        title: {
          fr: 'Déductions sociales obligatoires',
          de: 'Obligatorische Sozialabzüge',
          it: 'Detrazioni sociali obbligatorie',
          en: 'Mandatory social deductions'
        },
        content: {
          fr: 'Les cotisations aux assurances sociales obligatoires sont intégralement déductibles car elles réduisent la capacité contributive sans être librement choisies. Cette déduction suit le principe que seul le revenu net disponible doit être imposé.',
          de: 'Die Beiträge zu den obligatorischen Sozialversicherungen sind vollständig abzugsfähig, da sie die Leistungsfähigkeit reduzieren, ohne frei gewählt zu sein. Dieser Abzug folgt dem Prinzip, dass nur das verfügbare Nettoeinkommen besteuert werden soll.',
          it: 'I contributi alle assicurazioni sociali obbligatorie sono integralmente detraibili poiché riducono la capacità contributiva senza essere liberamente scelti. Questa detrazione segue il principio che solo il reddito netto disponibile deve essere tassato.',
          en: 'Contributions to mandatory social insurance are fully deductible as they reduce contributory capacity without being freely chosen. This deduction follows the principle that only net available income should be taxed.'
        },
        keyPoints: {
          fr: 'AVS/AI/APG : 5.3% jusqu\'à 148\'200 CHF\nChômage : 1.1% puis 0.5% selon tranches\nLPP selon âge et salaire coordonné\nDéduction intégrale des montants versés\nAucune déduction au-delà des maximums',
          de: 'AHV/IV/EO: 5,3% bis 148\'200 CHF\nArbeitslosigkeit: 1,1% dann 0,5% nach Stufen\nBVG nach Alter und koordiniertem Lohn\nVollständiger Abzug der bezahlten Beträge\nKein Abzug über die Höchstbeträge hinaus',
          it: 'AVS/AI/IPG: 5,3% fino a 148\'200 CHF\nDisoccupazione: 1,1% poi 0,5% secondo fasce\nLPP secondo età e salario coordinato\nDetrazione integrale degli importi versati\nNessuna detrazione oltre i massimi',
          en: 'AVS/AI/APG: 5.3% up to 148,200 CHF\nUnemployment: 1.1% then 0.5% by brackets\nLPP according to age and coordinated salary\nFull deduction of amounts paid\nNo deduction beyond maximums'
        }
      },
      'frais-professionnels': {
        title: {
          fr: 'Frais professionnels déductibles',
          de: 'Abzugsfähige Berufskosten',
          it: 'Spese professionali detraibili',
          en: 'Deductible professional expenses'
        },
        content: {
          fr: 'Les frais professionnels réduisent le revenu imposable car ils sont nécessaires à l\'obtention du revenu. Ils doivent être effectifs, justifiés et proportionnés. La plupart des cantons appliquent une déduction forfaitaire, mais les frais effectifs peuvent être déclarés s\'ils sont supérieurs.',
          de: 'Berufskosten reduzieren das steuerbare Einkommen, da sie zur Erzielung des Einkommens notwendig sind. Sie müssen tatsächlich anfallen, gerechtfertigt und verhältnismäßig sein. Die meisten Kantone wenden einen Pauschalabzug an, aber die tatsächlichen Kosten können geltend gemacht werden, wenn sie höher sind.',
          it: 'Le spese professionali riducono il reddito imponibile poiché sono necessarie per ottenere il reddito. Devono essere effettive, giustificate e proporzionate. La maggior parte dei cantoni applica una detrazione forfettaria, ma le spese effettive possono essere dichiarate se superiori.',
          en: 'Professional expenses reduce taxable income as they are necessary to obtain income. They must be actual, justified and proportionate. Most cantons apply a flat-rate deduction, but actual expenses can be declared if higher.'
        },
        keyPoints: {
          fr: 'Forfait cantonal ou frais effectifs si supérieurs\nTransport : transports publics ou 0.70 CHF/km\nRepas : 15 CHF si retour domicile impossible\nFormation continue sans limite si liée au poste\nJustification et proportionnalité requises',
          de: 'Kantonale Pauschale oder tatsächliche Kosten wenn höher\nTransport: öffentliche Verkehrsmittel oder 0,70 CHF/km\nMahlzeiten: 15 CHF wenn Heimkehr unmöglich\nWeiterbildung ohne Limite wenn stellenbezogen\nBegründung und Verhältnismäßigkeit erforderlich',
          it: 'Forfait cantonale o spese effettive se superiori\nTrasporto: trasporti pubblici o 0,70 CHF/km\nPasti: 15 CHF se ritorno a casa impossibile\nFormazione continua senza limite se legata al posto\nGiustificazione e proporzionalità richieste',
          en: 'Cantonal flat rate or actual expenses if higher\nTransport: public transport or 0.70 CHF/km\nMeals: 15 CHF if return home impossible\nContinuous training without limit if job-related\nJustification and proportionality required'
        },
        example: {
          fr: 'Un salarié habitant à 25 km de son bureau peut déduire 25 x 2 x 0.70 x 220 jours = 7\'700 CHF de frais de transport annuels.',
          de: 'Ein Angestellter, der 25 km von seinem Büro entfernt wohnt, kann 25 x 2 x 0,70 x 220 Tage = 7\'700 CHF jährliche Transportkosten abziehen.',
          it: 'Un salariato che abita a 25 km dal suo ufficio può detrarre 25 x 2 x 0,70 x 220 giorni = 7\'700 CHF di spese di trasporto annuali.',
          en: 'An employee living 25 km from their office can deduct 25 x 2 x 0.70 x 220 days = 7,700 CHF annual transport costs.'
        }
      },
      'troisieme-pilier': {
        title: {
          fr: '3e pilier : optimisation fiscale',
          de: '3. Säule: Steueroptimierung',
          it: '3° pilastro: ottimizzazione fiscale',
          en: '3rd pillar: tax optimization'
        },
        content: {
          fr: 'Le 3e pilier A constitue l\'une des déductions fiscales les plus avantageuses. Les versements sont intégralement déductibles du revenu imposable, et le capital fructifie à l\'abri de l\'impôt jusqu\'au retrait.',
          de: 'Die 3. Säule A stellt einen der vorteilhaftesten Steuerabzüge dar. Die Einzahlungen sind vollständig vom steuerbaren Einkommen abzugsfähig, und das Kapital wächst steuerfrei bis zur Auszahlung.',
          it: 'Il 3° pilastro A costituisce una delle detrazioni fiscali più vantaggiose. I versamenti sono integralmente detraibili dal reddito imponibile, e il capitale fruttifica al riparo dalle imposte fino al prelievo.',
          en: 'The 3rd pillar A constitutes one of the most advantageous tax deductions. Payments are fully deductible from taxable income, and capital grows tax-free until withdrawal.'
        },
        keyPoints: {
          fr: '7\'056 CHF maximum pour salariés en 2024\n35\'280 CHF pour indépendants sans LPP\nVersement avant 31 décembre obligatoire\nRetrait anticipé possible selon conditions\nImposition privilégiée au retrait',
          de: '7\'056 CHF Maximum für Angestellte 2024\n35\'280 CHF für Selbständige ohne BVG\nEinzahlung vor 31. Dezember obligatorisch\nVorbezug möglich unter Bedingungen\nPrivilegierte Besteuerung bei Auszahlung',
          it: '7\'056 CHF massimo per salariati nel 2024\n35\'280 CHF per indipendenti senza LPP\nVersamento prima del 31 dicembre obbligatorio\nPrelievo anticipato possibile secondo condizioni\nImposizione privilegiata al prelievo',
          en: '7,056 CHF maximum for employees in 2024\n35,280 CHF for self-employed without LPP\nPayment before December 31 mandatory\nEarly withdrawal possible under conditions\nPrivileged taxation on withdrawal'
        }
      }
    }
  },

  'impot-fortune-personnes-physiques': {
    title: {
      fr: 'L\'impôt sur la fortune des personnes physiques',
      de: 'Die Vermögenssteuer der natürlichen Personen',
      it: 'L\'imposta sul patrimonio delle persone fisiche',
      en: 'Wealth tax for individuals'
    },
    description: {
      fr: 'Comprendre l\'imposition de la fortune : calcul, évaluation des biens et stratégies d\'optimisation',
      de: 'Verstehen Sie die Vermögensbesteuerung: Berechnung, Bewertung von Gütern und Optimierungsstrategien',
      it: 'Comprendere l\'imposizione del patrimonio: calcolo, valutazione dei beni e strategie di ottimizzazione',
      en: 'Understanding wealth taxation: calculation, asset valuation and optimization strategies'
    },
    content: {
      fr: 'L\'impôt sur la fortune constitue une caractéristique distinctive du système fiscal suisse, de plus en plus rare à l\'échelle internationale. Cette imposition directe du patrimoine reflète une conception particulière de l\'équité fiscale et de la contribution aux charges publiques.',
      de: 'Die Vermögenssteuer stellt ein charakteristisches Merkmal des Schweizer Steuersystems dar, das international immer seltener wird. Diese direkte Besteuerung des Vermögens spiegelt eine besondere Auffassung von Steuergerechtigkeit und Beitrag zu den öffentlichen Lasten wider.',
      it: 'L\'imposta sul patrimonio costituisce una caratteristica distintiva del sistema fiscale svizzero, sempre più rara a livello internazionale. Questa imposizione diretta del patrimonio riflette una concezione particolare dell\'equità fiscale e del contributo agli oneri pubblici.',
      en: 'Wealth tax constitutes a distinctive feature of the Swiss tax system, increasingly rare internationally. This direct taxation of wealth reflects a particular conception of tax equity and contribution to public burdens.'
    },
    sections: {
      'principe-impot-fortune': {
        title: {
          fr: 'Principe de l\'impôt sur la fortune',
          de: 'Prinzip der Vermögenssteuer',
          it: 'Principio dell\'imposta sul patrimonio',
          en: 'Principle of wealth tax'
        },
        content: {
          fr: 'L\'impôt sur la fortune constitue une spécificité suisse de plus en plus rare dans le monde. Seuls les cantons et communes le prélèvent (pas la Confédération), sur la fortune nette au 31 décembre. Cette fortune nette correspond aux actifs moins les dettes justifiées.',
          de: 'Die Vermögenssteuer stellt eine schweizerische Besonderheit dar, die weltweit immer seltener wird. Nur Kantone und Gemeinden erheben sie (nicht der Bund), auf das Nettovermögen am 31. Dezember. Dieses Nettovermögen entspricht den Aktiven minus den gerechtfertigten Schulden.',
          it: 'L\'imposta sul patrimonio costituisce una specificità svizzera sempre più rara nel mondo. Solo i cantoni e i comuni la prelevano (non la Confederazione), sul patrimonio netto al 31 dicembre. Questo patrimonio netto corrisponde agli attivi meno i debiti giustificati.',
          en: 'Wealth tax constitutes a Swiss specificity increasingly rare in the world. Only cantons and municipalities levy it (not the Confederation), on net wealth at December 31. This net wealth corresponds to assets minus justified debts.'
        },
        keyPoints: {
          fr: 'Impôt cantonal et communal uniquement\nFortune nette au 31 décembre\nTaux entre 0.1% et 1% selon cantons\nIndépendant des revenus générés\nÉvaluation selon règles précises',
          de: 'Nur kantonale und kommunale Steuer\nNettovermögen am 31. Dezember\nSätze zwischen 0,1% und 1% je nach Kanton\nUnabhängig von generierten Einkommen\nBewertung nach präzisen Regeln',
          it: 'Imposta solo cantonale e comunale\nPatrimonio netto al 31 dicembre\nTassi tra 0,1% e 1% secondo cantoni\nIndipendente dai redditi generati\nValutazione secondo regole precise',
          en: 'Only cantonal and municipal tax\nNet wealth at December 31\nRates between 0.1% and 1% by canton\nIndependent of generated income\nValuation according to precise rules'
        }
      },
      'evaluation-patrimoine': {
        title: {
          fr: 'Évaluation des différents actifs',
          de: 'Bewertung verschiedener Vermögenswerte',
          it: 'Valutazione dei diversi attivi',
          en: 'Valuation of different assets'
        },
        content: {
          fr: 'L\'immobilier est évalué à sa valeur vénale, généralement basée sur la valeur d\'assurance incendie majorée d\'un coefficient. Cette évaluation peut être contestée si elle s\'écarte significativement de la valeur de marché réelle.',
          de: 'Immobilien werden zu ihrem Verkehrswert bewertet, der normalerweise auf dem Brandversicherungswert plus einem Koeffizienten basiert. Diese Bewertung kann angefochten werden, wenn sie erheblich vom tatsächlichen Marktwert abweicht.',
          it: 'Gli immobili sono valutati al loro valore venale, generalmente basato sul valore di assicurazione incendio maggiorato di un coefficiente. Questa valutazione può essere contestata se si discosta significativamente dal valore di mercato reale.',
          en: 'Real estate is valued at its market value, generally based on fire insurance value plus a coefficient. This valuation can be contested if it deviates significantly from actual market value.'
        },
        keyPoints: {
          fr: 'Immobilier : valeur vénale (assurance + coefficient)\nTitres : cours 31 décembre ou moyenne 30 jours\nLiquidités à valeur nominale\nDettes justifiées déductibles\nContrôle réalité économique des dettes',
          de: 'Immobilien: Verkehrswert (Versicherung + Koeffizient)\nWertpapiere: Kurs 31. Dezember oder 30-Tage-Durchschnitt\nLiquidität zu Nominalwert\nGerechtfertigte Schulden abzugsfähig\nKontrolle wirtschaftlicher Realität der Schulden',
          it: 'Immobili: valore venale (assicurazione + coefficiente)\nTitoli: corso 31 dicembre o media 30 giorni\nLiquidità a valore nominale\nDebiti giustificati detraibili\nControllo realtà economica dei debiti',
          en: 'Real estate: market value (insurance + coefficient)\nSecurities: December 31 price or 30-day average\nCash at nominal value\nJustified debts deductible\nControl of economic reality of debts'
        }
      },
      'optimisation-fortune': {
        title: {
          fr: 'Stratégies d\'optimisation',
          de: 'Optimierungsstrategien',
          it: 'Strategie di ottimizzazione',
          en: 'Optimization strategies'
        },
        content: {
          fr: 'Le choix du canton de domicile représente l\'optimisation principale. Certains cantons n\'imposent pas la fortune jusqu\'à un certain seuil (Nidwald : 200\'000 CHF), d\'autres ont des taux très modérés.',
          de: 'Die Wahl des Wohnsitzkantons stellt die Hauptoptimierung dar. Einige Kantone besteuern Vermögen bis zu einer bestimmten Schwelle nicht (Nidwalden: 200\'000 CHF), andere haben sehr moderate Sätze.',
          it: 'La scelta del cantone di domicilio rappresenta l\'ottimizzazione principale. Alcuni cantoni non tassano il patrimonio fino a una certa soglia (Nidvaldo: 200\'000 CHF), altri hanno tassi molto moderati.',
          en: 'The choice of domicile canton represents the main optimization. Some cantons do not tax wealth up to a certain threshold (Nidwalden: 200,000 CHF), others have very moderate rates.'
        },
        keyPoints: {
          fr: 'Choix canton : seuils et taux variables\nStructuration patrimoine optimale\nTiming opérations patrimoniales\nEndettement stratégique encadré\nÉviter pics d\'imposition temporaires',
          de: 'Kantonswahl: variable Schwellen und Sätze\nOptimale Vermögensstrukturierung\nTiming von Vermögensoperationen\nGeregelte strategische Verschuldung\nVermeidung temporärer Besteuerungsspitzen',
          it: 'Scelta cantone: soglie e tassi variabili\nStrutturazione patrimoniale ottimale\nTiming operazioni patrimoniali\nIndebitamento strategico regolamentato\nEvitare picchi di imposizione temporanei',
          en: 'Canton choice: variable thresholds and rates\nOptimal wealth structuring\nTiming of wealth operations\nRegulated strategic debt\nAvoid temporary taxation peaks'
        },
        example: {
          fr: 'Un déménagement de Genève (taux 0.55%) vers Zoug (taux 0.14%) sur une fortune de 2 millions CHF économise environ 8\'200 CHF d\'impôt annuel.',
          de: 'Ein Umzug von Genf (Satz 0,55%) nach Zug (Satz 0,14%) bei einem Vermögen von 2 Millionen CHF spart etwa 8\'200 CHF Steuern jährlich.',
          it: 'Un trasloco da Ginevra (tasso 0,55%) a Zugo (tasso 0,14%) su un patrimonio di 2 milioni CHF fa risparmiare circa 8\'200 CHF di imposte annue.',
          en: 'A move from Geneva (rate 0.55%) to Zug (rate 0.14%) on wealth of 2 million CHF saves about 8,200 CHF in annual taxes.'
        }
      }
    }
  },

  'rentes-avs-lpp-imposition': {
    title: {
      fr: 'Imposition des rentes AVS, AI et LPP',
      de: 'Besteuerung der AHV-, IV- und BVG-Renten',
      it: 'Imposizione delle rendite AVS, AI e LPP',
      en: 'Taxation of AVS, AI and LPP pensions'
    },
    description: {
      fr: 'Comprendre l\'imposition des rentes du 1er et 2e pilier : règles, déductions et optimisation',
      de: 'Verstehen Sie die Besteuerung der Renten der 1. und 2. Säule: Regeln, Abzüge und Optimierung',
      it: 'Comprendere l\'imposizione delle rendite del 1° e 2° pilastro: regole, detrazioni e ottimizzazione',
      en: 'Understanding taxation of 1st and 2nd pillar pensions: rules, deductions and optimization'
    },
    content: {
      fr: 'L\'imposition des rentes de prévoyance constitue un élément central de la planification fiscale à la retraite. Le système suisse de prévoyance à trois piliers génère différents types de prestations soumises à des règles fiscales spécifiques qu\'il convient de maîtriser pour optimiser sa situation.',
      de: 'Die Besteuerung der Vorsorgeleistungen bildet ein zentrales Element der Steuerplanung im Ruhestand. Das schweizerische Drei-Säulen-Vorsorgesystem generiert verschiedene Arten von Leistungen, die spezifischen Steuerregeln unterliegen, die beherrscht werden sollten, um die Situation zu optimieren.',
      it: 'L\'imposizione delle rendite di previdenza costituisce un elemento centrale della pianificazione fiscale in pensione. Il sistema svizzero di previdenza a tre pilastri genera diversi tipi di prestazioni soggette a regole fiscali specifiche che conviene padroneggiare per ottimizzare la propria situazione.',
      en: 'Taxation of pension benefits constitutes a central element of retirement tax planning. The Swiss three-pillar pension system generates different types of benefits subject to specific tax rules that should be mastered to optimize one\'s situation.'
    },
    sections: {
      'principe-imposition-rentes': {
        title: {
          fr: 'Principe d\'imposition des rentes',
          de: 'Prinzip der Rentenbesteuerung',
          it: 'Principio di imposizione delle rendite',
          en: 'Principle of pension taxation'
        },
        content: {
          fr: 'Les rentes du 1er pilier (AVS/AI) et du 2e pilier (LPP) sont intégralement imposables comme revenu au moment de leur perception. Cette imposition suit le principe de l\'imposition différée : les cotisations étaient déductibles pendant la vie active, les prestations sont imposables à la retraite.',
          de: 'Die Renten der 1. Säule (AHV/IV) und der 2. Säule (BVG) sind als Einkommen zum Zeitpunkt ihres Bezugs vollständig steuerpflichtig. Diese Besteuerung folgt dem Prinzip der nachgelagerten Besteuerung: Die Beiträge waren während der Erwerbstätigkeit abzugsfähig, die Leistungen sind im Ruhestand steuerpflichtig.',
          it: 'Le rendite del 1° pilastro (AVS/AI) e del 2° pilastro (LPP) sono integralmente imponibili come reddito al momento della loro percezione. Questa imposizione segue il principio dell\'imposizione differita: i contributi erano detraibili durante la vita attiva, le prestazioni sono imponibili alla pensione.',
          en: 'Pensions from the 1st pillar (AVS/AI) and 2nd pillar (LPP) are fully taxable as income when received. This taxation follows the principle of deferred taxation: contributions were deductible during working life, benefits are taxable in retirement.'
        },
        keyPoints: {
          fr: 'Rentes AVS/AI/LPP intégralement imposables\nPrincipe d\'imposition différée\nDéductions spécifiques pour AVS/AI\nCapitaux LPP imposés séparément\nÉviter effets progressivité sur capitaux',
          de: 'AHV/IV/BVG-Renten vollständig steuerpflichtig\nPrinzip der nachgelagerten Besteuerung\nSpezielle Abzüge für AHV/IV\nBVG-Kapital separat besteuert\nProgressionseffekte auf Kapital vermeiden',
          it: 'Rendite AVS/AI/LPP integralmente imponibili\nPrincipio di imposizione differita\nDetrazioni specifiche per AVS/AI\nCapitali LPP tassati separatamente\nEvitare effetti progressività sui capitali',
          en: 'AVS/AI/LPP pensions fully taxable\nPrinciple of deferred taxation\nSpecific deductions for AVS/AI\nLPP capital taxed separately\nAvoid progressivity effects on capital'
        }
      },
      'deductions-rentiers': {
        title: {
          fr: 'Déductions spécifiques aux rentiers',
          de: 'Spezielle Abzüge für Rentner',
          it: 'Detrazioni specifiche per i pensionati',
          en: 'Specific deductions for pensioners'
        },
        content: {
          fr: 'Les rentiers AVS/AI bénéficient de déductions particulières dans la plupart des cantons. Ces déductions peuvent être forfaitaires (montant fixe) ou proportionnelles (pourcentage de la rente). Elles visent à alléger la charge fiscale de cette catégorie de contribuables.',
          de: 'AHV/IV-Rentner profitieren in den meisten Kantonen von besonderen Abzügen. Diese Abzüge können pauschal (fester Betrag) oder proportional (Prozentsatz der Rente) sein. Sie zielen darauf ab, die Steuerbelastung dieser Steuerpflichtigenkategorie zu erleichtern.',
          it: 'I pensionati AVS/AI beneficiano di detrazioni particolari nella maggior parte dei cantoni. Queste detrazioni possono essere forfettarie (importo fisso) o proporzionali (percentuale della rendita). Mirano ad alleggerire il carico fiscale di questa categoria di contribuenti.',
          en: 'AVS/AI pensioners benefit from particular deductions in most cantons. These deductions can be flat-rate (fixed amount) or proportional (percentage of pension). They aim to lighten the tax burden of this category of taxpayers.'
        },
        keyPoints: {
          fr: 'Déductions forfaitaires ou proportionnelles\nFrais médicaux facilités\nPrimes maladie déductibles\n3e pilier A jusqu\'à retraite AVS\nSeuils plus favorables selon âge',
          de: 'Pauschale oder proportionale Abzüge\nErleichterte Krankheitskosten\nKrankenkassenprämien abzugsfähig\n3. Säule A bis AHV-Rente\nGünstigere Schwellen nach Alter',
          it: 'Detrazioni forfettarie o proporzionali\nSpese mediche facilitate\nPremi malattia detraibili\n3° pilastro A fino a pensione AVS\nSoglie più favorevoli secondo età',
          en: 'Flat-rate or proportional deductions\nFacilitated medical expenses\nHealth insurance premiums deductible\n3rd pillar A until AVS retirement\nMore favorable thresholds by age'
        }
      },
      'optimisation-retraite': {
        title: {
          fr: 'Optimisation fiscale à la retraite',
          de: 'Steueroptimierung im Ruhestand',
          it: 'Ottimizzazione fiscale in pensione',
          en: 'Tax optimization in retirement'
        },
        content: {
          fr: 'La planification de la retraite doit intégrer l\'aspect fiscal des prestations. Le choix entre rente et capital pour la LPP a des implications fiscales importantes : la rente est imposée annuellement, le capital une seule fois mais à un taux privilégié.',
          de: 'Die Ruhestandsplanung muss die steuerlichen Aspekte der Leistungen integrieren. Die Wahl zwischen Rente und Kapital für die BVG hat wichtige steuerliche Auswirkungen: Die Rente wird jährlich besteuert, das Kapital einmalig aber zu einem privilegierten Satz.',
          it: 'La pianificazione della pensione deve integrare l\'aspetto fiscale delle prestazioni. La scelta tra rendita e capitale per la LPP ha implicazioni fiscali importanti: la rendita è tassata annualmente, il capitale una sola volta ma a un tasso privilegiato.',
          en: 'Retirement planning must integrate the tax aspect of benefits. The choice between pension and capital for LPP has important tax implications: the pension is taxed annually, capital once but at a privileged rate.'
        },
        keyPoints: {
          fr: 'Choix rente vs capital LPP crucial\nÉtalement retraits 3e pilier\nRépartition revenus entre conjoints\nChoix canton spécifique retraités\nPlanification globale nécessaire',
          de: 'Wahl Rente vs. BVG-Kapital entscheidend\nVerteilung 3. Säule Bezüge\nEinkommensverteilung zwischen Ehepartnern\nSpezielle Kantonswahl für Rentner\nGanzheitliche Planung notwendig',
          it: 'Scelta rendita vs capitale LPP cruciale\nRipartizione prelievi 3° pilastro\nDistribuzione redditi tra coniugi\nScelta cantone specifica pensionati\nPianificazione globale necessaria',
          en: 'Choice pension vs LPP capital crucial\nSpread 3rd pillar withdrawals\nIncome distribution between spouses\nSpecific canton choice for retirees\nComprehensive planning necessary'
        },
        example: {
          fr: 'Un capital LPP de 500\'000 CHF peut être imposé une fois à 5% (25\'000 CHF) plutôt qu\'une rente de 20\'000 CHF/an imposée 25 ans à 15% (75\'000 CHF total).',
          de: 'Ein BVG-Kapital von 500\'000 CHF kann einmal mit 5% besteuert werden (25\'000 CHF) anstatt einer Rente von 20\'000 CHF/Jahr, die 25 Jahre lang mit 15% besteuert wird (75\'000 CHF total).',
          it: 'Un capitale LPP di 500\'000 CHF può essere tassato una volta al 5% (25\'000 CHF) piuttosto che una rendita di 20\'000 CHF/anno tassata 25 anni al 15% (75\'000 CHF totale).',
          en: 'An LPP capital of 500,000 CHF can be taxed once at 5% (25,000 CHF) rather than a pension of 20,000 CHF/year taxed 25 years at 15% (75,000 CHF total).'
        }
      }
    }
  },

  'revenus-immobiliers-personnes-physiques': {
    title: {
      fr: 'Les revenus immobiliers des personnes physiques',
      de: 'Die Immobilienerträge der natürlichen Personen',
      it: 'I redditi immobiliari delle persone fisiche',
      en: 'Real estate income of individuals'
    },
    description: {
      fr: 'Imposition des revenus locatifs, valeur locative et déductions immobilières',
      de: 'Besteuerung von Mieteinnahmen, Eigenmietwert und Immobilienabzügen',
      it: 'Imposizione dei redditi locativi, valore locativo e detrazioni immobiliari',
      en: 'Taxation of rental income, rental value and real estate deductions'
    },
    content: {
      fr: 'Les revenus immobiliers constituent une composante importante du patrimoine de nombreux contribuables suisses. Leur traitement fiscal obéit à des règles spécifiques qui distinguent les différents types de revenus et de charges, nécessitant une compréhension approfondie pour optimiser sa situation fiscale.',
      de: 'Immobilienerträge bilden einen wichtigen Bestandteil des Vermögens vieler Schweizer Steuerpflichtiger. Ihre steuerliche Behandlung folgt spezifischen Regeln, die verschiedene Arten von Erträgen und Lasten unterscheiden und ein tiefes Verständnis erfordern, um die Steuersituation zu optimieren.',
      it: 'I redditi immobiliari costituiscono una componente importante del patrimonio di molti contribuenti svizzeri. Il loro trattamento fiscale obbedisce a regole specifiche che distinguono i diversi tipi di redditi e oneri, richiedendo una comprensione approfondita per ottimizzare la propria situazione fiscale.',
      en: 'Real estate income constitutes an important component of many Swiss taxpayers\' wealth. Their tax treatment follows specific rules that distinguish different types of income and charges, requiring deep understanding to optimize one\'s tax situation.'
    },
    sections: {
      'revenus-locatifs': {
        title: {
          fr: 'Imposition des revenus locatifs',
          de: 'Besteuerung der Mieteinnahmen',
          it: 'Imposizione dei redditi locativi',
          en: 'Taxation of rental income'
        },
        content: {
          fr: 'Les revenus locatifs sont intégralement imposables comme revenus immobiliers. Le montant imposable correspond aux loyers effectivement perçus, y compris les charges répercutées aux locataires et les accessoires (places de parc, caves).',
          de: 'Mieteinnahmen sind vollständig als Immobilienerträge steuerpflichtig. Der steuerbare Betrag entspricht den tatsächlich erhaltenen Mieten, einschließlich der an die Mieter weiterverrechneten Nebenkosten und Zubehör (Parkplätze, Keller).',
          it: 'I redditi locativi sono integralmente imponibili come redditi immobiliari. L\'importo imponibile corrisponde agli affitti effettivamente percepiti, compresi gli oneri ribaltati sui locatari e gli accessori (posti auto, cantine).',
          en: 'Rental income is fully taxable as real estate income. The taxable amount corresponds to rents actually received, including charges passed on to tenants and accessories (parking spaces, cellars).'
        },
        keyPoints: {
          fr: 'Loyers intégralement imposables\nCréances irrécouvrables déductibles\nSous-locations et Airbnb inclus\nLocations proches à prix marché\nCharges répercutées imposables',
          de: 'Mieten vollständig steuerpflichtig\nUneinbringliche Forderungen abzugsfähig\nUntervermietungen und Airbnb eingeschlossen\nVermietungen an Nahestehende zu Marktpreisen\nWeiterverrechnete Nebenkosten steuerpflichtig',
          it: 'Affitti integralmente imponibili\nCrediti inesigibili detraibili\nSublocazioni e Airbnb inclusi\nLocazioni a persone vicine a prezzi di mercato\nOneri ribaltati imponibili',
          en: 'Rents fully taxable\nBad debts deductible\nSublets and Airbnb included\nRentals to related parties at market prices\nPassed-on charges taxable'
        }
      },
      'charges-deductibles': {
        title: {
          fr: 'Charges déductibles',
          de: 'Abzugsfähige Lasten',
          it: 'Oneri detraibili',
          en: 'Deductible charges'
        },
        content: {
          fr: 'Les frais d\'entretien et de réparation sont déductibles s\'ils maintiennent la substance de l\'immeuble sans l\'améliorer. Cette distinction entre entretien (déductible) et amélioration (non déductible) est cruciale mais parfois délicate.',
          de: 'Unterhalts- und Reparaturkosten sind abzugsfähig, wenn sie die Substanz der Immobilie erhalten, ohne sie zu verbessern. Diese Unterscheidung zwischen Unterhalt (abzugsfähig) und Verbesserung (nicht abzugsfähig) ist entscheidend, aber manchmal heikel.',
          it: 'Le spese di manutenzione e riparazione sono detraibili se mantengono la sostanza dell\'immobile senza migliorarlo. Questa distinzione tra manutenzione (detraibile) e miglioramento (non detraibile) è cruciale ma a volte delicata.',
          en: 'Maintenance and repair costs are deductible if they maintain the substance of the building without improving it. This distinction between maintenance (deductible) and improvement (non-deductible) is crucial but sometimes delicate.'
        },
        keyPoints: {
          fr: 'Entretien déductible, amélioration non\nIntérêts hypothécaires intégralement déductibles\nAssurances et gérance déductibles\nPas d\'amortissement pour personnes physiques\nDéficit immobilier imputable autres revenus',
          de: 'Unterhalt abzugsfähig, Verbesserung nicht\nHypothekarzinsen vollständig abzugsfähig\nVersicherungen und Verwaltung abzugsfähig\nKeine Abschreibungen für natürliche Personen\nImmobiliendefizit anrechenbar an andere Einkommen',
          it: 'Manutenzione detraibile, miglioramento no\nInteressi ipotecari integralmente detraibili\nAssicurazioni e amministrazione detraibili\nNessun ammortamento per persone fisiche\nDeficit immobiliare imputabile ad altri redditi',
          en: 'Maintenance deductible, improvement not\nMortgage interest fully deductible\nInsurance and management deductible\nNo depreciation for individuals\nReal estate deficit chargeable to other income'
        }
      },
      'optimisation-immobiliere': {
        title: {
          fr: 'Optimisation fiscale immobilière',
          de: 'Steueroptimierung bei Immobilien',
          it: 'Ottimizzazione fiscale immobiliare',
          en: 'Real estate tax optimization'
        },
        content: {
          fr: 'Le timing des travaux influence l\'optimisation : grouper les gros entretiens les années à hauts revenus (taux marginal élevé) maximise l\'avantage fiscal. À l\'inverse, étaler les travaux peut éviter de créer des déficits importants inutilisables.',
          de: 'Das Timing der Arbeiten beeinflusst die Optimierung: Große Unterhaltsarbeiten in Jahren mit hohen Einkommen zu bündeln (hoher Grenzsteuersatz) maximiert den Steuervorteil. Umgekehrt kann die Verteilung der Arbeiten vermeiden, wichtige unnutzbare Defizite zu schaffen.',
          it: 'Il timing dei lavori influenza l\'ottimizzazione: raggruppare le grandi manutenzioni negli anni con alti redditi (tasso marginale elevato) massimizza il vantaggio fiscale. Al contrario, dilazionare i lavori può evitare di creare deficit importanti inutilizzabili.',
          en: 'The timing of work influences optimization: grouping major maintenance in high-income years (high marginal rate) maximizes tax advantage. Conversely, spreading work can avoid creating large unusable deficits.'
        },
        keyPoints: {
          fr: 'Timing travaux selon revenus autres\nMaintenir endettement déductible optimal\nRépartition entre conjoints stratégique\nMoment vente influence gains imposables\nPlanification long terme nécessaire',
          de: 'Timing der Arbeiten nach anderen Einkommen\nOptimale abzugsfähige Verschuldung beibehalten\nStrategische Aufteilung zwischen Ehepartnern\nVerkaufszeitpunkt beeinflusst steuerpflichtige Gewinne\nLangfristige Planung notwendig',
          it: 'Timing lavori secondo altri redditi\nMantenere indebitamento detraibile ottimale\nRipartizione tra coniugi strategica\nMomento vendita influenza plusvalenze imponibili\nPianificazione a lungo termine necessaria',
          en: 'Work timing according to other income\nMaintain optimal deductible debt\nStrategic distribution between spouses\nSale timing influences taxable gains\nLong-term planning necessary'
        },
        example: {
          fr: 'Un couple peut attribuer un immeuble locatif au conjoint à hauts revenus pour maximiser la déduction des intérêts hypothécaires, tout en déclarant les loyers chez le conjoint moins imposé.',
          de: 'Ein Ehepaar kann ein Mietobjekt dem Partner mit hohem Einkommen zuweisen, um den Abzug der Hypothekarzinsen zu maximieren, während die Mieten beim weniger besteuerten Partner deklariert werden.',
          it: 'Una coppia può attribuire un immobile locativo al coniuge con alti redditi per massimizzare la detrazione degli interessi ipotecari, dichiarando gli affitti presso il coniuge meno tassato.',
          en: 'A couple can assign a rental property to the high-income spouse to maximize mortgage interest deduction, while declaring rents with the less taxed spouse.'
        }
      }
    }
  },

  'statut-independant-criteres': {
    title: {
      fr: 'Critères de détermination du statut d\'indépendant',
      de: 'Kriterien zur Bestimmung des Selbständigenstatus',
      it: 'Criteri di determinazione dello statuto di indipendente',
      en: 'Criteria for determining self-employed status'
    },
    description: {
      fr: 'Comment distinguer l\'activité indépendante du salariat : critères légaux, fiscaux et pratiques',
      de: 'Wie man selbständige Tätigkeit von Angestelltenverhältnis unterscheidet: rechtliche, steuerliche und praktische Kriterien',
      it: 'Come distinguere l\'attività indipendente dal lavoro dipendente: criteri legali, fiscali e pratici',
      en: 'How to distinguish self-employed activity from employment: legal, tax and practical criteria'
    },
    content: {
      fr: 'La distinction entre activité indépendante et salariat constitue un enjeu majeur du droit fiscal et social suisse. Cette qualification détermine non seulement le régime d\'imposition applicable, mais également les obligations en matière de cotisations sociales et de prévoyance professionnelle.',
      de: 'Die Unterscheidung zwischen selbständiger Tätigkeit und Angestelltenverhältnis stellt ein wichtiges Thema des schweizerischen Steuer- und Sozialrechts dar. Diese Qualifikation bestimmt nicht nur das anwendbare Steuerregime, sondern auch die Verpflichtungen bezüglich Sozialversicherungsbeiträgen und beruflicher Vorsorge.',
      it: 'La distinzione tra attività indipendente e lavoro dipendente costituisce una questione importante del diritto fiscale e sociale svizzero. Questa qualificazione determina non solo il regime di imposizione applicabile, ma anche gli obblighi in materia di contributi sociali e previdenza professionale.',
      en: 'The distinction between self-employed activity and employment constitutes a major issue in Swiss tax and social law. This qualification determines not only the applicable tax regime, but also obligations regarding social contributions and occupational pension.'
    },
    sections: {
      'criteres-legaux': {
        title: {
          fr: 'Critères légaux fondamentaux',
          de: 'Grundlegende rechtliche Kriterien',
          it: 'Criteri legali fondamentali',
          en: 'Fundamental legal criteria'
        },
        content: {
          fr: 'La distinction entre activité indépendante et salariat repose sur plusieurs critères cumulatifs établis par la jurisprudence. Le critère principal est l\'autonomie dans l\'organisation du travail : l\'indépendant détermine librement ses horaires, ses méthodes et son lieu de travail.',
          de: 'Die Unterscheidung zwischen selbständiger Tätigkeit und Angestelltenverhältnis beruht auf mehreren kumulativen Kriterien, die durch die Rechtsprechung etabliert wurden. Das Hauptkriterium ist die Autonomie in der Arbeitsorganisation: Der Selbständige bestimmt frei seine Arbeitszeiten, seine Methoden und seinen Arbeitsplatz.',
          it: 'La distinzione tra attività indipendente e lavoro dipendente si basa su diversi criteri cumulativi stabiliti dalla giurisprudenza. Il criterio principale è l\'autonomia nell\'organizzazione del lavoro: l\'indipendente determina liberamente i suoi orari, i suoi metodi e il suo luogo di lavoro.',
          en: 'The distinction between self-employed activity and employment is based on several cumulative criteria established by case law. The main criterion is autonomy in work organization: the self-employed person freely determines their schedules, methods and workplace.'
        },
        keyPoints: {
          fr: 'Autonomie dans l\'organisation du travail\nAbsence de subordination hiérarchique\nSupport du risque économique\nAutonomie commerciale et tarifaire\nPossibilité de clientèle multiple',
          de: 'Autonomie in der Arbeitsorganisation\nFehlen hierarchischer Unterordnung\nTragung des wirtschaftlichen Risikos\nKommerzielle und tarifliche Autonomie\nMöglichkeit mehrerer Kunden',
          it: 'Autonomia nell\'organizzazione del lavoro\nAssenza di subordinazione gerarchica\nSostenimento del rischio economico\nAutonomia commerciale e tariffaria\nPossibilità di clientela multipla',
          en: 'Autonomy in work organization\nAbsence of hierarchical subordination\nBearing economic risk\nCommercial and pricing autonomy\nPossibility of multiple clients'
        }
      },
      'implications-fiscales': {
        title: {
          fr: 'Implications fiscales du statut',
          de: 'Steuerliche Auswirkungen des Status',
          it: 'Implicazioni fiscali dello statuto',
          en: 'Tax implications of status'
        },
        content: {
          fr: 'Le statut d\'indépendant entraîne une imposition différente du salariat. Les revenus indépendants sont imposés après déduction des charges d\'exploitation, permettant une optimisation fiscale plus large que pour les salariés.',
          de: 'Der Selbständigenstatus führt zu einer anderen Besteuerung als das Angestelltenverhältnis. Die selbständigen Einkommen werden nach Abzug der Betriebsausgaben besteuert, was eine breitere Steueroptimierung ermöglicht als für Angestellte.',
          it: 'Lo statuto di indipendente comporta un\'imposizione diversa dal lavoro dipendente. I redditi indipendenti sono tassati dopo detrazione delle spese di gestione, permettendo un\'ottimizzazione fiscale più ampia che per i dipendenti.',
          en: 'Self-employed status results in different taxation than employment. Self-employed income is taxed after deduction of operating expenses, allowing broader tax optimization than for employees.'
        },
        keyPoints: {
          fr: 'Déduction des charges d\'exploitation\nCotisations AVS doublées (10.6%)\nTVA obligatoire dès 100\'000 CHF\nPas d\'assurance-chômage obligatoire\nPrévoyance LPP facultative',
          de: 'Abzug der Betriebsausgaben\nVerdoppelte AHV-Beiträge (10,6%)\nMWST obligatorisch ab 100\'000 CHF\nKeine obligatorische Arbeitslosenversicherung\nFreiwillige BVG-Vorsorge',
          it: 'Detrazione delle spese di gestione\nContributi AVS raddoppiati (10,6%)\nIVA obbligatoria da 100\'000 CHF\nNessuna assicurazione disoccupazione obbligatoria\nPrevidenza LPP facoltativa',
          en: 'Deduction of operating expenses\nDoubled AVS contributions (10.6%)\nVAT mandatory from 100,000 CHF\nNo mandatory unemployment insurance\nOptional LPP pension'
        }
      }
    }
  },

  'formes-juridiques-entreprises': {
    title: {
      fr: 'Choix de la forme juridique et implications fiscales',
      de: 'Wahl der Rechtsform und steuerliche Auswirkungen',
      it: 'Scelta della forma giuridica e implicazioni fiscali',
      en: 'Choice of legal form and tax implications'
    },
    description: {
      fr: 'Comparaison fiscale des différentes formes juridiques : entreprise individuelle, société de personnes, société de capitaux',
      de: 'Steuerlicher Vergleich verschiedener Rechtsformen: Einzelunternehmen, Personengesellschaft, Kapitalgesellschaft',
      it: 'Confronto fiscale delle diverse forme giuridiche: impresa individuale, società di persone, società di capitali',
      en: 'Tax comparison of different legal forms: sole proprietorship, partnership, corporation'
    },
    content: {
      fr: 'Le choix de la forme juridique constitue une décision stratégique majeure pour tout entrepreneur. Cette décision influence directement la charge fiscale, les obligations administratives, et les possibilités d\'optimisation fiscale de l\'entreprise.',
      de: 'Die Wahl der Rechtsform stellt eine wichtige strategische Entscheidung für jeden Unternehmer dar. Diese Entscheidung beeinflusst direkt die Steuerbelastung, die administrativen Verpflichtungen und die Möglichkeiten der Steueroptimierung des Unternehmens.',
      it: 'La scelta della forma giuridica costituisce una decisione strategica importante per ogni imprenditore. Questa decisione influenza direttamente il carico fiscale, gli obblighi amministrativi e le possibilità di ottimizzazione fiscale dell\'impresa.',
      en: 'The choice of legal form constitutes a major strategic decision for any entrepreneur. This decision directly influences the tax burden, administrative obligations, and tax optimization possibilities of the business.'
    },
    sections: {
      'entreprise-individuelle': {
        title: {
          fr: 'Entreprise individuelle',
          de: 'Einzelunternehmen',
          it: 'Impresa individuale',
          en: 'Sole proprietorship'
        },
        content: {
          fr: 'L\'entreprise individuelle constitue la forme la plus simple et la plus courante pour débuter une activité indépendante. Sur le plan fiscal, elle se caractérise par une transparence totale : les bénéfices sont directement imposés chez la personne physique selon les barèmes progressifs habituels.',
          de: 'Das Einzelunternehmen stellt die einfachste und häufigste Form dar, um eine selbständige Tätigkeit zu beginnen. Steuerlich zeichnet es sich durch völlige Transparenz aus: Die Gewinne werden direkt bei der natürlichen Person nach den üblichen progressiven Tarifen besteuert.',
          it: 'L\'impresa individuale costituisce la forma più semplice e più comune per iniziare un\'attività indipendente. Dal punto di vista fiscale, si caratterizza per una trasparenza totale: i profitti sono direttamente tassati presso la persona fisica secondo le tariffe progressive abituali.',
          en: 'Sole proprietorship constitutes the simplest and most common form to start self-employed activity. Fiscally, it is characterized by total transparency: profits are directly taxed at the individual level according to usual progressive scales.'
        },
        keyPoints: {
          fr: 'Transparence fiscale totale\nImposition selon barèmes personnes physiques\nSimplicité administrative\nResponsabilité illimitée\nCotisations AVS/AI 10.6%',
          de: 'Völlige steuerliche Transparenz\nBesteuerung nach Tarifen natürlicher Personen\nAdministrative Einfachheit\nUnbeschränkte Haftung\nAHV/IV-Beiträge 10,6%',
          it: 'Trasparenza fiscale totale\nImposizione secondo tariffe persone fisiche\nSemplicità amministrativa\nResponsabilità illimitata\nContributi AVS/AI 10,6%',
          en: 'Total tax transparency\nTaxation according to individual scales\nAdministrative simplicity\nUnlimited liability\nAVS/AI contributions 10.6%'
        }
      },
      'societe-personnes': {
        title: {
          fr: 'Sociétés de personnes (SNC, société simple)',
          de: 'Personengesellschaften (KG, einfache Gesellschaft)',
          it: 'Società di persone (SNC, società semplice)',
          en: 'Partnerships (general partnership, simple partnership)'
        },
        content: {
          fr: 'Les sociétés de personnes (société en nom collectif, société simple) conservent la transparence fiscale : les bénéfices sont répartis entre les associés selon leurs quotes-parts et imposés directement chez eux comme revenus d\'activité indépendante.',
          de: 'Personengesellschaften (Kollektivgesellschaft, einfache Gesellschaft) behalten die steuerliche Transparenz: Die Gewinne werden unter den Gesellschaftern nach ihren Anteilen aufgeteilt und direkt bei ihnen als Einkommen aus selbständiger Erwerbstätigkeit besteuert.',
          it: 'Le società di persone (società in nome collettivo, società semplice) conservano la trasparenza fiscale: i profitti sono ripartiti tra i soci secondo le loro quote-parti e tassati direttamente presso di loro come redditi da attività indipendente.',
          en: 'Partnerships (general partnership, simple partnership) maintain tax transparency: profits are distributed among partners according to their shares and taxed directly with them as self-employed income.'
        },
        keyPoints: {
          fr: 'Transparence fiscale maintenue\nRépartition bénéfices selon quotes-parts\nResponsabilité solidaire illimitée\nImputation pertes possible\nComplications dissolution',
          de: 'Steuerliche Transparenz beibehalten\nGewinnverteilung nach Anteilen\nSolidarische unbeschränkte Haftung\nVerlustverrechnung möglich\nKomplikationen bei Auflösung',
          it: 'Trasparenza fiscale mantenuta\nRipartizione profitti secondo quote-parti\nResponsabilità solidale illimitata\nImputazione perdite possibile\nComplicazioni scioglimento',
          en: 'Tax transparency maintained\nProfit distribution by shares\nJoint unlimited liability\nLoss offset possible\nDissolution complications'
        }
      },
      'societe-capitaux': {
        title: {
          fr: 'Sociétés de capitaux (SA, Sàrl)',
          de: 'Kapitalgesellschaften (AG, GmbH)',
          it: 'Società di capitali (SA, Sagl)',
          en: 'Corporations (public limited company, limited liability company)'
        },
        content: {
          fr: 'Les sociétés de capitaux (SA, Sàrl) créent une personnalité juridique distincte avec ses propres obligations fiscales. La société paie l\'impôt sur le bénéfice et le capital, puis les distributions aux actionnaires/associés sont imposées chez ces derniers (double imposition économique).',
          de: 'Kapitalgesellschaften (AG, GmbH) schaffen eine eigenständige Rechtspersönlichkeit mit eigenen steuerlichen Verpflichtungen. Die Gesellschaft zahlt Gewinn- und Kapitalsteuer, dann werden die Ausschüttungen an Aktionäre/Gesellschafter bei diesen besteuert (wirtschaftliche Doppelbesteuerung).',
          it: 'Le società di capitali (SA, Sagl) creano una personalità giuridica distinta con i propri obblighi fiscali. La società paga l\'imposta sul profitto e sul capitale, poi le distribuzioni agli azionisti/soci sono tassate presso questi ultimi (doppia imposizione economica).',
          en: 'Corporations (public limited company, limited liability company) create a distinct legal personality with its own tax obligations. The company pays profit and capital tax, then distributions to shareholders/members are taxed with them (economic double taxation).'
        },
        keyPoints: {
          fr: 'Personnalité juridique distincte\nDouble imposition économique\nTaux proportionnel 12-21%\nParticipation qualifiée atténue double imposition\nResponsabilité limitée',
          de: 'Eigenständige Rechtspersönlichkeit\nWirtschaftliche Doppelbesteuerung\nProportionaler Satz 12-21%\nQualifizierte Beteiligung mildert Doppelbesteuerung\nBeschränkte Haftung',
          it: 'Personalità giuridica distinta\nDoppia imposizione economica\nTasso proporzionale 12-21%\nPartecipazione qualificata attenua doppia imposizione\nResponsabilità limitata',
          en: 'Distinct legal personality\nEconomic double taxation\nProportional rate 12-21%\nQualified participation mitigates double taxation\nLimited liability'
        },
        example: {
          fr: 'Une Sàrl réalisant 200\'000 CHF de bénéfice paie environ 30\'000 CHF d\'impôt sociétal, puis l\'actionnaire paie l\'impôt réduit sur les dividendes distribués.',
          de: 'Eine GmbH mit 200\'000 CHF Gewinn zahlt etwa 30\'000 CHF Gesellschaftssteuer, dann zahlt der Aktionär die reduzierte Steuer auf ausgeschüttete Dividenden.',
          it: 'Una Sagl che realizza 200\'000 CHF di profitto paga circa 30\'000 CHF di imposta societaria, poi l\'azionista paga l\'imposta ridotta sui dividendi distribuiti.',
          en: 'A limited liability company achieving 200,000 CHF profit pays about 30,000 CHF corporate tax, then the shareholder pays reduced tax on distributed dividends.'
        }
      },
      'choix-optimal': {
        title: {
          fr: 'Critères de choix optimal',
          de: 'Kriterien für optimale Wahl',
          it: 'Criteri di scelta ottimale',
          en: 'Optimal choice criteria'
        },
        content: {
          fr: 'Le choix de la forme juridique dépend principalement du niveau de bénéfices prévisibles, de la situation fiscale personnelle, des besoins de financement et des objectifs de développement. Une analyse comparative s\'impose.',
          de: 'Die Wahl der Rechtsform hängt hauptsächlich vom zu erwartenden Gewinnniveau, der persönlichen Steuersituation, dem Finanzierungsbedarf und den Entwicklungszielen ab. Eine vergleichende Analyse ist erforderlich.',
          it: 'La scelta della forma giuridica dipende principalmente dal livello di profitti prevedibili, dalla situazione fiscale personale, dai bisogni di finanziamento e dagli obiettivi di sviluppo. Si impone un\'analisi comparativa.',
          en: 'The choice of legal form depends mainly on the level of foreseeable profits, personal tax situation, financing needs and development objectives. A comparative analysis is required.'
        },
        keyPoints: {
          fr: 'Analyse selon niveau bénéfices\nEntreprise individuelle < 100\'000 CHF\nSociété capitaux > 150\'000-200\'000 CHF\nAutres facteurs : financement, protection, transmission\nÉquilibre optimisation/complexité',
          de: 'Analyse nach Gewinnniveau\nEinzelunternehmen < 100\'000 CHF\nKapitalgesellschaft > 150\'000-200\'000 CHF\nAndere Faktoren: Finanzierung, Schutz, Übertragung\nGleichgewicht Optimierung/Komplexität',
          it: 'Analisi secondo livello profitti\nImpresa individuale < 100\'000 CHF\nSocietà capitali > 150\'000-200\'000 CHF\nAltri fattori: finanziamento, protezione, trasmissione\nEquilibrio ottimizzazione/complessità',
          en: 'Analysis by profit level\nSole proprietorship < 100,000 CHF\nCorporation > 150,000-200,000 CHF\nOther factors: financing, protection, transmission\nOptimization/complexity balance'
        }
      }
    }
  },

  'tva-assujettissement-entreprises': {
    title: {
      fr: 'TVA : assujettissement et obligations des entreprises',
      de: 'MWST: Steuerpflicht und Unternehmenspflichten',
      it: 'IVA: assoggettamento e obblighi delle imprese',
      en: 'VAT: tax liability and business obligations'
    },
    description: {
      fr: 'Guide complet de la TVA pour entreprises : seuils, méthodes de calcul, décomptes et optimisation',
      de: 'Vollständiger MWST-Leitfaden für Unternehmen: Schwellenwerte, Berechnungsmethoden, Abrechnungen und Optimierung',
      it: 'Guida completa dell\'IVA per imprese: soglie, metodi di calcolo, conteggi e ottimizzazione',
      en: 'Complete VAT guide for businesses: thresholds, calculation methods, returns and optimization'
    },
    content: {
      fr: 'La taxe sur la valeur ajoutée (TVA) représente un élément central de la fiscalité des entreprises en Suisse. Sa maîtrise est indispensable pour toute activité commerciale, tant pour respecter les obligations légales que pour optimiser la gestion financière de l\'entreprise.',
      de: 'Die Mehrwertsteuer (MWST) stellt ein zentrales Element der Unternehmensbesteuerung in der Schweiz dar. Ihre Beherrschung ist für jede Geschäftstätigkeit unerlässlich, sowohl um die gesetzlichen Verpflichtungen zu erfüllen als auch um das Finanzmanagement des Unternehmens zu optimieren.',
      it: 'L\'imposta sul valore aggiunto (IVA) rappresenta un elemento centrale della fiscalità delle imprese in Svizzera. La sua padronanza è indispensabile per qualsiasi attività commerciale, sia per rispettare gli obblighi legali che per ottimizzare la gestione finanziaria dell\'impresa.',
      en: 'Value Added Tax (VAT) represents a central element of business taxation in Switzerland. Its mastery is essential for any commercial activity, both to comply with legal obligations and to optimize the company\'s financial management.'
    },
    sections: {
      'seuils-assujettissement': {
        title: {
          fr: 'Seuils et conditions d\'assujettissement',
          de: 'Schwellenwerte und Steuerpflichtbedingungen',
          it: 'Soglie e condizioni di assoggettamento',
          en: 'Thresholds and tax liability conditions'
        },
        content: {
          fr: 'L\'assujettissement à la TVA devient obligatoire dès que le chiffre d\'affaires annuel atteint 100\'000 CHF. Ce seuil s\'applique aux livraisons et prestations imposables réalisées en Suisse, en excluant les opérations exonérées.',
          de: 'Die MWST-Pflicht wird obligatorisch, sobald der jährliche Umsatz 100\'000 CHF erreicht. Diese Schwelle gilt für steuerbare Lieferungen und Leistungen in der Schweiz, unter Ausschluss befreiter Geschäfte.',
          it: 'L\'assoggettamento all\'IVA diventa obbligatorio non appena il fatturato annuale raggiunge 100\'000 CHF. Questa soglia si applica alle consegne e prestazioni imponibili realizzate in Svizzera, escludendo le operazioni esenti.',
          en: 'VAT liability becomes mandatory as soon as annual turnover reaches 100,000 CHF. This threshold applies to taxable deliveries and services performed in Switzerland, excluding exempt transactions.'
        },
        keyPoints: {
          fr: 'Seuil obligatoire : 100\'000 CHF annuel\nOption volontaire en dessous du seuil\nAnnonce obligatoire dans 30 jours\nAssujettissement rétroactif au trimestre\nDemande possible avant début activité',
          de: 'Obligatorische Schwelle: 100\'000 CHF jährlich\nFreiwillige Option unter der Schwelle\nObligatorische Meldung binnen 30 Tagen\nRückwirkende Steuerpflicht zum Quartal\nAntrag vor Tätigkeitsbeginn möglich',
          it: 'Soglia obbligatoria: 100\'000 CHF annuali\nOpzione volontaria sotto la soglia\nDenuncia obbligatoria entro 30 giorni\nAssoggettamento retroattivo al trimestre\nRichiesta possibile prima dell\'inizio attività',
          en: 'Mandatory threshold: 100,000 CHF annually\nVoluntary option below threshold\nMandatory notification within 30 days\nRetroactive liability to quarter\nApplication possible before start of activity'
        }
      },
      'methodes-calcul': {
        title: {
          fr: 'Méthodes de calcul et décomptes',
          de: 'Berechnungsmethoden und Abrechnungen',
          it: 'Metodi di calcolo e conteggi',
          en: 'Calculation methods and returns'
        },
        content: {
          fr: 'La méthode effective (convenue) constitue la règle générale : la TVA est calculée sur chaque facture au taux applicable (8.1%, 2.6% ou 3.8%), et l\'impôt préalable est récupéré sur les achats avec justificatifs.',
          de: 'Die effektive (vereinbarte) Methode bildet die allgemeine Regel: Die MWST wird auf jeder Rechnung zum anwendbaren Satz berechnet (8,1%, 2,6% oder 3,8%), und die Vorsteuer wird auf Einkäufe mit Belegen zurückgefordert.',
          it: 'Il metodo effettivo (concordato) costituisce la regola generale: l\'IVA è calcolata su ogni fattura al tasso applicabile (8,1%, 2,6% o 3,8%), e l\'imposta precedente è recuperata sugli acquisti con giustificativi.',
          en: 'The effective (agreed) method constitutes the general rule: VAT is calculated on each invoice at the applicable rate (8.1%, 2.6% or 3.8%), and input tax is recovered on purchases with supporting documents.'
        },
        keyPoints: {
          fr: 'Méthode effective = règle générale\nForfaitaires = simplification PME\nDette fiscale nette = peu d\'achats\nDécomptes trimestriels standard\nPaiement dans 60 jours',
          de: 'Effektive Methode = allgemeine Regel\nPauschal = KMU-Vereinfachung\nNetto-Steuerschuld = wenige Einkäufe\nVierteljährliche Standardabrechnungen\nZahlung binnen 60 Tagen',
          it: 'Metodo effettivo = regola generale\nForfettari = semplificazione PMI\nDebito fiscale netto = pochi acquisti\nConteggi trimestrali standard\nPagamento entro 60 giorni',
          en: 'Effective method = general rule\nFlat rate = SME simplification\nNet tax debt = few purchases\nQuarterly standard returns\nPayment within 60 days'
        },
        example: {
          fr: 'Un restaurant peut choisir le taux forfaitaire de 3.7% sur son chiffre d\'affaires plutôt que de gérer la TVA détaillée sur chaque facture et récupérer l\'impôt préalable.',
          de: 'Ein Restaurant kann den Pauschalsatz von 3,7% auf seinen Umsatz wählen, anstatt die detaillierte MWST auf jeder Rechnung zu verwalten und die Vorsteuer zurückzufordern.',
          it: 'Un ristorante può scegliere il tasso forfettario del 3,7% sul suo fatturato piuttosto che gestire l\'IVA dettagliata su ogni fattura e recuperare l\'imposta precedente.',
          en: 'A restaurant can choose the flat rate of 3.7% on its turnover rather than managing detailed VAT on each invoice and recovering input tax.'
        }
      },
      'deduction-impot-prealable': {
        title: {
          fr: 'Déduction de l\'impôt préalable',
          de: 'Vorsteurabzug',
          it: 'Detrazione dell\'imposta precedente',
          en: 'Input tax deduction'
        },
        content: {
          fr: 'L\'impôt préalable peut être déduit sur tous les achats, investissements et charges directement liés à l\'activité imposable. Cette déduction constitue l\'avantage principal de l\'assujettissement pour les entreprises avec des investissements importants.',
          de: 'Die Vorsteuer kann auf alle Einkäufe, Investitionen und Lasten abgezogen werden, die direkt mit der steuerbaren Tätigkeit verbunden sind. Dieser Abzug stellt den Hauptvorteil der Steuerpflicht für Unternehmen mit wichtigen Investitionen dar.',
          it: 'L\'imposta precedente può essere dedotta su tutti gli acquisti, investimenti e oneri direttamente legati all\'attività imponibile. Questa detrazione costituisce il vantaggio principale dell\'assoggettamento per le imprese con investimenti importanti.',
          en: 'Input tax can be deducted on all purchases, investments and charges directly related to taxable activity. This deduction constitutes the main advantage of tax liability for businesses with significant investments.'
        },
        keyPoints: {
          fr: 'Déduction sur achats liés activité imposable\nJustificatifs originaux obligatoires\nRépartition si activités mixtes\nExclusions spécifiques (véhicules, représentation)\nOption spéciale pour immobilier',
          de: 'Abzug auf mit steuerbarer Tätigkeit verbundene Einkäufe\nOriginalbelege obligatorisch\nAufteilung bei gemischten Tätigkeiten\nSpezifische Ausschlüsse (Fahrzeuge, Repräsentation)\nSpezielle Option für Immobilien',
          it: 'Detrazione su acquisti legati all\'attività imponibile\nGiustificativi originali obbligatori\nRipartizione se attività miste\nEsclusioni specifiche (veicoli, rappresentanza)\nOpzione speciale per immobiliare',
          en: 'Deduction on purchases linked to taxable activity\nOriginal supporting documents mandatory\nAllocation if mixed activities\nSpecific exclusions (vehicles, entertainment)\nSpecial option for real estate'
        }
      },
      'optimisation-tva': {
        title: {
          fr: 'Optimisation et planification TVA',
          de: 'MWST-Optimierung und -Planung',
          it: 'Ottimizzazione e pianificazione IVA',
          en: 'VAT optimization and planning'
        },
        content: {
          fr: 'Le timing des facturations peut optimiser la trésorerie : retarder les facturations en fin de période pour reporter l\'exigibilité de la TVA au trimestre suivant. Inversement, accélérer les achats permet de récupérer plus rapidement l\'impôt préalable.',
          de: 'Das Timing der Rechnungsstellung kann die Liquidität optimieren: Rechnungsstellung am Periodenende verzögern, um die MWST-Fälligkeit auf das folgende Quartal zu verschieben. Umgekehrt ermöglicht es, Einkäufe zu beschleunigen, die Vorsteuer schneller zurückzugewinnen.',
          it: 'Il timing delle fatturazioni può ottimizzare la tesoreria: ritardare le fatturazioni a fine periodo per rimandare l\'esigibilità dell\'IVA al trimestre successivo. Inversamente, accelerare gli acquisti permette di recuperare più rapidamente l\'imposta precedente.',
          en: 'Invoice timing can optimize cash flow: delaying invoicing at period end to defer VAT liability to the following quarter. Conversely, accelerating purchases allows faster recovery of input tax.'
        },
        keyPoints: {
          fr: 'Timing facturations optimise trésorerie\nOption immobilier si locataires assujettis\nChangement méthode possible\nPlanification sortie TVA importante\nAnalyse comparative périodique',
          de: 'Timing Rechnungsstellung optimiert Liquidität\nImmobilien-Option bei steuerpflichtigen Mietern\nMethodenwechsel möglich\nPlanung MWST-Austritt wichtig\nPeriodische Vergleichsanalyse',
          it: 'Timing fatturazioni ottimizza tesoreria\nOpzione immobiliare se locatari assoggettati\nCambio metodo possibile\nPianificazione uscita IVA importante\nAnalisi comparativa periodica',
          en: 'Invoice timing optimizes cash flow\nReal estate option if tenants liable\nMethod change possible\nVAT exit planning important\nPeriodic comparative analysis'
        }
      }
    }
  },

  'valeur-locative-residence': {
    title: {
      fr: 'La valeur locative de la résidence principale',
      de: 'Der Eigenmietwert der Hauptwohnung',
      it: 'Il valore locativo della residenza principale',
      en: 'Rental value of primary residence'
    },
    description: {
      fr: 'Comprendre le calcul, la contestation et les déductions liées à la valeur locative',
      de: 'Verstehen Sie die Berechnung, Anfechtung und Abzüge im Zusammenhang mit dem Eigenmietwert',
      it: 'Comprendere il calcolo, la contestazione e le detrazioni legate al valore locativo',
      en: 'Understanding calculation, contestation and deductions related to rental value'
    },
    content: {
      fr: 'La valeur locative constitue l\'une des particularités les plus débattues du système fiscal suisse. Cette imposition du logement en propriété génère régulièrement des discussions politiques tout en restant un pilier important des recettes fiscales cantonales.',
      de: 'Der Eigenmietwert stellt eine der meist diskutierten Besonderheiten des Schweizer Steuersystems dar. Diese Besteuerung des Wohneigentums erzeugt regelmäßig politische Diskussionen, während sie ein wichtiger Pfeiler der kantonalen Steuereinnahmen bleibt.',
      it: 'Il valore locativo costituisce una delle particolarità più dibattute del sistema fiscale svizzero. Questa imposizione dell\'alloggio in proprietà genera regolarmente discussioni politiche pur rimanendo un pilastro importante delle entrate fiscali cantonali.',
      en: 'Rental value constitutes one of the most debated peculiarities of the Swiss tax system. This taxation of owner-occupied housing regularly generates political discussions while remaining an important pillar of cantonal tax revenues.'
    },
    sections: {
      'principe-valeur-locative': {
        title: {
          fr: 'Principe de la valeur locative',
          de: 'Prinzip des Eigenmietwerts',
          it: 'Principio del valore locativo',
          en: 'Principle of rental value'
        },
        content: {
          fr: 'La valeur locative représente le loyer théorique que le propriétaire devrait payer s\'il était locataire de son propre bien. Cette fiction juridique vise à établir l\'égalité de traitement entre propriétaires et locataires : les seconds paient un loyer avec leur revenu net d\'impôt, les premiers doivent déclarer un revenu fictif équivalent.',
          de: 'Der Eigenmietwert stellt die theoretische Miete dar, die der Eigentümer zahlen müsste, wenn er Mieter seiner eigenen Immobilie wäre. Diese Rechtsfiktion zielt darauf ab, Gleichbehandlung zwischen Eigentümern und Mietern zu schaffen: Letztere zahlen Miete mit ihrem Nettoeinkommen nach Steuern, Erstere müssen ein entsprechendes fiktives Einkommen deklarieren.',
          it: 'Il valore locativo rappresenta l\'affitto teorico che il proprietario dovrebbe pagare se fosse inquilino del proprio bene. Questa finzione giuridica mira a stabilire l\'uguaglianza di trattamento tra proprietari e inquilini: i secondi pagano un affitto con il loro reddito netto dopo le tasse, i primi devono dichiarare un reddito fittizio equivalente.',
          en: 'Rental value represents the theoretical rent that the owner should pay if they were a tenant of their own property. This legal fiction aims to establish equal treatment between owners and tenants: the latter pay rent with their net income after tax, the former must declare an equivalent fictitious income.'
        },
        keyPoints: {
          fr: 'Égalité propriétaires/locataires\n60-80% du loyer de marché effectif\nFixation par administration cantonale\nApplication à tous biens auto-occupés\nNeutralité fiscale entre modes de logement',
          de: 'Gleichheit Eigentümer/Mieter\n60-80% der effektiven Marktmiete\nFestsetzung durch Kantonsverwaltung\nAnwendung auf alle selbstbewohnten Immobilien\nSteuerliche Neutralität zwischen Wohnformen',
          it: 'Uguaglianza proprietari/inquilini\n60-80% dell\'affitto di mercato effettivo\nFissazione da parte dell\'amministrazione cantonale\nApplicazione a tutti i beni auto-occupati\nNeutralità fiscale tra modi di alloggio',
          en: 'Equality owners/tenants\n60-80% of effective market rent\nSetting by cantonal administration\nApplication to all self-occupied properties\nTax neutrality between housing modes'
        }
      },
      'calcul-contestation': {
        title: {
          fr: 'Calcul et contestation',
          de: 'Berechnung und Anfechtung',
          it: 'Calcolo e contestazione',
          en: 'Calculation and contestation'
        },
        content: {
          fr: 'Le calcul de la valeur locative se base sur des critères objectifs : surface, standing, situation géographique, état du bien et prix du marché locatif environnant. Les administrations disposent généralement de bases de données et de barèmes de référence.',
          de: 'Die Berechnung des Eigenmietwerts basiert auf objektiven Kriterien: Fläche, Standard, geografische Lage, Zustand der Immobilie und Preise des umliegenden Mietmarkts. Die Verwaltungen verfügen in der Regel über Datenbanken und Referenztarife.',
          it: 'Il calcolo del valore locativo si basa su criteri oggettivi: superficie, standing, situazione geografica, stato del bene e prezzi del mercato locativo circostante. Le amministrazioni dispongono generalmente di banche dati e tariffe di riferimento.',
          en: 'Rental value calculation is based on objective criteria: surface area, standing, geographical location, property condition and surrounding rental market prices. Administrations generally have databases and reference scales.'
        },
        keyPoints: {
          fr: 'Critères objectifs de marché\nContestation avec éléments comparatifs\nDéfauts et contraintes favorables\nRévision possible si changements\nRéévaluations périodiques cantonales',
          de: 'Objektive Marktkriterien\nAnfechtung mit vergleichenden Elementen\nMängel und günstige Beschränkungen\nRevision möglich bei Änderungen\nPeriodische kantonale Neubewertungen',
          it: 'Criteri oggettivi di mercato\nContestazione con elementi comparativi\nDifetti e vincoli favorevoli\nRevisione possibile se cambiamenti\nRivalutazioni periodiche cantonali',
          en: 'Objective market criteria\nContestation with comparative elements\nDefects and favorable constraints\nRevision possible if changes\nPeriodic cantonal revaluations'
        },
        example: {
          fr: 'Une maison avec valeur locative de 24\'000 CHF près d\'un aéroport peut obtenir une réduction si des biens similaires sans nuisance se louent effectivement 15-20% moins cher.',
          de: 'Ein Haus mit Eigenmietwert von 24\'000 CHF in der Nähe eines Flughafens kann eine Reduktion erhalten, wenn sich ähnliche Immobilien ohne Lärmbelastung tatsächlich 15-20% günstiger vermieten.',
          it: 'Una casa con valore locativo di 24\'000 CHF vicino a un aeroporto può ottenere una riduzione se beni simili senza fastidi si affittano effettivamente 15-20% meno caro.',
          en: 'A house with rental value of 24,000 CHF near an airport can obtain a reduction if similar properties without nuisance actually rent for 15-20% less.'
        }
      }
    }
  },

  'fiscalite-cryptomonnaies-suisse': {
    title: {
      fr: 'Fiscalité des cryptomonnaies en Suisse',
      de: 'Besteuerung von Kryptowährungen in der Schweiz',
      it: 'Fiscalità delle criptovalute in Svizzera',
      en: 'Taxation of cryptocurrencies in Switzerland'
    },
    description: {
      fr: 'Guide complet de l\'imposition des cryptomonnaies : fortune, gains, mining et trading professionnel',
      de: 'Vollständiger Leitfaden zur Besteuerung von Kryptowährungen: Vermögen, Gewinne, Mining und professioneller Handel',
      it: 'Guida completa all\'imposizione delle criptovalute: patrimonio, guadagni, mining e trading professionale',
      en: 'Complete guide to cryptocurrency taxation: wealth, gains, mining and professional trading'
    },
    content: {
      fr: 'La fiscalité des cryptomonnaies en Suisse reflète l\'approche pragmatique et innovante du pays envers les nouvelles technologies financières. Le cadre fiscal clair et prévisible fait de la Suisse une juridiction attractive pour les acteurs de l\'économie numérique.',
      de: 'Die Besteuerung von Kryptowährungen in der Schweiz spiegelt den pragmatischen und innovativen Ansatz des Landes gegenüber neuen Finanztechnologien wider. Der klare und vorhersehbare Steuerrahmen macht die Schweiz zu einer attraktiven Jurisdiktion für Akteure der digitalen Wirtschaft.',
      it: 'La fiscalità delle criptovalute in Svizzera riflette l\'approccio pragmatico e innovativo del paese verso le nuove tecnologie finanziarie. Il quadro fiscale chiaro e prevedibile rende la Svizzera una giurisdizione attrattiva per gli attori dell\'economia digitale.',
      en: 'Cryptocurrency taxation in Switzerland reflects the country\'s pragmatic and innovative approach to new financial technologies. The clear and predictable tax framework makes Switzerland an attractive jurisdiction for digital economy actors.'
    },
    sections: {
      'principe-imposition-crypto': {
        title: {
          fr: 'Principe d\'imposition des cryptomonnaies',
          de: 'Prinzip der Kryptowährungsbesteuerung',
          it: 'Principio di imposizione delle criptovalute',
          en: 'Principle of cryptocurrency taxation'
        },
        content: {
          fr: 'En Suisse, les cryptomonnaies sont considérées comme de la fortune mobilière au même titre que les actions ou obligations. Cette qualification entraîne des règles fiscales spécifiques selon que l\'activité est privée ou commerciale.',
          de: 'In der Schweiz werden Kryptowährungen als bewegliches Vermögen betrachtet, genau wie Aktien oder Obligationen. Diese Qualifikation führt zu spezifischen Steuerregeln, je nachdem, ob die Tätigkeit privat oder kommerziell ist.',
          it: 'In Svizzera, le criptovalute sono considerate patrimonio mobiliare al pari delle azioni o obbligazioni. Questa qualificazione comporta regole fiscali specifiche a seconda che l\'attività sia privata o commerciale.',
          en: 'In Switzerland, cryptocurrencies are considered movable property like stocks or bonds. This qualification leads to specific tax rules depending on whether the activity is private or commercial.'
        },
        keyPoints: {
          fr: 'Statut de fortune mobilière\nGains privés généralement exonérés\nCours officiels AFC pour évaluation\nDistinction crucial privé/commercial\nImposition selon activité réelle',
          de: 'Status bewegliches Vermögen\nPrivate Gewinne generell befreit\nOffizielle ESTV-Kurse für Bewertung\nUnterscheidung entscheidend privat/kommerziell\nBesteuerung nach tatsächlicher Tätigkeit',
          it: 'Statuto di patrimonio mobiliare\nGuadagni privati generalmente esenti\nCorsi ufficiali AFC per valutazione\nDistinzione cruciale privato/commerciale\nImposizione secondo attività reale',
          en: 'Movable property status\nPrivate gains generally exempt\nOfficial FTA rates for valuation\nCrucial private/commercial distinction\nTaxation according to actual activity'
        }
      },
      'gestion-privee': {
        title: {
          fr: 'Gestion de fortune privée',
          de: 'Private Vermögensverwaltung',
          it: 'Gestione patrimoniale privata',
          en: 'Private wealth management'
        },
        content: {
          fr: 'Pour les particuliers gérant leurs cryptomonnaies dans le cadre de leur fortune privée, l\'imposition suit les règles classiques : imposition sur la fortune au 31 décembre, exonération des gains en capital.',
          de: 'Für Privatpersonen, die ihre Kryptowährungen im Rahmen ihres Privatvermögens verwalten, folgt die Besteuerung den klassischen Regeln: Vermögenssteuer am 31. Dezember, Befreiung von Kapitalgewinnen.',
          it: 'Per i privati che gestiscono le loro criptovalute nel quadro del loro patrimonio privato, l\'imposizione segue le regole classiche: imposizione sul patrimonio al 31 dicembre, esenzione dei guadagni in conto capitale.',
          en: 'For individuals managing their cryptocurrencies within their private wealth, taxation follows classic rules: wealth tax on December 31, exemption from capital gains.'
        },
        keyPoints: {
          fr: 'Valeur au 31 décembre imposable\nPas d\'impôt sur gains de cours\nConservation longue durée favorisée\nDéclaration annuelle obligatoire\nBurden of proof sur le contribuable',
          de: 'Wert am 31. Dezember steuerpflichtig\nKeine Steuer auf Kursgewinne\nLangfristige Aufbewahrung bevorzugt\nJährliche Deklaration obligatorisch\nBeweislast beim Steuerpflichtigen',
          it: 'Valore al 31 dicembre imponibile\nNessuna imposta sui guadagni di corso\nConservazione lunga durata favorita\nDichiarazione annuale obbligatoria\nOnere della prova sul contribuente',
          en: 'December 31 value taxable\nNo tax on price gains\nLong-term holding favored\nAnnual declaration mandatory\nBurden of proof on taxpayer'
        }
      },
      'trading-professionnel': {
        title: {
          fr: 'Trading professionnel et commercial',
          de: 'Professioneller und kommerzieller Handel',
          it: 'Trading professionale e commerciale',
          en: 'Professional and commercial trading'
        },
        content: {
          fr: 'Le trading professionnel de cryptomonnaies entraîne une imposition complète des gains et pertes comme revenus d\'activité indépendante. Les critères de qualification sont similaires au trading traditionnel.',
          de: 'Der professionelle Handel mit Kryptowährungen führt zu einer vollständigen Besteuerung der Gewinne und Verluste als Einkommen aus selbständiger Erwerbstätigkeit. Die Qualifikationskriterien sind ähnlich dem traditionellen Handel.',
          it: 'Il trading professionale di criptovalute comporta un\'imposizione completa dei guadagni e perdite come redditi da attività indipendente. I criteri di qualificazione sono simili al trading tradizionale.',
          en: 'Professional cryptocurrency trading results in complete taxation of gains and losses as self-employed income. Qualification criteria are similar to traditional trading.'
        },
        keyPoints: {
          fr: 'Tous gains et pertes imposables\nStatut d\'indépendant requis\nComptabilité détaillée obligatoire\nCotisations sociales dues\nOptimisation via forme juridique',
          de: 'Alle Gewinne und Verluste steuerpflichtig\nSelbständigenstatus erforderlich\nDetaillierte Buchhaltung obligatorisch\nSozialversicherungsbeiträge fällig\nOptimierung über Rechtsform',
          it: 'Tutti guadagni e perdite imponibili\nStatuto di indipendente richiesto\nContabilità dettagliata obbligatoria\nContributi sociali dovuti\nOttimizzazione via forma giuridica',
          en: 'All gains and losses taxable\nSelf-employed status required\nDetailed accounting mandatory\nSocial contributions due\nOptimization via legal form'
        }
      },
      'mining-staking': {
        title: {
          fr: 'Mining et staking',
          de: 'Mining und Staking',
          it: 'Mining e staking',
          en: 'Mining and staking'
        },
        content: {
          fr: 'Les activités de mining et staking génèrent des revenus imposables au moment de la réception des cryptomonnaies, selon leur valeur de marché à cette date.',
          de: 'Mining- und Staking-Aktivitäten generieren steuerpflichtige Einkommen zum Zeitpunkt des Erhalts der Kryptowährungen, nach ihrem Marktwert zu diesem Datum.',
          it: 'Le attività di mining e staking generano redditi imponibili al momento della ricezione delle criptovalute, secondo il loro valore di mercato a quella data.',
          en: 'Mining and staking activities generate taxable income upon receipt of cryptocurrencies, according to their market value at that date.'
        },
        keyPoints: {
          fr: 'Revenus au moment de réception\nValeur de marché comme base\nCharges d\'exploitation déductibles\nActivité commerciale si significative\nComptabilisation précise requise',
          de: 'Einkommen zum Zeitpunkt des Erhalts\nMarktwert als Basis\nBetriebsausgaben abzugsfähig\nKommerzielle Tätigkeit wenn bedeutend\nGenaue Buchführung erforderlich',
          it: 'Redditi al momento della ricezione\nValore di mercato come base\nSpese di gestione detraibili\nAttività commerciale se significativa\nContabilizzazione precisa richiesta',
          en: 'Income upon receipt\nMarket value as basis\nOperating expenses deductible\nCommercial activity if significant\nPrecise accounting required'
        }
      }
    }
  },

  'optimisation-troisieme-pilier': {
    title: {
      fr: 'Optimisation du 3e pilier A',
      de: 'Optimierung der 3. Säule A',
      it: 'Ottimizzazione del 3° pilastro A',
      en: '3rd pillar A optimization'
    },
    description: {
      fr: 'Stratégies avancées pour maximiser les avantages fiscaux du 3e pilier : versements, retraits et planification',
      de: 'Erweiterte Strategien zur Maximierung der Steuervorteile der 3. Säule: Einzahlungen, Bezüge und Planung',
      it: 'Strategie avanzate per massimizzare i vantaggi fiscali del 3° pilastro: versamenti, prelievi e pianificazione',
      en: 'Advanced strategies to maximize 3rd pillar tax benefits: contributions, withdrawals and planning'
    },
    content: {
      fr: 'L\'optimisation du 3e pilier A représente l\'une des stratégies fiscales les plus efficaces en Suisse. Une planification rigoureuse des versements et retraits peut générer des économies substantielles tout en constituant un capital retraite optimal.',
      de: 'Die Optimierung der 3. Säule A stellt eine der effektivsten Steuerstrategien in der Schweiz dar. Eine rigorose Planung von Einzahlungen und Bezügen kann substantielle Ersparnisse generieren und gleichzeitig ein optimales Alterskapital aufbauen.',
      it: 'L\'ottimizzazione del 3° pilastro A rappresenta una delle strategie fiscali più efficaci in Svizzera. Una pianificazione rigorosa dei versamenti e prelievi può generare risparmi sostanziali costruendo un capitale pensionistico ottimale.',
      en: '3rd pillar A optimization represents one of the most effective tax strategies in Switzerland. Rigorous planning of contributions and withdrawals can generate substantial savings while building optimal retirement capital.'
    },
    sections: {
      'versements-optimaux': {
        title: {
          fr: 'Stratégies de versements optimaux',
          de: 'Strategien für optimale Einzahlungen',
          it: 'Strategie di versamenti ottimali',
          en: 'Optimal contribution strategies'
        },
        content: {
          fr: 'Le versement au 3e pilier A doit être effectué avant le 31 décembre pour être déductible dans l\'année fiscale. Cette règle stricte impose une planification précise, particulièrement pour optimiser les années à hauts revenus. L\'étalement des versements peut être stratégique : plutôt que de verser le maximum chaque année, concentrer les versements les années à taux marginal élevé maximise l\'économie fiscale.',
          de: 'Die Einzahlung in die 3. Säule A muss vor dem 31. Dezember erfolgen, um im Steuerjahr abzugsfähig zu sein. Diese strikte Regel erfordert eine präzise Planung, insbesondere zur Optimierung von Jahren mit hohem Einkommen. Die Staffelung der Einzahlungen kann strategisch sein: anstatt jedes Jahr das Maximum einzuzahlen, maximiert die Konzentration der Einzahlungen in Jahren mit hohem Grenzsteuersatz die Steuerersparnis.',
          it: 'Il versamento nel 3° pilastro A deve essere effettuato prima del 31 dicembre per essere deducibile nell\'anno fiscale. Questa regola rigorosa impone una pianificazione precisa, particolarmente per ottimizzare gli anni ad alto reddito. La dilazione dei versamenti può essere strategica: invece di versare il massimo ogni anno, concentrare i versamenti negli anni con aliquota marginale elevata massimizza il risparmio fiscale.',
          en: '3rd pillar A contributions must be made before December 31st to be deductible in the tax year. This strict rule requires precise planning, particularly to optimize high-income years. Staggering contributions can be strategic: rather than contributing the maximum each year, concentrating contributions in years with high marginal rates maximizes tax savings.'
        },
        keyPoints: {
          fr: 'Versement avant 31 décembre obligatoire • Concentration années hauts revenus optimal • Rachats lacunes rétroactifs possibles • Timing fin année crucial • Vision pluriannuelle nécessaire',
          de: 'Einzahlung vor 31. Dezember obligatorisch • Konzentration auf Jahre mit hohem Einkommen optimal • Rückzahlung von Lücken rückwirkend möglich • Timing Ende Jahr entscheidend • Mehrjährige Sicht notwendig',
          it: 'Versamento prima del 31 dicembre obbligatorio • Concentrazione anni alti redditi ottimale • Riscatti lacune retroattivi possibili • Timing fine anno cruciale • Visione pluriennale necessaria',
          en: 'Payment before December 31st mandatory • Concentration on high-income years optimal • Retroactive gap buybacks possible • Year-end timing crucial • Multi-year vision necessary'
        },
        example: {
          fr: 'Un cadre anticipant un bonus important en décembre peut verser 14\'000 CHF au 3e pilier (année courante + année suivante) pour optimiser ses déductions sur l\'année du bonus.',
          de: 'Eine Führungskraft, die einen wichtigen Bonus im Dezember erwartet, kann 14\'000 CHF in die 3. Säule einzahlen (laufendes Jahr + folgendes Jahr), um ihre Abzüge im Bonusjahr zu optimieren.',
          it: 'Un dirigente che anticipa un bonus importante a dicembre può versare 14\'000 CHF nel 3° pilastro (anno corrente + anno seguente) per ottimizzare le sue detrazioni nell\'anno del bonus.',
          en: 'An executive anticipating a significant December bonus can contribute 14,000 CHF to the 3rd pillar (current year + following year) to optimize deductions in the bonus year.'
        }
      },
      'retraits-echelonnes': {
        title: {
          fr: 'Optimisation des retraits échelonnés',
          de: 'Optimierung gestaffelter Bezüge',
          it: 'Ottimizzazione dei prelievi scaglionati',
          en: 'Optimization of staggered withdrawals'
        },
        content: {
          fr: 'Le retrait du 3e pilier A est imposé séparément des autres revenus, évitant l\'effet de la progressivité. L\'échelonnement des retraits sur plusieurs années peut réduire significativement la charge fiscale totale. Les retraits sont possibles 5 ans avant l\'âge AVS, permettant un étalement sur 6 années (60-65 ans). Chaque retrait partiel est imposé selon le barème de l\'imposition séparée, généralement plus avantageux.',
          de: 'Der Bezug der 3. Säule A wird separat von anderen Einkommen besteuert und vermeidet damit den Effekt der Progressivität. Die Staffelung der Bezüge über mehrere Jahre kann die Gesamtsteuerbelastung erheblich reduzieren. Bezüge sind 5 Jahre vor dem AHV-Alter möglich und ermöglichen eine Verteilung über 6 Jahre (60-65 Jahre). Jeder Teilbezug wird nach dem Tarif der separaten Besteuerung besteuert, der in der Regel vorteilhafter ist.',
          it: 'Il prelievo del 3° pilastro A è tassato separatamente dagli altri redditi, evitando l\'effetto della progressività. La scaglionatura dei prelievi su più anni può ridurre significativamente il carico fiscale totale. I prelievi sono possibili 5 anni prima dell\'età AVS, permettendo una dilazione su 6 anni (60-65 anni). Ogni prelievo parziale è tassato secondo la tariffa dell\'imposizione separata, generalmente più vantaggiosa.',
          en: '3rd pillar A withdrawals are taxed separately from other income, avoiding the effect of progressivity. Staggering withdrawals over several years can significantly reduce the total tax burden. Withdrawals are possible 5 years before AVS age, allowing distribution over 6 years (60-65 years). Each partial withdrawal is taxed according to the separate taxation schedule, generally more advantageous.'
        },
        keyPoints: {
          fr: 'Imposition séparée évite progressivité • Étalement possible 5 ans avant AVS • Coordination retraits entre conjoints • Canton domicile influence imposition • Barèmes séparés souvent avantageux',
          de: 'Separate Besteuerung vermeidet Progressivität • Staffelung 5 Jahre vor AHV möglich • Koordination der Bezüge zwischen Ehepartnern • Wohnsitzkanton beeinflusst Besteuerung • Separate Tarife oft vorteilhaft',
          it: 'Imposizione separata evita progressività • Scaglionamento possibile 5 anni prima AVS • Coordinazione prelievi tra coniugi • Cantone domicilio influenza imposizione • Tariffe separate spesso vantaggiose',
          en: 'Separate taxation avoids progressivity • Staggering possible 5 years before AVS • Coordination of withdrawals between spouses • Domicile canton influences taxation • Separate rates often advantageous'
        }
      },
      'retraits-anticipes': {
        title: {
          fr: 'Retraits anticipés stratégiques',
          de: 'Strategische vorzeitige Bezüge',
          it: 'Prelievi anticipati strategici',
          en: 'Strategic early withdrawals'
        },
        content: {
          fr: 'Le retrait anticipé pour l\'achat immobilier (résidence principale) peut être fiscalement intéressant si le bien est conservé long terme. L\'imposition au retrait peut être inférieure à l\'économie d\'intérêts hypothécaires. Le passage à l\'indépendance permet le retrait anticipé de l\'ensemble du 3e pilier. Cette possibilité peut être utilisée stratégiquement lors d\'une création d\'entreprise, même temporaire.',
          de: 'Der vorzeitige Bezug für den Immobilienkauf (Hauptwohnsitz) kann steuerlich interessant sein, wenn die Immobilie langfristig behalten wird. Die Besteuerung beim Bezug kann niedriger sein als die Zinsersparnis bei Hypotheken. Der Übergang zur Selbständigkeit ermöglicht den vorzeitigen Bezug der gesamten 3. Säule. Diese Möglichkeit kann strategisch bei einer Unternehmensgründung genutzt werden, auch vorübergehend.',
          it: 'Il prelievo anticipato per l\'acquisto immobiliare (residenza principale) può essere fiscalmente interessante se l\'immobile è conservato a lungo termine. L\'imposizione al prelievo può essere inferiore al risparmio di interessi ipotecari. Il passaggio all\'indipendenza permette il prelievo anticipato dell\'intero 3° pilastro. Questa possibilità può essere usata strategicamente durante una creazione d\'impresa, anche temporanea.',
          en: 'Early withdrawal for real estate purchase (main residence) can be fiscally interesting if the property is kept long-term. Taxation at withdrawal may be lower than mortgage interest savings. Transition to self-employment allows early withdrawal of the entire 3rd pillar. This possibility can be used strategically when starting a business, even temporarily.'
        },
        keyPoints: {
          fr: 'Achat immobilier : analyse coût/bénéfice • Indépendance permet retrait complet • Départ Suisse avec imposition réduite • Amortissement indirect maintient avantages • Planification stratégique nécessaire',
          de: 'Immobilienkauf: Kosten-Nutzen-Analyse • Selbständigkeit ermöglicht vollständigen Bezug • Wegzug Schweiz mit reduzierter Besteuerung • Indirekte Amortisation erhält Vorteile • Strategische Planung notwendig',
          it: 'Acquisto immobiliare: analisi costo/beneficio • Indipendenza permette prelievo completo • Partenza Svizzera con imposizione ridotta • Ammortamento indiretto mantiene vantaggi • Pianificazione strategica necessaria',
          en: 'Real estate purchase: cost/benefit analysis • Independence allows complete withdrawal • Departure from Switzerland with reduced taxation • Indirect amortization maintains advantages • Strategic planning necessary'
        }
      }
    }
  },

  'frontaliers-imposition': {
    title: {
      fr: 'Fiscalité des travailleurs frontaliers',
      de: 'Besteuerung der Grenzgänger',
      it: 'Fiscalità dei lavoratori frontalieri',
      en: 'Taxation of cross-border workers'
    },
    description: {
      fr: 'Règles d\'imposition des frontaliers selon les accords bilatéraux avec les pays voisins',
      de: 'Besteuerungsregeln für Grenzgänger nach bilateralen Abkommen mit Nachbarländern',
      it: 'Regole di imposizione dei frontalieri secondo gli accordi bilaterali con i paesi vicini',
      en: 'Taxation rules for cross-border workers according to bilateral agreements with neighboring countries'
    },
    content: {
      fr: 'La fiscalité des travailleurs frontaliers constitue un domaine complexe régi par des conventions internationales spécifiques. Ces accords visent à éviter la double imposition tout en préservant les droits fiscaux de chaque État.',
      de: 'Die Besteuerung von Grenzgängern ist ein komplexer Bereich, der durch spezifische internationale Abkommen geregelt wird. Diese Abkommen zielen darauf ab, eine Doppelbesteuerung zu vermeiden und gleichzeitig die Steuerrechte jedes Staates zu wahren.',
      it: 'La fiscalità dei lavoratori frontalieri costituisce un ambito complesso regolato da convenzioni internazionali specifiche. Questi accordi mirano a evitare la doppia imposizione preservando i diritti fiscali di ogni Stato.',
      en: 'Cross-border worker taxation constitutes a complex area governed by specific international conventions. These agreements aim to avoid double taxation while preserving each State\'s fiscal rights.'
    },
    sections: {
      'principe-frontaliers': {
        title: {
          fr: 'Principe d\'imposition des frontaliers',
          de: 'Besteuerungsprinzip für Grenzgänger',
          it: 'Principio di imposizione dei frontalieri',
          en: 'Cross-border worker taxation principle'
        },
        content: {
          fr: 'Les travailleurs frontaliers bénéficient d\'un régime fiscal spécial défini par les conventions de double imposition entre la Suisse et ses pays voisins. Le principe général veut que le salaire soit imposé dans le pays de travail, mais le frontalier conserve sa résidence fiscale dans son pays de domicile. Cette règle vise à éviter la double imposition tout en respectant la souveraineté fiscale de chaque État.',
          de: 'Grenzgänger profitieren von einem speziellen Steuerregime, das durch Doppelbesteuerungsabkommen zwischen der Schweiz und ihren Nachbarländern definiert wird. Das allgemeine Prinzip besagt, dass das Gehalt im Arbeitsland besteuert wird, der Grenzgänger aber seinen steuerlichen Wohnsitz in seinem Heimatland behält. Diese Regel zielt darauf ab, eine Doppelbesteuerung zu vermeiden und gleichzeitig die steuerliche Souveränität jedes Staates zu respektieren.',
          it: 'I lavoratori frontalieri beneficiano di un regime fiscale speciale definito dalle convenzioni di doppia imposizione tra la Svizzera e i suoi paesi vicini. Il principio generale prevede che il salario sia tassato nel paese di lavoro, ma il frontaliere conserva la sua residenza fiscale nel suo paese di domicilio. Questa regola mira a evitare la doppia imposizione rispettando la sovranità fiscale di ogni Stato.',
          en: 'Cross-border workers benefit from a special tax regime defined by double taxation conventions between Switzerland and its neighboring countries. The general principle states that salary is taxed in the work country, but the cross-border worker maintains their tax residence in their home country. This rule aims to avoid double taxation while respecting each State\'s fiscal sovereignty.'
        },
        keyPoints: {
          fr: 'Imposition dans le pays de travail (Suisse) • Résidence fiscale conservée dans pays de domicile • Accords spécifiques par pays voisin • Zone frontalière définie géographiquement • Impôt à la source en Suisse',
          de: 'Besteuerung im Arbeitsland (Schweiz) • Steuerlicher Wohnsitz im Heimatland beibehalten • Spezifische Abkommen je Nachbarland • Geografisch definierte Grenzzone • Quellensteuer in der Schweiz',
          it: 'Imposizione nel paese di lavoro (Svizzera) • Residenza fiscale conservata nel paese di domicilio • Accordi specifici per paese vicino • Zona frontaliera definita geograficamente • Imposta alla fonte in Svizzera',
          en: 'Taxation in work country (Switzerland) • Tax residence maintained in home country • Specific agreements per neighboring country • Geographically defined border zone • Withholding tax in Switzerland'
        }
      },
      'specificites-pays': {
        title: {
          fr: 'Spécificités par pays',
          de: 'Länderspecifische Besonderheiten',
          it: 'Specificità per paese',
          en: 'Country-specific features'
        },
        content: {
          fr: 'L\'accord franco-suisse prévoit l\'imposition en Suisse avec retenue à la source. La France reverse 4.5% de l\'impôt perçu aux départements frontaliers français. Les frontaliers français peuvent opter pour l\'imposition ordinaire en Suisse s\'ils y ont des revenus dépassant 120\'000 CHF. L\'accord avec l\'Allemagne suit le même principe mais sans rétrocession fiscale. Les frontaliers allemands déclarent leurs revenus suisses en Allemagne où ils sont exonérés, l\'impôt suisse étant définitif.',
          de: 'Das französisch-schweizerische Abkommen sieht eine Besteuerung in der Schweiz mit Quellensteuer vor. Frankreich überweist 4.5% der erhobenen Steuer an die französischen Grenzdepartements. Französische Grenzgänger können für die ordentliche Besteuerung in der Schweiz optieren, wenn sie dort Einkommen über 120\'000 CHF haben. Das Abkommen mit Deutschland folgt demselben Prinzip, aber ohne Steuerrückerstattung. Deutsche Grenzgänger erklären ihre schweizerischen Einkommen in Deutschland, wo sie befreit sind, da die schweizerische Steuer endgültig ist.',
          it: 'L\'accordo franco-svizzero prevede l\'imposizione in Svizzera con ritenuta alla fonte. La Francia riversa il 4.5% dell\'imposta percepita ai dipartimenti frontalieri francesi. I frontalieri francesi possono optare per l\'imposizione ordinaria in Svizzera se hanno redditi superiori a 120\'000 CHF. L\'accordo con la Germania segue lo stesso principio ma senza retrocessione fiscale. I frontalieri tedeschi dichiarano i loro redditi svizzeri in Germania dove sono esentati, essendo l\'imposta svizzera definitiva.',
          en: 'The Franco-Swiss agreement provides for taxation in Switzerland with withholding tax. France transfers 4.5% of collected tax to French border departments. French cross-border workers can opt for ordinary taxation in Switzerland if they have income exceeding 120,000 CHF. The agreement with Germany follows the same principle but without tax retrocession. German cross-border workers declare their Swiss income in Germany where they are exempted, with Swiss tax being final.'
        },
        keyPoints: {
          fr: 'France : rétrocession 4.5% aux départements • Allemagne : exonération sans rétrocession • Déclaration dans pays de résidence • Retour régulier au domicile obligatoire • Dérogations limitées pour voyages',
          de: 'Frankreich: 4.5% Rückerstattung an Departements • Deutschland: Befreiung ohne Rückerstattung • Erklärung im Wohnsitzland • Regelmäßige Rückkehr zum Wohnsitz obligatorisch • Begrenzte Ausnahmen für Reisen',
          it: 'Francia: retrocessione 4.5% ai dipartimenti • Germania: esenzione senza retrocessione • Dichiarazione nel paese di residenza • Ritorno regolare al domicilio obbligatorio • Deroghe limitate per viaggi',
          en: 'France: 4.5% retrocession to departments • Germany: exemption without retrocession • Declaration in country of residence • Regular return home mandatory • Limited exceptions for travel'
        }
      }
    }
  },

  'declaration-impots-delais': {
    title: {
      fr: 'Déclaration d\'impôts : délais et procédures',
      de: 'Steuererklärung: Fristen und Verfahren',
      it: 'Dichiarazione delle tasse: scadenze e procedure',
      en: 'Tax declaration: deadlines and procedures'
    },
    description: {
      fr: 'Guide pratique pour remplir sa déclaration fiscale : délais, documents requis et procédures',
      de: 'Praktischer Leitfaden zum Ausfüllen der Steuererklärung: Fristen, erforderliche Dokumente und Verfahren',
      it: 'Guida pratica per compilare la dichiarazione fiscale: scadenze, documenti richiesti e procedure',
      en: 'Practical guide to filing your tax return: deadlines, required documents and procedures'
    },
    content: {
      fr: 'La déclaration d\'impôts constitue l\'obligation fiscale principale de tout contribuable en Suisse. Maîtriser les délais, procédures et documents requis permet d\'éviter les sanctions et d\'optimiser sa situation fiscale.',
      de: 'Die Steuererklärung stellt die wichtigste steuerliche Verpflichtung jedes Steuerpflichtigen in der Schweiz dar. Die Beherrschung der Fristen, Verfahren und erforderlichen Dokumente ermöglicht es, Sanktionen zu vermeiden und die Steuersituation zu optimieren.',
      it: 'La dichiarazione delle tasse costituisce l\'obbligo fiscale principale di ogni contribuente in Svizzera. Padroneggiare le scadenze, procedure e documenti richiesti permette di evitare sanzioni e ottimizzare la propria situazione fiscale.',
      en: 'Tax declaration constitutes the main fiscal obligation of every taxpayer in Switzerland. Mastering deadlines, procedures and required documents allows avoiding sanctions and optimizing one\'s tax situation.'
    },
    sections: {
      'delais-legaux': {
        title: {
          fr: 'Délais légaux et prolongations',
          de: 'Gesetzliche Fristen und Verlängerungen',
          it: 'Scadenze legali e proroghe',
          en: 'Legal deadlines and extensions'
        },
        content: {
          fr: 'Les délais de dépôt de la déclaration d\'impôt varient selon les cantons, généralement entre le 31 mars et le 31 mai pour les personnes physiques. Ces délais sont impératifs et leur non-respect entraîne des sanctions : amendes, estimations d\'office et intérêts moratoires. La prolongation automatique jusqu\'au 30 septembre est accordée dans la plupart des cantons si la demande est formulée avant l\'échéance normale.',
          de: 'Die Einreichungsfristen für die Steuererklärung variieren je nach Kanton, in der Regel zwischen dem 31. März und 31. Mai für natürliche Personen. Diese Fristen sind zwingend und ihre Nichteinhaltung führt zu Sanktionen: Bußgelder, amtliche Schätzungen und Verzugszinsen. Die automatische Verlängerung bis zum 30. September wird in den meisten Kantonen gewährt, wenn der Antrag vor dem normalen Fälligkeitstermin gestellt wird.',
          it: 'Le scadenze per la presentazione della dichiarazione delle tasse variano secondo i cantoni, generalmente tra il 31 marzo e il 31 maggio per le persone fisiche. Queste scadenze sono imperative e il loro mancato rispetto comporta sanzioni: multe, stime d\'ufficio e interessi moratori. La proroga automatica fino al 30 settembre è accordata nella maggior parte dei cantoni se la richiesta è formulata prima della scadenza normale.',
          en: 'Tax return filing deadlines vary by canton, generally between March 31st and May 31st for individuals. These deadlines are mandatory and failure to comply results in sanctions: fines, official estimates and default interest. Automatic extension until September 30th is granted in most cantons if the request is made before the normal deadline.'
        },
        keyPoints: {
          fr: 'Délais cantonaux : 31 mars à 31 mai • Prolongation automatique au 30 septembre • Sanctions en cas de retard • Délais étendus pour cas complexes • Avantages du dépôt électronique',
          de: 'Kantonale Fristen: 31. März bis 31. Mai • Automatische Verlängerung bis 30. September • Sanktionen bei Verspätung • Erweiterte Fristen für komplexe Fälle • Vorteile der elektronischen Einreichung',
          it: 'Scadenze cantonali: 31 marzo al 31 maggio • Proroga automatica al 30 settembre • Sanzioni in caso di ritardo • Scadenze estese per casi complessi • Vantaggi del deposito elettronico',
          en: 'Cantonal deadlines: March 31st to May 31st • Automatic extension to September 30th • Sanctions for delays • Extended deadlines for complex cases • Electronic filing advantages'
        }
      },
      'documents-necessaires': {
        title: {
          fr: 'Documents nécessaires',
          de: 'Erforderliche Dokumente',
          it: 'Documenti necessari',
          en: 'Required documents'
        },
        content: {
          fr: 'La liste des documents varie selon la situation, mais certains sont systématiquement requis. Pour les salariés : certificats de salaire, attestations de cotisations 3e pilier, relevés bancaires et de titres au 31 décembre. Les propriétaires doivent joindre les décomptes de charges, factures de travaux déductibles, attestations d\'assurances et éventuellement les contrats de location si le bien est loué.',
          de: 'Die Liste der Dokumente variiert je nach Situation, aber einige sind systematisch erforderlich. Für Angestellte: Lohnausweise, Bescheinigungen über 3. Säule-Beiträge, Bank- und Wertpapierauszüge zum 31. Dezember. Eigentümer müssen Nebenkostenabrechnungen, Rechnungen für abzugsfähige Arbeiten, Versicherungsbescheinigungen und gegebenenfalls Mietverträge beifügen, falls die Immobilie vermietet ist.',
          it: 'L\'elenco dei documenti varia secondo la situazione, ma alcuni sono sistematicamente richiesti. Per i dipendenti: certificati di salario, attestazioni di contributi 3° pilastro, estratti bancari e titoli al 31 dicembre. I proprietari devono allegare i conti delle spese, fatture di lavori detraibili, attestazioni di assicurazioni ed eventualmente i contratti di locazione se l\'immobile è affittato.',
          en: 'The list of documents varies according to situation, but some are systematically required. For employees: salary certificates, 3rd pillar contribution attestations, bank and securities statements as of December 31st. Property owners must attach expense statements, deductible work invoices, insurance attestations and possibly rental contracts if the property is rented.'
        },
        keyPoints: {
          fr: 'Certificats salaire et cotisations obligatoires • Décomptes charges pour propriétaires • Comptes annuels pour indépendants • Attestations étrangères traduites • Relevés bancaires au 31 décembre',
          de: 'Lohnausweise und Beitragsbescheinigungen obligatorisch • Nebenkostenabrechnungen für Eigentümer • Jahresabschlüsse für Selbständige • Übersetzte ausländische Bescheinigungen • Bankauszüge zum 31. Dezember',
          it: 'Certificati salario e contributi obbligatori • Conti spese per proprietari • Conti annuali per indipendenti • Attestazioni estere tradotte • Estratti bancari al 31 dicembre',
          en: 'Salary certificates and mandatory contributions • Expense statements for owners • Annual accounts for self-employed • Translated foreign attestations • Bank statements as of December 31st'
        },
        example: {
          fr: 'Un salarié propriétaire doit joindre : certificat de salaire, attestation 3e pilier, décompte charges immeuble, factures entretien déductible et relevé bancaire de clôture.',
          de: 'Ein angestellter Eigentümer muss beifügen: Lohnausweis, 3. Säule-Bescheinigung, Gebäudenebenkosten-abrechnung, Rechnungen für abzugsfähige Instandhaltung und Bankabschlussauszug.',
          it: 'Un dipendente proprietario deve allegare: certificato di salario, attestazione 3° pilastro, conto spese immobile, fatture manutenzione detraibile ed estratto bancario di chiusura.',
          en: 'An employed property owner must attach: salary certificate, 3rd pillar attestation, building expense statement, deductible maintenance invoices and bank closing statement.'
        }
      }
    }
  },

  'optimisation-fiscale-legale': {
    title: {
      fr: 'Stratégies d\'optimisation fiscale légale',
      de: 'Strategien der legalen Steueroptimierung',
      it: 'Strategie di ottimizzazione fiscale legale',
      en: 'Legal tax optimization strategies'
    },
    description: {
      fr: 'Techniques légales pour réduire sa charge fiscale : timing, structuration et planification',
      de: 'Legale Techniken zur Reduzierung der Steuerlast: Timing, Strukturierung und Planung',
      it: 'Tecniche legali per ridurre il carico fiscale: tempistiche, strutturazione e pianificazione',
      en: 'Legal techniques to reduce tax burden: timing, structuring and planning'
    },
    content: {
      fr: 'L\'optimisation fiscale légale constitue un domaine complexe mais essentiel de la planification financière. Elle permet de réduire légalement sa charge fiscale grâce à une structuration appropriée et un timing optimal des opérations.',
      de: 'Die legale Steueroptimierung ist ein komplexer, aber wesentlicher Bereich der Finanzplanung. Sie ermöglicht es, die Steuerlast durch angemessene Strukturierung und optimales Timing der Operationen legal zu reduzieren.',
      it: 'L\'ottimizzazione fiscale legale costituisce un ambito complesso ma essenziale della pianificazione finanziaria. Permette di ridurre legalmente il carico fiscale grazie a una strutturazione appropriata e tempistiche ottimali delle operazioni.',
      en: 'Legal tax optimization constitutes a complex but essential area of financial planning. It allows legally reducing tax burden through appropriate structuring and optimal timing of operations.'
    },
    sections: {
      'principe-optimisation': {
        title: {
          fr: 'Principes de l\'optimisation fiscale',
          de: 'Grundsätze der Steueroptimierung',
          it: 'Principi dell\'ottimizzazione fiscale',
          en: 'Tax optimization principles'
        },
        content: {
          fr: 'L\'optimisation fiscale légale consiste à structurer ses affaires de manière à minimiser la charge fiscale dans le respect de la loi. Elle se distingue de l\'évasion fiscale (illégale) et de la fraude fiscale (pénalement sanctionnée). Le principe fondamental est que le contribuable peut choisir la voie la moins imposée, pourvu qu\'elle soit légale et conforme à la substance économique de l\'opération.',
          de: 'Die legale Steueroptimierung besteht darin, seine Geschäfte so zu strukturieren, dass die Steuerlast unter Einhaltung des Gesetzes minimiert wird. Sie unterscheidet sich von der Steuerhinterziehung (illegal) und dem Steuerbetrug (strafrechtlich sanktioniert). Das Grundprinzip ist, dass der Steuerpflichtige den am wenigsten besteuerten Weg wählen kann, vorausgesetzt er ist legal und entspricht der wirtschaftlichen Substanz der Operation.',
          it: 'L\'ottimizzazione fiscale legale consiste nel strutturare i propri affari in modo da minimizzare il carico fiscale nel rispetto della legge. Si distingue dall\'evasione fiscale (illegale) e dalla frode fiscale (penalmente sanzionata). Il principio fondamentale è che il contribuente può scegliere la via meno tassata, purché sia legale e conforme alla sostanza economica dell\'operazione.',
          en: 'Legal tax optimization consists of structuring one\'s affairs to minimize tax burden while respecting the law. It differs from tax evasion (illegal) and tax fraud (criminally sanctioned). The fundamental principle is that the taxpayer can choose the least taxed path, provided it is legal and conforms to the economic substance of the operation.'
        },
        keyPoints: {
          fr: 'Optimisation légale vs évasion illégale • Choix de la voie la moins imposée • Timing, forme, localisation, structuration • Limites : abus de droit fiscal • Substance économique requise',
          de: 'Legale Optimierung vs illegale Hinterziehung • Wahl des am wenigsten besteuerten Weges • Timing, Form, Standort, Strukturierung • Grenzen: Steuerrechtsmissbrauch • Wirtschaftliche Substanz erforderlich',
          it: 'Ottimizzazione legale vs evasione illegale • Scelta della via meno tassata • Tempistiche, forma, localizzazione, strutturazione • Limiti: abuso del diritto fiscale • Sostanza economica richiesta',
          en: 'Legal optimization vs illegal evasion • Choice of least taxed path • Timing, form, location, structuring • Limits: tax law abuse • Economic substance required'
        }
      },
      'techniques-courantes': {
        title: {
          fr: 'Techniques d\'optimisation courantes',
          de: 'Gängige Optimierungstechniken',
          it: 'Tecniche di ottimizzazione comuni',
          en: 'Common optimization techniques'
        },
        content: {
          fr: 'Le versement anticipé au 3e pilier permet de déduire jusqu\'à 7\'056 CHF du revenu imposable tout en constituant un capital pour la retraite. Le timing du versement (avant le 31 décembre) et les retraits échelonnés optimisent l\'avantage fiscal. La répartition revenus/fortune entre conjoints permet d\'exploiter la progressivité de l\'impôt. Les revenus de capitaux peuvent être attribués au conjoint moins imposé par des donations entre époux.',
          de: 'Die vorzeitige Einzahlung in die 3. Säule ermöglicht es, bis zu 7\'056 CHF vom steuerbaren Einkommen abzuziehen und gleichzeitig Kapital für die Rente aufzubauen. Das Timing der Einzahlung (vor dem 31. Dezember) und gestaffelte Bezüge optimieren den Steuervorteil. Die Aufteilung von Einkommen/Vermögen zwischen Ehepartnern ermöglicht es, die Progressivität der Steuer zu nutzen. Kapitaleinkommen können durch Schenkungen zwischen Ehepartnern dem weniger besteuerten Partner zugeordnet werden.',
          it: 'Il versamento anticipato nel 3° pilastro permette di dedurre fino a 7\'056 CHF dal reddito imponibile costruendo un capitale per la pensione. Le tempistiche del versamento (prima del 31 dicembre) e i prelievi scaglionati ottimizzano il vantaggio fiscale. La ripartizione redditi/patrimonio tra coniugi permette di sfruttare la progressività dell\'imposta. I redditi di capitale possono essere attribuiti al coniuge meno tassato tramite donazioni tra sposi.',
          en: 'Early 3rd pillar contributions allow deducting up to 7,056 CHF from taxable income while building retirement capital. Contribution timing (before December 31st) and staggered withdrawals optimize tax benefits. Income/wealth distribution between spouses allows exploiting tax progressivity. Capital income can be attributed to the less taxed spouse through inter-spousal donations.'
        },
        keyPoints: {
          fr: '3e pilier : 7\'056 CHF déductibles • Répartition optimale entre conjoints • Étalement des revenus extraordinaires • Choix stratégique du domicile fiscal • Timing des opérations important',
          de: '3. Säule: 7\'056 CHF abzugsfähig • Optimale Aufteilung zwischen Ehepartnern • Verteilung außerordentlicher Einkommen • Strategische Wahl des Steuerdomizils • Timing der Operationen wichtig',
          it: '3° pilastro: 7\'056 CHF deducibili • Ripartizione ottimale tra coniugi • Dilazione redditi straordinari • Scelta strategica del domicilio fiscale • Tempistiche delle operazioni importanti',
          en: '3rd pillar: 7,056 CHF deductible • Optimal distribution between spouses • Spreading extraordinary income • Strategic choice of tax domicile • Operation timing important'
        }
      }
    }
  },

  'comparatif-fiscal-cantonal': {
    title: {
      fr: 'Comparatif fiscal intercantonal',
      de: 'Interkantonaler Steuervergleich',
      it: 'Confronto fiscale intercantonale',
      en: 'Intercantonal tax comparison'
    },
    description: {
      fr: 'Analyse des différences de charge fiscale entre cantons suisses et implications pour les contribuables',
      de: 'Analyse der Unterschiede in der Steuerlast zwischen Schweizer Kantonen und Auswirkungen für Steuerpflichtige',
      it: 'Analisi delle differenze di carico fiscale tra cantoni svizzeri e implicazioni per i contribuenti',
      en: 'Analysis of tax burden differences between Swiss cantons and implications for taxpayers'
    },
    content: {
      fr: 'Le comparatif fiscal intercantonal révèle des différences substantielles de charge fiscale en Suisse. Ces écarts, pouvant atteindre 40-50% pour les hauts revenus, influencent significativement les décisions de domiciliation des particuliers et entreprises.',
      de: 'Der interkantonale Steuervergleich zeigt erhebliche Unterschiede in der Steuerlast in der Schweiz. Diese Unterschiede, die für hohe Einkommen 40-50% erreichen können, beeinflussen die Wohnsitzentscheidungen von Privatpersonen und Unternehmen erheblich.',
      it: 'Il confronto fiscale intercantonale rivela differenze sostanziali di carico fiscale in Svizzera. Questi scarti, che possono raggiungere il 40-50% per gli alti redditi, influenzano significativamente le decisioni di domiciliazione di privati e imprese.',
      en: 'Intercantonal tax comparison reveals substantial tax burden differences in Switzerland. These gaps, which can reach 40-50% for high incomes, significantly influence domiciliation decisions of individuals and businesses.'
    },
    sections: {
      'methodologie-comparaison': {
        title: {
          fr: 'Méthodologie de comparaison',
          de: 'Vergleichsmethodik',
          it: 'Metodologia di confronto',
          en: 'Comparison methodology'
        },
        content: {
          fr: 'La comparaison fiscale entre cantons nécessite une méthodologie rigoureuse car les systèmes varient substantiellement. Il faut considérer l\'impôt cantonal, l\'impôt communal (qui varie aussi selon les communes), les déductions autorisées et les barèmes appliqués. L\'Administration fédérale des contributions publie annuellement des statistiques comparatives basées sur des profils types : célibataire, couple sans enfant, couple avec enfants, pour différents niveaux de revenus.',
          de: 'Der Steuervergleich zwischen Kantonen erfordert eine rigorose Methodik, da die Systeme erheblich variieren. Man muss die Kantonssteuer, die Gemeindesteuer (die auch je nach Gemeinde variiert), die zugelassenen Abzüge und die angewandten Tarife berücksichtigen. Die Eidgenössische Steuerverwaltung veröffentlicht jährlich Vergleichsstatistiken basierend auf Typprofilen: Alleinstehende, Paare ohne Kinder, Paare mit Kindern, für verschiedene Einkommensniveaus.',
          it: 'Il confronto fiscale tra cantoni richiede una metodologia rigorosa poiché i sistemi variano sostanzialmente. Bisogna considerare l\'imposta cantonale, l\'imposta comunale (che varia anche secondo i comuni), le detrazioni autorizzate e le tariffe applicate. L\'Amministrazione federale delle contribuzioni pubblica annualmente statistiche comparative basate su profili tipo: celibe, coppia senza figli, coppia con figli, per diversi livelli di reddito.',
          en: 'Tax comparison between cantons requires rigorous methodology as systems vary substantially. One must consider cantonal tax, municipal tax (which also varies by municipality), authorized deductions and applied scales. The Federal Tax Administration publishes annual comparative statistics based on typical profiles: single, couple without children, couple with children, for different income levels.'
        },
        keyPoints: {
          fr: 'Méthodologie rigoureuse nécessaire • Statistiques AFC avec profils types • Variables : coefficient, déductions, barèmes • Considérer coûts vie et services publics • Vue globale au-delà des seuls impôts',
          de: 'Rigorose Methodik notwendig • EStV-Statistiken mit Typprofilen • Variablen: Koeffizient, Abzüge, Tarife • Lebenshaltungskosten und öffentliche Dienste berücksichtigen • Gesamtsicht über Steuern hinaus',
          it: 'Metodologia rigorosa necessaria • Statistiche AFC con profili tipo • Variabili: coefficiente, detrazioni, tariffe • Considerare costi vita e servizi pubblici • Vista globale oltre le sole imposte',
          en: 'Rigorous methodology necessary • FTA statistics with typical profiles • Variables: coefficient, deductions, scales • Consider living costs and public services • Overall view beyond taxes alone'
        }
      },
      'cantons-competitifs': {
        title: {
          fr: 'Cantons fiscalement compétitifs',
          de: 'Steuerlich wettbewerbsfähige Kantone',
          it: 'Cantoni fiscalmente competitivi',
          en: 'Fiscally competitive cantons'
        },
        content: {
          fr: 'Zoug reste traditionnellement le canton le plus attractif fiscalement, avec des taux très compétitifs sur le revenu et l\'absence d\'impôt sur la fortune pour les montants modestes. Cette attractivité a attiré de nombreuses entreprises et contribuables aisés. Les cantons d\'Appenzell Rhodes-Intérieures, Nidwald et Obwald offrent aussi des charges fiscales réduites, particulièrement pour les hauts revenus.',
          de: 'Zug bleibt traditionell der steuerlich attraktivste Kanton mit sehr wettbewerbsfähigen Sätzen auf das Einkommen und dem Fehlen einer Vermögenssteuer für bescheidene Beträge. Diese Attraktivität hat viele Unternehmen und wohlhabende Steuerpflichtige angezogen. Die Kantone Appenzell Innerrhoden, Nidwalden und Obwalden bieten ebenfalls reduzierte Steuerlasten, insbesondere für hohe Einkommen.',
          it: 'Zugo rimane tradizionalmente il cantone più attrattivo fiscalmente, con aliquote molto competitive sul reddito e l\'assenza di imposta sul patrimonio per gli importi modesti. Questa attrattività ha attirato numerose imprese e contribuenti facoltosi. I cantoni di Appenzello Interno, Nidvaldo e Obvaldo offrono anche carichi fiscali ridotti, particolarmente per gli alti redditi.',
          en: 'Zug remains traditionally the most fiscally attractive canton, with very competitive rates on income and the absence of wealth tax for modest amounts. This attractiveness has attracted many businesses and wealthy taxpayers. The cantons of Appenzell Inner Rhodes, Nidwalden and Obwalden also offer reduced tax burdens, particularly for high incomes.'
        },
        keyPoints: {
          fr: 'Zoug : référence en compétitivité fiscale • Cantons ruraux : plafonnement progressivité • Bâle-Ville : équilibre impôts/services • Cantons montagne : conditions spéciales • Attractivité pour entreprises et particuliers',
          de: 'Zug: Referenz für steuerliche Wettbewerbsfähigkeit • Ländliche Kantone: Progressivitätsbegrenzung • Basel-Stadt: Gleichgewicht Steuern/Dienstleistungen • Bergkantone: Sonderbedingungen • Attraktivität für Unternehmen und Privatpersonen',
          it: 'Zugo: riferimento in competitività fiscale • Cantoni rurali: contenimento progressività • Basilea Città: equilibrio imposte/servizi • Cantoni montagna: condizioni speciali • Attrattività per imprese e privati',
          en: 'Zug: reference in fiscal competitiveness • Rural cantons: progressivity capping • Basel City: tax/service balance • Mountain cantons: special conditions • Attractiveness for businesses and individuals'
        },
        example: {
          fr: 'Un couple avec 150\'000 CHF de revenu paie environ 12\'000 CHF d\'impôts à Zoug contre 25\'000 CHF à Genève, soit une différence de 13\'000 CHF annuels.',
          de: 'Ein Paar mit 150\'000 CHF Einkommen zahlt etwa 12\'000 CHF Steuern in Zug gegenüber 25\'000 CHF in Genf, ein Unterschied von 13\'000 CHF jährlich.',
          it: 'Una coppia con 150\'000 CHF di reddito paga circa 12\'000 CHF di imposte a Zugo contro 25\'000 CHF a Ginevra, ossia una differenza di 13\'000 CHF annui.',
          en: 'A couple with 150,000 CHF income pays about 12,000 CHF taxes in Zug versus 25,000 CHF in Geneva, a difference of 13,000 CHF annually.'
        }
      }
    }
  },

  'titres-valeurs-mobilieres': {
    title: {
      fr: 'Fiscalité des titres et valeurs mobilières',
      de: 'Besteuerung von Wertpapieren und Wertschriften',
      it: 'Fiscalità di titoli e valori mobiliari',
      en: 'Taxation of securities and movable assets'
    },
    description: {
      fr: 'Comprendre l\'imposition des actions, obligations et fonds de placement pour les particuliers',
      de: 'Die Besteuerung von Aktien, Obligationen und Anlagefonds für Privatpersonen verstehen',
      it: 'Comprendere l\'imposizione di azioni, obbligazioni e fondi di investimento per i privati',
      en: 'Understanding taxation of stocks, bonds and investment funds for individuals'
    },
    content: {
      fr: 'La fiscalité des titres et valeurs mobilières constitue un domaine complexe de la fiscalité suisse. La distinction entre gestion de fortune privée et activité commerciale détermine le traitement fiscal des plus-values et revenus.',
      de: 'Die Besteuerung von Wertpapieren und Wertschriften ist ein komplexer Bereich des schweizerischen Steuerrechts. Die Unterscheidung zwischen privater Vermögensverwaltung und gewerblicher Tätigkeit bestimmt die steuerliche Behandlung von Kapitalgewinnen und Erträgen.',
      it: 'La fiscalità dei titoli e valori mobiliari costituisce un ambito complesso della fiscalità svizzera. La distinzione tra gestione patrimoniale privata e attività commerciale determina il trattamento fiscale delle plusvalenze e dei redditi.',
      en: 'Taxation of securities and movable assets constitutes a complex area of Swiss taxation. The distinction between private wealth management and commercial activity determines the tax treatment of capital gains and income.'
    },
    sections: {
      'types-titres': {
        title: {
          fr: 'Types de titres et classification fiscale',
          de: 'Wertpapierarten und steuerliche Klassifizierung',
          it: 'Tipi di titoli e classificazione fiscale',
          en: 'Types of securities and tax classification'
        },
        content: {
          fr: 'En Suisse, les titres et valeurs mobilières sont considérés comme de la fortune mobilière pour les particuliers. Cette classification détermine leur traitement fiscal. Les principaux types comprennent les actions cotées et non cotées, obligations, parts de fonds de placement (OPCVM), produits structurés et dérivés, ETF et certificats de participation.',
          de: 'In der Schweiz gelten Wertpapiere und Wertschriften für Privatpersonen als bewegliches Vermögen. Diese Klassifizierung bestimmt ihre steuerliche Behandlung. Die wichtigsten Arten umfassen kotierte und nicht kotierte Aktien, Obligationen, Anteile an Anlagefonds (OGAW), strukturierte Produkte und Derivate, ETFs und Partizipationsscheine.',
          it: 'In Svizzera, i titoli e valori mobiliari sono considerati patrimonio mobiliare per i privati. Questa classificazione determina il loro trattamento fiscale. I tipi principali comprendono azioni quotate e non quotate, obbligazioni, quote di fondi di investimento (OICVM), prodotti strutturati e derivati, ETF e certificati di partecipazione.',
          en: 'In Switzerland, securities and movable assets are considered movable property for individuals. This classification determines their tax treatment. Main types include listed and unlisted shares, bonds, investment fund units (UCITS), structured products and derivatives, ETFs and participation certificates.'
        },
        keyPoints: {
          fr: 'Titres considérés comme fortune mobilière chez particuliers • Plus-value privée généralement non imposable • Dividendes et intérêts imposables comme revenus • Limite entre gestion privée et commerciale déterminante',
          de: 'Wertpapiere gelten als bewegliches Vermögen bei Privatpersonen • Private Kapitalgewinne grundsätzlich nicht steuerbar • Dividenden und Zinsen steuerbar als Einkommen • Grenze zwischen privater und gewerblicher Verwaltung entscheidend',
          it: 'Titoli considerati patrimonio mobiliare per privati • Plusvalenza privata generalmente non imponibile • Dividendi e interessi imponibili come redditi • Limite tra gestione privata e commerciale determinante',
          en: 'Securities considered movable property for individuals • Private capital gains generally not taxable • Dividends and interest taxable as income • Boundary between private and commercial management decisive'
        },
        example: {
          fr: 'Un salarié qui détient 100 actions Nestlé : les dividendes reçus sont imposables comme revenus, mais la plus-value de vente n\'est pas imposable (gestion de fortune privée).',
          de: 'Ein Angestellter, der 100 Nestlé-Aktien besitzt: die erhaltenen Dividenden sind als Einkommen steuerbar, aber der Verkaufsgewinn ist nicht steuerbar (private Vermögensverwaltung).',
          it: 'Un dipendente che detiene 100 azioni Nestlé: i dividendi ricevuti sono imponibili come redditi, ma la plusvalenza di vendita non è imponibile (gestione patrimoniale privata).',
          en: 'An employee holding 100 Nestlé shares: dividends received are taxable as income, but the sale gain is not taxable (private wealth management).'
        }
      },
      'revenus-titres': {
        title: {
          fr: 'Imposition des revenus de titres',
          de: 'Besteuerung von Wertpapiererträgen',
          it: 'Imposizione dei redditi di titoli',
          en: 'Taxation of securities income'
        },
        content: {
          fr: 'Les revenus générés par les titres sont imposables selon leur nature. Les dividendes d\'actions suisses sont imposables à 100% comme revenus avec un impôt anticipé de 35% prélevé à la source, remboursable pour résidents suisses. Les dividendes d\'actions étrangères sont imposables selon conventions de double imposition. Les intérêts d\'obligations sont imposables à 100% comme revenus avec impôt anticipé de 35% sur obligations suisses.',
          de: 'Die von Wertpapieren generierten Erträge sind je nach Art steuerbar. Dividenden schweizerischer Aktien sind zu 100% als Einkommen steuerbar mit einer Verrechnungssteuer von 35% an der Quelle, rückerstattbar für schweizerische Einwohner. Dividenden ausländischer Aktien sind gemäß Doppelbesteuerungsabkommen steuerbar. Obligationszinsen sind zu 100% als Einkommen steuerbar mit Verrechnungssteuer von 35% auf schweizerische Obligationen.',
          it: 'I redditi generati dai titoli sono imponibili secondo la loro natura. I dividendi di azioni svizzere sono imponibili al 100% come redditi con un\'imposta preventiva del 35% prelevata alla fonte, rimborsabile per residenti svizzeri. I dividendi di azioni estere sono imponibili secondo convenzioni di doppia imposizione. Gli interessi di obbligazioni sono imponibili al 100% come redditi con imposta preventiva del 35% su obbligazioni svizzere.',
          en: 'Income generated by securities is taxable according to their nature. Dividends from Swiss shares are 100% taxable as income with a 35% withholding tax levied at source, refundable for Swiss residents. Dividends from foreign shares are taxable according to double taxation conventions. Bond interest is 100% taxable as income with 35% withholding tax on Swiss bonds.'
        },
        keyPoints: {
          fr: 'Tous revenus de titres imposables (dividendes, intérêts) • Impôt anticipé 35% sur titres suisses (remboursable) • Conventions double imposition pour titres étrangers • Calcul prorata temporis pour détentions partielles',
          de: 'Alle Wertpapiererträge steuerbar (Dividenden, Zinsen) • Verrechnungssteuer 35% auf schweizerische Wertpapiere (rückerstattbar) • Doppelbesteuerungsabkommen für ausländische Wertpapiere • Prorata-temporis-Berechnung für Teilbesitz',
          it: 'Tutti redditi di titoli imponibili (dividendi, interessi) • Imposta preventiva 35% su titoli svizzeri (rimborsabile) • Convenzioni doppia imposizione per titoli esteri • Calcolo prorata temporis per detenzioni parziali',
          en: 'All securities income taxable (dividends, interest) • 35% withholding tax on Swiss securities (refundable) • Double taxation conventions for foreign securities • Prorata temporis calculation for partial holdings'
        },
        example: {
          fr: '1000 CHF de dividendes reçus : 350 CHF d\'impôt anticipé prélevé, 1000 CHF déclarés comme revenus, 350 CHF remboursés via déclaration d\'impôts.',
          de: '1000 CHF erhaltene Dividenden: 350 CHF Verrechnungssteuer abgezogen, 1000 CHF als Einkommen deklariert, 350 CHF über Steuererklärung rückerstattet.',
          it: '1000 CHF di dividendi ricevuti: 350 CHF di imposta preventiva prelevata, 1000 CHF dichiarati come redditi, 350 CHF rimborsati tramite dichiarazione delle tasse.',
          en: '1000 CHF dividends received: 350 CHF withholding tax deducted, 1000 CHF declared as income, 350 CHF refunded via tax return.'
        }
      },
      'plus-values': {
        title: {
          fr: 'Traitement des plus-values et moins-values',
          de: 'Behandlung von Kapitalgewinnen und -verlusten',
          it: 'Trattamento di plusvalenze e minusvalenze',
          en: 'Treatment of capital gains and losses'
        },
        content: {
          fr: 'Le traitement fiscal des plus-values dépend du statut de l\'investisseur. Pour la gestion de fortune privée (règle générale), les plus-values sont non imposables et les moins-values non déductibles. Pour le trading/activité commerciale, les plus-values sont imposables comme revenus d\'activité indépendante et les moins-values sont déductibles. Les critères de délimitation incluent la durée de détention, le rapport entre plus-values et fortune/revenus, le financement par emprunt, la fréquence des transactions et les connaissances spécialisées.',
          de: 'Die steuerliche Behandlung von Kapitalgewinnen hängt vom Status des Investors ab. Bei privater Vermögensverwaltung (Grundregel) sind Kapitalgewinne nicht steuerbar und Kapitalverluste nicht abzugsfähig. Bei Trading/gewerblicher Tätigkeit sind Kapitalgewinne als Einkommen aus selbständiger Erwerbstätigkeit steuerbar und Kapitalverluste abzugsfähig. Die Abgrenzungskriterien umfassen Haltedauer, Verhältnis zwischen Kapitalgewinnen und Vermögen/Einkommen, Fremdfinanzierung, Transaktionshäufigkeit und Fachkenntnisse.',
          it: 'Il trattamento fiscale delle plusvalenze dipende dallo status dell\'investitore. Per la gestione patrimoniale privata (regola generale), le plusvalenze sono non imponibili e le minusvalenze non deducibili. Per il trading/attività commerciale, le plusvalenze sono imponibili come redditi di attività indipendente e le minusvalenze sono deducibili. I criteri di delimitazione includono la durata di detenzione, il rapporto tra plusvalenze e patrimonio/redditi, il finanziamento tramite prestiti, la frequenza delle transazioni e le conoscenze specializzate.',
          en: 'Tax treatment of capital gains depends on investor status. For private wealth management (general rule), capital gains are not taxable and capital losses not deductible. For trading/commercial activity, capital gains are taxable as self-employment income and capital losses are deductible. Delimitation criteria include holding period, ratio between capital gains and wealth/income, debt financing, transaction frequency and specialized knowledge.'
        },
        keyPoints: {
          fr: 'Plus-values privées généralement non imposables en Suisse • Activité commerciale = plus-values imposables • Critères stricts de délimitation (durée, fréquence, financement) • Qualification globale du portefeuille',
          de: 'Private Kapitalgewinne grundsätzlich nicht steuerbar in der Schweiz • Gewerbliche Tätigkeit = Kapitalgewinne steuerbar • Strikte Abgrenzungskriterien (Dauer, Häufigkeit, Finanzierung) • Globale Qualifikation des Portfolios',
          it: 'Plusvalenze private generalmente non imponibili in Svizzera • Attività commerciale = plusvalenze imponibili • Criteri rigorosi di delimitazione (durata, frequenza, finanziamento) • Qualificazione globale del portafoglio',
          en: 'Private capital gains generally not taxable in Switzerland • Commercial activity = taxable capital gains • Strict delimitation criteria (duration, frequency, financing) • Global portfolio qualification'
        },
        example: {
          fr: 'Investisseur détenant 20 actions pendant 2 ans, vendues avec 10\'000 CHF de plus-value : non imposable (gestion privée). Même personne faisant 100 transactions par mois : imposable (activité commerciale).',
          de: 'Investor mit 20 Aktien über 2 Jahre, verkauft mit 10\'000 CHF Kapitalgewinn: nicht steuerbar (private Verwaltung). Dieselbe Person mit 100 Transaktionen pro Monat: steuerbar (gewerbliche Tätigkeit).',
          it: 'Investitore che detiene 20 azioni per 2 anni, vendute con 10\'000 CHF di plusvalenza: non imponibile (gestione privata). Stessa persona che fa 100 transazioni al mese: imponibile (attività commerciale).',
          en: 'Investor holding 20 shares for 2 years, sold with 10,000 CHF capital gain: not taxable (private management). Same person making 100 transactions per month: taxable (commercial activity).'
        }
      },
      'fortune-titres': {
        title: {
          fr: 'Imposition de la fortune en titres',
          de: 'Besteuerung des Wertpapiervermögens',
          it: 'Imposizione del patrimonio in titoli',
          en: 'Taxation of securities wealth'
        },
        content: {
          fr: 'Les titres font partie de la fortune imposable et doivent être déclarés à leur valeur vénale au 31 décembre. Pour les titres cotés, on utilise la valeur boursière au 31 décembre, cours de clôture du dernier jour de bourse, convertie en CHF au cours officiel. Pour les titres non cotés, on utilise la valeur intrinsèque (actif net) avec des méthodes d\'évaluation reconnues. Les comptes-titres à l\'étranger doivent être déclarés obligatoirement.',
          de: 'Wertpapiere sind Teil des steuerbaren Vermögens und müssen zu ihrem Verkehrswert am 31. Dezember deklariert werden. Für kotierte Wertpapiere verwendet man den Börsenwert am 31. Dezember, Schlusskurs des letzten Börsentages, umgerechnet in CHF zum offiziellen Kurs. Für nicht kotierte Wertpapiere verwendet man den inneren Wert (Nettovermögen) mit anerkannten Bewertungsmethoden. Wertpapierdepots im Ausland müssen obligatorisch deklariert werden.',
          it: 'I titoli fanno parte del patrimonio imponibile e devono essere dichiarati al loro valore venale al 31 dicembre. Per i titoli quotati, si usa il valore di borsa al 31 dicembre, corso di chiusura dell\'ultimo giorno di borsa, convertito in CHF al corso ufficiale. Per i titoli non quotati, si usa il valore intrinseco (attivo netto) con metodi di valutazione riconosciuti. I conti-titoli all\'estero devono essere dichiarati obbligatoriamente.',
          en: 'Securities are part of taxable wealth and must be declared at their market value on December 31st. For listed securities, market value on December 31st is used, closing price of the last trading day, converted to CHF at official rate. For unlisted securities, intrinsic value (net assets) is used with recognized valuation methods. Foreign securities accounts must be declared mandatorily.'
        },
        keyPoints: {
          fr: 'Valeur vénale au 31 décembre pour impôt sur fortune • Cours officiel pour titres cotés • Déclaration obligatoire des comptes étrangers • Possibilités d\'optimisation légale',
          de: 'Verkehrswert am 31. Dezember für Vermögenssteuer • Offizieller Kurs für kotierte Wertpapiere • Obligatorische Deklaration ausländischer Konten • Möglichkeiten legaler Optimierung',
          it: 'Valore venale al 31 dicembre per imposta patrimonio • Corso ufficiale per titoli quotati • Dichiarazione obbligatoria conti esteri • Possibilità di ottimizzazione legale',
          en: 'Market value on December 31st for wealth tax • Official rate for listed securities • Mandatory declaration of foreign accounts • Legal optimization possibilities'
        },
        example: {
          fr: 'Portefeuille de 500\'000 CHF au 31.12 : imposable à la fortune. Si détenu à 50/50 par époux : 250\'000 CHF chacun (optimisation).',
          de: 'Portfolio von 500\'000 CHF am 31.12: vermögenssteuerpflichtig. Bei 50/50-Besitz durch Ehepartner: je 250\'000 CHF (Optimierung).',
          it: 'Portafoglio di 500\'000 CHF al 31.12: imponibile al patrimonio. Se detenuto 50/50 dai coniugi: 250\'000 CHF ciascuno (ottimizzazione).',
          en: 'Portfolio of 500,000 CHF on 31.12: subject to wealth tax. If held 50/50 by spouses: 250,000 CHF each (optimization).'
        }
      }
    }
  },

  'conventions-double-imposition': {
    title: {
      fr: 'Conventions de double imposition (CDI)',
      de: 'Doppelbesteuerungsabkommen (DBA)',
      it: 'Convenzioni di doppia imposizione (CDI)',
      en: 'Double taxation conventions (DTC)'
    },
    description: {
      fr: 'Comprendre les accords fiscaux internationaux et éviter la double taxation',
      de: 'Internationale Steuerabkommen verstehen und Doppelbesteuerung vermeiden',
      it: 'Comprendere gli accordi fiscali internazionali ed evitare la doppia tassazione',
      en: 'Understanding international tax agreements and avoiding double taxation'
    },
    content: {
      fr: 'Les Conventions de Double Imposition constituent l\'épine dorsale de la coopération fiscale internationale. Elles garantissent une répartition équitable du droit d\'imposer entre États et offrent une sécurité juridique aux contribuables opérant à l\'international.',
      de: 'Doppelbesteuerungsabkommen bilden das Rückgrat der internationalen Steuerkooperation. Sie gewährleisten eine faire Aufteilung des Besteuerungsrechts zwischen Staaten und bieten Rechtssicherheit für Steuerpflichtige mit grenzüberschreitenden Aktivitäten.',
      it: 'Le Convenzioni di Doppia Imposizione costituiscono la spina dorsale della cooperazione fiscale internazionale. Garantiscono una ripartizione equa del diritto di tassare tra Stati e offrono sicurezza giuridica ai contribuenti che operano a livello internazionale.',
      en: 'Double Taxation Conventions constitute the backbone of international tax cooperation. They ensure fair distribution of taxation rights between states and provide legal certainty for taxpayers operating internationally.'
    },
    sections: {
      'principe-cdi': {
        title: {
          fr: 'Principe et objectifs des CDI',
          de: 'Grundsätze und Ziele der DBA',
          it: 'Principi e obiettivi delle CDI',
          en: 'DTC principles and objectives'
        },
        content: {
          fr: 'Les Conventions de Double Imposition (CDI) sont des accords bilatéraux conclus entre la Suisse et d\'autres États pour éviter que les mêmes revenus soient imposés dans les deux pays. Les objectifs principaux sont d\'éliminer la double imposition juridique, prévenir la fraude et l\'évasion fiscales, favoriser les échanges économiques et créer la sécurité juridique pour les contribuables. La Suisse a conclu plus de 100 CDI avec différents pays, basées sur le modèle OCDE.',
          de: 'Doppelbesteuerungsabkommen (DBA) sind bilaterale Vereinbarungen zwischen der Schweiz und anderen Staaten, um zu verhindern, dass dieselben Einkommen in beiden Ländern besteuert werden. Die Hauptziele sind die Beseitigung der rechtlichen Doppelbesteuerung, die Verhinderung von Betrug und Steuerhinterziehung, die Förderung des Wirtschaftsaustauschs und die Schaffung von Rechtssicherheit für Steuerpflichtige. Die Schweiz hat über 100 DBA mit verschiedenen Ländern abgeschlossen, basierend auf dem OECD-Muster.',
          it: 'Le Convenzioni di Doppia Imposizione (CDI) sono accordi bilaterali conclusi tra la Svizzera e altri Stati per evitare che gli stessi redditi siano tassati in entrambi i paesi. Gli obiettivi principali sono eliminare la doppia imposizione giuridica, prevenire la frode e l\'evasione fiscale, favorire gli scambi economici e creare sicurezza giuridica per i contribuenti. La Svizzera ha concluso oltre 100 CDI con diversi paesi, basate sul modello OCSE.',
          en: 'Double Taxation Conventions (DTC) are bilateral agreements concluded between Switzerland and other states to prevent the same income from being taxed in both countries. Main objectives are to eliminate legal double taxation, prevent fraud and tax evasion, promote economic exchanges and create legal certainty for taxpayers. Switzerland has concluded over 100 DTCs with various countries, based on the OECD model.'
        },
        keyPoints: {
          fr: 'Plus de 100 CDI conclues par la Suisse • Basées sur le modèle OCDE • Deux méthodes principales : exemption et imputation • Sécurité juridique pour les contribuables',
          de: 'Über 100 DBA von der Schweiz abgeschlossen • Basiert auf OECD-Muster • Zwei Hauptmethoden: Befreiung und Anrechnung • Rechtssicherheit für Steuerpflichtige',
          it: 'Oltre 100 CDI concluse dalla Svizzera • Basate sul modello OCSE • Due metodi principali: esenzione e imputazione • Sicurezza giuridica per i contribuenti',
          en: 'Over 100 DTCs concluded by Switzerland • Based on OECD model • Two main methods: exemption and credit • Legal certainty for taxpayers'
        },
        example: {
          fr: 'Un frontalier travaillant en Suisse et résidant en France : la CDI Suisse-France détermine que seule la Suisse impose le salaire, la France l\'exempte.',
          de: 'Ein Grenzgänger, der in der Schweiz arbeitet und in Frankreich wohnt: das DBA Schweiz-Frankreich bestimmt, dass nur die Schweiz das Gehalt besteuert, Frankreich befreit es.',
          it: 'Un frontaliere che lavora in Svizzera e risiede in Francia: la CDI Svizzera-Francia determina che solo la Svizzera tassa il salario, la Francia lo esenta.',
          en: 'A cross-border worker working in Switzerland and residing in France: the Switzerland-France DTC determines that only Switzerland taxes the salary, France exempts it.'
        }
      },
      'champ-application': {
        title: {
          fr: 'Champ d\'application et personnes concernées',
          de: 'Anwendungsbereich und betroffene Personen',
          it: 'Campo di applicazione e persone interessate',
          en: 'Scope of application and concerned persons'
        },
        content: {
          fr: 'Les CDI s\'appliquent aux personnes physiques et morales résidentes d\'un ou des deux États contractants. Les personnes visées incluent les résidents fiscaux d\'un État contractant, parfois les nationaux selon convention, et les entreprises ayant siège effectif dans un État. Les impôts couverts sont les impôts sur le revenu et la fortune, parfois droits de succession, avec exclusion généralement de la TVA et impôts indirects.',
          de: 'DBA gelten für natürliche und juristische Personen, die in einem oder beiden Vertragsstaaten ansässig sind. Erfasste Personen umfassen steuerlich Ansässige eines Vertragsstaats, manchmal Staatsangehörige je nach Abkommen, und Unternehmen mit tatsächlichem Sitz in einem Staat. Erfasste Steuern sind Einkommen- und Vermögenssteuern, manchmal Erbschaftssteuern, mit generellem Ausschluss von MWST und indirekten Steuern.',
          it: 'Le CDI si applicano alle persone fisiche e giuridiche residenti in uno o entrambi gli Stati contraenti. Le persone interessate includono i residenti fiscali di uno Stato contraente, talvolta i nazionali secondo convenzione, e le imprese con sede effettiva in uno Stato. Le imposte coperte sono le imposte sul reddito e sul patrimonio, talvolta diritti di successione, con esclusione generalmente di IVA e imposte indirette.',
          en: 'DTCs apply to natural and legal persons resident in one or both contracting states. Covered persons include tax residents of a contracting state, sometimes nationals according to convention, and companies with effective seat in a state. Covered taxes are income and wealth taxes, sometimes inheritance duties, with general exclusion of VAT and indirect taxes.'
        },
        keyPoints: {
          fr: 'Résidence fiscale = critère principal d\'application • Impôts directs couverts (revenus, fortune) • Procédure de départage pour double résidence • Concept d\'établissement stable pour entreprises',
          de: 'Steuerlicher Wohnsitz = Hauptkriterium der Anwendung • Direkte Steuern erfasst (Einkommen, Vermögen) • Verfahren zur Entscheidung bei doppeltem Wohnsitz • Konzept der Betriebsstätte für Unternehmen',
          it: 'Residenza fiscale = criterio principale di applicazione • Imposte dirette coperte (redditi, patrimonio) • Procedura di spareggio per doppia residenza • Concetto di stabile organizzazione per imprese',
          en: 'Tax residence = main application criterion • Direct taxes covered (income, wealth) • Tie-breaker procedure for dual residence • Permanent establishment concept for businesses'
        },
        example: {
          fr: 'Cadre suisse travaillant 6 mois par an à Singapour : la CDI détermine s\'il reste résident fiscal suisse ou devient résident singapourien.',
          de: 'Schweizer Führungskraft, die 6 Monate pro Jahr in Singapur arbeitet: das DBA bestimmt, ob er steuerlich in der Schweiz ansässig bleibt oder Singapur-Resident wird.',
          it: 'Dirigente svizzero che lavora 6 mesi all\'anno a Singapore: la CDI determina se rimane residente fiscale svizzero o diventa residente singaporiano.',
          en: 'Swiss executive working 6 months per year in Singapore: the DTC determines whether he remains Swiss tax resident or becomes Singapore resident.'
        }
      },
      'types-revenus': {
        title: {
          fr: 'Répartition par types de revenus',
          de: 'Aufteilung nach Einkommensarten',
          it: 'Ripartizione per tipi di redditi',
          en: 'Distribution by income types'
        },
        content: {
          fr: 'Chaque CDI répartit le droit d\'imposer selon le type de revenu. Les revenus d\'activité dépendante suivent le principe d\'imposition dans l\'État de l\'activité avec exception si moins de 183 jours plus employeur non-résident. Les revenus immobiliers sont imposés dans l\'État de situation de l\'immeuble. Les dividendes sont imposés dans l\'État de résidence du bénéficiaire avec retenue à la source limitée dans l\'État de la source (5-15%).',
          de: 'Jedes DBA teilt das Besteuerungsrecht nach Einkommensart auf. Einkommen aus unselbständiger Arbeit folgt dem Grundsatz der Besteuerung im Tätigkeitsstaat mit Ausnahme bei unter 183 Tagen plus nicht-ansässigem Arbeitgeber. Immobilieneinkommen werden im Belegenheitsstaat der Immobilie besteuert. Dividenden werden im Ansässigkeitsstaat des Empfängers besteuert mit begrenzter Quellensteuer im Quellenstaat (5-15%).',
          it: 'Ogni CDI ripartisce il diritto di tassare secondo il tipo di reddito. I redditi di attività dipendente seguono il principio di imposizione nello Stato di attività con eccezione se meno di 183 giorni più datore di lavoro non residente. I redditi immobiliari sono tassati nello Stato di ubicazione dell\'immobile. I dividendi sono tassati nello Stato di residenza del beneficiario con ritenuta alla fonte limitata nello Stato della fonte (5-15%).',
          en: 'Each DTC distributes taxation rights according to income type. Employment income follows the principle of taxation in the activity state with exception if less than 183 days plus non-resident employer. Real estate income is taxed in the state where property is located. Dividends are taxed in the beneficiary\'s residence state with limited withholding tax in the source state (5-15%).'
        },
        keyPoints: {
          fr: 'Chaque type de revenu a sa règle spécifique • Activité salariée : règle des 183 jours • Immobilier : imposition dans l\'État de situation • Revenus mobiliers : généralement État de résidence',
          de: 'Jede Einkommensart hat ihre spezifische Regel • Angestelltentätigkeit: 183-Tage-Regel • Immobilien: Besteuerung im Belegenheitsstaat • Mobilieneinkommen: grundsätzlich Ansässigkeitsstaat',
          it: 'Ogni tipo di reddito ha la sua regola specifica • Attività dipendente: regola dei 183 giorni • Immobiliare: imposizione nello Stato di ubicazione • Redditi mobiliari: generalmente Stato di residenza',
          en: 'Each income type has its specific rule • Employment: 183-day rule • Real estate: taxation in location state • Mobile income: generally residence state'
        },
        example: {
          fr: 'Dividendes d\'une SA française reçus par un résident suisse : 5% de retenue en France, imputation en Suisse.',
          de: 'Dividenden einer französischen AG, die ein Schweizer Resident erhält: 5% Quellensteuer in Frankreich, Anrechnung in der Schweiz.',
          it: 'Dividendi di una SA francese ricevuti da un residente svizzero: 5% di ritenuta in Francia, imputazione in Svizzera.',
          en: 'Dividends from a French SA received by a Swiss resident: 5% withholding in France, credit in Switzerland.'
        }
      },
      'procedures': {
        title: {
          fr: 'Procédures et mise en œuvre',
          de: 'Verfahren und Umsetzung',
          it: 'Procedure e attuazione',
          en: 'Procedures and implementation'
        },
        content: {
          fr: 'L\'application des CDI nécessite des procédures spécifiques. Un certificat de résidence fiscale délivré par l\'administration fiscale de résidence est obligatoire pour bénéficier de la CDI. Les demandes de remboursement pour retenues à la source excédentaires ont des délais de prescription variables (2-4 ans). La procédure amiable permet la résolution des conflits entre administrations avec un délai généralement de 3 ans.',
          de: 'Die Anwendung von DBA erfordert spezifische Verfahren. Eine von der Steuerverwaltung des Wohnsitzstaats ausgestellte Ansässigkeitsbescheinigung ist obligatorisch, um vom DBA zu profitieren. Erstattungsanträge für überschüssige Quellensteuern haben variable Verjährungsfristen (2-4 Jahre). Das Verständigungsverfahren ermöglicht die Lösung von Konflikten zwischen Verwaltungen mit einer Frist von grundsätzlich 3 Jahren.',
          it: 'L\'applicazione delle CDI richiede procedure specifiche. Un certificato di residenza fiscale rilasciato dall\'amministrazione fiscale di residenza è obbligatorio per beneficiare della CDI. Le richieste di rimborso per ritenute alla fonte eccedenti hanno termini di prescrizione variabili (2-4 anni). La procedura amichevole consente la risoluzione dei conflitti tra amministrazioni con un termine generalmente di 3 anni.',
          en: 'DTC application requires specific procedures. A tax residence certificate issued by the residence tax administration is mandatory to benefit from the DTC. Refund requests for excess withholding taxes have variable prescription deadlines (2-4 years). The mutual agreement procedure allows resolution of conflicts between administrations with a deadline generally of 3 years.'
        },
        keyPoints: {
          fr: 'Certificat de résidence obligatoire • Procédures de remboursement spécifiques • Recours possible via procédure amiable • Clauses anti-abus renforcées',
          de: 'Ansässigkeitsbescheinigung obligatorisch • Spezifische Erstattungsverfahren • Rechtsmittel möglich über Verständigungsverfahren • Verstärkte Anti-Missbrauchsklauseln',
          it: 'Certificato di residenza obbligatorio • Procedure di rimborso specifiche • Ricorso possibile tramite procedura amichevole • Clausole anti-abuso rafforzate',
          en: 'Residence certificate mandatory • Specific refund procedures • Appeal possible via mutual agreement procedure • Reinforced anti-abuse clauses'
        },
        example: {
          fr: 'Retenue de 25% sur dividendes allemands au lieu de 5% prévu par CDI : demande de remboursement avec certificat de résidence suisse.',
          de: 'Quellensteuer von 25% auf deutsche Dividenden statt 5% laut DBA: Erstattungsantrag mit Schweizer Ansässigkeitsbescheinigung.',
          it: 'Ritenuta del 25% su dividendi tedeschi invece del 5% previsto da CDI: richiesta di rimborso con certificato di residenza svizzero.',
          en: '25% withholding on German dividends instead of 5% provided by DTC: refund request with Swiss residence certificate.'
        }
      }
    }
  },

  'documents-necessaires-declaration': {
    title: {
      fr: 'Documents nécessaires pour la déclaration d\'impôts',
      de: 'Erforderliche Dokumente für die Steuererklärung',
      it: 'Documenti necessari per la dichiarazione delle tasse',
      en: 'Required documents for tax declaration'
    },
    description: {
      fr: 'Liste complète des documents et justificatifs requis pour remplir sa déclaration fiscale',
      de: 'Vollständige Liste der Dokumente und Belege, die für das Ausfüllen der Steuererklärung erforderlich sind',
      it: 'Lista completa dei documenti e giustificativi richiesti per compilare la dichiarazione fiscale',
      en: 'Complete list of documents and supporting evidence required for filing tax returns'
    },
    content: {
      fr: 'La préparation de la déclaration d\'impôts nécessite de rassembler méthodiquement tous les documents justificatifs. Une organisation rigoureuse permet de s\'assurer de la complétude et de la conformité de sa déclaration fiscale.',
      de: 'Die Vorbereitung der Steuererklärung erfordert das methodische Sammeln aller Belege. Eine rigorose Organisation gewährleistet die Vollständigkeit und Konformität der Steuererklärung.',
      it: 'La preparazione della dichiarazione delle tasse richiede di raccogliere metodicamente tutti i documenti giustificativi. Un\'organizzazione rigorosa permette di assicurare la completezza e la conformità della dichiarazione fiscale.',
      en: 'Tax return preparation requires methodically gathering all supporting documents. Rigorous organization ensures completeness and compliance of the tax declaration.'
    },
    sections: {
      'documents-revenus': {
        title: {
          fr: 'Documents relatifs aux revenus',
          de: 'Einkommensbezogene Dokumente',
          it: 'Documenti relativi ai redditi',
          en: 'Income-related documents'
        },
        content: {
          fr: 'Pour déclarer correctement vos revenus, plusieurs documents sont indispensables. Pour les revenus salariés : certificat de salaire (obligatoire), décomptes de salaire de décembre, certificats de remplacement du revenu (chômage, maladie, accident). Pour les revenus indépendants : comptes annuels (bilan, compte de résultat), attestation TVA si assujetti, justificatifs des charges déductibles. Pour les revenus de capitaux : attestations bancaires (intérêts, dividendes), relevés de comptes-titres au 31 décembre.',
          de: 'Um Ihre Einkommen korrekt zu deklarieren, sind mehrere Dokumente unerlässlich. Für Lohneinkommen: Lohnausweis (obligatorisch), Lohnabrechnungen von Dezember, Ersatzeinkommens-bescheinigungen (Arbeitslosigkeit, Krankheit, Unfall). Für selbständige Einkommen: Jahresabschlüsse (Bilanz, Erfolgsrechnung), MWST-Bescheinigung falls steuerpflichtig, Belege für abzugsfähige Ausgaben. Für Kapitaleinkommen: Bankbescheinigungen (Zinsen, Dividenden), Wertschriftendepot-auszüge zum 31. Dezember.',
          it: 'Per dichiarare correttamente i vostri redditi, diversi documenti sono indispensabili. Per i redditi salariali: certificato di salario (obbligatorio), conteggi di salario di dicembre, certificati di sostituzione del reddito (disoccupazione, malattia, infortunio). Per i redditi indipendenti: conti annuali (bilancio, conto economico), attestazione IVA se soggetto, giustificativi delle spese deducibili. Per i redditi di capitale: attestazioni bancarie (interessi, dividendi), estratti conti-titoli al 31 dicembre.',
          en: 'To correctly declare your income, several documents are essential. For employment income: salary certificate (mandatory), December salary statements, income replacement certificates (unemployment, sickness, accident). For self-employment income: annual accounts (balance sheet, income statement), VAT certificate if liable, supporting evidence for deductible expenses. For capital income: bank certificates (interest, dividends), securities account statements as of December 31st.'
        },
        keyPoints: {
          fr: 'Certificat de salaire = document principal pour salariés • Comptes annuels obligatoires pour indépendants • Attestations bancaires pour revenus de capitaux • Conserver tous les justificatifs pendant 10 ans',
          de: 'Lohnausweis = Hauptdokument für Angestellte • Jahresabschlüsse obligatorisch für Selbständige • Bankbescheinigungen für Kapitaleinkommen • Alle Belege 10 Jahre aufbewahren',
          it: 'Certificato di salario = documento principale per dipendenti • Conti annuali obbligatori per indipendenti • Attestazioni bancarie per redditi di capitale • Conservare tutti i giustificativi per 10 anni',
          en: 'Salary certificate = main document for employees • Annual accounts mandatory for self-employed • Bank certificates for capital income • Keep all supporting documents for 10 years'
        },
        example: {
          fr: 'Salarié avec épargne : certificat de salaire + attestation bancaire des intérêts reçus + relevé de compte-titres.',
          de: 'Angestellter mit Sparguthaben: Lohnausweis + Bankbescheinigung der erhaltenen Zinsen + Wertschriftendepot-auszug.',
          it: 'Dipendente con risparmi: certificato di salario + attestazione bancaria degli interessi ricevuti + estratto conto-titoli.',
          en: 'Employee with savings: salary certificate + bank certificate of interest received + securities account statement.'
        }
      },
      'documents-deductions': {
        title: {
          fr: 'Justificatifs pour déductions',
          de: 'Belege für Abzüge',
          it: 'Giustificativi per detrazioni',
          en: 'Supporting documents for deductions'
        },
        content: {
          fr: 'Les déductions doivent être justifiées par des documents probants. Pour les frais professionnels : abonnements de transport (attestation), frais de repas (justificatifs restaurants, cantines), formation et perfectionnement (factures, attestations). Pour les assurances et prévoyance : polices d\'assurance maladie obligatoire, attestations 3e pilier A et B, primes d\'assurance-vie et invalidité. Pour les frais médicaux : factures médecins, dentistes, hôpitaux, uniquement sur prescription.',
          de: 'Abzüge müssen durch aussagekräftige Dokumente belegt werden. Für Berufskosten: Transportabonnements (Bescheinigung), Verpflegungskosten (Belege Restaurants, Kantinen), Aus- und Weiterbildung (Rechnungen, Bescheinigungen). Für Versicherungen und Vorsorge: Krankenkassen-policen, 3. Säule A und B Bescheinigungen, Lebens- und Invaliditätsversicherungsprämien. Für Arztkosten: Rechnungen Ärzte, Zahnärzte, Spitäler, nur auf Verschreibung.',
          it: 'Le detrazioni devono essere giustificate da documenti probanti. Per le spese professionali: abbonamenti di trasporto (attestazione), spese per pasti (giustificativi ristoranti, mense), formazione e perfezionamento (fatture, attestazioni). Per assicurazioni e previdenza: polizze assicurazione malattia obbligatoria, attestazioni 3° pilastro A e B, premi assicurazione vita e invalidità. Per le spese mediche: fatture medici, dentisti, ospedali, solo su prescrizione.',
          en: 'Deductions must be justified by supporting documents. For professional expenses: transport subscriptions (certificate), meal expenses (restaurant, canteen receipts), training and development (invoices, certificates). For insurance and pension: mandatory health insurance policies, 3rd pillar A and B certificates, life and disability insurance premiums. For medical expenses: doctors, dentists, hospital invoices, only on prescription.'
        },
        keyPoints: {
          fr: 'Toute déduction doit être justifiée par un document • Conserver factures et attestations originales • Intérêts hypothécaires : attestation bancaire obligatoire • Frais médicaux : uniquement sur prescription',
          de: 'Jeder Abzug muss durch ein Dokument belegt werden • Original-Rechnungen und Bescheinigungen aufbewahren • Hypothekarzinsen: Bankbescheinigung obligatorisch • Arztkosten: nur auf Verschreibung',
          it: 'Ogni detrazione deve essere giustificata da un documento • Conservare fatture e attestazioni originali • Interessi ipotecari: attestazione bancaria obbligatoria • Spese mediche: solo su prescrizione',
          en: 'Every deduction must be justified by a document • Keep original invoices and certificates • Mortgage interest: bank certificate mandatory • Medical expenses: only on prescription'
        },
        example: {
          fr: 'Déduction de 5000 CHF de frais médicaux : nécessite factures détaillées + prescriptions médicales.',
          de: 'Abzug von 5000 CHF Arztkosten: erfordert detaillierte Rechnungen + ärztliche Verschreibungen.',
          it: 'Detrazione di 5000 CHF di spese mediche: richiede fatture dettagliate + prescrizioni mediche.',
          en: 'Deduction of 5000 CHF medical expenses: requires detailed invoices + medical prescriptions.'
        }
      },
      'documents-fortune': {
        title: {
          fr: 'Inventaire de la fortune',
          de: 'Vermögensinventar',
          it: 'Inventario del patrimonio',
          en: 'Wealth inventory'
        },
        content: {
          fr: 'La déclaration de fortune nécessite un inventaire complet au 31 décembre. Pour les comptes bancaires : relevés de tous les comptes au 31.12, comptes courants, épargne, placement, comptes à l\'étranger (déclaration spéciale). Pour les titres et valeurs : relevés de dépôts au 31.12, valorisation des titres non cotés, participations dans sociétés. Pour les biens immobiliers : estimation officielle ou valeur d\'achat, factures de rénovations importantes.',
          de: 'Die Vermögenserklärung erfordert ein vollständiges Inventar zum 31. Dezember. Für Bankkonten: Auszüge aller Konten zum 31.12, Girokonten, Sparen, Anlagen, Auslandskonten (Sondererklärung). Für Wertschriften: Depotauszüge zum 31.12, Bewertung nicht kotierter Titel, Beteiligungen an Gesellschaften. Für Immobilien: amtliche Schätzung oder Kaufwert, Rechnungen wichtiger Renovationen.',
          it: 'La dichiarazione del patrimonio richiede un inventario completo al 31 dicembre. Per i conti bancari: estratti di tutti i conti al 31.12, conti correnti, risparmio, investimenti, conti all\'estero (dichiarazione speciale). Per titoli e valori: estratti depositi al 31.12, valorizzazione titoli non quotati, partecipazioni in società. Per beni immobiliari: stima ufficiale o valore di acquisto, fatture di ristrutturazioni importanti.',
          en: 'Wealth declaration requires a complete inventory as of December 31st. For bank accounts: statements of all accounts on 31.12, current accounts, savings, investments, foreign accounts (special declaration). For securities: deposit statements on 31.12, valuation of unlisted securities, company participations. For real estate: official estimate or purchase value, invoices for major renovations.'
        },
        keyPoints: {
          fr: 'Inventaire complet au 31 décembre obligatoire • Valorisation à la valeur vénale • Comptes étrangers : déclaration spéciale • Dettes déductibles uniquement si documentées',
          de: 'Vollständiges Inventar zum 31. Dezember obligatorisch • Bewertung zum Verkehrswert • Auslandskonten: Sondererklärung • Schulden nur abzugsfähig wenn dokumentiert',
          it: 'Inventario completo al 31 dicembre obbligatorio • Valorizzazione al valore venale • Conti esteri: dichiarazione speciale • Debiti deducibili solo se documentati',
          en: 'Complete inventory on December 31st mandatory • Valuation at market value • Foreign accounts: special declaration • Debts deductible only if documented'
        },
        example: {
          fr: 'Fortune immobilière de 800\'000 CHF - hypothèque de 400\'000 CHF = 400\'000 CHF de fortune nette imposable.',
          de: 'Immobilienvermögen von 800\'000 CHF - Hypothek von 400\'000 CHF = 400\'000 CHF steuerbares Nettovermögen.',
          it: 'Patrimonio immobiliare di 800\'000 CHF - ipoteca di 400\'000 CHF = 400\'000 CHF di patrimonio netto imponibile.',
          en: 'Real estate wealth of 800,000 CHF - mortgage of 400,000 CHF = 400,000 CHF taxable net wealth.'
        }
      },
      'organisation-documents': {
        title: {
          fr: 'Organisation et conservation',
          de: 'Organisation und Aufbewahrung',
          it: 'Organizzazione e conservazione',
          en: 'Organization and storage'
        },
        content: {
          fr: 'Une bonne organisation des documents facilite la déclaration et les contrôles. Le classement recommandé comprend un dossier par année fiscale, des sous-dossiers par catégorie (revenus, déductions, fortune), un classement chronologique dans chaque catégorie. La conservation obligatoire est de 10 ans minimum avec originaux requis pour justificatifs. La préparation méthodique incluant une check-list des documents nécessaires facilite le processus.',
          de: 'Eine gute Organisation der Dokumente erleichtert die Erklärung und Kontrollen. Die empfohlene Ablage umfasst einen Ordner pro Steuerjahr, Unterordner nach Kategorien (Einkommen, Abzüge, Vermögen), chronologische Ablage in jeder Kategorie. Die obligatorische Aufbewahrung beträgt mindestens 10 Jahre mit erforderlichen Originalen für Belege. Die methodische Vorbereitung mit einer Checkliste der notwendigen Dokumente erleichtert den Prozess.',
          it: 'Una buona organizzazione dei documenti facilita la dichiarazione e i controlli. La classificazione raccomandata comprende una cartella per anno fiscale, sottocartelle per categoria (redditi, detrazioni, patrimonio), classificazione cronologica in ogni categoria. La conservazione obbligatoria è di 10 anni minimo con originali richiesti per giustificativi. La preparazione metodica includendo una check-list dei documenti necessari facilita il processo.',
          en: 'Good document organization facilitates declaration and audits. Recommended filing includes one folder per tax year, sub-folders by category (income, deductions, wealth), chronological filing within each category. Mandatory storage is 10 years minimum with originals required for supporting documents. Methodical preparation including a checklist of necessary documents facilitates the process.'
        },
        keyPoints: {
          fr: 'Conservation 10 ans minimum obligatoire • Classement systématique recommandé • Originaux requis pour justificatifs • Préparation méthodique de la déclaration',
          de: 'Aufbewahrung mindestens 10 Jahre obligatorisch • Systematische Ablage empfohlen • Originale für Belege erforderlich • Methodische Vorbereitung der Erklärung',
          it: 'Conservazione 10 anni minimo obbligatoria • Classificazione sistematica raccomandata • Originali richiesti per giustificativi • Preparazione metodica della dichiarazione',
          en: 'Storage 10 years minimum mandatory • Systematic filing recommended • Originals required for supporting documents • Methodical preparation of declaration'
        },
        example: {
          fr: 'Contrôle fiscal de l\'année 2020 en 2024 : tous les documents 2020 doivent être disponibles.',
          de: 'Steuerkontrolle des Jahres 2020 im Jahr 2024: alle Dokumente 2020 müssen verfügbar sein.',
          it: 'Controllo fiscale dell\'anno 2020 nel 2024: tutti i documenti 2020 devono essere disponibili.',
          en: 'Tax audit of year 2020 in 2024: all 2020 documents must be available.'
        }
      }
    }
  },

  'prevoyance-2e-3e-pilier': {
    title: {
      fr: 'Prévoyance professionnelle et individuelle (2e/3e pilier)',
      de: 'Berufliche und private Vorsorge (2./3. Säule)',
      it: 'Previdenza professionale e individuale (2°/3° pilastro)',
      en: 'Professional and individual pension (2nd/3rd pillar)'
    },
    description: {
      fr: 'Comprendre et optimiser votre prévoyance professionnelle et privée en Suisse',
      de: 'Ihre berufliche und private Vorsorge in der Schweiz verstehen und optimieren',
      it: 'Comprendere e ottimizzare la vostra previdenza professionale e privata in Svizzera',
      en: 'Understanding and optimizing your professional and private pension in Switzerland'
    },
    content: {
      fr: 'Le système de prévoyance suisse constitue un modèle unique au monde, reposant sur trois piliers complémentaires. Une compréhension approfondie permet d\'optimiser ses avantages fiscaux et de garantir une retraite sereine.',
      de: 'Das schweizerische Vorsorgesystem ist ein weltweit einzigartiges Modell, das auf drei komplementären Säulen basiert. Ein tiefes Verständnis ermöglicht es, die Steuervorteile zu optimieren und eine sorgenfreie Rente zu gewährleisten.',
      it: 'Il sistema previdenziale svizzero costituisce un modello unico al mondo, basato su tre pilastri complementari. Una comprensione approfondita permette di ottimizzare i vantaggi fiscali e garantire una pensione serena.',
      en: 'The Swiss pension system constitutes a unique model worldwide, based on three complementary pillars. Deep understanding allows optimizing tax benefits and ensuring a peaceful retirement.'
    },
    sections: {
      'systeme-trois-piliers': {
        title: {
          fr: 'Le système des trois piliers',
          de: 'Das Drei-Säulen-System',
          it: 'Il sistema dei tre pilastri',
          en: 'The three-pillar system'
        },
        content: {
          fr: 'Le système de prévoyance suisse repose sur trois piliers complémentaires visant à garantir le maintien du niveau de vie à la retraite. Le 1er pilier (AVS/AI) est la prévoyance étatique obligatoire couvrant les besoins vitaux de base avec une rente maximale AVS de 2\'450 CHF/mois. Le 2e pilier (LPP) est la prévoyance professionnelle obligatoire pour maintenir le niveau de vie antérieur, obligatoire dès 22\'050 CHF de salaire annuel. Le 3e pilier est la prévoyance individuelle facultative en complément personnalisé.',
          de: 'Das schweizerische Vorsorgesystem basiert auf drei komplementären Säulen zur Gewährleistung der Lebenshaltung im Alter. Die 1. Säule (AHV/IV) ist die obligatorische staatliche Vorsorge zur Deckung der Grundbedürfnisse mit einer maximalen AHV-Rente von 2\'450 CHF/Monat. Die 2. Säule (BVG) ist die obligatorische berufliche Vorsorge zur Aufrechterhaltung des gewohnten Lebensstandards, obligatorisch ab 22\'050 CHF Jahreslohn. Die 3. Säule ist die freiwillige individuelle Vorsorge als persönliche Ergänzung.',
          it: 'Il sistema previdenziale svizzero si basa su tre pilastri complementari volti a garantire il mantenimento del tenore di vita in pensione. Il 1° pilastro (AVS/AI) è la previdenza statale obbligatoria che copre i bisogni vitali di base con una rendita massima AVS di 2\'450 CHF/mese. Il 2° pilastro (LPP) è la previdenza professionale obbligatoria per mantenere il tenore di vita precedente, obbligatoria da 22\'050 CHF di salario annuo. Il 3° pilastro è la previdenza individuale facoltativa come complemento personalizzato.',
          en: 'The Swiss pension system is based on three complementary pillars aimed at ensuring maintenance of living standards in retirement. The 1st pillar (AVS/AI) is mandatory state pension covering basic vital needs with a maximum AVS pension of 2,450 CHF/month. The 2nd pillar (LPP) is mandatory occupational pension to maintain previous living standards, mandatory from 22,050 CHF annual salary. The 3rd pillar is optional individual pension as personalized supplement.'
        },
        keyPoints: {
          fr: 'Système à trois niveaux pour protection complète • 1er pilier : besoins de base (AVS) • 2e pilier : maintien niveau de vie (LPP) • 3e pilier : complément individuel avec avantages fiscaux',
          de: 'Drei-Stufen-System für vollständigen Schutz • 1. Säule: Grundbedürfnisse (AHV) • 2. Säule: Lebensstandard-Erhaltung (BVG) • 3. Säule: individuelle Ergänzung mit Steuervorteilen',
          it: 'Sistema a tre livelli per protezione completa • 1° pilastro: bisogni di base (AVS) • 2° pilastro: mantenimento tenore di vita (LPP) • 3° pilastro: complemento individuale con vantaggi fiscali',
          en: 'Three-level system for complete protection • 1st pillar: basic needs (AVS) • 2nd pillar: living standard maintenance (LPP) • 3rd pillar: individual supplement with tax benefits'
        },
        example: {
          fr: 'Salarié avec 80\'000 CHF de salaire : AVS (1er pilier) = environ 2\'000 CHF/mois, LPP (2e pilier) = environ 1\'500 CHF/mois, nécessité du 3e pilier pour maintenir le niveau de vie.',
          de: 'Angestellter mit 80\'000 CHF Lohn: AHV (1. Säule) = etwa 2\'000 CHF/Monat, BVG (2. Säule) = etwa 1\'500 CHF/Monat, 3. Säule notwendig zur Lebensstandard-Erhaltung.',
          it: 'Dipendente con 80\'000 CHF di salario: AVS (1° pilastro) = circa 2\'000 CHF/mese, LPP (2° pilastro) = circa 1\'500 CHF/mese, necessità del 3° pilastro per mantenere il tenore di vita.',
          en: 'Employee with 80,000 CHF salary: AVS (1st pillar) = about 2,000 CHF/month, LPP (2nd pillar) = about 1,500 CHF/month, need for 3rd pillar to maintain living standards.'
        }
      },
      'deuxieme-pilier': {
        title: {
          fr: 'Le 2e pilier (LPP) en détail',
          de: 'Die 2. Säule (BVG) im Detail',
          it: 'Il 2° pilastro (LPP) in dettaglio',
          en: 'The 2nd pillar (LPP) in detail'
        },
        content: {
          fr: 'La prévoyance professionnelle constitue un élément central du système de retraite suisse. Les cotisations LPP sont partagées avec l\'employeur (minimum 50%) et l\'employé (maximum 50%), avec des taux selon l\'âge de 7% à 18% du salaire assuré. Les rachats volontaires permettent de combler les lacunes de cotisation et sont entièrement déductibles fiscalement, mais bloqués 3 ans avant retrait en capital.',
          de: 'Die berufliche Vorsorge ist ein zentrales Element des schweizerischen Rentensystems. Die BVG-Beiträge werden zwischen Arbeitgeber (mindestens 50%) und Arbeitnehmer (maximal 50%) geteilt, mit altersabhängigen Sätzen von 7% bis 18% des versicherten Lohns. Freiwillige Einkäufe ermöglichen es, Beitragslücken zu schließen und sind vollständig steuerlich abzugsfähig, aber 3 Jahre vor Kapitalbezug gesperrt.',
          it: 'La previdenza professionale costituisce un elemento centrale del sistema pensionistico svizzero. I contributi LPP sono condivisi tra datore di lavoro (minimo 50%) e dipendente (massimo 50%), con aliquote secondo l\'età dal 7% al 18% del salario assicurato. I riscatti volontari permettono di colmare le lacune contributive e sono interamente deducibili fiscalmente, ma bloccati 3 anni prima del prelievo in capitale.',
          en: 'Occupational pension constitutes a central element of the Swiss retirement system. LPP contributions are shared between employer (minimum 50%) and employee (maximum 50%), with age-based rates from 7% to 18% of insured salary. Voluntary buy-ins allow filling contribution gaps and are fully tax deductible, but blocked 3 years before capital withdrawal.'
        },
        keyPoints: {
          fr: 'Cotisations partagées employeur/employé • Rachats volontaires déductibles à 100% • Possibilité de retrait en capital ou rente • Retrait anticipé pour propriété ou indépendance',
          de: 'Geteilte Beiträge Arbeitgeber/Arbeitnehmer • Freiwillige Einkäufe 100% abzugsfähig • Möglichkeit Kapitalbezug oder Rente • Vorzeitiger Bezug für Eigentum oder Selbständigkeit',
          it: 'Contributi condivisi datore di lavoro/dipendente • Riscatti volontari deducibili al 100% • Possibilità di prelievo in capitale o rendita • Prelievo anticipato per proprietà o indipendenza',
          en: 'Shared employer/employee contributions • Voluntary buy-ins 100% deductible • Possibility of capital or pension withdrawal • Early withdrawal for property or self-employment'
        },
        example: {
          fr: 'Rachat LPP de 50\'000 CHF : économie fiscale immédiate de 15\'000 CHF (taux marginal 30%), augmentation de la rente future de 200 CHF/mois.',
          de: 'BVG-Einkauf von 50\'000 CHF: sofortige Steuerersparnis von 15\'000 CHF (Grenzsteuersatz 30%), Erhöhung der künftigen Rente um 200 CHF/Monat.',
          it: 'Riscatto LPP di 50\'000 CHF: risparmio fiscale immediato di 15\'000 CHF (aliquota marginale 30%), aumento della rendita futura di 200 CHF/mese.',
          en: 'LPP buy-in of 50,000 CHF: immediate tax saving of 15,000 CHF (30% marginal rate), increase in future pension by 200 CHF/month.'
        }
      },
      'troisieme-pilier-a': {
        title: {
          fr: 'Le 3e pilier A (prévoyance liée)',
          de: 'Die 3. Säule A (gebundene Vorsorge)',
          it: 'Il 3° pilastro A (previdenza vincolata)',
          en: 'The 3rd pillar A (tied pension)'
        },
        content: {
          fr: 'Le pilier 3a offre des avantages fiscaux substantiels pour la constitution d\'une épargne retraite. Les montants maximaux 2024 sont de 7\'056 CHF par année avec 2e pilier ou 35\'280 CHF pour les indépendants sans 2e pilier, déductibles à 100% du revenu imposable. L\'imposition au retrait se fait à taux réduit séparé du revenu, environ 5-8% selon canton et montant.',
          de: 'Die Säule 3a bietet substantielle Steuervorteile für den Aufbau einer Altersvorsorge. Die Höchstbeträge 2024 betragen 7\'056 CHF pro Jahr mit 2. Säule oder 35\'280 CHF für Selbständige ohne 2. Säule, zu 100% vom steuerbaren Einkommen abzugsfähig. Die Besteuerung beim Bezug erfolgt zu reduziertem Satz getrennt vom Einkommen, etwa 5-8% je nach Kanton und Betrag.',
          it: 'Il pilastro 3a offre vantaggi fiscali sostanziali per la costituzione di un risparmio pensionistico. Gli importi massimi 2024 sono di 7\'056 CHF all\'anno con 2° pilastro o 35\'280 CHF per gli indipendenti senza 2° pilastro, deducibili al 100% dal reddito imponibile. L\'imposizione al prelievo avviene con aliquota ridotta separata dal reddito, circa 5-8% secondo cantone e importo.',
          en: '3rd pillar A offers substantial tax benefits for building retirement savings. Maximum amounts 2024 are 7,056 CHF per year with 2nd pillar or 35,280 CHF for self-employed without 2nd pillar, 100% deductible from taxable income. Taxation at withdrawal is at reduced rate separate from income, about 5-8% depending on canton and amount.'
        },
        keyPoints: {
          fr: 'Déduction fiscale jusqu\'à 7\'056 CHF/an • Économie fiscale immédiate de 20-40% • Retrait anticipé possible dès 60/59 ans • Imposition réduite au retrait (5-8%)',
          de: 'Steuerabzug bis 7\'056 CHF/Jahr • Sofortige Steuerersparnis von 20-40% • Vorzeitiger Bezug möglich ab 60/59 Jahren • Reduzierte Besteuerung beim Bezug (5-8%)',
          it: 'Detrazione fiscale fino a 7\'056 CHF/anno • Risparmio fiscale immediato del 20-40% • Prelievo anticipato possibile da 60/59 anni • Imposizione ridotta al prelievo (5-8%)',
          en: 'Tax deduction up to 7,056 CHF/year • Immediate tax saving of 20-40% • Early withdrawal possible from 60/59 years • Reduced taxation at withdrawal (5-8%)'
        },
        example: {
          fr: 'Versement annuel de 7\'056 CHF pendant 30 ans : capital final environ 350\'000 CHF, économies fiscales cumulées environ 70\'000 CHF.',
          de: 'Jährliche Einzahlung von 7\'056 CHF über 30 Jahre: Endkapital etwa 350\'000 CHF, kumulierte Steuerersparnisse etwa 70\'000 CHF.',
          it: 'Versamento annuale di 7\'056 CHF per 30 anni: capitale finale circa 350\'000 CHF, risparmi fiscali cumulati circa 70\'000 CHF.',
          en: 'Annual payment of 7,056 CHF for 30 years: final capital about 350,000 CHF, cumulative tax savings about 70,000 CHF.'
        }
      },
      'optimisation-fiscale': {
        title: {
          fr: 'Optimisation fiscale de la prévoyance',
          de: 'Steueroptimierung der Vorsorge',
          it: 'Ottimizzazione fiscale della previdenza',
          en: 'Tax optimization of pension'
        },
        content: {
          fr: 'Stratégies pour maximiser les avantages fiscaux de votre prévoyance. L\'échelonnement des retraits consiste à ouvrir plusieurs comptes 3a (max 5 recommandé) et retirer sur plusieurs années fiscales pour réduire la progression fiscale. La combinaison optimal est : maximiser d\'abord le 3a (flexibilité), puis rachats LPP ciblés (3-5 ans avant retraite), alternance capital/rente selon situation.',
          de: 'Strategien zur Maximierung der Steuervorteile Ihrer Vorsorge. Die Staffelung der Bezüge besteht darin, mehrere 3a-Konten zu eröffnen (max. 5 empfohlen) und über mehrere Steuerjahre zu beziehen, um die Steuerprogression zu reduzieren. Die optimale Kombination ist: zuerst 3a maximieren (Flexibilität), dann gezielte BVG-Einkäufe (3-5 Jahre vor Rente), Wechsel Kapital/Rente je nach Situation.',
          it: 'Strategie per massimizzare i vantaggi fiscali della vostra previdenza. Lo scaglionamento dei prelievi consiste nell\'aprire più conti 3a (max 5 raccomandati) e prelevare su più anni fiscali per ridurre la progressione fiscale. La combinazione ottimale è: massimizzare prima il 3a (flessibilità), poi riscatti LPP mirati (3-5 anni prima della pensione), alternanza capitale/rendita secondo situazione.',
          en: 'Strategies to maximize tax benefits of your pension. Staggering withdrawals consists of opening multiple 3a accounts (max 5 recommended) and withdrawing over multiple tax years to reduce tax progression. Optimal combination is: first maximize 3a (flexibility), then targeted LPP buy-ins (3-5 years before retirement), alternate capital/pension according to situation.'
        },
        keyPoints: {
          fr: 'Ouvrir plusieurs comptes 3a pour échelonner • Rachats LPP stratégiques avant retraite • Coordination des retraits pour minimiser l\'impôt • Planification sur 5-10 ans avant retraite',
          de: 'Mehrere 3a-Konten für Staffelung eröffnen • Strategische BVG-Einkäufe vor Rente • Koordination der Bezüge zur Steuerminimierung • Planung 5-10 Jahre vor Rente',
          it: 'Aprire più conti 3a per scaglionare • Riscatti LPP strategici prima della pensione • Coordinazione dei prelievi per minimizzare l\'imposta • Pianificazione 5-10 anni prima della pensione',
          en: 'Open multiple 3a accounts for staggering • Strategic LPP buy-ins before retirement • Coordination of withdrawals to minimize tax • Planning 5-10 years before retirement'
        },
        example: {
          fr: '5 comptes 3a de 70\'000 CHF chacun, retirés sur 5 ans : économie fiscale de 15\'000 CHF vs retrait unique.',
          de: '5 Konten 3a zu je 70\'000 CHF, über 5 Jahre bezogen: Steuerersparnis von 15\'000 CHF vs. Einmalbezug.',
          it: '5 conti 3a di 70\'000 CHF ciascuno, prelevati su 5 anni: risparmio fiscale di 15\'000 CHF vs prelievo unico.',
          en: '5 accounts 3a of 70,000 CHF each, withdrawn over 5 years: tax saving of 15,000 CHF vs single withdrawal.'
        }
      }
    }
  },

  'imposition-benefice-entreprises': {
    title: {
      fr: 'Imposition du bénéfice des entreprises',
      de: 'Gewinnbesteuerung von Unternehmen',
      it: 'Tassazione del profitto delle imprese',
      en: 'Corporate profit taxation'
    },
    description: {
      fr: 'Calcul et optimisation de l\'impôt sur le bénéfice : détermination, charges déductibles et planification',
      de: 'Berechnung und Optimierung der Gewinnsteuer: Ermittlung, abzugsfähige Kosten und Planung',
      it: 'Calcolo e ottimizzazione dell\'imposta sul profitto: determinazione, spese deducibili e pianificazione',
      en: 'Calculation and optimization of profit tax: determination, deductible expenses and planning'
    },
    content: {
      fr: 'L\'imposition du bénéfice constitue l\'un des piliers de la fiscalité des entreprises en Suisse. La complexité du système nécessite une compréhension approfondie des règles de détermination du bénéfice imposable, des charges déductibles et des stratégies d\'optimisation légales.',
      de: 'Die Gewinnbesteuerung ist einer der Pfeiler der Unternehmensbesteuerung in der Schweiz. Die Komplexität des Systems erfordert ein tiefes Verständnis der Regeln zur Bestimmung des steuerbaren Gewinns, der abzugsfähigen Kosten und der legalen Optimierungsstrategien.',
      it: 'La tassazione del profitto costituisce uno dei pilastri della fiscalità delle imprese in Svizzera. La complessità del sistema richiede una comprensione approfondita delle regole di determinazione del profitto imponibile, delle spese deducibili e delle strategie di ottimizzazione legali.',
      en: 'Profit taxation constitutes one of the pillars of corporate taxation in Switzerland. The complexity of the system requires a deep understanding of the rules for determining taxable profit, deductible expenses and legal optimization strategies.'
    },
    sections: {
      'determination-benefice': {
        title: {
          fr: 'Détermination du bénéfice imposable',
          de: 'Bestimmung des steuerbaren Gewinns',
          it: 'Determinazione del profitto imponibile',
          en: 'Determination of taxable profit'
        },
        content: {
          fr: 'Le bénéfice imposable se calcule selon le principe de la comptabilité commerciale, en partant du résultat comptable pour effectuer les corrections fiscales nécessaires. Les différences principales concernent les amortissements (limités selon barèmes fiscaux), les provisions (strictement encadrées), et certaines charges non déductibles. La tenue d\'une comptabilité complète est obligatoire pour toutes les sociétés et les entreprises individuelles dépassant 500\'000 CHF de chiffre d\'affaires.',
          de: 'Der steuerbare Gewinn wird nach dem Prinzip der Handelsbilanz berechnet, ausgehend vom buchhalterischen Ergebnis mit den notwendigen steuerlichen Korrekturen. Die Hauptunterschiede betreffen Abschreibungen (begrenzt nach Steuertarifen), Rückstellungen (streng geregelt) und bestimmte nicht abzugsfähige Kosten. Die Führung einer vollständigen Buchhaltung ist für alle Gesellschaften und Einzelunternehmen mit einem Umsatz über 500\'000 CHF obligatorisch.',
          it: 'Il profitto imponibile si calcola secondo il principio della contabilità commerciale, partendo dal risultato contabile per effettuare le correzioni fiscali necessarie. Le differenze principali riguardano gli ammortamenti (limitati secondo tariffe fiscali), le riserve (strettamente regolamentate) e certe spese non deducibili. La tenuta di una contabilità completa è obbligatoria per tutte le società e le imprese individuali che superano 500\'000 CHF di fatturato.',
          en: 'Taxable profit is calculated according to the principle of commercial accounting, starting from the accounting result to make the necessary tax corrections. The main differences concern depreciation (limited according to tax schedules), provisions (strictly regulated), and certain non-deductible expenses. Keeping complete accounts is mandatory for all companies and individual enterprises exceeding 500,000 CHF in turnover.'
        },
        keyPoints: {
          fr: 'Base : résultat comptable + corrections fiscales • Amortissements selon barèmes fiscaux • Provisions strictement encadrées • Comptabilité obligatoire si CA > 500\'000 CHF',
          de: 'Basis: buchhalterisches Ergebnis + steuerliche Korrekturen • Abschreibungen nach Steuertarifen • Rückstellungen streng geregelt • Buchhaltung obligatorisch bei Umsatz > 500\'000 CHF',
          it: 'Base: risultato contabile + correzioni fiscali • Ammortamenti secondo tariffe fiscali • Riserve strettamente regolamentate • Contabilità obbligatoria se fatturato > 500\'000 CHF',
          en: 'Base: accounting result + tax corrections • Depreciation according to tax schedules • Provisions strictly regulated • Accounting mandatory if turnover > 500,000 CHF'
        },
        example: {
          fr: 'Bénéfice comptable 100\'000 CHF - correction amortissement 10\'000 CHF + reprise provision excessive 5\'000 CHF = bénéfice imposable 95\'000 CHF.',
          de: 'Buchhalterischer Gewinn 100\'000 CHF - Abschreibungskorrektur 10\'000 CHF + Auflösung übermäßiger Rückstellung 5\'000 CHF = steuerbarer Gewinn 95\'000 CHF.',
          it: 'Profitto contabile 100\'000 CHF - correzione ammortamento 10\'000 CHF + ripresa riserva eccessiva 5\'000 CHF = profitto imponibile 95\'000 CHF.',
          en: 'Accounting profit 100,000 CHF - depreciation correction 10,000 CHF + reversal of excessive provision 5,000 CHF = taxable profit 95,000 CHF.'
        }
      },
      'charges-deductibles': {
        title: {
          fr: 'Charges déductibles et non déductibles',
          de: 'Abzugsfähige und nicht abzugsfähige Kosten',
          it: 'Spese deducibili e non deducibili',
          en: 'Deductible and non-deductible expenses'
        },
        content: {
          fr: 'La déductibilité des charges obéit au principe de causalité : seules les dépenses justifiées par l\'activité commerciale sont déductibles. Les salaires et charges sociales sont déductibles s\'ils correspondent à une prestation effective. Les frais de représentation sont limités à 1% du chiffre d\'affaires. Les amendes, pénalités et libéralités ne sont pas déductibles. Les intérêts passifs sont déductibles dans certaines limites selon les règles de sous-capitalisation.',
          de: 'Die Abzugsfähigkeit von Kosten folgt dem Kausalitätsprinzip: nur durch die Geschäftstätigkeit begründete Ausgaben sind abzugsfähig. Löhne und Sozialabgaben sind abzugsfähig, wenn sie einer effektiven Leistung entsprechen. Repräsentationskosten sind auf 1% des Umsatzes begrenzt. Bußen, Strafen und Schenkungen sind nicht abzugsfähig. Passivzinsen sind in bestimmten Grenzen nach den Regeln der Unterkapitalisierung abzugsfähig.',
          it: 'La deducibilità delle spese obbedisce al principio di causalità: solo le spese giustificate dall\'attività commerciale sono deducibili. I salari e gli oneri sociali sono deducibili se corrispondono a una prestazione effettiva. Le spese di rappresentanza sono limitate all\'1% del fatturato. Le multe, penalità e liberalità non sono deducibili. Gli interessi passivi sono deducibili entro certi limiti secondo le regole di sottocapitalizzazione.',
          en: 'Deductibility of expenses follows the causality principle: only expenses justified by commercial activity are deductible. Salaries and social charges are deductible if they correspond to an actual service. Representation expenses are limited to 1% of turnover. Fines, penalties and donations are not deductible. Passive interest is deductible within certain limits according to thin capitalization rules.'
        },
        keyPoints: {
          fr: 'Principe de causalité obligatoire • Salaires déductibles si prestation effective • Représentation limitée à 1% CA • Amendes et libéralités exclues • Intérêts passifs limités',
          de: 'Kausalitätsprinzip obligatorisch • Löhne abzugsfähig bei effektiver Leistung • Repräsentation begrenzt auf 1% Umsatz • Bußen und Schenkungen ausgeschlossen • Passivzinsen begrenzt',
          it: 'Principio di causalità obbligatorio • Salari deducibili se prestazione effettiva • Rappresentanza limitata all\'1% fatturato • Multe e liberalità escluse • Interessi passivi limitati',
          en: 'Causality principle mandatory • Salaries deductible if actual service • Representation limited to 1% turnover • Fines and donations excluded • Passive interest limited'
        },
        example: {
          fr: 'Repas d\'affaires avec clients : déductible. Amendes de circulation : non déductible. Don à une œuvre : non déductible sauf si lien avec l\'activité.',
          de: 'Geschäftsessen mit Kunden: abzugsfähig. Verkehrsbußen: nicht abzugsfähig. Spende an Wohltätigkeit: nicht abzugsfähig außer bei Geschäftsbezug.',
          it: 'Pasti d\'affari con clienti: deducibile. Multe stradali: non deducibile. Donazione a beneficenza: non deducibile salvo se collegata all\'attività.',
          en: 'Business meals with clients: deductible. Traffic fines: non-deductible. Charity donation: non-deductible unless business-related.'
        }
      },
      'optimisation-fiscale': {
        title: {
          fr: 'Stratégies d\'optimisation fiscale',
          de: 'Steueroptimierungsstrategien',
          it: 'Strategie di ottimizzazione fiscale',
          en: 'Tax optimization strategies'
        },
        content: {
          fr: 'L\'optimisation fiscale légale passe par plusieurs leviers. Le timing des charges et produits permet d\'étaler la charge fiscale selon les années. Les amortissements dégressifs accélèrent la déduction sur les premiers exercices. La constitution de provisions pour risques identifiés diffère l\'imposition. La planification des investissements et des cessions optimise l\'impact fiscal global. La coordination entre bénéfice et fortune évite les doubles impositions.',
          de: 'Die legale Steueroptimierung erfolgt über mehrere Hebel. Das Timing von Kosten und Erträgen ermöglicht es, die Steuerlast über die Jahre zu verteilen. Degressive Abschreibungen beschleunigen den Abzug in den ersten Jahren. Die Bildung von Rückstellungen für identifizierte Risiken verschiebt die Besteuerung. Die Planung von Investitionen und Veräußerungen optimiert die gesamte steuerliche Auswirkung. Die Koordination zwischen Gewinn und Vermögen vermeidet Doppelbesteuerung.',
          it: 'L\'ottimizzazione fiscale legale passa attraverso diverse leve. Il timing delle spese e dei ricavi permette di distribuire il carico fiscale negli anni. Gli ammortamenti degressivi accelerano la detrazione sui primi esercizi. La costituzione di riserve per rischi identificati differisce l\'imposizione. La pianificazione degli investimenti e delle cessioni ottimizza l\'impatto fiscale globale. Il coordinamento tra profitto e patrimonio evita le doppie imposizioni.',
          en: 'Legal tax optimization works through several levers. Timing of expenses and income allows spreading the tax burden across years. Degressive depreciation accelerates deduction in the first years. Creating provisions for identified risks defers taxation. Planning investments and disposals optimizes overall tax impact. Coordination between profit and wealth avoids double taxation.'
        },
        keyPoints: {
          fr: 'Timing charges/produits pour étalement • Amortissements dégressifs privilégiés • Provisions pour risques identifiés • Planification investissements/cessions • Coordination bénéfice/fortune',
          de: 'Timing Kosten/Erträge für Verteilung • Degressive Abschreibungen bevorzugt • Rückstellungen für identifizierte Risiken • Planung Investitionen/Veräußerungen • Koordination Gewinn/Vermögen',
          it: 'Timing spese/ricavi per distribuzione • Ammortamenti degressivi privilegiati • Riserve per rischi identificati • Pianificazione investimenti/cessioni • Coordinamento profitto/patrimonio',
          en: 'Timing expenses/income for distribution • Degressive depreciation privileged • Provisions for identified risks • Planning investments/disposals • Coordination profit/wealth'
        },
        example: {
          fr: 'Différer une facture de décembre à janvier peut réduire l\'impôt de l\'exercice en cours. Investissement en décembre bénéficie de l\'amortissement dès la première année.',
          de: 'Eine Rechnung von Dezember auf Januar zu verschieben kann die Steuer des laufenden Jahres reduzieren. Investition im Dezember profitiert von Abschreibung ab dem ersten Jahr.',
          it: 'Differire una fattura da dicembre a gennaio può ridurre l\'imposta dell\'esercizio in corso. Investimento in dicembre beneficia dell\'ammortamento dal primo anno.',
          en: 'Deferring an invoice from December to January can reduce the current year\'s tax. Investment in December benefits from depreciation from the first year.'
        }
      }
    }
  },

  'remuneration-dirigeant-entreprises': {
    title: {
      fr: 'Rémunération des dirigeants d\'entreprises',
      de: 'Vergütung von Unternehmensführern',
      it: 'Remunerazione dei dirigenti d\'impresa',
      en: 'Executive compensation in companies'
    },
    description: {
      fr: 'Optimisation de la rémunération des dirigeants : salaire, dividendes, avantages et stratégies fiscales',
      de: 'Optimierung der Führungskräftevergütung: Gehalt, Dividenden, Vorteile und Steuerstrategien',
      it: 'Ottimizzazione della remunerazione dei dirigenti: stipendio, dividendi, benefici e strategie fiscali',
      en: 'Executive compensation optimization: salary, dividends, benefits and tax strategies'
    },
    content: {
      fr: 'La rémunération des dirigeants d\'entreprises constitue un enjeu fiscal complexe qui requiert une approche stratégique. L\'optimisation passe par une combinaison équilibrée entre salaire, dividendes et avantages en nature, en tenant compte des charges sociales, de l\'imposition personnelle et des besoins de trésorerie.',
      de: 'Die Vergütung von Unternehmensführern stellt eine komplexe steuerliche Herausforderung dar, die einen strategischen Ansatz erfordert. Die Optimierung erfolgt durch eine ausgewogene Kombination aus Gehalt, Dividenden und Naturalvorteilen unter Berücksichtigung der Sozialabgaben, der persönlichen Besteuerung und der Liquiditätsbedürfnisse.',
      it: 'La remunerazione dei dirigenti d\'impresa costituisce una sfida fiscale complessa che richiede un approccio strategico. L\'ottimizzazione passa attraverso una combinazione equilibrata tra stipendio, dividendi e benefici in natura, tenendo conto degli oneri sociali, dell\'imposizione personale e delle esigenze di liquidità.',
      en: 'Executive compensation constitutes a complex tax challenge that requires a strategic approach. Optimization involves a balanced combination of salary, dividends and benefits in kind, taking into account social charges, personal taxation and cash flow needs.'
    },
    sections: {
      'salaire-dividendes': {
        title: {
          fr: 'Équilibre salaire-dividendes',
          de: 'Gehalt-Dividenden-Gleichgewicht',
          it: 'Equilibrio stipendio-dividendi',
          en: 'Salary-dividend balance'
        },
        content: {
          fr: 'L\'arbitrage entre salaire et dividendes dépend de plusieurs facteurs. Le salaire subit les charges sociales (environ 25% pour l\'employeur et l\'employé) mais ouvre des droits sociaux et permet les déductions LPP et 3e pilier. Les dividendes échappent aux charges sociales mais subissent l\'impôt anticipé de 35% (récupérable) et l\'imposition personnelle progressive. L\'optimum se situe généralement autour d\'un salaire correspondant au maximum LPP (86\'040 CHF en 2024) complété par des dividendes.',
          de: 'Die Abwägung zwischen Gehalt und Dividenden hängt von mehreren Faktoren ab. Das Gehalt unterliegt Sozialabgaben (etwa 25% für Arbeitgeber und Arbeitnehmer), eröffnet aber Sozialrechte und ermöglicht BVG- und 3. Säule-Abzüge. Dividenden entgehen den Sozialabgaben, unterliegen aber der Verrechnungssteuer von 35% (rückforderbar) und der progressiven persönlichen Besteuerung. Das Optimum liegt meist bei einem Gehalt entsprechend dem BVG-Maximum (86\'040 CHF 2024) ergänzt durch Dividenden.',
          it: 'L\'arbitraggio tra stipendio e dividendi dipende da diversi fattori. Lo stipendio subisce gli oneri sociali (circa 25% per datore di lavoro e dipendente) ma apre diritti sociali e permette le detrazioni LPP e 3° pilastro. I dividendi sfuggono agli oneri sociali ma subiscono l\'imposta preventiva del 35% (recuperabile) e l\'imposizione personale progressiva. L\'ottimo si situa generalmente intorno a uno stipendio corrispondente al massimo LPP (86\'040 CHF nel 2024) completato da dividendi.',
          en: 'The arbitrage between salary and dividends depends on several factors. Salary is subject to social charges (about 25% for employer and employee) but opens social rights and allows LPP and 3rd pillar deductions. Dividends escape social charges but are subject to 35% withholding tax (recoverable) and progressive personal taxation. The optimum is generally around a salary corresponding to the LPP maximum (86,040 CHF in 2024) supplemented by dividends.'
        },
        keyPoints: {
          fr: 'Salaire : charges sociales 25% mais droits sociaux • Dividendes : pas de charges sociales, impôt anticipé 35% • Optimum : salaire maximum LPP + dividendes • Coordination avec situation personnelle',
          de: 'Gehalt: Sozialabgaben 25% aber Sozialrechte • Dividenden: keine Sozialabgaben, Verrechnungssteuer 35% • Optimum: BVG-Höchstgehalt + Dividenden • Koordination mit persönlicher Situation',
          it: 'Stipendio: oneri sociali 25% ma diritti sociali • Dividendi: niente oneri sociali, imposta preventiva 35% • Ottimo: stipendio massimo LPP + dividendi • Coordinamento con situazione personale',
          en: 'Salary: 25% social charges but social rights • Dividends: no social charges, 35% withholding tax • Optimum: maximum LPP salary + dividends • Coordination with personal situation'
        },
        example: {
          fr: 'Dirigeant avec besoin de 150\'000 CHF : 86\'040 CHF de salaire + 64\'000 CHF de dividendes économise environ 10\'000 CHF vs 150\'000 CHF de salaire pur.',
          de: 'Geschäftsführer mit Bedarf von 150\'000 CHF: 86\'040 CHF Gehalt + 64\'000 CHF Dividenden spart etwa 10\'000 CHF vs. 150\'000 CHF reines Gehalt.',
          it: 'Dirigente con necessità di 150\'000 CHF: 86\'040 CHF di stipendio + 64\'000 CHF di dividendi risparmia circa 10\'000 CHF vs 150\'000 CHF di stipendio puro.',
          en: 'Executive needing 150,000 CHF: 86,040 CHF salary + 64,000 CHF dividends saves about 10,000 CHF vs 150,000 CHF pure salary.'
        }
      },
      'avantages-nature': {
        title: {
          fr: 'Avantages en nature et fringe benefits',
          de: 'Naturalvorteile und Zusatzleistungen',
          it: 'Benefici in natura e fringe benefits',
          en: 'Benefits in kind and fringe benefits'
        },
        content: {
          fr: 'Les avantages en nature permettent d\'optimiser la rémunération globale. La voiture de fonction est évaluée à 0,8% de la valeur d\'achat neuve par mois, déductible pour l\'entreprise mais imposable chez le dirigeant. Les frais de formation, équipements informatiques et frais de représentation justifiés par l\'activité peuvent être pris en charge sans imposition personnelle. Les plans d\'actionnariat et stock-options offrent des possibilités d\'optimisation, particulièrement dans les start-ups.',
          de: 'Naturalvorteile ermöglichen die Optimierung der Gesamtvergütung. Der Firmenwagen wird mit 0,8% des Neukaufwerts pro Monat bewertet, für das Unternehmen abzugsfähig, aber beim Geschäftsführer steuerpflichtig. Fortbildungskosten, Computerausstattung und durch die Tätigkeit begründete Repräsentationskosten können ohne persönliche Besteuerung übernommen werden. Aktienanteilspläne und Aktienoptionen bieten Optimierungsmöglichkeiten, besonders in Start-ups.',
          it: 'I benefici in natura permettono di ottimizzare la remunerazione globale. L\'auto aziendale è valutata allo 0,8% del valore di acquisto nuovo al mese, deducibile per l\'impresa ma imponibile presso il dirigente. Le spese di formazione, attrezzature informatiche e spese di rappresentanza giustificate dall\'attività possono essere sostenute senza imposizione personale. I piani azionari e le stock option offrono possibilità di ottimizzazione, particolarmente nelle start-up.',
          en: 'Benefits in kind allow optimization of overall compensation. Company car is valued at 0.8% of new purchase value per month, deductible for the company but taxable for the executive. Training costs, computer equipment and representation expenses justified by activity can be covered without personal taxation. Share plans and stock options offer optimization opportunities, particularly in start-ups.'
        },
        keyPoints: {
          fr: 'Voiture de fonction : 0,8% valeur neuve/mois • Frais formation/équipement déductibles • Représentation justifiée par activité • Stock-options imposées à l\'exercice',
          de: 'Firmenwagen: 0,8% Neuwert/Monat • Fortbildungs-/Ausrüstungskosten abzugsfähig • Durch Tätigkeit begründete Repräsentation • Aktienoptionen bei Ausübung besteuert',
          it: 'Auto aziendale: 0,8% valore nuovo/mese • Spese formazione/attrezzatura deducibili • Rappresentanza giustificata da attività • Stock option tassate all\'esercizio',
          en: 'Company car: 0.8% new value/month • Training/equipment costs deductible • Representation justified by activity • Stock options taxed on exercise'
        },
        example: {
          fr: 'Voiture de 50\'000 CHF : avantage imposable de 4\'800 CHF/an chez le dirigeant, déduction de 50\'000 CHF pour l\'entreprise (amortissement + frais).',
          de: 'Auto von 50\'000 CHF: steuerpflichtiger Vorteil von 4\'800 CHF/Jahr beim Geschäftsführer, Abzug von 50\'000 CHF für das Unternehmen (Abschreibung + Kosten).',
          it: 'Auto di 50\'000 CHF: beneficio imponibile di 4\'800 CHF/anno presso il dirigente, detrazione di 50\'000 CHF per l\'impresa (ammortamento + spese).',
          en: 'Car of 50,000 CHF: taxable benefit of 4,800 CHF/year for the executive, deduction of 50,000 CHF for the company (depreciation + costs).'
        }
      },
      'planification-strategique': {
        title: {
          fr: 'Planification stratégique pluriannuelle',
          de: 'Mehrjährige strategische Planung',
          it: 'Pianificazione strategica pluriennale',
          en: 'Multi-year strategic planning'
        },
        content: {
          fr: 'La planification pluriannuelle optimise la rémunération selon les cycles d\'activité. Les années fastes peuvent privilégier les dividendes pour constituer des réserves, les années difficiles maintenir un salaire minimum pour préserver les droits sociaux. La coordination avec la prévoyance professionnelle permet d\'optimiser les rachats LPP et les versements 3e pilier. La perspective de transmission d\'entreprise influence la stratégie : privilégier la croissance en valeur plutôt que les distributions peut être optimal si une cession est envisagée.',
          de: 'Die mehrjährige Planung optimiert die Vergütung entsprechend den Aktivitätszyklen. Erfolgreiche Jahre können Dividenden bevorzugen, um Reserven zu bilden, schwierige Jahre ein Mindestgehalt beibehalten, um Sozialrechte zu wahren. Die Koordination mit der beruflichen Vorsorge ermöglicht die Optimierung von BVG-Einkäufen und 3. Säule-Einzahlungen. Die Perspektive der Unternehmensübertragung beeinflusst die Strategie: Wertsteigern anstatt Ausschüttungen zu bevorzugen kann optimal sein, wenn eine Veräußerung geplant ist.',
          it: 'La pianificazione pluriennale ottimizza la remunerazione secondo i cicli di attività. Gli anni favorevoli possono privilegiare i dividendi per costituire riserve, gli anni difficili mantenere uno stipendio minimo per preservare i diritti sociali. Il coordinamento con la previdenza professionale permette di ottimizzare i riscatti LPP e i versamenti 3° pilastro. La prospettiva di trasmissione d\'impresa influenza la strategia: privilegiare la crescita in valore piuttosto che le distribuzioni può essere ottimale se si prevede una cessione.',
          en: 'Multi-year planning optimizes compensation according to activity cycles. Good years can favor dividends to build reserves, difficult years maintain minimum salary to preserve social rights. Coordination with occupational pension allows optimization of LPP buy-ins and 3rd pillar payments. The prospect of business transmission influences strategy: favoring value growth rather than distributions can be optimal if a sale is planned.'
        },
        keyPoints: {
          fr: 'Adaptation aux cycles d\'activité • Constitution de réserves les bonnes années • Salaire minimum pour droits sociaux • Coordination avec prévoyance professionnelle • Stratégie transmission (croissance vs distribution)',
          de: 'Anpassung an Aktivitätszyklen • Reservenbildung in guten Jahren • Mindestgehalt für Sozialrechte • Koordination mit beruflicher Vorsorge • Übertragungsstrategie (Wachstum vs. Ausschüttung)',
          it: 'Adattamento ai cicli di attività • Costituzione di riserve negli anni buoni • Stipendio minimo per diritti sociali • Coordinamento con previdenza professionale • Strategia trasmissione (crescita vs distribuzione)',
          en: 'Adaptation to activity cycles • Building reserves in good years • Minimum salary for social rights • Coordination with occupational pension • Transmission strategy (growth vs distribution)'
        },
        example: {
          fr: 'Entreprise avec bénéfices irréguliers : salaire stable 80\'000 CHF + dividendes variables (0 à 100\'000 CHF) selon performance, optimisant charges sociales et trésorerie.',
          de: 'Unternehmen mit unregelmäßigen Gewinnen: stabiles Gehalt 80\'000 CHF + variable Dividenden (0 bis 100\'000 CHF) je nach Leistung, optimiert Sozialabgaben und Liquidität.',
          it: 'Impresa con profitti irregolari: stipendio stabile 80\'000 CHF + dividendi variabili (0 a 100\'000 CHF) secondo performance, ottimizzando oneri sociali e liquidità.',
          en: 'Company with irregular profits: stable salary 80,000 CHF + variable dividends (0 to 100,000 CHF) according to performance, optimizing social charges and cash flow.'
        }
      }
    }
  },

  'calendrier-fiscal-suisse': {
    title: {
      fr: 'Calendrier fiscal suisse : délais et échéances',
      de: 'Schweizer Steuerkalender: Fristen und Termine',
      it: 'Calendario fiscale svizzero: scadenze e termini',
      en: 'Swiss tax calendar: deadlines and due dates'
    },
    description: {
      fr: 'Guide complet des délais fiscaux en Suisse : déclarations, acomptes et échéances par canton',
      de: 'Vollständiger Leitfaden zu Steuerfristen in der Schweiz: Erklärungen, Akonto und kantonale Termine',
      it: 'Guida completa alle scadenze fiscali in Svizzera: dichiarazioni, acconti e termini per cantone',
      en: 'Complete guide to tax deadlines in Switzerland: declarations, advance payments and cantonal deadlines'
    },
    content: {
      fr: 'Le calendrier fiscal suisse est complexe en raison de la structure fédéraliste du pays. Chaque canton fixe ses propres délais de déclaration, mais certaines échéances fédérales s\'appliquent uniformément. Une bonne connaissance de ces délais est essentielle pour éviter les pénalités et optimiser sa planification fiscale.',
      de: 'Der Schweizer Steuerkalender ist aufgrund der föderalistischen Struktur des Landes komplex. Jeder Kanton legt seine eigenen Erklärungsfristen fest, aber bestimmte Bundesfristen gelten einheitlich. Eine gute Kenntnis dieser Fristen ist wichtig, um Strafen zu vermeiden und die Steuerplanung zu optimieren.',
      it: 'Il calendario fiscale svizzero è complesso a causa della struttura federalista del paese. Ogni cantone fissa i propri termini di dichiarazione, ma certe scadenze federali si applicano uniformemente. Una buona conoscenza di questi termini è essenziale per evitare penalità e ottimizzare la pianificazione fiscale.',
      en: 'The Swiss tax calendar is complex due to the country\'s federalist structure. Each canton sets its own declaration deadlines, but certain federal deadlines apply uniformly. Good knowledge of these deadlines is essential to avoid penalties and optimize tax planning.'
    },
    sections: {
      'delais-federaux': {
        title: {
          fr: 'Délais fédéraux uniformes',
          de: 'Einheitliche Bundesfristen',
          it: 'Termini federali uniformi',
          en: 'Uniform federal deadlines'
        },
        content: {
          fr: 'L\'impôt fédéral direct suit un calendrier uniforme dans toute la Suisse. La déclaration d\'impôt doit être remise avant le 31 mars de l\'année suivant la période fiscale, avec possibilité de prolongation jusqu\'au 30 septembre sur demande motivée. Les acomptes provisionnels sont dus par tiers : 31 mars, 30 juin et 30 septembre. La TVA suit ses propres échéances : déclarations trimestrielles au 20 du mois suivant le trimestre, semestrielles au 20 juillet et 20 janvier.',
          de: 'Die direkte Bundessteuer folgt einem einheitlichen Kalender in der ganzen Schweiz. Die Steuererklärung muss vor dem 31. März des auf die Steuerperiode folgenden Jahres eingereicht werden, mit Verlängerungsmöglichkeit bis 30. September auf begründeten Antrag. Die provisorischen Akonto sind in Dritteln fällig: 31. März, 30. Juni und 30. September. Die MWST folgt eigenen Terminen: Quartalserklärungen bis 20. des Folgemonats, halbjährliche bis 20. Juli und 20. Januar.',
          it: 'L\'imposta federale diretta segue un calendario uniforme in tutta la Svizzera. La dichiarazione d\'imposta deve essere consegnata entro il 31 marzo dell\'anno seguente il periodo fiscale, con possibilità di proroga fino al 30 settembre su richiesta motivata. Gli acconti provvisori sono dovuti per terzi: 31 marzo, 30 giugno e 30 settembre. L\'IVA segue le proprie scadenze: dichiarazioni trimestrali entro il 20 del mese seguente il trimestre, semestrali entro il 20 luglio e 20 gennaio.',
          en: 'Direct federal tax follows a uniform calendar throughout Switzerland. Tax returns must be filed before March 31st of the year following the tax period, with possible extension until September 30th upon justified request. Provisional advance payments are due in thirds: March 31st, June 30th and September 30th. VAT follows its own deadlines: quarterly returns by the 20th of the month following the quarter, semi-annual by July 20th and January 20th.'
        },
        keyPoints: {
          fr: 'Déclaration IFD : 31 mars (prolongation 30 septembre) • Acomptes IFD : 31/3, 30/6, 30/9 • TVA trimestrielle : 20 du mois suivant • TVA semestrielle : 20 juillet, 20 janvier',
          de: 'DBG-Erklärung: 31. März (Verlängerung 30. September) • DBG-Akonto: 31/3, 30/6, 30/9 • MWST quartalsweise: 20. Folgemonat • MWST halbjährlich: 20. Juli, 20. Januar',
          it: 'Dichiarazione IFD: 31 marzo (proroga 30 settembre) • Acconti IFD: 31/3, 30/6, 30/9 • IVA trimestrale: 20 del mese seguente • IVA semestrale: 20 luglio, 20 gennaio',
          en: 'Direct federal tax return: March 31st (extension September 30th) • Federal tax advance payments: 31/3, 30/6, 30/9 • Quarterly VAT: 20th of following month • Semi-annual VAT: July 20th, January 20th'
        },
        example: {
          fr: 'Pour l\'année fiscale 2024 : déclaration due le 31 mars 2025, acomptes 2025 dus les 31 mars, 30 juin et 30 septembre 2025.',
          de: 'Für das Steuerjahr 2024: Erklärung fällig am 31. März 2025, Akonto 2025 fällig am 31. März, 30. Juni und 30. September 2025.',
          it: 'Per l\'anno fiscale 2024: dichiarazione dovuta il 31 marzo 2025, acconti 2025 dovuti il 31 marzo, 30 giugno e 30 settembre 2025.',
          en: 'For tax year 2024: return due March 31st 2025, 2025 advance payments due March 31st, June 30th and September 30th 2025.'
        }
      },
      'delais-cantonaux': {
        title: {
          fr: 'Délais cantonaux variables',
          de: 'Variable Kantonsfristen',
          it: 'Termini cantonali variabili',
          en: 'Variable cantonal deadlines'
        },
        content: {
          fr: 'Les délais cantonaux varient considérablement. La plupart des cantons alignent leur délai sur le fédéral (31 mars), mais certains diffèrent : Genève au 31 janvier, Vaud au 15 mars, Ticino au 31 mars avec possibilité de prolongation automatique. Les acomptes cantonaux suivent généralement le rythme fédéral mais certains cantons demandent des versements mensuels ou adoptent d\'autres modalités. Il est crucial de vérifier les spécificités de son canton de domicile.',
          de: 'Die Kantonsfristen variieren erheblich. Die meisten Kantone richten ihre Frist nach dem Bund aus (31. März), aber einige weichen ab: Genf am 31. Januar, Waadt am 15. März, Tessin am 31. März mit automatischer Verlängerungsmöglichkeit. Die Kantonskontos folgen meist dem Bundesrhythmus, aber einige Kantone verlangen monatliche Zahlungen oder andere Modalitäten. Es ist wichtig, die Besonderheiten des Wohnkantons zu prüfen.',
          it: 'I termini cantonali variano considerevolmente. La maggior parte dei cantoni allinea il proprio termine al federale (31 marzo), ma alcuni differiscono: Ginevra al 31 gennaio, Vaud al 15 marzo, Ticino al 31 marzo con possibilità di proroga automatica. Gli acconti cantonali seguono generalmente il ritmo federale ma alcuni cantoni richiedono versamenti mensili o adottano altre modalità. È cruciale verificare le specificità del proprio cantone di domicilio.',
          en: 'Cantonal deadlines vary considerably. Most cantons align their deadline with the federal one (March 31st), but some differ: Geneva on January 31st, Vaud on March 15th, Ticino on March 31st with automatic extension possibility. Cantonal advance payments generally follow the federal rhythm but some cantons require monthly payments or adopt other modalities. It is crucial to check the specificities of one\'s canton of residence.'
        },
        keyPoints: {
          fr: 'Majorité des cantons : 31 mars • Genève : 31 janvier • Vaud : 15 mars • Ticino : 31 mars + prolongation auto • Acomptes variables par canton',
          de: 'Mehrheit der Kantone: 31. März • Genf: 31. Januar • Waadt: 15. März • Tessin: 31. März + Auto-Verlängerung • Akonto variabel je Kanton',
          it: 'Maggioranza dei cantoni: 31 marzo • Ginevra: 31 gennaio • Vaud: 15 marzo • Ticino: 31 marzo + proroga auto • Acconti variabili per cantone',
          en: 'Majority of cantons: March 31st • Geneva: January 31st • Vaud: March 15th • Ticino: March 31st + auto extension • Variable advance payments by canton'
        },
        example: {
          fr: 'Un résident genevois doit remettre sa déclaration 2024 avant le 31 janvier 2025, soit 2 mois plus tôt que dans la plupart des autres cantons.',
          de: 'Ein Genfer Einwohner muss seine Erklärung 2024 vor dem 31. Januar 2025 einreichen, also 2 Monate früher als in den meisten anderen Kantonen.',
          it: 'Un residente ginevrino deve consegnare la sua dichiarazione 2024 entro il 31 gennaio 2025, cioè 2 mesi prima rispetto alla maggior parte degli altri cantoni.',
          en: 'A Geneva resident must file their 2024 return before January 31st 2025, 2 months earlier than in most other cantons.'
        }
      },
      'planning-annuel': {
        title: {
          fr: 'Planification fiscale annuelle',
          de: 'Jährliche Steuerplanung',
          it: 'Pianificazione fiscale annuale',
          en: 'Annual tax planning'
        },
        content: {
          fr: 'Une bonne planification fiscale utilise le calendrier pour optimiser sa situation. Les versements au 3e pilier doivent être effectués avant le 31 décembre pour être déductibles l\'année en cours. Les rachats LPP peuvent être planifiés en fin d\'année pour maximiser l\'effet fiscal. Les plus-values immobilières bénéficient d\'exemptions selon la durée de détention : prévoir les ventes en conséquence. La coordination des revenus et charges permet d\'étaler la progression fiscale sur plusieurs années.',
          de: 'Eine gute Steuerplanung nutzt den Kalender zur Optimierung der Situation. Einzahlungen in die 3. Säule müssen vor dem 31. Dezember erfolgen, um im laufenden Jahr abzugsfähig zu sein. BVG-Einkäufe können am Jahresende geplant werden, um die steuerliche Wirkung zu maximieren. Immobiliengewinne profitieren von Befreiungen je nach Besitzdauer: Verkäufe entsprechend planen. Die Koordination von Einkommen und Kosten ermöglicht es, die Steuerprogression über mehrere Jahre zu verteilen.',
          it: 'Una buona pianificazione fiscale utilizza il calendario per ottimizzare la situazione. I versamenti al 3° pilastro devono essere effettuati entro il 31 dicembre per essere deducibili nell\'anno in corso. I riscatti LPP possono essere pianificati a fine anno per massimizzare l\'effetto fiscale. Le plusvalenze immobiliari beneficiano di esenzioni secondo la durata di detenzione: prevedere le vendite di conseguenza. Il coordinamento di redditi e spese permette di distribuire la progressione fiscale su più anni.',
          en: 'Good tax planning uses the calendar to optimize one\'s situation. 3rd pillar payments must be made before December 31st to be deductible in the current year. LPP buy-ins can be planned at year-end to maximize tax effect. Real estate capital gains benefit from exemptions according to holding period: plan sales accordingly. Coordination of income and expenses allows spreading tax progression over several years.'
        },
        keyPoints: {
          fr: '3e pilier : avant 31 décembre • Rachats LPP : planification fin d\'année • Plus-values immobilières : durée de détention • Étalement revenus/charges sur plusieurs années',
          de: '3. Säule: vor 31. Dezember • BVG-Einkäufe: Jahresendplanung • Immobiliengewinne: Besitzdauer • Verteilung Einkommen/Kosten über mehrere Jahre',
          it: '3° pilastro: entro 31 dicembre • Riscatti LPP: pianificazione fine anno • Plusvalenze immobiliari: durata detenzione • Distribuzione redditi/spese su più anni',
          en: '3rd pillar: before December 31st • LPP buy-ins: year-end planning • Real estate capital gains: holding period • Distribution of income/expenses over several years'
        },
        example: {
          fr: 'Reporter un bonus de décembre à janvier peut faire économiser plusieurs milliers de francs d\'impôts grâce à l\'étalement de la progression.',
          de: 'Einen Dezember-Bonus auf Januar zu verschieben kann mehrere tausend Franken Steuern durch Verteilung der Progression sparen.',
          it: 'Rinviare un bonus da dicembre a gennaio può far risparmiare diverse migliaia di franchi di tasse grazie alla distribuzione della progressione.',
          en: 'Deferring a December bonus to January can save several thousand francs in taxes through progression distribution.'
        }
      }
    }
  }
};

// Fonction pour obtenir une traduction d'article
export function getTranslatedArticle(slug: string, locale: 'fr' | 'de' | 'it' | 'en'): Article | null {
  const baseArticle = getArticleBySlug(slug);
  if (!baseArticle) return null;
  
  const translation = articleTranslations[slug];
  if (!translation) return baseArticle; // Retourne l'article original si pas de traduction
  
  // Applique les traductions
  const translatedArticle: Article = {
    ...baseArticle,
    title: translation.title[locale] || baseArticle.title,
    description: translation.description[locale] || baseArticle.description,
    content: translation.content[locale] || baseArticle.content,
    sections: baseArticle.sections.map(section => {
      const sectionTranslation = translation.sections[section.id];
      if (!sectionTranslation) return section;
      
      return {
        ...section,
        title: sectionTranslation.title[locale] || section.title,
        content: sectionTranslation.content[locale] || section.content,
        keyPoints: sectionTranslation.keyPoints?.[locale]?.split('\n') || section.keyPoints,
        example: sectionTranslation.example?.[locale] || section.example
      };
    })
  };
  
  return translatedArticle;
}