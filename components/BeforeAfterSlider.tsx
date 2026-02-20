import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  activeCategory?: string;
}

const categoryVisuals: Record<string, { before: string; after: string }> = {
  'Rig Removal': {
    before: "https://lh3.googleusercontent.com/d/1qDuNi9ic1dyenHlr7ORO_2Si7BDPFY-p", 
    after: "https://lh3.googleusercontent.com/d/1xGrWImR3Pf_VqnusfUfpHxwOe6VjBQ7D"
  },
  'Green Screen': {
    before: "https://lh3.googleusercontent.com/d/1OywdADmBEHRf-1TQAcNDuQ4iJWLCUJbt",
    after: "https://lh3.googleusercontent.com/d/1ksDazuWMiZ0nk2mGRunRObt1X0jeus-E"
  },
  'Video Rotoscoping': {
    before: "https://lh3.googleusercontent.com/d/10LBIcnfTETyseEPWnXZ_4Q86nKWi7xl9",
    after: "https://lh3.googleusercontent.com/d/13Y63T-1pdYxbaU_mTcfLAXyv915oRXLd"
  },
  'Reflections / Glass Glare': {
    before: "https://lh3.googleusercontent.com/d/1uSBfCnx2brah1Gfx-8U52vdeGmQrx4tA",
    after: "https://lh3.googleusercontent.com/d/1u8JnPGubhrpQZ2BglCYXCyy0mrDRDIjk"
  }
};

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ activeCategory = 'Rig Removal' }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fade, setFade] = useState(false);

  const currentVisual = categoryVisuals[activeCategory] || categoryVisuals['Rig Removal'];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const onMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 400);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-[16/10] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 border-[8px] border-white cursor-col-resize select-none group transition-opacity duration-300 ${fade ? 'opacity-40' : 'opacity-100'}`}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseDown={() => setIsDragging(true)}
    >
      {/* AFTER (MASTER CLEAN) */}
      <img 
        src={currentVisual.after} 
        alt="Master Quality Result" 
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000";
        }}
      />
      
      {/* BEFORE (RAW CAPTURE) */}
      <div 
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img 
          src={currentVisual.before} 
          alt="Raw Technical Capture" 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            activeCategory === 'Reflections / Glass Glare' 
              ? 'saturate-[0.5] contrast-[1.2] brightness-125' 
              : activeCategory === 'Green Screen' 
              ? 'brightness-110' 
              : 'grayscale opacity-95 contrast-[0.8]' 
          }`}
          draggable={false}
          onError={(e) => {
             (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000";
          }}
        />
        
        <div className="absolute top-8 left-8 z-20">
          <div className="bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg">
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Raw Capture</span>
          </div>
        </div>
      </div>

      <div className="absolute top-8 right-8 z-20 pointer-events-none">
        <div className="bg-[#DC143C] px-5 py-2.5 rounded-full shadow-2xl border border-red-400/20">
          <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Master Clean</span>
        </div>
      </div>

      {/* DRAG HANDLE */}
      <div 
        className="absolute inset-y-0 z-40 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute inset-y-0 -left-[1.5px] w-[3px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] border-[3px] border-[#DC143C] pointer-events-auto canva-btn transition-transform hover:scale-110 active:scale-95">
          <div className="flex gap-1">
             <div className="w-1.5 h-4 bg-[#DC143C] rounded-full opacity-40"></div>
             <div className="w-1.5 h-4 bg-[#DC143C] rounded-full"></div>
             <div className="w-1.5 h-4 bg-[#DC143C] rounded-full opacity-40"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
         <div className="glass px-6 py-2 rounded-full border border-white/40 flex items-center gap-3">
            <div className="w-2 h-2 bg-[#DC143C] rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black uppercase text-gray-900 tracking-widest">{activeCategory} View</span>
         </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;