// Fallout California Wasteland Locations
// 500-mile x 500-mile map area, Shady Sands at center (50%, 50%)
// Distances are actual road distances from Shady Sands

export interface CaliforniaLocation {
  id: string;
  name: string;
  type: 'settlement' | 'vault' | 'ruins' | 'facility' | 'combat' | 'outpost' | 'landmark';
  coordinates: { x: number; y: number }; // Percentage (0-100)
  distanceFromShadySands: number; // Miles via roads
  dangerLevel: number; // 1-10
  terrain: 'desert' | 'ruins' | 'mountains' | 'urban' | 'wasteland' | 'coast' | 'facility';
  description: string;
  connectedRoads: string[]; // Road IDs this location connects to
  population?: number;
  faction?: string;
  resources?: string[];
}

export const CALIFORNIA_LOCATIONS: CaliforniaLocation[] = [
  // MAJOR SETTLEMENTS (Fallout 1/2 Lore)
  {
    id: 'shady-sands',
    name: 'Shady Sands',
    type: 'settlement',
    coordinates: { x: 50, y: 50 },
    distanceFromShadySands: 0,
    dangerLevel: 1,
    terrain: 'desert',
    description: 'Capital of the New California Republic. The safest and most prosperous settlement in the wasteland.',
    connectedRoads: ['i5-north-1', 'i5-south-1', 'i80-west-1', 'hwy99-north-1'],
    population: 5000,
    faction: 'NCR',
    resources: ['food', 'water', 'weapons', 'medical']
  },
  
  {
    id: 'player-outpost',
    name: 'Player Outpost',
    type: 'outpost',
    coordinates: { x: 62, y: 45 }, // ~52 miles east of Shady Sands
    distanceFromShadySands: 52,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'Your personal settlement on the outskirts of NCR territory. A growing outpost with potential.',
    connectedRoads: ['player-road-1'],
    population: 50,
    faction: 'Independent',
    resources: ['basic-supplies']
  },

  {
    id: 'boneyard',
    name: 'The Boneyard',
    type: 'ruins',
    coordinates: { x: 48, y: 80 }, // South, Los Angeles ruins
    distanceFromShadySands: 150,
    dangerLevel: 6,
    terrain: 'urban',
    description: 'The ruins of Los Angeles. A dangerous but resource-rich area controlled by various factions.',
    connectedRoads: ['i5-south-3', 'i5-south-4'],
    population: 2000,
    faction: 'Gun Runners',
    resources: ['tech', 'scrap', 'weapons']
  },

  {
    id: 'hub',
    name: 'The Hub',
    type: 'settlement',
    coordinates: { x: 52, y: 68 }, // Southeast
    distanceFromShadySands: 120,
    dangerLevel: 3,
    terrain: 'desert',
    description: 'The trading capital of New California. If you need it, someone at the Hub has it for sale.',
    connectedRoads: ['i5-south-2', 'hwy99-south-1'],
    population: 3000,
    faction: 'Merchants',
    resources: ['trade', 'supplies', 'caps']
  },

  {
    id: 'junktown',
    name: 'Junktown',
    type: 'settlement',
    coordinates: { x: 58, y: 62 },
    distanceFromShadySands: 90,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'A frontier town built from scrap. Rough around the edges but honest traders.',
    connectedRoads: ['hwy99-south-1', 'route66-west-1'],
    population: 800,
    faction: 'Independent',
    resources: ['scrap', 'repairs']
  },

  {
    id: 'necropolis',
    name: 'Necropolis',
    type: 'ruins',
    coordinates: { x: 42, y: 75 },
    distanceFromShadySands: 140,
    dangerLevel: 7,
    terrain: 'urban',
    description: 'City of the dead. Ghoul-infested ruins with high radiation. Enter at your own risk.',
    connectedRoads: ['i5-south-3'],
    population: 500,
    faction: 'Ghouls',
    resources: ['radiation', 'tech']
  },

  {
    id: 'vault-13',
    name: 'Vault 13',
    type: 'vault',
    coordinates: { x: 48, y: 28 }, // North
    distanceFromShadySands: 80,
    dangerLevel: 5,
    terrain: 'mountains',
    description: 'The legendary Vault 13. Home of the first Vault Dweller. Mostly sealed now.',
    connectedRoads: ['i5-north-2'],
    population: 0,
    faction: 'Abandoned',
    resources: ['tech', 'equipment']
  },

  {
    id: 'lost-hills',
    name: 'Lost Hills Bunker',
    type: 'facility',
    coordinates: { x: 28, y: 52 }, // West
    distanceFromShadySands: 100,
    dangerLevel: 8,
    terrain: 'desert',
    description: 'Brotherhood of Steel headquarters. Advanced technology, but they don\'t share.',
    connectedRoads: ['i80-west-2'],
    population: 400,
    faction: 'Brotherhood of Steel',
    resources: ['tech', 'power-armor', 'energy-weapons']
  },

  {
    id: 'gecko',
    name: 'Gecko',
    type: 'settlement',
    coordinates: { x: 72, y: 38 }, // East
    distanceFromShadySands: 120,
    dangerLevel: 5,
    terrain: 'wasteland',
    description: 'Ghoul settlement built around a pre-war power plant. Irradiated but functional.',
    connectedRoads: ['i80-east-2', 'route66-east-1'],
    population: 600,
    faction: 'Ghouls',
    resources: ['power', 'radiation']
  },

  {
    id: 'redding',
    name: 'Redding',
    type: 'settlement',
    coordinates: { x: 45, y: 10 }, // Far north
    distanceFromShadySands: 200,
    dangerLevel: 6,
    terrain: 'mountains',
    description: 'Mining town in the northern wasteland. Rich in gold and other minerals.',
    connectedRoads: ['i5-north-4', 'hwy99-north-3'],
    population: 1200,
    faction: 'Miners',
    resources: ['gold', 'minerals', 'explosives']
  },

  {
    id: 'new-vegas',
    name: 'New Vegas',
    type: 'settlement',
    coordinates: { x: 85, y: 48 }, // Far east
    distanceFromShadySands: 200,
    dangerLevel: 7,
    terrain: 'urban',
    description: 'The jewel of the Mojave Desert. Bright lights, high stakes, and dangerous games.',
    connectedRoads: ['route66-east-3', 'i15-north-2'],
    population: 4000,
    faction: 'Mr. House',
    resources: ['caps', 'tech', 'luxury']
  },

  {
    id: 'dayglow',
    name: 'Dayglow',
    type: 'ruins',
    coordinates: { x: 35, y: 85 }, // Southwest coast
    distanceFromShadySands: 180,
    dangerLevel: 9,
    terrain: 'coast',
    description: 'San Diego\'s glowing remains. Extreme radiation levels. Mutants everywhere.',
    connectedRoads: ['i5-south-4', 'hwy101-south-2'],
    population: 300,
    faction: 'Ghouls',
    resources: ['radiation', 'mutations']
  },

  // COMBAT LOCATIONS (50+ miles from Shady Sands)
  {
    id: 'raiders-canyon',
    name: 'Raider Canyon',
    type: 'combat',
    coordinates: { x: 58, y: 55 },
    distanceFromShadySands: 65,
    dangerLevel: 6,
    terrain: 'mountains',
    description: 'A notorious raider hideout in the canyons. They ambush caravans traveling the highways.',
    connectedRoads: ['hwy99-south-1'],
    resources: ['weapons', 'chems']
  },

  {
    id: 'deathclaw-quarry',
    name: 'Deathclaw Quarry',
    type: 'combat',
    coordinates: { x: 68, y: 42 },
    distanceFromShadySands: 95,
    dangerLevel: 10,
    terrain: 'wasteland',
    description: 'Abandoned quarry now home to a pack of deathclaws. Only the most experienced squads dare enter.',
    connectedRoads: ['i80-east-2'],
    resources: ['deathclaw-eggs', 'rare-loot']
  },

  {
    id: 'mutant-stronghold',
    name: 'Super Mutant Stronghold',
    type: 'combat',
    coordinates: { x: 38, y: 35 },
    distanceFromShadySands: 105,
    dangerLevel: 8,
    terrain: 'ruins',
    description: 'A fortified position held by super mutants. Heavy resistance expected.',
    connectedRoads: ['i5-north-2'],
    resources: ['heavy-weapons', 'FEV-samples']
  },

  {
    id: 'raiders-den',
    name: 'Viper Den',
    type: 'combat',
    coordinates: { x: 62, y: 70 },
    distanceFromShadySands: 115,
    dangerLevel: 7,
    terrain: 'desert',
    description: 'Base camp of the Viper gang. They worship snakes and radiation.',
    connectedRoads: ['hwy99-south-2'],
    resources: ['chems', 'melee-weapons']
  },

  {
    id: 'scorpion-nest',
    name: 'Radscorpion Nest',
    type: 'combat',
    coordinates: { x: 44, y: 58 },
    distanceFromShadySands: 55,
    dangerLevel: 5,
    terrain: 'desert',
    description: 'Large nest of giant radscorpions. Their venom is valuable but deadly.',
    connectedRoads: ['i5-south-1'],
    resources: ['scorpion-venom', 'carapace']
  },

  {
    id: 'abandoned-military-base',
    name: 'Mariposa Military Base',
    type: 'facility',
    coordinates: { x: 32, y: 45 },
    distanceFromShadySands: 95,
    dangerLevel: 9,
    terrain: 'facility',
    description: 'Pre-war military installation. Origin of the FEV virus. Extremely dangerous.',
    connectedRoads: ['i80-west-2'],
    resources: ['military-tech', 'FEV', 'power-armor-parts']
  },

  {
    id: 'ghoul-camp',
    name: 'Feral Ghoul Camp',
    type: 'combat',
    coordinates: { x: 55, y: 78 },
    distanceFromShadySands: 145,
    dangerLevel: 6,
    terrain: 'ruins',
    description: 'Irradiated ruins full of feral ghouls. High radiation levels throughout.',
    connectedRoads: ['i5-south-3'],
    resources: ['radiation', 'pre-war-junk']
  },

  {
    id: 'khan-territory',
    name: 'Khan Raider Territory',
    type: 'combat',
    coordinates: { x: 78, y: 52 },
    distanceFromShadySands: 145,
    dangerLevel: 7,
    terrain: 'wasteland',
    description: 'Territory controlled by the Khan raider gang. Well-armed and aggressive.',
    connectedRoads: ['route66-east-2'],
    resources: ['explosives', 'drugs']
  },

  {
    id: 'cazador-nest',
    name: 'Cazador Nest',
    type: 'combat',
    coordinates: { x: 82, y: 45 },
    distanceFromShadySands: 165,
    dangerLevel: 9,
    terrain: 'wasteland',
    description: 'Nest of mutated cazador wasps. Their poison is almost instantly lethal.',
    connectedRoads: ['route66-east-2'],
    resources: ['cazador-poison', 'rare-components']
  },

  {
    id: 'slaver-camp',
    name: 'Slaver Camp',
    type: 'combat',
    coordinates: { x: 48, y: 72 },
    distanceFromShadySands: 110,
    dangerLevel: 7,
    terrain: 'desert',
    description: 'Hidden slaver outpost. They capture wastelanders and sell them to the highest bidder.',
    connectedRoads: ['i5-south-2'],
    resources: ['caps', 'weapons']
  },

  // ADDITIONAL LANDMARKS
  {
    id: 'cathedral',
    name: 'The Cathedral',
    type: 'ruins',
    coordinates: { x: 50, y: 82 },
    distanceFromShadySands: 160,
    dangerLevel: 8,
    terrain: 'urban',
    description: 'Former headquarters of the Children of the Cathedral cult. Dark history.',
    connectedRoads: ['i5-south-4'],
    resources: ['religious-artifacts', 'secrets']
  },

  {
    id: 'glow',
    name: 'The Glow',
    type: 'ruins',
    coordinates: { x: 40, y: 68 },
    distanceFromShadySands: 125,
    dangerLevel: 10,
    terrain: 'wasteland',
    description: 'Ground zero of a nuclear strike. Extreme radiation. The Brotherhood tests initiates here.',
    connectedRoads: ['i5-south-2'],
    resources: ['pre-war-tech', 'radiation', 'holodisks']
  },

  {
    id: 'san-francisco',
    name: 'San Francisco',
    type: 'settlement',
    coordinates: { x: 25, y: 25 }, // Northwest coast
    distanceFromShadySands: 185,
    dangerLevel: 5,
    terrain: 'coast',
    description: 'Shi-controlled city on the northern coast. Advanced technology and isolationist.',
    connectedRoads: ['hwy101-north-2', 'i80-west-3'],
    population: 2500,
    faction: 'Shi',
    resources: ['tech', 'seafood', 'fuel']
  },

  {
    id: 'modoc',
    name: 'Modoc',
    type: 'settlement',
    coordinates: { x: 52, y: 18 },
    distanceFromShadySands: 160,
    dangerLevel: 3,
    terrain: 'desert',
    description: 'Small farming community. Simple folk making an honest living.',
    connectedRoads: ['i5-north-3', 'hwy99-north-2'],
    population: 400,
    faction: 'Independent',
    resources: ['food', 'brahmin']
  },

  {
    id: 'den',
    name: 'The Den',
    type: 'settlement',
    coordinates: { x: 58, y: 22 },
    distanceFromShadySands: 145,
    dangerLevel: 7,
    terrain: 'urban',
    description: 'Lawless town controlled by gangs and slavers. Anything goes here.',
    connectedRoads: ['hwy99-north-2'],
    population: 1000,
    faction: 'Criminal',
    resources: ['drugs', 'slaves', 'black-market']
  },

  {
    id: 'vault-15',
    name: 'Vault 15',
    type: 'vault',
    coordinates: { x: 54, y: 48 },
    distanceFromShadySands: 20,
    dangerLevel: 6,
    terrain: 'desert',
    description: 'Ancestral home of Shady Sands founders. Now occupied by raiders.',
    connectedRoads: ['player-road-1'],
    resources: ['vault-tech', 'equipment']
  },

  {
    id: 'military-depot',
    name: 'Sierra Army Depot',
    type: 'facility',
    coordinates: { x: 65, y: 15 },
    distanceFromShadySands: 175,
    dangerLevel: 8,
    terrain: 'mountains',
    description: 'Sealed military depot full of pre-war weapons and robots. Heavy security.',
    connectedRoads: ['hwy99-north-3'],
    resources: ['military-weapons', 'robots', 'explosives']
  }
];

// Helper function to get location by ID
export function getCaliforniaLocationById(id: string): CaliforniaLocation | undefined {
  return CALIFORNIA_LOCATIONS.find(loc => loc.id === id);
}

// Helper function to get locations by type
export function getCaliforniaLocationsByType(type: CaliforniaLocation['type']): CaliforniaLocation[] {
  return CALIFORNIA_LOCATIONS.filter(loc => loc.type === type);
}

// Helper function to get combat locations within distance range
export function getCombatLocationsInRange(minDistance: number, maxDistance: number): CaliforniaLocation[] {
  return CALIFORNIA_LOCATIONS.filter(
    loc => loc.type === 'combat' && 
    loc.distanceFromShadySands >= minDistance && 
    loc.distanceFromShadySands <= maxDistance
  );
}
