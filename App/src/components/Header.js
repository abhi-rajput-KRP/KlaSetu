import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII } from '../constants/theme';
import Logo from '../assets/Logo';
import { useShop } from '../context/ShopContext';

export default function Header({ onOpenCart, onOpenProfile, onOpenSearch, activeTab }) {
  const insets = useSafeAreaInsets();
  const { cartCount, user, isArtisan } = useShop();

  return (
    <View style={[styles.wrapper, { paddingTop: Math.max(insets.top, 16) }]}>
      <View style={styles.content}>
        {/* Brand Logo */}
        <View style={styles.left}>
          <Logo size={36} showText={true} />
          {isArtisan && (
            <View style={styles.artisanBadge}>
              <Ionicons name="color-palette" size={10} color={COLORS.surface} />
              <Text style={styles.artisanBadgeText}>STUDIO</Text>
            </View>
          )}
        </View>

        {/* Right Actions */}
        <View style={styles.right}>
          {onOpenSearch && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onOpenSearch}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="search-outline" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}

          {/* Cart Icon with Counter Badge */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenCart}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="bag-handle-outline" size={22} color={COLORS.textPrimary} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* User Profile Button */}
          <TouchableOpacity
            style={[styles.profileBtn, user ? styles.profileBtnActive : null]}
            onPress={onOpenProfile}
          >
            {user ? (
              <Text style={styles.avatarLetter}>
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </Text>
            ) : (
              <Ionicons name="person-outline" size={18} color={COLORS.textPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 12,
    paddingHorizontal: 18,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  artisanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADII.pill,
    marginLeft: 4,
  },
  artisanBadgeText: {
    color: COLORS.surface,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.linen,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.terracotta,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtnActive: {
    backgroundColor: COLORS.primary,
  },
  avatarLetter: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
