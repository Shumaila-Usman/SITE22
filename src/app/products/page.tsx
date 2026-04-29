import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import { ProductsCatalogClient } from "@/components/products-catalog-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();

  const [categories, subcategories] = await Promise.all([
    Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean(),
    Subcategory.find({ isActive: true }).lean(),
  ]);

  const catPayload = categories.map((c) => ({
    _id: c._id.toString(),
    slug: c.slug,
    name: c.name,
    description: c.description,
  }));

  const subPayload = subcategories.map((s) => ({
    _id: s._id.toString(),
    name: s.name,
    categoryId: s.categoryId.toString(),
  }));

  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <ProductsCatalogClient categories={catPayload} subcategories={subPayload} />
      </div>
    </main>
  );
}
