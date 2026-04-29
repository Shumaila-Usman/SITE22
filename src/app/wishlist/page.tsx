"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, MessageCircle, ArrowRight, ShoppingBag, Lock, X } from "lucide-react";
import { useAuthStore, useWishlistStore, generateWhatsAppURL, WishlistItem } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Buyer details form (optional, shown before WhatsApp) ─────────────────────
function BuyerDetailsModal({
  open,
  onClose,
  onProceed,
}: {
  open: boolean;
  onClose: () => void;
  onProceed: (details: { name: string; company: string; email: string; country: string }) => void;
}) {
  const { t } = useLanguage();
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    name: user?.name || "",
    company: user?.company || "",
    email: user?.email || "",
    country: user?.country || "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const inputCls =
    "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-red-500/40";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed left-1/2 top-1/2 z-[70] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0f0505] shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
            style={{ maxHeight: "calc(100svh - 3rem)" }}
          >
            <div className="h-[2px] w-full rounded-t-2xl bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <div className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black uppercase tracking-wide text-white">
                    {t("wishlist.yourDetails")}
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {t("wishlist.detailsHint")}
                  </p>
                </div>
                <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input suppressHydrationWarning placeholder={t("wishlist.fullNamePh")} value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
                <input suppressHydrationWarning placeholder={t("auth.companyPh")} value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} />
                <input suppressHydrationWarning type="email" placeholder={t("wishlist.emailAddrPh")} value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                <input suppressHydrationWarning placeholder={t("auth.countryPh")} value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls} />
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={onClose} className="flex-1 rounded-lg border border-white/[0.08] py-3 text-sm text-zinc-400 transition-colors hover:text-white">
                  {t("wishlist.skip")}
                </button>
                <button
                  onClick={() => onProceed(form)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1fba58]"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("wishlist.openWhatsApp")}
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-zinc-500">
                {t("wishlist.waPrefillHint", { send: t("common.send") })}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Wishlist item row ────────────────────────────────────────────────────────
