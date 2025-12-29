// =========================================
// CheckoutPage Component - Order Checkout
// =========================================

import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { cartItemsArray, cartTotal, clearCart } from "@/stores/cart";
import { customer, isLoggedIn } from "@/stores/auth";
import { createOnlineOrder, formatRupiah, type OrderItem } from "@/lib/api";

type PaymentMethod = "COD" | "QRIS" | "TRANSFER";

export default function CheckoutPage() {
  const items = useStore(cartItemsArray);
  const subtotal = useStore(cartTotal);
  const $customer = useStore(customer);
  const $isLoggedIn = useStore(isLoggedIn);

  const [name, setName] = useState($customer?.name || "");
  const [phone, setPhone] = useState($customer?.phone || "");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate totals
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  const paymentMethods = [
    {
      id: "COD",
      label: "Bayar di Kasir",
      icon: "💵",
      desc: "Bayar tunai saat mengambil pesanan",
    },
    {
      id: "QRIS",
      label: "QRIS",
      icon: "📱",
      desc: "Scan QR untuk pembayaran digital",
    },
    {
      id: "TRANSFER",
      label: "Transfer",
      icon: "🏦",
      desc: "Transfer bank sebelum mengambil",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Nama harus diisi");
      return;
    }

    if (!phone.trim()) {
      setError("Nomor HP harus diisi");
      return;
    }

    if (items.length === 0) {
      setError("Keranjang kosong");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        note: item.note,
      }));

      const response = await createOnlineOrder({
        customerId: $customer?.id || `GUEST-${Date.now()}`,
        customerName: name,
        customerPhone: phone,
        items: orderItems,
        subtotal,
        tax,
        total,
        paymentMethod,
        notes: notes || undefined,
      });

      if (response.success && response.data) {
        clearCart();
        // Redirect to confirmation page with order data
        const orderData = encodeURIComponent(JSON.stringify(response.data));
        window.location.href = `/confirmation?data=${orderData}`;
      } else {
        setError(response.message || "Gagal membuat pesanan");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
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
          Tambahkan menu terlebih dahulu
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-semibold"
        >
          Lihat Menu
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col min-h-[calc(100vh-140px)]"
    >
      <div className="flex-1 px-4 py-4 space-y-6">
        {/* Order Summary */}
        <section className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-light)]">
          <h2 className="font-bold text-[var(--text-primary)] mb-3">
            Ringkasan Pesanan
          </h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-[var(--text-primary)]">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Details */}
        <section className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-light)]">
          <h2 className="font-bold text-[var(--text-primary)] mb-4">
            Data Pemesan
          </h2>

          {!$isLoggedIn && (
            <div className="mb-4 p-3 bg-[var(--accent-muted)] rounded-xl">
              <p className="text-sm text-[var(--accent)]">
                <a href="/login" className="font-semibold underline">
                  Masuk
                </a>{" "}
                untuk menyimpan data pesanan
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Nama Lengkap <span className="text-[var(--error)]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama"
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Nomor HP <span className="text-[var(--error)]">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Catatan Pesanan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instruksi khusus untuk pesanan..."
                rows={2}
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
              />
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-light)]">
          <h2 className="font-bold text-[var(--text-primary)] mb-4">
            Metode Pembayaran
          </h2>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === method.id
                    ? "bg-[var(--accent-muted)] border-2 border-[var(--accent)]"
                    : "bg-[var(--bg-tertiary)] border-2 border-transparent hover:border-[var(--border-default)]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as PaymentMethod)
                  }
                  className="hidden"
                />
                <span className="text-2xl">{method.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)]">
                    {method.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {method.desc}
                  </p>
                </div>
                {paymentMethod === method.id && (
                  <svg
                    className="w-5 h-5 text-[var(--accent)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </label>
            ))}
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-[var(--error-bg)] border border-[var(--error)] rounded-xl">
            <p className="text-sm text-[var(--error)]">{error}</p>
          </div>
        )}
      </div>

      {/* Submit Section - Fixed Bottom */}
      <div className="sticky bottom-16 bg-[var(--bg-secondary)] border-t border-[var(--border-default)] p-4 space-y-3 safe-area-bottom">
        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[var(--text-primary)]">
            Total Bayar
          </span>
          <span className="text-2xl font-bold text-[var(--accent)]">
            {formatRupiah(total)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center w-full py-4 bg-[var(--accent)] text-[var(--text-inverse)] rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent-hover)] transition-colors gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Pesan Sekarang</span>
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
