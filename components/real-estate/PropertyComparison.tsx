'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Scale,
  X,
  Home,
  MapPin,
  Euro,
  Square,
  Bed,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';
import type { Property } from '@/lib/types/real-estate';

interface PropertyComparisonProps {
  properties: Property[];
  onRemoveProperty?: (propertyId: string) => void;
}

export default function PropertyComparison({
  properties,
  onRemoveProperty
}: PropertyComparisonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (properties.length === 0) return null;

  const getFeatureIcon = (hasFeature: boolean) => {
    return hasFeature
      ? <CheckCircle2 className="h-4 w-4 text-green-600" />
      : <XCircle className="h-4 w-4 text-gray-300" />;
  };

  // Collecter toutes les features uniques
  const allFeatures = Array.from(
    new Set(properties.flatMap(p => p.features || []))
  ).sort();

  return (
    <>
      {/* Bouton flottant */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          >
            <Scale className="h-5 w-5 mr-2" />
            Comparer ({properties.length})
          </Button>
        </div>
      )}

      {/* Dialog de comparaison */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Comparaison de {properties.length} propriétés
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left font-semibold border-b sticky left-0 bg-gray-50 z-10">
                    Critère
                  </th>
                  {properties.map((property, idx) => (
                    <th key={property.id} className="p-3 border-b min-w-[250px]">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-left">
                          <h4 className="font-semibold text-sm">{property.title}</h4>
                          <p className="text-xs text-gray-500">{property.address.city}</p>
                        </div>
                        {onRemoveProperty && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveProperty(property.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Source */}
                <tr className="border-b">
                  <td className="p-3 font-medium sticky left-0 bg-white">Source</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      {p.source === 'ai-generated' ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          IA
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {p.source === 'immoscout24' && 'ImmoScout24'}
                          {p.source === 'homegate' && 'Homegate'}
                          {p.source === 'comparis' && 'Comparis'}
                        </Badge>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Prix */}
                <tr className="border-b bg-blue-50">
                  <td className="p-3 font-medium sticky left-0 bg-blue-50">
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4" />
                      Prix
                    </div>
                  </td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      <div className="font-bold text-lg text-blue-600">
                        {p.price.toLocaleString()} CHF
                        {p.transactionType === 'rent' && <span className="text-sm">/mois</span>}
                      </div>
                      {p.charges && (
                        <div className="text-xs text-gray-500">
                          + {p.charges} CHF charges
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Type de transaction */}
                <tr className="border-b">
                  <td className="p-3 font-medium sticky left-0 bg-white">Type</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      <Badge variant="secondary">
                        {p.transactionType === 'rent' ? 'Location' : 'Achat'}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Type de bien */}
                <tr className="border-b">
                  <td className="p-3 font-medium sticky left-0 bg-white">Type de bien</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3 capitalize">
                      {p.propertyType === 'apartment' && 'Appartement'}
                      {p.propertyType === 'house' && 'Maison'}
                      {p.propertyType === 'studio' && 'Studio'}
                      {p.propertyType === 'commercial' && 'Commercial'}
                      {p.propertyType === 'land' && 'Terrain'}
                    </td>
                  ))}
                </tr>

                {/* Pièces */}
                <tr className="border-b">
                  <td className="p-3 font-medium sticky left-0 bg-white">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4" />
                      Pièces
                    </div>
                  </td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3 font-semibold">
                      {p.rooms} pièces
                    </td>
                  ))}
                </tr>

                {/* Surface */}
                <tr className="border-b">
                  <td className="p-3 font-medium sticky left-0 bg-white">
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Surface
                    </div>
                  </td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3 font-semibold">
                      {p.surface} m²
                    </td>
                  ))}
                </tr>

                {/* Prix au m² */}
                <tr className="border-b">
                  <td className="p-3 font-medium sticky left-0 bg-white">Prix au m²</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      {p.pricePerSqm
                        ? `${p.pricePerSqm.toLocaleString()} CHF/m²`
                        : 'N/A'
                      }
                    </td>
                  ))}
                </tr>

                {/* Localisation */}
                <tr className="border-b">
                  <td className="p-3 font-medium sticky left-0 bg-white">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localisation
                    </div>
                  </td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      <div className="text-sm">
                        {p.address.street && <div>{p.address.street}</div>}
                        <div>{p.address.postalCode} {p.address.city}</div>
                        <div className="text-gray-500">{p.address.canton}</div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Score d'affordabilité */}
                {properties.some(p => p.affordabilityScore !== undefined) && (
                  <tr className="border-b">
                    <td className="p-3 font-medium sticky left-0 bg-white">
                      Affordabilité
                    </td>
                    {properties.map(p => (
                      <td key={p.id} className="p-3">
                        {p.affordabilityScore !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className={`font-bold ${
                              p.affordabilityScore >= 80 ? 'text-green-600' :
                              p.affordabilityScore >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {p.affordabilityScore}/100
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Équipements */}
                {allFeatures.length > 0 && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={properties.length + 1} className="p-3 font-semibold">
                        Équipements et caractéristiques
                      </td>
                    </tr>
                    {allFeatures.map(feature => (
                      <tr key={feature} className="border-b">
                        <td className="p-3 text-sm sticky left-0 bg-white">
                          {feature}
                        </td>
                        {properties.map(p => (
                          <td key={p.id} className="p-3 text-center">
                            {getFeatureIcon(p.features?.includes(feature) || false)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                {/* Description */}
                <tr className="border-b">
                  <td className="p-3 font-medium sticky left-0 bg-white">Description</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      <div className="text-sm text-gray-600 line-clamp-3">
                        {p.description}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fermer
            </Button>
            <div className="text-sm text-gray-500">
              Sélectionnez jusqu'à 4 propriétés pour comparer
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
