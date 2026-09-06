import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOWS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product, onPress }) {
  const { addToCart, wishlist, toggleWishlist, resolveImageUrl } = useShop();

  const isFavorite = wishlist.includes(product.id);
  const imageUrl = resolveImageUrl(product.image_url || product.image);
  const rating = product.rating || 4.8;
  const reviewsCount = product.reviews_count || product.reviewsCount || 24;
  const originalPrice = product.original_price || (product.discount ? Math.round(product.price * 1.25) : null);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.88}
    >
      {/* Product Image Box */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Category Badge */}
        {product.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        )}

        {/* Favorite Heart Button */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(product.id)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? COLORS.danger : COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View style={styles.details}>
        {/* Artisan Attribution */}
        <View style={styles.artisanRow}>
          <Ionicons name="sparkles" size={11} color={COLORS.primary} />
          <Text style={styles.artisanName} numberOfLines={1}>
            {product.artisan_name || product.artisan || 'Master Artisan'}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.name || product.title}
        </Text>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={COLORS.star} />
          <Text style={styles.ratingScore}>{rating.toFixed(1)}</Text>
          <Text style={styles.reviewsCount}>({reviewsCount})</Text>
        </View>

        {/* Pricing & Add to Cart */}
        <View style={styles.bottomRow}>
          <View>
            <View style={styles.priceRow}>
              <Text style={styles.currency}>₹</Text>
              <Text style={styles.price}>{product.price}</Text>
            </View>
            {originalPrice && (
              <Text style={styles.originalPrice}>₹{originalPrice}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => addToCart(product, 1)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color={COLORS.surface} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 16,
    ...SHADOWS.card,
  },
  imageWrapper: {
    width: '100%',
    height: 170,
    backgroundColor: COLORS.surfaceMuted,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(243, 230, 211, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.pill,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(255, 253, 249, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    padding: 12,
  },
  artisanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  artisanName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewsCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.terracotta,
    marginRight: 1,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  originalPrice: {
    fontSize: 11,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginTop: -2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADII.pill,
    ...SHADOWS.button,
  },
  addBtnText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },
});
