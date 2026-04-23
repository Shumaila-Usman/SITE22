import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomDesign from "@/models/CustomDesign";
import { z } from "zod";
import { cookies } from "next/headers";

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("user_id")?.value ?? null;
}

const DesignSchema = z.object({
  title:           z.string().min(1).max(80).default("My Design"),
  productTemplate: z.enum(["jersey", "shirt", "trouser", "tracksuit", "hoodie", "shorts"]),
  primaryColor:    z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#EF4444"),
  secondaryColor:  z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF"),
  accentColor:     z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#1a1a1a"),
  sleeveColor:     z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#EF4444"),
  collarColor:     z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#1a1a1a"),
  stripeColor:     z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF"),
  logoUrl:         z.string().optional(),
  logoPosition:    z.enum(["chest", "back", "sleeve", "none"]).default("chest"),
  customText:      z.string().max(40).optional(),
  customNumber:    z.string().max(4).optional(),
  fabricPattern:   z.enum(["solid", "stripes", "gradient", "camo"]).default("solid"),
  designConfig:    z.record(z.string(), z.unknown()).optional(),
  previewImageUrl: z.string().optional(),
});

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const designs = await CustomDesign.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ designs });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = DesignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();
  const design = await CustomDesign.create({ ...parsed.data, userId });
  return NextResponse.json({ design }, { status: 201 });
}
