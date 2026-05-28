"use client";
import React, { useEffect, useRef, useState } from 'react';

interface FeatureItem {
  id: string;
  stepNum: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  color: string;
  bgColor: string;
  iconPath: string;
}

const features: FeatureItem[] = [
  {
    id: 'analytics',
    stepNum: '01',
    title: 'Predictive Analytics',
    tagline: 'Precision modeling for surgical certainty',
    description: 'Forecast tissue deformation and surgical outcomes with 99%+ accuracy using advanced biomechanical models. Assess vascular tension and anatomical elasticity prior to opening.',
    bullets: [
      'Elasticity mapping of brain layers',
      'Vascular deformation risk profiles',
      'Patient-specific material coefficients'
    ],
    color: 'text-pink-600 border-pink-500 bg-pink-50',
    bgColor: 'from-pink-500 to-rose-500',
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    id: 'simulation',
    stepNum: '02',
    title: 'Real-Time Simulation',
    tagline: 'Interactive finite element solvers',
    description: 'Run complex biomechanical finite element simulations in minutes, not hours. Adjust parameters on the fly and get instant visual feedback on surgical approach adjustments.',
    bullets: [
      'GPU-accelerated deformation grids',
      'Dynamic tissue recoil calculations',
      'Interactive tumor cavity extraction'
    ],
    color: 'text-sky-600 border-sky-500 bg-sky-50',
    bgColor: 'from-sky-500 to-blue-600',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    id: 'insights',
    stepNum: '03',
    title: 'AI-Powered Insights',
    tagline: 'Cognitive surgical assistance',
    description: 'Gemini AI digests mechanical strain, volume shifts, and coordinate stress metrics to highlight vascular risk zones and type out structured recommendations.',
    bullets: [
      'Automated risk zone classification',
      'Surgeon-vs-Patient report generator',
      'Conversational follow-up analysis'
    ],
    color: 'text-purple-600 border-purple-500 bg-purple-50',
    bgColor: 'from-purple-500 to-indigo-600',
    iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  }
];

