
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, MessageCircle, Trash2, Loader2,
  CheckCircle2, ArrowRight, Lock, Eye, Download,
  Shirt, Package, ChevronRight, X, AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PRODUCT_TYPES = [
  { id: "jersey",         label: "Jersey",          desc: "Sports jersey" },
  { id: "shirt",          label: "Shirt",           desc: "Button-up / polo" },
  { id: "trouser",        label: "Trouser",         desc: "Sports trousers" },
  { id: "tracksuit",      label: "Tracksuit",       desc: "Full set" },
  { id: "hoodie",         label: "Hoodie",          desc: "Zip / pullover" },
  { id: "sportswear-set", label: "Sportswear Set",  desc: "Complete kit" },
  { id: "other",          label: "Other",           desc: "Custom concept" },
] as const;

type ProductType = typeof PRODUCT_TYPES[number]["id"];

const STATUS_COLORS: Record<string, string> = {
  draft:       "bg-zinc-500/15 text-zinc-400",
  sent:        "bg-blue-500/15 text-blue-400",
  reviewed:    "bg-yellow-500/15 text-yellow-400",
  in_progress: "bg-orange-500/15 text-orange-400",
  completed:   "bg-green-500/15 text-green-400",
};

interface UploadedDesign {
  _id: string;
  designTitle: string;
  productType: string;
  fileUrl: string;
  fileType: string;
  fileName: string;
  quantity: number;
  preferredFabric?: string;
  preferredColors?: string;
  sizeRange?: string;
  customizationNotes?: string;
  country?: string;
  companyName?: string;
  additionalMessage?: string;
  inquiryStatus: string;
  createdAt: string;
}

const EMPTY_FORM = {
  designTitle:        "",
  productType:        "" as ProductType | "",
  quantity:           50,
  preferredFabric:    "",
  preferredColors:    "",
  sizeRange:          "",
  customizationNotes: "",
  country:            "",
  companyName:        "",
  additionalMessage:  "",
};

function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function isImageType(fileType: string) {
  return ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(fileType);
}

