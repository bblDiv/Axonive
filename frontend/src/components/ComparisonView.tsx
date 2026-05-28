"use client";
import React from 'react';
import { BrainViewer3D } from './BrainViewer3D';
import type { MeshData } from '../types';

interface ComparisonViewProps {
  originalMesh: MeshData;
  deformedMesh: MeshData;
  heatmapData: number[];
  selectedLabel?: number | null;
  hiddenLabels?: number[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalMesh,
  deformedMesh,
  heatmapData,
  selectedLabel = null,
  hiddenLabels = [],
}) => {
  return (
    <div className="h-full flex">
      <div className="flex-1 border-r border-gray-300">
        <BrainViewer3D
          meshData={originalMesh}
          title="Before: Original Brain"
          showHeatmap={false}
          selectedLabel={selectedLabel}
          hiddenLabels={hiddenLabels}
        />
      </div>
      <div className="flex-1">
        <BrainViewer3D
          meshData={deformedMesh}
          title="After: Post-Resection"
          showHeatmap={true}
          heatmapData={heatmapData}
          selectedLabel={selectedLabel}
          hiddenLabels={hiddenLabels}
        />
      </div>
    </div>
  );
};

