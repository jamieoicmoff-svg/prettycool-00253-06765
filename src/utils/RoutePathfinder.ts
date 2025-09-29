// Route pathfinding using Dijkstra's algorithm for California road network

import { CALIFORNIA_ROADS, getRoadsForLocation, type RoadSegment } from '@/data/CaliforniaRoads';

export interface RouteNode {
  locationId: string;
  distance: number;
  time: number;
  danger: number;
  previous: string | null;
  road: RoadSegment | null;
}

export interface Route {
  segments: RoadSegment[];
  totalDistance: number;
  totalTime: number;
  averageDanger: number;
  locations: string[];
}

export class RoutePathfinder {
  private static instance: RoutePathfinder;

  static getInstance(): RoutePathfinder {
    if (!this.instance) {
      this.instance = new RoutePathfinder();
    }
    return this.instance;
  }

  // Find shortest route between two locations
  findRoute(
    fromLocationId: string,
    toLocationId: string,
    options: {
      preferSafe?: boolean;
      preferFast?: boolean;
      avoidLocations?: string[];
    } = {}
  ): Route | null {
    const { preferSafe = false, preferFast = false, avoidLocations = [] } = options;

    // Build graph
    const nodes: Map<string, RouteNode> = new Map();
    const unvisited: Set<string> = new Set();

    // Initialize all nodes
    const allLocationIds = new Set<string>();
    CALIFORNIA_ROADS.forEach(road => {
      allLocationIds.add(road.fromLocationId);
      allLocationIds.add(road.toLocationId);
    });

    allLocationIds.forEach(locId => {
      nodes.set(locId, {
        locationId: locId,
        distance: locId === fromLocationId ? 0 : Infinity,
        time: locId === fromLocationId ? 0 : Infinity,
        danger: 0,
        previous: null,
        road: null
      });
      unvisited.add(locId);
    });

    // Dijkstra's algorithm
    while (unvisited.size > 0) {
      // Find node with minimum distance
      let currentNode: RouteNode | null = null;
      let minValue = Infinity;

      unvisited.forEach(locId => {
        const node = nodes.get(locId)!;
        let value: number;

        if (preferSafe) {
          // Minimize danger + distance
          value = node.distance + (node.danger * 10);
        } else if (preferFast) {
          // Minimize time
          value = node.time;
        } else {
          // Minimize distance (default)
          value = node.distance;
        }

        if (value < minValue) {
          minValue = value;
          currentNode = node;
        }
      });

      if (!currentNode || currentNode.distance === Infinity) {
        break; // No route possible
      }

      // Found destination
      if (currentNode.locationId === toLocationId) {
        return this.reconstructRoute(nodes, fromLocationId, toLocationId);
      }

      unvisited.delete(currentNode.locationId);

      // Check neighbors
      const roads = getRoadsForLocation(currentNode.locationId);

      roads.forEach(road => {
        const neighborId = road.fromLocationId === currentNode!.locationId 
          ? road.toLocationId 
          : road.fromLocationId;

        // Skip if avoiding this location
        if (avoidLocations.includes(neighborId)) {
          return;
        }

        if (!unvisited.has(neighborId)) {
          return;
        }

        const neighbor = nodes.get(neighborId)!;
        const roadDistance = road.distanceMiles;
        const roadTime = road.travelTimeBase;
        const roadDanger = road.dangerLevel;

        const newDistance = currentNode!.distance + roadDistance;
        const newTime = currentNode!.time + roadTime;
        const newDanger = currentNode!.danger + roadDanger;

        // Update if better route found
        let shouldUpdate = false;

        if (preferSafe) {
          const currentValue = neighbor.distance + (neighbor.danger * 10);
          const newValue = newDistance + (newDanger * 10);
          shouldUpdate = newValue < currentValue;
        } else if (preferFast) {
          shouldUpdate = newTime < neighbor.time;
        } else {
          shouldUpdate = newDistance < neighbor.distance;
        }

        if (shouldUpdate) {
          neighbor.distance = newDistance;
          neighbor.time = newTime;
          neighbor.danger = newDanger;
          neighbor.previous = currentNode!.locationId;
          neighbor.road = road;
        }
      });
    }

    // No route found
    return null;
  }

  // Reconstruct the route from the node map
  private reconstructRoute(
    nodes: Map<string, RouteNode>,
    fromLocationId: string,
    toLocationId: string
  ): Route {
    const segments: RoadSegment[] = [];
    const locations: string[] = [];
    let totalDistance = 0;
    let totalTime = 0;
    let totalDanger = 0;

    let currentId = toLocationId;

    while (currentId !== fromLocationId) {
      const node = nodes.get(currentId)!;
      locations.unshift(currentId);

      if (node.road) {
        segments.unshift(node.road);
        totalDanger += node.road.dangerLevel;
      }

      if (!node.previous) {
        break;
      }

      currentId = node.previous;
    }

    locations.unshift(fromLocationId);

    // Calculate totals from segments
    segments.forEach(segment => {
      totalDistance += segment.distanceMiles;
      totalTime += segment.travelTimeBase;
    });

    const averageDanger = segments.length > 0 ? totalDanger / segments.length : 0;

    return {
      segments,
      totalDistance,
      totalTime,
      averageDanger,
      locations
    };
  }

  // Get multiple route options (fast, safe, shortest)
  getRouteOptions(fromLocationId: string, toLocationId: string): {
    fastest: Route | null;
    safest: Route | null;
    shortest: Route | null;
  } {
    return {
      fastest: this.findRoute(fromLocationId, toLocationId, { preferFast: true }),
      safest: this.findRoute(fromLocationId, toLocationId, { preferSafe: true }),
      shortest: this.findRoute(fromLocationId, toLocationId)
    };
  }

  // Calculate if a location is reachable from another
  isReachable(fromLocationId: string, toLocationId: string): boolean {
    const route = this.findRoute(fromLocationId, toLocationId);
    return route !== null;
  }
}

// Export singleton instance
export const routePathfinder = RoutePathfinder.getInstance();
