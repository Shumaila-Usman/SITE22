import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import ProductModel from "@/models/Product";
import { dbProductToProduct } from "@/lib/products";
import { ProductDetailClient } from "./product-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const product = await ProductModel.findOne({ slug, isActive: true }).lean();
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.code} | Megacore International`,
    description: product.shortDescription ?? "",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const { category, subcategory, slug } = await params;
  await connectDB();

  const cat = await Category.findOne({ slug: category }).lean();
  const sub = cat
    ? await Subcategory.findOne({ slug: subcategory, categoryId: cat._id }).lean()
    : null;

  const dbProduct = await ProductModel.findOne({ slug, isActive: true })
    .populate("categoryId", "name slug")
    .populate("subcategoryId", "name slug")
    .lean();

  if (!dbProduct) notFound();

  const product = dbProductToProduct(dbProduct);

  // Related products in the same subcategory
  const dbRelated = await ProductModel.find({
    subcategoryId: dbProduct.subcategoryId,
    isActive: true,
    _id: { $ne: dbProduct._id },
  })
    .populate("categoryId", "name slug")
    .populate("subcategoryId", "name slug")
    .limit(4)
    .lean();

  const related = dbRelated.map(dbProductToProduct);

  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(239,68,68,0.07),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <div className="mb-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <Link href="/products" className="transition-colors hover:text-white">Products</Link>
          <span>/</span>
          <Link href={`/products/${category}`} className="transition-colors hover:text-white">
            {cat?.name ?? category}
          </Link>
          <span>/</span>
          <Link href={`/products/${category}/${subcategory}`} className="transition-colors hover:text-white">
            {sub?.name ?? subcategory}
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{product.code}</span>
        </div>

        {/* Main grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/60">
            {product.image ? (
              <div className="relative h-full w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">Product Code</p>
                  <p className="mt-2 text-3xl font-black text-zinc-400">{product.code}</p>
                  <p className="mt-1 text-xs text-zinc-600">{product.subCategory}</p>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-red-400">
              <span className="h-px w-5 bg-red-500" />
              {product.mainCategory} — {product.subCategory}
            </span>
            <h1 className="mb-2 text-3xl font-black uppercase leading-tight text-white md:text-4xl">
              {product.subCategory}
            </h1>
            <p className="mb-1 font-mono text-sm text-zinc-500">{product.code}</p>
            <p className="mb-8 text-[1.0625rem] leading-[1.75] text-zinc-400">{product.description}</p>

            {/* Specs */}
            <div className="mb-8 grid grid-cols-2 gap-3">
              {[
                { label: "MOQ",      value: `${product.moq} pieces` },
                { label: "Sizes",    value: product.sizes   || "—" },
                { label: "Colors",   value: product.colors  || "—" },
                { label: "Currency", value: product.currency },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/[0.07] bg-zinc-900/50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{s.label}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-200">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Auth-gated price + wishlist */}
            <ProductDetailClient product={product} />

            {/* WhatsApp inquiry */}
            <a
              href={`https://wa.me/923001234567?text=${encodeURIComponent(
                `Hello, I am interested in:\n\nProduct: ${product.subCategory}\nCode: ${product.code}\nCategory: ${product.mainCategory}\n\nPlease share pricing, customization options, and next steps.\n\nThank you.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-5 py-3 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-4 w-4" />
              Inquire on WhatsApp
            </a>

            {/* Trust notes */}
            <div className="mt-8 space-y-2 border-t border-white/[0.06] pt-6">
              {[
                "Custom logos, colors, and sizes available",
                "OEM & private label manufacturing",
                "Export-ready packaging included",
                "Sample available before bulk production",
              ].map((note) => (
                <div key={note} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-red-500/60" />
                  <span className="text-xs text-zinc-400">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-xl font-black uppercase text-white">More in {product.subCategory}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${category}/${subcategory}/${p.slug}`}
                  className="group rounded-xl border border-white/[0.07] bg-zinc-900/60 p-5 transition-colors hover:border-red-500/20"
                >
                  <p className="font-mono text-xs text-zinc-500">{p.code}</p>
                  <p className="mt-1 text-sm font-bold uppercase text-white group-hover:text-red-300">{p.subCategory}</p>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{p.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
