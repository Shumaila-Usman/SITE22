import { NextResponse } from "next/server";
import { scanCustomizationTemplates } from "@/lib/scan-customization-templates";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const templates = scanCustomizationTemplates();
    return NextResponse.json({ templates });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load templates" }, { status: 500 });
  }
}
