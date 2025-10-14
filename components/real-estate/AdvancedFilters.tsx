'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import type { PropertySearchCriteria, Property } from '@/lib/types/real-estate';

interface AdvancedFiltersProps {
  onFilterChange: (filters: PropertySearchCriteria) => void;
  currentFilters?: PropertySearchCriteria;
}

export default function AdvancedFilters({
  onFilterChange,
  currentFilters
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<PropertySearchCriteria>(currentFilters || {
    transactionType: 'rent',
    propertyType: undefined,
    location: { city: '', canton: '' },
    priceMin: undefined,
    priceMax: undefined,
    roomsMin: undefined,
    roomsMax: undefined,
    surfaceMin: undefined,
    surfaceMax: undefined,
    features: []
  });

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: PropertySearchCriteria = {
      transactionType: 'rent',
      propertyType: undefined,
      location: { city: '', canton: '' },
      priceMin: undefined,
      priceMax: undefined,
      roomsMin: undefined,
      roomsMax: undefined,
      surfaceMin: undefined,
      surfaceMax: undefined,
      features: []
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const countActiveFilters = () => {
    let count = 0;
    if (filters.propertyType) count++;
    if (filters.location?.city) count++;
    if (filters.location?.canton) count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.roomsMin || filters.roomsMax) count++;
    if (filters.surfaceMin || filters.surfaceMax) count++;
    if (filters.features && filters.features.length > 0) count++;
    return count;
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = filters.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    setFilters({ ...filters, features: newFeatures });
  };

  const commonFeatures = [
    'Balcon',
    'Terrasse',
    'Jardin',
    'Garage',
    'Parking',
    'Ascenseur',
    'Cave',
    'Lave-vaisselle',
    'Lave-linge',
    'Cheminée',
    'Vue',
    'Animaux acceptés'
  ];

  const cantons = [
    'AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR',
    'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG',
    'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="relative"
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filtres avancés
        {countActiveFilters() > 0 && (
          <Badge variant="default" className="ml-2 bg-blue-500">
            {countActiveFilters()}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <SlidersHorizontal className="h-5 w-5" />
            Filtres avancés
            {countActiveFilters() > 0 && (
              <Badge variant="default" className="bg-blue-500">
                {countActiveFilters()} actifs
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Type de transaction */}
        <div className="space-y-2">
          <Label>Type de transaction</Label>
          <div className="flex gap-2">
            <Button
              variant={filters.transactionType === 'rent' ? 'default' : 'outline'}
              onClick={() => setFilters({ ...filters, transactionType: 'rent' })}
              className="flex-1"
            >
              Location
            </Button>
            <Button
              variant={filters.transactionType === 'buy' ? 'default' : 'outline'}
              onClick={() => setFilters({ ...filters, transactionType: 'buy' })}
              className="flex-1"
            >
              Achat
            </Button>
          </div>
        </div>

        {/* Type de bien */}
        <div className="space-y-2">
          <Label>Type de bien</Label>
          <Select
            value={filters.propertyType || ''}
            onValueChange={(value) => setFilters({ ...filters, propertyType: value as Property['propertyType'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="apartment">Appartement</SelectItem>
              <SelectItem value="house">Maison</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="land">Terrain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Localisation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ville</Label>
            <Input
              placeholder="Ex: Genève, Lausanne..."
              value={filters.location?.city || ''}
              onChange={(e) => setFilters({
                ...filters,
                location: { ...filters.location, city: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Canton</Label>
            <Select
              value={filters.location?.canton || ''}
              onValueChange={(value) => setFilters({
                ...filters,
                location: { ...filters.location, canton: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les cantons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les cantons</SelectItem>
                {cantons.map(canton => (
                  <SelectItem key={canton} value={canton}>{canton}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Prix */}
        <div className="space-y-2">
          <Label>Prix ({filters.transactionType === 'rent' ? 'CHF/mois' : 'CHF'})</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ''}
                onChange={(e) => setFilters({ ...filters, priceMin: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ''}
                onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) || undefined })}
              />
            </div>
          </div>
        </div>

        {/* Nombre de pièces */}
        <div className="space-y-2">
          <Label>Nombre de pièces</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input
                type="number"
                placeholder="Min"
                step="0.5"
                value={filters.roomsMin || ''}
                onChange={(e) => setFilters({ ...filters, roomsMin: parseFloat(e.target.value) || undefined })}
              />
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                placeholder="Max"
                step="0.5"
                value={filters.roomsMax || ''}
                onChange={(e) => setFilters({ ...filters, roomsMax: parseFloat(e.target.value) || undefined })}
              />
            </div>
          </div>
        </div>

        {/* Surface */}
        <div className="space-y-2">
          <Label>Surface (m²)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input
                type="number"
                placeholder="Min"
                value={filters.surfaceMin || ''}
                onChange={(e) => setFilters({ ...filters, surfaceMin: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                placeholder="Max"
                value={filters.surfaceMax || ''}
                onChange={(e) => setFilters({ ...filters, surfaceMax: parseInt(e.target.value) || undefined })}
              />
            </div>
          </div>
        </div>

        {/* Équipements */}
        <div className="space-y-2">
          <Label>Équipements souhaités</Label>
          <div className="flex flex-wrap gap-2">
            {commonFeatures.map(feature => (
              <Badge
                key={feature}
                variant={filters.features?.includes(feature) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleFeature(feature)}
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1"
          >
            Appliquer les filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
