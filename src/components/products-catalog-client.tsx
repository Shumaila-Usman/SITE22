"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { CATEGORY_META } from "@/lib/products";

export type CatalogCategory = {
  _id: string;
  slug: string;
  name: string;
  description?: string | null;
};

export type CatalogSubcategory = {
  _id: string;
  name: string;
  categoryId: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  "sports-wear": "from-red-600/30",
  "fitness-wear": "from-orange-700/25",
  "casual-wear": "from-rose-700/25",
};

export function ProductsCatalogClient({
  categories,
  subcategories,
}: {
  categories: CatalogCategory[];
  subcategories: CatalogSubcategory[];
}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="mb-14">
        <span className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
          <span className="h-px w-6 bg-red-500" />
          {t("products.catalogEyebrow")}
        </span>
        <h1 className="mb-4 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
          {t("products.title")}
        </h1>
        <p className="max-w-xl text-[1.0625rem] leading-relaxed text-zinc-400">
          {t("products.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat.name as keyof typeof CATEGORY_META];
          const catSubs = subcategories.filter(
            (s) => s.categoryId === cat._id.toString(),
          );
          const color = meta?.color ?? CATEGORY_COLORS[cat.slug] ?? "from-zinc-700/25";
          const image = meta?.image ?? "/images/products/placeholder.jpg";
          const desc = meta?.desc ?? cat.description ?? "";

          return (
            <Link key={cat._id} href={`/products/${cat.slug}`} className="group block">
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/60 transition-all duration-300 hover:border-white/[0.16] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} to-transparent opacity-60 transition-opacity group-hover:opacity-80`} />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-300 backdrop-blur-sm">
                      {t("common.moqBadge")}
                    </span>
                    <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-300 backdrop-blur-sm">
                      {t("common.subcategories", { count: String(catSubs.length) })}
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <h2 className="mb-2 text-xl font-black uppercase text-white">{cat.name}</h2>
                  <p className="mb-5 text-sm leading-relaxed text-zinc-400">{desc}</p>

                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {catSubs.slice(0, 5).map((sub) => (
                      <span
                        key={sub._id}
                        className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-500"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {catSubs.length > 5 && (
                      <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-red-400">
                        {t("common.moreCount", { count: String(catSubs.length - 5) })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold text-red-400 transition-colors group-hover:text-red-300">
                    {t("common.browse")} {cat.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
