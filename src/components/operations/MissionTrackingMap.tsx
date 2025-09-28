import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Route, Eye } from 'lucide-react';
import { MOJAVE_LOCATIONS, getLocationById, calculateTravelTime } from '@/data/MojaveLocations';
import { Mission } from '@/types/GameTypes';
import mojaveMap from '@/assets/mojave-wasteland-map.jpg';

interface MissionTrackingMapProps {
  mission: Mission;
  onMapClick?: () => void;
}

export const MissionTrackingMap: React.FC<MissionTrackingMapProps> = ({ mission, onMapClick }) => {
  const [progress, setProgress] = useState(0);
  const [squadPosition, setSquadPosition] = useState({ x: 15, y: 65 }); // Start at Shady Sands
  
  const destination = getLocationById(mission.location);
  const baseLocation = getLocationById('shady-sands')!;
  
  useEffect(() => {
    const updateProgress = () => {
      const elapsed = Date.now() - mission.startTime;
      const totalDuration = mission.duration * 60000; // Convert to ms
      const currentProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(currentProgress);
      
      // Calculate squad position based on progress
      if (destination) {
        const progressFactor = currentProgress / 100;
        const currentX = baseLocation.coordinates.x + (destination.coordinates.x - baseLocation.coordinates.x) * progressFactor;
        const currentY = baseLocation.coordinates.y + (destination.coordinates.y - baseLocation.coordinates.y) * progressFactor;
        setSquadPosition({ x: currentX, y: currentY });
      }
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [mission, destination, baseLocation]);
  
  const getTimeRemaining = () => {
    const elapsed = Date.now() - mission.startTime;
    const totalDuration = mission.duration * 60000;
    const remaining = Math.max(0, totalDuration - elapsed);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
          <div className="text-gray-400">Squad Size</div>
          <div className="text-amber-400 font-bold">{mission.assignedSquad.length}</div>
        </div>
      </div>
      
      {/* Mini Map */}
      <div 
        className="relative w-full h-32 rounded-lg overflow-hidden border border-amber-500/30 cursor-pointer hover:border-amber-400/50 transition-colors"
        onClick={onMapClick}
        style={{
          backgroundImage: `url(${mojaveMap})`,
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
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-400 font-medium whitespace-nowrap">
            Base
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
          <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-400 font-medium whitespace-nowrap">
            {destination.displayName}
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
          <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg animate-pulse" />
          <div className="absolute w-4 h-4 border-2 border-blue-400 rounded-full animate-ping" />
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
            stroke="rgba(59, 130, 246, 0.6)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
        
        {/* Progress overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all animate-pulse"
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
    </div>
  );
};

export default MissionTrackingMap;