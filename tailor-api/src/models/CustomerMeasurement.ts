import mongoose, { Schema, Document } from "mongoose";

const CustomMeasurementSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    imageUrl: String,
  },
  { _id: false }
);

const MeasurementsSchema = new Schema(
  {
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
      fullLength: String,
      topLength: String,
      bottomlength: String,
      ankle: String,
      bust: String,
      underBust: String,
      thigh: String,
      calf: String,
      crotchDepth: String,
      inseam: String,
      frontNeckDepth: String,
      backNeckDepth: String,
      flare: String,
    },
    custom: [CustomMeasurementSchema],
  },
  { _id: false }
);

export interface ICustomerMeasurement extends Document {
  customer: mongoose.Schema.Types.ObjectId;
  name?: string;
  measurements: any;
  version: number;
  isDefault?: boolean;
  createdBy?: mongoose.Schema.Types.ObjectId;
}

const customerMeasurementSchema = new Schema<ICustomerMeasurement>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    name: { type: String },
    measurements: MeasurementsSchema,
    version: { type: Number, default: 1 },
    isDefault: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomerMeasurement>("CustomerMeasurement", customerMeasurementSchema);
