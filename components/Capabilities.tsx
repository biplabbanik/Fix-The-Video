
import React from 'react';

const CapabilityIcon: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  secondaryIcon?: React.ReactNode 
}> = ({ title, icon, secondaryIcon }) => (
  <div className="flex flex-col items-center group cursor-pointer">
    <div className="relative mb-6">
      {/* Icon Container with Dot Grid */}
      <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(220,20,60,0.1)] group-hover:border-[#DC143C]/20 group-hover:-translate-y-2 overflow-hidden relative">
        
        {/* Dot Grid Background */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
        
        {/* Main Icon */}
        <div className="relative z-10 text-gray-400 group-hover:text-gray-900 transition-colors duration-500 scale-110 group-hover:scale-125">
          {icon}
        </div>

        {/* Action Badge */}
        {secondaryIcon && (
          <div className="absolute bottom-4 right-4 w-7 h-7 bg-[#DC143C] rounded-full flex items-center justify-center text-white shadow-lg transform translate-x-1 translate-y-1 transition-transform group-hover:scale-110">
            {secondaryIcon}
          </div>
        )}
      </div>
      
      {/* Decorative Red Glow on Hover */}
      <div className="absolute inset-0 bg-[#DC143C] opacity-0 group-hover:opacity-[0.03] blur-3xl rounded-full transition-opacity duration-500"></div>
    </div>
    
    <span className="text-[10px] md:text-[11px] font-[900] text-center text-gray-900 uppercase tracking-[0.15em] leading-[1.4] max-w-[140px] transition-colors group-hover:text-[#DC143C]">
      {title}
    </span>
  </div>
);

const Capabilities: React.FC = () => {
  const items = [
    {
      title: "Background Removal",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.2} />
          <path d="M3 14l4-4 11 11M14 11l3-3 4 4" strokeWidth={1.2} strokeLinecap="round" />
          <circle cx="8" cy="8" r="1.5" strokeWidth={1.2} />
        </svg>
      ),
      secondaryIcon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M6 18L18 6M6 6l12 12" /></svg>
    },
    {
      title: "Amazon A+ Content",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      secondaryIcon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
    },
    {
      title: "360° Product Spin",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      secondaryIcon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M6 18L18 6M6 6l12 12" /></svg>
    },
    {
      title: "Social Media Ready",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Product Demo Videos",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeWidth={1.2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      secondaryIcon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" /></svg>
    },
    {
      title: "Unboxing Videos",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: "Lifestyle Integration",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeWidth={1.2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Color Matching",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12" />
        </svg>
      ),
      secondaryIcon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      title: "Green Screen Keying",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "3D Animation",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" strokeWidth={1.2} />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth={1.2} />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-2xl md:text-4xl font-[900] text-gray-900 uppercase tracking-tighter mb-4">
            STUDIO <span className="text-[#DC143C]">CORE</span> CAPABILITIES
          </h2>
          <div className="w-16 h-1 bg-[#DC143C] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-20 gap-x-12">
          {items.map((item, idx) => (
            <CapabilityIcon 
              key={idx}
              title={item.title}
              icon={item.icon}
              secondaryIcon={item.secondaryIcon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
