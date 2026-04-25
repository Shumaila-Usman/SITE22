"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette, Upload, Type, Layers, Save, MessageCircle,
  Lock, ChevronRight, Check, Loader2, Shirt, Eye, Shield,
  Minus, Plus, ChevronDown, Zap, Grid3X3,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";
import {
  OutfitPreview, OutfitConfig, ProductTemplate, FabricPattern,
  LogoPosition, StripeConfig, StripePosition, StripeCount,
  StripeThickness, PanelConfig,
} from "@/components/outfit-preview";

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TEMPLATES: { id: ProductTemplate; label: string; desc: string; icon: string }[] = [
  { id: "jersey",    label: "Jersey",    desc: "Sports jersey",    icon: "👕" },
  { id: "shirt",     label: "Shirt",     desc: "Button-up shirt",  icon: "👔" },
  { id: "trouser",   label: "Trouser",   desc: "Sports trousers",  icon: "👖" },
  { id: "tracksuit", label: "Tracksuit", desc: "Full set",         icon: "🥋" },
  { id: "hoodie",    label: "Hoodie",    desc: "Zip hoodie",       icon: "🧥" },
  { id: "shorts",    label: "Shorts",    desc: "Athletic shorts",  icon: "🩳" },
];

const PATTERNS: { id: FabricPattern; label: string; preview: string }[] = [
  { id: "solid",     label: "Solid",     preview: "■" },
  { id: "gradient",  label: "Gradient",  preview: "▣" },
  { id: "stripes",   label: "Stripes",   preview: "≡" },
  { id: "diagonal",  label: "Diagonal",  preview: "╱" },
  { id: "geometric", label: "Geometric", preview: "◆" },
  { id: "mesh",      label: "Mesh",      preview: "⊞" },
  { id: "chevron",   label: "Chevron",   preview: "∧" },
  { id: "honeycomb", label: "Honeycomb", preview: "⬡" },
  { id: "camo",      label: "Camo",      preview: "✦" },
  { id: "panel",     label: "Panel",     preview: "▦" },
];

const STRIPE_POSITIONS: { id: StripePosition; label: string }[] = [
  { id: "side",            label: "Side" },
  { id: "sleeve",          label: "Sleeve" },
  { id: "shoulder",        label: "Shoulder" },
  { id: "chest",           label: "Chest" },
  { id: "vertical-center", label: "Center" },
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
  "#84CC16","#06B6D4","#A855F7","#F43F5E","#64748B",
];

const DEFAULT_STRIPES: StripeConfig = {
  enabled:   false,
  position:  "side",
  count:     1,
  thickness: "medium",
  color:     "#FFFFFF",
  color2:    "#FFFFFF",
  color3:    "#FFFFFF",
  bothSides: true,
};

