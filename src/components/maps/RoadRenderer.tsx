import React from 'react';
import { RoadSegment } from '@/data/CaliforniaRoads';
import { CaliforniaLocation } from '@/data/CaliforniaLocations';

interface RoadRendererProps {
  roads: RoadSegment[];
  locations: CaliforniaLocation[];
  coordToPixel: (coord: { x: number; y: number }) => { x: number; y: number };
  activeRoute?: string[];
  hoveredRoadId: string | null;
  onRoadHover: (roadId: string | null) => void;
}

export const RoadRenderer: React.FC<RoadRendererProps> = ({
  roads,
  locations,
  coordToPixel,
  activeRoute = [],
  hoveredRoadId,
  onRoadHover
}) => {
  // Get road color based on condition and state
  const getRoadColor = (road: RoadSegment, isActive: boolean, isHovered: boolean) => {
    if (isActive) return '#fbbf24'; // amber-400 for active route
    if (isHovered) return '#60a5fa'; // blue-400 for hover
    
    switch (road.condition) {
      case 'good': return '#22c55e'; // green-500
      case 'damaged': return '#f59e0b'; // amber-500
      case 'dangerous': return '#ef4444'; // red-500
      default: return '#6b7280'; // gray-500
    }
  };

  // Get road width based on type
  const getRoadWidth = (roadType: RoadSegment['roadType'], isActive: boolean, isHovered: boolean) => {
    const baseWidth = roadType === 'interstate' ? 3 : roadType === 'highway' ? 2 : 1.5;
    if (isActive) return baseWidth * 1.8;
    if (isHovered) return baseWidth * 1.5;
    return baseWidth;
  };

  // Create path with Bezier curves
  const createRoadPath = (fromPos: {x: number; y: number}, toPos: {x: number; y: number}, curvePoints?: {x: number; y: number}[]) => {
    if (!curvePoints || curvePoints.length === 0) {
      // Straight line
      return `M ${fromPos.x},${fromPos.y} L ${toPos.x},${toPos.y}`;
    }
    
    // Bezier curve with control points
    if (curvePoints.length === 1) {
      const cp = coordToPixel(curvePoints[0]);
      return `M ${fromPos.x},${fromPos.y} Q ${cp.x},${cp.y} ${toPos.x},${toPos.y}`;
    } else if (curvePoints.length === 2) {
      const cp1 = coordToPixel(curvePoints[0]);
      const cp2 = coordToPixel(curvePoints[1]);
      return `M ${fromPos.x},${fromPos.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${toPos.x},${toPos.y}`;
    }
    
    return `M ${fromPos.x},${fromPos.y} L ${toPos.x},${toPos.y}`;
  };

  return (
    <g className="roads-layer">
      {roads.map(road => {
        const fromLocation = locations.find(loc => loc.id === road.fromLocationId);
        const toLocation = locations.find(loc => loc.id === road.toLocationId);
        
        if (!fromLocation || !toLocation) return null;
        
        const fromPos = coordToPixel(fromLocation.coordinates);
        const toPos = coordToPixel(toLocation.coordinates);
        
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
                strokeWidth={width + 6}
                fill="none"
                opacity="0.3"
                className="pointer-events-none"
              />
            )}

            {/* Main road path */}
            <path
              d={pathData}
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
              fill="none"
              opacity={isActive ? 1 : 0.7}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => onRoadHover(road.id)}
              onMouseLeave={() => onRoadHover(null)}
            />

            {/* Road dashes for damaged/dangerous roads */}
            {road.condition !== 'good' && !isActive && (
              <path
                d={pathData}
                stroke="#1a1a1a"
                strokeWidth={width * 0.3}
                strokeDasharray={road.condition === 'damaged' ? '5,5' : '3,3'}
                strokeLinecap="round"
                fill="none"
                className="pointer-events-none"
              />
            )}

            {/* Invisible wider hitbox for easier hovering */}
            <path
              d={pathData}
              stroke="transparent"
              strokeWidth={Math.max(width + 10, 15)}
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
                y={(fromPos.y + toPos.y) / 2 - 5}
                textAnchor="middle"
                className="fill-foreground text-xs font-semibold pointer-events-none"
                style={{ textShadow: '0 0 4px #000, 0 0 4px #000' }}
              >
                {road.name}
              </text>
            )}

            {/* Distance label (show on hover) */}
            {isHovered && (
              <text
                x={(fromPos.x + toPos.x) / 2}
                y={(fromPos.y + toPos.y) / 2 + 12}
                textAnchor="middle"
                className="fill-muted-foreground text-xs pointer-events-none"
                style={{ textShadow: '0 0 4px #000' }}
              >
                {road.distanceMiles} mi • {road.condition} • Danger: {road.dangerLevel}/10
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};
