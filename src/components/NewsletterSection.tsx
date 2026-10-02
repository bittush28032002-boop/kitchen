import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { notificationService } from '../services/microservices';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setIsSubscribed(true);
    notificationService.notify(
      'success',
      'Welcome to KitchenCraft',
      'Thank you for joining our conscious kitchen community. Check your inbox for a 10% welcome token!'
    );
  };

  return (
    <section className="py-20 bg-[#12251B] text-white overflow-hidden relative border-t border-[#1C3628]">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-radial from-[#1E3B2C] to-[#0E1C15] opacity-60 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2E] border border-[#2E5540] text-xs font-semibold uppercase tracking-wider text-[#A1CCB2]">
          <Mail className="w-3.5 h-3.5 text-[#73BA92]" />
          <span>Atelier Dispatch</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#FAF9F5] tracking-tight leading-[1.12]">
          Bring good things <br />
          <span className="italic font-normal text-[#D2E4D8]">to your kitchen.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#BFD4C7] max-w-xl mx-auto leading-relaxed">
          Get new collection updates, kitchen inspiration and exclusive offers.
        </p>

        {isSubscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C382A] border border-[#356149] text-sm text-[#A6E0BD]">
            <Check className="w-4 h-4 text-[#75C895]" />
            <span>You're on the list! Welcome to KitchenCraft.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-full bg-[#1A3326] border border-[#2D503C] text-sm text-[#FAF9F5] placeholder-[#799986] focus:outline-none focus:ring-2 focus:ring-[#569C73] transition-all"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-full bg-[#FAF9F5] hover:bg-white text-[#12251B] font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-[#698575] pt-2">
          We honor your inbox. Unsubscribe anytime with a single click.
        </p>
      </div>
    </section>
  );
};
