import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import mongoose, { Schema } from "mongoose";

function getModels() {
  const Cat = mongoose.models.Category ?? mongoose.model("Category", new Schema(
    { name: String, slug: String, description: String, isActive: { type: Boolean, default: true }, order: { type: Number, default: 0 } },
    { timestamps: true }
  ));
  const SubSchema = new Schema(
    { name: String, slug: String, categoryId: Schema.Types.ObjectId, description: String, isActive: { type: Boolean, default: true }, order: { type: Number, default: 0 } },
    { timestamps: true }
  );
  SubSchema.index({ slug: 1, categoryId: 1 }, { unique: true });
  const Sub = mongoose.models.Subcategory ?? mongoose.model("Subcategory", SubSchema);
  const Prod = mongoose.models.Product ?? mongoose.model("Product", new Schema(
    {
      code: String, name: String, slug: String,
      categoryId: Schema.Types.ObjectId, subcategoryId: Schema.Types.ObjectId,
      shortDescription: String, materials: String, sizes: String, colors: String,
      moq: { type: Number, default: 50 }, price: { type: Number, default: null },
      currency: { type: String, default: "USD" }, image: { type: String, default: "" },
      gallery: [String], tags: [String],
      isActive: { type: Boolean, default: true }, isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
  ));
  return { Cat, Sub, Prod };
}

const CATEGORIES = [
  { name: "Sports Wear",  slug: "sports-wear",  order: 0, description: "Team uniforms, jerseys, tracksuits, and performance sportswear for all major sports." },
  { name: "Casual Wear",  slug: "casual-wear",  order: 1, description: "Hoodies, tracksuits, polo shirts, T-shirts, sweatshirts, and everyday athletic lifestyle wear." },
  { name: "Fitness Wear", slug: "fitness-wear", order: 2, description: "High-performance gym wear for men and women. Leggings, shorts, gloves, straps, belts, and more." },
  { name: "Fashion Wear", slug: "fashion-wear", order: 3, description: "Oversized fits, denim jackets, streetwear tees, cargo pants, acid wash, and premium fashion-forward apparel." },
];

const SUBCATEGORIES = [
  { name:"Basketball Uniforms",        slug:"basketball-uniforms",        cat:"sports-wear",  order:0  },
  { name:"Shooter Shirts",             slug:"shooter-shirts",             cat:"sports-wear",  order:1  },
  { name:"Soccer Track Suits",         slug:"soccer-track-suits",         cat:"sports-wear",  order:2  },
  { name:"Baseball Uniforms",          slug:"baseball-uniforms",          cat:"sports-wear",  order:3  },
  { name:"Volleyball Uniforms",        slug:"volleyball-uniforms",        cat:"sports-wear",  order:4  },
  { name:"Soccer Uniforms",            slug:"soccer-uniforms",            cat:"sports-wear",  order:5  },
  { name:"American Football Uniforms", slug:"american-football-uniforms", cat:"sports-wear",  order:6  },
  { name:"Cricket Uniforms",           slug:"cricket-uniforms",           cat:"sports-wear",  order:7  },
  { name:"Ice Hockey Uniforms",        slug:"ice-hockey-uniforms",        cat:"sports-wear",  order:8  },
  { name:"Tennis Uniforms",            slug:"tennis-uniforms",            cat:"sports-wear",  order:9  },
  { name:"Goal Keeper Uniforms",       slug:"goal-keeper-uniforms",       cat:"sports-wear",  order:10 },
  { name:"Soccer Jerseys",             slug:"soccer-jerseys",             cat:"sports-wear",  order:11 },
  { name:"Baseball Jerseys",           slug:"baseball-jerseys",           cat:"sports-wear",  order:12 },
  { name:"Volleyball Jerseys",         slug:"volleyball-jerseys",         cat:"sports-wear",  order:13 },
  { name:"Cycling Wear",               slug:"cycling-wear",               cat:"sports-wear",  order:14 },
  { name:"Sports Bra",                 slug:"sports-bra",                 cat:"sports-wear",  order:15 },
  { name:"Sports Caps",                slug:"sports-caps",                cat:"sports-wear",  order:16 },
  { name:"Swim Wear",                  slug:"swim-wear",                  cat:"sports-wear",  order:17 },
  { name:"Sports Bags",                slug:"sports-bags",                cat:"sports-wear",  order:18 },
  { name:"Track Suits",                slug:"track-suits",                cat:"casual-wear",  order:0  },
  { name:"Trousers",                   slug:"trousers",                   cat:"casual-wear",  order:1  },
  { name:"Polo Shirts",                slug:"polo-shirts",                cat:"casual-wear",  order:2  },
  { name:"Sweat Shirts",               slug:"sweat-shirts",               cat:"casual-wear",  order:3  },
  { name:"T-Shirts",                   slug:"t-shirts",                   cat:"casual-wear",  order:4  },
  { name:"Compression Shorts",         slug:"compression-shorts",         cat:"casual-wear",  order:5  },
  { name:"Compression Shirts",         slug:"compression-shirts",         cat:"casual-wear",  order:6  },
  { name:"Tees",                       slug:"tees",                       cat:"casual-wear",  order:7  },
  { name:"Hoodies",                    slug:"hoodies",                    cat:"casual-wear",  order:8  },
  { name:"Gym Gloves",                 slug:"gym-gloves",                 cat:"fitness-wear", order:0  },
  { name:"Gym Straps",                 slug:"gym-straps",                 cat:"fitness-wear", order:1  },
  { name:"Gym Belts",                  slug:"gym-belts",                  cat:"fitness-wear", order:2  },
  { name:"Women Singlet",              slug:"women-singlet",              cat:"fitness-wear", order:3  },
  { name:"Women Athletic Tank Top",    slug:"women-athletic-tank-top",    cat:"fitness-wear", order:4  },
  { name:"Women Shorts",               slug:"women-shorts",               cat:"fitness-wear", order:5  },
  { name:"Gym Pants",                  slug:"gym-pants",                  cat:"fitness-wear", order:6  },
  { name:"Men's Gym Shorts",           slug:"mens-gym-shorts",            cat:"fitness-wear", order:7  },
  { name:"Leggings",                   slug:"leggings",                   cat:"fitness-wear", order:8  },
  { name:"Oversized Fits",             slug:"oversized-fits",             cat:"fashion-wear", order:0  },
  { name:"Denim Jackets",              slug:"denim-jackets",              cat:"fashion-wear", order:1  },
  { name:"Streetwear Tees",            slug:"streetwear-tees",            cat:"fashion-wear", order:2  },
  { name:"Sweater",                    slug:"sweater",                    cat:"fashion-wear", order:3  },
  { name:"Cargo Vest",                 slug:"cargo-vest",                 cat:"fashion-wear", order:4  },
  { name:"Cargo Pants",                slug:"cargo-pants",                cat:"fashion-wear", order:5  },
  { name:"Baggy Distressed Jeans",     slug:"baggy-distressed-jeans",     cat:"fashion-wear", order:6  },
  { name:"Streetwear Acid Wash",       slug:"streetwear-acid-wash",       cat:"fashion-wear", order:7  },
  { name:"Rayon Stone Shirt",          slug:"rayon-stone-shirt",          cat:"fashion-wear", order:8  },
  { name:"Chemical Wash Hoodies",      slug:"chemical-wash-hoodies",      cat:"fashion-wear", order:9  },
  { name:"Sunfade Shirt",              slug:"sunfade-shirt",              cat:"fashion-wear", order:10 },
];
