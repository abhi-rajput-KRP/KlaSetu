import React, { useState, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowUpDown,
  Compass,
  Filter,
  Layers,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../constants/theme';
import { useShop } from '../context/ShopContext';
import { CRAFT_CATEGORIES } from '../data/productsData';

type SortOption = 'featured' | 'priceLow' | 'priceHigh' | 'rating' | 'reviews';

export default function ProductsScreen() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useShop();

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceMax, setPriceMax] = useState(200);
  const [minRating, setMinRating] = useState(0);

  // Filter & Sort Products
  const filtered = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'All Crafts') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.maker.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q))
      );
    }

    // Max Price
    list = list.filter((p) => p.price <= priceMax);

    // Min Rating
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // Sort
    if (sortBy === 'priceLow') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, priceMax, minRating, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All Crafts');
    setSearchQuery('');
    setPriceMax(200);
    setMinRating(0);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All Crafts' || searchQuery.trim() !== '' || priceMax < 200 || minRating > 0;

  return (
    <View style={styles.screen}>
      <AppHeader />

      {/* Top Search & Filter Control Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchContainer}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pottery, handloom, woodwork, brass..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={15} color={COLORS.textSecondary} />
            </Pressable>
          )}
        </View>

        <Pressable
          style={[styles.filterToggleBtn, (isFilterOpen || hasActiveFilters) && styles.filterToggleBtnActive]}
          onPress={() => setIsFilterOpen((v) => !v)}
        >
          <SlidersHorizontal
            size={16}
            color={isFilterOpen || hasActiveFilters ? '#FFFDF9' : COLORS.textPrimary}
          />
        </Pressable>

        <Pressable
          style={[styles.sortBtn, showSortMenu && styles.sortBtnActive]}
          onPress={() => setShowSortMenu((v) => !v)}
        >
          <ArrowUpDown
            size={16}
            color={showSortMenu ? '#FFFDF9' : COLORS.textPrimary}
          />
        </Pressable>
      </View>

      {/* Collapsible Filter Panel */}
      {isFilterOpen && (
        <View style={styles.filterDrawer}>
          <View style={styles.filterDrawerHeader}>
            <Text style={styles.filterDrawerTitle}>Marketplace Filters</Text>
            {hasActiveFilters && (
              <Pressable style={styles.resetPill} onPress={resetFilters}>
                <RotateCcw size={12} color="#B91C1C" />
                <Text style={styles.resetPillText}>Reset All</Text>
              </Pressable>
            )}
          </View>

          {/* Max Price Filter */}
          <View style={styles.filterGroup}>
            <View style={styles.filterLabelRow}>
              <Text style={styles.filterLabel}>Max Price:</Text>
              <Text style={styles.filterLabelVal}>${priceMax} USD</Text>
            </View>
            <View style={styles.pricePillsRow}>
              {[50, 75, 100, 150, 200].map((val) => (
                <Pressable
                  key={val}
                  style={[styles.pricePill, priceMax === val && styles.pricePillActive]}
                  onPress={() => setPriceMax(val)}
                >
                  <Text style={[styles.pricePillText, priceMax === val && styles.pricePillTextActive]}>
                    ${val}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Minimum Rating Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Minimum Rating</Text>
            <View style={styles.ratingPillsRow}>
              {[0, 4.5, 4.8, 5.0].map((r) => (
                <Pressable
                  key={r}
                  style={[styles.ratingPill, minRating === r && styles.ratingPillActive]}
                  onPress={() => setMinRating(r)}
                >
                  <Text style={[styles.ratingPillText, minRating === r && styles.ratingPillTextActive]}>
                    {r === 0 ? 'Any' : `★ ${r}+`}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Sort Dropdown Menu */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          <Text style={styles.sortMenuTitle}>Sort Products By:</Text>
          <View style={styles.sortOptions}>
            {[
              { id: 'featured', label: 'Featured / Curated' },
              { id: 'priceLow', label: 'Price: Low to High' },
              { id: 'priceHigh', label: 'Price: High to Low' },
              { id: 'rating', label: 'Highest Rated (★)' },
              { id: 'reviews', label: 'Most Reviews' },
            ].map((opt) => (
              <Pressable
                key={opt.id}
                style={[styles.sortOption, sortBy === opt.id && styles.sortOptionActive]}
                onPress={() => {
                  setSortBy(opt.id as SortOption);
                  setShowSortMenu(false);
                }}
              >
                <Text style={[styles.sortOptionText, sortBy === opt.id && styles.sortOptionTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Horizontal Category Filters */}
      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPills}
        >
          {CRAFT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Product Results Header */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsCount}>
          Showing <Text style={styles.resultsCountBold}>{filtered.length}</Text> handcrafted products
        </Text>
        {hasActiveFilters && (
          <Pressable onPress={resetFilters} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear filters</Text>
          </Pressable>
        )}
      </View>

      {/* Product Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filtered.length > 0 ? (
          <View style={styles.grid}>
            {filtered.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Layers size={40} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No artisanal crafts found</Text>
            <Text style={styles.emptySub}>
              Try clearing your active filters or searching for different materials.
            </Text>
            <Pressable style={styles.resetFullBtn} onPress={resetFilters}>
              <RotateCcw size={14} color="#FFFDF9" />
              <Text style={styles.resetFullBtnText}>Reset Filters</Text>
            </Pressable>
          </View>
        )}
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
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: COLORS.surface,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F5EF',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  filterToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F5EF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterToggleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F5EF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterDrawer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterDrawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterDrawerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  resetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FBEBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  resetPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B91C1C',
  },
  filterGroup: {
    gap: 6,
  },
  filterLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  filterLabelVal: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  pricePillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pricePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8F5EF',
  },
  pricePillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pricePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  pricePillTextActive: {
    color: '#FFFDF9',
  },
  ratingPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  ratingPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8F5EF',
  },
  ratingPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ratingPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  ratingPillTextActive: {
    color: '#FFFDF9',
  },
  sortMenu: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  sortMenuTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sortOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8F5EF',
  },
  sortOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  sortOptionTextActive: {
    color: '#FFFDF9',
    fontWeight: '700',
  },
  categoryBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
  },
  categoryPills: {
    paddingHorizontal: 16,
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8F5EF',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryPillTextActive: {
    color: '#FFFDF9',
    fontWeight: '700',
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  resultsCountBold: {
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  clearBtn: {
    paddingVertical: 2,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.terracotta,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
  },
  emptyCard: {
    padding: 36,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
  },
  resetFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 10,
  },
  resetFullBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFDF9',
  },
});
