'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Home, Search, Loader2, MapPin, Euro, Square, Bed,
  AlertCircle, Heart, Map, List, Scale, TrendingUp, Calculator,
  Sparkles, Database, Zap, Bell
} from 'lucide-react';
import type { Property, PropertySearchCriteria } from '@/lib/types/real-estate';
import AdvancedFilters from '@/components/real-estate/AdvancedFilters';
import PropertyComparison from '@/components/real-estate/PropertyComparison';
import MortgageSimulator from '@/components/real-estate/MortgageSimulator';
import { FavoritesService } from '@/lib/services/real-estate/favorites.service';
import { MarketTrendsService } from '@/lib/services/real-estate/market-trends.service';
import { TaxImplicationsService } from '@/lib/services/real-estate/tax-implications.service';
import { useUserProfile } from '@/contexts/UserProfileContext';

// Import dynamique pour éviter SSR issues avec Leaflet
const PropertyMapView = dynamic(
  () => import('@/components/real-estate/PropertyMapView'),
  { ssr: false, loading: () => <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center"><Loader2 className="animate-spin" /></div> }
);

export default function RealEstateSearchV2Page() {
  const { profile, autofillForm, syncFormToProfile } = useUserProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchStrategy, setSearchStrategy] = useState<'real-only' | 'ai-only' | 'hybrid' | null>(null);
  const [sources, setSources] = useState<{ real: number; ai: number; total: number } | null>(null);

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [marketTrends, setMarketTrends] = useState<any>(null);
  const [taxInfo, setTaxInfo] = useState<any>(null);

  // Auto-fill le revenu mensuel depuis le profil
  useEffect(() => {
    if (profile) {
      const data = autofillForm({
        'monthlyIncome': 'revenu_mensuel'
      });

      if (data.monthlyIncome) {
        setMonthlyIncome(data.monthlyIncome as number);
        console.log('[RealEstate] Auto-filled monthly income:', data.monthlyIncome);
      }
    }
  }, [profile, autofillForm]);

  // Charger les favoris au montage
  useEffect(() => {
    const favs = FavoritesService.getFavorites();
    setFavorites(favs.map(f => f.id));
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Veuillez décrire votre recherche');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResponse = await fetch('/api/real-estate/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          userIncome: monthlyIncome > 0 ? monthlyIncome : undefined
        })
      });

      const searchData = await searchResponse.json();
      setProperties(searchData.properties || []);
      setSearchStrategy(searchData.searchStrategy || null);
      setSources(searchData.sources || null);

      // Analyser les tendances du marché
      if (searchData.properties.length > 0) {
        const canton = searchData.properties[0].address.canton;
        const trends = MarketTrendsService.analyzeMarket(searchData.properties, canton);
        setMarketTrends(trends);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (property: Property) => {
    if (favorites.includes(property.id)) {
      FavoritesService.removeFavorite(property.id);
      setFavorites(favorites.filter(id => id !== property.id));
    } else {
      FavoritesService.addFavorite(property);
      setFavorites([...favorites, property.id]);
    }
  };

  const toggleComparison = (property: Property) => {
    if (comparisonProperties.find(p => p.id === property.id)) {
      setComparisonProperties(comparisonProperties.filter(p => p.id !== property.id));
    } else if (comparisonProperties.length < 4) {
      setComparisonProperties([...comparisonProperties, property]);
    }
  };

  const handleFilterChange = (filters: PropertySearchCriteria) => {
    let filtered = [...properties];

    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }

    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin!);
    }

    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax!);
    }

    if (filters.roomsMin) {
      filtered = filtered.filter(p => p.rooms >= filters.roomsMin!);
    }

    if (filters.surfaceMin) {
      filtered = filtered.filter(p => p.surface >= filters.surfaceMin!);
    }

    setFilteredProperties(filtered);
  };

  const getAffordabilityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-700';
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Recherche Immobilière Avancée</h1>
        <p className="text-gray-600">Trouvez votre propriété idéale avec l'IA et les données réelles</p>
      </div>

      {/* Barre de recherche */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>Décrivez votre recherche</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Appartement 3.5 pièces à Genève..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Revenu mensuel (optionnel)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 8000"
                  value={monthlyIncome || ''}
                  onChange={async (e) => {
                    const value = parseInt(e.target.value) || 0;
                    setMonthlyIncome(value);

                    // Sauvegarder automatiquement dans le profil
                    if (value > 0) {
                      await syncFormToProfile(
                        { monthlyIncome: value },
                        { 'monthlyIncome': 'revenu_mensuel' }
                      );
                    }
                  }}
                />
                {profile?.revenu_mensuel && (
                  <p className="text-xs text-gray-500 mt-1">
                    ✓ Pré-rempli depuis votre profil
                  </p>
                )}
              </div>

              <div className="pt-6">
                <AdvancedFilters onFilterChange={handleFilterChange} />
              </div>
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

      {/* Résultats */}
      {filteredProperties.length > 0 && (
        <div className="space-y-6">
          {/* En-tête des résultats */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-bold">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'résultat' : 'résultats'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {searchStrategy === 'real-only' && (
                  <Badge className="bg-green-100 text-green-700">
                    <Database className="h-3 w-3 mr-1" />
                    Données réelles
                  </Badge>
                )}
                {searchStrategy === 'ai-only' && (
                  <Badge className="bg-purple-100 text-purple-700">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Généré par IA
                  </Badge>
                )}
                {searchStrategy === 'hybrid' && (
                  <Badge className="bg-blue-100 text-blue-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Hybride
                  </Badge>
                )}
                {sources && searchStrategy === 'hybrid' && (
                  <span className="text-xs text-gray-500">
                    ({sources.real} réelles, {sources.ai} IA)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-1" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <Map className="h-4 w-4 mr-1" />
                Carte
              </Button>
              {comparisonProperties.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  <Scale className="h-3 w-3 mr-1" />
                  {comparisonProperties.length} à comparer
                </Badge>
              )}
            </div>
          </div>

          {/* Tendances du marché */}
          {marketTrends && (
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>{marketTrends.location}:</strong> Prix médian {marketTrends.medianPrice.toLocaleString()} CHF
                • {marketTrends.pricePerSqm.toLocaleString()} CHF/m²
                • {marketTrends.trend === 'up' ? '📈' : marketTrends.trend === 'down' ? '📉' : '➡️'}
                {' '}{marketTrends.priceChange > 0 ? '+' : ''}{marketTrends.priceChange.toFixed(1)}% sur l'année
              </AlertDescription>
            </Alert>
          )}

          {/* Vue liste ou carte */}
          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold">{property.title}</h3>
                              {property.source === 'ai-generated' ? (
                                <Badge variant="outline" className="text-xs bg-purple-50">
                                  <Sparkles className="h-2.5 w-2.5 mr-1" />IA
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-green-50">
                                  <Database className="h-2.5 w-2.5 mr-1" />
                                  {property.source}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {property.address.city}, {property.address.canton}
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(property)}
                            >
                              <Heart className={`h-4 w-4 ${favorites.includes(property.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleComparison(property)}
                              disabled={comparisonProperties.length >= 4 && !comparisonProperties.find(p => p.id === property.id)}
                            >
                              <Scale className={`h-4 w-4 ${comparisonProperties.find(p => p.id === property.id) ? 'text-blue-600' : ''}`} />
                            </Button>
                          </div>
                        </div>

                        <div className="text-2xl font-bold text-blue-600">
                          {property.price.toLocaleString()} CHF
                          {property.transactionType === 'rent' && <span className="text-sm">/mois</span>}
                        </div>

                        <div className="flex gap-3 text-sm">
                          <span>{property.rooms} pièces</span>
                          <span>•</span>
                          <span>{property.surface} m²</span>
                          {property.pricePerSqm && (
                            <>
                              <span>•</span>
                              <span>{property.pricePerSqm} CHF/m²</span>
                            </>
                          )}
                        </div>

                        {property.affordabilityScore !== undefined && (
                          <Badge className={getAffordabilityColor(property.affordabilityScore)}>
                            Affordabilité: {property.affordabilityScore}/100
                          </Badge>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProperty(property)}
                          className="w-full mt-2"
                        >
                          Voir les détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-[600px] rounded-lg overflow-hidden border">
              <PropertyMapView
                properties={filteredProperties}
                onPropertyClick={(p) => setSelectedProperty(p)}
                selectedPropertyId={selectedProperty?.id}
              />
            </div>
          )}
        </div>
      )}

      {/* Détails de propriété sélectionnée */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProperty(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{selectedProperty.title}</h2>
                  <p className="text-gray-600">{selectedProperty.address.city}, {selectedProperty.address.canton}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedProperty(null)}>✕</Button>
              </div>

              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="mortgage">Crédit</TabsTrigger>
                  <TabsTrigger value="tax">Fiscalité</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <p>{selectedProperty.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Prix:</strong> {selectedProperty.price.toLocaleString()} CHF</div>
                    <div><strong>Pièces:</strong> {selectedProperty.rooms}</div>
                    <div><strong>Surface:</strong> {selectedProperty.surface} m²</div>
                    <div><strong>Prix/m²:</strong> {selectedProperty.pricePerSqm?.toLocaleString()} CHF</div>
                  </div>
                </TabsContent>

                <TabsContent value="mortgage">
                  <MortgageSimulator
                    propertyPrice={selectedProperty.price}
                    transactionType={selectedProperty.transactionType}
                    monthlyIncome={monthlyIncome}
                  />
                </TabsContent>

                <TabsContent value="tax">
                  <div className="space-y-4">
                    {(() => {
                      const tax = TaxImplicationsService.calculateTaxImplications({
                        propertyPrice: selectedProperty.price,
                        canton: selectedProperty.address.canton,
                        city: selectedProperty.address.city,
                        isMainResidence: true
                      });
                      return (
                        <div className="space-y-3">
                          <div className="p-4 bg-blue-50 rounded">
                            <strong>Impôt foncier annuel:</strong> {Math.round(tax.annualPropertyTax).toLocaleString()} CHF
                          </div>
                          <div className="p-4 bg-green-50 rounded">
                            <strong>Déductions possibles:</strong> {Math.round(tax.deductions).toLocaleString()} CHF/an
                          </div>
                          <div className="space-y-2">
                            {tax.recommendations.map((rec, idx) => (
                              <Alert key={idx}><AlertDescription>{rec}</AlertDescription></Alert>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {/* Comparateur */}
      <PropertyComparison
        properties={comparisonProperties}
        onRemoveProperty={(id) => setComparisonProperties(comparisonProperties.filter(p => p.id !== id))}
      />
    </div>
  );
}
