import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subcategory from "@/models/Subcategory";
import { getAdminSession, slugify } from "@/lib/auth";
import { z } from "zod";

const SubcategorySchema = z.object({
  name:        z.string().min(2),
  slug:        z.string().optional(),
  categoryId:  z.string().min(1),
  description: z.string().optional(),
  isActive:    z.boolean().default(true),
  order:       z.number().default(0),
});

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  const query = categoryId ? { categoryId } : {};
  const subcategories = await Subcategory.find(query)
    .populate("categoryId", "name slug")
    .sort({ order: 1, name: 1 })
    .lean();

  return NextResponse.json({ subcategories });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = SubcategorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);
  const exists = await Subcategory.findOne({ slug, categoryId: parsed.data.categoryId });
  if (exists) return NextResponse.json({ error: "Slug already in use in this category" }, { status: 409 });

  const subcategory = await Subcategory.create({ ...parsed.data, slug });
  return NextResponse.json({ subcategory }, { status: 201 });
}
