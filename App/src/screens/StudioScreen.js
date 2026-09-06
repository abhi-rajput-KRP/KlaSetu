import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOWS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

export default function StudioScreen({ onOpenPostProduct, onBack }) {
  const {
    isArtisan,
    products,
    updateStock,
    deleteProduct,
    orders,
    updateOrderStatus,
    resolveImageUrl,
    user,
  } = useShop();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders'

  // Access control check
  if (!isArtisan) {
    return (
      <View style={styles.restrictedBox}>
        <Ionicons name="lock-closed" size={48} color={COLORS.terracotta} />
        <Text style={styles.restrictedTitle}>Artisan Studio Restricted</Text>
        <Text style={styles.restrictedSub}>
          Only accounts with the Master Artisan role have access to atelier controls, inventory management, and order fulfillment.
        </Text>
        <TouchableOpacity style={styles.restrictedBtn} onPress={onBack}>
          <Text style={styles.restrictedBtnText}>Back to Marketplace</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Derived metrics
  const myProducts = products; // All products managed by artisan or filtered by name
  const totalStock = myProducts.reduce((sum, p) => sum + (p.in_stock || p.inStock || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || o.subtotal || 0), 0);

  const handleDelete = (id, name) => {
    Alert.alert('Remove Craft', `Are you sure you want to remove "${name}" from your catalog?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteProduct(id) },
    ]);
  };

  const handleNextStatus = (orderId, currentStatus) => {
    let nextStatus = 'Dispatched';
    if (currentStatus === 'Dispatched') nextStatus = 'Delivered';
    if (currentStatus === 'Delivered') nextStatus = 'Processing';
    updateOrderStatus(orderId, nextStatus);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Studio Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.headerBadge}>
            <Ionicons name="shield-checkmark" size={12} color={COLORS.primary} />
            <Text style={styles.headerBadgeText}>VERIFIED MASTER ATELIER</Text>
          </View>
        </View>

        <Text style={styles.storeName}>{user?.store_name || `${user?.name || 'Master'}'s Atelier`}</Text>
        <Text style={styles.storeSub}>
          Traditional Generational Craftsmanship • Direct Fair-Trade
        </Text>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{myProducts.length}</Text>
            <Text style={styles.statLabel}>Active Crafts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{totalStock}</Text>
            <Text style={styles.statLabel}>Total Units</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: COLORS.terracotta }]}>₹{totalRevenue}</Text>
            <Text style={styles.statLabel}>Gross Sales</Text>
          </View>
        </View>
      </View>

      {/* List New Craft CTA */}
      <TouchableOpacity
        style={styles.postNewBtn}
        onPress={onOpenPostProduct}
        activeOpacity={0.88}
      >
        <Ionicons name="sparkles" size={18} color={COLORS.surface} />
        <Text style={styles.postNewBtnText}>List New Craft with AI Pipeline</Text>
      </TouchableOpacity>

      {/* Tab Switcher: Inventory vs Orders */}
      <View style={styles.tabNav}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'inventory' && styles.tabBtnActive]}
          onPress={() => setActiveTab('inventory')}
        >
          <Ionicons
            name="cube-outline"
            size={16}
            color={activeTab === 'inventory' ? COLORS.primary : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'inventory' && styles.tabBtnTextActive,
            ]}
          >
            Inventory ({myProducts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'orders' && styles.tabBtnActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Ionicons
            name="receipt-outline"
            size={16}
            color={activeTab === 'orders' ? COLORS.primary : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'orders' && styles.tabBtnTextActive,
            ]}
          >
            Fulfillment ({orders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB: INVENTORY */}
      {activeTab === 'inventory' && (
        <View style={styles.tabContent}>
          {myProducts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No Crafts Listed Yet</Text>
              <Text style={styles.emptySub}>
                Use our 3-step AI pipeline to photograph and publish your first craft.
              </Text>
            </View>
          ) : (
            myProducts.map((p) => {
              const currentStock = p.in_stock ?? p.inStock ?? 0;
              const imgUrl = resolveImageUrl(p.image_url || p.image);

              return (
                <View key={p.id} style={styles.inventoryCard}>
                  <Image source={{ uri: imgUrl }} style={styles.invImage} />

                  <View style={styles.invInfo}>
                    <Text style={styles.invTitle} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.invPrice}>₹{p.price}</Text>

                    {/* Stock Adjustment Row */}
                    <View style={styles.stockRow}>
                      <Text style={styles.stockLabel}>Stock:</Text>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => updateStock(p.id, Math.max(0, currentStock - 1))}
                        >
                          <Ionicons name="remove" size={12} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.stockCount}>{currentStock}</Text>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => updateStock(p.id, currentStock + 1)}
                        >
                          <Ionicons name="add" size={12} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(p.id, p.name)}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      )}

      {/* TAB: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <View style={styles.tabContent}>
          {orders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No Orders Pending Dispatch</Text>
              <Text style={styles.emptySub}>
                New orders placed by connoisseurs will be sent directly here.
              </Text>
            </View>
          ) : (
            orders.map((ord) => (
              <View key={ord.id} style={styles.orderCard}>
                <View style={styles.orderHead}>
                  <Text style={styles.orderId}>Order #{ord.id}</Text>
                  <Text style={styles.orderAmount}>₹{ord.total_amount || ord.subtotal || 0}</Text>
                </View>

                <Text style={styles.orderAddress} numberOfLines={2}>
                  📍 {ord.shipping_address || 'Customer Delivery Address'}
                </Text>

                <View style={styles.orderActionRow}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>Status: {ord.status || 'Processing'}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.updateStatusBtn}
                    onPress={() => handleNextStatus(ord.id, ord.status || 'Processing')}
                  >
                    <Text style={styles.updateStatusBtnText}>Advance Status →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: COLORS.linen,
    borderRadius: RADII.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  headerTop: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 253, 249, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  headerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  storeSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  postNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: RADII.pill,
    marginBottom: 20,
    ...SHADOWS.button,
  },
  postNewBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  tabNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.linen,
    borderRadius: RADII.pill,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADII.pill,
  },
  tabBtnActive: {
    backgroundColor: COLORS.surfaceCard,
    ...SHADOWS.card,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.primary,
  },
  tabContent: {
    gap: 12,
  },
  inventoryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.card,
  },
  invImage: {
    width: 64,
    height: 64,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  invInfo: {
    flex: 1,
  },
  invTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  invPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.terracotta,
    marginBottom: 4,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
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
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockCount: {
    paddingHorizontal: 8,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  deleteBtn: {
    padding: 8,
  },
  orderCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 8,
    ...SHADOWS.card,
  },
  orderHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  orderAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  orderActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: COLORS.linen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  updateStatusBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADII.pill,
  },
  updateStatusBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  emptyCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.card,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  restrictedBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  restrictedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  restrictedSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  restrictedBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: RADII.pill,
  },
  restrictedBtnText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: '700',
  },
});
