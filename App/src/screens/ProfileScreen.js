import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOWS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

export default function ProfileScreen({
  onOpenStudio,
  onOpenPostProduct,
  onOpenLogin,
  onOpenRegister,
}) {
  const { user, isArtisan, logout, orders, login } = useShop();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleDemoLogin = async (role) => {
    try {
      if (role === 'artisan') {
        await login('artisan@klasetu.art', 'artisan123');
      } else {
        await login('buyer@klasetu.art', 'buyer123');
      }
    } catch (e) {
      // Ignored
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>
            {(user?.name || user?.email || 'G').charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.userName}>
          {user?.name || (user ? user.email : 'Conscious Collector')}
        </Text>
        <Text style={styles.userEmail}>
          {user?.email || 'Sign in to access your order history & artisan perks'}
        </Text>

        {user ? (
          <View
            style={[
              styles.roleBadge,
              isArtisan ? styles.roleBadgeArtisan : styles.roleBadgeBuyer,
            ]}
          >
            <Ionicons
              name={isArtisan ? 'color-palette' : 'sparkles'}
              size={12}
              color={isArtisan ? COLORS.surface : COLORS.terracotta}
            />
            <Text
              style={[
                styles.roleBadgeText,
                isArtisan && { color: COLORS.surface },
              ]}
            >
              {isArtisan ? 'MASTER ARTISAN' : 'PATRON / BUYER'}
            </Text>
          </View>
        ) : (
          <View style={styles.authRow}>
            <TouchableOpacity style={styles.loginBtn} onPress={onOpenLogin}>
              <Text style={styles.loginBtnText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerBtn} onPress={onOpenRegister}>
              <Text style={styles.registerBtnText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Artisan Studio Access Banner (Only for Artisans!) */}
      {isArtisan && (
        <View style={styles.artisanStudioCard}>
          <View style={styles.studioHeader}>
            <View style={styles.studioIconBox}>
              <Ionicons name="hammer" size={20} color={COLORS.surface} />
            </View>
            <View style={styles.studioMeta}>
              <Text style={styles.studioTitle}>Artisan Studio Management</Text>
              <Text style={styles.studioSub}>
                Authorized Master Craftsperson Portal
              </Text>
            </View>
          </View>

          <View style={styles.studioActions}>
            <TouchableOpacity
              style={styles.studioPrimaryBtn}
              onPress={onOpenStudio}
              activeOpacity={0.88}
            >
              <Ionicons name="grid-outline" size={16} color={COLORS.surface} />
              <Text style={styles.studioPrimaryBtnText}>Open Atelier Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.studioSecondaryBtn}
              onPress={onOpenPostProduct}
              activeOpacity={0.88}
            >
              <Ionicons name="sparkles" size={16} color={COLORS.primary} />
              <Text style={styles.studioSecondaryBtnText}>
                List Craft with AI Pipeline
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Demo Account Switcher */}
      <View style={styles.demoSwitcherCard}>
        <Text style={styles.demoTitle}>One-Tap Switch (Demo Mode)</Text>
        <Text style={styles.demoSub}>
          Test artisan studio features or buyer checkout flow:
        </Text>
        <View style={styles.demoButtonsRow}>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleDemoLogin('artisan')}
          >
            <Ionicons name="color-palette" size={14} color={COLORS.primary} />
            <Text style={styles.demoBtnText}>Artisan Demo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleDemoLogin('buyer')}
          >
            <Ionicons name="person" size={14} color={COLORS.terracotta} />
            <Text style={styles.demoBtnText}>Buyer Demo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Past Orders History */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order History & Provenance</Text>
          <Text style={styles.ordersCount}>{orders.length} orders</Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyOrders}>
            <Ionicons name="receipt-outline" size={36} color={COLORS.textMuted} />
            <Text style={styles.emptyOrdersText}>No past orders yet</Text>
            <Text style={styles.emptyOrdersSub}>
              Your placed orders and tracking details will appear here.
            </Text>
          </View>
        ) : (
          orders.map((ord) => (
            <View key={ord.id} style={styles.orderCard}>
              <View style={styles.orderTopRow}>
                <View>
                  <Text style={styles.orderId}>Order #{ord.id}</Text>
                  <Text style={styles.orderDate}>
                    {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Recent'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    ord.status === 'Delivered'
                      ? styles.statusPillDelivered
                      : styles.statusPillProcessing,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      ord.status === 'Delivered'
                        ? styles.statusPillTextDelivered
                        : styles.statusPillTextProcessing,
                    ]}
                  >
                    {ord.status || 'Processing'}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDivider} />

              <View style={styles.orderBottomRow}>
                <Text style={styles.orderItemsCount}>
                  {ord.items?.length || 1} craft piece(s)
                </Text>
                <Text style={styles.orderTotal}>₹{ord.total_amount || ord.subtotal || 0}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Sign Out Button */}
      {user && (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
          <Text style={styles.logoutBtnText}>Sign Out of KlaSetu</Text>
        </TouchableOpacity>
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
  profileCard: {
    backgroundColor: COLORS.linen,
    borderRadius: RADII.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.surface,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADII.pill,
  },
  roleBadgeArtisan: {
    backgroundColor: COLORS.primary,
  },
  roleBadgeBuyer: {
    backgroundColor: 'rgba(255, 253, 249, 0.9)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.terracotta,
  },
  authRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADII.pill,
  },
  loginBtnText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  registerBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADII.pill,
  },
  registerBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  artisanStudioCard: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(60, 110, 71, 0.3)',
    borderRadius: RADII.xl,
    padding: 18,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  studioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  studioIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studioMeta: {
    flex: 1,
  },
  studioTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  studioSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  studioActions: {
    gap: 10,
  },
  studioPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: RADII.pill,
    ...SHADOWS.button,
  },
  studioPrimaryBtnText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  studioSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADII.pill,
  },
  studioSecondaryBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  demoSwitcherCard: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.card,
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  demoSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.linen,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    borderRadius: RADII.pill,
  },
  demoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ordersCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyOrders: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.card,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyOrdersText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptyOrdersSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  statusPillProcessing: {
    backgroundColor: COLORS.linen,
  },
  statusPillDelivered: {
    backgroundColor: COLORS.primaryLight,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusPillTextProcessing: {
    color: COLORS.terracotta,
  },
  statusPillTextDelivered: {
    color: COLORS.primaryDark,
  },
  orderDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  orderBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemsCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.danger,
    marginTop: 10,
  },
  logoutBtnText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});
