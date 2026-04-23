import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomDesign from "@/models/CustomDesign";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const page   = parseInt(searchParams.get("page") ?? "1");
  const limit  = parseInt(searchParams.get("limit") ?? "20");

  const query: Record<string, unknown> = {};
  if (status) query.inquiryStatus = status;

  const [designs, total] = await Promise.all([
    CustomDesign.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name email company country")
      .lean(),
    CustomDesign.countDocuments(query),
  ]);

  return NextResponse.json({ designs, total, page, limit });
}
