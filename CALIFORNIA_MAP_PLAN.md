# Fallout California Wasteland Map Implementation Plan

## Overview
Transform the current Mojave-based map into an authentic Fallout 1/2 California wasteland with Google Maps styling, featuring the NCR region centered around Shady Sands with a 250-mile coverage area.

## Core Requirements
- **Total Map Area**: 500 miles x 500 miles (250-mile radius from Shady Sands)
- **Theme**: Google Maps dark theme styling
- **Location Focus**: California NCR region (Fallout 1/2 lore)
- **Road Network**: Visible roads with actual distances
- **Player Settlement**: ~50 miles from Shady Sands
- **Combat Locations**: 50+ miles from Shady Sands

## Implementation Structure

### 1. Location System (`src/data/CaliforniaLocations.ts`)

**Major Settlements** (Fallout 1/2 lore-accurate):
- **Shady Sands** (50%, 50%) - NCR Capital, Center Point
- **Boneyard** (Los Angeles ruins) - South, ~150 miles
- **Dayglow** (San Diego glow zone) - Southwest, ~180 miles
- **Lost Hills** (BOS bunker) - West, ~100 miles
- **Vault 13** - North, ~80 miles
- **Gecko** (Ghoul settlement) - East, ~120 miles
- **Redding** (Mining town) - North, ~200 miles
- **New Vegas** (Mojave frontier) - East, ~200 miles
- **Hub** (Trading center) - South, ~120 miles
- **Junktown** - Southeast, ~90 miles
- **Necropolis** (LA ruins) - South, ~140 miles

**Combat Locations** (50+ miles from Shady Sands):
- Raider camps (various)
- Mutant strongholds
- Deathclaw territories
- Abandoned facilities
- Irradiated zones
- Caravan ambush sites
- Wildlife nests
- Outlaw hideouts

**Location Data Structure**:
```typescript
{
  id: string;
  name: string;
  type: 'settlement' | 'vault' | 'ruins' | 'facility' | 'combat' | 'outpost';
  coordinates: { x: number; y: number }; // Percentage (0-100)
  distanceFromShadySands: number; // Miles
  dangerLevel: number; // 1-10
  terrain: 'desert' | 'ruins' | 'mountains' | 'urban' | 'wasteland';
  description: string;
  connectedRoads: string[]; // Road IDs
  population?: number;
  faction?: string;
  resources?: string[];
}
```

### 2. Road Network System (`src/data/CaliforniaRoads.ts`)

**Major Pre-War Highways**:
- **Interstate 5** - Main north-south artery (Redding → Shady Sands → Boneyard)
- **Highway 99** - Parallel route to I-5
- **Interstate 80** - East-west route
- **Old Route 66** - Desert highway to New Vegas
- **Highway 101** - Coastal route
- **Interstate 15** - Northeast to New Vegas

**Road Segment Structure**:
```typescript
{
  id: string;
  name: string; // "Interstate 5 North Segment A"
  fromLocationId: string;
  toLocationId: string;
  distanceMiles: number; // Actual road distance
  condition: 'good' | 'damaged' | 'dangerous';
  dangerLevel: number; // 1-10, affects encounter chance
  travelTimeBase: number; // Minutes for average squad
  landmarks: string[]; // Points of interest
  speedModifier: number; // Affects travel speed
  encounterChance: number; // % chance per mile
}
```

**Road Conditions**:
- **Good**: 30 mph travel speed, low danger
- **Damaged**: 15 mph, medium danger
- **Dangerous**: 10 mph, high danger, frequent encounters

### 3. Travel Calculation System (`src/utils/CaliforniaTravelSystem.ts`)

**Travel Time Formula**:
```
baseTime = (roadDistance / baseSpeed)
modifiedTime = baseTime × difficultyMod × squadEfficiencyMod × roadConditionMod × weatherMod
```

**Modifiers**:
- Road condition (good: 1.0, damaged: 1.5, dangerous: 2.0)
- Squad level (better squads = faster, 0.95^level)
- Danger level (higher = more careful = slower, 1 + danger×0.1)
- Vehicle type (foot: 4mph, vehicle: 45mph)
- Weather (clear: 1.0, storm: 1.5, rad storm: 2.0)
- Time of day (day: 1.0, night: 1.3)

**Route Finding**:
- Dijkstra's algorithm for shortest path
- Consider road condition and danger
- Support multiple route options (fast/safe)
- Trade routes (established safe corridors)

### 4. Map Component (`src/components/maps/CaliforniaWastelandMap.tsx`)

