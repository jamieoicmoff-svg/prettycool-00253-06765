// Fallout California Road Network
// Pre-war highways and roads connecting settlements

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
}

export const CALIFORNIA_ROADS: RoadSegment[] = [
  // INTERSTATE 5 - Main North-South Artery
  {
    id: 'i5-north-1',
    name: 'Interstate 5 North (Shady Sands to Modoc Connector)',
    fromLocationId: 'shady-sands',
    toLocationId: 'vault-13',
    distanceMiles: 80,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 160,
    landmarks: ['Vault 15 Exit', 'Old Rest Stop'],
    speedModifier: 1.0,
    encounterChance: 0.05,
    roadType: 'interstate'
  },
  {
    id: 'i5-north-2',
    name: 'Interstate 5 North (Vault 13 to Modoc)',
    fromLocationId: 'vault-13',
    toLocationId: 'modoc',
    distanceMiles: 80,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 200,
    landmarks: ['Mutant Patrols', 'Collapsed Overpass'],
    speedModifier: 0.7,
    encounterChance: 0.08,
    roadType: 'interstate'
  },
  {
    id: 'i5-north-3',
    name: 'Interstate 5 North (Modoc to Redding)',
    fromLocationId: 'modoc',
    toLocationId: 'redding',
    distanceMiles: 40,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 80,
    landmarks: ['Mining Camps', 'Brahmin Ranches'],
    speedModifier: 1.0,
    encounterChance: 0.06,
    roadType: 'interstate'
  },
  {
    id: 'i5-south-1',
    name: 'Interstate 5 South (Shady Sands to Hub Connector)',
    fromLocationId: 'shady-sands',
    toLocationId: 'scorpion-nest',
    distanceMiles: 55,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 110,
    landmarks: ['Scorpion Valley', 'Old Gas Station'],
    speedModifier: 1.0,
    encounterChance: 0.07,
    roadType: 'interstate'
  },
  {
    id: 'i5-south-2',
    name: 'Interstate 5 South (Scorpion Nest to Hub)',
    fromLocationId: 'scorpion-nest',
    toLocationId: 'hub',
    distanceMiles: 65,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 130,
    landmarks: ['Trade Checkpoints', 'Caravan Routes'],
    speedModifier: 1.0,
    encounterChance: 0.04,
    roadType: 'interstate'
  },
  {
    id: 'i5-south-3',
    name: 'Interstate 5 South (Hub to Boneyard)',
    fromLocationId: 'hub',
    toLocationId: 'boneyard',
    distanceMiles: 30,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 75,
    landmarks: ['Necropolis Junction', 'Radiation Zone'],
    speedModifier: 0.7,
    encounterChance: 0.10,
    roadType: 'interstate'
  },
  {
    id: 'i5-south-4',
    name: 'Interstate 5 South (Boneyard to Dayglow)',
    fromLocationId: 'boneyard',
    toLocationId: 'dayglow',
    distanceMiles: 30,
    condition: 'dangerous',
    dangerLevel: 8,
    travelTimeBase: 90,
    landmarks: ['Glowing Craters', 'Mutant Territory'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'interstate'
  },

  // HIGHWAY 99 - Parallel Route
  {
    id: 'hwy99-north-1',
    name: 'Highway 99 North (Shady Sands to Den Connector)',
    fromLocationId: 'shady-sands',
    toLocationId: 'modoc',
    distanceMiles: 160,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 400,
    landmarks: ['Raider Territories', 'Abandoned Towns'],
    speedModifier: 0.6,
    encounterChance: 0.12,
    roadType: 'highway'
  },
  {
    id: 'hwy99-north-2',
    name: 'Highway 99 North (Modoc to Den)',
    fromLocationId: 'modoc',
    toLocationId: 'den',
    distanceMiles: 15,
    condition: 'damaged',
    dangerLevel: 7,
    travelTimeBase: 40,
    landmarks: ['Slaver Patrols', 'Drug Routes'],
    speedModifier: 0.6,
    encounterChance: 0.15,
    roadType: 'highway'
  },
  {
    id: 'hwy99-north-3',
    name: 'Highway 99 North (Den to Redding)',
    fromLocationId: 'den',
    toLocationId: 'redding',
    distanceMiles: 55,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 140,
    landmarks: ['Mining Convoys', 'Raider Ambush Points'],
    speedModifier: 0.7,
    encounterChance: 0.10,
    roadType: 'highway'
  },
  {
    id: 'hwy99-south-1',
    name: 'Highway 99 South (Shady Sands to Junktown)',
    fromLocationId: 'shady-sands',
    toLocationId: 'junktown',
    distanceMiles: 90,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 180,
    landmarks: ['Scrap Yards', 'Trader Camps'],
    speedModifier: 0.9,
    encounterChance: 0.06,
    roadType: 'highway'
  },
  {
    id: 'hwy99-south-2',
    name: 'Highway 99 South (Junktown to Hub)',
    fromLocationId: 'junktown',
    toLocationId: 'hub',
    distanceMiles: 30,
    condition: 'good',
    dangerLevel: 3,
    travelTimeBase: 60,
    landmarks: ['Trade Caravans', 'Guard Posts'],
    speedModifier: 1.0,
    encounterChance: 0.04,
    roadType: 'highway'
  },

  // INTERSTATE 80 - East-West Route
  {
    id: 'i80-west-1',
    name: 'Interstate 80 West (Shady Sands to Lost Hills Connector)',
    fromLocationId: 'shady-sands',
    toLocationId: 'mutant-stronghold',
    distanceMiles: 105,
    condition: 'damaged',
    dangerLevel: 7,
    travelTimeBase: 260,
    landmarks: ['Super Mutant Patrols', 'Abandoned Bunkers'],
    speedModifier: 0.6,
    encounterChance: 0.12,
    roadType: 'interstate'
  },
  {
    id: 'i80-west-2',
    name: 'Interstate 80 West (Mutant Stronghold to Lost Hills)',
    fromLocationId: 'mutant-stronghold',
    toLocationId: 'lost-hills',
    distanceMiles: 25,
    condition: 'dangerous',
    dangerLevel: 8,
    travelTimeBase: 75,
    landmarks: ['BOS Patrols', 'Minefield'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'interstate'
  },
  {
    id: 'i80-west-3',
    name: 'Interstate 80 West (Lost Hills to San Francisco)',
    fromLocationId: 'lost-hills',
    toLocationId: 'san-francisco',
    distanceMiles: 95,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 240,
    landmarks: ['Coastal Views', 'Raider Camps'],
    speedModifier: 0.7,
    encounterChance: 0.10,
    roadType: 'interstate'
  },
  {
    id: 'i80-east-1',
    name: 'Interstate 80 East (Shady Sands to Gecko Connector)',
    fromLocationId: 'shady-sands',
    toLocationId: 'player-outpost',
    distanceMiles: 52,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 105,
    landmarks: ['Settlement Road', 'Supply Depots'],
    speedModifier: 0.9,
    encounterChance: 0.06,
    roadType: 'interstate'
  },
  {
    id: 'i80-east-2',
    name: 'Interstate 80 East (Player Outpost to Gecko)',
    fromLocationId: 'player-outpost',
    toLocationId: 'gecko',
    distanceMiles: 68,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 170,
    landmarks: ['Deathclaw Territory', 'Power Lines'],
    speedModifier: 0.7,
    encounterChance: 0.09,
    roadType: 'interstate'
  },

  // OLD ROUTE 66 - Historic Desert Highway
  {
    id: 'route66-west-1',
    name: 'Old Route 66 West (Junktown to Gecko Connector)',
    fromLocationId: 'junktown',
    toLocationId: 'raiders-canyon',
    distanceMiles: 25,
    condition: 'dangerous',
    dangerLevel: 6,
    travelTimeBase: 75,
    landmarks: ['Raider Ambush Points', 'Canyon Overlook'],
    speedModifier: 0.5,
    encounterChance: 0.14,
    roadType: 'highway'
  },
  {
    id: 'route66-east-1',
    name: 'Old Route 66 East (Raiders Canyon to Gecko)',
    fromLocationId: 'raiders-canyon',
    toLocationId: 'gecko',
    distanceMiles: 55,
    condition: 'damaged',
    dangerLevel: 5,
    travelTimeBase: 140,
    landmarks: ['Desert Wastes', 'Abandoned Motels'],
    speedModifier: 0.7,
    encounterChance: 0.08,
    roadType: 'highway'
  },
  {
    id: 'route66-east-2',
    name: 'Old Route 66 East (Gecko to Khan Territory)',
    fromLocationId: 'gecko',
    toLocationId: 'khan-territory',
    distanceMiles: 25,
    condition: 'dangerous',
    dangerLevel: 7,
    travelTimeBase: 75,
    landmarks: ['Khan Camps', 'Drug Labs'],
    speedModifier: 0.5,
    encounterChance: 0.16,
    roadType: 'highway'
  },
  {
    id: 'route66-east-3',
    name: 'Old Route 66 East (Khan Territory to New Vegas)',
    fromLocationId: 'khan-territory',
    toLocationId: 'new-vegas',
    distanceMiles: 55,
    condition: 'good',
    dangerLevel: 6,
    travelTimeBase: 110,
    landmarks: ['Securitron Patrols', 'The Strip Signs'],
    speedModifier: 1.0,
    encounterChance: 0.07,
    roadType: 'highway'
  },

  // INTERSTATE 15 - Northeast Corridor
  {
    id: 'i15-north-1',
    name: 'Interstate 15 North (Gecko to New Vegas)',
    fromLocationId: 'gecko',
    toLocationId: 'cazador-nest',
    distanceMiles: 45,
    condition: 'dangerous',
    dangerLevel: 9,
    travelTimeBase: 135,
    landmarks: ['Cazador Swarms', 'Warning Signs'],
    speedModifier: 0.5,
    encounterChance: 0.20,
    roadType: 'interstate'
  },
  {
    id: 'i15-north-2',
    name: 'Interstate 15 North (Cazador Nest to New Vegas)',
    fromLocationId: 'cazador-nest',
    toLocationId: 'new-vegas',
    distanceMiles: 35,
    condition: 'good',
    dangerLevel: 5,
    travelTimeBase: 70,
    landmarks: ['Vegas Outskirts', 'Securitron Checkpoints'],
    speedModifier: 1.0,
    encounterChance: 0.05,
    roadType: 'interstate'
  },

  // HIGHWAY 101 - Coastal Route
  {
    id: 'hwy101-north-1',
    name: 'Highway 101 North (Boneyard to San Francisco)',
    fromLocationId: 'boneyard',
    toLocationId: 'san-francisco',
    distanceMiles: 185,
    condition: 'damaged',
    dangerLevel: 6,
    travelTimeBase: 460,
    landmarks: ['Coastal Cliffs', 'Sea Creature Nests'],
    speedModifier: 0.6,
    encounterChance: 0.10,
    roadType: 'highway'
  },
  {
    id: 'hwy101-south-1',
    name: 'Highway 101 South (Boneyard to Dayglow)',
    fromLocationId: 'boneyard',
    toLocationId: 'dayglow',
    distanceMiles: 30,
    condition: 'dangerous',
    dangerLevel: 8,
    travelTimeBase: 90,
    landmarks: ['Radiation Beaches', 'Mutant Camps'],
    speedModifier: 0.5,
    encounterChance: 0.15,
    roadType: 'highway'
  },

  // MINOR ROADS & CONNECTORS
  {
    id: 'player-road-1',
    name: 'Settlement Access Road',
    fromLocationId: 'shady-sands',
    toLocationId: 'player-outpost',
    distanceMiles: 52,
    condition: 'good',
    dangerLevel: 4,
    travelTimeBase: 105,
    landmarks: ['Vault 15', 'Your Settlement'],
    speedModifier: 0.9,
    encounterChance: 0.05,
    roadType: 'minor'
  },
  {
    id: 'glow-access',
    name: 'Glow Access Road',
    fromLocationId: 'hub',
    toLocationId: 'glow',
    distanceMiles: 25,
    condition: 'dangerous',
    dangerLevel: 10,
    travelTimeBase: 75,
    landmarks: ['Radiation Warning Signs', 'Glowing Craters'],
    speedModifier: 0.4,
    encounterChance: 0.25,
    roadType: 'minor'
  },
  {
    id: 'mariposa-access',
    name: 'Military Base Access Road',
    fromLocationId: 'lost-hills',
    toLocationId: 'abandoned-military-base',
    distanceMiles: 15,
    condition: 'dangerous',
    dangerLevel: 9,
    travelTimeBase: 50,
    landmarks: ['Robot Patrols', 'Security Turrets'],
    speedModifier: 0.4,
    encounterChance: 0.20,
    roadType: 'minor'
  },
  {
    id: 'sierra-access',
    name: 'Sierra Depot Access Road',
    fromLocationId: 'redding',
    toLocationId: 'military-depot',
    distanceMiles: 25,
    condition: 'damaged',
    dangerLevel: 7,
    travelTimeBase: 65,
    landmarks: ['Mountain Pass', 'Security Perimeter'],
    speedModifier: 0.6,
    encounterChance: 0.12,
    roadType: 'minor'
  },
  {
    id: 'necropolis-connector',
    name: 'Necropolis Connector',
    fromLocationId: 'hub',
    toLocationId: 'necropolis',
    distanceMiles: 20,
    condition: 'damaged',
    dangerLevel: 7,
    travelTimeBase: 50,
    landmarks: ['Ghoul Camps', 'Radiation Zones'],
    speedModifier: 0.6,
    encounterChance: 0.13,
    roadType: 'minor'
  },
  {
    id: 'cathedral-access',
    name: 'Cathedral Access Road',
    fromLocationId: 'boneyard',
    toLocationId: 'cathedral',
    distanceMiles: 10,
    condition: 'damaged',
    dangerLevel: 8,
    travelTimeBase: 25,
    landmarks: ['Cult Symbols', 'Dark Tunnels'],
    speedModifier: 0.6,
    encounterChance: 0.15,
    roadType: 'minor'
  },
  {
    id: 'slaver-route',
    name: 'Slaver Trade Route',
    fromLocationId: 'hub',
    toLocationId: 'slaver-camp',
    distanceMiles: 10,
    condition: 'good',
    dangerLevel: 7,
    travelTimeBase: 20,
    landmarks: ['Slave Cages', 'Guard Posts'],
    speedModifier: 0.9,
    encounterChance: 0.14,
    roadType: 'minor'
  }
];

// Helper function to get road by ID
export function getRoadById(id: string): RoadSegment | undefined {
  return CALIFORNIA_ROADS.find(road => road.id === id);
}

// Helper function to get all roads connected to a location
export function getRoadsForLocation(locationId: string): RoadSegment[] {
  return CALIFORNIA_ROADS.filter(
    road => road.fromLocationId === locationId || road.toLocationId === locationId
  );
}

// Helper function to get road connecting two locations
export function getRoadBetween(fromId: string, toId: string): RoadSegment | undefined {
  return CALIFORNIA_ROADS.find(
    road => 
      (road.fromLocationId === fromId && road.toLocationId === toId) ||
      (road.fromLocationId === toId && road.toLocationId === fromId)
  );
}
