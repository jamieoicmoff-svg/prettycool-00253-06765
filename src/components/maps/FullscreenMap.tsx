import React, { useState } from 'react';
import { X, Map, Layers, Navigation, Eye } from 'lucide-react';
import { OfflineFalloutMap } from './OfflineFalloutMap';

interface FullscreenMapProps {
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

export const FullscreenMap: React.FC<FullscreenMapProps> = ({
  onClose,
  onSelectLocation,
  selectedLocation,
  activeCombat
}) => {
  const [viewMode, setViewMode] = useState<'terrain' | 'tactical'>('terrain');

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/40 border-b border-amber-500/20">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-amber-400 flex items-center">
            <Map className="w-6 h-6 mr-2" />
            Mojave Wasteland - Tactical Overview
          </h2>
          
          {/* View Mode Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('terrain')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'terrain' 
                  ? 'bg-amber-500/20 text-amber-400' 
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
              title="Terrain View"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tactical')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'tactical' 
                  ? 'bg-amber-500/20 text-amber-400' 
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
              title="Tactical View"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative">
        <OfflineFalloutMap
          onSelectLocation={onSelectLocation}
          selectedLocation={selectedLocation}
          activeCombat={activeCombat}
          isCompact={false}
          showFullscreen={true}
        />
      </div>

      {/* Status Bar */}
      <div className="p-4 bg-black/40 border-t border-amber-500/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Safe Zone (1-2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">Low Risk (3-4)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-300">High Risk (5-7)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">Extreme (8-10)</span>
          </div>
        </div>
        
        {activeCombat && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="grid grid-cols-4 gap-4 text-xs">
              <div className="text-center">
                <div className="text-gray-400">Travel Phase</div>
                <div className="text-yellow-400">Moving to target</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Setup Phase</div>
                <div className="text-blue-400">Preparing for combat</div>
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
};

export default FullscreenMap;