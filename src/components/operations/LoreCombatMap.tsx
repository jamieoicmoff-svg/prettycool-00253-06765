import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Route, Eye, Crosshair, Navigation, Target } from 'lucide-react';
import { FALLOUT_LOCATIONS, getFalloutLocationById, calculateLoreTravelTime } from '@/data/FalloutLocations';
import { CombatTarget } from '@/components/combat/CombatTargets';
import { FalloutLoreMap } from '@/components/maps/FalloutLoreMap';
import { LoreAccurateFullMap } from '@/components/maps/LoreAccurateFullMap';

interface LoreCombatMapProps {
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

export const LoreCombatMap: React.FC<LoreCombatMapProps> = ({ 
  onSelectLocation, 
  selectedLocation, 
  activeCombat,
  onMapClick 
}) => {
  const [progress, setProgress] = useState(0);
  const [showFullMap, setShowFullMap] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'travel' | 'setup' | 'combat' | 'return'>('travel');
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);
  
  const baseLocation = getFalloutLocationById('shady-sands')!;
  
  useEffect(() => {
    if (!activeCombat) return;
    
    const updateProgress = () => {
      const elapsed = Date.now() - activeCombat.startTime;
      const totalDuration = activeCombat.duration * 60000; // Convert to ms
      const currentProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(currentProgress);
      
      // Calculate phase based on progress with realistic timing
      if (currentProgress < 20) {
        setCurrentPhase('travel');
      } else if (currentProgress < 30) {
        setCurrentPhase('setup');
      } else if (currentProgress < 85) {
        setCurrentPhase('combat');
      } else {
        setCurrentPhase('return');
      }
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 1000); // Update every second for smooth movement
    
    return () => clearInterval(interval);
  }, [activeCombat, baseLocation]);

  // Calculate real distance when combat starts
  useEffect(() => {
    if (activeCombat) {
      const targetLocation = FALLOUT_LOCATIONS.find(loc => 
        loc.name.toLowerCase().includes(activeCombat.target.location?.toLowerCase()) ||
        loc.id === activeCombat.target.location
      );
      
      if (targetLocation) {
        // Calculate approximate distance based on coordinates (each unit ≈ 2km)
        const distance = Math.sqrt(
          Math.pow(targetLocation.coordinates.x - baseLocation.coordinates.x, 2) + 
          Math.pow(targetLocation.coordinates.y - baseLocation.coordinates.y, 2)
        ) * 2;
        setEstimatedDistance(Math.round(distance));
      }
    }
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

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case 'travel':
        return 'Squad traversing wasteland routes';
      case 'setup':
        return 'Establishing tactical positions';
      case 'combat':
        return 'Engaging hostile forces';
      case 'return':
        return 'Returning to base via safe routes';
      default:
        return 'Mission in progress';
    }
  };

  return (
    <>
      {showFullMap && (
        <LoreAccurateFullMap
          onClose={() => setShowFullMap(false)}
          onSelectLocation={onSelectLocation}
          selectedLocation={selectedLocation}
          activeCombat={activeCombat ? {
            ...activeCombat,
            phase: currentPhase,
            progress: progress
          } : undefined}
        />
      )}
      
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Crosshair className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-red-400 font-bold">Wasteland Operations Map</h3>
              <p className="text-gray-400 text-xs">Lore-accurate Fallout locations and routes</p>
            </div>
          </div>
          <button
            onClick={() => setShowFullMap(true)}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/30"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">Full Tactical Map</span>
          </button>
        </div>
        
        {/* Active Combat Info */}
        {activeCombat && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
            <div className="text-center bg-black/30 rounded-lg p-2">
              <div className="text-gray-400">Progress</div>
              <div className="text-green-400 font-bold">{Math.round(progress)}%</div>
            </div>
            <div className="text-center bg-black/30 rounded-lg p-2">
              <div className="text-gray-400">ETA</div>
              <div className="text-blue-400 font-bold">{getTimeRemaining()}</div>
            </div>
            <div className="text-center bg-black/30 rounded-lg p-2">
              <div className="text-gray-400">Distance</div>
              <div className="text-purple-400 font-bold">{estimatedDistance}km</div>
            </div>
            <div className="text-center bg-black/30 rounded-lg p-2">
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

        {/* Live Status */}
        {activeCombat && (
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-3 mb-4 border border-blue-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <span className="text-blue-400 text-sm font-bold">LIVE TRACKING</span>
            </div>
            <p className="text-blue-300 text-sm">{getPhaseDescription()}</p>
            <div className="mt-2 text-xs text-gray-400">
              Target: {activeCombat.target.location} • Squad: {activeCombat.assignedSquad.length} operatives
            </div>
          </div>
        )}
        
        {/* Lore-Accurate Fallout Map */}
        <FalloutLoreMap
          onSelectLocation={onSelectLocation}
          selectedLocation={selectedLocation}
          activeCombat={activeCombat ? {
            ...activeCombat,
            phase: currentPhase,
            progress: progress
          } : undefined}
          onMapClick={() => setShowFullMap(true)}
          isCompact={true}
          showRoutes={true}
        />
        
        {/* Selected Location Details */}
        {selectedLocation && (
          <div className="mt-4 text-xs">
            {(() => {
              const location = getFalloutLocationById(selectedLocation);
              if (!location) return null;
              return (
                <div className="bg-black/30 rounded-lg p-3 border border-gray-500/30">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-gray-400">Target</div>
                      <div className="text-white font-semibold">{location.displayName}</div>
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
                      <div className="text-gray-400">Lore</div>
                      <div className="text-blue-300 text-xs leading-relaxed">{location.loreDescription}</div>
                    </div>
                    {location.faction && (
                      <div className="col-span-2">
                        <div className="text-gray-400">Controlling Faction</div>
                        <div className="text-cyan-400">{location.faction}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Wasteland Navigation Tips */}
        <div className="mt-4 bg-amber-900/20 rounded-lg p-3 border border-amber-500/30">
          <h4 className="text-amber-400 font-bold text-sm mb-2">Wasteland Navigation</h4>
          <div className="text-xs text-amber-300 space-y-1">
            <div>• Routes avoid known deathclaw territories and radiation zones</div>
            <div>• Travel times increase significantly in Legion and extreme danger areas</div>
            <div>• NCR territories offer safer but longer routes with patrol support</div>
            <div>• Underground routes provide protection but may have unique hazards</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoreCombatMap;