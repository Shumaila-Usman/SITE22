import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UploadedDesign from "@/models/UploadedDesign";
import { cookies } from "next/headers";
import { z } from "zod";

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("user_id")?.value ?? null;
}

const Schema = z.object({
  designTitle:        z.string().min(1).max(100),
  productType:        z.enum(["jersey", "shirt", "trouser", "tracksuit", "hoodie", "sportswear-set", "other"]),
  fileUrl:            z.string().min(1),
  fileType:           z.string().min(1),
  fileName:           z.string().min(1),
  quantity:           z.number().min(50),
  preferredFabric:    z.string().max(200).optional(),
  preferredColors:    z.string().max(200).optional(),
  sizeRange:          z.string().max(100).optional(),
  customizationNotes: z.string().max(1000).optional(),
  country:            z.string().max(100).optional(),
  companyName:        z.string().max(200).optional(),
  additionalMessage:  z.string().max(1000).optional(),
});

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const designs = await UploadedDesign.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ designs });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();
  const design = await UploadedDesign.create({ ...parsed.data, userId });
  return NextResponse.json({ design }, { status: 201 });
}
