import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';
import { User, Package, Heart, MapPin, Award, LogOut, Trash2, CheckCircle2, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="bg-[#FFFDF9] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* User Banner Card */}
        <div className="rounded-3xl border border-[#EDE4D6] bg-[#F3E6D3]/60 p-6 sm:p-8 card-shadow mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <User size={28} className="text-[#2B2420]" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-heading text-2xl font-bold text-[#2B2420]">
                    Helene Engels
                  </h1>
                  <span className="rounded-full bg-[#3C6E47] px-2.5 py-0.5 text-[10px] font-bold text-white">
                    Artisan
                  </span>
                </div>
                <p className="text-xs text-[#8A8078] mt-0.5">helene.engels@example.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/studio"
                className="rounded-full bg-[#3C6E47] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#2F5838] shadow-xs flex items-center gap-1.5"
              >
                <Package size={14} />
                <span>Artisan Studio & Inventory</span>
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs font-bold text-[#2B2420] hover:bg-[#F3E6D3]"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EDE4D6] gap-4 sm:gap-8 text-xs sm:text-sm font-semibold mb-8 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                : 'text-[#8A8078] hover:text-[#2B2420]'
            }`}
          >
            <Package size={16} />
            <span>Order History</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'addresses'
                ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                : 'text-[#8A8078] hover:text-[#2B2420]'
            }`}
          >
            <MapPin size={16} />
            <span>Addresses</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Order 1 */}
            <div className="rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-6 card-shadow space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDE4D6] pb-4 text-xs">
                <div>
                  <span className="text-[#8A8078]">Order #KS-89421</span>
                  <p className="font-bold text-[#2B2420] text-sm">Placed on September 2, 2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF3EC] px-3 py-1 font-bold text-[#3C6E47]">
                    <Truck size={14} /> In Transit (Estimated Sept 8)
                  </span>
                  <span className="font-bold text-sm text-[#2B2420]">$110.00</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=200&q=80"
                  alt="Throw blanket"
                  className="h-16 w-16 rounded-xl object-cover bg-[#F3E6D3]"
                />
                <div>
                  <h4 className="font-semibold text-sm text-[#2B2420]">Hand-Loomed Merino & Raw Silk Throw Blanket</h4>
                  <p className="text-xs text-[#8A8078]">Maker: Devi Weavers Guild • Kullu Valley</p>
                  <p className="text-xs font-bold text-[#3C6E47] mt-1">Direct Artisan Tracking: #INDPOST-772910</p>
                </div>
              </div>
            </div>

            {/* Order 2 */}
            <div className="rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-6 card-shadow space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDE4D6] pb-4 text-xs">
                <div>
                  <span className="text-[#8A8078]">Order #KS-74102</span>
                  <p className="font-bold text-[#2B2420] text-sm">Delivered on August 18, 2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">
                    <CheckCircle2 size={14} /> Delivered & Verified
                  </span>
                  <span className="font-bold text-sm text-[#2B2420]">$48.00</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=200&q=80"
                  alt="Stoneware vase"
                  className="h-16 w-16 rounded-xl object-cover bg-[#F3E6D3]"
                />
                <div>
                  <h4 className="font-semibold text-sm text-[#2B2420]">Hand-Thrown Stoneware Vase with Ash Glaze</h4>
                  <p className="text-xs text-[#8A8078]">Maker: Rajesh Kumar & Kiln Collective • Khurja</p>
                </div>
              </div>
            </div>
          </div>
        )}


        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-[#3C6E47] bg-[#FFFDF9] p-6 card-shadow space-y-3 relative">
              <span className="absolute top-4 right-4 rounded-full bg-[#3C6E47] px-2.5 py-0.5 text-[10px] font-bold text-white">Default</span>
              <h4 className="font-bold text-sm text-[#2B2420]">Home Residence</h4>
              <p className="text-xs text-[#8A8078] leading-relaxed">
                Helene Engels<br />
                24 Craftsperson Way, Apt 4B<br />
                Brooklyn, NY 11201, United States<br />
                Phone: +1 (555) 234-5678
              </p>
            </div>

            <div className="rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-6 card-shadow space-y-3">
              <h4 className="font-bold text-sm text-[#2B2420]">Studio / Gallery Delivery</h4>
              <p className="text-xs text-[#8A8078] leading-relaxed">
                Helene Engels Gallery<br />
                88 Mercer Street, Floor 2<br />
                SoHo, New York, NY 10012, United States
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
