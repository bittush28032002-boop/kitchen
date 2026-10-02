import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Leaf } from 'lucide-react';

interface HeroSectionProps {
  onShopCollection: () => void;
  onExploreBestsellers: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopCollection,
  onExploreBestsellers
}) => {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#102219]">
      {/* Background Graphic: Atmospheric Architectural Kitchen Illustration with warm lighting */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1440 760"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bgKitchen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#152B20" />
              <stop offset="45%" stopColor="#1E392B" />
              <stop offset="85%" stopColor="#102319" />
              <stop offset="100%" stopColor="#0B1710" />
            </linearGradient>

            <linearGradient id="sunbeam" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#FFF7E8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="countertop" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8E4DA" />
              <stop offset="50%" stopColor="#F5F2EB" />
              <stop offset="100%" stopColor="#DDD7CB" />
            </linearGradient>

            <linearGradient id="brass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F6DF9C" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#9E7818" />
            </linearGradient>

            <filter id="kitchenBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="30" />
            </filter>
          </defs>

          {/* Deep Forest Green Kitchen Walls & Ambient Base */}
          <rect width="1440" height="760" fill="url(#bgKitchen)" />

          {/* Background Sage Shaker Kitchen Cabinetry Upper Row */}
          <g opacity="0.85">
            {/* Left Cabinet Door */}
            <rect x="520" y="40" width="160" height="280" rx="4" fill="#284938" stroke="#1A3326" strokeWidth="2" />
            <rect x="532" y="52" width="136" height="256" rx="2" fill="#244233" />
            <circle cx="660" cy="180" r="4" fill="url(#brass)" />

            {/* Center Cabinet Door */}
            <rect x="700" y="40" width="160" height="280" rx="4" fill="#284938" stroke="#1A3326" strokeWidth="2" />
            <rect x="712" y="52" width="136" height="256" rx="2" fill="#244233" />
            <circle cx="718" cy="180" r="4" fill="url(#brass)" />

            {/* Right Window / Open Shelves */}
            <rect x="880" y="40" width="260" height="280" rx="4" fill="#1C3527" />
            {/* Open wood shelves with ceramics */}
            <line x1="880" y1="130" x2="1140" y2="130" stroke="#876241" strokeWidth="6" />
            <line x1="880" y1="210" x2="1140" y2="210" stroke="#876241" strokeWidth="6" />
            {/* Ceramic bowls on shelf */}
            <ellipse cx="940" cy="122" rx="24" ry="10" fill="#EAE5DA" />
            <ellipse cx="940" cy="120" rx="22" ry="7" fill="#698A76" />
            <ellipse cx="1020" cy="122" rx="30" ry="12" fill="#D3C9B8" />
            <ellipse cx="1080" cy="122" rx="18" ry="8" fill="#F4EFE6" />
            {/* Hanging copper/brass pot rack */}
            <line x1="1170" y1="90" x2="1400" y2="90" stroke="url(#brass)" strokeWidth="4" />
            <circle cx="1220" cy="140" r="28" fill="#B86C45" opacity="0.9" />
            <circle cx="1310" cy="145" r="22" fill="#222524" opacity="0.9" />
          </g>

          {/* Sunbeam Streaming from Top Right */}
          <polygon points="1440,0 900,0 550,760 1440,760" fill="url(#sunbeam)" />

          {/* Under-cabinet Backsplash in Pale Sage Tiles */}
          <rect x="520" y="320" width="920" height="120" fill="#264132" opacity="0.6" />
          <line x1="520" y1="360" x2="1440" y2="360" stroke="#1F3629" strokeWidth="1" />
          <line x1="520" y1="400" x2="1440" y2="400" stroke="#1F3629" strokeWidth="1" />

          {/* Marble Dining Table / Island Counter Surface */}
          <polygon points="450,440 1440,440 1440,760 380,760" fill="url(#countertop)" />
          {/* Subtle marble veins */}
          <path d="M 600,460 Q 750,520 900,490 T 1200,560" stroke="#CBC5B6" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 850,580 Q 980,620 1150,590 T 1350,680" stroke="#CBC5B6" strokeWidth="2.5" fill="none" opacity="0.5" />

          {/* Kitchenware on Island Counter */}
          {/* 1. Large Ceramic Footed Bowl with seasonal figs/pomegranates */}
          <ellipse cx="620" cy="620" rx="90" ry="24" fill="rgba(18,29,23,0.22)" filter="blur(8px)" />
          <ellipse cx="620" cy="580" rx="85" ry="32" fill="#E8DEC8" />
          <ellipse cx="620" cy="576" rx="80" ry="28" fill="#476854" />
          {/* Figs/Pomegranates */}
          <circle cx="600" cy="565" r="16" fill="#8C353E" />
          <circle cx="630" cy="560" r="14" fill="#A8444A" />
          <circle cx="645" cy="570" r="13" fill="#69242C" />

          {/* 2. Stoneware Teapot & Cups */}
          <ellipse cx="800" cy="590" rx="45" ry="14" fill="rgba(18,29,23,0.18)" filter="blur(6px)" />
          <ellipse cx="800" cy="545" rx="38" ry="32" fill="#253D30" />
          <ellipse cx="800" cy="520" rx="26" ry="8" fill="#D4AF37" />
          <ellipse cx="865" cy="565" rx="16" ry="12" fill="#D6CEBE" />

          {/* 3. Olive Wood Cutting Board with knife */}
          <polygon points="980,510 1180,480 1230,640 1020,680" fill="#996D44" rx="12" />
          <polygon points="985,515 1175,485 1225,635 1025,675" fill="#B38456" rx="10" />
          {/* Sliced rustic loaf */}
          <ellipse cx="1090" cy="560" rx="40" ry="22" fill="#CBB48E" transform="rotate(-10 1090 560)" />

          {/* 4. Sage Kettle on wooden trivet */}
          <ellipse cx="1290" cy="520" rx="55" ry="16" fill="rgba(18,29,23,0.25)" filter="blur(8px)" />
          <ellipse cx="1290" cy="510" rx="45" ry="10" fill="#C29864" />
          <path d="M 1250,500 L 1260,390 L 1320,390 L 1330,500 Z" fill="#638873" />
          <circle cx="1290" cy="380" r="8" fill="url(#brass)" />
          <path d="M 1325,410 C 1365,420 1365,480 1330,490" stroke="#B88A5E" strokeWidth="8" fill="none" strokeLinecap="round" />

          {/* Soft vignette scrim overlay on the left to guarantee 100% text legibility */}
          <rect width="800" height="760" fill="black" opacity="0.45" />
          <rect width="1440" height="760" fill="#13271D" opacity="0.32" />
        </svg>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 min-h-[640px] lg:min-h-[720px] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 xl:col-span-8 text-white space-y-6 max-w-2xl">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#274837]/80 backdrop-blur-md border border-[#3C644E]/70 text-[#C1DEC9] text-xs font-semibold tracking-wider uppercase">
              <Leaf className="w-3.5 h-3.5 text-[#86CD9D]" />
              <span>Conscious Kitchen Collection</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-[#FAF9F5] leading-[1.08] text-balance">
              Beautiful kitchenware <br />
              <span className="italic font-normal text-[#E2DACB]">for everyday living</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#D0DDD5] font-normal leading-relaxed max-w-xl">
              Thoughtfully designed crockery and kitchen essentials made for cooking, serving, sharing and everyday living.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onShopCollection}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-[#FAF9F5] hover:bg-white text-[#13271D] font-medium text-sm tracking-wide transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 text-[#13271D]" />
              </button>

              <button
                onClick={onExploreBestsellers}
                className="inline-flex items-center justify-center px-6 sm:px-7 py-3.5 rounded-full bg-[#264434]/80 hover:bg-[#315743] border border-[#446A55] text-[#FAF9F5] font-medium text-sm tracking-wide transition-all backdrop-blur-sm cursor-pointer"
              >
                <span>Explore Bestsellers</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#A9C4B3]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7AC293]" />
                <span>Zero toxic coatings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7AC293]" />
                <span>Heirloom stoneware & cast iron</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7AC293]" />
                <span>Biodegradable packaging</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Glassmorphism Metric Card (Direct reference feature) */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-end">
            <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-[#1A382A]/75 backdrop-blur-xl border border-[#3E6750]/60 p-6 sm:p-7 text-white shadow-2xl shadow-black/40 space-y-5 transition-transform hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9EC4AD]">
                    Thoughtfully Made
                  </span>
                  <div className="text-xs text-[#D8E6DE] mt-1 space-y-0.5">
                    <p>Natural. Sustainable.</p>
                    <p>Eco-conscious.</p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#27523C] flex items-center justify-center border border-[#3F7356]">
                  <Leaf className="w-5 h-5 text-[#86CD9D]" />
                </div>
              </div>

              {/* Dominant Stat 96% */}
              <div className="pt-2 border-t border-[#2F5942]/60">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl sm:text-6xl font-light text-[#FAF9F5] tracking-tight">
                    96%
                  </span>
                </div>
                <p className="text-xs font-medium text-[#B2D1BD] mt-1">
                  Quality & Design Satisfaction
                </p>
                <p className="text-[11px] text-[#869E90] mt-0.5">
                  Over 25,000 verified home cooks surveyed
                </p>
              </div>

              {/* Editorial signature */}
              <div className="pt-3 border-t border-[#2F5942]/60 flex items-center justify-between text-xs text-[#C5DFCE]">
                <span>Artisan Crafted</span>
                <span className="font-serif italic text-sm text-[#FAF9F5]">KitchenCraft Atelier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
