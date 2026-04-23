"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { StatCard, Spinner } from "@/components/admin/ui";
import { Users, Tag, Layers, Package } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalCategories: number;
  totalSubcategories: number;
  totalProducts: number;
  recentProducts: Array<{ _id: string; name: string; code: string; createdAt: string; categoryId?: { name: string } }>;
  recentUsers: Array<{ _id: string; name: string; email: string; role: string; createdAt: string }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => setStats(d))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500">Welcome back, Admin</p>
        </div>

        {loading ? <Spinner /> : stats && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Total Users"         value={stats.totalUsers}         icon={Users}   color="bg-blue-500/15 text-blue-400" />
              <StatCard label="Categories"          value={stats.totalCategories}    icon={Tag}     color="bg-purple-500/15 text-purple-400" />
              <StatCard label="Subcategories"       value={stats.totalSubcategories} icon={Layers}  color="bg-orange-500/15 text-orange-400" />
              <StatCard label="Total Products"      value={stats.totalProducts}      icon={Package} color="bg-red-500/15 text-red-400" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent products */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-5">
                <h2 className="mb-4 font-semibold text-white">Recent Products</h2>
                {stats.recentProducts.length === 0 ? (
                  <p className="text-sm text-zinc-600">No products yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.recentProducts.map(p => (
                      <div key={p._id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-white">{p.name}</p>
                          <p className="text-xs text-zinc-500">{p.code} · {p.categoryId?.name}</p>
                        </div>
                        <p className="text-xs text-zinc-600">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent users */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-5">
                <h2 className="mb-4 font-semibold text-white">Recent Users</h2>
                {stats.recentUsers.length === 0 ? (
                  <p className="text-sm text-zinc-600">No users yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.recentUsers.map(u => (
                      <div key={u._id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-white">{u.name}</p>
                          <p className="text-xs text-zinc-500">{u.email}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          u.role === "admin" ? "bg-red-500/15 text-red-400" : "bg-zinc-500/15 text-zinc-400"
                        }`}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
