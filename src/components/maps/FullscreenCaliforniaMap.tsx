import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CALIFORNIA_LOCATIONS, CaliforniaLocation } from '@/data/CaliforniaLocations';
import { CALIFORNIA_ROADS } from '@/data/CaliforniaRoads';
import { RoadRenderer } from './RoadRenderer';

interface FullscreenCaliforniaMapProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (location: CaliforniaLocation) => void;
  selectedLocationId?: string;
  showSquadPosition?: boolean;
  squadProgress?: number;
}

export const FullscreenCaliforniaMap: React.FC<FullscreenCaliforniaMapProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  selectedLocationId,
  showSquadPosition = false,
  squadProgress = 0
}) => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [hoveredRoad, setHoveredRoad] = useState<string | null>(null);

  if (!isOpen) return null;

  // Get location marker size
  const getMarkerSize = (location: CaliforniaLocation) => {
    if (location.id === 'player-outpost') return 1.4;
    
    switch (location.type) {
      case 'settlement': return 1.2;
      case 'vault': return 1.0;
      case 'facility': return 1.0;
      case 'combat': return 0.8;
      case 'outpost': return 1.0;
      default: return 0.8;
    }
  };

  // Get marker color
  const getMarkerColor = (location: CaliforniaLocation) => {
    if (location.id === 'player-outpost') return '#10b981';
    if (location.id === selectedLocationId) return '#fbbf24';
    if (location.id === 'shady-sands') return '#3b82f6';
    
    switch (location.type) {
      case 'settlement': return '#8b5cf6';
      case 'vault': return '#06b6d4';
      case 'facility': return '#ef4444';
      case 'combat': return '#f59e0b';
      case 'outpost': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">California Wasteland Map</h2>
          <p className="text-sm text-muted-foreground">Full view - 800 miles north to south</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ background: '#1a1a1a' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid */}
          <defs>
            <pattern id="grid-fullscreen" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#2a2a2a" strokeWidth="0.1"/>
            </pattern>

            {/* Enhanced glow for fullscreen */}
            <filter id="glow-full">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Strong glow for major cities */}
            <filter id="glow-major">
              <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect width="100" height="100" fill="url(#grid-fullscreen)" />

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
            const isMajorCity = location.type === 'settlement' && (location.population || 0) > 1000;

            return (
              <g key={location.id}>
                {/* Glow effect */}
                {(isHovered || isSelected || isPlayerOutpost || isShadySands || isMajorCity) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size + (isPlayerOutpost || isShadySands ? 2 : 1.5)}
                    fill={color}
                    opacity={isPlayerOutpost || isShadySands ? "0.6" : "0.4"}
                    className="animate-pulse"
                    filter={isPlayerOutpost || isShadySands ? "url(#glow-major)" : "url(#glow-full)"}
                  />
                )}

                {/* Location marker */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="0.15"
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered ? 'brightness(1.5)' : 'none',
                    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    transformOrigin: `${pos.x}% ${pos.y}%`
                  }}
                  onMouseEnter={() => setHoveredLocation(location.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  onClick={() => onLocationSelect?.(location)}
                />

                {/* Always show labels for major locations in fullscreen */}
                {(isHovered || isSelected || isPlayerOutpost || isShadySands || isMajorCity) && (
                  <text
                    x={pos.x}
                    y={pos.y - size - 1.8}
                    textAnchor="middle"
                    className="fill-foreground font-bold pointer-events-none"
                    style={{ 
                      textShadow: '0 0 2px #000, 0 0 4px #000, 0 0 6px #000',
                      fontSize: isPlayerOutpost || isShadySands ? '1.6px' : isMajorCity ? '1.4px' : '1.2px'
                    }}
                  >
                    {location.name}
                  </text>
                )}

                {/* Show distance for all settlements */}
                {location.type === 'settlement' && !isHovered && (
                  <text
                    x={pos.x}
                    y={pos.y + size + 2}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[0.9px] pointer-events-none"
                    style={{ textShadow: '0 0 2px #000' }}
                  >
                    {location.distanceFromShadySands} mi
                  </text>
                )}

                {/* Detailed info on hover */}
                {isHovered && (
                  <text
                    x={pos.x}
                    y={pos.y + size + 3}
                    textAnchor="middle"
                    className="fill-foreground text-[1.1px] pointer-events-none"
                    style={{ textShadow: '0 0 2px #000, 0 0 4px #000' }}
                  >
                    {location.distanceFromShadySands} mi • {location.terrain} • Danger {location.dangerLevel}/10
                  </text>
                )}
              </g>
            );
          })}

          {/* Squad position */}
          {showSquadPosition && squadProgress > 0 && (
            <g>
              {/* Calculate squad position - placeholder */}
              <circle
                cx={50}
                cy={50}
                r="1.5"
                fill="#10b981"
                opacity="0.4"
                className="animate-pulse"
                filter="url(#glow-full)"
              />
              <circle
                cx={50}
                cy={50}
                r="1"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="0.2"
              />
              <text
                x={50}
                y={47}
                textAnchor="middle"
                className="fill-green-400 text-[1.4px] font-bold pointer-events-none"
                style={{ textShadow: '0 0 2px #000, 0 0 4px #000' }}
              >
                YOUR SQUAD
              </text>
            </g>
          )}

          {/* Scale reference */}
          <g>
            <line x1="5" y1="95" x2="15" y2="95" stroke="#ffffff" strokeWidth="0.2" />
            <line x1="5" y1="94" x2="5" y2="96" stroke="#ffffff" strokeWidth="0.2" />
            <line x1="15" y1="94" x2="15" y2="96" stroke="#ffffff" strokeWidth="0.2" />
            <text
              x="10"
              y="93"
              textAnchor="middle"
              className="fill-foreground text-[1px] pointer-events-none"
              style={{ textShadow: '0 0 2px #000' }}
            >
              ~80 miles
            </text>
          </g>
        </svg>

        {/* Location info panel */}
        {hoveredLocation && (
          <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-6 py-4 rounded-lg border border-border max-w-md">
            {(() => {
              const location = CALIFORNIA_LOCATIONS.find(loc => loc.id === hoveredLocation);
              if (!location) return null;

              return (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{location.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{location.type} • {location.terrain}</p>
                    </div>
                    {location.faction && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                        {location.faction}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{location.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Distance:</span>
                      <span className="text-foreground font-semibold ml-2">{location.distanceFromShadySands} mi</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Danger:</span>
                      <span className={`font-semibold ml-2 ${
                        location.dangerLevel > 7 ? 'text-red-400' :
                        location.dangerLevel > 4 ? 'text-orange-400' : 'text-green-400'
                      }`}>
                        {location.dangerLevel}/10
                      </span>
                    </div>
                    {location.population && (
                      <div>
                        <span className="text-muted-foreground">Population:</span>
                        <span className="text-foreground font-semibold ml-2">{location.population}</span>
                      </div>
                    )}
                    {location.resources && location.resources.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Resources:</span>
                        <span className="text-foreground ml-2">{location.resources.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-border">
          <h4 className="text-sm font-bold text-foreground mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
              <span className="text-muted-foreground">Settlement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
              <span className="text-muted-foreground">Vault</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
              <span className="text-muted-foreground">Facility</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
              <span className="text-muted-foreground">Combat Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              <span className="text-muted-foreground">Outpost</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
