import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Target, Navigation, Clock, Users, Crosshair } from 'lucide-react';
import { MOJAVE_LOCATIONS, getLocationById, calculateTravelTime } from '@/data/MojaveLocations';
import falloutMap from '@/assets/fallout-mojave-map.jpg';

interface CustomInteractiveMapProps {
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
}

export const CustomInteractiveMap: React.FC<CustomInteractiveMapProps> = ({
  onSelectLocation,
  selectedLocation,
  activeCombat,
  onMapClick,
  isCompact = false,
  showFullscreen = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [squadPosition, setSquadPosition] = useState<{ x: number; y: number } | null>(null);
  const [routePoints, setRoutePoints] = useState<{ x: number; y: number }[]>([]);

  const baseLocation = getLocationById('shady-sands')!;

  // Calculate squad position and route based on combat progress
  useEffect(() => {
    if (!activeCombat) {
      setSquadPosition(null);
      setRoutePoints([]);
      return;
    }

    const destination = MOJAVE_LOCATIONS.find(loc => 
      loc.name.toLowerCase().includes(activeCombat.target.location?.toLowerCase()) ||
      loc.id === activeCombat.target.location
    );

    if (!destination) return;

    const progress = activeCombat.progress || 0;
    const phase = activeCombat.phase || 'travel';

    // Generate route points (simple pathfinding)
    const generateRoute = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const points = [];
      const steps = 20;
      
      // Add some waypoints for more realistic pathing
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      
      // Add variation to avoid straight lines
      const variance = 5;
      const waypoint1 = {
        x: midX + (Math.random() - 0.5) * variance,
        y: midY + (Math.random() - 0.5) * variance
      };

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let point;
        
        if (t < 0.5) {
          // First half: from -> waypoint
          const localT = t * 2;
          point = {
            x: from.x + (waypoint1.x - from.x) * localT,
            y: from.y + (waypoint1.y - from.y) * localT
          };
        } else {
          // Second half: waypoint -> to
          const localT = (t - 0.5) * 2;
          point = {
            x: waypoint1.x + (to.x - waypoint1.x) * localT,
            y: waypoint1.y + (to.y - waypoint1.y) * localT
          };
        }
        
        points.push(point);
      }
      
      return points;
    };

    let currentPosition;
    
    if (phase === 'return') {
      // Returning to base
      const route = generateRoute(destination.coordinates, baseLocation.coordinates);
      setRoutePoints(route);
      const returnProgress = progress > 85 ? (progress - 85) / 15 : 0;
      const routeIndex = Math.floor(returnProgress * (route.length - 1));
      currentPosition = route[routeIndex] || destination.coordinates;
    } else {
      // Going to destination
      const route = generateRoute(baseLocation.coordinates, destination.coordinates);
      setRoutePoints(route);
      
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

  const getLocationIcon = (location: typeof MOJAVE_LOCATIONS[0]) => {
    switch (location.type) {
      case 'settlement': return '🏘️';
      case 'outpost': return '🏭';
      case 'vault': return '🚪';
      case 'facility': return '🏗️';
      case 'ruins': return '💀';
      case 'landmark': return '⛰️';
      default: return '📍';
    }
  };

  const renderLocationMarker = (location: typeof MOJAVE_LOCATIONS[0]) => {
    const isSelected = selectedLocation === location.id;
    const isHovered = hoveredLocation === location.id;
    const isBase = location.id === 'shady-sands';
    
    return (
      <div
        key={location.id}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 ${
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
        <div className={`relative ${isBase ? 'text-blue-400' : getDangerColor(location.dangerLevel)} 
          px-2 py-1 rounded-lg border backdrop-blur-sm text-xs font-medium 
          ${isSelected ? 'ring-2 ring-amber-400 ring-opacity-50' : ''}
        `}>
          <div className="flex items-center space-x-1">
            <span className="text-lg">{isBase ? '🏠' : getLocationIcon(location)}</span>
            {!isCompact && <span className="whitespace-nowrap">{location.displayName}</span>}
          </div>
          
          {/* Danger level indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center font-bold
            bg-gray-900 border border-current">
            {location.dangerLevel}
          </div>
        </div>
        
        {/* Tooltip */}
        {isHovered && !isCompact && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
            bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-gray-500/30 
            text-white text-xs whitespace-nowrap z-20 pointer-events-none">
            <div className="font-semibold text-amber-400">{location.displayName}</div>
            <div className="text-gray-300">{location.description}</div>
            <div className="flex items-center space-x-2 mt-1">
              <span className={getDangerColor(location.dangerLevel).split(' ')[0]}>
                Danger: {location.dangerLevel}/10
              </span>
              <span className="text-purple-400">
                {location.terrainType}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRoute = () => {
    if (routePoints.length === 0) return null;

    const pathData = routePoints.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
    ).join(' ');

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        <path
          d={pathData}
          stroke={activeCombat?.phase === 'return' ? '#10B981' : '#3B82F6'}
          strokeWidth="3"
          strokeDasharray="8,4"
          fill="none"
          className="animate-pulse"
        />
      </svg>
    );
  };

  const renderSquadMarker = () => {
    if (!squadPosition || !activeCombat) return null;

    const phaseColors = {
      travel: 'text-yellow-400 bg-yellow-500/20',
      setup: 'text-blue-400 bg-blue-500/20',
      combat: 'text-red-400 bg-red-500/20',
      return: 'text-green-400 bg-green-500/20'
    };

    const phaseIcons = {
      travel: '🚶',
      setup: '🎯',
      combat: '⚔️',
      return: '🏃'
    };

    const phase = activeCombat.phase || 'travel';

    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 animate-pulse"
        style={{
          left: `${squadPosition.x}%`,
          top: `${squadPosition.y}%`
        }}
      >
        <div className={`${phaseColors[phase]} px-2 py-1 rounded-full border backdrop-blur-sm 
          flex items-center space-x-1 text-xs font-bold shadow-lg`}>
          <span className="text-base">{phaseIcons[phase]}</span>
          <span>SQUAD</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${showFullscreen ? 'h-screen' : isCompact ? 'h-48' : 'h-96'} 
      bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden`}>
      
      {/* Map Background */}
      <div 
        ref={mapRef}
        className="relative w-full h-full bg-cover bg-center bg-no-repeat cursor-pointer group"
        style={{ backgroundImage: `url(${falloutMap})` }}
        onClick={onMapClick}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
        
        {/* Route visualization */}
        {renderRoute()}
        
        {/* Location markers */}
        {MOJAVE_LOCATIONS.map(renderLocationMarker)}
        
        {/* Squad position marker */}
        {renderSquadMarker()}
        
        {/* Map info overlay */}
        {!isCompact && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30">
            <h3 className="text-amber-400 font-bold flex items-center mb-2">
              <Crosshair className="mr-2" size={16} />
              Mojave Wasteland
            </h3>
            <div className="text-xs text-gray-300 space-y-1">
              <div>📍 {MOJAVE_LOCATIONS.length} Locations</div>
              {activeCombat && (
                <>
                  <div className="text-red-400">⚔️ Combat Active</div>
                  <div className="text-blue-400">👥 {activeCombat.assignedSquad.length} Operatives</div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Legend */}
        {!isCompact && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30">
            <div className="text-xs text-gray-300 space-y-1">
              <div className="text-amber-400 font-semibold mb-2">Danger Levels</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Safe (1-2)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Low (3-4)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>High (5-7)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Extreme (8-10)</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Selected location details */}
      {selectedLocation && !isCompact && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30 max-w-xs">
          {(() => {
            const location = getLocationById(selectedLocation);
            if (!location) return null;
            return (
              <div className="text-xs text-gray-300">
                <div className="text-amber-400 font-semibold mb-1">{location.displayName}</div>
                <div className="mb-2">{location.description}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400">Danger:</span>
                    <span className={`ml-1 font-semibold ${getDangerColor(location.dangerLevel).split(' ')[0]}`}>
                      {location.dangerLevel}/10
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-1 text-purple-400">{location.type}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400">Travel Time:</span>
                  <span className="ml-1 text-blue-400">
                    {calculateTravelTime('shady-sands', location.id, location.dangerLevel)}m
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

export default CustomInteractiveMap;