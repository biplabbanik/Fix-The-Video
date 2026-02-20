import React, { useState } from 'react';

interface ValueStackProps {
  onOpenModal: (service: string) => void;
}

const ValueCard: React.FC<{
  title: string;
  items: string[];
  image: string;
  onClick: () => void;
}> = ({ title, items, image, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-[2.5rem] overflow-hidden border border-red-50 hover:shadow-2xl transition-all duration-700 cursor-pointer"
  >
    <div className="h-[200px] relative overflow-hidden m-4 rounded-[2rem]">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
      <div className="absolute inset-0 bg-[#DC143C]/10"></div>
    </div>
    <div className="p-8 pt-2">
      <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-gray-500 text-sm font-semibold">
            <span className="text-[#DC143C]">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const ValueStack: React.FC<ValueStackProps> = ({ onOpenModal }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("FIXRED10");
    setCopied(true);
    // Log analytics as per schema
    console.log("Analytics Log:", { event_type: 'promo_code_copy', metadata: { code: 'FIXRED10' } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="workflow" className="py-24 px-6 bg-[#fdfdfd]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DC143C] mb-4 block">Our Standard</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase">
            Surgical <span className="gradient-text">Precision.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <ValueCard 
            title="Free Trial"
            image="https://lh3.googleusercontent.com/d/16ROKUEEC9bzvXpPh3DZTdzeOALduYfRi"
            items={["24h Proof of Concept", "Full Quality Export", "Zero Upfront Cost"]}
            onClick={() => onOpenModal('rig_removal')}
          />
          <ValueCard 
            title="Rapid Loops"
            image="https://lh3.googleusercontent.com/d/1Bcz97OK9YHQ7L1HQXEKM3grSPBy_1BZg"
            items={["2 Revision Rounds", "Direct Producer Chat", "Technical QC Check"]}
            onClick={() => onOpenModal('multiple_services')}
          />
          <ValueCard 
            title="Batch Ready"
            image="https://lh3.googleusercontent.com/d/1eRRfqPKcECgITnNEqeaJHaLbLcwif-Oy"
            items={["ProRes 4444 HQ", "4K/8K Resolution", "Cohesive Grading"]}
            onClick={() => onOpenModal('multiple_services')}
          />
        </div>

        {/* UPDATED BACKGROUND TO BLACK-TO-RED GRADIENT */}
        <div className="relative rounded-[3rem] bg-gradient-to-br from-[#0a0a0a] via-[#1A1A1A] to-[#4A0B16] p-10 md:p-14 text-white shadow-2xl overflow-hidden border border-white/10">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                 <h3 className="text-2xl md:text-4xl font-black mb-4 uppercase tracking-tighter italic">Batch Optimization</h3>
                 <p className="text-white/80 text-sm font-bold leading-relaxed mb-6 uppercase">
                   Save 10% on large campaign cycles (5+ assets).
                 </p>
                 <div 
                   onClick={handleCopyCode}
                   className="inline-flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-6 py-2 cursor-pointer hover:bg-white/20 transition-all active:scale-95 group"
                 >
                   <span className="text-lg font-black text-white tracking-widest">{copied ? 'COPIED!' : 'FIXRED10'}</span>
                   {!copied && (
                     <svg className="w-4 h-4 text-white/60 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                     </svg>
                   )}
                 </div>
              </div>
              
              <button 
                onClick={() => onOpenModal('multiple_services')}
                className="bg-white text-[#DC143C] px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all canva-btn"
              >
                Contact Studio
              </button>
           </div>
           
           {/* Subtle highlight effect for the dark theme */}
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#DC143C]/10 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default ValueStack;