function DesignCard({
  design,
  onDelete,
  onWhatsApp,
  deleting,
}: {
  design: UploadedDesign;
  onDelete: (id: string) => void;
  onWhatsApp: (d: UploadedDesign) => void;
  deleting: string | null;
}) {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
  const isImg = isImageType(design.fileType);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl border border-white/[0.07] bg-zinc-900/60 overflow-hidden"
    >
      {/* Preview */}
      <div className="relative h-44 bg-zinc-900 flex items-center justify-center overflow-hidden">
        {isImg ? (
          <Image
            src={design.fileUrl}
            alt={design.designTitle}
            fill
            className="object-contain p-3"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <FileText className="h-12 w-12" />
            <span className="text-xs">{design.fileName}</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[design.inquiryStatus] ?? STATUS_COLORS.draft}`}>
            {cap(design.inquiryStatus)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-white truncate">{design.designTitle}</h3>
        <p className="mt-0.5 text-xs text-zinc-500">{cap(design.productType)} · Qty: {design.quantity}</p>
        <p className="mt-0.5 text-[10px] text-zinc-600">
          {new Date(design.createdAt).toLocaleDateString()}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onWhatsApp(design)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#25D366]/30 bg-[#25D366]/10 py-2 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Inquire
          </button>
          {!isImg && (
            <a
              href={design.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-lg border border-white/[0.07] p-2 text-zinc-500 hover:border-blue-500/30 hover:text-blue-400 transition-colors"
              title="View file"
            >
              <Download className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            onClick={() => onDelete(design._id)}
            disabled={deleting === design._id}
            className="flex items-center justify-center rounded-lg border border-white/[0.07] p-2 text-zinc-500 hover:border-red-500/30 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            {deleting === design._id
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-zinc-600">
          Opens WhatsApp — tap <strong className="text-zinc-500">Send</strong> to submit
        </p>
      </div>
    </motion.div>
  );
}

export default function UploadDesignPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    fileName: string;
    fileType: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [designs, setDesigns] = useState<UploadedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const update = useCallback(<K extends keyof typeof form>(key: K, val: typeof form[K]) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setError("");
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    fetch("/api/upload-designs")
      .then(r => r.json())
      .then(d => setDesigns(d.designs ?? []))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/user-upload", { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      setUploading(false);
      return;
    }

    setUploadedFile({
      url:      data.url,
      fileName: data.fileName,
      fileType: data.fileType,
    });
    setUploading(false);
  }

  async function handleSave() {
    if (!form.designTitle.trim()) {
      setError("Design title is required");
      return;
    }
    if (!form.productType) {
      setError("Product type is required");
      return;
    }
    if (!uploadedFile) {
      setError("Please upload a design file");
      return;
    }
    if (form.quantity < 50) {
      setError("Minimum order quantity is 50 pieces");
      return;
    }

    setSaving(true);
    setError("");

    const body = {
      ...form,
      fileUrl:  uploadedFile.url,
      fileType: uploadedFile.fileType,
      fileName: uploadedFile.fileName,
    };

    const res = await fetch("/api/upload-designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to save design");
      setSaving(false);
      return;
    }

    setSaved(true);
    setDesigns(prev => [data.design, ...prev]);
    setForm({ ...EMPTY_FORM });
    setUploadedFile(null);
    if (fileRef.current) fileRef.current.value = "";

    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/upload-designs/${id}`, { method: "DELETE" });
    setDesigns(prev => prev.filter(d => d._id !== id));
    setDeleting(null);
  }

  function handleWhatsApp(d: UploadedDesign) {
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
    const fileLink = `${window.location.origin}${d.fileUrl}`;
    const lines = [
      "Hello,",
      "",
      "I am contacting you from the Megacore International website.",
      "I have uploaded my own custom apparel design and would like to discuss production details.",
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "📎 VIEW MY DESIGN FILE:",
      fileLink,
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      user ? [
        "👤 My account details:",
        `Name: ${user.name}`,
        `Email: ${user.email}`,
        user.company ? `Company: ${user.company}` : null,
        user.country ? `Country: ${user.country}` : null,
      ].filter(Boolean).join("\n") : null,
      user ? "" : null,
      "🎨 Design details:",
      `Title: ${d.designTitle}`,
      `Product Type: ${cap(d.productType)}`,
      `Quantity: ${d.quantity} pcs`,
      d.preferredFabric ? `Fabric: ${d.preferredFabric}` : null,
      d.preferredColors ? `Colors: ${d.preferredColors}` : null,
      d.sizeRange ? `Sizes: ${d.sizeRange}` : null,
      d.companyName ? `Company: ${d.companyName}` : null,
      d.country ? `Country: ${d.country}` : null,
      d.customizationNotes ? `\nNotes: ${d.customizationNotes}` : null,
      d.additionalMessage ? `Message: ${d.additionalMessage}` : null,
      "",
      "Please open the design link above, review my design, and share pricing, MOQ details, and next steps.",
      "",
      "Thank you.",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/923265630218?text=${encodeURIComponent(lines)}`, "_blank");
  }

  const inputCls = "w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50 transition-colors";

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <main className="min-h-screen bg-black">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.07),transparent_60%)]" />

        {/* Hero */}
        <section className="relative px-6 pb-16 pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <FadeUp>
              <span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-red-400">
                <span className="h-px w-6 bg-red-500" />Upload Your Design<span className="h-px w-6 bg-red-500" />
              </span>
              <h1 className="mb-4 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
                Send Your Own<br />
                <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Apparel Design</span>
              </h1>
              <p className="mx-auto max-w-xl text-[1.0625rem] leading-relaxed text-zinc-400">
                Already have a design? Upload your artwork, add production details, and send it directly for a professional quote.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* What you can upload */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-6xl">
            <FadeUp className="mb-10 text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-400">Accepted Design Types</span>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">What You Can Upload</h2>
            </FadeUp>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Shirt,   title: "Teamwear Designs",    desc: "Existing jersey, tracksuit, or kit artwork ready for production." },
                { icon: Upload,  title: "Reference Designs",   desc: "Inspiration images, reference apparel, or concept sketches." },
                { icon: Package, title: "Logo & Brand Assets", desc: "Your team logo, brand identity, or custom graphics." },
                { icon: Eye,     title: "Complete Outfit Concepts", desc: "Full outfit designs with color breakdowns and specifications." },
                { icon: FileText, title: "Technical Drawings", desc: "Flat sketches, tech packs, or CAD files for precise manufacturing." },
                { icon: Shirt,   title: "Custom Jersey Art",   desc: "Sublimation-ready artwork or print-ready design files." },
              ].map(({ icon: Icon, title, desc }) => (
                <FadeUp key={title}>
                  <div className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                      <Icon className="h-4 w-4 text-red-400" />
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-white">{title}</h3>
                    <p className="text-xs leading-relaxed text-zinc-500">{desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Process steps */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <FadeUp className="mb-8 text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-400">How It Works</span>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">Simple 5-Step Process</h2>
            </FadeUp>
            <div className="grid gap-4 sm:grid-cols-5">
              {[
                { n: "01", title: "Upload",       desc: "Upload your design file" },
                { n: "02", title: "Add Details",  desc: "Fill in production requirements" },
                { n: "03", title: "Save",         desc: "Save your design request" },
                { n: "04", title: "Send Inquiry", desc: "Send to WhatsApp with one click" },
                { n: "05", title: "Get Quote",    desc: "We review and send pricing" },
              ].map(({ n, title, desc }) => (
                <FadeUp key={n} delay={parseInt(n) * 0.05}>
                  <div className="rounded-xl border border-white/[0.07] bg-zinc-900/40 p-4 text-center">
                    <div className="mb-2 text-2xl font-black text-red-500/30">{n}</div>
                    <h3 className="mb-1 text-xs font-bold text-white">{title}</h3>
                    <p className="text-[10px] text-zinc-500">{desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* File requirements */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <FadeUp>
              <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/40 p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">File Requirements</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Accepted Formats</p>
                    <p className="text-sm text-white">JPG, PNG, WebP, PDF, SVG</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Max File Size</p>
                    <p className="text-sm text-white">10 MB</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Min. Order Quantity</p>
                    <p className="text-sm text-white">50 pieces (MOQ)</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Auth gate / Upload form */}
        <section className="px-6 pb-24" id="upload">
          <div className="mx-auto max-w-3xl">
            <FadeUp className="mb-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-400">Upload Studio</span>
              <h2 className="mt-1 text-2xl font-black uppercase text-white">Upload Your Design</h2>
            </FadeUp>

            {!isAuthenticated ? (
              <FadeUp>
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <Lock className="h-7 w-7 text-red-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-black uppercase text-white">Login Required</h3>
                  <p className="mb-6 text-sm text-zinc-400">
                    Create a free account or sign in to upload your design and send it for production inquiry.
                  </p>
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-red-500 transition-colors"
                  >
                    Login / Register to Upload
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </FadeUp>
            ) : (
              <FadeUp>
                <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-6 sm:p-8">
                  <div className="space-y-6">

                    {/* File upload zone */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">
                        Design File <span className="text-red-400">*</span>
                      </label>
                      <label
                        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${
                          uploadedFile
                            ? "border-green-500/40 bg-green-500/5"
                            : "border-white/[0.12] bg-white/[0.02] hover:border-red-500/30"
                        }`}
                      >
                        {uploading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                        ) : uploadedFile ? (
                          <>
                            {isImageType(uploadedFile.fileType) ? (
                              <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                                <Image src={uploadedFile.url} alt="preview" fill className="object-contain" />
                              </div>
                            ) : (
                              <FileText className="h-12 w-12 text-zinc-400" />
                            )}
                            <div className="text-center">
                              <p className="text-sm font-medium text-green-400">✓ File uploaded</p>
                              <p className="text-xs text-zinc-500">{uploadedFile.fileName}</p>
                            </div>
                            <button
                              type="button"
                              onClick={e => { e.preventDefault(); setUploadedFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                            >
                              <X className="h-3 w-3" /> Remove
                            </button>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-zinc-500" />
                            <div className="text-center">
                              <p className="text-sm font-medium text-zinc-300">Click to upload your design</p>
                              <p className="text-xs text-zinc-600">JPG, PNG, WebP, PDF, SVG — max 10MB</p>
                            </div>
                          </>
                        )}
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,.pdf,.svg"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>

                    {/* Design title */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">
                        Design Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={form.designTitle}
                        onChange={e => update("designTitle", e.target.value)}
                        placeholder="e.g. Team Alpha Jersey 2025"
                        className={inputCls}
                      />
                    </div>

                    {/* Product type */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">
                        Product Type <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {PRODUCT_TYPES.map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => update("productType", t.id)}
                            className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
                              form.productType === t.id
                                ? "border-red-500/50 bg-red-500/10 text-red-300"
                                : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            <p className="text-xs font-bold">{t.label}</p>
                            <p className="mt-0.5 text-[10px] text-zinc-600">{t.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">
                        Quantity <span className="text-red-400">*</span>
                        <span className="ml-2 text-[10px] text-zinc-500">(min. 50 pcs)</span>
                      </label>
                      <input
                        type="number"
                        min={50}
                        value={form.quantity}
                        onChange={e => update("quantity", Math.max(50, parseInt(e.target.value) || 50))}
                        className={inputCls}
                      />
                    </div>

                    {/* Optional fields grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-300">Preferred Fabric</label>
                        <input
                          value={form.preferredFabric}
                          onChange={e => update("preferredFabric", e.target.value)}
                          placeholder="e.g. 100% Polyester, Dri-Fit"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-300">Preferred Colors</label>
                        <input
                          value={form.preferredColors}
                          onChange={e => update("preferredColors", e.target.value)}
                          placeholder="e.g. Red, White, Black"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-300">Size Range</label>
                        <input
                          value={form.sizeRange}
                          onChange={e => update("sizeRange", e.target.value)}
                          placeholder="e.g. S, M, L, XL, XXL"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-300">Company Name</label>
                        <input
                          value={form.companyName}
                          onChange={e => update("companyName", e.target.value)}
                          placeholder="Your company or team name"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-300">Country</label>
                        <input
                          value={form.country}
                          onChange={e => update("country", e.target.value)}
                          placeholder="Your country"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">Customization Notes</label>
                      <textarea
                        value={form.customizationNotes}
                        onChange={e => update("customizationNotes", e.target.value)}
                        rows={3}
                        placeholder="Describe any specific customization requirements, logo placement, special instructions..."
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    {/* Additional message */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-300">Additional Message</label>
                      <textarea
                        value={form.additionalMessage}
                        onChange={e => update("additionalMessage", e.target.value)}
                        rows={2}
                        placeholder="Anything else you'd like us to know..."
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                      </div>
                    )}

                    {/* Save button */}
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-500 disabled:opacity-60"
                    >
                      {saving ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                      ) : saved ? (
                        <><CheckCircle2 className="h-4 w-4" /> Design Saved!</>
                      ) : (
                        <><Upload className="h-4 w-4" /> Save Design</>
                      )}
                      <span aria-hidden className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    </button>

                    {saved && (
                      <p className="text-center text-xs text-green-400">
                        ✓ Design saved — scroll down to view and send your inquiry via WhatsApp.
                      </p>
                    )}
                  </div>
                </div>
              </FadeUp>
            )}
          </div>
        </section>

        {/* Saved designs gallery */}
        {isAuthenticated && (
          <section className="px-6 pb-24">
            <div className="mx-auto max-w-6xl">
              <FadeUp className="mb-8 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-red-400">Your Uploads</span>
                  <h2 className="mt-1 text-2xl font-black uppercase text-white">Saved Designs</h2>
                </div>
                <Link
                  href="/customize/my-designs"
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Customized Designs <ChevronRight className="h-3 w-3" />
                </Link>
              </FadeUp>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                </div>
              ) : designs.length === 0 ? (
                <FadeUp>
                  <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/40 py-16 text-center">
                    <Upload className="mx-auto mb-3 h-10 w-10 text-zinc-700" />
                    <p className="text-sm text-zinc-500">No uploaded designs yet.</p>
                    <p className="mt-1 text-xs text-zinc-600">Upload your first design above.</p>
                  </div>
                </FadeUp>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {designs.map(d => (
                      <DesignCard
                        key={d._id}
                        design={d}
                        onDelete={handleDelete}
                        onWhatsApp={handleWhatsApp}
                        deleting={deleting}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
