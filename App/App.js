import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOWS } from './src/constants/theme';
import { ShopProvider, useShop } from './src/context/ShopContext';
import Header from './src/components/Header';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StudioScreen from './src/screens/StudioScreen';
import PostProductScreen from './src/screens/PostProductScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

function MainApp() {
  const insets = useSafeAreaInsets();
  const { cartCount, isArtisan, toastMessage } = useShop();

  // Navigation State
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'explore' | 'cart' | 'studio' | 'profile'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPostingProduct, setIsPostingProduct] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null

  // 1. Initial Welcome / Entry Screen
  if (!hasEnteredApp) {
    return (
      <WelcomeScreen
        onExplore={() => {
          setHasEnteredApp(true);
          setActiveTab('home');
        }}
        onLogin={() => {
          setHasEnteredApp(true);
          setAuthModal('login');
        }}
        onRegister={() => {
          setHasEnteredApp(true);
          setAuthModal('register');
        }}
      />
    );
  }

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} translucent={false} />

      {/* Main Header (Shown when not in sub-flow detail modal) */}
      {!selectedProduct && !isPostingProduct && !authModal && (
        <Header
          onOpenCart={() => setActiveTab('cart')}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenSearch={() => setActiveTab('explore')}
          activeTab={activeTab}
        />
      )}

      {/* Main Screen Body */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            onSelectProduct={(p) => setSelectedProduct(p)}
            onExploreCategory={() => setActiveTab('explore')}
            onOpenStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'explore' && (
          <ProductsScreen
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {activeTab === 'cart' && (
          <CartScreen
            onExplore={() => setActiveTab('explore')}
            onOpenOrders={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'studio' && (
          <StudioScreen
            onOpenPostProduct={() => setIsPostingProduct(true)}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            onOpenStudio={() => setActiveTab('studio')}
            onOpenPostProduct={() => setIsPostingProduct(true)}
            onOpenLogin={() => setAuthModal('login')}
            onOpenRegister={() => setAuthModal('register')}
          />
        )}
      </View>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <View style={StyleSheet.absoluteFill}>
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onOpenCart={() => {
              setSelectedProduct(null);
              setActiveTab('cart');
            }}
          />
        </View>
      )}

      {/* Post Product Screen Modal (Artisan AI pipeline) */}
      {isPostingProduct && (
        <View style={StyleSheet.absoluteFill}>
          <PostProductScreen
            onBack={() => setIsPostingProduct(false)}
            onComplete={() => {
              setIsPostingProduct(false);
              setActiveTab('studio');
            }}
          />
        </View>
      )}

      {/* Auth Modals */}
      {authModal === 'login' && (
        <View style={StyleSheet.absoluteFill}>
          <LoginScreen
            onBack={() => setAuthModal(null)}
            onRegister={() => setAuthModal('register')}
            onSuccess={() => setAuthModal(null)}
          />
        </View>
      )}

      {authModal === 'register' && (
        <View style={StyleSheet.absoluteFill}>
          <RegisterScreen
            onBack={() => setAuthModal(null)}
            onLogin={() => setAuthModal('login')}
            onSuccess={() => setAuthModal(null)}
          />
        </View>
      )}

      {/* Bottom Safe Tab Navigation Bar */}
      {!selectedProduct && !isPostingProduct && !authModal && (
        <View style={[styles.bottomTabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {/* Home Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={22}
              color={activeTab === 'home' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabItemLabel,
                activeTab === 'home' && styles.tabItemLabelActive,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Explore Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('explore')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'explore' ? 'compass' : 'compass-outline'}
              size={22}
              color={activeTab === 'explore' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabItemLabel,
                activeTab === 'explore' && styles.tabItemLabelActive,
              ]}
            >
              Explore
            </Text>
          </TouchableOpacity>

          {/* Cart Tab with Badge */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('cart')}
            activeOpacity={0.8}
          >
            <View style={{ position: 'relative' }}>
              <Ionicons
                name={activeTab === 'cart' ? 'bag-handle' : 'bag-handle-outline'}
                size={22}
                color={activeTab === 'cart' ? COLORS.primary : COLORS.textSecondary}
              />
              {cartCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabItemLabel,
                activeTab === 'cart' && styles.tabItemLabelActive,
              ]}
            >
              Bag
            </Text>
          </TouchableOpacity>

          {/* Artisan Studio Tab (ONLY VISIBLE IF ARTISAN ROLE!) */}
          {isArtisan && (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('studio')}
              activeOpacity={0.8}
            >
              <View style={[styles.studioTabCircle, activeTab === 'studio' && styles.studioTabCircleActive]}>
                <Ionicons
                  name="color-palette"
                  size={18}
                  color={activeTab === 'studio' ? COLORS.surface : COLORS.primary}
                />
              </View>
              <Text
                style={[
                  styles.tabItemLabel,
                  activeTab === 'studio' && styles.tabItemLabelActive,
                ]}
              >
                Studio
              </Text>
            </TouchableOpacity>
          )}

          {/* Profile Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'profile' ? 'person' : 'person-outline'}
              size={22}
              color={activeTab === 'profile' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabItemLabel,
                activeTab === 'profile' && styles.tabItemLabelActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Global In-App Toast Notification */}
      {toastMessage && (
        <View style={[styles.toastContainer, { bottom: Math.max(insets.bottom, 16) + 64 }]}>
          <View style={styles.toastDot} />
          <Text style={styles.toastText} numberOfLines={2}>
            {toastMessage}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ShopProvider>
        <MainApp />
      </ShopProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  screenContainer: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
    ...SHADOWS.cardHover,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabItemLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabItemLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  tabBadge: {
    position: 'absolute',
    top: -3,
    right: -8,
    backgroundColor: COLORS.terracotta,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  studioTabCircle: {
    width: 28,
    height: 28,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studioTabCircleActive: {
    backgroundColor: COLORS.primary,
  },
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADII.pill,
    maxWidth: '85%',
    ...SHADOWS.cardHover,
    zIndex: 9999,
  },
  toastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  toastText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },
});
