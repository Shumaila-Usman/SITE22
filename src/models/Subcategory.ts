import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubcategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubcategorySchema = new Schema<ISubcategory>(
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

// slug must be unique within a category
SubcategorySchema.index({ slug: 1, categoryId: 1 }, { unique: true });

const Subcategory: Model<ISubcategory> =
  mongoose.models.Subcategory ??
  mongoose.model<ISubcategory>("Subcategory", SubcategorySchema);

export default Subcategory;
