# California Map Refinement Plan - Complete Overhaul

**Created**: 2025-09-29  
**Status**: Ready for Implementation

---

## 1. MAP DIMENSIONS & LAYOUT FIX

### Problem
- Too much vertical black space at bottom
- Map overlapping UI at top  
- Doesn't look like 200+ miles
- Wrong aspect ratio for California

### Solution

**Embedded/Minimap Mode** (Operations panel):
- Dimensions: 1000w x 500h (shorter, wider view)
- ViewBox: `0 0 1000 500`
- Remove top padding to prevent UI overlap
- Crop to show only central California region
- Hide title/legend (parent provides context)

**Fullscreen Mode**:
- Dimensions: 2000w x 1800h (MUCH larger, highly detailed)
- ViewBox: `0 0 2000 1800` 
- Show entire California + eastern Nevada border
- Full title, legend, and controls visible
- Locations much more spread out (realistic distances)
- Grid overlay with 50-mile markers
- Show entire California + eastern Nevada border
- Full title, legend, and controls visible
- Locations much more spread out (realistic distances)
- Grid overlay with 50-mile markers

**Key Changes**:
- Embedded locations use coordinates 0-100% mapped to 1000x500
- Fullscreen locations use SAME percentages but mapped to 2000x1800 (appears more spread out)
- This makes fullscreen feel expansive while keeping data consistent

---

## 2. GEOGRAPHIC ACCURACY - REAL CALIFORNIA LOCATIONS

### Reference Map
Using: https://www.google.com/maps/d/u/0/edit?hl=en_US&app=mp&mid=1puuQVpbfh4ofYflJxJPB6iul6JQ

### Corrected Major City Positions

Based on REAL California geography:

| Location | Real Position | Map Coordinates (%) | Distance from Shady Sands |
|----------|--------------|---------------------|---------------------------|
| **Shady Sands** (Bakersfield area) | Central CA | (32, 65) | 0 mi (CENTER) |
| **New Vegas** (Las Vegas, NV) | East of CA border | (88, 58) | ~220 mi E |
| **Boneyard** (Los Angeles) | Southern CA coast | (28, 78) | ~110 mi S |
| **Hub** (Barstow area) | Mojave Desert | (42, 72) | ~85 mi SE |
| **Junktown** (San Bernardino) | Inland Empire | (34, 76) | ~75 mi SSE |
| **Necropolis** (Downey/LA) | LA suburbs | (26, 79) | ~120 mi S |
| **Dayglow** (San Diego) | Southern coast | (30, 92) | ~180 mi SSW |
| **Lost Hills** (Santa Barbara) | Coast | (18, 70) | ~95 mi SW |
| **Vault 13** (San Luis Obispo) | Central coast | (14, 58) | ~85 mi W |
| **Gecko** (Modesto) | Central Valley | (30, 48) | ~90 mi N |
| **Redding** (Redding, CA) | Northern CA | (28, 18) | ~240 mi N |
| **San Francisco** (SF) | Bay Area | (15, 42) | ~185 mi NW |

### Player Settlement Position
- **Name**: "Outpost Sentinel" or "Player's Haven"
- **Position**: 50 miles **SOUTHWEST** of Shady Sands
- **Coordinates**: (26, 70) - between Shady Sands and Lost Hills
- **Terrain**: Desert/Wasteland
- **Starting Status**: Discovered, safe zone

---

## 3. REAL CALIFORNIA ROADS - AUTHENTIC HIGHWAY SYSTEM

### Problem
Current roads don't match real California highways

### Solution
Base roads on REAL pre-war highways with accurate routes and shapes:

#### **Interstate 5** (Main North-South Artery)
- Route: Redding → Sacramento → Shady Sands (Bakersfield) → Los Angeles (Boneyard) → San Diego (Dayglow)
- Coordinates path: (28,18) → (26,38) → (32,65) → (28,78) → (30,92)
- Condition: Good (well-maintained by NCR)
- Total segments: 5

#### **Interstate 15** (Northeast to Vegas)
- Route: Boneyard → Hub (Barstow) → New Vegas
- Coordinates path: (28,78) → (42,72) → (88,58)
- Condition: Damaged (desert erosion)
- Segments: 2

