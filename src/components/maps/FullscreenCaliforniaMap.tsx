import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CALIFORNIA_LOCATIONS, CaliforniaLocation } from '@/data/CaliforniaLocations';
import { CALIFORNIA_ROADS } from '@/data/CaliforniaRoads';
import { RoadRenderer } from './RoadRenderer';
import { Mission } from '@/types/GameTypes';
import { getVisibleLocations } from '@/utils/LocationDiscoverySystem';

interface FullscreenCaliforniaMapProps {
  isOpen: boolean;
  onClose: () => void;
  currentMission?: Mission | null;
  onLocationSelect?: (location: CaliforniaLocation) => void;
  selectedLocationId?: string;
  showSquadPosition?: boolean;
  squadProgress?: number;
  discoveredLocationIds?: string[];
}

export const FullscreenCaliforniaMap: React.FC<FullscreenCaliforniaMapProps> = ({
  isOpen,
  onClose,
  currentMission,
  onLocationSelect,
  selectedLocationId,
  showSquadPosition = false,
  squadProgress = 0,
  discoveredLocationIds = []
}) => {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [hoveredRoad, setHoveredRoad] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Get visible locations based on discovery
  const visibleLocations = getVisibleLocations(discoveredLocationIds);

  // Fullscreen map dimensions
  const mapWidth = 2000;
  const mapHeight = 1800;

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));
  const handleResetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(1, Math.min(4, prev + delta)));
  };

  // Drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'w':
        case 'W':
          setPanY(prev => prev + 50);
          break;
        case 's':
        case 'S':
          setPanY(prev => prev - 50);
          break;
        case 'a':
        case 'A':
          setPanX(prev => prev + 50);
          break;
        case 'd':
        case 'D':
          setPanX(prev => prev - 50);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Convert percentage coordinates to pixel positions
  const coordToPixel = (coord: { x: number; y: number }) => ({
    x: (coord.x / 100) * mapWidth,
    y: (coord.y / 100) * mapHeight
  });

  // Get location marker size
  const getMarkerSize = (location: CaliforniaLocation) => {
    if (location.id === 'player-outpost') return 18;
    
    switch (location.type) {
      case 'settlement': return 16;
      case 'vault': return 14;
      case 'facility': return 14;
      case 'combat': return 10;
      case 'outpost': return 12;
      default: return 10;
    }
  };

  // Get marker color
  const getMarkerColor = (location: CaliforniaLocation) => {
    if (location.id === 'player-outpost') return '#10b981'; // Bright green for player
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

  // Calculate squad position
  const getSquadPosition = () => {
    if (!currentMission || !showSquadPosition || squadProgress === 0) return null;
    
    const playerOutpost = visibleLocations.find(loc => loc.id === 'player-outpost');
    const destination = visibleLocations.find(loc => loc.id === currentMission.location);
    
    if (!playerOutpost || !destination) return null;
    
    const startPos = coordToPixel(playerOutpost.coordinates);
    const endPos = coordToPixel(destination.coordinates);
    
    const progress = squadProgress / 100;
    
    return {
      x: startPos.x + (endPos.x - startPos.x) * progress,
      y: startPos.y + (endPos.y - startPos.y) * progress
    };
  };

  const squadPos = getSquadPosition();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-background border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">California Wasteland - Full Map</h2>
            <p className="text-sm text-muted-foreground">NCR Territory | Zoom: {zoom.toFixed(1)}x</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="relative w-full h-[80vh] overflow-hidden bg-[#1a1a1a]"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <Button size="icon" onClick={handleZoomIn} disabled={zoom >= 4}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={handleZoomOut} disabled={zoom <= 1}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={handleResetView}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Map Title & Legend */}
          <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-foreground">Shady Sands (NCR Capital)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-foreground">Home Settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-foreground">Settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-foreground">Combat Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-foreground">Undiscovered</span>
              </div>
            </div>
          </div>

          {/* Map SVG */}
          <div
            style={{
              transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
              transformOrigin: 'center center',
              width: '100%',
              height: '100%'
            }}
          >
            <svg 
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              className="w-full h-full"
              style={{ background: '#1a1a1a' }}
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid-fullscreen" width="200" height="200" patternUnits="userSpaceOnUse">
                  <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#2a2a2a" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width={mapWidth} height={mapHeight} fill="url(#grid-fullscreen)" />

              {/* Roads */}
              <RoadRenderer 
                roads={CALIFORNIA_ROADS}
                locations={CALIFORNIA_LOCATIONS}
                coordToPixel={coordToPixel}
                activeRoute={[]}
                hoveredRoadId={hoveredRoad}
                onRoadHover={setHoveredRoad}
              />

              {/* Locations */}
              {visibleLocations.map(location => {
                const pos = coordToPixel(location.coordinates);
                const size = getMarkerSize(location);
                const color = getMarkerColor(location);
                const isHovered = hoveredLocation === location.id;
                const isSelected = selectedLocationId === location.id;
                const isPlayerOutpost = location.id === 'player-outpost';

                return (
                  <g key={location.id}>
                    {/* Glow effect */}
                    {(isHovered || isSelected || isPlayerOutpost) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={size + 12}
                        fill={color}
                        opacity={isPlayerOutpost ? "0.5" : "0.3"}
                        className="animate-pulse"
                      />
                    )}

                    {/* Marker */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={size}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        filter: isHovered ? 'brightness(1.5)' : 'none'
                      }}
                      onMouseEnter={() => setHoveredLocation(location.id)}
                      onMouseLeave={() => setHoveredLocation(null)}
                      onClick={() => onLocationSelect?.(location)}
                    />

                    {/* Location label - always show for player outpost */}
                    {(isHovered || isSelected || isPlayerOutpost) && (
                      <text
                        x={pos.x}
                        y={pos.y - size - 10}
                        textAnchor="middle"
                        className="fill-foreground text-sm font-bold pointer-events-none"
                        style={{ 
                          textShadow: '0 0 4px #000, 0 0 8px #000',
                          fontSize: isPlayerOutpost ? '20px' : location.id === 'shady-sands' ? '18px' : '14px'
                        }}
                      >
                        {location.name}
                      </text>
                    )}

                    {/* Distance on hover */}
                    {isHovered && (
                      <text
                        x={pos.x}
                        y={pos.y + size + 20}
                        textAnchor="middle"
                        className="fill-muted-foreground text-xs pointer-events-none"
                        style={{ textShadow: '0 0 4px #000' }}
                      >
                        {location.distanceFromShadySands} mi | Danger: {location.dangerLevel}/10
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Squad position */}
              {squadPos && (
                <g>
                  <circle
                    cx={squadPos.x}
                    cy={squadPos.y}
                    r="16"
                    fill="#10b981"
                    opacity="0.3"
                    className="animate-pulse"
                  />
                  <circle
                    cx={squadPos.x}
                    cy={squadPos.y}
                    r="10"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={squadPos.x}
                    y={squadPos.y - 22}
                    textAnchor="middle"
                    className="fill-green-400 text-sm font-bold pointer-events-none"
                    style={{ textShadow: '0 0 4px #000' }}
                  >
                    YOUR SQUAD
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Location info panel */}
          {hoveredLocation && (
            <div className="absolute bottom-4 left-4 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-border max-w-md">
              {(() => {
                const location = visibleLocations.find(loc => loc.id === hoveredLocation);
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
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Controls Help */}
        <div className="p-4 bg-background border-t border-border">
          <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
            <span>🖱️ Drag to pan</span>
            <span>🔍 Mouse wheel to zoom</span>
            <span>⌨️ WASD to move</span>
            <span>⌨️ +/- to zoom</span>
            <span>⌨️ ESC to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
