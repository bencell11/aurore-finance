'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Filter,
  MapPin,
  Home,
  Euro,
  Bed,
  Square,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface PropertyFiltersState {
  transactionType?: 'rent' | 'buy' | 'all';
  propertyType?: 'apartment' | 'house' | 'studio' | 'all';
  canton?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  roomsMin?: number;
  roomsMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  radiusKm?: number;
}

interface PropertyFiltersProps {
  filters: PropertyFiltersState;
  onFiltersChange: (filters: PropertyFiltersState) => void;
  onReset: () => void;
  activeFiltersCount?: number;
}

const SWISS_CANTONS = [
  'Genève', 'Vaud', 'Valais', 'Neuchâtel', 'Fribourg', 'Jura',
  'Bern', 'Zürich', 'Basel-Stadt', 'Basel-Landschaft', 'Aargau',
  'Solothurn', 'Luzern', 'Uri', 'Schwyz', 'Obwalden', 'Nidwalden',
  'Glarus', 'Zug', 'Schaffhausen', 'Appenzell Ausserrhoden',
  'Appenzell Innerrhoden', 'St. Gallen', 'Graubünden', 'Thurgau', 'Ticino'
];

const MAJOR_CITIES = [
  'Genève', 'Lausanne', 'Zürich', 'Bern', 'Basel', 'Winterthur',
  'Luzern', 'St. Gallen', 'Lugano', 'Biel', 'Thun', 'Fribourg',
  'La Chaux-de-Fonds', 'Schaffhausen', 'Chur', 'Neuchâtel',
  'Yverdon-les-Bains', 'Sion', 'Montreux', 'Vevey', 'Nyon',
  'Morges', 'Renens', 'Ecublens'
];

export function PropertyFilters({
  filters,
  onFiltersChange,
  onReset,
  activeFiltersCount = 0
}: PropertyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof PropertyFiltersState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Card className="mb-6">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Filtres avancés</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Type de transaction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Type de transaction
              </Label>
              <Select
                value={filters.transactionType || 'all'}
                onValueChange={(v) => updateFilter('transactionType', v === 'all' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="rent">Location</SelectItem>
                  <SelectItem value="buy">Achat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Type de bien
              </Label>
              <Select
                value={filters.propertyType || 'all'}
                onValueChange={(v) => updateFilter('propertyType', v === 'all' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="apartment">Appartement</SelectItem>
                  <SelectItem value="house">Maison</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Localisation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Canton
              </Label>
              <Select
                value={filters.canton || 'all'}
                onValueChange={(v) => updateFilter('canton', v === 'all' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les cantons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les cantons</SelectItem>
                  {SWISS_CANTONS.map(canton => (
                    <SelectItem key={canton} value={canton}>{canton}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ville
              </Label>
              <Select
                value={filters.city || 'all'}
                onValueChange={(v) => updateFilter('city', v === 'all' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {MAJOR_CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rayon de recherche */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Rayon de recherche: {filters.radiusKm || 50} km
            </Label>
            <Slider
              value={[filters.radiusKm || 50]}
              onValueChange={(v) => updateFilter('radiusKm', v[0])}
              min={5}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5 km</span>
              <span>50 km</span>
              <span>100 km</span>
            </div>
          </div>

          {/* Prix */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Euro className="h-4 w-4" />
              Prix (CHF)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ''}
                onChange={(e) => updateFilter('priceMin', parseInt(e.target.value) || undefined)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ''}
                onChange={(e) => updateFilter('priceMax', parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>

          {/* Pièces */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              Nombre de pièces
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={filters.roomsMin || ''}
                onChange={(e) => updateFilter('roomsMin', parseFloat(e.target.value) || undefined)}
                step="0.5"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.roomsMax || ''}
                onChange={(e) => updateFilter('roomsMax', parseFloat(e.target.value) || undefined)}
                step="0.5"
              />
            </div>
          </div>

          {/* Surface */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Square className="h-4 w-4" />
              Surface (m²)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={filters.surfaceMin || ''}
                onChange={(e) => updateFilter('surfaceMin', parseInt(e.target.value) || undefined)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.surfaceMax || ''}
                onChange={(e) => updateFilter('surfaceMax', parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
