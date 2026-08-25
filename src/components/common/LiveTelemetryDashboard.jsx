import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Activity, 
  Droplets, 
  Sun, 
  Radio, 
  CheckCircle2, 
  ArrowUpRight, 
  Zap, 
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function LiveTelemetryDashboard() {
  const [telemetry, setTelemetry] = useState({
    waterLevel: 4.82,
    waterQualityPH: 7.24,
    dissolvedOxygen: 6.85,
    gateAperture: 35,
    solarBatteryVolts: 13.8,
    lastPing: '2s ago',
    packetsReceived: 14820
  });

  const [hexLogs, setHexLogs] = useState([
    { time: '22:34:12', msg: 'LORA_RX [0x7A, 0x9B, 0x44] RSSI: -82 dBm | Depth: 4.82m | Gate: 35%' },
    { time: '22:34:02', msg: 'AUTO_SLUICE_PID: Target flow 120 L/min maintained for Karra-South canal.' },
    { time: '22:33:47', msg: 'WATER_QUALITY_OK: pH 7.24, Turbidity: 12 NTU (Potable after sand filter).' },
    { time: '22:33:30', msg: 'SOLAR_MPPT: 42W generation. Battery at 98% nominal SOC.' }
  ]);

  // Live tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        waterLevel: Number((4.80 + Math.random() * 0.05).toFixed(2)),
        waterQualityPH: Number((7.20 + Math.random() * 0.08).toFixed(2)),
        dissolvedOxygen: Number((6.80 + Math.random() * 0.12).toFixed(2)),
        solarBatteryVolts: Number((13.7 + Math.random() * 0.2).toFixed(1)),
        packetsReceived: prev.packetsReceived + 1,
        lastPing: 'Just now'
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5 animate-pulse text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-white tracking-tight">
                Dormba Pond Live Hydro-Telemetry Feed
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                ● LIVE LoRaWAN
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hardware: JalDrishti Hydrostatic Probes + BIT Mesra Solar Gateway • Khunti District
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>Packets: <strong className="text-cyan-400">{telemetry.packetsReceived.toLocaleString()}</strong></span>
          <span>• Last Ping: <strong className="text-emerald-400">{telemetry.lastPing}</strong></span>
        </div>
      </div>

      {/* 4 Sensor Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Metric 1: Water Level */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Reservoir Depth</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {telemetry.waterLevel} <span className="text-xs text-slate-400">meters</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(telemetry.waterLevel / 6.0) * 100}%` }} />
          </div>
          <span className="text-[9.5px] text-emerald-400 font-mono block mt-1">80.3% Reservoir Capacity</span>
        </div>

        {/* Metric 2: pH & Dissolved Oxygen */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Water Quality pH</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {telemetry.waterQualityPH} <span className="text-xs text-slate-400">pH</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1 font-mono">
            DO: <strong className="text-slate-200">{telemetry.dissolvedOxygen} mg/L</strong> (Healthy)
          </span>
          <span className="text-[9.5px] text-emerald-400 font-mono block">Zero Pathogen Alarm</span>
        </div>

        {/* Metric 3: Automated Sluice Gate */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Smart Sluice Valve</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            {telemetry.gateAperture}% <span className="text-xs text-slate-400">open</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1 font-mono">
            Mode: <strong>Auto Crop Duty</strong>
          </span>
          <span className="text-[9.5px] text-purple-300 font-mono block">Controlled by VWSC</span>
        </div>

        {/* Metric 4: Solar Battery */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Solar MPPT Battery</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {telemetry.solarBatteryVolts} <span className="text-xs text-slate-400">Volts</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1 font-mono">
            Harvesting: <strong className="text-slate-200">42 Watts</strong>
          </span>
          <span className="text-[9.5px] text-amber-400 font-mono block">100% Off-Grid Autonomy</span>
        </div>
      </div>

      {/* Raw Edge Telemetry Terminal */}
      <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
        <div className="flex items-center justify-between text-slate-500 text-[10px] border-b border-slate-800 pb-1 mb-1">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>BIT Mesra Hydro-Gateway Terminal (Node #JH-TORPA-01)</span>
          </span>
          <span>Protocol: LoRaWAN 868MHz AS923</span>
        </div>
        {hexLogs.map((log, idx) => (
          <div key={idx} className="flex space-x-2 text-slate-400 hover:text-white transition-colors">
            <span className="text-slate-600">[{log.time}]</span>
            <span className="text-emerald-400/90">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
