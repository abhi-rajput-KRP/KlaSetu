import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ARTISAN_PRODUCTS } from '../data/productsData';
import { Product, CartItem } from '../types/product';
import { COLORS } from '../constants/theme';
import { CheckCircle2 } from 'lucide-react-native';

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
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products] = useState<Product[]>(ARTISAN_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      item: ARTISAN_PRODUCTS[0],
      quantity: 1,
    },
    {
      id: 5,
      item: ARTISAN_PRODUCTS[4],
      quantity: 2,
    },
  ]);
  const [wishlist, setWishlist] = useState<number[]>([2, 4]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(ARTISAN_PRODUCTS[0]);
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
