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