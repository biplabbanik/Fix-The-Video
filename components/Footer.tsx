
import React from 'react';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-white pt-24 pb-12 px-6 border-t border-red-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-8 h-8 bg-[#DC143C] rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
              </div>
              <span className="font-black text-lg text-gray-900 tracking-tighter uppercase">FIX THE VIDEO</span>
            </div>
            <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 uppercase tracking-tighter">
              World-class digital retouching for the high-end creative industry.
            </p>
          </div>

          <div>
            <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-xs">Services</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400 uppercase tracking-tight">
              <li><a href="#services" className="hover:text-[#DC143C] transition-colors">Rig Removal</a></li>
              <li><a href="#services" className="hover:text-[#DC143C] transition-colors">Beauty Fix</a></li>
              <li><a href="#services" className="hover:text-[#DC143C] transition-colors">Grade Sync</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-xs">Studio</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400 uppercase tracking-tight">
              <li><a href="#workflow" className="hover:text-[#DC143C] transition-colors">Workflow</a></li>
              <li><a href="#" className="hover:text-[#DC143C] transition-colors">About Us</a></li>
              <li>
                <button 
                  onClick={() => {
                    window.location.hash = '#admin';
                    if (onAdminClick) onAdminClick();
                  }}
                  className="hover:text-[#DC143C] transition-colors text-left outline-none"
                >
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-xs">Connect</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400 uppercase tracking-tight">
              <li><a href="#" className="hover:text-[#DC143C] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[#DC143C] transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-[#DC143C] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-red-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">
            <span>© 2026 FIX THE VIDEO</span>
          </div>
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#DC143C] hover:bg-[#DC143C] hover:text-white transition-all cursor-pointer">
                <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
