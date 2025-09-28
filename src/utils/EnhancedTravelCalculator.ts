import KMZParser from './KMZParser';
import { MOJAVE_LOCATIONS, getLocationById } from '@/data/MojaveLocations';

export interface TravelCalculation {
  estimatedDuration: number; // in minutes
  realDistance: number; // in kilometers
  route: { lat: number; lng: number }[];
  dangerFactors: string[];
  terrainModifiers: string[];
  squadEfficiency: number;
  weatherImpact: number;
}

export class EnhancedTravelCalculator {
  private static instance: EnhancedTravelCalculator;
  private kmzParser: KMZParser;

  constructor() {
    this.kmzParser = KMZParser.getInstance();
  }

  public static getInstance(): EnhancedTravelCalculator {
    if (!EnhancedTravelCalculator.instance) {
      EnhancedTravelCalculator.instance = new EnhancedTravelCalculator();
    }
    return EnhancedTravelCalculator.instance;
  }

  calculateRealTravelTime(
    fromLocationId: string,
    toLocationId: string,
    squadLevel: number = 1,
    squadSize: number = 1,
    weatherCondition: string = 'clear',
    timeOfDay: 'day' | 'night' = 'day'
  ): TravelCalculation {
    // Try to use KMZ data first, fall back to default locations
    let fromLocation = this.kmzParser.getLocationById(fromLocationId);
    let toLocation = this.kmzParser.getLocationById(toLocationId);

    // Fallback to default locations if KMZ data not available
    if (!fromLocation) {
      const fallbackFrom = getLocationById(fromLocationId);
      if (fallbackFrom) {
        fromLocation = {
          id: fallbackFrom.id,
          name: fallbackFrom.name,
          description: fallbackFrom.description,
          coordinates: {
            lat: 36.2 + (fallbackFrom.coordinates.x - 50) * 0.05, // Convert % to approx lat/lng
            lng: -115.8 + (fallbackFrom.coordinates.y - 50) * 0.05,
          },
          type: fallbackFrom.type,
          dangerLevel: fallbackFrom.dangerLevel
        };
      }
    }

    if (!toLocation) {
      const fallbackTo = getLocationById(toLocationId);
      if (fallbackTo) {
        toLocation = {
          id: fallbackTo.id,
          name: fallbackTo.name,
          description: fallbackTo.description,
          coordinates: {
            lat: 36.2 + (fallbackTo.coordinates.x - 50) * 0.05,
            lng: -115.8 + (fallbackTo.coordinates.y - 50) * 0.05,
          },
          type: fallbackTo.type,
          dangerLevel: fallbackTo.dangerLevel
        };
      }
    }

    if (!fromLocation || !toLocation) {
      return {
        estimatedDuration: 30,
        realDistance: 10,
        route: [],
        dangerFactors: ['Unknown route'],
        terrainModifiers: [],
        squadEfficiency: 1.0,
        weatherImpact: 1.0
      };
    }

    // Calculate real distance using Haversine formula
    const realDistance = this.calculateHaversineDistance(
      fromLocation.coordinates.lat,
      fromLocation.coordinates.lng,
      toLocation.coordinates.lat,
      toLocation.coordinates.lng
    );

    // Generate route points (simplified pathfinding)
    const route = this.generateRoutePoints(fromLocation.coordinates, toLocation.coordinates);

    // Base travel calculation
    // Wasteland travel speed: ~2-4 km/h depending on conditions
    let baseSpeed = 3; // km/h base walking speed in wasteland
    let travelTime = realDistance / baseSpeed; // hours

    // Apply various modifiers
    const dangerFactors: string[] = [];
    const terrainModifiers: string[] = [];

    // Danger level modifiers
    const avgDanger = (fromLocation.dangerLevel + toLocation.dangerLevel) / 2;
    if (avgDanger > 7) {
      baseSpeed *= 0.6; // Extreme danger slows travel significantly
      dangerFactors.push('Extreme danger zone');
    } else if (avgDanger > 4) {
      baseSpeed *= 0.8; // Moderate danger
      dangerFactors.push('Hostile territory');
    } else if (avgDanger > 2) {
      baseSpeed *= 0.9; // Low danger
      dangerFactors.push('Patrol zones');
    }

    // Squad efficiency modifiers
    const squadEfficiency = Math.min(1.5, 0.8 + (squadLevel * 0.1) + (squadSize * 0.05));
    baseSpeed *= squadEfficiency;

    // Squad size considerations
    if (squadSize > 6) {
      baseSpeed *= 0.9; // Large groups move slower
      terrainModifiers.push('Large group coordination');
    } else if (squadSize < 3) {
      baseSpeed *= 1.1; // Small groups move faster
      terrainModifiers.push('Small unit mobility');
    }

    // Weather impact
    let weatherImpact = 1.0;
    switch (weatherCondition) {
      case 'dust-storm':
        weatherImpact = 0.5;
        terrainModifiers.push('Dust storm visibility');
        break;
      case 'radiation-storm':
        weatherImpact = 0.4;
        terrainModifiers.push('Radiation storm hazard');
        break;
      case 'fog':
        weatherImpact = 0.7;
        terrainModifiers.push('Limited visibility');
        break;
      case 'light-rain':
        weatherImpact = 0.9;
        terrainModifiers.push('Wet conditions');
        break;
      case 'overcast':
        weatherImpact = 0.95;
        break;
      default: // clear
        weatherImpact = 1.0;
    }
    baseSpeed *= weatherImpact;

    // Time of day modifiers
    if (timeOfDay === 'night') {
      baseSpeed *= 0.7; // Night travel is slower and more dangerous
      terrainModifiers.push('Night operations');
      dangerFactors.push('Reduced visibility');
    }

    // Terrain type modifiers based on location types
    if (fromLocation.type === 'vault' || toLocation.type === 'vault') {
      baseSpeed *= 0.8; // Underground access is slower
      terrainModifiers.push('Underground access');
    }

    if (fromLocation.type === 'ruins' || toLocation.type === 'ruins') {
      baseSpeed *= 0.9; // Ruins require careful navigation
      terrainModifiers.push('Ruined terrain');
    }

    if (fromLocation.type === 'facility' || toLocation.type === 'facility') {
      baseSpeed *= 0.95; // Industrial areas may have obstacles
      terrainModifiers.push('Industrial zone');
    }

    // Calculate final travel time
    travelTime = realDistance / baseSpeed; // hours
    const travelTimeMinutes = Math.max(5, Math.round(travelTime * 60)); // Convert to minutes, minimum 5 minutes

    return {
      estimatedDuration: travelTimeMinutes,
      realDistance: Math.round(realDistance * 100) / 100,
      route,
      dangerFactors,
      terrainModifiers,
      squadEfficiency: Math.round(squadEfficiency * 100) / 100,
      weatherImpact: Math.round(weatherImpact * 100) / 100
    };
  }

