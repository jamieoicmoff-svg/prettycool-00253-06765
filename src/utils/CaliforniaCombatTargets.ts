// Converts California combat locations into combat targets
import { CALIFORNIA_LOCATIONS, CaliforniaLocation, getCombatLocationsInRange } from '@/data/CaliforniaLocations';
import { CombatTarget } from '@/components/combat/CombatTargets';

// Generate combat targets from California locations
export function generateCombatTargetsFromLocations(): CombatTarget[] {
  const combatLocations = CALIFORNIA_LOCATIONS.filter(loc => 
    loc.type === 'combat' || 
    (loc.type === 'ruins' && loc.dangerLevel >= 6) ||
    (loc.type === 'facility' && loc.dangerLevel >= 7)
  );

  return combatLocations.map(location => {
    const target = createTargetFromLocation(location);
    return target;
  });
}

// Create a combat target from a California location
function createTargetFromLocation(location: CaliforniaLocation): CombatTarget {
  const difficulty = Math.ceil(location.dangerLevel / 2); // 1-5 scale
  const minLevel = Math.max(1, location.dangerLevel - 3);
  const minSquadSize = difficulty >= 4 ? 4 : difficulty >= 3 ? 3 : 2;

  // Determine faction based on location
  let faction: string;
  let enemyTypes: { name: string; health: number; damage: number; accuracy: number; fireRate: number; weapon?: string }[];
  
  if (location.name.toLowerCase().includes('raider') || location.name.toLowerCase().includes('viper') || location.name.toLowerCase().includes('khan')) {
    faction = 'raiders';
    enemyTypes = generateRaiderEnemies(difficulty);
  } else if (location.name.toLowerCase().includes('mutant') || location.id === 'mariposa') {
    faction = 'super-mutants';
    enemyTypes = generateMutantEnemies(difficulty);
  } else if (location.name.toLowerCase().includes('ghoul') || location.name.toLowerCase().includes('necropolis')) {
    faction = 'ghouls';
    enemyTypes = generateGhoulEnemies(difficulty);
  } else if (location.name.toLowerCase().includes('deathclaw')) {
    faction = 'deathclaws';
    enemyTypes = generateDeathclawEnemies(difficulty);
  } else if (location.name.toLowerCase().includes('cazador')) {
    faction = 'cazadors';
    enemyTypes = generateCazadorEnemies(difficulty);
  } else if (location.name.toLowerCase().includes('scorpion')) {
    faction = 'creatures';
    enemyTypes = generateScorpionEnemies(difficulty);
  } else if (location.name.toLowerCase().includes('slaver')) {
    faction = 'slavers';
    enemyTypes = generateSlaverEnemies(difficulty);
  } else {
    faction = 'hostiles';
    enemyTypes = generateGenericEnemies(difficulty);
  }

  // Calculate rewards based on difficulty and distance
  const baseReward = 100 + (difficulty * 50) + (location.distanceFromShadySands * 2);
  const rewards = {
    caps: Math.floor(baseReward * (0.8 + Math.random() * 0.4)),
    experience: Math.floor(baseReward * 0.8),
    scrip: Math.max(3, difficulty * 2),
    techFrags: difficulty >= 3 ? difficulty * 5 : undefined,
    lootPool: getLootPoolForFaction(faction, difficulty)
  };

  // Determine target type based on faction
  let targetType: 'raider' | 'mutant' | 'robot' | 'creature' | 'faction' | 'legendary';
  if (faction === 'raiders' || faction === 'slavers') {
    targetType = 'raider';
  } else if (faction === 'super-mutants') {
    targetType = 'mutant';
  } else if (faction === 'deathclaws' || faction === 'cazadors' || faction === 'creatures') {
    targetType = 'creature';
  } else if (difficulty >= 4) {
    targetType = 'faction';
  } else {
    targetType = 'creature';
  }

  return {
    id: location.id,
    name: location.name,
    difficulty,
    location: location.name,
    description: location.description,
    faction,
    type: targetType,
    minLevel,
    minSquadSize,
    unlockLevel: minLevel,
    enemies: enemyTypes,
    rewards,
    enemyCount: enemyTypes.length,
    loot: rewards.lootPool || []
  };
}

