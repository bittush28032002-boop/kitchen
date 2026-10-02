import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { reviewService } from '../services/microservices';

export const CustomerReviewsSection: React.FC = () => {
  const reviews = reviewService.getAllFeaturedReviews();

  return (
    <section className="py-20 bg-[#F4F1EA] border-b border-[#E6E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Aggregate Rating */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-8 border-b border-[#DED7C8] gap-6">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-[#527260] block mb-2">
              Community Voice
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#182C21] font-normal tracking-tight">
              Loved by home cooks
            </h2>
          </div>

          <div className="flex items-center gap-6 p-4 rounded-2xl bg-white border border-[#DDD6C8] shadow-xs">
            <div className="text-center sm:text-left">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl sm:text-5xl font-light text-[#182C21]">4.9</span>
                <span className="text-base text-[#6E8075]">/ 5</span>
              </div>
              <div className="flex text-[#D4AF37] mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#D4AF37]" />
                ))}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-[#E3DDD1] hidden sm:block" />
            <div className="text-xs text-[#5D6F64]">
              <p className="font-semibold text-[#182C21]">More than 25,000</p>
              <p>5-Star Reviews for Our Award-Winning Crockery & Cookware</p>
            </div>
          </div>
        </div>

        {/* 4 Customer Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-[#DDD6C8] flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-[#9FB5A8]" />
                <div className="flex text-[#D4AF37]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#46594E] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F2EDE3]">
                <p className="font-serif text-sm font-medium text-[#182C21]">
                  {rev.customerName}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-[#29563E] font-medium mt-0.5">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Customer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
