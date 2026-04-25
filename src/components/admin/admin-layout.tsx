"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Users, Tag, Layers, Package,
  LogOut, Menu, ChevronRight, Settings, Paintbrush, FolderUp,
} from "lucide-react";
import Image from "next/image";

const NAV = [
  { href: "/admin",                    label: "Dashboard",         icon: LayoutDashboard },
  { href: "/admin/users",              label: "Users",             icon: Users },
  { href: "/admin/categories",         label: "Categories",        icon: Tag },
  { href: "/admin/subcategories",      label: "Subcategories",     icon: Layers },
  { href: "/admin/products",           label: "Products",          icon: Package },
  { href: "/admin/designs",            label: "Custom Designs",    icon: Paintbrush },
  { href: "/admin/uploaded-designs",   label: "Uploaded Designs",  icon: FolderUp },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const Sidebar = () => (
    <aside className="flex h-full w-64 flex-col border-r border-white/[0.07] bg-[#0d0d0d]">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-6 py-5">
        <Image src="/logo-header.png" alt="Megacore" width={120} height={32} className="h-8 w-auto object-contain" />
        <span className="rounded bg-red-600/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-red-400">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Management
        </p>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-red-600/15 text-red-400"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <ChevronRight className="ml-auto h-3 w-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.07] p-3">
        <Link href="/" target="_blank"
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 hover:bg-white/[0.04] hover:text-white"
        >
          <Settings className="h-4 w-4" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808] text-white">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-white/[0.07] bg-[#0d0d0d] px-4 py-3 lg:px-6">
          <button onClick={() => setOpen(true)} className="lg:hidden text-zinc-400 hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs text-zinc-500">
              {NAV.find(n => n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href))?.label ?? "Admin"}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-zinc-400">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
