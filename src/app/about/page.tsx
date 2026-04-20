"use client";

import { motion } from "framer-motion";
import { PageHero } from "@/components/page-hero";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Company Overview"
        title="Engineered In Industry, Driven By Sport"
        description="Megacore International combines factory-scale execution with performance-first product mindset for global sportswear labels."
      />
      <section className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="section-glow -left-24 top-20" />
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-zinc-900/70 p-8"
          >
            <h2 className="text-2xl font-bold uppercase text-white">Our DNA</h2>
            <p className="mt-4 text-zinc-300">
              We are built around throughput, quality discipline, and adaptive
              design execution. This allows brands to grow quickly without
              compromising consistency.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-800/20 via-zinc-900 to-zinc-900 p-8"
          >
            <h2 className="text-2xl font-bold uppercase text-white">Global Reach</h2>
            <p className="mt-4 text-zinc-300">
              Our export operations support custom packaging, documentation
              readiness, and coordinated shipping to help partners launch and
              replenish confidently.
            </p>
          </motion.div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {["95+ Production Specialists", "24/6 Factory Operations", "42 Export Markets"].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/10 bg-black/40 p-5 text-sm uppercase tracking-[0.16em] text-zinc-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
