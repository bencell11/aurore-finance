/**
 * Utilitaires pour le clustering de markers sur la carte
 */

import type { Property } from '@/lib/types/real-estate';

export interface ClusteredProperty {
  type: 'single' | 'cluster';
  properties: Property[];
  center: { lat: number; lng: number };
  count: number;
}

/**
 * Groupe les propriétés proches en clusters
 */
export function clusterProperties(
  properties: Property[],
  zoomLevel: number,
  pixelSize: number = 40
): ClusteredProperty[] {
  // Filtrer les propriétés avec coordonnées
  const propertiesWithCoords = properties.filter(
    p => p.address.coordinates?.lat && p.address.coordinates?.lng
  );

  if (propertiesWithCoords.length === 0) return [];

  // Distance de clustering basée sur le zoom
  // Plus le zoom est élevé, moins on groupe
  const clusterDistance = getClusterDistance(zoomLevel, pixelSize);

  const clusters: ClusteredProperty[] = [];
  const processed = new Set<string>();

  for (const property of propertiesWithCoords) {
    if (processed.has(property.id)) continue;

    const coords = property.address.coordinates!;
    const cluster: Property[] = [property];
    processed.add(property.id);

    // Trouver les propriétés à proximité
    for (const other of propertiesWithCoords) {
      if (processed.has(other.id)) continue;

      const otherCoords = other.address.coordinates!;
      const distance = calculateDistance(
        coords.lat,
        coords.lng,
        otherCoords.lat,
        otherCoords.lng
      );

      if (distance < clusterDistance) {
        cluster.push(other);
        processed.add(other.id);
      }
    }

    // Calculer le centre du cluster
    const centerLat = cluster.reduce((sum, p) => sum + p.address.coordinates!.lat, 0) / cluster.length;
    const centerLng = cluster.reduce((sum, p) => sum + p.address.coordinates!.lng, 0) / cluster.length;

    clusters.push({
      type: cluster.length === 1 ? 'single' : 'cluster',
      properties: cluster,
      center: { lat: centerLat, lng: centerLng },
      count: cluster.length
    });
  }

  return clusters;
}

/**
 * Calcule la distance de clustering en fonction du zoom
 */
function getClusterDistance(zoomLevel: number, pixelSize: number): number {
  // Formule approximative pour convertir pixels en km selon le zoom
  // À zoom 10, 1 pixel ≈ 0.5 km
  // À zoom 15, 1 pixel ≈ 0.015 km
  const kmPerPixel = 156543.03392 * Math.cos(0) / Math.pow(2, zoomLevel) / 1000;
  return pixelSize * kmPerPixel;
}

/**
 * Calcule la distance entre deux points GPS (formule de Haversine)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convertit degrés en radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Filtre les propriétés par rayon autour d'un point
 */
export function filterPropertiesByRadius(
  properties: Property[],
  centerLat: number,
  centerLng: number,
  radiusKm: number
): Property[] {
  return properties.filter(property => {
    if (!property.address.coordinates) return false;

    const distance = calculateDistance(
      centerLat,
      centerLng,
      property.address.coordinates.lat,
      property.address.coordinates.lng
    );

    return distance <= radiusKm;
  });
}

/**
 * Trouve le centre géographique d'un ensemble de propriétés
 */
export function findGeographicCenter(properties: Property[]): { lat: number; lng: number } | null {
  const propertiesWithCoords = properties.filter(
    p => p.address.coordinates?.lat && p.address.coordinates?.lng
  );

  if (propertiesWithCoords.length === 0) return null;

  const avgLat = propertiesWithCoords.reduce(
    (sum, p) => sum + p.address.coordinates!.lat,
    0
  ) / propertiesWithCoords.length;

  const avgLng = propertiesWithCoords.reduce(
    (sum, p) => sum + p.address.coordinates!.lng,
    0
  ) / propertiesWithCoords.length;

  return { lat: avgLat, lng: avgLng };
}

/**
 * Calcule la bounding box pour un ensemble de propriétés
 */
export function calculateBounds(properties: Property[]): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} | null {
  const propertiesWithCoords = properties.filter(
    p => p.address.coordinates?.lat && p.address.coordinates?.lng
  );

  if (propertiesWithCoords.length === 0) return null;

  const lats = propertiesWithCoords.map(p => p.address.coordinates!.lat);
  const lngs = propertiesWithCoords.map(p => p.address.coordinates!.lng);

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs)
  };
}
