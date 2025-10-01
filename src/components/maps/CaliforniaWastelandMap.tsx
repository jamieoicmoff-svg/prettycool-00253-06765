import React, { useState } from 'react';
import { CALIFORNIA_LOCATIONS, CaliforniaLocation } from '@/data/CaliforniaLocations';
import { CALIFORNIA_ROADS } from '@/data/CaliforniaRoads';
import { RoadRenderer } from './RoadRenderer';
import { Mission } from '@/types/GameTypes';

interface CaliforniaWastelandMapProps {
  currentMission?: Mission | null;
  onLocationSelect?: (location: CaliforniaLocation) => void;
  selectedLocationId?: string;
  showSquadPosition?: boolean;
  squadProgress?: number; // 0-100% of mission progress
  className?: string;
}

export const CaliforniaWastelandMap: React.FC<CaliforniaWastelandMapProps> = ({
  currentMission,
  onLocationSelect,
  selectedLocationId,
  showSquadPosition = false,
  squadProgress = 0,
  className = ''
}) => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [hoveredRoad, setHoveredRoad] = useState<string | null>(null);

  // Get location marker size based on location type
  const getMarkerSize = (location: CaliforniaLocation) => {
    if (location.id === 'player-outpost') return 1.4; // Larger for player outpost
    
    switch (location.type) {
      case 'settlement': return 1.2;
      case 'vault': return 1.0;
      case 'facility': return 1.0;
      case 'combat': return 0.8;
      case 'outpost': return 1.0;
      default: return 0.8;
    }
  };

  // Get marker color based on type and danger level
  const getMarkerColor = (location: CaliforniaLocation) => {
    if (location.id === 'player-outpost') return '#10b981'; // Bright green for player outpost
    if (location.id === selectedLocationId) return '#fbbf24'; // amber-400
    if (location.id === 'shady-sands') return '#3b82f6'; // blue-500
    
    switch (location.type) {
      case 'settlement': return '#8b5cf6'; // purple-500
      case 'vault': return '#06b6d4'; // cyan-500
      case 'facility': return '#ef4444'; // red-500
      case 'combat': return '#f59e0b'; // amber-500
      case 'outpost': return '#10b981'; // green-500
      default: return '#6b7280'; // gray-500
    }
  };

  // Calculate squad position along route
  const getSquadPosition = () => {
    if (!currentMission || !showSquadPosition || squadProgress === 0) return null;
    
    // For now, interpolate between player outpost and destination
    const playerOutpost = CALIFORNIA_LOCATIONS.find(loc => loc.id === 'player-outpost');
    const destination = CALIFORNIA_LOCATIONS.find(loc => loc.id === currentMission.location);
    
    if (!playerOutpost || !destination) return null;
    
    const startPos = playerOutpost.coordinates;
    const endPos = destination.coordinates;
    
    const progress = squadProgress / 100;
    
    return {
      x: startPos.x + (endPos.x - startPos.x) * progress,
      y: startPos.y + (endPos.y - startPos.y) * progress
    };
  };

  const squadPos = getSquadPosition();

  return (
    <div className={`relative w-full h-full bg-[#1a1a1a] rounded-lg overflow-hidden border border-border ${className}`}>
      {/* Click to expand hint */}
      <div className="absolute bottom-4 right-4 z-10 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">Click map to expand</p>
      </div>

      {/* SVG Map - Full California (800mi N-S × 400mi E-W) */}
      <svg 
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ background: '#1a1a1a' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines for reference */}
        <defs>
          <pattern id="grid-minimap" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#2a2a2a" strokeWidth="0.1"/>
          </pattern>
          
          {/* Glow effects */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="100" height="100" fill="url(#grid-minimap)" />

        {/* Render roads */}
        <RoadRenderer 
          roads={CALIFORNIA_ROADS}
          locations={CALIFORNIA_LOCATIONS}
          activeRoute={[]}
          hoveredRoadId={hoveredRoad}
          onRoadHover={setHoveredRoad}
        />

        {/* Render locations */}
        {CALIFORNIA_LOCATIONS.map(location => {
          const pos = location.coordinates;
          const size = getMarkerSize(location);
          const color = getMarkerColor(location);
          const isHovered = hoveredLocation === location.id;
          const isSelected = selectedLocationId === location.id;
          const isPlayerOutpost = location.id === 'player-outpost';
          const isShadySands = location.id === 'shady-sands';

          return (
            <g key={location.id}>
              {/* Glow effect for important locations */}
              {(isHovered || isSelected || isPlayerOutpost || isShadySands) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size + (isPlayerOutpost ? 1.5 : 1)}
                  fill={color}
                  opacity={isPlayerOutpost ? "0.5" : "0.3"}
                  className="animate-pulse"
                  filter="url(#glow)"
                />
              )}

              {/* Location marker */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size}
                fill={color}
                stroke="#ffffff"
                strokeWidth="0.2"
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isHovered ? 'brightness(1.5)' : 'none',
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${pos.x}% ${pos.y}%`
                }}
                onMouseEnter={() => setHoveredLocation(location.id)}
                onMouseLeave={() => setHoveredLocation(null)}
                onClick={() => onLocationSelect?.(location)}
              />

              {/* Location label - show for important locations */}
              {(isHovered || isSelected || isPlayerOutpost || isShadySands || location.type === 'settlement') && (
                <text
                  x={pos.x}
                  y={pos.y - size - 1.5}
                  textAnchor="middle"
                  className="fill-foreground text-[1.2px] font-bold pointer-events-none"
                  style={{ 
                    textShadow: '0 0 2px #000, 0 0 4px #000',
                    fontSize: isPlayerOutpost || isShadySands ? '1.4px' : '1.2px'
                  }}
                >
                  {location.name}
                </text>
              )}

              {/* Distance label on hover */}
              {isHovered && (
                <text
                  x={pos.x}
                  y={pos.y + size + 2.5}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[1px] pointer-events-none"
                  style={{ textShadow: '0 0 2px #000' }}
                >
                  {location.distanceFromShadySands} mi | Danger: {location.dangerLevel}/10
                </text>
              )}
            </g>
          );
        })}

        {/* Squad position indicator */}
        {squadPos && (
          <g>
            <circle
              cx={squadPos.x}
              cy={squadPos.y}
              r="1.5"
              fill="#10b981"
              opacity="0.3"
              className="animate-pulse"
            />
            <circle
              cx={squadPos.x}
              cy={squadPos.y}
              r="1"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="0.2"
            />
            <text
              x={squadPos.x}
              y={squadPos.y - 2.5}
              textAnchor="middle"
              className="fill-green-400 text-[1.2px] font-bold pointer-events-none"
              style={{ textShadow: '0 0 2px #000' }}
            >
              YOUR SQUAD
            </text>
          </g>
        )}
      </svg>

      {/* Hovered location info panel */}
      {hoveredLocation && (
        <div className="absolute bottom-4 left-4 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-border max-w-sm">
          {(() => {
            const location = CALIFORNIA_LOCATIONS.find(loc => loc.id === hoveredLocation);
            if (!location) return null;
            
            return (
              <>
                <h4 className="font-bold text-foreground mb-1">{location.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{location.description}</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground">
                    Distance: <span className="text-foreground font-semibold">{location.distanceFromShadySands} mi</span>
                  </span>
                  <span className="text-muted-foreground">
                    Danger: <span className="text-foreground font-semibold">{location.dangerLevel}/10</span>
                  </span>
                  <span className="text-muted-foreground">
                    Terrain: <span className="text-foreground font-semibold capitalize">{location.terrain}</span>
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
