import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  SLUG_TO_CATEGORY,
  subCategoryFromSlug,
  getProductsBySubCategory,
  MAIN_CATEGORIES,
  SUB_CATEGORIES,
  subCategorySlug,
} from "@/lib/products";
import { SubCategoryClient } from "./subcategory-client";

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = [];
  for (const cat of MAIN_CATEGORIES) {
    const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    for (const sub of SUB_CATEGORIES[cat]) {
      params.push({ category: catSlug, subcategory: subCategorySlug(sub) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  const main = SLUG_TO_CATEGORY[category];
  if (!main) return { title: "Not Found" };
  const sub = subCategoryFromSlug(subcategory, main);
  if (!sub) return { title: "Not Found" };
  return {
    title: `${sub} | ${main} | Megacore International`,
    description: `Browse ${sub} — premium sportswear manufactured by Megacore International. MOQ 50 pieces. Custom manufacturing available.`,
  };
}

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  const main = SLUG_TO_CATEGORY[category];
  if (!main) notFound();

  const sub = subCategoryFromSlug(subcategory, main);
  if (!sub) notFound();

  const products = getProductsBySubCategory(sub);

  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <div className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <Link href="/products" className="transition-colors hover:text-white">
            Products
          </Link>
          <span>/</span>
          <Link href={`/products/${category}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
            {main}
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{sub}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <span className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
            <span className="h-px w-6 bg-red-500" />
            {main}
          </span>
          <h1 className="mb-3 text-4xl font-black uppercase leading-tight text-white md:text-5xl">
            {sub}
          </h1>
          <p className="text-zinc-400">
            {products.length} product{products.length !== 1 ? "s" : ""} · MOQ 50 pcs · Custom manufacturing available
          </p>
        </div>

        {/* Products — client component for wishlist interactivity */}
        <SubCategoryClient products={products} />
      </div>
    </main>
  );
}
