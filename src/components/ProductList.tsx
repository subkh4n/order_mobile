// =========================================
// ProductList Component - Dark Theme
// =========================================

import React, { useEffect } from "react";
import { useStore } from "@nanostores/react";
import ProductCard from "./ProductCard";
import {
  filteredProducts,
  isLoading,
  error,
  categories,
  selectedCategory,
  searchQuery,
  loadProducts,
  loadCategories,
  setCategory,
  setSearchQuery,
} from "@/stores/products";

export default function ProductList() {
  const $products = useStore(filteredProducts);
  const $isLoading = useStore(isLoading);
  const $error = useStore(error);
  const $categories = useStore(categories);
  const $selectedCategory = useStore(selectedCategory);
  const $searchQuery = useStore(searchQuery);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Loading State
  if ($isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[var(--text-secondary)]">Memuat menu...</p>
      </div>
    );
  }

  // Error State
  if ($error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-16 h-16 bg-[var(--error-bg)] rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">😔</span>
        </div>
        <p className="text-[var(--error)] font-medium mb-2">
          Gagal memuat menu
        </p>
        <p className="text-[var(--text-muted)] text-sm mb-4">{$error}</p>
        <button
          onClick={() => loadProducts()}
          className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Cari menu lezat..."
            value={$searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => setCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            !$selectedCategory
              ? "bg-[var(--accent)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/30"
              : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-light)]"
          }`}
        >
          Semua
        </button>
        {$categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              $selectedCategory === cat.name
                ? "bg-[var(--accent)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/30"
                : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-light)]"
            }`}
          >
            {cat.icon && <span className="mr-1">{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Section Title */}
      {$selectedCategory && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {$selectedCategory}
          </h2>
          <span className="text-sm text-[var(--text-muted)]">
            {$products.length} menu
          </span>
        </div>
      )}

      {/* Empty State */}
      {$products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <p className="text-[var(--text-secondary)]">
            {$searchQuery || $selectedCategory
              ? "Tidak ada menu yang cocok"
              : "Belum ada menu tersedia"}
          </p>
        </div>
      ) : (
        /* Menu Grid */
        <div className="grid grid-cols-2 gap-3">
          {$products.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              category={item.category}
              stock={item.stock}
              available={item.available}
            />
          ))}
        </div>
      )}
    </div>
  );
}
