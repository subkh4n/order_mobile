// =========================================
// OrdersPage Component - Order History
// =========================================

import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { customer, isLoggedIn } from "@/stores/auth";
import {
  getOnlineOrders,
  formatRupiah,
  getOrderStatusLabel,
  type OnlineOrder,
} from "@/lib/api";

export default function OrdersPage() {
  const $customer = useStore(customer);
  const $isLoggedIn = useStore(isLoggedIn);
  const [orders, setOrders] = useState<OnlineOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, [$customer?.id]);

  const loadOrders = async () => {
    if (!$customer?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getOnlineOrders($customer.id);
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-[var(--warning-bg)] text-[var(--warning)]",
      CONFIRMED: "bg-[var(--info-bg)] text-[var(--info)]",
      COOKING: "bg-[var(--accent-muted)] text-[var(--accent)]",
      READY: "bg-[var(--success-bg)] text-[var(--success)]",
      COMPLETED: "bg-[var(--success-bg)] text-[var(--success)]",
      CANCELLED: "bg-[var(--error-bg)] text-[var(--error)]",
    };
    return (
      colors[status] || "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "active") {
      return ["PENDING", "CONFIRMED", "COOKING", "READY"].includes(
        order.orderStatus
      );
    }
    if (filter === "completed") {
      return ["COMPLETED", "CANCELLED"].includes(order.orderStatus);
    }
    return true;
  });

  // Not logged in
  if (!$isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">🔐</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Masuk untuk Melihat Pesanan
        </h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Login untuk melihat riwayat pesananmu
        </p>
        <a
          href="/login"
          className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-semibold"
        >
          Masuk Sekarang
        </a>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[var(--text-secondary)]">Memuat pesanan...</p>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">📋</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Belum Ada Pesanan
        </h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Pesananmu akan muncul di sini
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-semibold"
        >
          Mulai Pesan
        </a>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "all", label: "Semua" },
          { id: "active", label: "Aktif" },
          { id: "completed", label: "Selesai" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === tab.id
                ? "bg-[var(--accent)] text-[var(--text-inverse)]"
                : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <a
            key={order.orderId}
            href={`/track/${order.orderId}`}
            className="block bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-light)] hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">
                  #{order.queueNumber || order.orderId.slice(-4)}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {getOrderStatusLabel(order.orderStatus)}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              {order.items.slice(0, 2).map((item, idx) => (
                <p key={idx} className="text-sm text-[var(--text-secondary)]">
                  {item.name} × {item.qty}
                </p>
              ))}
              {order.items.length > 2 && (
                <p className="text-sm text-[var(--text-muted)]">
                  +{order.items.length - 2} item lainnya
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
              <span className="text-sm text-[var(--text-secondary)]">
                Total
              </span>
              <span className="font-bold text-[var(--accent)]">
                {formatRupiah(order.total)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
