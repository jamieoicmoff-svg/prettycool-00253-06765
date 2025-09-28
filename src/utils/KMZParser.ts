import JSZip from 'jszip';

export interface KMZLocation {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
    elevation?: number;
  };
  type: 'settlement' | 'outpost' | 'ruins' | 'vault' | 'facility' | 'landmark' | 'danger-zone';
  dangerLevel: number;
  faction?: string;
  resources?: string[];
  population?: number;
}

export interface KMZRoute {
  id: string;
  name: string;
  points: { lat: number; lng: number }[];
  type: 'highway' | 'trail' | 'underground' | 'secret-path';
  dangerLevel: number;
  travelTimeModifier: number;
}

export class KMZParser {
  private static instance: KMZParser;
  private locations: KMZLocation[] = [];
  private routes: KMZRoute[] = [];
  private parsed = false;

  public static getInstance(): KMZParser {
    if (!KMZParser.instance) {
      KMZParser.instance = new KMZParser();
    }
    return KMZParser.instance;
  }

  async parseKMZFile(kmzData: ArrayBuffer): Promise<{ locations: KMZLocation[]; routes: KMZRoute[] }> {
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(kmzData);
      
      // Find the main KML file (usually doc.kml or the first .kml file)
      const kmlFile = contents.file('doc.kml') || 
                     Object.values(contents.files).find(file => file.name.endsWith('.kml'));
      
      if (!kmlFile) {
        throw new Error('No KML file found in KMZ archive');
      }

      const kmlContent = await kmlFile.async('text');
      const parser = new DOMParser();
      const kmlDoc = parser.parseFromString(kmlContent, 'application/xml');

      this.parseLocations(kmlDoc);
      this.parseRoutes(kmlDoc);
      this.parsed = true;

      return {
        locations: this.locations,
        routes: this.routes
      };
    } catch (error) {
      console.error('Error parsing KMZ file:', error);
      return { locations: [], routes: [] };
    }
  }

  private parseLocations(kmlDoc: Document) {
    const placemarks = kmlDoc.querySelectorAll('Placemark');
    
    placemarks.forEach((placemark, index) => {
      const nameElement = placemark.querySelector('name');
      const descElement = placemark.querySelector('description');
      const pointElement = placemark.querySelector('Point coordinates');
      
      if (pointElement && nameElement) {
        const coordinates = pointElement.textContent?.trim();
        if (coordinates) {
          const [lng, lat, elevation] = coordinates.split(',').map(parseFloat);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const name = nameElement.textContent?.trim() || `Location ${index}`;
            const description = descElement?.textContent?.trim() || '';
            
            // Parse location type and danger level from description or name
            const location: KMZLocation = {
              id: this.generateLocationId(name),
              name,
              description,
              coordinates: {
                lat,
                lng,
                elevation: elevation || 0
              },
              type: this.determineLocationType(name, description),
              dangerLevel: this.determineDangerLevel(name, description),
              faction: this.determineFaction(name, description),
              resources: this.parseResources(description),
              population: this.parsePopulation(description)
            };

            this.locations.push(location);
          }
        }
      }
    });
  }

  private parseRoutes(kmlDoc: Document) {
    const lineStrings = kmlDoc.querySelectorAll('LineString');
    
    lineStrings.forEach((lineString, index) => {
      const coordinatesElement = lineString.querySelector('coordinates');
      const nameElement = lineString.closest('Placemark')?.querySelector('name');
      
      if (coordinatesElement && nameElement) {
        const coordinatesText = coordinatesElement.textContent?.trim();
        if (coordinatesText) {
          const points = coordinatesText.split(/\s+/).map(coord => {
            const [lng, lat] = coord.split(',').map(parseFloat);
            return { lat, lng };
          }).filter(point => !isNaN(point.lat) && !isNaN(point.lng));

          if (points.length > 1) {
            const name = nameElement.textContent?.trim() || `Route ${index}`;
            
            const route: KMZRoute = {
              id: this.generateRouteId(name),
              name,
              points,
              type: this.determineRouteType(name),
              dangerLevel: this.determineRouteDangerLevel(name),
              travelTimeModifier: this.calculateRouteModifier(name, points.length)
            };

            this.routes.push(route);
          }
        }
      }
    });
  }

  private generateLocationId(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private generateRouteId(name: string): string {
    return `route-${this.generateLocationId(name)}`;
  }

  private determineLocationType(name: string, description: string): KMZLocation['type'] {
    const text = (name + ' ' + description).toLowerCase();
    
    if (text.includes('vault')) return 'vault';
    if (text.includes('settlement') || text.includes('town') || text.includes('city')) return 'settlement';
    if (text.includes('outpost') || text.includes('camp') || text.includes('base')) return 'outpost';
    if (text.includes('ruins') || text.includes('destroyed') || text.includes('abandoned')) return 'ruins';
    if (text.includes('facility') || text.includes('factory') || text.includes('plant')) return 'facility';
    if (text.includes('deathclaw') || text.includes('radiation') || text.includes('hostile')) return 'danger-zone';
    
    return 'landmark';
  }

  private determineDangerLevel(name: string, description: string): number {
    const text = (name + ' ' + description).toLowerCase();
    
    if (text.includes('deathclaw') || text.includes('extreme')) return 10;
    if (text.includes('hostile') || text.includes('dangerous') || text.includes('irradiated')) return 8;
    if (text.includes('raider') || text.includes('super mutant') || text.includes('feral')) return 6;
    if (text.includes('abandoned') || text.includes('ruins')) return 4;
    if (text.includes('outpost') || text.includes('patrol')) return 3;
    if (text.includes('settlement') || text.includes('safe') || text.includes('ncr')) return 1;
    
    return 5; // Default moderate danger
  }

  private determineFaction(name: string, description: string): string | undefined {
    const text = (name + ' ' + description).toLowerCase();
    
    if (text.includes('ncr')) return 'NCR';
    if (text.includes('legion') || text.includes('caesar')) return 'Legion';
    if (text.includes('brotherhood') || text.includes('bos')) return 'Brotherhood of Steel';
    if (text.includes('enclave')) return 'Enclave';
    if (text.includes('raider')) return 'Raiders';
    if (text.includes('super mutant')) return 'Super Mutants';
    
    return undefined;
  }

  private parseResources(description: string): string[] {
    const resources: string[] = [];
    const text = description.toLowerCase();
    
    if (text.includes('water')) resources.push('water');
    if (text.includes('food')) resources.push('food');
    if (text.includes('fuel')) resources.push('fuel');
    if (text.includes('ammo')) resources.push('ammunition');
    if (text.includes('medical') || text.includes('stimpak')) resources.push('medical');
    if (text.includes('tech') || text.includes('electronics')) resources.push('technology');
    if (text.includes('scrap') || text.includes('salvage')) resources.push('scrap');
    
    return resources;
  }

  private parsePopulation(description: string): number | undefined {
    const populationMatch = description.match(/population[:\s]*(\d+)/i);
    if (populationMatch) {
      return parseInt(populationMatch[1]);
    }
    
    const text = description.toLowerCase();
    if (text.includes('large') || text.includes('major')) return 500;
    if (text.includes('medium') || text.includes('moderate')) return 100;
    if (text.includes('small') || text.includes('minor')) return 25;
    if (text.includes('abandoned') || text.includes('empty')) return 0;
    
    return undefined;
  }

  private determineRouteType(name: string): KMZRoute['type'] {
    const text = name.toLowerCase();
    
    if (text.includes('highway') || text.includes('interstate')) return 'highway';
    if (text.includes('underground') || text.includes('tunnel') || text.includes('sewer')) return 'underground';
    if (text.includes('secret') || text.includes('hidden')) return 'secret-path';
    
    return 'trail';
  }

  private determineRouteDangerLevel(name: string): number {
    const text = name.toLowerCase();
    
    if (text.includes('death') || text.includes('extreme')) return 9;
    if (text.includes('dangerous') || text.includes('hostile')) return 7;
    if (text.includes('patrol') || text.includes('contested')) return 5;
    if (text.includes('safe') || text.includes('protected')) return 2;
    
    return 4; // Default moderate danger for routes
  }

  private calculateRouteModifier(name: string, pointCount: number): number {
    const text = name.toLowerCase();
    let modifier = 1.0;
    
    // Route type modifiers
    if (text.includes('highway')) modifier *= 0.8; // Highways are faster
    if (text.includes('trail') || text.includes('path')) modifier *= 1.2; // Trails are slower
    if (text.includes('underground')) modifier *= 0.9; // Underground is protected but can be faster
    if (text.includes('mountain')) modifier *= 1.5; // Mountain routes are slower
    
    // Length-based modifier (more points = more complex route)
    if (pointCount > 20) modifier *= 1.2;
    else if (pointCount < 5) modifier *= 0.9;
    
    return Math.round(modifier * 100) / 100;
  }

  getLocations(): KMZLocation[] {
    return this.locations;
  }

  getRoutes(): KMZRoute[] {
    return this.routes;
  }

  getLocationById(id: string): KMZLocation | undefined {
    return this.locations.find(loc => loc.id === id);
  }

  getLocationsByType(type: KMZLocation['type']): KMZLocation[] {
    return this.locations.filter(loc => loc.type === type);
  }

  getLocationsByFaction(faction: string): KMZLocation[] {
    return this.locations.filter(loc => loc.faction === faction);
  }

  getNearbyLocations(lat: number, lng: number, radiusKm: number = 10): KMZLocation[] {
    return this.locations.filter(loc => {
      const distance = this.calculateDistance(lat, lng, loc.coordinates.lat, loc.coordinates.lng);
      return distance <= radiusKm;
    });
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  calculateRealTravelTime(fromId: string, toId: string, squadLevel: number = 1): number {
    const fromLocation = this.getLocationById(fromId);
    const toLocation = this.getLocationById(toId);
    
    if (!fromLocation || !toLocation) return 30; // Default 30 minutes
    
    const distance = this.calculateDistance(
      fromLocation.coordinates.lat,
      fromLocation.coordinates.lng,
      toLocation.coordinates.lat,
      toLocation.coordinates.lng
    );
    
    // Base travel time: 1 km = 2 minutes walking speed in wasteland
    let travelTime = distance * 2;
    
    // Apply danger level modifiers
    const avgDanger = (fromLocation.dangerLevel + toLocation.dangerLevel) / 2;
    const dangerModifier = 1 + (avgDanger * 0.1); // 10% per danger level
    
    // Squad efficiency (better squads move faster and safer)
    const squadEfficiency = Math.max(0.6, 1 - (squadLevel * 0.05));
    
    // Environmental factors
    const elevationDiff = Math.abs((fromLocation.coordinates.elevation || 0) - (toLocation.coordinates.elevation || 0));
    const elevationModifier = 1 + (elevationDiff / 1000) * 0.2; // 20% per 1000m elevation change
    
    travelTime = travelTime * dangerModifier * squadEfficiency * elevationModifier;
    
    return Math.max(5, Math.round(travelTime)); // Minimum 5 minutes
  }

  isParsed(): boolean {
    return this.parsed;
  }
}

export default KMZParser;