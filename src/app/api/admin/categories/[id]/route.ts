import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import Product from "@/models/Product";
import { getAdminSession, slugify } from "@/lib/auth";
import { z } from "zod";

const UpdateSchema = z.object({
  name:        z.string().min(2).optional(),
  slug:        z.string().optional(),
  description: z.string().optional(),
  image:       z.string().optional(),
  isActive:    z.boolean().optional(),
  order:       z.number().optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const category = await Category.findById(id).lean();
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();

  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.slug) update.slug = slugify(parsed.data.slug);
  else if (parsed.data.name) update.slug = slugify(parsed.data.name);

  const category = await Category.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  // Check for dependent subcategories/products
  const subCount = await Subcategory.countDocuments({ categoryId: id });
  const prodCount = await Product.countDocuments({ categoryId: id });

  if (subCount > 0 || prodCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${subCount} subcategories and ${prodCount} products depend on this category.` },
      { status: 409 }
    );
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
