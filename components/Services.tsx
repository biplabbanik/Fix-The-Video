import React from 'react';

interface ServicesProps {
  onOpenModal: (service: string) => void;
}

const FeatureCard: React.FC<{
  title: string;
  desc: string;
  image: string;
  afterImage?: string;
  icon: React.ReactNode;
  index: string;
  onClick: () => void;
}> = ({ title, desc, image, afterImage, icon, index, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative glass rounded-[3rem] p-5 transition-all duration-500 hover:shadow-2xl border border-white/50 flex flex-col h-full cursor-pointer hover:-translate-y-3"
  >
    {/* Visual Context Image Container */}
    <div className="h-[240px] w-full rounded-[2.5rem] overflow-hidden mb-8 relative shadow-inner bg-gray-50">
      
      {/* BEFORE IMAGE (CLEAN/COLORED) */}
      <img 
        src={image} 
        alt={`${title} Original`} 
        className={`w-full h-full object-cover transition-all duration-700 ${afterImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
      />

      {/* AFTER IMAGE (CLEAN) - Only shows on hover if provided */}
      {afterImage && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105">
          <img 
            src={afterImage} 
            alt={`${title} Cleaned`} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Icon Overlay Glass */}
      <div className="absolute bottom-6 left-6 w-14 h-14 glass text-[#DC143C] rounded-[1.25rem] flex items-center justify-center shadow-xl transform -rotate-6 group-hover:rotate-0 transition-transform z-20 border border-white/40">
        {icon}
      </div>
      
      <div className="absolute top-6 right-6 text-[10px] font-black text-gray-900 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20 z-20 shadow-sm">
        #{index}
      </div>

      {/* Hover prompt - Minimalist style */}
      {afterImage && (
        <div className="absolute top-6 left-6 opacity-100 group-hover:opacity-0 transition-opacity duration-300 z-20">
           <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-widest border border-white shadow-sm">
              Hover to compare
           </div>
        </div>
      )}
    </div>
    
    <div className="px-6 pb-8 flex flex-col flex-grow">
      <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-[#DC143C] transition-colors uppercase tracking-tight leading-none">
        {title}
      </h3>
      
      <p className="text-gray-500 text-[11px] leading-relaxed mb-8 font-bold uppercase tracking-widest flex-grow opacity-70">
        {desc}
      </p>
    </div>
  </div>
);

const Services: React.FC<ServicesProps> = ({ onOpenModal }) => {
  const servicesData = [
    {
      id: 'background_removal',
      index: '01',
      title: 'VIDEO BACKGROUND REMOVAL',
      desc: 'Frame-by-frame rotoscoping for seamless white or transparent video backgrounds. Perfect for high-end e-commerce product videos.',
      image: 'https://lh3.googleusercontent.com/d/1Dowd8yhKa3rqAyK6gGmDc6zqv4zy7kvj',
      afterImage: 'https://lh3.googleusercontent.com/d/1ekRleuOnYuHyula0dF23N4itAstbJ5lg',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
    },
    {
      id: 'video_cleanup',
      index: '02',
      title: 'PROFESSIONAL VIDEO CLEANUP',
      desc: 'Surgical removal of technical distractions and artifacts. High-end frame-by-frame retouching for a seamless cinematic finish.',
      image: 'https://lh3.googleusercontent.com/d/1d1IhS8EuUDowY8jh8OM7Z5Kl-cGq-gsu',
      afterImage: 'https://lh3.googleusercontent.com/d/1fDct0rMcef-N3bBlE_zhLi9HQCD6zJ8i',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    },
    {
      id: 'rig_removal',
      index: '03',
      title: 'RIG REMOVAL',
      desc: 'Expert removal of camera rigs, safety wires, and production equipment. Crucial for gravity-defying product shots.',
      image: 'https://lh3.googleusercontent.com/d/1qDuNi9ic1dyenHlr7ORO_2Si7BDPFY-p',
      afterImage: 'https://lh3.googleusercontent.com/d/1xGrWImR3Pf_VqnusfUfpHxwOe6VjBQ7D',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    },
    {
      id: 'logo_removal',
      index: '04',
      title: 'PRODUCT LOGO REMOVAL',
      desc: 'Digital patching to erase or replace branding and labels. Essential for white-label marketing and licensing compliance.',
      image: 'https://lh3.googleusercontent.com/d/1xjRwoa8EB9xRLXOzQv17OL8MvqaxUnj4',
      afterImage: 'https://lh3.googleusercontent.com/d/1HlsS-zMLuJlYSdGDb4ZD4DO_ckMFq-bt',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
    },
    {
      id: 'video_rotoscoping',
      index: '05',
      title: 'VIDEO ROTOSCOPING SERVICE',
      desc: 'Precision frame-by-frame isolation for complex elements. Perfect for high-end visual effects and complex background integration.',
      image: 'https://lh3.googleusercontent.com/d/10LBIcnfTETyseEPWnXZ_4Q86nKWi7xl9',
      afterImage: 'https://lh3.googleusercontent.com/d/13Y63T-1pdYxbaU_mTcfLAXyv915oRXLd',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
    },
    {
      id: 'video_debanding',
      index: '06',
      title: 'VIDEO DEBANDING SERVICE',
      desc: 'Eliminate color banding artifacts in 8-bit or low-bitrate footage. Restore smooth gradients and professional tonal depth to your assets.',
      image: 'https://lh3.googleusercontent.com/d/1UeOtis0aCMQt3dIDDB0hINpQmVxyj6H7',
      afterImage: 'https://lh3.googleusercontent.com/d/1CqHrpLJp3bEaJI-PXyY3in2wIfS_4v5q',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    },
    {
      id: 'reflections_removal',
      index: '07',
      title: 'REFLECTIONS / GLASS GLARE',
      desc: 'Advanced digital surgery to eliminate distracting lens flares, window reflections, and glass glares. We restore obscured details to ensure absolute clarity across every frame.',
      image: 'https://lh3.googleusercontent.com/d/1uSBfCnx2brah1Gfx-8U52vdeGmQrx4tA',
      afterImage: 'https://lh3.googleusercontent.com/d/1u8JnPGubhrpQZ2BglCYXCyy0mrDRDIjk',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      id: 'color_correction',
      index: '08',
      title: 'VIDEO COLOR CHANGING',
      desc: 'Precision color correction ensuring videos match physical brand swatch cards perfectly.',
      image: 'https://lh3.googleusercontent.com/d/1aNDSRpWNJ7tS5D_aF5mvKTfZoNXiCuvs',
      afterImage: 'https://lh3.googleusercontent.com/d/1VDdI7pvy4gCv46us0t6xr080-Lhyrcmz',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12" /></svg>
    },
    {
      id: 'green_screen',
      index: '09',
      title: 'GREEN SCREEN',
      desc: 'Professional chroma keying and background replacement for studio-shot product videos.',
      image: 'https://lh3.googleusercontent.com/d/1OywdADmBEHRf-1TQAcNDuQ4iJWLCUJbt',
      afterImage: 'https://lh3.googleusercontent.com/d/1ksDazuWMiZ0nk2mGRunRObt1X0jeus-E',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
    }
  ];

  return (
    <section id="services" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#DC143C] mb-6 block">Our Solutions</span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight leading-none">
            Digital <span className="text-[#DC143C]">Mastery.</span>
          </h2>
          <p className="text-gray-500 font-bold max-w-2xl mx-auto text-sm uppercase tracking-widest opacity-60">
            Pixel-level surgery for the world's most demanding media.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {servicesData.map((service) => (
            <FeatureCard 
              key={service.id}
              index={service.index}
              title={service.title}
              desc={service.desc}
              image={service.image}
              afterImage={service.afterImage}
              icon={service.icon}
              onClick={() => onOpenModal(service.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;