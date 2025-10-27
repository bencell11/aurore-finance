'use client';

import { Property } from '@/lib/types/real-estate';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Euro,
  Square,
  Bed,
  X,
  CheckCircle2,
  XCircle,
  Calendar,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface PropertyComparatorProps {
  properties: Property[];
  open: boolean;
  onClose: () => void;
  onRemoveProperty: (id: string) => void;
}

export function PropertyComparator({
  properties,
  open,
  onClose,
  onRemoveProperty
}: PropertyComparatorProps) {
  if (properties.length === 0) return null;

  // Trouver les min/max pour la comparaison
  const prices = properties.map(p => p.price);
  const surfaces = properties.map(p => p.surface);
  const pricesPerSqm = properties.map(p => p.pricePerSqm || 0);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minSurface = Math.min(...surfaces);
  const maxSurface = Math.max(...surfaces);
  const minPricePerSqm = Math.min(...pricesPerSqm.filter(p => p > 0));

  const getBestValueIcon = (value: number, min: number, max: number, lowerIsBetter = true) => {
    if (value === min && lowerIsBetter) return <TrendingDown className="h-4 w-4 text-green-600" />;
    if (value === max && !lowerIsBetter) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value === max && lowerIsBetter) return <TrendingUp className="h-4 w-4 text-red-600" />;
    if (value === min && !lowerIsBetter) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Comparaison de {properties.length} propriété{properties.length > 1 ? 's' : ''}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-4 bg-gray-50 font-semibold sticky left-0 z-10">
                  Critère
                </th>
                {properties.map((property) => (
                  <th key={property.id} className="p-4 bg-gray-50 min-w-[250px]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-sm mb-1 line-clamp-2">
                          {property.title}
                        </div>
                        {property.address && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.address.city}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveProperty(property.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Prix */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-gray-500" />
                    Prix
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    <div className="flex items-center gap-2">
                      {getBestValueIcon(property.price, minPrice, maxPrice, true)}
                      <div>
                        <div className="font-semibold text-blue-600">
                          {property.price.toLocaleString()} CHF
                          {property.transactionType === 'rent' && '/mois'}
                        </div>
                        {property.charges && (
                          <div className="text-xs text-gray-500">
                            + {property.charges} CHF charges
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Surface */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-gray-500" />
                    Surface
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    <div className="flex items-center gap-2">
                      {getBestValueIcon(property.surface, minSurface, maxSurface, false)}
                      <span className="font-semibold">{property.surface} m²</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Prix au m² */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-gray-500" />
                    Prix au m²
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    <div className="flex items-center gap-2">
                      {property.pricePerSqm && getBestValueIcon(property.pricePerSqm, minPricePerSqm, Math.max(...pricesPerSqm), true)}
                      <span className={property.pricePerSqm === minPricePerSqm ? 'font-semibold text-green-600' : ''}>
                        {property.pricePerSqm ? `${property.pricePerSqm} CHF/m²` : '-'}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Pièces */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-gray-500" />
                    Pièces
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    <span className="font-semibold">{property.rooms}</span>
                  </td>
                ))}
              </tr>

              {/* Étage */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    Étage
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    {property.floor !== undefined ? (
                      <span>{property.floor}/{property.totalFloors || '?'}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Année */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Année construction
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    {property.yearBuilt || <span className="text-gray-400">-</span>}
                  </td>
                ))}
              </tr>

              {/* Équipements */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium sticky left-0 bg-white z-10 align-top">
                  Équipements
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    {property.features && property.features.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {property.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Aucun</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Disponibilité */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium sticky left-0 bg-white z-10">
                  Disponibilité
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    {property.availability ? (
                      <Badge variant={property.availability === 'Immediate' ? 'default' : 'secondary'}>
                        {property.availability}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Score d'affordabilité */}
              {properties.some(p => p.affordabilityScore !== undefined) && (
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium sticky left-0 bg-white z-10">
                    Affordabilité
                  </td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-4">
                      {property.affordabilityScore !== undefined ? (
                        <div className="flex items-center gap-2">
                          {property.affordabilityScore >= 80 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : property.affordabilityScore >= 60 ? (
                            <Minus className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={
                            property.affordabilityScore >= 80 ? 'text-green-600 font-semibold' :
                            property.affordabilityScore >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }>
                            {property.affordabilityScore}/100
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
