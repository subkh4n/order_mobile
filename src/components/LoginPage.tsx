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
      window.location.href = "/";
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-5 py-12">
      {/* Logo / Brand */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-[var(--accent)] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🍽️</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Order Mobile
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">Masuk ke akunmu</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {$error && (
          <div className="p-4 bg-[var(--error-bg)] border border-[var(--error)] rounded-xl">
            <p className="text-sm text-[var(--error)]">{$error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Nomor HP
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full px-4 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] text-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            className="w-full px-4 py-4 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] text-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={$isLoading}
          className="w-full py-4 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent-hover)] transition-colors mt-6"
        >
          {$isLoading ? (
            <span className="flex items-center justify-center gap-2">
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
              Masuk...
            </span>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="text-center mt-8">
        <p className="text-[var(--text-secondary)]">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-[var(--accent)] font-semibold hover:underline"
          >
            Daftar Sekarang
          </a>
        </p>
      </div>

      {/* Skip Login */}
      <div className="text-center mt-4">
        <a
          href="/"
          className="text-[var(--text-muted)] text-sm hover:text-[var(--text-secondary)]"
        >
          Lanjutkan tanpa login →
        </a>
      </div>
    </div>
  );
}
