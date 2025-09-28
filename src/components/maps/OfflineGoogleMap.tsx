import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation, Satellite, Layers, Crosshair } from 'lucide-react';
import KMZParser, { KMZLocation } from '@/utils/KMZParser';
import falloutKmzFile from '@/assets/fallout-universe-data.kmz?url';

// Fallout Mojave region bounds (approximate)
const MOJAVE_BOUNDS = {
  north: 37.5,
  south: 35.0,
  east: -114.0,
  west: -117.5
};

const MOJAVE_CENTER = {
  lat: 36.25,
  lng: -115.75
};

interface OfflineGoogleMapProps {
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
  onMapClick?: () => void;
  isCompact?: boolean;
  showFullscreen?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

export const OfflineGoogleMap: React.FC<OfflineGoogleMapProps> = ({
  onSelectLocation,
  selectedLocation,
  activeCombat,
  onMapClick,
  isCompact = false,
  showFullscreen = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const squadMarkerRef = useRef<any>(null);
  const routeRendererRef = useRef<any>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [locations, setLocations] = useState<KMZLocation[]>([]);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('terrain');
  const [squadPosition, setSquadPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Load Google Maps API without API key (limited functionality)
  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google) {
        setIsLoaded(true);
        return;
      }

      try {
        // Load Google Maps without API key (limited to localhost/development)
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setIsLoaded(true);
        };
        
        script.onerror = () => {
          console.warn('Google Maps failed to load, using fallback');
          // Will fall back to static map implementation
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.warn('Google Maps not available:', error);
      }
    };

    loadGoogleMaps();
  }, []);

  // Parse KMZ file and extract locations
  useEffect(() => {
    const parseKMZData = async () => {
      try {
        const response = await fetch(falloutKmzFile);
        const arrayBuffer = await response.arrayBuffer();
        
        const parser = KMZParser.getInstance();
        const { locations: parsedLocations } = await parser.parseKMZFile(arrayBuffer);
        
        console.log('Parsed locations from KMZ:', parsedLocations);
        setLocations(parsedLocations);
      } catch (error) {
        console.error('Failed to parse KMZ file:', error);
        // Fall back to default locations if KMZ parsing fails
        setLocations([]);
      }
    };

    parseKMZData();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !window.google || !mapRef.current) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: MOJAVE_CENTER,
        zoom: isCompact ? 8 : 10,
        mapTypeId: mapType,
        restriction: {
          latLngBounds: MOJAVE_BOUNDS,
          strictBounds: false
        },
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'simplified' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#1a365d' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry.fill',
            stylers: [{ color: '#2d1810' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#8B4513', weight: 1 }]
          }
        ],
        disableDefaultUI: isCompact,
        gestureHandling: isCompact ? 'none' : 'auto'
      });

      mapInstanceRef.current = map;

      // Add click handler for full map
      if (onMapClick) {
        map.addListener('click', onMapClick);
      }

      console.log('Google Maps initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Maps:', error);
    }
  }, [isLoaded, mapType, isCompact, onMapClick]);

  // Add location markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || locations.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add Shady Sands base marker
    const baseMarker = new window.google.maps.Marker({
      position: { lat: 36.2, lng: -115.8 }, // Approximate Shady Sands location
      map: mapInstanceRef.current,
      title: 'Shady Sands - Base',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-family="Arial">🏠</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32)
      },
      zIndex: 1000
    });

    markersRef.current.push(baseMarker);

    // Add KMZ locations
    locations.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: location.coordinates,
        map: mapInstanceRef.current,
        title: location.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="${getDangerColor(location.dangerLevel)}" stroke="#000" stroke-width="1"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-family="Arial">${location.dangerLevel}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24)
        },
        zIndex: selectedLocation === location.id ? 999 : 100
      });

      // Add click handler
      marker.addListener('click', () => {
        onSelectLocation(location.id);
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="color: black; font-family: Arial;">
            <h4 style="margin: 0 0 8px 0;">${location.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 12px;">${location.description}</p>
            <div style="font-size: 11px;">
              <strong>Type:</strong> ${location.type}<br>
              <strong>Danger:</strong> ${location.dangerLevel}/10<br>
              ${location.faction ? `<strong>Faction:</strong> ${location.faction}<br>` : ''}
              ${location.population ? `<strong>Population:</strong> ${location.population}<br>` : ''}
            </div>
          </div>
        `
      });

      marker.addListener('mouseover', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
      });

      markersRef.current.push(marker);
    });
  }, [locations, selectedLocation, onSelectLocation]);

  // Handle active combat visualization
  useEffect(() => {
    if (!mapInstanceRef.current || !activeCombat || !window.google) return;

    const targetLocation = locations.find(loc => 
      loc.name.toLowerCase().includes(activeCombat.target.location?.toLowerCase())
    );

    if (!targetLocation) return;

    const basePosition = { lat: 36.2, lng: -115.8 }; // Shady Sands
    const progress = activeCombat.progress || 0;
    const phase = activeCombat.phase || 'travel';

    // Calculate squad position based on progress and phase
    let currentPosition;
    
    if (phase === 'return') {
      // Returning to base
      const returnProgress = progress > 85 ? (progress - 85) / 15 : 0;
      currentPosition = {
        lat: targetLocation.coordinates.lat + (basePosition.lat - targetLocation.coordinates.lat) * returnProgress,
        lng: targetLocation.coordinates.lng + (basePosition.lng - targetLocation.coordinates.lng) * returnProgress
      };
    } else if (phase === 'combat') {
      // Stay at destination during combat
      currentPosition = targetLocation.coordinates;
    } else {
      // Travel/setup phase
      currentPosition = {
        lat: basePosition.lat + (targetLocation.coordinates.lat - basePosition.lat) * (progress / 100),
        lng: basePosition.lng + (targetLocation.coordinates.lng - basePosition.lng) * (progress / 100)
      };
    }

    setSquadPosition(currentPosition);

    // Update squad marker
    if (squadMarkerRef.current) {
      squadMarkerRef.current.setMap(null);
    }

    squadMarkerRef.current = new window.google.maps.Marker({
      position: currentPosition,
      map: mapInstanceRef.current,
      title: `Squad - ${phase.toUpperCase()}`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="${getPhaseColor(phase)}" stroke="#000" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-size="10" font-family="Arial">${getPhaseIcon(phase)}</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32)
      },
      zIndex: 2000,
      animation: phase === 'combat' ? window.google.maps.Animation.BOUNCE : null
    });

    // Draw route
    if (!routeRendererRef.current) {
      routeRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: phase === 'return' ? '#22C55E' : '#3B82F6',
          strokeWeight: 4,
          strokeOpacity: 0.7
        }
      });
      routeRendererRef.current.setMap(mapInstanceRef.current);
    }

    const directionsService = new window.google.maps.DirectionsService();
    const origin = phase === 'return' ? targetLocation.coordinates : basePosition;
    const destination = phase === 'return' ? basePosition : targetLocation.coordinates;

    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
      avoidHighways: true
    }, (result: any, status: any) => {
      if (status === 'OK' && result && routeRendererRef.current) {
        routeRendererRef.current.setDirections(result);
      }
    });
  }, [activeCombat, locations]);

  const getDangerColor = (level: number): string => {
    if (level <= 2) return '#10B981'; // Green
    if (level <= 4) return '#F59E0B'; // Yellow
    if (level <= 7) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'travel': return '#F59E0B';
      case 'setup': return '#3B82F6';
      case 'combat': return '#EF4444';
      case 'return': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPhaseIcon = (phase: string): string => {
    switch (phase) {
      case 'travel': return '🚶';
      case 'setup': return '🎯';
      case 'combat': return '⚔️';
      case 'return': return '🏃';
      default: return '📍';
    }
  };

  // Fallback to static map if Google Maps fails
  if (!isLoaded || !window.google) {
    return (
      <div className={`relative ${showFullscreen ? 'h-screen' : isCompact ? 'h-48' : 'h-96'} 
        bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden flex items-center justify-center`}>
        <div className="text-center text-gray-400">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Loading Interactive Map...</p>
          <p className="text-xs mt-1">Parsing location data from KMZ file...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${showFullscreen ? 'h-screen' : isCompact ? 'h-48' : 'h-96'} 
      bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden`}>
      
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full cursor-pointer"
        onClick={onMapClick}
      />
      
      {/* Map Controls */}
      {!isCompact && (
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <button
            onClick={() => setMapType('terrain')}
            className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
              mapType === 'terrain' 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-black/40 text-gray-400 border border-gray-500/30 hover:text-white'
            }`}
            title="Terrain View"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapType('roadmap')}
            className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
              mapType === 'roadmap' 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-black/40 text-gray-400 border border-gray-500/30 hover:text-white'
            }`}
            title="Road View"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
              mapType === 'satellite' 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-black/40 text-gray-400 border border-gray-500/30 hover:text-white'
            }`}
            title="Satellite View"
          >
            <Satellite className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Map Info */}
      {!isCompact && (
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30">
          <h3 className="text-amber-400 font-bold flex items-center mb-2">
            <Crosshair className="mr-2" size={16} />
            Mojave Wasteland
          </h3>
          <div className="text-xs text-gray-300 space-y-1">
            <div>📍 {locations.length} KMZ Locations</div>
            {activeCombat && (
              <>
                <div className="text-red-400">⚔️ Combat Active</div>
                <div className="text-blue-400">👥 {activeCombat.assignedSquad.length} Operatives</div>
              </>
            )}
            <div className="text-green-400">🗺️ Real Map Data</div>
          </div>
        </div>
      )}

      {/* Selected Location Details */}
      {selectedLocation && !isCompact && (
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30 max-w-xs">
          {(() => {
            const location = locations.find(loc => loc.id === selectedLocation);
            if (!location) return null;
            return (
              <div className="text-xs text-gray-300">
                <div className="text-amber-400 font-semibold mb-1">{location.name}</div>
                <div className="mb-2">{location.description}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400">Danger:</span>
                    <span className={`ml-1 font-semibold`} style={{ color: getDangerColor(location.dangerLevel) }}>
                      {location.dangerLevel}/10
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-1 text-purple-400">{location.type}</span>
                  </div>
                </div>
                {location.faction && (
                  <div className="mt-1">
                    <span className="text-gray-400">Faction:</span>
                    <span className="ml-1 text-blue-400">{location.faction}</span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default OfflineGoogleMap;