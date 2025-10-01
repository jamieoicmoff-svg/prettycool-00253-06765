// Fallout California Road Network - V2.0 ACCURATE COORDINATES
// Based on actual California highways adapted for Fallout universe
// Uses percentage-based Bezier curves for realistic road shapes

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
  
  {
    id: 'i5-north-4',
    name: 'Interstate 5 - Far North Section',
    fromLocationId: 'gecko',
    toLocationId: 'redding',
    distanceMiles: 190,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 340,
    landmarks: ['Mutant Territory', 'Collapsed Bridge', 'Mountain Passes'],
    speedModifier: 0.6,
    encounterChance: 0.12,
    roadType: 'interstate',
    curveControlPoints: [{ x: 35, y: 30 }]
  },

  {
    id: 'i5-north-2',
    name: 'Interstate 5 - North Central',
    fromLocationId: 'shady-sands',
    toLocationId: 'gecko',
    distanceMiles: 78,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 130,
    landmarks: ['Caravan Rest Stop', 'Brahmin Crossing'],
    speedModifier: 1.0,
    encounterChance: 0.05,
    roadType: 'interstate',
    curveControlPoints: [{ x: 36, y: 46 }]
  },

  {
    id: 'i5-north-1',
    name: 'Interstate 5 - NCR Patrol Zone',
    fromLocationId: 'ncr-patrol-north',
    toLocationId: 'shady-sands',
    distanceMiles: 80,
    condition: 'good',
    dangerLevel: 2,
    travelTimeBase: 120,
    landmarks: ['NCR Checkpoint', 'Deathclaw Pass Warning'],
    speedModifier: 1.0,
    encounterChance: 0.03,
    roadType: 'interstate',
    curveControlPoints: []
  },

  {
    id: 'i5-mid-1',
    name: 'Interstate 5 - Raider Territory',
    fromLocationId: 'shady-sands',
    toLocationId: 'highway-tollbooth',
    distanceMiles: 64,
    condition: 'good',
    dangerLevel: 5,
    travelTimeBase: 110,
    landmarks: ['Raider Territory Warning', 'Abandoned Vehicles'],
    speedModifier: 0.9,
    encounterChance: 0.10,
    roadType: 'interstate',
    curveControlPoints: []
  },

  {
    id: 'i5-south-1',
    name: 'Interstate 5 - South to Junktown',
    fromLocationId: 'shady-sands',
    toLocationId: 'junktown',
    distanceMiles: 152,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 240,
    landmarks: ['Vault 15 Turnoff', 'NCR Patrol Route'],
    speedModifier: 1.0,
    encounterChance: 0.04,
    roadType: 'interstate',
    curveControlPoints: [{ x: 37, y: 60 }]
  },

  {
    id: 'i5-south-2',
    name: 'Interstate 5 - LA Approach',
    fromLocationId: 'junktown',
    toLocationId: 'boneyard',
    distanceMiles: 145,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 280,
    landmarks: ['Ruins Begin', 'Raider Ambush Sites'],
    speedModifier: 0.7,
    encounterChance: 0.11,
    roadType: 'interstate',
    curveControlPoints: [{ x: 30, y: 76 }]
  },

  // ========== HIGHWAY 99 - Central Valley Route ==========
  
  {
    id: 'hwy99-north-1',
    name: 'Highway 99 - Northern Valley',
    fromLocationId: 'shady-sands',
    toLocationId: 'gecko',
    distanceMiles: 78,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 135,
    landmarks: ['Farmland Ruins', 'Brahmin Herds'],
    speedModifier: 0.9,
    encounterChance: 0.05,
    roadType: 'highway',
    curveControlPoints: [{ x: 36, y: 46 }]
  },

  {
    id: 'hwy99-north-2',
    name: 'Highway 99 - Far North Section',
    fromLocationId: 'gecko',
    toLocationId: 'redding',
    distanceMiles: 195,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 350,
    landmarks: ['Mining Territory', 'Raider Checkpoints'],
    speedModifier: 0.7,
    encounterChance: 0.08,
    roadType: 'highway',
    curveControlPoints: [{ x: 35, y: 30 }]
  },

  {
    id: 'hwy99-south-1',
    name: 'Highway 99 - South Valley',
    fromLocationId: 'shady-sands',
    toLocationId: 'caravan-waystation',
    distanceMiles: 128,
    condition: 'good',
    dangerLevel: 2,
    travelTimeBase: 210,
    landmarks: ['Caravan Route', 'Trade Signs'],
    speedModifier: 1.0,
    encounterChance: 0.03,
    roadType: 'highway',
    curveControlPoints: [{ x: 40, y: 58 }]
  },

  {
    id: 'hwy99-south-2',
    name: 'Highway 99 - Hub Connection',
    fromLocationId: 'caravan-waystation',
    toLocationId: 'hub',
    distanceMiles: 70,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 115,
    landmarks: ['Trading Post Ruins', 'Desert Caravans'],
    speedModifier: 1.0,
    encounterChance: 0.04,
    roadType: 'highway',
    curveControlPoints: [{ x: 48, y: 68 }]
  },

  // ========== MAJOR SETTLEMENT CONNECTIONS ==========
  
  {
    id: 'shady-to-vault15',
    name: 'Road to Vault 15',
    fromLocationId: 'shady-sands',
    toLocationId: 'vault-15',
    distanceMiles: 68,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 140,
    landmarks: ['Raider Territory', 'Collapsed Vault Entrance'],
    speedModifier: 0.7,
    encounterChance: 0.10,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'v15-to-junktown',
    name: 'Vault 15 to Junktown',
    fromLocationId: 'vault-15',
    toLocationId: 'junktown',
    distanceMiles: 85,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 155,
    landmarks: ['Desert Trails', 'Scavenger Signs'],
    speedModifier: 0.85,
    encounterChance: 0.06,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'junktown-to-hub',
    name: 'Trade Route to Hub',
    fromLocationId: 'junktown',
    toLocationId: 'hub',
    distanceMiles: 95,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 160,
    landmarks: ['Caravan Signs', 'Water Stops'],
    speedModifier: 0.95,
    encounterChance: 0.04,
    roadType: 'highway',
    curveControlPoints: [{ x: 46, y: 70 }]
  },

  {
    id: 'hub-to-boneyard',
    name: 'Hub to Boneyard Highway',
    fromLocationId: 'hub',
    toLocationId: 'boneyard',
    distanceMiles: 145,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 270,
    landmarks: ['Desert Wasteland', 'Urban Ruins Approach'],
    speedModifier: 0.75,
    encounterChance: 0.08,
    roadType: 'highway',
    curveControlPoints: [{ x: 35, y: 78 }]
  },

  {
    id: 'hub-to-vegas',
    name: 'Long 15 to New Vegas',
    fromLocationId: 'hub',
    toLocationId: 'new-vegas',
    distanceMiles: 280,
    condition: 'dangerous',
    dangerLevel: 8,
    travelTimeBase: 650,
    landmarks: ['Mojave Desert', 'Deathclaw Territory', 'Abandoned Motels'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'interstate',
    curveControlPoints: [{ x: 65, y: 68 }, { x: 78, y: 66 }]
  },

  {
    id: 'waystation-to-hub',
    name: 'Waystation to Hub',
    fromLocationId: 'caravan-waystation',
    toLocationId: 'hub',
    distanceMiles: 70,
    condition: 'good',
    dangerLevel: 2,
    travelTimeBase: 115,
    landmarks: ['Caravan Route', 'Safe Passage'],
    speedModifier: 1.0,
    encounterChance: 0.03,
    roadType: 'highway',
    curveControlPoints: []
  },

  {
    id: 'boneyard-to-necropolis',
    name: 'Road to Necropolis',
    fromLocationId: 'boneyard',
    toLocationId: 'necropolis',
    distanceMiles: 22,
    condition: 'dangerous',
    dangerLevel: 7,
    travelTimeBase: 70,
    landmarks: ['Irradiated Zone', 'Ghoul Territory'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'boneyard-to-dayglow',
    name: 'Coastal Highway to Dayglow',
    fromLocationId: 'boneyard',
    toLocationId: 'dayglow',
    distanceMiles: 110,
    condition: 'good',
    dangerLevel: 5,
    travelTimeBase: 195,
    landmarks: ['Coastal Views', 'Ghoul Settlements'],
    speedModifier: 0.9,
    encounterChance: 0.07,
    roadType: 'highway',
    curveControlPoints: [{ x: 23, y: 90 }]
  },

  // ========== NORTHERN CALIFORNIA ROADS ==========
  
  {
    id: 'sf-to-gecko',
    name: 'Bay Area to Gecko',
    fromLocationId: 'san-francisco',
    toLocationId: 'gecko',
    distanceMiles: 135,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 230,
    landmarks: ['Bay Bridge Ruins', 'Central Valley'],
    speedModifier: 0.9,
    encounterChance: 0.05,
    roadType: 'interstate',
    curveControlPoints: [{ x: 25, y: 45 }]
  },

  {
    id: 'v13-to-sf',
    name: 'Vault 13 to San Francisco',
    fromLocationId: 'vault-13',
    toLocationId: 'san-francisco',
    distanceMiles: 48,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 105,
    landmarks: ['Coastal Cliffs', 'Mountain Roads'],
    speedModifier: 0.7,
    encounterChance: 0.07,
    roadType: 'highway',
    curveControlPoints: []
  },

  {
    id: 'v13-to-losthills',
    name: 'Vault 13 to Lost Hills',
    fromLocationId: 'vault-13',
    toLocationId: 'lost-hills',
    distanceMiles: 135,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 245,
    landmarks: ['Hidden Paths', 'Mountain Passes'],
    speedModifier: 0.8,
    encounterChance: 0.06,
    roadType: 'minor',
    curveControlPoints: [{ x: 15, y: 60 }]
  },

  {
    id: 'sf-to-navarro',
    name: 'Highway 101 North',
    fromLocationId: 'san-francisco',
    toLocationId: 'enclave-navarro',
    distanceMiles: 215,
    condition: 'dangerous',
    dangerLevel: 10,
    travelTimeBase: 550,
    landmarks: ['Enclave Patrols', 'Vertibird Sightings', 'Restricted Zone'],
    speedModifier: 0.5,
    encounterChance: 0.20,
    roadType: 'highway',
    curveControlPoints: [{ x: 10, y: 30 }]
  },

  {
    id: 'gecko-to-newreno',
    name: 'Road to New Reno',
    fromLocationId: 'gecko',
    toLocationId: 'new-reno',
    distanceMiles: 165,
    condition: 'dangerous',
    dangerLevel: 7,
    travelTimeBase: 380,
    landmarks: ['Crime Family Territory', 'Mountain Passes'],
    speedModifier: 0.6,
    encounterChance: 0.12,
    roadType: 'highway',
    curveControlPoints: [{ x: 48, y: 35 }]
  },

  {
    id: 'newreno-to-vaultcity',
    name: 'New Reno to Vault City',
    fromLocationId: 'new-reno',
    toLocationId: 'vault-city',
    distanceMiles: 58,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 105,
    landmarks: ['Trade Route', 'Patrol Zone'],
    speedModifier: 0.9,
    encounterChance: 0.05,
    roadType: 'highway',
    curveControlPoints: []
  },

  // ========== PLAYER OUTPOST CONNECTIONS ==========
  
  {
    id: 'player-to-shady',
    name: 'Outpost to Shady Sands',
    fromLocationId: 'player-outpost',
    toLocationId: 'shady-sands',
    distanceMiles: 185,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 310,
    landmarks: ['Coastal Highway', 'NCR Patrols'],
    speedModifier: 0.9,
    encounterChance: 0.05,
    roadType: 'highway',
    curveControlPoints: [{ x: 25, y: 60 }]
  },

  {
    id: 'player-to-losthills',
    name: 'Outpost to Lost Hills',
    fromLocationId: 'player-outpost',
    toLocationId: 'lost-hills',
    distanceMiles: 42,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 80,
    landmarks: ['Coastal Road', 'Hidden Paths'],
    speedModifier: 0.8,
    encounterChance: 0.06,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'player-to-rustcreek',
    name: 'Outpost to Rust Creek',
    fromLocationId: 'player-outpost',
    toLocationId: 'rust-creek-station',
    distanceMiles: 52,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 95,
    landmarks: ['Old Highway', 'Scavenger Territory'],
    speedModifier: 0.85,
    encounterChance: 0.05,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'player-to-vipers',
    name: 'Outpost to Viper Camp',
    fromLocationId: 'player-outpost',
    toLocationId: 'vipers-nest',
    distanceMiles: 88,
    condition: 'damaged',
    dangerLevel: 4,
    travelTimeBase: 170,
    landmarks: ['Viper Gang Signs', 'Ambush Points'],
    speedModifier: 0.7,
    encounterChance: 0.10,
    roadType: 'minor',
    curveControlPoints: [{ x: 18, y: 67 }]
  },

  {
    id: 'player-to-chains',
    name: 'Outpost to Slaver Camp',
    fromLocationId: 'player-outpost',
    toLocationId: 'chains-camp',
    distanceMiles: 64,
    condition: 'dangerous',
    dangerLevel: 6,
    travelTimeBase: 140,
    landmarks: ['Slaver Patrols', 'Slave Cages'],
    speedModifier: 0.6,
    encounterChance: 0.13,
    roadType: 'minor',
    curveControlPoints: []
  },

  // ========== COMBAT ZONE ACCESS ROADS ==========
  
  {
    id: 'scorpion-access',
    name: 'Desert Trail to Scorpion Gulch',
    fromLocationId: 'shady-sands',
    toLocationId: 'scorpion-gulch',
    distanceMiles: 158,
    condition: 'dangerous',
    dangerLevel: 5,
    travelTimeBase: 330,
    landmarks: ['Scorpion Nests', 'Rocky Terrain'],
    speedModifier: 0.6,
    encounterChance: 0.14,
    roadType: 'minor',
    curveControlPoints: [{ x: 32, y: 58 }]
  },

  {
    id: 'brokenwheel-access',
    name: 'Road to Broken Wheel',
    fromLocationId: 'shady-sands',
    toLocationId: 'broken-wheel',
    distanceMiles: 98,
    condition: 'damaged',
    dangerLevel: 4,
    travelTimeBase: 190,
    landmarks: ['Hostile Settlement Warning', 'Farmland'],
    speedModifier: 0.7,
    encounterChance: 0.09,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'greenfield-access',
    name: 'Road to Greenfield Ruins',
    fromLocationId: 'hub',
    toLocationId: 'greenfield-ruins',
    distanceMiles: 42,
    condition: 'dangerous',
    dangerLevel: 6,
    travelTimeBase: 110,
    landmarks: ['Radiation Zone', 'Ghoul Spotting'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'fortirwin-access',
    name: 'Military Access Road',
    fromLocationId: 'hub',
    toLocationId: 'fort-irwin',
    distanceMiles: 65,
    condition: 'dangerous',
    dangerLevel: 7,
    travelTimeBase: 170,
    landmarks: ['Military Warning Signs', 'Robot Patrols'],
    speedModifier: 0.5,
    encounterChance: 0.16,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'deathclaw-access',
    name: 'Mountain Pass (EXTREME DANGER)',
    fromLocationId: 'shady-sands',
    toLocationId: 'deathclaw-pass',
    distanceMiles: 58,
    condition: 'dangerous',
    dangerLevel: 9,
    travelTimeBase: 210,
    landmarks: ['Extreme Danger', 'Deathclaw Tracks', 'Abandoned Vehicles'],
    speedModifier: 0.4,
    encounterChance: 0.25,
    roadType: 'minor',
    curveControlPoints: [{ x: 38, y: 48 }]
  },

  {
    id: 'searchlight-access',
    name: 'Irradiated Road to Searchlight',
    fromLocationId: 'player-outpost',
    toLocationId: 'camp-searchlight',
    distanceMiles: 62,
    condition: 'dangerous',
    dangerLevel: 5,
    travelTimeBase: 160,
    landmarks: ['Radiation Warning', 'Abandoned Camp'],
    speedModifier: 0.5,
    encounterChance: 0.12,
    roadType: 'minor',
    curveControlPoints: []
  },

  {
    id: 'mariposa-access',
    name: 'Hidden Military Road',
    fromLocationId: 'gecko',
    toLocationId: 'mariposa',
    distanceMiles: 85,
    condition: 'dangerous',
    dangerLevel: 9,
    travelTimeBase: 280,
    landmarks: ['Super Mutant Patrols', 'FEV Warning Signs'],
    speedModifier: 0.4,
    encounterChance: 0.18,
    roadType: 'minor',
    curveControlPoints: [{ x: 32, y: 40 }]
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

// Helper to get road between two locations
export const getRoadBetweenLocations = (loc1: string, loc2: string): RoadSegment | undefined => {
  return CALIFORNIA_ROADS.find(road => 
    (road.fromLocationId === loc1 && road.toLocationId === loc2) ||
    (road.fromLocationId === loc2 && road.toLocationId === loc1)
  );
};
