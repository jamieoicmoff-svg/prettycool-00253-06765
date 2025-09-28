import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Route, Eye, Crosshair } from 'lucide-react';
import { MOJAVE_LOCATIONS, getLocationById, calculateTravelTime } from '@/data/MojaveLocations';
import { CombatTarget } from '@/components/combat/CombatTargets';
import { EnhancedCombatMap } from '@/components/maps/EnhancedCombatMap';
import { FullGoogleCombatMap } from '@/components/maps/FullGoogleCombatMap';
import { MapApiKeyInput } from '@/components/maps/MapApiKeyInput';
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
  const [showFullMap, setShowFullMap] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'travel' | 'setup' | 'combat' | 'return'>('travel');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  const baseLocation = getLocationById('shady-sands')!;

  // Check for API key on mount
  useEffect(() => {
    const apiKey = localStorage.getItem('google_maps_api_key') || process.env.GOOGLE_MAPS_API_KEY;
    setHasApiKey(!!apiKey);
  }, []);
  
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
  
  // Handle API key setup
  const handleApiKeySet = (apiKey: string) => {
    setHasApiKey(true);
    setShowApiKeyInput(false);
  };

  return (
    <>
      {showFullMap && hasApiKey && (
        <FullGoogleCombatMap
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

      {showApiKeyInput && (
        <div className="mb-4">
          <MapApiKeyInput onApiKeySet={handleApiKeySet} />
        </div>
      )}
      
      {hasApiKey ? (
        <EnhancedCombatMap
          onSelectLocation={onSelectLocation}
          selectedLocation={selectedLocation}
          activeCombat={activeCombat ? {
            ...activeCombat,
            phase: currentPhase,
            progress: progress
          } : undefined}
          onMapClick={() => setShowFullMap(true)}
          isCompact={true}
        />
      ) : (
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-5 h-5 text-red-400" />
              <h3 className="text-red-400 font-bold">Combat Operations Map</h3>
            </div>
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Setup Enhanced Map</span>
            </button>
          </div>
          
          {/* Fallback to original static map */}
          <div className="text-center text-gray-400 py-8">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm mb-2">Enhanced Google Maps not configured</p>
            <p className="text-xs">Click "Setup Enhanced Map" to enable interactive maps with real-time routing</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CombatOperationsMap;