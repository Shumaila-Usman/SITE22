"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Gauge, Timer, PackageCheck, Plane, Ruler } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, ease: EASE, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const STEPS = [
  { icon: MessageCircle, step: "01", title: "Send Your Inquiry", desc: "Contact us via WhatsApp or email with your product requirements — category, quantity, sizes, colors, and any customization details. No commitment required at this stage.", time: "Day 1" },
  { icon: Ruler, step: "02", title: "Confirm Specifications", desc: "We review your requirements, suggest suitable fabrics and construction methods, confirm pricing, and agree on lead times. All details are confirmed in writing before proceeding.", time: "Day 1–2" },
  { icon: Gauge, step: "03", title: "Advance Payment", desc: "Production begins after advance payment confirmation per agreed terms. We discuss payment percentage and method before any commitment is made.", time: "Day 2–3" },
  { icon: Timer, step: "04", title: "Pre-Production Sampling", desc: "We prepare pre-production samples and share them with you for approval. Bulk production does not begin until you have approved the sample in writing.", time: "Day 5–10" },
  { icon: PackageCheck, step: "05", title: "Mass Production", desc: "Full production run begins after sample approval. Inline quality checks at cutting, sewing, finishing, and packing stages throughout the production run.", time: "Day 10–30" },
  { icon: Plane, step: "06", title: "Shipment & Export", desc: "Export-ready packaging, commercial invoice, packing list, certificate of origin, and freight coordination. We handle all documentation for smooth customs clearance.", time: "Day 30–35" },
];

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.09),transparent_60%)]" />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />MOQ & Order Process</span></FadeUp>
        <FadeUp delay={0.1}><h1 className="mb-6 max-w-4xl text-3xl font-black uppercase leading-[0.92] text-white sm:text-5xl md:text-7xl">Clear Terms, Simple Process</h1></FadeUp>
        <FadeUp delay={0.2}><p className="max-w-2xl text-lg leading-relaxed text-zinc-400">A straightforward, professional workflow from first contact to delivery. No surprises, no pressure — just clear communication and consistent execution at every stage.</p></FadeUp>
      </section>

      {/* MOQ Policy */}
      <section className="bg-zinc-950/40 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />MOQ & Payment Policy</span></FadeUp>
            <FadeUp delay={0.1}><h2 className="text-2xl font-black uppercase text-white sm:text-4xl md:text-5xl">Order Terms</h2></FadeUp>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: "50 Pieces", l: "Minimum Order Qty", note: "Per style, per color" },
              { v: "Advance", l: "Payment Basis", note: "Agreed % before production" },
              { v: "5–7 Days", l: "Sample Lead Time", note: "Pre-production samples" },
              { v: "15–25 Days", l: "Production Lead Time", note: "After sample approval" },
            ].map((p, i) => (
              <FadeUp key={p.l} delay={i * 0.09}>
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/70 p-6">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-red-600 via-red-400 to-transparent" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{p.l}</p>
                  <p className="mt-2 text-2xl font-black text-white">{p.v}</p>
                  <p className="mt-1 text-xs text-zinc-500">{p.note}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 6-step process */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-20">
        <div className="mb-14 text-center">
          <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />Step by Step</span></FadeUp>
          <FadeUp delay={0.1}><h2 className="text-2xl font-black uppercase text-white sm:text-4xl md:text-5xl">The Order Process</h2></FadeUp>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeUp key={s.title} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all hover:border-red-500/20">
                  <div className="absolute right-5 top-5 text-[3rem] font-black leading-none text-white/[0.04]">{s.step}</div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10">
                      <Icon className="h-5 w-5 text-red-400" />
                    </div>
                    <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[9px] uppercase tracking-wider text-zinc-500">{s.time}</span>
                  </div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Step {s.step}</p>
                  <h3 className="mb-2 text-base font-bold uppercase tracking-wide text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{s.desc}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* Commitments */}
      <section className="bg-zinc-950/40 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />Our Commitments</span></FadeUp>
              <FadeUp delay={0.1}><h2 className="mb-6 text-2xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">What You Can Expect</h2></FadeUp>
              <FadeUp delay={0.2}><p className="text-[1.0625rem] leading-[1.8] text-zinc-400">We operate with full transparency at every stage. No hidden costs, no production surprises, and no bulk shipment without your sample approval.</p></FadeUp>
            </div>
            <div className="space-y-3">
              {["Response to every inquiry within 24 hours", "Full specification discussion before any commitment", "Pre-production sample before bulk production begins", "You approve before we produce — no exceptions", "Inline quality checks throughout production", "Export documentation handled professionally", "Direct communication with our production team", "Consistent quality from sample to bulk"].map((c, i) => (
                <FadeUp key={i} delay={0.1 + i * 0.06}>
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-zinc-900/50 px-5 py-3.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-red-400" />
                    <span className="text-sm text-zinc-300">{c}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shipping terms */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-20">
        <div className="mb-12 text-center">
          <FadeUp><span className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400"><span className="h-px w-6 bg-red-500" />Shipping & Export</span></FadeUp>
          <FadeUp delay={0.1}><h2 className="text-2xl font-black uppercase text-white sm:text-4xl md:text-5xl">Export Terms</h2></FadeUp>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { title: "FOB — Free On Board", desc: "We deliver goods to the port of shipment. Buyer arranges freight from port. Most common for experienced importers." },
            { title: "CIF — Cost, Insurance & Freight", desc: "We cover cost, insurance, and freight to the destination port. Buyer handles import clearance and local delivery." },
            { title: "EXW — Ex Works", desc: "Buyer collects from our facility. Full control over freight and logistics. Best for buyers with established freight partners." },
          ].map((t, i) => (
            <FadeUp key={t.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-7 transition-all hover:border-red-500/20">
                <div className="mb-3 h-1 w-10 bg-gradient-to-r from-red-500 to-transparent" />
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">{t.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{t.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6">
        <FadeUp>
          <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/50 via-zinc-950 to-black p-12 text-center md:p-16">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <h2 className="mb-4 text-3xl font-black uppercase text-white md:text-4xl">Ready to Place Your Order?</h2>
            <p className="mx-auto mb-8 max-w-lg text-zinc-400">Start with an inquiry. No commitment required until you're fully satisfied with the terms.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-500">
                Send Inquiry <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="https://wa.me/923377270001" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/40 hover:text-white">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </FadeUp>
      </section>
    </main>
  );
}
