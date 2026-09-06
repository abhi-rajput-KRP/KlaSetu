import { useNavigate } from 'react-router';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct } = useShop();
  const navigate = useNavigate();

  if (!product) return null;

  const handleCardClick = () => {
    setSelectedProduct(product);
    navigate('/product');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EDE4D6] bg-[#FFFDF9] p-4 sm:p-5 card-shadow transition-card hover:-translate-y-1 card-shadow-hover cursor-pointer"
    >
      <div>
        {/* Product Image Box with Overlays */}
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#F3E6D3]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top-Left Badge (Discount / Craft origin) */}
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-full bg-[#C77B3E] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="mt-1.5 font-medium text sm:text-base leading-snug text-[#2B2420] group-hover:text-[#3C6E47] transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Material / Technique Chip */}
        {product.material && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="inline-block rounded-md bg-[#F3E6D3]/60 px-2 py-0.5 text-[11px] font-medium text-[#2B2420]">
              {product.material.split(',')[0]}
            </span>
          </div>
        )}

        {/* Star Rating & Review Count */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="flex items-center text-[#F5B301]">
            <Star size={14} className="fill-[#F5B301]" />
          </div>
          <span className="text-xs font-bold text-[#2B2420]">{product.rating}</span>
          <span className="text-xs text-[#8A8078]">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Price & Action Section */}
      <div className="mt-4 pt-3 border-t border-[#EDE4D6]/60">
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#3C6E47]">${product.price}</span>
          </div>
        </div>

        {/* Full-width Pill-Shaped Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3C6E47] py-2.5 px-4 text-xs sm:text-sm font-semibold text-[#FFFDF9] shadow-xs transition-all hover:bg-[#2F5838] active:scale-98"
        >
          <ShoppingBag size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
