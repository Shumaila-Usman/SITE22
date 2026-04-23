import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Inline schemas (avoid ts-node path-alias issues with src/models imports)
// ---------------------------------------------------------------------------

// User
const UserSchema = new Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["admin", "user"], default: "user" },
    company:  { type: String, trim: true },
    country:  { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

// Category
const CategorySchema = new Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image:       { type: String },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Category = mongoose.models.Category ?? mongoose.model("Category", CategorySchema);

// Subcategory
const SubcategorySchema = new Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, lowercase: true, trim: true },
    categoryId:  { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, trim: true },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);
SubcategorySchema.index({ slug: 1, categoryId: 1 }, { unique: true });
const Subcategory =
  mongoose.models.Subcategory ?? mongoose.model("Subcategory", SubcategorySchema);

// Product
const ProductSchema = new Schema(
  {
    code:             { type: String, required: true, unique: true, trim: true },
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    categoryId:       { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategoryId:    { type: Schema.Types.ObjectId, ref: "Subcategory" },
    shortDescription: { type: String, trim: true },
    fullDescription:  { type: String, trim: true },
    materials:        { type: String, trim: true },
    sizes:            { type: String, trim: true },
    colors:           { type: String, trim: true },
    moq:              { type: Number, default: 50 },
    price:            { type: Number, default: null },
    currency:         { type: String, default: "USD" },
    image:            { type: String, default: "" },
    gallery:          [{ type: String }],
    tags:             [{ type: String }],
    isActive:         { type: Boolean, default: true },
    isFeatured:       { type: Boolean, default: false },
  },
  { timestamps: true }
);
ProductSchema.index({ name: "text", shortDescription: "text", tags: "text" });
const Product = mongoose.models.Product ?? mongoose.model("Product", ProductSchema);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function productSlug(subcategorySlug: string, code: string): string {
  // e.g. "basketball-uniforms-01"
  return `${subcategorySlug}-${code.toLowerCase().replace("mci-", "")}`;
}

// ---------------------------------------------------------------------------
// Data definitions
// ---------------------------------------------------------------------------

interface SubcategoryDef {
  slug: string;
  categorySlug: string;
  order: number;
}

const subcategoryDefs: SubcategoryDef[] = [
  // Sports Wear
  { slug: "basketball-uniforms",        categorySlug: "sports-wear", order: 0  },
  { slug: "shooter-shirts",             categorySlug: "sports-wear", order: 1  },
  { slug: "soccer-track-suits",         categorySlug: "sports-wear", order: 2  },
  { slug: "baseball-uniforms",          categorySlug: "sports-wear", order: 3  },
  { slug: "volleyball-uniforms",        categorySlug: "sports-wear", order: 4  },
  { slug: "soccer-uniforms",            categorySlug: "sports-wear", order: 5  },
  { slug: "american-football-uniforms", categorySlug: "sports-wear", order: 6  },
  { slug: "cricket-uniforms",           categorySlug: "sports-wear", order: 7  },
  { slug: "ice-hockey-uniforms",        categorySlug: "sports-wear", order: 8  },
  { slug: "tennis-uniforms",            categorySlug: "sports-wear", order: 9  },
  { slug: "goalkeeper-uniforms",        categorySlug: "sports-wear", order: 10 },
  { slug: "soccer-jerseys",             categorySlug: "sports-wear", order: 11 },
  { slug: "baseball-jerseys",           categorySlug: "sports-wear", order: 12 },
  { slug: "volleyball-jerseys",         categorySlug: "sports-wear", order: 13 },
  { slug: "cycling-wear",               categorySlug: "sports-wear", order: 14 },
  { slug: "sports-bra",                 categorySlug: "sports-wear", order: 15 },
  { slug: "sports-caps",                categorySlug: "sports-wear", order: 16 },
  { slug: "sports-bags",                categorySlug: "sports-wear", order: 17 },
  // Fitness Wear
  { slug: "gym-gloves",   categorySlug: "fitness-wear", order: 0 },
  { slug: "gym-straps",   categorySlug: "fitness-wear", order: 1 },
  { slug: "gym-belts",    categorySlug: "fitness-wear", order: 2 },
  { slug: "women-singlet",categorySlug: "fitness-wear", order: 3 },
  { slug: "women-shorts", categorySlug: "fitness-wear", order: 4 },
  { slug: "gym-pants",    categorySlug: "fitness-wear", order: 5 },
  { slug: "mens-gym-shorts", categorySlug: "fitness-wear", order: 6 },
  { slug: "leggings",     categorySlug: "fitness-wear", order: 7 },
  // Casual Wear
  { slug: "track-suits",         categorySlug: "casual-wear", order: 0 },
  { slug: "trousers",            categorySlug: "casual-wear", order: 1 },
  { slug: "polo-shirts",         categorySlug: "casual-wear", order: 2 },
  { slug: "sweat-shirts",        categorySlug: "casual-wear", order: 3 },
  { slug: "t-shirts",            categorySlug: "casual-wear", order: 4 },
  { slug: "compression-shorts",  categorySlug: "casual-wear", order: 5 },
  { slug: "compression-shirts",  categorySlug: "casual-wear", order: 6 },
  { slug: "tees",                categorySlug: "casual-wear", order: 7 },
  { slug: "hoodies",             categorySlug: "casual-wear", order: 8 },
];

interface ProductDef {
  codes: string[];
  subcategorySlug: string;
  desc: string;
  sizes: string;
  colors: string;
  tags: string[];
}

const productDefs: ProductDef[] = [
  {
    codes: ["MCI-01","MCI-02","MCI-03","MCI-04"],
    subcategorySlug: "basketball-uniforms",
    desc: "100% Polyester, 160-200gsm, breathable, quick dry",
    sizes: "S, M, L, XL, 2XL",
    colors: "All colors available",
    tags: ["basketball","uniform"],
  },
  {
    codes: ["MCI-05","MCI-06","MCI-07","MCI-08"],
    subcategorySlug: "shooter-shirts",
    desc: "Pro-style carbon heather, wicking mesh, 100% polyester",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["basketball","shooter"],
  },
  {
    codes: ["MCI-09","MCI-010","MCI-011","MCI-012"],
    subcategorySlug: "soccer-track-suits",
    desc: "Polyester mesh lining, full zip, pockets",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["soccer","tracksuit"],
  },
  {
    codes: ["MCI-013","MCI-014","MCI-015","MCI-016"],
    subcategorySlug: "baseball-uniforms",
    desc: "Pro-weight polyester, double stitching",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["baseball","uniform"],
  },
  {
    codes: ["MCI-017","MCI-018","MCI-019","MCI-020","MCI-021"],
    subcategorySlug: "volleyball-uniforms",
    desc: "Pro-weight polyester, double stitching",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["volleyball","uniform"],
  },
  {
    codes: ["MCI-022","MCI-023","MCI-024","MCI-025","MCI-026"],
    subcategorySlug: "soccer-uniforms",
    desc: "100% polyester fabrics",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["soccer","uniform"],
  },
  {
    codes: ["MCI-027","MCI-028","MCI-029","MCI-030"],
    subcategorySlug: "american-football-uniforms",
    desc: "Tackle twill, screen print, sublimation",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["american football","uniform"],
  },
  {
    codes: ["MCI-031","MCI-032","MCI-033","MCI-034"],
    subcategorySlug: "cricket-uniforms",
    desc: "Moisture-wicking polyester jersey",
    sizes: "Chest-based",
    colors: "Not specified",
    tags: ["cricket","uniform"],
  },
  {
    codes: ["MCI-035","MCI-036","MCI-037","MCI-038"],
    subcategorySlug: "ice-hockey-uniforms",
    desc: "3D hoodie pattern design",
    sizes: "Not specified",
    colors: "Not specified",
    tags: ["ice hockey","uniform"],
  },
  {
    codes: ["MCI-039","MCI-040","MCI-041","MCI-042"],
    subcategorySlug: "tennis-uniforms",
    desc: "Polyester, zipper closure, classic fit",
    sizes: "Not specified",
    colors: "Not specified",
    tags: ["tennis","uniform"],
  },
  {
    codes: ["MCI-043","MCI-044","MCI-045","MCI-046"],
    subcategorySlug: "goalkeeper-uniforms",
    desc: "Lightweight moisture management fabric",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["goalkeeper","soccer"],
  },
  {
    codes: ["MCI-047","MCI-048","MCI-049","MCI-050"],
    subcategorySlug: "soccer-jerseys",
    desc: "Micro interlock fabric, moisture-wicking, breathable mesh",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["soccer","jersey"],
  },
  {
    codes: ["MCI-051","MCI-052","MCI-053","MCI-054"],
    subcategorySlug: "baseball-jerseys",
    desc: "Polyester stretch mesh, moisture management, button closure",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["baseball","jersey"],
  },
  {
    codes: ["MCI-055","MCI-056","MCI-057","MCI-058","MCI-059"],
    subcategorySlug: "volleyball-jerseys",
    desc: "V-neck / cross crew neck styles",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["volleyball","jersey"],
  },
  {
    codes: ["MCI-060","MCI-061","MCI-062","MCI-063","MCI-064","MCI-065","MCI-066"],
    subcategorySlug: "cycling-wear",
    desc: "Polyester jersey, size per spec",
    sizes: "Not specified",
    colors: "Not specified",
    tags: ["cycling"],
  },
  {
    codes: ["MCI-067","MCI-068","MCI-069","MCI-070"],
    subcategorySlug: "sports-bra",
    desc: "Full support, hook and eye closure, adjustable straps",
    sizes: "Not specified",
    colors: "Not specified",
    tags: ["sports bra","women"],
  },
  {
    codes: ["MCI-071","MCI-072","MCI-073","MCI-074"],
    subcategorySlug: "sports-caps",
    desc: "Cotton and acrylic, adjustable strap",
    sizes: "Not specified",
    colors: "Not specified",
    tags: ["cap","accessories"],
  },
  {
    codes: ["MCI-075","MCI-076","MCI-077","MCI-078"],
    subcategorySlug: "sports-bags",
    desc: "Water-repellent finish, multiple pockets",
    sizes: "Not specified",
    colors: "Not specified",
    tags: ["bag","accessories"],
  },
  {
    codes: ["MCI-079","MCI-080","MCI-081","MCI-082","MCI-083"],
    subcategorySlug: "track-suits",
    desc: "100% polyester micro ripstop",
    sizes: "S-3XL",
    colors: "All colors available",
    tags: ["tracksuit","casual"],
  },
  {
    codes: ["MCI-084","MCI-085","MCI-086","MCI-087"],
    subcategorySlug: "trousers",
    desc: "Cotton/elastane blend, 2-way stretch",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["trousers","casual"],
  },
  {
    codes: ["MCI-088","MCI-089","MCI-090","MCI-091"],
    subcategorySlug: "polo-shirts",
    desc: "Cotton/poly blend, comfortable wear",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["polo","shirt"],
  },
  {
    codes: ["MCI-092","MCI-093","MCI-094","MCI-095"],
    subcategorySlug: "sweat-shirts",
    desc: "Double layered shoulder panels, durable fabric",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["sweatshirt","casual"],
  },
  {
    codes: ["MCI-096","MCI-097","MCI-098","MCI-099"],
    subcategorySlug: "t-shirts",
    desc: "Cotton/polyester, double stitched",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["tshirt","casual"],
  },
  {
    codes: ["MCI-100","MCI-101","MCI-102"],
    subcategorySlug: "compression-shorts",
    desc: "Nylon/elastane, muscle support",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["compression","shorts"],
  },
  {
    codes: ["MCI-103","MCI-104","MCI-105"],
    subcategorySlug: "compression-shirts",
    desc: "Polyester + spandex, moisture sensing",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["compression","shirt"],
  },
  {
    codes: ["MCI-106","MCI-107","MCI-108","MCI-109"],
    subcategorySlug: "tees",
    desc: "Polyester/elastane, machine washable",
    sizes: "S-XL",
    colors: "All colors available",
    tags: ["tee","casual"],
  },
  {
    codes: ["MCI-110","MCI-111","MCI-112","MCI-113","MCI-114"],
    subcategorySlug: "hoodies",
    desc: "Cotton/poly fleece interior",
    sizes: "S-2XL",
    colors: "All colors available",
    tags: ["hoodie","casual"],
  },
  {
    codes: ["MCI-115","MCI-116","MCI-117","MCI-118"],
    subcategorySlug: "gym-gloves",
    desc: "Lycra spandex, breathable, keeps hands dry",
    sizes: "Not specified",
    colors: "Not specified",
    tags: ["gym","gloves"],
  },
  {
    codes: ["MCI-119","MCI-120","MCI-121","MCI-122"],
    subcategorySlug: "gym-straps",
    desc: "Cotton + rubber, weight lifting straps",
    sizes: "All sizes",
    colors: "All colors available",
    tags: ["gym","straps"],
  },
  {
    codes: ["MCI-123","MCI-124","MCI-125","MCI-126"],
    subcategorySlug: "gym-belts",
    desc: "100% neoprene, hook and loop closure",
    sizes: "Not specified",
    colors: "Not specified",
    tags: ["gym","belt"],
  },
  {
    codes: ["MCI-127","MCI-128","MCI-129","MCI-130","MCI-131","MCI-132","MCI-133"],
    subcategorySlug: "women-singlet",
    desc: "Lightweight breathable fabric",
    sizes: "Not specified",
    colors: "All colors available",
    tags: ["women","singlet"],
  },
  {
    codes: ["MCI-134","MCI-135","MCI-136","MCI-137","MCI-138"],
    subcategorySlug: "women-shorts",
    desc: "Polyester/spandex blend",
    sizes: "Not specified",
    colors: "All colors available",
    tags: ["women","shorts"],
  },
  {
    codes: ["MCI-139","MCI-140","MCI-141","MCI-142"],
    subcategorySlug: "gym-pants",
    desc: "Cotton/poly, customizable",
    sizes: "S-XXL",
    colors: "Custom colors",
    tags: ["gym","pants"],
  },
  {
    codes: ["MCI-143","MCI-144","MCI-145","MCI-146"],
    subcategorySlug: "mens-gym-shorts",
    desc: "Polyester breathable mesh",
    sizes: "Not specified",
    colors: "Custom colors",
    tags: ["men","shorts","gym"],
  },
  {
    codes: ["MCI-147","MCI-148","MCI-149","MCI-150","MCI-151"],
    subcategorySlug: "leggings",
    desc: "Polyester/elastane stretch",
    sizes: "S-XL",
    colors: "All colors available",
    tags: ["leggings","women"],
  },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  // ── 1. Admin user ──────────────────────────────────────────────────────────
  console.log("Seeding admin user...");
  const existing = await User.findOne({ email: "admin@megacore.com" });
  if (!existing) {
    const hashed = await bcrypt.hash("Admin@123456", 12);
    await User.create({
      name: "Admin",
      email: "admin@megacore.com",
      password: hashed,
      role: "admin",
      isActive: true,
    });
    console.log("  Created admin user.");
  } else {
    console.log("  Admin user already exists, skipping.");
  }

  // ── 2. Categories ──────────────────────────────────────────────────────────
  console.log("\nSeeding categories...");
  const categoryDefs = [
    { name: "Sports Wear",   slug: "sports-wear",  order: 0 },
    { name: "Fitness Wear",  slug: "fitness-wear", order: 1 },
    { name: "Casual Wear",   slug: "casual-wear",  order: 2 },
  ];

  const categoryMap: Record<string, mongoose.Types.ObjectId> = {};

  for (const cat of categoryDefs) {
    const doc = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: { name: cat.name, slug: cat.slug, order: cat.order, isActive: true } },
      { upsert: true, new: true }
    );
    categoryMap[cat.slug] = doc._id as mongoose.Types.ObjectId;
    console.log(`  Upserted category: ${cat.name}`);
  }

  // ── 3. Subcategories ───────────────────────────────────────────────────────
  console.log("\nSeeding subcategories...");
  const subcategoryMap: Record<string, mongoose.Types.ObjectId> = {};

  for (const sub of subcategoryDefs) {
    const categoryId = categoryMap[sub.categorySlug];
    if (!categoryId) {
      throw new Error(`Category not found for slug: ${sub.categorySlug}`);
    }
    const name = toTitleCase(sub.slug);
    const doc = await Subcategory.findOneAndUpdate(
      { slug: sub.slug, categoryId },
      { $set: { name, slug: sub.slug, categoryId, order: sub.order, isActive: true } },
      { upsert: true, new: true }
    );
    subcategoryMap[sub.slug] = doc._id as mongoose.Types.ObjectId;
    console.log(`  Upserted subcategory: ${name}`);
  }

  // ── 4. Products ────────────────────────────────────────────────────────────
  console.log("\nSeeding products...");
  let productCount = 0;

  for (const def of productDefs) {
    const subcategoryId = subcategoryMap[def.subcategorySlug];
    if (!subcategoryId) {
      throw new Error(`Subcategory not found for slug: ${def.subcategorySlug}`);
    }

    // Resolve categoryId from the subcategory definition
    const subDef = subcategoryDefs.find((s) => s.slug === def.subcategorySlug);
    if (!subDef) {
      throw new Error(`SubcategoryDef not found for slug: ${def.subcategorySlug}`);
    }
    const categoryId = categoryMap[subDef.categorySlug];

    for (const code of def.codes) {
      const subcategoryName = toTitleCase(def.subcategorySlug);
      const name = `${subcategoryName} ${code}`;
      const slug = productSlug(def.subcategorySlug, code);

      await Product.findOneAndUpdate(
        { code },
        {
          $set: {
            code,
            name,
            slug,
            categoryId,
            subcategoryId,
            shortDescription: def.desc,
            sizes: def.sizes,
            colors: def.colors,
            moq: 50,
            price: null,
            currency: "USD",
            image: "",
            gallery: [],
            tags: def.tags,
            isActive: true,
            isFeatured: false,
          },
        },
        { upsert: true, new: true }
      );
      productCount++;
      console.log(`  Upserted product: ${name}`);
    }
  }

  console.log(`\nDone. Seeded ${productCount} products.`);
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
