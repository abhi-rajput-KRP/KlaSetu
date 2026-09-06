import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Local machine Wi-Fi IP address detected from your Windows network
export const LOCAL_DEV_IP = '192.168.29.14';

function getDefaultHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:8000`;
    }
  }
  return `http://${LOCAL_DEV_IP}:8000`;
}

export let API_BASE_URL = getDefaultHost();

export const setCustomBaseUrl = (newUrl) => {
  if (newUrl) {
    API_BASE_URL = newUrl.replace(/\/+$/, '');
    apiClient.defaults.baseURL = API_BASE_URL;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Resolves an image path from backend into a full URL accessible on mobile.
 */
export const resolveImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.replace(/^\/+/, '');
  return `${API_BASE_URL}/${cleanPath}`;
};

// ==================== AUTH API ====================
export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/user/login', { email, password });
    return res.data;
  },

  register: async ({ email, password, full_name, role = 'buyer' }) => {
    const res = await apiClient.post('/user/register', {
      email,
      password,
      full_name,
      role,
    });
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/user/me');
    return res.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/user/logout');
    } catch (e) {
      // Ignored if token was already invalidated
    } finally {
      setAuthToken(null);
    }
  },
};

// ==================== MARKET / PRODUCTS API ====================
export const marketApi = {
  getProducts: async (params = {}) => {
    const res = await apiClient.get('/market/products', { params });
    return res.data;
  },

  getProduct: async (id) => {
    const res = await apiClient.get(`/market/products/${id}`);
    return res.data;
  },

  createProduct: async (productData) => {
    const res = await apiClient.post('/market/products', productData);
    return res.data;
  },

  updateProduct: async (id, productData) => {
    const res = await apiClient.put(`/market/products/${id}`, productData);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await apiClient.delete(`/market/products/${id}`);
    return res.data;
  },

  uploadImage: async (formData) => {
    const res = await apiClient.post('/market/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getOrders: async () => {
    const res = await apiClient.get('/market/orders');
    return res.data;
  },

  createOrder: async (orderData) => {
    const res = await apiClient.post('/market/orders', orderData);
    return res.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await apiClient.put(`/market/orders/${orderId}/status`, { status });
    return res.data;
  },

  processProduct: async (formData) => {
    const res = await apiClient.post('/api/process-product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });
    return res.data;
  },
};

export default apiClient;
