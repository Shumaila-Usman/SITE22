"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Palette,
  Upload,
  Type,
  Save,
  MessageCircle,
  Lock,
  ChevronRight,
  Check,
  Loader2,
  Shirt,
  Eye,
  Shield,
  ChevronDown,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";
import { TemplateSelector } from "@/components/template-selector";
import { GarmentPreviewPanel } from "@/components/customize/garment-preview-panel";
import type {
  GarmentSide,
  GarmentTemplate,
  MultiSideDesign,
  SideDesignConfig,
  SideStripeConfig,
  StripePosition,
  StripeThickness,
} from "@/lib/customization-types";
import {
  DEFAULT_SIDE_CONFIG,
  DEFAULT_STRIPE,
  SIDE_LABELS,
  makeDefaultMultiSide,
} from "@/lib/customization-types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PRESET_COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#FFFFFF",
  "#000000",
  "#1a1a1a",
  "#DC2626",
  "#0EA5E9",
  "#14B8A6",
  "#F59E0B",
  "#6366F1",
];

const STRIPE_POSITIONS: { id: StripePosition; label: string }[] = [
  { id: "side", label: "Side" },
  { id: "sleeve", label: "Sleeve" },
  { id: "shoulder", label: "Shoulder" },
  { id: "chest", label: "Chest" },
  { id: "vertical-center", label: "Center" },
];

const STRIPE_THICKNESS: { id: StripeThickness; label: string }[] = [
  { id: "thin", label: "Thin" },
  { id: "medium", label: "Medium" },
  { id: "broad", label: "Broad" },
];

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatSideBlock(label: string, c?: SideDesignConfig): string {
  if (!c) return `${label}:\n(not configured)\n`;
  const st = c.stripes;
  const lines = [
    `${label}:`,
    `  Primary: ${c.primaryColor} · Secondary: ${c.secondaryColor} · Accent: ${c.accentColor}`,
    st.enabled
      ? `  Stripes: Yes · Position: ${cap(st.position)} · Thickness: ${cap(st.thickness)} · Color: ${st.color}`
      : `  Stripes: No`,
    c.customText ? `  Name: ${c.customText}` : `  Name: —`,
    c.customNumber ? `  Number: ${c.customNumber}` : `  Number: —`,
    c.logoUrl ? `  Logo: ${c.logoUrl}` : `  Logo: —`,
    c.notes ? `  Notes: ${c.notes}` : `  Notes: —`,
    "",
  ];
  return lines.join("\n");
}

