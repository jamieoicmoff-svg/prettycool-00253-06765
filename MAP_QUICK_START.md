# 🗺️ California Wasteland Map - Quick Start Guide

## What Changed?

Your map has been **completely rebuilt** with an accurate coordinate system based on the actual Fallout 1/2 California map. Here's what's new:

### ✅ Key Improvements
- **Accurate Geography**: Locations match Fallout canon placement
- **Proper Scaling**: Player Outpost is now **185+ miles** from Shady Sands (3x further!)
- **Real Distances**: All distances calculated from actual California geography
- **Consistent System**: Both minimap and fullscreen use the same percentage-based coordinates
- **Easy to Edit**: Simple coordinate system with clear documentation

---

## 📏 How the Map Works

### Coordinate System
The map uses **percentage-based coordinates** (0-100):

```
X-axis (Horizontal): 0 = West Coast → 100 = Nevada border
Y-axis (Vertical):   0 = Far North → 100 = Far South
```

### Scale Reference
- **Total Map**: 800 miles (N-S) × 400 miles (E-W)
- **1% on X-axis** = ~4 miles
- **1% on Y-axis** = ~8 miles

### Example:
```typescript
Shady Sands:    { x: 35, y: 50 }  // Center of map
Player Outpost: { x: 15, y: 72 }  // Southwest coast, 185 miles away!
```

---

## 🎯 Quick Tasks

### Adding a New Combat Zone

1. **Choose coordinates** (use the reference map or calculate distance)
2. **Open** `src/data/CaliforniaLocations.ts`
3. **Add location:**

```typescript
{
  id: 'my-combat-zone',
  name: 'Raider Stronghold',
  type: 'combat',
  coordinates: { x: 45, y: 60 },  // Your chosen position
  distanceFromShadySands: 120,    // Calculate or estimate
  dangerLevel: 6,                  // 1-10
  terrain: 'wasteland',
  description: 'A fortified raider base...',
  connectedRoads: ['road-id'],    // Roads that connect here
  faction: 'Raiders',
  resources: ['weapons', 'ammo'],
  discovered: true                 // true = always visible
}
```

4. **Add a road** in `src/data/CaliforniaRoads.ts`:

```typescript
{
  id: 'road-to-my-zone',
  name: 'Road to Raider Stronghold',
  fromLocationId: 'player-outpost',
  toLocationId: 'my-combat-zone',
  distanceMiles: 85,
  condition: 'damaged',  // good | damaged | dangerous
  dangerLevel: 6,
  travelTimeBase: 160,
  landmarks: ['Abandoned vehicles'],
  speedModifier: 0.7,
  encounterChance: 0.10,
  roadType: 'minor',  // interstate | highway | minor
  curveControlPoints: []  // For curved roads
}
```

### Calculating Distance

Use this formula to calculate distance from Shady Sands (35, 50):

```javascript
const shadySands = { x: 35, y: 50 };
const myLocation = { x: 45, y: 60 };

const deltaX = Math.abs(myLocation.x - shadySands.x) * 4;  // 40 miles
const deltaY = Math.abs(myLocation.y - shadySands.y) * 8;  // 80 miles
const distance = Math.sqrt(40*40 + 80*80);  // ≈ 89 miles
```

### Moving a Location

1. **Find the location** in `CaliforniaLocations.ts`
2. **Change coordinates**: `coordinates: { x: newX, y: newY }`
3. **Recalculate distance** using formula above
4. **Update** `distanceFromShadySands: newDistance`

---

## 🛣️ Road System

### Road Types
- **Interstate** (thick yellow): I-5, I-15, I-80 - major highways
- **Highway** (medium orange): Hwy 99, Hwy 101 - state routes
- **Minor** (thin brown): local roads, trails

### Road Conditions
- **Good** (green): Fast travel, low danger
- **Damaged** (yellow): Slower travel, medium danger
- **Dangerous** (red): Slow travel, high danger, frequent encounters

### Creating Curved Roads

For roads that curve, add control points:

```typescript
{
  id: 'curved-highway',
  // ... other properties ...
  curveControlPoints: [
    { x: 40, y: 45 }  // One point = gentle curve
  ]
}

// For complex curves:
curveControlPoints: [
  { x: 40, y: 45 },
  { x: 48, y: 48 }  // Two points = S-curve
]
```

---

## 📍 Location Reference

### Current Major Locations

**Northern California** (Y: 0-40)
- Navarro (8, 12) - Enclave base
- Redding (32, 18) - Mining town
- New Reno (60, 28) - City of vice
- Vault City (52, 32) - Advanced settlement
- Gecko (38, 42) - Ghoul power plant

**Central California** (Y: 40-60)
- San Francisco (12, 48) - Shi Empire
- **Shady Sands (35, 50)** - NCR Capital ⭐
- Vault 13 (18, 52) - Original vault
- Vault 15 (38, 58) - Raider-occupied

