import React, { useState } from 'react';
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
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../constants/theme';
import { useShop } from '../context/ShopContext';
import { CRAFT_CATEGORIES } from '../data/productsData';

export default function ProductsScreen() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useShop();

  const [sortBy, setSortBy] = useState<'featured' | 'priceLow' | 'priceHigh' | 'rating'>('featured');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter products by category and search query
  let filtered = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All Crafts'
        ? true
        : selectedCategory === 'GI Certified'
        ? p.badge?.includes('GI') || p.badge?.includes('Heritage')
        : p.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.maker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort products
  if (sortBy === 'priceLow') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceHigh') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <View style={styles.screen}>
      <AppHeader />

      {/* Search & Filter Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchContainer}>
          <Search size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crafts, pottery, shawls, makers..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={16} color={COLORS.textSecondary} />
            </Pressable>
          )}
        </View>

        <Pressable
          style={[styles.sortBtn, showSortMenu && styles.sortBtnActive]}
          onPress={() => setShowSortMenu((v) => !v)}
        >
          <SlidersHorizontal
            size={18}
            color={showSortMenu ? '#FFFDF9' : COLORS.textPrimary}
          />
        </Pressable>
      </View>

      {/* Sort Dropdown Menu */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          <Text style={styles.sortMenuTitle}>Sort Products By:</Text>
          <View style={styles.sortOptions}>
            <Pressable
              style={[styles.sortOption, sortBy === 'featured' && styles.sortOptionActive]}
              onPress={() => {
                setSortBy('featured');
                setShowSortMenu(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortBy === 'featured' && styles.sortOptionTextActive]}>
                Featured & GI Certified
              </Text>
            </Pressable>
            <Pressable
              style={[styles.sortOption, sortBy === 'priceLow' && styles.sortOptionActive]}
              onPress={() => {
                setSortBy('priceLow');
                setShowSortMenu(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortBy === 'priceLow' && styles.sortOptionTextActive]}>
                Price: Low to High
              </Text>
            </Pressable>
            <Pressable
              style={[styles.sortOption, sortBy === 'priceHigh' && styles.sortOptionActive]}
              onPress={() => {
                setSortBy('priceHigh');
                setShowSortMenu(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortBy === 'priceHigh' && styles.sortOptionTextActive]}>
                Price: High to Low
              </Text>
            </Pressable>
            <Pressable
              style={[styles.sortOption, sortBy === 'rating' && styles.sortOptionActive]}
              onPress={() => {
                setSortBy('rating');
                setShowSortMenu(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortBy === 'rating' && styles.sortOptionTextActive]}>
                Highest Rated
              </Text>
            </Pressable>
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
          Showing <Text style={styles.resultsCountBold}>{filtered.length}</Text> authentic creations
        </Text>
        {(selectedCategory !== 'All Crafts' || searchQuery !== '') && (
          <Pressable
            onPress={() => {
              setSelectedCategory('All Crafts');
              setSearchQuery('');
            }}
          >
            <Text style={styles.resetText}>Clear filters</Text>
          </Pressable>
        )}
      </View>

      {/* Products Grid / Empty State */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filtered.length > 0 ? (
          <View style={styles.grid}>
            {filtered.map((product) => (
              <View key={product.id} style={styles.gridItem}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Compass size={44} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No matching crafts found</Text>
            <Text style={styles.emptySub}>
              Try searching with different keywords or clear your category filter.
            </Text>
            <Pressable
              style={styles.resetBtn}
              onPress={() => {
                setSelectedCategory('All Crafts');
                setSearchQuery('');
              }}
            >
              <Text style={styles.resetBtnText}>Show All Crafts</Text>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
    backgroundColor: COLORS.surface,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  sortBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortMenu: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sortMenuTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortOptionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sortOptionTextActive: {
    color: '#FFFDF9',
  },
  categoryBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  categoryPills: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  categoryPillTextActive: {
    color: '#FFFDF9',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  resultsCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  resultsCountBold: {
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  resetText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.terracotta,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48.5%',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 999,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
});