// Enemy generation functions
function generateRaiderEnemies(difficulty: number) {
  const enemies = [];
  const count = 2 + difficulty;
  
  for (let i = 0; i < count; i++) {
    if (i === 0 && difficulty >= 3) {
      enemies.push({
        name: 'Raider Boss',
        health: 50 + (difficulty * 15),
        damage: 12 + (difficulty * 3),
        accuracy: 55 + (difficulty * 5),
        fireRate: 2,
        weapon: 'combat-rifle'
      });
    } else {
      enemies.push({
        name: Math.random() > 0.5 ? 'Raider Thug' : 'Raider Scout',
        health: 25 + (difficulty * 10),
        damage: 8 + (difficulty * 2),
        accuracy: 50 + (difficulty * 3),
        fireRate: 2 + Math.floor(Math.random() * 2),
        weapon: Math.random() > 0.5 ? '10mm-pistol' : 'pipe-rifle'
      });
    }
  }
  
  return enemies;
}

function generateMutantEnemies(difficulty: number) {
  const enemies = [];
  const count = 1 + difficulty;
  
  for (let i = 0; i < count; i++) {
    if (i === 0 && difficulty >= 4) {
      enemies.push({
        name: 'Super Mutant Master',
        health: 80 + (difficulty * 20),
        damage: 18 + (difficulty * 4),
        accuracy: 50 + (difficulty * 4),
        fireRate: 1,
        weapon: 'minigun'
      });
    } else {
      enemies.push({
        name: 'Super Mutant Brute',
        health: 60 + (difficulty * 15),
        damage: 15 + (difficulty * 3),
        accuracy: 45 + (difficulty * 3),
        fireRate: 2,
        weapon: Math.random() > 0.5 ? 'hunting-rifle' : 'super-sledge'
      });
    }
  }
  
  return enemies;
}

function generateGhoulEnemies(difficulty: number) {
  const enemies = [];
  const count = 3 + difficulty;
  
  for (let i = 0; i < count; i++) {
    if (i === 0 && difficulty >= 3) {
      enemies.push({
        name: 'Glowing One',
        health: 55 + (difficulty * 12),
        damage: 14 + (difficulty * 2),
        accuracy: 40 + (difficulty * 3),
        fireRate: 1,
        weapon: 'radiation-aura'
      });
    } else {
      enemies.push({
        name: 'Feral Ghoul',
        health: 30 + (difficulty * 8),
        damage: 10 + (difficulty * 2),
        accuracy: 35 + (difficulty * 2),
        fireRate: 2,
        weapon: 'claws'
      });
    }
  }
  
  return enemies;
}

function generateDeathclawEnemies(difficulty: number) {
  const count = Math.max(1, difficulty - 2);
  const enemies = [];
  
  for (let i = 0; i < count; i++) {
    enemies.push({
      name: i === 0 ? 'Deathclaw Alpha' : 'Deathclaw',
      health: 100 + (difficulty * 25),
      damage: 25 + (difficulty * 5),
      accuracy: 70 + (difficulty * 3),
      fireRate: 1,
      weapon: 'claws'
    });
  }
  
  return enemies;
}

function generateCazadorEnemies(difficulty: number) {
  const count = 2 + difficulty;
  const enemies = [];
  
  for (let i = 0; i < count; i++) {
    enemies.push({
      name: 'Cazador',
      health: 40 + (difficulty * 10),
      damage: 20 + (difficulty * 4),
      accuracy: 65 + (difficulty * 4),
      fireRate: 3,
      weapon: 'poison-stinger'
    });
  }
  
  return enemies;
}

