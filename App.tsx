import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PainPoint from './components/PainPoint';
import Services from './components/Services';
import TrustBridge from './components/TrustBridge';
import ValueStack from './components/ValueStack';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import PaymentPage from './components/PaymentPage';
import WhatsAppWidget from './components/WhatsAppWidget';
import ChatSystem from './components/ChatSystem';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'sample' | 'order'>('sample');
  const [view, setView] = useState<'main' | 'admin' | 'customer' | 'payment'>('main');
  const [selectedOrderIdForPayment, setSelectedOrderIdForPayment] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: 'admin' | 'customer' } | null>(null);

  useEffect(() => {
    // SEEDING TEST DATA FOR pujabanik719@gmail.com
    const seedTestData = () => {
      const testEmail = 'pujabanik719@gmail.com';
      const customers = JSON.parse(localStorage.getItem('ftv_customers') || '[]');
      const orders = JSON.parse(localStorage.getItem('ftv_orders') || '[]');
      const chatThreads = JSON.parse(localStorage.getItem('ftv_chat_threads') || '[]');

      // 1. Ensure test customer exists
      if (!customers.find((c: any) => c.email.toLowerCase() === testEmail.toLowerCase())) {
        customers.push({
          email: testEmail,
          name: 'Puja',
          password: '123',
          role: 'customer'
        });
        localStorage.setItem('ftv_customers', JSON.stringify(customers));
      }

      // 2. Ensure a sample order exists
      if (!orders.find((o: any) => o.id === 'SMPL-2167')) {
        orders.push({
          id: 'SMPL-2167',
          customerEmail: testEmail,
          customerName: 'Puja',
          company: 'Personal Lab',
          service: 'rig_removal',
          link: 'https://drive.google.com/drive/u/0/folders/1CBwDJJcQfk4HaLCJX',
          status: 'ready',
          date: new Date().toLocaleDateString(),
          timestamp: Date.now(),
          isOrder: false,
          unitPrice: 200,
          quantity: 20,
          totalPrice: 4000,
          customerNote: "eta 100/ video hisebe kora hoyeche"
        });
        localStorage.setItem('ftv_orders', JSON.stringify(orders));
      }

      // 3. Ensure a chat thread exists
      if (!chatThreads.find((t: any) => t.customerEmail.toLowerCase() === testEmail.toLowerCase())) {
        chatThreads.push({
          orderId: 'SMPL-2167',
          customerEmail: testEmail,
          customerName: 'Puja',
          unreadCount: 0,
          messages: [
            {
              id: 'msg-1',
              from: 'admin',
              text: 'Welcome to Fix The Video Studio. Your project SMPL-2167 is currently in the analysis phase.',
              timestamp: new Date().toISOString(),
              read: true
            }
          ]
        });
        localStorage.setItem('ftv_chat_threads', JSON.stringify(chatThreads));
      }
    };

    seedTestData();

    const handleHashChange = () => {
      const hash = window.location.hash;
      const activeSession = localStorage.getItem('ftv_active_session');
      
      // Update User Session Status on every change
      if (activeSession) {
        setCurrentUser(JSON.parse(activeSession));
      } else {
        // If no dashboard session, still check if admin manually set
        if (hash !== '#admin') {
          setCurrentUser(null);
        }
      }

      if (hash === '#admin') {
        setView('admin');
        const savedAdmins = JSON.parse(localStorage.getItem('ftv_admins') || '[]');
        const activeAdmin = savedAdmins.find((a: any) => a.email === 'biplabbanik12@gmail.com') || savedAdmins[0];
        if (activeAdmin) {
          setCurrentUser({ email: activeAdmin.email, name: activeAdmin.name, role: 'admin' });
        }
      } else if (hash === '#dashboard') {
        setView('customer');
      } else if (hash === '#payment' && selectedOrderIdForPayment) {
        setView('payment');
      } else {
        setView('main');
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('storage', handleHashChange);
    handleHashChange();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('storage', handleHashChange);
    };
  }, [selectedOrderIdForPayment]);

  const openModal = (service?: string, type: 'sample' | 'order' = 'sample') => {
    if (service) setActiveService(service);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseSubView = () => {
    window.location.hash = '';
    setView('main');
  };

  const handleInitiatePayment = (orderId: string) => {
    setSelectedOrderIdForPayment(orderId);
    window.location.hash = '#payment';
  };

  const handlePaymentComplete = () => {
    setSelectedOrderIdForPayment(null);
    window.location.hash = '#dashboard';
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialService={activeService}
        type={modalType}
        currentUser={currentUser}
      />

      {view === 'admin' ? (
        <>
          <AdminDashboard onClose={handleCloseSubView} />
          {currentUser && <ChatSystem userEmail={currentUser.email} userName={currentUser.name} isAdmin={true} />}
        </>
      ) : view === 'customer' ? (
        <>
          <CustomerDashboard 
            onClose={handleCloseSubView} 
            onInitiatePayment={handleInitiatePayment} 
            onOpenModal={(service, type) => openModal(service, type)}
          />
          {currentUser && <ChatSystem userEmail={currentUser.email} userName={currentUser.name} isAdmin={false} />}
        </>
      ) : view === 'payment' && selectedOrderIdForPayment ? (
        <PaymentPage orderId={selectedOrderIdForPayment} onComplete={handlePaymentComplete} onCancel={() => { setSelectedOrderIdForPayment(null); window.location.hash = '#dashboard'; }} />
      ) : (
        <div className="relative overflow-x-hidden">
          <Header onOpenModal={() => openModal()} />
          <main>
            <Hero onOpenModal={openModal} />
            <PainPoint />
            <Services onOpenModal={openModal} />
            <TrustBridge onOpenModal={openModal} />
            <ValueStack onOpenModal={openModal} />
            <FinalCTA onOpenModal={openModal} />
          </main>
          <Footer onAdminClick={() => setView('admin')} />
          {/* WhatsAppWidget shudhu landing page (main view) e thakbe */}
          <WhatsAppWidget 
            phoneNumber="8801712345678" 
            defaultMessage="Hi! I'm interested in your video editing services." 
          />
        </div>
      )}
    </div>
  );
};

export default App;