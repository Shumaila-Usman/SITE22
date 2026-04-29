"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({ open, onClose, defaultTab = "login" }: AuthModalProps) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({
    name: "", email: "", company: "", country: "", password: "",
  });

  // Sync tab when defaultTab prop changes
  useEffect(() => { setTab(defaultTab); }, [defaultTab]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError(t("auth.errEmailPassword"));
      return;
    }
    if (tab === "register" && !form.name) {
      setError(t("auth.errName"));
      return;
    }
    setLoading(true);

    if (tab === "register") {
      // Save user to MongoDB
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          company: form.company || undefined,
          country: form.country || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("auth.errRegister"));
        setLoading(false);
        return;
      }
      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        company: data.user.company,
        country: data.user.country,
      });
    } else {
      // Login — verify credentials against MongoDB
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("auth.errLogin"));
        setLoading(false);
        return;
      }
      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        company: data.user.company,
        country: data.user.country,
      });
    }

    setLoading(false);
    onClose();
  }

  const inputCls =
    "w-full rounded-lg border border-white/[0.1] bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-red-500/60 focus:bg-zinc-800";

  return (
    <AnimatePresence>
      {open && (
        // Full-screen overlay — flex centers the card
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.75)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#120303] shadow-2xl"
            style={{ maxHeight: "calc(100svh - 2rem)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top red accent line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            <div className="p-5 sm:p-8">
              {/* Header row */}
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wide text-white">
                    {tab === "login" ? t("auth.signInTitle") : t("auth.createAccountTitle")}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {tab === "login"
                      ? t("auth.signInSubtitle")
                      : t("auth.registerSubtitle")}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tab switcher */}
              <div className="mb-6 flex rounded-xl border border-white/[0.08] bg-zinc-900/80 p-1">
                {(["login", "register"] as const).map((tabId) => (
                  <button
                    key={tabId}
                    onClick={() => { setTab(tabId); setError(""); }}
                    className={`flex-1 rounded-lg py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                      tab === tabId
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {tabId === "login" ? t("auth.signInTitle") : t("auth.registerTab")}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {tab === "register" && (
                  <>
                    <input
                      suppressHydrationWarning
                      placeholder={t("auth.fullNamePh")}
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputCls}
                    />
                    <input
                      suppressHydrationWarning
                      placeholder={t("auth.companyPh")}
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      className={inputCls}
                    />
                    <input
                      suppressHydrationWarning
                      placeholder={t("auth.countryPh")}
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      className={inputCls}
                    />
                  </>
                )}

                <input
                  suppressHydrationWarning
                  type="email"
                  placeholder={t("auth.emailPh")}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputCls}
                />

                <div className="relative">
                  <input
                    suppressHydrationWarning
                    type={showPass ? "text" : "password"}
                    placeholder={t("auth.passwordPh")}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className={`${inputCls} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {error && (
                  <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="group relative mt-1 w-full overflow-hidden"
                  disabled={loading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading
                      ? t("auth.pleaseWait")
                      : tab === "login"
                      ? t("auth.signInTitle")
                      : t("auth.createAccountTitle")}
                    {!loading && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-500 group-hover:translate-x-full"
                  />
                </Button>
              </form>

              <p className="mt-5 text-center text-[11px] text-zinc-600">
                {t("auth.termsPrefix")}{" "}
                <a href="/terms" className="text-zinc-400 underline hover:text-white">
                  {t("auth.termsLink")}
                </a>
              </p>

              {tab === "login" && (
                <p className="mt-3 text-center text-[11px] text-zinc-600">
                  {t("auth.adminPrompt")}{" "}
                  <a href="/admin/login" className="text-zinc-400 underline hover:text-white">
                    {t("auth.adminLink")}
                  </a>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
