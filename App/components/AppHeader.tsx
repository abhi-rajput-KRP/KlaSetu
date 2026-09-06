import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ShoppingBag, User } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { cartCount } = useShop();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/')} style={styles.logoContainer}>
          <Text style={styles.logo}>KlaSetu</Text>
          <Text style={styles.subLogo}>कला-सेतु</Text>
        </Pressable>

        <View style={styles.headerIcons}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/products')}
            hitSlop={8}
          >
            <Search size={20} color={COLORS.textPrimary} />
          </Pressable>

          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/cart')}
            hitSlop={8}
          >
            <ShoppingBag size={20} color={COLORS.textPrimary} />
            {cartCount > 0 && (
              <View style={[styles.badge, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/profile')}
            hitSlop={8}
          >
            <User size={20} color={COLORS.textPrimary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    zIndex: 100,
  },
  header: {
    height: 56,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  subLogo: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.terracotta,
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFDF9',
  },
});
