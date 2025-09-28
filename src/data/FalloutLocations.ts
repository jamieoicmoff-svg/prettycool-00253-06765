// Fallout Lore-Accurate Locations based on New Vegas and classic Fallout games
export interface FalloutLocation {
  id: string;
  name: string;
  displayName: string;
  type: 'settlement' | 'vault' | 'ruins' | 'military' | 'faction' | 'landmark' | 'danger-zone';
  description: string;
  coordinates: { x: number; y: number }; // Percentage based on lore-accurate map
  dangerLevel: number; // 1-10
  faction?: string;
  population?: number;
  resources?: string[];
  terrainType: 'desert' | 'mountains' | 'ruins' | 'valley' | 'wasteland' | 'underground';
  subTerrain?: string;
  loreDescription: string;
  connectedRoutes: string[];
  travelTimeBase: number; // Base minutes to travel here from any adjacent location
}

export interface WastelandRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  type: 'highway' | 'trail' | 'underground' | 'dangerous-path' | 'caravan-route';
  dangerLevel: number;
  distance: number; // In kilometers
  travelTime: number; // Base travel time in minutes
  waypoints: { x: number; y: number }[];
  hazards: string[];
  description: string;
}

// Lore-accurate Fallout locations based on New Vegas and classic games
export const FALLOUT_LOCATIONS: FalloutLocation[] = [
  // NCR Territory (Safe Zone)
  {
    id: 'shady-sands',
    name: 'Shady Sands',
    displayName: 'Shady Sands (NCR Capital)',
    type: 'settlement',
    description: 'Capital of the New California Republic, heavily fortified and well-defended',
    coordinates: { x: 15, y: 75 },
    dangerLevel: 1,
    faction: 'NCR',
    population: 3000,
    resources: ['food', 'water', 'ammunition', 'medical'],
    terrainType: 'desert',
    loreDescription: 'Founded by the descendants of Vault 15, Shady Sands grew from a small farming community into the bustling capital of the NCR. Protected by NCR Rangers and regular patrols.',
    connectedRoutes: ['ncr-highway-15', 'vault-15-trail', 'hub-trade-route'],
    travelTimeBase: 0
  },
  {
    id: 'vault-city',
    name: 'Vault City',
    displayName: 'Vault City',
    type: 'settlement',
    description: 'Advanced settlement built around Vault 8, known for medical technology',
    coordinates: { x: 25, y: 85 },
    dangerLevel: 2,
    faction: 'Vault City',
    population: 1500,
    resources: ['medical', 'technology', 'water'],
    terrainType: 'valley',
    loreDescription: 'Built by Vault 8 dwellers, Vault City represents pre-war technology and isolationist policies. Their advanced medical facilities are unmatched in the wasteland.',
    connectedRoutes: ['vault-city-road', 'northern-passage'],
    travelTimeBase: 45
  },
  {
    id: 'the-hub',
    name: 'The Hub',
    displayName: 'The Hub Trading Center',
    type: 'settlement',
    description: 'Major trading hub and commercial center of the wasteland',
    coordinates: { x: 35, y: 65 },
    dangerLevel: 3,
    faction: 'Hub Merchants',
    population: 2000,
    resources: ['caps', 'ammunition', 'technology', 'food'],
    terrainType: 'ruins',
    loreDescription: 'Built on the ruins of Los Angeles, the Hub is the economic heart of the wasteland. Caravans from across the region converge here to trade.',
    connectedRoutes: ['hub-trade-route', 'boneyard-highway', 'necropolis-trail'],
    travelTimeBase: 60
  },

  // Vault Locations
  {
    id: 'vault-13',
    name: 'Vault 13',
    displayName: 'Vault 13 (The Vault Dweller\'s Home)',
    type: 'vault',
    description: 'Famous vault where the Vault Dweller originated, now partially inhabited',
    coordinates: { x: 45, y: 55 },
    dangerLevel: 4,
    population: 200,
    resources: ['technology', 'water'],
    terrainType: 'underground',
    subTerrain: 'vault complex',
    loreDescription: 'Vault 13 was designed to stay closed for 200 years, but the water chip failure forced the Vault Dweller to venture outside, changing the wasteland forever.',
    connectedRoutes: ['vault-13-entrance', 'deathclaw-territory'],
    travelTimeBase: 90
  },
  {
    id: 'vault-15',
    name: 'Vault 15',
    displayName: 'Vault 15 Ruins',
    type: 'vault',
    description: 'Partially collapsed vault, former home of Shady Sands founders',
    coordinates: { x: 20, y: 70 },
    dangerLevel: 5,
    resources: ['technology', 'scrap'],
    terrainType: 'underground',
    subTerrain: 'collapsed tunnels',
    loreDescription: 'Vault 15 was designed to have a diverse population that would clash and eventually leave the vault. The founders of Shady Sands, the Khans, and the Vipers all originated here.',
    connectedRoutes: ['vault-15-trail', 'khan-territory'],
    travelTimeBase: 30
  },
  {
    id: 'vault-101',
    name: 'Vault 101',
    displayName: 'Vault 101 (Capital Wasteland)',
    type: 'vault',
    description: 'Sealed vault from the Capital Wasteland, recently opened',
    coordinates: { x: 85, y: 25 },
    dangerLevel: 3,
    population: 100,
    resources: ['technology', 'medical'],
    terrainType: 'underground',
    loreDescription: 'Vault 101 was designed never to open, but the Lone Wanderer\'s departure changed everything. Now it serves as a small but advanced settlement.',
    connectedRoutes: ['capital-wasteland-trail'],
    travelTimeBase: 180
  },

  // Dangerous Locations
  {
    id: 'necropolis',
    name: 'Necropolis',
    displayName: 'Necropolis (City of the Dead)',
    type: 'ruins',
    description: 'Ghoul city built in the ruins of Bakersfield, heavily irradiated',
    coordinates: { x: 55, y: 45 },
    dangerLevel: 7,
    faction: 'Ghouls',
    population: 800,
    resources: ['radiation', 'scrap', 'pre-war-tech'],
    terrainType: 'ruins',
    subTerrain: 'irradiated city',
    loreDescription: 'The ghouls of Necropolis have built a functioning society in the radioactive ruins. They are generally peaceful but fiercely protective of their territory.',
    connectedRoutes: ['necropolis-trail', 'irradiated-highway'],
    travelTimeBase: 120
  },
  {
    id: 'military-base',
    name: 'Mariposa Military Base',
    displayName: 'Mariposa Military Base (Master\'s Lair)',
    type: 'military',
    description: 'Former FEV research facility, now ruins of the Master\'s army',
    coordinates: { x: 65, y: 35 },
    dangerLevel: 9,
    resources: ['FEV', 'military-tech', 'super-mutant-gear'],
    terrainType: 'ruins',
    subTerrain: 'military complex',
    loreDescription: 'The birthplace of the Super Mutant army and the Master\'s Unity. Though the Master is gone, dangerous experiments and mutant creatures still lurk in the depths.',
    connectedRoutes: ['military-access-road', 'super-mutant-patrol-route'],
    travelTimeBase: 150
  },
  {
    id: 'cathedral',
    name: 'Cathedral',
    displayName: 'Cathedral of the Lost Angels',
    type: 'ruins',
    description: 'Former Children of the Cathedral stronghold, now abandoned ruins',
    coordinates: { x: 40, y: 50 },
    dangerLevel: 8,
    resources: ['psychic-nullifier', 'religious-artifacts'],
    terrainType: 'ruins',
    subTerrain: 'underground cathedral',
    loreDescription: 'Once the spiritual center of the Master\'s Unity movement, the Cathedral\'s underground levels still contain dangerous technology and fanatical remnants.',
    connectedRoutes: ['cathedral-approach', 'boneyard-connection'],
    travelTimeBase: 100
  },

  // New Vegas Region
  {
    id: 'new-vegas',
    name: 'New Vegas',
    displayName: 'New Vegas Strip',
    type: 'settlement',
    description: 'Mr. House\'s jewel of the Mojave, a beacon of pre-war luxury',
    coordinates: { x: 70, y: 60 },
    dangerLevel: 2,
    faction: 'Mr. House',
    population: 5000,
    resources: ['caps', 'luxury-goods', 'energy', 'entertainment'],
    terrainType: 'ruins',
    subTerrain: 'restored city',
    loreDescription: 'Under Mr. House\'s protection, New Vegas has been restored to its pre-war glory. The Strip is heavily defended by Securitrons and offers the finest amenities in the wasteland.',
    connectedRoutes: ['vegas-highway', 'freeside-connection', 'hoover-dam-road'],
    travelTimeBase: 120
  },
  {
    id: 'goodsprings',
    name: 'Goodsprings',
    displayName: 'Goodsprings Township',
    type: 'settlement',
    description: 'Small frontier town where the Courier\'s journey began',
    coordinates: { x: 60, y: 45 },
    dangerLevel: 3,
    population: 50,
    resources: ['food', 'water', 'basic-supplies'],
    terrainType: 'valley',
    loreDescription: 'A quiet mining town that became famous as the place where the Courier was shot and left for dead. Doc Mitchell\'s house still serves as the local medical center.',
    connectedRoutes: ['goodsprings-trail', 'primm-highway', 'powder-ganger-route'],
    travelTimeBase: 45
  },
  {
    id: 'primm',
    name: 'Primm',
    displayName: 'Primm (Border Town)',
    type: 'settlement',
    description: 'Border town with the Vikki and Vance Casino',
    coordinates: { x: 65, y: 40 },
    dangerLevel: 4,
    population: 75,
    resources: ['ammunition', 'scrap', 'gambling'],
    terrainType: 'desert',
    loreDescription: 'A small border town that survived by adapting to the post-war world. The Vikki and Vance Casino still operates, and the town serves as a waystation for travelers.',
    connectedRoutes: ['primm-highway', 'ncrcf-road', 'mojave-express-route'],
    travelTimeBase: 30
  },

  // Extreme Danger Zones
  {
    id: 'deathclaw-sanctuary',
    name: 'Deathclaw Sanctuary',
    displayName: 'Deathclaw Sanctuary',
    type: 'danger-zone',
    description: 'The most dangerous location in the wasteland - avoid at all costs',
    coordinates: { x: 50, y: 30 },
    dangerLevel: 10,
    resources: ['deathclaw-eggs', 'deathclaw-hide'],
    terrainType: 'mountains',
    subTerrain: 'cave system',
    loreDescription: 'A natural cave system that has become the primary nesting ground for deathclaws. Even the Brotherhood of Steel avoids this area.',
    connectedRoutes: ['death-trail'],
    travelTimeBase: 200
  },
  {
    id: 'glow',
    name: 'The Glow',
    displayName: 'The Glow (West Tek)',
    type: 'ruins',
    description: 'Heavily irradiated ruins of West Tek research facility',
    coordinates: { x: 75, y: 20 },
    dangerLevel: 9,
    resources: ['FEV-samples', 'advanced-tech', 'radiation'],
    terrainType: 'ruins',
    subTerrain: 'irradiated crater',
    loreDescription: 'The West Tek research facility where FEV was developed. The area is so irradiated that only those with the best radiation protection can survive here.',
    connectedRoutes: ['radiation-highway'],
    travelTimeBase: 240
  },

  // Faction Strongholds
  {
    id: 'lost-hills-bunker',
    name: 'Lost Hills Bunker',
    displayName: 'Lost Hills (Brotherhood HQ)',
    type: 'military',
    description: 'Original Brotherhood of Steel headquarters',
    coordinates: { x: 30, y: 40 },
    dangerLevel: 6,
    faction: 'Brotherhood of Steel',
    population: 300,
    resources: ['technology', 'power-armor', 'energy-weapons'],
    terrainType: 'mountains',
    subTerrain: 'underground bunker',
    loreDescription: 'The birthplace of the Brotherhood of Steel, built in a pre-war military bunker. The Brotherhood\'s most advanced technology and archives are stored here.',
    connectedRoutes: ['brotherhood-patrol-route', 'mountain-pass'],
    travelTimeBase: 90
  },
  {
    id: 'ncr-ranger-station',
    name: 'Ranger Station Charlie',
    displayName: 'NCR Ranger Station Charlie',
    type: 'military',
    description: 'Elite NCR Ranger outpost monitoring the eastern frontier',
    coordinates: { x: 80, y: 70 },
    dangerLevel: 3,
    faction: 'NCR Rangers',
    population: 25,
    resources: ['ammunition', 'medical', 'intelligence'],
    terrainType: 'desert',
    loreDescription: 'An elite NCR Ranger station that monitors Legion activity and protects trade routes. The Rangers here are among the best in the NCR.',
    connectedRoutes: ['ranger-patrol-route', 'legion-border'],
    travelTimeBase: 75
  },

  // Mojave Specific Locations
  {
    id: 'hoover-dam',
    name: 'Hoover Dam',
    displayName: 'Hoover Dam',
    type: 'landmark',
    description: 'Massive pre-war dam providing power to the region',
    coordinates: { x: 85, y: 65 },
    dangerLevel: 5,
    faction: 'NCR/Legion Contested',
    resources: ['electricity', 'concrete', 'strategic-position'],
    terrainType: 'ruins',
    subTerrain: 'dam complex',
    loreDescription: 'The site of the Second Battle of Hoover Dam, this massive structure controls power distribution across the Mojave. Heavily fortified and strategically crucial.',
    connectedRoutes: ['hoover-dam-road', 'colorado-river-trail'],
    travelTimeBase: 100
  },
  {
    id: 'quarry-junction',
    name: 'Quarry Junction',
    displayName: 'Quarry Junction (Deathclaw Territory)',
    type: 'danger-zone',
    description: 'Deathclaw-infested limestone quarry - extremely dangerous',
    coordinates: { x: 55, y: 80 },
    dangerLevel: 9,
    resources: ['limestone', 'deathclaw-hide', 'heavy-machinery'],
    terrainType: 'ruins',
    subTerrain: 'open pit quarry',
    loreDescription: 'A pre-war limestone quarry that became a deathclaw nesting ground. The Powder Gangers\' dynamite blasting attracted the creatures, making this area nearly impassable.',
    connectedRoutes: ['death-trail', 'sloan-bypass'],
    travelTimeBase: 180
  },
  {
    id: 'helios-one',
    name: 'HELIOS One',
    displayName: 'HELIOS One Solar Plant',
    type: 'military',
    description: 'Massive solar power plant with orbital laser capabilities',
    coordinates: { x: 75, y: 55 },
    dangerLevel: 6,
    faction: 'NCR/Brotherhood Contested',
    resources: ['solar-energy', 'advanced-tech', 'orbital-weapons'],
    terrainType: 'desert',
    subTerrain: 'solar facility',
    loreDescription: 'A pre-war solar power plant that can be converted into an orbital laser weapon. Both the NCR and Brotherhood of Steel have interests here.',
    connectedRoutes: ['helios-access-road', 'hidden-valley-connection'],
    travelTimeBase: 110
  },
  {
    id: 'hidden-valley',
    name: 'Hidden Valley',
    displayName: 'Hidden Valley (Mojave Brotherhood)',
    type: 'military',
    description: 'Secret Brotherhood of Steel bunker in the Mojave',
    coordinates: { x: 70, y: 50 },
    dangerLevel: 7,
    faction: 'Brotherhood of Steel',
    population: 150,
    resources: ['power-armor', 'energy-weapons', 'technology'],
    terrainType: 'valley',
    subTerrain: 'hidden bunker',
    loreDescription: 'The Mojave chapter of the Brotherhood of Steel operates from this hidden bunker. They are more isolationist than their western brothers.',
    connectedRoutes: ['hidden-valley-connection', 'brotherhood-patrol-route'],
    travelTimeBase: 95
  },

  // Legion Territory
  {
    id: 'cottonwood-cove',
    name: 'Cottonwood Cove',
    displayName: 'Cottonwood Cove (Legion Outpost)',
    type: 'military',
    description: 'Caesar\'s Legion forward operating base on the Colorado River',
    coordinates: { x: 90, y: 55 },
    dangerLevel: 8,
    faction: 'Caesar\'s Legion',
    population: 200,
    resources: ['slaves', 'melee-weapons', 'boats'],
    terrainType: 'valley',
    subTerrain: 'river outpost',
    loreDescription: 'The Legion\'s primary staging area for operations west of the Colorado River. Heavily fortified and used for launching raids into NCR territory.',
    connectedRoutes: ['legion-border', 'colorado-river-trail'],
    travelTimeBase: 140
  },
  {
    id: 'the-fort',
    name: 'The Fort',
    displayName: 'The Fort (Caesar\'s Stronghold)',
    type: 'military',
    description: 'Caesar\'s personal fortress and Legion headquarters',
    coordinates: { x: 95, y: 60 },
    dangerLevel: 10,
    faction: 'Caesar\'s Legion',
    population: 500,
    resources: ['legion-currency', 'slaves', 'ancient-weapons'],
    terrainType: 'ruins',
    subTerrain: 'fortified island',
    loreDescription: 'Built on a small island in the Colorado River, this is Caesar\'s personal stronghold. Only the most elite Legionnaires are stationed here.',
    connectedRoutes: ['legion-ferry-route'],
    travelTimeBase: 200
  },

  // Wasteland Settlements
  {
    id: 'novac',
    name: 'Novac',
    displayName: 'Novac (Dinosaur Town)',
    type: 'settlement',
    description: 'Small town built around a giant dinosaur statue and motel',
    coordinates: { x: 78, y: 45 },
    dangerLevel: 4,
    population: 30,
    resources: ['ammunition', 'lodging', 'information'],
    terrainType: 'desert',
    loreDescription: 'A small town that grew around the Dinky the T-Rex roadside attraction. The dinosaur\'s mouth serves as a sniper\'s nest overlooking the town.',
    connectedRoutes: ['highway-95', 'repconn-trail'],
    travelTimeBase: 85
  },
  {
    id: 'jacobstown',
    name: 'Jacobstown',
    displayName: 'Jacobstown (Super Mutant Settlement)',
    type: 'settlement',
    description: 'Peaceful super mutant settlement led by Marcus',
    coordinates: { x: 25, y: 90 },
    dangerLevel: 5,
    faction: 'Friendly Super Mutants',
    population: 100,
    resources: ['medical', 'heavy-weapons', 'nightkin-research'],
    terrainType: 'mountains',
    loreDescription: 'Founded by Marcus, a former Lieutenant in the Master\'s army, Jacobstown is proof that super mutants can live peacefully. Dr. Henry conducts Nightkin research here.',
    connectedRoutes: ['mountain-trail', 'nightkin-territory'],
    travelTimeBase: 120
  },

  // Mysterious/Special Locations
  {
    id: 'sierra-madre',
    name: 'Sierra Madre',
    displayName: 'Sierra Madre Casino',
    type: 'landmark',
    description: 'Legendary casino shrouded in the deadly Cloud',
    coordinates: { x: 10, y: 20 },
    dangerLevel: 10,
    resources: ['sierra-madre-chips', 'holograms', 'cloud-technology'],
    terrainType: 'ruins',
    subTerrain: 'casino complex',
    loreDescription: 'Frederick Sinclair\'s grand casino, protected by the deadly Cloud and holographic security. Few who enter ever leave, but the treasures within are beyond imagination.',
    connectedRoutes: ['sierra-madre-approach'],
    travelTimeBase: 300
  },
  {
    id: 'big-mt',
    name: 'Big MT',
    displayName: 'Big Mountain Research Facility',
    type: 'ruins',
    description: 'Pre-war research facility with mad science experiments',
    coordinates: { x: 5, y: 50 },
    dangerLevel: 10,
    resources: ['advanced-science', 'cybernetics', 'experimental-weapons'],
    terrainType: 'mountains',
    subTerrain: 'research crater',
    loreDescription: 'The Big Mountain Research and Development Center, where pre-war scientists conducted impossible experiments. The Think Tank still operates here, trapped in their own madness.',
    connectedRoutes: ['big-mt-teleporter'],
    travelTimeBase: 360
  },
  {
    id: 'divide',
    name: 'The Divide',
    displayName: 'The Divide (Lonesome Road)',
    type: 'danger-zone',
    description: 'Nuclear wasteland created by the Courier\'s actions',
    coordinates: { x: 95, y: 30 },
    dangerLevel: 10,
    resources: ['nuclear-weapons', 'marked-men-gear', 'pre-war-flags'],
    terrainType: 'ruins',
    subTerrain: 'nuclear wasteland',
    loreDescription: 'Once a thriving community, the Divide was destroyed by nuclear weapons triggered by the Courier\'s delivery. Now it\'s home to the Marked Men and Ulysses.',
    connectedRoutes: ['lonesome-road'],
    travelTimeBase: 400
  }
];

