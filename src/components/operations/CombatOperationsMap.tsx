import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Route, Eye, Crosshair } from 'lucide-react';
import { CALIFORNIA_LOCATIONS, getCaliforniaLocationById } from '@/data/CaliforniaLocations';
import { CombatTarget } from '@/components/combat/CombatTargets';
import { CaliforniaWastelandMap } from '@/components/maps/CaliforniaWastelandMap';
import { FullscreenCaliforniaMap } from '@/components/maps/FullscreenCaliforniaMap';

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
  const [currentPhase, setCurrentPhase] = useState<'travel' | 'setup' | 'combat' | 'return'>('travel');
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  
  useEffect(() => {
    if (!activeCombat) return;
    
    const updateProgress = () => {
      const elapsed = Date.now() - activeCombat.startTime;
      const totalDuration = activeCombat.duration * 60000; // Convert to ms
      const currentProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(currentProgress);
      
      // Calculate phase based on progress
      if (currentProgress < 15) {
        setCurrentPhase('travel');
      } else if (currentProgress < 25) {
        setCurrentPhase('setup');
      } else if (currentProgress < 85) {
        setCurrentPhase('combat');
      } else {
        setCurrentPhase('return');
      }
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, [activeCombat]);
  
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-5 h-5 text-red-400" />
          <h3 className="text-red-400 font-bold">Combat Operations Map</h3>
        </div>
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
              <div className="text-gray-400">Phase</div>
              <div className={`font-bold ${
                currentPhase === 'travel' ? 'text-yellow-400' :
                currentPhase === 'setup' ? 'text-blue-400' :
                currentPhase === 'combat' ? 'text-red-400' : 'text-green-400'
              }`}>
                {currentPhase.toUpperCase()}
              </div>
            </div>
          </div>
        )}
        
        {/* California Wasteland Map */}
        <div className="h-[500px] cursor-pointer" onClick={() => setIsFullscreenOpen(true)}>
          <CaliforniaWastelandMap
            onLocationSelect={(location) => onSelectLocation(location.id)}
            selectedLocationId={selectedLocation}
            showSquadPosition={!!activeCombat}
            squadProgress={progress}
        />
      </div>

      <FullscreenCaliforniaMap
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        onLocationSelect={(location) => onSelectLocation(location.id)}
        selectedLocationId={selectedLocation}
        showSquadPosition={!!activeCombat}
        squadProgress={progress}
      />
        
        {/* Selected Location Details */}
        {selectedLocation && (
          <div className="mt-3 text-xs">
            {(() => {
              const location = getCaliforniaLocationById(selectedLocation);
              if (!location) return null;
              return (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-gray-400">Target</div>
                    <div className="text-white">{location.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Distance</div>
                    <div className="text-blue-400 font-bold">{location.distanceFromShadySands} mi</div>
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
                  <div>
                    <div className="text-gray-400">Terrain</div>
                    <div className="text-white capitalize">{location.terrain}</div>
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