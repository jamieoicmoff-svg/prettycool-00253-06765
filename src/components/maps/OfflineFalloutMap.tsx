import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapPin, Navigation, Crosshair, Eye, Users } from 'lucide-react';
import { MOJAVE_LOCATIONS, MojaveLocation, getLocationById } from '@/data/MojaveLocations';
import KMZParser, { KMZLocation } from '@/utils/KMZParser';
import falloutKmzFile from '@/assets/fallout-universe-data.kmz?url';
import mojaveMapImage from '@/assets/mojave-wasteland-map.jpg';

// Map bounds for coordinate conversion
const MAP_BOUNDS = {
  north: 37.5,
  south: 35.0,
  east: -114.0,
  west: -117.5
};

interface OfflineFalloutMapProps {
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

export const OfflineFalloutMap: React.FC<OfflineFalloutMapProps> = ({
  onSelectLocation,
  selectedLocation,
  activeCombat,
  onMapClick,
  isCompact = false,
  showFullscreen = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [kmzLocations, setKmzLocations] = useState<KMZLocation[]>([]);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [squadPosition, setSquadPosition] = useState<{ x: number; y: number } | null>(null);

  // Load map image and KMZ data
  useEffect(() => {
    const loadMapData = async () => {
      // Load background image
      const img = new Image();
      img.onload = () => setMapImage(img);
      img.src = mojaveMapImage;

      // Parse KMZ file
      try {
        const response = await fetch(falloutKmzFile);
        const arrayBuffer = await response.arrayBuffer();
        const parser = KMZParser.getInstance();
        const { locations } = await parser.parseKMZFile(arrayBuffer);
        setKmzLocations(locations);
      } catch (error) {
        console.error('Failed to parse KMZ file:', error);
      }
    };

    loadMapData();
  }, []);

  // Convert coordinates to canvas pixels
  const coordsToPixels = useCallback((coords: { lat?: number; lng?: number; x?: number; y?: number }, canvasWidth: number, canvasHeight: number) => {
    if ('lat' in coords && 'lng' in coords && coords.lat && coords.lng) {
      // Convert lat/lng to canvas coordinates
      const x = ((coords.lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * canvasWidth;
      const y = ((MAP_BOUNDS.north - coords.lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * canvasHeight;
      return { x, y };
    } else if ('x' in coords && 'y' in coords) {
      // Convert percentage coordinates to canvas coordinates
      return {
        x: (coords.x! / 100) * canvasWidth,
        y: (coords.y! / 100) * canvasHeight
      };
    }
    return { x: 0, y: 0 };
  }, []);

  // Calculate squad position based on combat progress
  useEffect(() => {
    if (!activeCombat || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const baseLocation = MOJAVE_LOCATIONS.find(loc => loc.id === 'shady-sands');
    const targetLocation = MOJAVE_LOCATIONS.find(loc => 
      loc.name.toLowerCase().includes(activeCombat.target.location?.toLowerCase())
    ) || kmzLocations.find(loc => 
      loc.name.toLowerCase().includes(activeCombat.target.location?.toLowerCase())
    );

    if (!baseLocation || !targetLocation) return;

    const basePixels = coordsToPixels(baseLocation.coordinates, canvas.width, canvas.height);
    const targetPixels = coordsToPixels(
      'lat' in targetLocation.coordinates ? targetLocation.coordinates : { x: 50, y: 50 },
      canvas.width,
      canvas.height
    );

    const progress = activeCombat.progress || 0;
    const phase = activeCombat.phase || 'travel';

    let currentPos;
    if (phase === 'return') {
      const returnProgress = progress > 85 ? (progress - 85) / 15 : 0;
      currentPos = {
        x: targetPixels.x + (basePixels.x - targetPixels.x) * returnProgress,
        y: targetPixels.y + (basePixels.y - targetPixels.y) * returnProgress
      };
    } else if (phase === 'combat') {
      currentPos = targetPixels;
    } else {
      const travelProgress = Math.min(progress / 25, 1); // Travel takes first 25% of time
      currentPos = {
        x: basePixels.x + (targetPixels.x - basePixels.x) * travelProgress,
        y: basePixels.y + (targetPixels.y - basePixels.y) * travelProgress
      };
    }

    setSquadPosition(currentPos);
  }, [activeCombat, coordsToPixels]);

  // Draw map
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !mapImage) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background map
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    // Draw locations
    const allLocations = [
      ...MOJAVE_LOCATIONS.map(loc => ({ ...loc, source: 'mojave' as const })),
      ...kmzLocations.map(loc => ({ ...loc, source: 'kmz' as const }))
    ];

    allLocations.forEach(location => {
      const coords = location.source === 'mojave' 
        ? location.coordinates 
        : { lat: location.coordinates.lat, lng: location.coordinates.lng };
      
      const { x, y } = coordsToPixels(coords, canvas.width, canvas.height);
      
      // Skip if coordinates are invalid
      if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;

      const isSelected = selectedLocation === location.id;
      const isHovered = hoveredLocation === location.id;
      const dangerLevel = location.dangerLevel || 5;

      // Draw location marker
      ctx.save();
      
      // Base circle
      const radius = isCompact ? 4 : (isSelected ? 8 : 6);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      
      // Color based on danger level
      if (dangerLevel <= 2) ctx.fillStyle = '#10B981'; // Green
      else if (dangerLevel <= 4) ctx.fillStyle = '#F59E0B'; // Yellow
      else if (dangerLevel <= 7) ctx.fillStyle = '#F97316'; // Orange
      else ctx.fillStyle = '#EF4444'; // Red
      
      ctx.fill();
      
      // Border
      ctx.strokeStyle = isSelected ? '#FBBF24' : (isHovered ? '#FFFFFF' : '#000000');
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Danger level text
      if (!isCompact) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(dangerLevel.toString(), x, y + 3);
      }

      // Location name on hover/selection
      if ((isHovered || isSelected) && !isCompact) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x - 40, y - 25, 80, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(location.name, x, y - 12);
      }

      ctx.restore();
    });

    // Draw base location (Shady Sands)
    const baseLocation = MOJAVE_LOCATIONS.find(loc => loc.id === 'shady-sands');
    if (baseLocation) {
      const { x, y } = coordsToPixels(baseLocation.coordinates, canvas.width, canvas.height);
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = '#1E40AF';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Base icon
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏠', x, y + 5);
      ctx.restore();
    }

    // Draw squad position during combat
    if (squadPosition) {
      const phase = activeCombat?.phase || 'travel';
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(squadPosition.x, squadPosition.y, 8, 0, 2 * Math.PI);
      
      // Color based on phase
      switch (phase) {
        case 'travel': ctx.fillStyle = '#F59E0B'; break;
        case 'setup': ctx.fillStyle = '#3B82F6'; break;
        case 'combat': ctx.fillStyle = '#EF4444'; break;
        case 'return': ctx.fillStyle = '#10B981'; break;
        default: ctx.fillStyle = '#6B7280';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Squad icon
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const icon = phase === 'combat' ? '⚔️' : '👥';
      ctx.fillText(icon, squadPosition.x, squadPosition.y + 4);
      
      // Pulsing effect during combat
      if (phase === 'combat') {
        const pulseRadius = 8 + Math.sin(Date.now() / 200) * 3;
        ctx.beginPath();
        ctx.arc(squadPosition.x, squadPosition.y, pulseRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      ctx.restore();
    }
  }, [mapImage, selectedLocation, hoveredLocation, squadPosition, activeCombat, isCompact, coordsToPixels]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = showFullscreen ? window.innerHeight : (isCompact ? 200 : 400);
      drawMap();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawMap, isCompact, showFullscreen]);

  // Redraw when dependencies change
  useEffect(() => {
    drawMap();
  }, [drawMap]);

  // Handle mouse interactions
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Check if click is on a location
    const allLocations = [
      ...MOJAVE_LOCATIONS,
      ...kmzLocations
    ];

    for (const location of allLocations) {
      const coords = 'x' in location.coordinates 
        ? location.coordinates 
        : { lat: location.coordinates.lat, lng: location.coordinates.lng };
      
      const { x, y } = coordsToPixels(coords, canvas.width, canvas.height);
      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      
      if (distance <= 10) { // Click tolerance
        onSelectLocation(location.id);
        return;
      }
    }

    // If no location clicked, trigger map click handler
    if (onMapClick) {
      onMapClick();
    }
  }, [coordsToPixels, onSelectLocation, onMapClick, kmzLocations]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isCompact) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if hovering over a location
    const allLocations = [
      ...MOJAVE_LOCATIONS,
      ...kmzLocations
    ];

    let foundHover = null;
    for (const location of allLocations) {
      const coords = 'x' in location.coordinates 
        ? location.coordinates 
        : { lat: location.coordinates.lat, lng: location.coordinates.lng };
      
      const { x, y } = coordsToPixels(coords, canvas.width, canvas.height);
      const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      
      if (distance <= 10) {
        foundHover = location.id;
        break;
      }
    }

    if (foundHover !== hoveredLocation) {
      setHoveredLocation(foundHover);
    }
  }, [coordsToPixels, hoveredLocation, isCompact, kmzLocations]);

