import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomDesign from "@/models/CustomDesign";
import { getAdminSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const design = await CustomDesign.findById(id)
    .populate("userId", "name email company country")
    .lean();

  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ design });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  await connectDB();
  const design = await CustomDesign.findByIdAndUpdate(
    id,
    { $set: { inquiryStatus: body.inquiryStatus } },
    { new: true }
  ).populate("userId", "name email company country").lean();

  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ design });
}
