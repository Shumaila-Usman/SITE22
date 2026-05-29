import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Inline schemas (avoid ts-node path-alias issues with src/models imports)
// ---------------------------------------------------------------------------

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

/**
 * Build a product slug from subcategory slug + MCI code.
 * e.g. subcategorySlug="basketball-uniforms", code="MCI-01" → "basketball-uniforms-01"
 */
function productSlug(subcategorySlug: string, code: string): string {
  const num = code.toLowerCase().replace(/^mci-0*/, "");
  return `${subcategorySlug}-${num}`;
}

/**
 * Build the local image path for a product.
 * Catalog images are stored as /images/products/catalog/MCI-XX.png
 * where XX is the numeric part WITHOUT leading zeros (e.g. MCI-1, MCI-10, MCI-100).
 * But the actual files on disk use the code as-is: MCI-01.png, MCI-10.png, etc.
 * We use the code directly: /images/products/catalog/{code}.png
 */
function catalogImage(code: string): string {
  return `/images/products/catalog/${code}.png`;
}

// ---------------------------------------------------------------------------
// Data definitions
// ---------------------------------------------------------------------------

interface SubcategoryDef {
  name: string;   // exact display name
  slug: string;
  categorySlug: string;
  order: number;
}

const subcategoryDefs: SubcategoryDef[] = [
  // ── Sports Wear ──────────────────────────────────────────────────────────
  { name: "Basketball Uniforms",        slug: "basketball-uniforms",        categorySlug: "sports-wear",  order: 0  },
  { name: "Shooter Shirts",             slug: "shooter-shirts",             categorySlug: "sports-wear",  order: 1  },
  { name: "Soccer Track Suits",         slug: "soccer-track-suits",         categorySlug: "sports-wear",  order: 2  },
  { name: "Baseball Uniforms",          slug: "baseball-uniforms",          categorySlug: "sports-wear",  order: 3  },
  { name: "Volleyball Uniforms",        slug: "volleyball-uniforms",        categorySlug: "sports-wear",  order: 4  },
  { name: "Soccer Uniforms",            slug: "soccer-uniforms",            categorySlug: "sports-wear",  order: 5  },
  { name: "American Football Uniforms", slug: "american-football-uniforms", categorySlug: "sports-wear",  order: 6  },
  { name: "Cricket Uniforms",           slug: "cricket-uniforms",           categorySlug: "sports-wear",  order: 7  },
  { name: "Ice Hockey Uniforms",        slug: "ice-hockey-uniforms",        categorySlug: "sports-wear",  order: 8  },
  { name: "Tennis Uniforms",            slug: "tennis-uniforms",            categorySlug: "sports-wear",  order: 9  },
  { name: "Goal Keeper Uniforms",       slug: "goal-keeper-uniforms",       categorySlug: "sports-wear",  order: 10 },
  { name: "Soccer Jerseys",             slug: "soccer-jerseys",             categorySlug: "sports-wear",  order: 11 },
  { name: "Baseball Jerseys",           slug: "baseball-jerseys",           categorySlug: "sports-wear",  order: 12 },
  { name: "Volleyball Jerseys",         slug: "volleyball-jerseys",         categorySlug: "sports-wear",  order: 13 },
  { name: "Cycling Wear",               slug: "cycling-wear",               categorySlug: "sports-wear",  order: 14 },
  { name: "Sports Bra",                 slug: "sports-bra",                 categorySlug: "sports-wear",  order: 15 },
  { name: "Sports Caps",                slug: "sports-caps",                categorySlug: "sports-wear",  order: 16 },
  { name: "Swim Wear",                  slug: "swim-wear",                  categorySlug: "sports-wear",  order: 17 },
  { name: "Sports Bags",                slug: "sports-bags",                categorySlug: "sports-wear",  order: 18 },
  // ── Casual Wear ──────────────────────────────────────────────────────────
  { name: "Track Suits",        slug: "track-suits",        categorySlug: "casual-wear", order: 0 },
  { name: "Trousers",           slug: "trousers",           categorySlug: "casual-wear", order: 1 },
  { name: "Polo Shirts",        slug: "polo-shirts",        categorySlug: "casual-wear", order: 2 },
  { name: "Sweat Shirts",       slug: "sweat-shirts",       categorySlug: "casual-wear", order: 3 },
  { name: "T-Shirts",           slug: "t-shirts",           categorySlug: "casual-wear", order: 4 },
  { name: "Compression Shorts", slug: "compression-shorts", categorySlug: "casual-wear", order: 5 },
  { name: "Compression Shirts", slug: "compression-shirts", categorySlug: "casual-wear", order: 6 },
  { name: "Tees",               slug: "tees",               categorySlug: "casual-wear", order: 7 },
  { name: "Hoodies",            slug: "hoodies",            categorySlug: "casual-wear", order: 8 },
  // ── Fitness Wear ─────────────────────────────────────────────────────────
  { name: "Gym Gloves",              slug: "gym-gloves",              categorySlug: "fitness-wear", order: 0 },
  { name: "Gym Straps",              slug: "gym-straps",              categorySlug: "fitness-wear", order: 1 },
  { name: "Gym Belts",               slug: "gym-belts",               categorySlug: "fitness-wear", order: 2 },
  { name: "Women Singlet",           slug: "women-singlet",           categorySlug: "fitness-wear", order: 3 },
  { name: "Women Athletic Tank Top", slug: "women-athletic-tank-top", categorySlug: "fitness-wear", order: 4 },
  { name: "Women Shorts",            slug: "women-shorts",            categorySlug: "fitness-wear", order: 5 },
  { name: "Gym Pants",               slug: "gym-pants",               categorySlug: "fitness-wear", order: 6 },
  { name: "Men's Gym Shorts",        slug: "mens-gym-shorts",         categorySlug: "fitness-wear", order: 7 },
  { name: "Leggings",                slug: "leggings",                categorySlug: "fitness-wear", order: 8 },
  // ── Fashion Wear ─────────────────────────────────────────────────────────
  { name: "Oversized Fits",         slug: "oversized-fits",         categorySlug: "fashion-wear", order: 0  },
  { name: "Denim Jackets",          slug: "denim-jackets",          categorySlug: "fashion-wear", order: 1  },
  { name: "Streetwear Tees",        slug: "streetwear-tees",        categorySlug: "fashion-wear", order: 2  },
  { name: "Sweater",                slug: "sweater",                categorySlug: "fashion-wear", order: 3  },
  { name: "Cargo Vest",             slug: "cargo-vest",             categorySlug: "fashion-wear", order: 4  },
  { name: "Cargo Pants",            slug: "cargo-pants",            categorySlug: "fashion-wear", order: 5  },
  { name: "Baggy Distressed Jeans", slug: "baggy-distressed-jeans", categorySlug: "fashion-wear", order: 6  },
  { name: "Streetwear Acid Wash",   slug: "streetwear-acid-wash",   categorySlug: "fashion-wear", order: 7  },
  { name: "Rayon Stone Shirt",      slug: "rayon-stone-shirt",      categorySlug: "fashion-wear", order: 8  },
  { name: "Chemical Wash Hoodies",  slug: "chemical-wash-hoodies",  categorySlug: "fashion-wear", order: 9  },
  { name: "Sunfade Shirt",          slug: "sunfade-shirt",          categorySlug: "fashion-wear", order: 10 },
];

interface ProductDef {
  code: string;
  subcategorySlug: string;
  name: string;
  shortDescription: string;
  materials: string;
  sizes: string;
  colors: string;
  tags: string[];
  isFeatured?: boolean;
}