function WishlistRow({ item }: { item: WishlistItem }) {
  const { t } = useLanguage();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { removeItem, updateQuantity, updateNotes } = useWishlistStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-5"
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-zinc-800/60">
          <div className="flex h-full items-center justify-center">
            <span className="text-[9px] font-mono text-zinc-600">{item.code}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link href={`/products/${item.productId.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <h3 className="text-sm font-bold uppercase text-white hover:text-red-300 transition-colors">
                  {item.name}
                </h3>
              </Link>
              <p className="text-[10px] font-mono text-zinc-500">{item.code}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">{item.subCategory}</p>
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              className="shrink-0 rounded-lg border border-white/[0.07] p-1.5 text-zinc-500 transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Price */}
          {isAuthenticated && (
            <p className="text-xs text-zinc-400">
              {item.price ? t("wishlist.usdPerPc", { price: item.price.toFixed(2) }) : t("wishlist.contactForPrice")}
            </p>
          )}
        </div>
      </div>

      {/* Quantity + notes */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {t("wishlist.quantityMin", { moq: String(item.moq) })}
          </label>
          <input
            suppressHydrationWarning
            type="number"
            min={item.moq}
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, Math.max(item.moq, parseInt(e.target.value) || item.moq))}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-red-500/40"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {t("wishlist.customizationNotes")}
          </label>
          <input
            suppressHydrationWarning
            type="text"
            placeholder={t("wishlist.notesPlaceholder")}
            value={item.notes}
            onChange={(e) => updateNotes(item.productId, e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/40"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main wishlist page ───────────────────────────────────────────────────────
export default function WishlistPage() {
  const { t } = useLanguage();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { items, clearWishlist } = useWishlistStore();
  const [authOpen, setAuthOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const waLabels = useMemo(
    () => ({
      greeting: t("whatsapp.wishlistGreeting"),
      fromWebsite: t("whatsapp.wishlistFrom"),
      buyerHeading: t("whatsapp.wishlistBuyer"),
      namePrefix: t("whatsapp.wishlistName"),
      companyPrefix: t("whatsapp.wishlistCompany"),
      emailPrefix: t("whatsapp.wishlistEmail"),
      countryPrefix: t("whatsapp.wishlistCountry"),
      introLine: t("whatsapp.wishlistIntro"),
      productPrefix: t("whatsapp.wishlistLineProduct"),
      codePrefix: t("whatsapp.wishlistLineCode"),
      categoryPrefix: t("whatsapp.wishlistLineCategory"),
      qtyPrefix: t("whatsapp.wishlistLineQty"),
      notesPrefix: t("whatsapp.wishlistLineNotes"),
      closingLine: t("whatsapp.wishlistClosing"),
      thanksLine: t("whatsapp.wishlistThanks"),
      pieceSuffix: t("whatsapp.wishlistPieceSuffix"),
    }),
    [t],
  );

  function handleProceed(details: { name: string; company: string; email: string; country: string }) {
    const url = generateWhatsAppURL(items, details, waLabels);
    window.open(url, "_blank");
    setDetailsOpen(false);
  }

  function handleSkipDetails() {
    const url = generateWhatsAppURL(items, undefined, waLabels);
    window.open(url, "_blank");
    setDetailsOpen(false);
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <>
        <main className="flex min-h-screen items-center justify-center bg-black pt-28 pb-24">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.07),transparent_60%)]" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative mx-auto max-w-md px-6 text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-zinc-900/60">
                <Lock className="h-7 w-7 text-zinc-400" />
              </div>
            </div>
            <h1 className="mb-3 text-2xl font-black uppercase text-white">
              {t("wishlist.gateTitle")}
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-zinc-400">
              {t("wishlist.gateBody")}
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setAuthOpen(true)} size="lg" className="w-full">
                {t("wishlist.gateCta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="/products" className="text-sm text-zinc-500 transition-colors hover:text-white">
                {t("wishlist.browseProducts")}
              </Link>
            </div>
          </motion.div>
        </main>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  // Empty wishlist
  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black pt-28 pb-24">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.07),transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mx-auto max-w-md px-6 text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-zinc-900/60">
              <ShoppingBag className="h-7 w-7 text-zinc-400" />
            </div>
          </div>
          <h1 className="mb-3 text-2xl font-black uppercase text-white">
            {t("wishlist.emptyTitle")}
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400">
            {t("wishlist.emptyBody")}
          </p>
          <Link href="/products">
            <Button size="lg" className="group relative overflow-hidden">
              {t("wishlist.browseProducts")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-black pt-28 pb-24">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.07),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-10 flex items-center justify-between"
          >
            <div>
              <span className="mb-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
                <span className="h-px w-6 bg-red-500" />
                {t("wishlist.savedEyebrow")}
              </span>
              <h1 className="text-3xl font-black uppercase text-white">
                {t("wishlist.savedTitle")}
                <span className="ml-3 text-xl text-zinc-500">({items.length})</span>
              </h1>
            </div>
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-4 py-2 text-xs text-zinc-500 transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("wishlist.clearAll")}
            </button>
          </motion.div>

          {/* Items */}
          <div className="mb-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <WishlistRow key={item.productId} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {/* Summary + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/40 via-zinc-950 to-black p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black uppercase text-white">
                  {t("wishlist.readyTitle")}
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  {items.length === 1
                    ? t("wishlist.readySubSingular", {
                        total: String(items.reduce((sum, i) => sum + i.quantity, 0)),
                      })
                    : t("wishlist.readySubPlural", {
                        count: String(items.length),
                        total: String(items.reduce((sum, i) => sum + i.quantity, 0)),
                      })}
                </p>
              </div>
              <Heart className="h-6 w-6 fill-red-500 text-red-500" />
            </div>

            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
              {t("wishlist.proceedHelp")}
            </p>

            <motion.button
              onClick={() => setDetailsOpen(true)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#25D366] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(37,211,102,0.2)] transition-shadow hover:shadow-[0_0_40px_rgba(37,211,102,0.35)]"
            >
              <MessageCircle className="h-5 w-5" />
              {t("wishlist.proceedCta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </motion.button>

            <p className="mt-3 text-center text-[10px] text-zinc-600">
              {t("wishlist.waListHint", { send: t("common.send") })}
            </p>
          </motion.div>
        </div>
      </main>

      <BuyerDetailsModal
        open={detailsOpen}
        onClose={() => { setDetailsOpen(false); handleSkipDetails(); }}
        onProceed={handleProceed}
      />
    </>
  );
}
