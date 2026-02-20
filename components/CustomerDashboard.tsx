import React, { useState, useEffect } from 'react';

interface CustomerDashboardProps {
  onClose: () => void;
  onInitiatePayment?: (orderId: string) => void;
  onOpenModal?: (service: string | null, type: 'sample' | 'order') => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onClose, onInitiatePayment, onOpenModal }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const activeSession = localStorage.getItem('ftv_active_session');
    if (activeSession) {
      const user = JSON.parse(activeSession);
      if (user.role === 'customer') {
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const fetchOrders = () => {
        const savedOrders = JSON.parse(localStorage.getItem('ftv_orders') || '[]');
        setOrders(savedOrders.filter((o: any) => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()));
      };
      fetchOrders();
      const interval = setInterval(fetchOrders, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const customers = JSON.parse(localStorage.getItem('ftv_customers') || '[]');
    const user = customers.find((c: any) => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
    
    if (user) { 
      setCurrentUser(user); 
      setIsLoggedIn(true); 
      setError(''); 
      localStorage.setItem('ftv_active_session', JSON.stringify(user));
      window.dispatchEvent(new Event('storage'));
    }
    else { 
      setError('Authentication Failed. Check your credentials.'); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ftv_active_session');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedOrderId(null);
    onClose();
    window.dispatchEvent(new Event('storage'));
  };

  const getStatusStep = (status: string) => {
    switch(status) {
      case 'sample': return 1;
      case 'analysis': return 2;
      case 'surgery': return 3;
      case 'qc': return 4;
      case 'master': return 5;
      default: return 1;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'sample': return 'LAB INTAKE';
      case 'analysis': return 'TECHNICAL ANALYSIS';
      case 'surgery': return 'FRAME SURGERY';
      case 'qc': return 'QUALITY CONTROL';
      case 'master': return 'ASSET READY';
      default: return 'IN QUEUE';
    }
  };

  const sampleRequests = orders.filter(o => !o.isOrder);
  const officialOrders = orders.filter(o => o.isOrder);
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl border border-gray-50 flex flex-col md:flex-row overflow-hidden">
          <div className="hidden md:block md:w-1/2 relative bg-gray-900">
            <img src="https://images.unsplash.com/photo-1492691523567-307300defc5f?auto=format&fit=crop&q=80&w=1200" alt="Retouching" className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#DC143C]/60 to-transparent"></div>
            <div className="absolute bottom-16 left-16 right-16">
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Studio Portal</h3>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">Precision Video Lab</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-12 md:p-24">
            <div className="mb-12">
              <div className="w-16 h-16 bg-[#DC143C] rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl mb-8">FTV</div>
              <h2 className="text-3xl font-black text-gray-900 uppercase">Welcome Back</h2>
            </div>
            {error && <p className="text-red-500 text-[10px] font-black mb-8 uppercase bg-red-50 p-4 rounded-xl">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-6">
              <input required type="email" placeholder="Email" className="w-full bg-[#F9FAFB] rounded-[1.5rem] px-8 py-5 text-xs font-bold outline-none" value={email} onChange={e => setEmail(e.target.value)} />
              <input required type="password" placeholder="Password" className="w-full bg-[#F9FAFB] rounded-[1.5rem] px-8 py-5 text-xs font-bold outline-none" value={password} onChange={e => setPassword(e.target.value)} />
              <button className="w-full bg-[#DC143C] text-white py-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all hover:bg-[#b91c1c]">Log In</button>
            </form>
            <button onClick={onClose} className="mt-12 text-[10px] font-black text-gray-300 uppercase tracking-widest w-full text-center hover:text-red-600">Return Home</button>
          </div>
        </div>
      </div>
    );
  }

  const renderProjectCard = (order: any) => (
    <button 
      key={order.id} 
      onClick={() => setSelectedOrderId(order.id)}
      className="w-full text-left bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 hover:-translate-y-1 transition-all group flex items-center justify-between"
    >
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xs ${order.isOrder ? 'bg-amber-400 shadow-[0_10px_20px_rgba(251,191,36,0.2)]' : 'bg-[#DC143C] shadow-[0_10px_20px_rgba(220,20,60,0.2)]'}`}>
           {order.isOrder ? 'ORD' : 'SMP'}
        </div>
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{order.id} • {order.date}</div>
          <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight group-hover:text-[#DC143C] transition-colors">{order.service.replace('_', ' ')}</h4>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {order.finalFileReady && (
          <div className="mr-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-full uppercase tracking-widest animate-pulse">
            FILE READY
          </div>
        )}
        <div className="text-right hidden sm:block">
           <span className="text-[9px] font-black text-gray-300 uppercase block mb-1">STATUS</span>
           <span className="text-[10px] font-black text-gray-900 uppercase">{getStatusText(order.status)}</span>
        </div>
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-[#DC143C] group-hover:text-white transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-10 md:p-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="bg-white p-10 rounded-[3rem] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setSelectedOrderId(null)}
              className="w-16 h-16 bg-[#DC143C] rounded-[2rem] flex items-center justify-center text-white font-black text-2xl shadow-lg hover:scale-105 transition-all"
            >
              {currentUser?.name?.charAt(0).toLowerCase() || 'u'}
            </button>
            <div>
              <div className="flex items-center gap-3">
                 {selectedOrderId && (
                   <button onClick={() => setSelectedOrderId(null)} className="text-[10px] font-black text-[#DC143C] uppercase tracking-widest hover:underline">← BACK TO LIST</button>
                 )}
                 <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                   {selectedOrderId ? 'PROJECT TERMINAL' : 'MY LABORATORY'}
                 </h1>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 leading-none">ACCOUNT: {currentUser?.name?.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-white border border-gray-100 px-10 py-3.5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors">LOG OUT SESSION</button>
        </header>

        {!selectedOrderId && orders.some(o => o.finalFileReady) && (
          <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-700">
             <div className="flex items-center gap-6 text-center md:text-left">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shadow-inner">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                   <h3 className="text-xl font-black uppercase tracking-tight">Your project file is ready.</h3>
                   <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Visit your project dashboard to access master assets.</p>
                </div>
             </div>
             <button onClick={() => setSelectedOrderId(orders.find(o => o.finalFileReady).id)} className="bg-white text-emerald-600 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
                VIEW ASSET
             </button>
          </div>
        )}

        {!selectedOrderId ? (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-8 bg-[#DC143C] rounded-full"></div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Active Samples</h3>
              </div>
              <div className="space-y-4">
                {sampleRequests.length > 0 ? sampleRequests.map(renderProjectCard) : (
                  <div className="p-14 text-center bg-white rounded-[2rem] border border-dashed border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No active trials</p>
                  </div>
                )}
                <button 
                  onClick={() => onOpenModal && onOpenModal(null, 'sample')}
                  className="w-full flex items-center justify-center gap-6 p-10 bg-white border-2 border-black rounded-[3rem] transition-all hover:bg-gray-50 active:scale-[0.98] group shadow-sm"
                >
                  <div className="w-12 h-12 bg-red-50/60 rounded-2xl flex items-center justify-center text-[#DC143C] shadow-sm">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-sm font-black text-[#DC143C] uppercase tracking-widest">Add New Sample</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-8 bg-amber-400 rounded-full"></div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Confirmed Orders</h3>
              </div>
              <div className="space-y-4">
                {officialOrders.length > 0 ? officialOrders.map(renderProjectCard) : (
                  <div className="p-14 text-center bg-white rounded-[2rem] border border-dashed border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No official projects</p>
                  </div>
                )}
                <button 
                  onClick={() => onOpenModal && onOpenModal(null, 'order')}
                  className="w-full flex items-center justify-center gap-6 p-10 bg-white border-2 border-dashed border-amber-200 rounded-[3rem] transition-all hover:bg-amber-50/10 active:scale-[0.98] group"
                >
                  <div className="w-12 h-12 bg-amber-50/60 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-sm font-black text-amber-500 uppercase tracking-widest">Place New Order</span>
                </button>
              </div>
            </div>
          </div>
        ) : selectedOrder && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[3.5rem] p-14 border border-gray-50 shadow-xl relative overflow-hidden">
              
              {selectedOrder.finalFileReady && (
                <div className="mb-12 p-10 bg-emerald-50 border border-emerald-100 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-emerald-900 uppercase tracking-tight">Your project file is ready.</h4>
                      <p className="text-[11px] font-bold text-emerald-700/60 uppercase tracking-widest mt-1">Master quality assets are now accessible below.</p>
                      {selectedOrder.finalFileNote && <p className="mt-4 text-[12px] font-bold text-emerald-900 italic leading-relaxed">"{selectedOrder.finalFileNote}"</p>}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <a href={selectedOrder.finalFileLink} target="_blank" rel="noreferrer" className="bg-[#1A1A1A] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">DOWNLOAD</a>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-12">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-black text-gray-300 uppercase">{selectedOrder.id}</span>
                    <span className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full ${selectedOrder.isOrder ? 'bg-amber-100 text-amber-700' : 'bg-red-50 text-red-500'}`}>
                      {selectedOrder.isOrder ? 'OFFICIAL ORDER' : 'FREE SAMPLE'}
                    </span>
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">{selectedOrder.service.replace('_', ' ')}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-4">INITIALIZED: {selectedOrder.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-300 uppercase block mb-1">LAB STAGE</span>
                  <span className="text-lg font-black text-[#DC143C] uppercase">{getStatusText(selectedOrder.status)}</span>
                </div>
              </div>

              <div className="relative mb-20 px-10 pt-10">
                <div className="absolute top-[4.5rem] left-0 w-full h-1.5 bg-[#F3F3F3] -translate-y-1/2 rounded-full"></div>
                <div className="absolute top-[4.5rem] left-0 h-1.5 bg-[#DC143C] -translate-y-1/2 transition-all duration-1000 rounded-full" style={{ width: `${(getStatusStep(selectedOrder.status) - 1) * 25}%` }}></div>
                <div className="relative flex justify-between">
                  {['SAMPLE', 'ANALYSIS', 'SURGERY', 'QC', 'MASTER'].map((l, i) => (
                    <div key={l} className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all shadow-md relative z-10 ${getStatusStep(selectedOrder.status) >= i+1 ? 'bg-[#DC143C] border-white' : 'bg-white border-[#F3F3F3]'}`}>
                         {getStatusStep(selectedOrder.status) > i+1 ? <span className="text-white text-xs">✓</span> : <div className={`w-3 h-3 rounded-full ${getStatusStep(selectedOrder.status) === i+1 ? 'bg-white' : 'hidden'}`}></div>}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest mt-6 ${getStatusStep(selectedOrder.status) >= i+1 ? 'text-gray-900' : 'text-gray-200'}`}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.totalPrice > 0 && (
                <div className="mb-12 p-10 bg-emerald-50/50 border border-emerald-100 rounded-[3rem] shadow-inner">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                      <div className="text-center md:text-left flex-grow">
                         <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Project Valuation</span>
                         </div>
                         <h4 className="text-4xl font-black text-emerald-900 uppercase tracking-tighter">Total: ${selectedOrder.totalPrice.toFixed(2)}</h4>
                         <p className="text-[11px] font-bold text-emerald-700/60 uppercase mt-2 italic">Calculated for {selectedOrder.quantity} frames/assets @ ${selectedOrder.unitPrice}/unit</p>
                         
                         {selectedOrder.customerNote && (
                           <div className="mt-6 p-6 bg-white/60 rounded-[2rem] border border-emerald-100 shadow-sm">
                              <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block mb-2">Technician Note:</span>
                              <p className="text-[12px] font-bold text-emerald-900 leading-relaxed italic">"{selectedOrder.customerNote}"</p>
                           </div>
                         )}
                      </div>
                      
                      {selectedOrder.isOrder && (
                        <div className="flex flex-col items-center gap-3">
                           <div className="text-emerald-600 font-black text-[11px] uppercase tracking-widest bg-white px-8 py-4 rounded-[1.5rem] border border-emerald-200 flex-shrink-0 shadow-sm flex items-center gap-3">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                             Active Laboratory Cycle
                           </div>
                           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Payment Processed</span>
                        </div>
                      )}
                   </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-gray-50">
                {(selectedOrder.finalFileReady || (selectedOrder.status === 'master' && selectedOrder.readyLink)) ? (
                  <a href={selectedOrder.finalFileLink || selectedOrder.readyLink} target="_blank" rel="noreferrer" className="bg-[#DC143C] text-white px-14 py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 hover:bg-[#b91c1c] transition-all">
                    🚀 DOWNLOAD MASTER ASSET
                  </a>
                ) : (
                  <a href={selectedOrder.link} target="_blank" rel="noreferrer" className="bg-[#1A1A2E] text-white px-14 py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:bg-slate-800 transition-colors">
                    📂 REVIEW SOURCES
                  </a>
                )}
                
                {!selectedOrder.isOrder && selectedOrder.totalPrice > 0 && (
                  <button 
                    onClick={() => onInitiatePayment && onInitiatePayment(selectedOrder.id)}
                    className="bg-emerald-500 text-white px-14 py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-105 transition-all"
                  >
                    APPROVE AND CONFIRM ORDER
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 && (
           <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-200">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">NO ASSETS FOUND IN THE LAB</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;