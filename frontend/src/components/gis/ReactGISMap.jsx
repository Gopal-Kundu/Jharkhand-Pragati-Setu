import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppState } from '../../context/StateContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Layers,
  Sparkles,
  ExternalLink,
  Droplets,
  Sprout,
  HeartPulse,
  BookOpen,
  Flame,
  Sun,
  Building,
  Eye,
  FileCheck,
  Footprints,
  ShieldAlert,
  GraduationCap,
  Briefcase
} from 'lucide-react';

const DOMAIN_PIN_COLORS = {
  'Water Resources': '#0284c7', // Sky blue
  'Agriculture': '#16a34a', // Green
  'Healthcare': '#e11d48', // Rose/Red
  'Education': '#d97706', // Amber
  'Environment': '#0d9488', // Teal
  'Energy': '#ca8a04', // Yellow/Gold
  'Urban Development': '#7c3aed', // Purple
  'Accessibility': '#c026d3', // Fuchsia
  'Public Administration': '#0891b2', // Cyan
  'Rural Livelihoods': '#65a30d' // Lime
};

// Create dynamic DivIcon for map markers with domain color & severity pulse
function createHotspotMarker(domain = 'Water Resources', severity = 'High') {
  const color = DOMAIN_PIN_COLORS[domain] || '#10b981';
  const isCritical = severity === 'Critical';

  return new L.DivIcon({
    className: 'gis-hotspot-pin',
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${color};
        border: 2.5px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        cursor: pointer;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
        ${isCritical ? `
          <span style="
            position: absolute;
            top: -4px;
            right: -4px;
            width: 12px;
            height: 12px;
            background: #ef4444;
            border: 2px solid #ffffff;
            border-radius: 50%;
          "></span>
        ` : ''}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });
}

function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 8, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function ReactGISMap() {
  const navigate = useNavigate();
  const {
    problemClusters,
    districts,
    selectedClusterId,
    setSelectedClusterId,
    setActiveDistrictId,
    activeDistrictId
  } = useAppState();

  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [mapCenter, setMapCenter] = useState([23.6102, 85.2799]); // Jharkhand Geographical Centroid
  const [mapZoom, setMapZoom] = useState(8);

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Filter problems for GIS display
  const filteredProblems = (problemClusters || []).filter((p) => {
    if (!p) return false;
    const domainMatch = selectedDomain === 'All' || p.domain === selectedDomain || p.primaryDomain === selectedDomain;
    const severityMatch = selectedSeverity === 'All' || p.severity === selectedSeverity || p.priority === selectedSeverity;
    return domainMatch && severityMatch;
  });

  const handleOpenProblem = (ticketId) => {
    setSelectedClusterId(ticketId);
    navigate('/dashboard');
  };

  const handleDistrictSelect = (d) => {
    setActiveDistrictId(d.id);
    if (d.lat && d.lng) {
      setMapCenter([d.lat, d.lng]);
      setMapZoom(10);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Domain Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase font-mono flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Domain Layer:</span>
          </span>

          <button
            onClick={() => setSelectedDomain('All')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDomain === 'All'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All ({problemClusters.length})
          </button>

          {Object.keys(DOMAIN_PIN_COLORS).map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDomain === domain
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-400 font-semibold font-mono uppercase text-[11px]">Severity:</span>
          {['All', 'Critical', 'High', 'Medium'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                selectedSeverity === sev
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Leaflet Map Container */}
      <div className="relative w-full h-[550px] sm:h-[620px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl z-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ background: '#070b14' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={tileUrl}
          />
          <MapViewController center={mapCenter} zoom={mapZoom} />

          {/* Render Hotspot Markers */}
          {filteredProblems.map((p) => {
            const ticket = p.ticketId || p.id || 'JH-WTR-1042';
            const lat = Number(p.location?.lat) || (p.district === 'khunti' ? 23.0841 : 23.3441);
            const lng = Number(p.location?.lng) || (p.district === 'khunti' ? 85.2514 : 85.3096);
            const domain = p.domain || p.primaryDomain || 'Water Resources';
            const severity = p.severity || p.priority || 'High';
            const markerIcon = createHotspotMarker(domain, severity);

            return (
              <React.Fragment key={ticket}>
                {/* Visual Impact Radius Circle for Critical Problems */}
                {severity === 'Critical' && (
                  <Circle
                    center={[lat, lng]}
                    radius={6000}
                    pathOptions={{
                      color: '#ef4444',
                      fillColor: '#ef4444',
                      fillOpacity: 0.12,
                      weight: 1.5,
                      dashArray: '4, 8'
                    }}
                  />
                )}

                <Marker position={[lat, lng]} icon={markerIcon}>
                  <Popup className="custom-hotspot-popup">
                    <div className="p-2 text-slate-900 max-w-xs space-y-2 font-sans">
                      <div className="flex items-center justify-between gap-1 border-b border-slate-200 pb-1.5">
                        <span className="text-[10px] font-mono font-bold text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded">
                          #{ticket}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {severity} Priority
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                          {p.title}
                        </h4>
                        <span className="text-[10.5px] text-slate-500 block mt-0.5">
                          📍 {p.location?.district || p.districtName || 'Jharkhand'} ({p.location?.block || p.block || 'Sadar'} Block)
                        </span>
                      </div>

                      <div className="bg-slate-100 p-2 rounded-xl text-[10.5px] space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Domain:</span>
                          <strong className="text-slate-900">{domain}</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>HEI Lab:</span>
                          <strong className="text-purple-700">{p.allocatedUniversity?.name || p.allocatedHei || 'BIT Mesra'}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenProblem(ticket)}
                        className="w-full mt-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors cursor-pointer"
                      >
                        <span>Open Project Workspace</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Floating Telemetry Box */}
        <div className="absolute top-3 right-3 z-[400] bg-slate-950/90 border border-slate-800 backdrop-blur-md p-3.5 rounded-2xl text-xs space-y-2 shadow-2xl max-w-xs hidden sm:block">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>GIS Geospatial Intelligence</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Displaying <strong>{filteredProblems.length}</strong> active societal problem clusters across Jharkhand state.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block">Zoom:</span>
              <strong className="text-white">{mapZoom}x Regional</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Projection:</span>
              <strong className="text-cyan-400">EPSG:3857</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