  // Legacy method for backward compatibility
  calculateTravelTime(
    fromLocationId: string, 
    toLocationId: string, 
    baseDifficulty: number = 1,
    squadLevel: number = 1,
    vehicleType: 'foot' | 'vehicle' = 'foot'
  ): number {
    const result = this.calculateRealTravelTime(fromLocationId, toLocationId, squadLevel);
    return result.estimatedDuration;
  }

  private calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
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

  private generateRoutePoints(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number }
  ): { lat: number; lng: number }[] {
    const points: { lat: number; lng: number }[] = [];
    const steps = 10;

    // Add some realistic waypoints to avoid straight lines
    const midPoint = {
      lat: (from.lat + to.lat) / 2 + (Math.random() - 0.5) * 0.01,
      lng: (from.lng + to.lng) / 2 + (Math.random() - 0.5) * 0.01
    };

    // Generate points from start to midpoint
    for (let i = 0; i <= steps / 2; i++) {
      const t = i / (steps / 2);
      points.push({
        lat: from.lat + (midPoint.lat - from.lat) * t,
        lng: from.lng + (midPoint.lng - from.lng) * t
      });
    }

    // Generate points from midpoint to end
    for (let i = 1; i <= steps / 2; i++) {
      const t = i / (steps / 2);
      points.push({
        lat: midPoint.lat + (to.lat - midPoint.lat) * t,
        lng: midPoint.lng + (to.lng - midPoint.lng) * t
      });
    }

    return points;
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