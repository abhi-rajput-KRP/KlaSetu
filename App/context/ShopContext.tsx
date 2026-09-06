import React, { createContext, useContext, useState, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ARTISAN_PRODUCTS } from '../data/productsData';
import { Product, CartItem, StoreProfile, Order } from '../types/product';
import { COLORS } from '../constants/theme';

// Enrich initial products with SKUs and stock metadata for Studio management
const INITIAL_PRODUCTS: Product[] = ARTISAN_PRODUCTS.map((p, idx) => ({
  ...p,
  sku: `KS-${(p.category || 'GEN').slice(0, 3).toUpperCase()}-${String(idx + 101).padStart(3, '0')}`,
  inStock: typeof p.inStock === 'number' ? p.inStock : 12,
  minThreshold: 5,
  status: (p.inStock ?? 12) > 0 ? 'active' : 'out_of_stock',
  costPrice: Math.round(p.price * 0.45),
  salesCount: Math.floor(Math.random() * 40) + 15,
}));

const INITIAL_STORE_PROFILE: StoreProfile = {
  storeName: 'Kiln & Loom Heritage Atelier',
  artisanName: 'Rajesh Kumar & Helene Engels',
  tagline: 'Authentic Master-Crafted Stoneware & Handloom Heirlooms',
  location: 'Khurja, Uttar Pradesh & Kullu Valley',
  bio: 'Preserving generational pottery and mountain handloom traditions. Every craft piece is shaped sustainably using natural clays, wild silks, and organic botanical dyes.',
  categorySpecialty: 'Ceramics & Pottery, Handloom Textiles',
  yearsActive: '18+ Years',
  rating: 4.94,
  reviewsCount: 348,
  verifiedBadge: 'GI Tag Certified Master Artisan',
  giTagNumber: 'GI-IN-UP-2024-883',
  announcement: '🌿 Festive Autumn Craft Drop: Complimentary organic packaging & signed certificates on all orders over $75!',
  announcementActive: true,
  isOpen: true,
  leadTime: '1-3 business days',
  instagram: '@klasetu.heritage',
  whatsapp: '+91 98765 43210',
  email: 'studio@klasetu.art',
  payoutUpi: 'artisan.rajesh@okhdfcbank',
  coverImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=80',
  avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-89421',
    customer: 'Helene Engels',
    email: 'helene.engels@example.com',
    city: 'Mumbai, Maharashtra',
    items: [
      { id: 2, name: 'Hand-Loomed Merino & Raw Silk Throw Blanket', quantity: 1, price: 110 },
    ],
    total: 110,
    status: 'In Transit',
    date: 'Sep 02, 2026',
    trackingId: 'BLUEDART-882319',
  },
  {
    id: 'ORD-89419',
    customer: 'Aarav Sharma',
    email: 'aarav.s@example.com',
    city: 'Bengaluru, Karnataka',
    items: [
      { id: 1, name: 'Hand-Thrown Stoneware Vase with Speckled Ash Glaze', quantity: 2, price: 48 },
    ],
    total: 96,
    status: 'Processing',
    date: 'Sep 04, 2026',
    trackingId: 'PENDING',
  },
  {
    id: 'ORD-89410',
    customer: 'Sophia Rossi',
    email: 's.rossi@milano.it',
    city: 'New Delhi (International)',
    items: [
      { id: 4, name: 'Lost-Wax Cast Brass Dhokra Peacock Figurine', quantity: 1, price: 68 },
      { id: 5, name: 'Braided Vegetable-Tanned Leather Coasters', quantity: 1, price: 32 },
    ],
    total: 100,
    status: 'Ready to Ship',
    date: 'Sep 05, 2026',
    trackingId: 'DHL-901423',
  },
  {
    id: 'ORD-89392',
    customer: 'Vikramaditya Roy',
    email: 'vikram.roy@heritage.in',
    city: 'Kolkata, West Bengal',
    items: [
      { id: 6, name: 'Jaipur Blue Pottery Hand-Painted Floral Serving Bowl', quantity: 1, price: 42 },
    ],
    total: 42,
    status: 'Delivered',
    date: 'Aug 29, 2026',
    trackingId: 'SPEEDPOST-441209',
  },
];

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: number[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  toggleWishlist: (productId: number) => void;
  cartCount: number;
  cartSubtotal: number;
  showToast: (message: string) => void;
  // Studio & Store Profile Extensions
  storeProfile: StoreProfile;
  updateStoreProfile: (newFields: Partial<StoreProfile>) => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  addOrder: (order: Order) => void;
  addProduct: (newProd: Partial<Product>) => Product;
  updateProduct: (productId: number, updatedFields: Partial<Product>) => void;
  deleteProduct: (productId: number) => void;
  updateStock: (productId: number, newStock: number) => void;
  adjustStock: (productId: number, delta: number) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(INITIAL_STORE_PROFILE);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [wishlist, setWishlist] = useState<number[]>([1, 4]);

  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      item: INITIAL_PRODUCTS[0],
      quantity: 1,
    },
    {
      id: 5,
      item: INITIAL_PRODUCTS[4],
      quantity: 2,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(INITIAL_PRODUCTS[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastFade = useRef(new Animated.Value(0)).current;
  const toastSlide = useRef(new Animated.Value(30)).current;

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.parallel([
      Animated.timing(toastFade, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(toastSlide, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastFade, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(toastSlide, {
          toValue: 30,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToastMessage(null);
      });
    }, 2500);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === product.id);
      if (existing) {
        return prevCart.map((ci) =>
          ci.id === product.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prevCart, { id: product.id, item: product, quantity }];
    });
    showToast(`Added "${product.name.slice(0, 22)}..." to cart!`);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((ci) => {
          if (ci.id === productId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.id !== productId));
    showToast('Item removed from cart');
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved crafts');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your craft collection ♥');
        return [...prev, productId];
      }
    });
  };

  // Studio Inventory & Product Handlers
  const addProduct = (newProd: Partial<Product>): Product => {
    const nextId = Math.max(...products.map((p) => p.id), 0) + 1;
    const catCode = (newProd.category || 'GEN').slice(0, 3).toUpperCase();
    const productToAdd: Product = {
      id: nextId,
      name: newProd.name || 'Handcrafted Masterpiece',
      maker: newProd.maker || storeProfile.artisanName,
      location: newProd.location || storeProfile.location,
      category: newProd.category || 'Ceramics & Pottery',
      material: newProd.material || 'Natural Handcrafted Materials',
      technique: newProd.technique || 'Traditional Artisan Technique',
      price: Number(newProd.price) || 50,
      originalPrice: newProd.originalPrice || Math.round((Number(newProd.price) || 50) * 1.25),
      original: newProd.original || Math.round((Number(newProd.price) || 50) * 1.25),
      rating: newProd.rating || 5.0,
      reviewsCount: newProd.reviewsCount || 0,
      reviews: newProd.reviews || 0,
      badge: newProd.badge || 'New Craft',
      isFeatured: newProd.isFeatured ?? true,
      inStock: Number(newProd.inStock) || 1,
      minThreshold: Number(newProd.minThreshold) || 5,
      costPrice: Number(newProd.costPrice) || Math.round((Number(newProd.price) || 50) * 0.45),
      status: (Number(newProd.inStock) || 1) > 0 ? 'active' : 'out_of_stock',
      image: newProd.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      img: newProd.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      gallery: newProd.gallery?.length
        ? newProd.gallery
        : [newProd.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'],
      description: newProd.description || 'Thoughtfully handcrafted by generational artisans preserving rare regional techniques.',
      story: newProd.story || 'Shaped by master hands using time-honoured heritage craft methods.',
      leadTime: newProd.leadTime || 'Ready to ship in 2-3 days',
      sku: newProd.sku || `KS-${catCode}-${String(nextId).padStart(3, '0')}`,
      dimensions: newProd.dimensions || 'Standard',
      weight: newProd.weight || '500 g',
      salesCount: 0,
    };

    setProducts((prev) => [productToAdd, ...prev]);
    showToast(`Craft "${productToAdd.name.slice(0, 20)}..." published!`);
    return productToAdd;
  };

  const updateProduct = (productId: number, updatedFields: Partial<Product>) => {
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

  const deleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((ci) => ci.id !== productId));
    showToast('Product removed from catalog');
  };

  const updateStock = (productId: number, newStock: number) => {
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

  const adjustStock = (productId: number, delta: number) => {
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

  const updateStoreProfile = (newFields: Partial<StoreProfile>) => {
    setStoreProfile((prev) => ({ ...prev, ...newFields }));
    showToast('Store profile settings saved!');
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order ${orderId} updated to "${newStatus}"`);
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    showToast(`Order ${order.id} confirmed!`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        cartCount,
        cartSubtotal,
        showToast,
        // Studio & Store Profile
        storeProfile,
        updateStoreProfile,
        orders,
        updateOrderStatus,
        addOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        adjustStock,
      }}
    >
      {children}
      {toastMessage && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: toastFade,
              transform: [{ translateY: toastSlide }],
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.toastDot} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
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

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 85,
    alignSelf: 'center',
    backgroundColor: COLORS.textPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 9999,
    maxWidth: '90%',
  },
  toastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  toastText: {
    color: '#FFFDF9',
    fontSize: 13,
    fontWeight: '700',
  },
});
