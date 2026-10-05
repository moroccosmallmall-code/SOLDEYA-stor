export type UserRole = 'owner' | 'customer' | 'visitor';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export interface ProductMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  colorHex?: string;
  colorName?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  mediaIndex?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  principalPrice: number; // e.g. 199 DH
  comparePrice: number;   // Principal * 330 / 199
  wholesalePrice: number; // Principal * 150 / 199
  media: ProductMedia[];
  colors: ProductColor[];
  inventory: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  tags?: string[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  selectedColor?: string;
  selectedColorHex?: string;
  mediaUrl: string;
}

export interface Order {
  id: string;
  orderReference: string; // e.g. SLD-2026-XXXX
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  isWholesale: boolean;
  notes?: string;
  status: 'جديد' | 'قيد التأكيد' | 'تم الشحن' | 'تم التسليم' | 'ملغى';
  createdAt: string;
  syncStatus: 'synced' | 'pending' | 'failed';
  syncedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  currency: string;
  googleSheetId: string;
  googleSheetSyncEnabled: boolean;
  theme: 'light' | 'dark';
  language: 'darija' | 'fr' | 'en';
}
