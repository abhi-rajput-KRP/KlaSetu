import { createContext, useContext, useState } from 'react';
import { ARTISAN_PRODUCTS } from '../data/productsData';

const ShopContext = createContext();

// Enrich initial products with SKUs and stock metadata for Studio management
const INITIAL_PRODUCTS = ARTISAN_PRODUCTS.map((p, idx) => ({
  ...p,
  sku: `KS-${p.category.slice(0, 3).toUpperCase()}-${String(idx + 101).padStart(3, '0')}`,
  inStock: typeof p.inStock === 'number' ? p.inStock : 12,
  minThreshold: 5,
  status: (p.inStock ?? 12) > 0 ? 'active' : 'out_of_stock',
  costPrice: Math.round(p.price * 0.45),
  salesCount: Math.floor(Math.random() * 40) + 15,
}));

const INITIAL_STORE_PROFILE = {
  storeName: "Kiln & Loom Heritage Atelier",
  artisanName: "Rajesh Kumar & Helene Engels",
  tagline: "Authentic Master-Crafted Stoneware & Handloom Heirlooms",
  location: "Khurja, Uttar Pradesh & Kullu Valley",
  bio: "Preserving generational pottery and mountain handloom traditions. Every craft piece is shaped sustainably using natural clays, wild silks, and organic botanical dyes.",
  categorySpecialty: "Ceramics & Pottery, Handloom Textiles",
  yearsActive: "18+ Years",
  rating: 4.94,
  reviewsCount: 348,
  verifiedBadge: "GI Tag Certified Master Artisan",
  giTagNumber: "GI-IN-UP-2024-883",
  announcement: "🌿 Festive Autumn Craft Drop: Complimentary organic packaging & signed certificates on all orders over $75!",
  announcementActive: true,
  isOpen: true,
  leadTime: "1-3 business days",
  instagram: "@klasetu.heritage",
  whatsapp: "+91 98765 43210",
  email: "studio@klasetu.art",
  payoutUpi: "artisan.rajesh@okhdfcbank",
  coverImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=80",
  avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
};

const INITIAL_ORDERS = [
  {
    id: "ORD-89421",
    customer: "Helene Engels",
    email: "helene.engels@example.com",
    city: "Mumbai, Maharashtra",
    items: [
      { id: 2, name: "Hand-Loomed Merino & Raw Silk Throw Blanket", quantity: 1, price: 110 }
    ],
    total: 110,
    status: "In Transit",
    date: "Sep 02, 2026",
    trackingId: "BLUEDART-882319",
  },
  {
    id: "ORD-89419",
    customer: "Aarav Sharma",
    email: "aarav.s@example.com",
    city: "Bengaluru, Karnataka",
    items: [
      { id: 1, name: "Hand-Thrown Stoneware Vase with Speckled Ash Glaze", quantity: 2, price: 48 }
    ],
    total: 96,
    status: "Processing",
    date: "Sep 04, 2026",
    trackingId: "PENDING",
  },
  {
    id: "ORD-89410",
    customer: "Sophia Rossi",
    email: "s.rossi@milano.it",
    city: "New Delhi (International)",
    items: [
      { id: 4, name: "Lost-Wax Cast Brass Dhokra Peacock Figurine", quantity: 1, price: 68 },
      { id: 5, name: "Braided Vegetable-Tanned Leather Coasters", quantity: 1, price: 32 }
    ],
    total: 100,
    status: "Ready to Ship",
    date: "Sep 05, 2026",
    trackingId: "DHL-901423",
  },
  {
    id: "ORD-89392",
    customer: "Vikramaditya Roy",
    email: "vikram.roy@heritage.in",
    city: "Kolkata, West Bengal",
    items: [
      { id: 6, name: "Jaipur Blue Pottery Hand-Painted Floral Serving Bowl", quantity: 1, price: 42 }
    ],
    total: 42,
    status: "Delivered",
    date: "Aug 29, 2026",
    trackingId: "SPEEDPOST-441209",
  }
];

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [storeProfile, setStoreProfile] = useState(INITIAL_STORE_PROFILE);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [wishlist, setWishlist] = useState([1, 4]);

  // Initial cart with items
  const [cart, setCart] = useState([
    {
      id: 1,
      item: INITIAL_PRODUCTS[0],
      quantity: 1,
    },
    {
      id: 5,
      item: INITIAL_PRODUCTS[4],
      quantity: 5,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === product.id);
      if (existing) {
        return prevCart.map((ci) =>
          ci.id === product.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prevCart, { id: product.id, item: product, quantity }];
    });
    showToast(`Added "${product.name.slice(0, 26)}..." to cart!`);
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((ci) => {
          if (ci.id === productId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean)
      );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.id !== productId));
    showToast('Item removed from cart');
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from your favorites');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your favorites!');
        return [...prev, productId];
      }
    });
  };

  // Studio Inventory & Product Handlers
  const addProduct = (newProd) => {
    const nextId = Math.max(...products.map((p) => p.id), 0) + 1;
    const catCode = (newProd.category || 'GEN').slice(0, 3).toUpperCase();
    const productToAdd = {
      ...newProd,
      id: nextId,
      sku: newProd.sku || `KS-${catCode}-${String(nextId).padStart(3, '0')}`,
      rating: newProd.rating || 5.0,
      reviewsCount: newProd.reviewsCount || 0,
      badge: newProd.badge || 'New Craft',
      isFeatured: newProd.isFeatured ?? true,
      inStock: Number(newProd.inStock) || 1,
      minThreshold: Number(newProd.minThreshold) || 5,
      costPrice: Number(newProd.costPrice) || Math.round((Number(newProd.price) || 50) * 0.45),
      status: (Number(newProd.inStock) || 1) > 0 ? 'active' : 'out_of_stock',
      gallery: newProd.gallery?.length ? newProd.gallery : [newProd.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'],
    };

    setProducts((prev) => [productToAdd, ...prev]);
    showToast(`Craft "${productToAdd.name.slice(0, 24)}..." published to store!`);
    return productToAdd;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const merged = { ...p, ...updatedFields };
          if (typeof updatedFields.inStock === 'number') {
            merged.status = updatedFields.inStock > 0 ? 'active' : 'out_of_stock';
          }
          return merged;
        }
        return p;
      })
    );
    showToast('Craft details updated successfully');
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((ci) => ci.id !== productId));
    showToast('Product removed from catalog');
  };

  const updateStock = (productId, newStock) => {
    const stockVal = Math.max(0, Number(newStock) || 0);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              inStock: stockVal,
              status: stockVal > 0 ? 'active' : 'out_of_stock',
            }
          : p
      )
    );
    showToast(`Stock updated to ${stockVal} units`);
  };

  const adjustStock = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = Math.max(0, (p.inStock || 0) + delta);
          return {
            ...p,
            inStock: updated,
            status: updated > 0 ? 'active' : 'out_of_stock',
          };
        }
        return p;
      })
    );
  };

  const updateStoreProfile = (newFields) => {
    setStoreProfile((prev) => ({ ...prev, ...newFields }));
    showToast('Store settings saved successfully!');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order ${orderId} updated to "${newStatus}"`);
  };

  const cartCount = cart.length;
  const cartSubtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        // Studio & Inventory extensions
        storeProfile,
        updateStoreProfile,
        orders,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        adjustStock,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#2B2420] px-5 py-3 text-sm font-medium text-[#FFFDF9] shadow-xl transition-all animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-[#3C6E47]"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

