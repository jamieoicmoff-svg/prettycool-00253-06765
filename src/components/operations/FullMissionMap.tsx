import React from 'react';
import { X, MapPin, Route, Clock, AlertTriangle } from 'lucide-react';
import { MOJAVE_LOCATIONS, getLocationById } from '@/data/MojaveLocations';
import { Mission } from '@/types/GameTypes';
import mojaveMap from '@/assets/mojave-wasteland-map.jpg';

interface FullMissionMapProps {
  mission: Mission;
  onClose: () => void;
  squadPosition: { x: number; y: number };
  progress: number;
}

export const FullMissionMap: React.FC<FullMissionMapProps> = ({ 
  mission, 
  onClose, 
  squadPosition, 
  progress 
}) => {
  const destination = getLocationById(mission.location);
  const baseLocation = getLocationById('shady-sands')!;
  
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black/90 rounded-xl border border-amber-500/30 w-full max-w-6xl h-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-500/20">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-amber-400">Mission Map - {mission.title}</h2>
              <p className="text-gray-400 text-sm">Live tracking: {baseLocation.displayName} → {destination.displayName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Mission Status Bar */}
        <div className="p-4 bg-black/50 border-b border-amber-500/10">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400">Progress</div>
              <div className="text-green-400 font-bold text-lg">{Math.round(progress)}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Time Remaining</div>
              <div className="text-blue-400 font-bold text-lg">{getTimeRemaining()}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Squad Size</div>
              <div className="text-amber-400 font-bold text-lg">{mission.assignedSquad.length}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Danger Level</div>
              <div className={`font-bold text-lg ${
                destination.dangerLevel <= 3 ? 'text-green-400' : 
                destination.dangerLevel <= 6 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {destination.dangerLevel}/10
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all animate-pulse"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Main Map */}
        <div className="relative flex-1 h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${mojaveMap})`,
            }}
          />
          
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* All Major Locations */}
          {MOJAVE_LOCATIONS.map((location) => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ 
                left: `${location.coordinates.x}%`, 
                top: `${location.coordinates.y}%` 
              }}
            >
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                location.id === 'shady-sands' ? 'bg-green-500' :
                location.id === mission.location ? 'bg-red-500 animate-pulse' :
                location.dangerLevel <= 3 ? 'bg-blue-400' :
                location.dangerLevel <= 6 ? 'bg-yellow-400' :
                'bg-red-400'
              }`} />
              <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap px-2 py-1 rounded ${
                location.id === 'shady-sands' ? 'text-green-400 bg-green-900/50' :
                location.id === mission.location ? 'text-red-400 bg-red-900/50' :
                'text-white bg-black/50'
              }`}>
                {location.name}
              </div>
            </div>
          ))}
          
          {/* Squad Position */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
            style={{ 
              left: `${squadPosition.x}%`, 
              top: `${squadPosition.y}%` 
            }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-xl animate-pulse" />
              <div className="absolute w-8 h-8 border-2 border-blue-400 rounded-full animate-ping" />
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-900/80 text-blue-200 px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">
                Squad Position
              </div>
            </div>
          </div>
          
          {/* Route Visualization */}
          <svg className="absolute inset-0 w-full h-full z-20">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
                <stop offset={`${progress}%`} stopColor="rgba(59, 130, 246, 0.8)" />
                <stop offset={`${progress}%`} stopColor="rgba(156, 163, 175, 0.4)" />
                <stop offset="100%" stopColor="rgba(156, 163, 175, 0.4)" />
              </linearGradient>
            </defs>
            <line
              x1={`${baseLocation.coordinates.x}%`}
              y1={`${baseLocation.coordinates.y}%`}
              x2={`${destination.coordinates.x}%`}
              y2={`${destination.coordinates.y}%`}
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeDasharray="10,5"
            />
          </svg>
          
          {/* Legend */}
          <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-4 min-w-[200px]">
            <h3 className="text-amber-400 font-bold mb-3">Map Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-white">Base (Shady Sands)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white">Mission Target</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-white">Squad Position</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-white">Safe Locations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="text-white">Moderate Danger</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="text-white">High Danger</span>
              </div>
            </div>
          </div>
          
          {/* Mission Details */}
          <div className="absolute bottom-4 right-4 bg-black/80 rounded-lg p-4 max-w-md">
            <h3 className="text-amber-400 font-bold mb-2">Mission Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Destination:</span>
                <span className="text-white">{destination.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Terrain:</span>
                <span className="text-white capitalize">{destination.terrainType}</span>
              </div>
              {destination.subTerrain && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Sub-terrain:</span>
                  <span className="text-white">{destination.subTerrain}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Danger Level:</span>
                <span className={`${
                  destination.dangerLevel <= 3 ? 'text-green-400' : 
                  destination.dangerLevel <= 6 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {destination.dangerLevel}/10
                </span>
              </div>
              <div className="mt-3 p-2 bg-gray-900/50 rounded">
                <p className="text-gray-300 text-xs">{destination.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullMissionMap;