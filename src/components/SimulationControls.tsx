"use client";
import React, { useState } from 'react';
import type { SimulationMetrics } from '../types';

interface SimulationControlsProps {
  onLoadSample: () => void;
  onSimulate: (
    x: number,
    y: number,
    z: number,
    radius: number,
    stiffness: number,
    skullOpeningSize: number
  ) => void;
  isLoading: boolean;
  hasData: boolean;
  isSimulated: boolean;
  metrics: SimulationMetrics | null;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  onLoadSample,
  onSimulate,
  isLoading,
  hasData,
  isSimulated,
  metrics,
}) => {
  const [x, setX] = useState(1.0);
  const [y, setY] = useState(-1.5);
  const [z, setZ] = useState(-1.0);
  const [radius, setRadius] = useState(1.5);
  const [stiffness, setStiffness] = useState(3.0);
  const [skullOpeningSize, setSkullOpeningSize] = useState(5.0);

  const handleSimulate = () => {
    onSimulate(x, y, z, radius, stiffness, skullOpeningSize);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <button
          onClick={onLoadSample}
          disabled={isLoading}
          className="w-full btn-primary text-sm"
        >
          {isLoading ? 'Loading...' : 'Load Sample Brain'}
        </button>

        <button
          onClick={handleSimulate}
          disabled={isLoading || !hasData || isSimulated}
          className="w-full btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Simulating...' : 'Remove Tumor & Simulate'}
        </button>
      </div>

      {hasData && !isSimulated && (
        <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-xl border border-gray-150 text-left">
          <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Simulation Parameters</h4>
          
          {/* Coordinates Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-gray-550 block mb-0.5">X-Coord</label>
              <input
                type="number"
                value={x}
                min={-5.0}
                max={5.0}
                step={0.1}
                onChange={(e) => setX(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-1.5 py-1 bg-white border border-gray-200 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-550 block mb-0.5">Y-Coord</label>
              <input
                type="number"
                value={y}
                min={-5.0}
                max={5.0}
                step={0.1}
                onChange={(e) => setY(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-1.5 py-1 bg-white border border-gray-200 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-550 block mb-0.5">Z-Coord</label>
              <input
                type="number"
                value={z}
                min={-5.0}
                max={5.0}
                step={0.1}
                onChange={(e) => setZ(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-1.5 py-1 bg-white border border-gray-200 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>
          
          {/* Sliders for Radius, Stiffness, Skull Opening */}
          <div className="space-y-2.5 mt-2">
            <div>
              <div className="flex justify-between items-center text-[10px] font-semibold text-gray-550 mb-0.5">
                <span>Resection Radius (Tumor size)</span>
                <span className="text-pink-600 font-mono font-bold">{radius.toFixed(1)}</span>
              </div>
              <input
                type="range"
                value={radius}
                min={0.5}
                max={3.0}
                step={0.1}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-semibold text-gray-550 mb-0.5">
                <span>Tissue Stiffness</span>
                <span className="text-pink-600 font-mono font-bold">{stiffness.toFixed(1)}</span>
              </div>
              <input
                type="range"
                value={stiffness}
                min={1.0}
                max={10.0}
                step={0.5}
                onChange={(e) => setStiffness(parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-semibold text-gray-550 mb-0.5">
                <span>Skull Opening Size</span>
                <span className="text-pink-600 font-mono font-bold">{skullOpeningSize.toFixed(1)}</span>
              </div>
              <input
                type="range"
                value={skullOpeningSize}
                min={1.0}
                max={10.0}
                step={0.5}
                onChange={(e) => setSkullOpeningSize(parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {metrics && (
        <div className="border-t border-gray-200 pt-4 space-y-3 text-left">
          <h3 className="text-sm font-semibold text-gray-700">Simulation Metrics</h3>
          
          <div className="grid grid-cols-1 gap-2">
            <MetricCard
              label="Max Displacement"
              value={`${metrics.max_displacement_mm.toFixed(2)} mm`}
              color="text-blue-600"
            />
            <MetricCard
              label="Avg Stress"
              value={`${metrics.avg_stress_kpa.toFixed(1)} kPa`}
              color="text-orange-600"
            />
            <MetricCard
              label="Affected Volume"
              value={`${metrics.affected_volume_cm3.toFixed(2)} cm³`}
              color="text-purple-600"
            />
          </div>

          {metrics.vulnerable_regions.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-600 mb-2">Vulnerable Regions</h4>
              <ul className="space-y-1">
                {metrics.vulnerable_regions.map((region, idx) => (
                  <li key={idx} className="text-xs text-gray-700 bg-yellow-50 px-2 py-1 rounded">
                    {region}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div className="bg-gray-50 rounded-lg px-3 py-2">
    <p className="text-xs text-gray-600">{label}</p>
    <p className={`text-sm font-semibold ${color}`}>{value}</p>
  </div>
);

