"use client";

import { motion } from "framer-motion";
import { PageHero } from "@/components/page-hero";

const steps = [
  "Design brief, fabric references, and target specs",
  "Pattern engineering and sample construction",
  "Feedback loop and fit/performance refinement",
  "Bulk production run with live quality tracking",
  "Packing, compliance docs, and export dispatch",
];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Execution Timeline"
        title="A Connected Production Path, Not Isolated Steps"
        description="Our process architecture keeps decisions, approvals, and manufacturing synchronized to avoid delays and maintain launch velocity."
      />
      <section className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="section-glow -right-20 top-28" />
        <div className="relative">
          <div className="absolute left-6 top-2 h-[92%] w-0.5 bg-gradient-to-b from-red-500 via-red-300 to-transparent md:left-1/2" />
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="relative md:grid md:grid-cols-2"
              >
                <div className={idx % 2 === 0 ? "md:pr-16" : "md:col-start-2 md:pl-16"}>
                  <div className="group rounded-xl border border-white/10 bg-zinc-900/70 p-6 transition hover:border-red-500/45">
                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                      Node 0{idx + 1}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">{step}</p>
                    <div className="mt-4 h-1 w-20 bg-gradient-to-r from-red-500 to-transparent transition group-hover:w-32" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
