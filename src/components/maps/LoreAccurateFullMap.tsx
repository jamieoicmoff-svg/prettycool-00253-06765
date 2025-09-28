import React, { useState } from 'react';
import { X, Map, Layers, Navigation, Eye, Shield, Target } from 'lucide-react';
import { FalloutLoreMap } from './FalloutLoreMap';
import { FALLOUT_LOCATIONS, getFalloutLocationById } from '@/data/FalloutLocations';

interface LoreAccurateFullMapProps {
  onClose: () => void;
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
}

export const LoreAccurateFullMap: React.FC<LoreAccurateFullMapProps> = ({
  onClose,
  onSelectLocation,
  selectedLocation,
  activeCombat
}) => {
  const [viewMode, setViewMode] = useState<'overview' | 'tactical' | 'lore'>('overview');
  const [filterFaction, setFilterFaction] = useState<string | null>(null);
  const [filterDanger, setFilterDanger] = useState<number | null>(null);

  const factions = ['NCR', 'Brotherhood of Steel', 'Caesar\'s Legion', 'Mr. House', 'Ghouls'];
  const selectedLocationData = selectedLocation ? getFalloutLocationById(selectedLocation) : null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 bg-black/60 border-b border-amber-500/30">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-amber-400 flex items-center">
            <Map className="w-8 h-8 mr-3" />
            Post-Nuclear California - Tactical Overview
          </h2>
          
          {/* View Mode Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'overview' 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
              title="Overview Mode"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tactical')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'tactical' 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
              title="Tactical Mode"
            >
              <Target className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('lore')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'lore' 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
              title="Lore Mode"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* Faction Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={filterFaction || ''}
              onChange={(e) => setFilterFaction(e.target.value || null)}
              className="bg-black/60 border border-gray-500/30 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">All Factions</option>
              {factions.map(faction => (
                <option key={faction} value={faction}>{faction}</option>
              ))}
            </select>
            
            <select
              value={filterDanger || ''}
              onChange={(e) => setFilterDanger(e.target.value ? parseInt(e.target.value) : null)}
              className="bg-black/60 border border-gray-500/30 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">All Danger Levels</option>
              <option value="1">Safe (1-2)</option>
              <option value="3">Low Risk (3-4)</option>
              <option value="5">High Risk (5-7)</option>
              <option value="8">Extreme (8-10)</option>
            </select>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative">
        <FalloutLoreMap
          onSelectLocation={onSelectLocation}
          selectedLocation={selectedLocation}
          activeCombat={activeCombat}
          isCompact={false}
          showFullscreen={true}
          showRoutes={viewMode !== 'lore'}
        />
      </div>

      {/* Enhanced Status Bar */}
      <div className="p-6 bg-black/60 border-t border-amber-500/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Location Info */}
          {selectedLocationData && (
            <div className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
              <h3 className="text-blue-400 font-bold mb-2">Selected Location</h3>
              <div className="space-y-1 text-sm">
                <div className="text-white font-semibold">{selectedLocationData.displayName}</div>
                <div className="text-gray-300">{selectedLocationData.description}</div>
                <div className="flex items-center space-x-4 text-xs">
                  <span className={`${getDangerColor(selectedLocationData.dangerLevel).split(' ')[0]} font-bold`}>
                    Danger: {selectedLocationData.dangerLevel}/10
                  </span>
                  {selectedLocationData.faction && (
                    <span className="text-cyan-400">Faction: {selectedLocationData.faction}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Combat Info */}
          {activeCombat && (
            <div className="bg-black/40 rounded-lg p-4 border border-red-500/30">
              <h3 className="text-red-400 font-bold mb-2">Active Operation</h3>
              <div className="space-y-1 text-sm">
                <div className="text-white">Target: {activeCombat.target.name}</div>
                <div className="text-gray-300">Squad: {activeCombat.assignedSquad.length} operatives</div>
                <div className="text-yellow-400">Phase: {(activeCombat.phase || 'travel').toUpperCase()}</div>
                <div className="text-blue-400">Progress: {Math.round(activeCombat.progress || 0)}%</div>
              </div>
            </div>
          )}

          {/* Map Statistics */}
          <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
            <h3 className="text-green-400 font-bold mb-2">Wasteland Intel</h3>
            <div className="space-y-1 text-sm">
              <div className="text-gray-300">Known Locations: {FALLOUT_LOCATIONS.length}</div>
              <div className="text-gray-300">Established Routes: {WASTELAND_ROUTES.length}</div>
              <div className="text-gray-300">Safe Zones: {FALLOUT_LOCATIONS.filter(l => l.dangerLevel <= 2).length}</div>
              <div className="text-gray-300">Extreme Danger: {FALLOUT_LOCATIONS.filter(l => l.dangerLevel >= 8).length}</div>
            </div>
          </div>
        </div>

        {/* Travel Phase Indicators */}
        {activeCombat && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="grid grid-cols-4 gap-4 text-xs">
              <div className="text-center">
                <div className="text-gray-400">Travel Phase</div>
                <div className="text-yellow-400">Moving through wasteland</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Setup Phase</div>
                <div className="text-blue-400">Establishing positions</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Combat Phase</div>
                <div className="text-red-400">Active engagement</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Return Phase</div>
                <div className="text-green-400">Returning to base</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function getDangerColor(dangerLevel: number) {
    if (dangerLevel <= 2) return 'text-green-400';
    if (dangerLevel <= 4) return 'text-yellow-400';
    if (dangerLevel <= 7) return 'text-orange-400';
    return 'text-red-400';
  }
};

export default LoreAccurateFullMap;