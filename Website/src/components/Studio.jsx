import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { CRAFT_CATEGORIES } from '../data/productsData';
import { Link } from 'react-router';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Store,
  Layers,
  Search,
  Sparkles,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  Globe,
  Phone,
  CreditCard,
  Save,
  Eye,
  RefreshCw,
  Box,
  Printer,
  Copy,
  X,
  Award
} from 'lucide-react';

export default function Studio() {
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
    showToast
  } = useShop();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'products', 'store', 'orders', 'ai-assist'

  // Inventory filtering and searching
  const [invSearch, setInvSearch] = useState('');
  const [invCategory, setInvCategory] = useState('All');
  const [invStockFilter, setInvStockFilter] = useState('all'); // 'all', 'low', 'out', 'healthy'
  const [invSortField, setInvSortField] = useState('name');
  const [invSortAsc, setInvSortAsc] = useState(true);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = add new, object = edit
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockUnits, setRestockUnits] = useState(10);
  const [restockNote, setRestockNote] = useState('New workshop kiln/loom batch');

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [viewOrderSlip, setViewOrderSlip] = useState(null);

  // Store profile form state
  const [storeForm, setStoreForm] = useState(storeProfile);
  const [storeSavedNotice, setStoreSavedNotice] = useState(false);

  // Product Form state for Add/Edit
  const defaultProductForm = {
    name: '',
    category: 'Ceramics & Pottery',
    maker: storeProfile?.artisanName || 'Master Artisan',
    location: storeProfile?.location || 'Khurja, Uttar Pradesh',
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
  const [productForm, setProductForm] = useState(defaultProductForm);

  // AI Story generator state inside Studio
  const [aiCraftType, setAiCraftType] = useState('Blue Pottery Floral Vase');
  const [aiMaterial, setAiMaterial] = useState('Ground Quartz stone and natural cobalt glaze');
  const [aiRegion, setAiRegion] = useState('Jaipur, Rajasthan');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

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

  const totalRevenueMock = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 3240);
  }, [orders]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return products
      .filter((item) => {
        // Search
        if (invSearch.trim()) {
          const q = invSearch.toLowerCase();
          const matchName = item.name?.toLowerCase().includes(q);
          const matchSku = item.sku?.toLowerCase().includes(q);
          const matchCat = item.category?.toLowerCase().includes(q);
          const matchMat = item.material?.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchCat && !matchMat) return false;
        }
        // Category
        if (invCategory !== 'All' && item.category !== invCategory) {
          return false;
        }
        // Stock status
        const stock = Number(item.inStock) || 0;
        const thresh = item.minThreshold || 5;
        if (invStockFilter === 'low') {
          return stock > 0 && stock <= thresh;
        }
        if (invStockFilter === 'out') {
          return stock <= 0;
        }
        if (invStockFilter === 'healthy') {
          return stock > thresh;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[invSortField];
        let valB = b[invSortField];
        if (invSortField === 'inStock' || invSortField === 'price') {
          valA = Number(valA) || 0;
          valB = Number(valB) || 0;
        } else {
          valA = String(valA || '').toLowerCase();
          valB = String(valB || '').toLowerCase();
        }
        if (valA < valB) return invSortAsc ? -1 : 1;
        if (valA > valB) return invSortAsc ? 1 : -1;
        return 0;
      });
  }, [products, invSearch, invCategory, invStockFilter, invSortField, invSortAsc]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      ...defaultProductForm,
      maker: storeProfile?.artisanName || 'Master Artisan',
      location: storeProfile?.location || 'Khurja, Uttar Pradesh',
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      category: prod.category || 'Ceramics & Pottery',
      maker: prod.maker || storeProfile?.artisanName,
      location: prod.location || storeProfile?.location,
      price: prod.price || 50,
      originalPrice: prod.originalPrice || 65,
      inStock: prod.inStock ?? 10,
      minThreshold: prod.minThreshold || 5,
      material: prod.material || '',
      technique: prod.technique || '',
      badge: prod.badge || 'Handcrafted',
      leadTime: prod.leadTime || 'Ready to ship',
      dimensions: prod.dimensions || '',
      weight: prod.weight || '',
      image: prod.image || '',
      description: prod.description || '',
      story: prod.story || '',
    });
    setIsAddEditModalOpen(true);
  };

  const handleSaveProductForm = (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Please enter a craft title');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        inStock: Number(productForm.inStock),
        minThreshold: Number(productForm.minThreshold),
      });
    } else {
      addProduct({
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        inStock: Number(productForm.inStock),
        minThreshold: Number(productForm.minThreshold),
      });
    }

    setIsAddEditModalOpen(false);
  };

  const handleOpenRestock = (product) => {
    setRestockProduct(product);
    setRestockUnits(10);
    setIsRestockModalOpen(true);
  };

  const handleConfirmRestock = () => {
    if (restockProduct) {
      const added = Number(restockUnits) || 0;
      adjustStock(restockProduct.id, added);
      showToast(`Added +${added} units to ${restockProduct.name.slice(0, 20)}...`);
      setIsRestockModalOpen(false);
    }
  };

  const handleSaveStoreProfile = (e) => {
    e.preventDefault();
    updateStoreProfile(storeForm);
    setStoreSavedNotice(true);
    setTimeout(() => setStoreSavedNotice(false), 3000);
  };

  const handleGenerateAiStory = async () => {
    setAiGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAiResult({
      title: `${aiCraftType} - Sacred Heritage Edition`,
      description: `Handcrafted from ethically gathered ${aiMaterial}, this authentic heirloom item is sculpted in ${aiRegion} following generations-old ancestral craft traditions. Each contour reflects the artisan's patient dedication to zero-waste, slow-made art.`,
      story: `In the heart of ${aiRegion}, master craft guilds shape every piece by hand on ancestral workstations without electric molds. Fired using solar & organic kiln techniques, this artifact celebrates natural earthen textures and timeless cultural reverence.`,
      tags: ['#ArtisanCraft', '#HeritageArt', '#EcoFriendly', '#SlowLiving', '#FairTradeCraft'],
      suggestedPrice: '$58 - $72',
    });
    setAiGenerating(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 1. ARTISAN STUDIO TOP BAR / BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-[#EDE4D6] bg-white shadow-sm mb-8">
          {/* Studio Banner Image Header */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#2B2420]">
            <img
              src={storeProfile?.coverImage}
              alt="Artisan Studio Banner"
              className="h-full w-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Quick Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold backdrop-blur-md ${
                storeProfile?.isOpen 
                  ? 'bg-[#3C6E47]/90 text-[#FFFDF9] border border-white/20' 
                  : 'bg-[#B5652F]/90 text-white'
              }`}>
                <span className={`h-2 w-2 rounded-full ${storeProfile?.isOpen ? 'bg-emerald-300 animate-pulse' : 'bg-amber-300'}`} />
                {storeProfile?.isOpen ? 'Studio Open & Live' : 'Vacation Mode'}
              </span>
            </div>
          </div>

          {/* Studio Info Row */}
          <div className="px-6 pb-6 pt-0 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 sm:-mt-16">
              
              {/* Avatar and Identity */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative">
                  <img
                    src={storeProfile?.avatarImage}
                    alt={storeProfile?.artisanName}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-white object-cover shadow-md bg-[#F3E6D3]"
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-[#3C6E47] p-1 text-white shadow-xs" title="Verified Master Artisan">
                    <ShieldCheck size={16} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#2B2420]">
                      {storeProfile?.storeName}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F3E6D3] px-2.5 py-0.5 text-xs font-bold text-[#B5652F]">
                      <Award size={13} /> {storeProfile?.verifiedBadge}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#8A8078]">
                    <span className="flex items-center gap-1 text-[#2B2420] font-medium">
                      <span>Artisan:</span> {storeProfile?.artisanName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#3C6E47]" /> {storeProfile?.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-[#3C6E47]" /> {storeProfile?.yearsActive}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#2B2420]">
                      ★ {storeProfile?.rating} ({storeProfile?.reviewsCount} verified craft reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDE4D6] bg-white px-4 py-2.5 text-xs font-bold text-[#2B2420] hover:bg-[#F3E6D3]/60 transition-all shadow-2xs"
                >
                  <Eye size={14} className="text-[#8A8078]" />
                  <span>Preview Storefront</span>
                </Link>

                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C6E47] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#2F5838] transition-all shadow-sm active:scale-95"
                >
                  <Plus size={15} />
                  <span>Add New Craft</span>
                </button>
              </div>

            </div>

            {/* Studio Announcement Bar (if active) */}
            {storeProfile?.announcementActive && storeProfile?.announcement && (
              <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F3E6D3]/70 border border-[#EDE4D6] px-4 py-2.5 text-xs text-[#2B2420]">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#B5652F] shrink-0" />
                  <span className="font-semibold text-[#B5652F]">Store Announcement:</span>
                  <span className="text-[#2B2420]">{storeProfile.announcement}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('store')}
                  className="text-[11px] font-bold text-[#3C6E47] hover:underline shrink-0"
                >
                  Edit Banner
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. STUDIO KPI METRICS CARDS */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mb-8">
          {/* Card 1: Total Inventory Units */}
          <div className="rounded-2xl border border-[#EDE4D6] bg-white p-4 sm:p-5 card-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8A8078]">Total Inventory</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EBF3EC] text-[#3C6E47]">
                <Box size={18} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#2B2420] font-serif-heading">
                {totalStockUnits}
              </span>
              <span className="text-xs text-[#8A8078] ml-1.5">units</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[#8A8078]">
              <span className="font-medium text-[#3C6E47]">{products.length} craft listings</span>
              <span>•</span>
              <span>{products.filter(p => (p.inStock || 0) > 0).length} in stock</span>
            </div>
          </div>

          {/* Card 2: Inventory Value */}
          <div className="rounded-2xl border border-[#EDE4D6] bg-white p-4 sm:p-5 card-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8A8078]">Inventory Valuation</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3E6D3] text-[#B5652F]">
                <DollarSign size={18} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#2B2420] font-serif-heading">
                ${totalInventoryValuation.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#3C6E47]">
              <TrendingUp size={13} />
              <span>Est. Craft Retail Value</span>
            </div>
          </div>

          {/* Card 3: Stock Health / Alerts */}
          <div 
            onClick={() => {
              setActiveTab('inventory');
              setInvStockFilter('low');
            }}
            className="rounded-2xl border border-[#EDE4D6] bg-white p-4 sm:p-5 card-shadow cursor-pointer hover:border-[#B5652F]/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8A8078]">Low Stock Alerts</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                lowStockProducts.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-[#EBF3EC] text-[#3C6E47]'
              }`}>
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-bold font-serif-heading ${
                lowStockProducts.length > 0 ? 'text-[#B5652F]' : 'text-[#2B2420]'
              }`}>
                {lowStockProducts.length}
              </span>
              <span className="text-xs text-[#8A8078]">items below threshold</span>
            </div>
            <div className="mt-2 text-[11px] text-[#8A8078]">
              {outOfStockProducts.length > 0 ? (
                <span className="text-rose-600 font-semibold">{outOfStockProducts.length} completely sold out</span>
              ) : (
                <span className="text-[#3C6E47]">Stock levels healthy</span>
              )}
            </div>
          </div>

          {/* Card 4: Orders in Queue */}
          <div 
            onClick={() => setActiveTab('orders')}
            className="rounded-2xl border border-[#EDE4D6] bg-white p-4 sm:p-5 card-shadow cursor-pointer hover:border-[#3C6E47]/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8A8078]">Pending Shipments</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Truck size={18} />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#2B2420] font-serif-heading">
                {orders.filter(o => o.status !== 'Delivered').length}
              </span>
              <span className="text-xs text-[#8A8078]">orders to dispatch</span>
            </div>
            <div className="mt-2 text-[11px] text-[#3C6E47] font-medium">
              Total sales: ${totalRevenueMock.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 3. STUDIO TAB NAVIGATION */}
        <div className="flex border-b border-[#EDE4D6] gap-2 sm:gap-6 text-xs sm:text-sm font-semibold mb-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'inventory'
                ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                : 'text-[#8A8078] hover:text-[#2B2420]'
            }`}
          >
            <Package size={17} />
            <span>Inventory Management</span>
            {lowStockProducts.length > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                {lowStockProducts.length} low
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'products'
                ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                : 'text-[#8A8078] hover:text-[#2B2420]'
            }`}
          >
            <Layers size={17} />
            <span>Craft Products ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className={`pb-3 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'store'
                ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                : 'text-[#8A8078] hover:text-[#2B2420]'
            }`}
          >
            <Store size={17} />
            <span>Store Settings & Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                : 'text-[#8A8078] hover:text-[#2B2420]'
            }`}
          >
            <Truck size={17} />
            <span>Orders & Dispatch</span>
            <span className="rounded-full bg-[#EBF3EC] px-2 py-0.5 text-[10px] font-bold text-[#3C6E47]">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai-assist')}
            className={`pb-3 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'ai-assist'
                ? 'border-b-2 border-[#3C6E47] text-[#3C6E47]'
                : 'text-[#8A8078] hover:text-[#2B2420]'
            }`}
          >
            <Sparkles size={17} className="text-[#B5652F]" />
            <span className="text-[#B5652F]">AI Craft Assistant</span>
          </button>
        </div>

        {/* 4. TAB CONTENTS */}

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Filter and Action Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-2xl border border-[#EDE4D6] bg-white p-4 card-shadow">
              
              {/* Search & Category */}
              <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search title, SKU, material..."
                    value={invSearch}
                    onChange={(e) => setInvSearch(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 pl-9 pr-3 text-xs text-[#2B2420] placeholder-[#8A8078] focus:border-[#3C6E47] focus:outline-none"
                  />
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8078]" />
                  {invSearch && (
                    <button
                      type="button"
                      onClick={() => setInvSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8A8078] hover:text-[#2B2420]"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="w-full sm:w-auto">
                  <select
                    value={invCategory}
                    onChange={(e) => setInvCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {CRAFT_CATEGORIES.filter(c => c !== 'All Crafts').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock Status Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInvStockFilter('all')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    invStockFilter === 'all'
                      ? 'bg-[#2B2420] text-white'
                      : 'bg-[#F3E6D3]/50 text-[#8A8078] hover:text-[#2B2420]'
                  }`}
                >
                  All ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setInvStockFilter('healthy')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    invStockFilter === 'healthy'
                      ? 'bg-[#3C6E47] text-white'
                      : 'bg-[#EBF3EC] text-[#3C6E47] hover:bg-[#3C6E47] hover:text-white'
                  }`}
                >
                  Healthy Stock
                </button>
                <button
                  type="button"
                  onClick={() => setInvStockFilter('low')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1 ${
                    invStockFilter === 'low'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  <AlertTriangle size={12} />
                  Low Stock ({lowStockProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setInvStockFilter('out')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    invStockFilter === 'out'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-600 hover:text-white'
                  }`}
                >
                  Out of Stock ({outOfStockProducts.length})
                </button>
              </div>

            </div>

            {/* Low Stock Urgent Notification Banner */}
            {lowStockProducts.length > 0 && invStockFilter === 'all' && (
              <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-amber-800 shrink-0">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="font-bold">Low Inventory Warning</p>
                    <p className="text-amber-800/80">
                      {lowStockProducts.length} craft item{lowStockProducts.length > 1 ? 's are' : ' is'} below minimum threshold (≤ 5 units). Prepare next workshop batch to avoid backorders.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInvStockFilter('low')}
                  className="rounded-xl bg-amber-800 px-3.5 py-1.5 font-bold text-white hover:bg-amber-900 shrink-0"
                >
                  Review Low Stock
                </button>
              </div>
            )}

            {/* Inventory Table */}
            <div className="overflow-hidden rounded-2xl border border-[#EDE4D6] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#2B2420]">
                  <thead className="border-b border-[#EDE4D6] bg-[#F3E6D3]/40 text-[11px] font-bold uppercase tracking-wider text-[#8A8078]">
                    <tr>
                      <th className="px-5 py-3.5">Craft & SKU</th>
                      <th className="px-4 py-3.5">Category & Craft Style</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5 text-center">Stock Level</th>
                      <th className="px-4 py-3.5">Stock Status</th>
                      <th className="px-4 py-3.5">Line Value</th>
                      <th className="px-5 py-3.5 text-right">Inventory Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE4D6]">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-[#8A8078]">
                          <Box size={32} className="mx-auto text-[#8A8078]/50 mb-2" />
                          <p className="text-sm font-semibold text-[#2B2420]">No craft products match your filters</p>
                          <p className="text-xs mt-1">Try changing your search query or reset the filters.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setInvSearch('');
                              setInvCategory('All');
                              setInvStockFilter('all');
                            }}
                            className="mt-3 rounded-lg bg-[#3C6E47] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#2F5838]"
                          >
                            Reset Filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map((item) => {
                        const stock = Number(item.inStock) || 0;
                        const thresh = item.minThreshold || 5;
                        const lineVal = stock * (Number(item.price) || 0);

                        return (
                          <tr key={item.id} className="hover:bg-[#FFFDF9] transition-colors">
                            {/* Product Info & Image */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-12 w-12 rounded-xl object-cover border border-[#EDE4D6] bg-[#F3E6D3] shrink-0"
                                />
                                <div>
                                  <Link
                                    to="/product"
                                    className="font-bold text-[#2B2420] hover:text-[#3C6E47] line-clamp-1 max-w-xs"
                                  >
                                    {item.name}
                                  </Link>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="font-mono text-[10px] text-[#8A8078] bg-[#F3E6D3]/60 px-1.5 py-0.5 rounded">
                                      {item.sku || `KS-ART-${item.id}`}
                                    </span>
                                    {item.badge && (
                                      <span className="text-[10px] text-[#B5652F] font-semibold">
                                        • {item.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category & Material */}
                            <td className="px-4 py-4">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-[#2B2420]">{item.category}</span>
                                <p className="text-[11px] text-[#8A8078] line-clamp-1">{item.material}</p>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-4">
                              <div className="font-bold text-[#2B2420]">${item.price}</div>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="text-[10px] text-[#8A8078] line-through">
                                  ${item.originalPrice}
                                </div>
                              )}
                            </td>

                            {/* Live Stock Level (+ / - controls) */}
                            <td className="px-4 py-4 text-center">
                              <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] p-1 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => adjustStock(item.id, -1)}
                                  disabled={stock <= 0}
                                  className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[#2B2420] hover:bg-[#F3E6D3] disabled:opacity-30 disabled:hover:bg-white text-xs font-bold transition-colors"
                                  title="Decrease by 1"
                                >
                                  -
                                </button>
                                
                                <input
                                  type="number"
                                  min="0"
                                  value={stock}
                                  onChange={(e) => updateStock(item.id, e.target.value)}
                                  className="w-12 text-center text-xs font-bold text-[#2B2420] focus:outline-none bg-transparent"
                                />

                                <button
                                  type="button"
                                  onClick={() => adjustStock(item.id, 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[#2B2420] hover:bg-[#F3E6D3] text-xs font-bold transition-colors"
                                  title="Increase by 1"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-[10px] text-[#8A8078] mt-1">
                                Min alert: {thresh}
                              </div>
                            </td>

                            {/* Stock Status Pill */}
                            <td className="px-4 py-4">
                              {stock <= 0 ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-700">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                                  Sold Out (0)
                                </span>
                              ) : stock <= thresh ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                                  <AlertTriangle size={11} />
                                  Low Stock ({stock})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF3EC] px-2.5 py-1 text-[11px] font-bold text-[#3C6E47]">
                                  <CheckCircle2 size={11} />
                                  In Stock ({stock})
                                </span>
                              )}
                            </td>

                            {/* Valuation */}
                            <td className="px-4 py-4 font-bold text-[#2B2420]">
                              ${lineVal.toLocaleString()}
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenRestock(item)}
                                  className="rounded-lg bg-[#EBF3EC] p-2 text-[#3C6E47] hover:bg-[#3C6E47] hover:text-white transition-colors"
                                  title="Quick Restock Batch"
                                >
                                  <RefreshCw size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(item)}
                                  className="rounded-lg border border-[#EDE4D6] bg-white p-2 text-[#2B2420] hover:bg-[#F3E6D3] transition-colors"
                                  title="Edit Craft Listing"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(item.id)}
                                  className="rounded-lg border border-[#EDE4D6] bg-white p-2 text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete Listing"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#EDE4D6] bg-[#FFFDF9] px-6 py-3.5 text-xs text-[#8A8078]">
                <span>
                  Showing {filteredInventory.length} of {products.length} craft inventory items
                </span>
                <div className="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
                  <span>Filtered Units: <strong>{filteredInventory.reduce((s, i) => s + (Number(i.inStock) || 0), 0)}</strong></span>
                  <span>Filtered Value: <strong>${filteredInventory.reduce((s, i) => s + (Number(i.inStock) || 0) * (Number(i.price) || 0), 0).toLocaleString()}</strong></span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CRAFT PRODUCTS & CATALOG MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#2B2420]">
                  Craft Product Catalog ({products.length} items)
                </h2>
                <p className="text-xs text-[#8A8078]">
                  Manage details, images, craft techniques, pricing, and heritage descriptions for each item.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3C6E47] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#2F5838] transition-all shadow-sm"
              >
                <Plus size={16} />
                <span>Add New Craft Product</span>
              </button>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EDE4D6] bg-white card-shadow card-shadow-hover transition-all"
                >
                  <div>
                    {/* Craft Photo with badge */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[#F3E6D3]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="rounded-full bg-[#3C6E47]/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white">
                          {item.badge || 'Handmade'}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md ${
                          (item.inStock || 0) <= 0
                            ? 'bg-rose-600 text-white'
                            : (item.inStock || 0) <= (item.minThreshold || 5)
                            ? 'bg-amber-500 text-white'
                            : 'bg-white/90 text-[#3C6E47]'
                        }`}>
                          {item.inStock} in stock
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#B5652F]">
                        {item.category}
                      </div>
                      
                      <h3 className="font-serif-heading text-base font-bold text-[#2B2420] mt-1 line-clamp-1 group-hover:text-[#3C6E47]">
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#8A8078] line-clamp-2 mt-1.5 leading-relaxed">
                        {item.description || item.story}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-[#EDE4D6] pt-3 text-xs">
                        <div>
                          <span className="text-base font-bold text-[#2B2420]">${item.price}</span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="ml-1.5 text-xs text-[#8A8078] line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-[#8A8078]">
                          {item.sku || `KS-P-${item.id}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="border-t border-[#EDE4D6] bg-[#FFFDF9] p-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#EDE4D6] bg-white py-1.5 text-xs font-bold text-[#2B2420] hover:bg-[#F3E6D3] transition-colors"
                    >
                      <Edit3 size={13} className="text-[#3C6E47]" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenRestock(item)}
                      className="rounded-xl border border-[#EDE4D6] bg-white p-2 text-[#3C6E47] hover:bg-[#EBF3EC] transition-colors"
                      title="Adjust Stock"
                    >
                      <RefreshCw size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="rounded-xl border border-[#EDE4D6] bg-white p-2 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STORE PROFILE & ARTISAN SETTINGS */}
        {activeTab === 'store' && (
          <div className="rounded-3xl border border-[#EDE4D6] bg-white p-6 sm:p-8 card-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE4D6] pb-5 mb-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#2B2420]">
                  Artisan Store Branding & Settings
                </h2>
                <p className="text-xs text-[#8A8078] mt-1">
                  Customize your storefront identity, workshop location, heritage certifications, and policies.
                </p>
              </div>

              {storeSavedNotice && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF3EC] px-3.5 py-1 text-xs font-bold text-[#3C6E47] animate-pulse">
                  <CheckCircle2 size={14} /> Changes Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveStoreProfile} className="space-y-6">
              
              {/* Basic Store Identity */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    Store / Studio Name
                  </label>
                  <input
                    type="text"
                    value={storeForm.storeName}
                    onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 px-3.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    Lead Artisan / Master Maker Name
                  </label>
                  <input
                    type="text"
                    value={storeForm.artisanName}
                    onChange={(e) => setStoreForm({ ...storeForm, artisanName: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 px-3.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                  Store Tagline / Heritage Motto
                </label>
                <input
                  type="text"
                  value={storeForm.tagline}
                  onChange={(e) => setStoreForm({ ...storeForm, tagline: e.target.value })}
                  className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 px-3.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                />
              </div>

              {/* Bio & Heritage Story */}
              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                  Artisan Studio Story & Craft Philosophy
                </label>
                <textarea
                  rows={3}
                  value={storeForm.bio}
                  onChange={(e) => setStoreForm({ ...storeForm, bio: e.target.value })}
                  className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] p-3.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Location & Certifications */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    Workshop Location / Region
                  </label>
                  <input
                    type="text"
                    value={storeForm.location}
                    onChange={(e) => setStoreForm({ ...storeForm, location: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 px-3.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    GI Tag / Certification Badge
                  </label>
                  <input
                    type="text"
                    value={storeForm.verifiedBadge}
                    onChange={(e) => setStoreForm({ ...storeForm, verifiedBadge: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 px-3.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    Standard Craft Turnaround / Lead Time
                  </label>
                  <input
                    type="text"
                    value={storeForm.leadTime}
                    onChange={(e) => setStoreForm({ ...storeForm, leadTime: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 px-3.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover & Avatar URLs */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    Store Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={storeForm.coverImage}
                    onChange={(e) => setStoreForm({ ...storeForm, coverImage: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 px-3.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    Artisan Avatar / Photo URL
                  </label>
                  <input
                    type="url"
                    value={storeForm.avatarImage}
                    onChange={(e) => setStoreForm({ ...storeForm, avatarImage: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 px-3.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>
              </div>

              {/* Announcement Bar Settings */}
              <div className="rounded-2xl border border-[#EDE4D6] bg-[#F3E6D3]/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#2B2420] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#B5652F]" /> Storefront Announcement Banner
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={storeForm.announcementActive}
                      onChange={(e) => setStoreForm({ ...storeForm, announcementActive: e.target.checked })}
                      className="rounded text-[#3C6E47] focus:ring-[#3C6E47]"
                    />
                    <span className="font-semibold text-[#2B2420]">Show on Storefront</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={storeForm.announcement}
                  onChange={(e) => setStoreForm({ ...storeForm, announcement: e.target.value })}
                  placeholder="e.g. Free handloom coaster set on orders above $80..."
                  className="w-full rounded-xl border border-[#EDE4D6] bg-white py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                />
              </div>

              {/* Direct Payout & Contact */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    UPI ID / Direct Artisan Settlement
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={storeForm.payoutUpi}
                      onChange={(e) => setStoreForm({ ...storeForm, payoutUpi: e.target.value })}
                      className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 pl-9 pr-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                    />
                    <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8078]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    WhatsApp Business / Phone
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={storeForm.whatsapp}
                      onChange={(e) => setStoreForm({ ...storeForm, whatsapp: e.target.value })}
                      className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 pl-9 pr-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                    />
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8078]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                    Instagram Handle / Website
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={storeForm.instagram}
                      onChange={(e) => setStoreForm({ ...storeForm, instagram: e.target.value })}
                      className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2.5 pl-9 pr-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                    />
                    <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8078]" />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDE4D6]">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3C6E47] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#2F5838] transition-all shadow-sm"
                >
                  <Save size={15} />
                  <span>Save Storefront Settings</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 4: ORDERS & DISPATCH */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#2B2420]">
                  Artisan Orders & Shipping Pipeline
                </h2>
                <p className="text-xs text-[#8A8078]">
                  Track incoming buyer orders, pack items, update dispatch statuses, and print packing slips.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl border border-[#EDE4D6] bg-white p-5 sm:p-6 card-shadow space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE4D6] pb-4 text-xs">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#3C6E47] bg-[#EBF3EC] px-2.5 py-1 rounded-md">
                        {ord.id}
                      </span>
                      <span className="text-[#8A8078] ml-2">Placed on {ord.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#2B2420]">${ord.total}.00</span>
                      
                      {/* Status Dropdown */}
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-xs font-bold border focus:outline-none cursor-pointer ${
                          ord.status === 'Delivered'
                            ? 'bg-[#EBF3EC] text-[#3C6E47] border-[#3C6E47]/30'
                            : ord.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : ord.status === 'Ready to Ship'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Processing">🟡 Processing & Packing</option>
                        <option value="Ready to Ship">🟣 Ready to Ship</option>
                        <option value="In Transit">🔵 In Transit</option>
                        <option value="Delivered">🟢 Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer & Item details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-[#2B2420]">
                        Customer: {ord.customer} <span className="font-normal text-[#8A8078]">({ord.email})</span>
                      </p>
                      <p className="text-[11px] text-[#8A8078] mt-0.5 flex items-center gap-1">
                        <MapPin size={12} className="text-[#3C6E47]" /> Destination: {ord.city}
                      </p>
                      <p className="text-[11px] text-[#8A8078] mt-0.5">
                        Tracking Code: <strong className="font-mono text-[#2B2420]">{ord.trackingId}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewOrderSlip(ord)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDE4D6] bg-white px-3.5 py-2 text-xs font-bold text-[#2B2420] hover:bg-[#F3E6D3] transition-colors"
                      >
                        <Printer size={14} className="text-[#3C6E47]" />
                        <span>Print Shipping Slip</span>
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="rounded-xl bg-[#FFFDF9] border border-[#EDE4D6] p-3 divide-y divide-[#EDE4D6]/60">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 text-xs first:pt-0 last:pb-0">
                        <span className="font-medium text-[#2B2420]">
                          {it.quantity}x {it.name}
                        </span>
                        <span className="font-bold text-[#2B2420]">${it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AI CRAFT ASSISTANT */}
        {activeTab === 'ai-assist' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 rounded-3xl border border-[#EDE4D6] bg-white p-6 sm:p-8 card-shadow space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E6D3] px-3 py-1 text-xs font-bold text-[#B5652F] mb-2">
                  <Sparkles size={14} /> AI Studio Assistant
                </div>
                <h2 className="font-serif-heading text-2xl font-bold text-[#2B2420]">
                  Craft Heritage Storyteller & Copywriter
                </h2>
                <p className="text-xs text-[#8A8078] mt-1 leading-relaxed">
                  Enter your raw materials and region. Our craft AI generates poetic storytelling, marketing descriptions, and fair pricing suggestions tailored for global craft connoisseurs.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Craft Title / Item Name
                  </label>
                  <input
                    type="text"
                    value={aiCraftType}
                    onChange={(e) => setAiCraftType(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                    placeholder="e.g. Stoneware Ceramic Pitcher"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Materials & Firing / Weaving Technique
                  </label>
                  <input
                    type="text"
                    value={aiMaterial}
                    onChange={(e) => setAiMaterial(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                    placeholder="e.g. Alluvial clay, wood-ash glaze, 36h reduction firing"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Origin Region & Heritage Context
                  </label>
                  <input
                    type="text"
                    value={aiRegion}
                    onChange={(e) => setAiRegion(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                    placeholder="e.g. Khurja, Uttar Pradesh"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiStory}
                  disabled={aiGenerating}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#3C6E47] py-3 text-xs font-bold text-white hover:bg-[#2F5838] transition-all shadow-sm"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Generating Poetic Heritage Story...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>Generate Story & Listing Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Result Card */}
            <div className="lg:col-span-6 rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-6 sm:p-8 card-shadow flex flex-col justify-between">
              {aiResult ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-3">
                    <span className="text-xs font-bold text-[#3C6E47] flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> AI Generated Craft Copy
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${aiResult.title}\n\n${aiResult.description}\n\n${aiResult.story}`)}
                      className="text-xs font-semibold text-[#8A8078] hover:text-[#2B2420] flex items-center gap-1"
                    >
                      <Copy size={13} /> Copy All
                    </button>
                  </div>

                  <div>
                    <h3 className="font-serif-heading text-lg font-bold text-[#2B2420]">
                      {aiResult.title}
                    </h3>
                    <p className="text-xs text-[#8A8078] mt-1 font-mono">
                      Suggested Valuation: <strong className="text-[#3C6E47]">{aiResult.suggestedPrice}</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8078]">
                      Product Description
                    </span>
                    <p className="text-xs text-[#2B2420] leading-relaxed bg-white border border-[#EDE4D6] p-3.5 rounded-xl">
                      {aiResult.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8078]">
                      Heritage & Maker Story
                    </span>
                    <p className="text-xs text-[#2B2420] leading-relaxed bg-white border border-[#EDE4D6] p-3.5 rounded-xl italic">
                      "{aiResult.story}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {aiResult.tags.map((tg, i) => (
                      <span key={i} className="rounded-md bg-[#F3E6D3] px-2 py-0.5 text-[10px] font-bold text-[#B5652F]">
                        {tg}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleOpenAddModal();
                      setProductForm({
                        ...defaultProductForm,
                        name: aiResult.title,
                        description: aiResult.description,
                        story: aiResult.story,
                        material: aiMaterial,
                      });
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#B5652F] py-2.5 text-xs font-bold text-white hover:bg-[#985121] transition-all shadow-xs"
                  >
                    <Plus size={15} />
                    <span>Create Product Listing With This Copy</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full py-12 text-[#8A8078]">
                  <Sparkles size={36} className="text-[#B5652F]/40 mb-3" />
                  <h4 className="font-bold text-[#2B2420] text-sm">Awaiting Craft Inputs</h4>
                  <p className="text-xs max-w-xs mt-1">
                    Fill in your item title, materials, and region on the left and click Generate to see your storytelling copy here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* 5. MODAL: ADD / EDIT CRAFT PRODUCT */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#EDE4D6] bg-white p-6 sm:p-8 card-shadow my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EBF3EC] text-[#3C6E47]">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="font-serif-heading text-lg font-bold text-[#2B2420]">
                    {editingProduct ? 'Edit Craft Product' : 'Add New Craft Product to Studio'}
                  </h3>
                  <p className="text-xs text-[#8A8078]">
                    {editingProduct ? `Updating SKU: ${editingProduct.sku || editingProduct.id}` : 'Create a new handcrafted piece in your catalog'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="rounded-full p-1.5 text-[#8A8078] hover:bg-[#F3E6D3] hover:text-[#2B2420]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1">
                  Craft Name / Title *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Hand-Thrown Speckled Stoneware Planter"
                  className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none font-semibold"
                  required
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Craft Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  >
                    {CRAFT_CATEGORIES.filter(c => c !== 'All Crafts').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Craft Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="e.g. Hand-Thrown, Limited Batch, GI Certified"
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing & Stock Details */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-[#F3E6D3]/30 p-3.5 rounded-2xl border border-[#EDE4D6]">
                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-white py-1.5 px-2.5 text-xs text-[#2B2420] font-bold focus:border-[#3C6E47] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-white py-1.5 px-2.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-white py-1.5 px-2.5 text-xs text-[#2B2420] font-bold focus:border-[#3C6E47] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.minThreshold}
                    onChange={(e) => setProductForm({ ...productForm, minThreshold: e.target.value })}
                    className="w-full rounded-xl border border-[#EDE4D6] bg-white py-1.5 px-2.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>
              </div>

              {/* Material & Technique */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Natural Materials Used
                  </label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    placeholder="e.g. 100% Himalayan Merino Wool & Wild Silk"
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Crafting Technique / Method
                  </label>
                  <input
                    type="text"
                    value={productForm.technique}
                    onChange={(e) => setProductForm({ ...productForm, technique: e.target.value })}
                    placeholder="e.g. Pit Loom Weaving, Wood-Ash Fired"
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>
              </div>

              {/* Dimensions & Lead Time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    placeholder="e.g. H 9.5&quot; × W 5.2&quot;"
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={productForm.weight}
                    onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                    placeholder="e.g. 1.2 kg"
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2420] mb-1">
                    Shipping Lead Time
                  </label>
                  <input
                    type="text"
                    value={productForm.leadTime}
                    onChange={(e) => setProductForm({ ...productForm, leadTime: e.target.value })}
                    placeholder="e.g. Ships in 2-3 days"
                    className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1">
                  Craft Image URL
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="flex-1 rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="h-9 w-9 rounded-lg object-cover border border-[#EDE4D6]"
                    />
                  )}
                </div>
              </div>

              {/* Description & Story */}
              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed craft specifications and sensory attributes..."
                  className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] p-2.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1">
                  Heritage & Artisan Story
                </label>
                <textarea
                  rows={2}
                  value={productForm.story}
                  onChange={(e) => setProductForm({ ...productForm, story: e.target.value })}
                  placeholder="Generational story, cultural lineage, and making process..."
                  className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] p-2.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[#EDE4D6] pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="rounded-xl border border-[#EDE4D6] bg-white px-4 py-2 text-xs font-bold text-[#2B2420] hover:bg-[#F3E6D3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3C6E47] px-6 py-2 text-xs font-bold text-white hover:bg-[#2F5838] shadow-sm"
                >
                  {editingProduct ? 'Update Craft Listing' : 'Publish Craft to Catalog'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: QUICK RESTOCK BATCH */}
      {isRestockModalOpen && restockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-[#EDE4D6] bg-white p-6 card-shadow">
            
            <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EBF3EC] text-[#3C6E47]">
                  <RefreshCw size={16} />
                </div>
                <div>
                  <h3 className="font-serif-heading text-base font-bold text-[#2B2420]">
                    Restock Workshop Batch
                  </h3>
                  <p className="text-[11px] text-[#8A8078]">Add finished pieces to inventory</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRestockModalOpen(false)}
                className="rounded-full p-1 text-[#8A8078] hover:bg-[#F3E6D3]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-[#F3E6D3]/40 p-3 border border-[#EDE4D6]">
                <img
                  src={restockProduct.image}
                  alt={restockProduct.name}
                  className="h-12 w-12 rounded-xl object-cover border border-[#EDE4D6]"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#2B2420] line-clamp-1">{restockProduct.name}</h4>
                  <p className="text-[11px] text-[#8A8078]">
                    Current Stock: <strong>{restockProduct.inStock} units</strong>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                  Units Produced to Add (+):
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRestockUnits(num)}
                      className={`rounded-xl py-1.5 text-xs font-bold border transition-colors ${
                        restockUnits === num
                          ? 'bg-[#3C6E47] text-white border-[#3C6E47]'
                          : 'bg-[#FFFDF9] text-[#2B2420] border-[#EDE4D6] hover:bg-[#F3E6D3]'
                      }`}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  value={restockUnits}
                  onChange={(e) => setRestockUnits(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] font-bold focus:border-[#3C6E47] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1">
                  Workshop Batch Note / Reason
                </label>
                <input
                  type="text"
                  value={restockNote}
                  onChange={(e) => setRestockNote(e.target.value)}
                  className="w-full rounded-xl border border-[#EDE4D6] bg-[#FFFDF9] py-2 px-3 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-[#EBF3EC] p-3 text-xs text-[#3C6E47] font-semibold flex items-center justify-between">
                <span>New Total Inventory:</span>
                <span className="text-sm font-bold">
                  {(restockProduct.inStock || 0) + Number(restockUnits)} units
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="rounded-xl border border-[#EDE4D6] bg-white px-4 py-2 text-xs font-bold text-[#2B2420] hover:bg-[#F3E6D3]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRestock}
                  className="rounded-xl bg-[#3C6E47] px-5 py-2 text-xs font-bold text-white hover:bg-[#2F5838]"
                >
                  Confirm Restock
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. MODAL: DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#EDE4D6] bg-white p-6 card-shadow text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#2B2420]">
                Remove Craft Listing?
              </h3>
              <p className="text-xs text-[#8A8078] mt-1">
                This will delete the craft product from your inventory and store catalog.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-[#EDE4D6] bg-white px-4 py-2 text-xs font-bold text-[#2B2420] hover:bg-[#F3E6D3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: SHIPPING PACKING SLIP PREVIEW */}
      {viewOrderSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#EDE4D6] bg-white p-6 sm:p-8 card-shadow my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-3 mb-4">
              <span className="font-serif-heading font-bold text-[#2B2420] text-base">
                Artisan Dispatch Packing Slip
              </span>
              <button
                type="button"
                onClick={() => setViewOrderSlip(null)}
                className="rounded-full p-1 text-[#8A8078] hover:bg-[#F3E6D3]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Slip Design */}
            <div className="space-y-4 rounded-2xl border border-dashed border-[#EDE4D6] bg-[#FFFDF9] p-5 text-xs text-[#2B2420]">
              <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-3">
                <div>
                  <h4 className="font-serif-heading font-bold text-lg text-[#2B2420]">KlaSetu.</h4>
                  <p className="text-[10px] text-[#8A8078]">Authentic Master Crafts Dispatch</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#3C6E47]">{viewOrderSlip.id}</span>
                  <p className="text-[10px] text-[#8A8078]">{viewOrderSlip.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-[#EDE4D6] pb-3 text-[11px]">
                <div>
                  <span className="font-bold text-[#8A8078] uppercase">From (Artisan Studio):</span>
                  <p className="font-bold text-[#2B2420] mt-0.5">{storeProfile?.storeName}</p>
                  <p className="text-[#8A8078]">{storeProfile?.location}</p>
                  <p className="text-[#8A8078]">GI Reg: {storeProfile?.giTagNumber}</p>
                </div>
                <div>
                  <span className="font-bold text-[#8A8078] uppercase">Ship To (Buyer):</span>
                  <p className="font-bold text-[#2B2420] mt-0.5">{viewOrderSlip.customer}</p>
                  <p className="text-[#8A8078]">{viewOrderSlip.city}</p>
                  <p className="text-[#8A8078]">Courier: {viewOrderSlip.trackingId}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-[#8A8078] uppercase text-[10px] block mb-2">
                  Enclosed Handcrafted Items:
                </span>
                <div className="space-y-1.5">
                  {viewOrderSlip.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-[#EDE4D6]/50 last:border-0">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-bold">${it.price * it.quantity}.00</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#EDE4D6] pt-3 flex justify-between font-bold text-sm">
                <span>Total Paid by Buyer:</span>
                <span className="text-[#3C6E47]">${viewOrderSlip.total}.00</span>
              </div>

              <div className="rounded-xl bg-[#F3E6D3]/60 p-2.5 text-[10px] text-center text-[#8A8078]">
                Certified 100% Handcrafted Artisan Heritage Item • Protected under Fair-Trade Guild Standard
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setViewOrderSlip(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C6E47] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#2F5838]"
              >
                <Printer size={15} />
                <span>Print Packing Slip</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
