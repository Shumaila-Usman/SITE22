// ─── Types ────────────────────────────────────────────────────────────────────

export type MainCategory = "Sports Wear" | "Casual Wear" | "Fitness Wear" | "Fashion Wear";

export interface Product {
  id: string;
  code: string;
  name: string;
  slug: string;
  mainCategory: MainCategory;
  subCategory: string;
  description: string;
  sizes: string;
  colors: string;
  image: string;
  moq: number;
  price: number | null;
  currency: string;
  isActive: boolean;
  tags: string[];
}

// ─── DB Product (shape returned by MongoDB API) ───────────────────────────────

export interface DbCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface DbSubcategory {
  _id: string;
  name: string;
  slug: string;
}

export interface DbProduct {
  _id: string;
  code: string;
  name: string;
  slug: string;
  categoryId: DbCategory;
  subcategoryId?: DbSubcategory;
  shortDescription?: string;
  fullDescription?: string;
  materials?: string;
  sizes?: string;
  colors?: string;
  moq: number;
  price: number | null;
  currency: string;
  image: string;
  gallery: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
}

/** Convert a DbProduct (or lean Mongoose doc) to the legacy Product shape used by client components */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbProductToProduct(p: any): Product {
  return {
    id:           p._id?.toString() ?? "",
    code:         p.code,
    name:         p.name,
    slug:         p.slug,
    mainCategory: (p.categoryId?.name ?? "") as MainCategory,
    subCategory:  p.subcategoryId?.name ?? p.categoryId?.name ?? "",
    description:  p.shortDescription ?? "",
    sizes:        p.sizes ?? "",
    colors:       p.colors ?? "",
    image:        p.image ?? "",
    moq:          p.moq,
    price:        p.price,
    currency:     p.currency,
    isActive:     p.isActive,
    tags:         p.tags ?? [],
  };
}

// ─── Routing helpers ──────────────────────────────────────────────────────────

export const CATEGORY_SLUGS: Record<MainCategory, string> = {
  "Sports Wear":  "sports-wear",
  "Casual Wear":  "casual-wear",
  "Fitness Wear": "fitness-wear",
  "Fashion Wear": "fashion-wear",
};

export const SLUG_TO_CATEGORY: Record<string, MainCategory> = {
  "sports-wear":  "Sports Wear",
  "casual-wear":  "Casual Wear",
  "fitness-wear": "Fitness Wear",
  "fashion-wear": "Fashion Wear",
};

export function subCategorySlug(sub: string): string {
  return sub.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function subCategoryFromSlug(slug: string, main: MainCategory): string | undefined {
  return SUB_CATEGORIES[main].find((s) => subCategorySlug(s) === slug);
}

// ─── Category structure ───────────────────────────────────────────────────────

export const MAIN_CATEGORIES: MainCategory[] = [
  "Sports Wear",
  "Fitness Wear",
  "Casual Wear",
  "Fashion Wear",
];

export const SUB_CATEGORIES: Record<MainCategory, string[]> = {
  "Sports Wear": [
    "Basketball Uniforms",
    "Shooter Shirts",
    "Soccer Track Suits",
    "Baseball Uniforms",
    "Volleyball Uniforms",
    "Soccer Uniforms",
    "American Football Uniforms",
    "Cricket Uniforms",
    "Ice Hockey Uniforms",
    "Tennis Uniforms",
    "Goal Keeper Uniforms",
    "Soccer Jerseys",
    "Baseball Jerseys",
    "Volleyball Jerseys",
    "Cycling Wear",
    "Sports Bra",
    "Sports Caps",
    "Swim Wear",
    "Sports Bags",
  ],
  "Fitness Wear": [
    "Gym Gloves",
    "Gym Straps",
    "Gym Belts",
    "Women Singlet",
    "Women Athletic Tank Top",
    "Women Shorts",
    "Gym Pants",
    "Men's Gym Shorts",
    "Leggings",
  ],
  "Casual Wear": [
    "Track Suits",
    "Trousers",
    "Polo Shirts",
    "Sweat Shirts",
    "T-Shirts",
    "Compression Shorts",
    "Compression Shirts",
    "Tees",
    "Hoodies",
  ],
  "Fashion Wear": [
    "Oversized Fits",
    "Denim Jackets",
    "Streetwear Tees",
    "Sweater",
    "Cargo Vest",
    "Cargo Pants",
    "Baggy Distressed Jeans",
    "Streetwear Acid Wash",
    "Rayon Stone Shirt",
    "Chemical Wash Hoodies",
    "Sunfade Shirt",
  ],
};

export const CATEGORY_META: Record<MainCategory, { desc: string; image: string; color: string }> = {
  "Sports Wear": {
    desc: "Team uniforms, jerseys, tracksuits, and performance sportswear for all major sports. Custom logos, numbers, and names available.",
    image: "/images/products/sports-wear.jpg",
    color: "from-red-600/30",
  },
  "Fitness Wear": {
    desc: "High-performance gym wear for men and women. Leggings, shorts, gloves, straps, belts, and more.",
    image: "/images/products/fitness-wear.jpg",
    color: "from-orange-700/25",
  },
  "Casual Wear": {
    desc: "Hoodies, tracksuits, polo shirts, T-shirts, sweatshirts, and everyday athletic lifestyle wear.",
    image: "/images/products/casual-wear.jpg",
    color: "from-rose-700/25",
  },
  "Fashion Wear": {
    desc: "Oversized fits, denim jackets, streetwear tees, cargo pants, acid wash, and premium fashion-forward apparel.",
    image: "/images/products/casual-wear.jpg",
    color: "from-purple-700/25",
  },
};

// ─── Routing helper ───────────────────────────────────────────────────────────

export function productUrl(product: Product): string {
  const catSlug = CATEGORY_SLUGS[product.mainCategory] ?? "products";
  const subSlug = subCategorySlug(product.subCategory);
  return `/products/${catSlug}/${subSlug}/${product.slug}`;
}
