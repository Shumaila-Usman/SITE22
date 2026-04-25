import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomDesign from "@/models/CustomDesign";
import { z } from "zod";
import { cookies } from "next/headers";

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("user_id")?.value ?? null;
}

const HexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

const StripeConfigSchema = z.object({
  enabled:   z.boolean().default(false),
  position:  z.enum(["side", "sleeve", "shoulder", "chest", "vertical-center"]).default("side"),
  count:     z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  thickness: z.enum(["thin", "medium", "thick"]).default("medium"),
  color:     HexColor.default("#FFFFFF"),
  color2:    HexColor.optional(),
  color3:    HexColor.optional(),
  bothSides: z.boolean().optional(),
}).optional();

const PanelConfigSchema = z.object({
  chestPanel:  HexColor.optional(),
  sidePanel:   HexColor.optional(),
  sleevePanel: HexColor.optional(),
  cuffColor:   HexColor.optional(),
  collarColor: HexColor.optional(),
}).optional();

const DesignSchema = z.object({
  title:           z.string().min(1).max(80).default("My Design"),
  productTemplate: z.enum(["jersey", "shirt", "trouser", "tracksuit", "hoodie", "shorts"]),
  primaryColor:    HexColor.default("#EF4444"),
  secondaryColor:  HexColor.default("#FFFFFF"),
  accentColor:     HexColor.default("#1a1a1a"),
  sleeveColor:     HexColor.default("#EF4444"),
  collarColor:     HexColor.default("#1a1a1a"),
  stripeColor:     HexColor.default("#FFFFFF"),
  logoUrl:         z.string().url().optional().or(z.literal("")),
  logoPosition:    z.enum(["chest", "back", "sleeve", "none"]).default("chest"),
  customText:      z.string().max(40).optional(),
  customNumber:    z.string().max(4).optional(),
  fabricPattern:   z.enum(["solid", "stripes", "gradient", "camo", "diagonal", "geometric", "mesh", "panel", "chevron", "honeycomb"]).default("solid"),
  stripes:         StripeConfigSchema,
  panels:          PanelConfigSchema,
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

  const { stripes, panels, ...rest } = parsed.data;

  await connectDB();
  const design = await CustomDesign.create({
    ...rest,
    userId,
    // merge stripes + panels into designConfig for storage
    designConfig: {
      ...(rest.designConfig ?? {}),
      stripes: stripes ?? null,
      panels:  panels  ?? null,
    },
  });
  return NextResponse.json({ design }, { status: 201 });
}
