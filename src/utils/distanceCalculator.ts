/**
 * Distance calculator using Google Maps
 * Opens Google Maps in a new tab for manual distance calculation
 */

export interface GeocodingResult {
  lat: number;
  lng: number;
}

/**
 * Opens Google Maps with directions between two addresses
 * Returns a promise that resolves immediately (user will manually enter distance)
 */
export const calculateDistanceWithGoogleMaps = (
  origin: string,
  destination: string
): void => {
  // Validate inputs
  if (!origin.trim() || !destination.trim()) {
    throw new Error('Both origin and destination addresses are required');
  }

  // Encode addresses for URL
  const encodedOrigin = encodeURIComponent(origin.trim());
  const encodedDestination = encodeURIComponent(destination.trim());
  
  // Create Google Maps URL with directions
  const googleMapsUrl = `https://www.google.it/maps/dir/${encodedOrigin}/${encodedDestination}`;
  
  // Open Google Maps in a new tab
  window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Main function to calculate distance between two addresses
 * Opens Google Maps and throws an error with instructions
 */
export const calculateDistance = async (
  origin: string,
  destination: string
): Promise<number> => {
  // Open Google Maps
  calculateDistanceWithGoogleMaps(origin, destination);
  
  // Throw an error with instructions for the user
  throw new Error(
    'Google Maps è stato aperto in una nuova scheda. Segui questi passaggi:\n\n' +
    '1. Verifica che il percorso mostrato sia corretto\n' +
    '2. Trova la distanza in chilometri (km) sotto il tempo di percorrenza\n' +
    '3. Torna a questa pagina e inserisci manualmente la distanza nel campo "Distanza (km)"\n' +
    '4. Se ci sono più percorsi, scegli quello che intendi utilizzare per il rimborso'
  );
};

/**
 * Legacy function for backward compatibility
 */
export const calculateDistanceWithCoords = async (
  origin: string,
  destination: string
): Promise<any> => {
  // For backward compatibility, just call the main function
  return calculateDistance(origin, destination);
};

/**
 * Geocode a single address (not implemented for Google Maps approach)
 */
export const geocodeAddressPublic = async (address: string): Promise<GeocodingResult> => {
  throw new Error('Geocoding not available with Google Maps approach');
};

/**
 * Test function (not applicable for Google Maps approach)
 */
export const testApiConnection = async (): Promise<boolean> => {
  return true; // Always return true since we're using Google Maps
};