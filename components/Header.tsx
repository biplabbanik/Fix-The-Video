import React from 'react';

interface HeaderProps {
  onOpenModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
      <div className="glass rounded-[2.5rem] px-8 py-3 flex items-center justify-between shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] border border-white/40">
        <div className="flex items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.hash = ''}>
            <div className="w-10 h-10 bg-[#DC143C] rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
            </div>
            <span className="font-black text-lg tracking-tighter text-gray-900 uppercase">FIX THE VIDEO</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={() => window.location.hash = '#dashboard'}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#DC143C] transition-colors"
          >
            LOGIN
          </button>
          <button 
            onClick={onOpenModal}
            className="bg-[#DC143C] hover:bg-[#b91c1c] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(220,20,60,0.2)] transition-all hover:scale-105 active:scale-95"
          >
            FIX MY VIDEO
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;