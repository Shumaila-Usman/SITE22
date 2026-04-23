import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const search     = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const subcatId   = searchParams.get("subcategoryId") ?? "";
  const featured   = searchParams.get("featured");
  const limit      = parseInt(searchParams.get("limit") ?? "100");

  const query: Record<string, unknown> = { isActive: true };
  if (search) query.$text = { $search: search };
  if (categoryId) query.categoryId = categoryId;
  if (subcatId) query.subcategoryId = subcatId;
  if (featured === "true") query.isFeatured = true;

  const products = await Product.find(query)
    .populate("categoryId", "name slug")
    .populate("subcategoryId", "name slug")
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ products });
}