**Visual Design** (Google Maps Dark Theme):
- Background: #1a1a1a (dark gray)
- Roads: Yellow/orange lines (#f59e0b) with glow
- Major highways: Thicker lines (4px)
- Minor roads: Thinner lines (2px)
- Location pins: Custom Fallout-style markers
- Labels: White text (#ffffff) with shadows
- Distance markers: Every 25 miles along routes
- Grid overlay: Subtle 50-mile grid

**Interactive Features**:
- Click locations to view details/select for missions
- Hover roads for distance and travel time
- Zoom controls (50-mile to 500-mile view)
- Pan/drag to explore
- Real-time squad position tracking
- Route highlighting when mission active
- Combat phase indicators on map

**Map Layers**:
1. Base terrain layer
2. Road network layer
3. Location markers layer
4. Squad movement layer
5. UI overlay layer

### 5. Combat Integration

**4-Phase Combat System**:
- **Travel** (15%): Squad follows roads to destination
- **Setup** (10%): Arrival and preparation at location
- **Combat** (60%): Actual engagement
- **Return** (15%): Squad returns via same or different route

**Real-Time Tracking**:
- Show squad icon moving along actual roads
- Display current road segment
- Show remaining distance on segment
- Update ETA based on road conditions
- Random encounter notifications

**Mission Planning**:
- Display route on map before mission starts
- Show estimated travel time
- Indicate danger zones along route
- Suggest alternate routes if available

### 6. Road Renderer Component (`src/components/maps/RoadRenderer.tsx`)

**Rendering Logic**:
- Convert road segments to SVG paths
- Apply condition-based styling
- Add distance markers
- Render road names
- Highlight active routes
- Show traffic/danger indicators

### 7. Route Pathfinder (`src/utils/RoutePathfinder.ts`)

**Pathfinding Algorithm** (A* or Dijkstra):
```typescript
findRoute(fromId, toId, options: {
  preferSafe: boolean; // Prioritize low-danger roads
  preferFast: boolean; // Prioritize good condition roads
  avoidLocations?: string[]; // Avoid specific locations
}): {
  route: RoadSegment[];
  totalDistance: number;
  totalTime: number;
  dangerRating: number;
}
```

### 8. Data Migration

**Convert Existing Locations**:
- Map current Mojave locations to California equivalents
- Update coordinates to percentage-based (0-100)
- Calculate actual distances from Shady Sands
- Assign to appropriate roads

**Update Game State**:
- Add roadNetwork field to GameState
- Add currentRoute to Mission interface
- Add travelPhase tracking
- Store route history

### 9. Player Settlement

**"Player Outpost" Location**:
- Randomly placed ~50 miles from Shady Sands
- Connected to Shady Sands via road
- Serves as home base
- Can be upgraded to improve:
  - Travel speed bonus
  - Fuel efficiency
  - Vehicle availability
  - Caravan protection

### 10. Visual Assets

**Styling Constants**:
```css
--map-background: #1a1a1a;
--road-primary: #f59e0b;
--road-secondary: #fbbf24;
--road-damaged: #dc2626;
--location-marker: #3b82f6;
--location-danger: #ef4444;
--grid-line: rgba(255, 255, 255, 0.05);
--text-label: #ffffff;
--shadow-glow: rgba(245, 158, 11, 0.5);
```

## Implementation Priority

### Phase 1: Core Data (Day 1)
1. ✅ Create CaliforniaLocations.ts with 30+ locations
2. ✅ Create CaliforniaRoads.ts with road network
3. ✅ Update types in GameTypes.ts

### Phase 2: Travel System (Day 1-2)
4. ✅ Implement CaliforniaTravelSystem.ts
5. ✅ Implement RoutePathfinder.ts
6. ✅ Update EnhancedTravelCalculator.ts

### Phase 3: Map Visualization (Day 2)
7. ✅ Create CaliforniaWastelandMap.tsx
8. ✅ Create RoadRenderer.tsx
9. ✅ Style with Google Maps dark theme

### Phase 4: Integration (Day 2-3)
10. ✅ Update CombatOperationsMap.tsx
11. ✅ Update Combat.tsx for road-based travel
12. ✅ Update gameReducer.ts for route tracking
13. ✅ Test and refine

## Success Criteria

- ✅ Map displays 250-mile radius from Shady Sands
- ✅ All locations from Fallout 1/2 lore included
- ✅ Clear visible road network matching reference image
- ✅ Accurate distance calculations based on roads
- ✅ Squad movement follows actual roads
- ✅ Google Maps dark theme styling
- ✅ Interactive location selection
- ✅ Real-time combat tracking on map
- ✅ Multiple route options for missions
- ✅ Road condition affects travel time

## Reference Image Notes
- Dark theme with subtle blue-gray tones
- Roads clearly visible as yellow/orange lines
- Location pins clickable
- Distance labels on map
- Professional Google Maps aesthetic
- Clean, readable design
