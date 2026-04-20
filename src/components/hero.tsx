"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const title = ["Built", "For", "Performance", "At", "Global", "Scale"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.24),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_25%)]" />
      <div className="absolute inset-0 bg-grid bg-[size:44px_44px] opacity-30" />
      <div className="noise-overlay" />
      <div className="absolute -left-20 top-16 h-56 w-56 rotate-12 rounded-3xl border border-red-500/30 bg-red-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-64 w-64 rounded-full border border-white/20 bg-white/5 blur-3xl" />
      <div className="section-glow -bottom-24 left-10" />

      <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 w-fit border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-red-300"
          >
            Sportswear Manufacturer & Exporter
          </motion.p>

          <h1 className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-5xl font-black uppercase leading-[0.88] tracking-tight text-transparent md:text-7xl">
            {title.map((word, index) => (
              <motion.span
                key={word + index}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="mr-4 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 max-w-2xl text-lg text-zinc-300"
          >
            Megacore International engineers high-performance apparel through
            vertically integrated manufacturing, rapid development pipelines, and
            logistics-ready export delivery across global markets.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.52 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button size="lg">
              Start Production
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              <PlayCircle className="h-4 w-4" />
              Watch Facility Reel
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.3 }}
          whileHover={{ y: -8 }}
          className="relative"
        >
          <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-zinc-800 via-zinc-950 to-black p-6 shadow-glow">
            <div className="h-full rounded-xl border border-white/15 bg-[linear-gradient(130deg,rgba(239,68,68,0.18),rgba(0,0,0,0.82)_38%,rgba(255,255,255,0.08))] p-6">
              <div className="grid h-full grid-cols-6 gap-3">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.9, 0.3] }}
                    transition={{
                      duration: 2.6,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.05,
                    }}
                    className="rounded-sm bg-red-400/40"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-20 w-full -skew-y-2 bg-gradient-to-r from-red-900/20 via-red-500/10 to-zinc-950" />
    </section>
  );
}
