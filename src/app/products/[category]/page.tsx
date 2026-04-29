import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import { CATEGORY_META } from "@/lib/products";
import { CategoryCatalogClient } from "@/components/category-catalog-client";

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

  const subPayload = subcategories.map((s) => ({
    _id: s._id.toString(),
    slug: s.slug,
    name: s.name,
  }));

  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <CategoryCatalogClient
          categorySlug={category}
          categoryName={cat.name}
          description={desc}
          subcategories={subPayload}
        />
      </div>
    </main>
  );
}
