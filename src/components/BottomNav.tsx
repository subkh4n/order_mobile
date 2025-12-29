// =========================================
// BottomNav Component - Navigation Bar
// =========================================

import React from "react";
import { useStore } from "@nanostores/react";
import { cartItemCount, isCartOpen } from "@/stores/cart";
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
      label: "Menu",
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 5a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1z" />
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1.5 3A.5.5 0 012 2.5h2a.5.5 0 01.485.379L5.89 7H21a.5.5 0 01.485.621l-3 12A.5.5 0 0118 20H6a.5.5 0 01-.485-.379L2.015 4H.5a.5.5 0 010-1h1.5zM6.5 19a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm10 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
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
      activeIcon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 2a1 1 0 000 2h6a1 1 0 100-2H9zm-4 5a2 2 0 012-2h.17a3 3 0 00-.17 1v1H5v12a1 1 0 001 1h12a1 1 0 001-1V6h-2V5c0-.35-.03-.69-.17-1H17a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7zm6.707 8.707l4-4a1 1 0 10-1.414-1.414L11 13.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0z" />
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
      activeIcon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 18a7 7 0 1114 0H5z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[var(--z-fixed)] bg-[var(--bg-secondary)] border-t border-[var(--border-default)] safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <div className="relative">
                {Icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent)] text-[var(--text-inverse)] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[var(--accent)] rounded-full" />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
