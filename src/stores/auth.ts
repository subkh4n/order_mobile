// =========================================
// Auth Store - Customer Authentication
// =========================================

import { atom, computed } from "nanostores";
import { customerLogin, customerRegister, type Customer } from "@/lib/api";

// ===== State =====

export const customer = atom<Customer | null>(null);
export const isAuthLoading = atom(false);
export const authError = atom<string | null>(null);

// Computed
export const isLoggedIn = computed(customer, (c) => c !== null);

// ===== Storage Keys =====
const STORAGE_KEY = "order_mobile_customer";

// ===== Actions =====

/**
 * Initialize auth from localStorage
 */
export function initAuth(): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      customer.set(data);
    }
  } catch (error) {
    console.error("Failed to restore auth:", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Save customer to localStorage
 */
function saveToStorage(data: Customer | null): void {
  if (typeof window === "undefined") return;

  if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Login customer
 */
export async function login(phone: string, password: string): Promise<boolean> {
  if (!phone.trim() || !password.trim()) {
    authError.set("Nomor HP dan password harus diisi");
    return false;
  }

  isAuthLoading.set(true);
  authError.set(null);

  try {
    const response = await customerLogin({ phone, password });

    if (response.success && response.data?.customer) {
      const customerData = response.data.customer;
      customer.set(customerData);
      saveToStorage(customerData);
      return true;
    } else {
      authError.set(response.message || "Login gagal");
      return false;
    }
  } catch (error) {
    authError.set(error instanceof Error ? error.message : "Login gagal");
    return false;
  } finally {
    isAuthLoading.set(false);
  }
}

/**
 * Register new customer
 */
export async function register(data: {
  name: string;
  phone: string;
  password: string;
  email?: string;
  address?: string;
}): Promise<boolean> {
  if (!data.name.trim()) {
    authError.set("Nama harus diisi");
    return false;
  }

  if (!data.phone.trim()) {
    authError.set("Nomor HP harus diisi");
    return false;
  }

  if (!data.password.trim() || data.password.length < 6) {
    authError.set("Password minimal 6 karakter");
    return false;
  }

  isAuthLoading.set(true);
  authError.set(null);

  try {
    const response = await customerRegister(data);

    if (response.success && response.data?.customer) {
      const customerData = response.data.customer;
      customer.set(customerData);
      saveToStorage(customerData);
      return true;
    } else {
      authError.set(response.message || "Registrasi gagal");
      return false;
    }
  } catch (error) {
    authError.set(error instanceof Error ? error.message : "Registrasi gagal");
    return false;
  } finally {
    isAuthLoading.set(false);
  }
}

/**
 * Logout customer
 */
export function logout(): void {
  customer.set(null);
  saveToStorage(null);
}

/**
 * Get current customer data
 */
export function getCustomer(): Customer | null {
  return customer.get();
}

/**
 * Check if customer is authenticated
 */
export function checkAuth(): boolean {
  return customer.get() !== null;
}
