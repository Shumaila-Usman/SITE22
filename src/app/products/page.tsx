"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MAIN_CATEGORIES, CATEGORY_META, CATEGORY_SLUGS, SUB_CATEGORIES } from "@/lib/products";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
            <span className="h-px w-6 bg-red-500" />
            Product Catalog
          </span>
          <h1 className="mb-4 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
            Our Products
          </h1>
          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-zinc-400">
            Browse by category. Sign in to view pricing and save products to your wishlist.
          </p>
        </motion.div>

        {/* 3 main category cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {MAIN_CATEGORIES.map((cat, i) => {
            const meta = CATEGORY_META[cat];
            const slug = CATEGORY_SLUGS[cat];
            const subCount = SUB_CATEGORIES[cat].length;

            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
              >
                <Link href={`/products/${slug}`} className="group block">
                  <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/60 transition-all duration-300 hover:border-white/[0.16] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={meta.image}
                        alt={cat}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${meta.color} to-transparent opacity-60 transition-opacity group-hover:opacity-80`} />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-300 backdrop-blur-sm">
                          MOQ: 50 pcs
                        </span>
                        <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-300 backdrop-blur-sm">
                          {subCount} sub-categories
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7">
                      <h2 className="mb-2 text-xl font-black uppercase text-white">{cat}</h2>
                      <p className="mb-5 text-sm leading-relaxed text-zinc-400">{meta.desc}</p>

                      {/* Sub-category preview tags */}
                      <div className="mb-5 flex flex-wrap gap-1.5">
                        {SUB_CATEGORIES[cat].slice(0, 5).map((sub) => (
                          <span key={sub} className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-500">
                            {sub}
                          </span>
                        ))}
                        {SUB_CATEGORIES[cat].length > 5 && (
                          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-red-400">
                            +{SUB_CATEGORIES[cat].length - 5} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-red-400 transition-colors group-hover:text-red-300">
                        Browse {cat}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
