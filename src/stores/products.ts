// =========================================
// Products Store - Menu & Categories
// =========================================

import { atom, computed } from "nanostores";
import {
  getPublicProducts,
  getPublicCategories,
  type Product,
  type Category,
} from "@/lib/api";

// ===== State =====

export const products = atom<Product[]>([]);
export const categories = atom<Category[]>([]);
export const isLoading = atom(false);
export const error = atom<string | null>(null);
export const selectedCategory = atom<string | null>(null);
export const searchQuery = atom("");

// ===== Computed =====

export const filteredProducts = computed(
  [products, selectedCategory, searchQuery],
  (allProducts, category, query) => {
    let result = allProducts;

    // Filter only available products
    result = result.filter((p) => p.available !== false);

    // Filter by category
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(lowerQuery));
    }

    return result;
  }
);

// ===== Actions =====

export async function loadProducts() {
  isLoading.set(true);
  error.set(null);

  try {
    const data = await getPublicProducts();
    products.set(data);
  } catch (err) {
    error.set(err instanceof Error ? err.message : "Gagal memuat menu");
  } finally {
    isLoading.set(false);
  }
}

export async function loadCategories() {
  try {
    const data = await getPublicCategories();
    categories.set(data);
  } catch (err) {
    console.error("Gagal memuat kategori:", err);
  }
}

export function setCategory(categoryName: string | null) {
  selectedCategory.set(categoryName);
}

export function setSearchQuery(query: string) {
  searchQuery.set(query);
}

export async function initializeProducts() {
  await Promise.all([loadProducts(), loadCategories()]);
}

// Re-export types
export type { Product, Category };
