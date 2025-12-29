// =========================================
// CartPage Component - FlavorDash Design Pattern
// =========================================

import React from "react";
import { useStore } from "@nanostores/react";
import {
  cartItemsArray,
  cartTotal,
  cartItemCount,
  addToCart,
  removeFromCart,
  updateItemNote,
  clearCart,
} from "@/stores/cart";
import { formatRupiah } from "@/lib/api";

// Helper to convert Google Drive URLs
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

export default function CartPage() {
  const items = useStore(cartItemsArray);
  const total = useStore(cartTotal);
  const itemCount = useStore(cartItemCount);

  // Tax calculation (11% PPN)
  const tax = Math.round(total * 0.11);
  const grandTotal = total + tax;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Keranjang Kosong
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 text-sm">
          Yuk tambahkan menu favoritmu!
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-bold hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2"
        >
          Lihat Menu
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Keranjang Kamu</h2>
        <p className="text-sm text-[var(--text-muted)]">{itemCount} item</p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 space-y-4 pb-64">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 bg-[var(--bg-secondary)] p-3 rounded-2xl border border-[var(--border-light)]"
          >
            {/* Image */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0">
              {item.image ? (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  🍽️
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">{item.name}</h4>
                <p className="text-[var(--accent)] font-bold text-sm">
                  {formatRupiah(item.price)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] flex items-center justify-center hover:bg-[var(--error)] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/>
                  </svg>
                </button>
                <span className="w-6 text-center font-bold text-sm text-[var(--text-primary)]">
                  {item.quantity}
                </span>
                <button
                  onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                  className="w-7 h-7 rounded-lg bg-[var(--accent)] text-[var(--text-inverse)] flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Subtotal & Delete */}
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => {
                  for (let i = 0; i < item.quantity; i++) {
                    removeFromCart(item.id);
                  }
                }}
                className="text-[var(--error)] p-1 hover:bg-[var(--error-bg)] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                {formatRupiah(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}

        {/* Note Input */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
            Catatan (opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: pedas, tanpa bawang..."
            className="w-full px-4 py-3 text-sm bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Clear Cart */}
        <button
          onClick={() => clearCart()}
          className="w-full py-3 text-[var(--error)] text-sm font-medium hover:bg-[var(--error-bg)] rounded-xl transition-colors"
        >
          Kosongkan Keranjang
        </button>
      </div>

      {/* Order Summary - Fixed Bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-default)] p-4 space-y-3 safe-area-bottom max-w-md mx-auto">
        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Subtotal ({itemCount} item)</span>
            <span className="text-[var(--text-primary)] font-medium">{formatRupiah(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">PPN (11%)</span>
            <span className="text-[var(--text-primary)] font-medium">{formatRupiah(tax)}</span>
          </div>
          <div className="h-px bg-[var(--border-default)]" />
          <div className="flex justify-between">
            <span className="font-bold text-[var(--text-primary)]">Total</span>
            <span className="text-xl font-bold text-[var(--accent)]">{formatRupiah(grandTotal)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <a
          href="/checkout"
          className="flex items-center justify-center w-full py-4 bg-[var(--accent)] text-[var(--text-inverse)] rounded-2xl font-bold text-lg hover:bg-[var(--accent-hover)] transition-colors gap-2 shadow-lg shadow-[var(--accent)]/30"
        >
          <span>Checkout</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
