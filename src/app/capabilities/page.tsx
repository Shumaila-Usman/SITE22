"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Factory, Globe2,
  Printer, Ruler, ShieldCheck, Shirt, Truck, Zap,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, ease: EASE, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function CapabilitiesPage() {
  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.09),transparent_60%)]" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-20">
        <FadeUp>
          <span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
            <span className="h-px w-6 bg-red-500" />Custom Manufacturing & OEM
          </span>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h1 className="mb-6 max-w-4xl text-3xl font-black uppercase leading-[0.92] text-white sm:text-5xl md:text-7xl">
            Custom Manufacturing,{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-200 bg-clip-text text-transparent">Your Brand</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
            Megacore International offers full OEM and private label manufacturing. We build to your exact specification — from fabric and colorways to custom logos, packaging, and labeling. You own the brand. We handle the production.
          </p>
        </FadeUp>
      </section>

      {/* OEM Features */}
      <section className="bg-zinc-950/40 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />OEM Services</span></FadeUp>
            <FadeUp delay={0.1}><h2 className="text-2xl font-black uppercase text-white sm:text-4xl md:text-5xl">What We Offer</h2></FadeUp>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Shirt, title: "Custom Logos & Branding", desc: "Embroidery, screen print, sublimation, DTF, and woven labels — your brand identity applied with precision." },
              { icon: Printer, title: "Private Label Packaging", desc: "Custom hang tags, poly bags, carton labels, and retail-ready packaging designed to your spec." },
              { icon: Ruler, title: "Custom Sizes & Fits", desc: "Graded sizing from XS to 3XL, plus custom size charts for specific markets or athletic requirements." },
              { icon: Zap, title: "Custom Fabrics & Colors", desc: "Access to a wide range of performance fabrics — polyester, nylon, spandex, cotton blends — in any Pantone color." },
              { icon: Factory, title: "Full Production Control", desc: "Vertically integrated facility means every stage — cutting, sewing, finishing — is managed in-house." },
              { icon: Globe2, title: "Export-Ready Delivery", desc: "All OEM orders are packed, documented, and dispatched to international standards. FOB, CIF, EXW available." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <FadeUp key={f.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all hover:border-red-500/20">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10">
                      <Icon className="h-5 w-5 text-red-400" />
                    </div>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{f.desc}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Production Capabilities */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />Production Capability</span></FadeUp>
            <FadeUp delay={0.1}><h2 className="mb-6 text-2xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">Integrated Industrial Capacity</h2></FadeUp>
            <FadeUp delay={0.2}><p className="mb-8 text-[1.0625rem] leading-[1.8] text-zinc-400">Every stage from development to dispatch runs inside our synchronized production facility. No outsourcing. No quality gaps. Complete control over timelines and standards.</p></FadeUp>
            <div className="space-y-3">
              {[
                { icon: Ruler, step: "01", title: "Fabric Sourcing & Selection", desc: "Certified fabric mills — polyester, nylon, spandex, cotton, and technical performance fabrics." },
                { icon: Factory, step: "02", title: "Pattern Making & Precision Cutting", desc: "In-house pattern development with graded sizing. Modern cutting equipment for consistent results." },
                { icon: Zap, step: "03", title: "Sewing & Assembly", desc: "Skilled team across all garment types — jerseys, tracksuits, compression wear, gym accessories." },
                { icon: ShieldCheck, step: "04", title: "Quality Control & Finishing", desc: "Inline QC at every stage. ISO 9001 certified processes. Final inspection before packaging." },
                { icon: Truck, step: "05", title: "Export Packaging & Dispatch", desc: "Poly-bagged, carton-packed, labeled to international standards. Export documentation handled." },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <FadeUp key={s.title} delay={0.1 + i * 0.07}>
                    <div className="flex gap-4 rounded-xl border border-white/[0.07] bg-zinc-900/50 p-5 transition-colors hover:border-red-500/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/25 bg-red-500/10">
                        <Icon className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500/70">Step {s.step}</span>
                        <h3 className="mb-1 text-sm font-bold text-white">{s.title}</h3>
                        <p className="text-xs leading-relaxed text-zinc-400">{s.desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { v: "280K+", l: "Units / Month" },
              { v: "ISO 9001", l: "Certified" },
              { v: "50 pcs", l: "Min. Order" },
              { v: "15–25d", l: "Lead Time" },
              { v: "42+", l: "Export Countries" },
              { v: "98.4%", l: "On-Time Rate" },
            ].map((s, i) => (
              <FadeUp key={s.l} delay={i * 0.07}>
                <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-zinc-900/60 px-6 py-4">
                  <span className="text-xs uppercase tracking-widest text-zinc-500">{s.l}</span>
                  <span className="text-xl font-black text-white">{s.v}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Decoration techniques */}
      <section className="bg-zinc-950/40 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />Decoration Methods</span></FadeUp>
            <FadeUp delay={0.1}><h2 className="text-2xl font-black uppercase text-white sm:text-4xl md:text-5xl">Branding Techniques</h2></FadeUp>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Sublimation Printing", desc: "Full-color all-over prints with no hand feel. Ideal for jerseys and performance wear. Unlimited colors." },
              { title: "Screen Printing", desc: "Bold, durable prints for hoodies, T-shirts, and casual wear. Best for spot colors and large runs." },
              { title: "Embroidery", desc: "Premium raised logo application for caps, polo shirts, and branded apparel. Woven thread finish." },
              { title: "DTF / Heat Transfer", desc: "Direct-to-film transfers for complex multi-color designs on any fabric type. No minimum." },
            ].map((t, i) => (
              <FadeUp key={t.title} delay={i * 0.09}>
                <div className="h-full rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all hover:border-red-500/20">
                  <div className="mb-3 h-1 w-10 bg-gradient-to-r from-red-500 to-transparent" />
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">{t.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{t.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Quality */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-20">
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-zinc-900/80 via-zinc-950 to-black">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-white/[0.07] p-10 lg:border-b-0 lg:border-r lg:p-14">
              <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />Quality Standards</span></FadeUp>
              <FadeUp delay={0.1}><h2 className="mb-5 text-3xl font-black uppercase text-white">Manufacturing You Can Rely On</h2></FadeUp>
              <FadeUp delay={0.2}><p className="text-[1.0625rem] leading-[1.8] text-zinc-400">Every garment that leaves our facility has passed through a structured quality process. ISO 9001 certified. Inline QC at every stage. What you approve in sampling is what you receive in bulk.</p></FadeUp>
            </div>
            <div className="p-10 lg:p-14">
              <ul className="space-y-4">
                {["ISO 9001 certified quality management system", "Inline QC at cutting, sewing, finishing, and packing", "Pre-production samples before bulk production", "AQL-compliant final inspection", "Export documentation handled professionally", "Direct communication — no middlemen"].map((c, i) => (
                  <FadeUp key={i} delay={0.1 + i * 0.06}>
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
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6">
        <FadeUp>
          <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/50 via-zinc-950 to-black p-12 text-center md:p-16">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <h2 className="mb-4 text-3xl font-black uppercase text-white md:text-4xl">Ready to Start Your OEM Order?</h2>
            <p className="mx-auto mb-8 max-w-lg text-zinc-400">Share your requirements and we'll respond within 24 hours. No commitment required.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-500">
              Start a Discussion <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeUp>
      </section>
    </main>
  );
}
