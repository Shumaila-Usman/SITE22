import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import { CATEGORY_META } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  await connectDB();
  const cat = await Category.findOne({ slug: category, isActive: true }).lean();
  if (!cat) return { title: "Not Found" };
  const meta = CATEGORY_META[cat.name as keyof typeof CATEGORY_META];
  return {
    title: `${cat.name} | Megacore International`,
    description: meta?.desc ?? cat.description ?? "",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  await connectDB();

  const cat = await Category.findOne({ slug: category, isActive: true }).lean();
  if (!cat) notFound();

  const subcategories = await Subcategory.find({
    categoryId: cat._id,
    isActive: true,
  })
    .sort({ order: 1, name: 1 })
    .lean();

  const meta = CATEGORY_META[cat.name as keyof typeof CATEGORY_META];
  const desc = meta?.desc ?? cat.description ?? "";

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
          <span className="text-zinc-300">{cat.name}</span>
        </div>

        {/* Header */}
        <div className="mb-14">
          <span className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
            <span className="h-px w-6 bg-red-500" />
            {cat.name}
          </span>
          <h1 className="mb-4 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
            {cat.name}
          </h1>
          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-zinc-400">{desc}</p>
        </div>

        {/* Sub-category grid */}
        {subcategories.length === 0 ? (
          <p className="text-zinc-500">No subcategories yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subcategories.map((sub) => (
              <Link
                key={sub._id.toString()}
                href={`/products/${category}/${sub.slug}`}
                className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-zinc-900/60 px-5 py-5 transition-all hover:border-red-500/30 hover:bg-zinc-900/90"
              >
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-white transition-colors group-hover:text-red-300">
                    {sub.name}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                    MOQ: 50 pcs
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-red-400" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
