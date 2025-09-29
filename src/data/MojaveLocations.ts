// Mojave Wasteland locations based on Fallout lore

export interface MojaveLocation {
  id: string;
  name: string;
  displayName: string;
  type: 'settlement' | 'outpost' | 'ruins' | 'vault' | 'facility' | 'landmark';
  description: string;
  coordinates: { x: number; y: number }; // Percentage based on map
  dangerLevel: number; // 1-10
  travelTimeModifier: number; // Multiplier for base travel time
  terrainType: 'desert' | 'mountains' | 'ruins' | 'valley' | 'highway' | 'underground';
  subTerrain?: string;
  nearbyLandmarks: string[];
  accessRoutes: string[]; // Connected locations
}

export const MOJAVE_LOCATIONS: MojaveLocation[] = [
  // Safe Zones & Settlements
  {
    id: 'shady-sands',
    name: 'Shady Sands',
    displayName: 'Shady Sands Settlement',
    type: 'settlement',
    description: 'Main NCR settlement and safe haven in the Mojave',
    coordinates: { x: 15, y: 65 },
    dangerLevel: 1,
    travelTimeModifier: 0.8,
    terrainType: 'desert',
    nearbyLandmarks: ['Vault 15', 'Radscorpion Caves'],
    accessRoutes: ['Highway 15 North', 'Desert Trail']
  },
  {
    id: 'vault-15',
    name: 'Vault 15',
    displayName: 'Vault 15 Ruins',
    type: 'vault',
    description: 'Abandoned Vault-Tec facility, partially collapsed',
    coordinates: { x: 22, y: 58 },
    dangerLevel: 4,
    travelTimeModifier: 1.3,
    terrainType: 'underground',
    subTerrain: 'tunnel system',
    nearbyLandmarks: ['Shady Sands', 'Raider Territory'],
    accessRoutes: ['Mining Road', 'Vault Access Tunnel']
  },
  {
    id: 'ncrcf',
    name: 'NCRCF',
    displayName: 'NCR Correctional Facility',
    type: 'facility',
    description: 'Former prison now controlled by Powder Gangers',
    coordinates: { x: 35, y: 45 },
    dangerLevel: 6,
    travelTimeModifier: 1.4,
    terrainType: 'desert',
    subTerrain: 'fortified compound',
    nearbyLandmarks: ['Primm', 'Highway 15'],
    accessRoutes: ['Highway 15 South', 'Prison Access Road']
  },

  // Towns & Outposts
  {
    id: 'primm',
    name: 'Primm',
    displayName: 'Primm Township',
    type: 'settlement',
    description: 'Small border town with casino and trading post',
    coordinates: { x: 40, y: 35 },
    dangerLevel: 3,
    travelTimeModifier: 1.1,
    terrainType: 'desert',
    nearbyLandmarks: ['Mojave Express', 'Powder Ganger Territory'],
    accessRoutes: ['Highway 15', 'Trade Route']
  },
  {
    id: 'goodsprings',
    name: 'Goodsprings',
    displayName: 'Goodsprings Township',
    type: 'settlement',
    description: 'Small mining town in the foothills',
    coordinates: { x: 25, y: 25 },
    dangerLevel: 2,
    travelTimeModifier: 1.0,
    terrainType: 'valley',
    nearbyLandmarks: ['Goodsprings Cemetery', 'Powder Ganger Camp'],
    accessRoutes: ['Mountain Road', 'Goodsprings Trail']
  },
  {
    id: 'novac',
    name: 'Novac',
    displayName: 'Novac Motel',
    type: 'outpost',
    description: 'Motel settlement with distinctive dinosaur statue',
    coordinates: { x: 60, y: 50 },
    dangerLevel: 4,
    travelTimeModifier: 1.2,
    terrainType: 'desert',
    nearbyLandmarks: ['REPCONN Facility', 'Highway 95'],
    accessRoutes: ['Highway 95', 'Desert Highway']
  },

  // Dangerous Areas
  {
    id: 'quarry-junction',
    name: 'Quarry Junction',
    displayName: 'Quarry Junction',
    type: 'ruins',
    description: 'Deathclaw-infested mining quarry - EXTREMELY DANGEROUS',
    coordinates: { x: 30, y: 70 },
    dangerLevel: 9,
    travelTimeModifier: 2.0,
    terrainType: 'ruins',
    subTerrain: 'mining complex',
    nearbyLandmarks: ['Sloan', 'Deathclaw Territory'],
    accessRoutes: ['Highway 15 Detour', 'Mining Access Road']
  },
  {
    id: 'deathclaw-promontory',
    name: 'Deathclaw Promontory',
    displayName: 'Deathclaw Promontory',
    type: 'landmark',
    description: 'Rocky outcrop home to alpha deathclaws',
    coordinates: { x: 85, y: 70 },
    dangerLevel: 10,
    travelTimeModifier: 2.5,
    terrainType: 'mountains',
    subTerrain: 'rocky cliffs',
    nearbyLandmarks: ['Colorado River', 'Cazador Nest'],
    accessRoutes: ['River Trail', 'Mountain Path']
  },

  // Faction Territories
  {
    id: 'helios-one',
    name: 'HELIOS One',
    displayName: 'HELIOS One Solar Plant',
    type: 'facility',
    description: 'Pre-war solar power facility under NCR control',
    coordinates: { x: 50, y: 60 },
    dangerLevel: 5,
    travelTimeModifier: 1.3,
    terrainType: 'desert',
    subTerrain: 'industrial complex',
    nearbyLandmarks: ['Hidden Valley', 'NCR Patrol Routes'],
    accessRoutes: ['Power Line Road', 'NCR Highway']
  },
  {
    id: 'hidden-valley',
    name: 'Hidden Valley',
    displayName: 'Hidden Valley Bunker',
    type: 'facility',
    description: 'Brotherhood of Steel bunker complex',
    coordinates: { x: 45, y: 55 },
    dangerLevel: 7,
    travelTimeModifier: 1.6,
    terrainType: 'valley',
    subTerrain: 'underground bunker',
    nearbyLandmarks: ['HELIOS One', 'Scorpion Gulch'],
    accessRoutes: ['Secret Path', 'Valley Access Road']
  },

  // Wilderness Areas
  {
    id: 'nipton',
    name: 'Nipton',
    displayName: 'Nipton Ruins',
    type: 'ruins',
    description: 'Town destroyed by Caesar\'s Legion',
    coordinates: { x: 70, y: 25 },
    dangerLevel: 6,
    travelTimeModifier: 1.4,
    terrainType: 'ruins',
    subTerrain: 'burned settlement',
    nearbyLandmarks: ['Searchlight', 'Legion Territory'],
    accessRoutes: ['Highway 164', 'Legion Road']
  },
  {
    id: 'searchlight',
    name: 'Searchlight',
    displayName: 'Camp Searchlight',
    type: 'ruins',
    description: 'Irradiated NCR outpost',
    coordinates: { x: 75, y: 35 },
    dangerLevel: 8,
    travelTimeModifier: 1.8,
    terrainType: 'ruins',
    subTerrain: 'irradiated zone',
    nearbyLandmarks: ['Colorado River', 'Fire Root Cavern'],
    accessRoutes: ['Irradiated Highway', 'River Road']
  },

  // Remote Outposts
  {
    id: 'mojave-outpost',
    name: 'Mojave Outpost',
    displayName: 'Mojave Outpost',
    type: 'outpost',
    description: 'NCR border checkpoint and trading post',
    coordinates: { x: 20, y: 15 },
    dangerLevel: 2,
    travelTimeModifier: 1.0,
    terrainType: 'desert',
    nearbyLandmarks: ['Giant Cazador Nest', 'Highway 15'],
    accessRoutes: ['Highway 15 Border', 'Trade Route']
  },
  {
    id: 'boulder-city',
    name: 'Boulder City',
    displayName: 'Boulder City Ruins',
    type: 'ruins',
    description: 'Partially destroyed town near Hoover Dam',
    coordinates: { x: 80, y: 65 },
    dangerLevel: 5,
    travelTimeModifier: 1.3,
    terrainType: 'ruins',
    nearbyLandmarks: ['Hoover Dam', 'Lake Mead'],
    accessRoutes: ['Dam Access Road', 'Highway 93']
  }
];

// Helper function to get location by ID
export const getLocationById = (id: string): MojaveLocation | undefined => {
  return MOJAVE_LOCATIONS.find(loc => loc.id === id);
};

// Helper function to calculate travel time based on distance and terrain
export const calculateTravelTime = (
  fromLocation: string, 
  toLocation: string, 
  baseDifficulty: number,
  squadLevel: number = 1
): number => {
  const from = getLocationById(fromLocation) || MOJAVE_LOCATIONS[0]; // Default to Shady Sands
  const to = getLocationById(toLocation);
  
  if (!to) return 30; // Default travel time
  
  // Calculate base travel time (minutes)
  const distance = Math.sqrt(
    Math.pow(to.coordinates.x - from.coordinates.x, 2) + 
    Math.pow(to.coordinates.y - from.coordinates.y, 2)
  );
  
  const baseTime = 15 + (distance * 0.8); // Base time based on distance
  const difficultyModifier = 1 + (baseDifficulty * 0.2); // Difficulty adds time
  const terrainModifier = to.travelTimeModifier;
  const squadEfficiency = Math.max(0.7, 1 - (squadLevel * 0.05)); // Better squads travel faster
  
  return Math.round(baseTime * difficultyModifier * terrainModifier * squadEfficiency);
};