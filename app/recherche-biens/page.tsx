'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Search,
  Loader2,
  MapPin,
  Euro,
  Square,
  Bed,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calculator,
  Sparkles,
  Database,
  Zap
} from 'lucide-react';
import type { Property } from '@/lib/types/real-estate';

export default function RealEstateSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [affordability, setAffordability] = useState<any>(null);
  const [searchStrategy, setSearchStrategy] = useState<'real-only' | 'ai-only' | 'hybrid' | null>(null);
  const [sources, setSources] = useState<{ real: number; ai: number; total: number } | null>(null);

  /**
   * Recherche de propriétés
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Veuillez décrire votre recherche');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Recherche immobilière
      const searchResponse = await fetch('/api/real-estate/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          userIncome: monthlyIncome > 0 ? monthlyIncome : undefined
        })
      });

      if (!searchResponse.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const searchData = await searchResponse.json();
      setProperties(searchData.properties || []);
      setSearchStrategy(searchData.searchStrategy || null);
      setSources(searchData.sources || null);

      // Calculer l'affordabilité si revenu fourni
      if (monthlyIncome > 0) {
        const affordResponse = await fetch('/api/real-estate/affordability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monthlyIncome,
            hasPartner: false
          })
        });

        if (affordResponse.ok) {
          const affordData = await affordResponse.json();
          setAffordability(affordData.affordability);
        }
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Affiche le score d'affordabilité avec couleur
   */
  const getAffordabilityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-700';
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getAffordabilityIcon = (score?: number) => {
    if (!score) return null;
    if (score >= 80) return <CheckCircle2 className="h-4 w-4" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <div className="container mx-auto p-6 pb-24 md:pb-6 max-w-7xl">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Home className="h-10 w-10" />
          <h1 className="text-3xl font-bold">Recherche Immobilière IA</h1>
        </div>
        <p className="text-blue-100">
          Trouvez votre logement idéal en Suisse avec l'aide de l'intelligence artificielle
        </p>
      </div>

      {/* Recherche */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Que recherchez-vous ?
          </CardTitle>
          <CardDescription>
            Décrivez votre recherche en langage naturel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Votre recherche</Label>
            <Input
              id="search"
              placeholder="Ex: Je cherche un 3.5 pièces à Lausanne, max 2500 CHF/mois"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSearch()}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="income" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Votre revenu mensuel (optionnel)
            </Label>
            <Input
              id="income"
              type="number"
              placeholder="5000"
              value={monthlyIncome || ''}
              onChange={(e) => setMonthlyIncome(parseInt(e.target.value) || 0)}
              className="text-base"
            />
            <p className="text-xs text-gray-500">
              Nous utiliserons votre revenu pour filtrer les biens abordables
            </p>
          </div>

          <Button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recherche en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Rechercher
              </>
            )}
          </Button>

          {/* Exemples rapides */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Exemples rapides:</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSearchQuery("3.5 pièces à Lausanne max 2500 CHF/mois")}
              >
                3.5 pièces Lausanne
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSearchQuery("Appartement à acheter Genève")}
              >
                Achat Genève
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSearchQuery("Maison avec jardin canton de Vaud")}
              >
                Maison avec jardin VD
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Affordabilité */}
      {affordability && (
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calculator className="h-5 w-5" />
              Votre capacité financière
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Location maximum</p>
                <p className="text-2xl font-bold text-green-700">
                  {Math.round(affordability.maxMonthlyRent).toLocaleString()} CHF/mois
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Achat maximum</p>
                <p className="text-2xl font-bold text-blue-700">
                  {Math.round(affordability.maxPropertyPrice).toLocaleString()} CHF
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (avec {Math.round(affordability.downPaymentRequired).toLocaleString()} CHF de fonds propres)
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              {affordability.recommendation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {properties.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-bold">
              {properties.length} {properties.length === 1 ? 'résultat trouvé' : 'résultats trouvés'}
            </h2>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Badge de stratégie de recherche */}
              {searchStrategy === 'real-only' && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Database className="h-3 w-3 mr-1" />
                  Données réelles
                </Badge>
              )}
              {searchStrategy === 'ai-only' && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Généré par IA
                </Badge>
              )}
              {searchStrategy === 'hybrid' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Zap className="h-3 w-3 mr-1" />
                  Hybride (réel + IA)
                </Badge>
              )}

              {/* Détail des sources si hybride */}
              {sources && searchStrategy === 'hybrid' && (
                <span className="text-xs text-gray-500">
                  ({sources.real} réelles, {sources.ai} générées)
                </span>
              )}
            </div>
          </div>

          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image placeholder */}
                  <div className="w-full md:w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Home className="h-16 w-16 text-gray-400" />
                  </div>

                  {/* Détails */}
                  <div className="flex-1 space-y-3">
                    {/* Titre et prix */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">{property.title}</h3>
                          {/* Badge source */}
                          {property.source === 'immoscout24' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                              <Database className="h-2.5 w-2.5 mr-1" />
                              ImmoScout24
                            </Badge>
                          )}
                          {property.source === 'homegate' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                              <Database className="h-2.5 w-2.5 mr-1" />
                              Homegate
                            </Badge>
                          )}
                          {property.source === 'comparis' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                              <Database className="h-2.5 w-2.5 mr-1" />
                              Comparis
                            </Badge>
                          )}
                          {property.source === 'ai-generated' && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                              <Sparkles className="h-2.5 w-2.5 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{property.address.city}, {property.address.canton}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {property.price.toLocaleString()} CHF
                          {property.transactionType === 'rent' && <span className="text-sm">/mois</span>}
                        </p>
                        {property.charges && property.transactionType === 'rent' && (
                          <p className="text-sm text-gray-500">
                            + {property.charges} CHF charges
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Caractéristiques */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <span>{property.rooms} pièces</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4 text-gray-500" />
                        <span>{property.surface} m²</span>
                      </div>
                      {property.pricePerSqm && (
                        <div className="flex items-center gap-1">
                          <Euro className="h-4 w-4 text-gray-500" />
                          <span>{property.pricePerSqm} CHF/m²</span>
                        </div>
                      )}
                      {property.floor !== undefined && (
                        <span className="text-gray-600">
                          Étage {property.floor}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 line-clamp-2">{property.description}</p>

                    {/* Équipements */}
                    {property.features && property.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {property.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Score d'affordabilité */}
                    {property.affordabilityScore !== undefined && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getAffordabilityColor(property.affordabilityScore)}`}>
                          {getAffordabilityIcon(property.affordabilityScore)}
                          <span>
                            {property.affordabilityScore >= 80 ? 'Très abordable' :
                             property.affordabilityScore >= 60 ? 'Abordable' : 'Difficile'}
                          </span>
                          <span className="ml-1">({property.affordabilityScore}/100)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message si aucun résultat */}
      {!loading && properties.length === 0 && searchQuery && (
        <Card>
          <CardContent className="p-12 text-center">
            <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-600">
              Aucun résultat trouvé pour cette recherche
            </p>
          </CardContent>
        </Card>
      )}

      {/* Message initial */}
      {!loading && properties.length === 0 && !searchQuery && (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-16 w-16 mx-auto text-purple-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Recherche immobilière intelligente
            </p>
            <p className="text-gray-600">
              Lancez une recherche pour découvrir des biens immobiliers adaptés à votre budget
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
