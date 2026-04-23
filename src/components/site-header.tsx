"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuthStore, useWishlistStore } from "@/lib/store";
import { AuthModal } from "@/components/auth-modal";

const NAV_LINKS = [
  { href: "/",           label: "Home" },
  { href: "/about",      label: "About" },
  { href: "/products",   label: "Products" },
  { href: "/customize",  label: "Customize" },
  { href: "/capabilities", label: "Custom Mfg" },
  { href: "/process",    label: "MOQ & Process" },
  { href: "/contact",    label: "Contact" },
];

// Animated gradient — slow horizontal drift, premium feel
function AnimatedGradient() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Base — deep red-black, clearly distinct from the hero */}
      <div className="absolute inset-0 bg-[#1a0505]" />

      {/* Strong left bloom — vivid red */}
      <motion.div
        className="absolute -left-1/4 top-0 h-[200%] w-2/3"
        style={{
          background: "radial-gradient(ellipse at center, rgba(220,38,38,0.55) 0%, rgba(153,27,27,0.25) 40%, transparent 70%)",
          filter: "blur(24px)",
        }}
        animate={{ x: ["0%", "35%", "0%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Right bloom — slightly cooler red */}
      <motion.div
        className="absolute -right-1/4 top-0 h-[200%] w-2/3"
        style={{
          background: "radial-gradient(ellipse at center, rgba(185,28,28,0.45) 0%, rgba(127,29,29,0.2) 45%, transparent 70%)",
          filter: "blur(28px)",
        }}
        animate={{ x: ["0%", "-30%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Center pulse — subtle warm glow */}
      <motion.div
        className="absolute left-1/2 top-0 h-full w-1/2 -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse at top, rgba(239,68,68,0.18) 0%, transparent 65%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top edge — bright red line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />

      {/* Bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
    </motion.div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  // Hide header while intro is playing (only on first visit)
  useEffect(() => {
    const KEY = "mci_intro_done";
    if (sessionStorage.getItem(KEY)) {
      setIntroVisible(false);
    } else {
      setIntroVisible(true);
      // Listen for intro completion — page.tsx sets this key then dispatches storage event
      function onStorage() {
        if (sessionStorage.getItem(KEY)) setIntroVisible(false);
      }
      window.addEventListener("storage", onStorage);
      // Also poll — storage event doesn't fire in same tab
      const poll = setInterval(() => {
        if (sessionStorage.getItem(KEY)) { setIntroVisible(false); clearInterval(poll); }
      }, 200);
      return () => { window.removeEventListener("storage", onStorage); clearInterval(poll); };
    }
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          opacity: introVisible ? 0 : 1,
          pointerEvents: introVisible ? "none" : "auto",
          transition: "opacity 0.5s ease",
        }}
      >
        {/* ── Background layers ── */}
        {/* Hero-integrated state: fully transparent */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Scrolled state: animated dark gradient */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <AnimatedGradient />
        </motion.div>

        {/* Backdrop blur — only when scrolled */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 backdrop-blur-xl"
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* ── Header content ── */}
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-3 py-4 sm:px-6 lg:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-header.png"
              alt="Megacore International"
              width={160}
              height={40}
              className="h-10 w-auto object-contain sm:h-14"
              priority
            />
          </Link>

          {/* Desktop nav — centered */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-200",
                  pathname === link.href
                    ? "text-red-400"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                {link.label}
                {/* Active underline */}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-red-500"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Wishlist icon */}
                <Link
                  href="/wishlist"
                  className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] text-zinc-300 transition-colors hover:border-red-500/40 hover:text-red-400 md:flex"
                >
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div ref={userMenuRef} className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-[11px] font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="max-w-[80px] truncate">{user?.name}</span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f0505] shadow-xl"
                      >
                        <div className="border-b border-white/[0.06] px-4 py-3">
                          <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                        </div>
                        <Link href="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-xs text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white">
                          <Heart className="h-3.5 w-3.5" /> My Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="flex w-full items-center gap-2.5 px-4 py-3 text-xs text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-red-400"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <button
                  suppressHydrationWarning
                  onClick={() => { setAuthTab("login"); setAuthOpen(true); }}
                  className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white md:block"
                >
                  Sign In
                </button>
                <button
                  suppressHydrationWarning
                  onClick={() => { setAuthTab("register"); setAuthOpen(true); }}
                  className="hidden items-center gap-2 rounded-full border border-red-500/70 bg-red-600 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_28px_rgba(239,68,68,0.4)] md:flex"
                >
                  Sign Up
                </button>
              </>
            )}

            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              suppressHydrationWarning
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-zinc-300 transition-colors hover:border-white/20 hover:text-white md:hidden mr-6"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Auth modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[65px] z-40 border-b border-white/[0.07] bg-[#0a0a0a]/95 px-6 py-6 backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-widest transition-colors",
                      pathname === link.href
                        ? "bg-red-500/10 text-red-400"
                        : "text-zinc-300 hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-5 border-t border-white/[0.07] pt-5 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/wishlist" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-3 text-sm font-medium text-zinc-300">
                    <Heart className="h-4 w-4" /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  <button onClick={() => { logout(); setOpen(false); }} className="flex w-full items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-3 text-sm font-medium text-red-400">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthTab("login"); setAuthOpen(true); setOpen(false); }} className="flex w-full items-center justify-center rounded-full border border-white/20 py-3 text-sm font-bold uppercase tracking-widest text-zinc-300">
                    Sign In
                  </button>
                  <button onClick={() => { setAuthTab("register"); setAuthOpen(true); setOpen(false); }} className="flex w-full items-center justify-center rounded-full bg-red-600 py-3 text-sm font-bold uppercase tracking-widest text-white">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
