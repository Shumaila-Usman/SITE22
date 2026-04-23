"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ConfirmModal, Modal, Field, inputCls, selectCls, Badge, Spinner, Empty, toast } from "@/components/admin/ui";
import { Plus, Search, Pencil, Trash2, Loader2, Star } from "lucide-react";
import Image from "next/image";

interface Category    { _id: string; name: string; slug: string }
interface Subcategory { _id: string; name: string; slug: string; categoryId: string | Category }
interface Product {
  _id: string; code: string; name: string; slug: string;
  categoryId: Category | string; subcategoryId?: Subcategory | string;
  shortDescription?: string; fullDescription?: string; materials?: string;
  sizes?: string; colors?: string; moq: number; price: number | null;
  currency: string; image: string; gallery: string[]; tags: string[];
  isActive: boolean; isFeatured: boolean; createdAt: string;
}

const EMPTY_FORM = {
  code: "", name: "", slug: "", categoryId: "", subcategoryId: "",
  shortDescription: "", fullDescription: "", materials: "",
  sizes: "", colors: "", moq: 50, price: "" as string | number,
  currency: "USD", image: "", gallery: "", tags: "",
  isActive: true, isFeatured: false,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [cats, setCats]         = useState<Category[]>([]);
  const [allSubs, setAllSubs]   = useState<Subcategory[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<Subcategory[]>([]);

  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [page, setPage]         = useState(1);
  const limit = 15;

  const [modal, setModal]       = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm]         = useState({ ...EMPTY_FORM });
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [delId, setDelId]       = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadMeta = useCallback(async () => {
    const [cRes, sRes] = await Promise.all([
      fetch("/api/admin/categories"),
      fetch("/api/admin/subcategories"),
    ]);
    const cData = await cRes.json();
    const sData = await sRes.json();
    setCats(cData.categories ?? []);
    setAllSubs(sData.subcategories ?? []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set("search", search);
    if (catFilter) params.set("categoryId", catFilter);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [search, page, catFilter]);

  useEffect(() => { loadMeta(); }, [loadMeta]);
  useEffect(() => { load(); }, [load]);

  // Filter subcategories when category changes in form
  useEffect(() => {
    if (form.categoryId) {
      setFilteredSubs(allSubs.filter(s => {
        const cId = typeof s.categoryId === "object" ? s.categoryId._id : s.categoryId;
        return cId === form.categoryId;
      }));
    } else {
      setFilteredSubs(allSubs);
    }
  }, [form.categoryId, allSubs]);

  function openCreate() {
    setForm({ ...EMPTY_FORM, categoryId: cats[0]?._id ?? "" });
    setModal("create");
  }

  function openEdit(p: Product) {
    setSelected(p);
    const catId = typeof p.categoryId === "object" ? p.categoryId._id : p.categoryId;
    const subId = p.subcategoryId ? (typeof p.subcategoryId === "object" ? p.subcategoryId._id : p.subcategoryId) : "";
    setForm({
      code: p.code, name: p.name, slug: p.slug, categoryId: catId, subcategoryId: subId,
      shortDescription: p.shortDescription ?? "", fullDescription: p.fullDescription ?? "",
      materials: p.materials ?? "", sizes: p.sizes ?? "", colors: p.colors ?? "",
      moq: p.moq, price: p.price ?? "", currency: p.currency,
      image: p.image, gallery: p.gallery.join(", "), tags: p.tags.join(", "),
      isActive: p.isActive, isFeatured: p.isFeatured,
    });
    setModal("edit");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setForm(f => ({ ...f, image: data.url }));
    else toast("error", data.error ?? "Upload failed");
    setUploading(false);
  }

  async function handleSave() {
    if (!form.code.trim() || !form.name.trim() || !form.categoryId) {
      toast("error", "Code, name and category are required"); return;
    }
    setSaving(true);
    const body = {
      ...form,
      price: form.price === "" ? null : Number(form.price),
      moq: Number(form.moq),
      gallery: form.gallery ? String(form.gallery).split(",").map(s => s.trim()).filter(Boolean) : [],
      tags:    form.tags    ? String(form.tags).split(",").map(s => s.trim()).filter(Boolean)    : [],
      subcategoryId: form.subcategoryId || undefined,
    };
    const url    = modal === "create" ? "/api/admin/products" : `/api/admin/products/${selected!._id}`;
    const method = modal === "create" ? "POST" : "PATCH";
    const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data   = await res.json();
    if (!res.ok) { toast("error", data.error ?? "Failed"); setSaving(false); return; }
    toast("success", modal === "create" ? "Product created" : "Product updated");
    setModal(null); load(); setSaving(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const res  = await fetch(`/api/admin/products/${delId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { toast("error", data.error ?? "Failed"); setDeleting(false); return; }
    toast("success", "Product deleted");
    setDelId(null); setDeleting(false); load();
  }

  function getCatName(c: Category | string) {
    if (typeof c === "object") return c.name;
    return cats.find(x => x._id === c)?.name ?? "—";
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Products</h1>
            <p className="text-sm text-zinc-500">{total} total</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products…"
              className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50" />
          </div>
          <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-white/[0.1] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none">
            <option value="">All categories</option>
            {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111]">
          {loading ? <Spinner /> : products.length === 0 ? <Empty message="No products found" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07] text-left text-xs text-zinc-500">
                    <th className="px-4 py-3 font-medium">Image</th>
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">MOQ</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        {p.image ? (
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-zinc-800">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-zinc-800" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-400">{p.code}</td>
                      <td className="px-4 py-3 font-medium text-white">
                        <div className="flex items-center gap-1.5">
                          {p.isFeatured && <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />}
                          {p.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{getCatName(p.categoryId)}</td>
                      <td className="px-4 py-3 text-zinc-400">{p.moq}</td>
                      <td className="px-4 py-3 text-zinc-400">{p.price ? `$${p.price}` : "—"}</td>
                      <td className="px-4 py-3"><Badge active={p.isActive} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(p)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-white">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDelId(p._id)}
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

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-sm ${p === page ? "bg-red-600 text-white" : "border border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]"}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "create" ? "Add Product" : "Edit Product"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product Code" required>
            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className={inputCls} placeholder="MCI-001" />
          </Field>
          <Field label="Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Product name" />
          </Field>
          <Field label="Category" required>
            <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value, subcategoryId: "" }))} className={selectCls}>
              <option value="">Select category</option>
              {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Subcategory">
            <select value={form.subcategoryId} onChange={e => setForm(f => ({ ...f, subcategoryId: e.target.value }))} className={selectCls}>
              <option value="">Select subcategory</option>
              {filteredSubs.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Short Description">
            <input value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} className={inputCls} placeholder="Brief description" />
          </Field>
          <Field label="Materials">
            <input value={form.materials} onChange={e => setForm(f => ({ ...f, materials: e.target.value }))} className={inputCls} placeholder="e.g. 100% Polyester" />
          </Field>
          <Field label="Sizes">
            <input value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} className={inputCls} placeholder="S, M, L, XL" />
          </Field>
          <Field label="Colors">
            <input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} className={inputCls} placeholder="All colors available" />
          </Field>
          <Field label="MOQ" required>
            <input type="number" value={form.moq} onChange={e => setForm(f => ({ ...f, moq: Number(e.target.value) }))} className={inputCls} />
          </Field>
          <Field label="Price (leave blank = contact for price)">
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={inputCls} placeholder="e.g. 12.50" />
          </Field>
          <Field label="Currency">
            <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className={selectCls}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </Field>
          <Field label="Tags (comma separated)">
            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className={inputCls} placeholder="basketball, uniform" />
          </Field>

          {/* Image upload */}
          <div className="sm:col-span-2">
            <Field label="Main Image">
              <div className="flex items-center gap-3">
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className={inputCls} placeholder="/images/... or upload below" />
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.04] whitespace-nowrap">
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              {form.image && (
                <div className="mt-2 relative h-20 w-20 overflow-hidden rounded-lg bg-zinc-800">
                  <Image src={form.image} alt="preview" fill className="object-cover" />
                </div>
              )}
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Full Description">
              <textarea value={form.fullDescription} onChange={e => setForm(f => ({ ...f, fullDescription: e.target.value }))}
                rows={3} className={inputCls} placeholder="Detailed product description" />
            </Field>
          </div>

          <Field label="Status">
            <select value={form.isActive ? "true" : "false"} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === "true" }))} className={selectCls}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </Field>
          <Field label="Featured">
            <select value={form.isFeatured ? "true" : "false"} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.value === "true" }))} className={selectCls}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setModal(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.04]">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {modal === "create" ? "Create Product" : "Save Changes"}
          </button>
        </div>
      </Modal>

      <ConfirmModal open={!!delId} title="Delete Product" message="This product will be permanently removed."
        onConfirm={handleDelete} onCancel={() => setDelId(null)} loading={deleting} />
    </AdminLayout>
  );
}
