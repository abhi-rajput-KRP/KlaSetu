import React, { useState, useMemo } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Edit3,
  Globe,
  Layers,
  MapPin,
  Minus,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Trash2,
  TrendingUp,
  Truck,
  User,
  X,
} from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import { COLORS } from '../constants/theme';
import { useShop } from '../context/ShopContext';
import { CRAFT_CATEGORIES } from '../data/productsData';
import { Product, Order, StoreProfile } from '../types/product';

type StudioTab = 'inventory' | 'catalog' | 'orders' | 'store' | 'ai-assist';

export default function StudioScreen() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    adjustStock,
    storeProfile,
    updateStoreProfile,
    orders,
    updateOrderStatus,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<StudioTab>('inventory');

  // Inventory filter state
  const [invSearch, setInvSearch] = useState('');
  const [invCategory, setInvCategory] = useState('All');
  const [invStockFilter, setInvStockFilter] = useState<'all' | 'low' | 'out' | 'healthy'>('all');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockUnits, setRestockUnits] = useState('10');
  const [viewOrderSlip, setViewOrderSlip] = useState<Order | null>(null);

  // Store form state
  const [storeForm, setStoreForm] = useState<StoreProfile>(storeProfile);

  // Product Form state for Add/Edit
  const defaultProductForm: Partial<Product> = {
    name: '',
    category: 'Ceramics & Pottery',
    maker: storeProfile.artisanName || 'Master Artisan',
    location: storeProfile.location || 'Khurja, Uttar Pradesh',
    price: 45,
    originalPrice: 60,
    inStock: 15,
    minThreshold: 5,
    material: 'Natural Terracotta Clay',
    technique: 'Wheel-Thrown & Hand-Burnished',
    badge: 'Handcrafted',
    leadTime: 'Ready to ship in 2 days',
    dimensions: 'H 8" × W 4"',
    weight: '800 g',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    description: '',
    story: '',
  };
  const [productForm, setProductForm] = useState<Partial<Product>>(defaultProductForm);

  // AI Story Assistant state
  const [aiCraftType, setAiCraftType] = useState('Blue Pottery Floral Vase');
  const [aiMaterial, setAiMaterial] = useState('Ground Quartz stone and natural cobalt glaze');
  const [aiRegion, setAiRegion] = useState('Jaipur, Rajasthan');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{ story: string; tags: string[]; provenance: string } | null>(null);

  // Inventory calculations
  const totalStockUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + (Number(p.inStock) || 0), 0);
  }, [products]);

  const totalInventoryValuation = useMemo(() => {
    return products.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.inStock) || 0)), 0);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => (Number(p.inStock) || 0) > 0 && (Number(p.inStock) || 0) <= (p.minThreshold || 5));
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => (Number(p.inStock) || 0) <= 0);
  }, [products]);

  // Filtered inventory products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = invCategory === 'All' || p.category === invCategory;
      const q = invSearch.toLowerCase();
      const matchSearch =
        !invSearch ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.material.toLowerCase().includes(q);

      const stock = Number(p.inStock) || 0;
      const threshold = p.minThreshold || 5;

      let matchStock = true;
      if (invStockFilter === 'low') matchStock = stock > 0 && stock <= threshold;
      else if (invStockFilter === 'out') matchStock = stock <= 0;
      else if (invStockFilter === 'healthy') matchStock = stock > threshold;

      return matchCat && matchSearch && matchStock;
    });
  }, [products, invCategory, invSearch, invStockFilter]);

  // Open Edit Product Modal
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setIsAddEditModalOpen(true);
  };

  // Open Add Product Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductForm({ ...defaultProductForm });
    setIsAddEditModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = () => {
    if (!productForm.name) {
      Alert.alert('Missing Field', 'Please enter a craft product title.');
      return;
    }
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
    } else {
      addProduct(productForm);
    }
    setIsAddEditModalOpen(false);
  };

  // Restock Submit
  const handleRestockSubmit = () => {
    if (!restockProduct) return;
    const units = parseInt(restockUnits, 10) || 0;
    if (units <= 0) {
      Alert.alert('Invalid Units', 'Please specify a positive unit count.');
      return;
    }
    adjustStock(restockProduct.id, units);
    showToast(`Restocked ${units} units for ${restockProduct.name.slice(0, 20)}...`);
    setIsRestockModalOpen(false);
  };

  // Save Store Settings
  const handleSaveStoreProfile = () => {
    updateStoreProfile(storeForm);
  };

  // AI Story Generation
  const handleGenerateAiStory = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiResult({
        story: `Handcrafted in ${aiRegion}, this authentic ${aiCraftType} is created through time-honoured generational techniques using ${aiMaterial}. Each artisan touch represents living cultural heritage, celebrating organic texture and sustainability without industrial compromise.`,
        provenance: `Verified authentic cluster craft from ${aiRegion}. Master-certified sustainable production with zero toxic dyes or synthetic fillers.`,
        tags: [aiCraftType.split(' ')[0], 'ArtisanCraft', 'GIHeritage', 'HandmadeIndia', 'FairTradeDirect'],
      });
      setAiGenerating(false);
      showToast('AI Craft Story Synthesized!');
    }, 1200);
  };

  const handleApplyAiToForm = () => {
    if (!aiResult) return;
    setProductForm((prev) => ({
      ...prev,
      name: aiCraftType,
      material: aiMaterial,
      location: aiRegion,
      story: aiResult.story,
      description: aiResult.provenance,
    }));
    setEditingProduct(null);
    setIsAddEditModalOpen(true);
  };

  return (
    <View style={styles.screen}>
      <AppHeader />

      {/* Atelier Banner Header */}
      <View style={styles.studioHeader}>
        <View style={styles.studioTitleRow}>
          <View style={styles.avatarWrap}>
            <Store size={22} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.storeNameRow}>
              <Text style={styles.storeName} numberOfLines={1}>{storeProfile.storeName}</Text>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={12} color="#FFFDF9" />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.artisanSubText}>{storeProfile.artisanName} • {storeProfile.location}</Text>
          </View>
          <Pressable
            style={styles.postCraftBtn}
            onPress={handleOpenAdd}
          >
            <Plus size={16} color="#FFFDF9" />
            <Text style={styles.postCraftBtnText}>New Craft</Text>
          </Pressable>
        </View>

        {/* Tab Selector Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          <Pressable
            style={[styles.tabBtn, activeTab === 'inventory' && styles.tabBtnActive]}
            onPress={() => setActiveTab('inventory')}
          >
            <Layers size={15} color={activeTab === 'inventory' ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabBtnText, activeTab === 'inventory' && styles.tabBtnTextActive]}>
              Inventory ({products.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'catalog' && styles.tabBtnActive]}
            onPress={() => setActiveTab('catalog')}
          >
            <Box size={15} color={activeTab === 'catalog' ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabBtnText, activeTab === 'catalog' && styles.tabBtnTextActive]}>
              Catalog
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'orders' && styles.tabBtnActive]}
            onPress={() => setActiveTab('orders')}
          >
            <Truck size={15} color={activeTab === 'orders' ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabBtnText, activeTab === 'orders' && styles.tabBtnTextActive]}>
              Orders ({orders.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'store' && styles.tabBtnActive]}
            onPress={() => setActiveTab('store')}
          >
            <Store size={15} color={activeTab === 'store' ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabBtnText, activeTab === 'store' && styles.tabBtnTextActive]}>
              Store Profile
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'ai-assist' && styles.tabBtnActive]}
            onPress={() => setActiveTab('ai-assist')}
          >
            <Sparkles size={15} color={activeTab === 'ai-assist' ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabBtnText, activeTab === 'ai-assist' && styles.tabBtnTextActive]}>
              AI Studio
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Main Tab Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentScroll}
      >
        {/* ================= INVENTORY TAB ================= */}
        {activeTab === 'inventory' && (
          <View style={styles.tabSection}>
            {/* Metric Cards Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <View style={styles.metricIconWrap}>
                  <TrendingUp size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.metricValue}>${totalInventoryValuation.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Total Atelier Valuation</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#EAF0EA' }]}>
                  <Box size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.metricValue}>{totalStockUnits}</Text>
                <Text style={styles.metricLabel}>Total Stock Units</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#FDF2E9' }]}>
                  <AlertTriangle size={16} color={COLORS.terracotta} />
                </View>
                <Text style={[styles.metricValue, { color: COLORS.terracotta }]}>{lowStockProducts.length}</Text>
                <Text style={styles.metricLabel}>Low Stock Alerts</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#FBEBEB' }]}>
                  <X size={16} color="#B91C1C" />
                </View>
                <Text style={[styles.metricValue, { color: '#B91C1C' }]}>{outOfStockProducts.length}</Text>
                <Text style={styles.metricLabel}>Out of Stock</Text>
              </View>
            </View>

            {/* Filter & Search Bar */}
            <View style={styles.cardContainer}>
              <View style={styles.searchRow}>
                <Search size={16} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by craft title, SKU, or material..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={invSearch}
                  onChangeText={setInvSearch}
                />
                {invSearch ? (
                  <Pressable onPress={() => setInvSearch('')}>
                    <X size={16} color={COLORS.textSecondary} />
                  </Pressable>
                ) : null}
              </View>

              {/* Status Filter Chips */}
              <View style={styles.chipsRow}>
                {(['all', 'low', 'out', 'healthy'] as const).map((filter) => (
                  <Pressable
                    key={filter}
                    style={[
                      styles.filterChip,
                      invStockFilter === filter && styles.filterChipActive,
                    ]}
                    onPress={() => setInvStockFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        invStockFilter === filter && styles.filterChipTextActive,
                      ]}
                    >
                      {filter === 'all' && `All (${products.length})`}
                      {filter === 'low' && `Low Stock (${lowStockProducts.length})`}
                      {filter === 'out' && `Out of Stock (${outOfStockProducts.length})`}
                      {filter === 'healthy' && `Healthy (${products.length - lowStockProducts.length - outOfStockProducts.length})`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Inventory Items List */}
            <View style={styles.itemsList}>
              {filteredProducts.map((p) => {
                const stock = Number(p.inStock) || 0;
                const threshold = p.minThreshold || 5;
                const isLow = stock > 0 && stock <= threshold;
                const isOut = stock <= 0;

                return (
                  <View key={p.id} style={styles.inventoryCard}>
                    <Image source={{ uri: p.image }} style={styles.itemThumb} />

                    <View style={styles.itemMeta}>
                      <View style={styles.skuRow}>
                        <Text style={styles.skuText}>{p.sku || `KS-${p.id}`}</Text>
                        <View
                          style={[
                            styles.statusPill,
                            isOut && { backgroundColor: '#FBEBEB' },
                            isLow && { backgroundColor: '#FDF2E9' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusPillText,
                              isOut && { color: '#B91C1C' },
                              isLow && { color: COLORS.terracotta },
                            ]}
                          >
                            {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Active'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.itemTitle} numberOfLines={2}>{p.name}</Text>
                      <Text style={styles.itemCategory}>{p.category} • ${p.price}</Text>

                      {/* Stock Adjustment Controls */}
                      <View style={styles.stockControlRow}>
                        <View style={styles.stepperWrap}>
                          <Pressable
                            style={styles.stepBtn}
                            onPress={() => adjustStock(p.id, -1)}
                          >
                            <Minus size={14} color={COLORS.textPrimary} />
                          </Pressable>
                          <Text style={styles.stepperValue}>{stock}</Text>
                          <Pressable
                            style={styles.stepBtn}
                            onPress={() => adjustStock(p.id, 1)}
                          >
                            <Plus size={14} color={COLORS.textPrimary} />
                          </Pressable>
                        </View>

                        <Pressable
                          style={styles.restockActionBtn}
                          onPress={() => {
                            setRestockProduct(p);
                            setRestockUnits('10');
                            setIsRestockModalOpen(true);
                          }}
                        >
                          <RefreshCw size={13} color={COLORS.primary} />
                          <Text style={styles.restockActionText}>Batch Restock</Text>
                        </Pressable>

                        <Pressable
                          style={styles.editIconBtn}
                          onPress={() => handleOpenEdit(p)}
                        >
                          <Edit3 size={15} color={COLORS.textSecondary} />
                        </Pressable>

                        <Pressable
                          style={styles.deleteIconBtn}
                          onPress={() => {
                            Alert.alert('Remove Craft', `Remove "${p.name}" from store catalog?`, [
                              { text: 'Cancel', style: 'cancel' },
                              { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(p.id) },
                            ]);
                          }}
                        >
                          <Trash2 size={15} color="#B91C1C" />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })}

              {filteredProducts.length === 0 && (
                <View style={styles.emptyCard}>
                  <Box size={36} color={COLORS.textSecondary} />
                  <Text style={styles.emptyTitle}>No matching crafts found</Text>
                  <Text style={styles.emptySub}>Try adjusting search filters or publishing a new craft piece.</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ================= CATALOG TAB ================= */}
        {activeTab === 'catalog' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Craft Showcase Catalog</Text>
                <Text style={styles.sectionSub}>Manage your public live store listings and prices.</Text>
              </View>
              <Pressable style={styles.addCatalogBtn} onPress={handleOpenAdd}>
                <Plus size={15} color="#FFFDF9" />
                <Text style={styles.addCatalogBtnText}>Add Craft</Text>
              </Pressable>
            </View>

            <View style={styles.catalogGrid}>
              {products.map((prod) => (
                <View key={prod.id} style={styles.catalogCard}>
                  <Image source={{ uri: prod.image }} style={styles.catalogImg} />
                  <View style={styles.catalogBody}>
                    <View style={styles.skuRow}>
                      <Text style={styles.skuText}>{prod.sku || `KS-${prod.id}`}</Text>
                      <Text style={styles.priceTag}>${prod.price}</Text>
                    </View>
                    <Text style={styles.catalogTitle} numberOfLines={2}>{prod.name}</Text>
                    <Text style={styles.catalogSub}>{prod.technique || prod.material}</Text>

                    <View style={styles.catalogActionRow}>
                      <Pressable
                        style={styles.catalogEditBtn}
                        onPress={() => handleOpenEdit(prod)}
                      >
                        <Edit3 size={13} color={COLORS.primary} />
                        <Text style={styles.catalogEditText}>Edit Specs</Text>
                      </Pressable>

                      <Pressable
                        style={styles.catalogDeleteBtn}
                        onPress={() => {
                          Alert.alert('Delete', `Remove ${prod.name}?`, [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(prod.id) },
                          ]);
                        }}
                      >
                        <Trash2 size={13} color="#B91C1C" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === 'orders' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Orders & Dispatch Pipeline</Text>
                <Text style={styles.sectionSub}>Track buyer orders, update fulfillment status & view dispatch slips.</Text>
              </View>
            </View>

            <View style={styles.ordersList}>
              {orders.map((order) => {
                const isDelivered = order.status === 'Delivered';
                const isTransit = order.status === 'In Transit';
                const isReady = order.status === 'Ready to Ship';

                return (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderTopRow}>
                      <View>
                        <Text style={styles.orderId}>{order.id}</Text>
                        <Text style={styles.orderDate}>{order.date} • {order.city}</Text>
                      </View>
                      <View style={styles.orderAmountWrap}>
                        <Text style={styles.orderTotal}>${order.total}.00</Text>
                        <View
                          style={[
                            styles.orderStatusBadge,
                            isDelivered && { backgroundColor: '#EAF0EA' },
                            isTransit && { backgroundColor: '#EBF3EC' },
                            isReady && { backgroundColor: '#FDF2E9' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.orderStatusText,
                              isDelivered && { color: COLORS.primary },
                              isTransit && { color: COLORS.primary },
                              isReady && { color: COLORS.terracotta },
                            ]}
                          >
                            {order.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Customer Info */}
                    <View style={styles.customerRow}>
                      <User size={14} color={COLORS.textSecondary} />
                      <Text style={styles.customerName}>{order.customer}</Text>
                      <Text style={styles.customerEmail}>({order.email})</Text>
                    </View>

                    {/* Items Breakdown */}
                    <View style={styles.orderItemsBox}>
                      {order.items.map((item, idx) => (
                        <View key={idx} style={styles.orderItemRow}>
                          <Text style={styles.orderItemQty}>{item.quantity}×</Text>
                          <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
                          <Text style={styles.orderItemPrice}>${item.price * item.quantity}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Tracking ID */}
                    <View style={styles.trackingRow}>
                      <Text style={styles.trackingLabel}>Tracking ID:</Text>
                      <Text style={styles.trackingVal}>{order.trackingId}</Text>
                    </View>

                    {/* Status Stepper Actions */}
                    <View style={styles.orderActionsRow}>
                      <Text style={styles.changeStatusLabel}>Update Status:</Text>
                      {(['Processing', 'Ready to Ship', 'In Transit', 'Delivered'] as const).map((st) => (
                        <Pressable
                          key={st}
                          style={[
                            styles.statusOptionBtn,
                            order.status === st && styles.statusOptionBtnActive,
                          ]}
                          onPress={() => updateOrderStatus(order.id, st)}
                        >
                          <Text
                            style={[
                              styles.statusOptionText,
                              order.status === st && styles.statusOptionTextActive,
                            ]}
                          >
                            {st}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    {/* Packing Slip Button */}
                    <Pressable
                      style={styles.slipBtn}
                      onPress={() => setViewOrderSlip(order)}
                    >
                      <Printer size={14} color={COLORS.primary} />
                      <Text style={styles.slipBtnText}>View Packing Receipt</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ================= STORE PROFILE TAB ================= */}
        {activeTab === 'store' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Atelier Settings & GI Identity</Text>
                <Text style={styles.sectionSub}>Configure your official master craft credentials, payouts & bio.</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Store / Atelier Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={storeForm.storeName}
                  onChangeText={(v) => setStoreForm((prev) => ({ ...prev, storeName: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Master Artisan Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={storeForm.artisanName}
                  onChangeText={(v) => setStoreForm((prev) => ({ ...prev, artisanName: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Craft Tagline</Text>
                <TextInput
                  style={styles.formInput}
                  value={storeForm.tagline}
                  onChangeText={(v) => setStoreForm((prev) => ({ ...prev, tagline: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Location / Heritage Cluster</Text>
                <TextInput
                  style={styles.formInput}
                  value={storeForm.location}
                  onChangeText={(v) => setStoreForm((prev) => ({ ...prev, location: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>GI Tag Certificate Number</Text>
                <TextInput
                  style={styles.formInput}
                  value={storeForm.giTagNumber}
                  onChangeText={(v) => setStoreForm((prev) => ({ ...prev, giTagNumber: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>UPI Payout ID (Direct Bank Settle)</Text>
                <TextInput
                  style={styles.formInput}
                  value={storeForm.payoutUpi}
                  onChangeText={(v) => setStoreForm((prev) => ({ ...prev, payoutUpi: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>WhatsApp Business Support</Text>
                <TextInput
                  style={styles.formInput}
                  value={storeForm.whatsapp}
                  onChangeText={(v) => setStoreForm((prev) => ({ ...prev, whatsapp: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Artisan Biography</Text>
                <TextInput
                  style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
                  multiline
                  value={storeForm.bio}
                  onChangeText={(v) => setStoreForm((prev) => ({ ...prev, bio: v }))}
                />
              </View>

              {/* Announcement Toggle */}
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>Storefront Announcement Banner</Text>
                  <Text style={styles.toggleSub}>Displays special discounts or seasonal craft drops</Text>
                </View>
                <Switch
                  value={storeForm.announcementActive}
                  onValueChange={(val) => setStoreForm((prev) => ({ ...prev, announcementActive: val }))}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                />
              </View>

              {storeForm.announcementActive && (
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Announcement Text</Text>
                  <TextInput
                    style={styles.formInput}
                    value={storeForm.announcement}
                    onChangeText={(v) => setStoreForm((prev) => ({ ...prev, announcement: v }))}
                  />
                </View>
              )}

              <Pressable style={styles.saveStoreBtn} onPress={handleSaveStoreProfile}>
                <CheckCircle2 size={16} color="#FFFDF9" />
                <Text style={styles.saveStoreBtnText}>Save Store Settings</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ================= AI ASSIST TAB ================= */}
        {activeTab === 'ai-assist' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>AI Craft Story Studio</Text>
                <Text style={styles.sectionSub}>Generate authentic cultural narratives and marketing stories.</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Craft Piece Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={aiCraftType}
                  onChangeText={setAiCraftType}
                  placeholder="e.g. Dhokra Brass Oil Lamp"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Materials & Technique</Text>
                <TextInput
                  style={styles.formInput}
                  value={aiMaterial}
                  onChangeText={setAiMaterial}
                  placeholder="e.g. Lost-Wax Bell Metal & Beeswax"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Regional Origin / Cluster</Text>
                <TextInput
                  style={styles.formInput}
                  value={aiRegion}
                  onChangeText={setAiRegion}
                  placeholder="e.g. Bastar, Chhattisgarh"
                />
              </View>

              <Pressable
                style={[styles.generateAiBtn, aiGenerating && { opacity: 0.6 }]}
                disabled={aiGenerating}
                onPress={handleGenerateAiStory}
              >
                <Sparkles size={16} color="#FFFDF9" />
                <Text style={styles.generateAiBtnText}>
                  {aiGenerating ? 'Synthesizing Craft Heritage...' : 'Generate Marketing Story'}
                </Text>
              </Pressable>

              {aiResult && (
                <View style={styles.aiResultBox}>
                  <Text style={styles.aiResultHeading}>Synthesized Craft Story:</Text>
                  <Text style={styles.aiResultStory}>{aiResult.story}</Text>

                  <Text style={[styles.aiResultHeading, { marginTop: 12 }]}>Provenance & Guarantee:</Text>
                  <Text style={styles.aiResultStory}>{aiResult.provenance}</Text>

                  <View style={styles.tagsRow}>
                    {aiResult.tags.map((t, idx) => (
                      <View key={idx} style={styles.tagChip}>
                        <Text style={styles.tagText}>#{t}</Text>
                      </View>
                    ))}
                  </View>

                  <Pressable style={styles.useInListingBtn} onPress={handleApplyAiToForm}>
                    <Copy size={14} color={COLORS.primary} />
                    <Text style={styles.useInListingText}>Apply to New Craft Listing</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      <Modal visible={isAddEditModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Edit Craft Details' : 'Publish New Craft Piece'}
              </Text>
              <Pressable onPress={() => setIsAddEditModalOpen(false)}>
                <X size={20} color={COLORS.textPrimary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Craft Title *</Text>
                <TextInput
                  style={styles.formInput}
                  value={productForm.name}
                  onChangeText={(v) => setProductForm((p) => ({ ...p, name: v }))}
                  placeholder="e.g. Hand-Thrown Alluvial Clay Pitcher"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Retail Price ($ USD) *</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={String(productForm.price || '')}
                    onChangeText={(v) => setProductForm((p) => ({ ...p, price: Number(v) }))}
                  />
                </View>

                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Initial Stock Units *</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={String(productForm.inStock ?? 10)}
                    onChangeText={(v) => setProductForm((p) => ({ ...p, inStock: Number(v) }))}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Category</Text>
                <TextInput
                  style={styles.formInput}
                  value={productForm.category}
                  onChangeText={(v) => setProductForm((p) => ({ ...p, category: v }))}
                  placeholder="Ceramics & Pottery"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Materials</Text>
                <TextInput
                  style={styles.formInput}
                  value={productForm.material}
                  onChangeText={(v) => setProductForm((p) => ({ ...p, material: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Technique</Text>
                <TextInput
                  style={styles.formInput}
                  value={productForm.technique}
                  onChangeText={(v) => setProductForm((p) => ({ ...p, technique: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Craft Story & Heritage</Text>
                <TextInput
                  style={[styles.formInput, { height: 75, textAlignVertical: 'top' }]}
                  multiline
                  value={productForm.story}
                  onChangeText={(v) => setProductForm((p) => ({ ...p, story: v }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Photo Image URL</Text>
                <TextInput
                  style={styles.formInput}
                  value={productForm.image}
                  onChangeText={(v) => setProductForm((p) => ({ ...p, image: v }))}
                />
              </View>

              <Pressable style={styles.modalSubmitBtn} onPress={handleSaveProduct}>
                <Text style={styles.modalSubmitText}>
                  {editingProduct ? 'Save Updates' : 'Publish to Catalog'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: RESTOCK BATCH ================= */}
      <Modal visible={isRestockModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>Batch Restock Workshop</Text>
            <Text style={styles.dialogSub}>
              Add newly finished pieces from your kiln, loom, or chisel bench.
            </Text>

            {restockProduct && (
              <View style={styles.dialogProductSummary}>
                <Text style={styles.dialogProductName} numberOfLines={1}>
                  {restockProduct.name}
                </Text>
                <Text style={styles.dialogCurrentStock}>
                  Current Stock: <Text style={{ fontWeight: '800' }}>{restockProduct.inStock || 0} units</Text>
                </Text>
              </View>
            )}

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Units Completed</Text>
              <TextInput
                style={styles.formInput}
                keyboardType="numeric"
                value={restockUnits}
                onChangeText={setRestockUnits}
              />
            </View>

            <View style={styles.dialogBtnRow}>
              <Pressable
                style={styles.dialogCancelBtn}
                onPress={() => setIsRestockModalOpen(false)}
              >
                <Text style={styles.dialogCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.dialogConfirmBtn}
                onPress={handleRestockSubmit}
              >
                <Text style={styles.dialogConfirmText}>Confirm Restock</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: PACKING SLIP ================= */}
      <Modal visible={!!viewOrderSlip} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dispatch & Packing Receipt</Text>
              <Pressable onPress={() => setViewOrderSlip(null)}>
                <X size={20} color={COLORS.textPrimary} />
              </Pressable>
            </View>

            {viewOrderSlip && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.receiptBox}>
                  <Text style={styles.receiptHeader}>KLASETU HERITAGE ARTISAN DISPATCH</Text>
                  <Text style={styles.receiptSub}>Direct Cluster Fulfillment Order</Text>

                  <View style={styles.receiptDivider} />

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Order ID:</Text>
                    <Text style={styles.receiptVal}>{viewOrderSlip.id}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Date:</Text>
                    <Text style={styles.receiptVal}>{viewOrderSlip.date}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Customer:</Text>
                    <Text style={styles.receiptVal}>{viewOrderSlip.customer}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Destination:</Text>
                    <Text style={styles.receiptVal}>{viewOrderSlip.city}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Tracking #:</Text>
                    <Text style={styles.receiptVal}>{viewOrderSlip.trackingId}</Text>
                  </View>

                  <View style={styles.receiptDivider} />

                  <Text style={styles.receiptSectionHead}>Enclosed Handcrafted Items:</Text>
                  {viewOrderSlip.items.map((it, idx) => (
                    <View key={idx} style={styles.receiptItemRow}>
                      <Text style={styles.receiptItemTitle}>{it.quantity}× {it.name}</Text>
                      <Text style={styles.receiptItemTotal}>${it.price * it.quantity}.00</Text>
                    </View>
                  ))}

                  <View style={styles.receiptDivider} />

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabelBold}>Grand Total:</Text>
                    <Text style={styles.receiptValBold}>${viewOrderSlip.total}.00 USD</Text>
                  </View>
                </View>

                <Pressable
                  style={styles.printReceiptBtn}
                  onPress={() => {
                    showToast('Packing receipt sent to printer / PDF export!');
                    setViewOrderSlip(null);
                  }}
                >
                  <Printer size={16} color="#FFFDF9" />
                  <Text style={styles.printReceiptText}>Print Packaging Slip</Text>
                </Pressable>
              </ScrollView>
            )}
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
  studioHeader: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: 8,
  },
  studioTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.accentBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  storeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  artisanSubText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  postCraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  postCraftBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  tabScroll: {
    paddingHorizontal: 12,
    gap: 6,
    paddingBottom: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tabBtnActive: {
    backgroundColor: '#EAF0EA',
    borderColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  contentScroll: {
    padding: 14,
    paddingBottom: 40,
  },
  tabSection: {
    gap: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 3,
  },
  metricIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EAF0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F5EF',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 38,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFDF9',
    fontWeight: '700',
  },
  itemsList: {
    gap: 10,
  },
  inventoryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  itemThumb: {
    width: 74,
    height: 74,
    borderRadius: 12,
    backgroundColor: COLORS.accentBg,
  },
  itemMeta: {
    flex: 1,
    gap: 3,
  },
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skuText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 0.5,
  },
  statusPill: {
    backgroundColor: '#EAF0EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemCategory: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  stockControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 8,
  },
  stepBtn: {
    padding: 4,
  },
  stepperValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  restockActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF0EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  restockActionText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  editIconBtn: {
    padding: 5,
  },
  deleteIconBtn: {
    padding: 5,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  addCatalogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  addCatalogBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  catalogGrid: {
    gap: 10,
  },
  catalogCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    gap: 10,
  },
  catalogImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.accentBg,
  },
  catalogBody: {
    flex: 1,
    gap: 3,
  },
  priceTag: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  catalogTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  catalogSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  catalogActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  catalogEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF0EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  catalogEditText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  catalogDeleteBtn: {
    padding: 4,
  },
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  orderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  orderAmountWrap: {
    alignItems: 'flex-end',
    gap: 3,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  orderStatusBadge: {
    backgroundColor: '#EAF0EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customerName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  customerEmail: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  orderItemsBox: {
    backgroundColor: '#F8F5EF',
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderItemQty: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  orderItemName: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  orderItemPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trackingLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  trackingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  orderActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  changeStatusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  statusOptionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  statusOptionBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusOptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  statusOptionTextActive: {
    color: '#FFFDF9',
  },
  slipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EAF0EA',
    paddingVertical: 8,
    borderRadius: 12,
  },
  slipBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  formField: {
    gap: 4,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  formInput: {
    backgroundColor: '#F8F5EF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  toggleSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  saveStoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  saveStoreBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  generateAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  generateAiBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  aiResultBox: {
    backgroundColor: '#F8F5EF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 6,
  },
  aiResultHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  aiResultStory: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagChip: {
    backgroundColor: '#EAF0EA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  useInListingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 12,
  },
  useInListingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalBody: {
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalSubmitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  modalSubmitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  dialogSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  dialogProductSummary: {
    backgroundColor: '#F8F5EF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
  dialogProductName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dialogCurrentStock: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dialogBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  dialogCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dialogCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dialogConfirmBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  dialogConfirmText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  receiptBox: {
    backgroundColor: '#F8F5EF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  receiptHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  receiptSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 6,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  receiptVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  receiptSectionHead: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: 2,
  },
  receiptItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  receiptItemTitle: {
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  receiptItemTotal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  receiptLabelBold: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  receiptValBold: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primary,
  },
  printReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 14,
    marginBottom: 20,
  },
  printReceiptText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFDF9',
  },
});
