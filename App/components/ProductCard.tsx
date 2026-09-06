import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Heart, MapPin, ShoppingBag, Star } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { Product } from '../types/product';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addToCart, setSelectedProduct } = useShop();

  const isWishlisted = wishlist.includes(product.id);
  const imageUrl = product.image || product.img || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80';
  const originalPrice = product.originalPrice || product.original;
  const reviewsCount = product.reviewsCount ?? product.reviews ?? 0;

  const handleOpenDetails = () => {
    setSelectedProduct(product);
    router.push({
      pathname: '/product',
      params: { id: product.id.toString() },
    });
  };

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <View style={styles.card}>
      <Pressable onPress={handleOpenDetails} style={styles.imageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {/* Top Badges */}
        <View style={styles.badgeContainer}>
          {product.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
          {discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>-{discountPercent}%</Text>
            </View>
          )}
        </View>

        {/* Wishlist Heart */}
        <Pressable
          style={styles.heart}
          onPress={() => toggleWishlist(product.id)}
          hitSlop={6}
        >
          <Heart
            size={16}
            color={isWishlisted ? COLORS.terracotta : COLORS.textPrimary}
            fill={isWishlisted ? COLORS.terracotta : 'transparent'}
          />
        </Pressable>
      </Pressable>

      <View style={styles.body}>
        {/* Maker & Location */}
        <View style={styles.makerRow}>
          <Text style={styles.maker} numberOfLines={1}>
            {product.maker}
          </Text>
          {product.location && (
            <View style={styles.locationTag}>
              <MapPin size={10} color={COLORS.textSecondary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {product.location.split(',')[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Product Title */}
        <Pressable onPress={handleOpenDetails}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
        </Pressable>

        {/* Material or Category Tag */}
        <View style={styles.tagRow}>
          <View style={styles.materialTag}>
            <Text style={styles.materialText} numberOfLines={1}>
              {product.category || product.material}
            </Text>
          </View>
        </View>

        {/* Rating & Reviews */}
        <View style={styles.ratingRow}>
          <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
          <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({reviewsCount})</Text>
        </View>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          {originalPrice && (
            <Text style={styles.original}>${originalPrice}</Text>
          )}
        </View>

        {/* Direct Add to Cart Button */}
        <Pressable
          style={({ pressed }) => [
            styles.cartBtn,
            pressed && { backgroundColor: COLORS.primaryDark, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => addToCart(product, 1)}
        >
          <ShoppingBag size={14} color="#FFFDF9" />
          <Text style={styles.cartText}>Add to Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#2B2420',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageWrap: {
    height: 180,
    position: 'relative',
    backgroundColor: COLORS.accentBg,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 5,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  badgeText: {
    color: '#FFFDF9',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  discountBadge: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  discountBadgeText: {
    color: '#FFFDF9',
    fontSize: 10,
    fontWeight: '800',
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 253, 249, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  body: {
    padding: 12,
    gap: 6,
  },
  makerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  maker: {
    fontSize: 11,
    color: COLORS.terracotta,
    fontWeight: '700',
    flex: 1,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
  },
  materialTag: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    maxWidth: '100%',
  },
  materialText: {
    fontSize: 9.5,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  rating: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  reviews: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  original: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  cartBtn: {
    marginTop: 6,
    width: '100%',
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    elevation: 1,
  },
  cartText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFDF9',
  },
});
