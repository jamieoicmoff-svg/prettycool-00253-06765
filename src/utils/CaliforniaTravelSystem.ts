// California Travel System - Road-based travel calculations

import { routePathfinder, type Route } from './RoutePathfinder';
import { getRoadById, type RoadSegment } from '@/data/CaliforniaRoads';
import { getCaliforniaLocationById } from '@/data/CaliforniaLocations';

export interface TravelModifiers {
  squadLevel: number;
  vehicleType: 'foot' | 'vehicle';
  weather?: 'clear' | 'storm' | 'rad-storm';
  timeOfDay?: 'day' | 'night';
  squadSize?: number;
}

export interface TravelCalculation {
  route: Route;
  baseTimeMinutes: number;
  modifiedTimeMinutes: number;
  encounterChance: number;
  modifiers: {
    squadEfficiency: number;
    vehicleSpeed: number;
    roadCondition: number;
    weather: number;
    timeOfDay: number;
  };
}

export class CaliforniaTravelSystem {
  private static instance: CaliforniaTravelSystem;

  static getInstance(): CaliforniaTravelSystem {
    if (!this.instance) {
      this.instance = new CaliforniaTravelSystem();
    }
    return this.instance;
  }

  // Calculate travel time with all modifiers
  calculateTravel(
    fromLocationId: string,
    toLocationId: string,
    modifiers: TravelModifiers,
    routePreference: 'fastest' | 'safest' | 'shortest' = 'shortest'
  ): TravelCalculation | null {
    // Find route
    const route = routePathfinder.findRoute(fromLocationId, toLocationId, {
      preferFast: routePreference === 'fastest',
      preferSafe: routePreference === 'safest'
    });

    if (!route) {
      return null;
    }

    // Calculate base time from route
    const baseTimeMinutes = route.totalTime;

    // Apply modifiers
    const modifierValues = this.calculateModifiers(route, modifiers);
    
    const totalModifier = 
      modifierValues.squadEfficiency *
      modifierValues.vehicleSpeed *
      modifierValues.roadCondition *
      modifierValues.weather *
      modifierValues.timeOfDay;

    const modifiedTimeMinutes = Math.max(5, Math.round(baseTimeMinutes * totalModifier));

    // Calculate encounter chance
    const encounterChance = this.calculateEncounterChance(route, modifiers);

    return {
      route,
      baseTimeMinutes,
      modifiedTimeMinutes,
      encounterChance,
      modifiers: modifierValues
    };
  }

  // Calculate all modifier values
  private calculateModifiers(route: Route, modifiers: TravelModifiers) {
    const {
      squadLevel = 1,
      vehicleType = 'foot',
      weather = 'clear',
      timeOfDay = 'day',
      squadSize = 4
    } = modifiers;

    // Squad efficiency: better squads travel faster
    // 5% faster per level, max 50% faster at level 10
    const squadEfficiency = Math.max(0.5, 1 - (squadLevel * 0.05));

    // Vehicle speed modifier
    const vehicleSpeed = vehicleType === 'vehicle' ? 0.4 : 1.0; // Vehicles are 60% faster

    // Road condition average
    const avgCondition = route.segments.reduce((sum, seg) => {
      const conditionMod = seg.condition === 'good' ? 1.0 : 
                          seg.condition === 'damaged' ? 1.5 : 2.0;
      return sum + conditionMod;
    }, 0) / route.segments.length;

    // Weather modifier
    const weatherMod = weather === 'clear' ? 1.0 :
                       weather === 'storm' ? 1.5 : 2.0; // Rad storms are worst

    // Time of day modifier
    const timeMod = timeOfDay === 'day' ? 1.0 : 1.3; // Night travel is slower

    return {
      squadEfficiency,
      vehicleSpeed,
      roadCondition: avgCondition,
      weather: weatherMod,
      timeOfDay: timeMod
    };
  }

