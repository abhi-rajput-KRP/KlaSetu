import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOWS } from '../constants/theme';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  'All Crafts',
  'Ceramics & Pottery',
  'Handloom Textiles',
  'Woodcraft',
  'Metalcraft & Jewelry',
  'Folk Art & Paintings',
];

export default function HomeScreen({ onSelectProduct, onExploreCategory, onOpenStudio }) {
  const {
    products,
    loadingProducts,
    fetchProducts,
    selectedCategory,
    setSelectedCategory,
    isArtisan,
  } = useShop();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const filteredProducts =
    selectedCategory === 'All Crafts'
      ? products
      : products.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0])
        );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
    >
      {/* Warm Linen Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.badgeRow}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={12} color={COLORS.terracotta} />
            <Text style={styles.heroBadgeText}>HERITAGE PRESERVATION</Text>
          </View>
        </View>

        <Text style={styles.heroHeading}>
          Handcrafted Heirloom Treasures
        </Text>
        <Text style={styles.heroSub}>
          Curated directly from verified master ateliers across rural India. Direct fair-trade provenance.
        </Text>

        <View style={styles.heroMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>100%</Text>
            <Text style={styles.metricLabel}>Fair Trade</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>GI Tag</Text>
            <Text style={styles.metricLabel}>Certified</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>85%</Text>
            <Text style={styles.metricLabel}>To Artisans</Text>
          </View>
        </View>
      </View>

      {/* Artisan Studio Callout Banner if user is Artisan */}
      {isArtisan && (
        <TouchableOpacity
          style={styles.artisanAlertCard}
          onPress={onOpenStudio}
          activeOpacity={0.88}
        >
          <View style={styles.artisanAlertIcon}>
            <Ionicons name="color-palette" size={20} color={COLORS.surface} />
          </View>
          <View style={styles.artisanAlertContent}>
            <Text style={styles.artisanAlertTitle}>Your Artisan Studio is Active</Text>
            <Text style={styles.artisanAlertSub}>
              Manage inventory, review live sales, or use AI to publish new crafts.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {/* Category Scroll Chips */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore Disciplines</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isActive && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Featured Products Section */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Curated Masterpieces</Text>
          <Text style={styles.sectionSubtitle}>
            {filteredProducts.length} pieces available from master makers
          </Text>
        </View>
      </View>

      {loadingProducts ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Connecting to Master Ateliers...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="file-tray-outline" size={42} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No Crafts in this Discipline Yet</Text>
          <Text style={styles.emptySub}>
            Try selecting "All Crafts" or check back shortly.
          </Text>
        </View>
      ) : (
        <View style={styles.productsGrid}>
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onPress={onSelectProduct}
            />
          ))}
        </View>
      )}

      {/* Provenance Story Box */}
      <View style={styles.storyCard}>
        <View style={styles.storyHeader}>
          <Ionicons name="ribbon" size={20} color={COLORS.terracotta} />
          <Text style={styles.storyTag}>THE KLACETU COMMITMENT</Text>
        </View>
        <Text style={styles.storyTitle}>
          Preserving Generational Heritage
        </Text>
        <Text style={styles.storyDesc}>
          By removing predatory middlemen, KlaSetu ensures 85% of each sale flows directly into artisan bank accounts. Each piece comes with a certificate of provenance detailing the master maker, location, and GI Tag credentials.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  heroBanner: {
    backgroundColor: COLORS.linen,
    borderRadius: RADII.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 253, 249, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
  },
  heroBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 0.8,
  },
  heroHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  heroMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 36, 32, 0.08)',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  artisanAlertCard: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(60, 110, 71, 0.25)',
    borderRadius: RADII.card,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  artisanAlertIcon: {
    width: 36,
    height: 36,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artisanAlertContent: {
    flex: 1,
  },
  artisanAlertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 2,
  },
  artisanAlertSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 18,
  },
  categoryChip: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADII.pill,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  loaderBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loaderText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  productsGrid: {
    marginBottom: 20,
  },
  storyCard: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.card,
    padding: 20,
    marginTop: 10,
    ...SHADOWS.card,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  storyTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 0.8,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  storyDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
