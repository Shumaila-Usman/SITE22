"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Palette, Upload, Type, Layers, Save,
  MessageCircle, Lock, ChevronRight, Check, Loader2,
  Shirt, Eye, Shield,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";
import { OutfitPreview, OutfitConfig, ProductTemplate, FabricPattern, LogoPosition } from "@/components/outfit-preview";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TEMPLATES: { id: ProductTemplate; label: string; desc: string }[] = [
  { id: "jersey",    label: "Jersey",    desc: "Sports jersey" },
  { id: "shirt",     label: "Shirt",     desc: "Button-up shirt" },
  { id: "trouser",   label: "Trouser",   desc: "Sports trousers" },
  { id: "tracksuit", label: "Tracksuit", desc: "Full set" },
  { id: "hoodie",    label: "Hoodie",    desc: "Zip hoodie" },
  { id: "shorts",    label: "Shorts",    desc: "Athletic shorts" },
];

const PATTERNS: { id: FabricPattern; label: string }[] = [
  { id: "solid",    label: "Solid" },
  { id: "stripes",  label: "Stripes" },
  { id: "gradient", label: "Gradient" },
  { id: "camo",     label: "Camo" },
];

const LOGO_POSITIONS: { id: LogoPosition; label: string }[] = [
  { id: "chest",  label: "Chest" },
  { id: "back",   label: "Back" },
  { id: "sleeve", label: "Sleeve" },
  { id: "none",   label: "None" },
];

const PRESET_COLORS = [
  "#EF4444","#F97316","#EAB308","#22C55E","#3B82F6",
  "#8B5CF6","#EC4899","#FFFFFF","#000000","#1a1a1a",
  "#DC2626","#0EA5E9","#14B8A6","#F59E0B","#6366F1",
];

const DEFAULT_CONFIG: OutfitConfig = {
  productTemplate: "jersey",
  primaryColor:    "#EF4444",
  secondaryColor:  "#FFFFFF",
  accentColor:     "#1a1a1a",
  sleeveColor:     "#EF4444",
  collarColor:     "#1a1a1a",
  stripeColor:     "#FFFFFF",
  logoUrl:         undefined,
  logoPosition:    "chest",
  customText:      "",
  customNumber:    "",
  fabricPattern:   "solid",
};

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 w-24 shrink-0 text-xs text-zinc-400">{label}</span>
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            title={c}
            className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${
              value === c ? "border-white scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
        <label className="relative cursor-pointer">
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            className="absolute inset-0 h-7 w-7 cursor-pointer opacity-0" />
          <div className="h-7 w-7 rounded-lg border-2 border-white/20 cursor-pointer hover:border-white/50 transition-colors"
            style={{ backgroundColor: value }} />
        </label>
      </div>
    </div>
  );
}

