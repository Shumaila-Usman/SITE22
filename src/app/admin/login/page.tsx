"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      router.push("/admin");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/logo-header.png" alt="Megacore" width={140} height={36} className="h-9 w-auto object-contain" />
          <span className="rounded-full bg-red-600/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-400">
            Admin Panel
          </span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-8 shadow-2xl">
          <h1 className="mb-6 text-xl font-bold text-white">Sign in</h1>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Email</label>
              <input
                suppressHydrationWarning
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@megacore.com"
                autoComplete="username"
                className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Password</label>
              <div className="relative">
                <input
                  suppressHydrationWarning
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 pr-10 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50"
                />
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              suppressHydrationWarning
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
