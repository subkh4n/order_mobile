// =========================================
// CartPage Component - Shopping Cart View
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

export default function CartPage() {
  const items = useStore(cartItemsArray);
  const total = useStore(cartTotal);
  const itemCount = useStore(cartItemCount);

  // Tax calculation (11% PPN)
  const tax = Math.round(total * 0.11);
  const grandTotal = total + tax;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Keranjang Kosong
        </h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Yuk tambahkan menu favoritmu!
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-semibold hover:bg-[var(--accent-hover)] transition-colors"
        >
          Lihat Menu
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)]">
      {/* Cart Items */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-light)]"
          >
            <div className="flex gap-3">
              {/* Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
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
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-[var(--accent)] font-bold">
                  {formatRupiah(item.price)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-full p-1">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] text-[var(--text-primary)] flex items-center justify-center hover:bg-[var(--error)] hover:text-white transition-colors"
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
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="w-8 text-center font-semibold text-[var(--text-primary)]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--text-inverse)] flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors"
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
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
                <span className="text-sm font-semibold text-[var(--text-secondary)]">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            </div>

            {/* Note Input */}
            <div className="mt-3">
              <input
                type="text"
                placeholder="Catatan: pedas, tanpa bawang..."
                value={item.note || ""}
                onChange={(e) => updateItemNote(item.id, e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        ))}

        {/* Clear Cart Button */}
        <button
          onClick={() => clearCart()}
          className="w-full py-3 text-[var(--error)] text-sm font-medium hover:bg-[var(--error-bg)] rounded-xl transition-colors"
        >
          Kosongkan Keranjang
        </button>
      </div>

      {/* Order Summary - Fixed Bottom */}
      <div className="sticky bottom-16 bg-[var(--bg-secondary)] border-t border-[var(--border-default)] p-4 space-y-3 safe-area-bottom">
        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">
              Subtotal ({itemCount} item)
            </span>
            <span className="text-[var(--text-primary)]">
              {formatRupiah(total)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">PPN (11%)</span>
            <span className="text-[var(--text-primary)]">
              {formatRupiah(tax)}
            </span>
          </div>
          <div className="h-px bg-[var(--border-default)]" />
          <div className="flex justify-between">
            <span className="font-semibold text-[var(--text-primary)]">
              Total
            </span>
            <span className="text-xl font-bold text-[var(--accent)]">
              {formatRupiah(grandTotal)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <a
          href="/checkout"
          className="flex items-center justify-center w-full py-4 bg-[var(--accent)] text-[var(--text-inverse)] rounded-2xl font-bold text-lg hover:bg-[var(--accent-hover)] transition-colors gap-2"
        >
          <span>Checkout</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
