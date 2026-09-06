import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII } from '../constants/theme';
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

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

export default function ProductsScreen({ onSelectProduct }) {
  const {
    products,
    loadingProducts,
    fetchProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useShop();

  const [sortBy, setSortBy] = useState('featured');
  const [showSortModal, setShowSortModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  // Filter & Sort
  const processedProducts = products
    .filter((p) => {
      // Category filter
      if (selectedCategory !== 'All Crafts') {
        const catToken = selectedCategory.toLowerCase().split(' ')[0];
        if (!p.category || !p.category.toLowerCase().includes(catToken)) {
          return false;
        }
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (p.name || p.title || '').toLowerCase().includes(q);
        const matchesArtisan = (p.artisan_name || p.artisan || '').toLowerCase().includes(q);
        const matchesCat = (p.category || '').toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesArtisan && !matchesCat && !matchesDesc) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // featured default
    });

  return (
    <View style={styles.container}>
      {/* Search & Sort Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pottery, handlooms, crafts..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Trigger Button */}
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setShowSortModal(!showSortModal)}
        >
          <Ionicons name="filter" size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Sort Selector Dropdown if toggled */}
      {showSortModal && (
        <View style={styles.sortDropdown}>
          <Text style={styles.sortTitle}>Sort Crafts By:</Text>
          <View style={styles.sortGrid}>
            {SORT_OPTIONS.map((opt) => {
              const isSelected = sortBy === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.sortPill, isSelected && styles.sortPillActive]}
                  onPress={() => {
                    setSortBy(opt.id);
                    setShowSortModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sortPillText,
                      isSelected && styles.sortPillTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Category Pills */}
      <View style={styles.categoryPillsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPills}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, isActive && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.catPillText,
                    isActive && styles.catPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            Showing {processedProducts.length} authentic crafts
          </Text>
          {sortBy !== 'featured' && (
            <Text style={styles.sortTag}>
              Sorted by: {SORT_OPTIONS.find((o) => o.id === sortBy)?.label}
            </Text>
          )}
        </View>

        {loadingProducts ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Loading collection...</Text>
          </View>
        ) : processedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No matching crafts found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your search query or discipline filter.
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All Crafts');
                setSortBy('featured');
              }}
            >
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          processedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={onSelectProduct}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.linen,
    borderRadius: RADII.pill,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortDropdown: {
    backgroundColor: COLORS.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  sortGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  sortPillTextActive: {
    color: COLORS.surface,
  },
  categoryPillsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingVertical: 8,
  },
  categoryPills: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  catPillTextActive: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  sortTag: {
    fontSize: 11,
    color: COLORS.terracotta,
    fontWeight: '600',
  },
  loaderBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loaderText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  resetBtn: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primary,
  },
  resetBtnText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },
});