function EditorSection({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-red-400" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">{title}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function CustomizePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [authOpen, setAuthOpen]   = useState(false);
  const [config, setConfig]       = useState<OutfitConfig>({ ...DEFAULT_CONFIG });
  const [title, setTitle]         = useState("My Custom Design");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [savedId, setSavedId]     = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = useCallback(<K extends keyof OutfitConfig>(key: K, val: OutfitConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  }, []);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) update("logoUrl", data.url);
    setUploading(false);
  }

  async function handleSave() {
    if (!isAuthenticated) { setAuthOpen(true); return; }
    setSaving(true);
    const res  = await fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...config, title }),
    });
    const data = await res.json();
    if (res.ok) { setSaved(true); setSavedId(data.design._id); }
    setSaving(false);
  }

  function handleWhatsApp() {
    const t   = config.productTemplate;
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const lines = [
      "Hello,",
      "",
      "I am contacting you from the Megacore International website.",
      "I have created a customized outfit design and would like to discuss this order.",
      "",
      user ? [
        "Account Details:",
        `Name: ${user.name}`,
        `Email: ${user.email}`,
        user.company ? `Company: ${user.company}` : null,
        user.country ? `Country: ${user.country}` : null,
      ].filter(Boolean).join("\n") : null,
      user ? "" : null,
      "Design Details:",
      `Product Type: ${cap(t)}`,
      savedId ? `Design ID: ${savedId}` : `Design Title: ${title}`,
      `Primary Color: ${config.primaryColor}`,
      `Secondary Color: ${config.secondaryColor}`,
      `Sleeve Color: ${config.sleeveColor}`,
      `Collar Color: ${config.collarColor}`,
      `Stripe Color: ${config.stripeColor}`,
      `Fabric Pattern: ${cap(config.fabricPattern)}`,
      `Logo Included: ${config.logoUrl ? "Yes" : "No"}`,
      `Logo Position: ${cap(config.logoPosition)}`,
      config.customText   ? `Custom Name/Text: ${config.customText}`   : null,
      config.customNumber ? `Custom Number: ${config.customNumber}`     : null,
      "",
      "Please review my design and share pricing, customization options, MOQ details, and next steps.",
      "",
      "Thank you.",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/923375917017?text=${encodeURIComponent(lines)}`, "_blank");
  }

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <main className="min-h-screen bg-black">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.07),transparent_60%)]" />

        {/* Hero */}
        <section className="relative px-6 pb-16 pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              <span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-red-400">
                <span className="h-px w-6 bg-red-500" />Custom Manufacturing<span className="h-px w-6 bg-red-500" />
              </span>
              <h1 className="mb-4 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
                Design Your<br />
                <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Custom Outfit</span>
              </h1>
              <p className="mx-auto max-w-xl text-[1.0625rem] leading-relaxed text-zinc-400">
                Choose your product, pick your colors, add your logo and name — then send it directly for a production quote.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { icon: Palette, label: "Full Color Control" },
                { icon: Upload,  label: "Logo Upload" },
                { icon: Eye,     label: "Live Preview" },
                { icon: Shield,  label: "MOQ from 50 pcs" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
                  <Icon className="h-3 w-3 text-red-400" />{label}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* What you can customize */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-400">Customization Options</span>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">What You Can Customize</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Palette, title: "Colors",        desc: "Primary, secondary, sleeve, collar, and stripe colors — full control over every zone." },
                { icon: Upload,  title: "Logo",          desc: "Upload your team or brand logo. Position it on chest, back, or sleeve." },
                { icon: Type,    title: "Name & Text",   desc: "Add player name, team name, or any custom text to your design." },
                { icon: Layers,  title: "Pattern",       desc: "Choose from solid, stripes, gradient, or camo fabric patterns." },
                { icon: Shirt,   title: "Product Type",  desc: "Jersey, shirt, trouser, tracksuit, hoodie, or shorts — 6 templates." },
                { icon: Shield,  title: "MOQ 50 pcs",    desc: "Minimum order of 50 pieces. Bulk pricing available on request." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                    <Icon className="h-4 w-4 text-red-400" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-white">{title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-400">How It Works</span>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">Simple 4-Step Process</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { n: "01", title: "Customize",   desc: "Pick product, colors, logo, name & number" },
                { n: "02", title: "Save Design",  desc: "Save your design to your account" },
                { n: "03", title: "Send Inquiry", desc: "Send to WhatsApp with one click" },
                { n: "04", title: "Get Quote",    desc: "Our team reviews and sends pricing" },
              ].map(({ n, title, desc }) => (
                <div key={n} className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-5 text-center">
                  <div className="mb-3 text-3xl font-black text-red-500/30">{n}</div>
                  <h3 className="mb-1 text-sm font-bold text-white">{title}</h3>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Studio */}
        <section className="px-6 pb-24" id="studio">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-red-400">Customization Studio</span>
                <h2 className="mt-1 text-2xl font-black uppercase text-white">Design Your Outfit</h2>
              </div>
              {isAuthenticated && (
                <Link href="/customize/my-designs"
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors">
                  My Designs <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            {!isAuthenticated && (
              <div className="mb-6 flex items-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
                <Lock className="h-5 w-5 shrink-0 text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Login required to save designs</p>
                  <p className="text-xs text-zinc-400">You can preview freely — login to save and send for inquiry.</p>
                </div>
                <button onClick={() => setAuthOpen(true)}
                  className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500">
                  Login / Register
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

              {/* Live Preview */}
              <div className="order-first lg:order-none">
                <div className="sticky top-24 rounded-2xl border border-white/[0.07] bg-zinc-900/40 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Live Preview</span>
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">
                      {config.productTemplate.charAt(0).toUpperCase() + config.productTemplate.slice(1)}
                    </span>
                  </div>
                  <div className="mx-auto flex items-center justify-center" style={{ maxWidth: 300, height: 340 }}>
                    <OutfitPreview config={config} className="w-full h-full" />
                  </div>
                  <div className="mt-5">
                    <input value={title} onChange={e => setTitle(e.target.value)}
                      placeholder="Design title…"
                      className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60 transition-colors">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                      {saving ? "Saving…" : saved ? "Saved!" : "Save Design"}
                    </button>
                    <button onClick={handleWhatsApp}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3 text-sm font-bold text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                      <MessageCircle className="h-4 w-4" />WhatsApp
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[10px] text-zinc-500">
                    WhatsApp opens with your design details — tap <strong className="text-zinc-400">Send</strong> to submit your inquiry.
                  </p>
                  {saved && savedId && (
                    <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-xs text-green-400">
                      ✓ Design saved · ID: <span className="font-mono">{savedId.slice(-8)}</span>
                      {" · "}
                      <Link href="/customize/my-designs" className="underline hover:text-green-300">View My Designs</Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Editor Controls */}
              <div className="space-y-4">

                <EditorSection title="Product Template" icon={Shirt}>
                  <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map(t => (
                      <button key={t.id} onClick={() => update("productTemplate", t.id)}
                        className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
                          config.productTemplate === t.id
                            ? "border-red-500/50 bg-red-500/10 text-red-300"
                            : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}>
                        <p className="text-xs font-bold">{t.label}</p>
                        <p className="mt-0.5 text-[10px] leading-tight text-zinc-600">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </EditorSection>

                <EditorSection title="Colors" icon={Palette}>
                  <ColorPicker label="Primary"   value={config.primaryColor}   onChange={v => update("primaryColor", v)} />
                  <ColorPicker label="Secondary" value={config.secondaryColor} onChange={v => update("secondaryColor", v)} />
                  <ColorPicker label="Sleeve"    value={config.sleeveColor}    onChange={v => update("sleeveColor", v)} />
                  <ColorPicker label="Collar"    value={config.collarColor}    onChange={v => update("collarColor", v)} />
                  <ColorPicker label="Stripe"    value={config.stripeColor}    onChange={v => update("stripeColor", v)} />
                  <ColorPicker label="Accent"    value={config.accentColor}    onChange={v => update("accentColor", v)} />
                </EditorSection>

                <EditorSection title="Fabric Pattern" icon={Layers}>
                  <div className="grid grid-cols-4 gap-2">
                    {PATTERNS.map(p => (
                      <button key={p.id} onClick={() => update("fabricPattern", p.id)}
                        className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                          config.fabricPattern === p.id
                            ? "border-red-500/50 bg-red-500/10 text-red-300"
                            : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </EditorSection>

                <EditorSection title="Logo" icon={Upload}>
                  <div>
                    <p className="mb-2 text-[10px] text-zinc-500">Logo Position</p>
                    <div className="grid grid-cols-4 gap-2">
                      {LOGO_POSITIONS.map(p => (
                        <button key={p.id} onClick={() => update("logoPosition", p.id)}
                          className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                            config.logoPosition === p.id
                              ? "border-red-500/50 bg-red-500/10 text-red-300"
                              : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
                          }`}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-white/[0.15] bg-white/[0.02] px-4 py-3 hover:border-red-500/30 transition-colors">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : <Upload className="h-4 w-4 text-zinc-400" />}
                    <span className="text-xs text-zinc-400">
                      {config.logoUrl ? "Logo uploaded ✓" : "Click to upload PNG/JPG (max 5MB)"}
                    </span>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                  {config.logoUrl && (
                    <button onClick={() => update("logoUrl", undefined)} className="text-[10px] text-red-400 hover:text-red-300">
                      Remove logo
                    </button>
                  )}
                </EditorSection>

                <EditorSection title="Name & Number" icon={Type}>
                  <div>
                    <label className="mb-1 block text-[10px] text-zinc-500">Player / Team Name</label>
                    <input value={config.customText ?? ""} onChange={e => update("customText", e.target.value)}
                      maxLength={14} placeholder="e.g. JOHNSON"
                      className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2 text-sm uppercase text-white placeholder-zinc-600 outline-none focus:border-red-500/50" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-zinc-500">Player Number (max 2 digits)</label>
                    <input value={config.customNumber ?? ""}
                      onChange={e => update("customNumber", e.target.value.replace(/\D/g, "").slice(0, 2))}
                      maxLength={2} placeholder="e.g. 10"
                      className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50" />
                  </div>
                </EditorSection>

              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