// ---------------------------------------------------------------------------
// SPORTS WEAR — MCI-01 to MCI-78
// ---------------------------------------------------------------------------
const productDefs: ProductDef[] = [
  // Basketball Uniforms MCI-01 to MCI-04
  { code:"MCI-01", subcategorySlug:"basketball-uniforms", name:"Basketball Uniform MCI-01", shortDescription:"100% Polyester, 160–200gsm, breathable, quick-dry performance fabric", materials:"100% Polyester, 160–200gsm", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["basketball","uniform"], isFeatured:true },
  { code:"MCI-02", subcategorySlug:"basketball-uniforms", name:"Basketball Uniform MCI-02", shortDescription:"100% Polyester, 160–200gsm, breathable, quick-dry performance fabric", materials:"100% Polyester, 160–200gsm", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["basketball","uniform"] },
  { code:"MCI-03", subcategorySlug:"basketball-uniforms", name:"Basketball Uniform MCI-03", shortDescription:"100% Polyester, 160–200gsm, breathable, quick-dry performance fabric", materials:"100% Polyester, 160–200gsm", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["basketball","uniform"] },
  { code:"MCI-04", subcategorySlug:"basketball-uniforms", name:"Basketball Uniform MCI-04", shortDescription:"100% Polyester, 160–200gsm, breathable, quick-dry performance fabric", materials:"100% Polyester, 160–200gsm", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["basketball","uniform"] },
  // Shooter Shirts MCI-05 to MCI-08
  { code:"MCI-05", subcategorySlug:"shooter-shirts", name:"Shooter Shirt MCI-05", shortDescription:"Pro-style carbon heather, wicking mesh, 100% polyester", materials:"100% Polyester wicking mesh", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["basketball","shooter"] },
  { code:"MCI-06", subcategorySlug:"shooter-shirts", name:"Shooter Shirt MCI-06", shortDescription:"Pro-style carbon heather, wicking mesh, 100% polyester", materials:"100% Polyester wicking mesh", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["basketball","shooter"] },
  { code:"MCI-07", subcategorySlug:"shooter-shirts", name:"Shooter Shirt MCI-07", shortDescription:"Pro-style carbon heather, wicking mesh, 100% polyester", materials:"100% Polyester wicking mesh", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["basketball","shooter"] },
  { code:"MCI-08", subcategorySlug:"shooter-shirts", name:"Shooter Shirt MCI-08", shortDescription:"Pro-style carbon heather, wicking mesh, 100% polyester", materials:"100% Polyester wicking mesh", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["basketball","shooter"] },
  // Soccer Track Suits MCI-09 to MCI-12
  { code:"MCI-09", subcategorySlug:"soccer-track-suits", name:"Soccer Track Suit MCI-09", shortDescription:"Polyester mesh lining, full zip, side pockets, moisture-wicking", materials:"100% Polyester with mesh lining", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","tracksuit"] },
  { code:"MCI-10", subcategorySlug:"soccer-track-suits", name:"Soccer Track Suit MCI-10", shortDescription:"Polyester mesh lining, full zip, side pockets, moisture-wicking", materials:"100% Polyester with mesh lining", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","tracksuit"] },
  { code:"MCI-11", subcategorySlug:"soccer-track-suits", name:"Soccer Track Suit MCI-11", shortDescription:"Polyester mesh lining, full zip, side pockets, moisture-wicking", materials:"100% Polyester with mesh lining", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","tracksuit"] },
  { code:"MCI-12", subcategorySlug:"soccer-track-suits", name:"Soccer Track Suit MCI-12", shortDescription:"Polyester mesh lining, full zip, side pockets, moisture-wicking", materials:"100% Polyester with mesh lining", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","tracksuit"] },
  // Baseball Uniforms MCI-13 to MCI-16
  { code:"MCI-13", subcategorySlug:"baseball-uniforms", name:"Baseball Uniform MCI-13", shortDescription:"Pro-weight polyester, double stitching, durable construction", materials:"Pro-weight Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["baseball","uniform"] },
  { code:"MCI-14", subcategorySlug:"baseball-uniforms", name:"Baseball Uniform MCI-14", shortDescription:"Pro-weight polyester, double stitching, durable construction", materials:"Pro-weight Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["baseball","uniform"] },
  { code:"MCI-15", subcategorySlug:"baseball-uniforms", name:"Baseball Uniform MCI-15", shortDescription:"Pro-weight polyester, double stitching, durable construction", materials:"Pro-weight Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["baseball","uniform"] },
  { code:"MCI-16", subcategorySlug:"baseball-uniforms", name:"Baseball Uniform MCI-16", shortDescription:"Pro-weight polyester, double stitching, durable construction", materials:"Pro-weight Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["baseball","uniform"] },
  // Volleyball Uniforms MCI-17 to MCI-21
  { code:"MCI-17", subcategorySlug:"volleyball-uniforms", name:"Volleyball Uniform MCI-17", shortDescription:"Pro-weight polyester, double stitching, breathable performance fabric", materials:"Pro-weight Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","uniform"] },
  { code:"MCI-18", subcategorySlug:"volleyball-uniforms", name:"Volleyball Uniform MCI-18", shortDescription:"Pro-weight polyester, double stitching, breathable performance fabric", materials:"Pro-weight Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","uniform"] },
  { code:"MCI-19", subcategorySlug:"volleyball-uniforms", name:"Volleyball Uniform MCI-19", shortDescription:"Pro-weight polyester, double stitching, breathable performance fabric", materials:"Pro-weight Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","uniform"] },
  { code:"MCI-20", subcategorySlug:"volleyball-uniforms", name:"Volleyball Uniform MCI-20", shortDescription:"Pro-weight polyester, double stitching, breathable performance fabric", materials:"Pro-weight Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","uniform"] },
  { code:"MCI-21", subcategorySlug:"volleyball-uniforms", name:"Volleyball Uniform MCI-21", shortDescription:"Pro-weight polyester, double stitching, breathable performance fabric", materials:"Pro-weight Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","uniform"] },
  // Soccer Uniforms MCI-22 to MCI-26
  { code:"MCI-22", subcategorySlug:"soccer-uniforms", name:"Soccer Uniform MCI-22", shortDescription:"100% polyester, moisture-wicking, custom sublimation printing available", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","uniform"], isFeatured:true },
  { code:"MCI-23", subcategorySlug:"soccer-uniforms", name:"Soccer Uniform MCI-23", shortDescription:"100% polyester, moisture-wicking, custom sublimation printing available", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","uniform"] },
  { code:"MCI-24", subcategorySlug:"soccer-uniforms", name:"Soccer Uniform MCI-24", shortDescription:"100% polyester, moisture-wicking, custom sublimation printing available", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","uniform"] },
  { code:"MCI-25", subcategorySlug:"soccer-uniforms", name:"Soccer Uniform MCI-25", shortDescription:"100% polyester, moisture-wicking, custom sublimation printing available", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","uniform"] },
  { code:"MCI-26", subcategorySlug:"soccer-uniforms", name:"Soccer Uniform MCI-26", shortDescription:"100% polyester, moisture-wicking, custom sublimation printing available", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","uniform"] },
  // American Football Uniforms MCI-27 to MCI-30
  { code:"MCI-27", subcategorySlug:"american-football-uniforms", name:"American Football Uniform MCI-27", shortDescription:"Tackle twill, screen print, sublimation, reinforced stitching", materials:"Tackle Twill Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["american football","uniform"] },
  { code:"MCI-28", subcategorySlug:"american-football-uniforms", name:"American Football Uniform MCI-28", shortDescription:"Tackle twill, screen print, sublimation, reinforced stitching", materials:"Tackle Twill Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["american football","uniform"] },
  { code:"MCI-29", subcategorySlug:"american-football-uniforms", name:"American Football Uniform MCI-29", shortDescription:"Tackle twill, screen print, sublimation, reinforced stitching", materials:"Tackle Twill Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["american football","uniform"] },
  { code:"MCI-30", subcategorySlug:"american-football-uniforms", name:"American Football Uniform MCI-30", shortDescription:"Tackle twill, screen print, sublimation, reinforced stitching", materials:"Tackle Twill Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["american football","uniform"] },
  // Cricket Uniforms MCI-31 to MCI-34
  { code:"MCI-31", subcategorySlug:"cricket-uniforms", name:"Cricket Uniform MCI-31", shortDescription:"Moisture-wicking polyester jersey, chest-based sizing, custom team branding", materials:"Moisture-wicking Polyester", sizes:"Chest 34–48 inches", colors:"White, custom colors available", tags:["cricket","uniform"] },
  { code:"MCI-32", subcategorySlug:"cricket-uniforms", name:"Cricket Uniform MCI-32", shortDescription:"Moisture-wicking polyester jersey, chest-based sizing, custom team branding", materials:"Moisture-wicking Polyester", sizes:"Chest 34–48 inches", colors:"White, custom colors available", tags:["cricket","uniform"] },
  { code:"MCI-33", subcategorySlug:"cricket-uniforms", name:"Cricket Uniform MCI-33", shortDescription:"Moisture-wicking polyester jersey, chest-based sizing, custom team branding", materials:"Moisture-wicking Polyester", sizes:"Chest 34–48 inches", colors:"White, custom colors available", tags:["cricket","uniform"] },
  { code:"MCI-34", subcategorySlug:"cricket-uniforms", name:"Cricket Uniform MCI-34", shortDescription:"Moisture-wicking polyester jersey, chest-based sizing, custom team branding", materials:"Moisture-wicking Polyester", sizes:"Chest 34–48 inches", colors:"White, custom colors available", tags:["cricket","uniform"] },
  // Ice Hockey Uniforms MCI-35 to MCI-38
  { code:"MCI-35", subcategorySlug:"ice-hockey-uniforms", name:"Ice Hockey Uniform MCI-35", shortDescription:"3D sublimation design, reinforced stitching, moisture-wicking polyester", materials:"100% Polyester sublimation", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["ice hockey","uniform"] },
  { code:"MCI-36", subcategorySlug:"ice-hockey-uniforms", name:"Ice Hockey Uniform MCI-36", shortDescription:"3D sublimation design, reinforced stitching, moisture-wicking polyester", materials:"100% Polyester sublimation", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["ice hockey","uniform"] },
  { code:"MCI-37", subcategorySlug:"ice-hockey-uniforms", name:"Ice Hockey Uniform MCI-37", shortDescription:"3D sublimation design, reinforced stitching, moisture-wicking polyester", materials:"100% Polyester sublimation", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["ice hockey","uniform"] },
  { code:"MCI-38", subcategorySlug:"ice-hockey-uniforms", name:"Ice Hockey Uniform MCI-38", shortDescription:"3D sublimation design, reinforced stitching, moisture-wicking polyester", materials:"100% Polyester sublimation", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["ice hockey","uniform"] },
  // Tennis Uniforms MCI-39 to MCI-42
  { code:"MCI-39", subcategorySlug:"tennis-uniforms", name:"Tennis Uniform MCI-39", shortDescription:"Polyester, zipper closure, classic fit, breathable mesh panels", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["tennis","uniform"] },
  { code:"MCI-40", subcategorySlug:"tennis-uniforms", name:"Tennis Uniform MCI-40", shortDescription:"Polyester, zipper closure, classic fit, breathable mesh panels", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["tennis","uniform"] },
  { code:"MCI-41", subcategorySlug:"tennis-uniforms", name:"Tennis Uniform MCI-41", shortDescription:"Polyester, zipper closure, classic fit, breathable mesh panels", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["tennis","uniform"] },
  { code:"MCI-42", subcategorySlug:"tennis-uniforms", name:"Tennis Uniform MCI-42", shortDescription:"Polyester, zipper closure, classic fit, breathable mesh panels", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["tennis","uniform"] },
  // Goal Keeper Uniforms MCI-43 to MCI-46
  { code:"MCI-43", subcategorySlug:"goal-keeper-uniforms", name:"Goal Keeper Uniform MCI-43", shortDescription:"Lightweight moisture management fabric, padded elbows, custom sublimation", materials:"Moisture management Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["goalkeeper","soccer"] },
  { code:"MCI-44", subcategorySlug:"goal-keeper-uniforms", name:"Goal Keeper Uniform MCI-44", shortDescription:"Lightweight moisture management fabric, padded elbows, custom sublimation", materials:"Moisture management Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["goalkeeper","soccer"] },
  { code:"MCI-45", subcategorySlug:"goal-keeper-uniforms", name:"Goal Keeper Uniform MCI-45", shortDescription:"Lightweight moisture management fabric, padded elbows, custom sublimation", materials:"Moisture management Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["goalkeeper","soccer"] },
  { code:"MCI-46", subcategorySlug:"goal-keeper-uniforms", name:"Goal Keeper Uniform MCI-46", shortDescription:"Lightweight moisture management fabric, padded elbows, custom sublimation", materials:"Moisture management Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["goalkeeper","soccer"] },
  // Soccer Jerseys MCI-47 to MCI-50
  { code:"MCI-47", subcategorySlug:"soccer-jerseys", name:"Soccer Jersey MCI-47", shortDescription:"Micro interlock fabric, moisture-wicking, breathable mesh side panels", materials:"Micro interlock Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","jersey"], isFeatured:true },
  { code:"MCI-48", subcategorySlug:"soccer-jerseys", name:"Soccer Jersey MCI-48", shortDescription:"Micro interlock fabric, moisture-wicking, breathable mesh side panels", materials:"Micro interlock Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","jersey"] },
  { code:"MCI-49", subcategorySlug:"soccer-jerseys", name:"Soccer Jersey MCI-49", shortDescription:"Micro interlock fabric, moisture-wicking, breathable mesh side panels", materials:"Micro interlock Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","jersey"] },
  { code:"MCI-50", subcategorySlug:"soccer-jerseys", name:"Soccer Jersey MCI-50", shortDescription:"Micro interlock fabric, moisture-wicking, breathable mesh side panels", materials:"Micro interlock Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["soccer","jersey"] },
  // Baseball Jerseys MCI-51 to MCI-54
  { code:"MCI-51", subcategorySlug:"baseball-jerseys", name:"Baseball Jersey MCI-51", shortDescription:"Polyester stretch mesh, moisture management, button-front closure", materials:"Polyester stretch mesh", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["baseball","jersey"] },
  { code:"MCI-52", subcategorySlug:"baseball-jerseys", name:"Baseball Jersey MCI-52", shortDescription:"Polyester stretch mesh, moisture management, button-front closure", materials:"Polyester stretch mesh", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["baseball","jersey"] },
  { code:"MCI-53", subcategorySlug:"baseball-jerseys", name:"Baseball Jersey MCI-53", shortDescription:"Polyester stretch mesh, moisture management, button-front closure", materials:"Polyester stretch mesh", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["baseball","jersey"] },
  { code:"MCI-54", subcategorySlug:"baseball-jerseys", name:"Baseball Jersey MCI-54", shortDescription:"Polyester stretch mesh, moisture management, button-front closure", materials:"Polyester stretch mesh", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["baseball","jersey"] },
  // Volleyball Jerseys MCI-55 to MCI-59
  { code:"MCI-55", subcategorySlug:"volleyball-jerseys", name:"Volleyball Jersey MCI-55", shortDescription:"V-neck / cross crew neck styles, moisture-wicking polyester", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","jersey"] },
  { code:"MCI-56", subcategorySlug:"volleyball-jerseys", name:"Volleyball Jersey MCI-56", shortDescription:"V-neck / cross crew neck styles, moisture-wicking polyester", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","jersey"] },
  { code:"MCI-57", subcategorySlug:"volleyball-jerseys", name:"Volleyball Jersey MCI-57", shortDescription:"V-neck / cross crew neck styles, moisture-wicking polyester", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","jersey"] },
  { code:"MCI-58", subcategorySlug:"volleyball-jerseys", name:"Volleyball Jersey MCI-58", shortDescription:"V-neck / cross crew neck styles, moisture-wicking polyester", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","jersey"] },
  { code:"MCI-59", subcategorySlug:"volleyball-jerseys", name:"Volleyball Jersey MCI-59", shortDescription:"V-neck / cross crew neck styles, moisture-wicking polyester", materials:"100% Polyester", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["volleyball","jersey"] },
  // Cycling Wear MCI-60 to MCI-66
  { code:"MCI-60", subcategorySlug:"cycling-wear", name:"Cycling Wear MCI-60", shortDescription:"100% Polyester jersey, aerodynamic fit, moisture-wicking", materials:"100% Polyester", sizes:"XS, S, M, L, XL, 2XL", colors:"All colors available", tags:["cycling"] },
  { code:"MCI-61", subcategorySlug:"cycling-wear", name:"Cycling Wear MCI-61", shortDescription:"100% Polyester jersey, aerodynamic fit, moisture-wicking", materials:"100% Polyester", sizes:"XS, S, M, L, XL, 2XL", colors:"All colors available", tags:["cycling"] },
  { code:"MCI-62", subcategorySlug:"cycling-wear", name:"Cycling Wear MCI-62", shortDescription:"100% Polyester jersey, aerodynamic fit, moisture-wicking", materials:"100% Polyester", sizes:"XS, S, M, L, XL, 2XL", colors:"All colors available", tags:["cycling"] },
  { code:"MCI-63", subcategorySlug:"cycling-wear", name:"Cycling Wear MCI-63", shortDescription:"80% Nylon, 20% Lycra, compression fit, padded shorts available", materials:"80% Nylon, 20% Lycra", sizes:"XS, S, M, L, XL, 2XL", colors:"All colors available", tags:["cycling"] },
  { code:"MCI-64", subcategorySlug:"cycling-wear", name:"Cycling Wear MCI-64", shortDescription:"80% Nylon, 20% Lycra, compression fit, padded shorts available", materials:"80% Nylon, 20% Lycra", sizes:"XS, S, M, L, XL, 2XL", colors:"All colors available", tags:["cycling"] },
  { code:"MCI-65", subcategorySlug:"cycling-wear", name:"Cycling Wear MCI-65", shortDescription:"80% Nylon, 20% Lycra, compression fit, padded shorts available", materials:"80% Nylon, 20% Lycra", sizes:"XS, S, M, L, XL, 2XL", colors:"All colors available", tags:["cycling"] },
  { code:"MCI-66", subcategorySlug:"cycling-wear", name:"Cycling Wear MCI-66", shortDescription:"80% Nylon, 20% Lycra, compression fit, padded shorts available", materials:"80% Nylon, 20% Lycra", sizes:"XS, S, M, L, XL, 2XL", colors:"All colors available", tags:["cycling"] },
  // Sports Bra MCI-67 to MCI-70
  { code:"MCI-67", subcategorySlug:"sports-bra", name:"Sports Bra MCI-67", shortDescription:"Full support, hook & eye closure, adjustable straps, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["sports bra","women"] },
  { code:"MCI-68", subcategorySlug:"sports-bra", name:"Sports Bra MCI-68", shortDescription:"Full support, hook & eye closure, adjustable straps, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["sports bra","women"] },
  { code:"MCI-69", subcategorySlug:"sports-bra", name:"Sports Bra MCI-69", shortDescription:"Full support, hook & eye closure, adjustable straps, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["sports bra","women"] },
  { code:"MCI-70", subcategorySlug:"sports-bra", name:"Sports Bra MCI-70", shortDescription:"Full support, hook & eye closure, adjustable straps, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["sports bra","women"] },
  // Sports Caps MCI-71 to MCI-74
  { code:"MCI-71", subcategorySlug:"sports-caps", name:"Sports Cap MCI-71", shortDescription:"Cotton & acrylic blend, adjustable strap, embroidery available", materials:"Cotton & Acrylic blend", sizes:"One size adjustable", colors:"All colors available", tags:["cap","accessories"] },
  { code:"MCI-72", subcategorySlug:"sports-caps", name:"Sports Cap MCI-72", shortDescription:"Cotton & acrylic blend, adjustable strap, embroidery available", materials:"Cotton & Acrylic blend", sizes:"One size adjustable", colors:"All colors available", tags:["cap","accessories"] },
  { code:"MCI-73", subcategorySlug:"sports-caps", name:"Sports Cap MCI-73", shortDescription:"Cotton & acrylic blend, adjustable strap, embroidery available", materials:"Cotton & Acrylic blend", sizes:"One size adjustable", colors:"All colors available", tags:["cap","accessories"] },
  { code:"MCI-74", subcategorySlug:"sports-caps", name:"Sports Cap MCI-74", shortDescription:"Cotton & acrylic blend, adjustable strap, embroidery available", materials:"Cotton & Acrylic blend", sizes:"One size adjustable", colors:"All colors available", tags:["cap","accessories"] },
  // Sports Bags MCI-75 to MCI-78
  { code:"MCI-75", subcategorySlug:"sports-bags", name:"Sports Bag MCI-75", shortDescription:"Water-repellent finish, multiple pockets, adjustable shoulder strap", materials:"600D Polyester, water-repellent", sizes:"Standard", colors:"All colors available", tags:["bag","accessories"] },
  { code:"MCI-76", subcategorySlug:"sports-bags", name:"Sports Bag MCI-76", shortDescription:"Water-repellent finish, multiple pockets, adjustable shoulder strap", materials:"600D Polyester, water-repellent", sizes:"Standard", colors:"All colors available", tags:["bag","accessories"] },
  { code:"MCI-77", subcategorySlug:"sports-bags", name:"Sports Bag MCI-77", shortDescription:"Water-repellent finish, multiple pockets, adjustable shoulder strap", materials:"600D Polyester, water-repellent", sizes:"Standard", colors:"All colors available", tags:["bag","accessories"] },
  { code:"MCI-78", subcategorySlug:"sports-bags", name:"Sports Bag MCI-78", shortDescription:"Water-repellent finish, multiple pockets, adjustable shoulder strap", materials:"600D Polyester, water-repellent", sizes:"Standard", colors:"All colors available", tags:["bag","accessories"] },

  // ---------------------------------------------------------------------------
  // CASUAL WEAR — MCI-79 to MCI-114
  // ---------------------------------------------------------------------------
  // Track Suits MCI-79 to MCI-83
  { code:"MCI-79", subcategorySlug:"track-suits", name:"Track Suit MCI-79", shortDescription:"100% polyester micro ripstop, full zip jacket + tapered pants", materials:"100% Polyester micro ripstop", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["tracksuit","casual"], isFeatured:true },
  { code:"MCI-80", subcategorySlug:"track-suits", name:"Track Suit MCI-80", shortDescription:"100% polyester micro ripstop, full zip jacket + tapered pants", materials:"100% Polyester micro ripstop", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["tracksuit","casual"] },
  { code:"MCI-81", subcategorySlug:"track-suits", name:"Track Suit MCI-81", shortDescription:"100% polyester micro ripstop, full zip jacket + tapered pants", materials:"100% Polyester micro ripstop", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["tracksuit","casual"] },
  { code:"MCI-82", subcategorySlug:"track-suits", name:"Track Suit MCI-82", shortDescription:"100% polyester micro ripstop, full zip jacket + tapered pants", materials:"100% Polyester micro ripstop", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["tracksuit","casual"] },
  { code:"MCI-83", subcategorySlug:"track-suits", name:"Track Suit MCI-83", shortDescription:"100% polyester micro ripstop, full zip jacket + tapered pants", materials:"100% Polyester micro ripstop", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["tracksuit","casual"] },
  // Trousers MCI-84 to MCI-87
  { code:"MCI-84", subcategorySlug:"trousers", name:"Trousers MCI-84", shortDescription:"Cotton/elastane blend, 2-way stretch, comfortable everyday fit", materials:"Cotton/Elastane blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["trousers","casual"] },
  { code:"MCI-85", subcategorySlug:"trousers", name:"Trousers MCI-85", shortDescription:"Cotton/elastane blend, 2-way stretch, comfortable everyday fit", materials:"Cotton/Elastane blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["trousers","casual"] },
  { code:"MCI-86", subcategorySlug:"trousers", name:"Trousers MCI-86", shortDescription:"Cotton/elastane blend, 2-way stretch, comfortable everyday fit", materials:"Cotton/Elastane blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["trousers","casual"] },
  { code:"MCI-87", subcategorySlug:"trousers", name:"Trousers MCI-87", shortDescription:"Cotton/elastane blend, 2-way stretch, comfortable everyday fit", materials:"Cotton/Elastane blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["trousers","casual"] },
  // Polo Shirts MCI-88 to MCI-91
  { code:"MCI-88", subcategorySlug:"polo-shirts", name:"Polo Shirt MCI-88", shortDescription:"Cotton/poly blend, pique knit, 3-button placket, comfortable wear", materials:"Cotton/Polyester pique knit", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["polo","shirt"] },
  { code:"MCI-89", subcategorySlug:"polo-shirts", name:"Polo Shirt MCI-89", shortDescription:"Cotton/poly blend, pique knit, 3-button placket, comfortable wear", materials:"Cotton/Polyester pique knit", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["polo","shirt"] },
  { code:"MCI-90", subcategorySlug:"polo-shirts", name:"Polo Shirt MCI-90", shortDescription:"Cotton/poly blend, pique knit, 3-button placket, comfortable wear", materials:"Cotton/Polyester pique knit", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["polo","shirt"] },
  { code:"MCI-91", subcategorySlug:"polo-shirts", name:"Polo Shirt MCI-91", shortDescription:"Cotton/poly blend, pique knit, 3-button placket, comfortable wear", materials:"Cotton/Polyester pique knit", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["polo","shirt"] },
  // Sweat Shirts MCI-92 to MCI-95
  { code:"MCI-92", subcategorySlug:"sweat-shirts", name:"Sweat Shirt MCI-92", shortDescription:"Double layered shoulder panels, fleece interior, durable fabric", materials:"Cotton/Polyester fleece", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["sweatshirt","casual"] },
  { code:"MCI-93", subcategorySlug:"sweat-shirts", name:"Sweat Shirt MCI-93", shortDescription:"Double layered shoulder panels, fleece interior, durable fabric", materials:"Cotton/Polyester fleece", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["sweatshirt","casual"] },
  { code:"MCI-94", subcategorySlug:"sweat-shirts", name:"Sweat Shirt MCI-94", shortDescription:"Double layered shoulder panels, fleece interior, durable fabric", materials:"Cotton/Polyester fleece", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["sweatshirt","casual"] },
  { code:"MCI-95", subcategorySlug:"sweat-shirts", name:"Sweat Shirt MCI-95", shortDescription:"Double layered shoulder panels, fleece interior, durable fabric", materials:"Cotton/Polyester fleece", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["sweatshirt","casual"] },
  // T-Shirts MCI-96 to MCI-99
  { code:"MCI-96", subcategorySlug:"t-shirts", name:"T-Shirt MCI-96", shortDescription:"Cotton/polyester blend, double stitched seams, comfortable everyday wear", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["tshirt","casual"] },
  { code:"MCI-97", subcategorySlug:"t-shirts", name:"T-Shirt MCI-97", shortDescription:"Cotton/polyester blend, double stitched seams, comfortable everyday wear", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["tshirt","casual"] },
  { code:"MCI-98", subcategorySlug:"t-shirts", name:"T-Shirt MCI-98", shortDescription:"Cotton/polyester blend, double stitched seams, comfortable everyday wear", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["tshirt","casual"] },
  { code:"MCI-99", subcategorySlug:"t-shirts", name:"T-Shirt MCI-99", shortDescription:"Cotton/polyester blend, double stitched seams, comfortable everyday wear", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["tshirt","casual"] },
  // Compression Shorts MCI-100 to MCI-102
  { code:"MCI-100", subcategorySlug:"compression-shorts", name:"Compression Shorts MCI-100", shortDescription:"Nylon/elastane blend, muscle support, 4-way stretch", materials:"Nylon/Elastane blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["compression","shorts"] },
  { code:"MCI-101", subcategorySlug:"compression-shorts", name:"Compression Shorts MCI-101", shortDescription:"Nylon/elastane blend, muscle support, 4-way stretch", materials:"Nylon/Elastane blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["compression","shorts"] },
  { code:"MCI-102", subcategorySlug:"compression-shorts", name:"Compression Shorts MCI-102", shortDescription:"Nylon/elastane blend, muscle support, 4-way stretch", materials:"Nylon/Elastane blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["compression","shorts"] },
  // Compression Shirts MCI-103 to MCI-105
  { code:"MCI-103", subcategorySlug:"compression-shirts", name:"Compression Shirt MCI-103", shortDescription:"Polyester + spandex, moisture-sensing, muscle compression support", materials:"Polyester/Spandex blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["compression","shirt"] },
  { code:"MCI-104", subcategorySlug:"compression-shirts", name:"Compression Shirt MCI-104", shortDescription:"Polyester + spandex, moisture-sensing, muscle compression support", materials:"Polyester/Spandex blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["compression","shirt"] },
  { code:"MCI-105", subcategorySlug:"compression-shirts", name:"Compression Shirt MCI-105", shortDescription:"Polyester + spandex, moisture-sensing, muscle compression support", materials:"Polyester/Spandex blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["compression","shirt"] },
  // Tees MCI-106 to MCI-109
  { code:"MCI-106", subcategorySlug:"tees", name:"Tee MCI-106", shortDescription:"Polyester/elastane, machine washable, relaxed fit", materials:"Polyester/Elastane blend", sizes:"S, M, L, XL", colors:"All colors available", tags:["tee","casual"] },
  { code:"MCI-107", subcategorySlug:"tees", name:"Tee MCI-107", shortDescription:"Polyester/elastane, machine washable, relaxed fit", materials:"Polyester/Elastane blend", sizes:"S, M, L, XL", colors:"All colors available", tags:["tee","casual"] },
  { code:"MCI-108", subcategorySlug:"tees", name:"Tee MCI-108", shortDescription:"Polyester/elastane, machine washable, relaxed fit", materials:"Polyester/Elastane blend", sizes:"S, M, L, XL", colors:"All colors available", tags:["tee","casual"] },
  { code:"MCI-109", subcategorySlug:"tees", name:"Tee MCI-109", shortDescription:"Polyester/elastane, machine washable, relaxed fit", materials:"Polyester/Elastane blend", sizes:"S, M, L, XL", colors:"All colors available", tags:["tee","casual"] },
  // Hoodies MCI-110 to MCI-114
  { code:"MCI-110", subcategorySlug:"hoodies", name:"Hoodie MCI-110", shortDescription:"Cotton/poly fleece interior, kangaroo pocket, drawstring hood", materials:"Cotton/Polyester fleece", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["hoodie","casual"], isFeatured:true },
  { code:"MCI-111", subcategorySlug:"hoodies", name:"Hoodie MCI-111", shortDescription:"Cotton/poly fleece interior, kangaroo pocket, drawstring hood", materials:"Cotton/Polyester fleece", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["hoodie","casual"] },
  { code:"MCI-112", subcategorySlug:"hoodies", name:"Hoodie MCI-112", shortDescription:"Cotton/poly fleece interior, kangaroo pocket, drawstring hood", materials:"Cotton/Polyester fleece", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["hoodie","casual"] },
  { code:"MCI-113", subcategorySlug:"hoodies", name:"Hoodie MCI-113", shortDescription:"Cotton/poly fleece interior, kangaroo pocket, drawstring hood", materials:"Cotton/Polyester fleece", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["hoodie","casual"] },
  { code:"MCI-114", subcategorySlug:"hoodies", name:"Hoodie MCI-114", shortDescription:"Cotton/poly fleece interior, kangaroo pocket, drawstring hood", materials:"Cotton/Polyester fleece", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["hoodie","casual"] },

  // ---------------------------------------------------------------------------
  // FITNESS WEAR — MCI-115 to MCI-152
  // ---------------------------------------------------------------------------
  // Gym Gloves MCI-115 to MCI-118
  { code:"MCI-115", subcategorySlug:"gym-gloves", name:"Gym Gloves MCI-115", shortDescription:"Lycra spandex, breathable, keeps hands dry, wrist support", materials:"Lycra Spandex", sizes:"S, M, L, XL", colors:"All colors available", tags:["gym","gloves"] },
  { code:"MCI-116", subcategorySlug:"gym-gloves", name:"Gym Gloves MCI-116", shortDescription:"Lycra spandex, breathable, keeps hands dry, wrist support", materials:"Lycra Spandex", sizes:"S, M, L, XL", colors:"All colors available", tags:["gym","gloves"] },
  { code:"MCI-117", subcategorySlug:"gym-gloves", name:"Gym Gloves MCI-117", shortDescription:"Lycra spandex, breathable, keeps hands dry, wrist support", materials:"Lycra Spandex", sizes:"S, M, L, XL", colors:"All colors available", tags:["gym","gloves"] },
  { code:"MCI-118", subcategorySlug:"gym-gloves", name:"Gym Gloves MCI-118", shortDescription:"Lycra spandex, breathable, keeps hands dry, wrist support", materials:"Lycra Spandex", sizes:"S, M, L, XL", colors:"All colors available", tags:["gym","gloves"] },
  // Gym Straps MCI-119 to MCI-122
  { code:"MCI-119", subcategorySlug:"gym-straps", name:"Gym Straps MCI-119", shortDescription:"Cotton + rubber, weight lifting straps, anti-slip grip", materials:"Cotton + Rubber", sizes:"All sizes", colors:"All colors available", tags:["gym","straps"] },
  { code:"MCI-120", subcategorySlug:"gym-straps", name:"Gym Straps MCI-120", shortDescription:"Cotton + rubber, weight lifting straps, anti-slip grip", materials:"Cotton + Rubber", sizes:"All sizes", colors:"All colors available", tags:["gym","straps"] },
  { code:"MCI-121", subcategorySlug:"gym-straps", name:"Gym Straps MCI-121", shortDescription:"Cotton + rubber, weight lifting straps, anti-slip grip", materials:"Cotton + Rubber", sizes:"All sizes", colors:"All colors available", tags:["gym","straps"] },
  { code:"MCI-122", subcategorySlug:"gym-straps", name:"Gym Straps MCI-122", shortDescription:"Cotton + rubber, weight lifting straps, anti-slip grip", materials:"Cotton + Rubber", sizes:"All sizes", colors:"All colors available", tags:["gym","straps"] },
  // Gym Belts MCI-123 to MCI-126
  { code:"MCI-123", subcategorySlug:"gym-belts", name:"Gym Belt MCI-123", shortDescription:"100% neoprene, hook & loop closure, lumbar support", materials:"100% Neoprene", sizes:"S, M, L, XL, 2XL", colors:"Black, custom colors available", tags:["gym","belt"] },
  { code:"MCI-124", subcategorySlug:"gym-belts", name:"Gym Belt MCI-124", shortDescription:"100% neoprene, hook & loop closure, lumbar support", materials:"100% Neoprene", sizes:"S, M, L, XL, 2XL", colors:"Black, custom colors available", tags:["gym","belt"] },
  { code:"MCI-125", subcategorySlug:"gym-belts", name:"Gym Belt MCI-125", shortDescription:"100% neoprene, hook & loop closure, lumbar support", materials:"100% Neoprene", sizes:"S, M, L, XL, 2XL", colors:"Black, custom colors available", tags:["gym","belt"] },
  { code:"MCI-126", subcategorySlug:"gym-belts", name:"Gym Belt MCI-126", shortDescription:"100% neoprene, hook & loop closure, lumbar support", materials:"100% Neoprene", sizes:"S, M, L, XL, 2XL", colors:"Black, custom colors available", tags:["gym","belt"] },
  // Women Singlet MCI-127 to MCI-133
  { code:"MCI-127", subcategorySlug:"women-singlet", name:"Women Singlet MCI-127", shortDescription:"Lightweight breathable fabric, racerback design, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","singlet"] },
  { code:"MCI-128", subcategorySlug:"women-singlet", name:"Women Singlet MCI-128", shortDescription:"Lightweight breathable fabric, racerback design, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","singlet"] },
  { code:"MCI-129", subcategorySlug:"women-singlet", name:"Women Singlet MCI-129", shortDescription:"Lightweight breathable fabric, racerback design, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","singlet"] },
  { code:"MCI-130", subcategorySlug:"women-singlet", name:"Women Singlet MCI-130", shortDescription:"Lightweight breathable fabric, racerback design, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","singlet"] },
  { code:"MCI-131", subcategorySlug:"women-singlet", name:"Women Singlet MCI-131", shortDescription:"Lightweight breathable fabric, racerback design, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","singlet"] },
  { code:"MCI-132", subcategorySlug:"women-singlet", name:"Women Singlet MCI-132", shortDescription:"Lightweight breathable fabric, racerback design, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","singlet"] },
  { code:"MCI-133", subcategorySlug:"women-singlet", name:"Women Singlet MCI-133", shortDescription:"Lightweight breathable fabric, racerback design, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","singlet"] },
  // Women Athletic Tank Top MCI-134 to MCI-138 (from fitness catalog)
  { code:"MCI-134", subcategorySlug:"women-athletic-tank-top", name:"Women Athletic Tank Top MCI-134", shortDescription:"Polyester/spandex blend, athletic cut, moisture-wicking, 4-way stretch", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","tank top","athletic"] },
  { code:"MCI-135", subcategorySlug:"women-athletic-tank-top", name:"Women Athletic Tank Top MCI-135", shortDescription:"Polyester/spandex blend, athletic cut, moisture-wicking, 4-way stretch", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","tank top","athletic"] },
  { code:"MCI-136", subcategorySlug:"women-athletic-tank-top", name:"Women Athletic Tank Top MCI-136", shortDescription:"Polyester/spandex blend, athletic cut, moisture-wicking, 4-way stretch", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","tank top","athletic"] },
  { code:"MCI-137", subcategorySlug:"women-athletic-tank-top", name:"Women Athletic Tank Top MCI-137", shortDescription:"Polyester/spandex blend, athletic cut, moisture-wicking, 4-way stretch", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","tank top","athletic"] },
  { code:"MCI-138", subcategorySlug:"women-athletic-tank-top", name:"Women Athletic Tank Top MCI-138", shortDescription:"Polyester/spandex blend, athletic cut, moisture-wicking, 4-way stretch", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","tank top","athletic"] },
  // Women Shorts MCI-139 to MCI-142
  { code:"MCI-139", subcategorySlug:"women-shorts", name:"Women Shorts MCI-139", shortDescription:"Polyester/spandex blend, elastic waistband, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","shorts"] },
  { code:"MCI-140", subcategorySlug:"women-shorts", name:"Women Shorts MCI-140", shortDescription:"Polyester/spandex blend, elastic waistband, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","shorts"] },
  { code:"MCI-141", subcategorySlug:"women-shorts", name:"Women Shorts MCI-141", shortDescription:"Polyester/spandex blend, elastic waistband, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","shorts"] },
  { code:"MCI-142", subcategorySlug:"women-shorts", name:"Women Shorts MCI-142", shortDescription:"Polyester/spandex blend, elastic waistband, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["women","shorts"] },
  // Gym Pants MCI-143 to MCI-146
  { code:"MCI-143", subcategorySlug:"gym-pants", name:"Gym Pants MCI-143", shortDescription:"Cotton/poly blend, elastic waistband, drawstring, customizable", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"Custom colors available", tags:["gym","pants"] },
  { code:"MCI-144", subcategorySlug:"gym-pants", name:"Gym Pants MCI-144", shortDescription:"Polyester/spandex, camouflage options, 4-way stretch", materials:"Polyester/Spandex blend", sizes:"S, M, L, XL, 2XL", colors:"Black, White, Camo", tags:["gym","pants"] },
  { code:"MCI-145", subcategorySlug:"gym-pants", name:"Gym Pants MCI-145", shortDescription:"Cotton/poly blend, unisex custom design, comfortable fit", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"Custom colors available", tags:["gym","pants"] },
  { code:"MCI-146", subcategorySlug:"gym-pants", name:"Gym Pants MCI-146", shortDescription:"Polyester/spandex, tapered fit, moisture-wicking", materials:"Polyester/Spandex blend", sizes:"S, M, L, XL, 2XL", colors:"Custom colors available", tags:["gym","pants"] },
  // Men's Gym Shorts MCI-147 to MCI-150
  { code:"MCI-147", subcategorySlug:"mens-gym-shorts", name:"Men's Gym Shorts MCI-147", shortDescription:"Polyester breathable mesh, elastic waistband, side pockets", materials:"Polyester breathable mesh", sizes:"S, M, L, XL, 2XL", colors:"Custom colors available", tags:["men","shorts","gym"] },
  { code:"MCI-148", subcategorySlug:"mens-gym-shorts", name:"Men's Gym Shorts MCI-148", shortDescription:"Polyester breathable mesh, elastic waistband, side pockets", materials:"Polyester breathable mesh", sizes:"S, M, L, XL, 2XL", colors:"Custom colors available", tags:["men","shorts","gym"] },
  { code:"MCI-149", subcategorySlug:"mens-gym-shorts", name:"Men's Gym Shorts MCI-149", shortDescription:"Polyester breathable mesh, elastic waistband, side pockets", materials:"Polyester breathable mesh", sizes:"S, M, L, XL, 2XL", colors:"Custom colors available", tags:["men","shorts","gym"] },
  { code:"MCI-150", subcategorySlug:"mens-gym-shorts", name:"Men's Gym Shorts MCI-150", shortDescription:"Polyester breathable mesh, elastic waistband, side pockets", materials:"Polyester breathable mesh", sizes:"S, M, L, XL, 2XL", colors:"Custom colors available", tags:["men","shorts","gym"] },
  // Leggings MCI-151 to MCI-152
  { code:"MCI-151", subcategorySlug:"leggings", name:"Leggings MCI-151", shortDescription:"Polyester/elastane stretch, high-waist, 4-way stretch, moisture-wicking", materials:"Polyester/Elastane blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["leggings","women"] },
  { code:"MCI-152", subcategorySlug:"leggings", name:"Leggings MCI-152", shortDescription:"Polyester/elastane stretch, high-waist, 4-way stretch, moisture-wicking", materials:"Polyester/Elastane blend", sizes:"XS, S, M, L, XL", colors:"All colors available", tags:["leggings","women"] },

  // ---------------------------------------------------------------------------
  // FASHION WEAR — MCI-153 onward
  // ---------------------------------------------------------------------------
  // Oversized Fits MCI-153 to MCI-156
  { code:"MCI-153", subcategorySlug:"oversized-fits", name:"Oversized Fit MCI-153", shortDescription:"Premium oversized silhouette, dropped shoulders, heavyweight cotton", materials:"100% Heavyweight Cotton, 280gsm", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["oversized","fashion"], isFeatured:true },
  { code:"MCI-154", subcategorySlug:"oversized-fits", name:"Oversized Fit MCI-154", shortDescription:"Premium oversized silhouette, dropped shoulders, heavyweight cotton", materials:"100% Heavyweight Cotton, 280gsm", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["oversized","fashion"] },
  { code:"MCI-155", subcategorySlug:"oversized-fits", name:"Oversized Fit MCI-155", shortDescription:"Premium oversized silhouette, dropped shoulders, heavyweight cotton", materials:"100% Heavyweight Cotton, 280gsm", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["oversized","fashion"] },
  { code:"MCI-156", subcategorySlug:"oversized-fits", name:"Oversized Fit MCI-156", shortDescription:"Premium oversized silhouette, dropped shoulders, heavyweight cotton", materials:"100% Heavyweight Cotton, 280gsm", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["oversized","fashion"] },
  // Denim Jackets MCI-157 to MCI-160
  { code:"MCI-157", subcategorySlug:"denim-jackets", name:"Denim Jacket MCI-157", shortDescription:"Premium denim, button-front, chest pockets, custom wash options", materials:"100% Cotton Denim", sizes:"S, M, L, XL, 2XL", colors:"Blue, Black, custom wash", tags:["denim","jacket","fashion"] },
  { code:"MCI-158", subcategorySlug:"denim-jackets", name:"Denim Jacket MCI-158", shortDescription:"Premium denim, button-front, chest pockets, custom wash options", materials:"100% Cotton Denim", sizes:"S, M, L, XL, 2XL", colors:"Blue, Black, custom wash", tags:["denim","jacket","fashion"] },
  { code:"MCI-159", subcategorySlug:"denim-jackets", name:"Denim Jacket MCI-159", shortDescription:"Premium denim, button-front, chest pockets, custom wash options", materials:"100% Cotton Denim", sizes:"S, M, L, XL, 2XL", colors:"Blue, Black, custom wash", tags:["denim","jacket","fashion"] },
  { code:"MCI-160", subcategorySlug:"denim-jackets", name:"Denim Jacket MCI-160", shortDescription:"Premium denim, button-front, chest pockets, custom wash options", materials:"100% Cotton Denim", sizes:"S, M, L, XL, 2XL", colors:"Blue, Black, custom wash", tags:["denim","jacket","fashion"] },
  // Streetwear Tees MCI-161 to MCI-164
  { code:"MCI-161", subcategorySlug:"streetwear-tees", name:"Streetwear Tee MCI-161", shortDescription:"Heavyweight cotton, screen print / embroidery, streetwear aesthetic", materials:"100% Cotton, 220gsm", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["streetwear","tee","fashion"] },
  { code:"MCI-162", subcategorySlug:"streetwear-tees", name:"Streetwear Tee MCI-162", shortDescription:"Heavyweight cotton, screen print / embroidery, streetwear aesthetic", materials:"100% Cotton, 220gsm", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["streetwear","tee","fashion"] },
  { code:"MCI-163", subcategorySlug:"streetwear-tees", name:"Streetwear Tee MCI-163", shortDescription:"Heavyweight cotton, screen print / embroidery, streetwear aesthetic", materials:"100% Cotton, 220gsm", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["streetwear","tee","fashion"] },
  { code:"MCI-164", subcategorySlug:"streetwear-tees", name:"Streetwear Tee MCI-164", shortDescription:"Heavyweight cotton, screen print / embroidery, streetwear aesthetic", materials:"100% Cotton, 220gsm", sizes:"S, M, L, XL, 2XL, 3XL", colors:"All colors available", tags:["streetwear","tee","fashion"] },
  // Sweater MCI-165 to MCI-168
  { code:"MCI-165", subcategorySlug:"sweater", name:"Sweater MCI-165", shortDescription:"Cotton/acrylic blend, ribbed cuffs and hem, relaxed fit", materials:"Cotton/Acrylic blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["sweater","fashion"] },
  { code:"MCI-166", subcategorySlug:"sweater", name:"Sweater MCI-166", shortDescription:"Cotton/acrylic blend, ribbed cuffs and hem, relaxed fit", materials:"Cotton/Acrylic blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["sweater","fashion"] },
  { code:"MCI-167", subcategorySlug:"sweater", name:"Sweater MCI-167", shortDescription:"Cotton/acrylic blend, ribbed cuffs and hem, relaxed fit", materials:"Cotton/Acrylic blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["sweater","fashion"] },
  { code:"MCI-168", subcategorySlug:"sweater", name:"Sweater MCI-168", shortDescription:"Cotton/acrylic blend, ribbed cuffs and hem, relaxed fit", materials:"Cotton/Acrylic blend", sizes:"S, M, L, XL, 2XL", colors:"All colors available", tags:["sweater","fashion"] },
  // Cargo Vest MCI-169 to MCI-172
  { code:"MCI-169", subcategorySlug:"cargo-vest", name:"Cargo Vest MCI-169", shortDescription:"Multi-pocket cargo vest, durable fabric, utility streetwear style", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"Khaki, Black, Olive, custom", tags:["cargo","vest","fashion"] },
  { code:"MCI-170", subcategorySlug:"cargo-vest", name:"Cargo Vest MCI-170", shortDescription:"Multi-pocket cargo vest, durable fabric, utility streetwear style", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"Khaki, Black, Olive, custom", tags:["cargo","vest","fashion"] },
  { code:"MCI-171", subcategorySlug:"cargo-vest", name:"Cargo Vest MCI-171", shortDescription:"Multi-pocket cargo vest, durable fabric, utility streetwear style", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"Khaki, Black, Olive, custom", tags:["cargo","vest","fashion"] },
  { code:"MCI-172", subcategorySlug:"cargo-vest", name:"Cargo Vest MCI-172", shortDescription:"Multi-pocket cargo vest, durable fabric, utility streetwear style", materials:"Cotton/Polyester blend", sizes:"S, M, L, XL, 2XL", colors:"Khaki, Black, Olive, custom", tags:["cargo","vest","fashion"] },
  // Cargo Pants MCI-173 to MCI-176
  { code:"MCI-173", subcategorySlug:"cargo-pants", name:"Cargo Pants MCI-173", shortDescription:"Multi-pocket cargo pants, relaxed fit, durable ripstop fabric", materials:"Cotton Ripstop", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Khaki, Black, Olive, custom", tags:["cargo","pants","fashion"] },
  { code:"MCI-174", subcategorySlug:"cargo-pants", name:"Cargo Pants MCI-174", shortDescription:"Multi-pocket cargo pants, relaxed fit, durable ripstop fabric", materials:"Cotton Ripstop", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Khaki, Black, Olive, custom", tags:["cargo","pants","fashion"] },
  { code:"MCI-175", subcategorySlug:"cargo-pants", name:"Cargo Pants MCI-175", shortDescription:"Multi-pocket cargo pants, relaxed fit, durable ripstop fabric", materials:"Cotton Ripstop", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Khaki, Black, Olive, custom", tags:["cargo","pants","fashion"] },
  { code:"MCI-176", subcategorySlug:"cargo-pants", name:"Cargo Pants MCI-176", shortDescription:"Multi-pocket cargo pants, relaxed fit, durable ripstop fabric", materials:"Cotton Ripstop", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Khaki, Black, Olive, custom", tags:["cargo","pants","fashion"] },
  // Baggy Distressed Jeans MCI-177 to MCI-180
  { code:"MCI-177", subcategorySlug:"baggy-distressed-jeans", name:"Baggy Distressed Jeans MCI-177", shortDescription:"100% cotton denim, baggy fit, distressed wash, streetwear style", materials:"100% Cotton Denim", sizes:"28, 30, 32, 34, 36, 38", colors:"Blue, Black, Grey distressed", tags:["jeans","distressed","fashion"] },
  { code:"MCI-178", subcategorySlug:"baggy-distressed-jeans", name:"Baggy Distressed Jeans MCI-178", shortDescription:"100% cotton denim, baggy fit, distressed wash, streetwear style", materials:"100% Cotton Denim", sizes:"28, 30, 32, 34, 36, 38", colors:"Blue, Black, Grey distressed", tags:["jeans","distressed","fashion"] },
  { code:"MCI-179", subcategorySlug:"baggy-distressed-jeans", name:"Baggy Distressed Jeans MCI-179", shortDescription:"100% cotton denim, baggy fit, distressed wash, streetwear style", materials:"100% Cotton Denim", sizes:"28, 30, 32, 34, 36, 38", colors:"Blue, Black, Grey distressed", tags:["jeans","distressed","fashion"] },
  { code:"MCI-180", subcategorySlug:"baggy-distressed-jeans", name:"Baggy Distressed Jeans MCI-180", shortDescription:"100% cotton denim, baggy fit, distressed wash, streetwear style", materials:"100% Cotton Denim", sizes:"28, 30, 32, 34, 36, 38", colors:"Blue, Black, Grey distressed", tags:["jeans","distressed","fashion"] },
  // Streetwear Acid Wash MCI-181 to MCI-184
  { code:"MCI-181", subcategorySlug:"streetwear-acid-wash", name:"Streetwear Acid Wash MCI-181", shortDescription:"Acid wash treatment, unique pattern each piece, heavyweight cotton", materials:"100% Cotton, acid wash treated", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Acid wash — varies per piece", tags:["acid wash","streetwear","fashion"] },
  { code:"MCI-182", subcategorySlug:"streetwear-acid-wash", name:"Streetwear Acid Wash MCI-182", shortDescription:"Acid wash treatment, unique pattern each piece, heavyweight cotton", materials:"100% Cotton, acid wash treated", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Acid wash — varies per piece", tags:["acid wash","streetwear","fashion"] },
  { code:"MCI-183", subcategorySlug:"streetwear-acid-wash", name:"Streetwear Acid Wash MCI-183", shortDescription:"Acid wash treatment, unique pattern each piece, heavyweight cotton", materials:"100% Cotton, acid wash treated", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Acid wash — varies per piece", tags:["acid wash","streetwear","fashion"] },
  { code:"MCI-184", subcategorySlug:"streetwear-acid-wash", name:"Streetwear Acid Wash MCI-184", shortDescription:"Acid wash treatment, unique pattern each piece, heavyweight cotton", materials:"100% Cotton, acid wash treated", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Acid wash — varies per piece", tags:["acid wash","streetwear","fashion"] },
  // Rayon Stone Shirt MCI-185 to MCI-188
  { code:"MCI-185", subcategorySlug:"rayon-stone-shirt", name:"Rayon Stone Shirt MCI-185", shortDescription:"100% Rayon, stone wash finish, relaxed fit, premium drape", materials:"100% Rayon, stone wash", sizes:"S, M, L, XL, 2XL", colors:"Stone wash — natural tones", tags:["rayon","stone wash","shirt","fashion"] },
  { code:"MCI-186", subcategorySlug:"rayon-stone-shirt", name:"Rayon Stone Shirt MCI-186", shortDescription:"100% Rayon, stone wash finish, relaxed fit, premium drape", materials:"100% Rayon, stone wash", sizes:"S, M, L, XL, 2XL", colors:"Stone wash — natural tones", tags:["rayon","stone wash","shirt","fashion"] },
  { code:"MCI-187", subcategorySlug:"rayon-stone-shirt", name:"Rayon Stone Shirt MCI-187", shortDescription:"100% Rayon, stone wash finish, relaxed fit, premium drape", materials:"100% Rayon, stone wash", sizes:"S, M, L, XL, 2XL", colors:"Stone wash — natural tones", tags:["rayon","stone wash","shirt","fashion"] },
  { code:"MCI-188", subcategorySlug:"rayon-stone-shirt", name:"Rayon Stone Shirt MCI-188", shortDescription:"100% Rayon, stone wash finish, relaxed fit, premium drape", materials:"100% Rayon, stone wash", sizes:"S, M, L, XL, 2XL", colors:"Stone wash — natural tones", tags:["rayon","stone wash","shirt","fashion"] },
  // Chemical Wash Hoodies MCI-189 to MCI-192
  { code:"MCI-189", subcategorySlug:"chemical-wash-hoodies", name:"Chemical Wash Hoodie MCI-189", shortDescription:"Chemical wash treatment, unique faded effect, heavyweight fleece", materials:"Cotton/Polyester fleece, chemical wash", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Chemical wash — varies per piece", tags:["chemical wash","hoodie","fashion"] },
  { code:"MCI-190", subcategorySlug:"chemical-wash-hoodies", name:"Chemical Wash Hoodie MCI-190", shortDescription:"Chemical wash treatment, unique faded effect, heavyweight fleece", materials:"Cotton/Polyester fleece, chemical wash", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Chemical wash — varies per piece", tags:["chemical wash","hoodie","fashion"] },
  { code:"MCI-191", subcategorySlug:"chemical-wash-hoodies", name:"Chemical Wash Hoodie MCI-191", shortDescription:"Chemical wash treatment, unique faded effect, heavyweight fleece", materials:"Cotton/Polyester fleece, chemical wash", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Chemical wash — varies per piece", tags:["chemical wash","hoodie","fashion"] },
  { code:"MCI-192", subcategorySlug:"chemical-wash-hoodies", name:"Chemical Wash Hoodie MCI-192", shortDescription:"Chemical wash treatment, unique faded effect, heavyweight fleece", materials:"Cotton/Polyester fleece, chemical wash", sizes:"S, M, L, XL, 2XL, 3XL", colors:"Chemical wash — varies per piece", tags:["chemical wash","hoodie","fashion"] },
  // Sunfade Shirt MCI-193 to MCI-196
  { code:"MCI-193", subcategorySlug:"sunfade-shirt", name:"Sunfade Shirt MCI-193", shortDescription:"Sun-faded effect, vintage aesthetic, 100% cotton, relaxed fit", materials:"100% Cotton, sun-fade treated", sizes:"S, M, L, XL, 2XL", colors:"Faded tones — varies per piece", tags:["sunfade","shirt","fashion","vintage"] },
  { code:"MCI-194", subcategorySlug:"sunfade-shirt", name:"Sunfade Shirt MCI-194", shortDescription:"Sun-faded effect, vintage aesthetic, 100% cotton, relaxed fit", materials:"100% Cotton, sun-fade treated", sizes:"S, M, L, XL, 2XL", colors:"Faded tones — varies per piece", tags:["sunfade","shirt","fashion","vintage"] },
  { code:"MCI-195", subcategorySlug:"sunfade-shirt", name:"Sunfade Shirt MCI-195", shortDescription:"Sun-faded effect, vintage aesthetic, 100% cotton, relaxed fit", materials:"100% Cotton, sun-fade treated", sizes:"S, M, L, XL, 2XL", colors:"Faded tones — varies per piece", tags:["sunfade","shirt","fashion","vintage"] },
  { code:"MCI-196", subcategorySlug:"sunfade-shirt", name:"Sunfade Shirt MCI-196", shortDescription:"Sun-faded effect, vintage aesthetic, 100% cotton, relaxed fit", materials:"100% Cotton, sun-fade treated", sizes:"S, M, L, XL, 2XL", colors:"Faded tones — varies per piece", tags:["sunfade","shirt","fashion","vintage"] },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined in environment variables.");

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  // ── 1. Admin user ──────────────────────────────────────────────────────────
  console.log("Seeding admin user...");
  const existing = await User.findOne({ email: "admin@megacore.com" });
  if (!existing) {
    const hashed = await bcrypt.hash("Admin@123456", 12);
    await User.create({ name: "Admin", email: "admin@megacore.com", password: hashed, role: "admin", isActive: true });
    console.log("  Created admin user.");
  } else {
    console.log("  Admin user already exists, skipping.");
  }

  // ── 2. Categories ──────────────────────────────────────────────────────────
  console.log("\nSeeding categories...");
  const categoryDefs = [
    { name: "Sports Wear",  slug: "sports-wear",  order: 0, description: "Team uniforms, jerseys, tracksuits, and performance sportswear for all major sports." },
    { name: "Casual Wear",  slug: "casual-wear",  order: 1, description: "Hoodies, tracksuits, polo shirts, T-shirts, sweatshirts, and everyday athletic lifestyle wear." },
    { name: "Fitness Wear", slug: "fitness-wear", order: 2, description: "High-performance gym wear for men and women. Leggings, shorts, gloves, straps, belts, and more." },
    { name: "Fashion Wear", slug: "fashion-wear", order: 3, description: "Oversized fits, denim jackets, streetwear tees, cargo pants, acid wash, and premium fashion-forward apparel." },
  ];

  const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const cat of categoryDefs) {
    const doc = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: { name: cat.name, slug: cat.slug, order: cat.order, description: cat.description, isActive: true } },
      { upsert: true, new: true }
    );
    categoryMap[cat.slug] = doc._id as mongoose.Types.ObjectId;
    console.log(`  Upserted category: ${cat.name}`);
  }

  // ── 2b. Clean up old slug variants that were renamed ──────────────────────
  console.log("\nCleaning up renamed slugs...");
  // Old seed used "goalkeeper-uniforms"; new catalog uses "goal-keeper-uniforms"
  // Old seed used "mens-gym-shorts" (kept same) but "women-singlet" had no "women-athletic-tank-top"
  // Remove old goalkeeper-uniforms subcategory if it exists (products will be re-assigned)
  const oldGK = await Subcategory.findOne({ slug: "goalkeeper-uniforms" });
  if (oldGK) {
    await Product.updateMany({ subcategoryId: oldGK._id }, { $set: { subcategoryId: null } });
    await Subcategory.deleteOne({ _id: oldGK._id });
    console.log("  Removed old subcategory: goalkeeper-uniforms");
  }

  // ── 3. Subcategories ───────────────────────────────────────────────────────
  console.log("\nSeeding subcategories...");
  const subcategoryMap: Record<string, mongoose.Types.ObjectId> = {};

  for (const sub of subcategoryDefs) {
    const categoryId = categoryMap[sub.categorySlug];
    if (!categoryId) throw new Error(`Category not found for slug: ${sub.categorySlug}`);
    const doc = await Subcategory.findOneAndUpdate(
      { slug: sub.slug, categoryId },
      { $set: { name: sub.name, slug: sub.slug, categoryId, order: sub.order, isActive: true } },
      { upsert: true, new: true }
    );
    subcategoryMap[sub.slug] = doc._id as mongoose.Types.ObjectId;
    console.log(`  Upserted subcategory: ${sub.name}`);
  }

  // ── 4. Products ────────────────────────────────────────────────────────────
  console.log("\nSeeding products...");
  let created = 0;
  let updated = 0;

  for (const def of productDefs) {
    const subcategoryId = subcategoryMap[def.subcategorySlug];
    if (!subcategoryId) throw new Error(`Subcategory not found for slug: ${def.subcategorySlug}`);

    const subDef = subcategoryDefs.find((s) => s.slug === def.subcategorySlug);
    if (!subDef) throw new Error(`SubcategoryDef not found for slug: ${def.subcategorySlug}`);
    const categoryId = categoryMap[subDef.categorySlug];

    const slug = productSlug(def.subcategorySlug, def.code);

    // Use local catalog image — files are named MCI-01.png, MCI-10.png, etc.
    const image = catalogImage(def.code);

    const existing = await Product.findOne({ code: def.code });

    await Product.findOneAndUpdate(
      { code: def.code },
      {
        $set: {
          code:             def.code,
          name:             def.name,
          slug,
          categoryId,
          subcategoryId,
          shortDescription: def.shortDescription,
          materials:        def.materials,
          sizes:            def.sizes,
          colors:           def.colors,
          moq:              50,
          price:            null,
          currency:         "USD",
          image,
          gallery:          [],
          tags:             def.tags,
          isActive:         true,
          isFeatured:       def.isFeatured ?? false,
        },
      },
      { upsert: true, new: true }
    );

    if (existing) {
      updated++;
      console.log(`  Updated: ${def.code} — ${def.name}`);
    } else {
      created++;
      console.log(`  Created: ${def.code} — ${def.name}`);
    }
  }

  console.log(`\nDone. Created ${created} new products, updated ${updated} existing products.`);
  console.log(`Total products seeded: ${productDefs.length}`);
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