function ColorSwatch({
  value,
  onChange,
  size = "sm",
}: {
  value: string;
  onChange: (v: string) => void;
  size?: "sm" | "md";
}) {
  const sz = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <div className="flex max-w-full flex-wrap items-center gap-1 sm:gap-1.5">
      {PRESET_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          title={c}
          className={`${sz} rounded-full border-2 transition-transform hover:scale-110 ${
            value === c ? "scale-110 border-white" : "border-transparent"
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
      <label className="relative cursor-pointer">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
          style={{ width: 28, height: 28 }}
        />
        <div
          className={`${sz} rounded-lg border-2 border-white/20 transition-colors hover:border-white/50`}
          style={{ backgroundColor: value }}
        />
      </label>
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex min-w-0 items-center gap-2">
        <div
          className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/20"
          style={{ backgroundColor: value }}
        />
        <span className="min-w-0 truncate text-xs text-zinc-400">{label}</span>
        <span className="ml-auto hidden font-mono text-[10px] text-zinc-600 sm:inline">{value}</span>
      </div>
      <ColorSwatch value={value} onChange={onChange} />
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-zinc-900/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full min-h-11 touch-manipulation items-center gap-2.5 px-3 py-3 transition-colors hover:bg-white/[0.02] sm:min-h-0 sm:px-4"
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-red-400" />
        <span className="flex-1 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
          {title}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-white/[0.05] px-3 pb-4 sm:px-4">
          <div className="space-y-3 pt-3">{children}</div>
        </div>
      )}
    </div>
  );
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`min-h-10 touch-manipulation rounded-lg border px-3 py-2 text-xs font-medium transition-all active:opacity-90 ${
            value === o.id
              ? "border-red-500/50 bg-red-500/10 text-red-300"
              : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function CustomizePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);
  const [stage, setStage] = useState<"pick" | "studio">("pick");
  const [template, setTemplate] = useState<GarmentTemplate | null>(null);
  const [activeSide, setActiveSide] = useState<GarmentSide>("front");
  const [multi, setMulti] = useState<MultiSideDesign>({});
  const [title, setTitle] = useState("My Custom Design");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentConfig: SideDesignConfig = useMemo(() => {
    const raw = multi[activeSide];
    if (raw) return raw;
    return { ...DEFAULT_SIDE_CONFIG, stripes: { ...DEFAULT_STRIPE } };
  }, [multi, activeSide]);

  const pickTemplate = useCallback((t: GarmentTemplate) => {
    setTemplate(t);
    setMulti(makeDefaultMultiSide(t.sides));
    setActiveSide(t.sides[0] ?? "front");
    setSaved(false);
    setSavedId(null);
    setStage("studio");
  }, []);

  const backToPick = useCallback(() => {
    setStage("pick");
    setTemplate(null);
    setMulti({});
  }, []);

  const patchActiveSide = useCallback(
    (patch: Partial<SideDesignConfig>) => {
      setMulti((prev) => {
        const cur = prev[activeSide] ?? {
          ...DEFAULT_SIDE_CONFIG,
          stripes: { ...DEFAULT_STRIPE },
        };
        return { ...prev, [activeSide]: { ...cur, ...patch } };
      });
      setSaved(false);
    },
    [activeSide]
  );

  const patchStripes = useCallback(
    (patch: Partial<SideStripeConfig>) => {
      setMulti((prev) => {
        const cur = prev[activeSide] ?? {
          ...DEFAULT_SIDE_CONFIG,
          stripes: { ...DEFAULT_STRIPE },
        };
        const stripes = { ...cur.stripes, ...patch };
        return { ...prev, [activeSide]: { ...cur, stripes } };
      });
      setSaved(false);
    },
    [activeSide]
  );

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/user-upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) patchActiveSide({ logoUrl: data.url });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    if (!template) return;
    setSaving(true);
    const sideImages: Partial<Record<GarmentSide, string>> = {};
    for (const s of template.sides) {
      const u = template.sideImages[s];
      if (u) sideImages[s] = u;
    }
    const sides: MultiSideDesign = {};
    for (const s of template.sides) {
      const cfg = multi[s];
      if (cfg) sides[s] = cfg;
    }
    const payload = {
      version: 2 as const,
      title,
      templateId: template.id,
      category: template.category,
      sideImages,
      sides,
    };
    const res = await fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setSaved(true);
      setSavedId(data.design._id);
    }
    setSaving(false);
  }

  function buildWhatsAppBody(): string {
    if (!template) return "";
    const sidesOrder: GarmentSide[] = ["front", "back", "left", "right"];
    const blocks = sidesOrder
      .filter((s) => template.sides.includes(s))
      .map((s) => formatSideBlock(SIDE_LABELS[s].toUpperCase(), multi[s]));

    const lines = [
      "Hello, I am contacting from Megacore International.",
      "",
      "I created a custom design.",
      "",
      `Garment: ${template.category}`,
      `Template: ${template.name} (${template.id})`,
      "",
      ...blocks,
      "Account:",
      `Name: ${user?.name ?? ""}`,
      `Email: ${user?.email ?? ""}`,
      ...(user?.company ? [`Company: ${user.company}`] : []),
      "",
      ...(savedId ? [`Design ID: ${savedId}`, ""] : []),
      "Please share pricing, MOQ, and next steps.",
      "",
      "Thank you.",
    ];
    return lines.join("\n");
  }

  function handleWhatsApp() {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    if (!template) return;
    const text = buildWhatsAppBody();
    window.open(`https://wa.me/923377270001?text=${encodeURIComponent(text)}`, "_blank");
  }

  const previewUrl =
    template?.sideImages[activeSide] ??
    template?.thumbnailPath ??
    "/customization/templates/hoodie-1.png";

  const stripes = currentConfig.stripes;

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <main className="min-h-screen bg-black">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.07),transparent_60%)]" />

        <section className="relative px-4 pb-8 pt-20 sm:px-6 sm:pb-12 sm:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="mb-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-red-400 sm:mb-4 sm:text-[10px] sm:tracking-[0.3em]">
                <span className="h-px w-4 bg-red-500 sm:w-6" />
                Custom Manufacturing
                <span className="h-px w-4 bg-red-500 sm:w-6" />
              </span>
              <h1 className="mb-3 text-3xl font-black uppercase leading-[1.1] text-white sm:mb-4 sm:text-4xl md:text-6xl">
                Design Your
                <br />
                <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Custom Outfit
                </span>
              </h1>
              <p className="mx-auto max-w-xl px-1 text-sm leading-relaxed text-zinc-400 sm:text-[1.0625rem]">
                Choose a real garment template, customize each side independently, save your spec, and send it for a quote on WhatsApp.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-3"
            >
              {[
                { icon: Shirt, label: "Real garment photos" },
                { icon: Zap, label: "Per-side controls" },
                { icon: Eye, label: "Live summary" },
                { icon: Shield, label: "MOQ from 50 pcs" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex min-w-0 items-center justify-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-center text-[10px] leading-tight text-zinc-300 sm:w-auto sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  <Icon className="h-3 w-3 shrink-0 text-red-400" />
                  <span>{label}</span>
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="px-3 pb-20 pt-2 sm:px-4 sm:pb-24 md:px-6" id="studio">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-[0.25em] text-red-400">Customization Studio</span>
                <h2 className="mt-0.5 text-xl font-black uppercase leading-tight text-white sm:mt-1 sm:text-2xl">
                  Customize Your Outfit
                </h2>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                {stage === "studio" && (
                  <button
                    type="button"
                    onClick={backToPick}
                    className="flex min-h-11 touch-manipulation items-center justify-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-2.5 text-xs text-zinc-400 transition-colors hover:text-white sm:min-h-0"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                    Change template
                  </button>
                )}
                {isAuthenticated && (
                  <Link
                    href="/customize/my-designs"
                    className="flex min-h-11 touch-manipulation items-center justify-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-2.5 text-xs text-zinc-400 transition-colors hover:text-white sm:min-h-0"
                  >
                    My Designs <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  </Link>
                )}
              </div>
            </div>

            {!isAuthenticated && (
              <div className="mb-5 flex flex-col gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:px-5 sm:py-4">
                <Lock className="h-5 w-5 shrink-0 text-red-400 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">Login required to save designs</p>
                  <p className="mt-0.5 text-xs text-zinc-400">Browse templates and design freely — sign in to save and send for inquiry.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="min-h-11 w-full shrink-0 touch-manipulation rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-500 sm:w-auto sm:min-h-0 sm:py-2"
                >
                  Login / Register
                </button>
              </div>
            )}

            {stage === "pick" && (
              <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/30 p-4 sm:p-5 md:p-8">
                <p className="mb-4 text-xs text-zinc-400 sm:text-sm">
                  Select a garment. Each product uses your approved photography — when front/back (or cap side) files exist in the folder, they load automatically.
                </p>
                <TemplateSelector onSelect={pickTemplate} />
              </div>
            )}

            {stage === "studio" && template && (
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:gap-6">
                <div className="order-first lg:order-none">
                  <div className="space-y-4 rounded-2xl border border-white/[0.07] bg-zinc-900/40 p-4 sm:p-5 md:p-6 lg:sticky lg:top-20 xl:top-24">
                    <div className="-mx-1 flex gap-1.5 overflow-x-auto border-b border-white/[0.06] px-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-4 [&::-webkit-scrollbar]:hidden">
                      {template.sides.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setActiveSide(s)}
                          className={`shrink-0 touch-manipulation rounded-lg border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all active:opacity-90 sm:py-2 ${
                            activeSide === s
                              ? "border-red-500/50 bg-red-500/10 text-red-300"
                              : "border-white/[0.07] text-zinc-500 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {SIDE_LABELS[s]}
                        </button>
                      ))}
                    </div>
                    <GarmentPreviewPanel
                      imageUrl={previewUrl}
                      activeSide={activeSide}
                      config={currentConfig}
                    />
                    <div>
                      <label className="mb-1 block text-[10px] text-zinc-500 uppercase tracking-wider">Design title</label>
                      <input
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          setSaved(false);
                        }}
                        placeholder="Design title…"
                        className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2.5 text-base text-white placeholder-zinc-600 outline-none focus:border-red-500/50 sm:py-2 sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-500 disabled:opacity-60 active:opacity-90 ${!isAuthenticated ? "opacity-80" : ""}`}
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : saved ? (
                          <Check className="h-4 w-4" />
                        ) : !isAuthenticated ? (
                          <Lock className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {saving ? "Saving…" : saved ? "Saved!" : "Save Design"}
                      </button>
                      <button
                        type="button"
                        onClick={handleWhatsApp}
                        className={`flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-3 text-sm font-bold text-[#25D366] transition-colors hover:bg-[#25D366]/20 active:opacity-90 sm:px-4 ${!isAuthenticated ? "opacity-80" : ""}`}
                      >
                        {!isAuthenticated ? (
                          <Lock className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                        ) : (
                          <MessageCircle className="h-4 w-4 shrink-0" />
                        )}
                        <span className="sm:hidden">WhatsApp inquiry</span>
                        <span className="hidden text-center leading-snug sm:inline">Send to WhatsApp for Inquiry</span>
                      </button>
                    </div>
                    <p className="px-1 text-center text-[10px] leading-snug text-zinc-500">
                      {!isAuthenticated ? (
                        <>
                          <Lock className="mx-auto mb-1 inline h-3 w-3 text-zinc-500" aria-hidden />
                          Log in or sign up to <strong className="text-zinc-400">save</strong> your design or{" "}
                          <strong className="text-zinc-400">send a WhatsApp inquiry</strong>.
                        </>
                      ) : (
                        <>
                          WhatsApp opens with your per-side details — tap <strong className="text-zinc-400">Send</strong>{" "}
                          to submit.
                        </>
                      )}
                    </p>
                    {saved && savedId && (
                      <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-xs text-green-400">
                        ✓ Design saved · ID: <span className="font-mono">{savedId.slice(-8)}</span>
                        {" · "}
                        <Link href="/customize/my-designs" className="underline hover:text-green-300">
                          View My Designs
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Section title={`Side: ${SIDE_LABELS[activeSide]}`} icon={Palette}>
                    <p className="text-[10px] text-zinc-500">
                      Changes apply only to <strong className="text-zinc-400">{SIDE_LABELS[activeSide]}</strong>. Switch tabs for other views.
                    </p>
                    <ColorRow
                      label="Primary"
                      value={currentConfig.primaryColor}
                      onChange={(v) => patchActiveSide({ primaryColor: v })}
                    />
                    <ColorRow
                      label="Secondary"
                      value={currentConfig.secondaryColor}
                      onChange={(v) => patchActiveSide({ secondaryColor: v })}
                    />
                    <ColorRow
                      label="Accent"
                      value={currentConfig.accentColor}
                      onChange={(v) => patchActiveSide({ accentColor: v })}
                    />
                  </Section>

                  <Section title="Stripes" icon={Zap}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-zinc-300">Enable stripes</span>
                      <button
                        type="button"
                        onClick={() => patchStripes({ enabled: !stripes.enabled })}
                        className={`relative h-7 w-[2.75rem] shrink-0 touch-manipulation rounded-full transition-colors active:opacity-90 ${stripes.enabled ? "bg-red-600" : "bg-zinc-700"}`}
                      >
                        <span
                          className={`absolute left-0.5 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            stripes.enabled ? "translate-x-[1.35rem]" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    {stripes.enabled && (
                      <div className="space-y-4 pt-1">
                        <div>
                          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-500">Position</p>
                          <ToggleGroup
                            options={STRIPE_POSITIONS}
                            value={stripes.position}
                            onChange={(v) => patchStripes({ position: v })}
                          />
                        </div>
                        <div>
                          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-500">Thickness</p>
                          <ToggleGroup
                            options={STRIPE_THICKNESS}
                            value={stripes.thickness}
                            onChange={(v) => patchStripes({ thickness: v })}
                          />
                        </div>
                        <ColorRow
                          label="Stripe color"
                          value={stripes.color}
                          onChange={(v) => patchStripes({ color: v })}
                        />
                      </div>
                    )}
                  </Section>

                  <Section title="Logo upload" icon={Upload} defaultOpen={false}>
                    <label className="flex min-h-12 cursor-pointer touch-manipulation items-center gap-3 rounded-lg border border-dashed border-white/[0.15] bg-white/[0.02] px-3 py-3 transition-colors hover:border-red-500/30 sm:px-4">
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                      ) : (
                        <Upload className="h-4 w-4 text-zinc-400" />
                      )}
                      <span className="text-xs text-zinc-400">
                        {currentConfig.logoUrl
                          ? "Logo on this side — click to replace"
                          : "PNG / JPG / WebP (login required)"}
                      </span>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </label>
                    {currentConfig.logoUrl && (
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentConfig.logoUrl}
                          alt=""
                          className="h-10 w-10 rounded border border-white/10 bg-zinc-800 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => patchActiveSide({ logoUrl: undefined })}
                          className="text-[10px] text-red-400 hover:text-red-300"
                        >
                          Remove logo
                        </button>
                      </div>
                    )}
                  </Section>

                  <Section title="Name & number" icon={Type} defaultOpen={false}>
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">Name</label>
                      <input
                        value={currentConfig.customText}
                        onChange={(e) => patchActiveSide({ customText: e.target.value })}
                        maxLength={14}
                        placeholder="e.g. JOHNSON"
                        className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2.5 text-base uppercase text-white placeholder-zinc-600 outline-none focus:border-red-500/50 sm:py-2 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">Number</label>
                      <input
                        value={currentConfig.customNumber}
                        onChange={(e) =>
                          patchActiveSide({
                            customNumber: e.target.value.replace(/\D/g, "").slice(0, 2),
                          })
                        }
                        maxLength={2}
                        placeholder="e.g. 10"
                        className="w-full rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2.5 text-base text-white placeholder-zinc-600 outline-none focus:border-red-500/50 sm:py-2 sm:text-sm"
                      />
                    </div>
                  </Section>

                  <Section title="Notes" icon={Type} defaultOpen={false}>
                    <textarea
                      value={currentConfig.notes}
                      onChange={(e) => patchActiveSide({ notes: e.target.value })}
                      rows={4}
                      maxLength={2000}
                      placeholder="Special instructions for this side…"
                      className="w-full resize-none rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2.5 text-base text-white placeholder-zinc-600 outline-none focus:border-red-500/50 sm:py-2 sm:text-sm"
                    />
                  </Section>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