#### **Highway 101** (Coastal Route)
- Route: San Diego → LA → Lost Hills (Santa Barbara) → Vault 13 → SF
- Coordinates path: (30,92) → (26,79) → (18,70) → (14,58) → (15,42)
- Condition: Good to Damaged (coastal weather)
- Segments: 4

#### **Interstate 80** (Northern East-West)
- Route: SF → Sacramento → Reno
- Coordinates path: (15,42) → (26,38) → (68,32)
- Condition: Dangerous (mountain passes)
- Segments: 2

#### **Highway 99** (Central Valley Parallel to I-5)
- Route: Redding → Sacramento → Gecko → Shady Sands → Hub
- Coordinates path: (28,18) → (26,38) → (30,48) → (32,65) → (42,72)
- Condition: Good (NCR trade route)
- Segments: 4

#### **Old Route 66** (Historic Desert Highway)
- Route: Hub → Needles → New Vegas
- Coordinates path: (42,72) → (65,64) → (88,58)
- Condition: Dangerous (raider territory)
- Segments: 2

#### **Highway 1** (Pacific Coast Highway)
- Route: SF → Monterey → San Luis Obispo
- Coordinates path: (15,42) → (12,52) → (14,58)
- Condition: Damaged (scenic but crumbling)
- Segments: 2

### Road Curve Implementation
- Use quadratic Bezier curves for realistic highway bends
- North-south roads: slight east-west curves
- Mountain passes: dramatic curves (I-80, Highway 1)
- Desert roads: gentler curves (I-15, Route 66)
- Control points offset perpendicular to road direction

---

## 4. LOCAL COMBAT ZONES (Near Player Settlement)

### Design Philosophy
- 5-10 unique locations within 15-30 miles of Player Settlement (26, 70)
- Each has unique enemy type, story, and visual identity
- Mix of hostile factions, wildlife, and environmental hazards

### 10 Unique Combat Locations

#### 1. **Viper's Nest** (Viper Gang Camp)
- **Distance**: 12 miles NE of Player Settlement
- **Coordinates**: (29, 68)
- **Enemies**: Viper Gang raiders (8-12)
- **Danger**: 4/10
- **Loot**: Leather armor, pistols, chems, caps
- **Description**: Makeshift camp with scrap metal walls and guard towers

#### 2. **Rust Creek Station** (Abandoned Gas Station)
- **Distance**: 18 miles S of Player Settlement  
- **Coordinates**: (25, 73)
- **Enemies**: Scavengers, radroaches (6-10)
- **Danger**: 3/10
- **Loot**: Scrap metal, tools, fuel canisters
- **Description**: Pre-war gas station overrun by desperate scavengers

#### 3. **Scorpion Gulch** (Radscorpion Breeding Ground)
- **Distance**: 22 miles SE of Player Settlement
- **Coordinates**: (30, 73)
- **Enemies**: Radscorpions (10-15)
- **Danger**: 5/10
- **Loot**: Radscorpion poison glands, chitin
- **Description**: Rocky canyon filled with giant scorpion nests

#### 4. **Chains' Camp** (Slaver Outpost)
- **Distance**: 28 miles W of Player Settlement
- **Coordinates**: (21, 69)
- **Enemies**: Slavers (8-10)
- **Danger**: 6/10
- **Loot**: Combat armor, rifles, slave collars
- **Description**: Fortified slaver camp with caged prisoners

#### 5. **Broken Wheel Settlement** (Hostile Wastelanders)
- **Distance**: 24 miles NW of Player Settlement
- **Coordinates**: (23, 67)
- **Enemies**: Renegade settlers (10-12)
- **Danger**: 4/10
- **Loot**: Farming tools, food, hunting rifles
- **Description**: Paranoid settlement that shoots strangers on sight

#### 6. **Highway 5 Tollbooth** (Raider Checkpoint)
- **Distance**: 30 miles N of Player Settlement
- **Coordinates**: (28, 65)
- **Enemies**: Roadside bandits (8-10)
- **Danger**: 5/10
- **Loot**: Caravan goods, weapons, ammo
- **Description**: Raiders extorting travelers on I-5

