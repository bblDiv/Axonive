"use client";
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import type { MeshData } from '../types';

interface BrainViewer3DProps {
  meshData: MeshData;
  title?: string;
  showHeatmap?: boolean;
  heatmapData?: number[];
  selectedLabel?: number | null;
  hiddenLabels?: number[];
}

export const BrainViewer3D: React.FC<BrainViewer3DProps> = ({
  meshData,
  title,
  showHeatmap = false,
  heatmapData = [],
  selectedLabel = null,
  hiddenLabels = [],
}) => {
  if (typeof window !== 'undefined') {
    (window as any).debugMeshData = meshData;
  }

  const hiddenSet = useMemo(() => new Set(hiddenLabels), [hiddenLabels]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    
    // Convert vertices to Float32Array
    const vertices = new Float32Array(
      meshData.vertices.flat()
    );
    
    const labels = meshData.labels || [];
    
    // Filter out faces that belong to hidden labels
    const filteredFaces: number[] = [];
    for (let i = 0; i < meshData.faces.length; i++) {
      const face = meshData.faces[i];
      const v0 = face[0];
      const v1 = face[1];
      const v2 = face[2];
      if (
        hiddenSet.has(labels[v0]) ||
        hiddenSet.has(labels[v1]) ||
        hiddenSet.has(labels[v2])
      ) {
        continue;
      }
      filteredFaces.push(v0, v1, v2);
    }
    
    // Convert filtered faces to Uint32Array
    const indices = new Uint32Array(filteredFaces);
    
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    
    // Convert to non-indexed to duplicate vertices per face
    const nonIndexedGeo = geo.toNonIndexed();
    
    // Set colors per face vertex to prevent interpolation bleeding
    const numVerts = nonIndexedGeo.attributes.position.count;
    const colors = new Float32Array(numVerts * 3);
    
    if (showHeatmap && heatmapData.length > 0) {
      const minStress = Math.min(...heatmapData);
      const maxStress = Math.max(...heatmapData);
      const range = maxStress - minStress || 1;
      
      for (let j = 0; j < numVerts / 3; j++) {
        const origIdx0 = filteredFaces[j * 3 + 0];
        const origIdx1 = filteredFaces[j * 3 + 1];
        const origIdx2 = filteredFaces[j * 3 + 2];
        
        const stress = heatmapData[origIdx0];
        const normalized = (stress - minStress) / range;
        const r = normalized;
        const g = 0;
        const b = 1 - normalized;
        
        const isSelected = labels[origIdx0] === selectedLabel || 
                           labels[origIdx1] === selectedLabel || 
                           labels[origIdx2] === selectedLabel;
        
        for (let k = 0; k < 3; k++) {
          const idx = j * 3 + k;
          if (isSelected) {
            colors[idx * 3] = 1.0;
            colors[idx * 3 + 1] = 0.5;
            colors[idx * 3 + 2] = 0.0;
          } else {
            colors[idx * 3] = r;
            colors[idx * 3 + 1] = g;
            colors[idx * 3 + 2] = b;
          }
        }
      }
    } else {
      const hasColors = meshData.colors && meshData.colors.length > 0;
      
      for (let j = 0; j < numVerts / 3; j++) {
        const origIdx0 = filteredFaces[j * 3 + 0];
        const origIdx1 = filteredFaces[j * 3 + 1];
        const origIdx2 = filteredFaces[j * 3 + 2];
        
        const isSelected = labels[origIdx0] === selectedLabel || 
                           labels[origIdx1] === selectedLabel || 
                           labels[origIdx2] === selectedLabel;
        
        let r = 0.7, g = 0.7, b = 0.7;
        if (isSelected) {
          r = 1.0; g = 0.5; b = 0.0;
        } else if (hasColors) {
          r = meshData.colors![origIdx0][0];
          g = meshData.colors![origIdx0][1];
          b = meshData.colors![origIdx0][2];
        }
        
        for (let k = 0; k < 3; k++) {
          const idx = j * 3 + k;
          colors[idx * 3] = r;
          colors[idx * 3 + 1] = g;
          colors[idx * 3 + 2] = b;
        }
      }
    }
    
    nonIndexedGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    nonIndexedGeo.computeVertexNormals();
    
    return nonIndexedGeo;
  }, [meshData, showHeatmap, heatmapData, selectedLabel, hiddenSet]);

  return (
    <div className="h-full w-full relative">
      {title && (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
      )}

      {/* Legend Box Overlay in Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 dark:border-slate-800/50 text-xs flex flex-col gap-2 min-w-[160px]">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-slate-800/80 pb-1.5 mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-3 bg-pink-500 rounded-full inline-block"></span>
          Viewport Legend
        </h4>
        {selectedLabel !== null && selectedLabel !== undefined && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff8000] shadow-sm shadow-orange-500/50" />
            <span className="text-gray-600 dark:text-gray-400 font-medium">Selected Structure</span>
          </div>
        )}
        {showHeatmap ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 shadow-sm shadow-red-500/50" />
              <span className="text-gray-600 dark:text-gray-400 font-medium flex-1">High Stress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-600 shadow-sm shadow-purple-500/50" />
              <span className="text-gray-600 dark:text-gray-400 font-medium flex-1">Moderate Stress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-500/50" />
              <span className="text-gray-600 dark:text-gray-400 font-medium flex-1">Low Stress</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">61 Parcellated Regions</span>
          </div>
        )}
      </div>

      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        
        <mesh geometry={geometry}>
          <meshStandardMaterial
            vertexColors={true}
            side={THREE.DoubleSide}
            flatShading={true}
          />
        </mesh>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={25}
        />
        
        <Grid args={[10, 10]} cellColor="#6b7280" sectionColor="#9ca3af" />
        <axesHelper args={[2]} />
      </Canvas>
    </div>
  );
};

