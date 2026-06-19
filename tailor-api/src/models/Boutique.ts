import mongoose, { Schema, Document } from "mongoose";

export interface IBoutique extends Document {
  name: string;
  owner: mongoose.Schema.Types.ObjectId;
  tailorType?: "gents" | "ladies" | "both";
  shopPhoto?: string;
  dailyOrderLimit: number;
  createdAt: Date;
}

const boutiqueSchema = new Schema<IBoutique>(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tailorType: {
      type: String,
      enum: ["gents", "ladies", "both"],
    },
    shopPhoto: String,
    dailyOrderLimit: {
      type: Number,
      default: 15,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBoutique>("Boutique", boutiqueSchema);
