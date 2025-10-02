'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Eye, 
  Hash, 
  Info,
  ExternalLink,
  ChevronRight,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Link as LinkIcon
} from 'lucide-react';
import { articles, Article } from '@/lib/data/tax-articles';

// Composant pour les termes cliquables
function TaxTerm({ term, children }: { term: string; children: React.ReactNode }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
  
  // Trouver l'article correspondant au terme
  const relatedArticle = articles.find(a => 
    a.title.toLowerCase().includes(term.toLowerCase()) ||
    a.keywords?.includes(term.toLowerCase())
  );

  const handleClick = () => {
    if (relatedArticle) {
      router.push(`/education-fiscale/articles/${relatedArticle.slug}`);
    }
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        className={`border-b-2 border-dotted border-blue-400 text-blue-600 cursor-pointer hover:bg-blue-50 px-1 rounded transition-colors ${
          relatedArticle ? 'font-medium' : ''
        }`}
        onClick={handleClick}
      >
        {children}
      </span>
      {showTooltip && relatedArticle && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white border rounded-lg shadow-lg">
          <div className="text-sm">
            <p className="font-semibold text-gray-900 mb-1">{relatedArticle.title}</p>
            <p className="text-gray-600 text-xs">{relatedArticle.description}</p>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-white"></div>
          </div>
        </div>
      )}
    </span>
  );
}

// Fonction pour parser le contenu et remplacer les termes par des liens
function parseContent(content: string) {
  // Liste des termes importants à transformer en liens
  const importantTerms = [
    'impôt fédéral direct', 'IFD', 'LIFD',
    'harmonisation fiscale', 'LHID',
    'TVA', 'taxe sur la valeur ajoutée',
    'impôt anticipé', 'IA',
    'droits de timbre',
    'souveraineté fiscale', 'souveraineté cantonale',
    'barème progressif', 'progressivité',
    'taux marginal', 'taux effectif',
    'capacité contributive',
    'domicile fiscal', 'résidence fiscale',
    'période fiscale', 'année fiscale',
    'déclaration d\'impôt', 'taxation',
    'AVS', 'AI', 'LPP',
    '3e pilier', 'prévoyance',
    'fortune', 'revenus',
    'déductions', 'charges déductibles',
    'double imposition', 'CDI',
    'frontalier', 'quasi-résident'
  ];

  // Pour simplifier, on retourne le contenu avec les composants React
  // Dans une vraie implémentation, on utiliserait un parser plus sophistiqué
  return content;
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [readingTime, setReadingTime] = useState(5);

  useEffect(() => {
    // Charger l'article depuis les données
    const foundArticle = articles.find(a => a.slug === params.slug);
    if (foundArticle) {
      setArticle(foundArticle);
      
      // Trouver les articles liés
      const related = articles.filter(a => 
        a.category === foundArticle.category && 
        a.slug !== foundArticle.slug
      ).slice(0, 4);
      setRelatedArticles(related);
      
      // Calculer le temps de lecture
      const wordCount = foundArticle.content.split(' ').length;
      setReadingTime(Math.ceil(wordCount / 200));
    }
  }, [params.slug]);

  if (!article) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Article non trouvé</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* En-tête avec breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/education-fiscale">Centre d'Éducation</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/education-fiscale#themes">{article.category}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-gray-900 font-medium">{article.title}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Article principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{article.category}</Badge>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {readingTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.views || 0} vues
                    </span>
                  </div>
                </div>
                <CardTitle className="text-3xl">{article.title}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {article.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                {article.sections.map((section, idx) => (
                  <div key={idx} className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Hash className="h-5 w-5 text-blue-600" />
                      {section.title}
                    </h2>
                    
                    {/* Contenu avec termes cliquables */}
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      {section.content.split('\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>
                          {/* Ici on pourrait parser et remplacer les termes importants */}
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Points clés */}
                    {section.keyPoints && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                          Points clés à retenir
                        </h3>
                        <ul className="space-y-2">
                          {section.keyPoints.map((point, kIdx) => (
                            <li key={kIdx} className="flex items-start gap-2">
                              <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Exemple pratique */}
                    {section.example && (
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Exemple pratique
                        </h3>
                        <p className="text-sm text-gray-700">{section.example}</p>
                      </div>
                    )}

                    {/* Attention / Avertissement */}
                    {section.warning && (
                      <Alert className="mt-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{section.warning}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}

                {/* Section des liens et références */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-purple-600" />
                    Pour aller plus loin
                  </h3>
                  
                  {/* Concepts liés */}
                  {article.relatedConcepts && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Concepts connexes :</h4>
                      <div className="flex flex-wrap gap-2">
                        {article.relatedConcepts.map((concept, idx) => (
                          <Link
                            key={idx}
                            href={`/education-fiscale/articles/${concept.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                          >
                            {concept.title}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Références légales */}
                  {article.legalReferences && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Bases légales :</h4>
                      <ul className="space-y-2">
                        {article.legalReferences.map((ref, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {ref.title}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation entre articles */}
            <div className="mt-6 flex justify-between">
              {article.previousArticle && (
                <Link href={`/education-fiscale/articles/${article.previousArticle.slug}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {article.previousArticle.title}
                  </Button>
                </Link>
              )}
              {article.nextArticle && (
                <Link href={`/education-fiscale/articles/${article.nextArticle.slug}`}>
                  <Button variant="outline" className="flex items-center gap-2 ml-auto">
                    {article.nextArticle.title}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Table des matières */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Table des matières
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {article.sections.map((section, idx) => (
                    <a
                      key={idx}
                      href={`#${section.id}`}
                      className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded px-2 py-1 transition-colors"
                    >
                      {idx + 1}. {section.title}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Articles connexes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Articles connexes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/education-fiscale/articles/${related.slug}`}
                      className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {related.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info box */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Astuce :</strong> Les termes en bleu sont cliquables et vous mènent vers des articles détaillés.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}