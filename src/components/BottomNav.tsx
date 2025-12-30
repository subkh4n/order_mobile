// =========================================
// BottomNav Component - FlavorDash Design Pattern
// =========================================

import React from "react";
import { useStore } from "@nanostores/react";
import { cartItemCount } from "@/stores/cart";
import { isLoggedIn } from "@/stores/auth";

interface BottomNavProps {
  currentPage?: "menu" | "cart" | "orders" | "account";
}

export default function BottomNav({ currentPage = "menu" }: BottomNavProps) {
  const $cartCount = useStore(cartItemCount);
  const $isLoggedIn = useStore(isLoggedIn);

  const navItems = [
    {
      id: "menu",
      label: "Home",
      href: "/",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "cart",
      label: "Keranjang",
      href: "/cart",
      badge: $cartCount > 0 ? $cartCount : undefined,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Pesanan",
      href: "/orders",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      id: "account",
      label: "Akun",
      href: $isLoggedIn ? "/account" : "/login",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)]/95 backdrop-blur-md border-t border-[var(--border-default)] pt-3 px-8 max-w-md mx-auto"
      style={{
        paddingBottom: "calc(var(--space-6) + var(--safe-area-bottom))",
      }}
    >
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 w-12 transition-all ${
                isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
              }`}
            >
              <div
                className={`${
                  isActive ? "scale-110" : "scale-100"
                } transition-transform`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-bold">{item.label}</span>

              {/* Badge */}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-[var(--accent)] text-[var(--text-inverse)] text-[8px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border-2 border-[var(--bg-secondary)] animate-in zoom-in">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
