import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';
import { CALIFORNIA_LOCATIONS, CaliforniaLocation } from '@/data/CaliforniaLocations';
import { CALIFORNIA_ROADS } from '@/data/CaliforniaRoads';
import { RoadRenderer } from './RoadRenderer';

interface InteractiveFullscreenMapProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (location: CaliforniaLocation) => void;
  selectedLocationId?: string;
  showSquadPosition?: boolean;
  squadProgress?: number;
}

export const InteractiveFullscreenMap: React.FC<InteractiveFullscreenMapProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  selectedLocationId,
  showSquadPosition = false,
  squadProgress = 0
}) => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [hoveredRoad, setHoveredRoad] = useState<string | null>(null);
  
  // Pan and Zoom state
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Touch state for mobile
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  if (!isOpen) return null;

  // Get location marker size (same as minimap)
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

  // Get marker color (same as minimap)
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

  // Zoom controls
  const handleZoomIn = () => {
    setViewBox(prev => {
      const newWidth = Math.max(prev.width * 0.7, 10); // Don't zoom in too much
      const newHeight = Math.max(prev.height * 0.7, 10);
      const dx = (prev.width - newWidth) / 2;
      const dy = (prev.height - newHeight) / 2;
      return {
        x: prev.x + dx,
        y: prev.y + dy,
        width: newWidth,
        height: newHeight
      };
    });
  };

  const handleZoomOut = () => {
    setViewBox(prev => {
      const newWidth = Math.min(prev.width * 1.3, 200); // Don't zoom out too much
      const newHeight = Math.min(prev.height * 1.3, 200);
      const dx = (prev.width - newWidth) / 2;
      const dy = (prev.height - newHeight) / 2;
      return {
        x: Math.max(prev.x + dx, -50),
        y: Math.max(prev.y + dy, -50),
        width: newWidth,
        height: newHeight
      };
    });
  };

  const handleResetView = () => {
    setViewBox({ x: 0, y: 0, width: 100, height: 100 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    
    // Get mouse position relative to SVG
    const mouseX = ((e.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const mouseY = ((e.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;
    
    // Zoom factor
    const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8;
    
    const newWidth = Math.max(Math.min(viewBox.width * zoomFactor, 200), 10);
    const newHeight = Math.max(Math.min(viewBox.height * zoomFactor, 200), 10);
    
    // Zoom towards mouse position
    const newX = mouseX - (mouseX - viewBox.x) * (newWidth / viewBox.width);
    const newY = mouseY - (mouseY - viewBox.y) * (newHeight / viewBox.height);
    
    setViewBox({
      x: Math.max(Math.min(newX, 100), -50),
      y: Math.max(Math.min(newY, 100), -50),
      width: newWidth,
      height: newHeight
    });
  };

  // Mouse pan
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsPanning(true);
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning || !svgRef.current) return;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    
    const dx = ((startPan.x - e.clientX) / rect.width) * viewBox.width;
    const dy = ((startPan.y - e.clientY) / rect.height) * viewBox.height;
    
    setViewBox(prev => ({
      ...prev,
      x: Math.max(Math.min(prev.x + dx, 100), -50),
      y: Math.max(Math.min(prev.y + dy, 100), -50)
    }));
    
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch controls for mobile
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches));
    } else if (e.touches.length === 1) {
      setIsPanning(true);
      setStartPan({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      // Pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      if (currentDistance === null) return;
      
      const zoomFactor = currentDistance / lastTouchDistance;
      const newWidth = Math.max(Math.min(viewBox.width / zoomFactor, 200), 10);
      const newHeight = Math.max(Math.min(viewBox.height / zoomFactor, 200), 10);
      
      setViewBox(prev => ({
        x: prev.x + (prev.width - newWidth) / 2,
        y: prev.y + (prev.height - newHeight) / 2,
        width: newWidth,
        height: newHeight
      }));
      
      setLastTouchDistance(currentDistance);
    } else if (e.touches.length === 1 && isPanning && svgRef.current) {
      // Pan
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      
      const dx = ((startPan.x - e.touches[0].clientX) / rect.width) * viewBox.width;
      const dy = ((startPan.y - e.touches[0].clientY) / rect.height) * viewBox.height;
      
      setViewBox(prev => ({
        ...prev,
        x: Math.max(Math.min(prev.x + dx, 100), -50),
        y: Math.max(Math.min(prev.y + dy, 100), -50)
      }));
      
      setStartPan({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setLastTouchDistance(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-amber-500/20 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Maximize2 className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-lg font-bold text-amber-400">California Wasteland - Full Map</h2>
            <p className="text-xs text-gray-400">800 miles north to south • Drag to pan • Scroll to zoom</p>
          </div>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            title="Zoom In (Scroll Up)"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            title="Zoom Out (Scroll Down)"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleResetView}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            title="Reset View"
          >
            <Move size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden bg-[#1a1a1a]">
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className="w-full h-full"
          style={{ 
            cursor: isPanning ? 'grabbing' : 'grab',
            touchAction: 'none'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid */}
          <defs>
            <pattern id="grid-interactive" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#2a2a2a" strokeWidth="0.1"/>
            </pattern>

            {/* Glow filters */}
            <filter id="glow-interactive">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="glow-major-interactive">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect x="-50" y="-50" width="200" height="200" fill="url(#grid-interactive)" />

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
                    r={size + (isPlayerOutpost || isShadySands ? 2.5 : 2)}
                    fill={color}
                    opacity={isPlayerOutpost || isShadySands ? "0.6" : "0.4"}
                    className="animate-pulse pointer-events-none"
                    filter={isPlayerOutpost || isShadySands ? "url(#glow-major-interactive)" : "url(#glow-interactive)"}
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
                    pointerEvents: 'all'
                  }}
                  onMouseEnter={() => setHoveredLocation(location.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocationSelect?.(location);
                  }}
                />

                {/* Location labels - show for major locations */}
                {(isHovered || isSelected || isPlayerOutpost || isShadySands || isMajorCity) && (
                  <text
                    x={pos.x}
                    y={pos.y - size - 2}
                    textAnchor="middle"
                    className="fill-foreground font-bold pointer-events-none select-none"
                    style={{ 
                      textShadow: '0 0 3px #000, 0 0 6px #000',
                      fontSize: isPlayerOutpost || isShadySands ? '2px' : isMajorCity ? '1.6px' : '1.4px'
                    }}
                  >
                    {location.name}
                  </text>
                )}

                {/* Distance labels for all settlements when not hovered */}
                {location.type === 'settlement' && !isHovered && viewBox.width < 80 && (
                  <text
                    x={pos.x}
                    y={pos.y + size + 2.2}
                    textAnchor="middle"
                    className="fill-muted-foreground pointer-events-none select-none"
                    style={{ textShadow: '0 0 2px #000', fontSize: '1px' }}
                  >
                    {location.distanceFromShadySands} mi
                  </text>
                )}

                {/* Detailed info on hover */}
                {isHovered && (
                  <text
                    x={pos.x}
                    y={pos.y + size + 3.5}
                    textAnchor="middle"
                    className="fill-foreground pointer-events-none select-none"
                    style={{ textShadow: '0 0 2px #000, 0 0 4px #000', fontSize: '1.2px' }}
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
              <circle
                cx={50}
                cy={50}
                r="2"
                fill="#10b981"
                opacity="0.4"
                className="animate-pulse"
                filter="url(#glow-interactive)"
              />
              <circle
                cx={50}
                cy={50}
                r="1.2"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="0.2"
              />
              <text
                x={50}
                y={46}
                textAnchor="middle"
                className="fill-green-400 font-bold pointer-events-none"
                style={{ textShadow: '0 0 2px #000, 0 0 4px #000', fontSize: '1.6px' }}
              >
                YOUR SQUAD
              </text>
            </g>
          )}

          {/* Scale reference */}
          {viewBox.width < 120 && (
            <g>
              <line x1="5" y1="95" x2="15" y2="95" stroke="#ffffff" strokeWidth="0.3" />
              <line x1="5" y1="93.5" x2="5" y2="96.5" stroke="#ffffff" strokeWidth="0.3" />
              <line x1="15" y1="93.5" x2="15" y2="96.5" stroke="#ffffff" strokeWidth="0.3" />
              <text
                x="10"
                y="92"
                textAnchor="middle"
                className="fill-foreground pointer-events-none select-none"
                style={{ textShadow: '0 0 2px #000', fontSize: '1.2px' }}
              >
                ~80 miles
              </text>
            </g>
          )}
        </svg>

        {/* Location info panel */}
        {hoveredLocation && (
          <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-6 py-4 rounded-lg border border-border max-w-md pointer-events-none">
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
                        <span className="text-foreground font-semibold ml-2">{location.population.toLocaleString()}</span>
                      </div>
                    )}
                    {location.resources && location.resources.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Resources:</span>
                        <span className="text-foreground ml-2 text-xs">{location.resources.slice(0, 3).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Controls hint */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border pointer-events-none">
          <p className="text-xs text-muted-foreground">
            <span className="hidden md:inline">🖱️ Drag to pan • Scroll to zoom</span>
            <span className="md:hidden">👆 Drag to pan • Pinch to zoom</span>
          </p>
        </div>

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
              <span className="text-muted-foreground">Combat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              <span className="text-muted-foreground">Outpost</span>
            </div>
          </div>
        </div>

        {/* Zoom level indicator */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border pointer-events-none">
          <p className="text-xs text-muted-foreground">
            Zoom: {Math.round(100 / viewBox.width * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};
