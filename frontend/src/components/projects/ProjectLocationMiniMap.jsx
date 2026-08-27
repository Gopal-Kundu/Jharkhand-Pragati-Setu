import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, Radio } from 'lucide-react';

const miniPinIcon = new L.DivIcon({
  className: 'custom-mini-marker',
  html: `
    <div style="
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #10b981;
      border: 2px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 12px rgba(16, 185, 129, 0.6);
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

export default function ProjectLocationMiniMap({
  lat = 23.0841,
  lng = 85.2514,
  title = 'Torpa Water R&D Site',
  districtName = 'Khunti',
  blockName = 'Torpa',
  radiusMeters = 3000
}) {
  const latitude = Number(lat) || 23.0841;
  const longitude = Number(lng) || 85.2514;
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Field Deployment Site Coordinates</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
        </span>
      </div>

      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-800 z-0">
        <MapContainer
          center={[latitude, longitude]}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
          style={{ background: '#0b0f19' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={tileUrl}
          />
          <Circle
            center={[latitude, longitude]}
            radius={radiusMeters}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.15,
              weight: 2
            }}
          />
          <Marker position={[latitude, longitude]} icon={miniPinIcon}>
            <Popup>
              <div className="text-xs p-1 text-slate-900 font-sans">
                <strong className="text-emerald-700 block">{title}</strong>
                <span className="text-[10px] text-slate-600 block">{blockName}, {districtName}</span>
                <span className="text-[9.5px] text-slate-400 font-mono">Radius: {radiusMeters / 1000}km Coverage</span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span className="flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{blockName} Block, {districtName} District</span>
        </span>
        <span className="text-emerald-400 font-semibold font-mono">
          IoT Coverage Zone: {radiusMeters / 1000} km²
        </span>
      </div>
    </div>
  );
}
