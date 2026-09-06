import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useShop } from '../context/ShopContext';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, searchQuery, setSearchQuery } = useShop();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/products');
      setSearchOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-[#3C6E47] ${
      isActive ? 'text-[#3C6E47] font-semibold border-b-2 border-[#3C6E47] pb-1' : 'text-[#2B2420]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EDE4D6] bg-[#FFFDF9]/95 backdrop-blur-md transition-all">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3E6D3] text-[#3C6E47] transition-transform group-hover:scale-105 border border-[#EDE4D6]">
                <img src="/favicon.svg" alt="logo" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-heading text-2xl font-bold tracking-tight text-[#2B2420]">
                  KlaSetu<span className="text-[#3C6E47]">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#8A8078] font-medium">
                  Artisan Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/products" className={navLinkClass}>Explore Crafts</NavLink>
              <NavLink to="/studio" className={navLinkClass}>
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#3C6E47]">
                  <span className="h-2 w-2 rounded-full bg-[#3C6E47]"></span>
                  Artisan Studio
                </span>
              </NavLink>
              <NavLink to="/sellers_page" className={navLinkClass}>
                <span className="inline-flex items-center gap-1.5 text-[#B5652F] font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B5652F] opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B5652F]"></span>
                  </span>
                  Sell Your Craft
                </span>
              </NavLink>
            </nav>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search pottery, handloom, woodwork..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 pl-11 pr-4 text-sm text-[#2B2420] placeholder-[#8A8078] focus:border-[#3C6E47] focus:outline-none focus:ring-1 focus:ring-[#3C6E47] transition-all shadow-inner"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8078]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A8078] hover:text-[#2B2420]"
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon (Mobile toggle) */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full text-[#2B2420] hover:bg-[#F3E6D3] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Account Icon */}
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full border border-[#EDE4D6] px-3 py-1.5 text-sm font-medium text-[#2B2420] hover:bg-[#F3E6D3] transition-colors"
            >
              <User size={18} className="text-[#3C6E47]" />
              <span className="hidden sm:inline">Account</span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-full bg-[#3C6E47] px-4 py-2 text-sm font-medium text-[#FFFDF9] hover:bg-[#2F5838] transition-all shadow-sm active:scale-95"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFFDF9] text-xs font-bold text-[#3C6E47]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-[#2B2420] hover:bg-[#F3E6D3] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {searchOpen && (
          <div className="pb-3 lg:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search pottery, handloom, woodwork..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#EDE4D6] bg-white py-2.5 pl-10 pr-4 text-sm text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
              />
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8078]" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-[#EDE4D6] bg-[#FFFDF9] px-4 py-6 md:hidden shadow-lg animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#2B2420] hover:text-[#3C6E47]"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#2B2420] hover:text-[#3C6E47]"
            >
              Explore Crafts Catalog
            </Link>
            <Link
              to="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#3C6E47] font-semibold flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-[#3C6E47]"></span>
              Artisan Studio & Inventory
            </Link>
            <Link
              to="/sellers_page"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#B5652F] font-semibold"
            >
              Sell Your Craft (Artisan Onboarding)
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#2B2420] hover:text-[#3C6E47]"
            >
              My Account & Orders
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#2B2420] hover:text-[#3C6E47]"
            >
              Shopping Cart ({cartCount})
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
