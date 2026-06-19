import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOutfit extends Document {
  name: string;
  image?: string;
  isDefault: boolean;
  createdBy?: mongoose.Types.ObjectId;
  boutique: mongoose.Types.ObjectId;
}

const OutfitSchema = new Schema<IOutfit>(
  {
    name: { type: String, required: true },
    image: { type: String },
    isDefault: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    boutique: { type: Schema.Types.ObjectId, ref: "Boutique", required: true },
  },
  { timestamps: true }
);

const Outfit: Model<IOutfit> =
  mongoose.models.Outfit || mongoose.model<IOutfit>("Outfit", OutfitSchema);

export default Outfit;
