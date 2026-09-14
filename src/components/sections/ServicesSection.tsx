import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../common/FadeIn';
import { ArrowUpRight } from 'lucide-react';

interface ServiceItemData {
  number: string;
  name: string;
  category: string;
  description: string;
}

const SERVICES_DATA: ServiceItemData[] = [
  {
    number: '01',
    name: 'WEB DESIGN',
    category: 'Visual & Commercial Architecture',
    description:
      'Custom, high-conversion visual architectures crafted for modern brands, startups, and creative products with distinctive aesthetic polish.',
  },
  {
    number: '02',
    name: '3D WEB EXPERIENCES',
    category: 'WebGL & Interactive Canvas',
    description:
      'Immersive WebGL, Three.js, and interactive 3D product visualizers that turn passive visitors into active, captivated participants.',
  },
  {
    number: '03',
    name: 'CREATIVE DEVELOPMENT',
    category: 'React & Frontend Engineering',
    description:
      'High-performance React, Next.js, and silky smooth Framer Motion architectures engineered for sub-second speed and flawless fluidity.',
  },
  {
    number: '04',
    name: 'UI/UX DESIGN',
    category: 'Product Systems & Prototyping',
    description:
      'Intuitive digital interfaces, user journeys, responsive wireframing, and bespoke design systems built for effortless usability.',
  },
  {
    number: '05',
    name: 'BRANDING',
    category: 'Visual Identity & Systems',
    description:
      'Distinctive visual identities, custom typography guidelines, color palettes, and digital brand assets that make companies truly stand out.',
  },
  {
    number: '06',
    name: 'MOTION DESIGN',
    category: 'Kinetic Direction & Micro-Interactions',
    description:
      'Micro-interactions, kinetic typography, dynamic physics, and fluid scroll-driven choreography that give websites a living, breathing pulse.',
  },
];

export const ServicesSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="w-full bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-12 py-24 sm:py-32 relative z-10 text-[#0C0C0C] select-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Top Header */}
        <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C0C0C]/5 border border-[#0C0C0C]/15 text-xs font-mono text-[#0C0C0C] uppercase tracking-widest font-bold mb-4">
            <span>Capabilities & Core Focus</span>
          </div>

          <h2
            className="font-black uppercase tracking-tight text-[#0C0C0C] leading-none text-center"
            style={{ fontSize: 'clamp(2.75rem, 11vw, 150px)' }}
          >
            Services
          </h2>
        </FadeIn>

        {/* Clean Numbered List with Interactive Hover State */}
        <div className="divide-y divide-[#0C0C0C]/15 border-t border-b border-[#0C0C0C]/15">
          {SERVICES_DATA.map((service, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={service.number}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`py-8 sm:py-10 md:py-12 transition-all duration-300 cursor-pointer group px-4 sm:px-6 rounded-2xl sm:rounded-3xl ${
                  isHovered ? 'bg-[#0C0C0C]/[0.03]' : 'bg-transparent'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
                  {/* Left: Number with Subtile Scale on Hover */}
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.05 : 1,
                      x: isHovered ? 6 : 0,
                      color: isHovered ? '#FF5400' : '#0C0C0C',
                    }}
                    transition={{ duration: 0.3 }}
                    className="font-black leading-none shrink-0 select-none min-w-[100px] sm:min-w-[140px] md:min-w-[170px]"
                    style={{ fontSize: 'clamp(2.75rem, 8vw, 120px)' }}
                  >
                    {service.number}
                  </motion.div>

                  {/* Center: Title & Category */}
                  <div className="flex-1 space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#0C0C0C]/50 uppercase font-semibold">
                        {service.category}
                      </span>
                    </div>

                    <motion.h3
                      animate={{
                        x: isHovered ? 8 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="font-black uppercase tracking-tight text-[#0C0C0C] flex items-center gap-2"
                      style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2.4rem)' }}
                    >
                      <span>{service.name}</span>
                      <ArrowUpRight
                        className={`w-5 h-5 text-orange-500 transition-all duration-300 ${
                          isHovered ? 'opacity-100 translate-x-1 -translate-y-1' : 'opacity-0'
                        }`}
                      />
                    </motion.h3>

                    {/* Smooth Description Reveal/Brighten */}
                    <motion.p
                      animate={{
                        color: isHovered ? 'rgba(12, 12, 12, 0.9)' : 'rgba(12, 12, 12, 0.55)',
                      }}
                      transition={{ duration: 0.25 }}
                      className="font-light leading-relaxed max-w-2xl font-sans"
                      style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.15rem)' }}
                    >
                      {service.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
