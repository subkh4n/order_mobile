// =========================================
// ProductCard Component - FlavorDash Design Pattern
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
  isHealthy?: boolean;
}

// Helper to convert Google Drive URLs to viewable format
function getImageUrl(url?: string): string | undefined {
  if (!url) return undefined;

  if (url.includes("lh3.googleusercontent.com")) {
    return url;
  }

  if (url.includes("uc?export=view")) {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
  }

  let fileId: string | null = null;

  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    fileId = match ? match[1] : null;
  } else if (url.includes("drive.google.com/open?id=")) {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    fileId = match ? match[1] : null;
  } else if (url.includes("drive.google.com/thumbnail?id=")) {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    fileId = match ? match[1] : null;
  }

  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return url;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  stock,
  available = true,
  isHealthy = false,
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
    <div className="flex flex-col bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border-light)] group transition-all duration-300 active:scale-[0.98] hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/10">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-tertiary)]">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {/* Healthy Badge */}
        {isHealthy && (
          <div className="absolute top-2 left-2 bg-[var(--success)]/90 text-white text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
            HEALTHY
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
          <div className="absolute top-2 right-2 bg-[var(--accent)] text-[var(--text-inverse)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-in zoom-in shadow-lg">
            {quantityInCart}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-bold text-xs text-[var(--text-primary)] truncate mb-2">
          {name}
        </h4>
        <div className="flex justify-between items-center">
          <span className="text-[var(--accent)] font-bold text-sm">
            {formatRupiah(price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isOutOfStock
                ? "bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed"
                : "bg-[var(--accent)] text-[var(--text-inverse)] hover:scale-110 active:scale-95 shadow-md shadow-[var(--accent)]/30"
            }`}
            aria-label={isOutOfStock ? "Stok habis" : "Tambah ke keranjang"}
          >
            <svg
              className="w-4 h-4"
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
