import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Route, Eye, Target, Navigation } from 'lucide-react';
import { FALLOUT_LOCATIONS, getFalloutLocationById, calculateLoreTravelTime } from '@/data/FalloutLocations';
import { Mission } from '@/types/GameTypes';
import falloutMap from '@/assets/fallout-mojave-map.jpg';

interface LoreMissionTrackingMapProps {
  mission: Mission;
  onMapClick?: () => void;
}

export const LoreMissionTrackingMap: React.FC<LoreMissionTrackingMapProps> = ({ mission, onMapClick }) => {
  const [progress, setProgress] = useState(0);
  const [squadPosition, setSquadPosition] = useState({ x: 15, y: 75 }); // Start at Shady Sands
  const [currentPhase, setCurrentPhase] = useState<'travel' | 'setup' | 'combat' | 'return'>('travel');
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  
  const destination = getFalloutLocationById(mission.location);
  const baseLocation = getFalloutLocationById('shady-sands')!;
  
  useEffect(() => {
    const updateProgress = () => {
      const elapsed = Date.now() - mission.startTime;
      const totalDuration = mission.duration * 60000; // Convert to ms
      const currentProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(currentProgress);
      
      // Calculate realistic phase transitions
      if (currentProgress < 20) {
        setCurrentPhase('travel');
      } else if (currentProgress < 30) {
        setCurrentPhase('setup');
      } else if (currentProgress < 85) {
        setCurrentPhase('combat');
      } else {
        setCurrentPhase('return');
      }
      
      // Calculate squad position based on progress and phase
      if (destination) {
        let progressFactor;
        
        if (currentPhase === 'return') {
          // Return journey
          const returnProgress = Math.max(0, (currentProgress - 85) / 15);
          progressFactor = 1 - returnProgress; // Move back towards base
        } else if (currentPhase === 'combat') {
          // Stay at destination during combat
          progressFactor = 1;
        } else {
          // Travel and setup phases
          progressFactor = Math.min(1, currentProgress / 30);
        }
        
        const currentX = baseLocation.coordinates.x + (destination.coordinates.x - baseLocation.coordinates.x) * progressFactor;
        const currentY = baseLocation.coordinates.y + (destination.coordinates.y - baseLocation.coordinates.y) * progressFactor;
        setSquadPosition({ x: currentX, y: currentY });
      }
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, [mission, destination, baseLocation]);

  // Calculate distance when mission starts
  useEffect(() => {
    if (destination) {
      const distance = Math.sqrt(
        Math.pow(destination.coordinates.x - baseLocation.coordinates.x, 2) + 
        Math.pow(destination.coordinates.y - baseLocation.coordinates.y, 2)
      ) * 2; // Each coordinate unit ≈ 2km
      setEstimatedDistance(Math.round(distance));
    }
  }, [destination, baseLocation]);
  
  const getTimeRemaining = () => {
    const elapsed = Date.now() - mission.startTime;
    const totalDuration = mission.duration * 60000;
    const remaining = Math.max(0, totalDuration - elapsed);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'travel': return '🚶';
      case 'setup': return '🎯';
      case 'combat': return '⚔️';
      case 'return': return '🏃';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'travel': return 'text-yellow-400';
      case 'setup': return 'text-blue-400';
      case 'combat': return 'text-red-400';
      case 'return': return 'text-green-400';
    }
  };
  
  if (!destination) return null;
  
  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Route className="w-5 h-5 text-amber-400" />
          <h3 className="text-amber-400 font-bold">Live Mission Tracking</h3>
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
      
      {/* Mission Info */}
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
          <div className="text-gray-400">Distance</div>
          <div className="text-purple-400 font-bold">{estimatedDistance}km</div>
        </div>
      </div>

      {/* Phase Status */}
      <div className="bg-black/30 rounded-lg p-3 mb-4 border border-gray-500/30">
        <div className="flex items-center space-x-3">
          <span className="text-2xl animate-bounce">{getPhaseIcon()}</span>
          <div>
            <div className={`font-bold ${getPhaseColor()}`}>
              {currentPhase.toUpperCase()} PHASE
            </div>
            <div className="text-gray-400 text-xs">
              {currentPhase === 'travel' && 'Squad moving through wasteland terrain'}
              {currentPhase === 'setup' && 'Establishing tactical positions'}
              {currentPhase === 'combat' && 'Engaging hostile forces'}
              {currentPhase === 'return' && 'Returning to base via safe routes'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Lore-Accurate Mini Map */}
      <div 
        className="relative w-full h-32 rounded-lg overflow-hidden border border-amber-500/30 cursor-pointer hover:border-amber-400/50 transition-colors"
        onClick={onMapClick}
        style={{
          backgroundImage: `url(${falloutMap})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Base Location (Shady Sands) */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ 
            left: `${baseLocation.coordinates.x}%`, 
            top: `${baseLocation.coordinates.y}%` 
          }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 font-bold whitespace-nowrap">
            🏠 BASE
          </div>
        </div>
        
        {/* Destination */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ 
            left: `${destination.coordinates.x}%`, 
            top: `${destination.coordinates.y}%` 
          }}
        >
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-400 font-bold whitespace-nowrap">
            🎯 {destination.displayName}
          </div>
        </div>
        
        {/* Squad Position */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ 
            left: `${squadPosition.x}%`, 
            top: `${squadPosition.y}%` 
          }}
        >
          <div className="relative">
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg animate-pulse ${
              currentPhase === 'travel' ? 'bg-yellow-400' :
              currentPhase === 'setup' ? 'bg-blue-400' :
              currentPhase === 'combat' ? 'bg-red-400' : 'bg-green-400'
            }`} />
            <div className="absolute w-6 h-6 border-2 border-current rounded-full animate-ping opacity-50" />
          </div>
        </div>
        
        {/* Route Line */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          style={{ zIndex: 5 }}
        >
          <line
            x1={`${baseLocation.coordinates.x}%`}
            y1={`${baseLocation.coordinates.y}%`}
            x2={`${destination.coordinates.x}%`}
            y2={`${destination.coordinates.y}%`}
            stroke={currentPhase === 'return' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(59, 130, 246, 0.8)'}
            strokeWidth="3"
            strokeDasharray="8,4"
            className="animate-pulse"
          />
        </svg>
        
        {/* Progress overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all animate-pulse ${
                currentPhase === 'travel' ? 'bg-yellow-500' :
                currentPhase === 'setup' ? 'bg-blue-500' :
                currentPhase === 'combat' ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Route Details */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-gray-400">Route</div>
          <div className="text-white">
            {baseLocation.displayName} → {destination.displayName}
          </div>
        </div>
        <div>
          <div className="text-gray-400">Terrain</div>
          <div className="text-white capitalize">
            {destination.terrainType}
            {destination.subTerrain && ` (${destination.subTerrain})`}
          </div>
        </div>
      </div>

      {/* Lore Information */}
      <div className="mt-3 bg-blue-900/20 rounded-lg p-3 border border-blue-500/30">
        <h4 className="text-blue-400 font-bold text-xs mb-2">Location Lore</h4>
        <p className="text-blue-300 text-xs leading-relaxed">{destination.loreDescription}</p>
        {destination.faction && (
          <div className="mt-2 text-xs">
            <span className="text-gray-400">Controlled by:</span>
            <span className="ml-1 text-cyan-400 font-bold">{destination.faction}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoreMissionTrackingMap;