import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { GeocodingResult } from '../utils/distanceCalculator';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default marker icons
const DefaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icons for origin and destination
const OriginIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'origin-marker'
});

const DestinationIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'destination-marker'
});

interface MapDisplayProps {
  originCoords?: GeocodingResult;
  destinationCoords?: GeocodingResult;
  routePolyline?: [number, number][];
  originAddress?: string;
  destinationAddress?: string;
  height?: string;
  className?: string;
}

// Component to fit map bounds to markers and route
const FitBounds: React.FC<{ 
  originCoords?: GeocodingResult; 
  destinationCoords?: GeocodingResult;
  routePolyline?: [number, number][];
}> = ({
  originCoords,
  destinationCoords,
  routePolyline
}) => {
  const map = useMap();

  useEffect(() => {
    if (routePolyline && routePolyline.length > 0) {
      // If we have a route polyline, fit bounds to include the entire route
      const bounds = new LatLngBounds(routePolyline);
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (originCoords && destinationCoords) {
      // If we have both markers but no route, fit bounds to markers
      const bounds = new LatLngBounds(
        [originCoords.lat, originCoords.lng],
        [destinationCoords.lat, destinationCoords.lng]
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (originCoords) {
      map.setView([originCoords.lat, originCoords.lng], 13);
    } else if (destinationCoords) {
      map.setView([destinationCoords.lat, destinationCoords.lng], 13);
    }
  }, [map, originCoords, destinationCoords, routePolyline]);

  return null;
};

const MapDisplay: React.FC<MapDisplayProps> = ({
  originCoords,
  destinationCoords,
  routePolyline,
  originAddress = 'Origine',
  destinationAddress = 'Destinazione',
  height = '400px',
  className = ''
}) => {
  const mapRef = useRef<any>(null);

  // Default center (Treviso, Italy)
  const defaultCenter: [number, number] = [45.6669, 12.2430];
  const defaultZoom = 10;

  // Determine map center and zoom
  const getMapCenter = (): [number, number] => {
    if (originCoords && destinationCoords) {
      // Center between origin and destination
      const centerLat = (originCoords.lat + destinationCoords.lat) / 2;
      const centerLng = (originCoords.lng + destinationCoords.lng) / 2;
      return [centerLat, centerLng];
    } else if (originCoords) {
      return [originCoords.lat, originCoords.lng];
    } else if (destinationCoords) {
      return [destinationCoords.lat, destinationCoords.lng];
    }
    return defaultCenter;
  };

  const hasMarkers = originCoords || destinationCoords;
  const hasRoute = routePolyline && routePolyline.length > 0;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium text-gray-700">Visualizzazione Percorso</span>
          </div>
          {hasRoute && (
            <div className="flex items-center space-x-1 text-xs text-teal-600">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span>Percorso calcolato</span>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ height }} className="relative">
        {!hasMarkers && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                Inserisci gli indirizzi e calcola la distanza per visualizzare il percorso
              </p>
            </div>
          </div>
        )}
        
        <MapContainer
          ref={mapRef}
          center={getMapCenter()}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route polyline */}
          {hasRoute && (
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: '#3b82f6',
                weight: 4,
                opacity: 0.8,
                dashArray: '0',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          )}
          
          {originCoords && (
            <Marker 
              position={[originCoords.lat, originCoords.lng]} 
              icon={OriginIcon}
            >
              <Popup>
                <div className="text-sm">
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Partenza</span>
                  </div>
                  <p className="text-gray-600">{originAddress}</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {destinationCoords && (
            <Marker 
              position={[destinationCoords.lat, destinationCoords.lng]} 
              icon={DestinationIcon}
            >
              <Popup>
                <div className="text-sm">
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Destinazione</span>
                  </div>
                  <p className="text-gray-600">{destinationAddress}</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          <FitBounds 
            originCoords={originCoords} 
            destinationCoords={destinationCoords}
            routePolyline={routePolyline}
          />
        </MapContainer>
      </div>
      
      {hasMarkers && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              {originCoords && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Partenza</span>
                </div>
              )}
              {destinationCoords && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Destinazione</span>
                </div>
              )}
              {hasRoute && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>Percorso</span>
                </div>
              )}
            </div>
            <span>Mappa fornita da OpenStreetMap</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;