**Southern California** (Y: 60-100)
- Junktown (40, 68) - Fortified settlement
- Lost Hills (12, 68) - BOS bunker
- **Player Outpost (15, 72)** - Your base 🏠
- Hub (52, 72) - Trading center
- Boneyard (22, 84) - LA ruins
- Necropolis (18, 86) - Ghoul city
- Dayglow (24, 96) - San Diego

**Eastern Frontier** (X: 75-100)
- New Vegas (88, 64) - Mojave jewel

---

## 🎨 Visual Customization

### Location Colors
Edit in `CaliforniaWastelandMap.tsx`:

```typescript
const getMarkerColor = (location) => {
  switch (location.type) {
    case 'settlement': return '#8b5cf6';  // purple
    case 'vault': return '#06b6d4';       // cyan
    case 'facility': return '#ef4444';    // red
    case 'combat': return '#f59e0b';      // amber
    case 'outpost': return '#10b981';     // green
    default: return '#6b7280';            // gray
  }
};
```

### Location Sizes
```typescript
const getMarkerSize = (location) => {
  if (location.id === 'player-outpost') return 1.4;  // Largest
  
  switch (location.type) {
    case 'settlement': return 1.2;
    case 'vault': return 1.0;
    case 'combat': return 0.8;  // Smallest
    default: return 1.0;
  }
};
```

---

## 🔧 Troubleshooting

### Location doesn't appear on map
- Check `discovered: true` in location data
- Verify coordinates are between 0-100
- Make sure location has valid `connectedRoads`

### Road doesn't show
- Verify both `fromLocationId` and `toLocationId` exist
- Check that location IDs match exactly (case-sensitive)
- Ensure `curveControlPoints` use percentage coordinates

### Distance seems wrong
- Recalculate using the distance formula
- Remember: 1% X = 4 miles, 1% Y = 8 miles
- Check your math: `distance = sqrt(deltaX² + deltaY²)`

### Map looks zoomed in/out
- Check `viewBox="0 0 100 100"` in SVG
- Verify `preserveAspectRatio="xMidYMid meet"`
- Make sure container has proper width/height

---

## 📂 File Structure

```
src/
├── data/
│   ├── CaliforniaLocations.ts   ← Add/edit locations here
│   └── CaliforniaRoads.ts       ← Add/edit roads here
├── components/maps/
│   ├── CaliforniaWastelandMap.tsx    ← Minimap component
│   ├── FullscreenCaliforniaMap.tsx   ← Fullscreen component
│   ├── RoadRenderer.tsx              ← Renders roads
│   └── FullscreenMap.tsx             ← Wrapper component
└── components/operations/
    └── CombatOperationsMap.tsx       ← Combat tab map
```

---

## 🚀 Best Practices

### ✅ DO:
- Use percentage coordinates (0-100) for everything
- Calculate distances accurately
- Add roads to connect new locations
- Set `discovered: true` for visible locations
- Use descriptive names and IDs

### ❌ DON'T:
- Use pixel coordinates (map will break)
- Place locations outside 0-100 range
- Forget to add connecting roads
- Use duplicate IDs
- Change the coordinate system itself

---

## 🎯 Common Patterns

### Pattern 1: Add Location Near Shady Sands
```typescript
// Within 50 miles radius
coordinates: { x: 35 ± 6, y: 50 ± 3 }
distanceFromShadySands: 30-50
```

### Pattern 2: Add Remote Location
```typescript
// Far from Shady Sands (200+ miles)
coordinates: anywhere outside { x: 20-50, y: 40-60 }
distanceFromShadySands: 200+
```

### Pattern 3: Coastal Location
```typescript
// Western coast
coordinates: { x: 8-20, y: any }
terrain: 'coast'
```

### Pattern 4: Desert Location
```typescript
// Central/eastern wasteland
coordinates: { x: 40-70, y: 50-80 }
terrain: 'desert'
```

---

## 📖 Full Documentation

For complete details, see:
- **MAP_COORDINATE_SYSTEM.md** - In-depth coordinate guide
- **CALIFORNIA_MAP_PLAN.md** - Original planning document
- **CALIFORNIA_MAP_PROGRESS.md** - Development notes

---

## 💡 Tips

1. **Use the Grid**: The map shows a subtle grid - each square is ~80 miles
2. **Test Your Changes**: Check both minimap and fullscreen view
3. **Reference Real Fallout**: Use the Google Maps link in requirements
4. **Start Small**: Add one location at a time
5. **Check Distances**: Use the calculator formula frequently

---

## 🆘 Need Help?

1. Check `MAP_COORDINATE_SYSTEM.md` for detailed examples
2. Look at existing locations in `CaliforniaLocations.ts` for patterns
3. Copy and modify an existing location/road
4. Use the distance calculator formula above
5. Test in-game to verify placement

---

**Last Updated**: October 2025  
**Map Version**: 2.0 - Accurate Fallout Geography
