import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Clock, Users, MapPin, Crosshair, Route, Eye } from 'lucide-react';
import { 
  MOJAVE_MAP_CENTER, 
  ENHANCED_MOJAVE_LOCATIONS, 
  getLocationByIdEnhanced,
  getMarkerIcon,
  getBaseIcon,
  getSquadIcon
} from './GoogleMapsConfig';

interface EnhancedCombatMapProps {
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
}

export const EnhancedCombatMap: React.FC<EnhancedCombatMapProps> = ({ 
  onSelectLocation, 
  selectedLocation, 
  activeCombat,
  onMapClick,
  isCompact = false 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const routeRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const squadMarkerRef = useRef<google.maps.Marker | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string>('travel');
  const [squadPosition, setSquadPosition] = useState<{lat: number, lng: number} | null>(null);

  // Get the base location (Shady Sands)
  const baseLocation = getLocationByIdEnhanced('shady-sands');

  // Calculate progress and phase from active combat
  useEffect(() => {
    if (!activeCombat) {
      setCurrentPhase('travel');
      return;
    }
    
    const elapsed = Date.now() - activeCombat.startTime;
    const totalDuration = activeCombat.duration * 60000;
    const progress = Math.min(100, (elapsed / totalDuration) * 100);
    
    // Calculate phase based on progress
    if (progress < 15) {
      setCurrentPhase('travel');
    } else if (progress < 25) {
      setCurrentPhase('setup');
    } else if (progress < 85) {
      setCurrentPhase('combat');
    } else {
      setCurrentPhase('return');
    }
  }, [activeCombat]);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        // Get API key from localStorage or environment
        const apiKey = localStorage.getItem('google_maps_api_key') || process.env.GOOGLE_MAPS_API_KEY || '';
        
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['geometry', 'places']
        });

        await loader.load();
        
        if (!mapRef.current || !baseLocation) return;

        const map = new google.maps.Map(mapRef.current, {
          center: MOJAVE_MAP_CENTER,
          zoom: isCompact ? 8 : 9,
          mapTypeId: 'terrain',
          styles: [
            {
              featureType: 'all',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#1a365d' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry.fill',
              stylers: [{ color: '#2d3748' }]
            }
          ],
          disableDefaultUI: isCompact,
          gestureHandling: isCompact ? 'none' : 'auto'
        });

        mapInstanceRef.current = map;

        // Clear any existing markers
        markersRef.current.forEach(marker => {
          marker.setMap(null);
        });
        markersRef.current = [];

        // Add base marker
        const baseMarker = new google.maps.Marker({
          position: baseLocation.coordinates,
          map: map,
          title: 'Base - Shady Sands',
          icon: getBaseIcon(),
          zIndex: 1000
        });

        markersRef.current.push(baseMarker);

        // Add location markers
        ENHANCED_MOJAVE_LOCATIONS.forEach(location => {
          if (location.id === 'shady-sands') return; // Skip base location
          
          const marker = new google.maps.Marker({
            position: location.coordinates,
            map: map,
            title: location.displayName,
            icon: getMarkerIcon(location.type, location.dangerLevel, selectedLocation === location.id),
            zIndex: 100
          });

          marker.addListener('click', () => {
            onSelectLocation(location.id);
          });

          markersRef.current.push(marker);
        });

        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to load Google Maps:', err);
        setError('Failed to load maps. Please check your API key.');
      }
    };

    // Only try to load if we have an API key
    const apiKey = localStorage.getItem('google_maps_api_key') || process.env.GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      initMap();
    } else {
      setError('Google Maps API key not configured');
    }

    // Cleanup function
    return () => {
      if (squadMarkerRef.current) {
        squadMarkerRef.current.setMap(null);
        squadMarkerRef.current = null;
      }
      if (routeRendererRef.current) {
        routeRendererRef.current.setMap(null);
        routeRendererRef.current = null;
      }
      markersRef.current.forEach(marker => {
        marker.setMap(null);
      });
      markersRef.current = [];
      if (mapInstanceRef.current) {
        // Don't try to manipulate the DOM directly, just clear the reference
        mapInstanceRef.current = null;
      }
    };
  }, [selectedLocation, onSelectLocation, isCompact, baseLocation]);

  // Update selected location marker
  useEffect(() => {
    markersRef.current.forEach(marker => {
      const title = marker.getTitle();
      const location = ENHANCED_MOJAVE_LOCATIONS.find(loc => loc.displayName === title);
      if (location) {
        marker.setIcon(getMarkerIcon(location.type, location.dangerLevel, selectedLocation === location.id));
      }
    });
  }, [selectedLocation]);

  // Handle active combat visualization
  useEffect(() => {
    if (!mapInstanceRef.current || !activeCombat || !baseLocation) return;

    const destination = getLocationByIdEnhanced(activeCombat.target.location);
    if (!destination) return;

    // Create/update route
    if (!routeRendererRef.current) {
      routeRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: currentPhase === 'return' ? '#22C55E' : '#3B82F6',
          strokeWeight: 4,
          strokeOpacity: 0.7
        }
      });
      routeRendererRef.current.setMap(mapInstanceRef.current);
    }

    // Update route color based on phase
    routeRendererRef.current.setOptions({
      polylineOptions: {
        strokeColor: currentPhase === 'return' ? '#22C55E' : '#3B82F6',
        strokeWeight: 4,
        strokeOpacity: 0.7
      }
    });

    // Get directions
    const directionsService = new google.maps.DirectionsService();
    const origin = currentPhase === 'return' ? destination.coordinates : baseLocation.coordinates;
    const dest = currentPhase === 'return' ? baseLocation.coordinates : destination.coordinates;

    directionsService.route({
      origin: origin,
      destination: dest,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidHighways: true // More realistic for wasteland travel
    }, (result, status) => {
      if (status === 'OK' && result && routeRendererRef.current) {
        routeRendererRef.current.setDirections(result);
        
        // Calculate squad position based on progress
        const route = result.routes[0];
        if (route && route.legs[0]) {
          const progress = activeCombat.progress || 0;
          const leg = route.legs[0];
          const steps = leg.steps;
          
          // Calculate position along route
          let totalDistance = 0;
          let targetDistance = (progress / 100) * leg.distance!.value;
          
          if (currentPhase === 'return') {
            targetDistance = leg.distance!.value - targetDistance; // Reverse for return journey
          }
          
          let currentPosition = { lat: origin.lat, lng: origin.lng };
          
          for (const step of steps) {
            const stepDistance = step.distance!.value;
            if (totalDistance + stepDistance >= targetDistance) {
              // Position is within this step
              const stepProgress = (targetDistance - totalDistance) / stepDistance;
              const path = step.path;
              const pathIndex = Math.floor(stepProgress * (path.length - 1));
              const pathPoint = path[pathIndex];
              currentPosition = { lat: pathPoint.lat(), lng: pathPoint.lng() };
              break;
            }
            totalDistance += stepDistance;
          }
          
          setSquadPosition(currentPosition);
        }
      }
    });

    // Cleanup function for this effect
    return () => {
      if (routeRendererRef.current) {
        routeRendererRef.current.setMap(null);
        routeRendererRef.current = null;
      }
    };
  }, [activeCombat, currentPhase, baseLocation]);

  // Update squad marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (squadMarkerRef.current) {
      squadMarkerRef.current.setMap(null);
      squadMarkerRef.current = null;
    }

    if (squadPosition && activeCombat) {
      squadMarkerRef.current = new google.maps.Marker({
        position: squadPosition,
        map: mapInstanceRef.current,
        title: `Squad - ${currentPhase.toUpperCase()}`,
        icon: getSquadIcon(currentPhase),
        zIndex: 2000,
        animation: currentPhase === 'combat' ? google.maps.Animation.BOUNCE : undefined
      });
    }

    // Cleanup function for this effect
    return () => {
      if (squadMarkerRef.current) {
        squadMarkerRef.current.setMap(null);
        squadMarkerRef.current = null;
      }
    };
  }, [squadPosition, currentPhase, activeCombat]);

  // Calculate time remaining
  const getTimeRemaining = useCallback(() => {
    if (!activeCombat) return '';
    const elapsed = Date.now() - activeCombat.startTime;
    const totalDuration = activeCombat.duration * 60000;
    const remaining = Math.max(0, totalDuration - elapsed);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [activeCombat]);

  const getProgress = useCallback(() => {
    if (!activeCombat) return 0;
    const elapsed = Date.now() - activeCombat.startTime;
    const totalDuration = activeCombat.duration * 60000;
    return Math.min(100, (elapsed / totalDuration) * 100);
  }, [activeCombat]);

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm rounded-xl border border-red-500/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Crosshair className="w-5 h-5 text-red-400" />
            <h3 className="text-red-400 font-bold">Combat Operations Map</h3>
          </div>
        </div>
        <div className="text-center text-gray-400 py-8">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">Using fallback map display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-5 h-5 text-red-400" />
          <h3 className="text-red-400 font-bold">Combat Operations Map</h3>
        </div>
        {onMapClick && !isCompact && (
          <button
            onClick={onMapClick}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">Full Map</span>
          </button>
        )}
      </div>

      {/* Active Combat Info */}
      {activeCombat && (
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
          <div className="text-center">
            <div className="text-gray-400">Progress</div>
            <div className="text-green-400 font-bold">{Math.round(getProgress())}%</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">ETA</div>
            <div className="text-blue-400 font-bold">{getTimeRemaining()}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Phase</div>
            <div className={`font-bold ${
              currentPhase === 'travel' ? 'text-yellow-400' :
              currentPhase === 'setup' ? 'text-blue-400' :
              currentPhase === 'combat' ? 'text-red-400' : 'text-green-400'
            }`}>
              {currentPhase.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef}
        className={`relative w-full rounded-lg overflow-hidden border border-amber-500/30 ${
          isCompact ? 'h-48' : 'h-96'
        } ${onMapClick ? 'cursor-pointer hover:border-amber-400/50 transition-colors' : ''}`}
        onClick={onMapClick}
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Loading Mojave Map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="mt-3 text-xs">
          {(() => {
            const location = getLocationByIdEnhanced(selectedLocation);
            if (!location) return null;
            return (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-gray-400">Target</div>
                  <div className="text-white">{location.displayName}</div>
                </div>
                <div>
                  <div className="text-gray-400">Danger Level</div>
                  <div className={`font-bold ${
                    location.dangerLevel > 7 ? 'text-red-400' :
                    location.dangerLevel > 4 ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    {location.dangerLevel}/10
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-400">Description</div>
                  <div className="text-white text-xs">{location.description}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default EnhancedCombatMap;