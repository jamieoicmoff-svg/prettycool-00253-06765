// Legacy compatibility - redirect to new lore-accurate locations
export { 
  FALLOUT_LOCATIONS as MOJAVE_LOCATIONS,
  getFalloutLocationById as getLocationById,
  calculateLoreTravelTime as calculateTravelTime
} from './FalloutLocations';

// Mojave Wasteland locations based on Fallout lore

// Note: This file now redirects to the new lore-accurate FalloutLocations.ts
// All location data has been moved there with proper Fallout lore integration