import mongoose, { Schema, Document, Model } from "mongoose";

interface ICustomMeasurement {
  name: string;
  size: string;
  imageUrl?: string;
}

interface IMeasurements {
  defaults?: {
    chest?: string;
    waist?: string;
    hip?: string;
    shoulder?: string;
    neck?: string;
    sleeveLength?: string;
    wrist?: string;
    armhole?: string;
    hipCircumference?: string;
    kneeCircumference?: string;
    bottomlength?: string;
    ankle?: string;
  };
  custom?: ICustomMeasurement[];
}

export interface IOutfit extends Document {
  name: string;
  image?: string;
  isDefault: boolean;
  createdBy?: mongoose.Types.ObjectId;
  measurements?: IMeasurements;
  boutique: mongoose.Types.ObjectId;
}

const CustomMeasurementSchema = new Schema<ICustomMeasurement>({
  name: String,
  size: String,
  imageUrl: String,
});

const MeasurementsSchema = new Schema<IMeasurements>({
  defaults: {
    chest: String,
    waist: String,
    hip: String,
    shoulder: String,
    neck: String,
    sleeveLength: String,
    wrist: String,
    armhole: String,
    hipCircumference: String,
    kneeCircumference: String,
    bottomlength: String,
    ankle: String,
  },
  custom: [CustomMeasurementSchema],
});

const OutfitSchema = new Schema<IOutfit>(
  {
    name: { type: String, required: true },
    image: { type: String },
    isDefault: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    measurements: MeasurementsSchema,
    boutique: { type: Schema.Types.ObjectId, ref: "Boutique", required: true },
  },
  { timestamps: true }
);

const Outfit: Model<IOutfit> =
  mongoose.models.Outfit || mongoose.model<IOutfit>("Outfit", OutfitSchema);

export default Outfit;
