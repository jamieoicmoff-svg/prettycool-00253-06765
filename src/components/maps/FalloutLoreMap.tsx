import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Target, Navigation, Clock, Users, Crosshair, Route, TriangleAlert as AlertTriangle, Shield } from 'lucide-react';
import { FALLOUT_LOCATIONS, WASTELAND_ROUTES, getFalloutLocationById, getRoutesBetween, calculateLoreTravelTime } from '@/data/FalloutLocations';
import falloutMap from '@/assets/fallout-mojave-map.jpg';

interface FalloutLoreMapProps {
  onSelectLocation: (locationId: string) => void;
  selectedLocation?: string;
  activeCombat?: {
    target: any;
    startTime: number;
    duration: number;
    assignedSquad: string[];
    phase?: 'travel' | 'setup' | 'combat' | 'return';
    progress?: number;
  };
  onMapClick?: () => void;
  isCompact?: boolean;
  showFullscreen?: boolean;
  showRoutes?: boolean;
}

export const FalloutLoreMap: React.FC<FalloutLoreMapProps> = ({
  onSelectLocation,
  selectedLocation,
  activeCombat,
  onMapClick,
  isCompact = false,
  showFullscreen = false,
  showRoutes = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [squadPosition, setSquadPosition] = useState<{ x: number; y: number } | null>(null);
  const [currentRoute, setCurrentRoute] = useState<{ x: number; y: number }[]>([]);
  const [travelPhase, setTravelPhase] = useState<'travel' | 'setup' | 'combat' | 'return'>('travel');

  const baseLocation = getFalloutLocationById('shady-sands')!;

  // Calculate squad position and route based on combat progress
  useEffect(() => {
    if (!activeCombat) {
      setSquadPosition(null);
      setCurrentRoute([]);
      return;
    }

    const destination = FALLOUT_LOCATIONS.find(loc => 
      loc.name.toLowerCase().includes(activeCombat.target.location?.toLowerCase()) ||
      loc.id === activeCombat.target.location
    );

    if (!destination) return;

    const progress = activeCombat.progress || 0;
    const phase = activeCombat.phase || 'travel';
    setTravelPhase(phase);

    // Generate realistic wasteland route
    const generateWastelandRoute = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const routes = getRoutesBetween(baseLocation.id, destination.id);
      
      if (routes.length > 0) {
        // Use predefined route waypoints
        const bestRoute = routes.reduce((best, current) => 
          current.dangerLevel < best.dangerLevel ? current : best
        );
        return bestRoute.waypoints;
      }
      
      // Generate realistic wasteland path avoiding dangerous areas
      const points = [];
      const steps = 15;
      
      // Add waypoints that avoid known dangerous locations
      const dangerousAreas = FALLOUT_LOCATIONS.filter(loc => loc.dangerLevel >= 8);
      
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let point = {
          x: from.x + (to.x - from.x) * t,
          y: from.y + (to.y - from.y) * t
        };
        
        // Avoid dangerous areas by adding detours
        dangerousAreas.forEach(danger => {
          const distanceToDanger = Math.sqrt(
            Math.pow(point.x - danger.coordinates.x, 2) + 
            Math.pow(point.y - danger.coordinates.y, 2)
          );
          
          if (distanceToDanger < 8) { // Too close to danger
            // Add detour
            const detourX = point.x + (Math.random() - 0.5) * 10;
            const detourY = point.y + (Math.random() - 0.5) * 10;
            point = { x: detourX, y: detourY };
          }
        });
        
        points.push(point);
      }
      
      return points;
    };

    let currentPosition;
    
    if (phase === 'return') {
      // Returning to base
      const route = generateWastelandRoute(destination.coordinates, baseLocation.coordinates);
      setCurrentRoute(route);
      const returnProgress = progress > 85 ? (progress - 85) / 15 : 0;
      const routeIndex = Math.floor(returnProgress * (route.length - 1));
      currentPosition = route[routeIndex] || destination.coordinates;
    } else {
      // Going to destination
      const route = generateWastelandRoute(baseLocation.coordinates, destination.coordinates);
      setCurrentRoute(route);
      
      if (phase === 'combat') {
        // Stay at destination during combat
        currentPosition = destination.coordinates;
      } else {
        // Travel/setup phase
        const routeIndex = Math.floor((progress / 100) * (route.length - 1));
        currentPosition = route[routeIndex] || baseLocation.coordinates;
      }
    }

    setSquadPosition(currentPosition);
  }, [activeCombat, baseLocation]);

  const getDangerColor = (dangerLevel: number) => {
    if (dangerLevel <= 2) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (dangerLevel <= 4) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    if (dangerLevel <= 7) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getFactionColor = (faction?: string) => {
    switch (faction) {
      case 'NCR': return 'border-blue-500/50 bg-blue-500/10';
      case 'Brotherhood of Steel': return 'border-orange-500/50 bg-orange-500/10';
      case 'Caesar\'s Legion': return 'border-red-500/50 bg-red-500/10';
      case 'Mr. House': return 'border-purple-500/50 bg-purple-500/10';
      case 'Ghouls': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getLocationIcon = (location: FalloutLocation) => {
    switch (location.type) {
      case 'settlement': return location.faction === 'NCR' ? '🏛️' : '🏘️';
      case 'vault': return '🚪';
      case 'military': return location.faction === 'Brotherhood of Steel' ? '⚙️' : '🏭';
      case 'ruins': return '💀';
      case 'danger-zone': return '☢️';
      case 'landmark': return '⛰️';
      case 'faction': return '🏴';
      default: return '📍';
    }
  };

  const renderLocationMarker = (location: FalloutLocation) => {
    const isSelected = selectedLocation === location.id;
    const isHovered = hoveredLocation === location.id;
    const isBase = location.id === 'shady-sands';
    
    return (
      <div
        key={location.id}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
          isSelected ? 'scale-150' : isHovered ? 'scale-125' : 'scale-100'
        }`}
        style={{
          left: `${location.coordinates.x}%`,
          top: `${location.coordinates.y}%`
        }}
        onClick={() => onSelectLocation(location.id)}
        onMouseEnter={() => setHoveredLocation(location.id)}
        onMouseLeave={() => setHoveredLocation(null)}
      >
        <div className={`relative ${
          isBase ? 'text-blue-400 bg-blue-500/20 border-blue-500/50' : 
          location.faction ? getFactionColor(location.faction) : getDangerColor(location.dangerLevel)
        } px-3 py-2 rounded-xl border-2 backdrop-blur-sm text-xs font-bold shadow-xl ${
          isSelected ? 'ring-2 ring-amber-400 ring-opacity-50 animate-pulse' : ''
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{isBase ? '🏠' : getLocationIcon(location)}</span>
            {!isCompact && <span className="whitespace-nowrap">{location.displayName}</span>}
          </div>
          
          {/* Faction indicator */}
          {location.faction && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold bg-gray-900 border border-current">
              {location.faction === 'NCR' ? 'N' : 
               location.faction === 'Brotherhood of Steel' ? 'B' :
               location.faction === 'Caesar\'s Legion' ? 'L' :
               location.faction === 'Mr. House' ? 'H' : '?'}
            </div>
          )}
          
          {/* Danger level indicator */}
          <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold bg-gray-900 border-2 border-current">
            {location.dangerLevel}
          </div>
        </div>
        
        {/* Enhanced tooltip with lore */}
        {isHovered && !isCompact && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 
            bg-black/95 backdrop-blur-sm rounded-xl p-4 border border-amber-500/50 
            text-white text-xs max-w-80 z-50 pointer-events-none shadow-2xl">
            <div className="font-bold text-amber-400 mb-2">{location.displayName}</div>
            <div className="text-gray-300 mb-2">{location.description}</div>
            <div className="text-blue-300 text-xs mb-3 italic leading-relaxed">{location.loreDescription}</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">Danger:</span>
                <span className={`ml-1 font-bold ${getDangerColor(location.dangerLevel).split(' ')[0]}`}>
                  {location.dangerLevel}/10
                </span>
              </div>
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="ml-1 text-purple-400 capitalize">{location.type}</span>
              </div>
              {location.faction && (
                <div className="col-span-2">
                  <span className="text-gray-400">Faction:</span>
                  <span className="ml-1 text-cyan-400">{location.faction}</span>
                </div>
              )}
              {location.population && (
                <div className="col-span-2">
                  <span className="text-gray-400">Population:</span>
                  <span className="ml-1 text-green-400">{location.population}</span>
                </div>
              )}
            </div>
            {location.resources && location.resources.length > 0 && (
              <div className="mt-2">
                <span className="text-gray-400 text-xs">Resources:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {location.resources.map(resource => (
                    <span key={resource} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderWastelandRoutes = () => {
    if (!showRoutes) return null;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        {WASTELAND_ROUTES.map(route => {
          const fromLoc = getFalloutLocationById(route.from);
          const toLoc = getFalloutLocationById(route.to);
          
          if (!fromLoc || !toLoc) return null;
          
          const routeColor = route.dangerLevel <= 3 ? '#10B981' : 
                           route.dangerLevel <= 6 ? '#F59E0B' : '#EF4444';
          
          const pathData = route.waypoints.map((point, index) => 
            `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
          ).join(' ');

          return (
            <g key={route.id}>
              <path
                d={pathData}
                stroke={routeColor}
                strokeWidth="2"
                strokeDasharray={route.type === 'dangerous-path' ? "8,4" : route.type === 'trail' ? "4,2" : "none"}
                fill="none"
                opacity="0.6"
              />
              {/* Route type indicator */}
              {route.waypoints.length > 2 && (
                <circle
                  cx={`${route.waypoints[Math.floor(route.waypoints.length / 2)].x}%`}
                  cy={`${route.waypoints[Math.floor(route.waypoints.length / 2)].y}%`}
                  r="3"
                  fill={routeColor}
                  opacity="0.8"
                />
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderActiveRoute = () => {
    if (currentRoute.length === 0) return null;

    const pathData = currentRoute.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
    ).join(' ');

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-8">
        <path
          d={pathData}
          stroke={travelPhase === 'return' ? '#10B981' : '#3B82F6'}
          strokeWidth="4"
          strokeDasharray="12,6"
          fill="none"
          className="animate-pulse"
        />
        {/* Progress indicator along route */}
        {activeCombat && (
          <circle
            cx={`${squadPosition?.x || 0}%`}
            cy={`${squadPosition?.y || 0}%`}
            r="8"
            fill="none"
            stroke={travelPhase === 'combat' ? '#EF4444' : '#3B82F6'}
            strokeWidth="3"
            className="animate-pulse"
          />
        )}
      </svg>
    );
  };

  const renderSquadMarker = () => {
    if (!squadPosition || !activeCombat) return null;

    const phaseColors = {
      travel: 'text-yellow-400 bg-yellow-500/30 border-yellow-500/50',
      setup: 'text-blue-400 bg-blue-500/30 border-blue-500/50',
      combat: 'text-red-400 bg-red-500/30 border-red-500/50',
      return: 'text-green-400 bg-green-500/30 border-green-500/50'
    };

    const phaseIcons = {
      travel: '🚶',
      setup: '🎯',
      combat: '⚔️',
      return: '🏃'
    };

    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{
          left: `${squadPosition.x}%`,
          top: `${squadPosition.y}%`
        }}
      >
        <div className={`${phaseColors[travelPhase]} px-3 py-2 rounded-full border-2 backdrop-blur-sm 
          flex items-center space-x-2 text-xs font-bold shadow-xl animate-pulse`}>
          <span className="text-base">{phaseIcons[travelPhase]}</span>
          <span>SQUAD</span>
          <span className="text-xs">({activeCombat.assignedSquad.length})</span>
        </div>
        
        {/* Squad movement trail */}
        <div className="absolute w-16 h-16 border-2 border-current rounded-full animate-ping opacity-30" />
      </div>
    );
  };

  const renderLegend = () => {
    if (isCompact) return null;

    return (
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30 max-w-xs">
        <h3 className="text-amber-400 font-bold mb-3 flex items-center">
          <Shield className="mr-2" size={16} />
          Wasteland Guide
        </h3>
        
        {/* Danger Levels */}
        <div className="space-y-2 mb-4">
          <div className="text-xs text-gray-300 font-semibold">Danger Levels:</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Safe (1-2)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Low (3-4)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-300">High (5-7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Extreme (8-10)</span>
            </div>
          </div>
        </div>

        {/* Factions */}
        <div className="space-y-2">
          <div className="text-xs text-gray-300 font-semibold">Major Factions:</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">N</span>
              <span className="text-gray-300">NCR Territory</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-400">B</span>
              <span className="text-gray-300">Brotherhood</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-400">L</span>
              <span className="text-gray-300">Legion</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">H</span>
              <span className="text-gray-300">House</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${showFullscreen ? 'h-screen' : isCompact ? 'h-48' : 'h-96'} 
      bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden`}>
      
      {/* Fallout Map Background */}
      <div 
        ref={mapRef}
        className="relative w-full h-full bg-cover bg-center bg-no-repeat cursor-pointer group"
        style={{ backgroundImage: `url(${falloutMap})` }}
        onClick={onMapClick}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
        
        {/* Wasteland routes */}
        {renderWastelandRoutes()}
        
        {/* Active travel route */}
        {renderActiveRoute()}
        
        {/* Location markers */}
        {FALLOUT_LOCATIONS.map(renderLocationMarker)}
        
        {/* Squad position marker */}
        {renderSquadMarker()}
        
        {/* Map info overlay */}
        {!isCompact && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30">
            <h3 className="text-amber-400 font-bold flex items-center mb-3">
              <Crosshair className="mr-2" size={16} />
              Post-Nuclear California
            </h3>
            <div className="text-xs text-gray-300 space-y-1">
              <div>📍 {FALLOUT_LOCATIONS.length} Known Locations</div>
              <div>🛤️ {WASTELAND_ROUTES.length} Established Routes</div>
              {activeCombat && (
                <>
                  <div className="text-red-400">⚔️ Combat Operation Active</div>
                  <div className="text-blue-400">👥 {activeCombat.assignedSquad.length} Operatives</div>
                  <div className="text-yellow-400">📍 Phase: {travelPhase.toUpperCase()}</div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Legend */}
        {renderLegend()}
      </div>
      
      {/* Selected location details */}
      {selectedLocation && !isCompact && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30 max-w-sm">
          {(() => {
            const location = getFalloutLocationById(selectedLocation);
            if (!location) return null;
            return (
              <div className="text-xs text-gray-300">
                <div className="text-amber-400 font-bold mb-2">{location.displayName}</div>
                <div className="text-gray-300 mb-2">{location.description}</div>
                <div className="text-blue-300 text-xs mb-3 italic leading-relaxed">{location.loreDescription}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400">Danger:</span>
                    <span className={`ml-1 font-bold ${getDangerColor(location.dangerLevel).split(' ')[0]}`}>
                      {location.dangerLevel}/10
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-1 text-purple-400 capitalize">{location.type}</span>
                  </div>
                  {location.faction && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Faction:</span>
                      <span className="ml-1 text-cyan-400">{location.faction}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-gray-400">Travel Time from Base:</span>
                  <span className="ml-1 text-blue-400">
                    {calculateLoreTravelTime('shady-sands', location.id)}m
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default FalloutLoreMap;