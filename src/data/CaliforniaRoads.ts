// Fallout California Road Network
// Based on REAL California highways with Fallout 1/2 lore
// Includes Bezier curve control points for realistic road shapes

export interface RoadSegment {
  id: string;
  name: string;
  fromLocationId: string;
  toLocationId: string;
  distanceMiles: number;
  condition: 'good' | 'damaged' | 'dangerous';
  dangerLevel: number; // 1-10
  travelTimeBase: number; // Minutes for average squad
  landmarks: string[];
  speedModifier: number; // Multiplier for travel speed
  encounterChance: number; // % chance per mile traveled
  roadType: 'interstate' | 'highway' | 'minor';
  curveControlPoints?: { x: number; y: number }[]; // For Bezier curves (percentage coordinates)
}

export const CALIFORNIA_ROADS: RoadSegment[] = [
  // ========== INTERSTATE 5 - Main North-South Artery ==========
  // I-5 runs from Redding in the north through Shady Sands to Boneyard and Dayglow
  
  {
    id: 'i5-north-4',
    name: 'Interstate 5 - Far North (Sacramento to Redding)',
    fromLocationId: 'san-francisco', // Connection point
    toLocationId: 'redding',
    distanceMiles: 120,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 240,
    landmarks: ['Mutant Territory', 'Collapsed Bridge'],
    speedModifier: 0.6,
    encounterChance: 0.12,
    roadType: 'interstate',
    curveControlPoints: [{ x: 22, y: 28 }]
  },

  {
    id: 'i5-north-3',
    name: 'Interstate 5 - Northern Section (Gecko to San Francisco Area)',
    fromLocationId: 'gecko',
    toLocationId: 'san-francisco',
    distanceMiles: 85,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 140,
    landmarks: ['Old Truck Stop', 'NCR Checkpoint'],
    speedModifier: 1.0,
    encounterChance: 0.06,
    roadType: 'interstate',
    curveControlPoints: [{ x: 24, y: 45 }]
  },

  {
    id: 'i5-north-2',
    name: 'Interstate 5 - North Central (Shady Sands to Gecko)',
    fromLocationId: 'shady-sands',
    toLocationId: 'gecko',
    distanceMiles: 90,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 150,
    landmarks: ['Caravan Rest Stop', 'Brahmin Crossing'],
    speedModifier: 1.0,
    encounterChance: 0.05,
    roadType: 'interstate',
    curveControlPoints: [{ x: 31, y: 56 }]
  },

  {
    id: 'i5-north-1',
    name: 'Interstate 5 - NCR Patrol Zone (Near Shady Sands North)',
    fromLocationId: 'ncr-patrol-north',
    toLocationId: 'shady-sands',
    distanceMiles: 45,
    condition: 'good',
    dangerLevel: 2,
    travelTimeBase: 75,
    landmarks: ['NCR Checkpoint', 'Deathclaw Pass Warning'],
    speedModifier: 1.0,
    encounterChance: 0.03,
    roadType: 'interstate',
    curveControlPoints: [{ x: 31, y: 60 }]
  },

  {
    id: 'i5-mid-1',
    name: 'Interstate 5 - Central (Shady Sands to Highway Tollbooth)',
    fromLocationId: 'shady-sands',
    toLocationId: 'highway-tollbooth',
    distanceMiles: 40,
    condition: 'good',
    dangerLevel: 5,
    travelTimeBase: 80,
    landmarks: ['Raider Territory Warning'],
    speedModifier: 0.9,
    encounterChance: 0.10,
    roadType: 'interstate',
    curveControlPoints: []
  },

  {
    id: 'i5-south-1',
    name: 'Interstate 5 - South Section (Shady Sands to Junktown)',
    fromLocationId: 'shady-sands',
    toLocationId: 'junktown',
    distanceMiles: 75,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 125,
    landmarks: ['Vault 15 Turnoff', 'NCR Patrol Route'],
    speedModifier: 1.0,
    encounterChance: 0.04,
    roadType: 'interstate',
    curveControlPoints: [{ x: 33, y: 70 }]
  },

  {
    id: 'i5-south-2',
    name: 'Interstate 5 - LA Approach (Junktown to Boneyard)',
    fromLocationId: 'junktown',
    toLocationId: 'boneyard',
    distanceMiles: 35,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 90,
    landmarks: ['Ruins Begin', 'Raider Ambush Sites'],
    speedModifier: 0.7,
    encounterChance: 0.11,
    roadType: 'interstate',
    curveControlPoints: [{ x: 30, y: 77 }]
  },

  {
    id: 'i5-south-3',
    name: 'Interstate 5 - Southern Terminus (Boneyard to Dayglow)',
    fromLocationId: 'boneyard',
    toLocationId: 'dayglow',
    distanceMiles: 70,
    condition: 'good',
    dangerLevel: 5,
    travelTimeBase: 130,
    landmarks: ['Coastal Views', 'Ghoul Territory'],
    speedModifier: 0.9,
    encounterChance: 0.07,
    roadType: 'interstate',
    curveControlPoints: [{ x: 29, y: 85 }]
  },

  // ========== INTERSTATE 15 - Northeast Route to Vegas ==========
  
  {
    id: 'i15-west-1',
    name: 'Interstate 15 - Western Section (Boneyard to Hub)',
    fromLocationId: 'boneyard',
    toLocationId: 'hub',
    distanceMiles: 85,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 170,
    landmarks: ['Desert Wasteland', 'Abandoned Towns'],
    speedModifier: 0.7,
    encounterChance: 0.09,
    roadType: 'interstate',
    curveControlPoints: [{ x: 35, y: 75 }]
  },

  {
    id: 'i15-west-2',
    name: 'Interstate 15 - Hub Connection',
    fromLocationId: 'hub',
    toLocationId: 'caravan-waystation',
    distanceMiles: 40,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 70,
    landmarks: ['Trade Route', 'Caravan Signs'],
    speedModifier: 1.0,
    encounterChance: 0.05,
    roadType: 'interstate',
    curveControlPoints: []
  },

  {
    id: 'i15-west-3',
    name: 'Interstate 15 - Fort Irwin Bypass',
    fromLocationId: 'caravan-waystation',
    toLocationId: 'fort-irwin',
    distanceMiles: 32,
    condition: 'dangerous',
    dangerLevel: 7,
    travelTimeBase: 100,
    landmarks: ['Military Warning Signs', 'Robot Patrols'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'interstate',
    curveControlPoints: [{ x: 36, y: 71 }]
  },

  {
    id: 'i15-east-1',
    name: 'Interstate 15 - Mojave Desert (Hub to Route 66)',
    fromLocationId: 'hub',
    toLocationId: 'new-vegas',
    distanceMiles: 140,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 300,
    landmarks: ['Endless Desert', 'Deathclaw Territory', 'Mojave Outpost'],
    speedModifier: 0.6,
    encounterChance: 0.10,
    roadType: 'interstate',
    curveControlPoints: [{ x: 55, y: 68 }, { x: 72, y: 62 }]
  },

  // ========== HIGHWAY 99 - Central Valley Route ==========
  
  {
    id: 'hwy99-north-1',
    name: 'Highway 99 - Northern Valley',
    fromLocationId: 'shady-sands',
    toLocationId: 'gecko',
    distanceMiles: 90,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 160,
    landmarks: ['Farmland Ruins', 'Brahmin Herds'],
    speedModifier: 0.9,
    encounterChance: 0.05,
    roadType: 'highway',
    curveControlPoints: [{ x: 31, y: 55 }]
  },

  {
    id: 'hwy99-north-2',
    name: 'Highway 99 - Far North Section',
    fromLocationId: 'gecko',
    toLocationId: 'redding',
    distanceMiles: 150,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 280,
    landmarks: ['Mining Territory', 'Raider Checkpoints'],
    speedModifier: 0.7,
    encounterChance: 0.08,
    roadType: 'highway',
    curveControlPoints: [{ x: 29, y: 32 }]
  },

  {
    id: 'hwy99-south-1',
    name: 'Highway 99 - South Valley (Shady Sands to Waystation)',
    fromLocationId: 'shady-sands',
    toLocationId: 'caravan-waystation',
    distanceMiles: 42,
    condition: 'good',
    dangerLevel: 2,
    travelTimeBase: 70,
    landmarks: ['Caravan Route', 'Trade Signs'],
    speedModifier: 1.0,
    encounterChance: 0.03,
    roadType: 'highway',
    curveControlPoints: [{ x: 35, y: 66 }]
  },

  {
    id: 'hwy99-south-2',
    name: 'Highway 99 - Hub Connection',
    fromLocationId: 'caravan-waystation',
    toLocationId: 'hub',
    distanceMiles: 43,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 75,
    landmarks: ['Trading Post Ruins'],
    speedModifier: 1.0,
    encounterChance: 0.04,
    roadType: 'highway',
    curveControlPoints: [{ x: 40, y: 69 }]
  },

  {
    id: 'hwy99-south-3',
    name: 'Highway 99 - Junktown Route',
    fromLocationId: 'junktown',
    toLocationId: 'greenfield-ruins',
    distanceMiles: 30,
    condition: 'dangerous',
    dangerLevel: 6,
    travelTimeBase: 90,
    landmarks: ['Irradiated Zone Warning', 'Ghoul Territory'],
    speedModifier: 0.6,
    encounterChance: 0.12,
    roadType: 'highway',
    curveControlPoints: []
  },

  // ========== HIGHWAY 101 - Coastal Route ==========
  
  {
    id: 'hwy101-north-4',
    name: 'Highway 101 - Far North Coast (To Navarro)',
    fromLocationId: 'san-francisco',
    toLocationId: 'enclave-navarro',
    distanceMiles: 95,
    condition: 'dangerous',
    dangerLevel: 10,
    travelTimeBase: 250,
    landmarks: ['Enclave Patrols', 'Vertibird Sightings', 'Restricted Zone'],
    speedModifier: 0.5,
    encounterChance: 0.20,
    roadType: 'highway',
    curveControlPoints: [{ x: 18, y: 25 }]
  },

  {
    id: 'hwy101-north-3',
    name: 'Highway 101 - Bay Area (Vault 13 to San Francisco)',
    fromLocationId: 'vault-13',
    toLocationId: 'san-francisco',
    distanceMiles: 100,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 200,
    landmarks: ['Coastal Cliffs', 'Fog Banks'],
    speedModifier: 0.7,
    encounterChance: 0.07,
    roadType: 'highway',
    curveControlPoints: [{ x: 14, y: 50 }]
  },

  {
    id: 'hwy101-north-1',
    name: 'Highway 101 - North Central Coast (Lost Hills to Vault 13)',
    fromLocationId: 'lost-hills',
    toLocationId: 'vault-13',
    distanceMiles: 65,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 120,
    landmarks: ['Mountain Passes', 'Hidden Paths'],
    speedModifier: 0.8,
    encounterChance: 0.06,
    roadType: 'highway',
    curveControlPoints: [{ x: 16, y: 64 }]
  },

  {
    id: 'hwy101-mid-1',
    name: 'Highway 101 - Central Coast (Player Area to Lost Hills)',
    fromLocationId: 'player-outpost',
    toLocationId: 'lost-hills',
    distanceMiles: 45,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 85,
    landmarks: ['Coastal Views', 'Pre-war Beach'],
    speedModifier: 0.9,
    encounterChance: 0.05,
    roadType: 'highway',
    curveControlPoints: [{ x: 22, y: 69 }]
  },

  {
    id: 'hwy101-mid-2',
    name: 'Highway 101 - Slaver Territory',
    fromLocationId: 'player-outpost',
    toLocationId: 'chains-camp',
    distanceMiles: 28,
    condition: 'dangerous',
    dangerLevel: 6,
    travelTimeBase: 85,
    landmarks: ['Slaver Patrols', 'Slave Cages'],
    speedModifier: 0.6,
    encounterChance: 0.13,
    roadType: 'highway',
    curveControlPoints: []
  },

  {
    id: 'hwy101-south-1',
    name: 'Highway 101 - South Coast (Player Area to Rust Creek)',
    fromLocationId: 'player-outpost',
    toLocationId: 'rust-creek-station',
    distanceMiles: 18,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 35,
    landmarks: ['Old Gas Stations', 'Scavenger Signs'],
    speedModifier: 1.0,
    encounterChance: 0.04,
    roadType: 'highway',
    curveControlPoints: []
  },

  {
    id: 'hwy101-south-2',
    name: 'Highway 101 - LA Approach (Rust Creek to Boneyard)',
    fromLocationId: 'rust-creek-station',
    toLocationId: 'boneyard',
    distanceMiles: 55,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 130,
    landmarks: ['Urban Ruins Begin', 'Raider Territory'],
    speedModifier: 0.7,
    encounterChance: 0.10,
    roadType: 'highway',
    curveControlPoints: [{ x: 26, y: 76 }]
  },

  {
    id: 'hwy101-south-3',
    name: 'Highway 101 - Necropolis Route',
    fromLocationId: 'boneyard',
    toLocationId: 'necropolis',
    distanceMiles: 10,
    condition: 'dangerous',
    dangerLevel: 7,
    travelTimeBase: 35,
    landmarks: ['Irradiated Zone', 'Ghoul Territory'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'highway',
    curveControlPoints: []
  },

  {
    id: 'hwy101-south-4',
    name: 'Highway 101 - Far South Coast (Boneyard to Dayglow)',
    fromLocationId: 'boneyard',
    toLocationId: 'dayglow',
    distanceMiles: 70,
    condition: 'good',
    dangerLevel: 5,
    travelTimeBase: 125,
    landmarks: ['Coastal Highway', 'Ghoul Settlements'],
    speedModifier: 0.9,
    encounterChance: 0.07,
    roadType: 'highway',
    curveControlPoints: [{ x: 29, y: 85 }]
  },

  // ========== INTERSTATE 80 - East-West Northern Route ==========
  
  {
    id: 'i80-west-1',
    name: 'Interstate 80 - Western (Shady Sands to San Francisco)',
    fromLocationId: 'shady-sands',
    toLocationId: 'san-francisco',
    distanceMiles: 155,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 280,
    landmarks: ['Mountain Passes', 'Old Ski Resorts'],
    speedModifier: 0.7,
    encounterChance: 0.08,
    roadType: 'interstate',
    curveControlPoints: [{ x: 22, y: 52 }]
  },

  {
    id: 'i80-west-2',
    name: 'Interstate 80 - Bay Area Connector',
    fromLocationId: 'san-francisco',
    toLocationId: 'gecko',
    distanceMiles: 70,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 120,
    landmarks: ['Bay Bridge Ruins', 'Trade Route'],
    speedModifier: 0.9,
    encounterChance: 0.05,
    roadType: 'interstate',
    curveControlPoints: [{ x: 24, y: 45 }]
  },

  {
    id: 'i80-east-1',
    name: 'Interstate 80 - Eastern Section (Gecko to New Reno)',
    fromLocationId: 'gecko',
    toLocationId: 'new-reno',
    distanceMiles: 130,
    condition: 'dangerous',
    dangerLevel: 7,
    travelTimeBase: 300,
    landmarks: ['Crime Family Territory', 'Mountain Passes'],
    speedModifier: 0.6,
    encounterChance: 0.12,
    roadType: 'interstate',
    curveControlPoints: [{ x: 40, y: 35 }]
  },

  // ========== OLD ROUTE 66 - Historic Desert Highway ==========
  
  {
    id: 'route66-east-1',
    name: 'Old Route 66 - Western Section (Hub to Needles)',
    fromLocationId: 'hub',
    toLocationId: 'new-vegas',
    distanceMiles: 135,
    condition: 'dangerous',
    dangerLevel: 8,
    travelTimeBase: 320,
    landmarks: ['Raider Tollbooths', 'Deathclaw Territory', 'Abandoned Motels'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'highway',
    curveControlPoints: [{ x: 58, y: 70 }, { x: 75, y: 64 }]
  },

  {
    id: 'route66-east-2',
    name: 'Old Route 66 - Mojave Stretch (Needles to New Vegas)',
    fromLocationId: 'new-vegas',
    toLocationId: 'hub',
    distanceMiles: 135,
    condition: 'dangerous',
    dangerLevel: 8,
    travelTimeBase: 320,
    landmarks: ['Cazador Nests', 'Powder Ganger Territory'],
    speedModifier: 0.5,
    encounterChance: 0.16,
    roadType: 'highway',
    curveControlPoints: [{ x: 75, y: 64 }, { x: 58, y: 70 }]
  },

  // ========== INTERSTATE 40 - Support Route ==========
  
  {
    id: 'i40-west-1',
    name: 'Interstate 40 - Connector (Hub to Needles)',
    fromLocationId: 'hub',
    toLocationId: 'new-vegas',
    distanceMiles: 150,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 280,
    landmarks: ['Desert Wastelands', 'Dry Lakes'],
    speedModifier: 0.7,
    encounterChance: 0.09,
    roadType: 'interstate',
    curveControlPoints: [{ x: 65, y: 68 }]
  },

  // ========== PLAYER SETTLEMENT ROADS ==========
  
  {
    id: 'player-road-1',
    name: 'Outpost Road - Main Access',
    fromLocationId: 'player-outpost',
    toLocationId: 'shady-sands',
    distanceMiles: 50,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 90,
    landmarks: ['Trade Route', 'NCR Patrols'],
    speedModifier: 0.9,
    encounterChance: 0.05,
    roadType: 'minor',
    curveControlPoints: [{ x: 29, y: 67 }]
  },

  {
    id: 'player-road-2',
    name: 'Outpost Road - Southwest Route',
    fromLocationId: 'player-outpost',
    toLocationId: 'camp-searchlight',
    distanceMiles: 32,
    condition: 'dangerous',
    dangerLevel: 5,
    travelTimeBase: 95,
    landmarks: ['Radiation Warning', 'Abandoned Camp'],
    speedModifier: 0.6,
    encounterChance: 0.11,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'player-road-3',
    name: 'Outpost Road - Viper Territory',
    fromLocationId: 'player-outpost',
    toLocationId: 'vipers-nest',
    distanceMiles: 12,
    condition: 'damaged',
    dangerLevel: 4,
    travelTimeBase: 35,
    landmarks: ['Viper Gang Signs', 'Ambush Points'],
    speedModifier: 0.7,
    encounterChance: 0.10,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'player-road-4',
    name: 'Outpost Road - Northwest Trail',
    fromLocationId: 'player-outpost',
    toLocationId: 'broken-wheel',
    distanceMiles: 24,
    condition: 'damaged',
    dangerLevel: 4,
    travelTimeBase: 70,
    landmarks: ['Hostile Settlement Warning'],
    speedModifier: 0.7,
    encounterChance: 0.09,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'player-road-5',
    name: 'Outpost Road - Vault 15 Path',
    fromLocationId: 'player-outpost',
    toLocationId: 'vault-15',
    distanceMiles: 38,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 110,
    landmarks: ['Raider Territory', 'Collapsed Vault'],
    speedModifier: 0.6,
    encounterChance: 0.12,
    roadType: 'minor',
    curveControlPoints: [{ x: 30, y: 66 }]
  },

  // ========== COMBAT ZONE CONNECTIONS ==========
  
  {
    id: 'combat-road-1',
    name: 'Desert Trail to Scorpion Gulch',
    fromLocationId: 'player-outpost',
    toLocationId: 'scorpion-gulch',
    distanceMiles: 22,
    condition: 'dangerous',
    dangerLevel: 5,
    travelTimeBase: 75,
    landmarks: ['Scorpion Nests', 'Rocky Terrain'],
    speedModifier: 0.6,
    encounterChance: 0.14,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'combat-road-2',
    name: 'Greenfield Access Road',
    fromLocationId: 'caravan-waystation',
    toLocationId: 'greenfield-ruins',
    distanceMiles: 20,
    condition: 'dangerous',
    dangerLevel: 6,
    travelTimeBase: 70,
    landmarks: ['Radiation Zone', 'Ghoul Spotting'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'combat-road-3',
    name: 'Mountain Pass to Deathclaw Territory',
    fromLocationId: 'shady-sands',
    toLocationId: 'deathclaw-pass',
    distanceMiles: 48,
    condition: 'dangerous',
    dangerLevel: 9,
    travelTimeBase: 180,
    landmarks: ['Extreme Danger', 'Deathclaw Tracks'],
    speedModifier: 0.4,
    encounterChance: 0.20,
    roadType: 'minor',
    curveControlPoints: []
  }
];

// Helper function to get roads connected to a location
export const getRoadsForLocation = (locationId: string): RoadSegment[] => {
  return CALIFORNIA_ROADS.filter(
    road => road.fromLocationId === locationId || road.toLocationId === locationId
  );
};

// Helper function to get road by ID
export const getRoadById = (roadId: string): RoadSegment | undefined => {
  return CALIFORNIA_ROADS.find(road => road.id === roadId);
};

// Helper function to get all roads of a specific type
export const getRoadsByType = (type: 'interstate' | 'highway' | 'minor'): RoadSegment[] => {
  return CALIFORNIA_ROADS.filter(road => road.roadType === type);
};
