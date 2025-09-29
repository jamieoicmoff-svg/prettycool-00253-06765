import { MOJAVE_LOCATIONS, getLocationById } from '@/data/MojaveLocations';

// Enhanced travel time calculation using Google Maps-style routing
export class EnhancedTravelCalculator {
  private static instance: EnhancedTravelCalculator;
  
  static getInstance(): EnhancedTravelCalculator {
    if (!this.instance) {
      this.instance = new EnhancedTravelCalculator();
    }
    return this.instance;
  }

  // Calculate realistic travel time between two locations using road distance
  calculateTravelTime(
    fromLocationId: string, 
    toLocationId: string, 
    baseDifficulty: number = 1,
    squadLevel: number = 1,
    vehicleType: 'foot' | 'vehicle' = 'foot'
  ): number {
    const fromLocation = getLocationById(fromLocationId);
    const toLocation = getLocationById(toLocationId);
    
    if (!fromLocation || !toLocation) {
      return 30; // Default 30 minutes
    }

    // Calculate straight-line distance (using x,y percentage coordinates)
    const straightLineDistance = this.calculateDistance(
      fromLocation.coordinates.x,
      fromLocation.coordinates.y,
      toLocation.coordinates.x,
      toLocation.coordinates.y
    );

    // Apply road factor (roads aren't straight lines)
    const roadFactor = this.getRoadFactor(fromLocation.type, toLocation.type);
    const actualDistance = straightLineDistance * roadFactor;

    // Base travel speed (km/h) - wasteland travel is slow
    const baseSpeed = vehicleType === 'vehicle' ? 45 : 4; // 45 km/h vehicle, 4 km/h walking
    
    // Calculate base time in hours
    const baseTimeHours = actualDistance / baseSpeed;
    
    // Apply modifiers
    const difficultyModifier = 1 + (baseDifficulty * 0.3); // Higher difficulty = slower travel
    const squadEfficiency = Math.max(0.6, 1 - (squadLevel * 0.05)); // Better squads travel faster
    const terrainModifier = this.getTerrainModifier(fromLocation, toLocation);
    
    // Final calculation in minutes
    const totalTimeMinutes = baseTimeHours * 60 * difficultyModifier * squadEfficiency * terrainModifier;
    
    return Math.max(5, Math.round(totalTimeMinutes)); // Minimum 5 minutes
  }

  // Calculate distance between two coordinates (using x,y percentage coordinates)
  // We convert percentage-based map coordinates to approximate real-world distance
  private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    // Euclidean distance for x,y coordinates
    const dx = x2 - x1;
    const dy = y2 - y1;
    const percentageDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Convert to approximate km (Mojave Wasteland is roughly 500km across)
    // 100% of the map = ~500km
    return (percentageDistance / 100) * 500;
  }

  // Get road factor based on location types (how much roads deviate from straight line)
  private getRoadFactor(fromType: string, toType: string): number {
    const factors: Record<string, number> = {
      'settlement': 1.2,   // Good roads to settlements
      'outpost': 1.4,      // Decent roads to outposts
      'facility': 1.3,     // Industrial roads to facilities
      'vault': 1.8,        // Hidden/difficult access
      'ruins': 1.6,        // Poor road conditions
      'landmark': 2.0      // No proper roads, rough terrain
    };
    
    const fromFactor = factors[fromType] || 1.5;
    const toFactor = factors[toType] || 1.5;
    
    return (fromFactor + toFactor) / 2;
  }

  // Get terrain modifier based on location types and environment
  private getTerrainModifier(fromLocation: any, toLocation: any): number {
    let modifier = 1.0;
    
    // Danger level affects travel time (more dangerous = more careful = slower)
    const avgDanger = (fromLocation.dangerLevel + toLocation.dangerLevel) / 2;
    modifier += avgDanger * 0.1;
    
    // Special location modifiers
    if (toLocation.id === 'quarry-junction' || fromLocation.id === 'quarry-junction') {
      modifier *= 1.5; // Deathclaw territory requires extreme caution
    }
    
    if (toLocation.id === 'deathclaw-promontory' || fromLocation.id === 'deathclaw-promontory') {
      modifier *= 2.0; // Extremely dangerous area
    }
    
    // Underground locations are harder to access
    if (toLocation.type === 'vault' || fromLocation.type === 'vault') {
      modifier *= 1.3;
    }
    
    return modifier;
  }

  // Calculate travel phases for a mission
  calculateMissionPhases(totalDurationMinutes: number): {
    travelMinutes: number;
    setupMinutes: number;
    combatMinutes: number;
    returnMinutes: number;
  } {
    // Phase distribution based on mission complexity
    const travelPercentage = 0.15; // 15% travel to location
    const setupPercentage = 0.10;  // 10% setup time
    const combatPercentage = 0.60; // 60% actual combat
    const returnPercentage = 0.15; // 15% return travel
    
    return {
      travelMinutes: Math.round(totalDurationMinutes * travelPercentage),
      setupMinutes: Math.round(totalDurationMinutes * setupPercentage),
      combatMinutes: Math.round(totalDurationMinutes * combatPercentage),
      returnMinutes: Math.round(totalDurationMinutes * returnPercentage)
    };
  }

  // Get estimated travel time for display
  getEstimatedTravelTime(fromLocationId: string, toLocationId: string): string {
    const minutes = this.calculateTravelTime(fromLocationId, toLocationId);
    
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  }
}

// Export singleton instance
export const travelCalculator = EnhancedTravelCalculator.getInstance();