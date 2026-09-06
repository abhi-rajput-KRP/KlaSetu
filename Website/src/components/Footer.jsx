import { Link } from 'react-router';
import { Feather, Heart, Sparkles, ShieldCheck, Mail } from 'lucide-react';
import { CRAFT_CATEGORIES } from '../data/productsData';

export default function Footer() {
  return (
    <footer className="border-t border-[#EDE4D6] bg-[#F3E6D3]/40 pt-16 pb-12 text-[#2B2420]">
      <div className="flex flex-col items-center justify-center text-center">

          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFFDF9] text-[#3C6E47] border border-[#EDE4D6] shadow-2xs">
              <img src="/favicon.svg" alt="logo" />
            </div>
            <span className="font-serif-heading text-2xl font-bold text-[#2B2420]">
              KlaSetu<span className="text-[#3C6E47]">.</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm leading-relaxed text-[#8A8078]">
            Connecting indigenous craft persons directly with conscious buyers. Bridging age-old artisanal wisdom with modern ethical e-commerce.
          </p>
          <div className="flex items-center gap-1 text-xs">
            <span>Made with</span>
            <Heart size={13} className="fill-[#C77B3E] text-[#C77B3E]" />
            <span>by Vibe Catalyst</span>

        </div>
      </div>
    </footer>
  );
}
