import React from 'react';

interface TrustBridgeProps {
  onOpenModal: (service: string) => void;
}

const TrustBridge: React.FC<TrustBridgeProps> = ({ onOpenModal }) => {
  // Updated Brand logo data - Louis Vuitton removed as requested
  const brands = [
    { name: 'Nike', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { name: 'Adidas', src: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'Puma', src: 'https://lh3.googleusercontent.com/d/1EsiclS7wkqE9essLZ2ZWR19EsEhtVcjH' },
    { name: 'Gucci', src: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Gucci_logo.svg' },
    { name: 'Prada', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Prada-Logo.svg' },
  ];

  // Duplicating for seamless infinite loop
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <>
      {/* SECTION 1: OUR NETWORK (MARQUEE) */}
      <section id="network" className="relative py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DC143C] mb-6 block">Our Network</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              Powering the <br />
              <span className="gradient-text text-[#DC143C]">top fashion brands.</span>
            </h2>
          </div>
        </div>

        {/* INFINITE MARQUEE */}
        <div className="relative flex overflow-hidden py-10">
          <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
            {marqueeBrands.map((brand, idx) => (
              <div 
                key={`${brand.name}-${idx}`} 
                className="flex-shrink-0 w-40 h-20 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform hover:scale-110"
              >
                <img 
                  src={brand.src} 
                  alt={brand.name} 
                  className="max-w-full max-h-full object-contain pointer-events-none"
                  onError={(e) => {
                    // Fallback to text if the direct link fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const text = document.createElement('span');
                      text.innerText = brand.name;
                      text.className = "text-xs font-black uppercase tracking-widest text-gray-400";
                      parent.appendChild(text);
                    }
                  }}
                />
              </div>
            ))}
          </div>
          {/* Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 35s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* SECTION 2: CONVERSION & TRUST (CLEAN STRUCTURE) */}
      <section id="trust-tools" className="relative py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-[#F9FAFB] rounded-[4rem] p-12 md:p-24 border border-gray-100 min-h-[600px] flex items-center overflow-hidden shadow-sm">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#DC143C] opacity-[0.015] rounded-full blur-[140px] pointer-events-none"></div>

            <div className="relative z-20 w-full grid lg:grid-cols-2 gap-16 items-center">
              
              {/* LEFT SIDE: UNIFIED CONTENT COLUMN */}
              <div className="space-y-12">
                {/* Heading Block */}
                <div>
                  <h3 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-6">
                    Try before <br/>you sign
                  </h3>
                  <p className="text-gray-400 text-xs font-black italic tracking-wide uppercase opacity-70">
                    "5 free frames. 24 hour turnaround. No strings."
                  </p>
                </div>

                {/* Assurance Block */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#DC143C]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vault Security</span>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Private Vault</h4>
                  <p className="text-gray-500 leading-relaxed text-sm font-bold uppercase tracking-tight opacity-70 max-w-md">
                    Your campaign assets are handled via encrypted private servers with 100% NDA compliance and military-grade protocols.
                  </p>
                </div>

                {/* Action Block */}
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <button 
                    onClick={() => onOpenModal('rig_removal')}
                    className="bg-[#DC143C] text-white px-16 py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(220,20,60,0.3)] hover:scale-105 hover:bg-[#b91c1c] transition-all canva-btn whitespace-nowrap"
                  >
                    Free Sample
                  </button>
                  
                  <div className="flex items-center gap-3 text-emerald-500 bg-white px-6 py-3 rounded-full border border-emerald-50 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Encrypted Active</span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: THE PANDA VISUAL */}
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="w-[450px] h-[450px] md:w-[550px] md:h-[550px] transform animate-[float_10s_ease-in-out_infinite] flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-75"></div>
                    <img 
                      src="https://lh3.googleusercontent.com/d/1hmxCE87Z7N-ic_LRuiyekitcxyQKhYFx" 
                      alt="Panda Bag Visual"
                      className="w-full h-full object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.06)]"
                    />
                </div>
              </div>
            </div>

            {/* Subtle Lab Identity Label */}
            <div className="absolute bottom-12 right-16 opacity-[0.04] pointer-events-none select-none">
               <span className="text-5xl font-black uppercase tracking-widest text-gray-900">LAB-01</span>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-25px) rotate(2deg); }
          }
        `}</style>
      </section>
    </>
  );
};

export default TrustBridge;