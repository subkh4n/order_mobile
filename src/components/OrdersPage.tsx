// =========================================
// OrdersPage Component - FlavorDash Design Pattern
// =========================================

import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { customer, isLoggedIn } from "@/stores/auth";
import { addToCart } from "@/stores/cart";
import {
  getOnlineOrders,
  formatRupiah,
  getOrderStatusLabel,
  type OnlineOrder,
} from "@/lib/api";

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
    return colors[status] || "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]";
  };

  const handleReorder = (order: OnlineOrder) => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        addToCart({
          id: item.productId || item.name,
          name: item.name,
          price: item.price,
          image: item.image,
        });
      }
    });
    window.location.href = "/cart";
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "active") {
      return ["PENDING", "CONFIRMED", "COOKING", "READY"].includes(order.orderStatus);
    }
    if (filter === "completed") {
      return ["COMPLETED", "CANCELLED"].includes(order.orderStatus);
    }
    return true;
  });

  // Not logged in
  if (!$isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🔐</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Masuk untuk Melihat Pesanan
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 text-sm">
          Login untuk melihat riwayat pesananmu
        </p>
        <a
          href="/login"
          className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-bold"
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">📋</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Belum Ada Pesanan
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 text-sm">
          Pesananmu akan muncul di sini
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-bold"
        >
          Mulai Pesan
        </a>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Riwayat Pesanan</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: "all", label: "Semua" },
          { id: "active", label: "Aktif" },
          { id: "completed", label: "Selesai" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === tab.id
                ? "bg-[var(--accent)] text-[var(--text-inverse)]"
                : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4 pb-24">
        {filteredOrders.map((order) => (
          <div
            key={order.orderId}
            className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-light)] shadow-sm"
          >
            {/* Order Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">
                  #{order.queueNumber || order.orderId.slice(-4)}
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" • "}
                  {order.items.length} item
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {getOrderStatusLabel(order.orderStatus)}
              </span>
            </div>

            {/* Item Thumbnails */}
            <div className="flex -space-x-3 mb-4 overflow-hidden">
              {order.items.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full border-2 border-[var(--bg-secondary)] overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0"
                >
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      className="w-full h-full object-cover"
                      alt={item.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm">
                      🍽️
                    </div>
                  )}
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="w-10 h-10 rounded-full border-2 border-[var(--bg-secondary)] bg-[var(--bg-tertiary)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            {/* Order Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-[var(--border-light)]">
              <span className="font-bold text-lg text-[var(--accent)]">
                {formatRupiah(order.total)}
              </span>
              <button
                onClick={() => handleReorder(order)}
                className="text-[var(--accent)] text-xs font-bold px-4 py-2 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent)] hover:text-[var(--text-inverse)] transition-colors"
              >
                Pesan Lagi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
