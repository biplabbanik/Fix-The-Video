
import React, { useState, useEffect } from 'react';

interface FinalCTAProps {
  onOpenModal: (service: string) => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenModal }) => {
  const [timeLeft, setTimeLeft] = useState(86399);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 86399));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section className="relative py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-8">
          <div className="w-2 h-2 bg-[#DC143C] rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-[#DC143C] uppercase tracking-widest">Slots Available for Q2</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight uppercase">
          Perfect your <br />
          <span className="gradient-text">campaign vision.</span>
        </h2>
        
        <p className="text-gray-400 text-lg font-bold max-w-2xl mx-auto mb-16 leading-relaxed uppercase tracking-tighter">
          Don't settle for flawed footage. Join the brands that choose studio perfection.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
           <div className="bg-red-50/20 p-10 rounded-[2.5rem] border border-red-50">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Slot Countdown</span>
              <div className="text-4xl font-black text-[#DC143C] tracking-tighter mb-2">
                {formatTime(timeLeft)}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase italic">Until daily reset</p>
           </div>
           
           <div className="flex flex-col gap-4">
              <button 
                onClick={() => onOpenModal('multiple_services')}
                className="bg-[#DC143C] text-white py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-[#b91c1c] transition-all canva-btn"
              >
                Start My Project
              </button>
              <div className="flex justify-center gap-8 opacity-40">
                <span className="text-[10px] font-bold uppercase tracking-widest">Global Support</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">24h Response</span>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 pt-16 border-t border-red-50">
           <a href="mailto:hello@fixthevideo.com" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#DC143C] group-hover:bg-[#DC143C] group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span className="text-sm font-bold text-gray-900 transition-colors uppercase tracking-tight">hello@fixthevideo.com</span>
           </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
