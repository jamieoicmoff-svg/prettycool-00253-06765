import React from 'react';
import { X } from 'lucide-react';
import { FullscreenCaliforniaMap } from './FullscreenCaliforniaMap';
import { CaliforniaLocation } from '@/data/CaliforniaLocations';

interface FullscreenMapProps {
  onClose: () => void;
  onSelectLocation: (locationId: string) => void;
  selectedLocation?: string;
  activeCombat?: {
    target: any;
    startTime: number;
    duration: number;
    assignedSquad: string[];
  };
}

export const FullscreenMap: React.FC<FullscreenMapProps> = ({
  onClose,
  onSelectLocation,
  selectedLocation,
  activeCombat
}) => {
  const handleLocationSelect = (location: CaliforniaLocation) => {
    onSelectLocation(location.id);
  };

  // Calculate squad progress if there's active combat
  const squadProgress = activeCombat ? (() => {
    const elapsed = Date.now() - activeCombat.startTime;
    const totalDuration = activeCombat.duration * 60000;
    return Math.min(100, (elapsed / totalDuration) * 100);
  })() : 0;

  return (
    <FullscreenCaliforniaMap
      isOpen={true}
      onClose={onClose}
      onLocationSelect={handleLocationSelect}
      selectedLocationId={selectedLocation}
      showSquadPosition={!!activeCombat}
      squadProgress={squadProgress}
    />
  );
};

export default FullscreenMap;