function generateScorpionEnemies(difficulty: number) {
  const count = 2 + difficulty;
  const enemies = [];
  
  for (let i = 0; i < count; i++) {
    enemies.push({
      name: i === 0 ? 'Giant Radscorpion' : 'Radscorpion',
      health: 45 + (difficulty * 12),
      damage: 12 + (difficulty * 3),
      accuracy: 50 + (difficulty * 3),
      fireRate: 1,
      weapon: 'venom-stinger'
    });
  }
  
  return enemies;
}

function generateSlaverEnemies(difficulty: number) {
  const count = 2 + difficulty;
  const enemies = [];
  
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      enemies.push({
        name: 'Slaver Boss',
        health: 55 + (difficulty * 13),
        damage: 14 + (difficulty * 3),
        accuracy: 60 + (difficulty * 4),
        fireRate: 2,
        weapon: 'combat-shotgun'
      });
    } else {
      enemies.push({
        name: 'Slaver Guard',
        health: 40 + (difficulty * 10),
        damage: 11 + (difficulty * 2),
        accuracy: 55 + (difficulty * 3),
        fireRate: 2,
        weapon: '10mm-pistol'
      });
    }
  }
  
  return enemies;
}

function generateGenericEnemies(difficulty: number) {
  const count = 2 + difficulty;
  const enemies = [];
  
  for (let i = 0; i < count; i++) {
    enemies.push({
      name: 'Hostile Wastelander',
      health: 35 + (difficulty * 10),
      damage: 10 + (difficulty * 2),
      accuracy: 50 + (difficulty * 3),
      fireRate: 2,
      weapon: 'pipe-rifle'
    });
  }
  
  return enemies;
}

// Loot pool generation
function getLootPoolForFaction(faction: string, difficulty: number): string[] {
  const commonLoot = ['steel', 'aluminum', 'cloth', 'leather'];
  
  const factionLoot: { [key: string]: string[] } = {
    'raiders': ['gun-powder', '10mm-pistol', 'pipe-rifle', 'stimpak', 'jet', 'psycho'],
    'super-mutants': ['nuclear-material', 'super-sledge', 'hunting-rifle', 'buffout', 'heavy-armor'],
    'ghouls': ['rad-away', 'rad-x', 'nuclear-material', 'pre-war-money'],
    'deathclaws': ['deathclaw-hide', 'deathclaw-hand', 'rare-meat'],
    'cazadors': ['poison-gland', 'cazador-parts', 'antivenom'],
    'creatures': ['scorpion-venom', 'chitin', 'meat'],
    'slavers': ['caps', 'ammunition', 'combat-rifle', 'leather-armor'],
    'hostiles': ['ammunition', 'food', 'water', 'supplies']
  };
  
  const pool = [...commonLoot, ...(factionLoot[faction] || factionLoot['hostiles'])];
  
  // Add rare items for high difficulty
  if (difficulty >= 4) {
    pool.push('tech-fragments', 'rare-weapon', 'advanced-armor');
  }
  
  return pool;
}

// Get combat targets within a specific distance range (from Shady Sands)
export function getCombatTargetsByDistance(minDistance: number, maxDistance: number): CombatTarget[] {
  const shadySands = CALIFORNIA_LOCATIONS.find(loc => loc.id === 'shady-sands');
  if (!shadySands) return [];
  
  const combatLocations = getCombatLocationsInRange(shadySands, maxDistance).filter(
    loc => loc.distanceFromShadySands >= minDistance
  );
  return combatLocations.map(location => createTargetFromLocation(location));
}

// Get combat targets by difficulty
export function getCombatTargetsByDifficulty(minDifficulty: number, maxDifficulty: number): CombatTarget[] {
  const allTargets = generateCombatTargetsFromLocations();
  return allTargets.filter(target => 
    target.difficulty >= minDifficulty && target.difficulty <= maxDifficulty
  );
}
