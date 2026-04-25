import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UploadedDesign from "@/models/UploadedDesign";
import { cookies } from "next/headers";

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("user_id")?.value ?? null;
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const design = await UploadedDesign.findOne({ _id: id, userId });
  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await design.deleteOne();
  return NextResponse.json({ success: true });
}
