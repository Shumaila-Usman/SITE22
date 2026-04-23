import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomDesign from "@/models/CustomDesign";
import { cookies } from "next/headers";

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("user_id")?.value ?? null;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const design = await CustomDesign.findOne({ _id: id, userId }).lean();
  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ design });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  await connectDB();

  // Only allow updating own designs
  const design = await CustomDesign.findOneAndUpdate(
    { _id: id, userId },
    { $set: body },
    { new: true }
  ).lean();

  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ design });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const design = await CustomDesign.findOneAndDelete({ _id: id, userId });
  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
