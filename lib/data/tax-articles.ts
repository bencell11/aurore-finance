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
  return articles.filter(article => article.category === category);
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