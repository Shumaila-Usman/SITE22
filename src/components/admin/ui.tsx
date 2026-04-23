"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
interface ToastMsg { id: number; type: ToastType; message: string }

let _addToast: ((t: ToastType, m: string) => void) | null = null;

export function toast(type: ToastType, message: string) {
  _addToast?.(type, message);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  _addToast = (type, message) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${
            t.type === "success"
              ? "border-green-500/30 bg-green-950/80 text-green-300"
              : "border-red-500/30 bg-red-950/80 text-red-300"
          }`}
        >
          <span>{t.message}</span>
          <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}>
            <X className="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
interface ConfirmProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }: ConfirmProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#111] p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-zinc-400">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} disabled={loading}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.04]">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60">
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#111] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
          <h2 className="font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Form field ───────────────────────────────────────────────────────────────
export function Field({ label, error, children, required }: {
  label: string; error?: string; children: React.ReactNode; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-300">
        {label}{required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export const inputCls = "w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20";
export const selectCls = "w-full rounded-lg border border-white/[0.1] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-red-500/50";

// ─── Stat card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number | string; icon: React.ElementType; color: string
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
          <p className="mt-1 text-3xl font-black text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
      active ? "bg-green-500/15 text-green-400" : "bg-zinc-500/15 text-zinc-400"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-green-400" : "bg-zinc-500"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// ─── Loading spinner ──────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-red-500" />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
      <p className="text-sm">{message}</p>
    </div>
  );
}
