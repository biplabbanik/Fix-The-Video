import React, { useState, useEffect } from 'react';

interface PaymentPageProps {
  orderId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ orderId, onComplete, onCancel }) => {
  const [order, setOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('ftv_orders') || '[]');
    const found = savedOrders.find((o: any) => o.id === orderId);
    setOrder(found);
  }, [orderId]);

  const handlePay = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');
    
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Update Order to Official
    const savedOrders = JSON.parse(localStorage.getItem('ftv_orders') || '[]');
    const updated = savedOrders.map((o: any) => o.id === orderId ? { ...o, isOrder: true } : o);
    localStorage.setItem('ftv_orders', JSON.stringify(updated));
    
    setPaymentStep('success');
    setIsProcessing(false);
    
    // Auto-redirect after success
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#DC143C] opacity-10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600 opacity-5 blur-[150px] rounded-full"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="glass-dark border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row">
          
          {/* Order Summary Sidebar */}
          <div className="md:w-5/12 p-12 bg-white/5 border-r border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[#DC143C] rounded-2xl flex items-center justify-center text-white font-black text-sm mb-10 shadow-lg">FTV</div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">Checkout</h2>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-12">Authorized Payment Gateway</p>
              
              <div className="space-y-8">
                <div>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Project Identity</span>
                  <div className="text-sm font-bold text-white uppercase">{order.service.replace('_', ' ')}</div>
                  <div className="text-[10px] font-bold text-gray-500 mt-1">{order.id}</div>
                </div>
                
                <div className="flex justify-between items-end border-t border-white/5 pt-8">
                  <div>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Quantity</span>
                    <div className="text-sm font-bold text-white uppercase">{order.quantity} Assets</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Unit Rate</span>
                    <div className="text-sm font-bold text-white uppercase">${order.unitPrice}/ea</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Subtotal</span>
                <span className="text-sm font-bold text-white/80">${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Taxes (incl.)</span>
                <span className="text-sm font-bold text-white/80">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white uppercase">Grand Total</span>
                <span className="text-2xl font-black text-[#DC143C]">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Details Form */}
          <div className="md:w-7/12 p-12 md:p-16 flex flex-col justify-center bg-[#111111]">
            {paymentStep === 'details' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8 italic">Credit Card Details</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Cardholder Name</label>
                    <input disabled value={order.customerName} type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white/80 outline-none" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Card Number</label>
                    <div className="relative">
                      <input disabled value="**** **** **** 4242" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white/80 outline-none" />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-2">
                         <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[6px] font-black text-white italic">VISA</div>
                         <div className="w-8 h-5 bg-amber-600 rounded flex items-center justify-center text-[6px] font-black text-white italic">MASTER</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Expiry</label>
                      <input disabled value="12/28" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white/80 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">CVV</label>
                      <input disabled value="***" type="password" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white/80 outline-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-6">
                    <button 
                      onClick={handlePay}
                      className="w-full bg-[#DC143C] text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all canva-btn"
                    >
                      Pay ${order.totalPrice.toFixed(2)} Securely
                    </button>
                    <button 
                      onClick={onCancel}
                      className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-white transition-colors"
                    >
                      Return to Project Hub
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 border-[6px] border-[#DC143C]/20 border-t-[#DC143C] rounded-full mx-auto animate-spin mb-10"></div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Authorizing...</h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Handshaking with bank servers</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Payment Verified</h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Order status updated to official</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-12 flex items-center justify-center gap-6 opacity-30">
           <span className="text-[8px] font-black text-white uppercase tracking-widest">PCI DSS Compliant</span>
           <span className="text-[8px] font-black text-white uppercase tracking-widest">SSL Encryption Active</span>
           <span className="text-[8px] font-black text-white uppercase tracking-widest">Secure Stripe Demo</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;