// Lore-accurate wasteland routes (no modern highways, mostly trails and dangerous paths)
export const WASTELAND_ROUTES: WastelandRoute[] = [
  {
    id: 'ncr-highway-15',
    name: 'Old Highway 15',
    from: 'shady-sands',
    to: 'the-hub',
    type: 'highway',
    dangerLevel: 2,
    distance: 45,
    travelTime: 90,
    waypoints: [
      { x: 15, y: 75 },
      { x: 20, y: 72 },
      { x: 25, y: 70 },
      { x: 30, y: 68 },
      { x: 35, y: 65 }
    ],
    hazards: ['Raider patrols', 'Radscorpions'],
    description: 'Main NCR trade route, well-patrolled but still dangerous'
  },
  {
    id: 'vault-15-trail',
    name: 'Vault 15 Trail',
    from: 'shady-sands',
    to: 'vault-15',
    type: 'trail',
    dangerLevel: 3,
    distance: 8,
    travelTime: 25,
    waypoints: [
      { x: 15, y: 75 },
      { x: 17, y: 73 },
      { x: 20, y: 70 }
    ],
    hazards: ['Mole rats', 'Unstable ground'],
    description: 'Short trail to the ruins of Vault 15'
  },
  {
    id: 'death-trail',
    name: 'Death Trail',
    from: 'vault-13',
    to: 'deathclaw-sanctuary',
    type: 'dangerous-path',
    dangerLevel: 10,
    distance: 12,
    travelTime: 180,
    waypoints: [
      { x: 45, y: 55 },
      { x: 47, y: 50 },
      { x: 48, y: 45 },
      { x: 49, y: 40 },
      { x: 50, y: 30 }
    ],
    hazards: ['Deathclaws', 'Cazadores', 'Unstable terrain', 'No cover'],
    description: 'Extremely dangerous mountain path through deathclaw territory'
  },
  {
    id: 'goodsprings-trail',
    name: 'Goodsprings Trail',
    from: 'goodsprings',
    to: 'primm',
    type: 'trail',
    dangerLevel: 3,
    distance: 15,
    travelTime: 35,
    waypoints: [
      { x: 60, y: 45 },
      { x: 62, y: 43 },
      { x: 65, y: 40 }
    ],
    hazards: ['Powder Gangers', 'Coyotes'],
    description: 'Well-traveled path between frontier settlements'
  },
  {
    id: 'vegas-highway',
    name: 'Vegas Highway',
    from: 'primm',
    to: 'new-vegas',
    type: 'highway',
    dangerLevel: 4,
    distance: 25,
    travelTime: 60,
    waypoints: [
      { x: 65, y: 40 },
      { x: 67, y: 45 },
      { x: 68, y: 50 },
      { x: 70, y: 55 },
      { x: 70, y: 60 }
    ],
    hazards: ['Fiends', 'Cazadores', 'Legion scouts'],
    description: 'Main highway to New Vegas, heavily traveled but dangerous'
  },
  {
    id: 'legion-border',
    name: 'Legion Border Crossing',
    from: 'ncr-ranger-station',
    to: 'cottonwood-cove',
    type: 'dangerous-path',
    dangerLevel: 8,
    distance: 20,
    travelTime: 120,
    waypoints: [
      { x: 80, y: 70 },
      { x: 85, y: 65 },
      { x: 88, y: 60 },
      { x: 90, y: 55 }
    ],
    hazards: ['Legion patrols', 'Landmines', 'Snipers', 'Crucifixions'],
    description: 'Heavily contested border between NCR and Legion territory'
  },
  {
    id: 'sierra-madre-approach',
    name: 'Sierra Madre Approach',
    from: 'big-mt',
    to: 'sierra-madre',
    type: 'dangerous-path',
    dangerLevel: 10,
    distance: 8,
    travelTime: 240,
    waypoints: [
      { x: 5, y: 50 },
      { x: 7, y: 40 },
      { x: 8, y: 30 },
      { x: 10, y: 20 }
    ],
    hazards: ['The Cloud', 'Ghost People', 'Holograms', 'Toxic atmosphere'],
    description: 'Deadly approach through the Cloud to the Sierra Madre'
  },
  {
    id: 'lonesome-road',
    name: 'The Lonesome Road',
    from: 'new-vegas',
    to: 'divide',
    type: 'dangerous-path',
    dangerLevel: 10,
    distance: 35,
    travelTime: 300,
    waypoints: [
      { x: 70, y: 60 },
      { x: 75, y: 55 },
      { x: 80, y: 50 },
      { x: 85, y: 45 },
      { x: 90, y: 40 },
      { x: 95, y: 30 }
    ],
    hazards: ['Marked Men', 'Tunnelers', 'Nuclear storms', 'Unstable ground'],
    description: 'The most dangerous road in the wasteland, leading to the Divide'
  }
];

