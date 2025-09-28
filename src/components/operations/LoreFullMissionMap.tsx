import React from 'react';
import { X, MapPin, Route, Clock, TriangleAlert as AlertTriangle, Shield, Target } from 'lucide-react';
import { FALLOUT_LOCATIONS, getFalloutLocationById, WASTELAND_ROUTES } from '@/data/FalloutLocations';
import { Mission } from '@/types/GameTypes';
import falloutMap from '@/assets/fallout-mojave-map.jpg';

interface LoreFullMissionMapProps {
  mission: Mission;
  onClose: () => void;
  squadPosition: { x: number; y: number };
  progress: number;
}

export const LoreFullMissionMap: React.FC<LoreFullMissionMapProps> = ({ 
  mission, 
  onClose, 
  squadPosition, 
  progress 
}) => {
  const destination = getFalloutLocationById(mission.location);
  const baseLocation = getFalloutLocationById('shady-sands')!;
  
  const getTimeRemaining = () => {
    const elapsed = Date.now() - mission.startTime;
    const totalDuration = mission.duration * 60000;
    const remaining = Math.max(0, totalDuration - elapsed);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentPhase = () => {
    if (progress < 20) return { name: 'TRAVEL', color: 'text-yellow-400', icon: '🚶' };
    if (progress < 30) return { name: 'SETUP', color: 'text-blue-400', icon: '🎯' };
    if (progress < 85) return { name: 'COMBAT', color: 'text-red-400', icon: '⚔️' };
    return { name: 'RETURN', color: 'text-green-400', icon: '🏃' };
  };

  const phase = getCurrentPhase();
  
  if (!destination) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-4 bg-black/80 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-500/20">
          <div className="flex items-center space-x-4">
            <Target className="w-8 h-8 text-red-400" />
            <div>
              <h2 className="text-2xl font-bold text-red-400">Mission: {mission.title}</h2>
              <p className="text-gray-400">Live tracking: {baseLocation.displayName} → {destination.displayName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mission Status Bar */}
        <div className="p-4 border-b border-amber-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <div className="grid grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-gray-400 text-sm">Mission</div>
              <div className="text-amber-400 font-bold">{mission.title}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Progress</div>
              <div className="text-green-400 font-bold">{Math.round(progress)}%</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Phase</div>
              <div className={`font-bold ${phase.color} flex items-center justify-center space-x-1`}>
                <span>{phase.icon}</span>
                <span>{phase.name}</span>
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">ETA</div>
              <div className="text-blue-400 font-bold">{getTimeRemaining()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Squad</div>
              <div className="text-purple-400 font-bold">{mission.assignedSquad.length} operatives</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
            <div 
              className={`h-3 rounded-full transition-all animate-pulse ${
                phase.name === 'TRAVEL' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                phase.name === 'SETUP' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                phase.name === 'COMBAT' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Map */}
        <div className="relative h-[calc(100%-200px)] p-4">
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
              <div className="w-8 h-8 bg-blue-500 rounded-full border-3 border-white shadow-xl" />
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm text-blue-400 font-bold whitespace-nowrap bg-black/80 px-3 py-1 rounded">
                🏠 {baseLocation.displayName}
              </div>
            </div>
            
            {/* All Major Locations */}
            {FALLOUT_LOCATIONS.filter(loc => loc.id !== 'shady-sands' && loc.id !== mission.location).map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ 
                  left: `${location.coordinates.x}%`, 
                  top: `${location.coordinates.y}%` 
                }}
              >
                <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                  location.dangerLevel <= 2 ? 'bg-green-400' :
                  location.dangerLevel <= 4 ? 'bg-yellow-400' :
                  location.dangerLevel <= 7 ? 'bg-orange-400' : 'bg-red-400'
                }`} />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap bg-black/60 px-2 py-1 rounded">
                  {location.name}
                </div>
              </div>
            ))}
            
            {/* Destination */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ 
                left: `${destination.coordinates.x}%`, 
                top: `${destination.coordinates.y}%` 
              }}
            >
              <div className="w-8 h-8 bg-red-500 rounded-full border-3 border-white shadow-xl animate-pulse" />
              <div className="absolute w-12 h-12 border-3 border-red-500 rounded-full animate-ping" />
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm text-red-400 font-bold whitespace-nowrap bg-black/80 px-3 py-1 rounded">
                🎯 {destination.displayName}
              </div>
            </div>
            
            {/* Squad Position */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
              style={{ 
                left: `${squadPosition.x}%`, 
                top: `${squadPosition.y}%` 
              }}
            >
              <div className="relative">
                <div className={`w-6 h-6 rounded-full border-3 border-white shadow-xl animate-pulse ${
                  phase.name === 'TRAVEL' ? 'bg-yellow-400' :
                  phase.name === 'SETUP' ? 'bg-blue-400' :
                  phase.name === 'COMBAT' ? 'bg-red-400' : 'bg-green-400'
                }`} />
                <div className="absolute w-10 h-10 border-2 border-current rounded-full animate-ping" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap border border-current">
                  {phase.icon} SQUAD ({mission.assignedSquad.length})
                </div>
              </div>
            </div>
            
            {/* Route Visualization */}
            <svg className="absolute inset-0 w-full h-full z-20">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                  <stop offset={`${progress}%`} stopColor="rgba(34, 197, 94, 0.8)" />
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
                strokeDasharray="12,6"
              />
            </svg>
            
            {/* Lore Information Panel */}
            <div className="absolute top-4 left-4 bg-black/90 rounded-xl p-4 max-w-sm border border-blue-500/30">
              <h3 className="text-blue-400 font-bold mb-3 flex items-center">
                <Shield className="mr-2" size={16} />
                Mission Intelligence
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Target Location:</span>
                  <span className="ml-2 text-white font-bold">{destination.displayName}</span>
                </div>
                <div>
                  <span className="text-gray-400">Faction Control:</span>
                  <span className="ml-2 text-cyan-400">{destination.faction || 'Neutral/Contested'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Threat Level:</span>
                  <span className={`ml-2 font-bold ${
                    destination.dangerLevel <= 2 ? 'text-green-400' :
                    destination.dangerLevel <= 4 ? 'text-yellow-400' :
                    destination.dangerLevel <= 7 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {destination.dangerLevel}/10
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-600">
                  <p className="text-blue-300 text-xs leading-relaxed">{destination.loreDescription}</p>
                </div>
              </div>
            </div>
            
            {/* Mission Details */}
            <div className="absolute bottom-4 right-4 bg-black/90 rounded-xl p-4 max-w-md border border-amber-500/30">
              <h3 className="text-amber-400 font-bold mb-3">Mission Status</h3>
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
                  <span className="text-gray-400">Distance:</span>
                  <span className="text-purple-400">
                    {Math.round(Math.sqrt(
                      Math.pow(destination.coordinates.x - baseLocation.coordinates.x, 2) + 
                      Math.pow(destination.coordinates.y - baseLocation.coordinates.y, 2)
                    ) * 2)}km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Squad Size:</span>
                  <span className="text-blue-400">{mission.assignedSquad.length} operatives</span>
                </div>
                <div className="mt-3 p-3 bg-gray-900/50 rounded border border-gray-600">
                  <p className="text-gray-300 text-xs leading-relaxed">{destination.description}</p>
                </div>
              </div>
            </div>

            {/* Wasteland Routes Overlay */}
            <svg className="absolute inset-0 w-full h-full z-5">
              {WASTELAND_ROUTES.map(route => {
                const fromLoc = getFalloutLocationById(route.from);
                const toLoc = getFalloutLocationById(route.to);
                
                if (!fromLoc || !toLoc) return null;
                
                const routeColor = route.dangerLevel <= 3 ? 'rgba(34, 197, 94, 0.4)' : 
                                 route.dangerLevel <= 6 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)';
                
                return (
                  <line
                    key={route.id}
                    x1={`${fromLoc.coordinates.x}%`}
                    y1={`${fromLoc.coordinates.y}%`}
                    x2={`${toLoc.coordinates.x}%`}
                    y2={`${toLoc.coordinates.y}%`}
                    stroke={routeColor}
                    strokeWidth="2"
                    strokeDasharray={route.type === 'dangerous-path' ? "8,4" : "none"}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Lore Panel */}
        <div className="absolute bottom-4 left-4 bg-black/90 rounded-xl p-4 max-w-md border border-green-500/30">
          <h3 className="text-green-400 font-bold mb-3 flex items-center">
            <Shield className="mr-2" size={16} />
            Wasteland Lore
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">About {destination.displayName}</h4>
              <p className="text-blue-300 text-xs leading-relaxed">{destination.loreDescription}</p>
            </div>
            
            {destination.faction && (
              <div>
                <h4 className="text-cyan-400 font-semibold mb-1">Faction Control</h4>
                <p className="text-cyan-300 text-xs">{destination.faction} maintains control of this area</p>
              </div>
            )}

            {destination.resources && destination.resources.length > 0 && (
              <div>
                <h4 className="text-green-400 font-semibold mb-1">Available Resources</h4>
                <div className="flex flex-wrap gap-1">
                  {destination.resources.map(resource => (
                    <span key={resource} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoreFullMissionMap;