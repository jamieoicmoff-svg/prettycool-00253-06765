import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Route, Eye, Crosshair } from 'lucide-react';
import { MOJAVE_LOCATIONS, getLocationById, calculateTravelTime } from '@/data/MojaveLocations';
import { CombatTarget } from '@/components/combat/CombatTargets';
import falloutMap from '@/assets/fallout-mojave-map.jpg';

interface CombatOperationsMapProps {
  onSelectLocation: (locationId: string) => void;
  selectedLocation?: string;
  activeCombat?: {
    target: CombatTarget;
    startTime: number;
    duration: number;
    assignedSquad: string[];
  };
  onMapClick?: () => void;
}

export const CombatOperationsMap: React.FC<CombatOperationsMapProps> = ({ 
  onSelectLocation, 
  selectedLocation, 
  activeCombat,
  onMapClick 
}) => {
  const [progress, setProgress] = useState(0);
  const [squadPosition, setSquadPosition] = useState({ x: 15, y: 65 }); // Start at Shady Sands
  
  const baseLocation = getLocationById('shady-sands')!;
  
  useEffect(() => {
    if (!activeCombat) return;
    
    const updateProgress = () => {
      const elapsed = Date.now() - activeCombat.startTime;
      const totalDuration = activeCombat.duration * 60000; // Convert to ms
      const currentProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(currentProgress);
      
      // Calculate squad position based on progress
      const destination = getLocationById(activeCombat.target.location);
      if (destination) {
        const progressFactor = currentProgress / 100;
        const currentX = baseLocation.coordinates.x + (destination.coordinates.x - baseLocation.coordinates.x) * progressFactor;
        const currentY = baseLocation.coordinates.y + (destination.coordinates.y - baseLocation.coordinates.y) * progressFactor;
        setSquadPosition({ x: currentX, y: currentY });
      }
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, [activeCombat, baseLocation]);
  
  const getTimeRemaining = () => {
    if (!activeCombat) return '';
    const elapsed = Date.now() - activeCombat.startTime;
    const totalDuration = activeCombat.duration * 60000;
    const remaining = Math.max(0, totalDuration - elapsed);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-5 h-5 text-red-400" />
          <h3 className="text-red-400 font-bold">Combat Operations Map</h3>
        </div>
        {onMapClick && (
          <button
            onClick={onMapClick}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">Full Map</span>
          </button>
        )}
      </div>
      
      {/* Active Combat Info */}
      {activeCombat && (
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
          <div className="text-center">
            <div className="text-gray-400">Progress</div>
            <div className="text-green-400 font-bold">{Math.round(progress)}%</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">ETA</div>
            <div className="text-blue-400 font-bold">{getTimeRemaining()}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Squad Size</div>
            <div className="text-amber-400 font-bold">{activeCombat.assignedSquad.length}</div>
          </div>
        </div>
      )}
      
      {/* Interactive Map */}
      <div 
        className="relative w-full h-48 rounded-lg overflow-hidden border border-amber-500/30 cursor-pointer hover:border-amber-400/50 transition-colors"
        onClick={onMapClick}
        style={{
          backgroundImage: `url(${falloutMap})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Base Location (Shady Sands) */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ 
            left: `${baseLocation.coordinates.x}%`, 
            top: `${baseLocation.coordinates.y}%` 
          }}
        >
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-400 font-medium whitespace-nowrap">
            Base
          </div>
        </div>
        
        {/* Clickable Locations */}
        {MOJAVE_LOCATIONS.map(location => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ 
              left: `${location.coordinates.x}%`, 
              top: `${location.coordinates.y}%` 
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLocation(location.id);
            }}
          >
            <div 
              className={`w-3 h-3 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform ${
                selectedLocation === location.id 
                  ? 'bg-yellow-500 animate-pulse' 
                  : location.dangerLevel > 7 
                    ? 'bg-red-500' 
                    : location.dangerLevel > 4 
                      ? 'bg-orange-500' 
                      : 'bg-blue-500'
              }`} 
            />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap bg-black/60 px-1 rounded">
              {location.name.toUpperCase()}
            </div>
          </div>
        ))}
        
        {/* Active Combat Squad Position */}
        {activeCombat && (
          <>
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ 
                left: `${squadPosition.x}%`, 
                top: `${squadPosition.y}%` 
              }}
            >
              <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg animate-pulse" />
              <div className="absolute w-6 h-6 border-2 border-blue-400 rounded-full animate-ping" />
            </div>
            
            {/* Route Line */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              style={{ zIndex: 5 }}
            >
              <line
                x1={`${baseLocation.coordinates.x}%`}
                y1={`${baseLocation.coordinates.y}%`}
                x2={`${getLocationById(activeCombat.target.location)?.coordinates.x || 50}%`}
                y2={`${getLocationById(activeCombat.target.location)?.coordinates.y || 50}%`}
                stroke="rgba(59, 130, 246, 0.6)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </>
        )}
        
        {/* Progress overlay for active combat */}
        {activeCombat && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div 
                className="bg-red-500 h-1 rounded-full transition-all animate-pulse"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="mt-3 text-xs">
          {(() => {
            const location = getLocationById(selectedLocation);
            if (!location) return null;
            return (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-gray-400">Target</div>
                  <div className="text-white">{location.displayName}</div>
                </div>
                <div>
                  <div className="text-gray-400">Danger Level</div>
                  <div className={`font-bold ${
                    location.dangerLevel > 7 ? 'text-red-400' :
                    location.dangerLevel > 4 ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    {location.dangerLevel}/10
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-400">Description</div>
                  <div className="text-white text-xs">{location.description}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default CombatOperationsMap;