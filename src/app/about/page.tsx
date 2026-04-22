"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Factory,
  Globe2,
  Package,
  Ruler,
  ShieldCheck,
  Star,
  Target,
  Truck,
  Users,
  Zap,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
      <span className="h-px w-6 bg-red-500" />
      {children}
    </span>
  );
}

// Local images — placed in public/images/about/
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80", // kept as-is
  factory: "/images/about/factory.jpg",
  team: "/images/about/team.jpg",
  sportswear1: "/images/about/sportswear1.jpg",
  sportswear2: "/images/about/sportswear2.jpg",
  sportswear3: "/images/about/sportswear3.jpg",
  export: "/images/about/export1.jpg",
  export2: "/images/about/export2.jpg",
  export3: "/images/about/export3.jpg",
  quality: "/images/about/quality.jpg",
};

export default function AboutPage() {
  return (
    <main className="bg-black">

      {/* ── 1. Hero ── */}
      <section className="relative isolate relative isolate min-h-[60vh] overflow-hidden sm:min-h-[70vh]">
        <div className="absolute inset-0">
          <Image src={IMAGES.hero} alt="Megacore manufacturing facility" fill className="object-cover opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(239,68,68,0.18),transparent_60%)]" />
        </div>
        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-6 pb-12 pt-32 sm:pb-20 sm:pt-40">
          <FadeUp>
            <SectionLabel>About Megacore International</SectionLabel>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="mb-6 max-w-4xl text-3xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-5xl md:text-7xl">
              Engineered In Industry,{" "}
              <span className="bg-gradient-to-r from-red-400 to-red-200 bg-clip-text text-transparent">
                Driven By Sport
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
              Megacore International is a Pakistan-based sportswear manufacturer and exporter
              serving brands, distributors, and bulk buyers across Europe, North America,
              the Middle East, and beyond. We combine factory-scale execution with a
              performance-first product mindset.
            </p>
          </FadeUp>
          <FadeUp delay={0.3} className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-500">
              Start a Discussion <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/40 hover:text-white">
              View Products
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── 2. Quick stats ── */}
      <section className="border-y border-white/[0.06] bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-px md:grid-cols-4">
            {[
              { v: "280K+", l: "Units / Month" },
              { v: "42+", l: "Export Countries" },
              { v: "ISO 9001", l: "Certified" },
              { v: "50 pcs", l: "Min. Order Qty" },
            ].map((s, i) => (
              <FadeUp key={s.l} delay={i * 0.07}>
                <div className="flex flex-col items-center gap-1 py-8 text-center">
                  <span className="text-3xl font-black text-white md:text-4xl">{s.v}</span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{s.l}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Who We Are ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <FadeUp><SectionLabel>Who We Are</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="mb-6 text-2xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">
                A Manufacturer Built For Global Buyers
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mb-5 text-[1.0625rem] leading-[1.8] text-zinc-400">
                Founded with a clear mission — to deliver export-grade sportswear manufacturing
                with the professionalism and reliability that international buyers demand —
                Megacore International has grown into a trusted production partner for brands,
                distributors, and sports organisations worldwide.
              </p>
              <p className="mb-5 text-[1.0625rem] leading-[1.8] text-zinc-400">
                We operate a fully integrated production facility in Pakistan, one of the world's
                leading textile and sportswear manufacturing hubs. From fabric sourcing and
                pattern development through to finishing, quality inspection, and export-ready
                packaging — every stage happens under one roof.
              </p>
              <p className="text-[1.0625rem] leading-[1.8] text-zinc-400">
                Our team of production specialists, quality controllers, and export coordinators
                work together to ensure that every order — whether 50 pieces or 50,000 — is
                handled with the same level of precision and care.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={0.15}>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                <Image
                  src={IMAGES.factory}
                  alt="Megacore production facility"
                  width={700}
                  height={500}
                  className="h-56 w-full object-cover sm:h-80 md:h-[420px]"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/[0.1] bg-zinc-900/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Est.</p>
                <p className="text-xl font-black text-white">Pakistan</p>
                <p className="text-[10px] text-zinc-500">Sialkot — Textile Hub</p>
              </div>
              <div className="absolute -right-5 -top-5 rounded-2xl border border-red-500/20 bg-zinc-900/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Capacity</p>
                <p className="text-xl font-black text-white">280K+</p>
                <p className="text-[10px] text-zinc-500">Units per month</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 4. Our Story ── */}
      <section className="bg-zinc-950/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <FadeUp delay={0.1}>
              <div className="relative order-2 lg:order-1">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                  <Image
                    src={IMAGES.team}
                    alt="Megacore team"
                    width={700}
                    height={500}
                    className="h-56 w-full object-cover sm:h-80 md:h-[420px]"
                  />
                </div>
                <div className="absolute -bottom-5 -right-5 rounded-2xl border border-white/[0.1] bg-zinc-900/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Team</p>
                  <p className="text-xl font-black text-white">95+</p>
                  <p className="text-[10px] text-zinc-500">Production specialists</p>
                </div>
              </div>
            </FadeUp>
            <div className="order-1 lg:order-2">
              <FadeUp><SectionLabel>Our Story</SectionLabel></FadeUp>
              <FadeUp delay={0.1}>
                <h2 className="mb-6 text-2xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">
                  Built On Precision, Grown On Trust
                </h2>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="mb-5 text-[1.0625rem] leading-[1.8] text-zinc-400">
                  Megacore International was established with a simple but powerful belief:
                  that international buyers deserve a manufacturing partner who communicates
                  clearly, delivers consistently, and treats every order with the same
                  professional discipline — regardless of size.
                </p>
                <p className="mb-5 text-[1.0625rem] leading-[1.8] text-zinc-400">
                  Starting with a focused range of sports jerseys and team uniforms, we
                  expanded our capabilities year by year — adding fitness wear, casual
                  sportswear, accessories, and full OEM/private label services as our
                  client base grew across Europe, the Middle East, and North America.
                </p>
                <p className="text-[1.0625rem] leading-[1.8] text-zinc-400">
                  Today, Megacore International is a vertically integrated operation with
                  in-house fabric sourcing, pattern making, cutting, sewing, finishing,
                  quality control, and export packaging — all under one roof, all managed
                  by our own team.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. What We Make ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <FadeUp><SectionLabel>What We Manufacture</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mx-auto max-w-2xl text-2xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">
              A Full Range of Sportswear
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              From team uniforms to fitness wear, casual sportswear to accessories —
              we manufacture across all major sportswear categories.
            </p>
          </FadeUp>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { img: IMAGES.sportswear1, cat: "Sports Wear", items: "Jerseys, Tracksuits, Uniforms, Cycling Wear, Swimming Wear" },
            { img: IMAGES.sportswear2, cat: "Casual Wear", items: "Hoodies, T-Shirts, Polo Shirts, Sweatshirts, Track Suits" },
            { img: IMAGES.sportswear3, cat: "Fitness Wear", items: "Gym Shorts, Leggings, Sports Bras, Singlets, Gym Gloves" },
          ].map((c, i) => (
            <FadeUp key={c.cat} delay={i * 0.1}>
              <div className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/60 transition-colors hover:border-white/[0.12]">
                <div className="relative h-52 overflow-hidden">
                  <Image src={c.img} alt={c.cat} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] uppercase tracking-widest text-red-400">
                      {c.cat}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-zinc-400">{c.items}</p>
                  <Link href="/products" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 transition-colors hover:text-red-300">
                    View Products <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── 6. Core Values ── */}
      <section className="bg-zinc-950/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <FadeUp><SectionLabel>Our Values</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="mx-auto max-w-xl text-2xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">
                What Drives Everything We Do
              </h2>
            </FadeUp>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Target, title: "Precision", desc: "Every garment is built to exact specifications. Pattern accuracy, stitch quality, and finishing standards are non-negotiable." },
              { icon: Users, title: "Partnership", desc: "We treat every buyer as a long-term partner. Clear communication, honest timelines, and consistent delivery build lasting relationships." },
              { icon: Zap, title: "Speed", desc: "Rapid sampling, efficient production scheduling, and streamlined export processes mean faster time-to-market for your brand." },
              { icon: Star, title: "Quality", desc: "ISO 9001 certified processes with inline QC at every stage. What you approve in sampling is exactly what you receive in bulk." },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <FadeUp key={v.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all hover:border-red-500/20">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10">
                      <Icon className="h-5 w-5 text-red-400" />
                    </div>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">{v.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{v.desc}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. Manufacturing Capability ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <FadeUp><SectionLabel>Manufacturing Capability</SectionLabel></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="mb-6 text-2xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">
                Vertically Integrated Production
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mb-8 text-[1.0625rem] leading-[1.8] text-zinc-400">
                Our production facility handles every stage of the manufacturing process
                in-house. This means no outsourcing, no quality gaps, and complete
                control over timelines and standards.
              </p>
            </FadeUp>
            <div className="space-y-3">
              {[
                { icon: Ruler, step: "01", title: "Fabric Sourcing & Selection", desc: "We source from certified fabric mills — polyester, nylon, spandex, cotton, and technical performance fabrics." },
                { icon: Factory, step: "02", title: "Pattern Making & Cutting", desc: "In-house pattern development with graded sizing. Precision cutting using modern equipment for consistent results." },
                { icon: Zap, step: "03", title: "Sewing & Assembly", desc: "Skilled production team with experience across all garment types — jerseys, tracksuits, compression wear, and more." },
                { icon: ShieldCheck, step: "04", title: "Quality Control & Finishing", desc: "Inline QC at every stage. Final inspection before packaging. ISO 9001 certified processes throughout." },
                { icon: Truck, step: "05", title: "Export Packaging & Dispatch", desc: "Poly-bagged, carton-packed, and labeled to international standards. Export documentation handled professionally." },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <FadeUp key={s.title} delay={0.1 + i * 0.07}>
                    <div className="flex gap-4 rounded-xl border border-white/[0.07] bg-zinc-900/50 p-5 transition-colors hover:border-red-500/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/25 bg-red-500/10">
                        <Icon className="h-4.5 w-4.5 text-red-400" />
                      </div>
                      <div>
                        <div className="mb-0.5 flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500/70">Step {s.step}</span>
                        </div>
                        <h3 className="mb-1 text-sm font-bold text-white">{s.title}</h3>
                        <p className="text-xs leading-relaxed text-zinc-400">{s.desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
          <FadeUp delay={0.2}>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                <Image src={IMAGES.quality} alt="Quality control" width={700} height={420} className="h-64 w-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                  <Image src={IMAGES.export2} alt="Production" width={340} height={240} className="h-40 w-full object-cover" />
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                  <Image src={IMAGES.export3} alt="Finished products" width={340} height={240} className="h-40 w-full object-cover" />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 8. Export & Global Reach ── */}
      <section className="bg-zinc-950/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <FadeUp delay={0.1}>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                  <Image src={IMAGES.export} alt="Global export" width={700} height={500} className="h-56 w-full object-cover sm:h-80 md:h-[420px]" />
                </div>
                <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/[0.1] bg-zinc-900/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Export Markets</p>
                  <p className="text-xl font-black text-white">42+ Countries</p>
                </div>
                <div className="absolute -right-5 -top-5 rounded-2xl border border-red-500/20 bg-zinc-900/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">On-Time Rate</p>
                  <p className="text-xl font-black text-white">98.4%</p>
                </div>
              </div>
            </FadeUp>
            <div>
              <FadeUp><SectionLabel>Global Export</SectionLabel></FadeUp>
              <FadeUp delay={0.1}>
                <h2 className="mb-6 text-2xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">
                  Export-Ready For Global Trade
                </h2>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="mb-6 text-[1.0625rem] leading-[1.8] text-zinc-400">
                  We serve buyers across Europe, North America, the Middle East, Africa,
                  and Asia. Our export experience means we understand what international
                  buyers need — reliable communication, consistent quality, and professional
                  handling from first inquiry to final delivery.
                </p>
                <p className="mb-8 text-[1.0625rem] leading-[1.8] text-zinc-400">
                  All export documentation — commercial invoice, packing list, certificate
                  of origin, and shipping coordination — is handled by our team. We work
                  with FOB, CIF, and EXW terms depending on buyer preference.
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <div className="space-y-3">
                  {[
                    "Europe — UK, Germany, France, Netherlands, Spain",
                    "North America — USA, Canada",
                    "Middle East — UAE, Saudi Arabia, Qatar, Kuwait",
                    "Africa — South Africa, Nigeria, Kenya",
                    "Asia — Australia, New Zealand, Southeast Asia",
                  ].map((region) => (
                    <div key={region} className="flex items-center gap-3">
                      <Globe2 className="h-4 w-4 shrink-0 text-red-400" />
                      <span className="text-sm text-zinc-300">{region}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Quality Standards ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <FadeUp><SectionLabel>Quality Standards</SectionLabel></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mx-auto max-w-xl text-2xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">
              Manufacturing You Can Rely On
            </h2>
          </FadeUp>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Award, title: "ISO 9001 Certified", desc: "Our quality management system meets international standards for consistent, auditable production processes." },
            { icon: ShieldCheck, title: "Inline QC", desc: "Quality checks at cutting, sewing, finishing, and packing stages. Defects are caught before they reach you." },
            { icon: Ruler, title: "Precision Patterns", desc: "Graded patterns developed in-house for accurate sizing across all garment categories and size ranges." },
            { icon: Package, title: "Export Packaging", desc: "Poly-bagged, carton-packed, and labeled to international retail and wholesale standards." },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeUp key={s.title} delay={i * 0.09}>
                <div className="h-full rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all hover:border-red-500/20">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10">
                    <Icon className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{s.desc}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* ── 10. Why Choose Us ── */}
      <section className="bg-zinc-950/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-zinc-900/80 via-zinc-950 to-black">
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-white/[0.07] p-10 lg:border-b-0 lg:border-r lg:p-14">
                <FadeUp><SectionLabel>Why Megacore</SectionLabel></FadeUp>
                <FadeUp delay={0.1}>
                  <h2 className="mb-6 text-3xl font-black uppercase leading-tight text-white md:text-4xl">
                    Why Global Buyers Choose Us
                  </h2>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p className="mb-6 text-[1.0625rem] leading-[1.8] text-zinc-400">
                    We are not a trading company or a middleman. We are the manufacturer.
                    When you work with Megacore International, you communicate directly
                    with the people who make your products — no layers, no delays,
                    no miscommunication.
                  </p>
                  <p className="text-[1.0625rem] leading-[1.8] text-zinc-400">
                    Our MOQ of 50 pieces makes us accessible to growing brands, while
                    our production capacity of 280,000+ units per month means we can
                    scale with you as your business grows.
                  </p>
                </FadeUp>
              </div>
              <div className="p-6 sm:p-10 lg:p-14">
                <FadeUp delay={0.1}>
                  <h3 className="mb-7 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">
                    Our Commitments
                  </h3>
                </FadeUp>
                <ul className="space-y-4">
                  {[
                    "Direct communication — no middlemen, no delays",
                    "Samples prepared before bulk production begins",
                    "You approve before we produce — no surprises",
                    "ISO 9001 certified quality management",
                    "Export documentation handled professionally",
                    "MOQ of just 50 pieces per style",
                    "15–25 day production lead time",
                    "Long-term partnerships built on consistency",
                  ].map((c, i) => (
                    <FadeUp key={i} delay={0.15 + i * 0.06}>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        <span className="text-sm leading-relaxed text-zinc-300">{c}</span>
                      </li>
                    </FadeUp>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. Final CTA ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <FadeUp>
          <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/50 via-zinc-950 to-black p-12 text-center md:p-20">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-red-800/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <div className="relative">
              <span className="mb-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
                <span className="h-px w-6 bg-red-500" />
                Get In Touch
                <span className="h-px w-6 bg-red-500" />
              </span>
              <h2 className="mx-auto mb-5 max-w-2xl text-3xl font-black uppercase leading-tight text-white md:text-5xl">
                Ready To Work With Megacore?
              </h2>
              <p className="mx-auto mb-10 max-w-lg text-[1.0625rem] leading-[1.75] text-zinc-400">
                Send us your requirements and we will respond within 24 hours.
                No commitment required — just a professional conversation about
                what you need and how we can deliver it.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className="group inline-flex items-center gap-2.5 rounded-full bg-red-600 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(239,68,68,0.25)] transition-all hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                  Start a Discussion
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/40 hover:text-white">
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

    </main>
  );
}
