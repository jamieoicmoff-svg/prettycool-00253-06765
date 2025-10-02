import React from 'react';
import { MapPin, AlertTriangle, Mountain, Building, Users, Skull } from 'lucide-react';
import { CaliforniaLocation } from '@/data/CaliforniaLocations';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LocationInfoPanelProps {
  location: CaliforniaLocation;
  onClose?: () => void;
}

export const LocationInfoPanel: React.FC<LocationInfoPanelProps> = ({ location, onClose }) => {
  const getTerrainIcon = () => {
    switch (location.terrain) {
      case 'mountains': return <Mountain className="w-4 h-4" />;
      case 'urban': return <Building className="w-4 h-4" />;
      case 'ruins': return <Building className="w-4 h-4" />;
      case 'desert': return <Mountain className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getDangerColor = () => {
    if (location.dangerLevel >= 8) return 'text-red-400';
    if (location.dangerLevel >= 5) return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <Card className="bg-background/95 backdrop-blur-sm border-border p-4 max-w-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            {location.discovered ? location.name : 'Unknown Location'}
            {location.id === 'player-outpost' && (
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                YOUR BASE
              </Badge>
            )}
          </h3>
          <p className="text-xs text-muted-foreground capitalize">{location.type}</p>
        </div>
      </div>

      {!location.discovered ? (
        <p className="text-sm text-muted-foreground">
          This location has not been discovered yet. Send a squad on a mission to explore it.
        </p>
      ) : (
        <>
          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4">{location.description}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Distance */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-muted-foreground">Distance</div>
                <div className="text-sm font-semibold text-foreground">{location.distanceFromHome} mi</div>
              </div>
            </div>

            {/* Danger Level */}
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${getDangerColor()}`} />
              <div>
                <div className="text-xs text-muted-foreground">Danger</div>
                <div className={`text-sm font-semibold ${getDangerColor()}`}>{location.dangerLevel}/10</div>
              </div>
            </div>

            {/* Terrain */}
            <div className="flex items-center gap-2">
              {getTerrainIcon()}
              <div>
                <div className="text-xs text-muted-foreground">Terrain</div>
                <div className="text-sm font-semibold text-foreground capitalize">{location.terrain}</div>
              </div>
            </div>

            {/* Type-specific info */}
            {location.type === 'combat' && (
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-400" />
                <div>
                  <div className="text-xs text-muted-foreground">Hostiles</div>
                  <div className="text-sm font-semibold text-red-400">Active</div>
                </div>
              </div>
            )}

            {location.type === 'settlement' && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs text-muted-foreground">Population</div>
                  <div className="text-sm font-semibold text-foreground">Unknown</div>
                </div>
              </div>
            )}
          </div>

          {/* Faction Info */}
          {location.faction && (
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-1">Controlling Faction</div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {location.faction}
              </Badge>
            </div>
          )}

          {/* Pre-War Buildings */}
          {location.preWarBuildings && location.preWarBuildings.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">Pre-War Structures</div>
              <div className="flex flex-wrap gap-2">
                {location.preWarBuildings.map((building, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="text-xs bg-secondary/50"
                  >
                    <Building className="w-3 h-3 mr-1" />
                    {building}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
