import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Leaf,
  MapPin,
  Sparkles,
  Check,
  ChevronRight,
  User,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router';

export default function Product() {
  const { selectedProduct, products, addToCart, toggleWishlist, wishlist, getImageUrl } = useShop();

  const product = selectedProduct || products[0];
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('story');

  const galleryImages = product.gallery || [product.image];
  const isWishlisted = wishlist.includes(product.id);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const fallbackRelated = relatedProducts.length > 0 ? relatedProducts : products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-[#FFFDF9] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[#8A8078]">
          <Link to="/" className="hover:text-[#3C6E47]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-[#3C6E47]">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="font-medium text-[#2B2420] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Detail Section: Gallery & Purchase Information */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left: Craft Image Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Photo */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#EDE4D6] bg-[#F3E6D3] shadow-xs">
              <img
                src={getImageUrl(galleryImages[activeImage] || product.image)}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 rounded-full bg-[#C77B3E] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Switcher */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      activeImage === idx
                        ? 'border-[#3C6E47] scale-105 shadow-xs'
                        : 'border-[#EDE4D6] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Craft view ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Craft Details & Purchase Flow (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Maker info banner */}
              <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3E6D3] text-[#3C6E47]">
                    <User size={15} />
                  </div>
                  <span className="text-xs font-bold text-[#B5652F]">{product.maker}</span>
                  {product.location && (
                    <span className="flex items-center gap-1 text-xs text-[#8A8078]">
                      • <MapPin size={12} /> {product.location}
                    </span>
                  )}
                </div>
                <span className="rounded-full bg-[#EBF3EC] px-2.5 py-0.5 text-[11px] font-semibold text-[#3C6E47]">
                  Verified Master
                </span>
              </div>

              {/* Product Headline */}
              <h1 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B2420] mt-3 leading-tight">
                {product.name}
              </h1>

              {/* Ratings and reviews bar */}
              <div className="mt-3 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-[#F5B301]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#F5B301]" />
                  ))}
                </div>
                <span className="font-bold text-[#2B2420]">{product.rating}</span>
                <span className="text-[#8A8078]">({product.reviewsCount} verified reviews)</span>
                <span className="text-xs text-[#3C6E47] font-semibold flex items-center gap-1">
                  <Check size={14} /> In Stock ({product.inStock} left)
                </span>
              </div>

              {/* Price block */}
              <div className="mt-6 flex items-baseline gap-3 rounded-2xl bg-[#F3E6D3]/40 border border-[#EDE4D6] p-4">
                <span className="text-3xl font-bold text-[#3C6E47]">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-[#8A8078] line-through font-normal">
                      ₹{product.originalPrice}
                    </span>
                    <span className="rounded-full bg-[#C77B3E] px-2.5 py-0.5 text-xs font-bold text-white">
                      Save ₹{(product.originalPrice - product.price).toFixed(0)} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                    </span>
                  </>
                )}
              </div>

              {/* Summary Description */}
              <p className="mt-4 text-sm leading-relaxed text-[#8A8078]">
                {product.description}
              </p>

              {/* Craft Highlights Chips */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-[#EDE4D6] bg-white p-3">
                  <span className="text-[#8A8078] block">Material:</span>
                  <strong className="text-[#2B2420] font-semibold">{product.material}</strong>
                </div>
                <div className="rounded-xl border border-[#EDE4D6] bg-white p-3">
                  <span className="text-[#8A8078] block">Technique:</span>
                  <strong className="text-[#2B2420] font-semibold">{product.technique}</strong>
                </div>
              </div>
            </div>

            {/* Action Bar: Quantity Stepper + Add to Cart + Wishlist */}
            <div className="mt-8 border-t border-[#EDE4D6] pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between rounded-full border border-[#EDE4D6] bg-white px-4 py-2 sm:w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3E6D3] text-sm font-bold text-[#2B2420] hover:bg-[#E8D5BC]"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-[#2B2420]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3E6D3] text-sm font-bold text-[#2B2420] hover:bg-[#E8D5BC]"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Pill Button */}
                <button
                  type="button"
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#3C6E47] px-7 py-3.5 text-sm font-bold text-[#FFFDF9] shadow-md transition-all hover:bg-[#2F5838] active:scale-98"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart • ₹{(product.price * quantity).toFixed(2)}</span>
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#EDE4D6] bg-white text-[#2B2420] hover:bg-[#F3E6D3] transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={20}
                    className={isWishlisted ? 'fill-[#C77B3E] text-[#C77B3E]' : 'text-[#2B2420]'}
                  />
                </button>
              </div>

              {/* Guarantees Strip */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#8A8078]">
                <div className="flex items-center gap-1.5">
                  <Truck size={15} className="text-[#3C6E47]" />
                  <span>{product.leadTime || 'Ships within 48 hours'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[#3C6E47]" />
                  <span>Fair Trade 85% Direct to Maker</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Leaf size={15} className="text-[#3C6E47]" />
                  <span>Plastic-free compostable packaging</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Craft Knowledge Section */}
        <div className="mt-16 border-t border-[#EDE4D6] pt-10">
          <div className="flex border-b border-[#EDE4D6] gap-6 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`pb-3 transition-colors ${
                activeTab === 'story'
                  ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                  : 'text-[#8A8078] hover:text-[#2B2420]'
              }`}
            >
              Artisan Story & Technique
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-3 transition-colors ${
                activeTab === 'specs'
                  ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                  : 'text-[#8A8078] hover:text-[#2B2420]'
              }`}
            >
              Dimensions & Care
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fairtrade')}
              className={`pb-3 transition-colors ${
                activeTab === 'fairtrade'
                  ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                  : 'text-[#8A8078] hover:text-[#2B2420]'
              }`}
            >
              Fair-Trade Guarantee
            </button>
          </div>

          <div className="py-6 text-sm leading-relaxed text-[#2B2420]">
            {activeTab === 'story' && (
              <div className="max-w-3xl space-y-4">
                <h3 className="font-serif-heading text-xl font-bold">The Heritage Behind This Piece</h3>
                <p>{product.story || product.description}</p>
                <div className="rounded-2xl bg-[#F3E6D3]/50 p-5 border border-[#EDE4D6]">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#B5652F] mb-1">
                    Authentic Craftsmanship Note
                  </h4>
                  <p className="text-xs text-[#8A8078]">
                    Because this item is shaped and finished by hand without industrial molds or chemical dyes, minor variations in tone, grain, and dimensions celebrate its organic authenticity.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-xl space-y-3">
                <div className="flex justify-between border-b border-[#EDE4D6] py-2">
                  <span className="text-[#8A8078]">Dimensions:</span>
                  <span className="font-semibold">{product.dimensions || 'Custom craft dimensions'}</span>
                </div>
                <div className="flex justify-between border-b border-[#EDE4D6] py-2">
                  <span className="text-[#8A8078]">Weight:</span>
                  <span className="font-semibold">{product.weight || '750 g'}</span>
                </div>
                <div className="flex justify-between border-b border-[#EDE4D6] py-2">
                  <span className="text-[#8A8078]">Care Instructions:</span>
                  <span className="font-semibold">Gentle hand wash / dry wipe. Avoid harsh chemical cleaners.</span>
                </div>
              </div>
            )}

            {activeTab === 'fairtrade' && (
              <div className="max-w-3xl space-y-3">
                <h3 className="font-serif-heading text-xl font-bold text-[#3C6E47]">Direct-to-Artisan Transparency</h3>
                <p className="text-[#8A8078]">
                  KlaSetu operates on radical revenue transparency. For every purchase of this product, ₹{((product.price * 0.85)).toFixed(2)} is transferred directly to {product.maker} without intermediary cuts.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Artisan Products */}
        <div className="mt-16 border-t border-[#EDE4D6] pt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif-heading text-2xl font-bold text-[#2B2420]">
              More Handcrafted Creations
            </h2>
            <Link to="/products" className="text-xs font-semibold text-[#3C6E47] hover:underline">
              Explore All Crafts →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackRelated.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
