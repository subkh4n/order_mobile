// =========================================
// HomePage Component - Premium Eye-Catching Design
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

  // Category icons
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
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 mt-4">Memuat menu...</p>
      </div>
    );
  }

  if ($error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-5xl mb-4">😔</span>
        <p className="text-red-400 font-semibold">Gagal memuat menu</p>
        <p className="text-gray-500 text-sm mt-1 mb-4">{$error}</p>
        <button
          onClick={() => loadProducts()}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ========== SEARCH BAR ========== */}
      <div className="relative">
        <input
          type="search"
          placeholder="What are you craving?"
          value={$searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-14 rounded-2xl bg-[#1A1A1A] border-2 border-[#262626] text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 text-sm"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
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
        <button className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8.5 h-8.5 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/40 hover:scale-105 active:scale-95 transition-transform duration-200">
          <svg
            className="w-3.5 h-3.5 text-white"
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-[#262626] min-h-[145px] border border-[#333]">
        {/* Background Image */}
        {featuredProduct?.image && !bannerImgError && (
          <img
            src={getImageUrl(featuredProduct.image)}
            alt={featuredProduct.name}
            className="absolute right-0 top-0 w-3/5 h-full object-cover opacity-75"
            onError={() => setBannerImgError(true)}
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/90 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-5 h-full flex flex-col justify-center">
          <span className="self-start px-2 py-0.5 bg-orange-500 rounded-md text-[9px] font-bold text-white uppercase tracking-wider mb-2 shadow-lg shadow-orange-500/30">
            Daily Special
          </span>
          <h2 className="text-lg font-extrabold text-white leading-tight mb-0.5">
            30% OFF -{" "}
            {featuredProduct?.name?.split(" ").slice(0, 2).join(" ") || "Menu"}
          </h2>
          <p className="text-xs text-gray-400 mb-2.5">Limited time offer</p>
          <a
            href="#popular"
            className="self-start inline-flex items-center gap-1.5 text-orange-400 text-[13px] font-bold hover:text-orange-300 transition-colors group"
          >
            Order Now
            <svg
              className="w-3 h-3 group-hover:translate-x-1 transition-transform"
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
          </a>
        </div>
      </div>

      {/* ========== CATEGORIES ========== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white">Categories</h2>
          <button
            onClick={() => setCategory(null)}
            className="text-[11px] text-orange-400 font-semibold hover:text-orange-300 transition-colors"
          >
            See all
          </button>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide -mx-1 px-1">
          {$categories.slice(0, 6).map((cat) => (
            <button
              key={cat.name}
              onClick={() =>
                setCategory($selectedCategory === cat.name ? null : cat.name)
              }
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all duration-300 text-[11px] font-bold border-2 ${
                $selectedCategory === cat.name
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20 scale-105"
                  : "bg-transparent text-gray-300 border-[#333] hover:border-orange-500 hover:text-white"
              }`}
            >
              <span className="text-sm">{getCategoryIcon(cat.name)}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ========== POPULAR NOW ========== */}
      <section id="popular">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base font-bold text-white">
            {$selectedCategory || "Popular Now"}
          </h2>
        </div>

        {$products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🍽️</span>
            <p className="text-gray-400">
              {$searchQuery || $selectedCategory
                ? "No items found"
                : "No menu available"}
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
                      ? "bg-[#1A1A1A] text-gray-600"
                      : "bg-[#262626] text-white hover:bg-orange-500"
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
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-110"
                          : "bg-[#262626] text-gray-400 hover:text-white hover:bg-[#333]"
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
                      ? "bg-[#1A1A1A] text-gray-600"
                      : "bg-[#262626] text-white hover:bg-orange-500"
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
