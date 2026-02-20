import React, { useState, useEffect } from 'react';

interface Revision {
  text: string;
  date: string;
  status: 'pending' | 'resolved';
}

interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  company: string;
  service: string;
  link: string;
  readyLink?: string; 
  status: 'sample' | 'analysis' | 'surgery' | 'qc' | 'master';
  isOrder?: boolean; 
  isPending?: boolean;
  isCancelled?: boolean;
  date: string;
  timestamp: number;
  unitPrice?: number;
  quantity?: number;
  totalPrice?: number;
  customerNote?: string;
  internalNotes?: string;
  revisions?: Revision[];
  finalFileReady?: boolean;
  finalFileLink?: string;
  finalFileNote?: string;
}

interface Customer {
  email: string;
  name: string;
  password?: string;
  role: 'customer';
}

interface AdminUser {
  email: string;
  name: string;
  isApproved: boolean;
  role: 'super' | 'staff';
}

interface AdminDashboardProps {
  onClose: () => void;
}

const SUPER_ADMIN_EMAIL = 'biplabbanik12@gmail.com';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'Priority' | 'Active' | 'Completed' | 'Cancelled' | 'Delivered'>('Active');
  const [listType, setListType] = useState<'All' | 'Samples' | 'Orders'>('Samples');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  
  // Filter States
  const [filterType, setFilterType] = useState<'Batch' | 'Date' | 'Email'>('Batch');
  const [filterValue, setFilterValue] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // State for management detail view
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [quoteInputs, setQuoteInputs] = useState<Record<string, { unit: number; qty: number; link: string; note: string }>>({});
  const [finalSubmitOrderId, setFinalSubmitOrderId] = useState<string | null>(null);
  const [finalFileData, setFinalFileData] = useState({ link: '', note: '' });

  useEffect(() => {
    // Permanent Persistence: Load existing records or keep empty array
    const savedAdmins = JSON.parse(localStorage.getItem('ftv_admins') || '[]');
    if (!savedAdmins.find((a: any) => a.email === SUPER_ADMIN_EMAIL)) {
      savedAdmins.push({ email: SUPER_ADMIN_EMAIL, name: 'Puja Banik', isApproved: true, role: 'super' });
      localStorage.setItem('ftv_admins', JSON.stringify(savedAdmins));
    }
    setAdmins(savedAdmins);

    const savedOrders = JSON.parse(localStorage.getItem('ftv_orders') || '[]');
    setOrders(savedOrders.map((o: any) => ({ 
      ...o, 
      timestamp: o.timestamp || new Date(o.date).getTime(), 
      isPending: o.isPending || false,
      isCancelled: o.isCancelled || false
    })));

    setCustomers(JSON.parse(localStorage.getItem('ftv_customers') || '[]'));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = admins.find(a => a.email === loginEmail);
    if (admin && loginPassword === 'admin123' && admin.isApproved) {
      setCurrentUser(admin);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Access Denied');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    onClose();
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, ...updates } : o);
    setOrders(updated);
    localStorage.setItem('ftv_orders', JSON.stringify(updated));
  };

  const toggleCancel = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newCancelledStatus = !order.isCancelled;
    updateOrder(orderId, { isCancelled: newCancelledStatus });

    // Simulate sending email to buyer when cancelled
    if (newCancelledStatus) {
      const savedThreads = JSON.parse(localStorage.getItem('ftv_chat_threads') || '[]');
      let threadIndex = savedThreads.findIndex((t: any) => t.customerEmail.toLowerCase() === order.customerEmail.toLowerCase());
      const chatMsg = `⚠️ NOTIFICATION: Your request ${order.id} has been cancelled by the laboratory. Please contact support for details.`;
      const newMessage = { id: Date.now().toString(), from: 'admin', text: chatMsg, timestamp: new Date().toISOString(), read: false };

      if (threadIndex !== -1) {
        savedThreads[threadIndex].messages.push(newMessage);
        savedThreads[threadIndex].unreadCount += 1;
        localStorage.setItem('ftv_chat_threads', JSON.stringify(savedThreads));
      }
      alert(`Request ${orderId} marked as Cancelled. Email notification sent to ${order.customerEmail}.`);
    }
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm(`Permanently delete project ${orderId}? This cannot be undone.`)) {
      const updated = orders.filter(o => o.id !== orderId);
      setOrders(updated);
      localStorage.setItem('ftv_orders', JSON.stringify(updated));
      setSelectedProjectId(null);
    }
  };

  const handleReadyLinkSubmit = (orderId: string) => {
    const data = quoteInputs[orderId];
    const order = orders.find(o => o.id === orderId);
    if (data && order) {
      const totalPrice = data.unit * data.qty;
      updateOrder(orderId, { 
        readyLink: data.link, 
        status: 'master',
        unitPrice: data.unit,
        quantity: data.qty,
        totalPrice: totalPrice,
        customerNote: data.note,
        isPending: false 
      });

      const savedThreads = JSON.parse(localStorage.getItem('ftv_chat_threads') || '[]');
      let threadIndex = savedThreads.findIndex((t: any) => t.customerEmail.toLowerCase() === order.customerEmail.toLowerCase());
      const chatMsg = `PROJECT SAMPLE READY: ${order.service.toUpperCase()}\n\nQuote: $${totalPrice.toFixed(2)} (${data.qty} units @ $${data.unit}/unit)\n\nNote: ${data.note || 'No additional notes.'}\n\nSample Link: ${data.link}`;
      const newMessage = { id: Date.now().toString(), from: 'admin', text: chatMsg, timestamp: new Date().toISOString(), read: false };

      if (threadIndex === -1) {
        savedThreads.push({ orderId: order.id, customerEmail: order.customerEmail, customerName: order.customerName, messages: [newMessage], unreadCount: 0 });
      } else {
        savedThreads[threadIndex].messages.push(newMessage);
      }
      localStorage.setItem('ftv_chat_threads', JSON.stringify(savedThreads));
      alert("Quote submitted successfully.");
    }
  };

  const handleFinalFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalSubmitOrderId || !finalFileData.link) return;
    const order = orders.find(o => o.id === finalSubmitOrderId);
    if (order) {
      updateOrder(finalSubmitOrderId, { finalFileReady: true, finalFileLink: finalFileData.link, finalFileNote: finalFileData.note, status: 'master' });
      const savedThreads = JSON.parse(localStorage.getItem('ftv_chat_threads') || '[]');
      let threadIndex = savedThreads.findIndex((t: any) => t.customerEmail.toLowerCase() === order.customerEmail.toLowerCase());
      const chatMsg = `🚨 FINAL MASTER FILE READY!\n\nYour project ${order.id} is complete.\n\nMaster Link: ${finalFileData.link}`;
      const newMessage = { id: Date.now().toString(), from: 'admin', text: chatMsg, timestamp: new Date().toISOString(), read: false };
      if (threadIndex === -1) {
        savedThreads.push({ orderId: order.id, customerEmail: order.customerEmail, customerName: order.customerName, messages: [newMessage], unreadCount: 1 });
      } else {
        savedThreads[threadIndex].messages.push(newMessage);
        savedThreads[threadIndex].unreadCount += 1;
      }
      localStorage.setItem('ftv_chat_threads', JSON.stringify(savedThreads));
      alert("Final Master Delivered!");
      setFinalSubmitOrderId(null);
      setFinalFileData({ link: '', note: '' });
    }
  };

  const applyFilter = () => {
    setAppliedSearch(filterValue);
  };

  const cancelFilter = () => {
    setFilterValue('');
    setAppliedSearch('');
  };

  const getFilteredOrders = () => {
    let list = [...orders];

    if (activeTab === 'Completed') list = list.filter(o => o.status === 'master' && !o.isCancelled);
    else if (activeTab === 'Active') list = list.filter(o => o.status !== 'master' && !o.isCancelled);
    else if (activeTab === 'Cancelled') list = list.filter(o => o.isCancelled);
    else if (activeTab === 'Delivered') list = list.filter(o => o.finalFileReady);
    
    if (listType === 'Samples') {
      list = list.filter(o => !o.isOrder);
    } else if (listType === 'Orders') {
      list = list.filter(o => o.isOrder);
    }

    if (appliedSearch) {
      const search = appliedSearch.toLowerCase();
      list = list.filter(o => {
        if (filterType === 'Batch') return o.id.toLowerCase().includes(search);
        if (filterType === 'Date') return o.date.toLowerCase().includes(search);
        if (filterType === 'Email') return o.customerEmail.toLowerCase().includes(search);
        return true;
      });
    }

    return list;
  };

  const stats = {
    samples: orders.filter(o => !o.isOrder && !o.isCancelled).length,
    orders: orders.filter(o => o.isOrder && !o.isCancelled).length,
  };

  const selectedOrder = orders.find(o => o.id === selectedProjectId);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#E5E7EB] flex items-center justify-center p-6 z-[2000]">
        <div className="bg-white w-full max-w-md rounded-[2rem] p-12 shadow-2xl border border-gray-100">
           <div className="w-16 h-16 bg-[#4A0B12] rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl text-xl font-black">FTV</div>
           <h2 className="text-2xl font-black text-center text-gray-900 uppercase tracking-tighter mb-8">Admin Access</h2>
           {error && <p className="text-red-500 text-[10px] font-black mb-6 text-center uppercase tracking-widest">{error}</p>}
           <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-xs font-bold focus:border-[#4A0B12] outline-none transition-all" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-xs font-bold focus:border-[#4A0B12] outline-none transition-all" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
              <button className="w-full bg-[#4A0B12] text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:opacity-90 active:scale-95">Enter Control Panel</button>
           </form>
           <button onClick={onClose} className="w-full mt-8 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#4A0B12] transition-colors">Exit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E5E7EB] font-sans text-gray-900 overflow-hidden">
      <aside className="w-64 bg-[#4A0B12] flex flex-col fixed inset-y-0 shadow-2xl z-50 rounded-r-[2rem]">
        <div className="p-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#F87171] rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg mb-4">
            {currentUser?.name.charAt(0)}
          </div>
          <span className="text-white font-black text-sm uppercase tracking-tighter">Admin Control</span>
          <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1">Laboratory Desk</span>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          <button 
            onClick={() => { setActiveTab('Active'); setListType('Samples'); setSelectedProjectId(null); cancelFilter(); }}
            className={`w-full text-left px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex flex-col bg-[#F87171] text-white shadow-xl transition-all`}
          >
             <div className="flex items-center gap-3">
               <span>📊</span>
               <span>Dashboard</span>
             </div>
             <span className="text-[8px] opacity-60 ml-7">System Overview</span>
          </button>
          {['Analytics', 'Earnings', 'Staff', 'Settings'].map((item) => (
            <button key={item} className="w-full text-left px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 text-white/50 hover:bg-white/5 hover:text-white transition-all">
              <span>📉</span> {item}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <button onClick={handleLogout} className="w-full bg-[#F87171]/10 text-[#F87171] py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#F87171] hover:text-white transition-all">
            🟠 Log Out
          </button>
        </div>
      </aside>

      <main className="flex-grow ml-64 p-10 overflow-y-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Welcome Admin</span>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Persistent Laboratory Records</h1>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="text-[10px] font-black uppercase text-gray-400 hover:text-gray-900">BACK</button>
            <div className="flex items-center gap-3 text-gray-500">
              <span className="text-xl">🔔</span>
              <span className="text-xl">✉️</span>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>

        <div className="bg-white/60 border border-gray-300 rounded-[1.5rem] p-5 flex items-center gap-6 mb-8 shadow-sm">
           <div className="flex flex-col gap-1 w-64">
              <span className="text-[9px] font-black uppercase text-gray-400 ml-2">Filter Type</span>
              <select 
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-[#4A0B12]/10 appearance-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                 <option value="Batch">By Batch Number</option>
                 <option value="Date">By Date</option>
                 <option value="Email">By Email</option>
              </select>
           </div>
           
           <div className="flex flex-col gap-1 flex-grow">
              <span className="text-[9px] font-black uppercase text-gray-400 ml-2">Enter {filterType} Identifier</span>
              <input 
                type="text"
                placeholder="Search database..."
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-[#4A0B12]/10 w-full"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
              />
           </div>
           
           <div className="flex gap-3 items-center mt-4">
              <button onClick={applyFilter} className="bg-[#4A0B12] text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">Apply Filter</button>
              {appliedSearch && <button onClick={cancelFilter} className="bg-gray-100 text-gray-500 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Cancel</button>}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
           <div 
             className={`rounded-[2rem] p-10 border relative group cursor-pointer transition-all duration-500 transform ${
               listType === 'Samples' 
               ? 'bg-[#4A0B12] text-white shadow-2xl scale-105 border-[#4A0B12]' 
               : 'bg-[#FEE2E2] text-red-900 border-red-100 opacity-80 hover:opacity-100'
             }`} 
             onClick={() => { setActiveTab('Active'); setListType('Samples'); setSelectedProjectId(null); }}
           >
              <div className="absolute top-6 right-8 px-3 py-1 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase">High</div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${listType === 'Samples' ? 'text-white/40' : 'text-red-800/40'}`}>Active Samples Request</span>
              <div className="text-4xl font-black mt-2">{stats.samples} Requests</div>
              <div className="mt-8 text-right">
                <span className={`text-[9px] font-black uppercase underline decoration-2 underline-offset-4 ${listType === 'Samples' ? 'text-white' : 'text-red-800'}`}>VIEW SAMPLES</span>
              </div>
           </div>

           <div 
             className={`rounded-[2rem] p-10 border relative group cursor-pointer transition-all duration-500 transform ${
               listType === 'Orders' 
               ? 'bg-[#4A0B12] text-white shadow-2xl scale-105 border-[#4A0B12]' 
               : 'bg-white text-gray-900 border-gray-200 opacity-80 hover:opacity-100'
             }`} 
             onClick={() => { setActiveTab('Active'); setListType('Orders'); setSelectedProjectId(null); }}
           >
              <div className="absolute top-6 right-8 px-3 py-1 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase">High</div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${listType === 'Orders' ? 'text-white/30' : 'text-gray-400'}`}>Active Orders</span>
              <div className="text-4xl font-black mt-2">{stats.orders} Orders</div>
              <div className="mt-8 text-right">
                <span className={`text-[9px] font-black uppercase underline decoration-2 underline-offset-4 ${listType === 'Orders' ? 'text-white' : 'text-gray-900'}`}>VIEW ORDERS</span>
              </div>
           </div>
        </div>

        <div className="flex gap-10 mb-8 border-b border-gray-300 pb-4">
           {['Active', 'Completed', 'Cancelled', 'Delivered'].map(tab => (
             <button 
               key={tab} 
               onClick={() => { setActiveTab(tab as any); setSelectedProjectId(null); }}
               className={`text-sm font-black uppercase tracking-tighter pb-4 transition-all ${activeTab === tab ? 'text-[#4A0B12] border-b-4 border-[#4A0B12]' : 'text-gray-400 hover:text-gray-600'}`}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="bg-white/40 rounded-[2.5rem] p-10 min-h-[500px] border border-gray-200">
           {!selectedProjectId ? (
             <>
               <div className="flex justify-between items-center mb-10">
                 <h2 className="text-xl font-black text-[#4A0B12] uppercase tracking-tighter italic">
                   {listType === 'Samples' ? 'Active Samples' : listType === 'Orders' ? 'Active Orders' : `${activeTab} Projects`}
                 </h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">
                      <tr>
                        <th className="pb-6 text-left pr-4">Batch No</th>
                        <th className="pb-6 text-left">Buyer</th>
                        <th className="pb-6 text-left">Email</th>
                        <th className="pb-6 text-left">Service</th>
                        <th className="pb-6 text-left">Init Date</th>
                        <th className="pb-6 text-left">Total</th>
                        <th className="pb-6 text-left">Status</th>
                        <th className="pb-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {getFilteredOrders().length === 0 ? (
                        <tr><td colSpan={8} className="py-24 text-center text-gray-300 text-[10px] font-black uppercase tracking-widest italic">Database Empty • No Matching Records</td></tr>
                      ) : getFilteredOrders().map(order => (
                        <tr key={order.id} className={`group hover:bg-white/60 cursor-pointer transition-all ${order.isCancelled ? 'opacity-60 bg-gray-50/50' : ''}`} onClick={() => setSelectedProjectId(order.id)}>
                          <td className="py-6 pr-4"><span className="text-[10px] font-black text-gray-400 uppercase">{order.id}</span></td>
                          <td className="py-6 flex items-center gap-3"><span className="text-xs font-black text-gray-700 uppercase tracking-tight">{order.customerName}</span></td>
                          <td className="py-6"><span className="text-[10px] font-bold text-gray-500 lowercase">{order.customerEmail}</span></td>
                          <td className="py-6 text-[10px] font-bold text-gray-500 uppercase">{order.service.replace('_', ' ')}</td>
                          <td className="py-6 text-[10px] font-bold text-gray-400 uppercase">{order.date}</td>
                          <td className="py-6 text-xs font-black text-gray-900">${order.totalPrice || 0}</td>
                          <td className="py-6">
                            {order.isCancelled ? (
                              <span className="px-4 py-2 rounded-xl text-[9px] font-black uppercase bg-red-500 text-white shadow-md">CANCELLED</span>
                            ) : (
                              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border shadow-sm ${order.status === 'master' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-gray-500 border-gray-100'}`}>{order.status}</span>
                            )}
                          </td>
                          <td className="py-6 text-center">
                             <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => toggleCancel(order.id)} className={`p-2 rounded-lg transition-all ${order.isCancelled ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                  {order.isCancelled ? '✅' : '🚫'}
                                </button>
                                <button onClick={() => deleteOrder(order.id)} className="p-2 rounded-lg bg-red-50 text-red-600">🗑️</button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
             </>
           ) : selectedOrder && (
             <div className="animate-in fade-in zoom-in-95 duration-500">
               <div className="flex justify-between items-center mb-10">
                 <button onClick={() => setSelectedProjectId(null)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#4A0B12]">← BACK TO LIST</button>
                 <div className="flex gap-4">
                    <button onClick={() => toggleCancel(selectedOrder.id)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg transition-all ${selectedOrder.isCancelled ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                      {selectedOrder.isCancelled ? 'RESTORE PROJECT' : 'CANCEL PROJECT'}
                    </button>
                    <button onClick={() => deleteOrder(selectedOrder.id)} className="bg-red-500 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg">DELETE PERMANENTLY</button>
                 </div>
               </div>

               <div className="grid lg:grid-cols-[1fr_380px] gap-12">
                  <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-gray-100">
                    <h4 className="text-[10px] font-black uppercase text-gray-300 mb-8 tracking-[0.3em]">WORKFLOW STAGE (INTERNAL)</h4>
                    <div className="flex flex-wrap gap-3 mb-12">
                      {['sample', 'analysis', 'surgery', 'qc', 'master'].map(s => (
                        <button 
                          key={s} 
                          onClick={() => updateOrder(selectedOrder.id, { status: s as any })} 
                          className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${selectedOrder.status === s ? 'bg-[#4A0B12] text-white shadow-2xl scale-105' : 'bg-gray-50 text-gray-300'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {selectedOrder.status === 'master' && (
                      <div className="p-10 bg-gray-100 rounded-[2.5rem] border border-gray-200 mb-12 shadow-inner">
                        <h5 className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-8 italic">Project Quote & Delivery</h5>
                        <div className="grid grid-cols-2 gap-8 mb-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Unit Price</label>
                            <input 
                              type="number" 
                              className="w-full bg-white border-none rounded-xl px-4 py-3 text-[11px] font-bold outline-none shadow-sm"
                              value={quoteInputs[selectedOrder.id]?.unit || selectedOrder.unitPrice || 0}
                              onChange={(e) => setQuoteInputs({...quoteInputs, [selectedOrder.id]: {...(quoteInputs[selectedOrder.id] || {link: '', qty: 1, note: ''}), unit: parseFloat(e.target.value)}})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Quantity</label>
                            <input 
                              type="number" 
                              className="w-full bg-white border-none rounded-xl px-4 py-3 text-[11px] font-bold outline-none shadow-sm"
                              value={quoteInputs[selectedOrder.id]?.qty || selectedOrder.quantity || 1}
                              onChange={(e) => setQuoteInputs({...quoteInputs, [selectedOrder.id]: {...(quoteInputs[selectedOrder.id] || {link: '', unit: 0, note: ''}), qty: parseInt(e.target.value)}})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2 mb-6">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Done Sample Link</label>
                           <input 
                             type="url" 
                             placeholder="Drive link to proof..."
                             className="w-full bg-white border-none rounded-xl px-4 py-3 text-[11px] font-bold outline-none shadow-sm"
                             value={quoteInputs[selectedOrder.id]?.link || selectedOrder.readyLink || ''}
                             onChange={(e) => setQuoteInputs({...quoteInputs, [selectedOrder.id]: {...(quoteInputs[selectedOrder.id] || {unit: 0, qty: 1, note: ''}), link: e.target.value}})}
                           />
                        </div>
                        <div className="space-y-2 mb-8">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Note For User</label>
                           <textarea 
                             rows={3}
                             placeholder="Technical brief for the client..."
                             className="w-full bg-white border-none rounded-xl px-4 py-3 text-[11px] font-bold outline-none shadow-sm"
                             value={quoteInputs[selectedOrder.id]?.note || selectedOrder.customerNote || ''}
                             onChange={(e) => setQuoteInputs({...quoteInputs, [selectedOrder.id]: {...(quoteInputs[selectedOrder.id] || {unit: 0, qty: 1, link: ''}), note: e.target.value}})}
                           />
                        </div>
                        
                        <div className="bg-[#FEE2E2] p-5 rounded-2xl flex justify-between items-center mb-8 border border-red-100">
                           <span className="text-[10px] font-black text-red-900/40 uppercase tracking-widest">Total Quote</span>
                           <span className="text-xl font-black text-red-900">${((quoteInputs[selectedOrder.id]?.unit || selectedOrder.unitPrice || 0) * (quoteInputs[selectedOrder.id]?.qty || selectedOrder.quantity || 1)).toFixed(0)}</span>
                        </div>

                        <button 
                          onClick={() => handleReadyLinkSubmit(selectedOrder.id)}
                          className="w-full bg-[#4A0B12] text-white py-5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-900/10 hover:opacity-90 transition-all"
                        >
                          Update and Send Quote
                        </button>
                      </div>
                    )}

                    <div className="flex gap-6 items-center">
                      <a href={selectedOrder.link} target="_blank" rel="noopener noreferrer" className="bg-[#1A1A1A] text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-gray-800 transition-all">
                        📁 DRIVE SOURCE
                      </a>
                      {selectedOrder.status === 'master' && (
                        <button 
                          onClick={() => {
                            setFinalSubmitOrderId(selectedOrder.id);
                            setFinalFileData({ link: selectedOrder.finalFileLink || '', note: selectedOrder.finalFileNote || '' });
                          }}
                          className="bg-[#4A0B12] text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-all flex items-center gap-3 border border-red-900/20"
                        >
                          🚀 SUBMIT FINAL MASTER
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl">
                      <h4 className="text-[10px] font-black uppercase text-gray-300 mb-6 tracking-widest">INTERNAL NOTES</h4>
                      <textarea className="w-full bg-gray-50 border-none rounded-2xl p-6 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-[#4A0B12]/10" rows={10} placeholder="Technical logs for operators..." value={selectedOrder.internalNotes || ''} onChange={(e) => updateOrder(selectedOrder.id, { internalNotes: e.target.value })} />
                    </div>
                  </div>
               </div>
             </div>
           )}
        </div>

        {finalSubmitOrderId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
              <button onClick={() => setFinalSubmitOrderId(null)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-8 italic">Final Master Delivery</h2>
              <form onSubmit={handleFinalFileSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Master Drive Link</label>
                   <input required type="url" placeholder="https://..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#4A0B12]/10" value={finalFileData.link} onChange={e => setFinalFileData({...finalFileData, link: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Delivery Note</label>
                   <textarea rows={4} placeholder="Surgery complete. All frames cleaned." className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#4A0B12]/10" value={finalFileData.note} onChange={e => setFinalFileData({...finalFileData, note: e.target.value})} />
                </div>
                <button className="w-full bg-[#10B981] text-white py-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all">Broadcast Final Master</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;