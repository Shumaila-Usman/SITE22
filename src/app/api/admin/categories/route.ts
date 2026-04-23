import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { getAdminSession, slugify } from "@/lib/auth";
import { z } from "zod";

const CategorySchema = z.object({
  name:        z.string().min(2),
  slug:        z.string().optional(),
  description: z.string().optional(),
  image:       z.string().optional(),
  isActive:    z.boolean().default(true),
  order:       z.number().default(0),
});

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CategorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);
  const exists = await Category.findOne({ slug });
  if (exists) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const category = await Category.create({ ...parsed.data, slug });
  return NextResponse.json({ category }, { status: 201 });
}
