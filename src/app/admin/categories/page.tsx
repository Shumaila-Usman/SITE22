"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ConfirmModal, Modal, Field, inputCls, Badge, Spinner, Empty, toast } from "@/components/admin/ui";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Category {
  _id: string; name: string; slug: string; description?: string;
  image?: string; isActive: boolean; order: number; createdAt: string;
}

const EMPTY = { name: "", slug: "", description: "", image: "", isActive: true, order: 0 };

export default function CategoriesPage() {
  const [cats, setCats]         = useState<Category[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Category | null>(null);
  const [form, setForm]         = useState({ ...EMPTY });
  const [saving, setSaving]     = useState(false);
  const [delId, setDelId]       = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCats(data.categories ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setForm({ ...EMPTY }); setModal("create"); }
  function openEdit(c: Category) {
    setSelected(c);
    setForm({ name: c.name, slug: c.slug, description: c.description ?? "", image: c.image ?? "", isActive: c.isActive, order: c.order });
    setModal("edit");
  }

  async function handleSave() {
    if (!form.name.trim()) { toast("error", "Name is required"); return; }
    setSaving(true);
    const url    = modal === "create" ? "/api/admin/categories" : `/api/admin/categories/${selected!._id}`;
    const method = modal === "create" ? "POST" : "PATCH";
    const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data   = await res.json();
    if (!res.ok) { toast("error", data.error ?? "Failed"); setSaving(false); return; }
    toast("success", modal === "create" ? "Category created" : "Category updated");
    setModal(null); load(); setSaving(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const res  = await fetch(`/api/admin/categories/${delId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { toast("error", data.error ?? "Failed"); setDeleting(false); return; }
    toast("success", "Category deleted");
    setDelId(null); setDeleting(false); load();
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Categories</h1>
            <p className="text-sm text-zinc-500">{cats.length} total</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111]">
          {loading ? <Spinner /> : cats.length === 0 ? <Empty message="No categories yet" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07] text-left text-xs text-zinc-500">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cats.map(c => (
                    <tr key={c._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-400">{c.slug}</td>
                      <td className="px-4 py-3 text-zinc-400 max-w-xs truncate">{c.description ?? "—"}</td>
                      <td className="px-4 py-3"><Badge active={c.isActive} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(c)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-white">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDelId(c._id)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400">
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
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "create" ? "Add Category" : "Edit Category"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Sports Wear" />
          </Field>
          <Field label="Slug" >
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputCls} placeholder="auto-generated if empty" />
          </Field>
          <Field label="Description" >
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} placeholder="Short description" />
          </Field>
          <Field label="Image URL">
            <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className={inputCls} placeholder="/images/..." />
          </Field>
          <Field label="Status">
            <select value={form.isActive ? "true" : "false"} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === "true" }))}
              className="w-full rounded-lg border border-white/[0.1] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setModal(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.04]">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {modal === "create" ? "Create" : "Save"}
          </button>
        </div>
      </Modal>

      <ConfirmModal open={!!delId} title="Delete Category"
        message="This will fail if subcategories or products depend on it."
        onConfirm={handleDelete} onCancel={() => setDelId(null)} loading={deleting} />
    </AdminLayout>
  );
}
