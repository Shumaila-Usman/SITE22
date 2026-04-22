import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  SLUG_TO_CATEGORY,
  SUB_CATEGORIES,
  CATEGORY_META,
  subCategorySlug,
  MAIN_CATEGORIES,
} from "@/lib/products";

export async function generateStaticParams() {
  return MAIN_CATEGORIES.map((cat) => ({
    category: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const main = SLUG_TO_CATEGORY[category];
  if (!main) return { title: "Not Found" };
  return {
    title: `${main} | Megacore International`,
    description: CATEGORY_META[main].desc,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const main = SLUG_TO_CATEGORY[category];
  if (!main) notFound();

  const subs = SUB_CATEGORIES[main];
  const meta = CATEGORY_META[main];

  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <div className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <Link href="/products" className="flex items-center gap-1.5 transition-colors hover:text-white">
            <ArrowLeft className="h-3 w-3" /> Products
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{main}</span>
        </div>

        {/* Header */}
        <div className="mb-14">
          <span className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
            <span className="h-px w-6 bg-red-500" />
            {main}
          </span>
          <h1 className="mb-4 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
            {main}
          </h1>
          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-zinc-400">
            {meta.desc}
          </p>
        </div>

        {/* Sub-category grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subs.map((sub) => (
            <Link
              key={sub}
              href={`/products/${category}/${subCategorySlug(sub)}`}
              className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-zinc-900/60 px-5 py-5 transition-all hover:border-red-500/30 hover:bg-zinc-900/90"
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-white transition-colors group-hover:text-red-300">
                  {sub}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                  MOQ: 50 pcs
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-red-400" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
