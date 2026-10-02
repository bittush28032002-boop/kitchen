import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { generateProductSvg } from '../utils/productImages';

interface FeaturedCollectionProps {
  onExplore: () => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ onExplore }) => {
  return (
    <section className="py-20 bg-[#F4F1EA] border-b border-[#E5E0D4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Large Editorial Showcase Visual */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden bg-[#1E362A] shadow-2xl p-6 sm:p-10 border border-[#2E523F]">
              <svg
                className="w-full aspect-16/10 rounded-2xl"
                viewBox="0 0 700 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="700" height="450" fill="#20382B" />
                <circle cx="550" cy="80" r="220" fill="#2D4C3C" opacity="0.5" />
                <ellipse cx="350" cy="380" rx="300" ry="70" fill="#14261D" opacity="0.6" filter="blur(16px)" />

                {/* Countertop */}
                <polygon points="50,290 650,290 680,440 20,440" fill="#EAE5DA" />
                {/* Dutch Oven */}
                <ellipse cx="260" cy="310" rx="110" ry="32" fill="#2E4A3B" />
                <path d="M 160 300 Q 165 390 260 390 Q 355 390 360 300 Z" fill="#2E4A3B" />
                <ellipse cx="260" cy="300" rx="100" ry="24" fill="#3D5F4D" />
                <path d="M 165 295 Q 260 220 355 295 Z" fill="#3D5F4D" />
                <ellipse cx="260" cy="245" rx="20" ry="10" fill="#D4AF37" />

                {/* Ceramic Bowls Stack */}
                <ellipse cx="480" cy="340" rx="75" ry="22" fill="#8C6647" />
                <path d="M 410 330 Q 415 390 480 390 Q 545 390 550 330 Z" fill="#8C6647" />
                <ellipse cx="480" cy="328" rx="70" ry="18" fill="#EFE8D8" />
                <ellipse cx="480" cy="305" rx="60" ry="16" fill="#4B6B56" />

                {/* Wooden Spoons in Ceramic Vase */}
                <rect x="580" y="240" width="60" height="120" rx="10" fill="#DCD6C8" />
                <path d="M 595 180 L 595 240" stroke="#BA8552" strokeWidth="8" strokeLinecap="round" />
                <path d="M 620 170 L 620 240" stroke="#A67342" strokeWidth="8" strokeLinecap="round" />
                <ellipse cx="595" cy="175" rx="12" ry="18" fill="#BA8552" />
                <ellipse cx="620" cy="165" rx="14" ry="20" fill="#A67342" />

                {/* Ambient warm morning sunlight beam */}
                <polygon points="700,0 450,0 200,450 700,450" fill="#FFF6DF" opacity="0.14" />
              </svg>

              {/* Floating editorial caption inside card */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-auto px-5 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#86CD9D] animate-pulse" />
                <span className="text-xs font-medium text-[#E4EDE7]">
                  Cast Iron Dutch Oven in Artisan Olive with Teak Wood Serving Suite
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#547361]">
              <Sparkles className="w-3.5 h-3.5 text-[#6D937C]" />
              <span>New Collection</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#15291E] tracking-tight leading-[1.15]">
              Made for the heart <br />
              <span className="italic font-normal text-[#2A4D39]">of your home</span>
            </h2>

            <p className="text-base text-[#56665D] leading-relaxed">
              Beautifully crafted essentials designed to make cooking, serving and gathering feel effortless. Each piece marries traditional European ceramic techniques with contemporary Scandinavian restraint.
            </p>

            <ul className="space-y-3 pt-2 text-sm text-[#384A40]">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E0D9C9] text-[#244232] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Tested against thermal shock and everyday abrasions</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E0D9C9] text-[#244232] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Free from cadmium, lead, PTFE, and synthetic sealants</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E0D9C9] text-[#244232] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Stovetop to oven to communal dining table in one vessel</span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#182D22] hover:bg-[#254534] text-[#FAF8F4] font-medium text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
