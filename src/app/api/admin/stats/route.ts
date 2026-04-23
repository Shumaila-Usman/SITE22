import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const [totalUsers, totalCategories, totalSubcategories, totalProducts, recentProducts, recentUsers] =
    await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Subcategory.countDocuments(),
      Product.countDocuments(),
      Product.find().sort({ createdAt: -1 }).limit(5).populate("categoryId", "name").lean(),
      User.find().sort({ createdAt: -1 }).limit(5).select("-password").lean(),
    ]);

  return NextResponse.json({
    totalUsers,
    totalCategories,
    totalSubcategories,
    totalProducts,
    recentProducts,
    recentUsers,
  });
}
