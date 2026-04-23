"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Trash2, Loader2, ArrowLeft, Palette } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";
import { OutfitPreview, OutfitConfig } from "@/components/outfit-preview";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface SavedDesign {
  _id: string;
  title: string;
  productTemplate: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  sleeveColor: string;
  collarColor: string;
  stripeColor: string;
  logoUrl?: string;
  logoPosition: string;
  customText?: string;
  customNumber?: string;
  fabricPattern: string;
  inquiryStatus: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft:       "bg-zinc-500/15 text-zinc-400",
  sent:        "bg-blue-500/15 text-blue-400",
  reviewed:    "bg-yellow-500/15 text-yellow-400",
  in_progress: "bg-orange-500/15 text-orange-400",
  completed:   "bg-green-500/15 text-green-400",
};

export default function MyDesignsPage() {
  const { isAuthenticated } = useAuthStore();
  const [authOpen, setAuthOpen]   = useState(false);
  const [designs, setDesigns]     = useState<SavedDesign[]>([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    fetch("/api/designs")
      .then(r => r.json())
      .then(d => setDesigns(d.designs ?? []))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/designs/${id}`, { method: "DELETE" });
    setDesigns(prev => prev.filter(d => d._id !== id));
    setDeleting(null);
  }

  function handleWhatsApp(d: SavedDesign) {
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const lines = [
      "Hello,",
      "",
      "I am contacting you from the Megacore International website.",
      "I would like to discuss a customized outfit order.",
      "",
      "Design Details:",
      `Design Title: ${d.title}`,
      `Design ID: ${d._id}`,
      `Product Type: ${cap(d.productTemplate)}`,
      `Primary Color: ${d.primaryColor}`,
      `Secondary Color: ${d.secondaryColor}`,
      `Sleeve Color: ${d.sleeveColor}`,
      `Collar Color: ${d.collarColor}`,
      `Stripe Color: ${d.stripeColor}`,
      `Fabric Pattern: ${cap(d.fabricPattern)}`,
      `Logo Included: ${d.logoUrl ? "Yes" : "No"}`,
      `Logo Position: ${cap(d.logoPosition)}`,
      d.customText   ? `Custom Name/Text: ${d.customText}`   : null,
      d.customNumber ? `Custom Number: ${d.customNumber}`     : null,
      "",
      "Please review my design and share pricing, MOQ details, and next steps.",
      "",
      "Thank you.",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(lines)}`, "_blank");
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        <main className="flex min-h-screen items-center justify-center bg-black px-6 pt-28">
          <div className="text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 mx-auto">
              <Palette className="h-7 w-7 text-red-400" />
            </div>
            <h1 className="mb-2 text-2xl font-black uppercase text-white">My Designs</h1>
            <p className="mb-6 text-zinc-400">Login to view your saved custom designs.</p>
            <button onClick={() => setAuthOpen(true)}
              className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500">
              Login / Register
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.06),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link href="/customize" className="mb-3 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to Studio
            </Link>
            <span className="text-[10px] uppercase tracking-[0.25em] text-red-400">Custom Designs</span>
            <h1 className="mt-1 text-3xl font-black uppercase text-white">My Designs</h1>
            <p className="mt-1 text-sm text-zinc-500">{designs.length} saved design{designs.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/customize"
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors">
            <Palette className="h-4 w-4" /> New Design
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-red-400" />
          </div>
        ) : designs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-zinc-900/60">
              <Palette className="h-7 w-7 text-zinc-600" />
            </div>
            <p className="text-lg font-bold text-white">No designs yet</p>
            <p className="mt-2 text-sm text-zinc-500">Head to the studio to create your first custom outfit.</p>
            <Link href="/customize" className="mt-6 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-500">
              Start Designing
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {designs.map((d, i) => {
              const config: OutfitConfig = {
                productTemplate: d.productTemplate as OutfitConfig["productTemplate"],
                primaryColor:    d.primaryColor,
                secondaryColor:  d.secondaryColor,
                accentColor:     d.accentColor,
                sleeveColor:     d.sleeveColor,
                collarColor:     d.collarColor,
                stripeColor:     d.stripeColor,
                logoUrl:         d.logoUrl,
                logoPosition:    d.logoPosition as OutfitConfig["logoPosition"],
                customText:      d.customText,
                customNumber:    d.customNumber,
                fabricPattern:   d.fabricPattern as OutfitConfig["fabricPattern"],
              };

              return (
                <motion.div key={d._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.05, 0.3) }}
                  className="group rounded-2xl border border-white/[0.07] bg-zinc-900/60 overflow-hidden hover:border-white/[0.12] transition-colors">

                  {/* Preview */}
                  <div className="relative flex items-center justify-center bg-zinc-900/80 p-6" style={{ height: 200 }}>
                    <OutfitPreview config={config} className="w-full h-full" />
                    <div className="absolute top-3 right-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[d.inquiryStatus] ?? STATUS_COLORS.draft}`}>
                        {d.inquiryStatus.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="mb-0.5 text-sm font-bold text-white truncate">{d.title}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                      {d.productTemplate} · {d.fabricPattern}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-600">
                      {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>

                    {/* Color swatches */}
                    <div className="mt-3 flex gap-1.5">
                      {[d.primaryColor, d.secondaryColor, d.sleeveColor, d.collarColor, d.stripeColor].map((c, ci) => (
                        <div key={ci} className="h-4 w-4 rounded-full border border-white/10" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => handleWhatsApp(d)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#25D366]/30 bg-[#25D366]/10 py-2 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                        <MessageCircle className="h-3.5 w-3.5" /> Inquire
                      </button>
                      <button onClick={() => handleDelete(d._id)} disabled={deleting === d._id}
                        className="flex items-center justify-center rounded-lg border border-white/[0.07] p-2 text-zinc-500 hover:border-red-500/30 hover:text-red-400 transition-colors disabled:opacity-50">
                        {deleting === d._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
