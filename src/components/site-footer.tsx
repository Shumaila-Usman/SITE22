"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/capabilities", label: "Custom Manufacturing" },
  { href: "/process", label: "MOQ & Process" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/contact", label: "Contact" },
];

const CARDS = [
  {
    label: "Contact Us",
    items: [
      { icon: Phone, text: "+92 300 000 0000" },
      { icon: Mail, text: "export@megacoreintl.com" },
    ],
  },
  {
    label: "Manufacturing",
    sublabel: "Facility",
    items: [
      { icon: MapPin, text: "Industrial Zone, Sialkot\nPakistan — 51310" },
    ],
    hours: [
      { day: "Mon – Fri", time: "9:00 AM – 6:00 PM" },
      { day: "Saturday", time: "9:00 AM – 2:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
  },
  {
    label: "Export",
    sublabel: "Inquiries",
    items: [
      { icon: MapPin, text: "Global Shipping\nAll Major Markets" },
    ],
    hours: [
      { day: "Response Time", time: "Within 24 hrs" },
      { day: "MOQ", time: "50 Pieces" },
      { day: "Payment", time: "Advance Basis" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#1a0505]">
      {/* ── Animated background — same as scrolled header ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Left bloom */}
        <motion.div
          className="absolute -left-1/4 top-0 h-full w-2/3"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(220,38,38,0.35) 0%, rgba(153,27,27,0.15) 45%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ x: ["0%", "30%", "0%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Right bloom */}
        <motion.div
          className="absolute -right-1/4 top-0 h-full w-2/3"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(185,28,28,0.3) 0%, rgba(127,29,29,0.12) 45%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ x: ["0%", "-25%", "0%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid bg-[size:44px_44px] opacity-[0.08]" />
        {/* Noise */}
        <div className="noise-overlay opacity-[0.03]" />
      </div>

      {/* ── Sliding line — animates across the top of the footer ── */}
      <div className="relative h-[2px] w-full overflow-hidden bg-red-950/40">
        <motion.div
          className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-red-500 to-transparent"
          animate={{ x: ["-100%", "400%"] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1.5,
          }}
        />
      </div>

      {/* ── Sliding tagline — enters from right, exits left, then pauses ── */}
      <div className="relative overflow-hidden border-b border-white/[0.06] py-7">
        {/* Left fade mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#1a0505] to-transparent" />
        {/* Right fade mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#1a0505] to-transparent" />

        <motion.div
          className="whitespace-nowrap"
          initial={{ x: "100vw" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 16,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 1.5,
            repeatType: "loop",
          }}
        >
          <span className="inline-flex items-center gap-6 px-8 text-lg font-light tracking-[0.08em] text-zinc-300 md:text-xl">
            Your trusted partner for{" "}
            <span className="font-semibold text-white">
              premium sportswear manufacturing
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" />
          </span>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-4 py-10 sm:py-12 sm:grid-cols-2 md:grid-cols-3">
          {CARDS.map((card, ci) => (
            <div
              key={ci}
              className="rounded-2xl border border-white/[0.08] bg-black/30 p-4 sm:p-6 backdrop-blur-sm"
            >
              {/* Card label */}
              <div className="mb-5 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
                  {card.label}
                </span>
                {card.sublabel && (
                  <>
                    <span className="h-px w-3 bg-white/20" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                      {card.sublabel}
                    </span>
                  </>
                )}
              </div>

              {/* Contact items */}
              <div className="mb-4 space-y-3">
                {card.items.map((item, ii) => {
                  const Icon = item.icon;
                  return (
                    <div key={ii} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
                        <Icon className="h-3.5 w-3.5 text-red-400" />
                      </div>
                      <span className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Hours / info rows */}
              {card.hours && (
                <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4">
                  {card.hours.map((h, hi) => (
                    <div key={hi} className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">{h.day}</span>
                      <span className="text-[11px] font-medium text-zinc-300">
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Social icons ── */}
        <div className="flex justify-center gap-3 pb-10">
          {[
            { icon: Instagram, href: "#", label: "Instagram" },
            { icon: Twitter, href: "#", label: "Twitter" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-zinc-400 transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              <Icon className="h-4 w-4" />
            </motion.a>
          ))}
        </div>

        {/* ── Nav links ── */}
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 pb-8 sm:gap-x-7 sm:pb-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.18em] text-zinc-300 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative border-t border-white/[0.06]">
        {/* Sliding line on bottom bar top edge */}
        <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
          <motion.div
            className="absolute top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-red-600/60 to-transparent"
            animate={{ x: ["-100%", "500%"] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 2,
            }}
          />
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 md:flex-row">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">
            © {new Date().getFullYear()} Megacore International. All rights reserved.
          </p>
          {/* Logo — centered */}
          <Link href="/">
            <Image
              src="/logo-footer.png"
              alt="Megacore International"
              width={120}
              height={80}
              className="h-14 w-auto object-contain opacity-90"
            />
          </Link>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">
            Sportswear Manufacturer &amp; Exporter — Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