export const FeatureSpinner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0); // Degrees
  const [activeStep, setActiveStep] = useState(0);
  const [progressOffset, setProgressOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Scroll boundaries of the container
      const offsetTop = rect.top;
      const height = rect.height;

      // If the container is partially inside the viewport
      if (offsetTop < windowHeight && offsetTop + height > 0) {
        // Compute progress of scroll through this section
        const total = windowHeight + height;
        const progress = (windowHeight - offsetTop) / total; // 0 to 1
        
        // Calculate adjusted progress with user click offset
        const adjustedProgress = Math.min(Math.max(progress + progressOffset, 0), 1);

        // Spin it up to 240 degrees as the user scrolls
        const targetRotation = adjustedProgress * 240;
        setRotation(targetRotation);

        // Map rotation / progress to active step
        if (targetRotation < 80) {
          setActiveStep(0);
        } else if (targetRotation < 160) {
          setActiveStep(1);
        } else {
          setActiveStep(2);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [progressOffset]);

  const handleNodeClick = (stepIndex: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const total = windowHeight + rect.height;
    
    // Calculate current scroll progress
    const currentProgress = (windowHeight - rect.top) / total;
    
    // Target progress for each node (0.2, 0.5, 0.8)
    const targetProgress = stepIndex === 0 ? 0.2 : stepIndex === 1 ? 0.5 : 0.8;
    
    // Set the offset so subsequent scrolls start from here
    setProgressOffset(targetProgress - currentProgress);
    
    // Update states immediately for instant user feedback without scrolling
    setActiveStep(stepIndex);
    setRotation(targetProgress * 240);
  };

  const activeFeature = features[activeStep];

  return (
    <div 
      ref={containerRef} 
      className="grid lg:grid-cols-2 gap-16 items-center bg-gradient-to-br from-pink-50/10 to-rose-50/10 p-8 md:p-12 rounded-3xl border border-pink-100/30 relative overflow-visible min-h-[500px]"
    >
      {/* Dynamic Info Panel (Left Column) */}
      <div className="space-y-8 transition-all duration-500 ease-out transform translate-y-0 opacity-100">
        <div key={activeFeature.id} className="space-y-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <span className={`text-6xl font-serif font-bold ${activeFeature.color.split(' ')[0]} opacity-40`}>
              {activeFeature.stepNum}
            </span>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                Axonive Modules
              </span>
              <h3 className="text-4xl font-serif font-bold text-navy-deep tracking-[-0.02em]">
                {activeFeature.title}
              </h3>
            </div>
          </div>
          
          <h4 className="text-lg font-medium text-slate-600 italic">
            "{activeFeature.tagline}"
          </h4>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
            {activeFeature.description}
          </p>

          <ul className="space-y-3.5 pt-2">
            {activeFeature.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeFeature.bgColor}`}></div>
                <span className="text-gray-700 font-medium">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rotating Dial Spinner Panel (Right Column) */}
      <div className="flex justify-center items-center h-[360px] md:h-[420px] relative">
        
        {/* Large Spinner Circle (resized slightly to guarantee zero overflow clipping) */}
        <div 
          className="w-[230px] h-[230px] md:w-[300px] md:h-[300px] rounded-full border border-pink-100 relative flex items-center justify-center bg-white/45 backdrop-blur-[2px] transition-transform duration-100 ease-out shadow-inner"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Inner ring */}
          <div className="w-[140px] h-[140px] md:w-[185px] md:h-[185px] rounded-full border border-dashed border-pink-200/60 flex items-center justify-center">
            {/* Center Axon Core */}
            <div className={`w-18 h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${activeFeature.bgColor} flex items-center justify-center text-white shadow-lg shadow-pink-500/10 transition-all duration-500`}>
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={activeFeature.iconPath} />
              </svg>
            </div>
          </div>

          {/* Node 1: Analytics (At 0 degrees top) */}
          <div 
            onClick={() => handleNodeClick(0)}
            className={`absolute w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-md cursor-pointer transition-all duration-300 hover:scale-115 hover:shadow-lg ${
              activeStep === 0 
                ? 'bg-pink-500 text-white border-white scale-110 shadow-pink-500/20' 
                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
            }`}
            style={{ 
              top: '-20px', 
              left: 'calc(50% - 24px)',
              transform: `rotate(${-rotation}deg)` // Counter-rotates to stay upright!
            }}
          >
            <span>01</span>
          </div>

          {/* Node 2: Simulation (At 120 degrees bottom-right) */}
          <div 
            onClick={() => handleNodeClick(1)}
            className={`absolute w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-md cursor-pointer transition-all duration-300 hover:scale-115 hover:shadow-lg ${
              activeStep === 1 
                ? 'bg-sky-500 text-white border-white scale-110 shadow-sky-500/20' 
                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
            }`}
            style={{ 
              bottom: '16px', 
              right: '-10px',
              transform: `rotate(${-rotation}deg)` 
            }}
          >
            <span>02</span>
          </div>

          {/* Node 3: Insights (At 240 degrees bottom-left) */}
          <div 
            onClick={() => handleNodeClick(2)}
            className={`absolute w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-md cursor-pointer transition-all duration-300 hover:scale-115 hover:shadow-lg ${
              activeStep === 2 
                ? 'bg-purple-500 text-white border-white scale-110 shadow-purple-500/20' 
                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
            }`}
            style={{ 
              bottom: '16px', 
              left: '-10px',
              transform: `rotate(${-rotation}deg)` 
            }}
          >
            <span>03</span>
          </div>
        </div>

        {/* Orbit indicator dots outside wheel */}
        <div className="absolute inset-0 border border-slate-100 rounded-full scale-105 pointer-events-none select-none"></div>
      </div>
    </div>
  );
};
