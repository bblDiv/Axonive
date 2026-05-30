"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ScrollSimulations } from '@/components/ScrollSimulations';
import { FeatureSpinner } from '@/components/FeatureSpinner';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Revamped Cherry Blossom Pink Hero Section with Scroll-parallax cloud stats */}
      <section className="pt-32 pb-40 px-6 bg-gradient-to-b from-[#FFF0F2] via-[#FFE4E8] to-white relative overflow-hidden">
        {/* Scroll-driven organic background element */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-gradient-to-tr from-pink-300/10 to-rose-400/20 rounded-full blur-3xl pointer-events-none select-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0004})`,
            opacity: Math.max(0.3, 0.75 - scrollY * 0.0009)
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Title & Description */}
            <div className="space-y-10 text-left">
              <div className="space-y-6">
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold bg-pink-100/60 text-pink-700 border border-pink-200/50 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mr-2 animate-pulse"></span>
                  Biomechanics Redefined
                </span>
                <h1 className="text-7xl lg:text-8xl font-serif text-navy-deep leading-[1.05] tracking-[-0.02em]">
                  The <i>future</i> of <i>surgical planning</i>
                </h1>
                <p className="text-2xl text-gray-700 leading-relaxed font-normal max-w-xl">
                  Transform neurosurgical outcomes with AI-powered biomechanical simulation. Predict tissue deformation before you operate.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/axonive"
                  className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-center text-lg"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/axonive"
                  className="px-8 py-4 bg-white/80 border-2 border-pink-200 text-gray-700 font-semibold rounded-lg hover:border-pink-300 hover:shadow-lg transition-all duration-200 text-center text-lg backdrop-blur-sm"
                >
                  Try Sandbox
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center space-x-2 text-sm bg-white/40 border border-pink-100/50 px-3 py-1.5 rounded-full backdrop-blur-[2px]">
                  <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-slate-700">Used by neurosurgeons</span>
                </div>
                <div className="flex items-center space-x-2 text-sm bg-white/40 border border-pink-100/50 px-3 py-1.5 rounded-full backdrop-blur-[2px]">
                  <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-slate-700">HIPAA compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm bg-white/40 border border-pink-100/50 px-3 py-1.5 rounded-full backdrop-blur-[2px]">
                  <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 01-2.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-slate-700">FDA Class II pathway</span>
                </div>
              </div>
            </div>

            {/* Interactive Brain Map Overlay & Cloud Parallax Stats Badges */}
            <div className="relative flex justify-center items-center min-h-[460px] select-none">
              
              {/* Glowing schematic brain SVG */}
              <div className="relative z-10 transition-transform duration-300 ease-out" style={{ transform: `scale(${1 + scrollY * 0.0001}) rotate(${scrollY * 0.03}deg)` }}>
                <svg viewBox="0 0 400 400" className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] text-pink-400/80 drop-shadow-[0_0_35px_rgba(244,63,94,0.18)]" fill="none" stroke="currentColor">
                  {/* Left hemisphere curves */}
                  <path d="M 200,80 C 140,80 100,120 100,180 C 100,240 130,280 180,310 C 190,315 200,320 200,320" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                  <path d="M 200,110 C 160,110 130,140 130,180 C 130,220 150,260 190,280" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5"/>
                  <path d="M 200,140 C 180,140 160,160 160,180 C 160,200 170,220 190,240" strokeWidth="2" opacity="0.7"/>
                  
                  {/* Right hemisphere curves */}
                  <path d="M 200,80 C 260,80 300,120 300,180 C 300,240 270,280 220,310 C 210,315 200,320 200,320" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" stroke="#FB7185"/>
                  <path d="M 200,110 C 240,110 270,140 270,180 C 270,220 250,260 210,280" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" stroke="#F43F5E"/>
                  <path d="M 200,140 C 220,140 240,160 240,180 C 240,200 230,220 210,240" strokeWidth="2" opacity="0.7" stroke="#FDA4AF"/>

                  {/* Neural connection loops */}
                  <path d="M 160,180 C 160,150 200,150 200,180 C 200,210 240,210 240,180" strokeWidth="1.5" opacity="0.4" stroke="#F472B6"/>
                  <path d="M 130,180 C 130,120 200,120 200,180 C 200,240 270,240 270,180" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" stroke="#F472B6"/>
                  <path d="M 100,180 C 100,90 200,90 200,180 C 200,270 300,270 300,180" strokeWidth="1.5" opacity="0.2" stroke="#EC4899"/>

                  {/* Nodes */}
                  <circle cx="100" cy="180" r="4" className="fill-pink-500 animate-pulse"/>
                  <circle cx="300" cy="180" r="4" className="fill-rose-500 animate-pulse"/>
                  <circle cx="200" cy="80" r="5" className="fill-pink-400"/>
                  <circle cx="200" cy="320" r="5" className="fill-rose-400"/>
                  <circle cx="130" cy="140" r="3" className="fill-pink-500"/>
                  <circle cx="270" cy="140" r="3" className="fill-rose-500"/>
                  <circle cx="150" cy="260" r="3" className="fill-pink-400"/>
                  <circle cx="250" cy="260" r="3" className="fill-rose-400"/>
                  <circle cx="200" cy="180" r="6" className="fill-pink-500"/>
                </svg>
              </div>

              {/* Parallax Stats Badges (Floating like clouds) */}
              
              {/* Badge 1: Accuracy */}
              <div 
                className="absolute top-4 left-0 md:left-2 bg-white/75 backdrop-blur-md border border-pink-100 rounded-2xl p-4 shadow-[0_8px_30px_rgb(244,63,94,0.06)] flex items-center space-x-3 w-[165px] will-change-transform"
                style={{ 
                  transform: `translateY(${scrollY * -0.16}px) translateX(${scrollY * 0.04}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 font-bold shrink-0">
                  %
                </div>
                <div>
                  <div className="text-xl font-bold text-navy-deep tracking-tight">99.2%</div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Accuracy</div>
                </div>
              </div>

              {/* Badge 2: Runtime */}
              <div 
                className="absolute top-12 right-0 md:right-4 bg-white/75 backdrop-blur-md border border-pink-100 rounded-2xl p-4 shadow-[0_8px_30px_rgb(244,63,94,0.06)] flex items-center space-x-3 w-[165px] will-change-transform"
                style={{ 
                  transform: `translateY(${scrollY * -0.24}px) translateX(${scrollY * -0.05}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-bold shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-navy-deep tracking-tight">5 min</div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Avg Runtime</div>
                </div>
              </div>

              {/* Badge 3: HIPAA */}
              <div 
                className="absolute top-1/2 left-[-12px] md:left-[-4px] bg-white/75 backdrop-blur-md border border-pink-100 rounded-2xl p-4 shadow-[0_8px_30px_rgb(244,63,94,0.06)] flex items-center space-x-3 w-[165px] will-change-transform"
                style={{ 
                  transform: `translateY(${scrollY * -0.11}px) translateX(${scrollY * 0.08}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-navy-deep tracking-tight">100%</div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">HIPAA Secure</div>
                </div>
              </div>

              {/* Badge 4: FDA Pathway */}
              <div 
                className="absolute top-2/3 right-[-12px] md:right-[-4px] bg-white/75 backdrop-blur-md border border-pink-100 rounded-2xl p-4 shadow-[0_8px_30px_rgb(244,63,94,0.06)] flex items-center space-x-3 w-[165px] will-change-transform"
                style={{ 
                  transform: `translateY(${scrollY * -0.27}px) translateX(${scrollY * -0.04}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-navy-deep tracking-tight">Class II</div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">FDA Pathway</div>
                </div>
              </div>

              {/* Badge 5: Grid Precision */}
              <div 
                className="absolute bottom-2 left-6 md:left-12 bg-white/75 backdrop-blur-md border border-pink-100 rounded-2xl p-4 shadow-[0_8px_30px_rgb(244,63,94,0.06)] flex items-center space-x-3 w-[165px] will-change-transform"
                style={{ 
                  transform: `translateY(${scrollY * -0.09}px) translateX(${scrollY * 0.05}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-navy-deep tracking-tight">0.1 mm</div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Mesh Grid</div>
                </div>
              </div>

              {/* Badge 6: Surgeons */}
              <div 
                className="absolute bottom-10 right-4 bg-white/75 backdrop-blur-md border border-pink-100 rounded-2xl p-4 shadow-[0_8px_30px_rgb(244,63,94,0.06)] flex items-center space-x-3 w-[165px] will-change-transform"
                style={{ 
                  transform: `translateY(${scrollY * -0.19}px) translateX(${scrollY * -0.04}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-navy-deep tracking-tight">200+</div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Surgeons</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners - Infinite Conveyor Belt */}
      <section className="py-14 px-6 bg-gradient-to-r from-[#FFF5F7] via-[#FFF0F2] to-[#FFF5F7] border-y border-pink-200/20 relative overflow-hidden">
        {/* Subtle cherry blossom organic blur dots */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-48 h-48 bg-pink-300/10 rounded-full blur-2xl pointer-events-none select-none"></div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-pink-300/10 rounded-full blur-2xl pointer-events-none select-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-center text-xs font-bold text-pink-600/70 uppercase tracking-widest mb-10">
            Trusted by leading hospitals and research institutions
          </p>
          
          {/* Conveyor belt wrapper with fade effect on sides */}
          <div className="relative w-full overflow-hidden mask-gradient-sides py-2">
            <div className="animate-marquee flex gap-20 items-center opacity-70">
              
              {/* Set 1 */}
              <div className="flex gap-20 items-center shrink-0">
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Johns Hopkins Medicine</div>
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Mayo Clinic</div>
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Stanford Health Care</div>
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Mass General Hospital</div>
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Cleveland Clinic</div>
              </div>

              {/* Set 2 */}
              <div className="flex gap-20 items-center shrink-0">
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Johns Hopkins Medicine</div>
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Mayo Clinic</div>
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Stanford Health Care</div>
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Mass General Hospital</div>
                <div className="text-2xl font-serif font-bold text-pink-900/60 tracking-tight">Cleveland Clinic</div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Revamped Features Section utilizing FeatureSpinner */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-wider font-bold text-pink-600 mb-3 block">
              Integrated Capabilities
            </span>
            <h2 className="text-6xl font-serif text-navy-deep mb-6 tracking-[-0.02em]">
              Everything you need to plan <i>safer surgeries</i>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Combine AI-powered analysis with physics-based simulation to make data-driven decisions in the operating room. Scroll down to spin the module selector.
            </p>
          </div>
          
          {/* Scroll-driven spinning selector wheel */}
          <FeatureSpinner />
        </div>
      </section>

      {/* FEATURE SHOWCASE - Scroll-based interactive simulations */}
      <section id="how-it-works" className="py-24 px-6 bg-white overflow-hidden border-b border-pink-100/30">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-6xl font-serif text-navy-deep mb-6 tracking-[-0.02em]">
            How <i>Axonive</i> works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our step-by-step interactive workflow. Scroll to see the live 3D simulations in action.
          </p>
        </div>
        <ScrollSimulations />
      </section>

      {/* TECHNOLOGY PARTNERS SECTION */}
      <section className="py-20 px-6 bg-gradient-to-b from-white via-[#FFF5F7] to-[#FFF0F2]/40 border-b border-pink-100/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-pink-600 uppercase tracking-widest mb-4">
              Powered by
            </p>
            <h2 className="text-5xl font-serif font-bold text-navy-deep mb-3 tracking-[-0.02em]">Industry-leading technology</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-pink-100/50 hover:shadow-xl hover:shadow-pink-100/10 hover:border-pink-200/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md shadow-pink-500/10">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy-deep">Gemini AI</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">Advanced models for medical context analysis and surgical insight generation.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-pink-100/50 hover:shadow-xl hover:shadow-pink-100/10 hover:border-pink-200/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-600 rounded-xl flex items-center justify-center shadow-md shadow-pink-500/10">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy-deep">Snowflake</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">Secure medical data warehousing for patient records and simulation grids.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-pink-100/50 hover:shadow-xl hover:shadow-pink-100/10 hover:border-pink-200/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md shadow-rose-500/10">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy-deep">DigitalOcean</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">High-performance processing instances for real-time mesh deformation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-32 px-6 bg-gradient-to-br from-pink-500 via-rose-600 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight tracking-[-0.02em]">
            Ready to transform your surgical planning?
          </h2>
          <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">
            Join leading neurosurgeons who are using Axonive to improve patient outcomes and reduce surgical risk.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/axonive"
              className="px-10 py-5 bg-white text-rose-600 font-bold rounded-lg hover:bg-pink-50 hover:shadow-2xl transition-all duration-200 text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/axonive"
              className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-200 text-lg"
            >
              Schedule Demo
            </Link>
          </div>
          <p className="mt-8 text-white/70 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER - Deep Midnight Cherry Blossom Theme */}
      <footer className="bg-[#1E0911] text-white pt-20 pb-12 px-6 border-t border-pink-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-6 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-3 space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 256 256" fill="none">
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
                <span className="text-3xl font-serif font-bold tracking-[-0.02em] text-pink-50">Axonive</span>
              </div>
              <p className="text-pink-100/60 leading-relaxed max-w-sm">
                AI-powered biomechanical simulation platform for safer, more predictable neurosurgical planning.
              </p>
              <div className="flex space-x-4">
                {/* X Link */}
                <a 
                  href="https://x.com/Daktardtm" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-pink-900/40 rounded-lg flex items-center justify-center transition-colors text-pink-300"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* GitHub Link */}
                <a 
                  href="https://github.com/bblDiv" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-pink-900/40 rounded-lg flex items-center justify-center transition-colors text-pink-300"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                {/* LinkedIn Link */}
                <a 
                  href="https://www.linkedin.com/in/divye-rawat-463064375/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-pink-900/40 rounded-lg flex items-center justify-center transition-colors text-pink-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div className="md:col-span-1">
              <h4 className="font-bold mb-5 text-lg text-pink-50">Product</h4>
              <ul className="space-y-3 text-pink-200/50">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link href="/axonive" className="hover:text-white transition-colors font-medium text-pink-300">Try Sandbox</Link></li>
              </ul>
            </div>

            {/* Developer Column */}
            <div className="md:col-span-1">
              <h4 className="font-bold mb-5 text-lg text-pink-50">Developer</h4>
              <ul className="space-y-3 text-pink-200/50">
                <li>
                  <a 
                    href="https://github.com/bblDiv" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/in/divye-rawat-463064375/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="md:col-span-1">
              <h4 className="font-bold mb-5 text-lg text-pink-50">Legal</h4>
              <ul className="space-y-3 text-pink-200/50">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-pink-950 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-pink-200/40 text-sm">
              &copy; 2026 Axonive. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-pink-200/40">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