#### 7. **Greenfield Ruins** (Feral Ghoul Territory)
- **Distance**: 26 miles E of Player Settlement
- **Coordinates**: (32, 71)
- **Enemies**: Feral ghouls (15-20)
- **Danger**: 6/10
- **Loot**: Pre-war money, Med-X, radiation suits
- **Description**: Irradiated town ruins crawling with feral ghouls

#### 8. **Old Fort Irwin** (Military Robots)
- **Distance**: 35 miles SE of Player Settlement
- **Coordinates**: (34, 74)
- **Enemies**: Sentry bots, protectrons (6-8)
- **Danger**: 7/10
- **Loot**: Energy weapons, military-grade armor, fusion cores
- **Description**: Abandoned military base with active defense systems

#### 9. **Deathclaw Pass** (Deathclaw Territory)
- **Distance**: 40 miles NE of Player Settlement
- **Coordinates**: (32, 66)
- **Enemies**: Deathclaws (2-4)
- **Danger**: 9/10
- **Loot**: Deathclaw hides, eggs (rare), powerful weapons from victims
- **Description**: Mountain pass claimed by deadly deathclaws

#### 10. **Camp Searchlight** (Irradiated Raider Base)
- **Distance**: 32 miles SW of Player Settlement
- **Coordinates**: (22, 72)
- **Enemies**: Irradiated raiders, radroaches (12-15)
- **Danger**: 5/10
- **Loot**: RadAway, Rad-X, hazmat suits, energy weapons
- **Description**: Former raider base destroyed by radiation leak

---

## 5. PRE-WAR BUILDINGS & FACTION OUTPOSTS

### Pre-War Building Types (Add to Locations)

#### Settlement Buildings
- **Shady Sands**: Pre-war library, town hall, water tower
- **Boneyard**: Skyscrapers, sports arena, university ruins
- **Hub**: Trading post, warehouse district, rail yard
- **San Francisco**: Golden Gate remains, Chinatown, docks

#### Military Installations
- **Lost Hills**: Brotherhood of Steel bunker (pre-war military base)
- **Old Fort Irwin**: Army base with robot defenses
- **Navarro**: Enclave outpost (far north, undiscovered)

#### Vaults
- **Vault 13**: Original vault entrance and caverns
- **Vault 15**: Partially collapsed (near Shady Sands)

### Lore-Accurate Faction Outposts

#### **NCR (New California Republic)** - MAJOR PRESENCE
- **Shady Sands**: NCR Capital, full military presence
- **Highway Patrol Posts**: Along I-5 and Highway 99 (every 50 miles)
- **Boneyard Garrison**: Military base near LA
- **Hub Trade Station**: NCR-protected trading hub

#### **Brotherhood of Steel** - ISOLATED
- **Lost Hills Bunker**: BoS headquarters (hidden, discovered only after quest)
- **Small Reconnaissance Posts**: 2-3 hidden locations (undiscovered)
- Lore: Isolationist, not openly engaged with surface

#### **Enclave** - HIDDEN/LATE GAME
- **Navarro**: Secret base far north (coordinates: 22, 12)
- Status: Undiscovered until late game
- Danger: 10/10

#### **Raiders/Bandits** - SCATTERED
- Multiple small camps (Vipers, Khans, generic raiders)
- Not a unified faction, just hostile groups

#### **Ghouls** - COMMUNITY BASED
- **Gecko**: Ghoul settlement with power plant
- **Necropolis**: Feral and non-feral ghouls
- **Dayglow**: Ghoul traders and scientists

#### **Traders/Merchants** - NEUTRAL
- **Hub**: Major trading center
- **Caravan Routes**: Along major highways
- **Trading Posts**: Small outposts along I-5 and Highway 99

---

## 6. FULLSCREEN MODE WITH ZOOM/PAN CONTROLS

### Implementation: `FullscreenCaliforniaMap.tsx`

#### Desktop Controls
- **Zoom In**: + button, mouse wheel up, or double-click
- **Zoom Out**: - button, mouse wheel down
- **Pan**: Click and drag map
- **Reset View**: Reset button
- **Close**: X button or ESC key

#### Mobile/Touch Controls
- **Zoom**: Pinch to zoom gesture
- **Pan**: Single finger drag
- **Reset**: Double-tap with two fingers
- **Close**: Close button (larger touch target)

