export type UserRole = 'admin' | 'manager' | 'supplier';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number; // stock_quantity
  threshold: number; // threshold_level
  category: string;
  sku?: string;
  unit?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'partial';

export interface Order {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  totalAmount?: number;
  supplierId?: number;
  supplier?: User;
  requestedBy?: number;
  requestedByUser?: User;
  createdAt: string;
  updatedAt: string;
  expectedDeliveryDate?: string;
  paidAt?: string;
}

export type NotificationType = 'LOW_STOCK' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'SYSTEM';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  userId?: number;
  productId?: number;
  orderId?: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  lowStock?: boolean;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  supplierId?: number;
}

export interface MonthlyConsumptionReport {
  month: string;
  productId: number;
  productName: string;
  quantity: number;
  totalValue: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface UserSettings {
  id?: number;
  userId: number;
  // Notification Preferences
  emailNotifications: boolean;
  smsNotifications: boolean;
  lowStockAlerts: boolean;
  orderUpdates: boolean;
  paymentReminders: boolean;
  // Auto-refill Configuration
  autoRefillEnabled: boolean;
  autoRefillInterval: number; // in seconds
  autoRefillQuantityMultiplier: number; // multiplier for threshold
  // User Preferences
  theme: 'light' | 'dark' | 'auto';
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  itemsPerPage: number;
  // Search History
  searchHistory: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GlobalSearchResult {
  type: 'product' | 'order' | 'user' | 'notification';
  id: number;
  title: string;
  description?: string;
  url: string;
  metadata?: Record<string, any>;
}

