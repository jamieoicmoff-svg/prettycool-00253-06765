import React from 'react';
import { RoadSegment } from '@/data/CaliforniaRoads';
import { CaliforniaLocation } from '@/data/CaliforniaLocations';

interface RoadRendererProps {
  roads: RoadSegment[];
  locations: CaliforniaLocation[];
  activeRoute?: string[];
  hoveredRoadId: string | null;
  onRoadHover: (roadId: string | null) => void;
}

export const RoadRenderer: React.FC<RoadRendererProps> = ({
  roads,
  locations,
  activeRoute = [],
  hoveredRoadId,
  onRoadHover
}) => {
  // Get road color based on type and condition
  const getRoadColor = (road: RoadSegment, isActive: boolean, isHovered: boolean) => {
    if (isActive) return '#fbbf24'; // amber-400 for active route
    if (isHovered) return '#60a5fa'; // blue-400 for hover
    
    // Color by road type
    switch (road.roadType) {
      case 'interstate': return '#f59e0b'; // amber-500 (yellow highways)
      case 'highway': return '#fb923c'; // orange-400
      case 'minor': return '#92400e'; // brown-800
      default: return '#6b7280'; // gray-500
    }
  };

  // Get road width based on type
  const getRoadWidth = (roadType: RoadSegment['roadType'], isActive: boolean, isHovered: boolean) => {
    let baseWidth: number;
    switch (roadType) {
      case 'interstate': baseWidth = 0.4; break;
      case 'highway': baseWidth = 0.3; break;
      case 'minor': baseWidth = 0.2; break;
      default: baseWidth = 0.2;
    }
    
    if (isActive) return baseWidth * 1.8;
    if (isHovered) return baseWidth * 1.5;
    return baseWidth;
  };

  // Create path with Bezier curves using percentage coordinates
  const createRoadPath = (
    fromPos: {x: number; y: number}, 
    toPos: {x: number; y: number}, 
    curvePoints?: {x: number; y: number}[]
  ) => {
    if (!curvePoints || curvePoints.length === 0) {
      // Straight line
      return `M ${fromPos.x},${fromPos.y} L ${toPos.x},${toPos.y}`;
    }
    
    // Bezier curve with control points
    if (curvePoints.length === 1) {
      const cp = curvePoints[0];
      return `M ${fromPos.x},${fromPos.y} Q ${cp.x},${cp.y} ${toPos.x},${toPos.y}`;
    } else if (curvePoints.length === 2) {
      const cp1 = curvePoints[0];
      const cp2 = curvePoints[1];
      return `M ${fromPos.x},${fromPos.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${toPos.x},${toPos.y}`;
    }
    
    return `M ${fromPos.x},${fromPos.y} L ${toPos.x},${toPos.y}`;
  };

  return (
    <g className="roads-layer">
      {/* Render roads in order: minor, highway, interstate (so interstates appear on top) */}
      {['minor', 'highway', 'interstate'].map(roadType => 
        roads
          .filter(road => road.roadType === roadType)
          .map(road => {
            const fromLocation = locations.find(loc => loc.id === road.fromLocationId);
            const toLocation = locations.find(loc => loc.id === road.toLocationId);
            
            if (!fromLocation || !toLocation) return null;
            
            const fromPos = fromLocation.coordinates;
            const toPos = toLocation.coordinates;
            
            const isActive = activeRoute.includes(road.id);
            const isHovered = hoveredRoadId === road.id;
            const color = getRoadColor(road, isActive, isHovered);
            const width = getRoadWidth(road.roadType, isActive, isHovered);
            
            const pathData = createRoadPath(fromPos, toPos, road.curveControlPoints);

            return (
              <g key={road.id}>
                {/* Glow effect for active/hovered roads */}
                {(isActive || isHovered) && (
                  <path
                    d={pathData}
                    stroke={color}
                    strokeWidth={width + 0.6}
                    fill="none"
                    opacity="0.3"
                    className="pointer-events-none"
                    style={{ filter: 'blur(0.5px)' }}
                  />
                )}

                {/* Main road path */}
                <path
                  d={pathData}
                  stroke={color}
                  strokeWidth={width}
                  strokeLinecap="round"
                  fill="none"
                  opacity={isActive ? 1 : isHovered ? 0.9 : 0.7}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => onRoadHover(road.id)}
                  onMouseLeave={() => onRoadHover(null)}
                />

                {/* Road condition overlay (dashes for damaged/dangerous) */}
                {road.condition !== 'good' && !isActive && (
                  <path
                    d={pathData}
                    stroke="#1a1a1a"
                    strokeWidth={width * 0.3}
                    strokeDasharray={road.condition === 'damaged' ? '1,1' : '0.5,0.5'}
                    strokeLinecap="round"
                    fill="none"
                    className="pointer-events-none"
                  />
                )}

                {/* Invisible wider hitbox for easier hovering */}
                <path
                  d={pathData}
                  stroke="transparent"
                  strokeWidth={Math.max(width + 2, 3)}
                  strokeLinecap="round"
                  fill="none"
                  className="cursor-pointer"
                  onMouseEnter={() => onRoadHover(road.id)}
                  onMouseLeave={() => onRoadHover(null)}
                />

                {/* Road name label (show on hover or if active) */}
                {(isHovered || isActive) && (
                  <text
                    x={(fromPos.x + toPos.x) / 2}
                    y={(fromPos.y + toPos.y) / 2 - 1}
                    textAnchor="middle"
                    className="fill-foreground text-[1.2px] font-semibold pointer-events-none"
                    style={{ textShadow: '0 0 2px #000, 0 0 4px #000' }}
                  >
                    {road.name}
                  </text>
                )}

                {/* Distance label (show on hover) */}
                {isHovered && (
                  <text
                    x={(fromPos.x + toPos.x) / 2}
                    y={(fromPos.y + toPos.y) / 2 + 2}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[1px] pointer-events-none"
                    style={{ textShadow: '0 0 2px #000' }}
                  >
                    {road.distanceMiles} mi • {road.condition} • Danger: {road.dangerLevel}/10
                  </text>
                )}
              </g>
            );
          })
      )}
    </g>
  );
};