  return (
    <div 
      ref={containerRef}
      className={`relative ${showFullscreen ? 'h-screen' : isCompact ? 'h-48' : 'h-96'} 
        bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden`}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="w-full h-full cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Map Legend */}
      {!isCompact && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30 text-xs">
          <h4 className="text-amber-400 font-bold mb-2 flex items-center">
            <Crosshair className="mr-1" size={12} />
            Mojave Wasteland
          </h4>
          <div className="space-y-1 text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Safe (1-2)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Moderate (3-4)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Dangerous (5-7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Deadly (8-10)</span>
            </div>
            {activeCombat && (
              <>
                <hr className="border-gray-600 my-2" />
                <div className="text-blue-400">
                  <Users className="inline mr-1" size={12} />
                  Squad: {activeCombat.assignedSquad.length}
                </div>
                <div className="text-red-400">
                  Phase: {activeCombat.phase?.toUpperCase()}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Location Details */}
      {selectedLocation && !isCompact && (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30 max-w-xs">
          {(() => {
            const location = MOJAVE_LOCATIONS.find(loc => loc.id === selectedLocation) ||
                           kmzLocations.find(loc => loc.id === selectedLocation);
            if (!location) return null;
            
            return (
              <div className="text-xs text-gray-300">
                <div className="text-amber-400 font-semibold mb-1">{location.name}</div>
                <div className="mb-2">{location.description}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400">Danger:</span>
                    <span className={`ml-1 font-semibold ${
                      (location.dangerLevel || 5) <= 2 ? 'text-green-400' :
                      (location.dangerLevel || 5) <= 4 ? 'text-yellow-400' :
                      (location.dangerLevel || 5) <= 7 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {location.dangerLevel || 5}/10
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-1 text-purple-400 capitalize">{location.type}</span>
                  </div>
                </div>
                {'faction' in location && location.faction && (
                  <div className="mt-1">
                    <span className="text-gray-400">Faction:</span>
                    <span className="ml-1 text-blue-400">{location.faction}</span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default OfflineFalloutMap;