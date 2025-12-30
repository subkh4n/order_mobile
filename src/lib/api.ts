// =========================================
// API Client - Online Order Mobile
// =========================================

// API Configuration
const API_URL =
  import.meta.env.PUBLIC_API_URL ||
  "https://script.google.com/macros/s/AKfycby3OiSFRmlTAt_qt2YWm-v6n7-EHoHWscwU-gIVi7rBZTEieWyMFIBxoIS3dQgRQ8D3ig/exec";

// ===== Types =====

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  stockType: string;
  available: boolean;
  image?: string;
}

export interface Category {
  name: string;
  icon?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  note?: string;
}

export interface OnlineOrder {
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "COD" | "QRIS" | "TRANSFER";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "COOKING"
    | "READY"
    | "COMPLETED"
    | "CANCELLED";
  queueNumber?: number;
  estimatedTime?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ===== API Helper =====

async function apiPost<T>(
  action: string,
  body: Record<string, unknown> = {}
): Promise<ApiResponse<T>> {
  try {
    // Google Apps Script requires special handling for CORS
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain", // Use text/plain to avoid preflight
      },
      body: JSON.stringify({ action, ...body }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Normalize response format
    if (data.success !== undefined) {
      // If data property is missing but success is true, wrap the rest as data
      if (data.success && data.data === undefined) {
        const { success, message, ...rest } = data;
        // If there are other properties besides success/message, treat them as the payload
        if (Object.keys(rest).length > 0) {
          return { success: true, message: message as string, data: rest as T };
        }
      }
      return data as ApiResponse<T>;
    }

    // Handle legacy format
    if (data.status === "success") {
      return { success: true, data: data.data || data };
    }

    if (data.status === "error") {
      return { success: false, message: data.message };
    }

    // Handle direct data response
    if (
      data.items ||
      data.categories ||
      data.orders ||
      data.customer ||
      data.order
    ) {
      return { success: true, data: data as T };
    }

    return { success: true, data: data as T };
  } catch (error) {
    console.error(`API Error (${action}):`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}

// ===== Public API Functions =====

/**
 * Get public products (no auth required)
 */
export async function getPublicProducts(): Promise<Product[]> {
  const response = await apiPost<{ items: Product[] }>("getPublicProducts");

  if (response.success && response.data) {
    // Handle both formats
    const items = response.data.items || response.data;
    return Array.isArray(items) ? items : [];
  }

  return [];
}

/**
 * Get public categories (no auth required)
 */
export async function getPublicCategories(): Promise<Category[]> {
  const response = await apiPost<{ categories: Category[] }>(
    "getPublicCategories"
  );

  if (response.success && response.data) {
    const categories = response.data.categories || response.data;
    return Array.isArray(categories) ? categories : [];
  }

  return [];
}

// ===== Customer Authentication =====

/**
 * Register new customer
 */
export async function customerRegister(data: {
  name: string;
  phone: string;
  password: string;
  email?: string;
  address?: string;
}): Promise<ApiResponse<{ customer: Customer }>> {
  return apiPost("customerRegister", data);
}

/**
 * Login customer
 */
export async function customerLogin(data: {
  phone: string;
  password: string;
}): Promise<ApiResponse<{ customer: Customer }>> {
  return apiPost("customerLogin", data);
}

// ===== Online Orders =====

/**
 * Create new online order
 */
export async function createOnlineOrder(data: {
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "COD" | "QRIS" | "TRANSFER";
  notes?: string;
}): Promise<
  ApiResponse<{
    orderId: string;
    queueNumber: number;
    estimatedTime: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
  }>
> {
  return apiPost("createOnlineOrder", data);
}

/**
 * Get customer orders
 */
export async function getOnlineOrders(
  customerId: string
): Promise<OnlineOrder[]> {
  const response = await apiPost<{ orders: OnlineOrder[] }>("getOnlineOrders", {
    customerId,
  });

  if (response.success && response.data) {
    const orders = response.data.orders || response.data;
    return Array.isArray(orders) ? orders : [];
  }

  return [];
}

/**
 * Track order status (no auth required)
 */
export async function getOrderTracking(orderId: string): Promise<
  ApiResponse<{
    order: OnlineOrder;
  }>
> {
  return apiPost("getOrderTracking", { orderId });
}

// ===== Utility Functions =====

/**
 * Format price to IDR
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Get order status label in Indonesian
 */
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Menunggu Konfirmasi",
    CONFIRMED: "Dikonfirmasi",
    COOKING: "Sedang Diproses",
    READY: "Siap Diambil",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
  };
  return labels[status] || status;
}

/**
 * Get payment status label in Indonesian
 */
export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Menunggu Pembayaran",
    PAID: "Sudah Dibayar",
    FAILED: "Pembayaran Gagal",
  };
  return labels[status] || status;
}

// ===== Legacy API Support =====
// For backward compatibility with old components

export async function fetchProducts(): Promise<Product[]> {
  return getPublicProducts();
}

export async function fetchCategories(): Promise<Category[]> {
  return getPublicCategories();
}

export { type OrderItem as LegacyOrderItem };