#### Zoom Levels
- **Min Zoom**: 1x (full map view)
- **Max Zoom**: 4x (detailed location view)
- **Default**: 1x
- **Smooth Transitions**: 300ms ease-in-out

#### UI Elements in Fullscreen
- **Top Bar**: Title, close button, zoom level indicator
- **Right Panel**: Zoom controls, reset button
- **Bottom Panel**: Legend, current selection info
- **Left Panel**: Location list (filtered by discovered)

### Map Transform System
```typescript
interface MapTransform {
  zoom: number; // 1-4x
  panX: number; // pixels
  panY: number; // pixels
  isDragging: boolean;
}

// Apply transform
style={{
  transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
  transition: isDragging ? 'none' : 'transform 0.3s ease-in-out'
}}
```

---

## 7. DISCOVERY & FOG OF WAR SYSTEM

### Implementation: `LocationDiscoverySystem.ts`

#### Discovery Rules
1. **Always Visible**:
   - Player Settlement (Outpost Sentinel)
   - Locations within 40 miles of Player Settlement at game start

2. **Initially Hidden** (Undiscovered):
   - Shady Sands (NCR Capital)
   - New Vegas
   - All major cities (Boneyard, Hub, San Francisco, etc.)
   - Faction outposts (BoS, Enclave)
   - Distant combat zones

3. **Discovery Methods**:
   - Complete mission to a location → discover it
   - Discover nearby locations when visiting (30-mile radius)
   - Special quests reveal major cities
   - Buy maps from traders

#### Visual Representation
- **Undiscovered Locations**: 
  - Gray circle with "???" label
  - No details shown
  - Can't be selected for missions
  - Faded on map

- **Discovered Locations**:
  - Full color marker
  - Name visible
  - Details on hover
  - Selectable for missions

#### State Management
```typescript
interface GameState {
  discoveredLocations: string[]; // Location IDs
  explorationRadius: number; // Default 40 miles
}

// Actions
DISCOVER_LOCATION: (locationId: string) => void
DISCOVER_NEARBY_LOCATIONS: (centerLocationId: string, radius: number) => void
```

---

## 8. INTERACTIVE ROADS & CITIES - DETAILED INFO PANELS

### Click Interaction System

#### Clicking on Roads
Shows panel with:
- **Road Name**: "Interstate 5 - Southern Section"
- **Distance**: "85 miles"
- **Condition**: "Good" (color-coded)
- **Danger Level**: "3/10"
- **Connecting Locations**: "Shady Sands → Boneyard"
- **Travel Time**: "~2 hours 15 minutes"
- **Encounter Chance**: "15% per trip"
- **Description**: "Well-maintained highway protected by NCR patrols"

#### Clicking on Cities/Locations
Shows panel with:
- **Name**: "Shady Sands"
- **Type**: "Settlement - NCR Capital"
- **Distance from Player**: "50 miles NE"
- **Danger Level**: "1/10 (Safe Zone)"
- **Population**: "~3,000"
- **Faction Control**: "New California Republic"
- **Terrain**: "Desert / Urban"
- **Pre-War Buildings**: 
  - NCR Government Building (pre-war library)
  - Water tower
  - Town hall
- **Resources**: "Food, water, medical supplies, ammunition"
- **Description**: "The capital of the NCR and heart of civilization in the wasteland"
- **Available Actions**:
  - "Send Squad on Mission" (if discovered)
  - "View Trade Options"
  - "Fast Travel" (if unlocked)

### Panel Layout
```
┌─────────────────────────────────┐
│ [X] Close                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 📍 SHADY SANDS                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                 │
│ Type: Settlement (NCR Capital) │
│ Distance: 50 miles NE          │
│ Danger: ⚠️ 1/10 (Safe)         │
│ Population: ~3,000             │
│                                 │
│ Faction: 🛡️ NCR               │
│ Terrain: Desert / Urban        │
│                                 │
│ Pre-War Buildings:             │
│ • Government Building          │
│ • Water Tower                  │
│ • Town Hall                    │
│                                 │
│ Resources Available:           │
│ • Food & Water                 │
│ • Medical Supplies             │
│ • Ammunition                   │
│                                 │
│ Description:                   │
│ The capital of the NCR and     │
│ heart of civilization...       │
│                                 │
│ [Send Mission] [Trade] [Travel]│
└─────────────────────────────────┘
```

