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
