import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";

export async function GET() {
  await connectDB();

  const [categories, subcategories] = await Promise.all([
    Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean(),
    Subcategory.find({ isActive: true })
      .populate("categoryId", "name slug")
      .sort({ order: 1, name: 1 })
      .lean(),
  ]);

  return NextResponse.json({ categories, subcategories });
}
