import React from 'react';
import { Route, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { RoadSegment } from '@/data/CaliforniaRoads';
import { getCaliforniaLocationById } from '@/data/CaliforniaLocations';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RoadInfoPanelProps {
  road: RoadSegment;
  onClose?: () => void;
}

export const RoadInfoPanel: React.FC<RoadInfoPanelProps> = ({ road, onClose }) => {
  const fromLocation = getCaliforniaLocationById(road.fromLocationId);
  const toLocation = getCaliforniaLocationById(road.toLocationId);

  const getRoadTypeColor = () => {
    switch (road.roadType) {
      case 'interstate': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'highway': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'minor': return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getConditionColor = () => {
    switch (road.condition) {
      case 'good': return 'text-green-400';
      case 'damaged': return 'text-yellow-400';
      case 'dangerous': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConditionIcon = () => {
    switch (road.condition) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'damaged': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'dangerous': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-background/95 backdrop-blur-sm border-border p-4 max-w-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Route className="w-5 h-5 text-primary" />
            {road.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={getRoadTypeColor()}>
              {road.roadType.toUpperCase()}
            </Badge>
            {road.name.includes('I-') && (
              <Badge variant="secondary" className="text-xs">
                Based on real {road.name.split(' -')[0]}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">From:</span>
          <span className="text-foreground font-semibold">{fromLocation?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">To:</span>
          <span className="text-foreground font-semibold">{toLocation?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Distance:</span>
          <span className="text-foreground font-semibold">{road.distanceMiles} miles</span>
        </div>
      </div>

      {/* Condition */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {getConditionIcon()}
          <div>
            <div className="text-xs text-muted-foreground">Road Condition</div>
            <div className={`text-sm font-semibold ${getConditionColor()} capitalize`}>
              {road.condition}
            </div>
          </div>
        </div>
        
        {road.condition === 'dangerous' && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded px-2 py-1">
            ⚠️ This route is extremely dangerous or impassable
          </p>
        )}
        {road.condition === 'damaged' && (
          <p className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded px-2 py-1">
            ⚠️ This route may slow travel significantly
          </p>
        )}
      </div>

      {/* Landmarks */}
      {road.landmarks && road.landmarks.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-2">Landmarks</div>
          <div className="flex flex-wrap gap-2">
            {road.landmarks.map((landmark, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="text-xs"
              >
                {landmark}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Travel Notes */}
      {(road.roadType === 'interstate' || road.condition === 'good') && (
        <div className="mt-3 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded px-2 py-1">
          💡 This route is relatively safe and fast for travel
        </div>
      )}
    </Card>
  );
};
