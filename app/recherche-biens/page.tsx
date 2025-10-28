'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyFilters, PropertyFiltersState } from '@/components/real-estate/PropertyFilters';
import { PropertyDetailsModal } from '@/components/real-estate/PropertyDetailsModal';
import { PropertyComparator } from '@/components/real-estate/PropertyComparator';
import { MortgageSimulatorModal } from '@/components/real-estate/MortgageSimulatorModal';
import { FavoritesService } from '@/lib/services/real-estate/favorites.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Zap,
  Map as MapIcon,
  List,
  GitCompare,
  Heart
} from 'lucide-react';
import type { Property } from '@/lib/types/real-estate';

// Import dynamique du composant carte pour éviter SSR
const PropertyMapView = dynamic(
  () => import('@/components/real-estate/PropertyMapView'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center space-y-3">
          <MapPin className="h-12 w-12 mx-auto text-gray-300 animate-pulse" />
          <p className="text-gray-500">Chargement de la carte...</p>
        </div>
      </div>
    )
  }
);

export default function RealEstateSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [affordability, setAffordability] = useState<any>(null);
  const [searchStrategy, setSearchStrategy] = useState<'real-only' | 'ai-only' | 'hybrid' | null>(null);
  const [sources, setSources] = useState<{ real: number; ai: number; total: number } | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState<PropertyFiltersState>({
    radiusKm: 50
  });

  // Comparateur et favoris
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [comparatorOpen, setComparatorOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mortgageSimulatorOpen, setMortgageSimulatorOpen] = useState(false);
  const [mortgageProperty, setMortgageProperty] = useState<Property | null>(null);

  /**
   * Charger les favoris au montage du composant
   * Note: Table Supabase real_estate_favorites pas encore créée, utilise localStorage pour l'instant
   */
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoriteIds = await FavoritesService.getFavoriteIds();
        setFavorites(favoriteIds);
      } catch (error) {
        console.log('[Recherche-Biens] Favoris non disponibles, utilisation localStorage uniquement');
        setFavorites([]);
      }
    };
    loadFavorites();
  }, []);

  /**
   * Filtrer les propriétés côté client selon les filtres actifs
   */
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Filtre par type de transaction
    if (filters.transactionType && filters.transactionType !== 'all') {
      filtered = filtered.filter(p => p.transactionType === filters.transactionType);
    }

    // Filtre par type de propriété
    if (filters.propertyType && filters.propertyType !== 'all') {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }

    // Filtre par canton
    if (filters.canton) {
      filtered = filtered.filter(p => p.address?.canton === filters.canton);
    }

    // Filtre par ville
    if (filters.city) {
      filtered = filtered.filter(p => p.address?.city === filters.city);
    }

    // Filtre par prix
    if (filters.priceMin !== undefined && filters.priceMin > 0) {
      filtered = filtered.filter(p => p.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined && filters.priceMax > 0) {
      filtered = filtered.filter(p => p.price <= filters.priceMax!);
    }

    // Filtre par nombre de pièces
    if (filters.roomsMin !== undefined && filters.roomsMin > 0) {
      filtered = filtered.filter(p => p.rooms >= filters.roomsMin!);
    }
    if (filters.roomsMax !== undefined && filters.roomsMax > 0) {
      filtered = filtered.filter(p => p.rooms <= filters.roomsMax!);
    }

    // Filtre par surface
    if (filters.surfaceMin !== undefined && filters.surfaceMin > 0) {
      filtered = filtered.filter(p => p.surface >= filters.surfaceMin!);
    }
    if (filters.surfaceMax !== undefined && filters.surfaceMax > 0) {
      filtered = filtered.filter(p => p.surface <= filters.surfaceMax!);
    }

    return filtered;
  }, [properties, filters]);

  /**
   * Compter les filtres actifs
   */
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.transactionType && filters.transactionType !== 'all') count++;
    if (filters.propertyType && filters.propertyType !== 'all') count++;
    if (filters.canton) count++;
    if (filters.city) count++;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.roomsMin) count++;
    if (filters.roomsMax) count++;
    if (filters.surfaceMin) count++;
    if (filters.surfaceMax) count++;
    return count;
  }, [filters]);

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    setFilters({ radiusKm: 50 });
  };

  /**
   * Ouvrir les détails d'une propriété
   */
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setSelectedPropertyId(property.id);
    setDetailsModalOpen(true);
  };

  /**
   * Ajouter/retirer une propriété du comparateur
   */
  const toggleCompare = (property: Property, event?: React.MouseEvent) => {
    event?.stopPropagation(); // Empêcher l'ouverture des détails
    const isInList = compareList.some(p => p.id === property.id);
    if (isInList) {
      setCompareList(compareList.filter(p => p.id !== property.id));
    } else {
      if (compareList.length >= 4) {
        alert('Vous pouvez comparer maximum 4 propriétés');
        return;
      }
      setCompareList([...compareList, property]);
    }
  };

  /**
   * Ajouter/retirer des favoris
   */
  const toggleFavorite = async (property: Property, event?: React.MouseEvent) => {
    event?.stopPropagation();
    const isFavorite = favorites.includes(property.id);

    if (isFavorite) {
      // Retirer des favoris
      const success = await FavoritesService.removeFavorite(property.id);
      if (success) {
        setFavorites(favorites.filter(id => id !== property.id));
      }
    } else {
      // Ajouter aux favoris
      const success = await FavoritesService.addFavorite(property);
      if (success) {
        setFavorites([...favorites, property.id]);
      }
    }
  };

  /**
   * Ouvrir le simulateur de crédit
   */
  const openMortgageSimulator = (property: Property, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setMortgageProperty(property);
    setMortgageSimulatorOpen(true);
  };

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
          userIncome: monthlyIncome > 0 ? monthlyIncome : undefined,
          useCache: false // TEMPORAIRE: désactivé pour éviter l'ancien cache
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

      {/* Filtres avancés */}
      <PropertyFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        activeFiltersCount={activeFiltersCount}
      />

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
              {filteredProperties.length} {filteredProperties.length === 1 ? 'résultat trouvé' : 'résultats trouvés'}
              {filteredProperties.length !== properties.length && (
                <span className="text-base text-gray-500 ml-2">
                  (sur {properties.length} total{properties.length > 1 ? 'aux' : ''})
                </span>
              )}
            </h2>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Bouton Comparateur */}
              {compareList.length > 0 && (
                <Button
                  onClick={() => setComparatorOpen(true)}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <GitCompare className="h-4 w-4 mr-2" />
                  Comparer ({compareList.length})
                </Button>
              )}

              {/* Bouton Favoris */}
              {favorites.length > 0 && (
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    const favProps = properties.filter(p => favorites.includes(p.id));
                    setCompareList(favProps.slice(0, 4));
                    setComparatorOpen(true);
                  }}
                >
                  <Heart className="h-4 w-4 mr-2 fill-red-600" />
                  Favoris ({favorites.length})
                </Button>
              )}

              {/* Onglets Vue Liste / Carte */}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'map')} className="w-auto">
                <TabsList>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Liste
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <MapIcon className="h-4 w-4" />
                    Carte
                  </TabsTrigger>
                </TabsList>
              </Tabs>

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
          </div>

          {/* Vue Carte */}
          {viewMode === 'map' && (
            <div className="w-full">
              <PropertyMapView
                properties={filteredProperties}
                selectedPropertyId={selectedPropertyId || undefined}
                onPropertyClick={(property) => {
                  setSelectedPropertyId(property.id);
                  // Scroll vers la propriété dans la liste (optionnel)
                }}
              />
            </div>
          )}

          {/* Vue Liste */}
          {viewMode === 'list' && filteredProperties.map((property) => (
            <Card
              key={property.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                selectedPropertyId === property.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handlePropertyClick(property)}
            >
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
                        {property.address && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{property.address.city}, {property.address.canton}</span>
                          </div>
                        )}
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

                    {/* Boutons d'actions */}
                    <div className="space-y-2 pt-3 border-t">
                      {/* Bouton simulateur de crédit */}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => openMortgageSimulator(property, e)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Simuler un crédit
                      </Button>

                      {/* Boutons secondaires */}
                      <div className="flex gap-2">
                        <Button
                          variant={compareList.some(p => p.id === property.id) ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => toggleCompare(property, e)}
                          className="flex-1"
                        >
                          <GitCompare className="h-4 w-4 mr-2" />
                          {compareList.some(p => p.id === property.id) ? 'En comparaison' : 'Comparer'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => toggleFavorite(property, e)}
                          className={favorites.includes(property.id) ? 'border-red-600 text-red-600' : ''}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(property.id) ? 'fill-red-600' : ''}`} />
                        </Button>
                      </div>
                    </div>
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

      {/* Modale de détails */}
      <PropertyDetailsModal
        property={selectedProperty}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedProperty(null);
        }}
      />

      {/* Comparateur de propriétés */}
      <PropertyComparator
        properties={compareList}
        open={comparatorOpen}
        onClose={() => setComparatorOpen(false)}
        onRemoveProperty={(id) => setCompareList(compareList.filter(p => p.id !== id))}
      />

      {/* Simulateur de crédit hypothécaire */}
      <MortgageSimulatorModal
        property={mortgageProperty}
        open={mortgageSimulatorOpen}
        onClose={() => {
          setMortgageSimulatorOpen(false);
          setMortgageProperty(null);
        }}
      />
    </div>
  );
}
