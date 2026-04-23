import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAdminSession, slugify } from "@/lib/auth";
import { z } from "zod";

const UpdateSchema = z.object({
  code:             z.string().min(1).optional(),
  name:             z.string().min(2).optional(),
  slug:             z.string().optional(),
  categoryId:       z.string().optional(),
  subcategoryId:    z.string().nullable().optional(),
  shortDescription: z.string().optional(),
  fullDescription:  z.string().optional(),
  materials:        z.string().optional(),
  sizes:            z.string().optional(),
  colors:           z.string().optional(),
  moq:              z.number().min(1).optional(),
  price:            z.number().nullable().optional(),
  currency:         z.string().optional(),
  image:            z.string().optional(),
  gallery:          z.array(z.string()).optional(),
  tags:             z.array(z.string()).optional(),
  isActive:         z.boolean().optional(),
  isFeatured:       z.boolean().optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id)
    .populate("categoryId", "name slug")
    .populate("subcategoryId", "name slug")
    .lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
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

  const product = await Product.findByIdAndUpdate(id, update, { new: true })
    .populate("categoryId", "name slug")
    .populate("subcategoryId", "name slug")
    .lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const product = await Product.findByIdAndDelete(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
