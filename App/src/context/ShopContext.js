import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, marketApi, setAuthToken, resolveImageUrl } from '../services/api';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // Auth state
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Products & Orders
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orders, setOrders] = useState([]);

  // Shopping state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const isArtisan = user?.user_type === 'artisan' || user?.role === 'artisan';

  // 1. Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await marketApi.getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn('Failed to fetch products from backend:', err?.message);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2. Fetch Orders
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const data = await marketApi.getOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Failed to fetch orders:', err?.message);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  // ==================== AUTH ====================
  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      setToken(data.access_token);
      setAuthToken(data.access_token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name || data.user.email}!`);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid login credentials';
      showToast(msg);
      throw new Error(msg);
    }
  };

  const register = async ({ email, password, full_name, role = 'buyer' }) => {
    try {
      const data = await authApi.register({ email, password, full_name, role });
      setToken(data.access_token);
      setAuthToken(data.access_token);
      setUser(data.user);
      showToast(`Welcome to KlaSetu, ${data.user.name}!`);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed';
      showToast(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore
    } finally {
      setToken(null);
      setAuthToken(null);
      setUser(null);
      showToast('Signed out successfully');
    }
  };

  // ==================== CART & WISHLIST ====================
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name?.slice(0, 20)}..." to cart!`);
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed from cart');
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist!');
        return [...prev, productId];
      }
    });
  };

  // ==================== ARTISAN STUDIO ACTIONS ====================
  const addProduct = async (productData) => {
    try {
      const created = await marketApi.createProduct(productData);
      setProducts((prev) => [created, ...prev]);
      showToast('New craft published successfully!');
      return created;
    } catch (err) {
      console.error('Add product error:', err);
      const fallback = {
        ...productData,
        id: Date.now(),
        in_stock: productData.in_stock || 1,
        rating: 5.0,
        reviews_count: 0,
      };
      setProducts((prev) => [fallback, ...prev]);
      showToast('Craft published locally');
      return fallback;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const updated = await marketApi.updateProduct(id, updatedFields);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      showToast('Craft updated successfully');
    } catch (err) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
      showToast('Craft updated locally');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await marketApi.deleteProduct(id);
    } catch (err) {
      console.warn('Backend delete product fallback:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast('Product removed');
  };

  const updateStock = async (id, newStock) => {
    const stockVal = Math.max(0, Number(newStock) || 0);
    try {
      await marketApi.updateProduct(id, { in_stock: stockVal });
    } catch (err) {
      // Fallback
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, in_stock: stockVal } : p))
    );
    showToast(`Stock updated to ${stockVal}`);
  };

  // Orders
  const placeOrder = async (orderPayload) => {
    try {
      const order = await marketApi.createOrder(orderPayload);
      setOrders((prev) => [order, ...prev]);
      clearCart();
      showToast(`Order #${order.id} confirmed!`);
      return order;
    } catch (err) {
      const fallbackOrder = {
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        ...orderPayload,
        status: 'Processing',
        created_at: new Date().toISOString(),
      };
      setOrders((prev) => [fallbackOrder, ...prev]);
      clearCart();
      showToast(`Order #${fallbackOrder.id} placed!`);
      return fallbackOrder;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await marketApi.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      // Fallback
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} marked as ${newStatus}`);
  };

  // Derived values
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  const cartTax = Math.round(cartSubtotal * 0.05); // 5% GST
  const cartTotal = cartSubtotal + cartTax;

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
        // Catalog
        products,
        loadingProducts,
        fetchProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        // Cart
        cart,
        cartCount,
        cartSubtotal,
        cartTax,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        // Wishlist
        wishlist,
        toggleWishlist,
        // Artisan / Market
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        orders,
        fetchOrders,
        placeOrder,
        updateOrderStatus,
        resolveImageUrl,
        // Toast
        toastMessage,
        showToast,
      }}
    >
      {children}
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
