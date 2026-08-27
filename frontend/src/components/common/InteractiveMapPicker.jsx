import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Crosshair, Sparkles, Search, Check } from 'lucide-react';
import { toast } from 'sonner';

// Custom Pin Icon to prevent default Leaflet asset 404s
const customPinIcon = new L.DivIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #10b981, #059669);
      border: 2px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.5);
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Component to handle map clicks and drag events
function LocationMarker({ position, setPosition, onLocationSelected }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      if (onLocationSelected) {
        onLocationSelected(lat, lng);
      }
      map.flyTo([lat, lng], map.getZoom(), { animate: true });
    }
  });

  return position ? (
    <Marker
      position={[position.lat, position.lng]}
      icon={customPinIcon}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const { lat, lng } = marker.getLatLng();
          setPosition({ lat, lng });
          if (onLocationSelected) {
            onLocationSelected(lat, lng);
          }
        }
      }}
    >
      <Popup className="custom-map-popup">
        <div className="text-xs p-1 text-slate-900 font-sans">
          <strong className="text-emerald-700 block font-bold">Selected Problem Location</strong>
          <span className="text-[11px] font-mono text-slate-600">
            Lat: {position.lat.toFixed(5)}, Lng: {position.lng.toFixed(5)}
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5">Drag pin or click map to reposition</p>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

// Controller to smoothly pan map when position changes programmatically
function MapPanController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], zoom || 11, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMapPicker({
  initialLat = 23.3441,
  initialLng = 85.3096,
  districtName = 'Ranchi',
  blockName = '',
  onLocationChange
}) {
  const [position, setPosition] = useState({
    lat: Number(initialLat) || 23.3441,
    lng: Number(initialLng) || 85.3096
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Map tile layer (supports custom API keys from env or OpenStreetMap CartoDB fallback)
  const mapTileUrl = import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const handleLocationUpdate = (lat, lng) => {
    setPosition({ lat, lng });
    if (onLocationChange) {
      onLocationChange({ lat, lng });
    }
  };

  // HTML5 Live GPS Geolocation
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition({ lat, lng });
        handleLocationUpdate(lat, lng);
        setIsDetecting(false);
        toast.success(`GPS Location Locked: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Accuracy: ~${Math.round(pos.coords.accuracy)}m)`);
      },
      (err) => {
        setIsDetecting(false);
        toast.error(`Unable to retrieve GPS: ${err.message}. Defaulting to district centroid.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Quick District Centroid Preset Jumper
  const districtCentroids = {
    ranchi: { lat: 23.3441, lng: 85.3096, name: 'Ranchi' },
    khunti: { lat: 23.0841, lng: 85.2514, name: 'Khunti (Torpa)' },
    dhanbad: { lat: 23.7957, lng: 86.4304, name: 'Dhanbad (Jharia)' },
    east_singhbhum: { lat: 22.8046, lng: 86.2029, name: 'East Singhbhum (Jamshedpur)' },
    west_singhbhum: { lat: 22.5656, lng: 85.8111, name: 'West Singhbhum (Saranda)' },
    hazaribagh: { lat: 23.9967, lng: 85.3688, name: 'Hazaribagh' },
    bokaro: { lat: 23.6693, lng: 86.1511, name: 'Bokaro' },
    deoghar: { lat: 24.4826, lng: 86.7028, name: 'Deoghar' },
    palamu: { lat: 24.0378, lng: 84.0682, name: 'Palamu' },
    latehar: { lat: 23.7431, lng: 84.4983, name: 'Latehar' },
    dumka: { lat: 24.2694, lng: 87.2471, name: 'Dumka' }
  };

  const handleSelectPreset = (key) => {
    const d = districtCentroids[key];
    if (d) {
      setPosition({ lat: d.lat, lng: d.lng });
      handleLocationUpdate(d.lat, d.lng);
      toast.info(`Map centered on ${d.name}`);
    }
  };

  return (
    <div className="space-y-3">
      {/* Top Search & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer hover:scale-105"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Detecting GPS...' : '📍 Auto-Detect My Live GPS'}</span>
          </button>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
            Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
          </span>
        </div>

        {/* Quick District Presets */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 uppercase font-mono mr-1">Centroids:</span>
          {['khunti', 'ranchi', 'dhanbad', 'latehar', 'west_singhbhum'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleSelectPreset(k)}
              className="text-[10.5px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer capitalize font-medium"
            >
              {k.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Leaflet Map Container */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-700 shadow-inner z-0">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={11}
          scrollWheelZoom={false}
          className="w-full h-full"
          style={{ background: '#0b0f19' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={mapTileUrl}
          />
          <MapPanController center={position} zoom={11} />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationSelected={handleLocationUpdate}
          />
        </MapContainer>

        {/* Floating Instruction Badge */}
        <div className="absolute bottom-2 left-2 z-[400] bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-300 flex items-center space-x-1.5 shadow-md pointer-events-none">
          <Crosshair className="w-3 h-3 text-emerald-400" />
          <span>Click on map or drag pin to accurately pinpoint problem site</span>
        </div>
      </div>
    </div>
  );
}
