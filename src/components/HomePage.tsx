// =========================================
// HomePage Component - FlavorDash Design Pattern
// =========================================

import React, { useEffect, useState } from "react";
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
  products,
} from "@/stores/products";
import { customer, initAuth } from "@/stores/auth";

// Helper to get image URL
function getImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.includes("lh3.googleusercontent.com")) return url;
  if (url.includes("uc?export=view")) {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match) return `https://lh3.googleusercontent.com/d/${match[1]}`;
    return url;
  }
  let fileId: string | null = null;
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    fileId = match ? match[1] : null;
  } else if (url.includes("drive.google.com/open?id=")) {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    fileId = match ? match[1] : null;
  }
  if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
  return url;
}

const ITEMS_PER_PAGE = 6;

// Category icons mapping
const categoryIcons: Record<string, string> = {
  Food: "🍔",
  Drinks: "🥤",
  Snack: "🍿",
  Dessert: "🍰",
  Nasi: "🍚",
  Mie: "🍜",
  Ayam: "🍗",
  Seafood: "🦐",
  Minuman: "☕",
  Extra: "🎁",
  Donasi: "❤️",
  Services: "🛎️",
  default: "🍽️",
};

const getCategoryIcon = (name: string) =>
  categoryIcons[name] || categoryIcons["default"];

export default function HomePage() {
  const $products = useStore(filteredProducts);
  const $isLoading = useStore(isLoading);
  const $error = useStore(error);
  const $categories = useStore(categories);
  const $selectedCategory = useStore(selectedCategory);
  const $searchQuery = useStore(searchQuery);
  const $customer = useStore(customer);
  const $allProducts = useStore(products);

  const [bannerImgError, setBannerImgError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [$selectedCategory, $searchQuery]);

  useEffect(() => {
    initAuth();
    loadProducts();
    loadCategories();
  }, []);

  const featuredProduct = $allProducts.find(
    (p) => p.available !== false && p.image
  );

  // Pagination
  const totalPages = Math.ceil($products.length / ITEMS_PER_PAGE);
  const paginatedProducts = $products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if ($isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--text-muted)] mt-4">Memuat menu...</p>
      </div>
    );
  }

  if ($error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-5xl mb-4">😔</span>
        <p className="text-[var(--error)] font-semibold">Gagal memuat menu</p>
        <p className="text-[var(--text-muted)] text-sm mt-1 mb-4">{$error}</p>
        <button
          onClick={() => loadProducts()}
          className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] rounded-2xl font-semibold"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[var(--accent)] mb-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-xs font-semibold uppercase">
              Order Mobile
            </span>
          </div>
          <h2 className="text-2xl font-bold leading-tight text-[var(--text-primary)]">
            {$customer?.name
              ? `Halo, ${$customer.name.split(" ")[0]}!`
              : "Menu Hari Ini"}
          </h2>
        </div>
        <button className="p-2.5 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] transition-colors">
          <svg
            className="w-6 h-6 text-[var(--text-primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>

      {/* ========== SEARCH BAR ========== */}
      <div className="flex w-full h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] items-center px-4 shadow-sm">
        <svg
          className="w-5 h-5 text-[var(--text-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={$searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm px-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          placeholder="Cari menu favoritmu..."
        />
        <button className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/30 hover:scale-105 active:scale-95 transition-transform">
          <svg
            className="w-4 h-4 text-[var(--text-inverse)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      {/* ========== PROMO BANNER ========== */}
      <div className="relative w-full overflow-hidden rounded-2xl shadow-lg aspect-[2/1]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
        {featuredProduct?.image && !bannerImgError ? (
          <img
            src={getImageUrl(featuredProduct.image)}
            alt={featuredProduct.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setBannerImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-active)]" />
        )}
        <div className="absolute bottom-0 left-0 w-full z-20 p-5">
          <span className="inline-block bg-[var(--accent)] text-[var(--text-inverse)] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-2 shadow-lg shadow-[var(--accent)]/30">
            30% OFF
          </span>
          <h3 className="text-white text-xl font-bold">
            {featuredProduct?.name?.split(" ").slice(0, 3).join(" ") ||
              "Menu Spesial"}
          </h3>
          <button
            onClick={() => setCategory(null)}
            className="mt-2 bg-white text-[var(--accent)] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-gray-100 transition-colors"
          >
            Lihat Menu
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ========== CATEGORIES ========== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Kategori
          </h2>
          <button
            onClick={() => setCategory(null)}
            className="text-xs text-[var(--accent)] font-semibold hover:text-[var(--accent-hover)] transition-colors"
          >
            Lihat semua
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-1 px-1">
          {$categories.slice(0, 6).map((cat) => (
            <button
              key={cat.name}
              onClick={() =>
                setCategory($selectedCategory === cat.name ? null : cat.name)
              }
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-xs font-bold border-2 shrink-0 ${
                $selectedCategory === cat.name
                  ? "bg-[var(--accent)] text-[var(--text-inverse)] border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20 scale-105"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span className="text-sm">{getCategoryIcon(cat.name)}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ========== PRODUCTS GRID ========== */}
      <section id="popular">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {$selectedCategory || "Menu Populer"}
          </h2>
        </div>

        {$products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🍽️</span>
            <p className="text-[var(--text-muted)]">
              {$searchQuery || $selectedCategory
                ? "Tidak ada menu ditemukan"
                : "Belum ada menu tersedia"}
            </p>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4">
              {paginatedProducts.map((item) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent)]"
                  }`}
                >
                  ‹
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2)
                      pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-[var(--accent)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/40 scale-110"
                          : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent)]"
                  }`}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
