import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  from: 'admin' | 'user';
  text: string;
  timestamp: string;
  read: boolean;
}

interface ChatThread {
  orderId: string;
  customerEmail: string;
  customerName: string;
  messages: Message[];
  unreadCount: number;
}

interface ChatSystemProps {
  userEmail: string;
  userName: string;
  isAdmin: boolean;
  orderId?: string;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ userEmail, userName, isAdmin, orderId = 'GENERAL' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadAndSync = () => {
    const savedThreads = JSON.parse(localStorage.getItem('ftv_chat_threads') || '[]');
    const customers = JSON.parse(localStorage.getItem('ftv_customers') || '[]');
    
    if (isAdmin) {
      const syncedThreads = [...savedThreads];
      // Ensure all customers have a thread visibility in admin panel
      customers.forEach((c: any) => {
        if (!syncedThreads.find(t => t.customerEmail.toLowerCase() === c.email.toLowerCase())) {
          syncedThreads.push({
            orderId: 'NEW',
            customerEmail: c.email,
            customerName: c.name,
            messages: [],
            unreadCount: 0
          });
        }
      });
      setThreads(syncedThreads);
    } else {
      // For User, strictly filter their own thread
      const userThread = savedThreads.find((t: any) => t.customerEmail.toLowerCase() === userEmail.toLowerCase());
      setThreads(userThread ? [userThread] : []);
      setActiveThreadId(userEmail);
    }
  };

  useEffect(() => {
    loadAndSync();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ftv_chat_threads' || e.key === 'ftv_active_session') {
        loadAndSync();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadAndSync, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userEmail, isAdmin]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeThreadId, threads, isOpen]);

  const totalUnread = threads.reduce((acc, t) => acc + (isAdmin ? t.unreadCount : 0), 0);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const savedThreads = JSON.parse(localStorage.getItem('ftv_chat_threads') || '[]');
    let targetThreadId = isAdmin ? activeThreadId : userEmail;
    
    if (!targetThreadId) {
      alert("Please select a customer thread first.");
      return;
    }

    let threadIndex = savedThreads.findIndex((t: ChatThread) => t.customerEmail.toLowerCase() === targetThreadId?.toLowerCase());
    
    const newMessage: Message = {
      id: Date.now().toString(),
      from: isAdmin ? 'admin' : 'user',
      text: inputMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (threadIndex === -1) {
      const customers = JSON.parse(localStorage.getItem('ftv_customers') || '[]');
      const targetUser = customers.find((c: any) => c.email.toLowerCase() === targetThreadId?.toLowerCase());
      const newThread: ChatThread = {
        orderId: orderId,
        customerEmail: targetThreadId,
        customerName: targetUser?.name || targetThreadId,
        messages: [newMessage],
        unreadCount: isAdmin ? 0 : 1
      };
      savedThreads.push(newThread);
    } else {
      savedThreads[threadIndex].messages.push(newMessage);
      if (!isAdmin) {
        savedThreads[threadIndex].unreadCount += 1;
      } else {
        savedThreads[threadIndex].unreadCount = 0;
      }
    }

    localStorage.setItem('ftv_chat_threads', JSON.stringify(savedThreads));
    window.dispatchEvent(new Event('storage'));
    setInputMessage('');
    loadAndSync();
  };

  const activeThread = threads.find(t => t.customerEmail.toLowerCase() === activeThreadId?.toLowerCase());

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[500]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-[0_15px_40px_rgba(26,26,26,0.2)] transition-all hover:scale-110 active:scale-90 relative group ${isOpen ? 'bg-[#1A1A1A] rotate-90' : 'bg-[#DC143C]'}`}
        >
          {!isOpen && (isAdmin ? totalUnread : (activeThread?.unreadCount || 0)) > 0 && (
            <div className="absolute -top-1 -right-1 bg-white text-[#DC143C] text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#DC143C] shadow-xl animate-bounce">
              {isAdmin ? totalUnread : (activeThread?.unreadCount || 0)}
            </div>
          )}
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <div className="relative">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#DC143C] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
            </div>
          )}
        </button>
      </div>

      {/* Fixed Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] max-w-[420px] h-[75vh] max-h-[680px] bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden flex flex-col z-[501] animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Screenshot-matched Header */}
          <div className="bg-[#1A1A1A] p-8 text-white flex justify-between items-center shadow-lg">
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Studio Desk / Live</div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
                <div className="text-sm font-black uppercase tracking-tight">
                  {isAdmin ? (activeThread ? activeThread.customerName : 'SELECT CLIENT') : 'ADMIN (PUJA)'}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-grow flex overflow-hidden">
            {/* Admin Sidebar */}
            {isAdmin && (
              <div className="w-24 bg-gray-50 border-r border-gray-100 overflow-y-auto custom-scrollbar">
                {threads.map(t => (
                  <button 
                    key={t.customerEmail}
                    onClick={() => {
                      setActiveThreadId(t.customerEmail);
                      // Reset unread count locally and in storage
                      const saved = JSON.parse(localStorage.getItem('ftv_chat_threads') || '[]');
                      const idx = saved.findIndex((th: any) => th.customerEmail.toLowerCase() === t.customerEmail.toLowerCase());
                      if (idx !== -1) {
                        saved[idx].unreadCount = 0;
                        localStorage.setItem('ftv_chat_threads', JSON.stringify(saved));
                        window.dispatchEvent(new Event('storage'));
                      }
                    }}
                    className={`w-full p-4 text-center border-b border-gray-100 transition-all ${activeThreadId?.toLowerCase() === t.customerEmail.toLowerCase() ? 'bg-white font-black' : 'opacity-40 hover:opacity-100'}`}
                  >
                    <div className="text-[9px] uppercase truncate">{t.customerName.charAt(0)}</div>
                    {t.unreadCount > 0 && <div className="mx-auto w-1.5 h-1.5 bg-[#DC143C] rounded-full mt-1"></div>}
                  </button>
                ))}
              </div>
            )}

            {/* Message Area */}
            <div className="flex-grow flex flex-col bg-[#F9FAFB]">
              <div ref={scrollRef} className="flex-grow p-6 space-y-6 overflow-y-auto custom-scrollbar">
                {activeThread && activeThread.messages.length > 0 ? (
                  activeThread.messages.map(m => (
                    <div key={m.id} className={`flex ${m.from === (isAdmin ? 'admin' : 'user') ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] p-5 rounded-[2rem] text-[12px] font-bold leading-relaxed shadow-sm break-words ${
                        m.from === 'admin' 
                          ? 'bg-[#DC143C] text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{isAdmin ? 'Select thread' : 'Initializin technical session...'}</p>
                  </div>
                )}
              </div>

              {/* Input Terminal */}
              <div className="p-6 bg-white border-t border-gray-50">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    placeholder="TYPE SPECIALIZED MESSAGE..."
                    className="w-full bg-[#F3F6F9] border-none rounded-full px-6 py-4 text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-[#DC143C]/10 transition-all"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-2 w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center transition-all hover:bg-[#DC143C]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div className="text-center mt-3">
                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">End-To-End Secure Terminal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
      `}</style>
    </>
  );
};

export default ChatSystem;