import { ENHANCED_MOJAVE_LOCATIONS, getLocationByIdEnhanced } from '@/components/maps/GoogleMapsConfig';

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
    const fromLocation = getLocationByIdEnhanced(fromLocationId);
    const toLocation = getLocationByIdEnhanced(toLocationId);
    
    if (!fromLocation || !toLocation) {
      return 30; // Default 30 minutes
    }

    // Calculate straight-line distance first
    const straightLineDistance = this.calculateDistance(
      fromLocation.coordinates.lat,
      fromLocation.coordinates.lng,
      toLocation.coordinates.lat,
      toLocation.coordinates.lng
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

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
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