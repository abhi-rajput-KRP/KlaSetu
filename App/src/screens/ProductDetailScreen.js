import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOWS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

export default function ProductDetailScreen({ product, onBack, onOpenCart }) {
  const insets = useSafeAreaInsets();
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    resolveImageUrl,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'materials' | 'care'

  if (!product) return null;

  const isFavorite = wishlist.includes(product.id);
  const imageUrl = resolveImageUrl(product.image_url || product.image);
  const rating = product.rating || 4.9;
  const reviewsCount = product.reviews_count || product.reviewsCount || 38;
  const originalPrice =
    product.original_price || (product.discount ? Math.round(product.price * 1.25) : null);
  const inStock = (product.in_stock ?? product.inStock ?? 1) > 0;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Discover this authentic handcrafted ${product.name} by ${product.artisan_name || 'Master Artisan'} on KlaSetu!`,
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (onOpenCart) onOpenCart();
  };

  return (
    <View style={styles.container}>
      {/* Safe Area Header Bar */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Craft Provenance
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => toggleWishlist(product.id)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? COLORS.danger : COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {product.category && (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{product.category}</Text>
            </View>
          )}
          {inStock ? (
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>Handmade • In Stock</Text>
            </View>
          ) : (
            <View style={[styles.stockBadge, { backgroundColor: COLORS.danger }]}>
              <Text style={styles.stockBadgeText}>Made to Order</Text>
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View style={styles.detailsCard}>
          {/* Artisan Provenance Card */}
          <View style={styles.artisanBanner}>
            <View style={styles.artisanIconWrapper}>
              <Ionicons name="hammer" size={16} color={COLORS.surface} />
            </View>
            <View style={styles.artisanMeta}>
              <View style={styles.artisanNameRow}>
                <Text style={styles.artisanTitle}>
                  {product.artisan_name || product.artisan || 'Master Artisan'}
                </Text>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
              </View>
              <Text style={styles.artisanLocation}>
                {product.location || 'Traditional Heritage Atelier, India'}
              </Text>
            </View>
            <View style={styles.giBadge}>
              <Ionicons name="ribbon" size={12} color={COLORS.terracotta} />
              <Text style={styles.giBadgeText}>GI Certified</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.productTitle}>{product.name || product.title}</Text>

          {/* Rating & Review Info */}
          <View style={styles.ratingSection}>
            <View style={styles.starsGroup}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={15} color={COLORS.star} />
              ))}
            </View>
            <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
            <Text style={styles.ratingDivider}>•</Text>
            <Text style={styles.reviewsText}>{reviewsCount} verified connoisseur reviews</Text>
          </View>

          {/* Price & Equity Banner */}
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.rupeeSymbol}>₹</Text>
              <Text style={styles.mainPrice}>{product.price}</Text>
              {originalPrice && (
                <Text style={styles.strikePrice}>₹{originalPrice}</Text>
              )}
            </View>
            <View style={styles.equityBadge}>
              <Ionicons name="shield-checkmark" size={12} color={COLORS.primaryDark} />
              <Text style={styles.equityText}>85% goes directly to maker</Text>
            </View>
          </View>

          {/* Quantity Stepper */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.stepCount}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Tabs */}
          <View style={styles.tabNav}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'story' && styles.tabBtnActive]}
              onPress={() => setActiveTab('story')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'story' && styles.tabBtnTextActive,
                ]}
              >
                Craft Story
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'materials' && styles.tabBtnActive]}
              onPress={() => setActiveTab('materials')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'materials' && styles.tabBtnTextActive,
                ]}
              >
                Materials
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'care' && styles.tabBtnActive]}
              onPress={() => setActiveTab('care')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'care' && styles.tabBtnTextActive,
                ]}
              >
                Care Guide
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content Panels */}
          <View style={styles.tabContentPanel}>
            {activeTab === 'story' && (
              <View>
                <Text style={styles.tabHeading}>Ancestral Craftsmanship</Text>
                <Text style={styles.tabParagraph}>
                  {product.description ||
                    'Each piece is crafted by generational masters using traditional techniques passed down through centuries. No automated casting or factory mass-production is involved.'}
                </Text>
                <View style={styles.provenanceNotice}>
                  <Ionicons name="sparkles" size={16} color={COLORS.terracotta} />
                  <Text style={styles.provenanceNoticeText}>
                    Signed Certificate of Provenance included with this craft.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'materials' && (
              <View>
                <Text style={styles.tabHeading}>Pure & Sustainable Ingredients</Text>
                <Text style={styles.tabParagraph}>
                  • Natural alluvial riverbed clay & minerals{'\n'}
                  • Lead-free organic glazes fired at 1200°C{'\n'}
                  • 100% biodegradable and zero micro-plastics{'\n'}
                  • Sourced ethically from local craft guilds
                </Text>
              </View>
            )}

            {activeTab === 'care' && (
              <View>
                <Text style={styles.tabHeading}>Heirloom Care & Longevity</Text>
                <Text style={styles.tabParagraph}>
                  Hand wash gently with mild organic soap and lukewarm water. Avoid sudden extreme temperature shocks or abrasive wire scrubbers to maintain the master finish.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons name="bag-handle-outline" size={18} color={COLORS.primary} />
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={handleBuyNow}
          activeOpacity={0.88}
        >
          <Text style={styles.buyBtnText}>Instant Checkout</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: COLORS.surfaceMuted,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  categoryPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255, 253, 249, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  stockBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(60, 110, 71, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  stockBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.surface,
  },
  detailsCard: {
    padding: 20,
    backgroundColor: COLORS.surface,
  },
  artisanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.linen,
    borderRadius: RADII.card,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  artisanIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  artisanMeta: {
    flex: 1,
  },
  artisanNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  artisanTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  artisanLocation: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  giBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 253, 249, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  giBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.terracotta,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
    marginBottom: 8,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  starsGroup: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ratingDivider: {
    color: COLORS.textMuted,
  },
  reviewsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rupeeSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.terracotta,
    marginRight: 2,
  },
  mainPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  strikePrice: {
    fontSize: 14,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  equityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
  },
  equityText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.linen,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCount: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tabNav: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  tabContentPanel: {
    paddingBottom: 20,
  },
  tabHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  tabParagraph: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  provenanceNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.linen,
    padding: 12,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  provenanceNoticeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 12,
    ...SHADOWS.card,
  },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADII.pill,
    paddingVertical: 14,
  },
  cartBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  buyBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.pill,
    paddingVertical: 14,
    ...SHADOWS.button,
  },
  buyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.surface,
  },
});
