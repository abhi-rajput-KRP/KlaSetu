import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, PlusCircle, ShoppingBag, User } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

export default function BottomNav() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { cartCount } = useShop();

  const isHome = pathname === '/' || pathname === '';
  const isProducts = pathname === '/products';
  const isStudio = pathname === '/studio' || pathname === '/add-product' || pathname === '/sellers_page';
  const isCart = pathname === '/cart';
  const isProfile = pathname === '/profile';

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, height: 60 + insets.bottom }]}>
      <Pressable
        style={styles.tab}
        onPress={() => router.replace('/')}
      >
        <Home
          size={20}
          color={isHome ? COLORS.primary : COLORS.textSecondary}
          strokeWidth={isHome ? 2.5 : 1.8}
        />
        <Text
          style={[
            styles.tabText,
            isHome && styles.activeTabText,
          ]}
        >
          Home
        </Text>
      </Pressable>

      <Pressable
        style={styles.tab}
        onPress={() => router.push('/products')}
      >
        <Compass
          size={20}
          color={isProducts ? COLORS.primary : COLORS.textSecondary}
          strokeWidth={isProducts ? 2.5 : 1.8}
        />
        <Text
          style={[
            styles.tabText,
            isProducts && styles.activeTabText,
          ]}
        >
          Explore
        </Text>
      </Pressable>

      <Pressable
        style={styles.centerTab}
        onPress={() => router.push('/studio')}
      >
        <View style={styles.centerIconBg}>
          <PlusCircle size={22} color="#FFFDF9" strokeWidth={2.2} />
        </View>
        <Text style={[styles.tabText, isStudio && styles.activeTabText]}>
          Studio
        </Text>
      </Pressable>

      <Pressable
        style={styles.tab}
        onPress={() => router.push('/cart')}
      >
        <View style={styles.iconWithBadge}>
          <ShoppingBag
            size={20}
            color={isCart ? COLORS.primary : COLORS.textSecondary}
            strokeWidth={isCart ? 2.5 : 1.8}
          />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.tabText,
            isCart && styles.activeTabText,
          ]}
        >
          Cart
        </Text>
      </Pressable>

      <Pressable
        style={styles.tab}
        onPress={() => router.push('/profile')}
      >
        <User
          size={20}
          color={isProfile ? COLORS.primary : COLORS.textSecondary}
          strokeWidth={isProfile ? 2.5 : 1.8}
        />
        <Text
          style={[
            styles.tabText,
            isProfile && styles.activeTabText,
          ]}
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 6,
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: -8,
  },
  centerIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  iconWithBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -7,
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFDF9',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
