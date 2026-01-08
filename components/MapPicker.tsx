
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Coordinates } from '../types';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  initialCenter?: Coordinates;
  onLocationSelect: (coords: Coordinates, address?: string) => void;
  interactive?: boolean;
}

const LocationMarker = ({ position, onMove }: { position: Coordinates, onMove: (pos: Coordinates) => void }) => {
  const markerRef = useRef<L.Marker>(null);
  
  const eventHandlers = React.useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        onMove(marker.getLatLng());
      }
    },
  }), [onMove]);

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
};

const MapEvents = ({ onMapClick }: { onMapClick: (pos: Coordinates) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const ChangeView = ({ center }: { center: Coordinates }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const MapPicker: React.FC<MapPickerProps> = ({ 
  initialCenter = { lat: 20.5937, lng: 78.9629 }, // Center of India
  onLocationSelect,
  interactive = true 
}) => {
  const [position, setPosition] = useState<Coordinates>(initialCenter);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const newCoords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        setPosition(newCoords);
        onLocationSelect(newCoords, data[0].display_name);
      }
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleLocationUpdate = async (coords: Coordinates) => {
    setPosition(coords);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
      const data = await response.json();
      onLocationSelect(coords, data.display_name);
    } catch (error) {
      onLocationSelect(coords);
    }
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border border-gray-200">
      {interactive && (
        <div className="absolute top-2 left-2 z-[1000] flex gap-2 w-2/3 md:w-1/2">
          <input
            type="text"
            className="flex-grow px-3 py-2 text-sm border rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Search city/area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white px-3 py-2 rounded shadow-md hover:bg-blue-700"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      )}
      
      <MapContainer center={position} zoom={interactive ? 13 : 15} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={position} />
        {interactive ? (
          <>
            <MapEvents onMapClick={handleLocationUpdate} />
            <LocationMarker position={position} onMove={handleLocationUpdate} />
          </>
        ) : (
          <Marker position={position} />
        )}
      </MapContainer>
    </div>
  );
};
