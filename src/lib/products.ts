// ─── Types ────────────────────────────────────────────────────────────────────

export type MainCategory = "Sports Wear" | "Casual Wear" | "Fitness Wear";

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
  "Sports Wear": "sports-wear",
  "Casual Wear": "casual-wear",
  "Fitness Wear": "fitness-wear",
};

export const SLUG_TO_CATEGORY: Record<string, MainCategory> = {
  "sports-wear": "Sports Wear",
  "casual-wear": "Casual Wear",
  "fitness-wear": "Fitness Wear",
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
    "Goalkeeper Uniforms",
    "Soccer Jerseys",
    "Baseball Jerseys",
    "Volleyball Jerseys",
    "Cycling Wear",
    "Sports Bra",
    "Sports Caps",
    "Sports Bags",
  ],
  "Fitness Wear": [
    "Gym Gloves",
    "Gym Straps",
    "Gym Belts",
    "Women Singlet",
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
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function p(
  code: string,
  subCategory: string,
  mainCategory: MainCategory,
  description: string,
  sizes: string,
  colors: string,
  tags: string[],
): Product {
  const name = `${subCategory} ${code}`;
  const slug = `${subCategorySlug(subCategory)}-${code.toLowerCase().replace("mci-", "")}`;
  return {
    id: code,
    code,
    name,
    slug,
    mainCategory,
    subCategory,
    description,
    sizes,
    colors,
    image: "/images/products/placeholder.jpg",
    moq: 50,
    price: null,
    currency: "USD",
    isActive: true,
    tags,
  };
}

// ─── SPORTS WEAR ─────────────────────────────────────────────────────────────

const SW = "Sports Wear" as const;

export const ALL_PRODUCTS: Product[] = [

  // Basketball Uniforms — MCI-01 to MCI-04
  p("MCI-01","Basketball Uniforms",SW,"100% Polyester, 160–200gsm, breathable, quick dry","S, M, L, XL, 2XL","All colors available",["basketball","uniform"]),
  p("MCI-02","Basketball Uniforms",SW,"100% Polyester, 160–200gsm, breathable, quick dry","S, M, L, XL, 2XL","All colors available",["basketball","uniform"]),
  p("MCI-03","Basketball Uniforms",SW,"100% Polyester, 160–200gsm, breathable, quick dry","S, M, L, XL, 2XL","All colors available",["basketball","uniform"]),
  p("MCI-04","Basketball Uniforms",SW,"100% Polyester, 160–200gsm, breathable, quick dry","S, M, L, XL, 2XL","All colors available",["basketball","uniform"]),

  // Shooter Shirts — MCI-05 to MCI-08
  p("MCI-05","Shooter Shirts",SW,"Pro-style carbon heather, wicking mesh, 100% polyester","S–2XL","All colors available",["basketball","shooter"]),
  p("MCI-06","Shooter Shirts",SW,"Pro-style carbon heather, wicking mesh, 100% polyester","S–2XL","All colors available",["basketball","shooter"]),
  p("MCI-07","Shooter Shirts",SW,"Pro-style carbon heather, wicking mesh, 100% polyester","S–2XL","All colors available",["basketball","shooter"]),
  p("MCI-08","Shooter Shirts",SW,"Pro-style carbon heather, wicking mesh, 100% polyester","S–2XL","All colors available",["basketball","shooter"]),

  // Soccer Track Suits — MCI-09 to MCI-012
  p("MCI-09","Soccer Track Suits",SW,"Polyester mesh lining, full zip, pockets","S–2XL","All colors available",["soccer","tracksuit"]),
  p("MCI-010","Soccer Track Suits",SW,"Polyester mesh lining, full zip, pockets","S–2XL","All colors available",["soccer","tracksuit"]),
  p("MCI-011","Soccer Track Suits",SW,"Polyester mesh lining, full zip, pockets","S–2XL","All colors available",["soccer","tracksuit"]),
  p("MCI-012","Soccer Track Suits",SW,"Polyester mesh lining, full zip, pockets","S–2XL","All colors available",["soccer","tracksuit"]),

  // Baseball Uniforms — MCI-013 to MCI-016
  p("MCI-013","Baseball Uniforms",SW,"Pro-weight polyester, double stitching","S–2XL","All colors available",["baseball","uniform"]),
  p("MCI-014","Baseball Uniforms",SW,"Pro-weight polyester, double stitching","S–2XL","All colors available",["baseball","uniform"]),
  p("MCI-015","Baseball Uniforms",SW,"Pro-weight polyester, double stitching","S–2XL","All colors available",["baseball","uniform"]),
  p("MCI-016","Baseball Uniforms",SW,"Pro-weight polyester, double stitching","S–2XL","All colors available",["baseball","uniform"]),

  // Volleyball Uniforms — MCI-017 to MCI-021
  p("MCI-017","Volleyball Uniforms",SW,"Pro-weight polyester, double stitching","S–2XL","All colors available",["volleyball","uniform"]),
  p("MCI-018","Volleyball Uniforms",SW,"Pro-weight polyester, double stitching","S–2XL","All colors available",["volleyball","uniform"]),
  p("MCI-019","Volleyball Uniforms",SW,"Pro-weight polyester, double stitching","S–2XL","All colors available",["volleyball","uniform"]),
  p("MCI-020","Volleyball Uniforms",SW,"Pro-weight polyester, double stitching","S–2XL","All colors available",["volleyball","uniform"]),
  p("MCI-021","Volleyball Uniforms",SW,"Pro-weight polyester, double stitching","S–2XL","All colors available",["volleyball","uniform"]),

  // Soccer Uniforms — MCI-022 to MCI-026
  p("MCI-022","Soccer Uniforms",SW,"100% polyester fabrics","S–2XL","All colors available",["soccer","uniform"]),
  p("MCI-023","Soccer Uniforms",SW,"100% polyester fabrics","S–2XL","All colors available",["soccer","uniform"]),
  p("MCI-024","Soccer Uniforms",SW,"100% polyester fabrics","S–2XL","All colors available",["soccer","uniform"]),
  p("MCI-025","Soccer Uniforms",SW,"100% polyester fabrics","S–2XL","All colors available",["soccer","uniform"]),
  p("MCI-026","Soccer Uniforms",SW,"100% polyester fabrics","S–2XL","All colors available",["soccer","uniform"]),

  // American Football Uniforms — MCI-027 to MCI-030
  p("MCI-027","American Football Uniforms",SW,"Tackle twill, screen print, sublimation","S–2XL","All colors available",["american football","uniform"]),
  p("MCI-028","American Football Uniforms",SW,"Tackle twill, screen print, sublimation","S–2XL","All colors available",["american football","uniform"]),
  p("MCI-029","American Football Uniforms",SW,"Tackle twill, screen print, sublimation","S–2XL","All colors available",["american football","uniform"]),
  p("MCI-030","American Football Uniforms",SW,"Tackle twill, screen print, sublimation","S–2XL","All colors available",["american football","uniform"]),

  // Cricket Uniforms — MCI-031 to MCI-034
  p("MCI-031","Cricket Uniforms",SW,"Moisture-wicking polyester jersey","Chest-based","Not specified",["cricket","uniform"]),
  p("MCI-032","Cricket Uniforms",SW,"Moisture-wicking polyester jersey","Chest-based","Not specified",["cricket","uniform"]),
  p("MCI-033","Cricket Uniforms",SW,"Moisture-wicking polyester jersey","Chest-based","Not specified",["cricket","uniform"]),
  p("MCI-034","Cricket Uniforms",SW,"Moisture-wicking polyester jersey","Chest-based","Not specified",["cricket","uniform"]),

  // Ice Hockey Uniforms — MCI-035 to MCI-038
  p("MCI-035","Ice Hockey Uniforms",SW,"3D hoodie pattern design","Not specified","Not specified",["ice hockey","uniform"]),
  p("MCI-036","Ice Hockey Uniforms",SW,"3D hoodie pattern design","Not specified","Not specified",["ice hockey","uniform"]),
  p("MCI-037","Ice Hockey Uniforms",SW,"3D hoodie pattern design","Not specified","Not specified",["ice hockey","uniform"]),
  p("MCI-038","Ice Hockey Uniforms",SW,"3D hoodie pattern design","Not specified","Not specified",["ice hockey","uniform"]),

  // Tennis Uniforms — MCI-039 to MCI-042
  p("MCI-039","Tennis Uniforms",SW,"Polyester, zipper closure, classic fit","Not specified","Not specified",["tennis","uniform"]),
  p("MCI-040","Tennis Uniforms",SW,"Polyester, zipper closure, classic fit","Not specified","Not specified",["tennis","uniform"]),
  p("MCI-041","Tennis Uniforms",SW,"Polyester, zipper closure, classic fit","Not specified","Not specified",["tennis","uniform"]),
  p("MCI-042","Tennis Uniforms",SW,"Polyester, zipper closure, classic fit","Not specified","Not specified",["tennis","uniform"]),

  // Goalkeeper Uniforms — MCI-043 to MCI-046
  p("MCI-043","Goalkeeper Uniforms",SW,"Lightweight moisture management fabric","S–2XL","All colors available",["goalkeeper","soccer"]),
  p("MCI-044","Goalkeeper Uniforms",SW,"Lightweight moisture management fabric","S–2XL","All colors available",["goalkeeper","soccer"]),
  p("MCI-045","Goalkeeper Uniforms",SW,"Lightweight moisture management fabric","S–2XL","All colors available",["goalkeeper","soccer"]),
  p("MCI-046","Goalkeeper Uniforms",SW,"Lightweight moisture management fabric","S–2XL","All colors available",["goalkeeper","soccer"]),

  // Soccer Jerseys — MCI-047 to MCI-050
  p("MCI-047","Soccer Jerseys",SW,"Micro interlock fabric, moisture-wicking, breathable mesh","S–2XL","All colors available",["soccer","jersey"]),
  p("MCI-048","Soccer Jerseys",SW,"Micro interlock fabric, moisture-wicking, breathable mesh","S–2XL","All colors available",["soccer","jersey"]),
  p("MCI-049","Soccer Jerseys",SW,"Micro interlock fabric, moisture-wicking, breathable mesh","S–2XL","All colors available",["soccer","jersey"]),
  p("MCI-050","Soccer Jerseys",SW,"Micro interlock fabric, moisture-wicking, breathable mesh","S–2XL","All colors available",["soccer","jersey"]),

  // Baseball Jerseys — MCI-051 to MCI-054
  p("MCI-051","Baseball Jerseys",SW,"Polyester stretch mesh, moisture management, button closure","S–2XL","All colors available",["baseball","jersey"]),
  p("MCI-052","Baseball Jerseys",SW,"Polyester stretch mesh, moisture management, button closure","S–2XL","All colors available",["baseball","jersey"]),
  p("MCI-053","Baseball Jerseys",SW,"Polyester stretch mesh, moisture management, button closure","S–2XL","All colors available",["baseball","jersey"]),
  p("MCI-054","Baseball Jerseys",SW,"Polyester stretch mesh, moisture management, button closure","S–2XL","All colors available",["baseball","jersey"]),

  // Volleyball Jerseys — MCI-055 to MCI-059
  p("MCI-055","Volleyball Jerseys",SW,"V-neck / cross crew neck styles","S–2XL","All colors available",["volleyball","jersey"]),
  p("MCI-056","Volleyball Jerseys",SW,"V-neck / cross crew neck styles","S–2XL","All colors available",["volleyball","jersey"]),
  p("MCI-057","Volleyball Jerseys",SW,"V-neck / cross crew neck styles","S–2XL","All colors available",["volleyball","jersey"]),
  p("MCI-058","Volleyball Jerseys",SW,"V-neck / cross crew neck styles","S–2XL","All colors available",["volleyball","jersey"]),
  p("MCI-059","Volleyball Jerseys",SW,"V-neck / cross crew neck styles","S–2XL","All colors available",["volleyball","jersey"]),

  // Cycling Wear — MCI-060 to MCI-066
  p("MCI-060","Cycling Wear",SW,"Polyester jersey, size per spec","Not specified","Not specified",["cycling"]),
  p("MCI-061","Cycling Wear",SW,"Polyester jersey, size per spec","Not specified","Not specified",["cycling"]),
  p("MCI-062","Cycling Wear",SW,"Polyester jersey, size per spec","Not specified","Not specified",["cycling"]),
  p("MCI-063","Cycling Wear",SW,"80% Nylon, 20% Lycra","Not specified","Not specified",["cycling"]),
  p("MCI-064","Cycling Wear",SW,"80% Nylon, 20% Lycra","Not specified","Not specified",["cycling"]),
  p("MCI-065","Cycling Wear",SW,"80% Nylon, 20% Lycra","Not specified","Not specified",["cycling"]),
  p("MCI-066","Cycling Wear",SW,"80% Nylon, 20% Lycra","Not specified","Not specified",["cycling"]),

  // Sports Bra — MCI-067 to MCI-070
  p("MCI-067","Sports Bra",SW,"Full support, hook & eye closure, adjustable straps","Not specified","Not specified",["sports bra","women"]),
  p("MCI-068","Sports Bra",SW,"Full support, hook & eye closure, adjustable straps","Not specified","Not specified",["sports bra","women"]),
  p("MCI-069","Sports Bra",SW,"Full support, hook & eye closure, adjustable straps","Not specified","Not specified",["sports bra","women"]),
  p("MCI-070","Sports Bra",SW,"Full support, hook & eye closure, adjustable straps","Not specified","Not specified",["sports bra","women"]),

  // Sports Caps — MCI-071 to MCI-074
  p("MCI-071","Sports Caps",SW,"Cotton & acrylic, adjustable strap","Not specified","Not specified",["cap","accessories"]),
  p("MCI-072","Sports Caps",SW,"Cotton & acrylic, adjustable strap","Not specified","Not specified",["cap","accessories"]),
  p("MCI-073","Sports Caps",SW,"Cotton & acrylic, adjustable strap","Not specified","Not specified",["cap","accessories"]),
  p("MCI-074","Sports Caps",SW,"Cotton & acrylic, adjustable strap","Not specified","Not specified",["cap","accessories"]),

  // Sports Bags — MCI-075 to MCI-078
  p("MCI-075","Sports Bags",SW,"Water-repellent finish, multiple pockets","Not specified","Not specified",["bag","accessories"]),
  p("MCI-076","Sports Bags",SW,"Water-repellent finish, multiple pockets","Not specified","Not specified",["bag","accessories"]),
  p("MCI-077","Sports Bags",SW,"Water-repellent finish, multiple pockets","Not specified","Not specified",["bag","accessories"]),
  p("MCI-078","Sports Bags",SW,"Water-repellent finish, multiple pockets","Not specified","Not specified",["bag","accessories"]),

  // ─── CASUAL WEAR ─────────────────────────────────────────────────────────────

  // Track Suits — MCI-079 to MCI-083
  p("MCI-079","Track Suits","Casual Wear","100% polyester micro ripstop","S–3XL","All colors available",["tracksuit","casual"]),
  p("MCI-080","Track Suits","Casual Wear","100% polyester micro ripstop","S–3XL","All colors available",["tracksuit","casual"]),
  p("MCI-081","Track Suits","Casual Wear","100% polyester micro ripstop","S–3XL","All colors available",["tracksuit","casual"]),
  p("MCI-082","Track Suits","Casual Wear","100% polyester micro ripstop","S–3XL","All colors available",["tracksuit","casual"]),
  p("MCI-083","Track Suits","Casual Wear","100% polyester micro ripstop","S–3XL","All colors available",["tracksuit","casual"]),

  // Trousers — MCI-084 to MCI-087
  p("MCI-084","Trousers","Casual Wear","Cotton/elastane blend, 2-way stretch","S–2XL","All colors available",["trousers","casual"]),
  p("MCI-085","Trousers","Casual Wear","Cotton/elastane blend, 2-way stretch","S–2XL","All colors available",["trousers","casual"]),
  p("MCI-086","Trousers","Casual Wear","Cotton/elastane blend, 2-way stretch","S–2XL","All colors available",["trousers","casual"]),
  p("MCI-087","Trousers","Casual Wear","Cotton/elastane blend, 2-way stretch","S–2XL","All colors available",["trousers","casual"]),

  // Polo Shirts — MCI-088 to MCI-091
  p("MCI-088","Polo Shirts","Casual Wear","Cotton/poly blend, comfortable wear","S–2XL","All colors available",["polo","shirt"]),
  p("MCI-089","Polo Shirts","Casual Wear","Cotton/poly blend, comfortable wear","S–2XL","All colors available",["polo","shirt"]),
  p("MCI-090","Polo Shirts","Casual Wear","Cotton/poly blend, comfortable wear","S–2XL","All colors available",["polo","shirt"]),
  p("MCI-091","Polo Shirts","Casual Wear","Cotton/poly blend, comfortable wear","S–2XL","All colors available",["polo","shirt"]),

  // Sweat Shirts — MCI-092 to MCI-095
  p("MCI-092","Sweat Shirts","Casual Wear","Double layered shoulder panels, durable fabric","S–2XL","All colors available",["sweatshirt","casual"]),
  p("MCI-093","Sweat Shirts","Casual Wear","Double layered shoulder panels, durable fabric","S–2XL","All colors available",["sweatshirt","casual"]),
  p("MCI-094","Sweat Shirts","Casual Wear","Double layered shoulder panels, durable fabric","S–2XL","All colors available",["sweatshirt","casual"]),
  p("MCI-095","Sweat Shirts","Casual Wear","Double layered shoulder panels, durable fabric","S–2XL","All colors available",["sweatshirt","casual"]),

  // T-Shirts — MCI-096 to MCI-099
  p("MCI-096","T-Shirts","Casual Wear","Cotton/polyester, double stitched","S–2XL","All colors available",["tshirt","casual"]),
  p("MCI-097","T-Shirts","Casual Wear","Cotton/polyester, double stitched","S–2XL","All colors available",["tshirt","casual"]),
  p("MCI-098","T-Shirts","Casual Wear","Cotton/polyester, double stitched","S–2XL","All colors available",["tshirt","casual"]),
  p("MCI-099","T-Shirts","Casual Wear","Cotton/polyester, double stitched","S–2XL","All colors available",["tshirt","casual"]),

  // Compression Shorts — MCI-100 to MCI-102
  p("MCI-100","Compression Shorts","Casual Wear","Nylon/elastane, muscle support","S–2XL","All colors available",["compression","shorts"]),
  p("MCI-101","Compression Shorts","Casual Wear","Nylon/elastane, muscle support","S–2XL","All colors available",["compression","shorts"]),
  p("MCI-102","Compression Shorts","Casual Wear","Nylon/elastane, muscle support","S–2XL","All colors available",["compression","shorts"]),

  // Compression Shirts — MCI-103 to MCI-105
  p("MCI-103","Compression Shirts","Casual Wear","Polyester + spandex, moisture sensing","S–2XL","All colors available",["compression","shirt"]),
  p("MCI-104","Compression Shirts","Casual Wear","Polyester + spandex, moisture sensing","S–2XL","All colors available",["compression","shirt"]),
  p("MCI-105","Compression Shirts","Casual Wear","Polyester + spandex, moisture sensing","S–2XL","All colors available",["compression","shirt"]),

  // Tees — MCI-106 to MCI-109
  p("MCI-106","Tees","Casual Wear","Polyester/elastane, machine washable","S–XL","All colors available",["tee","casual"]),
  p("MCI-107","Tees","Casual Wear","Polyester/elastane, machine washable","S–XL","All colors available",["tee","casual"]),
  p("MCI-108","Tees","Casual Wear","Polyester/elastane, machine washable","S–XL","All colors available",["tee","casual"]),
  p("MCI-109","Tees","Casual Wear","Polyester/elastane, machine washable","S–XL","All colors available",["tee","casual"]),

  // Hoodies — MCI-110 to MCI-114
  p("MCI-110","Hoodies","Casual Wear","Cotton/poly fleece interior","S–2XL","All colors available",["hoodie","casual"]),
  p("MCI-111","Hoodies","Casual Wear","Cotton/poly fleece interior","S–2XL","All colors available",["hoodie","casual"]),
  p("MCI-112","Hoodies","Casual Wear","Cotton/poly fleece interior","S–2XL","All colors available",["hoodie","casual"]),
  p("MCI-113","Hoodies","Casual Wear","Cotton/poly fleece interior","S–2XL","All colors available",["hoodie","casual"]),
  p("MCI-114","Hoodies","Casual Wear","Cotton/poly fleece interior","S–2XL","All colors available",["hoodie","casual"]),

  // ─── FITNESS WEAR ─────────────────────────────────────────────────────────────

  // Gym Gloves — MCI-115 to MCI-118
  p("MCI-115","Gym Gloves","Fitness Wear","Lycra spandex, breathable, keeps hands dry","Not specified","Not specified",["gym","gloves"]),
  p("MCI-116","Gym Gloves","Fitness Wear","Lycra spandex, breathable, keeps hands dry","Not specified","Not specified",["gym","gloves"]),
  p("MCI-117","Gym Gloves","Fitness Wear","Lycra spandex, breathable, keeps hands dry","Not specified","Not specified",["gym","gloves"]),
  p("MCI-118","Gym Gloves","Fitness Wear","Lycra spandex, breathable, keeps hands dry","Not specified","Not specified",["gym","gloves"]),

  // Gym Straps — MCI-119 to MCI-122
  p("MCI-119","Gym Straps","Fitness Wear","Cotton + rubber, weight lifting straps","All sizes","All colors available",["gym","straps"]),
  p("MCI-120","Gym Straps","Fitness Wear","Cotton + rubber, weight lifting straps","All sizes","All colors available",["gym","straps"]),
  p("MCI-121","Gym Straps","Fitness Wear","Cotton + rubber, weight lifting straps","All sizes","All colors available",["gym","straps"]),
  p("MCI-122","Gym Straps","Fitness Wear","Cotton + rubber, weight lifting straps","All sizes","All colors available",["gym","straps"]),

  // Gym Belts — MCI-123 to MCI-126
  p("MCI-123","Gym Belts","Fitness Wear","100% neoprene, hook & loop closure","Not specified","Not specified",["gym","belt"]),
  p("MCI-124","Gym Belts","Fitness Wear","100% neoprene, hook & loop closure","Not specified","Not specified",["gym","belt"]),
  p("MCI-125","Gym Belts","Fitness Wear","100% neoprene, hook & loop closure","Not specified","Not specified",["gym","belt"]),
  p("MCI-126","Gym Belts","Fitness Wear","100% neoprene, hook & loop closure","Not specified","Not specified",["gym","belt"]),

  // Women Singlet — MCI-127 to MCI-133
  p("MCI-127","Women Singlet","Fitness Wear","Lightweight breathable fabric","Not specified","All colors available",["women","singlet"]),
  p("MCI-128","Women Singlet","Fitness Wear","Lightweight breathable fabric","Not specified","All colors available",["women","singlet"]),
  p("MCI-129","Women Singlet","Fitness Wear","Lightweight breathable fabric","Not specified","All colors available",["women","singlet"]),
  p("MCI-130","Women Singlet","Fitness Wear","Lightweight breathable fabric","Not specified","All colors available",["women","singlet"]),
  p("MCI-131","Women Singlet","Fitness Wear","Lightweight breathable fabric","Not specified","All colors available",["women","singlet"]),
  p("MCI-132","Women Singlet","Fitness Wear","Lightweight breathable fabric","Not specified","All colors available",["women","singlet"]),
  p("MCI-133","Women Singlet","Fitness Wear","Lightweight breathable fabric","Not specified","All colors available",["women","singlet"]),

  // Women Shorts — MCI-134 to MCI-138
  p("MCI-134","Women Shorts","Fitness Wear","Polyester/spandex blend","Not specified","All colors available",["women","shorts"]),
  p("MCI-135","Women Shorts","Fitness Wear","Polyester/spandex blend","Not specified","All colors available",["women","shorts"]),
  p("MCI-136","Women Shorts","Fitness Wear","Polyester/spandex blend","Not specified","All colors available",["women","shorts"]),
  p("MCI-137","Women Shorts","Fitness Wear","Polyester/spandex blend","Not specified","All colors available",["women","shorts"]),
  p("MCI-138","Women Shorts","Fitness Wear","Polyester/spandex blend","Not specified","All colors available",["women","shorts"]),

  // Gym Pants — MCI-139 to MCI-142
  p("MCI-139","Gym Pants","Fitness Wear","Cotton/poly, customizable","S–XXL","Custom colors",["gym","pants"]),
  p("MCI-140","Gym Pants","Fitness Wear","Polyester/spandex, camouflage options","S–XXL","Black/White camo",["gym","pants"]),
  p("MCI-141","Gym Pants","Fitness Wear","Cotton/poly blend, unisex custom","S–XXL","Custom colors",["gym","pants"]),
  p("MCI-142","Gym Pants","Fitness Wear","Polyester/spandex, gym pants","S–XXL","Custom colors",["gym","pants"]),

  // Men's Gym Shorts — MCI-143 to MCI-146
  p("MCI-143","Men's Gym Shorts","Fitness Wear","Polyester breathable mesh","Not specified","Custom colors",["men","shorts","gym"]),
  p("MCI-144","Men's Gym Shorts","Fitness Wear","Polyester breathable mesh","Not specified","Custom colors",["men","shorts","gym"]),
  p("MCI-145","Men's Gym Shorts","Fitness Wear","Polyester breathable mesh","Not specified","Custom colors",["men","shorts","gym"]),
  p("MCI-146","Men's Gym Shorts","Fitness Wear","Polyester breathable mesh","Not specified","Custom colors",["men","shorts","gym"]),

  // Leggings — MCI-147 to MCI-151
  p("MCI-147","Leggings","Fitness Wear","Polyester/elastane stretch","S–XL","All colors available",["leggings","women"]),
  p("MCI-148","Leggings","Fitness Wear","Polyester/elastane stretch","S–XL","All colors available",["leggings","women"]),
  p("MCI-149","Leggings","Fitness Wear","Polyester/elastane stretch","S–XL","All colors available",["leggings","women"]),
  p("MCI-150","Leggings","Fitness Wear","Polyester/elastane stretch","S–XL","All colors available",["leggings","women"]),
  p("MCI-151","Leggings","Fitness Wear","Polyester/elastane stretch","S–XL","All colors available",["leggings","women"]),
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(main: MainCategory): Product[] {
  return ALL_PRODUCTS.filter((p) => p.mainCategory === main && p.isActive);
}

export function getProductsBySubCategory(sub: string): Product[] {
  return ALL_PRODUCTS.filter((p) => p.subCategory === sub && p.isActive);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return ALL_PRODUCTS.filter(
    (p) =>
      p.isActive &&
      (p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))),
  );
}

export function productUrl(product: Product): string {
  const catSlug = CATEGORY_SLUGS[product.mainCategory];
  const subSlug = subCategorySlug(product.subCategory);
  return `/products/${catSlug}/${subSlug}/${product.slug}`;
}
