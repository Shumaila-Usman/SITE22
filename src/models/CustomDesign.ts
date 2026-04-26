import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomDesign extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  /** 1 = legacy SVG studio, 2 = real garment image templates */
  customizationVersion: number;
  imageTemplateId?: string;
  imageGarmentCategory?: string;
  templatePreviewPath?: string;
  productTemplate: "jersey" | "shirt" | "trouser" | "tracksuit" | "hoodie" | "shorts";
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  sleeveColor: string;
  collarColor: string;
  stripeColor: string;
  logoUrl?: string;
  customText?: string;
  customNumber?: string;
  logoPosition: "chest" | "back" | "sleeve" | "none";
  fabricPattern: string;
  designConfig: Record<string, unknown>;
  previewImageUrl?: string;
  inquiryStatus: "draft" | "sent" | "reviewed" | "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const CustomDesignSchema = new Schema<ICustomDesign>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, default: "My Design" },
    customizationVersion: { type: Number, default: 1 },
    imageTemplateId: { type: String, trim: true },
    imageGarmentCategory: { type: String, trim: true },
    templatePreviewPath: { type: String, trim: true },
    productTemplate: {
      type: String,
      enum: ["jersey", "shirt", "trouser", "tracksuit", "hoodie", "shorts"],
      required: true,
      default: "hoodie",
    },
    primaryColor: { type: String, default: "#EF4444" },
    secondaryColor: { type: String, default: "#FFFFFF" },
    accentColor: { type: String, default: "#1a1a1a" },
    sleeveColor: { type: String, default: "#EF4444" },
    collarColor: { type: String, default: "#1a1a1a" },
    stripeColor: { type: String, default: "#FFFFFF" },
    logoUrl: { type: String },
    logoPosition: {
      type: String,
      enum: ["chest", "back", "sleeve", "none"],
      default: "chest",
    },
    customText: { type: String, trim: true },
    customNumber: { type: String, trim: true },
    fabricPattern: { type: String, default: "solid" },
    designConfig: { type: Schema.Types.Mixed, default: {} },
    previewImageUrl: { type: String },
    inquiryStatus: {
      type: String,
      enum: ["draft", "sent", "reviewed", "in_progress", "completed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

CustomDesignSchema.index({ userId: 1, createdAt: -1 });
CustomDesignSchema.index({ customizationVersion: 1, createdAt: -1 });

const CustomDesign: Model<ICustomDesign> =
  mongoose.models.CustomDesign ??
  mongoose.model<ICustomDesign>("CustomDesign", CustomDesignSchema);

export default CustomDesign;
