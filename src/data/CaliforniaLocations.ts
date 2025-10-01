// Fallout California Wasteland Locations
// Real California geography with Fallout 1/2 lore
// Map dimensions: 1000x500 (embedded) / 2000x1800 (fullscreen)
// Coordinates are percentage-based (0-100) for both X and Y

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
  preWarBuildings?: string[];
  discovered: boolean; // Discovery system
}

export const CALIFORNIA_LOCATIONS: CaliforniaLocation[] = [
  // ========== MAJOR SETTLEMENTS ==========
  
  {
    id: 'shady-sands',
    name: 'Shady Sands',
    type: 'settlement',
    coordinates: { x: 40, y: 55 }, // Central California (Bakersfield area)
    distanceFromShadySands: 0,
    dangerLevel: 1,
    terrain: 'urban',
    description: 'Capital of the New California Republic. The safest and most prosperous settlement in the wasteland.',
    connectedRoads: ['i5-north-1', 'i5-south-1', 'hwy99-north-1', 'hwy99-south-1'],
    population: 5000,
    faction: 'NCR',
    resources: ['food', 'water', 'weapons', 'medical', 'ammunition'],
    preWarBuildings: ['NCR Government Building (Pre-war Library)', 'Water Tower', 'Town Hall', 'Trading Post'],
    discovered: false // Starts hidden, major city
  },

  {
    id: 'player-outpost',
    name: 'Home Settlement',
    type: 'outpost',
    coordinates: { x: 30, y: 63 }, // 50 miles SW of Shady Sands
    distanceFromShadySands: 50,
    dangerLevel: 2,
    terrain: 'wasteland',
    description: 'Your personal settlement southwest of Shady Sands. A growing outpost with potential.',
    connectedRoads: ['player-road-1', 'player-road-2'],
    population: 50,
    faction: 'Independent',
    resources: ['basic-supplies', 'water'],
    preWarBuildings: ['Old Gas Station', 'Water Tank'],
    discovered: true // Player's home base, always visible
  },

  {
    id: 'new-vegas',
    name: 'New Vegas',
    type: 'settlement',
    coordinates: { x: 85, y: 52 }, // Far east (Las Vegas, Nevada)
    distanceFromShadySands: 220,
    dangerLevel: 5,
    terrain: 'urban',
    description: 'The jewel of the Mojave. A city of lights and vice on the eastern frontier.',
    connectedRoads: ['i15-east-3', 'route66-east-2'],
    population: 8000,
    faction: 'Mr. House',
    resources: ['caps', 'energy-weapons', 'tech', 'luxury-goods'],
    preWarBuildings: ['Lucky 38 Casino', 'The Strip', 'Fremont Street', 'Hoover Dam'],
    discovered: false // Major city, starts hidden
  },

  {
    id: 'boneyard',
    name: 'The Boneyard',
    type: 'settlement',
    coordinates: { x: 36, y: 70 }, // Los Angeles area
    distanceFromShadySands: 110,
    dangerLevel: 6,
    terrain: 'ruins',
    description: 'The ruins of Los Angeles. A sprawling graveyard of pre-war civilization.',
    connectedRoads: ['i5-south-2', 'i15-west-1', 'hwy101-south-2'],
    population: 2000,
    faction: 'Gun Runners',
    resources: ['scrap', 'weapons', 'ammunition', 'tech-parts'],
    preWarBuildings: ['Skyscrapers', 'Sports Arena', 'University Ruins', 'City Hall'],
    discovered: false
  },

  {
    id: 'hub',
    name: 'The Hub',
    type: 'settlement',
    coordinates: { x: 42, y: 72 }, // Barstow area
    distanceFromShadySands: 85,
    dangerLevel: 3,
    terrain: 'desert',
    description: 'The trading center of the wasteland. All caravans pass through here.',
    connectedRoads: ['hwy99-south-2', 'i15-west-2', 'i40-west-1'],
    population: 1500,
    faction: 'Merchants',
    resources: ['all-goods', 'caps', 'caravans'],
    preWarBuildings: ['Trading Post', 'Warehouse District', 'Rail Yard'],
    discovered: false
  },

  {
    id: 'junktown',
    name: 'Junktown',
    type: 'settlement',
    coordinates: { x: 34, y: 76 }, // San Bernardino area
    distanceFromShadySands: 75,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'A fortified settlement built from scrap. Rough but honest folk.',
    connectedRoads: ['hwy99-south-3'],
    population: 800,
    faction: 'Independent',
    resources: ['scrap', 'repairs', 'food'],
    preWarBuildings: ['Scrap Walls', 'Guard Towers', 'Workshop'],
    discovered: false
  },

  {
    id: 'necropolis',
    name: 'Necropolis',
    type: 'ruins',
    coordinates: { x: 26, y: 79 }, // Downey/LA suburbs
    distanceFromShadySands: 120,
    dangerLevel: 7,
    terrain: 'ruins',
    description: 'A city of ghouls in the radioactive ruins. Dangerous for smoothskins.',
    connectedRoads: ['hwy101-south-3'],
    population: 500,
    faction: 'Ghouls',
    resources: ['radiation-meds', 'pre-war-tech'],
    preWarBuildings: ['Irradiated Buildings', 'Underground Sewers', 'Vault Entrance'],
    discovered: false
  },

  {
    id: 'dayglow',
    name: 'Dayglow',
    type: 'settlement',
    coordinates: { x: 30, y: 92 }, // San Diego
    distanceFromShadySands: 180,
    dangerLevel: 6,
    terrain: 'coast',
    description: 'The glowing city. Ghoul scientists and traders inhabit this irradiated port.',
    connectedRoads: ['i5-south-3', 'hwy101-south-4'],
    population: 1200,
    faction: 'Ghoul Scientists',
    resources: ['radiation-tech', 'medical', 'trade-goods'],
    preWarBuildings: ['Port', 'Research Facility', 'Glowing Buildings'],
    discovered: false
  },

  {
    id: 'lost-hills',
    name: 'Lost Hills',
    type: 'facility',
    coordinates: { x: 18, y: 70 }, // Santa Barbara area
    distanceFromShadySands: 95,
    dangerLevel: 8,
    terrain: 'mountains',
    description: 'Hidden Brotherhood of Steel bunker. Location is classified.',
    connectedRoads: ['hwy101-mid-1'],
    population: 300,
    faction: 'Brotherhood of Steel',
    resources: ['power-armor', 'energy-weapons', 'tech'],
    preWarBuildings: ['Military Bunker', 'Underground Complex', 'Research Labs'],
    discovered: false
  },

  {
    id: 'vault-13',
    name: 'Vault 13',
    type: 'vault',
    coordinates: { x: 14, y: 58 }, // San Luis Obispo area
    distanceFromShadySands: 85,
    dangerLevel: 5,
    terrain: 'mountains',
    description: 'The original vault. Home to the Vault Dweller who saved the wasteland.',
    connectedRoads: ['hwy101-north-1'],
    population: 200,
    faction: 'Vault Dwellers',
    resources: ['vault-tech', 'water-chips', 'preserved-goods'],
    preWarBuildings: ['Vault Entrance', 'Living Quarters', 'Water Purification'],
    discovered: false
  },

  {
    id: 'gecko',
    name: 'Gecko',
    type: 'settlement',
    coordinates: { x: 30, y: 48 }, // Modesto area
    distanceFromShadySands: 90,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'Ghoul settlement with an old nuclear power plant. Friendly but irradiated.',
    connectedRoads: ['hwy99-north-2', 'i5-north-2'],
    population: 600,
    faction: 'Ghouls',
    resources: ['energy-cells', 'radiation-meds', 'scrap'],
    preWarBuildings: ['Nuclear Power Plant', 'Cooling Towers', 'Control Room'],
    discovered: false
  },

  {
    id: 'redding',
    name: 'Redding',
    type: 'settlement',
    coordinates: { x: 28, y: 18 }, // Redding, CA (north)
    distanceFromShadySands: 240,
    dangerLevel: 5,
    terrain: 'mountains',
    description: 'Mining town in the northern territories. Tough miners and precious ore.',
    connectedRoads: ['i5-north-4'],
    population: 900,
    faction: 'Miners',
    resources: ['gold', 'minerals', 'explosives'],
    preWarBuildings: ['Mine Shafts', 'Ore Processing', 'Mining Equipment'],
    discovered: false
  },

  {
    id: 'san-francisco',
    name: 'San Francisco',
    type: 'settlement',
    coordinates: { x: 22, y: 32 }, // SF Bay Area
    distanceFromShadySands: 185,
    dangerLevel: 6,
    terrain: 'urban',
    description: 'The city by the bay. Shi Empire territory with advanced technology.',
    connectedRoads: ['hwy101-north-3', 'i80-west-2'],
    population: 3000,
    faction: 'Shi Empire',
    resources: ['tech', 'medicine', 'weapons', 'fuel'],
    preWarBuildings: ['Golden Gate Remains', 'Chinatown', 'Docks', 'Shi Palace'],
    discovered: false
  },

  // ========== LOCAL COMBAT ZONES (Near Player Settlement) ==========
  
  {
    id: 'vipers-nest',
    name: "Viper's Nest",
    type: 'combat',
    coordinates: { x: 29, y: 68 }, // 12 miles NE
    distanceFromShadySands: 52,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'Viper gang camp with scrap metal walls and guard towers. Hostile raiders.',
    connectedRoads: ['player-road-3'],
    faction: 'Viper Gang',
    resources: ['leather-armor', 'pistols', 'chems', 'caps'],
    preWarBuildings: ['Makeshift Camp', 'Watchtowers'],
    discovered: true // Near player settlement
  },

  {
    id: 'rust-creek-station',
    name: 'Rust Creek Station',
    type: 'combat',
    coordinates: { x: 25, y: 73 }, // 18 miles S
    distanceFromShadySands: 55,
    dangerLevel: 3,
    terrain: 'wasteland',
    description: 'Abandoned gas station overrun by desperate scavengers and radroaches.',
    connectedRoads: ['hwy101-south-1'],
    faction: 'Scavengers',
    resources: ['scrap-metal', 'tools', 'fuel-canisters'],
    preWarBuildings: ['Gas Station', 'Garage', 'Storage Tanks'],
    discovered: true
  },

  {
    id: 'scorpion-gulch',
    name: 'Scorpion Gulch',
    type: 'combat',
    coordinates: { x: 30, y: 73 }, // 22 miles SE
    distanceFromShadySands: 60,
    dangerLevel: 5,
    terrain: 'desert',
    description: 'Rocky canyon filled with giant radscorpion nests. Highly dangerous.',
    connectedRoads: [],
    faction: 'Wildlife',
    resources: ['radscorpion-poison', 'chitin', 'meat'],
    preWarBuildings: ['Canyon Caves'],
    discovered: true
  },

  {
    id: 'chains-camp',
    name: "Chains' Camp",
    type: 'combat',
    coordinates: { x: 21, y: 69 }, // 28 miles W
    distanceFromShadySands: 68,
    dangerLevel: 6,
    terrain: 'wasteland',
    description: 'Fortified slaver camp with caged prisoners. Heavily armed guards.',
    connectedRoads: ['hwy101-mid-2'],
    faction: 'Slavers',
    resources: ['combat-armor', 'rifles', 'slave-collars', 'caps'],
    preWarBuildings: ['Fortified Compound', 'Prisoner Cages'],
    discovered: true
  },

  {
    id: 'broken-wheel',
    name: 'Broken Wheel Settlement',
    type: 'combat',
    coordinates: { x: 23, y: 67 }, // 24 miles NW
    distanceFromShadySands: 58,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'Paranoid settlement that shoots strangers on sight. Former farmers turned hostile.',
    connectedRoads: ['player-road-4'],
    faction: 'Renegade Settlers',
    resources: ['farming-tools', 'food', 'hunting-rifles'],
    preWarBuildings: ['Farm Buildings', 'Barricades'],
    discovered: true
  },

  {
    id: 'highway-tollbooth',
    name: 'Highway 5 Tollbooth',
    type: 'combat',
    coordinates: { x: 28, y: 65 }, // 30 miles N
    distanceFromShadySands: 40,
    dangerLevel: 5,
    terrain: 'desert',
    description: 'Raiders extorting travelers on Interstate 5. Dangerous checkpoint.',
    connectedRoads: ['i5-mid-1'],
    faction: 'Roadside Bandits',
    resources: ['caravan-goods', 'weapons', 'ammunition', 'caps'],
    preWarBuildings: ['Tollbooth', 'Roadblocks'],
    discovered: true
  },

  {
    id: 'greenfield-ruins',
    name: 'Greenfield Ruins',
    type: 'combat',
    coordinates: { x: 32, y: 71 }, // 26 miles E
    distanceFromShadySands: 62,
    dangerLevel: 6,
    terrain: 'ruins',
    description: 'Irradiated town ruins crawling with feral ghouls. High radiation.',
    connectedRoads: ['hwy99-south-1'],
    faction: 'Feral Ghouls',
    resources: ['pre-war-money', 'med-x', 'radiation-suits'],
    preWarBuildings: ['Ruined Houses', 'Irradiated Streets', 'Collapsed Buildings'],
    discovered: true
  },

  {
    id: 'fort-irwin',
    name: 'Old Fort Irwin',
    type: 'combat',
    coordinates: { x: 34, y: 74 }, // 35 miles SE
    distanceFromShadySands: 75,
    dangerLevel: 7,
    terrain: 'facility',
    description: 'Abandoned military base with active defense robots. Extremely dangerous.',
    connectedRoads: ['i15-west-3'],
    faction: 'Military Robots',
    resources: ['energy-weapons', 'military-armor', 'fusion-cores'],
    preWarBuildings: ['Barracks', 'Armory', 'Command Center', 'Robot Factory'],
    discovered: true
  },

  {
    id: 'deathclaw-pass',
    name: 'Deathclaw Pass',
    type: 'combat',
    coordinates: { x: 32, y: 66 }, // 40 miles NE
    distanceFromShadySands: 48,
    dangerLevel: 9,
    terrain: 'mountains',
    description: 'Mountain pass claimed by deadly deathclaws. Almost certain death.',
    connectedRoads: ['i5-north-1'],
    faction: 'Deathclaws',
    resources: ['deathclaw-hides', 'deathclaw-eggs', 'victim-weapons'],
    preWarBuildings: ['Mountain Caves'],
    discovered: true
  },

  {
    id: 'camp-searchlight',
    name: 'Camp Searchlight',
    type: 'combat',
    coordinates: { x: 22, y: 72 }, // 32 miles SW
    distanceFromShadySands: 72,
    dangerLevel: 5,
    terrain: 'facility',
    description: 'Former raider base destroyed by radiation leak. Irradiated enemies.',
    connectedRoads: ['hwy101-south-1'],
    faction: 'Irradiated Raiders',
    resources: ['radaway', 'rad-x', 'hazmat-suits', 'energy-weapons'],
    preWarBuildings: ['Irradiated Barracks', 'Contaminated Warehouse'],
    discovered: true
  },

  // ========== FACTION OUTPOSTS ==========
  
  {
    id: 'ncr-patrol-north',
    name: 'NCR Highway Patrol - North',
    type: 'outpost',
    coordinates: { x: 30, y: 55 }, // Along I-5
    distanceFromShadySands: 45,
    dangerLevel: 1,
    terrain: 'desert',
    description: 'NCR military checkpoint ensuring safe travel on Interstate 5.',
    connectedRoads: ['i5-north-1', 'i5-mid-1'],
    faction: 'NCR',
    resources: ['ammunition', 'medical', 'repairs'],
    preWarBuildings: ['Checkpoint Station'],
    discovered: false
  },

  {
    id: 'ncr-patrol-south',
    name: 'NCR Highway Patrol - South',
    type: 'outpost',
    coordinates: { x: 30, y: 72 }, // Along I-5 south
    distanceFromShadySands: 55,
    dangerLevel: 2,
    terrain: 'desert',
    description: 'NCR checkpoint protecting the southern trade routes.',
    connectedRoads: ['i5-south-1', 'i5-south-2'],
    faction: 'NCR',
    resources: ['ammunition', 'food', 'water'],
    preWarBuildings: ['Checkpoint Station', 'Guard Tower'],
    discovered: false
  },

  {
    id: 'bos-recon-alpha',
    name: 'BoS Reconnaissance Post Alpha',
    type: 'facility',
    coordinates: { x: 22, y: 62 }, // Hidden location
    distanceFromShadySands: 78,
    dangerLevel: 7,
    terrain: 'mountains',
    description: 'Hidden Brotherhood outpost. Location classified.',
    connectedRoads: [],
    faction: 'Brotherhood of Steel',
    resources: ['power-armor-parts', 'energy-cells'],
    preWarBuildings: ['Hidden Bunker'],
    discovered: false
  },

  {
    id: 'enclave-navarro',
    name: 'Navarro',
    type: 'facility',
    coordinates: { x: 22, y: 12 }, // Far north, hidden
    distanceFromShadySands: 280,
    dangerLevel: 10,
    terrain: 'facility',
    description: 'Secret Enclave base. Extremely dangerous. Late-game content.',
    connectedRoads: ['hwy101-north-4'],
    faction: 'Enclave',
    resources: ['advanced-power-armor', 'plasma-weapons', 'vertibirds'],
    preWarBuildings: ['Military Complex', 'Vertibird Pads', 'Research Labs'],
    discovered: false
  },

  {
    id: 'caravan-waystation',
    name: 'Crimson Caravan Waystation',
    type: 'outpost',
    coordinates: { x: 38, y: 68 }, // Along trade route
    distanceFromShadySands: 42,
    dangerLevel: 3,
    terrain: 'wasteland',
    description: 'Caravan rest stop and trading post. Neutral ground.',
    connectedRoads: ['hwy99-south-1'],
    faction: 'Crimson Caravan',
    resources: ['trade-goods', 'repairs', 'food'],
    preWarBuildings: ['Trading Post', 'Brahmin Pens'],
    discovered: false
  },

  // ========== OTHER LOCATIONS ==========
  
  {
    id: 'vault-15',
    name: 'Vault 15',
    type: 'vault',
    coordinates: { x: 34, y: 63 }, // Near Shady Sands
    distanceFromShadySands: 28,
    dangerLevel: 6,
    terrain: 'ruins',
    description: 'Partially collapsed vault. Origin of Shady Sands founders.',
    connectedRoads: ['player-road-5'],
    faction: 'Raiders',
    resources: ['vault-tech', 'scrap'],
    preWarBuildings: ['Collapsed Entrance', 'Underground Sections'],
    discovered: false
  },

  {
    id: 'new-reno',
    name: 'New Reno',
    type: 'settlement',
    coordinates: { x: 52, y: 22 }, // Northeast
    distanceFromShadySands: 190,
    dangerLevel: 7,
    terrain: 'urban',
    description: 'City of sin controlled by crime families. Dangerous but profitable.',
    connectedRoads: ['i80-east-1'],
    population: 2500,
    faction: 'Crime Families',
    resources: ['chems', 'weapons', 'caps', 'vice'],
    preWarBuildings: ['Casinos', 'Hotels', 'Brothels'],
    discovered: false
  }
];