const DEFAULT_PANELS: PanelConfig = {
  chestPanel:  "#FFFFFF",
  sidePanel:   "#FFFFFF",
  sleevePanel: "#FFFFFF",
  cuffColor:   "#1a1a1a",
  collarColor: "#1a1a1a",
};

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
  stripes:         { ...DEFAULT_STRIPES },
  panels:          { ...DEFAULT_PANELS },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ColorSwatch({ value, onChange, size = "sm" }: {
  value: string; onChange: (v: string) => void; size?: "sm" | "md";
}) {
  const sz = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {PRESET_COLORS.map(c => (
        <button key={c} onClick={() => onChange(c)} title={c}
          className={`${sz} rounded-full border-2 transition-transform hover:scale-110 ${
            value === c ? "border-white scale-110" : "border-transparent"
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
      <label className="relative cursor-pointer">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer" style={{ width: 28, height: 28 }} />
        <div className={`${sz} rounded-lg border-2 border-white/20 hover:border-white/50 transition-colors`}
          style={{ backgroundColor: value }} />
      </label>
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-3.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: value }} />
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="ml-auto font-mono text-[10px] text-zinc-600">{value}</span>
      </div>
      <ColorSwatch value={value} onChange={onChange} />
    </div>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/[0.07] bg-zinc-900/40 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-2.5 px-4 py-3 hover:bg-white/[0.02] transition-colors">
        <Icon className="h-3.5 w-3.5 text-red-400 shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 flex-1 text-left">{title}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.05]">
              <div className="pt-3 space-y-3">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToggleGroup<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
            value === o.id
              ? "border-red-500/50 bg-red-500/10 text-red-300"
              : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
          }`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CountStepper({ value, onChange, min = 1, max = 3 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.1] text-zinc-400 hover:text-white disabled:opacity-30 transition-colors">
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-6 text-center text-sm font-bold text-white">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.1] text-zinc-400 hover:text-white disabled:opacity-30 transition-colors">
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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

  const updateStripe = useCallback(<K extends keyof StripeConfig>(key: K, val: StripeConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      stripes: { ...(prev.stripes ?? DEFAULT_STRIPES), [key]: val },
    }));
    setSaved(false);
  }, []);

  const updatePanel = useCallback(<K extends keyof PanelConfig>(key: K, val: string) => {
    setConfig(prev => ({
      ...prev,
      panels: { ...(prev.panels ?? DEFAULT_PANELS), [key]: val },
    }));
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
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    if (!isAuthenticated) { setAuthOpen(true); return; }
    setSaving(true);
    const payload = {
      ...config,
      title,
      fabricPattern: config.fabricPattern,
      designConfig: {
        stripes: config.stripes,
        panels:  config.panels,
      },
    };
    const res  = await fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) { setSaved(true); setSavedId(data.design._id); }
    setSaving(false);
  }

  function handleWhatsApp() {
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const st  = config.stripes;
    const lines = [
      "Hello,",
      "",
      "I am contacting you from the Megacore International website.",
      "I have created a customized outfit design and would like to discuss this order.",
      "",
      ...(user ? [
        "Account Details:",
        `Name: ${user.name}`,
        `Email: ${user.email}`,
        ...(user.company ? [`Company: ${user.company}`] : []),
        ...(user.country ? [`Country: ${user.country}`] : []),
        "",
      ] : []),
      "Design Details:",
      `Product Type: ${cap(config.productTemplate)}`,
      ...(savedId ? [`Design ID: ${savedId}`] : [`Design Title: ${title}`]),
      `Primary Color: ${config.primaryColor}`,
      `Secondary Color: ${config.secondaryColor}`,
      `Sleeve Color: ${config.sleeveColor}`,
      `Collar Color: ${config.collarColor}`,
      `Fabric Pattern: ${cap(config.fabricPattern)}`,
      ...(st?.enabled ? [
        `Stripes: Enabled`,
        `Stripe Position: ${cap(st.position)}`,
        `Stripe Count: ${st.count}`,
        `Stripe Thickness: ${cap(st.thickness)}`,
        `Stripe Color(s): ${[st.color, st.count >= 2 ? st.color2 : null, st.count >= 3 ? st.color3 : null].filter(Boolean).join(", ")}`,
      ] : ["Stripes: None"]),
      `Logo Included: ${config.logoUrl ? "Yes" : "No"}`,
      `Logo Position: ${cap(config.logoPosition)}`,
      ...(config.customText   ? [`Custom Name/Text: ${config.customText}`]   : []),
      ...(config.customNumber ? [`Custom Number: ${config.customNumber}`]     : []),
      "",
      "Please review my design and share pricing, customization options, MOQ details, and next steps.",
      "",
      "Thank you.",
    ];
    window.open(`https://wa.me/923377270001?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
  }

  const stripes = config.stripes ?? DEFAULT_STRIPES;
  const panels  = config.panels  ?? DEFAULT_PANELS;

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <main className="min-h-screen bg-black">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.07),transparent_60%)]" />

        {/* ── Hero ── */}
        <section className="relative px-6 pb-12 pt-28">
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
                Professional sportswear design tool — patterns, stripes, panels, logos. Build your kit and send for a quote.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { icon: Palette,  label: "Panel Colors" },
                { icon: Zap,      label: "Stripe Control" },
                { icon: Grid3X3,  label: "10 Patterns" },
                { icon: Eye,      label: "Live Preview" },
                { icon: Shield,   label: "MOQ from 50 pcs" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
                  <Icon className="h-3 w-3 text-red-400" />{label}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Studio ── */}
        <section className="px-4 pb-24 md:px-6" id="studio">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
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
              <div className="mb-5 flex items-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
                <Lock className="h-5 w-5 shrink-0 text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Login required to save designs</p>
                  <p className="text-xs text-zinc-400">Preview freely — login to save and send for inquiry.</p>
                </div>
                <button onClick={() => setAuthOpen(true)}
                  className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500">
                  Login / Register
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_440px]">

              {/* ── Live Preview ── */}
              <div className="order-first lg:order-none">
                <div className="sticky top-24 rounded-2xl border border-white/[0.07] bg-zinc-900/40 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Live Preview</span>
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">
                      {config.productTemplate.charAt(0).toUpperCase() + config.productTemplate.slice(1)}
                    </span>
                  </div>
                  <div className="mx-auto flex items-center justify-center" style={{ maxWidth: 300, height: 360 }}>
                    <OutfitPreview config={config} className="w-full h-full" />
                  </div>

                  {/* Color summary bar */}
                  <div className="mt-4 flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2">
                    <span className="text-[10px] text-zinc-500 mr-1">Colors</span>
                    {[config.primaryColor, config.secondaryColor, config.sleeveColor, config.collarColor, config.accentColor].map((c, i) => (
                      <div key={i} className="h-4 w-4 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: c }} title={c} />
                    ))}
                    {stripes.enabled && (
                      <>
                        <span className="text-[10px] text-zinc-600 mx-1">Stripes</span>
                        {[stripes.color, stripes.count >= 2 ? stripes.color2 : null, stripes.count >= 3 ? stripes.color3 : null]
                          .filter(Boolean).map((c, i) => (
                            <div key={i} className="h-4 w-4 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: c! }} />
                          ))}
                      </>
                    )}
                  </div>

                  <div className="mt-4">
                    <input value={title} onChange={e => setTitle(e.target.value)}
                      placeholder="Design title…"
                      className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
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
                    WhatsApp opens with your full design details — tap <strong className="text-zinc-400">Send</strong> to submit.
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

              {/* ── Editor Controls ── */}
              <div className="space-y-3">

                {/* 1 — Garment */}
                <Section title="Garment Template" icon={Shirt}>
                  <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map(t => (
                      <button key={t.id} onClick={() => update("productTemplate", t.id)}
                        className={`rounded-lg border px-2 py-2.5 text-left transition-all ${
                          config.productTemplate === t.id
                            ? "border-red-500/50 bg-red-500/10 text-red-300"
                            : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}>
                        <p className="text-base leading-none mb-1">{t.icon}</p>
                        <p className="text-xs font-bold">{t.label}</p>
                        <p className="mt-0.5 text-[10px] leading-tight text-zinc-600">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </Section>

                {/* 2 — Base Colors */}
                <Section title="Base Colors" icon={Palette}>
                  <ColorRow label="Primary (body)"   value={config.primaryColor}   onChange={v => update("primaryColor", v)} />
                  <ColorRow label="Secondary"        value={config.secondaryColor} onChange={v => update("secondaryColor", v)} />
                  <ColorRow label="Sleeve"           value={config.sleeveColor}    onChange={v => update("sleeveColor", v)} />
                  <ColorRow label="Collar / Waist"   value={config.collarColor}    onChange={v => update("collarColor", v)} />
                  <ColorRow label="Accent / Outline" value={config.accentColor}    onChange={v => update("accentColor", v)} />
                </Section>

                {/* 3 — Panels */}
                <Section title="Panel Colors" icon={Grid3X3} defaultOpen={false}>
                  <p className="text-[10px] text-zinc-500 -mt-1">Independent color per zone. Most visible with &quot;Panel&quot; pattern.</p>
                  <ColorRow label="Chest Panel"  value={panels.chestPanel  ?? "#FFFFFF"} onChange={v => updatePanel("chestPanel", v)} />
                  <ColorRow label="Side Panel"   value={panels.sidePanel   ?? "#FFFFFF"} onChange={v => updatePanel("sidePanel", v)} />
                  <ColorRow label="Sleeve Panel" value={panels.sleevePanel ?? "#FFFFFF"} onChange={v => updatePanel("sleevePanel", v)} />
                  <ColorRow label="Cuff"         value={panels.cuffColor   ?? "#1a1a1a"} onChange={v => updatePanel("cuffColor", v)} />
                  <ColorRow label="Collar / Hood" value={panels.collarColor ?? "#1a1a1a"} onChange={v => updatePanel("collarColor", v)} />
                </Section>

                {/* 4 — Pattern */}
                <Section title="Fabric Pattern" icon={Layers}>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PATTERNS.map(p => (
                      <button key={p.id} onClick={() => update("fabricPattern", p.id)}
                        className={`rounded-lg border py-2 flex flex-col items-center gap-0.5 transition-all ${
                          config.fabricPattern === p.id
                            ? "border-red-500/50 bg-red-500/10 text-red-300"
                            : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}>
                        <span className="text-base leading-none">{p.preview}</span>
                        <span className="text-[9px] font-medium">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </Section>

                {/* 5 — Stripes */}
                <Section title="Stripe System" icon={Zap}>
                  {/* Enable toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300 font-medium">Enable Stripes</span>
                    <button onClick={() => updateStripe("enabled", !stripes.enabled)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${stripes.enabled ? "bg-red-600" : "bg-zinc-700"}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${stripes.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>

                  {stripes.enabled && (
                    <div className="space-y-4 pt-1">
                      {/* Position */}
                      <div>
                        <p className="mb-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">Position</p>
                        <ToggleGroup
                          options={STRIPE_POSITIONS}
                          value={stripes.position}
                          onChange={v => updateStripe("position", v)}
                        />
                      </div>

                      {/* Count */}
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Stripe Count</p>
                        <CountStepper
                          value={stripes.count}
                          onChange={v => updateStripe("count", v as StripeCount)}
                        />
                      </div>

                      {/* Thickness */}
                      <div>
                        <p className="mb-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">Thickness</p>
                        <ToggleGroup
                          options={[
                            { id: "thin" as StripeThickness,   label: "Thin" },
                            { id: "medium" as StripeThickness, label: "Medium" },
                            { id: "thick" as StripeThickness,  label: "Thick" },
                          ]}
                          value={stripes.thickness}
                          onChange={v => updateStripe("thickness", v)}
                        />
                      </div>

                      {/* Both sides */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">Both Sides</span>
                        <button onClick={() => updateStripe("bothSides", !stripes.bothSides)}
                          className={`relative h-5 w-9 rounded-full transition-colors ${stripes.bothSides !== false ? "bg-red-600" : "bg-zinc-700"}`}>
                          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${stripes.bothSides !== false ? "translate-x-4" : "translate-x-0.5"}`} />
                        </button>
                      </div>

                      {/* Stripe colors */}
                      <div className="space-y-3">
                        <ColorRow label="Stripe 1 Color" value={stripes.color} onChange={v => updateStripe("color", v)} />
                        {stripes.count >= 2 && (
                          <ColorRow label="Stripe 2 Color" value={stripes.color2 ?? "#FFFFFF"} onChange={v => updateStripe("color2", v)} />
                        )}
                        {stripes.count >= 3 && (
                          <ColorRow label="Stripe 3 Color" value={stripes.color3 ?? "#FFFFFF"} onChange={v => updateStripe("color3", v)} />
                        )}
                      </div>
                    </div>
                  )}
                </Section>

                {/* 6 — Logo */}
                <Section title="Logo Upload" icon={Upload} defaultOpen={false}>
                  <div>
                    <p className="mb-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">Logo Position</p>
                    <ToggleGroup
                      options={LOGO_POSITIONS}
                      value={config.logoPosition}
                      onChange={v => update("logoPosition", v)}
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-white/[0.15] bg-white/[0.02] px-4 py-3 hover:border-red-500/30 transition-colors">
                    {uploading
                      ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                      : <Upload className="h-4 w-4 text-zinc-400" />}
                    <span className="text-xs text-zinc-400">
                      {config.logoUrl ? "Logo uploaded ✓ — click to replace" : "Click to upload PNG/JPG (max 5 MB)"}
                    </span>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                  {config.logoUrl && (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={config.logoUrl} alt="logo" className="h-10 w-10 rounded object-contain border border-white/10 bg-zinc-800" />
                      <button onClick={() => update("logoUrl", undefined)} className="text-[10px] text-red-400 hover:text-red-300">
                        Remove logo
                      </button>
                    </div>
                  )}
                </Section>

                {/* 7 — Text & Number */}
                <Section title="Name & Number" icon={Type} defaultOpen={false}>
                  <div>
                    <label className="mb-1 block text-[10px] text-zinc-500 uppercase tracking-wider">Player / Team Name</label>
                    <input value={config.customText ?? ""} onChange={e => update("customText", e.target.value)}
                      maxLength={14} placeholder="e.g. JOHNSON"
                      className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2 text-sm uppercase text-white placeholder-zinc-600 outline-none focus:border-red-500/50" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-zinc-500 uppercase tracking-wider">Player Number (max 2 digits)</label>
                    <input value={config.customNumber ?? ""}
                      onChange={e => update("customNumber", e.target.value.replace(/\D/g, "").slice(0, 2))}
                      maxLength={2} placeholder="e.g. 10"
                      className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50" />
                  </div>
                </Section>

              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
