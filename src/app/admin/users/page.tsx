"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ConfirmModal, Modal, Field, inputCls, selectCls, Badge, Spinner, Empty, toast } from "@/components/admin/ui";
import { Plus, Search, Pencil, Trash2, KeyRound, Loader2 } from "lucide-react";

interface User {
  _id: string; name: string; email: string; role: string;
  company?: string; country?: string; isActive: boolean; createdAt: string;
}

const EMPTY_FORM = { name: "", email: "", password: "", role: "user", company: "", country: "", isActive: true };

export default function UsersPage() {
  const [users, setUsers]       = useState<User[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);

  const [modal, setModal]       = useState<"create" | "edit" | "password" | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm]         = useState({ ...EMPTY_FORM });
  const [newPw, setNewPw]       = useState("");
  const [saving, setSaving]     = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const [delId, setDelId]       = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, page: String(page), limit: String(limit) });
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setForm({ ...EMPTY_FORM }); setErrors({}); setModal("create");
  }
  function openEdit(u: User) {
    setSelected(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role, company: u.company ?? "", country: u.country ?? "", isActive: u.isActive });
    setErrors({}); setModal("edit");
  }
  function openPassword(u: User) { setSelected(u); setNewPw(""); setModal("password"); }

  async function handleSave() {
    setSaving(true); setErrors({});
    const body = modal === "create"
      ? form
      : { name: form.name, email: form.email, role: form.role, company: form.company, country: form.country, isActive: form.isActive };

    const url  = modal === "create" ? "/api/admin/users" : `/api/admin/users/${selected!._id}`;
    const method = modal === "create" ? "POST" : "PATCH";
    const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { toast("error", data.error ?? "Failed"); setSaving(false); return; }
    toast("success", modal === "create" ? "User created" : "User updated");
    setModal(null); load();
    setSaving(false);
  }

  async function handlePasswordUpdate() {
    if (!newPw || newPw.length < 6) { toast("error", "Password must be at least 6 characters"); return; }
    setSaving(true);
    const res = await fetch(`/api/admin/users/${selected!._id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPw }),
    });
    const data = await res.json();
    if (!res.ok) { toast("error", data.error ?? "Failed"); setSaving(false); return; }
    toast("success", "Password updated");
    setModal(null); setSaving(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/users/${delId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { toast("error", data.error ?? "Failed"); setDeleting(false); return; }
    toast("success", "User deleted");
    setDelId(null); setDeleting(false); load();
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Users</h1>
            <p className="text-sm text-zinc-500">{total} total</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500">
            <Plus className="h-4 w-4" /> Add User
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name or email…"
              className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111]">
          {loading ? <Spinner /> : users.length === 0 ? <Empty message="No users found" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07] text-left text-xs text-zinc-500">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                      <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${u.role === "admin" ? "bg-red-500/15 text-red-400" : "bg-zinc-500/15 text-zinc-400"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3"><Badge active={u.isActive} /></td>
                      <td className="px-4 py-3 text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openPassword(u)} title="Reset password"
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-yellow-400">
                            <KeyRound className="h-4 w-4" />
                          </button>
                          <button onClick={() => openEdit(u)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-white">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDelId(u._id)}
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

        {/* Pagination */}
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

      {/* Create / Edit Modal */}
      <Modal open={modal === "create" || modal === "edit"} onClose={() => setModal(null)}
        title={modal === "create" ? "Add User" : "Edit User"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required error={errors.name}>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Full name" />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="email@example.com" />
          </Field>
          {modal === "create" && (
            <Field label="Password" required error={errors.password}>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={inputCls} placeholder="Min 6 characters" />
            </Field>
          )}
          <Field label="Role">
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={selectCls}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <Field label="Company">
            <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className={inputCls} placeholder="Company name" />
          </Field>
          <Field label="Country">
            <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className={inputCls} placeholder="Country" />
          </Field>
          <Field label="Status">
            <select value={form.isActive ? "true" : "false"} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === "true" }))} className={selectCls}>
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

      {/* Password Modal */}
      <Modal open={modal === "password"} onClose={() => setModal(null)} title="Reset Password">
        <p className="mb-4 text-sm text-zinc-400">Set a new password for <strong className="text-white">{selected?.name}</strong></p>
        <Field label="New Password" required>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={inputCls} placeholder="Min 6 characters" />
        </Field>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setModal(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.04]">Cancel</button>
          <button onClick={handlePasswordUpdate} disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Update Password
          </button>
        </div>
      </Modal>

      <ConfirmModal open={!!delId} title="Delete User" message="This action cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDelId(null)} loading={deleting} />
    </AdminLayout>
  );
}
