export interface Product {
  id: number;
  name: string;
  maker: string;
  location?: string;
  category?: string;
  material: string;
  technique?: string;
  price: number;
  originalPrice?: number;
  original?: number;
  rating: number;
  reviewsCount?: number;
  reviews?: number;
  badge?: string;
  isFeatured?: boolean;
  inStock?: number;
  leadTime?: string;
  image: string;
  img?: string;
  gallery?: string[];
  description?: string;
  story?: string;
  dimensions?: string;
  weight?: string;
  sku?: string;
  minThreshold?: number;
  status?: 'active' | 'out_of_stock' | string;
  costPrice?: number;
  salesCount?: number;
}

export interface ArtisanMaker {
  id: string;
  name: string;
  studio: string;
  location: string;
  craft: string;
  experience: string;
  photo: string;
  quote: string;
}

export interface CartItem {
  id: number;
  item: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  city: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Ready to Ship' | 'In Transit' | 'Delivered' | string;
  date: string;
  trackingId: string;
}

export interface StoreProfile {
  storeName: string;
  artisanName: string;
  tagline: string;
  location: string;
  bio: string;
  categorySpecialty: string;
  yearsActive: string;
  rating: number;
  reviewsCount: number;
  verifiedBadge: string;
  giTagNumber: string;
  announcement: string;
  announcementActive: boolean;
  isOpen: boolean;
  leadTime: string;
  instagram: string;
  whatsapp: string;
  email: string;
  payoutUpi: string;
  coverImage: string;
  avatarImage: string;
}
