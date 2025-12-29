// =========================================
// ProductCard Component - Dark Theme
// =========================================

import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { addToCart, cartItems } from "@/stores/cart";
import { formatRupiah } from "@/lib/api";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;
  available?: boolean;
}

// Helper to convert Google Drive URLs to viewable format
// Based on: docs/GOOGLE_DRIVE_IMAGES.md
function getImageUrl(url?: string): string | undefined {
  if (!url) return undefined;

  // Already using lh3 format - most reliable
  if (url.includes("lh3.googleusercontent.com")) {
    return url;
  }

  // Already in uc?export format
  if (url.includes("uc?export=view")) {
    // Convert to lh3 format for better reliability
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
  }

  // Extract file ID from various Google Drive formats
  let fileId: string | null = null;

  // Format 1: https://drive.google.com/file/d/FILE_ID/view
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    fileId = match ? match[1] : null;
  }
  // Format 2: https://drive.google.com/open?id=FILE_ID
  else if (url.includes("drive.google.com/open?id=")) {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    fileId = match ? match[1] : null;
  }
  // Format 3: https://drive.google.com/thumbnail?id=FILE_ID
  else if (url.includes("drive.google.com/thumbnail?id=")) {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    fileId = match ? match[1] : null;
  }

  if (fileId) {
    // Use lh3 format - more reliable for embedding
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // Return original URL if not a Google Drive link (e.g., Unsplash)
  return url;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  stock,
  available = true,
}: ProductCardProps) {
  const $cartItems = useStore(cartItems);
  const cartItem = $cartItems[id];
  const quantityInCart = cartItem?.quantity || 0;
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = !available || (stock !== undefined && stock <= 0);
  const imageUrl = getImageUrl(image);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({ id, name, price, image });
  };

  return (
    <div className="group relative bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border-light)] transition-all duration-300 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/10">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-tertiary)]">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-[var(--error)] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Habis
            </span>
          </div>
        )}

        {/* Quantity Badge */}
        {quantityInCart > 0 && (
          <div className="absolute top-2 right-2 bg-[var(--accent)] text-[var(--text-inverse)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-fadeIn">
            {quantityInCart}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-[var(--text-primary)] text-xs line-clamp-2 mb-1.5 min-h-[2rem] leading-snug">
          {name}
        </h3>

        <div className="flex items-center justify-between gap-1">
          <span className="text-[var(--accent)] font-bold text-[13px]">
            {formatRupiah(price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isOutOfStock
                ? "bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed"
                : "bg-[var(--accent)] text-[var(--text-inverse)] hover:scale-110 active:scale-95 shadow-lg shadow-[var(--accent)]/30"
            }`}
            aria-label={isOutOfStock ? "Stok habis" : "Tambah ke keranjang"}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 5v14m7-7H5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
