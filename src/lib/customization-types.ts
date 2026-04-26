// ─── Garment Side Types ───────────────────────────────────────────────────────

export type GarmentSide = "front" | "back" | "left" | "right";

export type GarmentCategory =
  | "All"
  | "Hoodies"
  | "T-Shirts"
  | "Jackets"
  | "Trousers"
  | "Shorts"
  | "Sweatshirts"
  | "Tank Tops"
  | "Tote Bags"
  | "Caps";

export type GarmentCategoryKey = Exclude<GarmentCategory, "All">;

/** Which sides each category supports in the UI */
export const CATEGORY_SIDES: Record<GarmentCategoryKey, GarmentSide[]> = {
  Hoodies: ["front", "back"],
  "T-Shirts": ["front", "back"],
  Jackets: ["front", "back"],
  Trousers: ["front", "back"],
  Shorts: ["front", "back"],
  Sweatshirts: ["front", "back"],
  "Tank Tops": ["front", "back"],
  "Tote Bags": ["front"],
  Caps: ["front", "back", "left", "right"],
};

export const SIDE_LABELS: Record<GarmentSide, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
};

// ─── Per-Side Design Config (independent per side) ────────────────────────────

export type StripeThickness = "thin" | "medium" | "broad";

export type StripePosition =
  | "side"
  | "sleeve"
  | "shoulder"
  | "chest"
  | "vertical-center";

export interface SideStripeConfig {
  enabled: boolean;
  position: StripePosition;
  thickness: StripeThickness;
  color: string;
}

export interface SideDesignConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  stripes: SideStripeConfig;
  customText: string;
  customNumber: string;
  logoUrl?: string;
  notes: string;
}

/** Full garment record (from disk scan + API) */
export interface GarmentTemplate {
  id: string;
  name: string;
  category: GarmentCategoryKey;
  sides: GarmentSide[];
  /** Image path per garment side (only keys for valid sides are required) */
  sideImages: Partial<Record<GarmentSide, string>>;
  thumbnailPath: string;
}

export type MultiSideDesign = Partial<Record<GarmentSide, SideDesignConfig>>;

export const DEFAULT_STRIPE: SideStripeConfig = {
  enabled: false,
  position: "side",
  thickness: "medium",
  color: "#FFFFFF",
};

export const DEFAULT_SIDE_CONFIG: SideDesignConfig = {
  primaryColor: "#EF4444",
  secondaryColor: "#FFFFFF",
  accentColor: "#1a1a1a",
  stripes: { ...DEFAULT_STRIPE },
  customText: "",
  customNumber: "",
  logoUrl: undefined,
  notes: "",
};

export function makeDefaultMultiSide(sides: GarmentSide[]): MultiSideDesign {
  return Object.fromEntries(
    sides.map((s) => [s, { ...DEFAULT_SIDE_CONFIG, stripes: { ...DEFAULT_STRIPE } }])
  ) as MultiSideDesign;
}

// ─── Persisted v2 payload (MongoDB designConfig.version === 2) ─────────────────

export interface SavedCustomizationV2 {
  version: 2;
  templateId: string;
  category: string;
  sideImages: Partial<Record<GarmentSide, string>>;
  sides: Partial<Record<GarmentSide, SideDesignConfig>>;
}
