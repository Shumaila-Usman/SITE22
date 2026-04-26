"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Modal, Spinner, Empty, toast } from "@/components/admin/ui";
import { Eye, Loader2 } from "lucide-react";
import { OutfitPreview, OutfitConfig } from "@/components/outfit-preview";
import type { GarmentSide, SideDesignConfig } from "@/lib/customization-types";
import { SIDE_LABELS } from "@/lib/customization-types";

interface DesignUser {
  _id: string;
  name: string;
  email: string;
  company?: string;
  country?: string;
}
interface StripeInfo {
  enabled: boolean;
  position: string;
  count: number;
  thickness: string;
  color: string;
  color2?: string;
  color3?: string;
  bothSides?: boolean;
}
interface PanelInfo {
  chestPanel?: string;
  sidePanel?: string;
  sleevePanel?: string;
  cuffColor?: string;
  collarColor?: string;
}

interface Design {
  _id: string;
  userId: DesignUser;
  title: string;
  customizationVersion?: number;
  templatePreviewPath?: string;
  imageTemplateId?: string;
  imageGarmentCategory?: string;
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
  designConfig?: {
    version?: number;
    templateId?: string;
    category?: string;
    sideImages?: Partial<Record<string, string>>;
    sides?: Partial<Record<GarmentSide, SideDesignConfig>>;
    stripes?: StripeInfo;
    panels?: PanelInfo;
  };
}

const STATUSES = ["draft", "sent", "reviewed", "in_progress", "completed"];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-zinc-500/15 text-zinc-400",
  sent: "bg-blue-500/15 text-blue-400",
  reviewed: "bg-yellow-500/15 text-yellow-400",
  in_progress: "bg-orange-500/15 text-orange-400",
  completed: "bg-green-500/15 text-green-400",
};

const ALL_SIDES: GarmentSide[] = ["front", "back", "left", "right"];

