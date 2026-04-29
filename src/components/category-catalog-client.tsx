"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export type CategorySub = { _id: string; slug: string; name: string };

export function CategoryCatalogClient({
  categorySlug,
  categoryName,
  description,
  subcategories,
}: {
  categorySlug: string;
  categoryName: string;
  description: string;
  subcategories: CategorySub[];
}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        <Link href="/products" className="flex items-center gap-1.5 transition-colors hover:text-white">
          <ArrowLeft className="h-3 w-3" /> {t("common.products")}
        </Link>
        <span>/</span>
        <span className="text-zinc-300">{categoryName}</span>
      </div>

      <div className="mb-14">
        <span className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
          <span className="h-px w-6 bg-red-500" />
          {categoryName}
        </span>
        <h1 className="mb-4 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
          {categoryName}
        </h1>
        <p className="max-w-xl text-[1.0625rem] leading-relaxed text-zinc-400">{description}</p>
      </div>

      {subcategories.length === 0 ? (
        <p className="text-zinc-500">{t("common.noSubcategories")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subcategories.map((sub) => (
            <Link
              key={sub._id}
              href={`/products/${categorySlug}/${sub.slug}`}
              className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-zinc-900/60 px-5 py-5 transition-all hover:border-red-500/30 hover:bg-zinc-900/90"
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-white transition-colors group-hover:text-red-300">
                  {sub.name}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                  {t("common.moqBadge")}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-red-400" />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
