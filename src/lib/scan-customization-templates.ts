import fs from "fs";
import path from "path";
import type { GarmentCategoryKey, GarmentSide, GarmentTemplate } from "@/lib/customization-types";
import { CATEGORY_SIDES } from "@/lib/customization-types";

const EXT = /\.(png|jpe?g|webp)$/i;
const WITH_SIDE = /^(.+)-(front|back|left|right)$/i;

function inferCategory(templateId: string): GarmentCategoryKey {
  const id = templateId.toLowerCase();
  if (id.startsWith("hoodie")) return "Hoodies";
  if (id.startsWith("tshirt")) return "T-Shirts";
  if (id.startsWith("jacket")) return "Jackets";
  if (id.startsWith("trouser")) return "Trousers";
  if (id.startsWith("shorts")) return "Shorts";
  if (id.startsWith("sweatshirt")) return "Sweatshirts";
  if (id.startsWith("tanktop")) return "Tank Tops";
  if (id.startsWith("tote")) return "Tote Bags";
  if (id.startsWith("cap")) return "Caps";
  return "Hoodies";
}

function displayName(id: string): string {
  return id
    .split(/[-_]/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Reads `public/customization/templates` and builds template records.
 * - `hoodie-1-front.png` + `hoodie-1-back.png` → one template, two sides.
 * - `hoodie-1.png` → one template; missing sides use the same image (until client adds side files).
 */
export function scanCustomizationTemplates(): GarmentTemplate[] {
  const dir = path.join(process.cwd(), "public", "customization", "templates");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => EXT.test(f));
  type Accum = {
    explicit: Partial<Record<GarmentSide, string>>;
    singles: string[];
  };
  const byBase = new Map<string, Accum>();

  for (const file of files) {
    const baseName = file.replace(EXT, "");
    const m = baseName.match(WITH_SIDE);
    const publicPath = `/customization/templates/${file}`;

    if (m) {
      const baseId = m[1];
      const side = m[2].toLowerCase() as GarmentSide;
      const acc = byBase.get(baseId) ?? { explicit: {}, singles: [] };
      acc.explicit[side] = publicPath;
      byBase.set(baseId, acc);
    } else {
      const acc = byBase.get(baseName) ?? { explicit: {}, singles: [] };
      acc.singles.push(publicPath);
      byBase.set(baseName, acc);
    }
  }

  const templates: GarmentTemplate[] = [];

  for (const [baseId, acc] of byBase) {
    const category = inferCategory(baseId);
    const allowed = CATEGORY_SIDES[category];
    const fallback =
      acc.singles[0] ??
      (Object.values(acc.explicit)[0] as string | undefined) ??
      "";

    if (!fallback) continue;

    const sideImages: Partial<Record<GarmentSide, string>> = {};
    for (const s of allowed) {
      sideImages[s] = acc.explicit[s] ?? fallback;
    }

    const thumbnailPath =
      acc.explicit.front ?? acc.explicit.back ?? acc.singles[0] ?? fallback;

    templates.push({
      id: baseId,
      name: displayName(baseId),
      category,
      sides: [...allowed],
      sideImages,
      thumbnailPath,
    });
  }

  templates.sort((a, b) => {
    const c = a.category.localeCompare(b.category);
    if (c !== 0) return c;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });

  return templates;
}
