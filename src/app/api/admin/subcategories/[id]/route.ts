import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subcategory from "@/models/Subcategory";
import Product from "@/models/Product";
import { getAdminSession, slugify } from "@/lib/auth";
import { z } from "zod";

const UpdateSchema = z.object({
  name:        z.string().min(2).optional(),
  slug:        z.string().optional(),
  categoryId:  z.string().optional(),
  description: z.string().optional(),
  isActive:    z.boolean().optional(),
  order:       z.number().optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const sub = await Subcategory.findById(id).populate("categoryId", "name slug").lean();
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ subcategory: sub });
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

  const sub = await Subcategory.findByIdAndUpdate(id, update, { new: true })
    .populate("categoryId", "name slug")
    .lean();
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ subcategory: sub });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const prodCount = await Product.countDocuments({ subcategoryId: id });
  if (prodCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${prodCount} products depend on this subcategory.` },
      { status: 409 }
    );
  }

  const sub = await Subcategory.findByIdAndDelete(id);
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
