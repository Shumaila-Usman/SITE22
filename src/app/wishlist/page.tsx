"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, MessageCircle, ArrowRight, ShoppingBag, Lock, X } from "lucide-react";
import { useAuthStore, useWishlistStore, generateWhatsAppURL, WishlistItem } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";

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
                    Your Details
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Optional — included in your WhatsApp message
                  </p>
                </div>
                <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input suppressHydrationWarning placeholder="Full Name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
                <input suppressHydrationWarning placeholder="Company / Brand" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} />
                <input suppressHydrationWarning type="email" placeholder="Email Address" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                <input suppressHydrationWarning placeholder="Country" value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls} />
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={onClose} className="flex-1 rounded-lg border border-white/[0.08] py-3 text-sm text-zinc-400 transition-colors hover:text-white">
                  Skip
                </button>
                <button
                  onClick={() => onProceed(form)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1fba58]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Open WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Wishlist item row ────────────────────────────────────────────────────────
function WishlistRow({ item }: { item: WishlistItem }) {
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
              {item.price ? `USD ${item.price.toFixed(2)} / pc` : "Contact for price"}
            </p>
          )}
        </div>
      </div>

      {/* Quantity + notes */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Quantity (min {item.moq} pcs)
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
            Customization Notes
          </label>
          <input
            suppressHydrationWarning
            type="text"
            placeholder="Colors, logo, size breakdown..."
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { items, clearWishlist } = useWishlistStore();
  const [authOpen, setAuthOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  function handleProceed(details: { name: string; company: string; email: string; country: string }) {
    const url = generateWhatsAppURL(items, details);
    window.open(url, "_blank");
    setDetailsOpen(false);
  }

  function handleSkipDetails() {
    const url = generateWhatsAppURL(items);
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
              Sign In Required
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-zinc-400">
              Create an account or sign in to access your wishlist, view product pricing, and proceed to discussion.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setAuthOpen(true)} size="lg" className="w-full">
                Sign In / Register
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="/products" className="text-sm text-zinc-500 transition-colors hover:text-white">
                Browse Products
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
            Your Wishlist is Empty
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400">
            Browse our catalog and save products you're interested in. Then proceed to discussion via WhatsApp.
          </p>
          <Link href="/products">
            <Button size="lg" className="group relative overflow-hidden">
              Browse Products
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
                My Wishlist
              </span>
              <h1 className="text-3xl font-black uppercase text-white">
                Saved Products
                <span className="ml-3 text-xl text-zinc-500">({items.length})</span>
              </h1>
            </div>
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-4 py-2 text-xs text-zinc-500 transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
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
                  Ready to Discuss?
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  {items.length} product{items.length !== 1 ? "s" : ""} · Total qty:{" "}
                  {items.reduce((sum, i) => sum + i.quantity, 0)} pcs
                </p>
              </div>
              <Heart className="h-6 w-6 fill-red-500 text-red-500" />
            </div>

            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
              Click <strong className="text-white">Proceed to Discussion</strong> to open WhatsApp with a pre-written message containing all your selected products, quantities, and notes. Our team will respond within 24 hours.
            </p>

            <motion.button
              onClick={() => setDetailsOpen(true)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#25D366] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(37,211,102,0.2)] transition-shadow hover:shadow-[0_0_40px_rgba(37,211,102,0.35)]"
            >
              <MessageCircle className="h-5 w-5" />
              Proceed to Discussion
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </motion.button>

            <p className="mt-3 text-center text-[10px] text-zinc-600">
              Opens WhatsApp with your product list pre-filled
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
