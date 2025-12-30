// =========================================
// RegisterPage Component - Customer Registration
// =========================================

import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  register,
  authError,
  isAuthLoading,
  initAuth,
  isLoggedIn,
} from "@/stores/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const $error = useStore(authError);
  const $isLoading = useStore(isAuthLoading);
  const $isLoggedIn = useStore(isLoggedIn);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if ($isLoggedIn) {
      window.location.href = "/";
    }
  }, [$isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register({
      name,
      phone,
      password,
      email: email || undefined,
      address: address || undefined,
    });
    if (success) {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 pb-12 safe-area-top">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <a
          href="/login"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </a>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Daftar Akun
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Buat akun untuk menikmati layanan kami
          </p>
        </div>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-4">
        {$error && (
          <div className="p-4 bg-[var(--error-bg)] border border-[var(--error)] rounded-xl">
            <p className="text-sm text-[var(--error)]">{$error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Nama Lengkap <span className="text-[var(--error)]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap"
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
            Password <span className="text-[var(--error)]">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Email (opsional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Alamat (opsional)
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap"
            rows={2}
            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={$isLoading}
            className="w-full py-4 bg-[var(--accent)] text-[var(--text-inverse)] rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent-hover)] transition-colors"
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
                Mendaftar...
              </span>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </div>
      </form>

      {/* Login Link */}
      <div className="text-center py-6">
        <p className="text-[var(--text-secondary)]">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-[var(--accent)] font-semibold hover:underline"
          >
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}
