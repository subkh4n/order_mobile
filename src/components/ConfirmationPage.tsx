// =========================================
// ConfirmationPage Component - Order Success
// =========================================

import React, { useEffect, useState } from "react";

interface OrderData {
  orderId: string;
  queueNumber: number;
  estimatedTime: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export default function ConfirmationPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Get order data from URL
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");

    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setOrderData(parsed);
      } catch (e) {
        console.error("Failed to parse order data:", e);
      }
    }
  }, []);

  if (!orderData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[var(--text-secondary)]">Memuat data pesanan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 safe-area-top">
        <div />
        <a href="/" className="text-sm text-[var(--accent)] font-medium">
          Selesai
        </a>
      </header>

      {/* Success Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[var(--success)] rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Bon Appétit! 🎉
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Pesananmu sudah dikirim ke dapur.
        </p>

        {/* Queue Number Card */}
        <div className="w-full max-w-xs bg-[var(--bg-secondary)] rounded-3xl p-6 mb-6 border border-[var(--border-light)]">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">
            Nomor Antrian
          </p>
          <p className="text-5xl font-bold text-[var(--accent)] mb-4">
            #{orderData.queueNumber}
          </p>

          {/* Timeline */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--success)] flex items-center justify-center mb-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span className="text-[var(--text-muted)]">Dikirim</span>
            </div>
            <div className="h-0.5 w-8 bg-[var(--border-default)]" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center mb-1 animate-pulse">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[var(--text-muted)]">Proses</span>
            </div>
            <div className="h-0.5 w-8 bg-[var(--border-default)]" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-1">
                <svg
                  className="w-4 h-4 text-[var(--text-muted)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[var(--text-muted)]">Siap</span>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
          <svg
            className="w-5 h-5 text-[var(--accent)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Estimasi waktu:{" "}
            <strong className="text-[var(--text-primary)]">
              ~{orderData.estimatedTime} menit
            </strong>
          </span>
        </div>

        {/* Payment Method */}
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <svg
            className="w-5 h-5 text-[var(--accent)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>
            Metode:{" "}
            <strong className="text-[var(--text-primary)]">
              Bayar di Kasir
            </strong>
          </span>
        </div>

        <p className="text-sm text-[var(--text-muted)] mt-8">
          Silakan tunggu di konter saat nomor antrianmu dipanggil.
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 space-y-3 safe-area-bottom">
        <a
          href={`/track/${orderData.orderId}`}
          className="flex items-center justify-center w-full py-4 bg-[var(--accent)] text-[var(--text-inverse)] rounded-2xl font-bold text-lg gap-2"
        >
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span>Lacak Pesanan</span>
        </a>

        <a
          href="/"
          className="flex items-center justify-center w-full py-4 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-2xl font-medium border border-[var(--border-default)]"
        >
          Kembali ke Menu
        </a>
      </div>
    </div>
  );
}
