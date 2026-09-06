import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Leaf,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../constants/theme';
import { useShop } from '../context/ShopContext';
import { ARTISAN_PRODUCTS } from '../data/productsData';

export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { products, selectedProduct, setSelectedProduct, addToCart, wishlist, toggleWishlist } = useShop();

  const productId = params.id ? parseInt(params.id, 10) : selectedProduct?.id || 1;
  const product = products.find((p) => p.id === productId) || selectedProduct || ARTISAN_PRODUCTS[0];

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'fairtrade'>('story');

  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image || product.img || ''];

  const [selectedImage, setSelectedImage] = useState(gallery[0] || product.image || product.img);

  const isWishlisted = wishlist.includes(product.id);
  const originalPrice = product.originalPrice || product.original;
  const reviewsCount = product.reviewsCount ?? product.reviews ?? 0;

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.id % 2 === product.id % 2))
    .slice(0, 4);

  return (
    <View style={styles.screen}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back navigation & Category Breadcrumb */}
        <View style={styles.navRow}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <ArrowLeft size={20} color={COLORS.textPrimary} />
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {product.category || 'Handcrafted Artisan'}
            </Text>
          </View>
        </View>

        {/* Hero Gallery Image */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: selectedImage || gallery[0] }}
            style={styles.mainImage}
          />
          {product.badge && (
            <View style={styles.badgePill}>
              <Sparkles size={12} color="#FFFDF9" />
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}

          <Pressable
            style={styles.floatingHeart}
            onPress={() => toggleWishlist(product.id)}
            hitSlop={6}
          >
            <Heart
              size={18}
              color={isWishlisted ? COLORS.terracotta : COLORS.textPrimary}
              fill={isWishlisted ? COLORS.terracotta : 'transparent'}
            />
          </Pressable>
        </View>

        {/* Thumbnail Selector */}
        {gallery.length > 1 && (
          <View style={styles.thumbnailRow}>
            {gallery.map((imgUrl, idx) => (
              <Pressable
                key={idx}
                onPress={() => setSelectedImage(imgUrl)}
                style={[
                  styles.thumbnailWrapper,
                  selectedImage === imgUrl && styles.thumbnailActive,
                ]}
              >
                <Image source={{ uri: imgUrl }} style={styles.thumbnail} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Product Details Header */}
        <View style={styles.detailsCard}>
          {/* Maker & Location Strip */}
          <View style={styles.makerStrip}>
            <View>
              <Text style={styles.makerStudio}>{product.maker}</Text>
              {product.location && (
                <View style={styles.locationRow}>
                  <MapPin size={11} color={COLORS.textSecondary} />
                  <Text style={styles.locationText}>{product.location}</Text>
                </View>
              )}
            </View>

            <View style={styles.verifiedTag}>
              <ShieldCheck size={13} color={COLORS.primary} />
              <Text style={styles.verifiedText}>Verified Master</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{product.name}</Text>

          {/* Rating & In-Stock */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <Star size={14} color={COLORS.gold} fill={COLORS.gold} />
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsText}>({reviewsCount} artisan reviews)</Text>
            </View>

            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>
                {product.inStock ? `${product.inStock} in stock` : 'Small Batch'}
              </Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            {originalPrice && (
              <Text style={styles.originalPrice}>${originalPrice}</Text>
            )}
            <Text style={styles.priceSub}>• Direct-to-Artisan Fair Trade</Text>
          </View>

          {/* Material & Technique specs */}
          <View style={styles.craftSpecs}>
            <View style={styles.craftSpecItem}>
              <Text style={styles.craftSpecLabel}>Material</Text>
              <Text style={styles.craftSpecValue}>{product.material}</Text>
            </View>
            {product.technique && (
              <View style={styles.craftSpecItem}>
                <Text style={styles.craftSpecLabel}>Technique</Text>
                <Text style={styles.craftSpecValue}>{product.technique}</Text>
              </View>
            )}
          </View>

          {/* Action Bar: Quantity Stepper + Add to Cart */}
          <View style={styles.actionSection}>
            <View style={styles.quantityStepper}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </Pressable>
              <Text style={styles.stepperQty}>{quantity}</Text>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.addToCartBtn}
              onPress={() => addToCart(product, quantity)}
            >
              <ShoppingBag size={18} color="#FFFDF9" />
              <Text style={styles.addToCartText}>
                Add to Cart • ${(product.price * quantity).toFixed(2)}
              </Text>
            </Pressable>
          </View>

          {/* Guarantees */}
          <View style={styles.guaranteeStrip}>
            <View style={styles.guaranteeItem}>
              <Truck size={14} color={COLORS.primary} />
              <Text style={styles.guaranteeText}>
                {product.leadTime || 'Ships within 48h'}
              </Text>
            </View>
            <View style={styles.guaranteeItem}>
              <ShieldCheck size={14} color={COLORS.primary} />
              <Text style={styles.guaranteeText}>85% Direct to Maker</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <Leaf size={14} color={COLORS.primary} />
              <Text style={styles.guaranteeText}>Plastic-free Packaging</Text>
            </View>
          </View>
        </View>

        {/* Tabbed Craft Knowledge Section */}
        <View style={styles.tabSection}>
          <View style={styles.tabHeaders}>
            <Pressable
              style={[styles.tabHeader, activeTab === 'story' && styles.tabHeaderActive]}
              onPress={() => setActiveTab('story')}
            >
              <Text style={[styles.tabHeaderText, activeTab === 'story' && styles.tabHeaderTextActive]}>
                Heritage Story
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabHeader, activeTab === 'specs' && styles.tabHeaderActive]}
              onPress={() => setActiveTab('specs')}
            >
              <Text style={[styles.tabHeaderText, activeTab === 'specs' && styles.tabHeaderTextActive]}>
                Dimensions & Care
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabHeader, activeTab === 'fairtrade' && styles.tabHeaderActive]}
              onPress={() => setActiveTab('fairtrade')}
            >
              <Text style={[styles.tabHeaderText, activeTab === 'fairtrade' && styles.tabHeaderTextActive]}>
                Fair Trade
              </Text>
            </Pressable>
          </View>

          <View style={styles.tabBody}>
            {activeTab === 'story' && (
              <View style={styles.storyContent}>
                <Text style={styles.storyHeading}>The Heritage Behind This Piece</Text>
                <Text style={styles.storyText}>
                  {product.story || product.description}
                </Text>
                <View style={styles.craftsmanshipNote}>
                  <Text style={styles.noteTitle}>AUTHENTIC CRAFTSMANSHIP NOTE</Text>
                  <Text style={styles.noteBody}>
                    Because this item is shaped and finished by hand without industrial molds or synthetic coatings, subtle natural variations in tone and texture celebrate its authentic uniqueness.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'specs' && (
              <View style={styles.specsContent}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Dimensions</Text>
                  <Text style={styles.specVal}>{product.dimensions || 'Handmade custom dimensions'}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Weight</Text>
                  <Text style={styles.specVal}>{product.weight || 'Approx. 650 g'}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Care Instructions</Text>
                  <Text style={styles.specVal}>Gentle hand wash / dry cloth wipe. Avoid harsh synthetic chemicals.</Text>
                </View>
              </View>
            )}

            {activeTab === 'fairtrade' && (
              <View style={styles.fairtradeContent}>
                <Text style={styles.fairtradeHeading}>Direct-to-Artisan Transparency</Text>
                <Text style={styles.fairtradeText}>
                  KlaSetu operates on radical revenue transparency. For every purchase of this product, ${(product.price * 0.85).toFixed(2)} is transferred directly to {product.maker} without intermediary cuts.
                </Text>
                <View style={styles.fairtradeCard}>
                  <CheckCircle2 size={16} color={COLORS.primary} />
                  <Text style={styles.fairtradeCardText}>
                    Direct payments deposited directly into the artisan cluster's verified banking account.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Related Creations */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>More Handcrafted Creations</Text>
          <View style={styles.relatedGrid}>
            {relatedProducts.map((p) => (
              <View key={p.id} style={styles.relatedItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  categoryBadge: {
    backgroundColor: COLORS.accentBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.terracotta,
  },
  imageCard: {
    marginHorizontal: 16,
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgePill: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#FFFDF9',
    fontSize: 11,
    fontWeight: '800',
  },
  floatingHeart: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 253, 249, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  thumbnailRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 12,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: COLORS.primary,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  makerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  makerStudio: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  reviewsText: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
  },
  stockBadge: {
    backgroundColor: COLORS.accentBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    paddingVertical: 4,
  },
  price: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  priceSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  craftSpecs: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  craftSpecItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  craftSpecLabel: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  craftSpecValue: {
    fontSize: 11.5,
    color: COLORS.textPrimary,
    fontWeight: '700',
    maxWidth: '65%',
    textAlign: 'right',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 6,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  stepperQty: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 14,
  },
  addToCartText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  guaranteeStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    gap: 6,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guaranteeText: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tabSection: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tabHeaders: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabHeader: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabHeaderActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: COLORS.primary,
  },
  tabHeaderText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabHeaderTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  tabBody: {
    padding: 16,
  },
  storyContent: {
    gap: 10,
  },
  storyHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  storyText: {
    fontSize: 12.5,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
  craftsmanshipNote: {
    backgroundColor: COLORS.accentBg,
    padding: 12,
    borderRadius: 14,
    marginTop: 6,
  },
  noteTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  noteBody: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  specsContent: {
    gap: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
  },
  specLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  specVal: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  fairtradeContent: {
    gap: 8,
  },
  fairtradeHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  fairtradeText: {
    fontSize: 12.5,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
  fairtradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.lightGreen,
    padding: 12,
    borderRadius: 14,
    marginTop: 6,
  },
  fairtradeCardText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.primaryDark,
    flex: 1,
  },
  relatedSection: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relatedItem: {
    width: '48.5%',
  },
});