---

## 9. MOBILE RESPONSIVENESS

### Minimap (Embedded Mode) - Mobile Optimizations
- **Height Reduction**: 600px → 400px on mobile
- **Touch Targets**: Minimum 44px for location markers
- **Simplified UI**: Hide legend, show only essential info
- **Tap to Open Fullscreen**: Single tap anywhere on minimap

### Fullscreen Mode - Mobile
- **Full Screen API**: Use browser fullscreen on mobile
- **Portrait/Landscape**: Adapt layout for both orientations
- **Touch Gestures**:
  - Pinch to zoom
  - Single finger drag to pan
  - Two-finger double-tap to reset
- **Bottom Sheet UI**: Info panels slide up from bottom (mobile-friendly)
- **Large Touch Targets**: All buttons minimum 48px
- **Simplified Controls**: Fewer buttons, more gestures

---

## 10. FILE STRUCTURE & CHANGES

### NEW FILES TO CREATE

1. **`src/components/maps/FullscreenCaliforniaMap.tsx`**
   - Fullscreen dialog with zoom/pan controls
   - Desktop and mobile controls
   - Transform system for zoom/pan
   - Keyboard shortcuts (WASD, +/-, ESC)

2. **`src/utils/LocationDiscoverySystem.ts`**
   - `getVisibleLocations()` - filters by discovery status
   - `discoverLocation()` - marks location as discovered
   - `discoverNearbyLocations()` - reveals nearby locations
   - `canSelectLocation()` - checks if location is discovered

3. **`src/components/maps/LocationInfoPanel.tsx`**
   - Detailed info panel for locations
   - Shows all location data
   - Action buttons (mission, trade, travel)
   - Pre-war buildings list
   - Faction info

4. **`src/components/maps/RoadInfoPanel.tsx`**
   - Detailed info panel for roads
   - Shows distance, condition, danger
   - Travel time estimates
   - Encounter chances

### FILES TO UPDATE

1. **`src/data/CaliforniaLocations.ts`**
   - Reposition ALL locations to match real California
   - Add 10 new local combat zones
   - Add `preWarBuildings: string[]` field
   - Add `factionControl: string` field
   - Add `discovered: boolean` field (default false)
   - Add `population?: number` field
   - Update all coordinates based on geographic accuracy plan

2. **`src/data/CaliforniaRoads.ts`**
   - Recreate road network based on REAL California highways
   - I-5, I-15, I-80, Highway 1, Highway 99, Highway 101, Route 66
   - Add Bezier curve control points for realistic shapes
   - Update all segments to match new location positions

3. **`src/components/maps/CaliforniaWastelandMap.tsx`**
   - Add two size modes: embedded (1000x600) and fullscreen (1600x1200)
   - Add click handler to open fullscreen
   - Filter locations by discovery status
   - Add click handlers for roads and locations
   - Reduce height for embedded mode
   - Remove title/legend in embedded mode
   - Add "Click to expand" hint in embedded mode

4. **`src/components/maps/RoadRenderer.tsx`**
   - Convert straight lines to Bezier curves
   - Add click handlers to roads
   - Highlight selected road
   - Add hover state

5. **`src/components/operations/CombatOperationsMap.tsx`**
   - Add fullscreen button
   - Pass discovery state to map
   - Handle location selection only if discovered
   - Reduce map height on mobile

6. **`src/context/gameReducer.ts`**
   - Add `discoveredLocations: string[]` to state
   - Add `explorationRadius: number` to state (default 40)
   - Add `DISCOVER_LOCATION` action
   - Add `DISCOVER_NEARBY_LOCATIONS` action
   - Initialize with Player Settlement + nearby locations discovered

7. **`src/types/GameTypes.ts`**
   - Add discovery fields to Location type
   - Add pre-war buildings field
   - Add faction control field

### FILES TO DELETE/DEPRECATE
- `src/components/maps/FullscreenMap.tsx` (old generic fullscreen, will be replaced)

---

## 11. IMPLEMENTATION PHASES

### Phase 1: Core Data Updates ⏳
- [ ] Update `CaliforniaLocations.ts` with corrected positions
- [ ] Add 10 local combat zones
- [ ] Add pre-war buildings and faction data
- [ ] Update `CaliforniaRoads.ts` with real highway routes
- [ ] Add Bezier curve control points to roads
- [ ] Update types in `GameTypes.ts`

