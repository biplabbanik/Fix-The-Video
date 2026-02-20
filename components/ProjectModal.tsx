import React, { useState, useEffect } from 'react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService: string | null;
  type?: 'sample' | 'order';
  currentUser?: { email: string; name: string } | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, initialService, type = 'sample', currentUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    serviceType: initialService || 'rig_removal',
    footageLink: '',
    password: '',
    optIn: true
  });

  // Sync initial service if changed via props
  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, serviceType: initialService }));
    }
  }, [initialService, isOpen]);

  // Reset state when opening/closing or user changes
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.name,
        email: currentUser.email,
        password: '', 
        company: ''
      }));
    } else {
      setFormData({
        fullName: '',
        email: '',
        company: '',
        serviceType: initialService || 'rig_removal',
        footageLink: '',
        password: '',
        optIn: true
      });
    }
    setErrorMessage('');
    setSubmitted(false);
  }, [currentUser, isOpen, initialService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Logic: Check if mail already exists in guest mode (Image 3)
    if (!currentUser) {
      const savedCustomers = JSON.parse(localStorage.getItem('ftv_customers') || '[]');
      const existingUser = savedCustomers.find((c: any) => c.email.toLowerCase() === formData.email.toLowerCase());
      
      if (existingUser) {
        setErrorMessage("The mail already exists.");
        return;
      }
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Register new user if guest
    if (!currentUser) {
      const savedCustomers = JSON.parse(localStorage.getItem('ftv_customers') || '[]');
      savedCustomers.push({ 
        email: formData.email, 
        name: formData.fullName, 
        password: formData.password, 
        role: 'customer' 
      });
      localStorage.setItem('ftv_customers', JSON.stringify(savedCustomers));
    }

    const savedOrders = JSON.parse(localStorage.getItem('ftv_orders') || '[]');
    const isDirectOrder = type === 'order';
    
    const newOrder = {
      id: `${isDirectOrder ? 'ORD' : 'SMPL'}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerEmail: currentUser ? currentUser.email : formData.email,
      customerName: currentUser ? currentUser.name : formData.fullName,
      company: formData.company || (currentUser ? 'Internal Client' : ''),
      service: formData.serviceType,
      link: formData.footageLink,
      status: 'processing',
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      isOrder: isDirectOrder,
      totalPrice: 0, 
      quantity: 0
    };
    
    savedOrders.push(newOrder);
    localStorage.setItem('ftv_orders', JSON.stringify(savedOrders));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const servicesList = [
    { id: 'rig_removal', name: 'Rig Removal' },
    { id: 'background_removal', name: 'Background Removal' },
    { id: 'video_cleanup', name: 'Video Cleanup' },
    { id: 'logo_removal', name: 'Logo Removal' },
    { id: 'video_rotoscoping', name: 'Rotoscoping' },
    { id: 'video_debanding', name: 'Debanding' },
    { id: 'reflections_removal', name: 'Reflections/Glare' },
    { id: 'color_correction', name: 'Color Matching' },
    { id: 'green_screen', name: 'Green Screen' }
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-xl rounded-[4rem] shadow-[0_32px_128px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-[#DC143C] transition-all z-20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-12 md:p-16">
          {!submitted ? (
            <>
              <div className="mb-10 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block text-[#DC143C]">
                  STUDIO INTAKE
                </span>
                <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase leading-none">
                  {currentUser ? 'INITIALIZE SAMPLE.' : 'INITIALIZE YOUR PROJECT.'}
                </h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase mt-6 tracking-widest leading-relaxed">
                  {currentUser ? 'COMPLIMENTARY TECHNICAL PROOF (5-FRAME SURGERY).' : 'COMPLIMENTARY 5-FRAME TECHNICAL SAMPLE.'}
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!currentUser ? (
                  /* GUEST FORM (Image 3) */
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-300 tracking-widest ml-1">IDENTITY</label>
                        <input required type="text" className="w-full bg-[#F3F6F9] border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-red-100 outline-none" placeholder="Jane Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-300 tracking-widest ml-1">WORK EMAIL</label>
                        <input required type="email" className="w-full bg-[#F3F6F9] border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-red-100 outline-none" placeholder="jane@agency.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-300 tracking-widest ml-1">FOOTAGE ACCESS (DRIVE/DROPBOX/WETRANSFER)</label>
                      <input required type="url" className="w-full bg-[#F3F6F9] border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-red-100 outline-none" placeholder="https://..." value={formData.footageLink} onChange={e => setFormData({...formData, footageLink: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-300 tracking-widest ml-1">STUDIO PASSWORD</label>
                      <input required type="password" className="w-full bg-[#F3F6F9] border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-red-100 outline-none" placeholder="Dashboard Access" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                  </>
                ) : (
                  /* INTERNAL FORM (Image 1) */
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-300 tracking-widest ml-1">LAB MODULE</label>
                        <div className="relative">
                          <select 
                            className="w-full bg-[#F3F6F9] border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-red-100 outline-none appearance-none cursor-pointer"
                            value={formData.serviceType}
                            onChange={e => setFormData({...formData, serviceType: e.target.value})}
                          >
                            {servicesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-300 tracking-widest ml-1">COMPANY (OPTIONAL)</label>
                        <input type="text" className="w-full bg-[#F3F6F9] border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-red-100 outline-none" placeholder="Studio X" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-300 tracking-widest ml-1">FOOTAGE ACCESS (DRIVE/DROPBOX/WETRANSFER)</label>
                      <input required type="url" className="w-full bg-[#F3F6F9] border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-red-100 outline-none" placeholder="https://..." value={formData.footageLink} onChange={e => setFormData({...formData, footageLink: e.target.value})} />
                    </div>
                  </>
                )}

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#DC143C] text-white py-6 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-red-500/10 hover:bg-[#b91c1c] active:scale-95 transition-all disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'CALIBRATING...' : (currentUser ? 'SUBMIT SAMPLE ASSET' : 'SUBMIT ASSET')}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-2 border-white">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-4">SUCCESSFULLY QUEUED.</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-10 italic">LABORATORY INITIALIZED. 24H TECHNICAL TURNAROUND ACTIVE.</p>
              <button 
                onClick={() => { setSubmitted(false); onClose(); }} 
                className="bg-[#1A1A1A] text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
              >
                RETURN TO LAB
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;