import React, { useState } from 'react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ 
  phoneNumber = "8801712345678", 
  defaultMessage = "Hi! I'm interested in your video editing services." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickReplies = [
    "Request Free Sample",
    "Pricing Information",
    "Turnaround Time"
  ];

  const handleSend = (text: string = message) => {
    const finalMsg = encodeURIComponent(text || defaultMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${finalMsg}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {/* Chat Popup */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[340px] glass rounded-[3rem] shadow-[0_30px_90px_rgba(0,0,0,0.2)] overflow-hidden border border-white/70 animate-in slide-in-from-bottom-8 fade-in zoom-in-95 duration-500">
          {/* Enhanced Header with Gradient and Pulse */}
          <div className="bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54] p-8 text-white relative overflow-hidden">
            {/* Ambient background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
               </svg>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-inner transform rotate-3">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.766-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.522-2.961-2.638-.086-.117-.718-.952-.718-1.813 0-.861.448-1.284.607-1.455.158-.171.347-.213.462-.213.117 0 .231.003.332.006.109.004.249-.042.391.291.144.344.49 1.196.53 1.281.043.085.07.185.015.295-.058.114-.085.185-.173.284-.085.1-.183.226-.263.305-.091.092-.186.192-.08.375.106.182.469.774.996 1.25.688.618 1.261.815 1.444.907.183.092.291.079.398-.046.106-.125.457-.533.579-.716.121-.182.241-.153.402-.094.161.059 1.02.481 1.192.569.173.085.292.128.335.204.042.074.042.433-.102.839z"/></svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-[3px] border-[#075E54] rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-black tracking-tight leading-none">Engineering Desk</div>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="bg-gray-50/80 p-5 rounded-3xl border border-gray-100">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                Welcome to <span className="text-[#DC143C]">FIX THE VIDEO</span>. Our technical team is ready to analyze your assets.
               </p>
            </div>
            
            <div className="space-y-2.5">
              <span className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] block ml-1 mb-2">QUICK ACTIONS</span>
              {quickReplies.map((reply) => (
                <button 
                  key={reply}
                  onClick={() => handleSend(reply)}
                  className="w-full text-left px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#DC143C] hover:border-[#DC143C]/20 hover:shadow-xl hover:shadow-red-500/5 transition-all active:scale-[0.98]"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="relative mt-8 group">
              <input 
                type="text" 
                placeholder="Brief your requirements..."
                className="w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] px-6 py-5 text-[10px] font-bold outline-none focus:ring-4 focus:ring-[#25D366]/5 focus:bg-white transition-all shadow-inner"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#25D366] text-white rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-green-500/20 transition-all hover:scale-105 active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>

            <div className="flex justify-center pt-2">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">End-to-End Encryption Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button with Pulse Glow */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-[0_15px_45px_rgba(37,211,102,0.3)] transition-all hover:scale-110 active:scale-90 group relative overflow-hidden ${isOpen ? 'bg-gray-900 text-white rotate-90 shadow-none' : 'bg-[#25D366] text-white'}`}
      >
        {!isOpen && (
          <>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -inset-1 bg-white/40 blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
          </>
        )}
        
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-10 h-10 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.766-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.522-2.961-2.638-.086-.117-.718-.952-.718-1.813 0-.861.448-1.284.607-1.455.158-.171.347-.213.462-.213.117 0 .231.003.332.006.109.004.249-.042.391.291.144.344.49 1.196.53 1.281.043.085.07.185.015.295-.058.114-.085.185-.173.284-.085.1-.183.226-.263.305-.091.092-.186.192-.08.375.106.182.469.774.996 1.25.688.618 1.261.815 1.444.907.183.092.291.079.398-.046.106-.125.457-.533.579-.716.121-.182.241-.153.402-.094.161.059 1.02.481 1.192.569.173.085.292.128.335.204.042.074.042.433-.102.839z"/></svg>
          </div>
        )}
      </button>

      {/* Pulsing indicator outside the main button when closed */}
      {!isOpen && (
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-[#DC143C] border-[3px] border-white rounded-full z-10 animate-pulse shadow-lg"></div>
      )}
    </div>
  );
};

export default WhatsAppWidget;