function isImageTemplateDesign(d: Design): boolean {
  return d.customizationVersion === 2 || d.designConfig?.version === 2;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function AdminSideReadout({ side, cfg }: { side: GarmentSide; cfg?: SideDesignConfig }) {
  if (!cfg) return null;
  const st = cfg.stripes;
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-400">{SIDE_LABELS[side]}</p>
      <div className="grid gap-2 text-xs text-zinc-300">
        <p>
          <span className="text-zinc-500">Colors: </span>
          Primary {cfg.primaryColor} · Secondary {cfg.secondaryColor} · Accent {cfg.accentColor}
        </p>
        <p>
          <span className="text-zinc-500">Stripes: </span>
          {st.enabled
            ? `Yes · ${cap(st.position)} · ${cap(st.thickness)} · ${st.color}`
            : "No"}
        </p>
        <p>
          <span className="text-zinc-500">Text / number: </span>
          {(cfg.customText || "—") + " / " + (cfg.customNumber || "—")}
        </p>
        <p>
          <span className="text-zinc-500">Logo: </span>
          {cfg.logoUrl ? (
            <span className="inline-flex items-center gap-2 align-middle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cfg.logoUrl} alt="" className="inline h-8 w-8 rounded border border-white/10 object-contain" />
              <span className="break-all font-mono text-[10px] text-zinc-500">{cfg.logoUrl}</span>
            </span>
          ) : (
            "—"
          )}
        </p>
        {cfg.notes ? (
          <p className="whitespace-pre-wrap text-zinc-400">
            <span className="text-zinc-500">Notes: </span>
            {cfg.notes}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Design | null>(null);
  const [updating, setUpdating] = useState(false);
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/designs?${params}`);
    const data = await res.json();
    setDesigns(data.designs ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusUpdate(id: string, status: string) {
    setUpdating(true);
    const res = await fetch(`/api/admin/designs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryStatus: status }),
    });
    const data = await res.json();
    if (res.ok) {
      toast("success", "Status updated");
      setDesigns((prev) => prev.map((d) => (d._id === id ? { ...d, inquiryStatus: status } : d)));
      if (selected?._id === id) setSelected({ ...selected, inquiryStatus: status });
    } else {
      toast("error", data.error ?? "Failed");
    }
    setUpdating(false);
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Custom Designs</h1>
            <p className="text-sm text-zinc-500">{total} total</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-white/[0.1] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111]">
          {loading ? (
            <Spinner />
          ) : designs.length === 0 ? (
            <Empty message="No designs found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07] text-left text-xs text-zinc-500">
                    <th className="px-4 py-3 font-medium">Preview</th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Garment</th>
                    <th className="px-4 py-3 font-medium">Colors</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {designs.map((d) => (
                    <tr key={d._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-white/[0.07] bg-zinc-900 p-1">
                          {isImageTemplateDesign(d) && d.templatePreviewPath ? (
                            <Image
                              src={d.templatePreviewPath}
                              alt=""
                              fill
                              className="object-contain p-0.5"
                              unoptimized
                            />
                          ) : (
                            <OutfitPreview
                              config={{
                                productTemplate: d.productTemplate as OutfitConfig["productTemplate"],
                                primaryColor: d.primaryColor,
                                secondaryColor: d.secondaryColor,
                                accentColor: d.accentColor,
                                sleeveColor: d.sleeveColor,
                                collarColor: d.collarColor,
                                stripeColor: d.stripeColor,
                                logoUrl: d.logoUrl,
                                logoPosition: d.logoPosition as OutfitConfig["logoPosition"],
                                customText: d.customText,
                                customNumber: d.customNumber,
                                fabricPattern: d.fabricPattern as OutfitConfig["fabricPattern"],
                                stripes: d.designConfig?.stripes as OutfitConfig["stripes"],
                                panels: d.designConfig?.panels as OutfitConfig["panels"],
                              }}
                              className="h-full w-full"
                            />
                          )}
                        </div>
                      </td>
                      <td className="max-w-[140px] truncate px-4 py-3 font-medium text-white">{d.title}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white">{d.userId?.name ?? "—"}</p>
                        <p className="text-xs text-zinc-500">{d.userId?.email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {isImageTemplateDesign(d)
                          ? d.imageGarmentCategory ?? d.designConfig?.category ?? "—"
                          : d.productTemplate}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {[d.primaryColor, d.secondaryColor, d.sleeveColor].map((c, i) => (
                            <div
                              key={i}
                              className="h-4 w-4 rounded-full border border-white/10"
                              style={{ backgroundColor: c }}
                              title={c}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            STATUS_COLORS[d.inquiryStatus] ?? STATUS_COLORS.draft
                          }`}
                        >
                          {d.inquiryStatus.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelected(d)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-sm ${
                  p === page
                    ? "bg-red-600 text-white"
                    : "border border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Design Details">
        {selected && isImageTemplateDesign(selected) && (
          <div className="max-h-[75vh] space-y-5 overflow-y-auto pr-1">
            <div className="relative mx-auto h-56 w-48">
              {selected.templatePreviewPath ? (
                <Image
                  src={selected.templatePreviewPath}
                  alt=""
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Title", value: selected.title },
                { label: "Category", value: selected.imageGarmentCategory ?? selected.designConfig?.category ?? "—" },
                { label: "Template ID", value: selected.imageTemplateId ?? selected.designConfig?.templateId ?? "—" },
                { label: "User", value: selected.userId?.name ?? "—" },
                { label: "Email", value: selected.userId?.email ?? "—" },
                { label: "Company", value: selected.userId?.company || "—" },
                { label: "Country", value: selected.userId?.country || "—" },
                { label: "Created", value: new Date(selected.createdAt).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
                  <p className="mt-0.5 truncate text-sm text-white">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">Per-side specification</p>
            <div className="grid gap-3">
              {ALL_SIDES.map((side) => {
                const cfg = selected.designConfig?.sides?.[side];
                if (!cfg) return null;
                return <AdminSideReadout key={side} side={side} cfg={cfg} />;
              })}
            </div>
            <div>
              <p className="mb-2 text-xs text-zinc-400">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={updating || selected.inquiryStatus === s}
                    onClick={() => handleStatusUpdate(selected._id, s)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-50 ${
                      selected.inquiryStatus === s
                        ? "border-red-500/50 bg-red-500/10 text-red-300"
                        : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {updating && selected.inquiryStatus !== s && <Loader2 className="h-3 w-3 animate-spin" />}
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selected && !isImageTemplateDesign(selected) && (
          <div className="space-y-5">
            <div className="flex items-center justify-center rounded-xl border border-white/[0.07] bg-zinc-900/60 p-6" style={{ height: 260 }}>
              <OutfitPreview
                config={{
                  productTemplate: selected.productTemplate as OutfitConfig["productTemplate"],
                  primaryColor: selected.primaryColor,
                  secondaryColor: selected.secondaryColor,
                  accentColor: selected.accentColor,
                  sleeveColor: selected.sleeveColor,
                  collarColor: selected.collarColor,
                  stripeColor: selected.stripeColor,
                  logoUrl: selected.logoUrl,
                  logoPosition: selected.logoPosition as OutfitConfig["logoPosition"],
                  customText: selected.customText,
                  customNumber: selected.customNumber,
                  fabricPattern: selected.fabricPattern as OutfitConfig["fabricPattern"],
                  stripes: selected.designConfig?.stripes as OutfitConfig["stripes"],
                  panels: selected.designConfig?.panels as OutfitConfig["panels"],
                }}
                className="h-full w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Title", value: selected.title },
                { label: "Product", value: selected.productTemplate },
                { label: "Pattern", value: selected.fabricPattern },
                { label: "Logo Position", value: selected.logoPosition },
                { label: "Custom Text", value: selected.customText || "—" },
                { label: "Custom Number", value: selected.customNumber || "—" },
                { label: "User", value: selected.userId?.name ?? "—" },
                { label: "Email", value: selected.userId?.email ?? "—" },
                { label: "Company", value: selected.userId?.company || "—" },
                { label: "Country", value: selected.userId?.country || "—" },
                { label: "Created", value: new Date(selected.createdAt).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
                  <p className="mt-0.5 truncate text-sm text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
              <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Colors</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Primary", color: selected.primaryColor },
                  { label: "Secondary", color: selected.secondaryColor },
                  { label: "Sleeve", color: selected.sleeveColor },
                  { label: "Collar", color: selected.collarColor },
                  { label: "Stripe", color: selected.stripeColor },
                  { label: "Accent", color: selected.accentColor },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                    <span className="text-xs text-zinc-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {selected.designConfig?.stripes?.enabled && (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Stripe Configuration</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Position", value: selected.designConfig.stripes.position },
                    { label: "Count", value: String(selected.designConfig.stripes.count) },
                    { label: "Thickness", value: selected.designConfig.stripes.thickness },
                    {
                      label: "Both Sides",
                      value: selected.designConfig.stripes.bothSides !== false ? "Yes" : "No",
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between rounded bg-white/[0.03] px-2 py-1">
                      <span className="text-zinc-500">{label}</span>
                      <span className="capitalize text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-zinc-500">Stripe Colors:</span>
                  {[
                    selected.designConfig.stripes.color,
                    selected.designConfig.stripes.count >= 2 ? selected.designConfig.stripes.color2 : null,
                    selected.designConfig.stripes.count >= 3 ? selected.designConfig.stripes.color3 : null,
                  ]
                    .filter(Boolean)
                    .map((c, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: c! }} />
                        <span className="font-mono text-[10px] text-zinc-400">{c}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {selected.designConfig?.panels && (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">Panel Colors</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Chest", color: selected.designConfig.panels.chestPanel },
                    { label: "Side", color: selected.designConfig.panels.sidePanel },
                    { label: "Sleeve", color: selected.designConfig.panels.sleevePanel },
                    { label: "Cuff", color: selected.designConfig.panels.cuffColor },
                    { label: "Collar", color: selected.designConfig.panels.collarColor },
                  ]
                    .filter((p) => p.color)
                    .map(({ label, color }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <div className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                        <span className="text-xs text-zinc-400">{label}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs text-zinc-400">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={updating || selected.inquiryStatus === s}
                    onClick={() => handleStatusUpdate(selected._id, s)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-50 ${
                      selected.inquiryStatus === s
                        ? "border-red-500/50 bg-red-500/10 text-red-300"
                        : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {updating && selected.inquiryStatus !== s && <Loader2 className="h-3 w-3 animate-spin" />}
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
