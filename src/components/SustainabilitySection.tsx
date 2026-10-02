import React from 'react';
import { ArrowRight, Leaf, Shield, Recycle, Box } from 'lucide-react';
import { generateProductSvg } from '../utils/productImages';

interface SustainabilitySectionProps {
  onOurStory: () => void;
}

export const SustainabilitySection: React.FC<SustainabilitySectionProps> = ({ onOurStory }) => {
  const pillars = [
    {
      icon: Shield,
      title: 'Durable Materials',
      desc: 'High-density Portuguese stoneware, virgin pre-seasoned cast iron, and 18/10 surgical grade steel.'
    },
    {
      icon: Leaf,
      title: 'Thoughtful Design',
      desc: 'Form follows function. Curved edges prevent food traps, and ergonomic loop handles cradle naturally.'
    },
    {
      icon: Recycle,
      title: 'Reusable Essentials',
      desc: 'Eliminates single-use plastics from meal prep with airtight borosilicate glass and organic bamboo.'
    },
    {
      icon: Box,
      title: 'Responsible Packaging',
      desc: '100% plastic-free biodegradable honeycomb kraft paper and soy-based non-toxic inks.'
    }
  ];

  return (
    <section className="py-20 bg-[#F9F7F3] border-b border-[#ECE6DA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Illustration / Lifestyle */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-[#223B2E] border border-[#345946] p-8 shadow-xl">
              <svg className="w-full aspect-4/3 rounded-2xl" viewBox="0 0 600 450" fill="none">
                <rect width="600" height="450" fill="#254233" />
                <ellipse cx="300" cy="400" rx="260" ry="60" fill="#14261D" opacity="0.6" filter="blur(14px)" />
                {/* Kitchen background elements */}
                <polygon points="30,300 570,300 600,450 0,450" fill="#E8E3D7" />
                {/* Natural bamboo cutting board */}
                <rect x="180" y="240" width="240" height="150" rx="16" fill="#BD8E5D" />
                {/* Ceramic pestle & mortar */}
                <ellipse cx="140" cy="330" rx="55" ry="30" fill="#E5DFD1" />
                <ellipse cx="140" cy="326" rx="48" ry="24" fill="#3D5A47" />
                {/* Organic herb leaves */}
                <circle cx="280" cy="310" r="14" fill="#75A685" />
                <circle cx="310" cy="300" r="16" fill="#588567" />
                <circle cx="330" cy="315" r="12" fill="#88B898" />
                {/* Insulated Flask */}
                <rect x="430" y="210" width="60" height="150" rx="18" fill="#5A7D69" />
                <ellipse cx="460" cy="210" rx="30" ry="10" fill="#D4AF37" />
              </svg>

              <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs text-xs font-semibold text-[#182C21] border border-black/5">
                Regenerative Production
              </div>
            </div>
          </div>

          {/* Right Column: Copy & 4 Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#547361] block">
              Conscious Living
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#172B20] tracking-tight leading-[1.12]">
              Designed for better <br />
              <span className="italic font-normal text-[#294E38]">everyday living.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#59695F] leading-relaxed">
              Thoughtfully selected materials, durable designs and reusable essentials created for kitchens that feel good to live in. We believe our tools should outlast trends and honor the ingredients we nourish our families with.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {pillars.map((p) => {
                const IconComponent = p.icon;
                return (
                  <div key={p.title} className="p-4 rounded-xl bg-white border border-[#DDD6C8] space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E5EDE8] text-[#29563E] flex items-center justify-center">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#182C21]">{p.title}</h3>
                    <p className="text-xs text-[#67776E] leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <button
                onClick={onOurStory}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#182C21] hover:bg-[#254534] text-white text-xs sm:text-sm font-medium tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