// Helper function to get visible locations based on discovery
export const getVisibleLocations = (discoveredIds: string[]): CaliforniaLocation[] => {
  return CALIFORNIA_LOCATIONS.filter(loc => 
    loc.discovered || discoveredIds.includes(loc.id)
  );
};

// Helper function to get location by ID
export const getCaliforniaLocationById = (id: string): CaliforniaLocation | undefined => {
  return CALIFORNIA_LOCATIONS.find(loc => loc.id === id);
};

// Helper function to get combat locations within range
export const getCombatLocationsInRange = (centerLoc: CaliforniaLocation, maxDistance: number): CaliforniaLocation[] => {
  return CALIFORNIA_LOCATIONS.filter(loc => {
    if (loc.type !== 'combat') return false;
    const distance = calculateLocationDistance(centerLoc, loc);
    return distance <= maxDistance;
  });
};

// Helper function to get distance between two locations
export const calculateLocationDistance = (loc1: CaliforniaLocation, loc2: CaliforniaLocation): number => {
  const dx = loc2.coordinates.x - loc1.coordinates.x;
  const dy = loc2.coordinates.y - loc1.coordinates.y;
  // New scale: each 1% on map ≈ 2.5 miles (250-mile map)
  return Math.sqrt(dx * dx + dy * dy) * 2.5;
};