### Phase 2: Discovery System ⏳
- [ ] Create `LocationDiscoverySystem.ts`
- [ ] Update `gameReducer.ts` with discovery state
- [ ] Add discovery actions
- [ ] Initialize with starting visible locations

### Phase 3: Map Visual Updates ⏳
- [ ] Update `CaliforniaWastelandMap.tsx` dimensions
- [ ] Add embedded/fullscreen mode support
- [ ] Filter locations by discovery status
- [ ] Add click-to-expand functionality
- [ ] Update `RoadRenderer.tsx` with Bezier curves
- [ ] Add road click handlers

### Phase 4: Fullscreen Mode ⏳
- [ ] Create `FullscreenCaliforniaMap.tsx`
- [ ] Implement zoom controls (buttons + wheel)
- [ ] Implement pan controls (drag + WASD)
- [ ] Add mobile touch controls
- [ ] Add keyboard shortcuts
- [ ] Add smooth transitions

### Phase 5: Info Panels ⏳
- [ ] Create `LocationInfoPanel.tsx`
- [ ] Create `RoadInfoPanel.tsx`
- [ ] Add click handlers to show panels
- [ ] Add action buttons (mission, trade, travel)

### Phase 6: Mobile Optimization ⏳
- [ ] Reduce minimap height on mobile
- [ ] Implement touch gestures
- [ ] Add bottom sheet UI for mobile panels
- [ ] Test on various screen sizes
- [ ] Optimize performance for mobile devices

### Phase 7: Testing & Polish ⏳
- [ ] Verify all locations geographically accurate
- [ ] Test route finding with new roads
- [ ] Test zoom/pan on desktop and mobile
- [ ] Verify discovery system works correctly
- [ ] Test all interactive elements
- [ ] Performance optimization
- [ ] Final visual polish

---

## 12. SUCCESS CRITERIA

### Visual
- ✅ Map fits perfectly in embedded mode (no UI overlap)
- ✅ No wasted black space
- ✅ Fullscreen mode is expansive and detailed
- ✅ Roads follow real California highway routes
- ✅ Cities in geographically accurate positions
- ✅ Smooth zoom/pan transitions
- ✅ Clear visual distinction between discovered/undiscovered

### Functional
- ✅ Click map to open fullscreen (desktop + mobile)
- ✅ Zoom in/out works (mouse wheel, pinch, buttons)
- ✅ Pan works (drag, WASD, touch)
- ✅ Roads are clickable with detailed info
- ✅ Locations are clickable with detailed info
- ✅ Discovery system hides major cities initially
- ✅ 10 unique local combat zones near player settlement
- ✅ Mobile-friendly controls and UI

### Lore Accuracy
- ✅ All Fallout 1/2 locations present
- ✅ Faction presence lore-accurate (NCR, BoS, Enclave)
- ✅ Pre-war buildings match setting
- ✅ Roads based on real California highways
- ✅ Geographic distances realistic

### Technical
- ✅ Performant on mobile and desktop
- ✅ Smooth 60fps animations
- ✅ No layout shift or jank
- ✅ Touch gestures work reliably
- ✅ State persists across mode switches

---

## 13. KEY METRICS

- **Map Dimensions (Embedded)**: 1000w x 500h
- **Map Dimensions (Fullscreen)**: 2000w x 1800h
- **Zoom Range**: 1x to 4x
- **Discovery Radius**: 40 miles from Player Settlement
- **Local Combat Zones**: 10 unique locations
- **Major Highways**: 7 (I-5, I-15, I-80, Hwy 1, Hwy 99, Hwy 101, Route 66)
- **Total Road Segments**: ~30-40
- **Pre-War Building Types**: 15+
- **Faction Outposts**: 8-10 (NCR, BoS, Enclave, traders)
- **Mobile Minimap Height**: 400px
- **Touch Target Minimum Size**: 44px

---

## END OF PLAN

This plan maintains ALL current functionality while adding geographic accuracy, fullscreen mode, discovery system, real roads, interactive elements, and mobile optimization. No existing features are removed—only enhanced and repositioned.
