import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  Award,
  CheckCircle2,
  Heart,
  LogOut,
  MapPin,
  Package,
  PlusCircle,
  Truck,
} from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

export default function ProfileScreen() {
  const { products, wishlist } = useShop();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses'>('orders');

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <View style={styles.screen}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Patron Profile Banner */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.profileDetails}>
              <View style={styles.patronBadgeRow}>
                <Text style={styles.profileName}>Helene Engels</Text>
                <View style={styles.patronBadge}>
                  <Text style={styles.patronBadgeText}>Artisan Patron</Text>
                </View>
              </View>
              <Text style={styles.profileEmail}>helene.engels@example.com • Member since 2024</Text>
              <View style={styles.impactRow}>
                <Award size={14} color={COLORS.primary} />
                <Text style={styles.impactText}>3 Rural Artisan Families Supported</Text>
              </View>
            </View>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.profileActions}>
            <Pressable
              style={styles.studioBtn}
              onPress={() => router.push('/add-product')}
            >
              <PlusCircle size={15} color="#FFFDF9" />
              <Text style={styles.studioBtnText}>Artisan Studio</Text>
            </Pressable>

            <Pressable
              style={styles.signOutBtn}
              onPress={() => router.push('/login')}
            >
              <LogOut size={15} color={COLORS.textPrimary} />
              <Text style={styles.signOutBtnText}>Sign In / Switch</Text>
            </Pressable>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabItem, activeTab === 'orders' && styles.tabItemActive]}
            onPress={() => setActiveTab('orders')}
          >
            <Package
              size={16}
              color={activeTab === 'orders' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'orders' && styles.tabItemTextActive,
              ]}
            >
              Orders (2)
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, activeTab === 'wishlist' && styles.tabItemActive]}
            onPress={() => setActiveTab('wishlist')}
          >
            <Heart
              size={16}
              color={activeTab === 'wishlist' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'wishlist' && styles.tabItemTextActive,
              ]}
            >
              Saved ({wishlist.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, activeTab === 'addresses' && styles.tabItemActive]}
            onPress={() => setActiveTab('addresses')}
          >
            <MapPin
              size={16}
              color={activeTab === 'addresses' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'addresses' && styles.tabItemTextActive,
              ]}
            >
              Addresses
            </Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <View style={styles.tabContent}>
            {/* Order 1 */}
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>Order #KS-89421</Text>
                  <Text style={styles.orderDate}>Placed on September 2, 2026</Text>
                </View>
                <View style={styles.statusPillTransit}>
                  <Truck size={12} color={COLORS.primary} />
                  <Text style={styles.statusTransitText}>In Transit</Text>
                </View>
              </View>

              <View style={styles.orderItemRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1600369672770-985baa0e2c07?auto=format&fit=crop&w=200&q=80',
                  }}
                  style={styles.orderItemThumb}
                />
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>
                    Hand-Loomed Merino & Raw Silk Throw Blanket
                  </Text>
                  <Text style={styles.orderItemMaker}>
                    Maker: Devi Weavers Guild • Kullu Valley
                  </Text>
                  <Text style={styles.orderItemTracking}>
                    Artisan Tracking: #INDPOST-772910
                  </Text>
                </View>
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotalLabel}>Total Paid:</Text>
                <Text style={styles.orderTotalValue}>$110.00</Text>
              </View>
            </View>

            {/* Order 2 */}
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>Order #KS-74102</Text>
                  <Text style={styles.orderDate}>Delivered on August 18, 2026</Text>
                </View>
                <View style={styles.statusPillDelivered}>
                  <CheckCircle2 size={12} color="#1E40AF" />
                  <Text style={styles.statusDeliveredText}>Delivered</Text>
                </View>
              </View>

              <View style={styles.orderItemRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=200&q=80',
                  }}
                  style={styles.orderItemThumb}
                />
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>
                    Hand-Thrown Stoneware Pitcher with Ash Glaze
                  </Text>
                  <Text style={styles.orderItemMaker}>
                    Maker: Rajesh Kumar & Kiln Collective • Khurja
                  </Text>
                  <Text style={styles.orderItemTracking}>
                    Delivered to Brooklyn, NY
                  </Text>
                </View>
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotalLabel}>Total Paid:</Text>
                <Text style={styles.orderTotalValue}>$48.00</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'wishlist' && (
          <View style={styles.tabContent}>
            {wishlistedProducts.length > 0 ? (
              <View style={styles.wishlistGrid}>
                {wishlistedProducts.map((p) => (
                  <View key={p.id} style={styles.wishlistItem}>
                    <ProductCard product={p} />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyWishlist}>
                <Heart size={40} color={COLORS.textSecondary} />
                <Text style={styles.emptyWishlistTitle}>No saved crafts yet</Text>
                <Text style={styles.emptyWishlistSub}>
                  Tap the heart icon on any craft to save it to your collection.
                </Text>
                <Pressable
                  style={styles.browseBtn}
                  onPress={() => router.push('/products')}
                >
                  <Text style={styles.browseBtnText}>Explore Crafts</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {activeTab === 'addresses' && (
          <View style={styles.tabContent}>
            <View style={styles.addressCardActive}>
              <View style={styles.addressTopRow}>
                <Text style={styles.addressType}>Home Residence</Text>
                <View style={styles.defaultPill}>
                  <Text style={styles.defaultPillText}>Default</Text>
                </View>
              </View>
              <Text style={styles.addressBody}>
                Helene Engels{'\n'}
                24 Craftsperson Way, Apt 4B{'\n'}
                Brooklyn, NY 11201, United States{'\n'}
                Phone: +1 (555) 234-5678
              </Text>
            </View>

            <View style={styles.addressCard}>
              <Text style={styles.addressType}>Studio / Gallery Delivery</Text>
              <Text style={styles.addressBody}>
                Helene Engels Gallery{'\n'}
                88 Mercer Street, Floor 2{'\n'}
                SoHo, New York, NY 10012, United States
              </Text>
            </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
    elevation: 2,
  },
  profileTopRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileDetails: {
    flex: 1,
    gap: 3,
  },
  patronBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  patronBadge: {
    backgroundColor: COLORS.accentBg,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  patronBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  profileEmail: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  studioBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 999,
  },
  studioBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  signOutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    borderRadius: 999,
  },
  signOutBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabItemActive: {
    backgroundColor: COLORS.lightGreen,
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabItemTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  tabContent: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  orderNumber: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  statusPillTransit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTransitText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statusPillDelivered: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDeliveredText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E40AF',
  },
  orderItemRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  orderItemThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.accentBg,
  },
  orderItemInfo: {
    flex: 1,
    gap: 2,
  },
  orderItemName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  orderItemMaker: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  orderItemTracking: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  orderTotalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  orderTotalValue: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
  },
  wishlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wishlistItem: {
    width: '48.5%',
  },
  emptyWishlist: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    gap: 8,
  },
  emptyWishlistTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptyWishlistSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 6,
  },
  browseBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  addressCardActive: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 8,
  },
  addressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  defaultPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  addressBody: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  addressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
});
