import React from 'react';
import { Link } from 'react-router';
import { Sparkles, ShieldCheck, HeartHandshake, Leaf, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Warm Linen Banner Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#EDE4D6] bg-[#F3E6D3] p-8 sm:p-12 lg:p-16 shadow-sm">
          {/* Subtle decorative background pattern elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E8D5BC]/50 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#3C6E47]/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">

            {/* Left Content Column */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D5C0A5] bg-[#FFFDF9]/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#B5652F] shadow-xs backdrop-blur-xs mb-6">
                <Sparkles size={14} className="text-[#B5652F]" />
                <span>CONNECTING THE INDIA WITH ITS ROOTS</span>
              </div>

              {/* Main Headline in Serif */}
              <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2B2420] leading-[1.12]">
                Crafted with soul.<br />
                <span className="text-[#3C6E47] italic font-normal">Rooted in heritage.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#8A8078]">
                Discover one-of-a-kind stoneware pottery, handloomed textiles, hand-carved wood, and heirloom brass art — delivered straight from local artisan workshops to your doorstep.
              </p>

              {/* Pill-shaped Action CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[#3C6E47] px-7 py-3.5 text-sm font-semibold text-[#FFFDF9] shadow-md transition-all hover:bg-[#2F5838] hover:shadow-lg active:scale-95"
                >
                  <span>Explore All Crafts</span>
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/sellers_page"
                  className="inline-flex items-center gap-2 rounded-full border border-[#2B2420] bg-transparent px-6 py-3.5 text-sm font-semibold text-[#2B2420] transition-all hover:bg-[#FFFDF9] hover:border-transparent active:scale-95"
                >
                  <span>Join as an Artisan</span>
                </Link>
              </div>
            </div>

            {/* Right Lifestyle Visual Banner */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Artisan Photo Card */}
                <div className="overflow-hidden rounded-2xl border-4 border-[#FFFDF9] bg-[#FFFDF9] shadow-xl">
                  <img
                    src="src/assets/hero_img.png"
                    alt="Artisan shaping clay pottery on traditional wheel"
                    className="h-72 w-full object-cover sm:h-96"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
