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
      <div className="flex items-center gap-4 mt-12 mb-8">
        <a
          href="/login"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors shadow-sm"
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
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </a>
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
            Daftar Akun
          </h1>
          <p className="text-[10px] text-[var(--accent)] mt-0.5 font-black uppercase tracking-widest opacity-90">
            Mulai pengalaman kulinermu
          </p>
        </div>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
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

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--text-secondary)] ml-1">
            Nama Lengkap <span className="text-[var(--error)]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="input py-4"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-secondary)] ml-1">
              Nomor HP <span className="text-[var(--error)]">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="input py-4"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-secondary)] ml-1">
              Password <span className="text-[var(--error)]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="input py-4"
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--text-secondary)] ml-1">
            Email (opsional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="input py-4"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--text-secondary)] ml-1">
            Alamat (opsional)
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap"
            rows={2}
            className="input py-4 resize-none"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={$isLoading}
            className="btn btn-primary w-full py-5 text-lg shadow-lg shadow-[var(--accent)]/30"
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
                Mendaftar...
              </span>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </div>
      </form>

      {/* Login Link */}
      <div className="text-center py-10">
        <p className="text-[var(--text-secondary)]">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-[var(--accent)] font-bold hover:underline"
          >
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}
