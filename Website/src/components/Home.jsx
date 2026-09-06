import React from 'react';
import { Link } from 'react-router';
import Hero from './Hero';
import ProductCard from './ProductCard';
import { useShop } from '../context/ShopContext';
import { CRAFT_CATEGORIES, ARTISAN_MAKERS } from '../data/productsData';
import { Sparkles, ArrowRight, Award, Flame, Heart, Compass, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { products, selectedCategory, setSelectedCategory } = useShop();

  const filteredProducts = selectedCategory === 'All Crafts'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-[#FFFDF9] pb-16">
      {/* Hero Banner Section */}
      <Hero />

      {/* Section Header & Product Grid*/}
      <section className="py-8 sm:py-12">
        <div className='lg:mx-[10vw] md:mx-[5vw] '>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
          <div className='mt-5 mr-3 self-end justify-self-end'>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3C6E47] hover:text-[#2F5838]"
            >
              <span>See all Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* KlaSetu Fair Trade Commitment Banner */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#3C6E47] p-8 sm:p-12 text-[#FFFDF9] shadow-lg relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDF9]/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs">
                  <Award size={14} className="text-[#F5B301]" />
                  Verified Fair-Trade Ecosystem
                </span>
                <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold mt-4 leading-tight">
                  Empowering Traditional Craft Persons
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#FFFDF9]/90 max-w-2xl">
                  By cutting out middlemen and predatory intermediaries, KlaSetu guarantees that at least 85% of retail value flows back to artisan clusters, preserving the rich heritage and traditions of Indian crafts.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#F5B301]" />
                    <span>Direct Bank Transfers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#F5B301]" />
                    <span>Ethical Raw Sourcing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#F5B301]" />
                    <span>AI Marketing for Rural Makers</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 text-center lg:text-right">
                <Link
                  to="/sellers_page"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFFDF9] px-7 py-4 text-sm font-bold text-[#3C6E47] shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <span>Are you an artisan? Join now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