  // Calculate cumulative encounter chance for entire route
  private calculateEncounterChance(route: Route, modifiers: TravelModifiers): number {
    let totalChance = 0;

    route.segments.forEach(segment => {
      // Base encounter chance per mile
      const chancePerMile = segment.encounterChance;
      
      // Total chance for this segment
      const segmentChance = chancePerMile * segment.distanceMiles;
      
      // Modify by squad level (better squads avoid encounters)
      const squadMod = Math.max(0.5, 1 - (modifiers.squadLevel * 0.04));
      
      // Modify by time of day (night has more encounters)
      const timeMod = modifiers.timeOfDay === 'night' ? 1.5 : 1.0;
      
      totalChance += segmentChance * squadMod * timeMod;
    });

    // Cap at 95% max
    return Math.min(0.95, totalChance);
  }

  // Get travel time estimate as formatted string
  getEstimatedTravelTime(
    fromLocationId: string,
    toLocationId: string,
    modifiers: TravelModifiers
  ): string {
    const calc = this.calculateTravel(fromLocationId, toLocationId, modifiers);
    
    if (!calc) {
      return 'Unknown';
    }

    const minutes = calc.modifiedTimeMinutes;

    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  }

  // Get route distance as formatted string
  getRouteDistance(fromLocationId: string, toLocationId: string): string {
    const route = routePathfinder.findRoute(fromLocationId, toLocationId);
    
    if (!route) {
      return 'Unknown';
    }

    return `${route.totalDistance} miles`;
  }

  // Calculate mission phases based on total duration
  calculateMissionPhases(totalDurationMinutes: number): {
    travelMinutes: number;
    setupMinutes: number;
    combatMinutes: number;
    returnMinutes: number;
  } {
    return {
      travelMinutes: Math.round(totalDurationMinutes * 0.15), // 15% travel to location
      setupMinutes: Math.round(totalDurationMinutes * 0.10),  // 10% setup time
      combatMinutes: Math.round(totalDurationMinutes * 0.60), // 60% actual combat
      returnMinutes: Math.round(totalDurationMinutes * 0.15)  // 15% return travel
    };
  }

  // Get current road segment based on mission progress
  getCurrentSegment(route: Route, elapsedMinutes: number, totalMinutes: number): {
    segment: RoadSegment;
    progress: number; // 0-1
    segmentIndex: number;
  } | null {
    if (!route || route.segments.length === 0) {
      return null;
    }

    const progressPercent = elapsedMinutes / totalMinutes;
    const travelPhasePercent = 0.15; // Travel is 15% of mission
    
    // Only show road progress during travel phase (first 15%)
    if (progressPercent > travelPhasePercent) {
      return null;
    }

    // Calculate which segment we're on
    const travelProgress = progressPercent / travelPhasePercent; // 0-1 during travel
    const totalTravelTime = route.totalTime;
    const elapsedTravelTime = travelProgress * totalTravelTime;

    let accumulatedTime = 0;
    for (let i = 0; i < route.segments.length; i++) {
      const segment = route.segments[i];
      const segmentEndTime = accumulatedTime + segment.travelTimeBase;

      if (elapsedTravelTime <= segmentEndTime) {
        const segmentProgress = (elapsedTravelTime - accumulatedTime) / segment.travelTimeBase;
        return {
          segment,
          progress: Math.max(0, Math.min(1, segmentProgress)),
          segmentIndex: i
        };
      }

      accumulatedTime = segmentEndTime;
    }

    // Return last segment if past all segments
    const lastSegment = route.segments[route.segments.length - 1];
    return {
      segment: lastSegment,
      progress: 1,
      segmentIndex: route.segments.length - 1
    };
  }

  // Get all route options for comparison
  getRouteOptions(
    fromLocationId: string,
    toLocationId: string,
    modifiers: TravelModifiers
  ): {
    fastest: TravelCalculation | null;
    safest: TravelCalculation | null;
    shortest: TravelCalculation | null;
  } {
    return {
      fastest: this.calculateTravel(fromLocationId, toLocationId, modifiers, 'fastest'),
      safest: this.calculateTravel(fromLocationId, toLocationId, modifiers, 'safest'),
      shortest: this.calculateTravel(fromLocationId, toLocationId, modifiers, 'shortest')
    };
  }
}

// Export singleton instance
export const californiaTravelSystem = CaliforniaTravelSystem.getInstance();
