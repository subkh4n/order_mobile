// =========================================
// LoginPage Component - Customer Login
// =========================================

import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  login,
  authError,
  isAuthLoading,
  initAuth,
  isLoggedIn,
} from "@/stores/auth";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const $error = useStore(authError);
  const $isLoading = useStore(isAuthLoading);
  const $isLoggedIn = useStore(isLoggedIn);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    // Redirect if already logged in
    if ($isLoggedIn) {
      window.location.href = "/";
    }
  }, [$isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(phone, password);
    if (success) {
      // Small delay to allow store state to propagate
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 pb-12 safe-area-top">
      {/* Logo / Brand */}
      <div className="text-center mt-14 mb-10">
        <div className="w-16 h-16 bg-[var(--accent)] rounded-[20px] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--accent)]/20 animate-bounce-subtle">
          <span className="text-3xl">🍽️</span>
        </div>
        <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
          Order Mobile
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm font-semibold opacity-80">
          Masuk ke akunmu
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {$error && (
          <div
            className={`p-4 rounded-2xl animate-in fade-in zoom-in duration-300 border ${
              $error.toLowerCase().includes("berhasil")
                ? "bg-[var(--success-bg)] border-[var(--success)] text-[var(--success)]"
                : "bg-[var(--error-bg)] border-[var(--error)] text-[var(--error)]"
            }`}
          >
            <p className="text-sm font-semibold text-center">{$error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-secondary)] ml-1">
              Nomor HP
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="input text-base py-4"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-secondary)] ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="input text-base py-4"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={$isLoading}
          className="btn btn-primary w-full py-5 text-lg shadow-lg shadow-[var(--accent)]/30 mt-4"
        >
          {$isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg
                className="w-6 h-6 animate-spin"
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
              Masuk...
            </span>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="text-center mt-10">
        <p className="text-[var(--text-secondary)]">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-[var(--accent)] font-bold hover:underline"
          >
            Daftar Sekarang
          </a>
        </p>
      </div>

      {/* Skip Login */}
      <div className="text-center mt-6">
        <a
          href="/"
          className="text-[var(--text-muted)] text-sm font-medium hover:text-[var(--text-secondary)] flex items-center justify-center gap-1"
        >
          Lanjutkan tanpa login
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
