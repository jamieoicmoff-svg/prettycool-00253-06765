import React, { useState, useEffect } from 'react';
import { X, MapPin, Users, Clock, Crosshair, AlertTriangle } from 'lucide-react';
import { MOJAVE_LOCATIONS, getLocationById } from '@/data/MojaveLocations';
import { CombatTarget } from '@/components/combat/CombatTargets';
import falloutMap from '@/assets/fallout-mojave-map.jpg';

interface FullCombatMapProps {
  onClose: () => void;
  onSelectLocation: (locationId: string) => void;
  selectedLocation?: string;
  activeCombat?: {
    target: CombatTarget;
    startTime: number;
    duration: number;
    assignedSquad: string[];
  };
}

export const FullCombatMap: React.FC<FullCombatMapProps> = ({ 
  onClose, 
  onSelectLocation, 
  selectedLocation,
  activeCombat 
}) => {
  const [progress, setProgress] = useState(0);
  const [squadPosition, setSquadPosition] = useState({ x: 15, y: 65 });
  
  const baseLocation = getLocationById('shady-sands')!;
  
  useEffect(() => {
    if (!activeCombat) return;
    
    const updateProgress = () => {
      const elapsed = Date.now() - activeCombat.startTime;
      const totalDuration = activeCombat.duration * 60000;
      const currentProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(currentProgress);
      
      const destination = getLocationById(activeCombat.target.location);
      if (destination) {
        const progressFactor = currentProgress / 100;
        const currentX = baseLocation.coordinates.x + (destination.coordinates.x - baseLocation.coordinates.x) * progressFactor;
        const currentY = baseLocation.coordinates.y + (destination.coordinates.y - baseLocation.coordinates.y) * progressFactor;
        setSquadPosition({ x: currentX, y: currentY });
      }
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-4 bg-black/60 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-500/20">
          <div className="flex items-center space-x-3">
            <Crosshair className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-red-400">Combat Operations - Mojave Wasteland</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Active Combat Status */}
        {activeCombat && (
          <div className="p-4 border-b border-amber-500/20 bg-red-900/20">
            <div className="grid grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-gray-400 text-sm">Mission</div>
                <div className="text-red-400 font-bold">{activeCombat.target.name}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Progress</div>
                <div className="text-green-400 font-bold">{Math.round(progress)}%</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">ETA</div>
                <div className="text-blue-400 font-bold">{getTimeRemaining()}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Squad</div>
                <div className="text-amber-400 font-bold">{activeCombat.assignedSquad.length} operatives</div>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="relative h-[calc(100%-120px)] p-4">
          <div 
            className="relative w-full h-full rounded-xl overflow-hidden border border-amber-500/30"
            style={{
              backgroundImage: `url(${falloutMap})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Base Location (Shady Sands) */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ 
                left: `${baseLocation.coordinates.x}%`, 
                top: `${baseLocation.coordinates.y}%` 
              }}
            >
              <div className="w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-xl" />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-green-400 font-bold whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                🏠 BASE
              </div>
            </div>
            
            {/* All Locations */}
            {MOJAVE_LOCATIONS.map(location => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                style={{ 
                  left: `${location.coordinates.x}%`, 
                  top: `${location.coordinates.y}%` 
                }}
                onClick={() => onSelectLocation(location.id)}
              >
                <div 
                  className={`w-4 h-4 rounded-full border-3 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-150 hover:z-20 ${
                    selectedLocation === location.id 
                      ? 'bg-yellow-500 animate-pulse scale-125' 
                      : location.dangerLevel > 7 
                        ? 'bg-red-500' 
                        : location.dangerLevel > 4 
                          ? 'bg-orange-500' 
                          : 'bg-blue-500'
                  }`} 
                />
                
                {/* Location Info Popup */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/90 border border-amber-500/50 rounded-lg p-3 min-w-64 shadow-xl">
                    <h4 className="text-amber-400 font-bold text-sm mb-1">{location.displayName}</h4>
                    <p className="text-gray-300 text-xs mb-2">{location.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span className={`font-bold ${
                          location.dangerLevel > 7 ? 'text-red-400' :
                          location.dangerLevel > 4 ? 'text-orange-400' : 'text-green-400'
                        }`}>
                          Danger: {location.dangerLevel}/10
                        </span>
                      </div>
                      <span className="text-gray-400 capitalize">{location.terrainType}</span>
                    </div>
                  </div>
                </div>
                
                {/* Location Name */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap bg-black/60 px-2 py-1 rounded border border-gray-600">
                  {location.name.toUpperCase()}
                </div>
              </div>
            ))}
            
            {/* Active Combat Elements */}
            {activeCombat && (
              <>
                {/* Squad Position */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ 
                    left: `${squadPosition.x}%`, 
                    top: `${squadPosition.y}%` 
                  }}
                >
                  <div className="w-4 h-4 bg-blue-400 rounded-full shadow-xl animate-pulse border-2 border-white" />
                  <div className="absolute w-8 h-8 border-3 border-blue-400 rounded-full animate-ping" />
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 font-bold whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                    SQUAD
                  </div>
                </div>
                
                {/* Destination Marker */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
                  style={{ 
                    left: `${getLocationById(activeCombat.target.location)?.coordinates.x || 50}%`, 
                    top: `${getLocationById(activeCombat.target.location)?.coordinates.y || 50}%` 
                  }}
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-xl animate-pulse" />
                  <div className="absolute w-10 h-10 border-3 border-red-500 rounded-full animate-ping" />
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
                    stroke="rgba(59, 130, 246, 0.8)"
                    strokeWidth="3"
                    strokeDasharray="10,5"
                    className="animate-pulse"
                  />
                </svg>
                
                {/* Progress Bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 rounded-lg p-3 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-gray-400">Mission Progress</span>
                    <span className="text-red-400 font-bold">{activeCombat.target.name}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all animate-pulse"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullCombatMap;