import axios from "axios";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically to every request if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("klasetu_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to resolve images (either relative bucket path or absolute web URL)
export const getImageUrl = (path) => {
  if (!path) return "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  // If it's a bucket path like /bucket/xyz.webp or output_image.webp
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
};

// ==================== AUTH APIs ====================
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post("/user/login", { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/user/register", userData);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/user/me");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put("/user/me", profileData);
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.get("/user/logout");
    } catch {
      // ignore
    }
  },
};

// ==================== MARKET & PRODUCT APIs ====================
export const marketAPI = {
  getProducts: async ({ category, search, artisan_id } = {}) => {
    const params = {};
    if (category && category !== "All Crafts" && category !== "All") params.category = category;
    if (search && search.trim()) params.search = search.trim();
    if (artisan_id) params.artisan_id = artisan_id;
    const response = await apiClient.get("/market/products", { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await apiClient.get(`/market/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await apiClient.post("/market/products", productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/market/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/market/products/${id}`);
    return response.data;
  },

  updateStock: async (id, in_stock) => {
    const response = await apiClient.put(`/market/products/${id}/stock`, {
      in_stock: Number(in_stock),
    });
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/market/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Orders
  getOrders: async () => {
    const response = await apiClient.get("/market/orders");
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await apiClient.post("/market/orders", orderData);
    return response.data;
  },

  updateOrderStatus: async (orderId, status, tracking_id) => {
    const response = await apiClient.put(`/market/orders/${orderId}/status`, {
      status,
      tracking_id,
    });
    return response.data;
  },
};

// ==================== AI PIPELINE APIs ====================
export const pipelineAPI = {
  processProduct: async ({ imageFile, audioBlob, language = "hi", materialCost = 0, labourCost = 0, title = "", category = "" }) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    // Audio file handling
    if (audioBlob instanceof Blob || audioBlob instanceof File) {
      formData.append("audio", audioBlob, "craft_voice.ogg");
    } else {
      // Fallback dummy audio buffer if recording wasn't captured
      const dummyOgg = new Blob(["OggS"], { type: "audio/ogg" });
      formData.append("audio", dummyOgg, "craft_voice.ogg");
    }

    formData.append("language", language || "hi");
    formData.append("material_cost", Number(materialCost) || 0);
    formData.append("labour_cost", Number(labourCost) || 0);
    formData.append("title", title || "");
    formData.append("category", category || "");

    const response = await apiClient.post("/api/process-product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  priceOnly: async (materialCost, labourCost, category = "other") => {
    const formData = new FormData();
    formData.append("material_cost", Number(materialCost) || 0);
    formData.append("labour_cost", Number(labourCost) || 0);
    formData.append("category", category);
    const response = await apiClient.post("/api/price-only", formData);
    return response.data;
  },
};

export default apiClient;