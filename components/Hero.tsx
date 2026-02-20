import React, { useState } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';

interface HeroProps {
  onOpenModal: (service: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  const [activeCategory, setActiveCategory] = useState('Rig Removal');

  const categories = [
    { name: 'Rig Removal', id: 'rig_removal' },
    { name: 'Green Screen', id: 'green_screen' },
    { name: 'Video Rotoscoping', id: 'video_rotoscoping' },
    { name: 'Reflections / Glass Glare', id: 'reflections_removal' }
  ];

  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-[1.05] tracking-tight">
          What will you <span className="gradient-text">fix</span> today?
        </h1>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.name)}
              className={`px-6 py-2 rounded-full border-2 text-xs font-black transition-all shadow-sm uppercase tracking-widest ${
                activeCategory === cat.name 
                ? 'bg-[#DC143C] border-[#DC143C] text-white shadow-lg shadow-red-200 -translate-y-1' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-[#DC143C] hover:text-[#DC143C]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative group max-w-5xl mx-auto">
          {/* Floating UI Tooltip */}
          <div className="absolute -top-10 -left-6 bg-white p-3 rounded-2xl shadow-2xl border border-red-50 hidden lg:flex items-center gap-3 animate-bounce z-20">
            <div className="w-8 h-8 bg-red-50 text-[#DC143C] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <div className="text-left">
              <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Active Tool</div>
              <div className="text-xs font-black text-[#DC143C]">{activeCategory}</div>
            </div>
          </div>

          <BeforeAfterSlider activeCategory={activeCategory} />
        </div>
      </div>
    </section>
  );
};

export default Hero;