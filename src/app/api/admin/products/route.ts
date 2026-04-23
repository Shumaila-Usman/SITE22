import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAdminSession, slugify } from "@/lib/auth";
import { z } from "zod";

const ProductSchema = z.object({
  code:             z.string().min(1),
  name:             z.string().min(2),
  slug:             z.string().optional(),
  categoryId:       z.string().min(1),
  subcategoryId:    z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription:  z.string().optional(),
  materials:        z.string().optional(),
  sizes:            z.string().optional(),
  colors:           z.string().optional(),
  moq:              z.number().min(1).default(50),
  price:            z.number().nullable().optional(),
  currency:         z.string().default("USD"),
  image:            z.string().optional(),
  gallery:          z.array(z.string()).optional(),
  tags:             z.array(z.string()).optional(),
  isActive:         z.boolean().default(true),
  isFeatured:       z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const search      = searchParams.get("search") ?? "";
  const categoryId  = searchParams.get("categoryId") ?? "";
  const subcatId    = searchParams.get("subcategoryId") ?? "";
  const isActive    = searchParams.get("isActive");
  const page        = parseInt(searchParams.get("page") ?? "1");
  const limit       = parseInt(searchParams.get("limit") ?? "20");

  const query: Record<string, unknown> = {};
  if (search) query.$text = { $search: search };
  if (categoryId) query.categoryId = categoryId;
  if (subcatId) query.subcategoryId = subcatId;
  if (isActive !== null && isActive !== "") query.isActive = isActive === "true";

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = ProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  const [codeExists, slugExists] = await Promise.all([
    Product.findOne({ code: parsed.data.code }),
    Product.findOne({ slug }),
  ]);
  if (codeExists) return NextResponse.json({ error: "Product code already in use" }, { status: 409 });
  if (slugExists) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const product = await Product.create({ ...parsed.data, slug });
  return NextResponse.json({ product }, { status: 201 });
}
