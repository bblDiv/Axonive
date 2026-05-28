import { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { FileUpload } from '../components/FileUpload';
import { BrainViewer3D } from '../components/BrainViewer3D';
import { SimulationControls } from '../components/SimulationControls';
import { GeminiInsights } from '../components/GeminiInsights';
import { ComparisonView } from '../components/ComparisonView';
import { BackgroundPaths } from '@/components/ui/background-paths';

export function AxonivePage() {
  const {
    originalMesh,
    deformedMesh,
    metrics,
    heatmapData,
    isLoading,
    error,
    isSimulated,
    labelNames,
    loadSample,
    segment,
    simulate,
  } = useSimulation();

  const [showComparison, setShowComparison] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<number | null>(null);
  const [hiddenLabels, setHiddenLabels] = useState<number[]>([]);

  const handleStructureClick = (id: number) => {
    setSelectedLabel(prev => prev === id ? null : id);
  };

  const handleToggleStructure = (id: number) => {
    setHiddenLabels(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const toggleAllStructures = () => {
    if (hiddenLabels.length > 0) {
      setHiddenLabels([]);
    } else {
      const allIds = Object.keys(labelNames).map(k => parseInt(k));
      setHiddenLabels(allIds);
    }
  };

  const structureColors = useMemo(() => {
    if (!originalMesh || !originalMesh.labels || !originalMesh.colors) return {};
    const mapping: Record<number, string> = {};
    const labels = originalMesh.labels;
    const colors = originalMesh.colors;
    for (let i = 0; i < labels.length; i++) {
      const lbl = labels[i];
      if (lbl !== undefined && colors[i]) {
        if (!mapping[lbl]) {
          const r = Math.round(colors[i][0] * 255);
          const g = Math.round(colors[i][1] * 255);
          const b = Math.round(colors[i][2] * 255);
          mapping[lbl] = `rgb(${r}, ${g}, ${b})`;
        }
      }
    }
    return mapping;
  }, [originalMesh]);

  const simulationData = isSimulated && deformedMesh && metrics
    ? {
        deformed_mesh: deformedMesh,
        metrics: metrics,
        heatmap_data: heatmapData,
        case_id: 'current',
      }
    : null;

  return (
    <div className="h-screen flex flex-col bg-white relative overflow-hidden">
      <BackgroundPaths showContent={false} className="opacity-70 pointer-events-none" />

      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100/20 px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 256 256" fill="none">
              <circle cx="128" cy="128" r="90" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="16 16" opacity="0.4" />
              <path d="M 128,128 L 128,38 M 128,128 L 213,90 M 128,128 L 180,210 M 128,128 L 76,210 M 128,128 L 43,90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
              <path d="M 128,38 Q 170.5,64 213,90 M 213,90 Q 196.5,150 180,210 M 180,210 Q 128,210 76,210 M 76,210 Q 59.5,150 43,90 M 43,90 Q 85.5,64 128,38" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="8,8" opacity="0.5" />
              <circle cx="128" cy="128" r="32" fill="currentColor" />
              <circle cx="128" cy="38" r="20" fill="currentColor" />
              <circle cx="213" cy="90" r="20" fill="currentColor" />
              <circle cx="180" cy="210" r="20" fill="currentColor" />
              <circle cx="76" cy="210" r="20" fill="currentColor" />
              <circle cx="43" cy="90" r="20" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-navy-deep tracking-[-0.02em]">Axonive</h1>
            <p className="text-xs text-gray-500">AI-Powered Surgical Planning</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isLoading && (
            <div className="flex items-center space-x-2 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100/40">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-pink-700 font-medium">Processing...</span>
            </div>
          )}
          {isSimulated && (
            <div className="flex items-center space-x-2 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100/40">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              <span className="text-sm text-pink-700 font-medium">Simulation Complete</span>
            </div>
          )}
        </div>
      </nav>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-20 right-6 z-50 animate-slide-up">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-lg max-w-md">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden z-10">
        {/* LEFT PANEL - Controls (320px) */}
        <div className="w-[320px] bg-white/70 backdrop-blur-md border-r border-pink-100/20 flex flex-col h-full overflow-hidden">
          <div className="p-4 flex-1 flex flex-col min-h-0 space-y-4">
            <div className="overflow-y-auto pr-1 space-y-4 flex-shrink-0 max-h-[50%]">
              <SimulationControls
                onLoadSample={loadSample}
                onSimulate={simulate}
                isLoading={isLoading}
                hasData={!!originalMesh}
                isSimulated={isSimulated}
                metrics={metrics}
              />

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload Scan</h3>
                <FileUpload onUploadSuccess={segment} />
              </div>

              {isSimulated && metrics && (
                <div className="border-t border-gray-200 pt-4 pb-2">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="w-full btn-secondary text-sm"
                  >
                    {showComparison ? 'Hide' : 'Show'} Comparison
                  </button>
                </div>
              )}
            </div>

            {/* Brain Structures (61) List */}
            {originalMesh && Object.keys(labelNames).length > 0 && (
              <div className="border-t border-gray-200 pt-4 flex-1 flex flex-col min-h-0 text-left border-dashed">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Brain Structures ({Object.keys(labelNames).length})</h3>
                  <button 
                    onClick={toggleAllStructures}
                    className="text-[10px] text-pink-600 hover:text-pink-700 font-semibold focus:outline-none"
                  >
                    {hiddenLabels.length > 0 ? 'Show All' : 'Hide All'}
                  </button>
                </div>
                
                {/* Scrollable list */}
                <div className="overflow-y-auto flex-1 pr-1 space-y-1 bg-slate-50/50 rounded-lg p-2 border border-gray-100">
                  {Object.entries(labelNames).map(([idStr, name]) => {
                    const id = parseInt(idStr);
                    const color = structureColors[id] || '#cbd5e1';
                    const isHidden = hiddenLabels.includes(id);
                    const isSelected = selectedLabel === id;
                    
                    return (
                      <div 
                        key={id}
                        onClick={() => handleStructureClick(id)}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-all duration-150 group border ${
                          isSelected 
                            ? 'bg-orange-50 border-orange-200 shadow-sm' 
                            : 'hover:bg-slate-100/80 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={!isHidden}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleStructure(id);
                            }}
                            className="accent-pink-500 w-3 h-3 rounded cursor-pointer flex-shrink-0"
                          />
                          <span 
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className={`text-[11px] truncate select-none flex-1 ${
                            isSelected 
                              ? 'text-orange-950 font-semibold' 
                              : 'text-gray-600 group-hover:text-gray-900'
                          }`}>
                            {name}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-[9px] bg-orange-200 text-orange-850 px-1 py-0.5 rounded font-bold uppercase tracking-wider scale-90 ml-1 flex-shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL - 3D Viewer (Flexible) */}
        <div className="flex-1 bg-transparent relative">
          {!originalMesh ? (
            <div className="h-full flex items-center justify-center p-12 relative overflow-hidden">
              <div className="text-center max-w-md animate-fade-in relative z-10 bg-white/75 backdrop-blur-md border border-pink-100/50 p-8 rounded-3xl shadow-xl shadow-pink-100/5">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-pink-500/20">
                  <svg className="w-10 h-10 text-pink-500" viewBox="0 0 256 256" fill="none">
                    <circle cx="128" cy="128" r="90" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="16 16" opacity="0.4" />
                    <path d="M 128,128 L 128,38 M 128,128 L 213,90 M 128,128 L 180,210 M 128,128 L 76,210 M 128,128 L 43,90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                    <path d="M 128,38 Q 170.5,64 213,90 M 213,90 Q 196.5,150 180,210 M 180,210 Q 128,210 76,210 M 76,210 Q 59.5,150 43,90 M 43,90 Q 85.5,64 128,38" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="8,8" opacity="0.5" />
                    <circle cx="128" cy="128" r="32" fill="currentColor" />
                    <circle cx="128" cy="38" r="20" fill="currentColor" />
                    <circle cx="213" cy="90" r="20" fill="currentColor" />
                    <circle cx="180" cy="210" r="20" fill="currentColor" />
                    <circle cx="76" cy="210" r="20" fill="currentColor" />
                    <circle cx="43" cy="90" r="20" fill="currentColor" />
                  </svg>
                </div>
                <h2 className="text-3xl font-serif font-semibold text-navy-deep mb-3 tracking-[-0.02em]">Welcome to Axonive</h2>
                <p className="text-slate-600 mb-8">
                  Load a sample brain scan or upload your own medical imaging data to begin simulation
                </p>
                <button
                  onClick={loadSample}
                  disabled={isLoading}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Load Sample Brain</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : showComparison && isSimulated && deformedMesh ? (
            <ComparisonView
              originalMesh={originalMesh}
              deformedMesh={deformedMesh}
              heatmapData={heatmapData}
              selectedLabel={selectedLabel}
              hiddenLabels={hiddenLabels}
            />
          ) : (
            <div className="h-full">
              <BrainViewer3D
                meshData={isSimulated && deformedMesh ? deformedMesh : originalMesh}
                title={isSimulated ? "Post-Resection Simulation" : "Brain Segmentation"}
                showHeatmap={isSimulated}
                heatmapData={heatmapData}
                selectedLabel={selectedLabel}
                hiddenLabels={hiddenLabels}
              />
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Insights (320px) */}
        <div className="w-[320px] bg-white/70 backdrop-blur-md border-l border-pink-100/20 overflow-y-auto">
          <GeminiInsights simulationData={simulationData} />
        </div>
      </div>
    </div>
  );
}
