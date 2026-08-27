import React, { useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import JharkhandGISMap from '../components/gis/JharkhandGISMap';
import { MapPin } from 'lucide-react';

export default function MapPage() {
  const { loadFullEcosystemData } = useAppState();

  useEffect(() => {
    loadFullEcosystemData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Geographic Information Systems (GIS) Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Jharkhand 24-District Challenge Hotspots</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Interactive GIS geospatial intelligence mapping verified societal challenges and active R&D deployments.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <JharkhandGISMap />
      </div>
    </div>
  );
}
