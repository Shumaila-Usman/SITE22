import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  name: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId;
  subcategoryId?: mongoose.Types.ObjectId;
  shortDescription?: string;
  fullDescription?: string;
  materials?: string;
  sizes: string;
  colors: string;
  moq: number;
  price: number | null;
  currency: string;
  image: string;
  gallery: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
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

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