// Helper functions
export const getFalloutLocationById = (id: string): FalloutLocation | undefined => {
  return FALLOUT_LOCATIONS.find(loc => loc.id === id);
};

export const getRouteById = (id: string): WastelandRoute | undefined => {
  return WASTELAND_ROUTES.find(route => route.id === id);
};

export const getRoutesBetween = (fromId: string, toId: string): WastelandRoute[] => {
  return WASTELAND_ROUTES.filter(route => 
    (route.from === fromId && route.to === toId) ||
    (route.from === toId && route.to === fromId)
  );
};

export const calculateLoreTravelTime = (
  fromLocationId: string,
  toLocationId: string,
  squadLevel: number = 1,
  squadSize: number = 1,
  weatherCondition: string = 'clear'
): number => {
  const routes = getRoutesBetween(fromLocationId, toLocationId);
  
  if (routes.length === 0) {
    // No direct route, calculate based on coordinates
    const fromLoc = getFalloutLocationById(fromLocationId);
    const toLoc = getFalloutLocationById(toLocationId);
    
    if (!fromLoc || !toLoc) return 60; // Default 1 hour
    
    const distance = Math.sqrt(
      Math.pow(toLoc.coordinates.x - fromLoc.coordinates.x, 2) + 
      Math.pow(toLoc.coordinates.y - fromLoc.coordinates.y, 2)
    );
    
    const baseTravelTime = distance * 2; // 2 minutes per coordinate unit
    const dangerModifier = 1 + ((fromLoc.dangerLevel + toLoc.dangerLevel) / 20);
    
    return Math.round(baseTravelTime * dangerModifier);
  }
  
  // Use the safest available route
  const bestRoute = routes.reduce((best, current) => 
    current.dangerLevel < best.dangerLevel ? current : best
  );
  
  let travelTime = bestRoute.travelTime;
  
  // Apply modifiers
  const squadEfficiency = Math.max(0.7, 1 - (squadLevel * 0.05));
  const sizeModifier = squadSize > 4 ? 1.2 : squadSize < 2 ? 0.8 : 1.0;
  
  // Weather modifiers
  const weatherModifiers = {
    'clear': 1.0,
    'overcast': 1.1,
    'light-rain': 1.2,
    'fog': 1.5,
    'dust-storm': 2.0,
    'radiation-storm': 2.5
  };
  
  const weatherModifier = weatherModifiers[weatherCondition as keyof typeof weatherModifiers] || 1.0;
  
  return Math.round(travelTime * squadEfficiency * sizeModifier * weatherModifier);
};

export const getConnectedLocations = (locationId: string): FalloutLocation[] => {
  const routes = WASTELAND_ROUTES.filter(route => 
    route.from === locationId || route.to === locationId
  );
  
  const connectedIds = routes.map(route => 
    route.from === locationId ? route.to : route.from
  );
  
  return FALLOUT_LOCATIONS.filter(loc => connectedIds.includes(loc.id));
};