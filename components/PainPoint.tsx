
import React from 'react';

const PainPoint: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DC143C] mb-4 block">Efficiency vs Delay</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            Stop reshooting. <span className="gradient-text">Fix it in studio.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Traditional Way */}
          <div className="group rounded-[3rem] bg-gray-50 border border-gray-100 p-6 relative">
            <div className="aspect-square relative overflow-hidden rounded-[2.5rem] mb-8 bg-gray-200 shadow-inner">
              <img 
                src="https://lh3.googleusercontent.com/d/1A1HUv7tTSa_YntR_k4pReRS-AcSw5olr" 
                alt="Inefficient Reshoot" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2s]"
              />
              
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-sm text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Traditional Reshoot
              </div>
            </div>
            
            <div className="px-4 pb-4">
              <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">The Expensive Way</h3>
              <ul className="space-y-5">
                {[
                  { label: 'Cost', value: '$5,000 - $25,000+', desc: 'Studio, Crew & Equipment' },
                  { label: 'Delay', value: '2-4 Week Lead Time', desc: 'Logistics & Re-booking' },
                  { label: 'Risk', value: 'Talent Re-booking', desc: 'Inconsistent Lighting/Look' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div>
                      <div className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.value}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FTV Way */}
          <div className="group rounded-[3rem] bg-white border-2 border-red-50 p-6 shadow-2xl relative">
            <div className="aspect-square relative overflow-hidden rounded-[2.5rem] mb-8 bg-gray-100 shadow-2xl">
              {/* Updated image to the requested Google Drive source via proxy */}
              <img 
                src="https://lh3.googleusercontent.com/d/1WI1aYOWBuyeqz3t7iF49GKyaobZMjcfC" 
                alt="Digital Retouch" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2s]"
              />
              <div className="absolute top-6 left-6 bg-[#DC143C] px-5 py-2 rounded-full shadow-lg text-[10px] font-black text-white uppercase tracking-widest">
                Digital Surgery
              </div>
              
              {/* Tooltip highlighting the rig removal */}
              <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-red-100 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#DC143C] rounded-full"></div>
                  <div className="text-[10px] font-black text-[#DC143C] uppercase tracking-widest">Rig Detected</div>
                </div>
                <div className="text-[11px] text-gray-500 font-bold italic mt-2">Active Frame Interpolation</div>
              </div>
            </div>

            <div className="px-4 pb-4">
              <h3 className="text-2xl font-black text-[#DC143C] mb-6 uppercase tracking-tight">The FIXTHEVIDEO Way</h3>
              <ul className="space-y-5">
                {[
                  { label: 'Cost', value: '$300 - $1,200 Total', desc: 'Flat per-asset pricing' },
                  { label: 'Speed', value: '3-7 Day Delivery', desc: 'Parallel lab processing' },
                  { label: 'Result', value: 'Surgical Precision', desc: 'Frame-by-frame perfection' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-[#DC143C] rounded-full flex-shrink-0"></div>
                    <div>
                      <div className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.value}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual connector indicator */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:block">
               <div className="w-8 h-8 bg-white border border-red-100 rounded-full flex items-center justify-center shadow-lg text-[#DC143C]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoint;
