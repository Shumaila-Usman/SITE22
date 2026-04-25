import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUploadedDesign extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  designTitle: string;
  productType: "jersey" | "shirt" | "trouser" | "tracksuit" | "hoodie" | "sportswear-set" | "other";
  fileUrl: string;
  fileType: string;
  fileName: string;
  quantity: number;
  preferredFabric?: string;
  preferredColors?: string;
  sizeRange?: string;
  customizationNotes?: string;
  country?: string;
  companyName?: string;
  additionalMessage?: string;
  inquiryStatus: "draft" | "sent" | "reviewed" | "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const UploadedDesignSchema = new Schema<IUploadedDesign>(
  {
    userId:               { type: Schema.Types.ObjectId, ref: "User", required: true },
    designTitle:          { type: String, required: true, trim: true },
    productType:          {
      type: String,
      enum: ["jersey", "shirt", "trouser", "tracksuit", "hoodie", "sportswear-set", "other"],
      required: true,
    },
    fileUrl:              { type: String, required: true },
    fileType:             { type: String, required: true },
    fileName:             { type: String, required: true },
    quantity:             { type: Number, required: true, min: 50 },
    preferredFabric:      { type: String, trim: true },
    preferredColors:      { type: String, trim: true },
    sizeRange:            { type: String, trim: true },
    customizationNotes:   { type: String, trim: true },
    country:              { type: String, trim: true },
    companyName:          { type: String, trim: true },
    additionalMessage:    { type: String, trim: true },
    inquiryStatus:        {
      type: String,
      enum: ["draft", "sent", "reviewed", "in_progress", "completed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

UploadedDesignSchema.index({ userId: 1, createdAt: -1 });

const UploadedDesign: Model<IUploadedDesign> =
  mongoose.models.UploadedDesign ??
  mongoose.model<IUploadedDesign>("UploadedDesign", UploadedDesignSchema);

export default UploadedDesign;
