import { CaliforniaLocation, calculateLocationDistance, CALIFORNIA_LOCATIONS } from '@/data/CaliforniaLocations';

/**
 * Discovery System - Manages fog of war for California wasteland
 */

export const DISCOVERY_RADIUS = 40; // miles
export const PLAYER_OUTPOST_ID = 'player-outpost';

/**
 * Get all locations visible to the player based on discovery rules
 */
export const getVisibleLocations = (
  discoveredLocationIds: string[]
): CaliforniaLocation[] => {
  const playerOutpost = CALIFORNIA_LOCATIONS.find(loc => loc.id === PLAYER_OUTPOST_ID);
  
  if (!playerOutpost) {
    console.error('Player outpost not found!');
    return CALIFORNIA_LOCATIONS;
  }

  return CALIFORNIA_LOCATIONS.filter(location => {
    // Player outpost is always visible
    if (location.id === PLAYER_OUTPOST_ID) return true;
    
    // Previously discovered locations are always visible
    if (discoveredLocationIds.includes(location.id)) return true;
    
    // Locations within discovery radius are visible
    const distance = calculateLocationDistance(playerOutpost, location);
    return distance <= DISCOVERY_RADIUS;
  });
};

/**
 * Check if a location should be visible on the map
 */
export const isLocationVisible = (
  locationId: string,
  discoveredLocationIds: string[]
): boolean => {
  if (locationId === PLAYER_OUTPOST_ID) return true;
  if (discoveredLocationIds.includes(locationId)) return true;
  
  const playerOutpost = CALIFORNIA_LOCATIONS.find(loc => loc.id === PLAYER_OUTPOST_ID);
  const targetLocation = CALIFORNIA_LOCATIONS.find(loc => loc.id === locationId);
  
  if (!playerOutpost || !targetLocation) return false;
  
  const distance = calculateLocationDistance(playerOutpost, targetLocation);
  return distance <= DISCOVERY_RADIUS;
};

/**
 * Get locations that should start as discovered
 */
export const getInitialDiscoveredLocations = (): string[] => {
  const playerOutpost = CALIFORNIA_LOCATIONS.find(loc => loc.id === PLAYER_OUTPOST_ID);
  
  if (!playerOutpost) return [PLAYER_OUTPOST_ID];
  
  // Include player outpost and all locations within discovery radius
  const discovered = CALIFORNIA_LOCATIONS
    .filter(location => {
      if (location.id === PLAYER_OUTPOST_ID) return true;
      const distance = calculateLocationDistance(playerOutpost, location);
      return distance <= DISCOVERY_RADIUS;
    })
    .map(loc => loc.id);
  
  return discovered;
};

/**
 * Discover a location (add to discovered list)
 */
export const discoverLocation = (
  currentDiscovered: string[],
  locationId: string
): string[] => {
  if (currentDiscovered.includes(locationId)) return currentDiscovered;
  return [...currentDiscovered, locationId];
};

/**
 * Get undiscovered locations within range
 */
export const getUndiscoveredInRange = (
  discoveredLocationIds: string[],
  range: number = DISCOVERY_RADIUS
): CaliforniaLocation[] => {
  const playerOutpost = CALIFORNIA_LOCATIONS.find(loc => loc.id === PLAYER_OUTPOST_ID);
  
  if (!playerOutpost) return [];
  
  return CALIFORNIA_LOCATIONS.filter(location => {
    if (discoveredLocationIds.includes(location.id)) return false;
    const distance = calculateLocationDistance(playerOutpost, location);
    return distance <= range;
  });
};
