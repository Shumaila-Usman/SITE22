import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import Product from "@/models/Product";
import { dbProductToProduct } from "@/lib/products";
import { SubCategoryClient } from "./subcategory-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  await connectDB();
  const cat = await Category.findOne({ slug: category }).lean();
  if (!cat) return { title: "Not Found" };
  const sub = await Subcategory.findOne({ slug: subcategory, categoryId: cat._id }).lean();
  if (!sub) return { title: "Not Found" };
  return {
    title: `${sub.name} | ${cat.name} | Megacore International`,
    description: `Browse ${sub.name} — premium sportswear manufactured by Megacore International. MOQ 50 pieces. Custom manufacturing available.`,
  };
}

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  await connectDB();

  const cat = await Category.findOne({ slug: category, isActive: true }).lean();
  if (!cat) notFound();

  const sub = await Subcategory.findOne({
    slug: subcategory,
    categoryId: cat._id,
    isActive: true,
  }).lean();
  if (!sub) notFound();

  const dbProducts = await Product.find({
    subcategoryId: sub._id,
    isActive: true,
  })
    .populate("categoryId", "name slug")
    .populate("subcategoryId", "name slug")
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  const products = dbProducts.map(dbProductToProduct);

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
          <Link href={`/products/${category}`} className="transition-colors hover:text-white">
            {cat.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{sub.name}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <span className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-red-400">
            <span className="h-px w-6 bg-red-500" />
            {cat.name}
          </span>
          <h1 className="mb-3 text-4xl font-black uppercase leading-tight text-white md:text-5xl">
            {sub.name}
          </h1>
          <p className="text-zinc-400">
            {products.length} product{products.length !== 1 ? "s" : ""} · MOQ 50 pcs · Custom manufacturing available
          </p>
        </div>

        <SubCategoryClient products={products} />
      </div>
    </main>
  );
}
