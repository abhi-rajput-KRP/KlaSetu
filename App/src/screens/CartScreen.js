import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOWS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

const FREE_SHIPPING_THRESHOLD = 1000;

export default function CartScreen({ onExplore, onOpenOrders }) {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartTax,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    resolveImageUrl,
    user,
  } = useShop();

  // Checkout shipping fields
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState('74, Heritage Colony, Civil Lines');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const shippingFee = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : 99;
  const grandTotal = cartTotal + shippingFee;
  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);

    const orderPayload = {
      user_id: user?.id || 1,
      items: cart.map((ci) => ({
        product_id: ci.product.id,
        product_name: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        artisan_name: ci.product.artisan_name || 'Master Artisan',
      })),
      subtotal: cartSubtotal,
      tax: cartTax,
      shipping: shippingFee,
      total_amount: grandTotal,
      shipping_address: `${name}, ${address}, ${city} - ${pincode}, Phone: ${phone}`,
      status: 'Processing',
    };

    try {
      const order = await placeOrder(orderPayload);
      setConfirmedOrder(order);
    } catch (e) {
      // Handled in context
    } finally {
      setSubmitting(false);
    }
  };

  if (cartCount === 0 && !confirmedOrder) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="bag-handle-outline" size={48} color={COLORS.terracotta} />
        </View>
        <Text style={styles.emptyHeadline}>Your Craft Bag is Empty</Text>
        <Text style={styles.emptySubtext}>
          Discover extraordinary heirlooms shaped with ancestral soul. Support India's generational makers.
        </Text>
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={onExplore}
          activeOpacity={0.88}
        >
          <Text style={styles.exploreBtnText}>Explore Masterpieces</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.surface} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Free Shipping Progress Card */}
        <View style={styles.shippingBarCard}>
          <View style={styles.shippingHeader}>
            <Ionicons name="boat-outline" size={18} color={COLORS.primary} />
            <Text style={styles.shippingTitle}>
              {cartSubtotal >= FREE_SHIPPING_THRESHOLD
                ? '🎉 You unlocked Complimentary Fair-Trade Shipping!'
                : `Add ₹${FREE_SHIPPING_THRESHOLD - cartSubtotal} more for Free Shipping`}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${freeShippingProgress}%` }]} />
          </View>
        </View>

        {/* Cart Items List */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionHeading}>
            Craft Items ({cartCount})
          </Text>

          {cart.map((ci) => {
            const imgUrl = resolveImageUrl(ci.product.image_url || ci.product.image);
            const itemTotal = (ci.product.price || 0) * ci.quantity;

            return (
              <View key={ci.product.id} style={styles.cartItemCard}>
                <Image source={{ uri: imgUrl }} style={styles.itemImage} />

                <View style={styles.itemDetails}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {ci.product.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeFromCart(ci.product.id)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemArtisan}>
                    By {ci.product.artisan_name || 'Master Artisan'}
                  </Text>

                  <View style={styles.itemBottomRow}>
                    {/* Stepper */}
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(ci.product.id, -1)}
                      >
                        <Ionicons name="remove" size={14} color={COLORS.textPrimary} />
                      </TouchableOpacity>
                      <Text style={styles.stepNum}>{ci.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(ci.product.id, 1)}
                      >
                        <Ionicons name="add" size={14} color={COLORS.textPrimary} />
                      </TouchableOpacity>
                    </View>

                    {/* Price */}
                    <Text style={styles.itemTotalPrice}>₹{itemTotal}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Shipping Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="location-outline" size={18} color={COLORS.terracotta} />
            <Text style={styles.sectionHeading}>Delivery Address</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Recipient Full Name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Street Address, House No."
            placeholderTextColor={COLORS.textMuted}
            value={address}
            onChangeText={setAddress}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="City"
              placeholderTextColor={COLORS.textMuted}
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Pincode"
              placeholderTextColor={COLORS.textMuted}
              value={pincode}
              onChangeText={setPincode}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={COLORS.textMuted}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Bill Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>Fair-Trade Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Craft Subtotal</Text>
            <Text style={styles.summaryValue}>₹{cartSubtotal}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Handicraft GST (5%)</Text>
            <Text style={styles.summaryValue}>₹{cartTax}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping (Insured)</Text>
            <Text style={[styles.summaryValue, shippingFee === 0 && { color: COLORS.success }]}>
              {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalAmount}>₹{grandTotal}</Text>
          </View>

          {/* Place Order CTA */}
          <TouchableOpacity
            style={[styles.checkoutBtn, submitting && { opacity: 0.7 }]}
            onPress={handleCheckout}
            disabled={submitting}
            activeOpacity={0.88}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <>
                <Ionicons name="lock-closed" size={16} color={COLORS.surface} />
                <Text style={styles.checkoutBtnText}>
                  Complete Fair-Trade Order (₹{grandTotal})
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Order Confirmation Modal */}
      {confirmedOrder && (
        <Modal transparent animationType="fade" visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalCheckIcon}>
                <Ionicons name="checkmark-circle" size={56} color={COLORS.primary} />
              </View>

              <Text style={styles.modalTitle}>Order Confirmed!</Text>
              <Text style={styles.modalSubtitle}>
                Order #{confirmedOrder.id} has been recorded with our master artisans.
              </Text>

              <View style={styles.modalInfoBox}>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Total Paid:</Text>
                  <Text style={styles.modalInfoVal}>₹{confirmedOrder.total_amount || grandTotal}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Status:</Text>
                  <Text style={[styles.modalInfoVal, { color: COLORS.primary }]}>
                    {confirmedOrder.status || 'Processing'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setConfirmedOrder(null);
                  if (onOpenOrders) onOpenOrders();
                }}
              >
                <Text style={styles.modalBtnText}>View My Orders</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.linen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyHeadline: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: RADII.pill,
    ...SHADOWS.button,
  },
  exploreBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  shippingBarCard: {
    backgroundColor: COLORS.linen,
    borderRadius: RADII.card,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shippingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  shippingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  itemsSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
    gap: 12,
    ...SHADOWS.card,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  itemArtisan: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  itemTotalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  addressSection: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.card,
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.linen,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    backgroundColor: COLORS.linen,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    ...SHADOWS.card,
  },
  summaryHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: RADII.pill,
    ...SHADOWS.button,
  },
  checkoutBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.cardHover,
  },
  modalCheckIcon: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  modalInfoBox: {
    width: '100%',
    backgroundColor: COLORS.linen,
    padding: 14,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    gap: 8,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalInfoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  modalInfoVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADII.pill,
    alignItems: 'center',
  },
  modalBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
});
