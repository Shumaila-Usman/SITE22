"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Gauge, PackageCheck, Plane, Timer } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsStrip() {
  const stats = [
    { label: "Units / Month", value: "280K+" },
    { label: "Countries Served", value: "42" },
    { label: "Avg Sampling Lead Time", value: "5 days" },
    { label: "On-time Export Dispatch", value: "98.4%" },
  ];

  return (
    <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-20">
      <div className="section-glow -left-20 top-8" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: idx * 0.1 }}
            className="relative overflow-hidden rounded-xl border border-white/15 bg-zinc-900/70 p-6"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-700 via-red-400 to-transparent" />
            <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-red-400/15 blur-xl" />
            <p className="text-3xl font-black text-white">{item.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

export function ProductShowcase() {
  const cards = [
    { name: "Compression Systems", moq: "MOQ: 600", color: "from-red-500/30" },
    { name: "Teamwear Kits", moq: "MOQ: 400", color: "from-orange-500/20" },
    { name: "Athleisure Lines", moq: "MOQ: 800", color: "from-rose-500/20" },
  ];

  return (
    <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-20" direction="left">
      <div className="section-glow -right-10 top-20" />
      <div className="mb-10 flex items-end justify-between gap-6">
        <h2 className="text-3xl font-black uppercase text-white md:text-5xl">
          Product Domains
        </h2>
        <p className="max-w-xl text-sm text-zinc-400">
          Bold category architecture built for high-volume performance and
          design precision across sports verticals.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-12">
        {cards.map((card, idx) => (
          <motion.article
            key={card.name}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 p-8",
              idx === 0 && "md:col-span-5",
              idx === 1 && "md:col-span-3 md:translate-y-8",
              idx === 2 && "md:col-span-4",
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br to-transparent opacity-60 transition-opacity group-hover:opacity-90",
                card.color,
              )}
            />
            <div className="relative">
              <span className="rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-widest text-zinc-200">
                {card.moq}
              </span>
              <h3 className="mt-6 text-2xl font-bold uppercase text-white">
                {card.name}
              </h3>
              <p className="mt-3 text-sm text-zinc-300">
                Technical pattern engineering, pro-level stitching paths, and
                export-stable packaging from one integrated flow.
              </p>
              <button className="mt-8 inline-flex items-center text-sm font-semibold text-red-300">
                Explore Category <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </AnimatedSection>
  );
}

export function ProcessFlow() {
  const steps = [
    { title: "Brief & Specs", icon: Gauge },
    { title: "Rapid Sampling", icon: Timer },
    { title: "Mass Production", icon: PackageCheck },
    { title: "Global Dispatch", icon: Plane },
  ];

  return (
    <AnimatedSection className="relative mx-auto max-w-7xl px-6 py-20" direction="right">
      <div className="section-glow left-20 top-20" />
      <h2 className="text-3xl font-black uppercase text-white md:text-5xl">
        Order Flow Engine
      </h2>
      <div className="relative mt-12">
        <div className="absolute left-0 right-0 top-10 hidden h-0.5 bg-gradient-to-r from-red-600 via-red-300 to-transparent md:block" />
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
              >
                <Card className="relative p-6">
                  <div className="mb-4 inline-flex rounded-md border border-red-500/50 bg-red-500/10 p-3">
                    <Icon className="h-5 w-5 text-red-300" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Step 0{idx + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-bold uppercase text-white">
                    {step.title}
                  </h3>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

export function CTASection() {
  return (
    <AnimatedSection className="mx-auto max-w-7xl px-6 pb-24 pt-16">
      <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-800/40 via-zinc-950 to-black p-10 md:p-14">
        <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full border border-red-500/20 bg-red-500/20 blur-3xl" />
        <h2 className="max-w-3xl text-3xl font-black uppercase text-white md:text-5xl">
          Launch Your Next Performance Collection With Megacore
        </h2>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Move from concept to export-ready production through a manufacturing
          partner designed for precision, velocity, and consistency.
        </p>
        <button className="mt-8 rounded-md border border-red-400 bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:scale-[1.02] hover:bg-red-500">
          Book Production Consultation
        </button>
      </div>
    </AnimatedSection>
  );
}
