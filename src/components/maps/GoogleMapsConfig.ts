// Google Maps configuration and utilities
export const MOJAVE_MAP_CENTER = {
  lat: 36.1699, // Approximate center of Mojave Desert
  lng: -115.1398
};

export const MOJAVE_MAP_BOUNDS = {
  north: 37.5,
  south: 34.8,
  east: -114.0,
  west: -117.0
};

// Convert percentage coordinates to actual lat/lng within Mojave bounds
export const percentageToLatLng = (x: number, y: number) => {
  const lat = MOJAVE_MAP_BOUNDS.south + (MOJAVE_MAP_BOUNDS.north - MOJAVE_MAP_BOUNDS.south) * (y / 100);
  const lng = MOJAVE_MAP_BOUNDS.west + (MOJAVE_MAP_BOUNDS.east - MOJAVE_MAP_BOUNDS.west) * (x / 100);
  return { lat, lng };
};

// Enhanced locations with real world coordinates (approximate Fallout: New Vegas locations)
export const ENHANCED_MOJAVE_LOCATIONS = [
  {
    id: 'shady-sands',
    name: 'Shady Sands',
    displayName: 'Shady Sands Settlement',
    coordinates: { lat: 36.2, lng: -115.5 }, // Real coordinates in Mojave
    dangerLevel: 1,
    type: 'settlement' as const,
    description: 'Main NCR settlement and safe haven'
  },
  {
    id: 'goodsprings',
    name: 'Goodsprings',
    displayName: 'Goodsprings Township',
    coordinates: { lat: 35.8, lng: -115.4 },
    dangerLevel: 2,
    type: 'settlement' as const,
    description: 'Small mining town in the foothills'
  },
  {
    id: 'primm',
    name: 'Primm',
    displayName: 'Primm Township',
    coordinates: { lat: 35.6, lng: -115.3 },
    dangerLevel: 3,
    type: 'settlement' as const,
    description: 'Small border town with casino'
  },
  {
    id: 'novac',
    name: 'Novac',
    displayName: 'Novac Motel',
    coordinates: { lat: 36.4, lng: -114.8 },
    dangerLevel: 4,
    type: 'outpost' as const,
    description: 'Motel settlement with dinosaur statue'
  },
  {
    id: 'quarry-junction',
    name: 'Quarry Junction',
    displayName: 'Quarry Junction',
    coordinates: { lat: 36.3, lng: -115.6 },
    dangerLevel: 9,
    type: 'ruins' as const,
    description: 'Deathclaw-infested mining quarry - EXTREMELY DANGEROUS'
  },
  {
    id: 'deathclaw-promontory',
    name: 'Deathclaw Promontory',
    displayName: 'Deathclaw Promontory',
    coordinates: { lat: 36.7, lng: -114.5 },
    dangerLevel: 10,
    type: 'landmark' as const,
    description: 'Rocky outcrop home to alpha deathclaws'
  },
  {
    id: 'ncrcf',
    name: 'NCRCF',
    displayName: 'NCR Correctional Facility',
    coordinates: { lat: 35.7, lng: -115.2 },
    dangerLevel: 6,
    type: 'facility' as const,
    description: 'Former prison controlled by Powder Gangers'
  },
  {
    id: 'helios-one',
    name: 'HELIOS One',
    displayName: 'HELIOS One Solar Plant',
    coordinates: { lat: 36.0, lng: -114.9 },
    dangerLevel: 5,
    type: 'facility' as const,
    description: 'Pre-war solar power facility under NCR control'
  },
  {
    id: 'hidden-valley',
    name: 'Hidden Valley',
    displayName: 'Hidden Valley Bunker',
    coordinates: { lat: 35.9, lng: -115.0 },
    dangerLevel: 7,
    type: 'facility' as const,
    description: 'Brotherhood of Steel bunker complex'
  }
];

export const getLocationByIdEnhanced = (id: string) => {
  return ENHANCED_MOJAVE_LOCATIONS.find(loc => loc.id === id);
};

export const getMarkerIcon = (locationType: string, dangerLevel: number, isSelected: boolean = false): google.maps.Icon => {
  let color = '#3B82F6'; // Default blue
  
  if (isSelected) {
    color = '#FCD34D'; // Yellow when selected
  } else if (dangerLevel >= 8) {
    color = '#EF4444'; // Red for high danger
  } else if (dangerLevel >= 5) {
    color = '#F97316'; // Orange for medium danger
  } else if (dangerLevel >= 3) {
    color = '#EAB308'; // Yellow for low-medium danger
  } else {
    color = '#22C55E'; // Green for safe areas
  }

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="12" cy="9" r="2.5" fill="#fff"/>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(16, 32)
  };
};

export const getBaseIcon = (): google.maps.Icon => ({
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#22C55E" stroke="#fff" stroke-width="2"/>
      <path d="m2 17 10 5 10-5" stroke="#22C55E" stroke-width="2"/>
      <path d="m2 12 10 5 10-5" stroke="#22C55E" stroke-width="2"/>
    </svg>
  `)}`,
  scaledSize: new google.maps.Size(36, 36),
  anchor: new google.maps.Point(18, 36)
});

export const getSquadIcon = (phase: string): google.maps.Icon => {
  const color = phase === 'combat' ? '#EF4444' : phase === 'setup' ? '#F97316' : '#3B82F6';
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="${color}" stroke="#fff" stroke-width="2"/>
        <path d="M12 6v6l4 2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(24, 24),
    anchor: new google.maps.Point(12, 12)
  };
};