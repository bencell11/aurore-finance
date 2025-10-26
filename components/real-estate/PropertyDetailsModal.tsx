'use client';

import { Property } from '@/lib/types/real-estate';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Home,
  Calendar,
  ExternalLink,
  Sparkles,
  Database,
  Building2,
  DoorOpen
} from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property | null;
  open: boolean;
  onClose: () => void;
}

export function PropertyDetailsModal({
  property,
  open,
  onClose
}: PropertyDetailsModalProps) {
  if (!property) return null;

  const isAIGenerated = property.source === 'ai-generated';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{property.title}</DialogTitle>
              {property.address && (
                <DialogDescription className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  {property.address.street && `${property.address.street}, `}
                  {property.address.city}, {property.address.canton}
                </DialogDescription>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {property.price.toLocaleString()} CHF
                {property.transactionType === 'rent' && <span className="text-lg">/mois</span>}
              </div>
              {property.charges && property.transactionType === 'rent' && (
                <div className="text-sm text-gray-500 mt-1">
                  + {property.charges} CHF charges
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Image placeholder */}
          <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <Home className="h-24 w-24 text-gray-400" />
          </div>

          {/* Caractéristiques principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Bed className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-500">Pièces</div>
                <div className="font-semibold">{property.rooms}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Square className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-500">Surface</div>
                <div className="font-semibold">{property.surface} m²</div>
              </div>
            </div>
            {property.floor !== undefined && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Building2 className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-500">Étage</div>
                  <div className="font-semibold">{property.floor}</div>
                </div>
              </div>
            )}
            {property.yearBuilt && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-500">Année</div>
                  <div className="font-semibold">{property.yearBuilt}</div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Équipements */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Équipements</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Informations complémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {property.pricePerSqm && (
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Prix au m²: <strong>{property.pricePerSqm} CHF/m²</strong>
                </span>
              </div>
            )}
            {property.availability && (
              <div className="flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Disponibilité: <strong>{property.availability}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Source et avertissement */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              {isAIGenerated ? (
                <>
                  <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-purple-900">Offre générée par IA</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Cette annonce est fictive et générée par intelligence artificielle à des fins d'illustration.
                      Pour voir des offres réelles, activez la connexion aux plateformes immobilières.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Database className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-green-900">
                      Offre réelle - {property.source === 'immoscout24' ? 'ImmoScout24' :
                                      property.source === 'homegate' ? 'Homegate' :
                                      property.source === 'comparis' ? 'Comparis' : 'Source externe'}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Cette annonce provient d'une plateforme immobilière suisse.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bouton d'action */}
          <div className="flex gap-3">
            {!isAIGenerated && property.sourceUrl ? (
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                size="lg"
              >
                <a href={property.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir l'offre sur {property.source === 'immoscout24' ? 'ImmoScout24' :
                                    property.source === 'homegate' ? 'Homegate' :
                                    property.source === 'comparis' ? 'Comparis' : 'la source'}
                </a>
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Offre fictive - Pas de lien disponible
              </Button>
            )}
            <Button variant="outline" onClick={onClose} size="lg">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
