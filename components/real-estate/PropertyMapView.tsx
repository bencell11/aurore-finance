'use client';

import { useEffect, useRef } from 'react';
import type { Property } from '@/lib/types/real-estate';

interface PropertyMapViewProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  selectedPropertyId?: string;
  center?: [number, number];
  zoom?: number;
}

export default function PropertyMapView({
  properties,
  onPropertyClick,
  selectedPropertyId,
  center = [46.8182, 8.2275], // Centre de la Suisse
  zoom = 8
}: PropertyMapViewProps) {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Import dynamique pour éviter les problèmes SSR
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Fix pour les icônes Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Créer la map si elle n'existe pas
      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current).setView(center, zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      // Nettoyer les anciens markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      if (!mapInstanceRef.current) return;

      // Ajouter les nouveaux markers
      const bounds: any[] = [];

      properties.forEach(property => {
        if (!property.address.coordinates) return;

        const { lat, lng } = property.address.coordinates;
        bounds.push([lat, lng]);

        // Créer l'icône selon le type et la source
        let iconHtml = '';
        const isSelected = property.id === selectedPropertyId;
        const isReal = property.source !== 'ai-generated';

        if (isReal) {
          iconHtml = `<div style="
            background: ${isSelected ? '#10b981' : '#22c55e'};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <span style="transform: rotate(45deg); color: white; font-size: 14px; font-weight: bold;">
              ${property.price >= 1000000 ? '★' : '●'}
            </span>
          </div>`;
        } else {
          iconHtml = `<div style="
            background: ${isSelected ? '#8b5cf6' : '#a855f7'};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <span style="transform: rotate(45deg); color: white; font-size: 14px;">✨</span>
          </div>`;
        }

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });

        const marker = L.marker([lat, lng], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">${property.title}</h3>
              <p style="margin: 4px 0;"><strong>${property.price.toLocaleString()} CHF${property.transactionType === 'rent' ? '/mois' : ''}</strong></p>
              <p style="margin: 4px 0; color: #666;">${property.rooms} pièces • ${property.surface} m²</p>
              <p style="margin: 4px 0; color: #666;">${property.address.city}, ${property.address.canton}</p>
              ${isReal ? '<p style="margin: 4px 0; color: #10b981; font-size: 12px;">✓ Données réelles</p>' : '<p style="margin: 4px 0; color: #a855f7; font-size: 12px;">✨ Généré par IA</p>'}
            </div>
          `);

        if (onPropertyClick) {
          marker.on('click', () => onPropertyClick(property));
        }

        markersRef.current.push(marker);
      });

      // Ajuster la vue pour montrer tous les markers
      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties, selectedPropertyId, center, zoom, onPropertyClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: '400px' }} />

      {/* Légende */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="text-sm font-bold mb-2">Légende</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            <span>Données réelles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
            <span>Généré par IA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">★</span>
            <span>Prix ≥ 1M CHF</span>
          </div>
        </div>
      </div>

      {/* Styles CSS pour Leaflet */}
      <style jsx global>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }

        .custom-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
