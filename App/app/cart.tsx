import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import { COLORS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const shipping = cartSubtotal > 75 || cartSubtotal === 0 ? 0 : 8;
  const directArtisanShare = (cartSubtotal * 0.85).toFixed(2);
  const finalTotal = Math.max(0, cartSubtotal - discount + shipping);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'ARTISAN10' || couponCode.toUpperCase() === 'KLASETU') {
      const disc = Math.round(cartSubtotal * 0.1);
      setDiscount(disc);
      setAppliedCode(couponCode.toUpperCase());
      Alert.alert('Coupon Applied!', '10% discount applied to your order.');
    } else {
      Alert.alert('Invalid Promo Code', 'Try using code "ARTISAN10" for 10% off.');
    }
  };

  return (
    <View style={styles.screen}>
      <AppHeader />

      {/* Cart Navigation & Header */}
      <View style={styles.headerBar}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ArrowLeft size={20} color={COLORS.textPrimary} />
          <Text style={styles.backBtnText}>Continue Shopping</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Artisan Cart ({cartCount})</Text>
      </View>

      {cart.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Direct Impact Banner */}
          <View style={styles.impactCard}>
            <HeartHandshake size={20} color={COLORS.terracotta} />
            <View style={styles.impactTextWrap}>
              <Text style={styles.impactTitle}>Direct Artisan Impact</Text>
              <Text style={styles.impactSub}>
                <Text style={styles.impactHighlight}>${directArtisanShare}</Text> of your purchase goes directly to rural maker families.
              </Text>
            </View>
          </View>

          {/* Cart Item Cards */}
          <View style={styles.itemList}>
            {cart.map((cartItem) => {
              const item = cartItem.item;
              const imageUrl = item.image || item.img || '';

              return (
                <View key={cartItem.id} style={styles.itemCard}>
                  <Image source={{ uri: imageUrl }} style={styles.itemImage} />

                  <View style={styles.itemInfo}>
                    <View style={styles.itemTopRow}>
                      <Text style={styles.itemMaker} numberOfLines={1}>
                        {item.maker}
                      </Text>
                      <Pressable
                        onPress={() => removeFromCart(cartItem.id)}
                        hitSlop={6}
                      >
                        <Trash2 size={16} color={COLORS.textSecondary} />
                      </Pressable>
                    </View>

                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>

                    <View style={styles.itemBottomRow}>
                      <Text style={styles.itemPrice}>${item.price}</Text>

                      {/* Stepper */}
                      <View style={styles.stepper}>
                        <Pressable
                          style={styles.stepperBtn}
                          onPress={() => updateQuantity(cartItem.id, -1)}
                        >
                          <Minus size={12} color={COLORS.textPrimary} />
                        </Pressable>
                        <Text style={styles.stepperQty}>{cartItem.quantity}</Text>
                        <Pressable
                          style={styles.stepperBtn}
                          onPress={() => updateQuantity(cartItem.id, 1)}
                        >
                          <Plus size={12} color={COLORS.textPrimary} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Coupon Code Section */}
          <View style={styles.couponCard}>
            <View style={styles.couponInputWrap}>
              <Tag size={16} color={COLORS.terracotta} />
              <TextInput
                style={styles.couponInput}
                placeholder="Enter promo code (Try: ARTISAN10)"
                placeholderTextColor={COLORS.textSecondary}
                value={couponCode}
                onChangeText={setCouponCode}
                autoCapitalize="characters"
              />
              <Pressable style={styles.applyBtn} onPress={handleApplyCoupon}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </Pressable>
            </View>
            {appliedCode && (
              <View style={styles.appliedRow}>
                <CheckCircle2 size={14} color={COLORS.primary} />
                <Text style={styles.appliedText}>
                  Code "{appliedCode}" applied (-${discount})
                </Text>
              </View>
            )}
          </View>

          {/* Order Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({cartCount} items)</Text>
              <Text style={styles.summaryVal}>${cartSubtotal.toFixed(2)}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount ({appliedCode})</Text>
                <Text style={[styles.summaryVal, { color: COLORS.primary }]}>
                  -${discount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Artisan Direct Shipping</Text>
              <Text style={styles.summaryVal}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fair-Trade Direct Pledge</Text>
              <Text style={[styles.summaryVal, { color: COLORS.primary }]}>
                85% direct
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalVal}>${finalTotal.toFixed(2)}</Text>
            </View>

            {/* Checkout Button */}
            <Pressable
              style={styles.checkoutBtn}
              onPress={() => setShowCheckoutModal(true)}
            >
              <ShieldCheck size={18} color="#FFFDF9" />
              <Text style={styles.checkoutBtnText}>
                Proceed to Secure Checkout
              </Text>
            </Pressable>

            {/* Free Shipping Progress */}
            {cartSubtotal < 75 && (
              <Text style={styles.freeShippingTip}>
                Add ${(75 - cartSubtotal).toFixed(2)} more for FREE direct shipping!
              </Text>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={52} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Your craft bag is empty</Text>
          <Text style={styles.emptySub}>
            Discover unique handmade pottery, woven textiles, and heirloom brass crafts directly from local masters.
          </Text>
          <Pressable
            style={styles.exploreBtn}
            onPress={() => router.push('/products')}
          >
            <Text style={styles.exploreBtnText}>Explore All Crafts</Text>
            <ArrowRight size={16} color="#FFFDF9" />
          </Pressable>
        </View>
      )}

      {/* Checkout Success Modal */}
      <Modal
        visible={showCheckoutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCheckoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalSuccessIcon}>
              <CheckCircle2 size={36} color="#FFFDF9" />
            </View>
            <Text style={styles.modalTitle}>Order Confirmed!</Text>
            <Text style={styles.modalSub}>
              Thank you for supporting traditional Indian artisans. Your order #KS-{Math.floor(Math.random() * 89999 + 10000)} has been placed directly with the maker guilds.
            </Text>

            <View style={styles.modalImpactBadge}>
              <HeartHandshake size={16} color={COLORS.terracotta} />
              <Text style={styles.modalImpactText}>
                ${directArtisanShare} dispatched directly to artisan bank accounts.
              </Text>
            </View>

            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => {
                setShowCheckoutModal(false);
                router.push('/profile');
              }}
            >
              <Text style={styles.modalCloseBtnText}>View in Order History</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 14,
  },
  impactCard: {
    backgroundColor: COLORS.accentBg,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8DCB8',
  },
  impactTextWrap: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  impactSub: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 17,
  },
  impactHighlight: {
    fontWeight: '800',
    color: COLORS.primary,
  },
  itemList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: COLORS.accentBg,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemMaker: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.terracotta,
    maxWidth: '80%',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 17,
    marginTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 4,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  couponCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  couponInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 999,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  couponInput: {
    flex: 1,
    height: 40,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  applyBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 4,
  },
  appliedText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalVal: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 6,
  },
  checkoutBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  freeShippingTip: {
    fontSize: 11,
    color: COLORS.terracotta,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 8,
  },
  exploreBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  modalSuccessIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalImpactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accentBg,
    padding: 12,
    borderRadius: 14,
    marginVertical: 6,
  },
  modalImpactText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.terracotta,
    flex: 1,
  },
  modalCloseBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 6,
  },
  modalCloseBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
});
