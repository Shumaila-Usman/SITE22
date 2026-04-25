
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Modal, Spinner, Empty, toast, ConfirmModal } from "@/components/admin/ui";
import { Eye, Loader2, Trash2, Download, FileText } from "lucide-react";

interface DesignUser {
  _id: string;
  name: string;
  email: string;
  company?: string;
  country?: string;
}

interface UploadedDesign {
  _id: string;
  userId: DesignUser;
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

const STATUSES = ["draft", "sent", "reviewed", "in_progress", "completed"];

const STATUS_COLORS: Record<string, string> = {
  draft:       "bg-zinc-500/15 text-zinc-400",
  sent:        "bg-blue-500/15 text-blue-400",
  reviewed:    "bg-yellow-500/15 text-yellow-400",
  in_progress: "bg-orange-500/15 text-orange-400",
  completed:   "bg-green-500/15 text-green-400",
};

function isImage(fileType: string) {
  return ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(fileType);
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ").replace(/-/g, " ");

export default function AdminUploadedDesignsPage() {
  const [designs, setDesigns]     = useState<UploadedDesign[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setStatus] = useState("");
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState<UploadedDesign | null>(null);
  const [updating, setUpdating]   = useState(false);
  const [delId, setDelId]         = useState<string | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (statusFilter) params.set("status", statusFilter);
    const res  = await fetch(`/api/admin/upload-designs?${params}`);
    const data = await res.json();
    setDesigns(data.designs ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleStatusUpdate(id: string, status: string) {
    setUpdating(true);
    const res  = await fetch(`/api/admin/upload-designs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryStatus: status }),
    });
    const data = await res.json();
    if (res.ok) {
      toast("success", "Status updated");
      setDesigns(prev => prev.map(d => d._id === id ? { ...d, inquiryStatus: status } : d));
      if (selected?._id === id) setSelected({ ...selected, inquiryStatus: status });
    } else {
      toast("error", data.error ?? "Failed");
    }
    setUpdating(false);
  }

  async function handleDelete() {
    if (!delId) return;
    setDeleting(true);
    const res  = await fetch(`/api/admin/upload-designs/${delId}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      toast("success", "Design deleted");
      setDesigns(prev => prev.filter(d => d._id !== delId));
      setTotal(t => t - 1);
      if (selected?._id === delId) setSelected(null);
    } else {
      toast("error", data.error ?? "Failed");
    }
    setDelId(null);
    setDeleting(false);
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Uploaded Designs</h1>
            <p className="text-sm text-zinc-500">{total} total</p>
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="rounded-lg border border-white/[0.1] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All statuses</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{cap(s)}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111]">
          {loading ? <Spinner /> : designs.length === 0 ? <Empty message="No uploaded designs found" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07] text-left text-xs text-zinc-500">
                    <th className="px-4 py-3 font-medium">Preview</th>
                    <th className="px-4 py-3 font-medium">Design</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {designs.map(d => (
                    <tr key={d._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-white/[0.07] bg-zinc-900 flex items-center justify-center">
                          {isImage(d.fileType) ? (
                            <Image src={d.fileUrl} alt={d.designTitle} fill className="object-contain p-1" />
                          ) : (
                            <FileText className="h-5 w-5 text-zinc-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-white max-w-[140px] truncate">{d.designTitle}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white">{d.userId?.name ?? "—"}</p>
                        <p className="text-xs text-zinc-500">{d.userId?.email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 capitalize text-zinc-400">{cap(d.productType)}</td>
                      <td className="px-4 py-3 text-zinc-400">{d.quantity}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[d.inquiryStatus] ?? STATUS_COLORS.draft}`}>
                          {cap(d.inquiryStatus)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelected(d)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-white"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {!isImage(d.fileType) && (
                            <a
                              href={d.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-blue-400"
                              title="Download file"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => setDelId(d._id)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-sm ${p === page ? "bg-red-600 text-white" : "border border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Uploaded Design Details">
        {selected && (
          <div className="space-y-5">
            {/* File preview */}
            <div className="flex items-center justify-center rounded-xl border border-white/[0.07] bg-zinc-900/60 p-4" style={{ minHeight: 200 }}>
              {isImage(selected.fileType) ? (
                <div className="relative w-full" style={{ height: 240 }}>
                  <Image
                    src={selected.fileUrl}
                    alt={selected.designTitle}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 text-zinc-500">
                  <FileText className="h-16 w-16" />
                  <p className="text-sm">{selected.fileName}</p>
                  <a
                    href={selected.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/[0.1] px-4 py-2 text-xs text-zinc-300 hover:bg-white/[0.04]"
                  >
                    <Download className="h-3.5 w-3.5" /> View / Download File
                  </a>
                </div>
              )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Design Title",   value: selected.designTitle },
                { label: "Product Type",   value: cap(selected.productType) },
                { label: "Quantity",       value: String(selected.quantity) },
                { label: "File Name",      value: selected.fileName },
                { label: "Preferred Fabric", value: selected.preferredFabric || "—" },
                { label: "Preferred Colors", value: selected.preferredColors || "—" },
                { label: "Size Range",     value: selected.sizeRange || "—" },
                { label: "Company",        value: selected.companyName || selected.userId?.company || "—" },
                { label: "Country",        value: selected.country || selected.userId?.country || "—" },
                { label: "Customer",       value: selected.userId?.name ?? "—" },
                { label: "Email",          value: selected.userId?.email ?? "—" },
                { label: "Created",        value: new Date(selected.createdAt).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
                  <p className="mt-0.5 text-sm text-white truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Notes */}
            {selected.customizationNotes && (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Customization Notes</p>
                <p className="text-sm text-zinc-300">{selected.customizationNotes}</p>
              </div>
            )}
            {selected.additionalMessage && (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Additional Message</p>
                <p className="text-sm text-zinc-300">{selected.additionalMessage}</p>
              </div>
            )}

            {/* Status update */}
            <div>
              <p className="mb-2 text-xs text-zinc-400">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    disabled={updating || selected.inquiryStatus === s}
                    onClick={() => handleStatusUpdate(selected._id, s)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-50 ${
                      selected.inquiryStatus === s
                        ? "border-red-500/50 bg-red-500/10 text-red-300"
                        : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {updating && selected.inquiryStatus !== s && <Loader2 className="h-3 w-3 animate-spin" />}
                    {cap(s)}
                  </button>
                ))}
              </div>
            </div>

            {/* Delete */}
            <div className="border-t border-white/[0.06] pt-4">
              <button
                onClick={() => setDelId(selected._id)}
                className="flex items-center gap-2 rounded-lg border border-red-500/20 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Design
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!delId}
        title="Delete Uploaded Design"
        message="This will permanently remove the uploaded design record."
        onConfirm={handleDelete}
        onCancel={() => setDelId(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
}
