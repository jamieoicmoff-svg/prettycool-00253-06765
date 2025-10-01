# California Wasteland Map Coordinate System
## Official Documentation v2.0

## 🗺️ Map Overview

This map system is based on the **actual Fallout 1/2 California map** with accurate locations, distances, and geography matching the canonical game world.

### Map Dimensions
- **Total Coverage**: 800 miles (north-south) × 400 miles (east-west)
- **Coordinate System**: Percentage-based (0-100 for both X and Y)
- **Reference Point**: Shady Sands (NCR Capital) at center
- **Scale**: Real California geography adapted for Fallout universe

### Visual Settings
- **Display Size (Minimap)**: 1000px × 500px viewport
- **Display Size (Fullscreen)**: 2000px × 1000px viewport
- **ViewBox**: `0 0 100 100` (percentage coordinates)
- **Theme**: Dark Google Maps style (#1a1a1a background)

---

## 📍 Coordinate System Explained

### How Coordinates Work

The map uses **percentage-based coordinates** (0-100) for both X and Y axes:

- **X-axis (Horizontal)**: 0 = Far West Coast, 100 = Far East (Nevada border)
- **Y-axis (Vertical)**: 0 = Far North, 100 = Far South

**Example Locations:**
```typescript
{
  id: 'shady-sands',
  coordinates: { x: 35, y: 50 }  // Center-west of map, middle vertically
}
```

### Converting Real Distances to Map Coordinates

**Formula for Distance:**
```
1% on X-axis = ~4 miles
1% on Y-axis = ~8 miles
```

**Example Calculation:**
```
Player Outpost is 180 miles from Shady Sands
Shady Sands: { x: 35, y: 50 }
Player Outpost: { x: 15, y: 72 }

Distance calculation:
Δx = 35 - 15 = 20% = 80 miles (horizontal)
Δy = 72 - 50 = 22% = 176 miles (vertical)
Total ≈ √(80² + 176²) ≈ 193 miles ✓
```

---

## 🏙️ Adding New Locations

### Step 1: Choose Your Coordinates

Use the **coordinate grid** to place your location:

#### North California (Y: 0-30)
- **Far North**: Navarro, Klamath
- **North**: Redding, Modoc, Den

#### Central California (Y: 30-60)
- **North-Central**: Vault City, New Reno, San Francisco
- **Central**: Gecko, NCR (Shady Sands), Vault 13

#### South California (Y: 60-100)
- **South-Central**: Modoc, Junktown, Hub
- **South**: Boneyard (LA), Necropolis
- **Far South**: Dayglow (San Diego)

#### West-East Positioning (X-axis)
- **Coast (X: 0-25)**: San Francisco, Lost Hills, coastal locations
- **Central Valley (X: 25-50)**: Shady Sands, Junktown, most settlements
- **Desert East (X: 50-75)**: Hub, Barstow area
- **Mojave (X: 75-100)**: New Vegas, eastern frontier

### Step 2: Calculate Distance from Shady Sands

Use this formula:
```javascript
const shadySands = { x: 35, y: 50 };
const newLocation = { x: yourX, y: yourY };

const deltaX = Math.abs(newLocation.x - shadySands.x) * 4; // miles
const deltaY = Math.abs(newLocation.y - shadySands.y) * 8; // miles
const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
```

### Step 3: Add Location to CaliforniaLocations.ts

```typescript
{
  id: 'your-location-id',           // Unique identifier (kebab-case)
  name: 'Your Location Name',       // Display name
  type: 'settlement',               // settlement | vault | ruins | facility | combat | outpost | landmark
  coordinates: { x: 45, y: 60 },   // Your calculated coordinates
  distanceFromShadySands: 120,     // Calculated distance in miles
  dangerLevel: 5,                   // 1-10 (1=safe, 10=deadly)
  terrain: 'wasteland',             // desert | ruins | mountains | urban | wasteland | coast | facility
  description: 'Your description',  // What players see
  connectedRoads: ['road-id-1'],   // Array of road IDs connecting here
  population: 500,                  // Optional: population count
  faction: 'NCR',                   // Optional: controlling faction
  resources: ['food', 'water'],     // Optional: available resources
  preWarBuildings: ['Building 1'], // Optional: notable structures
  discovered: false                 // true = always visible, false = requires discovery
}
```

---

## 🛣️ Adding New Roads

### Road Types
1. **Interstate** (4px width, yellow): Major highways (I-5, I-15, I-80)
2. **Highway** (3px width, orange): State routes (Hwy 99, Hwy 101)
3. **Minor** (2px width, brown): Local roads, trails

### Step 1: Plan Your Road

Roads connect two locations. Determine:
- **From Location**: Starting point ID
- **To Location**: Ending point ID
- **Route Type**: Direct or curved path
- **Real Distance**: Miles via this road (can be longer than straight-line)

### Step 2: Add Road to CaliforniaRoads.ts

```typescript
{
  id: 'your-road-id',                    // Unique identifier
  name: 'Highway 99 North Section',      // Display name
  fromLocationId: 'location-a',          // Starting location ID
  toLocationId: 'location-b',            // Ending location ID
  distanceMiles: 85,                     // Actual road distance
  condition: 'good',                     // good | damaged | dangerous
  dangerLevel: 4,                        // 1-10 encounter danger
  travelTimeBase: 140,                   // Minutes for average squad
  landmarks: ['Old Bridge', 'Gas Station'], // Points of interest
  speedModifier: 1.0,                    // Travel speed multiplier (0.5-1.0)
  encounterChance: 0.06,                 // Chance per mile (0.0-1.0)
  roadType: 'highway',                   // interstate | highway | minor
  curveControlPoints: [                  // Optional: for curved roads
    { x: 40, y: 35 },                   // Bezier curve control point(s)
    { x: 45, y: 30 }                    // Add multiple for complex curves
  ]
}
```

### Step 3: Creating Curved Roads

For roads that aren't straight lines, use **Bezier control points**:

```typescript
// Straight road (no curve)
curveControlPoints: []

// Slight curve (one control point)
curveControlPoints: [{ x: 40, y: 50 }]

// Complex curve (multiple control points)
curveControlPoints: [
  { x: 35, y: 45 },
  { x: 42, y: 48 }
]
```

**Control points** pull the road toward them, creating smooth curves.

---

## 🎨 Map Styling Reference

### Location Marker Colors
```typescript
'settlement': '#8b5cf6',  // purple-500
'vault': '#06b6d4',       // cyan-500
'facility': '#ef4444',    // red-500
'combat': '#f59e0b',      // amber-500
'outpost': '#10b981',     // green-500
'ruins': '#6b7280',       // gray-500
'landmark': '#3b82f6'     // blue-500
```

### Location Marker Sizes
```typescript
'settlement': 12px,
'vault': 10px,
'facility': 10px,
'combat': 8px,
'outpost': 10px,
'player-outpost': 14px  // Special: player's base
```

### Road Colors by Type
```typescript
'interstate': '#f59e0b',  // amber-500 (yellow)
'highway': '#fb923c',     // orange-400
'minor': '#92400e',       // brown-800
```

### Road Width by Type
```typescript
'interstate': 4px,
'highway': 3px,
'minor': 2px
```

---

## 📊 Reference Locations (Based on Fallout Canon)

### Northern California (Y: 0-30)
```typescript
Klamath        { x: 38, y: 8 }   // Far north tribal area
Den            { x: 42, y: 12 }  // Crime-ridden settlement
Modoc          { x: 35, y: 15 }  // Farming community
Redding        { x: 32, y: 18 }  // Mining town
Navarro        { x: 8, y: 12 }   // Enclave base (coast)
```

### Central California (Y: 30-60)
```typescript
New Reno       { x: 60, y: 28 }  // City of vice
Vault City     { x: 52, y: 32 }  // Advanced settlement
Gecko          { x: 38, y: 42 }  // Ghoul town, power plant
San Francisco  { x: 12, y: 48 }  // Shi-controlled city
Vault 13       { x: 18, y: 52 }  // Original vault
Shady Sands    { x: 35, y: 50 }  // NCR capital (CENTER)
Broken Hills   { x: 75, y: 38 }  // Mining town (east)
```

### Southern California (Y: 60-100)
```typescript
Vault 15       { x: 38, y: 58 }  // Near Shady Sands
Player Outpost { x: 15, y: 72 }  // Your settlement
Junktown       { x: 40, y: 68 }  // Fortified settlement
Hub            { x: 52, y: 72 }  // Trading center
Boneyard (LA)  { x: 22, y: 84 }  // Los Angeles ruins
Necropolis     { x: 18, y: 86 }  // Ghoul city
Dayglow (SD)   { x: 24, y: 96 }  // San Diego (far south)
New Vegas      { x: 88, y: 64 }  // Far east (Mojave)
```

---

## 🧭 Quick Reference: Distance Calculator

Use this tool to calculate distances between any two points:

```javascript
function calculateDistance(loc1, loc2) {
  const deltaX = Math.abs(loc2.x - loc1.x) * 4;  // X-axis: 4 miles per %
  const deltaY = Math.abs(loc2.y - loc1.y) * 8;  // Y-axis: 8 miles per %
  return Math.round(Math.sqrt(deltaX ** 2 + deltaY ** 2));
}

// Example: Distance from Shady Sands to Player Outpost
const distance = calculateDistance(
  { x: 35, y: 50 },  // Shady Sands
  { x: 15, y: 72 }   // Player Outpost
);
// Result: ~193 miles
```

---

## 🔧 Modifying Existing Locations

### To Move a Location:
1. Open `src/data/CaliforniaLocations.ts`
2. Find the location by `id`
3. Update `coordinates: { x: newX, y: newY }`
4. Recalculate `distanceFromShadySands` using formula above
5. Update any `connectedRoads` if road connections change

### To Change a Location's Properties:
```typescript
// Change danger level
dangerLevel: 7,  // Increase from 5 to 7

// Add resources
resources: ['food', 'water', 'ammunition'],

// Change faction control
faction: 'Raiders',

// Update description
description: 'A fortified raider stronghold...',
```

---

## 🌐 Map Display Settings

### Minimap (Combat Tab)
- Container size: `1000px × 500px`
- ViewBox: `0 0 100 100`
- Shows current region
- Click to open fullscreen

### Fullscreen Map
- Container size: `2000px × 1000px`
- ViewBox: `0 0 100 100`
- Pan and zoom enabled
- Shows entire California

---

## ⚠️ Important Notes

1. **Always use percentage coordinates** (0-100), never pixel values
2. **Test distance calculations** before adding locations
3. **Roads must connect existing locations** (both IDs must be valid)
4. **Keep road distances realistic** (account for terrain, curves)
5. **Player Outpost is always visible** (discovered: true)
6. **Major cities should be discoverable** (discovered: false initially)

---

## 🎯 Common Tasks Quick Guide

### Add a New Combat Zone Near Player
1. Choose coordinates ~20-50 miles away
2. Set `type: 'combat'`
3. Set `dangerLevel: 4-7`
4. Add road connection from player-outpost
5. Set `discovered: true` for visibility

### Add a New Settlement
1. Choose coordinates based on region
2. Set `type: 'settlement'`
3. Add population and faction
4. Connect to at least 2 roads
5. Set `discovered: false` (requires discovery)

### Create a New Highway
1. Plan route between 2+ locations
2. Create multiple road segments
3. Use consistent naming (e.g., "I-5 North Section A", "I-5 North Section B")
4. Add control points for realistic curves
5. Set appropriate danger levels

---

## 📞 Need Help?

- Check `CaliforniaLocations.ts` for location examples
- Check `CaliforniaRoads.ts` for road examples
- Use the distance calculator above
- Refer to the Fallout wiki for lore-accurate placement

**Last Updated**: October 2025
**Version**: 2.0 - Accurate Fallout Geography
