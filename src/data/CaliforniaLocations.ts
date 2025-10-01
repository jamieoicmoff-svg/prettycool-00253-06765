// Fallout California Wasteland Locations - V2.0 ACCURATE COORDINATES
// Based on actual Fallout 1/2 map geography
// Map dimensions: 800 miles (N-S) × 400 miles (E-W)
// Coordinate system: Percentage (0-100) for both X and Y
// Scale: 1% X = ~4 miles, 1% Y = ~8 miles
// Center reference: Shady Sands (NCR Capital) at { x: 35, y: 50 }

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
  // ========== MAJOR SETTLEMENTS (Fallout Canon) ==========
  
  {
    id: 'shady-sands',
    name: 'Shady Sands (NCR)',
    type: 'settlement',
    coordinates: { x: 35, y: 50 }, // CENTER POINT - Central California
    distanceFromShadySands: 0,
    dangerLevel: 1,
    terrain: 'urban',
    description: 'Capital of the New California Republic. The safest and most prosperous settlement in the wasteland.',
    connectedRoads: ['i5-north-1', 'i5-south-1', 'hwy99-north-1', 'hwy99-south-1', 'player-to-shady', 'shady-to-vault15'],
    population: 5000,
    faction: 'NCR',
    resources: ['food', 'water', 'weapons', 'medical', 'ammunition'],
    preWarBuildings: ['NCR Government Building', 'Water Tower', 'Town Hall', 'Trading Post'],
    discovered: true // Always visible - major faction capital
  },

  {
    id: 'player-outpost',
    name: 'Outpost Sentinel',
    type: 'outpost',
    coordinates: { x: 15, y: 72 }, // 180+ miles SW of Shady Sands (coastal)
    distanceFromShadySands: 185,
    dangerLevel: 3,
    terrain: 'coast',
    description: 'Your personal settlement on the western coast, southwest of Shady Sands. A growing outpost with great potential.',
    connectedRoads: ['player-to-shady', 'player-to-losthills', 'player-to-rustcreek', 'player-to-vipers', 'player-to-chains'],
    population: 50,
    faction: 'Independent',
    resources: ['basic-supplies', 'water'],
    preWarBuildings: ['Old Gas Station', 'Water Tank', 'Coastal Lookout'],
    discovered: true // Player's home base, always visible
  },

  {
    id: 'vault-13',
    name: 'Vault 13',
    type: 'vault',
    coordinates: { x: 18, y: 52 }, // West of Shady Sands, coastal mountains
    distanceFromShadySands: 72,
    dangerLevel: 5,
    terrain: 'mountains',
    description: 'The original vault. Home to the Vault Dweller who saved the wasteland.',
    connectedRoads: ['v13-to-sf', 'v13-to-losthills'],
    population: 200,
    faction: 'Vault Dwellers',
    resources: ['vault-tech', 'water-chips', 'preserved-goods'],
    preWarBuildings: ['Vault Entrance', 'Living Quarters', 'Water Purification'],
    discovered: false
  },

  {
    id: 'vault-15',
    name: 'Vault 15',
    type: 'vault',
    coordinates: { x: 38, y: 58 }, // Southeast of Shady Sands
    distanceFromShadySands: 68,
    dangerLevel: 6,
    terrain: 'ruins',
    description: 'Partially collapsed vault. Origin of Shady Sands founders. Now occupied by raiders.',
    connectedRoads: ['shady-to-vault15', 'v15-to-junktown'],
    faction: 'Raiders',
    resources: ['vault-tech', 'scrap'],
    preWarBuildings: ['Collapsed Entrance', 'Underground Sections'],
    discovered: false
  },

  {
    id: 'junktown',
    name: 'Junktown',
    type: 'settlement',
    coordinates: { x: 40, y: 68 }, // South of Shady Sands
    distanceFromShadySands: 152,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'A fortified settlement built from scrap. Rough but honest folk run a tight ship.',
    connectedRoads: ['i5-south-1', 'v15-to-junktown', 'junktown-to-hub'],
    population: 800,
    faction: 'Independent',
    resources: ['scrap', 'repairs', 'food'],
    preWarBuildings: ['Scrap Walls', 'Guard Towers', 'Workshop'],
    discovered: false
  },

  {
    id: 'hub',
    name: 'The Hub',
    type: 'settlement',
    coordinates: { x: 52, y: 72 }, // Southeast, major trading center
    distanceFromShadySands: 198,
    dangerLevel: 3,
    terrain: 'desert',
    description: 'The trading center of the wasteland. All caravans pass through here.',
    connectedRoads: ['junktown-to-hub', 'hub-to-boneyard', 'hub-to-vegas', 'hwy99-south-2'],
    population: 1500,
    faction: 'Merchants',
    resources: ['all-goods', 'caps', 'caravans'],
    preWarBuildings: ['Trading Post', 'Warehouse District', 'Rail Yard'],
    discovered: false
  },

  {
    id: 'boneyard',
    name: 'The Boneyard',
    type: 'settlement',
    coordinates: { x: 22, y: 84 }, // Los Angeles area - south
    distanceFromShadySands: 285,
    dangerLevel: 6,
    terrain: 'ruins',
    description: 'The ruins of Los Angeles. A sprawling graveyard of pre-war civilization.',
    connectedRoads: ['i5-south-2', 'hub-to-boneyard', 'boneyard-to-necropolis', 'boneyard-to-dayglow'],
    population: 2000,
    faction: 'Gun Runners',
    resources: ['scrap', 'weapons', 'ammunition', 'tech-parts'],
    preWarBuildings: ['Skyscrapers', 'Sports Arena', 'University Ruins', 'City Hall'],
    discovered: false
  },

  {
    id: 'necropolis',
    name: 'Necropolis',
    type: 'ruins',
    coordinates: { x: 18, y: 86 }, // Near Boneyard, irradiated
    distanceFromShadySands: 305,
    dangerLevel: 7,
    terrain: 'ruins',
    description: 'A city of ghouls in the radioactive ruins. Dangerous for smoothskins.',
    connectedRoads: ['boneyard-to-necropolis'],
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
    coordinates: { x: 24, y: 96 }, // San Diego - far south
    distanceFromShadySands: 390,
    dangerLevel: 6,
    terrain: 'coast',
    description: 'The glowing city. Ghoul scientists and traders inhabit this irradiated port.',
    connectedRoads: ['boneyard-to-dayglow'],
    population: 1200,
    faction: 'Ghoul Scientists',
    resources: ['radiation-tech', 'medical', 'trade-goods'],
    preWarBuildings: ['Port', 'Research Facility', 'Glowing Buildings'],
    discovered: false
  },

  {
    id: 'san-francisco',
    name: 'San Francisco',
    type: 'settlement',
    coordinates: { x: 12, y: 48 }, // Bay Area - northwest coast
    distanceFromShadySands: 205,
    dangerLevel: 6,
    terrain: 'urban',
    description: 'The city by the bay. Shi Empire territory with advanced technology.',
    connectedRoads: ['sf-to-gecko', 'v13-to-sf', 'sf-to-navarro'],
    population: 3000,
    faction: 'Shi Empire',
    resources: ['tech', 'medicine', 'weapons', 'fuel'],
    preWarBuildings: ['Golden Gate Remains', 'Chinatown', 'Docks', 'Shi Palace'],
    discovered: false
  },

  {
    id: 'gecko',
    name: 'Gecko',
    type: 'settlement',
    coordinates: { x: 38, y: 42 }, // North of Shady Sands
    distanceFromShadySands: 78,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'Ghoul settlement with an old nuclear power plant. Friendly but irradiated.',
    connectedRoads: ['i5-north-2', 'hwy99-north-1', 'sf-to-gecko', 'gecko-to-newreno'],
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
    coordinates: { x: 32, y: 18 }, // Far north
    distanceFromShadySands: 268,
    dangerLevel: 5,
    terrain: 'mountains',
    description: 'Mining town in the northern territories. Tough miners extract precious ore.',
    connectedRoads: ['i5-north-4', 'hwy99-north-2'],
    population: 900,
    faction: 'Miners',
    resources: ['gold', 'minerals', 'explosives'],
    preWarBuildings: ['Mine Shafts', 'Ore Processing', 'Mining Equipment'],
    discovered: false
  },

  {
    id: 'new-reno',
    name: 'New Reno',
    type: 'settlement',
    coordinates: { x: 60, y: 28 }, // Northeast
    distanceFromShadySands: 280,
    dangerLevel: 7,
    terrain: 'urban',
    description: 'City of sin controlled by crime families. Dangerous but profitable.',
    connectedRoads: ['gecko-to-newreno', 'newreno-to-vaultcity'],
    population: 2500,
    faction: 'Crime Families',
    resources: ['chems', 'weapons', 'caps', 'vice'],
    preWarBuildings: ['Casinos', 'Hotels', 'Brothels'],
    discovered: false
  },

  {
    id: 'vault-city',
    name: 'Vault City',
    type: 'settlement',
    coordinates: { x: 52, y: 32 }, // Northeast, advanced settlement
    distanceFromShadySands: 245,
    dangerLevel: 2,
    terrain: 'urban',
    description: 'Advanced settlement with strict laws and cutting-edge technology.',
    connectedRoads: ['newreno-to-vaultcity'],
    population: 1000,
    faction: 'Vault City',
    resources: ['medical', 'tech', 'food', 'water-purification'],
    preWarBuildings: ['Vault 8', 'Medical Center', 'Power Station'],
    discovered: false
  },

  {
    id: 'new-vegas',
    name: 'New Vegas',
    type: 'settlement',
    coordinates: { x: 88, y: 64 }, // Far east (Mojave)
    distanceFromShadySands: 380,
    dangerLevel: 5,
    terrain: 'urban',
    description: 'The jewel of the Mojave. A city of lights and vice on the eastern frontier.',
    connectedRoads: ['hub-to-vegas'],
    population: 8000,
    faction: 'Mr. House',
    resources: ['caps', 'energy-weapons', 'tech', 'luxury-goods'],
    preWarBuildings: ['Lucky 38 Casino', 'The Strip', 'Fremont Street', 'Hoover Dam'],
    discovered: false
  },

  {
    id: 'lost-hills',
    name: 'Lost Hills',
    type: 'facility',
    coordinates: { x: 12, y: 68 }, // Hidden BOS bunker - southwest mountains
    distanceFromShadySands: 195,
    dangerLevel: 8,
    terrain: 'mountains',
    description: 'Hidden Brotherhood of Steel bunker. Location is highly classified.',
    connectedRoads: ['player-to-losthills', 'v13-to-losthills'],
    population: 300,
    faction: 'Brotherhood of Steel',
    resources: ['power-armor', 'energy-weapons', 'tech'],
    preWarBuildings: ['Military Bunker', 'Underground Complex', 'Research Labs'],
    discovered: false
  },

  {
    id: 'enclave-navarro',
    name: 'Navarro',
    type: 'facility',
    coordinates: { x: 8, y: 12 }, // Far northwest coast
    distanceFromShadySands: 420,
    dangerLevel: 10,
    terrain: 'facility',
    description: 'Secret Enclave base. Extremely dangerous. Late-game content.',
    connectedRoads: ['sf-to-navarro'],
    faction: 'Enclave',
    resources: ['advanced-power-armor', 'plasma-weapons', 'vertibirds'],
    preWarBuildings: ['Military Complex', 'Vertibird Pads', 'Research Labs'],
    discovered: false
  },

  // ========== NCR MILITARY OUTPOSTS ==========
  
  {
    id: 'ncr-patrol-north',
    name: 'NCR Highway Patrol - North',
    type: 'outpost',
    coordinates: { x: 35, y: 40 },
    distanceFromShadySands: 80,
    dangerLevel: 1,
    terrain: 'desert',
    description: 'NCR military checkpoint ensuring safe travel on the northern routes.',
    connectedRoads: ['i5-north-1'],
    faction: 'NCR',
    resources: ['ammunition', 'medical', 'repairs'],
    preWarBuildings: ['Checkpoint Station'],
    discovered: false
  },

  {
    id: 'ncr-patrol-south',
    name: 'NCR Highway Patrol - South',
    type: 'outpost',
    coordinates: { x: 38, y: 62 },
    distanceFromShadySands: 98,
    dangerLevel: 2,
    terrain: 'desert',
    description: 'NCR checkpoint protecting the southern trade routes.',
    connectedRoads: ['i5-south-1'],
    faction: 'NCR',
    resources: ['ammunition', 'food', 'water'],
    preWarBuildings: ['Checkpoint Station', 'Guard Tower'],
    discovered: false
  },

  {
    id: 'caravan-waystation',
    name: 'Crimson Caravan Waystation',
    type: 'outpost',
    coordinates: { x: 45, y: 65 },
    distanceFromShadySands: 128,
    dangerLevel: 3,
    terrain: 'wasteland',
    description: 'Caravan rest stop and trading post. Neutral ground for all factions.',
    connectedRoads: ['hwy99-south-1', 'waystation-to-hub'],
    faction: 'Crimson Caravan',
    resources: ['trade-goods', 'repairs', 'food'],
    preWarBuildings: ['Trading Post', 'Brahmin Pens'],
    discovered: false
  },

  // ========== COMBAT ZONES (50+ miles from player outpost) ==========
  
  {
    id: 'vipers-nest',
    name: "Viper's Nest",
    type: 'combat',
    coordinates: { x: 20, y: 62 }, // ~85 miles from player
    distanceFromShadySands: 112,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'Viper gang camp with scrap metal walls and guard towers. Hostile raiders.',
    connectedRoads: ['player-to-vipers'],
    faction: 'Viper Gang',
    resources: ['leather-armor', 'pistols', 'chems', 'caps'],
    preWarBuildings: ['Makeshift Camp', 'Watchtowers'],
    discovered: true // Near enough to be visible
  },

  {
    id: 'rust-creek-station',
    name: 'Rust Creek Station',
    type: 'combat',
    coordinates: { x: 18, y: 78 }, // ~65 miles from player
    distanceFromShadySands: 235,
    dangerLevel: 3,
    terrain: 'wasteland',
    description: 'Abandoned gas station overrun by desperate scavengers and radroaches.',
    connectedRoads: ['player-to-rustcreek'],
    faction: 'Scavengers',
    resources: ['scrap-metal', 'tools', 'fuel-canisters'],
    preWarBuildings: ['Gas Station', 'Garage', 'Storage Tanks'],
    discovered: true
  },

  {
    id: 'scorpion-gulch',
    name: 'Scorpion Gulch',
    type: 'combat',
    coordinates: { x: 28, y: 68 }, // ~75 miles from player
    distanceFromShadySands: 158,
    dangerLevel: 5,
    terrain: 'desert',
    description: 'Rocky canyon filled with giant radscorpion nests. Highly dangerous.',
    connectedRoads: ['scorpion-access'],
    faction: 'Wildlife',
    resources: ['radscorpion-poison', 'chitin', 'meat'],
    preWarBuildings: ['Canyon Caves'],
    discovered: true
  },

  {
    id: 'chains-camp',
    name: "Chains' Camp",
    type: 'combat',
    coordinates: { x: 10, y: 65 }, // ~90 miles from player
    distanceFromShadySands: 165,
    dangerLevel: 6,
    terrain: 'wasteland',
    description: 'Fortified slaver camp with caged prisoners. Heavily armed guards.',
    connectedRoads: ['player-to-chains'],
    faction: 'Slavers',
    resources: ['combat-armor', 'rifles', 'slave-collars', 'caps'],
    preWarBuildings: ['Fortified Compound', 'Prisoner Cages'],
    discovered: true
  },

  {
    id: 'broken-wheel',
    name: 'Broken Wheel Settlement',
    type: 'combat',
    coordinates: { x: 25, y: 58 }, // ~70 miles from player
    distanceFromShadySands: 98,
    dangerLevel: 4,
    terrain: 'wasteland',
    description: 'Paranoid settlement that shoots strangers on sight. Former farmers turned hostile.',
    connectedRoads: ['brokenwheel-access'],
    faction: 'Renegade Settlers',
    resources: ['farming-tools', 'food', 'hunting-rifles'],
    preWarBuildings: ['Farm Buildings', 'Barricades'],
    discovered: true
  },

  {
    id: 'highway-tollbooth',
    name: 'Highway 5 Tollbooth',
    type: 'combat',
    coordinates: { x: 35, y: 58 }, // ~90 miles from player
    distanceFromShadySands: 64,
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
    coordinates: { x: 42, y: 75 }, // ~120 miles from player
    distanceFromShadySands: 210,
    dangerLevel: 6,
    terrain: 'ruins',
    description: 'Irradiated town ruins crawling with feral ghouls. High radiation.',
    connectedRoads: ['greenfield-access'],
    faction: 'Feral Ghouls',
    resources: ['pre-war-money', 'med-x', 'radiation-suits'],
    preWarBuildings: ['Ruined Houses', 'Irradiated Streets', 'Collapsed Buildings'],
    discovered: true
  },

  {
    id: 'fort-irwin',
    name: 'Old Fort Irwin',
    type: 'combat',
    coordinates: { x: 48, y: 78 }, // ~150 miles from player
    distanceFromShadySands: 245,
    dangerLevel: 7,
    terrain: 'facility',
    description: 'Abandoned military base with active defense robots. Extremely dangerous.',
    connectedRoads: ['fortirwin-access'],
    faction: 'Military Robots',
    resources: ['energy-weapons', 'military-armor', 'fusion-cores'],
    preWarBuildings: ['Barracks', 'Armory', 'Command Center', 'Robot Factory'],
    discovered: true
  },

  {
    id: 'deathclaw-pass',
    name: 'Deathclaw Pass',
    type: 'combat',
    coordinates: { x: 42, y: 45 }, // ~110 miles from player
    distanceFromShadySands: 58,
    dangerLevel: 9,
    terrain: 'mountains',
    description: 'Mountain pass claimed by deadly deathclaws. Almost certain death.',
    connectedRoads: ['deathclaw-access'],
    faction: 'Deathclaws',
    resources: ['deathclaw-hides', 'deathclaw-eggs', 'victim-weapons'],
    preWarBuildings: ['Mountain Caves'],
    discovered: true
  },

  {
    id: 'camp-searchlight',
    name: 'Camp Searchlight',
    type: 'combat',
    coordinates: { x: 12, y: 78 }, // ~75 miles from player
    distanceFromShadySands: 245,
    dangerLevel: 5,
    terrain: 'facility',
    description: 'Former raider base destroyed by radiation leak. Irradiated enemies.',
    connectedRoads: ['searchlight-access'],
    faction: 'Irradiated Raiders',
    resources: ['radaway', 'rad-x', 'hazmat-suits', 'energy-weapons'],
    preWarBuildings: ['Irradiated Barracks', 'Contaminated Warehouse'],
    discovered: true
  },

  // ========== ADDITIONAL LANDMARKS ==========
  
  {
    id: 'masters-cathedral',
    name: "The Master's Cathedral",
    type: 'ruins',
    coordinates: { x: 20, y: 82 },
    distanceFromShadySands: 275,
    dangerLevel: 8,
    terrain: 'ruins',
    description: 'Destroyed cathedral. Former home of the Master and the Unity.',
    connectedRoads: ['boneyard-to-necropolis'],
    faction: 'Abandoned',
    resources: ['pre-war-tech', 'FEV-samples'],
    preWarBuildings: ['Cathedral Ruins', 'Underground Vaults'],
    discovered: false
  },

  {
    id: 'mariposa',
    name: 'Mariposa Military Base',
    type: 'facility',
    coordinates: { x: 28, y: 38 },
    distanceFromShadySands: 105,
    dangerLevel: 9,
    terrain: 'facility',
    description: 'Source of the FEV virus. Heavily guarded by super mutants.',
    connectedRoads: ['mariposa-access'],
    faction: 'Super Mutants',
    resources: ['FEV', 'military-tech', 'power-armor'],
    preWarBuildings: ['Military Complex', 'FEV Labs', 'Vault'],
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

// Helper function to calculate straight-line distance between two locations
export const calculateLocationDistance = (loc1: CaliforniaLocation, loc2: CaliforniaLocation): number => {
  const deltaX = Math.abs(loc2.coordinates.x - loc1.coordinates.x) * 4; // X: 4 miles per %
  const deltaY = Math.abs(loc2.coordinates.y - loc1.coordinates.y) * 8; // Y: 8 miles per %
  return Math.round(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
};
