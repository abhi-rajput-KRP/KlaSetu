import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ARTISAN_PRODUCTS } from '../data/productsData';
import { authAPI, marketAPI, getImageUrl } from '../utils/Backend';

const ShopContext = createContext();

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
  announcement: "🌿 Festive Autumn Craft Drop: Complimentary organic packaging & signed certificates on all orders over ₹750!",
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

export function ShopProvider({ children }) {
  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('klasetu_token') || null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Products & Orders state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [storeProfile, setStoreProfile] = useState(INITIAL_STORE_PROFILE);
  const [orders, setOrders] = useState([]);

  // Shopping state
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Helper for checking if logged in user is an artisan
  const isArtisan = user?.user_type === 'artisan';

  // 1. Load User on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('klasetu_token');
      if (storedToken) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
          if (userData.store_name) {
            setStoreProfile((prev) => ({
              ...prev,
              storeName: userData.store_name,
              artisanName: userData.name,
              location: userData.location || prev.location,
              categorySpecialty: userData.craft_discipline || prev.categorySpecialty,
              bio: userData.bio || prev.bio,
            }));
          }
        } catch (err) {
          console.warn("Session expired or invalid token:", err);
          localStorage.removeItem('klasetu_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoadingUser(false);
    };

    fetchUser();
  }, [token]);

  // 2. Fetch Products from Backend
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const backendProds = await marketAPI.getProducts();
      if (backendProds && Array.isArray(backendProds)) {
        const mapped = backendProds.map((p, idx) => ({
          ...p,
          sku: `KS-${(p.category || 'GEN').slice(0, 3).toUpperCase()}-${String(idx + 101).padStart(3, '0')}`,
          costPrice: Math.round((p.price || 50) * 0.45),
          salesCount: 0,
        }));
        setProducts(mapped);
        if (mapped[0]) setSelectedProduct(mapped[0]);
        else setSelectedProduct(null);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn("Backend products fetch error:", err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 3. Fetch Orders from Backend
  const fetchOrders = useCallback(async () => {
    const storedToken = localStorage.getItem('klasetu_token');
    if (!storedToken) return;

    try {
      const backendOrders = await marketAPI.getOrders();
      if (backendOrders) {
        setOrders(backendOrders);
      }
    } catch (err) {
      console.warn("Backend orders fetch error:", err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  // ==================== AUTH HANDLERS ====================
  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('klasetu_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    if (data.user.store_name) {
      setStoreProfile((prev) => ({
        ...prev,
        storeName: data.user.store_name,
        artisanName: data.user.name,
        location: data.user.location || prev.location,
        categorySpecialty: data.user.craft_discipline || prev.categorySpecialty,
      }));
    }
    showToast(`Welcome back, ${data.user.name}!`);
    return data.user;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    localStorage.setItem('klasetu_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    if (data.user.store_name) {
      setStoreProfile((prev) => ({
        ...prev,
        storeName: data.user.store_name,
        artisanName: data.user.name,
      }));
    }
    showToast(`Account created! Welcome to KlaSetu, ${data.user.name}`);
    return data.user;
  };

  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem('klasetu_token');
    setToken(null);
    setUser(null);
    showToast("Signed out successfully");
  };

  const updateUserProfile = async (profileData) => {
    const updated = await authAPI.updateProfile(profileData);
    setUser(updated);
    showToast("Profile updated successfully");
    return updated;
  };

  // ==================== CART & WISHLIST ====================
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
    showToast(`Added "${product.name.slice(0, 24)}..." to cart!`);
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

  const clearCart = () => setCart([]);

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

  // ==================== MARKETPLACE / STUDIO ACTIONS ====================
  const addProduct = async (newProd) => {
    try {
      const created = await marketAPI.createProduct(newProd);
      const enriched = {
        ...created,
        sku: `KS-${(created.category || 'GEN').slice(0, 3).toUpperCase()}-${String(products.length + 101).padStart(3, '0')}`,
        costPrice: Math.round((created.price || 50) * 0.45),
        salesCount: 0,
      };
      setProducts((prev) => [enriched, ...prev]);
      showToast(`Craft "${enriched.name.slice(0, 24)}..." published to store!`);
      return enriched;
    } catch (err) {
      console.error("Failed to add product to backend:", err);
      // Fallback local addition if backend failed
      const nextId = Math.max(...products.map((p) => (typeof p.id === 'number' ? p.id : 0)), 0) + 1;
      const localProd = { ...newProd, id: nextId };
      setProducts((prev) => [localProd, ...prev]);
      showToast(`Craft published locally!`);
      return localProd;
    }
  };

  const updateProduct = async (productId, updatedFields) => {
    try {
      const updated = await marketAPI.updateProduct(productId, updatedFields);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...updated } : p))
      );
      showToast('Craft details updated successfully');
    } catch (err) {
      console.error("Backend update product failed:", err);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...updatedFields } : p))
      );
      showToast('Craft updated locally');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await marketAPI.deleteProduct(productId);
    } catch (err) {
      console.warn("Backend delete product fallback:", err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((ci) => ci.id !== productId));
    showToast('Product removed from catalog');
  };

  const updateStock = async (productId, newStock) => {
    const stockVal = Math.max(0, Number(newStock) || 0);
    try {
      await marketAPI.updateStock(productId, stockVal);
    } catch (err) {
      console.warn("Backend stock update fallback:", err);
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              inStock: stockVal,
              in_stock: stockVal,
              status: stockVal > 0 ? 'active' : 'out_of_stock',
            }
          : p
      )
    );
    showToast(`Stock updated to ${stockVal} units`);
  };

  const adjustStock = (productId, delta) => {
    const p = products.find((prod) => prod.id === productId);
    if (!p) return;
    const currentStock = p.inStock ?? p.in_stock ?? 0;
    const newStock = Math.max(0, currentStock + delta);
    updateStock(productId, newStock);
  };

  // Orders Actions
  const placeOrder = async (orderData) => {
    try {
      const created = await marketAPI.createOrder(orderData);
      setOrders((prev) => [created, ...prev]);
      clearCart();
      showToast(`Order #${created.id} placed successfully!`);
      return created;
    } catch (err) {
      console.error("Failed to place order:", err);
      // Fallback local order
      const localId = `KS-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const localOrder = {
        ...orderData,
        id: localId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Processing',
        trackingId: `INDPOST-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      setOrders((prev) => [localOrder, ...prev]);
      clearCart();
      showToast(`Order #${localId} placed!`);
      return localOrder;
    }
  };

  const updateOrderStatus = async (orderId, newStatus, trackingId) => {
    try {
      await marketAPI.updateOrderStatus(orderId, newStatus, trackingId);
    } catch (err) {
      console.warn("Backend order status update fallback:", err);
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, tracking_id: trackingId || o.tracking_id } : o))
    );
    showToast(`Order ${orderId} updated to "${newStatus}"`);
  };

  const updateStoreProfile = (newFields) => {
    setStoreProfile((prev) => ({ ...prev, ...newFields }));
    showToast('Store settings saved successfully!');
  };

  const cartCount = cart.length;
  const cartSubtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        // Auth
        token,
        user,
        isArtisan,
        loadingUser,
        login,
        register,
        logout,
        updateUserProfile,
        // Catalog & Shopping
        products,
        loadingProducts,
        fetchProducts,
        cart,
        cartCount,
        cartSubtotal,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        // Studio & Orders
        storeProfile,
        updateStoreProfile,
        orders,
        fetchOrders,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        adjustStock,
        getImageUrl,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#2B2420] px-5 py-3 text-sm font-medium text-[#FFFDF9] shadow-xl transition-all">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#3C6E47] animate-ping"></span>
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
